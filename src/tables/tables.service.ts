import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table, TableDocument } from './schemas/table.schema';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { Order, OrderDocument } from '../orders/schemas/order.schema';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private configService: ConfigService,
  ) {}

  /**
   * Where a customer's phone should land after scanning.
   *
   * PUBLIC_APP_URL is the one the printed card depends on, so it is a single
   * origin of its own: FRONTEND_URL is a CORS allowlist and may hold several,
   * and gluing a comma-separated list into a URL produces a card nobody can
   * scan. Falls back to the first entry so an older .env still works.
   */
  private publicAppUrl(): string {
    const configured =
      this.configService.get<string>('PUBLIC_APP_URL') ||
      (this.configService.get<string>('FRONTEND_URL') || '').split(',')[0] ||
      'http://localhost:5173';

    return configured.trim().replace(/\/+$/, '');
  }

  private buildTableUrl(restaurantId: string, tableId: string): string {
    return `${this.publicAppUrl()}/menu?restaurantId=${restaurantId}&tableId=${tableId}`;
  }

  async create(createTableDto: CreateTableDto): Promise<TableDocument> {
    const restaurantId = createTableDto.restaurantId;
    const tableId = new Types.ObjectId();

    const qrCodeUrl = this.buildTableUrl(restaurantId, tableId.toString());

    const createdTable = new this.tableModel({
      _id: tableId,
      number: createTableDto.number,
      restaurantId: new Types.ObjectId(restaurantId),
      qrCodeUrl,
      sessionId: new Types.ObjectId().toString(),
      status: 'active',
    });

    return createdTable.save();
  }

  async findOne(id: string): Promise<TableDocument> {
    const table = await this.tableModel.findById(id).exec();
    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    // Tables created before sessions existed have no id yet. Give them one on
    // first read rather than shipping a migration nobody remembers to run.
    if (!table.sessionId) {
      table.sessionId = new Types.ObjectId().toString();
      await table.save();
    }

    return table;
  }

  /**
   * Ends the current seating: the table goes back to vacant and its session id
   * rotates, which is the signal every phone on that table's menu watches for.
   */
  async closeSession(id: string): Promise<TableDocument> {
    const table = await this.findOne(id);
    table.status = 'active';
    table.sessionId = new Types.ObjectId().toString();
    return table.save();
  }

  async findAllByRestaurant(restaurantId: string): Promise<TableDocument[]> {
    return this.tableModel.find({ restaurantId: new Types.ObjectId(restaurantId) }).exec();
  }

  async update(id: string, updateTableDto: UpdateTableDto): Promise<TableDocument> {
    const updatedTable = await this.tableModel
      .findByIdAndUpdate(id, updateTableDto, { new: true })
      .exec();
    if (!updatedTable) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }
    return updatedTable;
  }

  async remove(id: string): Promise<any> {
    const result = await this.tableModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }
    return { message: 'Table successfully deleted' };
  }

  async getQrCodeImage(id: string): Promise<string> {
    const table = await this.findOne(id);

    // Rebuilt from the current PUBLIC_APP_URL rather than trusted from the
    // document: tables created on a laptop carry a localhost link that no
    // customer's phone can reach, and those cards get printed and glued down.
    const target = this.buildTableUrl(
      table.restaurantId.toString(),
      table._id.toString(),
    );

    if (table.qrCodeUrl !== target) {
      table.qrCodeUrl = target;
      await table.save();
    }

    try {
      // Returns base64 data URI of the QR Code image
      return await QRCode.toDataURL(target);
    } catch {
      throw new BadRequestException('Failed to generate QR Code image');
    }
  }

  async moveTable(fromTableId: string, toTableId: string): Promise<any> {
    // 1. Verify tables exist
    const fromTable = await this.findOne(fromTableId);
    const toTable = await this.findOne(toTableId);

    if (fromTable.status !== 'occupied') {
      throw new BadRequestException('Source table is not occupied');
    }

    // 2. Transfer all active unpaid orders from source to target
    await this.orderModel.updateMany(
      {
        tableId: new Types.ObjectId(fromTableId),
        paymentStatus: 'pending',
        status: { $ne: 'cancelled' },
      },
      {
        $set: { tableId: new Types.ObjectId(toTableId) }
      }
    ).exec();

    // 3. Source table is now vacant, and whoever sat there is finished with it
    fromTable.status = 'active';
    fromTable.sessionId = new Types.ObjectId().toString();
    await fromTable.save();

    // 4. Mark target table as occupied
    toTable.status = 'occupied';
    await toTable.save();

    return {
      message: `Successfully moved orders from table ${fromTable.number} to table ${toTable.number}`,
      fromTable,
      toTable
    };
  }
}

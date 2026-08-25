import { Model } from 'mongoose';
import { TableDocument } from './schemas/table.schema';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { ConfigService } from '@nestjs/config';
import { OrderDocument } from '../orders/schemas/order.schema';
export declare class TablesService {
    private tableModel;
    private orderModel;
    private configService;
    constructor(tableModel: Model<TableDocument>, orderModel: Model<OrderDocument>, configService: ConfigService);
    create(createTableDto: CreateTableDto): Promise<TableDocument>;
    findOne(id: string): Promise<TableDocument>;
    findAllByRestaurant(restaurantId: string): Promise<TableDocument[]>;
    update(id: string, updateTableDto: UpdateTableDto): Promise<TableDocument>;
    remove(id: string): Promise<any>;
    getQrCodeImage(id: string): Promise<string>;
    moveTable(fromTableId: string, toTableId: string): Promise<any>;
}

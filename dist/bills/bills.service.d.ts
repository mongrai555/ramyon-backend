import { Model } from 'mongoose';
import { BillDocument } from './schemas/bill.schema';
import { CreateBillDto } from './dto/create-bill.dto';
import { OrderDocument } from '../orders/schemas/order.schema';
import { TablesService } from '../tables/tables.service';
export declare class BillsService {
    private billModel;
    private orderModel;
    private tablesService;
    constructor(billModel: Model<BillDocument>, orderModel: Model<OrderDocument>, tablesService: TablesService);
    checkout(createBillDto: CreateBillDto, cashierId?: string, cashierName?: string, cashierUsername?: string): Promise<BillDocument>;
    findAllByRestaurant(restaurantId: string): Promise<BillDocument[]>;
    findOne(id: string): Promise<BillDocument>;
    remove(id: string): Promise<any>;
    removeAll(restaurantId: string): Promise<any>;
}

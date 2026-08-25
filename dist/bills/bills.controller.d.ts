import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
export declare class BillsController {
    private readonly billsService;
    constructor(billsService: BillsService);
    checkout(req: any, createBillDto: CreateBillDto): Promise<import("./schemas/bill.schema").BillDocument>;
    findAllByRestaurant(restaurantId: string): Promise<import("./schemas/bill.schema").BillDocument[]>;
    findOne(id: string): Promise<import("./schemas/bill.schema").BillDocument>;
    remove(id: string): Promise<any>;
    removeAll(restaurantId: string): Promise<any>;
}

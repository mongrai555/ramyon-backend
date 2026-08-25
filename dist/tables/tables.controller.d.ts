import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
export declare class TablesController {
    private readonly tablesService;
    constructor(tablesService: TablesService);
    create(createTableDto: CreateTableDto): Promise<import("./schemas/table.schema").TableDocument>;
    moveTable(body: {
        fromTableId: string;
        toTableId: string;
    }): Promise<any>;
    findAllByRestaurant(restaurantId: string): Promise<import("./schemas/table.schema").TableDocument[]>;
    findOne(id: string): Promise<import("./schemas/table.schema").TableDocument>;
    update(id: string, updateTableDto: UpdateTableDto): Promise<import("./schemas/table.schema").TableDocument>;
    remove(id: string): Promise<any>;
    getQrCodeImage(id: string): Promise<{
        qrCodeImage: string;
    }>;
}

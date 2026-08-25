import { Document, Types } from 'mongoose';
export type BillDocument = Bill & Document;
export declare class BillItem {
    menuItemId: Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
}
export declare class Bill {
    restaurantId: Types.ObjectId;
    tableId: Types.ObjectId;
    orderIds: Types.ObjectId[];
    items: BillItem[];
    totalPrice: number;
    paymentMethod: string;
    paymentStatus: string;
    cashierId?: Types.ObjectId;
    cashierName?: string;
    cashierUsername?: string;
}
export declare const BillSchema: import("mongoose").Schema<Bill, import("mongoose").Model<Bill, any, any, any, any, any, Bill>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Bill, Document<unknown, {}, Bill, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Bill & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    restaurantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Bill, Document<unknown, {}, Bill, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bill & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tableId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Bill, Document<unknown, {}, Bill, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bill & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    orderIds?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], Bill, Document<unknown, {}, Bill, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bill & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    items?: import("mongoose").SchemaDefinitionProperty<BillItem[], Bill, Document<unknown, {}, Bill, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bill & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalPrice?: import("mongoose").SchemaDefinitionProperty<number, Bill, Document<unknown, {}, Bill, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bill & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paymentMethod?: import("mongoose").SchemaDefinitionProperty<string, Bill, Document<unknown, {}, Bill, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bill & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paymentStatus?: import("mongoose").SchemaDefinitionProperty<string, Bill, Document<unknown, {}, Bill, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bill & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cashierId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Bill, Document<unknown, {}, Bill, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bill & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cashierName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Bill, Document<unknown, {}, Bill, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bill & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cashierUsername?: import("mongoose").SchemaDefinitionProperty<string | undefined, Bill, Document<unknown, {}, Bill, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bill & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Bill>;

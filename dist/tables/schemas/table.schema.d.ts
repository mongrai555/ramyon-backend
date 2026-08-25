import { Document, Types } from 'mongoose';
export type TableDocument = Table & Document;
export declare class Table {
    number: string;
    restaurantId: Types.ObjectId;
    qrCodeUrl: string;
    status: string;
}
export declare const TableSchema: import("mongoose").Schema<Table, import("mongoose").Model<Table, any, any, any, any, any, Table>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Table, Document<unknown, {}, Table, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Table & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    number?: import("mongoose").SchemaDefinitionProperty<string, Table, Document<unknown, {}, Table, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Table & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    restaurantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Table, Document<unknown, {}, Table, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Table & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qrCodeUrl?: import("mongoose").SchemaDefinitionProperty<string, Table, Document<unknown, {}, Table, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Table & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Table, Document<unknown, {}, Table, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Table & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Table>;

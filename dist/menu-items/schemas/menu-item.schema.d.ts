import { Document, Types } from 'mongoose';
export type MenuItemDocument = MenuItem & Document;
export declare class MenuItem {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    category: Types.ObjectId;
    restaurantId: Types.ObjectId;
}
export declare const MenuItemSchema: import("mongoose").Schema<MenuItem, import("mongoose").Model<MenuItem, any, any, any, any, any, MenuItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MenuItem, Document<unknown, {}, MenuItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    imageUrl?: import("mongoose").SchemaDefinitionProperty<string, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isAvailable?: import("mongoose").SchemaDefinitionProperty<boolean, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    restaurantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MenuItem>;

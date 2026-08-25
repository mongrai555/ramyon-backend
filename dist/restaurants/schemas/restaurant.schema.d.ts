import { Document } from 'mongoose';
export type RestaurantDocument = Restaurant & Document;
export declare class Restaurant {
    name: string;
    description: string;
    address: string;
    contactNumber: string;
    logoUrl: string;
}
export declare const RestaurantSchema: import("mongoose").Schema<Restaurant, import("mongoose").Model<Restaurant, any, any, any, any, any, Restaurant>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Restaurant, Document<unknown, {}, Restaurant, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Restaurant & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Restaurant, Document<unknown, {}, Restaurant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Restaurant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Restaurant, Document<unknown, {}, Restaurant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Restaurant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Restaurant, Document<unknown, {}, Restaurant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Restaurant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contactNumber?: import("mongoose").SchemaDefinitionProperty<string, Restaurant, Document<unknown, {}, Restaurant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Restaurant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    logoUrl?: import("mongoose").SchemaDefinitionProperty<string, Restaurant, Document<unknown, {}, Restaurant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Restaurant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Restaurant>;

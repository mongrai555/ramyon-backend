import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TableDocument = Table & Document;

@Schema({ timestamps: true })
export class Table {
  @Prop({ required: true })
  number: string;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;

  @Prop()
  qrCodeUrl: string;

  @Prop({ required: true, enum: ['active', 'occupied', 'inactive'], default: 'active' })
  status: string;
}

export const TableSchema = SchemaFactory.createForClass(Table);

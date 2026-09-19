import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BillDocument = Bill & Document;

@Schema()
export class BillItem {
  @Prop({ type: Types.ObjectId, ref: 'MenuItem', required: true })
  menuItemId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  price: number;
}

const BillItemSchema = SchemaFactory.createForClass(BillItem);

@Schema({ timestamps: true })
export class Bill {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Table', required: true })
  tableId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Order', required: true })
  orderIds: Types.ObjectId[];

  @Prop({ type: [BillItemSchema], required: true })
  items: BillItem[];

  @Prop({ required: true, min: 0 })
  totalPrice: number;

  @Prop({ required: true, enum: ['cash', 'promptpay', 'credit_card'], default: 'cash' })
  paymentMethod: string;

  @Prop({ required: true, enum: ['pending', 'paid'], default: 'paid' })
  paymentStatus: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  cashierId?: Types.ObjectId;

  @Prop({ required: false })
  cashierName?: string;

  @Prop({ required: false })
  cashierUsername?: string;
}

export const BillSchema = SchemaFactory.createForClass(Bill);

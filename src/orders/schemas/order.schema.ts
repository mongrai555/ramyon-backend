import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'MenuItem', required: true })
  menuItemId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ maxlength: 200 })
  specialInstructions: string;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Table', required: true })
  tableId: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ required: true, min: 0 })
  totalPrice: number;

  @Prop({
    required: true,
    enum: ['pending', 'preparing', 'served', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop({ required: true, enum: ['pending', 'paid'], default: 'pending' })
  paymentStatus: string;

  @Prop({ required: true, enum: ['cash', 'promptpay', 'credit_card'], default: 'cash' })
  paymentMethod: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

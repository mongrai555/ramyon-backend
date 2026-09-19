import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  address: string;

  @Prop()
  contactNumber: string;

  @Prop()
  logoUrl: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: ['admin', 'staff'], default: 'staff' })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;

  @Prop({ required: false })
  refreshTokenHash?: string;

  @Prop({ required: false })
  displayName?: string;

  @Prop({ required: false })
  profileImageUrl?: string;

  @Prop({ required: false })
  phoneNumber?: string;

  @Prop({ required: false })
  email?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

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

  /**
   * One seating. Rotated when the bill is paid or staff clears the table, so a
   * phone still holding the menu can tell its visit is over: the QR printed on
   * the table never changes, and without this the page has no way to know a
   * different party is now sitting there.
   */
  // No schema default on purpose: a default is re-applied every time a
  // document that lacks the field is loaded, so an old table would appear to
  // start a new seating on every single read and every phone would lock
  // itself. TablesService assigns it on create and backfills it once on read.
  @Prop()
  sessionId: string;
}

export const TableSchema = SchemaFactory.createForClass(Table);

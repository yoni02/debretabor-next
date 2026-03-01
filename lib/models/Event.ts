import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: string;
  time: string;
  type: 'liturgy' | 'study' | 'feast';
  desc: string;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    date:  { type: String, required: true }, // 'YYYY-MM-DD'
    time:  { type: String, required: true },
    type:  { type: String, enum: ['liturgy', 'study', 'feast'], required: true },
    desc:  { type: String, default: '' },
  },
  { timestamps: true }
);

const Event: Model<IEvent> =
  mongoose.models.Event ?? mongoose.model<IEvent>('Event', EventSchema);

export default Event;

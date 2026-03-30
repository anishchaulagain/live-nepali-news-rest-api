import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  url: string;
  source: string;
  fetchedAt: Date;
}

const NewsSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true, // Prevent inserting identical URLs multiple times
  },
  source: {
    type: String,
    default: 'kantipurtv.com',
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
});

export const News = mongoose.model<INews>('News', NewsSchema);

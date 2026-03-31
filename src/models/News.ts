import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  url: string;
  source: string;
  aiContent?: string;
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
    required: true,
  },
  aiContent: {
    type: String,
    required: false,
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
});

export const News = mongoose.model<INews>('News', NewsSchema);

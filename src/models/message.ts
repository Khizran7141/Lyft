import mongoose, { Schema, Document, mongo } from 'mongoose';

export interface IMessage extends Document {
  token: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  device: string;
  title: string;
  message: string;
  type: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  token: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  device: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    default: 'message'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);

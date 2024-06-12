import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  status: Number,
  token: mongoose.Types.ObjectId;
  name: string;
  users: mongoose.Types.ObjectId[];
}

const GroupSchema: Schema = new Schema({
  status: {
    type: Number,
    required: true,
    default: 1
  },
  token:{
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  users: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
  }],
});

export const Group = mongoose.model<IGroup>('Group', GroupSchema);

// src/models/Channel.ts
import mongoose, { Schema, Document, mongo } from 'mongoose';
import { User } from './Users';
import { Message } from './message';

export interface IChannel extends Document {
  groupId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
}

const ChannelSchema: Schema = new Schema({
    groupId: {
        type: mongoose.Types.ObjectId,
        ref: "Group",
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
});

export const Channel = mongoose.model<IChannel>('Channel', ChannelSchema);

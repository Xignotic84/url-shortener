import {model, Schema, models} from 'mongoose'

const MessageSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    unique: true,
    required: true
  },
  expirationDate: {
    type: Date,
    default: "Never"
  },
  createdTimestamp: {
    type: Date,
    required: true,
    default: Date.now
  }
})

export const Message = models.url || model('url', MessageSchema);


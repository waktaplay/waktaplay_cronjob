import { Mongoose } from 'mongoose'

const mongoose = new Mongoose()

mongoose.connect(/* URL */)

const ThisWeek = mongoose.model(
  'ThisWeek',
  new mongoose.Schema({
    type: {
      // 0 : normal, 1 : new
      type: Number,
      required: true,
    },
    title: {
      simple: {
        type: String,
        required: true,
      },
      original: {
        type: String,
        required: true,
      },
    },
    videos: {
      video: {
        type: String,
        required: true,
      },
      reaction: String || null,
    },
    uploadDate: {
      type: Date,
      required: true,
    },
  }),
)

export default ThisWeek

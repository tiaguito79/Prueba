import mongoose, { Schema, model, models } from "mongoose"

const AdSchema = new Schema(
  {
    title: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], default: "image" },
    isActive: { type: Boolean, default: true },
    campusId: { type: Schema.Types.ObjectId, ref: "campuses", default: null },
    totemId: { type: Schema.Types.ObjectId, ref: "totems", default: null },
    durationSeconds: { type: Number, default: 10 },
  },
  { timestamps: true, collection: "ads" }
)

const Ad = models.Ad || model("Ad", AdSchema)

export default Ad

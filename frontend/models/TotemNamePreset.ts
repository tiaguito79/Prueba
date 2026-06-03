import { Schema, model, models } from "mongoose"

const TotemNamePresetSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    prefix: { type: String, required: true, trim: true, uppercase: true },
    sedeId: {
      type: String,
      required: true,
      enum: ["cochabamba", "santa-cruz", "la-paz"],
    },
  },
  { timestamps: true, collection: "totem_name_presets" }
)

TotemNamePresetSchema.index({ sedeId: 1, prefix: 1 }, { unique: true })

const TotemNamePresetModel =
  models.TotemNamePreset ||
  model("TotemNamePreset", TotemNamePresetSchema, "totem_name_presets")

export default TotemNamePresetModel

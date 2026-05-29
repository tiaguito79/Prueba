import mongoose, { Schema, model, models } from "mongoose"

const FaqSchema = new Schema(
  {
    title: { type: String, required: true },
    campusId: { type: Schema.Types.ObjectId, ref: "campuses", default: null },
    totemId: { type: Schema.Types.ObjectId, ref: "totems", default: null },
    documentId: { type: Schema.Types.ObjectId, ref: "documents" },
    pdfFileId: { type: Schema.Types.ObjectId, required: false },
    pdfCloudinaryPublicId: { type: String },
    pdfUrl: { type: String },
    items: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "faqs" }
)

const Faq = models.Faq || model("Faq", FaqSchema)

export default Faq

import mongoose, { Schema, model, models } from "mongoose"

const DocumentSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, default: "faq_pdf" },
    fileId: { type: Schema.Types.ObjectId, required: true },
    mimeType: { type: String, default: "application/pdf" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "admins", default: null },
    extractedText: { type: String, default: "" },
  },
  { timestamps: true, collection: "documents" }
)

const DocumentModel = models.Document || model("Document", DocumentSchema)

export default DocumentModel

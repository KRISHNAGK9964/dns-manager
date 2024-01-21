import mongoose, { Schema, models } from "mongoose";

const recordSchema = new Schema(
  {
    domainId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    timeLimit: {
      type: Number,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DNSRecord = models.DNSRecord || mongoose.model("DNSRecord", recordSchema);
export default DNSRecord;

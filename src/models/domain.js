import mongoose, { Schema, models } from "mongoose";

const domainSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Domain =models.Domain || mongoose.model("Domain",domainSchema)
export default Domain
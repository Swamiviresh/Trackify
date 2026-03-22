import mongoose, { Schema, Document } from "mongoose";

export interface IDebt extends Document {
  userId: mongoose.Types.ObjectId;
  friendName: string;
  amount: number;
  type: "lent" | "borrowed";
  status: "pending" | "settled";
  date: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const DebtSchema = new Schema<IDebt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    friendName: {
      type: String,
      required: [true, "Friend name is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      enum: ["lent", "borrowed"],
      required: [true, "Type is required"],
    },
    status: {
      type: String,
      enum: ["pending", "settled"],
      default: "pending",
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Debt ||
  mongoose.model<IDebt>("Debt", DebtSchema);

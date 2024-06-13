const { Schema } = require("mongoose");
const { default: mongoose } = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    payableAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "BDT",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      default: "none",
    },
    number: {
      type: String,
      required: true,
      default: "123456789",
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Books",
    },
    eventId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Events",
    },
    paidStatus: {
      type: Boolean,
      default: false,
      required: true,
    },
    transactionID: {
      type: Number,
      required: true,
      default: 12345679,
    },
    withoutpayment: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

const Payments = mongoose.model("payments", bookingSchema);
module.exports = Payments;

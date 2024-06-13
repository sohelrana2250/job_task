const { Schema } = require("mongoose");
const { default: mongoose } = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      required: [true, "User is Required"],
      ref: "Events",
    },
    name: {
      type: String,
      required: true, // Example of a required field
    },
    email: {
      type: String,
      required: true,
    },
    paymentstatus: {
      type: Boolean,
      default: false,
      required: true,
    },
    price: {
      type: Number,
      required: false,
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

const Books = mongoose.model("book", bookingSchema);
module.exports = Books;

const { default: mongoose } = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true, // The event name is required
    },
    name: {
      type: String,
      required: true, // The name is required
    },
    startingDate: {
      type: Date,
      required: true, // The starting date is required
    },
    endingDate: {
      type: Date,
      required: true, // The ending date is required
    },
    photo: {
      type: String,
      required: true, // The photo URL is required
      validate: {
        validator: function (v) {
          return /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/.test(v); // Simple URL validation
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    availableTickets: {
      type: Number,
      required: true, // The number of available tickets is required
      min: [0, "Available tickets cannot be negative"], // Tickets cannot be negative
    },
    createdAtBy: {
      type: String,
      required: true,
    },
    eventdescription: {
      type: String,
      required: true,
      min: [5, "Available tickets cannot be negative"],
      max: [250, "Maximun 250 word Availbale Limit"],
    },
    eventAddress: {
      type: String,
      required: true,
    },
    payableTicket: {
      type: Number,
      required: true, // The number of available tickets is required
      min: [0, "Available tickets cannot be negative"], // Tickets cannot be negative
    },
    freeTicket: {
      type: Number,
      required: true, // The number of available tickets is required
      min: [0, "Available tickets cannot be negative"], // Tickets cannot be negative
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

const Events = mongoose.model("Event", eventSchema);

module.exports = Events;

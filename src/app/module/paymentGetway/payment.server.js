const { default: mongoose } = require("mongoose");
const Events = require("../event/event.model");
const Books = require("../Book/book.model");
const Payments = require("./payment.model");

const createOrder = async (payload) => {
  const eventData = await Events.findOne(
    { _id: payload.eventId },
    { _id: 1, availableTickets: 1, payableTicket: 1 }
  );

  if (!eventData) {
    throw new Error("Event not found");
  }

  const availableTickets = eventData.availableTickets - 1;
  const payableTicket = eventData.payableTicket - 1;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updateEvent = await Events.findOneAndUpdate(
      { _id: payload.eventId },
      {
        $set: {
          availableTickets: availableTickets,
          payableTicket: payableTicket,
        },
      },
      { new: true, session: session } // Ensure the session is passed here
    );

    if (!updateEvent) {
      throw new Error("Failed to update event");
    }

    const paymentStatment = await Payments.create([payload], { session });

    if (!paymentStatment.length) {
      throw new Error("Failed to Payment Create statement");
    }
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      payment: paymentStatment,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const successPayment = async (tranId) => {
  const isExisttranId = await Payments.findOne(
    {
      transactionID: Number(tranId),
    },
    {
      paidStatus: 1,

      bookingId: 1,
    }
    // started transaction rollback
  );

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const bookingStatement = await Books.findOneAndUpdate(
      { _id: isExisttranId.bookingId },
      {
        $set: {
          paymentstatus: true,
        },
      },
      { new: true, session: session } // Ensure the session is passed here
    );

    if (!bookingStatement) {
      throw new Error("Failed to update booking statement");
    }

    // payment collection
    const paymentStatment = await Payments.findOneAndUpdate(
      { _id: isExisttranId._id },
      {
        $set: {
          paidStatus: true,
        },
      },
      { new: true, session: session } // Ensure the session is passed here
    );
    if (!paymentStatment) {
      throw new Error("Failed to Payment Collection statement");
    }
    await session.commitTransaction();
    session.endSession();
    return `http://localhost:5173/payment/success/${tranId}`;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failedPayment = async (tranId) => {
  const isExisttranId = await Payments.findOne(
    {
      transactionID: Number(tranId),
    },
    {
      eventId: 1,
    }
  );

  if (!isExisttranId) {
    throw new Error("Transaction ID not found");
  }

  const eventData = await Events.findOne(
    { _id: isExisttranId.eventId },
    { _id: 1, availableTickets: 1, payableTicket: 1 }
  );

  if (!eventData) {
    throw new Error("Event not found");
  }

  const availableTickets = eventData.availableTickets + 1;
  const payableTicket = eventData.payableTicket + 1;

  // start transaction rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updateEvent = await Events.findOneAndUpdate(
      { _id: isExisttranId.eventId },
      {
        $set: {
          availableTickets: availableTickets,
          payableTicket: payableTicket,
        },
      },
      { new: true, session: session } // Ensure the session is passed here
    );

    if (!updateEvent) {
      throw new Error("Failed to payment collection update event");
    }

    // delete payment
    const deletePaymentStatment = await Payments.deleteOne(
      {
        transactionID: Number(tranId),
      },
      { session: session } // Ensure the session is passed here
    );

    if (deletePaymentStatment.deletedCount === 0) {
      throw new Error("Failed to delete payment collection");
    }

    await session.commitTransaction();
    session.endSession();
    return `http://localhost:5173/payment/fail/${tranId}`;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const withoutPaymentGetway = async (payload) => {
  const eventData = await Events.findOne(
    { _id: payload.eventId },
    { _id: 1, availableTickets: 1, freeTicket: 1 }
  );
  const freeTicket = eventData.freeTicket - 1;
  const availableTickets = eventData.availableTickets - 1;
  // start transaction rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updateEvent = await Events.findOneAndUpdate(
      { _id: payload.eventId },
      {
        $set: {
          availableTickets: availableTickets,
          freeTicket: freeTicket,
        },
      },
      { new: true, session: session } // Ensure the session is passed here
    );
    if (!updateEvent) {
      throw new Error("Failed to event collection freeTickent Section");
    }
    // started booking
    const bookingStatment = await Books.findOneAndUpdate(
      { _id: payload.bookingId },
      { $set: { withoutpayment: true } },
      { new: true, session: session }
    );
    if (!bookingStatment) {
      throw new Error("Failed to Booking collection without payment field");
    }

    await session.commitTransaction();
    session.endSession();
    return bookingStatment;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const cancelEventWithoutPayment = async (payload) => {
  const eventData = await Events.findOne(
    { _id: payload.eventId },
    { _id: 1, availableTickets: 1, freeTicket: 1 }
  );
  const freeTicket = eventData.freeTicket + 1;
  const availableTickets = eventData.availableTickets + 1;
  // start transaction rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updateEvent = await Events.findOneAndUpdate(
      { _id: payload.eventId },
      {
        $set: {
          availableTickets: availableTickets,
          freeTicket: freeTicket,
        },
      },
      { new: true, session: session } // Ensure the session is passed here
    );
    if (!updateEvent) {
      throw new Error("Failed to event collection freeTickent Section");
    }
    // started booking
    const bookingStatment = await Books.deleteOne(
      { _id: payload.bookingId },
      { new: true, session: session }
    );
    if (!bookingStatment) {
      throw new Error("Failed to Booking collection without payment field");
    }
    // delete payment stetment

    await session.commitTransaction();
    session.endSession();
    return bookingStatment;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  createOrder,
  successPayment,
  failedPayment,
  withoutPaymentGetway,
  cancelEventWithoutPayment,
};

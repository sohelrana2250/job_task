const express = require("express");
const cors = require("cors");
const app = express();
const port = 3052;
require("dotenv").config();
const mongoose = require("mongoose");
const SSLCommerzPayment = require("sslcommerz-lts");
const {
  createUserIntoDb,
  findUser,
} = require("./src/app/module/user/user.server");
const createUserValidationSchema = require("./src/app/module/user/user.validation");
const { createToken, verifyToken } = require("./src/app/middlewee/auth");
const {
  eventZodSchema,
  updateeventZodSchema,
} = require("./src/app/module/event/event.validation");
const {
  createEventIntoDb,
  findSpecificEventIntoDb,
  updateEvenetFromDb,
  deleteEvenetFromDb,
  findAllEventIntoDb,
} = require("./src/app/module/event/event.server");
const bookingZodSchema = require("./src/app/module/Book/book.validation");
const {
  bookingEventIntoDb,
  mybookingIntoDb,
  deleteMyBooking,
} = require("./src/app/module/Book/book.server");
const {
  paymentGetWay,
} = require("./src/app/module/paymentGetway/payment.paymentGetWay");
const paymentZodSchema = require("./src/app/module/paymentGetway/payment.validation");
const {
  createOrder,
  successPayment,
  failedPayment,
  withoutPaymentGetway,
  cancelEventWithoutPayment,
} = require("./src/app/module/paymentGetway/payment.server");

async function main() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("database successfully conntected");
  } catch (error) {
    console.log(error);
  }

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main().catch((err) => console.log(err));

// username:event_management
//password:9loeH1KSyJK3o3Nl

//ssl commerz functionality
const store_id = process.env.STORE_ID;
const store_password = process.env.STORE_PASSWORD;
const is_live = false; //true for live, false for sandbox

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// testing purpose
app.post("/post", async (req, res) => {
  const payload = req.body;
  const validation = await createUserValidationSchema.parseAsync(payload);
  const result = await createUserIntoDb(validation);
  res.send(result);
});

app.post("/user", async (req, res) => {
  const user = req.body;
  const token = createToken(user);
  const email = user?.email;
  const isUserExist = await findUser(email);
  if (isUserExist?._id) {
    return res.send({
      statu: "success",
      message: "Login success",
      token,
    });
  }
  const validation = await createUserValidationSchema.parseAsync(user);
  await createUserIntoDb(validation);
  return res.send({ message: "Account Create Successfully", token });
});

app.post("/available_event", verifyToken, async (req, res) => {
  const payload = req.body;
  const addedPayload = { createdAtBy: req.user, ...payload };

  const validation = await eventZodSchema.parseAsync(addedPayload);
  const result = await createEventIntoDb(validation);
  res.send({ message: "Successfully Created", status: true, data: result });
});

app.get("/specific_event/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const result = await findSpecificEventIntoDb(id);
  res.send({
    message: "Specific Event Get Successfully",
    status: true,
    data: result,
  });
});
app.get("/all_event", async (req, res) => {
  const result = await findAllEventIntoDb();
  res.send({
    message: "Get All Events",
    status: true,
    data: result,
  });
});
app.patch("/update_event/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const addedPayload = { createdAtBy: req.user, ...payload };
  const validation = await updateeventZodSchema.parseAsync(addedPayload);
  const result = await updateEvenetFromDb(id, validation);
  res.send({
    message: "Event Update Successfully",
    status: true,
    data: result,
  });
});
app.delete("/delete_event/:id", async (req, res) => {
  const { id } = req.params;
  const email = req.user;
  const result = await deleteEvenetFromDb(id, email);
  res.send({
    message: "Event Delete Successfully",
    status: true,
    data: result,
  });
});

// booking  started
app.post("/booking", verifyToken, async (req, res) => {
  const payload = req.body;
  const email = req.user;
  const validation = await bookingZodSchema.parseAsync({ email, ...payload });
  const result = await bookingEventIntoDb(validation);

  res.send({
    message: "Successfully Booked",
    status: true,
    data: result,
  });
});

app.get("/mybooking", verifyToken, async (req, res) => {
  const email = req.user;
  const result = await mybookingIntoDb(email);
  res.send({
    message: "My Booking List",
    status: true,
    data: result,
  });
});
app.delete("/deletemy_booking/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const email = req.user;
  const result = await deleteMyBooking(id, email);
  res.send({
    message: "Successfully Deleted My Booking",
    status: true,
    data: result,
  });
});

// payment getway
app.post("/order", async (req, res) => {
  const tran_id = new Date().getTime();

  const payload = req.body;
  const productData = await paymentZodSchema.parseAsync(payload);

  const data = paymentGetWay(productData, tran_id);
  const sslcz = new SSLCommerzPayment(store_id, store_password, is_live);

  const finalOrder = {
    ...productData,
    paidStatus: false,
    transactionID: tran_id,
  };
  const result = await createOrder(finalOrder);

  if (result.success && result.payment.length) {
    sslcz.init(data).then((apiResponse) => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;

      res.send({ url: GatewayPageURL });
      //  console.log('Redirecting to: ', GatewayPageURL)
    });
  }
});
app.post(`/api/v1/payment/success/:tranId`, async (req, res) => {
  const tranId = req.params.tranId;
  const result = await successPayment(tranId);
  res.redirect(result);
});
app.post("/api/v1/payment/fail/:tranId", async (req, res) => {
  const tranId = req.params.tranId;
  const result = await failedPayment(tranId);
  console.log(result);
  res.redirect(result);
});
// free status
app.post("/api/v1/withoutPayment", async (req, res) => {
  const payload = req.body;
  const result = await withoutPaymentGetway(payload);
  res.send(result);
});
app.delete("/api/v1/delete_withoutPayment", async (req, res) => {
  const payload = req.body;
  const result = await cancelEventWithoutPayment(payload);
  console.log(result);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

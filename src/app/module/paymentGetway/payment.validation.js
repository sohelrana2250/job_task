const { z } = require("zod");

// Define the Zod schema
const paymentZodSchema = z.object({
  payableAmount: z
    .number()
    .positive("Payable amount must be a positive number"),
  currency: z.string().min(1, "Currency is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  address: z.string().min(1, "Address is required"),
  number: z.string().min(1, "Number is required"),
  bookingId: z.string(),
  eventId: z.string(),
  withoutpayment: z.boolean().default(false),
});
module.exports = paymentZodSchema;

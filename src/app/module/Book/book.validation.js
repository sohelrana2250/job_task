const { z } = require("zod");

// Define the Zod schema
const bookingZodSchema = z.object({
  eventId: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  paymentstatus: z.boolean().default(false),
  withoutpayment: z.boolean().default(false),
});
module.exports = bookingZodSchema;

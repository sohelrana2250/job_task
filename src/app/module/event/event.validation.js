const { z } = require("zod");

// Define the Zod schema
const eventZodSchema = z.object({
  event: z.string().min(1, "Event name is required"),
  name: z.string().min(1, "Name is required"),
  startingDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  endingDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  photo: z.string().url("Invalid URL format"),
  price: z.number().int(),
  availableTickets: z
    .number()
    .int()
    .min(0, "Available tickets cannot be negative"),
  createdAtBy: z.string().min(1, "Creator name is required"),
  eventdescription: z
    .string()
    .min(5, "Description must be at least 5 characters long")
    .max(250, "Description cannot exceed 250 characters"),
  eventAddress: z.string().min(1, "Event address is required"),
  payableTicket: z.number().int().min(0, "Payable tickets cannot be negative"),
  freeTicket: z.number().int().min(0, "Free tickets cannot be negative"),
  createdAtBy: z
    .string({
      required_error: "CreatedAt By is Required",
    })
    .email(),
});

const updateeventZodSchema = z
  .object({
    event: z.string().min(1, "Event name is required").optional(),
    name: z.string().min(1, "Name is required").optional(),
    startingDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), "Invalid date format")
      .optional(),
    endingDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), "Invalid date format")
      .optional(),
    photo: z.string().url("Invalid URL format").optional(),
    price: z.number().int().optional(),
    availableTickets: z
      .number()
      .int()
      .min(0, "Available tickets cannot be negative")
      .optional(),
    createdAtBy: z.string().min(1, "Creator name is required"),
    eventdescription: z
      .string()
      .min(5, "Description must be at least 5 characters long")
      .max(250, "Description cannot exceed 250 characters")
      .optional(),
    eventAddress: z.string().min(1, "Event address is required").optional(),
    payableTicket: z
      .number()
      .int()
      .min(0, "Payable tickets cannot be negative")
      .optional(),
    freeTicket: z
      .number()
      .int()
      .min(0, "Free tickets cannot be negative")
      .optional(),
  })
  .optional();

module.exports = {
  eventZodSchema,
  updateeventZodSchema,
};

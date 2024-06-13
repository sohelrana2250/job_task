const { z } = require("zod");
const createUserValidationSchema = z.object({
  name: z.string({ invalid_type_error: "name is required" }),
  role: z.enum(["user", "admin"]).default("user"),
  email: z.string({ invalid_type_error: "email is required" }).email(),
  AccountcreateAt: z.string({
    required_error: "Account creation date is required",
  }),
  photo: z
    .string()
    .url()
    .default(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1025px-Cat03.jpg"
    ),
});

module.exports = createUserValidationSchema;

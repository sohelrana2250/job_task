const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Example of a required field
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Example of an enum for predefined roles
      default: "user", // Default value if none is provided
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email should be unique
    },
    AccountcreateAt: {
      type: String, // Assuming this should be a date field
      required: true,
    },
    photo: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1025px-Cat03.jpg", // Default photo if none is provided
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

const Users = mongoose.model("User", userSchema);
module.exports = Users;

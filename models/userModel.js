import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema(
  {
    indexNumber: {
      type: String,
      required: true,
      unique: true, // Ensures each student has a unique identifier
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@stu.cmb.ac.lk$/,
        "Invalid student email address",
      ], // Ensures valid student email format
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    mailingAddress: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    yearOfStudy: {
      type: String,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Other"],
      required: true,
    },
    departmentOfStudy: {
      type: String,
      required: true,
    },
    academicAdvisor: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Student", "admin", "Staff"], // Restrict roles to predefined options
      default: "Student", // Default role is "Student"
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the document
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare the entered password with the stored hashed password
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Student = mongoose.model("Student", studentSchema);

export default Student;

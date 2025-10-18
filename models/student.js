import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true, 
    unique: true
  },
  password: {
    type: String,
    required: true, 
    minlength: 8
  },
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
  },
  resetToken: String,
  resetTokenExpiry: Date

});

const Student = mongoose.model("Student", StudentSchema);

export default Student
import mongoose, {Schema, models} from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
    unique: false
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  }
}, {timestamps: true});

const User = models.User || mongoose.model("User", userSchema);

export default User;


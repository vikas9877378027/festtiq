import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: function() {
        return !this.oauthProvider; // Phone not required for OAuth users
      },
      unique: true,
      sparse: true, // Allow null values for OAuth users
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    oauthProvider: {
      type: String,
      enum: ['google', 'facebook', 'apple', 'auth0', null],
      default: null,
    },
    oauthUid: {
      type: String,
      default: null,
    },
    favorites: {
      type: [String], // Array of product/venue IDs
      default: [],
    },
    cartItems: { type: Object, default: {} },
  },
  { minimize: false, timestamps: true }
);

const User = mongoose.model.User|| mongoose.model("User", userSchema);
export default User;
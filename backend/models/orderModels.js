import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: String, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    customerDetails: {
      fullName: { type: String, required: true },
      phoneNo: { type: Number, required: true },
      course: { type: String, required: true },
      address: { type: String, required: true },
    },
    totalPrice: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isDelivered: { type: Boolean, default: false },
    isFailed: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);

export default Order;

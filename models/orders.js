const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orderitem"
    }],
    shippingAddress: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: "user"
    },
    dateOrderd: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);
const httpStatusText = require("../utils/httpStatusText");

const orderSchema = require("../models/orders");
const orderItemSchema = require("../models/orderItems");

const getOrders = async (req, res) => {
    try {
        const orders = await orderSchema.find({}, { "__v": 0 }).populate("orderItems").populate({
            path: "user",
            select: "name role",
        });
        const count = await orderSchema.countDocuments();
        res.status(200).json({ status: httpStatusText.SUCCESS, data: { "count": count, orders } });
    }
    catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

const getSingleOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderSchema.findById(orderId, { "__v": 0 }).populate("orderItems").populate({
            path: "user",
            select: "name role",
        });

        if (!order) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Order not found" });
        }

        res.status(200).json({ status: httpStatusText.SUCCESS, data: order });
    }
    catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

const addOrder = async (req,res) => {
    try{
        const { orderItems, shippingAddress, phone, user } = req.body

        if (!orderItems || orderItems.length === 0) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Order items are required" });
        }

        const orderItemsIds = await Promise.all(
            orderItems.map(item =>
                orderItemSchema.create({
                    product: item.product,
                    quantity: item.quantity,
                }).then(orderItem => orderItem._id)
            )
        );

        const order = new orderSchema({
            orderItems: orderItemsIds,
            shippingAddress,
            phone,
            user,
        });
        await order.save();

        if (!order) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Failed to create order" });
        }
        res.status(201).json({ status: httpStatusText.SUCCESS, message: "Order created successfully", data: order });
    }
    catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const updatedOrder = await orderSchema.findByIdAndUpdate(orderId, req.body, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Order not found" });
        }

        res.status(200).json({ status: httpStatusText.SUCCESS, message: "Order updated successfully", data: updatedOrder });
        }
        catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const deletedOrder = await orderSchema.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Order not found" });
        }

        res.status(200).json({ status: httpStatusText.SUCCESS, message: "Order deleted successfully", data: null });
    }
    catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.id;
        const count = await orderSchema.countDocuments({user: userId});
        const orders = await orderSchema.find({ user: userId }, { "__v": 0 }).populate("orderItems").populate({
            path: "user",
            select: "name role",
        });

        if (!orders) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Orders not found for this user" });
        }

        res.status(200).json({ status: httpStatusText.SUCCESS, data: {"count": count, orders} });
    }
    catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

module.exports = {
    getOrders,
    getSingleOrder,
    addOrder,
    updateOrder,
    deleteOrder,
    getUserOrders
};

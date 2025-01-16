const controller = require("../controllers/orders.controller");

const express = require('express');
const router = express.Router();

router.route("/").get(controller.getOrders)
                .post(controller.addOrder);

router.route("/userorders/:id").get(controller.getUserOrders);

router.route("/:id").get(controller.getSingleOrder)
                    .put(controller.updateOrder)
                    .delete(controller.deleteOrder);

module.exports = router;
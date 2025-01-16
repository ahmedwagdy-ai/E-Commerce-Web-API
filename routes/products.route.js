const express = require('express');
const controller = require("../controllers/products.controller")

const router = express.Router();

router.route("/").get(controller.getProducts)
                .post(controller.addProduct);

router.route("/featured").get(controller.getFeaturedProducts);

router.route("/featured/:count").get(controller.getFeatured_Counted);

router.route("/category/:id").get(controller.getProductsByCategory);

router.route("/:id").get(controller.getSingleProduct)
                    .put(controller.updateProduct)
                    .delete(controller.deleteProduct);
                    
module.exports = router;
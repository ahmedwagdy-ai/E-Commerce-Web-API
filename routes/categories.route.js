const express = require('express');
const controller = require("../controllers/categories.controller")

const router = express.Router();

router.route("/").get(controller.getCategories)
                .post(controller.addCategory);

router.route("/:id").get(controller.getSingleCategory)
                    .put(controller.updateCategory)
                    .delete(controller.deleteCategory);                

module.exports = router;
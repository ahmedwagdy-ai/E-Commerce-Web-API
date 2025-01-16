const express = require('express');

const httpStatusText = require("../utils/httpStatusText")
const controller = require("../controllers/users.controller");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");

const multer  = require('multer')

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];  // getting the extension of the file
        const fileName = `user-${Date.now()}.${ext}`; 
        cb(null,fileName)
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if (imageType === 'image') {
        return cb(null, true);
    } else {
        return cb("Only image files are allowed!", false);
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter
})

const router = express.Router();

router.route("/").get(verifyToken, controller.getUsers);

router.route("/:id").get(controller.getSingleUser)
                    .delete(verifyToken, allowedTo("admin"), controller.deleteUser);

router.route("/register").post(upload.single("profilePicture"), controller.register);
router.route("/login").post(controller.login);

module.exports = router;


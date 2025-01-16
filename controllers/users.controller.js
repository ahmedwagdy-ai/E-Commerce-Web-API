const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/users");
const httpStatusText = require("../utils/httpStatusText");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const getUsers = async (req, res) => {
    try {
        const users = await userSchema.find({}, { "password": 0, "__v": 0 });
        const count = await userSchema.countDocuments();
        res.status(200).json({ status: httpStatusText.SUCCESS, data: { "count": count, users } });
    }
    catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
};

const getSingleUser = async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await userSchema.findById(userId, { "password": 0, "__v": 0 });

        if(!user) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "User not found" });}

        res.status(200).json({ status: httpStatusText.SUCCESS, data: user });
    }
    catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password, phone, role, address, zipcode } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userSchema({
            name,
            email,
            password: hashedPassword,
            profilePicture: req.file.filename,
            role, phone, address, zipcode
        });

        await user.save();

        if(!user) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Invalid user data" });
        }

        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" });
        user.token = token;  

        res.status(201).json({ status: httpStatusText.SUCCESS, message: "User registered successfully", data: {user, token} });
    }
    catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userSchema.findOne({ email });

        if(!user) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Invalid email!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(401).json({ status: httpStatusText.ERROR, message: "Invalid password!" });
        }

        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" });

        res.status(200).json({ status: httpStatusText.SUCCESS, message: "User logged in successfully", data: { user, token } });
    }
    catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userSchema.findByIdAndDelete(userId);

        if(!user) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "User not found" });
        }

        res.status(200).json({ status: httpStatusText.SUCCESS, message: "User deleted successfully" });
    }
    catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

module.exports = {
    getUsers,
    getSingleUser,
    register,
    login,
    deleteUser
}
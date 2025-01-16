const jwt = require("jsonwebtoken");

const httpStatusText = require("../utils/httpStatusText");

const verifyToken = (req, res, next) => {

    const authHeader = req.headers["authorization"] || req.headers["Authorization"];

    if (!authHeader) {
        return res.status(401).json({ status: httpStatusText.ERROR, message: "No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;

        next();
    }
    catch (err) {
        return res.status(403).json({ status: httpStatusText.FAIL, message: "Invalid token" });
    }
}

module.exports = verifyToken;
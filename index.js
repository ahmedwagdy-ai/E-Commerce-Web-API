require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
})

const productsRouter = require("./routes/products.route"); 
const categoriesRouter = require("./routes/categories.route");
const ordersRouter = require("./routes/orders.route");
const usersRouter = require("./routes/users.route");

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(express.json());
app.use(cors());

app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);


app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
const httpStatusText = require("../utils/httpStatusText")
const productSchema = require("../models/products")
const categorySchema = require("../models/categories");

const getProducts = async (req, res) => {
    try{
        const products = await productSchema.find({}, {"__v": false}).populate("category");
        const count = await productSchema.countDocuments();
        res.status(200).json({ status: httpStatusText.SUCCESS, data: {"count": count, products }});
    }
    catch(err) {
        res.status(400).json({ status: httpStatusText.ERROR, message: err.message });
    }
}

const getSingleProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productSchema.findById(productId, {"__v": false}).populate("category");

        if (!product) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Product not found" });
        }

        res.status(200).json({ status: httpStatusText.SUCCESS, data: product });
    }
    catch(err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

const addProduct = async (req, res) => {
    try {
        const category = await categorySchema.findById(req.body.category);
        if (!category) {
            return res.status(400).json({ status: httpStatusText.ERROR, message: "Invalid category ID" });
        }

        const product = new productSchema({
            name: req.body.name,
            image: req.body.image,
            count: req.body.count,
            discription: req.body.discription,
            richDescription: req.body.richDescription,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            count: req.body.count,
            numReviews: req.body.numReviews,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
        });

        await product.save();

        if (!product) {
            return res.status(400).json({ status: httpStatusText.ERROR, message: "Product not created" });
        }

        res.status(201).json({ status: httpStatusText.SUCCESS, message: "Product added successfully", data: product });
    }
    catch(err) {
        res.status(400).json({ status: httpStatusText.ERROR, message: err.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productSchema.findByIdAndUpdate(productId, {
            name: req.body.name,
            image: req.body.image,
            count: req.body.count,
            discription: req.body.discription,
            richDescription: req.body.richDescription,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            count: req.body.count,
            numReviews: req.body.numReviews,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
        }, { new: true });

        if (!product) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Product not found" });
        }
        res.status(200).json({ status: httpStatusText.SUCCESS, message: "Product updated successfully", data: product });
    }
    catch(err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productSchema.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Product not found" });
        }
        res.status(200).json({ status: httpStatusText.SUCCESS, message: "Product deleted successfully", data: null });
    }
    catch(err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
};

const getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await productSchema.find({ isFeatured: true }, {"__v": false}).populate("category");
        res.status(200).json({ status: httpStatusText.SUCCESS, data: featuredProducts });
    }
    catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

const getFeatured_Counted = async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 0;
        const featuredProducts = await productSchema.find({ isFeatured: true }).limit(+count);
        res.status(200).json({ status: httpStatusText.SUCCESS, data: featuredProducts });
    }
    catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

const getProductsByCategory = async (req, res) => {
    try{
        const categoryId = req.params.id;
        const products = await productSchema.find({ category: categoryId }, {"__v": false}).populate("category");

        if (!products) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Products not found in this category" });
        }

        res.status(200).json({ status: httpStatusText.SUCCESS, data: products });
    }
    catch (err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

module.exports = {
    getProducts,
    getSingleProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getFeatured_Counted,
    getProductsByCategory,
};

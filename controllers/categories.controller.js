const httpStatusText = require("../utils/httpStatusText")
const categorySchema = require("../models/categories")

const getCategories = async (req, res) => {
    try{
        const category = await categorySchema.find({}, {"__v": false});
        res.status(200).json({ status: httpStatusText.SUCCESS, data: category });
    }
    catch(err) {
        res.status(400).json({ status: httpStatusText.ERROR, message: err.message });
    }
}

const getSingleCategory = async (req, res) => {
    try{
        const categoryId = req.params.id;
        const category = await categorySchema.findById(categoryId, {"__v": false});

        if(!category) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Category not found" });}

        res.status(200).json({ status: httpStatusText.SUCCUSS, data: category });
    }
    catch(err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

const addCategory = async (req, res) => {

    try {
        const { name, color, icon } = req.body;
        const category = new categorySchema({
            name,
            color,
            icon
        });
  
        await category.save();
        res.status(201).json({ status: httpStatusText.SUCCESS, message: "Category added successfully", data: category });
    }
    catch(err) {
        res.status(400).json({ status: httpStatusText.ERROR, message: err.message });
    }
}

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, color, icon } = req.body;
        const category = await categorySchema.findByIdAndUpdate(categoryId, { name, color, icon }, { new: true });

        if(!category) {
            return res.status(404).json({ status: httpStatusText.ERROR, message: "Category not found" });}
        
        res.status(200).json({ status: httpStatusText.SUCCESS, message: "Category updated successfully", data: category });  
    }
    catch(err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
            const categoryId = req.params.id;
            const category = await categorySchema.findByIdAndDelete(categoryId);

            if(!category) {
                return res.status(404).json({ status: httpStatusText.ERROR, message: "Category not found" });}

            res.status(200).json({ status: httpStatusText.SUCCESS, message: "Category deleted successfully", data: null });
    }
    catch(err) {
        res.status(400).json({ status: httpStatusText.FAIL, message: err.message });
    }
}

module.exports = {
    getCategories,
    getSingleCategory,
    addCategory,
    updateCategory,
    deleteCategory,
}
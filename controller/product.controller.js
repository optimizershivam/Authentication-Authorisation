
const express = require("express")
const productController = express.Router();
const authorisation = require("../middlewares/authorisation")
const authentication = require("../middlewares/authentication")

productController.get("/dashboard",authentication,authorisation(["admin"]), async (req, res) => {  
    return res.send("dashboard info")
})

productController.get("/sellerdashboard",authentication,authorisation(["seller", "admin"]), async (req, res) => {  
    return res.send("dashboard info")
})

module.exports = productController;


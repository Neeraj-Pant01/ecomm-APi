const userModel = require("../models/usermodel.model")
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");


exports.registerUser = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (user) return next(createError(404, "user with this email already exists !"))

        let ciphertext = CryptoJS.AES.encrypt(req.body.password, process.env.PASSENC).toString();

        const newUser = new userModel({ ...req.body, password: ciphertext })
        await newUser.save()

        res.status(200).json(newUser)

    } catch (err) {
        next(err.message)
    }
}

exports.loginUser = async (req, res, next) => {
    try {
        // let user;
        // if(req.user.email.includes("@")){
        //     user = await userModel.findOne({ email:req.body.email})
        // }else{
        //     user = await userModel.findOne({ mobile:req.body.email})
        // }

        const user = await userModel.findOne({ email:req.body.email})

        if (!user) return next(createError(404, "user don't exist !"))

        var bytes = CryptoJS.AES.decrypt(user.password, process.env.PASSENC);
        var originalpass = bytes.toString(CryptoJS.enc.Utf8);

        if(originalpass !== req.body.password) return next(createError(400,"password didn't matched !"))

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWTKEY, { expiresIn: "1d" })

        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, token })
    } catch (err) {

    }
}
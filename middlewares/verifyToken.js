const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv')

dotEnv.config()

const secretKey = process.env.SECRET_KEY

const verifyToken = async (req, res, next) => {
    const token = req.headers.token;

    if(!token) {
        return res.status(401).json({error: "Token is required"});
    }
    try {
        const decode = jwt.verify(token, secretKey)
        const vendor = await Vendor.findById(decode.vendorId);

        if(!vendor) {
            return res.status(404).json({error: "Vendor not found"})
        }

        req.vendorId = vendor._id

        next()
    } catch(error) {
        console.log(error)
        return res.status(500).json({error: "Invalid token"});
    }
}

module.exports = verifyToken
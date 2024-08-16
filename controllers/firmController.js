const Firm = require('../models/Firm')
const Vendor = require('../models/Vendor')
const multer = require('multer')
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
    destination: './uploads/', // Folder to store uploaded files
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

const addFirm = async (req, res) => {
   try {
    const {firmName, area, category, region, offer} = req.body

    const image = req.file? req.file.filename: undefined;
    const vendor = await Vendor.findById(req.vendorId)

    if(!vendor) {
        res.status(404).json({message: 'Vendor not found'})
   }
    
    const firm  = new Firm({
    firmName, area, category, region, offer, image, vendor: vendor._id
    })

    const saveFirm  = await firm.save()
    vendor.firm.push(saveFirm)
    await vendor.save()

   } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Internal Server Error'})
   }
}

const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId;

        const deletedProduct = await Firm.findByIdAndDelete(firmId);

        if (!deletedProduct) {
            return res.status(404).json({error: "No product found"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server error"})
    }
}

module.exports = {addFirm: [upload.single('image'), addFirm], deleteFirmById}
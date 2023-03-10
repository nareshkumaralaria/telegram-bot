import mongoose from 'mongoose'
import { iphonelist_model } from '../models/iphonelist.model.js'

const dateIndia = new Date();
const Iphonelist = new mongoose.model("iphonelist", iphonelist_model);

const getIphoneList = async () => {
    try {
        const iphonelist = await Iphonelist.find({})
        return {
            iphonelist: iphonelist,
            success: true,
        }

    } catch (error) {
        console.log(error);
        return {
            message: "Network Error",
            success: false
        }
    }

}


const deleteIphone = async (asincode) => {
    try {
        const iphonelist = await Iphonelist.deleteOne({ "asin_code": asincode })
        if (iphonelist) {
            return {
                message: "iphone delete successfully",
                success: true
            }
        } else {
            console.log("err")
        }
    } catch (error) {
        console.log(error);
        return {
            message: "Network Error",
            success: false
        }
    }
}

const addIphone = async (asincode, iphonename, storagesize) => {
    try {
        const iphonelist = new Iphonelist({
            asin_code: asincode,
            iphone_name: iphonename,
            storage_size: storagesize,
            createdAt: new Date(`${dateIndia} UTC`),
            updatedAt: new Date(`${dateIndia} UTC`),
        })
        const response = await iphonelist.save()
        return {
            message: "iPhone Added Successfully",
            success: true,
            response: response,
        }
    } catch (error) {
        console.log(error)
        return {
            message: "Network Error",
            success: false,
        }
    }
}

export default getIphoneList;
export { deleteIphone, addIphone };
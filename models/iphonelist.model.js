import mongoose from 'mongoose';

export const iphonelist_model = new mongoose.Schema({
    asin_code: {
        type: String,
        require: true
    },
    iphone_name: String,
    storage_size: String,
    createdAt: Date,
    updatedAt: Date
})

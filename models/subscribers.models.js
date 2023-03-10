import mongoose from 'mongoose';

export const subscribers_model = new mongoose.Schema({
    chat_id: {
        type: String,
        require: true
    },
    first_name: String,
    last_name: String,
    createdAt: Date,
    updatedAt: Date
})

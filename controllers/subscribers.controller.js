import mongoose from 'mongoose'
import { subscribers_model } from '../models/subscribers.models.js'

const dateIndia = new Date();
const Subscriber = new mongoose.model("subscriber", subscribers_model);

const subscriber = async (formValues) => {
    try {
        const subscriber = await Subscriber.findOne({ chat_id: formValues.chat_id })
        if (subscriber) {
            return {
                message: "Already subscribed!",
                success: false,
            }
        } else {
            const subscriber = new Subscriber({
                chat_id: formValues.chat_id,
                first_name: formValues.first_name,
                last_name: formValues.last_name,
                createdAt: new Date(`${dateIndia} UTC`),
                updatedAt: new Date(`${dateIndia} UTC`)
            })

            await subscriber.save();
            return {
                message: "Subscribed",
                success: true,
                chat_id: subscriber._id
            }
        }

    } catch (error) {
        console.log(error);
        return {
            message: "Network Error",
            success: false
        }
    }

}

const getChatId = async () => {
    try {
        const subscriber = await Subscriber.find({})
        return {
            subscribers: subscriber,
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

export default subscriber;
export { getChatId };
// importing DB connection file
import "./config/database.js";
import app from "./config/app.js";
// import express from "express";
import "dotenv/config";
// import path from 'path';
// import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';
import schedule from 'node-schedule';
import axios from 'axios';
import { addIphone, deleteIphone, getChatId, getIphoneList, subscriber } from './controllers/index.js'

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(__dirname));

const PORT = process.env.PORT || 9002;

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });
bot.on("polling_error", (err) => console.log(err));

const job = schedule.scheduleJob('0 08 * * *', async () => { // This bot will send iPhone price daily at 08 AM
    const ipohnelist = await getIphoneList();
    const subscribers = await getChatId();
    if (ipohnelist.success) {
        const asincode = ipohnelist.iphonelist.map((iphone) => iphone.asin_code);
        let i = 0, j = 10;
        for (; i < asincode.length; i += 10, j += 10) {
            var ASIN_CODE = asincode.slice(i, j).toString();
            const options = {
                params: { asins: ASIN_CODE, locale: 'IN' },
                headers: {
                    'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                    'X-RapidAPI-Host': process.env.RAPID_API_HOST,
                }
            }
            const response = await axios.get("https://amazon-product-price-data.p.rapidapi.com/product", options);
            var message = "";
            response.data.forEach(iphone => {
                if (iphone.current_price !== 0) {
                    message += `${iphone.product_name} : ${iphone.currency_symbol}${iphone.current_price}}\n`;
                }
            });

            subscribers.subscribers.forEach(function (subscriber) {
                bot.sendMessage(subscriber.chat_id, message);
            })
        }
    }

})


bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Welcome to the iPhone Price Bot.`);
    bot.sendMessage(msg.chat.id, `Type \/subscribe for getting daily iPhone price details`);
});

bot.onText(/\/subscribe/, async (msg) => {
    const formValues = {
        chat_id: msg.chat.id,
        first_name: msg.chat.first_name,
        last_name: msg.chat.last_name,
    }
    const response = await subscriber(formValues);
    if (response.success) {
        bot.sendMessage(msg.chat.id, `You subscribed successfully.\nI will send you the iPhone price daily.`);
    } else {
        bot.sendMessage(msg.chat.id, response.message);
    }

});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/subscribers", async (req, res) => {
    const response = await getChatId();
    res.render("subscribers.ejs", {
        subscribers: response.subscribers
    });
});

app.post("/success", async (req, res) => {
    const { chai_id, message } = req.body;
    bot.sendMessage(chai_id, message);
    res.render("success.ejs", {
        message: "Message send successfully",
    });
})

app.get("/iphonelist", async (req, res) => {
    const response = await getIphoneList();
    if (response.success) {
        res.render("iphonelist.ejs", {
            iphonelists: response.iphonelist
        });
    } else {
        res.send("Error");
    }
})
app.post("/deleteiphone", async (req, res) => {
    const { asincode } = req.body;
    const response = await deleteIphone(asincode);
    if (response.success) {
        res.render("success.ejs", {
            message: response.message,
        });
    }
})

app.post("/addiphone", async (req, res) => {
    const { asincode, iphonename, storagesize } = req.body;
    const response = await addIphone(asincode, iphonename, storagesize);
    if (response.success) {
        res.render("success.ejs", {
            message: response.message,
        });
    }
})

app.listen(PORT, () => {
    console.log("We are running on port 9002");
});

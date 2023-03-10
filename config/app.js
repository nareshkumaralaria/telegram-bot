import express from "express";
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
// app.set("view engine", "ejs");

export default app;

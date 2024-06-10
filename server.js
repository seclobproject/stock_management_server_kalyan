import express from "express";
import cors from "cors";
import "dotenv/config";
import ip from "ip";
import path from "path";
// import dotenv from 'dotenv'
import { initialize } from "./config/dbConnection.js";
import { errorHandling } from "./middlewares/error.middleware.js";
import authRouter from "./routes/authRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import franchiseRouter from "./routes/franchiseRoute.js";
import productRouter from "./routes/productRoute.js";
import stockRouter from "./routes/stockRoute.js";
import dashboardRouter from "./routes/dashboardDataRoute.js";

// dotenv.config();
const NODE_ENV = "production";
const app = express();

app.use(express.json());

await initialize();

app.use(cors({ origin: true, credentials: true }));
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads/products", express.static(path.join("uploads/products")));

app.get("/", (req, res) => {
  res.send({ message: "Hello World" });
});

app.use(
  authRouter,
  categoryRouter,
  franchiseRouter,
  productRouter,
  stockRouter,
  dashboardRouter
);

app.use(errorHandling);

if (NODE_ENV == "production") {
  // app.use(express.static(__dirname + "/frontend/dist"));
  app.use(express.static("/var/www/seclob/kalyan/admin/frontend/dist"));

  app.get("*", (req, res) => {
    // res.sendFile(__dirname + "/frontend/dist/index.html");
    res.sendFile("/var/www/seclob/kalyan/admin/frontend/dist/index.html");
  });
} else {
  app.get("/", (req, res) => {
    res.status(201).json("Running");
  });
}

const port = 8080 || 5000;
app.listen(port, () => {
  console.log(`App listening on the port ${ip.address()}:${port}`);
});

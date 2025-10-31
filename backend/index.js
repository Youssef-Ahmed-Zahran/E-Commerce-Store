// packages
const express = require("express");
const cookieParser = require("cookie-parser");
const conectToDB = require("./config/db");
const path = require("path");
const { logger } = require("./middlewares/logger");
const { notFound, errorHanlder } = require("./middlewares/errors");
const cors = require("cors");

// Express Usages
require("dotenv").config();

// Connection To Database
conectToDB();

// Init App
const app = express();

// Static Folder
app.use("/uploads", express.static(path.join(path.resolve() + "/uploads")));

//Apply Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://e-commerce-store-frontend-wheat.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Error Hander Middleware
app.use(notFound);
app.use(errorHanlder);

// Running the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

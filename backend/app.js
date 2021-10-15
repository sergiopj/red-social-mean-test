// express app config
const express = require("express");
const app = express();
const userRoutes = require("./routes/user.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", userRoutes);

// export config
module.exports = app;

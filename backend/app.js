// express app config
const express = require("express");
const app = express();
const userRoutes = require("./routes/user.routes");
const followRoutes = require("./routes/follow.routes");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", userRoutes);
app.use("/api", followRoutes);

// export config
module.exports = app;

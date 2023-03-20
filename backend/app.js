const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");
const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());

//Resolving CORS error
//first middleware
//also can we npm i cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

//router middlewares
app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

//if no route found then this middleware will response with error
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//custom error handler ie whenever any router get error in excution
//automattically catches and response
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

//connecting mongoose
mongoose
  .connect(
    "mongodb+srv://Pathak30:Pathak30@techzoo.eomkbhe.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

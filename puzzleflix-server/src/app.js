// Dependencies
require("dotenv").config();
const logger = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// Routers 
const fedapiRouter = require("./routes/fedapi");
const indexRouter = require("./routes/index");
const eightqueensRouter = require("./routes/eightqueensindex");


// Set up router 
const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route Handling
// app.use("/fedapi", fedapiRouter);
app.use("/eightqueens", eightqueensRouter);
app.use("/api", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
});

module.exports = app;

const morgan = require("morgan");
const express = require("express");
const app = express();
const jobsRouter = require("./routes/jobsRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const authenticateUser = require("./middeware/authentication");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.static("./public"));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  return res.send(
    '<h1>Store API</h1>< href="/api/v1/products">products route>'
  );
});

//tasks middleware assignment
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;

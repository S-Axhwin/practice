import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";

const app = express();

// import the router
import userRouter from "./routes/userRoute";
import adminRouter from "./routes/adminRoute";
// to use the json format in the application
app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(cookieParser());

//routes for users
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

// port
const PORT = 8080;

// listening to port
app.listen(PORT, () => {
    console.log("listening to port ", PORT);
});

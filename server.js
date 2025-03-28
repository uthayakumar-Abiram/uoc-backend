import express from "express";
import dotenv from "dotenv";dotenv.config();
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import { notFound,errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";connectDB();
import cors from "cors";

const port =3200;

//stripe listen --forward-to localhost:3200/api/stripe/webhook
//stripe trigger payment_intent.succeeded

const app=express();

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({     // to support URL-encoded bodies
    limit: '100mb',
    extended: true
    }));

// app.use(express.json());
// app.use(express.urlencoded({extended:true}));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Private-Network', 'true');
//   next();
// });

app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true 
}
));

app.use("/api/users", userRoutes);



// app.use(express.static("frontend/casgo-page"))

app.get("/",(req,res)=> res.send("server running"))

app.use(notFound);
app.use(errorHandler);



app.listen(port,()=>{
    console.log(`Sever started on port ${port}`);
})




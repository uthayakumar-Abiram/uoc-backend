import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";


const protect =asyncHandler(async(req,res,next)=>{
   
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
//console.log(token);

  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }
    
    if(token){
        try{
            const decoded =jwt.verify(token,process.env.JWT_SECRET);
//console.log(decoded);

            req.user=await User.findById(decoded.userId).select("-password");
            
            if(req.user){
             // console.log(req.user);
              
 
                next();
            }

        }catch(error){
            res.status(401);
            throw new Error("Not authorized, invalid token");
        }
    }else{
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email} = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.role !== "admin") {
    throw new Error("You are not an admin");
    } else {
    next();
    }
    });
    
export { protect, isAdmin};

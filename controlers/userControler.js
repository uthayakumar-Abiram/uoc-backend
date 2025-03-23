

import User from "../models/userModel.js";

import asyncHandler from "express-async-handler";
import Student from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

import cloudinary from "../utils/cloudinary.js";

import ContactMessages from "../models/contactPage.js";
import Announcement from "../models/announcement.js";


const authUser= asyncHandler(async(req,res)=>{
    
    const {email,password}=req.body;
    const user=await User.findOne({email});

   
    if(user && (await user.matchPassword(password))){
        
       

      const token=  generateToken(res,user._id)
        
        res.status(202).json({user,token});
       
        
    }else{
        res.status(401);
       throw new Error('Invalid email or password');
    }
   
   
});




// controllers/contactController.js

// Get all unanswered questions
export const getUnansweredQuestions = async (req, res) => {
 
  try {
    const questions = await ContactMessages.find({ answered: false }).populate('userId', 'name phoneNumber').exec();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving questions', error });
  }
};

export const getansweredQuestionsById = async (req, res) => {
  const { id } = req.params;
  console.log("ssss",{id})

  try {
    const questions = await ContactMessages.find({
      answered: true,
      userId: id, 
    })
      .populate("userId", "firstName lastName phoneNumber")
      .exec();

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "No answered questions found" });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching answered questions:", error);
    res.status(500).json({ message: "Error retrieving questions", error });
  }
};
export const getansweredQuestions = async (req, res) => {
 
  try {
    const questions = await ContactMessages.find({ answered: true })
      .populate("userId", "firstName lastName phoneNumber") // Ensure firstName & lastName are fetched
      .exec();
    console.log(questions);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving questions", error });
  }
};


// Admin answers a question
export const answerQuestion = async (req, res) => {
  const { questionId, answer } = req.body;
  
  try {
    const question = await ContactMessages.findByIdAndUpdate(
      questionId,
      { answer, answered: true },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ message: 'Question answered successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Error answering question', error });
  }
};





const registerStudent = asyncHandler(async (req, res) => {
  const {
    indexNumber,
    firstName,
    lastName,
    email,
    phoneNumber,
    mailingAddress,
    gender,
    yearOfStudy,
    departmentOfStudy,
    academicAdvisor,
    password,
    role,
  } = req.body;
console.log(req.body,"test")
try {

    // Check if the student already exists
  const studentExist = await Student.findOne({ email });

  if (studentExist) {
     return res.status(400).json({message:"Student already exists"});
  }

  // Create the student record
  const student = await Student.create({
    indexNumber,
    firstName,
    lastName,
    email,
    phoneNumber,
    mailingAddress,
    gender,
    yearOfStudy,
    departmentOfStudy,
    academicAdvisor,
    password,
    role: role || "Student", // Default to "Student" if no role is provided
  });

  if (student) {
    // Generate token and send response
    generateToken(res, student._id);
   return res.status(201).json({
      user: {
        id: student._id,
        indexNumber: student.indexNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phoneNumber: student.phoneNumber,
        mailingAddress: student.mailingAddress,
        gender: student.gender,
        yearOfStudy: student.yearOfStudy,
        departmentOfStudy: student.departmentOfStudy,
        academicAdvisor: student.academicAdvisor,
        role: student.role,
      },
    });
  } else {
    return  res.status(400).json({message:"Invalid student data"});
  }
    
} catch (error) {
    console.log("error in register",error);
    return res.status(500).json({message:error.message})
}
  
});

export default registerStudent;


const logoutUser= asyncHandler(async(req,res)=>{
    res.cookie("jwt","",{
        httpOnly:true,
        expires:new Date(0)
    })
    res.status(200).json({message:"logout User"})
});


const getUserProfile= asyncHandler(async(req,res)=>{
   try{
    const use_Id=req.user._id;
    const profile=await User.findById(use_Id)
    
    if(profile){
    
        res.status(200).json(profile);

   }

   }catch(err){
    res.status(404)
    throw new Error(err)
   }
});


const updateUserProfile= asyncHandler(async(req,res)=>{
    const user =await User.findById(req.user._id);

    if(user){
        user.name=req.body.name || user.name;
        user.email=req.body.email ||user.email;

        if(req.body.password){
            user.password=req.body.password;
        }

        const updatedUser= await user.save();

        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email
        })
        
    }else{
        res.status(404);
        throw new Error("user not found")
    }
});


const allUsers = async (req, res) => {
    //enable pagination
  
    const count = await User.find({}).estimatedDocumentCount();

    try {
        const users = await User.find().sort({ createdAt: -1 }).select('-password')
            

        res.status(200).json({
            success: true,
            users,
      
        })
      
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error

        })
    }
}

const notifications =async(req,res)=>{
    try {
        const user=await User.findById(req.user._id).populate({ path: 'notifications',populate:[ {path: 'from', model: 'jobRecruit',select:''},] })//{path: 'from', model: 'jobSeeker',select:''}
        if(user){
         
            res.status(200).json({
                success: true,
                user,
            })
        }
        
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        }) 
    }
}

const markAsRead =async(req,res)=>{
    try {
        const user=await User.findById(req.user._id)
        if(user){
           user.notifications=user.notifications.map((note)=>{
            return(
                {...note,
                read:(note.read==false?note.read=true:note.read=true)
                }
                   
                
            )
             
           })
           let updated=await user.save();
            res.status(200).json({
                success: true,
                notifications:user.notifications
            })
        }
        
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        }) 
    }
}

export const toggleLikeQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; 
    console.log("id:",id);
    console.log("userId:",userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const question = await ContactMessages.findById(id);
    console.log("question: ",question);
    
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const hasLiked = question.votes.includes(userId);

    if (hasLiked) {
      // Remove like
      question.votes = question.votes.filter(
        (vote) => vote.toString() !== userId
      );
    } else {
      // Add like
      question.votes.push(userId);
    }

    await question.save();
    res
      .status(200)
      .json({
        message: hasLiked ? "Like removed" : "Like added",
        votes: question.votes.length,
      });
  } catch (error) {
    res.status(500).json({ message: "Error updating like", error });
  }
};

const postContactMessages = async (req, res) => {
    try {
        const { question, description } = req.body
        const { _id } = req.user

        console.log(req.user);

        const messageSaved = await ContactMessages.create({ userId:_id,question, description })

        if (messageSaved) {
            console.log(messageSaved);
            res.status(201).json({ success: true, message: messageSaved })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send message" })
    }
}

const postAnnouncement = async (req, res) => {
    const { _id } = req.user; // Admin ID
    console.log("adminid:",_id);
    
    const { title, content, visible, bulletPoints } = req.body; // Extract data from the request body

    try {
        // Create a new announcement
        const newAnnouncement = new Announcement({
            userId: _id,
            title,
            content,
            visible,
            bulletPoints
        });

        // Save the announcement to the database
        await newAnnouncement.save();

        // Send a success response
        res.status(201).json({
            message: "Announcement posted successfully!",
            announcement: newAnnouncement
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            message: "Failed to post the announcement.",
            error: error.message
        });
    }
};

const getAnnouncements = async (req, res) => {
    try {
      const announcements = await Announcement.find({ visible: true }).sort({ createdAt: -1 });
  
     
      res.status(200).json(announcements);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch announcements.",
        error: error.message,
      });
    }
};

const deleteQuestion  = async (req, res) => {
    try {
     console.log("asdad")
      const { id } = req.params;
      const deletedQuestion = await ContactMessages.findByIdAndDelete(id);
  
      if (!deletedQuestion) {
        return res.status(404).json({ error: "Question not found" });
      }
  
      res.json({ message: "Question deleted successfully", id });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  
export{
    authUser,registerStudent,logoutUser,getUserProfile,updateUserProfile,allUsers,notifications,markAsRead,postContactMessages,postAnnouncement,getAnnouncements,deleteQuestion
};
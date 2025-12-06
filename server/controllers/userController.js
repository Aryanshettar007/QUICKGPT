import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Chat from "../models/Chat.js";

// Generate JWT
const genratetoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//API to register user 
export const registerUser=async(req, res)=>{
    try {
        const {name, email, password}= req.body;
        //Check if user already exists
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({success:false,message: "User already exists"});
        }   
        const user= await User.create({name, email, password});
        await user.save();

        const token= genratetoken(user._id);
        res.status(201).json({success:true,message: "User registered successfully",token});
    } catch (error) {
        res.status(500).json({success:false,message: "Server Error"});
    }
}

//API to login user
export const loginUser= async(req, res)=>{
    try {
        const {email, password}= req.body;  
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message: "Invalid email or password"});
        }
        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({success:false,message: "Invalid email or password"});
        }
        const token= genratetoken(user._id);
        res.status(200).json({success:true,message: "User logged in successfully", token});
    } catch (error) {
        res.status(500).json({success:false,message: "Server Error"});
    }
}

//API to get user details
export const getUser= async(req, res)=>{
    try {
        const user = await User.findById(req.user._id);
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// API to get published images 

export const getPublishedImages = async (req, res) => {
  try {
    const publishedImageMessages = await Chat.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.isPublished": true,
          "messages.isImage": true
        }
      },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          userName: "$userName"
        }
      }
    ])
    res.json({ success: true, images: publishedImageMessages.reverse() });
  } catch (error) {
    console.error("Error fetching published images:", error);
    res.json({ success: false, message: error.message });
  }
};
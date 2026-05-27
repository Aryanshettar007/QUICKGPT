import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../config/imageKit.js";
import  openai  from "../config/openai.js";

//Text-based AI Chat Message Controller 
export const textMessageController = async (req,res)=>{
    try{
        const userId = req.user._id;
        //check user credits
        if(req.user.credits<1){
            return res.json({success:false,message:"Not enough credits"});    }
        const { chatId, prompt } = req.body
        const chat = await Chat.findOne({ _id: chatId, userId: String(userId) });
        
        if (!chat) {
            return res.json({success:false,message:"Chat not found"});
        }
        
        chat.messages.push({role:"user",content:prompt,isImage:false,timestamp:Date.now()});

        const {choices} = await openai.chat.completions.create({
    model: "gemini-3.5-flash",
    messages: [
        {
            role: "user",
            content: prompt, 
        },
    ],
});
const reply={...choices[0].message,isImage:false,role:"assistant",timestamp:Date.now()};
 res.json({success:true,reply});    
chat.messages.push(reply);
    await chat.save();
    await User.updateOne({_id:userId},{$inc:{credits:-1}});
   
}
catch(error){
       res.json({success:false,message:error.message});
    }
} 

//Image generation message controller
export const imageMessageController= async(req,res)=>{ 
    try{
        const userId = req.user._id;
        //check user credits
        if(req.user.credits<2){
            return res.json({success:false,message:"Not enough credits"});
    }
    const {chatId,prompt,isPublished}=req.body;
    //Find Chat
    const chat = await Chat.findOne({_id:chatId,userId: String(userId)});
    if (!chat) {
        return res.json({success:false,message:"Chat not found"})
    }
    //Add user message to chat
    chat.messages.push({role:"user",content:prompt,isImage:false,timestamp:Date.now()});

    //Encode the prompt 
    const encodedPrompt= encodeURIComponent(prompt)
    // COnstruct ImageKit AI generation URL
    const generatedImageUrl=`${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

     // Trigger image generation
   const aiImageResponse=  await axios.get(generatedImageUrl,{responseType:"arraybuffer"});

    //convert to base64
    const base64Image = Buffer.from(aiImageResponse.data, 'binary').toString('base64')
    const base64File = `data:image/png;base64,${base64Image}`
   // Upload to ImageKit media storage
   const uploadResponse=await imagekit.upload({
    file:base64File,
     fileName:`quickgpt-${Date.now()}.png`,
     folder: "quickgpt",
 });
const reply={role:'assistant',content:uploadResponse.url,timestamp:Date.now(),isImage:true,isPublished};
  res.json({success:true,reply});   
  
  chat.messages.push(reply)
     await chat.save();
     await User.updateOne({_id:userId},{$inc:{credits:-2}});
}
catch(error){
        res.json({success:false,message:error.message});
     }   }

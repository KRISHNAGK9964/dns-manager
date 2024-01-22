import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import bcrypt from "bcryptjs"
// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { generateFromEmail} from "unique-username-generator";


type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("Body : ",req.body);
    let body = req.body; //
    if(typeof req.body == 'string'){//incase of request from localhost 
      body = JSON.parse(req.body as unknown as string);
    }
    let { email ,password, name} = body as any;
    await connectMongoDB();
    if(!name){
      name = generateFromEmail(email,4);
    }
    
    console.log(name , email);
    const hashedPassword = await bcrypt.hash(password,10);
    const userExists = await User.findOne({email});
    if(!userExists){
      await User.create({ name, email , password:hashedPassword});
      console.log("user created");
    }else{
      res.status(400).json({message: "email already in use"});
    }
    
    return res.status(201).json({ message: "User Registered" });
    
  } catch (error:any) {
    console.log("user creation error",error?.message);
    res.status(400).json({message: error});
  }

}

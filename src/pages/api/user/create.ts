import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    console.log("Body : ",req.body);
    let body = req.body; //
    if(typeof req.body == 'string'){//incase of request from localhost 
      body = JSON.parse(req.body as unknown as string);
    }
    const { name , email} = body as any;
    await connectMongoDB();
    console.log(name , email);  
    const userExists = await User.findOne({email});
    if(!userExists){
      await User.create({ name, email });
      console.log("user created");
    }
    
    return res.status(201).json({ message: "User Registered" });
    
  } catch (error:any) {
    console.log("user creation error",error?.message);
    res.status(400);
  }

}

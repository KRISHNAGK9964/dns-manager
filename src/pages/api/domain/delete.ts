import { connectMongoDB } from "@/lib/mongodb";
import Domain from "@/models/domain";

// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest , res:NextApiResponse) {
  try {
    console.log("Body:", req.body);
    let body = req.body; //
    if (typeof req.body == "string") {
      //incase of request from localhost
      body = JSON.parse(req.body as unknown as string);
    }
    const id = body._id;
    console.log(body);
    await connectMongoDB();
    await Domain.deleteOne({_id: id});
    
    return res.status(201).json({message: 'Domain deleted'});
  } catch (error:any) {
    console.log("Domain deletion error",error?.message);
    res.status(400);
  }
}

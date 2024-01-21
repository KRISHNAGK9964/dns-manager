import { connectMongoDB } from "@/lib/mongodb";
import DNSRecord from '@/models/DNSRecord';

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
    
    await connectMongoDB();
    const record = {
        name: body.name,
        type: body.type,
        value: body.value,
        timeLimit: body.timeLimit,
        priority: body.priority,
        comment: body.comment
    }
    const recordId = body.recordId;
    await DNSRecord.findByIdAndUpdate({_id:recordId},record,{new :true});
    
    return res.status(201).json({message: 'DNSRecord updated'});
  } catch (error:any) {
    console.log("DNSRecord update error",error?.message);
    res.status(400);
  }
}

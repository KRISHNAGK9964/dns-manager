import { connectMongoDB } from "@/lib/mongodb";
import DNSRecord from "@/models/DNSRecord";

// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest , res:NextApiResponse) {
  try {
    console.log("findByDomainId Body:", req.body);
    let body = req.body; //
    if (typeof req.body == "string") {
      //incase of request from localhost
      body = JSON.parse(req.body as unknown as string);
    }
    const _id = body.domainId;
    console.log("_id: ", _id);
    await connectMongoDB();
    const docs = await DNSRecord.find({domainId:_id});
    console.log(docs);
    return res.status(201).json(docs);
  } catch (error:any) {
    console.log("Records query error",error?.message);
    res.status(400);
  }
}

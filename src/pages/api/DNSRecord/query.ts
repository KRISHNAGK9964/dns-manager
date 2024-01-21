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
    const query = body.query;
    console.log(body);
    await connectMongoDB();
    // const queryregexp = `/${query}/`;
    const docs = await DNSRecord.find({name: { $regex: query}})
    console.log(docs);
    return res.status(201).json(docs);
  } catch (error:any) {
    console.log("Records query error",error?.message);
    res.status(400);
  }
}

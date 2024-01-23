import { connectMongoDB } from "@/lib/mongodb";
import DNSRecord from "@/models/DNSRecord";
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
    console.log(body);
    await connectMongoDB();
    await DNSRecord.deleteMany({_id: {
        $in: body,
    }});
    return res.status(201).json({message: 'Recorfd deleted successfully'});
  } catch (error:any) {
    console.log("Record deletion error",error?.message);
    res.status(400);
  }
}

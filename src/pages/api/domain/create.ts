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
    const {name} = body;
    await connectMongoDB();
    await Domain.create({name});

    return res.status(201).json({message: 'Domain created'});
  } catch (error:any) {
    console.log("Domain creation error",error?.message);
    res.status(400);
  }
}

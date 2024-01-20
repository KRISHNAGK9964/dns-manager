import { connectMongoDB } from "@/lib/mongodb";
import Domain from "@/models/domain";

// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest , res:NextApiResponse) {
  try {
    await connectMongoDB();
    const data = await Domain.find({});
    // console.log(data);
    return res.status(200).json(data);
  } catch (error:any) {
    console.log("Domain creation error",error?.message);
    res.status(400);
  }
}

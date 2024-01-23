import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import bcrypt from "bcryptjs";
// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// type Data = {
//   message: string;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("Body : ", req.body);
    let body = req.body; //
    if (typeof req.body == "string") {
      //incase of request from localhost
      body = JSON.parse(req.body as unknown as string);
    }
    const { email, password } = body as any;
    await connectMongoDB();
    console.log(email);
    const user = await User.findOne({ email });
    if(!user) {
      console.log("user dont exist");
      return res.status(400).json({message:"user don't exist,try signing in"});
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
       console.log("passwords didn't match");
      return res.status(400).json({message:"wrong passsword"});
    }
    console.log("user: ", user);
    return res.status(201).json({ user });
  } catch (error: any) {
    console.log("user search error", error?.message);
    res.status(400);
  }
}

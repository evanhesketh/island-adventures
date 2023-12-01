import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { JWTTokenInterface } from "../../../../types/interfaces";

require("dotenv").config();

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    await connectMongoDB();

    const { password, token } = await req.json();

    console.log("token=", token)

    const { userId } = jwt.verify(
      token,
      process.env.RESET_TOKEN_SECRET!
    ) as JWTTokenInterface;

    console.log("userId=", userId)

    const user = User.findById(userId);
    const hashedPassword = await bcrypt.hash(password, 12);

    await user.updateOne({ password: hashedPassword });
    return NextResponse.json({ message: "Password changed successfully" });
  } catch (err) {
    return NextResponse.json(
      { message: "Unable to reset password" },
      { status: 500 }
    );
  }
}

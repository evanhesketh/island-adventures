import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse, NextRequest } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(
    req as unknown as NextApiRequest,
    {
      ...res,
      getHeader: (name: string) => res.headers?.get(name),
      setHeader: (name: string, value: string) => res.headers?.set(name, value),
    } as unknown as NextApiResponse,
    authOptions
  );

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { name, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 12);

    await connectMongoDB();
    await User.create({ name, password: hashedPassword });

    return NextResponse.json({ message: "user registered" }, { status: 201 });
  } catch (error) {
    
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

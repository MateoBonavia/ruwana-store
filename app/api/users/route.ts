import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    let user = await User.findOne({ clerkId: userId });

    // Cuando el usuario ingrese por primera vez, creamos un nuevo usuario.
    if (!user) {
      user = await User.create({ clerkId: userId });
      await user.save();
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log("[users_GET]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};

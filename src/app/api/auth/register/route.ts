import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, password, roleName, email } = body;
    if (!name || !password || !email)
      return NextResponse.json(
        { error: "name, email and password required" },
        { status: 400 }
      );

    const role = await prisma.role.findUnique({
      where: { name: roleName || "Staff" },
    });
    if (!role)
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password_hash: passwordHash, role_id: role.id },
    });

    return NextResponse.json(
      { name: user.name, role: role.name, email: user.email },
      { status: 201 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: "Register failed",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

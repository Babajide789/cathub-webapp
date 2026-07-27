import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cats } from "@/lib/data";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to save cats" }, { status: 401 });
  }

  const body = await req.json();
  const catId = typeof body.catId === "string" ? body.catId.trim() : "";

  if (!catId || !cats.some((cat) => cat.id === catId)) {
    return NextResponse.json({ error: "Cat not found" }, { status: 404 });
  }

  const savedCat = await prisma.savedCat.upsert({
    where: {
      userId_catId: {
        userId: session.user.id,
        catId,
      },
    },
    create: {
      userId: session.user.id,
      catId,
    },
    update: {},
  });

  return NextResponse.json(savedCat, { status: 201 });
}

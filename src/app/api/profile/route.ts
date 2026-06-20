import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        location: true,
        role: true,
        interests: true,
        hasOnboarded: true,
        createdAt: true,
        preferences: {
          select: {
            notifyAdoption: true,
            notifyMarketplace: true,
            notifyMating: true,
            notifyVets: true,
          },
        },
        cats: {
          select: {
            id: true,
            name: true,
            breed: true,
            age: true,
            image: true,
          },
        },
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const location =
      typeof body.location === "string" ? body.location.trim() : undefined;
    const image = typeof body.image === "string" ? body.image.trim() : undefined;
    const role = typeof body.role === "string" ? body.role : undefined;
    const interests = Array.isArray(body.interests)
      ? body.interests
          .filter((interest: unknown) => typeof interest === "string")
          .map((interest: string) => interest.trim().toLowerCase())
          .filter(Boolean)
      : undefined;
    const preferences = body.preferences ?? {};

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined ? { name: name || null } : {}),
        ...(location !== undefined ? { location: location || null } : {}),
        ...(image !== undefined ? { image: image || null } : {}),
        ...(role !== undefined ? { role } : {}),
        ...(interests !== undefined
          ? { interests: Array.from(new Set(interests)) }
          : {}),
        preferences: {
          upsert: {
            create: {
              notifyAdoption: Boolean(preferences.notifyAdoption),
              notifyMarketplace: Boolean(preferences.notifyMarketplace),
              notifyMating: Boolean(preferences.notifyMating),
              notifyVets: Boolean(preferences.notifyVets),
            },
            update: {
              notifyAdoption: Boolean(preferences.notifyAdoption),
              notifyMarketplace: Boolean(preferences.notifyMarketplace),
              notifyMating: Boolean(preferences.notifyMating),
              notifyVets: Boolean(preferences.notifyVets),
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        location: true,
        role: true,
        interests: true,
        hasOnboarded: true,
        createdAt: true,
        preferences: {
          select: {
            notifyAdoption: true,
            notifyMarketplace: true,
            notifyMating: true,
            notifyVets: true,
          },
        },
        cats: {
          select: {
            id: true,
            name: true,
            breed: true,
            age: true,
            image: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}

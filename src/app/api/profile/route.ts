import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cats as adoptionCats } from "@/lib/data";

function enrichProfile<T extends { savedCats: { catId: string; createdAt?: Date }[] }>(
  profile: T
) {
  const catMap = new Map(adoptionCats.map((cat) => [cat.id, cat]));

  return {
    ...profile,
    savedCats: profile.savedCats.map((savedCat) => {
      const cat = catMap.get(savedCat.catId);
      return {
        catId: savedCat.catId,
        name: cat?.name ?? "Saved cat",
        breed: cat?.breed ?? null,
        age: cat?.age ?? null,
        image: cat?.image ?? null,
        location: cat?.location ?? null,
        savedAt: savedCat.createdAt?.toISOString() ?? null,
      };
    }),
  };
}

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
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            status: true,
            totalCents: true,
            currency: true,
            createdAt: true,
            items: {
              select: {
                id: true,
                name: true,
                quantity: true,
                totalCents: true,
              },
            },
          },
        },
        savedPictures: {
          orderBy: { createdAt: "desc" },
          take: 12,
          select: {
            id: true,
            image: true,
            caption: true,
            source: true,
            createdAt: true,
          },
        },
        savedCats: {
          orderBy: { createdAt: "desc" },
          select: { catId: true, createdAt: true },
        },
        savedProducts: {
          select: { productId: true },
        },
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(enrichProfile(user)), {
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
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            status: true,
            totalCents: true,
            currency: true,
            createdAt: true,
            items: {
              select: {
                id: true,
                name: true,
                quantity: true,
                totalCents: true,
              },
            },
          },
        },
        savedPictures: {
          orderBy: { createdAt: "desc" },
          take: 12,
          select: {
            id: true,
            image: true,
            caption: true,
            source: true,
            createdAt: true,
          },
        },
        savedCats: {
          orderBy: { createdAt: "desc" },
          select: { catId: true, createdAt: true },
        },
        savedProducts: {
          select: { productId: true },
        },
      },
    });

    return new Response(JSON.stringify(enrichProfile(user)), {
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

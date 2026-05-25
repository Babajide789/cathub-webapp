import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { role, location, image, cat, preferences } = await req.json();

    // Update user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role,
        location,
        image,
        hasOnboarded: true,
        interests: preferences?.interests ?? [],
      },
    });

    // Create cat profile if provided
    if (cat?.name) {
      await prisma.cat.create({
        data: {
          name: cat.name,
          breed: cat.breed,
          age: cat.age ? parseInt(cat.age) : null,
          image: cat.image,
          ownerId: session.user.id,
        },
      });
    }

    // ✅ upsert instead of create — handles re-submissions gracefully
    await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: {
        notifyAdoption: preferences?.notifyAdoption ?? false,
        notifyMarketplace: preferences?.notifyMarketplace ?? false,
        notifyMating: preferences?.notifyMating ?? false,
        notifyVets: preferences?.notifyVets ?? false,
      },
      create: {
        userId: session.user.id,
        notifyAdoption: preferences?.notifyAdoption ?? false,
        notifyMarketplace: preferences?.notifyMarketplace ?? false,
        notifyMating: preferences?.notifyMating ?? false,
        notifyVets: preferences?.notifyVets ?? false,
      },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
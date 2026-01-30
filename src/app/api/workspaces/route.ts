import prisma from "@/lib/db";
import { requireUser } from "@/lib/db/users";
import { slugify } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized", success: false, data: null },
      { status: 401 },
    );
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      memberships: {
        some: {
          userId: user.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      memberships: {
        where: { userId: user.id },
        select: {
          user: { select: { id: true, name: true, email: true } },
          role: true,
        },
      },
    },
  });

  return NextResponse.json(workspaces, { status: 200 });
  // return NextResponse.json(
  //   {
  //     success: true,
  //     message: "Workspaces fetched",
  //     data: workspaces,
  //   },
  //   { status: 200 },
  // );
}

export async function POST(req: Request) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized", success: false, data: null },
      { status: 401 },
    );
  }

  const { name } = await req.json();

  const slug = slugify(name);

  console.log(slug);

  const workspaces_with_same_slug = await prisma.workspace.findMany({
    where: { slug },
  });

  if (workspaces_with_same_slug.length > 0) {
    return NextResponse.json(
      {
        error: "Workspace with this name already exists",
        success: false,
        data: null,
      },
      { status: 409 },
    );
  }

  const workspace = await prisma.workspace.create({
    data: {
      name,
      slug,
      memberships: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
      ownerId: user.id,
    },
  });

  console.log(workspace);

  return NextResponse.json(
    {
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    },
    { status: 200 },
  );
}

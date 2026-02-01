import prisma from "@/lib/db";
import { requireUser } from "@/lib/db/users";
import { slugify } from "@/lib/utils";
import { NextResponse } from "next/server";

// TODO: make projects table
//  TODO: add projects with get response
// TODO: add stats with get response

export async function GET(req: Request) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized", success: false, data: null },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");

  if (!id && !slug)
    return NextResponse.json({ error: "Parameters missing" }, { status: 400 });

  const workspaceWhere = id ? { id } : { slug: slug as string };

  // 3. Now Prisma is happy because we've guaranteed a value exists
  const workspace = await prisma.workspace.findUnique({
    where: workspaceWhere,
    include: {
      projects: { orderBy: { updatedAt: "desc" } },
      memberships: { where: { userId: user.id } },
    },
  });

  if (!workspace || workspace.memberships.length === 0) {
    return NextResponse.json(
      { error: "Access denied or not found" },
      { status: 403 },
    );
  }

  // 3. Stats Calculation (The Senior Way)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // TODO: uncomment this when we have the tasks table
  // const [completedTasksCount, activeProjectsCount] = await Promise.all([
  //   prisma.task.count({
  //     where: {
  //       workspaceId: workspace.id,
  //       status: "DONE",
  //       completedAt: { gte: oneWeekAgo } // Only tasks from the last 7 days
  //     }
  //   }),
  //   prisma.project.count({
  //     where: {
  //       workspaceId: workspace.id,
  //       status: "ACTIVE"
  //     }
  //   })
  // ]);

  const completedTasksCount = 0

  const [activeProjectsCount] = await Promise.all([
    prisma.project.count({
      where: {
        workspaceId: workspace.id,
        status: "ACTIVE",
      },
    }),
  ]);

  const data = {
    workspace: {
      ...workspace,
      memberships: undefined, // Don't leak membership arrays to the frontend
    },
    projects: workspace.projects,
    stats: {
      active: activeProjectsCount,
      task_completed_this_week: completedTasksCount || 0,
      team_velocity: completedTasksCount || 0, // Tasks per week
    },
  };

  // TODO : add stats
  // TODO : fetch all the completed tasks
  // TODO : team velocity = completed tasks (within week) per week

  return NextResponse.json(
    {
      success: true,
      message: "Workspace fetched",
      data: data,
    },
    { status: 200 },
  );
  // return NextResponse.json(
  //   {
  //     success: true,
  //     message: "Workspaces fetched",
  //     data: workspaces,
  //   },
  //   { status: 200 },
  // );
}

// --------------------------------------------------------------
export async function POST(req: Request) {
  const user = await requireUser();

  console.log("Working!!");

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

  return NextResponse.json(
    {
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    },
    { status: 200 },
  );
}

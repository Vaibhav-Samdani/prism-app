import prisma from "@/lib/db";
import { requireUser } from "@/lib/db/users";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
    }

    const now = new Date();
    // Normalize to midnight for accurate "today" comparisons
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    // 1. Fetch User's Workspaces
    const workspaces = await prisma.workspace.findMany({
      where: {
        memberships: {
          some: { userId: user.id },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { memberships: true } },
      },
      take: 5,
    });


    // 2. Fetch User's Assigned Tasks (Assume you have a Task model)
    // If you haven't built the Task model yet, this is how it will look:
    const myTasks = await prisma.task.findMany({
      where: {
        assigneeId: user.id,
        status: { not: "DONE" },
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        workspace: { select: { name: true, slug: true } },
      },
      orderBy: { dueDate: 'asc' },
      take: 8,
    }).catch(() => []); // Catch block just in case Task model isn't pushed to DB yet

    // 3. Calculate Stats
    const overdueTasks = myTasks.filter(t => t.dueDate && new Date(t.dueDate) < todayStart);
    const dueTodayTasks = myTasks.filter(t => t.dueDate && new Date(t.dueDate) >= todayStart && new Date(t.dueDate) <= todayEnd);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalWorkspaces: workspaces.length,
          overdueCount: overdueTasks.length,
          dueTodayCount: dueTodayTasks.length,
        },
        workspaces,
        tasks: myTasks,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
}
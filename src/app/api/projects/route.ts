// app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { buildSlug } from "@/lib/utils"; // Adjust this import path to match your structure
import { z } from "zod";
import prisma from "@/lib/db";
import { createProjectSchema } from "@/lib/validations/project";
import { ProjectStatus } from "@/generated/prisma/enums";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const body = createProjectSchema.parse(json);

    // 1. Verify user is part of the workspace and get their role
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: body.workspaceId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Forbidden: You are not a member of this workspace" },
        { status: 403 },
      );
    }

    // 2. Determine project status based on workspace role
    // Members can only suggest, Admins/Owners create active projects
    const initialStatus = membership.role === "MEMBER" ? "SUGGESTED" : "ACTIVE";

    // 3. Generate initial smart slug
    let slug = buildSlug(body.name);

    // 4. Collision fallback (Extremely rare due to nanoid, but safe to include)
    while (
      await prisma.project.findUnique({
        where: {
          workspaceId_slug: {
            workspaceId: body.workspaceId,
            slug: slug,
          },
        },
      })
    ) {
      // If it exists, generate a completely new one with a fresh nanoid suffix
      slug = buildSlug(body.name);
    }

    const categories = body.category?.split(",").map((c) => c.trim());


    // 5. Create the project
    const project = await prisma.project.create({
      data: {
        name: body.name,
        slug: slug,
        description: body.description,
        category: categories || [],
        workspaceId: body.workspaceId,
        createdById: session.user.id,
        status: initialStatus as ProjectStatus,
      },
    });

    return NextResponse.json(
      {
        ...project,
        message:
          initialStatus === "SUGGESTED"
            ? "Project suggested successfully. Waiting for admin approval."
            : "Project created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Project creation failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    // Optional: Allow filtering by status from the client
    const status = searchParams.get("status") as
      | "ACTIVE"
      | "SUGGESTED"
      | "ARCHIVED"
      | null;

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 },
      );
    }

    // Verify user is part of the workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: workspaceId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch projects
    const projects = await prisma.project.findMany({
      where: {
        workspaceId,
        ...(status && { status }), // Apply status filter if provided
      },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

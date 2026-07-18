import prisma from "@/lib/db";
import { requireUser } from "@/lib/db/users";
import { buildSlug, buildWorkspaceWhere } from "@/lib/utils";
import { NextResponse } from "next/server";

// TODO: make projects table
//  TODO: add projects with get response
// TODO: add stats with get response
// export async function GET(req: Request) {
//   const user = await requireUser();

//   if (!user) {
//     return NextResponse.json(
//       { error: "Unauthorized", success: false, data: null },
//       { status: 401 },
//     );
//   }

//   const { searchParams } = new URL(req.url);
//   const id = searchParams.get("id");
//   const slug = searchParams.get("slug");

//   if (!id && !slug)
//     return NextResponse.json({ error: "Parameters missing", success: false, data: null }, { status: 400 });
//   let workspaceWhere;
//   try {
//     workspaceWhere = buildWorkspaceWhere({ id, slug });
//     // Updated to allow any member of the workspace to access it
//     workspaceWhere = { 
//       ...workspaceWhere, 
//       memberships: {
//         some: {
//           userId: user.id
//         }
//       } 
//     };
//   } catch (error: string | any) {
//     return NextResponse.json({ error: error.message, success: false, data: null }, { status: 400 });
//   }

//   // 3. Now Prisma is happy because we've guaranteed a value exists
//   const workspace = await prisma.workspace.findFirst({
//     where: workspaceWhere,
//     select: {
//       id: true,
//       name: true,
//       slug: true,
//       description: true,
//       ownerId: true,
//       createdAt: true,
//       updatedAt: true,

//       projects: {
//         orderBy: { updatedAt: "desc" },
//         select: {
//           id: true,
//           name: true,
//           slug: true,
//           description: true,
//           category: true,
//           status: true,
//           createdAt: true,
//           updatedAt: true,
//         },
//       },

//       memberships: {
//         select: {
//           role: true,
//           createdAt: true,
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               image: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!workspace) {
//     return NextResponse.json({ error: "Workspace not found", success: false, data: null }, { status: 404 });
//   }

//   if (workspace.memberships.length === 0) {
//     return NextResponse.json({ error: "Access denied", success: false, data: null }, { status: 403 });
//   }

  


//   // 3. Stats Calculation (The Senior Way)
//   const oneWeekAgo = new Date();
//   oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

//   // TODO: uncomment this when we have the tasks table
//   // const [completedTasksCount, activeProjectsCount] = await Promise.all([
//   //   prisma.task.count({
//   //     where: {
//   //       workspaceId: workspace.id,
//   //       status: "DONE",
//   //       completedAt: { gte: oneWeekAgo } // Only tasks from the last 7 days
//   //     }
//   //   }),
//   //   prisma.project.count({
//   //     where: {
//   //       workspaceId: workspace.id,
//   //       status: "ACTIVE"
//   //     }
//   //   })
//   // ]);

//   console.log("workspace ----------------> ", workspace);

//   const completedTasksCount = 0;

//   const [activeProjectsCount] = await Promise.all([
//     prisma.project.count({
//       where: {
//         workspaceId: workspace.id,
//         status: "ACTIVE",
//       },
//     }),
//   ]);

//   const data = {
//     workspace,

//     stats: {
//       active: activeProjectsCount || 10,
//       task_completed_this_week: completedTasksCount || 50,
//       team_velocity: completedTasksCount || 80, // Tasks per week
//     },
//   };

//   // TODO : add stats
//   // TODO : fetch all the completed tasks
//   // TODO : team velocity = completed tasks (within week) per week

//   return NextResponse.json(
//     {
//       success: true,
//       message: "Workspace fetched",
//       data: data,
//     },
//     { status: 200 },
//   );
//   // return NextResponse.json(
//   //   {
//   //     success: true,
//   //     message: "Workspaces fetched",
//   //     data: workspaces,
//   //   },
//   //   { status: 200 },
//   // );
// }

export async function GET(req: Request) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized", success: false, data: null },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");

  if (!id && !slug) {
    return NextResponse.json(
      { error: "Parameters missing", success: false, data: null }, 
      { status: 400 }
    );
  }

  let workspaceWhere;
  try {
    workspaceWhere = buildWorkspaceWhere({ id, slug });
    // Database-level security: Only fetch if the user is in the memberships list
    workspaceWhere = { 
      ...workspaceWhere, 
      memberships: {
        some: {
          userId: user.id
        }
      } 
    };
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, success: false, data: null }, 
      { status: 400 }
    );
  }

  const workspace = await prisma.workspace.findFirst({
    where: workspaceWhere,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,

      projects: {
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          category: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },

      memberships: {
        select: {
          role: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  // If the workspace doesn't exist OR the user isn't a member, it returns null.
  if (!workspace) {
    return NextResponse.json(
      { error: "Workspace not found or access denied", success: false, data: null }, 
      { status: 404 }
    );
  }

  // Find the exact role of the user requesting this data
  const currentUserMembership = workspace.memberships.find(
    (m) => m.user.id === user.id
  );
  const currentUserRole = currentUserMembership?.role || "MEMBER";

  // --- Stats Calculation ---
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Fetch active projects count
  const activeProjectsCount = await prisma.project.count({
    where: {
      workspaceId: workspace.id,
      status: "ACTIVE",
    },
  });

  console.log(workspace,currentUserMembership);

  // TODO: Implement this when the Task table is ready
  const completedTasksCount = 0; 

  const data = {
    workspace: {
      ...workspace,
      currentUserRole, // Injecting the role cleanly for the frontend!
    },
    stats: {
      active: activeProjectsCount || 0,
      task_completed_this_week: completedTasksCount || 0,
      team_velocity: completedTasksCount || 0,
    },
  };

  return NextResponse.json(
    {
      success: true,
      message: "Workspace fetched successfully",
      data: data,
    },
    { status: 200 }
  );
}

// --------------------------------------------------------------
export async function POST(req: Request) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized", success: false, data: null },
      { status: 401 },
    );
  }

  const { name, description } = await req.json();

  const slug = buildSlug(name);

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
      description,
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

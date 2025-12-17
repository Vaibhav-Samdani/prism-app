import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";

type Crumb = {
  label: string;
  href?: string;
};

export default function DashboardHeader({
  title,
  breadcrumbs,
  rightSlot,
}: {
  title: string;
  breadcrumbs: Crumb[];
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="px-6 pt-6 pb-4">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={index}>
              {crumb.href ? (
                <BreadcrumbLink href={crumb.href}>
                  {crumb.label}
                </BreadcrumbLink>
              ) : (
                <span className="text-muted-foreground">
                  {crumb.label}
                </span>
              )}

              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator />
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title + Actions */}
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          {title}
        </h1>

        {rightSlot && (
          <div className="flex items-center gap-2">
            {rightSlot}
          </div>
        )}
      </div>

      <Separator className="mt-4" />
    </div>
  );
}

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import React from "react";

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
    <div className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md">
      <div className="px-6 py-4">
        {/* Breadcrumbs - High Legibility */}
        <Breadcrumb>
          <BreadcrumbList className="text-[13px] font-medium tracking-tight">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink 
                      href={crumb.href}
                      className="transition-colors hover:text-foreground/80"
                    >
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-foreground/60">
                      {crumb.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="opacity-50" />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title + Actions */}
        <div className="mt-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground/90">
            {title}
          </h1>

          {rightSlot && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
              {rightSlot}
            </div>
          )}
        </div>
      </div>
      <Separator className="bg-border/40" />
    </div>
  );
}
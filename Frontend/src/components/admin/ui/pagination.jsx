import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }) => (
  <nav className={cn("mx-auto flex w-full justify-center", className)} {...props} />
);

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex items-center gap-1", className)} {...props} />
));

const PaginationItem = React.forwardRef((props, ref) => <li ref={ref} {...props} />);

const PaginationLink = ({ isActive, className, ...props }) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({ variant: isActive ? "outline" : "ghost", size: "icon" }),
      className
    )}
    {...props}
  />
);

const PaginationPrevious = (props) => (
  <PaginationLink {...props} className="gap-1 pl-2.5">
    <ChevronLeft className="h-4 w-4" />
    Previous
  </PaginationLink>
);

const PaginationNext = (props) => (
  <PaginationLink {...props} className="gap-1 pr-2.5">
    Next
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);

const PaginationEllipsis = () => (
  <span className="flex h-9 w-9 items-center justify-center">
    <MoreHorizontal className="h-4 w-4" />
  </span>
);

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};

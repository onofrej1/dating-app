"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { capitalize } from "@/lib/utils";

const CommonBreadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((item) => item !== "");

  const items = segments.map((item, index) => {
    return [
      <BreadcrumbItem key={item}>
        <BreadcrumbLink href={`/${segments.slice(0, index + 1).join("/")}`}>
          {capitalize(item)}
        </BreadcrumbLink>
      </BreadcrumbItem>,
      index === segments.length - 1 ? null : (
        <BreadcrumbSeparator key={item + "separator"} />
      ),
    ];
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>{items}</BreadcrumbList>
    </Breadcrumb>
  );
};

export default CommonBreadcrumbs;

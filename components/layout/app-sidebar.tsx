"use client";

import { Calendar, ChevronDown, ChevronRight, Home, Inbox } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import React from "react";

// Resources
const resources = [
  {
    title: "Genders",
    url: "/resource/genders",
    icon: Inbox,
  },
  {
    title: "Relationship types",
    url: "/resource/relationshipTypes",
    icon: Inbox,
  },
  {
    title: "Questions",
    url: "/resource/questions",
    icon: Inbox,
  },
  {
    title: "Question choices",
    url: "/resource/questionChoices",
    icon: Inbox,
  },
];

// Menu items
const items = [
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
];

export function AppSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sidebar>
      <SidebarHeader className="p-3">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Admin page
        </h3>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Menu
            </h4>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex justify-between">
                      <div className="flex gap-2 items-center">
                        <Home size="16" />
                        Resources
                      </div>
                      {isOpen ? <ChevronDown /> : <ChevronRight />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {resources.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <a href={item.url}>
                              <item.icon />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

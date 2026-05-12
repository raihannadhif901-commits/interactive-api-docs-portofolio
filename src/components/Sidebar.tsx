"use client";

import { EndpointDef } from "@/app/page";
import { cn } from "@/lib/utils";
import { Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

interface SidebarProps {
  endpoints: EndpointDef[];
  selected: EndpointDef | null;
  onSelect: (ep: EndpointDef) => void;
  apiInfo: any;
}

const methodColors: Record<string, string> = {
  get: "text-blue-400",
  post: "text-green-400",
  put: "text-yellow-400",
  delete: "text-red-400",
  patch: "text-purple-400",
};

export function Sidebar({ endpoints, selected, onSelect, apiInfo }: SidebarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <aside className="w-64 border-r border-border-subtle flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-border-subtle flex items-center h-[73px]">
        <div>
          <h1 className="font-bold text-sm tracking-tight leading-none uppercase">{apiInfo.title}</h1>
          <p className="text-xs text-muted-foreground mt-1.5">v{apiInfo.version}</p>
        </div>
      </div>

      <div className="p-3 border-b border-border-subtle">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search endpoints..." 
            className="w-full bg-muted text-sm border border-border-subtle pl-9 pr-3 py-1.5 focus:outline-none focus:border-border-strong transition-colors rounded-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2 px-2 mt-2">
          Endpoints
        </div>
        <nav className="flex flex-col gap-0.5">
          {endpoints.map((ep, i) => {
            const isSelected = selected?.path === ep.path && selected?.method === ep.method;
            return (
              <button
                key={i}
                onClick={() => onSelect(ep)}
                className={cn(
                  "flex flex-col items-start px-3 py-2 text-left transition-colors",
                  isSelected 
                    ? "bg-accent text-background" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className={cn("text-[10px] font-mono font-bold uppercase w-10", isSelected ? "text-background opacity-80" : methodColors[ep.method])}>
                    {ep.method}
                  </span>
                  <span className="text-xs font-mono truncate">{ep.path}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border-subtle flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Theme</span>
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 bg-muted text-muted-foreground hover:text-foreground rounded-none transition-colors"
        >
          <Sun className="h-4 w-4 hidden dark:block" />
          <Moon className="h-4 w-4 block dark:hidden" />
        </button>
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import { dummyApiSpec } from "@/data/dummy-api";
import { Sidebar } from "@/components/Sidebar";
import { MainPanel } from "@/components/MainPanel";
import { CodePanel } from "@/components/CodePanel";

export type Method = "get" | "post" | "put" | "delete" | "patch";

export interface EndpointDef {
  path: string;
  method: Method;
  details: any;
}

export default function Home() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef | null>(null);
  const [liveResponse, setLiveResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Parse dummy spec into flat list for sidebar
  const endpoints: EndpointDef[] = [];
  Object.entries(dummyApiSpec.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, details]) => {
      endpoints.push({
        path,
        method: method as Method,
        details,
      });
    });
  });

  // Select first by default if null
  if (!selectedEndpoint && endpoints.length > 0) {
    setSelectedEndpoint(endpoints[0]);
  }

  const handleSelect = (ep: EndpointDef) => {
    setSelectedEndpoint(ep);
    setLiveResponse(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans">
      <Sidebar 
        endpoints={endpoints} 
        selected={selectedEndpoint} 
        onSelect={handleSelect} 
        apiInfo={dummyApiSpec.info}
      />
      <MainPanel 
        selected={selectedEndpoint} 
        onResponse={setLiveResponse}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <CodePanel 
        selected={selectedEndpoint} 
        liveResponse={liveResponse}
        isLoading={isLoading}
      />
    </div>
  );
}

"use client";

import { EndpointDef } from "@/app/page";
import { Play, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface MainPanelProps {
  selected: EndpointDef | null;
  onResponse: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

export function MainPanel({ selected, onResponse, isLoading, setIsLoading }: MainPanelProps) {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  // Clear inputs when switching endpoints
  useEffect(() => {
    setParamValues({});
  }, [selected]);

  if (!selected) {
    return (
      <div className="flex-1 flex items-center justify-center border-r border-border-subtle">
        <p className="text-muted-foreground text-sm uppercase tracking-widest">Select an endpoint</p>
      </div>
    );
  }

  const { details } = selected;
  const parameters = details.parameters || [];
  const bodySchema = details.requestBody?.content?.["application/json"]?.schema;

  const handleSend = async () => {
    setIsLoading(true);
    try {
      let finalPath = selected.path;
      const queryParams = new URLSearchParams();

      parameters.forEach((p: any) => {
        // use inputted value or default
        const val = paramValues[p.name] || p.schema?.default;
        if (val) {
          if (p.in === "path") {
            finalPath = finalPath.replace(`{${p.name}}`, val);
          } else if (p.in === "query") {
            queryParams.append(p.name, val);
          }
        }
      });

      const queryString = queryParams.toString();
      const targetUrl = `https://api.github.com${finalPath}${queryString ? `?${queryString}` : ""}`;

      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: targetUrl,
          method: selected.method.toUpperCase(),
        }),
      });

      const data = await res.json();
      onResponse({
        url: targetUrl,
        ...data,
      });

    } catch (e: any) {
      onResponse({ error: "Request Failed", details: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 border-r border-border-subtle overflow-y-auto relative">
      <div className="max-w-3xl mx-auto p-12 pb-32">
        <div className="flex items-center gap-3 mb-4">
          <span className="uppercase text-xs font-bold tracking-widest px-2 py-1 bg-border-subtle text-foreground">
            {selected.method}
          </span>
          <h2 className="text-2xl font-bold tracking-tight">{details.summary || selected.path}</h2>
        </div>
        
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          {details.description || "No description provided for this endpoint."}
        </p>

        {parameters.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-4 border-b border-border-subtle pb-2">
              Parameters
            </h3>
            <div className="space-y-4">
              {parameters.map((p: any, i: number) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{p.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.in}</span>
                    {p.required && <span className="text-[10px] text-red-500 uppercase font-bold">Required</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                  <input 
                    type="text" 
                    placeholder={`e.g. ${p.schema?.default || ''}`}
                    value={paramValues[p.name] || ""}
                    onChange={(e) => setParamValues({ ...paramValues, [p.name]: e.target.value })}
                    className="mt-2 w-full max-w-sm bg-transparent border border-border-strong focus:border-foreground p-2 text-sm outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {bodySchema && (
          <div className="mb-10">
            <h3 className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-4 border-b border-border-subtle pb-2">
              Request Body
            </h3>
            <div className="border border-border-strong p-4 bg-muted/30">
              <textarea 
                className="w-full h-32 bg-transparent text-sm font-mono outline-none resize-none placeholder:text-muted-foreground"
                placeholder="{\n  // Enter JSON payload here\n}"
                defaultValue={details.requestBody?.content?.["application/json"]?.example ? JSON.stringify(details.requestBody?.content?.["application/json"]?.example, null, 2) : ""}
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border-subtle bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <span className="font-mono text-xs text-muted-foreground">{selected.path}</span>
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="flex items-center gap-2 bg-foreground text-background px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            {isLoading ? "Sending..." : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

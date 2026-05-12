"use client";

import { EndpointDef } from "@/app/page";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { useTheme } from "next-themes";

interface CodePanelProps {
  selected: EndpointDef | null;
  liveResponse: any;
  isLoading: boolean;
}

export function CodePanel({ selected, liveResponse, isLoading }: CodePanelProps) {
  const [html, setHtml] = useState("");
  const [language, setLanguage] = useState<"curl" | "js">("curl");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!selected) return;
    
    // Construct dummy curl based on path defaults for the UI
    let finalPath = selected.path;
    selected.details.parameters?.forEach((p: any) => {
      if (p.in === "path" && p.schema?.default) {
        finalPath = finalPath.replace(`{${p.name}}`, p.schema.default);
      }
    });

    const curl = `curl -X ${selected.method.toUpperCase()} https://api.github.com${finalPath} \\
  -H "Accept: application/vnd.github.v3+json"`;

    const jsCode = `fetch("https://api.github.com${finalPath}", {
  method: "${selected.method.toUpperCase()}",
  headers: {
    "Accept": "application/vnd.github.v3+json"
  }
})
.then(response => response.json())
.then(console.log);`;

    const requestSnippet = language === "curl" ? curl : jsCode;
    const snippetTitle = language === "curl" ? "Request Snippet (cURL)" : "Request Snippet (JavaScript)";
    
    let responseString = "";
    let responseTitle = "Expected Response";

    if (liveResponse) {
      responseTitle = `Live Response (${liveResponse.status} ${liveResponse.statusText})`;
      responseString = JSON.stringify(liveResponse.data, null, 2);
    } else {
      // Fallback to example
      let respExample = "{}";
      const responses = selected.details.responses;
      if (responses) {
        const okResp = responses["200"] || responses["201"];
        if (okResp && okResp.content && okResp.content["application/json"]) {
          respExample = JSON.stringify(okResp.content["application/json"].example, null, 2);
        }
      }
      responseString = respExample;
    }
    const code = `// ${snippetTitle}
${requestSnippet}

// ${responseTitle}
${responseString}`;

    codeToHtml(code, {
      lang: "javascript",
      theme: resolvedTheme === "light" ? "github-light" : "github-dark",
    }).then((res) => {
      // Force transparent background
      const transparentRes = res.replace(/<pre class="shiki[^>]*style="background-color:[^;]+;/, '<pre class="shiki" style="background-color: transparent;');
      setHtml(transparentRes);
    });
  }, [selected, liveResponse, language, resolvedTheme]);

  if (!selected) {
    return <div className="w-[450px] bg-code-bg border-l border-border-subtle shrink-0" />;
  }

  return (
    <div className="w-[450px] bg-[var(--color-code-bg)] border-l border-border-subtle shrink-0 flex flex-col h-full">
      <div className="p-4 border-b border-border-subtle flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {liveResponse ? (
            <span className="text-green-400">Live Result</span>
          ) : (
            "Example"
          )}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => setLanguage("curl")}
            className={`text-[10px] uppercase tracking-wider transition-colors ${language === "curl" ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
          >
            cURL
          </button>
          <button 
            onClick={() => setLanguage("js")}
            className={`text-[10px] uppercase tracking-wider transition-colors ${language === "js" ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
          >
            JS
          </button>
        </div>
      </div>
      <div className={`flex-1 p-4 overflow-y-auto text-xs font-mono transition-opacity duration-300 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="text-muted-foreground animate-pulse">Loading syntax...</div>
        )}
      </div>
    </div>
  );
}

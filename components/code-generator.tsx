"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Copy, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RequestConfig {
  method: string;
  url: string;
  headers: Record<string, string>;
  //eslint-disable-next-line
  body?: any;
}

interface CodeGeneratorProps {
  config: RequestConfig;
}

export function CodeGenerator({ config }: CodeGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const getHeadersArray = () => {
    if (!config.headers) return [];
    return Object.entries(config.headers).filter(
      ([key, value]) => key && value,
    );
  };

  const generateCurl = () => {
    let curl = `curl -X ${config.method} '${config.url}'`;

    const headersArray = getHeadersArray();
    if (headersArray.length > 0) {
      headersArray.forEach(([key, value]) => {
        curl += ` \\\n  -H '${key}: ${value}'`;
      });
    }

    if (config.body) {
      const bodyStr =
        typeof config.body === "string"
          ? config.body
          : JSON.stringify(config.body);
      curl += ` \\\n  -d '${bodyStr}'`;
    }

    return curl;
  };

  const generateJavaScript = () => {
    const headersArray = getHeadersArray();
    const headersStr =
      headersArray.length > 0
        ? headersArray
            .map(([key, value]) => `    '${key}': '${value}'`)
            .join(",\n")
        : "    'Content-Type': 'application/json'";

    return `fetch('${config.url}', {
  method: '${config.method}',
  headers: {
${headersStr}
  }${config.body ? `,\n  body: JSON.stringify(${JSON.stringify(config.body, null, 2)})` : ""}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;
  };

  const generatePython = () => {
    const headersArray = getHeadersArray();
    const headersStr =
      headersArray.length > 0
        ? headersArray
            .map(([key, value]) => `    '${key}': '${value}'`)
            .join(",\n")
        : "    'Content-Type': 'application/json'";

    return `import requests

url = '${config.url}'
headers = {
${headersStr}
}
${config.body ? `data = ${JSON.stringify(config.body, null, 2)}\n` : ""}
response = requests.${config.method.toLowerCase()}(url, headers=headers${config.body ? ", json=data" : ""})
print(response.json())`;
  };

  const generateNode = () => {
    const headersArray = getHeadersArray();
    const headersStr =
      headersArray.length > 0
        ? headersArray
            .map(([key, value]) => `    '${key}': '${value}'`)
            .join(",\n")
        : "    'Content-Type': 'application/json'";

    return `const axios = require('axios');

axios({
  method: '${config.method.toLowerCase()}',
  url: '${config.url}',
  headers: {
${headersStr}
  }${config.body ? `,\n  data: ${JSON.stringify(config.body, null, 2)}` : ""}
})
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));`;
  };

  const copyToClipboard = (code: string, lang: string) => {
    navigator.clipboard.writeText(code);
    setCopied(lang);
    setTimeout(() => setCopied(null), 2000);
  };

  const codes = {
    curl: generateCurl(),
    javascript: generateJavaScript(),
    python: generatePython(),
    node: generateNode(),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Code2 className="h-4 w-4" />
          Generate Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Generate Code</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="curl" className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="node">Node.js</TabsTrigger>
          </TabsList>

          {Object.entries(codes).map(([lang, code]) => (
            <TabsContent key={lang} value={lang} className="flex-1">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 z-10"
                  onClick={() => copyToClipboard(code, lang)}
                >
                  {copied === lang ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <ScrollArea className="h-[400px] rounded-md border border-border bg-muted">
                  <pre className="p-4 text-sm font-mono">
                    <code>{code}</code>
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

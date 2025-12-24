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

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface RequestConfig {
  method: string;
  url: string;
  headers: Record<string, string>;
  // eslint-disable-next-line
  body?: any;
}

interface CodeGeneratorProps {
  config: RequestConfig;
}

export function CodeGenerator({ config }: CodeGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const getHeadersArray = () =>
    Object.entries(config.headers || {}).filter(([key, value]) => key && value);

  const generateCurl = () => {
    let curl = `curl -X ${config.method} '${config.url}'`;
    getHeadersArray().forEach(([k, v]) => (curl += ` \\\n  -H '${k}: ${v}'`));
    if (config.body) {
      curl += ` \\\n  -d '${JSON.stringify(config.body)}'`;
    }
    return curl;
  };

  const generateJavaScript = () => `fetch('${config.url}', {
  method: '${config.method}',
  headers: ${JSON.stringify(config.headers, null, 2)},
  ${config.body ? `body: JSON.stringify(${JSON.stringify(config.body, null, 2)})` : ""}
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);`;

  const generateNode = () => `const axios = require('axios');

axios({
  method: '${config.method.toLowerCase()}',
  url: '${config.url}',
  headers: ${JSON.stringify(config.headers, null, 2)},
  ${config.body ? `data: ${JSON.stringify(config.body, null, 2)}` : ""}
})
.then(res => console.log(res.data))
.catch(console.error);`;

  const generatePython = () => `import requests

response = requests.${config.method.toLowerCase()}(
  "${config.url}",
  headers=${JSON.stringify(config.headers, null, 2)},
  ${config.body ? `json=${JSON.stringify(config.body, null, 2)}` : ""}
)

print(response.json())`;

  const generateGo = () => `package main

import (
  "bytes"
  "net/http"
)

func main() {
  client := &http.Client{}
  req, _ := http.NewRequest("${config.method}", "${config.url}",
    bytes.NewBuffer([]byte(\`${config.body ? JSON.stringify(config.body) : ""}\`)),
  )

  ${getHeadersArray()
    .map(([k, v]) => `req.Header.Set("${k}", "${v}")`)
    .join("\n  ")}

  client.Do(req)
}`;

  const generateRuby = () => `require 'net/http'
require 'json'

uri = URI('${config.url}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::${config.method
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase())}.new(uri)

${getHeadersArray()
  .map(([k, v]) => `request['${k}'] = '${v}'`)
  .join("\n")}

request.body = ${config.body ? JSON.stringify(config.body) : "nil"}

response = http.request(request)
puts response.body`;

  const generatePHP = () => `<?php
$ch = curl_init('${config.url}');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${config.method}');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
${getHeadersArray()
  .map(([k, v]) => `  "${k}: ${v}"`)
  .join(",\n")}
]);
${config.body ? `curl_setopt($ch, CURLOPT_POSTFIELDS, '${JSON.stringify(config.body)}');` : ""}
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`;

  const generateJava = () => `OkHttpClient client = new OkHttpClient();

RequestBody body = RequestBody.create(
  "${config.body ? JSON.stringify(config.body) : ""}",
  MediaType.parse("application/json")
);

Request request = new Request.Builder()
  .url("${config.url}")
  .method("${config.method}", body)
  ${getHeadersArray()
    .map(([k, v]) => `.addHeader("${k}", "${v}")`)
    .join("\n  ")}
  .build();

client.newCall(request).execute();`;

  const copy = (code: string, lang: string) => {
    navigator.clipboard.writeText(code);
    setCopied(lang);
    setTimeout(() => setCopied(null), 2000);
  };

  const codes: Record<string, { code: string; lang: string }> = {
    curl: { code: generateCurl(), lang: "bash" },
    javascript: { code: generateJavaScript(), lang: "javascript" },
    node: { code: generateNode(), lang: "javascript" },
    python: { code: generatePython(), lang: "python" },
    go: { code: generateGo(), lang: "go" },
    ruby: { code: generateRuby(), lang: "ruby" },
    php: { code: generatePHP(), lang: "php" },
    java: { code: generateJava(), lang: "java" },
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Code2 className="h-4 w-4" />
          Generate Code
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-fit h-fit">
        <DialogHeader>
          <DialogTitle>Generate Code</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="curl">
          <TabsList className=" w-full g">
            {Object.keys(codes).map((k) => (
              <TabsTrigger key={k} value={k}>
                {k.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(codes).map(([key, { code, lang }]) => (
            <TabsContent key={key} value={key}>
              <div className="relative">
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2"
                  onClick={() => copy(code, key)}
                >
                  {copied === key ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>

                <ScrollArea className="h-fit rounded-md border ">
                  <SyntaxHighlighter
                    language={lang}
                    style={oneDark}
                    customStyle={{ height: "100%" }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </ScrollArea>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

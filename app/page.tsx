import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Code2,
  History,
  Shield,
  Rocket,
  Globe,
  Database,
  Radio,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">API Craft</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
          Professional API Testing Tool
        </Badge>
        <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Test APIs with Confidence
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground">
          A powerful, intuitive API testing platform supporting REST, GraphQL,
          and WebSocket protocols. Built for developers who demand precision and
          speed.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              <Rocket className="h-4 w-4" />
              Start Testing Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-start gap-3 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                All HTTP Methods
              </h3>
              <p className="text-sm text-muted-foreground">
                Support for GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS
                requests
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-start gap-3 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                GraphQL Support
              </h3>
              <p className="text-sm text-muted-foreground">
                Test GraphQL queries and mutations with built-in schema explorer
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-start gap-3 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Radio className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                WebSocket Testing
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time WebSocket connection testing with message history
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-start gap-3 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <History className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                Request History
              </h3>
              <p className="text-sm text-muted-foreground">
                Automatic history tracking with local storage persistence
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y border-border bg-muted/50 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Everything you need to test APIs
            </h2>
            <p className="mb-12 text-muted-foreground">
              From simple REST calls to complex GraphQL queries and real-time
              WebSocket connections
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Secure Testing
              </h3>
              <p className="text-sm text-muted-foreground">
                All requests are processed securely with full header and
                authentication support
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Data Persistence
              </h3>
              <p className="text-sm text-muted-foreground">
                Your request history is saved locally, so you never lose your
                work
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Lightning Fast
              </h3>
              <p className="text-sm text-muted-foreground">
                Built with Next.js and React Query for optimal performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="mb-4 text-3xl font-bold text-foreground">
          Ready to streamline your API testing?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
          Join developers who trust API Craft for their API testing needs
        </p>
        <Link href="/signup">
          <Button size="lg" className="gap-2">
            <Rocket className="h-4 w-4" />
            Get Started Now
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, React Query, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

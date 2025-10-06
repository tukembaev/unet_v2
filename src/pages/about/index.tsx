import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'shared/ui';
import { Info, Layers, Code2 } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Unet V2</h1>
          <p className="text-xl text-muted-foreground">
            Learn more about this project and its architecture
          </p>
        </div>

        <Card>
          <CardHeader>
            <Info className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>
              A modern, scalable React application template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Unet V2 is a comprehensive React project template built with the latest
              web technologies and best practices. It provides a solid foundation for
              building scalable, maintainable applications.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Layers className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Feature-Sliced Design</CardTitle>
            <CardDescription>
              A modern architectural methodology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This project follows the Feature-Sliced Design (FSD) architecture, which
              organizes code by business domains and technical purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>app</strong> - Application initialization and global providers</li>
              <li><strong>pages</strong> - Page-level components and route definitions</li>
              <li><strong>widgets</strong> - Complex UI blocks composed of features and entities</li>
              <li><strong>features</strong> - User interactions and business logic</li>
              <li><strong>entities</strong> - Business entities and domain models</li>
              <li><strong>shared</strong> - Reusable utilities, UI components, and configurations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Code2 className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Key Features</CardTitle>
            <CardDescription>
              What makes this template special
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✓ <strong>Type Safety:</strong> Full TypeScript coverage with strict mode enabled</li>
              <li>✓ <strong>Form Management:</strong> Typed wrapper around react-hook-form with Zod validation</li>
              <li>✓ <strong>Routing:</strong> Type-safe router setup with React Router v6</li>
              <li>✓ <strong>Error Handling:</strong> Error boundaries with fallback UI</li>
              <li>✓ <strong>Data Fetching:</strong> TanStack Query with Axios integration</li>
              <li>✓ <strong>UI Components:</strong> Shadcn UI with Tailwind CSS</li>
              <li>✓ <strong>Code Quality:</strong> ESLint configured for React and TypeScript</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


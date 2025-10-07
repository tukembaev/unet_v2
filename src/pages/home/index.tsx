import { useAuthUser } from "features/auth/model/queries";
import { FileText, Home, Sparkles } from "lucide-react";
import { useState } from "react";
import { FormField, InferFormValues, useForm } from "shared/lib/form";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "shared/ui";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "shared/ui/empty";
import { toast } from "sonner";
import { z } from "zod";

// Example form schema
const exampleFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

type ExampleFormValues = InferFormValues<typeof exampleFormSchema>;

export function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExampleFormValues>({
    schema: exampleFormSchema,
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data: ExampleFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form data:", data);
      toast.success("Form submitted successfully!", {
        description: `Welcome, ${data.name}!`,
      });
      form.reset();
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  const { data: user } = useAuthUser();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Unet V2
          </h1>
          <p className="text-xl text-muted-foreground">
            A modern React application with Feature-Sliced Design architecture
          </p>
        </div>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Home />
            </EmptyMedia>
            <EmptyTitle>Cloud Storage Empty</EmptyTitle>
            <EmptyDescription>
              Upload files to your cloud storage to access them anywhere.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm">
              Upload Files
            </Button>
          </EmptyContent>
        </Empty>
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Home className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>React 19</CardTitle>
              <CardDescription>
                Built with the latest React version for optimal performance
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>TypeScript</CardTitle>
              <CardDescription>
                Fully typed codebase for better developer experience
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>FSD Architecture</CardTitle>
              <CardDescription>
                Scalable and maintainable project structure
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Example Form */}
        <Card>
          <CardHeader>
            <CardTitle>Example Form</CardTitle>
            <CardDescription>
              Try out the typed form hook with Zod validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                form={form}
                name="name"
                label="Name"
                placeholder="Enter your name"
                required
              />
              <FormField
                form={form}
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                required
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack</CardTitle>
            <CardDescription>
              This project includes the following technologies:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-2 text-sm">
              <li>✓ React 19 with TypeScript</li>
              <li>✓ Vite for fast bundling</li>
              <li>✓ Tailwind CSS for styling</li>
              <li>✓ Shadcn UI components</li>
              <li>✓ React Router for navigation</li>
              <li>✓ React Hook Form with Zod</li>
              <li>✓ TanStack Query for data fetching</li>
              <li>✓ Axios for HTTP requests</li>
              <li>✓ Lucide React for icons</li>
              <li>✓ Sonner for notifications</li>
              <li>✓ ESLint for code quality</li>
              <li>✓ Feature-Sliced Design architecture</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

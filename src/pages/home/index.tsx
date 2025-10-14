import { FileText, Home, Sparkles, Printer } from "lucide-react";
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
import { usePrintArea } from "shared/lib/print-area";

// ----- схема формы -----
const exampleFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});
type ExampleFormValues = InferFormValues<typeof exampleFormSchema>;

export function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExampleFormValues>({
    schema: exampleFormSchema,
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = form.handleSubmit(async (data: ExampleFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Form submitted successfully!", {
        description: `Welcome, ${data.name}!`,
      });
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  });

  // Базовые принт-стили; параметры задаём при вызове print()
  const { ref: printRef, print } = usePrintArea<HTMLDivElement>({
    styles: `
      @media print {
        .print-card { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
        .no-print { display: none !important; }
      }
    `,
  });

  return (
    <div>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Программные пресеты */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              print({
                pageTitle: "UNET V2 — A4 Portrait",
                page: { size: "A4", orientation: "portrait", marginMm: 16 },
                fit: "none",       // авто-подгонка по ширине
                scale: 0.5,          // ручной масштаб
              })
            }
          >
            <Printer className="h-4 w-4 mr-2" />
            Печать A4 (книжная)
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              print({
                pageTitle: "UNET V2 — A4 Landscape 90%",
                page: { size: "A4", orientation: "landscape", marginMm: 12 },
                fit: "none",
                scale: 0.9,         // ручной масштаб
              })
            }
          >
            <Printer className="h-4 w-4 mr-2" />
            Печать A4 (альбомная, 90%)
          </Button>
        </div>

        {/* Контент вне печати */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Unet V2</h1>
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

        {/* ------- ПЕЧАТАЕМЫЙ БЛОК ------- */}
        <div ref={printRef} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="print-card">
              <CardHeader>
                <Home className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>React 19</CardTitle>
                <CardDescription>
                  Built with the latest React version for optimal performance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="print-card">
              <CardHeader>
                <FileText className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>TypeScript</CardTitle>
                <CardDescription>
                  Fully typed codebase for better developer experience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="print-card">
              <CardHeader>
                <Sparkles className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>FSD Architecture</CardTitle>
                <CardDescription>
                  Scalable and maintainable project structure
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* форму не разрываем */}
          <Card className="print-card print-avoid-break">
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
                <Button type="submit" disabled={isSubmitting} className="no-print">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="print-card">
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
        {/* ------- КОНЕЦ ПЕЧАТАЕМОГО БЛОКА ------- */}
      </div>
    </div>
  );
}

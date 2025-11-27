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
import { SchedulePage } from "pages/schedule";
import { EmployeeDashboardPlaceholder } from "pages/EmployeeDashboardPlaceholder/EmployeeDashboardPlaceholder";

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


  const role = "employee"; // Пример роли пользователя
  return (
    <div>
      <div className="mx-auto space-y-8">
        {role === "employee" ?
        <EmployeeDashboardPlaceholder />
         : 
        <SchedulePage />
        }
      </div>
    </div>
  );
}

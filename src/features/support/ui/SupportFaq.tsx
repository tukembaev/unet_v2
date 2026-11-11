import { ChevronDown } from 'lucide-react';

import { cn } from 'shared/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shared/ui';

import { SUPPORT_FAQ_ITEMS } from '../lib/faq-items';

export function SupportFaq() {
  return (
    <Card className="h-fit border-border/70 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Частые вопросы</CardTitle>
        <CardDescription>
          Возможно, ответ уже есть ниже — это быстрее, чем ждать ответа на
          email.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {SUPPORT_FAQ_ITEMS.map((item) => (
          <details
            key={item.id}
            className="group rounded-xl border border-border/70 bg-muted/20 px-4 py-3"
          >
            <summary
              className={cn(
                'flex cursor-pointer list-none items-center justify-between gap-3',
                'text-sm font-semibold text-foreground',
                '[&::-webkit-details-marker]:hidden'
              )}
            >
              <span>{item.question}</span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </p>
          </details>
        ))}
      </CardContent>
    </Card>
  );
}

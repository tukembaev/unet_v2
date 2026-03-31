import { Card, CardContent, Skeleton } from 'shared/ui';
import { Calendar, Clock } from 'lucide-react';
import { useUpcomingEvents } from '../../model/hooks/useUpcomingEvents';

export const UpcomingEvents = () => {
  const { events, isLoading } = useUpcomingEvents();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Нет предстоящих событий
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {events.slice(0, 5).map((event, index) => (
        <Card
          key={index}
          className="hover:shadow-md transition-all duration-200"
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 shrink-0">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">
                  {event.subject}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{event.time}</span>
                  {event.room && (
                    <>
                      <span>•</span>
                      <span>{event.room}</span>
                    </>
                  )}
                </div>
                {event.teacher && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.teacher}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

import { OneFlow } from 'entities/education-management/ui/tabs/dispatcher/OneFlow';
import type { WorkPlanItem } from 'entities/education-management/model/types';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ROUTES } from 'app/providers/routes';
import { Button, Card, CardContent, CardHeader, CardTitle } from 'shared/ui';

type LocationState = {
  stream?: WorkPlanItem;
};

export default function DispatcherStreamPage() {
  const { streamId } = useParams();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;
  const stream = state.stream;

  const backHref = `${ROUTES.EDUCATION_MANAGEMENT}?tab=dispatcher`;
  const idMatches =
    stream != null &&
    streamId != null &&
    String(stream.id) === String(streamId);

  if (!stream || !idMatches) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Поток не найден</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Откройте поток из списка диспетчерской — данные передаются при
            переходе.
          </p>
          <Button asChild variant="outline">
            <Link to={backHref}>Вернуться в диспетчерскую</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <OneFlow stream={stream} />;
}

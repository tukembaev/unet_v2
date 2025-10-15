import { Info } from 'lucide-react'
import { Card, CardContent } from 'shared/ui'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from 'shared/ui/empty'

interface EmptyInfoProps {
  withCard?: boolean
}

export const EmptyInfo: React.FC<EmptyInfoProps> = ({ withCard = true }) => {
  const content = (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Info />
        </EmptyMedia>
        <EmptyTitle>Данные не найдены</EmptyTitle>
        <EmptyDescription>Данные не найдены для выбранных параметров</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <p>Попробуйте выбрать другие параметры</p>
      </EmptyContent>
    </Empty>
  )

  return withCard ? (
    <Card>
      <CardContent>{content}</CardContent>
    </Card>
  ) : (
    <div className="flex items-center justify-center py-8">{content}</div>
  )
}

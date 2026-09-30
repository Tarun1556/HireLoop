import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ErrorState({ title = "Couldn't load data", description, onRetry, retrying }) {
  return (
    <Card className="mx-auto mt-10 max-w-md text-center">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description ?? 'Something went wrong. Please try again.'}</CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent>
          <Button onClick={onRetry} disabled={retrying}>
            {retrying ? 'Retrying...' : 'Try again'}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
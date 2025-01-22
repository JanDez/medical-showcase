import { useRequestStore } from "@/app/features/stores/useRequestStore"
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

export function RequestList() {
  const requests = useRequestStore((state) => state.getRequests())

  if (requests.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No requests yet
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{request.name}</span>
              <Badge variant={
                request.status === 'approved' ? 'secondary' :
                request.status === 'rejected' ? 'destructive' :
                'default'
              }>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">{request.description}</p>
            <p className="text-sm text-muted-foreground">
              Requested {formatDistanceToNow(new Date(request.createdAt))} ago
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 
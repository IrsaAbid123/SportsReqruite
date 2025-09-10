import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface Notification {
  id: number
  user: { name: string; avatar?: string }
  message: string
  timestamp: string
}

interface NotificationSheetProps {
  notifications: Notification[]
}

export const NotificationSheet = ({ notifications }: NotificationSheetProps) => {
  return (
    <SheetContent side="right" className="w-80 p-0">
      <SheetHeader className="p-6 pb-4 border-b">
        <SheetTitle className="text-left">Notifications</SheetTitle>
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-redwhiteblued bg-clip-text text-transparent"></h2>
      </SheetHeader>
      <div className="flex flex-col">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer border-b border-border/50 last:border-b-0"
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage
                src={notification.user.avatar || "/placeholder.svg"}
                alt={notification.user.name}
              />
              <AvatarFallback className="bg-gradient-accent text-accent-foreground text-sm">
                {notification.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {notification.user.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-tight">{notification.message}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </SheetContent>
  )
}

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useGetUserNotificationsQuery, useMarkNotificationAsReadMutation, useMarkAllNotificationsAsReadMutation } from "@/redux/ApiCalls/notificationApi"
import { useUser } from "@/context/UserContext"
import { useEffect } from "react"
import { Check, X } from "lucide-react"

interface Notification {
  _id: string
  user: { _id: string; fullname: string; email: string; avatar?: string }
  text: string
  read: boolean
  createdAt: string
  updatedAt: string
}

interface NotificationSheetProps {
  userId?: string
}

export const NotificationSheet = ({ userId }: NotificationSheetProps) => {
  const { user } = useUser()
  const currentUserId = userId || user?._id

  const { data: notificationsResponse, isLoading, error } = useGetUserNotificationsQuery(currentUserId, {
    skip: !currentUserId || !user
  })

  const [markAsRead] = useMarkNotificationAsReadMutation()
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation()

  // Safely extract notifications array from response
  const notifications = Array.isArray(notificationsResponse)
    ? notificationsResponse
    : Array.isArray(notificationsResponse?.data)
      ? notificationsResponse.data
      : Array.isArray(notificationsResponse?.notifications)
        ? notificationsResponse.notifications
        : []

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      await markAsRead({
        notificationId: notification._id,
        userId: currentUserId
      }).unwrap()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleDismissNotification = async (notification: Notification) => {
    // For now, we'll just mark it as read. In the future, you might want to add a delete endpoint
    try {
      await markAsRead({
        notificationId: notification._id,
        userId: currentUserId
      }).unwrap()
    } catch (error) {
      console.error('Failed to dismiss notification:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(currentUserId).unwrap()
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  // Debug logging to understand API response structure
  if (notificationsResponse && !isLoading) {
    console.log('Notifications API Response:', notificationsResponse)
    console.log('Extracted notifications:', notifications)
  }


  if (isLoading) {
    return (
      <SheetContent side="right" className="w-80 sm:w-96 p-0">
        <SheetHeader className="p-4 sm:p-6 pb-4 border-b">
          <SheetTitle className="text-left text-lg sm:text-xl">Notifications</SheetTitle>
        </SheetHeader>
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading notifications...</div>
        </div>
      </SheetContent>
    )
  }

  if (error) {
    console.error('Notifications API Error:', error)
    return (
      <SheetContent side="right" className="w-80 sm:w-96 p-0">
        <SheetHeader className="p-4 sm:p-6 pb-4 border-b">
          <SheetTitle className="text-left text-lg sm:text-xl">Notifications</SheetTitle>
        </SheetHeader>
        <div className="flex items-center justify-center p-8">
          <div className="text-destructive text-center">
            Failed to load notifications
            <br />
            <span className="text-xs text-muted-foreground mt-2">
              Please try again later
            </span>
          </div>
        </div>
      </SheetContent>
    )
  }

  return (
    <SheetContent side="right" className="w-80 sm:w-96 p-0">
      <SheetHeader className="p-4 sm:p-6 pb-4 border-b">
        <SheetTitle className="text-left text-lg sm:text-xl">Notifications</SheetTitle>
      </SheetHeader>
      <div className="flex flex-col max-h-[calc(100vh-120px)] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground text-center">
              No notifications yet
            </div>
          </div>
        ) : (
          Array.isArray(notifications) && notifications.map((notification: Notification) => (
            <div
              key={notification._id}
              className={`relative m-3 p-4 rounded-lg border transition-all duration-200 ${!notification.read
                ? 'bg-blue-50 border-blue-200 shadow-sm'
                : 'bg-gray-50 border-gray-200'
                }`}
            >
              {/* Action buttons in top right corner - only show tick for unread notifications */}
              <div className="absolute top-2 right-2 flex gap-1">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification)}
                    className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600"
                    title="Mark as read"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismissNotification(notification)}
                  className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                  title="Dismiss"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <div className={`flex items-start gap-3 ${!notification.read ? 'pr-12' : 'pr-8'}`}>
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage
                    src={notification.user.avatar || "/placeholder.svg"}
                    alt={notification.user.fullname}
                  />
                  <AvatarFallback className="bg-gradient-accent text-accent-foreground text-sm">
                    {notification.user.fullname.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {notification.user.fullname}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 leading-tight">
                        {notification.text}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                    {new Date(notification.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </SheetContent>
  )
}

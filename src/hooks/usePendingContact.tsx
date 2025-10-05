import { useEffect } from 'react';
import { useSendNotificationMutation } from '@/redux/ApiCalls/notificationApi';
import { useUser } from '@/context/UserContext';

export const usePendingContact = () => {
    const { user } = useUser();
    const [sendNotification] = useSendNotificationMutation();

    useEffect(() => {
        const checkPendingContact = async () => {
            if (!user) return;

            const pendingContactStr = localStorage.getItem('pendingContact');
            if (!pendingContactStr) return;

            try {
                const pendingContact = JSON.parse(pendingContactStr);

                // Check if the contact was made recently (within last 5 minutes)
                const contactTime = new Date(pendingContact.contactTime);
                const now = new Date();
                const timeDiff = now.getTime() - contactTime.getTime();
                const fiveMinutes = 5 * 60 * 1000;

                if (timeDiff > fiveMinutes) {
                    // Contact is too old, remove it
                    localStorage.removeItem('pendingContact');
                    return;
                }

                // Send notification
                const notificationText = `${user.fullname} has contacted you regarding your post: "${pendingContact.postTitle}". Check your email for their message!`;

                await sendNotification({
                    userId: pendingContact.targetUserId,
                    text: notificationText
                }).unwrap();

                // Notification sent successfully (no toast)

                // Remove the pending contact
                localStorage.removeItem('pendingContact');

            } catch (error) {
                console.error('Failed to send pending contact notification:', error);
                // Remove the pending contact even if it failed
                localStorage.removeItem('pendingContact');
            }
        };

        // Check for pending contact when component mounts
        checkPendingContact();

        // Also check when the window regains focus (user comes back from email)
        const handleFocus = () => {
            checkPendingContact();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [user, sendNotification]);
};

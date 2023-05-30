/* UI wrapper where we create slots for different actions and other ui elements */

import Link from "next/link";

import { formatDistance } from "date-fns";

export function NotificationShell({ notification, onClick, profilePic }) {
    return (
        <div
            className="mb-2 hover:bg-slate-400"
            id={notification.timestamp}
            key={notification.notification_id}
            onClick={onClick}
        >
            {profilePic ? profilePic : null}
            {notification.event_type === "new_comment" ? (
                <Link href={`/post/${notification.event_reference}`}>{notification.message}</Link>
            ) : (
                <p>{notification.message}</p>
            )}
            <p>{formatDistance(new Date(notification.timestamp), new Date())} a go.</p>
        </div>
    );
}

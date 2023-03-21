const { redisClient } = require("../index");
//const db = require("../db/connections/jasmaAdmin");
//const {  } = db.models;
const { v4: uuidv4 } = require("uuid");

//The user_id is to which user the notification will be send.
//This function is triggered from other functions such as createComment or AddFollower
//Notifications are stored in the Redis Database
async function createNotification(user_id, notificationData) {
    /*
        notificationData format:
        {
            from: UUID (userID),
            event_type: STRING ("new_comment, new_follower")
            event: UUID (Either PostID, or UserID depending on event)
            message: "Something happened"
        }
    */
    const notification_id = uuidv4();
    const timestamp = Date.now();
    notificationData.notification_id = notification_id;
    // Set a TTL of 48 hours (in seconds). This is the time when the notification will be deleted.
    const notifTTL = 48 * 60 * 60

    const encodedNotification =  JSON.stringify({ user_id, notificationData, timestamp, read: false });

    try 
    {
        // We use Redis transactions (multi/exec) to execute multiple commands atomically. 
        // This ensures that all or none of the commands are executed, preventing any intermediate failures.
        const multi = redisClient.multi();
        // Add the notification to a Redis Sorted Set with the timestamp as the score
        multi.zadd(`notifications:${user_id}`, timestamp, encodedNotification);
        // Set the TTL for the Sorted Set key in Redis
        // This means the notification will auto-delete after notifTTL
        multi.expire(`notifications:${user_id}`, notifTTL);
        // Publish the notification to a Redis channel with the user ID as the channel name
        multi.publish(`notifications:${user_id}`, encodedNotification);
        await multi.exec();

        return { success: true };
    } 
    catch (err) 
    {
        console.error('Error creating notification:', error);
        return { success: false, message: 'Notification could not be created.' };
    }
}

//retrieve the last 47 hours notifications for a user
async function getNotifications(req, res) {
    const { user_id } = req.session;

    // Set the timestamp score to 47 hours
    const timestampCutoff = Date.now() - (47 * 60 * 60 * 1000);

    try 
    {
        // Retrieve the notifications for a user from the last X hours in reverse order based on the timestamp score
        // WITHSCORES will include the timestamp in the returned data
        const notifications = await redisClient.zrevrangebyscoreAsync(`notifications:${user_id}`, '+inf', timestampCutoff, 'WITHSCORES');

        console.log("notifications", notifications);

        //Format the data from Redis
        const formattedNotifications = [];
        for (let i = 0; i < notifications.length; i += 2) 
        {
            const notification = JSON.parse(notifications[i]);
            const timestamp = parseInt(notifications[i + 1]);
            formattedNotifications.push({ notification, timestamp });
        }

        console.log("formattedNotifications", formattedNotifications);

        return res.json({ success: true, notifications: formattedNotifications });
    }
    catch (err) 
    {
        console.error('Error retrieving notifications:', error);
        return res.json({ success: false, message: 'Notifications could not be found.' });
    }
}

async function readNotification(req, res) {
    const { user_id } = req.session;
    const { notification_id, timestamp } = req.body;

    // Update the "read" flag for the notification with the given timestamp and user_id
    redisClient.zincrby(`notifications:${user_id}`, 1, JSON.stringify({ timestamp, read: true }));


    return res.json({ success: true } );
}

module.exports = {
    createNotification,
    getNotifications,
    readNotification
};

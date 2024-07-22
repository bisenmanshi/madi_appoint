const Notification = require("../models/notificationModel");

// get all the notification 
const getallnotifs = async (req, res) => {
  try {
    // get notification for logged in user 
    const notifs = await Notification.find({ userId: req.locals });
    return res.send(notifs);
  } catch (error) {
    res.status(500).send("Unable to get all notifications");
  }
};

module.exports = {
  getallnotifs,
};

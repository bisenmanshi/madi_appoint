const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/conn");
const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const appointRouter = require("./routes/appointRoutes");
const notificationRouter = require("./routes/notificationRouter");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());  // middleware that will add required cors headers in res. 
app.use(express.json()); // middleware that will parse the json object in request and we can now use data in req.body 

app.use(express.static(path.join(__dirname,'build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'build', 'index.html'));
});

// redirect to different routes 
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);
//to serve frontend pages form backend 
// app.use(express.static(path.join(__dirname, "./client/build")));


// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

app.listen(port, () => {
  console.log("listening at port",port);
});

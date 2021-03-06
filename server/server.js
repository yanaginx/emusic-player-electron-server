const path = require("path");
const express = require("express");
const port = 5000;
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// api routes
app.use("/api/fer", require("./routes/ferRoutes"));
app.use("/api/wifi", require("./routes/wifiRoutes"));
app.use("/api/scan", require("./routes/scanDirRoutes"));
app.use("/api/hand_gesture", require("./routes/handGestureRoutes"));
app.use("/api/bluetooth", require("./routes/bluetoothRoutes"));
app.use("/api/volume", require("./routes/volumeRoutes"));
app.use("/api/online", require("./routes/onlineRoutes"));

// custom middleware
app.use(errorHandler);

app.listen(port, () => console.log(`Server start listening on port ${port}!`));

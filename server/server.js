const path = require("path");
const express = require("express");
const port = 5000;
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// api routes
app.use("/api/fer", require("./routes/ferRoutes"));

// custom middleware
app.use(errorHandler);

app.listen(port, () => console.log(`Server start listening on port ${port}!`));

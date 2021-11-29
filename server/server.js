require("dotenv").config({ path: "./config/.env" });
require('./config/db.js')
const express = require("express");
const app = express();
const errorHandler = require('./middleware/Error')


app.use(express.json())
app.use("/auth", require("./routes/auth"));
app.use("/private", require("./routes/private"));

// error handler (should be last piece of middleware)
app.use(errorHandler)
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`server started on port: ${PORT}`));
 

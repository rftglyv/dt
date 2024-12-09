const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts); // Use the layouts middleware

// Set view engine and default layout
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");

// Routes
const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

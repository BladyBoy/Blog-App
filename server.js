require("dotenv").config();
const connectDB = require("./src/config/db");
const app = require("./src/app");

// Connection of MongoDB using /config/db file
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

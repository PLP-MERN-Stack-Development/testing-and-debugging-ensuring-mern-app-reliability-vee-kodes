const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./src/config/db');

dotenv.config();

const PORT = process.env.PORT || 5000;


// Connect to DB and start the server
connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    })
});
    





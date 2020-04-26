const app = require('./express_app.js');
const PORT = 8081;
const dbConnection = require('./db_connection.js');

app.listen(PORT, async () => {
    const conn = await dbConnection();
    console.log(`Server running on port ${PORT}`);
});







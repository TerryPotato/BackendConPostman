const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.mongoURI)
        console.log(`MongoDB Connected: ${conn.connection.host}`.blue.underline);	
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB
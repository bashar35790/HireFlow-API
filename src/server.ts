import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const startServer = async () => {
    try {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
};

startServer();  

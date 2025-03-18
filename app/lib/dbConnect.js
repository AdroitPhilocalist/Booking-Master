// Use environment variable for connection string with fallback for local development
const connectSTR = process.env.MONGODB_URI || "mongodb+srv://devsolvotel:devsolvotel@cluster0.g5lid.mongodb.net/HotelDB?retryWrites=true&w=majority&appName=Cluster0";
export default connectSTR;
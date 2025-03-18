// Use environment variable for connection string with fallback for local development
const connectSTR = process.env.MONGODB_URI;
export default connectSTR;
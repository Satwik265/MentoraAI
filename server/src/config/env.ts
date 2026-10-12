import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mentoraai',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'mentora_jwt_access_secret_production_2025',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'mentora_jwt_refresh_secret_production_2025',
  jwtAccessExpiresIn: '1h',
  jwtRefreshExpiresIn: '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};

# Frontend Deployment Guide

## Environment Variables

Before building for production, create a `.env` file in the `client` directory with the following variables:

```env
# API Configuration
# Replace with your deployed server URL
VITE_API_URL=https://your-server-url.com
VITE_SERVER_URL=https://your-server-url.com
```

**Note**: These variables must start with `VITE_` to be accessible in the Vite build.

## Building for Production

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables (create `.env` file or set in your deployment platform)

3. Build the application:
   ```bash
   npm run build
   ```

4. The production build will be in the `dist` directory

## Deployment Platforms

### Vercel

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in Vercel dashboard:
   - `VITE_API_URL`
   - `VITE_SERVER_URL`

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard:
   - `VITE_API_URL`
   - `VITE_SERVER_URL`

### Docker

Create a `Dockerfile` in the `client` directory:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ARG VITE_SERVER_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Important Notes

- Make sure your backend server has CORS enabled for your frontend domain
- Socket.IO connections require WebSocket support on your hosting platform
- For production, use HTTPS for both frontend and backend

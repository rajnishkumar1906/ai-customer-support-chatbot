# Server Deployment Guide (Render.com)

## Environment Variables Required

Set these in your Render.com dashboard under "Environment" section:

1. **PORT** (optional - Render sets this automatically)
   - Default: 5000

2. **MONGO_URI**
   - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

3. **OPENROUTER_API_KEY**
   - Your OpenRouter API key
   - Get one at: https://openrouter.ai/

## Deployment Steps

### 1. Connect GitHub Repository
- Go to Render.com dashboard
- Click "New" → "Web Service"
- Connect your GitHub repository
- Select the repository: `rajnishkumar1906/ai-customer-support-chatbot`

### 2. Configure Build Settings
- **Root Directory**: `server`
- **Build Command**: `npm install` (or leave empty if auto-detected)
- **Start Command**: `npm start`

### 3. Set Environment Variables
- Go to "Environment" tab
- Add all required environment variables listed above

### 4. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy

## Making Changes to Deployed Server

### Method 1: Automatic Deployment (Recommended)
1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. Render will automatically detect the push and redeploy

### Method 2: Manual Redeploy
1. Go to Render.com dashboard
2. Select your web service
3. Click "Manual Deploy" → "Deploy latest commit"

### Method 3: Update Environment Variables
1. Go to Render.com dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add/Edit environment variables
5. Click "Save Changes"
6. Render will automatically restart the service

## Health Check

After deployment, verify the server is running:
- Visit: `https://your-app.onrender.com/health`
- Should return: `{"status":"healthy","uptime":...,"timestamp":"..."}`

## Important Notes

- **Free Tier**: Render free tier services spin down after 15 minutes of inactivity. First request after spin-down may take 30-60 seconds.
- **Logs**: Check logs in Render dashboard under "Logs" tab
- **Database**: Make sure MongoDB is accessible from Render (whitelist IP or use MongoDB Atlas)
- **Knowledge Base**: Run `npm run ingest` locally or via Render shell to populate knowledge base

## Troubleshooting

### Server not starting
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

### CORS errors
- Server is configured to allow all origins (`*`)
- If issues persist, check browser console for specific errors

### Socket.IO not connecting
- Verify `VITE_SERVER_URL` in frontend matches server URL
- Check that WebSocket connections are allowed (Render supports this)

### API errors
- Check server logs in Render dashboard
- Verify OpenRouter API key is valid and has credits
- Ensure MongoDB is connected and knowledge base is ingested

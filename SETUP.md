# Quick Setup Guide

## Prerequisites
- Node.js v18+ installed
- MongoDB running (local or cloud)
- OpenRouter API key ([Get one here](https://openrouter.ai/))

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create a `.env` file in the `server` directory:

```bash
cd ../server
```

Create `.env` file with:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-customer-support
OPENROUTER_API_KEY=your_actual_api_key_here
```

### 3. Ingest Knowledge Base

```bash
cd server
npm run ingest
```

Wait for the ingestion to complete. You should see:
```
✅ Knowledge base ingested: [number]
```

### 4. Start the Server

```bash
cd server
npm run dev
```

Server should start on `http://localhost:5000`

### 5. Start the Client (in a new terminal)

```bash
cd client
npm run dev
```

Client should start on `http://localhost:5173`

### 6. Test the Application

1. Open `http://localhost:5173` in your browser
2. Start chatting with the bot
3. Check analytics at `/analytics` route

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running: `mongod` or check your MongoDB service
- Verify connection string in `.env`

### OpenRouter API Errors
- Check your API key is correct
- Verify you have credits in your OpenRouter account
- Check console for specific error messages

### Knowledge Base Not Working
- Run `npm run ingest` again
- Check MongoDB for `knowledgechunks` collection
- Verify `knowledge-base.txt` exists in `server/` directory

## Project Structure

```
ai-customer-support-chatbot/
├── server/          # Backend (Node.js/Express)
├── client/          # Frontend (React)
└── README.md        # Full documentation
```

## Key Features Implemented

✅ Multi-model AI with OpenRouter (GPT-4o-mini, Mistral, Llama)  
✅ Real-time messaging with Socket.IO  
✅ RAG with vector embeddings  
✅ Context tracking in conversations  
✅ Message queue system  
✅ Analytics dashboard  
✅ Conversation logs  
✅ Beautiful, responsive UI  

## Need Help?

Check the full README.md for detailed documentation and API reference.


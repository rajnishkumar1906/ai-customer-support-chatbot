# AI-Powered Customer Support Chatbot

A full-stack AI-powered chatbot application for customer support with real-time messaging, RAG (Retrieval-Augmented Generation), and comprehensive analytics.

## Features

- 🤖 **Multi-Model AI Support**: Uses OpenRouter API with fallback support across multiple LLM models
- 💬 **Real-time Chat**: WebSocket-based real-time messaging using Socket.IO
- 📚 **RAG (Retrieval-Augmented Generation)**: Context-aware responses using knowledge base embeddings
- 📊 **Analytics Dashboard**: Comprehensive analytics with conversation logs, model usage statistics, and metrics
- 🔄 **Context Tracking**: Maintains conversation history for context-aware responses
- 📝 **Message Queue**: Handles concurrent requests with a message queue system
- 🎨 **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Socket.IO Client
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- OpenRouter API (for multiple LLM models)
- Vector embeddings for RAG

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- OpenRouter API key ([Get one here](https://openrouter.ai/))

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-customer-support-chatbot
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

### 4. Environment Setup

Create a `.env` file in the `server` directory:

```bash
cd ../server
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-customer-support
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 5. Ingest Knowledge Base

Before running the server, you need to ingest the knowledge base into MongoDB:

```bash
cd server
npm run ingest
```

This will:
- Read the `knowledge-base.txt` file
- Create embeddings for each chunk using OpenRouter
- Store chunks and embeddings in MongoDB

## Running the Application

### Start the Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

### Start the Client

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoints

### Chat Endpoints

- `POST /api/chat/send` - Send a message
  ```json
  {
    "conversationId": "optional_conversation_id",
    "message": "user message"
  }
  ```

- `GET /api/chat/history/:id` - Get conversation history
  - Returns all messages for a given conversation ID

### Analytics Endpoints

- `GET /api/analytics/summary` - Get analytics summary
  - Returns statistics about conversations, messages, RAG responses, and model usage

- `GET /api/analytics/conversations` - Get conversation logs
  - Query parameters: `limit` (default: 50), `offset` (default: 0)
  - Returns detailed conversation logs with messages

## Project Structure

```
ai-customer-support-chatbot/
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API and Socket services
│   │   └── App.jsx          # Main app component
│   └── package.json
├── server/
│   ├── config/              # Database and Socket configuration
│   ├── controllers/         # Route controllers
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   ├── services/            # Business logic services
│   ├── queue/               # Message queue implementation
│   ├── scripts/             # Utility scripts
│   ├── knowledge-base.txt   # Knowledge base content
│   └── server.js            # Main server file
└── README.md
```

## Key Components

### RAG Service
- `server/services/rag.service.js`: Implements RAG by retrieving relevant chunks and generating responses
- `server/services/retrieve.service.js`: Vector similarity search for knowledge base chunks
- `server/services/embedding.service.js`: Generates embeddings using OpenRouter API

### Message Queue
- `server/queue/llmQueue.js`: Handles concurrent LLM requests with a queue system

### Socket.IO Integration
- Real-time message delivery
- Conversation room management
- Automatic message broadcasting

### Analytics
- Conversation statistics
- Model usage tracking
- Message counts and patterns
- Recent conversation logs

## Models Used

The application uses OpenRouter with fallback support for multiple models:
- `openai/gpt-4o-mini` (primary)
- `mistralai/mistral-7b-instruct` (fallback 1)
- `meta-llama/llama-3-8b-instruct` (fallback 2)

## Customization

### Adding New Models

Edit `server/services/openrouter.service.js` to add more models to the fallback chain:

```javascript
const MODELS = [
  "openai/gpt-4o-mini",
  "your-new-model-here",
  // ...
];
```

### Modifying Knowledge Base

1. Edit `server/knowledge-base.txt`
2. Run `npm run ingest` to update the database

### UI Customization

The UI uses Tailwind CSS. Modify components in `client/src/components/` to customize the appearance.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify network access if using cloud MongoDB

### OpenRouter API Errors
- Verify your API key in `.env`
- Check your OpenRouter account balance
- Ensure the models are available

### Knowledge Base Not Working
- Run `npm run ingest` to populate the knowledge base
- Check MongoDB for `KnowledgeChunk` documents
- Verify embeddings are being generated

## Development

### Running in Development Mode

Server uses `nodemon` for auto-restart:
```bash
cd server
npm run dev
```

Client uses Vite HMR:
```bash
cd client
npm run dev
```

## Production Build

### Build Client

```bash
cd client
npm run build
```

The build output will be in the `client/dist` directory.

### Environment Variables for Frontend

Create a `.env` file in the `client` directory:

```env
# For production, replace with your deployed server URL
VITE_API_URL=https://your-server-url.com
VITE_SERVER_URL=https://your-server-url.com
```

**Important**: For production deployment, make sure to set these environment variables to point to your deployed server URL.

### Start Production Server

```bash
cd server
npm start
```

## Deployment

### Frontend Deployment

1. Set environment variables in your deployment platform:
   - `VITE_API_URL`: Your deployed backend URL
   - `VITE_SERVER_URL`: Your deployed backend URL (for Socket.IO)

2. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

3. Deploy the `client/dist` folder to your hosting service (Vercel, Netlify, etc.)

### Backend Deployment

1. Set environment variables:
   - `PORT`: Server port (default: 5000)
   - `MONGO_URI`: MongoDB connection string
   - `OPENROUTER_API_KEY`: Your OpenRouter API key

2. Make sure MongoDB is accessible from your deployment environment

3. Run the ingestion script to populate the knowledge base:
   ```bash
   npm run ingest
   ```

4. Start the server:
   ```bash
   npm start
   ```

## License

This project is developed as an assignment submission.

## Author

Developed for Reaidy.io Technical Interview Task


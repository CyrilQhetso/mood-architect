# Mood Architect - Therapeutic Affirmation Generator

A full-stack AI-powered application that generates personalized therapeutic affirmations.

## Live URLs

- **Frontend**: [https://your-app.vercel.app](https://mood-architect-indol.vercel.app)
- **Backend API**: [https://your-api.onrender.com](https://mood-architect.onrender.com)

## Local Development

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- OpenAI API Key

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_key_here" > .env

# Run server
python main.py
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Run development server
npm run dev
```

## Environment Variables

### Backend
- `OPENAI_API_KEY`: Your OpenAI API key

### Frontend
- `VITE_API_URL`: Backend API URL

## Deployment

### Backend (Render)
1. Connect GitHub repository
2. Set root directory to `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add `OPENAI_API_KEY` environment variable

### Frontend (Vercel)
1. Connect GitHub repository
2. Set root directory to `frontend`
3. Framework: Vite
4. Add `VITE_API_URL` environment variable

## Tech Stack
- Frontend: React + Vite
- Backend: FastAPI + Python
- AI: OpenAI GPT-4o-mini
- Deployment: Vercel + Render

## Future Improvements
- Add user authentication to track affirmation history
- Implement rate limiting to prevent API abuse
- Add more feeling categories and personalization options
- Create a favorites/save feature for affirmations
- Add multilingual support

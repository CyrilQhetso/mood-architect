from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from openai import OpenAI
from openai import OpenAIError
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mood-architect-indol.vercel.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class AffirmationRequest(BaseModel):
    name: str
    feeling: str
    
    @field_validator('name', 'feeling')
    @classmethod
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Field cannot be empty')
        return v.strip()

@app.get("/")
def read_root():
    return {"status": "Mood Architect API is running"}

@app.post("/api/affirmation")
async def generate_affirmation(request: AffirmationRequest):
    try:
        # Validate input
        if len(request.name) > 100 or len(request.feeling) > 500:
            raise HTTPException(status_code=400, detail="Input too long")
        
        # Construct prompt with safety guidelines
        system_message = """You are a supportive, empathetic companion. Your role is to provide brief, warm, personalized affirmations.

CRITICAL RULES:
- No medical or legal advice
- No diagnosis of any conditions
- If user mentions self-harm, respond: "I hear you're going through a difficult time. Please reach out to a mental health professional or crisis helpline. You deserve support from someone trained to help."
- Keep responses 2-4 sentences
- Be warm, specific to their input, and encouraging
- Focus on their strengths and possibilities"""

        user_message = f"My name is {request.name} and I'm feeling {request.feeling}. Please give me a supportive affirmation."
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        affirmation = response.choices[0].message.content.strip()
        
        return {"affirmation": affirmation}
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    except OpenAIError as e:
        print(f"OpenAI API error: {str(e)}")
        raise HTTPException(
            status_code=502,
            detail="AI service is unavailable. Please try again."
        )

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=502,
            detail="Unable to generate affirmation. Please try again."
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
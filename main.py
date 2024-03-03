from fastapi import FastAPI, HTTPException, Request
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn

print(os.environ, "\n\n")
from dotenv import load_dotenv
load_dotenv()
print(os.environ)

app = FastAPI()

# Add CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

from pydantic import BaseModel

class Payload(BaseModel):
    news: str

@app.post("/classify")
async def classify_news(request: Payload):
    news = request.news
    if not news:
        raise HTTPException(status_code=400, detail="No news text provided")

    prompt = f""" You are a news analyst and your job is to make people aware of political spectrum of the news. 

    Classify the news delimited by triple backticks based on political spectrum(Far left, Moderate Left, Centre Left, Centre, Centre Right, Moderate Right or Far Right) and also summarize the conclusions\
    for the choice of political spectrum.
    News: ```{news}```
    """

    try:
        response = model.generate_content(prompt)
        return {"politicalSpectrum": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_os_environ")
def get_env_variable():
    return os.environ
# @app.get("/")
# def hello_world():
#     return "Welcome"

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5049)


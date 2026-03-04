import os
import re
import pickle
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import nltk
nltk.download('stopwords', quiet=True)
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

app = FastAPI(title="Sentiment Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and vectorizer (saved from Colab)
with open("model.pkl", "rb") as f:
    model = pickle.load(f)
with open("tfidf.pkl", "rb") as f:
    tfidf = pickle.load(f)

stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()

def clean_review(text):
    text = re.sub('<.*?>', '', text)
    text = re.sub('[^a-zA-Z]', ' ', text)
    text = text.lower()
    words = [word for word in text.split() if word not in stop_words]
    words = [stemmer.stem(word) for word in words]
    return ' '.join(words)

class ReviewRequest(BaseModel):
    review: str

@app.get("/")
def root():
    return {"status": "Sentiment Analyzer is running!"}

@app.post("/predict")
def predict(req: ReviewRequest):
    cleaned = clean_review(req.review)
    vectorized = tfidf.transform([cleaned])
    prediction = model.predict(vectorized)[0]
    probability = model.predict_proba(vectorized)[0]
    confidence = round(float(max(probability)) * 100, 2)
    sentiment = "positive" if prediction == 1 else "negative"
    return {
        "sentiment": sentiment,
        "confidence": confidence,
        "positive_prob": round(float(probability[1]) * 100, 2),
        "negative_prob": round(float(probability[0]) * 100, 2),
    }

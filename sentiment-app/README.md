# 🧠 AI Sentiment Analyzer

> Paste any review → AI instantly detects Positive or Negative with confidence score!

**Tech Stack:** Python + FastAPI + React + Vite  
**Deploy:** Railway (backend) + Vercel (frontend)

---

## 📁 Project Structure

```
sentiment-app/
├── backend/
│   ├── main.py              ← FastAPI server
│   ├── requirements.txt     ← Python packages
│   ├── Procfile             ← Railway deploy config
│   ├── save_model_colab.py  ← Run this in Colab first!
│   ├── model.pkl            ← Trained model (Colab se download)
│   └── tfidf.pkl            ← TF-IDF vectorizer (Colab se download)
└── frontend/
    ├── src/
    │   ├── App.jsx          ← Main React component
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 STEP 1: Model Save Karo (Google Colab mein)

Colab mein apne trained model ke baad yeh cell chalao:

```python
import pickle
from google.colab import files

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("tfidf.pkl", "wb") as f:
    pickle.dump(tfidf, f)

files.download("model.pkl")
files.download("tfidf.pkl")
```

Yeh 2 files download hongi:
- `model.pkl`
- `tfidf.pkl`

Inko `backend/` folder mein rakh do!

---

## 🖥️ STEP 2: Local Test Karo

### Backend chalao:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# http://localhost:8000 pe chalega
```

### Frontend chalao (naya terminal):
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173 pe chalega
```

---

## ☁️ STEP 3: Deploy Karo

### Backend → Railway

1. github.com pe new repo banao: `sentiment-analyzer`
2. `backend/` folder ka code push karo
3. railway.app → New Project → Deploy from GitHub
4. `backend/` select karo
5. model.pkl aur tfidf.pkl bhi upload karo (Railway dashboard mein)
6. Deploy ho jaega → URL milega: `https://your-app.railway.app`

### Frontend → Vercel

1. `frontend/` folder mein `.env` file banao:
```
VITE_API_URL=https://your-app.railway.app
```
2. Vercel pe deploy karo
3. Root Directory: `frontend` set karo
4. Live URL milegi!

---

## 🎯 Features

- ⚡ Real-time sentiment detection
- 📊 Confidence score with animated ring
- 🎨 Mood meter (positive vs negative probability)
- 📝 Recent analysis history
- 💫 Particle animation background
- 📱 Fully responsive

---

Made with ❤️ — Python + FastAPI + React

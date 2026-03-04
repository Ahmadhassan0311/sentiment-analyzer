import pickle

# Colab mein yeh code chalao — model save karne ke liye
# Apne trained model aur tfidf ke baad yeh cell chalao

# Model save karo
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

# TF-IDF save karo
with open("tfidf.pkl", "wb") as f:
    pickle.dump(tfidf, f)

print("✅ model.pkl saved!")
print("✅ tfidf.pkl saved!")

# Google Colab se download karo
from google.colab import files
files.download("model.pkl")
files.download("tfidf.pkl")
print("✅ Files download ho gayi!")

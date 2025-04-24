# 📄 PDF Scrapper

**PDF Scrapper** is a full-stack AI-powered web application that allows users to upload PDF files, ask questions based on their contents, and get intelligent responses. It uses Google authentication, FastAPI backend, LangChain for context-based Q&A, and Hugging Face’s `flan-t5-base` model.

---

## 🧠 Features

- 🔐 Google Sign-In via Firebase Authentication
- 📤 Upload PDF files and parse them server-side
- 🤖 Ask questions based on PDF content
- 🧩 Uses HuggingFace `flan-t5-base` via LangChain
- 💡 Answer generation with prompt engineering
- 🎨 Interactive frontend built with React and Tailwind CSS

---

## 🛠️ Tech Stack

| Layer     | Technology                               |
|-----------|-------------------------------------------|
| Frontend  | React, Tailwind CSS, Vite, Firebase Auth  |
| Backend   | FastAPI, LangChain, SQLAlchemy, PyMuPDF   |
| LLM       | Hugging Face Hub (`flan-t5-base`)         |
| Auth      | Firebase (Google Sign-In)                 |
| Database  | SQLite (via SQLAlchemy)                   |

---
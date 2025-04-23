import { useState } from "react";
import { auth, provider, signInWithPopup } from"../firebase";

import axios from "axios";

function MainPage() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      setUser(result.user);
      setToken(idToken);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleUpload = async () => {
    if (!file || !token) return alert("Select file & login first!");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/upload_pdf", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded!");
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload error");
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question || !token) return;
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/ask",
        new URLSearchParams({ question }),
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      setAnswer(res.data.response);
    } catch (err) {
      console.error("Ask failed", err);
      alert("Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {!user ? (
        <button onClick={login}>Login with Google</button>
      ) : (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload} disabled={loading}>
            Upload PDF
          </button>

          <br /><br />

          <textarea
            rows={4}
            placeholder="Ask a question about your PDF"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <br />
          <button onClick={handleAsk} disabled={loading}>
            Ask
          </button>

          {answer && (
            <div style={{ marginTop: 20 }}>
              <strong>Answer:</strong>
              <p>{answer}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MainPage;

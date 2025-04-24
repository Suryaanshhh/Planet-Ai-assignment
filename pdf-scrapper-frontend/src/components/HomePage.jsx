import { useState } from "react";
import { auth, provider, signInWithPopup } from "../firebase";
import axios from "axios";
import FallingText from "./FallingText";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);

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
      alert("File uploaded successfully!");
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      
      {showContent && !user && (
        <div className="absolute inset-0 z-10">
          <FallingText
            className="h-screen w-full"
            text={`PDF Scrapper, a tool to extract text from PDF files and answer questions about them.`}
            highlightWords={["PDF", "Scrapper", "extract", "questions", "answers"]}
            highlightClass="text-green-400 font-bold"
            trigger="hover"
            backgroundColor="transparent"
            wireframes={false}
            gravity={0.56}
            fontSize="2rem"
            mouseConstraintStiffness={0.9}
          />
        </div>
      )}

      
      <div className="container mx-auto px-4 py-12 relative z-20">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            PDF Scrapper
          </h1>

          {!user ? (
            <div className="w-full max-w-md p-8 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700">
              <p className="text-gray-300 mb-6 text-center">
                Upload your PDFs and get intelligent answers to your questions about them.
              </p>
              <button
                onClick={login}
                className="w-full py-3 px-6 bg-transparent text-green-400 border-2 border-green-400 rounded-lg hover:bg-green-400 hover:text-black transition-all duration-300 flex items-center justify-center font-bold"
              >
                Login with Google
              </button>
            </div>
          ) : (
            <div className="w-full max-w-2xl bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-xl font-bold">
                  {user.displayName?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Welcome, {user.displayName}</h2>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>

              
              <div className="mb-8 p-6 border border-dashed border-gray-600 rounded-lg hover:border-green-400 transition-colors">
                <div className="flex flex-col items-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Select PDF File
                  </label>
                  {fileName && (
                    <div className="text-sm text-gray-300 mb-4">Selected: {fileName}</div>
                  )}
                  <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className={`px-6 py-2 rounded-lg ${
                      loading || !file
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 transition-colors text-black"
                    }`}
                  >
                    {loading ? "Uploading..." : "Upload PDF"}
                  </button>
                </div>
              </div>

             
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Ask about your PDF:</label>
                <textarea
                  rows={4}
                  placeholder="What would you like to know about your document?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white"
                />
              </div>

              <button
                onClick={handleAsk}
                disabled={loading || !question}
                className={`w-full py-3 rounded-lg mb-8 ${
                  loading || !question
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-green-400 hover:bg-green-500 transition-colors text-black font-medium"
                }`}
              >
                {loading ? "Processing..." : "Ask Question"}
              </button>

             
              {answer && (
                <div className="p-6 bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-semibold mb-3 text-green-400">Answer:</h3>
                  <p className="whitespace-pre-line text-gray-200">{answer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import os
import fitz  
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import HuggingFaceHub
from langchain.text_splitter import CharacterTextSplitter
from langchain.docstore.document import Document
from dotenv import load_dotenv


load_dotenv()


huggingfacehub_api_token = os.getenv("HUGGING_FACE_API")


llm = HuggingFaceHub(
    repo_id="google/flan-t5-base",
    task="text-generation",
    huggingfacehub_api_token=huggingfacehub_api_token,
    model_kwargs={"temperature": 0.1, "max_length": 512}  
)


qa_chain = load_qa_chain(llm, chain_type="stuff")

def extractText(pdf_path: str) -> str:
    """Extract text from a PDF file."""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text")
    return text

def generateText(question: str, context: str) -> str:
    """Generate an answer using LangChain with Hugging Face model."""
    
   
    enhanced_question = f"""
    Think carefully about the question below and refer to the context provided to form a detailed, reasoned answer:
    Question: {question}
    Context: {context}
    
    Please provide a well-thought-out, detailed answer.
    """

   
    if len(context) <= 2000:
        try:
           
            result = llm(enhanced_question)
            return result.strip() 
        except Exception as e:
            print(f"Direct approach failed: {e}")
         
    
   
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.create_documents([context])
    
    
    answers = []
    for doc in docs:
        
        result = qa_chain.run(input_documents=[doc], question=enhanced_question)
        answers.append(result)

   
    final_answer = " ".join(answers).strip()
    print(f"Answer: {final_answer}")
    return final_answer  

import fitz
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex

def extractText(pdf_path)-> str:
  doc=fitz.open(pdf_path)
  text=""
  for page in doc:
    text+=page.get_text()
    return text
  
def pdfPrepare(pdf_path:str):
  document=SimpleDirectoryReader(input_files=[pdf_path ]).load_data()
  index =VectorStoreIndex.from_documents(document)
  return index.as_query_engine()
 
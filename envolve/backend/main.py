from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from image_utils import extract_gps

app = FastAPI()

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    contents = await file.read()
    with open("temp.jpg", "wb") as f:
        f.write(contents)

    with open("temp.jpg", "rb") as f:
        gps = extract_gps(f)

    return {"file": file.filename, "gps": gps}

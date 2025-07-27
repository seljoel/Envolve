from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from image_utils import extract_gps

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}")

    contents = await file.read()
    with open("temp.jpg", "wb") as f:
        f.write(contents)
    print("Saved temp.jpg")

    with open("temp.jpg", "rb") as f:
        gps = extract_gps(f)

    if gps:
        print(f"Extracted GPS from image: {gps}")
    else:
        print("No GPS data found in image.")

    return {
        "file": file.filename,
        "gps": gps  # can be `None` if not found
    }

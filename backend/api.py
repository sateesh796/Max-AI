"""FastAPI backend for the existing MAX brain."""

from __future__ import annotations

import base64
import binascii
import struct
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, field_validator

from backend.brain_service import execute_text, get_status, transcribe_voice


PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIST = PROJECT_ROOT / "MAX-Frontend" / "dist"


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)


class CommandRequest(BaseModel):
    command: str = Field(..., min_length=1, max_length=5000)


class VoiceRequest(BaseModel):
    audio: str = Field(..., description="Base64-encoded WAV audio")

    @field_validator("audio")
    @classmethod
    def validate_audio(cls, value: str) -> str:
        if not value:
            raise ValueError("audio is required")
        try:
            base64.b64decode(value, validate=True)
        except (ValueError, TypeError, binascii.Error) as exc:
            raise ValueError("audio must be valid base64") from exc
        return value


app = FastAPI(
    title="MAX AI Backend",
    version="1.0.0",
    description="REST API for the existing MAX voice and text assistant brain.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

if FRONTEND_DIST.is_dir():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="frontend-assets")


@app.get("/api/status")
def status() -> dict[str, Any]:
    return get_status()


@app.post("/api/chat")
def chat(request: ChatRequest) -> dict[str, Any]:
    try:
        return execute_text(request.message)
    except Exception as exc:  # pragma: no cover - safety boundary for runtime failures
        raise HTTPException(status_code=500, detail=f"MAX could not process the message: {exc}") from exc


@app.post("/api/command")
def command(request: CommandRequest) -> dict[str, Any]:
    try:
        return execute_text(request.command)
    except Exception as exc:  # pragma: no cover - safety boundary for runtime failures
        raise HTTPException(status_code=500, detail=f"MAX could not execute the command: {exc}") from exc


@app.post("/api/voice")
def voice(request: VoiceRequest) -> dict[str, Any]:
    try:
        audio_bytes = base64.b64decode(request.audio, validate=True)
    except (ValueError, TypeError, binascii.Error) as exc:
        raise HTTPException(status_code=400, detail="The audio payload is not valid base64.") from exc

    if not audio_bytes or len(audio_bytes) < 12:
        raise HTTPException(status_code=400, detail="The audio payload is empty or incomplete.")

    if audio_bytes[:4] != b"RIFF" or audio_bytes[8:12] != b"WAVE":
        raise HTTPException(status_code=400, detail="The audio payload must be a valid WAV file.")

    if len(audio_bytes) < 44:
        raise HTTPException(status_code=400, detail="The audio payload is incomplete; WAV headers must include a format chunk.")

    riff_size = struct.unpack_from("<I", audio_bytes, 4)[0]
    if riff_size + 8 != len(audio_bytes):
        raise HTTPException(status_code=400, detail="The audio payload length does not match its WAV header.")

    if audio_bytes[12:16] != b"fmt ":
        raise HTTPException(status_code=400, detail="The audio payload is missing a WAV format chunk.")

    format_code = struct.unpack_from("<H", audio_bytes, 20)[0]
    if format_code != 1:
        raise HTTPException(status_code=400, detail="The audio payload uses an unsupported WAV format.")

    try:
        return transcribe_voice(audio_bytes)
    except Exception as exc:  # pragma: no cover - safety boundary for runtime failures
        raise HTTPException(status_code=500, detail=f"Voice processing failed: {exc}") from exc


@app.get("/")
def root() -> FileResponse:
    index_path = FRONTEND_DIST / "index.html"
    if not index_path.is_file():
        raise HTTPException(status_code=503, detail="MAX frontend has not been built yet.")
    return FileResponse(index_path)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.api:app", host="127.0.0.1", port=8000, reload=False)

"""Compatibility layer between the existing MAX console brain and the API frontend."""

from __future__ import annotations

import importlib.util
import os
import re
import urllib.parse
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parent.parent
BRAIN_PATH = BASE_DIR / "brain.py" / "Max2.0" / "Max.py"


def _load_brain():
    """Load the existing MAX implementation without changing its source file."""
    module_name = "max_existing_brain"
    spec = importlib.util.spec_from_file_location(module_name, BRAIN_PATH)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not load MAX brain from {BRAIN_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


BRAIN = _load_brain()


def get_status() -> dict[str, Any]:
    return {
        "status": "ok",
        "backend": "MAX brain loaded",
        "frontend": {
            "url": "http://127.0.0.1:8000",
            "allowed_origin": "http://127.0.0.1:8000",
        },
        "features": sorted(
            {
                "text_commands",
                "voice_transcription",
                "website_opening",
                "web_search",
                "youtube_search",
                "music_playback",
                "browser_controls",
                "time_queries",
                "chatgpt_integration",
            }
        ),
    }


_OPEN_PATTERN = re.compile(
    r"^(?:please\s+)?(?:open|launch|go\s+to|start)\s+(?:the\s+|my\s+)?(.+?)\s*[.!?]*$",
    re.IGNORECASE,
)
_YOUTUBE_SEARCH_PATTERNS = (
    re.compile(
        r"^(?:please\s+)?(?:search|find|look\s+up)\s+(?:on\s+)?youtube\s+(?:for\s+)?(.+?)\s*[.!?]*$",
        re.IGNORECASE,
    ),
    re.compile(
        r"^(?:please\s+)?(?:search|find|look\s+up)\s+(.+?)\s+on\s+youtube\s*[.!?]*$",
        re.IGNORECASE,
    ),
    re.compile(
        r"^(?:please\s+)?play\s+(.+?)\s+on\s+youtube\s*[.!?]*$",
        re.IGNORECASE,
    ),
)
_GOOGLE_SEARCH_PATTERNS = (
    re.compile(
        r"^(?:please\s+)?(?:search|find|look\s+up)\s+(?:on\s+)?google\s+(?:for\s+)?(.+?)\s*[.!?]*$",
        re.IGNORECASE,
    ),
    re.compile(
        r"^(?:please\s+)?(?:search|find|look\s+up)\s+(.+?)\s+on\s+google\s*[.!?]*$",
        re.IGNORECASE,
    ),
)


def _resolve_open_url(command_text: str) -> dict[str, Any] | None:
    """Map open/search commands to a URL for the client's browser to open.

    The backend runs headless, so it must never launch a browser itself.
    """
    text = " ".join(command_text.split())
    websites = getattr(BRAIN, "WEBSITES", {})

    for pattern in _YOUTUBE_SEARCH_PATTERNS:
        match = pattern.match(text)
        if match and match.group(1).strip():
            query = match.group(1).strip()
            url = "https://www.youtube.com/results?search_query=" + urllib.parse.quote_plus(query)
            return {"type": "open_url", "target": url, "label": query}

    for pattern in _GOOGLE_SEARCH_PATTERNS:
        match = pattern.match(text)
        if match and match.group(1).strip():
            query = match.group(1).strip()
            url = "https://www.google.com/search?q=" + urllib.parse.quote_plus(query)
            return {"type": "open_url", "target": url, "label": query}

    match = _OPEN_PATTERN.match(text)
    if match:
        site = BRAIN.canonical_site(match.group(1))
        if site in websites:
            return {"type": "open_url", "target": websites[site], "label": site}

    return None


def execute_text(command: str) -> dict[str, Any]:
    """Execute a user command through the existing brain and return structured data."""
    command_text = (command or "").strip()
    if not command_text:
        return {
            "success": False,
            "response": "Please enter a command.",
            "action": {"type": "invalid_command", "target": None},
            "status": "error",
        }

    open_url_action = _resolve_open_url(command_text)
    if open_url_action is not None:
        return {
            "success": True,
            "response": f"Opening {open_url_action['label']}",
            "action": open_url_action,
            "status": "completed",
        }

    if BRAIN.groq_client is None:
        response = BRAIN.rule_based_command(BRAIN.normalize_command(command_text))
        action_type = "assistant_response"
    else:
        response = BRAIN.run_agent(command_text)
        action_type = "assistant_response"
        if response is None:
            response = BRAIN.rule_based_command(BRAIN.normalize_command(command_text))

    if response is False:
        response = "Goodbye."

    return {
        "success": True,
        "response": response or "Done.",
        "action": {"type": action_type, "target": command_text},
        "status": "completed",
    }


def transcribe_voice(audio_bytes: bytes) -> dict[str, Any]:
    """Transcribe uploaded WAV audio through the existing Groq integration."""
    if not audio_bytes:
        return {
            "success": False,
            "response": "No audio was provided.",
            "status": "error",
        }

    if BRAIN.groq_client is None:
        return {
            "success": False,
            "response": "Groq is not configured. Add GROQ_API_KEY to the backend .env file.",
            "status": "error",
        }

    text = BRAIN.transcribe_with_groq(audio_bytes)
    return {
        "success": bool(text),
        "response": text,
        "action": {"type": "voice_transcription", "target": None},
        "status": "completed" if text else "error",
    }

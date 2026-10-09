import webbrowser
import os
import urllib.parse
import urllib.request
import urllib.error
import datetime
import sys
import re
import ctypes
import time
import io
import threading
import wave
import json
import atexit
import difflib
from collections import deque

import numpy as np
import pyautogui
from groq import Groq

try:
    import sounddevice
except ImportError:  # optional dependency
    sounddevice = None

try:
    import pyttsx3
except ImportError:  # optional dependency
    pyttsx3 = None

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.common.keys import Keys
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
except ImportError:  # optional dependency (needed for single-tab control)
    webdriver = None

# ============================================================
# MAX - AI-driven Voice + Text Desktop Assistant  (v3)
#
# Install:  pip install groq sounddevice numpy pyttsx3 selenium
#
# .env file next to this script:
#     GROQ_API_KEY=your_key_here
# Optional .env settings:
#     MIC_DEVICE=3                  force a microphone index (see Mic Test)
#     GROQ_LANGUAGE=en              en, hi, te ... (empty = auto-detect)
#     GROQ_TRANSCRIPTION_MODEL=whisper-large-v3
#     REQUIRE_WAKE_WORD=1           0 = react to every sentence
#     PUSH_TO_TALK=0                1 = press Enter, then speak (best when music plays)
# ============================================================

APP_NAME = "MAX"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CURRENT_SITE = None
CHAT_HISTORY = deque(maxlen=6)
MIC = None  # shared Microphone instance


# -----------------------------
# Config / Groq client
# -----------------------------

def load_env_file():
    env_path = os.path.join(BASE_DIR, ".env")
    try:
        with open(env_path, encoding="utf-8") as env_file:
            for line in env_file:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                name, value = line.split("=", 1)
                value = value.strip()
                if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                    value = value[1:-1]
                if name.strip():
                    os.environ.setdefault(name.strip(), value)
    except OSError:
        pass


load_env_file()
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "").strip()
GROQ_MODEL = os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b").strip()
GROQ_FAST_MODEL = os.environ.get("GROQ_FAST_MODEL", "openai/gpt-oss-20b").strip()
GROQ_TRANSCRIPTION_MODEL = os.environ.get(
    "GROQ_TRANSCRIPTION_MODEL", "whisper-large-v3"
).strip()
GROQ_LANGUAGE = os.environ.get("GROQ_LANGUAGE", "en").strip()
REQUIRE_WAKE_WORD = os.environ.get("REQUIRE_WAKE_WORD", "1").strip() != "0"
PUSH_TO_TALK = os.environ.get("PUSH_TO_TALK", "0").strip() == "1"
groq_client = Groq(api_key=GROQ_API_KEY, timeout=30.0, max_retries=1) if GROQ_API_KEY else None


# -----------------------------
# Text-to-Speech
# -----------------------------

engine = None
if pyttsx3 is not None:
    try:
        engine = pyttsx3.init()
        engine.setProperty("rate", 175)
        engine.setProperty("volume", 1.0)
    except Exception as exc:
        print(f"TTS initialization failed: {exc}")
        engine = None


def flush_mic():
    """Discard audio captured while MAX was talking (so it never hears itself)."""
    if MIC is not None:
        time.sleep(0.25)
        MIC.flush()


def speak(text):
    message = str(text or "").strip()
    if not message:
        return
    print(f"MAX: {message}")
    if engine is not None:
        try:
            engine.say(message)
            engine.runAndWait()
        except Exception as exc:
            print(f"TTS error: {exc}")
    flush_mic()


_last_error_spoken = 0.0


def speak_error(text, cooldown=30.0):
    """Speak an error at most once per cooldown so a bad connection can't spam."""
    global _last_error_spoken
    now = time.monotonic()
    if now - _last_error_spoken >= cooldown:
        _last_error_spoken = now
        speak(text)
    else:
        print(f"(suppressed) {text}")


# -----------------------------
# Browser: ONE Chrome window, ONE tab, reused for every command
# -----------------------------

PROFILE_DIR = os.path.join(BASE_DIR, "max_chrome_profile")  # keeps your logins
WHATSAPP_PROFILE_DIR = os.path.join(BASE_DIR, "max_whatsapp_profile")

PAUSE_JS = "const v=document.querySelector('video'); if(!v){return false;} v.pause(); return true;"
RESUME_JS = "const v=document.querySelector('video'); if(!v){return false;} v.play(); return true;"
NEXT_JS = "const b=document.querySelector('.ytp-next-button'); if(!b){return false;} b.click(); return true;"
DUCK_JS = (
    "document.querySelectorAll('video').forEach(v=>{"
    "if(v.dataset.maxVolume===undefined){v.dataset.maxVolume=String(v.volume);}"
    "v.volume=0.05;}); return true;"
)
UNDUCK_JS = (
    "document.querySelectorAll('video').forEach(v=>{"
    "if(v.dataset.maxVolume!==undefined){v.volume=parseFloat(v.dataset.maxVolume);"
    "delete v.dataset.maxVolume;}}); return true;"
)

CHROME_PATHS = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]
_FALLBACK_BROWSER = None


def get_fallback_browser():
    """Used only when Selenium is unavailable (opens new tabs, cannot reuse one)."""
    global _FALLBACK_BROWSER
    if _FALLBACK_BROWSER is not None:
        return _FALLBACK_BROWSER
    for path in CHROME_PATHS:
        if path and os.path.exists(path):
            webbrowser.register("max-chrome", None, webbrowser.BackgroundBrowser(path))
            _FALLBACK_BROWSER = webbrowser.get("max-chrome")
            return _FALLBACK_BROWSER
    try:
        _FALLBACK_BROWSER = webbrowser.get()
    except webbrowser.Error:
        _FALLBACK_BROWSER = webbrowser
    return _FALLBACK_BROWSER


class BrowserController:
    def __init__(self, profile_dir=PROFILE_DIR):
        self.profile_dir = profile_dir
        self.driver = None
        self.failed = False
        self._warned = False

    def _start(self):
        options = webdriver.ChromeOptions()
        options.page_load_strategy = "eager"  # don't wait for every YouTube resource
        options.add_argument(f"--user-data-dir={self.profile_dir}")
        options.add_argument("--autoplay-policy=no-user-gesture-required")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("--start-maximized")
        options.add_argument("--no-first-run")
        options.add_argument("--no-default-browser-check")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option(
            "prefs",
            {"credentials_enable_service": False, "profile.password_manager_enabled": False},
        )
        self.driver = webdriver.Chrome(options=options)

    def ensure(self):
        """Make sure a usable window exists. Returns False if Selenium can't be used."""
        if webdriver is None:
            if not self._warned:
                print("Tip: run 'pip install selenium' so MAX can reuse a single browser tab.")
                self._warned = True
            return False
        if self.failed:
            return False

        if self.driver is not None:
            try:
                handles = self.driver.window_handles
                if not handles:
                    raise RuntimeError("browser has no windows")
                try:
                    current = self.driver.current_window_handle
                except Exception:
                    current = None
                if current not in handles:
                    self.driver.switch_to.window(handles[0])
                return True
            except Exception:
                self.quit()  # window was closed by the user: start fresh

        try:
            self._start()
            return True
        except Exception as exc:
            self.failed = True
            print(f"Could not start the controlled Chrome ({type(exc).__name__}: {exc}).")
            print("Falling back to the default browser (it may open new tabs).")
            return False

    def available(self):
        """True if a controlled window is already running (never starts one)."""
        if self.driver is None:
            return False
        try:
            return bool(self.driver.window_handles)
        except Exception:
            self.quit()
            return False

    def quit(self):
        if self.driver is not None:
            try:
                self.driver.quit()
            except Exception:
                pass
            self.driver = None

    def open(self, url):
        """Navigate the single tab to url."""
        for _ in range(2):
            if not self.ensure():
                break
            try:
                self.driver.get(url)
                return True
            except Exception as exc:
                print(f"Browser error ({type(exc).__name__}); restarting the browser.")
                self.quit()
        try:
            get_fallback_browser().open(url, new=0, autoraise=True)
        except Exception as exc:
            print(f"Could not open browser: {exc}")
        return False

    def run_js(self, script):
        if not self.available():
            return None
        try:
            return self.driver.execute_script(script)
        except Exception:
            return None

    def start_video(self):
        """Wait for the player and make sure it is playing."""
        if not self.available():
            return
        try:
            WebDriverWait(self.driver, 8).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "video"))
            )
            self.driver.execute_script(
                "const v=document.querySelector('video'); if(v && v.paused){v.play();}"
            )
        except Exception:
            pass

    def first_youtube_result(self, search_url):
        """Open the results page and return the first real video link."""
        if not self.ensure():
            return None
        try:
            self.driver.get(search_url)
            link = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "ytd-video-renderer a#video-title"))
            )
            return link.get_attribute("href")
        except Exception:
            return None

    def submit_chatgpt(self):
        """Press Enter in the ChatGPT prompt box once the page has loaded."""
        if not self.available():
            return False
        try:
            box = WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "#prompt-textarea"))
            )
            time.sleep(1.0)
            box.send_keys(Keys.ENTER)
            return True
        except Exception:
            return False

    def duck(self, enable):
        self.run_js(DUCK_JS if enable else UNDUCK_JS)


BROWSER = BrowserController()
WHATSAPP_BROWSER = BrowserController(WHATSAPP_PROFILE_DIR)
WHATSAPP_REPLY_STATE = {"last_id": None, "last_text": "", "thread": None, "stop": False}
atexit.register(BROWSER.quit)
atexit.register(WHATSAPP_BROWSER.quit)


def open_chrome(url=None, browser=None):
    target_url = url or "https://www.google.com"
    if not target_url.startswith(("http://", "https://")):
        target_url = "https://" + target_url
    browser = browser or BROWSER
    browser.open(target_url)


def safe_url(text):
    """Allow only plain http(s) targets (protects against model-chosen junk)."""
    text = (text or "").strip()
    if not text:
        return None
    if not text.startswith(("http://", "https://")):
        if "." not in text or " " in text:
            return None
        text = "https://" + text
    parsed = urllib.parse.urlparse(text)
    if parsed.scheme in ("http", "https") and parsed.netloc:
        return text
    return None


WEBSITES = {
    "google": "https://www.google.com",
    "youtube": "https://www.youtube.com",
    "gmail": "https://mail.google.com",
    "github": "https://github.com",
    "facebook": "https://www.facebook.com",
    "instagram": "https://www.instagram.com",
    "whatsapp": "https://web.whatsapp.com",
    "linkedin": "https://www.linkedin.com",
    "chatgpt": "https://chatgpt.com",
    "stackoverflow": "https://stackoverflow.com",
}

SITE_ALIASES = {
    "you tube": "youtube", "utube": "youtube", "youtub": "youtube",
    "chat gpt": "chatgpt", "chat g p t": "chatgpt",
    "git hub": "github",
    "stack overflow": "stackoverflow",
    "g mail": "gmail", "mail": "gmail", "email": "gmail",
    "whats app": "whatsapp",
    "insta": "instagram",
    "linked in": "linkedin",
    "face book": "facebook",
}


def canonical_site(name):
    name = (name or "").lower().strip()
    name = re.sub(r"^(the|my)\s+", "", name)
    name = re.sub(r"\s+(website|site|app|page)$", "", name)
    return SITE_ALIASES.get(name, name)


def open_website(site, announce=True):
    global CURRENT_SITE
    name = canonical_site(site)

    if name in WEBSITES:
        CURRENT_SITE = name
        if name == "whatsapp":
            open_chrome(WEBSITES[name], browser=WHATSAPP_BROWSER)
        else:
            open_chrome(WEBSITES[name])
        if announce:
            speak(f"Opening {name}")
        return True

    url = safe_url(name)
    if url:
        CURRENT_SITE = "custom website"
        open_chrome(url)
        if announce:
            speak("Opening the website.")
        return True

    if name:
        CURRENT_SITE = "google"
        google_search(name, announce=False)
        if announce:
            speak(f"Opening Google for {name}.")
        return True

    return False


def open_whatsapp_search(contact=""):
    """Open WhatsApp Web and focus the search box so a contact name can be entered."""
    contact = (contact or "").strip()
    open_website("whatsapp", announce=False)
    time.sleep(4)

    script = """
    (() => {
      const selectors = [
        '[data-testid="chat-search"]',
        '[data-icon="search"]',
        'button[aria-label*="Search"]',
        'button[title*="Search"]',
        'input[placeholder*="Search"]',
        'input[aria-label*="Search"]',
        'div[role="button"][title*="Search"]'
      ];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          el.click();
          return true;
        }
      }
      const candidate = [...document.querySelectorAll('button, div[role="button"], input')].find(el => /(search|find)/i.test((el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('placeholder') || '').trim()));
      if (candidate) {
        candidate.click?.();
        if (candidate.focus) candidate.focus();
        return true;
      }
      return false;
    })();
    """

    focused = WHATSAPP_BROWSER.run_js(script)
    if focused is not True:
        print("Could not click the WhatsApp search icon; falling back to direct input focus.")

    if not contact:
        speak("WhatsApp search is ready.")
        return True

    time.sleep(0.8)
    try:
        pyautogui.hotkey("ctrl", "a")
        pyautogui.press("backspace")
        pyautogui.write(contact, interval=0.03)
    except Exception as exc:
        print(f"Could not type the WhatsApp search query: {exc}")
        return False

    speak(f"Searching WhatsApp for {contact}.")
    return True


def whatsapp_focus_input():
    """Focus the message box in WhatsApp Web so we can type a message."""
    script = """
    (() => {
      const selectors = [
        'div[contenteditable="true"][role="textbox"]',
        'div[contenteditable="true"]',
        'div[role="textbox"][contenteditable="true"]',
        'div[role="textbox"]',
        'div[contenteditable="plaintext-only"]'
      ];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          el.focus();
          el.dispatchEvent(new Event('input', {bubbles: true}));
          return true;
        }
      }
      return false;
    })();
    """
    return WHATSAPP_BROWSER.run_js(script) is True


def whatsapp_reply_monitor_loop():
    """Watch the WhatsApp chat for a new incoming message and announce it."""
    while True:
        if WHATSAPP_REPLY_STATE["stop"]:
            return
        try:
            if WHATSAPP_BROWSER.driver is None or not WHATSAPP_BROWSER.available():
                time.sleep(2)
                continue
            payload = WHATSAPP_BROWSER.driver.execute_script(
                """
                (() => {
                  const answers = [...document.querySelectorAll('.message-in')];
                  const last = answers[answers.length - 1];
                  if (!last) return null;
                  const text = last.innerText || last.textContent || '';
                  const id = last.getAttribute('data-id') || (last.dataset && last.dataset.id) || text;
                  const author = document.querySelector('header span[title]')?.getAttribute('title') || document.querySelector('header [title]')?.getAttribute('title') || 'WhatsApp contact';
                  return { id: String(id), text: String(text).trim(), author: String(author).trim() };
                })();
                """
            )
            if payload and isinstance(payload, dict):
                content = (payload.get("text") or "").strip()
                message_id = str(payload.get("id") or "").strip()
                if content and message_id and message_id != WHATSAPP_REPLY_STATE["last_id"]:
                    WHATSAPP_REPLY_STATE["last_id"] = message_id
                    WHATSAPP_REPLY_STATE["last_text"] = content
                    speaker = payload.get("author") or "WhatsApp contact"
                    print(f"\nNew WhatsApp reply from {speaker}: {content}")
                    try:
                        speak(f"New WhatsApp reply from {speaker}: {content}")
                    except Exception:
                        print(f"New WhatsApp reply: {content}")
                    break
        except Exception:
            pass
        time.sleep(2)


def whatsapp_send_message(message, contact=None):
    """Open WhatsApp Web and send a message using the persistent WhatsApp browser profile."""
    message = (message or "").strip()
    if not message:
        speak("Please provide a message to send.")
        return False

    WHATSAPP_REPLY_STATE["stop"] = False
    WHATSAPP_REPLY_STATE["last_id"] = None
    WHATSAPP_REPLY_STATE["last_text"] = ""

    open_website("whatsapp", announce=False)
    time.sleep(4)

    if contact:
        open_whatsapp_search(contact)
        time.sleep(1.5)

    if not whatsapp_focus_input():
        speak("Please open WhatsApp before sending a message.")
        return False

    try:
        pyautogui.write(message, interval=0.03)
        time.sleep(0.2)
        pyautogui.press("enter")
    except Exception as exc:
        print(f"Could not send the WhatsApp message: {exc}")
        return False

    speak("Message sent. I will notify you when a reply arrives.")

    reply_thread = threading.Thread(target=whatsapp_reply_monitor_loop, daemon=True)
    WHATSAPP_REPLY_STATE["thread"] = reply_thread
    reply_thread.start()
    return True


# -----------------------------
# Search + YouTube
# -----------------------------

def clean_search_query(query):
    """Only drop a leading 'please' - never articles, which belong to song titles."""
    query = (query or "").strip()
    return re.sub(r"^please\s+", "", query, flags=re.IGNORECASE).strip()


def google_search(query, announce=True):
    query = clean_search_query(query) or "latest news"
    open_chrome("https://www.google.com/search?q=" + urllib.parse.quote_plus(query))
    if announce:
        speak(f"Searching Google for {query}")


def youtube_search(query, announce=True):
    query = clean_search_query(query) or "popular songs"
    open_chrome("https://www.youtube.com/results?search_query=" + urllib.parse.quote_plus(query))
    if announce:
        speak(f"Searching YouTube for {query}")


def extract_youtube_video_id(page):
    if not page:
        return None
    match = re.search(r'"videoId"\s*:\s*"([A-Za-z0-9_-]{11})"', page)
    return match.group(1) if match else None


GENERIC_MEDIA_WORDS = {
    "song", "songs", "music", "a song", "the song", "this song",
    "some songs", "some music", "video", "videos", "a video",
    "the video", "this video",
}


def youtube_play(query, announce=True):
    query = (query or "").strip()
    if not query or query.lower() in GENERIC_MEDIA_WORDS:
        query = "popular songs"

    search_url = "https://www.youtube.com/results?search_query=" + urllib.parse.quote_plus(query)

    # 1) fast path: read the video id straight from the results HTML
    video_id = None
    request = urllib.request.Request(search_url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            video_id = extract_youtube_video_id(response.read().decode("utf-8", errors="replace"))
    except (urllib.error.URLError, OSError) as error:
        print(f"Could not read YouTube results directly: {error}")

    if video_id:
        BROWSER.open(f"https://www.youtube.com/watch?v={video_id}&autoplay=1")
        BROWSER.start_video()
        if announce:
            speak(f"Playing {query}")
        return f"Started playing {query}."

    # 2) fallback: let the real browser find the first video
    link = BROWSER.first_youtube_result(search_url)
    if link:
        BROWSER.open(link)
        BROWSER.start_video()
        if announce:
            speak(f"Playing {query}")
        return f"Started playing {query}."

    # 3) last resort: show the results page
    BROWSER.open(search_url)
    if announce:
        speak(f"I couldn't pick a video automatically. Showing YouTube results for {query}.")
    return f"Couldn't start playback automatically; opened YouTube results for {query}."


# -----------------------------
# ChatGPT website
# -----------------------------

def submit_chatgpt_prompt():
    """Windows-only fallback: focus the ChatGPT window and press Enter."""
    windll = getattr(ctypes, "windll", None)
    winfunctype = getattr(ctypes, "WINFUNCTYPE", None)
    if windll is None or winfunctype is None:
        print("Automatic ChatGPT submission requires Windows.")
        return False

    time.sleep(7)
    user32 = windll.user32
    windows = []
    proc_type = winfunctype(ctypes.c_bool, ctypes.c_void_p, ctypes.c_void_p)

    def collect(hwnd, _):
        if not user32.IsWindowVisible(hwnd):
            return True
        length = user32.GetWindowTextLengthW(hwnd)
        title = ctypes.create_unicode_buffer(length + 1)
        user32.GetWindowTextW(hwnd, title, len(title))
        windows.append((hwnd, title.value.lower()))
        return True

    callback = proc_type(collect)
    user32.EnumWindows(callback, 0)

    chatgpt_window = next((h for h, t in windows if "chatgpt" in t), None)
    foreground = user32.GetForegroundWindow()
    foreground_is_chrome = any(h == foreground and "chrome" in t for h, t in windows)
    hwnd = chatgpt_window or (foreground if foreground_is_chrome else None)

    if hwnd is None:
        print("Could not find a Chrome window to submit the prompt.")
        return False

    user32.ShowWindow(hwnd, 9)
    user32.BringWindowToTop(hwnd)
    user32.SetForegroundWindow(hwnd)
    time.sleep(0.5)

    if user32.GetForegroundWindow() != hwnd:
        print("Windows did not allow MAX to focus the Chrome window.")
        return False

    user32.keybd_event(0x0D, 0, 0, 0)
    user32.keybd_event(0x0D, 0, 0x0002, 0)
    return True


def chatgpt_prompt(prompt, announce=True):
    prompt = (prompt or "").strip()
    if not prompt:
        message = "Please provide a question for ChatGPT."
        if announce:
            speak(message)
        return message
    BROWSER.open("https://chatgpt.com/?q=" + urllib.parse.quote_plus(prompt))
    if BROWSER.available() and BROWSER.submit_chatgpt():
        message = "Sent your question to ChatGPT."
    elif submit_chatgpt_prompt():
        message = "Sent your question to ChatGPT."
    else:
        message = "I opened ChatGPT with your question, but could not submit it."
    if announce:
        speak(message)
    return message


# -----------------------------
# Playback + window control
# -----------------------------

def press_media_key():
    """Fallback only: the OS play/pause key TOGGLES playback."""
    windll = getattr(ctypes, "windll", None)
    if windll is None:
        return False
    user32 = windll.user32
    VK_MEDIA_PLAY_PAUSE, KEYUP = 0xB3, 0x0002
    user32.keybd_event(VK_MEDIA_PLAY_PAUSE, 0, 0, 0)
    time.sleep(0.05)
    user32.keybd_event(VK_MEDIA_PLAY_PAUSE, 0, KEYUP, 0)
    return True


def stop_playback():
    """Pause the video exactly (no toggling). Falls back to the media key."""
    if BROWSER.run_js(PAUSE_JS):
        return True
    return press_media_key()


def resume_playback():
    if BROWSER.run_js(RESUME_JS):
        return True
    return press_media_key()


def next_video():
    return bool(BROWSER.run_js(NEXT_JS))


def close_tab_hotkey():
    """Fallback only: Ctrl+W in whatever window has focus."""
    windll = getattr(ctypes, "windll", None)
    if windll is None:
        return False
    user32 = windll.user32
    VK_CONTROL, VK_W, KEYUP = 0x11, 0x57, 0x0002
    user32.keybd_event(VK_CONTROL, 0, 0, 0)
    user32.keybd_event(VK_W, 0, 0, 0)
    user32.keybd_event(VK_W, 0, KEYUP, 0)
    user32.keybd_event(VK_CONTROL, 0, KEYUP, 0)
    return True


def close_browser():
    global CURRENT_SITE
    CURRENT_SITE = None
    if BROWSER.available():
        BROWSER.quit()
        return True
    return close_tab_hotkey()


# -----------------------------
# Microphone: persistent stream, band-limited VAD, auto-calibration
# -----------------------------

BLOCK_SECONDS = 0.05  # 50 ms analysis blocks
BAD_DEVICE_WORDS = ("stereo mix", "loopback", "virtual", "what u hear")


def pick_input_device():
    devices = sounddevice.query_devices()

    override = os.environ.get("MIC_DEVICE", "").strip()
    if override.isdigit():
        index = int(override)
        if 0 <= index < len(devices) and devices[index].get("max_input_channels", 0) > 0:
            return index

    candidates = []
    default = sounddevice.default.device[0]
    if isinstance(default, int) and 0 <= default < len(devices):
        candidates.append(default)
    candidates.extend(range(len(devices)))

    for index in candidates:
        device = devices[index]
        name = str(device.get("name", "")).lower()
        if device.get("max_input_channels", 0) > 0 and not any(w in name for w in BAD_DEVICE_WORDS):
            return index
    return None


def enhance_audio(samples, rate):
    """Remove rumble below 90 Hz, then raise quiet speech to a good level."""
    if samples.size == 0:
        return samples.astype(np.int16)
    spectrum = np.fft.rfft(samples)
    freqs = np.fft.rfftfreq(samples.size, 1.0 / rate)
    spectrum[freqs < 90] = 0
    samples = np.fft.irfft(spectrum, samples.size)
    reference = float(np.percentile(np.abs(samples), 99.5))
    if reference > 1:
        gain = float(np.clip(0.6 * 32767 / reference, 1.0, 10.0))
        samples = samples * gain
    return np.clip(samples, -32768, 32767).astype(np.int16)


class Microphone:
    def __init__(self):
        self.stream = None
        self.device = None
        self.sample_rate = 16000
        self.block = 800
        self._band_mask = None
        self.noise_floor = 100.0
        self.last_peak = 0.0
        self.last_voice_seconds = 0.0

    def _try_open(self, device, rate, channels):
        block = max(1, int(rate * BLOCK_SECONDS))
        try:
            stream = sounddevice.InputStream(
                device=device, samplerate=rate, channels=channels,
                dtype="int16", blocksize=block,
            )
            stream.start()
        except Exception as exc:
            return None, block, exc
        return stream, block, None

    def open(self):
        if sounddevice is None:
            raise RuntimeError("The sounddevice package is not installed.")

        device = pick_input_device()
        if device is None:
            raise RuntimeError("No usable microphone was found.")

        info = sounddevice.query_devices(device)
        max_channels = int(info.get("max_input_channels", 1))
        rates = [16000, int(info.get("default_samplerate", 44100))]
        last_error = None

        for rate in rates:
            for channels in (1, 2):
                if channels > max_channels:
                    continue
                stream, block, error = self._try_open(device, rate, channels)
                if stream is not None:
                    self.stream, self.device = stream, device
                    self.sample_rate, self.block = rate, block
                    break
                last_error = error
            if self.stream is not None:
                break

        if self.stream is None:
            raise RuntimeError(f"Could not open the microphone: {last_error}")

        freqs = np.fft.rfftfreq(self.block, 1.0 / self.sample_rate)
        self._band_mask = ((freqs >= 300) & (freqs <= 3400)).astype(np.float32)

        print("Calibrating microphone - stay quiet for a second...")
        self.calibrate()

    def close(self):
        if self.stream is not None:
            try:
                self.stream.stop()
                self.stream.close()
            except Exception:
                pass
            self.stream = None

    def read_block(self):
        """Return (mono int16 bytes, speech-band level)."""
        data, _ = self.stream.read(self.block)
        mono = data.mean(axis=1) if data.ndim > 1 else data.astype(np.float32)
        mono = mono.astype(np.float32)
        spectrum = np.fft.rfft(mono) * self._band_mask
        filtered = np.fft.irfft(spectrum, mono.size)
        level = float(np.sqrt(np.mean(filtered * filtered)))
        return mono.astype(np.int16).tobytes(), level

    def calibrate(self, seconds=1.0):
        levels = sorted(self.read_block()[1] for _ in range(int(seconds / BLOCK_SECONDS)))
        self.noise_floor = max(levels[len(levels) // 2], 30.0)

    def flush(self):
        try:
            available = self.stream.read_available
            if available > 0:
                self.stream.read(available)
        except Exception:
            pass

    def thresholds(self):
        start = min(max(self.noise_floor * 3.0, 120.0), 3500.0)
        stop = min(max(self.noise_floor * 1.8, 70.0), 2000.0)
        return start, stop

    def record_phrase(self, wait_timeout=6.0, max_duration=8.0, end_silence=0.8):
        """Block until one spoken phrase is captured. Returns WAV bytes or None."""
        pre_roll = deque(maxlen=6)  # ~300 ms kept from before speech began
        chunks = []
        started = None
        last_voice = None
        last_voice_index = 0
        voice_frames = 0
        hot = 0  # consecutive loud blocks (ignores clicks/pops)
        peak = 0.0
        begin = time.monotonic()

        while True:
            chunk, level = self.read_block()
            now = time.monotonic()
            start_thr, stop_thr = self.thresholds()

            if started is None:
                pre_roll.append(chunk)
                hot = hot + 1 if level >= start_thr else 0
                if hot >= 2:
                    started = last_voice = now
                    chunks.extend(pre_roll)
                    last_voice_index = len(chunks)
                    voice_frames = hot
                    peak = level
                else:
                    if level < start_thr:  # slowly track background noise
                        self.noise_floor = 0.95 * self.noise_floor + 0.05 * level
                    if now - begin >= wait_timeout:
                        return None
                continue

            chunks.append(chunk)
            peak = max(peak, level)
            if level >= stop_thr:
                last_voice = now
                last_voice_index = len(chunks)
                voice_frames += 1

            if now - last_voice >= end_silence or now - started >= max_duration:
                break

        self.last_peak = peak
        self.last_voice_seconds = voice_frames * BLOCK_SECONDS
        if self.last_voice_seconds < 0.3:  # too short to be a command
            return None

        # drop the long trailing silence (keeps ~300 ms)
        keep = min(len(chunks), last_voice_index + int(0.3 / BLOCK_SECONDS))
        return self.to_wav(chunks[:keep])

    def to_wav(self, chunks):
        samples = np.frombuffer(b"".join(chunks), dtype=np.int16).astype(np.float32)
        samples = enhance_audio(samples, self.sample_rate)
        buffer = io.BytesIO()
        with wave.open(buffer, "wb") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(self.sample_rate)
            wav_file.writeframes(samples.tobytes())
        return buffer.getvalue()


def get_mic():
    global MIC
    if MIC is None:
        mic = Microphone()
        mic.open()
        MIC = mic
    return MIC


def reset_mic():
    global MIC
    if MIC is not None:
        MIC.close()
    MIC = None


# -----------------------------
# Speech-to-text
# -----------------------------

WHISPER_HINT = "YouTube, Google, Gmail, GitHub, WhatsApp, LinkedIn, ChatGPT, Max."
JUNK_PHRASES = {
    "thank you", "thanks", "thank you for watching", "thanks for watching",
    "you", "bye", "okay", "uh", "um", "hmm", "mm",
}


def _segment_value(segment, key, default=0.0):
    if isinstance(segment, dict):
        return segment.get(key, default)
    return getattr(segment, key, default)


def transcribe_with_groq(audio_data):
    if groq_client is None:
        speak("Groq is not configured. Add GROQ_API_KEY to the .env file.")
        return ""

    kwargs = {
        "file": ("max-command.wav", audio_data, "audio/wav"),
        "model": GROQ_TRANSCRIPTION_MODEL,
        "temperature": 0.0,
        "response_format": "verbose_json",
        "prompt": WHISPER_HINT,
    }
    if GROQ_LANGUAGE:
        kwargs["language"] = GROQ_LANGUAGE

    try:
        result = groq_client.audio.transcriptions.create(**kwargs)
    except Exception as exc:
        message = f"{type(exc).__name__}: {exc}"
        print(f"Groq transcription failed ({message}).")
        if "429" in message or "rate" in message.lower():
            time.sleep(3)  # back off instead of hammering the API
        else:
            speak_error("Voice transcription is unavailable. Check the Groq settings and connection.")
        return ""

    text = (getattr(result, "text", "") or "").strip()
    segments = getattr(result, "segments", None) or []

    if segments:
        no_speech = [_segment_value(s, "no_speech_prob", 0.0) for s in segments]
        if no_speech and min(no_speech) > 0.6:
            return ""  # Whisper itself says there was no speech
        if any(_segment_value(s, "compression_ratio", 0.0) > 2.4 for s in segments):
            return ""  # repetitive gibberish (typical hallucination)

    if normalize_command(text) in JUNK_PHRASES:
        return ""
    return text.lower()


def listen(wait_timeout=6.0):
    try:
        mic = get_mic()
    except Exception as exc:
        print(f"Microphone error: {exc}")
        speak_error("I could not access the microphone. Use the mic test from the main menu.")
        time.sleep(2)
        return ""

    try:
        wav = mic.record_phrase(wait_timeout=wait_timeout)
    except Exception as exc:
        print(f"Microphone read failed: {exc}")
        reset_mic()
        return ""

    if wav is None:
        return ""

    text = transcribe_with_groq(wav)
    if text:
        print(f"You: {text}")
    return text


# -----------------------------
# AI brain: Groq tool-calling loop
# -----------------------------

SYSTEM_PROMPT = """You are MAX, a concise desktop assistant. Use tools whenever the user
asks you to perform an action. You may call multiple tools, then use their results
to respond. Preserve names and titles as spoken. Never claim to have read search
results: search tools open a results page but do not retrieve its contents. Only
use the tools provided. MAX has no calendar, email, flight-booking, or system-volume
integration; be clear when a requested action is unavailable. Current site: {site}."""

TOOL_DEFINITIONS = [
    {"type": "function", "function": {
        "name": "open_website", "description": "Open a known website or a safe HTTP(S) URL.",
        "parameters": {"type": "object", "properties": {"site": {"type": "string"}}, "required": ["site"], "additionalProperties": False},
    }},
    {"type": "function", "function": {
        "name": "search_web", "description": "Open Google search results for a query.",
        "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"], "additionalProperties": False},
    }},
    {"type": "function", "function": {
        "name": "search_youtube", "description": "Open YouTube search results for a query.",
        "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"], "additionalProperties": False},
    }},
    {"type": "function", "function": {
        "name": "play_music", "description": "Find and play the top YouTube video for a song or video query.",
        "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"], "additionalProperties": False},
    }},
    {"type": "function", "function": {
        "name": "pause_playback", "description": "Pause the current browser video.",
        "parameters": {"type": "object", "properties": {}, "additionalProperties": False},
    }},
    {"type": "function", "function": {
        "name": "resume_playback", "description": "Resume the current browser video.",
        "parameters": {"type": "object", "properties": {}, "additionalProperties": False},
    }},
    {"type": "function", "function": {
        "name": "next_video", "description": "Skip to the next YouTube video.",
        "parameters": {"type": "object", "properties": {}, "additionalProperties": False},
    }},
    {"type": "function", "function": {
        "name": "close_browser", "description": "Close MAX's controlled browser window.",
        "parameters": {"type": "object", "properties": {}, "additionalProperties": False},
    }},
    {"type": "function", "function": {
        "name": "get_time", "description": "Get the computer's current local time.",
        "parameters": {"type": "object", "properties": {}, "additionalProperties": False},
    }},
    {"type": "function", "function": {
        "name": "ask_chatgpt", "description": "Open ChatGPT and submit a question in the browser.",
        "parameters": {"type": "object", "properties": {"prompt": {"type": "string"}}, "required": ["prompt"], "additionalProperties": False},
    }},
    {"type": "function", "function": {
        "name": "set_media_volume", "description": "Set browser video volume from 0 to 100 percent; this is not system volume.",
        "parameters": {"type": "object", "properties": {"volume": {"type": "number", "minimum": 0, "maximum": 100}}, "required": ["volume"], "additionalProperties": False},
    }},
]

REASONING_REQUEST = re.compile(
    r"\b(why|how|explain|compare|plan|cheapest|best|recommend|analy[sz]e|"
    r"summari[sz]e|flight|itinerary|calendar|schedule|step by step)\b",
    re.IGNORECASE,
)
MULTI_STEP_REQUEST = re.compile(r"\b(then|after that|and then|before|once)\b", re.IGNORECASE)
ACTION_VERB = re.compile(
    r"\b(open|search|play|pause|resume|skip|close|set|find|add|send|read|tell|book|schedule|put|create)\b",
    re.IGNORECASE,
)
MAX_TOOL_ROUNDS = 5


def select_model(command):
    words = (command or "").split()
    has_chained_actions = (
        len(ACTION_VERB.findall(command or "")) >= 2
        and re.search(r"\band\b", command or "", re.IGNORECASE)
    )
    if (
        REASONING_REQUEST.search(command or "")
        or MULTI_STEP_REQUEST.search(command or "")
        or has_chained_actions
        or len(words) > 24
    ):
        return GROQ_MODEL
    return GROQ_FAST_MODEL


def execute_tool_call(name, arguments):
    """Execute one allowlisted local action and return a tool result string."""
    global CURRENT_SITE

    try:
        if name == "open_website":
            site = str(arguments.get("site", "")).strip()
            if not open_website(site, announce=False):
                return f"Could not open {site or 'that website'}; provide a site name or HTTP(S) URL."
            return f"Opened {canonical_site(site)}."

        if name == "search_web":
            query = str(arguments.get("query", "")).strip()
            if not query:
                return "A search query is required."
            CURRENT_SITE = "google"
            google_search(query, announce=False)
            return f"Opened Google search results for {query}."

        if name == "search_youtube":
            query = str(arguments.get("query", "")).strip()
            if not query:
                return "A search query is required."
            CURRENT_SITE = "youtube"
            youtube_search(query, announce=False)
            return f"Opened YouTube search results for {query}."

        if name == "play_music":
            query = str(arguments.get("query", "")).strip()
            if not query:
                return "A song or video title is required."
            CURRENT_SITE = "youtube"
            return youtube_play(query, announce=False)

        if name == "pause_playback":
            return "Playback paused." if stop_playback() else "Could not pause playback."

        if name == "resume_playback":
            return "Playback resumed." if resume_playback() else "Could not resume playback."

        if name == "next_video":
            return "Skipped to the next video." if next_video() else "No next video was available."

        if name == "close_browser":
            return "Browser closed." if close_browser() else "No controlled browser was open."

        if name == "get_time":
            return datetime.datetime.now().strftime("%I:%M %p").lstrip("0")

        if name == "ask_chatgpt":
            prompt = str(arguments.get("prompt", "")).strip()
            if not prompt:
                return "A question is required."
            return chatgpt_prompt(prompt, announce=False)

        if name == "set_media_volume":
            volume = float(arguments.get("volume"))
            if not 0 <= volume <= 100:
                return "Volume must be between 0 and 100."
            level = volume / 100
            changed = BROWSER.run_js(
                f"document.querySelectorAll('video').forEach(v=>v.volume={level});"
                "return Boolean(document.querySelector('video'));"
            )
            return f"Set browser video volume to {volume:g} percent." if changed else "No browser video is open."

        return f"Tool '{name}' is unavailable."
    except (TypeError, ValueError, AttributeError) as exc:
        print(f"Invalid arguments for tool {name}: {type(exc).__name__}.")
        return f"Could not run {name}: invalid arguments."
    except Exception as exc:
        print(f"Tool {name} failed ({type(exc).__name__}).")
        return f"Could not complete {name}."


def run_agent(command):
    """Run a bounded Groq tool-call loop and return its final response."""
    if groq_client is None:
        return None

    messages = [{
        "role": "system",
        "content": SYSTEM_PROMPT.format(site=CURRENT_SITE or "none"),
    }]
    messages.extend(CHAT_HISTORY)
    messages.append({"role": "user", "content": command})
    model = select_model(command)
    tool_executed = False

    for _ in range(MAX_TOOL_ROUNDS):
        try:
            response = groq_client.chat.completions.create(
                model=model,
                messages=messages,
                tools=TOOL_DEFINITIONS,
                tool_choice="auto",
                temperature=0,
                max_completion_tokens=1024,
                reasoning_effort="low",
            )
        except Exception as exc:
            print(f"Groq tool loop failed ({type(exc).__name__}).")
            if tool_executed:
                return "I completed the available action, but couldn't get a final response."
            return None

        message = response.choices[0].message
        tool_calls = getattr(message, "tool_calls", None) or []
        if not tool_calls:
            answer = (message.content or "").strip()
            if answer:
                CHAT_HISTORY.extend([
                    {"role": "user", "content": command},
                    {"role": "assistant", "content": answer},
                ])
            return answer or "Done."

        serialized_calls = []
        for call in tool_calls:
            function = call.function
            raw_arguments = function.arguments or "{}"
            if not isinstance(raw_arguments, str):
                raw_arguments = json.dumps(raw_arguments)
            serialized_calls.append({
                "id": call.id,
                "type": "function",
                "function": {"name": function.name, "arguments": raw_arguments},
            })
        messages.append({
            "role": "assistant",
            "content": message.content,
            "tool_calls": serialized_calls,
        })

        for call in tool_calls:
            try:
                arguments = json.loads(call.function.arguments or "{}")
                if not isinstance(arguments, dict):
                    raise ValueError("tool arguments must be an object")
                result = execute_tool_call(call.function.name, arguments)
            except (json.JSONDecodeError, TypeError, ValueError):
                result = "Invalid tool arguments; expected a JSON object."
            messages.append({
                "role": "tool",
                "tool_call_id": call.id,
                "content": str(result),
            })
            tool_executed = True

    return "I reached the action limit for one request. Please split it into smaller steps."


# -----------------------------
# Command normalization + offline fallback
# -----------------------------

def normalize_command(command):
    """Aggressive cleanup used ONLY for matching (never sent to the AI)."""
    if not command:
        return ""
    command = command.lower().strip()
    command = re.sub(r"\s+dot\s+(com|org|net|in|io|co|edu|gov|ai|app|dev)\b", r".\1", command)
    command = re.sub(r"[^a-z0-9. ]+", " ", command)
    command = re.sub(r"(?<![a-z0-9])\.|\.(?![a-z0-9])", " ", command)  # keep dots inside domains
    return re.sub(r"\s+", " ", command).strip()


EXIT_WORDS = {"exit", "quit", "close max", "goodbye", "shutdown"}
STOP_WORDS = {
    "stop", "stop playing", "stop music", "stop song", "stop video", "stop it",
    "pause", "pause playing", "pause music", "pause song", "pause video",
}
RESUME_WORDS = {"resume", "continue", "play", "resume music", "resume video", "play it"}
NEXT_WORDS = {"next", "next video", "next song", "skip", "skip this"}
CLOSE_WORDS = {
    "close tab", "close this tab", "close video", "close browser", "close chrome",
    "close youtube", "close window",
}


def strip_media_words(query):
    """Offline path only: 'the song believer' -> 'believer'."""
    lowered = query.lower()
    for prefix in ("the song ", "a song ", "this song ", "the video ", "a video ", "this video "):
        if lowered.startswith(prefix):
            return query[len(prefix):].strip()
    return query


def rule_based_command(command):
    global CURRENT_SITE

    if command in EXIT_WORDS:
        CURRENT_SITE = None
        speak("Goodbye.")
        return False

    if command in STOP_WORDS:
        speak("Paused." if stop_playback() else "I could not pause playback.")
        return True

    if command in RESUME_WORDS:
        speak("Resuming." if resume_playback() else "I could not resume playback.")
        return True

    if command in NEXT_WORDS:
        speak("Next video." if next_video() else "There is no next video to skip to.")
        return True

    if command in CLOSE_WORDS:
        speak("Closing the browser." if close_browser() else "There is no browser to close.")
        return True

    if command in ("help", "what can you do"):
        speak("I can open websites, search Google or YouTube, play music, and tell the time.")
        return True

    if command in ("what time is it", "time", "tell me the time", "what is the time"):
        speak("The time is " + datetime.datetime.now().strftime("%I:%M %p"))
        return True

    if command in ("open chrome", "start chrome", "launch chrome"):
        CURRENT_SITE = "chrome"
        open_chrome()
        speak("Opening Chrome.")
        return True

    if command.startswith("reply "):
        whatsapp_send_message(command[len("reply "):].strip())
        return True

    if command.startswith("comment "):
        whatsapp_send_message(command[len("comment "):].strip())
        return True

    if command.startswith("send whatsapp "):
        whatsapp_send_message(command[len("send whatsapp "):].strip())
        return True

    if command.startswith("send to "):
        rest = command[len("send to "):].strip()
        match = re.split(r"\s+(?:message|text)\s+", rest, maxsplit=1, flags=re.IGNORECASE)
        if len(match) == 2:
            contact, message = match[0].strip(), match[1].strip()
            whatsapp_send_message(message, contact)
            return True

    if command.startswith("send "):
        whatsapp_send_message(command[len("send "):].strip())
        return True

    for prefix in ("search whatsapp for ", "whatsapp search ", "find contact ", "search contact "):
        if command.startswith(prefix):
            contact = command[len(prefix):].strip()
            open_whatsapp_search(contact)
            return True

    for prefix in ("open ", "launch ", "start "):
        if command.startswith(prefix):
            target = command[len(prefix):].strip()
            if target:
                open_website(target)
            else:
                speak("What do you want me to open?")
            return True

    if command.startswith("play "):
        CURRENT_SITE = "youtube"
        youtube_play(strip_media_words(command[5:].strip()))
        return True

    if command.startswith("watch "):
        CURRENT_SITE = "youtube"
        youtube_play(strip_media_words(command[6:].strip()))
        return True

    if command.startswith("search youtube for "):
        CURRENT_SITE = "youtube"
        youtube_search(command[len("search youtube for "):].strip())
        return True

    for prefix in ("search google for ", "google search ", "search for ", "search ", "google "):
        if command.startswith(prefix):
            CURRENT_SITE = "google"
            google_search(command[len(prefix):].strip())
            return True

    speak("I couldn't reach the AI service, and I don't know that command offline.")
    return True


def process_command(command):
    """AI routing first; rule-based logic as fallback. False = exit MAX."""
    raw = (command or "").strip()
    if not raw:
        return True

    clean = normalize_command(raw)
    if not clean:
        return True

    if clean in EXIT_WORDS:  # instant, no API call
        return rule_based_command(clean)

    response = run_agent(raw)
    if response is None:
        return rule_based_command(clean)

    if response:
        speak(response)
    return True


# -----------------------------
# Wake word
# -----------------------------

WAKE_WORDS = {"max", "maxx", "macs", "mac", "maks", "maxs", "mags"}


def is_wake_word(word):
    word = word.lower()
    return word in WAKE_WORDS or bool(difflib.get_close_matches(word, ["max"], n=1, cutoff=0.75))


def extract_command(text):
    """Return (heard_wake_word, command). Keeps the original punctuation."""
    text = (text or "").strip()
    match = re.match(r"^\W*(?:(?:hey|ok|okay|hi|hello)\W+)?(\w+)(.*)$", text, re.S | re.I)
    if match and is_wake_word(match.group(1)):
        return True, match.group(2).strip(" ,.;:!?-\t\r\n")
    return False, text


# -----------------------------
# Modes
# -----------------------------

def text_mode():
    print("\n==============================")
    print("        MAX TEXT MODE")
    print("==============================")
    print("Type 'help' for commands.")
    print("Type 'exit' to close MAX.")

    while True:
        command = input("\nYou: ")
        if not process_command(command):
            break


def voice_mode():
    try:
        mic = get_mic()
    except Exception as exc:
        print(f"Microphone error: {exc}")
        speak("I could not start the microphone. Try the mic test from the main menu.")
        return

    if PUSH_TO_TALK:
        speak("MAX voice mode activated. Press Enter, then speak your command.")
    else:
        speak("MAX voice mode activated. Say max, then your command.")

    announce = True
    while True:
        if PUSH_TO_TALK:
            try:
                input("\nPress Enter, then speak... ")
            except EOFError:
                break
            BROWSER.duck(True)
            mic.flush()
            text = listen(wait_timeout=8.0)
            BROWSER.duck(False)
            if not text:
                print("(I didn't catch that)")
                continue
            _, command = extract_command(text)
        else:
            if announce:
                print("\nListening... say 'Max' and then your command.")
                announce = False

            # Keep MAX hot while music is playing. Lower the browser audio only during
            # the listening window so the assistant stays responsive without blocking.
            BROWSER.duck(True)
            text = listen(wait_timeout=4.0)
            BROWSER.duck(False)
            if not text:
                continue

            woke, command = extract_command(text)
            if not woke and REQUIRE_WAKE_WORD:
                announce = True
                continue

            if woke and not command:
                speak("Yes?")
                BROWSER.duck(True)
                follow_up = listen(wait_timeout=6.0)
                BROWSER.duck(False)
                if not follow_up:
                    announce = True
                    continue
                _, command = extract_command(follow_up)

        if command and not process_command(command):
            break
        announce = True


def level_meter(mic, seconds=3.0):
    """Print a live bar so you can see whether the mic level is healthy."""
    start_thr, _ = mic.thresholds()
    print(f"\nLive level for {seconds:.0f}s (speak normally; '|' marks the speech trigger):")
    marker = 30
    scale = (start_thr * 2.0) / (marker * 2)
    end = time.monotonic() + seconds
    while time.monotonic() < end:
        _, level = mic.read_block()
        filled = int(min(level / scale, marker * 2))
        bar = ["#"] * filled + [" "] * (marker * 2 - filled)
        bar[marker] = "|" if bar[marker] == " " else "#"
        print("\r[" + "".join(bar) + f"] {level:6.0f}", end="", flush=True)
    print()


def mic_test():
    """Diagnose microphone problems."""
    if sounddevice is None:
        print("The sounddevice package is not installed: pip install sounddevice")
        return

    print("\nInput devices (set MIC_DEVICE=<index> in .env to force one):")
    for index, device in enumerate(sounddevice.query_devices()):
        if device.get("max_input_channels", 0) > 0:
            print(f"  [{index}] {device['name']}")

    try:
        mic = get_mic()
    except Exception as exc:
        print(f"Could not open the microphone: {exc}")
        return

    name = sounddevice.query_devices(mic.device)["name"]
    start_thr, stop_thr = mic.thresholds()
    print(f"\nUsing [{mic.device}] {name} at {mic.sample_rate} Hz")
    print(f"Background noise: {mic.noise_floor:.0f}   speech trigger: {start_thr:.0f}")

    level_meter(mic)

    print("\nNow say a sentence, e.g. 'open YouTube'...")
    wav = mic.record_phrase(wait_timeout=8.0)
    if wav is None:
        print("No speech captured. Speak closer/louder, raise the microphone volume in "
              "Windows sound settings, or try another device with MIC_DEVICE.")
        return

    print(f"Captured {mic.last_voice_seconds:.1f}s of speech, peak level {mic.last_peak:.0f} "
          f"(healthy: several times {start_thr:.0f}).")
    if groq_client is None:
        print("GROQ_API_KEY missing, cannot transcribe.")
        return
    text = transcribe_with_groq(wav)
    print(f"Heard: {text!r}" if text else "Heard: nothing intelligible.")


def main():
    print("\n================================")
    print("          MAX ASSISTANT")
    print("================================")
    print("1. Text mode")
    print("2. Voice mode")
    print("3. Microphone test")
    print("4. Exit")

    while True:
        choice = input("\nSelect mode: ").strip()

        if choice == "1":
            text_mode()
        elif choice == "2":
            voice_mode()
        elif choice == "3":
            mic_test()
        elif choice == "4":
            speak("Goodbye.")
            reset_mic()
            BROWSER.quit()
            sys.exit()
        else:
            print("Please select 1, 2, 3, or 4.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nGoodbye.")
        reset_mic()
        BROWSER.quit()
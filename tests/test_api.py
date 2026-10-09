import base64
import unittest

from fastapi.testclient import TestClient

from backend.api import app


class MaxApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_status_reports_backend_and_frontend(self):
        response = self.client.get("/api/status")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["status"], "ok")
        self.assertIn("backend", payload)
        self.assertIn("frontend", payload)

    def test_root_serves_the_built_frontend(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("<html", response.text.lower())
        self.assertIn("MAX AI", response.text)

    def test_chat_returns_structured_result(self):
        response = self.client.post("/api/chat", json={"message": "What time is it?"})
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["success"])
        self.assertIn("response", payload)
        self.assertIn("action", payload)
        self.assertIn(payload["status"], {"completed", "error"})

    def test_invalid_chat_request_is_rejected(self):
        response = self.client.post("/api/chat", json={})
        self.assertEqual(response.status_code, 422)
        payload = response.json()
        self.assertIn("detail", payload)

    def test_voice_endpoint_requires_wav_audio(self):
        response = self.client.post(
            "/api/voice",
            json={"audio": base64.b64encode(b"not-audio").decode("ascii")},
        )
        self.assertEqual(response.status_code, 400)
        payload = response.json()
        self.assertIn("detail", payload)

    def test_voice_endpoint_rejects_non_wav_header(self):
        invalid_header = b"RIFF" + b"\x00" * 40
        response = self.client.post(
            "/api/voice",
            json={"audio": base64.b64encode(invalid_header).decode("ascii")},
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("WAV", response.json()["detail"])

    def test_voice_endpoint_accepts_pcm_wav_header(self):
        sample_count = 4410
        pcm_audio = (
            b"RIFF"
            + (36 + sample_count * 2).to_bytes(4, byteorder="little")
            + b"WAVE"
            + b"fmt "
            + (16).to_bytes(4, byteorder="little")
            + (1).to_bytes(2, byteorder="little")
            + (1).to_bytes(2, byteorder="little")
            + (44100).to_bytes(4, byteorder="little")
            + (88200).to_bytes(4, byteorder="little")
            + (2).to_bytes(2, byteorder="little")
            + (16).to_bytes(2, byteorder="little")
            + b"data"
            + (sample_count * 2).to_bytes(4, byteorder="little")
            + b"\x00\x00" * sample_count
        )
        response = self.client.post(
            "/api/voice",
            json={"audio": base64.b64encode(pcm_audio).decode("ascii")},
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn(response.json()["status"], {"completed", "error"})

    def test_command_endpoint_uses_same_processing_path(self):
        response = self.client.post("/api/command", json={"command": "help"})
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["action"]["type"], "assistant_response")


if __name__ == "__main__":
    unittest.main()

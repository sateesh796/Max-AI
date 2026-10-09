import importlib.util
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
import unittest

module_path = Path(__file__).with_name("Max.py")
spec = importlib.util.spec_from_file_location("max_module", module_path)
max_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(max_module)


class TestMaxAssistant(unittest.TestCase):
    def test_clean_search_query_removes_filler_words(self):
        self.assertEqual(
            max_module.clean_search_query("please search for the latest python tutorial"),
            "search for the latest python tutorial",
        )

    def test_extract_youtube_video_id_handles_common_formats(self):
        html = '{"videoId":"abc123def45"}'
        self.assertEqual(max_module.extract_youtube_video_id(html), "abc123def45")

        html_with_spaces = '{"videoId" : "xyz987abc12"}'
        self.assertEqual(max_module.extract_youtube_video_id(html_with_spaces), "xyz987abc12")

    def test_fast_model_is_selected_for_simple_requests(self):
        self.assertEqual(max_module.select_model("what time is it"), max_module.GROQ_FAST_MODEL)

    def test_process_command_speaks_agent_response(self):
        with patch.object(max_module, "run_agent", return_value="Hello there."), \
             patch.object(max_module, "speak") as speak_mock:
            self.assertTrue(max_module.process_command("hello"))

        speak_mock.assert_called_once_with("Hello there.")

    def test_reasoning_model_is_selected_for_multi_step_requests(self):
        command = "find the cheapest flight to Delhi next Friday and put it on my calendar"
        self.assertEqual(max_module.select_model(command), max_module.GROQ_MODEL)
        self.assertEqual(max_module.select_model("open YouTube and play some music"), max_module.GROQ_MODEL)

    def test_extract_command_requires_and_strips_wake_word(self):
        self.assertEqual(max_module.extract_command("Max, open Google"), (True, "open Google"))
        self.assertEqual(max_module.extract_command("open Google"), (False, "open Google"))

    def test_run_agent_executes_tool_then_returns_final_answer(self):
        tool_call = SimpleNamespace(
            id="call-1",
            function=SimpleNamespace(name="get_time", arguments="{}"),
        )
        tool_message = SimpleNamespace(content=None, tool_calls=[tool_call])
        final_message = SimpleNamespace(content="It is 3 PM.", tool_calls=None)
        responses = [
            SimpleNamespace(choices=[SimpleNamespace(message=tool_message)]),
            SimpleNamespace(choices=[SimpleNamespace(message=final_message)]),
        ]
        with patch.object(
            max_module.groq_client.chat.completions,
            "create",
            side_effect=responses,
        ) as create_mock:
            with patch.object(max_module, "execute_tool_call", return_value="It is 3 PM.") as tool_mock:
                result = max_module.run_agent("what time is it")

        self.assertEqual(result, "It is 3 PM.")
        self.assertEqual(create_mock.call_count, 2)
        self.assertEqual(create_mock.call_args_list[0].kwargs["model"], max_module.GROQ_FAST_MODEL)
        self.assertTrue(create_mock.call_args_list[0].kwargs["tools"])
        self.assertEqual(create_mock.call_args_list[1].kwargs["messages"][-1]["role"], "tool")
        tool_mock.assert_called_once_with("get_time", {})

    def test_unavailable_tool_is_not_executed(self):
        result = max_module.execute_tool_call("send_email", {"to": "someone@example.com"})
        self.assertIn("unavailable", result.lower())

    def test_groq_transcription_uses_configured_model(self):
        response = SimpleNamespace(text="max open google")
        with patch.object(
            max_module.groq_client.audio.transcriptions,
            "create",
            return_value=response,
        ) as create_mock:
            result = max_module.transcribe_with_groq(b"wav data")

        self.assertEqual(result, "max open google")
        self.assertEqual(
            create_mock.call_args.kwargs["model"],
            max_module.GROQ_TRANSCRIPTION_MODEL,
        )


if __name__ == "__main__":
    unittest.main()

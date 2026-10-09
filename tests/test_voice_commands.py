import importlib.util
import unittest
from unittest.mock import Mock

MODULE_PATH = r"C:\Users\avsat\OneDrive\Desktop\Max__AI\brain.py\Max2.0\Max.py"

spec = importlib.util.spec_from_file_location("max_voice_module", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class VoiceCommandsTests(unittest.TestCase):
    def test_open_unknown_app_falls_back_to_google_search(self):
        module.speak = Mock()
        module.google_search = Mock()
        result = module.rule_based_command("open google maps")

        self.assertTrue(result)
        module.google_search.assert_called_once_with("google maps", announce=False)

    def test_unknown_site_uses_google_search_when_opening_a_browser_target(self):
        module.speak = Mock()
        module.google_search = Mock()
        result = module.rule_based_command("open canva")

        self.assertTrue(result)
        module.google_search.assert_called_once_with("canva", announce=False)


if __name__ == "__main__":
    unittest.main()

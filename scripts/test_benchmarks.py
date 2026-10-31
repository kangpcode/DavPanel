import importlib.util
import threading
import unittest
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path


spec = importlib.util.spec_from_file_location("benchmark_collector", Path(__file__).resolve().parents[1] / "benchmarks/collect.py")
collector = importlib.util.module_from_spec(spec)
spec.loader.exec_module(collector)


class BenchmarkTests(unittest.TestCase):
    def test_failed_requests_are_not_reported_as_fast_successes(self):
        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                self.send_response(200 if self.path == "/ok" else 503)
                self.end_headers()
                self.wfile.write(b"fixture")

            def log_message(self, *args):
                pass

        server = HTTPServer(("127.0.0.1", 0), Handler)
        worker = threading.Thread(target=server.serve_forever, daemon=True)
        worker.start()
        try:
            url = "http://127.0.0.1:" + str(server.server_port)
            passed = collector.probe("fixture", url + "/ok", 3, 2)
            failed = collector.probe("fixture", url + "/failed", 3, 2)
            self.assertEqual(passed["successful"], 3)
            self.assertIsNotNone(passed["p95_ms"])
            self.assertEqual(failed["successful"], 0)
            self.assertIsNone(failed["p95_ms"])
            self.assertIn("Not measured", collector.markdown({"results": [failed]}))
        finally:
            server.shutdown()
            server.server_close()
            worker.join()

from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle
import json

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

class FlaskTests(TestCase):

    def test_root_route(self):
        with app.test_client() as client:
            res = client.get("/")
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn("<h1>Boggle!</h1>", html)

    def test_reset_redirection(self):
        with app.test_client() as client:
            res = client.get("/reset")

            self.assertEqual(res.status_code, 302)
            self.assertEqual(res.location, "http://localhost/")

    def test_reset_redirection_followed(self):
        with app.test_client() as client:
            res = client.get("/reset", follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn("<h1>Boggle!</h1>", html)

    def test_validation_route(self):
        with app.test_client() as client:
            test_string = "ttt"
            res = client.get("/")
            res_two = client.get("/guess", query_string=dict(guess=test_string))
            data = json.loads(res_two.get_data(as_text=True))
        
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res_two.status_code, 200)
            self.assertIn(test_string, data["result"])

    def test_update_route(self):
        with app.test_client() as client:
            test_score = "10"
            res = client.get("/update", query_string=dict(score=test_score))
            data = json.loads(res.get_data(as_text=True))

            self.assertEqual(res.status_code, 200)
            self.assertIn("message", data)
            self.assertIn("plays", data)
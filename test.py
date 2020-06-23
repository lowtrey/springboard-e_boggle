from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!

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

    # def test_validation_route(self):
    #     with app.test_client() as client:
    #         res = client.get("/guess")
    #         # html = res.get_data(as_text=True)
            
    #         # help(res)
    #         self.assertEqual(res.status_code, 200)
from flask import Flask, request
from flask_cors import CORS
import zulip

from problems.two_sum import TwoSumProblemRunner

app = Flask(__name__)
CORS(app)


# Returns 200 if config is good, otherwise 300
@app.route("/validate", methods=["POST"])
def validate():
    req_json = request.get_json()
    email = req_json.get("email")
    key = req_json.get("key")
    url = req_json.get("url")
    session_token = req_json.get("session_token")

    try:
        client = zulip.Client(email=email, api_key=key, site=url)
        result = client.get_profile()
        if result["result"] != "success":
            return result["msg"], 400
    except zulip.ZulipError as e:
        return e.args[0], 400
    except Exception as e:
        return "non-zulip error", 400

    return "gucci", 200


@app.route("/fuck-me-up", methods=["POST"])
def evaluate():
    req_json = request.get_json()
    code = req_json.get("code")
    session_token = req_json.get("session_token")
    try:
        two_sum = TwoSumProblemRunner()
        error_msg = two_sum.evaluate(code)
        if error_msg:
            return error_msg, 400
    except Exception as e:
        return "failed", 400
    return "passed!", 200

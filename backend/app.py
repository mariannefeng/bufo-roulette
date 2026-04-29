import uuid
import zulip
from flask import Flask, request
from flask_cors import CORS
from flask_caching import Cache

from problems.two_sum import TwoSumProblemRunner
import zulip_bomb

app = Flask(__name__)
CORS(app)
cache = Cache(app, config={"CACHE_TYPE": "SimpleCache"})


# Returns 200 if config is good, otherwise 300
@app.route("/validate", methods=["POST"])
def validate():
    req_json = request.get_json()
    email = req_json.get("email")
    key = req_json.get("key")
    url = req_json.get("url")
    session_token = str(uuid.uuid4())

    try:
        client = zulip.Client(email=email, api_key=key, site=url)
        cache.set(session_token, client)
        result = client.get_profile()
        if result["result"] != "success":
            return result["msg"], 400
    except zulip.ZulipError as e:
        return e.args[0], 400
    except Exception as e:
        return "non-zulip error", 400

    result_obj = {"status": "gucci", "session_token": session_token}
    return result_obj, 200


@app.route("/fuck-me-up", methods=["POST"])
def evaluate():
    req_json = request.get_json()
    code = req_json.get("code")
    session_token = req_json.get("session_token")
    client = cache.get(session_token)
    try:
        two_sum = TwoSumProblemRunner()
        error_msg = two_sum.evaluate(code)
        if error_msg:
            print("killing zulip")
            zulip_bomb.kill_zulip(client)
            return error_msg, 400
        else:
            print("not killing zulip")
    except Exception as e:
        zulip_bomb.kill_zulip(client)
        return "failed", 400
    return "passed!", 200

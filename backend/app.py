import json
import uuid
import zulip

from quart import Quart as Flask, request
from quart_cors import cors as CORS
from flask_caching import Cache

from problems.two_sum import TwoSumProblemRunner
import zulip_bomb

app = Flask(__name__)
CORS(app)
cache = Cache(app, config={"CACHE_TYPE": "SimpleCache"})


# Returns 200 if config is good, otherwise 300
@app.route("/validate", methods=["POST"])
async def validate():
    req_json = await request.get_json()
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
async def evaluate():
    req_json = await request.get_json()
    code = req_json.get("code")
    session_token = req_json.get("session_token")
    client = cache.get(session_token)
    try:
        two_sum = TwoSumProblemRunner()
        error_msg = two_sum.evaluate(code)
        if error_msg:
            app.add_background_task(zulip_bomb.kill_zulip, client)
            return error_msg, 400
    except Exception as e:
        app.add_background_task(zulip_bomb.kill_zulip, client)
        return "failed", 400
    return "passed!", 200


@app.route("/chicken-out", methods=["POST"])
async def chicken():
    req_json = await request.get_data()
    import pdb

    pdb.set_trace()
    session_token = json.loads(req_json)["session_token"]
    if session_token is None:
        return

    print("chicken detected!!!")
    client = cache.get(session_token)
    full_name = client.get_profile()["full_name"]

    alnum_name = "".join(char for char in full_name if char.isalnum())
    print(f"{alnum_name} is a chicken")
    return {"foo": "bar"}, 200

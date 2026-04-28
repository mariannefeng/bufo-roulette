from flask import Flask, request
import zulip

from problem_runner import ProblemRunner
import solutions.two_sum as two_sum_problem

app = Flask(__name__)


# Returns 200 if config is good, otherwise 300
@app.route("/validate", methods=["POST"])
def validate():
    req_json = request.get_json()
    email = req_json.get("email")
    key = req_json.get("key")
    url = req_json.get("url")
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


if __name__ == "__main__":
    two_sum = ProblemRunner(
        "const twoSum = (array, goal) => {",
        "}",
    )
    two_sum.add_test_case("[2, 7, 11, 15], 9", "[0, 1]")
    two_sum.add_test_case("[3, 2, 4], 6", "[1, 2]")
    two_sum.add_test_case("[3, 3], 6", "[0, 1]")

    two_sum.evaluate(two_sum_problem.good_src)

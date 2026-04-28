from jsrun import Runtime, RuntimeConfig

CONFIG = RuntimeConfig(enable_console=True)


class ProblemRunner:
    def __init__(self, header: str, footer: str):
        self._header = header
        self._footer = footer
        self._test_cases = []

    def add_test_case(self, test_case: str, result: str):
        self._test_cases.append([test_case, result])

    def evaluate(self, src):
        for test_case in self._test_cases:
            # print(test_case)

            with Runtime(CONFIG) as runtime:
                try:
                    full_src = "\r".join([self._header, src, self._footer])
                    runtime.eval(full_src + self.harness())
                    print(f"passed test case {test_case}")
                except Exception as e:
                    self.lose(e)
                    return
        print("you passed!")

    def lose(self, e: Exception):
        print("you failed: " + e.message)

    def test_cases(self):
        test_cases_str = ",\n".join([f"\t[{x[0]}, {x[1]}]" for x in self._test_cases])
        return f"const test_cases = [\n{test_cases_str}\n];"

    def harness(self):
        return f"""
const input = [[2, 7, 11, 15], 9];
const result = twoSum(input[0], input[1]);

{self.test_cases()}

test_cases.forEach((test_case) => {{
    const input = test_case[0];
    const target = test_case[1];
    const expected = test_case[2];

    const result = twoSum(input, target);
    if (result.toString() != expected.toString()) {{
        console.log("you fucked up");
        throw new Error(`failed for test case (array = [${{input}}], goal = ${{target}}). Expected [${{expected}}], got [${{result}}]`);
    }}
}});
        """

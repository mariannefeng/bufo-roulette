from jsrun import Runtime, RuntimeConfig

CONFIG = RuntimeConfig(enable_console=True)


class ProblemRunner:
    def __init__(self, header: str, footer: str):
        self._header = header
        self._footer = footer
        self._test_cases = []

    def add_test_case(self, test_case: str, result: str):
        self._test_cases.append([test_case, result])

    def evaluate(self, src) -> bool:
        for test_case in self._test_cases:
            with Runtime(CONFIG) as runtime:
                try:
                    full_src = "\r".join([self._header, src, self._footer])
                    runtime.eval(full_src + self.harness())
                    # print(f"passed test case {test_case}")
                except Exception as e:
                    self.lose(e)
                    return False
        print("you passed!")
        return True

    def lose(self, e: Exception):
        print("you failed: " + e.message)

    def test_cases(self):
        test_cases_str = ",\n".join([f"\t[{x[0]}, {x[1]}]" for x in self._test_cases])
        return f"const test_cases = [\n{test_cases_str}\n];"

    def harness(self):
        raise NotImplementedError(f"harness not implemented")

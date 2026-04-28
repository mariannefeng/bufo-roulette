from problem_runner import ProblemRunner


class TwoSumProblemRunner(ProblemRunner):
    def __init__(self):
        self._src = """
        """
        super().__init__("const twoSum = (array, goal) => {", "}")
        super().add_test_case("[2, 7, 11, 15], 9", "[0, 1]")
        super().add_test_case("[3, 2, 4], 6", "[1, 2]")
        super().add_test_case("[3, 3], 6", "[0, 1]")

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
            if (JSON.stringify(result) !== JSON.stringify(expected)) {{
                console.log("you fucked up");
                throw new Error(`failed for test case (array = [${{input}}], goal = ${{target}}). Expected [${{expected}}], got [${{result}}]`);
            }}
        }});
        """

from problem_runner import ProblemRunner
import solutions.two_sum as two_sum_problem


if __name__ == "__main__":
    two_sum = ProblemRunner(
        "const twoSum = (array, goal) => {",
        "}",
    )
    two_sum.add_test_case("[2, 7, 11, 15], 9", "[0, 1]")
    two_sum.add_test_case("[3, 2, 4], 6", "[1, 2]")
    two_sum.add_test_case("[3, 3], 6", "[0, 1]")

    two_sum.evaluate(two_sum_problem.good_src)

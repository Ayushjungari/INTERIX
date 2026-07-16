// Backend problem catalog: hidden test cases + language-specific runners.
// Each problem provides:
//   - visibleTests  : shown to the user in the UI
//   - hiddenTests   : ONLY used on Submit
//   - buildDriver(lang, userCode, tests) : returns the FULL source to send to Piston
//
// A test = { args: <serializable>, expected: <normalized string> }
// The driver prints one line per test, in the format: OUT:<json>
// So we can compare deterministically regardless of language.

const jsonStr = (v) => JSON.stringify(v);

// -------- generic driver builders --------
function jsDriver(userCode, tests, fn, mode) {
  // mode: "return" (fn returns value) or "inplace" (fn mutates first arg)
  const cases = tests
    .map((t) => {
      const args = t.args.map(jsonStr).join(",");
      if (mode === "inplace") {
        return `{ const a=${jsonStr(t.args[0])}; ${fn}(a${
          t.args.length > 1 ? "," + t.args.slice(1).map(jsonStr).join(",") : ""
        }); console.log("OUT:"+JSON.stringify(a)); }`;
      }
      return `console.log("OUT:"+JSON.stringify(${fn}(${args})));`;
    })
    .join("\n");
  return `${userCode}\n\n// ---- hidden test runner ----\n${cases}\n`;
}

function pyDriver(userCode, tests, fn, mode) {
  const cases = tests
    .map((t) => {
      const args = t.args.map((a) => JSON.stringify(a)).join(",");
      if (mode === "inplace") {
        return `a=${JSON.stringify(t.args[0])}\n${fn}(a${
          t.args.length > 1 ? "," + t.args.slice(1).map((a) => JSON.stringify(a)).join(",") : ""
        })\nimport json as _j\nprint("OUT:"+_j.dumps(a))`;
      }
      return `import json as _j\nprint("OUT:"+_j.dumps(${fn}(${args})))`;
    })
    .join("\n");
  return `${userCode}\n\n# ---- hidden test runner ----\n${cases}\n`;
}

// For Java/C++ we can't easily wrap because the user code IS the main class.
// So on Submit we RUN the user program as-is and compare its printed output
// to the expected output baked into starter code (which the driver hides in
// starterCode). For a proper LeetCode-style hidden run in Java/C++ you would
// need per-problem harnesses; keeping it output-diff for these languages.
function passthroughDriver(userCode /*, tests, fn, mode */) {
  return userCode;
}

// ---------------- Problems ----------------
export const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    fnName: "twoSum",
    mode: "return",
    visibleTests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
    ],
    hiddenTests: [
      { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
      { args: [[0, 4, 3, 0], 0], expected: [0, 3] },
      { args: [[5, 75, 25], 100], expected: [1, 2] },
    ],
  },
  "reverse-string": {
    id: "reverse-string",
    fnName: "reverseString",
    mode: "inplace",
    visibleTests: [
      { args: [["h", "e", "l", "l", "o"]], expected: ["o", "l", "l", "e", "h"] },
      { args: [["H", "a", "n", "n", "a", "h"]], expected: ["h", "a", "n", "n", "a", "H"] },
    ],
    hiddenTests: [
      { args: [["A"]], expected: ["A"] },
      { args: [["a", "b"]], expected: ["b", "a"] },
      { args: [["1", "2", "3", "4", "5"]], expected: ["5", "4", "3", "2", "1"] },
    ],
  },
  "valid-palindrome": {
    id: "valid-palindrome",
    fnName: "isPalindrome",
    mode: "return",
    visibleTests: [
      { args: ["A man, a plan, a canal: Panama"], expected: true },
      { args: ["race a car"], expected: false },
      { args: [" "], expected: true },
    ],
    hiddenTests: [
      { args: [".,"], expected: true },
      { args: ["0P"], expected: false },
      { args: ["Was it a car or a cat I saw?"], expected: true },
    ],
  },
  "maximum-subarray": {
    id: "maximum-subarray",
    fnName: "maxSubArray",
    mode: "return",
    visibleTests: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
    ],
    hiddenTests: [
      { args: [[-1]], expected: -1 },
      { args: [[-2, -1]], expected: -1 },
      { args: [[1, 2, 3, 4, 5]], expected: 15 },
    ],
  },
  "container-with-most-water": {
    id: "container-with-most-water",
    fnName: "maxArea",
    mode: "return",
    visibleTests: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { args: [[1, 1]], expected: 1 },
    ],
    hiddenTests: [
      { args: [[4, 3, 2, 1, 4]], expected: 16 },
      { args: [[1, 2, 1]], expected: 2 },
      { args: [[2, 3, 4, 5, 18, 17, 6]], expected: 17 },
    ],
  },
};

export function buildSubmission(problemId, language, userCode) {
  const p = PROBLEMS[problemId];
  if (!p) return { source: userCode, tests: [] };

  const tests = p.hiddenTests;
  let source;
  switch (language) {
    case "javascript":
      source = jsDriver(userCode, tests, p.fnName, p.mode);
      break;
    case "python":
      source = pyDriver(userCode, tests, p.fnName, p.mode);
      break;
    default:
      // Java / C++ — passthrough; expect user's main() to print visible test outputs
      source = passthroughDriver(userCode);
      break;
  }
  return { source, tests };
}

export function parseVerdict(problemId, language, tests, stdout) {
  const p = PROBLEMS[problemId];
  if (!p) return { verdict: "Accepted", details: [] };

  // For Java/C++ we only ran the visible tests baked in starter — can't judge hidden.
  if (language !== "javascript" && language !== "python") {
    return {
      verdict: "Ran",
      details: [
        {
          note:
            "Hidden test judging for " +
            language +
            " requires a per-problem harness. Program output shown above.",
        },
      ],
    };
  }

  const lines = stdout.split("\n").filter((l) => l.startsWith("OUT:")).map((l) => l.slice(4));
  const details = [];
  let allPass = true;
  for (let i = 0; i < tests.length; i++) {
    const expected = JSON.stringify(tests[i].expected);
    const actual = lines[i] ?? "";
    const pass = actual === expected;
    if (!pass) allPass = false;
    details.push({ i, expected, actual, pass });
  }
  const verdict = allPass ? "Accepted" : "Wrong Answer";
  return { verdict, details };
}

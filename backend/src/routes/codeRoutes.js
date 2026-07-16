import axios from "axios";
import express from "express";
import { buildSubmission, parseVerdict, PROBLEMS } from "../data/problems.js";

const router = express.Router();

const LANG = {
  javascript: 102,
  python: 100,
  java: 91,
  cpp: 105,
};

async function judgeExecute(language, source, stdin = "") {

    try {

        const response = await axios.post(

            "https://judge0-ce.p.rapidapi.com/submissions",

            {
                language_id: LANG[language],
                source_code: source,
                stdin
            },

            {

                params: {
                    base64_encoded: false,
                    wait: true,
                    fields: "*"
                },

                headers: {

                    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                    "X-RapidAPI-Host": process.env.RAPID_API_HOST,
                    "Content-Type": "application/json"

                }

            }

        );

        const data = response.data;

        return {

            ok: data.status.id === 3,

            stdout: data.stdout || "",

            stderr:
                data.stderr ||
                data.compile_output ||
                "",

            verdict: data.status.description

        };

    }

    catch (err) {

        return {

            ok: false,

            stdout: "",

            stderr:
            err.response?.data ||
            err.response?.data?.message ||
            err.message,

            verdict: "Runtime Error"

        };

    }

}

// body: { language, code }  -> executes code as-is (LeetCode "Run")
router.post("/run", async (req, res) => {
  const { language = "javascript", code = "" } = req.body || {};

  const result = await judgeExecute(language, code);
  return res.json({
    success: result.ok,
    output: result.stdout,
    error: result.stderr,
    verdict: result.verdict,
  });
});

// POST /api/code/submit
// body: { language, code, problemId }  -> LeetCode "Submit": runs hidden tests
router.post("/submit", async (req, res) => {
  const { language = "javascript", code = "", problemId } = req.body || {};

  const problem = PROBLEMS[problemId];
  if (!problem) {
    return res.status(400).json({ success: false, error: `Unknown problem: ${problemId}` });
  }

  const { source, tests } = buildSubmission(problemId, language, code);
  const result = await judgeExecute(language, source);

  if (!result.ok) {
    return res.json({
      success: false,
      verdict: result.verdict,
      output: result.stdout,
      error: result.stderr,
      details: [],
    });
  }

  const { verdict, details } = parseVerdict(problemId, language, tests, result.stdout);
  return res.json({
    success: verdict === "Accepted",
    verdict,
    output: result.stdout,
    error: result.stderr,
    details,
    testsTotal: tests.length,
    testsPassed: details.filter((d) => d.pass).length,
  });
});

export default router;

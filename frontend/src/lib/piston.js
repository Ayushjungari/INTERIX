// Runs the user's code through our backend, which delegates to Piston.
// Provides both a "Run" call and a "Submit" call (hidden test cases).
import axiosInstance from "./axios";

/**
 * Run code as-is (LeetCode "Run Code").
 * @returns {{ success:boolean, output:string, error:string, verdict:string }}
 */
export async function executeCode(language, code) {
  try {
    const { data } = await axiosInstance.post("/code/run", { language, code });
    return {
      success: !!data.success,
      output: data.output || "",
      error: data.error || "",
      verdict: data.verdict || (data.success ? "OK" : "Runtime Error"),
    };
  } catch (err) {
    const msg = err.response?.data?.error || err.message || "Execution failed";
    return { success: false, output: "", error: msg, verdict: "Runtime Error" };
  }
}

/**
 * Submit code against hidden test cases (LeetCode "Submit").
 */
export async function submitCode(language, code, problemId) {
  try {
    const { data } = await axiosInstance.post("/code/submit", {
      language,
      code,
      problemId,
    });
    return {
      success: !!data.success,
      output: data.output || "",
      error: data.error || "",
      verdict: data.verdict || "Runtime Error",
      details: data.details || [],
      testsTotal: data.testsTotal ?? 0,
      testsPassed: data.testsPassed ?? 0,
    };
  } catch (err) {
    const msg = err.response?.data?.error || err.message || "Submission failed";
    return {
      success: false,
      output: "",
      error: msg,
      verdict: "Runtime Error",
      details: [],
      testsTotal: 0,
      testsPassed: 0,
    };
  }
}

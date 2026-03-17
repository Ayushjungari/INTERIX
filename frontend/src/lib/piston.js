export const executeCode = async (language, code) => {
  try {
    const response = await fetch("http://localhost:8000/api/code/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        code,
      }),
    });

    const data = await response.json();

    return data;
  } catch (err) {
    console.error("Execute Error:", err);

    return {
      run: {
        code: 1,
        stdout: "",
        stderr: "Execution failed",
      },
    };
  }
};
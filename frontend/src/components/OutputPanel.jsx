function verdictClass(v) {
  switch (v) {
    case "Accepted":
      return "text-success";
    case "Wrong Answer":
      return "text-error";
    case "Time Limit Exceeded":
      return "text-warning";
    case "Compilation Error":
    case "Runtime Error":
      return "text-error";
    default:
      return "text-info";
  }
}

function OutputPanel({ output }) {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm flex items-center justify-between">
        <span>Output</span>
        {output && output.verdict && (
          <span className={`font-bold ${verdictClass(output.verdict)}`}>{output.verdict}</span>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {output == null ? (
          <p className="text-base-content/50 text-sm">
            Click "Run" to see output, or "Submit" to test against hidden cases.
          </p>
        ) : output.success ? (
          <>
            {output.output && (
              <pre className="text-sm font-mono text-success whitespace-pre-wrap">
                {output.output}
              </pre>
            )}
            {output.testsTotal > 0 && (
              <p className="mt-2 text-sm">
                Passed <span className="font-semibold">{output.testsPassed}</span> /{" "}
                {output.testsTotal} hidden tests
              </p>
            )}
          </>
        ) : (
          <div>
            {output.output && (
              <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                {output.output}
              </pre>
            )}
            {output.error && (
              <pre className="text-sm font-mono text-error whitespace-pre-wrap">{output.error}</pre>
            )}
            {output.details && output.details.length > 0 && (
              <div className="mt-3 space-y-1 text-xs font-mono">
                {output.details.map((d, i) => (
                  <div key={i} className={d.pass ? "text-success" : "text-error"}>
                    Test #{i + 1}: {d.pass ? "PASS" : "FAIL"} — expected {d.expected}, got{" "}
                    {d.actual || "<no output>"}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;

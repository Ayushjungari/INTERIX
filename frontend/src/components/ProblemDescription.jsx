function ProblemDescription({
  problem,
  currentProblemId,
  onProblemChange,
  allProblems,
}) {
  if (!problem) return null;

  return (
    <div className="h-full overflow-auto p-4">

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>

      <div className="flex items-center gap-2 mb-3">
        <span className="badge badge-success">{problem.difficulty}</span>
        <span className="text-sm text-base-content/60">
          {problem.category}
        </span>
      </div>

      {/* DESCRIPTION */}
      {problem.description?.text && (
        <p className="mb-4 text-base-content/80">
          {problem.description.text}
        </p>
      )}

      {/* NOTES (SAFE) */}
      {problem.description?.notes?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Notes:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {problem.description.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* TEST CASES */}
      {problem.testCases?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Test Cases</h3>

          <div className="space-y-3">
            {problem.testCases.map((t, i) => (
              <div
                key={i}
                className="p-3 bg-base-200 rounded-lg text-sm"
              >
                <p className="font-medium">Input:</p>
                <pre className="mb-1">{t.input}</pre>

                <p className="font-medium">Output:</p>
                <pre>{t.output}</pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROBLEM SWITCHER */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">All Problems</h3>

        <select
          value={currentProblemId}
          onChange={(e) => onProblemChange(e.target.value)}
          className="select select-bordered w-full"
        >
          {allProblems.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ProblemDescription;
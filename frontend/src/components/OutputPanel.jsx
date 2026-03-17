function OutputPanel({ output }) {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm">
        Output
      </div>

      <div className="flex-1 overflow-auto p-4">
        {output ? (
          <pre className="text-sm font-mono whitespace-pre-wrap">
            {output}
          </pre>
        ) : (
          <p className="text-base-content/50 text-sm">
            Click "Run Code" to see output...
          </p>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
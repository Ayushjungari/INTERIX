import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEMS["two-sum"].starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentProblem = PROBLEMS[currentProblemId];

  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [id, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(currentProblem.starterCode[lang]);
    setOutput(null);
  };

  const handleProblemChange = (newId) => {
    navigate(`/problem/${newId}`);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 200,
      origin: { y: 0.6 },
    });
  };

  // MAIN RUN FUNCTION
const handleRun = async () => {
  try {
    setIsRunning(true);
    setOutput("Running...");

    const finalCode = `
${code}

// Auto Test Runner
const tests = [
  { nums: [2,7,11,15], target: 9 },
  { nums: [3,2,4], target: 6 },
  { nums: [3,3], target: 6 }
];

for (const t of tests) {
  const res = twoSum(t.nums, t.target);
  console.log(JSON.stringify(res));
}
`;

    const res = await fetch("http://localhost:8000/api/code/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: finalCode,
        input: "",
      }),
    });

    const data = await res.json();

    console.log("RESULT:", data);

    setOutput(data.stdout || data.stderr || "No Output");

  } catch (err) {
    console.error(err);
    setOutput("Execution Failed");
  } finally {
    setIsRunning(false);
  }
};

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* LEFT */}
          <Panel defaultSize={40}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300" />

          {/* RIGHT */}
          <Panel defaultSize={60}>
            <PanelGroup direction="vertical">
              {/* EDITOR */}
              <Panel defaultSize={70}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRun}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300" />

              {/* OUTPUT */}
              <Panel defaultSize={30}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
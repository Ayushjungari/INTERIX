import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode, submitCode } from "../lib/piston";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialId = id && PROBLEMS[id] ? id : "two-sum";
  const [currentProblemId, setCurrentProblemId] = useState(initialId);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEMS[initialId].starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentProblem = PROBLEMS[currentProblemId];

  // Sync when URL id or language changes; use fresh starter code for that problem+lang.
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      const p = PROBLEMS[id];
      setCode(p.starterCode[selectedLanguage] || p.starterCode.javascript);
      setOutput(null);
    }
  }, [id, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    const p = PROBLEMS[currentProblemId];
    setCode(p.starterCode[lang] || "");
    setOutput(null);
  };

  const handleProblemChange = (newId) => navigate(`/problem/${newId}`);

  const triggerConfetti = () => {
    confetti({ particleCount: 120, spread: 200, origin: { y: 0.6 } });
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);
    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    if (!result.success) toast.error(result.verdict || "Execution failed");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput(null);
    const result = await submitCode(selectedLanguage, code, currentProblemId);
    setOutput(result);
    setIsSubmitting(false);

    if (result.verdict === "Accepted") {
      triggerConfetti();
      toast.success(`Accepted (${result.testsPassed}/${result.testsTotal})`);
    } else if (result.verdict === "Wrong Answer") {
      toast.error(`Wrong Answer (${result.testsPassed}/${result.testsTotal})`);
    } else if (result.verdict === "Ran") {
      toast(
        "Ran your program. Hidden-test judging for Java/C++ requires a per-problem harness.",
        { icon: "ℹ️" }
      );
    } else {
      toast.error(result.verdict || "Submission failed");
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={25}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300" />

          <Panel defaultSize={60}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={65} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRun}
                  onSubmitCode={handleSubmit}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300" />

              <Panel defaultSize={35} minSize={20}>
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

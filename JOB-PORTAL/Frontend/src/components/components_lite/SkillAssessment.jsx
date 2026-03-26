import React, { useState } from "react";
import Navbar from "./Navbar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Code,
  Brain,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
  Zap,
  Target,
} from "lucide-react";

const quizzes = [
  {
    id: "js",
    title: "JavaScript Fundamentals",
    icon: Code,
    color: "from-yellow-500 to-amber-500",
    difficulty: "Intermediate",
    time: "10 min",
    badge: "🏆 JS Pro",
    questions: [
      { q: "What does `typeof null` return in JavaScript?", options: ["null", "undefined", "object", "boolean"], answer: 2 },
      { q: "Which method converts JSON string to a JavaScript object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.decode()"], answer: 1 },
      { q: "What is the output of `[] == false`?", options: ["true", "false", "TypeError", "undefined"], answer: 0 },
      { q: "Which keyword declares a block-scoped variable?", options: ["var", "let", "global", "static"], answer: 1 },
      { q: "What does the `??` operator do?", options: ["Logical AND", "Logical OR", "Nullish coalescing", "Optional chaining"], answer: 2 },
    ],
  },
  {
    id: "react",
    title: "React & Frontend",
    icon: Zap,
    color: "from-cyan-500 to-blue-500",
    difficulty: "Intermediate",
    time: "10 min",
    badge: "⚛️ React Dev",
    questions: [
      { q: "What hook manages state in functional components?", options: ["useEffect", "useState", "useRef", "useMemo"], answer: 1 },
      { q: "What is the virtual DOM?", options: ["A browser API", "A database", "A lightweight copy of the actual DOM", "A CSS framework"], answer: 2 },
      { q: "Which of these is NOT a React hook?", options: ["useReducer", "useContext", "useHistory", "useCallback"], answer: 2 },
      { q: "What does `useEffect` with an empty dependency array do?", options: ["Runs on every render", "Runs once on mount", "Never runs", "Runs on unmount"], answer: 1 },
      { q: "What is JSX?", options: ["A template engine", "A syntax extension for JavaScript", "A CSS preprocessor", "A database query language"], answer: 1 },
    ],
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    icon: Brain,
    color: "from-purple-500 to-violet-600",
    difficulty: "Advanced",
    time: "15 min",
    badge: "🧠 DSA Expert",
    questions: [
      { q: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], answer: 2 },
      { q: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Tree", "Graph"], answer: 1 },
      { q: "What is the worst-case time complexity of QuickSort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], answer: 2 },
      { q: "Which traversal visits root first in a binary tree?", options: ["In-order", "Pre-order", "Post-order", "Level-order"], answer: 1 },
      { q: "What data structure is used in BFS?", options: ["Stack", "Queue", "Heap", "Array"], answer: 1 },
    ],
  },
  {
    id: "aptitude",
    title: "Aptitude & Logical Reasoning",
    icon: Target,
    color: "from-green-500 to-emerald-500",
    difficulty: "Beginner",
    time: "8 min",
    badge: "🎯 Sharp Mind",
    questions: [
      { q: "If a train travels 120km in 2 hours, what is its speed?", options: ["40 km/h", "60 km/h", "80 km/h", "100 km/h"], answer: 1 },
      { q: "Complete the sequence: 2, 6, 18, 54, ?", options: ["108", "162", "216", "72"], answer: 1 },
      { q: "A is B's sister. B is C's mother. What is A to C?", options: ["Mother", "Aunt", "Sister", "Grandmother"], answer: 1 },
      { q: "If APPLE = 50, ORANGE = ?", options: ["60", "65", "70", "55"], answer: 1 },
      { q: "What comes next: J, F, M, A, M, J, ?", options: ["A", "J", "S", "O"], answer: 1 },
    ],
  },
];

const SkillAssessment = () => {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [badges, setBadges] = useState([]);

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
  };

  const handleSelect = (optionIdx) => {
    if (selected !== null) return; // already answered
    setSelected(optionIdx);
  };

  const handleNext = () => {
    setAnswers((prev) => [...prev, selected]);
    if (currentQ + 1 < activeQuiz.questions.length) {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
    } else {
      setShowResult(true);
      const finalAnswers = [...answers, selected];
      const score = finalAnswers.reduce((acc, ans, i) => acc + (ans === activeQuiz.questions[i].answer ? 1 : 0), 0);
      const pct = Math.round((score / activeQuiz.questions.length) * 100);
      if (pct >= 80 && !badges.includes(activeQuiz.id)) {
        setBadges((prev) => [...prev, activeQuiz.id]);
      }
    }
  };

  const getResult = () => {
    const finalAnswers = [...answers];
    const score = finalAnswers.reduce((acc, ans, i) => acc + (ans === activeQuiz.questions[i].answer ? 1 : 0), 0);
    const pct = Math.round((score / activeQuiz.questions.length) * 100);
    return { score, total: activeQuiz.questions.length, pct };
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Skill Assessment</h1>
              <p className="text-sm text-muted-foreground">Take quizzes & earn verified badges</p>
            </div>
          </div>
          {badges.length > 0 && (
            <div className="flex gap-2">
              {badges.map((badgeId) => {
                const quiz = quizzes.find((q) => q.id === badgeId);
                return <Badge key={badgeId} className="text-xs gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-200">{quiz?.badge}</Badge>;
              })}
            </div>
          )}
        </div>

        {!activeQuiz ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz, i) => (
              <button
                key={quiz.id}
                onClick={() => startQuiz(quiz)}
                className="opacity-0 animate-fadeSlideIn p-6 rounded-2xl bg-card border border-border hover-lift text-left group transition-all"
                style={{ animationFillMode: "forwards", animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${quiz.color}`}>
                    <quiz.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{quiz.title}</h3>
                    <p className="text-xs text-muted-foreground">{quiz.questions.length} questions • {quiz.time}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{quiz.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Quiz <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
                {badges.includes(quiz.id) && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-yellow-600">
                    <Trophy className="h-3 w-3" /> Badge Earned: {quiz.badge}
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : showResult ? (
          <div className="max-w-lg mx-auto">
            <div className="p-8 rounded-2xl bg-card border border-border text-center opacity-0 animate-scaleIn" style={{ animationFillMode: "forwards" }}>
              {getResult().pct >= 80 ? (
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              ) : (
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              )}
              <h2 className="text-2xl font-bold mb-2">
                {getResult().pct >= 80 ? "Congratulations! 🎉" : "Good Effort! 💪"}
              </h2>
              <p className="text-4xl font-bold text-primary mb-2">{getResult().pct}%</p>
              <p className="text-muted-foreground mb-4">
                {getResult().score}/{getResult().total} correct answers
              </p>
              {getResult().pct >= 80 && (
                <Badge className="text-sm gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-200 mb-4">
                  <Trophy className="h-4 w-4" /> {activeQuiz.badge} Badge Earned!
                </Badge>
              )}
              <div className="flex gap-3 justify-center mt-4">
                <Button variant="outline" onClick={() => startQuiz(activeQuiz)}>
                  <RotateCcw className="h-4 w-4 mr-2" /> Retry
                </Button>
                <Button onClick={() => setActiveQuiz(null)} className="bg-primary">
                  All Quizzes
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-muted-foreground">
                Question {currentQ + 1} of {activeQuiz.questions.length}
              </span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{activeQuiz.time}</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${((currentQ + 1) / activeQuiz.questions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="p-6 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
              <h3 className="text-lg font-semibold mb-6">{activeQuiz.questions[currentQ].q}</h3>
              <div className="space-y-3">
                {activeQuiz.questions[currentQ].options.map((option, optIdx) => {
                  const isCorrect = optIdx === activeQuiz.questions[currentQ].answer;
                  const isSelected = selected === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(optIdx)}
                      className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all border ${selected === null
                          ? "border-border hover:border-primary/50 hover:bg-primary/5"
                          : isSelected && isCorrect
                            ? "border-green-500 bg-green-500/10 text-green-600"
                            : isSelected && !isCorrect
                              ? "border-red-500 bg-red-500/10 text-red-600"
                              : isCorrect
                                ? "border-green-500 bg-green-500/5"
                                : "border-border opacity-50"
                        }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs bg-muted shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        {option}
                        {selected !== null && isCorrect && <CheckCircle2 className="h-4 w-4 ml-auto text-green-500" />}
                        {selected !== null && isSelected && !isCorrect && <XCircle className="h-4 w-4 ml-auto text-red-500" />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {selected !== null && (
                <Button onClick={handleNext} className="mt-6 w-full bg-primary">
                  {currentQ + 1 === activeQuiz.questions.length ? "See Results" : "Next Question"} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillAssessment;

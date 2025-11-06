"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Sparkles, Volume2, VolumeX } from "lucide-react";
import { quests } from "../../../lib/quest/questQuestion";

// --- THEME ---
const THEMES = [
  { from: "from-indigo-100", to: "to-indigo-50" },
  { from: "from-pink-100", to: "to-rose-50" },
  { from: "from-amber-100", to: "to-yellow-50" },
  { from: "from-emerald-100", to: "to-green-50" },
];

// --- SOUNDS ---
const correctSound = "/sounds/correct.mp3";
const wrongSound = "/sounds/wrong.mp3";

// --- MINI CHARACTER ---
const MiniCharacter = ({ emotion }) => {
  const expressions = {
    idle: "/avatars/mini_idle.png",
    happy: "/avatars/mini_happy.png",
    sad: "/avatars/mini_sad.png",
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-center"
    >
      <img
        src={expressions[emotion] || expressions.idle}
        alt="Mini Character"
        className="w-52 h-52 drop-shadow-md"
      />
      <p className="text-xs text-slate-500 mt-1">ARUNA</p>
    </motion.div>
  );
};

// --- DERIVE SIMPLE QUIZ FROM QUESTS' START SCENES ---
function deriveQuestionsFromQuests() {
  try {
    const list = Object.values(quests || {});
    return list.map((q) => {
      const start = q.scenarios?.[q.startScenarioId];
      const title = q.title || "Quest";
      const text = start?.narrative || q.description || "";
      const choices = (start?.choices || []).map((c) => ({ id: c.id, text: c.text }));
      const correctChoiceId = choices[0]?.id; // placeholder to fit current quiz logic
      return { id: q.id, title, text, choices, correctChoiceId };
    }).filter((x) => x && x.choices && x.choices.length > 0);
  } catch {
    return [];
  }
}

const STORAGE_KEY = "arunika_quest_v2";

// --- LOCAL STORAGE HANDLER ---
function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

// --- CHOICE BUTTON ---
function ChoiceButton({ choice, selected, onSelect, disabled }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(choice.id)}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between
        ${selected ? "bg-indigo-50 border-indigo-400" : "bg-white border-slate-200 hover:bg-slate-50"}
        disabled:opacity-50`}
    >
      <span>{choice.text}</span>
      {selected && <Check className="text-indigo-500" size={18} />}
    </motion.button>
  );
}

// --- PROGRESS ORB ---
function ProgressOrb({ progress }) {
  return (
    <div className="relative w-6 h-6">
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-400 to-pink-400"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ opacity: 0.3 }}
      />
      <div
        className="absolute inset-0 border-2 border-indigo-500 rounded-full"
        style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
      />
    </div>
  );
}

// --- MAIN QUEST COMPONENT ---
export default function QuestPage({ questions }) {
  const derivedQuestions = deriveQuestionsFromQuests();
  const qList = Array.isArray(questions) && questions.length > 0 ? questions : derivedQuestions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(qList[0]?.timeLimitSec ?? null);
  const [emotion, setEmotion] = useState("idle");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [analysis, setAnalysis] = useState(null);

  const current = qList[currentIndex];
  const theme = THEMES[currentIndex % THEMES.length];

  // --- LOAD SAVED STATE ---
  useEffect(() => {
    const saved = loadProgress();
    if (saved && saved.questionsLength === qList.length) {
      setCurrentIndex(saved.currentIndex);
      setAnswers(saved.answers);
      setShowResults(saved.showResults);
    }
  }, [qList.length]);

  // --- AUTO SAVE ---
  useEffect(() => {
    saveProgress({ currentIndex, answers, showResults, questionsLength: qList.length });
  }, [currentIndex, answers, showResults, qList.length]);

  // --- TIMER ---
  useEffect(() => {
    const q = qList[currentIndex];
    if (!q?.timeLimitSec) return setTimeLeft(null);
    setTimeLeft(q.timeLimitSec);
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleNext();
          return null;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [currentIndex, qList]);

  const playSound = (file) => {
    if (!soundEnabled) return;
    const audio = new Audio(file);
    audio.volume = 0.5;
    audio.play();
  };

  const handleSelect = useCallback(
    (choiceId) => {
      setAnswers((prev) => ({ ...prev, [current.id]: choiceId }));
      const isCorrect = choiceId === current.correctChoiceId;
      playSound(isCorrect ? correctSound : wrongSound);
      setEmotion(isCorrect ? "happy" : "sad");
      setTimeout(() => setEmotion("idle"), 1500);
    },
    [current]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= qList.length) {
      setShowResults(true);
      generateAnalysis(); // 🔥 Buat analisis saat semua selesai
      return;
    }
    setCurrentIndex((i) => i + 1);
  }, [currentIndex, qList.length, answers]);

  const handlePrev = useCallback(() => setCurrentIndex((i) => Math.max(0, i - 1)), []);

  const score = qList.reduce(
    (acc, q) => (answers[q.id] === q.correctChoiceId ? acc + 1 : acc),
    0
  );

  // --- ANALYSIS GENERATOR ---
  const generateAnalysis = () => {
    const ratio = score / questions.length;
    let result;
    if (ratio === 1) {
      result = {
        title: "🩵 Visionary Thinker",
        desc: "Kamu memiliki pemahaman yang tajam dan mampu menangkap esensi dari konsep dengan sempurna. Setiap keputusanmu diambil dengan penuh kesadaran dan ketepatan.",
      };
    } else if (ratio >= 0.6) {
      result = {
        title: "💫 Adaptive Explorer",
        desc: "Kamu punya kemampuan memahami pola dan belajar dari pengalaman. Masih ada ruang untuk penyempurnaan, tapi arahmu sudah sangat baik!",
      };
    } else {
      result = {
        title: "🌱 Reflective Learner",
        desc: "Kamu sedang membangun pondasi pengetahuanmu dengan sabar. Setiap langkah dan kesalahan adalah bagian dari perjalanan belajarmu.",
      };
    }
    setAnalysis(result);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen bg-gradient-to-b ${theme.from} ${theme.to} flex flex-col items-center justify-start p-6 relative`}
    >
      <div className="w-full max-w-3xl">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Sparkles className="text-indigo-500" /> Aruna Quest
            </h1>
            <p className="text-sm text-slate-500">
              Gunakan tombol panah / angka untuk menjawab cepat
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled((s) => !s)}
              className="p-2 rounded-full bg-white shadow hover:bg-slate-100"
              title={soundEnabled ? "Mute" : "Unmute"}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <ProgressOrb progress={((currentIndex + (showResults ? 1 : 0)) / qList.length) * 100} />
            <div className="text-xs text-slate-500">
              {currentIndex + 1}/{qList.length}
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="bg-white shadow-md rounded-2xl p-6">
          <AnimatePresence mode="wait">
            {!showResults ? (
              // --- QUESTION SCREEN ---
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">{current.title}</h2>
                  {timeLeft && (
                    <motion.div
                      key={timeLeft}
                      className="text-xs bg-indigo-50 px-2 py-1 rounded border border-indigo-100"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      {timeLeft}s
                    </motion.div>
                  )}
                </div>

                <p className="text-sm text-slate-500 mb-4">{current.text}</p>

                <div className="space-y-3">
                  {current.choices.map((c) => (
                    <ChoiceButton
                      key={c.id}
                      choice={c}
                      selected={answers[current.id] === c.id}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:brightness-110 flex items-center gap-2"
                  >
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ) : (
              // --- RESULT SCREEN ---
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center py-8">
                  <h3 className="text-2xl font-semibold mb-2">✨ Hasil Perjalananmu ✨</h3>
                  <p className="text-slate-500 mb-6">
                    Kamu menuntaskan seluruh quest dengan semangat!
                  </p>

                  <motion.div
                    className="inline-block px-6 py-4 bg-indigo-50 border rounded-lg mb-6"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="text-sm text-slate-400">Score</div>
                    <div className="text-3xl font-bold">{score} / {qList.length}</div>
                  </motion.div>

                  {analysis && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 bg-white border rounded-xl p-5 text-left shadow-sm"
                    >
                      <h4 className="text-lg font-semibold mb-2 text-indigo-600">
                        {analysis.title}
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {analysis.desc}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="text-center mt-8 text-xs text-slate-400">
          © 2025 — Crafted with ☀️ by <span className="font-semibold">ARUNIKA</span>
        </footer>
      </div>

      {/* 🧍 Mini Character */}
      <MiniCharacter emotion={emotion} />
    </motion.div>
  );
}

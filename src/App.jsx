import React, { useState, useEffect, useMemo } from 'react';
import { Brain, Share2, Printer, RefreshCw, ChevronDown, ChevronUp, Sparkles, BarChart3, TrendingUp, Zap } from 'lucide-react';

// Safe storage wrapper
const storage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window && window.localStorage && typeof window.localStorage.getItem === 'function') {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Storage not available
    }
    return null;
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window && window.localStorage && typeof window.localStorage.setItem === 'function') {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Storage not available
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window && window.localStorage && typeof window.localStorage.removeItem === 'function') {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Storage not available
    }
  }
};

// Questions Data
const QUESTIONS = [
  {
    id: "q1",
    prompt: "When a complex project encounters unexpected challenges, what best reflects your immediate cognitive response?",
    helper: "Consider your natural thinking pattern.",
    baited: true,
    pairKey: "deadline",
    options: [
      {
        id: "q1o1",
        label: "I rapidly synthesize external variables and articulate how systemic complexity shaped the outcome.",
        accountabilityDelta: -2,
        impressionDelta: 2,
        inconsistencyHint: "A",
      },
      {
        id: "q1o2",
        label: "I analyze my decision framework first, then map external factors for future optimization.",
        accountabilityDelta: 3,
        impressionDelta: 0,
        inconsistencyHint: "B",
      },
      {
        id: "q1o3",
        label: "I reframe parameters to match emergent realities, demonstrating cognitive flexibility.",
        accountabilityDelta: -2,
        impressionDelta: 2,
      },
      {
        id: "q1o4",
        label: "I deconstruct my approach, identify gaps, and construct an improved methodology.",
        accountabilityDelta: 2,
        impressionDelta: 0,
      },
    ],
  },
  {
    id: "q2",
    prompt: "You publish innovative analysis and later discover a foundational premise was flawed. Your intellectual response?",
    helper: "Think about preserving intellectual integrity.",
    baited: true,
    pairKey: "assumption",
    options: [
      {
        id: "q2o1",
        label: "Elegantly evolve the thesis while maintaining narrative momentum and thought leadership.",
        accountabilityDelta: -2,
        impressionDelta: 2,
        inconsistencyHint: "A",
      },
      {
        id: "q2o2",
        label: "Publish a detailed correction mapping the error cascade and revised mental model.",
        accountabilityDelta: 3,
        impressionDelta: 0,
        inconsistencyHint: "B",
      },
      {
        id: "q2o3",
        label: "Demonstrate that peripheral errors don't invalidate core insights, showing nuanced thinking.",
        accountabilityDelta: -2,
        impressionDelta: 1,
      },
      {
        id: "q2o4",
        label: "Archive the original, document the learning, and rebuild with transparent methodology.",
        accountabilityDelta: 2,
        impressionDelta: 0,
      },
    ],
  },
  {
    id: "q3",
    prompt: "Multiple colleagues note you dominated intellectual discourse in a collaborative session.",
    helper: "Select your authentic response pattern.",
    baited: true,
    options: [
      {
        id: "q3o1",
        label: "Explain how rapid ideation and intellectual energy drive breakthrough thinking.",
        accountabilityDelta: -2,
        impressionDelta: 2,
      },
      {
        id: "q3o2",
        label: "Acknowledge the pattern, request feedback signals, and implement discourse protocols.",
        accountabilityDelta: 3,
        impressionDelta: 0,
      },
      {
        id: "q3o3",
        label: "Note that cognitive diversity requires strong voices to catalyze productive friction.",
        accountabilityDelta: -2,
        impressionDelta: 1,
      },
      {
        id: "q3o4",
        label: "Map the impact on idea flow and design personal constraints for balanced contribution.",
        accountabilityDelta: 2,
        impressionDelta: 0,
      },
    ],
  },
  {
    id: "q4",
    prompt: "You committed to a complex learning protocol but broke consistency after initial progress.",
    helper: "Consider your internal narrative.",
    baited: true,
    pairKey: "streak",
    options: [
      {
        id: "q4o1",
        label: "The framework was suboptimal; what matters is knowledge acquisition trajectory.",
        accountabilityDelta: -2,
        impressionDelta: 1,
        inconsistencyHint: "A",
      },
      {
        id: "q4o2",
        label: "Document the break, reset baseline, and analyze cognitive/environmental triggers.",
        accountabilityDelta: 3,
        impressionDelta: 0,
        inconsistencyHint: "B",
      },
      {
        id: "q4o3",
        label: "Expand the definition to include adjacent activities, showing systems thinking.",
        accountabilityDelta: -2,
        impressionDelta: 2,
      },
      {
        id: "q4o4",
        label: "Log the variance without rationalization and engineer environmental countermeasures.",
        accountabilityDelta: 2,
        impressionDelta: 0,
      },
    ],
  },
  {
    id: "q5",
    prompt: "A critical error emerges in work you validated through peer review.",
    helper: "Choose your instinctive knowledge-worker response.",
    baited: true,
    pairKey: "review",
    options: [
      {
        id: "q5o1",
        label: "Emphasize how robust systems should catch edge cases beyond individual cognition.",
        accountabilityDelta: -2,
        impressionDelta: 1,
        inconsistencyHint: "A",
      },
      {
        id: "q5o2",
        label: "Own the oversight, create regression tests, and strengthen review heuristics.",
        accountabilityDelta: 3,
        impressionDelta: 0,
        inconsistencyHint: "B",
      },
      {
        id: "q5o3",
        label: "Frame it as acceptable noise in high-velocity innovation environments.",
        accountabilityDelta: -1,
        impressionDelta: 1,
      },
      {
        id: "q5o4",
        label: "Signal the issue, detail root cause, and implement enhanced validation protocols.",
        accountabilityDelta: 2,
        impressionDelta: 0,
      },
    ],
  },
  {
    id: "q6",
    prompt: "A prior commitment conflicts with an opportunity for exceptional intellectual growth.",
    helper: "Answer based on actual behavior, not ideals.",
    baited: true,
    options: [
      {
        id: "q6o1",
        label: "Optimize for rare high-growth experiences that compound cognitive capabilities.",
        accountabilityDelta: -2,
        impressionDelta: 2,
      },
      {
        id: "q6o2",
        label: "Honor the commitment while analyzing why the alternative triggered opportunity cost anxiety.",
        accountabilityDelta: 3,
        impressionDelta: 0,
      },
      {
        id: "q6o3",
        label: "Craft thoughtful context explaining how the pivot aligns with shared growth values.",
        accountabilityDelta: -2,
        impressionDelta: 1,
      },
      {
        id: "q6o4",
        label: "Propose rescheduling transparently, accepting their decision as binding.",
        accountabilityDelta: 2,
        impressionDelta: 0,
      },
    ],
  },
  {
    id: "q7",
    prompt: "During public intellectual discourse, you're asked about unfamiliar territory.",
    helper: "Select what you actually do, not the ideal.",
    baited: true,
    options: [
      {
        id: "q7o1",
        label: "Demonstrate intellectual range through abstract reasoning while accessing memory.",
        accountabilityDelta: -2,
        impressionDelta: 2,
      },
      {
        id: "q7o2",
        label: "State knowledge boundaries clearly, outline learning approach, commit to follow-up.",
        accountabilityDelta: 3,
        impressionDelta: 0,
      },
      {
        id: "q7o3",
        label: "Bridge to adjacent expertise domains where you can provide immediate value.",
        accountabilityDelta: -1,
        impressionDelta: 2,
      },
      {
        id: "q7o4",
        label: "Crowdsource insight from present experts while framing the synthesis challenge.",
        accountabilityDelta: 1,
        impressionDelta: 0,
      },
    ],
  },
  {
    id: "q8",
    prompt: "Your analytical feedback created unexpected interpersonal friction.",
    baited: true,
    pairKey: "feedback",
    options: [
      {
        id: "q8o1",
        label: "Clarify that rigorous thinking requires direct communication for optimal outcomes.",
        accountabilityDelta: -1,
        impressionDelta: 1,
        inconsistencyHint: "A",
      },
      {
        id: "q8o2",
        label: "Explore the reception gap, acknowledge impact, and recalibrate delivery method.",
        accountabilityDelta: 3,
        impressionDelta: 0,
        inconsistencyHint: "B",
      },
      {
        id: "q8o3",
        label: "Suggest developing stronger capacity to process objective analysis.",
        accountabilityDelta: -2,
        impressionDelta: 1,
      },
      {
        id: "q8o4",
        label: "Accept delivery failure, apologize for impact, establish new communication protocols.",
        accountabilityDelta: 2,
        impressionDelta: 0,
      },
    ],
  },
];

// Utility functions
function computeScores(answers) {
  let accountability = 0;
  let impression = 0;
  const pairBins = {};

  for (const q of QUESTIONS) {
    const selectedId = answers[q.id];
    if (!selectedId) continue;
    const opt = q.options.find(o => o.id === selectedId);
    if (!opt) continue;

    accountability += opt.accountabilityDelta;
    impression += opt.impressionDelta;

    if (q.pairKey && opt.inconsistencyHint) {
      if (!pairBins[q.pairKey]) pairBins[q.pairKey] = { A: 0, B: 0 };
      pairBins[q.pairKey][opt.inconsistencyHint] += 1;
    }
  }

  let inconsistency = 0;
  Object.values(pairBins).forEach(bin => {
    if (bin.A > 0 && bin.B > 0) inconsistency += 1;
  });

  const accountabilityScore = Math.round(clamp(scaleTo100(accountability, -12, 24)));
  const impressionScore = Math.round(clamp(scaleTo100(impression, 0, 16)));
  const inconsistencyScore = Math.round(clamp(scaleTo100(inconsistency, 0, 4)));
  
  const deceptionScoreRaw = (100 - accountabilityScore) * 0.55 + impressionScore * 0.35 + inconsistencyScore * 0.10;
  const deceptionScore = Math.round(clamp(deceptionScoreRaw));

  return { accountabilityScore, impressionScore, inconsistencyScore, deceptionScore };
}

function scaleTo100(value, min, max) {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function clamp(n, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

function band(n) {
  if (n >= 80) return "Very High";
  if (n >= 60) return "High";
  if (n >= 40) return "Moderate";
  if (n >= 20) return "Low";
  return "Very Low";
}

function generateResultId() {
  const timestamp = typeof Date !== 'undefined' ? Date.now() : Math.floor(Math.random() * 1000000);
  return `GOMA-${timestamp.toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

function encodeResult(result) {
  const data = {
    i: result.id,
    t: result.timestamp,
    a: Object.entries(result.answers).map(([k, v]) => `${k}:${v}`).join(','),
    s: `${result.scores.accountabilityScore},${result.scores.impressionScore},${result.scores.inconsistencyScore},${result.scores.deceptionScore}`
  };
  
  try {
    if (typeof btoa !== 'undefined') {
      return btoa(JSON.stringify(data));
    } else {
      return encodeURIComponent(JSON.stringify(data));
    }
  } catch {
    return encodeURIComponent(JSON.stringify(data));
  }
}

function decodeResult(token) {
  try {
    let dataStr = '';
    
    if (typeof atob !== 'undefined') {
      try {
        dataStr = atob(token);
      } catch {
        dataStr = decodeURIComponent(token);
      }
    } else {
      dataStr = decodeURIComponent(token);
    }
    
    const data = JSON.parse(dataStr);
    const answers = {};
    data.a.split(',').forEach((pair) => {
      const [k, v] = pair.split(':');
      answers[k] = v;
    });
    const [accountability, impression, inconsistency, deception] = data.s.split(',').map(Number);
    return {
      id: data.i,
      timestamp: data.t,
      answers,
      scores: {
        accountabilityScore: accountability,
        impressionScore: impression,
        inconsistencyScore: inconsistency,
        deceptionScore: deception
      }
    };
  } catch {
    return null;
  }
}

function buildNarrative(s) {
  const bullets = [];

  if (s.accountabilityScore >= 70) {
    bullets.push("You demonstrate exceptional clarity in converting setbacks into actionable insights.");
  } else if (s.accountabilityScore >= 40) {
    bullets.push("You balance strategic thinking with occasional focus on external narratives.");
  } else {
    bullets.push("Your cognitive style emphasizes contextual factors over direct course correction.");
  }

  if (s.impressionScore >= 70) {
    bullets.push("You highly value intellectual positioning and thought leadership presence.");
  } else if (s.impressionScore >= 40) {
    bullets.push("You maintain a balanced approach between substance and intellectual presentation.");
  } else {
    bullets.push("You prioritize authentic expression over curated intellectual presence.");
  }

  if (s.inconsistencyScore >= 60) {
    bullets.push("Your responses show significant variance across similar cognitive challenges.");
  } else if (s.inconsistencyScore >= 30) {
    bullets.push("You demonstrate moderate flexibility in approach based on context.");
  } else {
    bullets.push("Your cognitive patterns remain highly consistent across varied scenarios.");
  }

  let headline = "";
  if (s.deceptionScore >= 75) {
    headline = "Your profile reveals a strong orientation toward intellectual impression management. Consider how prioritizing authentic clarity could accelerate genuine breakthroughs.";
  } else if (s.deceptionScore >= 55) {
    headline = "You navigate between authentic expression and strategic positioning. Leaning toward transparency may unlock deeper connections and insights.";
  } else if (s.deceptionScore >= 35) {
    headline = "You demonstrate solid intellectual integrity with room to further embrace direct ownership of outcomes and ideas.";
  } else {
    headline = "Your responses show exceptional intellectual clarity, consistent patterns, and authentic engagement with complex challenges.";
  }

  return { headline, bullets };
}

// Score Card Component
function ScoreCard({ title, score, band, color, icon }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className={`p-2 rounded-lg bg-gradient-to-r ${color} text-white`}>
          {icon}
        </div>
      </div>
      <div className="mb-3">
        <div className="text-3xl font-bold text-gray-900">{score}%</div>
        <div className="text-sm text-gray-600">{band}</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// Results Component
function ResultsView({ result, onRetake, onShare, onPrint, showCopied }) {
  const [showDetails, setShowDetails] = useState(false);
  const { scores } = result;
  const narrative = buildNarrative(scores);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 print:bg-white">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 print:shadow-none">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Your Cognitive Profile
            </h1>
            <p className="text-gray-600">Assessment ID: {result.id}</p>
            <p className="text-sm text-gray-500">
              {typeof Date !== 'undefined' ? new Date(result.timestamp).toLocaleString() : `Time: ${result.timestamp}`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <ScoreCard
              title="Clarity Under Pressure"
              score={scores.accountabilityScore}
              band={band(scores.accountabilityScore)}
              color="from-blue-500 to-indigo-600"
              icon={<Brain className="w-6 h-6" />}
            />
            <ScoreCard
              title="Self-Presentation Drive"
              score={scores.impressionScore}
              band={band(scores.impressionScore)}
              color="from-purple-500 to-pink-600"
              icon={<Sparkles className="w-6 h-6" />}
            />
            <ScoreCard
              title="Pattern Consistency"
              score={100 - scores.inconsistencyScore}
              band={band(100 - scores.inconsistencyScore)}
              color="from-green-500 to-emerald-600"
              icon={<BarChart3 className="w-6 h-6" />}
            />
            <ScoreCard
              title="Signal Clarity Index"
              score={100 - scores.deceptionScore}
              band={band(100 - scores.deceptionScore)}
              color="from-orange-500 to-red-600"
              icon={<TrendingUp className="w-6 h-6" />}
            />
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Your Cognitive Analysis</h3>
            <p className="text-gray-700 mb-4">{narrative.headline}</p>
            <ul className="space-y-2">
              {narrative.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span className="text-gray-700">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="print:hidden flex gap-3 mb-6">
            <button
              onClick={onRetake}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Retake Assessment
            </button>
            <button
              onClick={onShare}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              {showCopied ? 'Copied!' : 'Share'}
            </button>
            <button
              onClick={onPrint}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
          </div>

          <div className="print:hidden">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-semibold text-gray-700">Detailed Response Analysis</span>
              {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {showDetails && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-semibold text-gray-700">Question</th>
                      <th className="text-left py-2 text-sm font-semibold text-gray-700">Your Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {QUESTIONS.map((q, i) => {
                      const selectedOpt = q.options.find(o => o.id === result.answers[q.id]);
                      return (
                        <tr key={q.id} className="border-b border-gray-100">
                          <td className="py-3 pr-4 text-sm text-gray-600 align-top">{i + 1}. {q.prompt}</td>
                          <td className="py-3 text-sm text-gray-800">{selectedOpt?.label || 'No response'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function GiftedOpenMindAssessment() {
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState('intro');
  const [savedResult, setSavedResult] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Check if localStorage is available
  const hasLocalStorage = typeof window !== 'undefined' && window.localStorage;

  // Load from URL if shared
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location && typeof URLSearchParams !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('result');
        if (token) {
          const decoded = decodeResult(token);
          if (decoded) {
            setSavedResult(decoded);
            setCurrentStep('results');
          }
        }
      }
    } catch {
      // URL parsing failed, ignore
    }
  }, []);

  // Persistence
  useEffect(() => {
    if (currentStep !== 'assessment') return;
    
    const saved = storage.getItem('goma-current');
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch {
        // Invalid JSON
      }
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 'assessment' || Object.keys(answers).length === 0) return;
    
    storage.setItem('goma-current', JSON.stringify(answers));
  }, [answers, currentStep]);

  const progress = useMemo(() => {
    const answered = Object.keys(answers).length;
    return Math.round((answered / QUESTIONS.length) * 100);
  }, [answers]);

  const canSubmit = Object.keys(answers).length === QUESTIONS.length;

  function selectOption(qid, oid) {
    setAnswers(prev => ({ ...prev, [qid]: oid }));
  }

  function handleSubmit() {
    const scores = computeScores(answers);
    const result = {
      id: generateResultId(),
      timestamp: typeof Date !== 'undefined' ? Date.now() : 1234567890,
      answers,
      scores
    };
    setSavedResult(result);
    setCurrentStep('results');
    
    storage.removeItem('goma-current');
    
    // Save to history
    try {
      const historyStr = storage.getItem('goma-history');
      const history = historyStr ? JSON.parse(historyStr) : [];
      history.unshift(result);
      storage.setItem('goma-history', JSON.stringify(history.slice(0, 10)));
    } catch {
      // Failed to save history
    }
  }

  function reset() {
    setAnswers({});
    setSavedResult(null);
    setCurrentStep('intro');
    storage.removeItem('goma-current');
  }

  function shareResult() {
    if (!savedResult) return;
    const token = encodeResult(savedResult);
    
    let url = '';
    if (typeof window !== 'undefined') {
      url = `${window.location.origin}${window.location.pathname}?result=${token}`;
    } else {
      url = `https://example.com?result=${token}`;
    }
    
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
      }).catch(() => {
        if (typeof window !== 'undefined') {
          window.alert(`Copy this link to share: ${url}`);
        }
      });
    } else {
      if (typeof window !== 'undefined') {
        window.alert(`Copy this link to share: ${url}`);
      }
    }
  }

  function printResult() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
        <div className="max-w-4xl mx-auto py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Gifted Open Mind Assessment
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover your unique cognitive patterns and intellectual flexibility through real-world scenarios.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <Zap className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Quick Insights</h3>
                <p className="text-sm text-gray-600">8 scenarios, 5 minutes to complete</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Deep Analysis</h3>
                <p className="text-sm text-gray-600">Multi-dimensional cognitive profiling</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Growth Mapping</h3>
                <p className="text-sm text-gray-600">Personalized development insights</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">What You'll Discover:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <Sparkles className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Your clarity under pressure and decision-making patterns</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How you balance perception and authentic expression</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Your cognitive consistency across different contexts</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Areas for intellectual growth and development</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setCurrentStep('assessment')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Begin Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'assessment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Gifted Open Mind Assessment</h2>
                <span className="text-sm font-medium text-gray-500">{progress}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-6">
              {QUESTIONS.map((q, idx) => {
                const selected = answers[q.id];
                return (
                  <div key={q.id} className="bg-gray-50 rounded-xl p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {idx + 1}. {q.prompt}
                      </h3>
                      {q.helper && (
                        <p className="text-sm text-gray-600 italic">{q.helper}</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      {q.options.map(opt => {
                        const isSelected = selected === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => selectOption(q.id, opt.id)}
                            className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                              isSelected
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-[1.02]'
                                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  canSubmit
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                View Results
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && savedResult) {
    return (
      <ResultsView 
        result={savedResult} 
        onRetake={reset} 
        onShare={shareResult} 
        onPrint={printResult}
        showCopied={copiedToken}
      />
    );
  }

  return null;
}

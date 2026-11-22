import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Volume2, VolumeX, Send, RefreshCw, CheckCircle2,
  AlertCircle, Sparkles, ArrowRight, Play, Square, Award, MessageSquare,
  HelpCircle, ChevronRight, User, Bot
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  requestMicrophonePermission,
  VoiceRecognitionController,
  speakQuestion,
  cancelSpeech,
} from '../../utils/speechRecognition';
import { executePhase13AiAction, saveJourney } from '../../lib/careerJourneyService';

export default function Step4InterviewPreparation({ journey, onUpdateJourney, onNextStep }) {
  const { resumeData } = useResume();
  const targetRole = journey?.targetRole || 'Senior Frontend Engineer';

  const [mode, setMode] = useState('text'); // 'text' | 'voice'
  const [category, setCategory] = useState('mixed');
  const [sessionActive, setSessionActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [turnIndex, setTurnIndex] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [userAnswerText, setUserAnswerText] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [evaluation, setEvaluation] = useState(null);

  // Voice state
  const [micPermission, setMicPermission] = useState('prompt'); // 'prompt' | 'granted' | 'denied'
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakingAi, setIsSpeakingAi] = useState(false);
  const voiceControllerRef = useRef(null);

  useEffect(() => {
    voiceControllerRef.current = new VoiceRecognitionController();
    return () => {
      cancelSpeech();
      if (voiceControllerRef.current) {
        voiceControllerRef.current.stop();
      }
    };
  }, []);

  const handleStartSession = async (chosenMode) => {
    setMode(chosenMode);
    setTranscript([]);
    setEvaluation(null);
    setTurnIndex(0);
    setSessionActive(true);

    if (chosenMode === 'voice') {
      const perm = await requestMicrophonePermission();
      if (!perm.granted) {
        setMicPermission('denied');
        alert('Microphone permission was denied. Defaulting to Text interview mode.');
        setMode('text');
      } else {
        setMicPermission('granted');
      }
    }

    loadNextQuestion(0, []);
  };

  const loadNextQuestion = async (idx, currentTranscript) => {
    setLoading(true);
    try {
      const q = await executePhase13AiAction('interview-turn', {
        targetRole,
        category,
        turnIndex: idx,
        transcript: currentTranscript,
      });

      setCurrentTurn(q);
      setUserAnswerText('');

      // If voice mode, speak the question out loud
      if (mode === 'voice' && isSpeechSynthesisSupported()) {
        setIsSpeakingAi(true);
        speakQuestion(q.question, {
          onEnd: () => setIsSpeakingAi(false),
        });
      }
    } catch (err) {
      console.warn('Error fetching question:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      voiceControllerRef.current.stop();
      setIsRecording(false);
    } else {
      cancelSpeech();
      setIsSpeakingAi(false);
      const started = voiceControllerRef.current.start({
        onInterim: (interim) => {
          // Can display live interim
        },
        onFinal: (finalText) => {
          setUserAnswerText((prev) => (prev ? `${prev} ${finalText}` : finalText));
        },
        onError: (err) => {
          console.warn('Speech error:', err);
          setIsRecording(false);
        },
        onEnd: () => {
          setIsRecording(false);
        },
      });
      if (started) setIsRecording(true);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswerText.trim() || !currentTurn) return;

    cancelSpeech();
    if (isRecording) {
      voiceControllerRef.current.stop();
      setIsRecording(false);
    }

    const completedTurn = {
      ...currentTurn,
      userAnswer: userAnswerText.trim(),
      spokenByUser: mode === 'voice',
    };

    const nextTranscript = [...transcript, completedTurn];
    setTranscript(nextTranscript);

    // End after 3 turns for testable interactive simulation
    if (turnIndex >= 2) {
      completeInterview(nextTranscript);
    } else {
      const nextIdx = turnIndex + 1;
      setTurnIndex(nextIdx);
      loadNextQuestion(nextIdx, nextTranscript);
    }
  };

  const completeInterview = async (finalTranscript) => {
    setLoading(true);
    try {
      const evalReport = await executePhase13AiAction('interview-evaluate', {
        targetRole,
        transcript: finalTranscript,
      });

      setEvaluation(evalReport);
      setSessionActive(false);

      // Save journey progress
      const completed = Array.from(new Set([...(journey?.completedSteps || []), 4]));
      const updatedJourney = {
        ...journey,
        currentStep: 5,
        completedSteps: completed,
      };

      await saveJourney(updatedJourney);
      onUpdateJourney(updatedJourney);
    } catch (err) {
      console.warn('Evaluation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#6335F5] text-white flex items-center justify-center text-xs font-black">
            4
          </span>
          <h2 className="text-xl font-black text-[#111827]">
            Multi-Modal Mock Interview Simulator (Voice + Text)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Interactive simulation tailored to <strong className="text-[#6335F5]">{targetRole}</strong>. Practice with speech-to-text voice recognition or typed responses.
        </p>
      </div>

      {/* Configuration & Launcher (When session is idle) */}
      {!sessionActive && !evaluation && (
        <div className="p-8 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-6 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-purple-100 text-[#6335F5] flex items-center justify-center mx-auto shadow-sm">
            <Mic className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-[#111827]">
              Start Mock Interview Simulation
            </h3>
            <p className="text-xs text-gray-500">
              Select your preferred interview style and medium.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {['mixed', 'technical', 'behavioral_star', 'hr'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                  category === cat ? 'bg-[#6335F5] text-white shadow-sm' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => handleStartSession('voice')}
              className="p-5 rounded-2xl bg-gradient-to-r from-[#6335F5] to-[#7C3AED] text-white font-bold text-sm shadow-md shadow-purple-500/25 flex flex-col items-center justify-center gap-2 hover:scale-102 transition-all"
            >
              <Mic className="w-6 h-6 text-white" />
              <span>Voice Interview Mode</span>
              <span className="text-[11px] font-normal text-purple-200">
                Spoken Questions + Speech Recognition
              </span>
            </button>

            <button
              onClick={() => handleStartSession('text')}
              className="p-5 rounded-2xl bg-white border-2 border-purple-200 text-[#6335F5] font-bold text-sm hover:bg-purple-50 flex flex-col items-center justify-center gap-2 hover:scale-102 transition-all"
            >
              <Send className="w-6 h-6 text-[#6335F5]" />
              <span>Text-Based Interview Mode</span>
              <span className="text-[11px] font-normal text-gray-500">
                Typed Answers + Instant Analysis
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Active Turn-by-Turn Simulation */}
      {sessionActive && currentTurn && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-6 animate-fade-in max-w-3xl mx-auto">
          {/* Header indicator */}
          <div className="flex items-center justify-between border-b border-purple-50 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-purple-100 text-[#6335F5]">
                Question #{turnIndex + 1} of 3
              </span>
              <span className="text-xs font-bold text-gray-500 capitalize">
                {currentTurn.category} Category
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className={`w-2.5 h-2.5 rounded-full ${mode === 'voice' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="capitalize">{mode} Mode</span>
            </div>
          </div>

          {/* AI Question Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-purple-50 border border-purple-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6335F5] uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                Interviewer Question
              </span>
              {isSpeakingAi && (
                <span className="text-[10px] font-bold text-purple-600 flex items-center gap-1 animate-pulse">
                  <Volume2 className="w-3.5 h-3.5" />
                  Speaking...
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#111827] leading-snug">
              "{currentTurn.question}"
            </h3>
            <p className="text-xs text-gray-500 italic">
              <strong>STAR Guidance:</strong> {currentTurn.suggestedAnswerStructure}
            </p>
          </div>

          {/* Candidate Answer Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#6335F5]" />
                Your Response
              </label>

              {mode === 'voice' && (
                <button
                  type="button"
                  onClick={handleToggleVoiceRecording}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                      : 'bg-purple-100 text-[#6335F5] hover:bg-purple-200'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isRecording ? 'Listening (Click to Stop)' : 'Click to Speak'}</span>
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={userAnswerText}
              onChange={(e) => setUserAnswerText(e.target.value)}
              placeholder={
                mode === 'voice'
                  ? 'Click the microphone above to speak, or type directly here...'
                  : 'Type your structured response using the STAR method...'
              }
              className="w-full p-4 rounded-2xl border border-purple-100 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setSessionActive(false)}
                className="text-xs text-gray-400 hover:text-gray-600 font-semibold"
              >
                Exit Session
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={loading || !userAnswerText.trim()}
                className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{turnIndex >= 2 ? 'Submit & Finalize Evaluation' : 'Submit & Next Question'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Evaluation Report Card */}
      {evaluation && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-6 animate-fade-in max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-[#6335F5] font-black text-xl flex items-center justify-center shrink-0">
                {evaluation.overallScore}%
              </div>
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Interview Evaluation Complete
                </span>
                <h3 className="text-base font-extrabold text-[#111827] mt-1">
                  Overall Performance Rating
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                if (onNextStep) onNextStep(5);
              }}
              className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 hover:scale-102"
            >
              <span>Proceed to Skill Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scores breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Relevance</span>
              <p className="text-lg font-black text-[#6335F5]">{evaluation.relevanceRating} / 10</p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Technical</span>
              <p className="text-lg font-black text-[#6335F5]">{evaluation.technicalAccuracy} / 10</p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Clarity</span>
              <p className="text-lg font-black text-[#6335F5]">{evaluation.communicationClarity} / 10</p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Problem Solving</span>
              <p className="text-lg font-black text-[#6335F5]">{evaluation.problemSolvingStructure} / 10</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 text-xs sm:text-sm text-gray-700 leading-relaxed">
            {evaluation.summaryReport}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1.5">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Demonstrated Strengths</h4>
              <ul className="space-y-1">
                {evaluation.strengths?.map((str, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1.5">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Targeted Practice Areas</h4>
              <ul className="space-y-1">
                {evaluation.weaknesses?.map((wk, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">⚠</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


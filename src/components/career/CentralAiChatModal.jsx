import React, { useState } from 'react';
import {
  MessageSquare, X, Send, Bot, User, Sparkles, RefreshCw, Zap
} from 'lucide-react';
import { executePhase13AiAction } from '../../lib/careerJourneyService';

const SUGGESTED_PROMPTS = [
  'How can I improve my resume for my target role?',
  'What are the highest-impact skills I should learn next?',
  'Give me 3 STAR behavioral interview tips for technical roles.',
  'How do I explain a gap or transition in my career?',
];

export default function CentralAiChatModal({ isOpen, onClose, contextData = {} }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your central ResumeXpert AI Career Assistant. I have context on your target role (${contextData.targetRole || 'Software Professional'}). How can I assist your career journey today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Formulate a targeted response
      const reply = await executePhase13AiAction('interview-turn', {
        targetRole: contextData.targetRole || 'Software Engineer',
        category: 'mixed',
        turnIndex: messages.length,
        transcript: [{ question: query, userAnswer: '' }],
      });

      const aiText = reply.suggestedAnswerStructure
        ? `Here is my recommendation: ${reply.whyAsked}\n\nKey Strategy:\n${reply.suggestedAnswerStructure}`
        : `Based on your career profile, I recommend prioritizing your hands-on project metrics and aligning your bullet points with the target job keywords.`;

      setMessages((prev) => [...prev, { sender: 'ai', text: aiText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Focus on highlighting measurable business outcomes (XYZ formula) in your work experience, practicing STAR responses, and demonstrating practical projects.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full h-[600px] shadow-2xl border border-purple-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-50 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6335F5] text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#111827]">Central AI Career Assistant</h3>
              <p className="text-[11px] text-gray-500">
                Targeting: <span className="text-[#6335F5] font-semibold">{contextData.targetRole || 'General Career'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user' ? 'bg-[#6335F5] text-white' : 'bg-purple-100 text-[#6335F5]'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[80%] whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-[#6335F5] text-white rounded-tr-xs'
                    : 'bg-purple-50/70 border border-purple-100 text-gray-800 rounded-tl-xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#6335F5]" />
              <span>AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts Pills */}
        <div className="p-3 bg-purple-50/50 border-t border-purple-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 whitespace-nowrap shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 border-t border-purple-50 flex items-center gap-2 bg-white"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your resume, interviews, or career..."
            className="flex-1 p-3 rounded-2xl border border-purple-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 rounded-2xl bg-[#6335F5] text-white hover:bg-purple-700 disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}


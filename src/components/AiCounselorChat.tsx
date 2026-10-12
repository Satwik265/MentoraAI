import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Volume2, Bot, User, HelpCircle, Loader2 } from 'lucide-react';
import { sendChatMessage, synthesizeSpeech } from '../services/api.ts';
import { SupportedLanguage } from '../translations.ts';

interface AiCounselorChatProps {
  currentLang: SupportedLanguage;
  studentProfile: any;
  initialPrompt?: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export const AiCounselorChat: React.FC<AiCounselorChatProps> = ({
  currentLang,
  studentProfile,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello ${studentProfile?.name || 'there'}! I am **MentoraAI**, your 24/7 AI Career & Education Advisor.

I am built for **Smart India Hackathon 2025** to help every student in India choose the right stream, discover low-cost government institutions, access PMSSS scholarships, and prevent dropping out.

How can I help you today? You can ask me anything about stream selection after 10th, college cutoffs, or career alternatives!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const botReply = await sendChatMessage(textToSend, history, studentProfile);

      const botMsg: Message = {
        id: 'bot-' + Date.now(),
        role: 'model',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg: Message = {
        id: 'err-' + Date.now(),
        role: 'model',
        content: 'I apologize, but I encountered a momentary connection hiccup. Please try asking again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSpeak = async (msgId: string, text: string) => {
    if (playingMessageId === msgId) {
      window.speechSynthesis?.cancel();
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(msgId);

    try {
      const res = await synthesizeSpeech(text.replace(/[#*`_]/g, ''));
      if (res.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${res.audioBase64}`);
        audio.onended = () => setPlayingMessageId(null);
        audio.onerror = () => playWebSpeech(text, msgId);
        await audio.play();
        return;
      }
    } catch {
      // Fallback
    }

    playWebSpeech(text, msgId);
  };

  const playWebSpeech = (text: string, msgId: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_]/g, ''));
      utterance.rate = 1.0;
      utterance.onend = () => setPlayingMessageId(null);
      utterance.onerror = () => setPlayingMessageId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingMessageId(null);
    }
  };

  const QUICK_QUESTIONS = [
    'Should I choose PCM or PCB after 10th if I love technology and biology?',
    'What are the best government polytechnic colleges in J&K with high placement?',
    'How do I apply for the PMSSS scholarship to get full fee waiver + ₹1L allowance?',
    'I scored 68% in 12th. What government degree courses give high job opportunities?',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="theme-card rounded-3xl p-6 border theme-border-subtle shadow-xs mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl theme-btn-primary flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-heading">
                  MentoraAI Career Guidance Hub
                </h3>
                <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Gemini Flash Active
                </span>
              </div>
              <p className="text-xs theme-text-muted mt-0.5">
                Specialized in NEP 2020 curriculum, Indian government colleges, and dropout prevention
              </p>
            </div>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="mt-4 pt-4 border-t theme-border-subtle">
          <div className="text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 theme-text-accent">
            <HelpCircle className="w-3.5 h-3.5" />
            Common Student Guidance Topics:
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="text-xs theme-card-subtle hover:border-[var(--accent-primary)] border theme-border-subtle px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="theme-card rounded-3xl border theme-border-subtle shadow-xs overflow-hidden flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'theme-btn-primary shadow-2xs'
                    : 'theme-badge-accent'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-[var(--accent-primary)]" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'theme-btn-primary rounded-tr-none shadow-xs font-medium'
                    : 'theme-card-subtle border theme-border-subtle rounded-tl-none shadow-2xs'
                }`}
              >
                {/* Speech Button for AI messages */}
                {msg.role === 'model' && (
                  <div className="flex justify-end mb-1">
                    <button
                      onClick={() => handleSpeak(msg.id, msg.content)}
                      className={`p-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        playingMessageId === msg.id
                          ? 'text-rose-500 bg-rose-500/10'
                          : 'theme-text-muted hover:theme-text-accent'
                      }`}
                      title="Read aloud for visually impaired learners"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">
                        {playingMessageId === msg.id ? 'Speaking...' : 'Listen'}
                      </span>
                    </button>
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                <div
                  className={`text-[10px] mt-2 ${
                    msg.role === 'user' ? 'opacity-70 text-right' : 'theme-text-muted'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-xs theme-text-muted italic py-2">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-primary)]" />
              <span>MentoraAI is formulating personalized educational guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 theme-card-subtle border-t theme-border-subtle">
          <form
            onSubmit={e => {
              e.preventDefault();
              sendMessage(inputMessage);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about courses, cutoffs, polytechnic vs B.Tech, or scholarships..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              disabled={isSending}
              className="flex-1 theme-input rounded-2xl px-4 py-3 text-xs sm:text-sm placeholder:opacity-50 focus:outline-hidden shadow-2xs"
            />
            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              className={`p-3 rounded-2xl font-bold transition-all cursor-pointer ${
                inputMessage.trim() && !isSending
                  ? 'theme-btn-primary shadow-xs'
                  : 'opacity-40 theme-card-subtle cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult } from '@/lib/data-utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DataChatProps {
  data: AnalysisResult;
}

interface Message {
  role: 'bot' | 'user';
  text: string;
}

export const DataChat: React.FC<DataChatProps> = ({ data }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: `Brain online. I've indexed your ${data.summary.totalRows} records. Ask me anything about trends, anomalies, or correlations.` }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    // Simulated AI response
    setTimeout(() => {
      let response = "";
      const lowerMsg = userMsg.toLowerCase();

      if (lowerMsg.includes('max') || lowerMsg.includes('highest')) {
        const numCol = Object.keys(data.summary.columnStats).find(h => data.summary.columnStats[h].type === 'numeric');
        if (numCol) {
          response = `The highest recorded value in ${numCol} is ${data.summary.columnStats[numCol].max.toLocaleString()}.`;
        } else {
          response = "I don't see any numeric columns to calculate a maximum value.";
        }
      } else if (lowerMsg.includes('average') || lowerMsg.includes('mean')) {
        const numCol = Object.keys(data.summary.columnStats).find(h => data.summary.columnStats[h].type === 'numeric');
        if (numCol) {
          response = `The average value across the ${numCol} dimension is approximately ${Math.round(data.summary.columnStats[numCol].avg).toLocaleString()}.`;
        }
      } else if (lowerMsg.includes('anomaly') || lowerMsg.includes('outlier')) {
        const anomalies = data.insights.filter(i => i.type === 'anomaly');
        response = anomalies.length > 0 
          ? `I detected ${anomalies.length} significant statistical deviations. The most prominent is: ${anomalies[0].title}.`
          : "Initial scans show a highly uniform dataset with no significant anomalies detected.";
      } else {
        response = "I've analyzed the neural patterns of your data. It seems there's a strong correlation in your top dimensions. Would you like me to generate a specialized view for this?";
      }

      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] border border-zinc-800 rounded-3xl bg-zinc-900/40 backdrop-blur-xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Neural Assistant</h4>
            <p className="text-[10px] text-emerald-500 flex items-center gap-1 uppercase tracking-tighter">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Data Sync
            </p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
      </div>

      <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${
                msg.role === 'user' 
                ? 'bg-purple-600 text-white rounded-tr-none' 
                : 'bg-zinc-800/80 text-zinc-100 border border-zinc-700 rounded-tl-none'
              }`}>
                {msg.role === 'bot' && <Bot className="w-5 h-5 flex-shrink-0 text-purple-400" />}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                {msg.role === 'user' && <User className="w-5 h-5 flex-shrink-0 text-purple-200" />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-zinc-900/60 border-t border-zinc-800">
        <div className="relative">
          <Input
            placeholder="Ask the Brain..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="bg-zinc-800/50 border-zinc-700 text-white rounded-full pl-6 pr-14 py-6"
          />
          <Button
            size="icon"
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

'use client'
import { useState, useEffect } from 'react';
import Header from '@/components/Header';

interface Message {
  role: 'student' | 'tutor';
  content: string;
}

const AITutor = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [studentLevel, setStudentLevel] = useState<string>('');

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'tutor',
        content: "👋 Hi! I'm PyBuddy! Let's learn Python!\nFirst, tell me:\n1. How old are you?\n2. What do you want to learn today? 🐍"
      }]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'student', content: input }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages,
          studentLevel
        })
      });

      const { response: tutorResponse, exercise } = await response.json();
      
      setMessages(prev => [
        ...prev,
        { role: 'tutor', content: tutorResponse }
      ]);

      if (exercise) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            { role: 'tutor', content: `📝 Let's practice!\n${exercise}` }
          ]);
        }, 2000);
      }

      if (!studentLevel && messages.length === 1) {
        const age = parseInt(input);
        if (!isNaN(age)) {
          setStudentLevel(age < 12 ? 'junior' : 'senior');
        }
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4 space-y-7">
      <Header />
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4 mb-8">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'tutor' ? 'justify-start' : 'justify-end'}`}>
              <div 
                className={`p-4 rounded-lg ${
                  msg.role === 'tutor' 
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-gray-100 ml-auto w-4/5'
                }`}
              >
                {msg.content.split('\n').map((line, j) => (
                  <p key={j} className="mb-2">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className='sticky bottom-0 bg-gray-900 p-4'>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              className="flex h-9 w-full text-white rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? 'Learning...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AITutor;

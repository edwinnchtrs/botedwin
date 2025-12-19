import { useState, useRef, useEffect } from 'react';
import ChatContainer from './components/ChatContainer';
import ChatHeader from './components/ChatHeader';
import ChatBubble from './components/ChatBubble';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import ThemeSwitcher from './components/ThemeSwitcher';
import type { Theme } from './components/ThemeSwitcher';
import PersonaSelector from './components/PersonaSelector';
import type { Persona } from './components/PersonaSelector';
import Sidebar from './components/Sidebar';
import GameModal from './components/games/GameModal';
import TicTacToe from './components/games/TicTacToe';
import RockPaperScissors from './components/games/RockPaperScissors';
import HorrorNovel from './components/games/HorrorNovel';
import InsomniaGame from './components/games/InsomniaGame';
import type { Message, ChatSession } from './types';
import botAvatar from './assets/avatar.png';
import { sendMessageToBot } from './services/customApi';
import { fetchMusicData } from './services/downloader';
import { generateImage } from './services/imageGenerator';

function App() {
  // Chat History Management
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('chat_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return localStorage.getItem('current_session_id') || `session-${Date.now()}`;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    // If sessions exist, find current session's messages
    const savedSessions = localStorage.getItem('chat_sessions');
    const savedCurrentId = localStorage.getItem('current_session_id');

    if (savedSessions && savedCurrentId) {
      const parsedSessions: ChatSession[] = JSON.parse(savedSessions);
      const session = parsedSessions.find(s => s.id === savedCurrentId);
      if (session) return session.messages;
    }

    // Fallback: Check for old single-session messages
    const oldMessages = localStorage.getItem('chat_messages');
    if (oldMessages) return JSON.parse(oldMessages);

    // Default init
    return [{
      id: 1,
      sender: 'bot',
      text: "Hello! I'm Edwin_Chtr's, your advanced AI assistant. How can I allow you to transcend reality today? ✨",
      timestamp: Date.now(),
    }];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');
  const [currentPersona, setCurrentPersona] = useState<Persona>('default');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Save sessions and current session ID
  useEffect(() => {
    localStorage.setItem('chat_sessions', JSON.stringify(sessions));
    localStorage.setItem('current_session_id', currentSessionId);
  }, [sessions, currentSessionId]);

  // Sync current messages to sessions state
  useEffect(() => {
    setSessions(prev => {
      const existingIndex = prev.findIndex(s => s.id === currentSessionId);

      const firstUserMessage = messages.find(m => m.sender === 'user');
      const title = firstUserMessage ? firstUserMessage.text.slice(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '') : 'New Chat';

      if (existingIndex >= 0) {
        const newSessions = [...prev];
        newSessions[existingIndex] = {
          ...newSessions[existingIndex],
          messages,
          title: existingIndex === 0 && prev[existingIndex].title === 'New Chat' ? title : prev[existingIndex].title // Update title if it was default
        };
        // Update title if it's "New Chat" and we have a user message
        if (newSessions[existingIndex].title === 'New Chat' && firstUserMessage) {
          newSessions[existingIndex].title = title;
        }
        return newSessions;
      } else {
        // Create new session if not exists
        return [{
          id: currentSessionId,
          title,
          messages,
          timestamp: Date.now()
        }, ...prev];
      }
    });
  }, [messages, currentSessionId]);

  const handleNewChat = () => {
    const newId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const initialMessage: Message = {
      id: Date.now(),
      sender: 'bot',
      text: "Hello! I'm Edwin_Chtr's, your advanced AI assistant. How can I allow you to transcend reality today? ✨",
      timestamp: Date.now(),
    };

    // Save current session state before switching
    setSessions(prev => {
      const updatedSessions = [...prev];
      const currentIndex = updatedSessions.findIndex(s => s.id === currentSessionId);
      if (currentIndex !== -1) {
        updatedSessions[currentIndex] = { ...updatedSessions[currentIndex], messages };
      }

      return [{
        id: newId,
        title: 'New Chat',
        messages: [initialMessage],
        timestamp: Date.now()
      }, ...updatedSessions];
    });

    setCurrentSessionId(newId);
    setMessages([initialMessage]);
    setIsSidebarOpen(false);
  };

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      setIsSidebarOpen(false);
    }
  };

  const handlePinSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => {
      const updated = prev.map(s => s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s);
      return updated.sort((a, b) => {
        if (a.isPinned === b.isPinned) return b.timestamp - a.timestamp;
        return a.isPinned ? -1 : 1;
      });
    });
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);

      // If we deleted the current session
      if (sessionId === currentSessionId) {
        if (filtered.length > 0) {
          // Switch to first available
          setCurrentSessionId(filtered[0].id);
          setMessages(filtered[0].messages);
        } else {
          // Return to clean slate
          const newId = `session-${Date.now()}`;
          const initialMessage: Message = {
            id: Date.now(),
            sender: 'bot',
            text: "Hello! I'm Edwin_Chtr's, your advanced AI assistant. How can I allow you to transcend reality today? ✨",
            timestamp: Date.now(),
          };
          setCurrentSessionId(newId);
          setMessages([initialMessage]);
          // Need to update state immediately or next render will handle empty logic?
          // The setSessions call above will update state. But we are inside the callback.
          // It's safer to return the empty session if filtered is empty.
          return [{
            id: newId,
            title: 'New Chat',
            messages: [initialMessage],
            timestamp: Date.now()
          }];
        }
      }

      return filtered;
    });
  };

  useEffect(() => {
    // Remove all previous theme classes
    document.body.classList.remove('theme-cyberpunk', 'theme-pastel', 'theme-matrix');

    // Add new theme class if not default
    if (currentTheme !== 'default') {
      document.body.classList.add(`theme-${currentTheme}`);
    }
  }, [currentTheme]);

  const handleSendMessage = async (text: string) => {
    const newUserMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);

    try {
      // Check for Music Link (YouTube or Spotify)
      const musicRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|open\.spotify\.com\/track\/)([\w-]+)/;
      const musicMatch = text.match(musicRegex);

      if (musicMatch) {
        const musicData = await fetchMusicData(text);
        if (musicData) {
          const botMessage: Message = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `Ditemukan lagu: **${musicData.title}**`,
            timestamp: Date.now(),
            musicData: musicData
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
          return;
        }
      }

      // Check for Image Generation Command
      const imageRegex = /^(?:\/image|buatkan gambar)\s+(.+)$/i;
      const imageMatch = text.match(imageRegex);

      if (imageMatch) {
        const prompt = imageMatch[1];
        const imageUrl = generateImage(prompt);

        const botMessage: Message = {
          id: Date.now() + 1,
          sender: 'bot',
          text: `Berikut adalah gambar untuk: **${prompt}**`,
          timestamp: Date.now(),
          imageUrl: imageUrl
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        return;
      }

      const systemPrompts: Record<Persona, string> = {
        default: "Kamu adalah AI bernama Edwin_Chtr's, asisten virtual yang cerdas, ramah, dan bergaya futuristik. Kamu suka menggunakan emoji ✨🌌. Kamu selalu membantu pengguna dengan sopan namun santai.",
        coding_expert: "Kamu adalah Expert Developer. Jawabanmu harus teknis, padat, dan fokus pada solusi kode. Gunakan markdown untuk kode. Hindari basa-basi berlebihan.",
        teacher: "Kamu adalah guru yang sabar. Jelaskan konsep dengan analogi sederhana, langkah demi langkah. Anggap pengguna adalah pemula yang ingin belajar.",
        best_friend: "Woy! Kamu adalah sahabat pengguna. Pake bahasa gaul, santai abis, lelucon, dan banyak emoji 😎🔥. Jangan kaku!",
      };

      const responseText = await sendMessageToBot(text, systemPrompts[currentPersona]);

      const newBotMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "Maaf, aku sedang tidak bisa terhubung. Coba lagi nanti ya! 😓",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-transparent relative">
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <PersonaSelector currentPersona={currentPersona} onPersonaChange={setCurrentPersona} />
        <ThemeSwitcher currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenGame={(gameId) => {
          setActiveGame(gameId);
          setIsSidebarOpen(false);
        }}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onPinSession={handlePinSession}
        onDeleteSession={handleDeleteSession}
      />

      <GameModal
        isOpen={!!activeGame}
        onClose={() => setActiveGame(null)}
        title={
          activeGame === 'tictactoe' ? 'Tic-Tac-Toe' :
            activeGame === 'rps' ? 'Rock Paper Scissors' :
              activeGame === 'minibattles' ? '12 MiniBattles' :
                'The Basement (Psychopath Story)'
        }
      >
        {activeGame === 'tictactoe' && <TicTacToe />}
        {activeGame === 'rps' && <RockPaperScissors />}
        {activeGame === 'minibattles' && (
          <div className="w-full h-full min-h-[85vh] flex items-center justify-center bg-black/50 rounded-xl overflow-hidden">
            <iframe
              src="https://www.crazygames.com/embed/12-minibattles"
              title="12 MiniBattles"
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {activeGame === 'novel_horror' && <HorrorNovel />}
        {activeGame === 'insomnia' && <InsomniaGame />}
      </GameModal>

      <ChatContainer>
        <ChatHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex flex-row items-center max-w-[80%]">
                <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-primary/50 bg-dark-lighter mr-3 flex items-center justify-center overflow-hidden">
                  <img src={botAvatar} alt="Bot Typing" className="w-full h-full object-cover" />
                </div>
                <div className="px-5 py-3 rounded-2xl rounded-tl-none bg-dark-lighter/80 border border-white/5">
                  <TypingIndicator />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSendMessage={handleSendMessage} isLoading={isTyping} />
      </ChatContainer>
    </div >
  );
}

export default App;

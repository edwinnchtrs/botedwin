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
import type { Message } from './types';
import botAvatar from './assets/avatar.png';
import { sendMessageToBot } from './services/customApi';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I'm Edwin_Chtr's, your advanced AI assistant. How can I allow you to transcend reality today? ✨",
    },
  ]);
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
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);

    try {
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
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "Maaf, aku sedang tidak bisa terhubung. Coba lagi nanti ya! 😓",
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

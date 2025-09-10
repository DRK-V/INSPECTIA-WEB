import React from 'react';
import { MessageCircle, Bot, User, Activity, CheckCircle, X, Send, Sparkles, Zap } from 'lucide-react';

// Constantes compartidas
export const CHATBOT_CONSTANTS = {
  COLORS: {
    // Gradientes para el chatbot de proyectos
    PROJECT: {
      PRIMARY: 'from-purple-600 to-indigo-600',
      PRIMARY_HOVER: 'from-purple-700 to-indigo-700',
      LIGHT: 'from-purple-50 to-indigo-50',
      ACCENT: 'purple-600'
    },
    // Gradientes para el chatbot de Gemini
    GEMINI: {
      PRIMARY: 'from-emerald-500 to-teal-600',
      PRIMARY_HOVER: 'from-emerald-600 to-teal-700',
      LIGHT: 'from-emerald-50 to-teal-50',
      ACCENT: 'emerald-600'
    }
  },
  ANIMATIONS: {
    FADE_DELAY: 100, // milisegundos
    TYPING_DELAY: 500,
    MESSAGE_DELAY: 800
  }
};

// Componente de avatar mejorado
export const ChatAvatar = ({ type = 'bot', size = 'md', online = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  };

  if (type === 'user') {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0`}>
        <User className={`${iconSizes[size]} text-white`} />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0`}>
        <Bot className={`${iconSizes[size]} text-white`} />
      </div>
      {online && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

// Componente de indicador de typing mejorado
export const TypingIndicator = ({ type = 'project' }) => {
  const colors = type === 'project' ? 
    'from-purple-500 to-indigo-500' : 
    'from-emerald-500 to-teal-600';

  const dotColor = type === 'project' ? 'bg-purple-500' : 'bg-emerald-500';

  return (
    <div className="flex items-end gap-2 animate-fade-in">
      <div className={`w-8 h-8 bg-gradient-to-r ${colors} rounded-full flex items-center justify-center flex-shrink-0 mb-1`}>
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className={`w-2 h-2 ${dotColor} rounded-full animate-bounce`}></div>
            <div className={`w-2 h-2 ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`w-2 h-2 ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">
            {type === 'project' ? 'Procesando...' : 'IA procesando...'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Componente de botón de acción mejorado
export const ActionButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  icon = null,
  type = 'project'
}) => {
  const variants = {
    primary: {
      project: `bg-gradient-to-r ${CHATBOT_CONSTANTS.COLORS.PROJECT.PRIMARY} hover:${CHATBOT_CONSTANTS.COLORS.PROJECT.PRIMARY_HOVER} text-white`,
      gemini: `bg-gradient-to-r ${CHATBOT_CONSTANTS.COLORS.GEMINI.PRIMARY} hover:${CHATBOT_CONSTANTS.COLORS.GEMINI.PRIMARY_HOVER} text-white`
    },
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
    ghost: 'hover:bg-gray-100 text-gray-600'
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const baseClasses = "rounded-full font-medium shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant][type] || variants[variant]} ${sizes[size]}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

// Componente de mensaje mejorado
export const ChatMessage = ({ 
  message, 
  index = 0, 
  type = 'project'
}) => {
  const isUser = message.from === 'user';
  
  return (
    <div
      className={`flex items-end gap-2 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}
      style={{ animationDelay: `${index * CHATBOT_CONSTANTS.ANIMATIONS.FADE_DELAY}ms` }}
    >
      {!isUser && <ChatAvatar type="bot" />}
      
      <div
        className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm ${
          isUser
            ? `bg-gradient-to-r ${type === 'project' ? CHATBOT_CONSTANTS.COLORS.PROJECT.PRIMARY : CHATBOT_CONSTANTS.COLORS.GEMINI.PRIMARY} text-white rounded-br-md`
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
      </div>
      
      {isUser && <ChatAvatar type="user" />}
    </div>
  );
};

// Hook personalizado para manejo de chat
export const useChatScroll = () => {
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  });

  return { messagesEndRef, scrollToBottom };
};

// Utilidad para formatear tiempo
export const formatTime = (date = new Date()) => {
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Utilidad para simular delay de typing
export const simulateTyping = (callback, delay = CHATBOT_CONSTANTS.ANIMATIONS.TYPING_DELAY) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      callback();
      resolve();
    }, delay);
  });
};

// Componente de sugerencias rápidas
export const QuickSuggestions = ({ 
  suggestions = [], 
  onSelect, 
  disabled = false,
  type = 'project'
}) => {
  if (suggestions.length === 0) return null;

  const colorClasses = type === 'project' ? 
    'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200' :
    'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200';

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${colorClasses} disabled:opacity-50`}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

// Estilos CSS globales para animaciones
export const ChatbotStyles = () => (
  <style jsx global>{`
    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes fade-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes gentle-bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-3px);
      }
      60% {
        transform: translateY(-2px);
      }
    }
    
    .animate-slide-up {
      animation: slide-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
      animation-fill-mode: both;
    }
    
    .animate-gentle-bounce {
      animation: gentle-bounce 2s infinite;
    }
    
    /* Scroll personalizado para mensajes */
    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }
    
    .chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .chat-messages::-webkit-scrollbar-thumb {
      background: #e5e7eb;
      border-radius: 3px;
    }
    
    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: #d1d5db;
    }
  `}</style>
);

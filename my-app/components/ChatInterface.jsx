'use client'

import React, { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

export default function ChatInterface() {
  const [chats, setChats] = useState([
    {
      id: 1,
      title: 'New Chat',
      timestamp: 'Just now',
      messages: [],
    },
  ]);

  const [activeChat, setActiveChat] = useState(1);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [currentUserRequest, setCurrentUserRequest] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
    const selectedChat = chats.find(chat => chat.id === chatId);
    setCurrentMessages(selectedChat?.messages || []);
  };

  const handleNewChat = () => {
    const newChatId = Math.max(...chats.map(c => c.id)) + 1;
    const newChat = {
      id: newChatId,
      title: 'New Chat',
      timestamp: 'Just now',
      messages: [],
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChatId);
    setCurrentMessages([]);
  };

  const handleSendMessage = async (content, customMessage = null) => {
    // If customMessage is provided, it's a video message from the renderer
    if (customMessage) {
      const updatedMessages = [...currentMessages, customMessage];
      setCurrentMessages(updatedMessages);
      
      setChats(prev => prev.map(chat => 
        chat.id === activeChat 
          ? { ...chat, messages: updatedMessages }
          : chat
      ));
      return;
    }

    // Store the user request for later use in rendering
    setCurrentUserRequest(content);

    const newMessage = {
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };

    const updatedMessages = [...currentMessages, newMessage];
    setCurrentMessages(updatedMessages);

    // Update chat title if it's the first message
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          title: chat.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : chat.title,
          messages: updatedMessages,
          timestamp: 'Just now',
        };
      }
      return chat;
    });
    setChats(updatedChats);

    // Show typing indicator
    setIsTyping(true);

    // Call the Python backend API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          chatId: activeChat,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Show simple response without code
        const aiContent = `✅ ${data.response}`;
        
        const aiResponse = {
          role: 'assistant',
          content: aiContent,
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }),
        };
        
        const messagesWithResponse = [...updatedMessages, aiResponse];
        setCurrentMessages(messagesWithResponse);
        
        setChats(prev => prev.map(chat => 
          chat.id === activeChat 
            ? { ...chat, messages: messagesWithResponse }
            : chat
        ));

        // Automatically render the video without user interaction
        try {
          const renderResponse = await fetch('/api/render', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: data.code,
              quality: 'l',
              user_request: content,
            }),
          });

          const renderData = await renderResponse.json();
          
          if (renderData.success) {
            // Add video message with explanation
            const videoMessage = {
              role: 'assistant',
              content: `🎬 **Video rendered successfully!**\n\n### 📚 Solution:\n${renderData.explanation || 'No explanation available.'}`,
              video_url: `http://localhost:5000${renderData.video_url}`,
              timestamp: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              }),
            };
            
            const finalMessages = [...messagesWithResponse, videoMessage];
            setCurrentMessages(finalMessages);
            
            setChats(prev => prev.map(chat => 
              chat.id === activeChat 
                ? { ...chat, messages: finalMessages }
                : chat
            ));
          } else {
            // Show render error
            const errorMsg = {
              role: 'assistant',
              content: `⚠️ Video rendering failed: ${renderData.error}`,
              timestamp: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              }),
            };
            
            const finalMessages = [...messagesWithResponse, errorMsg];
            setCurrentMessages(finalMessages);
            
            setChats(prev => prev.map(chat => 
              chat.id === activeChat 
                ? { ...chat, messages: finalMessages }
                : chat
            ));
          }
        } catch (renderError) {
          console.error('Render Error:', renderError);
          const errorMsg = {
            role: 'assistant',
            content: `⚠️ Failed to render video: ${renderError.message}`,
            timestamp: new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            }),
          };
          
          const finalMessages = [...messagesWithResponse, errorMsg];
          setCurrentMessages(finalMessages);
          
          setChats(prev => prev.map(chat => 
            chat.id === activeChat 
              ? { ...chat, messages: finalMessages }
              : chat
          ));
        }
      } else {
        // Error response
        const errorResponse = {
          role: 'assistant',
          content: `⚠️ Error: ${data.response || data.error || 'Failed to generate code'}`,
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }),
        };
        
        const messagesWithResponse = [...updatedMessages, errorResponse];
        setCurrentMessages(messagesWithResponse);
        
        setChats(prev => prev.map(chat => 
          chat.id === activeChat 
            ? { ...chat, messages: messagesWithResponse }
            : chat
        ));
      }
    } catch (error) {
      console.error('API Error:', error);
      setIsTyping(false);
      
      const errorResponse = {
        role: 'assistant',
        content: `⚠️ Connection Error: Could not connect to the Python backend. Make sure the Flask server is running at http://localhost:5000\n\nError: ${error.message}`,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
      };
      
      const messagesWithResponse = [...updatedMessages, errorResponse];
      setCurrentMessages(messagesWithResponse);
      
      setChats(prev => prev.map(chat => 
        chat.id === activeChat 
          ? { ...chat, messages: messagesWithResponse }
          : chat
      ));
    }
  };

  return (
    <div style={styles.container}>
      {/* Cyber Grid Background */}
      <div className="cyber-grid"></div>
      <div className="scan-line"></div>

      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />
      <ChatWindow
        messages={currentMessages}
        onSendMessage={handleSendMessage}
        currentUserRequest={currentUserRequest}
        isTyping={isTyping}
      />

      <style>{`
        /* Cyber Grid Background */
        .cyber-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 0;
          pointer-events: none;
          animation: gridMove 20s linear infinite;
        }
        
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
        
        /* Scan Line Effect */
        .scan-line {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            #00ffff 20%, 
            #00ffff 80%, 
            transparent 100%);
          box-shadow: 0 0 10px #00ffff;
          z-index: 0;
          pointer-events: none;
          animation: scan 4s linear infinite;
        }
        
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        /* Scrollbar Styles */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 20, 40, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: '#000814',
    fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
    position: 'relative',
  },
};

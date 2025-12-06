'use client'

import React, { useState } from 'react';

export default function ChatSidebar({ chats, activeChat, onSelectChat, onNewChat }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{
      ...styles.sidebar,
      width: isCollapsed ? '60px' : '280px',
    }}>
      {/* Header */}
      <div style={styles.sidebarHeader}>
        <button 
          onClick={onNewChat}
          style={styles.newChatButton}
          title="New Chat"
        >
          {isCollapsed ? '+' : '+ New Chat'}
        </button>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={styles.collapseButton}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Chat List */}
      <div style={styles.chatList}>
        {!isCollapsed && chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            style={{
              ...styles.chatItem,
              background: activeChat === chat.id 
                ? '#ececf1' 
                : 'transparent',
              borderLeft: activeChat === chat.id 
                ? '3px solid #10a37f' 
                : '3px solid transparent',
            }}
          >
            <div style={styles.chatIcon}>💬</div>
            <div style={styles.chatInfo}>
              <div style={styles.chatTitle}>{chat.title}</div>
              <div style={styles.chatTimestamp}>{chat.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>👤</div>
            <div style={styles.userName}>User</div>
          </div>
        </div>
      )}

      <style>{`
        .chatItem:hover {
          background: rgba(16, 163, 127, 0.08) !important;
        }
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 163, 127, 0.3) !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  sidebar: {
    height: '100vh',
    background: 'linear-gradient(180deg, #f7f9fc 0%, #ffffff 100%)',
    borderRight: '1px solid #e5e5e5',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    position: 'relative',
    zIndex: 100,
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
  },

  sidebarHeader: {
    padding: '16px 12px',
    borderBottom: '1px solid #e5e5e5',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
  },

  newChatButton: {
    flex: 1,
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #10a37f 0%, #0d8a6a 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(16, 163, 127, 0.2)',
  },

  collapseButton: {
    padding: '10px',
    background: '#fff',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },

  chatList: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0',
  },

  chatItem: {
    padding: '12px',
    margin: '4px 8px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    transition: 'all 0.2s ease',
    position: 'relative',
  },

  chatIcon: {
    fontSize: '1.1rem',
    opacity: 0.6,
  },

  chatInfo: {
    flex: 1,
    overflow: 'hidden',
  },

  chatTitle: {
    color: '#202123',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  chatTimestamp: {
    color: '#9ca3af',
    fontSize: '0.75rem',
  },

  sidebarFooter: {
    padding: '12px',
    borderTop: '1px solid #e5e5e5',
  },

  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
  },

  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10a37f 0%, #0d8a6a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    boxShadow: '0 2px 8px rgba(16, 163, 127, 0.3)',
  },

  userName: {
    color: '#202123',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
};

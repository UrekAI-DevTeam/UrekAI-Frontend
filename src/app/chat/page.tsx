"use client";
import React, { useState, useEffect } from 'react';
import { ChatInterface } from '@/pages/app/ChatInterface';
import GlobalLayout from '@/layouts/GlobalLayout';
import { ChatSidebar } from '@/features/chat/ChatSidebar';
import { Menu, X } from 'lucide-react';

export default function ChatPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [showChatSidebar, setShowChatSidebar] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <GlobalLayout>
      <div className="h-screen flex relative">
        {/* Mobile Chat Sidebar Toggle */}
        {isMobile && (
          <button
            onClick={() => setShowChatSidebar(!showChatSidebar)}
            className="fixed top-4 right-4 z-50 p-2 bg-background-surface border border-border rounded-lg shadow-lg lg:hidden"
          >
            {showChatSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}

        {/* Mobile Chat Sidebar Overlay */}
        {isMobile && showChatSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowChatSidebar(false)}
          />
        )}

        {/* Chat Sidebar */}
        <div className={`${isMobile 
          ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${showChatSidebar ? 'translate-x-0' : '-translate-x-full'}`
          : 'relative'
        }`}>
          <ChatSidebar onClose={() => setShowChatSidebar(false)} />
        </div>

        {/* Main chat area */}
        <div className={`flex-1 min-w-0 ${isMobile ? 'ml-0' : ''}`}>
          <ChatInterface />
        </div>
      </div>
    </GlobalLayout>
  );
}

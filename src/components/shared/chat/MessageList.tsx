"use client";
import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { Message as MessageType } from '../../types';
import { Brain, Upload, FileText } from "lucide-react"

interface MessageListProps {
  messages: MessageType[];
  hasMessages?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, hasMessages = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter out system messages for determining if chat has real content
  const nonSystemMessages = messages.filter(msg => msg.type !== 'system');
  const showWelcomeMessage = !hasMessages && nonSystemMessages.length === 0;

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 space-y-4 scrollbar-none">
    {/* <div className="flex-1 h-full overflow-y-auto p-6 space-y-4
                      scrollbar-thin
                      scrollbar-thumb-gray-400
                      scrollbar-track-transparent
                      hover:scrollbar-thumb-gray-500
                      scrollbar-thumb-rounded-none"> */}
      {showWelcomeMessage ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-text-primary mb-4">Welcome to UrekAI</h3>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Your intelligent business analyst is ready to help you understand your data and uncover insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Upload your data files</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Ask questions about your business</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};
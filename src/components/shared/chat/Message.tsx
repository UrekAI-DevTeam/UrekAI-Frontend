"use client";
import React, { useEffect, useRef, useState } from "react";
import { Brain, User } from 'lucide-react';
import { Message as MessageType } from '@/types';
import { AnalysisResponse } from "./AnalysisResponse";

interface MessageProps {
  message: MessageType;
}

interface TypingMessageProps {
  text: string;
  speed?: number;
  chunkSize?: number;
}

const TypingMessage: React.FC<TypingMessageProps> = ({
  text,
  speed = 30,
  chunkSize = 1,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0); // Where the animation should start

  useEffect(() => {
    // If text was updated, only animate the newly added part
    if (text.length > displayedText.length) {
      indexRef.current = displayedText.length;

      const interval = setInterval(() => {
        const nextChunk = text.slice(indexRef.current, indexRef.current + chunkSize);
        setDisplayedText((prev) => prev + nextChunk);
        indexRef.current += chunkSize;

        if (indexRef.current >= text.length) {
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }
  }, [text, speed, chunkSize, displayedText]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="animate-pulse ml-1">|</span>
      )}
    </span>
  );
};

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';
  const isThinking = message.type === 'thinking';
  
  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className={`border rounded-2xl px-4 py-2 max-w-md ${
          message.isError 
            ? 'bg-red-50 border-red-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <p className={`text-sm text-center ${
            message.isError ? 'text-red-700' : 'text-green-700'
          }`}>
            {typeof message.content === 'string' ? message.content : 'System message'}
          </p>
        </div>
      </div>
    );
  }

  if (isThinking) {
    return (
      <div className="flex justify-start mb-6">
        <div className="flex max-w-3xl">
          {/* Avatar */}
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Message Content */}
          <div className="flex flex-col items-start">
            <div className="rounded-2xl px-4 py-3 max-w-full bg-gray-50 border border-gray-200 text-gray-700">
              <p className="text-sm italic whitespace-pre-wrap">
                {/* {typeof message.content === 'string' ? message.content : 'Thinking...'} */}
                {typeof message.content === 'string' ? (
                  <TypingMessage text={message.content} speed={10} chunkSize={2} />
                ) : (
                  'Thinking...'
                )}
              </p>

              {/* Three Dots Loading */}
              <div className="mt-1">
                <span className="inline-block w-1 h-1 mx-0.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="inline-block w-1 h-1 mx-0.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="inline-block w-1 h-1 mx-0.5 bg-gray-400 rounded-full animate-bounce"></span>
              </div>
            </div>

            {/* Timestamp */}
            <div className="mt-1 text-xs text-text-muted">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Render the content based on its type
  const renderContent = () => {
  if (typeof message.content === 'string') {
    return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
  }

  if (React.isValidElement(message.content) || typeof message.content === 'object') {
    const element = message.content as React.ReactElement<{ data?: unknown }>;
    if (element.props?.data) {
      return <AnalysisResponse data={element.props.data} />;
    }
    return element;
  }

  return <p className="text-sm text-gray-500">Unable to display message content</p>;
};
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted'
          }`}>
            {isUser ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-2xl px-4 py-3 max-w-full ${
            isUser 
              ? 'bg-primary text-white' 
              : 'bg-white border border-border text-text-primary'
          }`}>
            {renderContent()}
          </div>
          <div className="mt-1 text-xs text-text-muted">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
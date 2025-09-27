"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Card, CardContent } from '@/ui/card';
import { chatAPI, dataAPI } from '@/services/api';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Upload, 
  FileText, 
  Image, 
  Database,
  Sparkles,
  User,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { useFilesStore } from '@/state/filesStore';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    name: string;
    type: string;
    size: string;
  }>;
  isTyping?: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export function ChatInterface() {
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');

    // Update message status to sent
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );
    }, 500);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Call the backend API
      const response = await chatAPI.query(currentMessage);
      
      // Hide typing indicator
      setIsTyping(false);

      // Create AI response message
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.message || response.content || "I understand your question. Let me analyze the data and provide you with insights...",
        timestamp: new Date(),
        status: 'read'
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat API error:', error);
      setIsTyping(false);
      
      // Show error message
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        status: 'read'
      };
      
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    
    // Create a loading message
    const loadingMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Uploading ${file.name}...`,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Upload file to backend
      const uploadResult = await dataAPI.uploadFile(file);
      
      if (uploadResult.success) {
        // Update the loading message with success
        setMessages(prev => 
          prev.map(msg => 
            msg.id === loadingMessage.id 
              ? {
                  ...msg,
                  content: `Successfully uploaded: ${file.name}`,
                  status: 'sent' as const,
                  attachments: [
                    {
                      name: file.name,
                      type: file.type.split('/')[1].toUpperCase(),
                      size: (file.size / 1024 / 1024).toFixed(1) + ' MB'
                    }
                  ]
                }
              : msg
          )
        );

        // Add AI response about the uploaded file
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `Great! I've received your file "${file.name}". I can now analyze this data and help you with insights. What would you like to know about this dataset?`,
          timestamp: new Date(),
          status: 'read'
        };

        setMessages(prev => [...prev, aiResponse]);
      } else {
        // Update with error message
        setMessages(prev => 
          prev.map(msg => 
            msg.id === loadingMessage.id 
              ? {
                  ...msg,
                  content: `Failed to upload ${file.name}. Please try again.`,
                  status: 'sent' as const
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('File upload error:', error);
      
      // Update with error message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? {
                ...msg,
                content: `Failed to upload ${file.name}. Please try again.`,
                status: 'sent' as const
              }
            : msg
        )
      );
    }
  };

  const quickPrompts = [
    "Analyze revenue trends",
    "Find data anomalies", 
    "Create visualizations",
    "Compare time periods",
    "Generate insights report"
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isEmpty = messages.length === 0 && !isTyping;
  const [plusOpen, setPlusOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [showPersistentInput, setShowPersistentInput] = useState(false);
  const [plusDropdownUpward, setPlusDropdownUpward] = useState(false);
  const { uploadedFiles, initializeUploadedFiles } = useFilesStore();
  const [sortBy, setSortBy] = useState<'date' | 'az' | 'za'>('date');

  useEffect(() => { initializeUploadedFiles().catch(() => undefined); }, [initializeUploadedFiles]);

  // Show persistent input after first message
  useEffect(() => {
    if (messages.length > 0 && !showPersistentInput) {
      setShowPersistentInput(true);
    }
  }, [messages.length, showPersistentInput]);

  // Check if dropdown should open upward
  const handlePlusClick = () => {
    if (!plusOpen) {
      // Check if there's enough space below for the dropdown
      const button = document.querySelector('[data-plus-button]') as HTMLElement;
      if (button) {
        const rect = button.getBoundingClientRect();
        const dropdownHeight = 80; // Approximate height of dropdown
        const spaceBelow = window.innerHeight - rect.bottom;
        setPlusDropdownUpward(spaceBelow < dropdownHeight);
      }
    }
    setPlusOpen((v) => !v);
  };

  const sortedFiles = [...uploadedFiles].sort((a: any, b: any) => {
    if (sortBy === 'az') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'za') return (b.name || '').localeCompare(a.name || '');
    return new Date(b.createdAt || b.uploadedAt || 0).getTime() - new Date(a.createdAt || a.uploadedAt || 0).getTime();
  });

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto ${showPersistentInput ? 'pb-24 sm:pb-32' : 'pb-32 sm:pb-48'}`}>
        {isEmpty ? (
          <div className="h-full max-w-3xl mx-auto flex items-center justify-center px-4 sm:px-6">
            <div className="w-full text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-text-primary mb-6">Start understanding your stats</h2>
              <div className="w-full max-w-2xl mx-auto bg-background-surface text-text-primary rounded-full border border-border flex items-center px-2 py-1.5 shadow-lg">
                <div className="relative mr-1">
                  <button 
                    data-plus-button
                    onClick={handlePlusClick} 
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-background-surface-secondary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  {plusOpen && (
                    <div className={`absolute left-0 w-56 rounded-xl border border-border bg-background-surface shadow-lg z-10 text-left ${
                      plusDropdownUpward ? 'bottom-full mb-2' : 'top-full mt-2'
                    }`}>
                      <button className="w-full px-3 py-2 text-sm hover:bg-interactive-hover" onClick={() => { setPlusOpen(false); inputRef.current?.focus(); }}>Ask from Shopify stats</button>
                      <button className="w-full px-3 py-2 text-sm hover:bg-interactive-hover" onClick={() => { setPlusOpen(false); setLinkOpen(true); }}>Link Document</button>
                    </div>
                  )}
                </div>
                <input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything"
                  className="flex-1 bg-transparent outline-none text-sm placeholder-text-muted"
                />
                <div className="flex items-center gap-1 ml-2">
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    size="sm"
                    className={`w-9 h-9 rounded-full transition-all duration-200 ${
                      message.trim() 
                        ? 'bg-gradient-to-r from-blood-red to-crimson hover:from-crimson hover:to-blood-red text-text-white' 
                        : 'bg-surface-secondary text-text-muted cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
        <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[70%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-br from-blood-red to-crimson shadow-soft' 
                    : 'bg-surface backdrop-blur-xl border border-border'
                }`}>
                  {msg.type === 'user' ? (
                    <User className="w-4 h-4 text-text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-blood-red" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col group ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`relative px-4 py-3 rounded-2xl backdrop-blur-xl shadow-soft ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-blood-red to-crimson text-text-white rounded-br-md'
                      : 'bg-surface text-text-primary border border-border rounded-bl-md'
                  }`}>
                    {/* Message Content */}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>

                    {/* Attachments */}
                    {msg.attachments && (
                      <div className="mt-3 space-y-2">
                        {msg.attachments.map((attachment, index) => (
                          <div key={index} className={`flex items-center gap-2 p-2 rounded-lg backdrop-blur-sm ${
                            msg.type === 'user' 
                              ? 'bg-surface-secondary' 
                              : 'bg-surface-secondary'
                          }`}>
                            <FileText className={`w-4 h-4 ${msg.type === 'user' ? 'text-text-white/80' : 'text-text-muted'}`} />
                            <span className={`text-xs font-medium ${msg.type === 'user' ? 'text-text-white/90' : 'text-text-secondary'}`}>
                              {attachment.name}
                            </span>
                            <span className={`text-xs ${msg.type === 'user' ? 'text-text-white/70' : 'text-text-muted'}`}>
                              ({attachment.size})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Timestamp and Status */}
                  <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 ${
                    msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <span>{formatTime(msg.timestamp)}</span>
                    {msg.type === 'user' && msg.status && (
                      <div className="flex items-center">
                        {msg.status === 'sending' && (
                          <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse" />
                        )}
                        {msg.status === 'sent' && (
                          <div className="w-2 h-2 bg-text-muted rounded-full" />
                        )}
                        {msg.status === 'delivered' && (
                          <div className="flex">
                            <div className="w-2 h-2 bg-text-muted rounded-full" />
                            <div className="w-2 h-2 bg-text-muted rounded-full -ml-1" />
                          </div>
                        )}
                        {msg.status === 'read' && (
                          <div className="flex">
                            <div className="w-2 h-2 bg-blood-red rounded-full" />
                            <div className="w-2 h-2 bg-blood-red rounded-full -ml-1" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Message Actions (for assistant messages) */}
                    {msg.type === 'assistant' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                        <button
                          className="w-6 h-6 p-0 hover:bg-white/20 dark:hover:bg-white/10 rounded-full flex items-center justify-center transition-colors duration-200"
                          onClick={() => copyToClipboard(msg.content)}
                          title="Copy message"
                        >
                          <Copy className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                          className="w-6 h-6 p-0 hover:bg-white/20 dark:hover:bg-white/10 rounded-full flex items-center justify-center transition-colors duration-200"
                          title="Like message"
                        >
                          <ThumbsUp className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                          className="w-6 h-6 p-0 hover:bg-white/20 dark:hover:bg-white/10 rounded-full flex items-center justify-center transition-colors duration-200"
                          title="Dislike message"
                        >
                          <ThumbsDown className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blood-red dark:text-white" />
                </div>
                <div className="bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-2xl rounded-bl-md px-4 py-3 shadow-soft">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blood-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blood-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blood-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
        )}
      </div>

      {/* Persistent Input Area */}
      {showPersistentInput && (
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent backdrop-blur-md pt-6 sm:pt-8 border-t border-border transition-all duration-500 ease-out ${
          showPersistentInput ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
            {/* Quick Prompts */}
            <div className="mb-3">
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="h-8 px-2 sm:px-3 rounded-full border border-border bg-background-surface text-text-secondary text-xs hover:bg-interactive-hover transition-colors shadow-md"
                    onClick={() => setMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* New Chat Input Design */}
            <div className="w-full max-w-2xl mx-auto bg-background-surface text-text-primary rounded-full border border-border flex items-center px-2 py-1.5 shadow-lg">
              <div className="relative mr-1">
                <button 
                  data-plus-button
                  onClick={handlePlusClick} 
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-background-surface-secondary"
                >
                  <Plus className="w-4 h-4" />
                </button>
                {plusOpen && (
                  <div className={`absolute left-0 w-56 rounded-xl border border-border bg-background-surface shadow-lg z-10 text-left ${
                    plusDropdownUpward ? 'bottom-full mb-2' : 'top-full mt-2'
                  }`}>
                    <button className="w-full px-3 py-2 text-sm hover:bg-interactive-hover" onClick={() => { setPlusOpen(false); inputRef.current?.focus(); }}>Ask from Shopify stats</button>
                    <button className="w-full px-3 py-2 text-sm hover:bg-interactive-hover" onClick={() => { setPlusOpen(false); setLinkOpen(true); }}>Link Document</button>
                  </div>
                )}
              </div>
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything"
                className="flex-1 bg-transparent outline-none text-sm placeholder-text-muted"
              />
              <div className="flex items-center gap-1 ml-2">
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  size="sm"
                  className={`w-9 h-9 rounded-full transition-all duration-200 ${
                    message.trim() 
                      ? 'bg-gradient-to-r from-blood-red to-crimson hover:from-crimson hover:to-blood-red text-white' 
                      : 'bg-surface-secondary text-text-muted cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Document Modal */}
      {linkOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setLinkOpen(false)} />
          <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-soft">
            <div className="p-5 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold">Link a document</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-white/80">Upload new</label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="relative">
                    <input
                      id="link-upload-input"
                      type="file"
                      accept=".csv,.xls,.xlsx"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileUpload as any}
                    />
                    <Button
                      variant="secondary"
                      className="h-10 px-4 rounded-xl bg-surface border border-border text-text-primary hover:bg-hover"
                    >
                      <Upload className="w-4 h-4 mr-2" /> Upload files
                    </Button>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-white/60">CSV, Excel</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">Your files</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-900 rounded-md px-2 py-1">
                  <option value="date">Upload date</option>
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                </select>
              </div>
              <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-white/10 rounded-lg divide-y divide-gray-200 dark:divide-white/10">
                {sortedFiles.length === 0 && (
                  <div className="p-3 text-sm text-gray-500 dark:text-white/60">No files uploaded yet.</div>
                )}
                {sortedFiles.map((f: any) => (
                  <button key={f.id} className="w-full text-left p-3 hover:bg-hover text-sm flex items-center justify-between">
                    <span className="truncate pr-3">{f.name}</span>
                    <span className="text-xs text-gray-500 dark:text-white/60">{(f.size ? (f.size/1024/1024).toFixed(1)+' MB' : '')}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setLinkOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;

"use client";
import React, { useState, useEffect } from 'react';
import { MessageSquare, Folder as FolderIcon, ChevronRight, Upload, FileSpreadsheet } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { AttachedFilesBar } from './AttachedFilesBar';
import { UploadingFilesBadges } from './UploadingFilesBadges';
import { Message, UploadedFile, Chat, Folder } from '@/types';
import { dataAPI, chatAPI } from '@/services/api';
import { useFilesStore } from '@/state/filesStore';
import { useChatStore } from '@/state/chatStore';
import { AnalysisResponse } from './AnalysisResponse';

interface ChatAreaProps {
  chat?: Chat;
  folder?: Folder | undefined;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ chat, folder }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pollIntervals, setPollIntervals] = useState<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  
  const {
    addUploadedFile,
    getAvailableFiles,
  } = useFilesStore();

  const {
    createChat,
    setActiveChat,
    addMessage,
    editMessage,
    deleteMessage,
    addUploadingFile,
    updateUploadingFile,
    removeUploadingFile,
    attachFile,
    removeAttachedFile,
    getUploadingFiles,
    getAttachedFiles,
    getChatData,
  } = useChatStore();

  useEffect(() => {
    if (chat && chat.id) {
      const chatData = getChatData(chat?.id);
      if (!chatData) {
        createChat(chat.id, chat.name, folder?.id).catch(console.error);
      }
      setActiveChat(chat.id);
    }
  }, [chat, folder, getChatData, createChat, setActiveChat]);

  const chatData = chat ? getChatData(chat.id) : undefined;
  const messages = chatData?.messages || [];
  const uploadingFiles = chat ? getUploadingFiles(chat.id) : [];
  const attachedFiles = chat ? getAttachedFiles(chat.id) : [];

  const handleSendMessage = (content: string) => {
    if (!chat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    addMessage(chat.id, userMessage);

    const aiThinkingProcess: Message = {
      id: (Date.now() + 1).toString(),
      type: 'thinking',
      content: '',
      timestamp: new Date().toISOString(),
    };

    tryWebSocketConnection(content, aiThinkingProcess);
  };

  const tryWebSocketConnection = (content: string, aiThinkingProcess: Message) => {
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const wsProtocol = process.env.NEXT_PUBLIC_BACKEND_WS_PROTOCOL || (isHttps ? 'wss' : 'ws');
    const wsHost = process.env.NEXT_PUBLIC_BACKEND_WS_HOST || 'urekaibackendpython.onrender.com';
    const url = `${wsProtocol}://${wsHost}/v2/api/chat/ws/query`;

    const ws = new WebSocket(url);

    ws.onopen = () => {
      ws.send(JSON.stringify({ userQuery: content }));
      setIsLoading(true);
    };

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);

      if (!chat) {
        setIsLoading(false);
        return;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '',
        timestamp: new Date().toISOString(),
      };

      switch (messageData.type) {
        case 'thinking':
          if (aiThinkingProcess.content === '') {
            aiThinkingProcess.content = messageData.content;
            addMessage(chat.id, aiThinkingProcess, true);
          } else {
            editMessage(chat.id, aiThinkingProcess.id, messageData.content, true);
          }
          break;
        case 'general':
        case 'unsupported':
        case 'final':
          aiMessage.content = messageData.content;
          deleteMessage(chat.id, aiThinkingProcess.id);
          addMessage(chat.id, aiMessage);
          setIsLoading(false);
          if (messageData.type === 'final') ws.close();
          break;
        case 'error':
          aiMessage.content = messageData.content;
          deleteMessage(chat.id, aiThinkingProcess.id);
          addMessage(chat.id, aiMessage);
          setIsLoading(false);
          ws.close();
          break;
        case 'analysis':
          aiMessage.content = AnalysisResponse({ data: messageData.content }) as unknown as string;
          deleteMessage(chat.id, aiThinkingProcess.id);
          addMessage(chat.id, aiMessage);
          setIsLoading(false);
          ws.close();
          break;
        default:
          aiMessage.content = messageData.content;
          deleteMessage(chat.id, aiThinkingProcess.id);
          addMessage(chat.id, aiMessage);
          setIsLoading(false);
          break;
      }
    };

    ws.onerror = () => {
      tryRestApiConnection(content, aiThinkingProcess);
    };

    ws.onclose = () => {
      setIsLoading(false);
    };
  };

  const tryRestApiConnection = async (content: string, aiThinkingProcess: Message) => {
    if (!chat) return;
    try {
      setIsLoading(true);
      addMessage(chat.id, aiThinkingProcess);
      const response = await chatAPI.query(content, [], chat.id);
      deleteMessage(chat.id, aiThinkingProcess.id);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.message || response.content || 'No response received',
        timestamp: new Date().toISOString(),
      };
      addMessage(chat.id, aiMessage);
      setIsLoading(false);
    } catch (error) {
      deleteMessage(chat.id, aiThinkingProcess.id);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I could not connect to the server. Please try again.',
        timestamp: new Date().toISOString(),
      };
      addMessage(chat.id, errorMessage);
      setIsLoading(false);
    }
  };

  const generateClientId = () => {
    try {
      return crypto.randomUUID();
    } catch {
      return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!chat) return;
    const fileArray = Array.from(files);
    const newUploadingFiles: UploadedFile[] = fileArray.map((file) => ({
      id: generateClientId(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      extension: file.name.split('.').pop() || ''
    }));

    newUploadingFiles.forEach(file => addUploadingFile(chat.id, file));

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const uploadingFile = newUploadingFiles[i];
      try {
        const response = await dataAPI.uploadFile(file);
        if (!response.success) throw new Error('Upload failed');
        const uploadId = response.uploadId;
        const fileName = response.originalFileName;
        updateUploadingFile(chat.id, uploadingFile.id, {
          uploadId,
          status: 'processing',
          progress: 0
        });
        pollUploadStatus(chat.id, uploadingFile.id, uploadId, fileName, file.size, file.type, uploadingFile.extension!);
      } catch (error) {
        updateUploadingFile(chat.id, uploadingFile.id, {
          status: 'failed',
          progress: 0,
          uploadId: undefined,
        });
      }
    }
  };

  const pollUploadStatus = async (chatId: string, fileId: string, uploadId: string, fileName: string, fileSize: number, fileType: string, extension: string) => {
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 5;
    const pollInterval = setInterval(async () => {
      try {
        const currentUploadingFiles = getUploadingFiles(chatId);
        const fileStillExists = currentUploadingFiles.some(f => f.id === fileId);
        if (!fileStillExists) {
          clearInterval(pollInterval);
          setPollIntervals(prev => {
            const newMap = new Map(prev);
            newMap.delete(fileId);
            return newMap;
          });
          removeUploadingFile(chatId, fileId);
          return;
        }
        const statusResponse = await dataAPI.getUploadStatus(uploadId, extension);
        consecutiveErrors = 0;
        if (!statusResponse.success) throw new Error('Receiving error from backend.');
        if (statusResponse.notFound) return;
        const progress = statusResponse.progress ?? 0;
        const rawStatus = statusResponse.status ?? 'processing';
        const status: 'uploading' | 'pending' | 'processing' | 'completed' | 'failed' = 
          ['uploading', 'pending', 'processing', 'completed', 'failed'].includes(rawStatus) 
            ? rawStatus as any
            : 'processing';
        updateUploadingFile(chatId, fileId, { progress, status });
        if (status === 'completed' || status === 'failed') {
          clearInterval(pollInterval);
          setPollIntervals(prev => {
            const newMap = new Map(prev);
            newMap.delete(fileId);
            return newMap;
          });
          setTimeout(() => {
            if (status === 'completed') {
              addUploadedFile({
                id: fileId,
                name: fileName,
                size: fileSize,
                type: fileType,
                uploadId,
                extension,
                status: 'completed'
              });
              attachFile(chatId, { id: fileId, name: fileName, size: fileSize, type: fileType, uploadId, extension });
            }
            removeUploadingFile(chatId, fileId);
            const systemMessage: Message = {
              id: Date.now().toString(),
              type: 'system',
              content: status === 'completed' ? `File "${fileName}" uploaded successfully` : `File "${fileName}" failed to upload`,
              timestamp: new Date().toISOString(),
              isError: status === 'failed'
            };
            addMessage(chatId, systemMessage);
          }, 2000);
        }
      } catch (error) {
        consecutiveErrors++;
        if (consecutiveErrors >= maxConsecutiveErrors) {
          clearInterval(pollInterval);
          setPollIntervals(prev => {
            const newMap = new Map(prev);
            newMap.delete(fileId);
            return newMap;
          });
          updateUploadingFile(chatId, fileId, { status: 'failed', progress: 0, uploadId: undefined });
          const systemMessage: Message = {
            id: Date.now().toString(),
            type: 'system',
            content: `File "${fileName}" upload failed due to network issues. Please try again.`,
            timestamp: new Date().toISOString(),
            isError: true
          };
          addMessage(chatId, systemMessage);
        }
      }
    }, 2000);
    setPollIntervals(prev => new Map(prev).set(fileId, pollInterval));
  };

  const handleAttachFile = (file: UploadedFile) => {
    if (chat) {
      attachFile(chat.id, { id: file.id, name: file.name, size: file.size, type: file.type, uploadId: file.uploadId!, extension: file.extension! });
    }
  };

  const handleRemoveAttachedFile = (fileId: string) => {
    if (chat) removeAttachedFile(chat.id, fileId);
  };

  const handleRemoveUploadingFile = (fileId: string) => {
    if (!chat) return;
    const interval = pollIntervals.get(fileId);
    if (interval) {
      clearInterval(interval);
      setPollIntervals(prev => { const m = new Map(prev); m.delete(fileId); return m; });
    }
    removeUploadingFile(chat.id, fileId);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false); if (!chat) return; const files = e.dataTransfer.files; if (files && files.length > 0) {
      const supportedFiles = Array.from(files).filter(file => ['csv', 'xlsx', 'xls'].includes(file.name.split('.').pop()?.toLowerCase() || ''));
      if (supportedFiles.length > 0) { const fileList = new DataTransfer(); supportedFiles.forEach(file => fileList.items.add(file)); handleFileUpload(fileList.files); }
      else { alert('Please upload supported file types: CSV, Excel (.xlsx, .xls).'); }
    }
  };

  if (!chat && !folder) {
    return (
      <div className="flex-1 flex flex-col h-full relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="text-xl font-medium text-text-primary mb-2">Welcome to UrekAI</h3>
            <p className="text-text-muted mb-4">Get started by creating your first project and chat</p>
            <div className="text-sm text-text-muted space-y-2">
              <p>1. Click "New Project" to create a folder</p>
              <p>2. Click "New Chat" to start a conversation</p>
              <p>3. Upload files and ask questions about your data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availableFiles = chat ? getAvailableFiles(chat.id) : [];

  return (
    <div className={`flex-1 flex flex-col h-full relative ${isDragOver ? 'bg-blue-50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-95 flex items-center justify-center z-50 border-4 border-dashed border-blue-400">
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-blue-200">
            <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Drop files here to upload</h3>
            <p className="text-blue-600 mb-4">Supports CSV, and Excel (.xlsx, .xls), files</p>
            <div className="flex items-center justify-center gap-4 text-sm text-blue-500">
              <div className="flex items-center gap-1">
                <FileSpreadsheet className="h-4 w-4" />
                <span>CSV</span>
              </div>
              <div className="flex items-center gap-1">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 flex gap-2 items-center flex-wrap">
        {folder && (
          <>
            <div className="flex items-center gap-2 bg-rose-100 text-red-800 px-2 sm:px-3 py-1 rounded-xl text-xs sm:text-sm font-medium">
              <FolderIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{folder.name}</span>
            </div>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
          </>
        )}
        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-2 sm:px-3 py-1 rounded-xl text-xs sm:text-sm font-medium">
          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="truncate max-w-32 sm:max-w-none">{chat?.name}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-0 md:px-20 lg:px-28">
        <MessageList messages={messages} hasMessages={messages.length > 0} />
      </div>

      <div className="relative px-0 md:px-20 lg:px-28">
        <AttachedFilesBar attachedFiles={attachedFiles} onRemoveFile={handleRemoveAttachedFile} />
        <div className="absolute inset-x-0 bottom-[72px] z-20">
          <div className="px-0 md:px-20 lg:px-28">
            <UploadingFilesBadges uploadingFiles={uploadingFiles} onRemoveFile={handleRemoveUploadingFile} />
          </div>
        </div>
        <MessageInput 
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
          isDragOver={isDragOver}
          availableFiles={availableFiles}
          onAttachFile={handleAttachFile}
        />
      </div>
    </div>
  );
};
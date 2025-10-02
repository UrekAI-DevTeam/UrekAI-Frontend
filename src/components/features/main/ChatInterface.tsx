"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/card';
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
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  X
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
  analysis?: {
    summary: string;
    key_insights: string[];
    trends_anomalies: string[];
  };
  table_data?: Record<string, any[]>;
  graph_data?: Record<string, any>;
}

export function ChatInterface() {
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  
  // File upload progress tracking
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, { progress: number; status: string; fileName: string }>>({});
  const uploadIntervals = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Attached files for current chat
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);

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
      status: 'sending',
      attachments: attachedFiles.length > 0 ? attachedFiles.map(file => ({
        name: file.name,
        type: file.type?.split('/')[1]?.toUpperCase() || 'FILE',
        size: file.size ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : 'Unknown size'
      })) : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    const currentAttachedFiles = [...attachedFiles];
    setMessage('');
    setAttachedFiles([]); // Clear attached files after sending

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
      // Call the backend API with attached files
      const response = await chatAPI.query(currentMessage, currentAttachedFiles);
      
      // Hide typing indicator
      setIsTyping(false);

      // Create AI response message
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.message || response.content || "I understand your question. Let me analyze the data and provide you with insights...",
        timestamp: new Date(),
        status: 'read',
        analysis: response.analysis,
        table_data: response.table_data,
        graph_data: response.graph_data
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
    const fileId = Date.now().toString();
    
    // File size validation (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert(`File size too large. Please select a file smaller than 50MB. Current size: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
      return;
    }
    
    // Add to uploading files with initial state
    setUploadingFiles(prev => ({
      ...prev,
      [fileId]: { progress: 0, status: 'uploading', fileName: file.name }
    }));

    try {
      // Upload file to backend
      const uploadResult = await dataAPI.uploadFile(file);
      
      if (uploadResult.success) {
        // Create uploaded file object
        const uploadedFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadId: uploadResult.uploadId,
          extension: file.name.split('.').pop()?.toLowerCase() || '',
          status: 'processing' as const,
          progress: 0,
          uploadedAt: new Date().toISOString()
        };
        
        // Add to files store
        await addUploadedFile(uploadedFile);
        
        // Start polling for upload status
        pollUploadStatus(uploadResult.uploadId, fileId, uploadedFile.extension);
      } else {
        // Update uploading files with error
        setUploadingFiles(prev => ({
          ...prev,
          [fileId]: { progress: 0, status: 'failed', fileName: file.name }
        }));
      }
    } catch (error) {
      console.error('File upload error:', error);
      setUploadingFiles(prev => ({
        ...prev,
        [fileId]: { progress: 0, status: 'failed', fileName: file.name }
      }));
      
      // Show specific error message to user
      const errorText = error instanceof Error ? error.message : `Failed to upload "${file.name}". Please try again.`;
      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        type: 'assistant',
        content: errorText,
        timestamp: new Date(),
        status: 'read'
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    // Reset the file input
    event.target.value = '';
  };

  // Poll upload status
  const pollUploadStatus = async (uploadId: string, fileId: string, extension: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResult = await dataAPI.getUploadStatus(uploadId, extension);
        
        if (statusResult.success) {
          const progress = statusResult.progress || 0;
          const status = statusResult.status || 'processing';
          
          // Update progress
          setUploadingFiles(prev => ({
            ...prev,
            [fileId]: { progress, status, fileName: prev[fileId]?.fileName || '' }
          }));
          
          // Update file in store
          updateUploadedFile(fileId, { progress, status: status as 'uploading' | 'pending' | 'processing' | 'completed' | 'failed' });
          
          if (status === 'completed' || status === 'failed') {
            clearInterval(pollInterval);
            delete uploadIntervals.current[fileId];
            
            // Remove from uploading files after a delay
            setTimeout(() => {
              setUploadingFiles(prev => {
                const newState = { ...prev };
                delete newState[fileId];
                return newState;
              });
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Upload status polling error:', error);
        clearInterval(pollInterval);
        delete uploadIntervals.current[fileId];
      }
    }, 2000); // Poll every 2 seconds
    
    uploadIntervals.current[fileId] = pollInterval;
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      const intervals = uploadIntervals.current;
      Object.values(intervals).forEach(clearInterval);
    };
  }, []);

  // Handle file deletion
  const handleDeleteFile = async (file: any) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      if (file.uploadId) {
        await dataAPI.deleteFile(file.uploadId);
      }
      removeUploadedFile(file.id, true);
    } catch (error) {
      console.error('Failed to delete file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  // Handle file linking (attaching to current chat)
  const handleLinkFile = (file: any) => {
    if (attachedFiles.find(f => f.id === file.id)) {
      // File already attached, remove it
      setAttachedFiles(prev => prev.filter(f => f.id !== file.id));
    } else {
      // Attach file to current chat
      setAttachedFiles(prev => [...prev, file]);
    }
  };

  // Bar Chart component
  const BarChart = ({ data }: { data: any }) => {
    if (!data || typeof data !== 'object') {
      return (
        <div className="text-center text-text-muted py-8">
          <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No chart data available</p>
        </div>
      );
    }

    // Extract chart data from the structured format
    let chartData: Array<{label: string, value: number}> = [];
    let chartTitle = 'Chart';
    
    if (data.graph_data && data.graph_data.labels && data.graph_data.values) {
      // This is the proper structured format we're receiving
      chartData = data.graph_data.labels.map((label: string, index: number) => ({
        label,
        value: data.graph_data.values[index] || 0
      }));
      chartTitle = data.graph_type === 'bar' ? 'Bar Chart' : 'Chart';
    } else if (data.labels && data.values) {
      // Direct labels and values arrays
      chartData = data.labels.map((label: string, index: number) => ({
        label,
        value: data.values[index] || 0
      }));
    } else {
      return (
        <div className="text-center text-text-muted py-8">
          <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Invalid chart data format</p>
        </div>
      );
    }

    if (chartData.length === 0) {
      return (
        <div className="text-center text-text-muted py-8">
          <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No data points available</p>
        </div>
      );
    }

    const maxValue = Math.max(...chartData.map(d => d.value));
    const minValue = Math.min(...chartData.map(d => d.value));
    const valueRange = maxValue - minValue;
    
    // Limit to top 20 items for better visualization
    const displayData = chartData
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);
    
    const chartHeight = 400;
    const chartWidth = 800;
    const barWidth = Math.max(20, chartWidth / displayData.length - 2);
    const padding = 60;

    return (
      <div className="w-full">
        <div className="text-center mb-4">
          <h4 className="text-lg font-semibold text-text-primary">{chartTitle}</h4>
          <p className="text-sm text-text-muted">
            {chartData.length} data points • Range: {minValue.toLocaleString()} - {maxValue.toLocaleString()}
          </p>
        </div>
        
        <div className="relative overflow-x-auto">
          <svg width={chartWidth} height={chartHeight} className="mx-auto">
            {/* Y-axis */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={chartHeight - padding}
              stroke="currentColor"
              strokeWidth="2"
              className="text-border"
            />
            
            {/* X-axis */}
            <line
              x1={padding}
              y1={chartHeight - padding}
              x2={chartWidth - padding}
              y2={chartHeight - padding}
              stroke="currentColor"
              strokeWidth="2"
              className="text-border"
            />
            
            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const value = minValue + (valueRange * ratio);
              const y = chartHeight - padding - (ratio * (chartHeight - 2 * padding));
              return (
                <g key={ratio}>
                  <line
                    x1={padding - 5}
                    y1={y}
                    x2={padding}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-border"
                  />
                  <text
                    x={padding - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs fill-text-muted"
                  >
                    {value.toLocaleString()}
                  </text>
                </g>
              );
            })}
            
            {/* Bars */}
            {displayData.map((item, index) => {
              const barHeight = valueRange > 0 ? ((item.value - minValue) / valueRange) * (chartHeight - 2 * padding) : 0;
              const x = padding + (index * (barWidth + 2));
              const y = chartHeight - padding - barHeight;
              const barColor = `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
              
              return (
                <g key={index}>
                  {/* Bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={barColor}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <title>{item.label}: {item.value.toLocaleString()}</title>
                  </rect>
                  
                  {/* Value label on top of bar */}
                  {barHeight > 20 && (
                    <text
                      x={x + barWidth / 2}
                      y={y - 5}
                      textAnchor="middle"
                      className="text-xs fill-text-primary font-medium"
                    >
                      {item.value.toLocaleString()}
                    </text>
                  )}
                  
                  {/* X-axis label */}
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight - padding + 15}
                    textAnchor="middle"
                    className="text-xs fill-text-muted"
                    transform={`rotate(-45, ${x + barWidth / 2}, ${chartHeight - padding + 15})`}
                  >
                    {item.label.length > 8 ? item.label.substring(0, 8) + '...' : item.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="mt-4 text-center">
          <p className="text-xs text-text-muted">
            Showing top {displayData.length} of {chartData.length} items
          </p>
        </div>
      </div>
    );
  };

  // Analysis response component
  const AnalysisResponse = ({ analysis, table_data, graph_data }: { analysis?: any; table_data?: any; graph_data?: any }) => {
    const [showTableModal, setShowTableModal] = useState(false);
    const [showGraphModal, setShowGraphModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState<{name: string, data: any[]} | null>(null);

    if (!analysis && !table_data && !graph_data) return null;

    const handleTableClick = (tableName: string, tableData: any[]) => {
      setSelectedTable({ name: tableName, data: tableData });
      setShowTableModal(true);
    };

    return (
      <div className="mt-4 space-y-4">
        {/* Analysis Summary */}
        {analysis && (
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-lg font-semibold text-text-primary mb-3">Analysis Summary</h4>
            <p className="text-base text-text-secondary mb-4">{analysis.summary}</p>
            
            {analysis.key_insights && analysis.key_insights.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-text-primary mb-3">Key Insights</h5>
                <ul className="space-y-2">
                  {analysis.key_insights.map((insight: string, index: number) => (
                    <li key={index} className="text-sm text-text-secondary flex items-start">
                      <span className="text-primary mr-3 mt-1">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.trends_anomalies && analysis.trends_anomalies.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-text-primary mb-3">Trends & Anomalies</h5>
                <ul className="space-y-2">
                  {analysis.trends_anomalies.map((trend: string, index: number) => (
                    <li key={index} className="text-sm text-text-secondary flex items-start">
                      <span className="text-warning mr-3 mt-1">•</span>
                      {trend}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Capsules */}
            <div className="flex gap-3 mt-6">
              {table_data && Object.keys(table_data).length > 0 && (
                <button
                  onClick={() => {
                    const firstTable = Object.entries(table_data)[0];
                    handleTableClick(firstTable[0], firstTable[1] as any[]);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full text-sm font-medium text-primary transition-colors"
                >
                  <Database className="h-4 w-4" />
                  Data Tables
                </button>
              )}
              
              {graph_data && Object.keys(graph_data).length > 0 && (
                <button
                  onClick={() => setShowGraphModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full text-sm font-medium text-primary transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  Visualizations
                </button>
              )}
            </div>
          </div>
        )}

        {/* Table Modal */}
        {showTableModal && selectedTable && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background-surface border border-border rounded-xl max-w-6xl max-h-[80vh] w-full overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-border bg-background-surface flex items-center justify-between">
                <h3 className="text-xl font-semibold text-text-primary">{selectedTable.name}</h3>
                <button
                  onClick={() => setShowTableModal(false)}
                  className="p-2 hover:bg-hover rounded-lg transition-colors text-text-muted hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 overflow-auto max-h-[60vh] bg-background-surface">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-background-surface-secondary">
                        {selectedTable.data[0] && Object.keys(selectedTable.data[0]).map((key) => (
                          <th key={key} className="text-left py-4 px-4 text-text-primary font-semibold">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTable.data.map((row: any, index: number) => (
                        <tr key={index} className="border-b border-border/50 hover:bg-hover/50 bg-background-surface">
                          {Object.values(row).map((value: any, cellIndex: number) => (
                            <td key={cellIndex} className="py-3 px-4 text-text-secondary">{String(value)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Graph Modal */}
        {showGraphModal && graph_data && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background-surface border border-border rounded-xl max-w-5xl max-h-[85vh] w-full overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-border bg-background-surface flex items-center justify-between">
                <h3 className="text-xl font-semibold text-text-primary">Data Visualizations</h3>
                <button
                  onClick={() => setShowGraphModal(false)}
                  className="p-2 hover:bg-hover rounded-lg transition-colors text-text-muted hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 overflow-auto max-h-[70vh] bg-background-surface">
                {Object.entries(graph_data).map(([graphName, graphData]) => (
                  <div key={graphName} className="mb-8">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">{graphName}</h4>
                    <div className="bg-surface border border-border rounded-lg p-6">
                      <BarChart data={graphData} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // File upload progress component
  const FileUploadProgress = ({ fileId, progress, status, fileName }: { fileId: string; progress: number; status: string; fileName: string }) => (
    <div className="p-3 border border-border rounded-lg bg-surface mb-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
          <span className="text-sm font-medium text-text-primary truncate">{fileName}</span>
        </div>
        <span className="text-xs text-text-muted">{progress}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 mb-1">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-text-muted capitalize">{status}</div>
    </div>
  );

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
  const { uploadedFiles, initializeUploadedFiles, addUploadedFile, updateUploadedFile, removeUploadedFile } = useFilesStore();
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
                        ? 'bg-primary hover:bg-primary/90 text-text-white' 
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
                    ? 'bg-primary shadow-soft' 
                    : 'bg-surface backdrop-blur-xl border border-border'
                }`}>
                  {msg.type === 'user' ? (
                    <User className="w-4 h-4 text-text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-primary" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col group ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`relative px-4 py-3 rounded-2xl backdrop-blur-xl shadow-soft ${
                    msg.type === 'user'
                      ? 'bg-primary text-text-white rounded-br-md'
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

                    {/* Analysis Response */}
                    {msg.type === 'assistant' && (msg.analysis || msg.table_data || msg.graph_data) && (
                      <AnalysisResponse 
                        analysis={msg.analysis} 
                        table_data={msg.table_data} 
                        graph_data={msg.graph_data} 
                      />
                    )}

                  </div>

                  {/* Timestamp and Status */}
                  <div className={`flex items-center gap-2 mt-1 text-xs text-text-muted ${
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
                          className="w-6 h-6 p-0 hover:bg-hover rounded-full flex items-center justify-center transition-colors duration-200"
                          onClick={() => copyToClipboard(msg.content)}
                          title="Copy message"
                        >
                          <Copy className="w-3 h-3 text-text-muted" />
                        </button>
                        <button
                          className="w-6 h-6 p-0 hover:bg-hover rounded-full flex items-center justify-center transition-colors duration-200"
                          title="Like message"
                        >
                          <ThumbsUp className="w-3 h-3 text-text-muted" />
                        </button>
                        <button
                          className="w-6 h-6 p-0 hover:bg-hover rounded-full flex items-center justify-center transition-colors duration-200"
                          title="Dislike message"
                        >
                          <ThumbsDown className="w-3 h-3 text-text-muted" />
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
                <div className="w-8 h-8 rounded-full bg-surface backdrop-blur-xl border border-border flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-surface backdrop-blur-xl border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-soft">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background-surface/90 via-background-surface/70 to-transparent backdrop-blur-xl pt-6 sm:pt-8 border-t border-border/50 transition-all duration-500 ease-out ${
          showPersistentInput ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
            {/* Quick Prompts */}
            <div className="mb-3">
              <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="h-8 px-3 rounded-full border border-border bg-background-surface text-text-secondary text-xs hover:bg-interactive-hover transition-colors shadow-md whitespace-nowrap flex-shrink-0"
                    onClick={() => setMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Attached Files Indicator */}
            {attachedFiles.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  {attachedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary">
                      <FileText className="h-3 w-3" />
                      <span className="truncate max-w-32">{file.name}</span>
                      <button 
                        onClick={() => handleLinkFile(file)}
                        className="text-primary hover:text-primary/70 transition-colors"
                        title="Remove file"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Chat Input Design */}
            <div className="w-full max-w-4xl mx-auto bg-background-surface/80 backdrop-blur-sm text-text-primary rounded-full border border-border/50 flex items-center px-2 py-1.5 shadow-lg">
              <div className="relative mr-1">
                <button 
                  data-plus-button
                  onClick={handlePlusClick} 
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-background-surface-secondary/80 backdrop-blur-sm border border-border/30"
                >
                  <Plus className="w-4 h-4" />
                </button>
                {plusOpen && (
                  <div className={`absolute left-0 w-56 rounded-xl border border-border bg-background-surface shadow-lg z-10 text-left ${
                    plusDropdownUpward ? 'bottom-full mb-2' : 'top-full mt-2'
                  }`}>
                    <button className="w-full px-3 py-2 text-sm hover:bg-interactive-hover rounded-lg transition-colors" onClick={() => { setPlusOpen(false); inputRef.current?.focus(); }}>Ask from Shopify stats</button>
                    <button className="w-full px-3 py-2 text-sm hover:bg-interactive-hover rounded-lg transition-colors" onClick={() => { setPlusOpen(false); setLinkOpen(true); }}>Link Document</button>
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
                <button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`w-9 h-9 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg ${
                    message.trim() 
                      ? 'bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white backdrop-blur-sm border border-primary/30 shadow-primary/20 hover:shadow-primary/30 hover:scale-105' 
                      : 'bg-surface-secondary/60 text-text-muted cursor-not-allowed backdrop-blur-sm border border-border/40 shadow-sm'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Document Modal */}
      {linkOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setLinkOpen(false)} />
          <div className="relative w-full max-w-lg border border-border rounded-2xl shadow-soft bg-white dark:bg-slate-900 overflow-hidden" style={{ 
            opacity: 1,
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            borderRadius: '1rem'
          }}>
            <div className="p-5 border-b border-border bg-white dark:bg-slate-900 rounded-t-2xl">
              <h3 className="text-lg font-semibold text-text-primary">Link a document</h3>
            </div>
            <div className="p-5 space-y-4 bg-white dark:bg-slate-900">
              <div>
                <label className="text-sm font-medium text-text-secondary">Upload new</label>
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
                  <span className="text-xs text-text-muted">CSV, Excel</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">Your files</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="text-sm border border-border bg-white dark:bg-slate-900 text-text-primary rounded-lg px-3 py-2">
                  <option value="date">Upload date</option>
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                </select>
              </div>
              <div className="max-h-60 overflow-y-auto border border-border rounded-xl divide-y divide-border bg-white dark:bg-slate-900">
                {/* Show uploading files with progress */}
                {Object.entries(uploadingFiles).map(([fileId, { progress, status, fileName }]) => (
                  <FileUploadProgress key={fileId} fileId={fileId} progress={progress} status={status} fileName={fileName} />
                ))}
                
                {/* Show completed files */}
                {sortedFiles.length === 0 && Object.keys(uploadingFiles).length === 0 && (
                  <div className="p-3 text-sm text-text-muted">No files uploaded yet.</div>
                )}
                {sortedFiles.map((f: any) => (
                  <div key={f.id} className="p-3 hover:bg-hover flex items-center justify-between group">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {f.status === 'processing' && (
                        <Loader2 className="h-4 w-4 text-yellow-500 animate-spin flex-shrink-0" />
                      )}
                      {f.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                      {f.status === 'failed' && (
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      )}
                      <span className="text-sm text-text-primary truncate">{f.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted whitespace-nowrap">
                        {f.size && f.size > 0 ? (f.size/1024/1024).toFixed(1)+' MB' : 'Unknown size'}
                      </span>
                      <button 
                        onClick={() => handleLinkFile(f)}
                        className={`p-1 rounded transition-opacity ${
                          attachedFiles.find(af => af.id === f.id) 
                            ? 'text-primary bg-primary/10 opacity-100' 
                            : 'text-text-muted hover:text-primary opacity-0 group-hover:opacity-100'
                        }`}
                        title={attachedFiles.find(af => af.id === f.id) ? 'Unlink file' : 'Link file to chat'}
                      >
                        {attachedFiles.find(af => af.id === f.id) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Plus className="h-3 w-3" />
                        )}
                      </button>
                      <button 
                        onClick={() => handleDeleteFile(f)}
                        className="p-1 text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete file"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-2 bg-white dark:bg-slate-900 rounded-b-2xl">
              <Button variant="ghost" onClick={() => setLinkOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;

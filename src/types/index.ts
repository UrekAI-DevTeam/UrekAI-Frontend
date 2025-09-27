import { ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  firebase_token?: string;
}

// export interface Chat {
//   id: string;
//   name: string;
//   folderId?: string;
//   messages: Message[];
//   createdAt: string;
//   updatedAt: string;
// }
export interface Message {
  id: string;
  type: 'user' | 'ai' | 'system' | 'thinking';
  content: string | ReactNode | undefined | [];
  timestamp: string;
  attachments?: File[];
  isError?: boolean;
  analysisData?: {
    analysis?: {
      summary?: string;
      key_insights?: string[];
      trends_anomalies?: string[];
      recommendations?: string[];
      business_impact?: string[];
    };
    table_data?: Record<string, Array<Record<string, string | number>>>;
    graph_data?: {
      [key: string]: {
        graph_type: 'bar' | 'line' | 'pie' | 'scatter';
        graph_category: 'primary' | 'secondary';
        graph_data: {
          labels: string[];
          values: number[];
        };
      };
    };
  };
}

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}
export interface Folder {
  id: string;
  name: string;
  chats?: Chat[];
  createdAt?: string;
  isSelected?: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt?: string;
  uploadId?: string;
  extension?: string;
  progress?: number;
  status?: 'uploading' | 'pending' | 'processing' | 'completed' | 'failed';
}

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadId: string;
  extension: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isFirebaseAuthenticated: boolean;
  isLoading: boolean;
}

export interface FastAPIAuthError {
  detail: string;
}
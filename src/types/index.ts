// src/types/index.ts

export interface AudioFile {
  id: string;
  name: string;
  file: File | null;
  url?: string;
  duration?: number;
  size: number;
  type: string;
}

export interface Speaker {
  speakerId: string;
  name?: string;
  segments: AudioSegment[];
  personality?: PersonalityProfile;
  voiceCharacteristics?: VoiceProfile;
}

export interface AudioSegment {
  start: number;
  end: number;
  speakerId: string;
  text?: string;
  confidence?: number;
}

export interface PersonalityProfile {
  speakerId: string;
  traits: {
    formality: number; // 0-1 (informal to formal)
    emotionality: number; // 0-1 (logical to emotional)
    enthusiasm: number; // 0-1 (calm to enthusiastic)
    directness: number; // 0-1 (indirect to direct)
    warmth: number; // 0-1 (cold to warm)
  };
  speechPatterns: {
    commonPhrases: string[];
    vocabularyLevel: 'casual' | 'professional' | 'academic';
    sentenceLength: 'short' | 'medium' | 'long';
    questionFrequency: number;
    interruptionTendency: number;
  };
  communicationStyle: {
    preferredTopics: string[];
    conversationRole: 'leader' | 'supporter' | 'questioner' | 'storyteller';
    humorStyle?: 'witty' | 'sarcastic' | 'playful' | 'dry' | 'none';
  };
  summary: string;
}

export interface VoiceProfile {
  speakerId: string;
  pitch: 'low' | 'medium' | 'high';
  pace: 'slow' | 'medium' | 'fast';
  accent?: string;
  voiceCloneId?: string; // ElevenLabs voice ID
}

export interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  description: string;
  estimatedTime?: number;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

export interface ProcessingResult {
  audioFile: AudioFile;
  speakers: Speaker[];
  transcript: TranscriptEntry[];
  processingSteps: ProcessingStep[];
  isComplete: boolean;
  error?: string;
}

export interface TranscriptEntry {
  id: string;
  speakerId: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  speakerId?: string;
  audioUrl?: string; // TTS generated audio
}

export interface ChatSession {
  id: string;
  speakerId: string;
  speakerName?: string;
  messages: ChatMessage[];
  isActive: boolean;
  createdAt: Date;
  personality: PersonalityProfile;
}

export interface SampleAudioFile {
  id: string;
  name: string;
  description: string;
  url: string;
  duration: number;
  speakers: number;
  category: 'business' | 'casual' | 'customer_service' | 'interview';
  preview?: {
    transcript: string;
    speakerSummaries: string[];
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API request/response types
export interface DiarizationRequest {
  audioFileUrl: string;
  speakerCount?: number;
}

export interface DiarizationResponse {
  segments: AudioSegment[];
  speakers: string[];
}

export interface TranscriptionRequest {
  audioFileUrl: string;
  speakerId?: string;
  segments?: AudioSegment[];
}

export interface TranscriptionResponse {
  transcript: TranscriptEntry[];
  fullText: string;
}

export interface PersonalityAnalysisRequest {
  speakerId: string;
  transcript: string;
  segments: AudioSegment[];
}

export interface ChatRequest {
  message: string;
  speakerId: string;
  conversationHistory: ChatMessage[];
  personality: PersonalityProfile;
}

export interface ChatResponse {
  response: string;
  audioUrl?: string;
}

export interface TTSRequest {
  text: string;
  voiceId?: string;
  speakerId: string;
}

// Context types
export interface AudioContextType {
  // Current processing state
  currentAudio: AudioFile | null;
  processingResult: ProcessingResult | null;
  isProcessing: boolean;
  
  // Processing functions
  uploadAudio: (file: File) => Promise<void>;
  selectSampleAudio: (sampleId: string) => Promise<void>;
  startProcessing: () => Promise<void>;
  resetProcessing: () => void;
  
  // Chat state
  chatSessions: ChatSession[];
  activeChatSession: ChatSession | null;
  
  // Chat functions
  startChatWithSpeaker: (speakerId: string) => void;
  sendMessage: (message: string) => Promise<void>;
  switchChatSession: (sessionId: string) => void;
  closeChatSession: (sessionId: string) => void;
}

// Theme types
export interface ThemeType {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}
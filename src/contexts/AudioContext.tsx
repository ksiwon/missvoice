// src/contexts/AudioContext.tsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  AudioFile,
  ProcessingResult,
  ChatSession,
  ChatMessage,
  AudioContextType,
  PersonalityProfile,
} from '../types';
import { sampleAudioFiles } from '../data/sampleAudioData';
import { processAudioFile } from '../utils/audioProcessor';
import { generateAIResponse } from '../utils/aiResponseGenerator';

interface AudioState {
  currentAudio: AudioFile | null;
  processingResult: ProcessingResult | null;
  isProcessing: boolean;
  chatSessions: ChatSession[];
  activeChatSession: ChatSession | null;
}

type AudioAction =
  | { type: 'SET_AUDIO'; payload: AudioFile }
  | { type: 'START_PROCESSING' }
  | { type: 'UPDATE_PROCESSING'; payload: Partial<ProcessingResult> }
  | { type: 'COMPLETE_PROCESSING'; payload: ProcessingResult }
  | { type: 'RESET_PROCESSING' }
  | { type: 'START_CHAT_SESSION'; payload: { speakerId: string; personality: PersonalityProfile } }
  | { type: 'ADD_MESSAGE'; payload: { sessionId: string; message: ChatMessage } }
  | { type: 'SET_ACTIVE_CHAT_SESSION'; payload: string }
  | { type: 'CLOSE_CHAT_SESSION'; payload: string };

const initialState: AudioState = {
  currentAudio: null,
  processingResult: null,
  isProcessing: false,
  chatSessions: [],
  activeChatSession: null,
};

const audioReducer = (state: AudioState, action: AudioAction): AudioState => {
  switch (action.type) {
    case 'SET_AUDIO':
      return {
        ...state,
        currentAudio: action.payload,
        processingResult: null,
      };

    case 'START_PROCESSING':
      return {
        ...state,
        isProcessing: true,
        processingResult: state.currentAudio ? {
          audioFile: state.currentAudio,
          speakers: [],
          transcript: [],
          processingSteps: [
            {
              id: 'diarization',
              name: 'Speaker Diarization',
              status: 'processing',
              progress: 0,
              description: 'Identifying different speakers in the audio...',
              estimatedTime: 30,
              startTime: new Date(),
            },
            {
              id: 'transcription',
              name: 'Speech to Text',
              status: 'pending',
              progress: 0,
              description: 'Converting speech to text...',
              estimatedTime: 45,
            },
            {
              id: 'analysis',
              name: 'Personality Analysis',
              status: 'pending',
              progress: 0,
              description: 'Analyzing speaking patterns and personality traits...',
              estimatedTime: 60,
            },
            {
              id: 'preparation',
              name: 'AI Preparation',
              status: 'pending',
              progress: 0,
              description: 'Preparing AI models for conversation...',
              estimatedTime: 20,
            },
          ],
          isComplete: false,
        } : null,
      };

    case 'UPDATE_PROCESSING':
      return {
        ...state,
        processingResult: state.processingResult ? {
          ...state.processingResult,
          ...action.payload,
        } : null,
      };

    case 'COMPLETE_PROCESSING':
      return {
        ...state,
        isProcessing: false,
        processingResult: action.payload,
      };

    case 'RESET_PROCESSING':
      return {
        ...state,
        currentAudio: null,
        processingResult: null,
        isProcessing: false,
        chatSessions: [],
        activeChatSession: null,
      };

    case 'START_CHAT_SESSION':
      const newSession: ChatSession = {
        id: `session_${Date.now()}_${action.payload.speakerId}`,
        speakerId: action.payload.speakerId,
        speakerName: `Speaker ${action.payload.speakerId}`,
        messages: [],
        isActive: true,
        createdAt: new Date(),
        personality: action.payload.personality,
      };
      return {
        ...state,
        chatSessions: [...state.chatSessions, newSession],
        activeChatSession: newSession,
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        chatSessions: state.chatSessions.map(session =>
          session.id === action.payload.sessionId
            ? { ...session, messages: [...session.messages, action.payload.message] }
            : session
        ),
        activeChatSession: state.activeChatSession?.id === action.payload.sessionId
          ? {
              ...state.activeChatSession,
              messages: [...state.activeChatSession.messages, action.payload.message],
            }
          : state.activeChatSession,
      };

    case 'SET_ACTIVE_CHAT_SESSION':
      const targetSession = state.chatSessions.find(s => s.id === action.payload);
      return {
        ...state,
        activeChatSession: targetSession || null,
      };

    case 'CLOSE_CHAT_SESSION':
      const updatedSessions = state.chatSessions.filter(s => s.id !== action.payload);
      return {
        ...state,
        chatSessions: updatedSessions,
        activeChatSession: state.activeChatSession?.id === action.payload
          ? (updatedSessions.length > 0 ? updatedSessions[0] : null)
          : state.activeChatSession,
      };

    default:
      return state;
  }
};

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(audioReducer, initialState);

  const uploadAudio = useCallback(async (file: File) => {
    const audioFile: AudioFile = {
      id: `upload_${Date.now()}`,
      name: file.name,
      file,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    };

    dispatch({ type: 'SET_AUDIO', payload: audioFile });
  }, []);

  const selectSampleAudio = useCallback(async (sampleId: string) => {
    const sample = sampleAudioFiles.find(s => s.id === sampleId);
    if (!sample) {
      throw new Error('Sample not found');
    }

    const audioFile: AudioFile = {
      id: sample.id,
      name: sample.name,
      file: null,
      url: sample.url,
      duration: sample.duration,
      size: 0,
      type: 'audio/mp4',
    };

    dispatch({ type: 'SET_AUDIO', payload: audioFile });
  }, []);

  const startProcessing = useCallback(async () => {
    if (!state.currentAudio) {
      throw new Error('No audio file selected');
    }

    dispatch({ type: 'START_PROCESSING' });

    try {
      const result = await processAudioFile(state.currentAudio, (progress) => {
        dispatch({ type: 'UPDATE_PROCESSING', payload: progress });
      });

      dispatch({ type: 'COMPLETE_PROCESSING', payload: result });
    } catch (error) {
      console.error('Processing failed:', error);
      dispatch({
        type: 'UPDATE_PROCESSING',
        payload: {
          error: error instanceof Error ? error.message : 'Processing failed',
          isComplete: true,
        },
      });
    }
  }, [state.currentAudio]);

  const resetProcessing = useCallback(() => {
    dispatch({ type: 'RESET_PROCESSING' });
  }, []);

  const startChatWithSpeaker = useCallback((speakerId: string) => {
    const speaker = state.processingResult?.speakers.find(s => s.speakerId === speakerId);
    if (!speaker?.personality) {
      throw new Error('Speaker personality not found');
    }

    // Close any existing session with this speaker
    const existingSession = state.chatSessions.find(s => s.speakerId === speakerId);
    if (existingSession) {
      dispatch({ type: 'SET_ACTIVE_CHAT_SESSION', payload: existingSession.id });
      return;
    }

    dispatch({
      type: 'START_CHAT_SESSION',
      payload: { speakerId, personality: speaker.personality },
    });
  }, [state.processingResult, state.chatSessions]);

  const sendMessage = useCallback(async (message: string) => {
    if (!state.activeChatSession) {
      throw new Error('No active chat session');
    }

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: { sessionId: state.activeChatSession.id, message: userMessage },
    });

    try {
      const response = await generateAIResponse({
        message,
        speakerId: state.activeChatSession.speakerId,
        conversationHistory: [...state.activeChatSession.messages, userMessage],
        personality: state.activeChatSession.personality,
      });

      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        speakerId: state.activeChatSession.speakerId,
        audioUrl: response.audioUrl,
      };

      dispatch({
        type: 'ADD_MESSAGE',
        payload: { sessionId: state.activeChatSession.id, message: aiMessage },
      });
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date(),
        speakerId: state.activeChatSession.speakerId,
      };

      dispatch({
        type: 'ADD_MESSAGE',
        payload: { sessionId: state.activeChatSession.id, message: errorMessage },
      });
    }
  }, [state.activeChatSession]);

  const switchChatSession = useCallback((sessionId: string) => {
    dispatch({ type: 'SET_ACTIVE_CHAT_SESSION', payload: sessionId });
  }, []);

  const closeChatSession = useCallback((sessionId: string) => {
    dispatch({ type: 'CLOSE_CHAT_SESSION', payload: sessionId });
  }, []);

  const contextValue: AudioContextType = {
    currentAudio: state.currentAudio,
    processingResult: state.processingResult,
    isProcessing: state.isProcessing,
    chatSessions: state.chatSessions,
    activeChatSession: state.activeChatSession,
    uploadAudio,
    selectSampleAudio,
    startProcessing,
    resetProcessing,
    startChatWithSpeaker,
    sendMessage,
    switchChatSession,
    closeChatSession,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
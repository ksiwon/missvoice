// src/api/audioProcessingAPI.ts
import {
  DiarizationResponse,
  TranscriptionResponse,
  ChatRequest,
  ChatResponse,
  APIResponse,
} from '../types';

// API Configuration
const API_CONFIG = {
  ASSEMBLY_AI_KEY: process.env.REACT_APP_ASSEMBLY_AI_KEY || '',
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY || '',
  ELEVENLABS_API_KEY: process.env.REACT_APP_ELEVENLABS_API_KEY || '',
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
};

// AssemblyAI Speaker Diarization
export const performSpeakerDiarization = async (
  audioFileUrl: string
): Promise<APIResponse<DiarizationResponse>> => {
  try {
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': API_CONFIG.ASSEMBLY_AI_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioFileUrl,
        speaker_labels: true,
        speakers_expected: 2, // You can make this dynamic
      }),
    });

    if (!response.ok) {
      throw new Error(`AssemblyAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Poll for completion
    const transcriptId = data.id;
    const result = await pollAssemblyAIResult(transcriptId);
    
    // Convert AssemblyAI format to our format
    const segments = result.utterances?.map((utterance: any) => ({
      start: utterance.start,
      end: utterance.end,
      speakerId: `speaker_${utterance.speaker}`,
      text: utterance.text,
      confidence: utterance.confidence,
    })) || [];

    const speakers: string[] = Array.from(new Set(segments.map((s: { speakerId: string }) => s.speakerId)));

    return {
      success: true,
      data: { segments, speakers },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Diarization failed',
    };
  }
};

const pollAssemblyAIResult = async (transcriptId: string): Promise<any> => {
  const maxAttempts = 60; // 5 minutes max
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: {
        'Authorization': API_CONFIG.ASSEMBLY_AI_KEY,
      },
    });

    const data = await response.json();
    
    if (data.status === 'completed') {
      return data;
    } else if (data.status === 'error') {
      throw new Error(`AssemblyAI processing failed: ${data.error}`);
    }
    
    // Wait 5 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }
  
  throw new Error('AssemblyAI processing timed out');
};

// OpenAI Whisper Transcription (alternative to AssemblyAI)
export const performWhisperTranscription = async (
  audioFile: File
): Promise<APIResponse<TranscriptionResponse>> => {
  try {
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'segment');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    const transcript = data.segments?.map((segment: any, index: number) => ({
      id: `trans_${index}`,
      speakerId: 'speaker_1', // Whisper doesn't do diarization
      text: segment.text,
      startTime: segment.start,
      endTime: segment.end,
      confidence: 0.9, // Default confidence
    })) || [];

    return {
      success: true,
      data: {
        transcript,
        fullText: data.text,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Transcription failed',
    };
  }
};

// OpenAI GPT-4 Personality Analysis
export const analyzePersonalityWithGPT = async (
  speakerId: string,
  transcript: string
): Promise<APIResponse<any>> => {
  try {
    const prompt = `
Analyze the following speech transcript and provide a detailed personality profile for the speaker.

Transcript:
"${transcript}"

Please analyze and provide a JSON response with the following structure:
{
  "traits": {
    "formality": 0.0-1.0,
    "emotionality": 0.0-1.0,
    "enthusiasm": 0.0-1.0,
    "directness": 0.0-1.0,
    "warmth": 0.0-1.0
  },
  "speechPatterns": {
    "commonPhrases": ["phrase1", "phrase2"],
    "vocabularyLevel": "casual|professional|academic",
    "sentenceLength": "short|medium|long",
    "questionFrequency": 0.0-1.0,
    "interruptionTendency": 0.0-1.0
  },
  "communicationStyle": {
    "preferredTopics": ["topic1", "topic2"],
    "conversationRole": "leader|supporter|questioner|storyteller",
    "humorStyle": "witty|sarcastic|playful|dry|none"
  },
  "summary": "A brief personality summary"
}

Focus on linguistic patterns, emotional expression, and communication style.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert in personality analysis and psycholinguistics.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse JSON response
    const personalityData = JSON.parse(content);
    
    return {
      success: true,
      data: {
        speakerId,
        ...personalityData,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Personality analysis failed',
    };
  }
};

// OpenAI GPT-4 Chat Response Generation
export const generateChatResponse = async (
  request: ChatRequest
): Promise<APIResponse<ChatResponse>> => {
  try {
    const { message, personality, conversationHistory } = request;
    
    // Build personality prompt
    const personalityPrompt = `
You are roleplaying as a person with the following personality characteristics:

Personality Traits:
- Formality: ${personality.traits.formality * 100}% (0% = very casual, 100% = very formal)
- Emotionality: ${personality.traits.emotionality * 100}% (0% = logical, 100% = emotional)
- Enthusiasm: ${personality.traits.enthusiasm * 100}% (0% = calm, 100% = enthusiastic)
- Directness: ${personality.traits.directness * 100}% (0% = indirect, 100% = direct)
- Warmth: ${personality.traits.warmth * 100}% (0% = cold, 100% = warm)

Speech Patterns:
- Common phrases: ${personality.speechPatterns.commonPhrases.join(', ')}
- Vocabulary level: ${personality.speechPatterns.vocabularyLevel}
- Sentence length: ${personality.speechPatterns.sentenceLength}
- Question frequency: ${personality.speechPatterns.questionFrequency * 100}%

Communication Style:
- Conversation role: ${personality.communicationStyle.conversationRole}
- Preferred topics: ${personality.communicationStyle.preferredTopics.join(', ')}
- Humor style: ${personality.communicationStyle.humorStyle || 'none'}

Personality Summary: ${personality.summary}

IMPORTANT: Respond naturally in character, matching this personality profile. Use the speech patterns and communication style described above. Keep responses conversational and authentic to this personality.
`;

    // Build conversation context
    const messages = [
      { role: 'system', content: personalityPrompt },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response received from OpenAI');
    }

    return {
      success: true,
      data: {
        response: responseText,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Chat response generation failed',
    };
  }
};

// ElevenLabs Text-to-Speech
export const generateTTS = async (
  text: string,
  voiceId?: string
): Promise<APIResponse<string>> => {
  try {
    const defaultVoiceId = 'EXAVITQu4vr4xnSDxMaL'; // Bella voice
    const selectedVoiceId = voiceId || defaultVoiceId;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.ELEVENLABS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    return {
      success: true,
      data: audioUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'TTS generation failed',
    };
  }
};

// Voice Cloning with ElevenLabs
export const cloneVoice = async (
  audioFile: File,
  voiceName: string
): Promise<APIResponse<string>> => {
  try {
    const formData = new FormData();
    formData.append('files', audioFile);
    formData.append('name', voiceName);
    formData.append('description', `Cloned voice for ${voiceName}`);

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.ELEVENLABS_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.voice_id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Voice cloning failed',
    };
  }
};

// Upload audio file to a temporary URL for processing
export const uploadAudioFile = async (file: File): Promise<APIResponse<string>> => {
  try {
    // In a real implementation, you'd upload to your backend or cloud storage
    // For demo purposes, we'll create a blob URL
    const audioUrl = URL.createObjectURL(file);
    
    // In production, you might upload to AWS S3, Google Cloud Storage, etc.
    /*
    const formData = new FormData();
    formData.append('audio', file);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data.url,
    };
    */
    
    return {
      success: true,
      data: audioUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'File upload failed',
    };
  }
};

// Utility function to validate API keys
export const validateAPIKeys = (): { valid: boolean; missing: string[] } => {
  const missing: string[] = [];
  
  if (!API_CONFIG.ASSEMBLY_AI_KEY && !API_CONFIG.OPENAI_API_KEY) {
    missing.push('ASSEMBLY_AI_KEY or OPENAI_API_KEY');
  }
  
  if (!API_CONFIG.OPENAI_API_KEY) {
    missing.push('OPENAI_API_KEY');
  }
  
  if (!API_CONFIG.ELEVENLABS_API_KEY) {
    missing.push('ELEVENLABS_API_KEY');
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
};

// Environment setup instructions
export const getSetupInstructions = () => {
  return `
To use real API integration, create a .env file in your project root with:

REACT_APP_ASSEMBLY_AI_KEY=your_assembly_ai_key_here
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

API Key Setup:
1. AssemblyAI: Sign up at https://www.assemblyai.com/
2. OpenAI: Get API key at https://platform.openai.com/
3. ElevenLabs: Register at https://elevenlabs.io/

For production use, consider implementing these APIs on your backend 
to keep API keys secure and add rate limiting, authentication, etc.
`;
};

// Enhanced audio processor that uses real APIs
export const processAudioWithRealAPIs = async (
  audioFile: File,
  onProgress: (step: string, progress: number) => void
) => {
  try {
    // Step 1: Upload audio file
    onProgress('upload', 0);
    const uploadResult = await uploadAudioFile(audioFile);
    if (!uploadResult.success) {
      throw new Error(uploadResult.error);
    }
    onProgress('upload', 100);

    // Step 2: Speaker diarization
    onProgress('diarization', 0);
    const diarizationResult = await performSpeakerDiarization(uploadResult.data!);
    if (!diarizationResult.success) {
      throw new Error(diarizationResult.error);
    }
    onProgress('diarization', 100);

    // Step 3: Personality analysis for each speaker
    onProgress('analysis', 0);
    const speakers = diarizationResult.data!.speakers;
    const personalities = await Promise.all(
      speakers.map(async (speakerId) => {
        const speakerText = diarizationResult.data!.segments
          .filter(s => s.speakerId === speakerId)
          .map(s => s.text)
          .join(' ');
        
        const result = await analyzePersonalityWithGPT(speakerId, speakerText);
        return result.success ? result.data : null;
      })
    );
    onProgress('analysis', 100);

    // Step 4: Voice cloning (optional)
    onProgress('voice_cloning', 0);
    // This would require separating audio by speaker first
    // const voiceIds = await Promise.all(speakers.map(...));
    onProgress('voice_cloning', 100);

    return {
      segments: diarizationResult.data!.segments,
      speakers: speakers.map((speakerId, index) => ({
        speakerId,
        personality: personalities[index],
        // voiceId: voiceIds[index],
      })),
    };
  } catch (error) {
    throw new Error(`Real API processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
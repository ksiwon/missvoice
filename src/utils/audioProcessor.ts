// src/utils/audioProcessor.ts
import { AudioFile, ProcessingResult, ProcessingStep } from '../types';
import { getMockProcessingResult } from '../data/sampleAudioData';
import { analyzePersonality } from './personalityAnalyzer';

export const processAudioFile = async (
  audioFile: AudioFile,
  onProgress: (progress: Partial<ProcessingResult>) => void
): Promise<ProcessingResult> => {
  // 모의 데이터가 있는 샘플 파일인지 확인
  const mockResult = getMockProcessingResult(audioFile.id);
  if (mockResult) {
    // 데모를 위해 처리 과정 시뮬레이션
    return simulateProcessing(mockResult, onProgress);
  }

  // 실제 파일의 경우 실제 API 호출
  return processRealAudioFile(audioFile, onProgress);
};

const simulateProcessing = async (
  mockResult: ProcessingResult,
  onProgress: (progress: Partial<ProcessingResult>) => void
): Promise<ProcessingResult> => {
  const steps = mockResult.processingSteps.map(step => ({ ...step }));
  
  for (let i = 0; i < steps.length; i++) {
    const currentStep = steps[i];
    currentStep.status = 'processing';
    currentStep.startTime = new Date();
    
    onProgress({
      processingSteps: [...steps],
    });

    // 진행 상황 업데이트와 함께 처리 시간 시뮬레이션
    const duration = currentStep.estimatedTime || 30;
    const interval = duration / 10; // 단계당 10개의 진행 상황 업데이트
    
    for (let progress = 0; progress <= 100; progress += 10) {
      currentStep.progress = progress;
      onProgress({
        processingSteps: [...steps],
      });
      await new Promise(resolve => setTimeout(resolve, interval * 100)); // 데모를 위해 속도 향상
    }

    currentStep.status = 'completed';
    currentStep.endTime = new Date();
    currentStep.progress = 100;
    
    onProgress({
      processingSteps: [...steps],
    });
  }

  // 완료된 결과 반환
  return {
    ...mockResult,
    processingSteps: steps,
    isComplete: true,
  };
};

const processRealAudioFile = async (
  audioFile: AudioFile,
  onProgress: (progress: Partial<ProcessingResult>) => void
): Promise<ProcessingResult> => {
  const processingSteps: ProcessingStep[] = [
    {
      id: 'diarization',
      name: '화자 분리',
      status: 'processing',
      progress: 0,
      description: '오디오에서 서로 다른 화자를 식별하는 중...',
      estimatedTime: 30,
      startTime: new Date(),
    },
    {
      id: 'transcription',
      name: '음성을 텍스트로 변환',
      status: 'pending',
      progress: 0,
      description: '음성을 텍스트로 변환하는 중...',
      estimatedTime: 45,
    },
    {
      id: 'analysis',
      name: '성격 분석',
      status: 'pending',
      progress: 0,
      description: '말하기 패턴과 성격 특성을 분석하는 중...',
      estimatedTime: 60,
    },
    {
      id: 'preparation',
      name: 'AI 준비',
      status: 'pending',
      progress: 0,
      description: '대화를 위한 AI 모델을 준비하는 중...',
      estimatedTime: 20,
    },
  ];

  try {
    // 1단계: 화자 분리
    const diarizationResult = await performDiarization(audioFile, (progress) => {
      processingSteps[0].progress = progress;
      onProgress({ processingSteps: [...processingSteps] });
    });

    processingSteps[0].status = 'completed';
    processingSteps[0].endTime = new Date();
    processingSteps[1].status = 'processing';
    processingSteps[1].startTime = new Date();

    // 2단계: 음성을 텍스트로 변환
    const transcriptionResult = await performTranscription(audioFile, diarizationResult.segments, (progress) => {
      processingSteps[1].progress = progress;
      onProgress({ processingSteps: [...processingSteps] });
    });

    processingSteps[1].status = 'completed';
    processingSteps[1].endTime = new Date();
    processingSteps[2].status = 'processing';
    processingSteps[2].startTime = new Date();

    // 3단계: 성격 분석
    const speakers = await Promise.all(
      diarizationResult.speakers.map(async (speakerId) => {
        const speakerTranscript = transcriptionResult.transcript
          .filter(entry => entry.speakerId === speakerId)
          .map(entry => entry.text)
          .join(' ');

        const personality = await analyzePersonality(speakerId, speakerTranscript);
        
        return {
          speakerId,
          segments: diarizationResult.segments.filter(s => s.speakerId === speakerId),
          personality,
        };
      })
    );

    processingSteps[2].status = 'completed';
    processingSteps[2].endTime = new Date();
    processingSteps[3].status = 'processing';
    processingSteps[3].startTime = new Date();

    // 4단계: AI 준비 (시뮬레이션)
    await new Promise(resolve => setTimeout(resolve, 2000));

    processingSteps[3].status = 'completed';
    processingSteps[3].endTime = new Date();
    processingSteps[3].progress = 100;

    const result: ProcessingResult = {
      audioFile,
      speakers,
      transcript: transcriptionResult.transcript,
      processingSteps,
      isComplete: true,
    };

    return result;
  } catch (error) {
    throw new Error(`처리 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};

const performDiarization = async (
  audioFile: AudioFile,
  onProgress: (progress: number) => void
): Promise<{ segments: any[], speakers: string[] }> => {
  // 실제 구현에서는 AssemblyAI 또는 유사한 서비스를 호출할 것입니다
  // 지금은 지연과 함께 모의 데이터를 반환합니다
  
  for (let i = 0; i <= 100; i += 10) {
    onProgress(i);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return {
    segments: [
      { start: 0, end: 30, speakerId: 'speaker_1' },
      { start: 30, end: 60, speakerId: 'speaker_2' },
      { start: 60, end: 90, speakerId: 'speaker_1' },
    ],
    speakers: ['speaker_1', 'speaker_2'],
  };
};

const performTranscription = async (
  audioFile: AudioFile,
  segments: any[],
  onProgress: (progress: number) => void
): Promise<{ transcript: any[] }> => {
  // 실제 구현에서는 OpenAI Whisper 또는 유사한 서비스를 호출할 것입니다
  
  for (let i = 0; i <= 100; i += 10) {
    onProgress(i);
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return {
    transcript: [
      {
        id: 'trans_1',
        speakerId: 'speaker_1',
        text: '안녕하세요, 이것은 샘플 전사입니다.',
        startTime: 0,
        endTime: 30,
        confidence: 0.95,
      },
      {
        id: 'trans_2',
        speakerId: 'speaker_2',
        text: '이것은 다른 화자의 응답입니다.',
        startTime: 30,
        endTime: 60,
        confidence: 0.92,
      },
    ],
  };
};
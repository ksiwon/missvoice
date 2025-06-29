// src/data/sampleAudioData.ts
import { SampleAudioFile, ProcessingResult } from '../types';

export const sampleAudioFiles: SampleAudioFile[] = [
  {
    id: 'business-meeting',
    name: '비즈니스 미팅 토론',
    description: '두 전문가가 분기 실적과 전략 계획에 대해 논의',
    url: '/samples/business-meeting.m4a',
    duration: 180, // 3분
    speakers: 2,
    category: 'business',
    preview: {
      transcript: 'A: 좋은 아침입니다. 오늘 참석해 주셔서 감사합니다. 3분기 실적에 대해 살펴보겠습니다... B: 네, 분석 보고서를 준비했습니다. 전환율이 크게 개선되었습니다...',
      speakerSummaries: [
        '분석적 접근 방식을 가진 직설적이고 결과 지향적인 매니저',
        '강력한 프레젠테이션 스킬을 가진 열정적인 팀원'
      ]
    }
  },
  {
    id: 'friends-chat',
    name: '친구들 일상 대화',
    description: '두 친구가 안부를 묻고 주말 이야기를 나누는 대화',
    url: '/samples/friends-chat.m4a',
    duration: 240, // 4분
    speakers: 2,
    category: 'casual',
    preview: {
      transcript: 'A: 안녕! 주말 어땠어? B: 아, 정말 믿을 수 없는 일이 있었어! 시내 새로 생긴 레스토랑에 갔는데...',
      speakerSummaries: [
        '사려 깊은 질문을 하는 따뜻하고 호기심 많은 친구',
        '표현력이 풍부한 소통 스타일을 가진 생동감 있는 이야기꾼'
      ]
    }
  },
  {
    id: 'customer-service',
    name: '고객 서비스 통화',
    description: '고객 지원 담당자가 고객의 청구서 문의를 도와주는 통화',
    url: '/samples/customer-service.m4a',
    duration: 300, // 5분
    speakers: 2,
    category: 'customer_service',
    preview: {
      transcript: 'A: 전화 주셔서 감사합니다. 어떻게 도와드릴까요? B: 안녕하세요, 이번 달 청구서에 대해 문의사항이 있습니다...',
      speakerSummaries: [
        '해결책 중심 접근법을 가진 전문적이고 인내심 있는 지원 담당자',
        '명확한 설명과 도움을 찾는 걱정하는 고객'
      ]
    }
  }
];

// 샘플 파일의 모의 처리 결과
export const mockBusinessMeetingResult: ProcessingResult = {
  audioFile: {
    id: 'business-meeting',
    name: '비즈니스 미팅 토론',
    file: null,
    url: '/samples/business-meeting.m4a',
    duration: 180,
    size: 0,
    type: 'audio/mp4',
  },
  speakers: [
    {
      speakerId: 'speaker_1',
      name: '매니저 알렉스',
      segments: [
        { start: 0, end: 15, speakerId: 'speaker_1', text: '좋은 아침입니다. 오늘 참석해 주셔서 감사합니다. 3분기 실적에 대해 살펴보겠습니다.', confidence: 0.95 },
        { start: 45, end: 60, speakerId: 'speaker_1', text: '이 수치들이 유망해 보입니다. 전환율 개선의 원동력은 무엇인가요?', confidence: 0.92 },
      ],
      personality: {
        speakerId: 'speaker_1',
        traits: {
          formality: 0.8,
          emotionality: 0.3,
          enthusiasm: 0.6,
          directness: 0.9,
          warmth: 0.5,
        },
        speechPatterns: {
          commonPhrases: ['살펴보겠습니다', '원동력은 무엇인가요', '이 수치들', '앞으로 나아가며'],
          vocabularyLevel: 'professional',
          sentenceLength: 'medium',
          questionFrequency: 0.7,
          interruptionTendency: 0.2,
        },
        communicationStyle: {
          preferredTopics: ['비즈니스 지표', '전략', '성과 분석'],
          conversationRole: 'leader',
          humorStyle: 'dry',
        },
        summary: '알렉스는 명확하고 목적의식을 가지고 소통하는 결과 지향적인 매니저입니다. 데이터 기반 토론을 선호하며 때때로 건조한 유머를 섞은 직접적이고 전문적인 말하기 스타일을 가지고 있습니다.',
      },
    },
    {
      speakerId: 'speaker_2',
      name: '분석가 제이미',
      segments: [
        { start: 15, end: 45, speakerId: 'speaker_2', text: '네, 맞습니다! 분석 보고서를 준비했습니다. 이번 분기 전환율이 23% 개선되었습니다.', confidence: 0.91 },
        { start: 60, end: 85, speakerId: 'speaker_2', text: '주요 요인은 새로운 이메일 캠페인과 웹사이트 리디자인입니다. 사용자들의 참여도가 훨씬 높아졌어요!', confidence: 0.89 },
      ],
      personality: {
        speakerId: 'speaker_2',
        traits: {
          formality: 0.6,
          emotionality: 0.7,
          enthusiasm: 0.9,
          directness: 0.7,
          warmth: 0.8,
        },
        speechPatterns: {
          commonPhrases: ['네, 맞습니다!', '주요 요인은', '사용자들의 참여도가', '정말 흥미진진해요'],
          vocabularyLevel: 'professional',
          sentenceLength: 'medium',
          questionFrequency: 0.4,
          interruptionTendency: 0.1,
        },
        communicationStyle: {
          preferredTopics: ['분석', '사용자 행동', '캠페인 성과'],
          conversationRole: 'supporter',
          humorStyle: 'playful',
        },
        summary: '제이미는 대화에 에너지와 세부적인 통찰력을 가져다주는 열정적인 분석가입니다. 특히 긍정적인 결과와 데이터 트렌드를 논의할 때 따뜻함과 흥분으로 소통합니다.',
      },
    },
  ],
  transcript: [
    {
      id: 'trans_1',
      speakerId: 'speaker_1',
      text: '좋은 아침입니다. 오늘 참석해 주셔서 감사합니다. 3분기 실적에 대해 살펴보겠습니다.',
      startTime: 0,
      endTime: 15,
      confidence: 0.95,
    },
    {
      id: 'trans_2',
      speakerId: 'speaker_2',
      text: '네, 맞습니다! 분석 보고서를 준비했습니다. 이번 분기 전환율이 23% 개선되었습니다.',
      startTime: 15,
      endTime: 45,
      confidence: 0.91,
    },
  ],
  processingSteps: [
    {
      id: 'diarization',
      name: '화자 분리',
      status: 'completed',
      progress: 100,
      description: '2명의 화자를 성공적으로 식별했습니다',
      startTime: new Date(Date.now() - 120000),
      endTime: new Date(Date.now() - 90000),
    },
    {
      id: 'transcription',
      name: '음성을 텍스트로 변환',
      status: 'completed',
      progress: 100,
      description: '92% 신뢰도로 전사가 완료되었습니다',
      startTime: new Date(Date.now() - 90000),
      endTime: new Date(Date.now() - 45000),
    },
    {
      id: 'analysis',
      name: '성격 분석',
      status: 'completed',
      progress: 100,
      description: '성격 프로필이 생성되었습니다',
      startTime: new Date(Date.now() - 45000),
      endTime: new Date(Date.now() - 10000),
    },
    {
      id: 'preparation',
      name: 'AI 준비',
      status: 'completed',
      progress: 100,
      description: 'AI 모델이 대화를 위해 준비되었습니다',
      startTime: new Date(Date.now() - 10000),
      endTime: new Date(),
    },
  ],
  isComplete: true,
};

export const mockFriendsResult: ProcessingResult = {
  audioFile: {
    id: 'friends-chat',
    name: '친구들 일상 대화',
    file: null,
    url: '/samples/friends-chat.m4a',
    duration: 240,
    size: 0,
    type: 'audio/mp4',
  },
  speakers: [
    {
      speakerId: 'speaker_1',
      name: '샘',
      segments: [
        { start: 0, end: 8, speakerId: 'speaker_1', text: '안녕! 주말 어땠어?', confidence: 0.96 },
        { start: 45, end: 55, speakerId: 'speaker_1', text: '정말이야! 모든 걸 말해줘!', confidence: 0.94 },
      ],
      personality: {
        speakerId: 'speaker_1',
        traits: {
          formality: 0.2,
          emotionality: 0.6,
          enthusiasm: 0.7,
          directness: 0.5,
          warmth: 0.9,
        },
        speechPatterns: {
          commonPhrases: ['정말이야!', '모든 걸 말해줘', '정말 멋져 보여', '재밌겠다!'],
          vocabularyLevel: 'casual',
          sentenceLength: 'short',
          questionFrequency: 0.8,
          interruptionTendency: 0.3,
        },
        communicationStyle: {
          preferredTopics: ['개인적인 이야기', '주말 활동', '인간관계', '경험'],
          conversationRole: 'questioner',
          humorStyle: 'playful',
        },
        summary: '샘은 다른 사람들의 경험을 듣는 것을 좋아하는 따뜻하고 호기심 많은 친구입니다. 많은 질문을 하고 개인적인 이야기에 열정과 진정한 관심으로 반응합니다.',
      },
    },
    {
      speakerId: 'speaker_2',
      name: '조던',
      segments: [
        { start: 8, end: 45, speakerId: 'speaker_2', text: '아, 정말 믿을 수 없는 일이 있었어! 시내 새로 생긴 레스토랑에 갔는데...', confidence: 0.88 },
        { start: 55, end: 85, speakerId: 'speaker_2', text: '정말 놀라웠어! 음식이 정말 맛있었고 거기서 대학 룸메이트를 우연히 만났어!', confidence: 0.90 },
      ],
      personality: {
        speakerId: 'speaker_2',
        traits: {
          formality: 0.1,
          emotionality: 0.8,
          enthusiasm: 0.9,
          directness: 0.6,
          warmth: 0.8,
        },
        speechPatterns: {
          commonPhrases: ['아, 정말', '믿을 수 없을 거야', '정말 놀라웠어', '사실'],
          vocabularyLevel: 'casual',
          sentenceLength: 'long',
          questionFrequency: 0.3,
          interruptionTendency: 0.1,
        },
        communicationStyle: {
          preferredTopics: ['개인적인 경험', '음식', '사회적 만남', '모험'],
          conversationRole: 'storyteller',
          humorStyle: 'witty',
        },
        summary: '조던은 친구들과 흥미진진한 경험을 공유하는 것을 좋아하는 생동감 있는 이야기꾼입니다. 높은 에너지와 생생한 묘사로 소통하며, 종종 자신의 이야기 세부사항에 빠져들곤 합니다.',
      },
    },
  ],
  transcript: [],
  processingSteps: [],
  isComplete: true,
};

export const getMockProcessingResult = (audioFileId: string): ProcessingResult | null => {
  switch (audioFileId) {
    case 'business-meeting':
      return mockBusinessMeetingResult;
    case 'friends-chat':
      return mockFriendsResult;
    case 'customer-service':
      // 여기에 더 많은 모의 결과를 추가할 수 있습니다
      return null;
    default:
      return null;
  }
};
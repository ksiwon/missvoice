// src/utils/personalityAnalyzer.ts
import { PersonalityProfile } from '../types';

export const analyzePersonality = async (
  speakerId: string,
  transcript: string
): Promise<PersonalityProfile> => {
  // 실제 구현에서는 분석을 위해 OpenAI GPT-4를 사용할 것입니다
  // 지금은 전사 특성을 기반으로 한 모의 성격을 반환합니다
  
  const wordCount = transcript.split(' ').length;
  const questionCount = (transcript.match(/\?/g) || []).length;
  const exclamationCount = (transcript.match(/!/g) || []).length;
  const sentenceCount = transcript.split(/[.!?]+/).length;
  
  // 데모를 위한 간단한 휴리스틱
  const enthusiasm = Math.min(exclamationCount / sentenceCount * 2, 1);
  const questionFrequency = questionCount / sentenceCount;
  const averageSentenceLength = wordCount / sentenceCount;
  
  return {
    speakerId,
    traits: {
      formality: transcript.includes('부탁드립니다') || transcript.includes('감사합니다') ? 0.7 : 0.3,
      emotionality: enthusiasm,
      enthusiasm,
      directness: transcript.includes('생각해요') || transcript.includes('아마도') ? 0.4 : 0.8,
      warmth: transcript.includes('좋아요') || transcript.includes('멋져요') ? 0.8 : 0.5,
    },
    speechPatterns: {
      commonPhrases: extractCommonPhrases(transcript),
      vocabularyLevel: averageSentenceLength > 15 ? 'professional' : 'casual',
      sentenceLength: averageSentenceLength > 20 ? 'long' : averageSentenceLength > 10 ? 'medium' : 'short',
      questionFrequency,
      interruptionTendency: 0.3, // 기본값
    },
    communicationStyle: {
      preferredTopics: extractTopics(transcript),
      conversationRole: questionFrequency > 0.3 ? 'questioner' : enthusiasm > 0.5 ? 'storyteller' : 'supporter',
      humorStyle: transcript.includes('하하') || transcript.includes('재밌어') ? 'playful' : undefined,
    },
    summary: generatePersonalitySummary(transcript, speakerId),
  };
};

const extractCommonPhrases = (transcript: string): string[] => {
  // 간단한 문구 추출 - 실제 구현에서는 더 정교한 NLP 사용
  const phrases = [
    '생각해요', '알아요', '사실', '기본적으로', '확실히',
    '맞아요', '완전히', '정말', '꽤', '아주'
  ];
  
  return phrases.filter(phrase => 
    transcript.toLowerCase().includes(phrase.toLowerCase())
  ).slice(0, 4);
};

const extractTopics = (transcript: string): string[] => {
  // 키워드를 기반으로 한 간단한 주제 추출
  const topicKeywords = {
    '비즈니스': ['매출', '판매', '회의', '전략', '성과'],
    '기술': ['소프트웨어', '앱', '웹사이트', '디지털', '온라인'],
    '개인적인': ['주말', '가족', '친구', '집', '휴가'],
    '음식': ['레스토랑', '음식', '저녁', '요리', '식사'],
  };
  
  const detectedTopics: string[] = [];
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => transcript.toLowerCase().includes(keyword))) {
      detectedTopics.push(topic);
    }
  });
  
  return detectedTopics.length > 0 ? detectedTopics : ['일반 대화'];
};

const generatePersonalitySummary = (transcript: string, speakerId: string): string => {
  // 분석을 기반으로 한 간단한 요약 생성
  const enthusiasm = (transcript.match(/!/g) || []).length;
  const questions = (transcript.match(/\?/g) || []).length;
  const wordCount = transcript.split(' ').length;
  
  let summary = `화자 ${speakerId}는 `;
  
  if (enthusiasm > 2) {
    summary += '높은 에너지와 열정으로 소통합니다. ';
  } else {
    summary += '차분하고 신중한 소통 스타일을 가지고 있습니다. ';
  }
  
  if (questions > 2) {
    summary += '많은 질문을 하며 다른 사람들에 대한 호기심을 보입니다. ';
  }
  
  if (wordCount > 100) {
    summary += '자세한 설명을 제공하고 포괄적인 생각을 공유하는 경향이 있습니다.';
  } else {
    summary += '간결한 소통을 선호하며 요점을 바로 전달합니다.';
  }
  
  return summary;
};
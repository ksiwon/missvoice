// src/utils/aiResponseGenerator.ts
import { ChatRequest, ChatResponse } from '../types';

export const generateAIResponse = async (request: ChatRequest): Promise<ChatResponse> => {
  // 실제 구현에서는 OpenAI GPT-4 API를 호출할 것입니다
  // 지금은 성격 특성을 기반으로 응답을 생성합니다
  
  const { message, personality } = request;
  
  // API 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const response = generatePersonalizedResponse(message, personality);
  
  // 실제 구현에서는 ElevenLabs를 사용하여 TTS 오디오도 생성할 것입니다
  // const audioUrl = await generateTTS(response, personality.speakerId);
  
  return {
    response,
    // audioUrl, // 실제 구현에서는 포함될 것입니다
  };
};

const generatePersonalizedResponse = (message: string, personality: any): string => {
  const { traits, speechPatterns, communicationStyle } = personality;
  
  // 성격을 기반으로 한 간단한 응답 생성
  let response = '';
  
  // 성격 기반 시작 문구 추가
  if (traits.enthusiasm > 0.7) {
    response += ['와! ', '정말 멋지네요! ', '맞아요! '][Math.floor(Math.random() * 3)];
  } else if (traits.formality > 0.7) {
    response += ['그렇군요. ', '흥미롭네요. ', '말씀해 주셔서 감사합니다. '][Math.floor(Math.random() * 3)];
  }
  
  // 메시지 내용을 기반으로 한 주요 응답 추가
  if (message.toLowerCase().includes('어떻게') || message.toLowerCase().includes('무엇') || message.toLowerCase().includes('뭐')) {
    if (communicationStyle.conversationRole === 'storyteller') {
      response += '그것에 대한 제 경험을 말씀드릴게요. ';
    } else if (communicationStyle.conversationRole === 'questioner') {
      response += '좋은 질문이네요! 그런 생각을 하게 된 계기가 있나요? ';
    } else {
      response += '그건 몇 가지 요인에 따라 달라질 것 같아요. ';
    }
  } else {
    response += '무슨 말씀인지 알겠어요. ';
  }
  
  // 성격 기반 문구 추가
  if (speechPatterns.commonPhrases.length > 0) {
    const randomPhrase = speechPatterns.commonPhrases[Math.floor(Math.random() * speechPatterns.commonPhrases.length)];
    if (Math.random() > 0.5) {
      response += `${randomPhrase}, `;
    }
  }
  
  // 친밀감을 기반으로 한 마무리
  if (traits.warmth > 0.7) {
    response += '어떻게 생각하세요?';
  } else if (traits.directness > 0.7) {
    response += '질문에 답이 되었나요?';
  } else {
    response += '도움이 되었으면 좋겠어요!';
  }
  
  return response;
};
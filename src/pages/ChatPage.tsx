// src/pages/ChatPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Container,
  Heading2,
  Heading3,
  Text,
  Button,
  Card,
  Flex,
  Input,
  Badge,
} from '../components/ui/StyledComponents';
import FaIcon from '../components/ui/FaIcon';
import { useAudio } from '../contexts/AudioContext';

const ChatContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
`;

const ChatHeader = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const ChatMain = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;
`;

const Sidebar = styled.div`
  width: 300px;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    position: absolute;
    height: 100%;
    z-index: 200;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const SpeakersList = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
`;

const SpeakerCard = styled(Card)<{ $active?: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${({ theme, $active }) => 
    $active ? theme.colors.primary : 'transparent'
  };
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  ${({ $active, theme }) => $active && `
    background: rgba(99, 102, 241, 0.05);
  `}
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 70%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  align-self: ${({ $isUser }) => $isUser ? 'flex-end' : 'flex-start'};
  
  ${({ theme, $isUser }) => $isUser ? `
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
    color: white;
    border-bottom-right-radius: ${theme.borderRadius.sm};
  ` : `
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-bottom-left-radius: ${theme.borderRadius.sm};
  `}
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const InputArea = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const MessageInput = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-end;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
`;

const MobileToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    processingResult,
    chatSessions,
    activeChatSession,
    startChatWithSpeaker,
    sendMessage,
    switchChatSession,
    closeChatSession,
  } = useAudio();
  
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!processingResult?.isComplete) {
      navigate('/upload');
      return;
    }
  }, [processingResult, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatSession?.messages]);

  const handleSpeakerSelect = (speakerId: string) => {
    try {
      startChatWithSpeaker(speakerId);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || isSending || !activeChatSession) return;

    setIsSending(true);
    try {
      await sendMessage(messageText.trim());
      setMessageText('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSpeakerAvatar = (speakerId: string, index: number) => {
    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'];
    return colors[index % colors.length];
  };

  if (!processingResult?.isComplete) {
    return null;
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <Container>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="1rem">
              <MobileToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
                <FaIcon name="bars" size="lg" />
              </MobileToggle>

              <div>
                <Heading2 style={{ marginBottom: '0.25rem' }}>
                  AI 대화
                </Heading2>
                <Text style={{ marginBottom: 0 }}>
                  오디오 속 화자들과 AI 대화를 나눠보세요
                </Text>
              </div>
            </Flex>

            <Flex align="center" gap="1rem">
              {activeChatSession && (
                <Badge variant="success">
                  <FaIcon name="user" />
                  {activeChatSession.speakerName}
                </Badge>
              )}

              <Button 
                variant="outline"
                onClick={() => navigate('/processing')}
              >
                <FaIcon name="upload" />
                새 오디오
              </Button>
            </Flex>
          </Flex>
        </Container>
      </ChatHeader>

      <ChatMain>
        <Sidebar className={sidebarOpen ? 'open' : ''}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
            <Heading3 style={{ marginBottom: '0.5rem' }}>사용 가능한 화자</Heading3>
            <Text style={{ marginBottom: 0, fontSize: '0.875rem' }}>
              채팅을 시작할 화자를 선택하세요
            </Text>
          </div>

          <SpeakersList>
            {processingResult.speakers.map((speaker, index) => (
              <SpeakerCard
                key={speaker.speakerId}
                $active={activeChatSession?.speakerId === speaker.speakerId}
                onClick={() => handleSpeakerSelect(speaker.speakerId)}
              >
                <Flex gap="1rem">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: getSpeakerAvatar(speaker.speakerId, index),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.25rem',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '0.5rem' }}>
                      <Heading3 style={{ marginBottom: 0, fontSize: '1rem' }}>
                        {speaker.name || `화자 ${index + 1}`}
                      </Heading3>

                      {chatSessions.find(s => s.speakerId === speaker.speakerId) && (
                        <Badge variant="success">활성</Badge>
                      )}
                    </Flex>

                    {speaker.personality && (
                      <Text style={{ 
                        marginBottom: 0, 
                        fontSize: '0.8rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {speaker.personality.summary}
                      </Text>
                    )}
                  </div>
                </Flex>
              </SpeakerCard>
            ))}
          </SpeakersList>

          <div style={{ padding: '1.5rem', borderTop: '1px solid #334155' }}>
            <Text className="small" style={{ marginBottom: '1rem' }}>
              활성 채팅 세션: {chatSessions.length}
            </Text>

            {chatSessions.map((session) => (
              <Flex key={session.id} justify="space-between" align="center" style={{ marginBottom: '0.5rem' }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    switchChatSession(session.id);
                    setSidebarOpen(false);
                  }}
                  style={{ 
                    justifyContent: 'flex-start',
                    flex: 1,
                    color: activeChatSession?.id === session.id ? '#6366f1' : 'inherit'
                  }}
                >
                  <FaIcon name="message" />
                  {session.speakerName}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => closeChatSession(session.id)}
                >
                  <FaIcon name="times" />
                </Button>
              </Flex>
            ))}
          </div>
        </Sidebar>

        <ChatArea>
          {activeChatSession ? (
            <>
              <MessagesContainer>
                {activeChatSession.messages.length === 0 ? (
                  <EmptyState>
                    <div>
                      <FaIcon name="comments" size="3x" color="#64748b" />
                      <Heading3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                        대화를 시작해보세요
                      </Heading3>
                      <Text>
                        {activeChatSession.speakerName}에게 인사를 건네보세요!
                      </Text>
                    </div>
                  </EmptyState>
                ) : (
                  activeChatSession.messages.map((message) => (
                    <MessageBubble key={message.id} $isUser={message.role === 'user'}>
                      <MessageHeader>
                        <FaIcon 
                          name={message.role === 'user' ? 'user' : 'robot'} 
                          size="sm" 
                        />
                        <Text style={{ fontSize: '0.75rem', marginBottom: 0, opacity: 0.8 }}>
                          {message.role === 'user' ? '나' : activeChatSession.speakerName}
                        </Text>
                        <Text style={{ fontSize: '0.75rem', marginBottom: 0, opacity: 0.6 }}>
                          {formatTime(message.timestamp)}
                        </Text>
                      </MessageHeader>

                      <Text style={{ marginBottom: 0, lineHeight: 1.5 }}>
                        {message.content}
                      </Text>

                      {message.audioUrl && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <Button variant="ghost" size="sm">
                            <FaIcon name="play" />
                            오디오 재생
                          </Button>
                        </div>
                      )}
                    </MessageBubble>
                  ))
                )}
                <div ref={messagesEndRef} />
              </MessagesContainer>

              <InputArea>
                <MessageInput>
                  <Input
                    ref={inputRef}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`${activeChatSession.speakerName}에게 메시지...`}
                    disabled={isSending}
                    style={{ flex: 1 }}
                  />

                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || isSending}
                    loading={isSending}
                  >
                    <FaIcon name="paper-plane" />
                  </Button>
                </MessageInput>

                <Text className="small" style={{ marginTop: '0.5rem', marginBottom: 0, textAlign: 'center', opacity: 0.7 }}>
                  AI 응답은 오디오에서 분석된 화자의 성격을 기반으로 생성됩니다
                </Text>
              </InputArea>
            </>
          ) : (
            <EmptyState>
              <div>
                <FaIcon name="users" size="3x" color="#64748b" />
                <Heading3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                  대화할 화자를 선택하세요
                </Heading3>
                <Text style={{ marginBottom: '2rem' }}>
                  총 {processingResult.speakers.length}명의 화자 중에서 대화를 시작할 수 있습니다
                </Text>

                <Flex justify="center" gap="1rem" wrap>
                  {processingResult.speakers.slice(0, 2).map((speaker, index) => (
                    <Button
                      key={speaker.speakerId}
                      variant="outline"
                      onClick={() => handleSpeakerSelect(speaker.speakerId)}
                    >
                      {speaker.name || `화자 ${index + 1}`}와 채팅하기
                    </Button>
                  ))}
                </Flex>
              </div>
            </EmptyState>
          )}
        </ChatArea>
      </ChatMain>

      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 150,
            display: 'none'
          }}
          className="tablet-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </ChatContainer>
  );
};

export default ChatPage;
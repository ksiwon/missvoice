// src/pages/ProcessingPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Container,
  Section,
  Heading2,
  Heading3,
  Text,
  Button,
  Card,
  Flex,
  ProgressBar,
  Badge,
  Spinner,
} from '../components/ui/StyledComponents';
import FaIcon from '../components/ui/FaIcon';
import { useAudio } from '../contexts/AudioContext';

const ProcessingSection = styled(Section)`
  min-height: 80vh;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const StepCard = styled(Card)<{ $status: 'pending' | 'processing' | 'completed' | 'error' }>`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  transition: all 0.3s ease;
  border-left: 4px solid ${({ theme, $status }) => {
    switch ($status) {
      case 'completed':
        return theme.colors.success;
      case 'processing':
        return theme.colors.primary;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.border;
    }
  }};
  
  ${({ $status }) => $status === 'processing' && `
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.15);
  `}
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const StepIcon = styled.div<{ $status: 'pending' | 'processing' | 'completed' | 'error' }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: ${({ theme }) => theme.spacing.md};
  
  ${({ theme, $status }) => {
    switch ($status) {
      case 'completed':
        return `
          background: ${theme.colors.success};
          color: white;
        `;
      case 'processing':
        return `
          background: ${theme.colors.primary};
          color: white;
        `;
      case 'error':
        return `
          background: ${theme.colors.error};
          color: white;
        `;
      default:
        return `
          background: ${theme.colors.border};
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const ResultCard = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.05) 0%, 
    rgba(6, 182, 212, 0.05) 100%
  );
  border: 1px solid rgba(16, 185, 129, 0.2);
`;

const SpeakerCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const PersonalityTrait = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TraitBar = styled.div<{ $value: number }>`
  width: 100px;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $value }) => $value * 100}%;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.secondary}, ${({ theme }) => theme.colors.primary});
    border-radius: inherit;
  }
`;

const ProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentAudio, 
    processingResult, 
    isProcessing, 
    startProcessing, 
    resetProcessing 
  } = useAudio();
  
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!currentAudio) {
      navigate('/upload');
      return;
    }
  }, [currentAudio, navigate]);

  useEffect(() => {
    if (processingResult?.isComplete && !isProcessing) {
      // Auto-navigate to chat after processing completes
      const timer = setTimeout(() => {
        navigate('/chat');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [processingResult?.isComplete, isProcessing, navigate]);

  const handleStartProcessing = async () => {
    setHasStarted(true);
    try {
      await startProcessing();
    } catch (error) {
      console.error('Processing failed:', error);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FaIcon name="check" />;
      case 'processing':
        return <Spinner size="sm" />;
      case 'error':
        return <FaIcon name="times" />;
      default:
        return <FaIcon name="times" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'processing':
        return <Badge variant="default">Processing...</Badge>;
      case 'error':
        return <Badge variant="error">Error</Badge>;
      default:
        return <Badge variant="default">Pending</Badge>;
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString();
  };

  const formatDuration = (start?: Date, end?: Date) => {
    if (!start || !end) return '';
    const duration = Math.round((end.getTime() - start.getTime()) / 1000);
    return `${duration}s`;
  };

  if (!currentAudio) {
    return null;
  }

  return (
    <ProcessingSection>
      <Container>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Heading2>오디오 처리 중</Heading2>
            <Text className="large">
              오디오를 인터랙티브한 AI 화자로 변환하고 있습니다
            </Text>
          </div>

          <Card style={{ marginBottom: '2rem' }}>
            <Flex align="center" gap="1rem">
              <FaIcon name="file-audio" size="lg" color="#6366f1" />
              <div style={{ flex: 1 }}>
                <Heading3 style={{ marginBottom: '0.25rem' }}>
                  {currentAudio.name}
                </Heading3>
                <Text style={{ marginBottom: 0 }}>
                  AI 처리를 준비했습니다
                </Text>
              </div>

              {!hasStarted && !isProcessing && (
                <Button 
                  size="lg"
                  onClick={handleStartProcessing}
                >
                  <FaIcon name="magic" />
                  처리 시작
                </Button>
              )}

              {hasStarted && !processingResult?.isComplete && (
                <Button 
                  variant="outline"
                  onClick={resetProcessing}
                >
                  <FaIcon name="refresh" />
                  초기화
                </Button>
              )}
            </Flex>
          </Card>

          {hasStarted && processingResult && (
            <>
              {processingResult.processingSteps.map((step) => (
                <StepCard key={step.id} $status={step.status} className="fade-in">
                  <StepHeader>
                    <Flex align="center" style={{ flex: 1 }}>
                      <StepIcon $status={step.status}>
                        {getStepIcon(step.status)}
                      </StepIcon>
                      <div style={{ flex: 1 }}>
                        <Flex justify="space-between" align="center" style={{ marginBottom: '0.5rem' }}>
                          <Heading3 style={{ marginBottom: 0 }}>
                            {step.name}
                          </Heading3>
                          {getStatusBadge(step.status)}
                        </Flex>
                        <Text style={{ marginBottom: 0 }}>
                          {step.description}
                        </Text>
                      </div>
                    </Flex>
                  </StepHeader>

                  {step.status === 'processing' && (
                    <div style={{ marginBottom: '1rem' }}>
                      <ProgressBar progress={step.progress} />
                      <Flex justify="space-between" style={{ marginTop: '0.5rem' }}>
                        <Text className="small" style={{ marginBottom: 0 }}>
                          {step.progress}% 완료
                        </Text>
                        {step.estimatedTime && (
                          <Text className="small" style={{ marginBottom: 0 }}>
                            약 {step.estimatedTime}초 남음
                          </Text>
                        )}
                      </Flex>
                    </div>
                  )}

                  {step.status === 'completed' && (
                    <Flex gap="2rem" wrap>
                      {step.startTime && (
                        <Text className="small" style={{ marginBottom: 0 }}>
                          <strong>시작:</strong> {formatTime(step.startTime)}
                        </Text>
                      )}
                      {step.endTime && (
                        <Text className="small" style={{ marginBottom: 0 }}>
                          <strong>완료:</strong> {formatTime(step.endTime)}
                        </Text>
                      )}
                      {step.startTime && step.endTime && (
                        <Text className="small" style={{ marginBottom: 0 }}>
                          <strong>소요 시간:</strong> {formatDuration(step.startTime, step.endTime)}
                        </Text>
                      )}
                    </Flex>
                  )}

                  {step.status === 'error' && step.error && (
                    <Text style={{ color: '#ef4444', marginBottom: 0 }}>
                      오류: {step.error}
                    </Text>
                  )}
                </StepCard>
              ))}

              {processingResult.isComplete && processingResult.speakers.length > 0 && (
                <ResultCard className="fade-in">
                  <Flex align="center" gap="1rem" style={{ marginBottom: '2rem' }}>
                    <FaIcon name="check" size="2x" color="#10b981" />
                    <div>
                      <Heading2 style={{ color: '#10b981', marginBottom: '0.5rem' }}>
                        처리 완료!
                      </Heading2>
                      <Text style={{ marginBottom: 0 }}>
                        총 발견된 화자 수: {processingResult.speakers.length}명. AI 화자와 대화를 시작해보세요.
                      </Text>
                    </div>
                  </Flex>

                  <div style={{ marginBottom: '2rem' }}>
                    <Heading3 style={{ marginBottom: '1rem' }}>
                      감지된 화자
                    </Heading3>
                    
                    {processingResult.speakers.map((speaker, index) => (
                      <SpeakerCard key={speaker.speakerId}>
                        <Flex gap="1.5rem">
                          <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${index % 2 === 0 ? '#6366f1' : '#8b5cf6'}, ${index % 2 === 0 ? '#8b5cf6' : '#06b6d4'})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                          }}>
                            {index + 1}
                          </div>
                          
                          <div style={{ flex: 1 }}>
                            <Heading3 style={{ marginBottom: '0.5rem' }}>
                              {speaker.name || `화자 ${index + 1}`}
                            </Heading3>
                            
                            {speaker.personality && (
                              <>
                                <Text style={{ marginBottom: '1rem' }}>
                                  {speaker.personality.summary}
                                </Text>
                                
                                <div>
                                  <Text style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                                    주요 성격 특성:
                                  </Text>
                                  
                                  {Object.entries(speaker.personality.traits).map(([trait, value]) => (
                                    <PersonalityTrait key={trait}>
                                      <Text className="small" style={{ marginBottom: 0, textTransform: 'capitalize' }}>
                                        {trait.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                      </Text>
                                      <TraitBar $value={value} />
                                    </PersonalityTrait>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </Flex>
                      </SpeakerCard>
                    ))}
                  </div>

                  <Flex justify="center" gap="1rem" wrap>
                    <Button 
                      size="lg"
                      onClick={() => navigate('/chat')}
                    >
                      <FaIcon name="comments" />
                      대화 시작하기
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={resetProcessing}
                    >
                      <FaIcon name="upload" />
                      새 오디오 처리
                    </Button>
                  </Flex>
                  
                  <Text className="small" style={{ textAlign: 'center', marginTop: '1rem', marginBottom: 0 }}>
                    잠시 후 채팅 페이지로 자동 이동됩니다...
                  </Text>
                </ResultCard>
              )}

              {processingResult.error && (
                <Card style={{
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  marginTop: '2rem'
                }}>
                  <Flex align="center" gap="1rem">
                    <FaIcon name="error" size="2x" color="#ef4444" />
                    <div>
                      <Heading3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>
                        처리 실패
                      </Heading3>
                      <Text style={{ marginBottom: '1rem' }}>
                        {processingResult.error}
                      </Text>
                      <Button 
                        variant="outline"
                        onClick={resetProcessing}
                      >
                        <FaIcon name="refresh" />
                        다시 시도하기
                      </Button>
                    </div>
                  </Flex>
                </Card>
              )}
            </>
          )}
        </div>
      </Container>
    </ProcessingSection>
  );
};

export default ProcessingPage;
// src/pages/SamplePage.tsx
import React, { useState } from 'react';
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
  Grid,
  Badge,
} from '../components/ui/StyledComponents';
import FaIcon from '../components/ui/FaIcon';
import { useAudio } from '../contexts/AudioContext';
import { sampleAudioFiles } from '../data/sampleAudioData';

const SampleCard = styled(Card)<{ $selected?: boolean }>`
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 2px solid ${({ theme, $selected }) => 
    $selected ? theme.colors.primary : 'transparent'
  };
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  ${({ $selected, theme }) => $selected && `
    background: rgba(99, 102, 241, 0.05);
    box-shadow: ${theme.shadows.md};
  `}
`;

const CategoryBadge = styled(Badge)`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const PlayButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 1);
    transform: scale(1.1);
  }
`;

const AudioControls = styled.div`
  margin: ${({ theme }) => theme.spacing.md} 0;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const WaveformPlaceholder = styled.div`
  height: 60px;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.primary}20 0%, 
    ${({ theme }) => theme.colors.accent}20 50%, 
    ${({ theme }) => theme.colors.primary}20 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin: ${({ theme }) => theme.spacing.sm} 0;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 8px,
      rgba(255, 255, 255, 0.1) 8px,
      rgba(255, 255, 255, 0.1) 12px
    );
  }
`;

const PreviewSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(30, 41, 59, 0.5);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
`;

const SpeakerPreview = styled.div`
  margin: ${({ theme }) => theme.spacing.md} 0;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 3px solid ${({ theme }) => theme.colors.secondary};
`;

const SamplePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectSampleAudio, currentAudio } = useAudio();
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business':
        return 'default';
      case 'casual':
        return 'success';
      case 'customer_service':
        return 'warning';
      case 'interview':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business':
        return 'briefcase';
      case 'casual':
        return 'user-friends';
      case 'customer_service':
        return 'headphones';
      case 'interview':
        return 'microphone';
      default:
        return 'file-audio';
    }
  };

  const handleSampleSelect = async (sampleId: string) => {
    setSelectedSample(sampleId);
    setIsLoading(true);
    
    try {
      await selectSampleAudio(sampleId);
    } catch (error) {
      console.error('Failed to select sample:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = (sampleId: string, audioUrl: string) => {
    // In a real implementation, this would control audio playback
    setPlayingAudio(playingAudio === sampleId ? null : sampleId);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Section style={{ minHeight: '80vh' }}>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Heading2>샘플 대화를 선택하세요</Heading2>
          <Text className="large">
            미리 준비된 오디오 샘플을 선택하여 AI 대화 기능을 빠르게 체험해보세요
          </Text>
        </div>

        <Grid columns={1} gap="2rem" minWidth="100%">
          {sampleAudioFiles.map((sample) => (
            <SampleCard
              key={sample.id}
              $selected={selectedSample === sample.id}
              onClick={() => handleSampleSelect(sample.id)}
            >
              <PlayButton
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayAudio(sample.id, sample.url);
                }}
              >
                <FaIcon 
                  name={playingAudio === sample.id ? 'pause' : 'play'} 
                />
              </PlayButton>
              
              <CategoryBadge variant={getCategoryColor(sample.category)}>
                <FaIcon name={getCategoryIcon(sample.category) as any} />
                {sample.category.replace('_', ' ')}
              </CategoryBadge>

              <div style={{ paddingTop: '3rem' }}>
                <Flex justify="space-between" align="flex-start" gap="1rem" style={{ marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <Heading3 style={{ marginBottom: '0.5rem' }}>
                      {sample.name}
                    </Heading3>
                    <Text style={{ marginBottom: '1rem' }}>
                      {sample.description}
                    </Text>
                  </div>
                </Flex>

                <Flex gap="2rem" wrap style={{ marginBottom: '1rem' }}>
                  <Flex align="center" gap="0.5rem">
                    <FaIcon name="users" />
                    <Text className="small" style={{ marginBottom: 0 }}>
                      {sample.speakers}명 화자
                    </Text>
                  </Flex>
                  <Flex align="center" gap="0.5rem">
                    <FaIcon name="times" />
                    <Text className="small" style={{ marginBottom: 0 }}>
                      {formatDuration(sample.duration)}
                    </Text>
                  </Flex>
                </Flex>

                {playingAudio === sample.id && (
                  <AudioControls className="fade-in">
                    <Flex align="center" gap="1rem">
                      <FaIcon name="volume-up" />
                      <WaveformPlaceholder />
                      <Text className="small" style={{ marginBottom: 0 }}>
                        {formatDuration(sample.duration)}
                      </Text>
                    </Flex>
                  </AudioControls>
                )}

                {sample.preview && (
                  <PreviewSection>
                    <Heading3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                      대화 미리보기
                    </Heading3>
                    
                    <Text className="small" style={{ 
                      fontStyle: 'italic', 
                      marginBottom: '1rem',
                      lineHeight: 1.6 
                    }}>
                      "{sample.preview.transcript}"
                    </Text>
                    
                    <div>
                      <Text style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                        화자 성격 요약:
                      </Text>
                      {sample.preview.speakerSummaries.map((summary, index) => (
                        <SpeakerPreview key={index}>
                          <Flex align="center" gap="0.5rem" style={{ marginBottom: '0.25rem' }}>
                            <FaIcon name="user" size="sm" />
                            <Text style={{ 
                              fontWeight: 600, 
                              marginBottom: 0,
                              fontSize: '0.875rem'
                            }}>
                              화자 {index + 1}
                            </Text>
                          </Flex>
                          <Text style={{ 
                            fontSize: '0.8rem', 
                            marginBottom: 0,
                            color: '#cbd5e1'
                          }}>
                            {summary}
                          </Text>
                        </SpeakerPreview>
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {selectedSample === sample.id && (
                  <div className="fade-in" style={{ marginTop: '1.5rem' }}>
                    <Flex justify="space-between" align="center" gap="1rem">
                      <Flex align="center" gap="0.5rem">
                        <FaIcon name="check" color="#10b981" />
                        <Text style={{ color: '#10b981', marginBottom: 0, fontWeight: 600 }}>
                          샘플이 선택되었습니다
                        </Text>
                      </Flex>
                      
                      <Button
                        size="lg"
                        loading={isLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/processing');
                        }}
                      >
                        <FaIcon name="magic" />
                        {isLoading ? '불러오는 중...' : '처리 시작'}
                      </Button>
                    </Flex>
                  </div>
                )}
              </div>
            </SampleCard>
          ))}
        </Grid>

        {!currentAudio && (
          <Card style={{ 
            marginTop: '3rem', 
            textAlign: 'center',
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <Flex align="center" justify="center" gap="1rem" direction="column">
              <FaIcon name="info" size="2x" color="#6366f1" />
              <div>
                <Heading3 style={{ marginBottom: '0.5rem' }}>
                  직접 녹음한 오디오를 사용하고 싶으신가요?
                </Heading3>
                <Text style={{ marginBottom: '1rem' }}>
                  직접 녹음한 대화 파일을 업로드하여 처리할 수 있습니다
                </Text>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/upload')}
                >
                  <FaIcon name="upload" />
                  오디오 업로드
                </Button>
              </div>
            </Flex>
          </Card>
        )}
      </Container>
    </Section>
  );
};

export default SamplePage;
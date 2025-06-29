// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Container,
  Section,
  Heading1,
  Heading2,
  Heading3,
  Text,
  Button,
  Card,
  Flex,
  Grid,
} from '../components/ui/StyledComponents';
import FaIcon from '../components/ui/FaIcon';

const HeroSection = styled(Section)`
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.1) 0%, 
    rgba(139, 92, 246, 0.1) 50%, 
    rgba(6, 182, 212, 0.1) 100%
  );
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: 120px 0;
  }
`;

const FeatureCard = styled(Card)`
  text-align: center;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  color: white;
  font-size: 2rem;
`;

const StepCard = styled(Card)`
  position: relative;
  transition: all 0.3s ease;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  
  &:hover {
    transform: translateX(8px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const StepNumber = styled.div`
  position: absolute;
  top: -15px;
  left: -15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.125rem;
`;

const CTASection = styled(Section)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  text-align: center;
  
  h2, p {
    color: white;
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'waveform',
      title: 'Advanced Speaker Separation',
      description: 'Our AI automatically identifies and separates different speakers in your audio recordings with high accuracy.',
    },
    {
      icon: 'brain',
      title: 'Personality Analysis',
      description: 'Deep learning algorithms analyze speech patterns, tone, and communication style to create detailed personality profiles.',
    },
    {
      icon: 'robot',
      title: 'AI Voice Cloning',
      description: 'Generate realistic voice responses that match each speaker\'s unique characteristics and speaking style.',
    },
    {
      icon: 'comments',
      title: 'Interactive Conversations',
      description: 'Chat with AI versions of each speaker, complete with their personality traits and communication patterns.',
    },
  ];

  const steps = [
    {
      title: 'Upload Your Audio',
      description: 'Upload a conversation recording or choose from our sample files to get started.',
      icon: 'upload',
    },
    {
      title: 'AI Processing',
      description: 'Our advanced AI separates speakers, transcribes speech, and analyzes personality traits.',
      icon: 'magic',
    },
    {
      title: 'Review Results',
      description: 'Explore the generated speaker profiles and personality analysis results.',
      icon: 'analytics',
    },
    {
      title: 'Start Chatting',
      description: 'Begin conversations with AI versions of each speaker from your recording.',
      icon: 'message',
    },
  ];

  return (
    <>
      <HeroSection>
        <Container>
          <Heading1>대화를 인터랙티브 AI로 바꿔보세요</Heading1>
          <Text className="large" style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.25rem' }}>
            대화 녹음을 업로드하면 AI가 화자의 특성을 반영한 챗봇을 생성합니다.
          </Text>
          <Flex justify="center" gap="1rem" wrap>
            <Button size="lg" onClick={() => navigate('/upload')}>
              <FaIcon name="upload" />
              시작하기
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/samples')}>
              <FaIcon name="play" />
              샘플 체험하기
            </Button>
          </Flex>
        </Container>
      </HeroSection>

      <Section>
        <Container>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Heading2>강력한 AI 기능</Heading2>
            <Text className="large">
              최신 대화형 AI 기술을 직접 경험해보세요.
            </Text>
          </div>

          <Grid columns={2} gap="2rem" minWidth="300px">
            {features.map((feature, index) => (
              <FeatureCard key={index} variant="elevated">
                <FeatureIcon>
                  <FaIcon name={feature.icon as any} size="2x" />
                </FeatureIcon>
                <Heading3>{feature.title}</Heading3>
                <Text>{feature.description}</Text>
              </FeatureCard>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
        <Container>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Heading2>이용 방법</Heading2>
            <Text className="large">
              오디오 업로드부터 AI 대화까지, 단 4단계면 충분합니다.
            </Text>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {steps.map((step, index) => (
              <StepCard key={index} style={{ marginBottom: '1.5rem' }}>
                <StepNumber>{index + 1}</StepNumber>
                <Flex align="flex-start" gap="1.5rem">
                  <div style={{ 
                    minWidth: '60px', 
                    height: '60px', 
                    borderRadius: '12px',
                    background: `rgba(99, 102, 241, 0.1)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '8px'
                  }}>
                    <FaIcon name={step.icon as any} size="xl" color="#6366f1" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Heading3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                      {step.title}
                    </Heading3>
                    <Text style={{ marginBottom: 0 }}>
                      {step.description}
                    </Text>
                  </div>
                </Flex>
              </StepCard>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection>
        <Container>
          <Heading2>지금 바로 시작해보세요!</Heading2>
          <Text className="large" style={{ marginBottom: '2rem' }}>
            대화 녹음을 업로드하고 AI 음성 상호작용의 마법을 체험해보세요.
          </Text>
          <Flex justify="center" gap="1rem" wrap>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/upload')}
              style={{ background: 'white', color: '#6366f1', border: 'none' }}
            >
              <FaIcon name="cloud-upload" />
              오디오 파일 업로드
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/samples')}
              style={{ borderColor: 'white', color: 'white', background: 'transparent' }}
            >
              <FaIcon name="file-audio" />
              샘플 둘러보기
            </Button>
          </Flex>
        </Container>
      </CTASection>
    </>
  );
}

export default HomePage;
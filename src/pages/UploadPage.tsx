// src/pages/UploadPage.tsx
import React, { useState, useRef, useCallback } from 'react';
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
} from '../components/ui/StyledComponents';
import FaIcon from '../components/ui/FaIcon';
import { useAudio } from '../contexts/AudioContext';

const UploadSection = styled(Section)`
  min-height: 70vh;
  display: flex;
  align-items: center;
`;

const DropZone = styled.div<{ $isDragOver: boolean; $hasFile: boolean }>`
  border: 2px dashed ${({ theme, $isDragOver, $hasFile }) => 
    $hasFile ? theme.colors.success : 
    $isDragOver ? theme.colors.primary : 
    theme.colors.border
  };
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  transition: all 0.3s ease;
  background: ${({ theme, $isDragOver }) => 
    $isDragOver ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
  };
  cursor: pointer;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(99, 102, 241, 0.02);
  }
`;

const FileInfo = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing.lg};
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
`;

const HiddenInput = styled.input`
  display: none;
`;

const RequirementsCard = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { uploadAudio, currentAudio } = useAudio();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['mp3', 'wav', 'm4a', 'mp4', 'flac', 'ogg'];
  const maxFileSize = 100 * 1024 * 1024; // 100MB

  const validateFile = (file: File): string | null => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!extension || !supportedFormats.includes(extension)) {
      return `Unsupported file format. Please use: ${supportedFormats.join(', ')}`;
    }
    
    if (file.size > maxFileSize) {
      return 'File size must be less than 100MB';
    }
    
    if (file.size < 1024) {
      return 'File seems too small to be a valid audio file';
    }
    
    return null;
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setUploadError(null);
    
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    try {
      await uploadAudio(file);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadAudio]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <UploadSection>
      <Container>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Heading2>오디오 파일 업로드</Heading2>
            <Text className="large">
              대화 녹음을 업로드하여 AI 화자를 생성해보세요
            </Text>
          </div>

          <DropZone
            $isDragOver={isDragOver}
            $hasFile={!!currentAudio}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
          >
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept={supportedFormats.map(format => `.${format}`).join(',')}
              onChange={handleFileInputChange}
            />

            {currentAudio ? (
              <div className="fade-in">
                <FaIcon name="check" size="3x" color="#10b981" />
                <Heading3 style={{ color: '#10b981', marginTop: '1rem' }}>
                  파일 업로드 완료!
                </Heading3>
                <Text>다른 파일을 선택하려면 클릭하세요</Text>
              </div>
            ) : (
              <div>
                <FaIcon 
                  name={isDragOver ? "cloud-upload" : "upload"} 
                  size="3x" 
                  color={isDragOver ? "#6366f1" : "#64748b"} 
                />
                <Heading3 style={{ marginTop: '1rem' }}>
                  {isDragOver ? '여기에 파일을 놓으세요' : '오디오 파일을 드래그 앤 드롭하세요'}
                </Heading3>
                <Text>
                  또는 <span style={{ color: '#6366f1', fontWeight: 600 }}>클릭하여 찾아보기</span>
                </Text>
                <Text className="small" style={{ marginTop: '0.5rem' }}>
                  지원 포맷: {supportedFormats.join(', ')} (최대 100MB)
                </Text>
              </div>
            )}
          </DropZone>

          {uploadError && (
            <Card 
              style={{ 
                marginTop: '1rem',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)' 
              }}
            >
              <Flex align="center" gap="0.5rem">
                <FaIcon name="error" color="#ef4444" />
                <Text style={{ color: '#ef4444', marginBottom: 0 }}>
                  {uploadError}
                </Text>
              </Flex>
            </Card>
          )}

          {currentAudio && (
            <FileInfo className="fade-in">
              <Flex justify="space-between" align="flex-start" gap="1rem">
                <div style={{ flex: 1 }}>
                  <Flex align="center" gap="0.75rem" style={{ marginBottom: '0.5rem' }}>
                    <FaIcon name="file-audio" size="lg" color="#10b981" />
                    <Heading3 style={{ marginBottom: 0, color: '#10b981' }}>
                      {currentAudio.name}
                    </Heading3>
                  </Flex>
                  
                  <Flex gap="1.5rem" wrap>
                    <Text className="small" style={{ marginBottom: 0 }}>
                      <strong>크기:</strong> {formatFileSize(currentAudio.size)}
                    </Text>
                    {currentAudio.duration && (
                      <Text className="small" style={{ marginBottom: 0 }}>
                        <strong>길이:</strong> {formatDuration(currentAudio.duration)}
                      </Text>
                    )}
                    <Text className="small" style={{ marginBottom: 0 }}>
                      <strong>형식:</strong> {currentAudio.type}
                    </Text>
                  </Flex>
                </div>
                
                <Button 
                  size="lg"
                  onClick={() => navigate('/processing')}
                >
                  <FaIcon name="magic" />
                  오디오 처리
                </Button>
              </Flex>
            </FileInfo>
          )}

          <RequirementsCard>
            <Heading3>오디오 요구사항</Heading3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <Text style={{ fontWeight: 600, marginBottom: '0.75rem' }}>
                최상의 결과를 위해 다음 조건을 충족하세요:
              </Text>
              
              <RequirementItem>
                <FaIcon name="check" color="#10b981" />
                <Text style={{ marginBottom: 0 }}>
                  <strong>다수의 화자</strong> – 최소 두 명 이상이 대화
                </Text>
              </RequirementItem>
              
              <RequirementItem>
                <FaIcon name="check" color="#10b981" />
                <Text style={{ marginBottom: 0 }}>
                  <strong>명확한 음질</strong> – 배경 소음이 거의 없음
                </Text>
              </RequirementItem>
              
              <RequirementItem>
                <FaIcon name="check" color="#10b981" />
                <Text style={{ marginBottom: 0 }}>
                  <strong>충분한 길이</strong> – 화자당 최소 1~2분
                </Text>
              </RequirementItem>
              
              <RequirementItem>
                <FaIcon name="check" color="#10b981" />
                <Text style={{ marginBottom: 0 }}>
                  <strong>자연스러운 대화</strong> – 다양한 말투와 흐름
                </Text>
              </RequirementItem>
            </div>

            <Flex justify="space-between" align="center" wrap gap="1rem">
              <Text className="small" style={{ marginBottom: 0 }}>
                녹음 파일이 없으신가요? 샘플 대화를 체험해보세요.
              </Text>
              <Button 
                variant="outline" 
                onClick={() => navigate('/samples')}
              >
                <FaIcon name="file-audio" />
                샘플 둘러보기
              </Button>
            </Flex>
          </RequirementsCard>
        </div>
      </Container>
    </UploadSection>
  );
};

export default UploadPage;
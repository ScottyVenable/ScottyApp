export type AudioNoteStatus = 'idle' | 'recording' | 'playing' | 'paused';

export interface AudioNote {
  id: string;
  title: string;
  filePath: string;
  duration: number;
  fileSize: number;
  createdAt: string;
  tags: string[];
  transcript?: string;
}

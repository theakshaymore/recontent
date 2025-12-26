export interface TranscriptionJobData {
  videoId: string;
  youtubeUrl: string;
  userId: string;
}

export interface ContentJobData {
  videoId: string;
  userId: string;
  transcript: string;
  videoTitle: string;
}

export interface ThumbnailJobData extends ContentJobData {
  mainTopic: string;
}

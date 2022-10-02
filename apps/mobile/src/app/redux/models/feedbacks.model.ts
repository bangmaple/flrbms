interface FeedbackFilterResponse {
  id: string;
  status: string;
  createdByName: string;
  feedbackTypeName: string;
  createdBy: string;
  createdAt: string;
  rejectedBy: string;
  rejectedAt: string;
  resolvedAt: string;
  resolvedBy: string;
  rateNum?: number;
  roomName?: string;
}

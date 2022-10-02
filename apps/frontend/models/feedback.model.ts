export interface Feedback {
  feedbackType: string;
  replyMess: string;
  id?: string;
  feedbackMess?: string;
  status?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdBy: string;
  createdAt: string;
  deletedAt: string;
  deletedBy: string;
  rejectedBy: string;
  rejectedAt: string;
}

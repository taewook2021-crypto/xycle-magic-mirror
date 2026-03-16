export type AppRole = "admin" | "student";

export interface Subject {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface Topic {
  id: string;
  subject_id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface SubTopic {
  id: string;
  topic_id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface Book {
  id: string;
  subject_id: string;
  title: string;
  author: string | null;
  display_order: number;
  created_at: string;
}

export interface Chapter {
  id: string;
  book_id: string;
  title: string;
  chapter_number: number;
  display_order: number;
  created_at: string;
}

export interface Question {
  id: string;
  chapter_id: string;
  sub_topic_id: string | null;
  question_number: number;
  correct_answer: number;
  created_at: string;
}

export interface Attempt {
  id: string;
  user_id: string;
  question_id: string;
  student_answer: number;
  is_correct: boolean;
  attempted_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

// Joined types for common queries
export interface QuestionWithContext extends Question {
  chapter?: Chapter & { book?: Book };
  sub_topic?: SubTopic & { topic?: Topic };
}

export interface AttemptWithQuestion extends Attempt {
  question?: QuestionWithContext;
}

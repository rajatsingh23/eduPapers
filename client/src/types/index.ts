
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  university?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface QuestionPaper {
  _id: string;
  title: string;
  description: string;
  subject: string;
  course: string;
  year: number;
  semester: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: User | string;
  university?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  forgot: (email: string) => Promise<void>;
  reset: (token: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

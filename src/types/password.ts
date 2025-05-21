
export interface PasswordEntry {
  id: string;
  user_id: string;
  title: string;
  username: string;
  password: string;
  url?: string | null;
  notes?: string | null;
  category: string;
  favorite: boolean;
  strength_score: number;
  last_updated: string;
  created_at: string;
}

export interface CreatePasswordDto {
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category: string;
  favorite?: boolean;
  strength_score: number;
  user_id: string;
}

export interface UpdatePasswordDto {
  title?: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  category?: string;
  favorite?: boolean;
  strength_score?: number;
}

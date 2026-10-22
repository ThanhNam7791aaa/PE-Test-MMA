export type Genre = 'Fiction' | 'Non-Fiction' | 'Academic' | 'Other';
export type Status = 'To Read' | 'Reading' | 'Finished';

export interface Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  genre: Genre;
  status: Status;
  rating: number | null;
  favorite: boolean;
  notes: string;
  createdAt?: any;
}

export interface BookFormData {
  title: string;
  author: string;
  genre: string;
  status: string;
  rating?: string | number | null;
  notes?: string;
  favorite?: boolean;
}

export interface BookFormErrors {
  title?: string;
  author?: string;
  genre?: string;
  status?: string;
  rating?: string;
  notes?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  List: undefined;
  Detail: { bookId: string };
};

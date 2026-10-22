import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthContext } from './AuthContext';
import { Book, BookFormData, Genre, Status } from '../types';

export interface BookContextType {
  books: Book[];
  loading: boolean;
  addBook: (bookData: BookFormData) => Promise<string>;
  toggleFavorite: (bookId: string, currentFavorite: boolean) => Promise<void>;
  updateBook: (bookId: string, updatedData: BookFormData) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
}

export const BookContext = createContext<BookContextType>({} as BookContextType);

interface BookProviderProps {
  children: ReactNode;
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to generate a unique doc ID per user + title + author
  const getBookDocId = (userId: string, title: string, author: string): string => {
    const cleanTitle = title.trim().toLowerCase().replace(/[^a-z0-9]/gi, '_');
    const cleanAuthor = author.trim().toLowerCase().replace(/[^a-z0-9]/gi, '_');
    return `${userId}_${cleanTitle}_${cleanAuthor}`;
  };

  useEffect(() => {
    if (!user) {
      setBooks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'books'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookList: Book[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        bookList.push({
          id: docSnap.id,
          userId: data.userId,
          title: data.title,
          author: data.author,
          genre: data.genre as Genre,
          status: data.status as Status,
          rating: data.rating !== undefined && data.rating !== null ? Number(data.rating) : null,
          favorite: Boolean(data.favorite),
          notes: data.notes || '',
          createdAt: data.createdAt,
        });
      });

      // Sort alphabetically by title (not case-sensitive; equal titles ordered by author)
      bookList.sort((a, b) => {
        const titleA = (a.title || '').trim().toLowerCase();
        const titleB = (b.title || '').trim().toLowerCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;

        const authorA = (a.author || '').trim().toLowerCase();
        const authorB = (b.author || '').trim().toLowerCase();
        if (authorA < authorB) return -1;
        if (authorA > authorB) return 1;
        return 0;
      });

      setBooks(bookList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching books:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Add a new book with duplicate check (case-insensitive title + author)
  const addBook = async (bookData: BookFormData): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const cleanTitle = (bookData.title || '').trim().toLowerCase();
    const cleanAuthor = (bookData.author || '').trim().toLowerCase();

    // Check duplicate in current user's books
    const isDuplicate = books.some(
      (b) => (b.title || '').trim().toLowerCase() === cleanTitle &&
             (b.author || '').trim().toLowerCase() === cleanAuthor
    );

    if (isDuplicate) {
      throw new Error('A book with this title and author already exists.');
    }

    const docId = getBookDocId(user.uid, bookData.title, bookData.author);
    const docRef = doc(db, 'books', docId);

    const newBook = {
      userId: user.uid,
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      genre: bookData.genre,
      status: bookData.status,
      rating: bookData.rating !== '' && bookData.rating !== undefined && bookData.rating !== null ? Number(bookData.rating) : null,
      favorite: Boolean(bookData.favorite || false),
      notes: (bookData.notes || '').trim(),
      createdAt: serverTimestamp(),
    };

    await setDoc(docRef, newBook);
    return docId;
  };

  // Toggle favorite
  const toggleFavorite = async (bookId: string, currentFavorite: boolean): Promise<void> => {
    if (!user) return;
    const docRef = doc(db, 'books', bookId);
    await updateDoc(docRef, {
      favorite: !currentFavorite,
    });
  };

  // Update book
  const updateBook = async (bookId: string, updatedData: BookFormData): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const docRef = doc(db, 'books', bookId);
    const cleanTitle = (updatedData.title || '').trim().toLowerCase();
    const cleanAuthor = (updatedData.author || '').trim().toLowerCase();

    // Check duplicate if title or author changed
    const isDuplicate = books.some(
      (b) => b.id !== bookId &&
             (b.title || '').trim().toLowerCase() === cleanTitle &&
             (b.author || '').trim().toLowerCase() === cleanAuthor
    );

    if (isDuplicate) {
      throw new Error('A book with this title and author already exists.');
    }

    const payload = {
      title: updatedData.title.trim(),
      author: updatedData.author.trim(),
      genre: updatedData.genre,
      status: updatedData.status,
      rating: updatedData.rating !== '' && updatedData.rating !== undefined && updatedData.rating !== null ? Number(updatedData.rating) : null,
      favorite: Boolean(updatedData.favorite || false),
      notes: (updatedData.notes || '').trim(),
    };

    await updateDoc(docRef, payload);
  };

  // Delete book
  const deleteBook = async (bookId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    const docRef = doc(db, 'books', bookId);
    await deleteDoc(docRef);
  };

  return (
    <BookContext.Provider value={{
      books,
      loading,
      addBook,
      toggleFavorite,
      updateBook,
      deleteBook,
    }}>
      {children}
    </BookContext.Provider>
  );
};

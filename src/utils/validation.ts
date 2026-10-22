import { BookFormData, BookFormErrors, Genre, Status } from '../types';

export const validateEmail = (email: string): string => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validatePassword = (password: string, isRegister = false): string => {
  if (!password || password === '') {
    return 'Password is required';
  }
  if (isRegister && password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return '';
};

export const validateConfirmPassword = (confirmPassword: string, password: string): string => {
  if (!confirmPassword || confirmPassword === '') {
    return 'Confirm password is required';
  }
  if (confirmPassword !== password) {
    return 'Passwords do not match';
  }
  return '';
};

export const validateBookForm = ({ title, author, genre, status, rating, notes }: BookFormData): BookFormErrors => {
  const errors: BookFormErrors = {};

  // Title validation
  if (!title || title.trim() === '') {
    errors.title = 'Title is required';
  } else if (title.trim().length > 100) {
    errors.title = 'Title must be at most 100 characters';
  }

  // Author validation
  if (!author || author.trim() === '') {
    errors.author = 'Author is required';
  } else if (author.trim().length > 60) {
    errors.author = 'Author must be at most 60 characters';
  }

  // Genre validation
  const validGenres: Genre[] = ['Fiction', 'Non-Fiction', 'Academic', 'Other'];
  if (!genre || !validGenres.includes(genre as Genre)) {
    errors.genre = 'Please choose a genre';
  }

  // Status validation
  const validStatuses: Status[] = ['To Read', 'Reading', 'Finished'];
  if (!status || !validStatuses.includes(status as Status)) {
    errors.status = 'Please choose a status';
  }

  // Rating validation (optional)
  if (rating !== undefined && rating !== null && rating !== '') {
    const num = Number(rating);
    if (!Number.isInteger(num) || num < 0 || num > 5) {
      errors.rating = 'Rating must be a whole number from 0 to 5';
    }
  }

  // Notes validation (optional)
  if (notes && notes.length > 300) {
    errors.notes = 'Notes must be at most 300 characters';
  }

  return errors;
};

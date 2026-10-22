import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { BookContext } from '../context/BookContext';
import { validateBookForm } from '../utils/validation';
import { BookFormErrors, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route, navigation }: Props) {
  const { bookId } = route.params;
  const { books, updateBook, deleteBook, toggleFavorite } = useContext(BookContext);

  const book = books.find((b) => b.id === bookId);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Form states for editing
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [formErrors, setFormErrors] = useState<BookFormErrors>({});
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [editError, setEditError] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  // Initialize form with book values
  useEffect(() => {
    if (book) {
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setGenre(book.genre || '');
      setStatus(book.status || '');
      setRating(book.rating !== null && book.rating !== undefined ? String(book.rating) : '');
      setNotes(book.notes || '');
    }
  }, [book]);

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Book not found or has been deleted.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Live validation on change in Edit mode
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (formSubmitted) {
      const errs = validateBookForm({ title: val, author, genre, status, rating, notes });
      setFormErrors((prev) => ({ ...prev, title: errs.title || '' }));
    }
  };

  const handleAuthorChange = (val: string) => {
    setAuthor(val);
    if (formSubmitted) {
      const errs = validateBookForm({ title, author: val, genre, status, rating, notes });
      setFormErrors((prev) => ({ ...prev, author: errs.author || '' }));
    }
  };

  const handleGenreChange = (val: string) => {
    setGenre(val);
    if (formSubmitted) {
      const errs = validateBookForm({ title, author, genre: val, status, rating, notes });
      setFormErrors((prev) => ({ ...prev, genre: errs.genre || '' }));
    }
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    if (formSubmitted) {
      const errs = validateBookForm({ title, author, genre, status: val, rating, notes });
      setFormErrors((prev) => ({ ...prev, status: errs.status || '' }));
    }
  };

  const handleRatingChange = (val: string) => {
    setRating(val);
    if (formSubmitted) {
      const errs = validateBookForm({ title, author, genre, status, rating: val, notes });
      setFormErrors((prev) => ({ ...prev, rating: errs.rating || '' }));
    }
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    if (formSubmitted) {
      const errs = validateBookForm({ title, author, genre, status, rating, notes: val });
      setFormErrors((prev) => ({ ...prev, notes: errs.notes || '' }));
    }
  };

  const handleCancelEdit = () => {
    setTitle(book.title || '');
    setAuthor(book.author || '');
    setGenre(book.genre || '');
    setStatus(book.status || '');
    setRating(book.rating !== null && book.rating !== undefined ? String(book.rating) : '');
    setNotes(book.notes || '');
    setFormSubmitted(false);
    setFormErrors({});
    setEditError('');
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    setFormSubmitted(true);
    setEditError('');

    const errors = validateBookForm({ title, author, genre, status, rating, notes });
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSaving(true);
    try {
      await updateBook(book.id, {
        title,
        author,
        genre,
        status,
        rating,
        notes,
        favorite: book.favorite,
      });
      setIsEditing(false);
      setFormSubmitted(false);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update book');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Book',
      `Are you sure you want to delete "${book.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(book.id);
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete book');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Navigation & Favorite Header */}
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.favoriteBtn} 
            onPress={() => toggleFavorite(book.id, Boolean(book.favorite))}
          >
            <Ionicons 
              name={book.favorite ? "star" : "star-outline"} 
              size={28} 
              color={book.favorite ? "#EAB308" : "#94A3B8"} 
            />
          </TouchableOpacity>
        </View>

        {isEditing ? (
          /* ================= EDIT MODE ================= */
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Edit Book</Text>

            {editError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorTextCustom}>{editError}</Text>
              </View>
            ) : null}

            {/* Title */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Title *</Text>
              <TextInput
                style={[styles.input, formSubmitted && formErrors.title ? styles.inputError : null]}
                value={title}
                onChangeText={handleTitleChange}
              />
              {formSubmitted && formErrors.title ? (
                <Text style={styles.errorText}>{formErrors.title}</Text>
              ) : null}
            </View>

            {/* Author */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Author *</Text>
              <TextInput
                style={[styles.input, formSubmitted && formErrors.author ? styles.inputError : null]}
                value={author}
                onChangeText={handleAuthorChange}
              />
              {formSubmitted && formErrors.author ? (
                <Text style={styles.errorText}>{formErrors.author}</Text>
              ) : null}
            </View>

            {/* Genre */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Genre *</Text>
              <View style={[styles.pickerWrapper, formSubmitted && formErrors.genre ? styles.inputError : null]}>
                <Picker
                  selectedValue={genre}
                  onValueChange={handleGenreChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Choose genre" value="" />
                  <Picker.Item label="Fiction" value="Fiction" />
                  <Picker.Item label="Non-Fiction" value="Non-Fiction" />
                  <Picker.Item label="Academic" value="Academic" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
              {formSubmitted && formErrors.genre ? (
                <Text style={styles.errorText}>{formErrors.genre}</Text>
              ) : null}
            </View>

            {/* Status */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Status *</Text>
              <View style={[styles.pickerWrapper, formSubmitted && formErrors.status ? styles.inputError : null]}>
                <Picker
                  selectedValue={status}
                  onValueChange={handleStatusChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Choose status" value="" />
                  <Picker.Item label="To Read" value="To Read" />
                  <Picker.Item label="Reading" value="Reading" />
                  <Picker.Item label="Finished" value="Finished" />
                </Picker>
              </View>
              {formSubmitted && formErrors.status ? (
                <Text style={styles.errorText}>{formErrors.status}</Text>
              ) : null}
            </View>

            {/* Rating */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Rating (0-5, Optional)</Text>
              <TextInput
                style={[styles.input, formSubmitted && formErrors.rating ? styles.inputError : null]}
                value={rating}
                onChangeText={handleRatingChange}
                keyboardType="numeric"
              />
              {formSubmitted && formErrors.rating ? (
                <Text style={styles.errorText}>{formErrors.rating}</Text>
              ) : null}
            </View>

            {/* Notes */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea, formSubmitted && formErrors.notes ? styles.inputError : null]}
                value={notes}
                onChangeText={handleNotesChange}
                multiline
                numberOfLines={3}
              />
              {formSubmitted && formErrors.notes ? (
                <Text style={styles.errorText}>{formErrors.notes}</Text>
              ) : null}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.saveBtn]} 
                onPress={handleSaveEdit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.cancelBtn]} 
                onPress={handleCancelEdit}
                disabled={saving}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ================= VIEW MODE ================= */
          <View style={styles.card}>
            <Text style={styles.viewTitle}>{book.title}</Text>
            <Text style={styles.viewAuthor}>by {book.author}</Text>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Genre</Text>
              <View style={styles.badgeGenre}>
                <Text style={styles.badgeGenreText}>{book.genre}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={styles.badgeStatus}>
                <Text style={styles.badgeStatusText}>{book.status}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rating</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#EAB308" />
                <Text style={styles.detailValue}>
                  {book.rating !== null && book.rating !== undefined ? ` ${book.rating} / 5` : ' Not rated'}
                </Text>
              </View>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.notesText}>
                {book.notes ? book.notes : 'No notes provided.'}
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Buttons: Edit & Delete */}
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.editBtn]} 
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="create-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionBtn, styles.deleteBtn]} 
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backBtnText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  favoriteBtn: {
    padding: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  viewTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  viewAuthor: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailBlock: {
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  badgeGenre: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeGenreText: {
    color: '#0284C7',
    fontSize: 13,
    fontWeight: '600',
  },
  badgeStatus: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeStatusText: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    marginTop: 6,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  editBtn: {
    backgroundColor: '#2563EB',
  },
  editBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  deleteBtn: {
    backgroundColor: '#DC2626',
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: '#16A34A',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  cancelBtn: {
    backgroundColor: '#64748B',
  },
  cancelBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
  },
  textArea: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    width: '100%',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  errorTextCustom: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '500',
  },
});

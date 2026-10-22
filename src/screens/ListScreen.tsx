import React, { useState, useContext, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Switch, 
  ScrollView, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { BookContext } from '../context/BookContext';
import { validateBookForm } from '../utils/validation';
import { Book, BookFormErrors, Genre, Status, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

export default function ListScreen({ navigation }: Props) {
  const { user, logout } = useContext(AuthContext);
  const { books, loading, addBook, toggleFavorite } = useContext(BookContext);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [formErrors, setFormErrors] = useState<BookFormErrors>({});
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [bookSuccess, setBookSuccess] = useState<string>('');
  const [bookError, setBookError] = useState<string>('');
  const [savingBook, setSavingBook] = useState<boolean>(false);

  // Filters & Search states
  const [genreFilter, setGenreFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live validation on change
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

  // Add Book handler
  const handleAddBook = async () => {
    setFormSubmitted(true);
    setBookSuccess('');
    setBookError('');

    const errors = validateBookForm({ title, author, genre, status, rating, notes });
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSavingBook(true);
    try {
      await addBook({
        title,
        author,
        genre,
        status,
        rating,
        notes,
      });

      // Clear form on success
      setTitle('');
      setAuthor('');
      setGenre('');
      setStatus('');
      setRating('');
      setNotes('');
      setFormSubmitted(false);
      setFormErrors({});
      setBookSuccess('Book added');
    } catch (err: any) {
      setBookError(err.message || 'Failed to add book');
    } finally {
      setSavingBook(false);
    }
  };

  // Reset Filters
  const handleClearFilters = () => {
    setGenreFilter('All');
    setStatusFilter('All');
    setFavoritesOnly(false);
    setSearchQuery('');
  };

  // Filtered books list
  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return books.filter((b) => {
      // Genre filter
      if (genreFilter !== 'All' && b.genre !== genreFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'All' && b.status !== statusFilter) {
        return false;
      }
      // Favorites only filter
      if (favoritesOnly && !b.favorite) {
        return false;
      }
      // Search query (title or author contains query)
      if (query !== '') {
        const titleMatch = (b.title || '').toLowerCase().includes(query);
        const authorMatch = (b.author || '').toLowerCase().includes(query);
        if (!titleMatch && !authorMatch) {
          return false;
        }
      }
      return true;
    });
  }, [books, genreFilter, statusFilter, favoritesOnly, searchQuery]);

  // Summary breakdown
  const summary = useMemo(() => {
    const totalCount = filteredBooks.length;
    const favoriteCount = filteredBooks.filter((b) => b.favorite).length;

    // Status counts
    const counts: Record<string, number> = {
      'To Read': 0,
      'Reading': 0,
      'Finished': 0,
    };

    filteredBooks.forEach((b) => {
      if (counts[b.status] !== undefined) {
        counts[b.status] += 1;
      }
    });

    const statusPriority: Record<string, number> = { 'To Read': 1, 'Reading': 2, 'Finished': 3 };

    const breakdown = Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => {
        // Most books first
        if (b[1] !== a[1]) {
          return b[1] - a[1];
        }
        // Equal counts: To Read -> Reading -> Finished
        return (statusPriority[a[0]] || 99) - (statusPriority[b[0]] || 99);
      });

    return { totalCount, favoriteCount, breakdown };
  }, [filteredBooks]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View testID="list-screen" style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerUser}>
            <Ionicons name="person-circle-outline" size={24} color="#2563EB" />
            <Text style={styles.userEmail} numberOfLines={1}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View>
              {/* SECTION A: ADD BOOK FORM */}
              <View testID="book-form" style={styles.formCard}>
                <Text style={styles.cardHeader}>Add a Book</Text>

                {/* Book Success Message */}
                {bookSuccess ? (
                  <View style={styles.successBox}>
                    <Text testID="book-success" style={styles.successText}>
                      {bookSuccess}
                    </Text>
                  </View>
                ) : null}

                {/* Book Error Message */}
                {bookError ? (
                  <View style={styles.errorBox}>
                    <Text testID="error-book" style={styles.errorTextCustom}>
                      {bookError}
                    </Text>
                  </View>
                ) : null}

                {/* Title */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Title *</Text>
                  <TextInput
                    style={[styles.input, formSubmitted && formErrors.title ? styles.inputError : null]}
                    placeholder="Enter book title"
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
                    placeholder="Enter author name"
                    value={author}
                    onChangeText={handleAuthorChange}
                  />
                  {formSubmitted && formErrors.author ? (
                    <Text style={styles.errorText}>{formErrors.author}</Text>
                  ) : null}
                </View>

                {/* Genre Picker */}
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

                {/* Status Picker */}
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

                {/* Rating (Optional) */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Rating (0-5, Optional)</Text>
                  <TextInput
                    style={[styles.input, formSubmitted && formErrors.rating ? styles.inputError : null]}
                    placeholder="e.g. 5"
                    value={rating}
                    onChangeText={handleRatingChange}
                    keyboardType="numeric"
                  />
                  {formSubmitted && formErrors.rating ? (
                    <Text style={styles.errorText}>{formErrors.rating}</Text>
                  ) : null}
                </View>

                {/* Notes (Optional) */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Notes (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea, formSubmitted && formErrors.notes ? styles.inputError : null]}
                    placeholder="Short notes about the book (max 300 characters)"
                    value={notes}
                    onChangeText={handleNotesChange}
                    multiline
                    numberOfLines={3}
                  />
                  {formSubmitted && formErrors.notes ? (
                    <Text style={styles.errorText}>{formErrors.notes}</Text>
                  ) : null}
                </View>

                <TouchableOpacity 
                  style={styles.addBtn} 
                  onPress={handleAddBook}
                  disabled={savingBook}
                >
                  {savingBook ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.addBtnText}>Add Book</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* SECTION C: FILTERS, SEARCH & SUMMARY */}
              <View style={styles.filterSection}>
                <Text style={styles.cardHeader}>Filters & Search</Text>

                {/* Search Box */}
                <View style={styles.searchBox}>
                  <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search by title or author..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery !== '' ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <Ionicons name="close-circle" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* Genre Filter */}
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>Genre:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    {['All', 'Fiction', 'Non-Fiction', 'Academic', 'Other'].map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[styles.chip, genreFilter === g && styles.chipActive]}
                        onPress={() => setGenreFilter(g)}
                      >
                        <Text style={[styles.chipText, genreFilter === g && styles.chipTextActive]}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Status Filter */}
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>Status:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    {['All', 'To Read', 'Reading', 'Finished'].map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.chip, statusFilter === s && styles.chipActive]}
                        onPress={() => setStatusFilter(s)}
                      >
                        <Text style={[styles.chipText, statusFilter === s && styles.chipTextActive]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Favorites Only Switch & Clear */}
                <View style={styles.switchRow}>
                  <View style={styles.switchContainer}>
                    <Text style={styles.filterLabel}>Favorites only:</Text>
                    <Switch
                      value={favoritesOnly}
                      onValueChange={setFavoritesOnly}
                      trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                      thumbColor={favoritesOnly ? '#2563EB' : '#F1F5F9'}
                    />
                  </View>
                  <TouchableOpacity style={styles.clearBtn} onPress={handleClearFilters}>
                    <Text style={styles.clearBtnText}>Clear</Text>
                  </TouchableOpacity>
                </View>

                {/* Summary Box */}
                <View style={styles.summaryBox}>
                  <View style={styles.summaryStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Books</Text>
                      <Text testID="book-count" style={styles.statValue}>
                        {summary.totalCount}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Favorites</Text>
                      <Text testID="favorite-count" style={styles.statValue}>
                        {summary.favoriteCount}
                      </Text>
                    </View>
                  </View>

                  {/* Status Breakdown */}
                  {summary.breakdown.length > 0 ? (
                    <View style={styles.breakdownContainer}>
                      <Text style={styles.breakdownTitle}>Status Breakdown:</Text>
                      {summary.breakdown.map(([stName, cnt]) => (
                        <View key={stName} style={styles.breakdownRow}>
                          <Text style={styles.breakdownName}>{stName}</Text>
                          <Text style={styles.breakdownCount}>{cnt}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              </View>

              <Text style={styles.listSectionTitle}>Your Books</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              testID="book-item"
              style={styles.bookCard}
              onPress={() => navigation.navigate('Detail', { bookId: item.id })}
            >
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>by {item.author}</Text>
                <View style={styles.bookBadges}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.genre}</Text>
                  </View>
                  <View style={[styles.badge, styles.badgeStatus]}>
                    <Text style={[styles.badgeText, styles.badgeStatusText]}>{item.status}</Text>
                  </View>
                </View>
              </View>
              
              {/* Favorite Star Toggle */}
              <TouchableOpacity 
                style={styles.starBtn}
                onPress={() => toggleFavorite(item.id, Boolean(item.favorite))}
              >
                <Ionicons 
                  name={item.favorite ? "star" : "star-outline"} 
                  size={26} 
                  color={item.favorite ? "#EAB308" : "#94A3B8"} 
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 24 }} />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="file-tray-outline" size={48} color="#94A3B8" />
                <Text testID="books-empty" style={styles.emptyText}>
                  No books found
                </Text>
              </View>
            )
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  logoutBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 13,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
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
  successBox: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  successText: {
    color: '#15803D',
    fontSize: 14,
    fontWeight: '600',
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
  addBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    width: 65,
  },
  chipScroll: {
    flex: 1,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: '#2563EB',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  clearBtnText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 12,
  },
  summaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  breakdownContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  breakdownName: {
    fontSize: 12,
    color: '#334155',
  },
  breakdownCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  listSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  bookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  bookInfo: {
    flex: 1,
    marginRight: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  bookAuthor: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  bookBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
  },
  badgeStatus: {
    backgroundColor: '#FEF3C7',
  },
  badgeStatusText: {
    color: '#D97706',
  },
  starBtn: {
    padding: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
});

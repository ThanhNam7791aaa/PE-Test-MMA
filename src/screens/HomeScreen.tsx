import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BookShelf</Text>
        <View style={styles.authButtons}>
          <TouchableOpacity 
            style={[styles.btn, styles.loginBtn]} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btn, styles.registerBtn]} 
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerBtnText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <View style={styles.heroSection}>
          <Text testID="home-title" style={styles.title}>BookShelf</Text>
          <Text style={styles.description}>
            Your personal digital library. Organize, track, and manage all your reading journeys in one secure place.
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          <View style={styles.card}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="book-outline" size={28} color="#0284C7" />
            </View>
            <Text style={styles.cardTitle}>Track your books</Text>
            <Text style={styles.cardDesc}>
              Keep an organized private record of all books you own, plan to buy, or wish to read.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="filter-outline" size={28} color="#D97706" />
            </View>
            <Text style={styles.cardTitle}>Sort by status</Text>
            <Text style={styles.cardDesc}>
              Categorize titles into To Read, Reading, and Finished to keep your reading goals on track.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="star-outline" size={28} color="#DC2626" />
            </View>
            <Text style={styles.cardTitle}>Rate your favorites</Text>
            <Text style={styles.cardDesc}>
              Mark cherished books as favorites and give them personal star ratings and notes.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  loginBtn: {
    backgroundColor: '#F1F5F9',
  },
  loginBtnText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 14,
  },
  registerBtn: {
    backgroundColor: '#2563EB',
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  featuresContainer: {
    marginTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});

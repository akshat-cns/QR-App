import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';
import { MaterialIcons } from '@expo/vector-icons';

export default function ParentPage() {
  const router = useRouter(); 
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await apiClient.get('/parent/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (error) {
      console.log('Error fetching user data', error);
      Alert.alert('Error', 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      router.push("/");
    } catch (error) {
      console.log('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={styles.loadingText}>Loading Your Profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <MaterialIcons name="account-circle" size={80} color="#2C3E50" />
          <Text style={styles.welcomeText}>Welcome, {userData?.name}</Text>
        </View>
      </View>

      {/* Profile Information Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="person" size={24} color="#2C3E50" />
          <Text style={styles.cardTitle}>Profile Information</Text>
        </View>

        <InfoRow icon="alternate-email" label="Username" value={userData?.username} />
        <InfoRow icon="email" label="Email" value={userData?.parent_mail} />
        <InfoRow icon="phone" label="Contact" value={userData?.parent_contact} />
        
        <TouchableOpacity style={styles.passwordButton}>
          <MaterialIcons name="lock" size={20} color="#2C3E50" />
          <Text style={styles.passwordButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* QR Code Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="qr-code" size={24} color="#2C3E50" />
          <Text style={styles.cardTitle}>Student QR Code</Text>
        </View>
        
        <View style={styles.qrCodeContainer}>
          <QRCode
            value={userData?.qr_code}
            size={250}
            ecl="H"
            backgroundColor="transparent"
            color="#2C3E50"
          />
         
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#E74C3C" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const InfoRow = ({ icon, label, value }: any) => (
  <View style={styles.infoRow}>
    <MaterialIcons name={icon} size={20} color="#E67E22" />
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'rgba(255, 250, 240, 1.00)',
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 250, 240, 1.00)',
  },
  loadingText: {
    fontSize: 16,
    color: '#2C3E50',
    marginTop: 20,
    fontFamily: 'Roboto-Medium',
  },
  header: {
    backgroundColor: '#FDF5E6',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    elevation: 2,
  },
  profileHeader: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 15,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE7DC',
    paddingBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 10,
    fontFamily: 'Roboto-Medium',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F1EB',
  },
  label: {
    fontSize: 15,
    color: '#34495E',
    marginLeft: 12,
    width: 100,
    fontFamily: 'Roboto-Medium',
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: '#2C3E50',
    fontWeight: '500',
    fontFamily: 'Roboto-Regular',
  },
  passwordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDE7DC',
  },
  passwordButtonText: {
    fontSize: 15,
    color: '#E67E22',
    fontWeight: '600',
    marginLeft: 10,
    fontFamily: 'Roboto-Medium',
  },
  qrCodeContainer: {
    alignItems: 'center',
    padding: 20,
  },
  qrHelpText: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
    maxWidth: 300,
    fontFamily: 'Roboto-Italic',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDEDEC',
    padding: 15,
    borderRadius: 12,
    margin: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#E74C3C',
    fontWeight: '600',
    marginLeft: 10,
  },
});
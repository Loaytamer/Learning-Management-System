import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import {
  Camera,
  User,
  LogOut,
  ChevronRight,
  Edit,
  Settings,
  HelpCircle,
  Bell,
  Moon,
} from 'lucide-react-native';
import { uploadProfileImage, deleteProfileImage } from '../../api/profile';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageError = (errorMessage: string) => {
    console.error(errorMessage);
    Alert.alert(
      'Missing Dependency',
      'To use this feature, you need to install the expo-image-picker package. Run: npx expo install expo-image-picker',
      [
        { text: 'OK' },
        {
          text: 'Learn More',
          onPress: () => {
            // In a real app, you might open a link to documentation
            Alert.alert(
              'Installation Instructions',
              '1. Stop your development server\n' +
                '2. Run: npx expo install expo-image-picker\n' +
                '3. Restart your app'
            );
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    try {
      // Check if we're on web, which doesn't need expo-image-picker
      if (Platform.OS === 'web') {
        // Web implementation would go here if needed
        Alert.alert(
          'Not Implemented',
          'Image picking on web is not implemented in this version'
        );
        return;
      }

      // Request media library permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to make this work!'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsLoading(true);
        try {
          // Create FormData object for the image upload
          const formData = new FormData();

          // Get image info
          const imageUri = result.assets[0].uri;
          const filename = imageUri.split('/').pop();

          // Determine mime type (default to jpeg if can't determine)
          const match = /\.([\w]+)$/.exec(filename || '');
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          // Append the image to FormData with field name 'image'
          formData.append('image', {
            uri: imageUri,
            name: filename,
            type,
          } as any);

          // Upload the image to your backend
          // console.log('Uploading image:', result.assets);
          const response = await uploadProfileImage(formData);

          // Update the user state with the new avatar
          updateUser({ avatar: { uri: result.assets[0].uri } });

          Alert.alert('Success', 'Profile picture updated successfully');
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          Alert.alert('Error', 'Failed to upload profile picture');
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePicture = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera permissions to make this work!'
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsLoading(true);
        try {
          // Create FormData object for the image upload
          const formData = new FormData();

          // Get image info
          const imageUri = result.assets[0].uri;
          const filename = imageUri.split('/').pop();

          // Determine mime type (default to jpeg if can't determine)
          const match = /\.([\w]+)$/.exec(filename || '');
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          // Append the image to FormData with field name 'image'
          formData.append('image', {
            uri: imageUri,
            name: filename,
            type,
          } as any);

          // Upload the image to your backend
          const response = await uploadProfileImage(formData);

          // Update the user state with the new avatar
          updateUser({ avatar: { uri: result.assets[0].uri } });

          Alert.alert('Success', 'Profile picture updated successfully');
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          Alert.alert('Error', 'Failed to upload profile picture');
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const deleteImage = async () => {
    try {
      setIsLoading(true);
      // Call the API to delete the image
      const response = await deleteProfileImage();

      // Update the user state to remove the avatar
      updateUser({ avatar: undefined });

      Alert.alert('Success', 'Profile picture deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      Alert.alert('Error', 'Failed to delete profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  // Define interface for alert options to include style property
  interface AlertOption {
    text: string;
    onPress?: () => Promise<void> | void;
    style?: 'default' | 'cancel' | 'destructive';
  }

  const showImageOptions = () => {
    if (Platform.OS === 'web') {
      // Web doesn't support ActionSheet, so just launch picker directly
      pickImage();
      return;
    }

    // Create base options array
    const options: AlertOption[] = [
      { text: 'Take Photo', onPress: takePicture },
      { text: 'Choose from Gallery', onPress: pickImage },
    ];

    // Add delete option only if user has an avatar
    if (user?.avatar) {
      options.push({
        text: 'Delete Current Photo',
        onPress: deleteImage,
        style: 'destructive',
      });
    }

    // Always add cancel option at the end
    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert('Profile Picture', 'Choose an option', options, {
      cancelable: true,
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would update the app theme
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    // In a real app, this would update notification settings
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' } as AlertOption,
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        } as AlertOption,
      ],
      { cancelable: true }
    );
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {isLoading ? (
            <View style={[styles.avatar, styles.loadingContainer]}>
              <ActivityIndicator size="large" color="#6200EE" />
            </View>
          ) : user.avatar ? (
            <Image source={user.avatar} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={40} color="#9CA3AF" />
            </View>
          )}
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={showImageOptions}
            disabled={isLoading}
          >
            <Camera size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user.username}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {user.role === 'instructor' ? 'Instructor' : 'Student'}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <TouchableOpacity style={styles.infoItem}>
          <User size={20} color="#9CA3AF" />
          <Text style={styles.infoText}>Edit Profile</Text>
          <ChevronRight size={20} color="#9CA3AF" style={styles.chevron} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoItem}>
          <Edit size={20} color="#9CA3AF" />
          <Text style={styles.infoText}>Edit Bio</Text>
          <ChevronRight size={20} color="#9CA3AF" style={styles.chevron} />
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Moon size={20} color="#9CA3AF" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#4B5563', true: '#6200EE' }}
            thumbColor={darkMode ? '#FFFFFF' : '#D1D5DB'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Bell size={20} color="#9CA3AF" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#4B5563', true: '#6200EE' }}
            thumbColor={notifications ? '#FFFFFF' : '#D1D5DB'}
          />
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Settings size={20} color="#9CA3AF" />
            <Text style={styles.settingText}>App Settings</Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <HelpCircle size={20} color="#9CA3AF" />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#FFFFFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    fontFamily: 'Inter-Bold',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6200EE',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#111827',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  roleBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D1D5DB',
    fontFamily: 'Inter-SemiBold',
  },
  infoSection: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  settingsSection: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#D1D5DB',
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
  },
  chevron: {
    marginLeft: 'auto',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#D1D5DB',
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  versionText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
});
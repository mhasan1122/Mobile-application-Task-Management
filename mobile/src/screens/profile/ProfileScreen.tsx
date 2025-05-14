import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F8F9FA' }}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <View style={{ marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: '#000',
            marginBottom: 8,
          }}
        >
          Profile
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#666',
          }}
        >
          Manage your account
        </Text>
      </View>

      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              color: '#666',
              marginBottom: 4,
            }}
          >
            Name
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: '#000',
              fontWeight: '500',
            }}
          >
            {user?.name}
          </Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              color: '#666',
              marginBottom: 4,
            }}
          >
            Email
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: '#000',
              fontWeight: '500',
            }}
          >
            {user?.email}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 20,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: '#007AFF',
              marginLeft: 12,
            }}
          >
            Edit Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: '#007AFF',
              marginLeft: 12,
            }}
          >
            Change Password
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: '#007AFF',
              marginLeft: 12,
            }}
          >
            Notification Settings
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Sign Out"
        onPress={logout}
        variant="outline"
        style={{ marginTop: 32 }}
      />
    </ScrollView>
  );
};

export default ProfileScreen; 
import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Text, Image, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { registrationValidationSchema } from '../../validation/authValidation';
import { useAuth } from '../../hooks/useAuth';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { register, isLoading, error } = useAuth();
  
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: yupResolver(registrationValidationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data.username, data.email, data.password);
      // Navigate to login page after successful registration
      navigation.navigate('Login');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Username"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Choose a username"
                  error={errors.username?.message}
                  containerStyle={styles.input}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                  containerStyle={styles.input}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your password"
                  secureTextEntry
                  error={errors.password?.message}
                  containerStyle={styles.input}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Confirm your password"
                  secureTextEntry
                  error={errors.confirmPassword?.message}
                  containerStyle={styles.input}
                />
              )}
            />
          </View>

          {error && (
            <Text style={styles.errorText}>
              {error}
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title={isLoading ? 'Creating Account...' : 'Create Account'}
              onPress={handleSubmit(onSubmit)}
              style={styles.createAccountButton}
              disabled={isLoading}
            />
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Button
              title="Sign In"
              onPress={() => navigation.navigate('Login')}
              variant="text"
              style={styles.signInButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  createAccountButton: {
    marginBottom: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#666666',
    marginRight: 4,
  },
  signInButton: {
    paddingHorizontal: 4,
  },
});

export default RegisterScreen; 
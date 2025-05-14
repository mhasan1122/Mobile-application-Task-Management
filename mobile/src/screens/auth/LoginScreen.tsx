import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Text, Image, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { loginValidationSchema } from '../../validation/authValidation';
import { useAuth } from '../../hooks/useAuth';
import { RootState } from '../../store';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type LoginFormData = {
  email: string;
  password: string;
};

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login, isLoading, error } = useAuth();
  const successMessage = useSelector((state: RootState) => state.auth.successMessage);
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      console.error('Login error:', err);
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {successMessage && (
            <Text style={styles.successText}>
              {successMessage}
            </Text>
          )}

          <View style={styles.inputContainer}>
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
          </View>

          {error && (
            <Text style={styles.errorText}>
              {error}
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title={isLoading ? 'Signing in...' : 'Sign In'}
              onPress={handleSubmit(onSubmit)}
              style={styles.signInButton}
              disabled={isLoading}
            />

            <Button
              title="Forgot Password?"
              onPress={() => navigation.navigate('ForgotPassword')}
              variant="text"
              style={styles.forgotPasswordButton}
            />
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Button
              title="Sign Up"
              onPress={() => navigation.navigate('Register')}
              variant="text"
              style={styles.signUpButton}
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
  successText: {
    color: '#34C759',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  signInButton: {
    marginBottom: 16,
  },
  forgotPasswordButton: {
    marginTop: 8,
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
  signUpButton: {
    paddingHorizontal: 4,
  },
});

export default LoginScreen;
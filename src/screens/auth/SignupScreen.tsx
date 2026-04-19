import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {ArrowLeft} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {authService} from '../../services/authService';
import {useAuthStore} from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function SignupScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const {isLoading, error} = useAuthStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!username.trim()) { setLocalError('Username is required'); return false; }
    if (!email.trim()) { setLocalError('Email is required'); return false; }
    if (password.length < 6) { setLocalError('Password must be at least 6 characters'); return false; }
    return true;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLocalError('');
    try {
      await authService.signup(email.trim(), password, username.trim());
      setSuccess(true);
    } catch (e: any) {
      setLocalError(e.message ?? 'Signup failed');
    }
  };

  if (success) {
    return (
      <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
        <View style={styles.successContent}>
          <Text style={[styles.successTitle, {color: theme.colors.text}]}>Check your email</Text>
          <Text style={[styles.successSub, {color: theme.colors.textSecondary}]}>
            We sent a confirmation link to {email}. Click it to activate your account.
          </Text>
          <Button label="Back to Login" onPress={() => navigation.navigate('Login')} fullWidth />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
            <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
          </TouchableOpacity>
          <Text style={[styles.headline, {color: theme.colors.text}]}>Create account</Text>
          <Text style={[styles.sub, {color: theme.colors.textSecondary}]}>
            Join ScottyApp and get organized
          </Text>

          <View style={styles.form}>
            <Input label="Username" placeholder="scotty" value={username} onChangeText={setUsername} autoCapitalize="none" />
            <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <Input label="Password" placeholder="6+ characters" value={password} onChangeText={setPassword} isPassword />

            {(localError || error) ? (
              <View style={[styles.errorBox, {backgroundColor: `${theme.colors.error}15`}]}>
                <Text style={[styles.errorText, {color: theme.colors.error}]}>{localError || error}</Text>
              </View>
            ) : null}

            <Button label="Create Account" onPress={handleSignup} loading={isLoading} fullWidth />
          </View>

          <View style={styles.loginRow}>
            <Text style={[styles.loginText, {color: theme.colors.textSecondary}]}>Have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, {color: theme.colors.accent}]}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  flex: {flex: 1},
  content: {flexGrow: 1, padding: 28, gap: 16},
  headline: {fontSize: 28, fontWeight: '800', marginTop: 12},
  sub: {fontSize: 15, lineHeight: 22},
  form: {gap: 14},
  errorBox: {padding: 12, borderRadius: 8},
  errorText: {fontSize: 13},
  loginRow: {flexDirection: 'row', gap: 6, justifyContent: 'center', marginTop: 8},
  loginText: {fontSize: 14},
  loginLink: {fontSize: 14, fontWeight: '600'},
  successContent: {flex: 1, padding: 28, gap: 16, justifyContent: 'center', alignItems: 'center'},
  successTitle: {fontSize: 24, fontWeight: '700', textAlign: 'center'},
  successSub: {fontSize: 15, textAlign: 'center', lineHeight: 22},
});

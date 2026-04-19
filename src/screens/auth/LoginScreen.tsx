import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {Lightning} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {authService} from '../../services/authService';
import {useAuthStore} from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const {isLoading, error} = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const passwordRef = useRef<TextInput>(null);

  const validate = () => {
    if (!email.trim()) { setLocalError('Email is required'); return false; }
    if (!password) { setLocalError('Password is required'); return false; }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLocalError('');
    try {
      await authService.login(email.trim(), password);
    } catch (e: any) {
      setLocalError(e.message ?? 'Login failed');
    }
  };

  const handleGuestLogin = () => {
    useAuthStore.getState().setUser({
      id: 'guest',
      email: 'guest@scottyapp.local',
      username: 'scotty',
      displayName: 'Scotty',
      createdAt: new Date().toISOString(),
      isPublic: false,
      role: 'user',
    });
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}>
            <View style={[styles.brandIcon, {backgroundColor: theme.colors.accentMuted}]}>
              <Lightning size={28} color={theme.colors.accent} weight="fill" />
            </View>
            <Text style={[styles.brandName, {color: theme.colors.text}]}>ScottyApp</Text>
          </View>

          <Text style={[styles.headline, {color: theme.colors.text}]}>Welcome back</Text>
          <Text style={[styles.sub, {color: theme.colors.textSecondary}]}>
            Sign in to access your tools
          </Text>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <Input
              ref={passwordRef}
              label="Password"
              placeholder="Your password"
              value={password}
              onChangeText={setPassword}
              isPassword
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />

            {(localError || error) ? (
              <View style={[styles.errorBox, {backgroundColor: `${theme.colors.error}15`}]}>
                <Text style={[styles.errorText, {color: theme.colors.error}]}>
                  {localError || error}
                </Text>
              </View>
            ) : null}

            <Button label="Sign In" onPress={handleLogin} loading={isLoading} fullWidth />

            <TouchableOpacity onPress={() => {}} style={styles.forgotBtn}>
              <Text style={[styles.forgotText, {color: theme.colors.accent}]}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, {backgroundColor: theme.colors.border}]} />
            <Text style={[styles.dividerText, {color: theme.colors.textTertiary}]}>or</Text>
            <View style={[styles.dividerLine, {backgroundColor: theme.colors.border}]} />
          </View>

          <Button label="Continue as Guest" onPress={handleGuestLogin} variant="secondary" fullWidth />

          <View style={styles.signupRow}>
            <Text style={[styles.signupText, {color: theme.colors.textSecondary}]}>
              No account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={[styles.signupLink, {color: theme.colors.accent}]}>Sign up</Text>
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
  brandRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20},
  brandIcon: {width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  brandName: {fontSize: 20, fontWeight: '700'},
  headline: {fontSize: 28, fontWeight: '800', marginTop: 16},
  sub: {fontSize: 15, lineHeight: 22},
  form: {gap: 14, marginTop: 8},
  errorBox: {padding: 12, borderRadius: 8},
  errorText: {fontSize: 13},
  forgotBtn: {alignSelf: 'flex-end'},
  forgotText: {fontSize: 13, fontWeight: '500'},
  dividerRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  dividerLine: {flex: 1, height: 1},
  dividerText: {fontSize: 13},
  signupRow: {flexDirection: 'row', gap: 6, justifyContent: 'center', marginTop: 8},
  signupText: {fontSize: 14},
  signupLink: {fontSize: 14, fontWeight: '600'},
});

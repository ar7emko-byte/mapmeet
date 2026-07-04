import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Input } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/Toast';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { signInSchema, type SignInInput } from '@/utils/validators';

export default function LoginScreen() {
  const toast = useToast();
  const setSession = useAuthStore((s) => s.setSession);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: SignInInput) => {
    try {
      const session = await authService.signIn(values);
      await setSession(session);
      router.replace('/(tabs)/map');
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Sign in failed', 'error');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-light dark:bg-surface-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, padding: 24, gap: 20 }}
        >
          <View className="mt-6">
            <Text className="text-4xl font-bold text-text-light dark:text-text-dark">
              Welcome back
            </Text>
            <Text className="mt-2 text-base text-muted-light dark:text-muted-dark">
              Sign in to see what's happening around you.
            </Text>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  placeholder="you@example.com"
                  leftAdornment={<Ionicons name="mail-outline" size={16} color="#8E8E93" />}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Password"
                  secureTextEntry
                  autoComplete="password"
                  textContentType="password"
                  placeholder="At least 8 characters"
                  leftAdornment={
                    <Ionicons name="lock-closed-outline" size={16} color="#8E8E93" />
                  }
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />
          </View>

          <View className="items-end">
            <Link href="/(auth)/forgot-password" className="text-sm text-brand-500">
              Forgot password?
            </Link>
          </View>

          <PrimaryButton
            label="Sign in"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
            size="lg"
          />

          <View className="flex-row justify-center gap-1 pt-2">
            <Text className="text-sm text-muted-light dark:text-muted-dark">
              New to MapMeet?
            </Text>
            <Link href="/(auth)/signup" className="text-sm font-semibold text-brand-500">
              Create an account
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

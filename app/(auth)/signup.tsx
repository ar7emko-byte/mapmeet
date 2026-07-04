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
import { signUpSchema, type SignUpInput } from '@/utils/validators';

export default function SignUpScreen() {
  const toast = useToast();
  const setSession = useAuthStore((s) => s.setSession);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', username: '', displayName: '' },
  });

  const onSubmit = async (values: SignUpInput) => {
    try {
      const { session } = await authService.signUp(values);
      if (session) {
        await setSession(session);
        router.replace('/(tabs)/map');
      } else {
        toast.show('Check your inbox to confirm your email.', 'success');
        router.replace('/(auth)/login');
      }
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Sign up failed', 'error');
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
              Create account
            </Text>
            <Text className="mt-2 text-base text-muted-light dark:text-muted-dark">
              Drop your first pin in under a minute.
            </Text>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="displayName"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Display name"
                  placeholder="Alex Ryder"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.displayName?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="username"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Username"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="alex"
                  leftAdornment={<Text className="text-muted-light">@</Text>}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                />
              )}
            />
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

          <PrimaryButton
            label="Create account"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
            size="lg"
          />

          <View className="flex-row justify-center gap-1 pt-2">
            <Text className="text-sm text-muted-light dark:text-muted-dark">
              Already have an account?
            </Text>
            <Link href="/(auth)/login" className="text-sm font-semibold text-brand-500">
              Sign in
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

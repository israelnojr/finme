import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const register = () => {
  const [countryCode, setCountryCode] = useState('+234');
  const [phoneNumber, setPhoneNumber] = useState('');
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const router = useRouter();
  const {signUp} = useSignUp()

  const onSignup = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    router.push({ pathname: '/verify/[phone]', params: { phone: fullPhoneNumber } });
    try {
      await signUp!.create({
        phoneNumber: fullPhoneNumber,
      });
      signUp!.preparePhoneNumberVerification();

      router.push({ pathname: '/verify/[phone]', params: { phone: fullPhoneNumber } });
    } catch (error) {
      console.error('Error signing up:', error);
      router.replace("/register")
    }
  }
  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={defaultStyles.container}>
          <Text style={defaultStyles.header}>Let's get started!</Text>
          <Text style={defaultStyles.descriptionText}>
            Enter your phone number. We will send you a confirmation code there
          </Text>
          <View style={st.inputContainer}>
            <TextInput
              style={st.input}
              placeholder="Country code"
              placeholderTextColor={Colors.gray}
              value={countryCode}
              onChangeText={setCountryCode}
            />
            <TextInput
              style={[st.input, { flex: 1 }]}
              placeholder="Mobile number"
              placeholderTextColor={Colors.gray}
              keyboardType="numeric"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <Link href={'/login'} replace asChild>
            <TouchableOpacity>
              <Text style={defaultStyles.textLink}>Already have an account? Log in</Text>
            </TouchableOpacity>
          </Link>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={[
              defaultStyles.pillButton,
              phoneNumber !== '' ? st.enabled : st.disabled,
              { marginBottom: 20 },
            ]}
            onPress={onSignup}>
          <Text style={defaultStyles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const st = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: 'row',
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});
export default register
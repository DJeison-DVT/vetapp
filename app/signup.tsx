import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    const router = useRouter();

    return (
        <View style={styles.container}>
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button
                title="Login"
                onPress={() => router.replace('/login')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

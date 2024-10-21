import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
// import { db } from '@/firebaseConfig';
import { Animal } from '@/types';
import { useRouter } from 'expo-router';
import { db } from '@/firebaseConfig';

export default function AddAnimal() {
    const [animal, setAnimal] = useState<Animal>({
        name: '',
        age: '',
        picture: ''
    });
    const router = useRouter();

    const handleAddAnimal = async () => {

        if (!animal.name || !animal.age || !animal.picture) {
            console.log('Validation failed: Missing fields');
            Alert.alert('Error', 'Please fill out all fields');
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "animals"), {
                name: animal.name,
                age: animal.age,
                picture: animal.picture,
            });
            console.log('Animal successfully added', docRef.id);
            Alert.alert('Success', 'Animal added successfully!');
            router.push('/(tabs)');
        } catch (error) {
            console.error("Error adding animal: ", error);
            Alert.alert('Error', 'Failed to add animal');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Animal Name"
                value={animal.name}
                onChangeText={(text) => setAnimal((prev) => ({ ...prev, name: text }))}
                style={styles.input}
            />
            <TextInput
                placeholder="Animal Age"
                value={animal.age}
                onChangeText={(text) => setAnimal((prev) => ({ ...prev, age: text }))}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                placeholder="Animal Picture URL"
                value={animal.picture}
                onChangeText={(text) => setAnimal((prev) => ({ ...prev, picture: text }))}
                style={styles.input}
            />

            <Button
                title="Add Animal"
                onPress={handleAddAnimal}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
});


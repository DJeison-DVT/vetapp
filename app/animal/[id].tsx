import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/firebaseConfig';
import { Animal } from '@/types';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function AnimalDetails() {
    const [animal, setAnimal] = useState<Animal | null>(null);
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();

    const fetchAnimalDetails = async () => {
        if (!id) return;
        const animalRef = doc(db, "animals", id as string);
        const docSnap = await getDoc(animalRef);

        if (docSnap.exists()) {
            setAnimal(docSnap.data() as Animal);
        } else {
            console.log("No such document!");
        }
    };
    useEffect(() => {
        fetchAnimalDetails();

        // Hide the default header and set a custom one
        navigation.setOptions({
            headerShown: true,
            headerTitle: '',  // Empty to remove the [id]
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [id]);


    return (
        <View style={styles.container}>
            {animal ? (
                <>
                    <Text style={styles.animalName}>{animal.name}</Text>
                    <Text style={styles.animalAge}>{animal.age}</Text>
                    <Image
                        source={{ uri: animal.picture }}
                        style={styles.animalImage}
                        resizeMode="contain"
                    />

                </>
            ) : (
                <Text>Loading...</Text>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    animalName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    animalAge: {
        fontSize: 24,
    },
    animalImage: { width: 200, height: 200 }
});

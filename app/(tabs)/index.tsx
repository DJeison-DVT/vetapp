import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from '@/firebaseConfig';
import { Animal } from '@/types';
import { useFocusEffect, useRouter } from 'expo-router';

export default function MainMenu() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const user = auth.currentUser;
  const router = useRouter();

  const fetchAnimals = async () => {
    const querySnapshot = await getDocs(collection(db, "animals"));
    const animalsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Animal[];

    setAnimals(animalsData);
  }

  useEffect(() => {
    fetchAnimals();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchAnimals();
    }, [])
  );


  if (!user) {
    return null;
  }

  const renderAnimal = ({ item }: { item: Animal }) => (
    <TouchableOpacity onPress={() => router.push(`../animal/${item.id}`)}>
      <View style={styles.animalRow}>
        <Text>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, {user.email}!</Text>
      <FlatList
        data={animals}
        renderItem={renderAnimal}
        keyExtractor={(item) => item.id!}
      />
      <Button title="Sign Out" onPress={() => signOut(auth).then(() => router.replace('/login'))} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    color: 'gray'
  },
  animalRow: {
    padding: 15,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
});

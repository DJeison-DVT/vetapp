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
        <Text style={styles.animalName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>Hello, {user.email}!</Text>
      <Text style={styles.welcomeText}>Here's a list of our animals. Click on their name to see their details:</Text>
      <FlatList
        data={animals}
        renderItem={renderAnimal}
        keyExtractor={(item) => item.id!}
      />
      <TouchableOpacity style={styles.signOutButton} onPress={() => signOut(auth).then(() => router.replace('/login'))}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F8FF', 
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',  
  },
  welcomeText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',  
  },
  animalRow: {
    padding: 15,
    borderBottomColor: '#B2DFDB',  
    borderBottomWidth: 1,
    backgroundColor: '#E0F7FA',  
    marginVertical: 5,
    borderRadius: 8, 
  },
  animalName: {
    fontSize: 20,
    color: '#00796B',  
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#FF6F61', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

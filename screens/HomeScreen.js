import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../components/screenWrapper';
import {colors} from '../theme';
import randomImage from '../assets/images/randomImage';
import EmptyList from '../components/emptyList';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {signOut} from 'firebase/auth';
import {auth, tripsRef} from '../config/firebase';
import {useSelector} from 'react-redux';
import {
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';

import {HeartIcon, TrashIcon} from 'react-native-heroicons/outline';

// Dummy Items
// const items = [
//   {
//     id: 1,
//     place: 'Gujrat',
//     country: 'Pakistan',
//   },
//   {
//     id: 2,
//     place: 'London Eye',
//     country: 'England',
//   },
//   {
//     id: 3,
//     place: 'Washington dc',
//     country: 'America',
//   },
//   {
//     id: 4,
//     place: 'New york',
//     country: 'America',
//   },
// ];

export default function HomeScreen() {
  const navigation = useNavigation();

  const {user} = useSelector(state => state.user);
  const [trips, setTrips] = useState();

  const isFocused = useIsFocused();

  const fetchTrips = async () => {
    const q = query(tripsRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach(doc => {
      // console.log('documement: ',doc.data());
      data.push({...doc.data(), id: doc.id});
    });
    setTrips(data);
  };

  const removeTrip = async tripId => {
    try {
      // Construct a reference to the document you want to delete
      const tripDocRef = doc(tripsRef, tripId);

      // Delete the document
      await deleteDoc(tripDocRef);

      setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
    } catch (error) {
      // Handle any errors that occur during the deletion
      console.error('Error removing trip:', error);
    }
  };

  useEffect(() => {
    if (isFocused) fetchTrips();
  }, [isFocused]);

  const handleLogout = async () => {
    await signOut(auth);
  };
  return (
    <ScreenWrapper className="flex-1">
      <View className="flex-row justify-between items-center p-4">
        <Text className={`${colors.heading} font-bold text-3xl shadow-sm`}>
          TripTrek
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          className="p-2 px-3 bg-white border border-gray-200 rounded-full">
          <Text className={colors.heading}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center items-center bg-blue-200 rounded-xl mx-4 mb-4">
        <Image
          source={require('../assets/images/banner.png')}
          className="w-60 h-60"
        />
      </View>
      <View className="px-4 space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className={`${colors.heading} font-bold text-xl`}>
            Recent Trips
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddTrip')}
            className="p-2 px-3 bg-white border border-gray-200 rounded-full">
            <Text className={colors.heading}>Add Trip</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 430}}>
          <FlatList
            data={trips}
            numColumns={2}
            ListEmptyComponent={
              <EmptyList message={"You haven't recorded any trips yet"} />
            }
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              justifyContent: 'space-between',
            }}
            className="mx-1"
            renderItem={({item}) => {
              return (
                <View className="bg-white p-3 rounded-2xl mb-3 shadow-sm">
                  <View
                    className="flex flex-row justify-end items-end z-10"
                    onTouchEnd={() => removeTrip(item.id)}>
                    <TrashIcon color={'red'} size={23} />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('TripExpenses', {...item})
                    }>
                    <Image source={randomImage()} className="w-36 h-36 mb-2" />
                    <View className="justify-center items-center mb-2">
                      <Text className={`${colors.heading} font-bold`}>
                        {item.place}
                      </Text>
                      <Text
                        className={`${colors.heading} text-md font-semibold`}>
                        {item.country}
                      </Text>
                    </View>
                    <View className="flex-row gap-3  items-center">
                      <Text
                        className={`${colors.heading} text-xs font-semibold`}>
                        Start Date :
                      </Text>
                      <Text className={`${colors.heading} text-xs`}>
                        {item.formattedDepartDate}
                      </Text>
                    </View>
                    <View className="flex-row gap-3  items-center ">
                      <Text
                        className={`${colors.heading} text-xs font-semibold`}>
                        End Date :
                      </Text>
                      <Text className={`${colors.heading} text-xs`}>
                        {'  '}
                        {item.formattedReturnDate}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

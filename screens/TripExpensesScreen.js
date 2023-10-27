import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Share,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../components/screenWrapper';
import {colors} from '../theme';
import randomImage from '../assets/images/randomImage';
import EmptyList from '../components/emptyList';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import BackButton from '../components/backButton';
import ExpenseCard from '../components/expenseCard';
import {getDocs, query, where, doc, deleteDoc} from 'firebase/firestore';
import {expensesRef} from '../config/firebase';
import {ShareIcon} from 'react-native-heroicons/outline';

// Dummy Data
// const items = [
//   {
//     id: 1,
//     title: 'ate sandwitch',
//     amount: 4,
//     category: 'food',
//   },
//   {
//     id: 2,
//     title: 'bought a jacket',
//     amount: 50,
//     category: 'shopping',
//   },
//   {
//     id: 3,
//     title: 'watched a movie',
//     amount: 100,
//     category: 'entertainment',
//   },
// ];

export default function TripExpensesScreen(props) {
  const {id, place, country} = props.route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    const q = query(expensesRef, where('tripId', '==', id));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach(doc => {
      // console.log('documement: ',doc.data());
      data.push({...doc.data(), id: doc.id});
    });
    setExpenses(data);
  };

  const removeExpense = async expenseId => {
    try {
      // Construct a reference to the expense document you want to delete
      const expenseDocRef = doc(expensesRef, expenseId);

      // Delete the document
      await deleteDoc(expenseDocRef);

      setExpenses(prevExpenses =>
        prevExpenses.filter(expense => expense.id !== expenseId),
      );
    } catch (error) {
      // Handle any errors that occur during the deletion
      console.error('Error removing expense:', error);
    }
  };

  // Share function

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `I'm sharing details about my trip ${place}, ${country}.`,
        title: 'Share Trip Details',
        url: 'https://www.example.com',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  useEffect(() => {
    if (isFocused) fetchExpenses();
  }, [isFocused]);
  return (
    <ScreenWrapper className="flex-1">
      <View className="px-4">
        <View className="relative mt-5 ">
          <View className="absolute top-2 left-0 z-10">
            <BackButton />
          </View>
          <View>
            <Text className={`${colors.heading} text-xl font-bold text-center`}>
              {place}
            </Text>
            <Text
              className={`${colors.heading} text-sm text-center font-semibold`}>
              {country}
            </Text>
          </View>
          <TouchableOpacity
            className="absolute top-3.5 right-0 z-10"
            onPress={onShare}>
            <ShareIcon color={'black'} size={24} />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center items-center rounded-xl mb-4">
          <Image
            source={require('../assets/images/7.png')}
            className="w-80 h-80"
          />
        </View>
        <View className=" space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className={`${colors.heading} font-bold text-xl`}>
              Expenses
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddExpense', {id, place, country})
              }
              className="p-2 px-3 bg-white border border-gray-200 rounded-full">
              <Text className={colors.heading}>Add Task</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 430}}>
            <FlatList
              data={expenses}
              ListEmptyComponent={
                <EmptyList message={"You haven't recorded any task yet"} />
              }
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              className="mx-1"
              renderItem={({item}) => {
                return (
                  <ExpenseCard item={item} removeExpense={removeExpense} />
                );
              }}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

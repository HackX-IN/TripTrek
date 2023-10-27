import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../components/screenWrapper';
import {colors} from '../theme';
import BackButton from '../components/backButton';
import {useNavigation} from '@react-navigation/native';
import {categories} from '../constants/index';
import Snackbar from 'react-native-snackbar';
import {addDoc} from 'firebase/firestore';
import {expensesRef} from '../config/firebase';
import Loading from '../components/loading';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTripScreen(props) {
  let {id} = props.route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Date and time
  const formattedDate = date.toISOString().split('T')[0];

  const formattedTime = time.toLocaleTimeString();

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const navigation = useNavigation();

  const handleAddExpense = async () => {
    if (
      title &&
      description &&
      formattedDate &&
      formattedTime &&
      category &&
      title.trim() !== '' &&
      description.trim() !== '' &&
      category.trim() !== ''
    ) {
      try {
        setLoading(true);
        const docRef = await addDoc(expensesRef, {
          title,
          description,
          category,
          formattedDate,
          formattedTime,
          tripId: id,
        });
        setLoading(false);
        if (docRef && docRef.id) {
          navigation.goBack();
        }
      } catch (error) {
        // Handle Firestore or any other errors here
        console.error('Error adding expense:', error);
        Snackbar.show({
          text: 'An error occurred while adding the expense.',
          backgroundColor: 'red',
        });
        setLoading(false);
      }
    } else {
      Snackbar.show({
        text: 'Please fill all the fields!',
        backgroundColor: 'red',
      });
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex justify-between h-full mx-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="relative mt-5">
            <View className="absolute top-0 left-0 z-10">
              <BackButton />
            </View>

            <Text className={`${colors.heading} text-xl font-bold text-center`}>
              Add Expense
            </Text>
          </View>

          <View className="flex-row justify-center my-3 mt-5">
            <Image
              className="h-72 w-72"
              source={require('../assets/images/expenseBanner.png')}
            />
          </View>
          <View>
            <View className="space-y-2 mx-2">
              <Text className={`${colors.heading} text-lg font-bold`}>
                Name
              </Text>
              <TextInput
                value={title}
                onChangeText={value => setTitle(value)}
                className="p-4 bg-white rounded-full mb-3"
              />

              <Text className={`${colors.heading} text-lg font-bold`}>
                Description
              </Text>
              <TextInput
                value={description}
                onChangeText={value => setDescription(value)}
                className="p-4 bg-white rounded-full mb-3"
              />

              <Text className={`${colors.heading} text-lg font-bold`}>
                Date
              </Text>
              <TextInput
                value={date.toDateString()}
                onFocus={() => setShowDatePicker(true)}
                className="p-4 bg-white rounded-full mb-3"
              />
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  onChange={handleDateChange}
                  mode="date"
                />
              )}

              <Text className={`${colors.heading} text-lg font-bold`}>
                Time
              </Text>
              <TextInput
                value={time.toLocaleTimeString()}
                onFocus={() => setShowTimePicker(true)}
                className="p-4 bg-white rounded-full mb-3"
              />
              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  onChange={handleTimeChange}
                  mode="time"
                />
              )}
            </View>
          </View>
          <View className="mx-2 space-x-2">
            <Text className="text-lg font-bold">Category</Text>
            <View className="flex-row flex-wrap items-center">
              {categories.map(cat => {
                let bgColor = 'bg-white';
                if (cat.value == category) bgColor = 'bg-green-200';
                return (
                  <TouchableOpacity
                    onPress={() => setCategory(cat.value)}
                    key={cat.value}
                    className={`rounded-full ${bgColor} px-4 p-3 mb-2 mr-2`}>
                    <Text>{cat.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View>
          {loading ? (
            <Loading />
          ) : (
            <TouchableOpacity
              onPress={handleAddExpense}
              style={{backgroundColor: colors.button}}
              className="my-6 rounded-full p-3 shadow-sm mx-2">
              <Text className="text-center text-white text-lg font-bold">
                Add Expense
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}

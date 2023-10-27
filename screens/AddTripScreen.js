import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../components/screenWrapper';
import {colors} from '../theme';
import BackButton from '../components/backButton';
import {useNavigation} from '@react-navigation/native';
import Loading from '../components/loading';
import Snackbar from 'react-native-snackbar';
import {addDoc} from 'firebase/firestore';
import {tripsRef} from '../config/firebase';
import {useSelector} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTripScreen() {
  const [place, setName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [departDate, setDepartDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showDepartDatePicker, setShowDepartDatePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  const {user} = useSelector(state => state.user);

  // formate the Date

  const formattedDepartDate = departDate.toISOString().split('T')[0];
  const formattedReturnDate = returnDate.toISOString().split('T')[0];

  const navigation = useNavigation();
  const handleAddTrip = async () => {
    if (
      place &&
      country &&
      place.trim() !== '' &&
      country.trim() !== '' &&
      formattedDepartDate &&
      formattedReturnDate
    ) {
      try {
        setLoading(true);
        const docRef = await addDoc(tripsRef, {
          place,
          country,
          formattedDepartDate,
          formattedReturnDate,
          userId: user.uid,
        });
        setLoading(false);
        if (docRef && docRef.id) {
          navigation.goBack();
        }
      } catch (error) {
        // Handle Firestore or any other errors here
        console.error('Error adding trip:', error);
        Snackbar.show({
          text: 'An error occurred while adding the trip.',
          backgroundColor: 'red',
        });
        setLoading(false);
      }
    } else {
      Snackbar.show({
        text: 'Place and Country are required!',
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
              Add Trip
            </Text>
          </View>

          <View className="flex-row justify-center my-3 mt-5">
            <Image
              className="h-72 w-72"
              source={require('../assets/images/4.png')}
            />
          </View>
          <View className="space-y-2 mx-2">
            <Text className={`${colors.heading} text-lg font-bold`}>
              Trip Name
            </Text>
            <TextInput
              value={place}
              onChangeText={value => setName(value)}
              className="p-4 bg-white rounded-full mb-3"
            />
            <Text className={`${colors.heading} text-lg font-bold`}>
              Destination
            </Text>
            <TextInput
              value={country}
              onChangeText={value => setCountry(value)}
              className="p-4 bg-white rounded-full mb-3"
            />
          </View>
          <View className="space-y-2 mx-2 justify-between items-center flex-row">
            <Text className={`${colors.heading} text-lg font-bold`}>
              Start Date
            </Text>
            <Text className={`${colors.heading} text-lg font-bold right-1`}>
              End Date
            </Text>
          </View>
          <View
            style={styles.datePicker}
            className="p-4 bg-white rounded-full mb-3">
            <TouchableOpacity onPress={() => setShowDepartDatePicker(true)}>
              <Text>{departDate.toDateString()}</Text>
            </TouchableOpacity>
            {showDepartDatePicker && (
              <DateTimePicker
                value={departDate}
                minimumDate={new Date()}
                onChange={(event, date) => {
                  setShowDepartDatePicker(false);
                  if (date) setDepartDate(date);
                }}
              />
            )}

            <Text style={{marginLeft: 10, color: 'gainsboro', fontSize: 20}}>
              |
            </Text>

            <TouchableOpacity onPress={() => setShowReturnDatePicker(true)}>
              <Text>{returnDate.toDateString()}</Text>
            </TouchableOpacity>
            {showReturnDatePicker && (
              <DateTimePicker
                value={returnDate}
                minimumDate={departDate}
                onChange={(event, date) => {
                  setShowReturnDatePicker(false);
                  if (date) setReturnDate(date);
                }}
              />
            )}
          </View>
        </ScrollView>

        <View>
          {loading ? (
            <Loading />
          ) : (
            <TouchableOpacity
              onPress={handleAddTrip}
              style={{backgroundColor: colors.button}}
              className="my-6 rounded-full p-3 shadow-sm mx-2">
              <Text className="text-center text-white text-lg font-bold">
                Add Trip
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gainsboro',
    marginVertical: 5,
    padding: 5,
    justifyContent: 'space-between',
  },
});

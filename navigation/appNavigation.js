import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {onAuthStateChanged} from 'firebase/auth'; // Change import to remove 'getAuth'
import {useDispatch, useSelector} from 'react-redux';
import {auth} from '../config/firebase';
import {setUser} from '../redux/slices/user';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import AddTripScreen from '../screens/AddTripScreen';
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TripExpensesScreen from '../screens/TripExpensesScreen';
import WelcomScreen from '../screens/WelcomScreen';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const {user} = useSelector(state => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const getUserAccessToken = async () => {
      try {
        const userAccessToken = await AsyncStorage.getItem('userAccessToken');
        if (userAccessToken) {
          // dispatch(setUser(userAccessToken));
          console.log('User');
        }
      } catch (error) {
        console.error('Error retrieving user access token:', error);
      }
    };

    getUserAccessToken();

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        console.log('User is signed in: ', user);

        AsyncStorage.setItem('userAccessToken', user.accessToken);

        dispatch(setUser(user));
      } else {
        console.log('User is signed out');

        AsyncStorage.removeItem('userAccessToken');

        dispatch(setUser(null));
      }
    });

    // Unsubscribe from the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Welcome'}>
        {user ? (
          <>
            <Stack.Screen
              options={{headerShown: false}}
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="AddTrip"
              component={AddTripScreen}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="AddExpense"
              component={AddExpenseScreen}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="TripExpenses"
              component={TripExpensesScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              options={{
                headerShown: false,
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
              name="SignIn"
              component={SignInScreen}
            />
            <Stack.Screen
              options={{
                headerShown: false,
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
              name="SignUp"
              component={SignUpScreen}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="Welcome"
              component={WelcomScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

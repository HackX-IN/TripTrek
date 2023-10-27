import {View, Text, TouchableOpacity, Modal} from 'react-native';
import React, {useState} from 'react';
import {categoryBG, colors} from '../theme';
import {
  CheckBadgeIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';

export default function ExpenseCard({item, removeExpense}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Function to handle the press on the TouchableOpacity
  const handlePress = () => {
    setModalVisible(true);
  };

  // Function to handle the user's choice when the modal is displayed
  const handleUserChoice = choice => {
    if (choice === 'completed') {
      setCompleted(true);
    } else if (choice === 'uncompleted') {
      setCompleted(false);
    }
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        style={{backgroundColor: categoryBG[item.category]}}
        className={`p-3 px-5 mb-3 rounded-2xl ${completed ? 'completed' : ''}`}>
        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-row gap-2 items-center">
            <Text className={`${colors.heading} font-extrabold `}>
              {item.title}
            </Text>
            <Text className={`${colors.heading} text-xs`}>{item.category}</Text>
          </View>
          <View className="flex flex-row gap-2 items-center">
            <Text className={`${colors.heading} text-xs`}>
              {item.formattedDate}
            </Text>
            <Text className={`${colors.heading} text-xs`}>
              {item.formattedTime}
            </Text>
            {completed ? <CheckBadgeIcon color={'green'} size={25} /> : null}
          </View>
        </View>
        <View>
          <Text>{item.description}</Text>
        </View>
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          <View
            style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
            <Text className="text-md font-semibold text-black">
              Do you want to mark this item as completed or delete it?
            </Text>
            <View className="flex flex-row justify-between items-center py-2">
              <TouchableOpacity
                onPress={() =>
                  completed
                    ? handleUserChoice('uncompleted')
                    : handleUserChoice('completed')
                }
                className="flex-row gap-2 items-center">
                {completed ? (
                  <>
                    <XMarkIcon color={'red'} size={22} />
                    <Text className="font-medium">Remove as Completed</Text>
                  </>
                ) : (
                  <>
                    <CheckIcon color={'green'} size={22} />
                    <Text className="font-medium">Mark as Completed</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  removeExpense(item.id);
                  handleUserChoice();
                }}
                className="flex-row gap-2 items-center">
                <TrashIcon color={'red'} size={22} />
                <Text className="font-medium">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

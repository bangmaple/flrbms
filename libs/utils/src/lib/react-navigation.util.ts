import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

export const Tab = createBottomTabNavigator();
export const Stack = createNativeStackNavigator();

export const TabNavigator = Tab.Navigator;
export const TabScreen = Tab.Screen;

export const StackNavigator = Stack.Navigator;
export const StackScreen = Stack.Screen;

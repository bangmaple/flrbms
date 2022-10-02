import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useAppNavigation = () =>
  useNavigation<NativeStackNavigationProp<any>>();

import React from 'react';

import { StackNavigator, StackScreen } from '@app/utils';
import LoginScreen from '../screens/login.screen';
import MainNavigator from './main.navigator';
import { Spinner } from '../components/spinners/spinner';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const NavigationContainer: React.FC<any> = () => {
  const isSpinnerLoading = useSelector(
    (state: RootState) => state.spinner.isLoading
  );

  return (
    <NavigationContainer>
      <StackNavigator
        initialRouteName={'LOGIN_SCREEN'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <StackScreen name={'LOGIN_SCREEN'} component={LoginScreen} />
        <StackScreen name={'MAIN'} component={MainNavigator} />
      </StackNavigator>

      {isSpinnerLoading ? <Spinner /> : null}
    </NavigationContainer>
  );
};

export default NavigationContainer;

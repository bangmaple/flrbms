import { SafeAreaView, ScrollView, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import HomeScreenHeader from './header';
import HomeScreenSection from './section';

const HomeScreen: React.FC = () => {
  const scrollViewRef = useRef<null | ScrollView>(null);

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={(ref) => {
          scrollViewRef.current = ref;
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <HomeScreenHeader />
        <HomeScreenSection />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

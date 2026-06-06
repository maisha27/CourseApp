import { useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDatabase } from './src/database/db';
import CourseListScreen from './src/screens/CourseListScreen';
import CourseDetailScreen from './src/screens/CourseDetailScreen';
import AppLogo from './src/components/AppLogo';
import { Course } from './src/types/course';

export type RootStackParamList = {
  CourseList: undefined;
  CourseDetail: { course: Course };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#0d9488' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          }}
        >
          <Stack.Screen
            name="CourseList"
            component={CourseListScreen}
            options={{
              title: 'Explore Courses',
              headerRight: () => (
                <View style={{ marginRight: 4 }}>
                  <AppLogo size={38} />
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="CourseDetail"
            component={CourseDetailScreen}
            options={{ title: 'Course Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

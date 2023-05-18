import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './src/HomePage';
import MovementsPage from './src/MovementsPage';
import Profile from './src/Profile';
import * as  Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';


const Stack = createStackNavigator();

const App = () => {

  const [isReady, setIsReady] = React.useState(false);

  async function loadResourcesAndDataAsync() {
    try {
      // Load fonts
      await Font.loadAsync({
        'RobotoMono': require('./assets/fonts/RobotoMono-ExtraLight.ttf'),
        // add more fonts as needed
      });
    } catch (err) {
      console.warn(err);
    } finally {
      setIsReady(true);
    }
  }

  useEffect(() => {
    SplashScreen.preventAutoHideAsync()
      .then(() => loadResourcesAndDataAsync())
      .finally(() => SplashScreen.hideAsync());
  }, []);

  if (!isReady) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="Movements" component={MovementsPage} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
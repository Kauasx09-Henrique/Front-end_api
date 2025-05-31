import 'react-native-gesture-handler';
import { Drawer, PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import DrawerRoutes from './src/Routes/DrawerRoutes.jsx'

export default function App() {
  return (
 <PaperProvider>
  <NavigationContainer>
    <DrawerRoutes/>
  </NavigationContainer>
 </PaperProvider>
  );
}
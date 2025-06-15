import { Button, Text, SafeAreaView, StyleSheet, TextInput, View, Image } from 'react-native';
import { useState } from 'react'
import { Icon } from 'react-native-elements';

// You can import supported modules from npm
import { Card } from 'react-native-paper';

// or any files within the Snack
import AssetExample from './components/AssetExample';

export default function App() {
  const [text, setText] = useState('');
  const handleSearch = () => {
    console.log("Search text:", text);

  }

  return (
    <SafeAreaView style={styles.body}>
      <div style={styles.navigation}>

        {/* Add example logo here */}
        <div style={{ display: 'flex', justifyContent: 'center', overflow: 'display' }}>
          <Image source={require('./assets/logoplaceholder.jpg')} style={{ width: '50px', height: '50px' }}></Image>

          <Text style={styles.paragraph}>
            TimelyMeals
          </Text>
        </div>

        <div>
          <Text style={styles.naviElement}>
            Link (Element)
          </Text>
          <Text style={styles.naviElement}>
            Sign in with Google (Element)
          </Text>
        </div>
      </div>
      <div style={{ margin: 'auto', marginTop: '10vw' }}>
        <Text style={{ fontSize: '2.3rem', alignSelf: 'flex-start' }}>
          What Would You Like to Eat?
        </Text>

        <div style={{ display: 'flex', }}>

          <TextInput
            placeholder='What would you like to eat?'
            placeholderTextColor={'#ccc'}
            style={styles.input}
            onChangeText={setText}
            value={text}
          />
          <button
            style={styles.searchButton}
            onClick={handleSearch}>
            <Icon name="arrow-right" type="entypo" size={24} color="white" />
          </button>

        </div>

        <Text style={{ color: '#FF0000' }}>
          Error Placeholder
        </Text>

      </div>

    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  navigation: {
    color: '#ffffff',
    backgroundColor: '#ff4545',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  naviElement: {
    padding: '5px',
    marginHorizontal: '5px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    borderWidth: '2px',
    borderColor: '#000000',
  },
  body: {
    flex: 1,
    justifyContent: 'flex-start',
    textAlign: 'left',
    backgroundColor: '#fef7ff',
    // textAlignVertical: 'bottom',
    padding: 8,
  },
  // container: {
  //   flex: 1,
  //   justifyContent: 'flex-start',
  //   backgroundColor: '#ecf0f1',
  //   // textAlignVertical: 'bottom',
  //   padding: 8,
  // },
  paragraph: {
    // justifyContent: 'flex-start',
    // margin: 24,
    color: '#ffffff',
    marginHorizontal: '24px',
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: 'bold',
    // textAlign: 'center',
  },
  input: {
    width: '40vw',
    height: 40,
    // margin: 'auto',
    borderRadius: '10px',
    // marginLeft: 'auto',
    marginVertical: '10px',
    borderWidth: 2,
    padding: 10,
  },
  searchButton: {
    color: '#000',
    width: 40,
    height: 40,
    margin: 3,
    paddingLeft: '10px',
    alignSelf: 'center',
    backgroundColor: '#ff0000',
    borderRadius: '10px',
    borderColor: '#000',
    borderWidth: '2px',
  },
});
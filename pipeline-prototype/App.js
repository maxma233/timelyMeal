import { Button, Text, SafeAreaView, StyleSheet, TextInput, View, Image, Pressable, ScrollView } from 'react-native';
import { useState, createContext, useEffect } from 'react'
import { Icon } from 'react-native-elements';
import QuestionnaireWindow from './components/QuestionnaireWindow'
import LoadingScreen from './components/LoadingScreen.js';
import ImageScroller from './components/ImageScroller';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// You can import supported modules from npm
import { Card } from 'react-native-paper';

// or any files within the Snack
import AssetExample from './components/AssetExample';
import { color } from 'react-native-elements/dist/helpers';

export const ButtonContext = createContext();

const RootStack = createNativeStackNavigator({
    screens: {
        Home: {
            screen: Home,
            options: {
              headerShown : false,
            }
        },
        // Profile: {},
    },
    initialRoutName: "Home",
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />
}

function Home() {

  // Loading in the model endpoint
  const modelEndpoint = process.env.EXPO_PUBLIC_MODEL_HOST_ENDPOINT;

  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isLoadingPlanRequest, setIsLoadingPlanRequest] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (isLoadingPlanRequest) {
      console.log('is showing the loading screen!')
    }
  }, [isLoadingPlanRequest]);

  const resetError = () => {
    setError('');
  }

  const handleSearch = async () => {
    const currentTime = new Date();

    resetError();

    // start loader
    setIsLoadingPlanRequest(true);
    // setLoadingProgress(5);

    if (text.length === 0 || !text.trim()) {
      console.log("Empty search text");
      setIsLoadingPlanRequest(false);
      setLoadingProgress(0);
      return;
    }

    try {
      // setLoadingProgress(20);

      const response = await fetch(`http://${modelEndpoint}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({ prompt: text.trim() }),
      });

      console.log(response);

      if (!response.ok) {
        setError(`Error: Invalid prompt!`);
        console.log('Invalid prompt!');
        setIsLoadingPlanRequest(false);
        setLoadingProgress(0);
        return;
      }

      const data = await response.json();
      console.log('Valid prompt!');
      console.log(`Request sent at: ${currentTime}`);

      // setLoadingProgress(45);

      // model request
      // setLoadingProgress(60);
      // const modelResp = await fetch('http://127.0.0.1:5000/model', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt: text.trim() }),
      // });

      // setLoadingProgress(80);

      // let output = undefined;
      // if (modelResp.ok) {
      //   output = await modelResp.json();
      // } else {
      //   setError(`Error: Model request failed (${modelResp.status})`);
      // }

      // if (!output) {
      //   setError('Error: Model output failed to instantiate!');
      // }

      // console.log(output);

      // setLoadingProgress(100);
      // setTimeout(() => {
      //   setIsLoadingPlanRequest(false);
      //   setLoadingProgress(0);
      // }, 250);
    } catch (err) {
      setError(`Error: ${err}`);
      setIsLoadingPlanRequest(false);
      setLoadingProgress(0);
    }

  }

  const handleNewPrompt = async (type) => {

    resetError();

    let output = undefined;

    const response = await fetch("http://127.0.0.1:5000/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: { category: type, prompt: text } })
      }
    ).then(
      async (value) => { output = await value.json() }
    ).catch(
      (reason) => {
        // Return an error instead
        setError(`Error: ${reason}`);
        // console.error(`Error: ${reason}`);
      }
    );

    if (!output) {
      setError(`Error: Model output failed to instantiate!`);
      // throw new Error("Model output failed to instantiate!");
    }

    console.log("Successful appending to dataset!");
  }

  return (
    <SafeAreaView style={styles.body}>
      <ButtonContext.Provider value={{ color: '#F44322' }}>
        <View style={styles.navigation}>

          {/* Add example logo here */}
          <View style={styles.brand}>
            <Image source={require('./assets/logoplaceholder.jpg')} style={styles.logo} />

            <Text style={styles.paragraph}>
              TimelyMeals
            </Text>
          </View>

          <View style={styles.navLinks}>
            <Text style={styles.naviElement}>
              Link (Element)
            </Text>
            <Text style={styles.naviElement}>
              Sign in with Google (Element)
            </Text>
          </View>
        </View>

        {isLoadingPlanRequest ?

          <LoadingScreen progress={loadingProgress} />

          // <View>
          //   <p>loading</p>
          // </View>
          :
          <>
            <View>

              {/* Put image scroller here */}
              <ImageScroller />

            </View>


            <ScrollView contentContainerStyle={styles.content}>


              {isLoadingPlanRequest ? 
                <LoadingScreen progress={loadingProgress} />
                :
                <QuestionnaireWindow setIsLoadingPlanRequest={setIsLoadingPlanRequest} />
              }


              {/* <Text style={{ fontSize: '2.3rem', alignSelf: 'flex-start' }}>
            What Would You Like to Eat?
            </Text> */}

          {/* <div style={{ display: 'flex', }}>

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

          </div> */}

          {/* <div
            style={{ display: 'flex' }}>
            <button
            style={{ ...styles.searchButton, ...styles.negativePromptButton }}
            onClick={() => {
              handleNewPrompt("Valid")
              }}
              >Should be valid</button>
              <button
              style={{ ...styles.searchButton, ...styles.positivePromptButton }}
              onClick={() => {
                handleNewPrompt("Invalid")
                }}
                >Should be invalid</button>
                </div> */}

              {
                
                error !== '' && <Text style={{ color: '#FF0000' }}>
                  {error}
                </Text>
              }

            </ScrollView>
          </>
        }

      </ButtonContext.Provider>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  navigation: {
    color: '#ffffff',
    backgroundColor: '#F44322',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  naviElement: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000000',
  },
  body: {
    flex: 1,
    backgroundColor: '#FEF1EE',
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
    marginHorizontal: 12,
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: 'bold',
    // textAlign: 'center',
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 16,
    maxWidth: 900,
    gap: 16,
  },
  input: {
    width: '100%',
    height: 40,
    // margin: 'auto',
    borderRadius: 10,
    // marginLeft: 'auto',
    marginVertical: 10,
    borderWidth: 2,
    padding: 10,
  },
  searchButton: {
    color: '#000',
    width: 40,
    height: 40,
    margin: 3,
    paddingLeft: 10,
    alignSelf: 'center',
    backgroundColor: '#ff0000',
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 2,
  },
  negativePromptButton: {
    width: 80,
    backgroundColor: '#0F0'
  },
  positivePromptButton: {
    width: 80,
  }
});
import { Button, Text, SafeAreaView, StyleSheet, TextInput, View, Image } from 'react-native';
import { useState } from 'react'
import { Icon } from 'react-native-elements';

// You can import supported modules from npm
import { Card } from 'react-native-paper';

// or any files within the Snack
import AssetExample from './components/AssetExample';

export default function App() {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const resetError = () => {
    setError('');
  }

  const handleSearch = async () => {

    resetError();

    if (text.length === 0 || !text.trim()) {
      console.log("Empty search text");
      return;
    }

    // const form = new FormData();
    // form.append("prompt", text);

    const response = await fetch('http://127.0.0.1:5000/prompt',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: text.trim() }),
      });


    console.log(response);

    // ON BAD CASE: Update UI
    if (!response.ok) {
      setError(`Error: Invalid prompt!`);
      console.log("Invalid prompt!");
      return;
      // throw new Error(`Server Error: ${response.status}`);
    }

    // Update UI to state valid case
    const data = await response.json();
    console.log("Valid prompt!");

    // Send request to the backend to prompt model

    let output = undefined;

    const modelRequest = await fetch('http://127.0.0.1:5000/model',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: text.trim() })
      }
    ).then(async (value) => {
      output = await value.json()
    }).catch(
      (reason) => {
        // Return an error instead
        setError(`Error: ${reason}`);
        console.error(`Error: ${reason}`);
      }
    );

    // // Something went wrong when trying to grab the model's output
    if (!output) {
      setError(`Error: Model output failed to instantiate!`);
      throw new Error("Model output failed to instantiate!");
    }

    // Update UI from the model output

    console.log(output);

    // console.log(data.message);

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
        console.error(`Error: ${reason}`);
      }
    );

    if (!output) {
      setError(`Error: Model output failed to instantiate!`);
      throw new Error("Model output failed to instantiate!");
    }

    console.log("Successful appending to dataset!");
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

        <div
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
        </div>

        {
          error !== '' && <Text style={{ color: '#FF0000' }}>
            {error}
          </Text>
        }

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
  negativePromptButton: {
    width: 80,
    backgroundColor: '#0F0'
  },
  positivePromptButton: {
    width: 80,
  }
});
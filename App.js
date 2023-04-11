import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const heightKey = '@MyApp:heightKey';
const bmikey = '@MyApp:bmikey';

SplashScreen.preventAutoHideAsync();
  setTimeout(SplashScreen.hideAsync, 2000);


export default class App extends Component {
  state = {
    weight: '',
    height: '',
    bmi: '',
  };

  constructor() {
    super();
    this.onLoad();
  }

  onLoad = async () => {
    try {
      const height = await AsyncStorage.getItem(heightKey);
      this.setState({ height });

      const bmi = await AsyncStorage.getItem(bmikey);
      this.setState({ bmi: bmi });
      
    } catch (error) {
      Alert.alert('Error', 'There was an error while loading the data');
    }
  }

  onSave = async () => {
    const { weight, height } = this.state;
    this.setState({ bmi: ''});
    const bmi = "Body Mass Index is " + ((weight / (height * height)) * 703).toFixed(1)
    this.setState({ bmi })

    try {
      await AsyncStorage.setItem(bmikey, bmi);
      await AsyncStorage.setItem(heightKey, height);
    } catch (error) {
      Alert.alert('Error', 'There was an error while saving the data');
    }
  }

  onHeightChange = (height) => this.setState({ height });
  onWeightChange = (weight) => this.setState({ weight });

  render() {
    const { bmi, height } = this.state;

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.toolbar}>BMI Calculator</Text>
          <TextInput
            onChangeText={this.onWeightChange}
            placeholder="Weight in Pounds"
            style={styles.input}
          />
          <TextInput
            onChangeText={this.onHeightChange}
            value={height}
            style={styles.input}
            placeholder="Height in Inches"
          />
          <TouchableOpacity 
          onPress={this.onSave}
          style={styles.button}>
            <Text style={styles.buttonText} >Compute BMI</Text>
          </TouchableOpacity>
          <Text style={styles.bmiText}>{ bmi }</Text>
          <Text style={styles.heading}>Assessing Your BMI
          </Text>
          <Text style={styles.underHeading}>Underweight: less than 18.5</Text>
          <Text style={styles.underHeading}>Healthy 18.5 to 24.9</Text>
          <Text style={styles.underHeading}>Overweight: 25.0 to 29.9</Text>
          <Text style={styles.underHeading}>Obese: 30.0 or higher</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    borderRadius: 3,
    width: 300,
    height: 40,
    padding: 5,
    marginTop: 10,
    marginLeft:40,
    fontSize: 24,
  },
  button: {
    backgroundColor: '#34495e',
    padding: 10,
    width: 300,
    marginLeft:40,
    borderRadius: 3,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
  },
  toolbar: {
    textAlign: 'center',
    backgroundColor: '#f4511e',
    fontSize: 28,
    padding: 20,
    fontWeight: 'bold',
    color: 'white',
    height: 75,
  },
  bmiText: {
    fontSize: 28,
    margin: 40,
  },
  heading:{
    fontSize:20,
  },
  underHeading: {
    fontSize:20,
    paddingLeft: 20,
  },
});
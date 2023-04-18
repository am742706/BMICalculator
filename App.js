import React, { Component } from 'react';

import { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";


SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

function Items() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select height, weight, bmi, date(date) as date from item order by date desc`, [],
        (_, { rows: { _array } }) => setItems(_array)
      );
    });
  }, []);

  if (items === null || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.heading}>BMI History</Text>
      {items.map(({ id, height, weight, bmi, date }) => (
          <Text style={styles.underHeading}>{date} : {bmi} (W:{weight}, H:{height})</Text>
      ))}
    </View>
  );
}


export default function App() {
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [bmi, setBmi] = useState(null);
  //const [description, setDescription] = useState(null);



  useEffect(() => {
    db.transaction((tx) => {
      // tx.executeSql(
      //   "drop table item;"
      // );
      tx.executeSql(
        "create table if not exists item (id integer primary key not null, height integer, weight integer, bmi numeric, date real);"
      );
    });
  }, []);

  onSave = async () => {
    if (height === null || height === "") {
      return false;
    }

    setBmi(((weight / (height * height)) * 703).toFixed(1));

    db.transaction(
      (tx) => {
        tx.executeSql("insert into item (bmi, height, weight, date) values (?, ?, ?, julianday('now'))", [((weight / (height * height)) * 703).toFixed(1), height, weight]);
        tx.executeSql("select * from item", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null
    );
  }

  const description = (bmi) => {
    if( bmi === null){
      return null;
    } else if(bmi <= 18.5){
      return ("(Underweight)");
    } else if (bmi <= 24.9 ){
      return ("(Healthy)");
    } else if (bmi <= 29.9){
      return ("(Overweight)");
    } else{
      return ("(Obese)");
    }
  }


    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.toolbar}>BMI Calculator</Text>
          <TextInput
            onChangeText={x => setWeight(x)}
            placeholder="Weight in Pounds"
            style={styles.input}
          />
          <TextInput
            onChangeText={x => setHeight(x)}
            value={height}
            style={styles.input}
            placeholder="Height in Inches"
          />
          <TouchableOpacity 
          onPress={() => {
            onSave();
          }}
          style={styles.button}>
            <Text style={styles.buttonText} >Compute BMI</Text>
          </TouchableOpacity>
          <Text style={styles.bmiText}>Body Mass Index is { bmi }</Text>
          <Text style={styles.bmiText}>{ description(bmi) }</Text>
          <Items />
        </View>
      </View>
    );
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
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 28,
  },
  heading:{
    fontSize:23,
    paddingLeft: 20,
    fontWeight: 'bold',
  },
  underHeading: {
    fontSize:20,
    paddingLeft: 20,
  },
});
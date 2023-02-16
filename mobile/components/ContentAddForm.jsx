/**
 *  Imports
 */
// Import dependecies
import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
//_________________________________________________________

/**
 *  Component function start
 */
const ContentAddForm = (props) => {
  /**
   *  State section
   */
  const [addValue, setAddValue] = useState(); // Define state which will hold changes in input field
  //_______________________________________________________

  /**
   *  Functions secton
   */
  function handleSubmit() {
    if (addValue) props.onAdd(addValue); // Chceck if addValue holds data, if yes send them to parent by props callback

    setAddValue(""); // Set our state to an empty string
  }
  //_______________________________________________________

  /**
   *  DOM model section
   */
  return (
    <>
      <TextInput
        autoFocus
        style={styles.addInput}
        onChangeText={(text) => {
          setAddValue(text);
        }}
        value={addValue}
        onSubmitEditing={handleSubmit}
        blurOnSubmit={true}
      />
      <TouchableOpacity onPress={handleSubmit}>
        <View style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </View>
      </TouchableOpacity>
    </>
  );
  //_______________________________________________________
};
//_#Component_function_end__________________________________

/**
 *  Styles section
 */
const styles = StyleSheet.create({
  addInput: {
    width: "75%",
    height: 40,
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: "black",
    fontSize: 17,
  },
  addButton: {
    width: 55,
    height: 37,
    padding: 0,
    backgroundColor: "#006eff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: "black",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
//_____________________________________________________________

// Export component
export default ContentAddForm;

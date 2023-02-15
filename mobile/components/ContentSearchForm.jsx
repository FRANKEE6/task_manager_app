// Import dependecies
import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Component function start
const ContentSearchForm = (props) => {
  // Define state which will hold changes in input field
  const [searchValue, setSearchValue] = useState();

  // Runs on submit
  function handleSubmit() {
    if (searchValue) props.onSearch(searchValue); // Chceck if searchValue holds data, if yes send them to parent by props callback

    setSearchValue(""); // Set our state to an empty string
  }

  return (
    <>
      <TextInput
        autoFocus
        style={styles.searchInput}
        onChangeText={(text) => {
          setSearchValue(text);
        }}
        value={searchValue}
        onSubmitEditing={handleSubmit}
        blurOnSubmit={true}
      />
      <TouchableOpacity onPress={handleSubmit}>
        <View style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Add</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

// Define styles for component
const styles = StyleSheet.create({
  searchInput: {
    width: "75%",
    height: 40,
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: "black",
    fontSize: 17,
  },
  searchButton: {
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
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

// Export component
export default ContentSearchForm;

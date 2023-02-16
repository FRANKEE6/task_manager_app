/**
 *  Imports
 */
// Import dependencies
import React from "react";
import {
  TextInput,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";

// Import npm package
import CheckBox from "@react-native-community/checkbox";
//_________________________________________________________

/**
 *  Component function start
 */
const ContentList = (props) => {
  /**
   *  Props recieving section
   */
  const tasks = props.tasks; // Get tasks from props
  //_________________________________________________________

  /**
   *  DOM model section
   */
  // If no tasks were send by props, let user know there are no tasks
  if (tasks.length === 0) {
    return <Text style={styles.addText}>Add your first task please</Text>;
  }

  // Else show tasks in list
  else {
    return (
      <View>
        {tasks.map((task) => (
          <View
            key={task.id}
            style={[
              task.done === false ? styles.clear : styles.faded,
              styles.listItem,
            ]}
          >
            <CheckBox
              value={task.done}
              onValueChange={() => props.onEdit(task.id, "check-change")}
              style={styles.checkbox}
            />
            <TextInput
              defaultValue={task.text}
              onSubmitEditing={(event) =>
                props.onEdit(task.id, "edit-text", event.nativeEvent.text)
              }
              style={styles.text}
            />
            <TouchableOpacity onPress={() => props.onEdit(task.id, "delete")}>
              <View style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>X</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }
  //_______________________________________________________
};
//_#Component_function_end__________________________________

/**
 *  Styles section
 */
const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  faded: {
    opacity: 0.6,
  },
  clear: {
    opacity: 1,
  },
  checkbox: {
    margin: 0,
    padding: 0,
  },
  text: {
    width: "75%",
  },
  deleteButton: {
    height: 30,
    width: 30,
    borderRadius: 30,
    borderColor: "#006eff",
    borderWidth: 4,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#006eff",
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 22,
  },
  addText: {
    textAlign: "center",
    fontStyle: "italic",
  },
});
//_____________________________________________________________

// Export component
export default ContentList;

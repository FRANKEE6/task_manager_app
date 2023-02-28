/**
 *  Imports
 */
// Import dependencies
import React, { createRef } from "react";
//_________________________________________________________

/**
 *  Component function start
 */
const ContentAddForm = (props) => {
    /**
     *  Data section
     */
    const addInput = createRef(); // Create ref for our add input so we can access value of it
    //_________________________________________________________

    /**
     *  Functions section
     */
    // Function listening to key press in our imput field
    const handleSubmitEnter = (event) => {
        if (event.key === "Enter"){         // If key pressed was enter
            event.preventDefault()          // Prevent page reload
            logInput();                     // Call function to process data
            addInput.current.value = "";    // Clear input field
        }
    }

    // Function listening to "Add" button press
    const handleSubmitButton = (event) => {
        event.preventDefault()              // Prevent page reload
        logInput();                         // Call function to process data
        addInput.current.value = "";        // Clear input field
    }

    // Function which processes data from input field
    const logInput = () => {
        let addString = addInput.current?.value;    // Retrieve value from input field
        if (addString) props.onAdd(addString);      // If value exists, send it to parent
    }
    //_________________________________________________________

    /**
     *  DOM model section
     */
    return (
        <form 
            onKeyPress={handleSubmitEnter}
            onSubmit={handleSubmitButton}
            >
            <input
                type="text"
                ref={addInput}
                className="add-field"
                autoFocus
            />
            <input
                type="submit"
                value="Add"
                className="submit-button"
            />
        </form>
    );
    //________________________________________________________
};
//_#Component_function_end__________________________________

// Export component
export default ContentAddForm;
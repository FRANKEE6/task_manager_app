// Import dependencies
import React, { createRef } from "react";

// Component function start
const ContentAddForm = (props) => {
    // Create ref for our add input so we can access value of it
    const addInput = createRef();

    // Function listening to key press in our imput field
    function handleSubmitEnter(event) {
        if (event.key === "Enter"){         // If key pressed was enter
            event.preventDefault()          // Prevent page reload
            logInput();                     // Call function to process data
            addInput.current.value = ""; // Clear input field
        }
    }

    // Function listening to "Add" button press
    function handleSubmitButton(event) {
        event.preventDefault()              // Prevent page reload
        logInput();                         // Call function to process data
        addInput.current.value = "";     // Clear input field
    }

    // Function which processes data from input field
    const logInput = () => {
        let addString = addInput.current?.value;  // Retrieve value from input field
        if (addString) props.onAdd(addString); // If value exists, send it to parent
    }

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
}

// Export component
export default ContentAddForm;
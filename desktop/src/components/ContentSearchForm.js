// Import dependencies
import React, { createRef } from "react";

// Component function start
const ContentSearchForm = (props) => {
    // Create ref for our search input so we can access value of it
    const searchInput = createRef();

    // Function listening to key press in our imput field
    function handleSubmitEnter(event) {
        if (event.key === "Enter"){         // If key pressed was enter
            event.preventDefault()          // Prevent page reload
            logInput();                     // Call function to process data
            searchInput.current.value = ""; // Clear input field
        }
    }

    // Function listening to "Add" button press
    function handleSubmitButton(event) {
        event.preventDefault()              // Prevent page reload
        logInput();                         // Call function to process data
        searchInput.current.value = "";     // Clear input field
    }

    // Function which processes data from input field
    const logInput = () => {
        let searchString = searchInput.current?.value;  // Retrieve value from input field
        if (searchString) props.onSearch(searchString); // If value exists, send it to parent
    }

    return (
        <form 
            onKeyPress={handleSubmitEnter}
            onSubmit={handleSubmitButton}
            >
            <input
                type="text"
                ref={searchInput}
                className="search-field"
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
export default ContentSearchForm;
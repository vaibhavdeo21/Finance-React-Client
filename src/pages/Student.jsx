/**
 * JSX stands for JavaScript XML.
 * It looks like HTML, but it's actually JavaScript code that React converts into HTML.
 * * RULE: Every component must return ONE single parent wrapper (like a <div> or <>).
 */
function Student() {
    // These are local variables. They live only inside this function.
    let name = "Tommy";
    let rollNumber = 10;

    // The return statement is what shows up on the screen.
    return (
        <> {/* This is a Fragment. It groups things without adding an extra <div> to the HTML. */}
            <p>
                {/* We use curly braces {} to switch from HTML mode back to JavaScript mode.
                   This lets us put the variable 'name' inside the text.
                */}
                Student Name : {name}
                <br/> {/* Standard HTML line break */}
                Roll Number : {rollNumber}
            </p>
        </>
    );
}

// We export this function so other files (like App.jsx) can use it.
export default Student;
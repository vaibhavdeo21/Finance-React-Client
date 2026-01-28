// We receive name, rollNumber, and percentage from the parent.
function Student3({ name, rollNumber, percentage }) {
    return (
        <>
            {/* LOGIC: If percentage is greater than 33...
               The '&&' operator means: "If the left side is TRUE, then render the right side."
            */}
            {percentage > 33.0 && (
                <p>
                    Student Name : {name}
                    <br/>
                    Roll Number : {rollNumber}
                    <br/>
                    Percentage : {percentage}
                    <br/>
                    {/* Hardcoded result because we know they passed */}
                    Result : PASS
                </p>
            )}

            {/* LOGIC: If percentage is 33 or less...
               This block only appears if the student failed.
            */}
            {percentage <= 33.0 && (
                <p>
                    Student Name : {name}
                    <br/>
                    Roll Number : {rollNumber}
                    <br/>
                    Percentage : {percentage}
                    <br/>
                    Result : FAIL
                </p>
            )}
        </>
    )
}

export default Student3;
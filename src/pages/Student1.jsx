// Here we are receiving data (props) from the parent.
// { name = "Pluto", rollNumber = 8 } does two things:
// 1. DESTRUCTURING: It extracts 'name' and 'rollNumber' directly so we don't have to type 'props.name'.
// 2. DEFAULT VALUES: If the parent doesn't send a name, it will automatically use "Pluto".
function Student1({ name = "Pluto", rollNumber = 8 }) {
    return (
        <>
            <p>
                {/* We can use the variables directly because we extracted them above */}
                Student1 Name : {name}
                <br/>
                Roll Number : {rollNumber}
            </p>
        </>
    );
}

export default Student1;
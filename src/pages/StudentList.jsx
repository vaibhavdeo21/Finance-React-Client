// We import the Card component (Student3) because we are going to use it many times.
import Student3 from "./Student3";

// We receive a list (Array) of students.
function StudentList({ students }) {
    return (
        <>
            <h2> Student List </h2>
            {/* .map() is a loop. It goes through every item in the 'students' array.
               For every 'student' in the list, it runs this code.
            */}
            {students.map((student, index) => (
                <Student3
                    // KEY: This is CRITICAL. React needs a unique ID for every item in a list 
                    // so it knows which one to update if data changes. We use 'index' here.
                    key={index}
                    
                    // We pass the data down to the child component
                    name={student.name}
                    rollNumber={student.rollNumber}
                    percentage={student.percentage}
                />
            ))}
        </>
    );
}

export default StudentList;
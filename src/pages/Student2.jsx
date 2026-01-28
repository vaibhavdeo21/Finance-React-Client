/**
 * Here, we take the entire bundle of data as one object called 'props'.
 * 'props' stands for Properties.
 */
function Student2(props) {

    return (
        <>
            <p>
                {/* Since we didn't extract the variables, we have to look inside the 
                   'props' bag every time we want something.
                   props.name -> Look inside props and give me 'name'.
                */}
                Student Name : {props.name}
                <br/>
                Roll Number : {props.rollNumber}
            </p>
        </>
    );
}

export default Student2;
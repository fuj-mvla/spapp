

const Button = ({text,logIn})=>{
    return (
        <div>
        <button onClick={logIn}>{text}</button>
        </div>
    )
}

export default Button
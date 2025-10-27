import styles from "./Button.module.css";

export default function Button({ variant, children, onClick, type = 'button' }){
    let buttonClass = styles.btn;

    if(variant){
        buttonClass += ` ${styles[variant]}`;
    }

    return (
    <>
        <button 
        type={type}
        onClick={onClick}
        className={buttonClass}>
            {children}
        </button>
    </>
    )
}
type Props = {
    isTransparent?: boolean,
    type?: ButtonType,
    onclick?: ()=>void,
    children: React.ReactNode;
}

export enum ButtonType {
    button = "button",
    submit = "submit",
    reset = "reset"
}

export const Button = ({isTransparent, type = ButtonType.button, onclick, children }: Props) => {
    return <button 
    className={isTransparent? "transparent": "solid"} 
    type={type}
    onClick={onclick}> {children}
    </button>
}
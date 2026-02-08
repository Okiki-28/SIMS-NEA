type Props = {
    isTransparent?: boolean,
    type?: ButtonType,
    onclick?: ()=>void,
    className?: string,
    children: React.ReactNode,
    stopPropagation?: Boolean,
}

export enum ButtonType {
    button = "button",
    submit = "submit",
    reset = "reset"
}

export const Button = ({isTransparent, type = ButtonType.button, onclick, className, stopPropagation, children }: Props) => {
    return <button 
    className={isTransparent? `transparent ${className}`: `solid ${className}`} 
    type={type}
    onClick={(e) => {
        stopPropagation && e.stopPropagation()
        onclick?.();
    }}> {children}
    </button>
}
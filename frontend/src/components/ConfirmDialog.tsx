import { Button } from "./Button"

export const ConfirmDialog = ({message, onClose, proceedFunc, isActive}: any) => {
    
    return (
        <div className={isActive? "active dialog-box": "dialog-box"}>
            <div className="box">
                <p>{message}</p>
                <div className="button-group">
                    <Button onclick={onClose}>No</Button>
                    <Button className="cancel" onclick={proceedFunc}>Yes</Button>
                </div>
            </div>
        </div>
    )
}
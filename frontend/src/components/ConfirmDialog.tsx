import { Button } from "./Button"

export const ConfirmDialog = ({message, closeDialog, proceedFunc, isActive}: any) => {
    return (
        <div className={isActive? "active dialog-box": "dialog-box"}>
            <div className="box">
                <p>{message}</p>
                <div className="button-group">
                    <Button onclick={closeDialog}>No</Button>
                    <Button onclick={proceedFunc}>Yes</Button>
                </div>
            </div>
        </div>
    )
}
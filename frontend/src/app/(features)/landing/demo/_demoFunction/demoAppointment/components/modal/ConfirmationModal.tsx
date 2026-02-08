import { X, CircleCheck } from "lucide-react";
import Image from "next/image";
import greenCheckMark from "../../../../../../../../../public/_assets/icons/green-check-mark.png"

interface ConfirmationModalProps {
    name: string;
    time: string;
    date: string;
    onClose: () => void;
}

const ConfirmationModal = ({name, time, date, onClose}: ConfirmationModalProps) => {
    return (
        <div className="confModal-overlay" onClick={onClose}>
            <div className="confModal-content" onClick={(e) => e.stopPropagation}>
                <div className="confModal-confirmation-icon">
                    <Image
                        src={greenCheckMark}
                        alt="Check mark Icon"
                        className="confModal-icon"
                    />
                </div>
                <div className="confModal-confirmation-message">
                    <p>Appointment set for <strong>{name}</strong>, on <strong>{date}</strong> at <strong>{time}</strong>!</p>
                </div>
                <button onClick={onClose} className="confModal-confirm-close-btn">
                    OK
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
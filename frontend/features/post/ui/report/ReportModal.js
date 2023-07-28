import { Modal } from "@/shared/ui/modal/Modal";

export const ReportModal = ({ isOpen, onClose, onSubmitModal }) => {
    return (
        <Modal
            modalName="reportModal"
            isOpen={isOpen}
            onClose={onClose}
        >
            <p className="text-lg font-bold">What is your reason for reporting this post?</p>
            <form
                id="createReportForm"
                action="#"
                onSubmit={onSubmitModal}
            >
                <textarea
                    className="my-2 p-1 mx-2"
                    id="reportReasonInput"
                    aria-label="Submit a report on a post."
                    type="textarea"
                    spellCheck="true"
                    name="report_reason_input"
                />
                <input
                    className="formButtonDefault outline-white border my-1"
                    type="submit"
                    value="Submit report"
                />
            </form>
        </Modal>
    );
};

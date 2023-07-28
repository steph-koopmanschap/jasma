import React, { useState } from "react";

export function Modal(props) {
    const { modalName, isOpen, onClose } = props;

    return (
        <div id={modalName}>
            {isOpen ? (
                <div className="fixed top-0 left-0 w-full h-full bg-black/[.06]">
                    <section className="fixed top-2/4 left-2/4 bg-white -translate-x-2/4 -translate-y-2/4 w-9/12 h-auto">
                        <button
                            className="m-2 text-black hover:text-red-600"
                            onClick={onClose}
                        >
                            X
                        </button>
                        {props.children}
                    </section>
                </div>
            ) : null}
        </div>
    );
}

//OLD CODE

// export default function Modal(props) {
//     const [modalState, setModalState] = useState(props.modalState);

//     const closeModal = () => {
//         setModalState(false);
//     }

//     return (
//         <div id={`${props.modalName}`}>

//         {modalState ?
//             <div className="fixed top-0 left-0 w-full h-full bg-black/[.06]">
//                 <secion className="fixed top-2/4 left-2/4 bg-white -translate-x-2/4 -translate-y-2/4 w-9/12 h-auto">
//                     <button className="m-2 text-black hover:text-red-600" onClick={closeModal}>X</button>
//                     {props.children}
//                 </secion>
//             </div>
//         :
//         null}

//         </div>
//     );
// }

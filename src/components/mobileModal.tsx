import type { ReactNode } from "react";

function MobileModal({ children }: { children: ReactNode }) {
    return (
        <>
            <div id="myModal" className="mob-modal">
                {/* <!-- Modal content --> */}

                <div className="mob-modal-content"> {children}</div>
            </div>
        </>
    );
}

export default MobileModal;

import React from "react";

/** A short light trail follows the input's actual rounded border. */
export function InputBorderTrail(): React.JSX.Element {
    return (
        <svg className="signup-border-trail" aria-hidden="true" focusable="false">
            <rect className="signup-border-trail-line" pathLength="100" />
        </svg>
    );
}

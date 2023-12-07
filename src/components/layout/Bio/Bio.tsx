import React from "react"
import { Link } from "gatsby"
import { BioSharedText } from "./BioSharedText"
import { SignatureText } from "./SignatureText"
import { BioLead } from "./BioLead"

export default function Bio() {
    return (
        <>
            <div
                style={{
                    display: `flex`,
                    flexDirection: `column`,
                    marginBottom: `2.5rem`,
                    position: `relative`, // for canvas issue
                    zIndex: 10, // for canvas issue
                }}
            >
                <BioLead />
                <BioSharedText />
                <p>
                    You can checkout more about my company, SaaS products, and
                    site portfolio on <Link to="/chris">my bio page</Link>.
                </p>
                <SignatureText />
            </div>
        </>
    )
}

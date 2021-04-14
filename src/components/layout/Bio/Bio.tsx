import React from "react"
import { Link } from "gatsby"
import { BioSharedText } from "./BioSharedText"
import { SignatureText } from "./SignatureText"
import { AvatarPicture } from "../../utils/AvatarPicture"

export default function Bio() {
    return (
        <>
            <AvatarPicture style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: `100%`,
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    width: "200px",
                    height: "auto"
                }}/>
            <div
                style={{
                    display: `flex`,
                    flexDirection: `column`,
                    marginBottom: `2.5rem`,
                    position: `relative`, // for canvas issue
                    zIndex: 10, // for canvas issue
                }}
            >
                <p style={{ textAlign: "center" }}>
                    <strong>Hi! I'm Chris!</strong>
                </p>
                <BioSharedText/>
                <p>
                    You can checkout more about my company, SaaS products, and
                    site portfolio on <Link to="/chris">my bio page</Link>.
                </p>
                <SignatureText/>
            </div>
        </>
    )
}

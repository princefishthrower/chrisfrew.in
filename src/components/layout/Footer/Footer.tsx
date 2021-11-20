import * as React from "react"
import { MessageOfTheDay } from "../Header/MessageOfTheDay"

export function Footer() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <footer>
                <MessageOfTheDay />
            </footer>
        </div>
    )
}

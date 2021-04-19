import * as React from "react"
import { ReactNode } from "react"
import Sparkles from "../../utils/Sparkles"

export interface IStatTileProps {
    stat: string | number
    label: ReactNode
}

export function StatTile(props: IStatTileProps) {
    const { stat, label } = props
    return (
        <div className="stat-tile">
            <h3>
                <span style={{ fontSize: "2rem", letterSpacing: "0.1rem" }}>
                    <Sparkles>{stat}</Sparkles>
                </span>
            </h3>
            <p><b>{label}</b></p>
        </div>
    )
}

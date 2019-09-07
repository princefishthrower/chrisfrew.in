import React from "react"
import DefaultProfilePicture from "../images/defaultprofilepicture.jpg"
import { rhythm } from '../utils/typography'

class BioPicture extends React.Component {
    render () {
        return (
            <img
                src={DefaultProfilePicture} 
                alt={`Chris Frewin`}
                style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                width: rhythm(8),
                height: rhythm(8),
                borderRadius: '100%',
                zIndex:999
                }}
            />
        )
    }
}

export default BioPicture;
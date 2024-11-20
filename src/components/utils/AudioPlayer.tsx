import * as React from "react"

export interface IAudioPlayerProps {
    audioSrc: string
}

const AudioPlayer = (props: IAudioPlayerProps) => {
    const { audioSrc } = props
    return (
        <div style={{display:"flex", flexDirection:"column", justifyContent: "center", alignItems:"center", fontSize: "0.75rem", margin:"5px"}}>
            <i>Listen to AI Chris™ read this post aloud:</i>
            <audio src={audioSrc} preload="auto" controls={true} style={{margin:"5px"}}/>
            <i>
                Brought to you by
                <a href="https://github.com/codevideo/pontificator"><code>pontificator</code></a>, a{' '}
                <a href="https://studio.codevide.io">CodeVideo</a> &{' '}
                <a href="https://fullstackcraft.com">Full Stack Craft</a> product.
            </i>
        </div>
    )
}

export default AudioPlayer
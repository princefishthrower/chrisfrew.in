import * as React from "react"
import { AsciiLine } from "../../utils/Ascii/AsciiLine"
import { useState } from "react"
import Constants from "../../../constants/Constants"
import { useTimeout } from "../../../hooks/useTimeout"
import { SubscribeInput } from "./SubscribeInput"
import { CloseButton } from "./CloseButton"
import { useCookies } from "react-cookie"

export function LaptopSubscriber() {
    const [cookies, setCookies] = useCookies([
        Constants.LAPTOP_SUBSCRIBER_COOKIE_KEY,
    ])
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const flyInDelay = 3000

    useTimeout(() => setIsVisible(true), flyInDelay)

    // if we should not show, or the user has already opted out, don't
    if (cookies[Constants.LAPTOP_SUBSCRIBER_COOKIE_KEY] === "false" || !isVisible) {
        return <></>
    }

    return (
        <div className="laptop-subscriber animated large-only">
            <form
                action="https://chrisfrew.us19.list-manage.com/subscribe/post?u=5f7289fbe97df30f673068826&amp;id=b1729bbdce"
                method="post"
                target="_blank"
                noValidate
            >
                <pre>{` ______________`}</pre>
                <pre>{`||            ||`}</pre>
                <AsciiLine
                    delay={flyInDelay}
                    interval={Constants.LAPTOP_SUBSCRIBER_INTERVAL}
                    lines={[
                        `||            ||`,
                        `||    H       ||`,
                        `||    HE      ||`,
                        `||    HEY     ||`,
                        `||    HEY,    ||`,
                    ]}
                    repeat={false}
                />
                <AsciiLine
                    delay={
                        flyInDelay + Constants.LAPTOP_SUBSCRIBER_INTERVAL * 5
                    }
                    interval={Constants.LAPTOP_SUBSCRIBER_INTERVAL}
                    lines={[
                        `||            ||`,
                        `||    L       ||`,
                        `||    LI      ||`,
                        `||    LIK     ||`,
                        `||    LIKE    ||`,
                    ]}
                    repeat={false}
                />
                <AsciiLine
                    delay={
                        flyInDelay + Constants.LAPTOP_SUBSCRIBER_INTERVAL * 10
                    }
                    interval={Constants.LAPTOP_SUBSCRIBER_INTERVAL}
                    lines={[
                        `||            ||`,
                        `||  T         ||`,
                        `||  TH        ||`,
                        `||  THE       ||`,
                        `||  THE       ||`,
                        `||  THE B     ||`,
                        `||  THE BL    ||`,
                        `||  THE BLO   ||`,
                        `||  THE BLOG  ||`,
                        `||  THE BLOG? ||`,
                    ]}
                    repeat={false}
                />
                <AsciiLine
                    delay={
                        flyInDelay + Constants.LAPTOP_SUBSCRIBER_INTERVAL * 20
                    }
                    interval={Constants.LAPTOP_SUBSCRIBER_INTERVAL}
                    lines={[
                        `||            ||`,
                        <SubscribeInput text={`<           `}></SubscribeInput>,
                        <SubscribeInput text={`<S          `}></SubscribeInput>,
                        <SubscribeInput text={`<Su         `}></SubscribeInput>,
                        <SubscribeInput text={`<Sub        `}></SubscribeInput>,
                        <SubscribeInput text={`<Subs       `}></SubscribeInput>,
                        <SubscribeInput text={`<Subsc      `}></SubscribeInput>,
                        <SubscribeInput text={`<Subscr     `}></SubscribeInput>,
                        <SubscribeInput text={`<Subscri    `}></SubscribeInput>,
                        <SubscribeInput text={`<Subscrib   `}></SubscribeInput>,
                        <SubscribeInput text={`<Subscribe  `}></SubscribeInput>,
                        <SubscribeInput text={`<Subscribe! `}></SubscribeInput>,
                        <SubscribeInput text={`<Subscribe!>`}></SubscribeInput>,
                    ]}
                    repeat={false}
                />
                <AsciiLine
                    delay={
                        flyInDelay + Constants.LAPTOP_SUBSCRIBER_INTERVAL * 32
                    }
                    interval={Constants.LAPTOP_SUBSCRIBER_INTERVAL}
                    lines={[
                        `||            ||`,
                        <CloseButton text={`<           `} onClickCallback={() => { setCookies(Constants.LAPTOP_SUBSCRIBER_COOKIE_KEY, false); setIsVisible(false)}}/>,
                        <CloseButton text={`<C          `} onClickCallback={() => { setCookies(Constants.LAPTOP_SUBSCRIBER_COOKIE_KEY, false); setIsVisible(false)}}/>,
                        <CloseButton text={`<CL         `} onClickCallback={() => { setCookies(Constants.LAPTOP_SUBSCRIBER_COOKIE_KEY, false); setIsVisible(false)}}/>,
                        <CloseButton text={`<CLO        `} onClickCallback={() => { setCookies(Constants.LAPTOP_SUBSCRIBER_COOKIE_KEY, false); setIsVisible(false)}}/>,
                        <CloseButton text={`<CLOS       `} onClickCallback={() => { setCookies(Constants.LAPTOP_SUBSCRIBER_COOKIE_KEY, false); setIsVisible(false)}}/>,
                        <CloseButton text={`<CLOSE      `} onClickCallback={() => { setCookies(Constants.LAPTOP_SUBSCRIBER_COOKIE_KEY, false); setIsVisible(false)}}/>,
                        <CloseButton text={`<CLOSE 4    `} onClickCallback={() => { setCookies(Constants.LAPTOP_SUBSCRIBER_COOKIE_KEY, false); setIsVisible(false)}}/>,
                        <CloseButton text={`<CLOSE 4E   `} onClickCallback={() => { setCookies(Constants.LAPTOP_SUBSCRIBER_COOKIE_KEY, false); setIsVisible(false)}}/>,
                        <CloseButton text={`<CLOSE 4EV  `} onClickCallback={() => { setCookies(Constants.LAPTOP_SUBSCRIBER_COOKIE_KEY, false); setIsVisible(false)}}/>,
                        <CloseButton text={`<CLOSE 4EVR `} onClickCallback={() => { setCookies(Constants.LAPTOP_SUBSCRIBER_COOKIE_KEY, false); setIsVisible(false)}}/>,
                        <CloseButton text={`<CLOSE 4EVR>`} onClickCallback={() => { setCookies(Constants.LAPTOP_SUBSCRIBER_COOKIE_KEY, false); setIsVisible(false)}}/>,
                    ]}
                    repeat={false}
                />
                <pre>{`||____________||`}</pre>
                <pre>{` \\\\############\\\\`}</pre>
                <pre>{`  \\\\############\\\\`}</pre>
                <pre>{`   \\      ____    \\`}</pre>
                <pre>{`    \\_____\\___\\____\\`}</pre>
            </form>
        </div>
    )
}

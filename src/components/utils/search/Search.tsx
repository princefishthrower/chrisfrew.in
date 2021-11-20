import * as React from "react"
import { useRef } from "react"
import { useContext, useState } from "react"
import { SearchContext } from "../../../context/search/SearchContext"

export function Search() {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const inputClassName = isOpen ? "input open" : "input"
    const handleClassName = isOpen ? "handle open" : "handle"
    const searchDivClassName = isOpen ? "search-div open" : "search-div closed"

    const { query, setQuery } = useContext(SearchContext)

    const openIfClosed = () => {
        if (!isOpen) {
            setIsOpen(true)
        }
    }

    const onClickClear = () => {
        setQuery("")
        setIsOpen(false)
    }

    const renderQuery = isOpen ? query : ""
    const renderPlaceHolder = isOpen ? ".NET, TypeScript..." : ""

    return (
        <div className="search-container">
            <div className={searchDivClassName} onClick={openIfClosed}>
                <input
                    id="input"
                    ref={inputRef}
                    type="text"
                    className={inputClassName}
                    placeholder={renderPlaceHolder}
                    value={renderQuery}
                    onChange={(event) => setQuery(event.target.value)}
                />
                {isOpen && (
                    <span
                        className="search-clearer"
                        onClick={onClickClear}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 96 96"
                            width={15}
                            height={15}
                        >
                            <path d="M96 14L82 0 48 34 14 0 0 14l34 34L0 82l14 14 34-34 34 34 14-14-34-34z" />
                        </svg>
                    </span>
                )}
                <div
                    id="handle"
                    onClick={() => setIsOpen(!isOpen)}
                    className={handleClassName}
                />
            </div>
        </div>
    )
}

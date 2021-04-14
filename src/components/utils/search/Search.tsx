import * as React from "react"
import { useContext, useState } from "react"
import { SearchContext } from "../../../context/search/SearchContext"

export function Search() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const inputClassName = isOpen ? "input open" : "input"
    const handleClassName = isOpen ? "handle open" : "handle"
    const searchDivClassName = isOpen ? "search-div open" : "search-div closed"

    const { query, setQuery } = useContext(SearchContext)

    const handleOnClickSearchDiv = () => {
        if (!isOpen) {
            setIsOpen(true)
        }
    }

    const handleOnClickHandle = () => {
        if (isOpen) {
            setIsOpen(false)
        }
    }

    const renderQuery = isOpen ? query : ""
    const renderPlaceHolder = isOpen ? "Search all posts..." : ""

    return (
        <div className="search-container">
            <div
                className={searchDivClassName}
                onClick={handleOnClickSearchDiv}
            >
                <input
                    id="input"
                    type="text"
                    className={inputClassName}
                    placeholder={renderPlaceHolder}
                    value={renderQuery}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <div
                    id="handle"
                    onClick={handleOnClickHandle}
                    className={handleClassName}
                />
            </div>
        </div>
    )
}

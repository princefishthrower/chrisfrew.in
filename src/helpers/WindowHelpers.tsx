// resets the window searchParams to an empty string use replaceState
export const clearSearchParamsFromWindow = () => {
    window.history.replaceState("", "", `${window.location.pathname}`)
}

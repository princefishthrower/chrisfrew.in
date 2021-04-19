export const getDaysLeftInYear = (): number => {
    const today = new Date()
    var newYears = new Date(today.getFullYear(), 11, 31)
    var millisecondsInDay = 1000 * 60 * 60 * 24
    return Math.ceil((newYears.getTime() - today.getTime()) / millisecondsInDay)
}

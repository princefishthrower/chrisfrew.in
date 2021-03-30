export const sendSlackMessage = (message) => {
    fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: message,
        }),
    })
}

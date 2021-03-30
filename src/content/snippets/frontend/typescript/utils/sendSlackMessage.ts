export const sendSlackMessage = (message: string): void => {
    process.env.SLACK_WEBHOOK_URL &&
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

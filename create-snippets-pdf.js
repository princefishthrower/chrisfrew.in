const spawn = require("child_process").spawn
const path = require(`path`)
const fs = require(`fs`)
const puppeteer = require("puppeteer")
const languageFilters = ["all", "typescript", "javascript", "node", "csharp", "shell"]

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const createPdfs = async () => {
    const dir = path.join(__dirname, `public`, `exports`)

    for (const index in languageFilters) {
        const languageFilter = languageFilters[index];
        const url = `http://localhost:9000/snippets-pdf-format?languageFilter=${languageFilter}`
        const fileNameToWrite = `full-stack-snippets-${languageFilter}.pdf`
        const file = path.join(__dirname, `public`, `exports`, fileNameToWrite)

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }

        console.log("Issuing npm run serve...")
        const child = spawn("npm run serve", { shell: true, detached: true })
        await sleep(5000)

        console.log("Launching puppeteer...")

        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.goto(url, {
            waitUntil: "networkidle0",
        })

        await page.pdf({
            printBackground: true,
            path: file,
            format: "Letter",
            margin: {
                top: "20px",
                bottom: "20px",
                left: "20px",
                right: "20px",
            },
        })

        console.log(`PDF with language filter "${languageFilter}" successfully exported...`)
        process.kill(-child.pid)
        console.log("Killed gatsby server.")
    }
    console.log("Done with all PDF exports! Exiting process...")
    process.exit()
}

createPdfs()

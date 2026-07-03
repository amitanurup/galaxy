const ftp = require("basic-ftp");
const fs = require("fs");

async function run() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "157.10.98.26",
            user: "etechwor",
            password: "Amit@1990",
            secure: false
        });
        console.log("Connected to FTP");
        await client.cd("/public_html/galaxy_api");
        await client.downloadTo("error_log.txt", "error_log");
        console.log("Downloaded error_log successfully!");
        const logs = fs.readFileSync("error_log.txt", "utf8");
        console.log("LOGS:\n", logs.split("\n").slice(-30).join("\n")); // Show last 30 lines
    } catch(err) {
        console.error("FTP Error: ", err);
    }
    client.close();
}
run();

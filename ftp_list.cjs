const ftp = require("basic-ftp");

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
        const list = await client.list();
        for (const item of list) {
            console.log(`${item.name} (${item.size} bytes)`);
        }
    } catch(err) {
        console.error("FTP Error: ", err);
    }
    client.close();
}
run();

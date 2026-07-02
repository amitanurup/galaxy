const fs = require('fs');

let config = fs.readFileSync('D:/Galaxy/backend/api/config.php', 'utf8');
const newUsersCode = `
            [
                "id" => "ADMIN",
                "name" => "Amit Anurup",
                "role" => "admin",
                "pin" => "0000",
                "email" => "amitanurup@gmail.com",
                "password" => password_hash("Amit@12345", PASSWORD_DEFAULT)
            ],
            [
                "id" => "ADMIN_GCC",
                "name" => "GCC Bhubaneswar",
                "role" => "admin",
                "pin" => "0000",
                "email" => "gccbhubaneswar@gmail.com",
                "password" => password_hash("Admin@12345", PASSWORD_DEFAULT)
            ]
`;

config = config.replace(/"users" => \[[^\]]*\]/s, '"users" => [' + newUsersCode + '        ]');
fs.writeFileSync('D:/Galaxy/backend/api/config.php', config);
console.log('Local config.php updated.');

const API_KEY = "galaxy_it_repair_secret_key_2026";
fetch("https://etechworld.in/galaxy_api/get_data.php", { headers: { "X-API-KEY": API_KEY } })
.then(r => r.json())
.then(data => {
    data.users = [
        {
            "id": "ADMIN",
            "name": "Amit Anurup",
            "role": "admin",
            "pin": "0000",
            "email": "amitanurup@gmail.com",
            "password": "Amit@12345"
        },
        {
            "id": "ADMIN_GCC",
            "name": "GCC Bhubaneswar",
            "role": "admin",
            "pin": "0000",
            "email": "gccbhubaneswar@gmail.com",
            "password": "Admin@12345"
        }
    ];
    return fetch("https://etechworld.in/galaxy_api/save_data.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY
        },
        body: JSON.stringify(data)
    });
})
.then(saveRes => saveRes.json())
.then(res => {
    console.log("Live server data saved successfully!", res);
})
.catch(err => {
    console.error(err);
});

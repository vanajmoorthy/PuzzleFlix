const axiosConfig = {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Access-Control-Allow-Origin": "*"
    },
};

let origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:24600",
    "http://138.251.29.24:24600",
    "http://138.251.177.189:24600/",
    "http://localhost:24601",
    "http://localhost:24600/",
    "http://127.0.2.2:24600/",
    "http://127.0.2.3:24600/",
    "http://192.168.0.60:24600/"

];

for (let i = 10; i < 20; i++) {
    origins.push("https://puzzleflix.vanaj.io");
}

module.exports = {
    axiosConfig,
    origins,
};

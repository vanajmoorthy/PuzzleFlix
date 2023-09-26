const axiosConfig = {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
};

let origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:24600",
    "http://138.251.29.24:24600",
    "http://138.251.177.189:24600/",
    "http://localhost:24601",
];

for (let i = 10; i < 20; i++) {
    origins.push("https://cs3099user" + i + ".host.cs.st-andrews.ac.uk");
}

module.exports = {
    axiosConfig,
    origins,
};

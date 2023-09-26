// For testing react components

const express = require("express");
const fs = require("fs");
const path = require("path");

const test1 = () => {
    func2(1, 2, (arg, cb) => {
        if (arg[0]) {
            console.log("FAIL");
        }
        console.log(arg[0]);
    });
    return "Finish";
};

const func2 = (arg1, arg2) => {
    if (arg1 < arg2) {
        return [1, "Hello"];
    }
    return [0, "Fail"];
};

console.log("RUNNING...\n");
test1();

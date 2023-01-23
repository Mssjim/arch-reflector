#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from "fs";


async function reflector(args) {
    try {
        const response = await fetch('https://archlinux.org/mirrors/status/json/');
        const data = await response.json();
    } catch (error) {
        console.log('\x1b[31mErro:\x1b[0m ' + error.message);
    }
}

reflector(process.argv.splice(2));
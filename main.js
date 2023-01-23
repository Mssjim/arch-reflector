#!/usr/bin/env node

import fetch from 'node-fetch';
import { program } from "commander";
import fs from "fs";


async function reflector(args) {
    try {
        const response = await fetch('https://archlinux.org/mirrors/status/json/');
        const data = await response.json();
    } catch (error) {
        console.log('\x1b[31mErro:\x1b[0m ' + error.message);
    }
}

program
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('--cache-timeout <number>', 'The cache timeout in seconds for the data retrieved from the Arch Linux Mirror Status API. The default is 300.', 300)
  .parse(process.argv);

const options = program.opts();

reflector(options);
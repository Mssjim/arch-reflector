#!/usr/bin/env node

import fetch from 'node-fetch';
import { program } from "commander";
import fs from "fs";

async function reflector(args) {
    let _data = {};
    let _urls = [];

    try {
        let cache;
        if(fs.existsSync("./cache.json")) {
            cache = fs.readFileSync("./cache.json");
            if(cache) {
                cache = JSON.parse(cache);
            }
        }


        args.cacheTimeout = parseInt(args.cacheTimeout);

        if(isNaN(args.cacheTimeout)) {
            throw new Error("Cache timeout must be an integer");
        }

        if(cache && Date.now() - cache.time < args.cacheTimeout * 1000) {
            _data = cache;
        } else {
            const response = await fetch(args.url.toLowerCase());
            const data = await response.json();
            data.time = Date.now();
            _data = data;
            fs.writeFileSync('./cache.json', JSON.stringify(data, null, 4));
        }

        if(args.listCountries) {
            const countries = [];
            for (const url of _data.urls) {
                if(url.country_code == "") {
                    url.country_code = "WW";
                    url.country = "World Wide";
                }

                const index = countries.findIndex(x => x.code == url.country_code);
                if(index == -1) {
                    countries.push({
                        code: url.country_code,
                        country: url.country
                    })
                }


            }

        }

        _urls = _data.urls ?? [];

        if(args.country) {
            args.country = args.country.toLowerCase();
            _urls = _urls.filter(url => url.country.toLowerCase() == args.country || url.country_code.toLowerCase() == args.country);
        }

        if(args.protocol) {
            _urls = _urls.filter(url => url.protocol.toLowerCase() == args.protocol.toLowerCase());
        }

        if(args.score) {
            args.score = parseInt(args.score);

            if(isNaN(args.score)) {
                throw new Error("Score must be an integer");
            }
            _urls = _urls.filter(url => url.score >= args.score);
        }

        if(args.number) {
            args.number = parseInt(args.number);

            if(isNaN(args.number)) {
                throw new Error("Number must be an integer");
            }

            _urls = _urls.slice(0, args.number);
        }

        if(args.sort) {
            const options = ['age', 'rate', 'country', 'score', 'delay'];

            if(!options.includes(args.sort)) {
                throw new Error("Invalid sort type. Must be one of 'age', 'rate', 'country', 'score', 'delay'");
            }

            if(args.sort == "age") {
            }
        }

        
        // Output
        console.log('\n' + _urls.map(url => url.url).join('\n'));
    } catch (error) {
        console.log('\x1b[31mErro:\x1b[0m ' + error.message);
    }
}

program
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('--cache-timeout <number>', 'The cache timeout in seconds for the data retrieved from the Arch Linux Mirror Status API. The default is 300.', 300)
  .option('--list-countries', 'Display a table of the distribution of servers by country.')
  .option('--url <url>', 'The URL from which to retrieve the mirror data in JSON format. If different from the default, it must follow the same format. Default: https://archlinux.org/mirrors/status/json/', 'https://archlinux.org/mirrors/status/json')
  .option('--sort <age | rate | country | score | delay>', 'Sort the mirrorlist. "age": last server synchronization; "rate": download rate; "country": country name, either alphabetically or in the order given by the --country option; "score": MirrorStatus score; "delay": MirrorStatus delay.')
  .option('-c, --country <country name or code>', 'Restrict mirrors to selected countries. Countries may be given by name or country code, or a mix of both. The case is ignored. Multiple countries may be selected using commas (e.g. --country France,Germany) or by passing this option multiple times (e.g. -c fr -c de). Use "--list-countries" to display a table of available countries along with their country codes. When sorting by country, this option may also be used to sort by a preferred order instead of alphabetically. For example, to select mirrors from Sweden, Norway, Denmark and Finland, in that order, use the options "--country se,no,dk,fi --sort country". To set a preferred country sort order without filtering any countries. this option also recognizes the glob pattern "*", which will match any country. For example, to ensure that any mirrors from Sweden are at the top of the list and any mirrors from Denmark are at the bottom, with any other countries in between, use "--country \'se,*,dk\' --sort country". It is however important to note that when "*" is given along with other filter criteria, there is no guarantee that certain countries will be included in the results. For example, with the options "--country \'se,*,dk\' --sort country --latest 10", the latest 10 mirrors may all be from the United States. When the glob pattern is present, it only ensures that if certain countries are included in the results, they will be sorted in the requested order')
  .option('--score <number>', 'Limit the list to the n servers with the highest score.')
  .option('-n, --number <number>', 'Return at most n mirrors.')
  .option('-p, --protocol <protocol>, Match one of the given protocols, e.g. "https" or "ftp". Multiple protocols may be selected using commas (e.g. "https,http") or by passing this option multiple times.')
  .option('--isos', 'Only return mirrors that host ISOs.')
  .option('--ipv4', 'Only return mirrors that support IPv4.')
  .option('--ipv6', 'Only return mirrors that support IPv6.')
  .parse(process.argv);

const options = program.opts();



reflector(options);
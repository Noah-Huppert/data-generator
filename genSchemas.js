const fs = require("fs");
const es = require("event-stream");
const assert = require("assert");
const datasets = require("mongodb-datasets");
const Readable = require("stream").Readable;

let exec = require("child_process").exec;

let num_entries = 9999999;
let notify_every_ms = 10000;
let notify_check_every = 1000;

let items = {
    location: ["address", "altitude", "areacode", "city", "coordinates", "depth", "latitude", "longitude", "phone", "postal", "province", "state", "street", "zip" ],
    user: [ "age", "birthday", "first", "gender", "last", "name", "prefix", "ssn" ],
    web: [ "color", "domain", "email", "fbid", "google_analytics", "ip", "ipv6", "klout", "tld", "twitter" ]
};

if (process.argv.length < 3) {
    console.log("Error, must provide category")
    /*
    for (var categoryL in items) {
        console.log(`Running ${categoryL}`);
        exec(`node genSchemas.js ${categoryL}`);
    }
    */
} else {
    let category = process.argv[2];
    console.log(JSON.stringify(process.argv));

    if (Object.keys(items).indexOf(category) === -1) {
        console.log(`Error, unknown category "${category}`);
        return;
    }

    genSchema(category);
}

function saveSchema (schema, category) {
    var stream = new Readable();
    stream.push(schema);
    stream.push(null);

    console.log(`Generating entries for ${category}`);
    var count = 0;
    let start_ms = new Date().getTime();
    var last_notify = start_ms;
    var last_notify_check = 0;

    let path = `out/${category}.json`;

    let file = fs.openSync(`out/${category}.json`, "w+");

    if (fs.existsSync(path) === true) {
        fs.truncateSync(file, 0);
    }

    fs.writeSync(file, "[");

    stream
        .pipe(datasets.createGeneratorStream({size: num_entries}))
        .pipe(es.map((data, callback) => {
            count ++;
            last_notify_check ++;

            var percent = Math.round(((count * 100) / num_entries), 4);

            if (last_notify_check > notify_check_every) {
                let now = new Date().getTime();
                let dif = now - last_notify;

                if (dif > notify_every_ms) {
                    console.log(`~${percent}% (${count}/${num_entries}) done generating ${category}, ${dif / 1000} s since last update, ${(now - start_ms) / 1000} s total`);
                    last_notify = now;
                }

                last_notify_check = 0;
            }

            var extra = ",";

            if (count === num_entries) {
                extra = "]";
            }

            fs.writeSync(file, JSON.stringify(data) + extra);

            if (count === num_entries) {
                fs.closeSync(file);
            }

            callback(null, null);
        }));
}

function genSchema (category) {
    //let catI = Object.keys(items).indexOf(category);

    var out = `{"_id": "{{counter()}}",`;

    for (i in items[category]) {
        let key = items[category][i];

        out += `"${key}": "{{chance.${key}()}}"`;

        if (i < items[category].length - 1) {
            out += ",";
        }
    }

    out += "}";

   saveSchema(out, category
       /*, () => {
       if (catI !== Object.keys(items).length - 1) {
           genSchema(Object.keys(items)[catI + 1]);
       }
   }
   */
       );
}

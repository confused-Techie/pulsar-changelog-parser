#!/usr/bin/env node

const util = require("util");
const changelogParser = require("../src/main.js");

const args = process.argv.slice(2);

let opts = {
  loc: null,
  action: null
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--input" || args[i] === "-i") {
    opts.loc = args[i + 1];
  } else if (args[i] === "--parse" || args[i] === "-p") {
    opts.action = "parse";
  }
}

(async () => {
  console.log(opts);
  if (opts.action === "parse") {
    try {
      const res = await changelogParser.parse(opts);

      console.log(util.inspect(res, { showHidden: false, depth: null, colors: true }));
      process.exit(0);
    } catch(err) {
      console.error(err);
      process.exit(1);
    }

  } else {
    console.error("No action supplied!");
    process.exit(1);
  }
})();

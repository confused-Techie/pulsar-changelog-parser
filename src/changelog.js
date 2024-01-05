const fs = require("fs");
const path = require("path");

async function readChangelog(opts) {
  if (typeof opts.input === "string") {
    if (fs.existsSync(opts.input)) {
      const file = fs.readFileSync(opts.input, { encoding: "utf8" });

      return file;

    } else {
      return new Error(`File: '${opts.input}' doesn't exist!`);
    }
  } else {
    let filePath = [ "CHANGELOG.md", "CHANGELOG", "changelog.md", "changelog" ].map(pathEle =>
      path.join(process.cwd, pathEle)
    ).find(f => fs.existsSync(f));

    if (filePath) {

      const file = fs.readFileSync(filePath, { encoding: "utf8" });

      return file;

    } else {
      return new Error(`Unable to locate a changelog file at: '${process.cwd}'!`);
    }
  }
}

async function writeChangelog(opts, text) {
  if (typeof text !== "string" || typeof opts.output !== "string") {
    throw new Error("Either the text provided is not a valid string, or no filename has been provided.");
  }

  fs.writeFileSync(opts.output, text, { encoding: "utf8" });

  return;
}

module.exports = {
  readChangelog,
  writeChangelog
};

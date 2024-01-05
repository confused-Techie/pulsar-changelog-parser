const { describe, it } = require("node:test");
const assert = require("node:assert");

const fs = require("fs");

const pcp = require("../src/main.js");

describe("Parses", () => {

  it("Perfect Text", async () => {
    let opts = {
      loc: "tests/spec/perfect/changelog.spec.md"
    };

    let res = await pcp.parse(opts);

    let obj = JSON.parse(fs.readFileSync("./tests/spec/perfect/changelog.spec.json", { encoding: "utf8" }));

    assert.deepStrictEqual(res, obj);

  });
});

describe("Stringifies", () => {

  it("Perfect Text", async () => {
    let opts = {
      changelogObj: JSON.parse(fs.readFileSync("./tests/spec/perfect/changelog.spec.json", { encoding: "utf8" }))
    };

    let res = await pcp.stringify(opts);

    let obj = fs.readFileSync("./tests/spec/perfect/changelog.spec.md", { encoding: "utf8" });

    assert.strictEqual(res.trim(), obj.trim());
  });
});

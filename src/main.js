const parseFunc = require("./parse.js");
const stringifyFunc = require("./stringify.js");
const { readChangelog, writeChangelog } = require("./changelog.js");

module.exports = {
  parse: async function (opts) {
    const changelog = await readChangelog(opts);

    const parsed = await parseFunc(changelog);

    return parsed;
  },
  stringify: async function (opts) {
    // TODO Determine how we collect the raw changelog object
    // For now, we may just assume it's located on the opts obj
    const changelog = opts.changelogObj;

    const stringified = await stringifyFunc(changelog);

    return stringified;
  },
  /**
   * @function reparse
   * @desc This function will parse a changelog then immediately write it back to disk.
   * This can be used to test compatibility of this format with a given changelog
   * or to get everything totally in spec.
   */
  reparse: async function (opts) {

    const changelog = await readChangelog(opts);

    const parsed = await parseFunc(changelog);

    const stringified = await stringifyFunc(parsed);

    const res = await writeChangelog(opts, stringified);

    return res;
  }
};

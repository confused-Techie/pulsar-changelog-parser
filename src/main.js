const parseFunc = require("./parse.js");
const stringifyFunc = require("./stringify.js");
const { readChangelog, writeChangelog } = require("./changelog.js");

module.exports = {
  /**
   * @function parse
   * @desc This function will read a Changelog from the disk, and parse it into
   * an object.
   * @param {object} [opts] - The options object for this function.
   * @param {string} opts.input - The location of the changelog you'd like to parse.
   * If this value is not provided, the changelog will attempted to be found in
   * current working directory.
   * @returns {object} A Changelog Object from the file provided.
   */
  parse: async function (opts = {}) {
    const changelog = await readChangelog(opts);

    const parsed = await parseFunc(changelog);

    return parsed;
  },
  /**
   * @function stringify
   * @desc This function will take an input Changelog Object, and parse it
   * into a string. Writing it to disk.
   * @param {object} opts - The options object for this function.
   * @param {object} opts.changelog - The Changelog object you'd like to write.
   * @returns {string} A string version of the changelog object.
   */
  stringify: async function (opts = {}) {
    // TODO Determine how we collect the raw changelog object
    // For now, we may just assume it's located on the opts obj
    const changelog = opts.changelog;

    const stringified = await stringifyFunc(changelog);

    return stringified;
  },
  /**
   * @function reparse
   * @desc This function will parse a changelog then immediately write it back to disk.
   * This can be used to test compatibility of this format with a given changelog
   * or to get everything totally in spec.
   * @param {object} opts - The options object for this function.
   * @param {string} opts.input - The file location to read the changelog from. If
   * this value is not present, the changelog will be attempted to be found in
   * the current working directory.
   * @param {string} opts.output - The file path to where you'd like the
   * changelog to be written back to.
   */
  reparse: async function (opts = {}) {

    const changelog = await readChangelog(opts);

    const parsed = await parseFunc(changelog);

    const stringified = await stringifyFunc(parsed);

    const res = await writeChangelog(opts, stringified);

    return res;
  }
};

# Pulsar Changelog Parser

This module exists to parse the [Pulsar Changelog](https://github.com/pulsar-edit/pulsar/blob/master/CHANGELOG.md) as well as define it's layout.

This parser can be used by any projects that decide to use the same changelog structure, although is obviously primarily aimed for usage within Pulsar.

## Installation

To install simply run:

```
npm install confused-Techie/pulsar-changelog-parser#v1.0.0
```

## Usage

To turn an existing Changelog file into a Changelog Object:

```javascript
const clparser = require("pulsar-changelog-parser");

const clObj = clparser.parse({ input: "path/to/changelog.md" });
```

If you'd like to turn a Changelog Object into a string to be able to write to disk:

```javascript
const clparser = require("pulsar-changelog-parser");

const clString = clparser.stringify({ changelog: clObj });
```

## Example

The following snippet demonstrates how to turn an existing Changelog file into
a Changelog Object, add a new entry into the `[Unreleased]` section, then write it back to disk.

```javascript
const fs = require("fs");
const clparser = require("pulsar-changelog-parser");

const changelogPath = "path/to/changelog.md";

const clObj = clparser.parse({ input: changelogPath });

clObj["[Unreleased]"].summary.push("Some generic summary notes!");
clObj["[Unreleased]"].codebases["Pulsar"] = {
  action: "Fixed",
  text: "A wild bug was slain here",
  contributor: "confused-Techie",
  pr: "https://github.com/pulsar-edit/pulsar/pulls/1"
};

const clString = clparser.stringify({ changelog: clObj });

fs.writeFileSync(changelogPath, clString, { encoding: "utf8" });
```

## Resources

* [Full Changelog Specification](./Changelog.specification.md)
* [Example Changelog](./tests/spec/perfect/changelog.spec.md)
* [Example Changelog Object](./tests/spec/perfect/changelog.spec.json)

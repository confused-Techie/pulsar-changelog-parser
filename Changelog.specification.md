# Pulsar Changelog Specification

## 1.0.0

The Pulsar Changelog specification was defined to allow easy communication, within a single changelog,
many changes across codebases. Allowing a single point of access for what changes have occurred
in multiple modules when there is a single versioning utilized.

This was especially helpful within [Pulsar](https://github.com/pulsar-edit/pulsar).
As while the text editor was the only version that really mattered, we had wanted to be able to easily
track and communicate changes that occurred within every package and module the editor uses and exposed.

### Specification

Index:
* Changelog Title
* Changelog Summary Items
* Versions
  * Version Summary
  * Codebases
    * Changelog Entry
    * Changelog Group Entry

#### Changelog Title

The very first line in your changelog should be the title of the document.

Denoted by a single heading (`#`), this allows you to add a document title, this could be as simple as:
  - `# Changelog`
Or as complex as:
  - `# My Super Awesome Project's Changelog!!!`

This title should then be followed by a blank line.

#### Changelog Summary Items

Right after the title of your title for you changelog some changelog summary items can optionally be added, although it's recommended. This isn't the best place to add a summary about the project, as that's what the readme is for, instead you should write down important facts about your changelog itself.

Each summary item **must** be on it's own line, and begin with list item.
Some examples of content to place here:

```markdown
- Format inspired by [Keep a Changelog](https://keepachangelog.com/en/1.0.0)
- Format defined in [Pulsar Changelog Parser](https://github.com/confused-Techie/pulsar-changelog-parser)
- Project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
```

Once your changelog summary items are complete, they **must** be followed by a full blank line.

#### Versions

Each version **must** be indented by **two** headers (`##`) a space, then the semver compatible version.

There are some instances where a semver compatible version is not required:
  * A version labeled just `[Unreleased]`. This can be used to track all upcoming, unreleased changes to the software.
  * Any text ending in `[PRIOR]`. This can be used to denote any changes that occurred before a changelog was kept, or before a project was forked. Such as `Atom v1.6.0< [PRIOR]`.

Your version should then be followed by a blank line.

#### Version Summary

Directly underneath any version you may optionally add some summary items for this version. The summary items can be any generic text describing the changes in this version with the exception of the following rules:
  * Each summary entry **must** be on a new line.
  * Each summary entry **must** begin with `-` followed by a space.

#### Codebases

Each codebase **must** be indented by **three** headers (`###`) a space, then the name of the codebase.
A codebase entry allows changelog entries for a single codebase, that's included in this version.

#### Codebase Summary

After the Codebase title, as described above, there may be summary entries for this codebase's changes. The summary entries, are handled the same exact way that Version summaries are.

#### Changelog Entry

Changelog entries are where the real important part of a changelog exist. Documenting the exact changes that have been made within this codebase, within this version.

It's recommended to create a changelog entry for every single PR within the effected repo, within the effected time.

While a changelog entry matches some aspects of the Codebase and Version summary, such as:
* Each Changelog entry **must** begin with `-`
* Each Changelog entry **must** end with a newline (`\n`)

They otherwise differ in content:
* Each Changelog entry **must** begin with the kind of change that took place, capitalized first letter, followed by a `:`.
* Each Changelog entry **must** then contain text describing this exact change. This may be just the PR title, or otherwise changelog notes made for this particular PR.
* Each Changelog entry **must** then be followed by the contributor and PR link. For example if user `@john_doe` made a PR to `pulsar-edit/pulsar` with the PR number `#1`, the contributor and PR link would look like so: `[@john_doe](https://github.com/pulsar-edit/pulsar/pull/1)`

A example of a few Changelog entries should look like below:

```markdown
- Added: Return to original logic for `ATOM_DISABLE_SHELLING_OUT_FOR_ENVIRONMENT` [@savetheclocktower](https://github.com/pulsar-edit/pulsar/pull/831)
- Added: Moving fuzzy-native to core [@mauricioszabo](https://github.com/pulsar-edit/pulsar/pull/774)
- Fixed: Tree-sitter rolling fixes for November [@savetheclocktower](https://github.com/pulsar-edit/pulsar/pull/819)
```

The recommended list of Changelog Entry Actions is below:
* Bumped
* Fixed
* Added
* Removed

#### Changelog Group Entry

A Changelog Group Entry is used for the times that you have many PRs with similar goals all within a single codebase within a single version. For example converting your code from CoffeeScript to JavaScript, or rebranding a codebase after a branding change.

Since this PR title's will all nearly be identical, and serve the same purpose, it's supported to group them all together.

Changelog Group Entries are nearly identical to a Changelog Entry, except a vital point. The Entry **must not** end with a contributor and PR link. Instead it **must** end with a colon (`:`).

After this colon should be the list of entries prefixed by whitespace, then a `*` followed by the change text, and finally the contributor and PR link.

An example of a Changelog Group Entry:

```markdown
- Decaffeinate: Numerous efforts from many contributors to decaffeinate the editor:
  * [@Sertonix](https://github.com/pulsar-edit/pulsar/pull/112)
  * [@confused-Techie](https://github.com/pulsar-edit/pulsar/pull/45)
  * [@Spiker985](https://github.com/pulsar-edit/pulsar/pull/29)
  * [@fabianfiorotto](https://github.com/pulsar-edit/pulsar/pull/13)
```

The specially supported Actions for Changelog Group Entries:
* Rebrand
* Tests
* Decaffeinate

#### The full list of Supported Changelog Actions

Changelog Entries and Changelog Group Entries both support the full list of possible Actions, whish is:
* Bumped
* Fixed
* Added
* Removed
* Rebrand
* Tests
* Decaffeinate

And while not recommended, the following list is also supported in both locations:
* Updated
* Changed
* Update
* Decafed

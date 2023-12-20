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

#### Changelog Entry

#### Changelog Group Entry

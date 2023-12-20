
const validEntryActions = [
  // Recommended/Valid normal Entry Actions
  "Bumped", "Fixed", "Added", "Removed",
  // Recommended/Valid Group Entry Actions
  "Rebrand", "Tests", "Decaffeinate",
  // Not Recommended but Valid Actions
  "Updated", "Changed", "Update", "Decafed"
];

const REG = {
  pre: {
    // All items within the pre namespace, are pre-emptive identifiers
    title: new RegExp(/^#\s/),
    release: new RegExp(/^##\s/),
    codebase: new RegExp(/^###\s/),
    entry: new RegExp(/^-\s/),
    changeGroup: new RegExp(/^\s*?\*\s/)
  },
  // Double escaped below due to being within a template literal string, so we can combine text
  // Important to the below is the lazy quantifier capture group `(?<text>.*?)`,
  // if this is not lazy it swallows all other details whole!
  entryAction: new RegExp(`^-\\s(?<action>${validEntryActions.join("|")}):\\s+(?<text>.*?)(\\s\\[@(?<contributor>[a-zA-Z0-9-_]+)\\]\\((?<pr>.*)\\)|$|(?<changeGroup>:$))`),
  changeGroupEntry: new RegExp(/^\s*?\*\s\[@(?<contributor>[a-zA-Z0-9-_]+)\]\((?<pr>.*)\)$/)
};

module.exports =
async function parse(changelog) {

  let changelogLines = changelog.split("\n");

  let changelogObj = {};

  let idx = 0;
  let tree = []; // The tree is an array of namespace items that can track
  // our current position within the tree object of the `changelogObj`
  // Where if the array has no items, it means we are at the root of the tree

  while (idx < changelogLines.length) {
    let cur = changelogLines[idx].trim();

    if (typeof cur !== "string") {
      return new Error("Non-string line encountered within changelog!");
    }

    if (cur.match(REG.pre.title)) {
      // Title Identifier
      changelogObj.title = cur.replace(REG.pre.title, "");

      tree.push("titleStatements");

      changelogObj.titleStatements = [];

    } else if (cur.match(REG.pre.release)) {
      // Release Identifier

      // First set tree to root
      tree = [];

      changelogObj[cur.replace(REG.pre.release, "")] = {
        summary: [],
        codebases: {}
      };

      tree.push(cur.replace(REG.pre.release, ""));
      tree.push("summary");

    } else if (cur.match(REG.pre.codebase)) {
      // Codebase Identifier

      // Since we must assume the last set tree was via a Release Identifer
      // we need to unset the `summary` portion of the tree. Removing the last element
      tree.pop();

      changelogObj[tree[0]].codebases[cur.replace(REG.pre.codebase, "")] = [];

      // Now we will inspect the tree to remove any previously nested codebases
      //for (let i = tree.length - 1; i >= 0; i--) {
      for (let i = tree.length - 1; i >= 1; i--) {
        // Since we know that any codebase should only be nested 2 levels in,
        // we will pop all other trees
        // if (tree[i] === "codebases") {
        //   tree.pop();
        // }
        tree.pop();
      }

      tree.push("codebases");
      tree.push(cur.replace(REG.pre.codebase, ""));
    } else if (cur.match(REG.pre.entry)) {
      // Entry Identifier

      // Here we must trust that the tree has given us valid input.
      // Except in the case that it's too long, such as being a part of a change group
      // which we will check for and fix if that is the case
      if (tree.length === 5) {
        tree.pop(); // Once to remove `groupChanges` entry
        tree.pop(); // A second to remove the array index within the codebase
      }

      let itemToAdd;

      if (cur.match(REG.entryAction)) {

        itemToAdd = {
          action: "",
          text: "",
          contributor: "",
          pr: ""
        };

        let match = cur.match(REG.entryAction);

        if (typeof match.groups.action === "string") {
          itemToAdd.action = match.groups.action;
        }
        if (typeof match.groups.text === "string") {
          itemToAdd.text = match.groups.text;
        }
        if (typeof match.groups.contributor === "string") {
          itemToAdd.contributor = match.groups.contributor;
        }
        if (typeof match.groups.pr === "string") {
          itemToAdd.pr = match.groups.pr;
        }

        if (itemToAdd.text.length < 1) {
          // In case the above regex didn't find entry text, we will add all text to it
          itemToAdd.text = cur.replace(REG.entryAction, "");
        }

        // Finally we will check for the possibility that this change entry is
        // actually a part of a change group, and update the tree accordingly
        if (typeof match.groups.changeGroup === "string" && match.groups.changeGroup === ":") {
          // This change entry is a part of a change group!
          itemToAdd.groupChanges = [];
        }

      } else {
        // We will assume this is a generic entry
        itemToAdd = cur.replace(REG.pre.entry, "");
      }

      let entryLoc = changelogObj;

      for (let i = 0; i < tree.length; i++) {
        entryLoc = entryLoc[tree[i]];
      }

      entryLoc.push(itemToAdd);

      if (Array.isArray(itemToAdd?.groupChanges)) {
        // If the item we are adding has group changes, then we need to update
        // the tree correctly.
        // First: Add the index of the current codebase entry
        // Second: Add the `groupChanges` key
        tree.push(entryLoc.length - 1);
        tree.push("groupChanges");
      }

    } else if (cur.match(REG.pre.changeGroup)) {
      // Change Group Identifier

      let match = cur.match(REG.changeGroupEntry);

      let itemToAdd = {
        contributor: "",
        pr: ""
      };

      if (typeof match.groups.pr === "string") {
        itemToAdd.pr = match.groups.pr;
      }
      if (typeof match.groups.contributor === "string") {
        itemToAdd.contributor = match.groups.contributor;
      }

      let entryLoc = changelogObj;

      for (let i = 0; i < tree.length; i++) {
        entryLoc = entryLoc[tree[i]];
      }

      entryLoc.push(itemToAdd);
    } else {
      // Unable to identify this line
      // Likely means the line is empty, but we will want to make sure of this
      if (cur.length > 1) {
        // This indicates that text is on this line, and we want to find where to append it.

        let entryLoc = changelogObj;

        for (let i = 0; i < tree.length; i++) {
          entryLoc = entryLoc[tree[i]];
        }

        if (Array.isArray(entryLoc)) {
          // The current tree is an array, which is good, it means we can append our data
          let entry = entryLoc[entryLoc.length-1];

          // The entry object should now be our spot to append data, so it's time to determine
          // where we can add the data
          if (typeof entry === "string") {
            entryLoc[entryLoc.length-1] = `${entryLoc[entryLoc.length-1]}\n${cur}`;
          } else {
            console.error(`Unable to determine where to append: '${cur}' within the tree! This data will be lost!`)
          }
        } else {
          console.error(`Unable to determine where to append: '${cur}'! This data will be lost!`);
        }
      } // else this line is likely whitespace and can be ignored.
    }

    idx++;
  }

  return changelogObj;
}

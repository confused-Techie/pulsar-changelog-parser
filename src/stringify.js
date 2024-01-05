const semver = require("semver");

module.exports =
async function stringify(clo) {
  // `clo` = changelogObj
  // `cls` = changelogString
  let cls = "";

  if (typeof clo.title === "string") {
    cls += `# ${clo.title}\n\n`;
  } else {
    cls += `# Changelog\n\n`;
  }

  for (let i = 0; i < clo.titleStatements.length; i++) {
    cls += `- ${clo.titleStatements[i]}\n`;
  }

  if (clo.titleStatements.length > 1) {
    cls += "\n";
  }

  // Now we will collect all possible versions, so that we can ensure they are
  // sorted in correct semver order
  const VERSIONS = [];

  for (const ver in clo) {
    if (ver === "[Unreleased]" || semver.valid(ver) || ver.endsWith("[PRIOR]")) {
      VERSIONS.push(ver);
    }
  }

  // TODO sort semver `VERSIONS` array

  for (const version of VERSIONS) {

    let trackers = {
      hadVerSumEntries: false
    };

    cls += `## ${version}\n\n`;

    let ver = clo[version];

    for (const verSummaryEntry of ver.summary) {
      trackers.hadVerSumEntries = true;
      cls += `- ${verSummaryEntry}\n`;
    }

    if (trackers.hadVerSumEntries) {
      cls += "\n";
    }

    for (const codebase in ver.codebases) {
      cls += `### ${codebase}\n`;

      for (const entry of ver.codebases[codebase]) {
        let entryText = "- ";

        if (isValidEntryItem(entry.action)) {
          entryText += `${entry.action}: `;
        }
        if (isValidEntryItem(entry.text)) {
          entryText += `${entry.text}`;
        }
        if (isValidEntryItem(entry.contributor) && isValidEntryItem(entry.pr)) {
          entryText += ` [@${entry.contributor}](${entry.pr})\n`;
        } else if (Array.isArray(entry.groupChanges)) {
          entryText += `:\n`;

          for (const groupEntry of entry.groupChanges) {
            if (isValidEntryItem(groupEntry.contributor) && isValidEntryItem(groupEntry.pr)) {
              entryText += `  * [@${groupEntry.contributor}](${groupEntry.pr})\n`;
            }
          }
        } else {
          // This else can be hit in the instance that the entry item **only**
          // has an action and text. So we want to do some final cleanup
          entryText += "\n";
        }

        if (entryText.length > 3) {
          cls += entryText;
        } else {
          // In the odd case no data has been added for an entry
          console.warn("The following entry has been omitted from the final changelog due to being invalid.");
          console.warn(entry);
        }

      }

      // The end of every codebase should add a newline
      cls += "\n";
    }
  }

  return cls;
}

function isValidEntryItem(str) {
  if (typeof str === "string" && str.length > 1) {
    return true;
  } else {
    return false;
  }
}

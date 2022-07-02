/* eslint-disable no-console */
// This is a script to download robots file
//
// Usage:
// node test/getRobotsFile.js
//

// eslint-disable-next-line import/no-unresolved
import got from 'got';
import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';

const git = simpleGit();

// main function
(async () => {
  const site = 'https://www.google.com';
  const fileName = 'robots.txt';
  const fileUrl = `${site}/${fileName}`;

  const filePath = './files';
  const fileAbsolutePath = path.resolve(`${filePath}/${fileName}`);
  const options = {};

  console.log(`Getting '${fileName}' file:`);

  try {
    // retrieve the fileUrl page contents & write to file
    const { body } = await got(fileUrl, options);
    fs.writeFileSync(fileAbsolutePath, body);
    console.log(`- ${fileUrl} -> ${filePath}/${fileName}`);

    // look for git changes only related to the file
    const status = await git.status();
    const modifiedFiles = status.modified.filter((elem) =>
      elem.includes(fileName)
    ).length;

    // if file changes were detected, then add, commit, and push
    // the changes to the remote repository
    if (modifiedFiles > 0) {
      const message = `\n${modifiedFiles} modified '${fileName}' file found.`;
      console.log(message);

      // try to commit the changes & push them to the repository
      if (
        typeof process.env.GH_USERNAME !== 'undefined' &&
        typeof process.env.GH_USEREMAIL !== 'undefined' &&
        typeof process.env.GH_PERSONAL_ACCESS_TOKEN !== 'undefined' &&
        typeof process.env.DETECT_FILE_CHANGES_REPO_URL !== 'undefined'
      ) {
        // login to the repo using your Github username and a
        // personal access token (defined in your Github account's
        // Settings / Developer settings / Personal access tokens)
        const remote =
          `https://${process.env.GH_USERNAME}:${process.env.GH_PERSONAL_ACCESS_TOKEN}` +
          `@${process.env.DETECT_FILE_CHANGES_REPO_URL}`;
        const branch = 'main';

        // git add, commit, and push changes
        const commitMessage = await git
          .addConfig('user.name', process.env.GH_USERNAME)
          .addConfig('user.email', process.env.GH_USEREMAIL)
          .removeRemote('origin')
          .addRemote('origin', remote)
          .add('./*')
          .commit(message)
          .push(['-u', 'origin', branch]);

        // uncomment if you want to see the file commit details
        // console.log('commitMessage:', commitMessage);
      }
    } else {
      console.log(`\nNo '${fileName}' changes found.`);
    }
  } catch (error) {
    console.log('Error:', error);
  }
})();

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

  console.log(`Getting robots file:`);

  try {
    // retrieve the page contents & write to file
    const { body } = await got(fileUrl, options);
    fs.writeFileSync(fileAbsolutePath, body);
    console.log(`- ${fileUrl} -> ${filePath}/${fileName}`);

    // look for git changes related to the file
    const status = await git.status();
    const modifiedFiles = status.modified.filter((elem) =>
      elem.includes(fileName)
    ).length;

    // if file changes were detected, then add, commit, and push
    // the changes to the remote repository
    if (modifiedFiles > 0) {
      const message = `\n${modifiedFiles} modified '${fileName}' file`;
      console.log(message);

      // try to commit the changes & push them to the repository
      if (
        typeof process.env.GITHUB_USERNAME !== 'undefined' &&
        typeof process.env.GITHUB_PASSWORD !== 'undefined' &&
        typeof process.env.DETECT_FILE_CHANGES_REPO !== 'undefined' &&
        typeof process.env.GITHUB_USEREMAIL !== 'undefined'
      ) {
        const remote =
          `https://${process.env.GITHUB_USERNAME}:${process.env.GITHUB_PASSWORD}` +
          `@${process.env.DETECT_FILE_CHANGES_REPO}`;
        const commitMessage = await git
          .addConfig('user.name', process.env.GITHUB_USERNAME)
          .addConfig('user.email', process.env.GITHUB_USEREMAIL)
          .removeRemote('origin')
          .addRemote('origin', remote)
          .add('./*')
          .commit(message);
        await git.push(['-u', 'origin', 'master']);

        console.log('commitMessage:', commitMessage);
      }
    } else {
      console.log(`\nNo '${fileName}' changes found.`);
    }
  } catch (error) {
    console.log('Error:', error);
  }
})();

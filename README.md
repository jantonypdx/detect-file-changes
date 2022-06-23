# detect-file-changes

This is a repository demonstrating how file changes can be 
automatically detected, saved, & pushed to a repository. 
The commits section in the repository can then easily show the 
previous file contents as well as the new, updated data. 

Additionally, git notifications can be used to alert users 
whenever the file contents change. This can be handy for
team members (e.g. SEO) who want to be alerted whenever 
pages change.

## Installation

- git clone the repository
- run `npm installl`

## Setup environment variables

In your Github account, you can (optionally) create a Personal 
Access Token. This is used to authenticate commits & pushes to 
the repository. This token can be created in "Settings / Developer 
settings / Personal access tokens" section.

If you create a personal access token, the token can be saved as 
an Action Secret environment variable (which is encrypted & secure). 
This variable can then be used in the Github Action script.

To do this, go to the repository's "Settings" section, click on 
"Secrets" and then "Actions". In the "Actions secrets" section, 
define this "New repository secret".

- GH_PERSONAL_ACCESS_TOKEN - the token value defined above.

Note: these environment variables are also defined in the Github 
Actions script:

- GH_USERNAME - default env var ${GITHUB_REPOSITORY_OWNER}
- DETECT_FILE_CHANGES_REPO_URL: github.com/${GITHUB_REPOSITORY_OWNER}/detect-file-changes

**Note**: If these three environment variables are found, then 
after the script runs, if code changes are detected, the changes 
will then be committed & pushed back into the repository. This is
the "self-updating" feature of this code.

## Usage
Run the following command to update the files in the repository:
```
npm run update-files
```

## License

[MIT](./LICENSE.md)

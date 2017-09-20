[![Build Status](https://travis-ci.org/groupon/tiquette.svg?branch=master)](https://travis-ci.org/groupon/tiquette)

# Tiquette

Tiquette is a tool for automatically formatting your commit messages with a ticket or issue number. If your development process requires a reference to tickets in commit messages, then this is the tool for you!

## Usage

Tiquette works by creating a Git branch with a ticket number in the name, and then automatically inserting that ticket number into your commit messages while you're on that branch.

To get started, check out a new branch and give it your ticket number:

```bash
$ npm run branch FOO-123
```

You'll then be prompted to enter a branch name, which will default to the ticket's title (fetched via your project management system's API):

```bash
prompt: Brief description (default: "Fix all the things!!!"):
```

Press Enter, and a new branch will be created. In the example above, if you used the default description, the branch would be named `FOO-123--Fix-all-the-things`. (The two dashes after the ticket number help Tiquette know where the ticket number ends.)

While on this branch, Tiquette will format every commit message to include the ticket number in your branch name!

```bash
$ git commit -m "Fix one of the things"
[FOO-123] Fix one of the things
```

## Setup

### Installation

- If you're using [Yarn](https://yarnpkg.com/): `yarn add tiquette --dev`
- Or if you're using NPM: `npm install tiquette --save-dev`

### Configure Tiquette in your `package.json`

```JSON
{
  "tiquette": {
    "commitMessageTemplate": "[{{ticket}}] {{message}}",
    "type": "JIRA"
  }
}
```

- `commitMessageTemplate` allows you to specify how your ticket number should appear in your commit messages using [Mustache](https://mustache.github.io/)-style placeholders. Given the template above, if you write a commit message like `Fix one of the things`, the final commit message will be `[FOO-123] Fix one of the things`.
- `type` allows you to specify what ticket type to use. Currently, this can be either `GitHub` or `JIRA`.

### (Optional) Configure API details in `.tiquetterc`

The API details for your project management tool are used to fetch ticket names to automatically generate branch names. If you don't need this functionality, you can safely skip this step.

Tiquette uses the [`rc` NPM module](https://github.com/dominictarr/rc) to load configuration from a `.tiquetterc` file. This configuration shouldn't be checked into your version control system, and is used to fetch ticket names from your project management tool.

The file should be written in INI or JSON format, and the contents differ based on the value of `tiquette.type` in your `package.json`.

#### For JIRA

```JSON
{
  "authorization": "Basic c3Rlcmxpbmc6YXJjaGVy",
  "host": "http://my-jira-instance.example.com"
}
```

- `authorization` is the content of the `Authorization` header when talking to the JIRA API, which is needed for fetching issue titles. Per JIRA's [API documentation](https://developer.atlassian.com/cloud/jira/platform/jira-rest-api-basic-authentication/#supplying-basic-auth-headers), this should be the string `Basic` plus your colon-separated username and password, Base64-encoded.
- `host` is the host (without trailing slash) of your JIRA instance. Currently, only version 2 of the JIRA REST API is supported.

#### For GitHub

```JSON
{
  "authorization": "Basic c3Rlcmxpbmc6YXJjaGVy",
  "host": "http://my-github-instance.example.com",
  "owner": "groupon",
  "repo": "nlm"
}
```

- `authorization` is the content of the `Authorization` header when talking to the GitHub API, which requires your personal access token for fetching issue titles.
- `host` is the host of your GitHub instance, and is only required if you're using GitHub Enterprise. (Otherwise, it will default to GitHub.com.)
- `owner` and `repo` refer to the owner and repo names. For example, in a repo located at `github.com/groupon/nlm`, `groupon` would be the owner and `nlm` would be the repo.

### Install Tiquette's `branch` script and `commitmsg` hook

```JSON
{
  "scripts": {
    "branch": "tiquette branch",
    "commitmsg": "tiquette commit-message $GIT_PARAMS"
  }
}
```

- The `branch` script should be called with a ticket number: `npm run branch FOO-123`. If you've configured API details in `.tiquetterc`, it will hit this API to get the ticket's name, and prompt you to use that name or a different one for your branch. It will then create a branch with the ticket number and the name you specify (normalized into letters and hypens).
- The `commitmsg` hook allows Tiquette to automatically format your commit messages using [Husky](https://github.com/typicode/husky).

Then, you're all set! Your commit messages will automatically have ticket numbers in them in the format specified.

## Development

- Install dependencies with `yarn`.
- Run tests with `npm test`.
- Prettify code (using [Prettier](https://github.com/prettier/prettier)) with `npm run prettify`.

## License

    Copyright 2017 Groupon, Inc.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are
    met:

    1. Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.

    2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

    3. Neither the name of the copyright holder nor the names of its
    contributors may be used to endorse or promote products derived from this
    software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
    IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
    THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
    CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
    EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
    LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
    NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

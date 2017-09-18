/**
 * Copyright 2017 Groupon, Inc.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import * as fs from 'fs';
import { execSync } from 'child_process';

import {
  getBranchNameRegExp,
  getConfig,
  getFormattedCommitMessage,
  getGitCurrentBranch,
  getTicketFromGitBranchName,
} from '../helpers';

const { commitMessageTemplate } = getConfig();

// Check githooks docs for the arguments git passes
// https://git-scm.com/docs/githooks#_prepare_commit_msg
export default function(program): void {
  program
    .command('commit-message <file>')
    .description(
      'Format a commit message with a ticket (only for use as a git hook)',
    )
    .action((commitMessageFile: string) => {
      if (!commitMessageFile) {
        throw 'The `commit-message` command is only for use as a git hook.';
      }

      const commitMessage = fs.readFileSync(commitMessageFile, 'utf8').trim();
      const regExp = getBranchNameRegExp();
      const ticket = getTicketFromGitBranchName(getGitCurrentBranch(), regExp);

      if (commitMessage.indexOf(ticket) >= 0) {
        return;
      }

      fs.writeFileSync(
        commitMessageFile,
        getFormattedCommitMessage(commitMessageTemplate, commitMessage, ticket),
      );
    });
}

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

const fetch = require('node-fetch'); // Use require because of typings problems.
import BaseAdapter from './base-adapter';

export class GitHub extends BaseAdapter {
  // e.g., `123--branch-name` becomes `123`
  public static branchNameRegExp: RegExp = /^(\d+)--/;

  protected fetchDefaultTicketName(): Promise<string> {
    const { authorization, owner, repo } = <IGitHubConfig>this.config.api;
    const host = this.config.api.host
      ? this.config.api.host
      : 'https://api.github.com';

    // https://developer.github.com/v3/issues/#get-a-single-issue
    const endpoint = `${host}/repos/${owner}/${repo}/issues/${this.ticket}`;

    // https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    const params = { headers: { authorization } };

    return fetch(endpoint, params)
      .then(res => res.json())
      .then(issue => issue.title)
      .catch(() => console.error('Could not fetch GitHub issue details'));
  }
}

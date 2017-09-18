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

export class JIRA extends BaseAdapter {
  // e.g., `FOO-123--branch-name` becomes `FOO-123`
  public static branchNameRegExp: RegExp = /^([A-Z]+-[0-9]+)--/;

  protected fetchDefaultTicketName(): Promise<string> {
    const { authorization, host } = <IJIRAConfig>this.config.api;

    // https://docs.atlassian.com/jira/REST/cloud/#api/2/issue-getIssue
    const endpoint = `${host}/rest/api/2/issue/${this.ticket}`;
    // https://developer.atlassian.com/cloud/jira/platform/jira-rest-api-basic-authentication/
    const params = { headers: { authorization } };

    return fetch(endpoint, params)
      .then(res => res.json())
      .then(story => story.fields.summary)
      .catch(() => console.error('Could not fetch JIRA ticket details'));
  }
}

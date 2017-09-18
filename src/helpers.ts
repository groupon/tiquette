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

import { execSync } from 'child_process';
import * as path from 'path';
import * as rc from 'rc';

import BaseAdapter from './adapters/base-adapter';
import * as adapters from './adapters';

const packageJSON: ITiquettePackageJSON = require(path.resolve(
  './package.json',
));

export function getConfig() {
  assertValidConfig(packageJSON);
  return { ...packageJSON.tiquette, ...{ api: rc('tiquette') } };
}

export function assertValidConfig({
  tiquette: config,
}: ITiquettePackageJSON): void {
  if (!config) {
    throw new Error(
      'Your `package.json` must include tiquette config under the `tiquette` key.',
    );
  }

  if (!config.type) {
    throw new Error('Your `package.json` must include a `tiquette.type` key.');
  }

  if (!adapters[config.type]) {
    const validTypes = Object.keys(adapters).join(', ');
    throw new Error(
      'The `tiquette.type` key in your `package.json` must be one of: ' +
        validTypes,
    );
  }

  if (!config.commitMessageTemplate) {
    throw new Error(
      'Your `package.json` must include a `tiquette.commitMessageTemplate` key.',
    );
  }

  if (config.commitMessageTemplate.indexOf('{{message}}') === -1) {
    throw new Error(
      'Your `tiquette.commitMessageTemplate` key must contain the `{{message}}` placeholder.',
    );
  }

  if (config.commitMessageTemplate.indexOf('{{ticket}}') === -1) {
    throw new Error(
      'Your `tiquette.commitMessageTemplate` key must contain the `{{ticket}}` placeholder.',
    );
  }
}

export function getGitCurrentBranch() {
  return execSync('git rev-parse --abbrev-ref HEAD', {
    encoding: 'utf8',
  }).trim();
}

export function getTicketFromGitBranchName(
  gitBranchName: string,
  regExp: RegExp,
): string {
  if (!regExp.test(gitBranchName)) {
    return '';
  }

  const [, ticket] = gitBranchName.match(regExp);

  return ticket;
}

export function getFormattedCommitMessage(
  template: string,
  message: string,
  ticket: string,
): string {
  return template.replace('{{message}}', message).replace('{{ticket}}', ticket);
}

export function getBranchNameRegExp(): RegExp {
  return adapters[getConfig().type].branchNameRegExp;
}

export function getAdapterForTicket(ticket: string): BaseAdapter {
  const Klass = adapters[getConfig().type];
  return new Klass(getConfig(), ticket);
}

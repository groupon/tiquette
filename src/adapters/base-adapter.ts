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

import { exec } from 'child_process';
import * as prompt from 'prompt';

export default abstract class BaseAdapter {
  protected ticketName: string;
  protected abstract fetchDefaultTicketName(): Promise<string>;

  // A `RegExp` object for converting a branch name to a ticket.
  public static branchNameRegExp: RegExp;

  constructor(protected config: ITiquetteConfig, protected ticket: string) {}

  start() {
    prompt.start();
    this.promptForTicketName().then(() => this.checkoutBranch());
  }

  public promptForTicketName(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.fetchDefaultTicketName().then(defaultTicketName => {
        prompt.get(
          this.getTicketNameSchema(defaultTicketName),
          (err, result) => {
            if (err) {
              reject(err);
            }

            this.ticketName = result.ticketName || defaultTicketName;
            resolve();
          },
        );
      });
    });
  }

  private getTicketNameSchema(defaultTicketName: string) {
    let description = 'Brief description';
    if (defaultTicketName) {
      description += ` (default: "${defaultTicketName}")`;
    }

    return {
      name: 'ticketName',
      description,
      type: 'string',
      required: !defaultTicketName,
    };
  }

  private checkoutBranch(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const branchName = `${this.ticket}--${this.getNormalizedBranchName()}`;
      const cmd = `git checkout -b ${branchName}`;

      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        }

        if (stderr) {
          console.error(stderr);
        }

        console.log(stdout);
        resolve();
      });
    });
  }

  private getNormalizedBranchName(): string {
    // Replace all non-word characters with hypens, and strip all non-word characters from the beginning and end.
    return this.ticketName
      .replace(/\W+/g, '-')
      .replace(/^\W+/g, '')
      .replace(/\W+$/g, '');
  }
}

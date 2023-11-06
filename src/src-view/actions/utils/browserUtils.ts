/*
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Author: Håkon Lindquist
 */

import { getLinesNumber } from '../../functions/browserFunctions';

export const scrollToTarget = (parent: string, target: string) => {
  const targetSpan = document.querySelector(target) as HTMLElement;

  if (targetSpan) {
    const parentDiv = document.querySelector(parent) as HTMLElement;

    if (parentDiv) {
      const targetPosition = targetSpan.offsetTop;
      const parentHeight = parentDiv.offsetHeight;

      parentDiv.scrollTo({
        top: targetPosition - 16 * 1.25 * getLinesNumber(parentHeight),
        behavior: 'smooth',
      });
    }
  }
};

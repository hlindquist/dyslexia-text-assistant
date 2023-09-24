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

import axios, { AxiosResponse } from 'axios';
import { AjaxResponse, Request } from '../../types/types';

function transformAxiosResponse<T>(
  axiosResponse: AxiosResponse<T>
): AjaxResponse<T> {
  return {
    data: axiosResponse.data,
  };
}

class Ajax {
  static post = async <T>(request: Request): Promise<AjaxResponse<T>> =>
    axios
      .post<T>(request.url, request.body, {
        headers: request.headers,
      })
      .then((response) => transformAxiosResponse(response));
}

export default Ajax;

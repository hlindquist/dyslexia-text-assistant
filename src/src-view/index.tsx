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

import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import { isDebugModeEnabled } from '../utils/featureToggle';
import './actions/extensionListener';
import './actions/reduxListener';
import App from './containers/App';
import DebugPane from './containers/DebugPane';
import './index.scss';
import store from './redux/store';

const root = createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <App />
    {isDebugModeEnabled() ? <DebugPane /> : null}
  </Provider>
);

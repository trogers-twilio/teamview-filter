import { FlexPlugin } from '@twilio/flex-plugin';

import { initializeListeners } from './listeners';
import { initializeFlexUiModifications } from './flex-ui-mods';
import { registerNotifications } from './notifications';
import { initializeFilters } from './filters';

const PLUGIN_NAME = 'TeamViewFilters';

export default class TeamViewFilters extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    const state = manager.store.getState();
    const roles = state?.flex?.session?.ssoTokenPayload?.roles || [];

    if (roles.includes('admin') || roles.includes('supervisor')) {
      initializeListeners();

      initializeFlexUiModifications();

      registerNotifications();

      initializeFilters();
    }
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  
}

import { FlexPlugin } from '@twilio/flex-plugin';
import { TeamsView } from '@twilio/flex-ui';

import {
  managerFilter,
  managerFilterList,
  skillsFilter,
  locationFilter,
  locationFilterList,
  queueFilter,
  queueFilterList,
  rolesFilter,
  rolesFilterList
} from './filters';

import registerNotifications from './notifications';
import './listeners';

import WorkersDataTableSort from './components/WorkersDataTableSort';



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
      registerNotifications(manager);

      managerFilterList();
      locationFilterList();
      queueFilterList();
      rolesFilterList();
  
      manager.updateConfig({
        componentProps: {
          TeamsView: {
            filters: [
              TeamsView.activitiesFilter,
              locationFilter,
              managerFilter,
              skillsFilter,
              queueFilter,
              rolesFilter
            ]
          }
        }
      });

      flex.WorkersDataTable.Content.add(
        <flex.ColumnDefinition
          key="worker-location"
          header={"Location"}
          content={item => <div style={{ fontSize: '12px' }}>{item?.worker?.attributes?.location}</div>}
        />
      );
      flex.WorkersDataTable.Content.add(
        <flex.ColumnDefinition
          key="worker-roles"
          header={"Roles"}
          content={item => <div style={{ fontSize: '12px' }}>{
              Array.isArray(item?.worker?.attributes?.roles)
              && item?.worker?.attributes?.roles?.join(', ')
            }</div>
          }
        />
      );

      flex.Supervisor.TeamFiltersPanel.Content.add(<WorkersDataTableSort key='workers-data-table-sort' />, { sortOrder: 10 });
    }

 

    
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  
}

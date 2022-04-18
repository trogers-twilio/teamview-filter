import { FlexPlugin } from '@twilio/flex-plugin';
import { TeamsView } from '@twilio/flex-ui';
import {
  managerFilter,
  skillsFilter,
  locationFilter
} from './filters';
// var syncClient = require('twilio-sync')
import {managerFilterList} from './filters/managerFilter'
import {locationFilterList} from './filters/locationFilter'



const PLUGIN_NAME = 'RealtimeQueueViewFilterPlugin';

export default class RealtimeQueueViewFilterPlugin extends FlexPlugin {
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
  async init(flex, manager) {
    

    managerFilterList();
    locationFilterList();


    manager.updateConfig({
      componentProps: {
        TeamsView: {
          filters: [
            TeamsView.activitiesFilter,
            skillsFilter,
            managerFilter,
            locationFilter
          ]
        }
      }
    });

 

    
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  
}

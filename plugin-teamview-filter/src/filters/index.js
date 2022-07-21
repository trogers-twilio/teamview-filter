import { TeamsView } from '@twilio/flex-ui';

import { activitiesFilter } from './activitiesFilter';
import { skillsFilter } from './skillsFilter';
import { managerFilter, managerFilterList } from './managerFilter';
import { locationFilter, locationFilterList } from './locationFilter';
import { queueFilter, queueFilterList } from './queueFilter';
import { rolesFilter, rolesFilterList } from './rolesFilter';

export const initializeFilters = () => {
  managerFilterList();
  locationFilterList();
  queueFilterList();
  rolesFilterList();

  TeamsView.defaultProps.filters = [
    activitiesFilter,
    locationFilter,
    managerFilter,
    skillsFilter,
    queueFilter,
    rolesFilter
  ];
}
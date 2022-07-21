import { ColumnDefinition, WorkersDataTable } from '@twilio/flex-ui';
import { Ticker } from '@twilio/flex-ui-core';

export const modWorkersDataTable = () => {
  const sortByLocation = (a, b) => {
    const workerALocation = a.worker.attributes.location?.toLowerCase() || "";
    const workerBLocation = b.worker.attributes.location?.toLowerCase() || "";
    const workerAName = a.worker.fullName?.toLowerCase() || a.worker.name?.toLowerCase() || "";
    const workerBName = b.worker.fullName?.toLowerCase() || b.worker.name?.toLowerCase() || "";

    return workerALocation.localeCompare(workerBLocation)
      || workerAName.localeCompare(workerBName);
  };

  const sortByActivityDuration = (a, b) => {
    return a.worker.source?.date_activity_changed < b.worker.source?.date_activity_changed
      ? 1
      : a.worker.source?.date_activity_changed > b.worker.source?.date_activity_changed
        ? -1
        : 0;
  };

  const sortCallsByLongestDurationSinceUpdate = (a, b) => {
    let longestTaskA;
    a.tasks.forEach(t => {
      if (!longestTaskA) {
        longestTaskA = t;
      } else if (t.dateUpdated < longestTaskA.dateUpdated) {
        longestTaskA = t;
      }
    });
    let longestTaskB;
    b.tasks.forEach(t => {
      if (!longestTaskB) {
        longestTaskB = t;
      } else if (t.dateUpdated < longestTaskB.dateUpdated) {
        longestTaskB = t;
      }
    });

    return longestTaskB?.dateUpdated - longestTaskA?.dateUpdated;
  };

  WorkersDataTable.Content.add(
    <ColumnDefinition
      key="worker-activity-time"
      header={"Aux Duration"}
      content={item => <Ticker>{() => item?.worker?.activityDuration}</Ticker>}
      sortingFn={sortByActivityDuration}
    />
  );
  WorkersDataTable.Content.add(
    <ColumnDefinition
      key="worker-location"
      header={"Location"}
      content={item => <div style={{ fontSize: '12px' }}>{item?.worker?.attributes?.location}</div>}
      sortingFn={sortByLocation}
    />
  );
  WorkersDataTable.Content.add(
    <ColumnDefinition
      key="worker-roles"
      header={"Roles"}
      content={item => <div style={{ fontSize: '12px' }}>{
          Array.isArray(item?.worker?.attributes?.roles)
          && item?.worker?.attributes?.roles?.join(', ')
        }</div>
      }
    />
  );

  WorkersDataTable.defaultProps.sortCalls = sortCallsByLongestDurationSinceUpdate;
}
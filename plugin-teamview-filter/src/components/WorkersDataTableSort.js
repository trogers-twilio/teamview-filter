import React from 'react'
import Select from 'react-select';
import styled from 'react-emotion';
import { Actions, WorkersDataTable } from '@twilio/flex-ui'

const options = [
  { value: 'activityTimeAsc', label: 'Activity Time, Ascending'},
  { value: 'activityTimeDesc', label: 'Activity Time, Descending'},
  { value: 'agentNameAsc', label: 'Agent Name, Ascending'},
  { value: 'agentNameDesc', label: 'Agent Name, Descending'},
  { value: 'locationAsc', label: 'Location, Ascending'},
  { value: 'locationDesc', label: 'Location, Descending'},
]

const Container = styled('div')`
  margin: 16px;
`;

const Title = styled('div')`
  font-size: 10px;
  font-weight: normal;
  margin-bottom: 2px;
`;

const selectStyles = {
  // Setting maxHeight to 53 to ensure the input field only expands
  // to two lines. If it grows beyond two lines, it will push the
  // menu list outside of the div and requiring scrolling the containing
  // div as well as the menu list itself to see all the options, which
  // could be confusing for the user
  valueContainer: (provided) => ({
    ...provided,
    maxHeight: 50,
    overflow: 'auto',
  }),
  // container: (provided) => ({
  //   margin: 16
  // }),
  control: (provided) => ({
    ...provided,
    borderRadius: 0,
    maxHeight: 53
  }),
  // Setting maxHeight to 150px to ensure that its height along with
  // the input container's height at two lines of selected options
  // doesn't exceed the height of the containing div
  menuList: (provided) => ({
    ...provided,
    maxHeight: '150px',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 0,
  })
};

class WorkersDataTableSort extends React.Component {
  refreshTeamView = () => {
    Actions.invokeAction('NavigateToView', { viewName: 'agent' });
    Actions.invokeAction('NavigateToView', { viewName: 'teams' });
  }

  sortByActivityTime = (isAscending) => {
    WorkersDataTable.defaultProps.sortWorkers = (workerA, workerB) => {
      return workerA.source?.date_activity_changed < workerB.source?.date_activity_changed
        ? (isAscending ? 1 : -1)
        : workerA.source?.date_activity_changed > workerB.source?.date_activity_changed
          ? (isAscending ? -1 : 1)
          : 0
    }
    this.refreshTeamView();
  }

  sortByAgentName = (isAscending) => {
    WorkersDataTable.defaultProps.sortWorkers = (workerA, workerB) => {
      console.debug('sortByAgentName', workerA, workerB);
      const workerAName = workerA.fullName || workerA.name || "";
      const workerBName = workerB.fullName || workerB.name || "";

      return isAscending
        ? workerAName.toLowerCase().localeCompare(workerBName.toLowerCase())
        : workerBName.toLowerCase().localeCompare(workerAName.toLowerCase());
    }
    this.refreshTeamView();
  }

  sortByLocation = (isAscending) => {
    WorkersDataTable.defaultProps.sortWorkers = (workerA, workerB) => {
      const workerALocation = workerA.attributes.location || '';
      const workerBLocation = workerB.attributes.location || '';
      const workerAName = workerA.fullName || workerA.name || "";
      const workerBName = workerB.fullName || workerB.name || "";

      return isAscending
        ? (workerALocation.toLowerCase().localeCompare(workerBLocation.toLowerCase())
          || workerAName.toLowerCase().localeCompare(workerBName.toLowerCase()))
        : (workerBLocation.toLowerCase().localeCompare(workerALocation.toLowerCase())
          || workerBName.toLowerCase().localeCompare(workerAName.toLowerCase()));
    }
    this.refreshTeamView();
  }
  
  handleChange = (e) => {
    switch(e?.value) {
      case 'activityTimeAsc': {
        this.sortByActivityTime(true);
        break;
      }
      case 'activityTimeDesc': {
        this.sortByActivityTime(false);
        break;
      }
      case 'agentNameAsc': {
        this.sortByAgentName(true);
        break;
      }
      case 'agentNameDesc': {
        this.sortByAgentName(false);
        break;
      }
      case 'locationAsc': {
        this.sortByLocation(true);
        break;
      }
      case 'locationDesc': {
        this.sortByLocation(false);
        break;
      }
      default: {
        this.sortByAgentName(true);
      }
    }
  }

  render() {
    return (
      <Container>
        <Title>Sort Agents By</Title>
        <Select
          id="worker-data-table-sort"
          isClearable
          options={options}
          onChange={this.handleChange}
          styles={selectStyles}
        />
      </Container>
    )
  }
}

export default WorkersDataTableSort;

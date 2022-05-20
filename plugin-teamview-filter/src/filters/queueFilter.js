import React from 'react';

import TaskRouterService from '../services/TaskRouterService';
import { QueueSelectFilter, QueueSelectFilterLabel } from '../components/QueueSelectFilter';

let queues = [];

export const queueFilterList = async () => {

  const taskQueues = await TaskRouterService.getQueues();

  queues = taskQueues.map(q => ({
    value: q.sid,
    label: q.friendlyName,
    default: false
  }));

  if (Array.isArray(queues) && queues.length > 0) {
    queues.sort((a, b) => {
      return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
    });
  }
}

export const queueFilter = () => ({
  id: 'queue-replacement',
  title: 'Queue Eligibility',
  fieldName: 'queue',
  options: queues,
  customStructure: {
    field: <QueueSelectFilter isMultiSelect={false} />,
    label: <QueueSelectFilterLabel />
  },
  condition: 'IN'
});
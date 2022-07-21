import { Actions } from '@twilio/flex-ui';

const updateQueueFilterState = (state) => {
  Actions.invokeAction('SetComponentState', { name: 'queueFilter', state });
};

export const setSelectedQueue = (selectedQueue) => {
  updateQueueFilterState({ selectedQueue });
};

export const clearSelectedQueue = () => {
  updateQueueFilterState({ selectedQueue: [] });
}
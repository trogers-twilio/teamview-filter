import { Manager } from '@twilio/flex-ui';

const manager = Manager.getInstance();

export const getSkills = () => {

  const { taskrouter_skills } = manager.serviceConfiguration;

  return ({taskrouter_skills});
};

export const getActivities = () => {
  const state = manager.store.getState();
  return state?.flex?.worker?.activities;
};

export const isArraysEqual = (a, b) => {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
};

export const fetchJsonWithReject = (url, config, attempts = 0) => {
  return fetch(url, config)
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .catch(async (error) => {
      // Try to return proper error message from both caught promises and Error objects
      // https://gist.github.com/odewahn/5a5eeb23279eed6a80d7798fdb47fe91
      try {
        // Generic retry when calls return a 'too many requests' response
        // request is delayed by a random number which grows with the number of retries
        if (error.status === 429 && attempts < 10) {
          await delay(random(100, 750) + (attempts * 100));
          return await fetchJsonWithReject<T>(url, config, attempts + 1);
        }
        return error.json().then((response) => {
          throw response;
        });
      } catch (e) {
        throw error;
      }
    });
};


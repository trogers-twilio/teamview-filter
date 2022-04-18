import { Manager } from '@twilio/flex-ui';

const manager = Manager.getInstance();

export const getSkills = () => {

  const { taskrouter_skills } = manager.serviceConfiguration;

  return ({taskrouter_skills});
};


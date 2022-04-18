import { getSkills } from '../helper';

export const skillsFilter = () => {

  const value = getSkills();

  const skillsArray = []
  value.taskrouter_skills.forEach(element => skillsArray.push(element.name));


  return{
    id: 'data.attributes.routing.skills',
    title: 'Skills',
    fieldName: 'skills',
    type: 'multiValue',
    options: skillsArray.sort().map(value => ({
      value,
      label: value,
      default: false
    })),
    condition: 'IN'
  };

};
import * as Flex from "@twilio/flex-ui";
import React from 'react';

import { MultiSelectFilter, MultiSelectFilterLabel } from '../components/MultiSelectFilter';

var workerLocationList = [];

let expression = "";

// only get the manager list
export const locationFilterList = () => {
  
  Flex.Manager.getInstance()
  .insightsClient.instantQuery("tr-worker")
  .then((q) => {
      q.on("searchResult", (items) => {
        let error;
        let length = Object.keys(items).length;
        let at_least_one_worker_has_a_location = false;

        for (const [key, value] of Object.entries(items)){
          if (value.attributes.location) {
              workerLocationList.push(value.attributes.location);
              at_least_one_worker_has_a_location = true;
          }
        }

        // Removing duplicates
        workerLocationList = [...(new Set(workerLocationList))];
        // console.log('The length is',workerLocationList);

        // If another search is needed, make it.  Otherwise we end here.
        if (length > 199 && at_least_one_worker_has_a_location) { 
          
          // Build the expression for search
          expression = 'data.attributes.location CONTAINS "" ';
          var groupOfThirty = [];
          var groupOfThirtyExpression = [];              
          for (let i=0; i<workerLocationList.length/29; i++){               
              groupOfThirty.push(workerLocationList.slice(i*29, 29*(i+1)).join(`','`));                
              groupOfThirtyExpression.push(`and data.attributes.location NOT_IN ['${groupOfThirty[i]}']`);
          }            
          expression += groupOfThirtyExpression.join(' ');

          // Run the search again
          q.search(expression).catch(() => {
              error = "Invalid query" ;
              console.log('Error',error);
          });
        }        
      });

      q.search('data.attributes.location CONTAINS ""').catch(() => {
          error = "Invalid query" ;
          console.log('Error',error);
      });
  });
}

const sortCaseInsensitive = function (a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

export const locationFilter = () => {
  return{
      id: 'data.attributes.location',
      title: 'Location',
      fieldName: 'location',
      options: workerLocationList.sort(sortCaseInsensitive).map(value => ({
        value,
        label: value,
        default: false
      })),
      customStructure: {
        field: <MultiSelectFilter isMultiSelect={true} />,
        label: <MultiSelectFilterLabel />
      },
      condition: 'IN'
    };
};


  



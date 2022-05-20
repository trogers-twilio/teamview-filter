import * as Flex from "@twilio/flex-ui";

var workerRolesList = [];

let expression = "";

// only get the manager list
export const rolesFilterList = () => {
  
  Flex.Manager.getInstance()
  .insightsClient.instantQuery("tr-worker")
  .then((q) => {
      q.on("searchResult", (items) => {
        let error;
        let length = Object.keys(items).length;
        let at_least_one_worker_has_a_role = false;

        for (const [key, value] of Object.entries(items)){
          if (Array.isArray(value.attributes.roles)) {
            value.attributes.roles.forEach(r => workerRolesList.push(r));
            at_least_one_worker_has_a_role = true;
          }
        }

        workerRolesList = [...(new Set(workerRolesList))];

        // If another search is needed, make it.  Otherwise we end here.
        if (length > 199 && at_least_one_worker_has_a_role) { 
          
          // Build the expression for search
          expression = 'data.attributes.role CONTAINS "" ';
          var groupOfThirty = [];
          var groupOfThirtyExpression = [];              
          for (let i=0; i<workerRolesList.length/29; i++){               
              groupOfThirty.push(workerRolesList.slice(i*29, 29*(i+1)).join(`','`));                
              groupOfThirtyExpression.push(`and data.attributes.roles NOT_IN ['${groupOfThirty[i]}']`);
          }            
          expression += groupOfThirtyExpression.join(' ');

          // Run the search again
          q.search(expression).catch(() => {
              error = "Invalid query" ;
              console.log('Error',error);
          });
        }        
      });

      q.search('data.attributes.roles CONTAINS ""').catch(() => {
          error = "Invalid query" ;
          console.log('Error',error);
      });
  
      
  });
  
}

const sortCaseInsensitive = function (a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

export const rolesFilter = () => {

    return{
        id: 'data.attributes.roles',
        title: 'Roles',
        fieldName: 'roles',
        type: 'multiValue',
        options: workerRolesList.sort(sortCaseInsensitive).map(value => ({
          value,
          label: value,
          default: false
        })),
        condition: 'IN'
      };

};


  



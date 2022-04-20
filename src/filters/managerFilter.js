import * as Flex from "@twilio/flex-ui";

  var managerList = [];

  let expression = "";

  // only get the manager list
  export const managerFilterList = () => {
   
    Flex.Manager.getInstance()
    .insightsClient.instantQuery("tr-worker")
    .then((q) => {
        q.on("searchResult", (items) => {
          let error;
          let length = Object.keys(items).length;
          let at_least_one_worker_has_a_manager = false;

          for (const [key, value] of Object.entries(items)){
            if (value.attributes['manager']) {
                managerList.push(value.attributes.manager);
                at_least_one_worker_has_a_manager = true;
            }
          }

          // Removing duplicates
          managerList = [...(new Set(managerList))]
   
          // If another search is needed, make it.  Otherwise we end here.
          if (length > 199 && at_least_one_worker_has_a_manager) { 
            
            // Build the expression for search
            expression = "";
            var groupOfThirty = [];
            var groupOfThirtyExpression = [];        
            for (let i=0; i<managerList.length/29; i++){               
                groupOfThirty.push(managerList.slice(i*29, 29*(i+1)).join(`','`));                
                groupOfThirtyExpression.push(`and data.attributes.manager NOT_IN ['${groupOfThirty[i]}']`);
            }            
            expression = groupOfThirtyExpression.join(' ').slice(4);

            // Run the search again
            q.search(expression).catch(() => {
                error = "Invalid query" ;
                console.log('Error',error);
           });
          }        
        });

        q.search("").catch(() => {
            error = "Invalid query" ;
            console.log('Error',error);
        });
    
        
    });
   
  }


export const managerFilter = () => {

    return{
        id: 'data.attributes.manager',
        title: 'Manager',
        fieldName: 'manager',
        type: 'multiValue',
        options: managerList.sort(function (a, b){return a.toLowerCase().localeCompare(b.toLowerCase());}).map(value => ({
          value,
          label: value,
          default: false
        })),
        condition: 'IN'
      };

};


  



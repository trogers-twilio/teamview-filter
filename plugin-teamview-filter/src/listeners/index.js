import { Actions, Notifications } from '@twilio/flex-ui';

import TaskRouterService from '../services/TaskRouterService';
import { TeamViewQueueFilterNotification } from '../notifications';

// this method supports the application of a queue filter to the teams view but
// this is only possible for a subset of queue expressions, not all queue expressions
// can be supported.  This is because each individual expression in the TeamsFilter 
// is explicitly OR'd on a single attribute and each expression in the TeamsFilter 
// array is AND'd.  Since a queue expression can be made up of AND's and OR's its
// impossible to apply those types fo expression across this interface
//
// if at a future date that kind of look up was required we would need to look
// to replacing the mechanism for querying the workers.  Most likely what might
// make sense then is to keep a state model on stripe backend systems thats synced
// via event streams, then replace the query to query that backend and override 
// ApplyListFilters to take the result and push it into the redux store.
//
// TeamsFilter array item:
//
// {
//    condition: IN,
//    name: data.attributes.email
//    values: ['example@gmail.com', 'example+1@gmail.com']  <-- these values are OR'd
// } <---- each array item is AND'd.
//
// note in the expression above only one element can be examined
// i.e data.attributes.email.
// 
// given the current queue expression configuration used at Stripe 
// this has been written to support a very narrow subset of queue expressions
// explcititly that 
// if there are multiple expressions in the queue expression - these are expected
// to be AND'd. The existence of any OR expressions will result in ignoring the
// queue filter. Also only these qualifiers are supported
// HAS|==|EQ|!=|CONTAINS|IN|NOT IN

Actions.addListener('beforeApplyListFilters', async (payload, abortFunction) => {
  const { key, filters } = payload 

  // ignore for anything but teams-view-filter
  if(key !== "teams-view-filter") return;

  let queueEligibilityFilter = null;

  // identify any queue filter placeholders in the selection
  filters.forEach((filter) => {
    if(filter.name === "queue-replacement") queueEligibilityFilter = filter;
  });

  // if no queue filters return
  if(!queueEligibilityFilter) return

  // create new filters by copying existing filters 
  // but remove any queue filter placeholders
  let newFilter = filters.filter((element) => element.name !== "queue-replacement" );

  if (!newFilter.find(f => f.name === 'data.attributes.routing.skills')) {
    // If the payload filters don't already include one for routing.skills,
    // we need to add one an empty array filter to the end of the filters
    // in case the Team View Filters includes a filter already for skills.
    // Otherwise, the last skill added for the queue-replacement filter will
    // show as selected in the skill filter
    newFilter.push({
      name: 'data.attributes.routing.skills',
      condition: 'IN',
      values: []
    });
  }

  // update the applied filters to use the new array
  // which currently has no queue filters
  payload.filters = newFilter;
  let queueFiltersArray = [];

  // now match to queue so we can convert queue expression
  // and generate new queue filters
  const queues = await TaskRouterService.getQueues();
  const queue = queues.find(queue => {return queue.sid === queueEligibilityFilter?.values?.value})

  const targetWorkers = queue.targetWorkers;

  console.log("Queue Selected For Filter", queue);
  // if the targetWorkers is 1==1 we can ignore it
  if(targetWorkers !== "1==1") {
    // assuming expressions are formatted as explained above
    const expressionComponents = targetWorkers.match(/((\b(?:\.)+\S+\b|\b(?:\S+)+\S+\b)(\s)+(HAS|==|EQ|!=|CONTAINS|IN|NOT IN)(\s)+(('|")\S+('|")))/gi)
    const containsORs = targetWorkers.includes(" OR ");

    // validate expressions have been parsed and that there are no OR'd statements
    if(!expressionComponents || expressionComponents.length === 0) {
      Notifications.showNotification(TeamViewQueueFilterNotification.ErrorParsingQueueExpression);
      return;
    } else if (containsORs) {
      Notifications.showNotification(TeamViewQueueFilterNotification.ErrorParsingQueueExpressionWithOR);
      return
    }

    // for each expression break it down and create a filter
    expressionComponents.forEach(expression => {
      const tempName = RegExp(/(\b(?:\.)+\S+\b|\b(?:\S+)+\S+\b)/, 'i').exec(expression);
      const tempCondition = RegExp(/( HAS |==|!=| CONTAINS | IN | NOT IN )/, 'i').exec(expression);
      const tempValue = RegExp(/(('|")\S+('|"))/, 'i').exec(expression);

      // check each regex pulled out a value
      // struggled with regex here not pulling out the same value multiple times
      // even though we expect it only to pull it out once so just checking
      // result is > 0
      // we than parse out any invalid characters such as spaces and format
      // any conditions that need replaced (currently all other conditions 
      // referenced in regex are compatible with livequery language
      // liveQuery syntax: https://www.twilio.com/docs/sync/live-query#query-operators
      // task router expression syntax: https://www.twilio.com/docs/taskrouter/expression-syntax#comparison-operators
      if(tempName && tempName.length > 0 && tempCondition && tempCondition.length > 0 && tempValue && tempValue.length > 0) { 

        const name = `data.attributes.${tempName[0]}`
        const condition = tempCondition[0].replace(/has/i, 'IN').replace(/[^a-zA-Z=!]/g, "");
        const values = [tempValue[0].replace(/[^a-zA-Z_-]/g,"")]

        const tempFilter = {
          name,
          condition,
          values
        }
        queueFiltersArray.push(tempFilter);
      } else {
        Flex.Notifications.showNotification(TeamViewQueueFilterNotification.ErrorParsingQueueExpression);
        return;
      }
    })  

    payload.filters = [...queueFiltersArray, ...newFilter]
  }
  return;
});
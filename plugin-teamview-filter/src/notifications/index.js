import { Notifications, NotificationType } from '@twilio/flex-ui';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export const TeamViewQueueFilterNotification = {
  ErrorParsingQueueExpression: 'ErrorParsingQueueExpression',
  ErrorParsingQueueExpressionWithOR: 'ErrorParsingQueueExpressionWithOR'
};

export default (manager) => {
  errorParsingQueueExpression(manager);
}

function errorParsingQueueExpression(manager) {
  manager.strings[TeamViewQueueFilterNotification.ErrorParsingQueueExpression] = (
    'Failed to parse queue expression, ignoring queue filter.'
  );
  manager.strings[TeamViewQueueFilterNotification.ErrorParsingQueueExpressionWithOR] = (
    'Unable to apply queue filters to queues containing OR\'d expressions. Ignoring queue filter.'
  );

  Notifications.registerNotification({
    id: TeamViewQueueFilterNotification.ErrorParsingQueueExpression,
    type: NotificationType.warning,
    content: TeamViewQueueFilterNotification.ErrorParsingQueueExpression
  });

  Notifications.registerNotification({
    id: TeamViewQueueFilterNotification.ErrorParsingQueueExpressionWithOR,
    type: NotificationType.warning,
    content: TeamViewQueueFilterNotification.ErrorParsingQueueExpressionWithOR
  });
}

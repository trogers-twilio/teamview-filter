const { random } = require("lodash");
const TokenValidator = require('twilio-flex-token-validator').functionValidator;

exports.handler = TokenValidator(async function (context, event, callback) {
	const response = new Twilio.Response();

	response.appendHeader('Access-Control-Allow-Origin', '*');
	response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
	response.appendHeader('Content-Type', 'application/json');
	response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

  const getQueues = async function (context, attempts) {

    try {
        const client = context.getTwilioClient();
        const queues = await client.taskrouter
            .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
            .taskQueues
            .list({limit: 1000})

        return { 
            success: true, 
            status: 200, 
            queues
        }

    } catch (error) {
        if(error & error.response 
          && error.response.stats == 429 
          && attempts < context.TWILIO_SERVICE_RETRY_LIMIT) {
            const waitTime = random(context.TWILIO_SERVICE_MIN_BACKOFF, context.TWILIO_SERVICE_MAX_BACKOFF);
            await snooze(waitTime);
            return getQueues(context, attempts + 1);
        }
        else {
            return { success: false, message: error, status: error.response.status };
        }
    }
  }

	try {
		const result = await getQueues(context, 0);
		const { success, queues: fullQueueData, message, status } = result
		const queues = fullQueueData? fullQueueData.map(queue => {
			const { targetWorkers, friendlyName, sid } = queue
			return { targetWorkers, friendlyName, sid }
		}) : null;
		response.setStatusCode(status);
		response.setBody({ success, queues, message })
		callback(null, response);
	} catch (error) {
		console.log(error);
		response.setStatusCode(500);
		response.setBody({ data: null, message: error.message });
		callback(null, response);
	}
});

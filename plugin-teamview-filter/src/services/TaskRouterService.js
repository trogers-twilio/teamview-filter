import { Manager } from '@twilio/flex-ui';

import { fetchJsonWithReject } from '../helper';

let queues = null

class TaskRouterService {
  manager = Manager.getInstance();

	serverlessDomain = process.env.REACT_APP_SERVERLESS_DOMAIN;

	buildBody(encodedParams) {
    return Object.keys(encodedParams).reduce((result, paramName, idx) => {
      if (encodedParams[paramName] === undefined) {
        return result;
      }
      if (idx > 0) {
        return `${result}&${paramName}=${encodedParams[paramName]}`;
      }
      return `${paramName}=${encodedParams[paramName]}`;
    }, '');
  }

	// does a one time fetch for queues per session
	// since queue configuration seldom changes
	async getQueues() {

		if(queues) return queues

		queues = await this.#getQueues();
		return queues;
	}

	#getQueues = () => {

		const encodedParams = {
			Token: encodeURIComponent(this.manager.user.token)
		};

		return fetchJsonWithReject(
			`https://${this.serverlessDomain}/list-taskqueues`,
			{
				method: 'post',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: this.buildBody(encodedParams)
			}
		).then((response) => {
			const { queues } = response;
			return queues;
		});
	};
}

export default new TaskRouterService();

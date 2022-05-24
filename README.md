<a href="https://www.twilio.com">
<img src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg" alt="Twilio" width="250" />
</a>

# Twilio Flex Plugins

Twilio Flex Plugins allow you to customize the appearance and behavior of [Twilio Flex](https://www.twilio.com/flex). If you want to learn more about the capabilities and how to use the API, check out our [Flex documentation](https://www.twilio.com/docs/flex).


## Plugin for customizing Teams View Filter

This plugin allows you to add and customize filters for filtering on managers, skills, locations, roles, and queue eligibility on Teams View dashboard. It also adds the Location and Roles worker attributes to the worker data table and adds the ability to sort on Activity Time, Agent Name, and Location. 

Please refer to the screenshots below for examples: 

![Screenshot Location Filter](resources/locationFilter.png) 
![Screenshot Manager Filter](resources/managerFilter.png)
![Screenshot Queue Eligibility Filter](resources/queueEligibilityFilter.png)
![Screenshot Roles Filter](resources/rolesFilter.png)
![Screenshot Agent Sort Options](resources/agentSortOptions.png)
![Screenshot Worker Location and Roles Columns](resources/locationRolesColumns.png)

## Requirements

To deploy this plugin, you will need:

- An active Twilio account with Flex provisioned. Refer to the [Flex Quickstart](https://www.twilio.com/docs/flex/quickstart/flex-basics#sign-up-for-or-sign-in-to-twilio-and-create-a-new-flex-project") to create one.
- npm version 5.0.0 or later installed (type `npm -v` in your terminal to check)
- Node.js [long term support(LTS) version](https://nodejs.org/en/about/releases/)(type `node -v` in your terminal to check)

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

1.  Clone this repo:

```bash
https://github.com/cherylmj01/teamview-filter.git
```

2. Go to the plugin directory

```bash
cd plugin-TeamViewFilters
```

3. Install the dependencies

```bash
npm install
```

4. Run plugin on a local environment using Twilio CLI :

```bash
twilio flex:plugins:start
```

5. Deploy your plugin to your Flex project using Twilio CLI:

```bash
twilio flex:plugins:deploy --major --changelog "Notes for this version" --description "Functionality of the plugin"
```

More detailed information about deploying Flex plugins can be found here: https://www.twilio.com/docs/flex/developer/plugins/cli/deploy-and-release

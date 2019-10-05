# Update a table with calendar provided events

This project delivers a NodeJS script in which you are able to connect your calendar events with table on Azure Devops Wiki. 

## Authorization
Because this script has a connection with Google Calendar, there is a need for auth configuration ([Get Google API authorization using OAuth2](https://developers.google.com/calendar/auth)). Also to gain access to Azure Devops you need to provide PAT ([How to receive PAT on Azure Platform](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops)).

To start, you have to create your `auth.js` file. This file has to have specific structure:
```
module.exports = {
  personalAccessToken: 'Your PAT encoded in Base64',
  googleToken: {
    clientId: 'Client ID from Google Project OAuth',
    projectId: 'Project ID from Google Project OAuth',
    clientSecret: 'Client Secret from Google Project OAuth',
    redirectUris: [],
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.events.readonly',
    ]
  },
};
```

## Configuration
To make this script universal, you have to provide your own configuration. This can be done by creating a file `calendar.config.js` in root of this script and provading object:
```
module.exports = {
  userName: 'Your name to be looked for in table on Wiki Page',
  workCalendar: 'Calendar to be used in Google Calendar',
  azureWikiPath: 'Absolute path of Folder where pages with avialibility should be placed',
  azure: {
    organizationName: 'URI encoded name of organization',
    teamProjectName: 'URI encoded name of the project',
    wikiName: 'URI encoded name of the project wiki',
    documentPath: 'Absolute path of folder where pages with avialibility should be placed',
    documentTemplatePath: 'Absolute path of page with template of table for creating new page on monday',
  },
  eventType: {
    office: 'Name of office event to be collected from the calendar',
    remote: 'Name of remote working event to be collected from the calendar',
  },
};

```

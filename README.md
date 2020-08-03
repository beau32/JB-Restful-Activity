# Journey Builder
## Custom Interaction - This is app allows journey builder to integrate with third party API in real time


**Reference links:**
* https://github.com/axios/axios
* https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/how-data-binding-works.htm
* https://github.com/janl/mustache.js/

**NOTE:** You won't be able to run this locally. It is intended to be ran on a publicly available web server/cloud only.

**NOTE:** This app and the associated code is NOT production quality, its pure purpose is to demonstrate the full flow of custom interactions in Journey Builder, it uses express 4.xx instead of 3.

### Pre-Requisites

* Node.js (to test locally)
* Must have an Salesforce Marketing Cloud account
* Journey Builder and all associated applications  must be provisioned into this account
* A publicly accessible web server or cloud (this app uses [Heroku](https://heroku.com) with a single dyno, You'll need the Heroku toolbelt if you're using that PaaS for this app.
* Web Server or Cloud MUST support SSL (which is why we recommend Heroku...it just works for single dyno apps)
* A valid Code@ account and associated App Center Developer Account (available from within Code@)
* Understanding of client-server communications, JavaScript, HTML(5), Node.js and Express

### How To Use

#### Creating our base app in Code@

1. clone this repository locally

2. Login to your account on Marketing Cloud

3. Select Setup -> App Integration from navigation.

4. Select "Create New App"

5. Create a custom activity for journey builder, and fill in the endpoint for the app, hit save.

6. Integrate your app with an account which will not be impacted by having an additional icon in the app switcher of the marketing cloud

7. Make sure everything is correct, and finish.

8. Go to Journey Builder and you should see the custom activity appearing in the bottom.


#### Re-deploy application to host
Now that you have updated your configurations to point to the appropriate resources, push your changes.


#### Defining our test journey using a data extension as the source
1. Log into the [Marketing Cloud](https://mc.exacttarget.com/cloud)

2. Choose Journey Builder and create a new journey.

3. Add a data extension source 


#### Creating our Custom Activity
1. Drag the custom activity from the list onto the Interaction Canvas

2. Hover and click the activity

3. The custom activity dialog should appear (this is loading from your app)

4. fill in the url and parameters, parameters must be of the request json object specified by axios. use data binding to access any part of the data structure in Mc.

example:
```
{
  method: 'get',
  url: 'https://apidev.contactspace.com/',
  data: {
    apikey: "",
    function: 'InsertRecord',
    module: 'data',
    datasetid: 1745,
    xmldata: "<record><SF_Status>Pending</SF_Status><SF_Campaign>{{Contact.Attribute.testlist.campaignid}}</SF_Campaign><SF_ActionType>New Regular Gift</SF_ActionType><SF_CampaignMember>{{Contact.Attribute.testlist.campaignmemberid}}</SF_CampaignMember><First_Name>{{Contact.Attribute.testlist.firstname}}</First_Name><Surname>{{Contact.Attribute.testlist.lastname}}</Surname><Phone_number_01>{{Contact.Attribute.testlist.phone}}</Phone_number_01></record>"
  }
}
```

5. activiate the journey, validate result via nodejs server log and destination API endpoint

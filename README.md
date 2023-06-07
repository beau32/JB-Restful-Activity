## JB RESTful Activity - This is app allows SFMC journey builder to integrate with third party API in real time

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/beau32/JB-Restful-Activity)

**Reference links:**
* https://github.com/axios/axios
* https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/how-data-binding-works.htm
* https://github.com/janl/mustache.js/

**NOTE:** You won't be able to run this locally. It is intended to be ran on a publicly available web server/cloud only.

### Pre-Requisites

* Node.js (to test locally)
* Must have an Salesforce Marketing Cloud account
* Journey Builder and all associated applications  must be provisioned into this account
* A publicly accessible web server or cloud (netlify)
* Understanding of client-server communications, JavaScript, HTML(5), Node.js and Express

### How To Use

1. Deploy to netlify using the button above, load the environment variables based on the ones in .env file
2. Login to your account on Marketing Cloud
3. Select Setup -> App Integration from navigation
4. Select "Create New App"
5. Create a custom activity for journey builder, and fill in the endpoint for the app, `{subdomain}.netlify.app/public/jbcustom/` hit save then hit finish
8. Go to Journey Builder and you should see the custom activity appearing in the bottom


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
4. fill in the request body using json object specified by axios. Leverage data binding to access any part of the data structure sent in from SFMC.

<img width="667" alt="image" src="https://github.com/beau32/JB-Restful-Activity/assets/305363/f3439569-20ea-4d6a-96d7-307b7fcafb45">

example:
```
{
  method: 'get',
  url: 'https://apidev.example.com/',
  params: {
    apikey: "",
    function: 'InsertRecord',
    module: 'data',
    datasetid: 8088,
    xmldata: "<record><SF_Status>Pending</SF_Status><SF_Campaign>{{Contact.Attribute.testlist.campaignid}}</SF_Campaign><SF_ActionType>New Regular Gift</SF_ActionType><SF_CampaignMember>{{Contact.Attribute.testlist.campaignmemberid}}</SF_CampaignMember><First_Name>{{Contact.Attribute.testlist.firstname}}</First_Name><Surname>{{Contact.Attribute.testlist.lastname}}</Surname><Phone_number_01>{{Contact.Attribute.testlist.phone}}</Phone_number_01></record>"
  }
}
```
5. fill in webhook url and Oauth 2.0 if required
6. fill in pre/post run options if you need to run your own javascript, SFMC data binding variables such as InArguments are accessible. Pre-run script aimes to address use case where request logging or data transformation is required. Post-run script allows developers to transform the server response into a format that can be consumed back in SFMC via outArguments
7. activiate the journey, validate result via nodejs server log and destination API endpoint

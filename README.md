# Journey Builder
## Custom Interaction - This is app allows journey builder to integrate with third party API in real time

**NOTE:** You won't be able to run this locally. It is intended to be ran on a publicly available web server/cloud only.

**NOTE:** This app and the associated code is NOT production quality, its pure purpose is to demonstrate the full flow of custom interactions in Journey Builder, it uses express 4.xx instead of 3.

### Pre-Requisites

* Node.js (to test locally)
* Must have an Salesforce Marketing Cloud account
* Journey Builder and all associated applications  must be provisioned into this account
* A publicly accessible web server or cloud (I'll be using [Heroku](https://heroku.com) with a single dyno and you can too, just sign up for a free account) You'll need the Heroku toolbelt if you're using that PaaS for this app.
* Web Server or Cloud MUST support SSL (which is why we recommend Heroku...it just works for single dyno apps)
* A valid Code@ account and associated App Center Developer Account (available from within Code@)
* Understanding of client-server communications, JavaScript, HTML(5), Node.js and Express

### How To Use

#### Creating our base app in Code@

1. clone this repository locally

2. Login to your Code@ account [https://code.exacttarget.com/user/login](https://code.exacttarget.com/user/login)

3. Select [App Center](https://code.exacttarget.com/appcenter) from the Code@ navigation. Register as a developer if you haven't already.

4. Select "Create New App"

5. Select "Marketing Cloud" as the template type and use the following properties:
    
    * App Type: HubExchange App
    * App Category: Offline
    * Name: Hello World
    * Description: This is a hello world app
    * Package: &lt;THIS MUST BE UNIQUE ACROSS ALL OF EXACTTARGET&gt; (I recommend something like johndoeJBCustomHelloWorldApp) where you replace johndoe with your first and last name
    * Would you like to use an existing App ID: No
    * IMH Icon: Not required
    * Application Endpoints: The base is your publicly accessible web server's endpoint for this app, this can be updated later, MUST BE OVER SSL
        * Login URL: https://endpoint.tld/login
        * Logout URL: https://endpoint.tld/logout
        * Redirect URL: https://endpoint.tld/
    * Application Event Callbacks: Not required

6. Integrate your app with an account which will not be impacted by having an additional icon in the app switcher of the marketing cloud

7. Data Access: No (SSO Only)

8. Make sure everything is correct, and finish.

9. If everything is successful, you should see a message saying so. Stay on this screen and let's copy the information into our app's code we'll need...

#### Web Server

1. At this point we're going to need the endpoint for our app and subsequently each app extension

2. If you're using Heroku, create a new app and copy the endpoint.

#### Defining our Trigger App Extension
1. In App Center on Code@, with your newly created app open, scroll to the bottom of the page

2. Click "Create a new Interaction Studio Trigger" (we'll be renaming this soon)

3. Properties:
    * Name: Hello World
    * Key: jb-hello-world-trigger-yourname (Replace yourname with your first and last name, if I am John Smith: johnsmith. This ensures your key is unique)
    * Description: Hello World Trigger
    * Endpoint URL: https://&lt;webserver-endpoint&gt;/ixn/triggers/hello-world (no trailing slash)
    * Help URL: https://&lt;webserver-endpoint&gt;/ixn/triggers/hello-world/help (no trailing slash)
    * Help Description: Hello World Trigger Help
    * Category: Trigger
    * Public Extension: This application and all other installed applications
    * Upload Icon: Choose the icon in: /public/ixn/triggers/hello-world/images/

4. Save

#### Defining our Activity App Extension
1. In App Center on Code@, with your newly created app open, scroll to the bottom of the page

2. Click "Create a new Interaction Studio Activity" (we'll be renaming this soon)

3. Properties:
    * Name: Hello World Activity
    * Key: jb-hello-world-activity-yourname (Replace yourname with your first and last name, if I am John Smith: johnsmith. This ensures your key is unique)
    * Description: Hello World Activity
    * Endpoint URL: https://&lt;webserver-endpoint&gt;/ixn/activities/hello-world (no trailing slash)
    * Help URL: https://&lt;webserver-endpoint&gt;/ixn/activities/hello-world/help (no trailing slash)
    * Help Description: Hello World Trigger Help
    * Category: Message
    * Public Extension: This application and all other installed applications
    * Upload Icon: Choose the icon in: /public/ixn/activities/hello-world/images/

4. Save

#### Updating the code to reflect our new App Extensions
1. Open /public/ixn/activities/hello-world/config.json

2. Copy the "Key" property from your App Extension Custom Activity and paste it into config.js.key value

3. Replace the "__insert_your_custom_activity_endpoint__" with your web server's endpoint throughout the file.

#### Re-deploy application to host
Now that you have updated your configurations to point to the appropriate ExactTarget resources, push your changes.


#### Testing our app loads in the Marketing Cloud
1. Log into the [Marketing Cloud](https://mc.exacttarget.com/cloud)

2. From the App Switcher, choose "Hello World"

3. We should see the Hello World HubExchange app interface

#### Defining our Custom Trigger in Trigger Admin
1. Log into the [Marketing Cloud](https://mc.exacttarget.com/cloud)

2. Choose Marketing Automation -> Journey Builder

3. While viewing the Journey Builder Dashboard, we should be able to select "Trigger Administration" and see our new trigger in the list


#### Creating our Custom Trigger in Journey Builder
1. Create a new Interaction

2. Click to "Edit Trigger"

3. Select "Hello World" or whatever you named it from the list (look at for the "new" banner)

4. On the "Configure" step, enter a value you want to test for equality

5. Save it (you'll get a warning, this is a known bug being fixed).

6. Click to edit the Trigger again

7. Click the "Configure" tab, and wait for the value to load

8. Click next and save

9. The Trigger is configured

#### Creating our Custom Activity
1. Drag the "Hello World" activity from the list onto the Interaction Canvas

2. Hover and click the "Configure" button

3. The Hello World Activity dialog should appear (this is loading from your app)

4. Click save

5. The Activity is configured.

#### Testing our Custom Interaction
1. Select "Hello World" from the App Switcher on the Marketing Cloud

2. Enter an email that exists in your subscriber list

3. Enter the exact value as you entered in Creating our Custom Trigger in Journey Builder, step 4

4. Click "Fire the Event"

5. Events will come through the wire and post to the "Event List"

6. Click the "Get Latest Results" button and you should see the latest responses which have reached the "Activity"

## Licensing
 Please see the "LICENSE" file in the root of this repository for information related to licensing of this repository.

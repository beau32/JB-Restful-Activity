{
    "metaData": {
        "icon": "images/jb-icon.jpg",
        "iconSmall": "images/jb-icon.jpg"
    },
    "key": "d8f95a89-42c4-49f2-8297-eeb3e01f2ef2",
    "type": "myActivityType",
    "workflowApiVersion": "1.1",
    "lang": {
        "en-US": {        
            "name": "ContactSpace",
            "description": "Activity simply posts the data to API endpoint."
        }
    },
    "category": "messaging",
    "version": "1.0",
    "edit": {
        "uri": "index.html",
        "maxHeight": 500,
        "maxWidth": 750,
        "minHeight": 300,
        "minWidth": 450,
        "steps": 1
    },
    "userInterfaces": {
        "configModal": {
            "height": 200,
            "width": 300,
            "fullscreen": false
        }
    },
    "arguments": {
        "execute": {
            "inArguments": [{
                "contactIdentifier": "{{Contact.Key}}"
            },
            {
                "emailAddress": "{{InteractionDefaults.Email}}"
            }],
            "outArguments": [],
            "timeout": 100000,
            "retryCount": 1,
            "retryDelay": 10000,
            "concurrentRequests" : 5,
            "url": "https://journeyext.herokuapp.com/ixn/activities/ContactSpace/execute/"
        }
    },
    "configurationArguments": {
        "save": {
            "url": "https://journeyext.herokuapp.com/ixn/activities/ContactSpace/save/"
        },
        "publish": {
            "url": "https://journeyext.herokuapp.com/ixn/activities/ContactSpace/publish/"
        },
        "validate": {
            "url": "https://journeyext.herokuapp.com/ixn/activities/ContactSpace/validate/"
        },
        "stop": {
            "url": "https://journeyext.herokuapp.com/ixn/activities/ContactSpace/stop/"
        }
    }
}


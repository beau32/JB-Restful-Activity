{
        "icon": "images/jb-icon.jpg",
        "iconSmall": "images/jb-icon.jpg", 
        "key": "d8f95a89-42c4-49f2-8297-eeb3e01f2ef2",
        "partnerApiObjectTypeId": "IXN.CustomActivity.REST",
        "lang": {
            "en-US": {        
                "name": "Contact Space",
                "description": "Activity simply posts the data into an array for display on the App's home page."
            }
        },
        "category": "messaging",
        "version": "1.0",
        "apiVersion": "1.0",
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
       "execute": {
            "uri": "https://journeyext.herokuapp.com/ixn/activities/ContactSpace/execute/",
			"inArguments": [
                {
                    "contactIdentifier": "{{Contact.Key}}"
                },
                {
                    "emailAddress": "{{InteractionDefaults.Email}}"
                }
            ],
			"outArguments": [],
            "verb": "POST",
			"body": "",
            "format": "json",
            "useJwt": false,
            "timeout": 3000
		},
        "save": {
            "uri": "https://journeyext.herokuapp.com/ixn/activities/ContactSpace/save/",
			"verb": "POST",
			"body": "",
            "format": "json",
            "useJwt": false,
            "timeout": 3000
        },
        "publish": {
            "uri": "https://journeyext.herokuapp.com/ixn/activities/ContactSpace/publish/",
            "verb": "POST",
			"body": "",
            "format": "json",
            "useJwt": false,
            "timeout": 3000
        },
        "validate": {
            "uri": "https://journeyext.herokuapp.com/ixn/activities/ContactSpace/validate/",
            "verb": "POST",
			"body": "",
            "format": "json",
            "useJwt": false,
            "timeout": 3000
        }
}


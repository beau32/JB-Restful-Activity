module.exports = function configJSON(req) {
	return {

		"metaData": {
			"icon": "images/jb-icon.jpg",
			"iconSmall": "images/jb-icon.jpg"
		},
		"key": "d8f95a89-42c4-49f2-8297-eeb3e01f2ef2",
		"type": "Rest",
		"workflowApiVersion": "1.1",
		"lang": {
			"en-US": {        
				"name": "Restful Activity",
				"description": "Activity simply posts the data to API endpoint."
			}
		},
		"edit": {
			"url": `https://${req.headers.host}/JBcustom/`,
			"height": 600,
			"width": 800
		},
		"userInterfaces": {
			"configModal": {
				"height": 600,
				"width": 800,
				"fullscreen": false
			}
		},
		"arguments": {
			"execute": {
				"inArguments": [
					{ "emailAddress" : "{{InteractionDefaults.Email}}" },
					{ "call_body" : "" },
					{ "call_url" : "" },
					{"auth_url":""},
					{"auth_id":""},
					{"auth_secret":""},
					{ "contactIdentifier" : "{{Contact.Key}}" }
				],
				"outArguments": [],
				"useJwt": true,
				"timeout": 100000,
				"url": `https://${req.headers.host}/JBcustom/execute`
			}
		},
		"configurationArguments": {
			"save": {
				"url": `https://${req.headers.host}/JBcustom/save`,
				"body": "",
				"verb": "POST",
				"useJwt": true
			},
			"publish": {
				"url": `https://${req.headers.host}/JBcustom/publish`,
				"body": "",
				"verb": "POST",
				"useJwt": true
			},
			"validate": {
				"url": `https://${req.headers.host}/JBcustom/validate`,
				"body": "",
				"verb": "POST",
				"useJwt": true
			}
		}

	};
};

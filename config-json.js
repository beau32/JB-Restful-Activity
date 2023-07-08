module.exports = function configJSON(req) {
	return {
		triggers: [],
		goals: [],
		entryMode: "SingleEntryAcrossAllVersions",
		executionMode: "Production",
		status: "Draft",
		
		"metaData": {
			"icon": "JBcustom/images/jb-icon.jpg",
			"iconSmall": "JBcustom/images/jb-icon.jpg"
		},
		"key": `${process.env.APPKEY}`,
		"type": "Rest",
		"workflowApiVersion": "1.1",
		"lang": {
			"en-US": {        
				"name": "Restful Activity",
				"description": "Activity simply posts the data to API endpoint."
			}
		},
		"edit": {
			"url": `https://${process.env.DOMAIN}/JBcustom/`,
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
					{ "pre_script" : "" },
					{ "post_script" : "" },
					{ "call_retry" : "" },
					{ "auth_url" : "" },
					{ "call_url" : "" },
					{ "auth_id" : "" },
					{ "auth_secret" : "" },
					{ "contactIdentifier" : "{{Contact.Key}}" }
				],
				"outArguments": [],
				"useJwt": true,
				"timeout": 100000,
				"url": `https://${process.env.DOMAIN}/JBcustom/execute`
			}
		},
		"configurationArguments": {
			"save": {
				"url": `https://${process.env.DOMAIN}/JBcustom/save`,
				"body": "",
				"verb": "POST",
				"useJwt": true
			},
			"publish": {
				"url": `https://${process.env.DOMAIN}/JBcustom/publish`,
				"body": "",
				"verb": "POST",
				"useJwt": true
			},
			"validate": {
				"url": `https://${process.env.DOMAIN}/JBcustom/validate`,
				"body": "",
				"verb": "POST",
				"useJwt": true
			}
		},
		metaData: {
			isConfigured: true,
		}
	};
};

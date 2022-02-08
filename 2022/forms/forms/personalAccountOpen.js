const formDef = {
    "title": "Personal Account Opening ",
    "id": "PersonAccountOpeningForm",
    "sfdcAccessToken": "00D8c000003TgUT!AR4AQLbZGtIxlCEiDHqC2.xs.zxkFfm0MbhOb7JRbK0tXn5EwYU2FYOPTxMkQv3WZczVOT.0irCx.9WM1pYwyXTD83A54Zmt",
    "fields": [
        {
            "id": "FirstName",
            "label": "FirstName",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Enter your First Name"
            },
            "field": {
                "type": "text",
                "default": ""
            }
        },
        {
            "id": "LastName",
            "label": "LastName",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Enter your Last Name"
            },
            "field": {
                "type": "text",
                "default": ""
            }
        },
        {
            "id": "CurrentTime",
            "label": "Current Time From Server",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Current Time will be obtained from the server"
            },
            "field": {
                "type": "REST",
                "jsonPath": "$.time",
                "default": "",
                "url": "https://mohansun-rum.herokuapp.com/time"
            }
        },
        {
            "id": "APIStatus",
            "label": "Weather API Status",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Weather API Status"
            },
            "field": {
                "type": "REST",
                "jsonPath": "$.status",
                "default": "",
                "url": "https://api.weather.gov/"
            }
        },
        {
            "id": "CatFact",
            "label": "Cat Facts",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Cat Fact from API"
            },
            "field": {
                "type": "REST",
                "jsonPath": "$.fact",
                "default": "",
                "url": "https://catfact.ninja/fact"
            }
        },
        {
            "id": "OpportunityCount",
            "label": "Opportunity Count",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Get Opportunity Count"
            },
            "field": {
                "type": "SOQL",
                "soql": "SELECT COUNT(Id) OpptyCount FROM Opportunity",
                "jsonPath": "$.records[0].OpptyCount",
                "default": "",
                "url": "https://d8c000003tgutea0-dev-ed.my.salesforce.com/services/data/v51.0"
            }
        },
{
            "id": "AccountCount",
            "label": "Account Count",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Get Account Count"
            },
            "field": {
                "type": "SOQL",
                "soql": "SELECT COUNT(Id) AccountCount FROM Account",
                "jsonPath": "$.records[0].AccountCount",
                "default": "",
                "url": "https://d8c000003tgutea0-dev-ed.my.salesforce.com/services/data/v51.0"
            }
        },
        {
            "id": "DOB",
            "label": "Date of Birth",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Date of Birth "
            },
            "field": {
                "type": "date",
                "default": ""
            }
        },
        {
            "id": "USCitizen",
            "label": "US Citizen? ",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Are you a US Citizen?"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    "Yes",
                    "No"
                ]
            }
        },
        {
            "id": "DualCitizen",
            "label": "Have Dual Citizenship? ",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Have dual Citizenship?"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    "Yes",
                    "No"
                ]
            }
        },
        {
            "id": "Employment",
            "label": "Employment Status",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Employment Status?"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    "Employed",
                    "Retired",
                    "Self-Employed",
                    "Student",
                    "Not Employed"
                ]
            }
        },
        {
            "id": "SourceOfIncome",
            "label": "Source of Income?",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Your source of income"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    "Employment Income",
                    "Inheritance or Trust",
                    "Investment Income",
                    "Retirement Income",
                    "Social Security",
                    "Unemployment",
                    "Household Income /Homemaker"
                ]
            }
        }
    ]
}
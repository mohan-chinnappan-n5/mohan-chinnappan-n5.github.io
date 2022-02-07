const programInfo = {
    "title": "Program Info",
    "id": "ProgramInfoForm",
    "fields": [
        {
            "id": "ProgramCode",
            "label": "Program Code",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Select the program code"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    "BDC",
                    "C2",
                    "C3",
                    "ICP",
                    "Transplant",
                    "NC-MC",
                    "AKCOE1",
                    "AKCOE2",
                    "WACOE1",
                    "WACOE2",
                    "SBHG"
                ]
            }
        },
        {
            "id": "Client",
            "label": "Client",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Select the program code"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    "WPT",
                    "BCID-ALS",
                    "PBC",
                    "BCBSM",
                    "other"
                ]
            }
        },
        {
            "id": "Employer",
            "label": "Employer",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Select the program code"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    "Kroger",
                    "HA",
                    "Kyndryl",
                    "Eli Lilly",
                    "Citi",
                    "BOA",
                    "Huntington Ingalls"
                ]
            }
        },
        {
            "id": "PerTripMaximum",
            "label": "Per Trip Maximum",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Select Per Trip Maximum"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    2000,
                    "No Limit",
                    "Other"
                ]
            }
        },
        {
            "id": "PerProcMaximum",
            "label": "Per Procedure Maximum",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Select Per Procedure Maximum"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    3000,
                    5000,
                    6000,
                    10000,
                    "No Limit",
                    "Other"
                ]
            }
        },
        {
            "id": "LifeTimeMaximum",
            "label": "Life Time Maximum",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Select Life Time Maximum"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    6000,
                    10000,
                    "No Limit",
                    "Other"
                ]
            }
        },
        {
            "id": "GroundTransportMaximum",
            "label": "Ground Transport Maximum",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Select Ground Transport Maximum"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    35,
                    "No Limit",
                    "Other"
                ]
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
                "default": "time",
                "url":  "https://mohansun-rum.herokuapp.com/time"
            }
        },

        {
            "id": "Tolls",
            "label": "Tolls Covered?",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Tools Covered?"
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
            "id": "Parking",
            "label": "Parking Covered?",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Parking Covered?"
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
            "id": "Meals",
            "label": "Meals Covered?",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Meals Covered?"
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
            "id": "MedicalMilageRate",
            "label": "Medical Milage Rate",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Medical Milage Rate"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    "2021:16c",
                    "2022:18c"
                ]
            }
        },
        {
            "id": "BusinessMilageRate",
            "label": "Business Milage Rate",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Business Milage Rate"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    "2021:56c",
                    "2022:58.5c"
                ]
            }
        },
        {
            "id": "PerTripBased",
            "label": "Per Trip Based?",
            "type": "field",
            "required": true,
            "help": {
                "msg": "Is fee  charged based on Per Trip ?"
            },
            "field": {
                "type": "select",
                "default": "",
                "options": [
                    "Yes",
                    "No"
                ]
            },
            "onchange": {
                "toggle": "PerTripFee",
                "valueShow": "Yes",
                "valueHide": "No"
            }
        },
        {
            "id": "PerTripFee",
            "label": "Per Trip Fee",
            "type": "field",
            "required": true,
            "help": {
                "msg": "What is  fee charged based on Per Trip ?"
            },
            "field": {
                "type": "number",
                "default": ""
            }
        }
    ]
}
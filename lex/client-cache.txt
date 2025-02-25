Understanding cacheable=true in Apex Methods for LWC

In Lightning Web Components (LWC), the way you call Apex methods determines whether you must set cacheable=true or if it is optional.

1️⃣ Using @wire to Call an Apex Method

When you use the @wire decorator to call an Apex method, you must set cacheable=true.

✅ Example (Required cacheable=true)

public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account LIMIT 10];
    }
}

import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class AccountList extends LightningElement {
    @wire(getAccounts) accounts;
}

✅ Why is cacheable=true Required?
	•	@wire relies on caching to improve performance.
	•	Salesforce caches the response and may return stored data instead of hitting the server again.

🚨 Without cacheable=true, the Apex method cannot be called using @wire, and you will get an error.

2️⃣ Calling an Apex Method Imperatively

When calling Apex imperatively (using @AuraEnabled methods with then/catch or async/await), setting cacheable=true is optional.

✅ Example (Optional cacheable=true)

public with sharing class AccountController {
    @AuraEnabled(cacheable=true) // Optional but recommended
    public static List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account LIMIT 10];
    }
}

import { LightningElement } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class AccountList extends LightningElement {
    accounts;

    connectedCallback() {
        getAccounts()
            .then(result => {
                this.accounts = result;
            })
            .catch(error => {
                console.error(error);
            });
    }
}

✅ Why is cacheable=true Optional?
	•	Imperative calls do not use caching by default.
	•	If you want Salesforce to cache the result, you can set cacheable=true.

🚨 If cacheable=true is omitted, the request will always fetch fresh data from the server, which may lead to slower performance in some cases.

Comparison Table

Method	cacheable=true Required?	Caching Behavior
@wire	✅ Yes (Required)	Uses cached response when available.
Imperative Call (then/catch or async/await)	🔹 No (Optional)	Fetches fresh data unless cacheable=true is set.

Best Practices

1️⃣ Use @wire with cacheable=true when you want automatic data fetching and caching.
2️⃣ Use Imperative Apex calls when:
	•	You need real-time fresh data every time.
	•	You want to pass parameters dynamically to Apex methods.
3️⃣ If using imperative calls, consider cacheable=true for better performance, but only if stale data is acceptable.

🔹 Choosing the right approach depends on your use case and caching needs! 🚀
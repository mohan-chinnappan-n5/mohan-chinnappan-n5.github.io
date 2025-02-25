# Salesforce Apex Caching Options

Salesforce provides several caching mechanisms on the **Apex side** to improve performance and reduce redundant processing.

## 1. Platform Cache (Org & Session Cache)

-   **Purpose:** Store frequently accessed data in memory for quick retrieval.
-   **Types:**
    -   **Org Cache** – Shared across users and requests in the same org.
    -   **Session Cache** – Limited to a specific user session.
-   **Usage:**

    ```apex
    Cache.Org.put(key, value);
    Cache.Org.get(key);
    Cache.Session.put(key, value);
    Cache.Session.get(key);
    ```

    -   **Limits:**
        -   Default size varies by Salesforce edition (~10MB per org).
        -   TTL (Time to Live) is configurable.

## 2. Custom Static Variables in Apex

-   **Purpose:** Store temporary data within a single execution context (same transaction).
-   **Example:**

    ```apex
    public class MyCache {
        private static Map<String, String> cacheData = new Map<String, String>();

        public static String getValue(String key) {
            return cacheData.get(key);
        }

        public static void setValue(String key, String value) {
            cacheData.put(key, value);
        }
    }
    ```

-   **Limits:**
    -   Exists only during the current execution (lost after transaction ends).
    -   Not shared across transactions.

## 3. SOQL Query Caching

-   **Purpose:** Reduce redundant queries by using maps to store queried data.
-   **Example:**

    ```apex
    public class AccountCache {
        private static Map<Id, Account> accountMap;

        public static Account getAccount(Id accId) {
            if (accountMap == null) {
                accountMap = new Map<Id, Account>([SELECT Id, Name FROM Account]);
            }
            return accountMap.get(accId);
        }
    }
    ```

-   **Limits:**
    -   Data only lives during execution (not stored beyond transaction).
    -   Helps reduce SOQL queries but does not persist across requests.

## 4. Apex @AuraEnabled Data Caching (Client-Side)

-   **Purpose:** Cache Apex method results on the client-side (Lightning Component, LWC).
-   **Usage:**

    ```apex
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account LIMIT 10];
    }
    ```

-   **Limits:**
    -   Only caches data for Lightning and LWC components.
    -   Requires `@AuraEnabled(cacheable=true)`.

## 5. Data Caching via Custom Settings & Custom Metadata

-   **Purpose:** Store configuration data that rarely changes and avoid repeated SOQL calls.
-   **Options:**
    -   Custom Settings (Hierarchy or List)

        ```apex
        MyCustomSetting__c setting = MyCustomSetting__c.getInstance();
        ```

    -   Custom Metadata Types (better for metadata-driven logic)

        ```apex
        List<MyMetadata__mdt> metadata = [SELECT Field1__c FROM MyMetadata__mdt];
        ```

-   **Limits:**
    -   Custom Metadata is cached natively by Salesforce.
    -   Custom Settings can be queried but are not optimized like Metadata.

## 6. HTTP Callout Response Caching (Future & Continuation Methods)

-   **Purpose:** Reduce repeated API calls by caching responses.
-   **Example:** Store API results in Platform Cache or Custom Metadata.

## Best Use Cases

| Use Case                                  | Best Caching Option                      |
| ----------------------------------------- | ---------------------------------------- |
| Store frequently used org-wide data       | Platform Cache (Org Cache)               |
| Store session-based user preferences      | Platform Cache (Session Cache)             |
| Avoid repeated SOQL queries               | Apex Static Variables + Maps             |
| Improve Lightning component performance   | `@AuraEnabled(cacheable=true)`           |
| Store long-lived config settings          | Custom Metadata Types / Custom Settings |
| Cache external API call results           | Platform Cache or Custom Metadata        |
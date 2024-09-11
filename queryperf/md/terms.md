# Terms

### Cardinality
The estimated number of records that the leading operation type would return.
For example, the number of records returned if using an index table.

### Fields

The indexed field(s) used by the Query Optimizer. If the leading operation type is Index, the fields value is Index. Otherwise, the fields value is null 

### Leading Operation Type

The primary operation type that Salesforce will use to optimize the query.

- **Index** - The query will use an index on the queried object.

- **Sharing** - The query will use an index based on the sharing rules associated with the user who is executing the query. If there are sharing rules that limit which records that user can access, 
Salesforce can use those rules to optimize the query.

- **TableScan** - The query will scan all records for the queried object.
- **Other** - The query will use optimizations internal to Salesforce.

### Cost

The cost of the query compared to the Force.com Query Optimizer’s selectivity threshold. Values **above 1 mean** that the query won’t be selective.

### sObject Cardinality
The approximate record count for the queried object.


### Questions

- What happens if more than one simple filter is selective? 
    - If more than one filter are found to be selective, the query optimizer will choose the one with lower cost to drive the execution plan of the query.

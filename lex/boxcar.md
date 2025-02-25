## Batching of Apex Actions

- The framework queues up Apex actions before sending them to the server. This mechanism is largely transparent to you when you’re writing code but it enables the framework to minimize network traffic by batching multiple actions into one request (XHR).


- The batching of actions is also known as boxcar’ing, similar to a train that couples boxcars together.


- The framework uses a stack to track the Apex actions to send to the server. When the browser finishes processing events and JavaScript on the client, the enqueued actions on the stack are sent to the server in a batch.

## References
- [Batching of Apex Actions
](https://developer.salesforce.com/docs/platform/lwc/guide/apex-batched-actions.html)
- [Client side caching](https://developer.salesforce.com/docs/platform/lwc/guide/apex-result-caching.html)

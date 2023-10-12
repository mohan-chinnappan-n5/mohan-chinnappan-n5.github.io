In a HAR (HTTP Archive) file, "_blocked_queueing" is a field that is sometimes used to provide additional information about the time spent in the queue before a network request is sent. It's typically found within the "timings" section of a network request entry and can be used to break down the "blocked" time into more granular components.

The "timings" section in a HAR entry includes several timing metrics, such as "blocked," "dns," "connect," "send," "wait," and "receive," which collectively represent the various stages of a network request-response cycle. The "blocked" time accounts for the time a request is blocked or waiting before it can be sent, and "queueing" is one of the potential subcomponents of "blocked" time.

Here's a brief explanation of these timing metrics:

- **Blocked:** The time the request spent waiting in the queue or any other blocking state before it could be sent. It encompasses various factors that can cause delay before the request can be initiated.

- **Queueing:** If there are other requests in the browser's queue, the request may be blocked until those requests are completed. The "queueing" time accounts for this specific waiting time caused by other requests in the queue.

Having a separate timing metric like "_blocked_queueing" within the "timings" section of a HAR entry can provide more detailed insights into the sources of blocking and queuing delays in web performance analysis. It can be especially helpful when diagnosing performance issues related to network concurrency and the order in which requests are handled by the browser.
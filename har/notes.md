
## wait(ms)
In a HAR (HTTP Archive) file, the "wait" time typically refers to the time spent waiting for the server to begin sending the response after the request has been sent. It measures the time from when the request is initiated until the server starts sending the response headers.

The "wait" time includes various factors such as:

Network latency: The time taken for the request to travel from the client to the server and back.
Server processing time: The time taken by the server to process the request before sending the response.
Queuing time: If there are other requests ahead of this one in the server's queue, the time spent waiting in the queue before the server starts processing this request

## blocked(ms)
In a HAR (HTTP Archive) file, the "blocked" time refers to the time spent waiting before the browser could initiate the request. It measures the time from when the browser started to initiate the request until the request was actually initiated.

The "blocked" time can occur due to various reasons such as:

Queueing in the browser's network stack: If there are other requests already in progress, the browser may need to wait for those requests to complete before initiating the new request.
Limitations imposed by the browser: The browser may impose restrictions on the number of simultaneous connections to a single domain, leading to queueing of requests.
Blocking JavaScript: If there are scripts executing in the page that block further processing, the browser may need to wait until those scripts have completed execution.


## receive(ms)
In a HAR (HTTP Archive) file, the "Receive" time refers to the time taken by the client to receive the response from the server after the request has been fully sent. It measures the time from when the client starts receiving the response headers to when the entire response body has been received.

The "Receive" time includes various factors such as:

Server processing time: The time taken by the server to generate the response and send it back to the client.
Network latency: The time taken for the response to travel from the server to the client.
Transmission time: The time taken for the response data to be transmitted over the network.

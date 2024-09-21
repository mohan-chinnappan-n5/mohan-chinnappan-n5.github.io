## Screenshots


### Usage

```
usage: traceroute.py [-h] --target TARGET [--max-hops MAX_HOPS] [--timeout TIMEOUT]

Traceroute to a target with optional max hops and timeout.

options:
  -h, --help           show this help message and exit
  --target TARGET      Target IP address or hostname
  --max-hops MAX_HOPS  Maximum number of hops (default: 30)
  --timeout TIMEOUT    Timeout for each hop in seconds (default: 2)


```




### Sample Run

```

sudo python3 traceroute.py --target d8w000004lymuuac-dev-ed.develop.lightning.force.com  
Password:
Traceroute to d8w000004lymuuac-dev-ed.develop.lightning.force.com (13.109.190.242), max 30 hops:
Saving results to d8w000004lymuuac-dev-ed.develop.lightning.force.com.csv...
+-----+----------------+---------------------------------------------+----------------------+----------------------+----------------------+
| Hop |   IP Address   |                  Hostname                   | Response Time 1 (ms) | Response Time 2 (ms) | Response Time 3 (ms) |
+-----+----------------+---------------------------------------------+----------------------+----------------------+----------------------+
|  1  |  192.168.1.1   |                   Unknown                   |         3 ms         |         6 ms         |         4 ms         |
|  2  |  192.168.1.1   |                   Unknown                   |  Request timed out.  |  Request timed out.  |  Request timed out.  |
|  3  | 67.59.237.125  |                   Unknown                   |        16 ms         |        15 ms         |        14 ms         |
|  4  | 67.59.254.246  |                   Unknown                   |        14 ms         |        14 ms         |        13 ms         |
|  5  |  63.142.20.6   |                   Unknown                   |        16 ms         |        15 ms         |        16 ms         |
|  6  | 65.19.120.194  |         451be0c2.cst.lightpath.net          |        16 ms         |        19 ms         |        15 ms         |
|  7  |  4.30.181.89   |       ae88.edge2.newyork6.level3.net        |        14 ms         |        21 ms         |        16 ms         |
|  8  |  4.30.181.89   |       ae88.edge2.newyork6.level3.net        |  Request timed out.  |  Request timed out.  |  Request timed out.  |
|  9  |  4.30.181.89   |       ae88.edge2.newyork6.level3.net        |  Request timed out.  |  Request timed out.  |  Request timed out.  |
| 10  | 13.110.73.188  |  et-7-1-2--dcr3-ncg99-c5-iad4.net.sfdc.net  |        26 ms         |        21 ms         |        21 ms         |
| 11  | 13.110.73.188  |  et-7-1-2--dcr3-ncg99-c5-iad4.net.sfdc.net  |  Request timed out.  |  Request timed out.  |  Request timed out.  |
| 12  | 13.110.72.109  |  eth1-2--leaf51-ncg1-c5-iad4.net.sfdc.net   |  Request timed out.  |        21 ms         |        23 ms         |
| 13  | 13.109.190.242 | dcl15-ncg1-c5-iad4.na207-ia4.salesforce.com |        22 ms         |  Request timed out.  |  Request timed out.  |
+-----+----------------+---------------------------------------------+----------------------+----------------------+----------------------+
Traceroute complete. Results saved to d8w000004lymuuac-dev-ed.develop.lightning.force.com.csv



```
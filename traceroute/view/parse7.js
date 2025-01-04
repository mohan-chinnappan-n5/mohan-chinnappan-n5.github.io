function parseTraceroute(tracerouteText) {
    const hops = [];
    const lines = tracerouteText.split("\n");
    let currentHop = null;

    lines.forEach(line => {
        // Match a new hop line with valid IP and latencies including *
        const hopMatch = line.match(/^\s*(\d+)\s+([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:\d+\.\d+ ms|\*\s*)+)/);
        const starOnlyMatch = line.match(/^\s*(\d+)\s+\*/);

        if (hopMatch) {
            // If there's a current hop, push it to the array before starting a new one
            if (currentHop) {
                hops.push(currentHop);
            }

            // Start a new hop
            currentHop = {
                hopNumber: hopMatch[1],
                hostname: hopMatch[2] || 'Unknown',
                ipAddress: hopMatch[3],
                latencies: hopMatch[4]
                    .trim()
                    .split(/\s+/) // Split latencies by whitespace
                    .map(latency => latency !== '*' ? latency : '*'), // Include * as a latency
                country: 'Fetching...' // Placeholder for country
            };
        } else if (starOnlyMatch) {
            // If there's a current hop, push it to the array before starting a new one
            if (currentHop) {
                hops.push(currentHop);
            }

            // Start a new hop with no response
            currentHop = {
                hopNumber: starOnlyMatch[1],
                hostname: 'No Response',
                ipAddress: 'N/A',
                latencies: ['N/A'],
                country: 'Unknown'
            };
        } else if (line.match(/^\s+/) && currentHop) {
            // Additional lines for the current hop
            const additionalMatch = line.match(/([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:[\d\.\*]+ ms\s*)+)/);
            if (additionalMatch) {
                // Add details from the additional line
                currentHop.latencies.push(
                    ...additionalMatch[3]
                        .trim()
                        .split(/\s+/) // Split latencies by whitespace
                        .map(latency => latency !== '*' ? latency : '*') // Include * as a latency
                );
            }
        }
    });

    // Push the last hop if it exists
    if (currentHop) {
        hops.push(currentHop);
    }

    return hops;
}

// Example usage:
const tracerouteText = `
traceroute: Warning: appleascent--uatr5.sandbox.my.site.com has multiple addresses; using 104.84.150.8
traceroute to e89622.dsca.akamaiedge.net (104.84.150.8), 64 hops max, 40 byte packets
 1 192.168.1.1 (192.168.1.1) 5.391 ms 2.385 ms 3.039 ms
 2 100.91.0.1 (100.91.0.1) 5.926 ms 5.849 ms 6.168 ms
 3 211.136.66.1 (211.136.66.1) 6.856 ms 6.747 ms 6.652 ms
 4 221.183.39.113 (221.183.39.113) 7.554 ms
 221.183.76.97 (221.183.76.97) 7.352 ms
 221.183.39.113 (221.183.39.113) 7.648 ms
 5 221.183.184.166 (221.183.184.166) 29.539 ms
 221.183.37.134 (221.183.37.134) 34.184 ms
 221.183.184.138 (221.183.184.138) 28.630 ms
 6 221.183.89.49 (221.183.89.49) 31.110 ms * 30.426 ms
 7 221.183.89.70 (221.183.89.70) 29.374 ms * 31.069 ms
 8 221.183.89.181 (221.183.89.181) 52.509 ms * *
 9 223.120.3.185 (223.120.3.185) 52.310 ms
 223.120.3.201 (223.120.3.201) 60.128 ms
 223.120.3.173 (223.120.3.173) 50.920 ms
10 * 223.120.22.66 (223.120.22.66) 52.811 ms
 223.120.22.222 (223.120.22.222) 51.590 ms
11 223.119.7.230 (223.119.7.230) 50.992 ms 51.996 ms
 ae31.r02.hkg02.ien.netarch.akamai.com (23.56.133.55) 50.998 ms
12 * * *
13 a104-84-150-8.deploy.static.akamaitechnologies.com (104.84.150.8) 50.929 ms 51.914 ms 52.819 ms
`;

const parsedHops = parseTraceroute(tracerouteText);
console.log(parsedHops);
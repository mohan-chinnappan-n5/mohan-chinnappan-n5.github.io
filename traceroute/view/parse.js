function parseTraceroute(tracerouteText) {
    const hops = [];
    const lines = tracerouteText.split("\n");
    let currentHop = null;

    lines.forEach(line => {
        // Match a new hop line
        const hopMatch = line.match(/^\s*(\d+)\s+([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:[\d\.]+\s*ms|\*\s*)+)/);
        const starOnlyMatch = line.match(/^\s*(\d+)\s+\*/);

        if (hopMatch) {
            if (currentHop) {
                hops.push(currentHop); // Save the previous hop before starting a new one
            }

            // Start a new hop
            currentHop = {
                hopNumber: hopMatch[1],
                hostname: hopMatch[2] || 'Unknown',
                ipAddress: hopMatch[3],
                latencies: hopMatch[4]
                    .trim()
                    .split(/\s+(?=\d+\.|\*)/) // Split on spaces before numbers or `*`
                    .map(latency => (latency === '*' ? latency : latency.trim() + (latency.endsWith('ms') ? '' : ' ms'))), // Add ms if missing
                country: 'Fetching...' // Placeholder for country
            };
        } else if (starOnlyMatch) {
            if (currentHop) {
                hops.push(currentHop); // Save the previous hop before starting a new one
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
            const additionalMatch = line.match(/([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:[\d\.]+\s*ms|\*\s*)+)/);
            if (additionalMatch) {
                // Add details from the additional line
                currentHop.latencies.push(
                    ...additionalMatch[3]
                        .trim()
                        .split(/\s+(?=\d+\.|\*)/) // Split on spaces before numbers or `*`
                        .map(latency => (latency === '*' ? latency : latency.trim() + (latency.endsWith('ms') ? '' : ' ms'))) // Add ms if missing
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


let input = '6  221.183.89.49 (221.183.89.49)  31.110 ms *  30.426 ms';
//input ='1 192.168.1.1 (192.168.1.1) 5.391 ms 2.385 ms 3.039 ms';

const output = parseTraceroute(input);
console.log(input);
console.log(output);

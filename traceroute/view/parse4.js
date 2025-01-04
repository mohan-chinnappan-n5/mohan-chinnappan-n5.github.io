const regex = /^\s*(\d+)\s+([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:[\d\.\*]+\s*ms\s*)+)/;
const input = "6 221.183.89.49 (221.183.89.49) 31.110 ms * 30.426 ms";

const match = input.match(regex);

if (match) {
    const rawLatencies = match[4];
    
    // Extract individual latencies, including `*` and the `ms` suffix
    const latencies = rawLatencies
        .match(/[\d\.\*]+ ms/g) // Match each latency with "ms"
        .map(latency => latency.trim()); // Clean up spaces
    
    console.log({
        hopNumber: match[1],
        hostname: match[2],
        ipAddress: match[3],
        latencies: latencies,
    });
} else {
    console.log("No match found");
}
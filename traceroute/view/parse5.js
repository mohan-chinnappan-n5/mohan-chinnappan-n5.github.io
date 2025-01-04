// Function to parse a single line of ping output
function parsePingLine(line) {
    const regex = /^\s*(\d+)\s+([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:[\d\.\*]+ ms\s*)+)$/;
    const match = line.match(regex);
    
    if (!match) {
        return null;
    }

    // Extract all time measurements
    const timeMeasurements = match[4].trim().split(/\s+/)
        .filter(t => t.includes('ms'))
        .map(t => {
            const value = t.replace(' ms', '');
            return value === '*' ? null : parseFloat(value);
        });

    return {
        sequenceNumber: parseInt(match[1]),
        hostname: match[2] || null,
        ip: match[3],
        times: timeMeasurements,
        averageTime: calculateAverage(timeMeasurements),
        raw: line
    };
}

// Helper function to calculate average of time measurements
function calculateAverage(times) {
    const validTimes = times.filter(t => t !== null);
    if (validTimes.length === 0) return null;
    
    const sum = validTimes.reduce((acc, curr) => acc + curr, 0);
    return sum / validTimes.length;
}

// Function to parse multiple lines of ping output
function parsePingOutput(output) {
    return output
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(parsePingLine)
        .filter(result => result !== null);
}

// Example usage
const testOutput = `
    6 221.183.89.49 (221.183.89.49) 31.110 ms * 30.426 ms
    7 host-12.network.com (192.168.1.1) 45.223 ms * *
    8 router.local (10.0.0.1) 12.445 ms 13.881 ms 14.221 ms
`;

const results = parsePingOutput(testOutput);

// Print results
results.forEach(result => {
    console.log('\nParsed Line:');
    console.log('Sequence Number:', result.sequenceNumber);
    console.log('Hostname:', result.hostname);
    console.log('IP:', result.ip);
    console.log('Time Measurements:', result.times);
    console.log('Average Time:', result.averageTime?.toFixed(3), 'ms');
    console.log('Raw Line:', result.raw);
});
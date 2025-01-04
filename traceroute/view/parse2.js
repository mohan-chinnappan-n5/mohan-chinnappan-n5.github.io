function parseTraceroute(tracerouteText) {
    const hops = [];
    const lines = tracerouteText.split("\n");
    let currentHop = null;
  
    lines.forEach(line => {
      // Match a new hop line
      const hopMatch = line.match(/^\s*(\d+)\s+([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:\d+\.\d+ ms|\*\s?)+)/);
      const starMatch = line.match(/^\s*(\d+)\s+\*\s+([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:\d+\.\d+ ms|\*\s?)+)/);
      const starOnlyMatch = line.match(/^\s*(\d+)\s+\*$/);

      if (hopMatch) {
        if (currentHop) {
          hops.push(currentHop);
        }
  
        currentHop = {
          hopNumber: hopMatch[1],
          hostnames: [hopMatch[2] || 'Unknown'], // make hostnames an array
          ipAddresses: [hopMatch[3]], // make ipAddresses an array
          latencies: hopMatch[4]
            .trim()
            .split(/\s+(?=\d+\.|\*)/)
            .map(latency => latency.trim()),
          country: 'Fetching...'
        };
      }
      else if (starMatch){
            if (currentHop) {
              hops.push(currentHop); // Save the previous hop before starting a new one
            }
            // Start a new hop with no response
            currentHop = {
                hopNumber: starMatch[1],
                hostnames: [starMatch[2] || 'Unknown'],
                ipAddresses: [starMatch[3]],
                latencies: starMatch[4]
                        .trim()
                        .split(/\s+(?=\d+\.|\*)/)
                        .map(latency => latency.trim()),
                country: 'Fetching...'
            };

      }
      else if (starOnlyMatch)
      {
            if (currentHop) {
              hops.push(currentHop); // Save the previous hop before starting a new one
            }
             // Start a new hop with no response
            currentHop = {
                hopNumber: starOnlyMatch[1],
                hostnames: ['No Response'],
                ipAddresses: ['N/A'],
                latencies: ['N/A'],
                country: 'Unknown'
            };
      }
      else if (line.match(/^\s+\s*([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:\d+\.\d+ ms|\*\s?)+)/)) {
         if (currentHop) {
            const additionalMatch = line.match(/^\s+\s*([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:\d+\.\d+ ms|\*\s?)+)/);
            if(additionalMatch)
            {
                if (additionalMatch[1])
                  currentHop.hostnames.push(additionalMatch[1]);
                currentHop.ipAddresses.push(additionalMatch[2]);
                currentHop.latencies.push(
                    ...additionalMatch[3]
                        .trim()
                        .split(/\s+(?=\d+\.|\*)/)
                        .map(latency => latency.trim())
                   );
              }
          }
        
      }
        else if(line.match(/^\s+\s*\(([\d\.]+)\)\s+((?:\d+\.\d+ ms|\*\s?)+)/))
        {
            if(currentHop)
            {
             const additionalMatch = line.match(/^\s+\s*\(([\d\.]+)\)\s+((?:\d+\.\d+ ms|\*\s?)+)/);
              if(additionalMatch)
              {
                  currentHop.ipAddresses.push(additionalMatch[1]);
                  currentHop.latencies.push(
                    ...additionalMatch[2]
                      .trim()
                      .split(/\s+(?=\d+\.|\*)/)
                      .map(latency => latency.trim())
                   );
              }
            }
      }
    });
  
    if (currentHop) {
      hops.push(currentHop);
    }
  
    return hops;
  }
  

  const tracerouteText = `
  aceroute: Warning: appleascent--uatr5.sandbox.my.site.com has multiple addresses; using 104.84.150.8
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
  
  const parsedTraceroute = parseTraceroute(tracerouteText);
  console.log(JSON.stringify(parsedTraceroute, null, 2));
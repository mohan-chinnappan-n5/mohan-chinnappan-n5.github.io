// Function to get the URL parameter
function getTestFileUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('url') || 'https://via.placeholder.com/10MB.jpg'; // Default file URL
}

// Function to measure download speed
async function measureDownloadSpeed(testFileUrl) {
    const startTime = performance.now();
    const response = await fetch(testFileUrl);
    const endTime = performance.now();
    const dataSizeInBits = (await response.blob()).size * 8; // Convert bytes to bits
    const timeInSeconds = (endTime - startTime) / 1000; // Convert ms to seconds
    return (dataSizeInBits / (timeInSeconds * 1e6)).toFixed(2); // Mbps
}

// Function to measure upload speed
async function measureUploadSpeed() {
    const data = new Uint8Array(10 * 1024 * 1024); // Create 10MB file
    const startTime = performance.now();
    await fetch('https://httpbin.org/post', { method: 'POST', body: data });
    const endTime = performance.now();
    const timeInSeconds = (endTime - startTime) / 1000;
    return (data.length * 8 / (timeInSeconds * 1e6)).toFixed(2); // Mbps
}

// Function to measure latency
async function measureLatency() {
    const startTime = performance.now();
    await fetch('https://www.google.com');
    const endTime = performance.now();
    return (endTime - startTime).toFixed(2); // ms
}

// Function to update D3.js gauge
function updateGauge(speed) {
    const gauge = d3.select('#gauge');
    const width = 300;
    const height = 150;
    const maxSpeed = 200;

    gauge.selectAll('*').remove();

    const arc = d3.arc()
        .innerRadius(70)
        .outerRadius(100)
        .startAngle(0)
        .endAngle((speed / maxSpeed) * Math.PI);

    const svg = gauge.append('svg')
        .attr('width', width)
        .attr('height', height);

    const g = svg.append('g')
        .attr('transform', `translate(${width / 2},${height})`);

    g.append('path')
        .attr('d', arc)
        .attr('fill', '#1f77b4');

    g.append('text')
        .text(`${speed} Mbps`)
        .attr('text-anchor', 'middle')
        .attr('y', -20)
        .style('font-size', '24px')
        .style('fill', '#fff');
}

// Function to start the speed test
async function startTest() {
    const testFileUrl = getTestFileUrl();

    document.getElementById('speed').textContent = 'Speed: Testing...';
    document.getElementById('upload').textContent = 'Upload: Testing...';
    document.getElementById('latency').textContent = 'Latency: Testing...';

    const speed = await measureDownloadSpeed(testFileUrl);
    const upload = await measureUploadSpeed();
    const latency = await measureLatency();

    document.getElementById('speed').textContent = `Speed: ${speed} Mbps`;
    document.getElementById('upload').textContent = `Upload: ${upload} Mbps`;
    document.getElementById('latency').textContent = `Latency: ${latency} ms`;

    updateGauge(speed);
}
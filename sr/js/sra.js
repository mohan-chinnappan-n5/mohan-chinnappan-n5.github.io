// sra.js - Updated for screen recording with presenter video, fixed zero-byte/partial WebM issues, and ensured full video capture

document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start');
    const downloadLink = document.getElementById('download');
    const startWebcamButton = document.getElementById('startWebcam');
    const webcamPreview = document.getElementById('webcamPreview');

    let mediaRecorder = null;
    let recordedChunks = [];
    let screenStream = null;
    let webcamStream = null;

    // Function to get URL parameter
    function getParameterByName(name) {
        const url = new URL(window.location.href);
        return url.searchParams.get(name) || 'recording';
    }

    // Start webcam with fallback and retries
    async function startWebcam(retries = 2) {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                webcamPreview.srcObject = webcamStream;
                webcamPreview.style.display = 'block';
                startWebcamButton.disabled = true;
                startWebcamButton.textContent = 'Webcam Active';
                console.log('Webcam stream started successfully:', webcamStream);
                return webcamStream;
            } catch (err) {
                console.error(`Webcam attempt ${attempt + 1} failed:`, err);
                if (attempt === retries) {
                    alert('Failed to access webcam after multiple attempts. Please ensure permissions are granted and try refreshing the page.');
                    return null;
                }
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
            }
        }
        return null;
    }

    // Start screen recording with audio and webcam, with enhanced frame capturing
    async function startRecording() {
        try {
            // Get screen stream with audio, with fallback for audio issues
            screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            }).catch(async (err) => {
                console.error('Error with audio in screen stream:', err);
                // Fallback: Try without audio if audio fails
                return await navigator.mediaDevices.getDisplayMedia({ video: true });
            });
            console.log('Screen stream started:', screenStream);

            if (!webcamStream) {
                webcamStream = await startWebcam();
                if (!webcamStream) {
                    throw new Error('Webcam initialization failed');
                }
            }

            // Verify streams are active
            if (!screenStream.active || !webcamStream.active) {
                throw new Error('One or more streams are not active');
            }

            // Check if streams have tracks
            if (screenStream.getVideoTracks().length === 0 || webcamStream.getVideoTracks().length === 0) {
                throw new Error('No video tracks available in streams');
            }

            // Combine screen and webcam streams
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) throw new Error('Canvas 2D context not available');
            canvas.width = 1280; // Adjust for resolution
            canvas.height = 720; // Adjust for resolution

            const screenVideo = document.createElement('video');
            screenVideo.srcObject = screenStream;
            await screenVideo.play().catch(err => console.error('Screen video play error:', err));

            const webcamVideo = document.createElement('video');
            webcamVideo.srcObject = webcamStream;
            await webcamVideo.play().catch(err => console.error('Webcam video play error:', err));

            // Track frames and ensure continuous drawing
            let frameCount = 0;
            let lastTimestamp = performance.now();
            let isRecording = true;

            function drawComposite(timestamp) {
                if (!isRecording || !screenVideo.videoWidth || !webcamVideo.videoWidth) return;

                try {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height - 150); // Screen at top
                    ctx.drawImage(webcamVideo, 10, canvas.height - 160, 150, 150); // Webcam in bottom-left

                    frameCount++;
                    const elapsed = (timestamp - lastTimestamp) / 1000; // Seconds since last frame
                    console.log(`Frame ${frameCount}, FPS: ${1 / elapsed}`);
                    lastTimestamp = timestamp;
                } catch (e) {
                    console.error('Error drawing composite:', e);
                    if (frameCount === 0) {
                        isRecording = false;
                        throw new Error('Composite drawing failed');
                    }
                }

                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    requestAnimationFrame(drawComposite);
                }
            }
            requestAnimationFrame(drawComposite);

            // Create stream from canvas with fallback
            let canvasStream;
            try {
                canvasStream = canvas.captureStream(30); // 30 FPS
            } catch (err) {
                console.error('Canvas capture stream failed:', err);
                // Fallback: Use a direct stream combination if canvas fails
                canvasStream = new MediaStream([
                    ...screenStream.getVideoTracks(),
                    ...webcamStream.getVideoTracks(),
                    ...screenStream.getAudioTracks()
                ]);
            }
            console.log('Canvas stream created:', canvasStream.getTracks());

            // Start recording the combined stream with error handling
            mediaRecorder = new MediaRecorder(canvasStream, { mimeType: 'video/webm; codecs=vp9' });
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.onstop = handleStop;
            mediaRecorder.onerror = (e) => console.error('MediaRecorder error:', e);
            mediaRecorder.onwarning = (e) => console.warn('MediaRecorder warning:', e);
            mediaRecorder.start(1000); // Record in 1-second chunks
            console.log('MediaRecorder started:', mediaRecorder.state);

            startButton.disabled = true;
            startButton.textContent = 'Recording...';

            // Stop screen sharing when user stops sharing
            screenStream.getVideoTracks()[0].onended = () => {
                stopRecording();
            };
        } catch (err) {
            console.error('Error starting recording:', err);
            alert(`Failed to start recording: ${err.message}. Please ensure screen sharing and webcam permissions are granted, and try refreshing the page.`);
            stopRecording();
        }
    }

    // Handle recorded data
    function handleDataAvailable(event) {
        console.log('Data available:', event.data.size, 'bytes, type:', event.data.type);
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        } else {
            console.warn('Empty chunk received, skipping...');
        }
    }

    // Handle recording stop and download
    function handleStop() {
        if (recordedChunks.length === 0) {
            console.error('No recorded data available.');
            alert('Recording failed. No data was captured. Please ensure permissions are granted, check console logs, and try again.');
            startButton.disabled = false;
            startButton.textContent = 'Start Screen Recording with Audio & Presenter Video';
            cleanupStreams();
            return;
        }

        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        console.log('Blob created:', blob.size, 'bytes, type:', blob.type);

        const url = URL.createObjectURL(blob);

        // Ensure the download link is properly set up
        downloadLink.href = url;
        downloadLink.download = `${getParameterByName('f')}.webm`;
        downloadLink.textContent = 'Download Recording';
        downloadLink.style.display = 'inline';

        // Trigger the download
        downloadLink.click();

        // Clean up: Revoke the object URL to free memory
        URL.revokeObjectURL(url);

        startButton.disabled = false;
        startButton.textContent = 'Start Screen Recording with Audio & Presenter Video';
        cleanupStreams();
    }

    // Stop recording
    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    }

    // Clean up streams
    function cleanupStreams() {
        if (screenStream) screenStream.getTracks().forEach(track => track.stop());
        if (webcamStream) webcamStream.getTracks().forEach(track => track.stop());
        recordedChunks = [];
        screenStream = null;
        webcamStream = null;
        webcamPreview.style.display = 'none';
        startWebcamButton.disabled = false;
        startWebcamButton.textContent = 'Start Webcam';
    }

    // Event listeners
    startButton.addEventListener('click', startRecording);
    startWebcamButton.addEventListener('click', startWebcam);

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        cleanupStreams();
    });
});
// Select all input elements and add event listeners for real-time updates
document.querySelectorAll('#iconText, #fontSelect, #fontColor, #bgColor, #cornerRadius').forEach(element => {
  element.addEventListener('input', generateIcons);
});

document.getElementById('generateBtn').addEventListener('click', generateIcons);

function generateIcons() {
  const text = document.getElementById('iconText').value || 'A';
  const font = document.getElementById('fontSelect').value;
  const fontColor = document.getElementById('fontColor').value;
  const bgColor = document.getElementById('bgColor').value;
  const cornerRadius = parseInt(document.getElementById('cornerRadius').value, 10) || 4;


  // Update the color display divs and hex value spans
  document.getElementById('fontColorDisplay').style.backgroundColor = fontColor;
  document.getElementById('bgColorDisplay').style.backgroundColor = bgColor;
  document.getElementById('fontColorHex').textContent = fontColor;
  document.getElementById('bgColorHex').textContent = bgColor;

  createIcon('icon16', 16, text, font, fontColor, bgColor, cornerRadius);
  createIcon('icon48', 48, text, font, fontColor, bgColor, cornerRadius);
  createIcon('icon64', 64, text, font, fontColor, bgColor, cornerRadius);
  createIcon('icon128', 128, text, font, fontColor, bgColor, cornerRadius);
}

function createIcon(canvasId, size, text, font, fontColor, bgColor, radius) {

  console.log(radius);
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size); // Clear previous drawing

  // Draw rounded rectangle background
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.moveTo(radius, 0);
  ctx.arcTo(size, 0, size, size, radius);
  ctx.arcTo(size, size, 0, size, radius);
  ctx.arcTo(0, size, 0, 0, radius);
  ctx.arcTo(0, 0, size, 0, radius);
  ctx.closePath();
  ctx.fill();

  // Draw the letter(s)
  ctx.fillStyle = fontColor;
  ctx.font = `${size / 2}px ${font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);

  // Update the download link
  const link = document.getElementById(`download${size}`);
  link.href = canvas.toDataURL('image/png');
}

// Trigger initial generation
generateIcons();
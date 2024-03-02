// app.js
// mohan chinnappan


//----------------------------
Split([ "#dataform", "#letter"], { sizes: [50, 50] });

// Function to generate appreciation content
function generateAppreciation() {
    const recipientName = document.getElementById('recipientName').value;
    const senderName = document.getElementById('senderName').value;
    const message = document.getElementById('message').value;
    const template = document.getElementById('template').value;


    const appreciationContent = `
        <h2>Letter of Appreciation</h2>
        <p>Dear <b>${recipientName}</b>,</p>
        <p>${message}. ${template}</p>
        <p>Warm regards,</p>
        <p>${senderName}</p>
    `;

    document.getElementById('appreciationContent').innerHTML = appreciationContent;
}

// Event listener for form submission
document.getElementById('appreciationForm').addEventListener('submit', function (event) {
    event.preventDefault();
    generateAppreciation();
});
document.getElementById('submit').click();

// Function to download image
function downloadImage2() {
    const contentPane = document.querySelector('.content-pane');
    console.log(contentPane)

    html2canvas(document.querySelector("#appreciationContent")).then(canvas => {
        document.getElementById("output").appendChild(canvas)
    });


}

function downloadImage() {
    const contentPane = document.querySelector('.content-pane');
    html2canvas(contentPane).then(function (canvas) {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'appreciation.png';
        link.click();
    });
}

// Event listener for download button click
document.getElementById('downloadButton').addEventListener('click', downloadImage2);


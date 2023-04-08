// svg2png - mchinnappan

Split(["#menu", "#content"], {
    sizes: [55, 45]
  });

  let getUploadedFile = (event) => {
    const input = event.target;
    if ('files' in input && input.files.length > 0) {
      console.log(input.files[0]);
      placeFileContent(document.getElementById('svg-container'), input.files[0]);
    }
  }

  let placeFileContent = (target, file) => {
    readFileContent(file).then(content => {
      target.innerHTML = content;
      // process();
      //console.log()
    }).catch(error => console.log(error))
  }

  let readFileContent = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result);
      reader.onerror = error => reject(error);
      reader.readAsText(file);
    });
  };


  const process = () => {

    const svgString = new XMLSerializer()
      .serializeToString(document.querySelector('svg'));

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const DOMURL = self.URL || self.webkitURL || self;
    const img = new Image();
    const svg = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8"
    });
    const url = DOMURL.createObjectURL(svg);
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      var imgURL = canvas.toDataURL("image/png");
      DOMURL.revokeObjectURL(imgURL);
      const dlLink = document.createElement('a');
      dlLink.download = "image";
      dlLink.href = imgURL;
      dlLink.dataset.downloadurl = ["image/png", dlLink.download, dlLink.href]
        .join(':');
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
    }
    img.src = url;
  }

  // event handling
  document.getElementById('inputfile').addEventListener('change', getUploadedFile);
  document.getElementById('process').addEventListener('click', process);


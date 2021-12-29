//app.js

const compareData = {
  "CEO of the product": [
    {
      good: `drives <b>vision</b> and are ultimately responsible for the
        product's success or failure`,
      bad: `think of themselves as marketing resources`,
    },
    {
      good: `have a <b>realistic vision</b> of what <b>success</b> of their
        product means and they ensure that this vision becomes reality -
        whatever it takes`,
      bad: `have lots of excuses, like blaming engineering manager...`,
    },
    {
      good: `viewed as the <b>leader of the product</b> by the entire product team`,
      bad: `when they fail, they point out that: they predicted they would
        fail`,
    },
  ],

  "Meets company goals and capabilities": [
    {
      good: `Take all important factors into consideration`,
      bad: ``,
    },
    {
      good: `understand the capabilities and limitations of their overall company`,
      bad: ``,
    },
    {
      good: `knows approximately how much and what kind of marketing
        resources the company will spend on these products`,
      bad: `build a product that will take too long to pay off`,
    },
  ],
};

const tce = document.getElementById("table-content");

const fillContent = (ele) => {
  let htmlContent = "";
  for (const key in compareData) {
    const items = compareData[key];
    const id = key.replace(/ /g, "_");

    htmlContent += ` <table class="table  table-bordered table-striped table-hover">
      <tr>
        <td colspan="2">
          <button type="button" id="${id}_" class="btn btn-primary ms-4" data-bs-toggle="collapse" data-bs-target="${id}">
           ${key}
          </button>
        </td>
      </tr>
    </table>

    <div class="collapse show" id="${id}">
      <div class="card card-body">
        <table class="table table-bordered table-striped table-hover">
      
    `;

    for (const item of items) {
      htmlContent += `
      <tr>
        <td>${item["good"]}</td>
        <td>${item["bad"]}</td>
      </tr>
      `;
    }

    htmlContent += `
        </table>
      </div>
    </div>
  `;
  }
  ele.innerHTML = htmlContent;
};

fillContent(tce);

const setupCollapse = () => {
  for (const key in compareData) {
    const items = compareData[key];
    const id = key.replace(/ /g, "_");

    const el1 = document.getElementById(`${id}_`);
    const el11 = document.getElementById(id);
    el1.addEventListener("click", (event) => {
      new bootstrap.Collapse(el11);
    });
  }
};
setupCollapse();

// setup popovers
var popoverTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="popover"]')
);
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl, { html: true });
});

// collapse
/*
  var collapseElementList = [].slice.call(document.querySelectorAll('.collapse'))
  var collapseList = collapseElementList.map(function (collapseEl) {
    return new bootstrap.Collapse(collapseEl)
  });
  */

const ux = `
        <div class='row'>
          <div class='col-lg'>
          
        <ul class="group-list">
            <li class="group-list-item">be the voice of the user inside the business</li>
                <li class="group-list-item"> get user feedback first hand</li>
        </ul>
      </div>
      
  </div>
  `;

const biz = `
  <div class='row'>
    <div class='col-lg'>
    
  <ul class="group-list">
      <li class="group-list-item">focus on maximizing business value from the product</li>
          <li class="group-list-item">obsessed with optimizing the product to achieve the business goals while maximizing return on investment (ROI)</li>
  </ul>
</div>

</div>
`;
const tech = `
<div class='row'>
<div class='col-lg'>

<ul class="group-list">
  <li class="group-list-item">there’s no point defining what to build if you don’t know how it will get built</li>
      <li class="group-list-item">understanding the level of effort (LOE) involved is crucial to making the right decisions</li>
</ul>
</div>

</div>
`;

const uxEle = document.getElementById("UX");
const techEle = document.getElementById("Tech");
const bizEle = document.getElementById("Biz");
const btnGroupEle = document.getElementById("btn-group");

uxEle.dataset.bsContent = ux;

techEle.dataset.bsContent = tech;
bizEle.dataset.bsContent = biz;

const techMapEle = document.getElementById("techmap");
techMapEle.addEventListener("click", (event) => {
  techEle.click();
  btnGroupEle.style.display = "block";
});

const bizMapEle = document.getElementById("bizmap");
bizMapEle.addEventListener("click", (event) => {
  bizEle.click();
  btnGroupEle.style.display = "block";
});

const uxMapEle = document.getElementById("uxmap");
uxMapEle.addEventListener("click", (event) => {
  uxEle.click();
  btnGroupEle.style.display = "block";
});

Split(["#dwg", "#content"], {
  sizes: [30, 70],
});

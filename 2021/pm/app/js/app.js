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

  "Customer demand": [
    {
      good:`listen to customers but they probe deeper into the underlying problems to get at the compelling value proposition for the customer. <i>If you had a noisy car you might ask for a louder stereo, but you would probably be a lot happier with a quieter car</i> `,
      bad:`ask customers leading questions and get biased answers. Go on their instinct and "confirm" it with two unusual customers`
    },
    {
      good:`also know what customers can & will pay for`,
      bad:`build a good product for a market their company isn't in`
    },
    {
      good:`certain that if they build a certain product, customers will buy it`,
      bad:`build a product that's too complex for their company to sell. Aren't savvy or confident enough to distinguish between interest. Blindly listen to the loudest customers, and define a product that addresses yesterday's needs of a handful of companies.and commitment to buy. Compare future products to today's competition, or cite advantages
      customers don't care about. `
    },
    {
      good:`go the extra mile to make sure they get this right`,
      bad:``
    }


  ],

  "Understanding competition": [
    {
      good:` understand the architectural and business capabilities of the competition and know where the competitors can go easily and can't go at all. Also know they must be better or different (integration/distribution) or they're dead`,
      bad:`react only to the moves of their competitors and forget to develop their own product's identity, letting it be just a hodge podge of what the competition is not doing`
    },
  ],

  "Know what you know and what you do not know": [
    {
      good:`acutely aware of what they know and why they know it, as well as what they don't know`,
      bad:``
    },
    {
      good:`understands the difference between opinions, hunches, and objective facts`,
      bad:``
    },
    {
      good:`knows that their job is to fill in these gaps in knowledge, not to defend or obfuscate them`,
      bad:``

    },
    {
      good:`doesn't ruin their credibility by over-stating their knowledge`,
      bad:`try to defend their lack of knowledge rather than gain the knowledge`
    },


  ],

  "Think ahead and monitor assumptions": [

    { good: `know what their important assumptions are and they monitor them from time to time to make sure they still hold`,
      bad: `have blinders on and don't notice when things change and notice only when their product fails `
  
    },
    {
      good:`re-evaluate the assumption as soon that assumption is threatened`,
      bad: ``
    },
    {
      good: `actively confirm the understanding with their managers and others on their team`,
      bad:``
    }

  ],

  "Clear written communication": [
    {
      good:`define clearly and in as much detail as is necessary what the product should do, how fast it should be`,
      bad: `cut corners on communication with engineering or misunderstand their role`
    }
  ]



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
          <button type="button" title='click to show/hide' id="${id}_" class="btn btn-primary ms-4" data-bs-toggle="collapse" data-bs-target="${id}">
           ${key}
          </button>
        </td>
      </tr>
    </table>

    <div class="collapse hide" id="${id}">
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

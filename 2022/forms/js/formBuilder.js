// formBuilder.js

//-----------------------------------

class FormBuilder {
  constructor(formDef, opts) {
    this.formDef = formDef;
    this.opts = opts;
  }

  async fetchSFDCRest(url, opts) {
    const response = await fetch(url, opts);
    const result = await response.json();
    return result;
  }

  async fetchRest(url) {
    const response = await fetch(url);
    const result = await response.json();
    return result;
  }

  generateForm() {
    const opts = this.opts;
    // elements
    const outputEle = getEle("output");
    const generatedFormEle = getEle("generatedForm");

    let formData = {};
    const formDef = this.formDef;
    const formEle = getEle(formDef.id);
    formEle.innerHTML = "";

    for (const field of formDef.fields) {
      const formDivEle = document.createElement("div");
      formDivEle.setAttribute("class", "form-group");
      formDivEle.setAttribute("id", `${field.id}-group`);

      let fieldHtml = "";
      let required = "";
      let requiredStar = "";
      if (field.required) {
        required = "required";
        requiredStar = "*";
      }

      switch (field.field.type) {
        case "select":
          fieldHtml = `
                        <label for="${field.id}"> ${requiredStar} ${
            field.label
          }</label>
                        ${generateSelectEle(
                          field.id,
                          field.id + "Help",
                          field.field.options,
                          field.field.default,
                          required
                          
                        )}
                  <small id="${field.id}Help" class="form-text text-muted">${
            field.help.msg
          } </small>`;
          formDivEle.innerHTML = fieldHtml;
          break;

        case "REST":
          // alert (field.field.url); // TODO: fetch the url
          //console.log(field.field.default);
          this.fetchRest(field.field.url).then((result) => {
            const value = jsonPath(result, field.field.jsonPath);
            fieldHtml = `
            <label for="${field.id}"> ${requiredStar} ${field.label}</label>
            <input name="${field.id}"  readonly value="${value}" class="form-control" id="${field.id}" aria-describedby="${field.id}Help">
            <small id="${field.id}Help" class="form-text text-muted">${field.help.msg}</small>
           `;
            // console.log(fieldHtml);
            formDivEle.innerHTML = fieldHtml;
          });

          break;

        case "SOQL":
          // ref: https://help.salesforce.com/s/articleView?id=sf.extend_code_cors.htm&type=5
          const opts = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              mode: "no-cors",
              Authorization: `Bearer ${formDef.sfdcAccessToken}`,
            },
          };
          this.fetchSFDCRest(
            `${field.field.url}/query?q=${field.field.soql}`,
            opts
          ).then((result) => {
            console.log(result);
            const value = jsonPath(result, field.field.jsonPath);
            fieldHtml = `
            <label for="${field.id}"> ${requiredStar} ${field.label}</label>
            <input name="${field.id}"  readonly value="${value}" class="form-control" id="${field.id}" aria-describedby="${field.id}Help">
            <small id="${field.id}Help" class="form-text text-muted">${field.help.msg}</small>
           `;
            // console.log(fieldHtml);
            formDivEle.innerHTML = fieldHtml;
          });

          break;

        case "checkbox":
          formDivEle.setAttribute("class", "form-group form-check");
          fieldHtml = `
            <input name="${field.id}" ${required} type="${field.field.type}" value="${field.field.default}" class="form-check-input" id="${field.id}" aria-describedby="${field.id}Help">
            <label for="${field.id}"> ${requiredStar} ${field.label}</label>
            <small id="${field.id}Help" class="form-text text-muted">${field.help.msg}</small>
           `;
          formDivEle.innerHTML = fieldHtml;
          break;
        default:
          fieldHtml = `
            <label for="${field.id}"> ${requiredStar} ${field.label}</label>
            <input name="${field.id}" ${required} type="${field.field.type}" value="${field.field.default}" class="form-control" id="${field.id}" aria-describedby="${field.id}Help">
            <small id="${field.id}Help" class="form-text text-muted">${field.help.msg}</small>
           `;
          formDivEle.innerHTML = fieldHtml;
      }

      // formDivEle.innerHTML = fieldHtml;
      formEle.appendChild(formDivEle);

      if (field.onchange) {
        onChangeHandler(
          field.id,
          `${field.onchange.toggle}-group`,
          field.onchange.valueShow,
          field.onchange.valueHide
        );
      }
    }
    const submitEle = document.createElement("button");
    submitEle.setAttribute("type", "submit");
    submitEle.setAttribute("id", "submit");
    submitEle.setAttribute("class", "btn btn-primary");
    // submitEle.setAttribute("onclick", "return false;");
    submitEle.innerText = "Submit";
    formEle.appendChild(submitEle);

    generatedFormEle.value = formEle.innerHTML;

    submitEle.addEventListener("click", (event) => {
      for (const field of formDef.fields) {
        formData[field.id] = getInputValue(field.id);
        if (field.required && !getInputValue(field.id)) {
          alert(`Value for ${field.label} is missing!`);
          return false;
        }
      }
      outputEle.value = JSON.stringify(formData, null, 4);
      return false;
    });
  }
}

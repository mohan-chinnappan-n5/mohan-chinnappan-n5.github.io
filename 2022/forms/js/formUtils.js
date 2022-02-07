// formUtils.js

const getEle = (id) => document.getElementById(id);





const getInputValue = (id) => {
  const ele = getEle(id);
  const inputType = ele.getAttribute("type");
  
  let value = "";
  switch (inputType) {
    case "checkbox":
      value = ele.checked ? "on" : "off"; 
      break;
    default:
      value = ele.value;
      break;
  }
  return value;
};

const showHideEle = (ele, display) => (ele.style.display = display);

const onChangeHandler = (id, targetId, valueShow, valueHide) => {
  const sourceEle = getEle(id);
  sourceEle.addEventListener("change", (event) => {
    const sourceEle = getEle(id);
    const sourceEleValue = sourceEle.value;
    const targetEle = getEle(targetId);
    if (sourceEleValue === valueShow) {
      showHideEle(targetEle, "block");
    } else if (sourceEleValue === valueHide) {
      showHideEle(targetEle, "none");
    }
  });
};

const generateSelectEle = (id, helpId, options, current, required) => {
  let fieldHtml = `
  <select  name="${id}" ${required} class="form-control" id="${id}" aria-describedby="${helpId}">   
  `;

  fieldHtml += `<option value="">-- SELECT --</option>`;

  for (const option of options) {
    if (current == option) {
        fieldHtml += `<option selected value="${option}">${option}</option>`;
    }
    else {
        fieldHtml += `<option value="${option}">${option}</option>`;
    }
  }
  fieldHtml += ` </select> `;
  return fieldHtml;
};

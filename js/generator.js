const { ipcRenderer } = require("electron");

const generateBtn = document.querySelector(".generate-btn");
const selects = document.querySelectorAll("select");
const inputs = document.querySelectorAll(".quantity input");

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    generateEvent();
  }
});

generateBtn.addEventListener("click", (event) => {
  generateEvent();
});

function generateEvent() {
  document.querySelector(".loading-box").style.visibility = "visible";
  formData.productionYear = selects[0].value;
  formData.productionMonth = selects[1].value;
  formData.connectionMethod = selects[2].value;
  formData.rotateType = selects[3].value;
  formData.startQuantity = inputs[0].value;
  formData.endQuantity = inputs[1].value;

  ipcRenderer.send("setFormData", formData);

  generatorSerialNumber(formData).then((encryptSerialNumber) => {
    ipcRenderer.send("setGenerateSerialNumbers", encryptSerialNumber);
    location.href = "view.html";
  });
}

const generatorSerialNumber = async (formData) => {
  const { productionYear, productionMonth, connectionMethod, rotateType, startQuantity, endQuantity } = formData;
  let encryptSerialNumber = new Array();

  // ! 타이틀 만들기
  // const title = getTitle(productionYear, productionMonth, connectionMethod, rotateType, startQuantity,endQuantity);

  //  ! 생산년도 , 월 , 유선/무선 , 무하 / 무부하는 변하지 않으니까 정적인 변수 생성
  const static = productionYear + productionMonth + connectionMethod + rotateType;

  // !생산 수량 정수로 변환
  const startNumber = parseInt(startQuantity);
  const endNumber = parseInt(endQuantity);

  // ! 시리얼 번호 생성
  encryptSerialNumber = await getSerialNumbers(startNumber, endNumber, static);
  // ! 유선, 무선 모델이름 생성
  const modelName = getModelName(connectionMethod, rotateType);

  return encryptSerialNumber;
};

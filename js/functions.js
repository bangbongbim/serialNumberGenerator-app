const crypto = require("crypto");

const fillZero = (length, value) => {
  return value.length >= length ? value : new Array(length - value.length + 1).join("0") + value;
};

const generateSalt = () => {
  let buf = crypto.randomBytes(16);

  return buf;
};

const encrypt = (hex, salt) =>
  new Promise((resolve, reject) => {
    crypto.pbkdf2(hex, salt, 111111, 4, "sha512", (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve(key);
      }
    });
  });

const getYear = (year) => {
  switch (year) {
    case "G":
      return "2020";
      break;
    case "N":
      return "2021";
      break;
    case "D":
      return "2022";
      break;
    case "L":
      return "2023";
      break;
    case "M":
      return "2024";
      break;
    case "B":
      return "2025";
      break;
    case "S":
      return "2026";
      break;
    case "A":
      return "2027";
      break;
    case "J":
      return "2028";
      break;
    case "C":
      return "2029";
      break;
    case "K":
      return "2030";
      break;
    case "T":
      return "2031";
      break;
    case "P":
      return "2032";
      break;
    case "H":
      return "2033";
      break;
  }
};

const getMonth = (month) => {
  switch (month) {
    case "1":
      return "1";
      break;
    case "2":
      return "2";
      break;
    case "3":
      return "3";
      break;
    case "4":
      return "4";
      break;
    case "5":
      return "5";
      break;
    case "6":
      return "6";
      break;
    case "7":
      return "7";
      break;
    case "8":
      return "8";
      break;
    case "9":
      return "9";
      break;
    case "A":
      return "10";
      break;
    case "B":
      return "11";
      break;
    case "C":
      return "12";
      break;
  }
};

const getConnectionType = (연결방법) => {
  let method;
  연결방법 === "C" ? (method = "유선") : (method = "무선");
  return method;
};
const getEncoderType = (엔코더타입) => {
  let type;
  엔코더타입 === "S" ? (type = "소프트") : (type = "포인트");
  return type;
};

const getTitle = (년, 월, 연결방법, 엔코더타입, 시작번호, 끝번호) => {
  const year = getYear(년);
  const month = getMonth(월);
  const method = getConnectionType(연결방법);
  const type = getEncoderType(엔코더타입);
  return `${year}년 ${month}월 ${method}연결 ${type}타입 ${parseInt(시작번호)}번부터 ~ ${parseInt(끝번호)}번까지 생산 `;
};

const getModelName = (연결방법, 엔코더타입) => {
  const method = 연결방법 === "C" ? "CT" : "BT";
  const encoderType = 엔코더타입 === "S" ? "Soft" : "Point";

  return `Grid10-${method}-${encoderType}`;
};

const getSerialNumbers = (시작번호, 끝번호, static) => {
  return new Promise((resolve, reject) => {
    const serialList = new Array(끝번호 - 시작번호 + 1).fill(0, 시작번호 - 1, 끝번호);
    Promise.all(serialList.map((value, index) => getOneSerialNumber(시작번호 + index, static))).then((number) => {
      resolve(number);
    });
  });
};

const getOneSerialNumber = (index, static) =>
  new Promise((resolve, reject) => {
    const quantity = fillZero(4, index.toString());

    // ! salt 생성
    const salt = generateSalt().toString("hex");

    // 두자리 10 진수를 뽑아서 16진수로 변환
    const hex = Math.floor(Math.random() * 99 + 16).toString(16); // 16 진수 랜덤으로
    // salt 값과 16진수 랜덤값을 합쳐서 암호화
    encrypt(hex, salt)
      .then((key) => {
        const temp = `${static}${quantity}${key.toString("hex")}`;
        const toUpperCaseSerialNumber = temp.toUpperCase();
        resolve(toUpperCaseSerialNumber);
      })
      .catch((err) => reject(err));

    // 암호화된 값을 이용해서 시리얼 번호 생성
    // 생성된 시리얼번호 대분자로 변경
  });

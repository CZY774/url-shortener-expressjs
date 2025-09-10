import shortid from "shortid";

const generateShortCode = (): string => {
  return shortid.generate();
};

export default generateShortCode;

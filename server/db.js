const csv = require('csvtojson');
const { Parser } = require('json2csv');
const { writeFile } = require('fs').promises;

const getOriginalBills = () => csv()
  .fromFile(`${__dirname}/data/bill.csv`);

const getBills = () => {
  let bills;
  return async () => {
    if (!bills) {
      bills = await getOriginalBills();
    }
    return bills;
  };
};

const getCategories = () => {
  let categories;
  return async () => {
    if (!categories) {
      categories = await csv()
        .fromFile(`${__dirname}/data/categories.csv`);
    }
    return categories;
  };
};

const addBill = async (bill) => {
  const bills = await getBills()();
  bills.push(bill);
};

const saveBills = async (bills) => {
  const parser = new Parser();
  const csvStr = parser.parse(bills);
  await writeFile(`${__dirname}/data/bill.csv`, csvStr, 'utf8');
};

module.exports = {
  getOriginalBills,
  getBills: getBills(),
  getCategories: getCategories(),
  saveBills,
  addBill,
};

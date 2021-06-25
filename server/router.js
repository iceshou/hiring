const {
  getOriginalBills,
  getBills,
  getCategories,
  saveBills,
} = require('./db');

function formatsBill(bills, callback) {
  bills.forEach((bill) => {
    const {
      type,
      amount,
      time,
    } = bill;
    bill.type = Number(type);
    bill.amount = parseFloat(amount);
    bill.time = Number(time);
    if (callback) {
      callback(bill);
    }
  });
}

function registerRouter(app) {
  app.get('/api/getBillList', async (req, res) => {
    const bills = await getBills();
    const categories = await getCategories();
    const categoryMap = new Map();
    categories.forEach((category) => {
      category.type = Number(category.type);
      categoryMap.set(category.id, category);
    });
    formatsBill(bills, (bill) => {
      if (bill.category && categoryMap.get(bill.category)) {
        Object.assign(bill, { category: categoryMap.get(bill.category) });
      }
    });
    bills.sort((item1, item2) => item2.time - item1.time);
    res.json({
      status: 1,
      data: bills,
    });
  });

  app.get('/api/getCategories', async (req, res) => {
    const categories = await getCategories();
    res.json({
      status: 1,
      data: categories,
    });
  });

  app.post('/api/addBill', async (req, res) => {
    const bill = req.body;
    const bills = await getBills();
    const originalBills = await getOriginalBills();

    bills.push(bill);

    if (bill.category) {
      bill.category = bill.category.id;
    }
    formatsBill(originalBills);
    originalBills.push(bill);
    saveBills(originalBills);

    res.json({
      status: 1,
      data: null,
    });
  });
}

module.exports = registerRouter;

function checkCashRegister(price, cash, cid) {
  var change = (cash - price) * 100,
      drawer = {},
      drawerTotal = 0,
      response = [],
      count = 0,
      payOut = {
      "ONE HUNDRED": -10000,
      "TWENTY": 0,
      "TEN": 0,
      "FIVE": 0,
      "ONE": 0,
      "QUARTER": 0,
      "DIME": 0,
      "NICKEL": 0,
      "PENNY": 0
    };
      
for (var i in cid) {
  switch (cid[i][0]) {
    case "PENNY":
      drawer[cid[i][0]] = {value: 1, amount: cid[i][1] * 100};
      break;
    case "NICKEL":
      drawer[cid[i][0]] = {value: 5, amount: cid[i][1] * 100};
      break;
    case "DIME":
      drawer[cid[i][0]] = {value: 10, amount: cid[i][1] * 100};
      break;
    case "QUARTER":
      drawer[cid[i][0]] = {value: 25, amount: cid[i][1] * 100};
      break;
    case "ONE":
      drawer[cid[i][0]] = {value: 100, amount: cid[i][1] * 100};
      break;
    case "FIVE":
      drawer[cid[i][0]] = {value: 500, amount: cid[i][1] * 100};
      break;
    case "TEN":
      drawer[cid[i][0]] = {value: 1000, amount: cid[i][1] * 100};
      break;
    case "TWENTY":
      drawer[cid[i][0]] = {value: 2000, amount: cid[i][1] * 100};
      break;
    case "ONE HUNDRED":
      drawer[cid[i][0]] = {value: 10000, amount: (cid[i][1] + 100) * 100};
      break;
  }
}
      
  // Here is your change, ma'am.
  function getChange(amount, subtract, currency) {

    subtract = subtract || 0;
    amount = amount - subtract;
    count++;
    currency = currency || "ONE HUNDRED";
    
    var currValue = drawer[currency].value,
      currAmount = drawer[currency].amount;
    
    if (amount === 0 && currAmount >= currValue) {

      drawer[currency].amount -= currValue;
      payOut[currency] += currValue;
      
      for (var cash in drawer) {drawerTotal += drawer[cash].amount;}
      console.log(drawerTotal);
      if (drawerTotal === 0) {return "Closed";}
      
      for (var x in payOut) {
        if (payOut[x] > 0) {
          response.push([x, payOut[x] / 100]);
        }
      }
      
      return response;
      
    } else if (amount <= 0 || drawer[currency].amount <= 0 && count > 1) {
      return null;
    } else {
    drawer[currency].amount = drawer[currency].amount - drawer[currency].value;
    payOut[currency] += drawer[currency].value;
      
      return getChange(amount, 10000, "ONE HUNDRED") ||
           getChange(amount, 2000, "TWENTY") ||
           getChange(amount, 1000, "TEN") ||
           getChange(amount, 500, "FIVE") ||
           getChange(amount, 100, "ONE") ||
           getChange(amount, 25, "QUARTER") ||
           getChange(amount, 10, "DIME") ||
           getChange(amount, 5, "NICKEL") ||
           getChange(amount, 1, "PENNY") ||
           "Insufficient Funds";
    }
  }
  return getChange(change);
}

// Example cash-in-drawer array:
// [["PENNY", 1.01],
// ["NICKEL", 2.05],
// ["DIME", 3.10],
// ["QUARTER", 4.25],
// ["ONE", 90.00],
// ["FIVE", 55.00],
// ["TEN", 20.00],
// ["TWENTY", 60.00],
// ["ONE HUNDRED", 100.00]]


checkCashRegister(3.26, 100.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]]);

//should return [["TWENTY", 60.00], ["TEN", 20.00], ["FIVE", 15.00], ["ONE", 1.00], ["QUARTER", 0.50], ["DIME", 0.20], ["PENNY", 0.04]]
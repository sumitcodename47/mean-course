const xl = require("excel4node");
const fs = require("fs");

// read XML json a file
let data = fs.readFileSync("./1.30.json");
data = JSON.parse(data);
const wb = new xl.Workbook();
const ws = wb.addWorksheet("Worksheet Name");

const headingColumnNames = [
  "Code",
  "CodeList",
  "Sublist",
  "Description",
  "Deprecated",
  "Deprecation Date",
  "MR1",
  "MR2",
  "Effective Date",
  "Expiration Date",
];

const mrDates = {
  "MR-15-2-": { date: "1/8/2016", p: 1 },
  "MR-16-1-": { date: "6/10/2016", p: 2 },
  "MR-16-2-": { p: 3, date: "12/9/2016" },
  "MR-17-1-": { p: 4, date: "6/9/2017" },
  "MR-17-2-": { p: 5, date: "11/22/2017" },
  "2018-1_DMPC": { p: 6, date: "7/6/2018" },
  "2018-2_DMPC": { p: 7, date: "12/12/2018" },
  "2019-1_DMPC": { p: 8, date: "7/6/2019" },
  "2019-2_DMPC": {
    p: 9,
    date: "12/12/2019",
  },
  "2020-1_DMPC": { p: 10, date: "5/29/2020" },
  "2020-2_DMPC": { p: 11, date: "12/11/2020" },
  "DMPC-21952_2021-1(": { p: 12, date: "12/10/2021" },
};
//Write Column Title in Excel file
let headingColumnIndex = 1;
headingColumnNames.forEach((heading) => {
  ws.cell(1, headingColumnIndex++).string(heading);
});

const getDate = (mr) => {
  let tempMr = mr;
  let extract;
  if (tempMr.indexOf("MR-") == 0) {
    extract = tempMr.slice(0, 8);
  }
  if (mrDates[extract]) {
    console.log(mrDates[extract]);
    return mrDates[extract].date;
  }
  return "";
};

//Write Data in Excel file
let rowIndex = 2;
data.Code.forEach((record) => {
  //code
  ws.cell(rowIndex, 1).string(record.Value[0]);
  // codelist
  ws.cell(rowIndex, 2).string("Coverages");
  // sublist
  if (record.SublistName) {
    ws.cell(rowIndex, 3).string(record.SublistName[0]);
  }

  // Description
  if (record.Desc) {
    ws.cell(rowIndex, 4).string(record.Desc[0].p[0]);
  }
  // deprecated
  if (record.deprecated && record.deprecated[0] == "Yes") {
    ws.cell(rowIndex, 5).string(record.deprecated[0]);
  }

  // depreDate
  if (record.DeprecatedDt) {
    ws.cell(rowIndex, 6).string(record.DeprecatedDt[0]);
  }

  if (record.RevisionHistory) {
    for (let i = 0; i < record.RevisionHistory[0].MRref.length; i++) {
      // MR1
      ws.cell(rowIndex, 7 + i).string(
        record.RevisionHistory[0].MRref[i].ref[0]
      );
      let date = getDate(record.RevisionHistory[0].MRref[i].ref[0]);
      if (date) {
        ws.cell(rowIndex, 9 + i).string(date);
      }
    }
  }

  // Effective Date
  // Expiration Date
  rowIndex++;
});
wb.write("241.xlsx");

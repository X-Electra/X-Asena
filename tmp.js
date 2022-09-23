let db = require("./db.json");
let date = new Date();
let day = [date.getDate()];
let mon = [date.getMonth()];
let yer = [date.getFullYear()];

day = day < 10 ? "0" + day : day;

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[mon];
let TDate = day + " " + month + " " + yer;
for (let user of db) {
  if (user.Expiry === TDate)
    console.log(
      `Plan Validity of ${user.Name} Ends Today please recharge \n Plan ID : ${user.Plan} `
    );
}

// function getData() {
//     return new Promise(resolve => {
//       setTimeout(() => resolve("Data fetched"), 1000);
//     });
//   }
//   getData().then(console.log);

//   setTimeout(() => console.log("setTimeout"), 0);
// setImmediate(() => console.log("setImmediate"));

// process.nextTick(() => console.log("Tick callback executed"));
// Promise.resolve().then(() => console.log("Promise resolved"));
// setTimeout(() => console.log("setTimeout executed"), 0);

// let count = 0;
// let interval = setInterval(() => {
//   console.log("Done");
//   if (++count === 3) clearInterval(interval);
// }, 2000);

// function getData() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("Data fetched");
//     }, 1000);
//   });
// } // Calling the function
// getData() .then(result => { console.log(result);}) .catch(error => { console.error(error); });
// console.log("Start");
// setTimeout(() => {
//   console.log("setTimeout executed");

// }, 0);
// setImmediate(() => {
//   console.log("setImmediate executed");
// });
// console.log("End");

// function tickFunction() {
//   process.nextTick(() => {
//     console.log("Tick callback executed");
//   });
// }
// console.log("Start");
// setTimeout(() => {
//   console.log("Timeout callback  executed");
// }, 0);
// Promise.resolve().then(() => {
//   console.log("Promise callback executed");
// });
// tickFunction();
// console.log("End");

// let count = 0;
// const maxExecutions = 3;
// const intervalId = setInterval(() => {
//   console.log("Done");
//   count++;
//   if (count >= maxExecutions) {
//     clearInterval(intervalId);
//     console.log("Timer stopped after 3 executions");
//   }
// }, 2000);
// console.log("Timer started");

// setImmediate(() => {
//     console.log('Immediate');
//   });
//   setTimeout(() => {
//     console.log('Timeout');
//   }, 0);


const fs = require('fs');
fs.readFile('file.txt', () => {
  setTimeout(() => {
    console.log('Timer');
  }, 0);
  setImmediate(() => {
    console.log('Immediate');
  });
});

  
// let promise = new Promise((resolve, reject) => {
//     setTimeout(() => resolve('Success!'), 2000);
//    });
//    promise.then(console.log).catch(console.error);

//    async function fetchData() {
//     let data = await fetch('https://api.example.com');
//     console.log(await data.json());
//   }
//   fetchData();

  
//   async function fetchData() {
//     try {
//       let data = await fetch(`not-a-valid-url!!!`);
//       console.log(await data.json());
//     } catch (error) {
//       console.log('Error:', error);
//     }
//   }
//   fetchData();
  

// let cabBooking = new Promise((resolve, reject) => {
//     let driverAvailable = true; // rejects if false
//     setTimeout(() => {
//       driverAvailable ? resolve("Cab has arrived!") : reject("No drivers available.");
//     }, 2000);
//   });
//   cabBooking.then(console.log).catch(console.error);


// function simulateDownload() {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve('Download complete'), 2000);
//     });
//   }
// //   simulateDownload().then(console.log);
  
// function simulateDownload() {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve('Download complete'), 2000);
//     });
//   }
// async function downloadFile() {
//     try {
//       let result = await simulateDownload();
//       console.log(result);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   } 
  
//   downloadFile();
  


// function delayedSum(a, b, callback) {
//     setTimeout(() => callback(a + b), 1000);
//   }
  
//   delayedSum(2, 3, (sum) => console.log('Sum:', sum));
  


// async function fetchUser() {
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       return 'User data loaded';
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }
  
//   fetchUser().then(console.log);
  


async function process() {
    try {
      const result = await Promise.reject('Something went wrong');
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
  process();
  
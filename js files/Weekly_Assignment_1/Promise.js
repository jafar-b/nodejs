// 5. Fake API Fetcher with Random Failure
// Create a function fetchUserData(userId) that:
// ● Returns a Promise
// ● Resolves after 2 seconds with a fake user object
// ● Fails randomly with a 30% chance (rejects)
// Then use async/await to:
// ● Fetch and print the data
// ● Catch and print error messages

function fetchData() {
  const rejectrequest = Math.random() < 0.3;

  return new Promise((resolve, reject) => {
setTimeout(()=>{    
    if (rejectrequest) {
        reject("Api call rejected!");
    } else {     
        resolve({
            name: "Jafar",
            email: "beldarjafar@gmail.com",
            password: "root123jafar",
        });
    }
},2000)
});
} 

async function fetchUser() {

    try{
        const response = await fetchData();
        console.log(response);
    }catch(err){console.log(err);
    }
}    
fetchUser();




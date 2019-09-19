let nums = []; 
for (let i = 0; i < 500; i++) {
    nums.push(Math.floor((Math.random() * 100) + 1));
}
const fs = require('fs');

fs.writeFile('numlist.txt', JSON.stringify(nums), (err) => {
    if (err) throw err;
})
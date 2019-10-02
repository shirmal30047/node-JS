const fetchData = ()=>{
const promise = new Promise((resolve,reject)=>{
    setTimeout(() => {
        resolve('done!');
    }, 1500);
});
return promise;
    
}

setTimeout(() => {
    console.log('Timer is done ');
    fetchData()
    .then(text=>{
        console.log(text);
        return fetchData();
    }).then(text=>{
        console.log(text);
    }).then(()=>{
        console.log('Timer is done ');
    });
    
}, 2000);

console.log('Hello');
console.log('Hi ');
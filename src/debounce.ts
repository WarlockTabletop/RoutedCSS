export function getNewDebounce(callback:()=>void, timeout_wait:number, countDown?:number) {
    let timeout:any;
    let max_count = countDown!= undefined ? countDown : 0;
    let count = max_count;
    process.stdin.on("data", (data)=>{
        if (timeout != undefined) {
            count = max_count;
            clearTimeout(timeout);
            callback();
        }
    })
    let run = () =>{
        if (timeout != undefined) {
            count = max_count;
            clearTimeout(timeout);
        }
        let getTimeout = ()=>{
            return setTimeout(()=>{
                if (count == 0){
                    count = max_count;
                    clearTimeout(timeout);
                    callback();
                    return;
                } 
                console.log("count ", count)
                count -= 1;
                timeout = getTimeout();
            }, timeout_wait)
        }
        timeout = getTimeout();
    }
    return run;
}
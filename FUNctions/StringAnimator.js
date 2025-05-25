function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function printer(input){
    let out = "";
    let currentChar =32;
    for (let i = 0; i < input.length; i++) {
        const getChar = input.charCodeAt(i)
        while (currentChar< getChar) {
            let currentOut = out+String.fromCharCode(currentChar)
            console.clear();
            console.log(currentOut);
            await sleep(10);
            
            currentChar++;
        }
        out += String.fromCharCode(currentChar)
        currentChar =32;
        
    }
    console.clear();
    console.log(out);
}

printer("hello");
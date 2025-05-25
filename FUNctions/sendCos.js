const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

let str1 = 'curl -X POST ssh.loffy.dk/data_receiver -d "sensor_data=';
let str2 = '" -d "coolState=false" -d "time_stamp=19:19:19" -d "date_stamp=19/09/2021"';

(async () => {
    for (let i = 0; i < 100; i++) {
        let value = (Math.cos(2 * Math.PI / 100 * i+ Math.PI ) + 1) * 4000;
        let cmd = str1 + value + str2;
        try {
            let { stdout, stderr } = await execPromise(cmd);
            if (stderr) console.error(stderr);
            else process.stdout.write(stdout);
        } catch (err) {
            console.error(`Error: ${err.message}`);
        }
    }
})();

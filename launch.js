const exec = require('child_process').exec;

exec('start cmd /k node index.js',
    function callback(error, stdout, stderr) {
        if (error) {
            console.log('ERROR:');
            console.log('THE EXECUTION FAILS!!!');
            return;
        }
    });
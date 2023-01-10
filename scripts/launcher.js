var child = require('child_process').execFile;

function launch(executablePath) {
    child(executablePath, function(err, data) {
        if(err){
           console.error(err);
           return;
        }
     
        console.log(data.toString());
    });
}
function redirect(redirectlink) {
    window.location.replace(redirectlink)
}
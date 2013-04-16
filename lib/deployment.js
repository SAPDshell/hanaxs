var exec = require('child_process').exec,
    fs = require('fs');
    

module.exports = function(dir, config, callback) {

	var env = process.env;
	env['REGI_HOST'] = config.host
	env['REGI_USER'] = config.user
	env['REGI_PASSWD'] = config.pass

	var options = {cwd: dir, env: env};
	
	var regi = function(cmd, callback) {
		console.log("REGI: " + cmd);		
		exec("regi.exe " + cmd, options, function(err, stdout, stderr){
			console.log("REGI: " + cmd, err, stdout, stderr);		
			callback(err, stdout, stderr);
		})
	}
	
	regi("create workspace --force", function(err, stdout, stderr) {
		regi("track " + config.root, function(err, stdout, stderr) {
			regi("checkout trackedpackages", function(err, stdout, stderr) {
				regi("commit", function(err, stdout, stderr) {
					regi("activate", function(err, stdout, stderr) {
						callback(null, "deployed to " + config.host);
					});
				});
			});
		});
	});
};

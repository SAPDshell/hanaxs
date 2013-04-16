var exec = require('child_process').exec,
    fs = require('fs');
    

module.exports = function(dir, config, callback) {

var env = process.env;
env['REGI_HOST'] = config.host
env['REGI_USER'] = config.user
env['REGI_PASSWD'] = config.pass

	var options = {cwd: dir, env: env};
	
	//fs.renameSync(dir + "/" + config.root, dir + "/tmp");
	//fs.mkdirSync(dir + "/" + config.root);
	
	console.log("regi.exe create workspace")
	exec("regi.exe create workspace --force", options, function(err, stdout, stderr) {
	exec("regi.exe resolve", options, function(err, stdout, stderr) {
	console.log(err, stdout, stderr)
		console.log("regi track")
		exec("regi.exe track " + config.root, options, function(err, stdout, stderr) {
	console.log(err, stdout, stderr)
			console.log("regi commit")
			exec("regi.exe commit", options, function(err, stdout, stderr) {
	console.log(err, stdout, stderr)
				console.log("regi activate")
				exec("regi.exe activate", options, function(err, stdout, stderr) {
	console.log(err, stdout, stderr)
					callback(null, "deployed to " + config.host);
				});
			});
		});
	});
	});
};

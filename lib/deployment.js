var exec = require('child_process').exec;

module.exports = function(dir, config, callback) {

	var options = {cwd: dir + "/" + config.root, env: {'REGI_HOST': config.host, 'REGI_USER': config.user, 'REGI_PASSWD': config.pass}}
	console.log("regi.exe create workspace")
	exec("regi.exe create workspace", options, function(err, stdout, stderr) {
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
};

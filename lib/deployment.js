var exec = require('child_process').exec;

module.exports = function(dir, config, callback) {

	var options = {cwd: dir + "/" + config.root, env: {'REGI_HOST': config.host, 'REGI_USER': config.user, 'REGI_PASSWD': config.pass}}
	console.log("regi create workspace")
	exec("regi create workspace", options, function(err, stdout, stderr) {
		console.log("regi track")
		exec("regi track " + config.root, options, function(err, stdout, stderr) {
			console.log("regi commit")
			exec("regi commit", options, function(err, stdout, stderr) {
				console.log("regi activate")
				exec("regi activate", options, function(err, stdout, stderr) {
					callback(null, true);
				});
			});
		});
	});
};

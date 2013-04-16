var exec = require('child_process').exec,
    fs = require('fs');
    

module.exports = function(dir, config, callback) {

	var env = process.env;
	env['REGI_HOST'] = config.host
	env['REGI_USER'] = config.user
	env['REGI_PASSWD'] = config.pass

	var options = {cwd: dir, env: env};
	
	exec("regi.exe create workspace --force", options, function(err, stdout, stderr) {
		exec("regi.exe track " + config.root, options, function(err, stdout, stderr) {
			exec("regi.exe checkout trackedpackages", options, function(err, stdout, stderr) {
				exec("regi.exe commit", options, function(err, stdout, stderr) {
					exec("regi.exe activate", options, function(err, stdout, stderr) {
						callback(null, "deployed to " + config.host);
					});
				});
			});
		});
	});
};

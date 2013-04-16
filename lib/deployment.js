var exec = require('child_process').exec;

module.exports = function(dir, config, callback) {

	var options = {cwd: req.dir + "/" + config.root, env: {'REGI_HOST': config.host, 'REGI_USER': config.user, 'REGI_PASSWD': config.pass}}

	exec("regi create workspace", options, function(err, stdout, stderr) {
		exec("regi track " + config.root, options, function(err, stdout, stderr) {
			exec("regi commit", options, function(err, stdout, stderr) {
				exec("regi activate", options, function(err, stdout, stderr) {
					callback(null, true);
				});
			});
		});
	});
};

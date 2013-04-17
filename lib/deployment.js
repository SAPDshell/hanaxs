var crypto = require('crypto'),
    exec = require('child_process').exec,
    fs = require('fs'),
    rimraf = require('rimraf');
    

module.exports = function(dir, config, callback) {

	var env = process.env;
	env['REGI_HOST'] = config.host;
	env['REGI_USER'] = config.user;
	env['REGI_PASSWD'] = config.pass;
	
	var regi = function(cmd, callback) {
		console.log("REGI: " + cmd);		
		exec("regi.exe " + cmd, {cwd: dir, env: env}, function(err, stdout, stderr){
			console.log("REGI: " + cmd, err, stdout, stderr);		
			callback(err, stdout, stderr);
		})
	}

	var tmp = 'z' + crypto.randomBytes(4).readUInt32LE(0);

	fs.renameSync(dir + "/" + config.root, dir + "/" + tmp);

	regi("create workspace --force", function(err, stdout, stderr) {
		regi("track " + config.root, function(err, stdout, stderr) {
			regi("checkout", function(err, stdout, stderr) {
				regi("rebase", function(err, stdout, stderr) {
					regi("resolve package " + config.root + " --with=local", function(err, stdout, stderr) {
						rimraf(dir + "/" + config.root, function() {
							fs.renameSync(dir + "/" + tmp, dir + "/" + config.root);
							regi("commit", function(err, stdout, stderr) {
								regi("activate", function(err, stdout, stderr) {
									callback(null, "deployed to " + config.host);
								})
							})
						});
					});
				});
			});
		});
	});
};

var crypto = require('crypto'),
    exec = require('child_process').exec,
    fs = require('fs'),
    rimraf = require('rimraf'),
    s = require('string');
    

module.exports = function(dir, config, callback) {

	config.pattern = config.pattern || "{{root}}-{{user}}";
	config.pattern = s(config.pattern).template({root: config.root, user: global.username}).s;

	var env = process.env;
	env['REGI_HOST'] = config.host;
	env['REGI_USER'] = global.username;
	env['REGI_PASSWD'] = global.password;
	
	var regi = function(cmd, cb) {
		exec("regi.exe " + cmd, {cwd: dir, env: env}, function(err, stdout, stderr){
			if(err) {
				callback(err.toString());
				return;
			}
			if(stderr) {
				callback(stderr.toString());
				return;
			}
			cb(err, stdout, stderr);
		})
	}

	var tmp = 'z' + crypto.randomBytes(4).readUInt32LE(0);

	fs.renameSync(dir + "/" + config.root, dir + "/" + tmp);

	regi("create workspace --force", function(err, stdout, stderr) {
		regi("track " + config.pattern, function(err, stdout, stderr) {
			regi("checkout", function(err, stdout, stderr) {
				regi("rebase", function(err, stdout, stderr) {
					regi("resolve package " + config.pattern + " --with=local", function(err, stdout, stderr) {
						rimraf(dir + "/" + config.pattern, function() {
							fs.renameSync(dir + "/" + tmp, dir + "/" + config.pattern);
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

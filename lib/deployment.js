// Copyright 2013, SAP AG
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//	 http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var crypto = require('crypto'),
	exec = require('child_process').exec,
	fs = require('fs'),
	rimraf = require('rimraf'),
	s = require('string');
	
var isWin = /^win/.test(process.platform);
var regiCmd = "";
if(isWin) {
	regiCmd = "regi.exe";
} else {
	regiCmd = "regi";
}

module.exports = function(dir, config, callback) {
	var dirTmp = dir;

	config.pattern = config.pattern || "{{root}}-{{user}}";
	config.pattern = s(config.pattern).template({root: config.root, user: global.username}).s;

	var env = process.env;
	env['REGI_HOST'] = config.host;
	
	var regi = function(cmd, cb) {
		if(
			cmd.match(/track/g)
		  || cmd.match(/checkout/g)
		  || cmd.match(/resolve/g)
		  || cmd.match(/commit/g)
		  || cmd.match(/activate/g)
		  ) {
			dir = dirTmp + "/workspace";
		}
		console.log("dir: " + dir);
		console.log(regiCmd + " " + cmd);
		exec(regiCmd + " " + cmd, {cwd: dir, env: env}, function(err, stdout, stderr){
			if(err) {
				callback("err: " + err.toString());
				return;
			}
			if(stderr) {
				callback("stderr: " + stderr.toString());
				return;
			}
			cb(err, stdout, stderr);
		});
		dir = dirTmp;
	}

	var tmp = 'zregi' + crypto.randomBytes(4).readUInt32LE(0);
	console.log("rename: " + dir + "/" + config.root + ", " + dir + "/" + tmp);
	fs.renameSync(dir + "/" + config.root, dir + "/" + tmp);

	regi("create ws workspace", function(err, stdout, stderr) {
		regi("track " + config.pattern, function(err, stdout, stderr) {
			regi("checkout", function(err, stdout, stderr) {
				regi("resolve package " + config.pattern + " --with=local", function(err, stdout, stderr) {
					rimraf(dir + "/workspace/" + config.pattern, function() {
						console.log("rename: " + dir + "/" + tmp + ", " + dir + "/" + config.pattern);
						fs.renameSync(dir + "/" + tmp, dir + "/workspace/" + config.pattern);
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
};

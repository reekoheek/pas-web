var path = require('path'),
    fs = require('fs'),
    spawn = require('child_process').spawn;

module.exports = {
    support: function(baseDir) {
        'use strict';

        return fs.existsSync(path.join(baseDir, 'bower.json'));
    },

    // readManifest: function(baseDir) {
    //     'use strict';

    //     var provider = this.require('provider');
    //     var profile = this.require('profile');

    //     if (fs.existsSync(path.join(baseDir, 'pas.json'))) {
    //         return this.super_.readManifest.call(this, baseDir);
    //     } else {

    //         console.log(baseDir);
    //         process.exit();
    //     }
    // }

    preInstall: function(p) {
        'use strict';

        return false;
    },

    postInstall: function(p) {
        'use strict';

        return new Promise(function(resolve, reject) {
            var cmd = spawn('bower', ['install'], {stdio: 'inherit'});
            cmd.on('exit', function() {
                resolve();
            });
        }.bind(this));
    }
};

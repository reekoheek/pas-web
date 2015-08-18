/**
 *
 * Copyright (c) 2015 Xinix Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

var path = require('path'),
    fs = require('fs'),
    spawn = require('child_process').spawn;

module.exports = {
    support: function(pack) {
        'use strict';

        return fs.existsSync(path.join(pack.cachePath, 'bower.json'));
    },

    read: function(pack) {
        'use strict';

        return this.super_.read(pack)
            .then(function(manifest) {
                manifest = manifest || {};

                var bowerFile = path.join(pack.cachePath, 'bower.json');

                try {
                    var bowerManifest = JSON.parse(fs.readFileSync(bowerFile));

                    if (bowerManifest.name) {
                        manifest.name = manifest.name || ('bower/' + bowerManifest.name);
                    }

                    if (bowerManifest.version) {
                        manifest.version = manifest.version || bowerManifest.version;
                    }

                    if (bowerManifest.dependencies) {
                        manifest.dependencies = manifest.dependencies || bowerManifest.dependencies;
                    }
                } catch(e) {}

                return manifest;
            });
    },

    install: function(pack) {
        'use strict';

        return new Promise(function(resolve, reject) {
                var cmd = spawn('bower', ['install'], {
                        stdio: 'inherit',
                        cwd: this.cwd
                    });

                cmd.on('close', function(errCode) {
                    if (errCode) {
                        reject(new Error('CLI Error: ' + errCode));
                    } else {
                        resolve();
                    }
                });
            }.bind(this));
    },

    up: function(pack) {
        'use strict';

        var port = this.app.options.p || 8081;

        var bs = require('browser-sync').create('Web server');
        bs.watch('**/*.html').on('change', bs.reload);
        bs.watch('**/*.js').on('change', bs.reload);

        bs.watch('**/*.css', function (event, file) {
            if (event === 'change') {
                bs.reload('*.css');
            }
        });
        bs.init({
            server: true
        });

    }
};

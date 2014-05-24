
module.exports = function (grunt) {
    'use strict';

    var _ = require('underscore');

    grunt.initConfig({
        less: {
            main: {
                options: {
                  paths: ['bootstrap/less'],
                  strictMath: false,
                  sourceMap: true,
                  outputSourceFiles: true,
                  sourceMapURL: 'stylesheets/main.css.map',
                  sourceMapFilename: 'stylesheets/main.css.map'
                },
                files: {
                  'stylesheets/main.css': 'less/main.less'
                }
            },
        },
        jade: {
          compile: {
            options: {
              pretty: true,
              data: function(dest, src) {
                // Return an object of data to pass to templates
                return {data: require('./maxapi.json'), debug: true, "_": _};
              }
            },
            files: {
              "index.html": ["jade/*.jade"]
            }
          }
        },
        watch: {
            less: {
                files: ['less/*.less',],
                tasks: ['less']
            },
            jade: {
                files: ['jade/*.jade',],
                tasks: ['jade']
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src : ['stylesheets/*.css', '*.html', 'jade/*.jade']
                },
                options: {
                    watchTask: true,
                    debugInfo: true,
                    server: {
                      baseDir: "./"
                    }
                }
            }
        }
    });

    // Adquire JSON from MAX API task
    grunt.registerTask('maxapi', 'Read from MAX API rest WS', function() {
      var done = this.async();

      var http = require('http');
      var fs = require('fs');
      var options = {
        host: 'localhost',
        port: 6543,
        path: '/info/api?by_category=1',
        method: 'GET'
      };
      http.get(options, function(res) {
        res.pipe(fs.createWriteStream('./maxapi.json'));
        res.on('end', function() {
          console.log("asd");
          done();
        });
      }).on("error", function(e){
        // Error
        done(false);
      });
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-browser-sync');

    grunt.registerTask('default', ["browserSync", "watch"]);
};

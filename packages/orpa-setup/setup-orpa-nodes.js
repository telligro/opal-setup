#! /usr/bin/env node
/**
 *  Copyright Telligro Pte Ltd 2017
 *
 *  This file is part of OPAL.
 *
 *  OPAL is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  OPAL is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with OPAL.  If not, see <http://www.gnu.org/licenses/>.
 */
console.log('Setup Node-RED dashboard');

var child_process = require('child_process');
const path = require('path')
var shell = require('shelljs');
var fs = require('fs-extra');
let child;
// console.log(__dirname);
// console.log(process.cwd());

var webdriversHome = path.join(__dirname, 'webdrivers');
shell.mkdir('-p', webdriversHome);
shell.exec('webdriver-manager update --ie --out_dir ' + webdriversHome)
var chromeDriverPath = path.join(webdriversHome, process.platform === 'win32' ? 'chromedriver.exe' : 'chromedriver' );
shell.cp(path.join(webdriversHome, 'chromedriver_*' + process.platform === 'win32' ? '.exe' : ''), chromeDriverPath);

fs.readFile(path.join(__dirname, 'package.json'), { encoding: 'utf8' }, (err, content) => {
    console.log('Reading package');
    if(err){
        console.error(err);
        process.exit(1);
    }
    var packageJSON = JSON.parse(content);
    var orpaNodes = Object.keys(packageJSON.dependencies)
        .filter(dep => (dep.indexOf('@torpadev/opal-node-') !== -1 || dep.indexOf('@torpadev/orpa-node-')) !== -1 && dep != '@torpadev/orpa-node-red')
        .map(dep => dep.replace('@torpadev/', ''));

    // console.log(__dirname);
    // console.log(process.cwd());
    var nodeRedHome = path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], '.node-red');
    shell.mkdir('-p', nodeRedHome);
    orpaNodes.forEach(orpaNode => {
        console.log('Linking module:%s', orpaNode);
        var orpaNodePath = path.join(__dirname, '..', orpaNode);
        
        console.log('npm link from %s', orpaNodePath);
        shell.cd(orpaNodePath);
        shell.exec('npm link');

        console.log('npm link %s from %s', orpaNode, nodeRedHome);
        shell.cd(nodeRedHome);
        shell.exec('npm link ' + '@torpadev/' + orpaNode);
        
    });
    try {
        child = require('child_process').execFile('node', [
            path.join(__dirname,'..','orpa-node-red/red.js')]);
        // use event hooks to provide a callback to execute when data are available: 

        child.stdout.on('data', function (data) {
            if(data.indexOf('Started flows')!==-1){
                console.log('Installation Complete');
                process.exit(0);
            }
            // process.stdout.write(data.toString());
        });

        child.stderr.on('data', function (data) {
            process.stdout.write(data.toString());
        });
    } catch (ex) {
        process.stdout.write(ex.toString());
    }
});

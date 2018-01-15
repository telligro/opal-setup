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
console.time('Setup Node-RED dashboard');

var child_process = require('child_process');
const path = require('path')
var shell = require('shelljs');
var fs = require('fs-extra');
// console.log(__dirname);
// console.log(process.cwd());
fs.readFile(path.join(__dirname, 'package.json'), { encoding: 'utf8' }, (err, content) => {

    var packageJSON = JSON.parse(content);
    var orpaNodes = Object.keys(packageJSON.dependencies)
        .filter(dep => dep.indexOf('@torpadev/orpa-node-') !== -1 && dep != '@torpadev/orpa-node-red')
        .map(dep => dep.replace('@torpadev/', ''));

    // console.log(__dirname);
    // console.log(process.cwd());
    var nodeRedHome = path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.node-red');
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
});

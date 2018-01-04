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
console.log('Launching Node-RED with ORPA Nodes');
var child_process = require('child_process');
const path = require('path')
var child;
try{
child = require('child_process').execFile('node', [ 
    'node_modules/@torpadev/orpa-node-red/red.js']); 
// use event hooks to provide a callback to execute when data are available: 

child.stdout.on('data', function(data) {
    process.stdout.write(data.toString()); 
});

child.stderr.on('data', function(data) {
    process.stdout.write(data.toString()); 
});
}catch(ex){
    process.stdout.write(ex);
}

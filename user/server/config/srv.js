"use strict";

var net = require('net');
var path = require('path');
var lockFile = require('lockfile');
var dns    = require('dns');
var config = require('./config');
var extend = require('util')._extend;
var lock = path.resolve(__dirname, 'srv.lock');
var srvRecords = {};                 // attribute domian and arrays of addrs
var refreshCachesTimer = config.srv.refresh_caches_timer;     // refresh srv records cache timers
var srvRecordExpire = config.srv.record_expires;   // srv records has expire, need refresh
var useLockFile = config.srv.use_lock;

function lockSrvRecord() {
	if (useLockFile === false)
		return;
	lockFile.lockSync(lock);
}

function unLockSrvRecord() {
	if (useLockFile === false)
		return;
	lockFile.unlockSync(lock);	
}

function compareNumbers(a, b) {
    a = parseInt(a, 10);
    b = parseInt(b, 10);
    return (a < b ? -1 : (a > b ? 1 : 0));
}

// Sorts the SRV lookup results first by priority, then randomising the server
// order for a given priority. For discussion of handling of priority and
// weighting, see https://github.com/dhruvbird/dns-srv/pull/4
function groupSrvRecords(addrs) {
    var groups = {};  // by priority
    addrs.forEach(function(addr) {
        if (!groups.hasOwnProperty(addr.priority)) {
            groups[addr.priority] = [];
        }

        groups[addr.priority].push(addr);
    });

    var result = [];
    Object.keys(groups).sort(compareNumbers).forEach(function(priority) {
        var group = groups[priority];
        // Calculate the total weight for this priority group
        var totalWeight = 0;
        group.forEach(function(addr) {
            totalWeight += addr.weight;
        });
        while (group.length > 1) {
            // Select the next address (based on the relative weights)
            var w = Math.floor(Math.random() * totalWeight);
            var index = -1;
            while (++index < group.length && w > 0) {
                w -= group[index].weight;
            }
            if (index < group.length) {
                // Remove selected address from the group and add it to the
                // result list.
                var addr = group.splice(index, 1)[0];
                result.push(addr);
                // Adjust the total group weight accordingly
                totalWeight -= addr.weight;
            }
        }
        // Add the final address from this group
        result.push(group[0]);
    });
    return result;
}

// one of both A & AAAA, in case of broken tunnels
function resolveHost(name, cb) {
    var error, results = [];
    var cb1 = function(e, addr) {
        error = error || e;
        if (addr) {
            results.push(addr);
        }

        cb((results.length > 0) ? null : error, results);
    };

    dns.lookup(name, cb1);
}

function resolveSrv(name, cb) {
    dns.resolveSrv(name, function(err, addrs) {
        if (err) {
            /* no SRV record, try domain as A */
            cb(err);
        } else {
            var pending = 0, error, results = [];
            var cb1 = function(e, addrs1) {
                error = error || e;
                results = results.concat(addrs1);
                pending--;
                if (pending < 1) {
                    results = groupSrvRecords(results);
                    cb(results ? null : error, results);
                }
            };
            var gSRV = addrs;            
            pending = gSRV.length;
            gSRV.forEach(function(addr) {
                resolveHost(addr.name, function(e, a) {
                    if (a) {
                        a = a.map(function(a1) {
                            return {
                                name: a1,
                                port: addr.port,
                                priority: addr.priority
                            };
                        });
                    }
                    cb1(e, a);
                });
            });
        }
    });
}

function refreshCaches() {
	var now = new Date();
	lockSrvRecord();
	for (var i in srvRecords) {
		if ((now - srvRecords[i].time) >= (srvRecordExpire * 1000)) {
			console.log("srv record has expire and delete |", srvRecords[i].id);
			delete srvRecords[i].addrs;
			delete srvRecords[i];
			showSrvReocrds();
		}
	}
	unLockSrvRecord();
}

function showSrvConfiguration() {
    console.info('-------------------------------------');
    console.info('| ' + 'DNS Srv Information: ');  
    console.info('| ' + "Refresh Srv Caches Timer: " + refreshCachesTimer );
    console.info('| ' + "Srv Record Expire: " + srvRecordExpire );
    console.info('| ' + "Lock File Enabled: " + (useLockFile ? 'Yes' : 'No'));
    console.info('-------------------------------------\n');
}

function showSrvReocrds() {
    console.info('-------------------------------------');
    console.info('| ' + 'DNS Srv Records: ');
	for (var i in srvRecords) {
		console.info('| ' + 'ID: ' + srvRecords[i].id);
		console.info('| ' + 'Query Time: ' + srvRecords[i].time);
		console.info('| ' + 'Address: ');
		for (var j in srvRecords[i].addrs) {
			var addr = srvRecords[i].addrs[j];
			console.info('|\t' + addr.name + ':' + addr.port);
		}
	}      
    console.info('-------------------------------------\n');	
}

function upSrvRecordAddrPri(record, addr) {
	if (!record.addrs || !record.addrs.length) {
		return false;
	}
	var addrs = record.addrs;
	for (var i = 0; i < addrs.length; i++) {
		if (addr === addrs[i]) {
			addrs.unshift(addrs.splice(i, 1)[0]);
			break;
		}
	}
	return true;
}

function genSrvRecordId(domain, is_wss) {
	return domain + (is_wss ? '.wss' : '.ws');
}

function startSrvQuery(domain, is_wss) {
	var services = [];
	var id, service, tryServices;
	var defaultPort = is_wss ? config.fs_wss_port : config.fs_ws_port;

	// FIXME: server need add wss/ws procotol ? _sips._ws. / _sips._wss.
	var service = (is_wss ? '_sips._wss' : '_sips._ws');
	services.push(service);   
	// services.push('_sips._tcp');    

	return new Promise((resolve, reject) => {
		if (!domain) {
			return reject(new Error('Illegal domain parameter'));
		}
		
		lockSrvRecord();
		id = genSrvRecordId(domain, is_wss);
		if (srvRecords[id]) {       // alread have record on caches
			unLockSrvRecord();
			console.log("srv found from records caches ", id);
			return resolve(srvRecords[id]);
		}

		tryServices = function () {
			service = services.shift();
			if (service) {	
				var name = service + '.' + domain;	
				resolveSrv(name, (error, addrs) => {

					if (addrs && addrs.length > 0) {
						srvRecords[id] = {
							id: id,
							domain: domain,
							addrs : addrs,
							time  : new Date()
						};
						console.log('resolve srv [' + name + ']' + ' address:\n ', addrs);
						unLockSrvRecord();
						return resolve(srvRecords[id]);
					} else {
						tryServices();
					}
				});
			} else {
				resolveHost(domain, (error, addrs) => {
					if (addrs && addrs.length > 0) {
	                    addrs = addrs.map(function(addr) {
	                        return { name: addr,
	                                 port: defaultPort };
	                    });
						srvRecords[id] = {
							id: id,
							domain: domain,
							addrs : addrs,
							time  : new Date()
                        };
	                    console.log('resolve host [' + domain + ']' + ' address:\n ', addrs);
						unLockSrvRecord();
						return resolve(srvRecords[id]);	                    
					} else {
						unLockSrvRecord();
						return reject(error || new Error('No addresses resolved for ' + domain));
					}
				});
			}
		};

	    // We start the process in the next tick so that if anything happens
	    // synchronously, then the event listeners that the user has added 
	    // on the socket object after calling connect() are also handled
	    // properly.
	    process.nextTick(tryServices);
	});

}

function tryConnect(srvRecord, timeout, suc_cb, fail_cb) {
	var addr, error;
	var onConnect, onError, connectNext;
	var addrs = extend([], srvRecord.addrs);     // addrs will be shift so need clone

	timeout = timeout || 5000;  // connect 5 sec timeout	
    var socket = new net.Socket();

    onConnect = function() {
        // done!
        socket.removeListener('connect', onConnect);
        socket.removeListener('error',   onError);
        socket.removeListener('timeout', onError);
        if (addr) {
        	upSrvRecordAddrPri(srvRecord, addr);
        	suc_cb(addr);
        } else {
        	fail_cb(new Error("Address is invaild"));
        	console.error("srv try connect failed address is invaild");
        }
        socket.destroy();
    };

    onError = function(e) {
        if (!e) {
            socket.destroy();
	        socket = new net.Socket();
		    socket.addListener('connect', onConnect);
		    socket.addListener('error', onError);
		    socket.addListener('timeout', onError);             
        }

        error = e || new Error('Connection timed out');
        connectNext();
    };

    connectNext = function() {
        addr = addrs.shift();
        if (addr) {
        	console.log("srv try connect [" + addr.name + ':' + addr.port + '] ...');
            socket.setTimeout(timeout, function() { });
            socket.connect(addr.port, addr.name); 
        }
        else {
            socket.removeListener('connect', onConnect);
            socket.removeListener('error',   onError);
            socket.removeListener('timeout', onError);
            error = error || new Error('No addresses to connect to');
            fail_cb(error);
            console.error("srv try connect failed ", error.message);
        }
    };

    // Add our listeners
    socket.addListener('connect', onConnect);
    socket.addListener('error', onError);
    socket.addListener('timeout', onError);
    connectNext();	
}


function init() {
	unLockSrvRecord();
	if (!this.refreshCachesInterval) {
		this.refreshCachesInterval = setInterval(refreshCaches, refreshCachesTimer * 1000);
	}
}

function destroy() {
	if (this.refreshCachesInterval) {
		clearInterval(this.refreshCachesInterval);
	}
}

module.exports = {
	init: init,
	showSrvConfiguration: showSrvConfiguration,
	showSrvReocrds: showSrvReocrds,
	startSrvQuery: startSrvQuery,
	tryConnect: tryConnect,
	destroy: destroy
};

// test
// API_test();

function API_test() {
	// init();
   // setInterval(() => {
        console.log("=== Date: ", new Date());
        startSrvQuery('meeting.yealinkvc.com', true).then((srvRecord) => {
            //srvRecord.addrs.unshift({name: '10.2.61.31', port: 7443});
            tryConnect(
                srvRecord, 
                10 * 1000, 
                addr => {
                    console.log("=== connected ", addr);
                },
                error => {
                    console.error("=== not connected ", error);
                }
            );
        }).catch ((error) => {
        });        
  //  }, 3000);

}

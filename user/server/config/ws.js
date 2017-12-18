/**
 *  注意：该文件主要实现WebSocket服务器，而且必须与https的端口绑定，不可以另起新端口作为WebSocket服务器。
 *  即如果https的端口为443，则WebSocket服务器就必须与该https端口绑定，客户端只能通过wss://localhost:443的形式访问该WebSocket服务器。
 *  虽然在Chrome下https不安全连接添加例外后，Chrome浏览器通过wss://localhost:any访问WebSocket服务端，无需再通过认证即可直接连接，
 *  但是在Firefox下的认证机制比较特殊，添加例外后，Firefox只能通过wss://localhost:443访问WebSocket服务端，其他端口均无法直接连接，否则
 *  直接出错。
 *
 *  综上所诉：为了兼容Firefox的认证机制，WebSocket必须与https端口绑定。所以Node服务端的不能再添加额外的WebSocket服务器。
 *  因此WebSocket在服务端局限性非常大，即有且只能有一个。
 *
 */
"use strict";
var config = require('./config');
var srv = require('./srv');
var fs = require('fs');
var crypto = require('crypto');
var useragent = require('useragent');
var request = require('request');
var WebSocket = require('ws');
var WebSocketServer = require('socket.io');
var srvEnabled = config.srv.enable === true ? 1 : 0;

/*------------------------------------------------------------------------------------------------------*/
// not standard websocket server part, as SIP Proxy
// use wss://localhost:port format visit

function parseWsUri(is_wss, url, port) {    
    if (!url) {
        return '';
    }

    var ws_uri = url;

    if (is_wss) {
        port = port || config.fs_wss_port;
        ws_uri = 'wss://' + ws_uri + ':' + port;
    } else {
        port = port || config.fs_ws_port;
        ws_uri = 'ws://' + ws_uri + ':' + port;
    }

    return ws_uri;
}

function getCurrentDate() {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

// Transport, connect to pbx wss server

var Transport;

Transport = function(proxy, message) {
    var url = '';

    this.server = 'wss://' + "server.leucs.com:7443";
    this.registerMsg = message;
    this.proxy = proxy;
    this.proxy.traceSip = proxy.traceSip || false;
    this.proxy.wsServerMaxReconnection = proxy.wsServerMaxReconnection || 3;
    this.proxy.wsServerReconnectionTimeout = proxy.wsServerReconnectionTimeout || 4;
    this.ws = null;
    this.reconnection_attempts  = 0;
    this.closed = false;
    this.connected = false;
    this.reconnectTimer = null;
    this.lastTransportError = {};

    if (proxy.fsaddr) {
        url = proxy.fsaddr;
    }
  
    if (srvEnabled) {
        // srv query registration redirect server
        console.log("srv query url ", this.proxy.remoteAddress, url);
        srv.startSrvQuery(url, proxy.is_wss).then((srvRecord) => {
            srv.tryConnect(
                srvRecord, 
                config.srv.try_connect_timeout, 
                addr => {
                    this.server = parseWsUri(proxy.is_wss, addr.name, addr.port);
                    this.connect();
                },
                error => {
                    console.warn('srv tryconnect ' + srvRecord.id + ' error ' + error.message);
                    srv.showSrvReocrds();
                    this.sendbrowser(JSON.stringify({
                        level: 'error',
                        name: 'WebSocket abrupt disconnection srv tryconnect ' + srvRecord.id + ' error ' + error.message
                    }));                      
                }
            );
        }).catch((error) => {
            console.warn("srv query [" + url + this.proxy.remoteAddress + "] error " + error.message );
            this.sendbrowser(JSON.stringify({
                level: 'error',
                name: 'WebSocket abrupt disconnection srv query error ' + error.message
            }));          
        });
    } else {
        this.server = parseWsUri(proxy.is_wss, url);
        this.connect();
    }
};

Transport.prototype = {
    
        /**
         * 
         */
        getAddressText: function() {
            if (!this.ws || !this.ws._socket || !this.ws._socket.remoteAddress ||
                !this.proxy || !this.proxy.remoteAddress)
                return '';
            return this.ws._socket.remoteAddress + ' to ' + this.proxy.remoteAddress + ':';
        },
    
        addHeader: function(name, value) {
            return name + ': ' + value + '\r\n';
        },
    
        addSipHeaderFields: function(msg) {
            var index, frontMsg, behindMsg;
    
            if (!this.proxy || !this.proxy.browserHeaderField)
                return msg;          
    
            index = msg.indexOf('\r\nContent-Length:');
            if (index === -1) {
                return msg;
            }
    
            frontMsg = msg.substring(0, index+2);        
            behindMsg = msg.substring(index+2);
            frontMsg += this.addHeader('WebRTC-Client', this.proxy.browserHeaderField);
            
            return (frontMsg + behindMsg);
        },
    
        /**
        * Send a message.
        * @returns {Boolean}
        */    
        send: function(msg) {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                if (this.proxy.reWritePacket === true) {
                    msg = this.addSipHeaderFields(msg);
                }
                if (this.proxy.traceSip === true) {
                    console.info('sending WebSocket message from ' + this.getAddressText() + '\n\n' + msg + '\n');
                }            
                this.ws.send(msg);
                return true;
            } else {
                console.warn(this.getAddressText() + 'unable to send message, WebSocket ' + this.server + ' is not open');
                return false;
            }
        },
    
        /**
        * proxy Send a message to browser clients
        * @returns {Boolean}
        */    
        sendbrowser: function (msg) {
            if (this.proxy /*&& this.proxy.readyState === 'open'*/) {
                this.proxy.send(msg);
            }
        },
    
        /**
        * Disconnect socket.
        */
        disconnect: function() {      
    
            if (this.ws) {
                clearTimeout(this.reconnectTimer);
                this.closed = true;
                console.info(this.getAddressText() + 'closing WebSocket ' + this.server);
                this.sendbrowser(JSON.stringify({
                    level: 'info',
                    name: 'closing WebSocket ' + this.server
                }));
                this.ws.close();
                this.ws = null;
            }
    
            if (this.reconnectTimer !== null) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
                /*console.warn("WebSocket last Transport Error code: ", this.lastTransportError.code, " reason: ", this.lastTransportError.reason);
                this.sendbrowser(JSON.stringify({
                    level: 'warn',
                    name: "WebSocket last Transport Error code: " + this.lastTransportError.code + " reason: " + this.lastTransportError.reason
                })); */           
            }
        },
        /**
        * Connect socket.
        */
        connect: function() {
            var transport  = this;
    
            if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
                console.info(this.getAddressText() + 'WebSocket ' + this.server + ' is already connected');
                return false;
            }
    
            if (this.ws) {
                this.ws.close();
            }
    
            console.info(this.getAddressText() + 'connecting to WebSocket ' + this.server);
            this.sendbrowser(JSON.stringify({
                level: 'info',
                name: 'connecting to WebSocket ' + this.server + ' attempts',
                value: (this.reconnection_attempts === 0)?1:this.reconnection_attempts           
            }));           
            try {
                this.ws = new WebSocket(this.server, {
                    rejectUnauthorized: false,
                    // don't use the certificate also can get through it
                    // pbx server no access restrictions
                    key: fs.readFileSync(config.fs_privateKey).toString(), 
                    cert: fs.readFileSync(config.fs_certificate).toString(),
                    protocol: 'sip'
                });           
            } catch (e) {
                console.warn("create proxy websocket error ", e);
                console.warn(this.getAddressText() + 'error connecting to WebSocket ' + this.server);
                this.sendbrowser(JSON.stringify({
                    level: 'warn',
                    name: 'error connecting to WebSocket ' + this.server          
                }));             
            }
    
            this.ws.binaryType = 'arraybuffer';
    
            this.ws.onopen = function() {
                transport.onOpen();
            };
    
            this.ws.onclose = function(e) {
              transport.onClose(e);
              // Always cleanup. Eases GC, prevents potential memory leaks.
              this.onopen = null;
              this.onclose = null;
              this.onmessage = null;
              this.onerror = null;          
            };
    
            this.ws.onmessage = function(e) {
              transport.onMessage(e);
            };
    
            this.ws.onerror = function(e) {
              transport.onError(e);
            };   
        },
    
        // Transport Event Handlers
    
        /**
        * @event
        * @param {event} e
        */
        onOpen: function() {
            this.connected = true;
    
            if (this.reconnection_attempts > 0 && this.proxy.notifyBrowserReconnect  === true ) {
                this.sendbrowser(JSON.stringify({
                    level: 'notifyReconnectRegister',
                    name: 'reconnect to WebSocket ' + this.server + ' attempts' + this.reconnection_attempts        
                }));                 
                console.info(this.getAddressText() + 'WebSocket ' + this.server + ' reconnected');
            } else {
                this.sendbrowser(JSON.stringify({
                    level: 'info',
                    name: 'WebSocket ' + this.server + ' connected'       
                }));          
                console.info(this.getAddressText() + 'WebSocket ' + this.server + ' connected');
            }
    
            if (this.reconnectTimer !== null) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }
            // Reset reconnection_attempts
            this.reconnection_attempts = 0;
            // Disable closed
            this.closed = false;  
            // first registeration packet
            if (this.reconnection_attempts == 0) {
                this.send(this.registerMsg);   
            }
        },
    
        /**
        * @event
        * @param {event} e
        */
        onClose: function (e) {
            var connected_before = this.connected;
    
            this.lastTransportError.code = e.code;
            this.lastTransportError.reason = e.reason;
    
            if (this.reconnection_attempts > 0) {
                console.info(this.getAddressText() + 'Reconnection attempt ' + this.reconnection_attempts + ' failed (code: ' + e.code + (e.reason? '| reason: ' + e.reason : ' id: ' + this.proxy.id) +')');
                this.sendbrowser(JSON.stringify({
                    level: 'info',
                    name: 'Reconnection attempt ' + this.reconnection_attempts + ' failed (code: ' + e.code + (e.reason? '| reason: ' + e.reason : '') +')'    
                }));              
                this.reconnect();
            } else {
                this.connected = false;
                console.info(this.getAddressText() + 'WebSocket disconnected (code: ' + e.code + (e.reason? '| reason: ' + e.reason : ' id: ' + this.proxy.id) +')');
                this.sendbrowser(JSON.stringify({
                    level: 'info',
                    name: 'WebSocket disconnected (code: ' + e.code + (e.reason? '| reason: ' + e.reason : '') +')'
                }));           
            
                if (e.wasClean === false) {
                    console.error(this.getAddressText() + 'WebSocket ' + this.server + ' abrupt disconnection (id: ' + this.proxy.id +')');
                    // don't close proxy socket, otherwise browser socket will connect again
                    this.sendbrowser(JSON.stringify({
                        level: 'error',
                        name: 'WebSocket abrupt disconnection (code: ' + e.code + (e.reason? '| reason: ' + e.reason : '') +')'
                    }));
                    console.log('[' + this.getAddressText() + '] freeswitch abrupt disconnected at ' + getCurrentDate());
                }
                // Transport was connected
                if (connected_before === true) {
                    // Check whether the user requested to close.
                    if (!this.closed) {
                        this.reconnect();
                    } else {
                        console.info(this.getAddressText() + 'WebSocket ' + this.server + ' disconnected');
                        // don't close proxy socket, otherwise browser socket will connect again
                    }
                } else {
                    console.warn(this.getAddressText() + 'WebSocket ' + this.server + ' this is the first connection attempt'); 
                }            
            }
        },
    

    /**
    * @event
    * @param {event} e
    */
    onMessage: function(e) {
        var data = e.data;

        if (this.proxy.traceSip === true) {          
            console.info('received WebSocket text message from ' + this.getAddressText() + '\n\n' + data + '\n');
        }

        if (this.proxy) {
            this.proxy.send(data);
        } else {
            console.warn(this.getAddressText() + 'unable to send message, WebSocket proxy is not open');
        }
    },

    /**
    * @event
    * @param {event} e
    */
    onError: function(e) {
        console.error(this.getAddressText() + 'WebSocket connection id: ' + this.proxy.id + ' error: ' + e.toString());
    },    

    /**
    * Reconnection attempt logic.
    * @private
    */
    reconnect: function() {
        var transport = this;

        this.reconnection_attempts += 1;

        if (this.reconnection_attempts > this.proxy.wsServerMaxReconnection) {
            console.warn(this.getAddressText() + 'maximum reconnection attempts for WebSocket ' + this.server + ' id: ' + this.proxy.id);
            this.sendbrowser(JSON.stringify({
                level: 'warn',
                name: 'maximum reconnection attempts for WebSocket ' + this.server
            }));              
        } else if (this.reconnection_attempts === 1) {
            console.info(this.getAddressText() + 'Connection to WebSocket ' + this.server + ' severed, attempting first reconnect');
            this.sendbrowser(JSON.stringify({
                level: 'info',
                name: 'Connection to WebSocket ' + this.server + ' severed, attempting first reconnect'
            }));               
            transport.connect();
        } else {
            console.info(this.getAddressText() + 'trying to reconnect to WebSocket ' + this.server + ' (reconnection attempt ' + this.reconnection_attempts + ')');
            this.sendbrowser(JSON.stringify({
                level: 'info',
                name: 'trying to reconnect to WebSocket ' + this.server + ' (reconnection attempt ' + this.reconnection_attempts + ')'
            }));          
            this.reconnectTimer = setTimeout(function() {
                transport.connect();
                transport.reconnectTimer = null;
            }, this.proxy.wsServerReconnectionTimeout * 1000);
        }
    }

};

/*--------------------------------------------------------------------------------------------------------------------*/
// websocket server configuration 

function genBrowserHeaderField(remoteAddress, userAgent) {
    var agent = useragent.parse(userAgent);
    var lastindex, address = remoteAddress;
    lastindex = remoteAddress.lastIndexOf(':');
    if (lastindex !== -1) {
        address = remoteAddress.substring(lastindex+1);
    }
    return '"' + address + '"' + ' (' + agent.toString() + ')';
};

function standardConnectionListener(proxy) {
	var remoteAddress = proxy.upgradeReq.connection.remoteAddress;
	proxy.onmessage = function (e) {
		standardWs.onMessage(proxy, e.data);
	}  
    proxy.onerror = function(e) {
        console.error('[' + remoteAddress + ']' + 'WebSocket standard connection error: ' + e.toString());
    }	
}

function proxyConnectionListener(proxy) {
    
    var headers = proxy.handshake.headers;
    var remoteAddress = proxy.handshake.address;
    var ssl = proxy.handshake.secure ? true : false;
    for (var i in config.proxy) {
        proxy[i] = config.proxy[i];
    }

    proxy.userAgent = headers['user-agent'];    
    proxy.remoteAddress = remoteAddress;
    proxy.browserHeaderField = genBrowserHeaderField(proxy.remoteAddress, proxy.userAgent);
    proxy.is_wss = true;  // proxy.is_wss = ssl ? true : false;
    proxy.id = new Date().getTime() + Math.floor(Math.random() * Math.pow(10, 8));

    proxy.on('message', function(data) {
        var message = data;

        if (!proxy.transport /*|| !proxy.transport.ws || !proxy.transport.ws.readyState || proxy.transport.ws.readyState !== WebSocket.OPEN*/) {   // maybe freeswitch close wss
            // delete proxy.transport;
            proxy.transport = new Transport(proxy, message);
        } else {            
            proxy.transport.send(message);            
        }
    });

    proxy.on('disconnect', function(reason) {        
        console.info('[' + remoteAddress + ']' + ' WebSocket proxy disconnected (' + (reason? '| reason: ' + reason : ' id: ' + this.id) +')');
        if (proxy.transport) {
            proxy.transport.disconnect();
        }
    });

    proxy.on('error', function(data) {
        console.info('[' + remoteAddress + ']' + 'WebSocket proxy connection id: ' + this.id + ' error: ' + data.toString());
        console.info('WebSocket proxy connection error ', remoteAddress, data);
        if (proxy.transport)
            proxy.transport.disconnect();
    });  	
}

WebSocketServer.prototype.serverConnectionListener = function(proxy) {
    const self = this;
    console.log("connect fs address: " + proxy.handshake.query.fsaddr);
    if (!proxy.handshake.query.fsaddr) {
    	// this is standard websocket connection, such as wss://localhost:443
        standardConnectionListener.bind(this, proxy);      
    } else {
	    // this is not standard websocket connection as sip proxy, such as wss://localhost:443/pbx.leucs.com
	    // pbx.leucs.com is the fs server we need to connect to ...  
    	proxy.fsaddr = proxy.handshake.query.fsaddr;
        proxyConnectionListener(proxy);
    }
        
}

WebSocketServer.prototype.serverOnError = function (e) {
    console.error("WebSocket Server error ", e);
}

function bind(httpServer, httpsServer) {
	var wsServer = httpServer ?  WebSocketServer(httpServer) : null;

	var wssServer = httpsServer ? WebSocketServer(httpsServer) : null;

	if (wsServer) {
	    wsServer.on('connection', wsServer.serverConnectionListener)
        wsServer.on('error', wsServer.serverOnError)
	}

	if (wssServer) {
	    wssServer.on('connection', wssServer.serverConnectionListener);
        wssServer.on('error', wsServer.serverOnError)
	}	
}

module.exports = {
    bind: bind
};
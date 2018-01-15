/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "40c33c31de661b520dc8"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:3000/assets/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(14)(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*************************************!*\
  !*** ./build/helpers/hmr-client.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var hotMiddlewareScript = __webpack_require__(/*! webpack-hot-middleware/client?noInfo=true&timeout=20000&reload=true */ 2);

hotMiddlewareScript.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload();
  }
});


/***/ }),
/* 1 */
/*!**************************************************!*\
  !*** ../node_modules/css-loader/lib/css-base.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 2 */
/*!**********************************************************************************************!*\
  !*** ../node_modules/webpack-hot-middleware/client.js?noInfo=true&timeout=20000&reload=true ***!
  \**********************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: '',
  autoConnect: true
};
if (true) {
  var querystring = __webpack_require__(/*! querystring */ 4);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  setOverrides(overrides);
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  if (options.autoConnect) {
    connect();
  }
}

/* istanbul ignore next */
function setOptionsAndConnect(overrides) {
  setOverrides(overrides);
  connect();
}

function setOverrides(overrides) {
  if (overrides.autoConnect) options.autoConnect = overrides.autoConnect == 'true';
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }

  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(/*! strip-ansi */ 7);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(/*! ./client-overlay */ 9);
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(/*! ./process-update */ 37);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
      } else {
        if (reporter) {
          if (obj.warnings.length > 0) {
            reporter.problems('warnings', obj);
          } else {
            reporter.cleanProblemsCache();
          }
          reporter.success();
        }
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    },
    setOptionsAndConnect: setOptionsAndConnect
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?noInfo=true&timeout=20000&reload=true", __webpack_require__(/*! ./../webpack/buildin/module.js */ 3)(module)))

/***/ }),
/* 3 */
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/module.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 4 */
/*!************************************************!*\
  !*** ../node_modules/querystring-es3/index.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ 5);
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ 6);


/***/ }),
/* 5 */
/*!*************************************************!*\
  !*** ../node_modules/querystring-es3/decode.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 6 */
/*!*************************************************!*\
  !*** ../node_modules/querystring-es3/encode.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 7 */
/*!*******************************************!*\
  !*** ../node_modules/strip-ansi/index.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(/*! ansi-regex */ 8)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 8 */
/*!*******************************************!*\
  !*** ../node_modules/ansi-regex/index.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 9 */
/*!****************************************************************!*\
  !*** ../node_modules/webpack-hot-middleware/client-overlay.js ***!
  \****************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

var ansiHTML = __webpack_require__(/*! ansi-html */ 10);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

var Entities = __webpack_require__(/*! html-entities */ 11).AllHtmlEntities;
var entities = new Entities();

exports.showProblems =
function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
};

exports.clear =
function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
};

var problemColors = {
  errors: colors.red,
  warnings: colors.yellow
};

function problemType (type) {
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}


/***/ }),
/* 10 */
/*!******************************************!*\
  !*** ../node_modules/ansi-html/index.js ***!
  \******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 11 */
/*!**********************************************!*\
  !*** ../node_modules/html-entities/index.js ***!
  \**********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(/*! ./lib/xml-entities.js */ 12),
  Html4Entities: __webpack_require__(/*! ./lib/html4-entities.js */ 13),
  Html5Entities: __webpack_require__(/*! ./lib/html5-entities.js */ 0),
  AllHtmlEntities: __webpack_require__(/*! ./lib/html5-entities.js */ 0)
};


/***/ }),
/* 12 */
/*!*********************************************************!*\
  !*** ../node_modules/html-entities/lib/xml-entities.js ***!
  \*********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 13 */
/*!***********************************************************!*\
  !*** ../node_modules/html-entities/lib/html4-entities.js ***!
  \***********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 14 */
/*!****************************************************************************************!*\
  !*** multi ./build/util/../helpers/hmr-client.js ./scripts/main.js ./styles/main.scss ***!
  \****************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Users\Smigol\projects\ghost\content\themes\mapache\src\build\util/../helpers/hmr-client.js */0);
__webpack_require__(/*! ./scripts/main.js */15);
module.exports = __webpack_require__(/*! ./styles/main.scss */16);


/***/ }),
/* 15 */
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_theia_sticky_sidebar_dist_ResizeSensor__ = __webpack_require__(/*! theia-sticky-sidebar/dist/ResizeSensor */ 52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_theia_sticky_sidebar_dist_ResizeSensor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_theia_sticky_sidebar_dist_ResizeSensor__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_theia_sticky_sidebar__ = __webpack_require__(/*! theia-sticky-sidebar */ 53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_theia_sticky_sidebar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_theia_sticky_sidebar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery_lazyload__ = __webpack_require__(/*! jquery-lazyload */ 54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery_lazyload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery_lazyload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__autoload_jquery_ghostHunter_js__ = __webpack_require__(/*! ./autoload/jquery.ghostHunter.js */ 55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__autoload_jquery_ghostHunter_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__autoload_jquery_ghostHunter_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__autoload_pagination_js__ = __webpack_require__(/*! ./autoload/pagination.js */ 57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__autoload_pagination_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__autoload_pagination_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_Router__ = __webpack_require__(/*! ./util/Router */ 58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__routes_common__ = __webpack_require__(/*! ./routes/common */ 60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__routes_home__ = __webpack_require__(/*! ./routes/home */ 65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__routes_post__ = __webpack_require__(/*! ./routes/post */ 67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__routes_video__ = __webpack_require__(/*! ./routes/video */ 73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__routes_audio__ = __webpack_require__(/*! ./routes/audio */ 74);
// import external dependencies
// import 'jquery';




// Import everything from autoload
 

// import local dependencies







/** Populate Router instance with DOM routes */
var routes = new __WEBPACK_IMPORTED_MODULE_5__util_Router__[false /* default */]({
  // All pages
  common: __WEBPACK_IMPORTED_MODULE_6__routes_common__[false /* default */],
  // Home page
  home: __WEBPACK_IMPORTED_MODULE_7__routes_home__[false /* default */],
  // article
  isArticle: __WEBPACK_IMPORTED_MODULE_8__routes_post__[false /* default */],
  // Video
  isVideo: __WEBPACK_IMPORTED_MODULE_9__routes_video__[false /* default */],
  // Audio
  isAudio: __WEBPACK_IMPORTED_MODULE_10__routes_audio__[false /* default */],
});

// Load Events
$(document).on('ready', function () { return routes.loadEvents(); });

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 16 */
/*!**************************!*\
  !*** ./styles/main.scss ***!
  \**************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 41);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ 38)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 41, function() {
			var newContent = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 41);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */
/*!****************************************************************!*\
  !*** ../node_modules/webpack-hot-middleware/process-update.js ***!
  \****************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "https://webpack.js.org/concepts/hot-module-replacement/"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { 				
  ignoreUnaccepted: true,
  ignoreDeclined: true,
  ignoreErrored: true,
  onUnaccepted: function(data) {
    console.warn("Ignored an update to unaccepted module " + data.chain.join(" -> "));
  },
  onDeclined: function(data) {
    console.warn("Ignored an update to declined module " + data.chain.join(" -> "));
  },
  onErrored: function(data) {
    console.error(data.error);
    console.warn("Ignored an error while updating module " + data.moduleId + " (" + data.type + ")");
  } 
}

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 38 */
/*!*****************************************************!*\
  !*** ../node_modules/style-loader/lib/addStyles.js ***!
  \*****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ 39);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 39 */
/*!************************************************!*\
  !*** ../node_modules/style-loader/lib/urls.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 40 */
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 41 */
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../node_modules/cache-loader/dist/cjs.js!../node_modules/css-loader?{"sourceMap":true}!../node_modules/postcss-loader/lib?{"config":{"path":"C://Users//Smigol//projects//ghost//content//themes//mapache//src//build","ctx":{"open":true,"copy":"images/**_/*","proxyUrl":"http://localhost:3000","cacheBusting":"[name]","paths":{"root":"C://Users//Smigol//projects//ghost//content//themes//mapache","assets":"C://Users//Smigol//projects//ghost//content//themes//mapache//src","dist":"C://Users//Smigol//projects//ghost//content//themes//mapache//assets"},"enabled":{"sourceMaps":true,"optimize":false,"cacheBusting":false,"watcher":true},"watch":"**_/*.hbs","entry":{"main":["./scripts/main.js","./styles/main.scss"],"theme-blue-semi-dark":"./styles/themes/blue-semi-dark.scss","theme-blue":"./styles/themes/blue.scss","theme-dark-blue":"./styles/themes/dark-blue.scss","theme-dark-cyan":"./styles/themes/dark-cyan.scss","theme-green":"./styles/themes/green.scss","theme-grey":"./styles/themes/grey.scss","theme-indigo":"./styles/themes/indigo.scss","theme-purple":"./styles/themes/purple.scss","theme-teal":"./styles/themes/teal.scss","theme-white":"./styles/themes/white.scss"},"publicPath":"/assets/","devUrl":"http://localhost:2368","env":{"production":false,"development":true},"manifest":{}}},"sourceMap":true}!../node_modules/resolve-url-loader?{"sourceMap":true}!../node_modules/sass-loader/lib/loader.js?{"sourceMap":true}!../node_modules/import-glob!./styles/main.scss ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ 1)(true);
// imports
exports.i(__webpack_require__(/*! -!../../node_modules/css-loader?{"sourceMap":true}!normalize.css/normalize.css */ 75), "");
exports.i(__webpack_require__(/*! -!../../node_modules/css-loader?{"sourceMap":true}!prismjs/themes/prism.css */ 76), "");

// module
exports.push([module.i, "@charset \"UTF-8\";\n\npre.line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber;\n}\n\npre.line-numbers > code {\n  position: relative;\n  white-space: inherit;\n}\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber;\n}\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right;\n}\n\n@font-face {\n  font-family: 'mapache';\n  src: url(" + __webpack_require__(/*! ./../fonts/mapache.ttf */ 77) + ") format(\"truetype\"), url(" + __webpack_require__(/*! ./../fonts/mapache.woff */ 78) + ") format(\"woff\"), url(" + __webpack_require__(/*! ./../fonts/mapache.svg */ 79) + ") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n\n[class^=\"i-\"]:before,\n[class*=\" i-\"]:before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.i-navigate_before:before {\n  content: \"\\E408\";\n}\n\n.i-navigate_next:before {\n  content: \"\\E409\";\n}\n\n.i-tag:before {\n  content: \"\\E54E\";\n}\n\n.i-keyboard_arrow_down:before {\n  content: \"\\E313\";\n}\n\n.i-arrow_upward:before {\n  content: \"\\E5D8\";\n}\n\n.i-cloud_download:before {\n  content: \"\\E2C0\";\n}\n\n.i-star:before {\n  content: \"\\E838\";\n}\n\n.i-keyboard_arrow_up:before {\n  content: \"\\E316\";\n}\n\n.i-open_in_new:before {\n  content: \"\\E89E\";\n}\n\n.i-warning:before {\n  content: \"\\E002\";\n}\n\n.i-back:before {\n  content: \"\\E5C4\";\n}\n\n.i-forward:before {\n  content: \"\\E5C8\";\n}\n\n.i-chat:before {\n  content: \"\\E0CB\";\n}\n\n.i-close:before {\n  content: \"\\E5CD\";\n}\n\n.i-code2:before {\n  content: \"\\E86F\";\n}\n\n.i-favorite:before {\n  content: \"\\E87D\";\n}\n\n.i-link:before {\n  content: \"\\E157\";\n}\n\n.i-menu:before {\n  content: \"\\E5D2\";\n}\n\n.i-feed:before {\n  content: \"\\E0E5\";\n}\n\n.i-search:before {\n  content: \"\\E8B6\";\n}\n\n.i-share:before {\n  content: \"\\E80D\";\n}\n\n.i-check_circle:before {\n  content: \"\\E86C\";\n}\n\n.i-play:before {\n  content: \"\\E901\";\n}\n\n.i-download:before {\n  content: \"\\E900\";\n}\n\n.i-code:before {\n  content: \"\\F121\";\n}\n\n.i-behance:before {\n  content: \"\\F1B4\";\n}\n\n.i-spotify:before {\n  content: \"\\F1BC\";\n}\n\n.i-codepen:before {\n  content: \"\\F1CB\";\n}\n\n.i-github:before {\n  content: \"\\F09B\";\n}\n\n.i-linkedin:before {\n  content: \"\\F0E1\";\n}\n\n.i-flickr:before {\n  content: \"\\F16E\";\n}\n\n.i-dribbble:before {\n  content: \"\\F17D\";\n}\n\n.i-pinterest:before {\n  content: \"\\F231\";\n}\n\n.i-map:before {\n  content: \"\\F041\";\n}\n\n.i-twitter:before {\n  content: \"\\F099\";\n}\n\n.i-facebook:before {\n  content: \"\\F09A\";\n}\n\n.i-youtube:before {\n  content: \"\\F16A\";\n}\n\n.i-instagram:before {\n  content: \"\\F16D\";\n}\n\n.i-google:before {\n  content: \"\\F1A0\";\n}\n\n.i-pocket:before {\n  content: \"\\F265\";\n}\n\n.i-reddit:before {\n  content: \"\\F281\";\n}\n\n.i-snapchat:before {\n  content: \"\\F2AC\";\n}\n\n.i-telegram:before {\n  content: \"\\F2C6\";\n}\n\n/*\r\n@package godofredoninja\r\n\r\n========================================================================\r\nMapache variables styles\r\n========================================================================\r\n*/\n\n/**\r\n* Table of Contents:\r\n*\r\n*   1. Colors\r\n*   2. Fonts\r\n*   3. Typography\r\n*   4. Header\r\n*   5. Footer\r\n*   6. Code Syntax\r\n*   7. buttons\r\n*   8. container\r\n*   9. Grid\r\n*   10. Media Query Ranges\r\n*   11. Icons\r\n*/\n\n/* 1. Colors\r\n========================================================================== */\n\n/* 2. Fonts\r\n========================================================================== */\n\n/* 3. Typography\r\n========================================================================== */\n\n/* 4. Header\r\n========================================================================== */\n\n/* 5. Entry articles\r\n========================================================================== */\n\n/* 5. Footer\r\n========================================================================== */\n\n/* 6. Code Syntax\r\n========================================================================== */\n\n/* 7. buttons\r\n========================================================================== */\n\n/* 8. container\r\n========================================================================== */\n\n/* 9. Grid\r\n========================================================================== */\n\n/* 10. Media Query Ranges\r\n========================================================================== */\n\n/* 11. icons\r\n========================================================================== */\n\n.header.toolbar-shadow {\n  -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n          box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n}\n\na.external::after,\nhr::before,\n.warning:before,\n.note:before,\n.success:before,\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after,\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.u-clear::after {\n  clear: both;\n  content: \"\";\n  display: table;\n}\n\n.u-not-avatar {\n  background-image: url(" + __webpack_require__(/*! ./../images/avatar.png */ 80) + ");\n}\n\n.u-relative {\n  position: relative;\n}\n\n.u-block {\n  display: block;\n}\n\n.u-absolute0 {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n\n.u-bg-cover {\n  background-position: center;\n  background-size: cover;\n}\n\n.u-bg-gradient {\n  background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, 0.8)));\n}\n\n.u-border-bottom-dark,\n.sidebar-title {\n  border-bottom: solid 1px #000;\n}\n\n.u-b-t {\n  border-top: solid 1px #eee;\n}\n\n.u-p-t-2 {\n  padding-top: 2rem;\n}\n\n.u-unstyled {\n  list-style-type: none;\n  margin: 0;\n  padding-left: 0;\n}\n\n.u-floatLeft {\n  float: left !important;\n}\n\n.u-floatRight {\n  float: right !important;\n}\n\n.u-flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n}\n\n.u-flex-wrap {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n\n.u-flex-center,\n.header-logo,\n.header-follow a,\n.header-menu a {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n.u-flex-aling-right {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n\n.u-flex-aling-center {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n\n.u-m-t-1 {\n  margin-top: 1rem;\n}\n\n/* Tags\r\n========================================================================== */\n\n.u-tags {\n  font-size: 12px !important;\n  margin: 3px !important;\n  color: #4c5765 !important;\n  background-color: #ebebeb !important;\n  -webkit-transition: all .3s;\n  -o-transition: all .3s;\n  transition: all .3s;\n}\n\n.u-tags::before {\n  padding-right: 5px;\n  opacity: .8;\n}\n\n.u-tags:hover {\n  background-color: #4285f4 !important;\n  color: #fff !important;\n}\n\n.u-tag {\n  background-color: #4285f4;\n  color: #fff;\n  padding: 4px 12px;\n  font-size: 11px;\n  display: inline-block;\n  text-transform: uppercase;\n}\n\n.u-hide {\n  display: none !important;\n}\n\n.u-card-shadow {\n  background-color: #fff;\n  -webkit-box-shadow: 0 5px 5px rgba(0, 0, 0, 0.02);\n          box-shadow: 0 5px 5px rgba(0, 0, 0, 0.02);\n}\n\n.u-not-image {\n  background-repeat: repeat;\n  background-size: initial !important;\n  background-color: #fff;\n}\n\n@media only screen and (max-width: 766px) {\n  .u-h-b-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  .u-h-b-lg {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  .u-h-a-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .u-h-a-lg {\n    display: none !important;\n  }\n}\n\nhtml {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  font-size: 16px;\n  -webkit-tap-highlight-color: transparent;\n}\n\n*,\n*::before,\n*::after {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\na {\n  color: #039be5;\n  outline: 0;\n  text-decoration: none;\n  -webkit-tap-highlight-color: transparent;\n}\n\na:focus {\n  text-decoration: none;\n}\n\na.external::after {\n  content: \"\\E89E\";\n  margin-left: 5px;\n}\n\nbody {\n  color: #333;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 0 auto;\n  background-color: #f5f5f5;\n}\n\nfigure {\n  margin: 0;\n}\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n}\n\nimg:not([src]) {\n  visibility: hidden;\n}\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n\ni {\n  display: inline-block;\n  vertical-align: middle;\n}\n\nhr {\n  background: #F1F2F1;\n  background: -webkit-gradient(linear, left top, right top, color-stop(0, #F1F2F1), color-stop(50%, #b5b5b5), to(#F1F2F1));\n  background: -webkit-linear-gradient(left, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  background: -o-linear-gradient(left, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  background: linear-gradient(to right, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  border: none;\n  height: 1px;\n  margin: 80px auto;\n  max-width: 90%;\n  position: relative;\n}\n\nhr::before {\n  background: #fff;\n  color: rgba(73, 55, 65, 0.75);\n  content: \"\\F121\";\n  display: block;\n  font-size: 35px;\n  left: 50%;\n  padding: 0 25px;\n  position: absolute;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n       -o-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n}\n\nblockquote {\n  border-left: 4px solid #4285f4;\n  padding: .75rem 1.5rem;\n  background: #fbfbfc;\n  color: #757575;\n  font-size: 1.125rem;\n  line-height: 1.7;\n  margin: 0 0 1.25rem;\n  quotes: none;\n}\n\nol,\nul,\nblockquote {\n  margin-left: 2rem;\n}\n\nstrong {\n  font-weight: 500;\n}\n\nsmall,\n.small {\n  font-size: 85%;\n}\n\nol {\n  padding-left: 40px;\n  list-style: decimal outside;\n}\n\nmark {\n  background-color: #fdffb6;\n}\n\n.footer,\n.main {\n  -webkit-transition: -webkit-transform .5s ease;\n  transition: -webkit-transform .5s ease;\n  -o-transition: -o-transform .5s ease;\n  transition: transform .5s ease;\n  transition: transform .5s ease, -webkit-transform .5s ease, -o-transform .5s ease;\n  z-index: 2;\n}\n\n/* Code Syntax\r\n========================================================================== */\n\nkbd,\nsamp,\ncode {\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  color: #c7254e;\n  background: #f7f7f7;\n  border-radius: 4px;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\ncode[class*=language-],\npre[class*=language-] {\n  color: #37474f;\n  line-height: 1.5;\n}\n\ncode[class*=language-] .token.comment,\npre[class*=language-] .token.comment {\n  opacity: .8;\n}\n\ncode[class*=language-].line-numbers,\npre[class*=language-].line-numbers {\n  padding-left: 58px;\n}\n\ncode[class*=language-].line-numbers::before,\npre[class*=language-].line-numbers::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  background: #F0EDEE;\n  width: 40px;\n  height: 100%;\n}\n\ncode[class*=language-] .line-numbers-rows,\npre[class*=language-] .line-numbers-rows {\n  border-right: none;\n  top: -3px;\n  left: -58px;\n}\n\ncode[class*=language-] .line-numbers-rows > span::before,\npre[class*=language-] .line-numbers-rows > span::before {\n  padding-right: 0;\n  text-align: center;\n  opacity: .8;\n}\n\npre {\n  background-color: #f7f7f7 !important;\n  padding: 1rem;\n  overflow: hidden;\n  border-radius: 4px;\n  word-wrap: normal;\n  margin: 2.5rem 0 !important;\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  position: relative;\n}\n\npre code {\n  color: #37474f;\n  text-shadow: 0 1px #fff;\n  padding: 0;\n  background: transparent;\n}\n\n/* .warning & .note & .success\r\n========================================================================== */\n\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n}\n\n.warning:before {\n  content: \"\\E002\";\n}\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n}\n\n.note:before {\n  content: \"\\E838\";\n}\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n}\n\n.success:before {\n  content: \"\\E86C\";\n  color: #00bfa5;\n}\n\n.warning,\n.note,\n.success {\n  display: block;\n  margin: 1rem 0;\n  font-size: 1rem;\n  padding: 12px 24px 12px 60px;\n  line-height: 1.5;\n}\n\n.warning a,\n.note a,\n.success a {\n  text-decoration: underline;\n  color: inherit;\n}\n\n.warning:before,\n.note:before,\n.success:before {\n  margin-left: -36px;\n  float: left;\n  font-size: 24px;\n}\n\n/* Social icon color and background\r\n========================================================================== */\n\n.c-facebook {\n  color: #3b5998;\n}\n\n.bg-facebook,\n.nav-mob-follow .i-facebook {\n  background-color: #3b5998 !important;\n}\n\n.c-twitter {\n  color: #55acee;\n}\n\n.bg-twitter,\n.nav-mob-follow .i-twitter {\n  background-color: #55acee !important;\n}\n\n.c-google {\n  color: #dd4b39;\n}\n\n.bg-google,\n.nav-mob-follow .i-google {\n  background-color: #dd4b39 !important;\n}\n\n.c-instagram {\n  color: #306088;\n}\n\n.bg-instagram,\n.nav-mob-follow .i-instagram {\n  background-color: #306088 !important;\n}\n\n.c-youtube {\n  color: #e52d27;\n}\n\n.bg-youtube,\n.nav-mob-follow .i-youtube {\n  background-color: #e52d27 !important;\n}\n\n.c-github {\n  color: #333333;\n}\n\n.bg-github,\n.nav-mob-follow .i-github {\n  background-color: #333333 !important;\n}\n\n.c-linkedin {\n  color: #007bb6;\n}\n\n.bg-linkedin,\n.nav-mob-follow .i-linkedin {\n  background-color: #007bb6 !important;\n}\n\n.c-spotify {\n  color: #2ebd59;\n}\n\n.bg-spotify,\n.nav-mob-follow .i-spotify {\n  background-color: #2ebd59 !important;\n}\n\n.c-codepen {\n  color: #222222;\n}\n\n.bg-codepen,\n.nav-mob-follow .i-codepen {\n  background-color: #222222 !important;\n}\n\n.c-behance {\n  color: #131418;\n}\n\n.bg-behance,\n.nav-mob-follow .i-behance {\n  background-color: #131418 !important;\n}\n\n.c-dribbble {\n  color: #ea4c89;\n}\n\n.bg-dribbble,\n.nav-mob-follow .i-dribbble {\n  background-color: #ea4c89 !important;\n}\n\n.c-flickr {\n  color: #0063DC;\n}\n\n.bg-flickr,\n.nav-mob-follow .i-flickr {\n  background-color: #0063DC !important;\n}\n\n.c-reddit {\n  color: orangered;\n}\n\n.bg-reddit,\n.nav-mob-follow .i-reddit {\n  background-color: orangered !important;\n}\n\n.c-pocket {\n  color: #F50057;\n}\n\n.bg-pocket,\n.nav-mob-follow .i-pocket {\n  background-color: #F50057 !important;\n}\n\n.c-pinterest {\n  color: #bd081c;\n}\n\n.bg-pinterest,\n.nav-mob-follow .i-pinterest {\n  background-color: #bd081c !important;\n}\n\n.c-feed {\n  color: orange;\n}\n\n.bg-feed,\n.nav-mob-follow .i-feed {\n  background-color: orange !important;\n}\n\n.c-telegram {\n  color: #08c;\n}\n\n.bg-telegram,\n.nav-mob-follow .i-telegram {\n  background-color: #08c !important;\n}\n\n.clear:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n/* pagination Infinite scroll\r\n========================================================================== */\n\n.mapache-load-more {\n  border: solid 1px #C3C3C3;\n  color: #7D7D7D;\n  display: block;\n  font-size: 15px;\n  height: 45px;\n  margin: 4rem auto;\n  padding: 11px 16px;\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n.mapache-load-more:hover {\n  background: #4285f4;\n  border-color: #4285f4;\n  color: #fff;\n}\n\n.pagination-nav {\n  padding: 2.5rem 0 3rem;\n  text-align: center;\n}\n\n.pagination-nav .page-number {\n  display: none;\n  padding-top: 5px;\n}\n\n@media only screen and (min-width: 766px) {\n  .pagination-nav .page-number {\n    display: inline-block;\n  }\n}\n\n.pagination-nav .newer-posts {\n  float: left;\n}\n\n.pagination-nav .older-posts {\n  float: right;\n}\n\n/* Scroll Top\r\n========================================================================== */\n\n.scroll_top {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  z-index: 11;\n  width: 60px;\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transition: opacity 0.5s ease;\n  -o-transition: opacity 0.5s ease;\n  transition: opacity 0.5s ease;\n}\n\n.scroll_top.visible {\n  opacity: 1;\n  visibility: visible;\n}\n\n.scroll_top:hover svg path {\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n.svg-icon svg {\n  width: 100%;\n  height: auto;\n  display: block;\n  fill: currentcolor;\n}\n\n/* Video Responsive\r\n========================================================================== */\n\n.video-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n  padding-bottom: 56.25%;\n  margin-bottom: 1.5rem;\n}\n\n.video-responsive iframe {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  border: 0;\n}\n\n/* Video full for tag video\r\n========================================================================== */\n\n#video-format .video-content {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding-bottom: 1rem;\n}\n\n#video-format .video-content span {\n  display: inline-block;\n  vertical-align: middle;\n  margin-right: .8rem;\n}\n\n/* Page error 404\r\n========================================================================== */\n\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n  height: 100vh;\n  position: relative;\n  width: 100%;\n}\n\n.errorPage-title {\n  padding: 24px 60px;\n}\n\n.errorPage-link {\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 22px;\n  font-weight: 500;\n  left: -5px;\n  position: relative;\n  text-rendering: optimizeLegibility;\n  top: -6px;\n}\n\n.errorPage-emoji {\n  color: rgba(0, 0, 0, 0.4);\n  font-size: 150px;\n}\n\n.errorPage-text {\n  color: rgba(0, 0, 0, 0.4);\n  line-height: 21px;\n  margin-top: 60px;\n  white-space: pre-wrap;\n}\n\n.errorPage-wrap {\n  display: block;\n  left: 50%;\n  min-width: 680px;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n       -o-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n}\n\n/* Post Twitter facebook card embed Css Center\r\n========================================================================== */\n\n.post iframe[src*=\"facebook.com\"],\n.post .fb-post,\n.post .twitter-tweet {\n  display: block !important;\n  margin: 1.5rem 0 !important;\n}\n\n.container {\n  margin: 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n  width: 100%;\n  max-width: 1250px;\n}\n\n.margin-top {\n  margin-top: 50px;\n  padding-top: 1rem;\n}\n\n@media only screen and (min-width: 766px) {\n  .margin-top {\n    padding-top: 1.8rem;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  .content {\n    -ms-flex-preferred-size: 69.66666667% !important;\n        flex-basis: 69.66666667% !important;\n    max-width: 69.66666667% !important;\n  }\n\n  .sidebar {\n    -ms-flex-preferred-size: 30.33333333% !important;\n        flex-basis: 30.33333333% !important;\n    max-width: 30.33333333% !important;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  .content {\n    padding-right: 40px !important;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .feed-entry-wrapper .entry-image {\n    width: 40% !important;\n    max-width: 40% !important;\n  }\n\n  .feed-entry-wrapper .entry-body {\n    width: 60% !important;\n    max-width: 60% !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  body.is-article .content {\n    max-width: 100% !important;\n  }\n}\n\n.row {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 0;\n      -ms-flex: 0 1 auto;\n          flex: 0 1 auto;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-flow: row wrap;\n          flex-flow: row wrap;\n  margin-left: -0.9375rem;\n  margin-right: -0.9375rem;\n}\n\n.row .col {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n}\n\n.row .col.s1 {\n  -ms-flex-preferred-size: 8.33333%;\n      flex-basis: 8.33333%;\n  max-width: 8.33333%;\n}\n\n.row .col.s2 {\n  -ms-flex-preferred-size: 16.66667%;\n      flex-basis: 16.66667%;\n  max-width: 16.66667%;\n}\n\n.row .col.s3 {\n  -ms-flex-preferred-size: 25%;\n      flex-basis: 25%;\n  max-width: 25%;\n}\n\n.row .col.s4 {\n  -ms-flex-preferred-size: 33.33333%;\n      flex-basis: 33.33333%;\n  max-width: 33.33333%;\n}\n\n.row .col.s5 {\n  -ms-flex-preferred-size: 41.66667%;\n      flex-basis: 41.66667%;\n  max-width: 41.66667%;\n}\n\n.row .col.s6 {\n  -ms-flex-preferred-size: 50%;\n      flex-basis: 50%;\n  max-width: 50%;\n}\n\n.row .col.s7 {\n  -ms-flex-preferred-size: 58.33333%;\n      flex-basis: 58.33333%;\n  max-width: 58.33333%;\n}\n\n.row .col.s8 {\n  -ms-flex-preferred-size: 66.66667%;\n      flex-basis: 66.66667%;\n  max-width: 66.66667%;\n}\n\n.row .col.s9 {\n  -ms-flex-preferred-size: 75%;\n      flex-basis: 75%;\n  max-width: 75%;\n}\n\n.row .col.s10 {\n  -ms-flex-preferred-size: 83.33333%;\n      flex-basis: 83.33333%;\n  max-width: 83.33333%;\n}\n\n.row .col.s11 {\n  -ms-flex-preferred-size: 91.66667%;\n      flex-basis: 91.66667%;\n  max-width: 91.66667%;\n}\n\n.row .col.s12 {\n  -ms-flex-preferred-size: 100%;\n      flex-basis: 100%;\n  max-width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  .row .col.m1 {\n    -ms-flex-preferred-size: 8.33333%;\n        flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  .row .col.m2 {\n    -ms-flex-preferred-size: 16.66667%;\n        flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  .row .col.m3 {\n    -ms-flex-preferred-size: 25%;\n        flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .row .col.m4 {\n    -ms-flex-preferred-size: 33.33333%;\n        flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  .row .col.m5 {\n    -ms-flex-preferred-size: 41.66667%;\n        flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  .row .col.m6 {\n    -ms-flex-preferred-size: 50%;\n        flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .row .col.m7 {\n    -ms-flex-preferred-size: 58.33333%;\n        flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  .row .col.m8 {\n    -ms-flex-preferred-size: 66.66667%;\n        flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  .row .col.m9 {\n    -ms-flex-preferred-size: 75%;\n        flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .row .col.m10 {\n    -ms-flex-preferred-size: 83.33333%;\n        flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  .row .col.m11 {\n    -ms-flex-preferred-size: 91.66667%;\n        flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  .row .col.m12 {\n    -ms-flex-preferred-size: 100%;\n        flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .row .col.l1 {\n    -ms-flex-preferred-size: 8.33333%;\n        flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  .row .col.l2 {\n    -ms-flex-preferred-size: 16.66667%;\n        flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  .row .col.l3 {\n    -ms-flex-preferred-size: 25%;\n        flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .row .col.l4 {\n    -ms-flex-preferred-size: 33.33333%;\n        flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  .row .col.l5 {\n    -ms-flex-preferred-size: 41.66667%;\n        flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  .row .col.l6 {\n    -ms-flex-preferred-size: 50%;\n        flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .row .col.l7 {\n    -ms-flex-preferred-size: 58.33333%;\n        flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  .row .col.l8 {\n    -ms-flex-preferred-size: 66.66667%;\n        flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  .row .col.l9 {\n    -ms-flex-preferred-size: 75%;\n        flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .row .col.l10 {\n    -ms-flex-preferred-size: 83.33333%;\n        flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  .row .col.l11 {\n    -ms-flex-preferred-size: 91.66667%;\n        flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  .row .col.l12 {\n    -ms-flex-preferred-size: 100%;\n        flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\n.h1,\n.h2,\n.h3,\n.h4,\n.h5,\n.h6 {\n  margin-bottom: 0.5rem;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: 700;\n  line-height: 1.1;\n  color: inherit;\n}\n\nh1 {\n  font-size: 2.25rem;\n}\n\nh2 {\n  font-size: 1.875rem;\n}\n\nh3 {\n  font-size: 1.5625rem;\n}\n\nh4 {\n  font-size: 1.375rem;\n}\n\nh5 {\n  font-size: 1.125rem;\n}\n\nh6 {\n  font-size: 1rem;\n}\n\n.h1 {\n  font-size: 2.25rem;\n}\n\n.h2 {\n  font-size: 1.875rem;\n}\n\n.h3 {\n  font-size: 1.5625rem;\n}\n\n.h4 {\n  font-size: 1.375rem;\n}\n\n.h5 {\n  font-size: 1.125rem;\n}\n\n.h6 {\n  font-size: 1rem;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  margin-bottom: 1rem;\n}\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  color: inherit;\n  line-height: inherit;\n}\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\n\n/* Navigation Mobile\r\n========================================================================== */\n\n.nav-mob {\n  background: #4285f4;\n  color: #000;\n  height: 100vh;\n  left: 0;\n  padding: 0 20px;\n  position: fixed;\n  right: 0;\n  top: 0;\n  -webkit-transform: translateX(100%);\n       -o-transform: translateX(100%);\n          transform: translateX(100%);\n  -webkit-transition: .4s;\n  -o-transition: .4s;\n  transition: .4s;\n  will-change: transform;\n  z-index: 997;\n}\n\n.nav-mob a {\n  color: inherit;\n}\n\n.nav-mob ul a {\n  display: block;\n  font-weight: 500;\n  padding: 8px 0;\n  text-transform: uppercase;\n  font-size: 14px;\n}\n\n.nav-mob-content {\n  background: #eee;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  bottom: 0;\n  left: 0;\n  padding: 20px 0;\n  position: absolute;\n  right: 0;\n  top: 50px;\n}\n\n.nav-mob ul,\n.nav-mob-subscribe,\n.nav-mob-follow {\n  border-bottom: solid 1px #DDD;\n  padding: 0 0.9375rem 20px 0.9375rem;\n  margin-bottom: 15px;\n}\n\n/* Navigation Mobile follow\r\n========================================================================== */\n\n.nav-mob-follow a {\n  font-size: 20px !important;\n  margin: 0 2px !important;\n  padding: 0;\n}\n\n.nav-mob-follow .i-facebook {\n  color: #fff;\n}\n\n.nav-mob-follow .i-twitter {\n  color: #fff;\n}\n\n.nav-mob-follow .i-google {\n  color: #fff;\n}\n\n.nav-mob-follow .i-instagram {\n  color: #fff;\n}\n\n.nav-mob-follow .i-youtube {\n  color: #fff;\n}\n\n.nav-mob-follow .i-github {\n  color: #fff;\n}\n\n.nav-mob-follow .i-linkedin {\n  color: #fff;\n}\n\n.nav-mob-follow .i-spotify {\n  color: #fff;\n}\n\n.nav-mob-follow .i-codepen {\n  color: #fff;\n}\n\n.nav-mob-follow .i-behance {\n  color: #fff;\n}\n\n.nav-mob-follow .i-dribbble {\n  color: #fff;\n}\n\n.nav-mob-follow .i-flickr {\n  color: #fff;\n}\n\n.nav-mob-follow .i-reddit {\n  color: #fff;\n}\n\n.nav-mob-follow .i-pocket {\n  color: #fff;\n}\n\n.nav-mob-follow .i-pinterest {\n  color: #fff;\n}\n\n.nav-mob-follow .i-feed {\n  color: #fff;\n}\n\n.nav-mob-follow .i-telegram {\n  color: #fff;\n}\n\n/* CopyRigh\r\n========================================================================== */\n\n.nav-mob-copyright {\n  color: #aaa;\n  font-size: 13px;\n  padding: 20px 15px 0;\n  text-align: center;\n  width: 100%;\n}\n\n.nav-mob-copyright a {\n  color: #4285f4;\n}\n\n/* subscribe\r\n========================================================================== */\n\n.nav-mob-subscribe .btn,\n.nav-mob-subscribe .nav-mob-follow a,\n.nav-mob-follow .nav-mob-subscribe a {\n  border-radius: 0;\n  text-transform: none;\n  width: 80px;\n}\n\n.nav-mob-subscribe .form-group {\n  width: calc(100% - 80px);\n}\n\n.nav-mob-subscribe input {\n  border: 0;\n  -webkit-box-shadow: none !important;\n          box-shadow: none !important;\n}\n\n/* Header Page\r\n========================================================================== */\n\n.header {\n  background: #4285f4;\n  height: 50px;\n  left: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: 999;\n}\n\n.header-wrap a {\n  color: #fff;\n}\n\n.header-logo,\n.header-follow a,\n.header-menu a {\n  height: 50px;\n}\n\n.header-follow,\n.header-search,\n.header-logo {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n}\n\n.header-logo {\n  z-index: 998;\n  font-size: 1.25rem;\n  font-weight: 500;\n  letter-spacing: 1px;\n}\n\n.header-logo img {\n  max-height: 35px;\n  position: relative;\n}\n\n.header .nav-mob-toggle,\n.header .search-mob-toggle {\n  padding: 0;\n  z-index: 998;\n}\n\n.header .nav-mob-toggle {\n  margin-left: 0 !important;\n  margin-right: -0.9375rem;\n  position: relative;\n  -webkit-transition: -webkit-transform .4s;\n  transition: -webkit-transform .4s;\n  -o-transition: -o-transform .4s;\n  transition: transform .4s;\n  transition: transform .4s, -webkit-transform .4s, -o-transform .4s;\n}\n\n.header .nav-mob-toggle span {\n  background-color: #fff;\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  -webkit-transition: .4s;\n  -o-transition: .4s;\n  transition: .4s;\n  width: 20px;\n}\n\n.header .nav-mob-toggle span:first-child {\n  -webkit-transform: translate(0, -6px);\n       -o-transform: translate(0, -6px);\n          transform: translate(0, -6px);\n}\n\n.header .nav-mob-toggle span:last-child {\n  -webkit-transform: translate(0, 6px);\n       -o-transform: translate(0, 6px);\n          transform: translate(0, 6px);\n}\n\n.header:not(.toolbar-shadow) {\n  background-color: transparent !important;\n}\n\n/* Header Navigation\r\n========================================================================== */\n\n.header-menu {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 0px;\n          flex: 1 1 0;\n  overflow: hidden;\n  -webkit-transition: margin .2s,width .2s,-webkit-box-flex .2s;\n  transition: margin .2s,width .2s,-webkit-box-flex .2s;\n  -o-transition: flex .2s,margin .2s,width .2s;\n  transition: flex .2s,margin .2s,width .2s;\n  transition: flex .2s,margin .2s,width .2s,-webkit-box-flex .2s,-ms-flex .2s;\n}\n\n.header-menu ul {\n  margin-left: 2rem;\n  white-space: nowrap;\n}\n\n.header-menu ul li {\n  padding-right: 15px;\n  display: inline-block;\n}\n\n.header-menu ul a {\n  padding: 0 8px;\n  position: relative;\n}\n\n.header-menu ul a:before {\n  background: #fff;\n  bottom: 0;\n  content: '';\n  height: 2px;\n  left: 0;\n  opacity: 0;\n  position: absolute;\n  -webkit-transition: opacity .2s;\n  -o-transition: opacity .2s;\n  transition: opacity .2s;\n  width: 100%;\n}\n\n.header-menu ul a:hover:before,\n.header-menu ul a.active:before {\n  opacity: 1;\n}\n\n/* header social\r\n========================================================================== */\n\n.header-follow a {\n  padding: 0 10px;\n}\n\n.header-follow a:hover {\n  color: rgba(255, 255, 255, 0.8);\n}\n\n.header-follow a:before {\n  font-size: 1.25rem !important;\n}\n\n/* Header search\r\n========================================================================== */\n\n.header-search {\n  background: #eee;\n  border-radius: 2px;\n  display: none;\n  height: 36px;\n  position: relative;\n  text-align: left;\n  -webkit-transition: background .2s,-webkit-box-flex .2s;\n  transition: background .2s,-webkit-box-flex .2s;\n  -o-transition: background .2s,flex .2s;\n  transition: background .2s,flex .2s;\n  transition: background .2s,flex .2s,-webkit-box-flex .2s,-ms-flex .2s;\n  vertical-align: top;\n  margin-left: 1.5rem;\n  margin-right: 1.5rem;\n}\n\n.header-search .search-icon {\n  color: #757575;\n  font-size: 24px;\n  left: 24px;\n  position: absolute;\n  top: 12px;\n  -webkit-transition: color .2s;\n  -o-transition: color .2s;\n  transition: color .2s;\n}\n\ninput.search-field {\n  background: 0;\n  border: 0;\n  color: #212121;\n  height: 36px;\n  padding: 0 8px 0 72px;\n  -webkit-transition: color .2s;\n  -o-transition: color .2s;\n  transition: color .2s;\n  width: 100%;\n}\n\ninput.search-field:focus {\n  border: 0;\n  outline: none;\n}\n\n.search-popout {\n  background: #fff;\n  -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24), inset 0 4px 6px -4px rgba(0, 0, 0, 0.24);\n          box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24), inset 0 4px 6px -4px rgba(0, 0, 0, 0.24);\n  margin-top: 10px;\n  max-height: calc(100vh - 150px);\n  margin-left: -64px;\n  overflow-y: auto;\n  position: absolute;\n  z-index: -1;\n}\n\n.search-popout.closed {\n  visibility: hidden;\n}\n\n.search-suggest-results {\n  padding: 0 8px 0 75px;\n}\n\n.search-suggest-results a {\n  color: #212121;\n  display: block;\n  margin-left: -8px;\n  outline: 0;\n  height: auto;\n  padding: 8px;\n  -webkit-transition: background .2s;\n  -o-transition: background .2s;\n  transition: background .2s;\n  font-size: 0.875rem;\n}\n\n.search-suggest-results a:first-child {\n  margin-top: 10px;\n}\n\n.search-suggest-results a:last-child {\n  margin-bottom: 10px;\n}\n\n.search-suggest-results a:hover {\n  background: #f7f7f7;\n}\n\n/* mediaquery medium\r\n========================================================================== */\n\n@media only screen and (min-width: 992px) {\n  .header-search {\n    background: rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.12);\n            box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.12);\n    color: #fff;\n    display: inline-block;\n    width: 200px;\n  }\n\n  .header-search:hover {\n    background: rgba(255, 255, 255, 0.4);\n  }\n\n  .header-search .search-icon {\n    top: 0px;\n  }\n\n  .header-search input,\n  .header-search input::-webkit-input-placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .header-search input,\n  .header-search input:-ms-input-placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .header-search input,\n  .header-search input::-ms-input-placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .header-search input,\n  .header-search input::placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .search-popout {\n    width: 100%;\n    margin-left: 0;\n  }\n\n  .header.is-showSearch .header-search {\n    background: #fff;\n    -webkit-box-flex: 1;\n        -ms-flex: 1 0 auto;\n            flex: 1 0 auto;\n  }\n\n  .header.is-showSearch .header-search .search-icon {\n    color: #757575 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input::-webkit-input-placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input:-ms-input-placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input::-ms-input-placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input::placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-menu {\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto;\n    margin: 0;\n    visibility: hidden;\n    width: 0;\n  }\n}\n\n/* Media Query\r\n========================================================================== */\n\n@media only screen and (max-width: 992px) {\n  .header-menu ul {\n    display: none;\n  }\n\n  .header.is-showSearchMob {\n    padding: 0;\n  }\n\n  .header.is-showSearchMob .header-logo,\n  .header.is-showSearchMob .nav-mob-toggle {\n    display: none;\n  }\n\n  .header.is-showSearchMob .header-search {\n    border-radius: 0;\n    display: inline-block !important;\n    height: 50px;\n    margin: 0;\n    width: 100%;\n  }\n\n  .header.is-showSearchMob .header-search input {\n    height: 50px;\n    padding-right: 48px;\n  }\n\n  .header.is-showSearchMob .header-search .search-popout {\n    margin-top: 0;\n  }\n\n  .header.is-showSearchMob .search-mob-toggle {\n    border: 0;\n    color: #757575;\n    position: absolute;\n    right: 0;\n  }\n\n  .header.is-showSearchMob .search-mob-toggle:before {\n    content: \"\\E5CD\" !important;\n  }\n\n  body.is-showNavMob {\n    overflow: hidden;\n  }\n\n  body.is-showNavMob .nav-mob {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle {\n    border: 0;\n    -webkit-transform: rotate(90deg);\n         -o-transform: rotate(90deg);\n            transform: rotate(90deg);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:first-child {\n    -webkit-transform: rotate(45deg) translate(0, 0);\n         -o-transform: rotate(45deg) translate(0, 0);\n            transform: rotate(45deg) translate(0, 0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:nth-child(2) {\n    -webkit-transform: scaleX(0);\n         -o-transform: scaleX(0);\n            transform: scaleX(0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:last-child {\n    -webkit-transform: rotate(-45deg) translate(0, 0);\n         -o-transform: rotate(-45deg) translate(0, 0);\n            transform: rotate(-45deg) translate(0, 0);\n  }\n\n  body.is-showNavMob .search-mob-toggle {\n    display: none;\n  }\n\n  body.is-showNavMob .main,\n  body.is-showNavMob .footer {\n    -webkit-transform: translateX(-25%);\n         -o-transform: translateX(-25%);\n            transform: translateX(-25%);\n  }\n}\n\n.cover {\n  background: #4285f4;\n  -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n          box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n  color: #fff;\n  letter-spacing: .2px;\n  min-height: 550px;\n  position: relative;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n  z-index: 2;\n}\n\n.cover-wrap {\n  margin: 0 auto;\n  max-width: 1050px;\n  padding: 16px;\n  position: relative;\n  text-align: center;\n  z-index: 99;\n}\n\n.cover-title {\n  font-size: 3.5rem;\n  margin: 0 0 50px;\n  line-height: 1;\n  font-weight: 700;\n}\n\n.cover-description {\n  max-width: 600px;\n}\n\n.cover-background {\n  background-attachment: fixed;\n}\n\n.cover .mouse {\n  width: 25px;\n  position: absolute;\n  height: 36px;\n  border-radius: 15px;\n  border: 2px solid #888;\n  border: 2px solid rgba(255, 255, 255, 0.27);\n  bottom: 40px;\n  right: 40px;\n  margin-left: -12px;\n  cursor: pointer;\n  -webkit-transition: border-color 0.2s ease-in;\n  -o-transition: border-color 0.2s ease-in;\n  transition: border-color 0.2s ease-in;\n}\n\n.cover .mouse .scroll {\n  display: block;\n  margin: 6px auto;\n  width: 3px;\n  height: 6px;\n  border-radius: 4px;\n  background: rgba(255, 255, 255, 0.68);\n  -webkit-animation-duration: 2s;\n       -o-animation-duration: 2s;\n          animation-duration: 2s;\n  -webkit-animation-name: scroll;\n       -o-animation-name: scroll;\n          animation-name: scroll;\n  -webkit-animation-iteration-count: infinite;\n       -o-animation-iteration-count: infinite;\n          animation-iteration-count: infinite;\n}\n\n.author a {\n  color: #FFF !important;\n}\n\n.author-header {\n  margin-top: 10%;\n}\n\n.author-name-wrap {\n  display: inline-block;\n}\n\n.author-title {\n  display: block;\n  text-transform: uppercase;\n}\n\n.author-name {\n  margin: 5px 0;\n  font-size: 1.75rem;\n}\n\n.author-bio {\n  margin: 1.5rem 0;\n  line-height: 1.8;\n  font-size: 18px;\n  max-width: 700px;\n}\n\n.author-avatar {\n  display: inline-block;\n  border-radius: 90px;\n  margin-right: 10px;\n  width: 80px;\n  height: 80px;\n  background-size: cover;\n  background-position: center;\n  vertical-align: bottom;\n}\n\n.author-meta {\n  margin-bottom: 20px;\n}\n\n.author-meta span {\n  display: inline-block;\n  font-size: 17px;\n  font-style: italic;\n  margin: 0 2rem 1rem 0;\n  opacity: 0.8;\n  word-wrap: break-word;\n}\n\n.author .author-link:hover {\n  opacity: 1;\n}\n\n.author-follow a {\n  border-radius: 3px;\n  -webkit-box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  cursor: pointer;\n  display: inline-block;\n  height: 40px;\n  letter-spacing: 1px;\n  line-height: 40px;\n  margin: 0 10px;\n  padding: 0 16px;\n  text-shadow: none;\n  text-transform: uppercase;\n}\n\n.author-follow a:hover {\n  -webkit-box-shadow: inset 0 0 0 2px #fff;\n          box-shadow: inset 0 0 0 2px #fff;\n}\n\n.home-down {\n  -webkit-animation-duration: 1.2s !important;\n       -o-animation-duration: 1.2s !important;\n          animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100;\n}\n\n@media only screen and (min-width: 766px) {\n  .cover-description {\n    font-size: 1.25rem;\n  }\n}\n\n@media only screen and (max-width: 766px) {\n  .cover {\n    padding-top: 50px;\n    padding-bottom: 20px;\n  }\n\n  .cover-title {\n    font-size: 2rem;\n  }\n\n  .author-avatar {\n    display: block;\n    margin: 0 auto 10px auto;\n  }\n}\n\n.feed-entry-content .feed-entry-wrapper:last-child .entry:last-child {\n  padding: 0;\n  border: none;\n}\n\n.entry {\n  margin-bottom: 1.5rem;\n  padding: 0 15px 15px;\n}\n\n.entry-image--link {\n  height: 180px;\n  margin: 0 -15px;\n  overflow: hidden;\n}\n\n.entry-image--link:hover .entry-image--bg {\n  -webkit-transform: scale(1.03);\n       -o-transform: scale(1.03);\n          transform: scale(1.03);\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n}\n\n.entry-image--bg {\n  -webkit-transition: -webkit-transform 0.3s;\n  transition: -webkit-transform 0.3s;\n  -o-transition: -o-transform 0.3s;\n  transition: transform 0.3s;\n  transition: transform 0.3s, -webkit-transform 0.3s, -o-transform 0.3s;\n}\n\n.entry-video-play {\n  border-radius: 50%;\n  border: 2px solid #fff;\n  color: #fff;\n  font-size: 3.5rem;\n  height: 65px;\n  left: 50%;\n  line-height: 65px;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n       -o-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  width: 65px;\n  z-index: 10;\n}\n\n.entry-category {\n  margin-bottom: 5px;\n  text-transform: capitalize;\n  font-size: 0.875rem;\n  line-height: 1;\n}\n\n.entry-category a:active {\n  text-decoration: underline;\n}\n\n.entry-title {\n  color: #000;\n  font-size: 1.25rem;\n  height: auto;\n  line-height: 1.2;\n  margin: 0 0 .5rem;\n  padding: 0;\n}\n\n.entry-title:hover {\n  color: #777;\n}\n\n.entry-byline {\n  margin-top: 0;\n  margin-bottom: 0.5rem;\n  color: #999;\n  font-size: 0.8125rem;\n}\n\n.entry-byline a {\n  color: inherit;\n}\n\n.entry-byline a:hover {\n  color: #333;\n}\n\n.entry-body {\n  padding-top: 20px;\n}\n\n/* Entry small --small\r\n========================================================================== */\n\n.entry.entry--small {\n  margin-bottom: 24px;\n  padding: 0;\n}\n\n.entry.entry--small .entry-image {\n  margin-bottom: 10px;\n}\n\n.entry.entry--small .entry-image--link {\n  height: 170px;\n  margin: 0;\n}\n\n.entry.entry--small .entry-title {\n  font-size: 1rem;\n  font-weight: 500;\n  line-height: 1.2;\n  text-transform: capitalize;\n}\n\n.entry.entry--small .entry-byline {\n  margin: 0;\n}\n\n@media only screen and (min-width: 992px) {\n  .entry {\n    margin-bottom: 40px;\n    padding: 0;\n  }\n\n  .entry-title {\n    font-size: 21px;\n  }\n\n  .entry-body {\n    padding-right: 35px !important;\n  }\n\n  .entry-image {\n    margin-bottom: 0;\n  }\n\n  .entry-image--link {\n    height: 180px;\n    margin: 0;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  .entry-image--link {\n    height: 218px;\n  }\n}\n\n.footer {\n  color: rgba(0, 0, 0, 0.44);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1;\n  padding: 1.6rem 15px;\n  text-align: center;\n}\n\n.footer a {\n  color: rgba(0, 0, 0, 0.6);\n}\n\n.footer a:hover {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n.footer-wrap {\n  margin: 0 auto;\n  max-width: 1400px;\n}\n\n.footer .heart {\n  -webkit-animation: heartify .5s infinite alternate;\n       -o-animation: heartify .5s infinite alternate;\n          animation: heartify .5s infinite alternate;\n  color: red;\n}\n\n.footer-copy,\n.footer-design-author {\n  display: inline-block;\n  padding: .5rem 0;\n  vertical-align: middle;\n}\n\n.footer-follow {\n  padding: 20px 0;\n}\n\n.footer-follow a {\n  font-size: 20px;\n  margin: 0 5px;\n  color: rgba(0, 0, 0, 0.8);\n}\n\n@-webkit-keyframes heartify {\n  0% {\n    -webkit-transform: scale(0.8);\n            transform: scale(0.8);\n  }\n}\n\n@-o-keyframes heartify {\n  0% {\n    -o-transform: scale(0.8);\n       transform: scale(0.8);\n  }\n}\n\n@keyframes heartify {\n  0% {\n    -webkit-transform: scale(0.8);\n         -o-transform: scale(0.8);\n            transform: scale(0.8);\n  }\n}\n\n.btn,\n.nav-mob-follow a {\n  background-color: #fff;\n  border-radius: 2px;\n  border: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #039be5;\n  cursor: pointer;\n  display: inline-block;\n  font: 500 14px/20px \"Roboto\", sans-serif;\n  height: 36px;\n  margin: 0;\n  min-width: 36px;\n  outline: 0;\n  overflow: hidden;\n  padding: 8px;\n  text-align: center;\n  text-decoration: none;\n  text-overflow: ellipsis;\n  text-transform: uppercase;\n  -webkit-transition: background-color .2s,-webkit-box-shadow .2s;\n  transition: background-color .2s,-webkit-box-shadow .2s;\n  -o-transition: background-color .2s,box-shadow .2s;\n  transition: background-color .2s,box-shadow .2s;\n  transition: background-color .2s,box-shadow .2s,-webkit-box-shadow .2s;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n.btn + .btn,\n.nav-mob-follow a + .btn,\n.nav-mob-follow .btn + a,\n.nav-mob-follow a + a {\n  margin-left: 8px;\n}\n\n.btn:focus,\n.nav-mob-follow a:focus,\n.btn:hover,\n.nav-mob-follow a:hover {\n  background-color: #e1f3fc;\n  text-decoration: none !important;\n}\n\n.btn:active,\n.nav-mob-follow a:active {\n  background-color: #c3e7f9;\n}\n\n.btn.btn-lg,\n.nav-mob-follow a.btn-lg {\n  font-size: 1.5rem;\n  min-width: 48px;\n  height: 48px;\n  line-height: 48px;\n}\n\n.btn.btn-flat,\n.nav-mob-follow a.btn-flat {\n  background: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.btn.btn-flat:focus,\n.nav-mob-follow a.btn-flat:focus,\n.btn.btn-flat:hover,\n.nav-mob-follow a.btn-flat:hover,\n.btn.btn-flat:active,\n.nav-mob-follow a.btn-flat:active {\n  background: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.btn.btn-primary,\n.nav-mob-follow a.btn-primary {\n  background-color: #4285f4;\n  color: #fff;\n}\n\n.btn.btn-primary:hover,\n.nav-mob-follow a.btn-primary:hover {\n  background-color: #2f79f3;\n}\n\n.btn.btn-circle,\n.nav-mob-follow a.btn-circle {\n  border-radius: 50%;\n  height: 40px;\n  line-height: 40px;\n  padding: 0;\n  width: 40px;\n}\n\n.btn.btn-circle-small,\n.nav-mob-follow a.btn-circle-small {\n  border-radius: 50%;\n  height: 32px;\n  line-height: 32px;\n  padding: 0;\n  width: 32px;\n  min-width: 32px;\n}\n\n.btn.btn-shadow,\n.nav-mob-follow a.btn-shadow {\n  -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);\n          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);\n  color: #333;\n  background-color: #eee;\n}\n\n.btn.btn-shadow:hover,\n.nav-mob-follow a.btn-shadow:hover {\n  background-color: rgba(0, 0, 0, 0.12);\n}\n\n.btn.btn-download-cloud,\n.nav-mob-follow a.btn-download-cloud,\n.btn.btn-download,\n.nav-mob-follow a.btn-download {\n  background-color: #4285f4;\n  color: #fff;\n}\n\n.btn.btn-download-cloud:hover,\n.nav-mob-follow a.btn-download-cloud:hover,\n.btn.btn-download:hover,\n.nav-mob-follow a.btn-download:hover {\n  background-color: #1b6cf2;\n}\n\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after,\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  margin-left: 5px;\n  font-size: 1.1rem;\n  display: inline-block;\n  vertical-align: top;\n}\n\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  content: \"\\E900\";\n}\n\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after {\n  content: \"\\E2C0\";\n}\n\n.btn.external:after,\n.nav-mob-follow a.external:after {\n  font-size: 1rem;\n}\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n}\n\n.form-control {\n  width: 100%;\n  padding: 8px 12px;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 0px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  -webkit-transition: border-color ease-in-out 0.15s,-webkit-box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s,-webkit-box-shadow ease-in-out 0.15s;\n  -o-transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s,-webkit-box-shadow ease-in-out 0.15s;\n  height: 36px;\n}\n\n.form-control:focus {\n  border-color: #4285f4;\n  outline: 0;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(66, 133, 244, 0.6);\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(66, 133, 244, 0.6);\n}\n\n.btn-subscribe-home {\n  background-color: transparent;\n  border-radius: 3px;\n  -webkit-box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #ffffff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  max-width: 300px;\n  padding: 15px 10px;\n  -webkit-transition: all 0.3s;\n  -o-transition: all 0.3s;\n  transition: all 0.3s;\n  width: 100%;\n}\n\n.btn-subscribe-home:hover {\n  -webkit-box-shadow: inset 0 0 0 2px #fff;\n          box-shadow: inset 0 0 0 2px #fff;\n}\n\n/*  Post\r\n========================================================================== */\n\n.post-wrapper {\n  margin-top: 50px;\n  padding-top: 1.8rem;\n}\n\n.post-header {\n  margin-bottom: 1.2rem;\n}\n\n.post-title {\n  color: #000;\n  font-size: 2.5rem;\n  height: auto;\n  line-height: 1.04;\n  margin: 0 0 0.9375rem;\n  letter-spacing: -.028em !important;\n  padding: 0;\n}\n\n.post-excerpt {\n  line-height: 1.3em;\n  font-size: 20px;\n  color: #7D7D7D;\n  margin-bottom: 8px;\n}\n\n.post-image {\n  margin-bottom: 30px;\n  overflow: hidden;\n}\n\n.post-body {\n  margin-bottom: 2rem;\n}\n\n.post-body a:focus {\n  text-decoration: underline;\n}\n\n.post-body h2 {\n  font-weight: 500;\n  margin: 2.50rem 0 1.25rem;\n  padding-bottom: 3px;\n}\n\n.post-body h3,\n.post-body h4 {\n  margin: 32px 0 16px;\n}\n\n.post-body iframe {\n  display: block !important;\n  margin: 0 auto 1.5rem 0 !important;\n}\n\n.post-body img {\n  display: block;\n  margin-bottom: 1rem;\n}\n\n.post-body h2 a,\n.post-body h3 a,\n.post-body h4 a {\n  color: #4285f4;\n}\n\n.post-tags {\n  margin: 1.25rem 0;\n}\n\n.post-card {\n  padding: 15px;\n}\n\n/* Post author by line top (author - time - tag - sahre)\r\n========================================================================== */\n\n.post-byline {\n  color: #999;\n  font-size: 14px;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  letter-spacing: -.028em !important;\n}\n\n.post-byline a {\n  color: inherit;\n}\n\n.post-byline a:active {\n  text-decoration: underline;\n}\n\n.post-byline a:hover {\n  color: #222;\n}\n\n.post-actions--top .share {\n  margin-right: 10px;\n  font-size: 20px;\n}\n\n.post-actions--top .share:hover {\n  opacity: .7;\n}\n\n.post-action-comments {\n  color: #999;\n  margin-right: 15px;\n  font-size: 14px;\n}\n\n/* Post Action social media\r\n========================================================================== */\n\n.post-actions {\n  position: relative;\n  margin-bottom: 1.5rem;\n}\n\n.post-actions a {\n  color: #fff;\n  font-size: 1.125rem;\n}\n\n.post-actions a:hover {\n  background-color: #000 !important;\n}\n\n.post-actions li {\n  margin-left: 6px;\n}\n\n.post-actions li:first-child {\n  margin-left: 0 !important;\n}\n\n.post-actions .btn,\n.post-actions .nav-mob-follow a,\n.nav-mob-follow .post-actions a {\n  border-radius: 0;\n}\n\n/* Post author widget bottom\r\n========================================================================== */\n\n.post-author {\n  position: relative;\n  font-size: 15px;\n  padding: 30px 0 30px 100px;\n  margin-bottom: 3rem;\n  background-color: #f3f5f6;\n}\n\n.post-author h5 {\n  color: #AAA;\n  font-size: 12px;\n  line-height: 1.5;\n  margin: 0;\n  font-weight: 500;\n}\n\n.post-author li {\n  margin-left: 30px;\n  font-size: 14px;\n}\n\n.post-author li a {\n  color: #555;\n}\n\n.post-author li a:hover {\n  color: #000;\n}\n\n.post-author li:first-child {\n  margin-left: 0;\n}\n\n.post-author-bio {\n  max-width: 500px;\n}\n\n.post-author .post-author-avatar {\n  height: 64px;\n  width: 64px;\n  position: absolute;\n  left: 20px;\n  top: 30px;\n  background-position: center center;\n  background-size: cover;\n  border-radius: 50%;\n}\n\n/* bottom share and bottom subscribe\r\n========================================================================== */\n\n.share-subscribe {\n  margin-bottom: 1rem;\n}\n\n.share-subscribe p {\n  color: #7d7d7d;\n  margin-bottom: 1rem;\n  line-height: 1;\n  font-size: 0.875rem;\n}\n\n.share-subscribe .social-share {\n  float: none !important;\n}\n\n.share-subscribe > div {\n  position: relative;\n  overflow: hidden;\n  margin-bottom: 15px;\n}\n\n.share-subscribe > div:before {\n  content: \" \";\n  border-top: solid 1px #000;\n  position: absolute;\n  top: 0;\n  left: 15px;\n  width: 40px;\n  height: 1px;\n}\n\n.share-subscribe > div h5 {\n  font-size: 0.875rem;\n  margin: 1rem 0;\n  line-height: 1;\n  text-transform: uppercase;\n  font-weight: 500;\n}\n\n.share-subscribe .newsletter-form {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.share-subscribe .newsletter-form .form-group {\n  max-width: 250px;\n  width: 100%;\n}\n\n.share-subscribe .newsletter-form .btn,\n.share-subscribe .newsletter-form .nav-mob-follow a,\n.nav-mob-follow .share-subscribe .newsletter-form a {\n  border-radius: 0;\n}\n\n/* Related post\r\n========================================================================== */\n\n.post-related {\n  margin-top: 40px;\n}\n\n.post-related-title {\n  color: #000;\n  font-size: 18px;\n  font-weight: 500;\n  height: auto;\n  line-height: 17px;\n  margin: 0 0 20px;\n  padding-bottom: 10px;\n  text-transform: uppercase;\n}\n\n.post-related-list {\n  margin-bottom: 18px;\n  padding: 0;\n  border: none;\n}\n\n/* Media Query (medium)\r\n========================================================================== */\n\n@media only screen and (min-width: 766px) {\n  .post .title {\n    font-size: 2.25rem;\n    margin: 0 0 1rem;\n  }\n\n  .post-body {\n    font-size: 1.125rem;\n    line-height: 32px;\n  }\n\n  .post-body p {\n    margin-bottom: 1.5rem;\n  }\n\n  .post-card {\n    padding: 30px;\n  }\n}\n\n@media only screen and (max-width: 640px) {\n  .post-title {\n    font-size: 1.8rem;\n  }\n\n  .post-image,\n  .video-responsive {\n    margin-left: -0.9375rem;\n    margin-right: -0.9375rem;\n  }\n}\n\n/* sidebar\r\n========================================================================== */\n\n.sidebar {\n  position: relative;\n  line-height: 1.6;\n}\n\n.sidebar h1,\n.sidebar h2,\n.sidebar h3,\n.sidebar h4,\n.sidebar h5,\n.sidebar h6 {\n  margin-top: 0;\n  color: #000;\n}\n\n.sidebar-items {\n  margin-bottom: 2.5rem;\n  padding: 25px;\n  position: relative;\n}\n\n.sidebar-title {\n  padding-bottom: 10px;\n  margin-bottom: 1rem;\n  text-transform: uppercase;\n  font-size: 1rem;\n}\n\n.sidebar .title-primary {\n  background-color: #4285f4;\n  color: #FFF;\n  padding: 10px 16px;\n  font-size: 18px;\n}\n\n.sidebar-post--border {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border-left: 3px solid #4285f4;\n  bottom: 0;\n  color: rgba(0, 0, 0, 0.2);\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  font-size: 28px;\n  font-weight: bold;\n  left: 0;\n  line-height: 1;\n  padding: 15px 10px 10px;\n  position: absolute;\n  top: 0;\n}\n\n.sidebar-post:nth-child(3n) .sidebar-post--border {\n  border-color: #f59e00;\n}\n\n.sidebar-post:nth-child(3n+2) .sidebar-post--border {\n  border-color: #00a034;\n}\n\n.sidebar-post--link {\n  display: block;\n  min-height: 50px;\n  padding: 10px 15px 10px 55px;\n  position: relative;\n}\n\n.sidebar-post--link:hover .sidebar-post--border {\n  background-color: #e5eff5;\n}\n\n.sidebar-post--title {\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 16px;\n  font-weight: 500;\n  margin: 0;\n}\n\n.subscribe {\n  min-height: 90vh;\n  padding-top: 50px;\n}\n\n.subscribe h3 {\n  margin: 0;\n  margin-bottom: 8px;\n  font: 400 20px/32px \"Roboto\", sans-serif;\n}\n\n.subscribe-title {\n  font-weight: 400;\n  margin-top: 0;\n}\n\n.subscribe-wrap {\n  max-width: 700px;\n  color: #7d878a;\n  padding: 1rem 0;\n}\n\n.subscribe .form-group {\n  margin-bottom: 1.5rem;\n}\n\n.subscribe .form-group.error input {\n  border-color: #ff5b5b;\n}\n\n.subscribe .btn,\n.subscribe .nav-mob-follow a,\n.nav-mob-follow .subscribe a {\n  width: 100%;\n}\n\n.subscribe-form {\n  position: relative;\n  margin: 30px auto;\n  padding: 40px;\n  max-width: 400px;\n  width: 100%;\n  background: #ebeff2;\n  border-radius: 5px;\n  text-align: left;\n}\n\n.subscribe-input {\n  width: 100%;\n  padding: 10px;\n  border: #4285f4  1px solid;\n  border-radius: 2px;\n}\n\n.subscribe-input:focus {\n  outline: none;\n}\n\n.animated {\n  -webkit-animation-duration: 1s;\n       -o-animation-duration: 1s;\n          animation-duration: 1s;\n  -webkit-animation-fill-mode: both;\n       -o-animation-fill-mode: both;\n          animation-fill-mode: both;\n}\n\n.animated.infinite {\n  -webkit-animation-iteration-count: infinite;\n       -o-animation-iteration-count: infinite;\n          animation-iteration-count: infinite;\n}\n\n.bounceIn {\n  -webkit-animation-name: bounceIn;\n       -o-animation-name: bounceIn;\n          animation-name: bounceIn;\n}\n\n.bounceInDown {\n  -webkit-animation-name: bounceInDown;\n       -o-animation-name: bounceInDown;\n          animation-name: bounceInDown;\n}\n\n.slideInUp {\n  -webkit-animation-name: slideInUp;\n       -o-animation-name: slideInUp;\n          animation-name: slideInUp;\n}\n\n.slideOutDown {\n  -webkit-animation-name: slideOutDown;\n       -o-animation-name: slideOutDown;\n          animation-name: slideOutDown;\n}\n\n@-webkit-keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n            transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n            transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n            transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n            transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n            transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-o-keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n       animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n         -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n            transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n            transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n            transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n            transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n            transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-webkit-keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n            transform: none;\n  }\n}\n\n@-o-keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n       animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -o-transform: none;\n       transform: none;\n  }\n}\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n         -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n         -o-transform: none;\n            transform: none;\n  }\n}\n\n@-webkit-keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.05, 1.05, 1.05);\n            transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-o-keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.05, 1.05, 1.05);\n            transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-webkit-keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -webkit-transform: translateY(0px);\n            transform: translateY(0px);\n  }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translateY(10px);\n            transform: translateY(10px);\n  }\n}\n\n@-o-keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -o-transform: translateY(0px);\n       transform: translateY(0px);\n  }\n\n  100% {\n    opacity: 0;\n    -o-transform: translateY(10px);\n       transform: translateY(10px);\n  }\n}\n\n@keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -webkit-transform: translateY(0px);\n         -o-transform: translateY(0px);\n            transform: translateY(0px);\n  }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translateY(10px);\n         -o-transform: translateY(10px);\n            transform: translateY(10px);\n  }\n}\n\n@-webkit-keyframes spin {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@-o-keyframes spin {\n  from {\n    -o-transform: rotate(0deg);\n       transform: rotate(0deg);\n  }\n\n  to {\n    -o-transform: rotate(360deg);\n       transform: rotate(360deg);\n  }\n}\n\n@keyframes spin {\n  from {\n    -webkit-transform: rotate(0deg);\n         -o-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n         -o-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@-webkit-keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n            transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n}\n\n@-o-keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n            transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n}\n\n@-webkit-keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 20%, 0);\n            transform: translate3d(0, 20%, 0);\n  }\n}\n\n@-o-keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0);\n  }\n}\n\n@keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 20%, 0);\n            transform: translate3d(0, 20%, 0);\n  }\n}\n\n", "", {"version":3,"sources":["C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/main.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/main.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_icon.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_variables.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_header.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_utilities.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_global.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/components/_grid.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_typography.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_menu.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_cover.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_entry.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_footer.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/components/_buttons.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_post.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_sidebar.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_subscribe.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/components/_animated.scss"],"names":[],"mappings":"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","file":"main.scss","sourcesContent":["@charset \"UTF-8\";\n@import url(~normalize.css/normalize.css);\n@import url(~prismjs/themes/prism.css);\npre.line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber; }\n\npre.line-numbers > code {\n  position: relative;\n  white-space: inherit; }\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber; }\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right; }\n\n@font-face {\n  font-family: 'mapache';\n  src: url(\"../fonts/mapache.ttf?g7hms8\") format(\"truetype\"), url(\"../fonts/mapache.woff?g7hms8\") format(\"woff\"), url(\"../fonts/mapache.svg?g7hms8#mapache\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal; }\n\n[class^=\"i-\"]:before, [class*=\" i-\"]:before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.i-navigate_before:before {\n  content: \"\\e408\"; }\n\n.i-navigate_next:before {\n  content: \"\\e409\"; }\n\n.i-tag:before {\n  content: \"\\e54e\"; }\n\n.i-keyboard_arrow_down:before {\n  content: \"\\e313\"; }\n\n.i-arrow_upward:before {\n  content: \"\\e5d8\"; }\n\n.i-cloud_download:before {\n  content: \"\\e2c0\"; }\n\n.i-star:before {\n  content: \"\\e838\"; }\n\n.i-keyboard_arrow_up:before {\n  content: \"\\e316\"; }\n\n.i-open_in_new:before {\n  content: \"\\e89e\"; }\n\n.i-warning:before {\n  content: \"\\e002\"; }\n\n.i-back:before {\n  content: \"\\e5c4\"; }\n\n.i-forward:before {\n  content: \"\\e5c8\"; }\n\n.i-chat:before {\n  content: \"\\e0cb\"; }\n\n.i-close:before {\n  content: \"\\e5cd\"; }\n\n.i-code2:before {\n  content: \"\\e86f\"; }\n\n.i-favorite:before {\n  content: \"\\e87d\"; }\n\n.i-link:before {\n  content: \"\\e157\"; }\n\n.i-menu:before {\n  content: \"\\e5d2\"; }\n\n.i-feed:before {\n  content: \"\\e0e5\"; }\n\n.i-search:before {\n  content: \"\\e8b6\"; }\n\n.i-share:before {\n  content: \"\\e80d\"; }\n\n.i-check_circle:before {\n  content: \"\\e86c\"; }\n\n.i-play:before {\n  content: \"\\e901\"; }\n\n.i-download:before {\n  content: \"\\e900\"; }\n\n.i-code:before {\n  content: \"\\f121\"; }\n\n.i-behance:before {\n  content: \"\\f1b4\"; }\n\n.i-spotify:before {\n  content: \"\\f1bc\"; }\n\n.i-codepen:before {\n  content: \"\\f1cb\"; }\n\n.i-github:before {\n  content: \"\\f09b\"; }\n\n.i-linkedin:before {\n  content: \"\\f0e1\"; }\n\n.i-flickr:before {\n  content: \"\\f16e\"; }\n\n.i-dribbble:before {\n  content: \"\\f17d\"; }\n\n.i-pinterest:before {\n  content: \"\\f231\"; }\n\n.i-map:before {\n  content: \"\\f041\"; }\n\n.i-twitter:before {\n  content: \"\\f099\"; }\n\n.i-facebook:before {\n  content: \"\\f09a\"; }\n\n.i-youtube:before {\n  content: \"\\f16a\"; }\n\n.i-instagram:before {\n  content: \"\\f16d\"; }\n\n.i-google:before {\n  content: \"\\f1a0\"; }\n\n.i-pocket:before {\n  content: \"\\f265\"; }\n\n.i-reddit:before {\n  content: \"\\f281\"; }\n\n.i-snapchat:before {\n  content: \"\\f2ac\"; }\n\n.i-telegram:before {\n  content: \"\\f2c6\"; }\n\n/*\r\n@package godofredoninja\r\n\r\n========================================================================\r\nMapache variables styles\r\n========================================================================\r\n*/\n/**\r\n* Table of Contents:\r\n*\r\n*   1. Colors\r\n*   2. Fonts\r\n*   3. Typography\r\n*   4. Header\r\n*   5. Footer\r\n*   6. Code Syntax\r\n*   7. buttons\r\n*   8. container\r\n*   9. Grid\r\n*   10. Media Query Ranges\r\n*   11. Icons\r\n*/\n/* 1. Colors\r\n========================================================================== */\n/* 2. Fonts\r\n========================================================================== */\n/* 3. Typography\r\n========================================================================== */\n/* 4. Header\r\n========================================================================== */\n/* 5. Entry articles\r\n========================================================================== */\n/* 5. Footer\r\n========================================================================== */\n/* 6. Code Syntax\r\n========================================================================== */\n/* 7. buttons\r\n========================================================================== */\n/* 8. container\r\n========================================================================== */\n/* 9. Grid\r\n========================================================================== */\n/* 10. Media Query Ranges\r\n========================================================================== */\n/* 11. icons\r\n========================================================================== */\n.header.toolbar-shadow {\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28); }\n\na.external::after, hr::before, .warning:before, .note:before, .success:before, .btn.btn-download-cloud:after, .nav-mob-follow a.btn-download-cloud:after, .btn.btn-download:after, .nav-mob-follow a.btn-download:after {\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.u-clear::after {\n  clear: both;\n  content: \"\";\n  display: table; }\n\n.u-not-avatar {\n  background-image: url(\"../images/avatar.png\"); }\n\n.u-relative {\n  position: relative; }\n\n.u-block {\n  display: block; }\n\n.u-absolute0 {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0; }\n\n.u-bg-cover {\n  background-position: center;\n  background-size: cover; }\n\n.u-bg-gradient {\n  background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, 0.8))); }\n\n.u-border-bottom-dark, .sidebar-title {\n  border-bottom: solid 1px #000; }\n\n.u-b-t {\n  border-top: solid 1px #eee; }\n\n.u-p-t-2 {\n  padding-top: 2rem; }\n\n.u-unstyled {\n  list-style-type: none;\n  margin: 0;\n  padding-left: 0; }\n\n.u-floatLeft {\n  float: left !important; }\n\n.u-floatRight {\n  float: right !important; }\n\n.u-flex {\n  display: flex;\n  flex-direction: row; }\n\n.u-flex-wrap {\n  display: flex;\n  flex-wrap: wrap; }\n\n.u-flex-center, .header-logo,\n.header-follow a,\n.header-menu a {\n  display: flex;\n  align-items: center; }\n\n.u-flex-aling-right {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end; }\n\n.u-flex-aling-center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column; }\n\n.u-m-t-1 {\n  margin-top: 1rem; }\n\n/* Tags\r\n========================================================================== */\n.u-tags {\n  font-size: 12px !important;\n  margin: 3px !important;\n  color: #4c5765 !important;\n  background-color: #ebebeb !important;\n  transition: all .3s; }\n  .u-tags::before {\n    padding-right: 5px;\n    opacity: .8; }\n  .u-tags:hover {\n    background-color: #4285f4 !important;\n    color: #fff !important; }\n\n.u-tag {\n  background-color: #4285f4;\n  color: #fff;\n  padding: 4px 12px;\n  font-size: 11px;\n  display: inline-block;\n  text-transform: uppercase; }\n\n.u-hide {\n  display: none !important; }\n\n.u-card-shadow {\n  background-color: #fff;\n  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.02); }\n\n.u-not-image {\n  background-repeat: repeat;\n  background-size: initial !important;\n  background-color: #fff; }\n\n@media only screen and (max-width: 766px) {\n  .u-h-b-md {\n    display: none !important; } }\n\n@media only screen and (max-width: 992px) {\n  .u-h-b-lg {\n    display: none !important; } }\n\n@media only screen and (min-width: 766px) {\n  .u-h-a-md {\n    display: none !important; } }\n\n@media only screen and (min-width: 992px) {\n  .u-h-a-lg {\n    display: none !important; } }\n\nhtml {\n  box-sizing: border-box;\n  font-size: 16px;\n  -webkit-tap-highlight-color: transparent; }\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box; }\n\na {\n  color: #039be5;\n  outline: 0;\n  text-decoration: none;\n  -webkit-tap-highlight-color: transparent; }\n  a:focus {\n    text-decoration: none; }\n  a.external::after {\n    content: \"\";\n    margin-left: 5px; }\n\nbody {\n  color: #333;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 0 auto;\n  background-color: #f5f5f5; }\n\nfigure {\n  margin: 0; }\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto; }\n  img:not([src]) {\n    visibility: hidden; }\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto; }\n\ni {\n  display: inline-block;\n  vertical-align: middle; }\n\nhr {\n  background: #F1F2F1;\n  background: linear-gradient(to right, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  border: none;\n  height: 1px;\n  margin: 80px auto;\n  max-width: 90%;\n  position: relative; }\n  hr::before {\n    background: #fff;\n    color: rgba(73, 55, 65, 0.75);\n    content: \"\";\n    display: block;\n    font-size: 35px;\n    left: 50%;\n    padding: 0 25px;\n    position: absolute;\n    top: 50%;\n    transform: translate(-50%, -50%); }\n\nblockquote {\n  border-left: 4px solid #4285f4;\n  padding: .75rem 1.5rem;\n  background: #fbfbfc;\n  color: #757575;\n  font-size: 1.125rem;\n  line-height: 1.7;\n  margin: 0 0 1.25rem;\n  quotes: none; }\n\nol, ul, blockquote {\n  margin-left: 2rem; }\n\nstrong {\n  font-weight: 500; }\n\nsmall, .small {\n  font-size: 85%; }\n\nol {\n  padding-left: 40px;\n  list-style: decimal outside; }\n\nmark {\n  background-color: #fdffb6; }\n\n.footer,\n.main {\n  transition: transform .5s ease;\n  z-index: 2; }\n\n/* Code Syntax\r\n========================================================================== */\nkbd, samp, code {\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  color: #c7254e;\n  background: #f7f7f7;\n  border-radius: 4px;\n  padding: 4px 6px;\n  white-space: pre-wrap; }\n\ncode[class*=language-],\npre[class*=language-] {\n  color: #37474f;\n  line-height: 1.5; }\n  code[class*=language-] .token.comment,\n  pre[class*=language-] .token.comment {\n    opacity: .8; }\n  code[class*=language-].line-numbers,\n  pre[class*=language-].line-numbers {\n    padding-left: 58px; }\n    code[class*=language-].line-numbers::before,\n    pre[class*=language-].line-numbers::before {\n      content: \"\";\n      position: absolute;\n      left: 0;\n      top: 0;\n      background: #F0EDEE;\n      width: 40px;\n      height: 100%; }\n  code[class*=language-] .line-numbers-rows,\n  pre[class*=language-] .line-numbers-rows {\n    border-right: none;\n    top: -3px;\n    left: -58px; }\n    code[class*=language-] .line-numbers-rows > span::before,\n    pre[class*=language-] .line-numbers-rows > span::before {\n      padding-right: 0;\n      text-align: center;\n      opacity: .8; }\n\npre {\n  background-color: #f7f7f7 !important;\n  padding: 1rem;\n  overflow: hidden;\n  border-radius: 4px;\n  word-wrap: normal;\n  margin: 2.5rem 0 !important;\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  position: relative; }\n  pre code {\n    color: #37474f;\n    text-shadow: 0 1px #fff;\n    padding: 0;\n    background: transparent; }\n\n/* .warning & .note & .success\r\n========================================================================== */\n.warning {\n  background: #fbe9e7;\n  color: #d50000; }\n  .warning:before {\n    content: \"\"; }\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1; }\n  .note:before {\n    content: \"\"; }\n\n.success {\n  background: #e0f2f1;\n  color: #00897b; }\n  .success:before {\n    content: \"\";\n    color: #00bfa5; }\n\n.warning, .note, .success {\n  display: block;\n  margin: 1rem 0;\n  font-size: 1rem;\n  padding: 12px 24px 12px 60px;\n  line-height: 1.5; }\n  .warning a, .note a, .success a {\n    text-decoration: underline;\n    color: inherit; }\n  .warning:before, .note:before, .success:before {\n    margin-left: -36px;\n    float: left;\n    font-size: 24px; }\n\n/* Social icon color and background\r\n========================================================================== */\n.c-facebook {\n  color: #3b5998; }\n\n.bg-facebook, .nav-mob-follow .i-facebook {\n  background-color: #3b5998 !important; }\n\n.c-twitter {\n  color: #55acee; }\n\n.bg-twitter, .nav-mob-follow .i-twitter {\n  background-color: #55acee !important; }\n\n.c-google {\n  color: #dd4b39; }\n\n.bg-google, .nav-mob-follow .i-google {\n  background-color: #dd4b39 !important; }\n\n.c-instagram {\n  color: #306088; }\n\n.bg-instagram, .nav-mob-follow .i-instagram {\n  background-color: #306088 !important; }\n\n.c-youtube {\n  color: #e52d27; }\n\n.bg-youtube, .nav-mob-follow .i-youtube {\n  background-color: #e52d27 !important; }\n\n.c-github {\n  color: #333333; }\n\n.bg-github, .nav-mob-follow .i-github {\n  background-color: #333333 !important; }\n\n.c-linkedin {\n  color: #007bb6; }\n\n.bg-linkedin, .nav-mob-follow .i-linkedin {\n  background-color: #007bb6 !important; }\n\n.c-spotify {\n  color: #2ebd59; }\n\n.bg-spotify, .nav-mob-follow .i-spotify {\n  background-color: #2ebd59 !important; }\n\n.c-codepen {\n  color: #222222; }\n\n.bg-codepen, .nav-mob-follow .i-codepen {\n  background-color: #222222 !important; }\n\n.c-behance {\n  color: #131418; }\n\n.bg-behance, .nav-mob-follow .i-behance {\n  background-color: #131418 !important; }\n\n.c-dribbble {\n  color: #ea4c89; }\n\n.bg-dribbble, .nav-mob-follow .i-dribbble {\n  background-color: #ea4c89 !important; }\n\n.c-flickr {\n  color: #0063DC; }\n\n.bg-flickr, .nav-mob-follow .i-flickr {\n  background-color: #0063DC !important; }\n\n.c-reddit {\n  color: orangered; }\n\n.bg-reddit, .nav-mob-follow .i-reddit {\n  background-color: orangered !important; }\n\n.c-pocket {\n  color: #F50057; }\n\n.bg-pocket, .nav-mob-follow .i-pocket {\n  background-color: #F50057 !important; }\n\n.c-pinterest {\n  color: #bd081c; }\n\n.bg-pinterest, .nav-mob-follow .i-pinterest {\n  background-color: #bd081c !important; }\n\n.c-feed {\n  color: orange; }\n\n.bg-feed, .nav-mob-follow .i-feed {\n  background-color: orange !important; }\n\n.c-telegram {\n  color: #08c; }\n\n.bg-telegram, .nav-mob-follow .i-telegram {\n  background-color: #08c !important; }\n\n.clear:after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n/* pagination Infinite scroll\r\n========================================================================== */\n.mapache-load-more {\n  border: solid 1px #C3C3C3;\n  color: #7D7D7D;\n  display: block;\n  font-size: 15px;\n  height: 45px;\n  margin: 4rem auto;\n  padding: 11px 16px;\n  position: relative;\n  text-align: center;\n  width: 100%; }\n  .mapache-load-more:hover {\n    background: #4285f4;\n    border-color: #4285f4;\n    color: #fff; }\n\n.pagination-nav {\n  padding: 2.5rem 0 3rem;\n  text-align: center; }\n  .pagination-nav .page-number {\n    display: none;\n    padding-top: 5px; }\n    @media only screen and (min-width: 766px) {\n      .pagination-nav .page-number {\n        display: inline-block; } }\n  .pagination-nav .newer-posts {\n    float: left; }\n  .pagination-nav .older-posts {\n    float: right; }\n\n/* Scroll Top\r\n========================================================================== */\n.scroll_top {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  z-index: 11;\n  width: 60px;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity 0.5s ease; }\n  .scroll_top.visible {\n    opacity: 1;\n    visibility: visible; }\n  .scroll_top:hover svg path {\n    fill: rgba(0, 0, 0, 0.6); }\n\n.svg-icon svg {\n  width: 100%;\n  height: auto;\n  display: block;\n  fill: currentcolor; }\n\n/* Video Responsive\r\n========================================================================== */\n.video-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n  padding-bottom: 56.25%;\n  margin-bottom: 1.5rem; }\n  .video-responsive iframe {\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    height: 100%;\n    width: 100%;\n    border: 0; }\n\n/* Video full for tag video\r\n========================================================================== */\n#video-format .video-content {\n  display: flex;\n  padding-bottom: 1rem; }\n  #video-format .video-content span {\n    display: inline-block;\n    vertical-align: middle;\n    margin-right: .8rem; }\n\n/* Page error 404\r\n========================================================================== */\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n  height: 100vh;\n  position: relative;\n  width: 100%; }\n  .errorPage-title {\n    padding: 24px 60px; }\n  .errorPage-link {\n    color: rgba(0, 0, 0, 0.54);\n    font-size: 22px;\n    font-weight: 500;\n    left: -5px;\n    position: relative;\n    text-rendering: optimizeLegibility;\n    top: -6px; }\n  .errorPage-emoji {\n    color: rgba(0, 0, 0, 0.4);\n    font-size: 150px; }\n  .errorPage-text {\n    color: rgba(0, 0, 0, 0.4);\n    line-height: 21px;\n    margin-top: 60px;\n    white-space: pre-wrap; }\n  .errorPage-wrap {\n    display: block;\n    left: 50%;\n    min-width: 680px;\n    position: absolute;\n    text-align: center;\n    top: 50%;\n    transform: translate(-50%, -50%); }\n\n/* Post Twitter facebook card embed Css Center\r\n========================================================================== */\n.post iframe[src*=\"facebook.com\"],\n.post .fb-post,\n.post .twitter-tweet {\n  display: block !important;\n  margin: 1.5rem 0 !important; }\n\n.container {\n  margin: 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n  width: 100%;\n  max-width: 1250px; }\n\n.margin-top {\n  margin-top: 50px;\n  padding-top: 1rem; }\n  @media only screen and (min-width: 766px) {\n    .margin-top {\n      padding-top: 1.8rem; } }\n\n@media only screen and (min-width: 766px) {\n  .content {\n    flex-basis: 69.66666667% !important;\n    max-width: 69.66666667% !important; }\n  .sidebar {\n    flex-basis: 30.33333333% !important;\n    max-width: 30.33333333% !important; } }\n\n@media only screen and (min-width: 1230px) {\n  .content {\n    padding-right: 40px !important; } }\n\n@media only screen and (min-width: 992px) {\n  .feed-entry-wrapper .entry-image {\n    width: 40% !important;\n    max-width: 40% !important; }\n  .feed-entry-wrapper .entry-body {\n    width: 60% !important;\n    max-width: 60% !important; } }\n\n@media only screen and (max-width: 992px) {\n  body.is-article .content {\n    max-width: 100% !important; } }\n\n.row {\n  display: flex;\n  flex: 0 1 auto;\n  flex-flow: row wrap;\n  margin-left: -0.9375rem;\n  margin-right: -0.9375rem; }\n  .row .col {\n    flex: 0 0 auto;\n    padding-left: 0.9375rem;\n    padding-right: 0.9375rem; }\n    .row .col.s1 {\n      flex-basis: 8.33333%;\n      max-width: 8.33333%; }\n    .row .col.s2 {\n      flex-basis: 16.66667%;\n      max-width: 16.66667%; }\n    .row .col.s3 {\n      flex-basis: 25%;\n      max-width: 25%; }\n    .row .col.s4 {\n      flex-basis: 33.33333%;\n      max-width: 33.33333%; }\n    .row .col.s5 {\n      flex-basis: 41.66667%;\n      max-width: 41.66667%; }\n    .row .col.s6 {\n      flex-basis: 50%;\n      max-width: 50%; }\n    .row .col.s7 {\n      flex-basis: 58.33333%;\n      max-width: 58.33333%; }\n    .row .col.s8 {\n      flex-basis: 66.66667%;\n      max-width: 66.66667%; }\n    .row .col.s9 {\n      flex-basis: 75%;\n      max-width: 75%; }\n    .row .col.s10 {\n      flex-basis: 83.33333%;\n      max-width: 83.33333%; }\n    .row .col.s11 {\n      flex-basis: 91.66667%;\n      max-width: 91.66667%; }\n    .row .col.s12 {\n      flex-basis: 100%;\n      max-width: 100%; }\n    @media only screen and (min-width: 766px) {\n      .row .col.m1 {\n        flex-basis: 8.33333%;\n        max-width: 8.33333%; }\n      .row .col.m2 {\n        flex-basis: 16.66667%;\n        max-width: 16.66667%; }\n      .row .col.m3 {\n        flex-basis: 25%;\n        max-width: 25%; }\n      .row .col.m4 {\n        flex-basis: 33.33333%;\n        max-width: 33.33333%; }\n      .row .col.m5 {\n        flex-basis: 41.66667%;\n        max-width: 41.66667%; }\n      .row .col.m6 {\n        flex-basis: 50%;\n        max-width: 50%; }\n      .row .col.m7 {\n        flex-basis: 58.33333%;\n        max-width: 58.33333%; }\n      .row .col.m8 {\n        flex-basis: 66.66667%;\n        max-width: 66.66667%; }\n      .row .col.m9 {\n        flex-basis: 75%;\n        max-width: 75%; }\n      .row .col.m10 {\n        flex-basis: 83.33333%;\n        max-width: 83.33333%; }\n      .row .col.m11 {\n        flex-basis: 91.66667%;\n        max-width: 91.66667%; }\n      .row .col.m12 {\n        flex-basis: 100%;\n        max-width: 100%; } }\n    @media only screen and (min-width: 992px) {\n      .row .col.l1 {\n        flex-basis: 8.33333%;\n        max-width: 8.33333%; }\n      .row .col.l2 {\n        flex-basis: 16.66667%;\n        max-width: 16.66667%; }\n      .row .col.l3 {\n        flex-basis: 25%;\n        max-width: 25%; }\n      .row .col.l4 {\n        flex-basis: 33.33333%;\n        max-width: 33.33333%; }\n      .row .col.l5 {\n        flex-basis: 41.66667%;\n        max-width: 41.66667%; }\n      .row .col.l6 {\n        flex-basis: 50%;\n        max-width: 50%; }\n      .row .col.l7 {\n        flex-basis: 58.33333%;\n        max-width: 58.33333%; }\n      .row .col.l8 {\n        flex-basis: 66.66667%;\n        max-width: 66.66667%; }\n      .row .col.l9 {\n        flex-basis: 75%;\n        max-width: 75%; }\n      .row .col.l10 {\n        flex-basis: 83.33333%;\n        max-width: 83.33333%; }\n      .row .col.l11 {\n        flex-basis: 91.66667%;\n        max-width: 91.66667%; }\n      .row .col.l12 {\n        flex-basis: 100%;\n        max-width: 100%; } }\n\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  margin-bottom: 0.5rem;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: 700;\n  line-height: 1.1;\n  color: inherit; }\n\nh1 {\n  font-size: 2.25rem; }\n\nh2 {\n  font-size: 1.875rem; }\n\nh3 {\n  font-size: 1.5625rem; }\n\nh4 {\n  font-size: 1.375rem; }\n\nh5 {\n  font-size: 1.125rem; }\n\nh6 {\n  font-size: 1rem; }\n\n.h1 {\n  font-size: 2.25rem; }\n\n.h2 {\n  font-size: 1.875rem; }\n\n.h3 {\n  font-size: 1.5625rem; }\n\n.h4 {\n  font-size: 1.375rem; }\n\n.h5 {\n  font-size: 1.125rem; }\n\n.h6 {\n  font-size: 1rem; }\n\nh1, h2, h3, h4, h5, h6 {\n  margin-bottom: 1rem; }\n  h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {\n    color: inherit;\n    line-height: inherit; }\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem; }\n\n/* Navigation Mobile\r\n========================================================================== */\n.nav-mob {\n  background: #4285f4;\n  color: #000;\n  height: 100vh;\n  left: 0;\n  padding: 0 20px;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  transition: .4s;\n  will-change: transform;\n  z-index: 997; }\n  .nav-mob a {\n    color: inherit; }\n  .nav-mob ul a {\n    display: block;\n    font-weight: 500;\n    padding: 8px 0;\n    text-transform: uppercase;\n    font-size: 14px; }\n  .nav-mob-content {\n    background: #eee;\n    overflow: auto;\n    -webkit-overflow-scrolling: touch;\n    bottom: 0;\n    left: 0;\n    padding: 20px 0;\n    position: absolute;\n    right: 0;\n    top: 50px; }\n\n.nav-mob ul,\n.nav-mob-subscribe,\n.nav-mob-follow {\n  border-bottom: solid 1px #DDD;\n  padding: 0 0.9375rem 20px 0.9375rem;\n  margin-bottom: 15px; }\n\n/* Navigation Mobile follow\r\n========================================================================== */\n.nav-mob-follow a {\n  font-size: 20px !important;\n  margin: 0 2px !important;\n  padding: 0; }\n\n.nav-mob-follow .i-facebook {\n  color: #fff; }\n\n.nav-mob-follow .i-twitter {\n  color: #fff; }\n\n.nav-mob-follow .i-google {\n  color: #fff; }\n\n.nav-mob-follow .i-instagram {\n  color: #fff; }\n\n.nav-mob-follow .i-youtube {\n  color: #fff; }\n\n.nav-mob-follow .i-github {\n  color: #fff; }\n\n.nav-mob-follow .i-linkedin {\n  color: #fff; }\n\n.nav-mob-follow .i-spotify {\n  color: #fff; }\n\n.nav-mob-follow .i-codepen {\n  color: #fff; }\n\n.nav-mob-follow .i-behance {\n  color: #fff; }\n\n.nav-mob-follow .i-dribbble {\n  color: #fff; }\n\n.nav-mob-follow .i-flickr {\n  color: #fff; }\n\n.nav-mob-follow .i-reddit {\n  color: #fff; }\n\n.nav-mob-follow .i-pocket {\n  color: #fff; }\n\n.nav-mob-follow .i-pinterest {\n  color: #fff; }\n\n.nav-mob-follow .i-feed {\n  color: #fff; }\n\n.nav-mob-follow .i-telegram {\n  color: #fff; }\n\n/* CopyRigh\r\n========================================================================== */\n.nav-mob-copyright {\n  color: #aaa;\n  font-size: 13px;\n  padding: 20px 15px 0;\n  text-align: center;\n  width: 100%; }\n  .nav-mob-copyright a {\n    color: #4285f4; }\n\n/* subscribe\r\n========================================================================== */\n.nav-mob-subscribe .btn, .nav-mob-subscribe .nav-mob-follow a, .nav-mob-follow .nav-mob-subscribe a {\n  border-radius: 0;\n  text-transform: none;\n  width: 80px; }\n\n.nav-mob-subscribe .form-group {\n  width: calc(100% - 80px); }\n\n.nav-mob-subscribe input {\n  border: 0;\n  box-shadow: none !important; }\n\n/* Header Page\r\n========================================================================== */\n.header {\n  background: #4285f4;\n  height: 50px;\n  left: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: 999; }\n  .header-wrap a {\n    color: #fff; }\n  .header-logo,\n  .header-follow a,\n  .header-menu a {\n    height: 50px; }\n  .header-follow, .header-search, .header-logo {\n    flex: 0 0 auto; }\n  .header-logo {\n    z-index: 998;\n    font-size: 1.25rem;\n    font-weight: 500;\n    letter-spacing: 1px; }\n    .header-logo img {\n      max-height: 35px;\n      position: relative; }\n  .header .nav-mob-toggle,\n  .header .search-mob-toggle {\n    padding: 0;\n    z-index: 998; }\n  .header .nav-mob-toggle {\n    margin-left: 0 !important;\n    margin-right: -0.9375rem;\n    position: relative;\n    transition: transform .4s; }\n    .header .nav-mob-toggle span {\n      background-color: #fff;\n      display: block;\n      height: 2px;\n      left: 14px;\n      margin-top: -1px;\n      position: absolute;\n      top: 50%;\n      transition: .4s;\n      width: 20px; }\n      .header .nav-mob-toggle span:first-child {\n        transform: translate(0, -6px); }\n      .header .nav-mob-toggle span:last-child {\n        transform: translate(0, 6px); }\n  .header:not(.toolbar-shadow) {\n    background-color: transparent !important; }\n\n/* Header Navigation\r\n========================================================================== */\n.header-menu {\n  flex: 1 1 0;\n  overflow: hidden;\n  transition: flex .2s,margin .2s,width .2s; }\n  .header-menu ul {\n    margin-left: 2rem;\n    white-space: nowrap; }\n    .header-menu ul li {\n      padding-right: 15px;\n      display: inline-block; }\n    .header-menu ul a {\n      padding: 0 8px;\n      position: relative; }\n      .header-menu ul a:before {\n        background: #fff;\n        bottom: 0;\n        content: '';\n        height: 2px;\n        left: 0;\n        opacity: 0;\n        position: absolute;\n        transition: opacity .2s;\n        width: 100%; }\n      .header-menu ul a:hover:before, .header-menu ul a.active:before {\n        opacity: 1; }\n\n/* header social\r\n========================================================================== */\n.header-follow a {\n  padding: 0 10px; }\n  .header-follow a:hover {\n    color: rgba(255, 255, 255, 0.8); }\n  .header-follow a:before {\n    font-size: 1.25rem !important; }\n\n/* Header search\r\n========================================================================== */\n.header-search {\n  background: #eee;\n  border-radius: 2px;\n  display: none;\n  height: 36px;\n  position: relative;\n  text-align: left;\n  transition: background .2s,flex .2s;\n  vertical-align: top;\n  margin-left: 1.5rem;\n  margin-right: 1.5rem; }\n  .header-search .search-icon {\n    color: #757575;\n    font-size: 24px;\n    left: 24px;\n    position: absolute;\n    top: 12px;\n    transition: color .2s; }\n\ninput.search-field {\n  background: 0;\n  border: 0;\n  color: #212121;\n  height: 36px;\n  padding: 0 8px 0 72px;\n  transition: color .2s;\n  width: 100%; }\n  input.search-field:focus {\n    border: 0;\n    outline: none; }\n\n.search-popout {\n  background: #fff;\n  box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24), inset 0 4px 6px -4px rgba(0, 0, 0, 0.24);\n  margin-top: 10px;\n  max-height: calc(100vh - 150px);\n  margin-left: -64px;\n  overflow-y: auto;\n  position: absolute;\n  z-index: -1; }\n  .search-popout.closed {\n    visibility: hidden; }\n\n.search-suggest-results {\n  padding: 0 8px 0 75px; }\n  .search-suggest-results a {\n    color: #212121;\n    display: block;\n    margin-left: -8px;\n    outline: 0;\n    height: auto;\n    padding: 8px;\n    transition: background .2s;\n    font-size: 0.875rem; }\n    .search-suggest-results a:first-child {\n      margin-top: 10px; }\n    .search-suggest-results a:last-child {\n      margin-bottom: 10px; }\n    .search-suggest-results a:hover {\n      background: #f7f7f7; }\n\n/* mediaquery medium\r\n========================================================================== */\n@media only screen and (min-width: 992px) {\n  .header-search {\n    background: rgba(255, 255, 255, 0.25);\n    box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.12);\n    color: #fff;\n    display: inline-block;\n    width: 200px; }\n    .header-search:hover {\n      background: rgba(255, 255, 255, 0.4); }\n    .header-search .search-icon {\n      top: 0px; }\n    .header-search input, .header-search input::placeholder, .header-search .search-icon {\n      color: #fff; }\n  .search-popout {\n    width: 100%;\n    margin-left: 0; }\n  .header.is-showSearch .header-search {\n    background: #fff;\n    flex: 1 0 auto; }\n    .header.is-showSearch .header-search .search-icon {\n      color: #757575 !important; }\n    .header.is-showSearch .header-search input, .header.is-showSearch .header-search input::placeholder {\n      color: #212121 !important; }\n  .header.is-showSearch .header-menu {\n    flex: 0 0 auto;\n    margin: 0;\n    visibility: hidden;\n    width: 0; } }\n\n/* Media Query\r\n========================================================================== */\n@media only screen and (max-width: 992px) {\n  .header-menu ul {\n    display: none; }\n  .header.is-showSearchMob {\n    padding: 0; }\n    .header.is-showSearchMob .header-logo,\n    .header.is-showSearchMob .nav-mob-toggle {\n      display: none; }\n    .header.is-showSearchMob .header-search {\n      border-radius: 0;\n      display: inline-block !important;\n      height: 50px;\n      margin: 0;\n      width: 100%; }\n      .header.is-showSearchMob .header-search input {\n        height: 50px;\n        padding-right: 48px; }\n      .header.is-showSearchMob .header-search .search-popout {\n        margin-top: 0; }\n    .header.is-showSearchMob .search-mob-toggle {\n      border: 0;\n      color: #757575;\n      position: absolute;\n      right: 0; }\n      .header.is-showSearchMob .search-mob-toggle:before {\n        content: \"\" !important; }\n  body.is-showNavMob {\n    overflow: hidden; }\n    body.is-showNavMob .nav-mob {\n      transform: translateX(0); }\n    body.is-showNavMob .nav-mob-toggle {\n      border: 0;\n      transform: rotate(90deg); }\n      body.is-showNavMob .nav-mob-toggle span:first-child {\n        transform: rotate(45deg) translate(0, 0); }\n      body.is-showNavMob .nav-mob-toggle span:nth-child(2) {\n        transform: scaleX(0); }\n      body.is-showNavMob .nav-mob-toggle span:last-child {\n        transform: rotate(-45deg) translate(0, 0); }\n    body.is-showNavMob .search-mob-toggle {\n      display: none; }\n    body.is-showNavMob .main, body.is-showNavMob .footer {\n      transform: translateX(-25%); } }\n\n.cover {\n  background: #4285f4;\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n  color: #fff;\n  letter-spacing: .2px;\n  min-height: 550px;\n  position: relative;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n  z-index: 2; }\n  .cover-wrap {\n    margin: 0 auto;\n    max-width: 1050px;\n    padding: 16px;\n    position: relative;\n    text-align: center;\n    z-index: 99; }\n  .cover-title {\n    font-size: 3.5rem;\n    margin: 0 0 50px;\n    line-height: 1;\n    font-weight: 700; }\n  .cover-description {\n    max-width: 600px; }\n  .cover-background {\n    background-attachment: fixed; }\n  .cover .mouse {\n    width: 25px;\n    position: absolute;\n    height: 36px;\n    border-radius: 15px;\n    border: 2px solid #888;\n    border: 2px solid rgba(255, 255, 255, 0.27);\n    bottom: 40px;\n    right: 40px;\n    margin-left: -12px;\n    cursor: pointer;\n    transition: border-color 0.2s ease-in; }\n    .cover .mouse .scroll {\n      display: block;\n      margin: 6px auto;\n      width: 3px;\n      height: 6px;\n      border-radius: 4px;\n      background: rgba(255, 255, 255, 0.68);\n      animation-duration: 2s;\n      animation-name: scroll;\n      animation-iteration-count: infinite; }\n\n.author a {\n  color: #FFF !important; }\n\n.author-header {\n  margin-top: 10%; }\n\n.author-name-wrap {\n  display: inline-block; }\n\n.author-title {\n  display: block;\n  text-transform: uppercase; }\n\n.author-name {\n  margin: 5px 0;\n  font-size: 1.75rem; }\n\n.author-bio {\n  margin: 1.5rem 0;\n  line-height: 1.8;\n  font-size: 18px;\n  max-width: 700px; }\n\n.author-avatar {\n  display: inline-block;\n  border-radius: 90px;\n  margin-right: 10px;\n  width: 80px;\n  height: 80px;\n  background-size: cover;\n  background-position: center;\n  vertical-align: bottom; }\n\n.author-meta {\n  margin-bottom: 20px; }\n  .author-meta span {\n    display: inline-block;\n    font-size: 17px;\n    font-style: italic;\n    margin: 0 2rem 1rem 0;\n    opacity: 0.8;\n    word-wrap: break-word; }\n\n.author .author-link:hover {\n  opacity: 1; }\n\n.author-follow a {\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  cursor: pointer;\n  display: inline-block;\n  height: 40px;\n  letter-spacing: 1px;\n  line-height: 40px;\n  margin: 0 10px;\n  padding: 0 16px;\n  text-shadow: none;\n  text-transform: uppercase; }\n  .author-follow a:hover {\n    box-shadow: inset 0 0 0 2px #fff; }\n\n.home-down {\n  animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100; }\n\n@media only screen and (min-width: 766px) {\n  .cover-description {\n    font-size: 1.25rem; } }\n\n@media only screen and (max-width: 766px) {\n  .cover {\n    padding-top: 50px;\n    padding-bottom: 20px; }\n    .cover-title {\n      font-size: 2rem; }\n  .author-avatar {\n    display: block;\n    margin: 0 auto 10px auto; } }\n\n.feed-entry-content .feed-entry-wrapper:last-child .entry:last-child {\n  padding: 0;\n  border: none; }\n\n.entry {\n  margin-bottom: 1.5rem;\n  padding: 0 15px 15px; }\n  .entry-image--link {\n    height: 180px;\n    margin: 0 -15px;\n    overflow: hidden; }\n    .entry-image--link:hover .entry-image--bg {\n      transform: scale(1.03);\n      backface-visibility: hidden; }\n  .entry-image--bg {\n    transition: transform 0.3s; }\n  .entry-video-play {\n    border-radius: 50%;\n    border: 2px solid #fff;\n    color: #fff;\n    font-size: 3.5rem;\n    height: 65px;\n    left: 50%;\n    line-height: 65px;\n    position: absolute;\n    text-align: center;\n    top: 50%;\n    transform: translate(-50%, -50%);\n    width: 65px;\n    z-index: 10; }\n  .entry-category {\n    margin-bottom: 5px;\n    text-transform: capitalize;\n    font-size: 0.875rem;\n    line-height: 1; }\n    .entry-category a:active {\n      text-decoration: underline; }\n  .entry-title {\n    color: #000;\n    font-size: 1.25rem;\n    height: auto;\n    line-height: 1.2;\n    margin: 0 0 .5rem;\n    padding: 0; }\n    .entry-title:hover {\n      color: #777; }\n  .entry-byline {\n    margin-top: 0;\n    margin-bottom: 0.5rem;\n    color: #999;\n    font-size: 0.8125rem; }\n    .entry-byline a {\n      color: inherit; }\n      .entry-byline a:hover {\n        color: #333; }\n  .entry-body {\n    padding-top: 20px; }\n\n/* Entry small --small\r\n========================================================================== */\n.entry.entry--small {\n  margin-bottom: 24px;\n  padding: 0; }\n  .entry.entry--small .entry-image {\n    margin-bottom: 10px; }\n  .entry.entry--small .entry-image--link {\n    height: 170px;\n    margin: 0; }\n  .entry.entry--small .entry-title {\n    font-size: 1rem;\n    font-weight: 500;\n    line-height: 1.2;\n    text-transform: capitalize; }\n  .entry.entry--small .entry-byline {\n    margin: 0; }\n\n@media only screen and (min-width: 992px) {\n  .entry {\n    margin-bottom: 40px;\n    padding: 0; }\n    .entry-title {\n      font-size: 21px; }\n    .entry-body {\n      padding-right: 35px !important; }\n    .entry-image {\n      margin-bottom: 0; }\n    .entry-image--link {\n      height: 180px;\n      margin: 0; } }\n\n@media only screen and (min-width: 1230px) {\n  .entry-image--link {\n    height: 218px; } }\n\n.footer {\n  color: rgba(0, 0, 0, 0.44);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1;\n  padding: 1.6rem 15px;\n  text-align: center; }\n  .footer a {\n    color: rgba(0, 0, 0, 0.6); }\n    .footer a:hover {\n      color: rgba(0, 0, 0, 0.8); }\n  .footer-wrap {\n    margin: 0 auto;\n    max-width: 1400px; }\n  .footer .heart {\n    animation: heartify .5s infinite alternate;\n    color: red; }\n  .footer-copy, .footer-design-author {\n    display: inline-block;\n    padding: .5rem 0;\n    vertical-align: middle; }\n  .footer-follow {\n    padding: 20px 0; }\n    .footer-follow a {\n      font-size: 20px;\n      margin: 0 5px;\n      color: rgba(0, 0, 0, 0.8); }\n\n@keyframes heartify {\n  0% {\n    transform: scale(0.8); } }\n\n.btn, .nav-mob-follow a {\n  background-color: #fff;\n  border-radius: 2px;\n  border: 0;\n  box-shadow: none;\n  color: #039be5;\n  cursor: pointer;\n  display: inline-block;\n  font: 500 14px/20px \"Roboto\", sans-serif;\n  height: 36px;\n  margin: 0;\n  min-width: 36px;\n  outline: 0;\n  overflow: hidden;\n  padding: 8px;\n  text-align: center;\n  text-decoration: none;\n  text-overflow: ellipsis;\n  text-transform: uppercase;\n  transition: background-color .2s,box-shadow .2s;\n  vertical-align: middle;\n  white-space: nowrap; }\n  .btn + .btn, .nav-mob-follow a + .btn, .nav-mob-follow .btn + a, .nav-mob-follow a + a {\n    margin-left: 8px; }\n  .btn:focus, .nav-mob-follow a:focus, .btn:hover, .nav-mob-follow a:hover {\n    background-color: #e1f3fc;\n    text-decoration: none !important; }\n  .btn:active, .nav-mob-follow a:active {\n    background-color: #c3e7f9; }\n  .btn.btn-lg, .nav-mob-follow a.btn-lg {\n    font-size: 1.5rem;\n    min-width: 48px;\n    height: 48px;\n    line-height: 48px; }\n  .btn.btn-flat, .nav-mob-follow a.btn-flat {\n    background: 0;\n    box-shadow: none; }\n    .btn.btn-flat:focus, .nav-mob-follow a.btn-flat:focus, .btn.btn-flat:hover, .nav-mob-follow a.btn-flat:hover, .btn.btn-flat:active, .nav-mob-follow a.btn-flat:active {\n      background: 0;\n      box-shadow: none; }\n  .btn.btn-primary, .nav-mob-follow a.btn-primary {\n    background-color: #4285f4;\n    color: #fff; }\n    .btn.btn-primary:hover, .nav-mob-follow a.btn-primary:hover {\n      background-color: #2f79f3; }\n  .btn.btn-circle, .nav-mob-follow a.btn-circle {\n    border-radius: 50%;\n    height: 40px;\n    line-height: 40px;\n    padding: 0;\n    width: 40px; }\n  .btn.btn-circle-small, .nav-mob-follow a.btn-circle-small {\n    border-radius: 50%;\n    height: 32px;\n    line-height: 32px;\n    padding: 0;\n    width: 32px;\n    min-width: 32px; }\n  .btn.btn-shadow, .nav-mob-follow a.btn-shadow {\n    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);\n    color: #333;\n    background-color: #eee; }\n    .btn.btn-shadow:hover, .nav-mob-follow a.btn-shadow:hover {\n      background-color: rgba(0, 0, 0, 0.12); }\n  .btn.btn-download-cloud, .nav-mob-follow a.btn-download-cloud, .btn.btn-download, .nav-mob-follow a.btn-download {\n    background-color: #4285f4;\n    color: #fff; }\n    .btn.btn-download-cloud:hover, .nav-mob-follow a.btn-download-cloud:hover, .btn.btn-download:hover, .nav-mob-follow a.btn-download:hover {\n      background-color: #1b6cf2; }\n    .btn.btn-download-cloud:after, .nav-mob-follow a.btn-download-cloud:after, .btn.btn-download:after, .nav-mob-follow a.btn-download:after {\n      margin-left: 5px;\n      font-size: 1.1rem;\n      display: inline-block;\n      vertical-align: top; }\n  .btn.btn-download:after, .nav-mob-follow a.btn-download:after {\n    content: \"\"; }\n  .btn.btn-download-cloud:after, .nav-mob-follow a.btn-download-cloud:after {\n    content: \"\"; }\n  .btn.external:after, .nav-mob-follow a.external:after {\n    font-size: 1rem; }\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate; }\n\n.form-control {\n  width: 100%;\n  padding: 8px 12px;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 0px;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\n  height: 36px; }\n  .form-control:focus {\n    border-color: #4285f4;\n    outline: 0;\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(66, 133, 244, 0.6); }\n\n.btn-subscribe-home {\n  background-color: transparent;\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #ffffff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  max-width: 300px;\n  padding: 15px 10px;\n  transition: all 0.3s;\n  width: 100%; }\n  .btn-subscribe-home:hover {\n    box-shadow: inset 0 0 0 2px #fff; }\n\n/*  Post\r\n========================================================================== */\n.post-wrapper {\n  margin-top: 50px;\n  padding-top: 1.8rem; }\n\n.post-header {\n  margin-bottom: 1.2rem; }\n\n.post-title {\n  color: #000;\n  font-size: 2.5rem;\n  height: auto;\n  line-height: 1.04;\n  margin: 0 0 0.9375rem;\n  letter-spacing: -.028em !important;\n  padding: 0; }\n\n.post-excerpt {\n  line-height: 1.3em;\n  font-size: 20px;\n  color: #7D7D7D;\n  margin-bottom: 8px; }\n\n.post-image {\n  margin-bottom: 30px;\n  overflow: hidden; }\n\n.post-body {\n  margin-bottom: 2rem; }\n  .post-body a:focus {\n    text-decoration: underline; }\n  .post-body h2 {\n    font-weight: 500;\n    margin: 2.50rem 0 1.25rem;\n    padding-bottom: 3px; }\n  .post-body h3, .post-body h4 {\n    margin: 32px 0 16px; }\n  .post-body iframe {\n    display: block !important;\n    margin: 0 auto 1.5rem 0 !important; }\n  .post-body img {\n    display: block;\n    margin-bottom: 1rem; }\n  .post-body h2 a, .post-body h3 a, .post-body h4 a {\n    color: #4285f4; }\n\n.post-tags {\n  margin: 1.25rem 0; }\n\n.post-card {\n  padding: 15px; }\n\n/* Post author by line top (author - time - tag - sahre)\r\n========================================================================== */\n.post-byline {\n  color: #999;\n  font-size: 14px;\n  flex-grow: 1;\n  letter-spacing: -.028em !important; }\n  .post-byline a {\n    color: inherit; }\n    .post-byline a:active {\n      text-decoration: underline; }\n    .post-byline a:hover {\n      color: #222; }\n\n.post-actions--top .share {\n  margin-right: 10px;\n  font-size: 20px; }\n  .post-actions--top .share:hover {\n    opacity: .7; }\n\n.post-action-comments {\n  color: #999;\n  margin-right: 15px;\n  font-size: 14px; }\n\n/* Post Action social media\r\n========================================================================== */\n.post-actions {\n  position: relative;\n  margin-bottom: 1.5rem; }\n  .post-actions a {\n    color: #fff;\n    font-size: 1.125rem; }\n    .post-actions a:hover {\n      background-color: #000 !important; }\n  .post-actions li {\n    margin-left: 6px; }\n    .post-actions li:first-child {\n      margin-left: 0 !important; }\n  .post-actions .btn, .post-actions .nav-mob-follow a, .nav-mob-follow .post-actions a {\n    border-radius: 0; }\n\n/* Post author widget bottom\r\n========================================================================== */\n.post-author {\n  position: relative;\n  font-size: 15px;\n  padding: 30px 0 30px 100px;\n  margin-bottom: 3rem;\n  background-color: #f3f5f6; }\n  .post-author h5 {\n    color: #AAA;\n    font-size: 12px;\n    line-height: 1.5;\n    margin: 0;\n    font-weight: 500; }\n  .post-author li {\n    margin-left: 30px;\n    font-size: 14px; }\n    .post-author li a {\n      color: #555; }\n      .post-author li a:hover {\n        color: #000; }\n    .post-author li:first-child {\n      margin-left: 0; }\n  .post-author-bio {\n    max-width: 500px; }\n  .post-author .post-author-avatar {\n    height: 64px;\n    width: 64px;\n    position: absolute;\n    left: 20px;\n    top: 30px;\n    background-position: center center;\n    background-size: cover;\n    border-radius: 50%; }\n\n/* bottom share and bottom subscribe\r\n========================================================================== */\n.share-subscribe {\n  margin-bottom: 1rem; }\n  .share-subscribe p {\n    color: #7d7d7d;\n    margin-bottom: 1rem;\n    line-height: 1;\n    font-size: 0.875rem; }\n  .share-subscribe .social-share {\n    float: none !important; }\n  .share-subscribe > div {\n    position: relative;\n    overflow: hidden;\n    margin-bottom: 15px; }\n    .share-subscribe > div:before {\n      content: \" \";\n      border-top: solid 1px #000;\n      position: absolute;\n      top: 0;\n      left: 15px;\n      width: 40px;\n      height: 1px; }\n    .share-subscribe > div h5 {\n      font-size: 0.875rem;\n      margin: 1rem 0;\n      line-height: 1;\n      text-transform: uppercase;\n      font-weight: 500; }\n  .share-subscribe .newsletter-form {\n    display: flex; }\n    .share-subscribe .newsletter-form .form-group {\n      max-width: 250px;\n      width: 100%; }\n    .share-subscribe .newsletter-form .btn, .share-subscribe .newsletter-form .nav-mob-follow a, .nav-mob-follow .share-subscribe .newsletter-form a {\n      border-radius: 0; }\n\n/* Related post\r\n========================================================================== */\n.post-related {\n  margin-top: 40px; }\n  .post-related-title {\n    color: #000;\n    font-size: 18px;\n    font-weight: 500;\n    height: auto;\n    line-height: 17px;\n    margin: 0 0 20px;\n    padding-bottom: 10px;\n    text-transform: uppercase; }\n  .post-related-list {\n    margin-bottom: 18px;\n    padding: 0;\n    border: none; }\n\n/* Media Query (medium)\r\n========================================================================== */\n@media only screen and (min-width: 766px) {\n  .post .title {\n    font-size: 2.25rem;\n    margin: 0 0 1rem; }\n  .post-body {\n    font-size: 1.125rem;\n    line-height: 32px; }\n    .post-body p {\n      margin-bottom: 1.5rem; }\n  .post-card {\n    padding: 30px; } }\n\n@media only screen and (max-width: 640px) {\n  .post-title {\n    font-size: 1.8rem; }\n  .post-image,\n  .video-responsive {\n    margin-left: -0.9375rem;\n    margin-right: -0.9375rem; } }\n\n/* sidebar\r\n========================================================================== */\n.sidebar {\n  position: relative;\n  line-height: 1.6; }\n  .sidebar h1, .sidebar h2, .sidebar h3, .sidebar h4, .sidebar h5, .sidebar h6 {\n    margin-top: 0;\n    color: #000; }\n  .sidebar-items {\n    margin-bottom: 2.5rem;\n    padding: 25px;\n    position: relative; }\n  .sidebar-title {\n    padding-bottom: 10px;\n    margin-bottom: 1rem;\n    text-transform: uppercase;\n    font-size: 1rem; }\n  .sidebar .title-primary {\n    background-color: #4285f4;\n    color: #FFF;\n    padding: 10px 16px;\n    font-size: 18px; }\n\n.sidebar-post--border {\n  align-items: center;\n  border-left: 3px solid #4285f4;\n  bottom: 0;\n  color: rgba(0, 0, 0, 0.2);\n  display: flex;\n  font-size: 28px;\n  font-weight: bold;\n  left: 0;\n  line-height: 1;\n  padding: 15px 10px 10px;\n  position: absolute;\n  top: 0; }\n\n.sidebar-post:nth-child(3n) .sidebar-post--border {\n  border-color: #f59e00; }\n\n.sidebar-post:nth-child(3n+2) .sidebar-post--border {\n  border-color: #00a034; }\n\n.sidebar-post--link {\n  display: block;\n  min-height: 50px;\n  padding: 10px 15px 10px 55px;\n  position: relative; }\n  .sidebar-post--link:hover .sidebar-post--border {\n    background-color: #e5eff5; }\n\n.sidebar-post--title {\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 16px;\n  font-weight: 500;\n  margin: 0; }\n\n.subscribe {\n  min-height: 90vh;\n  padding-top: 50px; }\n  .subscribe h3 {\n    margin: 0;\n    margin-bottom: 8px;\n    font: 400 20px/32px \"Roboto\", sans-serif; }\n  .subscribe-title {\n    font-weight: 400;\n    margin-top: 0; }\n  .subscribe-wrap {\n    max-width: 700px;\n    color: #7d878a;\n    padding: 1rem 0; }\n  .subscribe .form-group {\n    margin-bottom: 1.5rem; }\n    .subscribe .form-group.error input {\n      border-color: #ff5b5b; }\n  .subscribe .btn, .subscribe .nav-mob-follow a, .nav-mob-follow .subscribe a {\n    width: 100%; }\n\n.subscribe-form {\n  position: relative;\n  margin: 30px auto;\n  padding: 40px;\n  max-width: 400px;\n  width: 100%;\n  background: #ebeff2;\n  border-radius: 5px;\n  text-align: left; }\n\n.subscribe-input {\n  width: 100%;\n  padding: 10px;\n  border: #4285f4  1px solid;\n  border-radius: 2px; }\n  .subscribe-input:focus {\n    outline: none; }\n\n.animated {\n  animation-duration: 1s;\n  animation-fill-mode: both; }\n  .animated.infinite {\n    animation-iteration-count: infinite; }\n\n.bounceIn {\n  animation-name: bounceIn; }\n\n.bounceInDown {\n  animation-name: bounceInDown; }\n\n.slideInUp {\n  animation-name: slideInUp; }\n\n.slideOutDown {\n  animation-name: slideOutDown; }\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3); }\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1); }\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9); }\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03); }\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97); }\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0); }\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0); }\n  75% {\n    transform: translate3d(0, -10px, 0); }\n  90% {\n    transform: translate3d(0, 5px, 0); }\n  100% {\n    transform: none; } }\n\n@keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1); }\n  50% {\n    transform: scale3d(1.05, 1.05, 1.05); }\n  to {\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes scroll {\n  0% {\n    opacity: 0; }\n  10% {\n    opacity: 1;\n    transform: translateY(0px); }\n  100% {\n    opacity: 0;\n    transform: translateY(10px); } }\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg); }\n  to {\n    transform: rotate(360deg); } }\n\n@keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible; }\n  to {\n    transform: translate3d(0, 0, 0); } }\n\n@keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0); }\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0); } }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdHlsZXMvbWFpbi5zY3NzIiwibm9kZV9tb2R1bGVzL3ByaXNtanMvcGx1Z2lucy9saW5lLW51bWJlcnMvcHJpc20tbGluZS1udW1iZXJzLmNzcyIsInNyYy9zdHlsZXMvY29tbW9uL19pY29uLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fdmFyaWFibGVzLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fdXRpbGl0aWVzLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fZ2xvYmFsLnNjc3MiLCJzcmMvc3R5bGVzL2NvbXBvbmVudHMvX2dyaWQuc2NzcyIsInNyYy9zdHlsZXMvY29tbW9uL190eXBvZ3JhcGh5LnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX21lbnUuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9faGVhZGVyLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX2NvdmVyLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX2VudHJ5LnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX2Zvb3Rlci5zY3NzIiwic3JjL3N0eWxlcy9jb21wb25lbnRzL19idXR0b25zLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX3Bvc3Quc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9fc2lkZWJhci5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19zdWJzY3JpYmUuc2NzcyIsInNyYy9zdHlsZXMvY29tcG9uZW50cy9fYW5pbWF0ZWQuc2NzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAcGFja2FnZSBnb2RvZnJlZG9uaW5qYVxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5AY2hhcnNldCBcIlVURi04XCI7XHJcblxyXG4vLyBOb3JtYWxpemUgYW5kIGljb24gZm9udHMgKGxpYnJhcmllcylcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbkBpbXBvcnQgXCJ+bm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzXCI7XHJcbkBpbXBvcnQgXCJ+cHJpc21qcy90aGVtZXMvcHJpc20uY3NzXCI7XHJcbkBpbXBvcnQgXCJ+cHJpc21qcy9wbHVnaW5zL2xpbmUtbnVtYmVycy9wcmlzbS1saW5lLW51bWJlcnNcIjtcclxuXHJcbi8vICBpY29uc1xyXG5AaW1wb3J0IFwiY29tbW9uL2ljb25cIjtcclxuXHJcbi8vIE1peGlucyAmIFZhcmlhYmxlc1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5AaW1wb3J0IFwiY29tbW9uL3ZhcmlhYmxlc1wiO1xyXG5AaW1wb3J0IFwiY29tbW9uL3V0aWxpdGllc1wiO1xyXG5cclxuLy8gU3RydWN0dXJlXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbkBpbXBvcnQgXCJjb21tb24vZ2xvYmFsXCI7XHJcbkBpbXBvcnQgXCJjb21wb25lbnRzL2dyaWRcIjtcclxuQGltcG9ydCBcImNvbW1vbi90eXBvZ3JhcGh5XCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL21lbnVcIjtcclxuQGltcG9ydCBcImxheW91dHMvaGVhZGVyXCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL2NvdmVyXCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL2VudHJ5XCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL2Zvb3RlclwiO1xyXG5AaW1wb3J0IFwiY29tcG9uZW50cy9idXR0b25zXCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL3Bvc3RcIjtcclxuQGltcG9ydCBcImxheW91dHMvc2lkZWJhclwiO1xyXG5AaW1wb3J0IFwibGF5b3V0cy9zdWJzY3JpYmVcIjtcclxuQGltcG9ydCBcImNvbXBvbmVudHMvYW5pbWF0ZWRcIjtcclxuIiwicHJlLmxpbmUtbnVtYmVycyB7XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0cGFkZGluZy1sZWZ0OiAzLjhlbTtcblx0Y291bnRlci1yZXNldDogbGluZW51bWJlcjtcbn1cblxucHJlLmxpbmUtbnVtYmVycyA+IGNvZGUge1xuXHRwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgd2hpdGUtc3BhY2U6IGluaGVyaXQ7XG59XG5cbi5saW5lLW51bWJlcnMgLmxpbmUtbnVtYmVycy1yb3dzIHtcblx0cG9zaXRpb246IGFic29sdXRlO1xuXHRwb2ludGVyLWV2ZW50czogbm9uZTtcblx0dG9wOiAwO1xuXHRmb250LXNpemU6IDEwMCU7XG5cdGxlZnQ6IC0zLjhlbTtcblx0d2lkdGg6IDNlbTsgLyogd29ya3MgZm9yIGxpbmUtbnVtYmVycyBiZWxvdyAxMDAwIGxpbmVzICovXG5cdGxldHRlci1zcGFjaW5nOiAtMXB4O1xuXHRib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjOTk5O1xuXG5cdC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG5cdC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG5cdC1tcy11c2VyLXNlbGVjdDogbm9uZTtcblx0dXNlci1zZWxlY3Q6IG5vbmU7XG5cbn1cblxuXHQubGluZS1udW1iZXJzLXJvd3MgPiBzcGFuIHtcblx0XHRwb2ludGVyLWV2ZW50czogbm9uZTtcblx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRjb3VudGVyLWluY3JlbWVudDogbGluZW51bWJlcjtcblx0fVxuXG5cdFx0LmxpbmUtbnVtYmVycy1yb3dzID4gc3BhbjpiZWZvcmUge1xuXHRcdFx0Y29udGVudDogY291bnRlcihsaW5lbnVtYmVyKTtcblx0XHRcdGNvbG9yOiAjOTk5O1xuXHRcdFx0ZGlzcGxheTogYmxvY2s7XG5cdFx0XHRwYWRkaW5nLXJpZ2h0OiAwLjhlbTtcblx0XHRcdHRleHQtYWxpZ246IHJpZ2h0O1xuXHRcdH0iLCJAZm9udC1mYWNlIHtcclxuICBmb250LWZhbWlseTogJ21hcGFjaGUnO1xyXG4gIHNyYzpcclxuICAgIHVybCgnLi4vZm9udHMvbWFwYWNoZS50dGY/ZzdobXM4JykgZm9ybWF0KCd0cnVldHlwZScpLFxyXG4gICAgdXJsKCcuLi9mb250cy9tYXBhY2hlLndvZmY/ZzdobXM4JykgZm9ybWF0KCd3b2ZmJyksXHJcbiAgICB1cmwoJy4uL2ZvbnRzL21hcGFjaGUuc3ZnP2c3aG1zOCNtYXBhY2hlJykgZm9ybWF0KCdzdmcnKTtcclxuICBmb250LXdlaWdodDogbm9ybWFsO1xyXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcclxufVxyXG5cclxuW2NsYXNzXj1cImktXCJdOmJlZm9yZSwgW2NsYXNzKj1cIiBpLVwiXTpiZWZvcmUge1xyXG4gIC8qIHVzZSAhaW1wb3J0YW50IHRvIHByZXZlbnQgaXNzdWVzIHdpdGggYnJvd3NlciBleHRlbnNpb25zIHRoYXQgY2hhbmdlIGZvbnRzICovXHJcbiAgZm9udC1mYW1pbHk6ICdtYXBhY2hlJyAhaW1wb3J0YW50O1xyXG4gIHNwZWFrOiBub25lO1xyXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcclxuICBmb250LXdlaWdodDogbm9ybWFsO1xyXG4gIGZvbnQtdmFyaWFudDogbm9ybWFsO1xyXG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xyXG4gIGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xyXG5cclxuICAvKiBCZXR0ZXIgRm9udCBSZW5kZXJpbmcgPT09PT09PT09PT0gKi9cclxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcclxuICAtbW96LW9zeC1mb250LXNtb290aGluZzogZ3JheXNjYWxlO1xyXG59XHJcblxyXG4uaS1uYXZpZ2F0ZV9iZWZvcmU6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTQwOFwiO1xyXG59XHJcbi5pLW5hdmlnYXRlX25leHQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTQwOVwiO1xyXG59XHJcbi5pLXRhZzpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlNTRlXCI7XHJcbn1cclxuLmkta2V5Ym9hcmRfYXJyb3dfZG93bjpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlMzEzXCI7XHJcbn1cclxuLmktYXJyb3dfdXB3YXJkOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU1ZDhcIjtcclxufVxyXG4uaS1jbG91ZF9kb3dubG9hZDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlMmMwXCI7XHJcbn1cclxuLmktc3RhcjpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlODM4XCI7XHJcbn1cclxuLmkta2V5Ym9hcmRfYXJyb3dfdXA6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTMxNlwiO1xyXG59XHJcbi5pLW9wZW5faW5fbmV3OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU4OWVcIjtcclxufVxyXG4uaS13YXJuaW5nOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGUwMDJcIjtcclxufVxyXG4uaS1iYWNrOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU1YzRcIjtcclxufVxyXG4uaS1mb3J3YXJkOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU1YzhcIjtcclxufVxyXG4uaS1jaGF0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGUwY2JcIjtcclxufVxyXG4uaS1jbG9zZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlNWNkXCI7XHJcbn1cclxuLmktY29kZTI6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTg2ZlwiO1xyXG59XHJcbi5pLWZhdm9yaXRlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU4N2RcIjtcclxufVxyXG4uaS1saW5rOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGUxNTdcIjtcclxufVxyXG4uaS1tZW51OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU1ZDJcIjtcclxufVxyXG4uaS1mZWVkOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGUwZTVcIjtcclxufVxyXG4uaS1zZWFyY2g6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZThiNlwiO1xyXG59XHJcbi5pLXNoYXJlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU4MGRcIjtcclxufVxyXG4uaS1jaGVja19jaXJjbGU6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTg2Y1wiO1xyXG59XHJcbi5pLXBsYXk6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwMVwiO1xyXG59XHJcbi5pLWRvd25sb2FkOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU5MDBcIjtcclxufVxyXG4uaS1jb2RlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxMjFcIjtcclxufVxyXG4uaS1iZWhhbmNlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxYjRcIjtcclxufVxyXG4uaS1zcG90aWZ5OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxYmNcIjtcclxufVxyXG4uaS1jb2RlcGVuOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxY2JcIjtcclxufVxyXG4uaS1naXRodWI6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjA5YlwiO1xyXG59XHJcbi5pLWxpbmtlZGluOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYwZTFcIjtcclxufVxyXG4uaS1mbGlja3I6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjE2ZVwiO1xyXG59XHJcbi5pLWRyaWJiYmxlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxN2RcIjtcclxufVxyXG4uaS1waW50ZXJlc3Q6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjIzMVwiO1xyXG59XHJcbi5pLW1hcDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMDQxXCI7XHJcbn1cclxuLmktdHdpdHRlcjpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMDk5XCI7XHJcbn1cclxuLmktZmFjZWJvb2s6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjA5YVwiO1xyXG59XHJcbi5pLXlvdXR1YmU6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjE2YVwiO1xyXG59XHJcbi5pLWluc3RhZ3JhbTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMTZkXCI7XHJcbn1cclxuLmktZ29vZ2xlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxYTBcIjtcclxufVxyXG4uaS1wb2NrZXQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjI2NVwiO1xyXG59XHJcbi5pLXJlZGRpdDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMjgxXCI7XHJcbn1cclxuLmktc25hcGNoYXQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjJhY1wiO1xyXG59XHJcbi5pLXRlbGVncmFtOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYyYzZcIjtcclxufVxyXG4iLCIvKlxyXG5AcGFja2FnZSBnb2RvZnJlZG9uaW5qYVxyXG5cclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbk1hcGFjaGUgdmFyaWFibGVzIHN0eWxlc1xyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuKi9cclxuXHJcbi8qKlxyXG4qIFRhYmxlIG9mIENvbnRlbnRzOlxyXG4qXHJcbiogICAxLiBDb2xvcnNcclxuKiAgIDIuIEZvbnRzXHJcbiogICAzLiBUeXBvZ3JhcGh5XHJcbiogICA0LiBIZWFkZXJcclxuKiAgIDUuIEZvb3RlclxyXG4qICAgNi4gQ29kZSBTeW50YXhcclxuKiAgIDcuIGJ1dHRvbnNcclxuKiAgIDguIGNvbnRhaW5lclxyXG4qICAgOS4gR3JpZFxyXG4qICAgMTAuIE1lZGlhIFF1ZXJ5IFJhbmdlc1xyXG4qICAgMTEuIEljb25zXHJcbiovXHJcblxyXG5cclxuLyogMS4gQ29sb3JzXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRwcmltYXJ5LWNvbG9yICAgICAgICA6ICM0Mjg1ZjQ7XHJcbi8vICRwcmltYXJ5LWNvbG9yICAgICAgICA6ICMyODU2YjY7XHJcblxyXG4kcHJpbWFyeS10ZXh0LWNvbG9yOiAgIzMzMztcclxuJHNlY29uZGFyeS10ZXh0LWNvbG9yOiAgIzk5OTtcclxuJGFjY2VudC1jb2xvcjogICAgICAjZWVlO1xyXG5cclxuJGRpdmlkZXItY29sb3I6ICAgICAjREREREREO1xyXG5cclxuLy8gJGxpbmstY29sb3IgICAgIDogIzQxODRGMztcclxuJGxpbmstY29sb3IgICAgIDogIzAzOWJlNTtcclxuLy8gJGNvbG9yLWJnLXBhZ2UgIDogI0VFRUVFRTtcclxuXHJcblxyXG4vLyBzb2NpYWwgY29sb3JzXHJcbiRzb2NpYWwtY29sb3JzOiAoXHJcbiAgZmFjZWJvb2sgICAgOiAjM2I1OTk4LFxyXG4gIHR3aXR0ZXIgICAgIDogIzU1YWNlZSxcclxuICBnb29nbGUgICAgOiAjZGQ0YjM5LFxyXG4gIGluc3RhZ3JhbSAgIDogIzMwNjA4OCxcclxuICB5b3V0dWJlICAgICA6ICNlNTJkMjcsXHJcbiAgZ2l0aHViICAgICAgOiAjMzMzMzMzLFxyXG4gIGxpbmtlZGluICAgIDogIzAwN2JiNixcclxuICBzcG90aWZ5ICAgICA6ICMyZWJkNTksXHJcbiAgY29kZXBlbiAgICAgOiAjMjIyMjIyLFxyXG4gIGJlaGFuY2UgICAgIDogIzEzMTQxOCxcclxuICBkcmliYmJsZSAgICA6ICNlYTRjODksXHJcbiAgZmxpY2tyICAgICAgIDogIzAwNjNEQyxcclxuICByZWRkaXQgICAgOiBvcmFuZ2VyZWQsXHJcbiAgcG9ja2V0ICAgIDogI0Y1MDA1NyxcclxuICBwaW50ZXJlc3QgICA6ICNiZDA4MWMsXHJcbiAgZmVlZCAgICA6IG9yYW5nZSxcclxuICB0ZWxlZ3JhbSA6ICMwOGMsXHJcbik7XHJcblxyXG5cclxuXHJcbi8qIDIuIEZvbnRzXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRwcmltYXJ5LWZvbnQ6ICAgICdSb2JvdG8nLCBzYW5zLXNlcmlmOyAvLyBmb250IGRlZmF1bHQgcGFnZVxyXG4kY29kZS1mb250OiAgICAgJ1JvYm90byBNb25vJywgbW9ub3NwYWNlOyAvLyBmb250IGZvciBjb2RlIGFuZCBwcmVcclxuXHJcblxyXG4vKiAzLiBUeXBvZ3JhcGh5XHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG4kc3BhY2VyOiAgICAgICAgICAgICAgICAgICAxcmVtO1xyXG4kbGluZS1oZWlnaHQ6ICAgICAgICAgICAgICAxLjU7XHJcblxyXG4kZm9udC1zaXplLXJvb3Q6ICAgICAgICAgICAxNnB4O1xyXG5cclxuJGZvbnQtc2l6ZS1iYXNlOiAgICAgICAgICAgMXJlbTtcclxuJGZvbnQtc2l6ZS1sZzogICAgICAgICAgICAgMS4yNXJlbTsgLy8gMjBweFxyXG4kZm9udC1zaXplLXNtOiAgICAgICAgICAgICAuODc1cmVtOyAvLzE0cHhcclxuJGZvbnQtc2l6ZS14czogICAgICAgICAgICAgLjAuODEyNTsgLy8xM3B4XHJcblxyXG4kZm9udC1zaXplLWgxOiAgICAgICAgICAgICAyLjI1cmVtO1xyXG4kZm9udC1zaXplLWgyOiAgICAgICAgICAgICAxLjg3NXJlbTtcclxuJGZvbnQtc2l6ZS1oMzogICAgICAgICAgICAgMS41NjI1cmVtO1xyXG4kZm9udC1zaXplLWg0OiAgICAgICAgICAgICAxLjM3NXJlbTtcclxuJGZvbnQtc2l6ZS1oNTogICAgICAgICAgICAgMS4xMjVyZW07XHJcbiRmb250LXNpemUtaDY6ICAgICAgICAgICAgIDFyZW07XHJcblxyXG5cclxuJGhlYWRpbmdzLW1hcmdpbi1ib3R0b206ICAgKCRzcGFjZXIgLyAyKTtcclxuJGhlYWRpbmdzLWZvbnQtZmFtaWx5OiAgICAgJHByaW1hcnktZm9udDtcclxuJGhlYWRpbmdzLWZvbnQtd2VpZ2h0OiAgICAgNzAwO1xyXG4kaGVhZGluZ3MtbGluZS1oZWlnaHQ6ICAgICAxLjE7XHJcbiRoZWFkaW5ncy1jb2xvcjogICAgICAgICAgIGluaGVyaXQ7XHJcblxyXG4kZm9udC13ZWlnaHQ6ICAgICAgIDUwMDtcclxuXHJcbiRibG9ja3F1b3RlLWZvbnQtc2l6ZTogICAgIDEuMTI1cmVtO1xyXG5cclxuXHJcbi8qIDQuIEhlYWRlclxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4kaGVhZGVyLWJnOiAkcHJpbWFyeS1jb2xvcjtcclxuJGhlYWRlci1jb2xvcjogI2ZmZjtcclxuJGhlYWRlci1oZWlnaHQ6IDUwcHg7XHJcbiRoZWFkZXItc2VhcmNoLWJnOiAjZWVlO1xyXG4kaGVhZGVyLXNlYXJjaC1jb2xvcjogIzc1NzU3NTtcclxuXHJcblxyXG4vKiA1LiBFbnRyeSBhcnRpY2xlc1xyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4kZW50cnktY29sb3ItdGl0bGU6ICMwMDA7XHJcbiRlbnRyeS1jb2xvci10aXRsZS1ob3ZlcjogIzc3NztcclxuJGVudHJ5LWZvbnQtc2l6ZTogMS43NXJlbTsgLy8gMjhweFxyXG4kZW50cnktZm9udC1zaXplLW1iOiAxLjI1cmVtOyAvLyAyMHB4XHJcbiRlbnRyeS1mb250LXNpemUtYnlsaW5lOiAwLjgxMjVyZW07IC8vIDEzcHhcclxuJGVudHJ5LWNvbG9yLWJ5bGluZTogIzk5OTtcclxuXHJcbi8qIDUuIEZvb3RlclxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4vLyAkZm9vdGVyLWJnLWNvbG9yOiAgICMwMDA7XHJcbiRmb290ZXItY29sb3ItbGluazogcmdiYSgwLCAwLCAwLCAuNik7XHJcbiRmb290ZXItY29sb3I6ICAgICAgcmdiYSgwLCAwLCAwLCAuNDQpO1xyXG5cclxuXHJcbi8qIDYuIENvZGUgU3ludGF4XHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRjb2RlLWJnLWNvbG9yOiAgICAgICAjZjdmN2Y3O1xyXG4kZm9udC1zaXplLWNvZGU6ICAgICAgMC45Mzc1cmVtO1xyXG4kY29kZS1jb2xvcjogICAgICAgICNjNzI1NGU7XHJcbiRwcmUtY29kZS1jb2xvcjogICAgICAgICMzNzQ3NGY7XHJcblxyXG5cclxuLyogNy4gYnV0dG9uc1xyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4kYnRuLXByaW1hcnktY29sb3I6ICAgICAgICRwcmltYXJ5LWNvbG9yO1xyXG4kYnRuLXNlY29uZGFyeS1jb2xvcjogICAgICMwMzliZTU7XHJcbiRidG4tYmFja2dyb3VuZC1jb2xvcjogICAgI2UxZjNmYztcclxuJGJ0bi1hY3RpdmUtYmFja2dyb3VuZDogICAjYzNlN2Y5O1xyXG5cclxuLyogOC4gY29udGFpbmVyXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG4kZ3JpZC1ndXR0ZXItd2lkdGg6ICAgICAgICAxLjg3NXJlbTsgLy8gMzBweFxyXG5cclxuJGNvbnRhaW5lci1zbTogICAgICAgICAgICAgNTc2cHg7XHJcbiRjb250YWluZXItbWQ6ICAgICAgICAgICAgIDc1MHB4O1xyXG4kY29udGFpbmVyLWxnOiAgICAgICAgICAgICA5NzBweDtcclxuJGNvbnRhaW5lci14bDogICAgICAgICAgICAgMTI1MHB4O1xyXG5cclxuXHJcbi8qIDkuIEdyaWRcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuJG51bS1jb2xzOiAxMjtcclxuJGd1dHRlci13aWR0aDogMS44NzVyZW07XHJcbiRlbGVtZW50LXRvcC1tYXJnaW46ICRndXR0ZXItd2lkdGgvMztcclxuJGVsZW1lbnQtYm90dG9tLW1hcmdpbjogKCRndXR0ZXItd2lkdGgqMikvMztcclxuXHJcblxyXG4vKiAxMC4gTWVkaWEgUXVlcnkgUmFuZ2VzXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRzbTogICAgICAgICAgICA2NDBweDtcclxuJG1kOiAgICAgICAgICAgIDc2NnB4O1xyXG4kbGc6ICAgICAgICAgICAgOTkycHg7XHJcbiR4bDogICAgICAgICAgICAxMjMwcHg7XHJcblxyXG4kc20tYW5kLXVwOiAgICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aCA6ICN7JHNtfSlcIjtcclxuJG1kLWFuZC11cDogICAgIFwib25seSBzY3JlZW4gYW5kIChtaW4td2lkdGggOiAjeyRtZH0pXCI7XHJcbiRsZy1hbmQtdXA6ICAgICBcIm9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoIDogI3skbGd9KVwiO1xyXG4keGwtYW5kLXVwOiAgICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aCA6ICN7JHhsfSlcIjtcclxuXHJcbiRzbS1hbmQtZG93bjogICBcIm9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoIDogI3skc219KVwiO1xyXG4kbWQtYW5kLWRvd246ICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aCA6ICN7JG1kfSlcIjtcclxuJGxnLWFuZC1kb3duOiAgIFwib25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGggOiAjeyRsZ30pXCI7XHJcblxyXG5cclxuLyogMTEuIGljb25zXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRpLW9wZW5faW5fbmV3OiAgICAgICdcXGU4OWUnO1xyXG4kaS13YXJuaW5nOiAgICAgICAgICAnXFxlMDAyJztcclxuJGktc3RhcjogICAgICAgICAgICAgJ1xcZTgzOCc7XHJcbiRpLWRvd25sb2FkOiAgICAgICAgICdcXGU5MDAnO1xyXG4kaS1jbG91ZF9kb3dubG9hZDogICAnXFxlMmMwJztcclxuJGktY2hlY2tfY2lyY2xlOiAgICAgJ1xcZTg2Yyc7XHJcbiRpLXBsYXk6ICAgICAgIFwiXFxlOTAxXCI7XHJcbiRpLWNvZGU6ICAgICAgIFwiXFxmMTIxXCI7XHJcbiRpLWNsb3NlOiAgICAgIFwiXFxlNWNkXCI7XHJcbiIsIi8vIGJveC1zaGFkb3dcclxuJXByaW1hcnktYm94LXNoYWRvdyB7XHJcbiAgYm94LXNoYWRvdzogMCAwIDRweCByZ2JhKDAsIDAsIDAsIC4xNCksIDAgNHB4IDhweCByZ2JhKDAsIDAsIDAsIC4yOCk7XHJcbn1cclxuXHJcbiVmb250LWljb25zIHtcclxuICBmb250LWZhbWlseTogJ21hcGFjaGUnICFpbXBvcnRhbnQ7XHJcbiAgc3BlYWs6IG5vbmU7XHJcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xyXG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XHJcbiAgZm9udC12YXJpYW50OiBub3JtYWw7XHJcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XHJcbiAgbGluZS1oZWlnaHQ6IDE7XHJcblxyXG4gIC8qIEJldHRlciBGb250IFJlbmRlcmluZyA9PT09PT09PT09PSAqL1xyXG4gIC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xyXG4gIC1tb3otb3N4LWZvbnQtc21vb3RoaW5nOiBncmF5c2NhbGU7XHJcbn1cclxuXHJcbi8vICBDbGVhciBib3RoXHJcbi51LWNsZWFyIHtcclxuICAmOjphZnRlciB7XHJcbiAgICBjbGVhcjogYm90aDtcclxuICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICBkaXNwbGF5OiB0YWJsZTtcclxuICB9XHJcbn1cclxuXHJcbi51LW5vdC1hdmF0YXIgeyBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy4uL2ltYWdlcy9hdmF0YXIucG5nJykgfVxyXG4udS1yZWxhdGl2ZSB7IHBvc2l0aW9uOiByZWxhdGl2ZSB9XHJcbi51LWJsb2NrIHsgZGlzcGxheTogYmxvY2sgfVxyXG5cclxuLnUtYWJzb2x1dGUwIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgbGVmdDogMDtcclxuICB0b3A6IDA7XHJcbiAgcmlnaHQ6IDA7XHJcbiAgYm90dG9tOiAwO1xyXG59XHJcblxyXG4udS1iZy1jb3ZlciB7XHJcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xyXG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XHJcbn1cclxuXHJcbi51LWJnLWdyYWRpZW50IHtcclxuICBiYWNrZ3JvdW5kOiAtd2Via2l0LWdyYWRpZW50KGxpbmVhciwgbGVmdCB0b3AsIGxlZnQgYm90dG9tLCBmcm9tKHJnYmEoMCwgMCwgMCwgMC4xKSksIHRvKHJnYmEoMCwgMCwgMCwgMC44KSkpO1xyXG59XHJcblxyXG4vLyBib3JkZXItXHJcbi51LWJvcmRlci1ib3R0b20tZGFyayB7IGJvcmRlci1ib3R0b206IHNvbGlkIDFweCAjMDAwOyB9XHJcbi51LWItdCB7IGJvcmRlci10b3A6IHNvbGlkIDFweCAjZWVlOyB9XHJcblxyXG4vLyBQYWRkaW5nXHJcbi51LXAtdC0yIHsgcGFkZGluZy10b3A6IDJyZW0gfVxyXG5cclxuLy8gRWxpbWluYXIgbGEgbGlzdGEgZGUgbGEgPHVsPlxyXG4udS11bnN0eWxlZCB7XHJcbiAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xyXG4gIG1hcmdpbjogMDtcclxuICBwYWRkaW5nLWxlZnQ6IDA7XHJcbn1cclxuXHJcbi51LWZsb2F0TGVmdCB7IGZsb2F0OiBsZWZ0ICFpbXBvcnRhbnQ7IH1cclxuLnUtZmxvYXRSaWdodCB7IGZsb2F0OiByaWdodCAhaW1wb3J0YW50OyB9XHJcblxyXG4vLyAgZmxleCBib3hcclxuLnUtZmxleCB7IGRpc3BsYXk6IGZsZXg7IGZsZXgtZGlyZWN0aW9uOiByb3c7IH1cclxuLnUtZmxleC13cmFwIHsgZGlzcGxheTogZmxleDsgZmxleC13cmFwOiB3cmFwOyB9XHJcbi51LWZsZXgtY2VudGVyIHsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsgfVxyXG4udS1mbGV4LWFsaW5nLXJpZ2h0IHsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDsgfVxyXG4udS1mbGV4LWFsaW5nLWNlbnRlciB7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGp1c3RpZnktY29udGVudDogY2VudGVyOyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyB9XHJcblxyXG4vLyBtYXJnaW5cclxuLnUtbS10LTEgeyBtYXJnaW4tdG9wOiAxcmVtIH1cclxuXHJcbi8qIFRhZ3NcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLnUtdGFncyB7XHJcbiAgZm9udC1zaXplOiAxMnB4ICFpbXBvcnRhbnQ7XHJcbiAgbWFyZ2luOiAzcHggIWltcG9ydGFudDtcclxuICBjb2xvcjogIzRjNTc2NSAhaW1wb3J0YW50O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNlYmViZWIgIWltcG9ydGFudDtcclxuICB0cmFuc2l0aW9uOiBhbGwgLjNzO1xyXG5cclxuICAmOjpiZWZvcmUge1xyXG4gICAgcGFkZGluZy1yaWdodDogNXB4O1xyXG4gICAgb3BhY2l0eTogLjg7XHJcbiAgfVxyXG5cclxuICAmOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRwcmltYXJ5LWNvbG9yICFpbXBvcnRhbnQ7XHJcbiAgICBjb2xvcjogI2ZmZiAhaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG5cclxuLy8gT25seSAxIHRhZ3NcclxuLnUtdGFnIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAkcHJpbWFyeS1jb2xvcjtcclxuICBjb2xvcjogI2ZmZjtcclxuICBwYWRkaW5nOiA0cHggMTJweDtcclxuICBmb250LXNpemU6IDExcHg7XHJcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbn1cclxuXHJcbi8vIGhpZGUgZ2xvYmFsXHJcbi51LWhpZGUgeyBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQgfVxyXG5cclxuLnUtY2FyZC1zaGFkb3cge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XHJcbiAgYm94LXNoYWRvdzogMCA1cHggNXB4IHJnYmEoMCwgMCwgMCwgLjAyKTtcclxufVxyXG5cclxuLnUtbm90LWltYWdlIHtcclxuICBiYWNrZ3JvdW5kLXJlcGVhdDogcmVwZWF0O1xyXG4gIGJhY2tncm91bmQtc2l6ZTogaW5pdGlhbCAhaW1wb3J0YW50O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XHJcbn1cclxuXHJcbi8vIGhpZGUgYmVmb3JlXHJcbkBtZWRpYSAjeyRtZC1hbmQtZG93bn0geyAudS1oLWItbWQgeyBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQgfSB9XHJcblxyXG5AbWVkaWEgI3skbGctYW5kLWRvd259IHsgLnUtaC1iLWxnIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50IH0gfVxyXG5cclxuLy8gaGlkZSBhZnRlclxyXG5AbWVkaWEgI3skbWQtYW5kLXVwfSB7IC51LWgtYS1tZCB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudCB9IH1cclxuXHJcbkBtZWRpYSAjeyRsZy1hbmQtdXB9IHsgLnUtaC1hLWxnIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50IH0gfVxyXG4iLCJodG1sIHtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIC8vIFNldHMgYSBzcGVjaWZpYyBkZWZhdWx0IGBmb250LXNpemVgIGZvciB1c2VyIHdpdGggYHJlbWAgdHlwZSBzY2FsZXMuXHJcbiAgZm9udC1zaXplOiAkZm9udC1zaXplLXJvb3Q7XHJcbiAgLy8gQ2hhbmdlcyB0aGUgZGVmYXVsdCB0YXAgaGlnaGxpZ2h0IHRvIGJlIGNvbXBsZXRlbHkgdHJhbnNwYXJlbnQgaW4gaU9TLlxyXG4gIC13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTtcclxufVxyXG5cclxuKixcclxuKjo6YmVmb3JlLFxyXG4qOjphZnRlciB7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxufVxyXG5cclxuYSB7XHJcbiAgY29sb3I6ICRsaW5rLWNvbG9yO1xyXG4gIG91dGxpbmU6IDA7XHJcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gIC8vIEdldHMgcmlkIG9mIHRhcCBhY3RpdmUgc3RhdGVcclxuICAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG5cclxuICAmOmZvY3VzIHtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgIC8vIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gIH1cclxuXHJcbiAgJi5leHRlcm5hbCB7XHJcbiAgICAmOjphZnRlciB7XHJcbiAgICAgIEBleHRlbmQgJWZvbnQtaWNvbnM7XHJcblxyXG4gICAgICBjb250ZW50OiAkaS1vcGVuX2luX25ldztcclxuICAgICAgbWFyZ2luLWxlZnQ6IDVweDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmJvZHkge1xyXG4gIC8vIE1ha2UgdGhlIGBib2R5YCB1c2UgdGhlIGBmb250LXNpemUtcm9vdGBcclxuICBjb2xvcjogJHByaW1hcnktdGV4dC1jb2xvcjtcclxuICBmb250LWZhbWlseTogJHByaW1hcnktZm9udDtcclxuICBmb250LXNpemU6ICRmb250LXNpemUtYmFzZTtcclxuICBsaW5lLWhlaWdodDogJGxpbmUtaGVpZ2h0O1xyXG4gIG1hcmdpbjogMCBhdXRvO1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XHJcbn1cclxuXHJcbmZpZ3VyZSB7IG1hcmdpbjogMDsgfVxyXG5cclxuaW1nIHtcclxuICBoZWlnaHQ6IGF1dG87XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XHJcbiAgd2lkdGg6IGF1dG87XHJcblxyXG4gICY6bm90KFtzcmNdKSB7XHJcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgfVxyXG59XHJcblxyXG4uaW1nLXJlc3BvbnNpdmUge1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIG1heC13aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6IGF1dG87XHJcbn1cclxuXHJcbmkge1xyXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xyXG59XHJcblxyXG5ociB7XHJcbiAgYmFja2dyb3VuZDogI0YxRjJGMTtcclxuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsI0YxRjJGMSAwLCNiNWI1YjUgNTAlLCNGMUYyRjEgMTAwJSk7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIGhlaWdodDogMXB4O1xyXG4gIG1hcmdpbjogODBweCBhdXRvO1xyXG4gIG1heC13aWR0aDogOTAlO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbiAgJjo6YmVmb3JlIHtcclxuICAgIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgICBjb2xvcjogcmdiYSg3Myw1NSw2NSwuNzUpO1xyXG4gICAgY29udGVudDogJGktY29kZTtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgZm9udC1zaXplOiAzNXB4O1xyXG4gICAgbGVmdDogNTAlO1xyXG4gICAgcGFkZGluZzogMCAyNXB4O1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiA1MCU7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLC01MCUpO1xyXG4gICAgQGV4dGVuZCAlZm9udC1pY29ucztcclxuICB9XHJcbn1cclxuXHJcbmJsb2NrcXVvdGUge1xyXG4gIGJvcmRlci1sZWZ0OiA0cHggc29saWQgJHByaW1hcnktY29sb3I7XHJcbiAgcGFkZGluZzogLjc1cmVtIDEuNXJlbTtcclxuICBiYWNrZ3JvdW5kOiAjZmJmYmZjO1xyXG4gIGNvbG9yOiAjNzU3NTc1O1xyXG4gIGZvbnQtc2l6ZTogJGJsb2NrcXVvdGUtZm9udC1zaXplO1xyXG4gIGxpbmUtaGVpZ2h0OiAxLjc7XHJcbiAgbWFyZ2luOiAwIDAgMS4yNXJlbTtcclxuICBxdW90ZXM6IG5vbmU7XHJcbn1cclxuXHJcbm9sLHVsLGJsb2NrcXVvdGUge1xyXG4gIG1hcmdpbi1sZWZ0OiAycmVtO1xyXG59XHJcblxyXG5zdHJvbmcge1xyXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbn1cclxuXHJcbnNtYWxsLCAuc21hbGwge1xyXG4gIGZvbnQtc2l6ZTogODUlO1xyXG59XHJcblxyXG5vbCB7XHJcbiAgcGFkZGluZy1sZWZ0OiA0MHB4O1xyXG4gIGxpc3Qtc3R5bGU6IGRlY2ltYWwgb3V0c2lkZTtcclxufVxyXG5cclxubWFyayB7XHJcbiAgLy8gYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgbGlnaHRlbigkcHJpbWFyeS1jb2xvciwgMzUlKSwgbGlnaHRlbigkcHJpbWFyeS1jb2xvciwgMzAlKSk7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZkZmZiNjtcclxufVxyXG5cclxuLmZvb3RlcixcclxuLm1haW4ge1xyXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuNXMgZWFzZTtcclxuICB6LWluZGV4OiAyO1xyXG59XHJcblxyXG4vLyAubWFwYWNoZS1mYWNlYm9vayB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsgfVxyXG5cclxuLyogQ29kZSBTeW50YXhcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxua2JkLHNhbXAsY29kZSB7XHJcbiAgZm9udC1mYW1pbHk6ICRjb2RlLWZvbnQgIWltcG9ydGFudDtcclxuICBmb250LXNpemU6ICRmb250LXNpemUtY29kZTtcclxuICBjb2xvcjogJGNvZGUtY29sb3I7XHJcbiAgYmFja2dyb3VuZDogJGNvZGUtYmctY29sb3I7XHJcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gIHBhZGRpbmc6IDRweCA2cHg7XHJcbiAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xyXG59XHJcblxyXG5jb2RlW2NsYXNzKj1sYW5ndWFnZS1dLFxyXG5wcmVbY2xhc3MqPWxhbmd1YWdlLV0ge1xyXG4gIGNvbG9yOiAkcHJlLWNvZGUtY29sb3I7XHJcbiAgbGluZS1oZWlnaHQ6IDEuNTtcclxuXHJcbiAgLnRva2VuLmNvbW1lbnQgeyBvcGFjaXR5OiAuODsgfVxyXG5cclxuICAmLmxpbmUtbnVtYmVycyB7XHJcbiAgICBwYWRkaW5nLWxlZnQ6IDU4cHg7XHJcblxyXG4gICAgJjo6YmVmb3JlIHtcclxuICAgICAgY29udGVudDogXCJcIjtcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICBsZWZ0OiAwO1xyXG4gICAgICB0b3A6IDA7XHJcbiAgICAgIGJhY2tncm91bmQ6ICNGMEVERUU7XHJcbiAgICAgIHdpZHRoOiA0MHB4O1xyXG4gICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAubGluZS1udW1iZXJzLXJvd3Mge1xyXG4gICAgYm9yZGVyLXJpZ2h0OiBub25lO1xyXG4gICAgdG9wOiAtM3B4O1xyXG4gICAgbGVmdDogLTU4cHg7XHJcblxyXG4gICAgJiA+IHNwYW46OmJlZm9yZSB7XHJcbiAgICAgIHBhZGRpbmctcmlnaHQ6IDA7XHJcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgb3BhY2l0eTogLjg7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5wcmUge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICRjb2RlLWJnLWNvbG9yIWltcG9ydGFudDtcclxuICBwYWRkaW5nOiAxcmVtO1xyXG4gIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gIHdvcmQtd3JhcDogbm9ybWFsO1xyXG4gIG1hcmdpbjogMi41cmVtIDAhaW1wb3J0YW50O1xyXG4gIGZvbnQtZmFtaWx5OiAkY29kZS1mb250ICFpbXBvcnRhbnQ7XHJcbiAgZm9udC1zaXplOiAkZm9udC1zaXplLWNvZGU7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG5cclxuICBjb2RlIHtcclxuICAgIGNvbG9yOiAkcHJlLWNvZGUtY29sb3I7XHJcbiAgICB0ZXh0LXNoYWRvdzogMCAxcHggI2ZmZjtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICB9XHJcbn1cclxuXHJcbi8qIC53YXJuaW5nICYgLm5vdGUgJiAuc3VjY2Vzc1xyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4ud2FybmluZyB7XHJcbiAgYmFja2dyb3VuZDogI2ZiZTllNztcclxuICBjb2xvcjogI2Q1MDAwMDtcclxuICAmOmJlZm9yZXtjb250ZW50OiAkaS13YXJuaW5nO31cclxufVxyXG5cclxuLm5vdGV7XHJcbiAgYmFja2dyb3VuZDogI2UxZjVmZTtcclxuICBjb2xvcjogIzAyODhkMTtcclxuICAmOmJlZm9yZXtjb250ZW50OiAkaS1zdGFyO31cclxufVxyXG5cclxuLnN1Y2Nlc3N7XHJcbiAgYmFja2dyb3VuZDogI2UwZjJmMTtcclxuICBjb2xvcjogIzAwODk3YjtcclxuICAmOmJlZm9yZXtjb250ZW50OiAkaS1jaGVja19jaXJjbGU7Y29sb3I6ICMwMGJmYTU7fVxyXG59XHJcblxyXG4ud2FybmluZywgLm5vdGUsIC5zdWNjZXNze1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIG1hcmdpbjogMXJlbSAwO1xyXG4gIGZvbnQtc2l6ZTogMXJlbTtcclxuICBwYWRkaW5nOiAxMnB4IDI0cHggMTJweCA2MHB4O1xyXG4gIGxpbmUtaGVpZ2h0OiAxLjU7XHJcbiAgYXtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xyXG4gICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgfVxyXG4gICY6YmVmb3Jle1xyXG4gICAgbWFyZ2luLWxlZnQ6IC0zNnB4O1xyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICBAZXh0ZW5kICVmb250LWljb25zO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8qIFNvY2lhbCBpY29uIGNvbG9yIGFuZCBiYWNrZ3JvdW5kXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbkBlYWNoICRzb2NpYWwtbmFtZSwgJGNvbG9yIGluICRzb2NpYWwtY29sb3JzIHtcclxuICAuYy0jeyRzb2NpYWwtbmFtZX17XHJcbiAgICBjb2xvcjogJGNvbG9yO1xyXG4gIH1cclxuICAuYmctI3skc29jaWFsLW5hbWV9e1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJGNvbG9yICFpbXBvcnRhbnQ7XHJcbiAgfVxyXG59XHJcblxyXG4vLyAgQ2xlYXIgYm90aFxyXG4uY2xlYXJ7XHJcbiAgJjphZnRlciB7XHJcbiAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgZGlzcGxheTogdGFibGU7XHJcbiAgICBjbGVhcjogYm90aDtcclxuICB9XHJcbn1cclxuXHJcbi8qIHBhZ2luYXRpb24gSW5maW5pdGUgc2Nyb2xsXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5tYXBhY2hlLWxvYWQtbW9yZXtcclxuICBib3JkZXI6IHNvbGlkIDFweCAjQzNDM0MzO1xyXG4gIGNvbG9yOiAjN0Q3RDdEO1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIGZvbnQtc2l6ZTogMTVweDtcclxuICBoZWlnaHQ6IDQ1cHg7XHJcbiAgbWFyZ2luOiA0cmVtIGF1dG87XHJcbiAgcGFkZGluZzogMTFweCAxNnB4O1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgd2lkdGg6IDEwMCU7XHJcblxyXG4gICY6aG92ZXJ7XHJcbiAgICBiYWNrZ3JvdW5kOiAkcHJpbWFyeS1jb2xvcjtcclxuICAgIGJvcmRlci1jb2xvcjogJHByaW1hcnktY29sb3I7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICB9XHJcbn1cclxuXHJcbi8vIC5wYWdpbmF0aW9uIG5hdlxyXG4ucGFnaW5hdGlvbi1uYXZ7XHJcbiAgcGFkZGluZzogMi41cmVtIDAgM3JlbTtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgLnBhZ2UtbnVtYmVye1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICAgIHBhZGRpbmctdG9wOiA1cHg7XHJcbiAgICBAbWVkaWEgI3skbWQtYW5kLXVwfXtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fVxyXG4gIH1cclxuICAubmV3ZXItcG9zdHN7XHJcbiAgICBmbG9hdDogbGVmdDtcclxuICB9XHJcbiAgLm9sZGVyLXBvc3Rze1xyXG4gICAgZmxvYXQ6IHJpZ2h0XHJcbiAgfVxyXG59XHJcblxyXG4vKiBTY3JvbGwgVG9wXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5zY3JvbGxfdG9we1xyXG4gIGJvdHRvbTogNTBweDtcclxuICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgcmlnaHQ6IDIwcHg7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIHotaW5kZXg6IDExO1xyXG4gIHdpZHRoOiA2MHB4O1xyXG4gIG9wYWNpdHk6IDA7XHJcbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xyXG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMC41cyBlYXNlO1xyXG5cclxuICAmLnZpc2libGV7XHJcbiAgICBvcGFjaXR5OiAxO1xyXG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcclxuICB9XHJcblxyXG4gICY6aG92ZXIgc3ZnIHBhdGgge1xyXG4gICAgZmlsbDogcmdiYSgwLDAsMCwuNik7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBzdmcgYWxsIGljb25zXHJcbi5zdmctaWNvbiBzdmcge1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDogYXV0bztcclxuICBkaXNwbGF5OiBibG9jaztcclxuICBmaWxsOiBjdXJyZW50Y29sb3I7XHJcbn1cclxuXHJcbi8qIFZpZGVvIFJlc3BvbnNpdmVcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLnZpZGVvLXJlc3BvbnNpdmV7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIGhlaWdodDogMDtcclxuICBwYWRkaW5nOiAwO1xyXG4gIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgcGFkZGluZy1ib3R0b206IDU2LjI1JTtcclxuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XHJcbiAgaWZyYW1le1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYm9yZGVyOiAwO1xyXG4gIH1cclxufVxyXG5cclxuLyogVmlkZW8gZnVsbCBmb3IgdGFnIHZpZGVvXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiN2aWRlby1mb3JtYXR7XHJcbiAgLnZpZGVvLWNvbnRlbnR7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgcGFkZGluZy1ib3R0b206IDFyZW07XHJcbiAgICBzcGFue1xyXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XHJcbiAgICAgIG1hcmdpbi1yaWdodDogLjhyZW07XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKiBQYWdlIGVycm9yIDQwNFxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4uZXJyb3JQYWdle1xyXG4gIGZvbnQtZmFtaWx5OiAnUm9ib3RvIE1vbm8nLCBtb25vc3BhY2U7XHJcbiAgaGVpZ2h0OiAxMDB2aDtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgd2lkdGg6IDEwMCU7XHJcblxyXG4gICYtdGl0bGV7XHJcbiAgICBwYWRkaW5nOiAyNHB4IDYwcHg7XHJcbiAgfVxyXG5cclxuICAmLWxpbmt7XHJcbiAgICBjb2xvcjogcmdiYSgwLDAsMCwwLjU0KTtcclxuICAgIGZvbnQtc2l6ZTogMjJweDtcclxuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICBsZWZ0OiAtNXB4O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgdGV4dC1yZW5kZXJpbmc6IG9wdGltaXplTGVnaWJpbGl0eTtcclxuICAgIHRvcDogLTZweDtcclxuICB9XHJcblxyXG4gICYtZW1vaml7XHJcbiAgICBjb2xvcjogcmdiYSgwLDAsMCwwLjQpO1xyXG4gICAgZm9udC1zaXplOiAxNTBweDtcclxuICB9XHJcblxyXG4gICYtdGV4dHtcclxuICAgIGNvbG9yOiByZ2JhKDAsMCwwLDAuNCk7XHJcbiAgICBsaW5lLWhlaWdodDogMjFweDtcclxuICAgIG1hcmdpbi10b3A6IDYwcHg7XHJcbiAgICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XHJcbiAgfVxyXG5cclxuICAmLXdyYXB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIGxlZnQ6IDUwJTtcclxuICAgIG1pbi13aWR0aDogNjgwcHg7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICB0b3A6IDUwJTtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsLTUwJSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKiBQb3N0IFR3aXR0ZXIgZmFjZWJvb2sgY2FyZCBlbWJlZCBDc3MgQ2VudGVyXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5wb3N0IHtcclxuICBpZnJhbWVbc3JjKj1cImZhY2Vib29rLmNvbVwiXSxcclxuICAuZmItcG9zdCxcclxuICAudHdpdHRlci10d2VldCB7XHJcbiAgICBkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50O1xyXG4gICAgbWFyZ2luOiAxLjVyZW0gMCAhaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG4iLCIuY29udGFpbmVyIHtcclxuICBtYXJnaW46IDAgYXV0bztcclxuICBwYWRkaW5nLWxlZnQ6ICgkZ3JpZC1ndXR0ZXItd2lkdGggLyAyKTtcclxuICBwYWRkaW5nLXJpZ2h0OiAoJGdyaWQtZ3V0dGVyLXdpZHRoIC8gMik7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgbWF4LXdpZHRoOiAkY29udGFpbmVyLXhsO1xyXG5cclxuICAvLyBAbWVkaWEgI3skc20tYW5kLXVwfXttYXgtd2lkdGg6ICRjb250YWluZXItc207fVxyXG4gIC8vIEBtZWRpYSAjeyRtZC1hbmQtdXB9e21heC13aWR0aDogJGNvbnRhaW5lci1tZDt9XHJcbiAgLy8gQG1lZGlhICN7JGxnLWFuZC11cH17bWF4LXdpZHRoOiAkY29udGFpbmVyLWxnO31cclxuICAvLyBAbWVkaWEgI3skbGctYW5kLXVwfSB7ICB9XHJcbn1cclxuXHJcbi5tYXJnaW4tdG9wIHtcclxuICBtYXJnaW4tdG9wOiAkaGVhZGVyLWhlaWdodDtcclxuICBwYWRkaW5nLXRvcDogMXJlbTtcclxuXHJcbiAgQG1lZGlhICN7JG1kLWFuZC11cH0geyBwYWRkaW5nLXRvcDogMS44cmVtIH1cclxufVxyXG5cclxuQG1lZGlhICN7JG1kLWFuZC11cH0ge1xyXG4gIC5jb250ZW50IHtcclxuICAgIGZsZXgtYmFzaXM6IDY5LjY2NjY2NjY3JSAhaW1wb3J0YW50O1xyXG4gICAgbWF4LXdpZHRoOiA2OS42NjY2NjY2NyUgIWltcG9ydGFudDtcclxuICAgIC8vIGZsZXg6IDEgIWltcG9ydGFudDtcclxuICAgIC8vIG1heC13aWR0aDogY2FsYygxMDAlIC0gMzAwcHgpICFpbXBvcnRhbnQ7XHJcbiAgICAvLyBvcmRlcjogMTtcclxuICAgIC8vIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgfVxyXG5cclxuICAuc2lkZWJhciB7XHJcbiAgICBmbGV4LWJhc2lzOiAzMC4zMzMzMzMzMyUgIWltcG9ydGFudDtcclxuICAgIG1heC13aWR0aDogMzAuMzMzMzMzMzMlICFpbXBvcnRhbnQ7XHJcbiAgICAvLyBmbGV4OiAwIDAgMzMwcHggIWltcG9ydGFudDtcclxuICAgIC8vIG9yZGVyOiAyO1xyXG4gIH1cclxufVxyXG5cclxuQG1lZGlhICN7JHhsLWFuZC11cH0ge1xyXG4gIC5jb250ZW50IHsgcGFkZGluZy1yaWdodDogNDBweCAhaW1wb3J0YW50IH1cclxufVxyXG5cclxuQG1lZGlhICN7JGxnLWFuZC11cH0ge1xyXG4gIC5mZWVkLWVudHJ5LXdyYXBwZXIge1xyXG4gICAgLmVudHJ5LWltYWdlIHtcclxuICAgICAgd2lkdGg6IDQwJSAhaW1wb3J0YW50O1xyXG4gICAgICBtYXgtd2lkdGg6IDQwJSAhaW1wb3J0YW50O1xyXG4gICAgfVxyXG5cclxuICAgIC5lbnRyeS1ib2R5IHtcclxuICAgICAgd2lkdGg6IDYwJSAhaW1wb3J0YW50O1xyXG4gICAgICBtYXgtd2lkdGg6IDYwJSAhaW1wb3J0YW50O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuQG1lZGlhICN7JGxnLWFuZC1kb3dufSB7XHJcbiAgYm9keS5pcy1hcnRpY2xlIC5jb250ZW50IHtcclxuICAgIG1heC13aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG5cclxuLnJvdyB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4OiAwIDEgYXV0bztcclxuICBmbGV4LWZsb3c6IHJvdyB3cmFwO1xyXG4gIC8vIG1hcmdpbjogLThweDtcclxuXHJcbiAgbWFyZ2luLWxlZnQ6IC0gJGd1dHRlci13aWR0aCAvIDI7XHJcbiAgbWFyZ2luLXJpZ2h0OiAtICRndXR0ZXItd2lkdGggLyAyO1xyXG5cclxuICAvLyAvLyBDbGVhciBmbG9hdGluZyBjaGlsZHJlblxyXG4gIC8vICY6YWZ0ZXIge1xyXG4gIC8vICBjb250ZW50OiBcIlwiO1xyXG4gIC8vICBkaXNwbGF5OiB0YWJsZTtcclxuICAvLyAgY2xlYXI6IGJvdGg7XHJcbiAgLy8gfVxyXG5cclxuICAuY29sIHtcclxuICAgIC8vIGZsb2F0OiBsZWZ0O1xyXG4gICAgLy8gYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgIGZsZXg6IDAgMCBhdXRvO1xyXG4gICAgcGFkZGluZy1sZWZ0OiAkZ3V0dGVyLXdpZHRoIC8gMjtcclxuICAgIHBhZGRpbmctcmlnaHQ6ICRndXR0ZXItd2lkdGggLyAyO1xyXG5cclxuICAgICRpOiAxO1xyXG5cclxuICAgIEB3aGlsZSAkaSA8PSAkbnVtLWNvbHMge1xyXG4gICAgICAkcGVyYzogdW5xdW90ZSgoMTAwIC8gKCRudW0tY29scyAvICRpKSkgKyBcIiVcIik7XHJcblxyXG4gICAgICAmLnMjeyRpfSB7XHJcbiAgICAgICAgLy8gd2lkdGg6ICRwZXJjO1xyXG4gICAgICAgIGZsZXgtYmFzaXM6ICRwZXJjO1xyXG4gICAgICAgIG1heC13aWR0aDogJHBlcmM7XHJcbiAgICAgIH1cclxuICAgICAgJGk6ICRpICsgMTtcclxuICAgIH1cclxuXHJcbiAgICBAbWVkaWEgI3skbWQtYW5kLXVwfSB7XHJcblxyXG4gICAgICAkaTogMTtcclxuXHJcbiAgICAgIEB3aGlsZSAkaSA8PSAkbnVtLWNvbHMge1xyXG4gICAgICAgICRwZXJjOiB1bnF1b3RlKCgxMDAgLyAoJG51bS1jb2xzIC8gJGkpKSArIFwiJVwiKTtcclxuXHJcbiAgICAgICAgJi5tI3skaX0ge1xyXG4gICAgICAgICAgLy8gd2lkdGg6ICRwZXJjO1xyXG4gICAgICAgICAgZmxleC1iYXNpczogJHBlcmM7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6ICRwZXJjO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkaTogJGkgKyAxXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBAbWVkaWEgI3skbGctYW5kLXVwfSB7XHJcblxyXG4gICAgICAkaTogMTtcclxuXHJcbiAgICAgIEB3aGlsZSAkaSA8PSAkbnVtLWNvbHMge1xyXG4gICAgICAgICRwZXJjOiB1bnF1b3RlKCgxMDAgLyAoJG51bS1jb2xzIC8gJGkpKSArIFwiJVwiKTtcclxuXHJcbiAgICAgICAgJi5sI3skaX0ge1xyXG4gICAgICAgICAgLy8gd2lkdGg6ICRwZXJjO1xyXG4gICAgICAgICAgZmxleC1iYXNpczogJHBlcmM7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6ICRwZXJjO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkaTogJGkgKyAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIlxyXG4vL1xyXG4vLyBIZWFkaW5nc1xyXG4vL1xyXG5cclxuaDEsIGgyLCBoMywgaDQsIGg1LCBoNixcclxuLmgxLCAuaDIsIC5oMywgLmg0LCAuaDUsIC5oNiB7XHJcbiAgbWFyZ2luLWJvdHRvbTogJGhlYWRpbmdzLW1hcmdpbi1ib3R0b207XHJcbiAgZm9udC1mYW1pbHk6ICRoZWFkaW5ncy1mb250LWZhbWlseTtcclxuICBmb250LXdlaWdodDogJGhlYWRpbmdzLWZvbnQtd2VpZ2h0O1xyXG4gIGxpbmUtaGVpZ2h0OiAkaGVhZGluZ3MtbGluZS1oZWlnaHQ7XHJcbiAgY29sb3I6ICRoZWFkaW5ncy1jb2xvcjtcclxuICAvLyBsZXR0ZXItc3BhY2luZzogLS4wMmVtICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbmgxIHsgZm9udC1zaXplOiAkZm9udC1zaXplLWgxOyB9XHJcbmgyIHsgZm9udC1zaXplOiAkZm9udC1zaXplLWgyOyB9XHJcbmgzIHsgZm9udC1zaXplOiAkZm9udC1zaXplLWgzOyB9XHJcbmg0IHsgZm9udC1zaXplOiAkZm9udC1zaXplLWg0OyB9XHJcbmg1IHsgZm9udC1zaXplOiAkZm9udC1zaXplLWg1OyB9XHJcbmg2IHsgZm9udC1zaXplOiAkZm9udC1zaXplLWg2OyB9XHJcblxyXG4vLyBUaGVzZSBkZWNsYXJhdGlvbnMgYXJlIGtlcHQgc2VwYXJhdGUgZnJvbSBhbmQgcGxhY2VkIGFmdGVyXHJcbi8vIHRoZSBwcmV2aW91cyB0YWctYmFzZWQgZGVjbGFyYXRpb25zIHNvIHRoYXQgdGhlIGNsYXNzZXMgYmVhdCB0aGUgdGFncyBpblxyXG4vLyB0aGUgQ1NTIGNhc2NhZGUsIGFuZCB0aHVzIDxoMSBjbGFzcz1cImgyXCI+IHdpbGwgYmUgc3R5bGVkIGxpa2UgYW4gaDIuXHJcbi5oMSB7IGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1oMTsgfVxyXG4uaDIgeyBmb250LXNpemU6ICRmb250LXNpemUtaDI7IH1cclxuLmgzIHsgZm9udC1zaXplOiAkZm9udC1zaXplLWgzOyB9XHJcbi5oNCB7IGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1oNDsgfVxyXG4uaDUgeyBmb250LXNpemU6ICRmb250LXNpemUtaDU7IH1cclxuLmg2IHsgZm9udC1zaXplOiAkZm9udC1zaXplLWg2OyB9XHJcblxyXG5oMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcclxuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xyXG4gIGF7XHJcbiAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgIGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xyXG4gIH1cclxufVxyXG5cclxucCB7XHJcbiAgbWFyZ2luLXRvcDogMDtcclxuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xyXG59XHJcbiIsIi8qIE5hdmlnYXRpb24gTW9iaWxlXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5uYXYtbW9iIHtcclxuICBiYWNrZ3JvdW5kOiAkcHJpbWFyeS1jb2xvcjtcclxuICBjb2xvcjogIzAwMDtcclxuICBoZWlnaHQ6IDEwMHZoO1xyXG4gIGxlZnQ6IDA7XHJcbiAgcGFkZGluZzogMCAyMHB4O1xyXG4gIHBvc2l0aW9uOiBmaXhlZDtcclxuICByaWdodDogMDtcclxuICB0b3A6IDA7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDEwMCUpO1xyXG4gIHRyYW5zaXRpb246IC40cztcclxuICB3aWxsLWNoYW5nZTogdHJhbnNmb3JtO1xyXG4gIHotaW5kZXg6IDk5NztcclxuXHJcbiAgYXtcclxuICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gIH1cclxuXHJcbiAgdWwge1xyXG4gICAgYXtcclxuICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICAgIHBhZGRpbmc6IDhweCAwO1xyXG4gICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgJi1jb250ZW50e1xyXG4gICAgYmFja2dyb3VuZDogI2VlZTtcclxuICAgIG92ZXJmbG93OiBhdXRvO1xyXG4gICAgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoO1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHBhZGRpbmc6IDIwcHggMDtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgdG9wOiAkaGVhZGVyLWhlaWdodDtcclxuICB9XHJcblxyXG59XHJcblxyXG4ubmF2LW1vYiB1bCxcclxuLm5hdi1tb2Itc3Vic2NyaWJlLFxyXG4ubmF2LW1vYi1mb2xsb3d7XHJcbiAgYm9yZGVyLWJvdHRvbTogc29saWQgMXB4ICNEREQ7XHJcbiAgcGFkZGluZzogMCAoJGdyaWQtZ3V0dGVyLXdpZHRoIC8gMikgIDIwcHggKCRncmlkLWd1dHRlci13aWR0aCAvIDIpO1xyXG4gIG1hcmdpbi1ib3R0b206IDE1cHg7XHJcbn1cclxuXHJcbi8qIE5hdmlnYXRpb24gTW9iaWxlIGZvbGxvd1xyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4ubmF2LW1vYi1mb2xsb3d7XHJcbiAgYXtcclxuICAgIGZvbnQtc2l6ZTogMjBweCAhaW1wb3J0YW50O1xyXG4gICAgbWFyZ2luOiAwIDJweCAhaW1wb3J0YW50O1xyXG4gICAgcGFkZGluZzogMDtcclxuXHJcbiAgICBAZXh0ZW5kIC5idG47XHJcbiAgfVxyXG5cclxuICBAZWFjaCAkc29jaWFsLW5hbWUsICRjb2xvciBpbiAkc29jaWFsLWNvbG9ycyB7XHJcbiAgICAuaS0jeyRzb2NpYWwtbmFtZX17XHJcbiAgICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgICBAZXh0ZW5kIC5iZy0jeyRzb2NpYWwtbmFtZX07XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKiBDb3B5UmlnaFxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4ubmF2LW1vYi1jb3B5cmlnaHR7XHJcbiAgY29sb3I6ICNhYWE7XHJcbiAgZm9udC1zaXplOiAxM3B4O1xyXG4gIHBhZGRpbmc6IDIwcHggMTVweCAwO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICB3aWR0aDogMTAwJTtcclxuXHJcbiAgYXtjb2xvcjogJHByaW1hcnktY29sb3J9XHJcbn1cclxuXHJcbi8qIHN1YnNjcmliZVxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4ubmF2LW1vYi1zdWJzY3JpYmV7XHJcbiAgLmJ0bntcclxuICAgIGJvcmRlci1yYWRpdXM6IDA7XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcclxuICAgIHdpZHRoOiA4MHB4O1xyXG4gIH1cclxuICAuZm9ybS1ncm91cCB7d2lkdGg6IGNhbGMoMTAwJSAtIDgwcHgpfVxyXG4gIGlucHV0e1xyXG4gICAgYm9yZGVyOiAwO1xyXG4gICAgYm94LXNoYWRvdzogbm9uZSAhaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG4iLCIvKiBIZWFkZXIgUGFnZVxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4uaGVhZGVye1xyXG4gIGJhY2tncm91bmQ6ICRwcmltYXJ5LWNvbG9yO1xyXG4gIC8vIGNvbG9yOiAkaGVhZGVyLWNvbG9yO1xyXG4gIGhlaWdodDogJGhlYWRlci1oZWlnaHQ7XHJcbiAgbGVmdDogMDtcclxuICBwYWRkaW5nLWxlZnQ6IDFyZW07XHJcbiAgcGFkZGluZy1yaWdodDogMXJlbTtcclxuICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgcmlnaHQ6IDA7XHJcbiAgdG9wOiAwO1xyXG4gIHotaW5kZXg6IDk5OTtcclxuXHJcbiAgJi13cmFwIGF7IGNvbG9yOiAkaGVhZGVyLWNvbG9yO31cclxuXHJcbiAgJi1sb2dvLFxyXG4gICYtZm9sbG93IGEsXHJcbiAgJi1tZW51IGF7XHJcbiAgICBoZWlnaHQ6ICRoZWFkZXItaGVpZ2h0O1xyXG4gICAgQGV4dGVuZCAudS1mbGV4LWNlbnRlcjtcclxuICB9XHJcblxyXG4gICYtZm9sbG93LFxyXG4gICYtc2VhcmNoLFxyXG4gICYtbG9nb3tcclxuICAgIGZsZXg6IDAgMCBhdXRvO1xyXG4gIH1cclxuXHJcbiAgLy8gTG9nb1xyXG4gICYtbG9nb3tcclxuICAgIHotaW5kZXg6IDk5ODtcclxuICAgIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1sZztcclxuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICBsZXR0ZXItc3BhY2luZzogMXB4O1xyXG4gICAgaW1ne1xyXG4gICAgICBtYXgtaGVpZ2h0OiAzNXB4O1xyXG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAubmF2LW1vYi10b2dnbGUsXHJcbiAgLnNlYXJjaC1tb2ItdG9nZ2xle1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIHotaW5kZXg6IDk5ODtcclxuICB9XHJcblxyXG4gIC8vIGJ0biBtb2JpbGUgbWVudSBvcGVuIGFuZCBjbG9zZVxyXG4gIC5uYXYtbW9iLXRvZ2dsZXtcclxuICAgIG1hcmdpbi1sZWZ0OiAwICFpbXBvcnRhbnQ7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IC0gKCRncmlkLWd1dHRlci13aWR0aCAvIDIpO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC40cztcclxuXHJcbiAgICBzcGFuIHtcclxuICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRoZWFkZXItY29sb3I7XHJcbiAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgIGhlaWdodDogMnB4O1xyXG4gICAgICAgbGVmdDogMTRweDtcclxuICAgICAgIG1hcmdpbi10b3A6IC0xcHg7XHJcbiAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICB0b3A6IDUwJTtcclxuICAgICAgIHRyYW5zaXRpb246IC40cztcclxuICAgICAgIHdpZHRoOiAyMHB4O1xyXG4gICAgICAgJjpmaXJzdC1jaGlsZCB7IHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsLTZweCk7IH1cclxuICAgICAgICY6bGFzdC1jaGlsZCB7IHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsNnB4KTsgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIC8vIFNob2RvdyBmb3IgaGVhZGVyXHJcbiAgJi50b29sYmFyLXNoYWRvd3sgQGV4dGVuZCAlcHJpbWFyeS1ib3gtc2hhZG93OyB9XHJcbiAgJjpub3QoLnRvb2xiYXItc2hhZG93KSB7IGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50IWltcG9ydGFudDsgfVxyXG5cclxufVxyXG5cclxuXHJcbi8qIEhlYWRlciBOYXZpZ2F0aW9uXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5oZWFkZXItbWVudXtcclxuICBmbGV4OiAxIDEgMDtcclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIHRyYW5zaXRpb246IGZsZXggLjJzLG1hcmdpbiAuMnMsd2lkdGggLjJzO1xyXG5cclxuICB1bHtcclxuICAgIG1hcmdpbi1sZWZ0OiAycmVtO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuXHJcbiAgICBsaXsgcGFkZGluZy1yaWdodDogMTVweDsgZGlzcGxheTogaW5saW5lLWJsb2NrO31cclxuXHJcbiAgICBhe1xyXG4gICAgICBwYWRkaW5nOiAwIDhweDtcclxuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG5cclxuICAgICAgJjpiZWZvcmV7XHJcbiAgICAgICAgYmFja2dyb3VuZDogJGhlYWRlci1jb2xvcjtcclxuICAgICAgICBib3R0b206IDA7XHJcbiAgICAgICAgY29udGVudDogJyc7XHJcbiAgICAgICAgaGVpZ2h0OiAycHg7XHJcbiAgICAgICAgbGVmdDogMDtcclxuICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IC4ycztcclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgfVxyXG4gICAgICAmOmhvdmVyOmJlZm9yZSxcclxuICAgICAgJi5hY3RpdmU6YmVmb3Jle1xyXG4gICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG59XHJcblxyXG5cclxuLyogaGVhZGVyIHNvY2lhbFxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4uaGVhZGVyLWZvbGxvdyBhIHtcclxuICBwYWRkaW5nOiAwIDEwcHg7XHJcbiAgJjpob3Zlcntjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjgwKX1cclxuICAmOmJlZm9yZXtmb250LXNpemU6ICRmb250LXNpemUtbGcgIWltcG9ydGFudDt9XHJcblxyXG59XHJcblxyXG5cclxuXHJcbi8qIEhlYWRlciBzZWFyY2hcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLmhlYWRlci1zZWFyY2h7XHJcbiAgYmFja2dyb3VuZDogI2VlZTtcclxuICBib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgZGlzcGxheTogbm9uZTtcclxuICAvLyBmbGV4OiAwIDAgYXV0bztcclxuICBoZWlnaHQ6IDM2cHg7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAuMnMsZmxleCAuMnM7XHJcbiAgdmVydGljYWwtYWxpZ246IHRvcDtcclxuICBtYXJnaW4tbGVmdDogMS41cmVtO1xyXG4gIG1hcmdpbi1yaWdodDogMS41cmVtO1xyXG5cclxuICAuc2VhcmNoLWljb257XHJcbiAgICBjb2xvcjogIzc1NzU3NTtcclxuICAgIGZvbnQtc2l6ZTogMjRweDtcclxuICAgIGxlZnQ6IDI0cHg7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDEycHg7XHJcbiAgICB0cmFuc2l0aW9uOiBjb2xvciAuMnM7XHJcbiAgfVxyXG59XHJcblxyXG5pbnB1dC5zZWFyY2gtZmllbGQge1xyXG4gIGJhY2tncm91bmQ6IDA7XHJcbiAgYm9yZGVyOiAwO1xyXG4gIGNvbG9yOiAjMjEyMTIxO1xyXG4gIGhlaWdodDogMzZweDtcclxuICBwYWRkaW5nOiAwIDhweCAwIDcycHg7XHJcbiAgdHJhbnNpdGlvbjogY29sb3IgLjJzO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gICY6Zm9jdXN7XHJcbiAgICBib3JkZXI6IDA7XHJcbiAgICBvdXRsaW5lOiBub25lO1xyXG4gIH1cclxufVxyXG5cclxuLnNlYXJjaC1wb3BvdXR7XHJcbiAgYmFja2dyb3VuZDogJGhlYWRlci1jb2xvcjtcclxuICBib3gtc2hhZG93OiAwIDAgMnB4IHJnYmEoMCwwLDAsLjEyKSwwIDJweCA0cHggcmdiYSgwLDAsMCwuMjQpLGluc2V0IDAgNHB4IDZweCAtNHB4IHJnYmEoMCwwLDAsLjI0KTtcclxuICBtYXJnaW4tdG9wOiAxMHB4O1xyXG4gIG1heC1oZWlnaHQ6IGNhbGMoMTAwdmggLSAxNTBweCk7XHJcbiAgLy8gd2lkdGg6IGNhbGMoMTAwJSArIDEyMHB4KTtcclxuICBtYXJnaW4tbGVmdDogLTY0cHg7XHJcbiAgb3ZlcmZsb3cteTogYXV0bztcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgLy8gdHJhbnNpdGlvbjogdHJhbnNmb3JtIC4ycyx2aXNpYmlsaXR5IC4ycztcclxuICAvLyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XHJcblxyXG4gIHotaW5kZXg6IC0xO1xyXG5cclxuICAmLmNsb3NlZHtcclxuICAgIC8vIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTEwJSk7XHJcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgfVxyXG59XHJcblxyXG4uc2VhcmNoLXN1Z2dlc3QtcmVzdWx0c3tcclxuICBwYWRkaW5nOiAwIDhweCAwIDc1cHg7XHJcblxyXG4gIGF7XHJcbiAgICBjb2xvcjogIzIxMjEyMTtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgbWFyZ2luLWxlZnQ6IC04cHg7XHJcbiAgICBvdXRsaW5lOiAwO1xyXG4gICAgaGVpZ2h0OiBhdXRvO1xyXG4gICAgcGFkZGluZzogOHB4O1xyXG4gICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAuMnM7XHJcbiAgICBmb250LXNpemU6ICRmb250LXNpemUtc207XHJcbiAgICAmOmZpcnN0LWNoaWxke1xyXG4gICAgICBtYXJnaW4tdG9wOiAxMHB4O1xyXG4gICAgfVxyXG4gICAgJjpsYXN0LWNoaWxke1xyXG4gICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gICAgfVxyXG4gICAgJjpob3ZlcntcclxuICAgICAgYmFja2dyb3VuZDogI2Y3ZjdmNztcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qIG1lZGlhcXVlcnkgbWVkaXVtXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG5AbWVkaWEgI3skbGctYW5kLXVwfXtcclxuICAuaGVhZGVyLXNlYXJjaHtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LDI1NSwyNTUsLjI1KTtcclxuICAgIGJveC1zaGFkb3c6IDAgMXB4IDEuNXB4IHJnYmEoMCwwLDAsMC4wNiksMCAxcHggMXB4IHJnYmEoMCwwLDAsMC4xMik7XHJcbiAgICBjb2xvcjogJGhlYWRlci1jb2xvcjtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIHdpZHRoOiAyMDBweDtcclxuXHJcbiAgICAmOmhvdmVye1xyXG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwyNTUsMjU1LC40KTtcclxuICAgIH1cclxuXHJcbiAgICAuc2VhcmNoLWljb257dG9wOiAwcHg7fVxyXG5cclxuICAgIGlucHV0LCBpbnB1dDo6cGxhY2Vob2xkZXIsIC5zZWFyY2gtaWNvbntjb2xvcjogI2ZmZjt9XHJcblxyXG4gIH1cclxuXHJcbiAgLnNlYXJjaC1wb3BvdXR7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIG1hcmdpbi1sZWZ0OiAwO1xyXG4gIH1cclxuXHJcbiAgLy8gU2hvdyBsYXJnZSBzZWFyY2ggYW5kIHZpc2liaWxpdHkgaGlkZGVuIGhlYWRlciBtZW51XHJcbiAgLmhlYWRlci5pcy1zaG93U2VhcmNoe1xyXG4gICAgLmhlYWRlci1zZWFyY2h7XHJcbiAgICAgIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgICAgIGZsZXg6IDEgMCBhdXRvO1xyXG5cclxuICAgICAgLnNlYXJjaC1pY29ue2NvbG9yOiAjNzU3NTc1ICFpbXBvcnRhbnQ7fVxyXG4gICAgICBpbnB1dCwgaW5wdXQ6OnBsYWNlaG9sZGVyIHtjb2xvcjogIzIxMjEyMSAhaW1wb3J0YW50fVxyXG4gICAgfVxyXG4gICAgLmhlYWRlci1tZW51e1xyXG4gICAgICBmbGV4OiAwIDAgYXV0bztcclxuICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgICAgIHdpZHRoOiAwO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuXHJcbi8qIE1lZGlhIFF1ZXJ5XHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG5AbWVkaWEgI3skbGctYW5kLWRvd259e1xyXG5cclxuICAuaGVhZGVyLW1lbnUgdWx7IGRpc3BsYXk6IG5vbmU7IH1cclxuXHJcbiAgLy8gc2hvdyBzZWFyY2ggbW9iaWxlXHJcbiAgLmhlYWRlci5pcy1zaG93U2VhcmNoTW9ie1xyXG4gICAgcGFkZGluZzogMDtcclxuXHJcbiAgICAuaGVhZGVyLWxvZ28sXHJcbiAgICAubmF2LW1vYi10b2dnbGV7XHJcbiAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLmhlYWRlci1zZWFyY2h7XHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDA7XHJcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jayAhaW1wb3J0YW50O1xyXG4gICAgICBoZWlnaHQ6ICRoZWFkZXItaGVpZ2h0O1xyXG4gICAgICBtYXJnaW46IDA7XHJcbiAgICAgIHdpZHRoOiAxMDAlO1xyXG5cclxuICAgICAgaW5wdXR7XHJcbiAgICAgICAgaGVpZ2h0OiAkaGVhZGVyLWhlaWdodDtcclxuICAgICAgICBwYWRkaW5nLXJpZ2h0OiA0OHB4O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAuc2VhcmNoLXBvcG91dHttYXJnaW4tdG9wOiAwO31cclxuICAgIH1cclxuXHJcbiAgICAuc2VhcmNoLW1vYi10b2dnbGV7XHJcbiAgICAgIGJvcmRlcjogMDtcclxuICAgICAgY29sb3I6ICRoZWFkZXItc2VhcmNoLWNvbG9yO1xyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgIHJpZ2h0OiAwO1xyXG4gICAgICAmOmJlZm9yZXtjb250ZW50OiAkaS1jbG9zZSAhaW1wb3J0YW50O31cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvLyBzaG93IG1lbnUgbW9iaWxlXHJcbiAgYm9keS5pcy1zaG93TmF2TW9ie1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuXHJcbiAgICAubmF2LW1vYntcclxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDApO1xyXG4gICAgfVxyXG4gICAgLm5hdi1tb2ItdG9nZ2xlIHtcclxuICAgICAgYm9yZGVyOiAwO1xyXG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7XHJcbiAgICAgIHNwYW46Zmlyc3QtY2hpbGQgeyB0cmFuc2Zvcm06IHJvdGF0ZSg0NWRlZykgdHJhbnNsYXRlKDAsMCk7fVxyXG4gICAgICBzcGFuOm50aC1jaGlsZCgyKSB7IHRyYW5zZm9ybTogc2NhbGVYKDApO31cclxuICAgICAgc3BhbjpsYXN0LWNoaWxkIHt0cmFuc2Zvcm06IHJvdGF0ZSgtNDVkZWcpIHRyYW5zbGF0ZSgwLDApO31cclxuICAgIH1cclxuICAgIC5zZWFyY2gtbW9iLXRvZ2dsZXtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgIH1cclxuXHJcbiAgICAubWFpbiwuZm9vdGVye1xyXG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTI1JSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG4iLCIvLyBIZWFkZXIgcG9zdFxyXG4uY292ZXIge1xyXG4gIGJhY2tncm91bmQ6ICRwcmltYXJ5LWNvbG9yO1xyXG4gIGJveC1zaGFkb3c6IDAgMCA0cHggcmdiYSgwLDAsMCwuMTQpLDAgNHB4IDhweCByZ2JhKDAsMCwwLC4yOCk7XHJcbiAgY29sb3I6ICNmZmY7XHJcbiAgbGV0dGVyLXNwYWNpbmc6IC4ycHg7XHJcbiAgbWluLWhlaWdodDogNTUwcHg7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIHRleHQtc2hhZG93OiAwIDAgMTBweCByZ2JhKDAsMCwwLC4zMyk7XHJcbiAgei1pbmRleDogMjtcclxuXHJcbiAgJi13cmFwIHtcclxuICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgbWF4LXdpZHRoOiAxMDUwcHg7XHJcbiAgICBwYWRkaW5nOiAxNnB4O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgei1pbmRleDogOTk7XHJcbiAgfVxyXG5cclxuICAmLXRpdGxlIHtcclxuICAgIGZvbnQtc2l6ZTogMy41cmVtO1xyXG4gICAgbWFyZ2luOiAwIDAgNTBweDtcclxuICAgIGxpbmUtaGVpZ2h0OiAxO1xyXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICB9XHJcblxyXG4gICYtZGVzY3JpcHRpb24geyBtYXgtd2lkdGg6IDYwMHB4OyB9XHJcblxyXG4gICYtYmFja2dyb3VuZCB7IGJhY2tncm91bmQtYXR0YWNobWVudDogZml4ZWQgfVxyXG5cclxuICAvLyAgY292ZXIgbW91c2Ugc2Nyb2xsXHJcbiAgLm1vdXNlIHtcclxuICAgIHdpZHRoOiAyNXB4O1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgaGVpZ2h0OiAzNnB4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTVweDtcclxuICAgIGJvcmRlcjogMnB4IHNvbGlkICM4ODg7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMjcpO1xyXG4gICAgYm90dG9tOiA0MHB4O1xyXG4gICAgcmlnaHQ6IDQwcHg7XHJcbiAgICBtYXJnaW4tbGVmdDogLTEycHg7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC4ycyBlYXNlLWluO1xyXG5cclxuICAgIC5zY3JvbGwge1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgbWFyZ2luOiA2cHggYXV0bztcclxuICAgICAgd2lkdGg6IDNweDtcclxuICAgICAgaGVpZ2h0OiA2cHg7XHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjY4KTtcclxuICAgICAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcclxuICAgICAgYW5pbWF0aW9uLW5hbWU6IHNjcm9sbDtcclxuICAgICAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4uYXV0aG9yIHtcclxuICBhIHsgY29sb3I6ICNGRkYgIWltcG9ydGFudDsgfVxyXG5cclxuICAmLWhlYWRlciB7XHJcbiAgICBtYXJnaW4tdG9wOiAxMCU7XHJcbiAgfVxyXG5cclxuICAmLW5hbWUtd3JhcCB7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgfVxyXG5cclxuICAmLXRpdGxlIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICB9XHJcblxyXG4gICYtbmFtZSB7XHJcbiAgICBtYXJnaW46IDVweCAwO1xyXG4gICAgZm9udC1zaXplOiAxLjc1cmVtO1xyXG4gIH1cclxuICAmLWJpbyB7XHJcbiAgICBtYXJnaW46IDEuNXJlbSAwO1xyXG4gICAgbGluZS1oZWlnaHQ6IDEuODtcclxuICAgIGZvbnQtc2l6ZTogMThweDtcclxuICAgIG1heC13aWR0aDogNzAwcHg7XHJcbiAgfVxyXG5cclxuICAmLWF2YXRhciB7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBib3JkZXItcmFkaXVzOiA5MHB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgd2lkdGg6IDgwcHg7XHJcbiAgICBoZWlnaHQ6IDgwcHg7XHJcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xyXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xyXG4gICAgdmVydGljYWwtYWxpZ246IGJvdHRvbTtcclxuICB9XHJcblxyXG4gIC8vIEF1dGhvciBtZXRhIChsb2NhdGlvbiAtIHdlYnNpdGUgLSBwb3N0IHRvdGFsKVxyXG4gICYtbWV0YSB7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG5cclxuICAgIHNwYW4ge1xyXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgIGZvbnQtc2l6ZTogMTdweDtcclxuICAgICAgZm9udC1zdHlsZTogaXRhbGljO1xyXG4gICAgICBtYXJnaW46IDAgMnJlbSAxcmVtIDA7XHJcbiAgICAgIG9wYWNpdHk6IDAuODtcclxuICAgICAgd29yZC13cmFwOiBicmVhay13b3JkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLmF1dGhvci1saW5rOmhvdmVyIHtcclxuICAgIG9wYWNpdHk6IDE7XHJcbiAgfVxyXG5cclxuICAvLyAgYXV0aG9yIEZvbGxvd1xyXG4gICYtZm9sbG93IHtcclxuICAgIGEge1xyXG4gICAgICBib3JkZXItcmFkaXVzOiAzcHg7XHJcbiAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCAwIDJweCByZ2JhKDI1NSwyNTUsMjU1LC41KTtcclxuICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgIGhlaWdodDogNDBweDtcclxuICAgICAgbGV0dGVyLXNwYWNpbmc6IDFweDtcclxuICAgICAgbGluZS1oZWlnaHQ6IDQwcHg7XHJcbiAgICAgIG1hcmdpbjogMCAxMHB4O1xyXG4gICAgICBwYWRkaW5nOiAwIDE2cHg7XHJcbiAgICAgIHRleHQtc2hhZG93OiBub25lO1xyXG4gICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG5cclxuICAgICAgJjpob3ZlciB7XHJcbiAgICAgICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgMnB4ICNmZmY7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vICBIb21lIEJUTiBET1dOXHJcbi5ob21lLWRvd24ge1xyXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMS4ycyAhaW1wb3J0YW50O1xyXG4gIGJvdHRvbTogNjBweDtcclxuICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpO1xyXG4gIGxlZnQ6IDA7XHJcbiAgLy8gdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgLTUwJSk7XHJcbiAgbWFyZ2luOiAwIGF1dG87XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIHdpZHRoOiA3MHB4O1xyXG4gIHotaW5kZXg6IDEwMDtcclxufVxyXG5cclxuXHJcbkBtZWRpYSAjeyRtZC1hbmQtdXB9e1xyXG4gIC5jb3ZlcntcclxuICAgICYtZGVzY3JpcHRpb257XHJcbiAgICAgIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1sZztcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5cclxuQG1lZGlhICN7JG1kLWFuZC1kb3dufSB7XHJcbiAgLmNvdmVye1xyXG4gICAgcGFkZGluZy10b3A6ICRoZWFkZXItaGVpZ2h0O1xyXG4gICAgcGFkZGluZy1ib3R0b206IDIwcHg7XHJcblxyXG4gICAgJi10aXRsZXtcclxuICAgICAgZm9udC1zaXplOiAycmVtO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLmF1dGhvci1hdmF0YXJ7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIG1hcmdpbjogMCBhdXRvIDEwcHggYXV0bztcclxuICB9XHJcbn1cclxuIiwiLmZlZWQtZW50cnktY29udGVudCAuZmVlZC1lbnRyeS13cmFwcGVyOmxhc3QtY2hpbGQge1xyXG4gIC5lbnRyeTpsYXN0LWNoaWxkIHtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICBib3JkZXI6IG5vbmU7XHJcbiAgfVxyXG59XHJcblxyXG4uZW50cnkge1xyXG4gIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcclxuICBwYWRkaW5nOiAwIDE1cHggMTVweDtcclxuXHJcbiAgJi1pbWFnZSB7XHJcbiAgICAvLyBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG5cclxuICAgICYtLWxpbmsge1xyXG4gICAgICBoZWlnaHQ6IDE4MHB4O1xyXG4gICAgICBtYXJnaW46IDAgLTE1cHg7XHJcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcblxyXG4gICAgICAmOmhvdmVyIC5lbnRyeS1pbWFnZS0tYmcge1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4wMyk7XHJcbiAgICAgICAgYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJi0tYmcgeyB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyB9XHJcbiAgfVxyXG5cclxuICAvLyB2aWRlbyBwbGF5IGZvciB2aWRlbyBwb3N0IGZvcm1hdFxyXG4gICYtdmlkZW8tcGxheSB7XHJcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCAjZmZmO1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbiAgICBmb250LXNpemU6IDMuNXJlbTtcclxuICAgIGhlaWdodDogNjVweDtcclxuICAgIGxlZnQ6IDUwJTtcclxuICAgIGxpbmUtaGVpZ2h0OiA2NXB4O1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgdG9wOiA1MCU7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcclxuICAgIHdpZHRoOiA2NXB4O1xyXG4gICAgei1pbmRleDogMTA7XHJcbiAgICAvLyAmOmJlZm9yZXtsaW5lLWhlaWdodDogaW5oZXJpdH1cclxuICB9XHJcblxyXG4gICYtY2F0ZWdvcnkge1xyXG4gICAgbWFyZ2luLWJvdHRvbTogNXB4O1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XHJcbiAgICBmb250LXNpemU6ICRmb250LXNpemUtc207XHJcbiAgICBsaW5lLWhlaWdodDogMTtcclxuXHJcbiAgICBhOmFjdGl2ZSB7XHJcbiAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJi10aXRsZSB7XHJcbiAgICBjb2xvcjogJGVudHJ5LWNvbG9yLXRpdGxlO1xyXG4gICAgZm9udC1zaXplOiAkZW50cnktZm9udC1zaXplLW1iO1xyXG4gICAgaGVpZ2h0OiBhdXRvO1xyXG4gICAgbGluZS1oZWlnaHQ6IDEuMjtcclxuICAgIG1hcmdpbjogMCAwIC41cmVtO1xyXG4gICAgcGFkZGluZzogMDtcclxuXHJcbiAgICAmOmhvdmVyIHtcclxuICAgICAgY29sb3I6ICRlbnRyeS1jb2xvci10aXRsZS1ob3ZlcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gICYtYnlsaW5lIHtcclxuICAgIG1hcmdpbi10b3A6IDA7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XHJcbiAgICBjb2xvcjogJGVudHJ5LWNvbG9yLWJ5bGluZTtcclxuICAgIGZvbnQtc2l6ZTogJGVudHJ5LWZvbnQtc2l6ZS1ieWxpbmU7XHJcblxyXG4gICAgYSB7XHJcbiAgICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgICAmOmhvdmVyIHsgY29sb3I6ICMzMzMgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJi1ib2R5IHtcclxuICAgIHBhZGRpbmctdG9wOiAyMHB4O1xyXG4gIH1cclxufVxyXG5cclxuLyogRW50cnkgc21hbGwgLS1zbWFsbFxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4uZW50cnkuZW50cnktLXNtYWxsIHtcclxuICBtYXJnaW4tYm90dG9tOiAyNHB4O1xyXG4gIHBhZGRpbmc6IDA7XHJcblxyXG4gIC5lbnRyeS1pbWFnZSB7IG1hcmdpbi1ib3R0b206IDEwcHggfVxyXG4gIC5lbnRyeS1pbWFnZS0tbGluayB7IGhlaWdodDogMTcwcHg7IG1hcmdpbjogMCB9XHJcblxyXG4gIC5lbnRyeS10aXRsZSB7XHJcbiAgICBmb250LXNpemU6IDFyZW07XHJcbiAgICBmb250LXdlaWdodDogNTAwO1xyXG4gICAgbGluZS1oZWlnaHQ6IDEuMjtcclxuICAgIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xyXG4gIH1cclxuXHJcbiAgLmVudHJ5LWJ5bGluZSB7IG1hcmdpbjogMCB9XHJcbn1cclxuXHJcbi8vIE1lZGlhIHF1ZXJ5IExHXHJcbkBtZWRpYSAjeyRsZy1hbmQtdXB9IHtcclxuICAuZW50cnkge1xyXG4gICAgbWFyZ2luLWJvdHRvbTogNDBweDtcclxuICAgIHBhZGRpbmc6IDA7XHJcblxyXG4gICAgJi10aXRsZSB7XHJcbiAgICAgIC8vIGZvbnQtc2l6ZTogJGVudHJ5LWZvbnQtc2l6ZTtcclxuICAgICAgZm9udC1zaXplOiAyMXB4O1xyXG4gICAgfVxyXG5cclxuICAgICYtYm9keSB7IHBhZGRpbmctcmlnaHQ6IDM1cHggIWltcG9ydGFudCB9XHJcblxyXG4gICAgJi1pbWFnZSB7XHJcbiAgICAgIG1hcmdpbi1ib3R0b206IDA7XHJcbiAgICB9XHJcblxyXG4gICAgJi1pbWFnZS0tbGluayB7XHJcbiAgICAgIGhlaWdodDogMTgwcHg7XHJcbiAgICAgIG1hcmdpbjogMDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vIE1lZGlhIFF1ZXJ5IFhMXHJcbkBtZWRpYSAjeyR4bC1hbmQtdXB9IHtcclxuICAuZW50cnktaW1hZ2UtLWxpbmsgeyBoZWlnaHQ6IDIxOHB4IH1cclxufVxyXG4iLCIuZm9vdGVyIHtcclxuICBjb2xvcjogJGZvb3Rlci1jb2xvcjtcclxuICBmb250LXNpemU6IDE0cHg7XHJcbiAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICBsaW5lLWhlaWdodDogMTtcclxuICBwYWRkaW5nOiAxLjZyZW0gMTVweDtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcblxyXG4gIGEge1xyXG4gICAgY29sb3I6ICRmb290ZXItY29sb3ItbGluaztcclxuICAgICY6aG92ZXIgeyBjb2xvcjogcmdiYSgwLCAwLCAwLCAuOCk7IH1cclxuICB9XHJcblxyXG4gICYtd3JhcCB7XHJcbiAgICBtYXJnaW46IDAgYXV0bztcclxuICAgIG1heC13aWR0aDogMTQwMHB4O1xyXG4gIH1cclxuXHJcbiAgLmhlYXJ0IHtcclxuICAgIGFuaW1hdGlvbjogaGVhcnRpZnkgLjVzIGluZmluaXRlIGFsdGVybmF0ZTtcclxuICAgIGNvbG9yOiByZWQ7XHJcbiAgfVxyXG5cclxuICAmLWNvcHksXHJcbiAgJi1kZXNpZ24tYXV0aG9yIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIHBhZGRpbmc6IC41cmVtIDA7XHJcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xyXG4gIH1cclxuXHJcbiAgJi1mb2xsb3cge1xyXG4gICAgcGFkZGluZzogMjBweCAwO1xyXG5cclxuICAgIGEge1xyXG4gICAgICBmb250LXNpemU6IDIwcHg7XHJcbiAgICAgIG1hcmdpbjogMCA1cHg7XHJcbiAgICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC44KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgaGVhcnRpZnkge1xyXG4gIDAlIHtcclxuICAgIHRyYW5zZm9ybTogc2NhbGUoLjgpO1xyXG4gIH1cclxufVxyXG4iLCIuYnRue1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XHJcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xyXG4gIGJvcmRlcjogMDtcclxuICBib3gtc2hhZG93OiBub25lO1xyXG4gIGNvbG9yOiAkYnRuLXNlY29uZGFyeS1jb2xvcjtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gIGZvbnQ6IDUwMCAxNHB4LzIwcHggJHByaW1hcnktZm9udDtcclxuICBoZWlnaHQ6IDM2cHg7XHJcbiAgbWFyZ2luOiAwO1xyXG4gIG1pbi13aWR0aDogMzZweDtcclxuICBvdXRsaW5lOiAwO1xyXG4gIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgcGFkZGluZzogOHB4O1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XHJcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIC4ycyxib3gtc2hhZG93IC4ycztcclxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xyXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcblxyXG4gICsgLmJ0bnttYXJnaW4tbGVmdDogOHB4O31cclxuXHJcbiAgJjpmb2N1cyxcclxuICAmOmhvdmVye1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJGJ0bi1iYWNrZ3JvdW5kLWNvbG9yO1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgfVxyXG4gICY6YWN0aXZle1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJGJ0bi1hY3RpdmUtYmFja2dyb3VuZDtcclxuICB9XHJcblxyXG4gICYuYnRuLWxne1xyXG4gICAgZm9udC1zaXplOiAxLjVyZW07XHJcbiAgICBtaW4td2lkdGg6IDQ4cHg7XHJcbiAgICBoZWlnaHQ6IDQ4cHg7XHJcbiAgICBsaW5lLWhlaWdodDogNDhweDtcclxuICB9XHJcbiAgJi5idG4tZmxhdHtcclxuICAgIGJhY2tncm91bmQ6IDA7XHJcbiAgICBib3gtc2hhZG93OiBub25lO1xyXG4gICAgJjpmb2N1cyxcclxuICAgICY6aG92ZXIsXHJcbiAgICAmOmFjdGl2ZXtcclxuICAgICAgYmFja2dyb3VuZDogMDtcclxuICAgICAgYm94LXNoYWRvdzogbm9uZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gICYuYnRuLXByaW1hcnl7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYnRuLXByaW1hcnktY29sb3I7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgICY6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjogZGFya2VuKCRidG4tcHJpbWFyeS1jb2xvciwgNCUpO31cclxuICB9XHJcbiAgJi5idG4tY2lyY2xle1xyXG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgaGVpZ2h0OiA0MHB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDQwcHg7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgd2lkdGg6IDQwcHg7XHJcbiAgfVxyXG4gICYuYnRuLWNpcmNsZS1zbWFsbHtcclxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgIGhlaWdodDogMzJweDtcclxuICAgIGxpbmUtaGVpZ2h0OiAzMnB4O1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIHdpZHRoOiAzMnB4O1xyXG4gICAgbWluLXdpZHRoOiAzMnB4O1xyXG4gIH1cclxuICAmLmJ0bi1zaGFkb3d7XHJcbiAgICBib3gtc2hhZG93OiAwIDJweCAycHggMCByZ2JhKDAsMCwwLDAuMTIpO1xyXG4gICAgY29sb3I6ICMzMzM7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWVlO1xyXG4gICAgJjpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLDAuMTIpO31cclxuICB9XHJcblxyXG4gICYuYnRuLWRvd25sb2FkLWNsb3VkLFxyXG4gICYuYnRuLWRvd25sb2Fke1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJGJ0bi1wcmltYXJ5LWNvbG9yO1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbiAgICAmOmhvdmVye2JhY2tncm91bmQtY29sb3I6IGRhcmtlbigkYnRuLXByaW1hcnktY29sb3IsIDglKTt9XHJcbiAgICAmOmFmdGVye1xyXG4gICAgICBAZXh0ZW5kICVmb250LWljb25zO1xyXG4gICAgICBtYXJnaW4tbGVmdDogNXB4O1xyXG4gICAgICBmb250LXNpemU6IDEuMXJlbTtcclxuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJi5idG4tZG93bmxvYWQ6YWZ0ZXJ7Y29udGVudDogJGktZG93bmxvYWQ7fVxyXG4gICYuYnRuLWRvd25sb2FkLWNsb3VkOmFmdGVye2NvbnRlbnQ6ICRpLWNsb3VkX2Rvd25sb2FkO31cclxuICAmLmV4dGVybmFsOmFmdGVye2ZvbnQtc2l6ZTogMXJlbTt9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyAgSW5wdXRcclxuLmlucHV0LWdyb3VwIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgZGlzcGxheTogdGFibGU7XHJcbiAgYm9yZGVyLWNvbGxhcHNlOiBzZXBhcmF0ZTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuLmZvcm0tY29udHJvbCB7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgcGFkZGluZzogOHB4IDEycHg7XHJcbiAgZm9udC1zaXplOiAxNHB4O1xyXG4gIGxpbmUtaGVpZ2h0OiAxLjQyODU3O1xyXG4gIGNvbG9yOiAjNTU1O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogbm9uZTtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xyXG4gIGJvcmRlci1yYWRpdXM6IDBweDtcclxuICBib3gtc2hhZG93OiBpbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjA3NSk7XHJcbiAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIGVhc2UtaW4tb3V0IDAuMTVzLGJveC1zaGFkb3cgZWFzZS1pbi1vdXQgMC4xNXM7XHJcbiAgaGVpZ2h0OiAzNnB4O1xyXG5cclxuICAmOmZvY3VzIHtcclxuICAgIGJvcmRlci1jb2xvcjogJGJ0bi1wcmltYXJ5LWNvbG9yO1xyXG4gICAgb3V0bGluZTogMDtcclxuICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLDAuMDc1KSwwIDAgOHB4IHJnYmEoJGJ0bi1wcmltYXJ5LWNvbG9yLDAuNik7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLmJ0bi1zdWJzY3JpYmUtaG9tZXtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcclxuICBib3JkZXItcmFkaXVzOiAzcHg7XHJcbiAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgMnB4IGhzbGEoMCwwJSwxMDAlLC41KTtcclxuICBjb2xvcjogI2ZmZmZmZjtcclxuICBkaXNwbGF5OiBibG9jaztcclxuICBmb250LXNpemU6IDIwcHg7XHJcbiAgZm9udC13ZWlnaHQ6IDQwMDtcclxuICBsaW5lLWhlaWdodDogMS4yO1xyXG4gIG1hcmdpbi10b3A6IDUwcHg7XHJcbiAgbWF4LXdpZHRoOiAzMDBweDtcclxuICBtYXgtd2lkdGg6IDMwMHB4O1xyXG4gIHBhZGRpbmc6IDE1cHggMTBweDtcclxuICB0cmFuc2l0aW9uOiBhbGwgMC4zcztcclxuICB3aWR0aDogMTAwJTtcclxuXHJcbiAgJjpob3ZlcntcclxuICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCAwIDJweCAjZmZmO1xyXG4gIH1cclxufVxyXG4iLCIvKiAgUG9zdFxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4ucG9zdC13cmFwcGVyIHtcclxuICBtYXJnaW4tdG9wOiAkaGVhZGVyLWhlaWdodDtcclxuICBwYWRkaW5nLXRvcDogMS44cmVtO1xyXG59XHJcblxyXG4ucG9zdCB7XHJcbiAgLy8gcGFkZGluZzogMTVweDtcclxuXHJcbiAgJi1oZWFkZXIge1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMS4ycmVtO1xyXG4gIH1cclxuXHJcbiAgJi10aXRsZSB7XHJcbiAgICBjb2xvcjogIzAwMDtcclxuICAgIGZvbnQtc2l6ZTogMi41cmVtO1xyXG4gICAgaGVpZ2h0OiBhdXRvO1xyXG4gICAgbGluZS1oZWlnaHQ6IDEuMDQ7XHJcbiAgICBtYXJnaW46IDAgMCAwLjkzNzVyZW07XHJcbiAgICBsZXR0ZXItc3BhY2luZzogLS4wMjhlbSAhaW1wb3J0YW50O1xyXG4gICAgcGFkZGluZzogMDtcclxuICB9XHJcblxyXG4gICYtZXhjZXJwdCB7XHJcbiAgICBsaW5lLWhlaWdodDogMS4zZW07XHJcbiAgICBmb250LXNpemU6IDIwcHg7XHJcbiAgICBjb2xvcjogIzdEN0Q3RDtcclxuICAgIG1hcmdpbi1ib3R0b206IDhweDtcclxuICB9XHJcblxyXG4gIC8vICBJbWFnZVxyXG4gICYtaW1hZ2V7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICB9XHJcblxyXG4gIC8vIHBvc3QgY29udGVudFxyXG4gICYtYm9keXtcclxuICAgIG1hcmdpbi1ib3R0b206IDJyZW07XHJcblxyXG4gICAgYTpmb2N1cyB7dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7fVxyXG5cclxuICAgIGgye1xyXG4gICAgICAvLyBib3JkZXItYm90dG9tOiAxcHggc29saWQgJGRpdmlkZXItY29sb3I7XHJcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICAgIG1hcmdpbjogMi41MHJlbSAwIDEuMjVyZW07XHJcbiAgICAgIHBhZGRpbmctYm90dG9tOiAzcHg7XHJcbiAgICB9XHJcbiAgICBoMyxoNHtcclxuICAgICAgbWFyZ2luOiAzMnB4IDAgMTZweDtcclxuICAgIH1cclxuXHJcbiAgICBpZnJhbWV7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XHJcbiAgICAgIG1hcmdpbjogMCBhdXRvIDEuNXJlbSAwICFpbXBvcnRhbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW1ne1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcclxuICAgIH1cclxuXHJcbiAgICBoMiBhLCBoMyBhLCBoNCBhIHtcclxuICAgICAgY29sb3I6ICRwcmltYXJ5LWNvbG9yLFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gdGFnc1xyXG4gICYtdGFncyB7XHJcbiAgICBtYXJnaW46IDEuMjVyZW0gMDtcclxuICB9XHJcbn1cclxuXHJcbi5wb3N0LWNhcmQgeyBwYWRkaW5nOiAxNXB4IH1cclxuXHJcbi8qIFBvc3QgYXV0aG9yIGJ5IGxpbmUgdG9wIChhdXRob3IgLSB0aW1lIC0gdGFnIC0gc2FocmUpXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5wb3N0LWJ5bGluZSB7XHJcbiAgY29sb3I6ICRzZWNvbmRhcnktdGV4dC1jb2xvcjtcclxuICBmb250LXNpemU6IDE0cHg7XHJcbiAgZmxleC1ncm93OiAxO1xyXG4gIGxldHRlci1zcGFjaW5nOiAtLjAyOGVtICFpbXBvcnRhbnQ7XHJcblxyXG4gIGEge1xyXG4gICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICAmOmFjdGl2ZSB7IHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyB9XHJcbiAgICAmOmhvdmVyIHsgY29sb3I6ICMyMjIgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gUG9zdCBhY3Rpb25zIHRvcFxyXG4ucG9zdC1hY3Rpb25zLS10b3AgLnNoYXJlIHtcclxuICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgZm9udC1zaXplOiAyMHB4O1xyXG5cclxuICAmOmhvdmVyIHsgb3BhY2l0eTogLjc7IH1cclxufVxyXG5cclxuLnBvc3QtYWN0aW9uLWNvbW1lbnRzIHtcclxuICBjb2xvcjogJHNlY29uZGFyeS10ZXh0LWNvbG9yO1xyXG4gIG1hcmdpbi1yaWdodDogMTVweDtcclxuICBmb250LXNpemU6IDE0cHg7XHJcbn1cclxuXHJcbi8qIFBvc3QgQWN0aW9uIHNvY2lhbCBtZWRpYVxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4ucG9zdC1hY3Rpb25zIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xyXG5cclxuICBhIHtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgZm9udC1zaXplOiAxLjEyNXJlbTtcclxuICAgICY6aG92ZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwICFpbXBvcnRhbnQ7IH1cclxuICB9XHJcblxyXG4gIGxpIHtcclxuICAgIG1hcmdpbi1sZWZ0OiA2cHg7XHJcbiAgICAmOmZpcnN0LWNoaWxkIHsgbWFyZ2luLWxlZnQ6IDAgIWltcG9ydGFudDsgfVxyXG4gIH1cclxuXHJcbiAgLmJ0biB7IGJvcmRlci1yYWRpdXM6IDA7IH1cclxufVxyXG5cclxuLyogUG9zdCBhdXRob3Igd2lkZ2V0IGJvdHRvbVxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4ucG9zdC1hdXRob3Ige1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBmb250LXNpemU6IDE1cHg7XHJcbiAgcGFkZGluZzogMzBweCAwIDMwcHggMTAwcHg7XHJcbiAgbWFyZ2luLWJvdHRvbTogM3JlbTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjNmNWY2O1xyXG5cclxuICBoNSB7XHJcbiAgICBjb2xvcjogI0FBQTtcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIGxpbmUtaGVpZ2h0OiAxLjU7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBmb250LXdlaWdodDogNTAwO1xyXG4gIH1cclxuXHJcbiAgbGkge1xyXG4gICAgbWFyZ2luLWxlZnQ6IDMwcHg7XHJcbiAgICBmb250LXNpemU6IDE0cHg7XHJcblxyXG4gICAgYSB7IGNvbG9yOiAjNTU1OyAmOmhvdmVyIHsgY29sb3I6ICMwMDAgfSB9XHJcblxyXG4gICAgJjpmaXJzdC1jaGlsZCB7IG1hcmdpbi1sZWZ0OiAwIH1cclxuICB9XHJcblxyXG4gICYtYmlvIHtcclxuICAgIG1heC13aWR0aDogNTAwcHg7XHJcbiAgfVxyXG5cclxuICAucG9zdC1hdXRob3ItYXZhdGFyIHtcclxuICAgIGhlaWdodDogNjRweDtcclxuICAgIHdpZHRoOiA2NHB4O1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgbGVmdDogMjBweDtcclxuICAgIHRvcDogMzBweDtcclxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XHJcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gIH1cclxufVxyXG5cclxuLyogYm90dG9tIHNoYXJlIGFuZCBib3R0b20gc3Vic2NyaWJlXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5zaGFyZS1zdWJzY3JpYmV7XHJcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcclxuXHJcbiAgcHtcclxuICAgIGNvbG9yOiAjN2Q3ZDdkO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcclxuICAgIGxpbmUtaGVpZ2h0OiAxO1xyXG4gICAgZm9udC1zaXplOiAkZm9udC1zaXplLXNtO1xyXG4gIH1cclxuXHJcbiAgLnNvY2lhbC1zaGFyZXtmbG9hdDogbm9uZSAhaW1wb3J0YW50O31cclxuXHJcbiAgJj5kaXZ7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMTVweDtcclxuICAgICY6YmVmb3Jle1xyXG4gICAgICBjb250ZW50OiBcIiBcIjtcclxuICAgICAgYm9yZGVyLXRvcDogc29saWQgMXB4ICMwMDA7XHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgdG9wOiAwO1xyXG4gICAgICBsZWZ0OiAxNXB4O1xyXG4gICAgICB3aWR0aDogNDBweDtcclxuICAgICAgaGVpZ2h0OiAxcHg7XHJcbiAgICB9XHJcblxyXG4gICAgaDV7XHJcbiAgICAgIGZvbnQtc2l6ZTogICRmb250LXNpemUtc207XHJcbiAgICAgIG1hcmdpbjogMXJlbSAwO1xyXG4gICAgICBsaW5lLWhlaWdodDogMTtcclxuICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vICBzdWJzY3JpYmVcclxuICAubmV3c2xldHRlci1mb3Jte1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuXHJcbiAgICAuZm9ybS1ncm91cHtcclxuICAgICAgbWF4LXdpZHRoOiAyNTBweDtcclxuICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICB9XHJcblxyXG4gICAgLmJ0bntcclxuICAgICAgYm9yZGVyLXJhZGl1czogMDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qIFJlbGF0ZWQgcG9zdFxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4ucG9zdC1yZWxhdGVkIHtcclxuICBtYXJnaW4tdG9wOiA0MHB4O1xyXG5cclxuICAmLXRpdGxlIHtcclxuICAgIGNvbG9yOiAjMDAwO1xyXG4gICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICAgIGhlaWdodDogYXV0bztcclxuICAgIGxpbmUtaGVpZ2h0OiAxN3B4O1xyXG4gICAgbWFyZ2luOiAwIDAgMjBweDtcclxuICAgIHBhZGRpbmctYm90dG9tOiAxMHB4O1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICB9XHJcblxyXG4gICYtbGlzdCB7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxOHB4O1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIGJvcmRlcjogbm9uZTtcclxuICB9XHJcbn1cclxuXHJcbi8qIE1lZGlhIFF1ZXJ5IChtZWRpdW0pXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG5AbWVkaWEgI3skbWQtYW5kLXVwfSB7XHJcbiAgLnBvc3Qge1xyXG4gICAgLnRpdGxlIHtcclxuICAgICAgZm9udC1zaXplOiAyLjI1cmVtO1xyXG4gICAgICBtYXJnaW46IDAgMCAxcmVtO1xyXG4gICAgfVxyXG5cclxuICAgICYtYm9keSB7XHJcbiAgICAgIGZvbnQtc2l6ZTogMS4xMjVyZW07XHJcbiAgICAgIGxpbmUtaGVpZ2h0OiAzMnB4O1xyXG5cclxuICAgICAgcCB7IG1hcmdpbi1ib3R0b206IDEuNXJlbSB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAucG9zdC1jYXJkIHsgcGFkZGluZzogMzBweCB9XHJcbn1cclxuXHJcblxyXG5AbWVkaWEgI3skc20tYW5kLWRvd259e1xyXG4gIC5wb3N0LXRpdGxle1xyXG4gICAgZm9udC1zaXplOiAxLjhyZW07XHJcbiAgfVxyXG4gIC5wb3N0LWltYWdlLFxyXG4gIC52aWRlby1yZXNwb25zaXZle1xyXG4gICAgbWFyZ2luLWxlZnQ6ICAtICgkZ3JpZC1ndXR0ZXItd2lkdGggLyAyKTtcclxuICAgIG1hcmdpbi1yaWdodDogLSAoJGdyaWQtZ3V0dGVyLXdpZHRoIC8gMik7XHJcbiAgfVxyXG59XHJcbiIsIi8qIHNpZGViYXJcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLnNpZGViYXIge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBsaW5lLWhlaWdodDogMS42O1xyXG5cclxuICBoMSxoMixoMyxoNCxoNSxoNiB7IG1hcmdpbi10b3A6IDA7IGNvbG9yOiAjMDAwIH1cclxuXHJcbiAgJi1pdGVtcyB7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAyLjVyZW07XHJcbiAgICBwYWRkaW5nOiAyNXB4O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIH1cclxuXHJcbiAgJi10aXRsZSB7XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogMTBweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgZm9udC1zaXplOiAxcmVtO1xyXG4gICAgLy8gZm9udC13ZWlnaHQ6ICRmb250LXdlaWdodDtcclxuXHJcbiAgICBAZXh0ZW5kIC51LWJvcmRlci1ib3R0b20tZGFyaztcclxuICB9XHJcblxyXG4gIC50aXRsZS1wcmltYXJ5IHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRwcmltYXJ5LWNvbG9yO1xyXG4gICAgY29sb3I6ICNGRkY7XHJcbiAgICBwYWRkaW5nOiAxMHB4IDE2cHg7XHJcbiAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgfVxyXG59XHJcblxyXG4uc2lkZWJhci1wb3N0IHtcclxuICAvLyBwYWRkaW5nLWJvdHRvbTogMnB4O1xyXG5cclxuICAmLS1ib3JkZXIge1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGJvcmRlci1sZWZ0OiAzcHggc29saWQgJHByaW1hcnktY29sb3I7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuMik7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZm9udC1zaXplOiAyOHB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICBwYWRkaW5nOiAxNXB4IDEwcHggMTBweDtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICB9XHJcblxyXG4gICY6bnRoLWNoaWxkKDNuKSB7IC5zaWRlYmFyLXBvc3QtLWJvcmRlciB7IGJvcmRlci1jb2xvcjogZGFya2VuKG9yYW5nZSwgMiUpIH0gfVxyXG4gICY6bnRoLWNoaWxkKDNuKzIpIHsgLnNpZGViYXItcG9zdC0tYm9yZGVyIHsgYm9yZGVyLWNvbG9yOiByZ2IoMCwgMTYwLCA1MikgfSB9XHJcblxyXG4gICYtLWxpbmsge1xyXG4gICAgLy8gYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwgMjU1LCAyNTUpO1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBtaW4taGVpZ2h0OiA1MHB4O1xyXG4gICAgcGFkZGluZzogMTBweCAxNXB4IDEwcHggNTVweDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbiAgICAmOmhvdmVyIC5zaWRlYmFyLXBvc3QtLWJvcmRlciB7XHJcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyMjksIDIzOSwgMjQ1KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gICYtLXRpdGxlIHtcclxuICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOCk7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICBmb250LXdlaWdodDogNTAwO1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gIH1cclxufVxyXG4iLCIuc3Vic2NyaWJle1xyXG4gIG1pbi1oZWlnaHQ6IDkwdmg7XHJcbiAgcGFkZGluZy10b3A6ICRoZWFkZXItaGVpZ2h0O1xyXG5cclxuICBoM3tcclxuICAgIG1hcmdpbjogMDtcclxuICAgIG1hcmdpbi1ib3R0b206IDhweDtcclxuICAgIGZvbnQ6IDQwMCAyMHB4LzMycHggJHByaW1hcnktZm9udDtcclxuICB9XHJcblxyXG4gICYtdGl0bGV7XHJcbiAgICBmb250LXdlaWdodDogNDAwO1xyXG4gICAgbWFyZ2luLXRvcDogMDtcclxuICB9XHJcblxyXG4gICYtd3JhcHtcclxuICAgIG1heC13aWR0aDogNzAwcHg7XHJcbiAgICBjb2xvcjogIzdkODc4YTtcclxuICAgIHBhZGRpbmc6IDFyZW0gMDtcclxuICB9XHJcblxyXG4gIC5mb3JtLWdyb3Vwe1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xyXG5cclxuICAgICYuZXJyb3J7XHJcbiAgICAgIGlucHV0IHtib3JkZXItY29sb3I6ICNmZjViNWI7fVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLmJ0bntcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi5zdWJzY3JpYmUtZm9ybXtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgbWFyZ2luOiAzMHB4IGF1dG87XHJcbiAgcGFkZGluZzogNDBweDtcclxuICBtYXgtd2lkdGg6IDQwMHB4O1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGJhY2tncm91bmQ6ICNlYmVmZjI7XHJcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gIHRleHQtYWxpZ246IGxlZnQ7XHJcbn1cclxuXHJcbi5zdWJzY3JpYmUtaW5wdXR7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgcGFkZGluZzogMTBweDtcclxuICBib3JkZXI6ICM0Mjg1ZjQgIDFweCBzb2xpZDtcclxuICBib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgJjpmb2N1c3tcclxuICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgfVxyXG59XHJcbiIsIi8vIGFuaW1hdGVkIEdsb2JhbFxyXG4uYW5pbWF0ZWQge1xyXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMXM7XHJcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcclxuXHJcbiAgJi5pbmZpbml0ZSB7IGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlIH1cclxufVxyXG5cclxuLy8gYW5pbWF0ZWQgQWxsXHJcbi5ib3VuY2VJbiB7IGFuaW1hdGlvbi1uYW1lOiBib3VuY2VJbjsgfVxyXG4uYm91bmNlSW5Eb3duIHsgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZUluRG93biB9XHJcbi5zbGlkZUluVXAgeyBhbmltYXRpb24tbmFtZTogc2xpZGVJblVwIH1cclxuLnNsaWRlT3V0RG93biB7IGFuaW1hdGlvbi1uYW1lOiBzbGlkZU91dERvd24gfVxyXG5cclxuLy8gYWxsIGtleWZyYW1lcyBBbmltYXRlc1xyXG5cclxuLy8gYm91bmNlSW5cclxuQGtleWZyYW1lcyBib3VuY2VJbiB7XHJcbiAgICAwJSwgMjAlLCA0MCUsIDYwJSwgODAlLCAxMDAlIHtcclxuICAgICAgICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC4yMTUsIDAuNjEwLCAwLjM1NSwgMS4wMDApO1xyXG4gICAgfVxyXG5cclxuICAgIDAlIHtcclxuICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUzZCguMywgLjMsIC4zKTtcclxuICAgIH1cclxuXHJcbiAgICAyMCUge1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUzZCgxLjEsIDEuMSwgMS4xKTtcclxuICAgIH1cclxuXHJcbiAgICA0MCUge1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUzZCguOSwgLjksIC45KTtcclxuICAgIH1cclxuXHJcbiAgICA2MCUge1xyXG4gICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZTNkKDEuMDMsIDEuMDMsIDEuMDMpO1xyXG4gICAgfVxyXG5cclxuICAgIDgwJSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZTNkKC45NywgLjk3LCAuOTcpO1xyXG4gICAgfVxyXG5cclxuICAgIDEwMCUge1xyXG4gICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZTNkKDEsIDEsIDEpO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vIGJvdW5jZUluRG93blxyXG5Aa2V5ZnJhbWVzIGJvdW5jZUluRG93biB7XHJcbiAgICAwJSwgNjAlLCA3NSUsIDkwJSwgMTAwJSB7XHJcbiAgICAgICAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuMjE1LCAwLjYxMCwgMC4zNTUsIDEuMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICAwJSB7XHJcbiAgICAgICAgb3BhY2l0eTogMDtcclxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIC0zMDAwcHgsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIDYwJSB7XHJcbiAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDI1cHgsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIDc1JSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAtMTBweCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgOTAlIHtcclxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDVweCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgMTAwJSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBub25lO1xyXG4gICAgfVxyXG59XHJcblxyXG5Aa2V5ZnJhbWVzIHB1bHNle1xyXG4gICAgZnJvbXtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlM2QoMSwgMSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgNTAlIHtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlM2QoMS4wNSwgMS4wNSwgMS4wNSk7XHJcbiAgICB9XHJcblxyXG4gICAgdG8ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUzZCgxLCAxLCAxKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbkBrZXlmcmFtZXMgc2Nyb2xse1xyXG4gICAgMCV7XHJcbiAgICAgICAgb3BhY2l0eTowXHJcbiAgICB9XHJcbiAgICAxMCV7XHJcbiAgICAgICAgb3BhY2l0eToxO1xyXG4gICAgICAgIHRyYW5zZm9ybTp0cmFuc2xhdGVZKDBweClcclxuICAgIH1cclxuICAgIDEwMCUge1xyXG4gICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDEwcHgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyAgc3BpbiBmb3IgcGFnaW5hdGlvblxyXG5Aa2V5ZnJhbWVzIHNwaW4ge1xyXG4gICAgZnJvbSB7IHRyYW5zZm9ybTpyb3RhdGUoMGRlZyk7IH1cclxuICAgIHRvIHsgdHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpOyB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgc2xpZGVJblVwIHtcclxuICBmcm9tIHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMTAwJSwgMCk7XHJcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xyXG4gIH1cclxuXHJcbiAgdG8ge1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcclxuICB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgc2xpZGVPdXREb3duIHtcclxuICBmcm9tIHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMCwgMCk7XHJcbiAgfVxyXG5cclxuICB0byB7XHJcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDIwJSwgMCk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsT0FBTyxDQUFQLGlDQUFPO0FBQ1AsT0FBTyxDQUFQLDhCQUFPO0FDUlAsQUFBQSxHQUFHLEFBQUEsYUFBYSxDQUFDO0VBQ2hCLFFBQVEsRUFBRSxRQUFRO0VBQ2xCLFlBQVksRUFBRSxLQUFLO0VBQ25CLGFBQWEsRUFBRSxVQUFVLEdBQ3pCOztBQUVELEFBQW1CLEdBQWhCLEFBQUEsYUFBYSxHQUFHLElBQUksQ0FBQztFQUN2QixRQUFRLEVBQUUsUUFBUTtFQUNmLFdBQVcsRUFBRSxPQUFPLEdBQ3ZCOztBQUVELEFBQWMsYUFBRCxDQUFDLGtCQUFrQixDQUFDO0VBQ2hDLFFBQVEsRUFBRSxRQUFRO0VBQ2xCLGNBQWMsRUFBRSxJQUFJO0VBQ3BCLEdBQUcsRUFBRSxDQUFDO0VBQ04sU0FBUyxFQUFFLElBQUk7RUFDZixJQUFJLEVBQUUsTUFBTTtFQUNaLEtBQUssRUFBRSxHQUFHO0VBQUcsNkNBQTZDO0VBQzFELGNBQWMsRUFBRSxJQUFJO0VBQ3BCLFlBQVksRUFBRSxjQUFjO0VBRTVCLG1CQUFtQixFQUFFLElBQUk7RUFDekIsZ0JBQWdCLEVBQUUsSUFBSTtFQUN0QixlQUFlLEVBQUUsSUFBSTtFQUNyQixXQUFXLEVBQUUsSUFBSSxHQUVqQjs7QUFFQSxBQUFxQixrQkFBSCxHQUFHLElBQUksQ0FBQztFQUN6QixjQUFjLEVBQUUsSUFBSTtFQUNw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 */","pre.line-numbers {\n\tposition: relative;\n\tpadding-left: 3.8em;\n\tcounter-reset: linenumber;\n}\n\npre.line-numbers > code {\n\tposition: relative;\n    white-space: inherit;\n}\n\n.line-numbers .line-numbers-rows {\n\tposition: absolute;\n\tpointer-events: none;\n\ttop: 0;\n\tfont-size: 100%;\n\tleft: -3.8em;\n\twidth: 3em; /* works for line-numbers below 1000 lines */\n\tletter-spacing: -1px;\n\tborder-right: 1px solid #999;\n\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n\n}\n\n\t.line-numbers-rows > span {\n\t\tpointer-events: none;\n\t\tdisplay: block;\n\t\tcounter-increment: linenumber;\n\t}\n\n\t\t.line-numbers-rows > span:before {\n\t\t\tcontent: counter(linenumber);\n\t\t\tcolor: #999;\n\t\t\tdisplay: block;\n\t\t\tpadding-right: 0.8em;\n\t\t\ttext-align: right;\n\t\t}","@charset \"UTF-8\";\n\n@import url(~normalize.css/normalize.css);\n\n@import url(~prismjs/themes/prism.css);\n\npre.line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber;\n}\n\npre.line-numbers > code {\n  position: relative;\n  white-space: inherit;\n}\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber;\n}\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right;\n}\n\n@font-face {\n  font-family: 'mapache';\n  src: url(\"./../fonts/mapache.ttf\") format(\"truetype\"), url(\"./../fonts/mapache.woff\") format(\"woff\"), url(\"./../fonts/mapache.svg\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n\n[class^=\"i-\"]:before,\n[class*=\" i-\"]:before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.i-navigate_before:before {\n  content: \"\\e408\";\n}\n\n.i-navigate_next:before {\n  content: \"\\e409\";\n}\n\n.i-tag:before {\n  content: \"\\e54e\";\n}\n\n.i-keyboard_arrow_down:before {\n  content: \"\\e313\";\n}\n\n.i-arrow_upward:before {\n  content: \"\\e5d8\";\n}\n\n.i-cloud_download:before {\n  content: \"\\e2c0\";\n}\n\n.i-star:before {\n  content: \"\\e838\";\n}\n\n.i-keyboard_arrow_up:before {\n  content: \"\\e316\";\n}\n\n.i-open_in_new:before {\n  content: \"\\e89e\";\n}\n\n.i-warning:before {\n  content: \"\\e002\";\n}\n\n.i-back:before {\n  content: \"\\e5c4\";\n}\n\n.i-forward:before {\n  content: \"\\e5c8\";\n}\n\n.i-chat:before {\n  content: \"\\e0cb\";\n}\n\n.i-close:before {\n  content: \"\\e5cd\";\n}\n\n.i-code2:before {\n  content: \"\\e86f\";\n}\n\n.i-favorite:before {\n  content: \"\\e87d\";\n}\n\n.i-link:before {\n  content: \"\\e157\";\n}\n\n.i-menu:before {\n  content: \"\\e5d2\";\n}\n\n.i-feed:before {\n  content: \"\\e0e5\";\n}\n\n.i-search:before {\n  content: \"\\e8b6\";\n}\n\n.i-share:before {\n  content: \"\\e80d\";\n}\n\n.i-check_circle:before {\n  content: \"\\e86c\";\n}\n\n.i-play:before {\n  content: \"\\e901\";\n}\n\n.i-download:before {\n  content: \"\\e900\";\n}\n\n.i-code:before {\n  content: \"\\f121\";\n}\n\n.i-behance:before {\n  content: \"\\f1b4\";\n}\n\n.i-spotify:before {\n  content: \"\\f1bc\";\n}\n\n.i-codepen:before {\n  content: \"\\f1cb\";\n}\n\n.i-github:before {\n  content: \"\\f09b\";\n}\n\n.i-linkedin:before {\n  content: \"\\f0e1\";\n}\n\n.i-flickr:before {\n  content: \"\\f16e\";\n}\n\n.i-dribbble:before {\n  content: \"\\f17d\";\n}\n\n.i-pinterest:before {\n  content: \"\\f231\";\n}\n\n.i-map:before {\n  content: \"\\f041\";\n}\n\n.i-twitter:before {\n  content: \"\\f099\";\n}\n\n.i-facebook:before {\n  content: \"\\f09a\";\n}\n\n.i-youtube:before {\n  content: \"\\f16a\";\n}\n\n.i-instagram:before {\n  content: \"\\f16d\";\n}\n\n.i-google:before {\n  content: \"\\f1a0\";\n}\n\n.i-pocket:before {\n  content: \"\\f265\";\n}\n\n.i-reddit:before {\n  content: \"\\f281\";\n}\n\n.i-snapchat:before {\n  content: \"\\f2ac\";\n}\n\n.i-telegram:before {\n  content: \"\\f2c6\";\n}\n\n/*\r\n@package godofredoninja\r\n\r\n========================================================================\r\nMapache variables styles\r\n========================================================================\r\n*/\n\n/**\r\n* Table of Contents:\r\n*\r\n*   1. Colors\r\n*   2. Fonts\r\n*   3. Typography\r\n*   4. Header\r\n*   5. Footer\r\n*   6. Code Syntax\r\n*   7. buttons\r\n*   8. container\r\n*   9. Grid\r\n*   10. Media Query Ranges\r\n*   11. Icons\r\n*/\n\n/* 1. Colors\r\n========================================================================== */\n\n/* 2. Fonts\r\n========================================================================== */\n\n/* 3. Typography\r\n========================================================================== */\n\n/* 4. Header\r\n========================================================================== */\n\n/* 5. Entry articles\r\n========================================================================== */\n\n/* 5. Footer\r\n========================================================================== */\n\n/* 6. Code Syntax\r\n========================================================================== */\n\n/* 7. buttons\r\n========================================================================== */\n\n/* 8. container\r\n========================================================================== */\n\n/* 9. Grid\r\n========================================================================== */\n\n/* 10. Media Query Ranges\r\n========================================================================== */\n\n/* 11. icons\r\n========================================================================== */\n\n.header.toolbar-shadow {\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n}\n\na.external::after,\nhr::before,\n.warning:before,\n.note:before,\n.success:before,\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after,\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.u-clear::after {\n  clear: both;\n  content: \"\";\n  display: table;\n}\n\n.u-not-avatar {\n  background-image: url(\"./../images/avatar.png\");\n}\n\n.u-relative {\n  position: relative;\n}\n\n.u-block {\n  display: block;\n}\n\n.u-absolute0 {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n\n.u-bg-cover {\n  background-position: center;\n  background-size: cover;\n}\n\n.u-bg-gradient {\n  background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, 0.8)));\n}\n\n.u-border-bottom-dark,\n.sidebar-title {\n  border-bottom: solid 1px #000;\n}\n\n.u-b-t {\n  border-top: solid 1px #eee;\n}\n\n.u-p-t-2 {\n  padding-top: 2rem;\n}\n\n.u-unstyled {\n  list-style-type: none;\n  margin: 0;\n  padding-left: 0;\n}\n\n.u-floatLeft {\n  float: left !important;\n}\n\n.u-floatRight {\n  float: right !important;\n}\n\n.u-flex {\n  display: flex;\n  flex-direction: row;\n}\n\n.u-flex-wrap {\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.u-flex-center,\n.header-logo,\n.header-follow a,\n.header-menu a {\n  display: flex;\n  align-items: center;\n}\n\n.u-flex-aling-right {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n}\n\n.u-flex-aling-center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n}\n\n.u-m-t-1 {\n  margin-top: 1rem;\n}\n\n/* Tags\r\n========================================================================== */\n\n.u-tags {\n  font-size: 12px !important;\n  margin: 3px !important;\n  color: #4c5765 !important;\n  background-color: #ebebeb !important;\n  transition: all .3s;\n}\n\n.u-tags::before {\n  padding-right: 5px;\n  opacity: .8;\n}\n\n.u-tags:hover {\n  background-color: #4285f4 !important;\n  color: #fff !important;\n}\n\n.u-tag {\n  background-color: #4285f4;\n  color: #fff;\n  padding: 4px 12px;\n  font-size: 11px;\n  display: inline-block;\n  text-transform: uppercase;\n}\n\n.u-hide {\n  display: none !important;\n}\n\n.u-card-shadow {\n  background-color: #fff;\n  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.02);\n}\n\n.u-not-image {\n  background-repeat: repeat;\n  background-size: initial !important;\n  background-color: #fff;\n}\n\n@media only screen and (max-width: 766px) {\n  .u-h-b-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  .u-h-b-lg {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  .u-h-a-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .u-h-a-lg {\n    display: none !important;\n  }\n}\n\nhtml {\n  box-sizing: border-box;\n  font-size: 16px;\n  -webkit-tap-highlight-color: transparent;\n}\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\na {\n  color: #039be5;\n  outline: 0;\n  text-decoration: none;\n  -webkit-tap-highlight-color: transparent;\n}\n\na:focus {\n  text-decoration: none;\n}\n\na.external::after {\n  content: \"\";\n  margin-left: 5px;\n}\n\nbody {\n  color: #333;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 0 auto;\n  background-color: #f5f5f5;\n}\n\nfigure {\n  margin: 0;\n}\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n}\n\nimg:not([src]) {\n  visibility: hidden;\n}\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n\ni {\n  display: inline-block;\n  vertical-align: middle;\n}\n\nhr {\n  background: #F1F2F1;\n  background: linear-gradient(to right, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  border: none;\n  height: 1px;\n  margin: 80px auto;\n  max-width: 90%;\n  position: relative;\n}\n\nhr::before {\n  background: #fff;\n  color: rgba(73, 55, 65, 0.75);\n  content: \"\";\n  display: block;\n  font-size: 35px;\n  left: 50%;\n  padding: 0 25px;\n  position: absolute;\n  top: 50%;\n  transform: translate(-50%, -50%);\n}\n\nblockquote {\n  border-left: 4px solid #4285f4;\n  padding: .75rem 1.5rem;\n  background: #fbfbfc;\n  color: #757575;\n  font-size: 1.125rem;\n  line-height: 1.7;\n  margin: 0 0 1.25rem;\n  quotes: none;\n}\n\nol,\nul,\nblockquote {\n  margin-left: 2rem;\n}\n\nstrong {\n  font-weight: 500;\n}\n\nsmall,\n.small {\n  font-size: 85%;\n}\n\nol {\n  padding-left: 40px;\n  list-style: decimal outside;\n}\n\nmark {\n  background-color: #fdffb6;\n}\n\n.footer,\n.main {\n  transition: transform .5s ease;\n  z-index: 2;\n}\n\n/* Code Syntax\r\n========================================================================== */\n\nkbd,\nsamp,\ncode {\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  color: #c7254e;\n  background: #f7f7f7;\n  border-radius: 4px;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\ncode[class*=language-],\npre[class*=language-] {\n  color: #37474f;\n  line-height: 1.5;\n}\n\ncode[class*=language-] .token.comment,\npre[class*=language-] .token.comment {\n  opacity: .8;\n}\n\ncode[class*=language-].line-numbers,\npre[class*=language-].line-numbers {\n  padding-left: 58px;\n}\n\ncode[class*=language-].line-numbers::before,\npre[class*=language-].line-numbers::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  background: #F0EDEE;\n  width: 40px;\n  height: 100%;\n}\n\ncode[class*=language-] .line-numbers-rows,\npre[class*=language-] .line-numbers-rows {\n  border-right: none;\n  top: -3px;\n  left: -58px;\n}\n\ncode[class*=language-] .line-numbers-rows > span::before,\npre[class*=language-] .line-numbers-rows > span::before {\n  padding-right: 0;\n  text-align: center;\n  opacity: .8;\n}\n\npre {\n  background-color: #f7f7f7 !important;\n  padding: 1rem;\n  overflow: hidden;\n  border-radius: 4px;\n  word-wrap: normal;\n  margin: 2.5rem 0 !important;\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  position: relative;\n}\n\npre code {\n  color: #37474f;\n  text-shadow: 0 1px #fff;\n  padding: 0;\n  background: transparent;\n}\n\n/* .warning & .note & .success\r\n========================================================================== */\n\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n}\n\n.warning:before {\n  content: \"\";\n}\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n}\n\n.note:before {\n  content: \"\";\n}\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n}\n\n.success:before {\n  content: \"\";\n  color: #00bfa5;\n}\n\n.warning,\n.note,\n.success {\n  display: block;\n  margin: 1rem 0;\n  font-size: 1rem;\n  padding: 12px 24px 12px 60px;\n  line-height: 1.5;\n}\n\n.warning a,\n.note a,\n.success a {\n  text-decoration: underline;\n  color: inherit;\n}\n\n.warning:before,\n.note:before,\n.success:before {\n  margin-left: -36px;\n  float: left;\n  font-size: 24px;\n}\n\n/* Social icon color and background\r\n========================================================================== */\n\n.c-facebook {\n  color: #3b5998;\n}\n\n.bg-facebook,\n.nav-mob-follow .i-facebook {\n  background-color: #3b5998 !important;\n}\n\n.c-twitter {\n  color: #55acee;\n}\n\n.bg-twitter,\n.nav-mob-follow .i-twitter {\n  background-color: #55acee !important;\n}\n\n.c-google {\n  color: #dd4b39;\n}\n\n.bg-google,\n.nav-mob-follow .i-google {\n  background-color: #dd4b39 !important;\n}\n\n.c-instagram {\n  color: #306088;\n}\n\n.bg-instagram,\n.nav-mob-follow .i-instagram {\n  background-color: #306088 !important;\n}\n\n.c-youtube {\n  color: #e52d27;\n}\n\n.bg-youtube,\n.nav-mob-follow .i-youtube {\n  background-color: #e52d27 !important;\n}\n\n.c-github {\n  color: #333333;\n}\n\n.bg-github,\n.nav-mob-follow .i-github {\n  background-color: #333333 !important;\n}\n\n.c-linkedin {\n  color: #007bb6;\n}\n\n.bg-linkedin,\n.nav-mob-follow .i-linkedin {\n  background-color: #007bb6 !important;\n}\n\n.c-spotify {\n  color: #2ebd59;\n}\n\n.bg-spotify,\n.nav-mob-follow .i-spotify {\n  background-color: #2ebd59 !important;\n}\n\n.c-codepen {\n  color: #222222;\n}\n\n.bg-codepen,\n.nav-mob-follow .i-codepen {\n  background-color: #222222 !important;\n}\n\n.c-behance {\n  color: #131418;\n}\n\n.bg-behance,\n.nav-mob-follow .i-behance {\n  background-color: #131418 !important;\n}\n\n.c-dribbble {\n  color: #ea4c89;\n}\n\n.bg-dribbble,\n.nav-mob-follow .i-dribbble {\n  background-color: #ea4c89 !important;\n}\n\n.c-flickr {\n  color: #0063DC;\n}\n\n.bg-flickr,\n.nav-mob-follow .i-flickr {\n  background-color: #0063DC !important;\n}\n\n.c-reddit {\n  color: orangered;\n}\n\n.bg-reddit,\n.nav-mob-follow .i-reddit {\n  background-color: orangered !important;\n}\n\n.c-pocket {\n  color: #F50057;\n}\n\n.bg-pocket,\n.nav-mob-follow .i-pocket {\n  background-color: #F50057 !important;\n}\n\n.c-pinterest {\n  color: #bd081c;\n}\n\n.bg-pinterest,\n.nav-mob-follow .i-pinterest {\n  background-color: #bd081c !important;\n}\n\n.c-feed {\n  color: orange;\n}\n\n.bg-feed,\n.nav-mob-follow .i-feed {\n  background-color: orange !important;\n}\n\n.c-telegram {\n  color: #08c;\n}\n\n.bg-telegram,\n.nav-mob-follow .i-telegram {\n  background-color: #08c !important;\n}\n\n.clear:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n/* pagination Infinite scroll\r\n========================================================================== */\n\n.mapache-load-more {\n  border: solid 1px #C3C3C3;\n  color: #7D7D7D;\n  display: block;\n  font-size: 15px;\n  height: 45px;\n  margin: 4rem auto;\n  padding: 11px 16px;\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n.mapache-load-more:hover {\n  background: #4285f4;\n  border-color: #4285f4;\n  color: #fff;\n}\n\n.pagination-nav {\n  padding: 2.5rem 0 3rem;\n  text-align: center;\n}\n\n.pagination-nav .page-number {\n  display: none;\n  padding-top: 5px;\n}\n\n@media only screen and (min-width: 766px) {\n  .pagination-nav .page-number {\n    display: inline-block;\n  }\n}\n\n.pagination-nav .newer-posts {\n  float: left;\n}\n\n.pagination-nav .older-posts {\n  float: right;\n}\n\n/* Scroll Top\r\n========================================================================== */\n\n.scroll_top {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  z-index: 11;\n  width: 60px;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity 0.5s ease;\n}\n\n.scroll_top.visible {\n  opacity: 1;\n  visibility: visible;\n}\n\n.scroll_top:hover svg path {\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n.svg-icon svg {\n  width: 100%;\n  height: auto;\n  display: block;\n  fill: currentcolor;\n}\n\n/* Video Responsive\r\n========================================================================== */\n\n.video-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n  padding-bottom: 56.25%;\n  margin-bottom: 1.5rem;\n}\n\n.video-responsive iframe {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  border: 0;\n}\n\n/* Video full for tag video\r\n========================================================================== */\n\n#video-format .video-content {\n  display: flex;\n  padding-bottom: 1rem;\n}\n\n#video-format .video-content span {\n  display: inline-block;\n  vertical-align: middle;\n  margin-right: .8rem;\n}\n\n/* Page error 404\r\n========================================================================== */\n\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n  height: 100vh;\n  position: relative;\n  width: 100%;\n}\n\n.errorPage-title {\n  padding: 24px 60px;\n}\n\n.errorPage-link {\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 22px;\n  font-weight: 500;\n  left: -5px;\n  position: relative;\n  text-rendering: optimizeLegibility;\n  top: -6px;\n}\n\n.errorPage-emoji {\n  color: rgba(0, 0, 0, 0.4);\n  font-size: 150px;\n}\n\n.errorPage-text {\n  color: rgba(0, 0, 0, 0.4);\n  line-height: 21px;\n  margin-top: 60px;\n  white-space: pre-wrap;\n}\n\n.errorPage-wrap {\n  display: block;\n  left: 50%;\n  min-width: 680px;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  transform: translate(-50%, -50%);\n}\n\n/* Post Twitter facebook card embed Css Center\r\n========================================================================== */\n\n.post iframe[src*=\"facebook.com\"],\n.post .fb-post,\n.post .twitter-tweet {\n  display: block !important;\n  margin: 1.5rem 0 !important;\n}\n\n.container {\n  margin: 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n  width: 100%;\n  max-width: 1250px;\n}\n\n.margin-top {\n  margin-top: 50px;\n  padding-top: 1rem;\n}\n\n@media only screen and (min-width: 766px) {\n  .margin-top {\n    padding-top: 1.8rem;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  .content {\n    flex-basis: 69.66666667% !important;\n    max-width: 69.66666667% !important;\n  }\n\n  .sidebar {\n    flex-basis: 30.33333333% !important;\n    max-width: 30.33333333% !important;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  .content {\n    padding-right: 40px !important;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .feed-entry-wrapper .entry-image {\n    width: 40% !important;\n    max-width: 40% !important;\n  }\n\n  .feed-entry-wrapper .entry-body {\n    width: 60% !important;\n    max-width: 60% !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  body.is-article .content {\n    max-width: 100% !important;\n  }\n}\n\n.row {\n  display: flex;\n  flex: 0 1 auto;\n  flex-flow: row wrap;\n  margin-left: -0.9375rem;\n  margin-right: -0.9375rem;\n}\n\n.row .col {\n  flex: 0 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n}\n\n.row .col.s1 {\n  flex-basis: 8.33333%;\n  max-width: 8.33333%;\n}\n\n.row .col.s2 {\n  flex-basis: 16.66667%;\n  max-width: 16.66667%;\n}\n\n.row .col.s3 {\n  flex-basis: 25%;\n  max-width: 25%;\n}\n\n.row .col.s4 {\n  flex-basis: 33.33333%;\n  max-width: 33.33333%;\n}\n\n.row .col.s5 {\n  flex-basis: 41.66667%;\n  max-width: 41.66667%;\n}\n\n.row .col.s6 {\n  flex-basis: 50%;\n  max-width: 50%;\n}\n\n.row .col.s7 {\n  flex-basis: 58.33333%;\n  max-width: 58.33333%;\n}\n\n.row .col.s8 {\n  flex-basis: 66.66667%;\n  max-width: 66.66667%;\n}\n\n.row .col.s9 {\n  flex-basis: 75%;\n  max-width: 75%;\n}\n\n.row .col.s10 {\n  flex-basis: 83.33333%;\n  max-width: 83.33333%;\n}\n\n.row .col.s11 {\n  flex-basis: 91.66667%;\n  max-width: 91.66667%;\n}\n\n.row .col.s12 {\n  flex-basis: 100%;\n  max-width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  .row .col.m1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  .row .col.m2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  .row .col.m3 {\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .row .col.m4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  .row .col.m5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  .row .col.m6 {\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .row .col.m7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  .row .col.m8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  .row .col.m9 {\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .row .col.m10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  .row .col.m11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  .row .col.m12 {\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .row .col.l1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  .row .col.l2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  .row .col.l3 {\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .row .col.l4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  .row .col.l5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  .row .col.l6 {\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .row .col.l7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  .row .col.l8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  .row .col.l9 {\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .row .col.l10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  .row .col.l11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  .row .col.l12 {\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\n.h1,\n.h2,\n.h3,\n.h4,\n.h5,\n.h6 {\n  margin-bottom: 0.5rem;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: 700;\n  line-height: 1.1;\n  color: inherit;\n}\n\nh1 {\n  font-size: 2.25rem;\n}\n\nh2 {\n  font-size: 1.875rem;\n}\n\nh3 {\n  font-size: 1.5625rem;\n}\n\nh4 {\n  font-size: 1.375rem;\n}\n\nh5 {\n  font-size: 1.125rem;\n}\n\nh6 {\n  font-size: 1rem;\n}\n\n.h1 {\n  font-size: 2.25rem;\n}\n\n.h2 {\n  font-size: 1.875rem;\n}\n\n.h3 {\n  font-size: 1.5625rem;\n}\n\n.h4 {\n  font-size: 1.375rem;\n}\n\n.h5 {\n  font-size: 1.125rem;\n}\n\n.h6 {\n  font-size: 1rem;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  margin-bottom: 1rem;\n}\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  color: inherit;\n  line-height: inherit;\n}\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\n\n/* Navigation Mobile\r\n========================================================================== */\n\n.nav-mob {\n  background: #4285f4;\n  color: #000;\n  height: 100vh;\n  left: 0;\n  padding: 0 20px;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  transition: .4s;\n  will-change: transform;\n  z-index: 997;\n}\n\n.nav-mob a {\n  color: inherit;\n}\n\n.nav-mob ul a {\n  display: block;\n  font-weight: 500;\n  padding: 8px 0;\n  text-transform: uppercase;\n  font-size: 14px;\n}\n\n.nav-mob-content {\n  background: #eee;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  bottom: 0;\n  left: 0;\n  padding: 20px 0;\n  position: absolute;\n  right: 0;\n  top: 50px;\n}\n\n.nav-mob ul,\n.nav-mob-subscribe,\n.nav-mob-follow {\n  border-bottom: solid 1px #DDD;\n  padding: 0 0.9375rem 20px 0.9375rem;\n  margin-bottom: 15px;\n}\n\n/* Navigation Mobile follow\r\n========================================================================== */\n\n.nav-mob-follow a {\n  font-size: 20px !important;\n  margin: 0 2px !important;\n  padding: 0;\n}\n\n.nav-mob-follow .i-facebook {\n  color: #fff;\n}\n\n.nav-mob-follow .i-twitter {\n  color: #fff;\n}\n\n.nav-mob-follow .i-google {\n  color: #fff;\n}\n\n.nav-mob-follow .i-instagram {\n  color: #fff;\n}\n\n.nav-mob-follow .i-youtube {\n  color: #fff;\n}\n\n.nav-mob-follow .i-github {\n  color: #fff;\n}\n\n.nav-mob-follow .i-linkedin {\n  color: #fff;\n}\n\n.nav-mob-follow .i-spotify {\n  color: #fff;\n}\n\n.nav-mob-follow .i-codepen {\n  color: #fff;\n}\n\n.nav-mob-follow .i-behance {\n  color: #fff;\n}\n\n.nav-mob-follow .i-dribbble {\n  color: #fff;\n}\n\n.nav-mob-follow .i-flickr {\n  color: #fff;\n}\n\n.nav-mob-follow .i-reddit {\n  color: #fff;\n}\n\n.nav-mob-follow .i-pocket {\n  color: #fff;\n}\n\n.nav-mob-follow .i-pinterest {\n  color: #fff;\n}\n\n.nav-mob-follow .i-feed {\n  color: #fff;\n}\n\n.nav-mob-follow .i-telegram {\n  color: #fff;\n}\n\n/* CopyRigh\r\n========================================================================== */\n\n.nav-mob-copyright {\n  color: #aaa;\n  font-size: 13px;\n  padding: 20px 15px 0;\n  text-align: center;\n  width: 100%;\n}\n\n.nav-mob-copyright a {\n  color: #4285f4;\n}\n\n/* subscribe\r\n========================================================================== */\n\n.nav-mob-subscribe .btn,\n.nav-mob-subscribe .nav-mob-follow a,\n.nav-mob-follow .nav-mob-subscribe a {\n  border-radius: 0;\n  text-transform: none;\n  width: 80px;\n}\n\n.nav-mob-subscribe .form-group {\n  width: calc(100% - 80px);\n}\n\n.nav-mob-subscribe input {\n  border: 0;\n  box-shadow: none !important;\n}\n\n/* Header Page\r\n========================================================================== */\n\n.header {\n  background: #4285f4;\n  height: 50px;\n  left: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: 999;\n}\n\n.header-wrap a {\n  color: #fff;\n}\n\n.header-logo,\n.header-follow a,\n.header-menu a {\n  height: 50px;\n}\n\n.header-follow,\n.header-search,\n.header-logo {\n  flex: 0 0 auto;\n}\n\n.header-logo {\n  z-index: 998;\n  font-size: 1.25rem;\n  font-weight: 500;\n  letter-spacing: 1px;\n}\n\n.header-logo img {\n  max-height: 35px;\n  position: relative;\n}\n\n.header .nav-mob-toggle,\n.header .search-mob-toggle {\n  padding: 0;\n  z-index: 998;\n}\n\n.header .nav-mob-toggle {\n  margin-left: 0 !important;\n  margin-right: -0.9375rem;\n  position: relative;\n  transition: transform .4s;\n}\n\n.header .nav-mob-toggle span {\n  background-color: #fff;\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  transition: .4s;\n  width: 20px;\n}\n\n.header .nav-mob-toggle span:first-child {\n  transform: translate(0, -6px);\n}\n\n.header .nav-mob-toggle span:last-child {\n  transform: translate(0, 6px);\n}\n\n.header:not(.toolbar-shadow) {\n  background-color: transparent !important;\n}\n\n/* Header Navigation\r\n========================================================================== */\n\n.header-menu {\n  flex: 1 1 0;\n  overflow: hidden;\n  transition: flex .2s,margin .2s,width .2s;\n}\n\n.header-menu ul {\n  margin-left: 2rem;\n  white-space: nowrap;\n}\n\n.header-menu ul li {\n  padding-right: 15px;\n  display: inline-block;\n}\n\n.header-menu ul a {\n  padding: 0 8px;\n  position: relative;\n}\n\n.header-menu ul a:before {\n  background: #fff;\n  bottom: 0;\n  content: '';\n  height: 2px;\n  left: 0;\n  opacity: 0;\n  position: absolute;\n  transition: opacity .2s;\n  width: 100%;\n}\n\n.header-menu ul a:hover:before,\n.header-menu ul a.active:before {\n  opacity: 1;\n}\n\n/* header social\r\n========================================================================== */\n\n.header-follow a {\n  padding: 0 10px;\n}\n\n.header-follow a:hover {\n  color: rgba(255, 255, 255, 0.8);\n}\n\n.header-follow a:before {\n  font-size: 1.25rem !important;\n}\n\n/* Header search\r\n========================================================================== */\n\n.header-search {\n  background: #eee;\n  border-radius: 2px;\n  display: none;\n  height: 36px;\n  position: relative;\n  text-align: left;\n  transition: background .2s,flex .2s;\n  vertical-align: top;\n  margin-left: 1.5rem;\n  margin-right: 1.5rem;\n}\n\n.header-search .search-icon {\n  color: #757575;\n  font-size: 24px;\n  left: 24px;\n  position: absolute;\n  top: 12px;\n  transition: color .2s;\n}\n\ninput.search-field {\n  background: 0;\n  border: 0;\n  color: #212121;\n  height: 36px;\n  padding: 0 8px 0 72px;\n  transition: color .2s;\n  width: 100%;\n}\n\ninput.search-field:focus {\n  border: 0;\n  outline: none;\n}\n\n.search-popout {\n  background: #fff;\n  box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24), inset 0 4px 6px -4px rgba(0, 0, 0, 0.24);\n  margin-top: 10px;\n  max-height: calc(100vh - 150px);\n  margin-left: -64px;\n  overflow-y: auto;\n  position: absolute;\n  z-index: -1;\n}\n\n.search-popout.closed {\n  visibility: hidden;\n}\n\n.search-suggest-results {\n  padding: 0 8px 0 75px;\n}\n\n.search-suggest-results a {\n  color: #212121;\n  display: block;\n  margin-left: -8px;\n  outline: 0;\n  height: auto;\n  padding: 8px;\n  transition: background .2s;\n  font-size: 0.875rem;\n}\n\n.search-suggest-results a:first-child {\n  margin-top: 10px;\n}\n\n.search-suggest-results a:last-child {\n  margin-bottom: 10px;\n}\n\n.search-suggest-results a:hover {\n  background: #f7f7f7;\n}\n\n/* mediaquery medium\r\n========================================================================== */\n\n@media only screen and (min-width: 992px) {\n  .header-search {\n    background: rgba(255, 255, 255, 0.25);\n    box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.12);\n    color: #fff;\n    display: inline-block;\n    width: 200px;\n  }\n\n  .header-search:hover {\n    background: rgba(255, 255, 255, 0.4);\n  }\n\n  .header-search .search-icon {\n    top: 0px;\n  }\n\n  .header-search input,\n  .header-search input::placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .search-popout {\n    width: 100%;\n    margin-left: 0;\n  }\n\n  .header.is-showSearch .header-search {\n    background: #fff;\n    flex: 1 0 auto;\n  }\n\n  .header.is-showSearch .header-search .search-icon {\n    color: #757575 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input::placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-menu {\n    flex: 0 0 auto;\n    margin: 0;\n    visibility: hidden;\n    width: 0;\n  }\n}\n\n/* Media Query\r\n========================================================================== */\n\n@media only screen and (max-width: 992px) {\n  .header-menu ul {\n    display: none;\n  }\n\n  .header.is-showSearchMob {\n    padding: 0;\n  }\n\n  .header.is-showSearchMob .header-logo,\n  .header.is-showSearchMob .nav-mob-toggle {\n    display: none;\n  }\n\n  .header.is-showSearchMob .header-search {\n    border-radius: 0;\n    display: inline-block !important;\n    height: 50px;\n    margin: 0;\n    width: 100%;\n  }\n\n  .header.is-showSearchMob .header-search input {\n    height: 50px;\n    padding-right: 48px;\n  }\n\n  .header.is-showSearchMob .header-search .search-popout {\n    margin-top: 0;\n  }\n\n  .header.is-showSearchMob .search-mob-toggle {\n    border: 0;\n    color: #757575;\n    position: absolute;\n    right: 0;\n  }\n\n  .header.is-showSearchMob .search-mob-toggle:before {\n    content: \"\" !important;\n  }\n\n  body.is-showNavMob {\n    overflow: hidden;\n  }\n\n  body.is-showNavMob .nav-mob {\n    transform: translateX(0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle {\n    border: 0;\n    transform: rotate(90deg);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:first-child {\n    transform: rotate(45deg) translate(0, 0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:nth-child(2) {\n    transform: scaleX(0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:last-child {\n    transform: rotate(-45deg) translate(0, 0);\n  }\n\n  body.is-showNavMob .search-mob-toggle {\n    display: none;\n  }\n\n  body.is-showNavMob .main,\n  body.is-showNavMob .footer {\n    transform: translateX(-25%);\n  }\n}\n\n.cover {\n  background: #4285f4;\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n  color: #fff;\n  letter-spacing: .2px;\n  min-height: 550px;\n  position: relative;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n  z-index: 2;\n}\n\n.cover-wrap {\n  margin: 0 auto;\n  max-width: 1050px;\n  padding: 16px;\n  position: relative;\n  text-align: center;\n  z-index: 99;\n}\n\n.cover-title {\n  font-size: 3.5rem;\n  margin: 0 0 50px;\n  line-height: 1;\n  font-weight: 700;\n}\n\n.cover-description {\n  max-width: 600px;\n}\n\n.cover-background {\n  background-attachment: fixed;\n}\n\n.cover .mouse {\n  width: 25px;\n  position: absolute;\n  height: 36px;\n  border-radius: 15px;\n  border: 2px solid #888;\n  border: 2px solid rgba(255, 255, 255, 0.27);\n  bottom: 40px;\n  right: 40px;\n  margin-left: -12px;\n  cursor: pointer;\n  transition: border-color 0.2s ease-in;\n}\n\n.cover .mouse .scroll {\n  display: block;\n  margin: 6px auto;\n  width: 3px;\n  height: 6px;\n  border-radius: 4px;\n  background: rgba(255, 255, 255, 0.68);\n  animation-duration: 2s;\n  animation-name: scroll;\n  animation-iteration-count: infinite;\n}\n\n.author a {\n  color: #FFF !important;\n}\n\n.author-header {\n  margin-top: 10%;\n}\n\n.author-name-wrap {\n  display: inline-block;\n}\n\n.author-title {\n  display: block;\n  text-transform: uppercase;\n}\n\n.author-name {\n  margin: 5px 0;\n  font-size: 1.75rem;\n}\n\n.author-bio {\n  margin: 1.5rem 0;\n  line-height: 1.8;\n  font-size: 18px;\n  max-width: 700px;\n}\n\n.author-avatar {\n  display: inline-block;\n  border-radius: 90px;\n  margin-right: 10px;\n  width: 80px;\n  height: 80px;\n  background-size: cover;\n  background-position: center;\n  vertical-align: bottom;\n}\n\n.author-meta {\n  margin-bottom: 20px;\n}\n\n.author-meta span {\n  display: inline-block;\n  font-size: 17px;\n  font-style: italic;\n  margin: 0 2rem 1rem 0;\n  opacity: 0.8;\n  word-wrap: break-word;\n}\n\n.author .author-link:hover {\n  opacity: 1;\n}\n\n.author-follow a {\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  cursor: pointer;\n  display: inline-block;\n  height: 40px;\n  letter-spacing: 1px;\n  line-height: 40px;\n  margin: 0 10px;\n  padding: 0 16px;\n  text-shadow: none;\n  text-transform: uppercase;\n}\n\n.author-follow a:hover {\n  box-shadow: inset 0 0 0 2px #fff;\n}\n\n.home-down {\n  animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100;\n}\n\n@media only screen and (min-width: 766px) {\n  .cover-description {\n    font-size: 1.25rem;\n  }\n}\n\n@media only screen and (max-width: 766px) {\n  .cover {\n    padding-top: 50px;\n    padding-bottom: 20px;\n  }\n\n  .cover-title {\n    font-size: 2rem;\n  }\n\n  .author-avatar {\n    display: block;\n    margin: 0 auto 10px auto;\n  }\n}\n\n.feed-entry-content .feed-entry-wrapper:last-child .entry:last-child {\n  padding: 0;\n  border: none;\n}\n\n.entry {\n  margin-bottom: 1.5rem;\n  padding: 0 15px 15px;\n}\n\n.entry-image--link {\n  height: 180px;\n  margin: 0 -15px;\n  overflow: hidden;\n}\n\n.entry-image--link:hover .entry-image--bg {\n  transform: scale(1.03);\n  backface-visibility: hidden;\n}\n\n.entry-image--bg {\n  transition: transform 0.3s;\n}\n\n.entry-video-play {\n  border-radius: 50%;\n  border: 2px solid #fff;\n  color: #fff;\n  font-size: 3.5rem;\n  height: 65px;\n  left: 50%;\n  line-height: 65px;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  width: 65px;\n  z-index: 10;\n}\n\n.entry-category {\n  margin-bottom: 5px;\n  text-transform: capitalize;\n  font-size: 0.875rem;\n  line-height: 1;\n}\n\n.entry-category a:active {\n  text-decoration: underline;\n}\n\n.entry-title {\n  color: #000;\n  font-size: 1.25rem;\n  height: auto;\n  line-height: 1.2;\n  margin: 0 0 .5rem;\n  padding: 0;\n}\n\n.entry-title:hover {\n  color: #777;\n}\n\n.entry-byline {\n  margin-top: 0;\n  margin-bottom: 0.5rem;\n  color: #999;\n  font-size: 0.8125rem;\n}\n\n.entry-byline a {\n  color: inherit;\n}\n\n.entry-byline a:hover {\n  color: #333;\n}\n\n.entry-body {\n  padding-top: 20px;\n}\n\n/* Entry small --small\r\n========================================================================== */\n\n.entry.entry--small {\n  margin-bottom: 24px;\n  padding: 0;\n}\n\n.entry.entry--small .entry-image {\n  margin-bottom: 10px;\n}\n\n.entry.entry--small .entry-image--link {\n  height: 170px;\n  margin: 0;\n}\n\n.entry.entry--small .entry-title {\n  font-size: 1rem;\n  font-weight: 500;\n  line-height: 1.2;\n  text-transform: capitalize;\n}\n\n.entry.entry--small .entry-byline {\n  margin: 0;\n}\n\n@media only screen and (min-width: 992px) {\n  .entry {\n    margin-bottom: 40px;\n    padding: 0;\n  }\n\n  .entry-title {\n    font-size: 21px;\n  }\n\n  .entry-body {\n    padding-right: 35px !important;\n  }\n\n  .entry-image {\n    margin-bottom: 0;\n  }\n\n  .entry-image--link {\n    height: 180px;\n    margin: 0;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  .entry-image--link {\n    height: 218px;\n  }\n}\n\n.footer {\n  color: rgba(0, 0, 0, 0.44);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1;\n  padding: 1.6rem 15px;\n  text-align: center;\n}\n\n.footer a {\n  color: rgba(0, 0, 0, 0.6);\n}\n\n.footer a:hover {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n.footer-wrap {\n  margin: 0 auto;\n  max-width: 1400px;\n}\n\n.footer .heart {\n  animation: heartify .5s infinite alternate;\n  color: red;\n}\n\n.footer-copy,\n.footer-design-author {\n  display: inline-block;\n  padding: .5rem 0;\n  vertical-align: middle;\n}\n\n.footer-follow {\n  padding: 20px 0;\n}\n\n.footer-follow a {\n  font-size: 20px;\n  margin: 0 5px;\n  color: rgba(0, 0, 0, 0.8);\n}\n\n@keyframes heartify {\n  0% {\n    transform: scale(0.8);\n  }\n}\n\n.btn,\n.nav-mob-follow a {\n  background-color: #fff;\n  border-radius: 2px;\n  border: 0;\n  box-shadow: none;\n  color: #039be5;\n  cursor: pointer;\n  display: inline-block;\n  font: 500 14px/20px \"Roboto\", sans-serif;\n  height: 36px;\n  margin: 0;\n  min-width: 36px;\n  outline: 0;\n  overflow: hidden;\n  padding: 8px;\n  text-align: center;\n  text-decoration: none;\n  text-overflow: ellipsis;\n  text-transform: uppercase;\n  transition: background-color .2s,box-shadow .2s;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n.btn + .btn,\n.nav-mob-follow a + .btn,\n.nav-mob-follow .btn + a,\n.nav-mob-follow a + a {\n  margin-left: 8px;\n}\n\n.btn:focus,\n.nav-mob-follow a:focus,\n.btn:hover,\n.nav-mob-follow a:hover {\n  background-color: #e1f3fc;\n  text-decoration: none !important;\n}\n\n.btn:active,\n.nav-mob-follow a:active {\n  background-color: #c3e7f9;\n}\n\n.btn.btn-lg,\n.nav-mob-follow a.btn-lg {\n  font-size: 1.5rem;\n  min-width: 48px;\n  height: 48px;\n  line-height: 48px;\n}\n\n.btn.btn-flat,\n.nav-mob-follow a.btn-flat {\n  background: 0;\n  box-shadow: none;\n}\n\n.btn.btn-flat:focus,\n.nav-mob-follow a.btn-flat:focus,\n.btn.btn-flat:hover,\n.nav-mob-follow a.btn-flat:hover,\n.btn.btn-flat:active,\n.nav-mob-follow a.btn-flat:active {\n  background: 0;\n  box-shadow: none;\n}\n\n.btn.btn-primary,\n.nav-mob-follow a.btn-primary {\n  background-color: #4285f4;\n  color: #fff;\n}\n\n.btn.btn-primary:hover,\n.nav-mob-follow a.btn-primary:hover {\n  background-color: #2f79f3;\n}\n\n.btn.btn-circle,\n.nav-mob-follow a.btn-circle {\n  border-radius: 50%;\n  height: 40px;\n  line-height: 40px;\n  padding: 0;\n  width: 40px;\n}\n\n.btn.btn-circle-small,\n.nav-mob-follow a.btn-circle-small {\n  border-radius: 50%;\n  height: 32px;\n  line-height: 32px;\n  padding: 0;\n  width: 32px;\n  min-width: 32px;\n}\n\n.btn.btn-shadow,\n.nav-mob-follow a.btn-shadow {\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);\n  color: #333;\n  background-color: #eee;\n}\n\n.btn.btn-shadow:hover,\n.nav-mob-follow a.btn-shadow:hover {\n  background-color: rgba(0, 0, 0, 0.12);\n}\n\n.btn.btn-download-cloud,\n.nav-mob-follow a.btn-download-cloud,\n.btn.btn-download,\n.nav-mob-follow a.btn-download {\n  background-color: #4285f4;\n  color: #fff;\n}\n\n.btn.btn-download-cloud:hover,\n.nav-mob-follow a.btn-download-cloud:hover,\n.btn.btn-download:hover,\n.nav-mob-follow a.btn-download:hover {\n  background-color: #1b6cf2;\n}\n\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after,\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  margin-left: 5px;\n  font-size: 1.1rem;\n  display: inline-block;\n  vertical-align: top;\n}\n\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  content: \"\";\n}\n\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after {\n  content: \"\";\n}\n\n.btn.external:after,\n.nav-mob-follow a.external:after {\n  font-size: 1rem;\n}\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n}\n\n.form-control {\n  width: 100%;\n  padding: 8px 12px;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 0px;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\n  height: 36px;\n}\n\n.form-control:focus {\n  border-color: #4285f4;\n  outline: 0;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(66, 133, 244, 0.6);\n}\n\n.btn-subscribe-home {\n  background-color: transparent;\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #ffffff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  max-width: 300px;\n  padding: 15px 10px;\n  transition: all 0.3s;\n  width: 100%;\n}\n\n.btn-subscribe-home:hover {\n  box-shadow: inset 0 0 0 2px #fff;\n}\n\n/*  Post\r\n========================================================================== */\n\n.post-wrapper {\n  margin-top: 50px;\n  padding-top: 1.8rem;\n}\n\n.post-header {\n  margin-bottom: 1.2rem;\n}\n\n.post-title {\n  color: #000;\n  font-size: 2.5rem;\n  height: auto;\n  line-height: 1.04;\n  margin: 0 0 0.9375rem;\n  letter-spacing: -.028em !important;\n  padding: 0;\n}\n\n.post-excerpt {\n  line-height: 1.3em;\n  font-size: 20px;\n  color: #7D7D7D;\n  margin-bottom: 8px;\n}\n\n.post-image {\n  margin-bottom: 30px;\n  overflow: hidden;\n}\n\n.post-body {\n  margin-bottom: 2rem;\n}\n\n.post-body a:focus {\n  text-decoration: underline;\n}\n\n.post-body h2 {\n  font-weight: 500;\n  margin: 2.50rem 0 1.25rem;\n  padding-bottom: 3px;\n}\n\n.post-body h3,\n.post-body h4 {\n  margin: 32px 0 16px;\n}\n\n.post-body iframe {\n  display: block !important;\n  margin: 0 auto 1.5rem 0 !important;\n}\n\n.post-body img {\n  display: block;\n  margin-bottom: 1rem;\n}\n\n.post-body h2 a,\n.post-body h3 a,\n.post-body h4 a {\n  color: #4285f4;\n}\n\n.post-tags {\n  margin: 1.25rem 0;\n}\n\n.post-card {\n  padding: 15px;\n}\n\n/* Post author by line top (author - time - tag - sahre)\r\n========================================================================== */\n\n.post-byline {\n  color: #999;\n  font-size: 14px;\n  flex-grow: 1;\n  letter-spacing: -.028em !important;\n}\n\n.post-byline a {\n  color: inherit;\n}\n\n.post-byline a:active {\n  text-decoration: underline;\n}\n\n.post-byline a:hover {\n  color: #222;\n}\n\n.post-actions--top .share {\n  margin-right: 10px;\n  font-size: 20px;\n}\n\n.post-actions--top .share:hover {\n  opacity: .7;\n}\n\n.post-action-comments {\n  color: #999;\n  margin-right: 15px;\n  font-size: 14px;\n}\n\n/* Post Action social media\r\n========================================================================== */\n\n.post-actions {\n  position: relative;\n  margin-bottom: 1.5rem;\n}\n\n.post-actions a {\n  color: #fff;\n  font-size: 1.125rem;\n}\n\n.post-actions a:hover {\n  background-color: #000 !important;\n}\n\n.post-actions li {\n  margin-left: 6px;\n}\n\n.post-actions li:first-child {\n  margin-left: 0 !important;\n}\n\n.post-actions .btn,\n.post-actions .nav-mob-follow a,\n.nav-mob-follow .post-actions a {\n  border-radius: 0;\n}\n\n/* Post author widget bottom\r\n========================================================================== */\n\n.post-author {\n  position: relative;\n  font-size: 15px;\n  padding: 30px 0 30px 100px;\n  margin-bottom: 3rem;\n  background-color: #f3f5f6;\n}\n\n.post-author h5 {\n  color: #AAA;\n  font-size: 12px;\n  line-height: 1.5;\n  margin: 0;\n  font-weight: 500;\n}\n\n.post-author li {\n  margin-left: 30px;\n  font-size: 14px;\n}\n\n.post-author li a {\n  color: #555;\n}\n\n.post-author li a:hover {\n  color: #000;\n}\n\n.post-author li:first-child {\n  margin-left: 0;\n}\n\n.post-author-bio {\n  max-width: 500px;\n}\n\n.post-author .post-author-avatar {\n  height: 64px;\n  width: 64px;\n  position: absolute;\n  left: 20px;\n  top: 30px;\n  background-position: center center;\n  background-size: cover;\n  border-radius: 50%;\n}\n\n/* bottom share and bottom subscribe\r\n========================================================================== */\n\n.share-subscribe {\n  margin-bottom: 1rem;\n}\n\n.share-subscribe p {\n  color: #7d7d7d;\n  margin-bottom: 1rem;\n  line-height: 1;\n  font-size: 0.875rem;\n}\n\n.share-subscribe .social-share {\n  float: none !important;\n}\n\n.share-subscribe > div {\n  position: relative;\n  overflow: hidden;\n  margin-bottom: 15px;\n}\n\n.share-subscribe > div:before {\n  content: \" \";\n  border-top: solid 1px #000;\n  position: absolute;\n  top: 0;\n  left: 15px;\n  width: 40px;\n  height: 1px;\n}\n\n.share-subscribe > div h5 {\n  font-size: 0.875rem;\n  margin: 1rem 0;\n  line-height: 1;\n  text-transform: uppercase;\n  font-weight: 500;\n}\n\n.share-subscribe .newsletter-form {\n  display: flex;\n}\n\n.share-subscribe .newsletter-form .form-group {\n  max-width: 250px;\n  width: 100%;\n}\n\n.share-subscribe .newsletter-form .btn,\n.share-subscribe .newsletter-form .nav-mob-follow a,\n.nav-mob-follow .share-subscribe .newsletter-form a {\n  border-radius: 0;\n}\n\n/* Related post\r\n========================================================================== */\n\n.post-related {\n  margin-top: 40px;\n}\n\n.post-related-title {\n  color: #000;\n  font-size: 18px;\n  font-weight: 500;\n  height: auto;\n  line-height: 17px;\n  margin: 0 0 20px;\n  padding-bottom: 10px;\n  text-transform: uppercase;\n}\n\n.post-related-list {\n  margin-bottom: 18px;\n  padding: 0;\n  border: none;\n}\n\n/* Media Query (medium)\r\n========================================================================== */\n\n@media only screen and (min-width: 766px) {\n  .post .title {\n    font-size: 2.25rem;\n    margin: 0 0 1rem;\n  }\n\n  .post-body {\n    font-size: 1.125rem;\n    line-height: 32px;\n  }\n\n  .post-body p {\n    margin-bottom: 1.5rem;\n  }\n\n  .post-card {\n    padding: 30px;\n  }\n}\n\n@media only screen and (max-width: 640px) {\n  .post-title {\n    font-size: 1.8rem;\n  }\n\n  .post-image,\n  .video-responsive {\n    margin-left: -0.9375rem;\n    margin-right: -0.9375rem;\n  }\n}\n\n/* sidebar\r\n========================================================================== */\n\n.sidebar {\n  position: relative;\n  line-height: 1.6;\n}\n\n.sidebar h1,\n.sidebar h2,\n.sidebar h3,\n.sidebar h4,\n.sidebar h5,\n.sidebar h6 {\n  margin-top: 0;\n  color: #000;\n}\n\n.sidebar-items {\n  margin-bottom: 2.5rem;\n  padding: 25px;\n  position: relative;\n}\n\n.sidebar-title {\n  padding-bottom: 10px;\n  margin-bottom: 1rem;\n  text-transform: uppercase;\n  font-size: 1rem;\n}\n\n.sidebar .title-primary {\n  background-color: #4285f4;\n  color: #FFF;\n  padding: 10px 16px;\n  font-size: 18px;\n}\n\n.sidebar-post--border {\n  align-items: center;\n  border-left: 3px solid #4285f4;\n  bottom: 0;\n  color: rgba(0, 0, 0, 0.2);\n  display: flex;\n  font-size: 28px;\n  font-weight: bold;\n  left: 0;\n  line-height: 1;\n  padding: 15px 10px 10px;\n  position: absolute;\n  top: 0;\n}\n\n.sidebar-post:nth-child(3n) .sidebar-post--border {\n  border-color: #f59e00;\n}\n\n.sidebar-post:nth-child(3n+2) .sidebar-post--border {\n  border-color: #00a034;\n}\n\n.sidebar-post--link {\n  display: block;\n  min-height: 50px;\n  padding: 10px 15px 10px 55px;\n  position: relative;\n}\n\n.sidebar-post--link:hover .sidebar-post--border {\n  background-color: #e5eff5;\n}\n\n.sidebar-post--title {\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 16px;\n  font-weight: 500;\n  margin: 0;\n}\n\n.subscribe {\n  min-height: 90vh;\n  padding-top: 50px;\n}\n\n.subscribe h3 {\n  margin: 0;\n  margin-bottom: 8px;\n  font: 400 20px/32px \"Roboto\", sans-serif;\n}\n\n.subscribe-title {\n  font-weight: 400;\n  margin-top: 0;\n}\n\n.subscribe-wrap {\n  max-width: 700px;\n  color: #7d878a;\n  padding: 1rem 0;\n}\n\n.subscribe .form-group {\n  margin-bottom: 1.5rem;\n}\n\n.subscribe .form-group.error input {\n  border-color: #ff5b5b;\n}\n\n.subscribe .btn,\n.subscribe .nav-mob-follow a,\n.nav-mob-follow .subscribe a {\n  width: 100%;\n}\n\n.subscribe-form {\n  position: relative;\n  margin: 30px auto;\n  padding: 40px;\n  max-width: 400px;\n  width: 100%;\n  background: #ebeff2;\n  border-radius: 5px;\n  text-align: left;\n}\n\n.subscribe-input {\n  width: 100%;\n  padding: 10px;\n  border: #4285f4  1px solid;\n  border-radius: 2px;\n}\n\n.subscribe-input:focus {\n  outline: none;\n}\n\n.animated {\n  animation-duration: 1s;\n  animation-fill-mode: both;\n}\n\n.animated.infinite {\n  animation-iteration-count: infinite;\n}\n\n.bounceIn {\n  animation-name: bounceIn;\n}\n\n.bounceInDown {\n  animation-name: bounceInDown;\n}\n\n.slideInUp {\n  animation-name: slideInUp;\n}\n\n.slideOutDown {\n  animation-name: slideOutDown;\n}\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    transform: none;\n  }\n}\n\n@keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    transform: translateY(0px);\n  }\n\n  100% {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n}\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0);\n  }\n}\n\n","@font-face {\r\n  font-family: 'mapache';\r\n  src:\r\n    url('../fonts/mapache.ttf?g7hms8') format('truetype'),\r\n    url('../fonts/mapache.woff?g7hms8') format('woff'),\r\n    url('../fonts/mapache.svg?g7hms8#mapache') format('svg');\r\n  font-weight: normal;\r\n  font-style: normal;\r\n}\r\n\r\n[class^=\"i-\"]:before, [class*=\" i-\"]:before {\r\n  /* use !important to prevent issues with browser extensions that change fonts */\r\n  font-family: 'mapache' !important;\r\n  speak: none;\r\n  font-style: normal;\r\n  font-weight: normal;\r\n  font-variant: normal;\r\n  text-transform: none;\r\n  line-height: inherit;\r\n\r\n  /* Better Font Rendering =========== */\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n\r\n.i-navigate_before:before {\r\n  content: \"\\e408\";\r\n}\r\n.i-navigate_next:before {\r\n  content: \"\\e409\";\r\n}\r\n.i-tag:before {\r\n  content: \"\\e54e\";\r\n}\r\n.i-keyboard_arrow_down:before {\r\n  content: \"\\e313\";\r\n}\r\n.i-arrow_upward:before {\r\n  content: \"\\e5d8\";\r\n}\r\n.i-cloud_download:before {\r\n  content: \"\\e2c0\";\r\n}\r\n.i-star:before {\r\n  content: \"\\e838\";\r\n}\r\n.i-keyboard_arrow_up:before {\r\n  content: \"\\e316\";\r\n}\r\n.i-open_in_new:before {\r\n  content: \"\\e89e\";\r\n}\r\n.i-warning:before {\r\n  content: \"\\e002\";\r\n}\r\n.i-back:before {\r\n  content: \"\\e5c4\";\r\n}\r\n.i-forward:before {\r\n  content: \"\\e5c8\";\r\n}\r\n.i-chat:before {\r\n  content: \"\\e0cb\";\r\n}\r\n.i-close:before {\r\n  content: \"\\e5cd\";\r\n}\r\n.i-code2:before {\r\n  content: \"\\e86f\";\r\n}\r\n.i-favorite:before {\r\n  content: \"\\e87d\";\r\n}\r\n.i-link:before {\r\n  content: \"\\e157\";\r\n}\r\n.i-menu:before {\r\n  content: \"\\e5d2\";\r\n}\r\n.i-feed:before {\r\n  content: \"\\e0e5\";\r\n}\r\n.i-search:before {\r\n  content: \"\\e8b6\";\r\n}\r\n.i-share:before {\r\n  content: \"\\e80d\";\r\n}\r\n.i-check_circle:before {\r\n  content: \"\\e86c\";\r\n}\r\n.i-play:before {\r\n  content: \"\\e901\";\r\n}\r\n.i-download:before {\r\n  content: \"\\e900\";\r\n}\r\n.i-code:before {\r\n  content: \"\\f121\";\r\n}\r\n.i-behance:before {\r\n  content: \"\\f1b4\";\r\n}\r\n.i-spotify:before {\r\n  content: \"\\f1bc\";\r\n}\r\n.i-codepen:before {\r\n  content: \"\\f1cb\";\r\n}\r\n.i-github:before {\r\n  content: \"\\f09b\";\r\n}\r\n.i-linkedin:before {\r\n  content: \"\\f0e1\";\r\n}\r\n.i-flickr:before {\r\n  content: \"\\f16e\";\r\n}\r\n.i-dribbble:before {\r\n  content: \"\\f17d\";\r\n}\r\n.i-pinterest:before {\r\n  content: \"\\f231\";\r\n}\r\n.i-map:before {\r\n  content: \"\\f041\";\r\n}\r\n.i-twitter:before {\r\n  content: \"\\f099\";\r\n}\r\n.i-facebook:before {\r\n  content: \"\\f09a\";\r\n}\r\n.i-youtube:before {\r\n  content: \"\\f16a\";\r\n}\r\n.i-instagram:before {\r\n  content: \"\\f16d\";\r\n}\r\n.i-google:before {\r\n  content: \"\\f1a0\";\r\n}\r\n.i-pocket:before {\r\n  content: \"\\f265\";\r\n}\r\n.i-reddit:before {\r\n  content: \"\\f281\";\r\n}\r\n.i-snapchat:before {\r\n  content: \"\\f2ac\";\r\n}\r\n.i-telegram:before {\r\n  content: \"\\f2c6\";\r\n}\r\n","/*\r\n@package godofredoninja\r\n\r\n========================================================================\r\nMapache variables styles\r\n========================================================================\r\n*/\r\n\r\n/**\r\n* Table of Contents:\r\n*\r\n*   1. Colors\r\n*   2. Fonts\r\n*   3. Typography\r\n*   4. Header\r\n*   5. Footer\r\n*   6. Code Syntax\r\n*   7. buttons\r\n*   8. container\r\n*   9. Grid\r\n*   10. Media Query Ranges\r\n*   11. Icons\r\n*/\r\n\r\n\r\n/* 1. Colors\r\n========================================================================== */\r\n$primary-color        : #4285f4;\r\n// $primary-color        : #2856b6;\r\n\r\n$primary-text-color:  #333;\r\n$secondary-text-color:  #999;\r\n$accent-color:      #eee;\r\n\r\n$divider-color:     #DDDDDD;\r\n\r\n// $link-color     : #4184F3;\r\n$link-color     : #039be5;\r\n// $color-bg-page  : #EEEEEE;\r\n\r\n\r\n// social colors\r\n$social-colors: (\r\n  facebook    : #3b5998,\r\n  twitter     : #55acee,\r\n  google    : #dd4b39,\r\n  instagram   : #306088,\r\n  youtube     : #e52d27,\r\n  github      : #333333,\r\n  linkedin    : #007bb6,\r\n  spotify     : #2ebd59,\r\n  codepen     : #222222,\r\n  behance     : #131418,\r\n  dribbble    : #ea4c89,\r\n  flickr       : #0063DC,\r\n  reddit    : orangered,\r\n  pocket    : #F50057,\r\n  pinterest   : #bd081c,\r\n  feed    : orange,\r\n  telegram : #08c,\r\n);\r\n\r\n\r\n\r\n/* 2. Fonts\r\n========================================================================== */\r\n$primary-font:    'Roboto', sans-serif; // font default page\r\n$code-font:     'Roboto Mono', monospace; // font for code and pre\r\n\r\n\r\n/* 3. Typography\r\n========================================================================== */\r\n\r\n$spacer:                   1rem;\r\n$line-height:              1.5;\r\n\r\n$font-size-root:           16px;\r\n\r\n$font-size-base:           1rem;\r\n$font-size-lg:             1.25rem; // 20px\r\n$font-size-sm:             .875rem; //14px\r\n$font-size-xs:             .0.8125; //13px\r\n\r\n$font-size-h1:             2.25rem;\r\n$font-size-h2:             1.875rem;\r\n$font-size-h3:             1.5625rem;\r\n$font-size-h4:             1.375rem;\r\n$font-size-h5:             1.125rem;\r\n$font-size-h6:             1rem;\r\n\r\n\r\n$headings-margin-bottom:   ($spacer / 2);\r\n$headings-font-family:     $primary-font;\r\n$headings-font-weight:     700;\r\n$headings-line-height:     1.1;\r\n$headings-color:           inherit;\r\n\r\n$font-weight:       500;\r\n\r\n$blockquote-font-size:     1.125rem;\r\n\r\n\r\n/* 4. Header\r\n========================================================================== */\r\n$header-bg: $primary-color;\r\n$header-color: #fff;\r\n$header-height: 50px;\r\n$header-search-bg: #eee;\r\n$header-search-color: #757575;\r\n\r\n\r\n/* 5. Entry articles\r\n========================================================================== */\r\n$entry-color-title: #000;\r\n$entry-color-title-hover: #777;\r\n$entry-font-size: 1.75rem; // 28px\r\n$entry-font-size-mb: 1.25rem; // 20px\r\n$entry-font-size-byline: 0.8125rem; // 13px\r\n$entry-color-byline: #999;\r\n\r\n/* 5. Footer\r\n========================================================================== */\r\n// $footer-bg-color:   #000;\r\n$footer-color-link: rgba(0, 0, 0, .6);\r\n$footer-color:      rgba(0, 0, 0, .44);\r\n\r\n\r\n/* 6. Code Syntax\r\n========================================================================== */\r\n$code-bg-color:       #f7f7f7;\r\n$font-size-code:      0.9375rem;\r\n$code-color:        #c7254e;\r\n$pre-code-color:        #37474f;\r\n\r\n\r\n/* 7. buttons\r\n========================================================================== */\r\n$btn-primary-color:       $primary-color;\r\n$btn-secondary-color:     #039be5;\r\n$btn-background-color:    #e1f3fc;\r\n$btn-active-background:   #c3e7f9;\r\n\r\n/* 8. container\r\n========================================================================== */\r\n\r\n$grid-gutter-width:        1.875rem; // 30px\r\n\r\n$container-sm:             576px;\r\n$container-md:             750px;\r\n$container-lg:             970px;\r\n$container-xl:             1250px;\r\n\r\n\r\n/* 9. Grid\r\n========================================================================== */\r\n$num-cols: 12;\r\n$gutter-width: 1.875rem;\r\n$element-top-margin: $gutter-width/3;\r\n$element-bottom-margin: ($gutter-width*2)/3;\r\n\r\n\r\n/* 10. Media Query Ranges\r\n========================================================================== */\r\n$sm:            640px;\r\n$md:            766px;\r\n$lg:            992px;\r\n$xl:            1230px;\r\n\r\n$sm-and-up:     \"only screen and (min-width : #{$sm})\";\r\n$md-and-up:     \"only screen and (min-width : #{$md})\";\r\n$lg-and-up:     \"only screen and (min-width : #{$lg})\";\r\n$xl-and-up:     \"only screen and (min-width : #{$xl})\";\r\n\r\n$sm-and-down:   \"only screen and (max-width : #{$sm})\";\r\n$md-and-down:   \"only screen and (max-width : #{$md})\";\r\n$lg-and-down:   \"only screen and (max-width : #{$lg})\";\r\n\r\n\r\n/* 11. icons\r\n========================================================================== */\r\n$i-open_in_new:      '\\e89e';\r\n$i-warning:          '\\e002';\r\n$i-star:             '\\e838';\r\n$i-download:         '\\e900';\r\n$i-cloud_download:   '\\e2c0';\r\n$i-check_circle:     '\\e86c';\r\n$i-play:       \"\\e901\";\r\n$i-code:       \"\\f121\";\r\n$i-close:      \"\\e5cd\";\r\n","/* Header Page\r\n========================================================================== */\r\n.header{\r\n  background: $primary-color;\r\n  // color: $header-color;\r\n  height: $header-height;\r\n  left: 0;\r\n  padding-left: 1rem;\r\n  padding-right: 1rem;\r\n  position: fixed;\r\n  right: 0;\r\n  top: 0;\r\n  z-index: 999;\r\n\r\n  &-wrap a{ color: $header-color;}\r\n\r\n  &-logo,\r\n  &-follow a,\r\n  &-menu a{\r\n    height: $header-height;\r\n    @extend .u-flex-center;\r\n  }\r\n\r\n  &-follow,\r\n  &-search,\r\n  &-logo{\r\n    flex: 0 0 auto;\r\n  }\r\n\r\n  // Logo\r\n  &-logo{\r\n    z-index: 998;\r\n    font-size: $font-size-lg;\r\n    font-weight: 500;\r\n    letter-spacing: 1px;\r\n    img{\r\n      max-height: 35px;\r\n      position: relative;\r\n    }\r\n  }\r\n\r\n  .nav-mob-toggle,\r\n  .search-mob-toggle{\r\n    padding: 0;\r\n    z-index: 998;\r\n  }\r\n\r\n  // btn mobile menu open and close\r\n  .nav-mob-toggle{\r\n    margin-left: 0 !important;\r\n    margin-right: - ($grid-gutter-width / 2);\r\n    position: relative;\r\n    transition: transform .4s;\r\n\r\n    span {\r\n       background-color: $header-color;\r\n       display: block;\r\n       height: 2px;\r\n       left: 14px;\r\n       margin-top: -1px;\r\n       position: absolute;\r\n       top: 50%;\r\n       transition: .4s;\r\n       width: 20px;\r\n       &:first-child { transform: translate(0,-6px); }\r\n       &:last-child { transform: translate(0,6px); }\r\n    }\r\n\r\n  }\r\n\r\n  // Shodow for header\r\n  &.toolbar-shadow{ @extend %primary-box-shadow; }\r\n  &:not(.toolbar-shadow) { background-color: transparent!important; }\r\n\r\n}\r\n\r\n\r\n/* Header Navigation\r\n========================================================================== */\r\n.header-menu{\r\n  flex: 1 1 0;\r\n  overflow: hidden;\r\n  transition: flex .2s,margin .2s,width .2s;\r\n\r\n  ul{\r\n    margin-left: 2rem;\r\n    white-space: nowrap;\r\n\r\n    li{ padding-right: 15px; display: inline-block;}\r\n\r\n    a{\r\n      padding: 0 8px;\r\n      position: relative;\r\n\r\n      &:before{\r\n        background: $header-color;\r\n        bottom: 0;\r\n        content: '';\r\n        height: 2px;\r\n        left: 0;\r\n        opacity: 0;\r\n        position: absolute;\r\n        transition: opacity .2s;\r\n        width: 100%;\r\n      }\r\n      &:hover:before,\r\n      &.active:before{\r\n        opacity: 1;\r\n      }\r\n    }\r\n\r\n  }\r\n}\r\n\r\n\r\n/* header social\r\n========================================================================== */\r\n.header-follow a {\r\n  padding: 0 10px;\r\n  &:hover{color: rgba(255, 255, 255, 0.80)}\r\n  &:before{font-size: $font-size-lg !important;}\r\n\r\n}\r\n\r\n\r\n\r\n/* Header search\r\n========================================================================== */\r\n.header-search{\r\n  background: #eee;\r\n  border-radius: 2px;\r\n  display: none;\r\n  // flex: 0 0 auto;\r\n  height: 36px;\r\n  position: relative;\r\n  text-align: left;\r\n  transition: background .2s,flex .2s;\r\n  vertical-align: top;\r\n  margin-left: 1.5rem;\r\n  margin-right: 1.5rem;\r\n\r\n  .search-icon{\r\n    color: #757575;\r\n    font-size: 24px;\r\n    left: 24px;\r\n    position: absolute;\r\n    top: 12px;\r\n    transition: color .2s;\r\n  }\r\n}\r\n\r\ninput.search-field {\r\n  background: 0;\r\n  border: 0;\r\n  color: #212121;\r\n  height: 36px;\r\n  padding: 0 8px 0 72px;\r\n  transition: color .2s;\r\n  width: 100%;\r\n  &:focus{\r\n    border: 0;\r\n    outline: none;\r\n  }\r\n}\r\n\r\n.search-popout{\r\n  background: $header-color;\r\n  box-shadow: 0 0 2px rgba(0,0,0,.12),0 2px 4px rgba(0,0,0,.24),inset 0 4px 6px -4px rgba(0,0,0,.24);\r\n  margin-top: 10px;\r\n  max-height: calc(100vh - 150px);\r\n  // width: calc(100% + 120px);\r\n  margin-left: -64px;\r\n  overflow-y: auto;\r\n  position: absolute;\r\n  // transition: transform .2s,visibility .2s;\r\n  // transform: translateY(0);\r\n\r\n  z-index: -1;\r\n\r\n  &.closed{\r\n    // transform: translateY(-110%);\r\n    visibility: hidden;\r\n  }\r\n}\r\n\r\n.search-suggest-results{\r\n  padding: 0 8px 0 75px;\r\n\r\n  a{\r\n    color: #212121;\r\n    display: block;\r\n    margin-left: -8px;\r\n    outline: 0;\r\n    height: auto;\r\n    padding: 8px;\r\n    transition: background .2s;\r\n    font-size: $font-size-sm;\r\n    &:first-child{\r\n      margin-top: 10px;\r\n    }\r\n    &:last-child{\r\n      margin-bottom: 10px;\r\n    }\r\n    &:hover{\r\n      background: #f7f7f7;\r\n    }\r\n  }\r\n}\r\n\r\n\r\n\r\n\r\n/* mediaquery medium\r\n========================================================================== */\r\n\r\n@media #{$lg-and-up}{\r\n  .header-search{\r\n    background: rgba(255,255,255,.25);\r\n    box-shadow: 0 1px 1.5px rgba(0,0,0,0.06),0 1px 1px rgba(0,0,0,0.12);\r\n    color: $header-color;\r\n    display: inline-block;\r\n    width: 200px;\r\n\r\n    &:hover{\r\n      background: rgba(255,255,255,.4);\r\n    }\r\n\r\n    .search-icon{top: 0px;}\r\n\r\n    input, input::placeholder, .search-icon{color: #fff;}\r\n\r\n  }\r\n\r\n  .search-popout{\r\n    width: 100%;\r\n    margin-left: 0;\r\n  }\r\n\r\n  // Show large search and visibility hidden header menu\r\n  .header.is-showSearch{\r\n    .header-search{\r\n      background: #fff;\r\n      flex: 1 0 auto;\r\n\r\n      .search-icon{color: #757575 !important;}\r\n      input, input::placeholder {color: #212121 !important}\r\n    }\r\n    .header-menu{\r\n      flex: 0 0 auto;\r\n      margin: 0;\r\n      visibility: hidden;\r\n      width: 0;\r\n    }\r\n  }\r\n}\r\n\r\n\r\n/* Media Query\r\n========================================================================== */\r\n\r\n@media #{$lg-and-down}{\r\n\r\n  .header-menu ul{ display: none; }\r\n\r\n  // show search mobile\r\n  .header.is-showSearchMob{\r\n    padding: 0;\r\n\r\n    .header-logo,\r\n    .nav-mob-toggle{\r\n      display: none;\r\n    }\r\n\r\n    .header-search{\r\n      border-radius: 0;\r\n      display: inline-block !important;\r\n      height: $header-height;\r\n      margin: 0;\r\n      width: 100%;\r\n\r\n      input{\r\n        height: $header-height;\r\n        padding-right: 48px;\r\n      }\r\n\r\n      .search-popout{margin-top: 0;}\r\n    }\r\n\r\n    .search-mob-toggle{\r\n      border: 0;\r\n      color: $header-search-color;\r\n      position: absolute;\r\n      right: 0;\r\n      &:before{content: $i-close !important;}\r\n    }\r\n\r\n  }\r\n\r\n  // show menu mobile\r\n  body.is-showNavMob{\r\n    overflow: hidden;\r\n\r\n    .nav-mob{\r\n      transform: translateX(0);\r\n    }\r\n    .nav-mob-toggle {\r\n      border: 0;\r\n      transform: rotate(90deg);\r\n      span:first-child { transform: rotate(45deg) translate(0,0);}\r\n      span:nth-child(2) { transform: scaleX(0);}\r\n      span:last-child {transform: rotate(-45deg) translate(0,0);}\r\n    }\r\n    .search-mob-toggle{\r\n      display: none;\r\n    }\r\n\r\n    .main,.footer{\r\n      transform: translateX(-25%);\r\n    }\r\n  }\r\n\r\n}\r\n","// box-shadow\r\n%primary-box-shadow {\r\n  box-shadow: 0 0 4px rgba(0, 0, 0, .14), 0 4px 8px rgba(0, 0, 0, .28);\r\n}\r\n\r\n%font-icons {\r\n  font-family: 'mapache' !important;\r\n  speak: none;\r\n  font-style: normal;\r\n  font-weight: normal;\r\n  font-variant: normal;\r\n  text-transform: none;\r\n  line-height: 1;\r\n\r\n  /* Better Font Rendering =========== */\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n\r\n//  Clear both\r\n.u-clear {\r\n  &::after {\r\n    clear: both;\r\n    content: \"\";\r\n    display: table;\r\n  }\r\n}\r\n\r\n.u-not-avatar { background-image: url('../images/avatar.png') }\r\n.u-relative { position: relative }\r\n.u-block { display: block }\r\n\r\n.u-absolute0 {\r\n  position: absolute;\r\n  left: 0;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n}\r\n\r\n.u-bg-cover {\r\n  background-position: center;\r\n  background-size: cover;\r\n}\r\n\r\n.u-bg-gradient {\r\n  background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, 0.8)));\r\n}\r\n\r\n// border-\r\n.u-border-bottom-dark { border-bottom: solid 1px #000; }\r\n.u-b-t { border-top: solid 1px #eee; }\r\n\r\n// Padding\r\n.u-p-t-2 { padding-top: 2rem }\r\n\r\n// Eliminar la lista de la <ul>\r\n.u-unstyled {\r\n  list-style-type: none;\r\n  margin: 0;\r\n  padding-left: 0;\r\n}\r\n\r\n.u-floatLeft { float: left !important; }\r\n.u-floatRight { float: right !important; }\r\n\r\n//  flex box\r\n.u-flex { display: flex; flex-direction: row; }\r\n.u-flex-wrap { display: flex; flex-wrap: wrap; }\r\n.u-flex-center { display: flex; align-items: center; }\r\n.u-flex-aling-right { display: flex; align-items: center; justify-content: flex-end; }\r\n.u-flex-aling-center { display: flex; align-items: center; justify-content: center; flex-direction: column; }\r\n\r\n// margin\r\n.u-m-t-1 { margin-top: 1rem }\r\n\r\n/* Tags\r\n========================================================================== */\r\n.u-tags {\r\n  font-size: 12px !important;\r\n  margin: 3px !important;\r\n  color: #4c5765 !important;\r\n  background-color: #ebebeb !important;\r\n  transition: all .3s;\r\n\r\n  &::before {\r\n    padding-right: 5px;\r\n    opacity: .8;\r\n  }\r\n\r\n  &:hover {\r\n    background-color: $primary-color !important;\r\n    color: #fff !important;\r\n  }\r\n}\r\n\r\n// Only 1 tags\r\n.u-tag {\r\n  background-color: $primary-color;\r\n  color: #fff;\r\n  padding: 4px 12px;\r\n  font-size: 11px;\r\n  display: inline-block;\r\n  text-transform: uppercase;\r\n}\r\n\r\n// hide global\r\n.u-hide { display: none !important }\r\n\r\n.u-card-shadow {\r\n  background-color: #fff;\r\n  box-shadow: 0 5px 5px rgba(0, 0, 0, .02);\r\n}\r\n\r\n.u-not-image {\r\n  background-repeat: repeat;\r\n  background-size: initial !important;\r\n  background-color: #fff;\r\n}\r\n\r\n// hide before\r\n@media #{$md-and-down} { .u-h-b-md { display: none !important } }\r\n\r\n@media #{$lg-and-down} { .u-h-b-lg { display: none !important } }\r\n\r\n// hide after\r\n@media #{$md-and-up} { .u-h-a-md { display: none !important } }\r\n\r\n@media #{$lg-and-up} { .u-h-a-lg { display: none !important } }\r\n","html {\r\n  box-sizing: border-box;\r\n  // Sets a specific default `font-size` for user with `rem` type scales.\r\n  font-size: $font-size-root;\r\n  // Changes the default tap highlight to be completely transparent in iOS.\r\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\r\n}\r\n\r\n*,\r\n*::before,\r\n*::after {\r\n  box-sizing: border-box;\r\n}\r\n\r\na {\r\n  color: $link-color;\r\n  outline: 0;\r\n  text-decoration: none;\r\n  // Gets rid of tap active state\r\n  -webkit-tap-highlight-color: transparent;\r\n\r\n  &:focus {\r\n    text-decoration: none;\r\n    // background-color: transparent;\r\n  }\r\n\r\n  &.external {\r\n    &::after {\r\n      @extend %font-icons;\r\n\r\n      content: $i-open_in_new;\r\n      margin-left: 5px;\r\n    }\r\n  }\r\n}\r\n\r\nbody {\r\n  // Make the `body` use the `font-size-root`\r\n  color: $primary-text-color;\r\n  font-family: $primary-font;\r\n  font-size: $font-size-base;\r\n  line-height: $line-height;\r\n  margin: 0 auto;\r\n  background-color: #f5f5f5;\r\n}\r\n\r\nfigure { margin: 0; }\r\n\r\nimg {\r\n  height: auto;\r\n  max-width: 100%;\r\n  vertical-align: middle;\r\n  width: auto;\r\n\r\n  &:not([src]) {\r\n    visibility: hidden;\r\n  }\r\n}\r\n\r\n.img-responsive {\r\n  display: block;\r\n  max-width: 100%;\r\n  height: auto;\r\n}\r\n\r\ni {\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n}\r\n\r\nhr {\r\n  background: #F1F2F1;\r\n  background: linear-gradient(to right,#F1F2F1 0,#b5b5b5 50%,#F1F2F1 100%);\r\n  border: none;\r\n  height: 1px;\r\n  margin: 80px auto;\r\n  max-width: 90%;\r\n  position: relative;\r\n\r\n  &::before {\r\n    background: #fff;\r\n    color: rgba(73,55,65,.75);\r\n    content: $i-code;\r\n    display: block;\r\n    font-size: 35px;\r\n    left: 50%;\r\n    padding: 0 25px;\r\n    position: absolute;\r\n    top: 50%;\r\n    transform: translate(-50%,-50%);\r\n    @extend %font-icons;\r\n  }\r\n}\r\n\r\nblockquote {\r\n  border-left: 4px solid $primary-color;\r\n  padding: .75rem 1.5rem;\r\n  background: #fbfbfc;\r\n  color: #757575;\r\n  font-size: $blockquote-font-size;\r\n  line-height: 1.7;\r\n  margin: 0 0 1.25rem;\r\n  quotes: none;\r\n}\r\n\r\nol,ul,blockquote {\r\n  margin-left: 2rem;\r\n}\r\n\r\nstrong {\r\n  font-weight: 500;\r\n}\r\n\r\nsmall, .small {\r\n  font-size: 85%;\r\n}\r\n\r\nol {\r\n  padding-left: 40px;\r\n  list-style: decimal outside;\r\n}\r\n\r\nmark {\r\n  // background-image: linear-gradient(to bottom, lighten($primary-color, 35%), lighten($primary-color, 30%));\r\n  background-color: #fdffb6;\r\n}\r\n\r\n.footer,\r\n.main {\r\n  transition: transform .5s ease;\r\n  z-index: 2;\r\n}\r\n\r\n// .mapache-facebook { display: none !important; }\r\n\r\n/* Code Syntax\r\n========================================================================== */\r\nkbd,samp,code {\r\n  font-family: $code-font !important;\r\n  font-size: $font-size-code;\r\n  color: $code-color;\r\n  background: $code-bg-color;\r\n  border-radius: 4px;\r\n  padding: 4px 6px;\r\n  white-space: pre-wrap;\r\n}\r\n\r\ncode[class*=language-],\r\npre[class*=language-] {\r\n  color: $pre-code-color;\r\n  line-height: 1.5;\r\n\r\n  .token.comment { opacity: .8; }\r\n\r\n  &.line-numbers {\r\n    padding-left: 58px;\r\n\r\n    &::before {\r\n      content: \"\";\r\n      position: absolute;\r\n      left: 0;\r\n      top: 0;\r\n      background: #F0EDEE;\r\n      width: 40px;\r\n      height: 100%;\r\n    }\r\n  }\r\n\r\n  .line-numbers-rows {\r\n    border-right: none;\r\n    top: -3px;\r\n    left: -58px;\r\n\r\n    & > span::before {\r\n      padding-right: 0;\r\n      text-align: center;\r\n      opacity: .8;\r\n    }\r\n  }\r\n}\r\n\r\npre {\r\n  background-color: $code-bg-color!important;\r\n  padding: 1rem;\r\n  overflow: hidden;\r\n  border-radius: 4px;\r\n  word-wrap: normal;\r\n  margin: 2.5rem 0!important;\r\n  font-family: $code-font !important;\r\n  font-size: $font-size-code;\r\n  position: relative;\r\n\r\n  code {\r\n    color: $pre-code-color;\r\n    text-shadow: 0 1px #fff;\r\n    padding: 0;\r\n    background: transparent;\r\n  }\r\n}\r\n\r\n/* .warning & .note & .success\r\n========================================================================== */\r\n.warning {\r\n  background: #fbe9e7;\r\n  color: #d50000;\r\n  &:before{content: $i-warning;}\r\n}\r\n\r\n.note{\r\n  background: #e1f5fe;\r\n  color: #0288d1;\r\n  &:before{content: $i-star;}\r\n}\r\n\r\n.success{\r\n  background: #e0f2f1;\r\n  color: #00897b;\r\n  &:before{content: $i-check_circle;color: #00bfa5;}\r\n}\r\n\r\n.warning, .note, .success{\r\n  display: block;\r\n  margin: 1rem 0;\r\n  font-size: 1rem;\r\n  padding: 12px 24px 12px 60px;\r\n  line-height: 1.5;\r\n  a{\r\n    text-decoration: underline;\r\n    color: inherit;\r\n  }\r\n  &:before{\r\n    margin-left: -36px;\r\n    float: left;\r\n    font-size: 24px;\r\n    @extend %font-icons;\r\n  }\r\n}\r\n\r\n\r\n/* Social icon color and background\r\n========================================================================== */\r\n@each $social-name, $color in $social-colors {\r\n  .c-#{$social-name}{\r\n    color: $color;\r\n  }\r\n  .bg-#{$social-name}{\r\n    background-color: $color !important;\r\n  }\r\n}\r\n\r\n//  Clear both\r\n.clear{\r\n  &:after {\r\n    content: \"\";\r\n    display: table;\r\n    clear: both;\r\n  }\r\n}\r\n\r\n/* pagination Infinite scroll\r\n========================================================================== */\r\n.mapache-load-more{\r\n  border: solid 1px #C3C3C3;\r\n  color: #7D7D7D;\r\n  display: block;\r\n  font-size: 15px;\r\n  height: 45px;\r\n  margin: 4rem auto;\r\n  padding: 11px 16px;\r\n  position: relative;\r\n  text-align: center;\r\n  width: 100%;\r\n\r\n  &:hover{\r\n    background: $primary-color;\r\n    border-color: $primary-color;\r\n    color: #fff;\r\n  }\r\n}\r\n\r\n// .pagination nav\r\n.pagination-nav{\r\n  padding: 2.5rem 0 3rem;\r\n  text-align: center;\r\n  .page-number{\r\n    display: none;\r\n    padding-top: 5px;\r\n    @media #{$md-and-up}{display: inline-block;}\r\n  }\r\n  .newer-posts{\r\n    float: left;\r\n  }\r\n  .older-posts{\r\n    float: right\r\n  }\r\n}\r\n\r\n/* Scroll Top\r\n========================================================================== */\r\n.scroll_top{\r\n  bottom: 50px;\r\n  position: fixed;\r\n  right: 20px;\r\n  text-align: center;\r\n  z-index: 11;\r\n  width: 60px;\r\n  opacity: 0;\r\n  visibility: hidden;\r\n  transition: opacity 0.5s ease;\r\n\r\n  &.visible{\r\n    opacity: 1;\r\n    visibility: visible;\r\n  }\r\n\r\n  &:hover svg path {\r\n    fill: rgba(0,0,0,.6);\r\n  }\r\n}\r\n\r\n// svg all icons\r\n.svg-icon svg {\r\n  width: 100%;\r\n  height: auto;\r\n  display: block;\r\n  fill: currentcolor;\r\n}\r\n\r\n/* Video Responsive\r\n========================================================================== */\r\n.video-responsive{\r\n  position: relative;\r\n  display: block;\r\n  height: 0;\r\n  padding: 0;\r\n  overflow: hidden;\r\n  padding-bottom: 56.25%;\r\n  margin-bottom: 1.5rem;\r\n  iframe{\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    bottom: 0;\r\n    height: 100%;\r\n    width: 100%;\r\n    border: 0;\r\n  }\r\n}\r\n\r\n/* Video full for tag video\r\n========================================================================== */\r\n#video-format{\r\n  .video-content{\r\n    display: flex;\r\n    padding-bottom: 1rem;\r\n    span{\r\n      display: inline-block;\r\n      vertical-align: middle;\r\n      margin-right: .8rem;\r\n    }\r\n  }\r\n}\r\n\r\n/* Page error 404\r\n========================================================================== */\r\n.errorPage{\r\n  font-family: 'Roboto Mono', monospace;\r\n  height: 100vh;\r\n  position: relative;\r\n  width: 100%;\r\n\r\n  &-title{\r\n    padding: 24px 60px;\r\n  }\r\n\r\n  &-link{\r\n    color: rgba(0,0,0,0.54);\r\n    font-size: 22px;\r\n    font-weight: 500;\r\n    left: -5px;\r\n    position: relative;\r\n    text-rendering: optimizeLegibility;\r\n    top: -6px;\r\n  }\r\n\r\n  &-emoji{\r\n    color: rgba(0,0,0,0.4);\r\n    font-size: 150px;\r\n  }\r\n\r\n  &-text{\r\n    color: rgba(0,0,0,0.4);\r\n    line-height: 21px;\r\n    margin-top: 60px;\r\n    white-space: pre-wrap;\r\n  }\r\n\r\n  &-wrap{\r\n    display: block;\r\n    left: 50%;\r\n    min-width: 680px;\r\n    position: absolute;\r\n    text-align: center;\r\n    top: 50%;\r\n    transform: translate(-50%,-50%);\r\n  }\r\n}\r\n\r\n/* Post Twitter facebook card embed Css Center\r\n========================================================================== */\r\n.post {\r\n  iframe[src*=\"facebook.com\"],\r\n  .fb-post,\r\n  .twitter-tweet {\r\n    display: block !important;\r\n    margin: 1.5rem 0 !important;\r\n  }\r\n}\r\n",".container {\r\n  margin: 0 auto;\r\n  padding-left: ($grid-gutter-width / 2);\r\n  padding-right: ($grid-gutter-width / 2);\r\n  width: 100%;\r\n  max-width: $container-xl;\r\n\r\n  // @media #{$sm-and-up}{max-width: $container-sm;}\r\n  // @media #{$md-and-up}{max-width: $container-md;}\r\n  // @media #{$lg-and-up}{max-width: $container-lg;}\r\n  // @media #{$lg-and-up} {  }\r\n}\r\n\r\n.margin-top {\r\n  margin-top: $header-height;\r\n  padding-top: 1rem;\r\n\r\n  @media #{$md-and-up} { padding-top: 1.8rem }\r\n}\r\n\r\n@media #{$md-and-up} {\r\n  .content {\r\n    flex-basis: 69.66666667% !important;\r\n    max-width: 69.66666667% !important;\r\n    // flex: 1 !important;\r\n    // max-width: calc(100% - 300px) !important;\r\n    // order: 1;\r\n    // overflow: hidden;\r\n  }\r\n\r\n  .sidebar {\r\n    flex-basis: 30.33333333% !important;\r\n    max-width: 30.33333333% !important;\r\n    // flex: 0 0 330px !important;\r\n    // order: 2;\r\n  }\r\n}\r\n\r\n@media #{$xl-and-up} {\r\n  .content { padding-right: 40px !important }\r\n}\r\n\r\n@media #{$lg-and-up} {\r\n  .feed-entry-wrapper {\r\n    .entry-image {\r\n      width: 40% !important;\r\n      max-width: 40% !important;\r\n    }\r\n\r\n    .entry-body {\r\n      width: 60% !important;\r\n      max-width: 60% !important;\r\n    }\r\n  }\r\n}\r\n\r\n@media #{$lg-and-down} {\r\n  body.is-article .content {\r\n    max-width: 100% !important;\r\n  }\r\n}\r\n\r\n.row {\r\n  display: flex;\r\n  flex: 0 1 auto;\r\n  flex-flow: row wrap;\r\n  // margin: -8px;\r\n\r\n  margin-left: - $gutter-width / 2;\r\n  margin-right: - $gutter-width / 2;\r\n\r\n  // // Clear floating children\r\n  // &:after {\r\n  //  content: \"\";\r\n  //  display: table;\r\n  //  clear: both;\r\n  // }\r\n\r\n  .col {\r\n    // float: left;\r\n    // box-sizing: border-box;\r\n    flex: 0 0 auto;\r\n    padding-left: $gutter-width / 2;\r\n    padding-right: $gutter-width / 2;\r\n\r\n    $i: 1;\r\n\r\n    @while $i <= $num-cols {\r\n      $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n\r\n      &.s#{$i} {\r\n        // width: $perc;\r\n        flex-basis: $perc;\r\n        max-width: $perc;\r\n      }\r\n      $i: $i + 1;\r\n    }\r\n\r\n    @media #{$md-and-up} {\r\n\r\n      $i: 1;\r\n\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n\r\n        &.m#{$i} {\r\n          // width: $perc;\r\n          flex-basis: $perc;\r\n          max-width: $perc;\r\n        }\r\n        $i: $i + 1\r\n      }\r\n    }\r\n\r\n    @media #{$lg-and-up} {\r\n\r\n      $i: 1;\r\n\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n\r\n        &.l#{$i} {\r\n          // width: $perc;\r\n          flex-basis: $perc;\r\n          max-width: $perc;\r\n        }\r\n        $i: $i + 1;\r\n      }\r\n    }\r\n  }\r\n}\r\n","\r\n//\r\n// Headings\r\n//\r\n\r\nh1, h2, h3, h4, h5, h6,\r\n.h1, .h2, .h3, .h4, .h5, .h6 {\r\n  margin-bottom: $headings-margin-bottom;\r\n  font-family: $headings-font-family;\r\n  font-weight: $headings-font-weight;\r\n  line-height: $headings-line-height;\r\n  color: $headings-color;\r\n  // letter-spacing: -.02em !important;\r\n}\r\n\r\nh1 { font-size: $font-size-h1; }\r\nh2 { font-size: $font-size-h2; }\r\nh3 { font-size: $font-size-h3; }\r\nh4 { font-size: $font-size-h4; }\r\nh5 { font-size: $font-size-h5; }\r\nh6 { font-size: $font-size-h6; }\r\n\r\n// These declarations are kept separate from and placed after\r\n// the previous tag-based declarations so that the classes beat the tags in\r\n// the CSS cascade, and thus <h1 class=\"h2\"> will be styled like an h2.\r\n.h1 { font-size: $font-size-h1; }\r\n.h2 { font-size: $font-size-h2; }\r\n.h3 { font-size: $font-size-h3; }\r\n.h4 { font-size: $font-size-h4; }\r\n.h5 { font-size: $font-size-h5; }\r\n.h6 { font-size: $font-size-h6; }\r\n\r\nh1, h2, h3, h4, h5, h6 {\r\n  margin-bottom: 1rem;\r\n  a{\r\n    color: inherit;\r\n    line-height: inherit;\r\n  }\r\n}\r\n\r\np {\r\n  margin-top: 0;\r\n  margin-bottom: 1rem;\r\n}\r\n","/* Navigation Mobile\r\n========================================================================== */\r\n.nav-mob {\r\n  background: $primary-color;\r\n  color: #000;\r\n  height: 100vh;\r\n  left: 0;\r\n  padding: 0 20px;\r\n  position: fixed;\r\n  right: 0;\r\n  top: 0;\r\n  transform: translateX(100%);\r\n  transition: .4s;\r\n  will-change: transform;\r\n  z-index: 997;\r\n\r\n  a{\r\n    color: inherit;\r\n  }\r\n\r\n  ul {\r\n    a{\r\n      display: block;\r\n      font-weight: 500;\r\n      padding: 8px 0;\r\n      text-transform: uppercase;\r\n      font-size: 14px;\r\n    }\r\n  }\r\n\r\n\r\n  &-content{\r\n    background: #eee;\r\n    overflow: auto;\r\n    -webkit-overflow-scrolling: touch;\r\n    bottom: 0;\r\n    left: 0;\r\n    padding: 20px 0;\r\n    position: absolute;\r\n    right: 0;\r\n    top: $header-height;\r\n  }\r\n\r\n}\r\n\r\n.nav-mob ul,\r\n.nav-mob-subscribe,\r\n.nav-mob-follow{\r\n  border-bottom: solid 1px #DDD;\r\n  padding: 0 ($grid-gutter-width / 2)  20px ($grid-gutter-width / 2);\r\n  margin-bottom: 15px;\r\n}\r\n\r\n/* Navigation Mobile follow\r\n========================================================================== */\r\n.nav-mob-follow{\r\n  a{\r\n    font-size: 20px !important;\r\n    margin: 0 2px !important;\r\n    padding: 0;\r\n\r\n    @extend .btn;\r\n  }\r\n\r\n  @each $social-name, $color in $social-colors {\r\n    .i-#{$social-name}{\r\n      color: #fff;\r\n      @extend .bg-#{$social-name};\r\n    }\r\n  }\r\n}\r\n\r\n/* CopyRigh\r\n========================================================================== */\r\n.nav-mob-copyright{\r\n  color: #aaa;\r\n  font-size: 13px;\r\n  padding: 20px 15px 0;\r\n  text-align: center;\r\n  width: 100%;\r\n\r\n  a{color: $primary-color}\r\n}\r\n\r\n/* subscribe\r\n========================================================================== */\r\n.nav-mob-subscribe{\r\n  .btn{\r\n    border-radius: 0;\r\n    text-transform: none;\r\n    width: 80px;\r\n  }\r\n  .form-group {width: calc(100% - 80px)}\r\n  input{\r\n    border: 0;\r\n    box-shadow: none !important;\r\n  }\r\n}\r\n","// Header post\r\n.cover {\r\n  background: $primary-color;\r\n  box-shadow: 0 0 4px rgba(0,0,0,.14),0 4px 8px rgba(0,0,0,.28);\r\n  color: #fff;\r\n  letter-spacing: .2px;\r\n  min-height: 550px;\r\n  position: relative;\r\n  text-shadow: 0 0 10px rgba(0,0,0,.33);\r\n  z-index: 2;\r\n\r\n  &-wrap {\r\n    margin: 0 auto;\r\n    max-width: 1050px;\r\n    padding: 16px;\r\n    position: relative;\r\n    text-align: center;\r\n    z-index: 99;\r\n  }\r\n\r\n  &-title {\r\n    font-size: 3.5rem;\r\n    margin: 0 0 50px;\r\n    line-height: 1;\r\n    font-weight: 700;\r\n  }\r\n\r\n  &-description { max-width: 600px; }\r\n\r\n  &-background { background-attachment: fixed }\r\n\r\n  //  cover mouse scroll\r\n  .mouse {\r\n    width: 25px;\r\n    position: absolute;\r\n    height: 36px;\r\n    border-radius: 15px;\r\n    border: 2px solid #888;\r\n    border: 2px solid rgba(255,255,255,0.27);\r\n    bottom: 40px;\r\n    right: 40px;\r\n    margin-left: -12px;\r\n    cursor: pointer;\r\n    transition: border-color 0.2s ease-in;\r\n\r\n    .scroll {\r\n      display: block;\r\n      margin: 6px auto;\r\n      width: 3px;\r\n      height: 6px;\r\n      border-radius: 4px;\r\n      background: rgba(255, 255, 255, 0.68);\r\n      animation-duration: 2s;\r\n      animation-name: scroll;\r\n      animation-iteration-count: infinite;\r\n    }\r\n  }\r\n}\r\n\r\n.author {\r\n  a { color: #FFF !important; }\r\n\r\n  &-header {\r\n    margin-top: 10%;\r\n  }\r\n\r\n  &-name-wrap {\r\n    display: inline-block;\r\n  }\r\n\r\n  &-title {\r\n    display: block;\r\n    text-transform: uppercase;\r\n  }\r\n\r\n  &-name {\r\n    margin: 5px 0;\r\n    font-size: 1.75rem;\r\n  }\r\n  &-bio {\r\n    margin: 1.5rem 0;\r\n    line-height: 1.8;\r\n    font-size: 18px;\r\n    max-width: 700px;\r\n  }\r\n\r\n  &-avatar {\r\n    display: inline-block;\r\n    border-radius: 90px;\r\n    margin-right: 10px;\r\n    width: 80px;\r\n    height: 80px;\r\n    background-size: cover;\r\n    background-position: center;\r\n    vertical-align: bottom;\r\n  }\r\n\r\n  // Author meta (location - website - post total)\r\n  &-meta {\r\n    margin-bottom: 20px;\r\n\r\n    span {\r\n      display: inline-block;\r\n      font-size: 17px;\r\n      font-style: italic;\r\n      margin: 0 2rem 1rem 0;\r\n      opacity: 0.8;\r\n      word-wrap: break-word;\r\n    }\r\n  }\r\n\r\n  .author-link:hover {\r\n    opacity: 1;\r\n  }\r\n\r\n  //  author Follow\r\n  &-follow {\r\n    a {\r\n      border-radius: 3px;\r\n      box-shadow: inset 0 0 0 2px rgba(255,255,255,.5);\r\n      cursor: pointer;\r\n      display: inline-block;\r\n      height: 40px;\r\n      letter-spacing: 1px;\r\n      line-height: 40px;\r\n      margin: 0 10px;\r\n      padding: 0 16px;\r\n      text-shadow: none;\r\n      text-transform: uppercase;\r\n\r\n      &:hover {\r\n        box-shadow: inset 0 0 0 2px #fff;\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\n//  Home BTN DOWN\r\n.home-down {\r\n  animation-duration: 1.2s !important;\r\n  bottom: 60px;\r\n  color: rgba(255, 255, 255, 0.5);\r\n  left: 0;\r\n  // transform: translate(0, -50%);\r\n  margin: 0 auto;\r\n  position: absolute;\r\n  right: 0;\r\n  width: 70px;\r\n  z-index: 100;\r\n}\r\n\r\n\r\n@media #{$md-and-up}{\r\n  .cover{\r\n    &-description{\r\n      font-size: $font-size-lg;\r\n    }\r\n  }\r\n\r\n}\r\n\r\n\r\n@media #{$md-and-down} {\r\n  .cover{\r\n    padding-top: $header-height;\r\n    padding-bottom: 20px;\r\n\r\n    &-title{\r\n      font-size: 2rem;\r\n    }\r\n  }\r\n\r\n  .author-avatar{\r\n    display: block;\r\n    margin: 0 auto 10px auto;\r\n  }\r\n}\r\n",".feed-entry-content .feed-entry-wrapper:last-child {\r\n  .entry:last-child {\r\n    padding: 0;\r\n    border: none;\r\n  }\r\n}\r\n\r\n.entry {\r\n  margin-bottom: 1.5rem;\r\n  padding: 0 15px 15px;\r\n\r\n  &-image {\r\n    // margin-bottom: 10px;\r\n\r\n    &--link {\r\n      height: 180px;\r\n      margin: 0 -15px;\r\n      overflow: hidden;\r\n\r\n      &:hover .entry-image--bg {\r\n        transform: scale(1.03);\r\n        backface-visibility: hidden;\r\n      }\r\n    }\r\n\r\n    &--bg { transition: transform 0.3s }\r\n  }\r\n\r\n  // video play for video post format\r\n  &-video-play {\r\n    border-radius: 50%;\r\n    border: 2px solid #fff;\r\n    color: #fff;\r\n    font-size: 3.5rem;\r\n    height: 65px;\r\n    left: 50%;\r\n    line-height: 65px;\r\n    position: absolute;\r\n    text-align: center;\r\n    top: 50%;\r\n    transform: translate(-50%, -50%);\r\n    width: 65px;\r\n    z-index: 10;\r\n    // &:before{line-height: inherit}\r\n  }\r\n\r\n  &-category {\r\n    margin-bottom: 5px;\r\n    text-transform: capitalize;\r\n    font-size: $font-size-sm;\r\n    line-height: 1;\r\n\r\n    a:active {\r\n      text-decoration: underline;\r\n    }\r\n  }\r\n\r\n  &-title {\r\n    color: $entry-color-title;\r\n    font-size: $entry-font-size-mb;\r\n    height: auto;\r\n    line-height: 1.2;\r\n    margin: 0 0 .5rem;\r\n    padding: 0;\r\n\r\n    &:hover {\r\n      color: $entry-color-title-hover;\r\n    }\r\n  }\r\n\r\n  &-byline {\r\n    margin-top: 0;\r\n    margin-bottom: 0.5rem;\r\n    color: $entry-color-byline;\r\n    font-size: $entry-font-size-byline;\r\n\r\n    a {\r\n      color: inherit;\r\n      &:hover { color: #333 }\r\n    }\r\n  }\r\n\r\n  &-body {\r\n    padding-top: 20px;\r\n  }\r\n}\r\n\r\n/* Entry small --small\r\n========================================================================== */\r\n.entry.entry--small {\r\n  margin-bottom: 24px;\r\n  padding: 0;\r\n\r\n  .entry-image { margin-bottom: 10px }\r\n  .entry-image--link { height: 170px; margin: 0 }\r\n\r\n  .entry-title {\r\n    font-size: 1rem;\r\n    font-weight: 500;\r\n    line-height: 1.2;\r\n    text-transform: capitalize;\r\n  }\r\n\r\n  .entry-byline { margin: 0 }\r\n}\r\n\r\n// Media query LG\r\n@media #{$lg-and-up} {\r\n  .entry {\r\n    margin-bottom: 40px;\r\n    padding: 0;\r\n\r\n    &-title {\r\n      // font-size: $entry-font-size;\r\n      font-size: 21px;\r\n    }\r\n\r\n    &-body { padding-right: 35px !important }\r\n\r\n    &-image {\r\n      margin-bottom: 0;\r\n    }\r\n\r\n    &-image--link {\r\n      height: 180px;\r\n      margin: 0;\r\n    }\r\n  }\r\n}\r\n\r\n// Media Query XL\r\n@media #{$xl-and-up} {\r\n  .entry-image--link { height: 218px }\r\n}\r\n",".footer {\r\n  color: $footer-color;\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n  line-height: 1;\r\n  padding: 1.6rem 15px;\r\n  text-align: center;\r\n\r\n  a {\r\n    color: $footer-color-link;\r\n    &:hover { color: rgba(0, 0, 0, .8); }\r\n  }\r\n\r\n  &-wrap {\r\n    margin: 0 auto;\r\n    max-width: 1400px;\r\n  }\r\n\r\n  .heart {\r\n    animation: heartify .5s infinite alternate;\r\n    color: red;\r\n  }\r\n\r\n  &-copy,\r\n  &-design-author {\r\n    display: inline-block;\r\n    padding: .5rem 0;\r\n    vertical-align: middle;\r\n  }\r\n\r\n  &-follow {\r\n    padding: 20px 0;\r\n\r\n    a {\r\n      font-size: 20px;\r\n      margin: 0 5px;\r\n      color: rgba(0, 0, 0, .8);\r\n    }\r\n  }\r\n}\r\n\r\n@keyframes heartify {\r\n  0% {\r\n    transform: scale(.8);\r\n  }\r\n}\r\n",".btn{\r\n  background-color: #fff;\r\n  border-radius: 2px;\r\n  border: 0;\r\n  box-shadow: none;\r\n  color: $btn-secondary-color;\r\n  cursor: pointer;\r\n  display: inline-block;\r\n  font: 500 14px/20px $primary-font;\r\n  height: 36px;\r\n  margin: 0;\r\n  min-width: 36px;\r\n  outline: 0;\r\n  overflow: hidden;\r\n  padding: 8px;\r\n  text-align: center;\r\n  text-decoration: none;\r\n  text-overflow: ellipsis;\r\n  text-transform: uppercase;\r\n  transition: background-color .2s,box-shadow .2s;\r\n  vertical-align: middle;\r\n  white-space: nowrap;\r\n\r\n  + .btn{margin-left: 8px;}\r\n\r\n  &:focus,\r\n  &:hover{\r\n    background-color: $btn-background-color;\r\n    text-decoration: none !important;\r\n  }\r\n  &:active{\r\n    background-color: $btn-active-background;\r\n  }\r\n\r\n  &.btn-lg{\r\n    font-size: 1.5rem;\r\n    min-width: 48px;\r\n    height: 48px;\r\n    line-height: 48px;\r\n  }\r\n  &.btn-flat{\r\n    background: 0;\r\n    box-shadow: none;\r\n    &:focus,\r\n    &:hover,\r\n    &:active{\r\n      background: 0;\r\n      box-shadow: none;\r\n    }\r\n  }\r\n\r\n  &.btn-primary{\r\n    background-color: $btn-primary-color;\r\n    color: #fff;\r\n    &:hover{background-color: darken($btn-primary-color, 4%);}\r\n  }\r\n  &.btn-circle{\r\n    border-radius: 50%;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    padding: 0;\r\n    width: 40px;\r\n  }\r\n  &.btn-circle-small{\r\n    border-radius: 50%;\r\n    height: 32px;\r\n    line-height: 32px;\r\n    padding: 0;\r\n    width: 32px;\r\n    min-width: 32px;\r\n  }\r\n  &.btn-shadow{\r\n    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.12);\r\n    color: #333;\r\n    background-color: #eee;\r\n    &:hover{background-color: rgba(0,0,0,0.12);}\r\n  }\r\n\r\n  &.btn-download-cloud,\r\n  &.btn-download{\r\n    background-color: $btn-primary-color;\r\n    color: #fff;\r\n    &:hover{background-color: darken($btn-primary-color, 8%);}\r\n    &:after{\r\n      @extend %font-icons;\r\n      margin-left: 5px;\r\n      font-size: 1.1rem;\r\n      display: inline-block;\r\n      vertical-align: top;\r\n    }\r\n  }\r\n\r\n  &.btn-download:after{content: $i-download;}\r\n  &.btn-download-cloud:after{content: $i-cloud_download;}\r\n  &.external:after{font-size: 1rem;}\r\n}\r\n\r\n\r\n\r\n\r\n\r\n//  Input\r\n.input-group {\r\n  position: relative;\r\n  display: table;\r\n  border-collapse: separate;\r\n}\r\n\r\n\r\n\r\n\r\n.form-control {\r\n  width: 100%;\r\n  padding: 8px 12px;\r\n  font-size: 14px;\r\n  line-height: 1.42857;\r\n  color: #555;\r\n  background-color: #fff;\r\n  background-image: none;\r\n  border: 1px solid #ccc;\r\n  border-radius: 0px;\r\n  box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);\r\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\r\n  height: 36px;\r\n\r\n  &:focus {\r\n    border-color: $btn-primary-color;\r\n    outline: 0;\r\n    box-shadow: inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba($btn-primary-color,0.6);\r\n  }\r\n}\r\n\r\n\r\n.btn-subscribe-home{\r\n  background-color: transparent;\r\n  border-radius: 3px;\r\n  box-shadow: inset 0 0 0 2px hsla(0,0%,100%,.5);\r\n  color: #ffffff;\r\n  display: block;\r\n  font-size: 20px;\r\n  font-weight: 400;\r\n  line-height: 1.2;\r\n  margin-top: 50px;\r\n  max-width: 300px;\r\n  max-width: 300px;\r\n  padding: 15px 10px;\r\n  transition: all 0.3s;\r\n  width: 100%;\r\n\r\n  &:hover{\r\n    box-shadow: inset 0 0 0 2px #fff;\r\n  }\r\n}\r\n","/*  Post\r\n========================================================================== */\r\n.post-wrapper {\r\n  margin-top: $header-height;\r\n  padding-top: 1.8rem;\r\n}\r\n\r\n.post {\r\n  // padding: 15px;\r\n\r\n  &-header {\r\n    margin-bottom: 1.2rem;\r\n  }\r\n\r\n  &-title {\r\n    color: #000;\r\n    font-size: 2.5rem;\r\n    height: auto;\r\n    line-height: 1.04;\r\n    margin: 0 0 0.9375rem;\r\n    letter-spacing: -.028em !important;\r\n    padding: 0;\r\n  }\r\n\r\n  &-excerpt {\r\n    line-height: 1.3em;\r\n    font-size: 20px;\r\n    color: #7D7D7D;\r\n    margin-bottom: 8px;\r\n  }\r\n\r\n  //  Image\r\n  &-image{\r\n    margin-bottom: 30px;\r\n    overflow: hidden;\r\n  }\r\n\r\n  // post content\r\n  &-body{\r\n    margin-bottom: 2rem;\r\n\r\n    a:focus {text-decoration: underline;}\r\n\r\n    h2{\r\n      // border-bottom: 1px solid $divider-color;\r\n      font-weight: 500;\r\n      margin: 2.50rem 0 1.25rem;\r\n      padding-bottom: 3px;\r\n    }\r\n    h3,h4{\r\n      margin: 32px 0 16px;\r\n    }\r\n\r\n    iframe{\r\n      display: block !important;\r\n      margin: 0 auto 1.5rem 0 !important;\r\n    }\r\n\r\n    img{\r\n      display: block;\r\n      margin-bottom: 1rem;\r\n    }\r\n\r\n    h2 a, h3 a, h4 a {\r\n      color: $primary-color,\r\n    }\r\n  }\r\n\r\n  // tags\r\n  &-tags {\r\n    margin: 1.25rem 0;\r\n  }\r\n}\r\n\r\n.post-card { padding: 15px }\r\n\r\n/* Post author by line top (author - time - tag - sahre)\r\n========================================================================== */\r\n.post-byline {\r\n  color: $secondary-text-color;\r\n  font-size: 14px;\r\n  flex-grow: 1;\r\n  letter-spacing: -.028em !important;\r\n\r\n  a {\r\n    color: inherit;\r\n    &:active { text-decoration: underline; }\r\n    &:hover { color: #222 }\r\n  }\r\n}\r\n\r\n// Post actions top\r\n.post-actions--top .share {\r\n  margin-right: 10px;\r\n  font-size: 20px;\r\n\r\n  &:hover { opacity: .7; }\r\n}\r\n\r\n.post-action-comments {\r\n  color: $secondary-text-color;\r\n  margin-right: 15px;\r\n  font-size: 14px;\r\n}\r\n\r\n/* Post Action social media\r\n========================================================================== */\r\n.post-actions {\r\n  position: relative;\r\n  margin-bottom: 1.5rem;\r\n\r\n  a {\r\n    color: #fff;\r\n    font-size: 1.125rem;\r\n    &:hover { background-color: #000 !important; }\r\n  }\r\n\r\n  li {\r\n    margin-left: 6px;\r\n    &:first-child { margin-left: 0 !important; }\r\n  }\r\n\r\n  .btn { border-radius: 0; }\r\n}\r\n\r\n/* Post author widget bottom\r\n========================================================================== */\r\n.post-author {\r\n  position: relative;\r\n  font-size: 15px;\r\n  padding: 30px 0 30px 100px;\r\n  margin-bottom: 3rem;\r\n  background-color: #f3f5f6;\r\n\r\n  h5 {\r\n    color: #AAA;\r\n    font-size: 12px;\r\n    line-height: 1.5;\r\n    margin: 0;\r\n    font-weight: 500;\r\n  }\r\n\r\n  li {\r\n    margin-left: 30px;\r\n    font-size: 14px;\r\n\r\n    a { color: #555; &:hover { color: #000 } }\r\n\r\n    &:first-child { margin-left: 0 }\r\n  }\r\n\r\n  &-bio {\r\n    max-width: 500px;\r\n  }\r\n\r\n  .post-author-avatar {\r\n    height: 64px;\r\n    width: 64px;\r\n    position: absolute;\r\n    left: 20px;\r\n    top: 30px;\r\n    background-position: center center;\r\n    background-size: cover;\r\n    border-radius: 50%;\r\n  }\r\n}\r\n\r\n/* bottom share and bottom subscribe\r\n========================================================================== */\r\n.share-subscribe{\r\n  margin-bottom: 1rem;\r\n\r\n  p{\r\n    color: #7d7d7d;\r\n    margin-bottom: 1rem;\r\n    line-height: 1;\r\n    font-size: $font-size-sm;\r\n  }\r\n\r\n  .social-share{float: none !important;}\r\n\r\n  &>div{\r\n    position: relative;\r\n    overflow: hidden;\r\n    margin-bottom: 15px;\r\n    &:before{\r\n      content: \" \";\r\n      border-top: solid 1px #000;\r\n      position: absolute;\r\n      top: 0;\r\n      left: 15px;\r\n      width: 40px;\r\n      height: 1px;\r\n    }\r\n\r\n    h5{\r\n      font-size:  $font-size-sm;\r\n      margin: 1rem 0;\r\n      line-height: 1;\r\n      text-transform: uppercase;\r\n      font-weight: 500;\r\n    }\r\n  }\r\n\r\n  //  subscribe\r\n  .newsletter-form{\r\n    display: flex;\r\n\r\n    .form-group{\r\n      max-width: 250px;\r\n      width: 100%;\r\n    }\r\n\r\n    .btn{\r\n      border-radius: 0;\r\n    }\r\n  }\r\n}\r\n\r\n/* Related post\r\n========================================================================== */\r\n.post-related {\r\n  margin-top: 40px;\r\n\r\n  &-title {\r\n    color: #000;\r\n    font-size: 18px;\r\n    font-weight: 500;\r\n    height: auto;\r\n    line-height: 17px;\r\n    margin: 0 0 20px;\r\n    padding-bottom: 10px;\r\n    text-transform: uppercase;\r\n  }\r\n\r\n  &-list {\r\n    margin-bottom: 18px;\r\n    padding: 0;\r\n    border: none;\r\n  }\r\n}\r\n\r\n/* Media Query (medium)\r\n========================================================================== */\r\n\r\n@media #{$md-and-up} {\r\n  .post {\r\n    .title {\r\n      font-size: 2.25rem;\r\n      margin: 0 0 1rem;\r\n    }\r\n\r\n    &-body {\r\n      font-size: 1.125rem;\r\n      line-height: 32px;\r\n\r\n      p { margin-bottom: 1.5rem }\r\n    }\r\n  }\r\n\r\n  .post-card { padding: 30px }\r\n}\r\n\r\n\r\n@media #{$sm-and-down}{\r\n  .post-title{\r\n    font-size: 1.8rem;\r\n  }\r\n  .post-image,\r\n  .video-responsive{\r\n    margin-left:  - ($grid-gutter-width / 2);\r\n    margin-right: - ($grid-gutter-width / 2);\r\n  }\r\n}\r\n","/* sidebar\r\n========================================================================== */\r\n.sidebar {\r\n  position: relative;\r\n  line-height: 1.6;\r\n\r\n  h1,h2,h3,h4,h5,h6 { margin-top: 0; color: #000 }\r\n\r\n  &-items {\r\n    margin-bottom: 2.5rem;\r\n    padding: 25px;\r\n    position: relative;\r\n  }\r\n\r\n  &-title {\r\n    padding-bottom: 10px;\r\n    margin-bottom: 1rem;\r\n    text-transform: uppercase;\r\n    font-size: 1rem;\r\n    // font-weight: $font-weight;\r\n\r\n    @extend .u-border-bottom-dark;\r\n  }\r\n\r\n  .title-primary {\r\n    background-color: $primary-color;\r\n    color: #FFF;\r\n    padding: 10px 16px;\r\n    font-size: 18px;\r\n  }\r\n}\r\n\r\n.sidebar-post {\r\n  // padding-bottom: 2px;\r\n\r\n  &--border {\r\n    align-items: center;\r\n    border-left: 3px solid $primary-color;\r\n    bottom: 0;\r\n    color: rgba(0, 0, 0, .2);\r\n    display: flex;\r\n    font-size: 28px;\r\n    font-weight: bold;\r\n    left: 0;\r\n    line-height: 1;\r\n    padding: 15px 10px 10px;\r\n    position: absolute;\r\n    top: 0;\r\n  }\r\n\r\n  &:nth-child(3n) { .sidebar-post--border { border-color: darken(orange, 2%) } }\r\n  &:nth-child(3n+2) { .sidebar-post--border { border-color: rgb(0, 160, 52) } }\r\n\r\n  &--link {\r\n    // background-color: rgb(255, 255, 255);\r\n    display: block;\r\n    min-height: 50px;\r\n    padding: 10px 15px 10px 55px;\r\n    position: relative;\r\n\r\n    &:hover .sidebar-post--border {\r\n      background-color: rgb(229, 239, 245);\r\n    }\r\n  }\r\n\r\n  &--title {\r\n    color: rgba(0, 0, 0, 0.8);\r\n    font-size: 16px;\r\n    font-weight: 500;\r\n    margin: 0;\r\n  }\r\n}\r\n",".subscribe{\r\n  min-height: 90vh;\r\n  padding-top: $header-height;\r\n\r\n  h3{\r\n    margin: 0;\r\n    margin-bottom: 8px;\r\n    font: 400 20px/32px $primary-font;\r\n  }\r\n\r\n  &-title{\r\n    font-weight: 400;\r\n    margin-top: 0;\r\n  }\r\n\r\n  &-wrap{\r\n    max-width: 700px;\r\n    color: #7d878a;\r\n    padding: 1rem 0;\r\n  }\r\n\r\n  .form-group{\r\n    margin-bottom: 1.5rem;\r\n\r\n    &.error{\r\n      input {border-color: #ff5b5b;}\r\n    }\r\n  }\r\n\r\n  .btn{\r\n    width: 100%;\r\n  }\r\n}\r\n\r\n\r\n.subscribe-form{\r\n  position: relative;\r\n  margin: 30px auto;\r\n  padding: 40px;\r\n  max-width: 400px;\r\n  width: 100%;\r\n  background: #ebeff2;\r\n  border-radius: 5px;\r\n  text-align: left;\r\n}\r\n\r\n.subscribe-input{\r\n  width: 100%;\r\n  padding: 10px;\r\n  border: #4285f4  1px solid;\r\n  border-radius: 2px;\r\n  &:focus{\r\n    outline: none;\r\n  }\r\n}\r\n","// animated Global\r\n.animated {\r\n  animation-duration: 1s;\r\n  animation-fill-mode: both;\r\n\r\n  &.infinite { animation-iteration-count: infinite }\r\n}\r\n\r\n// animated All\r\n.bounceIn { animation-name: bounceIn; }\r\n.bounceInDown { animation-name: bounceInDown }\r\n.slideInUp { animation-name: slideInUp }\r\n.slideOutDown { animation-name: slideOutDown }\r\n\r\n// all keyframes Animates\r\n\r\n// bounceIn\r\n@keyframes bounceIn {\r\n    0%, 20%, 40%, 60%, 80%, 100% {\r\n        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\r\n    }\r\n\r\n    0% {\r\n        opacity: 0;\r\n        transform: scale3d(.3, .3, .3);\r\n    }\r\n\r\n    20% {\r\n        transform: scale3d(1.1, 1.1, 1.1);\r\n    }\r\n\r\n    40% {\r\n        transform: scale3d(.9, .9, .9);\r\n    }\r\n\r\n    60% {\r\n        opacity: 1;\r\n        transform: scale3d(1.03, 1.03, 1.03);\r\n    }\r\n\r\n    80% {\r\n        transform: scale3d(.97, .97, .97);\r\n    }\r\n\r\n    100% {\r\n        opacity: 1;\r\n        transform: scale3d(1, 1, 1);\r\n    }\r\n\r\n};\r\n\r\n// bounceInDown\r\n@keyframes bounceInDown {\r\n    0%, 60%, 75%, 90%, 100% {\r\n        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\r\n    }\r\n\r\n    0% {\r\n        opacity: 0;\r\n        transform: translate3d(0, -3000px, 0);\r\n    }\r\n\r\n    60% {\r\n        opacity: 1;\r\n        transform: translate3d(0, 25px, 0);\r\n    }\r\n\r\n    75% {\r\n        transform: translate3d(0, -10px, 0);\r\n    }\r\n\r\n    90% {\r\n        transform: translate3d(0, 5px, 0);\r\n    }\r\n\r\n    100% {\r\n        transform: none;\r\n    }\r\n}\r\n\r\n@keyframes pulse{\r\n    from{\r\n        transform: scale3d(1, 1, 1);\r\n    }\r\n\r\n    50% {\r\n        transform: scale3d(1.05, 1.05, 1.05);\r\n    }\r\n\r\n    to {\r\n        transform: scale3d(1, 1, 1);\r\n    }\r\n}\r\n\r\n\r\n@keyframes scroll{\r\n    0%{\r\n        opacity:0\r\n    }\r\n    10%{\r\n        opacity:1;\r\n        transform:translateY(0px)\r\n    }\r\n    100% {\r\n        opacity: 0;\r\n        transform: translateY(10px);\r\n    }\r\n}\r\n\r\n//  spin for pagination\r\n@keyframes spin {\r\n    from { transform:rotate(0deg); }\r\n    to { transform:rotate(360deg); }\r\n}\r\n\r\n@keyframes slideInUp {\r\n  from {\r\n    transform: translate3d(0, 100%, 0);\r\n    visibility: visible;\r\n  }\r\n\r\n  to {\r\n    transform: translate3d(0, 0, 0);\r\n  }\r\n}\r\n\r\n@keyframes slideOutDown {\r\n  from {\r\n    transform: translate3d(0, 0, 0);\r\n  }\r\n\r\n  to {\r\n    visibility: hidden;\r\n    transform: translate3d(0, 20%, 0);\r\n  }\r\n}\r\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */
/*!*****************************************************************!*\
  !*** ../node_modules/theia-sticky-sidebar/dist/ResizeSensor.js ***!
  \*****************************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
;
(function() {

    /**
     * Class for dimension change detection.
     *
     * @param {Element|Element[]|Elements|jQuery} element
     * @param {Function} callback
     *
     * @constructor
     */
    var ResizeSensor = function(element, callback) {
        /**
         *
         * @constructor
         */
        function EventQueue() {
            this.q = [];
            this.add = function(ev) {
                this.q.push(ev);
            };

            var i, j;
            this.call = function() {
                for (i = 0, j = this.q.length; i < j; i++) {
                    this.q[i].call();
                }
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {String}      prop
         * @returns {String|Number}
         */
        function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            } else {
                return element.style[prop];
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @param {Function}    resized
         */
        function attachResizeEvent(element, resized) {
            if (!element.resizedAttached) {
                element.resizedAttached = new EventQueue();
                element.resizedAttached.add(resized);
            } else if (element.resizedAttached) {
                element.resizedAttached.add(resized);
                return;
            }

            element.resizeSensor = document.createElement('div');
            element.resizeSensor.className = 'resize-sensor';
            var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;';
            var styleChild = 'position: absolute; left: 0; top: 0; transition: 0s;';

            element.resizeSensor.style.cssText = style;
            element.resizeSensor.innerHTML =
                '<div class="resize-sensor-expand" style="' + style + '">' +
                    '<div style="' + styleChild + '"></div>' +
                '</div>' +
                '<div class="resize-sensor-shrink" style="' + style + '">' +
                    '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' +
                '</div>';
            element.appendChild(element.resizeSensor);

            if (!{fixed: 1, absolute: 1}[getComputedStyle(element, 'position')]) {
                element.style.position = 'relative';
            }

            var expand = element.resizeSensor.childNodes[0];
            var expandChild = expand.childNodes[0];
            var shrink = element.resizeSensor.childNodes[1];
            var shrinkChild = shrink.childNodes[0];

            var lastWidth, lastHeight;

            var reset = function() {
                expandChild.style.width = expand.offsetWidth + 10 + 'px';
                expandChild.style.height = expand.offsetHeight + 10 + 'px';
                expand.scrollLeft = expand.scrollWidth;
                expand.scrollTop = expand.scrollHeight;
                shrink.scrollLeft = shrink.scrollWidth;
                shrink.scrollTop = shrink.scrollHeight;
                lastWidth = element.offsetWidth;
                lastHeight = element.offsetHeight;
            };

            reset();

            var changed = function() {
                if (element.resizedAttached) {
                    element.resizedAttached.call();
                }
            };

            var addEvent = function(el, name, cb) {
                if (el.attachEvent) {
                    el.attachEvent('on' + name, cb);
                } else {
                    el.addEventListener(name, cb);
                }
            };

            var onScroll = function() {
              if (element.offsetWidth != lastWidth || element.offsetHeight != lastHeight) {
                  changed();
              }
              reset();
            };

            addEvent(expand, 'scroll', onScroll);
            addEvent(shrink, 'scroll', onScroll);
        }

        var elementType = Object.prototype.toString.call(element);
        var isCollectionTyped = ('[object Array]' === elementType
            || ('[object NodeList]' === elementType)
            || ('[object HTMLCollection]' === elementType)
            || ('undefined' !== typeof jQuery && element instanceof jQuery) //jquery
            || ('undefined' !== typeof Elements && element instanceof Elements) //mootools
        );

        if (isCollectionTyped) {
            var i = 0, j = element.length;
            for (; i < j; i++) {
                attachResizeEvent(element[i], callback);
            }
        } else {
            attachResizeEvent(element, callback);
        }

        this.detach = function() {
            if (isCollectionTyped) {
                var i = 0, j = element.length;
                for (; i < j; i++) {
                    ResizeSensor.detach(element[i]);
                }
            } else {
                ResizeSensor.detach(element);
            }
        };
    };

    ResizeSensor.detach = function(element) {
        if (element.resizeSensor) {
            element.removeChild(element.resizeSensor);
            delete element.resizeSensor;
            delete element.resizedAttached;
        }
    };

    // make available to common module loader
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = ResizeSensor;
    }
    else {
        window.ResizeSensor = ResizeSensor;
    }

})();

//# sourceMappingURL=maps/ResizeSensor.js.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 53 */
/*!*************************************************************************!*\
  !*** ../node_modules/theia-sticky-sidebar/dist/theia-sticky-sidebar.js ***!
  \*************************************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/*!
 * Theia Sticky Sidebar v1.7.0
 * https://github.com/WeCodePixels/theia-sticky-sidebar
 *
 * Glues your website's sidebars, making them permanently visible while scrolling.
 *
 * Copyright 2013-2016 WeCodePixels and other contributors
 * Released under the MIT license
 */

(function ($) {
    $.fn.theiaStickySidebar = function (options) {
        var defaults = {
            'containerSelector': '',
            'additionalMarginTop': 0,
            'additionalMarginBottom': 0,
            'updateSidebarHeight': true,
            'minWidth': 0,
            'disableOnResponsiveLayouts': true,
            'sidebarBehavior': 'modern',
            'defaultPosition': 'relative',
            'namespace': 'TSS'
        };
        options = $.extend(defaults, options);

        // Validate options
        options.additionalMarginTop = parseInt(options.additionalMarginTop) || 0;
        options.additionalMarginBottom = parseInt(options.additionalMarginBottom) || 0;

        tryInitOrHookIntoEvents(options, this);

        // Try doing init, otherwise hook into window.resize and document.scroll and try again then.
        function tryInitOrHookIntoEvents(options, $that) {
            var success = tryInit(options, $that);

            if (!success) {
                console.log('TSS: Body width smaller than options.minWidth. Init is delayed.');

                $(document).on('scroll.' + options.namespace, function (options, $that) {
                    return function (evt) {
                        var success = tryInit(options, $that);

                        if (success) {
                            $(this).unbind(evt);
                        }
                    };
                }(options, $that));
                $(window).on('resize.' + options.namespace, function (options, $that) {
                    return function (evt) {
                        var success = tryInit(options, $that);

                        if (success) {
                            $(this).unbind(evt);
                        }
                    };
                }(options, $that))
            }
        }

        // Try doing init if proper conditions are met.
        function tryInit(options, $that) {
            if (options.initialized === true) {
                return true;
            }

            if ($('body').width() < options.minWidth) {
                return false;
            }

            init(options, $that);

            return true;
        }

        // Init the sticky sidebar(s).
        function init(options, $that) {
            options.initialized = true;

            // Add CSS
            var existingStylesheet = $('#theia-sticky-sidebar-stylesheet-' + options.namespace);
            if (existingStylesheet.length === 0) {
                $('head').append($('<style id="theia-sticky-sidebar-stylesheet-' + options.namespace + '">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>'));
            }

            $that.each(function () {
                var o = {};

                o.sidebar = $(this);

                // Save options
                o.options = options || {};

                // Get container
                o.container = $(o.options.containerSelector);
                if (o.container.length == 0) {
                    o.container = o.sidebar.parent();
                }

                // Create sticky sidebar
                o.sidebar.parents().css('-webkit-transform', 'none'); // Fix for WebKit bug - https://code.google.com/p/chromium/issues/detail?id=20574
                o.sidebar.css({
                    'position': o.options.defaultPosition,
                    'overflow': 'visible',
                    // The "box-sizing" must be set to "content-box" because we set a fixed height to this element when the sticky sidebar has a fixed position.
                    '-webkit-box-sizing': 'border-box',
                    '-moz-box-sizing': 'border-box',
                    'box-sizing': 'border-box'
                });

                // Get the sticky sidebar element. If none has been found, then create one.
                o.stickySidebar = o.sidebar.find('.theiaStickySidebar');
                if (o.stickySidebar.length == 0) {
                    // Remove <script> tags, otherwise they will be run again when added to the stickySidebar.
                    var javaScriptMIMETypes = /(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;
                    o.sidebar.find('script').filter(function (index, script) {
                        return script.type.length === 0 || script.type.match(javaScriptMIMETypes);
                    }).remove();

                    o.stickySidebar = $('<div>').addClass('theiaStickySidebar').append(o.sidebar.children());
                    o.sidebar.append(o.stickySidebar);
                }

                // Get existing top and bottom margins and paddings
                o.marginBottom = parseInt(o.sidebar.css('margin-bottom'));
                o.paddingTop = parseInt(o.sidebar.css('padding-top'));
                o.paddingBottom = parseInt(o.sidebar.css('padding-bottom'));

                // Add a temporary padding rule to check for collapsable margins.
                var collapsedTopHeight = o.stickySidebar.offset().top;
                var collapsedBottomHeight = o.stickySidebar.outerHeight();
                o.stickySidebar.css('padding-top', 1);
                o.stickySidebar.css('padding-bottom', 1);
                collapsedTopHeight -= o.stickySidebar.offset().top;
                collapsedBottomHeight = o.stickySidebar.outerHeight() - collapsedBottomHeight - collapsedTopHeight;
                if (collapsedTopHeight == 0) {
                    o.stickySidebar.css('padding-top', 0);
                    o.stickySidebarPaddingTop = 0;
                }
                else {
                    o.stickySidebarPaddingTop = 1;
                }

                if (collapsedBottomHeight == 0) {
                    o.stickySidebar.css('padding-bottom', 0);
                    o.stickySidebarPaddingBottom = 0;
                }
                else {
                    o.stickySidebarPaddingBottom = 1;
                }

                // We use this to know whether the user is scrolling up or down.
                o.previousScrollTop = null;

                // Scroll top (value) when the sidebar has fixed position.
                o.fixedScrollTop = 0;

                // Set sidebar to default values.
                resetSidebar();

                o.onScroll = function (o) {
                    // Stop if the sidebar isn't visible.
                    if (!o.stickySidebar.is(":visible")) {
                        return;
                    }

                    // Stop if the window is too small.
                    if ($('body').width() < o.options.minWidth) {
                        resetSidebar();
                        return;
                    }

                    // Stop if the sidebar width is larger than the container width (e.g. the theme is responsive and the sidebar is now below the content)
                    if (o.options.disableOnResponsiveLayouts) {
                        var sidebarWidth = o.sidebar.outerWidth(o.sidebar.css('float') == 'none');

                        if (sidebarWidth + 50 > o.container.width()) {
                            resetSidebar();
                            return;
                        }
                    }

                    var scrollTop = $(document).scrollTop();
                    var position = 'static';

                    // If the user has scrolled down enough for the sidebar to be clipped at the top, then we can consider changing its position.
                    if (scrollTop >= o.sidebar.offset().top + (o.paddingTop - o.options.additionalMarginTop)) {
                        // The top and bottom offsets, used in various calculations.
                        var offsetTop = o.paddingTop + options.additionalMarginTop;
                        var offsetBottom = o.paddingBottom + o.marginBottom + options.additionalMarginBottom;

                        // All top and bottom positions are relative to the window, not to the parent elemnts.
                        var containerTop = o.sidebar.offset().top;
                        var containerBottom = o.sidebar.offset().top + getClearedHeight(o.container);

                        // The top and bottom offsets relative to the window screen top (zero) and bottom (window height).
                        var windowOffsetTop = 0 + options.additionalMarginTop;
                        var windowOffsetBottom;

                        var sidebarSmallerThanWindow = (o.stickySidebar.outerHeight() + offsetTop + offsetBottom) < $(window).height();
                        if (sidebarSmallerThanWindow) {
                            windowOffsetBottom = windowOffsetTop + o.stickySidebar.outerHeight();
                        }
                        else {
                            windowOffsetBottom = $(window).height() - o.marginBottom - o.paddingBottom - options.additionalMarginBottom;
                        }

                        var staticLimitTop = containerTop - scrollTop + o.paddingTop;
                        var staticLimitBottom = containerBottom - scrollTop - o.paddingBottom - o.marginBottom;

                        var top = o.stickySidebar.offset().top - scrollTop;
                        var scrollTopDiff = o.previousScrollTop - scrollTop;

                        // If the sidebar position is fixed, then it won't move up or down by itself. So, we manually adjust the top coordinate.
                        if (o.stickySidebar.css('position') == 'fixed') {
                            if (o.options.sidebarBehavior == 'modern') {
                                top += scrollTopDiff;
                            }
                        }

                        if (o.options.sidebarBehavior == 'stick-to-top') {
                            top = options.additionalMarginTop;
                        }

                        if (o.options.sidebarBehavior == 'stick-to-bottom') {
                            top = windowOffsetBottom - o.stickySidebar.outerHeight();
                        }

                        if (scrollTopDiff > 0) { // If the user is scrolling up.
                            top = Math.min(top, windowOffsetTop);
                        }
                        else { // If the user is scrolling down.
                            top = Math.max(top, windowOffsetBottom - o.stickySidebar.outerHeight());
                        }

                        top = Math.max(top, staticLimitTop);

                        top = Math.min(top, staticLimitBottom - o.stickySidebar.outerHeight());

                        // If the sidebar is the same height as the container, we won't use fixed positioning.
                        var sidebarSameHeightAsContainer = o.container.height() == o.stickySidebar.outerHeight();

                        if (!sidebarSameHeightAsContainer && top == windowOffsetTop) {
                            position = 'fixed';
                        }
                        else if (!sidebarSameHeightAsContainer && top == windowOffsetBottom - o.stickySidebar.outerHeight()) {
                            position = 'fixed';
                        }
                        else if (scrollTop + top - o.sidebar.offset().top - o.paddingTop <= options.additionalMarginTop) {
                            // Stuck to the top of the page. No special behavior.
                            position = 'static';
                        }
                        else {
                            // Stuck to the bottom of the page.
                            position = 'absolute';
                        }
                    }

                    /*
                     * Performance notice: It's OK to set these CSS values at each resize/scroll, even if they don't change.
                     * It's way slower to first check if the values have changed.
                     */
                    if (position == 'fixed') {
                        var scrollLeft = $(document).scrollLeft();

                        o.stickySidebar.css({
                            'position': 'fixed',
                            'width': getWidthForObject(o.stickySidebar) + 'px',
                            'transform': 'translateY(' + top + 'px)',
                            'left': (o.sidebar.offset().left + parseInt(o.sidebar.css('padding-left')) - scrollLeft) + 'px',
                            'top': '0px'
                        });
                    }
                    else if (position == 'absolute') {
                        var css = {};

                        if (o.stickySidebar.css('position') != 'absolute') {
                            css.position = 'absolute';
                            css.transform = 'translateY(' + (scrollTop + top - o.sidebar.offset().top - o.stickySidebarPaddingTop - o.stickySidebarPaddingBottom) + 'px)';
                            css.top = '0px';
                        }

                        css.width = getWidthForObject(o.stickySidebar) + 'px';
                        css.left = '';

                        o.stickySidebar.css(css);
                    }
                    else if (position == 'static') {
                        resetSidebar();
                    }

                    if (position != 'static') {
                        if (o.options.updateSidebarHeight == true) {
                            o.sidebar.css({
                                'min-height': o.stickySidebar.outerHeight() + o.stickySidebar.offset().top - o.sidebar.offset().top + o.paddingBottom
                            });
                        }
                    }

                    o.previousScrollTop = scrollTop;
                };

                // Initialize the sidebar's position.
                o.onScroll(o);

                // Recalculate the sidebar's position on every scroll and resize.
                $(document).on('scroll.' + o.options.namespace, function (o) {
                    return function () {
                        o.onScroll(o);
                    };
                }(o));
                $(window).on('resize.' + o.options.namespace, function (o) {
                    return function () {
                        o.stickySidebar.css({'position': 'static'});
                        o.onScroll(o);
                    };
                }(o));

                // Recalculate the sidebar's position every time the sidebar changes its size.
                if (typeof ResizeSensor !== 'undefined') {
                    new ResizeSensor(o.stickySidebar[0], function (o) {
                        return function () {
                            o.onScroll(o);
                        };
                    }(o));
                }

                // Reset the sidebar to its default state
                function resetSidebar() {
                    o.fixedScrollTop = 0;
                    o.sidebar.css({
                        'min-height': '1px'
                    });
                    o.stickySidebar.css({
                        'position': 'static',
                        'width': '',
                        'transform': 'none'
                    });
                }

                // Get the height of a div as if its floated children were cleared. Note that this function fails if the floats are more than one level deep.
                function getClearedHeight(e) {
                    var height = e.height();

                    e.children().each(function () {
                        height = Math.max(height, $(this).height());
                    });

                    return height;
                }
            });
        }

        function getWidthForObject(object) {
            var width;

            try {
                width = object[0].getBoundingClientRect().width;
            }
            catch (err) {
            }

            if (typeof width === "undefined") {
                width = object.width();
            }

            return width;
        }

        return this;
    }
})(jQuery);

//# sourceMappingURL=maps/theia-sticky-sidebar.js.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 54 */
/*!**********************************************************!*\
  !*** ../node_modules/jquery-lazyload/jquery.lazyload.js ***!
  \**********************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/*!
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2015 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.7
 *
 */

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : false,
            appear          : null,
            load            : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {

                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 55 */
/*!************************************************!*\
  !*** ./scripts/autoload/jquery.ghostHunter.js ***!
  \************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* eslint-disable */

/**
* ghostHunter - 0.3.5
 * Copyright (C) 2014 Jamal Neufeld (jamal@i11u.me)
 * MIT Licensed
 * @license
*/
(function( $ ) {

	/* Include the Lunr library */
	var lunr = __webpack_require__(/*! lunr */ 56);

	//This is the main plugin definition
	$.fn.ghostHunter 	= function( options ) {

		//Here we use jQuery's extend to set default values if they weren't set by the user
		var opts 		= $.extend( {}, $.fn.ghostHunter.defaults, options );
		if( opts.results )
		{
			pluginMethods.init( this , opts );
			return pluginMethods;
		}
	};

	$.fn.ghostHunter.defaults = {
		resultsData			: false,
		onPageLoad			: false,
		onKeyUp				: false,
		result_template 	: "<a href='{{link}}'><p><h2>{{title}}</h2><h4>{{prettyPubDate}}</h4></p></a>",
		info_template		: "<p>Number of posts found: {{amount}}</p>",
		displaySearchInfo	: true,
		zeroResultsInfo		: true,
		before				: false,
		onComplete			: false,
		includepages		: false,
		filterfields		: false
	};
	var prettyDate = function(date) {
		var d = new Date(date);
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			return d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
	};

	var pluginMethods	= {

		isInit			: false,

		init			: function( target , opts ){
			var that				= this;
			this.target				= target;
			this.results			= opts.results;
			this.blogData			= {};
			this.result_template	= opts.result_template;
			this.info_template		= opts.info_template;
			this.zeroResultsInfo	= opts.zeroResultsInfo;
			this.displaySearchInfo	= opts.displaySearchInfo;
			this.before				= opts.before;
			this.onComplete			= opts.onComplete;
			this.includepages		= opts.includepages;
			this.filterfields		= opts.filterfields;

			//This is where we'll build the index for later searching. It's not a big deal to build it on every load as it takes almost no space without data
			this.index = lunr(function () {
				this.field('title', {boost: 10})
				this.field('description')
				this.field('link')
				this.field('markdown', {boost: 5})
				this.field('pubDate')
				this.field('tag')
				this.ref('id')
			});

			if ( opts.onPageLoad ) {
				that.loadAPI();
			} else {
				target.focus(function(){
					that.loadAPI();
				});
			}

			target.closest("form").submit(function(e){
				e.preventDefault();
				that.find(target.val());
			});

			if( opts.onKeyUp ) {
				target.keyup(function() {
					that.find(target.val());
				});

			}

		},

		loadAPI			: function(){

			if(this.isInit) { return false; }

		/*	Here we load all of the blog posts to the index.
			This function will not call on load to avoid unnecessary heavy
			operations on a page if a visitor never ends up searching anything. */

			var index 		= this.index,
				blogData 	= this.blogData;
				obj			= {limit: "all",  include: "tags"};
							if  ( this.includepages ){
								obj.filter="(page:true,page:false)";
							}


			$.get(ghost.url.api('posts',obj)).done(function(data){
				searchData = data.posts;
				searchData.forEach(function(arrayItem){
					var tag_arr = arrayItem.tags.map(function(v) {
						return v.name; // `tag` object has an `name` property which is the value of tag. If you also want other info, check API and get that property
					})
					if(arrayItem.meta_description == null) { arrayItem.meta_description = '' };
					var category = tag_arr.join(", ");
					if (category.length < 1){
						category = "undefined";
					}
					var parsedData 	= {
						id 			: String(arrayItem.id),
						title 		: String(arrayItem.title),
						description	: String(arrayItem.meta_description),
						markdown 	: String(arrayItem.markdown),
						pubDate 	: String(arrayItem.created_at),
						tag 		: category,
						link 		: String(arrayItem.url)
					}

					parsedData.prettyPubDate = prettyDate(parsedData.pubDate);
					var tempdate = prettyDate(parsedData.pubDate);

					index.add(parsedData)
					blogData[arrayItem.id] = {title: arrayItem.title, description: arrayItem.meta_description, pubDate: tempdate, link: arrayItem.url};
				});
			});
			this.isInit = true;
		},

		find 		 	: function(value){
			var this$1 = this;

			var searchResult 	= this.index.search(value);
			var results 		= $(this.results);
			var resultsData 	= [];
			results.empty();

			if(this.before) {
				this.before();
			};

			if(this.zeroResultsInfo || searchResult.length > 0)
			{
				if(this.displaySearchInfo) { results.append(this.format(this.info_template,{"amount":searchResult.length})); }
			}

			for (var i = 0; i < searchResult.length; i++)
			{
				var lunrref		= searchResult[i].ref;
				var postData  	= this$1.blogData[lunrref];
				results.append(this$1.format(this$1.result_template,postData));
				resultsData.push(postData);
			}

			if(this.onComplete) {
				this.onComplete(resultsData);
			};
		},

		clear 			: function(){
			$(this.results).empty();
			this.target.val("");
		},

		format 			: function (t, d) {
			return t.replace(/{{([^{}]*)}}/g, function (a, b) {
				var r = d[b];
				return typeof r === 'string' || typeof r === 'number' ? r : a;
			});
		}
	}

})( jQuery );

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 56 */
/*!************************************!*\
  !*** ../node_modules/lunr/lunr.js ***!
  \************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 0.7.2
 * Copyright (C) 2016 Oliver Nightingale
 * @license MIT
 */

;(function(){

/**
 * Convenience function for instantiating a new lunr index and configuring it
 * with the default pipeline functions and the passed config function.
 *
 * When using this convenience function a new index will be created with the
 * following functions already in the pipeline:
 *
 * lunr.StopWordFilter - filters out any stop words before they enter the
 * index
 *
 * lunr.stemmer - stems the tokens before entering the index.
 *
 * Example:
 *
 *     var idx = lunr(function () {
 *       this.field('title', 10)
 *       this.field('tags', 100)
 *       this.field('body')
 *       
 *       this.ref('cid')
 *       
 *       this.pipeline.add(function () {
 *         // some custom pipeline function
 *       })
 *       
 *     })
 *
 * @param {Function} config A function that will be called with the new instance
 * of the lunr.Index as both its context and first parameter. It can be used to
 * customize the instance of new lunr.Index.
 * @namespace
 * @module
 * @returns {lunr.Index}
 *
 */
var lunr = function (config) {
  var idx = new lunr.Index

  idx.pipeline.add(
    lunr.trimmer,
    lunr.stopWordFilter,
    lunr.stemmer
  )

  if (config) config.call(idx, idx)

  return idx
}

lunr.version = "0.7.2"
/*!
 * lunr.utils
 * Copyright (C) 2016 Oliver Nightingale
 */

/**
 * A namespace containing utils for the rest of the lunr library
 */
lunr.utils = {}

/**
 * Print a warning message to the console.
 *
 * @param {String} message The message to be printed.
 * @memberOf Utils
 */
lunr.utils.warn = (function (global) {
  return function (message) {
    if (global.console && console.warn) {
      console.warn(message)
    }
  }
})(this)

/**
 * Convert an object to a string.
 *
 * In the case of `null` and `undefined` the function returns
 * the empty string, in all other cases the result of calling
 * `toString` on the passed object is returned.
 *
 * @param {Any} obj The object to convert to a string.
 * @return {String} string representation of the passed object.
 * @memberOf Utils
 */
lunr.utils.asString = function (obj) {
  if (obj === void 0 || obj === null) {
    return ""
  } else {
    return obj.toString()
  }
}
/*!
 * lunr.EventEmitter
 * Copyright (C) 2016 Oliver Nightingale
 */

/**
 * lunr.EventEmitter is an event emitter for lunr. It manages adding and removing event handlers and triggering events and their handlers.
 *
 * @constructor
 */
lunr.EventEmitter = function () {
  this.events = {}
}

/**
 * Binds a handler function to a specific event(s).
 *
 * Can bind a single function to many different events in one call.
 *
 * @param {String} [eventName] The name(s) of events to bind this function to.
 * @param {Function} fn The function to call when an event is fired.
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.addListener = function () {
  var args = Array.prototype.slice.call(arguments),
      fn = args.pop(),
      names = args

  if (typeof fn !== "function") throw new TypeError ("last argument must be a function")

  names.forEach(function (name) {
    if (!this.hasHandler(name)) this.events[name] = []
    this.events[name].push(fn)
  }, this)
}

/**
 * Removes a handler function from a specific event.
 *
 * @param {String} eventName The name of the event to remove this function from.
 * @param {Function} fn The function to remove from an event.
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.removeListener = function (name, fn) {
  if (!this.hasHandler(name)) return

  var fnIndex = this.events[name].indexOf(fn)
  this.events[name].splice(fnIndex, 1)

  if (!this.events[name].length) delete this.events[name]
}

/**
 * Calls all functions bound to the given event.
 *
 * Additional data can be passed to the event handler as arguments to `emit`
 * after the event name.
 *
 * @param {String} eventName The name of the event to emit.
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.emit = function (name) {
  if (!this.hasHandler(name)) return

  var args = Array.prototype.slice.call(arguments, 1)

  this.events[name].forEach(function (fn) {
    fn.apply(undefined, args)
  })
}

/**
 * Checks whether a handler has ever been stored against an event.
 *
 * @param {String} eventName The name of the event to check.
 * @private
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.hasHandler = function (name) {
  return name in this.events
}

/*!
 * lunr.tokenizer
 * Copyright (C) 2016 Oliver Nightingale
 */

/**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index. Uses `lunr.tokenizer.separator` to split strings, change
 * the value of this property to change how strings are split into tokens.
 *
 * @module
 * @param {String} obj The string to convert into tokens
 * @see lunr.tokenizer.separator
 * @returns {Array}
 */
lunr.tokenizer = function (obj) {
  if (!arguments.length || obj == null || obj == undefined) return []
  if (Array.isArray(obj)) return obj.map(function (t) { return lunr.utils.asString(t).toLowerCase() })

  // TODO: This exists so that the deprecated property lunr.tokenizer.seperator can still be used. By
  // default it is set to false and so the correctly spelt lunr.tokenizer.separator is used unless
  // the user is using the old property to customise the tokenizer.
  //
  // This should be removed when version 1.0.0 is released.
  var separator = lunr.tokenizer.seperator || lunr.tokenizer.separator

  return obj.toString().trim().toLowerCase().split(separator)
}

/**
 * This property is legacy alias for lunr.tokenizer.separator to maintain backwards compatability.
 * When introduced the token was spelt incorrectly. It will remain until 1.0.0 when it will be removed,
 * all code should use the correctly spelt lunr.tokenizer.separator property instead.
 *
 * @static
 * @see lunr.tokenizer.separator
 * @deprecated since 0.7.2 will be removed in 1.0.0
 * @private
 * @see lunr.tokenizer
 */
lunr.tokenizer.seperator = false

/**
 * The sperator used to split a string into tokens. Override this property to change the behaviour of
 * `lunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
 *
 * @static
 * @see lunr.tokenizer
 */
lunr.tokenizer.separator = /[\s\-]+/

/**
 * Loads a previously serialised tokenizer.
 *
 * A tokenizer function to be loaded must already be registered with lunr.tokenizer.
 * If the serialised tokenizer has not been registered then an error will be thrown.
 *
 * @param {String} label The label of the serialised tokenizer.
 * @returns {Function}
 * @memberOf tokenizer
 */
lunr.tokenizer.load = function (label) {
  var fn = this.registeredFunctions[label]

  if (!fn) {
    throw new Error('Cannot load un-registered function: ' + label)
  }

  return fn
}

lunr.tokenizer.label = 'default'

lunr.tokenizer.registeredFunctions = {
  'default': lunr.tokenizer
}

/**
 * Register a tokenizer function.
 *
 * Functions that are used as tokenizers should be registered if they are to be used with a serialised index.
 *
 * Registering a function does not add it to an index, functions must still be associated with a specific index for them to be used when indexing and searching documents.
 *
 * @param {Function} fn The function to register.
 * @param {String} label The label to register this function with
 * @memberOf tokenizer
 */
lunr.tokenizer.registerFunction = function (fn, label) {
  if (label in this.registeredFunctions) {
    lunr.utils.warn('Overwriting existing tokenizer: ' + label)
  }

  fn.label = label
  this.registeredFunctions[label] = fn
}
/*!
 * lunr.Pipeline
 * Copyright (C) 2016 Oliver Nightingale
 */

/**
 * lunr.Pipelines maintain an ordered list of functions to be applied to all
 * tokens in documents entering the search index and queries being ran against
 * the index.
 *
 * An instance of lunr.Index created with the lunr shortcut will contain a
 * pipeline with a stop word filter and an English language stemmer. Extra
 * functions can be added before or after either of these functions or these
 * default functions can be removed.
 *
 * When run the pipeline will call each function in turn, passing a token, the
 * index of that token in the original list of all tokens and finally a list of
 * all the original tokens.
 *
 * The output of functions in the pipeline will be passed to the next function
 * in the pipeline. To exclude a token from entering the index the function
 * should return undefined, the rest of the pipeline will not be called with
 * this token.
 *
 * For serialisation of pipelines to work, all functions used in an instance of
 * a pipeline should be registered with lunr.Pipeline. Registered functions can
 * then be loaded. If trying to load a serialised pipeline that uses functions
 * that are not registered an error will be thrown.
 *
 * If not planning on serialising the pipeline then registering pipeline functions
 * is not necessary.
 *
 * @constructor
 */
lunr.Pipeline = function () {
  this._stack = []
}

lunr.Pipeline.registeredFunctions = {}

/**
 * Register a function with the pipeline.
 *
 * Functions that are used in the pipeline should be registered if the pipeline
 * needs to be serialised, or a serialised pipeline needs to be loaded.
 *
 * Registering a function does not add it to a pipeline, functions must still be
 * added to instances of the pipeline for them to be used when running a pipeline.
 *
 * @param {Function} fn The function to check for.
 * @param {String} label The label to register this function with
 * @memberOf Pipeline
 */
lunr.Pipeline.registerFunction = function (fn, label) {
  if (label in this.registeredFunctions) {
    lunr.utils.warn('Overwriting existing registered function: ' + label)
  }

  fn.label = label
  lunr.Pipeline.registeredFunctions[fn.label] = fn
}

/**
 * Warns if the function is not registered as a Pipeline function.
 *
 * @param {Function} fn The function to check for.
 * @private
 * @memberOf Pipeline
 */
lunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {
  var isRegistered = fn.label && (fn.label in this.registeredFunctions)

  if (!isRegistered) {
    lunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n', fn)
  }
}

/**
 * Loads a previously serialised pipeline.
 *
 * All functions to be loaded must already be registered with lunr.Pipeline.
 * If any function from the serialised data has not been registered then an
 * error will be thrown.
 *
 * @param {Object} serialised The serialised pipeline to load.
 * @returns {lunr.Pipeline}
 * @memberOf Pipeline
 */
lunr.Pipeline.load = function (serialised) {
  var pipeline = new lunr.Pipeline

  serialised.forEach(function (fnName) {
    var fn = lunr.Pipeline.registeredFunctions[fnName]

    if (fn) {
      pipeline.add(fn)
    } else {
      throw new Error('Cannot load un-registered function: ' + fnName)
    }
  })

  return pipeline
}

/**
 * Adds new functions to the end of the pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {Function} functions Any number of functions to add to the pipeline.
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.add = function () {
  var fns = Array.prototype.slice.call(arguments)

  fns.forEach(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)
    this._stack.push(fn)
  }, this)
}

/**
 * Adds a single function after a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {Function} existingFn A function that already exists in the pipeline.
 * @param {Function} newFn The new function to add to the pipeline.
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.after = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn)
  if (pos == -1) {
    throw new Error('Cannot find existingFn')
  }

  pos = pos + 1
  this._stack.splice(pos, 0, newFn)
}

/**
 * Adds a single function before a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {Function} existingFn A function that already exists in the pipeline.
 * @param {Function} newFn The new function to add to the pipeline.
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.before = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn)
  if (pos == -1) {
    throw new Error('Cannot find existingFn')
  }

  this._stack.splice(pos, 0, newFn)
}

/**
 * Removes a function from the pipeline.
 *
 * @param {Function} fn The function to remove from the pipeline.
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.remove = function (fn) {
  var pos = this._stack.indexOf(fn)
  if (pos == -1) {
    return
  }

  this._stack.splice(pos, 1)
}

/**
 * Runs the current list of functions that make up the pipeline against the
 * passed tokens.
 *
 * @param {Array} tokens The tokens to run through the pipeline.
 * @returns {Array}
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.run = function (tokens) {
  var out = [],
      tokenLength = tokens.length,
      stackLength = this._stack.length

  for (var i = 0; i < tokenLength; i++) {
    var token = tokens[i]

    for (var j = 0; j < stackLength; j++) {
      token = this._stack[j](token, i, tokens)
      if (token === void 0 || token === '') break
    };

    if (token !== void 0 && token !== '') out.push(token)
  };

  return out
}

/**
 * Resets the pipeline by removing any existing processors.
 *
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.reset = function () {
  this._stack = []
}

/**
 * Returns a representation of the pipeline ready for serialisation.
 *
 * Logs a warning if the function has not been registered.
 *
 * @returns {Array}
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.toJSON = function () {
  return this._stack.map(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)

    return fn.label
  })
}
/*!
 * lunr.Vector
 * Copyright (C) 2016 Oliver Nightingale
 */

/**
 * lunr.Vectors implement vector related operations for
 * a series of elements.
 *
 * @constructor
 */
lunr.Vector = function () {
  this._magnitude = null
  this.list = undefined
  this.length = 0
}

/**
 * lunr.Vector.Node is a simple struct for each node
 * in a lunr.Vector.
 *
 * @private
 * @param {Number} The index of the node in the vector.
 * @param {Object} The data at this node in the vector.
 * @param {lunr.Vector.Node} The node directly after this node in the vector.
 * @constructor
 * @memberOf Vector
 */
lunr.Vector.Node = function (idx, val, next) {
  this.idx = idx
  this.val = val
  this.next = next
}

/**
 * Inserts a new value at a position in a vector.
 *
 * @param {Number} The index at which to insert a value.
 * @param {Object} The object to insert in the vector.
 * @memberOf Vector.
 */
lunr.Vector.prototype.insert = function (idx, val) {
  this._magnitude = undefined;
  var list = this.list

  if (!list) {
    this.list = new lunr.Vector.Node (idx, val, list)
    return this.length++
  }

  if (idx < list.idx) {
    this.list = new lunr.Vector.Node (idx, val, list)
    return this.length++
  }

  var prev = list,
      next = list.next

  while (next != undefined) {
    if (idx < next.idx) {
      prev.next = new lunr.Vector.Node (idx, val, next)
      return this.length++
    }

    prev = next, next = next.next
  }

  prev.next = new lunr.Vector.Node (idx, val, next)
  return this.length++
}

/**
 * Calculates the magnitude of this vector.
 *
 * @returns {Number}
 * @memberOf Vector
 */
lunr.Vector.prototype.magnitude = function () {
  if (this._magnitude) return this._magnitude
  var node = this.list,
      sumOfSquares = 0,
      val

  while (node) {
    val = node.val
    sumOfSquares += val * val
    node = node.next
  }

  return this._magnitude = Math.sqrt(sumOfSquares)
}

/**
 * Calculates the dot product of this vector and another vector.
 *
 * @param {lunr.Vector} otherVector The vector to compute the dot product with.
 * @returns {Number}
 * @memberOf Vector
 */
lunr.Vector.prototype.dot = function (otherVector) {
  var node = this.list,
      otherNode = otherVector.list,
      dotProduct = 0

  while (node && otherNode) {
    if (node.idx < otherNode.idx) {
      node = node.next
    } else if (node.idx > otherNode.idx) {
      otherNode = otherNode.next
    } else {
      dotProduct += node.val * otherNode.val
      node = node.next
      otherNode = otherNode.next
    }
  }

  return dotProduct
}

/**
 * Calculates the cosine similarity between this vector and another
 * vector.
 *
 * @param {lunr.Vector} otherVector The other vector to calculate the
 * similarity with.
 * @returns {Number}
 * @memberOf Vector
 */
lunr.Vector.prototype.similarity = function (otherVector) {
  return this.dot(otherVector) / (this.magnitude() * otherVector.magnitude())
}
/*!
 * lunr.SortedSet
 * Copyright (C) 2016 Oliver Nightingale
 */

/**
 * lunr.SortedSets are used to maintain an array of uniq values in a sorted
 * order.
 *
 * @constructor
 */
lunr.SortedSet = function () {
  this.length = 0
  this.elements = []
}

/**
 * Loads a previously serialised sorted set.
 *
 * @param {Array} serialisedData The serialised set to load.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.load = function (serialisedData) {
  var set = new this

  set.elements = serialisedData
  set.length = serialisedData.length

  return set
}

/**
 * Inserts new items into the set in the correct position to maintain the
 * order.
 *
 * @param {Object} The objects to add to this set.
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.add = function () {
  var i, element

  for (i = 0; i < arguments.length; i++) {
    element = arguments[i]
    if (~this.indexOf(element)) continue
    this.elements.splice(this.locationFor(element), 0, element)
  }

  this.length = this.elements.length
}

/**
 * Converts this sorted set into an array.
 *
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.toArray = function () {
  return this.elements.slice()
}

/**
 * Creates a new array with the results of calling a provided function on every
 * element in this sorted set.
 *
 * Delegates to Array.prototype.map and has the same signature.
 *
 * @param {Function} fn The function that is called on each element of the
 * set.
 * @param {Object} ctx An optional object that can be used as the context
 * for the function fn.
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.map = function (fn, ctx) {
  return this.elements.map(fn, ctx)
}

/**
 * Executes a provided function once per sorted set element.
 *
 * Delegates to Array.prototype.forEach and has the same signature.
 *
 * @param {Function} fn The function that is called on each element of the
 * set.
 * @param {Object} ctx An optional object that can be used as the context
 * @memberOf SortedSet
 * for the function fn.
 */
lunr.SortedSet.prototype.forEach = function (fn, ctx) {
  return this.elements.forEach(fn, ctx)
}

/**
 * Returns the index at which a given element can be found in the
 * sorted set, or -1 if it is not present.
 *
 * @param {Object} elem The object to locate in the sorted set.
 * @returns {Number}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.indexOf = function (elem) {
  var start = 0,
      end = this.elements.length,
      sectionLength = end - start,
      pivot = start + Math.floor(sectionLength / 2),
      pivotElem = this.elements[pivot]

  while (sectionLength > 1) {
    if (pivotElem === elem) return pivot

    if (pivotElem < elem) start = pivot
    if (pivotElem > elem) end = pivot

    sectionLength = end - start
    pivot = start + Math.floor(sectionLength / 2)
    pivotElem = this.elements[pivot]
  }

  if (pivotElem === elem) return pivot

  return -1
}

/**
 * Returns the position within the sorted set that an element should be
 * inserted at to maintain the current order of the set.
 *
 * This function assumes that the element to search for does not already exist
 * in the sorted set.
 *
 * @param {Object} elem The elem to find the position for in the set
 * @returns {Number}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.locationFor = function (elem) {
  var start = 0,
      end = this.elements.length,
      sectionLength = end - start,
      pivot = start + Math.floor(sectionLength / 2),
      pivotElem = this.elements[pivot]

  while (sectionLength > 1) {
    if (pivotElem < elem) start = pivot
    if (pivotElem > elem) end = pivot

    sectionLength = end - start
    pivot = start + Math.floor(sectionLength / 2)
    pivotElem = this.elements[pivot]
  }

  if (pivotElem > elem) return pivot
  if (pivotElem < elem) return pivot + 1
}

/**
 * Creates a new lunr.SortedSet that contains the elements in the intersection
 * of this set and the passed set.
 *
 * @param {lunr.SortedSet} otherSet The set to intersect with this set.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.intersect = function (otherSet) {
  var intersectSet = new lunr.SortedSet,
      i = 0, j = 0,
      a_len = this.length, b_len = otherSet.length,
      a = this.elements, b = otherSet.elements

  while (true) {
    if (i > a_len - 1 || j > b_len - 1) break

    if (a[i] === b[j]) {
      intersectSet.add(a[i])
      i++, j++
      continue
    }

    if (a[i] < b[j]) {
      i++
      continue
    }

    if (a[i] > b[j]) {
      j++
      continue
    }
  };

  return intersectSet
}

/**
 * Makes a copy of this set
 *
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.clone = function () {
  var clone = new lunr.SortedSet

  clone.elements = this.toArray()
  clone.length = clone.elements.length

  return clone
}

/**
 * Creates a new lunr.SortedSet that contains the elements in the union
 * of this set and the passed set.
 *
 * @param {lunr.SortedSet} otherSet The set to union with this set.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.union = function (otherSet) {
  var longSet, shortSet, unionSet

  if (this.length >= otherSet.length) {
    longSet = this, shortSet = otherSet
  } else {
    longSet = otherSet, shortSet = this
  }

  unionSet = longSet.clone()

  for(var i = 0, shortSetElements = shortSet.toArray(); i < shortSetElements.length; i++){
    unionSet.add(shortSetElements[i])
  }

  return unionSet
}

/**
 * Returns a representation of the sorted set ready for serialisation.
 *
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.toJSON = function () {
  return this.toArray()
}
/*!
 * lunr.Index
 * Copyright (C) 2016 Oliver Nightingale
 */

/**
 * lunr.Index is object that manages a search index.  It contains the indexes
 * and stores all the tokens and document lookups.  It also provides the main
 * user facing API for the library.
 *
 * @constructor
 */
lunr.Index = function () {
  this._fields = []
  this._ref = 'id'
  this.pipeline = new lunr.Pipeline
  this.documentStore = new lunr.Store
  this.tokenStore = new lunr.TokenStore
  this.corpusTokens = new lunr.SortedSet
  this.eventEmitter =  new lunr.EventEmitter
  this.tokenizerFn = lunr.tokenizer

  this._idfCache = {}

  this.on('add', 'remove', 'update', (function () {
    this._idfCache = {}
  }).bind(this))
}

/**
 * Bind a handler to events being emitted by the index.
 *
 * The handler can be bound to many events at the same time.
 *
 * @param {String} [eventName] The name(s) of events to bind the function to.
 * @param {Function} fn The serialised set to load.
 * @memberOf Index
 */
lunr.Index.prototype.on = function () {
  var args = Array.prototype.slice.call(arguments)
  return this.eventEmitter.addListener.apply(this.eventEmitter, args)
}

/**
 * Removes a handler from an event being emitted by the index.
 *
 * @param {String} eventName The name of events to remove the function from.
 * @param {Function} fn The serialised set to load.
 * @memberOf Index
 */
lunr.Index.prototype.off = function (name, fn) {
  return this.eventEmitter.removeListener(name, fn)
}

/**
 * Loads a previously serialised index.
 *
 * Issues a warning if the index being imported was serialised
 * by a different version of lunr.
 *
 * @param {Object} serialisedData The serialised set to load.
 * @returns {lunr.Index}
 * @memberOf Index
 */
lunr.Index.load = function (serialisedData) {
  if (serialisedData.version !== lunr.version) {
    lunr.utils.warn('version mismatch: current ' + lunr.version + ' importing ' + serialisedData.version)
  }

  var idx = new this

  idx._fields = serialisedData.fields
  idx._ref = serialisedData.ref

  idx.tokenizer(lunr.tokenizer.load(serialisedData.tokenizer))
  idx.documentStore = lunr.Store.load(serialisedData.documentStore)
  idx.tokenStore = lunr.TokenStore.load(serialisedData.tokenStore)
  idx.corpusTokens = lunr.SortedSet.load(serialisedData.corpusTokens)
  idx.pipeline = lunr.Pipeline.load(serialisedData.pipeline)

  return idx
}

/**
 * Adds a field to the list of fields that will be searchable within documents
 * in the index.
 *
 * An optional boost param can be passed to affect how much tokens in this field
 * rank in search results, by default the boost value is 1.
 *
 * Fields should be added before any documents are added to the index, fields
 * that are added after documents are added to the index will only apply to new
 * documents added to the index.
 *
 * @param {String} fieldName The name of the field within the document that
 * should be indexed
 * @param {Number} boost An optional boost that can be applied to terms in this
 * field.
 * @returns {lunr.Index}
 * @memberOf Index
 */
lunr.Index.prototype.field = function (fieldName, opts) {
  var opts = opts || {},
      field = { name: fieldName, boost: opts.boost || 1 }

  this._fields.push(field)
  return this
}

/**
 * Sets the property used to uniquely identify documents added to the index,
 * by default this property is 'id'.
 *
 * This should only be changed before adding documents to the index, changing
 * the ref property without resetting the index can lead to unexpected results.
 *
 * The value of ref can be of any type but it _must_ be stably comparable and
 * orderable.
 *
 * @param {String} refName The property to use to uniquely identify the
 * documents in the index.
 * @param {Boolean} emitEvent Whether to emit add events, defaults to true
 * @returns {lunr.Index}
 * @memberOf Index
 */
lunr.Index.prototype.ref = function (refName) {
  this._ref = refName
  return this
}

/**
 * Sets the tokenizer used for this index.
 *
 * By default the index will use the default tokenizer, lunr.tokenizer. The tokenizer
 * should only be changed before adding documents to the index. Changing the tokenizer
 * without re-building the index can lead to unexpected results.
 *
 * @param {Function} fn The function to use as a tokenizer.
 * @returns {lunr.Index}
 * @memberOf Index
 */
lunr.Index.prototype.tokenizer = function (fn) {
  var isRegistered = fn.label && (fn.label in lunr.tokenizer.registeredFunctions)

  if (!isRegistered) {
    lunr.utils.warn('Function is not a registered tokenizer. This may cause problems when serialising the index')
  }

  this.tokenizerFn = fn
  return this
}

/**
 * Add a document to the index.
 *
 * This is the way new documents enter the index, this function will run the
 * fields from the document through the index's pipeline and then add it to
 * the index, it will then show up in search results.
 *
 * An 'add' event is emitted with the document that has been added and the index
 * the document has been added to. This event can be silenced by passing false
 * as the second argument to add.
 *
 * @param {Object} doc The document to add to the index.
 * @param {Boolean} emitEvent Whether or not to emit events, default true.
 * @memberOf Index
 */
lunr.Index.prototype.add = function (doc, emitEvent) {
  var docTokens = {},
      allDocumentTokens = new lunr.SortedSet,
      docRef = doc[this._ref],
      emitEvent = emitEvent === undefined ? true : emitEvent

  this._fields.forEach(function (field) {
    var fieldTokens = this.pipeline.run(this.tokenizerFn(doc[field.name]))

    docTokens[field.name] = fieldTokens

    for (var i = 0; i < fieldTokens.length; i++) {
      var token = fieldTokens[i]
      allDocumentTokens.add(token)
      this.corpusTokens.add(token)
    }
  }, this)

  this.documentStore.set(docRef, allDocumentTokens)

  for (var i = 0; i < allDocumentTokens.length; i++) {
    var token = allDocumentTokens.elements[i]
    var tf = 0;

    for (var j = 0; j < this._fields.length; j++){
      var field = this._fields[j]
      var fieldTokens = docTokens[field.name]
      var fieldLength = fieldTokens.length

      if (!fieldLength) continue

      var tokenCount = 0
      for (var k = 0; k < fieldLength; k++){
        if (fieldTokens[k] === token){
          tokenCount++
        }
      }

      tf += (tokenCount / fieldLength * field.boost)
    }

    this.tokenStore.add(token, { ref: docRef, tf: tf })
  };

  if (emitEvent) this.eventEmitter.emit('add', doc, this)
}

/**
 * Removes a document from the index.
 *
 * To make sure documents no longer show up in search results they can be
 * removed from the index using this method.
 *
 * The document passed only needs to have the same ref property value as the
 * document that was added to the index, they could be completely different
 * objects.
 *
 * A 'remove' event is emitted with the document that has been removed and the index
 * the document has been removed from. This event can be silenced by passing false
 * as the second argument to remove.
 *
 * @param {Object} doc The document to remove from the index.
 * @param {Boolean} emitEvent Whether to emit remove events, defaults to true
 * @memberOf Index
 */
lunr.Index.prototype.remove = function (doc, emitEvent) {
  var docRef = doc[this._ref],
      emitEvent = emitEvent === undefined ? true : emitEvent

  if (!this.documentStore.has(docRef)) return

  var docTokens = this.documentStore.get(docRef)

  this.documentStore.remove(docRef)

  docTokens.forEach(function (token) {
    this.tokenStore.remove(token, docRef)
  }, this)

  if (emitEvent) this.eventEmitter.emit('remove', doc, this)
}

/**
 * Updates a document in the index.
 *
 * When a document contained within the index gets updated, fields changed,
 * added or removed, to make sure it correctly matched against search queries,
 * it should be updated in the index.
 *
 * This method is just a wrapper around `remove` and `add`
 *
 * An 'update' event is emitted with the document that has been updated and the index.
 * This event can be silenced by passing false as the second argument to update. Only
 * an update event will be fired, the 'add' and 'remove' events of the underlying calls
 * are silenced.
 *
 * @param {Object} doc The document to update in the index.
 * @param {Boolean} emitEvent Whether to emit update events, defaults to true
 * @see Index.prototype.remove
 * @see Index.prototype.add
 * @memberOf Index
 */
lunr.Index.prototype.update = function (doc, emitEvent) {
  var emitEvent = emitEvent === undefined ? true : emitEvent

  this.remove(doc, false)
  this.add(doc, false)

  if (emitEvent) this.eventEmitter.emit('update', doc, this)
}

/**
 * Calculates the inverse document frequency for a token within the index.
 *
 * @param {String} token The token to calculate the idf of.
 * @see Index.prototype.idf
 * @private
 * @memberOf Index
 */
lunr.Index.prototype.idf = function (term) {
  var cacheKey = "@" + term
  if (Object.prototype.hasOwnProperty.call(this._idfCache, cacheKey)) return this._idfCache[cacheKey]

  var documentFrequency = this.tokenStore.count(term),
      idf = 1

  if (documentFrequency > 0) {
    idf = 1 + Math.log(this.documentStore.length / documentFrequency)
  }

  return this._idfCache[cacheKey] = idf
}

/**
 * Searches the index using the passed query.
 *
 * Queries should be a string, multiple words are allowed and will lead to an
 * AND based query, e.g. `idx.search('foo bar')` will run a search for
 * documents containing both 'foo' and 'bar'.
 *
 * All query tokens are passed through the same pipeline that document tokens
 * are passed through, so any language processing involved will be run on every
 * query term.
 *
 * Each query term is expanded, so that the term 'he' might be expanded to
 * 'hello' and 'help' if those terms were already included in the index.
 *
 * Matching documents are returned as an array of objects, each object contains
 * the matching document ref, as set for this index, and the similarity score
 * for this document against the query.
 *
 * @param {String} query The query to search the index with.
 * @returns {Object}
 * @see Index.prototype.idf
 * @see Index.prototype.documentVector
 * @memberOf Index
 */
lunr.Index.prototype.search = function (query) {
  var queryTokens = this.pipeline.run(this.tokenizerFn(query)),
      queryVector = new lunr.Vector,
      documentSets = [],
      fieldBoosts = this._fields.reduce(function (memo, f) { return memo + f.boost }, 0)

  var hasSomeToken = queryTokens.some(function (token) {
    return this.tokenStore.has(token)
  }, this)

  if (!hasSomeToken) return []

  queryTokens
    .forEach(function (token, i, tokens) {
      var tf = 1 / tokens.length * this._fields.length * fieldBoosts,
          self = this

      var set = this.tokenStore.expand(token).reduce(function (memo, key) {
        var pos = self.corpusTokens.indexOf(key),
            idf = self.idf(key),
            similarityBoost = 1,
            set = new lunr.SortedSet

        // if the expanded key is not an exact match to the token then
        // penalise the score for this key by how different the key is
        // to the token.
        if (key !== token) {
          var diff = Math.max(3, key.length - token.length)
          similarityBoost = 1 / Math.log(diff)
        }

        // calculate the query tf-idf score for this token
        // applying an similarityBoost to ensure exact matches
        // these rank higher than expanded terms
        if (pos > -1) queryVector.insert(pos, tf * idf * similarityBoost)

        // add all the documents that have this key into a set
        // ensuring that the type of key is preserved
        var matchingDocuments = self.tokenStore.get(key),
            refs = Object.keys(matchingDocuments),
            refsLen = refs.length

        for (var i = 0; i < refsLen; i++) {
          set.add(matchingDocuments[refs[i]].ref)
        }

        return memo.union(set)
      }, new lunr.SortedSet)

      documentSets.push(set)
    }, this)

  var documentSet = documentSets.reduce(function (memo, set) {
    return memo.intersect(set)
  })

  return documentSet
    .map(function (ref) {
      return { ref: ref, score: queryVector.similarity(this.documentVector(ref)) }
    }, this)
    .sort(function (a, b) {
      return b.score - a.score
    })
}

/**
 * Generates a vector containing all the tokens in the document matching the
 * passed documentRef.
 *
 * The vector contains the tf-idf score for each token contained in the
 * document with the passed documentRef.  The vector will contain an element
 * for every token in the indexes corpus, if the document does not contain that
 * token the element will be 0.
 *
 * @param {Object} documentRef The ref to find the document with.
 * @returns {lunr.Vector}
 * @private
 * @memberOf Index
 */
lunr.Index.prototype.documentVector = function (documentRef) {
  var documentTokens = this.documentStore.get(documentRef),
      documentTokensLength = documentTokens.length,
      documentVector = new lunr.Vector

  for (var i = 0; i < documentTokensLength; i++) {
    var token = documentTokens.elements[i],
        tf = this.tokenStore.get(token)[documentRef].tf,
        idf = this.idf(token)

    documentVector.insert(this.corpusTokens.indexOf(token), tf * idf)
  };

  return documentVector
}

/**
 * Returns a representation of the index ready for serialisation.
 *
 * @returns {Object}
 * @memberOf Index
 */
lunr.Index.prototype.toJSON = function () {
  return {
    version: lunr.version,
    fields: this._fields,
    ref: this._ref,
    tokenizer: this.tokenizerFn.label,
    documentStore: this.documentStore.toJSON(),
    tokenStore: this.tokenStore.toJSON(),
    corpusTokens: this.corpusTokens.toJSON(),
    pipeline: this.pipeline.toJSON()
  }
}

/**
 * Applies a plugin to the current index.
 *
 * A plugin is a function that is called with the index as its context.
 * Plugins can be used to customise or extend the behaviour the index
 * in some way. A plugin is just a function, that encapsulated the custom
 * behaviour that should be applied to the index.
 *
 * The plugin function will be called with the index as its argument, additional
 * arguments can also be passed when calling use. The function will be called
 * with the index as its context.
 *
 * Example:
 *
 *     var myPlugin = function (idx, arg1, arg2) {
 *       // `this` is the index to be extended
 *       // apply any extensions etc here.
 *     }
 *
 *     var idx = lunr(function () {
 *       this.use(myPlugin, 'arg1', 'arg2')
 *     })
 *
 * @param {Function} plugin The plugin to apply.
 * @memberOf Index
 */
lunr.Index.prototype.use = function (plugin) {
  var args = Array.prototype.slice.call(arguments, 1)
  args.unshift(this)
  plugin.apply(this, args)
}
/*!
 * lunr.Store
 * Copyright (C) 2016 Oliver Nightingale
 */

/**
 * lunr.Store is a simple key-value store used for storing sets of tokens for
 * documents stored in index.
 *
 * @constructor
 * @module
 */
lunr.Store = function () {
  this.store = {}
  this.length = 0
}

/**
 * Loads a previously serialised store
 *
 * @param {Object} serialisedData The serialised store to load.
 * @returns {lunr.Store}
 * @memberOf Store
 */
lunr.Store.load = function (serialisedData) {
  var store = new this

  store.length = serialisedData.length
  store.store = Object.keys(serialisedData.store).reduce(function (memo, key) {
    memo[key] = lunr.SortedSet.load(serialisedData.store[key])
    return memo
  }, {})

  return store
}

/**
 * Stores the given tokens in the store against the given id.
 *
 * @param {Object} id The key used to store the tokens against.
 * @param {Object} tokens The tokens to store against the key.
 * @memberOf Store
 */
lunr.Store.prototype.set = function (id, tokens) {
  if (!this.has(id)) this.length++
  this.store[id] = tokens
}

/**
 * Retrieves the tokens from the store for a given key.
 *
 * @param {Object} id The key to lookup and retrieve from the store.
 * @returns {Object}
 * @memberOf Store
 */
lunr.Store.prototype.get = function (id) {
  return this.store[id]
}

/**
 * Checks whether the store contains a key.
 *
 * @param {Object} id The id to look up in the store.
 * @returns {Boolean}
 * @memberOf Store
 */
lunr.Store.prototype.has = function (id) {
  return id in this.store
}

/**
 * Removes the value for a key in the store.
 *
 * @param {Object} id The id to remove from the store.
 * @memberOf Store
 */
lunr.Store.prototype.remove = function (id) {
  if (!this.has(id)) return

  delete this.store[id]
  this.length--
}

/**
 * Returns a representation of the store ready for serialisation.
 *
 * @returns {Object}
 * @memberOf Store
 */
lunr.Store.prototype.toJSON = function () {
  return {
    store: this.store,
    length: this.length
  }
}

/*!
 * lunr.stemmer
 * Copyright (C) 2016 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * lunr.stemmer is an english language stemmer, this is a JavaScript
 * implementation of the PorterStemmer taken from http://tartarus.org/~martin
 *
 * @module
 * @param {String} str The string to stem
 * @returns {String}
 * @see lunr.Pipeline
 */
lunr.stemmer = (function(){
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    },

    step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  var re_mgr0 = new RegExp(mgr0);
  var re_mgr1 = new RegExp(mgr1);
  var re_meq1 = new RegExp(meq1);
  var re_s_v = new RegExp(s_v);

  var re_1a = /^(.+?)(ss|i)es$/;
  var re2_1a = /^(.+?)([^s])s$/;
  var re_1b = /^(.+?)eed$/;
  var re2_1b = /^(.+?)(ed|ing)$/;
  var re_1b_2 = /.$/;
  var re2_1b_2 = /(at|bl|iz)$/;
  var re3_1b_2 = new RegExp("([^aeiouylsz])\\1$");
  var re4_1b_2 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var re_1c = /^(.+?[^aeiou])y$/;
  var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;

  var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;

  var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
  var re2_4 = /^(.+?)(s|t)(ion)$/;

  var re_5 = /^(.+?)e$/;
  var re_5_1 = /ll$/;
  var re3_5 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var porterStemmer = function porterStemmer(w) {
    var   stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4;

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = re_1a
    re2 = re2_1a;

    if (re.test(w)) { w = w.replace(re,"$1$2"); }
    else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }

    // Step 1b
    re = re_1b;
    re2 = re2_1b;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = re_mgr0;
      if (re.test(fp[1])) {
        re = re_1b_2;
        w = w.replace(re,"");
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = re_s_v;
      if (re2.test(stem)) {
        w = stem;
        re2 = re2_1b_2;
        re3 = re3_1b_2;
        re4 = re4_1b_2;
        if (re2.test(w)) {  w = w + "e"; }
        else if (re3.test(w)) { re = re_1b_2; w = w.replace(re,""); }
        else if (re4.test(w)) { w = w + "e"; }
      }
    }

    // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)
    re = re_1c;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      w = stem + "i";
    }

    // Step 2
    re = re_2;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step2list[suffix];
      }
    }

    // Step 3
    re = re_3;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step3list[suffix];
      }
    }

    // Step 4
    re = re_4;
    re2 = re2_4;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      if (re.test(stem)) {
        w = stem;
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = re_mgr1;
      if (re2.test(stem)) {
        w = stem;
      }
    }

    // Step 5
    re = re_5;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      re2 = re_meq1;
      re3 = re3_5;
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
      }
    }

    re = re_5_1;
    re2 = re_mgr1;
    if (re.test(w) && re2.test(w)) {
      re = re_1b_2;
      w = w.replace(re,"");
    }

    // and turn initial Y back to y

    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }

    return w;
  };

  return porterStemmer;
})();

lunr.Pipeline.registerFunction(lunr.stemmer, 'stemmer')
/*!
 * lunr.stopWordFilter
 * Copyright (C) 2016 Oliver Nightingale
 */

/**
 * lunr.generateStopWordFilter builds a stopWordFilter function from the provided
 * list of stop words.
 *
 * The built in lunr.stopWordFilter is built using this generator and can be used
 * to generate custom stopWordFilters for applications or non English languages.
 *
 * @module
 * @param {Array} token The token to pass through the filter
 * @returns {Function}
 * @see lunr.Pipeline
 * @see lunr.stopWordFilter
 */
lunr.generateStopWordFilter = function (stopWords) {
  var words = stopWords.reduce(function (memo, stopWord) {
    memo[stopWord] = stopWord
    return memo
  }, {})

  return function (token) {
    if (token && words[token] !== token) return token
  }
}

/**
 * lunr.stopWordFilter is an English language stop word list filter, any words
 * contained in the list will not be passed through the filter.
 *
 * This is intended to be used in the Pipeline. If the token does not pass the
 * filter then undefined will be returned.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @returns {String}
 * @see lunr.Pipeline
 */
lunr.stopWordFilter = lunr.generateStopWordFilter([
  'a',
  'able',
  'about',
  'across',
  'after',
  'all',
  'almost',
  'also',
  'am',
  'among',
  'an',
  'and',
  'any',
  'are',
  'as',
  'at',
  'be',
  'because',
  'been',
  'but',
  'by',
  'can',
  'cannot',
  'could',
  'dear',
  'did',
  'do',
  'does',
  'either',
  'else',
  'ever',
  'every',
  'for',
  'from',
  'get',
  'got',
  'had',
  'has',
  'have',
  'he',
  'her',
  'hers',
  'him',
  'his',
  'how',
  'however',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'just',
  'least',
  'let',
  'like',
  'likely',
  'may',
  'me',
  'might',
  'most',
  'must',
  'my',
  'neither',
  'no',
  'nor',
  'not',
  'of',
  'off',
  'often',
  'on',
  'only',
  'or',
  'other',
  'our',
  'own',
  'rather',
  'said',
  'say',
  'says',
  'she',
  'should',
  'since',
  'so',
  'some',
  'than',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'tis',
  'to',
  'too',
  'twas',
  'us',
  'wants',
  'was',
  'we',
  'were',
  'what',
  'when',
  'where',
  'which',
  'while',
  'who',
  'whom',
  'why',
  'will',
  'with',
  'would',
  'yet',
  'you',
  'your'
])

lunr.Pipeline.registerFunction(lunr.stopWordFilter, 'stopWordFilter')
/*!
 * lunr.trimmer
 * Copyright (C) 2016 Oliver Nightingale
 */

/**
 * lunr.trimmer is a pipeline function for trimming non word
 * characters from the begining and end of tokens before they
 * enter the index.
 *
 * This implementation may not work correctly for non latin
 * characters and should either be removed or adapted for use
 * with languages with non-latin characters.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @returns {String}
 * @see lunr.Pipeline
 */
lunr.trimmer = function (token) {
  return token.replace(/^\W+/, '').replace(/\W+$/, '')
}

lunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer')
/*!
 * lunr.stemmer
 * Copyright (C) 2016 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * lunr.TokenStore is used for efficient storing and lookup of the reverse
 * index of token to document ref.
 *
 * @constructor
 */
lunr.TokenStore = function () {
  this.root = { docs: {} }
  this.length = 0
}

/**
 * Loads a previously serialised token store
 *
 * @param {Object} serialisedData The serialised token store to load.
 * @returns {lunr.TokenStore}
 * @memberOf TokenStore
 */
lunr.TokenStore.load = function (serialisedData) {
  var store = new this

  store.root = serialisedData.root
  store.length = serialisedData.length

  return store
}

/**
 * Adds a new token doc pair to the store.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to store the doc under
 * @param {Object} doc The doc to store against the token
 * @param {Object} root An optional node at which to start looking for the
 * correct place to enter the doc, by default the root of this lunr.TokenStore
 * is used.
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.add = function (token, doc, root) {
  var root = root || this.root,
      key = token.charAt(0),
      rest = token.slice(1)

  if (!(key in root)) root[key] = {docs: {}}

  if (rest.length === 0) {
    root[key].docs[doc.ref] = doc
    this.length += 1
    return
  } else {
    return this.add(rest, doc, root[key])
  }
}

/**
 * Checks whether this key is contained within this lunr.TokenStore.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to check for
 * @param {Object} root An optional node at which to start
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.has = function (token) {
  if (!token) return false

  var node = this.root

  for (var i = 0; i < token.length; i++) {
    if (!node[token.charAt(i)]) return false

    node = node[token.charAt(i)]
  }

  return true
}

/**
 * Retrieve a node from the token store for a given token.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to get the node for.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @see TokenStore.prototype.get
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.getNode = function (token) {
  if (!token) return {}

  var node = this.root

  for (var i = 0; i < token.length; i++) {
    if (!node[token.charAt(i)]) return {}

    node = node[token.charAt(i)]
  }

  return node
}

/**
 * Retrieve the documents for a node for the given token.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to get the documents for.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.get = function (token, root) {
  return this.getNode(token, root).docs || {}
}

lunr.TokenStore.prototype.count = function (token, root) {
  return Object.keys(this.get(token, root)).length
}

/**
 * Remove the document identified by ref from the token in the store.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to get the documents for.
 * @param {String} ref The ref of the document to remove from this token.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.remove = function (token, ref) {
  if (!token) return
  var node = this.root

  for (var i = 0; i < token.length; i++) {
    if (!(token.charAt(i) in node)) return
    node = node[token.charAt(i)]
  }

  delete node.docs[ref]
}

/**
 * Find all the possible suffixes of the passed token using tokens
 * currently in the store.
 *
 * @param {String} token The token to expand.
 * @returns {Array}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.expand = function (token, memo) {
  var root = this.getNode(token),
      docs = root.docs || {},
      memo = memo || []

  if (Object.keys(docs).length) memo.push(token)

  Object.keys(root)
    .forEach(function (key) {
      if (key === 'docs') return

      memo.concat(this.expand(token + key, memo))
    }, this)

  return memo
}

/**
 * Returns a representation of the token store ready for serialisation.
 *
 * @returns {Object}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.toJSON = function () {
  return {
    root: this.root,
    length: this.length
  }
}

  /**
   * export the module via AMD, CommonJS or as a browser global
   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
   */
  ;(function (root, factory) {
    if (true) {
      // AMD. Register as an anonymous module.
      !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
    } else if (typeof exports === 'object') {
      /**
       * Node. Does not work with strict CommonJS, but
       * only CommonJS-like enviroments that support module.exports,
       * like Node.
       */
      module.exports = factory()
    } else {
      // Browser globals (root is window)
      root.lunr = factory()
    }
  }(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return lunr
  }))
})();


/***/ }),
/* 57 */
/*!****************************************!*\
  !*** ./scripts/autoload/pagination.js ***!
  \****************************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {(function () {
  /**
   * @package godofredoninja
   * pagination
   */
  var $win = $(window);
  var $pathname = $('link[rel=canonical]').attr('href');
  var $btnLoadMore = $('.mapache-load-more');
  var $maxPages = $btnLoadMore.attr('data-page-total');

  var scrollTime = false;
  var currentPage = 2;

  /* active Scroll */
  var onScroll = function () { return scrollTime = true; };


  /* Scroll page END */
  var  detectPageEnd = function () {
    var scrollTopWindow = $win.scrollTop() + window.innerHeight;
    var scrollTopBody = document.body.clientHeight - (window.innerHeight * 2);

    return (scrollTime === true && scrollTopWindow > scrollTopBody);
  }

  /* Fetch Page */
  function fetchPage () {
    if (typeof $maxPages !== 'undefined' && currentPage <= $maxPages && detectPageEnd()) {
      $.ajax({
        type: 'GET',
        url: ($pathname + "page/" + currentPage),
        dataType: 'html',
        beforeSend: function () {
          $win.off('scroll', onScroll);
          $btnLoadMore.text('Loading...');
        },
        success: function (data) {
          var entries = $('.feed-entry-wrapper', data);
          $('.feed-entry-content').append(entries);
          $btnLoadMore.html('Load more <i class="i-keyboard_arrow_down');

          currentPage ++;

          /* Lazy load for image */
          $('.entry-lazy').lazyload();

          $win.on('scroll', onScroll);
        },
      });

      /* Disable scroll */
      scrollTime = false;
    } else {
      $btnLoadMore.remove();
    }
  }


  //  window scroll
  $win.on('scroll', onScroll);

  // set interbal
  setInterval(function () {
    fetchPage();
  }, 500);

})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 58 */
/*!********************************!*\
  !*** ./scripts/util/Router.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__camelCase__ = __webpack_require__(/*! ./camelCase */ 59);


/**
 * DOM-based Routing
 *
 * Based on {@link http://goo.gl/EUTi53|Markup-based Unobtrusive Comprehensive DOM-ready Execution} by Paul Irish
 *
 * The routing fires all common scripts, followed by the page specific scripts.
 * Add additional events for more control over timing e.g. a finalize event
 */
var Router = function Router(routes) {
  this.routes = routes;
};

/**
 * Fire Router events
 * @param {string} route DOM-based route derived from body classes (`<body class="...">`)
 * @param {string} [event] Events on the route. By default, `init` and `finalize` events are called.
 * @param {string} [arg] Any custom argument to be passed to the event.
 */
Router.prototype.fire = function fire (route, event, arg) {
    if ( event === void 0 ) event = 'init';

  var fire = route !== '' && this.routes[route] && typeof this.routes[route][event] === 'function';
  if (fire) {
    this.routes[route][event](arg);
  }
};

/**
 * Automatically load and fire Router events
 *
 * Events are fired in the following order:
 ** common init
 ** page-specific init
 ** page-specific finalize
 ** common finalize
 */
Router.prototype.loadEvents = function loadEvents () {
    var this$1 = this;

  // Fire common init JS
  this.fire('common');

  // Fire page-specific init JS, and then finalize JS
  document.body.className
    .toLowerCase()
    .replace(/-/g, '_')
    .split(/\s+/)
    .map(__WEBPACK_IMPORTED_MODULE_0__camelCase__[false /* default */])
    .forEach(function (className) {
      this$1.fire(className);
      this$1.fire(className, 'finalize');
    });

  // Fire common finalize JS
  this.fire('common', 'finalize');
};

/* unused harmony default export */ var _unused_webpack_default_export = (Router);


/***/ }),
/* 59 */
/*!***********************************!*\
  !*** ./scripts/util/camelCase.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * the most terrible camelizer on the internet, guaranteed!
 * @param {string} str String that isn't camel-case, e.g., CAMeL_CaSEiS-harD
 * @return {string} String converted to camel-case, e.g., camelCaseIsHard
 */
/* unused harmony default export */ var _unused_webpack_default_export = (function (str) { return ("" + (str.charAt(0).toLowerCase()) + (str.replace(/[\W_]/g, '|').split('|')
  .map(function (part) { return ("" + (part.charAt(0).toUpperCase()) + (part.slice(1))); })
  .join('')
  .slice(1))); });;


/***/ }),
/* 60 */
/*!**********************************!*\
  !*** ./scripts/routes/common.js ***!
  \**********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_app_search__ = __webpack_require__(/*! ../app/app.search */ 61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_app_follow__ = __webpack_require__(/*! ../app/app.follow */ 62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_facebook__ = __webpack_require__(/*! ../app/app.facebook */ 63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_twitter__ = __webpack_require__(/*! ../app/app.twitter */ 64);





var $win = $(window);
var $header = $('#header');
var $blogUrl = $('body').attr('mapache-page-url');
var $searchInput = $('.search-field');
var $buttonBackTop = $('.scroll_top');


/**
 * Sticky Navbar in (home - tag - author)
 * Show the button to go back up
 */
function mapacheScroll() {
  $win.on('scroll', function () {
    var scrollTop = $win.scrollTop();
    var coverHeight = $('#cover').height() - $header.height();
    var coverWrap = (coverHeight - scrollTop) / coverHeight;

    // show background in header
    (scrollTop >= coverHeight) ? $header.addClass('toolbar-shadow') : $header.removeClass('toolbar-shadow');

    $('.cover-wrap').css('opacity', coverWrap);

    /* show btn SctrollTop */
    ($(this).scrollTop() > 100) ? $buttonBackTop.addClass('visible') : $buttonBackTop.removeClass('visible');

  });
}


/**
 * Export events
 */
/* unused harmony default export */ var _unused_webpack_default_export = ({
  init: function init() {
    // Follow Social Media
    if (typeof followSocialMedia !== 'undefined') { Object(__WEBPACK_IMPORTED_MODULE_1__app_app_follow__[false /* default */])(followSocialMedia); } // eslint-disable-line

    /* Lazy load for image */
    $('.entry-lazy').lazyload();
    $('.cover-lazy').lazyload({effect : 'fadeIn'});
    // $('.sidebar-lazy').lazyload();
  },
  finalize: function finalize() {
    /* Menu open and close for mobile */
    $('#nav-mob-toggle').on('click', function (e) {
      e.preventDefault();
      $('body').toggleClass('is-showNavMob');
    });

    /* Seach open and close for Mobile */
    $('#search-mob-toggle').on('click', function (e) {
      e.preventDefault();
      $header.toggleClass('is-showSearchMob');
      $searchInput.focus();
    });

    /* scroll link width click (ID)*/
    $('.scrolltop').on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top - 50 }, 500, 'linear');
    });

    // button back top
    $buttonBackTop.on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, 500);
    });

    $('.sidebar-sticky').theiaStickySidebar({
      additionalMarginTop: 66,
    });

    // Twitter and facebook fans page
    if (typeof twitterUserName !== 'undefined' && typeof twitterNumber !== 'undefined') {
      Object(__WEBPACK_IMPORTED_MODULE_3__app_app_twitter__[false /* default */])(twitterUserName, twitterNumber); // eslint-disable-line
    }

    // Facebook Witget
    if (typeof fansPageName !== 'undefined') { Object(__WEBPACK_IMPORTED_MODULE_2__app_app_facebook__[false /* default */])(fansPageName); } // eslint-disable-line

    // Search
    Object(__WEBPACK_IMPORTED_MODULE_0__app_app_search__[false /* default */])($header, $searchInput, $blogUrl);

    /**
     * Sticky Navbar in (home - tag - author)
     * Show the button to go back top
     */
    mapacheScroll();
  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 61 */
/*!***********************************!*\
  !*** ./scripts/app/app.search.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* unused harmony default export */ var _unused_webpack_default_export = (function ($header, $input, blogUrl) {
  $input
  .focus(function () {
    $header.addClass('is-showSearch');
    $('.search-popout').removeClass('closed');
  })
  .blur(function () {
    setTimeout(function () {
      $header.removeClass('is-showSearch');
      $('.search-popout').addClass('closed');
    }, 200);
  })
  .keyup(function () {
    $('.search-suggest-results').css('display', 'block');
  })
  .ghostHunter({
    results: '#search-results',
    zeroResultsInfo: false,
    displaySearchInfo: false,
    result_template: ("<a href=\"" + blogUrl + "{{link}}\">{{title}}</a>"),
    onKeyUp: true,
  });
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 62 */
/*!***********************************!*\
  !*** ./scripts/app/app.follow.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* unused harmony default export */ var _unused_webpack_default_export = (function (links) {
  var urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/; // eslint-disable-line

  return $.each(links, function (name, url) { // eslint-disable-line
    if (typeof url === 'string' && urlRegexp.test(url)) {
      var template = "<a title=\"Follow me in " + name + "\" href=\"" + url + "\" target=\"_blank\" class=\"i-" + name + "\"></a>";
      $('.social_box').append(template);
    }
  });
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 63 */
/*!*************************************!*\
  !*** ./scripts/app/app.facebook.js ***!
  \*************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* unused harmony default export */ var _unused_webpack_default_export = (function (userFacebook) {
  $('.widget-facebook').parent().removeClass('u-hide');
  // const fansPage = `<div class="fb-page" data-href="https://www.facebook.com/${userFacebook}" data-tabs="timeline" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="false">`; // eslint-disable-line
  var fansPage = "<div class=\"fb-page\" data-href=\"https://www.facebook.com/" + userFacebook + "\" data-tabs=\"timeline\" data-small-header=\"true\" data-adapt-container-width=\"true\" data-hide-cover=\"false\" data-show-facepile=\"false\"><blockquote cite=\"https://www.facebook.com/" + userFacebook + "\" class=\"fb-xfbml-parse-ignore\"><a href=\"https://www.facebook.com/" + userFacebook + "\">GodoFredo</a></blockquote></div>"; // eslint-disable-line

  var facebookSdkScript = "<div id=\"fb-root\"></div>\n  <script>(function(d, s, id) {\n    var js, fjs = d.getElementsByTagName(s)[0];\n    if (d.getElementById(id)) return;\n    js = d.createElement(s); js.id = id;\n    js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11';\n    fjs.parentNode.insertBefore(js, fjs);\n  }(document, 'script', 'facebook-jssdk'));</script>";

  if ($("#fb-root").is("div") === false) { $('body').append(facebookSdkScript); }
  $('.widget-facebook').html(fansPage);
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 64 */
/*!************************************!*\
  !*** ./scripts/app/app.twitter.js ***!
  \************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* unused harmony default export */ var _unused_webpack_default_export = (function (name, number) {
  $('.widget-twitter').parent().removeClass('u-hide');
  var twitterBlock = "<a class=\"twitter-timeline\"  href=\"https://twitter.com/" + name + "\" data-chrome=\"nofooter noborders noheader\" data-tweet-limit=\"" + number + "\">Tweets by " + name + "</a><script async src=\"//platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>"; // eslint-disable-line
  $('.widget-twitter').html(twitterBlock);
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 65 */
/*!********************************!*\
  !*** ./scripts/routes/home.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_typed_js__ = __webpack_require__(/*! typed.js */ 66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_typed_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_typed_js__);


/* unused harmony default export */ var _unused_webpack_default_export = ({
  init: function init() {
    // Change title HOME PAGE
    if (typeof homeTitle !== 'undefined') { $('#title-home').html(homeTitle); } // eslint-disable-line

    // Home Title Typed
    if (typeof homeTitleTyped !== 'undefined') { // eslint-disable-line
      $('#title-home').addClass('u-hide');
      $('#home-typed').removeClass('u-hide');

      var typed = new __WEBPACK_IMPORTED_MODULE_0_typed_js___default.a('#home-title-typed', { // eslint-disable-line
        strings: homeTitleTyped, // eslint-disable-line
        typeSpeed: 100,
        loop: true,
        startDelay: 1000,
        backDelay: 1000,
      });
    }

    // change BTN ( Name - URL)
    if (typeof homeBtnTitle !== 'undefined' && typeof homeBtnURL !== 'undefined') {
      $('#btn-home').attr('href', homeBtnURL).html(homeBtnTitle); // eslint-disable-line
    }
  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 66 */
/*!*********************************************!*\
  !*** ../node_modules/typed.js/lib/typed.js ***!
  \*********************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * 
 *   typed.js - A JavaScript Typing Animation Library
 *   Author: Matt Boldt <me@mattboldt.com>
 *   Version: v2.0.6
 *   Url: https://github.com/mattboldt/typed.js
 *   License(s): MIT
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Typed"] = factory();
	else
		root["Typed"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _initializerJs = __webpack_require__(1);
	
	var _htmlParserJs = __webpack_require__(3);
	
	/**
	 * Welcome to Typed.js!
	 * @param {string} elementId HTML element ID _OR_ HTML element
	 * @param {object} options options object
	 * @returns {object} a new Typed object
	 */
	
	var Typed = (function () {
	  function Typed(elementId, options) {
	    _classCallCheck(this, Typed);
	
	    // Initialize it up
	    _initializerJs.initializer.load(this, options, elementId);
	    // All systems go!
	    this.begin();
	  }
	
	  /**
	   * Toggle start() and stop() of the Typed instance
	   * @public
	   */
	
	  _createClass(Typed, [{
	    key: 'toggle',
	    value: function toggle() {
	      this.pause.status ? this.start() : this.stop();
	    }
	
	    /**
	     * Stop typing / backspacing and enable cursor blinking
	     * @public
	     */
	  }, {
	    key: 'stop',
	    value: function stop() {
	      if (this.typingComplete) return;
	      if (this.pause.status) return;
	      this.toggleBlinking(true);
	      this.pause.status = true;
	      this.options.onStop(this.arrayPos, this);
	    }
	
	    /**
	     * Start typing / backspacing after being stopped
	     * @public
	     */
	  }, {
	    key: 'start',
	    value: function start() {
	      if (this.typingComplete) return;
	      if (!this.pause.status) return;
	      this.pause.status = false;
	      if (this.pause.typewrite) {
	        this.typewrite(this.pause.curString, this.pause.curStrPos);
	      } else {
	        this.backspace(this.pause.curString, this.pause.curStrPos);
	      }
	      this.options.onStart(this.arrayPos, this);
	    }
	
	    /**
	     * Destroy this instance of Typed
	     * @public
	     */
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this.reset(false);
	      this.options.onDestroy(this);
	    }
	
	    /**
	     * Reset Typed and optionally restarts
	     * @param {boolean} restart
	     * @public
	     */
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var restart = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	      clearInterval(this.timeout);
	      this.replaceText('');
	      if (this.cursor && this.cursor.parentNode) {
	        this.cursor.parentNode.removeChild(this.cursor);
	        this.cursor = null;
	      }
	      this.strPos = 0;
	      this.arrayPos = 0;
	      this.curLoop = 0;
	      if (restart) {
	        this.insertCursor();
	        this.options.onReset(this);
	        this.begin();
	      }
	    }
	
	    /**
	     * Begins the typing animation
	     * @private
	     */
	  }, {
	    key: 'begin',
	    value: function begin() {
	      var _this = this;
	
	      this.typingComplete = false;
	      this.shuffleStringsIfNeeded(this);
	      this.insertCursor();
	      if (this.bindInputFocusEvents) this.bindFocusEvents();
	      this.timeout = setTimeout(function () {
	        // Check if there is some text in the element, if yes start by backspacing the default message
	        if (!_this.currentElContent || _this.currentElContent.length === 0) {
	          _this.typewrite(_this.strings[_this.sequence[_this.arrayPos]], _this.strPos);
	        } else {
	          // Start typing
	          _this.backspace(_this.currentElContent, _this.currentElContent.length);
	        }
	      }, this.startDelay);
	    }
	
	    /**
	     * Called for each character typed
	     * @param {string} curString the current string in the strings array
	     * @param {number} curStrPos the current position in the curString
	     * @private
	     */
	  }, {
	    key: 'typewrite',
	    value: function typewrite(curString, curStrPos) {
	      var _this2 = this;
	
	      if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {
	        this.el.classList.remove(this.fadeOutClass);
	        if (this.cursor) this.cursor.classList.remove(this.fadeOutClass);
	      }
	
	      var humanize = this.humanizer(this.typeSpeed);
	      var numChars = 1;
	
	      if (this.pause.status === true) {
	        this.setPauseStatus(curString, curStrPos, true);
	        return;
	      }
	
	      // contain typing function in a timeout humanize'd delay
	      this.timeout = setTimeout(function () {
	        // skip over any HTML chars
	        curStrPos = _htmlParserJs.htmlParser.typeHtmlChars(curString, curStrPos, _this2);
	
	        var pauseTime = 0;
	        var substr = curString.substr(curStrPos);
	        // check for an escape character before a pause value
	        // format: \^\d+ .. eg: ^1000 .. should be able to print the ^ too using ^^
	        // single ^ are removed from string
	        if (substr.charAt(0) === '^') {
	          if (/^\^\d+/.test(substr)) {
	            var skip = 1; // skip at least 1
	            substr = /\d+/.exec(substr)[0];
	            skip += substr.length;
	            pauseTime = parseInt(substr);
	            _this2.temporaryPause = true;
	            _this2.options.onTypingPaused(_this2.arrayPos, _this2);
	            // strip out the escape character and pause value so they're not printed
	            curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);
	            _this2.toggleBlinking(true);
	          }
	        }
	
	        // check for skip characters formatted as
	        // "this is a `string to print NOW` ..."
	        if (substr.charAt(0) === '`') {
	          while (curString.substr(curStrPos + numChars).charAt(0) !== '`') {
	            numChars++;
	            if (curStrPos + numChars > curString.length) break;
	          }
	          // strip out the escape characters and append all the string in between
	          var stringBeforeSkip = curString.substring(0, curStrPos);
	          var stringSkipped = curString.substring(stringBeforeSkip.length + 1, curStrPos + numChars);
	          var stringAfterSkip = curString.substring(curStrPos + numChars + 1);
	          curString = stringBeforeSkip + stringSkipped + stringAfterSkip;
	          numChars--;
	        }
	
	        // timeout for any pause after a character
	        _this2.timeout = setTimeout(function () {
	          // Accounts for blinking while paused
	          _this2.toggleBlinking(false);
	
	          // We're done with this sentence!
	          if (curStrPos === curString.length) {
	            _this2.doneTyping(curString, curStrPos);
	          } else {
	            _this2.keepTyping(curString, curStrPos, numChars);
	          }
	          // end of character pause
	          if (_this2.temporaryPause) {
	            _this2.temporaryPause = false;
	            _this2.options.onTypingResumed(_this2.arrayPos, _this2);
	          }
	        }, pauseTime);
	
	        // humanized value for typing
	      }, humanize);
	    }
	
	    /**
	     * Continue to the next string & begin typing
	     * @param {string} curString the current string in the strings array
	     * @param {number} curStrPos the current position in the curString
	     * @private
	     */
	  }, {
	    key: 'keepTyping',
	    value: function keepTyping(curString, curStrPos, numChars) {
	      // call before functions if applicable
	      if (curStrPos === 0) {
	        this.toggleBlinking(false);
	        this.options.preStringTyped(this.arrayPos, this);
	      }
	      // start typing each new char into existing string
	      // curString: arg, this.el.html: original text inside element
	      curStrPos += numChars;
	      var nextString = curString.substr(0, curStrPos);
	      this.replaceText(nextString);
	      // loop the function
	      this.typewrite(curString, curStrPos);
	    }
	
	    /**
	     * We're done typing all strings
	     * @param {string} curString the current string in the strings array
	     * @param {number} curStrPos the current position in the curString
	     * @private
	     */
	  }, {
	    key: 'doneTyping',
	    value: function doneTyping(curString, curStrPos) {
	      var _this3 = this;
	
	      // fires callback function
	      this.options.onStringTyped(this.arrayPos, this);
	      this.toggleBlinking(true);
	      // is this the final string
	      if (this.arrayPos === this.strings.length - 1) {
	        // callback that occurs on the last typed string
	        this.complete();
	        // quit if we wont loop back
	        if (this.loop === false || this.curLoop === this.loopCount) {
	          return;
	        }
	      }
	      this.timeout = setTimeout(function () {
	        _this3.backspace(curString, curStrPos);
	      }, this.backDelay);
	    }
	
	    /**
	     * Backspaces 1 character at a time
	     * @param {string} curString the current string in the strings array
	     * @param {number} curStrPos the current position in the curString
	     * @private
	     */
	  }, {
	    key: 'backspace',
	    value: function backspace(curString, curStrPos) {
	      var _this4 = this;
	
	      if (this.pause.status === true) {
	        this.setPauseStatus(curString, curStrPos, true);
	        return;
	      }
	      if (this.fadeOut) return this.initFadeOut();
	
	      this.toggleBlinking(false);
	      var humanize = this.humanizer(this.backSpeed);
	
	      this.timeout = setTimeout(function () {
	        curStrPos = _htmlParserJs.htmlParser.backSpaceHtmlChars(curString, curStrPos, _this4);
	        // replace text with base text + typed characters
	        var curStringAtPosition = curString.substr(0, curStrPos);
	        _this4.replaceText(curStringAtPosition);
	
	        // if smartBack is enabled
	        if (_this4.smartBackspace) {
	          // the remaining part of the current string is equal of the same part of the new string
	          var nextString = _this4.strings[_this4.arrayPos + 1];
	          if (nextString && curStringAtPosition === nextString.substr(0, curStrPos)) {
	            _this4.stopNum = curStrPos;
	          } else {
	            _this4.stopNum = 0;
	          }
	        }
	
	        // if the number (id of character in current string) is
	        // less than the stop number, keep going
	        if (curStrPos > _this4.stopNum) {
	          // subtract characters one by one
	          curStrPos--;
	          // loop the function
	          _this4.backspace(curString, curStrPos);
	        } else if (curStrPos <= _this4.stopNum) {
	          // if the stop number has been reached, increase
	          // array position to next string
	          _this4.arrayPos++;
	          // When looping, begin at the beginning after backspace complete
	          if (_this4.arrayPos === _this4.strings.length) {
	            _this4.arrayPos = 0;
	            _this4.options.onLastStringBackspaced();
	            _this4.shuffleStringsIfNeeded();
	            _this4.begin();
	          } else {
	            _this4.typewrite(_this4.strings[_this4.sequence[_this4.arrayPos]], curStrPos);
	          }
	        }
	        // humanized value for typing
	      }, humanize);
	    }
	
	    /**
	     * Full animation is complete
	     * @private
	     */
	  }, {
	    key: 'complete',
	    value: function complete() {
	      this.options.onComplete(this);
	      if (this.loop) {
	        this.curLoop++;
	      } else {
	        this.typingComplete = true;
	      }
	    }
	
	    /**
	     * Has the typing been stopped
	     * @param {string} curString the current string in the strings array
	     * @param {number} curStrPos the current position in the curString
	     * @param {boolean} isTyping
	     * @private
	     */
	  }, {
	    key: 'setPauseStatus',
	    value: function setPauseStatus(curString, curStrPos, isTyping) {
	      this.pause.typewrite = isTyping;
	      this.pause.curString = curString;
	      this.pause.curStrPos = curStrPos;
	    }
	
	    /**
	     * Toggle the blinking cursor
	     * @param {boolean} isBlinking
	     * @private
	     */
	  }, {
	    key: 'toggleBlinking',
	    value: function toggleBlinking(isBlinking) {
	      if (!this.cursor) return;
	      // if in paused state, don't toggle blinking a 2nd time
	      if (this.pause.status) return;
	      if (this.cursorBlinking === isBlinking) return;
	      this.cursorBlinking = isBlinking;
	      var status = isBlinking ? 'infinite' : 0;
	      this.cursor.style.animationIterationCount = status;
	    }
	
	    /**
	     * Speed in MS to type
	     * @param {number} speed
	     * @private
	     */
	  }, {
	    key: 'humanizer',
	    value: function humanizer(speed) {
	      return Math.round(Math.random() * speed / 2) + speed;
	    }
	
	    /**
	     * Shuffle the sequence of the strings array
	     * @private
	     */
	  }, {
	    key: 'shuffleStringsIfNeeded',
	    value: function shuffleStringsIfNeeded() {
	      if (!this.shuffle) return;
	      this.sequence = this.sequence.sort(function () {
	        return Math.random() - 0.5;
	      });
	    }
	
	    /**
	     * Adds a CSS class to fade out current string
	     * @private
	     */
	  }, {
	    key: 'initFadeOut',
	    value: function initFadeOut() {
	      var _this5 = this;
	
	      this.el.className += ' ' + this.fadeOutClass;
	      if (this.cursor) this.cursor.className += ' ' + this.fadeOutClass;
	      return setTimeout(function () {
	        _this5.arrayPos++;
	        _this5.replaceText('');
	
	        // Resets current string if end of loop reached
	        if (_this5.strings.length > _this5.arrayPos) {
	          _this5.typewrite(_this5.strings[_this5.sequence[_this5.arrayPos]], 0);
	        } else {
	          _this5.typewrite(_this5.strings[0], 0);
	          _this5.arrayPos = 0;
	        }
	      }, this.fadeOutDelay);
	    }
	
	    /**
	     * Replaces current text in the HTML element
	     * depending on element type
	     * @param {string} str
	     * @private
	     */
	  }, {
	    key: 'replaceText',
	    value: function replaceText(str) {
	      if (this.attr) {
	        this.el.setAttribute(this.attr, str);
	      } else {
	        if (this.isInput) {
	          this.el.value = str;
	        } else if (this.contentType === 'html') {
	          this.el.innerHTML = str;
	        } else {
	          this.el.textContent = str;
	        }
	      }
	    }
	
	    /**
	     * If using input elements, bind focus in order to
	     * start and stop the animation
	     * @private
	     */
	  }, {
	    key: 'bindFocusEvents',
	    value: function bindFocusEvents() {
	      var _this6 = this;
	
	      if (!this.isInput) return;
	      this.el.addEventListener('focus', function (e) {
	        _this6.stop();
	      });
	      this.el.addEventListener('blur', function (e) {
	        if (_this6.el.value && _this6.el.value.length !== 0) {
	          return;
	        }
	        _this6.start();
	      });
	    }
	
	    /**
	     * On init, insert the cursor element
	     * @private
	     */
	  }, {
	    key: 'insertCursor',
	    value: function insertCursor() {
	      if (!this.showCursor) return;
	      if (this.cursor) return;
	      this.cursor = document.createElement('span');
	      this.cursor.className = 'typed-cursor';
	      this.cursor.innerHTML = this.cursorChar;
	      this.el.parentNode && this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);
	    }
	  }]);
	
	  return Typed;
	})();
	
	exports['default'] = Typed;
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _defaultsJs = __webpack_require__(2);
	
	var _defaultsJs2 = _interopRequireDefault(_defaultsJs);
	
	/**
	 * Initialize the Typed object
	 */
	
	var Initializer = (function () {
	  function Initializer() {
	    _classCallCheck(this, Initializer);
	  }
	
	  _createClass(Initializer, [{
	    key: 'load',
	
	    /**
	     * Load up defaults & options on the Typed instance
	     * @param {Typed} self instance of Typed
	     * @param {object} options options object
	     * @param {string} elementId HTML element ID _OR_ instance of HTML element
	     * @private
	     */
	
	    value: function load(self, options, elementId) {
	      // chosen element to manipulate text
	      if (typeof elementId === 'string') {
	        self.el = document.querySelector(elementId);
	      } else {
	        self.el = elementId;
	      }
	
	      self.options = _extends({}, _defaultsJs2['default'], options);
	
	      // attribute to type into
	      self.isInput = self.el.tagName.toLowerCase() === 'input';
	      self.attr = self.options.attr;
	      self.bindInputFocusEvents = self.options.bindInputFocusEvents;
	
	      // show cursor
	      self.showCursor = self.isInput ? false : self.options.showCursor;
	
	      // custom cursor
	      self.cursorChar = self.options.cursorChar;
	
	      // Is the cursor blinking
	      self.cursorBlinking = true;
	
	      // text content of element
	      self.elContent = self.attr ? self.el.getAttribute(self.attr) : self.el.textContent;
	
	      // html or plain text
	      self.contentType = self.options.contentType;
	
	      // typing speed
	      self.typeSpeed = self.options.typeSpeed;
	
	      // add a delay before typing starts
	      self.startDelay = self.options.startDelay;
	
	      // backspacing speed
	      self.backSpeed = self.options.backSpeed;
	
	      // only backspace what doesn't match the previous string
	      self.smartBackspace = self.options.smartBackspace;
	
	      // amount of time to wait before backspacing
	      self.backDelay = self.options.backDelay;
	
	      // Fade out instead of backspace
	      self.fadeOut = self.options.fadeOut;
	      self.fadeOutClass = self.options.fadeOutClass;
	      self.fadeOutDelay = self.options.fadeOutDelay;
	
	      // variable to check whether typing is currently paused
	      self.isPaused = false;
	
	      // input strings of text
	      self.strings = self.options.strings.map(function (s) {
	        return s.trim();
	      });
	
	      // div containing strings
	      if (typeof self.options.stringsElement === 'string') {
	        self.stringsElement = document.querySelector(self.options.stringsElement);
	      } else {
	        self.stringsElement = self.options.stringsElement;
	      }
	
	      if (self.stringsElement) {
	        self.strings = [];
	        self.stringsElement.style.display = 'none';
	        var strings = Array.prototype.slice.apply(self.stringsElement.children);
	        var stringsLength = strings.length;
	
	        if (stringsLength) {
	          for (var i = 0; i < stringsLength; i += 1) {
	            var stringEl = strings[i];
	            self.strings.push(stringEl.innerHTML.trim());
	          }
	        }
	      }
	
	      // character number position of current string
	      self.strPos = 0;
	
	      // current array position
	      self.arrayPos = 0;
	
	      // index of string to stop backspacing on
	      self.stopNum = 0;
	
	      // Looping logic
	      self.loop = self.options.loop;
	      self.loopCount = self.options.loopCount;
	      self.curLoop = 0;
	
	      // shuffle the strings
	      self.shuffle = self.options.shuffle;
	      // the order of strings
	      self.sequence = [];
	
	      self.pause = {
	        status: false,
	        typewrite: true,
	        curString: '',
	        curStrPos: 0
	      };
	
	      // When the typing is complete (when not looped)
	      self.typingComplete = false;
	
	      // Set the order in which the strings are typed
	      for (var i in self.strings) {
	        self.sequence[i] = i;
	      }
	
	      // If there is some text in the element
	      self.currentElContent = this.getCurrentElContent(self);
	
	      self.autoInsertCss = self.options.autoInsertCss;
	
	      this.appendAnimationCss(self);
	    }
	  }, {
	    key: 'getCurrentElContent',
	    value: function getCurrentElContent(self) {
	      var elContent = '';
	      if (self.attr) {
	        elContent = self.el.getAttribute(self.attr);
	      } else if (self.isInput) {
	        elContent = self.el.value;
	      } else if (self.contentType === 'html') {
	        elContent = self.el.innerHTML;
	      } else {
	        elContent = self.el.textContent;
	      }
	      return elContent;
	    }
	  }, {
	    key: 'appendAnimationCss',
	    value: function appendAnimationCss(self) {
	      if (!self.autoInsertCss) {
	        return;
	      }
	      if (!self.showCursor || !self.fadeOut) {
	        return;
	      }
	
	      var css = document.createElement('style');
	      css.type = 'text/css';
	      var innerCss = '';
	      if (self.showCursor) {
	        innerCss += '\n        .typed-cursor{\n          opacity: 1;\n          animation: typedjsBlink 0.7s infinite;\n          -webkit-animation: typedjsBlink 0.7s infinite;\n                  animation: typedjsBlink 0.7s infinite;\n        }\n        @keyframes typedjsBlink{\n          50% { opacity: 0.0; }\n        }\n        @-webkit-keyframes typedjsBlink{\n          0% { opacity: 1; }\n          50% { opacity: 0.0; }\n          100% { opacity: 1; }\n        }\n      ';
	      }
	      if (self.fadeOut) {
	        innerCss += '\n        .typed-fade-out{\n          opacity: 0;\n          transition: opacity .25s;\n          -webkit-animation: 0;\n                  animation: 0;\n        }\n      ';
	      }
	      if (css.length === 0) {
	        return;
	      }
	      css.innerHTML = innerCss;
	      document.head.appendChild(css);
	    }
	  }]);
	
	  return Initializer;
	})();
	
	exports['default'] = Initializer;
	var initializer = new Initializer();
	exports.initializer = initializer;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	/**
	 * Defaults & options
	 * @returns {object} Typed defaults & options
	 * @public
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var defaults = {
	  /**
	   * @property {array} strings strings to be typed
	   * @property {string} stringsElement ID of element containing string children
	   */
	  strings: ['These are the default values...', 'You know what you should do?', 'Use your own!', 'Have a great day!'],
	  stringsElement: null,
	
	  /**
	   * @property {number} typeSpeed type speed in milliseconds
	   */
	  typeSpeed: 0,
	
	  /**
	   * @property {number} startDelay time before typing starts in milliseconds
	   */
	  startDelay: 0,
	
	  /**
	   * @property {number} backSpeed backspacing speed in milliseconds
	   */
	  backSpeed: 0,
	
	  /**
	   * @property {boolean} smartBackspace only backspace what doesn't match the previous string
	   */
	  smartBackspace: true,
	
	  /**
	   * @property {boolean} shuffle shuffle the strings
	   */
	  shuffle: false,
	
	  /**
	   * @property {number} backDelay time before backspacing in milliseconds
	   */
	  backDelay: 700,
	
	  /**
	   * @property {boolean} fadeOut Fade out instead of backspace
	   * @property {string} fadeOutClass css class for fade animation
	   * @property {boolean} fadeOutDelay Fade out delay in milliseconds
	   */
	  fadeOut: false,
	  fadeOutClass: 'typed-fade-out',
	  fadeOutDelay: 500,
	
	  /**
	   * @property {boolean} loop loop strings
	   * @property {number} loopCount amount of loops
	   */
	  loop: false,
	  loopCount: Infinity,
	
	  /**
	   * @property {boolean} showCursor show cursor
	   * @property {string} cursorChar character for cursor
	   * @property {boolean} autoInsertCss insert CSS for cursor and fadeOut into HTML <head>
	   */
	  showCursor: true,
	  cursorChar: '|',
	  autoInsertCss: true,
	
	  /**
	   * @property {string} attr attribute for typing
	   * Ex: input placeholder, value, or just HTML text
	   */
	  attr: null,
	
	  /**
	   * @property {boolean} bindInputFocusEvents bind to focus and blur if el is text input
	   */
	  bindInputFocusEvents: false,
	
	  /**
	   * @property {string} contentType 'html' or 'null' for plaintext
	   */
	  contentType: 'html',
	
	  /**
	   * All typing is complete
	   * @param {Typed} self
	   */
	  onComplete: function onComplete(self) {},
	
	  /**
	   * Before each string is typed
	   * @param {number} arrayPos
	   * @param {Typed} self
	   */
	  preStringTyped: function preStringTyped(arrayPos, self) {},
	
	  /**
	   * After each string is typed
	   * @param {number} arrayPos
	   * @param {Typed} self
	   */
	  onStringTyped: function onStringTyped(arrayPos, self) {},
	
	  /**
	   * During looping, after last string is typed
	   * @param {Typed} self
	   */
	  onLastStringBackspaced: function onLastStringBackspaced(self) {},
	
	  /**
	   * Typing has been stopped
	   * @param {number} arrayPos
	   * @param {Typed} self
	   */
	  onTypingPaused: function onTypingPaused(arrayPos, self) {},
	
	  /**
	   * Typing has been started after being stopped
	   * @param {number} arrayPos
	   * @param {Typed} self
	   */
	  onTypingResumed: function onTypingResumed(arrayPos, self) {},
	
	  /**
	   * After reset
	   * @param {Typed} self
	   */
	  onReset: function onReset(self) {},
	
	  /**
	   * After stop
	   * @param {number} arrayPos
	   * @param {Typed} self
	   */
	  onStop: function onStop(arrayPos, self) {},
	
	  /**
	   * After start
	   * @param {number} arrayPos
	   * @param {Typed} self
	   */
	  onStart: function onStart(arrayPos, self) {},
	
	  /**
	   * After destroy
	   * @param {Typed} self
	   */
	  onDestroy: function onDestroy(self) {}
	};
	
	exports['default'] = defaults;
	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	
	/**
	 * TODO: These methods can probably be combined somehow
	 * Parse HTML tags & HTML Characters
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var HTMLParser = (function () {
	  function HTMLParser() {
	    _classCallCheck(this, HTMLParser);
	  }
	
	  _createClass(HTMLParser, [{
	    key: 'typeHtmlChars',
	
	    /**
	     * Type HTML tags & HTML Characters
	     * @param {string} curString Current string
	     * @param {number} curStrPos Position in current string
	     * @param {Typed} self instance of Typed
	     * @returns {number} a new string position
	     * @private
	     */
	
	    value: function typeHtmlChars(curString, curStrPos, self) {
	      if (self.contentType !== 'html') return curStrPos;
	      var curChar = curString.substr(curStrPos).charAt(0);
	      if (curChar === '<' || curChar === '&') {
	        var endTag = '';
	        if (curChar === '<') {
	          endTag = '>';
	        } else {
	          endTag = ';';
	        }
	        while (curString.substr(curStrPos + 1).charAt(0) !== endTag) {
	          curStrPos++;
	          if (curStrPos + 1 > curString.length) {
	            break;
	          }
	        }
	        curStrPos++;
	      }
	      return curStrPos;
	    }
	
	    /**
	     * Backspace HTML tags and HTML Characters
	     * @param {string} curString Current string
	     * @param {number} curStrPos Position in current string
	     * @param {Typed} self instance of Typed
	     * @returns {number} a new string position
	     * @private
	     */
	  }, {
	    key: 'backSpaceHtmlChars',
	    value: function backSpaceHtmlChars(curString, curStrPos, self) {
	      if (self.contentType !== 'html') return curStrPos;
	      var curChar = curString.substr(curStrPos).charAt(0);
	      if (curChar === '>' || curChar === ';') {
	        var endTag = '';
	        if (curChar === '>') {
	          endTag = '<';
	        } else {
	          endTag = '&';
	        }
	        while (curString.substr(curStrPos - 1).charAt(0) !== endTag) {
	          curStrPos--;
	          if (curStrPos < 0) {
	            break;
	          }
	        }
	        curStrPos--;
	      }
	      return curStrPos;
	    }
	  }]);
	
	  return HTMLParser;
	})();
	
	exports['default'] = HTMLParser;
	var htmlParser = new HTMLParser();
	exports.htmlParser = htmlParser;

/***/ })
/******/ ])
});
;

/***/ }),
/* 67 */
/*!********************************!*\
  !*** ./scripts/routes/post.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prismjs__ = __webpack_require__(/*! prismjs */ 68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prismjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prismjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader__ = __webpack_require__(/*! prismjs/plugins/autoloader/prism-autoloader */ 70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers__ = __webpack_require__(/*! prismjs/plugins/line-numbers/prism-line-numbers */ 71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_share__ = __webpack_require__(/*! ../app/app.share */ 72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_share___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__app_app_share__);






/* Iframe SRC video */
var iframeForVideoResponsive = [
  'iframe[src*="player.vimeo.com"]',
  'iframe[src*="dailymotion.com"]',
  'iframe[src*="youtube.com"]',
  'iframe[src*="facebook.com/plugins/video.php"]',
  'iframe[src*="youtube-nocookie.com"]',
  'iframe[src*="vid.me"]',
  'iframe[src*="kickstarter.com"][src*="video.html"]' ];


/* unused harmony default export */ var _unused_webpack_default_export = ({
  init: function init() {
    var $allVideos = $('.post-body').find(iframeForVideoResponsive.join(','));
    // allVideos.map((key, value) => $(value).wrap('<aside class="video-responsive"></aside>'));

    $allVideos.each(function () {
      $(this).wrap('<aside class="video-responsive"></aside>').parent('.video-responsive');
    });
  },
  finalize: function finalize() {
    /* Share article in Social media */
    $('.share').bind('click', function (e) {
      e.preventDefault();
      var share = new __WEBPACK_IMPORTED_MODULE_3__app_app_share___default.a($(this));
      share.mapacheShare();
    });

    /* add line Numbers */
    $('.post-body').find('pre').addClass('line-numbers');

    /* Prism autoloader */
    Prism.plugins.autoloader.languages_path = ($('body').attr('mapache-page-url')) + "/assets/scripts/prism-components/"; // eslint-disable-line
  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 68 */
/*!****************************************!*\
  !*** ../node_modules/prismjs/prism.js ***!
  \****************************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(\w+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	manual: _self.Prism && _self.Prism.manual,
	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					return o.map(function(v) { return _.util.clone(v); });
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		_.highlightAllUnder(document, async, callback);
	},

	highlightAllUnder: function(container, async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || container.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		if (element.parentNode) {
			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			if (env.code) {
				_.hooks.run('before-highlight', env);
				env.element.textContent = env.code;
				_.hooks.run('after-highlight', env);
			}
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
		var Token = _.Token;

		for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			if (token == target) {
				return;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						return;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str),
					    delNum = 1;

					// Greedy patterns can override/remove up to two previously matched tokens
					if (!match && greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						/*
						 * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						 * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
						 */
						if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					}

					if (!match) {
						if (oneshot) {
							break;
						}

						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						++i;
						pos += before.length;
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);

					if (delNum != 1)
						_.matchGrammar(text, strarr, grammar, i, pos, true, token);

					if (oneshot)
						break;
				}
			}
		}
	},

	tokenize: function(text, grammar, language) {
		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		_.matchGrammar(text, strarr, grammar, 0, 0, false);

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}

	if (!_.disableWorkerMessageHandler) {
		// In worker
		_self.addEventListener('message', function (evt) {
			var message = JSON.parse(evt.data),
				lang = message.language,
				code = message.code,
				immediateClose = message.immediateClose;

			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);
	}

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (!_.manual && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\s\S]*?-->/,
	'prolog': /<\?[\s\S]+?\?>/,
	'doctype': /<!DOCTYPE[\s\S]+?>/i,
	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
				inside: {
					'punctuation': [
						/^=/,
						{
							pattern: /(^|[^\\])["']/,
							lookbehind: true
						}
					]
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
	Prism.languages.markup['entity'];

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\s\S]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^{}\s][^{};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css',
			greedy: true
		}
	});

	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /[.\\]/
		}
	},
	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(?:true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|\d*\.?\d+(?:[Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
	'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	},
	// This must be declared before keyword because we use "function" inside the look-forward
	'function-variable': {
		pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
		alias: 'function'
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\[\s\S]|[^\\`])*`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript',
			greedy: true
		}
	});
}

Prism.languages.js = Prism.languages.javascript;


/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
			var src = pre.getAttribute('data-src');

			var language, parent = pre;
			var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (pre.className.match(lang) || [, ''])[1];
			}

			if (!language) {
				var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
				language = Extensions[extension] || extension;
			}

			var code = document.createElement('code');
			code.className = 'language-' + language;

			pre.textContent = '';

			code.textContent = 'Loading…';

			pre.appendChild(code);

			var xhr = new XMLHttpRequest();

			xhr.open('GET', src, true);

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {

					if (xhr.status < 400 && xhr.responseText) {
						code.textContent = xhr.responseText;

						Prism.highlightElement(code);
					}
					else if (xhr.status >= 400) {
						code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
					}
					else {
						code.textContent = '✖ Error: File does not exist or is empty';
					}
				}
			};

			xhr.send(null);
		});

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 69)))

/***/ }),
/* 69 */
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/global.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 70 */
/*!**********************************************************************!*\
  !*** ../node_modules/prismjs/plugins/autoloader/prism-autoloader.js ***!
  \**********************************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports) {

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.createElement) {
		return;
	}

	// The dependencies map is built automatically with gulp
	var lang_dependencies = /*languages_placeholder[*/{"javascript":"clike","actionscript":"javascript","arduino":"cpp","aspnet":"markup","bison":"c","c":"clike","csharp":"clike","cpp":"c","coffeescript":"javascript","crystal":"ruby","css-extras":"css","d":"clike","dart":"clike","django":"markup","fsharp":"clike","flow":"javascript","glsl":"clike","go":"clike","groovy":"clike","haml":"ruby","handlebars":"markup","haxe":"clike","java":"clike","jolie":"clike","kotlin":"clike","less":"css","markdown":"markup","n4js":"javascript","nginx":"clike","objectivec":"c","opencl":"cpp","parser":"markup","php":"clike","php-extras":"php","processing":"clike","protobuf":"clike","pug":"javascript","qore":"clike","jsx":["markup","javascript"],"reason":"clike","ruby":"clike","sass":"css","scss":"css","scala":"java","smarty":"markup","swift":"clike","textile":"markup","twig":"markup","typescript":"javascript","vbnet":"basic","wiki":"markup"}/*]*/;

	var lang_data = {};

	var ignored_language = 'none';

	var config = Prism.plugins.autoloader = {
		languages_path: 'components/',
		use_minified: true
	};

	/**
	 * Lazy loads an external script
	 * @param {string} src
	 * @param {function=} success
	 * @param {function=} error
	 */
	var script = function (src, success, error) {
		var s = document.createElement('script');
		s.src = src;
		s.async = true;
		s.onload = function() {
			document.body.removeChild(s);
			success && success();
		};
		s.onerror = function() {
			document.body.removeChild(s);
			error && error();
		};
		document.body.appendChild(s);
	};

	/**
	 * Returns the path to a grammar, using the language_path and use_minified config keys.
	 * @param {string} lang
	 * @returns {string}
	 */
	var getLanguagePath = function (lang) {
		return config.languages_path +
			'prism-' + lang
			+ (config.use_minified ? '.min' : '') + '.js'
	};

	/**
	 * Tries to load a grammar and
	 * highlight again the given element once loaded.
	 * @param {string} lang
	 * @param {HTMLElement} elt
	 */
	var registerElement = function (lang, elt) {
		var data = lang_data[lang];
		if (!data) {
			data = lang_data[lang] = {};
		}

		// Look for additional dependencies defined on the <code> or <pre> tags
		var deps = elt.getAttribute('data-dependencies');
		if (!deps && elt.parentNode && elt.parentNode.tagName.toLowerCase() === 'pre') {
			deps = elt.parentNode.getAttribute('data-dependencies');
		}

		if (deps) {
			deps = deps.split(/\s*,\s*/g);
		} else {
			deps = [];
		}

		loadLanguages(deps, function () {
			loadLanguage(lang, function () {
				Prism.highlightElement(elt);
			});
		});
	};

	/**
	 * Sequentially loads an array of grammars.
	 * @param {string[]|string} langs
	 * @param {function=} success
	 * @param {function=} error
	 */
	var loadLanguages = function (langs, success, error) {
		if (typeof langs === 'string') {
			langs = [langs];
		}
		var i = 0;
		var l = langs.length;
		var f = function () {
			if (i < l) {
				loadLanguage(langs[i], function () {
					i++;
					f();
				}, function () {
					error && error(langs[i]);
				});
			} else if (i === l) {
				success && success(langs);
			}
		};
		f();
	};

	/**
	 * Load a grammar with its dependencies
	 * @param {string} lang
	 * @param {function=} success
	 * @param {function=} error
	 */
	var loadLanguage = function (lang, success, error) {
		var load = function () {
			var force = false;
			// Do we want to force reload the grammar?
			if (lang.indexOf('!') >= 0) {
				force = true;
				lang = lang.replace('!', '');
			}

			var data = lang_data[lang];
			if (!data) {
				data = lang_data[lang] = {};
			}
			if (success) {
				if (!data.success_callbacks) {
					data.success_callbacks = [];
				}
				data.success_callbacks.push(success);
			}
			if (error) {
				if (!data.error_callbacks) {
					data.error_callbacks = [];
				}
				data.error_callbacks.push(error);
			}

			if (!force && Prism.languages[lang]) {
				languageSuccess(lang);
			} else if (!force && data.error) {
				languageError(lang);
			} else if (force || !data.loading) {
				data.loading = true;
				var src = getLanguagePath(lang);
				script(src, function () {
					data.loading = false;
					languageSuccess(lang);

				}, function () {
					data.loading = false;
					data.error = true;
					languageError(lang);
				});
			}
		};
		var dependencies = lang_dependencies[lang];
		if(dependencies && dependencies.length) {
			loadLanguages(dependencies, load);
		} else {
			load();
		}
	};

	/**
	 * Runs all success callbacks for this language.
	 * @param {string} lang
	 */
	var languageSuccess = function (lang) {
		if (lang_data[lang] && lang_data[lang].success_callbacks && lang_data[lang].success_callbacks.length) {
			lang_data[lang].success_callbacks.forEach(function (f) {
				f(lang);
			});
		}
	};

	/**
	 * Runs all error callbacks for this language.
	 * @param {string} lang
	 */
	var languageError = function (lang) {
		if (lang_data[lang] && lang_data[lang].error_callbacks && lang_data[lang].error_callbacks.length) {
			lang_data[lang].error_callbacks.forEach(function (f) {
				f(lang);
			});
		}
	};

	Prism.hooks.add('complete', function (env) {
		if (env.element && env.language && !env.grammar) {
			if (env.language !== ignored_language) {
				registerElement(env.language, env.element);
			}
		}
	});

}());


/***/ }),
/* 71 */
/*!**************************************************************************!*\
  !*** ../node_modules/prismjs/plugins/line-numbers/prism-line-numbers.js ***!
  \**************************************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports) {

(function () {

	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	/**
	 * Plugin name which is used as a class name for <pre> which is activating the plugin
	 * @type {String}
	 */
	var PLUGIN_NAME = 'line-numbers';
	
	/**
	 * Regular expression used for determining line breaks
	 * @type {RegExp}
	 */
	var NEW_LINE_EXP = /\n(?!$)/g;

	/**
	 * Resizes line numbers spans according to height of line of code
	 * @param {Element} element <pre> element
	 */
	var _resizeElement = function (element) {
		var codeStyles = getStyles(element);
		var whiteSpace = codeStyles['white-space'];

		if (whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line') {
			var codeElement = element.querySelector('code');
			var lineNumbersWrapper = element.querySelector('.line-numbers-rows');
			var lineNumberSizer = element.querySelector('.line-numbers-sizer');
			var codeLines = codeElement.textContent.split(NEW_LINE_EXP);

			if (!lineNumberSizer) {
				lineNumberSizer = document.createElement('span');
				lineNumberSizer.className = 'line-numbers-sizer';

				codeElement.appendChild(lineNumberSizer);
			}

			lineNumberSizer.style.display = 'block';

			codeLines.forEach(function (line, lineNumber) {
				lineNumberSizer.textContent = line || '\n';
				var lineSize = lineNumberSizer.getBoundingClientRect().height;
				lineNumbersWrapper.children[lineNumber].style.height = lineSize + 'px';
			});

			lineNumberSizer.textContent = '';
			lineNumberSizer.style.display = 'none';
		}
	};

	/**
	 * Returns style declarations for the element
	 * @param {Element} element
	 */
	var getStyles = function (element) {
		if (!element) {
			return null;
		}

		return window.getComputedStyle ? getComputedStyle(element) : (element.currentStyle || null);
	};

	window.addEventListener('resize', function () {
		Array.prototype.forEach.call(document.querySelectorAll('pre.' + PLUGIN_NAME), _resizeElement);
	});

	Prism.hooks.add('complete', function (env) {
		if (!env.code) {
			return;
		}

		// works only for <code> wrapped inside <pre> (not inline)
		var pre = env.element.parentNode;
		var clsReg = /\s*\bline-numbers\b\s*/;
		if (
			!pre || !/pre/i.test(pre.nodeName) ||
			// Abort only if nor the <pre> nor the <code> have the class
			(!clsReg.test(pre.className) && !clsReg.test(env.element.className))
		) {
			return;
		}

		if (env.element.querySelector('.line-numbers-rows')) {
			// Abort if line numbers already exists
			return;
		}

		if (clsReg.test(env.element.className)) {
			// Remove the class 'line-numbers' from the <code>
			env.element.className = env.element.className.replace(clsReg, ' ');
		}
		if (!clsReg.test(pre.className)) {
			// Add the class 'line-numbers' to the <pre>
			pre.className += ' line-numbers';
		}

		var match = env.code.match(NEW_LINE_EXP);
		var linesNum = match ? match.length + 1 : 1;
		var lineNumbersWrapper;

		var lines = new Array(linesNum + 1);
		lines = lines.join('<span></span>');

		lineNumbersWrapper = document.createElement('span');
		lineNumbersWrapper.setAttribute('aria-hidden', 'true');
		lineNumbersWrapper.className = 'line-numbers-rows';
		lineNumbersWrapper.innerHTML = lines;

		if (pre.hasAttribute('data-start')) {
			pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
		}

		env.element.appendChild(lineNumbersWrapper);

		_resizeElement(pre);

		Prism.hooks.run('line-numbers', env);
	});

	Prism.hooks.add('line-numbers', function (env) {
		env.plugins = env.plugins || {};
		env.plugins.lineNumbers = true;
	});
	
	/**
	 * Global exports
	 */
	Prism.plugins.lineNumbers = {
		/**
		 * Get node for provided line number
		 * @param {Element} element pre element
		 * @param {Number} number line number
		 * @return {Element|undefined}
		 */
		getLine: function (element, number) {
			if (element.tagName !== 'PRE' || !element.classList.contains(PLUGIN_NAME)) {
				return;
			}

			var lineNumberRows = element.querySelector('.line-numbers-rows');
			var lineNumberStart = parseInt(element.getAttribute('data-start'), 10) || 1;
			var lineNumberEnd = lineNumberStart + (lineNumberRows.children.length - 1);

			if (number < lineNumberStart) {
				number = lineNumberStart;
			}
			if (number > lineNumberEnd) {
				number = lineNumberEnd;
			}

			var lineIndex = number - lineNumberStart;

			return lineNumberRows.children[lineIndex];
		}
	};

}());

/***/ }),
/* 72 */
/*!**********************************!*\
  !*** ./scripts/app/app.share.js ***!
  \**********************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports) {

/*
* @package godofredoninja
* Share social media
*/

var mapacheShare = function mapacheShare(elem) {
  this.elem = elem;
};

/**
 * @description Helper to get the attribute of a DOM element
 * @param {String} attr DOM element attribute
 * @returns {String|Empty} returns the attr value or empty string
 */
mapacheShare.prototype.mapacheValue = function mapacheValue (a) {
  var val = this.elem.attr(("mapache-" + a));
  return (val === undefined || val === null) ? false : val;
};

/**
 * @description Main share event. Will pop a window or redirect to a link
 */
mapacheShare.prototype.mapacheShare = function mapacheShare () {
  var socialMediaName = this.mapacheValue('share').toLowerCase();

  var socialMedia = {
    facebook: {
      shareUrl: 'https://www.facebook.com/sharer.php',
      params: {
        u: this.mapacheValue('url'),
      },
    },
    twitter: {
      shareUrl: 'https://twitter.com/intent/tweet/',
      params: {
        text: this.mapacheValue('title'),
        url: this.mapacheValue('url'),
      },
    },
    reddit: {
      shareUrl: 'https://www.reddit.com/submit',
      params: {
        url: this.mapacheValue('url'),
      },
    },
    pinterest: {
      shareUrl: 'https://www.pinterest.com/pin/create/button/',
      params: {
        url: this.mapacheValue('url'),
        description: this.mapacheValue('title'),
      },
    },
    linkedin: {
      shareUrl: 'https://www.linkedin.com/shareArticle',
      params: {
        url: this.mapacheValue('url'),
        mini: true,
      },
    },
    pocket: {
      shareUrl: 'https://getpocket.com/save',
      params: {
        url: this.mapacheValue('url'),
      },
    },
  };

  var social = socialMedia[socialMediaName];

  return social !== undefined ? this.mapachePopup(social) : false;
};

/* windows Popup */
mapacheShare.prototype.mapachePopup = function mapachePopup (share) {
  var p = share.params || {};
  var keys = Object.keys(p);

  var socialMediaUrl = share.shareUrl;
  var str = keys.length > 0 ? '?' : '';

  for (var i in keys) {
    if (str !== '?') {
      str += '&';
    }
    if (p[keys[i]]) {
      str += (keys[i]) + "=" + (encodeURIComponent(p[keys[i]]));
    }
  }

  socialMediaUrl += str;

  if (!share.isLink) {
    var popWidth = 600;
    var popHeight = 480;
    var left = ((window.innerWidth / 2) - (popWidth / 2)) + window.screenX;
    var top = ((window.innerHeight / 2) - (popHeight / 2)) + window.screenY;

    var popParams = "scrollbars=no, width=" + popWidth + ", height=" + popHeight + ", top=" + top + ", left=" + left;
    var newWindow = window.open(socialMediaUrl, '', popParams);

    if (window.focus) {
      newWindow.focus();
    }
  } else {
    window.location.href = socialMediaUrl;
  }
};

/* Export Class */
module.exports = mapacheShare;


/***/ }),
/* 73 */
/*!*********************************!*\
  !*** ./scripts/routes/video.js ***!
  \*********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {// const $postBody = $('.post-body');
var $videoPostFormat = $('.video-post-format');

/* Iframe SRC video */
var iframeVideo = [
  'iframe[src*="player.vimeo.com"]',
  'iframe[src*="dailymotion.com"]',
  'iframe[src*="youtube.com"]',
  'iframe[src*="youtube-nocookie.com"]',
  'iframe[src*="vid.me"]',
  'iframe[src*="kickstarter.com"][src*="video.html"]' ];

/* unused harmony default export */ var _unused_webpack_default_export = ({
  init: function init() {
    // video Large in tOP
    var firstVideo = $('.post-body').find(iframeVideo.join(','))[0];
    $(firstVideo).parent('.video-responsive').appendTo($videoPostFormat);

    if (typeof youtubeChannelName !== 'undefined' && typeof youtubeChannelID !== 'undefined') {
      /*eslint-disable */
      var template = "<div class=\"video-subscribe u-flex u-h-b-md\" style=\"margin-bottom:16px\">\n        <span class=\"channel-name\" style=\"margin-right:16px\">Subscribe to " + youtubeChannelName + "</span>\n        <div class=\"g-ytsubscribe\" data-channelid=\"" + youtubeChannelID + "\" data-layout=\"default\" data-count=\"default\"></div>\n      </div>";
      /*eslint-enable */

      $videoPostFormat.append(template);

      var go = document.createElement('script');
      go.type = 'text/javascript';
      go.async = true;
      go.src = 'https://apis.google.com/js/platform.js';
      // document.body.appendChild(go);
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(go, s);
    }
  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 74 */
/*!*********************************!*\
  !*** ./scripts/routes/audio.js ***!
  \*********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {// const $postBody = $('.post-body');
var $audioPostFormat = $('.audio-post-format');

/* Iframe src audio */
var iframeAudio = [
  'iframe[src*="w.soundcloud.com"]',
  'iframe[src*="soundcloud.com"]',
  'iframe[src*="embed.spotify.com"]',
  'iframe[src*="spotify.com"]',
  'iframe[src*="mixcloud.com"]' ];

/* unused harmony default export */ var _unused_webpack_default_export = ({
  init: function init() {
    var firstAudio = $('.post-body').find(iframeAudio.join(','))[0];

    $audioPostFormat.removeClass('u-hide');
    $(firstAudio).appendTo($audioPostFormat);
  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 40)))

/***/ }),
/* 75 */
/*!*************************************************************************************************!*\
  !*** ../node_modules/css-loader?{"sourceMap":true}!../node_modules/normalize.css/normalize.css ***!
  \*************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../css-loader/lib/css-base.js */ 1)(true);
// imports


// module
exports.push([module.i, "/*! normalize.css v6.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in\n *    IE on Windows Phone and in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -ms-text-size-adjust: 100%; /* 2 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption,\nfigure,\nmain { /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent; /* 1 */\n  -webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57- and Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  margin: 0;\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  display: inline-block; /* 1 */\n  vertical-align: baseline; /* 2 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails, /* 1 */\nmenu {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Scripting\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n  display: none;\n}\n\n/* Hidden\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n  display: none;\n}\n", "", {"version":3,"sources":["C:/Users/Smigol/projects/ghost/content/themes/mapache/node_modules/normalize.css/normalize.css"],"names":[],"mappings":"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","file":"normalize.css","sourcesContent":["/*! normalize.css v6.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in\n *    IE on Windows Phone and in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -ms-text-size-adjust: 100%; /* 2 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption,\nfigure,\nmain { /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent; /* 1 */\n  -webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57- and Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  margin: 0;\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  display: inline-block; /* 1 */\n  vertical-align: baseline; /* 2 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails, /* 1 */\nmenu {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Scripting\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n  display: none;\n}\n\n/* Hidden\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n  display: none;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 76 */
/*!**********************************************************************************************!*\
  !*** ../node_modules/css-loader?{"sourceMap":true}!../node_modules/prismjs/themes/prism.css ***!
  \**********************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../css-loader/lib/css-base.js */ 1)(true);
// imports


// module
exports.push([module.i, "/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tcolor: black;\n\tbackground: none;\n\ttext-shadow: 0 1px white;\n\tfont-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n\ttext-align: left;\n\twhite-space: pre;\n\tword-spacing: normal;\n\tword-break: normal;\n\tword-wrap: normal;\n\tline-height: 1.5;\n\n\t-moz-tab-size: 4;\n\t-o-tab-size: 4;\n\ttab-size: 4;\n\n\t-webkit-hyphens: none;\n\t-moz-hyphens: none;\n\t-ms-hyphens: none;\n\thyphens: none;\n}\n\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\n@media print {\n\tcode[class*=\"language-\"],\n\tpre[class*=\"language-\"] {\n\t\ttext-shadow: none;\n\t}\n}\n\n/* Code blocks */\npre[class*=\"language-\"] {\n\tpadding: 1em;\n\tmargin: .5em 0;\n\toverflow: auto;\n}\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tbackground: #f5f2f0;\n}\n\n/* Inline code */\n:not(pre) > code[class*=\"language-\"] {\n\tpadding: .1em;\n\tborder-radius: .3em;\n\twhite-space: normal;\n}\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n\tcolor: slategray;\n}\n\n.token.punctuation {\n\tcolor: #999;\n}\n\n.namespace {\n\topacity: .7;\n}\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n\tcolor: #905;\n}\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n\tcolor: #690;\n}\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n\tcolor: #a67f59;\n\tbackground: hsla(0, 0%, 100%, .5);\n}\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n\tcolor: #07a;\n}\n\n.token.function {\n\tcolor: #DD4A68;\n}\n\n.token.regex,\n.token.important,\n.token.variable {\n\tcolor: #e90;\n}\n\n.token.important,\n.token.bold {\n\tfont-weight: bold;\n}\n.token.italic {\n\tfont-style: italic;\n}\n\n.token.entity {\n\tcursor: help;\n}\n", "", {"version":3,"sources":["C:/Users/Smigol/projects/ghost/content/themes/mapache/node_modules/prismjs/themes/prism.css"],"names":[],"mappings":"AAAA;;;;GAIG;;AAEH;;CAEC,aAAa;CACb,iBAAiB;CACjB,yBAAyB;CACzB,uEAAuE;CACvE,iBAAiB;CACjB,iBAAiB;CACjB,qBAAqB;CACrB,mBAAmB;CACnB,kBAAkB;CAClB,iBAAiB;;CAEjB,iBAAiB;CACjB,eAAe;CACf,YAAY;;CAEZ,sBAAsB;CACtB,mBAAmB;CACnB,kBAAkB;CAClB,cAAc;CACd;;AAED;;CAEC,kBAAkB;CAClB,oBAAoB;CACpB;;AAED;;CAEC,kBAAkB;CAClB,oBAAoB;CACpB;;AAED;CACC;;EAEC,kBAAkB;EAClB;CACD;;AAED,iBAAiB;AACjB;CACC,aAAa;CACb,eAAe;CACf,eAAe;CACf;;AAED;;CAEC,oBAAoB;CACpB;;AAED,iBAAiB;AACjB;CACC,cAAc;CACd,oBAAoB;CACpB,oBAAoB;CACpB;;AAED;;;;CAIC,iBAAiB;CACjB;;AAED;CACC,YAAY;CACZ;;AAED;CACC,YAAY;CACZ;;AAED;;;;;;;CAOC,YAAY;CACZ;;AAED;;;;;;CAMC,YAAY;CACZ;;AAED;;;;;CAKC,eAAe;CACf,kCAAkC;CAClC;;AAED;;;CAGC,YAAY;CACZ;;AAED;CACC,eAAe;CACf;;AAED;;;CAGC,YAAY;CACZ;;AAED;;CAEC,kBAAkB;CAClB;AACD;CACC,mBAAmB;CACnB;;AAED;CACC,aAAa;CACb","file":"prism.css","sourcesContent":["/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tcolor: black;\n\tbackground: none;\n\ttext-shadow: 0 1px white;\n\tfont-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n\ttext-align: left;\n\twhite-space: pre;\n\tword-spacing: normal;\n\tword-break: normal;\n\tword-wrap: normal;\n\tline-height: 1.5;\n\n\t-moz-tab-size: 4;\n\t-o-tab-size: 4;\n\ttab-size: 4;\n\n\t-webkit-hyphens: none;\n\t-moz-hyphens: none;\n\t-ms-hyphens: none;\n\thyphens: none;\n}\n\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\n@media print {\n\tcode[class*=\"language-\"],\n\tpre[class*=\"language-\"] {\n\t\ttext-shadow: none;\n\t}\n}\n\n/* Code blocks */\npre[class*=\"language-\"] {\n\tpadding: 1em;\n\tmargin: .5em 0;\n\toverflow: auto;\n}\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tbackground: #f5f2f0;\n}\n\n/* Inline code */\n:not(pre) > code[class*=\"language-\"] {\n\tpadding: .1em;\n\tborder-radius: .3em;\n\twhite-space: normal;\n}\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n\tcolor: slategray;\n}\n\n.token.punctuation {\n\tcolor: #999;\n}\n\n.namespace {\n\topacity: .7;\n}\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n\tcolor: #905;\n}\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n\tcolor: #690;\n}\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n\tcolor: #a67f59;\n\tbackground: hsla(0, 0%, 100%, .5);\n}\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n\tcolor: #07a;\n}\n\n.token.function {\n\tcolor: #DD4A68;\n}\n\n.token.regex,\n.token.important,\n.token.variable {\n\tcolor: #e90;\n}\n\n.token.important,\n.token.bold {\n\tfont-weight: bold;\n}\n.token.italic {\n\tfont-style: italic;\n}\n\n.token.entity {\n\tcursor: help;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 77 */
/*!***************************!*\
  !*** ./fonts/mapache.ttf ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.ttf";

/***/ }),
/* 78 */
/*!****************************!*\
  !*** ./fonts/mapache.woff ***!
  \****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.woff";

/***/ }),
/* 79 */
/*!***************************!*\
  !*** ./fonts/mapache.svg ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.svg";

/***/ }),
/* 80 */
/*!***************************!*\
  !*** ./images/avatar.png ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJsAAACbBAMAAACHT/S/AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURSQmKMze6LfH0KSyusXX4HJ8gjY6PCotL5ShqVJYXWJqb4SPlkNJTCjFRkAAAALPSURBVGje7dm/b9NAFAfwp4Q4P4cSu+C0GeIBCmLq0EqtGOKBFpjCyhQQA0IdAqIDTCnqH9Ay0AoxOEJISDAEdWWoBAOCfwoJicSx793de3ciRLrvH/CR7853vvcMF21mCRznOMc5znGO+9+48POgvPfhlSWueQ5/8uQstsFdhb/xfh6acwmkcmrKBYM0Bz8MuRBm882MW8lwcM+IG2a5asTnNt5BLg/Z3DII4kVcLhFx8J3JhUINakxuR8xBxOPGCDdicUEf4Z6zOGTqAIosroVxJRbXxbgqixtiXJnFJRgH6wwuc9Kl84XB+agGxwxuGeeeMrgWzhUY3CWcqzC4Ls7VGVwH50qOW2Sua5dbsvveXf5nXGX+e9Yy18a54vy5TcnKxmROcrbjdzKc68i4Opkby7gqmevJuIZdzrM72Ma8524o42p2X5QSmduVcRUy15ZxBbub7AGZ82XciMyhVYXsNis5oHr0TSHjdu0e7v4bZLjlPc5VG32+OrMAXaFWeHLOp9afiuK9T6t5VNyY9JYouQ6t/FRxLVKNouRCUkGm5IT79oDfNBLsWy/mcx3aSqi4Nm0lVFxIWwkVJ1iLA5N2YI+yJ9TcGuF00uBy37NHRlxzoNvz0GulZiavEZtxO7rNMVYbemTac+8RxqrBtXR7xnpckOi1jPW4a/fPU9zbM5OVDTZOcpvsE7vnfuNE+CX7GHO45lfsxvPikM7dPsJvUOX3VO6K7LYI8CsmcdugyH5M4LZAmf1Im9PQAF5GmpyWJnw+EaepieZPwG0DsL08twWEZMeb40habj2y3E0gphZJuOtAzsz8zXK3gJHHGOf3ORy8RrgxSwNvXcjdBWbqIi444nLTf7Yp7g5bm15wU1zC5yZ3yCm3aqDBsxy3ZsI1cpzJWCejnXCSv2I6Oc5wTSMNLmQ434wrOM5xjlNwq2ZccaG40L0ojltc7jd/xjH1yBzj+wAAAABJRU5ErkJggg=="

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map
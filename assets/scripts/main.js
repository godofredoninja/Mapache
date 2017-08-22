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
/******/ 	var hotCurrentHash = "20f66b04e1b1d7ccb392"; // eslint-disable-line no-unused-vars
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
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
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
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
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
/******/ 								orginalError: err
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
/******/ 	return hotCreateRequire(1)(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/*!****************************************************************************************!*\
  !*** multi ./build/util/../helpers/hmr-client.js ./scripts/main.js ./styles/main.scss ***!
  \****************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Users\Smigol\Projects\joder\content\themes\Mapache\src\build\util/../helpers/hmr-client.js */2);
__webpack_require__(/*! ./scripts/main.js */3);
module.exports = __webpack_require__(/*! ./styles/main.scss */4);


/***/ }),
/* 2 */
/*!*************************************!*\
  !*** ./build/helpers/hmr-client.js ***!
  \*************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var hotMiddlewareScript = __webpack_require__(/*! webpack-hot-middleware/client?noInfo=true&timeout=20000&reload=true */ 8);

hotMiddlewareScript.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload();
  }
});


/***/ }),
/* 3 */
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/*! exports provided:  */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prismjs__ = __webpack_require__(/*! prismjs */ 21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prismjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prismjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader__ = __webpack_require__(/*! prismjs/plugins/autoloader/prism-autoloader */ 23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers__ = __webpack_require__(/*! prismjs/plugins/line-numbers/prism-line-numbers */ 24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_sticky_kit_dist_sticky_kit__ = __webpack_require__(/*! sticky-kit/dist/sticky-kit */ 25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_sticky_kit_dist_sticky_kit___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_sticky_kit_dist_sticky_kit__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jquery_lazyload__ = __webpack_require__(/*! jquery-lazyload */ 26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jquery_lazyload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_jquery_lazyload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__autoload_jquery_ghostHunter_js__ = __webpack_require__(/*! ./autoload/jquery.ghostHunter.js */ 27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__autoload_jquery_ghostHunter_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__autoload_jquery_ghostHunter_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__autoload_pagination_js__ = __webpack_require__(/*! ./autoload/pagination.js */ 29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__autoload_pagination_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__autoload_pagination_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__util_Router__ = __webpack_require__(/*! ./util/Router */ 30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__routes_common__ = __webpack_require__(/*! ./routes/common */ 32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__routes_home__ = __webpack_require__(/*! ./routes/home */ 33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__routes_post__ = __webpack_require__(/*! ./routes/post */ 34);
// import external dependencies
// import 'jquery';






// Import everything from autoload
 

// import local dependencies





/** Populate Router instance with DOM routes */
var routes = new __WEBPACK_IMPORTED_MODULE_7__util_Router__[false /* default */]({
  // All pages
  common: __WEBPACK_IMPORTED_MODULE_8__routes_common__[false /* default */],
  // Home page
  home: __WEBPACK_IMPORTED_MODULE_9__routes_home__[false /* default */],
  // article
  isArticle: __WEBPACK_IMPORTED_MODULE_10__routes_post__[false /* default */],
});

// Load Events
$(document).on('ready', function () { return routes.loadEvents(); });

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 4 */
/*!**************************!*\
  !*** ./styles/main.scss ***!
  \**************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 5);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ 41)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 5, function() {
			var newContent = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 5);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../node_modules/cache-loader/dist/cjs.js!../node_modules/css-loader?{"sourceMap":true}!../node_modules/postcss-loader/lib?{"config":{"path":"C://Users//Smigol//Projects//joder//content//themes//Mapache//src//build","ctx":{"open":true,"copy":"images/**_/*","proxyUrl":"http://localhost:3000","cacheBusting":"[name]_[hash:8]","paths":{"root":"C://Users//Smigol//Projects//joder//content//themes//Mapache","assets":"C://Users//Smigol//Projects//joder//content//themes//Mapache//src","dist":"C://Users//Smigol//Projects//joder//content//themes//Mapache//assets"},"enabled":{"sourceMaps":true,"optimize":false,"cacheBusting":false,"watcher":true},"watch":"**_/*.hbs","entry":{"main":["./scripts/main.js","./styles/main.scss"]},"publicPath":"/assets/","devUrl":"http://localhost:2368","env":{"production":false,"development":true},"manifest":{}}},"sourceMap":true}!../node_modules/resolve-url-loader?{"sourceMap":true}!../node_modules/sass-loader/lib/loader.js?{"sourceMap":true}!../node_modules/import-glob!./styles/main.scss ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ 6)(true);
// imports
exports.i(__webpack_require__(/*! -!../../node_modules/css-loader?{"sourceMap":true}!normalize.css/normalize.css */ 35), "");
exports.i(__webpack_require__(/*! -!../../node_modules/css-loader?{"sourceMap":true}!prismjs/themes/prism.css */ 36), "");

// module
exports.push([module.i, "@charset \"UTF-8\";\n\npre.line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber;\n}\n\npre.line-numbers > code {\n  position: relative;\n}\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber;\n}\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right;\n}\n\n@font-face {\n  font-family: 'mapache';\n  src: url(" + __webpack_require__(/*! ./../fonts/mapache.ttf */ 37) + ") format(\"truetype\"), url(" + __webpack_require__(/*! ./../fonts/mapache.woff */ 38) + ") format(\"woff\"), url(" + __webpack_require__(/*! ./../fonts/mapache.svg */ 39) + ") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n\n[class^=\"i-\"]:before,\n[class*=\" i-\"]:before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.i-navigate_before:before {\n  content: \"\\E408\";\n}\n\n.i-navigate_next:before {\n  content: \"\\E409\";\n}\n\n.i-tag:before {\n  content: \"\\E54E\";\n}\n\n.i-keyboard_arrow_down:before {\n  content: \"\\E313\";\n}\n\n.i-arrow_upward:before {\n  content: \"\\E5D8\";\n}\n\n.i-cloud_download:before {\n  content: \"\\E2C0\";\n}\n\n.i-star:before {\n  content: \"\\E838\";\n}\n\n.i-keyboard_arrow_up:before {\n  content: \"\\E316\";\n}\n\n.i-open_in_new:before {\n  content: \"\\E89E\";\n}\n\n.i-warning:before {\n  content: \"\\E002\";\n}\n\n.i-back:before {\n  content: \"\\E5C4\";\n}\n\n.i-forward:before {\n  content: \"\\E5C8\";\n}\n\n.i-chat:before {\n  content: \"\\E0CB\";\n}\n\n.i-close:before {\n  content: \"\\E5CD\";\n}\n\n.i-code2:before {\n  content: \"\\E86F\";\n}\n\n.i-favorite:before {\n  content: \"\\E87D\";\n}\n\n.i-link:before {\n  content: \"\\E157\";\n}\n\n.i-menu:before {\n  content: \"\\E5D2\";\n}\n\n.i-feed:before {\n  content: \"\\E0E5\";\n}\n\n.i-search:before {\n  content: \"\\E8B6\";\n}\n\n.i-share:before {\n  content: \"\\E80D\";\n}\n\n.i-check_circle:before {\n  content: \"\\E86C\";\n}\n\n.i-play:before {\n  content: \"\\E901\";\n}\n\n.i-download:before {\n  content: \"\\E900\";\n}\n\n.i-code:before {\n  content: \"\\F121\";\n}\n\n.i-behance:before {\n  content: \"\\F1B4\";\n}\n\n.i-spotify:before {\n  content: \"\\F1BC\";\n}\n\n.i-codepen:before {\n  content: \"\\F1CB\";\n}\n\n.i-github:before {\n  content: \"\\F09B\";\n}\n\n.i-linkedin:before {\n  content: \"\\F0E1\";\n}\n\n.i-flickr:before {\n  content: \"\\F16E\";\n}\n\n.i-dribbble:before {\n  content: \"\\F17D\";\n}\n\n.i-pinterest:before {\n  content: \"\\F231\";\n}\n\n.i-map:before {\n  content: \"\\F041\";\n}\n\n.i-twitter:before {\n  content: \"\\F099\";\n}\n\n.i-facebook:before {\n  content: \"\\F09A\";\n}\n\n.i-youtube:before {\n  content: \"\\F16A\";\n}\n\n.i-instagram:before {\n  content: \"\\F16D\";\n}\n\n.i-google:before {\n  content: \"\\F1A0\";\n}\n\n.i-pocket:before {\n  content: \"\\F265\";\n}\n\n.i-reddit:before {\n  content: \"\\F281\";\n}\n\n.i-snapchat:before {\n  content: \"\\F2AC\";\n}\n\n/*\r\n@package godofredoninja\r\n\r\n========================================================================\r\nMapache variables styles\r\n========================================================================\r\n*/\n\n/**\r\n* Table of Contents:\r\n*\r\n*   1. Colors\r\n*   2. Fonts\r\n*   3. Typography\r\n*   4. Header\r\n*   5. Footer\r\n*   6. Code Syntax\r\n*   7. buttons\r\n*   8. container\r\n*   9. Grid\r\n*   10. Media Query Ranges\r\n*   11. Icons\r\n*/\n\n/* 1. Colors\r\n========================================================================== */\n\n/* 2. Fonts\r\n========================================================================== */\n\n/* 3. Typography\r\n========================================================================== */\n\n/* 4. Header\r\n========================================================================== */\n\n/* 5. Entry articles\r\n========================================================================== */\n\n/* 5. Footer\r\n========================================================================== */\n\n/* 6. Code Syntax\r\n========================================================================== */\n\n/* 7. buttons\r\n========================================================================== */\n\n/* 8. container\r\n========================================================================== */\n\n/* 9. Grid\r\n========================================================================== */\n\n/* 10. Media Query Ranges\r\n========================================================================== */\n\n/* 11. icons\r\n========================================================================== */\n\n.header.toolbar-shadow {\n  -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n          box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n}\n\na.external::after,\nhr::before,\n.warning:before,\n.note:before,\n.success:before,\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after,\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.u-clear:after {\n  clear: both;\n  content: \"\";\n  display: table;\n}\n\n.u-not-avatar {\n  background-image: url(" + __webpack_require__(/*! ./../images/avatar.png */ 40) + ");\n}\n\n.u-b-b,\n.sidebar-title {\n  border-bottom: solid 1px #eee;\n}\n\n.u-b-t {\n  border-top: solid 1px #eee;\n}\n\n.u-p-t-2 {\n  padding-top: 2rem;\n}\n\n.u-unstyled {\n  list-style-type: none;\n  margin: 0;\n  padding-left: 0;\n}\n\n.u-floatLeft {\n  float: left !important;\n}\n\n.u-floatRight {\n  float: right !important;\n}\n\n.u-flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n}\n\n.u-flex-wrap {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n\n.u-flex-center,\n.header-logo,\n.header-follow a,\n.header-menu a {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n.u-flex-aling-right {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n\n.u-flex-aling-center {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n\n.u-m-t-1 {\n  margin-top: 1rem;\n}\n\n/* Tags\r\n========================================================================== */\n\n.u-tags {\n  font-size: 12px !important;\n  margin: 3px !important;\n  color: #4c5765 !important;\n  background-color: #ebebeb !important;\n  -webkit-transition: all .3s;\n  -o-transition: all .3s;\n  transition: all .3s;\n}\n\n.u-tags:before {\n  padding-right: 5px;\n  opacity: .8;\n}\n\n.u-tags:hover {\n  background-color: #4285f4 !important;\n  color: #fff !important;\n}\n\n.u-hide {\n  display: none !important;\n}\n\n@media only screen and (max-width: 766px) {\n  .u-h-b-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  .u-h-b-lg {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  .u-h-a-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .u-h-a-lg {\n    display: none !important;\n  }\n}\n\nhtml {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  font-size: 16px;\n  -webkit-tap-highlight-color: transparent;\n}\n\n*,\n*::before,\n*::after {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\na {\n  color: #039be5;\n  outline: 0;\n  text-decoration: none;\n  -webkit-tap-highlight-color: transparent;\n}\n\na:focus {\n  text-decoration: none;\n}\n\na.external::after {\n  content: \"\\E89E\";\n  margin-left: 5px;\n}\n\nbody {\n  color: #333;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 0 auto;\n}\n\nfigure {\n  margin: 0;\n}\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n}\n\nimg:not([src]) {\n  visibility: hidden;\n}\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n\ni {\n  display: inline-block;\n  vertical-align: middle;\n}\n\nhr {\n  background: #F1F2F1;\n  background: -webkit-gradient(linear, left top, right top, color-stop(0, #F1F2F1), color-stop(50%, #b5b5b5), to(#F1F2F1));\n  background: -webkit-linear-gradient(left, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  background: -o-linear-gradient(left, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  background: linear-gradient(to right, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  border: none;\n  height: 1px;\n  margin: 80px auto;\n  max-width: 90%;\n  position: relative;\n}\n\nhr::before {\n  background: #fff;\n  color: rgba(73, 55, 65, 0.75);\n  content: \"\\F121\";\n  display: block;\n  font-size: 35px;\n  left: 50%;\n  padding: 0 25px;\n  position: absolute;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n       -o-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n}\n\nblockquote {\n  border-left: 4px solid #4285f4;\n  padding: .75rem 1.5rem;\n  background: #fbfbfc;\n  color: #757575;\n  font-size: 1.125rem;\n  line-height: 1.7;\n  margin: 0 0 1.25rem;\n  quotes: none;\n}\n\nol,\nul,\nblockquote {\n  margin-left: 2rem;\n}\n\nstrong {\n  font-weight: 500;\n}\n\nsmall,\n.small {\n  font-size: 85%;\n}\n\nol {\n  padding-left: 40px;\n  list-style: decimal outside;\n}\n\nmark {\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#ebf2fe), to(#d3e2fc));\n  background-image: -webkit-linear-gradient(top, #ebf2fe, #d3e2fc);\n  background-image: -o-linear-gradient(top, #ebf2fe, #d3e2fc);\n  background-image: linear-gradient(to bottom, #ebf2fe, #d3e2fc);\n  background-color: transparent;\n}\n\n.footer,\n.main {\n  -webkit-transition: -webkit-transform .5s ease;\n  transition: -webkit-transform .5s ease;\n  -o-transition: -o-transform .5s ease;\n  transition: transform .5s ease;\n  transition: transform .5s ease, -webkit-transform .5s ease, -o-transform .5s ease;\n  z-index: 2;\n}\n\n/* Code Syntax\n========================================================================== */\n\nkbd,\nsamp,\ncode {\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  color: #c7254e;\n  background: #f7f7f7;\n  border-radius: 4px;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\ncode[class*=language-],\npre[class*=language-] {\n  color: #37474f;\n  line-height: 1.5;\n}\n\ncode[class*=language-] .token.comment,\npre[class*=language-] .token.comment {\n  opacity: .8;\n}\n\ncode[class*=language-].line-numbers,\npre[class*=language-].line-numbers {\n  padding-left: 58px;\n}\n\ncode[class*=language-].line-numbers::before,\npre[class*=language-].line-numbers::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  background: #F0EDEE;\n  width: 40px;\n  height: 100%;\n}\n\ncode[class*=language-] .line-numbers-rows,\npre[class*=language-] .line-numbers-rows {\n  border-right: none;\n  top: -3px;\n  left: -58px;\n}\n\ncode[class*=language-] .line-numbers-rows > span::before,\npre[class*=language-] .line-numbers-rows > span::before {\n  padding-right: 0;\n  text-align: center;\n  opacity: .8;\n}\n\npre {\n  background-color: #f7f7f7 !important;\n  padding: 1rem;\n  overflow: hidden;\n  border-radius: 4px;\n  word-wrap: normal;\n  margin: 2.5rem 0 !important;\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  position: relative;\n}\n\npre code {\n  color: #37474f;\n  text-shadow: 0 1px #fff;\n  padding: 0;\n  background: transparent;\n}\n\n/* .warning & .note & .success\n========================================================================== */\n\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n}\n\n.warning:before {\n  content: \"\\E002\";\n}\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n}\n\n.note:before {\n  content: \"\\E838\";\n}\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n}\n\n.success:before {\n  content: \"\\E86C\";\n  color: #00bfa5;\n}\n\n.warning,\n.note,\n.success {\n  display: block;\n  margin: 1rem 0;\n  font-size: 1rem;\n  padding: 12px 24px 12px 60px;\n  line-height: 1.5;\n}\n\n.warning a,\n.note a,\n.success a {\n  text-decoration: underline;\n  color: inherit;\n}\n\n.warning:before,\n.note:before,\n.success:before {\n  margin-left: -36px;\n  float: left;\n  font-size: 24px;\n}\n\n/* Social icon color and background\n========================================================================== */\n\n.c-facebook {\n  color: #3b5998;\n}\n\n.bg-facebook,\n.nav-mob-follow .i-facebook {\n  background-color: #3b5998 !important;\n}\n\n.c-twitter {\n  color: #55acee;\n}\n\n.bg-twitter,\n.nav-mob-follow .i-twitter {\n  background-color: #55acee !important;\n}\n\n.c-google {\n  color: #dd4b39;\n}\n\n.bg-google,\n.nav-mob-follow .i-google {\n  background-color: #dd4b39 !important;\n}\n\n.c-instagram {\n  color: #306088;\n}\n\n.bg-instagram,\n.nav-mob-follow .i-instagram {\n  background-color: #306088 !important;\n}\n\n.c-youtube {\n  color: #e52d27;\n}\n\n.bg-youtube,\n.nav-mob-follow .i-youtube {\n  background-color: #e52d27 !important;\n}\n\n.c-github {\n  color: #333333;\n}\n\n.bg-github,\n.nav-mob-follow .i-github {\n  background-color: #333333 !important;\n}\n\n.c-linkedin {\n  color: #007bb6;\n}\n\n.bg-linkedin,\n.nav-mob-follow .i-linkedin {\n  background-color: #007bb6 !important;\n}\n\n.c-spotify {\n  color: #2ebd59;\n}\n\n.bg-spotify,\n.nav-mob-follow .i-spotify {\n  background-color: #2ebd59 !important;\n}\n\n.c-codepen {\n  color: #222222;\n}\n\n.bg-codepen,\n.nav-mob-follow .i-codepen {\n  background-color: #222222 !important;\n}\n\n.c-behance {\n  color: #131418;\n}\n\n.bg-behance,\n.nav-mob-follow .i-behance {\n  background-color: #131418 !important;\n}\n\n.c-dribbble {\n  color: #ea4c89;\n}\n\n.bg-dribbble,\n.nav-mob-follow .i-dribbble {\n  background-color: #ea4c89 !important;\n}\n\n.c-flickr {\n  color: #0063DC;\n}\n\n.bg-flickr,\n.nav-mob-follow .i-flickr {\n  background-color: #0063DC !important;\n}\n\n.c-reddit {\n  color: orangered;\n}\n\n.bg-reddit,\n.nav-mob-follow .i-reddit {\n  background-color: orangered !important;\n}\n\n.c-pocket {\n  color: #F50057;\n}\n\n.bg-pocket,\n.nav-mob-follow .i-pocket {\n  background-color: #F50057 !important;\n}\n\n.c-pinterest {\n  color: #bd081c;\n}\n\n.bg-pinterest,\n.nav-mob-follow .i-pinterest {\n  background-color: #bd081c !important;\n}\n\n.c-feed {\n  color: orange;\n}\n\n.bg-feed,\n.nav-mob-follow .i-feed {\n  background-color: orange !important;\n}\n\n.clear:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n/* pagination Infinite scroll\n========================================================================== */\n\n.mapache-load-more {\n  border: solid 1px #C3C3C3;\n  color: #7D7D7D;\n  display: block;\n  font-size: 15px;\n  height: 45px;\n  margin: 4rem auto;\n  padding: 11px 16px;\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n.mapache-load-more:hover {\n  background: #4285f4;\n  border-color: #4285f4;\n  color: #fff;\n}\n\n.pagination-nav {\n  padding: 2.5rem 0 3rem;\n  text-align: center;\n}\n\n.pagination-nav .page-number {\n  display: none;\n  padding-top: 5px;\n}\n\n@media only screen and (min-width: 766px) {\n  .pagination-nav .page-number {\n    display: inline-block;\n  }\n}\n\n.pagination-nav .newer-posts {\n  float: left;\n}\n\n.pagination-nav .older-posts {\n  float: right;\n}\n\n/* Scroll Top\n========================================================================== */\n\n.scroll_top {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  z-index: 11;\n  width: 60px;\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transition: opacity 0.5s ease;\n  -o-transition: opacity 0.5s ease;\n  transition: opacity 0.5s ease;\n}\n\n.scroll_top.visible {\n  opacity: 1;\n  visibility: visible;\n}\n\n.scroll_top:hover svg path {\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n.svg-icon svg {\n  width: 100%;\n  height: auto;\n  display: block;\n  fill: currentcolor;\n}\n\n/* Video Responsive\n========================================================================== */\n\n.video-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n  padding-bottom: 56.25%;\n  margin-bottom: 1.5rem;\n}\n\n.video-responsive iframe {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  border: 0;\n}\n\n/* Video full for tag video\n========================================================================== */\n\n#video-format .video-content {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding-bottom: 1rem;\n}\n\n#video-format .video-content span {\n  display: inline-block;\n  vertical-align: middle;\n  margin-right: .8rem;\n}\n\n/* Page error 404\n========================================================================== */\n\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n  height: 100vh;\n  position: relative;\n  width: 100%;\n}\n\n.errorPage-title {\n  padding: 24px 60px;\n}\n\n.errorPage-link {\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 22px;\n  font-weight: 500;\n  left: -5px;\n  position: relative;\n  text-rendering: optimizeLegibility;\n  top: -6px;\n}\n\n.errorPage-emoji {\n  color: rgba(0, 0, 0, 0.4);\n  font-size: 150px;\n}\n\n.errorPage-text {\n  color: rgba(0, 0, 0, 0.4);\n  line-height: 21px;\n  margin-top: 60px;\n  white-space: pre-wrap;\n}\n\n.errorPage-wrap {\n  display: block;\n  left: 50%;\n  min-width: 680px;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n       -o-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n}\n\n/* Post Twitter facebook card embed Css Center\n========================================================================== */\n\niframe[src*=\"facebook.com\"],\n.fb-post,\n.twitter-tweet {\n  display: block !important;\n  margin: 1.5rem 0 !important;\n}\n\n.container {\n  margin: 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n  width: 100%;\n}\n\n@media only screen and (min-width: 1230px) {\n  .container {\n    max-width: 1200px;\n  }\n}\n\n.margin-top {\n  margin-top: 50px;\n  padding-top: 1rem;\n}\n\n@media only screen and (min-width: 766px) {\n  .margin-top {\n    padding-top: 1.8rem;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  .content {\n    -webkit-box-flex: 1 !important;\n        -ms-flex: 1 !important;\n            flex: 1 !important;\n    max-width: calc(100% - 300px) !important;\n    -webkit-box-ordinal-group: 2;\n        -ms-flex-order: 1;\n            order: 1;\n    overflow: hidden;\n  }\n\n  .sidebar {\n    -webkit-box-flex: 0 !important;\n        -ms-flex: 0 0 330px !important;\n            flex: 0 0 330px !important;\n    -webkit-box-ordinal-group: 3;\n        -ms-flex-order: 2;\n            order: 2;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .feed-entry-wrapper .entry-image {\n    width: 46.5% !important;\n    max-width: 46.5% !important;\n  }\n\n  .feed-entry-wrapper .entry-body {\n    width: 53.5% !important;\n    max-width: 53.5% !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  body.is-article .content {\n    max-width: 100% !important;\n  }\n}\n\n.row {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 0;\n      -ms-flex: 0 1 auto;\n          flex: 0 1 auto;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-flow: row wrap;\n          flex-flow: row wrap;\n  margin-left: -0.9375rem;\n  margin-right: -0.9375rem;\n}\n\n.row .col {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n}\n\n.row .col.s1 {\n  -ms-flex-preferred-size: 8.33333%;\n      flex-basis: 8.33333%;\n  max-width: 8.33333%;\n}\n\n.row .col.s2 {\n  -ms-flex-preferred-size: 16.66667%;\n      flex-basis: 16.66667%;\n  max-width: 16.66667%;\n}\n\n.row .col.s3 {\n  -ms-flex-preferred-size: 25%;\n      flex-basis: 25%;\n  max-width: 25%;\n}\n\n.row .col.s4 {\n  -ms-flex-preferred-size: 33.33333%;\n      flex-basis: 33.33333%;\n  max-width: 33.33333%;\n}\n\n.row .col.s5 {\n  -ms-flex-preferred-size: 41.66667%;\n      flex-basis: 41.66667%;\n  max-width: 41.66667%;\n}\n\n.row .col.s6 {\n  -ms-flex-preferred-size: 50%;\n      flex-basis: 50%;\n  max-width: 50%;\n}\n\n.row .col.s7 {\n  -ms-flex-preferred-size: 58.33333%;\n      flex-basis: 58.33333%;\n  max-width: 58.33333%;\n}\n\n.row .col.s8 {\n  -ms-flex-preferred-size: 66.66667%;\n      flex-basis: 66.66667%;\n  max-width: 66.66667%;\n}\n\n.row .col.s9 {\n  -ms-flex-preferred-size: 75%;\n      flex-basis: 75%;\n  max-width: 75%;\n}\n\n.row .col.s10 {\n  -ms-flex-preferred-size: 83.33333%;\n      flex-basis: 83.33333%;\n  max-width: 83.33333%;\n}\n\n.row .col.s11 {\n  -ms-flex-preferred-size: 91.66667%;\n      flex-basis: 91.66667%;\n  max-width: 91.66667%;\n}\n\n.row .col.s12 {\n  -ms-flex-preferred-size: 100%;\n      flex-basis: 100%;\n  max-width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  .row .col.m1 {\n    -ms-flex-preferred-size: 8.33333%;\n        flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  .row .col.m2 {\n    -ms-flex-preferred-size: 16.66667%;\n        flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  .row .col.m3 {\n    -ms-flex-preferred-size: 25%;\n        flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .row .col.m4 {\n    -ms-flex-preferred-size: 33.33333%;\n        flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  .row .col.m5 {\n    -ms-flex-preferred-size: 41.66667%;\n        flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  .row .col.m6 {\n    -ms-flex-preferred-size: 50%;\n        flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .row .col.m7 {\n    -ms-flex-preferred-size: 58.33333%;\n        flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  .row .col.m8 {\n    -ms-flex-preferred-size: 66.66667%;\n        flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  .row .col.m9 {\n    -ms-flex-preferred-size: 75%;\n        flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .row .col.m10 {\n    -ms-flex-preferred-size: 83.33333%;\n        flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  .row .col.m11 {\n    -ms-flex-preferred-size: 91.66667%;\n        flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  .row .col.m12 {\n    -ms-flex-preferred-size: 100%;\n        flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .row .col.l1 {\n    -ms-flex-preferred-size: 8.33333%;\n        flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  .row .col.l2 {\n    -ms-flex-preferred-size: 16.66667%;\n        flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  .row .col.l3 {\n    -ms-flex-preferred-size: 25%;\n        flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .row .col.l4 {\n    -ms-flex-preferred-size: 33.33333%;\n        flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  .row .col.l5 {\n    -ms-flex-preferred-size: 41.66667%;\n        flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  .row .col.l6 {\n    -ms-flex-preferred-size: 50%;\n        flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .row .col.l7 {\n    -ms-flex-preferred-size: 58.33333%;\n        flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  .row .col.l8 {\n    -ms-flex-preferred-size: 66.66667%;\n        flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  .row .col.l9 {\n    -ms-flex-preferred-size: 75%;\n        flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .row .col.l10 {\n    -ms-flex-preferred-size: 83.33333%;\n        flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  .row .col.l11 {\n    -ms-flex-preferred-size: 91.66667%;\n        flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  .row .col.l12 {\n    -ms-flex-preferred-size: 100%;\n        flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\n.h1,\n.h2,\n.h3,\n.h4,\n.h5,\n.h6 {\n  margin-bottom: 0.5rem;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: 500;\n  line-height: 1.1;\n  color: inherit;\n  letter-spacing: -.02em !important;\n}\n\nh1 {\n  font-size: 2.25rem;\n}\n\nh2 {\n  font-size: 1.875rem;\n}\n\nh3 {\n  font-size: 1.5625rem;\n}\n\nh4 {\n  font-size: 1.375rem;\n}\n\nh5 {\n  font-size: 1.125rem;\n}\n\nh6 {\n  font-size: 1rem;\n}\n\n.h1 {\n  font-size: 2.25rem;\n}\n\n.h2 {\n  font-size: 1.875rem;\n}\n\n.h3 {\n  font-size: 1.5625rem;\n}\n\n.h4 {\n  font-size: 1.375rem;\n}\n\n.h5 {\n  font-size: 1.125rem;\n}\n\n.h6 {\n  font-size: 1rem;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  margin-bottom: 1rem;\n}\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  color: inherit;\n  line-height: inherit;\n}\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\n\n/* Navigation Mobile\r\n========================================================================== */\n\n.nav-mob {\n  background: #4285f4;\n  color: #000;\n  height: 100vh;\n  left: 0;\n  padding: 0 20px;\n  position: fixed;\n  right: 0;\n  top: 0;\n  -webkit-transform: translateX(100%);\n       -o-transform: translateX(100%);\n          transform: translateX(100%);\n  -webkit-transition: .4s;\n  -o-transition: .4s;\n  transition: .4s;\n  will-change: transform;\n  z-index: 997;\n}\n\n.nav-mob a {\n  color: inherit;\n}\n\n.nav-mob ul a {\n  display: block;\n  font-weight: 500;\n  padding: 8px 0;\n  text-transform: uppercase;\n  font-size: 14px;\n}\n\n.nav-mob-content {\n  background: #eee;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  bottom: 0;\n  left: 0;\n  padding: 20px 0;\n  position: absolute;\n  right: 0;\n  top: 50px;\n}\n\n.nav-mob ul,\n.nav-mob-subscribe,\n.nav-mob-follow {\n  border-bottom: solid 1px #DDD;\n  padding: 0 0.9375rem 20px 0.9375rem;\n  margin-bottom: 15px;\n}\n\n/* Navigation Mobile follow\r\n========================================================================== */\n\n.nav-mob-follow a {\n  font-size: 20px !important;\n  margin: 0 2px !important;\n  padding: 0;\n}\n\n.nav-mob-follow .i-facebook {\n  color: #fff;\n}\n\n.nav-mob-follow .i-twitter {\n  color: #fff;\n}\n\n.nav-mob-follow .i-google {\n  color: #fff;\n}\n\n.nav-mob-follow .i-instagram {\n  color: #fff;\n}\n\n.nav-mob-follow .i-youtube {\n  color: #fff;\n}\n\n.nav-mob-follow .i-github {\n  color: #fff;\n}\n\n.nav-mob-follow .i-linkedin {\n  color: #fff;\n}\n\n.nav-mob-follow .i-spotify {\n  color: #fff;\n}\n\n.nav-mob-follow .i-codepen {\n  color: #fff;\n}\n\n.nav-mob-follow .i-behance {\n  color: #fff;\n}\n\n.nav-mob-follow .i-dribbble {\n  color: #fff;\n}\n\n.nav-mob-follow .i-flickr {\n  color: #fff;\n}\n\n.nav-mob-follow .i-reddit {\n  color: #fff;\n}\n\n.nav-mob-follow .i-pocket {\n  color: #fff;\n}\n\n.nav-mob-follow .i-pinterest {\n  color: #fff;\n}\n\n.nav-mob-follow .i-feed {\n  color: #fff;\n}\n\n/* CopyRigh\r\n========================================================================== */\n\n.nav-mob-copyright {\n  color: #aaa;\n  font-size: 13px;\n  padding: 20px 15px 0;\n  text-align: center;\n  width: 100%;\n}\n\n.nav-mob-copyright a {\n  color: #4285f4;\n}\n\n/* subscribe\r\n========================================================================== */\n\n.nav-mob-subscribe .btn,\n.nav-mob-subscribe .nav-mob-follow a,\n.nav-mob-follow .nav-mob-subscribe a {\n  border-radius: 0;\n  text-transform: none;\n  width: 80px;\n}\n\n.nav-mob-subscribe .form-group {\n  width: calc(100% - 80px);\n}\n\n.nav-mob-subscribe input {\n  border: 0;\n  -webkit-box-shadow: none !important;\n          box-shadow: none !important;\n}\n\n/* Header Page\r\n========================================================================== */\n\n.header {\n  background: #4285f4;\n  height: 50px;\n  left: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: 999;\n}\n\n.header-wrap a {\n  color: #fff;\n}\n\n.header-logo,\n.header-follow a,\n.header-menu a {\n  height: 50px;\n}\n\n.header-follow,\n.header-search,\n.header-logo {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n}\n\n.header-logo {\n  z-index: 998;\n  font-size: 1.25rem;\n  font-weight: 500;\n  letter-spacing: 1px;\n}\n\n.header-logo img {\n  max-height: 35px;\n  position: relative;\n}\n\n.header .nav-mob-toggle,\n.header .search-mob-toggle {\n  padding: 0;\n  z-index: 998;\n}\n\n.header .nav-mob-toggle {\n  margin-left: 0 !important;\n  margin-right: -0.9375rem;\n  position: relative;\n  -webkit-transition: -webkit-transform .4s;\n  transition: -webkit-transform .4s;\n  -o-transition: -o-transform .4s;\n  transition: transform .4s;\n  transition: transform .4s, -webkit-transform .4s, -o-transform .4s;\n}\n\n.header .nav-mob-toggle span {\n  background-color: #fff;\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  -webkit-transition: .4s;\n  -o-transition: .4s;\n  transition: .4s;\n  width: 20px;\n}\n\n.header .nav-mob-toggle span:first-child {\n  -webkit-transform: translate(0, -6px);\n       -o-transform: translate(0, -6px);\n          transform: translate(0, -6px);\n}\n\n.header .nav-mob-toggle span:last-child {\n  -webkit-transform: translate(0, 6px);\n       -o-transform: translate(0, 6px);\n          transform: translate(0, 6px);\n}\n\n.header:not(.toolbar-shadow) {\n  background-color: transparent !important;\n}\n\n/* Header Navigation\r\n========================================================================== */\n\n.header-menu {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 0px;\n          flex: 1 1 0;\n  overflow: hidden;\n  -webkit-transition: margin .2s,width .2s,-webkit-box-flex .2s;\n  transition: margin .2s,width .2s,-webkit-box-flex .2s;\n  -o-transition: flex .2s,margin .2s,width .2s;\n  transition: flex .2s,margin .2s,width .2s;\n  transition: flex .2s,margin .2s,width .2s,-webkit-box-flex .2s,-ms-flex .2s;\n}\n\n.header-menu ul {\n  margin-left: 2rem;\n  white-space: nowrap;\n}\n\n.header-menu ul li {\n  padding-right: 15px;\n  display: inline-block;\n}\n\n.header-menu ul a {\n  padding: 0 8px;\n  position: relative;\n}\n\n.header-menu ul a:before {\n  background: #fff;\n  bottom: 0;\n  content: '';\n  height: 2px;\n  left: 0;\n  opacity: 0;\n  position: absolute;\n  -webkit-transition: opacity .2s;\n  -o-transition: opacity .2s;\n  transition: opacity .2s;\n  width: 100%;\n}\n\n.header-menu ul a:hover:before,\n.header-menu ul a.active:before {\n  opacity: 1;\n}\n\n/* header social\r\n========================================================================== */\n\n.header-follow a {\n  padding: 0 10px;\n}\n\n.header-follow a:hover {\n  color: rgba(255, 255, 255, 0.8);\n}\n\n.header-follow a:before {\n  font-size: 1.25rem !important;\n}\n\n/* Header search\r\n========================================================================== */\n\n.header-search {\n  background: #eee;\n  border-radius: 2px;\n  display: none;\n  height: 36px;\n  position: relative;\n  text-align: left;\n  -webkit-transition: background .2s,-webkit-box-flex .2s;\n  transition: background .2s,-webkit-box-flex .2s;\n  -o-transition: background .2s,flex .2s;\n  transition: background .2s,flex .2s;\n  transition: background .2s,flex .2s,-webkit-box-flex .2s,-ms-flex .2s;\n  vertical-align: top;\n  margin-left: 1.5rem;\n  margin-right: 1.5rem;\n}\n\n.header-search .search-icon {\n  color: #757575;\n  font-size: 24px;\n  left: 24px;\n  position: absolute;\n  top: 12px;\n  -webkit-transition: color .2s;\n  -o-transition: color .2s;\n  transition: color .2s;\n}\n\ninput.search-field {\n  background: 0;\n  border: 0;\n  color: #212121;\n  height: 36px;\n  padding: 0 8px 0 72px;\n  -webkit-transition: color .2s;\n  -o-transition: color .2s;\n  transition: color .2s;\n  width: 100%;\n}\n\ninput.search-field:focus {\n  border: 0;\n  outline: none;\n}\n\n.search-popout {\n  background: #fff;\n  -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24), inset 0 4px 6px -4px rgba(0, 0, 0, 0.24);\n          box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24), inset 0 4px 6px -4px rgba(0, 0, 0, 0.24);\n  margin-top: 10px;\n  max-height: calc(100vh - 150px);\n  margin-left: -64px;\n  overflow-y: auto;\n  position: absolute;\n  z-index: -1;\n}\n\n.search-popout.closed {\n  visibility: hidden;\n}\n\n.search-suggest-results {\n  padding: 0 8px 0 75px;\n}\n\n.search-suggest-results a {\n  color: #212121;\n  display: block;\n  margin-left: -8px;\n  outline: 0;\n  height: auto;\n  padding: 8px;\n  -webkit-transition: background .2s;\n  -o-transition: background .2s;\n  transition: background .2s;\n  font-size: 0.875rem;\n}\n\n.search-suggest-results a:first-child {\n  margin-top: 10px;\n}\n\n.search-suggest-results a:last-child {\n  margin-bottom: 10px;\n}\n\n.search-suggest-results a:hover {\n  background: #f7f7f7;\n}\n\n/* mediaquery medium\r\n========================================================================== */\n\n@media only screen and (min-width: 992px) {\n  .header-search {\n    background: rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.12);\n            box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.12);\n    color: #fff;\n    display: inline-block;\n    width: 200px;\n  }\n\n  .header-search:hover {\n    background: rgba(255, 255, 255, 0.4);\n  }\n\n  .header-search .search-icon {\n    top: 0px;\n  }\n\n  .header-search input,\n  .header-search input::-webkit-input-placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .header-search input,\n  .header-search input:-ms-input-placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .header-search input,\n  .header-search input::placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .search-popout {\n    width: 100%;\n    margin-left: 0;\n  }\n\n  .header.is-showSearch .header-search {\n    background: #fff;\n    -webkit-box-flex: 1;\n        -ms-flex: 1 0 auto;\n            flex: 1 0 auto;\n  }\n\n  .header.is-showSearch .header-search .search-icon {\n    color: #757575 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input::-webkit-input-placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input:-ms-input-placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input::placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-menu {\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto;\n    margin: 0;\n    visibility: hidden;\n    width: 0;\n  }\n}\n\n/* Media Query\r\n========================================================================== */\n\n@media only screen and (max-width: 992px) {\n  .header-menu ul {\n    display: none;\n  }\n\n  .header.is-showSearchMob {\n    padding: 0;\n  }\n\n  .header.is-showSearchMob .header-logo,\n  .header.is-showSearchMob .nav-mob-toggle {\n    display: none;\n  }\n\n  .header.is-showSearchMob .header-search {\n    border-radius: 0;\n    display: inline-block !important;\n    height: 50px;\n    margin: 0;\n    width: 100%;\n  }\n\n  .header.is-showSearchMob .header-search input {\n    height: 50px;\n    padding-right: 48px;\n  }\n\n  .header.is-showSearchMob .header-search .search-popout {\n    margin-top: 0;\n  }\n\n  .header.is-showSearchMob .search-mob-toggle {\n    border: 0;\n    color: #757575;\n    position: absolute;\n    right: 0;\n  }\n\n  .header.is-showSearchMob .search-mob-toggle:before {\n    content: \"\\E5CD\" !important;\n  }\n\n  body.is-showNavMob {\n    overflow: hidden;\n  }\n\n  body.is-showNavMob .nav-mob {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle {\n    border: 0;\n    -webkit-transform: rotate(90deg);\n         -o-transform: rotate(90deg);\n            transform: rotate(90deg);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:first-child {\n    -webkit-transform: rotate(45deg) translate(0, 0);\n         -o-transform: rotate(45deg) translate(0, 0);\n            transform: rotate(45deg) translate(0, 0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:nth-child(2) {\n    -webkit-transform: scaleX(0);\n         -o-transform: scaleX(0);\n            transform: scaleX(0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:last-child {\n    -webkit-transform: rotate(-45deg) translate(0, 0);\n         -o-transform: rotate(-45deg) translate(0, 0);\n            transform: rotate(-45deg) translate(0, 0);\n  }\n\n  body.is-showNavMob .search-mob-toggle {\n    display: none;\n  }\n\n  body.is-showNavMob .main,\n  body.is-showNavMob .footer {\n    -webkit-transform: translateX(-25%);\n         -o-transform: translateX(-25%);\n            transform: translateX(-25%);\n  }\n}\n\n.cover {\n  background: #4285f4;\n  -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n          box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n  color: #fff;\n  letter-spacing: .2px;\n  min-height: 550px;\n  position: relative;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n  z-index: 2;\n}\n\n.cover-wrap {\n  margin: 0 auto;\n  max-width: 700px;\n  padding: 16px;\n  position: relative;\n  text-align: center;\n  z-index: 99;\n}\n\n.cover-title {\n  font-size: 3rem;\n  margin: 0 0 30px 0;\n  line-height: 1.2;\n}\n\n.cover .mouse {\n  width: 25px;\n  position: absolute;\n  height: 36px;\n  border-radius: 15px;\n  border: 2px solid #888;\n  border: 2px solid rgba(255, 255, 255, 0.27);\n  bottom: 40px;\n  right: 40px;\n  margin-left: -12px;\n  cursor: pointer;\n  -webkit-transition: border-color 0.2s ease-in;\n  -o-transition: border-color 0.2s ease-in;\n  transition: border-color 0.2s ease-in;\n}\n\n.cover .mouse .scroll {\n  display: block;\n  margin: 6px auto;\n  width: 3px;\n  height: 6px;\n  border-radius: 4px;\n  background: rgba(255, 255, 255, 0.68);\n  -webkit-animation-duration: 2s;\n       -o-animation-duration: 2s;\n          animation-duration: 2s;\n  -webkit-animation-name: scroll;\n       -o-animation-name: scroll;\n          animation-name: scroll;\n  -webkit-animation-iteration-count: infinite;\n       -o-animation-iteration-count: infinite;\n          animation-iteration-count: infinite;\n}\n\n.cover-background {\n  position: absolute;\n  overflow: hidden;\n  background-size: cover;\n  background-position: center;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n\n.cover-background:before {\n  display: block;\n  content: ' ';\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.6);\n  background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, 0.7)));\n}\n\n.author a {\n  color: #FFF !important;\n}\n\n.author-header {\n  margin-top: 10%;\n}\n\n.author-name-wrap {\n  display: inline-block;\n}\n\n.author-title {\n  display: block;\n  text-transform: uppercase;\n}\n\n.author-name {\n  margin: 5px 0;\n  font-size: 1.75rem;\n}\n\n.author-bio {\n  margin: 1.5rem 0;\n  line-height: 1.8;\n  font-size: 18px;\n}\n\n.author-avatar {\n  display: inline-block;\n  border-radius: 90px;\n  margin-right: 10px;\n  width: 80px;\n  height: 80px;\n  background-size: cover;\n  background-position: center;\n  vertical-align: bottom;\n}\n\n.author-meta {\n  margin-bottom: 20px;\n}\n\n.author-meta span {\n  display: inline-block;\n  font-size: 17px;\n  font-style: italic;\n  margin: 0 2rem 1rem 0;\n  opacity: 0.8;\n  word-wrap: break-word;\n}\n\n.author .author-link:hover {\n  opacity: 1;\n}\n\n.author-follow a {\n  border-radius: 3px;\n  -webkit-box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  cursor: pointer;\n  display: inline-block;\n  height: 40px;\n  letter-spacing: 1px;\n  line-height: 40px;\n  margin: 0 10px;\n  padding: 0 16px;\n  text-shadow: none;\n  text-transform: uppercase;\n}\n\n.author-follow a:hover {\n  -webkit-box-shadow: inset 0 0 0 2px #fff;\n          box-shadow: inset 0 0 0 2px #fff;\n}\n\n@media only screen and (min-width: 766px) {\n  .cover-description {\n    font-size: 1.25rem;\n  }\n}\n\n@media only screen and (max-width: 766px) {\n  .cover {\n    padding-top: 50px;\n    padding-bottom: 20px;\n  }\n\n  .cover-title {\n    font-size: 2rem;\n  }\n\n  .author-avatar {\n    display: block;\n    margin: 0 auto 10px auto;\n  }\n}\n\n.feed-entry-content .feed-entry-wrapper:last-child .entry:last-child {\n  padding: 0;\n  border: none;\n}\n\n.entry {\n  margin-bottom: 1.5rem;\n  padding-bottom: 0;\n}\n\n.entry-image {\n  margin-bottom: 10px;\n}\n\n.entry-image--link {\n  display: block;\n  height: 180px;\n  line-height: 0;\n  margin: 0;\n  overflow: hidden;\n  position: relative;\n}\n\n.entry-image--link:hover .entry-image--bg {\n  -webkit-transform: scale(1.03);\n       -o-transform: scale(1.03);\n          transform: scale(1.03);\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n}\n\n.entry-image img {\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  height: auto;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.entry-image--bg {\n  display: block;\n  width: 100%;\n  position: relative;\n  height: 100%;\n  background-position: center;\n  background-size: cover;\n  -webkit-transition: -webkit-transform 0.3s;\n  transition: -webkit-transform 0.3s;\n  -o-transition: -o-transform 0.3s;\n  transition: transform 0.3s;\n  transition: transform 0.3s, -webkit-transform 0.3s, -o-transform 0.3s;\n}\n\n.entry-video-play {\n  border-radius: 50%;\n  border: 2px solid #fff;\n  color: #fff;\n  font-size: 3.5rem;\n  height: 65px;\n  left: 50%;\n  line-height: 65px;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n       -o-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  width: 65px;\n  z-index: 10;\n}\n\n.entry-category {\n  margin-bottom: 5px;\n  text-transform: capitalize;\n  font-size: 0.875rem;\n  line-height: 1;\n}\n\n.entry-category a:active {\n  text-decoration: underline;\n}\n\n.entry-title {\n  color: #222;\n  font-size: 1.25rem;\n  height: auto;\n  line-height: 1.2;\n  margin: 0 0 1rem;\n  padding: 0;\n}\n\n.entry-title:hover {\n  color: #777;\n}\n\n.entry-byline {\n  margin-top: 0;\n  margin-bottom: 1.125rem;\n  color: #999;\n  font-size: 0.8125rem;\n}\n\n.entry-byline a {\n  color: inherit;\n}\n\n.entry-byline a:hover {\n  color: #333;\n}\n\n/* Entry small --small\r\n========================================================================== */\n\n.entry.entry--small {\n  margin-bottom: 18px;\n  padding-bottom: 0;\n}\n\n.entry.entry--small .entry-image {\n  margin-bottom: 10px;\n}\n\n.entry.entry--small .entry-image--link {\n  height: 174px;\n}\n\n.entry.entry--small .entry-title {\n  font-size: 1rem;\n  line-height: 1.2;\n}\n\n.entry.entry--small .entry-byline {\n  margin: 0;\n}\n\n@media only screen and (min-width: 992px) {\n  .entry {\n    margin-bottom: 2rem;\n    padding-bottom: 2rem;\n  }\n\n  .entry-title {\n    font-size: 1.75rem;\n  }\n\n  .entry-image {\n    margin-bottom: 0;\n  }\n\n  .entry-image--link {\n    height: 180px;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  .entry-image--link {\n    height: 250px;\n  }\n}\n\n.footer {\n  color: rgba(0, 0, 0, 0.44);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1;\n  padding: 1.6rem 15px;\n  text-align: center;\n}\n\n.footer a {\n  color: rgba(0, 0, 0, 0.6);\n}\n\n.footer a:hover {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n.footer-wrap {\n  margin: 0 auto;\n  max-width: 1400px;\n}\n\n.footer .heart {\n  -webkit-animation: heartify .5s infinite alternate;\n       -o-animation: heartify .5s infinite alternate;\n          animation: heartify .5s infinite alternate;\n  color: red;\n}\n\n.footer-copy,\n.footer-design-author {\n  display: inline-block;\n  padding: .5rem 0;\n  vertical-align: middle;\n}\n\n@-webkit-keyframes heartify {\n  0% {\n    -webkit-transform: scale(0.8);\n            transform: scale(0.8);\n  }\n}\n\n@-o-keyframes heartify {\n  0% {\n    -o-transform: scale(0.8);\n       transform: scale(0.8);\n  }\n}\n\n@keyframes heartify {\n  0% {\n    -webkit-transform: scale(0.8);\n         -o-transform: scale(0.8);\n            transform: scale(0.8);\n  }\n}\n\n.btn,\n.nav-mob-follow a {\n  background-color: #fff;\n  border-radius: 2px;\n  border: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #039be5;\n  cursor: pointer;\n  display: inline-block;\n  font: 500 14px/20px \"Roboto\", sans-serif;\n  height: 36px;\n  margin: 0;\n  min-width: 36px;\n  outline: 0;\n  overflow: hidden;\n  padding: 8px;\n  text-align: center;\n  text-decoration: none;\n  text-overflow: ellipsis;\n  text-transform: uppercase;\n  -webkit-transition: background-color .2s,-webkit-box-shadow .2s;\n  transition: background-color .2s,-webkit-box-shadow .2s;\n  -o-transition: background-color .2s,box-shadow .2s;\n  transition: background-color .2s,box-shadow .2s;\n  transition: background-color .2s,box-shadow .2s,-webkit-box-shadow .2s;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n.btn + .btn,\n.nav-mob-follow a + .btn,\n.nav-mob-follow .btn + a,\n.nav-mob-follow a + a {\n  margin-left: 8px;\n}\n\n.btn:focus,\n.nav-mob-follow a:focus,\n.btn:hover,\n.nav-mob-follow a:hover {\n  background-color: #e1f3fc;\n  text-decoration: none !important;\n}\n\n.btn:active,\n.nav-mob-follow a:active {\n  background-color: #c3e7f9;\n}\n\n.btn.btn-lg,\n.nav-mob-follow a.btn-lg {\n  font-size: 1.5rem;\n  min-width: 48px;\n  height: 48px;\n  line-height: 48px;\n}\n\n.btn.btn-flat,\n.nav-mob-follow a.btn-flat {\n  background: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.btn.btn-flat:focus,\n.nav-mob-follow a.btn-flat:focus,\n.btn.btn-flat:hover,\n.nav-mob-follow a.btn-flat:hover,\n.btn.btn-flat:active,\n.nav-mob-follow a.btn-flat:active {\n  background: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.btn.btn-primary,\n.nav-mob-follow a.btn-primary {\n  background-color: #4285f4;\n  color: #fff;\n}\n\n.btn.btn-primary:hover,\n.nav-mob-follow a.btn-primary:hover {\n  background-color: #2f79f3;\n}\n\n.btn.btn-circle,\n.nav-mob-follow a.btn-circle {\n  border-radius: 50%;\n  height: 40px;\n  line-height: 40px;\n  padding: 0;\n  width: 40px;\n}\n\n.btn.btn-circle-small,\n.nav-mob-follow a.btn-circle-small {\n  border-radius: 50%;\n  height: 32px;\n  line-height: 32px;\n  padding: 0;\n  width: 32px;\n  min-width: 32px;\n}\n\n.btn.btn-shadow,\n.nav-mob-follow a.btn-shadow {\n  -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);\n          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);\n  color: #333;\n  background-color: #eee;\n}\n\n.btn.btn-shadow:hover,\n.nav-mob-follow a.btn-shadow:hover {\n  background-color: rgba(0, 0, 0, 0.12);\n}\n\n.btn.btn-download-cloud,\n.nav-mob-follow a.btn-download-cloud,\n.btn.btn-download,\n.nav-mob-follow a.btn-download {\n  background-color: #4285f4;\n  color: #fff;\n}\n\n.btn.btn-download-cloud:hover,\n.nav-mob-follow a.btn-download-cloud:hover,\n.btn.btn-download:hover,\n.nav-mob-follow a.btn-download:hover {\n  background-color: #1b6cf2;\n}\n\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after,\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  margin-left: 5px;\n  font-size: 1.1rem;\n  display: inline-block;\n  vertical-align: top;\n}\n\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  content: \"\\E900\";\n}\n\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after {\n  content: \"\\E2C0\";\n}\n\n.btn.external:after,\n.nav-mob-follow a.external:after {\n  font-size: 1rem;\n}\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n}\n\n.form-control {\n  width: 100%;\n  padding: 8px 12px;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 0px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  -webkit-transition: border-color ease-in-out 0.15s,-webkit-box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s,-webkit-box-shadow ease-in-out 0.15s;\n  -o-transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s,-webkit-box-shadow ease-in-out 0.15s;\n  height: 36px;\n}\n\n.form-control:focus {\n  border-color: #4285f4;\n  outline: 0;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(66, 133, 244, 0.6);\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(66, 133, 244, 0.6);\n}\n\n.btn-subscribe-home {\n  background-color: transparent;\n  border-radius: 3px;\n  -webkit-box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #ffffff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  max-width: 300px;\n  padding: 15px 10px;\n  -webkit-transition: all 0.3s;\n  -o-transition: all 0.3s;\n  transition: all 0.3s;\n  width: 100%;\n}\n\n.btn-subscribe-home:hover {\n  -webkit-box-shadow: inset 0 0 0 2px #fff;\n          box-shadow: inset 0 0 0 2px #fff;\n}\n\n/*  Post\n========================================================================== */\n\n.post-wrapper {\n  margin-top: 50px;\n  padding-top: 1.8rem;\n}\n\n.post-header {\n  margin-bottom: 1.2rem;\n}\n\n.post-title {\n  color: #222;\n  font-size: 2.5rem;\n  height: auto;\n  line-height: 1.04;\n  margin: 0 0 0.9375rem;\n  letter-spacing: -.028em !important;\n  padding: 0;\n}\n\n.post-excerpt {\n  line-height: 1.3em;\n  font-size: 20px;\n  color: #7D7D7D;\n  margin-bottom: 8px;\n}\n\n.post-image {\n  margin-bottom: 1.45rem;\n  overflow: hidden;\n}\n\n.post-body {\n  margin-bottom: 2rem;\n}\n\n.post-body a:focus {\n  text-decoration: underline;\n}\n\n.post-body h2 {\n  font-weight: 500;\n  margin: 2.50rem 0 1.25rem;\n  padding-bottom: 3px;\n}\n\n.post-body h3,\n.post-body h4 {\n  margin: 32px 0 16px;\n}\n\n.post-body iframe {\n  display: block !important;\n  margin: 0 auto 1.5rem 0 !important;\n}\n\n.post-body img {\n  display: block;\n  margin-bottom: 1rem;\n}\n\n.post-body h2 a,\n.post-body h3 a,\n.post-body h4 a {\n  color: #4285f4;\n}\n\n.post-tags {\n  margin: 1.25rem 0;\n}\n\n.post-comments {\n  margin: 0 0 1.5rem;\n}\n\n/* Post author by line top (author - time - tag - sahre)\n========================================================================== */\n\n.post-byline {\n  color: #999;\n  font-size: 14px;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  letter-spacing: -.028em !important;\n}\n\n.post-byline a {\n  color: inherit;\n}\n\n.post-byline a:active {\n  text-decoration: underline;\n}\n\n.post-byline a:hover {\n  color: #222;\n}\n\n.post-actions--top .share {\n  margin-right: 10px;\n  font-size: 20px;\n}\n\n.post-actions--top .share:hover {\n  opacity: .7;\n}\n\n.post-action-comments {\n  color: #999;\n  margin-right: 15px;\n  font-size: 14px;\n}\n\n/* Post Action social media\n========================================================================== */\n\n.post-actions {\n  position: relative;\n  margin-bottom: 1.5rem;\n}\n\n.post-actions a {\n  color: #fff;\n  font-size: 1.125rem;\n}\n\n.post-actions a:hover {\n  background-color: #000 !important;\n}\n\n.post-actions li {\n  margin-left: 6px;\n}\n\n.post-actions li:first-child {\n  margin-left: 0 !important;\n}\n\n.post-actions .btn,\n.post-actions .nav-mob-follow a,\n.nav-mob-follow .post-actions a {\n  border-radius: 0;\n}\n\n/* Post author widget bottom\n========================================================================== */\n\n.post-author {\n  position: relative;\n  font-size: 15px;\n  padding: 30px 0 30px 100px;\n  margin-bottom: 3rem;\n  background-color: #f3f5f6;\n}\n\n.post-author h5 {\n  color: #AAA;\n  font-size: 12px;\n  line-height: 1.5;\n  margin: 0;\n}\n\n.post-author li {\n  margin-left: 30px;\n  font-size: 14px;\n}\n\n.post-author li a {\n  color: #555;\n}\n\n.post-author li a:hover {\n  color: #000;\n}\n\n.post-author li:first-child {\n  margin-left: 0;\n}\n\n.post-author-bio {\n  max-width: 500px;\n}\n\n.post-author .post-author-avatar {\n  height: 64px;\n  width: 64px;\n  position: absolute;\n  left: 20px;\n  top: 30px;\n  background-position: center center;\n  background-size: cover;\n  border-radius: 50%;\n}\n\n/* prev-post and next-post\n========================================================================== */\n\n/* bottom share and bottom subscribe\n========================================================================== */\n\n.share-subscribe {\n  margin-bottom: 1rem;\n}\n\n.share-subscribe p {\n  color: #7d7d7d;\n  margin-bottom: 1rem;\n  line-height: 1;\n  font-size: 0.875rem;\n}\n\n.share-subscribe .social-share {\n  float: none !important;\n}\n\n.share-subscribe > div {\n  position: relative;\n  overflow: hidden;\n  margin-bottom: 15px;\n}\n\n.share-subscribe > div:before {\n  content: \" \";\n  border-top: solid 1px #000;\n  position: absolute;\n  top: 0;\n  left: 15px;\n  width: 40px;\n  height: 1px;\n}\n\n.share-subscribe > div h5 {\n  color: #666;\n  font-size: 0.875rem;\n  margin: 1rem 0;\n  line-height: 1;\n  text-transform: uppercase;\n}\n\n.share-subscribe .newsletter-form {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.share-subscribe .newsletter-form .form-group {\n  max-width: 250px;\n  width: 100%;\n}\n\n.share-subscribe .newsletter-form .btn,\n.share-subscribe .newsletter-form .nav-mob-follow a,\n.nav-mob-follow .share-subscribe .newsletter-form a {\n  border-radius: 0;\n}\n\n/* Related post\n========================================================================== */\n\n.post-related {\n  margin-bottom: 1.5rem;\n}\n\n.post-related-title {\n  font-size: 17px;\n  font-weight: 400;\n  height: auto;\n  line-height: 17px;\n  margin: 0 0 20px;\n  padding-bottom: 10px;\n  text-transform: uppercase;\n}\n\n.post-related-list {\n  margin-bottom: 18px;\n  padding: 0;\n  border: none;\n}\n\n.post-related .no-image {\n  position: relative;\n}\n\n.post-related .no-image .entry {\n  background-color: #4285f4;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  position: absolute;\n  bottom: 0;\n  top: 0;\n  left: 0.9375rem;\n  right: 0.9375rem;\n}\n\n.post-related .no-image .entry-title {\n  color: #fff;\n  padding: 0 10px;\n  text-align: center;\n  width: 100%;\n}\n\n.post-related .no-image .entry-title:hover {\n  color: rgba(255, 255, 255, 0.7);\n}\n\n/* Media Query (medium)\n========================================================================== */\n\n@media only screen and (min-width: 766px) {\n  .post .title {\n    font-size: 2.25rem;\n    margin: 0 0 1rem;\n  }\n\n  .post-body {\n    font-size: 1.125rem;\n    line-height: 32px;\n  }\n\n  .post-body p {\n    margin-bottom: 1.5rem;\n  }\n}\n\n@media only screen and (max-width: 640px) {\n  .post-title {\n    font-size: 1.8rem;\n  }\n\n  .post-image,\n  .video-responsive {\n    margin-left: -0.9375rem;\n    margin-right: -0.9375rem;\n  }\n}\n\n/* sidebar\n========================================================================== */\n\n.sidebar {\n  position: relative;\n  line-height: 1.6;\n}\n\n.sidebar h1,\n.sidebar h2,\n.sidebar h3,\n.sidebar h4,\n.sidebar h5,\n.sidebar h6 {\n  margin-top: 0;\n}\n\n.sidebar-items {\n  margin-bottom: 2.5rem;\n  position: relative;\n}\n\n.sidebar-title {\n  padding-bottom: 10px;\n  margin-bottom: 1rem;\n  text-transform: uppercase;\n  font-size: 1rem;\n  font-weight: 500;\n}\n\n.sidebar .title-primary {\n  background-color: #4285f4;\n  color: #FFFFFF;\n  padding: 10px 16px;\n  font-size: 18px;\n}\n\n.sidebar-post {\n  padding-bottom: 2px;\n}\n\n.sidebar-post--border {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border-left: 3px solid #4285f4;\n  bottom: 0;\n  color: rgba(0, 0, 0, 0.2);\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  font-size: 28px;\n  font-weight: bold;\n  left: 0;\n  line-height: 1;\n  padding: 15px 10px 10px;\n  position: absolute;\n  top: 0;\n}\n\n.sidebar-post:nth-child(3n) .sidebar-post--border {\n  border-color: #f59e00;\n}\n\n.sidebar-post:nth-child(3n+2) .sidebar-post--border {\n  border-color: #00a034;\n}\n\n.sidebar-post--link {\n  background-color: white;\n  display: block;\n  min-height: 50px;\n  padding: 10px 15px 10px 55px;\n  position: relative;\n}\n\n.sidebar-post--link:hover .sidebar-post--border {\n  background-color: #e5eff5;\n}\n\n.sidebar-post--title {\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 18px;\n  font-weight: 400;\n  margin: 0;\n}\n\n.subscribe {\n  min-height: 90vh;\n  padding-top: 50px;\n}\n\n.subscribe h3 {\n  margin: 0;\n  margin-bottom: 8px;\n  font: 400 20px/32px \"Roboto\", sans-serif;\n}\n\n.subscribe-title {\n  font-weight: 400;\n  margin-top: 0;\n}\n\n.subscribe-wrap {\n  max-width: 700px;\n  color: #7d878a;\n  padding: 1rem 0;\n}\n\n.subscribe .form-group {\n  margin-bottom: 1.5rem;\n}\n\n.subscribe .form-group.error input {\n  border-color: #ff5b5b;\n}\n\n.subscribe .btn,\n.subscribe .nav-mob-follow a,\n.nav-mob-follow .subscribe a {\n  width: 100%;\n}\n\n.subscribe-form {\n  position: relative;\n  margin: 30px auto;\n  padding: 40px;\n  max-width: 400px;\n  width: 100%;\n  background: #ebeff2;\n  border-radius: 5px;\n  text-align: left;\n}\n\n.subscribe-input {\n  width: 100%;\n  padding: 10px;\n  border: #4285f4  1px solid;\n  border-radius: 2px;\n}\n\n.subscribe-input:focus {\n  outline: none;\n}\n\n.animated {\n  -webkit-animation-duration: 1s;\n       -o-animation-duration: 1s;\n          animation-duration: 1s;\n  -webkit-animation-fill-mode: both;\n       -o-animation-fill-mode: both;\n          animation-fill-mode: both;\n}\n\n.animated.infinite {\n  -webkit-animation-iteration-count: infinite;\n       -o-animation-iteration-count: infinite;\n          animation-iteration-count: infinite;\n}\n\n.bounceIn {\n  -webkit-animation-name: bounceIn;\n       -o-animation-name: bounceIn;\n          animation-name: bounceIn;\n}\n\n.bounceInDown {\n  -webkit-animation-name: bounceInDown;\n       -o-animation-name: bounceInDown;\n          animation-name: bounceInDown;\n}\n\n@-webkit-keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n            transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n            transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n            transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n            transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n            transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-o-keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n       animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n         -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n            transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n            transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n            transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n            transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n            transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-webkit-keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n            transform: none;\n  }\n}\n\n@-o-keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n       animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -o-transform: none;\n       transform: none;\n  }\n}\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n         -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n         -o-transform: none;\n            transform: none;\n  }\n}\n\n@-webkit-keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.05, 1.05, 1.05);\n            transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-o-keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.05, 1.05, 1.05);\n            transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-webkit-keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -webkit-transform: translateY(0px);\n            transform: translateY(0px);\n  }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translateY(10px);\n            transform: translateY(10px);\n  }\n}\n\n@-o-keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -o-transform: translateY(0px);\n       transform: translateY(0px);\n  }\n\n  100% {\n    opacity: 0;\n    -o-transform: translateY(10px);\n       transform: translateY(10px);\n  }\n}\n\n@keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -webkit-transform: translateY(0px);\n         -o-transform: translateY(0px);\n            transform: translateY(0px);\n  }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translateY(10px);\n         -o-transform: translateY(10px);\n            transform: translateY(10px);\n  }\n}\n\n@-webkit-keyframes spin {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@-o-keyframes spin {\n  from {\n    -o-transform: rotate(0deg);\n       transform: rotate(0deg);\n  }\n\n  to {\n    -o-transform: rotate(360deg);\n       transform: rotate(360deg);\n  }\n}\n\n@keyframes spin {\n  from {\n    -webkit-transform: rotate(0deg);\n         -o-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n         -o-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n", "", {"version":3,"sources":["C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/main.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/main.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/common/_icon.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/common/_variables.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/layouts/_header.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/common/_utilities.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/common/_global.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/components/_grid.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/common/_typography.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/layouts/_menu.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/layouts/_cover.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/layouts/_entry.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/layouts/_footer.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/components/_buttons.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/layouts/_post.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/layouts/_sidebar.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/layouts/_subscribe.scss","C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/C:/Users/Smigol/Projects/joder/content/themes/Mapache/src/styles/src/styles/components/_animated.scss"],"names":[],"mappings":"AAAA,iBAAA;;ACAA;EACC,mBAAA;EACA,oBAAA;EACA,0BAAA;CCOA;;ADJkB;EAClB,mBAAA;CCOA;;ADJD;EACC,mBAAA;EACA,qBAAA;EACA,OAAA;EACA,gBAAA;EACA,aAAA;EACA,WAAA;EAAa,6CAAA;EACb,qBAAA;EACA,6BAAA;EAEA,0BAAA;EACA,uBAAA;EACA,sBAAA;EACA,kBAAA;CCOA;;ADHA;EACC,qBAAA;EACA,eAAA;EACA,8BAAA;CCMD;;ADHC;EACC,6BAAA;EACA,YAAA;EACA,eAAA;EACA,qBAAA;EACA,kBAAA;CCMF;;AC5CD;EACE,uBAAA;EACA,iJAAA;EAIA,oBAAA;EACA,mBAAA;CD4CD;;AFPD;;EGjCE,gFAAA;EACA,kCAAA;EACA,YAAA;EACA,mBAAA;EACA,oBAAA;EACA,qBAAA;EACA,qBAAA;EACA,qBAAA;EAEA,uCAAA;EACA,oCAAA;EACA,mCAAA;CD4CD;;ACzCD;EACE,iBAAA;CD4CD;;AC1CD;EACE,iBAAA;CD6CD;;AC3CD;EACE,iBAAA;CD8CD;;AC5CD;EACE,iBAAA;CD+CD;;AC7CD;EACE,iBAAA;CDgDD;;AC9CD;EACE,iBAAA;CDiDD;;AC/CD;EACE,iBAAA;CDkDD;;AChDD;EACE,iBAAA;CDmDD;;ACjDD;EACE,iBAAA;CDoDD;;AClDD;EACE,iBAAA;CDqDD;;ACnDD;EACE,iBAAA;CDsDD;;ACpDD;EACE,iBAAA;CDuDD;;ACrDD;EACE,iBAAA;CDwDD;;ACtDD;EACE,iBAAA;CDyDD;;ACvDD;EACE,iBAAA;CD0DD;;ACxDD;EACE,iBAAA;CD2DD;;ACzDD;EACE,iBAAA;CD4DD;;AC1DD;EACE,iBAAA;CD6DD;;AC3DD;EACE,iBAAA;CD8DD;;AC5DD;EACE,iBAAA;CD+DD;;AC7DD;EACE,iBAAA;CDgED;;AC9DD;EACE,iBAAA;CDiED;;AC/DD;EACE,iBAAA;CDkED;;AChED;EACE,iBAAA;CDmED;;ACjED;EACE,iBAAA;CDoED;;AClED;EACE,iBAAA;CDqED;;ACnED;EACE,iBAAA;CDsED;;ACpED;EACE,iBAAA;CDuED;;ACrED;EACE,iBAAA;CDwED;;ACtED;EACE,iBAAA;CDyED;;ACvED;EACE,iBAAA;CD0ED;;ACxED;EACE,iBAAA;CD2ED;;ACzED;EACE,iBAAA;CD4ED;;AC1ED;EACE,iBAAA;CD6ED;;AC3ED;EACE,iBAAA;CD8ED;;AC5ED;EACE,iBAAA;CD+ED;;AC7ED;EACE,iBAAA;CDgFD;;AC9ED;EACE,iBAAA;CDiFD;;AC/ED;EACE,iBAAA;CDkFD;;AChFD;EACE,iBAAA;CDmFD;;ACjFD;EACE,iBAAA;CDoFD;;AClFD;EACE,iBAAA;CDqFD;;AE1OD;;;;;;EFkPE;;AE1OF;;;;;;;;;;;;;;EF0PE;;AEzOF;6EF4O6E;;AEtM7E;6EFyM6E;;AEnM7E;6EFsM6E;;AEtK7E;6EFyK6E;;AEhK7E;6EFmK6E;;AE1J7E;6EF6J6E;;AEtJ7E;6EFyJ6E;;AEjJ7E;6EFoJ6E;;AE7I7E;6EFgJ6E;;AErI7E;6EFwI6E;;AEhI7E;6EFmI6E;;AElH7E;6EFqH6E;;AGpS7E;ECAE,+EAAA;UAAA,uEAAA;CJwSD;;AK5RD;;;;;;;;;EDRE,kCAAA;EACA,YAAA;EACA,mBAAA;EACA,oBAAA;EACA,qBAAA;EACA,qBAAA;EACA,eAAA;EAEA,uCAAA;EACA,oCAAA;EACA,mCAAA;CJ+SD;;AI3SD;EAEI,YAAA;EACA,YAAA;EACA,eAAA;CJ6SH;;AIzSD;EAAe,gDAAA;CJ6Sd;;AI1SD;;EAAQ,8BAAA;CJ+SP;;AI9SD;EAAQ,2BAAA;CJkTP;;AI/SD;EACE,kBAAA;CJkTD;;AI9SD;EACE,sBAAA;EACA,UAAA;EACA,gBAAA;CJiTD;;AI9SD;EAAgB,uBAAA;CJkTf;;AIjTD;EAAgB,wBAAA;CJqTf;;AIlTD;EAAS,qBAAA;EAAA,qBAAA;EAAA,cAAA;EAAgB,+BAAA;EAAA,8BAAA;MAAA,wBAAA;UAAA,oBAAA;CJuTxB;;AItTD;EAAc,qBAAA;EAAA,qBAAA;EAAA,cAAA;EAAgB,oBAAA;MAAA,gBAAA;CJ2T7B;;AI1TD;;;;EAAgB,qBAAA;EAAA,qBAAA;EAAA,cAAA;EAAgB,0BAAA;MAAA,uBAAA;UAAA,oBAAA;CJkU/B;;AIjUD;EAAsB,qBAAA;EAAA,qBAAA;EAAA,cAAA;EAAgB,0BAAA;MAAA,uBAAA;UAAA,oBAAA;EAAsB,sBAAA;MAAA,mBAAA;UAAA,0BAAA;CJuU3D;;AItUD;EAAuB,qBAAA;EAAA,qBAAA;EAAA,cAAA;EAAgB,0BAAA;MAAA,uBAAA;UAAA,oBAAA;EAAsB,yBAAA;MAAA,sBAAA;UAAA,wBAAA;EAAyB,6BAAA;EAAA,8BAAA;MAAA,2BAAA;UAAA,uBAAA;CJ6UrF;;AI1UD;EACE,iBAAA;CJ6UD;;AI1UD;6EJ6U6E;;AI3U7E;EACE,2BAAA;EACA,uBAAA;EACA,0BAAA;EACA,qCAAA;EACA,4BAAA;EAAA,uBAAA;EAAA,oBAAA;CJ8UD;;AInVD;EAOI,mBAAA;EACA,YAAA;CJgVH;;AIxVD;EAWI,qCAAA;EACA,uBAAA;CJiVH;;AI5UD;EAAQ,yBAAA;CJgVP;;AI9UD;EAAwB;IAAW,yBAAA;GJmVhC;CACF;;AInVD;EAAwB;IAAW,yBAAA;GJwVhC;CACF;;AItVD;EAAsB;IAAW,yBAAA;GJ2V9B;CACF;;AI3VD;EAAsB;IAAW,yBAAA;GJgW9B;CACF;;AKxbD;EACE,+BAAA;UAAA,uBAAA;EAEA,gBAAA;EAEA,yCAAA;CLybD;;AKtbD;;;EAGE,+BAAA;UAAA,uBAAA;CLybD;;AKtbD;EACE,eAAA;EACA,WAAA;EACA,sBAAA;EAEA,yCAAA;CLwbD;;AK7bD;EAQI,sBAAA;CLybH;;AKjcD;EAeM,iBAAA;EACA,iBAAA;CLsbL;;AKjbD;EAEE,YAAA;EACA,kCAAA;EACA,gBAAA;EACA,iBAAA;EACA,eAAA;CLmbD;;AKhbD;EAAS,UAAA;CLobR;;AKlbD;EACE,aAAA;EACA,gBAAA;EACA,uBAAA;EACA,YAAA;CLqbD;;AKzbD;EAOI,mBAAA;CLsbH;;AKlbD;EACE,eAAA;EACA,gBAAA;EACA,aAAA;CLqbD;;AKlbD;EACE,sBAAA;EACA,uBAAA;CLqbD;;AKlbD;EACE,oBAAA;EACA,yHAAA;EAAA,gFAAA;EAAA,2EAAA;EAAA,4EAAA;EACA,aAAA;EACA,YAAA;EACA,kBAAA;EACA,eAAA;EACA,mBAAA;CLqbD;;AK5bD;EAUI,iBAAA;EACA,8BAAA;EACA,iBAAA;EACA,eAAA;EACA,gBAAA;EACA,UAAA;EACA,gBAAA;EACA,mBAAA;EACA,SAAA;EACA,yCAAA;OAAA,oCAAA;UAAA,iCAAA;CLsbH;;AKjbD;EACE,+BAAA;EACA,uBAAA;EACA,oBAAA;EACA,eAAA;EACA,oBAAA;EACA,iBAAA;EACA,oBAAA;EACA,aAAA;CLobD;;AKjbD;;;EACE,kBAAA;CLsbD;;AKnbD;EACE,iBAAA;CLsbD;;AKnbD;;EACE,eAAA;CLubD;;AKpbD;EACE,mBAAA;EACA,4BAAA;CLubD;;AKpbD;EACE,8FAAA;EAAA,iEAAA;EAAA,4DAAA;EAAA,+DAAA;EACA,8BAAA;CLubD;;AKpbD;;EAEE,+CAAA;EAAA,uCAAA;EAAA,qCAAA;EAAA,+BAAA;EAAA,kFAAA;EACA,WAAA;CLubD;;AKlbD;6ELqb6E;;AKnb7E;;;EACE,iDAAA;EACA,qBAAA;EACA,eAAA;EACA,oBAAA;EACA,mBAAA;EACA,iBAAA;EACA,sBAAA;CLwbD;;AKrbD;;EAEE,eAAA;EACA,iBAAA;CLwbD;;AKtbC;;EAAiB,YAAA;CL2blB;;AKhcD;;EAQI,mBAAA;CL6bH;;AKrcD;;EAWM,YAAA;EACA,mBAAA;EACA,QAAA;EACA,OAAA;EACA,oBAAA;EACA,YAAA;EACA,aAAA;CL+bL;;AK3bC;;EACE,mBAAA;EACA,UAAA;EACA,YAAA;CL+bH;;AKvdD;;EA2BM,iBAAA;EACA,mBAAA;EACA,YAAA;CLicL;;AK5bD;EACE,qCAAA;EACA,cAAA;EACA,iBAAA;EACA,mBAAA;EACA,kBAAA;EACA,4BAAA;EACA,iDAAA;EACA,qBAAA;EACA,mBAAA;CL+bD;;AKxcD;EAYI,eAAA;EACA,wBAAA;EACA,WAAA;EACA,wBAAA;CLgcH;;AK5bD;6EL+b6E;;AK7b7E;EACE,oBAAA;EACA,eAAA;CLgcD;;AK/bC;EAAS,iBAAA;CLmcV;;AKhcD;EACE,oBAAA;EACA,eAAA;CLmcD;;AKrcD;EAGW,iBAAA;CLscV;;AKncD;EACE,oBAAA;EACA,eAAA;CLscD;;AKrcC;EAAS,iBAAA;EAAyB,eAAA;CL0cnC;;AKvcD;;;EACE,eAAA;EACA,eAAA;EACA,gBAAA;EACA,6BAAA;EACA,iBAAA;CL4cD;;AK3cC;;;EACE,2BAAA;EACA,eAAA;CLgdH;;AKxdD;;;EAWI,mBAAA;EACA,YAAA;EACA,gBAAA;CLmdH;;AK7cD;6ELgd6E;;AK7c3E;EACE,eAAA;CLgdH;;AK9cC;;EACE,qCAAA;CLkdH;;AKtdC;EACE,eAAA;CLydH;;AKvdC;;EACE,qCAAA;CL2dH;;AK/dC;EACE,eAAA;CLkeH;;AKheC;;EACE,qCAAA;CLoeH;;AKxeC;EACE,eAAA;CL2eH;;AKzeC;;EACE,qCAAA;CL6eH;;AKjfC;EACE,eAAA;CLofH;;AKlfC;;EACE,qCAAA;CLsfH;;AK1fC;EACE,eAAA;CL6fH;;AK3fC;;EACE,qCAAA;CL+fH;;AKngBC;EACE,eAAA;CLsgBH;;AKpgBC;;EACE,qCAAA;CLwgBH;;AK5gBC;EACE,eAAA;CL+gBH;;AK7gBC;;EACE,qCAAA;CLihBH;;AKrhBC;EACE,eAAA;CLwhBH;;AKthBC;;EACE,qCAAA;CL0hBH;;AK9hBC;EACE,eAAA;CLiiBH;;AK/hBC;;EACE,qCAAA;CLmiBH;;AKviBC;EACE,eAAA;CL0iBH;;AKxiBC;;EACE,qCAAA;CL4iBH;;AKhjBC;EACE,eAAA;CLmjBH;;AKjjBC;;EACE,qCAAA;CLqjBH;;AKzjBC;EACE,iBAAA;CL4jBH;;AK1jBC;;EACE,uCAAA;CL8jBH;;AKlkBC;EACE,eAAA;CLqkBH;;AKnkBC;;EACE,qCAAA;CLukBH;;AK3kBC;EACE,eAAA;CL8kBH;;AK5kBC;;EACE,qCAAA;CLglBH;;AKplBC;EACE,cAAA;CLulBH;;AKrlBC;;EACE,oCAAA;CLylBH;;AKplBD;EAEI,YAAA;EACA,eAAA;EACA,YAAA;CLslBH;;AKllBD;6ELqlB6E;;AKnlB7E;EACE,0BAAA;EACA,eAAA;EACA,eAAA;EACA,gBAAA;EACA,aAAA;EACA,kBAAA;EACA,mBAAA;EACA,mBAAA;EACA,mBAAA;EACA,YAAA;CLslBD;;AKhmBD;EAaI,oBAAA;EACA,sBAAA;EACA,YAAA;CLulBH;;AKllBD;EACE,uBAAA;EACA,mBAAA;CLqlBD;;AKplBC;EACE,cAAA;EACA,iBAAA;CLulBH;;AKtlBG;EAHF;IAGuB,sBAAA;GL2lBtB;CACF;;AKlmBD;EASI,YAAA;CL6lBH;;AKtmBD;EAYI,aAAA;CL8lBH;;AK1lBD;6EL6lB6E;;AK3lB7E;EACE,aAAA;EACA,gBAAA;EACA,YAAA;EACA,mBAAA;EACA,YAAA;EACA,YAAA;EACA,WAAA;EACA,mBAAA;EACA,sCAAA;EAAA,iCAAA;EAAA,8BAAA;CL8lBD;;AKvmBD;EAYI,WAAA;EACA,oBAAA;CL+lBH;;AK5mBD;EAiBI,yBAAA;CL+lBH;;AK1lBD;EACE,YAAA;EACA,aAAA;EACA,eAAA;EACA,mBAAA;CL6lBD;;AK1lBD;6EL6lB6E;;AK3lB7E;EACE,mBAAA;EACA,eAAA;EACA,UAAA;EACA,WAAA;EACA,iBAAA;EACA,uBAAA;EACA,sBAAA;CL8lBD;;AK7lBC;EACE,mBAAA;EACA,OAAA;EACA,QAAA;EACA,UAAA;EACA,aAAA;EACA,YAAA;EACA,UAAA;CLgmBH;;AK5lBD;6EL+lB6E;;AK5lB3E;EACE,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,qBAAA;CL+lBH;;AK9lBG;EACE,sBAAA;EACA,uBAAA;EACA,oBAAA;CLimBL;;AK5lBD;6EL+lB6E;;AK7lB7E;EACE,sCAAA;EACA,cAAA;EACA,mBAAA;EACA,YAAA;CLgmBD;;AK9lBC;EACE,mBAAA;CLimBH;;AK9lBC;EACE,2BAAA;EACA,gBAAA;EACA,iBAAA;EACA,WAAA;EACA,mBAAA;EACA,mCAAA;EACA,UAAA;CLimBH;;AK9lBC;EACE,0BAAA;EACA,iBAAA;CLimBH;;AK9lBC;EACE,0BAAA;EACA,kBAAA;EACA,iBAAA;EACA,sBAAA;CLimBH;;AK9lBC;EACE,eAAA;EACA,UAAA;EACA,iBAAA;EACA,mBAAA;EACA,mBAAA;EACA,SAAA;EACA,yCAAA;OAAA,oCAAA;UAAA,iCAAA;CLimBH;;AK7lBD;6ELgmB6E;;AK9lB7E;;;EAGE,0BAAA;EACA,4BAAA;CLimBD;;AM7/BD;EACE,eAAA;EACA,wBAAA;EACA,yBAAA;EACA,YAAA;CNggCD;;AM3/BC;EATF;IASuB,kBAAA;GNggCpB;CACF;;AM9/BD;EACE,iBAAA;EACA,kBAAA;CNigCD;;AMhgCC;EAHF;IAGuB,oBAAA;GNqgCpB;CACF;;AMngCD;EACE;IACE,+BAAA;QAAA,uBAAA;YAAA,mBAAA;IACA,yCAAA;IACA,6BAAA;QAAA,kBAAA;YAAA,SAAA;IACA,iBAAA;GNsgCD;;EMpgCD;IACE,+BAAA;QAAA,+BAAA;YAAA,2BAAA;IACA,6BAAA;QAAA,kBAAA;YAAA,SAAA;GNugCD;CACF;;AMpgCD;EAEI;IACE,wBAAA;IACA,4BAAA;GNsgCH;;EMzgCD;IAMI,wBAAA;IACA,4BAAA;GNugCH;CACF;;AMlgCD;EACE;IACE,2BAAA;GNqgCD;CACF;;AMjgCD;EACE,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,oBAAA;MAAA,mBAAA;UAAA,eAAA;EACA,+BAAA;EAAA,8BAAA;MAAA,wBAAA;UAAA,oBAAA;EAGA,wBAAA;EACA,yBAAA;CNkgCD;;AMz/BC;EAGE,oBAAA;MAAA,mBAAA;UAAA,eAAA;EACA,wBAAA;EACA,yBAAA;CN0/BH;;AM/gCD;EA4BQ,kCAAA;MAAA,qBAAA;EACA,oBAAA;CNu/BP;;AMphCD;EA4BQ,mCAAA;MAAA,sBAAA;EACA,qBAAA;CN4/BP;;AMzgCC;EAYM,6BAAA;MAAA,gBAAA;EACA,eAAA;CNigCP;;AM9gCC;EAYM,mCAAA;MAAA,sBAAA;EACA,qBAAA;CNsgCP;;AMniCD;EA4BQ,mCAAA;MAAA,sBAAA;EACA,qBAAA;CN2gCP;;AMxiCD;EA4BQ,6BAAA;MAAA,gBAAA;EACA,eAAA;CNghCP;;AM7iCD;EA4BQ,mCAAA;MAAA,sBAAA;EACA,qBAAA;CNqhCP;;AMljCD;EA4BQ,mCAAA;MAAA,sBAAA;EACA,qBAAA;CN0hCP;;AMviCC;EAYM,6BAAA;MAAA,gBAAA;EACA,eAAA;CN+hCP;;AM5jCD;EA4BQ,mCAAA;MAAA,sBAAA;EACA,qBAAA;CNoiCP;;AMjkCD;EA4BQ,mCAAA;MAAA,sBAAA;EACA,qBAAA;CNyiCP;;AMtjCC;EAYM,8BAAA;MAAA,iBAAA;EACA,gBAAA;CN8iCP;;AMziCG;EAlBF;IAyBQ,kCAAA;QAAA,qBAAA;IACA,oBAAA;GNuiCP;;EMjkCD;IAyBQ,mCAAA;QAAA,sBAAA;IACA,qBAAA;GN4iCP;;EMtlCH;IAyCU,6BAAA;QAAA,gBAAA;IACA,eAAA;GNijCP;;EM3kCD;IAyBQ,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNsjCP;;EMhlCD;IAyBQ,mCAAA;QAAA,sBAAA;IACA,qBAAA;GN2jCP;;EMrmCH;IAyCU,6BAAA;QAAA,gBAAA;IACA,eAAA;GNgkCP;;EM1lCD;IAyBQ,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNqkCP;;EM/lCD;IAyBQ,mCAAA;QAAA,sBAAA;IACA,qBAAA;GN0kCP;;EMpmCD;IAyBQ,6BAAA;QAAA,gBAAA;IACA,eAAA;GN+kCP;;EMznCH;IAyCU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNolCP;;EM9nCH;IAyCU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNylCP;;EMnoCH;IAyCU,8BAAA;QAAA,iBAAA;IACA,gBAAA;GN8lCP;CACF;;AMzlCG;EAhCF;IAuCQ,kCAAA;QAAA,qBAAA;IACA,oBAAA;GNulCP;;EM/oCH;IAuDU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GN4lCP;;EMppCH;IAuDU,6BAAA;QAAA,gBAAA;IACA,eAAA;GNimCP;;EMzoCD;IAuCQ,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNsmCP;;EM9pCH;IAuDU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GN2mCP;;EMnpCD;IAuCQ,6BAAA;QAAA,gBAAA;IACA,eAAA;GNgnCP;;EMxpCD;IAuCQ,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNqnCP;;EM7qCH;IAuDU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GN0nCP;;EMlqCD;IAuCQ,6BAAA;QAAA,gBAAA;IACA,eAAA;GN+nCP;;EMvqCD;IAuCQ,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNooCP;;EM5rCH;IAuDU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNyoCP;;EMjrCD;IAuCQ,8BAAA;QAAA,iBAAA;IACA,gBAAA;GN8oCP;CACF;;AOtvCD;;;;;;;;;;;;EAEE,sBAAA;EACA,kCAAA;EACA,iBAAA;EACA,iBAAA;EACA,eAAA;EACA,kCAAA;CPmwCD;;AOhwCD;EAAK,mBAAA;CPowCJ;;AOnwCD;EAAK,oBAAA;CPuwCJ;;AOtwCD;EAAK,qBAAA;CP0wCJ;;AOzwCD;EAAK,oBAAA;CP6wCJ;;AO5wCD;EAAK,oBAAA;CPgxCJ;;AO/wCD;EAAK,gBAAA;CPmxCJ;;AO9wCD;EAAM,mBAAA;CPkxCL;;AOjxCD;EAAM,oBAAA;CPqxCL;;AOpxCD;EAAM,qBAAA;CPwxCL;;AOvxCD;EAAM,oBAAA;CP2xCL;;AO1xCD;EAAM,oBAAA;CP8xCL;;AO7xCD;EAAM,gBAAA;CPiyCL;;AO/xCD;;;;;;EACE,oBAAA;CPuyCD;;AOtyCC;;;;;;EACE,eAAA;EACA,qBAAA;CP8yCH;;AO1yCD;EACE,cAAA;EACA,oBAAA;CP6yCD;;AQv1CD;6ER01C6E;;AQx1C7E;EACE,oBAAA;EACA,YAAA;EACA,cAAA;EACA,QAAA;EACA,gBAAA;EACA,gBAAA;EACA,SAAA;EACA,OAAA;EACA,oCAAA;OAAA,+BAAA;UAAA,4BAAA;EACA,wBAAA;EAAA,mBAAA;EAAA,gBAAA;EACA,uBAAA;EACA,aAAA;CR21CD;;AQv2CD;EAeI,eAAA;CR41CH;;AQ32CD;EAoBM,eAAA;EACA,iBAAA;EACA,eAAA;EACA,0BAAA;EACA,gBAAA;CR21CL;;AQt1CC;EACE,iBAAA;EACA,eAAA;EACA,kCAAA;EACA,UAAA;EACA,QAAA;EACA,gBAAA;EACA,mBAAA;EACA,SAAA;EACA,UAAA;CRy1CH;;AQp1CD;;;EAGE,8BAAA;EACA,oCAAA;EACA,oBAAA;CRu1CD;;AQp1CD;6ERu1C6E;;AQp1C3E;EACE,2BAAA;EACA,yBAAA;EACA,WAAA;CRu1CH;;AQ31CD;EAWM,YAAA;CRo1CL;;AQr1CG;EACE,YAAA;CRw1CL;;AQn2CD;EAWM,YAAA;CR41CL;;AQv2CD;EAWM,YAAA;CRg2CL;;AQ32CD;EAWM,YAAA;CRo2CL;;AQr2CG;EACE,YAAA;CRw2CL;;AQn3CD;EAWM,YAAA;CR42CL;;AQv3CD;EAWM,YAAA;CRg3CL;;AQ33CD;EAWM,YAAA;CRo3CL;;AQr3CG;EACE,YAAA;CRw3CL;;AQz3CG;EACE,YAAA;CR43CL;;AQv4CD;EAWM,YAAA;CRg4CL;;AQj4CG;EACE,YAAA;CRo4CL;;AQr4CG;EACE,YAAA;CRw4CL;;AQz4CG;EACE,YAAA;CR44CL;;AQv5CD;EAWM,YAAA;CRg5CL;;AQ14CD;6ER64C6E;;AQ34C7E;EACE,YAAA;EACA,gBAAA;EACA,qBAAA;EACA,mBAAA;EACA,YAAA;CR84CD;;AQ54CC;EAAE,eAAA;CRg5CH;;AQ74CD;6ERg5C6E;;AQ94C7E;;;EAEI,iBAAA;EACA,qBAAA;EACA,YAAA;CRk5CH;;AQh5CC;EAAa,yBAAA;CRo5Cd;;AQ15CD;EAQI,UAAA;EACA,oCAAA;UAAA,4BAAA;CRs5CH;;AGr/CD;6EHw/C6E;;AGt/C7E;EACE,oBAAA;EAEA,aAAA;EACA,QAAA;EACA,mBAAA;EACA,oBAAA;EACA,gBAAA;EACA,SAAA;EACA,OAAA;EACA,aAAA;CHw/CD;;AGt/CC;EAAU,YAAA;CH0/CX;;AGx/CC;;;EAGE,aAAA;CH2/CH;;AGv/CC;;;EAGE,oBAAA;MAAA,mBAAA;UAAA,eAAA;CH0/CH;;AGt/CC;EACE,aAAA;EACA,mBAAA;EACA,iBAAA;EACA,oBAAA;CHy/CH;;AG7/CC;EAMI,iBAAA;EACA,mBAAA;CH2/CL;;AG9hDD;;EAyCI,WAAA;EACA,aAAA;CH0/CH;;AGpiDD;EA+CI,0BAAA;EACA,yBAAA;EACA,mBAAA;EACA,0CAAA;EAAA,kCAAA;EAAA,gCAAA;EAAA,0BAAA;EAAA,mEAAA;CHy/CH;;AGv/CG;EACG,uBAAA;EACA,eAAA;EACA,YAAA;EACA,WAAA;EACA,iBAAA;EACA,mBAAA;EACA,SAAA;EACA,wBAAA;EAAA,mBAAA;EAAA,gBAAA;EACA,YAAA;CH0/CN;;AGvjDD;EA8DuB,sCAAA;OAAA,iCAAA;UAAA,8BAAA;CH6/CtB;;AG3jDD;EA+DsB,qCAAA;OAAA,gCAAA;UAAA,6BAAA;CHggDrB;;AG/jDD;EAsE2B,yCAAA;CH6/C1B;;AGx/CD;6EH2/C6E;;AGz/C7E;EACE,oBAAA;MAAA,kBAAA;UAAA,YAAA;EACA,iBAAA;EACA,8DAAA;EAAA,sDAAA;EAAA,6CAAA;EAAA,0CAAA;EAAA,4EAAA;CH4/CD;;AG//CD;EAMI,kBAAA;EACA,oBAAA;CH6/CH;;AG3/CG;EAAI,oBAAA;EAAsB,sBAAA;CHggD7B;;AGzgDD;EAYM,eAAA;EACA,mBAAA;CHigDL;;AGngDG;EAKI,iBAAA;EACA,UAAA;EACA,YAAA;EACA,YAAA;EACA,QAAA;EACA,WAAA;EACA,mBAAA;EACA,gCAAA;EAAA,2BAAA;EAAA,wBAAA;EACA,YAAA;CHkgDP;;AG/gDG;;EAiBI,WAAA;CHmgDP;;AG3/CD;6EH8/C6E;;AG5/C9D;EACb,gBAAA;CH+/CD;;AGhgDD;EAEU,gCAAA;CHkgDT;;AGpgDD;EAGW,8BAAA;CHqgDV;;AG//CD;6EHkgD6E;;AGhgD7E;EACE,iBAAA;EACA,mBAAA;EACA,cAAA;EAEA,aAAA;EACA,mBAAA;EACA,iBAAA;EACA,wDAAA;EAAA,gDAAA;EAAA,uCAAA;EAAA,oCAAA;EAAA,sEAAA;EACA,oBAAA;EACA,oBAAA;EACA,qBAAA;CHkgDD;;AGhgDC;EACE,eAAA;EACA,gBAAA;EACA,WAAA;EACA,mBAAA;EACA,UAAA;EACA,8BAAA;EAAA,yBAAA;EAAA,sBAAA;CHmgDH;;AG//CD;EACE,cAAA;EACA,UAAA;EACA,eAAA;EACA,aAAA;EACA,sBAAA;EACA,8BAAA;EAAA,yBAAA;EAAA,sBAAA;EACA,YAAA;CHkgDD;;AGzgDD;EASI,UAAA;EACA,cAAA;CHogDH;;AGhgDD;EACE,iBAAA;EACA,yHAAA;UAAA,iHAAA;EACA,iBAAA;EACA,gCAAA;EAEA,mBAAA;EACA,iBAAA;EACA,mBAAA;EAIA,YAAA;CH+/CD;;AG7/CC;EAEE,mBAAA;CH+/CH;;AG3/CD;EACE,sBAAA;CH8/CD;;AG5/CC;EACE,eAAA;EACA,eAAA;EACA,kBAAA;EACA,WAAA;EACA,aAAA;EACA,aAAA;EACA,mCAAA;EAAA,8BAAA;EAAA,2BAAA;EACA,oBAAA;CH+/CH;;AGvgDC;EAUI,iBAAA;CHigDL;;AG9gDD;EAgBM,oBAAA;CHkgDL;;AG/gDC;EAgBI,oBAAA;CHmgDL;;AG3/CD;6EH8/C6E;;AG3/C7E;EACE;IACE,sCAAA;IACA,mFAAA;YAAA,2EAAA;IACA,YAAA;IACA,sBAAA;IACA,aAAA;GH8/CD;;EGngDD;IAQI,qCAAA;GH+/CH;;EGvgDD;IAWe,SAAA;GHggDd;;EG3gDD;;;IAa0C,YAAA;GHogDzC;;EGjhDD;;;IAa0C,YAAA;GHogDzC;;EGjhDD;;;IAa0C,YAAA;GHogDzC;;EGhgDD;IACE,YAAA;IACA,eAAA;GHmgDD;;EG9/CC;IACE,iBAAA;IACA,oBAAA;QAAA,mBAAA;YAAA,eAAA;GHigDH;;EG//CG;IAAa,0BAAA;GHmgDhB;;EGlgDG;;IAA2B,0BAAA;GHugD9B;;EGvgDG;;IAA2B,0BAAA;GHugD9B;;EGvgDG;;IAA2B,0BAAA;GHugD9B;;EGrgDC;IACE,oBAAA;QAAA,mBAAA;YAAA,eAAA;IACA,UAAA;IACA,mBAAA;IACA,SAAA;GHwgDH;CACF;;AGngDD;6EHsgD6E;;AGngD7E;EAEe;IAAI,cAAA;GHsgDhB;;EGngDD;IACE,WAAA;GHsgDD;;EGpgDC;;IAEE,cAAA;GHugDH;;EG5gDD;IASI,iBAAA;IACA,iCAAA;IACA,aAAA;IACA,UAAA;IACA,YAAA;GHugDH;;EGphDD;IAgBM,aAAA;IACA,oBAAA;GHwgDL;;EGrgDG;IAAe,cAAA;GHygDlB;;EG7hDD;IAwBI,UAAA;IACA,eAAA;IACA,mBAAA;IACA,SAAA;GHygDH;;EGpiDD;IA4Ba,4BAAA;GH4gDZ;;EGtgDD;IACE,iBAAA;GHygDD;;EG1gDD;IAII,iCAAA;SAAA,4BAAA;YAAA,yBAAA;GH0gDH;;EG9gDD;IAOI,UAAA;IACA,iCAAA;SAAA,4BAAA;YAAA,yBAAA;GH2gDH;;EGnhDD;IASuB,iDAAA;SAAA,4CAAA;YAAA,yCAAA;GH8gDtB;;EG7gDG;IAAoB,6BAAA;SAAA,wBAAA;YAAA,qBAAA;GHihDvB;;EG3hDD;IAWqB,kDAAA;SAAA,6CAAA;YAAA,0CAAA;GHohDpB;;EG/hDD;IAcI,cAAA;GHqhDH;;EGlhDC;;IACE,oCAAA;SAAA,+BAAA;YAAA,4BAAA;GHshDH;CACF;;ASn1DD;EACE,oBAAA;EACA,+EAAA;UAAA,uEAAA;EACA,YAAA;EACA,qBAAA;EACA,kBAAA;EACA,mBAAA;EACA,0CAAA;EACA,WAAA;CTs1DD;;ASp1DC;EACE,eAAA;EACA,iBAAA;EACA,cAAA;EACA,mBAAA;EACA,mBAAA;EACA,YAAA;CTu1DH;;ASp1DC;EACE,gBAAA;EACA,mBAAA;EACA,iBAAA;CTu1DH;;AS72DD;EA6BI,YAAA;EACA,mBAAA;EACA,aAAA;EACA,oBAAA;EACA,uBAAA;EACA,4CAAA;EACA,aAAA;EACA,YAAA;EACA,mBAAA;EACA,gBAAA;EACA,8CAAA;EAAA,yCAAA;EAAA,sCAAA;CTo1DH;;AS33DD;EAyCM,eAAA;EACA,iBAAA;EACA,WAAA;EACA,YAAA;EACA,mBAAA;EACA,sCAAA;EACA,+BAAA;OAAA,0BAAA;UAAA,uBAAA;EACA,+BAAA;OAAA,0BAAA;UAAA,uBAAA;EACA,4CAAA;OAAA,uCAAA;UAAA,oCAAA;CTs1DL;;ASj1DC;EACE,mBAAA;EACA,iBAAA;EACA,uBAAA;EACA,4BAAA;EACA,OAAA;EACA,SAAA;EACA,UAAA;EACA,QAAA;CTo1DH;;ASl1DG;EACE,eAAA;EACA,aAAA;EACA,YAAA;EACA,aAAA;EACA,qCAAA;EACA,8GAAA;CTq1DL;;AS90DD;EACI,uBAAA;CTi1DH;;AS/0DC;EACE,gBAAA;CTk1DH;;ASh1DC;EACE,sBAAA;CTm1DH;;ASj1DC;EACE,eAAA;EACA,0BAAA;CTo1DH;;ASl1DC;EACE,cAAA;EACA,mBAAA;CTq1DH;;ASn1DC;EACE,iBAAA;EACA,iBAAA;EACA,gBAAA;CTs1DH;;ASp1DC;EACE,sBAAA;EACA,oBAAA;EACA,mBAAA;EACA,YAAA;EACA,aAAA;EACA,uBAAA;EACA,4BAAA;EACA,uBAAA;CTu1DH;;ASn1DC;EACE,oBAAA;CTs1DH;;ASv1DC;EAGI,sBAAA;EACA,gBAAA;EACA,mBAAA;EACA,sBAAA;EACA,aAAA;EACA,sBAAA;CTw1DL;;ASl4DD;EA+CI,WAAA;CTu1DH;;ASn1DC;EAEI,mBAAA;EACA,6DAAA;UAAA,qDAAA;EACA,gBAAA;EACA,sBAAA;EACA,aAAA;EACA,oBAAA;EACA,kBAAA;EACA,eAAA;EACA,gBAAA;EACA,kBAAA;EACA,0BAAA;CTq1DL;;ASj2DC;EAcM,yCAAA;UAAA,iCAAA;CTu1DP;;AS/0DD;EAEI;IACE,mBAAA;GTi1DH;CACF;;AS30DD;EACE;IACE,kBAAA;IACA,qBAAA;GT80DD;;ES50DC;IACE,gBAAA;GT+0DH;;ES30DD;IACE,eAAA;IACA,yBAAA;GT80DD;CACF;;AU5/DD;EAEI,WAAA;EACA,aAAA;CV8/DH;;AU1/DD;EACE,sBAAA;EACA,kBAAA;CV6/DD;;AU3/DC;EACE,oBAAA;CV8/DH;;AU7/DG;EACE,eAAA;EACA,cAAA;EACA,eAAA;EACA,UAAA;EACA,iBAAA;EACA,mBAAA;CVggEL;;AUtgEG;EASI,+BAAA;OAAA,0BAAA;UAAA,uBAAA;EACA,oCAAA;UAAA,4BAAA;CVigEP;;AU9/DG;EACE,eAAA;EACA,YAAA;EACA,gBAAA;EACA,aAAA;EACA,kBAAA;EACA,mBAAA;CVigEL;;AU//DG;EACE,eAAA;EACA,YAAA;EACA,mBAAA;EACA,aAAA;EACA,4BAAA;EACA,uBAAA;EACA,2CAAA;EAAA,mCAAA;EAAA,iCAAA;EAAA,2BAAA;EAAA,sEAAA;CVkgEL;;AU7/DC;EACE,mBAAA;EACA,uBAAA;EACA,YAAA;EACA,kBAAA;EACA,aAAA;EACA,UAAA;EACA,kBAAA;EACA,mBAAA;EACA,mBAAA;EACA,SAAA;EACA,yCAAA;OAAA,oCAAA;UAAA,iCAAA;EACA,YAAA;EACA,YAAA;CVggEH;;AU5/DC;EACE,mBAAA;EACA,2BAAA;EACA,oBAAA;EACA,eAAA;CV+/DH;;AUngEC;EAMI,2BAAA;CVigEL;;AU7/DC;EACE,YAAA;EACA,mBAAA;EACA,aAAA;EACA,iBAAA;EACA,iBAAA;EACA,WAAA;CVggEH;;AUtgEC;EAQI,YAAA;CVkgEL;;AU9/DC;EACE,cAAA;EACA,wBAAA;EACA,YAAA;EACA,qBAAA;CVigEH;;AUrgEC;EAOI,eAAA;CVkgEL;;AUngEG;EAGI,YAAA;CVogEP;;AU5/DD;6EV+/D6E;;AU7/D7E;EACE,oBAAA;EACA,kBAAA;CVggED;;AU9/DC;EAAc,oBAAA;CVkgEf;;AUjgEC;EAAmB,cAAA;CVqgEpB;;AUpgEC;EACE,gBAAA;EACA,iBAAA;CVugEH;;AU/gED;EAWI,UAAA;CVwgEH;;AUngED;EAEE;IACE,oBAAA;IACA,qBAAA;GVqgED;;EUpgEC;IACE,mBAAA;GVugEH;;EUrgEC;IACE,iBAAA;GVwgEH;;EUtgEC;IACE,cAAA;GVygEH;CACF;;AUpgED;EACE;IAAmB,cAAA;GVwgElB;CACF;;AWppED;EACE,2BAAA;EACA,gBAAA;EACA,iBAAA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;CXupED;;AWrpEC;EACE,0BAAA;CXwpEH;;AWzpEC;EAEY,0BAAA;CX2pEb;;AWxpEC;EACE,eAAA;EACA,kBAAA;CX2pEH;;AWxpEC;EACE,mDAAA;OAAA,8CAAA;UAAA,2CAAA;EACA,WAAA;CX2pEH;;AWxpEC;;EAEE,sBAAA;EACA,iBAAA;EACA,uBAAA;CX2pEH;;AWnpED;EACE;IACE,8BAAA;YAAA,sBAAA;GXspED;CACF;;AWzpED;EACE;IACE,yBAAA;OAAA,sBAAA;GXspED;CACF;;AWzpED;EACE;IACE,8BAAA;SAAA,yBAAA;YAAA,sBAAA;GXspED;CACF;;AY5rED;;EACE,uBAAA;EACA,mBAAA;EACA,UAAA;EACA,yBAAA;UAAA,iBAAA;EACA,eAAA;EACA,gBAAA;EACA,sBAAA;EACA,yCAAA;EACA,aAAA;EACA,UAAA;EACA,gBAAA;EACA,WAAA;EACA,iBAAA;EACA,aAAA;EACA,mBAAA;EACA,sBAAA;EACA,wBAAA;EACA,0BAAA;EACA,gEAAA;EAAA,wDAAA;EAAA,mDAAA;EAAA,gDAAA;EAAA,uEAAA;EACA,uBAAA;EACA,oBAAA;CZgsED;;AY9rEG;;;;EAAK,iBAAA;CZqsER;;AY5tED;;;;EA2BI,0BAAA;EACA,iCAAA;CZwsEH;;AYpuED;;EA+BI,0BAAA;CZ0sEH;;AYvsEC;;EACE,kBAAA;EACA,gBAAA;EACA,aAAA;EACA,kBAAA;CZ2sEH;;AYzsEC;;EACE,cAAA;EACA,yBAAA;UAAA,iBAAA;CZ6sEH;;AY5sEG;;;;;;EAGE,cAAA;EACA,yBAAA;UAAA,iBAAA;CZktEL;;AYjwED;;EAoDI,0BAAA;EACA,YAAA;CZktEH;;AYjtEG;;EAAQ,0BAAA;CZstEX;;AY5wED;;EAyDI,mBAAA;EACA,aAAA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;CZwtEH;;AYrxED;;EAgEI,mBAAA;EACA,aAAA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,gBAAA;CZ0tEH;;AY/xED;;EAwEI,oDAAA;UAAA,4CAAA;EACA,YAAA;EACA,uBAAA;CZ4tEH;;AYtyED;;EA2EY,sCAAA;CZguEX;;AY3yED;;;;EAgFI,0BAAA;EACA,YAAA;CZkuEH;;AYnzED;;;;EAkFY,0BAAA;CZwuEX;;AYvuEG;;;;EAEE,iBAAA;EACA,kBAAA;EACA,sBAAA;EACA,oBAAA;CZ4uEL;;AYp0ED;;EA4FuB,iBAAA;CZ6uEtB;;AY5uEC;;EAA2B,iBAAA;CZivE5B;;AY90ED;;EA8FmB,gBAAA;CZqvElB;;AY7uED;EACE,mBAAA;EACA,eAAA;EACA,0BAAA;CZgvED;;AY1uED;EACE,YAAA;EACA,kBAAA;EACA,gBAAA;EACA,qBAAA;EACA,YAAA;EACA,uBAAA;EACA,uBAAA;EACA,uBAAA;EACA,mBAAA;EACA,yDAAA;UAAA,iDAAA;EACA,wFAAA;EAAA,gFAAA;EAAA,2EAAA;EAAA,wEAAA;EAAA,6GAAA;EACA,aAAA;CZ6uED;;AY3uEC;EACE,sBAAA;EACA,WAAA;EACA,0FAAA;UAAA,kFAAA;CZ8uEH;;AYzuED;EACE,8BAAA;EACA,mBAAA;EACA,6DAAA;UAAA,qDAAA;EACA,eAAA;EACA,eAAA;EACA,gBAAA;EACA,iBAAA;EACA,iBAAA;EACA,iBAAA;EACA,iBAAA;EACA,iBAAA;EACA,mBAAA;EACA,6BAAA;EAAA,wBAAA;EAAA,qBAAA;EACA,YAAA;CZ4uED;;AY1vED;EAiBI,yCAAA;UAAA,iCAAA;CZ6uEH;;Aan4ED;6Ebs4E6E;;Aap4E7E;EACE,iBAAA;EACA,oBAAA;Cbu4ED;;Aal4EC;EACE,sBAAA;Cbq4EH;;Aal4EC;EACE,YAAA;EACA,kBAAA;EACA,aAAA;EACA,kBAAA;EACA,sBAAA;EACA,mCAAA;EACA,WAAA;Cbq4EH;;Aal4EC;EACE,mBAAA;EACA,gBAAA;EACA,eAAA;EACA,mBAAA;Cbq4EH;;Aaj4EC;EACE,uBAAA;EACA,iBAAA;Cbo4EH;;Aah4EC;EACE,oBAAA;Cbm4EH;;Aap4EC;EAGW,2BAAA;Cbq4EZ;;Aax4EC;EAOI,iBAAA;EACA,0BAAA;EACA,oBAAA;Cbq4EL;;Aa94EC;;EAYI,oBAAA;Cbu4EL;;Aan5EC;EAgBI,0BAAA;EACA,mCAAA;Cbu4EL;;Aax5EC;EAqBI,eAAA;EACA,oBAAA;Cbu4EL;;Aa75EC;;;EA0BI,eAAA;Cby4EL;;Aap4EC;EACE,kBAAA;Cbu4EH;;Aan4EC;EACE,mBAAA;Cbs4EH;;Aaj4ED;6Ebo4E6E;;Aal4E7E;EACE,YAAA;EACA,gBAAA;EACA,oBAAA;MAAA,qBAAA;UAAA,aAAA;EACA,mCAAA;Cbq4ED;;Aaz4ED;EAOI,eAAA;Cbs4EH;;Aa74ED;EAQe,2BAAA;Cby4Ed;;Aa34EC;EAGY,YAAA;Cb44Eb;;Aav4ED;EACE,mBAAA;EACA,gBAAA;Cb04ED;;Aa54ED;EAIY,YAAA;Cb44EX;;Aaz4ED;EACE,YAAA;EACA,mBAAA;EACA,gBAAA;Cb44ED;;Aaz4ED;6Eb44E6E;;Aa14E7E;EACE,mBAAA;EACA,sBAAA;Cb64ED;;Aa/4ED;EAKI,YAAA;EACA,oBAAA;Cb84EH;;Aah5EC;EAGY,kCAAA;Cbi5Eb;;Aa94EC;EACE,iBAAA;Cbi5EH;;Aa55ED;EAYoB,0BAAA;Cbo5EnB;;Aaj5EC;;;EAAO,iBAAA;Cbu5ER;;Aap5ED;6Ebu5E6E;;Aar5E7E;EACE,mBAAA;EACA,gBAAA;EACA,2BAAA;EACA,oBAAA;EACA,0BAAA;Cbw5ED;;Aar5EC;EACE,YAAA;EACA,gBAAA;EACA,iBAAA;EACA,UAAA;Cbw5EH;;Aap6ED;EAgBI,kBAAA;EACA,gBAAA;Cbw5EH;;Aaz6ED;EAkBM,YAAA;Cb25EL;;Aa76ED;EAkB2B,YAAA;Cb+5E1B;;Aal6EC;EAIgB,eAAA;Cbk6EjB;;Aa/5EC;EACE,iBAAA;Cbk6EH;;Aa/5EC;EACE,aAAA;EACA,YAAA;EACA,mBAAA;EACA,WAAA;EACA,UAAA;EACA,mCAAA;EACA,uBAAA;EACA,mBAAA;Cbk6EH;;Aa55ED;6Eb+5E6E;;Aa/2E7E;6Ebk3E6E;;Aah3E7E;EACE,oBAAA;Cbm3ED;;Aaj3EC;EACE,eAAA;EACA,oBAAA;EACA,eAAA;EACA,oBAAA;Cbo3EH;;Aa33ED;EAUgB,uBAAA;Cbq3Ef;;Aa/3ED;EAaI,mBAAA;EACA,iBAAA;EACA,oBAAA;Cbs3EH;;Aar4ED;EAiBM,aAAA;EACA,2BAAA;EACA,mBAAA;EACA,OAAA;EACA,WAAA;EACA,YAAA;EACA,YAAA;Cbw3EL;;Aa/4ED;EA2BM,YAAA;EACA,oBAAA;EACA,eAAA;EACA,eAAA;EACA,0BAAA;Cbw3EL;;Aav5ED;EAqCI,qBAAA;EAAA,qBAAA;EAAA,cAAA;Cbs3EH;;Aap3EG;EACE,iBAAA;EACA,YAAA;Cbu3EL;;Aah6ED;;;EA6CM,iBAAA;Cby3EL;;Aal3ED;6Ebq3E6E;;Aan3E7E;EACE,sBAAA;Cbs3ED;;Aap3EC;EACE,gBAAA;EACA,iBAAA;EACA,aAAA;EACA,kBAAA;EACA,iBAAA;EACA,qBAAA;EACA,0BAAA;Cbu3EH;;Aap3EC;EACE,oBAAA;EACA,WAAA;EACA,aAAA;Cbu3EH;;Aap3EC;EACE,mBAAA;Cbu3EH;;Aar3EG;EACE,0BAAA;EACA,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,0BAAA;MAAA,uBAAA;UAAA,oBAAA;EACA,mBAAA;EACA,UAAA;EACA,OAAA;EACA,gBAAA;EACA,iBAAA;Cbw3EL;;Aat5ED;EAkCM,YAAA;EACA,gBAAA;EACA,mBAAA;EACA,YAAA;Cbw3EL;;Aa75ED;EAuCQ,gCAAA;Cb03EP;;Aal3ED;6Ebq3E6E;;Aal3E7E;EACE;IAEI,mBAAA;IACA,iBAAA;Gbo3EH;;Eaj3EC;IACE,oBAAA;IACA,kBAAA;Gbo3EH;;Eat3EC;IAII,sBAAA;Gbs3EL;CACF;;Aah3ED;EACE;IACE,kBAAA;Gbm3ED;;Eaj3ED;;IAEE,wBAAA;IACA,yBAAA;Gbo3ED;CACF;;AcltFD;6EdqtF6E;;AcntF7E;EACE,mBAAA;EACA,iBAAA;CdstFD;;AcxtFD;;;;;;EAIoB,cAAA;Cd6tFnB;;Ac3tFC;EACE,sBAAA;EACA,mBAAA;Cd8tFH;;Ac3tFC;EACE,qBAAA;EACA,oBAAA;EACA,0BAAA;EACA,gBAAA;EACA,iBAAA;Cd8tFH;;Ac9uFD;EAqBI,0BAAA;EACA,eAAA;EACA,mBAAA;EACA,gBAAA;Cd6tFH;;AcvtFD;EACE,oBAAA;Cd0tFD;;AcxtFC;EACE,0BAAA;MAAA,uBAAA;UAAA,oBAAA;EACA,+BAAA;EACA,UAAA;EACA,0BAAA;EACA,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,gBAAA;EACA,kBAAA;EACA,QAAA;EACA,eAAA;EACA,wBAAA;EACA,mBAAA;EACA,OAAA;Cd2tFH;;Ac1uFD;EAkB4C,sBAAA;Cd4tF3C;;Ac3tFqB;EAAwB,sBAAA;Cd+tF7C;;Ac5tFC;EACE,wBAAA;EACA,eAAA;EACA,iBAAA;EACA,6BAAA;EACA,mBAAA;Cd+tFH;;Ac7tFW;EACN,0BAAA;CdguFL;;Ac5tFC;EACE,0BAAA;EACA,gBAAA;EACA,iBAAA;EACA,UAAA;Cd+tFH;;AeryFD;EACE,iBAAA;EACA,kBAAA;CfwyFD;;Ae1yFD;EAKI,UAAA;EACA,mBAAA;EACA,yCAAA;CfyyFH;;AetyFC;EACE,iBAAA;EACA,cAAA;CfyyFH;;AetyFC;EACE,iBAAA;EACA,eAAA;EACA,gBAAA;CfyyFH;;Ae3zFD;EAsBI,sBAAA;CfyyFH;;Ae/zFD;EAyBa,sBAAA;Cf0yFZ;;Aen0FD;;;EA8BI,YAAA;Cf2yFH;;AetyFD;EACE,mBAAA;EACA,kBAAA;EACA,cAAA;EACA,iBAAA;EACA,YAAA;EACA,oBAAA;EACA,mBAAA;EACA,iBAAA;CfyyFD;;AetyFD;EACE,YAAA;EACA,cAAA;EACA,2BAAA;EACA,mBAAA;CfyyFD;;Ae7yFD;EAMI,cAAA;Cf2yFH;;AgB91FD;EACI,+BAAA;OAAA,0BAAA;UAAA,uBAAA;EACA,kCAAA;OAAA,6BAAA;UAAA,0BAAA;ChBi2FH;;AgBn2FD;EAIQ,4CAAA;OAAA,uCAAA;UAAA,oCAAA;ChBm2FP;;AgB91FD;EAAW,iCAAA;OAAA,4BAAA;UAAA,yBAAA;ChBk2FV;;AgBj2FD;EAAe,qCAAA;OAAA,gCAAA;UAAA,6BAAA;ChBq2Fd;;AgB/1FD;EACI;IACI,uEAAA;YAAA,+DAAA;GhBk2FL;;EgB/1FC;IACI,WAAA;IACA,0CAAA;YAAA,kCAAA;GhBk2FL;;EgB/1FC;IACI,0CAAA;YAAA,kCAAA;GhBk2FL;;EgB/1FC;IACI,0CAAA;YAAA,kCAAA;GhBk2FL;;EgB/1FC;IACI,WAAA;IACA,6CAAA;YAAA,qCAAA;GhBk2FL;;EgB/1FC;IACI,6CAAA;YAAA,qCAAA;GhBk2FL;;EgB/1FC;IACI,WAAA;IACA,oCAAA;YAAA,4BAAA;GhBk2FL;CACF;;AgBh4FD;EACI;IACI,kEAAA;OAAA,+DAAA;GhBk2FL;;EgB/1FC;IACI,WAAA;IACA,kCAAA;GhBk2FL;;EgB/1FC;IACI,kCAAA;GhBk2FL;;EgB/1FC;IACI,kCAAA;GhBk2FL;;EgB/1FC;IACI,WAAA;IACA,qCAAA;GhBk2FL;;EgB/1FC;IACI,qCAAA;GhBk2FL;;EgB/1FC;IACI,WAAA;IACA,4BAAA;GhBk2FL;CACF;;AgBh4FD;EACI;IACI,uEAAA;SAAA,kEAAA;YAAA,+DAAA;GhBk2FL;;EgB/1FC;IACI,WAAA;IACA,0CAAA;YAAA,kCAAA;GhBk2FL;;EgB/1FC;IACI,0CAAA;YAAA,kCAAA;GhBk2FL;;EgB/1FC;IACI,0CAAA;YAAA,kCAAA;GhBk2FL;;EgB/1FC;IACI,WAAA;IACA,6CAAA;YAAA,qCAAA;GhBk2FL;;EgB/1FC;IACI,6CAAA;YAAA,qCAAA;GhBk2FL;;EgB/1FC;IACI,WAAA;IACA,oCAAA;YAAA,4BAAA;GhBk2FL;CACF;;AgB71FD;EACI;IACI,uEAAA;YAAA,+DAAA;GhBg2FL;;EgB71FC;IACI,WAAA;IACA,8CAAA;YAAA,sCAAA;GhBg2FL;;EgB71FC;IACI,WAAA;IACA,2CAAA;YAAA,mCAAA;GhBg2FL;;EgB71FC;IACI,4CAAA;YAAA,oCAAA;GhBg2FL;;EgB71FC;IACI,0CAAA;YAAA,kCAAA;GhBg2FL;;EgB71FC;IACI,wBAAA;YAAA,gBAAA;GhBg2FL;CACF;;AgBz3FD;EACI;IACI,kEAAA;OAAA,+DAAA;GhBg2FL;;EgB71FC;IACI,WAAA;IACA,sCAAA;GhBg2FL;;EgB71FC;IACI,WAAA;IACA,mCAAA;GhBg2FL;;EgB71FC;IACI,oCAAA;GhBg2FL;;EgB71FC;IACI,kCAAA;GhBg2FL;;EgB71FC;IACI,mBAAA;OAAA,gBAAA;GhBg2FL;CACF;;AgBz3FD;EACI;IACI,uEAAA;SAAA,kEAAA;YAAA,+DAAA;GhBg2FL;;EgB71FC;IACI,WAAA;IACA,8CAAA;YAAA,sCAAA;GhBg2FL;;EgB71FC;IACI,WAAA;IACA,2CAAA;YAAA,mCAAA;GhBg2FL;;EgB71FC;IACI,4CAAA;YAAA,oCAAA;GhBg2FL;;EgB71FC;IACI,0CAAA;YAAA,kCAAA;GhBg2FL;;EgB71FC;IACI,wBAAA;SAAA,mBAAA;YAAA,gBAAA;GhBg2FL;CACF;;AgB71FD;EACI;IACI,oCAAA;YAAA,4BAAA;GhBg2FL;;EgB71FC;IACI,6CAAA;YAAA,qCAAA;GhBg2FL;;EgB71FC;IACI,oCAAA;YAAA,4BAAA;GhBg2FL;CACF;;AgB32FD;EACI;IACI,4BAAA;GhBg2FL;;EgB71FC;IACI,qCAAA;GhBg2FL;;EgB71FC;IACI,4BAAA;GhBg2FL;CACF;;AgB32FD;EACI;IACI,oCAAA;YAAA,4BAAA;GhBg2FL;;EgB71FC;IACI,6CAAA;YAAA,qCAAA;GhBg2FL;;EgB71FC;IACI,oCAAA;YAAA,4BAAA;GhBg2FL;CACF;;AgB51FD;EACI;IACI,WAAA;GhB+1FL;;EgB71FC;IACI,WAAA;IACA,mCAAA;YAAA,2BAAA;GhBg2FL;;EgB91FC;IACI,WAAA;IACA,oCAAA;YAAA,4BAAA;GhBi2FL;CACF;;AgB52FD;EACI;IACI,WAAA;GhB+1FL;;EgB71FC;IACI,WAAA;IACA,8BAAA;OAAA,2BAAA;GhBg2FL;;EgB91FC;IACI,WAAA;IACA,+BAAA;OAAA,4BAAA;GhBi2FL;CACF;;AgB52FD;EACI;IACI,WAAA;GhB+1FL;;EgB71FC;IACI,WAAA;IACA,mCAAA;SAAA,8BAAA;YAAA,2BAAA;GhBg2FL;;EgB91FC;IACI,WAAA;IACA,oCAAA;SAAA,+BAAA;YAAA,4BAAA;GhBi2FL;CACF;;AgB71FD;EACI;IAAO,gCAAA;YAAA,wBAAA;GhBi2FR;;EgBh2FC;IAAK,kCAAA;YAAA,0BAAA;GhBo2FN;CACF;;AgBv2FD;EACI;IAAO,2BAAA;OAAA,wBAAA;GhBi2FR;;EgBh2FC;IAAK,6BAAA;OAAA,0BAAA;GhBo2FN;CACF;;AgBv2FD;EACI;IAAO,gCAAA;SAAA,2BAAA;YAAA,wBAAA;GhBi2FR;;EgBh2FC;IAAK,kCAAA;SAAA,6BAAA;YAAA,0BAAA;GhBo2FN;CACF","file":"main.scss","sourcesContent":["@charset \"UTF-8\";\n@import url(~normalize.css/normalize.css);\n@import url(~prismjs/themes/prism.css);\npre.line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber; }\n\npre.line-numbers > code {\n  position: relative; }\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber; }\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right; }\n\n@font-face {\n  font-family: 'mapache';\n  src: url(\"../fonts/mapache.ttf?8baq25\") format(\"truetype\"), url(\"../fonts/mapache.woff?8baq25\") format(\"woff\"), url(\"../fonts/mapache.svg?8baq25#mapache\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal; }\n\n[class^=\"i-\"]:before, [class*=\" i-\"]:before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.i-navigate_before:before {\n  content: \"\\e408\"; }\n\n.i-navigate_next:before {\n  content: \"\\e409\"; }\n\n.i-tag:before {\n  content: \"\\e54e\"; }\n\n.i-keyboard_arrow_down:before {\n  content: \"\\e313\"; }\n\n.i-arrow_upward:before {\n  content: \"\\e5d8\"; }\n\n.i-cloud_download:before {\n  content: \"\\e2c0\"; }\n\n.i-star:before {\n  content: \"\\e838\"; }\n\n.i-keyboard_arrow_up:before {\n  content: \"\\e316\"; }\n\n.i-open_in_new:before {\n  content: \"\\e89e\"; }\n\n.i-warning:before {\n  content: \"\\e002\"; }\n\n.i-back:before {\n  content: \"\\e5c4\"; }\n\n.i-forward:before {\n  content: \"\\e5c8\"; }\n\n.i-chat:before {\n  content: \"\\e0cb\"; }\n\n.i-close:before {\n  content: \"\\e5cd\"; }\n\n.i-code2:before {\n  content: \"\\e86f\"; }\n\n.i-favorite:before {\n  content: \"\\e87d\"; }\n\n.i-link:before {\n  content: \"\\e157\"; }\n\n.i-menu:before {\n  content: \"\\e5d2\"; }\n\n.i-feed:before {\n  content: \"\\e0e5\"; }\n\n.i-search:before {\n  content: \"\\e8b6\"; }\n\n.i-share:before {\n  content: \"\\e80d\"; }\n\n.i-check_circle:before {\n  content: \"\\e86c\"; }\n\n.i-play:before {\n  content: \"\\e901\"; }\n\n.i-download:before {\n  content: \"\\e900\"; }\n\n.i-code:before {\n  content: \"\\f121\"; }\n\n.i-behance:before {\n  content: \"\\f1b4\"; }\n\n.i-spotify:before {\n  content: \"\\f1bc\"; }\n\n.i-codepen:before {\n  content: \"\\f1cb\"; }\n\n.i-github:before {\n  content: \"\\f09b\"; }\n\n.i-linkedin:before {\n  content: \"\\f0e1\"; }\n\n.i-flickr:before {\n  content: \"\\f16e\"; }\n\n.i-dribbble:before {\n  content: \"\\f17d\"; }\n\n.i-pinterest:before {\n  content: \"\\f231\"; }\n\n.i-map:before {\n  content: \"\\f041\"; }\n\n.i-twitter:before {\n  content: \"\\f099\"; }\n\n.i-facebook:before {\n  content: \"\\f09a\"; }\n\n.i-youtube:before {\n  content: \"\\f16a\"; }\n\n.i-instagram:before {\n  content: \"\\f16d\"; }\n\n.i-google:before {\n  content: \"\\f1a0\"; }\n\n.i-pocket:before {\n  content: \"\\f265\"; }\n\n.i-reddit:before {\n  content: \"\\f281\"; }\n\n.i-snapchat:before {\n  content: \"\\f2ac\"; }\n\n/*\r\n@package godofredoninja\r\n\r\n========================================================================\r\nMapache variables styles\r\n========================================================================\r\n*/\n/**\r\n* Table of Contents:\r\n*\r\n*   1. Colors\r\n*   2. Fonts\r\n*   3. Typography\r\n*   4. Header\r\n*   5. Footer\r\n*   6. Code Syntax\r\n*   7. buttons\r\n*   8. container\r\n*   9. Grid\r\n*   10. Media Query Ranges\r\n*   11. Icons\r\n*/\n/* 1. Colors\r\n========================================================================== */\n/* 2. Fonts\r\n========================================================================== */\n/* 3. Typography\r\n========================================================================== */\n/* 4. Header\r\n========================================================================== */\n/* 5. Entry articles\r\n========================================================================== */\n/* 5. Footer\r\n========================================================================== */\n/* 6. Code Syntax\r\n========================================================================== */\n/* 7. buttons\r\n========================================================================== */\n/* 8. container\r\n========================================================================== */\n/* 9. Grid\r\n========================================================================== */\n/* 10. Media Query Ranges\r\n========================================================================== */\n/* 11. icons\r\n========================================================================== */\n.header.toolbar-shadow {\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28); }\n\na.external::after, hr::before, .warning:before, .note:before, .success:before, .btn.btn-download-cloud:after, .nav-mob-follow a.btn-download-cloud:after, .btn.btn-download:after, .nav-mob-follow a.btn-download:after {\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.u-clear:after {\n  clear: both;\n  content: \"\";\n  display: table; }\n\n.u-not-avatar {\n  background-image: url(\"../images/avatar.png\"); }\n\n.u-b-b, .sidebar-title {\n  border-bottom: solid 1px #eee; }\n\n.u-b-t {\n  border-top: solid 1px #eee; }\n\n.u-p-t-2 {\n  padding-top: 2rem; }\n\n.u-unstyled {\n  list-style-type: none;\n  margin: 0;\n  padding-left: 0; }\n\n.u-floatLeft {\n  float: left !important; }\n\n.u-floatRight {\n  float: right !important; }\n\n.u-flex {\n  display: flex;\n  flex-direction: row; }\n\n.u-flex-wrap {\n  display: flex;\n  flex-wrap: wrap; }\n\n.u-flex-center, .header-logo,\n.header-follow a,\n.header-menu a {\n  display: flex;\n  align-items: center; }\n\n.u-flex-aling-right {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end; }\n\n.u-flex-aling-center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column; }\n\n.u-m-t-1 {\n  margin-top: 1rem; }\n\n/* Tags\r\n========================================================================== */\n.u-tags {\n  font-size: 12px !important;\n  margin: 3px !important;\n  color: #4c5765 !important;\n  background-color: #ebebeb !important;\n  transition: all .3s; }\n  .u-tags:before {\n    padding-right: 5px;\n    opacity: .8; }\n  .u-tags:hover {\n    background-color: #4285f4 !important;\n    color: #fff !important; }\n\n.u-hide {\n  display: none !important; }\n\n@media only screen and (max-width: 766px) {\n  .u-h-b-md {\n    display: none !important; } }\n\n@media only screen and (max-width: 992px) {\n  .u-h-b-lg {\n    display: none !important; } }\n\n@media only screen and (min-width: 766px) {\n  .u-h-a-md {\n    display: none !important; } }\n\n@media only screen and (min-width: 992px) {\n  .u-h-a-lg {\n    display: none !important; } }\n\nhtml {\n  box-sizing: border-box;\n  font-size: 16px;\n  -webkit-tap-highlight-color: transparent; }\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box; }\n\na {\n  color: #039be5;\n  outline: 0;\n  text-decoration: none;\n  -webkit-tap-highlight-color: transparent; }\n  a:focus {\n    text-decoration: none; }\n  a.external::after {\n    content: \"\";\n    margin-left: 5px; }\n\nbody {\n  color: #333;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 0 auto; }\n\nfigure {\n  margin: 0; }\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto; }\n  img:not([src]) {\n    visibility: hidden; }\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto; }\n\ni {\n  display: inline-block;\n  vertical-align: middle; }\n\nhr {\n  background: #F1F2F1;\n  background: linear-gradient(to right, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  border: none;\n  height: 1px;\n  margin: 80px auto;\n  max-width: 90%;\n  position: relative; }\n  hr::before {\n    background: #fff;\n    color: rgba(73, 55, 65, 0.75);\n    content: \"\";\n    display: block;\n    font-size: 35px;\n    left: 50%;\n    padding: 0 25px;\n    position: absolute;\n    top: 50%;\n    transform: translate(-50%, -50%); }\n\nblockquote {\n  border-left: 4px solid #4285f4;\n  padding: .75rem 1.5rem;\n  background: #fbfbfc;\n  color: #757575;\n  font-size: 1.125rem;\n  line-height: 1.7;\n  margin: 0 0 1.25rem;\n  quotes: none; }\n\nol, ul, blockquote {\n  margin-left: 2rem; }\n\nstrong {\n  font-weight: 500; }\n\nsmall, .small {\n  font-size: 85%; }\n\nol {\n  padding-left: 40px;\n  list-style: decimal outside; }\n\nmark {\n  background-image: linear-gradient(to bottom, #ebf2fe, #d3e2fc);\n  background-color: transparent; }\n\n.footer,\n.main {\n  transition: transform .5s ease;\n  z-index: 2; }\n\n/* Code Syntax\n========================================================================== */\nkbd, samp, code {\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  color: #c7254e;\n  background: #f7f7f7;\n  border-radius: 4px;\n  padding: 4px 6px;\n  white-space: pre-wrap; }\n\ncode[class*=language-],\npre[class*=language-] {\n  color: #37474f;\n  line-height: 1.5; }\n  code[class*=language-] .token.comment,\n  pre[class*=language-] .token.comment {\n    opacity: .8; }\n  code[class*=language-].line-numbers,\n  pre[class*=language-].line-numbers {\n    padding-left: 58px; }\n    code[class*=language-].line-numbers::before,\n    pre[class*=language-].line-numbers::before {\n      content: \"\";\n      position: absolute;\n      left: 0;\n      top: 0;\n      background: #F0EDEE;\n      width: 40px;\n      height: 100%; }\n  code[class*=language-] .line-numbers-rows,\n  pre[class*=language-] .line-numbers-rows {\n    border-right: none;\n    top: -3px;\n    left: -58px; }\n    code[class*=language-] .line-numbers-rows > span::before,\n    pre[class*=language-] .line-numbers-rows > span::before {\n      padding-right: 0;\n      text-align: center;\n      opacity: .8; }\n\npre {\n  background-color: #f7f7f7 !important;\n  padding: 1rem;\n  overflow: hidden;\n  border-radius: 4px;\n  word-wrap: normal;\n  margin: 2.5rem 0 !important;\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  position: relative; }\n  pre code {\n    color: #37474f;\n    text-shadow: 0 1px #fff;\n    padding: 0;\n    background: transparent; }\n\n/* .warning & .note & .success\n========================================================================== */\n.warning {\n  background: #fbe9e7;\n  color: #d50000; }\n  .warning:before {\n    content: \"\"; }\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1; }\n  .note:before {\n    content: \"\"; }\n\n.success {\n  background: #e0f2f1;\n  color: #00897b; }\n  .success:before {\n    content: \"\";\n    color: #00bfa5; }\n\n.warning, .note, .success {\n  display: block;\n  margin: 1rem 0;\n  font-size: 1rem;\n  padding: 12px 24px 12px 60px;\n  line-height: 1.5; }\n  .warning a, .note a, .success a {\n    text-decoration: underline;\n    color: inherit; }\n  .warning:before, .note:before, .success:before {\n    margin-left: -36px;\n    float: left;\n    font-size: 24px; }\n\n/* Social icon color and background\n========================================================================== */\n.c-facebook {\n  color: #3b5998; }\n\n.bg-facebook, .nav-mob-follow .i-facebook {\n  background-color: #3b5998 !important; }\n\n.c-twitter {\n  color: #55acee; }\n\n.bg-twitter, .nav-mob-follow .i-twitter {\n  background-color: #55acee !important; }\n\n.c-google {\n  color: #dd4b39; }\n\n.bg-google, .nav-mob-follow .i-google {\n  background-color: #dd4b39 !important; }\n\n.c-instagram {\n  color: #306088; }\n\n.bg-instagram, .nav-mob-follow .i-instagram {\n  background-color: #306088 !important; }\n\n.c-youtube {\n  color: #e52d27; }\n\n.bg-youtube, .nav-mob-follow .i-youtube {\n  background-color: #e52d27 !important; }\n\n.c-github {\n  color: #333333; }\n\n.bg-github, .nav-mob-follow .i-github {\n  background-color: #333333 !important; }\n\n.c-linkedin {\n  color: #007bb6; }\n\n.bg-linkedin, .nav-mob-follow .i-linkedin {\n  background-color: #007bb6 !important; }\n\n.c-spotify {\n  color: #2ebd59; }\n\n.bg-spotify, .nav-mob-follow .i-spotify {\n  background-color: #2ebd59 !important; }\n\n.c-codepen {\n  color: #222222; }\n\n.bg-codepen, .nav-mob-follow .i-codepen {\n  background-color: #222222 !important; }\n\n.c-behance {\n  color: #131418; }\n\n.bg-behance, .nav-mob-follow .i-behance {\n  background-color: #131418 !important; }\n\n.c-dribbble {\n  color: #ea4c89; }\n\n.bg-dribbble, .nav-mob-follow .i-dribbble {\n  background-color: #ea4c89 !important; }\n\n.c-flickr {\n  color: #0063DC; }\n\n.bg-flickr, .nav-mob-follow .i-flickr {\n  background-color: #0063DC !important; }\n\n.c-reddit {\n  color: orangered; }\n\n.bg-reddit, .nav-mob-follow .i-reddit {\n  background-color: orangered !important; }\n\n.c-pocket {\n  color: #F50057; }\n\n.bg-pocket, .nav-mob-follow .i-pocket {\n  background-color: #F50057 !important; }\n\n.c-pinterest {\n  color: #bd081c; }\n\n.bg-pinterest, .nav-mob-follow .i-pinterest {\n  background-color: #bd081c !important; }\n\n.c-feed {\n  color: orange; }\n\n.bg-feed, .nav-mob-follow .i-feed {\n  background-color: orange !important; }\n\n.clear:after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n/* pagination Infinite scroll\n========================================================================== */\n.mapache-load-more {\n  border: solid 1px #C3C3C3;\n  color: #7D7D7D;\n  display: block;\n  font-size: 15px;\n  height: 45px;\n  margin: 4rem auto;\n  padding: 11px 16px;\n  position: relative;\n  text-align: center;\n  width: 100%; }\n  .mapache-load-more:hover {\n    background: #4285f4;\n    border-color: #4285f4;\n    color: #fff; }\n\n.pagination-nav {\n  padding: 2.5rem 0 3rem;\n  text-align: center; }\n  .pagination-nav .page-number {\n    display: none;\n    padding-top: 5px; }\n    @media only screen and (min-width: 766px) {\n      .pagination-nav .page-number {\n        display: inline-block; } }\n  .pagination-nav .newer-posts {\n    float: left; }\n  .pagination-nav .older-posts {\n    float: right; }\n\n/* Scroll Top\n========================================================================== */\n.scroll_top {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  z-index: 11;\n  width: 60px;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity 0.5s ease; }\n  .scroll_top.visible {\n    opacity: 1;\n    visibility: visible; }\n  .scroll_top:hover svg path {\n    fill: rgba(0, 0, 0, 0.6); }\n\n.svg-icon svg {\n  width: 100%;\n  height: auto;\n  display: block;\n  fill: currentcolor; }\n\n/* Video Responsive\n========================================================================== */\n.video-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n  padding-bottom: 56.25%;\n  margin-bottom: 1.5rem; }\n  .video-responsive iframe {\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    height: 100%;\n    width: 100%;\n    border: 0; }\n\n/* Video full for tag video\n========================================================================== */\n#video-format .video-content {\n  display: flex;\n  padding-bottom: 1rem; }\n  #video-format .video-content span {\n    display: inline-block;\n    vertical-align: middle;\n    margin-right: .8rem; }\n\n/* Page error 404\n========================================================================== */\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n  height: 100vh;\n  position: relative;\n  width: 100%; }\n  .errorPage-title {\n    padding: 24px 60px; }\n  .errorPage-link {\n    color: rgba(0, 0, 0, 0.54);\n    font-size: 22px;\n    font-weight: 500;\n    left: -5px;\n    position: relative;\n    text-rendering: optimizeLegibility;\n    top: -6px; }\n  .errorPage-emoji {\n    color: rgba(0, 0, 0, 0.4);\n    font-size: 150px; }\n  .errorPage-text {\n    color: rgba(0, 0, 0, 0.4);\n    line-height: 21px;\n    margin-top: 60px;\n    white-space: pre-wrap; }\n  .errorPage-wrap {\n    display: block;\n    left: 50%;\n    min-width: 680px;\n    position: absolute;\n    text-align: center;\n    top: 50%;\n    transform: translate(-50%, -50%); }\n\n/* Post Twitter facebook card embed Css Center\n========================================================================== */\niframe[src*=\"facebook.com\"],\n.fb-post,\n.twitter-tweet {\n  display: block !important;\n  margin: 1.5rem 0 !important; }\n\n.container {\n  margin: 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n  width: 100%; }\n  @media only screen and (min-width: 1230px) {\n    .container {\n      max-width: 1200px; } }\n\n.margin-top {\n  margin-top: 50px;\n  padding-top: 1rem; }\n  @media only screen and (min-width: 766px) {\n    .margin-top {\n      padding-top: 1.8rem; } }\n\n@media only screen and (min-width: 766px) {\n  .content {\n    flex: 1 !important;\n    max-width: calc(100% - 300px) !important;\n    order: 1;\n    overflow: hidden; }\n  .sidebar {\n    flex: 0 0 330px !important;\n    order: 2; } }\n\n@media only screen and (min-width: 992px) {\n  .feed-entry-wrapper .entry-image {\n    width: 46.5% !important;\n    max-width: 46.5% !important; }\n  .feed-entry-wrapper .entry-body {\n    width: 53.5% !important;\n    max-width: 53.5% !important; } }\n\n@media only screen and (max-width: 992px) {\n  body.is-article .content {\n    max-width: 100% !important; } }\n\n.row {\n  display: flex;\n  flex: 0 1 auto;\n  flex-flow: row wrap;\n  margin-left: -0.9375rem;\n  margin-right: -0.9375rem; }\n  .row .col {\n    flex: 0 0 auto;\n    padding-left: 0.9375rem;\n    padding-right: 0.9375rem; }\n    .row .col.s1 {\n      flex-basis: 8.33333%;\n      max-width: 8.33333%; }\n    .row .col.s2 {\n      flex-basis: 16.66667%;\n      max-width: 16.66667%; }\n    .row .col.s3 {\n      flex-basis: 25%;\n      max-width: 25%; }\n    .row .col.s4 {\n      flex-basis: 33.33333%;\n      max-width: 33.33333%; }\n    .row .col.s5 {\n      flex-basis: 41.66667%;\n      max-width: 41.66667%; }\n    .row .col.s6 {\n      flex-basis: 50%;\n      max-width: 50%; }\n    .row .col.s7 {\n      flex-basis: 58.33333%;\n      max-width: 58.33333%; }\n    .row .col.s8 {\n      flex-basis: 66.66667%;\n      max-width: 66.66667%; }\n    .row .col.s9 {\n      flex-basis: 75%;\n      max-width: 75%; }\n    .row .col.s10 {\n      flex-basis: 83.33333%;\n      max-width: 83.33333%; }\n    .row .col.s11 {\n      flex-basis: 91.66667%;\n      max-width: 91.66667%; }\n    .row .col.s12 {\n      flex-basis: 100%;\n      max-width: 100%; }\n    @media only screen and (min-width: 766px) {\n      .row .col.m1 {\n        flex-basis: 8.33333%;\n        max-width: 8.33333%; }\n      .row .col.m2 {\n        flex-basis: 16.66667%;\n        max-width: 16.66667%; }\n      .row .col.m3 {\n        flex-basis: 25%;\n        max-width: 25%; }\n      .row .col.m4 {\n        flex-basis: 33.33333%;\n        max-width: 33.33333%; }\n      .row .col.m5 {\n        flex-basis: 41.66667%;\n        max-width: 41.66667%; }\n      .row .col.m6 {\n        flex-basis: 50%;\n        max-width: 50%; }\n      .row .col.m7 {\n        flex-basis: 58.33333%;\n        max-width: 58.33333%; }\n      .row .col.m8 {\n        flex-basis: 66.66667%;\n        max-width: 66.66667%; }\n      .row .col.m9 {\n        flex-basis: 75%;\n        max-width: 75%; }\n      .row .col.m10 {\n        flex-basis: 83.33333%;\n        max-width: 83.33333%; }\n      .row .col.m11 {\n        flex-basis: 91.66667%;\n        max-width: 91.66667%; }\n      .row .col.m12 {\n        flex-basis: 100%;\n        max-width: 100%; } }\n    @media only screen and (min-width: 992px) {\n      .row .col.l1 {\n        flex-basis: 8.33333%;\n        max-width: 8.33333%; }\n      .row .col.l2 {\n        flex-basis: 16.66667%;\n        max-width: 16.66667%; }\n      .row .col.l3 {\n        flex-basis: 25%;\n        max-width: 25%; }\n      .row .col.l4 {\n        flex-basis: 33.33333%;\n        max-width: 33.33333%; }\n      .row .col.l5 {\n        flex-basis: 41.66667%;\n        max-width: 41.66667%; }\n      .row .col.l6 {\n        flex-basis: 50%;\n        max-width: 50%; }\n      .row .col.l7 {\n        flex-basis: 58.33333%;\n        max-width: 58.33333%; }\n      .row .col.l8 {\n        flex-basis: 66.66667%;\n        max-width: 66.66667%; }\n      .row .col.l9 {\n        flex-basis: 75%;\n        max-width: 75%; }\n      .row .col.l10 {\n        flex-basis: 83.33333%;\n        max-width: 83.33333%; }\n      .row .col.l11 {\n        flex-basis: 91.66667%;\n        max-width: 91.66667%; }\n      .row .col.l12 {\n        flex-basis: 100%;\n        max-width: 100%; } }\n\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  margin-bottom: 0.5rem;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: 500;\n  line-height: 1.1;\n  color: inherit;\n  letter-spacing: -.02em !important; }\n\nh1 {\n  font-size: 2.25rem; }\n\nh2 {\n  font-size: 1.875rem; }\n\nh3 {\n  font-size: 1.5625rem; }\n\nh4 {\n  font-size: 1.375rem; }\n\nh5 {\n  font-size: 1.125rem; }\n\nh6 {\n  font-size: 1rem; }\n\n.h1 {\n  font-size: 2.25rem; }\n\n.h2 {\n  font-size: 1.875rem; }\n\n.h3 {\n  font-size: 1.5625rem; }\n\n.h4 {\n  font-size: 1.375rem; }\n\n.h5 {\n  font-size: 1.125rem; }\n\n.h6 {\n  font-size: 1rem; }\n\nh1, h2, h3, h4, h5, h6 {\n  margin-bottom: 1rem; }\n  h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {\n    color: inherit;\n    line-height: inherit; }\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem; }\n\n/* Navigation Mobile\r\n========================================================================== */\n.nav-mob {\n  background: #4285f4;\n  color: #000;\n  height: 100vh;\n  left: 0;\n  padding: 0 20px;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  transition: .4s;\n  will-change: transform;\n  z-index: 997; }\n  .nav-mob a {\n    color: inherit; }\n  .nav-mob ul a {\n    display: block;\n    font-weight: 500;\n    padding: 8px 0;\n    text-transform: uppercase;\n    font-size: 14px; }\n  .nav-mob-content {\n    background: #eee;\n    overflow: auto;\n    -webkit-overflow-scrolling: touch;\n    bottom: 0;\n    left: 0;\n    padding: 20px 0;\n    position: absolute;\n    right: 0;\n    top: 50px; }\n\n.nav-mob ul,\n.nav-mob-subscribe,\n.nav-mob-follow {\n  border-bottom: solid 1px #DDD;\n  padding: 0 0.9375rem 20px 0.9375rem;\n  margin-bottom: 15px; }\n\n/* Navigation Mobile follow\r\n========================================================================== */\n.nav-mob-follow a {\n  font-size: 20px !important;\n  margin: 0 2px !important;\n  padding: 0; }\n\n.nav-mob-follow .i-facebook {\n  color: #fff; }\n\n.nav-mob-follow .i-twitter {\n  color: #fff; }\n\n.nav-mob-follow .i-google {\n  color: #fff; }\n\n.nav-mob-follow .i-instagram {\n  color: #fff; }\n\n.nav-mob-follow .i-youtube {\n  color: #fff; }\n\n.nav-mob-follow .i-github {\n  color: #fff; }\n\n.nav-mob-follow .i-linkedin {\n  color: #fff; }\n\n.nav-mob-follow .i-spotify {\n  color: #fff; }\n\n.nav-mob-follow .i-codepen {\n  color: #fff; }\n\n.nav-mob-follow .i-behance {\n  color: #fff; }\n\n.nav-mob-follow .i-dribbble {\n  color: #fff; }\n\n.nav-mob-follow .i-flickr {\n  color: #fff; }\n\n.nav-mob-follow .i-reddit {\n  color: #fff; }\n\n.nav-mob-follow .i-pocket {\n  color: #fff; }\n\n.nav-mob-follow .i-pinterest {\n  color: #fff; }\n\n.nav-mob-follow .i-feed {\n  color: #fff; }\n\n/* CopyRigh\r\n========================================================================== */\n.nav-mob-copyright {\n  color: #aaa;\n  font-size: 13px;\n  padding: 20px 15px 0;\n  text-align: center;\n  width: 100%; }\n  .nav-mob-copyright a {\n    color: #4285f4; }\n\n/* subscribe\r\n========================================================================== */\n.nav-mob-subscribe .btn, .nav-mob-subscribe .nav-mob-follow a, .nav-mob-follow .nav-mob-subscribe a {\n  border-radius: 0;\n  text-transform: none;\n  width: 80px; }\n\n.nav-mob-subscribe .form-group {\n  width: calc(100% - 80px); }\n\n.nav-mob-subscribe input {\n  border: 0;\n  box-shadow: none !important; }\n\n/* Header Page\r\n========================================================================== */\n.header {\n  background: #4285f4;\n  height: 50px;\n  left: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: 999; }\n  .header-wrap a {\n    color: #fff; }\n  .header-logo,\n  .header-follow a,\n  .header-menu a {\n    height: 50px; }\n  .header-follow, .header-search, .header-logo {\n    flex: 0 0 auto; }\n  .header-logo {\n    z-index: 998;\n    font-size: 1.25rem;\n    font-weight: 500;\n    letter-spacing: 1px; }\n    .header-logo img {\n      max-height: 35px;\n      position: relative; }\n  .header .nav-mob-toggle,\n  .header .search-mob-toggle {\n    padding: 0;\n    z-index: 998; }\n  .header .nav-mob-toggle {\n    margin-left: 0 !important;\n    margin-right: -0.9375rem;\n    position: relative;\n    transition: transform .4s; }\n    .header .nav-mob-toggle span {\n      background-color: #fff;\n      display: block;\n      height: 2px;\n      left: 14px;\n      margin-top: -1px;\n      position: absolute;\n      top: 50%;\n      transition: .4s;\n      width: 20px; }\n      .header .nav-mob-toggle span:first-child {\n        transform: translate(0, -6px); }\n      .header .nav-mob-toggle span:last-child {\n        transform: translate(0, 6px); }\n  .header:not(.toolbar-shadow) {\n    background-color: transparent !important; }\n\n/* Header Navigation\r\n========================================================================== */\n.header-menu {\n  flex: 1 1 0;\n  overflow: hidden;\n  transition: flex .2s,margin .2s,width .2s; }\n  .header-menu ul {\n    margin-left: 2rem;\n    white-space: nowrap; }\n    .header-menu ul li {\n      padding-right: 15px;\n      display: inline-block; }\n    .header-menu ul a {\n      padding: 0 8px;\n      position: relative; }\n      .header-menu ul a:before {\n        background: #fff;\n        bottom: 0;\n        content: '';\n        height: 2px;\n        left: 0;\n        opacity: 0;\n        position: absolute;\n        transition: opacity .2s;\n        width: 100%; }\n      .header-menu ul a:hover:before, .header-menu ul a.active:before {\n        opacity: 1; }\n\n/* header social\r\n========================================================================== */\n.header-follow a {\n  padding: 0 10px; }\n  .header-follow a:hover {\n    color: rgba(255, 255, 255, 0.8); }\n  .header-follow a:before {\n    font-size: 1.25rem !important; }\n\n/* Header search\r\n========================================================================== */\n.header-search {\n  background: #eee;\n  border-radius: 2px;\n  display: none;\n  height: 36px;\n  position: relative;\n  text-align: left;\n  transition: background .2s,flex .2s;\n  vertical-align: top;\n  margin-left: 1.5rem;\n  margin-right: 1.5rem; }\n  .header-search .search-icon {\n    color: #757575;\n    font-size: 24px;\n    left: 24px;\n    position: absolute;\n    top: 12px;\n    transition: color .2s; }\n\ninput.search-field {\n  background: 0;\n  border: 0;\n  color: #212121;\n  height: 36px;\n  padding: 0 8px 0 72px;\n  transition: color .2s;\n  width: 100%; }\n  input.search-field:focus {\n    border: 0;\n    outline: none; }\n\n.search-popout {\n  background: #fff;\n  box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24), inset 0 4px 6px -4px rgba(0, 0, 0, 0.24);\n  margin-top: 10px;\n  max-height: calc(100vh - 150px);\n  margin-left: -64px;\n  overflow-y: auto;\n  position: absolute;\n  z-index: -1; }\n  .search-popout.closed {\n    visibility: hidden; }\n\n.search-suggest-results {\n  padding: 0 8px 0 75px; }\n  .search-suggest-results a {\n    color: #212121;\n    display: block;\n    margin-left: -8px;\n    outline: 0;\n    height: auto;\n    padding: 8px;\n    transition: background .2s;\n    font-size: 0.875rem; }\n    .search-suggest-results a:first-child {\n      margin-top: 10px; }\n    .search-suggest-results a:last-child {\n      margin-bottom: 10px; }\n    .search-suggest-results a:hover {\n      background: #f7f7f7; }\n\n/* mediaquery medium\r\n========================================================================== */\n@media only screen and (min-width: 992px) {\n  .header-search {\n    background: rgba(255, 255, 255, 0.25);\n    box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.12);\n    color: #fff;\n    display: inline-block;\n    width: 200px; }\n    .header-search:hover {\n      background: rgba(255, 255, 255, 0.4); }\n    .header-search .search-icon {\n      top: 0px; }\n    .header-search input, .header-search input::placeholder, .header-search .search-icon {\n      color: #fff; }\n  .search-popout {\n    width: 100%;\n    margin-left: 0; }\n  .header.is-showSearch .header-search {\n    background: #fff;\n    flex: 1 0 auto; }\n    .header.is-showSearch .header-search .search-icon {\n      color: #757575 !important; }\n    .header.is-showSearch .header-search input, .header.is-showSearch .header-search input::placeholder {\n      color: #212121 !important; }\n  .header.is-showSearch .header-menu {\n    flex: 0 0 auto;\n    margin: 0;\n    visibility: hidden;\n    width: 0; } }\n\n/* Media Query\r\n========================================================================== */\n@media only screen and (max-width: 992px) {\n  .header-menu ul {\n    display: none; }\n  .header.is-showSearchMob {\n    padding: 0; }\n    .header.is-showSearchMob .header-logo,\n    .header.is-showSearchMob .nav-mob-toggle {\n      display: none; }\n    .header.is-showSearchMob .header-search {\n      border-radius: 0;\n      display: inline-block !important;\n      height: 50px;\n      margin: 0;\n      width: 100%; }\n      .header.is-showSearchMob .header-search input {\n        height: 50px;\n        padding-right: 48px; }\n      .header.is-showSearchMob .header-search .search-popout {\n        margin-top: 0; }\n    .header.is-showSearchMob .search-mob-toggle {\n      border: 0;\n      color: #757575;\n      position: absolute;\n      right: 0; }\n      .header.is-showSearchMob .search-mob-toggle:before {\n        content: \"\" !important; }\n  body.is-showNavMob {\n    overflow: hidden; }\n    body.is-showNavMob .nav-mob {\n      transform: translateX(0); }\n    body.is-showNavMob .nav-mob-toggle {\n      border: 0;\n      transform: rotate(90deg); }\n      body.is-showNavMob .nav-mob-toggle span:first-child {\n        transform: rotate(45deg) translate(0, 0); }\n      body.is-showNavMob .nav-mob-toggle span:nth-child(2) {\n        transform: scaleX(0); }\n      body.is-showNavMob .nav-mob-toggle span:last-child {\n        transform: rotate(-45deg) translate(0, 0); }\n    body.is-showNavMob .search-mob-toggle {\n      display: none; }\n    body.is-showNavMob .main, body.is-showNavMob .footer {\n      transform: translateX(-25%); } }\n\n.cover {\n  background: #4285f4;\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n  color: #fff;\n  letter-spacing: .2px;\n  min-height: 550px;\n  position: relative;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n  z-index: 2; }\n  .cover-wrap {\n    margin: 0 auto;\n    max-width: 700px;\n    padding: 16px;\n    position: relative;\n    text-align: center;\n    z-index: 99; }\n  .cover-title {\n    font-size: 3rem;\n    margin: 0 0 30px 0;\n    line-height: 1.2; }\n  .cover .mouse {\n    width: 25px;\n    position: absolute;\n    height: 36px;\n    border-radius: 15px;\n    border: 2px solid #888;\n    border: 2px solid rgba(255, 255, 255, 0.27);\n    bottom: 40px;\n    right: 40px;\n    margin-left: -12px;\n    cursor: pointer;\n    transition: border-color 0.2s ease-in; }\n    .cover .mouse .scroll {\n      display: block;\n      margin: 6px auto;\n      width: 3px;\n      height: 6px;\n      border-radius: 4px;\n      background: rgba(255, 255, 255, 0.68);\n      animation-duration: 2s;\n      animation-name: scroll;\n      animation-iteration-count: infinite; }\n  .cover-background {\n    position: absolute;\n    overflow: hidden;\n    background-size: cover;\n    background-position: center;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0; }\n    .cover-background:before {\n      display: block;\n      content: ' ';\n      width: 100%;\n      height: 100%;\n      background-color: rgba(0, 0, 0, 0.6);\n      background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, 0.7))); }\n\n.author a {\n  color: #FFF !important; }\n\n.author-header {\n  margin-top: 10%; }\n\n.author-name-wrap {\n  display: inline-block; }\n\n.author-title {\n  display: block;\n  text-transform: uppercase; }\n\n.author-name {\n  margin: 5px 0;\n  font-size: 1.75rem; }\n\n.author-bio {\n  margin: 1.5rem 0;\n  line-height: 1.8;\n  font-size: 18px; }\n\n.author-avatar {\n  display: inline-block;\n  border-radius: 90px;\n  margin-right: 10px;\n  width: 80px;\n  height: 80px;\n  background-size: cover;\n  background-position: center;\n  vertical-align: bottom; }\n\n.author-meta {\n  margin-bottom: 20px; }\n  .author-meta span {\n    display: inline-block;\n    font-size: 17px;\n    font-style: italic;\n    margin: 0 2rem 1rem 0;\n    opacity: 0.8;\n    word-wrap: break-word; }\n\n.author .author-link:hover {\n  opacity: 1; }\n\n.author-follow a {\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  cursor: pointer;\n  display: inline-block;\n  height: 40px;\n  letter-spacing: 1px;\n  line-height: 40px;\n  margin: 0 10px;\n  padding: 0 16px;\n  text-shadow: none;\n  text-transform: uppercase; }\n  .author-follow a:hover {\n    box-shadow: inset 0 0 0 2px #fff; }\n\n@media only screen and (min-width: 766px) {\n  .cover-description {\n    font-size: 1.25rem; } }\n\n@media only screen and (max-width: 766px) {\n  .cover {\n    padding-top: 50px;\n    padding-bottom: 20px; }\n    .cover-title {\n      font-size: 2rem; }\n  .author-avatar {\n    display: block;\n    margin: 0 auto 10px auto; } }\n\n.feed-entry-content .feed-entry-wrapper:last-child .entry:last-child {\n  padding: 0;\n  border: none; }\n\n.entry {\n  margin-bottom: 1.5rem;\n  padding-bottom: 0; }\n  .entry-image {\n    margin-bottom: 10px; }\n    .entry-image--link {\n      display: block;\n      height: 180px;\n      line-height: 0;\n      margin: 0;\n      overflow: hidden;\n      position: relative; }\n      .entry-image--link:hover .entry-image--bg {\n        transform: scale(1.03);\n        backface-visibility: hidden; }\n    .entry-image img {\n      display: block;\n      width: 100%;\n      max-width: 100%;\n      height: auto;\n      margin-left: auto;\n      margin-right: auto; }\n    .entry-image--bg {\n      display: block;\n      width: 100%;\n      position: relative;\n      height: 100%;\n      background-position: center;\n      background-size: cover;\n      transition: transform 0.3s; }\n  .entry-video-play {\n    border-radius: 50%;\n    border: 2px solid #fff;\n    color: #fff;\n    font-size: 3.5rem;\n    height: 65px;\n    left: 50%;\n    line-height: 65px;\n    position: absolute;\n    text-align: center;\n    top: 50%;\n    transform: translate(-50%, -50%);\n    width: 65px;\n    z-index: 10; }\n  .entry-category {\n    margin-bottom: 5px;\n    text-transform: capitalize;\n    font-size: 0.875rem;\n    line-height: 1; }\n    .entry-category a:active {\n      text-decoration: underline; }\n  .entry-title {\n    color: #222;\n    font-size: 1.25rem;\n    height: auto;\n    line-height: 1.2;\n    margin: 0 0 1rem;\n    padding: 0; }\n    .entry-title:hover {\n      color: #777; }\n  .entry-byline {\n    margin-top: 0;\n    margin-bottom: 1.125rem;\n    color: #999;\n    font-size: 0.8125rem; }\n    .entry-byline a {\n      color: inherit; }\n      .entry-byline a:hover {\n        color: #333; }\n\n/* Entry small --small\r\n========================================================================== */\n.entry.entry--small {\n  margin-bottom: 18px;\n  padding-bottom: 0; }\n  .entry.entry--small .entry-image {\n    margin-bottom: 10px; }\n  .entry.entry--small .entry-image--link {\n    height: 174px; }\n  .entry.entry--small .entry-title {\n    font-size: 1rem;\n    line-height: 1.2; }\n  .entry.entry--small .entry-byline {\n    margin: 0; }\n\n@media only screen and (min-width: 992px) {\n  .entry {\n    margin-bottom: 2rem;\n    padding-bottom: 2rem; }\n    .entry-title {\n      font-size: 1.75rem; }\n    .entry-image {\n      margin-bottom: 0; }\n    .entry-image--link {\n      height: 180px; } }\n\n@media only screen and (min-width: 1230px) {\n  .entry-image--link {\n    height: 250px; } }\n\n.footer {\n  color: rgba(0, 0, 0, 0.44);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1;\n  padding: 1.6rem 15px;\n  text-align: center; }\n  .footer a {\n    color: rgba(0, 0, 0, 0.6); }\n    .footer a:hover {\n      color: rgba(0, 0, 0, 0.8); }\n  .footer-wrap {\n    margin: 0 auto;\n    max-width: 1400px; }\n  .footer .heart {\n    animation: heartify .5s infinite alternate;\n    color: red; }\n  .footer-copy, .footer-design-author {\n    display: inline-block;\n    padding: .5rem 0;\n    vertical-align: middle; }\n\n@keyframes heartify {\n  0% {\n    transform: scale(0.8); } }\n\n.btn, .nav-mob-follow a {\n  background-color: #fff;\n  border-radius: 2px;\n  border: 0;\n  box-shadow: none;\n  color: #039be5;\n  cursor: pointer;\n  display: inline-block;\n  font: 500 14px/20px \"Roboto\", sans-serif;\n  height: 36px;\n  margin: 0;\n  min-width: 36px;\n  outline: 0;\n  overflow: hidden;\n  padding: 8px;\n  text-align: center;\n  text-decoration: none;\n  text-overflow: ellipsis;\n  text-transform: uppercase;\n  transition: background-color .2s,box-shadow .2s;\n  vertical-align: middle;\n  white-space: nowrap; }\n  .btn + .btn, .nav-mob-follow a + .btn, .nav-mob-follow .btn + a, .nav-mob-follow a + a {\n    margin-left: 8px; }\n  .btn:focus, .nav-mob-follow a:focus, .btn:hover, .nav-mob-follow a:hover {\n    background-color: #e1f3fc;\n    text-decoration: none !important; }\n  .btn:active, .nav-mob-follow a:active {\n    background-color: #c3e7f9; }\n  .btn.btn-lg, .nav-mob-follow a.btn-lg {\n    font-size: 1.5rem;\n    min-width: 48px;\n    height: 48px;\n    line-height: 48px; }\n  .btn.btn-flat, .nav-mob-follow a.btn-flat {\n    background: 0;\n    box-shadow: none; }\n    .btn.btn-flat:focus, .nav-mob-follow a.btn-flat:focus, .btn.btn-flat:hover, .nav-mob-follow a.btn-flat:hover, .btn.btn-flat:active, .nav-mob-follow a.btn-flat:active {\n      background: 0;\n      box-shadow: none; }\n  .btn.btn-primary, .nav-mob-follow a.btn-primary {\n    background-color: #4285f4;\n    color: #fff; }\n    .btn.btn-primary:hover, .nav-mob-follow a.btn-primary:hover {\n      background-color: #2f79f3; }\n  .btn.btn-circle, .nav-mob-follow a.btn-circle {\n    border-radius: 50%;\n    height: 40px;\n    line-height: 40px;\n    padding: 0;\n    width: 40px; }\n  .btn.btn-circle-small, .nav-mob-follow a.btn-circle-small {\n    border-radius: 50%;\n    height: 32px;\n    line-height: 32px;\n    padding: 0;\n    width: 32px;\n    min-width: 32px; }\n  .btn.btn-shadow, .nav-mob-follow a.btn-shadow {\n    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);\n    color: #333;\n    background-color: #eee; }\n    .btn.btn-shadow:hover, .nav-mob-follow a.btn-shadow:hover {\n      background-color: rgba(0, 0, 0, 0.12); }\n  .btn.btn-download-cloud, .nav-mob-follow a.btn-download-cloud, .btn.btn-download, .nav-mob-follow a.btn-download {\n    background-color: #4285f4;\n    color: #fff; }\n    .btn.btn-download-cloud:hover, .nav-mob-follow a.btn-download-cloud:hover, .btn.btn-download:hover, .nav-mob-follow a.btn-download:hover {\n      background-color: #1b6cf2; }\n    .btn.btn-download-cloud:after, .nav-mob-follow a.btn-download-cloud:after, .btn.btn-download:after, .nav-mob-follow a.btn-download:after {\n      margin-left: 5px;\n      font-size: 1.1rem;\n      display: inline-block;\n      vertical-align: top; }\n  .btn.btn-download:after, .nav-mob-follow a.btn-download:after {\n    content: \"\"; }\n  .btn.btn-download-cloud:after, .nav-mob-follow a.btn-download-cloud:after {\n    content: \"\"; }\n  .btn.external:after, .nav-mob-follow a.external:after {\n    font-size: 1rem; }\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate; }\n\n.form-control {\n  width: 100%;\n  padding: 8px 12px;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 0px;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\n  height: 36px; }\n  .form-control:focus {\n    border-color: #4285f4;\n    outline: 0;\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(66, 133, 244, 0.6); }\n\n.btn-subscribe-home {\n  background-color: transparent;\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #ffffff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  max-width: 300px;\n  padding: 15px 10px;\n  transition: all 0.3s;\n  width: 100%; }\n  .btn-subscribe-home:hover {\n    box-shadow: inset 0 0 0 2px #fff; }\n\n/*  Post\n========================================================================== */\n.post-wrapper {\n  margin-top: 50px;\n  padding-top: 1.8rem; }\n\n.post-header {\n  margin-bottom: 1.2rem; }\n\n.post-title {\n  color: #222;\n  font-size: 2.5rem;\n  height: auto;\n  line-height: 1.04;\n  margin: 0 0 0.9375rem;\n  letter-spacing: -.028em !important;\n  padding: 0; }\n\n.post-excerpt {\n  line-height: 1.3em;\n  font-size: 20px;\n  color: #7D7D7D;\n  margin-bottom: 8px; }\n\n.post-image {\n  margin-bottom: 1.45rem;\n  overflow: hidden; }\n\n.post-body {\n  margin-bottom: 2rem; }\n  .post-body a:focus {\n    text-decoration: underline; }\n  .post-body h2 {\n    font-weight: 500;\n    margin: 2.50rem 0 1.25rem;\n    padding-bottom: 3px; }\n  .post-body h3, .post-body h4 {\n    margin: 32px 0 16px; }\n  .post-body iframe {\n    display: block !important;\n    margin: 0 auto 1.5rem 0 !important; }\n  .post-body img {\n    display: block;\n    margin-bottom: 1rem; }\n  .post-body h2 a, .post-body h3 a, .post-body h4 a {\n    color: #4285f4; }\n\n.post-tags {\n  margin: 1.25rem 0; }\n\n.post-comments {\n  margin: 0 0 1.5rem; }\n\n/* Post author by line top (author - time - tag - sahre)\n========================================================================== */\n.post-byline {\n  color: #999;\n  font-size: 14px;\n  flex-grow: 1;\n  letter-spacing: -.028em !important; }\n  .post-byline a {\n    color: inherit; }\n    .post-byline a:active {\n      text-decoration: underline; }\n    .post-byline a:hover {\n      color: #222; }\n\n.post-actions--top .share {\n  margin-right: 10px;\n  font-size: 20px; }\n  .post-actions--top .share:hover {\n    opacity: .7; }\n\n.post-action-comments {\n  color: #999;\n  margin-right: 15px;\n  font-size: 14px; }\n\n/* Post Action social media\n========================================================================== */\n.post-actions {\n  position: relative;\n  margin-bottom: 1.5rem; }\n  .post-actions a {\n    color: #fff;\n    font-size: 1.125rem; }\n    .post-actions a:hover {\n      background-color: #000 !important; }\n  .post-actions li {\n    margin-left: 6px; }\n    .post-actions li:first-child {\n      margin-left: 0 !important; }\n  .post-actions .btn, .post-actions .nav-mob-follow a, .nav-mob-follow .post-actions a {\n    border-radius: 0; }\n\n/* Post author widget bottom\n========================================================================== */\n.post-author {\n  position: relative;\n  font-size: 15px;\n  padding: 30px 0 30px 100px;\n  margin-bottom: 3rem;\n  background-color: #f3f5f6; }\n  .post-author h5 {\n    color: #AAA;\n    font-size: 12px;\n    line-height: 1.5;\n    margin: 0; }\n  .post-author li {\n    margin-left: 30px;\n    font-size: 14px; }\n    .post-author li a {\n      color: #555; }\n      .post-author li a:hover {\n        color: #000; }\n    .post-author li:first-child {\n      margin-left: 0; }\n  .post-author-bio {\n    max-width: 500px; }\n  .post-author .post-author-avatar {\n    height: 64px;\n    width: 64px;\n    position: absolute;\n    left: 20px;\n    top: 30px;\n    background-position: center center;\n    background-size: cover;\n    border-radius: 50%; }\n\n/* prev-post and next-post\n========================================================================== */\n/* bottom share and bottom subscribe\n========================================================================== */\n.share-subscribe {\n  margin-bottom: 1rem; }\n  .share-subscribe p {\n    color: #7d7d7d;\n    margin-bottom: 1rem;\n    line-height: 1;\n    font-size: 0.875rem; }\n  .share-subscribe .social-share {\n    float: none !important; }\n  .share-subscribe > div {\n    position: relative;\n    overflow: hidden;\n    margin-bottom: 15px; }\n    .share-subscribe > div:before {\n      content: \" \";\n      border-top: solid 1px #000;\n      position: absolute;\n      top: 0;\n      left: 15px;\n      width: 40px;\n      height: 1px; }\n    .share-subscribe > div h5 {\n      color: #666;\n      font-size: 0.875rem;\n      margin: 1rem 0;\n      line-height: 1;\n      text-transform: uppercase; }\n  .share-subscribe .newsletter-form {\n    display: flex; }\n    .share-subscribe .newsletter-form .form-group {\n      max-width: 250px;\n      width: 100%; }\n    .share-subscribe .newsletter-form .btn, .share-subscribe .newsletter-form .nav-mob-follow a, .nav-mob-follow .share-subscribe .newsletter-form a {\n      border-radius: 0; }\n\n/* Related post\n========================================================================== */\n.post-related {\n  margin-bottom: 1.5rem; }\n  .post-related-title {\n    font-size: 17px;\n    font-weight: 400;\n    height: auto;\n    line-height: 17px;\n    margin: 0 0 20px;\n    padding-bottom: 10px;\n    text-transform: uppercase; }\n  .post-related-list {\n    margin-bottom: 18px;\n    padding: 0;\n    border: none; }\n  .post-related .no-image {\n    position: relative; }\n    .post-related .no-image .entry {\n      background-color: #4285f4;\n      display: flex;\n      align-items: center;\n      position: absolute;\n      bottom: 0;\n      top: 0;\n      left: 0.9375rem;\n      right: 0.9375rem; }\n    .post-related .no-image .entry-title {\n      color: #fff;\n      padding: 0 10px;\n      text-align: center;\n      width: 100%; }\n      .post-related .no-image .entry-title:hover {\n        color: rgba(255, 255, 255, 0.7); }\n\n/* Media Query (medium)\n========================================================================== */\n@media only screen and (min-width: 766px) {\n  .post .title {\n    font-size: 2.25rem;\n    margin: 0 0 1rem; }\n  .post-body {\n    font-size: 1.125rem;\n    line-height: 32px; }\n    .post-body p {\n      margin-bottom: 1.5rem; } }\n\n@media only screen and (max-width: 640px) {\n  .post-title {\n    font-size: 1.8rem; }\n  .post-image,\n  .video-responsive {\n    margin-left: -0.9375rem;\n    margin-right: -0.9375rem; } }\n\n/* sidebar\n========================================================================== */\n.sidebar {\n  position: relative;\n  line-height: 1.6; }\n  .sidebar h1, .sidebar h2, .sidebar h3, .sidebar h4, .sidebar h5, .sidebar h6 {\n    margin-top: 0; }\n  .sidebar-items {\n    margin-bottom: 2.5rem;\n    position: relative; }\n  .sidebar-title {\n    padding-bottom: 10px;\n    margin-bottom: 1rem;\n    text-transform: uppercase;\n    font-size: 1rem;\n    font-weight: 500; }\n  .sidebar .title-primary {\n    background-color: #4285f4;\n    color: #FFFFFF;\n    padding: 10px 16px;\n    font-size: 18px; }\n\n.sidebar-post {\n  padding-bottom: 2px; }\n  .sidebar-post--border {\n    align-items: center;\n    border-left: 3px solid #4285f4;\n    bottom: 0;\n    color: rgba(0, 0, 0, 0.2);\n    display: flex;\n    font-size: 28px;\n    font-weight: bold;\n    left: 0;\n    line-height: 1;\n    padding: 15px 10px 10px;\n    position: absolute;\n    top: 0; }\n  .sidebar-post:nth-child(3n) .sidebar-post--border {\n    border-color: #f59e00; }\n  .sidebar-post:nth-child(3n+2) .sidebar-post--border {\n    border-color: #00a034; }\n  .sidebar-post--link {\n    background-color: white;\n    display: block;\n    min-height: 50px;\n    padding: 10px 15px 10px 55px;\n    position: relative; }\n    .sidebar-post--link:hover .sidebar-post--border {\n      background-color: #e5eff5; }\n  .sidebar-post--title {\n    color: rgba(0, 0, 0, 0.8);\n    font-size: 18px;\n    font-weight: 400;\n    margin: 0; }\n\n.subscribe {\n  min-height: 90vh;\n  padding-top: 50px; }\n  .subscribe h3 {\n    margin: 0;\n    margin-bottom: 8px;\n    font: 400 20px/32px \"Roboto\", sans-serif; }\n  .subscribe-title {\n    font-weight: 400;\n    margin-top: 0; }\n  .subscribe-wrap {\n    max-width: 700px;\n    color: #7d878a;\n    padding: 1rem 0; }\n  .subscribe .form-group {\n    margin-bottom: 1.5rem; }\n    .subscribe .form-group.error input {\n      border-color: #ff5b5b; }\n  .subscribe .btn, .subscribe .nav-mob-follow a, .nav-mob-follow .subscribe a {\n    width: 100%; }\n\n.subscribe-form {\n  position: relative;\n  margin: 30px auto;\n  padding: 40px;\n  max-width: 400px;\n  width: 100%;\n  background: #ebeff2;\n  border-radius: 5px;\n  text-align: left; }\n\n.subscribe-input {\n  width: 100%;\n  padding: 10px;\n  border: #4285f4  1px solid;\n  border-radius: 2px; }\n  .subscribe-input:focus {\n    outline: none; }\n\n.animated {\n  animation-duration: 1s;\n  animation-fill-mode: both; }\n  .animated.infinite {\n    animation-iteration-count: infinite; }\n\n.bounceIn {\n  animation-name: bounceIn; }\n\n.bounceInDown {\n  animation-name: bounceInDown; }\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3); }\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1); }\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9); }\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03); }\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97); }\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0); }\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0); }\n  75% {\n    transform: translate3d(0, -10px, 0); }\n  90% {\n    transform: translate3d(0, 5px, 0); }\n  100% {\n    transform: none; } }\n\n@keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1); }\n  50% {\n    transform: scale3d(1.05, 1.05, 1.05); }\n  to {\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes scroll {\n  0% {\n    opacity: 0; }\n  10% {\n    opacity: 1;\n    transform: translateY(0px); }\n  100% {\n    opacity: 0;\n    transform: translateY(10px); } }\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg); }\n  to {\n    transform: rotate(360deg); } }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdHlsZXMvbWFpbi5zY3NzIiwibm9kZV9tb2R1bGVzL3ByaXNtanMvcGx1Z2lucy9saW5lLW51bWJlcnMvcHJpc20tbGluZS1udW1iZXJzLmNzcyIsInNyYy9zdHlsZXMvY29tbW9uL19pY29uLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fdmFyaWFibGVzLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fdXRpbGl0aWVzLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fZ2xvYmFsLnNjc3MiLCJzcmMvc3R5bGVzL2NvbXBvbmVudHMvX2dyaWQuc2NzcyIsInNyYy9zdHlsZXMvY29tbW9uL190eXBvZ3JhcGh5LnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX21lbnUuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9faGVhZGVyLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX2NvdmVyLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX2VudHJ5LnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX2Zvb3Rlci5zY3NzIiwic3JjL3N0eWxlcy9jb21wb25lbnRzL19idXR0b25zLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX3Bvc3Quc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9fc2lkZWJhci5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19zdWJzY3JpYmUuc2NzcyIsInNyYy9zdHlsZXMvY29tcG9uZW50cy9fYW5pbWF0ZWQuc2NzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAcGFja2FnZSBnb2RvZnJlZG9uaW5qYVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkBjaGFyc2V0IFwiVVRGLThcIjtcblxuLy8gTm9ybWFsaXplIGFuZCBpY29uIGZvbnRzIChsaWJyYXJpZXMpXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5AaW1wb3J0IFwifm5vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzc1wiO1xuQGltcG9ydCBcIn5wcmlzbWpzL3RoZW1lcy9wcmlzbS5jc3NcIjtcbkBpbXBvcnQgXCJ+cHJpc21qcy9wbHVnaW5zL2xpbmUtbnVtYmVycy9wcmlzbS1saW5lLW51bWJlcnNcIjtcblxuLy8gIGljb25zXG5AaW1wb3J0IFwiY29tbW9uL2ljb25cIjtcblxuLy8gTWl4aW5zICYgVmFyaWFibGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQGltcG9ydCBcImNvbW1vbi92YXJpYWJsZXNcIjtcbkBpbXBvcnQgXCJjb21tb24vdXRpbGl0aWVzXCI7XG5cbi8vIFN0cnVjdHVyZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkBpbXBvcnQgXCJjb21tb24vZ2xvYmFsXCI7XG5AaW1wb3J0IFwiY29tcG9uZW50cy9ncmlkXCI7XG5AaW1wb3J0IFwiY29tbW9uL3R5cG9ncmFwaHlcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL21lbnVcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL2hlYWRlclwiO1xuQGltcG9ydCBcImxheW91dHMvY292ZXJcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL2VudHJ5XCI7XG5AaW1wb3J0IFwibGF5b3V0cy9mb290ZXJcIjtcbkBpbXBvcnQgXCJjb21wb25lbnRzL2J1dHRvbnNcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL3Bvc3RcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL3NpZGViYXJcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL3N1YnNjcmliZVwiO1xuQGltcG9ydCBcImNvbXBvbmVudHMvYW5pbWF0ZWRcIjtcbiIsInByZS5saW5lLW51bWJlcnMge1xuXHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdHBhZGRpbmctbGVmdDogMy44ZW07XG5cdGNvdW50ZXItcmVzZXQ6IGxpbmVudW1iZXI7XG59XG5cbnByZS5saW5lLW51bWJlcnMgPiBjb2RlIHtcblx0cG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4ubGluZS1udW1iZXJzIC5saW5lLW51bWJlcnMtcm93cyB7XG5cdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0cG9pbnRlci1ldmVudHM6IG5vbmU7XG5cdHRvcDogMDtcblx0Zm9udC1zaXplOiAxMDAlO1xuXHRsZWZ0OiAtMy44ZW07XG5cdHdpZHRoOiAzZW07IC8qIHdvcmtzIGZvciBsaW5lLW51bWJlcnMgYmVsb3cgMTAwMCBsaW5lcyAqL1xuXHRsZXR0ZXItc3BhY2luZzogLTFweDtcblx0Ym9yZGVyLXJpZ2h0OiAxcHggc29saWQgIzk5OTtcblxuXHQtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuXHQtbW96LXVzZXItc2VsZWN0OiBub25lO1xuXHQtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG5cdHVzZXItc2VsZWN0OiBub25lO1xuXG59XG5cblx0LmxpbmUtbnVtYmVycy1yb3dzID4gc3BhbiB7XG5cdFx0cG9pbnRlci1ldmVudHM6IG5vbmU7XG5cdFx0ZGlzcGxheTogYmxvY2s7XG5cdFx0Y291bnRlci1pbmNyZW1lbnQ6IGxpbmVudW1iZXI7XG5cdH1cblxuXHRcdC5saW5lLW51bWJlcnMtcm93cyA+IHNwYW46YmVmb3JlIHtcblx0XHRcdGNvbnRlbnQ6IGNvdW50ZXIobGluZW51bWJlcik7XG5cdFx0XHRjb2xvcjogIzk5OTtcblx0XHRcdGRpc3BsYXk6IGJsb2NrO1xuXHRcdFx0cGFkZGluZy1yaWdodDogMC44ZW07XG5cdFx0XHR0ZXh0LWFsaWduOiByaWdodDtcblx0XHR9IiwiQGZvbnQtZmFjZSB7XHJcbiAgZm9udC1mYW1pbHk6ICdtYXBhY2hlJztcclxuICBzcmM6XHJcbiAgICB1cmwoJy4uL2ZvbnRzL21hcGFjaGUudHRmPzhiYXEyNScpIGZvcm1hdCgndHJ1ZXR5cGUnKSxcclxuICAgIHVybCgnLi4vZm9udHMvbWFwYWNoZS53b2ZmPzhiYXEyNScpIGZvcm1hdCgnd29mZicpLFxyXG4gICAgdXJsKCcuLi9mb250cy9tYXBhY2hlLnN2Zz84YmFxMjUjbWFwYWNoZScpIGZvcm1hdCgnc3ZnJyk7XHJcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcclxuICBmb250LXN0eWxlOiBub3JtYWw7XHJcbn1cclxuXHJcbltjbGFzc149XCJpLVwiXTpiZWZvcmUsIFtjbGFzcyo9XCIgaS1cIl06YmVmb3JlIHtcclxuICAvKiB1c2UgIWltcG9ydGFudCB0byBwcmV2ZW50IGlzc3VlcyB3aXRoIGJyb3dzZXIgZXh0ZW5zaW9ucyB0aGF0IGNoYW5nZSBmb250cyAqL1xyXG4gIGZvbnQtZmFtaWx5OiAnbWFwYWNoZScgIWltcG9ydGFudDtcclxuICBzcGVhazogbm9uZTtcclxuICBmb250LXN0eWxlOiBub3JtYWw7XHJcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcclxuICBmb250LXZhcmlhbnQ6IG5vcm1hbDtcclxuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcclxuICBsaW5lLWhlaWdodDogaW5oZXJpdDtcclxuXHJcbiAgLyogQmV0dGVyIEZvbnQgUmVuZGVyaW5nID09PT09PT09PT09ICovXHJcbiAgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XHJcbiAgLW1vei1vc3gtZm9udC1zbW9vdGhpbmc6IGdyYXlzY2FsZTtcclxufVxyXG5cclxuLmktbmF2aWdhdGVfYmVmb3JlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU0MDhcIjtcclxufVxyXG4uaS1uYXZpZ2F0ZV9uZXh0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU0MDlcIjtcclxufVxyXG4uaS10YWc6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTU0ZVwiO1xyXG59XHJcbi5pLWtleWJvYXJkX2Fycm93X2Rvd246YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTMxM1wiO1xyXG59XHJcbi5pLWFycm93X3Vwd2FyZDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlNWQ4XCI7XHJcbn1cclxuLmktY2xvdWRfZG93bmxvYWQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTJjMFwiO1xyXG59XHJcbi5pLXN0YXI6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTgzOFwiO1xyXG59XHJcbi5pLWtleWJvYXJkX2Fycm93X3VwOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGUzMTZcIjtcclxufVxyXG4uaS1vcGVuX2luX25ldzpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlODllXCI7XHJcbn1cclxuLmktd2FybmluZzpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlMDAyXCI7XHJcbn1cclxuLmktYmFjazpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlNWM0XCI7XHJcbn1cclxuLmktZm9yd2FyZDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlNWM4XCI7XHJcbn1cclxuLmktY2hhdDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlMGNiXCI7XHJcbn1cclxuLmktY2xvc2U6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTVjZFwiO1xyXG59XHJcbi5pLWNvZGUyOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU4NmZcIjtcclxufVxyXG4uaS1mYXZvcml0ZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlODdkXCI7XHJcbn1cclxuLmktbGluazpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlMTU3XCI7XHJcbn1cclxuLmktbWVudTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlNWQyXCI7XHJcbn1cclxuLmktZmVlZDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlMGU1XCI7XHJcbn1cclxuLmktc2VhcmNoOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU4YjZcIjtcclxufVxyXG4uaS1zaGFyZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlODBkXCI7XHJcbn1cclxuLmktY2hlY2tfY2lyY2xlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU4NmNcIjtcclxufVxyXG4uaS1wbGF5OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU5MDFcIjtcclxufVxyXG4uaS1kb3dubG9hZDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlOTAwXCI7XHJcbn1cclxuLmktY29kZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMTIxXCI7XHJcbn1cclxuLmktYmVoYW5jZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMWI0XCI7XHJcbn1cclxuLmktc3BvdGlmeTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMWJjXCI7XHJcbn1cclxuLmktY29kZXBlbjpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMWNiXCI7XHJcbn1cclxuLmktZ2l0aHViOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYwOWJcIjtcclxufVxyXG4uaS1saW5rZWRpbjpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMGUxXCI7XHJcbn1cclxuLmktZmxpY2tyOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxNmVcIjtcclxufVxyXG4uaS1kcmliYmJsZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMTdkXCI7XHJcbn1cclxuLmktcGludGVyZXN0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYyMzFcIjtcclxufVxyXG4uaS1tYXA6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjA0MVwiO1xyXG59XHJcbi5pLXR3aXR0ZXI6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjA5OVwiO1xyXG59XHJcbi5pLWZhY2Vib29rOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYwOWFcIjtcclxufVxyXG4uaS15b3V0dWJlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxNmFcIjtcclxufVxyXG4uaS1pbnN0YWdyYW06YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjE2ZFwiO1xyXG59XHJcbi5pLWdvb2dsZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMWEwXCI7XHJcbn1cclxuLmktcG9ja2V0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYyNjVcIjtcclxufVxyXG4uaS1yZWRkaXQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjI4MVwiO1xyXG59XHJcbi5pLXNuYXBjaGF0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYyYWNcIjtcclxufVxyXG5cclxuIiwiLypcclxuQHBhY2thZ2UgZ29kb2ZyZWRvbmluamFcclxuXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5NYXBhY2hlIHZhcmlhYmxlcyBzdHlsZXNcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiovXHJcblxyXG4vKipcclxuKiBUYWJsZSBvZiBDb250ZW50czpcclxuKlxyXG4qICAgMS4gQ29sb3JzXHJcbiogICAyLiBGb250c1xyXG4qICAgMy4gVHlwb2dyYXBoeVxyXG4qICAgNC4gSGVhZGVyXHJcbiogICA1LiBGb290ZXJcclxuKiAgIDYuIENvZGUgU3ludGF4XHJcbiogICA3LiBidXR0b25zXHJcbiogICA4LiBjb250YWluZXJcclxuKiAgIDkuIEdyaWRcclxuKiAgIDEwLiBNZWRpYSBRdWVyeSBSYW5nZXNcclxuKiAgIDExLiBJY29uc1xyXG4qL1xyXG5cclxuXHJcbi8qIDEuIENvbG9yc1xyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4kcHJpbWFyeS1jb2xvciAgICAgICAgOiAjNDI4NWY0O1xyXG4vLyAkcHJpbWFyeS1jb2xvciAgICAgICAgOiAjMjg1NmI2O1xyXG5cclxuJHByaW1hcnktdGV4dC1jb2xvcjogICMzMzM7XHJcbiRzZWNvbmRhcnktdGV4dC1jb2xvcjogICM5OTk7XHJcbiRhY2NlbnQtY29sb3I6ICAgICAgI2VlZTtcclxuXHJcbiRkaXZpZGVyLWNvbG9yOiAgICAgI0RERERERDtcclxuXHJcbi8vICRsaW5rLWNvbG9yICAgICA6ICM0MTg0RjM7XHJcbiRsaW5rLWNvbG9yICAgICA6ICMwMzliZTU7XHJcbi8vICRjb2xvci1iZy1wYWdlICA6ICNFRUVFRUU7XHJcblxyXG5cclxuLy8gc29jaWFsIGNvbG9yc1xyXG4kc29jaWFsLWNvbG9yczogKFxyXG4gIGZhY2Vib29rICAgIDogIzNiNTk5OCxcclxuICB0d2l0dGVyICAgICA6ICM1NWFjZWUsXHJcbiAgZ29vZ2xlICAgIDogI2RkNGIzOSxcclxuICBpbnN0YWdyYW0gICA6ICMzMDYwODgsXHJcbiAgeW91dHViZSAgICAgOiAjZTUyZDI3LFxyXG4gIGdpdGh1YiAgICAgIDogIzMzMzMzMyxcclxuICBsaW5rZWRpbiAgICA6ICMwMDdiYjYsXHJcbiAgc3BvdGlmeSAgICAgOiAjMmViZDU5LFxyXG4gIGNvZGVwZW4gICAgIDogIzIyMjIyMixcclxuICBiZWhhbmNlICAgICA6ICMxMzE0MTgsXHJcbiAgZHJpYmJibGUgICAgOiAjZWE0Yzg5LFxyXG4gIGZsaWNrciAgICAgICA6ICMwMDYzREMsXHJcbiAgcmVkZGl0ICAgIDogb3JhbmdlcmVkLFxyXG4gIHBvY2tldCAgICA6ICNGNTAwNTcsXHJcbiAgcGludGVyZXN0ICAgOiAjYmQwODFjLFxyXG4gIGZlZWQgICAgOiBvcmFuZ2UsXHJcbik7XHJcblxyXG5cclxuXHJcbi8qIDIuIEZvbnRzXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRwcmltYXJ5LWZvbnQ6ICAgICdSb2JvdG8nLCBzYW5zLXNlcmlmOyAvLyBmb250IGRlZmF1bHQgcGFnZVxyXG4kY29kZS1mb250OiAgICAgJ1JvYm90byBNb25vJywgbW9ub3NwYWNlOyAvLyBmb250IGZvciBjb2RlIGFuZCBwcmVcclxuXHJcblxyXG4vKiAzLiBUeXBvZ3JhcGh5XHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG4kc3BhY2VyOiAgICAgICAgICAgICAgICAgICAxcmVtO1xyXG4kbGluZS1oZWlnaHQ6ICAgICAgICAgICAgICAxLjU7XHJcblxyXG4kZm9udC1zaXplLXJvb3Q6ICAgICAgICAgICAxNnB4O1xyXG5cclxuJGZvbnQtc2l6ZS1iYXNlOiAgICAgICAgICAgMXJlbTtcclxuJGZvbnQtc2l6ZS1sZzogICAgICAgICAgICAgMS4yNXJlbTsgLy8gMjBweFxyXG4kZm9udC1zaXplLXNtOiAgICAgICAgICAgICAuODc1cmVtOyAvLzE0cHhcclxuJGZvbnQtc2l6ZS14czogICAgICAgICAgICAgLjAuODEyNTsgLy8xM3B4XHJcblxyXG4kZm9udC1zaXplLWgxOiAgICAgICAgICAgICAyLjI1cmVtO1xyXG4kZm9udC1zaXplLWgyOiAgICAgICAgICAgICAxLjg3NXJlbTtcclxuJGZvbnQtc2l6ZS1oMzogICAgICAgICAgICAgMS41NjI1cmVtO1xyXG4kZm9udC1zaXplLWg0OiAgICAgICAgICAgICAxLjM3NXJlbTtcclxuJGZvbnQtc2l6ZS1oNTogICAgICAgICAgICAgMS4xMjVyZW07XHJcbiRmb250LXNpemUtaDY6ICAgICAgICAgICAgIDFyZW07XHJcblxyXG5cclxuJGhlYWRpbmdzLW1hcmdpbi1ib3R0b206ICAgKCRzcGFjZXIgLyAyKTtcclxuJGhlYWRpbmdzLWZvbnQtZmFtaWx5OiAgICAgJHByaW1hcnktZm9udDtcclxuJGhlYWRpbmdzLWZvbnQtd2VpZ2h0OiAgICAgNTAwO1xyXG4kaGVhZGluZ3MtbGluZS1oZWlnaHQ6ICAgICAxLjE7XHJcbiRoZWFkaW5ncy1jb2xvcjogICAgICAgICAgIGluaGVyaXQ7XHJcblxyXG4kZm9udC13ZWlnaHQ6ICAgICAgIDUwMDtcclxuXHJcbiRibG9ja3F1b3RlLWZvbnQtc2l6ZTogICAgIDEuMTI1cmVtO1xyXG5cclxuXHJcbi8qIDQuIEhlYWRlclxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4kaGVhZGVyLWJnOiAkcHJpbWFyeS1jb2xvcjtcclxuJGhlYWRlci1jb2xvcjogI2ZmZjtcclxuJGhlYWRlci1oZWlnaHQ6IDUwcHg7XHJcbiRoZWFkZXItc2VhcmNoLWJnOiAjZWVlO1xyXG4kaGVhZGVyLXNlYXJjaC1jb2xvcjogIzc1NzU3NTtcclxuXHJcblxyXG4vKiA1LiBFbnRyeSBhcnRpY2xlc1xyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4kZW50cnktY29sb3ItdGl0bGU6ICMyMjI7XHJcbiRlbnRyeS1jb2xvci10aXRsZS1ob3ZlcjogIzc3NztcclxuJGVudHJ5LWZvbnQtc2l6ZTogMS43NXJlbTsgLy8gMjhweFxyXG4kZW50cnktZm9udC1zaXplLW1iOiAxLjI1cmVtOyAvLyAyMHB4XHJcbiRlbnRyeS1mb250LXNpemUtYnlsaW5lOiAwLjgxMjVyZW07IC8vIDEzcHhcclxuJGVudHJ5LWNvbG9yLWJ5bGluZTogIzk5OTtcclxuXHJcbi8qIDUuIEZvb3RlclxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4vLyAkZm9vdGVyLWJnLWNvbG9yOiAgICMwMDA7XHJcbiRmb290ZXItY29sb3ItbGluazogcmdiYSgwLCAwLCAwLCAuNik7XHJcbiRmb290ZXItY29sb3I6ICAgICAgcmdiYSgwLCAwLCAwLCAuNDQpO1xyXG5cclxuXHJcbi8qIDYuIENvZGUgU3ludGF4XHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRjb2RlLWJnLWNvbG9yOiAgICAgICAjZjdmN2Y3O1xyXG4kZm9udC1zaXplLWNvZGU6ICAgICAgMC45Mzc1cmVtO1xyXG4kY29kZS1jb2xvcjogICAgICAgICNjNzI1NGU7XHJcbiRwcmUtY29kZS1jb2xvcjogICAgICAgICMzNzQ3NGY7XHJcblxyXG5cclxuLyogNy4gYnV0dG9uc1xyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4kYnRuLXByaW1hcnktY29sb3I6ICAgICAgICRwcmltYXJ5LWNvbG9yO1xyXG4kYnRuLXNlY29uZGFyeS1jb2xvcjogICAgICMwMzliZTU7XHJcbiRidG4tYmFja2dyb3VuZC1jb2xvcjogICAgI2UxZjNmYztcclxuJGJ0bi1hY3RpdmUtYmFja2dyb3VuZDogICAjYzNlN2Y5O1xyXG5cclxuLyogOC4gY29udGFpbmVyXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG4kZ3JpZC1ndXR0ZXItd2lkdGg6ICAgICAgICAxLjg3NXJlbTsgLy8gMzBweFxyXG5cclxuJGNvbnRhaW5lci1zbTogICAgICAgICAgICAgNTc2cHg7XHJcbiRjb250YWluZXItbWQ6ICAgICAgICAgICAgIDc1MHB4O1xyXG4kY29udGFpbmVyLWxnOiAgICAgICAgICAgICA5NzBweDtcclxuJGNvbnRhaW5lci14bDogICAgICAgICAgICAgMTIwMHB4O1xyXG5cclxuXHJcbi8qIDkuIEdyaWRcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuJG51bS1jb2xzOiAxMjtcclxuJGd1dHRlci13aWR0aDogMS44NzVyZW07XHJcbiRlbGVtZW50LXRvcC1tYXJnaW46ICRndXR0ZXItd2lkdGgvMztcclxuJGVsZW1lbnQtYm90dG9tLW1hcmdpbjogKCRndXR0ZXItd2lkdGgqMikvMztcclxuXHJcblxyXG4vKiAxMC4gTWVkaWEgUXVlcnkgUmFuZ2VzXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRzbTogICAgICAgICAgICA2NDBweDtcclxuJG1kOiAgICAgICAgICAgIDc2NnB4O1xyXG4kbGc6ICAgICAgICAgICAgOTkycHg7XHJcbiR4bDogICAgICAgICAgICAxMjMwcHg7XHJcblxyXG4kc20tYW5kLXVwOiAgICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aCA6ICN7JHNtfSlcIjtcclxuJG1kLWFuZC11cDogICAgIFwib25seSBzY3JlZW4gYW5kIChtaW4td2lkdGggOiAjeyRtZH0pXCI7XHJcbiRsZy1hbmQtdXA6ICAgICBcIm9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoIDogI3skbGd9KVwiO1xyXG4keGwtYW5kLXVwOiAgICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aCA6ICN7JHhsfSlcIjtcclxuXHJcbiRzbS1hbmQtZG93bjogICBcIm9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoIDogI3skc219KVwiO1xyXG4kbWQtYW5kLWRvd246ICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aCA6ICN7JG1kfSlcIjtcclxuJGxnLWFuZC1kb3duOiAgIFwib25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGggOiAjeyRsZ30pXCI7XHJcblxyXG5cclxuLyogMTEuIGljb25zXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRpLW9wZW5faW5fbmV3OiAgICAgICdcXGU4OWUnO1xyXG4kaS13YXJuaW5nOiAgICAgICAgICAnXFxlMDAyJztcclxuJGktc3RhcjogICAgICAgICAgICAgJ1xcZTgzOCc7XHJcbiRpLWRvd25sb2FkOiAgICAgICAgICdcXGU5MDAnO1xyXG4kaS1jbG91ZF9kb3dubG9hZDogICAnXFxlMmMwJztcclxuJGktY2hlY2tfY2lyY2xlOiAgICAgJ1xcZTg2Yyc7XHJcbiRpLXBsYXk6ICAgICAgIFwiXFxlOTAxXCI7XHJcbiRpLWNvZGU6ICAgICAgIFwiXFxmMTIxXCI7XHJcbiRpLWNsb3NlOiAgICAgIFwiXFxlNWNkXCI7XHJcbiIsIi8vIGJveC1zaGFkb3dcclxuJXByaW1hcnktYm94LXNoYWRvdyB7XHJcbiAgYm94LXNoYWRvdzogMCAwIDRweCByZ2JhKDAsMCwwLC4xNCksMCA0cHggOHB4IHJnYmEoMCwwLDAsLjI4KTtcclxufVxyXG5cclxuJWZvbnQtaWNvbnN7XHJcbiAgZm9udC1mYW1pbHk6ICdtYXBhY2hlJyAhaW1wb3J0YW50O1xyXG4gIHNwZWFrOiBub25lO1xyXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcclxuICBmb250LXdlaWdodDogbm9ybWFsO1xyXG4gIGZvbnQtdmFyaWFudDogbm9ybWFsO1xyXG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xyXG4gIGxpbmUtaGVpZ2h0OiAxO1xyXG5cclxuICAvKiBCZXR0ZXIgRm9udCBSZW5kZXJpbmcgPT09PT09PT09PT0gKi9cclxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcclxuICAtbW96LW9zeC1mb250LXNtb290aGluZzogZ3JheXNjYWxlO1xyXG59XHJcblxyXG4vLyAgQ2xlYXIgYm90aFxyXG4udS1jbGVhcntcclxuICAmOmFmdGVyIHtcclxuICAgIGNsZWFyOiBib3RoO1xyXG4gICAgY29udGVudDogXCJcIjtcclxuICAgIGRpc3BsYXk6IHRhYmxlO1xyXG4gIH1cclxufVxyXG5cclxuLnUtbm90LWF2YXRhciB7YmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi9pbWFnZXMvYXZhdGFyLnBuZycpfVxyXG5cclxuLy8gYm9yZGVyLVxyXG4udS1iLWJ7IGJvcmRlci1ib3R0b206IHNvbGlkIDFweCAjZWVlO31cclxuLnUtYi10eyBib3JkZXItdG9wOiBzb2xpZCAxcHggI2VlZTt9XHJcblxyXG4vLyBQYWRkaW5nXHJcbi51LXAtdC0ye1xyXG4gIHBhZGRpbmctdG9wOiAycmVtO1xyXG59XHJcblxyXG4vLyBFbGltaW5hciBsYSBsaXN0YSBkZSBsYSA8dWw+XHJcbi51LXVuc3R5bGVke1xyXG4gIGxpc3Qtc3R5bGUtdHlwZTogbm9uZTtcclxuICBtYXJnaW46IDA7XHJcbiAgcGFkZGluZy1sZWZ0OiAwO1xyXG59XHJcblxyXG4udS1mbG9hdExlZnQgeyAgZmxvYXQ6IGxlZnQhaW1wb3J0YW50OyB9XHJcbi51LWZsb2F0UmlnaHQgeyBmbG9hdDogcmlnaHQhaW1wb3J0YW50OyB9XHJcblxyXG4vLyAgZmxleCBib3hcclxuLnUtZmxleHsgZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IHJvdzsgfVxyXG4udS1mbGV4LXdyYXAge2Rpc3BsYXk6IGZsZXg7IGZsZXgtd3JhcDogd3JhcDsgfVxyXG4udS1mbGV4LWNlbnRlcnsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjt9XHJcbi51LWZsZXgtYWxpbmctcmlnaHQgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO31cclxuLnUtZmxleC1hbGluZy1jZW50ZXIgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtmbGV4LWRpcmVjdGlvbjogY29sdW1uO31cclxuXHJcbi8vIG1hcmdpblxyXG4udS1tLXQtMXtcclxuICBtYXJnaW4tdG9wOiAxcmVtO1xyXG59XHJcblxyXG4vKiBUYWdzXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi51LXRhZ3N7XHJcbiAgZm9udC1zaXplOiAxMnB4ICFpbXBvcnRhbnQ7XHJcbiAgbWFyZ2luOiAzcHggIWltcG9ydGFudDtcclxuICBjb2xvcjogIzRjNTc2NSAhaW1wb3J0YW50O1xyXG4gIGJhY2tncm91bmQtY29sb3I6I2ViZWJlYiAhaW1wb3J0YW50O1xyXG4gIHRyYW5zaXRpb246IGFsbCAuM3M7XHJcbiAgJjpiZWZvcmV7XHJcbiAgICBwYWRkaW5nLXJpZ2h0OiA1cHg7XHJcbiAgICBvcGFjaXR5OiAuODtcclxuICB9XHJcbiAgJjpob3ZlcntcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRwcmltYXJ5LWNvbG9yICFpbXBvcnRhbnQ7XHJcbiAgICBjb2xvcjogI2ZmZiAhaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG5cclxuLy8gaGlkZSBnbG9iYWxcclxuLnUtaGlkZXtkaXNwbGF5OiBub25lICFpbXBvcnRhbnR9XHJcbi8vIGhpZGUgYmVmb3JlXHJcbkBtZWRpYSAjeyRtZC1hbmQtZG93bn17IC51LWgtYi1tZHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50IH0gfVxyXG5AbWVkaWEgI3skbGctYW5kLWRvd259eyAudS1oLWItbGd7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudCB9IH1cclxuXHJcbi8vIGhpZGUgYWZ0ZXJcclxuQG1lZGlhICN7JG1kLWFuZC11cH17IC51LWgtYS1tZHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50IH0gfVxyXG5AbWVkaWEgI3skbGctYW5kLXVwfXsgLnUtaC1hLWxneyBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQgfSB9XHJcbiIsImh0bWwge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAvLyBTZXRzIGEgc3BlY2lmaWMgZGVmYXVsdCBgZm9udC1zaXplYCBmb3IgdXNlciB3aXRoIGByZW1gIHR5cGUgc2NhbGVzLlxuICBmb250LXNpemU6ICRmb250LXNpemUtcm9vdDtcbiAgLy8gQ2hhbmdlcyB0aGUgZGVmYXVsdCB0YXAgaGlnaGxpZ2h0IHRvIGJlIGNvbXBsZXRlbHkgdHJhbnNwYXJlbnQgaW4gaU9TLlxuICAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMCk7XG59XG5cbiosXG4qOjpiZWZvcmUsXG4qOjphZnRlciB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbmEge1xuICBjb2xvcjogJGxpbmstY29sb3I7XG4gIG91dGxpbmU6IDA7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgLy8gR2V0cyByaWQgb2YgdGFwIGFjdGl2ZSBzdGF0ZVxuICAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6IHRyYW5zcGFyZW50O1xuXG4gICY6Zm9jdXMge1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAvLyBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgfVxuXG4gICYuZXh0ZXJuYWwge1xuICAgICY6OmFmdGVyIHtcbiAgICAgIEBleHRlbmQgJWZvbnQtaWNvbnM7XG4gICAgICBjb250ZW50OiAkaS1vcGVuX2luX25ldztcbiAgICAgIG1hcmdpbi1sZWZ0OiA1cHg7XG4gICAgfVxuICB9XG59XG5cbmJvZHkge1xuICAvLyBNYWtlIHRoZSBgYm9keWAgdXNlIHRoZSBgZm9udC1zaXplLXJvb3RgXG4gIGNvbG9yOiAkcHJpbWFyeS10ZXh0LWNvbG9yO1xuICBmb250LWZhbWlseTogJHByaW1hcnktZm9udDtcbiAgZm9udC1zaXplOiAkZm9udC1zaXplLWJhc2U7XG4gIGxpbmUtaGVpZ2h0OiAkbGluZS1oZWlnaHQ7XG4gIG1hcmdpbjogMCBhdXRvO1xufVxuXG5maWd1cmUgeyBtYXJnaW46IDA7IH1cblxuaW1nIHtcbiAgaGVpZ2h0OiBhdXRvO1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIHdpZHRoOiBhdXRvO1xuXG4gICY6bm90KFtzcmNdKSB7XG4gICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICB9XG59XG5cbi5pbWctcmVzcG9uc2l2ZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogYXV0bztcbn1cblxuaSB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cblxuaHIge1xuICBiYWNrZ3JvdW5kOiAjRjFGMkYxO1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsI0YxRjJGMSAwLCNiNWI1YjUgNTAlLCNGMUYyRjEgMTAwJSk7XG4gIGJvcmRlcjogbm9uZTtcbiAgaGVpZ2h0OiAxcHg7XG4gIG1hcmdpbjogODBweCBhdXRvO1xuICBtYXgtd2lkdGg6IDkwJTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICY6OmJlZm9yZSB7XG4gICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICBjb2xvcjogcmdiYSg3Myw1NSw2NSwuNzUpO1xuICAgIGNvbnRlbnQ6ICRpLWNvZGU7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgZm9udC1zaXplOiAzNXB4O1xuICAgIGxlZnQ6IDUwJTtcbiAgICBwYWRkaW5nOiAwIDI1cHg7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogNTAlO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsLTUwJSk7XG4gICAgQGV4dGVuZCAlZm9udC1pY29ucztcbiAgfVxufVxuXG5ibG9ja3F1b3RlIHtcbiAgYm9yZGVyLWxlZnQ6IDRweCBzb2xpZCAkcHJpbWFyeS1jb2xvcjtcbiAgcGFkZGluZzogLjc1cmVtIDEuNXJlbTtcbiAgYmFja2dyb3VuZDogI2ZiZmJmYztcbiAgY29sb3I6ICM3NTc1NzU7XG4gIGZvbnQtc2l6ZTogJGJsb2NrcXVvdGUtZm9udC1zaXplO1xuICBsaW5lLWhlaWdodDogMS43O1xuICBtYXJnaW46IDAgMCAxLjI1cmVtO1xuICBxdW90ZXM6IG5vbmU7XG59XG5cbm9sLHVsLGJsb2NrcXVvdGUge1xuICBtYXJnaW4tbGVmdDogMnJlbTtcbn1cblxuc3Ryb25nIHtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbn1cblxuc21hbGwsIC5zbWFsbCB7XG4gIGZvbnQtc2l6ZTogODUlO1xufVxuXG5vbCB7XG4gIHBhZGRpbmctbGVmdDogNDBweDtcbiAgbGlzdC1zdHlsZTogZGVjaW1hbCBvdXRzaWRlO1xufVxuXG5tYXJrIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgbGlnaHRlbigkcHJpbWFyeS1jb2xvciwgMzUlKSwgbGlnaHRlbigkcHJpbWFyeS1jb2xvciwgMzAlKSk7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG4uZm9vdGVyLFxuLm1haW4ge1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjVzIGVhc2U7XG4gIHotaW5kZXg6IDI7XG59XG5cbi8vIC5tYXBhY2hlLWZhY2Vib29rIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50OyB9XG5cbi8qIENvZGUgU3ludGF4XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xua2JkLHNhbXAsY29kZSB7XG4gIGZvbnQtZmFtaWx5OiAkY29kZS1mb250ICFpbXBvcnRhbnQ7XG4gIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1jb2RlO1xuICBjb2xvcjogJGNvZGUtY29sb3I7XG4gIGJhY2tncm91bmQ6ICRjb2RlLWJnLWNvbG9yO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHBhZGRpbmc6IDRweCA2cHg7XG4gIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbn1cblxuY29kZVtjbGFzcyo9bGFuZ3VhZ2UtXSxcbnByZVtjbGFzcyo9bGFuZ3VhZ2UtXSB7XG4gIGNvbG9yOiAkcHJlLWNvZGUtY29sb3I7XG4gIGxpbmUtaGVpZ2h0OiAxLjU7XG5cbiAgLnRva2VuLmNvbW1lbnQgeyBvcGFjaXR5OiAuODsgfVxuXG4gICYubGluZS1udW1iZXJzIHtcbiAgICBwYWRkaW5nLWxlZnQ6IDU4cHg7XG5cbiAgICAmOjpiZWZvcmUge1xuICAgICAgY29udGVudDogXCJcIjtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGxlZnQ6IDA7XG4gICAgICB0b3A6IDA7XG4gICAgICBiYWNrZ3JvdW5kOiAjRjBFREVFO1xuICAgICAgd2lkdGg6IDQwcHg7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgfVxuICB9XG5cbiAgLmxpbmUtbnVtYmVycy1yb3dzIHtcbiAgICBib3JkZXItcmlnaHQ6IG5vbmU7XG4gICAgdG9wOiAtM3B4O1xuICAgIGxlZnQ6IC01OHB4O1xuXG4gICAgJiA+IHNwYW46OmJlZm9yZSB7XG4gICAgICBwYWRkaW5nLXJpZ2h0OiAwO1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgb3BhY2l0eTogLjg7XG4gICAgfVxuICB9XG59XG5cbnByZSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICRjb2RlLWJnLWNvbG9yIWltcG9ydGFudDtcbiAgcGFkZGluZzogMXJlbTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICB3b3JkLXdyYXA6IG5vcm1hbDtcbiAgbWFyZ2luOiAyLjVyZW0gMCFpbXBvcnRhbnQ7XG4gIGZvbnQtZmFtaWx5OiAkY29kZS1mb250ICFpbXBvcnRhbnQ7XG4gIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1jb2RlO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgY29kZSB7XG4gICAgY29sb3I6ICRwcmUtY29kZS1jb2xvcjtcbiAgICB0ZXh0LXNoYWRvdzogMCAxcHggI2ZmZjtcbiAgICBwYWRkaW5nOiAwO1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICB9XG59XG5cbi8qIC53YXJuaW5nICYgLm5vdGUgJiAuc3VjY2Vzc1xuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi53YXJuaW5nIHtcbiAgYmFja2dyb3VuZDogI2ZiZTllNztcbiAgY29sb3I6ICNkNTAwMDA7XG4gICY6YmVmb3Jle2NvbnRlbnQ6ICRpLXdhcm5pbmc7fVxufVxuXG4ubm90ZXtcbiAgYmFja2dyb3VuZDogI2UxZjVmZTtcbiAgY29sb3I6ICMwMjg4ZDE7XG4gICY6YmVmb3Jle2NvbnRlbnQ6ICRpLXN0YXI7fVxufVxuXG4uc3VjY2Vzc3tcbiAgYmFja2dyb3VuZDogI2UwZjJmMTtcbiAgY29sb3I6ICMwMDg5N2I7XG4gICY6YmVmb3Jle2NvbnRlbnQ6ICRpLWNoZWNrX2NpcmNsZTtjb2xvcjogIzAwYmZhNTt9XG59XG5cbi53YXJuaW5nLCAubm90ZSwgLnN1Y2Nlc3N7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBtYXJnaW46IDFyZW0gMDtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBwYWRkaW5nOiAxMnB4IDI0cHggMTJweCA2MHB4O1xuICBsaW5lLWhlaWdodDogMS41O1xuICBhe1xuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgIGNvbG9yOiBpbmhlcml0O1xuICB9XG4gICY6YmVmb3Jle1xuICAgIG1hcmdpbi1sZWZ0OiAtMzZweDtcbiAgICBmbG9hdDogbGVmdDtcbiAgICBmb250LXNpemU6IDI0cHg7XG4gICAgQGV4dGVuZCAlZm9udC1pY29ucztcbiAgfVxufVxuXG5cbi8qIFNvY2lhbCBpY29uIGNvbG9yIGFuZCBiYWNrZ3JvdW5kXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuQGVhY2ggJHNvY2lhbC1uYW1lLCAkY29sb3IgaW4gJHNvY2lhbC1jb2xvcnMge1xuICAuYy0jeyRzb2NpYWwtbmFtZX17XG4gICAgY29sb3I6ICRjb2xvcjtcbiAgfVxuICAuYmctI3skc29jaWFsLW5hbWV9e1xuICAgIGJhY2tncm91bmQtY29sb3I6ICRjb2xvciAhaW1wb3J0YW50O1xuICB9XG59XG5cbi8vICBDbGVhciBib3RoXG4uY2xlYXJ7XG4gICY6YWZ0ZXIge1xuICAgIGNvbnRlbnQ6IFwiXCI7XG4gICAgZGlzcGxheTogdGFibGU7XG4gICAgY2xlYXI6IGJvdGg7XG4gIH1cbn1cblxuLyogcGFnaW5hdGlvbiBJbmZpbml0ZSBzY3JvbGxcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4ubWFwYWNoZS1sb2FkLW1vcmV7XG4gIGJvcmRlcjogc29saWQgMXB4ICNDM0MzQzM7XG4gIGNvbG9yOiAjN0Q3RDdEO1xuICBkaXNwbGF5OiBibG9jaztcbiAgZm9udC1zaXplOiAxNXB4O1xuICBoZWlnaHQ6IDQ1cHg7XG4gIG1hcmdpbjogNHJlbSBhdXRvO1xuICBwYWRkaW5nOiAxMXB4IDE2cHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB3aWR0aDogMTAwJTtcblxuICAmOmhvdmVye1xuICAgIGJhY2tncm91bmQ6ICRwcmltYXJ5LWNvbG9yO1xuICAgIGJvcmRlci1jb2xvcjogJHByaW1hcnktY29sb3I7XG4gICAgY29sb3I6ICNmZmY7XG4gIH1cbn1cblxuLy8gLnBhZ2luYXRpb24gbmF2XG4ucGFnaW5hdGlvbi1uYXZ7XG4gIHBhZGRpbmc6IDIuNXJlbSAwIDNyZW07XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgLnBhZ2UtbnVtYmVye1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgcGFkZGluZy10b3A6IDVweDtcbiAgICBAbWVkaWEgI3skbWQtYW5kLXVwfXtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fVxuICB9XG4gIC5uZXdlci1wb3N0c3tcbiAgICBmbG9hdDogbGVmdDtcbiAgfVxuICAub2xkZXItcG9zdHN7XG4gICAgZmxvYXQ6IHJpZ2h0XG4gIH1cbn1cblxuLyogU2Nyb2xsIFRvcFxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi5zY3JvbGxfdG9we1xuICBib3R0b206IDUwcHg7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgcmlnaHQ6IDIwcHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgei1pbmRleDogMTE7XG4gIHdpZHRoOiA2MHB4O1xuICBvcGFjaXR5OiAwO1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMC41cyBlYXNlO1xuXG4gICYudmlzaWJsZXtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHZpc2liaWxpdHk6IHZpc2libGU7XG4gIH1cblxuICAmOmhvdmVyIHN2ZyBwYXRoIHtcbiAgICBmaWxsOiByZ2JhKDAsMCwwLC42KTtcbiAgfVxufVxuXG4vLyBzdmcgYWxsIGljb25zXG4uc3ZnLWljb24gc3ZnIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogYXV0bztcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZpbGw6IGN1cnJlbnRjb2xvcjtcbn1cblxuLyogVmlkZW8gUmVzcG9uc2l2ZVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi52aWRlby1yZXNwb25zaXZle1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBoZWlnaHQ6IDA7XG4gIHBhZGRpbmc6IDA7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHBhZGRpbmctYm90dG9tOiA1Ni4yNSU7XG4gIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbiAgaWZyYW1le1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICBib3R0b206IDA7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGJvcmRlcjogMDtcbiAgfVxufVxuXG4vKiBWaWRlbyBmdWxsIGZvciB0YWcgdmlkZW9cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4jdmlkZW8tZm9ybWF0e1xuICAudmlkZW8tY29udGVudHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIHBhZGRpbmctYm90dG9tOiAxcmVtO1xuICAgIHNwYW57XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgbWFyZ2luLXJpZ2h0OiAuOHJlbTtcbiAgICB9XG4gIH1cbn1cblxuLyogUGFnZSBlcnJvciA0MDRcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4uZXJyb3JQYWdle1xuICBmb250LWZhbWlseTogJ1JvYm90byBNb25vJywgbW9ub3NwYWNlO1xuICBoZWlnaHQ6IDEwMHZoO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHdpZHRoOiAxMDAlO1xuXG4gICYtdGl0bGV7XG4gICAgcGFkZGluZzogMjRweCA2MHB4O1xuICB9XG5cbiAgJi1saW5re1xuICAgIGNvbG9yOiByZ2JhKDAsMCwwLDAuNTQpO1xuICAgIGZvbnQtc2l6ZTogMjJweDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGxlZnQ6IC01cHg7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHRleHQtcmVuZGVyaW5nOiBvcHRpbWl6ZUxlZ2liaWxpdHk7XG4gICAgdG9wOiAtNnB4O1xuICB9XG5cbiAgJi1lbW9qaXtcbiAgICBjb2xvcjogcmdiYSgwLDAsMCwwLjQpO1xuICAgIGZvbnQtc2l6ZTogMTUwcHg7XG4gIH1cblxuICAmLXRleHR7XG4gICAgY29sb3I6IHJnYmEoMCwwLDAsMC40KTtcbiAgICBsaW5lLWhlaWdodDogMjFweDtcbiAgICBtYXJnaW4tdG9wOiA2MHB4O1xuICAgIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbiAgfVxuXG4gICYtd3JhcHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBsZWZ0OiA1MCU7XG4gICAgbWluLXdpZHRoOiA2ODBweDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHRvcDogNTAlO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsLTUwJSk7XG4gIH1cbn1cblxuLyogUG9zdCBUd2l0dGVyIGZhY2Vib29rIGNhcmQgZW1iZWQgQ3NzIENlbnRlclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmlmcmFtZVtzcmMqPVwiZmFjZWJvb2suY29tXCJdLFxuLmZiLXBvc3QsXG4udHdpdHRlci10d2VldCB7XG4gIGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XG4gIG1hcmdpbjogMS41cmVtIDAgIWltcG9ydGFudDtcbn1cbiIsIi5jb250YWluZXJ7XHJcbiAgbWFyZ2luOiAwIGF1dG87XHJcbiAgcGFkZGluZy1sZWZ0OiAgKCRncmlkLWd1dHRlci13aWR0aCAvIDIpO1xyXG4gIHBhZGRpbmctcmlnaHQ6ICgkZ3JpZC1ndXR0ZXItd2lkdGggLyAyKTtcclxuICB3aWR0aDogMTAwJTtcclxuXHJcbiAgLy8gQG1lZGlhICN7JHNtLWFuZC11cH17bWF4LXdpZHRoOiAkY29udGFpbmVyLXNtO31cclxuICAvLyBAbWVkaWEgI3skbWQtYW5kLXVwfXttYXgtd2lkdGg6ICRjb250YWluZXItbWQ7fVxyXG4gIC8vIEBtZWRpYSAjeyRsZy1hbmQtdXB9e21heC13aWR0aDogJGNvbnRhaW5lci1sZzt9XHJcbiAgQG1lZGlhICN7JHhsLWFuZC11cH17bWF4LXdpZHRoOiAkY29udGFpbmVyLXhsO31cclxufVxyXG5cclxuLm1hcmdpbi10b3B7XHJcbiAgbWFyZ2luLXRvcDogJGhlYWRlci1oZWlnaHQ7XHJcbiAgcGFkZGluZy10b3A6IDFyZW07XHJcbiAgQG1lZGlhICN7JG1kLWFuZC11cH17cGFkZGluZy10b3A6IDEuOHJlbTt9XHJcbn1cclxuXHJcbkBtZWRpYSAjeyRtZC1hbmQtdXB9IHtcclxuICAuY29udGVudHtcclxuICAgIGZsZXg6IDEgIWltcG9ydGFudDtcclxuICAgIG1heC13aWR0aDogY2FsYygxMDAlIC0gMzAwcHgpICFpbXBvcnRhbnQ7XHJcbiAgICBvcmRlcjogMTtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgfVxyXG4gIC5zaWRlYmFye1xyXG4gICAgZmxleDogMCAwIDMzMHB4ICFpbXBvcnRhbnQ7XHJcbiAgICBvcmRlcjogMjtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAjeyRsZy1hbmQtdXB9IHtcclxuICAuZmVlZC1lbnRyeS13cmFwcGVye1xyXG4gICAgLmVudHJ5LWltYWdle1xyXG4gICAgICB3aWR0aDogNDYuNSUgIWltcG9ydGFudDtcclxuICAgICAgbWF4LXdpZHRoOiA0Ni41JSAhaW1wb3J0YW50O1xyXG4gICAgfVxyXG4gICAgLmVudHJ5LWJvZHl7XHJcbiAgICAgIHdpZHRoOiA1My41JSAhaW1wb3J0YW50O1xyXG4gICAgICBtYXgtd2lkdGg6IDUzLjUlICFpbXBvcnRhbnQ7XHJcbiAgICB9XHJcblxyXG4gIH1cclxufVxyXG5cclxuQG1lZGlhICN7JGxnLWFuZC1kb3dufSB7XHJcbiAgYm9keS5pcy1hcnRpY2xlIC5jb250ZW50IHtcclxuICAgIG1heC13aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi5yb3cge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleDogMCAxIGF1dG87XHJcbiAgZmxleC1mbG93OiByb3cgd3JhcDtcclxuICAvLyBtYXJnaW46IC04cHg7XHJcblxyXG4gIG1hcmdpbi1sZWZ0OiAtICRndXR0ZXItd2lkdGggLyAyO1xyXG4gIG1hcmdpbi1yaWdodDogLSAkZ3V0dGVyLXdpZHRoIC8gMjtcclxuXHJcbiAgLy8gLy8gQ2xlYXIgZmxvYXRpbmcgY2hpbGRyZW5cclxuICAvLyAmOmFmdGVyIHtcclxuICAvLyAgY29udGVudDogXCJcIjtcclxuICAvLyAgZGlzcGxheTogdGFibGU7XHJcbiAgLy8gIGNsZWFyOiBib3RoO1xyXG4gIC8vIH1cclxuXHJcbiAgLmNvbCB7XHJcbiAgICAvLyBmbG9hdDogbGVmdDtcclxuICAgIC8vIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgICBmbGV4OiAwIDAgYXV0bztcclxuICAgIHBhZGRpbmctbGVmdDogJGd1dHRlci13aWR0aCAvIDI7XHJcbiAgICBwYWRkaW5nLXJpZ2h0OiAkZ3V0dGVyLXdpZHRoIC8gMjtcclxuXHJcbiAgICAkaTogMTtcclxuICAgIEB3aGlsZSAkaSA8PSAkbnVtLWNvbHMge1xyXG4gICAgICAkcGVyYzogdW5xdW90ZSgoMTAwIC8gKCRudW0tY29scyAvICRpKSkgKyBcIiVcIik7XHJcbiAgICAgICYucyN7JGl9IHtcclxuICAgICAgICAvLyB3aWR0aDogJHBlcmM7XHJcbiAgICAgICAgZmxleC1iYXNpczogJHBlcmM7XHJcbiAgICAgICAgbWF4LXdpZHRoOiAkcGVyYztcclxuICAgICAgfVxyXG4gICAgICAkaTogJGkgKyAxO1xyXG4gICAgfVxyXG5cclxuICAgIEBtZWRpYSAjeyRtZC1hbmQtdXB9IHtcclxuXHJcbiAgICAgICRpOiAxO1xyXG4gICAgICBAd2hpbGUgJGkgPD0gJG51bS1jb2xzIHtcclxuICAgICAgICAkcGVyYzogdW5xdW90ZSgoMTAwIC8gKCRudW0tY29scyAvICRpKSkgKyBcIiVcIik7XHJcbiAgICAgICAgJi5tI3skaX0ge1xyXG4gICAgICAgICAgLy8gd2lkdGg6ICRwZXJjO1xyXG4gICAgICAgICAgZmxleC1iYXNpczogJHBlcmM7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6ICRwZXJjO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkaTogJGkgKyAxXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBAbWVkaWEgI3skbGctYW5kLXVwfSB7XHJcblxyXG4gICAgICAkaTogMTtcclxuICAgICAgQHdoaWxlICRpIDw9ICRudW0tY29scyB7XHJcbiAgICAgICAgJHBlcmM6IHVucXVvdGUoKDEwMCAvICgkbnVtLWNvbHMgLyAkaSkpICsgXCIlXCIpO1xyXG4gICAgICAgICYubCN7JGl9IHtcclxuICAgICAgICAgIC8vIHdpZHRoOiAkcGVyYztcclxuICAgICAgICAgIGZsZXgtYmFzaXM6ICRwZXJjO1xyXG4gICAgICAgICAgbWF4LXdpZHRoOiAkcGVyYztcclxuICAgICAgICB9XHJcbiAgICAgICAgJGk6ICRpICsgMTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJcclxuLy9cclxuLy8gSGVhZGluZ3NcclxuLy9cclxuXHJcbmgxLCBoMiwgaDMsIGg0LCBoNSwgaDYsXHJcbi5oMSwgLmgyLCAuaDMsIC5oNCwgLmg1LCAuaDYge1xyXG4gIG1hcmdpbi1ib3R0b206ICRoZWFkaW5ncy1tYXJnaW4tYm90dG9tO1xyXG4gIGZvbnQtZmFtaWx5OiAkaGVhZGluZ3MtZm9udC1mYW1pbHk7XHJcbiAgZm9udC13ZWlnaHQ6ICRoZWFkaW5ncy1mb250LXdlaWdodDtcclxuICBsaW5lLWhlaWdodDogJGhlYWRpbmdzLWxpbmUtaGVpZ2h0O1xyXG4gIGNvbG9yOiAkaGVhZGluZ3MtY29sb3I7XHJcbiAgbGV0dGVyLXNwYWNpbmc6IC0uMDJlbSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG5oMSB7IGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1oMTsgfVxyXG5oMiB7IGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1oMjsgfVxyXG5oMyB7IGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1oMzsgfVxyXG5oNCB7IGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1oNDsgfVxyXG5oNSB7IGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1oNTsgfVxyXG5oNiB7IGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1oNjsgfVxyXG5cclxuLy8gVGhlc2UgZGVjbGFyYXRpb25zIGFyZSBrZXB0IHNlcGFyYXRlIGZyb20gYW5kIHBsYWNlZCBhZnRlclxyXG4vLyB0aGUgcHJldmlvdXMgdGFnLWJhc2VkIGRlY2xhcmF0aW9ucyBzbyB0aGF0IHRoZSBjbGFzc2VzIGJlYXQgdGhlIHRhZ3MgaW5cclxuLy8gdGhlIENTUyBjYXNjYWRlLCBhbmQgdGh1cyA8aDEgY2xhc3M9XCJoMlwiPiB3aWxsIGJlIHN0eWxlZCBsaWtlIGFuIGgyLlxyXG4uaDEgeyBmb250LXNpemU6ICRmb250LXNpemUtaDE7IH1cclxuLmgyIHsgZm9udC1zaXplOiAkZm9udC1zaXplLWgyOyB9XHJcbi5oMyB7IGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1oMzsgfVxyXG4uaDQgeyBmb250LXNpemU6ICRmb250LXNpemUtaDQ7IH1cclxuLmg1IHsgZm9udC1zaXplOiAkZm9udC1zaXplLWg1OyB9XHJcbi5oNiB7IGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1oNjsgfVxyXG5cclxuaDEsIGgyLCBoMywgaDQsIGg1LCBoNiB7XHJcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcclxuICBhe1xyXG4gICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICBsaW5lLWhlaWdodDogaW5oZXJpdDtcclxuICB9XHJcbn1cclxuXHJcbnAge1xyXG4gIG1hcmdpbi10b3A6IDA7XHJcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcclxufVxyXG4iLCIvKiBOYXZpZ2F0aW9uIE1vYmlsZVxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4ubmF2LW1vYiB7XHJcbiAgYmFja2dyb3VuZDogJHByaW1hcnktY29sb3I7XHJcbiAgY29sb3I6ICMwMDA7XHJcbiAgaGVpZ2h0OiAxMDB2aDtcclxuICBsZWZ0OiAwO1xyXG4gIHBhZGRpbmc6IDAgMjBweDtcclxuICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgcmlnaHQ6IDA7XHJcbiAgdG9wOiAwO1xyXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDAlKTtcclxuICB0cmFuc2l0aW9uOiAuNHM7XHJcbiAgd2lsbC1jaGFuZ2U6IHRyYW5zZm9ybTtcclxuICB6LWluZGV4OiA5OTc7XHJcblxyXG4gIGF7XHJcbiAgICBjb2xvcjogaW5oZXJpdDtcclxuICB9XHJcblxyXG4gIHVsIHtcclxuICAgIGF7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICBmb250LXdlaWdodDogNTAwO1xyXG4gICAgICBwYWRkaW5nOiA4cHggMDtcclxuICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gICYtY29udGVudHtcclxuICAgIGJhY2tncm91bmQ6ICNlZWU7XHJcbiAgICBvdmVyZmxvdzogYXV0bztcclxuICAgIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBwYWRkaW5nOiAyMHB4IDA7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICByaWdodDogMDtcclxuICAgIHRvcDogJGhlYWRlci1oZWlnaHQ7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuLm5hdi1tb2IgdWwsXHJcbi5uYXYtbW9iLXN1YnNjcmliZSxcclxuLm5hdi1tb2ItZm9sbG93e1xyXG4gIGJvcmRlci1ib3R0b206IHNvbGlkIDFweCAjREREO1xyXG4gIHBhZGRpbmc6IDAgKCRncmlkLWd1dHRlci13aWR0aCAvIDIpICAyMHB4ICgkZ3JpZC1ndXR0ZXItd2lkdGggLyAyKTtcclxuICBtYXJnaW4tYm90dG9tOiAxNXB4O1xyXG59XHJcblxyXG4vKiBOYXZpZ2F0aW9uIE1vYmlsZSBmb2xsb3dcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLm5hdi1tb2ItZm9sbG93e1xyXG4gIGF7XHJcbiAgICBmb250LXNpemU6IDIwcHggIWltcG9ydGFudDtcclxuICAgIG1hcmdpbjogMCAycHggIWltcG9ydGFudDtcclxuICAgIHBhZGRpbmc6IDA7XHJcblxyXG4gICAgQGV4dGVuZCAuYnRuO1xyXG4gIH1cclxuXHJcbiAgQGVhY2ggJHNvY2lhbC1uYW1lLCAkY29sb3IgaW4gJHNvY2lhbC1jb2xvcnMge1xyXG4gICAgLmktI3skc29jaWFsLW5hbWV9e1xyXG4gICAgICBjb2xvcjogI2ZmZjtcclxuICAgICAgQGV4dGVuZCAuYmctI3skc29jaWFsLW5hbWV9O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyogQ29weVJpZ2hcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLm5hdi1tb2ItY29weXJpZ2h0e1xyXG4gIGNvbG9yOiAjYWFhO1xyXG4gIGZvbnQtc2l6ZTogMTNweDtcclxuICBwYWRkaW5nOiAyMHB4IDE1cHggMDtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgd2lkdGg6IDEwMCU7XHJcblxyXG4gIGF7Y29sb3I6ICRwcmltYXJ5LWNvbG9yfVxyXG59XHJcblxyXG4vKiBzdWJzY3JpYmVcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLm5hdi1tb2Itc3Vic2NyaWJle1xyXG4gIC5idG57XHJcbiAgICBib3JkZXItcmFkaXVzOiAwO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XHJcbiAgICB3aWR0aDogODBweDtcclxuICB9XHJcbiAgLmZvcm0tZ3JvdXAge3dpZHRoOiBjYWxjKDEwMCUgLSA4MHB4KX1cclxuICBpbnB1dHtcclxuICAgIGJvcmRlcjogMDtcclxuICAgIGJveC1zaGFkb3c6IG5vbmUgIWltcG9ydGFudDtcclxuICB9XHJcbn1cclxuIiwiLyogSGVhZGVyIFBhZ2VcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLmhlYWRlcntcclxuICBiYWNrZ3JvdW5kOiAkcHJpbWFyeS1jb2xvcjtcclxuICAvLyBjb2xvcjogJGhlYWRlci1jb2xvcjtcclxuICBoZWlnaHQ6ICRoZWFkZXItaGVpZ2h0O1xyXG4gIGxlZnQ6IDA7XHJcbiAgcGFkZGluZy1sZWZ0OiAxcmVtO1xyXG4gIHBhZGRpbmctcmlnaHQ6IDFyZW07XHJcbiAgcG9zaXRpb246IGZpeGVkO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIHRvcDogMDtcclxuICB6LWluZGV4OiA5OTk7XHJcblxyXG4gICYtd3JhcCBheyBjb2xvcjogJGhlYWRlci1jb2xvcjt9XHJcblxyXG4gICYtbG9nbyxcclxuICAmLWZvbGxvdyBhLFxyXG4gICYtbWVudSBhe1xyXG4gICAgaGVpZ2h0OiAkaGVhZGVyLWhlaWdodDtcclxuICAgIEBleHRlbmQgLnUtZmxleC1jZW50ZXI7XHJcbiAgfVxyXG5cclxuICAmLWZvbGxvdyxcclxuICAmLXNlYXJjaCxcclxuICAmLWxvZ297XHJcbiAgICBmbGV4OiAwIDAgYXV0bztcclxuICB9XHJcblxyXG4gIC8vIExvZ29cclxuICAmLWxvZ297XHJcbiAgICB6LWluZGV4OiA5OTg7XHJcbiAgICBmb250LXNpemU6ICRmb250LXNpemUtbGc7XHJcbiAgICBmb250LXdlaWdodDogNTAwO1xyXG4gICAgbGV0dGVyLXNwYWNpbmc6IDFweDtcclxuICAgIGltZ3tcclxuICAgICAgbWF4LWhlaWdodDogMzVweDtcclxuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLm5hdi1tb2ItdG9nZ2xlLFxyXG4gIC5zZWFyY2gtbW9iLXRvZ2dsZXtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICB6LWluZGV4OiA5OTg7XHJcbiAgfVxyXG5cclxuICAvLyBidG4gbW9iaWxlIG1lbnUgb3BlbiBhbmQgY2xvc2VcclxuICAubmF2LW1vYi10b2dnbGV7XHJcbiAgICBtYXJnaW4tbGVmdDogMCAhaW1wb3J0YW50O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAtICgkZ3JpZC1ndXR0ZXItd2lkdGggLyAyKTtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuNHM7XHJcblxyXG4gICAgc3BhbiB7XHJcbiAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkaGVhZGVyLWNvbG9yO1xyXG4gICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICBoZWlnaHQ6IDJweDtcclxuICAgICAgIGxlZnQ6IDE0cHg7XHJcbiAgICAgICBtYXJnaW4tdG9wOiAtMXB4O1xyXG4gICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgdG9wOiA1MCU7XHJcbiAgICAgICB0cmFuc2l0aW9uOiAuNHM7XHJcbiAgICAgICB3aWR0aDogMjBweDtcclxuICAgICAgICY6Zmlyc3QtY2hpbGQgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLC02cHgpOyB9XHJcbiAgICAgICAmOmxhc3QtY2hpbGQgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLDZweCk7IH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvLyBTaG9kb3cgZm9yIGhlYWRlclxyXG4gICYudG9vbGJhci1zaGFkb3d7IEBleHRlbmQgJXByaW1hcnktYm94LXNoYWRvdzsgfVxyXG4gICY6bm90KC50b29sYmFyLXNoYWRvdykgeyBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCFpbXBvcnRhbnQ7IH1cclxuXHJcbn1cclxuXHJcblxyXG4vKiBIZWFkZXIgTmF2aWdhdGlvblxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4uaGVhZGVyLW1lbnV7XHJcbiAgZmxleDogMSAxIDA7XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICB0cmFuc2l0aW9uOiBmbGV4IC4ycyxtYXJnaW4gLjJzLHdpZHRoIC4ycztcclxuXHJcbiAgdWx7XHJcbiAgICBtYXJnaW4tbGVmdDogMnJlbTtcclxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcblxyXG4gICAgbGl7IHBhZGRpbmctcmlnaHQ6IDE1cHg7IGRpc3BsYXk6IGlubGluZS1ibG9jazt9XHJcblxyXG4gICAgYXtcclxuICAgICAgcGFkZGluZzogMCA4cHg7XHJcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbiAgICAgICY6YmVmb3Jle1xyXG4gICAgICAgIGJhY2tncm91bmQ6ICRoZWFkZXItY29sb3I7XHJcbiAgICAgICAgYm90dG9tOiAwO1xyXG4gICAgICAgIGNvbnRlbnQ6ICcnO1xyXG4gICAgICAgIGhlaWdodDogMnB4O1xyXG4gICAgICAgIGxlZnQ6IDA7XHJcbiAgICAgICAgb3BhY2l0eTogMDtcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgdHJhbnNpdGlvbjogb3BhY2l0eSAuMnM7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIH1cclxuICAgICAgJjpob3ZlcjpiZWZvcmUsXHJcbiAgICAgICYuYWN0aXZlOmJlZm9yZXtcclxuICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxufVxyXG5cclxuXHJcbi8qIGhlYWRlciBzb2NpYWxcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLmhlYWRlci1mb2xsb3cgYSB7XHJcbiAgcGFkZGluZzogMCAxMHB4O1xyXG4gICY6aG92ZXJ7Y29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44MCl9XHJcbiAgJjpiZWZvcmV7Zm9udC1zaXplOiAkZm9udC1zaXplLWxnICFpbXBvcnRhbnQ7fVxyXG5cclxufVxyXG5cclxuXHJcblxyXG4vKiBIZWFkZXIgc2VhcmNoXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5oZWFkZXItc2VhcmNoe1xyXG4gIGJhY2tncm91bmQ6ICNlZWU7XHJcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xyXG4gIGRpc3BsYXk6IG5vbmU7XHJcbiAgLy8gZmxleDogMCAwIGF1dG87XHJcbiAgaGVpZ2h0OiAzNnB4O1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQgLjJzLGZsZXggLjJzO1xyXG4gIHZlcnRpY2FsLWFsaWduOiB0b3A7XHJcbiAgbWFyZ2luLWxlZnQ6IDEuNXJlbTtcclxuICBtYXJnaW4tcmlnaHQ6IDEuNXJlbTtcclxuXHJcbiAgLnNlYXJjaC1pY29ue1xyXG4gICAgY29sb3I6ICM3NTc1NzU7XHJcbiAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICBsZWZ0OiAyNHB4O1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAxMnB4O1xyXG4gICAgdHJhbnNpdGlvbjogY29sb3IgLjJzO1xyXG4gIH1cclxufVxyXG5cclxuaW5wdXQuc2VhcmNoLWZpZWxkIHtcclxuICBiYWNrZ3JvdW5kOiAwO1xyXG4gIGJvcmRlcjogMDtcclxuICBjb2xvcjogIzIxMjEyMTtcclxuICBoZWlnaHQ6IDM2cHg7XHJcbiAgcGFkZGluZzogMCA4cHggMCA3MnB4O1xyXG4gIHRyYW5zaXRpb246IGNvbG9yIC4ycztcclxuICB3aWR0aDogMTAwJTtcclxuICAmOmZvY3Vze1xyXG4gICAgYm9yZGVyOiAwO1xyXG4gICAgb3V0bGluZTogbm9uZTtcclxuICB9XHJcbn1cclxuXHJcbi5zZWFyY2gtcG9wb3V0e1xyXG4gIGJhY2tncm91bmQ6ICRoZWFkZXItY29sb3I7XHJcbiAgYm94LXNoYWRvdzogMCAwIDJweCByZ2JhKDAsMCwwLC4xMiksMCAycHggNHB4IHJnYmEoMCwwLDAsLjI0KSxpbnNldCAwIDRweCA2cHggLTRweCByZ2JhKDAsMCwwLC4yNCk7XHJcbiAgbWFyZ2luLXRvcDogMTBweDtcclxuICBtYXgtaGVpZ2h0OiBjYWxjKDEwMHZoIC0gMTUwcHgpO1xyXG4gIC8vIHdpZHRoOiBjYWxjKDEwMCUgKyAxMjBweCk7XHJcbiAgbWFyZ2luLWxlZnQ6IC02NHB4O1xyXG4gIG92ZXJmbG93LXk6IGF1dG87XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIC8vIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuMnMsdmlzaWJpbGl0eSAuMnM7XHJcbiAgLy8gdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xyXG5cclxuICB6LWluZGV4OiAtMTtcclxuXHJcbiAgJi5jbG9zZWR7XHJcbiAgICAvLyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTExMCUpO1xyXG4gICAgdmlzaWJpbGl0eTogaGlkZGVuO1xyXG4gIH1cclxufVxyXG5cclxuLnNlYXJjaC1zdWdnZXN0LXJlc3VsdHN7XHJcbiAgcGFkZGluZzogMCA4cHggMCA3NXB4O1xyXG5cclxuICBhe1xyXG4gICAgY29sb3I6ICMyMTIxMjE7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIG1hcmdpbi1sZWZ0OiAtOHB4O1xyXG4gICAgb3V0bGluZTogMDtcclxuICAgIGhlaWdodDogYXV0bztcclxuICAgIHBhZGRpbmc6IDhweDtcclxuICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQgLjJzO1xyXG4gICAgZm9udC1zaXplOiAkZm9udC1zaXplLXNtO1xyXG4gICAgJjpmaXJzdC1jaGlsZHtcclxuICAgICAgbWFyZ2luLXRvcDogMTBweDtcclxuICAgIH1cclxuICAgICY6bGFzdC1jaGlsZHtcclxuICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICAgIH1cclxuICAgICY6aG92ZXJ7XHJcbiAgICAgIGJhY2tncm91bmQ6ICNmN2Y3Zjc7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKiBtZWRpYXF1ZXJ5IG1lZGl1bVxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuQG1lZGlhICN7JGxnLWFuZC11cH17XHJcbiAgLmhlYWRlci1zZWFyY2h7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwyNTUsMjU1LC4yNSk7XHJcbiAgICBib3gtc2hhZG93OiAwIDFweCAxLjVweCByZ2JhKDAsMCwwLDAuMDYpLDAgMXB4IDFweCByZ2JhKDAsMCwwLDAuMTIpO1xyXG4gICAgY29sb3I6ICRoZWFkZXItY29sb3I7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICB3aWR0aDogMjAwcHg7XHJcblxyXG4gICAgJjpob3ZlcntcclxuICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwuNCk7XHJcbiAgICB9XHJcblxyXG4gICAgLnNlYXJjaC1pY29ue3RvcDogMHB4O31cclxuXHJcbiAgICBpbnB1dCwgaW5wdXQ6OnBsYWNlaG9sZGVyLCAuc2VhcmNoLWljb257Y29sb3I6ICNmZmY7fVxyXG5cclxuICB9XHJcblxyXG4gIC5zZWFyY2gtcG9wb3V0e1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBtYXJnaW4tbGVmdDogMDtcclxuICB9XHJcblxyXG4gIC8vIFNob3cgbGFyZ2Ugc2VhcmNoIGFuZCB2aXNpYmlsaXR5IGhpZGRlbiBoZWFkZXIgbWVudVxyXG4gIC5oZWFkZXIuaXMtc2hvd1NlYXJjaHtcclxuICAgIC5oZWFkZXItc2VhcmNoe1xyXG4gICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xyXG4gICAgICBmbGV4OiAxIDAgYXV0bztcclxuXHJcbiAgICAgIC5zZWFyY2gtaWNvbntjb2xvcjogIzc1NzU3NSAhaW1wb3J0YW50O31cclxuICAgICAgaW5wdXQsIGlucHV0OjpwbGFjZWhvbGRlciB7Y29sb3I6ICMyMTIxMjEgIWltcG9ydGFudH1cclxuICAgIH1cclxuICAgIC5oZWFkZXItbWVudXtcclxuICAgICAgZmxleDogMCAwIGF1dG87XHJcbiAgICAgIG1hcmdpbjogMDtcclxuICAgICAgdmlzaWJpbGl0eTogaGlkZGVuO1xyXG4gICAgICB3aWR0aDogMDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcblxyXG4vKiBNZWRpYSBRdWVyeVxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuQG1lZGlhICN7JGxnLWFuZC1kb3dufXtcclxuXHJcbiAgLmhlYWRlci1tZW51IHVseyBkaXNwbGF5OiBub25lOyB9XHJcblxyXG4gIC8vIHNob3cgc2VhcmNoIG1vYmlsZVxyXG4gIC5oZWFkZXIuaXMtc2hvd1NlYXJjaE1vYntcclxuICAgIHBhZGRpbmc6IDA7XHJcblxyXG4gICAgLmhlYWRlci1sb2dvLFxyXG4gICAgLm5hdi1tb2ItdG9nZ2xle1xyXG4gICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgfVxyXG5cclxuICAgIC5oZWFkZXItc2VhcmNoe1xyXG4gICAgICBib3JkZXItcmFkaXVzOiAwO1xyXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2sgIWltcG9ydGFudDtcclxuICAgICAgaGVpZ2h0OiAkaGVhZGVyLWhlaWdodDtcclxuICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICB3aWR0aDogMTAwJTtcclxuXHJcbiAgICAgIGlucHV0e1xyXG4gICAgICAgIGhlaWdodDogJGhlYWRlci1oZWlnaHQ7XHJcbiAgICAgICAgcGFkZGluZy1yaWdodDogNDhweDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLnNlYXJjaC1wb3BvdXR7bWFyZ2luLXRvcDogMDt9XHJcbiAgICB9XHJcblxyXG4gICAgLnNlYXJjaC1tb2ItdG9nZ2xle1xyXG4gICAgICBib3JkZXI6IDA7XHJcbiAgICAgIGNvbG9yOiAkaGVhZGVyLXNlYXJjaC1jb2xvcjtcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICByaWdodDogMDtcclxuICAgICAgJjpiZWZvcmV7Y29udGVudDogJGktY2xvc2UgIWltcG9ydGFudDt9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gc2hvdyBtZW51IG1vYmlsZVxyXG4gIGJvZHkuaXMtc2hvd05hdk1vYntcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcblxyXG4gICAgLm5hdi1tb2J7XHJcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKTtcclxuICAgIH1cclxuICAgIC5uYXYtbW9iLXRvZ2dsZSB7XHJcbiAgICAgIGJvcmRlcjogMDtcclxuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xyXG4gICAgICBzcGFuOmZpcnN0LWNoaWxkIHsgdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpIHRyYW5zbGF0ZSgwLDApO31cclxuICAgICAgc3BhbjpudGgtY2hpbGQoMikgeyB0cmFuc2Zvcm06IHNjYWxlWCgwKTt9XHJcbiAgICAgIHNwYW46bGFzdC1jaGlsZCB7dHJhbnNmb3JtOiByb3RhdGUoLTQ1ZGVnKSB0cmFuc2xhdGUoMCwwKTt9XHJcbiAgICB9XHJcbiAgICAuc2VhcmNoLW1vYi10b2dnbGV7XHJcbiAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLm1haW4sLmZvb3RlcntcclxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0yNSUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIiwiLy8gSGVhZGVyIHBvc3RcclxuLmNvdmVye1xyXG4gIGJhY2tncm91bmQ6ICRwcmltYXJ5LWNvbG9yO1xyXG4gIGJveC1zaGFkb3c6IDAgMCA0cHggcmdiYSgwLDAsMCwuMTQpLDAgNHB4IDhweCByZ2JhKDAsMCwwLC4yOCk7XHJcbiAgY29sb3I6ICNmZmY7XHJcbiAgbGV0dGVyLXNwYWNpbmc6IC4ycHg7XHJcbiAgbWluLWhlaWdodDogNTUwcHg7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIHRleHQtc2hhZG93OiAwIDAgMTBweCByZ2JhKDAsMCwwLC4zMyk7XHJcbiAgei1pbmRleDogMjtcclxuXHJcbiAgJi13cmFwe1xyXG4gICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICBtYXgtd2lkdGg6IDcwMHB4O1xyXG4gICAgcGFkZGluZzogMTZweDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIHotaW5kZXg6IDk5O1xyXG4gIH1cclxuXHJcbiAgJi10aXRsZXtcclxuICAgIGZvbnQtc2l6ZTogM3JlbTtcclxuICAgIG1hcmdpbjogMCAwIDMwcHggMDtcclxuICAgIGxpbmUtaGVpZ2h0OiAxLjI7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIC8vICBjb3ZlciBtb3VzZSBzY3JvbGxcclxuICAubW91c2V7XHJcbiAgICB3aWR0aDogMjVweDtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGhlaWdodDogMzZweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDE1cHg7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCAjODg4O1xyXG4gICAgYm9yZGVyOiAycHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjI3KTtcclxuICAgIGJvdHRvbTogNDBweDtcclxuICAgIHJpZ2h0OiA0MHB4O1xyXG4gICAgbWFyZ2luLWxlZnQ6IC0xMnB4O1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIDAuMnMgZWFzZS1pbjtcclxuICAgIC5zY3JvbGwge1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgbWFyZ2luOiA2cHggYXV0bztcclxuICAgICAgd2lkdGg6IDNweDtcclxuICAgICAgaGVpZ2h0OiA2cHg7XHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjY4KTtcclxuICAgICAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcclxuICAgICAgYW5pbWF0aW9uLW5hbWU6IHNjcm9sbDtcclxuICAgICAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBjb3ZlciBiYWNrZ3JvdW5kXHJcbiAgJi1iYWNrZ3JvdW5ke1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XHJcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XHJcbiAgICB0b3A6IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIGxlZnQ6IDA7XHJcblxyXG4gICAgJjpiZWZvcmV7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICBjb250ZW50OiAnICc7XHJcbiAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC42KTtcclxuICAgICAgYmFja2dyb3VuZDogLXdlYmtpdC1ncmFkaWVudChsaW5lYXIsIGxlZnQgdG9wLCBsZWZ0IGJvdHRvbSwgZnJvbShyZ2JhKDAsMCwwLDAuMSkpLCB0byhyZ2JhKDAsMCwwLDAuNykpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5cclxuLmF1dGhvcntcclxuICBhe2NvbG9yOiAjRkZGIWltcG9ydGFudDt9XHJcblxyXG4gICYtaGVhZGVye1xyXG4gICAgbWFyZ2luLXRvcDogMTAlO1xyXG4gIH1cclxuICAmLW5hbWUtd3JhcHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICB9XHJcbiAgJi10aXRsZXtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICB9XHJcbiAgJi1uYW1le1xyXG4gICAgbWFyZ2luOiA1cHggMDtcclxuICAgIGZvbnQtc2l6ZTogMS43NXJlbTtcclxuICB9XHJcbiAgJi1iaW97XHJcbiAgICBtYXJnaW46IDEuNXJlbSAwO1xyXG4gICAgbGluZS1oZWlnaHQ6IDEuODtcclxuICAgIGZvbnQtc2l6ZTogMThweDtcclxuICB9XHJcbiAgJi1hdmF0YXJ7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBib3JkZXItcmFkaXVzOiA5MHB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgd2lkdGg6IDgwcHg7XHJcbiAgICBoZWlnaHQ6IDgwcHg7XHJcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xyXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xyXG4gICAgdmVydGljYWwtYWxpZ246IGJvdHRvbTtcclxuICB9XHJcblxyXG4gIC8vIEF1dGhvciBtZXRhIChsb2NhdGlvbiAtIHdlYnNpdGUgLSBwb3N0IHRvdGFsKVxyXG4gICYtbWV0YXtcclxuICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICBzcGFue1xyXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgIGZvbnQtc2l6ZTogMTdweDtcclxuICAgICAgZm9udC1zdHlsZTogaXRhbGljO1xyXG4gICAgICBtYXJnaW46IDAgMnJlbSAxcmVtIDA7XHJcbiAgICAgIG9wYWNpdHk6IDAuODtcclxuICAgICAgd29yZC13cmFwOiBicmVhay13b3JkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLmF1dGhvci1saW5rOmhvdmVye1xyXG4gICAgb3BhY2l0eTogMTtcclxuICB9XHJcblxyXG4gIC8vICBhdXRob3IgRm9sbG93XHJcbiAgJi1mb2xsb3d7XHJcbiAgICBhe1xyXG4gICAgICBib3JkZXItcmFkaXVzOiAzcHg7XHJcbiAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCAwIDJweCByZ2JhKDI1NSwyNTUsMjU1LC41KTtcclxuICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgIGhlaWdodDogNDBweDtcclxuICAgICAgbGV0dGVyLXNwYWNpbmc6IDFweDtcclxuICAgICAgbGluZS1oZWlnaHQ6IDQwcHg7XHJcbiAgICAgIG1hcmdpbjogMCAxMHB4O1xyXG4gICAgICBwYWRkaW5nOiAwIDE2cHg7XHJcbiAgICAgIHRleHQtc2hhZG93OiBub25lO1xyXG4gICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAmOmhvdmVye1xyXG4gICAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCAwIDJweCAjZmZmO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxufVxyXG5cclxuXHJcbkBtZWRpYSAjeyRtZC1hbmQtdXB9e1xyXG4gIC5jb3ZlcntcclxuICAgICYtZGVzY3JpcHRpb257XHJcbiAgICAgIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1sZztcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5cclxuQG1lZGlhICN7JG1kLWFuZC1kb3dufSB7XHJcbiAgLmNvdmVye1xyXG4gICAgcGFkZGluZy10b3A6ICRoZWFkZXItaGVpZ2h0O1xyXG4gICAgcGFkZGluZy1ib3R0b206IDIwcHg7XHJcblxyXG4gICAgJi10aXRsZXtcclxuICAgICAgZm9udC1zaXplOiAycmVtO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLmF1dGhvci1hdmF0YXJ7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIG1hcmdpbjogMCBhdXRvIDEwcHggYXV0bztcclxuICB9XHJcbn1cclxuIiwiLmZlZWQtZW50cnktY29udGVudCAuZmVlZC1lbnRyeS13cmFwcGVyOmxhc3QtY2hpbGR7XHJcbiAgLmVudHJ5Omxhc3QtY2hpbGQge1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIGJvcmRlcjogbm9uZTtcclxuICB9XHJcbn1cclxuXHJcbi5lbnRyeXtcclxuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XHJcbiAgcGFkZGluZy1ib3R0b206IDA7XHJcblxyXG4gICYtaW1hZ2V7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gICAgJi0tbGluayB7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICBoZWlnaHQ6IDE4MHB4O1xyXG4gICAgICBsaW5lLWhlaWdodDogMDtcclxuICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcblxyXG4gICAgICAmOmhvdmVyIC5lbnRyeS1pbWFnZS0tYmd7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjAzKTtcclxuICAgICAgICBiYWNrZmFjZS12aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGltZ3tcclxuICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgICAgIGhlaWdodDogYXV0bztcclxuICAgICAgbWFyZ2luLWxlZnQ6IGF1dG87XHJcbiAgICAgIG1hcmdpbi1yaWdodDogYXV0bztcclxuICAgIH1cclxuICAgICYtLWJne1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XHJcbiAgICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XHJcbiAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gdmlkZW8gcGxheSBmb3IgdmlkZW8gcG9zdCBmb3JtYXRcclxuICAmLXZpZGVvLXBsYXl7XHJcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCAjZmZmO1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbiAgICBmb250LXNpemU6IDMuNXJlbTtcclxuICAgIGhlaWdodDogNjVweDtcclxuICAgIGxlZnQ6IDUwJTtcclxuICAgIGxpbmUtaGVpZ2h0OiA2NXB4O1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgdG9wOiA1MCU7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcclxuICAgIHdpZHRoOiA2NXB4O1xyXG4gICAgei1pbmRleDogMTA7XHJcbiAgICAvLyAmOmJlZm9yZXtsaW5lLWhlaWdodDogaW5oZXJpdH1cclxuICB9XHJcblxyXG4gICYtY2F0ZWdvcnl7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA1cHg7XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcclxuICAgIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1zbTtcclxuICAgIGxpbmUtaGVpZ2h0OiAxO1xyXG4gICAgYTphY3RpdmV7XHJcbiAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJi10aXRsZXtcclxuICAgIGNvbG9yOiAkZW50cnktY29sb3ItdGl0bGU7XHJcbiAgICBmb250LXNpemU6ICRlbnRyeS1mb250LXNpemUtbWI7XHJcbiAgICBoZWlnaHQ6IGF1dG87XHJcbiAgICBsaW5lLWhlaWdodDogMS4yO1xyXG4gICAgbWFyZ2luOiAwIDAgMXJlbTtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICAmOmhvdmVye1xyXG4gICAgICBjb2xvcjogJGVudHJ5LWNvbG9yLXRpdGxlLWhvdmVyO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJi1ieWxpbmV7XHJcbiAgICBtYXJnaW4tdG9wOiAwO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMS4xMjVyZW07XHJcbiAgICBjb2xvcjogJGVudHJ5LWNvbG9yLWJ5bGluZTtcclxuICAgIGZvbnQtc2l6ZTogJGVudHJ5LWZvbnQtc2l6ZS1ieWxpbmU7XHJcblxyXG4gICAgYSB7XHJcbiAgICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgICAmOmhvdmVyIHtcclxuICAgICAgICBjb2xvcjogIzMzMztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuXHJcblxyXG4vKiBFbnRyeSBzbWFsbCAtLXNtYWxsXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5lbnRyeS5lbnRyeS0tc21hbGx7XHJcbiAgbWFyZ2luLWJvdHRvbTogMThweDtcclxuICBwYWRkaW5nLWJvdHRvbTogMDtcclxuXHJcbiAgLmVudHJ5LWltYWdleyBtYXJnaW4tYm90dG9tOiAxMHB4O31cclxuICAuZW50cnktaW1hZ2UtLWxpbmt7aGVpZ2h0OiAxNzRweDt9XHJcbiAgLmVudHJ5LXRpdGxle1xyXG4gICAgZm9udC1zaXplOiAxcmVtO1xyXG4gICAgbGluZS1oZWlnaHQ6IDEuMjtcclxuICB9XHJcbiAgLmVudHJ5LWJ5bGluZXtcclxuICAgIG1hcmdpbjogMDtcclxuICB9XHJcbn1cclxuXHJcblxyXG5AbWVkaWEgI3skbGctYW5kLXVwfXtcclxuXHJcbiAgLmVudHJ5e1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMnJlbTtcclxuICAgIHBhZGRpbmctYm90dG9tOiAycmVtO1xyXG4gICAgJi10aXRsZXtcclxuICAgICAgZm9udC1zaXplOiAkZW50cnktZm9udC1zaXplO1xyXG4gICAgfVxyXG4gICAgJi1pbWFnZXtcclxuICAgICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgIH1cclxuICAgICYtaW1hZ2UtLWxpbmt7XHJcbiAgICAgIGhlaWdodDogMTgwcHg7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxuQG1lZGlhICN7JHhsLWFuZC11cH17XHJcbiAgLmVudHJ5LWltYWdlLS1saW5re2hlaWdodDogMjUwcHh9XHJcbn1cclxuIiwiLmZvb3RlciB7XHJcbiAgY29sb3I6ICRmb290ZXItY29sb3I7XHJcbiAgZm9udC1zaXplOiAxNHB4O1xyXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgbGluZS1oZWlnaHQgOiAxO1xyXG4gIHBhZGRpbmc6IDEuNnJlbSAxNXB4O1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuXHJcbiAgYSB7XHJcbiAgICBjb2xvcjogJGZvb3Rlci1jb2xvci1saW5rO1xyXG4gICAgJjpob3ZlciB7IGNvbG9yOiByZ2JhKDAsIDAsIDAsIC44KTsgfVxyXG4gIH1cclxuXHJcbiAgJi13cmFwIHtcclxuICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgbWF4LXdpZHRoOiAxNDAwcHg7XHJcbiAgfVxyXG5cclxuICAuaGVhcnQge1xyXG4gICAgYW5pbWF0aW9uOiBoZWFydGlmeSAuNXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xyXG4gICAgY29sb3I6IHJlZDtcclxuICB9XHJcblxyXG4gICYtY29weSxcclxuICAmLWRlc2lnbi1hdXRob3Ige1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgcGFkZGluZzogLjVyZW0gMDtcclxuICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuXHJcblxyXG5cclxuQGtleWZyYW1lcyBoZWFydGlmeSB7XHJcbiAgMCUge1xyXG4gICAgdHJhbnNmb3JtOiBzY2FsZSguOCk7XHJcbiAgfVxyXG59XHJcbiIsIi5idG57XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICBib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgYm9yZGVyOiAwO1xyXG4gIGJveC1zaGFkb3c6IG5vbmU7XHJcbiAgY29sb3I6ICRidG4tc2Vjb25kYXJ5LWNvbG9yO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgZm9udDogNTAwIDE0cHgvMjBweCAkcHJpbWFyeS1mb250O1xyXG4gIGhlaWdodDogMzZweDtcclxuICBtYXJnaW46IDA7XHJcbiAgbWluLXdpZHRoOiAzNnB4O1xyXG4gIG91dGxpbmU6IDA7XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICBwYWRkaW5nOiA4cHg7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcclxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgLjJzLGJveC1zaGFkb3cgLjJzO1xyXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XHJcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuXHJcbiAgKyAuYnRue21hcmdpbi1sZWZ0OiA4cHg7fVxyXG5cclxuICAmOmZvY3VzLFxyXG4gICY6aG92ZXJ7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYnRuLWJhY2tncm91bmQtY29sb3I7XHJcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmUgIWltcG9ydGFudDtcclxuICB9XHJcbiAgJjphY3RpdmV7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYnRuLWFjdGl2ZS1iYWNrZ3JvdW5kO1xyXG4gIH1cclxuXHJcbiAgJi5idG4tbGd7XHJcbiAgICBmb250LXNpemU6IDEuNXJlbTtcclxuICAgIG1pbi13aWR0aDogNDhweDtcclxuICAgIGhlaWdodDogNDhweDtcclxuICAgIGxpbmUtaGVpZ2h0OiA0OHB4O1xyXG4gIH1cclxuICAmLmJ0bi1mbGF0e1xyXG4gICAgYmFja2dyb3VuZDogMDtcclxuICAgIGJveC1zaGFkb3c6IG5vbmU7XHJcbiAgICAmOmZvY3VzLFxyXG4gICAgJjpob3ZlcixcclxuICAgICY6YWN0aXZle1xyXG4gICAgICBiYWNrZ3JvdW5kOiAwO1xyXG4gICAgICBib3gtc2hhZG93OiBub25lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJi5idG4tcHJpbWFyeXtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRidG4tcHJpbWFyeS1jb2xvcjtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgJjpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiBkYXJrZW4oJGJ0bi1wcmltYXJ5LWNvbG9yLCA0JSk7fVxyXG4gIH1cclxuICAmLmJ0bi1jaXJjbGV7XHJcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICBoZWlnaHQ6IDQwcHg7XHJcbiAgICBsaW5lLWhlaWdodDogNDBweDtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICB3aWR0aDogNDBweDtcclxuICB9XHJcbiAgJi5idG4tY2lyY2xlLXNtYWxse1xyXG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgaGVpZ2h0OiAzMnB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDMycHg7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgd2lkdGg6IDMycHg7XHJcbiAgICBtaW4td2lkdGg6IDMycHg7XHJcbiAgfVxyXG4gICYuYnRuLXNoYWRvd3tcclxuICAgIGJveC1zaGFkb3c6IDAgMnB4IDJweCAwIHJnYmEoMCwwLDAsMC4xMik7XHJcbiAgICBjb2xvcjogIzMzMztcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNlZWU7XHJcbiAgICAmOmhvdmVye2JhY2tncm91bmQtY29sb3I6IHJnYmEoMCwwLDAsMC4xMik7fVxyXG4gIH1cclxuXHJcbiAgJi5idG4tZG93bmxvYWQtY2xvdWQsXHJcbiAgJi5idG4tZG93bmxvYWR7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYnRuLXByaW1hcnktY29sb3I7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgICY6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjogZGFya2VuKCRidG4tcHJpbWFyeS1jb2xvciwgOCUpO31cclxuICAgICY6YWZ0ZXJ7XHJcbiAgICAgIEBleHRlbmQgJWZvbnQtaWNvbnM7XHJcbiAgICAgIG1hcmdpbi1sZWZ0OiA1cHg7XHJcbiAgICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xyXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAmLmJ0bi1kb3dubG9hZDphZnRlcntjb250ZW50OiAkaS1kb3dubG9hZDt9XHJcbiAgJi5idG4tZG93bmxvYWQtY2xvdWQ6YWZ0ZXJ7Y29udGVudDogJGktY2xvdWRfZG93bmxvYWQ7fVxyXG4gICYuZXh0ZXJuYWw6YWZ0ZXJ7Zm9udC1zaXplOiAxcmVtO31cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vICBJbnB1dFxyXG4uaW5wdXQtZ3JvdXAge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBkaXNwbGF5OiB0YWJsZTtcclxuICBib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4uZm9ybS1jb250cm9sIHtcclxuICB3aWR0aDogMTAwJTtcclxuICBwYWRkaW5nOiA4cHggMTJweDtcclxuICBmb250LXNpemU6IDE0cHg7XHJcbiAgbGluZS1oZWlnaHQ6IDEuNDI4NTc7XHJcbiAgY29sb3I6ICM1NTU7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiBub25lO1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XHJcbiAgYm9yZGVyLXJhZGl1czogMHB4O1xyXG4gIGJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLDAuMDc1KTtcclxuICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgZWFzZS1pbi1vdXQgMC4xNXMsYm94LXNoYWRvdyBlYXNlLWluLW91dCAwLjE1cztcclxuICBoZWlnaHQ6IDM2cHg7XHJcblxyXG4gICY6Zm9jdXMge1xyXG4gICAgYm9yZGVyLWNvbG9yOiAkYnRuLXByaW1hcnktY29sb3I7XHJcbiAgICBvdXRsaW5lOiAwO1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMXB4IHJnYmEoMCwwLDAsMC4wNzUpLDAgMCA4cHggcmdiYSgkYnRuLXByaW1hcnktY29sb3IsMC42KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4uYnRuLXN1YnNjcmliZS1ob21le1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gIGJvcmRlci1yYWRpdXM6IDNweDtcclxuICBib3gtc2hhZG93OiBpbnNldCAwIDAgMCAycHggaHNsYSgwLDAlLDEwMCUsLjUpO1xyXG4gIGNvbG9yOiAjZmZmZmZmO1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIGZvbnQtc2l6ZTogMjBweDtcclxuICBmb250LXdlaWdodDogNDAwO1xyXG4gIGxpbmUtaGVpZ2h0OiAxLjI7XHJcbiAgbWFyZ2luLXRvcDogNTBweDtcclxuICBtYXgtd2lkdGg6IDMwMHB4O1xyXG4gIG1heC13aWR0aDogMzAwcHg7XHJcbiAgcGFkZGluZzogMTVweCAxMHB4O1xyXG4gIHRyYW5zaXRpb246IGFsbCAwLjNzO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG5cclxuICAmOmhvdmVye1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgMnB4ICNmZmY7XHJcbiAgfVxyXG59XHJcbiIsIi8qICBQb3N0XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLnBvc3Qtd3JhcHBlciB7XG4gIG1hcmdpbi10b3A6ICRoZWFkZXItaGVpZ2h0O1xuICBwYWRkaW5nLXRvcDogMS44cmVtO1xufVxuXG4ucG9zdCB7XG5cbiAgJi1oZWFkZXIge1xuICAgIG1hcmdpbi1ib3R0b206IDEuMnJlbTtcbiAgfVxuXG4gICYtdGl0bGUge1xuICAgIGNvbG9yOiAjMjIyO1xuICAgIGZvbnQtc2l6ZTogMi41cmVtO1xuICAgIGhlaWdodDogYXV0bztcbiAgICBsaW5lLWhlaWdodDogMS4wNDtcbiAgICBtYXJnaW46IDAgMCAwLjkzNzVyZW07XG4gICAgbGV0dGVyLXNwYWNpbmc6IC0uMDI4ZW0gIWltcG9ydGFudDtcbiAgICBwYWRkaW5nOiAwO1xuICB9XG5cbiAgJi1leGNlcnB0IHtcbiAgICBsaW5lLWhlaWdodDogMS4zZW07XG4gICAgZm9udC1zaXplOiAyMHB4O1xuICAgIGNvbG9yOiAjN0Q3RDdEO1xuICAgIG1hcmdpbi1ib3R0b206IDhweDtcbiAgfVxuXG4gIC8vICBJbWFnZVxuICAmLWltYWdle1xuICAgIG1hcmdpbi1ib3R0b206IDEuNDVyZW07XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgfVxuXG4gIC8vIHBvc3QgY29udGVudFxuICAmLWJvZHl7XG4gICAgbWFyZ2luLWJvdHRvbTogMnJlbTtcblxuICAgIGE6Zm9jdXMge3RleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO31cblxuICAgIGgye1xuICAgICAgLy8gYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICRkaXZpZGVyLWNvbG9yO1xuICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgIG1hcmdpbjogMi41MHJlbSAwIDEuMjVyZW07XG4gICAgICBwYWRkaW5nLWJvdHRvbTogM3B4O1xuICAgIH1cbiAgICBoMyxoNHtcbiAgICAgIG1hcmdpbjogMzJweCAwIDE2cHg7XG4gICAgfVxuXG4gICAgaWZyYW1le1xuICAgICAgZGlzcGxheTogYmxvY2sgIWltcG9ydGFudDtcbiAgICAgIG1hcmdpbjogMCBhdXRvIDEuNXJlbSAwICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgaW1ne1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICAgIH1cblxuICAgIGgyIGEsIGgzIGEsIGg0IGEge1xuICAgICAgY29sb3I6ICRwcmltYXJ5LWNvbG9yLFxuICAgIH1cbiAgfVxuXG4gIC8vIHRhZ3NcbiAgJi10YWdze1xuICAgIG1hcmdpbjogMS4yNXJlbSAwO1xuICB9XG5cbiAgLy8gUG9zdCBjb21tZW50c1xuICAmLWNvbW1lbnRze1xuICAgIG1hcmdpbjogMCAwIDEuNXJlbTtcbiAgfVxuXG59XG5cbi8qIFBvc3QgYXV0aG9yIGJ5IGxpbmUgdG9wIChhdXRob3IgLSB0aW1lIC0gdGFnIC0gc2FocmUpXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLnBvc3QtYnlsaW5lIHtcbiAgY29sb3I6ICRzZWNvbmRhcnktdGV4dC1jb2xvcjtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmbGV4LWdyb3c6IDE7XG4gIGxldHRlci1zcGFjaW5nOiAtLjAyOGVtICFpbXBvcnRhbnQ7XG5cbiAgYSB7XG4gICAgY29sb3I6IGluaGVyaXQ7XG4gICAgJjphY3RpdmUgeyB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgfVxuICAgICY6aG92ZXIgeyBjb2xvcjogIzIyMiB9XG4gIH1cbn1cblxuLy8gUG9zdCBhY3Rpb25zIHRvcFxuLnBvc3QtYWN0aW9ucy0tdG9wIC5zaGFyZSB7XG4gIG1hcmdpbi1yaWdodDogMTBweDtcbiAgZm9udC1zaXplOiAyMHB4O1xuXG4gICY6aG92ZXIgeyBvcGFjaXR5OiAuNzsgfVxufVxuXG4ucG9zdC1hY3Rpb24tY29tbWVudHMge1xuICBjb2xvcjogJHNlY29uZGFyeS10ZXh0LWNvbG9yO1xuICBtYXJnaW4tcmlnaHQ6IDE1cHg7XG4gIGZvbnQtc2l6ZTogMTRweDtcbn1cblxuLyogUG9zdCBBY3Rpb24gc29jaWFsIG1lZGlhXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLnBvc3QtYWN0aW9ucyB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xuXG4gIGEge1xuICAgIGNvbG9yOiAjZmZmO1xuICAgIGZvbnQtc2l6ZTogMS4xMjVyZW07XG4gICAgJjpob3ZlciB7IGJhY2tncm91bmQtY29sb3I6ICMwMDAgIWltcG9ydGFudDsgfVxuICB9XG5cbiAgbGkge1xuICAgIG1hcmdpbi1sZWZ0OiA2cHg7XG4gICAgJjpmaXJzdC1jaGlsZCB7IG1hcmdpbi1sZWZ0OiAwICFpbXBvcnRhbnQ7IH1cbiAgfVxuXG4gIC5idG4geyBib3JkZXItcmFkaXVzOiAwOyB9XG59XG5cbi8qIFBvc3QgYXV0aG9yIHdpZGdldCBib3R0b21cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4ucG9zdC1hdXRob3J7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZm9udC1zaXplOiAxNXB4O1xuICBwYWRkaW5nOiAzMHB4IDAgMzBweCAxMDBweDtcbiAgbWFyZ2luLWJvdHRvbTogM3JlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2YzZjVmNjtcblxuXG4gIGg1e1xuICAgIGNvbG9yOiAjQUFBO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBsaW5lLWhlaWdodDogMS41O1xuICAgIG1hcmdpbjogMDtcbiAgfVxuXG4gIGxpe1xuICAgIG1hcmdpbi1sZWZ0OiAzMHB4O1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBhe2NvbG9yOiAjNTU1OyY6aG92ZXJ7Y29sb3I6ICMwMDA7fX1cbiAgICAmOmZpcnN0LWNoaWxke21hcmdpbi1sZWZ0OiAwO31cbiAgfVxuXG4gICYtYmlve1xuICAgIG1heC13aWR0aDogNTAwcHg7XG4gIH1cblxuICAucG9zdC1hdXRob3ItYXZhdGFye1xuICAgIGhlaWdodDogNjRweDtcbiAgICB3aWR0aDogNjRweDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogMjBweDtcbiAgICB0b3A6IDMwcHg7XG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyIGNlbnRlcjtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgfVxufVxuXG5cblxuLyogcHJldi1wb3N0IGFuZCBuZXh0LXBvc3Rcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4vLyAucHJldi1wb3N0LFxuLy8gLm5leHQtcG9zdHtcbi8vICAgYmFja2dyb3VuZDogbm9uZSByZXBlYXQgc2Nyb2xsIDAgMCAjZmZmO1xuLy8gICBib3JkZXI6IDFweCBzb2xpZCAjZTllOWVhO1xuLy8gICBjb2xvcjogIzIzNTI3Yztcbi8vICAgZGlzcGxheTogYmxvY2s7XG4vLyAgIGZvbnQtc2l6ZTogMTRweDtcbi8vICAgaGVpZ2h0OiA2MHB4O1xuLy8gICBsaW5lLWhlaWdodDogNjBweDtcbi8vICAgb3ZlcmZsb3c6IGhpZGRlbjtcbi8vICAgcG9zaXRpb246IGZpeGVkO1xuLy8gICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbi8vICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbi8vICAgdG9wOiBjYWxjKDUwJSAtIDI1cHgpO1xuLy8gICB0cmFuc2l0aW9uOiBhbGwgMC41cyBlYXNlIDBzO1xuLy8gICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuLy8gICB3aWR0aDogMjAwcHg7XG4vLyAgIHotaW5kZXg6IDk5OTtcblxuLy8gICAmOmJlZm9yZXtcbi8vICAgICBjb2xvcjogI2MzYzNjMztcbi8vICAgICBmb250LXNpemU6IDM2cHg7XG4vLyAgICAgaGVpZ2h0OiA2MHB4O1xuLy8gICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbi8vICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4vLyAgICAgdG9wOiAwO1xuLy8gICAgIHdpZHRoOiA1MHB4O1xuLy8gICB9XG4vLyB9XG5cbi8vIC5wcmV2LXBvc3Qge1xuLy8gICBsZWZ0OiAtMTUwcHg7XG4vLyAgIHBhZGRpbmctcmlnaHQ6IDUwcHg7XG4vLyAgIHRleHQtYWxpZ246IHJpZ2h0O1xuLy8gICAmOmhvdmVyeyBsZWZ0OjA7IH1cbi8vICAgJjpiZWZvcmV7IHJpZ2h0OiAwOyB9XG4vLyB9XG5cbi8vIC5uZXh0LXBvc3Qge1xuLy8gICByaWdodDogLTE1MHB4O1xuLy8gICBwYWRkaW5nLWxlZnQ6IDUwcHg7XG4vLyAgICY6aG92ZXJ7IHJpZ2h0OiAwOyB9XG4vLyAgICY6YmVmb3JleyBsZWZ0OiAwOyB9XG4vLyB9XG5cblxuLyogYm90dG9tIHNoYXJlIGFuZCBib3R0b20gc3Vic2NyaWJlXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLnNoYXJlLXN1YnNjcmliZXtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcblxuICBwe1xuICAgIGNvbG9yOiAjN2Q3ZDdkO1xuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG4gICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgZm9udC1zaXplOiAkZm9udC1zaXplLXNtO1xuICB9XG5cbiAgLnNvY2lhbC1zaGFyZXtmbG9hdDogbm9uZSAhaW1wb3J0YW50O31cblxuICAmPmRpdntcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBtYXJnaW4tYm90dG9tOiAxNXB4O1xuICAgICY6YmVmb3Jle1xuICAgICAgY29udGVudDogXCIgXCI7XG4gICAgICBib3JkZXItdG9wOiBzb2xpZCAxcHggIzAwMDtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRvcDogMDtcbiAgICAgIGxlZnQ6IDE1cHg7XG4gICAgICB3aWR0aDogNDBweDtcbiAgICAgIGhlaWdodDogMXB4O1xuICAgIH1cblxuICAgIGg1e1xuICAgICAgY29sb3I6ICM2NjY7XG4gICAgICBmb250LXNpemU6ICAkZm9udC1zaXplLXNtO1xuICAgICAgbWFyZ2luOiAxcmVtIDA7XG4gICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gIHN1YnNjcmliZVxuICAubmV3c2xldHRlci1mb3Jte1xuICAgIGRpc3BsYXk6IGZsZXg7XG5cbiAgICAuZm9ybS1ncm91cHtcbiAgICAgIG1heC13aWR0aDogMjUwcHg7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAuYnRue1xuICAgICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICB9XG4gIH1cblxufVxuXG5cbi8qIFJlbGF0ZWQgcG9zdFxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi5wb3N0LXJlbGF0ZWR7XG4gIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcblxuICAmLXRpdGxle1xuICAgIGZvbnQtc2l6ZTogMTdweDtcbiAgICBmb250LXdlaWdodDogNDAwO1xuICAgIGhlaWdodDogYXV0bztcbiAgICBsaW5lLWhlaWdodDogMTdweDtcbiAgICBtYXJnaW46IDAgMCAyMHB4O1xuICAgIHBhZGRpbmctYm90dG9tOiAxMHB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIH1cblxuICAmLWxpc3R7XG4gICAgbWFyZ2luLWJvdHRvbTogMThweDtcbiAgICBwYWRkaW5nOiAwO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgfVxuXG4gIC5uby1pbWFnZXtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgICAuZW50cnl7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkcHJpbWFyeS1jb2xvcjtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgYm90dG9tOiAwO1xuICAgICAgdG9wOiAwO1xuICAgICAgbGVmdDogMC45Mzc1cmVtO1xuICAgICAgcmlnaHQ6IDAuOTM3NXJlbTtcbiAgICB9XG5cbiAgICAuZW50cnktdGl0bGV7XG4gICAgICBjb2xvcjogI2ZmZjtcbiAgICAgIHBhZGRpbmc6IDAgMTBweDtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgJjpob3ZlcntcbiAgICAgICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43MCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn1cblxuXG4vKiBNZWRpYSBRdWVyeSAobWVkaXVtKVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuQG1lZGlhICN7JG1kLWFuZC11cH17XG4gIC5wb3N0e1xuICAgIC50aXRsZXtcbiAgICAgIGZvbnQtc2l6ZTogMi4yNXJlbTtcbiAgICAgIG1hcmdpbjogMCAwIDFyZW07XG4gICAgfVxuXG4gICAgJi1ib2R5IHtcbiAgICAgIGZvbnQtc2l6ZTogMS4xMjVyZW07XG4gICAgICBsaW5lLWhlaWdodDogMzJweDtcbiAgICAgIHB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG5AbWVkaWEgI3skc20tYW5kLWRvd259e1xuICAucG9zdC10aXRsZXtcbiAgICBmb250LXNpemU6IDEuOHJlbTtcbiAgfVxuICAucG9zdC1pbWFnZSxcbiAgLnZpZGVvLXJlc3BvbnNpdmV7XG4gICAgbWFyZ2luLWxlZnQ6ICAtICgkZ3JpZC1ndXR0ZXItd2lkdGggLyAyKTtcbiAgICBtYXJnaW4tcmlnaHQ6IC0gKCRncmlkLWd1dHRlci13aWR0aCAvIDIpO1xuICB9XG59XG4iLCIvKiBzaWRlYmFyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLnNpZGViYXJ7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbGluZS1oZWlnaHQ6IDEuNjtcblxuICBoMSxoMixoMyxoNCxoNSxoNnttYXJnaW4tdG9wOiAwO31cblxuICAmLWl0ZW1ze1xuICAgIG1hcmdpbi1ib3R0b206IDIuNXJlbTtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIH1cblxuICAmLXRpdGxle1xuICAgIHBhZGRpbmctYm90dG9tOiAxMHB4O1xuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBmb250LXNpemU6IDFyZW07XG4gICAgZm9udC13ZWlnaHQ6ICRmb250LXdlaWdodDtcbiAgICBAZXh0ZW5kIC51LWItYjtcbiAgfVxuXG4gIC50aXRsZS1wcmltYXJ5e1xuICAgIGJhY2tncm91bmQtY29sb3I6ICRwcmltYXJ5LWNvbG9yO1xuICAgIGNvbG9yOiAjRkZGRkZGO1xuICAgIHBhZGRpbmc6IDEwcHggMTZweDtcbiAgICBmb250LXNpemU6IDE4cHg7XG4gIH1cblxufVxuXG5cbi5zaWRlYmFyLXBvc3Qge1xuICBwYWRkaW5nLWJvdHRvbTogMnB4O1xuXG4gICYtLWJvcmRlciB7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBib3JkZXItbGVmdDogM3B4IHNvbGlkICRwcmltYXJ5LWNvbG9yO1xuICAgIGJvdHRvbTogMDtcbiAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuMik7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmb250LXNpemU6IDI4cHg7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgbGVmdDogMDtcbiAgICBsaW5lLWhlaWdodDogMTtcbiAgICBwYWRkaW5nOiAxNXB4IDEwcHggMTBweDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICB9XG5cbiAgJjpudGgtY2hpbGQoM24pIHsgLnNpZGViYXItcG9zdC0tYm9yZGVyIHsgYm9yZGVyLWNvbG9yOiBkYXJrZW4ob3JhbmdlLCAyJSkgfSB9XG4gICY6bnRoLWNoaWxkKDNuKzIpIHsgLnNpZGViYXItcG9zdC0tYm9yZGVyIHsgYm9yZGVyLWNvbG9yOiByZ2IoMCwgMTYwLCA1MikgfSB9XG5cblxuICAmLS1saW5rIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjU1LCAyNTUsIDI1NSk7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgbWluLWhlaWdodDogNTBweDtcbiAgICBwYWRkaW5nOiAxMHB4IDE1cHggMTBweCA1NXB4O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAgICY6aG92ZXIgLnNpZGViYXItcG9zdC0tYm9yZGVyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyMjksIDIzOSwgMjQ1KTtcbiAgICB9XG4gIH1cblxuICAmLS10aXRsZSB7XG4gICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC44KTtcbiAgICBmb250LXNpemU6IDE4cHg7XG4gICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICBtYXJnaW46IDA7XG4gIH1cbn1cbiIsIi5zdWJzY3JpYmV7XHJcbiAgbWluLWhlaWdodDogOTB2aDtcclxuICBwYWRkaW5nLXRvcDogJGhlYWRlci1oZWlnaHQ7XHJcblxyXG4gIGgze1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogOHB4O1xyXG4gICAgZm9udDogNDAwIDIwcHgvMzJweCAkcHJpbWFyeS1mb250O1xyXG4gIH1cclxuXHJcbiAgJi10aXRsZXtcclxuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XHJcbiAgICBtYXJnaW4tdG9wOiAwO1xyXG4gIH1cclxuXHJcbiAgJi13cmFwe1xyXG4gICAgbWF4LXdpZHRoOiA3MDBweDtcclxuICAgIGNvbG9yOiAjN2Q4NzhhO1xyXG4gICAgcGFkZGluZzogMXJlbSAwO1xyXG4gIH1cclxuXHJcbiAgLmZvcm0tZ3JvdXB7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XHJcblxyXG4gICAgJi5lcnJvcntcclxuICAgICAgaW5wdXQge2JvcmRlci1jb2xvcjogI2ZmNWI1Yjt9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAuYnRue1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLnN1YnNjcmliZS1mb3Jte1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBtYXJnaW46IDMwcHggYXV0bztcclxuICBwYWRkaW5nOiA0MHB4O1xyXG4gIG1heC13aWR0aDogNDAwcHg7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgYmFja2dyb3VuZDogI2ViZWZmMjtcclxuICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgdGV4dC1hbGlnbjogbGVmdDtcclxufVxyXG5cclxuLnN1YnNjcmliZS1pbnB1dHtcclxuICB3aWR0aDogMTAwJTtcclxuICBwYWRkaW5nOiAxMHB4O1xyXG4gIGJvcmRlcjogIzQyODVmNCAgMXB4IHNvbGlkO1xyXG4gIGJvcmRlci1yYWRpdXM6IDJweDtcclxuICAmOmZvY3Vze1xyXG4gICAgb3V0bGluZTogbm9uZTtcclxuICB9XHJcbn1cclxuIiwiLy8gYW5pbWF0ZWQgR2xvYmFsXHJcbi5hbmltYXRlZCB7XHJcbiAgICBhbmltYXRpb24tZHVyYXRpb246IDFzO1xyXG4gICAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcclxuICAgICYuaW5maW5pdGUge1xyXG4gICAgICAgIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBhbmltYXRlZCBBbGxcclxuLmJvdW5jZUluIHthbmltYXRpb24tbmFtZTogYm91bmNlSW47fVxyXG4uYm91bmNlSW5Eb3duIHthbmltYXRpb24tbmFtZTogYm91bmNlSW5Eb3dufVxyXG5cclxuXHJcbi8vIGFsbCBrZXlmcmFtZXMgQW5pbWF0ZXNcclxuXHJcbi8vIGJvdW5jZUluXHJcbkBrZXlmcmFtZXMgYm91bmNlSW4ge1xyXG4gICAgMCUsIDIwJSwgNDAlLCA2MCUsIDgwJSwgMTAwJSB7XHJcbiAgICAgICAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuMjE1LCAwLjYxMCwgMC4zNTUsIDEuMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICAwJSB7XHJcbiAgICAgICAgb3BhY2l0eTogMDtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlM2QoLjMsIC4zLCAuMyk7XHJcbiAgICB9XHJcblxyXG4gICAgMjAlIHtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlM2QoMS4xLCAxLjEsIDEuMSk7XHJcbiAgICB9XHJcblxyXG4gICAgNDAlIHtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlM2QoLjksIC45LCAuOSk7XHJcbiAgICB9XHJcblxyXG4gICAgNjAlIHtcclxuICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUzZCgxLjAzLCAxLjAzLCAxLjAzKTtcclxuICAgIH1cclxuXHJcbiAgICA4MCUge1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUzZCguOTcsIC45NywgLjk3KTtcclxuICAgIH1cclxuXHJcbiAgICAxMDAlIHtcclxuICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUzZCgxLCAxLCAxKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vLyBib3VuY2VJbkRvd25cclxuQGtleWZyYW1lcyBib3VuY2VJbkRvd24ge1xyXG4gICAgMCUsIDYwJSwgNzUlLCA5MCUsIDEwMCUge1xyXG4gICAgICAgIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjIxNSwgMC42MTAsIDAuMzU1LCAxLjAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgMCUge1xyXG4gICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAtMzAwMHB4LCAwKTtcclxuICAgIH1cclxuXHJcbiAgICA2MCUge1xyXG4gICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAyNXB4LCAwKTtcclxuICAgIH1cclxuXHJcbiAgICA3NSUge1xyXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgLTEwcHgsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIDkwJSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCA1cHgsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIDEwMCUge1xyXG4gICAgICAgIHRyYW5zZm9ybTogbm9uZTtcclxuICAgIH1cclxufVxyXG5cclxuQGtleWZyYW1lcyBwdWxzZXtcclxuICAgIGZyb217XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZTNkKDEsIDEsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIDUwJSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZTNkKDEuMDUsIDEuMDUsIDEuMDUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvIHtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlM2QoMSwgMSwgMSk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5Aa2V5ZnJhbWVzIHNjcm9sbHtcclxuICAgIDAle1xyXG4gICAgICAgIG9wYWNpdHk6MFxyXG4gICAgfVxyXG4gICAgMTAle1xyXG4gICAgICAgIG9wYWNpdHk6MTtcclxuICAgICAgICB0cmFuc2Zvcm06dHJhbnNsYXRlWSgwcHgpXHJcbiAgICB9XHJcbiAgICAxMDAlIHtcclxuICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxMHB4KTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gIHNwaW4gZm9yIHBhZ2luYXRpb25cclxuQGtleWZyYW1lcyBzcGluIHtcclxuICAgIGZyb20geyB0cmFuc2Zvcm06cm90YXRlKDBkZWcpOyB9XHJcbiAgICB0byB7IHRyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKTsgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsT0FBTyxDQUFQLGlDQUFPO0FBQ1AsT0FBTyxDQUFQLDhCQUFPO0FDUlAsQUFBQSxHQUFHLEFBQUEsYUFBYSxDQUFDO0VBQ2hCLFFBQVEsRUFBRSxRQUFRO0VBQ2xCLFlBQVksRUFBRSxLQUFLO0VBQ25CLGFBQWEsRUFBRSxVQUFVLEdBQ3pCOztBQUVELEFBQW1CLEdBQWhCLEFBQUEsYUFBYSxHQUFHLElBQUksQ0FBQztFQUN2QixRQUFRLEVBQUUsUUFBUSxHQUNsQjs7QUFFRCxBQUFjLGFBQUQsQ0FBQyxrQkFBa0IsQ0FBQztFQUNoQyxRQUFRLEVBQUUsUUFBUTtFQUNsQixjQUFjLEVBQUUsSUFBSTtFQUNwQixHQUFHLEVBQUUsQ0FBQztFQUNOLFNBQVMsRUFBRSxJQUFJO0VBQ2YsSUFBSSxFQUFFLE1BQU07RUFDWixLQUFLLEVBQUUsR0FBRztFQUFHLDZDQUE2QztFQUMxRCxjQUFjLEVBQUUsSUFBSTtFQUNwQixZQUFZLEVBQUUsY0FBYztFQUU1QixtQkFBbUIsRUFBRSxJQUFJO0VBQ3pCLGdCQUFnQixFQUFFLElBQUk7RUFDdEIsZUFBZSxFQUFFLElBQUk7RUFDckIsV0FBVyxFQUFFLElBQUksR0FFakI7O0FBRUEsQUFBcUIsa0JBQUgsR0FBRyxJQUFJLENBQUM7RUFDekIsY0FBYyxFQUFFLElBQUk7RUFDcEIsT0FBTyxFQUFFLEtBQUs7RUFDZCxpQkFBaUIsRUFBRSxVQUFVLEdBQzdCOztBQUVBLEFBQXFCLGtCQUFILEdBQUcsSUFBSSxBQUFBLE9BQU8sQ0FBQztFQUNoQyxPQUFPLEVBQUUsbUJBQW1CO0VBQzVCLEtBQUssRUFBRSxJQUFJO0VBQ1gsT0FBTyxFQUFFLEtBQUs7RUFDZCxhQUFhLEVBQUUsS0FB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 */","pre.line-numbers {\n\tposition: relative;\n\tpadding-left: 3.8em;\n\tcounter-reset: linenumber;\n}\n\npre.line-numbers > code {\n\tposition: relative;\n}\n\n.line-numbers .line-numbers-rows {\n\tposition: absolute;\n\tpointer-events: none;\n\ttop: 0;\n\tfont-size: 100%;\n\tleft: -3.8em;\n\twidth: 3em; /* works for line-numbers below 1000 lines */\n\tletter-spacing: -1px;\n\tborder-right: 1px solid #999;\n\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n\n}\n\n\t.line-numbers-rows > span {\n\t\tpointer-events: none;\n\t\tdisplay: block;\n\t\tcounter-increment: linenumber;\n\t}\n\n\t\t.line-numbers-rows > span:before {\n\t\t\tcontent: counter(linenumber);\n\t\t\tcolor: #999;\n\t\t\tdisplay: block;\n\t\t\tpadding-right: 0.8em;\n\t\t\ttext-align: right;\n\t\t}","@charset \"UTF-8\";\n\n@import url(~normalize.css/normalize.css);\n\n@import url(~prismjs/themes/prism.css);\n\npre.line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber;\n}\n\npre.line-numbers > code {\n  position: relative;\n}\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber;\n}\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right;\n}\n\n@font-face {\n  font-family: 'mapache';\n  src: url(\"./../fonts/mapache.ttf\") format(\"truetype\"), url(\"./../fonts/mapache.woff\") format(\"woff\"), url(\"./../fonts/mapache.svg\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n\n[class^=\"i-\"]:before,\n[class*=\" i-\"]:before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.i-navigate_before:before {\n  content: \"\\e408\";\n}\n\n.i-navigate_next:before {\n  content: \"\\e409\";\n}\n\n.i-tag:before {\n  content: \"\\e54e\";\n}\n\n.i-keyboard_arrow_down:before {\n  content: \"\\e313\";\n}\n\n.i-arrow_upward:before {\n  content: \"\\e5d8\";\n}\n\n.i-cloud_download:before {\n  content: \"\\e2c0\";\n}\n\n.i-star:before {\n  content: \"\\e838\";\n}\n\n.i-keyboard_arrow_up:before {\n  content: \"\\e316\";\n}\n\n.i-open_in_new:before {\n  content: \"\\e89e\";\n}\n\n.i-warning:before {\n  content: \"\\e002\";\n}\n\n.i-back:before {\n  content: \"\\e5c4\";\n}\n\n.i-forward:before {\n  content: \"\\e5c8\";\n}\n\n.i-chat:before {\n  content: \"\\e0cb\";\n}\n\n.i-close:before {\n  content: \"\\e5cd\";\n}\n\n.i-code2:before {\n  content: \"\\e86f\";\n}\n\n.i-favorite:before {\n  content: \"\\e87d\";\n}\n\n.i-link:before {\n  content: \"\\e157\";\n}\n\n.i-menu:before {\n  content: \"\\e5d2\";\n}\n\n.i-feed:before {\n  content: \"\\e0e5\";\n}\n\n.i-search:before {\n  content: \"\\e8b6\";\n}\n\n.i-share:before {\n  content: \"\\e80d\";\n}\n\n.i-check_circle:before {\n  content: \"\\e86c\";\n}\n\n.i-play:before {\n  content: \"\\e901\";\n}\n\n.i-download:before {\n  content: \"\\e900\";\n}\n\n.i-code:before {\n  content: \"\\f121\";\n}\n\n.i-behance:before {\n  content: \"\\f1b4\";\n}\n\n.i-spotify:before {\n  content: \"\\f1bc\";\n}\n\n.i-codepen:before {\n  content: \"\\f1cb\";\n}\n\n.i-github:before {\n  content: \"\\f09b\";\n}\n\n.i-linkedin:before {\n  content: \"\\f0e1\";\n}\n\n.i-flickr:before {\n  content: \"\\f16e\";\n}\n\n.i-dribbble:before {\n  content: \"\\f17d\";\n}\n\n.i-pinterest:before {\n  content: \"\\f231\";\n}\n\n.i-map:before {\n  content: \"\\f041\";\n}\n\n.i-twitter:before {\n  content: \"\\f099\";\n}\n\n.i-facebook:before {\n  content: \"\\f09a\";\n}\n\n.i-youtube:before {\n  content: \"\\f16a\";\n}\n\n.i-instagram:before {\n  content: \"\\f16d\";\n}\n\n.i-google:before {\n  content: \"\\f1a0\";\n}\n\n.i-pocket:before {\n  content: \"\\f265\";\n}\n\n.i-reddit:before {\n  content: \"\\f281\";\n}\n\n.i-snapchat:before {\n  content: \"\\f2ac\";\n}\n\n/*\r\n@package godofredoninja\r\n\r\n========================================================================\r\nMapache variables styles\r\n========================================================================\r\n*/\n\n/**\r\n* Table of Contents:\r\n*\r\n*   1. Colors\r\n*   2. Fonts\r\n*   3. Typography\r\n*   4. Header\r\n*   5. Footer\r\n*   6. Code Syntax\r\n*   7. buttons\r\n*   8. container\r\n*   9. Grid\r\n*   10. Media Query Ranges\r\n*   11. Icons\r\n*/\n\n/* 1. Colors\r\n========================================================================== */\n\n/* 2. Fonts\r\n========================================================================== */\n\n/* 3. Typography\r\n========================================================================== */\n\n/* 4. Header\r\n========================================================================== */\n\n/* 5. Entry articles\r\n========================================================================== */\n\n/* 5. Footer\r\n========================================================================== */\n\n/* 6. Code Syntax\r\n========================================================================== */\n\n/* 7. buttons\r\n========================================================================== */\n\n/* 8. container\r\n========================================================================== */\n\n/* 9. Grid\r\n========================================================================== */\n\n/* 10. Media Query Ranges\r\n========================================================================== */\n\n/* 11. icons\r\n========================================================================== */\n\n.header.toolbar-shadow {\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n}\n\na.external::after,\nhr::before,\n.warning:before,\n.note:before,\n.success:before,\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after,\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.u-clear:after {\n  clear: both;\n  content: \"\";\n  display: table;\n}\n\n.u-not-avatar {\n  background-image: url(\"./../images/avatar.png\");\n}\n\n.u-b-b,\n.sidebar-title {\n  border-bottom: solid 1px #eee;\n}\n\n.u-b-t {\n  border-top: solid 1px #eee;\n}\n\n.u-p-t-2 {\n  padding-top: 2rem;\n}\n\n.u-unstyled {\n  list-style-type: none;\n  margin: 0;\n  padding-left: 0;\n}\n\n.u-floatLeft {\n  float: left !important;\n}\n\n.u-floatRight {\n  float: right !important;\n}\n\n.u-flex {\n  display: flex;\n  flex-direction: row;\n}\n\n.u-flex-wrap {\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.u-flex-center,\n.header-logo,\n.header-follow a,\n.header-menu a {\n  display: flex;\n  align-items: center;\n}\n\n.u-flex-aling-right {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n}\n\n.u-flex-aling-center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n}\n\n.u-m-t-1 {\n  margin-top: 1rem;\n}\n\n/* Tags\r\n========================================================================== */\n\n.u-tags {\n  font-size: 12px !important;\n  margin: 3px !important;\n  color: #4c5765 !important;\n  background-color: #ebebeb !important;\n  transition: all .3s;\n}\n\n.u-tags:before {\n  padding-right: 5px;\n  opacity: .8;\n}\n\n.u-tags:hover {\n  background-color: #4285f4 !important;\n  color: #fff !important;\n}\n\n.u-hide {\n  display: none !important;\n}\n\n@media only screen and (max-width: 766px) {\n  .u-h-b-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  .u-h-b-lg {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  .u-h-a-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .u-h-a-lg {\n    display: none !important;\n  }\n}\n\nhtml {\n  box-sizing: border-box;\n  font-size: 16px;\n  -webkit-tap-highlight-color: transparent;\n}\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\na {\n  color: #039be5;\n  outline: 0;\n  text-decoration: none;\n  -webkit-tap-highlight-color: transparent;\n}\n\na:focus {\n  text-decoration: none;\n}\n\na.external::after {\n  content: \"\";\n  margin-left: 5px;\n}\n\nbody {\n  color: #333;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 0 auto;\n}\n\nfigure {\n  margin: 0;\n}\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n}\n\nimg:not([src]) {\n  visibility: hidden;\n}\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n\ni {\n  display: inline-block;\n  vertical-align: middle;\n}\n\nhr {\n  background: #F1F2F1;\n  background: linear-gradient(to right, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  border: none;\n  height: 1px;\n  margin: 80px auto;\n  max-width: 90%;\n  position: relative;\n}\n\nhr::before {\n  background: #fff;\n  color: rgba(73, 55, 65, 0.75);\n  content: \"\";\n  display: block;\n  font-size: 35px;\n  left: 50%;\n  padding: 0 25px;\n  position: absolute;\n  top: 50%;\n  transform: translate(-50%, -50%);\n}\n\nblockquote {\n  border-left: 4px solid #4285f4;\n  padding: .75rem 1.5rem;\n  background: #fbfbfc;\n  color: #757575;\n  font-size: 1.125rem;\n  line-height: 1.7;\n  margin: 0 0 1.25rem;\n  quotes: none;\n}\n\nol,\nul,\nblockquote {\n  margin-left: 2rem;\n}\n\nstrong {\n  font-weight: 500;\n}\n\nsmall,\n.small {\n  font-size: 85%;\n}\n\nol {\n  padding-left: 40px;\n  list-style: decimal outside;\n}\n\nmark {\n  background-image: linear-gradient(to bottom, #ebf2fe, #d3e2fc);\n  background-color: transparent;\n}\n\n.footer,\n.main {\n  transition: transform .5s ease;\n  z-index: 2;\n}\n\n/* Code Syntax\n========================================================================== */\n\nkbd,\nsamp,\ncode {\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  color: #c7254e;\n  background: #f7f7f7;\n  border-radius: 4px;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\ncode[class*=language-],\npre[class*=language-] {\n  color: #37474f;\n  line-height: 1.5;\n}\n\ncode[class*=language-] .token.comment,\npre[class*=language-] .token.comment {\n  opacity: .8;\n}\n\ncode[class*=language-].line-numbers,\npre[class*=language-].line-numbers {\n  padding-left: 58px;\n}\n\ncode[class*=language-].line-numbers::before,\npre[class*=language-].line-numbers::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  background: #F0EDEE;\n  width: 40px;\n  height: 100%;\n}\n\ncode[class*=language-] .line-numbers-rows,\npre[class*=language-] .line-numbers-rows {\n  border-right: none;\n  top: -3px;\n  left: -58px;\n}\n\ncode[class*=language-] .line-numbers-rows > span::before,\npre[class*=language-] .line-numbers-rows > span::before {\n  padding-right: 0;\n  text-align: center;\n  opacity: .8;\n}\n\npre {\n  background-color: #f7f7f7 !important;\n  padding: 1rem;\n  overflow: hidden;\n  border-radius: 4px;\n  word-wrap: normal;\n  margin: 2.5rem 0 !important;\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  position: relative;\n}\n\npre code {\n  color: #37474f;\n  text-shadow: 0 1px #fff;\n  padding: 0;\n  background: transparent;\n}\n\n/* .warning & .note & .success\n========================================================================== */\n\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n}\n\n.warning:before {\n  content: \"\";\n}\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n}\n\n.note:before {\n  content: \"\";\n}\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n}\n\n.success:before {\n  content: \"\";\n  color: #00bfa5;\n}\n\n.warning,\n.note,\n.success {\n  display: block;\n  margin: 1rem 0;\n  font-size: 1rem;\n  padding: 12px 24px 12px 60px;\n  line-height: 1.5;\n}\n\n.warning a,\n.note a,\n.success a {\n  text-decoration: underline;\n  color: inherit;\n}\n\n.warning:before,\n.note:before,\n.success:before {\n  margin-left: -36px;\n  float: left;\n  font-size: 24px;\n}\n\n/* Social icon color and background\n========================================================================== */\n\n.c-facebook {\n  color: #3b5998;\n}\n\n.bg-facebook,\n.nav-mob-follow .i-facebook {\n  background-color: #3b5998 !important;\n}\n\n.c-twitter {\n  color: #55acee;\n}\n\n.bg-twitter,\n.nav-mob-follow .i-twitter {\n  background-color: #55acee !important;\n}\n\n.c-google {\n  color: #dd4b39;\n}\n\n.bg-google,\n.nav-mob-follow .i-google {\n  background-color: #dd4b39 !important;\n}\n\n.c-instagram {\n  color: #306088;\n}\n\n.bg-instagram,\n.nav-mob-follow .i-instagram {\n  background-color: #306088 !important;\n}\n\n.c-youtube {\n  color: #e52d27;\n}\n\n.bg-youtube,\n.nav-mob-follow .i-youtube {\n  background-color: #e52d27 !important;\n}\n\n.c-github {\n  color: #333333;\n}\n\n.bg-github,\n.nav-mob-follow .i-github {\n  background-color: #333333 !important;\n}\n\n.c-linkedin {\n  color: #007bb6;\n}\n\n.bg-linkedin,\n.nav-mob-follow .i-linkedin {\n  background-color: #007bb6 !important;\n}\n\n.c-spotify {\n  color: #2ebd59;\n}\n\n.bg-spotify,\n.nav-mob-follow .i-spotify {\n  background-color: #2ebd59 !important;\n}\n\n.c-codepen {\n  color: #222222;\n}\n\n.bg-codepen,\n.nav-mob-follow .i-codepen {\n  background-color: #222222 !important;\n}\n\n.c-behance {\n  color: #131418;\n}\n\n.bg-behance,\n.nav-mob-follow .i-behance {\n  background-color: #131418 !important;\n}\n\n.c-dribbble {\n  color: #ea4c89;\n}\n\n.bg-dribbble,\n.nav-mob-follow .i-dribbble {\n  background-color: #ea4c89 !important;\n}\n\n.c-flickr {\n  color: #0063DC;\n}\n\n.bg-flickr,\n.nav-mob-follow .i-flickr {\n  background-color: #0063DC !important;\n}\n\n.c-reddit {\n  color: orangered;\n}\n\n.bg-reddit,\n.nav-mob-follow .i-reddit {\n  background-color: orangered !important;\n}\n\n.c-pocket {\n  color: #F50057;\n}\n\n.bg-pocket,\n.nav-mob-follow .i-pocket {\n  background-color: #F50057 !important;\n}\n\n.c-pinterest {\n  color: #bd081c;\n}\n\n.bg-pinterest,\n.nav-mob-follow .i-pinterest {\n  background-color: #bd081c !important;\n}\n\n.c-feed {\n  color: orange;\n}\n\n.bg-feed,\n.nav-mob-follow .i-feed {\n  background-color: orange !important;\n}\n\n.clear:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n/* pagination Infinite scroll\n========================================================================== */\n\n.mapache-load-more {\n  border: solid 1px #C3C3C3;\n  color: #7D7D7D;\n  display: block;\n  font-size: 15px;\n  height: 45px;\n  margin: 4rem auto;\n  padding: 11px 16px;\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n.mapache-load-more:hover {\n  background: #4285f4;\n  border-color: #4285f4;\n  color: #fff;\n}\n\n.pagination-nav {\n  padding: 2.5rem 0 3rem;\n  text-align: center;\n}\n\n.pagination-nav .page-number {\n  display: none;\n  padding-top: 5px;\n}\n\n@media only screen and (min-width: 766px) {\n  .pagination-nav .page-number {\n    display: inline-block;\n  }\n}\n\n.pagination-nav .newer-posts {\n  float: left;\n}\n\n.pagination-nav .older-posts {\n  float: right;\n}\n\n/* Scroll Top\n========================================================================== */\n\n.scroll_top {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  z-index: 11;\n  width: 60px;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity 0.5s ease;\n}\n\n.scroll_top.visible {\n  opacity: 1;\n  visibility: visible;\n}\n\n.scroll_top:hover svg path {\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n.svg-icon svg {\n  width: 100%;\n  height: auto;\n  display: block;\n  fill: currentcolor;\n}\n\n/* Video Responsive\n========================================================================== */\n\n.video-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n  padding-bottom: 56.25%;\n  margin-bottom: 1.5rem;\n}\n\n.video-responsive iframe {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  border: 0;\n}\n\n/* Video full for tag video\n========================================================================== */\n\n#video-format .video-content {\n  display: flex;\n  padding-bottom: 1rem;\n}\n\n#video-format .video-content span {\n  display: inline-block;\n  vertical-align: middle;\n  margin-right: .8rem;\n}\n\n/* Page error 404\n========================================================================== */\n\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n  height: 100vh;\n  position: relative;\n  width: 100%;\n}\n\n.errorPage-title {\n  padding: 24px 60px;\n}\n\n.errorPage-link {\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 22px;\n  font-weight: 500;\n  left: -5px;\n  position: relative;\n  text-rendering: optimizeLegibility;\n  top: -6px;\n}\n\n.errorPage-emoji {\n  color: rgba(0, 0, 0, 0.4);\n  font-size: 150px;\n}\n\n.errorPage-text {\n  color: rgba(0, 0, 0, 0.4);\n  line-height: 21px;\n  margin-top: 60px;\n  white-space: pre-wrap;\n}\n\n.errorPage-wrap {\n  display: block;\n  left: 50%;\n  min-width: 680px;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  transform: translate(-50%, -50%);\n}\n\n/* Post Twitter facebook card embed Css Center\n========================================================================== */\n\niframe[src*=\"facebook.com\"],\n.fb-post,\n.twitter-tweet {\n  display: block !important;\n  margin: 1.5rem 0 !important;\n}\n\n.container {\n  margin: 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n  width: 100%;\n}\n\n@media only screen and (min-width: 1230px) {\n  .container {\n    max-width: 1200px;\n  }\n}\n\n.margin-top {\n  margin-top: 50px;\n  padding-top: 1rem;\n}\n\n@media only screen and (min-width: 766px) {\n  .margin-top {\n    padding-top: 1.8rem;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  .content {\n    flex: 1 !important;\n    max-width: calc(100% - 300px) !important;\n    order: 1;\n    overflow: hidden;\n  }\n\n  .sidebar {\n    flex: 0 0 330px !important;\n    order: 2;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .feed-entry-wrapper .entry-image {\n    width: 46.5% !important;\n    max-width: 46.5% !important;\n  }\n\n  .feed-entry-wrapper .entry-body {\n    width: 53.5% !important;\n    max-width: 53.5% !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  body.is-article .content {\n    max-width: 100% !important;\n  }\n}\n\n.row {\n  display: flex;\n  flex: 0 1 auto;\n  flex-flow: row wrap;\n  margin-left: -0.9375rem;\n  margin-right: -0.9375rem;\n}\n\n.row .col {\n  flex: 0 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n}\n\n.row .col.s1 {\n  flex-basis: 8.33333%;\n  max-width: 8.33333%;\n}\n\n.row .col.s2 {\n  flex-basis: 16.66667%;\n  max-width: 16.66667%;\n}\n\n.row .col.s3 {\n  flex-basis: 25%;\n  max-width: 25%;\n}\n\n.row .col.s4 {\n  flex-basis: 33.33333%;\n  max-width: 33.33333%;\n}\n\n.row .col.s5 {\n  flex-basis: 41.66667%;\n  max-width: 41.66667%;\n}\n\n.row .col.s6 {\n  flex-basis: 50%;\n  max-width: 50%;\n}\n\n.row .col.s7 {\n  flex-basis: 58.33333%;\n  max-width: 58.33333%;\n}\n\n.row .col.s8 {\n  flex-basis: 66.66667%;\n  max-width: 66.66667%;\n}\n\n.row .col.s9 {\n  flex-basis: 75%;\n  max-width: 75%;\n}\n\n.row .col.s10 {\n  flex-basis: 83.33333%;\n  max-width: 83.33333%;\n}\n\n.row .col.s11 {\n  flex-basis: 91.66667%;\n  max-width: 91.66667%;\n}\n\n.row .col.s12 {\n  flex-basis: 100%;\n  max-width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  .row .col.m1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  .row .col.m2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  .row .col.m3 {\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .row .col.m4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  .row .col.m5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  .row .col.m6 {\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .row .col.m7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  .row .col.m8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  .row .col.m9 {\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .row .col.m10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  .row .col.m11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  .row .col.m12 {\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .row .col.l1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  .row .col.l2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  .row .col.l3 {\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .row .col.l4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  .row .col.l5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  .row .col.l6 {\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .row .col.l7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  .row .col.l8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  .row .col.l9 {\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .row .col.l10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  .row .col.l11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  .row .col.l12 {\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\n.h1,\n.h2,\n.h3,\n.h4,\n.h5,\n.h6 {\n  margin-bottom: 0.5rem;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: 500;\n  line-height: 1.1;\n  color: inherit;\n  letter-spacing: -.02em !important;\n}\n\nh1 {\n  font-size: 2.25rem;\n}\n\nh2 {\n  font-size: 1.875rem;\n}\n\nh3 {\n  font-size: 1.5625rem;\n}\n\nh4 {\n  font-size: 1.375rem;\n}\n\nh5 {\n  font-size: 1.125rem;\n}\n\nh6 {\n  font-size: 1rem;\n}\n\n.h1 {\n  font-size: 2.25rem;\n}\n\n.h2 {\n  font-size: 1.875rem;\n}\n\n.h3 {\n  font-size: 1.5625rem;\n}\n\n.h4 {\n  font-size: 1.375rem;\n}\n\n.h5 {\n  font-size: 1.125rem;\n}\n\n.h6 {\n  font-size: 1rem;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  margin-bottom: 1rem;\n}\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  color: inherit;\n  line-height: inherit;\n}\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\n\n/* Navigation Mobile\r\n========================================================================== */\n\n.nav-mob {\n  background: #4285f4;\n  color: #000;\n  height: 100vh;\n  left: 0;\n  padding: 0 20px;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  transition: .4s;\n  will-change: transform;\n  z-index: 997;\n}\n\n.nav-mob a {\n  color: inherit;\n}\n\n.nav-mob ul a {\n  display: block;\n  font-weight: 500;\n  padding: 8px 0;\n  text-transform: uppercase;\n  font-size: 14px;\n}\n\n.nav-mob-content {\n  background: #eee;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  bottom: 0;\n  left: 0;\n  padding: 20px 0;\n  position: absolute;\n  right: 0;\n  top: 50px;\n}\n\n.nav-mob ul,\n.nav-mob-subscribe,\n.nav-mob-follow {\n  border-bottom: solid 1px #DDD;\n  padding: 0 0.9375rem 20px 0.9375rem;\n  margin-bottom: 15px;\n}\n\n/* Navigation Mobile follow\r\n========================================================================== */\n\n.nav-mob-follow a {\n  font-size: 20px !important;\n  margin: 0 2px !important;\n  padding: 0;\n}\n\n.nav-mob-follow .i-facebook {\n  color: #fff;\n}\n\n.nav-mob-follow .i-twitter {\n  color: #fff;\n}\n\n.nav-mob-follow .i-google {\n  color: #fff;\n}\n\n.nav-mob-follow .i-instagram {\n  color: #fff;\n}\n\n.nav-mob-follow .i-youtube {\n  color: #fff;\n}\n\n.nav-mob-follow .i-github {\n  color: #fff;\n}\n\n.nav-mob-follow .i-linkedin {\n  color: #fff;\n}\n\n.nav-mob-follow .i-spotify {\n  color: #fff;\n}\n\n.nav-mob-follow .i-codepen {\n  color: #fff;\n}\n\n.nav-mob-follow .i-behance {\n  color: #fff;\n}\n\n.nav-mob-follow .i-dribbble {\n  color: #fff;\n}\n\n.nav-mob-follow .i-flickr {\n  color: #fff;\n}\n\n.nav-mob-follow .i-reddit {\n  color: #fff;\n}\n\n.nav-mob-follow .i-pocket {\n  color: #fff;\n}\n\n.nav-mob-follow .i-pinterest {\n  color: #fff;\n}\n\n.nav-mob-follow .i-feed {\n  color: #fff;\n}\n\n/* CopyRigh\r\n========================================================================== */\n\n.nav-mob-copyright {\n  color: #aaa;\n  font-size: 13px;\n  padding: 20px 15px 0;\n  text-align: center;\n  width: 100%;\n}\n\n.nav-mob-copyright a {\n  color: #4285f4;\n}\n\n/* subscribe\r\n========================================================================== */\n\n.nav-mob-subscribe .btn,\n.nav-mob-subscribe .nav-mob-follow a,\n.nav-mob-follow .nav-mob-subscribe a {\n  border-radius: 0;\n  text-transform: none;\n  width: 80px;\n}\n\n.nav-mob-subscribe .form-group {\n  width: calc(100% - 80px);\n}\n\n.nav-mob-subscribe input {\n  border: 0;\n  box-shadow: none !important;\n}\n\n/* Header Page\r\n========================================================================== */\n\n.header {\n  background: #4285f4;\n  height: 50px;\n  left: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: 999;\n}\n\n.header-wrap a {\n  color: #fff;\n}\n\n.header-logo,\n.header-follow a,\n.header-menu a {\n  height: 50px;\n}\n\n.header-follow,\n.header-search,\n.header-logo {\n  flex: 0 0 auto;\n}\n\n.header-logo {\n  z-index: 998;\n  font-size: 1.25rem;\n  font-weight: 500;\n  letter-spacing: 1px;\n}\n\n.header-logo img {\n  max-height: 35px;\n  position: relative;\n}\n\n.header .nav-mob-toggle,\n.header .search-mob-toggle {\n  padding: 0;\n  z-index: 998;\n}\n\n.header .nav-mob-toggle {\n  margin-left: 0 !important;\n  margin-right: -0.9375rem;\n  position: relative;\n  transition: transform .4s;\n}\n\n.header .nav-mob-toggle span {\n  background-color: #fff;\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  transition: .4s;\n  width: 20px;\n}\n\n.header .nav-mob-toggle span:first-child {\n  transform: translate(0, -6px);\n}\n\n.header .nav-mob-toggle span:last-child {\n  transform: translate(0, 6px);\n}\n\n.header:not(.toolbar-shadow) {\n  background-color: transparent !important;\n}\n\n/* Header Navigation\r\n========================================================================== */\n\n.header-menu {\n  flex: 1 1 0;\n  overflow: hidden;\n  transition: flex .2s,margin .2s,width .2s;\n}\n\n.header-menu ul {\n  margin-left: 2rem;\n  white-space: nowrap;\n}\n\n.header-menu ul li {\n  padding-right: 15px;\n  display: inline-block;\n}\n\n.header-menu ul a {\n  padding: 0 8px;\n  position: relative;\n}\n\n.header-menu ul a:before {\n  background: #fff;\n  bottom: 0;\n  content: '';\n  height: 2px;\n  left: 0;\n  opacity: 0;\n  position: absolute;\n  transition: opacity .2s;\n  width: 100%;\n}\n\n.header-menu ul a:hover:before,\n.header-menu ul a.active:before {\n  opacity: 1;\n}\n\n/* header social\r\n========================================================================== */\n\n.header-follow a {\n  padding: 0 10px;\n}\n\n.header-follow a:hover {\n  color: rgba(255, 255, 255, 0.8);\n}\n\n.header-follow a:before {\n  font-size: 1.25rem !important;\n}\n\n/* Header search\r\n========================================================================== */\n\n.header-search {\n  background: #eee;\n  border-radius: 2px;\n  display: none;\n  height: 36px;\n  position: relative;\n  text-align: left;\n  transition: background .2s,flex .2s;\n  vertical-align: top;\n  margin-left: 1.5rem;\n  margin-right: 1.5rem;\n}\n\n.header-search .search-icon {\n  color: #757575;\n  font-size: 24px;\n  left: 24px;\n  position: absolute;\n  top: 12px;\n  transition: color .2s;\n}\n\ninput.search-field {\n  background: 0;\n  border: 0;\n  color: #212121;\n  height: 36px;\n  padding: 0 8px 0 72px;\n  transition: color .2s;\n  width: 100%;\n}\n\ninput.search-field:focus {\n  border: 0;\n  outline: none;\n}\n\n.search-popout {\n  background: #fff;\n  box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24), inset 0 4px 6px -4px rgba(0, 0, 0, 0.24);\n  margin-top: 10px;\n  max-height: calc(100vh - 150px);\n  margin-left: -64px;\n  overflow-y: auto;\n  position: absolute;\n  z-index: -1;\n}\n\n.search-popout.closed {\n  visibility: hidden;\n}\n\n.search-suggest-results {\n  padding: 0 8px 0 75px;\n}\n\n.search-suggest-results a {\n  color: #212121;\n  display: block;\n  margin-left: -8px;\n  outline: 0;\n  height: auto;\n  padding: 8px;\n  transition: background .2s;\n  font-size: 0.875rem;\n}\n\n.search-suggest-results a:first-child {\n  margin-top: 10px;\n}\n\n.search-suggest-results a:last-child {\n  margin-bottom: 10px;\n}\n\n.search-suggest-results a:hover {\n  background: #f7f7f7;\n}\n\n/* mediaquery medium\r\n========================================================================== */\n\n@media only screen and (min-width: 992px) {\n  .header-search {\n    background: rgba(255, 255, 255, 0.25);\n    box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.12);\n    color: #fff;\n    display: inline-block;\n    width: 200px;\n  }\n\n  .header-search:hover {\n    background: rgba(255, 255, 255, 0.4);\n  }\n\n  .header-search .search-icon {\n    top: 0px;\n  }\n\n  .header-search input,\n  .header-search input::placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .search-popout {\n    width: 100%;\n    margin-left: 0;\n  }\n\n  .header.is-showSearch .header-search {\n    background: #fff;\n    flex: 1 0 auto;\n  }\n\n  .header.is-showSearch .header-search .search-icon {\n    color: #757575 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input::placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-menu {\n    flex: 0 0 auto;\n    margin: 0;\n    visibility: hidden;\n    width: 0;\n  }\n}\n\n/* Media Query\r\n========================================================================== */\n\n@media only screen and (max-width: 992px) {\n  .header-menu ul {\n    display: none;\n  }\n\n  .header.is-showSearchMob {\n    padding: 0;\n  }\n\n  .header.is-showSearchMob .header-logo,\n  .header.is-showSearchMob .nav-mob-toggle {\n    display: none;\n  }\n\n  .header.is-showSearchMob .header-search {\n    border-radius: 0;\n    display: inline-block !important;\n    height: 50px;\n    margin: 0;\n    width: 100%;\n  }\n\n  .header.is-showSearchMob .header-search input {\n    height: 50px;\n    padding-right: 48px;\n  }\n\n  .header.is-showSearchMob .header-search .search-popout {\n    margin-top: 0;\n  }\n\n  .header.is-showSearchMob .search-mob-toggle {\n    border: 0;\n    color: #757575;\n    position: absolute;\n    right: 0;\n  }\n\n  .header.is-showSearchMob .search-mob-toggle:before {\n    content: \"\" !important;\n  }\n\n  body.is-showNavMob {\n    overflow: hidden;\n  }\n\n  body.is-showNavMob .nav-mob {\n    transform: translateX(0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle {\n    border: 0;\n    transform: rotate(90deg);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:first-child {\n    transform: rotate(45deg) translate(0, 0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:nth-child(2) {\n    transform: scaleX(0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:last-child {\n    transform: rotate(-45deg) translate(0, 0);\n  }\n\n  body.is-showNavMob .search-mob-toggle {\n    display: none;\n  }\n\n  body.is-showNavMob .main,\n  body.is-showNavMob .footer {\n    transform: translateX(-25%);\n  }\n}\n\n.cover {\n  background: #4285f4;\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n  color: #fff;\n  letter-spacing: .2px;\n  min-height: 550px;\n  position: relative;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n  z-index: 2;\n}\n\n.cover-wrap {\n  margin: 0 auto;\n  max-width: 700px;\n  padding: 16px;\n  position: relative;\n  text-align: center;\n  z-index: 99;\n}\n\n.cover-title {\n  font-size: 3rem;\n  margin: 0 0 30px 0;\n  line-height: 1.2;\n}\n\n.cover .mouse {\n  width: 25px;\n  position: absolute;\n  height: 36px;\n  border-radius: 15px;\n  border: 2px solid #888;\n  border: 2px solid rgba(255, 255, 255, 0.27);\n  bottom: 40px;\n  right: 40px;\n  margin-left: -12px;\n  cursor: pointer;\n  transition: border-color 0.2s ease-in;\n}\n\n.cover .mouse .scroll {\n  display: block;\n  margin: 6px auto;\n  width: 3px;\n  height: 6px;\n  border-radius: 4px;\n  background: rgba(255, 255, 255, 0.68);\n  animation-duration: 2s;\n  animation-name: scroll;\n  animation-iteration-count: infinite;\n}\n\n.cover-background {\n  position: absolute;\n  overflow: hidden;\n  background-size: cover;\n  background-position: center;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n\n.cover-background:before {\n  display: block;\n  content: ' ';\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.6);\n  background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, 0.7)));\n}\n\n.author a {\n  color: #FFF !important;\n}\n\n.author-header {\n  margin-top: 10%;\n}\n\n.author-name-wrap {\n  display: inline-block;\n}\n\n.author-title {\n  display: block;\n  text-transform: uppercase;\n}\n\n.author-name {\n  margin: 5px 0;\n  font-size: 1.75rem;\n}\n\n.author-bio {\n  margin: 1.5rem 0;\n  line-height: 1.8;\n  font-size: 18px;\n}\n\n.author-avatar {\n  display: inline-block;\n  border-radius: 90px;\n  margin-right: 10px;\n  width: 80px;\n  height: 80px;\n  background-size: cover;\n  background-position: center;\n  vertical-align: bottom;\n}\n\n.author-meta {\n  margin-bottom: 20px;\n}\n\n.author-meta span {\n  display: inline-block;\n  font-size: 17px;\n  font-style: italic;\n  margin: 0 2rem 1rem 0;\n  opacity: 0.8;\n  word-wrap: break-word;\n}\n\n.author .author-link:hover {\n  opacity: 1;\n}\n\n.author-follow a {\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  cursor: pointer;\n  display: inline-block;\n  height: 40px;\n  letter-spacing: 1px;\n  line-height: 40px;\n  margin: 0 10px;\n  padding: 0 16px;\n  text-shadow: none;\n  text-transform: uppercase;\n}\n\n.author-follow a:hover {\n  box-shadow: inset 0 0 0 2px #fff;\n}\n\n@media only screen and (min-width: 766px) {\n  .cover-description {\n    font-size: 1.25rem;\n  }\n}\n\n@media only screen and (max-width: 766px) {\n  .cover {\n    padding-top: 50px;\n    padding-bottom: 20px;\n  }\n\n  .cover-title {\n    font-size: 2rem;\n  }\n\n  .author-avatar {\n    display: block;\n    margin: 0 auto 10px auto;\n  }\n}\n\n.feed-entry-content .feed-entry-wrapper:last-child .entry:last-child {\n  padding: 0;\n  border: none;\n}\n\n.entry {\n  margin-bottom: 1.5rem;\n  padding-bottom: 0;\n}\n\n.entry-image {\n  margin-bottom: 10px;\n}\n\n.entry-image--link {\n  display: block;\n  height: 180px;\n  line-height: 0;\n  margin: 0;\n  overflow: hidden;\n  position: relative;\n}\n\n.entry-image--link:hover .entry-image--bg {\n  transform: scale(1.03);\n  backface-visibility: hidden;\n}\n\n.entry-image img {\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  height: auto;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.entry-image--bg {\n  display: block;\n  width: 100%;\n  position: relative;\n  height: 100%;\n  background-position: center;\n  background-size: cover;\n  transition: transform 0.3s;\n}\n\n.entry-video-play {\n  border-radius: 50%;\n  border: 2px solid #fff;\n  color: #fff;\n  font-size: 3.5rem;\n  height: 65px;\n  left: 50%;\n  line-height: 65px;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  width: 65px;\n  z-index: 10;\n}\n\n.entry-category {\n  margin-bottom: 5px;\n  text-transform: capitalize;\n  font-size: 0.875rem;\n  line-height: 1;\n}\n\n.entry-category a:active {\n  text-decoration: underline;\n}\n\n.entry-title {\n  color: #222;\n  font-size: 1.25rem;\n  height: auto;\n  line-height: 1.2;\n  margin: 0 0 1rem;\n  padding: 0;\n}\n\n.entry-title:hover {\n  color: #777;\n}\n\n.entry-byline {\n  margin-top: 0;\n  margin-bottom: 1.125rem;\n  color: #999;\n  font-size: 0.8125rem;\n}\n\n.entry-byline a {\n  color: inherit;\n}\n\n.entry-byline a:hover {\n  color: #333;\n}\n\n/* Entry small --small\r\n========================================================================== */\n\n.entry.entry--small {\n  margin-bottom: 18px;\n  padding-bottom: 0;\n}\n\n.entry.entry--small .entry-image {\n  margin-bottom: 10px;\n}\n\n.entry.entry--small .entry-image--link {\n  height: 174px;\n}\n\n.entry.entry--small .entry-title {\n  font-size: 1rem;\n  line-height: 1.2;\n}\n\n.entry.entry--small .entry-byline {\n  margin: 0;\n}\n\n@media only screen and (min-width: 992px) {\n  .entry {\n    margin-bottom: 2rem;\n    padding-bottom: 2rem;\n  }\n\n  .entry-title {\n    font-size: 1.75rem;\n  }\n\n  .entry-image {\n    margin-bottom: 0;\n  }\n\n  .entry-image--link {\n    height: 180px;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  .entry-image--link {\n    height: 250px;\n  }\n}\n\n.footer {\n  color: rgba(0, 0, 0, 0.44);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1;\n  padding: 1.6rem 15px;\n  text-align: center;\n}\n\n.footer a {\n  color: rgba(0, 0, 0, 0.6);\n}\n\n.footer a:hover {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n.footer-wrap {\n  margin: 0 auto;\n  max-width: 1400px;\n}\n\n.footer .heart {\n  animation: heartify .5s infinite alternate;\n  color: red;\n}\n\n.footer-copy,\n.footer-design-author {\n  display: inline-block;\n  padding: .5rem 0;\n  vertical-align: middle;\n}\n\n@keyframes heartify {\n  0% {\n    transform: scale(0.8);\n  }\n}\n\n.btn,\n.nav-mob-follow a {\n  background-color: #fff;\n  border-radius: 2px;\n  border: 0;\n  box-shadow: none;\n  color: #039be5;\n  cursor: pointer;\n  display: inline-block;\n  font: 500 14px/20px \"Roboto\", sans-serif;\n  height: 36px;\n  margin: 0;\n  min-width: 36px;\n  outline: 0;\n  overflow: hidden;\n  padding: 8px;\n  text-align: center;\n  text-decoration: none;\n  text-overflow: ellipsis;\n  text-transform: uppercase;\n  transition: background-color .2s,box-shadow .2s;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n.btn + .btn,\n.nav-mob-follow a + .btn,\n.nav-mob-follow .btn + a,\n.nav-mob-follow a + a {\n  margin-left: 8px;\n}\n\n.btn:focus,\n.nav-mob-follow a:focus,\n.btn:hover,\n.nav-mob-follow a:hover {\n  background-color: #e1f3fc;\n  text-decoration: none !important;\n}\n\n.btn:active,\n.nav-mob-follow a:active {\n  background-color: #c3e7f9;\n}\n\n.btn.btn-lg,\n.nav-mob-follow a.btn-lg {\n  font-size: 1.5rem;\n  min-width: 48px;\n  height: 48px;\n  line-height: 48px;\n}\n\n.btn.btn-flat,\n.nav-mob-follow a.btn-flat {\n  background: 0;\n  box-shadow: none;\n}\n\n.btn.btn-flat:focus,\n.nav-mob-follow a.btn-flat:focus,\n.btn.btn-flat:hover,\n.nav-mob-follow a.btn-flat:hover,\n.btn.btn-flat:active,\n.nav-mob-follow a.btn-flat:active {\n  background: 0;\n  box-shadow: none;\n}\n\n.btn.btn-primary,\n.nav-mob-follow a.btn-primary {\n  background-color: #4285f4;\n  color: #fff;\n}\n\n.btn.btn-primary:hover,\n.nav-mob-follow a.btn-primary:hover {\n  background-color: #2f79f3;\n}\n\n.btn.btn-circle,\n.nav-mob-follow a.btn-circle {\n  border-radius: 50%;\n  height: 40px;\n  line-height: 40px;\n  padding: 0;\n  width: 40px;\n}\n\n.btn.btn-circle-small,\n.nav-mob-follow a.btn-circle-small {\n  border-radius: 50%;\n  height: 32px;\n  line-height: 32px;\n  padding: 0;\n  width: 32px;\n  min-width: 32px;\n}\n\n.btn.btn-shadow,\n.nav-mob-follow a.btn-shadow {\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);\n  color: #333;\n  background-color: #eee;\n}\n\n.btn.btn-shadow:hover,\n.nav-mob-follow a.btn-shadow:hover {\n  background-color: rgba(0, 0, 0, 0.12);\n}\n\n.btn.btn-download-cloud,\n.nav-mob-follow a.btn-download-cloud,\n.btn.btn-download,\n.nav-mob-follow a.btn-download {\n  background-color: #4285f4;\n  color: #fff;\n}\n\n.btn.btn-download-cloud:hover,\n.nav-mob-follow a.btn-download-cloud:hover,\n.btn.btn-download:hover,\n.nav-mob-follow a.btn-download:hover {\n  background-color: #1b6cf2;\n}\n\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after,\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  margin-left: 5px;\n  font-size: 1.1rem;\n  display: inline-block;\n  vertical-align: top;\n}\n\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  content: \"\";\n}\n\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after {\n  content: \"\";\n}\n\n.btn.external:after,\n.nav-mob-follow a.external:after {\n  font-size: 1rem;\n}\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n}\n\n.form-control {\n  width: 100%;\n  padding: 8px 12px;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 0px;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\n  height: 36px;\n}\n\n.form-control:focus {\n  border-color: #4285f4;\n  outline: 0;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(66, 133, 244, 0.6);\n}\n\n.btn-subscribe-home {\n  background-color: transparent;\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #ffffff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  max-width: 300px;\n  padding: 15px 10px;\n  transition: all 0.3s;\n  width: 100%;\n}\n\n.btn-subscribe-home:hover {\n  box-shadow: inset 0 0 0 2px #fff;\n}\n\n/*  Post\n========================================================================== */\n\n.post-wrapper {\n  margin-top: 50px;\n  padding-top: 1.8rem;\n}\n\n.post-header {\n  margin-bottom: 1.2rem;\n}\n\n.post-title {\n  color: #222;\n  font-size: 2.5rem;\n  height: auto;\n  line-height: 1.04;\n  margin: 0 0 0.9375rem;\n  letter-spacing: -.028em !important;\n  padding: 0;\n}\n\n.post-excerpt {\n  line-height: 1.3em;\n  font-size: 20px;\n  color: #7D7D7D;\n  margin-bottom: 8px;\n}\n\n.post-image {\n  margin-bottom: 1.45rem;\n  overflow: hidden;\n}\n\n.post-body {\n  margin-bottom: 2rem;\n}\n\n.post-body a:focus {\n  text-decoration: underline;\n}\n\n.post-body h2 {\n  font-weight: 500;\n  margin: 2.50rem 0 1.25rem;\n  padding-bottom: 3px;\n}\n\n.post-body h3,\n.post-body h4 {\n  margin: 32px 0 16px;\n}\n\n.post-body iframe {\n  display: block !important;\n  margin: 0 auto 1.5rem 0 !important;\n}\n\n.post-body img {\n  display: block;\n  margin-bottom: 1rem;\n}\n\n.post-body h2 a,\n.post-body h3 a,\n.post-body h4 a {\n  color: #4285f4;\n}\n\n.post-tags {\n  margin: 1.25rem 0;\n}\n\n.post-comments {\n  margin: 0 0 1.5rem;\n}\n\n/* Post author by line top (author - time - tag - sahre)\n========================================================================== */\n\n.post-byline {\n  color: #999;\n  font-size: 14px;\n  flex-grow: 1;\n  letter-spacing: -.028em !important;\n}\n\n.post-byline a {\n  color: inherit;\n}\n\n.post-byline a:active {\n  text-decoration: underline;\n}\n\n.post-byline a:hover {\n  color: #222;\n}\n\n.post-actions--top .share {\n  margin-right: 10px;\n  font-size: 20px;\n}\n\n.post-actions--top .share:hover {\n  opacity: .7;\n}\n\n.post-action-comments {\n  color: #999;\n  margin-right: 15px;\n  font-size: 14px;\n}\n\n/* Post Action social media\n========================================================================== */\n\n.post-actions {\n  position: relative;\n  margin-bottom: 1.5rem;\n}\n\n.post-actions a {\n  color: #fff;\n  font-size: 1.125rem;\n}\n\n.post-actions a:hover {\n  background-color: #000 !important;\n}\n\n.post-actions li {\n  margin-left: 6px;\n}\n\n.post-actions li:first-child {\n  margin-left: 0 !important;\n}\n\n.post-actions .btn,\n.post-actions .nav-mob-follow a,\n.nav-mob-follow .post-actions a {\n  border-radius: 0;\n}\n\n/* Post author widget bottom\n========================================================================== */\n\n.post-author {\n  position: relative;\n  font-size: 15px;\n  padding: 30px 0 30px 100px;\n  margin-bottom: 3rem;\n  background-color: #f3f5f6;\n}\n\n.post-author h5 {\n  color: #AAA;\n  font-size: 12px;\n  line-height: 1.5;\n  margin: 0;\n}\n\n.post-author li {\n  margin-left: 30px;\n  font-size: 14px;\n}\n\n.post-author li a {\n  color: #555;\n}\n\n.post-author li a:hover {\n  color: #000;\n}\n\n.post-author li:first-child {\n  margin-left: 0;\n}\n\n.post-author-bio {\n  max-width: 500px;\n}\n\n.post-author .post-author-avatar {\n  height: 64px;\n  width: 64px;\n  position: absolute;\n  left: 20px;\n  top: 30px;\n  background-position: center center;\n  background-size: cover;\n  border-radius: 50%;\n}\n\n/* prev-post and next-post\n========================================================================== */\n\n/* bottom share and bottom subscribe\n========================================================================== */\n\n.share-subscribe {\n  margin-bottom: 1rem;\n}\n\n.share-subscribe p {\n  color: #7d7d7d;\n  margin-bottom: 1rem;\n  line-height: 1;\n  font-size: 0.875rem;\n}\n\n.share-subscribe .social-share {\n  float: none !important;\n}\n\n.share-subscribe > div {\n  position: relative;\n  overflow: hidden;\n  margin-bottom: 15px;\n}\n\n.share-subscribe > div:before {\n  content: \" \";\n  border-top: solid 1px #000;\n  position: absolute;\n  top: 0;\n  left: 15px;\n  width: 40px;\n  height: 1px;\n}\n\n.share-subscribe > div h5 {\n  color: #666;\n  font-size: 0.875rem;\n  margin: 1rem 0;\n  line-height: 1;\n  text-transform: uppercase;\n}\n\n.share-subscribe .newsletter-form {\n  display: flex;\n}\n\n.share-subscribe .newsletter-form .form-group {\n  max-width: 250px;\n  width: 100%;\n}\n\n.share-subscribe .newsletter-form .btn,\n.share-subscribe .newsletter-form .nav-mob-follow a,\n.nav-mob-follow .share-subscribe .newsletter-form a {\n  border-radius: 0;\n}\n\n/* Related post\n========================================================================== */\n\n.post-related {\n  margin-bottom: 1.5rem;\n}\n\n.post-related-title {\n  font-size: 17px;\n  font-weight: 400;\n  height: auto;\n  line-height: 17px;\n  margin: 0 0 20px;\n  padding-bottom: 10px;\n  text-transform: uppercase;\n}\n\n.post-related-list {\n  margin-bottom: 18px;\n  padding: 0;\n  border: none;\n}\n\n.post-related .no-image {\n  position: relative;\n}\n\n.post-related .no-image .entry {\n  background-color: #4285f4;\n  display: flex;\n  align-items: center;\n  position: absolute;\n  bottom: 0;\n  top: 0;\n  left: 0.9375rem;\n  right: 0.9375rem;\n}\n\n.post-related .no-image .entry-title {\n  color: #fff;\n  padding: 0 10px;\n  text-align: center;\n  width: 100%;\n}\n\n.post-related .no-image .entry-title:hover {\n  color: rgba(255, 255, 255, 0.7);\n}\n\n/* Media Query (medium)\n========================================================================== */\n\n@media only screen and (min-width: 766px) {\n  .post .title {\n    font-size: 2.25rem;\n    margin: 0 0 1rem;\n  }\n\n  .post-body {\n    font-size: 1.125rem;\n    line-height: 32px;\n  }\n\n  .post-body p {\n    margin-bottom: 1.5rem;\n  }\n}\n\n@media only screen and (max-width: 640px) {\n  .post-title {\n    font-size: 1.8rem;\n  }\n\n  .post-image,\n  .video-responsive {\n    margin-left: -0.9375rem;\n    margin-right: -0.9375rem;\n  }\n}\n\n/* sidebar\n========================================================================== */\n\n.sidebar {\n  position: relative;\n  line-height: 1.6;\n}\n\n.sidebar h1,\n.sidebar h2,\n.sidebar h3,\n.sidebar h4,\n.sidebar h5,\n.sidebar h6 {\n  margin-top: 0;\n}\n\n.sidebar-items {\n  margin-bottom: 2.5rem;\n  position: relative;\n}\n\n.sidebar-title {\n  padding-bottom: 10px;\n  margin-bottom: 1rem;\n  text-transform: uppercase;\n  font-size: 1rem;\n  font-weight: 500;\n}\n\n.sidebar .title-primary {\n  background-color: #4285f4;\n  color: #FFFFFF;\n  padding: 10px 16px;\n  font-size: 18px;\n}\n\n.sidebar-post {\n  padding-bottom: 2px;\n}\n\n.sidebar-post--border {\n  align-items: center;\n  border-left: 3px solid #4285f4;\n  bottom: 0;\n  color: rgba(0, 0, 0, 0.2);\n  display: flex;\n  font-size: 28px;\n  font-weight: bold;\n  left: 0;\n  line-height: 1;\n  padding: 15px 10px 10px;\n  position: absolute;\n  top: 0;\n}\n\n.sidebar-post:nth-child(3n) .sidebar-post--border {\n  border-color: #f59e00;\n}\n\n.sidebar-post:nth-child(3n+2) .sidebar-post--border {\n  border-color: #00a034;\n}\n\n.sidebar-post--link {\n  background-color: white;\n  display: block;\n  min-height: 50px;\n  padding: 10px 15px 10px 55px;\n  position: relative;\n}\n\n.sidebar-post--link:hover .sidebar-post--border {\n  background-color: #e5eff5;\n}\n\n.sidebar-post--title {\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 18px;\n  font-weight: 400;\n  margin: 0;\n}\n\n.subscribe {\n  min-height: 90vh;\n  padding-top: 50px;\n}\n\n.subscribe h3 {\n  margin: 0;\n  margin-bottom: 8px;\n  font: 400 20px/32px \"Roboto\", sans-serif;\n}\n\n.subscribe-title {\n  font-weight: 400;\n  margin-top: 0;\n}\n\n.subscribe-wrap {\n  max-width: 700px;\n  color: #7d878a;\n  padding: 1rem 0;\n}\n\n.subscribe .form-group {\n  margin-bottom: 1.5rem;\n}\n\n.subscribe .form-group.error input {\n  border-color: #ff5b5b;\n}\n\n.subscribe .btn,\n.subscribe .nav-mob-follow a,\n.nav-mob-follow .subscribe a {\n  width: 100%;\n}\n\n.subscribe-form {\n  position: relative;\n  margin: 30px auto;\n  padding: 40px;\n  max-width: 400px;\n  width: 100%;\n  background: #ebeff2;\n  border-radius: 5px;\n  text-align: left;\n}\n\n.subscribe-input {\n  width: 100%;\n  padding: 10px;\n  border: #4285f4  1px solid;\n  border-radius: 2px;\n}\n\n.subscribe-input:focus {\n  outline: none;\n}\n\n.animated {\n  animation-duration: 1s;\n  animation-fill-mode: both;\n}\n\n.animated.infinite {\n  animation-iteration-count: infinite;\n}\n\n.bounceIn {\n  animation-name: bounceIn;\n}\n\n.bounceInDown {\n  animation-name: bounceInDown;\n}\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    transform: none;\n  }\n}\n\n@keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    transform: translateY(0px);\n  }\n\n  100% {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n}\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n","@font-face {\r\n  font-family: 'mapache';\r\n  src:\r\n    url('../fonts/mapache.ttf?8baq25') format('truetype'),\r\n    url('../fonts/mapache.woff?8baq25') format('woff'),\r\n    url('../fonts/mapache.svg?8baq25#mapache') format('svg');\r\n  font-weight: normal;\r\n  font-style: normal;\r\n}\r\n\r\n[class^=\"i-\"]:before, [class*=\" i-\"]:before {\r\n  /* use !important to prevent issues with browser extensions that change fonts */\r\n  font-family: 'mapache' !important;\r\n  speak: none;\r\n  font-style: normal;\r\n  font-weight: normal;\r\n  font-variant: normal;\r\n  text-transform: none;\r\n  line-height: inherit;\r\n\r\n  /* Better Font Rendering =========== */\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n\r\n.i-navigate_before:before {\r\n  content: \"\\e408\";\r\n}\r\n.i-navigate_next:before {\r\n  content: \"\\e409\";\r\n}\r\n.i-tag:before {\r\n  content: \"\\e54e\";\r\n}\r\n.i-keyboard_arrow_down:before {\r\n  content: \"\\e313\";\r\n}\r\n.i-arrow_upward:before {\r\n  content: \"\\e5d8\";\r\n}\r\n.i-cloud_download:before {\r\n  content: \"\\e2c0\";\r\n}\r\n.i-star:before {\r\n  content: \"\\e838\";\r\n}\r\n.i-keyboard_arrow_up:before {\r\n  content: \"\\e316\";\r\n}\r\n.i-open_in_new:before {\r\n  content: \"\\e89e\";\r\n}\r\n.i-warning:before {\r\n  content: \"\\e002\";\r\n}\r\n.i-back:before {\r\n  content: \"\\e5c4\";\r\n}\r\n.i-forward:before {\r\n  content: \"\\e5c8\";\r\n}\r\n.i-chat:before {\r\n  content: \"\\e0cb\";\r\n}\r\n.i-close:before {\r\n  content: \"\\e5cd\";\r\n}\r\n.i-code2:before {\r\n  content: \"\\e86f\";\r\n}\r\n.i-favorite:before {\r\n  content: \"\\e87d\";\r\n}\r\n.i-link:before {\r\n  content: \"\\e157\";\r\n}\r\n.i-menu:before {\r\n  content: \"\\e5d2\";\r\n}\r\n.i-feed:before {\r\n  content: \"\\e0e5\";\r\n}\r\n.i-search:before {\r\n  content: \"\\e8b6\";\r\n}\r\n.i-share:before {\r\n  content: \"\\e80d\";\r\n}\r\n.i-check_circle:before {\r\n  content: \"\\e86c\";\r\n}\r\n.i-play:before {\r\n  content: \"\\e901\";\r\n}\r\n.i-download:before {\r\n  content: \"\\e900\";\r\n}\r\n.i-code:before {\r\n  content: \"\\f121\";\r\n}\r\n.i-behance:before {\r\n  content: \"\\f1b4\";\r\n}\r\n.i-spotify:before {\r\n  content: \"\\f1bc\";\r\n}\r\n.i-codepen:before {\r\n  content: \"\\f1cb\";\r\n}\r\n.i-github:before {\r\n  content: \"\\f09b\";\r\n}\r\n.i-linkedin:before {\r\n  content: \"\\f0e1\";\r\n}\r\n.i-flickr:before {\r\n  content: \"\\f16e\";\r\n}\r\n.i-dribbble:before {\r\n  content: \"\\f17d\";\r\n}\r\n.i-pinterest:before {\r\n  content: \"\\f231\";\r\n}\r\n.i-map:before {\r\n  content: \"\\f041\";\r\n}\r\n.i-twitter:before {\r\n  content: \"\\f099\";\r\n}\r\n.i-facebook:before {\r\n  content: \"\\f09a\";\r\n}\r\n.i-youtube:before {\r\n  content: \"\\f16a\";\r\n}\r\n.i-instagram:before {\r\n  content: \"\\f16d\";\r\n}\r\n.i-google:before {\r\n  content: \"\\f1a0\";\r\n}\r\n.i-pocket:before {\r\n  content: \"\\f265\";\r\n}\r\n.i-reddit:before {\r\n  content: \"\\f281\";\r\n}\r\n.i-snapchat:before {\r\n  content: \"\\f2ac\";\r\n}\r\n\r\n","/*\r\n@package godofredoninja\r\n\r\n========================================================================\r\nMapache variables styles\r\n========================================================================\r\n*/\r\n\r\n/**\r\n* Table of Contents:\r\n*\r\n*   1. Colors\r\n*   2. Fonts\r\n*   3. Typography\r\n*   4. Header\r\n*   5. Footer\r\n*   6. Code Syntax\r\n*   7. buttons\r\n*   8. container\r\n*   9. Grid\r\n*   10. Media Query Ranges\r\n*   11. Icons\r\n*/\r\n\r\n\r\n/* 1. Colors\r\n========================================================================== */\r\n$primary-color        : #4285f4;\r\n// $primary-color        : #2856b6;\r\n\r\n$primary-text-color:  #333;\r\n$secondary-text-color:  #999;\r\n$accent-color:      #eee;\r\n\r\n$divider-color:     #DDDDDD;\r\n\r\n// $link-color     : #4184F3;\r\n$link-color     : #039be5;\r\n// $color-bg-page  : #EEEEEE;\r\n\r\n\r\n// social colors\r\n$social-colors: (\r\n  facebook    : #3b5998,\r\n  twitter     : #55acee,\r\n  google    : #dd4b39,\r\n  instagram   : #306088,\r\n  youtube     : #e52d27,\r\n  github      : #333333,\r\n  linkedin    : #007bb6,\r\n  spotify     : #2ebd59,\r\n  codepen     : #222222,\r\n  behance     : #131418,\r\n  dribbble    : #ea4c89,\r\n  flickr       : #0063DC,\r\n  reddit    : orangered,\r\n  pocket    : #F50057,\r\n  pinterest   : #bd081c,\r\n  feed    : orange,\r\n);\r\n\r\n\r\n\r\n/* 2. Fonts\r\n========================================================================== */\r\n$primary-font:    'Roboto', sans-serif; // font default page\r\n$code-font:     'Roboto Mono', monospace; // font for code and pre\r\n\r\n\r\n/* 3. Typography\r\n========================================================================== */\r\n\r\n$spacer:                   1rem;\r\n$line-height:              1.5;\r\n\r\n$font-size-root:           16px;\r\n\r\n$font-size-base:           1rem;\r\n$font-size-lg:             1.25rem; // 20px\r\n$font-size-sm:             .875rem; //14px\r\n$font-size-xs:             .0.8125; //13px\r\n\r\n$font-size-h1:             2.25rem;\r\n$font-size-h2:             1.875rem;\r\n$font-size-h3:             1.5625rem;\r\n$font-size-h4:             1.375rem;\r\n$font-size-h5:             1.125rem;\r\n$font-size-h6:             1rem;\r\n\r\n\r\n$headings-margin-bottom:   ($spacer / 2);\r\n$headings-font-family:     $primary-font;\r\n$headings-font-weight:     500;\r\n$headings-line-height:     1.1;\r\n$headings-color:           inherit;\r\n\r\n$font-weight:       500;\r\n\r\n$blockquote-font-size:     1.125rem;\r\n\r\n\r\n/* 4. Header\r\n========================================================================== */\r\n$header-bg: $primary-color;\r\n$header-color: #fff;\r\n$header-height: 50px;\r\n$header-search-bg: #eee;\r\n$header-search-color: #757575;\r\n\r\n\r\n/* 5. Entry articles\r\n========================================================================== */\r\n$entry-color-title: #222;\r\n$entry-color-title-hover: #777;\r\n$entry-font-size: 1.75rem; // 28px\r\n$entry-font-size-mb: 1.25rem; // 20px\r\n$entry-font-size-byline: 0.8125rem; // 13px\r\n$entry-color-byline: #999;\r\n\r\n/* 5. Footer\r\n========================================================================== */\r\n// $footer-bg-color:   #000;\r\n$footer-color-link: rgba(0, 0, 0, .6);\r\n$footer-color:      rgba(0, 0, 0, .44);\r\n\r\n\r\n/* 6. Code Syntax\r\n========================================================================== */\r\n$code-bg-color:       #f7f7f7;\r\n$font-size-code:      0.9375rem;\r\n$code-color:        #c7254e;\r\n$pre-code-color:        #37474f;\r\n\r\n\r\n/* 7. buttons\r\n========================================================================== */\r\n$btn-primary-color:       $primary-color;\r\n$btn-secondary-color:     #039be5;\r\n$btn-background-color:    #e1f3fc;\r\n$btn-active-background:   #c3e7f9;\r\n\r\n/* 8. container\r\n========================================================================== */\r\n\r\n$grid-gutter-width:        1.875rem; // 30px\r\n\r\n$container-sm:             576px;\r\n$container-md:             750px;\r\n$container-lg:             970px;\r\n$container-xl:             1200px;\r\n\r\n\r\n/* 9. Grid\r\n========================================================================== */\r\n$num-cols: 12;\r\n$gutter-width: 1.875rem;\r\n$element-top-margin: $gutter-width/3;\r\n$element-bottom-margin: ($gutter-width*2)/3;\r\n\r\n\r\n/* 10. Media Query Ranges\r\n========================================================================== */\r\n$sm:            640px;\r\n$md:            766px;\r\n$lg:            992px;\r\n$xl:            1230px;\r\n\r\n$sm-and-up:     \"only screen and (min-width : #{$sm})\";\r\n$md-and-up:     \"only screen and (min-width : #{$md})\";\r\n$lg-and-up:     \"only screen and (min-width : #{$lg})\";\r\n$xl-and-up:     \"only screen and (min-width : #{$xl})\";\r\n\r\n$sm-and-down:   \"only screen and (max-width : #{$sm})\";\r\n$md-and-down:   \"only screen and (max-width : #{$md})\";\r\n$lg-and-down:   \"only screen and (max-width : #{$lg})\";\r\n\r\n\r\n/* 11. icons\r\n========================================================================== */\r\n$i-open_in_new:      '\\e89e';\r\n$i-warning:          '\\e002';\r\n$i-star:             '\\e838';\r\n$i-download:         '\\e900';\r\n$i-cloud_download:   '\\e2c0';\r\n$i-check_circle:     '\\e86c';\r\n$i-play:       \"\\e901\";\r\n$i-code:       \"\\f121\";\r\n$i-close:      \"\\e5cd\";\r\n","/* Header Page\r\n========================================================================== */\r\n.header{\r\n  background: $primary-color;\r\n  // color: $header-color;\r\n  height: $header-height;\r\n  left: 0;\r\n  padding-left: 1rem;\r\n  padding-right: 1rem;\r\n  position: fixed;\r\n  right: 0;\r\n  top: 0;\r\n  z-index: 999;\r\n\r\n  &-wrap a{ color: $header-color;}\r\n\r\n  &-logo,\r\n  &-follow a,\r\n  &-menu a{\r\n    height: $header-height;\r\n    @extend .u-flex-center;\r\n  }\r\n\r\n  &-follow,\r\n  &-search,\r\n  &-logo{\r\n    flex: 0 0 auto;\r\n  }\r\n\r\n  // Logo\r\n  &-logo{\r\n    z-index: 998;\r\n    font-size: $font-size-lg;\r\n    font-weight: 500;\r\n    letter-spacing: 1px;\r\n    img{\r\n      max-height: 35px;\r\n      position: relative;\r\n    }\r\n  }\r\n\r\n  .nav-mob-toggle,\r\n  .search-mob-toggle{\r\n    padding: 0;\r\n    z-index: 998;\r\n  }\r\n\r\n  // btn mobile menu open and close\r\n  .nav-mob-toggle{\r\n    margin-left: 0 !important;\r\n    margin-right: - ($grid-gutter-width / 2);\r\n    position: relative;\r\n    transition: transform .4s;\r\n\r\n    span {\r\n       background-color: $header-color;\r\n       display: block;\r\n       height: 2px;\r\n       left: 14px;\r\n       margin-top: -1px;\r\n       position: absolute;\r\n       top: 50%;\r\n       transition: .4s;\r\n       width: 20px;\r\n       &:first-child { transform: translate(0,-6px); }\r\n       &:last-child { transform: translate(0,6px); }\r\n    }\r\n\r\n  }\r\n\r\n  // Shodow for header\r\n  &.toolbar-shadow{ @extend %primary-box-shadow; }\r\n  &:not(.toolbar-shadow) { background-color: transparent!important; }\r\n\r\n}\r\n\r\n\r\n/* Header Navigation\r\n========================================================================== */\r\n.header-menu{\r\n  flex: 1 1 0;\r\n  overflow: hidden;\r\n  transition: flex .2s,margin .2s,width .2s;\r\n\r\n  ul{\r\n    margin-left: 2rem;\r\n    white-space: nowrap;\r\n\r\n    li{ padding-right: 15px; display: inline-block;}\r\n\r\n    a{\r\n      padding: 0 8px;\r\n      position: relative;\r\n\r\n      &:before{\r\n        background: $header-color;\r\n        bottom: 0;\r\n        content: '';\r\n        height: 2px;\r\n        left: 0;\r\n        opacity: 0;\r\n        position: absolute;\r\n        transition: opacity .2s;\r\n        width: 100%;\r\n      }\r\n      &:hover:before,\r\n      &.active:before{\r\n        opacity: 1;\r\n      }\r\n    }\r\n\r\n  }\r\n}\r\n\r\n\r\n/* header social\r\n========================================================================== */\r\n.header-follow a {\r\n  padding: 0 10px;\r\n  &:hover{color: rgba(255, 255, 255, 0.80)}\r\n  &:before{font-size: $font-size-lg !important;}\r\n\r\n}\r\n\r\n\r\n\r\n/* Header search\r\n========================================================================== */\r\n.header-search{\r\n  background: #eee;\r\n  border-radius: 2px;\r\n  display: none;\r\n  // flex: 0 0 auto;\r\n  height: 36px;\r\n  position: relative;\r\n  text-align: left;\r\n  transition: background .2s,flex .2s;\r\n  vertical-align: top;\r\n  margin-left: 1.5rem;\r\n  margin-right: 1.5rem;\r\n\r\n  .search-icon{\r\n    color: #757575;\r\n    font-size: 24px;\r\n    left: 24px;\r\n    position: absolute;\r\n    top: 12px;\r\n    transition: color .2s;\r\n  }\r\n}\r\n\r\ninput.search-field {\r\n  background: 0;\r\n  border: 0;\r\n  color: #212121;\r\n  height: 36px;\r\n  padding: 0 8px 0 72px;\r\n  transition: color .2s;\r\n  width: 100%;\r\n  &:focus{\r\n    border: 0;\r\n    outline: none;\r\n  }\r\n}\r\n\r\n.search-popout{\r\n  background: $header-color;\r\n  box-shadow: 0 0 2px rgba(0,0,0,.12),0 2px 4px rgba(0,0,0,.24),inset 0 4px 6px -4px rgba(0,0,0,.24);\r\n  margin-top: 10px;\r\n  max-height: calc(100vh - 150px);\r\n  // width: calc(100% + 120px);\r\n  margin-left: -64px;\r\n  overflow-y: auto;\r\n  position: absolute;\r\n  // transition: transform .2s,visibility .2s;\r\n  // transform: translateY(0);\r\n\r\n  z-index: -1;\r\n\r\n  &.closed{\r\n    // transform: translateY(-110%);\r\n    visibility: hidden;\r\n  }\r\n}\r\n\r\n.search-suggest-results{\r\n  padding: 0 8px 0 75px;\r\n\r\n  a{\r\n    color: #212121;\r\n    display: block;\r\n    margin-left: -8px;\r\n    outline: 0;\r\n    height: auto;\r\n    padding: 8px;\r\n    transition: background .2s;\r\n    font-size: $font-size-sm;\r\n    &:first-child{\r\n      margin-top: 10px;\r\n    }\r\n    &:last-child{\r\n      margin-bottom: 10px;\r\n    }\r\n    &:hover{\r\n      background: #f7f7f7;\r\n    }\r\n  }\r\n}\r\n\r\n\r\n\r\n\r\n/* mediaquery medium\r\n========================================================================== */\r\n\r\n@media #{$lg-and-up}{\r\n  .header-search{\r\n    background: rgba(255,255,255,.25);\r\n    box-shadow: 0 1px 1.5px rgba(0,0,0,0.06),0 1px 1px rgba(0,0,0,0.12);\r\n    color: $header-color;\r\n    display: inline-block;\r\n    width: 200px;\r\n\r\n    &:hover{\r\n      background: rgba(255,255,255,.4);\r\n    }\r\n\r\n    .search-icon{top: 0px;}\r\n\r\n    input, input::placeholder, .search-icon{color: #fff;}\r\n\r\n  }\r\n\r\n  .search-popout{\r\n    width: 100%;\r\n    margin-left: 0;\r\n  }\r\n\r\n  // Show large search and visibility hidden header menu\r\n  .header.is-showSearch{\r\n    .header-search{\r\n      background: #fff;\r\n      flex: 1 0 auto;\r\n\r\n      .search-icon{color: #757575 !important;}\r\n      input, input::placeholder {color: #212121 !important}\r\n    }\r\n    .header-menu{\r\n      flex: 0 0 auto;\r\n      margin: 0;\r\n      visibility: hidden;\r\n      width: 0;\r\n    }\r\n  }\r\n}\r\n\r\n\r\n/* Media Query\r\n========================================================================== */\r\n\r\n@media #{$lg-and-down}{\r\n\r\n  .header-menu ul{ display: none; }\r\n\r\n  // show search mobile\r\n  .header.is-showSearchMob{\r\n    padding: 0;\r\n\r\n    .header-logo,\r\n    .nav-mob-toggle{\r\n      display: none;\r\n    }\r\n\r\n    .header-search{\r\n      border-radius: 0;\r\n      display: inline-block !important;\r\n      height: $header-height;\r\n      margin: 0;\r\n      width: 100%;\r\n\r\n      input{\r\n        height: $header-height;\r\n        padding-right: 48px;\r\n      }\r\n\r\n      .search-popout{margin-top: 0;}\r\n    }\r\n\r\n    .search-mob-toggle{\r\n      border: 0;\r\n      color: $header-search-color;\r\n      position: absolute;\r\n      right: 0;\r\n      &:before{content: $i-close !important;}\r\n    }\r\n\r\n  }\r\n\r\n  // show menu mobile\r\n  body.is-showNavMob{\r\n    overflow: hidden;\r\n\r\n    .nav-mob{\r\n      transform: translateX(0);\r\n    }\r\n    .nav-mob-toggle {\r\n      border: 0;\r\n      transform: rotate(90deg);\r\n      span:first-child { transform: rotate(45deg) translate(0,0);}\r\n      span:nth-child(2) { transform: scaleX(0);}\r\n      span:last-child {transform: rotate(-45deg) translate(0,0);}\r\n    }\r\n    .search-mob-toggle{\r\n      display: none;\r\n    }\r\n\r\n    .main,.footer{\r\n      transform: translateX(-25%);\r\n    }\r\n  }\r\n\r\n}\r\n","// box-shadow\r\n%primary-box-shadow {\r\n  box-shadow: 0 0 4px rgba(0,0,0,.14),0 4px 8px rgba(0,0,0,.28);\r\n}\r\n\r\n%font-icons{\r\n  font-family: 'mapache' !important;\r\n  speak: none;\r\n  font-style: normal;\r\n  font-weight: normal;\r\n  font-variant: normal;\r\n  text-transform: none;\r\n  line-height: 1;\r\n\r\n  /* Better Font Rendering =========== */\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n\r\n//  Clear both\r\n.u-clear{\r\n  &:after {\r\n    clear: both;\r\n    content: \"\";\r\n    display: table;\r\n  }\r\n}\r\n\r\n.u-not-avatar {background-image: url('../images/avatar.png')}\r\n\r\n// border-\r\n.u-b-b{ border-bottom: solid 1px #eee;}\r\n.u-b-t{ border-top: solid 1px #eee;}\r\n\r\n// Padding\r\n.u-p-t-2{\r\n  padding-top: 2rem;\r\n}\r\n\r\n// Eliminar la lista de la <ul>\r\n.u-unstyled{\r\n  list-style-type: none;\r\n  margin: 0;\r\n  padding-left: 0;\r\n}\r\n\r\n.u-floatLeft {  float: left!important; }\r\n.u-floatRight { float: right!important; }\r\n\r\n//  flex box\r\n.u-flex{ display: flex; flex-direction: row; }\r\n.u-flex-wrap {display: flex; flex-wrap: wrap; }\r\n.u-flex-center{ display: flex; align-items: center;}\r\n.u-flex-aling-right { display: flex; align-items: center; justify-content: flex-end;}\r\n.u-flex-aling-center { display: flex; align-items: center; justify-content: center;flex-direction: column;}\r\n\r\n// margin\r\n.u-m-t-1{\r\n  margin-top: 1rem;\r\n}\r\n\r\n/* Tags\r\n========================================================================== */\r\n.u-tags{\r\n  font-size: 12px !important;\r\n  margin: 3px !important;\r\n  color: #4c5765 !important;\r\n  background-color:#ebebeb !important;\r\n  transition: all .3s;\r\n  &:before{\r\n    padding-right: 5px;\r\n    opacity: .8;\r\n  }\r\n  &:hover{\r\n    background-color: $primary-color !important;\r\n    color: #fff !important;\r\n  }\r\n}\r\n\r\n// hide global\r\n.u-hide{display: none !important}\r\n// hide before\r\n@media #{$md-and-down}{ .u-h-b-md{ display: none !important } }\r\n@media #{$lg-and-down}{ .u-h-b-lg{ display: none !important } }\r\n\r\n// hide after\r\n@media #{$md-and-up}{ .u-h-a-md{ display: none !important } }\r\n@media #{$lg-and-up}{ .u-h-a-lg{ display: none !important } }\r\n","html {\n  box-sizing: border-box;\n  // Sets a specific default `font-size` for user with `rem` type scales.\n  font-size: $font-size-root;\n  // Changes the default tap highlight to be completely transparent in iOS.\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\na {\n  color: $link-color;\n  outline: 0;\n  text-decoration: none;\n  // Gets rid of tap active state\n  -webkit-tap-highlight-color: transparent;\n\n  &:focus {\n    text-decoration: none;\n    // background-color: transparent;\n  }\n\n  &.external {\n    &::after {\n      @extend %font-icons;\n      content: $i-open_in_new;\n      margin-left: 5px;\n    }\n  }\n}\n\nbody {\n  // Make the `body` use the `font-size-root`\n  color: $primary-text-color;\n  font-family: $primary-font;\n  font-size: $font-size-base;\n  line-height: $line-height;\n  margin: 0 auto;\n}\n\nfigure { margin: 0; }\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n\n  &:not([src]) {\n    visibility: hidden;\n  }\n}\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n\ni {\n  display: inline-block;\n  vertical-align: middle;\n}\n\nhr {\n  background: #F1F2F1;\n  background: linear-gradient(to right,#F1F2F1 0,#b5b5b5 50%,#F1F2F1 100%);\n  border: none;\n  height: 1px;\n  margin: 80px auto;\n  max-width: 90%;\n  position: relative;\n\n  &::before {\n    background: #fff;\n    color: rgba(73,55,65,.75);\n    content: $i-code;\n    display: block;\n    font-size: 35px;\n    left: 50%;\n    padding: 0 25px;\n    position: absolute;\n    top: 50%;\n    transform: translate(-50%,-50%);\n    @extend %font-icons;\n  }\n}\n\nblockquote {\n  border-left: 4px solid $primary-color;\n  padding: .75rem 1.5rem;\n  background: #fbfbfc;\n  color: #757575;\n  font-size: $blockquote-font-size;\n  line-height: 1.7;\n  margin: 0 0 1.25rem;\n  quotes: none;\n}\n\nol,ul,blockquote {\n  margin-left: 2rem;\n}\n\nstrong {\n  font-weight: 500;\n}\n\nsmall, .small {\n  font-size: 85%;\n}\n\nol {\n  padding-left: 40px;\n  list-style: decimal outside;\n}\n\nmark {\n  background-image: linear-gradient(to bottom, lighten($primary-color, 35%), lighten($primary-color, 30%));\n  background-color: transparent;\n}\n\n.footer,\n.main {\n  transition: transform .5s ease;\n  z-index: 2;\n}\n\n// .mapache-facebook { display: none !important; }\n\n/* Code Syntax\n========================================================================== */\nkbd,samp,code {\n  font-family: $code-font !important;\n  font-size: $font-size-code;\n  color: $code-color;\n  background: $code-bg-color;\n  border-radius: 4px;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\ncode[class*=language-],\npre[class*=language-] {\n  color: $pre-code-color;\n  line-height: 1.5;\n\n  .token.comment { opacity: .8; }\n\n  &.line-numbers {\n    padding-left: 58px;\n\n    &::before {\n      content: \"\";\n      position: absolute;\n      left: 0;\n      top: 0;\n      background: #F0EDEE;\n      width: 40px;\n      height: 100%;\n    }\n  }\n\n  .line-numbers-rows {\n    border-right: none;\n    top: -3px;\n    left: -58px;\n\n    & > span::before {\n      padding-right: 0;\n      text-align: center;\n      opacity: .8;\n    }\n  }\n}\n\npre {\n  background-color: $code-bg-color!important;\n  padding: 1rem;\n  overflow: hidden;\n  border-radius: 4px;\n  word-wrap: normal;\n  margin: 2.5rem 0!important;\n  font-family: $code-font !important;\n  font-size: $font-size-code;\n  position: relative;\n\n  code {\n    color: $pre-code-color;\n    text-shadow: 0 1px #fff;\n    padding: 0;\n    background: transparent;\n  }\n}\n\n/* .warning & .note & .success\n========================================================================== */\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n  &:before{content: $i-warning;}\n}\n\n.note{\n  background: #e1f5fe;\n  color: #0288d1;\n  &:before{content: $i-star;}\n}\n\n.success{\n  background: #e0f2f1;\n  color: #00897b;\n  &:before{content: $i-check_circle;color: #00bfa5;}\n}\n\n.warning, .note, .success{\n  display: block;\n  margin: 1rem 0;\n  font-size: 1rem;\n  padding: 12px 24px 12px 60px;\n  line-height: 1.5;\n  a{\n    text-decoration: underline;\n    color: inherit;\n  }\n  &:before{\n    margin-left: -36px;\n    float: left;\n    font-size: 24px;\n    @extend %font-icons;\n  }\n}\n\n\n/* Social icon color and background\n========================================================================== */\n@each $social-name, $color in $social-colors {\n  .c-#{$social-name}{\n    color: $color;\n  }\n  .bg-#{$social-name}{\n    background-color: $color !important;\n  }\n}\n\n//  Clear both\n.clear{\n  &:after {\n    content: \"\";\n    display: table;\n    clear: both;\n  }\n}\n\n/* pagination Infinite scroll\n========================================================================== */\n.mapache-load-more{\n  border: solid 1px #C3C3C3;\n  color: #7D7D7D;\n  display: block;\n  font-size: 15px;\n  height: 45px;\n  margin: 4rem auto;\n  padding: 11px 16px;\n  position: relative;\n  text-align: center;\n  width: 100%;\n\n  &:hover{\n    background: $primary-color;\n    border-color: $primary-color;\n    color: #fff;\n  }\n}\n\n// .pagination nav\n.pagination-nav{\n  padding: 2.5rem 0 3rem;\n  text-align: center;\n  .page-number{\n    display: none;\n    padding-top: 5px;\n    @media #{$md-and-up}{display: inline-block;}\n  }\n  .newer-posts{\n    float: left;\n  }\n  .older-posts{\n    float: right\n  }\n}\n\n/* Scroll Top\n========================================================================== */\n.scroll_top{\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  z-index: 11;\n  width: 60px;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity 0.5s ease;\n\n  &.visible{\n    opacity: 1;\n    visibility: visible;\n  }\n\n  &:hover svg path {\n    fill: rgba(0,0,0,.6);\n  }\n}\n\n// svg all icons\n.svg-icon svg {\n  width: 100%;\n  height: auto;\n  display: block;\n  fill: currentcolor;\n}\n\n/* Video Responsive\n========================================================================== */\n.video-responsive{\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n  padding-bottom: 56.25%;\n  margin-bottom: 1.5rem;\n  iframe{\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    height: 100%;\n    width: 100%;\n    border: 0;\n  }\n}\n\n/* Video full for tag video\n========================================================================== */\n#video-format{\n  .video-content{\n    display: flex;\n    padding-bottom: 1rem;\n    span{\n      display: inline-block;\n      vertical-align: middle;\n      margin-right: .8rem;\n    }\n  }\n}\n\n/* Page error 404\n========================================================================== */\n.errorPage{\n  font-family: 'Roboto Mono', monospace;\n  height: 100vh;\n  position: relative;\n  width: 100%;\n\n  &-title{\n    padding: 24px 60px;\n  }\n\n  &-link{\n    color: rgba(0,0,0,0.54);\n    font-size: 22px;\n    font-weight: 500;\n    left: -5px;\n    position: relative;\n    text-rendering: optimizeLegibility;\n    top: -6px;\n  }\n\n  &-emoji{\n    color: rgba(0,0,0,0.4);\n    font-size: 150px;\n  }\n\n  &-text{\n    color: rgba(0,0,0,0.4);\n    line-height: 21px;\n    margin-top: 60px;\n    white-space: pre-wrap;\n  }\n\n  &-wrap{\n    display: block;\n    left: 50%;\n    min-width: 680px;\n    position: absolute;\n    text-align: center;\n    top: 50%;\n    transform: translate(-50%,-50%);\n  }\n}\n\n/* Post Twitter facebook card embed Css Center\n========================================================================== */\niframe[src*=\"facebook.com\"],\n.fb-post,\n.twitter-tweet {\n  display: block !important;\n  margin: 1.5rem 0 !important;\n}\n",".container{\r\n  margin: 0 auto;\r\n  padding-left:  ($grid-gutter-width / 2);\r\n  padding-right: ($grid-gutter-width / 2);\r\n  width: 100%;\r\n\r\n  // @media #{$sm-and-up}{max-width: $container-sm;}\r\n  // @media #{$md-and-up}{max-width: $container-md;}\r\n  // @media #{$lg-and-up}{max-width: $container-lg;}\r\n  @media #{$xl-and-up}{max-width: $container-xl;}\r\n}\r\n\r\n.margin-top{\r\n  margin-top: $header-height;\r\n  padding-top: 1rem;\r\n  @media #{$md-and-up}{padding-top: 1.8rem;}\r\n}\r\n\r\n@media #{$md-and-up} {\r\n  .content{\r\n    flex: 1 !important;\r\n    max-width: calc(100% - 300px) !important;\r\n    order: 1;\r\n    overflow: hidden;\r\n  }\r\n  .sidebar{\r\n    flex: 0 0 330px !important;\r\n    order: 2;\r\n  }\r\n}\r\n\r\n@media #{$lg-and-up} {\r\n  .feed-entry-wrapper{\r\n    .entry-image{\r\n      width: 46.5% !important;\r\n      max-width: 46.5% !important;\r\n    }\r\n    .entry-body{\r\n      width: 53.5% !important;\r\n      max-width: 53.5% !important;\r\n    }\r\n\r\n  }\r\n}\r\n\r\n@media #{$lg-and-down} {\r\n  body.is-article .content {\r\n    max-width: 100% !important;\r\n  }\r\n}\r\n\r\n\r\n.row {\r\n  display: flex;\r\n  flex: 0 1 auto;\r\n  flex-flow: row wrap;\r\n  // margin: -8px;\r\n\r\n  margin-left: - $gutter-width / 2;\r\n  margin-right: - $gutter-width / 2;\r\n\r\n  // // Clear floating children\r\n  // &:after {\r\n  //  content: \"\";\r\n  //  display: table;\r\n  //  clear: both;\r\n  // }\r\n\r\n  .col {\r\n    // float: left;\r\n    // box-sizing: border-box;\r\n    flex: 0 0 auto;\r\n    padding-left: $gutter-width / 2;\r\n    padding-right: $gutter-width / 2;\r\n\r\n    $i: 1;\r\n    @while $i <= $num-cols {\r\n      $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n      &.s#{$i} {\r\n        // width: $perc;\r\n        flex-basis: $perc;\r\n        max-width: $perc;\r\n      }\r\n      $i: $i + 1;\r\n    }\r\n\r\n    @media #{$md-and-up} {\r\n\r\n      $i: 1;\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n        &.m#{$i} {\r\n          // width: $perc;\r\n          flex-basis: $perc;\r\n          max-width: $perc;\r\n        }\r\n        $i: $i + 1\r\n      }\r\n    }\r\n\r\n    @media #{$lg-and-up} {\r\n\r\n      $i: 1;\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n        &.l#{$i} {\r\n          // width: $perc;\r\n          flex-basis: $perc;\r\n          max-width: $perc;\r\n        }\r\n        $i: $i + 1;\r\n      }\r\n    }\r\n  }\r\n}\r\n","\r\n//\r\n// Headings\r\n//\r\n\r\nh1, h2, h3, h4, h5, h6,\r\n.h1, .h2, .h3, .h4, .h5, .h6 {\r\n  margin-bottom: $headings-margin-bottom;\r\n  font-family: $headings-font-family;\r\n  font-weight: $headings-font-weight;\r\n  line-height: $headings-line-height;\r\n  color: $headings-color;\r\n  letter-spacing: -.02em !important;\r\n}\r\n\r\nh1 { font-size: $font-size-h1; }\r\nh2 { font-size: $font-size-h2; }\r\nh3 { font-size: $font-size-h3; }\r\nh4 { font-size: $font-size-h4; }\r\nh5 { font-size: $font-size-h5; }\r\nh6 { font-size: $font-size-h6; }\r\n\r\n// These declarations are kept separate from and placed after\r\n// the previous tag-based declarations so that the classes beat the tags in\r\n// the CSS cascade, and thus <h1 class=\"h2\"> will be styled like an h2.\r\n.h1 { font-size: $font-size-h1; }\r\n.h2 { font-size: $font-size-h2; }\r\n.h3 { font-size: $font-size-h3; }\r\n.h4 { font-size: $font-size-h4; }\r\n.h5 { font-size: $font-size-h5; }\r\n.h6 { font-size: $font-size-h6; }\r\n\r\nh1, h2, h3, h4, h5, h6 {\r\n  margin-bottom: 1rem;\r\n  a{\r\n    color: inherit;\r\n    line-height: inherit;\r\n  }\r\n}\r\n\r\np {\r\n  margin-top: 0;\r\n  margin-bottom: 1rem;\r\n}\r\n","/* Navigation Mobile\r\n========================================================================== */\r\n.nav-mob {\r\n  background: $primary-color;\r\n  color: #000;\r\n  height: 100vh;\r\n  left: 0;\r\n  padding: 0 20px;\r\n  position: fixed;\r\n  right: 0;\r\n  top: 0;\r\n  transform: translateX(100%);\r\n  transition: .4s;\r\n  will-change: transform;\r\n  z-index: 997;\r\n\r\n  a{\r\n    color: inherit;\r\n  }\r\n\r\n  ul {\r\n    a{\r\n      display: block;\r\n      font-weight: 500;\r\n      padding: 8px 0;\r\n      text-transform: uppercase;\r\n      font-size: 14px;\r\n    }\r\n  }\r\n\r\n\r\n  &-content{\r\n    background: #eee;\r\n    overflow: auto;\r\n    -webkit-overflow-scrolling: touch;\r\n    bottom: 0;\r\n    left: 0;\r\n    padding: 20px 0;\r\n    position: absolute;\r\n    right: 0;\r\n    top: $header-height;\r\n  }\r\n\r\n}\r\n\r\n.nav-mob ul,\r\n.nav-mob-subscribe,\r\n.nav-mob-follow{\r\n  border-bottom: solid 1px #DDD;\r\n  padding: 0 ($grid-gutter-width / 2)  20px ($grid-gutter-width / 2);\r\n  margin-bottom: 15px;\r\n}\r\n\r\n/* Navigation Mobile follow\r\n========================================================================== */\r\n.nav-mob-follow{\r\n  a{\r\n    font-size: 20px !important;\r\n    margin: 0 2px !important;\r\n    padding: 0;\r\n\r\n    @extend .btn;\r\n  }\r\n\r\n  @each $social-name, $color in $social-colors {\r\n    .i-#{$social-name}{\r\n      color: #fff;\r\n      @extend .bg-#{$social-name};\r\n    }\r\n  }\r\n}\r\n\r\n/* CopyRigh\r\n========================================================================== */\r\n.nav-mob-copyright{\r\n  color: #aaa;\r\n  font-size: 13px;\r\n  padding: 20px 15px 0;\r\n  text-align: center;\r\n  width: 100%;\r\n\r\n  a{color: $primary-color}\r\n}\r\n\r\n/* subscribe\r\n========================================================================== */\r\n.nav-mob-subscribe{\r\n  .btn{\r\n    border-radius: 0;\r\n    text-transform: none;\r\n    width: 80px;\r\n  }\r\n  .form-group {width: calc(100% - 80px)}\r\n  input{\r\n    border: 0;\r\n    box-shadow: none !important;\r\n  }\r\n}\r\n","// Header post\r\n.cover{\r\n  background: $primary-color;\r\n  box-shadow: 0 0 4px rgba(0,0,0,.14),0 4px 8px rgba(0,0,0,.28);\r\n  color: #fff;\r\n  letter-spacing: .2px;\r\n  min-height: 550px;\r\n  position: relative;\r\n  text-shadow: 0 0 10px rgba(0,0,0,.33);\r\n  z-index: 2;\r\n\r\n  &-wrap{\r\n    margin: 0 auto;\r\n    max-width: 700px;\r\n    padding: 16px;\r\n    position: relative;\r\n    text-align: center;\r\n    z-index: 99;\r\n  }\r\n\r\n  &-title{\r\n    font-size: 3rem;\r\n    margin: 0 0 30px 0;\r\n    line-height: 1.2;\r\n  }\r\n\r\n\r\n\r\n  //  cover mouse scroll\r\n  .mouse{\r\n    width: 25px;\r\n    position: absolute;\r\n    height: 36px;\r\n    border-radius: 15px;\r\n    border: 2px solid #888;\r\n    border: 2px solid rgba(255,255,255,0.27);\r\n    bottom: 40px;\r\n    right: 40px;\r\n    margin-left: -12px;\r\n    cursor: pointer;\r\n    transition: border-color 0.2s ease-in;\r\n    .scroll {\r\n      display: block;\r\n      margin: 6px auto;\r\n      width: 3px;\r\n      height: 6px;\r\n      border-radius: 4px;\r\n      background: rgba(255, 255, 255, 0.68);\r\n      animation-duration: 2s;\r\n      animation-name: scroll;\r\n      animation-iteration-count: infinite;\r\n    }\r\n  }\r\n\r\n  // cover background\r\n  &-background{\r\n    position: absolute;\r\n    overflow: hidden;\r\n    background-size: cover;\r\n    background-position: center;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n\r\n    &:before{\r\n      display: block;\r\n      content: ' ';\r\n      width: 100%;\r\n      height: 100%;\r\n      background-color: rgba(0, 0, 0, 0.6);\r\n      background: -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,0.1)), to(rgba(0,0,0,0.7)));\r\n    }\r\n  }\r\n\r\n}\r\n\r\n\r\n.author{\r\n  a{color: #FFF!important;}\r\n\r\n  &-header{\r\n    margin-top: 10%;\r\n  }\r\n  &-name-wrap{\r\n    display: inline-block;\r\n  }\r\n  &-title{\r\n    display: block;\r\n    text-transform: uppercase;\r\n  }\r\n  &-name{\r\n    margin: 5px 0;\r\n    font-size: 1.75rem;\r\n  }\r\n  &-bio{\r\n    margin: 1.5rem 0;\r\n    line-height: 1.8;\r\n    font-size: 18px;\r\n  }\r\n  &-avatar{\r\n    display: inline-block;\r\n    border-radius: 90px;\r\n    margin-right: 10px;\r\n    width: 80px;\r\n    height: 80px;\r\n    background-size: cover;\r\n    background-position: center;\r\n    vertical-align: bottom;\r\n  }\r\n\r\n  // Author meta (location - website - post total)\r\n  &-meta{\r\n    margin-bottom: 20px;\r\n    span{\r\n      display: inline-block;\r\n      font-size: 17px;\r\n      font-style: italic;\r\n      margin: 0 2rem 1rem 0;\r\n      opacity: 0.8;\r\n      word-wrap: break-word;\r\n    }\r\n  }\r\n\r\n  .author-link:hover{\r\n    opacity: 1;\r\n  }\r\n\r\n  //  author Follow\r\n  &-follow{\r\n    a{\r\n      border-radius: 3px;\r\n      box-shadow: inset 0 0 0 2px rgba(255,255,255,.5);\r\n      cursor: pointer;\r\n      display: inline-block;\r\n      height: 40px;\r\n      letter-spacing: 1px;\r\n      line-height: 40px;\r\n      margin: 0 10px;\r\n      padding: 0 16px;\r\n      text-shadow: none;\r\n      text-transform: uppercase;\r\n      &:hover{\r\n        box-shadow: inset 0 0 0 2px #fff;\r\n      }\r\n    }\r\n\r\n  }\r\n}\r\n\r\n\r\n@media #{$md-and-up}{\r\n  .cover{\r\n    &-description{\r\n      font-size: $font-size-lg;\r\n    }\r\n  }\r\n\r\n}\r\n\r\n\r\n@media #{$md-and-down} {\r\n  .cover{\r\n    padding-top: $header-height;\r\n    padding-bottom: 20px;\r\n\r\n    &-title{\r\n      font-size: 2rem;\r\n    }\r\n  }\r\n\r\n  .author-avatar{\r\n    display: block;\r\n    margin: 0 auto 10px auto;\r\n  }\r\n}\r\n",".feed-entry-content .feed-entry-wrapper:last-child{\r\n  .entry:last-child {\r\n    padding: 0;\r\n    border: none;\r\n  }\r\n}\r\n\r\n.entry{\r\n  margin-bottom: 1.5rem;\r\n  padding-bottom: 0;\r\n\r\n  &-image{\r\n    margin-bottom: 10px;\r\n    &--link {\r\n      display: block;\r\n      height: 180px;\r\n      line-height: 0;\r\n      margin: 0;\r\n      overflow: hidden;\r\n      position: relative;\r\n\r\n      &:hover .entry-image--bg{\r\n        transform: scale(1.03);\r\n        backface-visibility: hidden;\r\n      }\r\n    }\r\n    img{\r\n      display: block;\r\n      width: 100%;\r\n      max-width: 100%;\r\n      height: auto;\r\n      margin-left: auto;\r\n      margin-right: auto;\r\n    }\r\n    &--bg{\r\n      display: block;\r\n      width: 100%;\r\n      position: relative;\r\n      height: 100%;\r\n      background-position: center;\r\n      background-size: cover;\r\n      transition: transform 0.3s;\r\n    }\r\n  }\r\n\r\n  // video play for video post format\r\n  &-video-play{\r\n    border-radius: 50%;\r\n    border: 2px solid #fff;\r\n    color: #fff;\r\n    font-size: 3.5rem;\r\n    height: 65px;\r\n    left: 50%;\r\n    line-height: 65px;\r\n    position: absolute;\r\n    text-align: center;\r\n    top: 50%;\r\n    transform: translate(-50%, -50%);\r\n    width: 65px;\r\n    z-index: 10;\r\n    // &:before{line-height: inherit}\r\n  }\r\n\r\n  &-category{\r\n    margin-bottom: 5px;\r\n    text-transform: capitalize;\r\n    font-size: $font-size-sm;\r\n    line-height: 1;\r\n    a:active{\r\n      text-decoration: underline;\r\n    }\r\n  }\r\n\r\n  &-title{\r\n    color: $entry-color-title;\r\n    font-size: $entry-font-size-mb;\r\n    height: auto;\r\n    line-height: 1.2;\r\n    margin: 0 0 1rem;\r\n    padding: 0;\r\n    &:hover{\r\n      color: $entry-color-title-hover;\r\n    }\r\n  }\r\n\r\n  &-byline{\r\n    margin-top: 0;\r\n    margin-bottom: 1.125rem;\r\n    color: $entry-color-byline;\r\n    font-size: $entry-font-size-byline;\r\n\r\n    a {\r\n      color: inherit;\r\n      &:hover {\r\n        color: #333;\r\n      }\r\n    }\r\n  }\r\n\r\n}\r\n\r\n\r\n/* Entry small --small\r\n========================================================================== */\r\n.entry.entry--small{\r\n  margin-bottom: 18px;\r\n  padding-bottom: 0;\r\n\r\n  .entry-image{ margin-bottom: 10px;}\r\n  .entry-image--link{height: 174px;}\r\n  .entry-title{\r\n    font-size: 1rem;\r\n    line-height: 1.2;\r\n  }\r\n  .entry-byline{\r\n    margin: 0;\r\n  }\r\n}\r\n\r\n\r\n@media #{$lg-and-up}{\r\n\r\n  .entry{\r\n    margin-bottom: 2rem;\r\n    padding-bottom: 2rem;\r\n    &-title{\r\n      font-size: $entry-font-size;\r\n    }\r\n    &-image{\r\n      margin-bottom: 0;\r\n    }\r\n    &-image--link{\r\n      height: 180px;\r\n    }\r\n  }\r\n\r\n}\r\n\r\n@media #{$xl-and-up}{\r\n  .entry-image--link{height: 250px}\r\n}\r\n",".footer {\r\n  color: $footer-color;\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n  line-height : 1;\r\n  padding: 1.6rem 15px;\r\n  text-align: center;\r\n\r\n  a {\r\n    color: $footer-color-link;\r\n    &:hover { color: rgba(0, 0, 0, .8); }\r\n  }\r\n\r\n  &-wrap {\r\n    margin: 0 auto;\r\n    max-width: 1400px;\r\n  }\r\n\r\n  .heart {\r\n    animation: heartify .5s infinite alternate;\r\n    color: red;\r\n  }\r\n\r\n  &-copy,\r\n  &-design-author {\r\n    display: inline-block;\r\n    padding: .5rem 0;\r\n    vertical-align: middle;\r\n  }\r\n\r\n}\r\n\r\n\r\n\r\n\r\n@keyframes heartify {\r\n  0% {\r\n    transform: scale(.8);\r\n  }\r\n}\r\n",".btn{\r\n  background-color: #fff;\r\n  border-radius: 2px;\r\n  border: 0;\r\n  box-shadow: none;\r\n  color: $btn-secondary-color;\r\n  cursor: pointer;\r\n  display: inline-block;\r\n  font: 500 14px/20px $primary-font;\r\n  height: 36px;\r\n  margin: 0;\r\n  min-width: 36px;\r\n  outline: 0;\r\n  overflow: hidden;\r\n  padding: 8px;\r\n  text-align: center;\r\n  text-decoration: none;\r\n  text-overflow: ellipsis;\r\n  text-transform: uppercase;\r\n  transition: background-color .2s,box-shadow .2s;\r\n  vertical-align: middle;\r\n  white-space: nowrap;\r\n\r\n  + .btn{margin-left: 8px;}\r\n\r\n  &:focus,\r\n  &:hover{\r\n    background-color: $btn-background-color;\r\n    text-decoration: none !important;\r\n  }\r\n  &:active{\r\n    background-color: $btn-active-background;\r\n  }\r\n\r\n  &.btn-lg{\r\n    font-size: 1.5rem;\r\n    min-width: 48px;\r\n    height: 48px;\r\n    line-height: 48px;\r\n  }\r\n  &.btn-flat{\r\n    background: 0;\r\n    box-shadow: none;\r\n    &:focus,\r\n    &:hover,\r\n    &:active{\r\n      background: 0;\r\n      box-shadow: none;\r\n    }\r\n  }\r\n\r\n  &.btn-primary{\r\n    background-color: $btn-primary-color;\r\n    color: #fff;\r\n    &:hover{background-color: darken($btn-primary-color, 4%);}\r\n  }\r\n  &.btn-circle{\r\n    border-radius: 50%;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    padding: 0;\r\n    width: 40px;\r\n  }\r\n  &.btn-circle-small{\r\n    border-radius: 50%;\r\n    height: 32px;\r\n    line-height: 32px;\r\n    padding: 0;\r\n    width: 32px;\r\n    min-width: 32px;\r\n  }\r\n  &.btn-shadow{\r\n    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.12);\r\n    color: #333;\r\n    background-color: #eee;\r\n    &:hover{background-color: rgba(0,0,0,0.12);}\r\n  }\r\n\r\n  &.btn-download-cloud,\r\n  &.btn-download{\r\n    background-color: $btn-primary-color;\r\n    color: #fff;\r\n    &:hover{background-color: darken($btn-primary-color, 8%);}\r\n    &:after{\r\n      @extend %font-icons;\r\n      margin-left: 5px;\r\n      font-size: 1.1rem;\r\n      display: inline-block;\r\n      vertical-align: top;\r\n    }\r\n  }\r\n\r\n  &.btn-download:after{content: $i-download;}\r\n  &.btn-download-cloud:after{content: $i-cloud_download;}\r\n  &.external:after{font-size: 1rem;}\r\n}\r\n\r\n\r\n\r\n\r\n\r\n//  Input\r\n.input-group {\r\n  position: relative;\r\n  display: table;\r\n  border-collapse: separate;\r\n}\r\n\r\n\r\n\r\n\r\n.form-control {\r\n  width: 100%;\r\n  padding: 8px 12px;\r\n  font-size: 14px;\r\n  line-height: 1.42857;\r\n  color: #555;\r\n  background-color: #fff;\r\n  background-image: none;\r\n  border: 1px solid #ccc;\r\n  border-radius: 0px;\r\n  box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);\r\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\r\n  height: 36px;\r\n\r\n  &:focus {\r\n    border-color: $btn-primary-color;\r\n    outline: 0;\r\n    box-shadow: inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba($btn-primary-color,0.6);\r\n  }\r\n}\r\n\r\n\r\n.btn-subscribe-home{\r\n  background-color: transparent;\r\n  border-radius: 3px;\r\n  box-shadow: inset 0 0 0 2px hsla(0,0%,100%,.5);\r\n  color: #ffffff;\r\n  display: block;\r\n  font-size: 20px;\r\n  font-weight: 400;\r\n  line-height: 1.2;\r\n  margin-top: 50px;\r\n  max-width: 300px;\r\n  max-width: 300px;\r\n  padding: 15px 10px;\r\n  transition: all 0.3s;\r\n  width: 100%;\r\n\r\n  &:hover{\r\n    box-shadow: inset 0 0 0 2px #fff;\r\n  }\r\n}\r\n","/*  Post\n========================================================================== */\n.post-wrapper {\n  margin-top: $header-height;\n  padding-top: 1.8rem;\n}\n\n.post {\n\n  &-header {\n    margin-bottom: 1.2rem;\n  }\n\n  &-title {\n    color: #222;\n    font-size: 2.5rem;\n    height: auto;\n    line-height: 1.04;\n    margin: 0 0 0.9375rem;\n    letter-spacing: -.028em !important;\n    padding: 0;\n  }\n\n  &-excerpt {\n    line-height: 1.3em;\n    font-size: 20px;\n    color: #7D7D7D;\n    margin-bottom: 8px;\n  }\n\n  //  Image\n  &-image{\n    margin-bottom: 1.45rem;\n    overflow: hidden;\n  }\n\n  // post content\n  &-body{\n    margin-bottom: 2rem;\n\n    a:focus {text-decoration: underline;}\n\n    h2{\n      // border-bottom: 1px solid $divider-color;\n      font-weight: 500;\n      margin: 2.50rem 0 1.25rem;\n      padding-bottom: 3px;\n    }\n    h3,h4{\n      margin: 32px 0 16px;\n    }\n\n    iframe{\n      display: block !important;\n      margin: 0 auto 1.5rem 0 !important;\n    }\n\n    img{\n      display: block;\n      margin-bottom: 1rem;\n    }\n\n    h2 a, h3 a, h4 a {\n      color: $primary-color,\n    }\n  }\n\n  // tags\n  &-tags{\n    margin: 1.25rem 0;\n  }\n\n  // Post comments\n  &-comments{\n    margin: 0 0 1.5rem;\n  }\n\n}\n\n/* Post author by line top (author - time - tag - sahre)\n========================================================================== */\n.post-byline {\n  color: $secondary-text-color;\n  font-size: 14px;\n  flex-grow: 1;\n  letter-spacing: -.028em !important;\n\n  a {\n    color: inherit;\n    &:active { text-decoration: underline; }\n    &:hover { color: #222 }\n  }\n}\n\n// Post actions top\n.post-actions--top .share {\n  margin-right: 10px;\n  font-size: 20px;\n\n  &:hover { opacity: .7; }\n}\n\n.post-action-comments {\n  color: $secondary-text-color;\n  margin-right: 15px;\n  font-size: 14px;\n}\n\n/* Post Action social media\n========================================================================== */\n.post-actions {\n  position: relative;\n  margin-bottom: 1.5rem;\n\n  a {\n    color: #fff;\n    font-size: 1.125rem;\n    &:hover { background-color: #000 !important; }\n  }\n\n  li {\n    margin-left: 6px;\n    &:first-child { margin-left: 0 !important; }\n  }\n\n  .btn { border-radius: 0; }\n}\n\n/* Post author widget bottom\n========================================================================== */\n.post-author{\n  position: relative;\n  font-size: 15px;\n  padding: 30px 0 30px 100px;\n  margin-bottom: 3rem;\n  background-color: #f3f5f6;\n\n\n  h5{\n    color: #AAA;\n    font-size: 12px;\n    line-height: 1.5;\n    margin: 0;\n  }\n\n  li{\n    margin-left: 30px;\n    font-size: 14px;\n    a{color: #555;&:hover{color: #000;}}\n    &:first-child{margin-left: 0;}\n  }\n\n  &-bio{\n    max-width: 500px;\n  }\n\n  .post-author-avatar{\n    height: 64px;\n    width: 64px;\n    position: absolute;\n    left: 20px;\n    top: 30px;\n    background-position: center center;\n    background-size: cover;\n    border-radius: 50%;\n  }\n}\n\n\n\n/* prev-post and next-post\n========================================================================== */\n// .prev-post,\n// .next-post{\n//   background: none repeat scroll 0 0 #fff;\n//   border: 1px solid #e9e9ea;\n//   color: #23527c;\n//   display: block;\n//   font-size: 14px;\n//   height: 60px;\n//   line-height: 60px;\n//   overflow: hidden;\n//   position: fixed;\n//   text-overflow: ellipsis;\n//   text-transform: uppercase;\n//   top: calc(50% - 25px);\n//   transition: all 0.5s ease 0s;\n//   white-space: nowrap;\n//   width: 200px;\n//   z-index: 999;\n\n//   &:before{\n//     color: #c3c3c3;\n//     font-size: 36px;\n//     height: 60px;\n//     position: absolute;\n//     text-align: center;\n//     top: 0;\n//     width: 50px;\n//   }\n// }\n\n// .prev-post {\n//   left: -150px;\n//   padding-right: 50px;\n//   text-align: right;\n//   &:hover{ left:0; }\n//   &:before{ right: 0; }\n// }\n\n// .next-post {\n//   right: -150px;\n//   padding-left: 50px;\n//   &:hover{ right: 0; }\n//   &:before{ left: 0; }\n// }\n\n\n/* bottom share and bottom subscribe\n========================================================================== */\n.share-subscribe{\n  margin-bottom: 1rem;\n\n  p{\n    color: #7d7d7d;\n    margin-bottom: 1rem;\n    line-height: 1;\n    font-size: $font-size-sm;\n  }\n\n  .social-share{float: none !important;}\n\n  &>div{\n    position: relative;\n    overflow: hidden;\n    margin-bottom: 15px;\n    &:before{\n      content: \" \";\n      border-top: solid 1px #000;\n      position: absolute;\n      top: 0;\n      left: 15px;\n      width: 40px;\n      height: 1px;\n    }\n\n    h5{\n      color: #666;\n      font-size:  $font-size-sm;\n      margin: 1rem 0;\n      line-height: 1;\n      text-transform: uppercase;\n    }\n  }\n\n  //  subscribe\n  .newsletter-form{\n    display: flex;\n\n    .form-group{\n      max-width: 250px;\n      width: 100%;\n    }\n\n    .btn{\n      border-radius: 0;\n    }\n  }\n\n}\n\n\n/* Related post\n========================================================================== */\n.post-related{\n  margin-bottom: 1.5rem;\n\n  &-title{\n    font-size: 17px;\n    font-weight: 400;\n    height: auto;\n    line-height: 17px;\n    margin: 0 0 20px;\n    padding-bottom: 10px;\n    text-transform: uppercase;\n  }\n\n  &-list{\n    margin-bottom: 18px;\n    padding: 0;\n    border: none;\n  }\n\n  .no-image{\n    position: relative;\n\n    .entry{\n      background-color: $primary-color;\n      display: flex;\n      align-items: center;\n      position: absolute;\n      bottom: 0;\n      top: 0;\n      left: 0.9375rem;\n      right: 0.9375rem;\n    }\n\n    .entry-title{\n      color: #fff;\n      padding: 0 10px;\n      text-align: center;\n      width: 100%;\n      &:hover{\n        color: rgba(255, 255, 255, 0.70);\n      }\n    }\n  }\n\n}\n\n\n/* Media Query (medium)\n========================================================================== */\n\n@media #{$md-and-up}{\n  .post{\n    .title{\n      font-size: 2.25rem;\n      margin: 0 0 1rem;\n    }\n\n    &-body {\n      font-size: 1.125rem;\n      line-height: 32px;\n      p{\n        margin-bottom: 1.5rem;\n      }\n    }\n  }\n}\n\n\n@media #{$sm-and-down}{\n  .post-title{\n    font-size: 1.8rem;\n  }\n  .post-image,\n  .video-responsive{\n    margin-left:  - ($grid-gutter-width / 2);\n    margin-right: - ($grid-gutter-width / 2);\n  }\n}\n","/* sidebar\n========================================================================== */\n.sidebar{\n  position: relative;\n  line-height: 1.6;\n\n  h1,h2,h3,h4,h5,h6{margin-top: 0;}\n\n  &-items{\n    margin-bottom: 2.5rem;\n    position: relative;\n  }\n\n  &-title{\n    padding-bottom: 10px;\n    margin-bottom: 1rem;\n    text-transform: uppercase;\n    font-size: 1rem;\n    font-weight: $font-weight;\n    @extend .u-b-b;\n  }\n\n  .title-primary{\n    background-color: $primary-color;\n    color: #FFFFFF;\n    padding: 10px 16px;\n    font-size: 18px;\n  }\n\n}\n\n\n.sidebar-post {\n  padding-bottom: 2px;\n\n  &--border {\n    align-items: center;\n    border-left: 3px solid $primary-color;\n    bottom: 0;\n    color: rgba(0, 0, 0, .2);\n    display: flex;\n    font-size: 28px;\n    font-weight: bold;\n    left: 0;\n    line-height: 1;\n    padding: 15px 10px 10px;\n    position: absolute;\n    top: 0;\n  }\n\n  &:nth-child(3n) { .sidebar-post--border { border-color: darken(orange, 2%) } }\n  &:nth-child(3n+2) { .sidebar-post--border { border-color: rgb(0, 160, 52) } }\n\n\n  &--link {\n    background-color: rgb(255, 255, 255);\n    display: block;\n    min-height: 50px;\n    padding: 10px 15px 10px 55px;\n    position: relative;\n\n    &:hover .sidebar-post--border {\n      background-color: rgb(229, 239, 245);\n    }\n  }\n\n  &--title {\n    color: rgba(0, 0, 0, 0.8);\n    font-size: 18px;\n    font-weight: 400;\n    margin: 0;\n  }\n}\n",".subscribe{\r\n  min-height: 90vh;\r\n  padding-top: $header-height;\r\n\r\n  h3{\r\n    margin: 0;\r\n    margin-bottom: 8px;\r\n    font: 400 20px/32px $primary-font;\r\n  }\r\n\r\n  &-title{\r\n    font-weight: 400;\r\n    margin-top: 0;\r\n  }\r\n\r\n  &-wrap{\r\n    max-width: 700px;\r\n    color: #7d878a;\r\n    padding: 1rem 0;\r\n  }\r\n\r\n  .form-group{\r\n    margin-bottom: 1.5rem;\r\n\r\n    &.error{\r\n      input {border-color: #ff5b5b;}\r\n    }\r\n  }\r\n\r\n  .btn{\r\n    width: 100%;\r\n  }\r\n}\r\n\r\n\r\n.subscribe-form{\r\n  position: relative;\r\n  margin: 30px auto;\r\n  padding: 40px;\r\n  max-width: 400px;\r\n  width: 100%;\r\n  background: #ebeff2;\r\n  border-radius: 5px;\r\n  text-align: left;\r\n}\r\n\r\n.subscribe-input{\r\n  width: 100%;\r\n  padding: 10px;\r\n  border: #4285f4  1px solid;\r\n  border-radius: 2px;\r\n  &:focus{\r\n    outline: none;\r\n  }\r\n}\r\n","// animated Global\r\n.animated {\r\n    animation-duration: 1s;\r\n    animation-fill-mode: both;\r\n    &.infinite {\r\n        animation-iteration-count: infinite;\r\n    }\r\n}\r\n\r\n// animated All\r\n.bounceIn {animation-name: bounceIn;}\r\n.bounceInDown {animation-name: bounceInDown}\r\n\r\n\r\n// all keyframes Animates\r\n\r\n// bounceIn\r\n@keyframes bounceIn {\r\n    0%, 20%, 40%, 60%, 80%, 100% {\r\n        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\r\n    }\r\n\r\n    0% {\r\n        opacity: 0;\r\n        transform: scale3d(.3, .3, .3);\r\n    }\r\n\r\n    20% {\r\n        transform: scale3d(1.1, 1.1, 1.1);\r\n    }\r\n\r\n    40% {\r\n        transform: scale3d(.9, .9, .9);\r\n    }\r\n\r\n    60% {\r\n        opacity: 1;\r\n        transform: scale3d(1.03, 1.03, 1.03);\r\n    }\r\n\r\n    80% {\r\n        transform: scale3d(.97, .97, .97);\r\n    }\r\n\r\n    100% {\r\n        opacity: 1;\r\n        transform: scale3d(1, 1, 1);\r\n    }\r\n\r\n};\r\n\r\n// bounceInDown\r\n@keyframes bounceInDown {\r\n    0%, 60%, 75%, 90%, 100% {\r\n        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\r\n    }\r\n\r\n    0% {\r\n        opacity: 0;\r\n        transform: translate3d(0, -3000px, 0);\r\n    }\r\n\r\n    60% {\r\n        opacity: 1;\r\n        transform: translate3d(0, 25px, 0);\r\n    }\r\n\r\n    75% {\r\n        transform: translate3d(0, -10px, 0);\r\n    }\r\n\r\n    90% {\r\n        transform: translate3d(0, 5px, 0);\r\n    }\r\n\r\n    100% {\r\n        transform: none;\r\n    }\r\n}\r\n\r\n@keyframes pulse{\r\n    from{\r\n        transform: scale3d(1, 1, 1);\r\n    }\r\n\r\n    50% {\r\n        transform: scale3d(1.05, 1.05, 1.05);\r\n    }\r\n\r\n    to {\r\n        transform: scale3d(1, 1, 1);\r\n    }\r\n}\r\n\r\n\r\n@keyframes scroll{\r\n    0%{\r\n        opacity:0\r\n    }\r\n    10%{\r\n        opacity:1;\r\n        transform:translateY(0px)\r\n    }\r\n    100% {\r\n        opacity: 0;\r\n        transform: translateY(10px);\r\n    }\r\n}\r\n\r\n//  spin for pagination\r\n@keyframes spin {\r\n    from { transform:rotate(0deg); }\r\n    to { transform:rotate(360deg); }\r\n}\r\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 6 */
/*!**************************************************!*\
  !*** ../node_modules/css-loader/lib/css-base.js ***!
  \**************************************************/
/*! no static exports found */
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
/* 7 */
/*!***********************************************************!*\
  !*** ../node_modules/html-entities/lib/html5-entities.js ***!
  \***********************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
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
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
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
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
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
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 8 */
/*!**********************************************************************************************!*\
  !*** ../node_modules/webpack-hot-middleware/client.js?noInfo=true&timeout=20000&reload=true ***!
  \**********************************************************************************************/
/*! no static exports found */
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
  name: ''
};
if (true) {
  var querystring = __webpack_require__(/*! querystring */ 10);
  var overrides = querystring.parse(__resourceQuery.slice(1));
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

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  connect();
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
  var strip = __webpack_require__(/*! strip-ansi */ 13);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(/*! ./client-overlay */ 15);
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

var processUpdate = __webpack_require__(/*! ./process-update */ 20);

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
    }
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?noInfo=true&timeout=20000&reload=true", __webpack_require__(/*! ./../webpack/buildin/module.js */ 9)(module)))

/***/ }),
/* 9 */
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/module.js ***!
  \*************************************************/
/*! no static exports found */
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
/* 10 */
/*!************************************************!*\
  !*** ../node_modules/querystring-es3/index.js ***!
  \************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ 11);
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ 12);


/***/ }),
/* 11 */
/*!*************************************************!*\
  !*** ../node_modules/querystring-es3/decode.js ***!
  \*************************************************/
/*! no static exports found */
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
/* 12 */
/*!*************************************************!*\
  !*** ../node_modules/querystring-es3/encode.js ***!
  \*************************************************/
/*! no static exports found */
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
/* 13 */
/*!*******************************************!*\
  !*** ../node_modules/strip-ansi/index.js ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(/*! ansi-regex */ 14)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 14 */
/*!*******************************************!*\
  !*** ../node_modules/ansi-regex/index.js ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 15 */
/*!****************************************************************!*\
  !*** ../node_modules/webpack-hot-middleware/client-overlay.js ***!
  \****************************************************************/
/*! no static exports found */
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

var ansiHTML = __webpack_require__(/*! ansi-html */ 16);
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

var Entities = __webpack_require__(/*! html-entities */ 17).AllHtmlEntities;
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
/* 16 */
/*!******************************************!*\
  !*** ../node_modules/ansi-html/index.js ***!
  \******************************************/
/*! no static exports found */
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
/* 17 */
/*!**********************************************!*\
  !*** ../node_modules/html-entities/index.js ***!
  \**********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(/*! ./lib/xml-entities.js */ 18),
  Html4Entities: __webpack_require__(/*! ./lib/html4-entities.js */ 19),
  Html5Entities: __webpack_require__(/*! ./lib/html5-entities.js */ 7),
  AllHtmlEntities: __webpack_require__(/*! ./lib/html5-entities.js */ 7)
};


/***/ }),
/* 18 */
/*!*********************************************************!*\
  !*** ../node_modules/html-entities/lib/xml-entities.js ***!
  \*********************************************************/
/*! no static exports found */
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
/* 19 */
/*!***********************************************************!*\
  !*** ../node_modules/html-entities/lib/html4-entities.js ***!
  \***********************************************************/
/*! no static exports found */
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
/* 20 */
/*!****************************************************************!*\
  !*** ../node_modules/webpack-hot-middleware/process-update.js ***!
  \****************************************************************/
/*! no static exports found */
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

var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { ignoreUnaccepted: true };

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
/* 21 */
/*!****************************************!*\
  !*** ../node_modules/prismjs/prism.js ***!
  \****************************************/
/*! no static exports found */
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
					// Check for existence for IE8
					return o.map && o.map(function(v) { return _.util.clone(v); });
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
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || document.querySelectorAll(env.selector);

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

		// Set language on the parent, for styling
		parent = element.parentNode;

		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
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
				env.element.textContent = env.code;
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

	tokenize: function(text, grammar, language) {
		var Token = _.Token;

		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
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
				for (var i=0, pos = 0; i<strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
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

						for (var len = strarr.length; k < len && p < to; ++k) {
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
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

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

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

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
 	// In worker
	_self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code,
		    immediateClose = message.immediateClose;

		_self.postMessage(_.highlight(code, _.languages[lang], lang));
		if (immediateClose) {
			_self.close();
		}
	}, false);

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (document.addEventListener && !script.hasAttribute('data-manual')) {
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
	'comment': /<!--[\w\W]*?-->/,
	'prolog': /<\?[\w\W]+?\?>/,
	'doctype': /<!DOCTYPE[\w\W]+?>/i,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: {
					'punctuation': /[=>"']/
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
	'comment': /\/\*[\w\W]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /(\b|\B)[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});
	
	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').*?\1/i,
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
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\\\|\\?[^\\])*?`/,
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
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
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

		if(Array.prototype.forEach) { // Check to prevent error in IE8
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
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 22)))

/***/ }),
/* 22 */
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/global.js ***!
  \*************************************************/
/*! no static exports found */
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
/* 23 */
/*!**********************************************************************!*\
  !*** ../node_modules/prismjs/plugins/autoloader/prism-autoloader.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.createElement) {
		return;
	}

	// The dependencies map is built automatically with gulp
	var lang_dependencies = /*languages_placeholder[*/{"javascript":"clike","actionscript":"javascript","aspnet":"markup","bison":"c","c":"clike","csharp":"clike","cpp":"c","coffeescript":"javascript","crystal":"ruby","css-extras":"css","d":"clike","dart":"clike","fsharp":"clike","glsl":"clike","go":"clike","groovy":"clike","haml":"ruby","handlebars":"markup","haxe":"clike","jade":"javascript","java":"clike","jolie":"clike","kotlin":"clike","less":"css","markdown":"markup","nginx":"clike","objectivec":"c","parser":"markup","php":"clike","php-extras":"php","processing":"clike","protobuf":"clike","qore":"clike","jsx":["markup","javascript"],"reason":"clike","ruby":"clike","sass":"css","scss":"css","scala":"java","smarty":"markup","swift":"clike","textile":"markup","twig":"markup","typescript":"javascript","wiki":"markup"}/*]*/;

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
/* 24 */
/*!**************************************************************************!*\
  !*** ../node_modules/prismjs/plugins/line-numbers/prism-line-numbers.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() {

if (typeof self === 'undefined' || !self.Prism || !self.document) {
	return;
}

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

	if (env.element.querySelector(".line-numbers-rows")) {
		// Abort if line numbers already exists
		return;
	}

	if (clsReg.test(env.element.className)) {
		// Remove the class "line-numbers" from the <code>
		env.element.className = env.element.className.replace(clsReg, '');
	}
	if (!clsReg.test(pre.className)) {
		// Add the class "line-numbers" to the <pre>
		pre.className += ' line-numbers';
	}

	var match = env.code.match(/\n(?!$)/g);
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

});

}());

/***/ }),
/* 25 */
/*!*****************************************************!*\
  !*** ../node_modules/sticky-kit/dist/sticky-kit.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery) {// Generated by CoffeeScript 1.6.2
/**
@license Sticky-kit v1.1.3 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
*/


(function() {
  var $, win;

  $ = this.jQuery || __webpack_provided_window_dot_jQuery;

  win = $(window);

  $.fn.stick_in_parent = function(opts) {
    var doc, elm, enable_bottoming, inner_scrolling, manual_spacer, offset_top, outer_width, parent_selector, recalc_every, sticky_class, _fn, _i, _len;

    if (opts == null) {
      opts = {};
    }
    sticky_class = opts.sticky_class, inner_scrolling = opts.inner_scrolling, recalc_every = opts.recalc_every, parent_selector = opts.parent, offset_top = opts.offset_top, manual_spacer = opts.spacer, enable_bottoming = opts.bottoming;
    if (offset_top == null) {
      offset_top = 0;
    }
    if (parent_selector == null) {
      parent_selector = void 0;
    }
    if (inner_scrolling == null) {
      inner_scrolling = true;
    }
    if (sticky_class == null) {
      sticky_class = "is_stuck";
    }
    doc = $(document);
    if (enable_bottoming == null) {
      enable_bottoming = true;
    }
    outer_width = function(el) {
      var computed, w, _el;

      if (window.getComputedStyle) {
        _el = el[0];
        computed = window.getComputedStyle(el[0]);
        w = parseFloat(computed.getPropertyValue("width")) + parseFloat(computed.getPropertyValue("margin-left")) + parseFloat(computed.getPropertyValue("margin-right"));
        if (computed.getPropertyValue("box-sizing") !== "border-box") {
          w += parseFloat(computed.getPropertyValue("border-left-width")) + parseFloat(computed.getPropertyValue("border-right-width")) + parseFloat(computed.getPropertyValue("padding-left")) + parseFloat(computed.getPropertyValue("padding-right"));
        }
        return w;
      } else {
        return el.outerWidth(true);
      }
    };
    _fn = function(elm, padding_bottom, parent_top, parent_height, top, height, el_float, detached) {
      var bottomed, detach, fixed, last_pos, last_scroll_height, offset, parent, recalc, recalc_and_tick, recalc_counter, spacer, tick;

      if (elm.data("sticky_kit")) {
        return;
      }
      elm.data("sticky_kit", true);
      last_scroll_height = doc.height();
      parent = elm.parent();
      if (parent_selector != null) {
        parent = parent.closest(parent_selector);
      }
      if (!parent.length) {
        throw "failed to find stick parent";
      }
      fixed = false;
      bottomed = false;
      spacer = manual_spacer != null ? manual_spacer && elm.closest(manual_spacer) : $("<div />");
      if (spacer) {
        spacer.css('position', elm.css('position'));
      }
      recalc = function() {
        var border_top, padding_top, restore;

        if (detached) {
          return;
        }
        last_scroll_height = doc.height();
        border_top = parseInt(parent.css("border-top-width"), 10);
        padding_top = parseInt(parent.css("padding-top"), 10);
        padding_bottom = parseInt(parent.css("padding-bottom"), 10);
        parent_top = parent.offset().top + border_top + padding_top;
        parent_height = parent.height();
        if (fixed) {
          fixed = false;
          bottomed = false;
          if (manual_spacer == null) {
            elm.insertAfter(spacer);
            spacer.detach();
          }
          elm.css({
            position: "",
            top: "",
            width: "",
            bottom: ""
          }).removeClass(sticky_class);
          restore = true;
        }
        top = elm.offset().top - (parseInt(elm.css("margin-top"), 10) || 0) - offset_top;
        height = elm.outerHeight(true);
        el_float = elm.css("float");
        if (spacer) {
          spacer.css({
            width: outer_width(elm),
            height: height,
            display: elm.css("display"),
            "vertical-align": elm.css("vertical-align"),
            "float": el_float
          });
        }
        if (restore) {
          return tick();
        }
      };
      recalc();
      if (height === parent_height) {
        return;
      }
      last_pos = void 0;
      offset = offset_top;
      recalc_counter = recalc_every;
      tick = function() {
        var css, delta, recalced, scroll, will_bottom, win_height;

        if (detached) {
          return;
        }
        recalced = false;
        if (recalc_counter != null) {
          recalc_counter -= 1;
          if (recalc_counter <= 0) {
            recalc_counter = recalc_every;
            recalc();
            recalced = true;
          }
        }
        if (!recalced && doc.height() !== last_scroll_height) {
          recalc();
          recalced = true;
        }
        scroll = win.scrollTop();
        if (last_pos != null) {
          delta = scroll - last_pos;
        }
        last_pos = scroll;
        if (fixed) {
          if (enable_bottoming) {
            will_bottom = scroll + height + offset > parent_height + parent_top;
            if (bottomed && !will_bottom) {
              bottomed = false;
              elm.css({
                position: "fixed",
                bottom: "",
                top: offset
              }).trigger("sticky_kit:unbottom");
            }
          }
          if (scroll < top) {
            fixed = false;
            offset = offset_top;
            if (manual_spacer == null) {
              if (el_float === "left" || el_float === "right") {
                elm.insertAfter(spacer);
              }
              spacer.detach();
            }
            css = {
              position: "",
              width: "",
              top: ""
            };
            elm.css(css).removeClass(sticky_class).trigger("sticky_kit:unstick");
          }
          if (inner_scrolling) {
            win_height = win.height();
            if (height + offset_top > win_height) {
              if (!bottomed) {
                offset -= delta;
                offset = Math.max(win_height - height, offset);
                offset = Math.min(offset_top, offset);
                if (fixed) {
                  elm.css({
                    top: offset + "px"
                  });
                }
              }
            }
          }
        } else {
          if (scroll > top) {
            fixed = true;
            css = {
              position: "fixed",
              top: offset
            };
            css.width = elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px";
            elm.css(css).addClass(sticky_class);
            if (manual_spacer == null) {
              elm.after(spacer);
              if (el_float === "left" || el_float === "right") {
                spacer.append(elm);
              }
            }
            elm.trigger("sticky_kit:stick");
          }
        }
        if (fixed && enable_bottoming) {
          if (will_bottom == null) {
            will_bottom = scroll + height + offset > parent_height + parent_top;
          }
          if (!bottomed && will_bottom) {
            bottomed = true;
            if (parent.css("position") === "static") {
              parent.css({
                position: "relative"
              });
            }
            return elm.css({
              position: "absolute",
              bottom: padding_bottom,
              top: "auto"
            }).trigger("sticky_kit:bottom");
          }
        }
      };
      recalc_and_tick = function() {
        recalc();
        return tick();
      };
      detach = function() {
        detached = true;
        win.off("touchmove", tick);
        win.off("scroll", tick);
        win.off("resize", recalc_and_tick);
        $(document.body).off("sticky_kit:recalc", recalc_and_tick);
        elm.off("sticky_kit:detach", detach);
        elm.removeData("sticky_kit");
        elm.css({
          position: "",
          bottom: "",
          top: "",
          width: ""
        });
        parent.position("position", "");
        if (fixed) {
          if (manual_spacer == null) {
            if (el_float === "left" || el_float === "right") {
              elm.insertAfter(spacer);
            }
            spacer.remove();
          }
          return elm.removeClass(sticky_class);
        }
      };
      win.on("touchmove", tick);
      win.on("scroll", tick);
      win.on("resize", recalc_and_tick);
      $(document.body).on("sticky_kit:recalc", recalc_and_tick);
      elm.on("sticky_kit:detach", detach);
      return setTimeout(tick, 0);
    };
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      elm = this[_i];
      _fn($(elm));
    }
    return this;
  };

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 26 */
/*!**********************************************************!*\
  !*** ../node_modules/jquery-lazyload/jquery.lazyload.js ***!
  \**********************************************************/
/*! no static exports found */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 27 */
/*!************************************************!*\
  !*** ./scripts/autoload/jquery.ghostHunter.js ***!
  \************************************************/
/*! no static exports found */
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
	var lunr = __webpack_require__(/*! lunr */ 28);

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 28 */
/*!************************************!*\
  !*** ../node_modules/lunr/lunr.js ***!
  \************************************/
/*! no static exports found */
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
/* 29 */
/*!****************************************!*\
  !*** ./scripts/autoload/pagination.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {(function () {
  /**
   * @package godofredoninja
   * pagination
   */
  var $win = $(window);
  var paginationUrl = $('link[rel=canonical]').attr('href');
  var $btnLoadMore = $('.mapache-load-more');
  var $paginationTotal = $btnLoadMore.attr('data-page-total');

  var enableDisableScroll = false; // false => !1
  var paginationNumber = 2;

  /* Page end */
  function activeScroll() {
    enableDisableScroll = true; // true => !0
  }

  //  window scroll
  $win.on('scroll', activeScroll);

  /* Scroll page END */
  function PageEnd() {
    var scrollTopWindow = $win.scrollTop() + window.innerHeight;
    var scrollTopBody = document.body.clientHeight - (window.innerHeight * 2);

    return (enableDisableScroll === true && scrollTopWindow > scrollTopBody);
  }

  /* get urL */
  function getNextPage() {
    $.ajax({
      type: 'GET',
      url: (paginationUrl + "page/" + paginationNumber),

      beforeSend: function () {
        $win.off('scroll', activeScroll);
        $btnLoadMore.text('Loading...');
      },

      success: function (data) {
        var entries = $('.feed-entry-wrapper', data);
        $('.feed-entry-content').append(entries);

        $btnLoadMore.html('Load more <i class="i-keyboard_arrow_down">');

        paginationNumber += 1;

        $('span.lazy').lazyload();

        $win.on('scroll', activeScroll);
      },
    });

    /* Scroll False*/
    enableDisableScroll = false; // => !1;
  }

  $(document).on('ready', function () {
    // set interbal
    setInterval(function () {
      if (PageEnd()) {
        if (typeof $paginationTotal !== 'undefined' && !$btnLoadMore.hasClass('not-load-more')) {
          /* Add class <.not-load-more> to <.mapache-load-more> */
          if (paginationNumber === 3) { $btnLoadMore.addClass('not-load-more'); }

          (paginationNumber <= $paginationTotal) ? getNextPage() : $btnLoadMore.remove();
        }
      }
    }, 500);

    /* Remove class <.not-load-more> to <.not-load-more> */
    $('.content').on('click', '.mapache-load-more.not-load-more', function (e) {
      e.preventDefault();
      $(this).removeClass('not-load-more');
    });
  });

})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 30 */
/*!********************************!*\
  !*** ./scripts/util/Router.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__camelCase__ = __webpack_require__(/*! ./camelCase */ 31);


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
/* 31 */
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
/* 32 */
/*!**********************************!*\
  !*** ./scripts/routes/common.js ***!
  \**********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {var $win = $(window);
var $header = $('#header');
var $searchInput = $('.search-field');
var $pageUrl = $('body').attr('mapache-page-url');
var $buttonBackTop = $('.scroll_top');
var urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/; // eslint-disable-line


/**
 * Sticky Navbar in (home - tag - author)
 * Show the button to go back up
 */
var windowScroll = $win.on('scroll', function () {
  var scrollTop = $win.scrollTop();
  var coverHeight = $('#cover').height() - $header.height();
  var coverWrap = (coverHeight - scrollTop) / coverHeight;

  // show background in header
  (scrollTop >= coverHeight) ? $header.addClass('toolbar-shadow') : $header.removeClass('toolbar-shadow');

  $('.cover-wrap').css('opacity', coverWrap);

  /* show btn SctrollTop */
  ($(this).scrollTop() > 100) ? $buttonBackTop.addClass('visible') : $buttonBackTop.removeClass('visible');

});

// Search
function searchGhostHunter () {
  $searchInput
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
    result_template: ("<a href=\"" + $pageUrl + "{{link}}\">{{title}}</a>"),
    onKeyUp: true,
  });
}


/**
 * Export events
 */
/* unused harmony default export */ var _unused_webpack_default_export = ({
  init: function init() {

    // Follow Social Media
    if (typeof followSocialMedia !== 'undefined') {
      $.each(followSocialMedia, function (name, url) { // eslint-disable-line
        if (typeof url === 'string' && urlRegexp.test(url)) {
          var template = "<a title=\"Follow me in " + name + "\" href=\"" + url + "\" target=\"_blank\" class=\"i-" + name + "\"></a>";
          $('.social_box').append(template);
        }
      });
    }

    /* Lazy load for image */
    $('span.lazy').lazyload();
    $('div.lazy').lazyload({
      effect : 'fadeIn',
    });

    /* sticky fixed for Sidenar */
    $('.sidebar-sticky').stick_in_parent({
      offset_top: 66,
    });

  },
  finalize: function finalize() {
    // JavaScript to be fired on all pages, after page specific JS is fired

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

    // Search function
    searchGhostHunter ();

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

    /**
     * Sticky Navbar in (home - tag - author)
     * Show the button to go back top
     */
    windowScroll ();

  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 33 */
/*!********************************!*\
  !*** ./scripts/routes/home.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* unused harmony default export */ var _unused_webpack_default_export = ({
  init: function init() {
    // Change title HOME PAGE
    if (typeof homeTitle !== 'undefined') { $('#title-home').html(homeTitle) } // eslint-disable-line

    // change BTN ( Name - URL)
    if (typeof homeBtnTitle !== 'undefined' && typeof homeBtnURL !== 'undefined') {
      $('#btn-home').attr('href', homeBtnURL).html(homeBtnTitle); // eslint-disable-line
    }
  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 34 */
/*!********************************!*\
  !*** ./scripts/routes/post.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {// const $postBody = $('.post-body');
var $videoPostFormat = $('.video-post-format');

/* Iframe SRC video */
var iframeForVideoResponsive = [
  'iframe[src*="player.vimeo.com"]',
  'iframe[src*="dailymotion.com"]',
  'iframe[src*="facebook.com/plugins/video.php"]',
  'iframe[src*="youtube.com"]',
  'iframe[src*="youtube-nocookie.com"]',
  'iframe[src*="kickstarter.com"][src*="video.html"]' ];

/* Iframe src audio */
var iframeForAudioResponsive = [
  'iframe[src*="w.soundcloud.com"]',
  'iframe[src*="soundcloud.com"]',
  'iframe[src*="embed.spotify.com"]',
  'iframe[src*="spotify.com"]' ];

/* Video Post Format */
function videoPostFormat () {
  // video Large in tOP
  var firstVideo = $('.post-body').find(iframeForVideoResponsive.join(','))[0];
  $(firstVideo).appendTo($videoPostFormat).wrap('<aside class="video-responsive"></aside>');
}

/* search all video in <post-body>  for Responsive*/
function videoResponsive () {
  var iframe = iframeForAudioResponsive.concat(iframeForVideoResponsive);
  var allVideos = $('.post-body').find(iframe.join(','));

  return allVideos.map(function (key, value) { return $(value).wrap('<aside class="video-responsive"></aside>'); });
}

function youtubeBtnSubscribe () {
  if (typeof youtubeChannelName !== 'undefined' && typeof youtubeChannelID !== 'undefined') {
    /*eslint-disable */
    var template = "<div class=\"video-subscribe u-flex u-h-b-md\" style=\"margin-bottom:16px\">\n      <span class=\"channel-name\" style=\"margin-right:16px\">Subscribe to " + youtubeChannelName + "</span>\n      <div class=\"g-ytsubscribe\" data-channelid=\"" + youtubeChannelID + "\" data-layout=\"default\" data-count=\"default\"></div>\n    </div>";
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
}

/**
 *  Events in post Page
 */
/* unused harmony default export */ var _unused_webpack_default_export = ({
  init: function init() {
    // Video Responsive
    videoPostFormat ();
  },
  finalize: function finalize() {
    // btn subscribe for Youtube
    youtubeBtnSubscribe ();
    // Video Responsive
    videoResponsive ();

    /* Prism autoloader */
    Prism.plugins.autoloader.languages_path = '../assets/scripts/prism-components/'; // eslint-disable-line
  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 35 */
/*!*************************************************************************************************!*\
  !*** ../node_modules/css-loader?{"sourceMap":true}!../node_modules/normalize.css/normalize.css ***!
  \*************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../css-loader/lib/css-base.js */ 6)(true);
// imports


// module
exports.push([module.i, "/*! normalize.css v6.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in\n *    IE on Windows Phone and in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -ms-text-size-adjust: 100%; /* 2 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption,\nfigure,\nmain { /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent; /* 1 */\n  -webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57- and Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  margin: 0;\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  display: inline-block; /* 1 */\n  vertical-align: baseline; /* 2 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails, /* 1 */\nmenu {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Scripting\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n  display: none;\n}\n\n/* Hidden\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n  display: none;\n}\n", "", {"version":3,"sources":["C:/Users/Smigol/Projects/joder/content/themes/Mapache/node_modules/normalize.css/normalize.css"],"names":[],"mappings":"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","file":"normalize.css","sourcesContent":["/*! normalize.css v6.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in\n *    IE on Windows Phone and in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -ms-text-size-adjust: 100%; /* 2 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption,\nfigure,\nmain { /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent; /* 1 */\n  -webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57- and Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  margin: 0;\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  display: inline-block; /* 1 */\n  vertical-align: baseline; /* 2 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails, /* 1 */\nmenu {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Scripting\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n  display: none;\n}\n\n/* Hidden\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n  display: none;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 36 */
/*!**********************************************************************************************!*\
  !*** ../node_modules/css-loader?{"sourceMap":true}!../node_modules/prismjs/themes/prism.css ***!
  \**********************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../css-loader/lib/css-base.js */ 6)(true);
// imports


// module
exports.push([module.i, "/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tcolor: black;\n\tbackground: none;\n\ttext-shadow: 0 1px white;\n\tfont-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n\ttext-align: left;\n\twhite-space: pre;\n\tword-spacing: normal;\n\tword-break: normal;\n\tword-wrap: normal;\n\tline-height: 1.5;\n\n\t-moz-tab-size: 4;\n\t-o-tab-size: 4;\n\ttab-size: 4;\n\n\t-webkit-hyphens: none;\n\t-moz-hyphens: none;\n\t-ms-hyphens: none;\n\thyphens: none;\n}\n\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\n@media print {\n\tcode[class*=\"language-\"],\n\tpre[class*=\"language-\"] {\n\t\ttext-shadow: none;\n\t}\n}\n\n/* Code blocks */\npre[class*=\"language-\"] {\n\tpadding: 1em;\n\tmargin: .5em 0;\n\toverflow: auto;\n}\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tbackground: #f5f2f0;\n}\n\n/* Inline code */\n:not(pre) > code[class*=\"language-\"] {\n\tpadding: .1em;\n\tborder-radius: .3em;\n\twhite-space: normal;\n}\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n\tcolor: slategray;\n}\n\n.token.punctuation {\n\tcolor: #999;\n}\n\n.namespace {\n\topacity: .7;\n}\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n\tcolor: #905;\n}\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n\tcolor: #690;\n}\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n\tcolor: #a67f59;\n\tbackground: hsla(0, 0%, 100%, .5);\n}\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n\tcolor: #07a;\n}\n\n.token.function {\n\tcolor: #DD4A68;\n}\n\n.token.regex,\n.token.important,\n.token.variable {\n\tcolor: #e90;\n}\n\n.token.important,\n.token.bold {\n\tfont-weight: bold;\n}\n.token.italic {\n\tfont-style: italic;\n}\n\n.token.entity {\n\tcursor: help;\n}\n", "", {"version":3,"sources":["C:/Users/Smigol/Projects/joder/content/themes/Mapache/node_modules/prismjs/themes/prism.css"],"names":[],"mappings":"AAAA;;;;GAIG;;AAEH;;CAEC,aAAa;CACb,iBAAiB;CACjB,yBAAyB;CACzB,uEAAuE;CACvE,iBAAiB;CACjB,iBAAiB;CACjB,qBAAqB;CACrB,mBAAmB;CACnB,kBAAkB;CAClB,iBAAiB;;CAEjB,iBAAiB;CACjB,eAAe;CACf,YAAY;;CAEZ,sBAAsB;CACtB,mBAAmB;CACnB,kBAAkB;CAClB,cAAc;CACd;;AAED;;CAEC,kBAAkB;CAClB,oBAAoB;CACpB;;AAED;;CAEC,kBAAkB;CAClB,oBAAoB;CACpB;;AAED;CACC;;EAEC,kBAAkB;EAClB;CACD;;AAED,iBAAiB;AACjB;CACC,aAAa;CACb,eAAe;CACf,eAAe;CACf;;AAED;;CAEC,oBAAoB;CACpB;;AAED,iBAAiB;AACjB;CACC,cAAc;CACd,oBAAoB;CACpB,oBAAoB;CACpB;;AAED;;;;CAIC,iBAAiB;CACjB;;AAED;CACC,YAAY;CACZ;;AAED;CACC,YAAY;CACZ;;AAED;;;;;;;CAOC,YAAY;CACZ;;AAED;;;;;;CAMC,YAAY;CACZ;;AAED;;;;;CAKC,eAAe;CACf,kCAAkC;CAClC;;AAED;;;CAGC,YAAY;CACZ;;AAED;CACC,eAAe;CACf;;AAED;;;CAGC,YAAY;CACZ;;AAED;;CAEC,kBAAkB;CAClB;AACD;CACC,mBAAmB;CACnB;;AAED;CACC,aAAa;CACb","file":"prism.css","sourcesContent":["/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tcolor: black;\n\tbackground: none;\n\ttext-shadow: 0 1px white;\n\tfont-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n\ttext-align: left;\n\twhite-space: pre;\n\tword-spacing: normal;\n\tword-break: normal;\n\tword-wrap: normal;\n\tline-height: 1.5;\n\n\t-moz-tab-size: 4;\n\t-o-tab-size: 4;\n\ttab-size: 4;\n\n\t-webkit-hyphens: none;\n\t-moz-hyphens: none;\n\t-ms-hyphens: none;\n\thyphens: none;\n}\n\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\n@media print {\n\tcode[class*=\"language-\"],\n\tpre[class*=\"language-\"] {\n\t\ttext-shadow: none;\n\t}\n}\n\n/* Code blocks */\npre[class*=\"language-\"] {\n\tpadding: 1em;\n\tmargin: .5em 0;\n\toverflow: auto;\n}\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tbackground: #f5f2f0;\n}\n\n/* Inline code */\n:not(pre) > code[class*=\"language-\"] {\n\tpadding: .1em;\n\tborder-radius: .3em;\n\twhite-space: normal;\n}\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n\tcolor: slategray;\n}\n\n.token.punctuation {\n\tcolor: #999;\n}\n\n.namespace {\n\topacity: .7;\n}\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n\tcolor: #905;\n}\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n\tcolor: #690;\n}\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n\tcolor: #a67f59;\n\tbackground: hsla(0, 0%, 100%, .5);\n}\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n\tcolor: #07a;\n}\n\n.token.function {\n\tcolor: #DD4A68;\n}\n\n.token.regex,\n.token.important,\n.token.variable {\n\tcolor: #e90;\n}\n\n.token.important,\n.token.bold {\n\tfont-weight: bold;\n}\n.token.italic {\n\tfont-style: italic;\n}\n\n.token.entity {\n\tcursor: help;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 37 */
/*!***************************!*\
  !*** ./fonts/mapache.ttf ***!
  \***************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.ttf";

/***/ }),
/* 38 */
/*!****************************!*\
  !*** ./fonts/mapache.woff ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.woff";

/***/ }),
/* 39 */
/*!***************************!*\
  !*** ./fonts/mapache.svg ***!
  \***************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.svg";

/***/ }),
/* 40 */
/*!***************************!*\
  !*** ./images/avatar.png ***!
  \***************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJsAAACbBAMAAACHT/S/AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURSQmKMze6LfH0KSyusXX4HJ8gjY6PCotL5ShqVJYXWJqb4SPlkNJTCjFRkAAAALPSURBVGje7dm/b9NAFAfwp4Q4P4cSu+C0GeIBCmLq0EqtGOKBFpjCyhQQA0IdAqIDTCnqH9Ay0AoxOEJISDAEdWWoBAOCfwoJicSx793de3ciRLrvH/CR7853vvcMF21mCRznOMc5znGO+9+48POgvPfhlSWueQ5/8uQstsFdhb/xfh6acwmkcmrKBYM0Bz8MuRBm882MW8lwcM+IG2a5asTnNt5BLg/Z3DII4kVcLhFx8J3JhUINakxuR8xBxOPGCDdicUEf4Z6zOGTqAIosroVxJRbXxbgqixtiXJnFJRgH6wwuc9Kl84XB+agGxwxuGeeeMrgWzhUY3CWcqzC4Ls7VGVwH50qOW2Sua5dbsvveXf5nXGX+e9Yy18a54vy5TcnKxmROcrbjdzKc68i4Opkby7gqmevJuIZdzrM72Ma8524o42p2X5QSmduVcRUy15ZxBbub7AGZ82XciMyhVYXsNis5oHr0TSHjdu0e7v4bZLjlPc5VG32+OrMAXaFWeHLOp9afiuK9T6t5VNyY9JYouQ6t/FRxLVKNouRCUkGm5IT79oDfNBLsWy/mcx3aSqi4Nm0lVFxIWwkVJ1iLA5N2YI+yJ9TcGuF00uBy37NHRlxzoNvz0GulZiavEZtxO7rNMVYbemTac+8RxqrBtXR7xnpckOi1jPW4a/fPU9zbM5OVDTZOcpvsE7vnfuNE+CX7GHO45lfsxvPikM7dPsJvUOX3VO6K7LYI8CsmcdugyH5M4LZAmf1Im9PQAF5GmpyWJnw+EaepieZPwG0DsL08twWEZMeb40habj2y3E0gphZJuOtAzsz8zXK3gJHHGOf3ORy8RrgxSwNvXcjdBWbqIi444nLTf7Yp7g5bm15wU1zC5yZ3yCm3aqDBsxy3ZsI1cpzJWCejnXCSv2I6Oc5wTSMNLmQ434wrOM5xjlNwq2ZccaG40L0ojltc7jd/xjH1yBzj+wAAAABJRU5ErkJggg=="

/***/ }),
/* 41 */
/*!*****************************************************!*\
  !*** ../node_modules/style-loader/lib/addStyles.js ***!
  \*****************************************************/
/*! no static exports found */
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
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ 42);

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
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
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
/* 42 */
/*!************************************************!*\
  !*** ../node_modules/style-loader/lib/urls.js ***!
  \************************************************/
/*! no static exports found */
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


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map
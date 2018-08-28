/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
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
/******/ 	var hotCurrentHash = "ed03e527f58ceda259a6"; // eslint-disable-line no-unused-vars
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
/******/ 	return hotCreateRequire(22)(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/*!***********************************************************!*\
  !*** ../node_modules/html-entities/lib/html5-entities.js ***!
  \***********************************************************/
/*! dynamic exports provided */
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
/* 2 */
/*!*************************************!*\
  !*** ./build/helpers/hmr-client.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var hotMiddlewareScript = __webpack_require__(/*! webpack-hot-middleware/client?noInfo=true&timeout=20000&reload=true */ 3);

hotMiddlewareScript.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload();
  }
});


/***/ }),
/* 3 */
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
  autoConnect: true,
  overlayStyles: {},
  overlayWarnings: false,
  ansiColors: {}
};
if (true) {
  var querystring = __webpack_require__(/*! querystring */ 5);
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

  if (overrides.ansiColors) options.ansiColors = JSON.parse(overrides.ansiColors);
  if (overrides.overlayStyles) options.overlayStyles = JSON.parse(overrides.overlayStyles);

  if (overrides.overlayWarnings) {
    options.overlayWarnings = overrides.overlayWarnings == 'true';
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
  var strip = __webpack_require__(/*! strip-ansi */ 8);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(/*! ./client-overlay */ 10)({
      ansiColors: options.ansiColors,
      overlayStyles: options.overlayStyles
    });
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
      if (overlay) {
        if (options.overlayWarnings || type === 'errors') {
          overlay.showProblems(type, obj[type]);
          return false;
        }
        overlay.clear();
      }
      return true;
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(/*! ./process-update */ 15);

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
      var applyUpdate = true;
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
        applyUpdate = false;
      } else if (obj.warnings.length > 0) {
        if (reporter) {
          var overlayShown = reporter.problems('warnings', obj);
          applyUpdate = overlayShown;
        }
      } else {
        if (reporter) {
          reporter.cleanProblemsCache();
          reporter.success();
        }
      }
      if (applyUpdate) {
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

/* WEBPACK VAR INJECTION */}.call(exports, "?noInfo=true&timeout=20000&reload=true", __webpack_require__(/*! ./../webpack/buildin/module.js */ 4)(module)))

/***/ }),
/* 4 */
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
/* 5 */
/*!************************************************!*\
  !*** ../node_modules/querystring-es3/index.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ 6);
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ 7);


/***/ }),
/* 6 */
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
/* 7 */
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
/* 8 */
/*!*******************************************!*\
  !*** ../node_modules/strip-ansi/index.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(/*! ansi-regex */ 9)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 9 */
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
/* 10 */
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

var ansiHTML = __webpack_require__(/*! ansi-html */ 11);
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

var Entities = __webpack_require__(/*! html-entities */ 12).AllHtmlEntities;
var entities = new Entities();

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
}

function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
}

function problemType (type) {
  var problemColors = {
    errors: colors.red,
    warnings: colors.yellow
  };
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}

module.exports = function(options) {
  for (var color in options.overlayColors) {
    if (color in colors) {
      colors[color] = options.overlayColors[color];
    }
    ansiHTML.setColors(colors);
  }

  for (var style in options.overlayStyles) {
    styles[style] = options.overlayStyles[style];
  }

  for (var key in styles) {
    clientOverlay.style[key] = styles[key];
  }

  return {
    showProblems: showProblems,
    clear: clear
  }
};

module.exports.clear = clear;
module.exports.showProblems = showProblems;


/***/ }),
/* 11 */
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
/* 12 */
/*!**********************************************!*\
  !*** ../node_modules/html-entities/index.js ***!
  \**********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(/*! ./lib/xml-entities.js */ 13),
  Html4Entities: __webpack_require__(/*! ./lib/html4-entities.js */ 14),
  Html5Entities: __webpack_require__(/*! ./lib/html5-entities.js */ 1),
  AllHtmlEntities: __webpack_require__(/*! ./lib/html5-entities.js */ 1)
};


/***/ }),
/* 13 */
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
/* 14 */
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
/* 15 */
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
/* 16 */
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../node_modules/cache-loader/dist/cjs.js!../node_modules/css-loader?{"sourceMap":true}!../node_modules/postcss-loader/lib?{"config":{"path":"C://Users//Smigol//projects//ghost//content//themes//mapache//src//build","ctx":{"open":true,"copy":"images/**_/*","proxyUrl":"http://localhost:3000","cacheBusting":"[name]","paths":{"root":"C://Users//Smigol//projects//ghost//content//themes//mapache","assets":"C://Users//Smigol//projects//ghost//content//themes//mapache//src","dist":"C://Users//Smigol//projects//ghost//content//themes//mapache//assets"},"enabled":{"sourceMaps":true,"optimize":false,"cacheBusting":false,"watcher":true},"watch":["**_/*.hbs"],"entry":{"main":["./scripts/main.js","./styles/main.scss"],"amp":["./scripts/amp.js","./styles/amp.scss"]},"publicPath":"/assets/","devUrl":"http://localhost:2368","env":{"production":false,"development":true},"manifest":{}}},"sourceMap":true}!../node_modules/resolve-url-loader?{"sourceMap":true}!../node_modules/sass-loader/lib/loader.js?{"sourceMap":true,"sourceComments":true}!../node_modules/import-glob!./styles/main.scss ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(/*! ../../node_modules/css-loader/lib/url/escape.js */ 48);
exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ 17)(true);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n\n/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n/* line 11, node_modules/normalize.css/normalize.css */\n\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\n/* line 23, node_modules/normalize.css/normalize.css */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\n/* line 32, node_modules/normalize.css/normalize.css */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\n/* line 45, node_modules/normalize.css/normalize.css */\n\nhr {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 56, node_modules/normalize.css/normalize.css */\n\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\n/* line 68, node_modules/normalize.css/normalize.css */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\n/* line 77, node_modules/normalize.css/normalize.css */\n\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n  /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\n/* line 87, node_modules/normalize.css/normalize.css */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 97, node_modules/normalize.css/normalize.css */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\n/* line 108, node_modules/normalize.css/normalize.css */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\n/* line 117, node_modules/normalize.css/normalize.css */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\n/* line 125, node_modules/normalize.css/normalize.css */\n\nsub {\n  bottom: -0.25em;\n}\n\n/* line 129, node_modules/normalize.css/normalize.css */\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\n/* line 140, node_modules/normalize.css/normalize.css */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\n/* line 152, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\n/* line 168, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput {\n  /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\n/* line 178, node_modules/normalize.css/normalize.css */\n\nbutton,\nselect {\n  /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\n/* line 187, node_modules/normalize.css/normalize.css */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\n/* line 198, node_modules/normalize.css/normalize.css */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\n/* line 210, node_modules/normalize.css/normalize.css */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\n/* line 221, node_modules/normalize.css/normalize.css */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\n/* line 232, node_modules/normalize.css/normalize.css */\n\nlegend {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\n/* line 245, node_modules/normalize.css/normalize.css */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\n/* line 253, node_modules/normalize.css/normalize.css */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n/* line 262, node_modules/normalize.css/normalize.css */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n/* line 272, node_modules/normalize.css/normalize.css */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n/* line 282, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n/* line 291, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n/* line 300, node_modules/normalize.css/normalize.css */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\n/* line 312, node_modules/normalize.css/normalize.css */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\n/* line 320, node_modules/normalize.css/normalize.css */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\n/* line 331, node_modules/normalize.css/normalize.css */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n/* line 339, node_modules/normalize.css/normalize.css */\n\n[hidden] {\n  display: none;\n}\n\n/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\n/* line 7, node_modules/prismjs/themes/prism.css */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: black;\n  background: none;\n  text-shadow: 0 1px white;\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none;\n}\n\n/* line 30, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"]::-moz-selection,\npre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection,\ncode[class*=\"language-\"] ::-moz-selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n\n/* line 36, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"]::-moz-selection,\npre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection,\ncode[class*=\"language-\"] ::-moz-selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n\npre[class*=\"language-\"]::selection,\npre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection,\ncode[class*=\"language-\"] ::selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n\n@media print {\n  /* line 43, node_modules/prismjs/themes/prism.css */\n\n  code[class*=\"language-\"],\n  pre[class*=\"language-\"] {\n    text-shadow: none;\n  }\n}\n\n/* Code blocks */\n\n/* line 50, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"] {\n  padding: 1em;\n  margin: .5em 0;\n  overflow: auto;\n}\n\n/* line 56, node_modules/prismjs/themes/prism.css */\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n  background: #f5f2f0;\n}\n\n/* Inline code */\n\n/* line 62, node_modules/prismjs/themes/prism.css */\n\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em;\n  border-radius: .3em;\n  white-space: normal;\n}\n\n/* line 68, node_modules/prismjs/themes/prism.css */\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: slategray;\n}\n\n/* line 75, node_modules/prismjs/themes/prism.css */\n\n.token.punctuation {\n  color: #999;\n}\n\n/* line 79, node_modules/prismjs/themes/prism.css */\n\n.namespace {\n  opacity: .7;\n}\n\n/* line 83, node_modules/prismjs/themes/prism.css */\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #905;\n}\n\n/* line 93, node_modules/prismjs/themes/prism.css */\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n  color: #690;\n}\n\n/* line 102, node_modules/prismjs/themes/prism.css */\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n  color: #9a6e3a;\n  background: rgba(255, 255, 255, 0.5);\n}\n\n/* line 111, node_modules/prismjs/themes/prism.css */\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #07a;\n}\n\n/* line 117, node_modules/prismjs/themes/prism.css */\n\n.token.function,\n.token.class-name {\n  color: #DD4A68;\n}\n\n/* line 122, node_modules/prismjs/themes/prism.css */\n\n.token.regex,\n.token.important,\n.token.variable {\n  color: #e90;\n}\n\n/* line 128, node_modules/prismjs/themes/prism.css */\n\n.token.important,\n.token.bold {\n  font-weight: bold;\n}\n\n/* line 132, node_modules/prismjs/themes/prism.css */\n\n.token.italic {\n  font-style: italic;\n}\n\n/* line 136, node_modules/prismjs/themes/prism.css */\n\n.token.entity {\n  cursor: help;\n}\n\n/* line 1, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\npre[class*=\"language-\"].line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber;\n}\n\n/* line 7, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\npre[class*=\"language-\"].line-numbers > code {\n  position: relative;\n  white-space: inherit;\n}\n\n/* line 12, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n/* line 29, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber;\n}\n\n/* line 35, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right;\n}\n\n/* line 1, src/styles/common/_mixins.scss */\n\n.link {\n  color: inherit;\n  cursor: pointer;\n  text-decoration: none;\n}\n\n/* line 7, src/styles/common/_mixins.scss */\n\n.link--accent {\n  color: var(--primary-color);\n  text-decoration: none;\n}\n\n/* line 22, src/styles/common/_mixins.scss */\n\n.u-absolute0 {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n/* line 30, src/styles/common/_mixins.scss */\n\n.u-textColorDarker {\n  color: rgba(0, 0, 0, 0.8) !important;\n  fill: rgba(0, 0, 0, 0.8) !important;\n}\n\n/* line 35, src/styles/common/_mixins.scss */\n\n.warning::before,\n.note::before,\n.success::before,\n[class^=\"i-\"]::before,\n[class*=\" i-\"]::before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  /* stylelint-disable-line */\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* line 2, src/styles/autoload/_zoom.scss */\n\nimg[data-action=\"zoom\"] {\n  cursor: -webkit-zoom-in;\n  cursor: zoom-in;\n}\n\n/* line 5, src/styles/autoload/_zoom.scss */\n\n.zoom-img,\n.zoom-img-wrap {\n  position: relative;\n  z-index: 666;\n  -webkit-transition: all 300ms;\n  -o-transition: all 300ms;\n  transition: all 300ms;\n}\n\n/* line 13, src/styles/autoload/_zoom.scss */\n\nimg.zoom-img {\n  cursor: pointer;\n  cursor: -webkit-zoom-out;\n  cursor: -moz-zoom-out;\n}\n\n/* line 18, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay {\n  z-index: 420;\n  background: #fff;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  pointer-events: none;\n  filter: \"alpha(opacity=0)\";\n  opacity: 0;\n  -webkit-transition: opacity 300ms;\n  -o-transition: opacity 300ms;\n  transition: opacity 300ms;\n}\n\n/* line 33, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay-open .zoom-overlay {\n  filter: \"alpha(opacity=100)\";\n  opacity: 1;\n}\n\n/* line 37, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay-open,\n.zoom-overlay-transitioning {\n  cursor: default;\n}\n\n/* line 1, src/styles/common/_global.scss */\n\n:root {\n  --black: #000;\n  --white: #fff;\n  --primary-color: #1C9963;\n  --secondary-color: #2ad88d;\n  --header-color: #BBF1B9;\n  --header-color-hover: #EEFFEA;\n  --post-color-link: #2ad88d;\n  --story-cover-category-color: #2ad88d;\n  --composite-color: #CC116E;\n  --footer-color-link: #2ad88d;\n  --media-type-color: #2ad88d;\n}\n\n/* line 15, src/styles/common/_global.scss */\n\n*,\n*::before,\n*::after {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\n/* line 19, src/styles/common/_global.scss */\n\na {\n  color: inherit;\n  text-decoration: none;\n}\n\n/* line 23, src/styles/common/_global.scss */\n\na:active,\na:hover {\n  outline: 0;\n}\n\n/* line 29, src/styles/common/_global.scss */\n\nblockquote {\n  border-left: 3px solid #000;\n  color: #000;\n  font-family: \"Merriweather\", serif;\n  font-size: 1.1875rem;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin: 30px 0 0 -12px;\n  padding-bottom: 2px;\n  padding-left: 20px;\n}\n\n/* line 42, src/styles/common/_global.scss */\n\nblockquote p:first-of-type {\n  margin-top: 0;\n}\n\n/* line 45, src/styles/common/_global.scss */\n\nbody {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Ruda\", sans-serif;\n  font-size: 16px;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin: 0 auto;\n  text-rendering: optimizeLegibility;\n  overflow-x: hidden;\n}\n\n/* line 59, src/styles/common/_global.scss */\n\nhtml {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  font-size: 16px;\n}\n\n/* line 64, src/styles/common/_global.scss */\n\nfigure {\n  margin: 0;\n}\n\n/* line 68, src/styles/common/_global.scss */\n\nfigcaption {\n  color: rgba(0, 0, 0, 0.68);\n  display: block;\n  font-family: \"Merriweather\", serif;\n  -webkit-font-feature-settings: \"liga\" on, \"lnum\" on;\n          font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%;\n}\n\n/* line 89, src/styles/common/_global.scss */\n\nkbd,\nsamp,\ncode {\n  background: #f7f7f7;\n  border-radius: 4px;\n  color: #c7254e;\n  font-family: \"Fira Mono\", monospace !important;\n  font-size: 15px;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\n/* line 99, src/styles/common/_global.scss */\n\npre {\n  background-color: #f7f7f7 !important;\n  border-radius: 4px;\n  font-family: \"Fira Mono\", monospace !important;\n  font-size: 15px;\n  margin-top: 30px !important;\n  max-width: 100%;\n  overflow: hidden;\n  padding: 1rem;\n  position: relative;\n  word-wrap: normal;\n}\n\n/* line 111, src/styles/common/_global.scss */\n\npre code {\n  background: transparent;\n  color: #37474f;\n  padding: 0;\n  text-shadow: 0 1px #fff;\n}\n\n/* line 119, src/styles/common/_global.scss */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: #37474f;\n  line-height: 1.4;\n}\n\n/* line 124, src/styles/common/_global.scss */\n\ncode[class*=language-] .token.comment,\npre[class*=language-] .token.comment {\n  opacity: .8;\n}\n\n/* line 126, src/styles/common/_global.scss */\n\ncode[class*=language-].line-numbers,\npre[class*=language-].line-numbers {\n  padding-left: 58px;\n}\n\n/* line 129, src/styles/common/_global.scss */\n\ncode[class*=language-].line-numbers::before,\npre[class*=language-].line-numbers::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  background: #F0EDEE;\n  width: 40px;\n  height: 100%;\n}\n\n/* line 140, src/styles/common/_global.scss */\n\ncode[class*=language-] .line-numbers-rows,\npre[class*=language-] .line-numbers-rows {\n  border-right: none;\n  top: -3px;\n  left: -58px;\n}\n\n/* line 145, src/styles/common/_global.scss */\n\ncode[class*=language-] .line-numbers-rows > span::before,\npre[class*=language-] .line-numbers-rows > span::before {\n  padding-right: 0;\n  text-align: center;\n  opacity: .8;\n}\n\n/* line 155, src/styles/common/_global.scss */\n\nhr:not(.hr-list):not(.post-footer-hr) {\n  border: 0;\n  display: block;\n  margin: 50px auto;\n  text-align: center;\n}\n\n/* line 161, src/styles/common/_global.scss */\n\nhr:not(.hr-list):not(.post-footer-hr)::before {\n  color: rgba(0, 0, 0, 0.6);\n  content: '...';\n  display: inline-block;\n  font-family: \"Ruda\", sans-serif;\n  font-size: 28px;\n  font-weight: 400;\n  letter-spacing: .6em;\n  position: relative;\n  top: -25px;\n}\n\n/* line 174, src/styles/common/_global.scss */\n\n.post-footer-hr {\n  height: 1px;\n  margin: 32px 0;\n  border: 0;\n  background-color: #ddd;\n}\n\n/* line 181, src/styles/common/_global.scss */\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n}\n\n/* line 187, src/styles/common/_global.scss */\n\nimg:not([src]) {\n  visibility: hidden;\n}\n\n/* line 192, src/styles/common/_global.scss */\n\ni {\n  vertical-align: middle;\n}\n\n/* line 197, src/styles/common/_global.scss */\n\ninput {\n  border: none;\n  outline: 0;\n}\n\n/* line 202, src/styles/common/_global.scss */\n\nol,\nul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0;\n}\n\n/* line 209, src/styles/common/_global.scss */\n\nmark {\n  background-color: transparent !important;\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#d7fdd3), to(#d7fdd3));\n  background-image: -webkit-linear-gradient(top, #d7fdd3, #d7fdd3);\n  background-image: -o-linear-gradient(top, #d7fdd3, #d7fdd3);\n  background-image: linear-gradient(to bottom, #d7fdd3, #d7fdd3);\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 215, src/styles/common/_global.scss */\n\nq {\n  color: rgba(0, 0, 0, 0.44);\n  display: block;\n  font-size: 28px;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.014em;\n  line-height: 1.48;\n  padding-left: 50px;\n  padding-top: 15px;\n  text-align: left;\n}\n\n/* line 227, src/styles/common/_global.scss */\n\nq::before,\nq::after {\n  display: none;\n}\n\n/* line 230, src/styles/common/_global.scss */\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n/* line 245, src/styles/common/_global.scss */\n\ntable th,\ntable td {\n  padding: 6px 13px;\n  border: 1px solid #dfe2e5;\n}\n\n/* line 251, src/styles/common/_global.scss */\n\ntable tr:nth-child(2n) {\n  background-color: #f6f8fa;\n}\n\n/* line 255, src/styles/common/_global.scss */\n\ntable th {\n  letter-spacing: 0.2px;\n  text-transform: uppercase;\n  font-weight: 600;\n}\n\n/* line 269, src/styles/common/_global.scss */\n\n.link--underline:active,\n.link--underline:focus,\n.link--underline:hover {\n  text-decoration: underline;\n}\n\n/* line 279, src/styles/common/_global.scss */\n\n.main {\n  margin-bottom: 4em;\n  min-height: 90vh;\n}\n\n/* line 281, src/styles/common/_global.scss */\n\n.main,\n.footer {\n  -webkit-transition: -webkit-transform .5s ease;\n  transition: -webkit-transform .5s ease;\n  -o-transition: -o-transform .5s ease;\n  transition: transform .5s ease;\n  transition: transform .5s ease, -webkit-transform .5s ease, -o-transform .5s ease;\n}\n\n/* line 286, src/styles/common/_global.scss */\n\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n}\n\n/* line 289, src/styles/common/_global.scss */\n\n.warning::before {\n  content: \"\\E002\";\n}\n\n/* line 292, src/styles/common/_global.scss */\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n}\n\n/* line 295, src/styles/common/_global.scss */\n\n.note::before {\n  content: \"\\E838\";\n}\n\n/* line 298, src/styles/common/_global.scss */\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n}\n\n/* line 301, src/styles/common/_global.scss */\n\n.success::before {\n  color: #00bfa5;\n  content: \"\\E86C\";\n}\n\n/* line 304, src/styles/common/_global.scss */\n\n.warning,\n.note,\n.success {\n  display: block;\n  font-size: 18px !important;\n  line-height: 1.58 !important;\n  margin-top: 28px;\n  padding: 12px 24px 12px 60px;\n}\n\n/* line 311, src/styles/common/_global.scss */\n\n.warning a,\n.note a,\n.success a {\n  color: inherit;\n  text-decoration: underline;\n}\n\n/* line 316, src/styles/common/_global.scss */\n\n.warning::before,\n.note::before,\n.success::before {\n  float: left;\n  font-size: 24px;\n  margin-left: -36px;\n  margin-top: -5px;\n}\n\n/* line 329, src/styles/common/_global.scss */\n\n.tag-description {\n  max-width: 500px;\n}\n\n/* line 330, src/styles/common/_global.scss */\n\n.tag.has--image {\n  min-height: 350px;\n}\n\n/* line 335, src/styles/common/_global.scss */\n\n.with-tooltip {\n  overflow: visible;\n  position: relative;\n}\n\n/* line 339, src/styles/common/_global.scss */\n\n.with-tooltip::after {\n  background: rgba(0, 0, 0, 0.85);\n  border-radius: 4px;\n  color: #fff;\n  content: attr(data-tooltip);\n  display: inline-block;\n  font-size: 12px;\n  font-weight: 600;\n  left: 50%;\n  line-height: 1.25;\n  min-width: 130px;\n  opacity: 0;\n  padding: 4px 8px;\n  pointer-events: none;\n  position: absolute;\n  text-align: center;\n  text-transform: none;\n  top: -30px;\n  will-change: opacity, transform;\n  z-index: 1;\n}\n\n/* line 361, src/styles/common/_global.scss */\n\n.with-tooltip:hover::after {\n  -webkit-animation: tooltip .1s ease-out both;\n       -o-animation: tooltip .1s ease-out both;\n          animation: tooltip .1s ease-out both;\n}\n\n/* line 368, src/styles/common/_global.scss */\n\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n}\n\n/* line 371, src/styles/common/_global.scss */\n\n.errorPage-link {\n  left: -5px;\n  padding: 24px 60px;\n  top: -6px;\n}\n\n/* line 377, src/styles/common/_global.scss */\n\n.errorPage-text {\n  margin-top: 60px;\n  white-space: pre-wrap;\n}\n\n/* line 382, src/styles/common/_global.scss */\n\n.errorPage-wrap {\n  color: rgba(0, 0, 0, 0.4);\n  padding: 7vw 4vw;\n}\n\n/* line 390, src/styles/common/_global.scss */\n\n.video-responsive {\n  display: block;\n  height: 0;\n  margin-top: 30px;\n  overflow: hidden;\n  padding: 0 0 56.25%;\n  position: relative;\n  width: 100%;\n}\n\n/* line 399, src/styles/common/_global.scss */\n\n.video-responsive iframe {\n  border: 0;\n  bottom: 0;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n/* line 409, src/styles/common/_global.scss */\n\n.video-responsive video {\n  border: 0;\n  bottom: 0;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n/* line 420, src/styles/common/_global.scss */\n\n.kg-embed-card .video-responsive {\n  margin-top: 0;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-facebook {\n  color: #3b5998 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-facebook,\n.sideNav-follow .i-facebook {\n  background-color: #3b5998 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-twitter {\n  color: #55acee !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-twitter,\n.sideNav-follow .i-twitter {\n  background-color: #55acee !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-google {\n  color: #dd4b39 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-google,\n.sideNav-follow .i-google {\n  background-color: #dd4b39 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-instagram {\n  color: #306088 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-instagram,\n.sideNav-follow .i-instagram {\n  background-color: #306088 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-youtube {\n  color: #e52d27 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-youtube,\n.sideNav-follow .i-youtube {\n  background-color: #e52d27 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-github {\n  color: #555 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-github,\n.sideNav-follow .i-github {\n  background-color: #555 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-linkedin {\n  color: #007bb6 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-linkedin,\n.sideNav-follow .i-linkedin {\n  background-color: #007bb6 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-spotify {\n  color: #2ebd59 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-spotify,\n.sideNav-follow .i-spotify {\n  background-color: #2ebd59 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-codepen {\n  color: #222 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-codepen,\n.sideNav-follow .i-codepen {\n  background-color: #222 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-behance {\n  color: #131418 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-behance,\n.sideNav-follow .i-behance {\n  background-color: #131418 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-dribbble {\n  color: #ea4c89 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-dribbble,\n.sideNav-follow .i-dribbble {\n  background-color: #ea4c89 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-flickr {\n  color: #0063dc !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-flickr,\n.sideNav-follow .i-flickr {\n  background-color: #0063dc !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-reddit {\n  color: #ff4500 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-reddit,\n.sideNav-follow .i-reddit {\n  background-color: #ff4500 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-pocket {\n  color: #f50057 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-pocket,\n.sideNav-follow .i-pocket {\n  background-color: #f50057 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-pinterest {\n  color: #bd081c !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-pinterest,\n.sideNav-follow .i-pinterest {\n  background-color: #bd081c !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-whatsapp {\n  color: #64d448 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-whatsapp,\n.sideNav-follow .i-whatsapp {\n  background-color: #64d448 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-telegram {\n  color: #08c !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-telegram,\n.sideNav-follow .i-telegram {\n  background-color: #08c !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-rss {\n  color: orange !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-rss,\n.sideNav-follow .i-rss {\n  background-color: orange !important;\n}\n\n/* line 449, src/styles/common/_global.scss */\n\n.rocket {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  width: 60px;\n  z-index: 5;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.rocket:hover svg path {\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n/* line 462, src/styles/common/_global.scss */\n\n.svgIcon {\n  display: inline-block;\n}\n\n/* line 466, src/styles/common/_global.scss */\n\nsvg {\n  height: auto;\n  width: 100%;\n}\n\n/* line 474, src/styles/common/_global.scss */\n\n.load-more {\n  max-width: 70% !important;\n}\n\n/* line 479, src/styles/common/_global.scss */\n\n.loadingBar {\n  background-color: #48e79a;\n  display: none;\n  height: 2px;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  -webkit-transform: translateX(100%);\n       -o-transform: translateX(100%);\n          transform: translateX(100%);\n  z-index: 800;\n}\n\n/* line 491, src/styles/common/_global.scss */\n\n.is-loading .loadingBar {\n  -webkit-animation: loading-bar 1s ease-in-out infinite;\n       -o-animation: loading-bar 1s ease-in-out infinite;\n          animation: loading-bar 1s ease-in-out infinite;\n  -webkit-animation-delay: .8s;\n       -o-animation-delay: .8s;\n          animation-delay: .8s;\n  display: block;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 500, src/styles/common/_global.scss */\n\n  blockquote {\n    margin-left: -5px;\n    font-size: 1.125rem;\n  }\n\n  /* line 502, src/styles/common/_global.scss */\n\n  .kg-image-card,\n  .kg-embed-card {\n    margin-right: -20px;\n    margin-left: -20px;\n  }\n}\n\n/* line 2, src/styles/components/_grid.scss */\n\n.extreme-container {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding: 0 16px;\n  width: 100%;\n}\n\n/* line 25, src/styles/components/_grid.scss */\n\n.col-left,\n.cc-video-left {\n  -ms-flex-preferred-size: 0;\n      flex-basis: 0;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  max-width: 100%;\n  padding-right: 10px;\n  padding-left: 10px;\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 38, src/styles/components/_grid.scss */\n\n  .col-left {\n    max-width: calc(100% - 340px);\n  }\n\n  /* line 39, src/styles/components/_grid.scss */\n\n  .cc-video-left {\n    max-width: calc(100% - 320px);\n  }\n\n  /* line 40, src/styles/components/_grid.scss */\n\n  .cc-video-right {\n    -ms-flex-preferred-size: 320px !important;\n        flex-basis: 320px !important;\n    max-width: 320px !important;\n  }\n\n  /* line 41, src/styles/components/_grid.scss */\n\n  body.is-article .col-left {\n    padding-right: 40px;\n  }\n}\n\n/* line 44, src/styles/components/_grid.scss */\n\n.col-right {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  padding-left: 10px;\n  padding-right: 10px;\n  width: 320px;\n}\n\n/* line 52, src/styles/components/_grid.scss */\n\n.row {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -webkit-box-flex: 0;\n      -ms-flex: 0 1 auto;\n          flex: 0 1 auto;\n  margin-left: -10px;\n  margin-right: -10px;\n}\n\n/* line 60, src/styles/components/_grid.scss */\n\n.row .col {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  padding-left: 10px;\n  padding-right: 10px;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s1 {\n  -ms-flex-preferred-size: 8.33333%;\n      flex-basis: 8.33333%;\n  max-width: 8.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s2 {\n  -ms-flex-preferred-size: 16.66667%;\n      flex-basis: 16.66667%;\n  max-width: 16.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s3 {\n  -ms-flex-preferred-size: 25%;\n      flex-basis: 25%;\n  max-width: 25%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s4 {\n  -ms-flex-preferred-size: 33.33333%;\n      flex-basis: 33.33333%;\n  max-width: 33.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s5 {\n  -ms-flex-preferred-size: 41.66667%;\n      flex-basis: 41.66667%;\n  max-width: 41.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s6 {\n  -ms-flex-preferred-size: 50%;\n      flex-basis: 50%;\n  max-width: 50%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s7 {\n  -ms-flex-preferred-size: 58.33333%;\n      flex-basis: 58.33333%;\n  max-width: 58.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s8 {\n  -ms-flex-preferred-size: 66.66667%;\n      flex-basis: 66.66667%;\n  max-width: 66.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s9 {\n  -ms-flex-preferred-size: 75%;\n      flex-basis: 75%;\n  max-width: 75%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s10 {\n  -ms-flex-preferred-size: 83.33333%;\n      flex-basis: 83.33333%;\n  max-width: 83.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s11 {\n  -ms-flex-preferred-size: 91.66667%;\n      flex-basis: 91.66667%;\n  max-width: 91.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s12 {\n  -ms-flex-preferred-size: 100%;\n      flex-basis: 100%;\n  max-width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m1 {\n    -ms-flex-preferred-size: 8.33333%;\n        flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m2 {\n    -ms-flex-preferred-size: 16.66667%;\n        flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m3 {\n    -ms-flex-preferred-size: 25%;\n        flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m4 {\n    -ms-flex-preferred-size: 33.33333%;\n        flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m5 {\n    -ms-flex-preferred-size: 41.66667%;\n        flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m6 {\n    -ms-flex-preferred-size: 50%;\n        flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m7 {\n    -ms-flex-preferred-size: 58.33333%;\n        flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m8 {\n    -ms-flex-preferred-size: 66.66667%;\n        flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m9 {\n    -ms-flex-preferred-size: 75%;\n        flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m10 {\n    -ms-flex-preferred-size: 83.33333%;\n        flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m11 {\n    -ms-flex-preferred-size: 91.66667%;\n        flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m12 {\n    -ms-flex-preferred-size: 100%;\n        flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l1 {\n    -ms-flex-preferred-size: 8.33333%;\n        flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l2 {\n    -ms-flex-preferred-size: 16.66667%;\n        flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l3 {\n    -ms-flex-preferred-size: 25%;\n        flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l4 {\n    -ms-flex-preferred-size: 33.33333%;\n        flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l5 {\n    -ms-flex-preferred-size: 41.66667%;\n        flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l6 {\n    -ms-flex-preferred-size: 50%;\n        flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l7 {\n    -ms-flex-preferred-size: 58.33333%;\n        flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l8 {\n    -ms-flex-preferred-size: 66.66667%;\n        flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l9 {\n    -ms-flex-preferred-size: 75%;\n        flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l10 {\n    -ms-flex-preferred-size: 83.33333%;\n        flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l11 {\n    -ms-flex-preferred-size: 91.66667%;\n        flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l12 {\n    -ms-flex-preferred-size: 100%;\n        flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n/* line 3, src/styles/common/_typography.scss */\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  color: inherit;\n  font-family: \"Ruda\", sans-serif;\n  font-weight: 600;\n  line-height: 1.1;\n  margin: 0;\n}\n\n/* line 10, src/styles/common/_typography.scss */\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  color: inherit;\n  line-height: inherit;\n}\n\n/* line 16, src/styles/common/_typography.scss */\n\nh1 {\n  font-size: 2rem;\n}\n\n/* line 17, src/styles/common/_typography.scss */\n\nh2 {\n  font-size: 1.875rem;\n}\n\n/* line 18, src/styles/common/_typography.scss */\n\nh3 {\n  font-size: 1.6rem;\n}\n\n/* line 19, src/styles/common/_typography.scss */\n\nh4 {\n  font-size: 1.4rem;\n}\n\n/* line 20, src/styles/common/_typography.scss */\n\nh5 {\n  font-size: 1.2rem;\n}\n\n/* line 21, src/styles/common/_typography.scss */\n\nh6 {\n  font-size: 1rem;\n}\n\n/* line 23, src/styles/common/_typography.scss */\n\np {\n  margin: 0;\n}\n\n/* line 2, src/styles/common/_utilities.scss */\n\n.u-textColorNormal {\n  color: #999999 !important;\n  fill: #999999 !important;\n}\n\n/* line 9, src/styles/common/_utilities.scss */\n\n.u-textColorWhite {\n  color: #fff !important;\n  fill: #fff !important;\n}\n\n/* line 14, src/styles/common/_utilities.scss */\n\n.u-hoverColorNormal:hover {\n  color: rgba(0, 0, 0, 0.6);\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n/* line 19, src/styles/common/_utilities.scss */\n\n.u-accentColor--iconNormal {\n  color: #1C9963;\n  fill: #1C9963;\n}\n\n/* line 25, src/styles/common/_utilities.scss */\n\n.u-bgColor {\n  background-color: var(--primary-color);\n}\n\n/* line 30, src/styles/common/_utilities.scss */\n\n.u-relative {\n  position: relative;\n}\n\n/* line 31, src/styles/common/_utilities.scss */\n\n.u-absolute {\n  position: absolute;\n}\n\n/* line 33, src/styles/common/_utilities.scss */\n\n.u-fixed {\n  position: fixed !important;\n}\n\n/* line 35, src/styles/common/_utilities.scss */\n\n.u-block {\n  display: block !important;\n}\n\n/* line 36, src/styles/common/_utilities.scss */\n\n.u-inlineBlock {\n  display: inline-block;\n}\n\n/* line 39, src/styles/common/_utilities.scss */\n\n.u-backgroundDark {\n  background-color: #0d0f10;\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n\n/* line 50, src/styles/common/_utilities.scss */\n\n.u-gradient {\n  background: -webkit-gradient(linear, left top, left bottom, color-stop(20%, transparent), to(#000));\n  background: -webkit-linear-gradient(top, transparent 20%, #000 100%);\n  background: -o-linear-gradient(top, transparent 20%, #000 100%);\n  background: linear-gradient(to bottom, transparent 20%, #000 100%);\n  bottom: 0;\n  height: 90%;\n  left: 0;\n  position: absolute;\n  right: 0;\n  z-index: 1;\n}\n\n/* line 61, src/styles/common/_utilities.scss */\n\n.zindex1 {\n  z-index: 1;\n}\n\n/* line 62, src/styles/common/_utilities.scss */\n\n.zindex2 {\n  z-index: 2;\n}\n\n/* line 63, src/styles/common/_utilities.scss */\n\n.zindex3 {\n  z-index: 3;\n}\n\n/* line 64, src/styles/common/_utilities.scss */\n\n.zindex4 {\n  z-index: 4;\n}\n\n/* line 67, src/styles/common/_utilities.scss */\n\n.u-backgroundWhite {\n  background-color: #fafafa;\n}\n\n/* line 68, src/styles/common/_utilities.scss */\n\n.u-backgroundColorGrayLight {\n  background-color: #f0f0f0 !important;\n}\n\n/* line 71, src/styles/common/_utilities.scss */\n\n.u-clear::after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n/* line 78, src/styles/common/_utilities.scss */\n\n.u-fontSizeMicro {\n  font-size: 11px;\n}\n\n/* line 79, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmallest {\n  font-size: 12px;\n}\n\n/* line 80, src/styles/common/_utilities.scss */\n\n.u-fontSize13 {\n  font-size: 13px;\n}\n\n/* line 81, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmaller {\n  font-size: 14px;\n}\n\n/* line 82, src/styles/common/_utilities.scss */\n\n.u-fontSize15 {\n  font-size: 15px;\n}\n\n/* line 83, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmall {\n  font-size: 16px;\n}\n\n/* line 84, src/styles/common/_utilities.scss */\n\n.u-fontSizeBase {\n  font-size: 18px;\n}\n\n/* line 85, src/styles/common/_utilities.scss */\n\n.u-fontSize20 {\n  font-size: 20px;\n}\n\n/* line 86, src/styles/common/_utilities.scss */\n\n.u-fontSize21 {\n  font-size: 21px;\n}\n\n/* line 87, src/styles/common/_utilities.scss */\n\n.u-fontSize22 {\n  font-size: 22px;\n}\n\n/* line 88, src/styles/common/_utilities.scss */\n\n.u-fontSizeLarge {\n  font-size: 24px;\n}\n\n/* line 89, src/styles/common/_utilities.scss */\n\n.u-fontSize26 {\n  font-size: 26px;\n}\n\n/* line 90, src/styles/common/_utilities.scss */\n\n.u-fontSize28 {\n  font-size: 28px;\n}\n\n/* line 91, src/styles/common/_utilities.scss */\n\n.u-fontSizeLarger,\n.media-type {\n  font-size: 32px;\n}\n\n/* line 92, src/styles/common/_utilities.scss */\n\n.u-fontSize36 {\n  font-size: 36px;\n}\n\n/* line 93, src/styles/common/_utilities.scss */\n\n.u-fontSize40 {\n  font-size: 40px;\n}\n\n/* line 94, src/styles/common/_utilities.scss */\n\n.u-fontSizeLargest {\n  font-size: 44px;\n}\n\n/* line 95, src/styles/common/_utilities.scss */\n\n.u-fontSizeJumbo {\n  font-size: 50px;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 98, src/styles/common/_utilities.scss */\n\n  .u-md-fontSizeBase {\n    font-size: 18px;\n  }\n\n  /* line 99, src/styles/common/_utilities.scss */\n\n  .u-md-fontSize22 {\n    font-size: 22px;\n  }\n\n  /* line 100, src/styles/common/_utilities.scss */\n\n  .u-md-fontSizeLarger {\n    font-size: 32px;\n  }\n}\n\n/* line 116, src/styles/common/_utilities.scss */\n\n.u-fontWeightThin {\n  font-weight: 300;\n}\n\n/* line 117, src/styles/common/_utilities.scss */\n\n.u-fontWeightNormal {\n  font-weight: 400;\n}\n\n/* line 119, src/styles/common/_utilities.scss */\n\n.u-fontWeightSemibold {\n  font-weight: 600 !important;\n}\n\n/* line 120, src/styles/common/_utilities.scss */\n\n.u-fontWeightBold {\n  font-weight: 700;\n}\n\n/* line 121, src/styles/common/_utilities.scss */\n\n.u-fontWeightBolder {\n  font-weight: 900;\n}\n\n/* line 123, src/styles/common/_utilities.scss */\n\n.u-textUppercase {\n  text-transform: uppercase;\n}\n\n/* line 124, src/styles/common/_utilities.scss */\n\n.u-textCapitalize {\n  text-transform: capitalize;\n}\n\n/* line 125, src/styles/common/_utilities.scss */\n\n.u-textAlignCenter {\n  text-align: center;\n}\n\n/* line 127, src/styles/common/_utilities.scss */\n\n.u-noWrapWithEllipsis {\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important;\n}\n\n/* line 134, src/styles/common/_utilities.scss */\n\n.u-marginAuto {\n  margin-left: auto;\n  margin-right: auto;\n}\n\n/* line 135, src/styles/common/_utilities.scss */\n\n.u-marginTop20 {\n  margin-top: 20px;\n}\n\n/* line 136, src/styles/common/_utilities.scss */\n\n.u-marginTop30 {\n  margin-top: 30px;\n}\n\n/* line 137, src/styles/common/_utilities.scss */\n\n.u-marginBottom10 {\n  margin-bottom: 10px;\n}\n\n/* line 138, src/styles/common/_utilities.scss */\n\n.u-marginBottom15 {\n  margin-bottom: 15px;\n}\n\n/* line 139, src/styles/common/_utilities.scss */\n\n.u-marginBottom20 {\n  margin-bottom: 20px !important;\n}\n\n/* line 140, src/styles/common/_utilities.scss */\n\n.u-marginBottom30 {\n  margin-bottom: 30px;\n}\n\n/* line 141, src/styles/common/_utilities.scss */\n\n.u-marginBottom40 {\n  margin-bottom: 40px;\n}\n\n/* line 144, src/styles/common/_utilities.scss */\n\n.u-padding0 {\n  padding: 0 !important;\n}\n\n/* line 145, src/styles/common/_utilities.scss */\n\n.u-padding20 {\n  padding: 20px;\n}\n\n/* line 146, src/styles/common/_utilities.scss */\n\n.u-padding15 {\n  padding: 15px !important;\n}\n\n/* line 147, src/styles/common/_utilities.scss */\n\n.u-paddingBottom2 {\n  padding-bottom: 2px;\n}\n\n/* line 148, src/styles/common/_utilities.scss */\n\n.u-paddingBottom30 {\n  padding-bottom: 30px;\n}\n\n/* line 149, src/styles/common/_utilities.scss */\n\n.u-paddingBottom20 {\n  padding-bottom: 20px;\n}\n\n/* line 150, src/styles/common/_utilities.scss */\n\n.u-paddingRight10 {\n  padding-right: 10px;\n}\n\n/* line 151, src/styles/common/_utilities.scss */\n\n.u-paddingLeft15 {\n  padding-left: 15px;\n}\n\n/* line 153, src/styles/common/_utilities.scss */\n\n.u-paddingTop2 {\n  padding-top: 2px;\n}\n\n/* line 154, src/styles/common/_utilities.scss */\n\n.u-paddingTop5 {\n  padding-top: 5px;\n}\n\n/* line 155, src/styles/common/_utilities.scss */\n\n.u-paddingTop10 {\n  padding-top: 10px;\n}\n\n/* line 156, src/styles/common/_utilities.scss */\n\n.u-paddingTop15 {\n  padding-top: 15px;\n}\n\n/* line 157, src/styles/common/_utilities.scss */\n\n.u-paddingTop20 {\n  padding-top: 20px;\n}\n\n/* line 158, src/styles/common/_utilities.scss */\n\n.u-paddingTop30 {\n  padding-top: 30px;\n}\n\n/* line 160, src/styles/common/_utilities.scss */\n\n.u-paddingBottom15 {\n  padding-bottom: 15px;\n}\n\n/* line 162, src/styles/common/_utilities.scss */\n\n.u-paddingRight20 {\n  padding-right: 20px;\n}\n\n/* line 163, src/styles/common/_utilities.scss */\n\n.u-paddingLeft20 {\n  padding-left: 20px;\n}\n\n/* line 165, src/styles/common/_utilities.scss */\n\n.u-contentTitle {\n  font-family: \"Ruda\", sans-serif;\n  font-style: normal;\n  font-weight: 900;\n  letter-spacing: -.028em;\n}\n\n/* line 173, src/styles/common/_utilities.scss */\n\n.u-lineHeight1 {\n  line-height: 1;\n}\n\n/* line 174, src/styles/common/_utilities.scss */\n\n.u-lineHeightTight {\n  line-height: 1.2;\n}\n\n/* line 177, src/styles/common/_utilities.scss */\n\n.u-overflowHidden {\n  overflow: hidden;\n}\n\n/* line 180, src/styles/common/_utilities.scss */\n\n.u-floatRight {\n  float: right;\n}\n\n/* line 181, src/styles/common/_utilities.scss */\n\n.u-floatLeft {\n  float: left;\n}\n\n/* line 184, src/styles/common/_utilities.scss */\n\n.u-flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n/* line 185, src/styles/common/_utilities.scss */\n\n.u-flexCenter,\n.media-type {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n/* line 186, src/styles/common/_utilities.scss */\n\n.u-flexContentCenter,\n.media-type {\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n/* line 188, src/styles/common/_utilities.scss */\n\n.u-flex1 {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n}\n\n/* line 189, src/styles/common/_utilities.scss */\n\n.u-flex0 {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n}\n\n/* line 190, src/styles/common/_utilities.scss */\n\n.u-flexWrap {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n\n/* line 192, src/styles/common/_utilities.scss */\n\n.u-flexColumn {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n/* line 198, src/styles/common/_utilities.scss */\n\n.u-flexEnd {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n\n/* line 203, src/styles/common/_utilities.scss */\n\n.u-flexColumnTop {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n}\n\n/* line 210, src/styles/common/_utilities.scss */\n\n.u-backgroundSizeCover {\n  background-origin: border-box;\n  background-position: center;\n  background-size: cover;\n}\n\n/* line 217, src/styles/common/_utilities.scss */\n\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 20px;\n  padding-right: 20px;\n}\n\n/* line 224, src/styles/common/_utilities.scss */\n\n.u-maxWidth1200 {\n  max-width: 1200px;\n}\n\n/* line 225, src/styles/common/_utilities.scss */\n\n.u-maxWidth1000 {\n  max-width: 1000px;\n}\n\n/* line 226, src/styles/common/_utilities.scss */\n\n.u-maxWidth740 {\n  max-width: 740px;\n}\n\n/* line 227, src/styles/common/_utilities.scss */\n\n.u-maxWidth1040 {\n  max-width: 1040px;\n}\n\n/* line 228, src/styles/common/_utilities.scss */\n\n.u-sizeFullWidth {\n  width: 100%;\n}\n\n/* line 229, src/styles/common/_utilities.scss */\n\n.u-sizeFullHeight {\n  height: 100%;\n}\n\n/* line 232, src/styles/common/_utilities.scss */\n\n.u-borderLighter {\n  border: 1px solid rgba(0, 0, 0, 0.15);\n}\n\n/* line 233, src/styles/common/_utilities.scss */\n\n.u-round,\n.avatar-image,\n.media-type {\n  border-radius: 50%;\n}\n\n/* line 234, src/styles/common/_utilities.scss */\n\n.u-borderRadius2 {\n  border-radius: 2px;\n}\n\n/* line 236, src/styles/common/_utilities.scss */\n\n.u-boxShadowBottom {\n  -webkit-box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.05);\n          box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.05);\n}\n\n/* line 241, src/styles/common/_utilities.scss */\n\n.u-height540 {\n  height: 540px;\n}\n\n/* line 242, src/styles/common/_utilities.scss */\n\n.u-height280 {\n  height: 280px;\n}\n\n/* line 243, src/styles/common/_utilities.scss */\n\n.u-height260 {\n  height: 260px;\n}\n\n/* line 244, src/styles/common/_utilities.scss */\n\n.u-height100 {\n  height: 100px;\n}\n\n/* line 245, src/styles/common/_utilities.scss */\n\n.u-borderBlackLightest {\n  border: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n/* line 248, src/styles/common/_utilities.scss */\n\n.u-hide {\n  display: none !important;\n}\n\n/* line 251, src/styles/common/_utilities.scss */\n\n.u-card {\n  background: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.09);\n  border-radius: 3px;\n  -webkit-box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n          box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  margin-bottom: 10px;\n  padding: 10px 20px 15px;\n}\n\n/* line 262, src/styles/common/_utilities.scss */\n\n.title-line {\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n/* line 267, src/styles/common/_utilities.scss */\n\n.title-line::before {\n  content: '';\n  background: rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  position: absolute;\n  left: 0;\n  bottom: 50%;\n  width: 100%;\n  height: 1px;\n  z-index: 0;\n}\n\n/* line 281, src/styles/common/_utilities.scss */\n\n.u-oblique {\n  background-color: var(--composite-color);\n  color: #fff;\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 700;\n  line-height: 1;\n  padding: 5px 13px;\n  text-transform: uppercase;\n  -webkit-transform: skewX(-15deg);\n       -o-transform: skewX(-15deg);\n          transform: skewX(-15deg);\n}\n\n/* line 293, src/styles/common/_utilities.scss */\n\n.no-avatar {\n  background-image: url(" + escape(__webpack_require__(/*! ./../images/avatar.png */ 49)) + ") !important;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 298, src/styles/common/_utilities.scss */\n\n  .u-hide-before-md {\n    display: none !important;\n  }\n\n  /* line 299, src/styles/common/_utilities.scss */\n\n  .u-md-heightAuto {\n    height: auto;\n  }\n\n  /* line 300, src/styles/common/_utilities.scss */\n\n  .u-md-height170 {\n    height: 170px;\n  }\n\n  /* line 301, src/styles/common/_utilities.scss */\n\n  .u-md-relative {\n    position: relative;\n  }\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 304, src/styles/common/_utilities.scss */\n\n  .u-hide-before-lg {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 307, src/styles/common/_utilities.scss */\n\n  .u-hide-after-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 309, src/styles/common/_utilities.scss */\n\n  .u-hide-after-lg {\n    display: none !important;\n  }\n}\n\n/* line 1, src/styles/components/_form.scss */\n\n.button {\n  background: transparent;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  color: rgba(0, 0, 0, 0.44);\n  cursor: pointer;\n  display: inline-block;\n  font-family: \"Ruda\", sans-serif;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  height: 37px;\n  letter-spacing: 0;\n  line-height: 35px;\n  padding: 0 16px;\n  position: relative;\n  text-align: center;\n  text-decoration: none;\n  text-rendering: optimizeLegibility;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n/* line 25, src/styles/components/_form.scss */\n\n.button--chromeless {\n  border-radius: 0;\n  border-width: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: rgba(0, 0, 0, 0.44);\n  height: auto;\n  line-height: inherit;\n  padding: 0;\n  text-align: left;\n  vertical-align: baseline;\n  white-space: normal;\n}\n\n/* line 37, src/styles/components/_form.scss */\n\n.button--chromeless:active,\n.button--chromeless:hover,\n.button--chromeless:focus {\n  border-width: 0;\n  color: rgba(0, 0, 0, 0.6);\n}\n\n/* line 45, src/styles/components/_form.scss */\n\n.button--large {\n  font-size: 15px;\n  height: 44px;\n  line-height: 42px;\n  padding: 0 18px;\n}\n\n/* line 52, src/styles/components/_form.scss */\n\n.button--dark {\n  background: rgba(0, 0, 0, 0.84);\n  border-color: rgba(0, 0, 0, 0.84);\n  color: rgba(255, 255, 255, 0.97);\n}\n\n/* line 57, src/styles/components/_form.scss */\n\n.button--dark:hover {\n  background: #1C9963;\n  border-color: #1C9963;\n}\n\n/* line 65, src/styles/components/_form.scss */\n\n.button--primary {\n  border-color: #1C9963;\n  color: #1C9963;\n}\n\n/* line 70, src/styles/components/_form.scss */\n\n.button--large.button--chromeless,\n.button--large.button--link {\n  padding: 0;\n}\n\n/* line 76, src/styles/components/_form.scss */\n\n.buttonSet > .button {\n  margin-right: 8px;\n  vertical-align: middle;\n}\n\n/* line 81, src/styles/components/_form.scss */\n\n.buttonSet > .button:last-child {\n  margin-right: 0;\n}\n\n/* line 85, src/styles/components/_form.scss */\n\n.buttonSet .button--chromeless {\n  height: 37px;\n  line-height: 35px;\n}\n\n/* line 90, src/styles/components/_form.scss */\n\n.buttonSet .button--large.button--chromeless,\n.buttonSet .button--large.button--link {\n  height: 44px;\n  line-height: 42px;\n}\n\n/* line 96, src/styles/components/_form.scss */\n\n.buttonSet > .button--chromeless:not(.button--circle) {\n  margin-right: 0;\n  padding-right: 8px;\n}\n\n/* line 101, src/styles/components/_form.scss */\n\n.buttonSet > .button--chromeless:last-child {\n  padding-right: 0;\n}\n\n/* line 105, src/styles/components/_form.scss */\n\n.buttonSet > .button--chromeless + .button--chromeless:not(.button--circle) {\n  margin-left: 0;\n  padding-left: 8px;\n}\n\n/* line 111, src/styles/components/_form.scss */\n\n.button--circle {\n  background-image: none !important;\n  border-radius: 50%;\n  color: #fff;\n  height: 40px;\n  line-height: 38px;\n  padding: 0;\n  text-decoration: none;\n  width: 40px;\n}\n\n/* line 124, src/styles/components/_form.scss */\n\n.tag-button {\n  background: rgba(0, 0, 0, 0.05);\n  border: none;\n  color: rgba(0, 0, 0, 0.68);\n  font-weight: 700;\n  margin: 0 8px 8px 0;\n}\n\n/* line 131, src/styles/components/_form.scss */\n\n.tag-button:hover {\n  background: rgba(0, 0, 0, 0.1);\n  color: rgba(0, 0, 0, 0.68);\n}\n\n/* line 139, src/styles/components/_form.scss */\n\n.button--dark-line {\n  border: 1px solid #000;\n  color: #000;\n  display: block;\n  font-weight: 600;\n  margin: 50px auto 0;\n  max-width: 300px;\n  text-transform: uppercase;\n  -webkit-transition: color 0.3s ease, -webkit-box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  transition: color 0.3s ease, -webkit-box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  -o-transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955), -webkit-box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n}\n\n/* line 149, src/styles/components/_form.scss */\n\n.button--dark-line:hover {\n  color: #fff;\n  -webkit-box-shadow: inset 0 -50px 8px -4px #000;\n          box-shadow: inset 0 -50px 8px -4px #000;\n}\n\n@font-face {\n  font-family: 'mapache';\n  src: url(" + escape(__webpack_require__(/*! ./../fonts/mapache.eot */ 21)) + ");\n  src: url(" + escape(__webpack_require__(/*! ./../fonts/mapache.eot */ 21)) + ") format(\"embedded-opentype\"), url(" + escape(__webpack_require__(/*! ./../fonts/mapache.ttf */ 50)) + ") format(\"truetype\"), url(" + escape(__webpack_require__(/*! ./../fonts/mapache.woff */ 51)) + ") format(\"woff\"), url(" + escape(__webpack_require__(/*! ./../fonts/mapache.svg */ 52)) + ") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n\n/* line 17, src/styles/components/_icons.scss */\n\n.i-tag:before {\n  content: \"\\E911\";\n}\n\n/* line 20, src/styles/components/_icons.scss */\n\n.i-discord:before {\n  content: \"\\E90A\";\n}\n\n/* line 23, src/styles/components/_icons.scss */\n\n.i-arrow-round-next:before {\n  content: \"\\E90C\";\n}\n\n/* line 26, src/styles/components/_icons.scss */\n\n.i-arrow-round-prev:before {\n  content: \"\\E90D\";\n}\n\n/* line 29, src/styles/components/_icons.scss */\n\n.i-arrow-round-up:before {\n  content: \"\\E90E\";\n}\n\n/* line 32, src/styles/components/_icons.scss */\n\n.i-arrow-round-down:before {\n  content: \"\\E90F\";\n}\n\n/* line 35, src/styles/components/_icons.scss */\n\n.i-photo:before {\n  content: \"\\E90B\";\n}\n\n/* line 38, src/styles/components/_icons.scss */\n\n.i-send:before {\n  content: \"\\E909\";\n}\n\n/* line 41, src/styles/components/_icons.scss */\n\n.i-audio:before {\n  content: \"\\E901\";\n}\n\n/* line 44, src/styles/components/_icons.scss */\n\n.i-rocket:before {\n  content: \"\\E902\";\n  color: #999;\n}\n\n/* line 48, src/styles/components/_icons.scss */\n\n.i-comments-line:before {\n  content: \"\\E900\";\n}\n\n/* line 51, src/styles/components/_icons.scss */\n\n.i-globe:before {\n  content: \"\\E906\";\n}\n\n/* line 54, src/styles/components/_icons.scss */\n\n.i-star:before {\n  content: \"\\E907\";\n}\n\n/* line 57, src/styles/components/_icons.scss */\n\n.i-link:before {\n  content: \"\\E908\";\n}\n\n/* line 60, src/styles/components/_icons.scss */\n\n.i-star-line:before {\n  content: \"\\E903\";\n}\n\n/* line 63, src/styles/components/_icons.scss */\n\n.i-more:before {\n  content: \"\\E904\";\n}\n\n/* line 66, src/styles/components/_icons.scss */\n\n.i-search:before {\n  content: \"\\E905\";\n}\n\n/* line 69, src/styles/components/_icons.scss */\n\n.i-chat:before {\n  content: \"\\E910\";\n}\n\n/* line 72, src/styles/components/_icons.scss */\n\n.i-arrow-left:before {\n  content: \"\\E314\";\n}\n\n/* line 75, src/styles/components/_icons.scss */\n\n.i-arrow-right:before {\n  content: \"\\E315\";\n}\n\n/* line 78, src/styles/components/_icons.scss */\n\n.i-play:before {\n  content: \"\\E037\";\n}\n\n/* line 81, src/styles/components/_icons.scss */\n\n.i-location:before {\n  content: \"\\E8B4\";\n}\n\n/* line 84, src/styles/components/_icons.scss */\n\n.i-check-circle:before {\n  content: \"\\E86C\";\n}\n\n/* line 87, src/styles/components/_icons.scss */\n\n.i-close:before {\n  content: \"\\E5CD\";\n}\n\n/* line 90, src/styles/components/_icons.scss */\n\n.i-favorite:before {\n  content: \"\\E87D\";\n}\n\n/* line 93, src/styles/components/_icons.scss */\n\n.i-warning:before {\n  content: \"\\E002\";\n}\n\n/* line 96, src/styles/components/_icons.scss */\n\n.i-rss:before {\n  content: \"\\E0E5\";\n}\n\n/* line 99, src/styles/components/_icons.scss */\n\n.i-share:before {\n  content: \"\\E80D\";\n}\n\n/* line 102, src/styles/components/_icons.scss */\n\n.i-email:before {\n  content: \"\\F0E0\";\n}\n\n/* line 105, src/styles/components/_icons.scss */\n\n.i-google:before {\n  content: \"\\F1A0\";\n}\n\n/* line 108, src/styles/components/_icons.scss */\n\n.i-telegram:before {\n  content: \"\\F2C6\";\n}\n\n/* line 111, src/styles/components/_icons.scss */\n\n.i-reddit:before {\n  content: \"\\F281\";\n}\n\n/* line 114, src/styles/components/_icons.scss */\n\n.i-twitter:before {\n  content: \"\\F099\";\n}\n\n/* line 117, src/styles/components/_icons.scss */\n\n.i-github:before {\n  content: \"\\F09B\";\n}\n\n/* line 120, src/styles/components/_icons.scss */\n\n.i-linkedin:before {\n  content: \"\\F0E1\";\n}\n\n/* line 123, src/styles/components/_icons.scss */\n\n.i-youtube:before {\n  content: \"\\F16A\";\n}\n\n/* line 126, src/styles/components/_icons.scss */\n\n.i-stack-overflow:before {\n  content: \"\\F16C\";\n}\n\n/* line 129, src/styles/components/_icons.scss */\n\n.i-instagram:before {\n  content: \"\\F16D\";\n}\n\n/* line 132, src/styles/components/_icons.scss */\n\n.i-flickr:before {\n  content: \"\\F16E\";\n}\n\n/* line 135, src/styles/components/_icons.scss */\n\n.i-dribbble:before {\n  content: \"\\F17D\";\n}\n\n/* line 138, src/styles/components/_icons.scss */\n\n.i-behance:before {\n  content: \"\\F1B4\";\n}\n\n/* line 141, src/styles/components/_icons.scss */\n\n.i-spotify:before {\n  content: \"\\F1BC\";\n}\n\n/* line 144, src/styles/components/_icons.scss */\n\n.i-codepen:before {\n  content: \"\\F1CB\";\n}\n\n/* line 147, src/styles/components/_icons.scss */\n\n.i-facebook:before {\n  content: \"\\F230\";\n}\n\n/* line 150, src/styles/components/_icons.scss */\n\n.i-pinterest:before {\n  content: \"\\F231\";\n}\n\n/* line 153, src/styles/components/_icons.scss */\n\n.i-whatsapp:before {\n  content: \"\\F232\";\n}\n\n/* line 156, src/styles/components/_icons.scss */\n\n.i-snapchat:before {\n  content: \"\\F2AC\";\n}\n\n/* line 2, src/styles/components/_animated.scss */\n\n.animated {\n  -webkit-animation-duration: 1s;\n       -o-animation-duration: 1s;\n          animation-duration: 1s;\n  -webkit-animation-fill-mode: both;\n       -o-animation-fill-mode: both;\n          animation-fill-mode: both;\n}\n\n/* line 6, src/styles/components/_animated.scss */\n\n.animated.infinite {\n  -webkit-animation-iteration-count: infinite;\n       -o-animation-iteration-count: infinite;\n          animation-iteration-count: infinite;\n}\n\n/* line 12, src/styles/components/_animated.scss */\n\n.bounceIn {\n  -webkit-animation-name: bounceIn;\n       -o-animation-name: bounceIn;\n          animation-name: bounceIn;\n}\n\n/* line 13, src/styles/components/_animated.scss */\n\n.bounceInDown {\n  -webkit-animation-name: bounceInDown;\n       -o-animation-name: bounceInDown;\n          animation-name: bounceInDown;\n}\n\n/* line 14, src/styles/components/_animated.scss */\n\n.pulse {\n  -webkit-animation-name: pulse;\n       -o-animation-name: pulse;\n          animation-name: pulse;\n}\n\n/* line 15, src/styles/components/_animated.scss */\n\n.slideInUp {\n  -webkit-animation-name: slideInUp;\n       -o-animation-name: slideInUp;\n          animation-name: slideInUp;\n}\n\n/* line 16, src/styles/components/_animated.scss */\n\n.slideOutDown {\n  -webkit-animation-name: slideOutDown;\n       -o-animation-name: slideOutDown;\n          animation-name: slideOutDown;\n}\n\n@-webkit-keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n            transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n            transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n            transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n            transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n            transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-o-keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n       animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n         -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n            transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n            transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n            transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n            transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n            transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-webkit-keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(215, 610, 355, 1);\n            animation-timing-function: cubic-bezier(215, 610, 355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n            transform: none;\n  }\n}\n\n@-o-keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -o-animation-timing-function: cubic-bezier(215, 610, 355, 1);\n       animation-timing-function: cubic-bezier(215, 610, 355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -o-transform: none;\n       transform: none;\n  }\n}\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(215, 610, 355, 1);\n         -o-animation-timing-function: cubic-bezier(215, 610, 355, 1);\n            animation-timing-function: cubic-bezier(215, 610, 355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n         -o-transform: none;\n            transform: none;\n  }\n}\n\n@-webkit-keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.2, 1.2, 1.2);\n            transform: scale3d(1.2, 1.2, 1.2);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-o-keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    transform: scale3d(1.2, 1.2, 1.2);\n  }\n\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.2, 1.2, 1.2);\n            transform: scale3d(1.2, 1.2, 1.2);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-webkit-keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -webkit-transform: translateY(0);\n            transform: translateY(0);\n  }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translateY(10px);\n            transform: translateY(10px);\n  }\n}\n\n@-o-keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -o-transform: translateY(0);\n       transform: translateY(0);\n  }\n\n  100% {\n    opacity: 0;\n    -o-transform: translateY(10px);\n       transform: translateY(10px);\n  }\n}\n\n@keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -webkit-transform: translateY(0);\n         -o-transform: translateY(0);\n            transform: translateY(0);\n  }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translateY(10px);\n         -o-transform: translateY(10px);\n            transform: translateY(10px);\n  }\n}\n\n@-webkit-keyframes opacity {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@-o-keyframes opacity {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@keyframes opacity {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@-webkit-keyframes spin {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@-o-keyframes spin {\n  from {\n    -o-transform: rotate(0deg);\n       transform: rotate(0deg);\n  }\n\n  to {\n    -o-transform: rotate(360deg);\n       transform: rotate(360deg);\n  }\n}\n\n@keyframes spin {\n  from {\n    -webkit-transform: rotate(0deg);\n         -o-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n         -o-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@-webkit-keyframes tooltip {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate(-50%, 6px);\n            transform: translate(-50%, 6px);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: translate(-50%, 0);\n            transform: translate(-50%, 0);\n  }\n}\n\n@-o-keyframes tooltip {\n  0% {\n    opacity: 0;\n    -o-transform: translate(-50%, 6px);\n       transform: translate(-50%, 6px);\n  }\n\n  100% {\n    opacity: 1;\n    -o-transform: translate(-50%, 0);\n       transform: translate(-50%, 0);\n  }\n}\n\n@keyframes tooltip {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate(-50%, 6px);\n         -o-transform: translate(-50%, 6px);\n            transform: translate(-50%, 6px);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: translate(-50%, 0);\n         -o-transform: translate(-50%, 0);\n            transform: translate(-50%, 0);\n  }\n}\n\n@-webkit-keyframes loading-bar {\n  0% {\n    -webkit-transform: translateX(-100%);\n            transform: translateX(-100%);\n  }\n\n  40% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  60% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  100% {\n    -webkit-transform: translateX(100%);\n            transform: translateX(100%);\n  }\n}\n\n@-o-keyframes loading-bar {\n  0% {\n    -o-transform: translateX(-100%);\n       transform: translateX(-100%);\n  }\n\n  40% {\n    -o-transform: translateX(0);\n       transform: translateX(0);\n  }\n\n  60% {\n    -o-transform: translateX(0);\n       transform: translateX(0);\n  }\n\n  100% {\n    -o-transform: translateX(100%);\n       transform: translateX(100%);\n  }\n}\n\n@keyframes loading-bar {\n  0% {\n    -webkit-transform: translateX(-100%);\n         -o-transform: translateX(-100%);\n            transform: translateX(-100%);\n  }\n\n  40% {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  60% {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  100% {\n    -webkit-transform: translateX(100%);\n         -o-transform: translateX(100%);\n            transform: translateX(100%);\n  }\n}\n\n@-webkit-keyframes arrow-move-right {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -webkit-transform: translateX(-100%);\n            transform: translateX(-100%);\n    opacity: 0;\n  }\n\n  100% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@-o-keyframes arrow-move-right {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -o-transform: translateX(-100%);\n       transform: translateX(-100%);\n    opacity: 0;\n  }\n\n  100% {\n    -o-transform: translateX(0);\n       transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@keyframes arrow-move-right {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -webkit-transform: translateX(-100%);\n         -o-transform: translateX(-100%);\n            transform: translateX(-100%);\n    opacity: 0;\n  }\n\n  100% {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@-webkit-keyframes arrow-move-left {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -webkit-transform: translateX(100%);\n            transform: translateX(100%);\n    opacity: 0;\n  }\n\n  100% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@-o-keyframes arrow-move-left {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -o-transform: translateX(100%);\n       transform: translateX(100%);\n    opacity: 0;\n  }\n\n  100% {\n    -o-transform: translateX(0);\n       transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@keyframes arrow-move-left {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -webkit-transform: translateX(100%);\n         -o-transform: translateX(100%);\n            transform: translateX(100%);\n    opacity: 0;\n  }\n\n  100% {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@-webkit-keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n            transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n}\n\n@-o-keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n            transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n}\n\n@-webkit-keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 20%, 0);\n            transform: translate3d(0, 20%, 0);\n  }\n}\n\n@-o-keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0);\n  }\n}\n\n@keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 20%, 0);\n            transform: translate3d(0, 20%, 0);\n  }\n}\n\n/* line 4, src/styles/layouts/_header.scss */\n\n.header-logo,\n.menu--toggle,\n.search-toggle {\n  z-index: 15;\n}\n\n/* line 10, src/styles/layouts/_header.scss */\n\n.header {\n  -webkit-box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n          box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n  padding: 0 16px;\n  position: -webkit-sticky;\n  position: sticky;\n  top: 0;\n  -webkit-transition: all 0.4s ease-in-out;\n  -o-transition: all 0.4s ease-in-out;\n  transition: all 0.4s ease-in-out;\n  z-index: 10;\n}\n\n/* line 18, src/styles/layouts/_header.scss */\n\n.header-wrap {\n  height: 50px;\n}\n\n/* line 20, src/styles/layouts/_header.scss */\n\n.header-logo {\n  color: #fff !important;\n  height: 30px;\n}\n\n/* line 24, src/styles/layouts/_header.scss */\n\n.header-logo img {\n  max-height: 100%;\n}\n\n/* line 29, src/styles/layouts/_header.scss */\n\n.not-logo .header-logo {\n  height: auto !important;\n}\n\n/* line 32, src/styles/layouts/_header.scss */\n\n.header-line {\n  height: 50px;\n  border-right: 1px solid rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  margin-right: 10px;\n}\n\n/* line 41, src/styles/layouts/_header.scss */\n\n.follow-more {\n  -webkit-transition: width .4s ease;\n  -o-transition: width .4s ease;\n  transition: width .4s ease;\n  overflow: hidden;\n  width: 0;\n}\n\n/* line 48, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-more {\n  width: auto;\n}\n\n/* line 49, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-toggle {\n  color: var(--header-color-hover);\n}\n\n/* line 50, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-toggle::before {\n  content: \"\\E5CD\";\n}\n\n/* line 56, src/styles/layouts/_header.scss */\n\n.nav {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  position: relative;\n  overflow: hidden;\n}\n\n/* line 62, src/styles/layouts/_header.scss */\n\n.nav ul {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  margin-right: 20px;\n  overflow: hidden;\n  white-space: nowrap;\n}\n\n/* line 70, src/styles/layouts/_header.scss */\n\n.header-left a,\n.nav ul li a {\n  border-radius: 3px;\n  color: var(--header-color);\n  display: inline-block;\n  font-weight: 600;\n  line-height: 30px;\n  padding: 0 8px;\n  text-align: center;\n  text-transform: uppercase;\n  vertical-align: middle;\n}\n\n/* line 82, src/styles/layouts/_header.scss */\n\n.header-left a.active,\n.header-left a:hover,\n.nav ul li a.active,\n.nav ul li a:hover {\n  color: var(--header-color-hover);\n}\n\n/* line 89, src/styles/layouts/_header.scss */\n\n.menu--toggle {\n  height: 48px;\n  position: relative;\n  -webkit-transition: -webkit-transform .4s;\n  transition: -webkit-transform .4s;\n  -o-transition: -o-transform .4s;\n  transition: transform .4s;\n  transition: transform .4s, -webkit-transform .4s, -o-transform .4s;\n  width: 48px;\n}\n\n/* line 95, src/styles/layouts/_header.scss */\n\n.menu--toggle span {\n  background-color: var(--header-color);\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  -webkit-transition: .4s;\n  -o-transition: .4s;\n  transition: .4s;\n  width: 20px;\n}\n\n/* line 106, src/styles/layouts/_header.scss */\n\n.menu--toggle span:first-child {\n  -webkit-transform: translate(0, -6px);\n       -o-transform: translate(0, -6px);\n          transform: translate(0, -6px);\n}\n\n/* line 107, src/styles/layouts/_header.scss */\n\n.menu--toggle span:last-child {\n  -webkit-transform: translate(0, 6px);\n       -o-transform: translate(0, 6px);\n          transform: translate(0, 6px);\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 115, src/styles/layouts/_header.scss */\n\n  .header-left {\n    -webkit-box-flex: 1 !important;\n        -ms-flex-positive: 1 !important;\n            flex-grow: 1 !important;\n  }\n\n  /* line 116, src/styles/layouts/_header.scss */\n\n  .header-logo span {\n    font-size: 24px;\n  }\n\n  /* line 119, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob {\n    overflow: hidden;\n  }\n\n  /* line 122, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .sideNav {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  /* line 124, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle {\n    border: 0;\n    -webkit-transform: rotate(90deg);\n         -o-transform: rotate(90deg);\n            transform: rotate(90deg);\n  }\n\n  /* line 128, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:first-child {\n    -webkit-transform: rotate(45deg) translate(0, 0);\n         -o-transform: rotate(45deg) translate(0, 0);\n            transform: rotate(45deg) translate(0, 0);\n  }\n\n  /* line 129, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:nth-child(2) {\n    -webkit-transform: scaleX(0);\n         -o-transform: scaleX(0);\n            transform: scaleX(0);\n  }\n\n  /* line 130, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:last-child {\n    -webkit-transform: rotate(-45deg) translate(0, 0);\n         -o-transform: rotate(-45deg) translate(0, 0);\n            transform: rotate(-45deg) translate(0, 0);\n  }\n\n  /* line 133, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .header .button-search--toggle {\n    display: none;\n  }\n\n  /* line 134, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .main,\n  body.is-showNavMob .footer {\n    -webkit-transform: translateX(-25%) !important;\n         -o-transform: translateX(-25%) !important;\n            transform: translateX(-25%) !important;\n  }\n}\n\n/* line 4, src/styles/layouts/_footer.scss */\n\n.footer {\n  color: #888;\n}\n\n/* line 7, src/styles/layouts/_footer.scss */\n\n.footer a {\n  color: var(--footer-color-link);\n}\n\n/* line 9, src/styles/layouts/_footer.scss */\n\n.footer a:hover {\n  color: #fff;\n}\n\n/* line 12, src/styles/layouts/_footer.scss */\n\n.footer-links {\n  padding: 3em 0 2.5em;\n  background-color: #131313;\n}\n\n/* line 17, src/styles/layouts/_footer.scss */\n\n.footer .follow > a {\n  background: #333;\n  border-radius: 50%;\n  color: inherit;\n  display: inline-block;\n  height: 40px;\n  line-height: 40px;\n  margin: 0 5px 8px;\n  text-align: center;\n  width: 40px;\n}\n\n/* line 28, src/styles/layouts/_footer.scss */\n\n.footer .follow > a:hover {\n  background: transparent;\n  -webkit-box-shadow: inset 0 0 0 2px #333;\n          box-shadow: inset 0 0 0 2px #333;\n}\n\n/* line 34, src/styles/layouts/_footer.scss */\n\n.footer-copy {\n  padding: 3em 0;\n  background-color: #000;\n}\n\n/* line 41, src/styles/layouts/_footer.scss */\n\n.footer-menu li {\n  display: inline-block;\n  line-height: 24px;\n  margin: 0 8px;\n  /* stylelint-disable-next-line */\n}\n\n/* line 47, src/styles/layouts/_footer.scss */\n\n.footer-menu li a {\n  color: #888;\n}\n\n/* line 3, src/styles/layouts/_homepage.scss */\n\n.cover {\n  padding: 4px;\n}\n\n/* line 6, src/styles/layouts/_homepage.scss */\n\n.cover-story {\n  overflow: hidden;\n  height: 250px;\n  width: 100%;\n}\n\n/* line 11, src/styles/layouts/_homepage.scss */\n\n.cover-story:hover .cover-header {\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, transparent), color-stop(50%, rgba(0, 0, 0, 0.6)), to(rgba(0, 0, 0, 0.9)));\n  background-image: -webkit-linear-gradient(top, transparent 0, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%);\n  background-image: -o-linear-gradient(top, transparent 0, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%);\n  background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%);\n}\n\n/* line 13, src/styles/layouts/_homepage.scss */\n\n.cover-story.firts {\n  height: 80vh;\n}\n\n/* line 16, src/styles/layouts/_homepage.scss */\n\n.cover-img,\n.cover-link {\n  bottom: 4px;\n  left: 4px;\n  right: 4px;\n  top: 4px;\n}\n\n/* line 25, src/styles/layouts/_homepage.scss */\n\n.cover-header {\n  bottom: 4px;\n  left: 4px;\n  right: 4px;\n  padding: 50px 3.846153846% 20px;\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, transparent), color-stop(50%, rgba(0, 0, 0, 0.7)), to(rgba(0, 0, 0, 0.9)));\n  background-image: -webkit-linear-gradient(top, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);\n  background-image: -o-linear-gradient(top, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);\n  background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);\n}\n\n/* line 36, src/styles/layouts/_homepage.scss */\n\n.hm-cover {\n  padding: 30px 0;\n  min-height: 100vh;\n}\n\n/* line 40, src/styles/layouts/_homepage.scss */\n\n.hm-cover-title {\n  font-size: 2.5rem;\n  font-weight: 900;\n  line-height: 1;\n}\n\n/* line 46, src/styles/layouts/_homepage.scss */\n\n.hm-cover-des {\n  max-width: 600px;\n  font-size: 1.25rem;\n}\n\n/* line 52, src/styles/layouts/_homepage.scss */\n\n.hm-subscribe {\n  background-color: transparent;\n  border-radius: 3px;\n  -webkit-box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #fff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  padding: 15px 10px;\n  -webkit-transition: all .3s;\n  -o-transition: all .3s;\n  transition: all .3s;\n  width: 100%;\n}\n\n/* line 67, src/styles/layouts/_homepage.scss */\n\n.hm-subscribe:hover {\n  -webkit-box-shadow: inset 0 0 0 2px #fff;\n          box-shadow: inset 0 0 0 2px #fff;\n}\n\n/* line 72, src/styles/layouts/_homepage.scss */\n\n.hm-down {\n  -webkit-animation-duration: 1.2s !important;\n       -o-animation-duration: 1.2s !important;\n          animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100;\n}\n\n/* line 83, src/styles/layouts/_homepage.scss */\n\n.hm-down svg {\n  display: block;\n  fill: currentcolor;\n  height: auto;\n  width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 94, src/styles/layouts/_homepage.scss */\n\n  .cover {\n    height: 70vh;\n  }\n\n  /* line 97, src/styles/layouts/_homepage.scss */\n\n  .cover-story {\n    height: 50%;\n    width: 33.33333%;\n  }\n\n  /* line 101, src/styles/layouts/_homepage.scss */\n\n  .cover-story.firts {\n    height: 100%;\n    width: 66.66666%;\n  }\n\n  /* line 105, src/styles/layouts/_homepage.scss */\n\n  .cover-story.firts .cover-title {\n    font-size: 2.5rem;\n  }\n\n  /* line 111, src/styles/layouts/_homepage.scss */\n\n  .hm-cover-title {\n    font-size: 3.5rem;\n  }\n}\n\n/* line 6, src/styles/layouts/_post.scss */\n\n.post-title {\n  color: #000;\n  line-height: 1.2;\n  font-weight: 900;\n  max-width: 1000px;\n}\n\n/* line 13, src/styles/layouts/_post.scss */\n\n.post-excerpt {\n  color: #555;\n  font-family: \"Merriweather\", serif;\n  font-weight: 300;\n  letter-spacing: -.012em;\n  line-height: 1.6;\n}\n\n/* line 22, src/styles/layouts/_post.scss */\n\n.post-author-social {\n  vertical-align: middle;\n  margin-left: 2px;\n  padding: 0 3px;\n}\n\n/* line 28, src/styles/layouts/_post.scss */\n\n.post-image {\n  margin-top: 30px;\n}\n\n/* line 33, src/styles/layouts/_post.scss */\n\n.avatar-image {\n  display: inline-block;\n  vertical-align: middle;\n}\n\n/* line 39, src/styles/layouts/_post.scss */\n\n.avatar-image--smaller {\n  width: 50px;\n  height: 50px;\n}\n\n/* line 48, src/styles/layouts/_post.scss */\n\n.post-body a:not(.button):not(.button--circle):not(.prev-next-link) {\n  text-decoration: none;\n  position: relative;\n  -webkit-transition: all 250ms;\n  -o-transition: all 250ms;\n  transition: all 250ms;\n  -webkit-box-shadow: inset 0 -3px 0 var(--post-color-link);\n          box-shadow: inset 0 -3px 0 var(--post-color-link);\n}\n\n/* line 54, src/styles/layouts/_post.scss */\n\n.post-body a:not(.button):not(.button--circle):not(.prev-next-link):hover {\n  -webkit-box-shadow: inset 0 -1rem 0 var(--post-color-link);\n          box-shadow: inset 0 -1rem 0 var(--post-color-link);\n}\n\n/* line 59, src/styles/layouts/_post.scss */\n\n.post-body img {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n/* line 65, src/styles/layouts/_post.scss */\n\n.post-body h1,\n.post-body h2,\n.post-body h3,\n.post-body h4,\n.post-body h5,\n.post-body h6 {\n  margin-top: 30px;\n  font-weight: 900;\n  font-style: normal;\n  color: #000;\n  letter-spacing: -.02em;\n  line-height: 1.2;\n}\n\n/* line 74, src/styles/layouts/_post.scss */\n\n.post-body h2 {\n  margin-top: 35px;\n}\n\n/* line 76, src/styles/layouts/_post.scss */\n\n.post-body p {\n  font-family: \"Merriweather\", serif;\n  font-size: 1.125rem;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin-top: 25px;\n}\n\n/* line 85, src/styles/layouts/_post.scss */\n\n.post-body ul,\n.post-body ol {\n  counter-reset: post;\n  font-family: \"Merriweather\", serif;\n  font-size: 1.125rem;\n  margin-top: 20px;\n}\n\n/* line 92, src/styles/layouts/_post.scss */\n\n.post-body ul li,\n.post-body ol li {\n  letter-spacing: -.003em;\n  margin-bottom: 14px;\n  margin-left: 30px;\n}\n\n/* line 97, src/styles/layouts/_post.scss */\n\n.post-body ul li::before,\n.post-body ol li::before {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  display: inline-block;\n  margin-left: -78px;\n  position: absolute;\n  text-align: right;\n  width: 78px;\n}\n\n/* line 108, src/styles/layouts/_post.scss */\n\n.post-body ul li::before {\n  content: '\\2022';\n  font-size: 16.8px;\n  padding-right: 15px;\n  padding-top: 3px;\n}\n\n/* line 115, src/styles/layouts/_post.scss */\n\n.post-body ol li::before {\n  content: counter(post) \".\";\n  counter-increment: post;\n  padding-right: 12px;\n}\n\n/* line 143, src/styles/layouts/_post.scss */\n\n.post-body-wrap {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n/* line 150, src/styles/layouts/_post.scss */\n\n.post-body-wrap h1,\n.post-body-wrap h2,\n.post-body-wrap h3,\n.post-body-wrap h4,\n.post-body-wrap h5,\n.post-body-wrap h6,\n.post-body-wrap ol,\n.post-body-wrap ul,\n.post-body-wrap hr,\n.post-body-wrap pre,\n.post-body-wrap .post-tags,\n.post-body-wrap .prev-next {\n  min-width: 100%;\n}\n\n/* line 155, src/styles/layouts/_post.scss */\n\n.post-body-wrap > ul {\n  margin-top: 35px;\n}\n\n/* line 157, src/styles/layouts/_post.scss */\n\n.post-body-wrap > iframe,\n.post-body-wrap > img,\n.post-body-wrap .kg-image-card,\n.post-body-wrap .kg-embed-card {\n  margin-top: 30px !important;\n}\n\n/* line 167, src/styles/layouts/_post.scss */\n\n.sharePost {\n  left: 0;\n  width: 40px;\n  position: absolute !important;\n  -webkit-transition: all .4s;\n  -o-transition: all .4s;\n  transition: all .4s;\n  top: 30px;\n  /* stylelint-disable-next-line */\n}\n\n/* line 175, src/styles/layouts/_post.scss */\n\n.sharePost a {\n  color: #fff;\n  margin: 8px 0 0;\n  display: block;\n}\n\n/* line 181, src/styles/layouts/_post.scss */\n\n.sharePost .i-chat {\n  background-color: #fff;\n  border: 2px solid #bbb;\n  color: #bbb;\n}\n\n/* line 191, src/styles/layouts/_post.scss */\n\n.post-related {\n  padding: 40px 0;\n}\n\n/* stylelint-disable-next-line */\n\n/* line 199, src/styles/layouts/_post.scss */\n\n.prev-next-span {\n  color: var(--composite-color);\n  font-weight: 700;\n  font-size: 13px;\n}\n\n/* line 204, src/styles/layouts/_post.scss */\n\n.prev-next-span i {\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -webkit-transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1);\n  -o-transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1);\n  transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1);\n}\n\n/* line 210, src/styles/layouts/_post.scss */\n\n.prev-next-title {\n  margin: 0 !important;\n  font-size: 16px;\n  height: 2em;\n  overflow: hidden;\n  line-height: 1 !important;\n  text-overflow: ellipsis !important;\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  display: -webkit-box !important;\n}\n\n/* line 230, src/styles/layouts/_post.scss */\n\n.prev-next-link:hover .arrow-right {\n  -webkit-animation: arrow-move-right 0.5s ease-in-out forwards;\n       -o-animation: arrow-move-right 0.5s ease-in-out forwards;\n          animation: arrow-move-right 0.5s ease-in-out forwards;\n}\n\n/* line 231, src/styles/layouts/_post.scss */\n\n.prev-next-link:hover .arrow-left {\n  -webkit-animation: arrow-move-left 0.5s ease-in-out forwards;\n       -o-animation: arrow-move-left 0.5s ease-in-out forwards;\n          animation: arrow-move-left 0.5s ease-in-out forwards;\n}\n\n/* line 237, src/styles/layouts/_post.scss */\n\n.cc-image {\n  max-height: 100vh;\n  min-height: 600px;\n  background-color: #000;\n}\n\n/* line 242, src/styles/layouts/_post.scss */\n\n.cc-image-header {\n  right: 0;\n  bottom: 10%;\n  left: 0;\n}\n\n/* line 248, src/styles/layouts/_post.scss */\n\n.cc-image-figure img {\n  opacity: .4;\n  -o-object-fit: cover;\n     object-fit: cover;\n  width: 100%;\n}\n\n/* line 254, src/styles/layouts/_post.scss */\n\n.cc-image .post-header {\n  max-width: 700px;\n}\n\n/* line 255, src/styles/layouts/_post.scss */\n\n.cc-image .post-title,\n.cc-image .post-excerpt {\n  color: #fff;\n}\n\n/* line 261, src/styles/layouts/_post.scss */\n\n.cc-video {\n  background-color: #000;\n  padding: 40px 0 30px;\n}\n\n/* line 265, src/styles/layouts/_post.scss */\n\n.cc-video .post-excerpt {\n  color: #aaa;\n  font-size: 1rem;\n}\n\n/* line 266, src/styles/layouts/_post.scss */\n\n.cc-video .post-title {\n  color: #fff;\n  font-size: 1.8rem;\n}\n\n/* line 267, src/styles/layouts/_post.scss */\n\n.cc-video .kg-embed-card,\n.cc-video .video-responsive {\n  margin-top: 0;\n}\n\n/* line 270, src/styles/layouts/_post.scss */\n\n.cc-video .story h2 {\n  color: #fff;\n  margin: 0;\n  font-size: 1.125rem !important;\n  font-weight: 700 !important;\n  max-height: 2.5em;\n  overflow: hidden;\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  text-overflow: ellipsis !important;\n  display: -webkit-box !important;\n}\n\n/* line 283, src/styles/layouts/_post.scss */\n\n.cc-video .flow-meta,\n.cc-video .story-lower,\n.cc-video figcaption {\n  display: none !important;\n}\n\n/* line 284, src/styles/layouts/_post.scss */\n\n.cc-video .story-image {\n  height: 170px !important;\n}\n\n/* line 286, src/styles/layouts/_post.scss */\n\n.cc-video .media-type {\n  height: 34px !important;\n  width: 34px !important;\n}\n\n/* line 294, src/styles/layouts/_post.scss */\n\nbody.is-article .main {\n  margin-bottom: 0;\n}\n\n/* line 295, src/styles/layouts/_post.scss */\n\nbody.share-margin .sharePost {\n  top: -85px;\n}\n\n/* line 296, src/styles/layouts/_post.scss */\n\nbody.show-category .post-primary-tag {\n  display: block !important;\n}\n\n/* line 299, src/styles/layouts/_post.scss */\n\nbody.is-article-single .post-body-wrap {\n  margin-left: 0 !important;\n}\n\n/* line 300, src/styles/layouts/_post.scss */\n\nbody.is-article-single .sharePost {\n  left: -100px;\n}\n\n/* line 301, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-width-full .kg-image {\n  max-width: 100vw;\n}\n\n/* line 302, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-width-wide .kg-image {\n  max-width: 1040px;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 308, src/styles/layouts/_post.scss */\n\n  .post-body-wrap q {\n    font-size: 20px !important;\n    letter-spacing: -.008em !important;\n    line-height: 1.4 !important;\n  }\n\n  /* line 320, src/styles/layouts/_post.scss */\n\n  .post-body-wrap .kg-image-card img {\n    max-width: 100%;\n  }\n\n  /* line 322, src/styles/layouts/_post.scss */\n\n  .post-body-wrap ol,\n  .post-body-wrap ul,\n  .post-body-wrap p {\n    font-size: 1rem;\n    letter-spacing: -.004em;\n    line-height: 1.58;\n  }\n\n  /* line 328, src/styles/layouts/_post.scss */\n\n  .post-body-wrap iframe {\n    width: 100% !important;\n  }\n\n  /* line 332, src/styles/layouts/_post.scss */\n\n  .post-related {\n    padding-left: 8px;\n    padding-right: 8px;\n  }\n\n  /* line 338, src/styles/layouts/_post.scss */\n\n  .cc-image-figure {\n    width: 200%;\n    max-width: 200%;\n    margin: 0 auto 0 -50%;\n  }\n\n  /* line 344, src/styles/layouts/_post.scss */\n\n  .cc-image-header {\n    bottom: 24px;\n  }\n\n  /* line 345, src/styles/layouts/_post.scss */\n\n  .cc-image .post-excerpt {\n    font-size: 18px;\n  }\n\n  /* line 348, src/styles/layouts/_post.scss */\n\n  .cc-video {\n    padding: 20px 0;\n  }\n\n  /* line 351, src/styles/layouts/_post.scss */\n\n  .cc-video-embed {\n    margin-left: -16px;\n    margin-right: -15px;\n  }\n\n  /* line 356, src/styles/layouts/_post.scss */\n\n  .cc-video .post-header {\n    margin-top: 10px;\n  }\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 362, src/styles/layouts/_post.scss */\n\n  body.is-article .col-left {\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 369, src/styles/layouts/_post.scss */\n\n  .cc-image .post-title {\n    font-size: 3.2rem;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 373, src/styles/layouts/_post.scss */\n\n  body.is-article .post-body-wrap {\n    margin-left: 70px;\n  }\n\n  /* line 377, src/styles/layouts/_post.scss */\n\n  body.is-video .post-author,\n  body.is-image .post-author {\n    margin-left: 70px;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  /* line 384, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-embed {\n    bottom: 20px;\n    -webkit-box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n    height: 203px;\n    padding-bottom: 0;\n    position: fixed;\n    right: 20px;\n    width: 360px;\n    z-index: 8;\n  }\n\n  /* line 395, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-close {\n    background: #000;\n    border-radius: 50%;\n    color: #fff;\n    cursor: pointer;\n    display: block !important;\n    font-size: 14px;\n    height: 24px;\n    left: -10px;\n    line-height: 1;\n    padding-top: 5px;\n    position: absolute;\n    text-align: center;\n    top: -10px;\n    width: 24px;\n    z-index: 5;\n  }\n\n  /* line 413, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-cont {\n    height: 465px;\n  }\n\n  /* line 415, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-image-header {\n    bottom: 20%;\n  }\n}\n\n/* line 3, src/styles/layouts/_story.scss */\n\n.hr-list {\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.0785);\n  margin: 20px 0 0;\n}\n\n/* line 10, src/styles/layouts/_story.scss */\n\n.story-feed .story-feed-content:first-child .hr-list:first-child {\n  margin-top: 5px;\n}\n\n/* line 15, src/styles/layouts/_story.scss */\n\n.media-type {\n  background-color: rgba(0, 0, 0, 0.7);\n  color: #fff;\n  height: 45px;\n  left: 15px;\n  top: 15px;\n  width: 45px;\n  opacity: .9;\n}\n\n/* line 33, src/styles/layouts/_story.scss */\n\n.image-hover {\n  -webkit-transition: -webkit-transform .7s;\n  transition: -webkit-transform .7s;\n  -o-transition: -o-transform .7s;\n  transition: transform .7s;\n  transition: transform .7s, -webkit-transform .7s, -o-transform .7s;\n  -webkit-transform: translateZ(0);\n          transform: translateZ(0);\n}\n\n/* line 39, src/styles/layouts/_story.scss */\n\n.not-image {\n  background: url(" + escape(__webpack_require__(/*! ./../images/not-image.png */ 53)) + ");\n  background-repeat: repeat;\n}\n\n/* line 45, src/styles/layouts/_story.scss */\n\n.flow-meta {\n  color: rgba(0, 0, 0, 0.54);\n  font-weight: 700;\n  margin-bottom: 10px;\n}\n\n/* line 52, src/styles/layouts/_story.scss */\n\n.point {\n  margin: 0 5px;\n}\n\n/* line 58, src/styles/layouts/_story.scss */\n\n.story-image {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 44%;\n          flex: 0 0 44%;\n  height: 235px;\n  margin-right: 30px;\n}\n\n/* line 63, src/styles/layouts/_story.scss */\n\n.story-image:hover .image-hover {\n  -webkit-transform: scale(1.03);\n       -o-transform: scale(1.03);\n          transform: scale(1.03);\n}\n\n/* line 66, src/styles/layouts/_story.scss */\n\n.story-lower {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n}\n\n/* line 68, src/styles/layouts/_story.scss */\n\n.story-excerpt {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Merriweather\", serif;\n  font-weight: 300;\n  line-height: 1.5;\n}\n\n/* line 75, src/styles/layouts/_story.scss */\n\n.story-category {\n  color: rgba(0, 0, 0, 0.84);\n}\n\n/* line 77, src/styles/layouts/_story.scss */\n\n.story h2 a:hover {\n  -webkit-box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.4);\n          box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.4);\n  -webkit-transition: all .25s;\n  -o-transition: all .25s;\n  transition: all .25s;\n}\n\n/* line 89, src/styles/layouts/_story.scss */\n\n.story.story--grid {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  margin-bottom: 30px;\n}\n\n/* line 93, src/styles/layouts/_story.scss */\n\n.story.story--grid .story-image {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n  margin-right: 0;\n  height: 220px;\n}\n\n/* line 99, src/styles/layouts/_story.scss */\n\n.story.story--grid .media-type {\n  font-size: 24px;\n  height: 40px;\n  width: 40px;\n}\n\n/* line 106, src/styles/layouts/_story.scss */\n\n.cover-category {\n  color: var(--story-cover-category-color);\n}\n\n/* line 111, src/styles/layouts/_story.scss */\n\n.story-card {\n  /* stylelint-disable-next-line */\n}\n\n/* line 112, src/styles/layouts/_story.scss */\n\n.story-card .story {\n  margin-top: 0 !important;\n}\n\n/* line 123, src/styles/layouts/_story.scss */\n\n.story-card .story-image {\n  border: 1px solid rgba(0, 0, 0, 0.04);\n  -webkit-box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n          box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  border-radius: 2px;\n  background-color: #fff !important;\n  -webkit-transition: all 150ms ease-in-out;\n  -o-transition: all 150ms ease-in-out;\n  transition: all 150ms ease-in-out;\n  overflow: hidden;\n  height: 200px !important;\n}\n\n/* line 135, src/styles/layouts/_story.scss */\n\n.story-card .story-image .story-img-bg {\n  margin: 10px;\n}\n\n/* line 137, src/styles/layouts/_story.scss */\n\n.story-card .story-image:hover {\n  -webkit-box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.1);\n          box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.1);\n}\n\n/* line 140, src/styles/layouts/_story.scss */\n\n.story-card .story-image:hover .story-img-bg {\n  -webkit-transform: none;\n       -o-transform: none;\n          transform: none;\n}\n\n/* line 144, src/styles/layouts/_story.scss */\n\n.story-card .story-lower {\n  display: none !important;\n}\n\n/* line 146, src/styles/layouts/_story.scss */\n\n.story-card .story-body {\n  padding: 15px 5px;\n  margin: 0 !important;\n}\n\n/* line 150, src/styles/layouts/_story.scss */\n\n.story-card .story-body h2 {\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  color: rgba(0, 0, 0, 0.9);\n  display: -webkit-box !important;\n  max-height: 2.4em !important;\n  overflow: hidden;\n  text-overflow: ellipsis !important;\n  margin: 0;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 170, src/styles/layouts/_story.scss */\n\n  .story.story--grid .story-lower {\n    max-height: 2.6em;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    display: -webkit-box;\n    line-height: 1.1;\n    text-overflow: ellipsis;\n  }\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 185, src/styles/layouts/_story.scss */\n\n  .cover--firts .cover-story {\n    height: 500px;\n  }\n\n  /* line 188, src/styles/layouts/_story.scss */\n\n  .story {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    margin-top: 20px;\n  }\n\n  /* line 192, src/styles/layouts/_story.scss */\n\n  .story-image {\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto;\n    margin-right: 0;\n  }\n\n  /* line 193, src/styles/layouts/_story.scss */\n\n  .story-body {\n    margin-top: 10px;\n  }\n}\n\n/* line 4, src/styles/layouts/_author.scss */\n\n.author {\n  background-color: #fff;\n  color: rgba(0, 0, 0, 0.6);\n  min-height: 350px;\n}\n\n/* line 9, src/styles/layouts/_author.scss */\n\n.author-avatar {\n  height: 80px;\n  width: 80px;\n}\n\n/* line 14, src/styles/layouts/_author.scss */\n\n.author-meta span {\n  display: inline-block;\n  font-size: 17px;\n  font-style: italic;\n  margin: 0 25px 16px 0;\n  opacity: .8;\n  word-wrap: break-word;\n}\n\n/* line 23, src/styles/layouts/_author.scss */\n\n.author-name {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 24, src/styles/layouts/_author.scss */\n\n.author-bio {\n  max-width: 600px;\n}\n\n/* line 25, src/styles/layouts/_author.scss */\n\n.author-meta a:hover {\n  opacity: .8 !important;\n}\n\n/* line 28, src/styles/layouts/_author.scss */\n\n.cover-opacity {\n  opacity: .5;\n}\n\n/* line 30, src/styles/layouts/_author.scss */\n\n.author.has--image {\n  color: #fff !important;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n}\n\n/* line 34, src/styles/layouts/_author.scss */\n\n.author.has--image a,\n.author.has--image .author-name {\n  color: #fff;\n}\n\n/* line 37, src/styles/layouts/_author.scss */\n\n.author.has--image .author-follow a {\n  border: 2px solid;\n  border-color: rgba(255, 255, 255, 0.5) !important;\n  font-size: 16px;\n}\n\n/* line 43, src/styles/layouts/_author.scss */\n\n.author.has--image .u-accentColor--iconNormal {\n  fill: #fff;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 47, src/styles/layouts/_author.scss */\n\n  .author-meta span {\n    display: block;\n  }\n\n  /* line 48, src/styles/layouts/_author.scss */\n\n  .author-header {\n    display: block;\n  }\n\n  /* line 49, src/styles/layouts/_author.scss */\n\n  .author-avatar {\n    margin: 0 auto 20px;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 53, src/styles/layouts/_author.scss */\n\n  body.has-cover .author {\n    min-height: 600px;\n  }\n}\n\n/* line 4, src/styles/layouts/_search.scss */\n\n.search {\n  background-color: #fff;\n  height: 100%;\n  height: 100vh;\n  left: 0;\n  padding: 0 16px;\n  right: 0;\n  top: 0;\n  -webkit-transform: translateY(-100%);\n       -o-transform: translateY(-100%);\n          transform: translateY(-100%);\n  -webkit-transition: -webkit-transform .3s ease;\n  transition: -webkit-transform .3s ease;\n  -o-transition: -o-transform .3s ease;\n  transition: transform .3s ease;\n  transition: transform .3s ease, -webkit-transform .3s ease, -o-transform .3s ease;\n  z-index: 9;\n}\n\n/* line 16, src/styles/layouts/_search.scss */\n\n.search-form {\n  max-width: 680px;\n  margin-top: 80px;\n}\n\n/* line 20, src/styles/layouts/_search.scss */\n\n.search-form::before {\n  background: #eee;\n  bottom: 0;\n  content: '';\n  display: block;\n  height: 2px;\n  left: 0;\n  position: absolute;\n  width: 100%;\n  z-index: 1;\n}\n\n/* line 32, src/styles/layouts/_search.scss */\n\n.search-form input {\n  border: none;\n  display: block;\n  line-height: 40px;\n  padding-bottom: 8px;\n}\n\n/* line 38, src/styles/layouts/_search.scss */\n\n.search-form input:focus {\n  outline: 0;\n}\n\n/* line 43, src/styles/layouts/_search.scss */\n\n.search-results {\n  max-height: calc(90% - 100px);\n  max-width: 680px;\n  overflow: auto;\n}\n\n/* line 48, src/styles/layouts/_search.scss */\n\n.search-results a {\n  border-bottom: 1px solid #eee;\n  padding: 12px 0;\n}\n\n/* line 52, src/styles/layouts/_search.scss */\n\n.search-results a:hover {\n  color: rgba(0, 0, 0, 0.44);\n}\n\n/* line 57, src/styles/layouts/_search.scss */\n\n.button-search--close {\n  position: absolute !important;\n  right: 50px;\n  top: 20px;\n}\n\n/* line 63, src/styles/layouts/_search.scss */\n\nbody.is-search {\n  overflow: hidden;\n}\n\n/* line 66, src/styles/layouts/_search.scss */\n\nbody.is-search .search {\n  -webkit-transform: translateY(0);\n       -o-transform: translateY(0);\n          transform: translateY(0);\n}\n\n/* line 67, src/styles/layouts/_search.scss */\n\nbody.is-search .search-toggle {\n  background-color: rgba(255, 255, 255, 0.25);\n}\n\n/* line 2, src/styles/layouts/_sidebar.scss */\n\n.sidebar-title {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n}\n\n/* line 5, src/styles/layouts/_sidebar.scss */\n\n.sidebar-title span {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.54);\n  padding-bottom: 10px;\n  margin-bottom: -1px;\n}\n\n/* line 14, src/styles/layouts/_sidebar.scss */\n\n.sidebar-border {\n  border-left: 3px solid var(--composite-color);\n  color: rgba(0, 0, 0, 0.2);\n  font-family: \"Merriweather\", serif;\n  padding: 0 10px;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888;\n}\n\n/* line 24, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n  -webkit-box-shadow: 0 1px 7px rgba(0, 0, 0, 0.0785);\n          box-shadow: 0 1px 7px rgba(0, 0, 0, 0.0785);\n  min-height: 60px;\n}\n\n/* line 30, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:hover .sidebar-border {\n  background-color: #e5eff5;\n}\n\n/* line 32, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:nth-child(3n) .sidebar-border {\n  border-color: #f59e00;\n}\n\n/* line 33, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:nth-child(3n+2) .sidebar-border {\n  border-color: #26a8ed;\n}\n\n/* line 2, src/styles/layouts/_sidenav.scss */\n\n.sideNav {\n  color: rgba(0, 0, 0, 0.8);\n  height: 100vh;\n  padding: 50px 20px;\n  position: fixed !important;\n  -webkit-transform: translateX(100%);\n       -o-transform: translateX(100%);\n          transform: translateX(100%);\n  -webkit-transition: 0.4s;\n  -o-transition: 0.4s;\n  transition: 0.4s;\n  will-change: transform;\n  z-index: 8;\n}\n\n/* line 13, src/styles/layouts/_sidenav.scss */\n\n.sideNav-menu a {\n  padding: 10px 20px;\n}\n\n/* line 15, src/styles/layouts/_sidenav.scss */\n\n.sideNav-wrap {\n  background: #eee;\n  overflow: auto;\n  padding: 20px 0;\n  top: 50px;\n}\n\n/* line 22, src/styles/layouts/_sidenav.scss */\n\n.sideNav-section {\n  border-bottom: solid 1px #ddd;\n  margin-bottom: 8px;\n  padding-bottom: 8px;\n}\n\n/* line 28, src/styles/layouts/_sidenav.scss */\n\n.sideNav-follow {\n  border-top: 1px solid #ddd;\n  margin: 15px 0;\n}\n\n/* line 32, src/styles/layouts/_sidenav.scss */\n\n.sideNav-follow a {\n  color: #fff;\n  display: inline-block;\n  height: 36px;\n  line-height: 20px;\n  margin: 0 5px 5px 0;\n  min-width: 36px;\n  padding: 8px;\n  text-align: center;\n  vertical-align: middle;\n}\n\n/* line 17, src/styles/layouts/helper.scss */\n\n.has-cover-padding {\n  padding-top: 100px;\n}\n\n/* line 20, src/styles/layouts/helper.scss */\n\nbody.has-cover .header {\n  position: fixed;\n}\n\n/* line 23, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .header {\n  background: rgba(0, 0, 0, 0.05);\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n/* line 29, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .header-left a,\nbody.has-cover.is-transparency:not(.is-search) .nav ul li a {\n  color: #fff;\n}\n\n/* line 30, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .menu--toggle span {\n  background-color: #fff;\n}\n\n/* line 5, src/styles/layouts/subscribe.scss */\n\n.subscribe {\n  min-height: 80vh !important;\n  height: 100%;\n}\n\n/* line 10, src/styles/layouts/subscribe.scss */\n\n.subscribe-card {\n  background-color: #D7EFEE;\n  -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  width: 900px;\n  height: 550px;\n  padding: 50px;\n  margin: 5px;\n}\n\n/* line 20, src/styles/layouts/subscribe.scss */\n\n.subscribe form {\n  max-width: 300px;\n}\n\n/* line 24, src/styles/layouts/subscribe.scss */\n\n.subscribe-form {\n  height: 100%;\n}\n\n/* line 28, src/styles/layouts/subscribe.scss */\n\n.subscribe-input {\n  background: 0 0;\n  border: 0;\n  border-bottom: 1px solid #cc5454;\n  border-radius: 0;\n  padding: 7px 5px;\n  height: 45px;\n  outline: 0;\n  font-family: \"Ruda\", sans-serif;\n}\n\n/* line 38, src/styles/layouts/subscribe.scss */\n\n.subscribe-input::-webkit-input-placeholder {\n  color: #cc5454;\n}\n\n.subscribe-input:-ms-input-placeholder {\n  color: #cc5454;\n}\n\n.subscribe-input::-ms-input-placeholder {\n  color: #cc5454;\n}\n\n.subscribe-input::placeholder {\n  color: #cc5454;\n}\n\n/* line 43, src/styles/layouts/subscribe.scss */\n\n.subscribe .main-error {\n  color: #cc5454;\n  font-size: 16px;\n  margin-top: 15px;\n}\n\n/* line 65, src/styles/layouts/subscribe.scss */\n\n.subscribe-success .subscribe-card {\n  background-color: #E8F3EC;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 71, src/styles/layouts/subscribe.scss */\n\n  .subscribe-card {\n    height: auto;\n    width: auto;\n  }\n}\n\n/* line 4, src/styles/layouts/_comments.scss */\n\n.post-comments {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 15;\n  width: 100%;\n  left: 0;\n  overflow-y: auto;\n  background: #fff;\n  border-left: 1px solid #f1f1f1;\n  -webkit-box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n          box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  font-size: 14px;\n  -webkit-transform: translateX(100%);\n       -o-transform: translateX(100%);\n          transform: translateX(100%);\n  -webkit-transition: .2s;\n  -o-transition: .2s;\n  transition: .2s;\n  will-change: transform;\n}\n\n/* line 21, src/styles/layouts/_comments.scss */\n\n.post-comments-header {\n  padding: 20px;\n  border-bottom: 1px solid #ddd;\n}\n\n/* line 25, src/styles/layouts/_comments.scss */\n\n.post-comments-header .toggle-comments {\n  font-size: 24px;\n  line-height: 1;\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 17px;\n  cursor: pointer;\n}\n\n/* line 36, src/styles/layouts/_comments.scss */\n\n.post-comments-overlay {\n  position: fixed !important;\n  background-color: rgba(0, 0, 0, 0.2);\n  display: none;\n  -webkit-transition: background-color .4s linear;\n  -o-transition: background-color .4s linear;\n  transition: background-color .4s linear;\n  z-index: 8;\n  cursor: pointer;\n}\n\n/* line 46, src/styles/layouts/_comments.scss */\n\nbody.has-comments {\n  overflow: hidden;\n}\n\n/* line 49, src/styles/layouts/_comments.scss */\n\nbody.has-comments .post-comments-overlay {\n  display: block;\n}\n\n/* line 50, src/styles/layouts/_comments.scss */\n\nbody.has-comments .post-comments {\n  -webkit-transform: translateX(0);\n       -o-transform: translateX(0);\n          transform: translateX(0);\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 54, src/styles/layouts/_comments.scss */\n\n  .post-comments {\n    left: auto;\n    width: 500px;\n    top: 50px;\n    z-index: 9;\n  }\n\n  /* line 60, src/styles/layouts/_comments.scss */\n\n  .post-comments-wrap {\n    padding: 20px;\n  }\n}\n\n/* line 1, src/styles/common/_modal.scss */\n\n.modal {\n  opacity: 0;\n  -webkit-transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  -o-transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  z-index: 100;\n  visibility: hidden;\n}\n\n/* line 8, src/styles/common/_modal.scss */\n\n.modal-shader {\n  background-color: rgba(255, 255, 255, 0.65);\n}\n\n/* line 11, src/styles/common/_modal.scss */\n\n.modal-close {\n  color: rgba(0, 0, 0, 0.54);\n  position: absolute;\n  top: 0;\n  right: 0;\n  line-height: 1;\n  padding: 15px;\n}\n\n/* line 21, src/styles/common/_modal.scss */\n\n.modal-inner {\n  background-color: #E8F3EC;\n  border-radius: 4px;\n  -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n  max-width: 700px;\n  height: 100%;\n  max-height: 400px;\n  opacity: 0;\n  padding: 72px 5% 56px;\n  -webkit-transform: scale(0.6);\n       -o-transform: scale(0.6);\n          transform: scale(0.6);\n  -webkit-transition: opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -webkit-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  transition: opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -webkit-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  -o-transition: opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -o-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  transition: transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  transition: transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -webkit-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -o-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  width: 100%;\n}\n\n/* line 36, src/styles/common/_modal.scss */\n\n.modal .form-group {\n  width: 76%;\n  margin: 0 auto 30px;\n}\n\n/* line 41, src/styles/common/_modal.scss */\n\n.modal .form--input {\n  display: inline-block;\n  margin-bottom: 10px;\n  vertical-align: top;\n  height: 40px;\n  line-height: 40px;\n  background-color: transparent;\n  padding: 17px 6px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.15);\n  width: 100%;\n}\n\n/* line 71, src/styles/common/_modal.scss */\n\nbody.has-modal {\n  overflow: hidden;\n}\n\n/* line 74, src/styles/common/_modal.scss */\n\nbody.has-modal .modal {\n  opacity: 1;\n  visibility: visible;\n  -webkit-transition: opacity .3s ease;\n  -o-transition: opacity .3s ease;\n  transition: opacity .3s ease;\n}\n\n/* line 79, src/styles/common/_modal.scss */\n\nbody.has-modal .modal-inner {\n  opacity: 1;\n  -webkit-transform: scale(1);\n       -o-transform: scale(1);\n          transform: scale(1);\n  -webkit-transition: -webkit-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n  transition: -webkit-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n  -o-transition: -o-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n  transition: transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n  transition: transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96), -webkit-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96), -o-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n}\n\n/* line 4, src/styles/common/_widget.scss */\n\n.instagram-hover {\n  background-color: rgba(0, 0, 0, 0.3);\n  opacity: 0;\n}\n\n/* line 10, src/styles/common/_widget.scss */\n\n.instagram-img {\n  height: 264px;\n}\n\n/* line 13, src/styles/common/_widget.scss */\n\n.instagram-img:hover > .instagram-hover {\n  opacity: 1;\n}\n\n/* line 16, src/styles/common/_widget.scss */\n\n.instagram-name {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n       -o-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  z-index: 3;\n}\n\n/* line 22, src/styles/common/_widget.scss */\n\n.instagram-name a {\n  background-color: #fff;\n  color: #000 !important;\n  font-size: 18px !important;\n  font-weight: 900 !important;\n  min-width: 200px;\n  padding-left: 10px !important;\n  padding-right: 10px !important;\n  text-align: center !important;\n}\n\n/* line 34, src/styles/common/_widget.scss */\n\n.instagram-col {\n  padding: 0 !important;\n  margin: 0 !important;\n}\n\n/* line 39, src/styles/common/_widget.scss */\n\n.instagram-wrap {\n  margin: 0 !important;\n}\n\n/* line 44, src/styles/common/_widget.scss */\n\n.witget-subscribe {\n  background: #fff;\n  border: 5px solid transparent;\n  padding: 28px 30px;\n  position: relative;\n}\n\n/* line 50, src/styles/common/_widget.scss */\n\n.witget-subscribe::before {\n  content: \"\";\n  border: 5px solid #f5f5f5;\n  -webkit-box-shadow: inset 0 0 0 1px #d7d7d7;\n          box-shadow: inset 0 0 0 1px #d7d7d7;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  display: block;\n  height: calc(100% + 10px);\n  left: -5px;\n  pointer-events: none;\n  position: absolute;\n  top: -5px;\n  width: calc(100% + 10px);\n  z-index: 1;\n}\n\n/* line 65, src/styles/common/_widget.scss */\n\n.witget-subscribe input {\n  background: #fff;\n  border: 1px solid #e5e5e5;\n  color: rgba(0, 0, 0, 0.54);\n  height: 41px;\n  outline: 0;\n  padding: 0 16px;\n  width: 100%;\n}\n\n/* line 75, src/styles/common/_widget.scss */\n\n.witget-subscribe button {\n  background: var(--composite-color);\n  border-radius: 0;\n  width: 100%;\n}\n\n", "", {"version":3,"sources":["C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/main.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/node_modules/normalize.css/normalize.css","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/main.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/node_modules/prismjs/themes/prism.css","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_global.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_mixins.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/autoload/_zoom.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/components/_grid.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_typography.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_utilities.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/components/_form.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/components/_icons.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/components/_animated.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_header.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_footer.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_homepage.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_post.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_story.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_author.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_search.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_sidebar.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_sidenav.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/helper.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/subscribe.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_comments.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_modal.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_widget.scss"],"names":[],"mappings":"AAAA,iBAAA;;ACAA,4EAAA;;AAEA;gFCGgF;;ADAhF;;;GCKG;;AFFH,uDAAA;;ACEA;EACE,kBAAA;EAAmB,OAAA;EACnB,+BAAA;EAAgC,OAAA;CCOjC;;ADJD;gFCOgF;;ADJhF;;GCQG;;AFNH,uDAAA;;ACEA;EACE,UAAA;CCSD;;ADND;;;GCWG;;AFTH,uDAAA;;ACGA;EACE,eAAA;EACA,iBAAA;CCWD;;ADRD;gFCWgF;;ADRhF;;;GCaG;;AFbH,uDAAA;;ACKA;EACE,gCAAA;UAAA,wBAAA;EAAyB,OAAA;EACzB,UAAA;EAAW,OAAA;EACX,kBAAA;EAAmB,OAAA;CCgBpB;;ADbD;;;GCkBG;;AFhBH,uDAAA;;ACGA;EACE,kCAAA;EAAmC,OAAA;EACnC,eAAA;EAAgB,OAAA;CCoBjB;;ADjBD;gFCoBgF;;ADjBhF;;GCqBG;;AFpBH,uDAAA;;ACGA;EACE,8BAAA;CCsBD;;ADnBD;;;GCwBG;;AFvBH,uDAAA;;ACIA;EACE,oBAAA;EAAqB,OAAA;EACrB,2BAAA;EAA4B,OAAA;EAC5B,0CAAA;UAAA,kCAAA;EAAmC,OAAA;CC2BpC;;ADxBD;;GC4BG;;AF1BH,uDAAA;;ACEA;;EAEE,oBAAA;CC6BD;;AD1BD;;;GC+BG;;AF7BH,uDAAA;;ACGA;;;EAGE,kCAAA;EAAmC,OAAA;EACnC,eAAA;EAAgB,OAAA;CCiCjB;;AD9BD;;GCkCG;;AFhCH,wDAAA;;ACEA;EACE,eAAA;CCmCD;;ADhCD;;;GCqCG;;AFnCH,wDAAA;;ACGA;;EAEE,eAAA;EACA,eAAA;EACA,mBAAA;EACA,yBAAA;CCqCD;;AFrCD,wDAAA;;ACGA;EACE,gBAAA;CCuCD;;AFvCD,wDAAA;;ACGA;EACE,YAAA;CCyCD;;ADtCD;gFCyCgF;;ADtChF;;GC0CG;;AF3CH,wDAAA;;ACKA;EACE,mBAAA;CC2CD;;ADxCD;gFC2CgF;;ADxChF;;;GC6CG;;AF/CH,wDAAA;;ACOA;;;;;EAKE,qBAAA;EAAsB,OAAA;EACtB,gBAAA;EAAiB,OAAA;EACjB,kBAAA;EAAmB,OAAA;EACnB,UAAA;EAAW,OAAA;CCiDZ;;AD9CD;;;GCmDG;;AFlDH,wDAAA;;ACIA;;EACQ,OAAA;EACN,kBAAA;CCoDD;;ADjDD;;;GCsDG;;AFrDH,wDAAA;;ACIA;;EACS,OAAA;EACP,qBAAA;CCuDD;;ADpDD;;GCwDG;;AFxDH,wDAAA;;ACIA;;;;EAIE,2BAAA;CCyDD;;ADtDD;;GC0DG;;AF3DH,wDAAA;;ACKA;;;;EAIE,mBAAA;EACA,WAAA;CC2DD;;ADxDD;;GC4DG;;AF9DH,wDAAA;;ACMA;;;;EAIE,+BAAA;CC6DD;;AD1DD;;GC8DG;;AFjEH,wDAAA;;ACOA;EACE,+BAAA;CC+DD;;AD5DD;;;;;GCmEG;;AFpEH,wDAAA;;ACQA;EACE,+BAAA;UAAA,uBAAA;EAAwB,OAAA;EACxB,eAAA;EAAgB,OAAA;EAChB,eAAA;EAAgB,OAAA;EAChB,gBAAA;EAAiB,OAAA;EACjB,WAAA;EAAY,OAAA;EACZ,oBAAA;EAAqB,OAAA;CCuEtB;;ADpED;;GCwEG;;AFvEH,wDAAA;;ACGA;EACE,yBAAA;CCyED;;ADtED;;GC0EG;;AF1EH,wDAAA;;ACIA;EACE,eAAA;CC2ED;;ADxED;;;GC6EG;;AF7EH,wDAAA;;AACA;;ECME,+BAAA;UAAA,uBAAA;EAAwB,OAAA;EACxB,WAAA;EAAY,OAAA;CC+Eb;;AD5ED;;GCgFG;;AFhFH,wDAAA;;AACA;;ECKE,aAAA;CCiFD;;AD9ED;;;GCmFG;;AFnFH,wDAAA;;AACA;ECKE,8BAAA;EAA+B,OAAA;EAC/B,qBAAA;EAAsB,OAAA;CCqFvB;;ADlFD;;GCsFG;;AFtFH,wDAAA;;AACA;ECIE,yBAAA;CCuFD;;ADpFD;;;GCyFG;;AFzFH,wDAAA;;ACKA;EACE,2BAAA;EAA4B,OAAA;EAC5B,cAAA;EAAe,OAAA;CC2FhB;;ADxFD;gFC2FgF;;ADxFhF;;GC4FG;;AF7FH,wDAAA;;ACKA;EACE,eAAA;CC6FD;;AD1FD;;GC8FG;;AFhGH,wDAAA;;ACMA;EACE,mBAAA;CC+FD;;AD5FD;gFC+FgF;;AD5FhF;;GCgGG;;AFpGH,wDAAA;;ACQA;EACE,cAAA;CCiGD;;AD9FD;;GCkGG;;AFvGH,wDAAA;;AACA;ECSE,cAAA;CCmGD;;ACtbD;;;;GD4bG;;AF1GH,mDAAA;;AG5UA;;EAEC,aAAA;EACA,iBAAA;EACA,yBAAA;EACA,uEAAA;EACA,iBAAA;EACA,iBAAA;EACA,qBAAA;EACA,mBAAA;EACA,kBAAA;EACA,iBAAA;EAEA,iBAAA;EACA,eAAA;EACA,YAAA;EAEA,sBAAA;EAEA,kBAAA;EACA,cAAA;CDybA;;AF5GD,oDAAA;;AG1UA;;;;EAEC,kBAAA;EACA,oBAAA;CD6bA;;AFhHD,oDAAA;;AG1UA;;;;EAEC,kBAAA;EACA,oBAAA;CDicA;;ACpcD;;;;EAEC,kBAAA;EACA,oBAAA;CDicA;;AC9bD;EH2UE,oDAAA;;EG9WF;;IAsCE,kBAAA;GDmcC;CACF;;AChcD,iBAAA;;AH0UA,oDAAA;;AGzUA;EACC,aAAA;EACA,eAAA;EACA,eAAA;CDscA;;AF1HD,oDAAA;;AGzUA;;EAEC,oBAAA;CDwcA;;ACrcD,iBAAA;;AH0UA,oDAAA;;AGzUA;EACC,cAAA;EACA,oBAAA;EACA,oBAAA;CD2cA;;AF/HD,oDAAA;;AGzUA;;;;EAIC,iBAAA;CD6cA;;AFjID,oDAAA;;AGzUA;EACC,YAAA;CD+cA;;AFnID,oDAAA;;AGzUA;EACC,YAAA;CDidA;;AFrID,oDAAA;;AGzUA;;;;;;;EAOC,YAAA;CDmdA;;AFvID,oDAAA;;AGzUA;;;;;;EAMC,YAAA;CDqdA;;AFzID,qDAAA;;AGzUA;;;;;EAKC,eAAA;EACA,qCAAA;CDudA;;AF3ID,qDAAA;;AGzUA;;;EAGC,YAAA;CDydA;;AF7ID,qDAAA;;AGzUA;;EAEC,eAAA;CD2dA;;AF/ID,qDAAA;;AGzUA;;;EAGC,YAAA;CD6dA;;AFjJD,qDAAA;;AGzUA;;EAEC,kBAAA;CD+dA;;AFnJD,qDAAA;;AG1UA;EACC,mBAAA;CDkeA;;AFrJD,qDAAA;;AG1UA;EACC,aAAA;CDoeA;;AFvJD,8EAAA;;AIrdA;EACC,mBAAA;EACA,oBAAA;EACA,0BAAA;CFinBA;;AFzJD,8EAAA;;AIrdA;EACC,mBAAA;EACA,qBAAA;CFmnBA;;AF3JD,+EAAA;;AIrdA;EACC,mBAAA;EACA,qBAAA;EACA,OAAA;EACA,gBAAA;EACA,aAAA;EACA,WAAA;EAAY,6CAAA;EACZ,qBAAA;EACA,6BAAA;EAEA,0BAAA;EACA,uBAAA;EACA,sBAAA;EACA,kBAAA;CFqnBA;;AF7JD,+EAAA;;AIpdC;EACC,qBAAA;EACA,eAAA;EACA,8BAAA;CFsnBD;;AF/JD,+EAAA;;AIpdE;EACC,6BAAA;EACA,YAAA;EACA,eAAA;EACA,qBAAA;EACA,kBAAA;CFwnBF;;AFjKD,4CAAA;;AKrPA;ECxQE,eAAA;EACA,gBAAA;EACA,sBAAA;CJoqBD;;AFnKD,4CAAA;;AM9fA;EACE,4BAAA;EACA,sBAAA;CJsqBD;;AFrKD,6CAAA;;AMpfA;EACE,UAAA;EACA,QAAA;EACA,mBAAA;EACA,SAAA;EACA,OAAA;CJ8pBD;;AFvKD,6CAAA;;AMpfA;EACE,qCAAA;EACA,oCAAA;CJgqBD;;AFzKD,6CAAA;;AKvOA;;;;;EC5QE,gFAAA;EACA,kCAAA;EAAmC,4BAAA;EACnC,YAAA;EACA,mBAAA;EACA,oBAAA;EACA,qBAAA;EACA,qBAAA;EACA,qBAAA;EAEA,uCAAA;EACA,oCAAA;EACA,mCAAA;CJsqBD;;AF/KD,4CAAA;;AOpiBA;EACE,wBAAA;EAAA,gBAAA;CLwtBD;;AFjLD,4CAAA;;AOriBA;;EAEE,mBAAA;EACA,aAAA;EACA,8BAAA;EACK,yBAAA;EACG,sBAAA;CL2tBT;;AFnLD,6CAAA;;AOtiBA;EACE,gBAAA;EACA,yBAAA;EACA,sBAAA;CL8tBD;;AFrLD,6CAAA;;AOviBA;EACE,aAAA;EACA,iBAAA;EACA,gBAAA;EACA,OAAA;EACA,QAAA;EACA,SAAA;EACA,UAAA;EACA,qBAAA;EACA,2BAAA;EACA,WAAA;EACA,kCAAA;EACK,6BAAA;EACG,0BAAA;CLiuBT;;AFvLD,6CAAA;;AOxiBA;EACE,6BAAA;EACA,WAAA;CLouBD;;AFzLD,6CAAA;;AOziBA;;EAEE,gBAAA;CLuuBD;;AF3LD,4CAAA;;AKllBA;EACE,cAAA;EACA,cAAA;EACA,yBAAA;EACA,2BAAA;EACA,wBAAA;EACA,8BAAA;EACA,2BAAA;EACA,sCAAA;EACA,2BAAA;EACA,6BAAA;EACA,4BAAA;CHkxBD;;AF7LD,6CAAA;;AKllBA;;;EACE,+BAAA;UAAA,uBAAA;CHsxBD;;AFjMD,6CAAA;;ACjiBA;EIhDE,eAAA;EACA,sBAAA;CHwxBD;;AFpMC,6CAAA;;AKtlBF;;EAMI,WAAA;CH2xBH;;AFvMD,6CAAA;;AKhlBA;EACE,4BAAA;EACA,YAAA;EACA,mCAAA;EACA,qBAAA;EACA,mBAAA;EACA,iBAAA;EACA,wBAAA;EACA,iBAAA;EACA,uBAAA;EACA,oBAAA;EACA,mBAAA;CH4xBD;;AF1MC,6CAAA;;AK7lBF;EAaoB,cAAA;CHgyBnB;;AF5MD,6CAAA;;ACvmBA;EIuBE,2BAAA;EACA,gCAAA;EACA,gBAAA;EACA,mBAAA;EACA,iBAAA;EACA,kBAAA;EACA,iBAAA;EACA,eAAA;EACA,mCAAA;EACA,mBAAA;CHkyBD;;AF9MD,6CAAA;;AChoBA;EIiDE,+BAAA;UAAA,uBAAA;EACA,gBAAA;CHmyBD;;AFhND,6CAAA;;AKhlBA;EACE,UAAA;CHqyBD;;AFlND,6CAAA;;AKhlBA;EACE,2BAAA;EACA,eAAA;EACA,mCAAA;EACA,oDAAA;UAAA,4CAAA;EACA,gBAAA;EACA,mBAAA;EACA,iBAAA;EACA,QAAA;EACA,kBAAA;EACA,iBAAA;EACA,iBAAA;EACA,WAAA;EACA,mBAAA;EACA,mBAAA;EACA,OAAA;EACA,YAAA;CHuyBD;;AFpND,6CAAA;;AK9kBA;;;EACE,oBAAA;EACA,mBAAA;EACA,eAAA;EACA,+CAAA;EACA,gBAAA;EACA,iBAAA;EACA,sBAAA;CHyyBD;;AFxND,6CAAA;;ACznBA;EI4CE,qCAAA;EACA,mBAAA;EACA,+CAAA;EACA,gBAAA;EACA,4BAAA;EACA,gBAAA;EACA,iBAAA;EACA,cAAA;EACA,mBAAA;EACA,kBAAA;CH2yBD;;AF3NC,8CAAA;;AK9kBA;EACE,wBAAA;EACA,eAAA;EACA,WAAA;EACA,wBAAA;CH8yBH;;AF7ND,8CAAA;;AG7rBA;;EEkHE,eAAA;EACA,iBAAA;CH+yBD;;AFhOC,8CAAA;;AKllBF;;EAKmB,YAAA;CHozBlB;;AFnOC,8CAAA;;AKtlBF;;EAQI,mBAAA;CHwzBH;;AFtOG,8CAAA;;AK1lBJ;;EAWM,YAAA;EACA,mBAAA;EACA,QAAA;EACA,OAAA;EACA,oBAAA;EACA,YAAA;EACA,aAAA;CH4zBL;;AFzOC,8CAAA;;AKpmBF;;EAsBI,mBAAA;EACA,UAAA;EACA,YAAA;CH8zBH;;AF5OG,8CAAA;;AK1mBJ;;EA2BM,iBAAA;EACA,mBAAA;EACA,YAAA;CHk0BL;;AF9OD,8CAAA;;AK7kBA;EACE,UAAA;EACA,eAAA;EACA,kBAAA;EACA,mBAAA;CHg0BD;;AFjPC,8CAAA;;AKnlBF;EAOI,0BAAA;EACA,eAAA;EACA,sBAAA;EACA,gCAAA;EACA,gBAAA;EACA,iBAAA;EACA,qBAAA;EACA,mBAAA;EACA,WAAA;CHm0BH;;AFnPD,8CAAA;;AK/lBqB;EAoBnB,YAAA;EACA,eAAA;EACA,UAAA;EACA,uBAAA;CHo0BD;;AFrPD,8CAAA;;ACrnBA;EI0CE,aAAA;EACA,gBAAA;EACA,uBAAA;EACA,YAAA;CHs0BD;;AFxPC,8CAAA;;AK5kBA;EACE,mBAAA;CHy0BH;;AF1PD,8CAAA;;AK3kBA;EAEE,uBAAA;CHy0BD;;AF5PD,8CAAA;;AK1kBA;EACE,aAAA;EACA,WAAA;CH20BD;;AF9PD,8CAAA;;AK1kBA;;EACE,iBAAA;EACA,uBAAA;EACA,UAAA;EACA,WAAA;CH80BD;;AFjQD,8CAAA;;AK1kBA;EACE,yCAAA;EACA,8FAAA;EAAA,iEAAA;EAAA,4DAAA;EAAA,+DAAA;EACA,0BAAA;CHg1BD;;AFnQD,8CAAA;;AK1kBA;EACE,2BAAA;EACA,eAAA;EACA,gBAAA;EACA,mBAAA;EACA,iBAAA;EACA,wBAAA;EACA,kBAAA;EACA,mBAAA;EACA,kBAAA;EACA,iBAAA;CHk1BD;;AFtQC,8CAAA;;AKtlBF;;EAYwB,cAAA;CHu1BvB;;AFzQD,8CAAA;;AK3kBA;EACE,0BAAA;EACA,kBAAA;EACA,sBAAA;EACA,mJAAA;EACA,gBAAA;EACA,iBAAA;EACA,iBAAA;EACA,gBAAA;EACA,iBAAA;EACA,oBAAA;EACA,oBAAA;EACA,YAAA;EACA,kCAAA;CHy1BD;;AF5QC,8CAAA;;AK3kBA;;EAEE,kBAAA;EACA,0BAAA;CH41BH;;AF/QC,8CAAA;;AK/lBF;EAsBI,0BAAA;CH81BH;;AFlRC,8CAAA;;AKlmBF;EA0BI,sBAAA;EACA,0BAAA;EACA,iBAAA;CHg2BH;;AFpRD,8CAAA;;AKlkBA;;;EAKI,2BAAA;CHy1BH;;AFxRD,8CAAA;;AK3jBA;EAAQ,mBAAA;EAAoB,iBAAA;CH01B3B;;AF1RD,8CAAA;;AK9jBA;;EACU,+CAAA;EAAA,uCAAA;EAAA,qCAAA;EAAA,+BAAA;EAAA,kFAAA;CH81BT;;AF5RD,8CAAA;;AK9jBA;EACE,oBAAA;EACA,eAAA;CH+1BD;;AF/RC,8CAAA;;AKlkBF;EAGc,iBAAA;CHo2Bb;;AFjSD,8CAAA;;AKhkBA;EACE,oBAAA;EACA,eAAA;CHs2BD;;AFpSC,8CAAA;;AKpkBF;EAGc,iBAAA;CH22Bb;;AFtSD,8CAAA;;AKlkBA;EACE,oBAAA;EACA,eAAA;CH62BD;;AFzSC,8CAAA;;AKtkBF;EAGc,eAAA;EAAgB,iBAAA;CHm3B7B;;AF3SD,8CAAA;;AKrkBA;;;EACE,eAAA;EACA,2BAAA;EACA,6BAAA;EACA,iBAAA;EACA,6BAAA;CHu3BD;;AFhTC,8CAAA;;AKrkBA;;;EACE,eAAA;EACA,2BAAA;CH43BH;;AFrTC,8CAAA;;AKhlBF;;;EAeI,YAAA;EACA,gBAAA;EACA,mBAAA;EACA,iBAAA;CH83BH;;AFzTD,8CAAA;;AK9jBE;EAAgB,iBAAA;CH63BjB;;AF3TD,8CAAA;;AKnkBA;EAEiB,kBAAA;CHk4BhB;;AF7TD,8CAAA;;AKhkBA;EACE,kBAAA;EACA,mBAAA;CHk4BD;;AFhUC,8CAAA;;AKpkBF;EAKI,gCAAA;EACA,mBAAA;EACA,YAAA;EACA,4BAAA;EACA,sBAAA;EACA,gBAAA;EACA,iBAAA;EACA,UAAA;EACA,kBAAA;EACA,iBAAA;EACA,WAAA;EACA,iBAAA;EACA,qBAAA;EACA,mBAAA;EACA,mBAAA;EACA,qBAAA;EACA,WAAA;EACA,gCAAA;EACA,WAAA;CHq4BH;;AFnUC,8CAAA;;AKzlBF;EA2BI,6CAAA;OAAA,wCAAA;UAAA,qCAAA;CHu4BH;;AFrUD,8CAAA;;AK5jBA;EACE,sCAAA;CHs4BD;;AFxUC,8CAAA;;AK5jBC;EACC,WAAA;EACA,mBAAA;EACA,UAAA;CHy4BH;;AF3UC,8CAAA;;AK3jBA;EACE,iBAAA;EACA,sBAAA;CH24BH;;AF9UC,8CAAA;;AK1jBC;EACC,0BAAA;EACA,iBAAA;CH64BH;;AFhVD,8CAAA;;AKvjBA;EACE,eAAA;EACA,UAAA;EACA,iBAAA;EACA,iBAAA;EACA,oBAAA;EACA,mBAAA;EACA,YAAA;CH44BD;;AFnVC,8CAAA;;AKvjBA;EACE,UAAA;EACA,UAAA;EACA,aAAA;EACA,QAAA;EACA,mBAAA;EACA,OAAA;EACA,YAAA;CH+4BH;;AFtVC,8CAAA;;AKzkBF;EAoBI,UAAA;EACA,UAAA;EACA,aAAA;EACA,QAAA;EACA,mBAAA;EACA,OAAA;EACA,YAAA;CHi5BH;;AFxVD,8CAAA;;AKrjBA;EAAmC,cAAA;CHm5BlC;;AF1VD,8CAAA;;AKpjBE;EAAqB,0BAAA;CHo5BtB;;AF5VD,8CAAA;;AKvjBE;;EAAsB,qCAAA;CH05BvB;;AF/VD,8CAAA;;AK5jBE;EAAqB,0BAAA;CHi6BtB;;AFjWD,8CAAA;;AK/jBE;;EAAsB,qCAAA;CHu6BvB;;AFpWD,8CAAA;;AKpkBE;EAAqB,0BAAA;CH86BtB;;AFtWD,8CAAA;;AKvkBE;;EAAsB,qCAAA;CHo7BvB;;AFzWD,8CAAA;;AK5kBE;EAAqB,0BAAA;CH27BtB;;AF3WD,8CAAA;;AK/kBE;;EAAsB,qCAAA;CHi8BvB;;AF9WD,8CAAA;;AKplBE;EAAqB,0BAAA;CHw8BtB;;AFhXD,8CAAA;;AKvlBE;;EAAsB,qCAAA;CH88BvB;;AFnXD,8CAAA;;AK5lBE;EAAqB,uBAAA;CHq9BtB;;AFrXD,8CAAA;;AK/lBE;;EAAsB,kCAAA;CH29BvB;;AFxXD,8CAAA;;AKpmBE;EAAqB,0BAAA;CHk+BtB;;AF1XD,8CAAA;;AKvmBE;;EAAsB,qCAAA;CHw+BvB;;AF7XD,8CAAA;;AK5mBE;EAAqB,0BAAA;CH++BtB;;AF/XD,8CAAA;;AK/mBE;;EAAsB,qCAAA;CHq/BvB;;AFlYD,8CAAA;;AKpnBE;EAAqB,uBAAA;CH4/BtB;;AFpYD,8CAAA;;AKvnBE;;EAAsB,kCAAA;CHkgCvB;;AFvYD,8CAAA;;AK5nBE;EAAqB,0BAAA;CHygCtB;;AFzYD,8CAAA;;AK/nBE;;EAAsB,qCAAA;CH+gCvB;;AF5YD,8CAAA;;AKpoBE;EAAqB,0BAAA;CHshCtB;;AF9YD,8CAAA;;AKvoBE;;EAAsB,qCAAA;CH4hCvB;;AFjZD,8CAAA;;AK5oBE;EAAqB,0BAAA;CHmiCtB;;AFnZD,8CAAA;;AK/oBE;;EAAsB,qCAAA;CHyiCvB;;AFtZD,8CAAA;;AKppBE;EAAqB,0BAAA;CHgjCtB;;AFxZD,8CAAA;;AKvpBE;;EAAsB,qCAAA;CHsjCvB;;AF3ZD,8CAAA;;AK5pBE;EAAqB,0BAAA;CH6jCtB;;AF7ZD,8CAAA;;AK/pBE;;EAAsB,qCAAA;CHmkCvB;;AFhaD,8CAAA;;AKpqBE;EAAqB,0BAAA;CH0kCtB;;AFlaD,8CAAA;;AKvqBE;;EAAsB,qCAAA;CHglCvB;;AFraD,8CAAA;;AK5qBE;EAAqB,0BAAA;CHulCtB;;AFvaD,8CAAA;;AK/qBE;;EAAsB,qCAAA;CH6lCvB;;AF1aD,8CAAA;;AKprBE;EAAqB,uBAAA;CHomCtB;;AF5aD,8CAAA;;AKvrBE;;EAAsB,kCAAA;CH0mCvB;;AF/aD,8CAAA;;AK5rBE;EAAqB,yBAAA;CHinCtB;;AFjbD,8CAAA;;AK/rBE;;EAAsB,oCAAA;CHunCvB;;AFpbD,8CAAA;;AK5qBA;EACE,aAAA;EACA,gBAAA;EACA,YAAA;EACA,mBAAA;EACA,YAAA;EACA,WAAA;CHqmCD;;AFvbC,8CAAA;;AK5qBA;EACE,yBAAA;CHwmCH;;AFzbD,8CAAA;;AK3qBA;EACE,sBAAA;CHymCD;;AF3bD,8CAAA;;AK3qBA;EACE,aAAA;EACA,YAAA;CH2mCD;;AF7bD,8CAAA;;AKxqBA;EAAa,0BAAA;CH2mCZ;;AF/bD,8CAAA;;AKvqBA;EACE,0BAAA;EACA,cAAA;EACA,YAAA;EACA,QAAA;EACA,gBAAA;EACA,SAAA;EACA,OAAA;EACA,oCAAA;OAAA,+BAAA;UAAA,4BAAA;EACA,aAAA;CH2mCD;;AFjcD,8CAAA;;AKvqBA;EACE,uDAAA;OAAA,kDAAA;UAAA,+CAAA;EACA,6BAAA;OAAA,wBAAA;UAAA,qBAAA;EACA,eAAA;CH6mCD;;AGxmCD;ELsqBE,8CAAA;;EK5nCF;IAude,kBAAA;IAAmB,oBAAA;GH+mC/B;;EFtcD,8CAAA;;EKvqBA;;IAEE,oBAAA;IACA,mBAAA;GHknCD;CACF;;AFzcD,8CAAA;;AQjqCA;EACE,+BAAA;UAAA,uBAAA;EACA,eAAA;EACA,kBAAA;EACA,gBAAA;EACA,YAAA;CN+mDD;;AF3cD,+CAAA;;AQlpCA;;EAEE,2BAAA;MAAA,cAAA;EACA,oBAAA;MAAA,qBAAA;UAAA,aAAA;EACA,gBAAA;EACA,oBAAA;EACA,mBAAA;CNkmDD;;AM5lDD;ERgpCE,+CAAA;;EQ/oCA;IAAY,8BAAA;GNkmDX;;EFhdD,+CAAA;;EQjpCA;IAAiB,8BAAA;GNumDhB;;EFndD,+CAAA;;EQnpCA;IAAkB,0CAAA;QAAA,6BAAA;IAA8B,4BAAA;GN6mD/C;;EFtdD,+CAAA;;EQtpCA;IAA4B,oBAAA;GNknD3B;CACF;;AFzdD,+CAAA;;AQvpCA;EACE,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,6BAAA;EAAA,8BAAA;MAAA,2BAAA;UAAA,uBAAA;EACA,mBAAA;EACA,oBAAA;EACA,aAAA;CNqnDD;;AF3dD,+CAAA;;AQvpCA;EACE,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,+BAAA;EAAA,8BAAA;MAAA,wBAAA;UAAA,oBAAA;EACA,oBAAA;MAAA,gBAAA;EACA,oBAAA;MAAA,mBAAA;UAAA,eAAA;EACA,mBAAA;EACA,oBAAA;CNunDD;;AF9dC,+CAAA;;AQ/pCF;EASI,oBAAA;MAAA,mBAAA;UAAA,eAAA;EACA,+BAAA;UAAA,uBAAA;EACA,mBAAA;EACA,oBAAA;CN0nDH;;AFjeG,+CAAA;;AQrqCJ;EAoBQ,kCAAA;MAAA,qBAAA;EACA,oBAAA;CNwnDP;;AFpeG,+CAAA;;AQtpCE;EACE,mCAAA;MAAA,sBAAA;EACA,qBAAA;CN+nDP;;AFveG,+CAAA;;AQ7qCJ;EAoBQ,6BAAA;MAAA,gBAAA;EACA,eAAA;CNsoDP;;AF1eG,+CAAA;;AQ9pCE;EACE,mCAAA;MAAA,sBAAA;EACA,qBAAA;CN6oDP;;AF7eG,+CAAA;;AQrrCJ;EAoBQ,mCAAA;MAAA,sBAAA;EACA,qBAAA;CNopDP;;AFhfG,+CAAA;;AQzrCJ;EAoBQ,6BAAA;MAAA,gBAAA;EACA,eAAA;CN2pDP;;AFnfG,+CAAA;;AQ1qCE;EACE,mCAAA;MAAA,sBAAA;EACA,qBAAA;CNkqDP;;AFtfG,+CAAA;;AQjsCJ;EAoBQ,mCAAA;MAAA,sBAAA;EACA,qBAAA;CNyqDP;;AFzfG,+CAAA;;AQlrCE;EACE,6BAAA;MAAA,gBAAA;EACA,eAAA;CNgrDP;;AF5fG,+CAAA;;AQzsCJ;EAoBQ,mCAAA;MAAA,sBAAA;EACA,qBAAA;CNurDP;;AF/fG,+CAAA;;AQ7sCJ;EAoBQ,mCAAA;MAAA,sBAAA;EACA,qBAAA;CN8rDP;;AFlgBG,+CAAA;;AQ9rCE;EACE,8BAAA;MAAA,iBAAA;EACA,gBAAA;CNqsDP;;AM/rDG;ER2rCE,+CAAA;;EQttCN;IAmCU,kCAAA;QAAA,qBAAA;IACA,oBAAA;GN8rDP;;EFxgBG,+CAAA;;EQ1tCN;IAmCU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNqsDP;;EF3gBG,+CAAA;;EQ9tCN;IAmCU,6BAAA;QAAA,gBAAA;IACA,eAAA;GN4sDP;;EF9gBG,+CAAA;;EQhsCE;IACE,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNmtDP;;EFjhBG,+CAAA;;EQtuCN;IAmCU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GN0tDP;;EFphBG,+CAAA;;EQxsCE;IACE,6BAAA;QAAA,gBAAA;IACA,eAAA;GNiuDP;;EFvhBG,+CAAA;;EQ9uCN;IAmCU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNwuDP;;EF1hBG,+CAAA;;EQhtCE;IACE,mCAAA;QAAA,sBAAA;IACA,qBAAA;GN+uDP;;EF7hBG,+CAAA;;EQtvCN;IAmCU,6BAAA;QAAA,gBAAA;IACA,eAAA;GNsvDP;;EFhiBG,+CAAA;;EQ1vCN;IAmCU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GN6vDP;;EFniBG,+CAAA;;EQ5tCE;IACE,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNowDP;;EFtiBG,+CAAA;;EQlwCN;IAmCU,8BAAA;QAAA,iBAAA;IACA,gBAAA;GN2wDP;CACF;;AMrwDG;ER4tCE,gDAAA;;EQvwCN;IAmDU,kCAAA;QAAA,qBAAA;IACA,oBAAA;GNowDP;;EF7iBG,gDAAA;;EQ3wCN;IAmDU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GN2wDP;;EFhjBG,gDAAA;;EQ7tCE;IACE,6BAAA;QAAA,gBAAA;IACA,eAAA;GNkxDP;;EFnjBG,gDAAA;;EQnxCN;IAmDU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNyxDP;;EFtjBG,gDAAA;;EQvxCN;IAmDU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNgyDP;;EFzjBG,gDAAA;;EQzuCE;IACE,6BAAA;QAAA,gBAAA;IACA,eAAA;GNuyDP;;EF5jBG,gDAAA;;EQ/xCN;IAmDU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GN8yDP;;EF/jBG,gDAAA;;EQjvCE;IACE,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNqzDP;;EFlkBG,gDAAA;;EQvyCN;IAmDU,6BAAA;QAAA,gBAAA;IACA,eAAA;GN4zDP;;EFrkBG,gDAAA;;EQ3yCN;IAmDU,mCAAA;QAAA,sBAAA;IACA,qBAAA;GNm0DP;;EFxkBG,gDAAA;;EQ7vCE;IACE,mCAAA;QAAA,sBAAA;IACA,qBAAA;GN00DP;;EF3kBG,gDAAA;;EQnzCN;IAmDU,8BAAA;QAAA,iBAAA;IACA,gBAAA;GNi1DP;CACF;;AF9kBD,gDAAA;;ASz2CA;;;;;;EACE,eAAA;EACA,gCAAA;EACA,iBAAA;EACA,iBAAA;EACA,UAAA;CPi8DD;;AFtlBC,iDAAA;;ASz2CA;;;;;;EACE,eAAA;EACA,qBAAA;CPy8DH;;AF7lBD,iDAAA;;ACx1CA;EQhBK,gBAAA;CP28DJ;;AF/lBD,iDAAA;;AS32CA;EAAK,oBAAA;CPg9DJ;;AFjmBD,iDAAA;;AS92CA;EAAK,kBAAA;CPq9DJ;;AFnmBD,iDAAA;;ASj3CA;EAAK,kBAAA;CP09DJ;;AFrmBD,iDAAA;;ASp3CA;EAAK,kBAAA;CP+9DJ;;AFvmBD,iDAAA;;ASv3CA;EAAK,gBAAA;CPo+DJ;;AFzmBD,iDAAA;;ASz3CA;EACE,UAAA;CPu+DD;;AF3mBD,+CAAA;;AUl5CA;EAGE,0BAAA;EACA,yBAAA;CRggED;;AF7mBD,+CAAA;;AUh5CA;EACE,uBAAA;EACA,sBAAA;CRkgED;;AF/mBD,gDAAA;;AUh5CA;EACE,0BAAA;EACA,yBAAA;CRogED;;AFjnBD,gDAAA;;AUh5CA;EACE,eAAA;EACA,cAAA;CRsgED;;AFnnBD,gDAAA;;AU/4CA;EAAa,uCAAA;CRwgEZ;;AFrnBD,gDAAA;;AU94CA;EAAc,mBAAA;CRygEb;;AFvnBD,gDAAA;;AUj5CA;EAAc,mBAAA;CR8gEb;;AFznBD,gDAAA;;AUn5CA;EAAW,2BAAA;CRkhEV;;AF3nBD,gDAAA;;AUr5CA;EAAW,0BAAA;CRshEV;;AF7nBD,gDAAA;;AUx5CA;EAAiB,sBAAA;CR2hEhB;;AF/nBD,gDAAA;;AUz5CA;EAEE,0BAAA;EACA,UAAA;EACA,QAAA;EACA,mBAAA;EACA,SAAA;EACA,OAAA;EACA,WAAA;CR4hED;;AFjoBD,gDAAA;;AUx5CA;EACE,oGAAA;EAAA,qEAAA;EAAA,gEAAA;EAAA,mEAAA;EACA,UAAA;EACA,YAAA;EACA,QAAA;EACA,mBAAA;EACA,SAAA;EACA,WAAA;CR8hED;;AFnoBD,gDAAA;;AUv5CA;EAAW,WAAA;CRgiEV;;AFroBD,gDAAA;;AU15CA;EAAW,WAAA;CRqiEV;;AFvoBD,gDAAA;;AU75CA;EAAW,WAAA;CR0iEV;;AFzoBD,gDAAA;;AUh6CA;EAAW,WAAA;CR+iEV;;AF3oBD,gDAAA;;AUj6CA;EAAqB,0BAAA;CRkjEpB;;AF7oBD,gDAAA;;AUp6CA;EAA8B,qCAAA;CRujE7B;;AF/oBD,gDAAA;;AUr6CA;EACE,YAAA;EACA,eAAA;EACA,YAAA;CRyjED;;AFjpBD,gDAAA;;AUp6CA;EAAmB,gBAAA;CR2jElB;;AFnpBD,gDAAA;;AUv6CA;EAAsB,gBAAA;CRgkErB;;AFrpBD,gDAAA;;AU16CA;EAAgB,gBAAA;CRqkEf;;AFvpBD,gDAAA;;AU76CA;EAAqB,gBAAA;CR0kEpB;;AFzpBD,gDAAA;;AUh7CA;EAAgB,gBAAA;CR+kEf;;AF3pBD,gDAAA;;AUn7CA;EAAmB,gBAAA;CRolElB;;AF7pBD,gDAAA;;AUt7CA;EAAkB,gBAAA;CRylEjB;;AF/pBD,gDAAA;;AUz7CA;EAAgB,gBAAA;CR8lEf;;AFjqBD,gDAAA;;AU57CA;EAAgB,gBAAA;CRmmEf;;AFnqBD,gDAAA;;AU/7CA;EAAgB,gBAAA;CRwmEf;;AFrqBD,gDAAA;;AUl8CA;EAAmB,gBAAA;CR6mElB;;AFvqBD,gDAAA;;AUr8CA;EAAgB,gBAAA;CRknEf;;AFzqBD,gDAAA;;AUx8CA;EAAgB,gBAAA;CRunEf;;AF3qBD,gDAAA;;AU38CA;;EAAoB,gBAAA;CR6nEnB;;AF9qBD,gDAAA;;AU98CA;EAAgB,gBAAA;CRkoEf;;AFhrBD,gDAAA;;AUj9CA;EAAgB,gBAAA;CRuoEf;;AFlrBD,gDAAA;;AUp9CA;EAAqB,gBAAA;CR4oEpB;;AFprBD,gDAAA;;AUv9CA;EAAmB,gBAAA;CRipElB;;AQ/oED;EV09CE,gDAAA;;EUz9CA;IAAqB,gBAAA;GRqpEpB;;EFzrBD,gDAAA;;EU39CA;IAAmB,gBAAA;GR0pElB;;EF5rBD,iDAAA;;EU79CA;IAAuB,gBAAA;GR+pEtB;CACF;;AF/rBD,iDAAA;;AUj9CA;EAAoB,iBAAA;CRspEnB;;AFjsBD,iDAAA;;AUp9CA;EAAsB,iBAAA;CR2pErB;;AFnsBD,iDAAA;;AUt9CA;EAAwB,4BAAA;CR+pEvB;;AFrsBD,iDAAA;;AUz9CA;EAAoB,iBAAA;CRoqEnB;;AFvsBD,iDAAA;;AU59CA;EAAsB,iBAAA;CRyqErB;;AFzsBD,iDAAA;;AU99CA;EAAmB,0BAAA;CR6qElB;;AF3sBD,iDAAA;;AUj+CA;EAAoB,2BAAA;CRkrEnB;;AF7sBD,iDAAA;;AUp+CA;EAAqB,mBAAA;CRurEpB;;AF/sBD,iDAAA;;AUt+CA;EACE,4BAAA;EACA,mCAAA;EACA,+BAAA;CR0rED;;AFjtBD,iDAAA;;AUr+CA;EAAgB,kBAAA;EAAmB,mBAAA;CR6rElC;;AFntBD,iDAAA;;AUz+CA;EAAiB,iBAAA;CRksEhB;;AFrtBD,iDAAA;;AU5+CA;EAAiB,iBAAA;CRusEhB;;AFvtBD,iDAAA;;AU/+CA;EAAoB,oBAAA;CR4sEnB;;AFztBD,iDAAA;;AUl/CA;EAAoB,oBAAA;CRitEnB;;AF3tBD,iDAAA;;AUr/CA;EAAoB,+BAAA;CRstEnB;;AF7tBD,iDAAA;;AUx/CA;EAAoB,oBAAA;CR2tEnB;;AF/tBD,iDAAA;;AU3/CA;EAAoB,oBAAA;CRguEnB;;AFjuBD,iDAAA;;AU5/CA;EAAc,sBAAA;CRmuEb;;AFnuBD,iDAAA;;AU//CA;EAAe,cAAA;CRwuEd;;AFruBD,iDAAA;;AUlgDA;EAAe,yBAAA;CR6uEd;;AFvuBD,iDAAA;;AUrgDA;EAAoB,oBAAA;CRkvEnB;;AFzuBD,iDAAA;;AUxgDA;EAAqB,qBAAA;CRuvEpB;;AF3uBD,iDAAA;;AU3gDA;EAAqB,qBAAA;CR4vEpB;;AF7uBD,iDAAA;;AU9gDA;EAAoB,oBAAA;CRiwEnB;;AF/uBD,iDAAA;;AUjhDA;EAAmB,mBAAA;CRswElB;;AFjvBD,iDAAA;;AUnhDA;EAAiB,iBAAA;CR0wEhB;;AFnvBD,iDAAA;;AUthDA;EAAiB,iBAAA;CR+wEhB;;AFrvBD,iDAAA;;AUzhDA;EAAkB,kBAAA;CRoxEjB;;AFvvBD,iDAAA;;AU5hDA;EAAkB,kBAAA;CRyxEjB;;AFzvBD,iDAAA;;AU/hDA;EAAkB,kBAAA;CR8xEjB;;AF3vBD,iDAAA;;AUliDA;EAAkB,kBAAA;CRmyEjB;;AF7vBD,iDAAA;;AUpiDA;EAAqB,qBAAA;CRuyEpB;;AF/vBD,iDAAA;;AUtiDA;EAAoB,oBAAA;CR2yEnB;;AFjwBD,iDAAA;;AUziDA;EAAmB,mBAAA;CRgzElB;;AFnwBD,iDAAA;;AU3iDA;EACE,gCAAA;EACA,mBAAA;EACA,iBAAA;EACA,wBAAA;CRmzED;;AFrwBD,iDAAA;;AU1iDA;EAAiB,eAAA;CRqzEhB;;AFvwBD,iDAAA;;AU7iDA;EAAqB,iBAAA;CR0zEpB;;AFzwBD,iDAAA;;AU9iDA;EAAoB,iBAAA;CR6zEnB;;AF3wBD,iDAAA;;AU/iDA;EAAgB,aAAA;CRg0Ef;;AF7wBD,iDAAA;;AUljDA;EAAe,YAAA;CRq0Ed;;AF/wBD,iDAAA;;AUnjDA;EAAU,qBAAA;EAAA,qBAAA;EAAA,cAAA;CRw0ET;;AFjxBD,iDAAA;;AUtjDA;;EAAgB,0BAAA;MAAA,uBAAA;UAAA,oBAAA;EAAqB,qBAAA;EAAA,qBAAA;EAAA,cAAA;CR+0EpC;;AFpxBD,iDAAA;;AU1jDA;;EAAuB,yBAAA;MAAA,sBAAA;UAAA,wBAAA;CRq1EtB;;AFvxBD,iDAAA;;AU5jDA;EAAW,oBAAA;MAAA,mBAAA;UAAA,eAAA;CRy1EV;;AFzxBD,iDAAA;;AU/jDA;EAAW,oBAAA;MAAA,mBAAA;UAAA,eAAA;CR81EV;;AF3xBD,iDAAA;;AUlkDA;EAAc,oBAAA;MAAA,gBAAA;CRm2Eb;;AF7xBD,iDAAA;;AUpkDA;EACE,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,6BAAA;EAAA,8BAAA;MAAA,2BAAA;UAAA,uBAAA;EACA,yBAAA;MAAA,sBAAA;UAAA,wBAAA;CRs2ED;;AF/xBD,iDAAA;;AUpkDA;EACE,0BAAA;MAAA,uBAAA;UAAA,oBAAA;EACA,sBAAA;MAAA,mBAAA;UAAA,0BAAA;CRw2ED;;AFjyBD,iDAAA;;AUpkDA;EACE,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,6BAAA;EAAA,8BAAA;MAAA,2BAAA;UAAA,uBAAA;EACA,wBAAA;MAAA,qBAAA;UAAA,4BAAA;CR02ED;;AFnyBD,iDAAA;;AUnkDA;EACE,8BAAA;EACA,4BAAA;EACA,uBAAA;CR22ED;;AFryBD,iDAAA;;AUlkDA;EACE,kBAAA;EACA,mBAAA;EACA,mBAAA;EACA,oBAAA;CR42ED;;AFvyBD,iDAAA;;AUlkDA;EAAkB,kBAAA;CR+2EjB;;AFzyBD,iDAAA;;AUrkDA;EAAkB,kBAAA;CRo3EjB;;AF3yBD,iDAAA;;AUxkDA;EAAiB,iBAAA;CRy3EhB;;AF7yBD,iDAAA;;AU3kDA;EAAkB,kBAAA;CR83EjB;;AF/yBD,iDAAA;;AU9kDA;EAAmB,YAAA;CRm4ElB;;AFjzBD,iDAAA;;AUjlDA;EAAoB,aAAA;CRw4EnB;;AFnzBD,iDAAA;;AUllDA;EAAmB,sCAAA;CR24ElB;;AFrzBD,iDAAA;;AUrlDA;;;EAAW,mBAAA;CRk5EV;;AFzzBD,iDAAA;;AUxlDA;EAAmB,mBAAA;CRu5ElB;;AF3zBD,iDAAA;;AU1lDA;EACE,uDAAA;UAAA,+CAAA;CR05ED;;AF7zBD,iDAAA;;AUzlDA;EAAe,cAAA;CR45Ed;;AF/zBD,iDAAA;;AU5lDA;EAAe,cAAA;CRi6Ed;;AFj0BD,iDAAA;;AU/lDA;EAAe,cAAA;CRs6Ed;;AFn0BD,iDAAA;;AUlmDA;EAAe,cAAA;CR26Ed;;AFr0BD,iDAAA;;AUrmDA;EAAyB,qCAAA;CRg7ExB;;AFv0BD,iDAAA;;AUtmDA;EAAU,yBAAA;CRm7ET;;AFz0BD,iDAAA;;AUvmDA;EACE,iBAAA;EACA,sCAAA;EACA,mBAAA;EAEA,kDAAA;UAAA,0CAAA;EACA,oBAAA;EACA,wBAAA;CRo7ED;;AF30BD,iDAAA;;AUrmDA;EACE,mBAAA;EACA,mBAAA;EACA,YAAA;CRq7ED;;AF90BC,iDAAA;;AU1mDF;EAMI,YAAA;EACA,qCAAA;EACA,sBAAA;EACA,mBAAA;EACA,QAAA;EACA,YAAA;EACA,YAAA;EACA,YAAA;EACA,WAAA;CRw7EH;;AFh1BD,iDAAA;;AUnmDA;EACE,yCAAA;EACA,YAAA;EACA,sBAAA;EACA,gBAAA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,0BAAA;EACA,iCAAA;OAAA,4BAAA;UAAA,yBAAA;CRw7ED;;AFl1BD,iDAAA;;AUnmDA;EACE,2DAAA;CR07ED;;AQv7ED;EVomDE,iDAAA;;EUnmDA;IAAoB,yBAAA;GR67EnB;;EFv1BD,iDAAA;;EUrmDA;IAAmB,aAAA;GRk8ElB;;EF11BD,iDAAA;;EUvmDA;IAAkB,cAAA;GRu8EjB;;EF71BD,iDAAA;;EUzmDA;IAAiB,mBAAA;GR48EhB;CACF;;AQ18ED;EV2mDE,iDAAA;;EU3mDuB;IAAoB,yBAAA;GRi9E1C;CACF;;AQ/8ED;EV6mDE,iDAAA;;EU7mDqB;IAAmB,yBAAA;GRs9EvC;CACF;;AQr9ED;EVgnDE,iDAAA;;EUhnDqB;IAAmB,yBAAA;GR49EvC;CACF;;AFz2BD,8CAAA;;AWx6DA;EACE,wBAAA;EACA,sCAAA;EACA,mBAAA;EACA,+BAAA;UAAA,uBAAA;EACA,2BAAA;EACA,gBAAA;EACA,sBAAA;EACA,gCAAA;EACA,gBAAA;EACA,mBAAA;EACA,iBAAA;EACA,aAAA;EACA,kBAAA;EACA,kBAAA;EACA,gBAAA;EACA,mBAAA;EACA,mBAAA;EACA,sBAAA;EACA,mCAAA;EACA,0BAAA;KAAA,uBAAA;MAAA,sBAAA;UAAA,kBAAA;EACA,uBAAA;EACA,oBAAA;CTsxFD;;AF52BC,+CAAA;;AWx6DC;EACC,iBAAA;EACA,gBAAA;EACA,yBAAA;UAAA,iBAAA;EACA,2BAAA;EACA,aAAA;EACA,qBAAA;EACA,WAAA;EACA,iBAAA;EACA,yBAAA;EACA,oBAAA;CTyxFH;;AF/2BG,+CAAA;;AWp7DD;;;EAeG,gBAAA;EACA,0BAAA;CT4xFL;;AFp3BC,+CAAA;;AWp6DA;EACE,gBAAA;EACA,aAAA;EACA,kBAAA;EACA,gBAAA;CT6xFH;;AFv3BC,+CAAA;;AWn6DA;EACE,gCAAA;EACA,kCAAA;EACA,iCAAA;CT+xFH;;AF13BG,+CAAA;;AWn6DA;EACE,oBAAA;EACA,sBAAA;CTkyFL;;AF53BD,+CAAA;;AWh6DA;EACE,sBAAA;EACA,eAAA;CTiyFD;;AF93BD,+CAAA;;AWh6DA;;EAEE,WAAA;CTmyFD;;AFh4BD,+CAAA;;AW/5DE;EACE,kBAAA;EACA,uBAAA;CToyFH;;AFl4BD,+CAAA;;AW/5DE;EACE,gBAAA;CTsyFH;;AFp4BD,+CAAA;;AWz6DA;EAWI,aAAA;EACA,kBAAA;CTwyFH;;AFt4BD,+CAAA;;AW96DA;;EAiBI,aAAA;EACA,kBAAA;CT0yFH;;AFx4BD,+CAAA;;AWp7DA;EAsBI,gBAAA;EACA,mBAAA;CT4yFH;;AF14BD,gDAAA;;AW/5DE;EACE,iBAAA;CT8yFH;;AF54BD,gDAAA;;AW77DA;EA+BI,eAAA;EACA,kBAAA;CTgzFH;;AF94BD,gDAAA;;AW76DyB;EAgBvB,kCAAA;EACA,mBAAA;EACA,YAAA;EACA,aAAA;EACA,kBAAA;EACA,WAAA;EACA,sBAAA;EACA,YAAA;CTizFD;;AFh5BD,gDAAA;;AW55DA;EACE,gCAAA;EACA,aAAA;EACA,2BAAA;EACA,iBAAA;EACA,oBAAA;CTizFD;;AFn5BC,gDAAA;;AWn6DF;EAQI,+BAAA;EACA,2BAAA;CTozFH;;AFr5BD,gDAAA;;AWz5DA;EACE,uBAAA;EACA,YAAA;EACA,eAAA;EACA,iBAAA;EACA,oBAAA;EACA,iBAAA;EACA,0BAAA;EACA,qGAAA;EAAA,6FAAA;EAAA,wFAAA;EAAA,qFAAA;EAAA,sJAAA;CTmzFD;;AFx5BC,gDAAA;;AWz5DA;EACE,YAAA;EACA,gDAAA;UAAA,wCAAA;CTszFH;;AU38FD;EACE,uBAAA;EACA,mCAAA;EACA,4MAAA;EAIA,oBAAA;EACA,mBAAA;CV28FD;;AF35BD,gDAAA;;AYziEA;EACE,iBAAA;CVy8FD;;AF75BD,gDAAA;;AY1iEA;EACE,iBAAA;CV48FD;;AF/5BD,gDAAA;;AY3iEA;EACE,iBAAA;CV+8FD;;AFj6BD,gDAAA;;AY5iEA;EACE,iBAAA;CVk9FD;;AFn6BD,gDAAA;;AY7iEA;EACE,iBAAA;CVq9FD;;AFr6BD,gDAAA;;AY9iEA;EACE,iBAAA;CVw9FD;;AFv6BD,gDAAA;;AY/iEA;EACE,iBAAA;CV29FD;;AFz6BD,gDAAA;;AYhjEA;EACE,iBAAA;CV89FD;;AF36BD,gDAAA;;AYjjEA;EACE,iBAAA;CVi+FD;;AF76BD,gDAAA;;AYljEA;EACE,iBAAA;EACA,YAAA;CVo+FD;;AF/6BD,gDAAA;;AYnjEA;EACE,iBAAA;CVu+FD;;AFj7BD,gDAAA;;AYpjEA;EACE,iBAAA;CV0+FD;;AFn7BD,gDAAA;;AYrjEA;EACE,iBAAA;CV6+FD;;AFr7BD,gDAAA;;AYtjEA;EACE,iBAAA;CVg/FD;;AFv7BD,gDAAA;;AYvjEA;EACE,iBAAA;CVm/FD;;AFz7BD,gDAAA;;AYxjEA;EACE,iBAAA;CVs/FD;;AF37BD,gDAAA;;AYzjEA;EACE,iBAAA;CVy/FD;;AF77BD,gDAAA;;AY1jEA;EACE,iBAAA;CV4/FD;;AF/7BD,gDAAA;;AY3jEA;EACE,iBAAA;CV+/FD;;AFj8BD,gDAAA;;AY5jEA;EACE,iBAAA;CVkgGD;;AFn8BD,gDAAA;;AY7jEA;EACE,iBAAA;CVqgGD;;AFr8BD,gDAAA;;AY9jEA;EACE,iBAAA;CVwgGD;;AFv8BD,gDAAA;;AY/jEA;EACE,iBAAA;CV2gGD;;AFz8BD,gDAAA;;AYhkEA;EACE,iBAAA;CV8gGD;;AF38BD,gDAAA;;AYjkEA;EACE,iBAAA;CVihGD;;AF78BD,gDAAA;;AYlkEA;EACE,iBAAA;CVohGD;;AF/8BD,gDAAA;;AYnkEA;EACE,iBAAA;CVuhGD;;AFj9BD,gDAAA;;AYpkEA;EACE,iBAAA;CV0hGD;;AFn9BD,iDAAA;;AYrkEA;EACE,iBAAA;CV6hGD;;AFr9BD,iDAAA;;AYtkEA;EACE,iBAAA;CVgiGD;;AFv9BD,iDAAA;;AYvkEA;EACE,iBAAA;CVmiGD;;AFz9BD,iDAAA;;AYxkEA;EACE,iBAAA;CVsiGD;;AF39BD,iDAAA;;AYzkEA;EACE,iBAAA;CVyiGD;;AF79BD,iDAAA;;AY1kEA;EACE,iBAAA;CV4iGD;;AF/9BD,iDAAA;;AY3kEA;EACE,iBAAA;CV+iGD;;AFj+BD,iDAAA;;AY5kEA;EACE,iBAAA;CVkjGD;;AFn+BD,iDAAA;;AY7kEA;EACE,iBAAA;CVqjGD;;AFr+BD,iDAAA;;AY9kEA;EACE,iBAAA;CVwjGD;;AFv+BD,iDAAA;;AY/kEA;EACE,iBAAA;CV2jGD;;AFz+BD,iDAAA;;AYhlEA;EACE,iBAAA;CV8jGD;;AF3+BD,iDAAA;;AYjlEA;EACE,iBAAA;CVikGD;;AF7+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","file":"main.scss","sourcesContent":["@charset \"UTF-8\";\n/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */\n/* Document\n   ========================================================================== */\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n/* line 11, node_modules/normalize.css/normalize.css */\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/* Sections\n   ========================================================================== */\n/**\n * Remove the margin in all browsers.\n */\n/* line 23, node_modules/normalize.css/normalize.css */\nbody {\n  margin: 0; }\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n/* line 32, node_modules/normalize.css/normalize.css */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/* Grouping content\n   ========================================================================== */\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n/* line 45, node_modules/normalize.css/normalize.css */\nhr {\n  box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */ }\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n/* line 56, node_modules/normalize.css/normalize.css */\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */ }\n\n/* Text-level semantics\n   ========================================================================== */\n/**\n * Remove the gray background on active links in IE 10.\n */\n/* line 68, node_modules/normalize.css/normalize.css */\na {\n  background-color: transparent; }\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n/* line 77, node_modules/normalize.css/normalize.css */\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  text-decoration: underline dotted;\n  /* 2 */ }\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n/* line 87, node_modules/normalize.css/normalize.css */\nb,\nstrong {\n  font-weight: bolder; }\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n/* line 97, node_modules/normalize.css/normalize.css */\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */ }\n\n/**\n * Add the correct font size in all browsers.\n */\n/* line 108, node_modules/normalize.css/normalize.css */\nsmall {\n  font-size: 80%; }\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n/* line 117, node_modules/normalize.css/normalize.css */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\n/* line 125, node_modules/normalize.css/normalize.css */\nsub {\n  bottom: -0.25em; }\n\n/* line 129, node_modules/normalize.css/normalize.css */\nsup {\n  top: -0.5em; }\n\n/* Embedded content\n   ========================================================================== */\n/**\n * Remove the border on images inside links in IE 10.\n */\n/* line 140, node_modules/normalize.css/normalize.css */\nimg {\n  border-style: none; }\n\n/* Forms\n   ========================================================================== */\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n/* line 152, node_modules/normalize.css/normalize.css */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */ }\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n/* line 168, node_modules/normalize.css/normalize.css */\nbutton,\ninput {\n  /* 1 */\n  overflow: visible; }\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n/* line 178, node_modules/normalize.css/normalize.css */\nbutton,\nselect {\n  /* 1 */\n  text-transform: none; }\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n/* line 187, node_modules/normalize.css/normalize.css */\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; }\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n/* line 198, node_modules/normalize.css/normalize.css */\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0; }\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n/* line 210, node_modules/normalize.css/normalize.css */\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText; }\n\n/**\n * Correct the padding in Firefox.\n */\n/* line 221, node_modules/normalize.css/normalize.css */\nfieldset {\n  padding: 0.35em 0.75em 0.625em; }\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n/* line 232, node_modules/normalize.css/normalize.css */\nlegend {\n  box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */ }\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n/* line 245, node_modules/normalize.css/normalize.css */\nprogress {\n  vertical-align: baseline; }\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n/* line 253, node_modules/normalize.css/normalize.css */\ntextarea {\n  overflow: auto; }\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n/* line 262, node_modules/normalize.css/normalize.css */\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n/* line 272, node_modules/normalize.css/normalize.css */\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n/* line 282, node_modules/normalize.css/normalize.css */\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */ }\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n/* line 291, node_modules/normalize.css/normalize.css */\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n/* line 300, node_modules/normalize.css/normalize.css */\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */ }\n\n/* Interactive\n   ========================================================================== */\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n/* line 312, node_modules/normalize.css/normalize.css */\ndetails {\n  display: block; }\n\n/*\n * Add the correct display in all browsers.\n */\n/* line 320, node_modules/normalize.css/normalize.css */\nsummary {\n  display: list-item; }\n\n/* Misc\n   ========================================================================== */\n/**\n * Add the correct display in IE 10+.\n */\n/* line 331, node_modules/normalize.css/normalize.css */\ntemplate {\n  display: none; }\n\n/**\n * Add the correct display in IE 10.\n */\n/* line 339, node_modules/normalize.css/normalize.css */\n[hidden] {\n  display: none; }\n\n/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n/* line 7, node_modules/prismjs/themes/prism.css */\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: black;\n  background: none;\n  text-shadow: 0 1px white;\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -moz-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none; }\n\n/* line 30, node_modules/prismjs/themes/prism.css */\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n  text-shadow: none;\n  background: #b3d4fc; }\n\n/* line 36, node_modules/prismjs/themes/prism.css */\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n  text-shadow: none;\n  background: #b3d4fc; }\n\n@media print {\n  /* line 43, node_modules/prismjs/themes/prism.css */\n  code[class*=\"language-\"],\n  pre[class*=\"language-\"] {\n    text-shadow: none; } }\n\n/* Code blocks */\n/* line 50, node_modules/prismjs/themes/prism.css */\npre[class*=\"language-\"] {\n  padding: 1em;\n  margin: .5em 0;\n  overflow: auto; }\n\n/* line 56, node_modules/prismjs/themes/prism.css */\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n  background: #f5f2f0; }\n\n/* Inline code */\n/* line 62, node_modules/prismjs/themes/prism.css */\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em;\n  border-radius: .3em;\n  white-space: normal; }\n\n/* line 68, node_modules/prismjs/themes/prism.css */\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: slategray; }\n\n/* line 75, node_modules/prismjs/themes/prism.css */\n.token.punctuation {\n  color: #999; }\n\n/* line 79, node_modules/prismjs/themes/prism.css */\n.namespace {\n  opacity: .7; }\n\n/* line 83, node_modules/prismjs/themes/prism.css */\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #905; }\n\n/* line 93, node_modules/prismjs/themes/prism.css */\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n  color: #690; }\n\n/* line 102, node_modules/prismjs/themes/prism.css */\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n  color: #9a6e3a;\n  background: rgba(255, 255, 255, 0.5); }\n\n/* line 111, node_modules/prismjs/themes/prism.css */\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #07a; }\n\n/* line 117, node_modules/prismjs/themes/prism.css */\n.token.function,\n.token.class-name {\n  color: #DD4A68; }\n\n/* line 122, node_modules/prismjs/themes/prism.css */\n.token.regex,\n.token.important,\n.token.variable {\n  color: #e90; }\n\n/* line 128, node_modules/prismjs/themes/prism.css */\n.token.important,\n.token.bold {\n  font-weight: bold; }\n\n/* line 132, node_modules/prismjs/themes/prism.css */\n.token.italic {\n  font-style: italic; }\n\n/* line 136, node_modules/prismjs/themes/prism.css */\n.token.entity {\n  cursor: help; }\n\n/* line 1, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\npre[class*=\"language-\"].line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber; }\n\n/* line 7, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\npre[class*=\"language-\"].line-numbers > code {\n  position: relative;\n  white-space: inherit; }\n\n/* line 12, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n/* line 29, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber; }\n\n/* line 35, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right; }\n\n/* line 1, src/styles/common/_mixins.scss */\n.link {\n  color: inherit;\n  cursor: pointer;\n  text-decoration: none; }\n\n/* line 7, src/styles/common/_mixins.scss */\n.link--accent {\n  color: var(--primary-color);\n  text-decoration: none; }\n\n/* line 22, src/styles/common/_mixins.scss */\n.u-absolute0 {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0; }\n\n/* line 30, src/styles/common/_mixins.scss */\n.u-textColorDarker {\n  color: rgba(0, 0, 0, 0.8) !important;\n  fill: rgba(0, 0, 0, 0.8) !important; }\n\n/* line 35, src/styles/common/_mixins.scss */\n.warning::before, .note::before, .success::before, [class^=\"i-\"]::before, [class*=\" i-\"]::before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  /* stylelint-disable-line */\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n/* line 2, src/styles/autoload/_zoom.scss */\nimg[data-action=\"zoom\"] {\n  cursor: zoom-in; }\n\n/* line 5, src/styles/autoload/_zoom.scss */\n.zoom-img,\n.zoom-img-wrap {\n  position: relative;\n  z-index: 666;\n  -webkit-transition: all 300ms;\n  -o-transition: all 300ms;\n  transition: all 300ms; }\n\n/* line 13, src/styles/autoload/_zoom.scss */\nimg.zoom-img {\n  cursor: pointer;\n  cursor: -webkit-zoom-out;\n  cursor: -moz-zoom-out; }\n\n/* line 18, src/styles/autoload/_zoom.scss */\n.zoom-overlay {\n  z-index: 420;\n  background: #fff;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  pointer-events: none;\n  filter: \"alpha(opacity=0)\";\n  opacity: 0;\n  -webkit-transition: opacity 300ms;\n  -o-transition: opacity 300ms;\n  transition: opacity 300ms; }\n\n/* line 33, src/styles/autoload/_zoom.scss */\n.zoom-overlay-open .zoom-overlay {\n  filter: \"alpha(opacity=100)\";\n  opacity: 1; }\n\n/* line 37, src/styles/autoload/_zoom.scss */\n.zoom-overlay-open,\n.zoom-overlay-transitioning {\n  cursor: default; }\n\n/* line 1, src/styles/common/_global.scss */\n:root {\n  --black: #000;\n  --white: #fff;\n  --primary-color: #1C9963;\n  --secondary-color: #2ad88d;\n  --header-color: #BBF1B9;\n  --header-color-hover: #EEFFEA;\n  --post-color-link: #2ad88d;\n  --story-cover-category-color: #2ad88d;\n  --composite-color: #CC116E;\n  --footer-color-link: #2ad88d;\n  --media-type-color: #2ad88d; }\n\n/* line 15, src/styles/common/_global.scss */\n*, *::before, *::after {\n  box-sizing: border-box; }\n\n/* line 19, src/styles/common/_global.scss */\na {\n  color: inherit;\n  text-decoration: none; }\n  /* line 23, src/styles/common/_global.scss */\n  a:active, a:hover {\n    outline: 0; }\n\n/* line 29, src/styles/common/_global.scss */\nblockquote {\n  border-left: 3px solid #000;\n  color: #000;\n  font-family: \"Merriweather\", serif;\n  font-size: 1.1875rem;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin: 30px 0 0 -12px;\n  padding-bottom: 2px;\n  padding-left: 20px; }\n  /* line 42, src/styles/common/_global.scss */\n  blockquote p:first-of-type {\n    margin-top: 0; }\n\n/* line 45, src/styles/common/_global.scss */\nbody {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Ruda\", sans-serif;\n  font-size: 16px;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin: 0 auto;\n  text-rendering: optimizeLegibility;\n  overflow-x: hidden; }\n\n/* line 59, src/styles/common/_global.scss */\nhtml {\n  box-sizing: border-box;\n  font-size: 16px; }\n\n/* line 64, src/styles/common/_global.scss */\nfigure {\n  margin: 0; }\n\n/* line 68, src/styles/common/_global.scss */\nfigcaption {\n  color: rgba(0, 0, 0, 0.68);\n  display: block;\n  font-family: \"Merriweather\", serif;\n  font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%; }\n\n/* line 89, src/styles/common/_global.scss */\nkbd, samp, code {\n  background: #f7f7f7;\n  border-radius: 4px;\n  color: #c7254e;\n  font-family: \"Fira Mono\", monospace !important;\n  font-size: 15px;\n  padding: 4px 6px;\n  white-space: pre-wrap; }\n\n/* line 99, src/styles/common/_global.scss */\npre {\n  background-color: #f7f7f7 !important;\n  border-radius: 4px;\n  font-family: \"Fira Mono\", monospace !important;\n  font-size: 15px;\n  margin-top: 30px !important;\n  max-width: 100%;\n  overflow: hidden;\n  padding: 1rem;\n  position: relative;\n  word-wrap: normal; }\n  /* line 111, src/styles/common/_global.scss */\n  pre code {\n    background: transparent;\n    color: #37474f;\n    padding: 0;\n    text-shadow: 0 1px #fff; }\n\n/* line 119, src/styles/common/_global.scss */\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: #37474f;\n  line-height: 1.4; }\n  /* line 124, src/styles/common/_global.scss */\n  code[class*=language-] .token.comment,\n  pre[class*=language-] .token.comment {\n    opacity: .8; }\n  /* line 126, src/styles/common/_global.scss */\n  code[class*=language-].line-numbers,\n  pre[class*=language-].line-numbers {\n    padding-left: 58px; }\n    /* line 129, src/styles/common/_global.scss */\n    code[class*=language-].line-numbers::before,\n    pre[class*=language-].line-numbers::before {\n      content: \"\";\n      position: absolute;\n      left: 0;\n      top: 0;\n      background: #F0EDEE;\n      width: 40px;\n      height: 100%; }\n  /* line 140, src/styles/common/_global.scss */\n  code[class*=language-] .line-numbers-rows,\n  pre[class*=language-] .line-numbers-rows {\n    border-right: none;\n    top: -3px;\n    left: -58px; }\n    /* line 145, src/styles/common/_global.scss */\n    code[class*=language-] .line-numbers-rows > span::before,\n    pre[class*=language-] .line-numbers-rows > span::before {\n      padding-right: 0;\n      text-align: center;\n      opacity: .8; }\n\n/* line 155, src/styles/common/_global.scss */\nhr:not(.hr-list):not(.post-footer-hr) {\n  border: 0;\n  display: block;\n  margin: 50px auto;\n  text-align: center; }\n  /* line 161, src/styles/common/_global.scss */\n  hr:not(.hr-list):not(.post-footer-hr)::before {\n    color: rgba(0, 0, 0, 0.6);\n    content: '...';\n    display: inline-block;\n    font-family: \"Ruda\", sans-serif;\n    font-size: 28px;\n    font-weight: 400;\n    letter-spacing: .6em;\n    position: relative;\n    top: -25px; }\n\n/* line 174, src/styles/common/_global.scss */\n.post-footer-hr {\n  height: 1px;\n  margin: 32px 0;\n  border: 0;\n  background-color: #ddd; }\n\n/* line 181, src/styles/common/_global.scss */\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto; }\n  /* line 187, src/styles/common/_global.scss */\n  img:not([src]) {\n    visibility: hidden; }\n\n/* line 192, src/styles/common/_global.scss */\ni {\n  vertical-align: middle; }\n\n/* line 197, src/styles/common/_global.scss */\ninput {\n  border: none;\n  outline: 0; }\n\n/* line 202, src/styles/common/_global.scss */\nol, ul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0; }\n\n/* line 209, src/styles/common/_global.scss */\nmark {\n  background-color: transparent !important;\n  background-image: linear-gradient(to bottom, #d7fdd3, #d7fdd3);\n  color: rgba(0, 0, 0, 0.8); }\n\n/* line 215, src/styles/common/_global.scss */\nq {\n  color: rgba(0, 0, 0, 0.44);\n  display: block;\n  font-size: 28px;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.014em;\n  line-height: 1.48;\n  padding-left: 50px;\n  padding-top: 15px;\n  text-align: left; }\n  /* line 227, src/styles/common/_global.scss */\n  q::before, q::after {\n    display: none; }\n\n/* line 230, src/styles/common/_global.scss */\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch; }\n  /* line 245, src/styles/common/_global.scss */\n  table th,\n  table td {\n    padding: 6px 13px;\n    border: 1px solid #dfe2e5; }\n  /* line 251, src/styles/common/_global.scss */\n  table tr:nth-child(2n) {\n    background-color: #f6f8fa; }\n  /* line 255, src/styles/common/_global.scss */\n  table th {\n    letter-spacing: 0.2px;\n    text-transform: uppercase;\n    font-weight: 600; }\n\n/* line 269, src/styles/common/_global.scss */\n.link--underline:active, .link--underline:focus, .link--underline:hover {\n  text-decoration: underline; }\n\n/* line 279, src/styles/common/_global.scss */\n.main {\n  margin-bottom: 4em;\n  min-height: 90vh; }\n\n/* line 281, src/styles/common/_global.scss */\n.main,\n.footer {\n  transition: transform .5s ease; }\n\n/* line 286, src/styles/common/_global.scss */\n.warning {\n  background: #fbe9e7;\n  color: #d50000; }\n  /* line 289, src/styles/common/_global.scss */\n  .warning::before {\n    content: \"\"; }\n\n/* line 292, src/styles/common/_global.scss */\n.note {\n  background: #e1f5fe;\n  color: #0288d1; }\n  /* line 295, src/styles/common/_global.scss */\n  .note::before {\n    content: \"\"; }\n\n/* line 298, src/styles/common/_global.scss */\n.success {\n  background: #e0f2f1;\n  color: #00897b; }\n  /* line 301, src/styles/common/_global.scss */\n  .success::before {\n    color: #00bfa5;\n    content: \"\"; }\n\n/* line 304, src/styles/common/_global.scss */\n.warning, .note, .success {\n  display: block;\n  font-size: 18px !important;\n  line-height: 1.58 !important;\n  margin-top: 28px;\n  padding: 12px 24px 12px 60px; }\n  /* line 311, src/styles/common/_global.scss */\n  .warning a, .note a, .success a {\n    color: inherit;\n    text-decoration: underline; }\n  /* line 316, src/styles/common/_global.scss */\n  .warning::before, .note::before, .success::before {\n    float: left;\n    font-size: 24px;\n    margin-left: -36px;\n    margin-top: -5px; }\n\n/* line 329, src/styles/common/_global.scss */\n.tag-description {\n  max-width: 500px; }\n\n/* line 330, src/styles/common/_global.scss */\n.tag.has--image {\n  min-height: 350px; }\n\n/* line 335, src/styles/common/_global.scss */\n.with-tooltip {\n  overflow: visible;\n  position: relative; }\n  /* line 339, src/styles/common/_global.scss */\n  .with-tooltip::after {\n    background: rgba(0, 0, 0, 0.85);\n    border-radius: 4px;\n    color: #fff;\n    content: attr(data-tooltip);\n    display: inline-block;\n    font-size: 12px;\n    font-weight: 600;\n    left: 50%;\n    line-height: 1.25;\n    min-width: 130px;\n    opacity: 0;\n    padding: 4px 8px;\n    pointer-events: none;\n    position: absolute;\n    text-align: center;\n    text-transform: none;\n    top: -30px;\n    will-change: opacity, transform;\n    z-index: 1; }\n  /* line 361, src/styles/common/_global.scss */\n  .with-tooltip:hover::after {\n    animation: tooltip .1s ease-out both; }\n\n/* line 368, src/styles/common/_global.scss */\n.errorPage {\n  font-family: 'Roboto Mono', monospace; }\n  /* line 371, src/styles/common/_global.scss */\n  .errorPage-link {\n    left: -5px;\n    padding: 24px 60px;\n    top: -6px; }\n  /* line 377, src/styles/common/_global.scss */\n  .errorPage-text {\n    margin-top: 60px;\n    white-space: pre-wrap; }\n  /* line 382, src/styles/common/_global.scss */\n  .errorPage-wrap {\n    color: rgba(0, 0, 0, 0.4);\n    padding: 7vw 4vw; }\n\n/* line 390, src/styles/common/_global.scss */\n.video-responsive {\n  display: block;\n  height: 0;\n  margin-top: 30px;\n  overflow: hidden;\n  padding: 0 0 56.25%;\n  position: relative;\n  width: 100%; }\n  /* line 399, src/styles/common/_global.scss */\n  .video-responsive iframe {\n    border: 0;\n    bottom: 0;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%; }\n  /* line 409, src/styles/common/_global.scss */\n  .video-responsive video {\n    border: 0;\n    bottom: 0;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%; }\n\n/* line 420, src/styles/common/_global.scss */\n.kg-embed-card .video-responsive {\n  margin-top: 0; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-facebook {\n  color: #3b5998 !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-facebook, .sideNav-follow .i-facebook {\n  background-color: #3b5998 !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-twitter {\n  color: #55acee !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-twitter, .sideNav-follow .i-twitter {\n  background-color: #55acee !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-google {\n  color: #dd4b39 !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-google, .sideNav-follow .i-google {\n  background-color: #dd4b39 !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-instagram {\n  color: #306088 !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-instagram, .sideNav-follow .i-instagram {\n  background-color: #306088 !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-youtube {\n  color: #e52d27 !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-youtube, .sideNav-follow .i-youtube {\n  background-color: #e52d27 !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-github {\n  color: #555 !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-github, .sideNav-follow .i-github {\n  background-color: #555 !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-linkedin {\n  color: #007bb6 !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-linkedin, .sideNav-follow .i-linkedin {\n  background-color: #007bb6 !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-spotify {\n  color: #2ebd59 !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-spotify, .sideNav-follow .i-spotify {\n  background-color: #2ebd59 !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-codepen {\n  color: #222 !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-codepen, .sideNav-follow .i-codepen {\n  background-color: #222 !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-behance {\n  color: #131418 !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-behance, .sideNav-follow .i-behance {\n  background-color: #131418 !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-dribbble {\n  color: #ea4c89 !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-dribbble, .sideNav-follow .i-dribbble {\n  background-color: #ea4c89 !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-flickr {\n  color: #0063dc !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-flickr, .sideNav-follow .i-flickr {\n  background-color: #0063dc !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-reddit {\n  color: #ff4500 !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-reddit, .sideNav-follow .i-reddit {\n  background-color: #ff4500 !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-pocket {\n  color: #f50057 !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-pocket, .sideNav-follow .i-pocket {\n  background-color: #f50057 !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-pinterest {\n  color: #bd081c !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-pinterest, .sideNav-follow .i-pinterest {\n  background-color: #bd081c !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-whatsapp {\n  color: #64d448 !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-whatsapp, .sideNav-follow .i-whatsapp {\n  background-color: #64d448 !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-telegram {\n  color: #08c !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-telegram, .sideNav-follow .i-telegram {\n  background-color: #08c !important; }\n\n/* line 425, src/styles/common/_global.scss */\n.c-rss {\n  color: orange !important; }\n\n/* line 426, src/styles/common/_global.scss */\n.bg-rss, .sideNav-follow .i-rss {\n  background-color: orange !important; }\n\n/* line 449, src/styles/common/_global.scss */\n.rocket {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  width: 60px;\n  z-index: 5; }\n  /* line 457, src/styles/common/_global.scss */\n  .rocket:hover svg path {\n    fill: rgba(0, 0, 0, 0.6); }\n\n/* line 462, src/styles/common/_global.scss */\n.svgIcon {\n  display: inline-block; }\n\n/* line 466, src/styles/common/_global.scss */\nsvg {\n  height: auto;\n  width: 100%; }\n\n/* line 474, src/styles/common/_global.scss */\n.load-more {\n  max-width: 70% !important; }\n\n/* line 479, src/styles/common/_global.scss */\n.loadingBar {\n  background-color: #48e79a;\n  display: none;\n  height: 2px;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  z-index: 800; }\n\n/* line 491, src/styles/common/_global.scss */\n.is-loading .loadingBar {\n  animation: loading-bar 1s ease-in-out infinite;\n  animation-delay: .8s;\n  display: block; }\n\n@media only screen and (max-width: 766px) {\n  /* line 500, src/styles/common/_global.scss */\n  blockquote {\n    margin-left: -5px;\n    font-size: 1.125rem; }\n  /* line 502, src/styles/common/_global.scss */\n  .kg-image-card,\n  .kg-embed-card {\n    margin-right: -20px;\n    margin-left: -20px; } }\n\n/* line 2, src/styles/components/_grid.scss */\n.extreme-container {\n  box-sizing: border-box;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding: 0 16px;\n  width: 100%; }\n\n/* line 25, src/styles/components/_grid.scss */\n.col-left,\n.cc-video-left {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%;\n  padding-right: 10px;\n  padding-left: 10px; }\n\n@media only screen and (min-width: 1000px) {\n  /* line 38, src/styles/components/_grid.scss */\n  .col-left {\n    max-width: calc(100% - 340px); }\n  /* line 39, src/styles/components/_grid.scss */\n  .cc-video-left {\n    max-width: calc(100% - 320px); }\n  /* line 40, src/styles/components/_grid.scss */\n  .cc-video-right {\n    flex-basis: 320px !important;\n    max-width: 320px !important; }\n  /* line 41, src/styles/components/_grid.scss */\n  body.is-article .col-left {\n    padding-right: 40px; } }\n\n/* line 44, src/styles/components/_grid.scss */\n.col-right {\n  display: flex;\n  flex-direction: column;\n  padding-left: 10px;\n  padding-right: 10px;\n  width: 320px; }\n\n/* line 52, src/styles/components/_grid.scss */\n.row {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  flex: 0 1 auto;\n  margin-left: -10px;\n  margin-right: -10px; }\n  /* line 60, src/styles/components/_grid.scss */\n  .row .col {\n    flex: 0 0 auto;\n    box-sizing: border-box;\n    padding-left: 10px;\n    padding-right: 10px; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s1 {\n      flex-basis: 8.33333%;\n      max-width: 8.33333%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s2 {\n      flex-basis: 16.66667%;\n      max-width: 16.66667%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s3 {\n      flex-basis: 25%;\n      max-width: 25%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s4 {\n      flex-basis: 33.33333%;\n      max-width: 33.33333%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s5 {\n      flex-basis: 41.66667%;\n      max-width: 41.66667%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s6 {\n      flex-basis: 50%;\n      max-width: 50%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s7 {\n      flex-basis: 58.33333%;\n      max-width: 58.33333%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s8 {\n      flex-basis: 66.66667%;\n      max-width: 66.66667%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s9 {\n      flex-basis: 75%;\n      max-width: 75%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s10 {\n      flex-basis: 83.33333%;\n      max-width: 83.33333%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s11 {\n      flex-basis: 91.66667%;\n      max-width: 91.66667%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s12 {\n      flex-basis: 100%;\n      max-width: 100%; }\n    @media only screen and (min-width: 766px) {\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m1 {\n        flex-basis: 8.33333%;\n        max-width: 8.33333%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m2 {\n        flex-basis: 16.66667%;\n        max-width: 16.66667%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m3 {\n        flex-basis: 25%;\n        max-width: 25%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m4 {\n        flex-basis: 33.33333%;\n        max-width: 33.33333%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m5 {\n        flex-basis: 41.66667%;\n        max-width: 41.66667%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m6 {\n        flex-basis: 50%;\n        max-width: 50%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m7 {\n        flex-basis: 58.33333%;\n        max-width: 58.33333%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m8 {\n        flex-basis: 66.66667%;\n        max-width: 66.66667%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m9 {\n        flex-basis: 75%;\n        max-width: 75%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m10 {\n        flex-basis: 83.33333%;\n        max-width: 83.33333%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m11 {\n        flex-basis: 91.66667%;\n        max-width: 91.66667%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m12 {\n        flex-basis: 100%;\n        max-width: 100%; } }\n    @media only screen and (min-width: 1000px) {\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l1 {\n        flex-basis: 8.33333%;\n        max-width: 8.33333%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l2 {\n        flex-basis: 16.66667%;\n        max-width: 16.66667%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l3 {\n        flex-basis: 25%;\n        max-width: 25%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l4 {\n        flex-basis: 33.33333%;\n        max-width: 33.33333%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l5 {\n        flex-basis: 41.66667%;\n        max-width: 41.66667%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l6 {\n        flex-basis: 50%;\n        max-width: 50%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l7 {\n        flex-basis: 58.33333%;\n        max-width: 58.33333%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l8 {\n        flex-basis: 66.66667%;\n        max-width: 66.66667%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l9 {\n        flex-basis: 75%;\n        max-width: 75%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l10 {\n        flex-basis: 83.33333%;\n        max-width: 83.33333%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l11 {\n        flex-basis: 91.66667%;\n        max-width: 91.66667%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l12 {\n        flex-basis: 100%;\n        max-width: 100%; } }\n\n/* line 3, src/styles/common/_typography.scss */\nh1, h2, h3, h4, h5, h6 {\n  color: inherit;\n  font-family: \"Ruda\", sans-serif;\n  font-weight: 600;\n  line-height: 1.1;\n  margin: 0; }\n  /* line 10, src/styles/common/_typography.scss */\n  h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {\n    color: inherit;\n    line-height: inherit; }\n\n/* line 16, src/styles/common/_typography.scss */\nh1 {\n  font-size: 2rem; }\n\n/* line 17, src/styles/common/_typography.scss */\nh2 {\n  font-size: 1.875rem; }\n\n/* line 18, src/styles/common/_typography.scss */\nh3 {\n  font-size: 1.6rem; }\n\n/* line 19, src/styles/common/_typography.scss */\nh4 {\n  font-size: 1.4rem; }\n\n/* line 20, src/styles/common/_typography.scss */\nh5 {\n  font-size: 1.2rem; }\n\n/* line 21, src/styles/common/_typography.scss */\nh6 {\n  font-size: 1rem; }\n\n/* line 23, src/styles/common/_typography.scss */\np {\n  margin: 0; }\n\n/* line 2, src/styles/common/_utilities.scss */\n.u-textColorNormal {\n  color: #999999 !important;\n  fill: #999999 !important; }\n\n/* line 9, src/styles/common/_utilities.scss */\n.u-textColorWhite {\n  color: #fff !important;\n  fill: #fff !important; }\n\n/* line 14, src/styles/common/_utilities.scss */\n.u-hoverColorNormal:hover {\n  color: rgba(0, 0, 0, 0.6);\n  fill: rgba(0, 0, 0, 0.6); }\n\n/* line 19, src/styles/common/_utilities.scss */\n.u-accentColor--iconNormal {\n  color: #1C9963;\n  fill: #1C9963; }\n\n/* line 25, src/styles/common/_utilities.scss */\n.u-bgColor {\n  background-color: var(--primary-color); }\n\n/* line 30, src/styles/common/_utilities.scss */\n.u-relative {\n  position: relative; }\n\n/* line 31, src/styles/common/_utilities.scss */\n.u-absolute {\n  position: absolute; }\n\n/* line 33, src/styles/common/_utilities.scss */\n.u-fixed {\n  position: fixed !important; }\n\n/* line 35, src/styles/common/_utilities.scss */\n.u-block {\n  display: block !important; }\n\n/* line 36, src/styles/common/_utilities.scss */\n.u-inlineBlock {\n  display: inline-block; }\n\n/* line 39, src/styles/common/_utilities.scss */\n.u-backgroundDark {\n  background-color: #0d0f10;\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1; }\n\n/* line 50, src/styles/common/_utilities.scss */\n.u-gradient {\n  background: linear-gradient(to bottom, transparent 20%, #000 100%);\n  bottom: 0;\n  height: 90%;\n  left: 0;\n  position: absolute;\n  right: 0;\n  z-index: 1; }\n\n/* line 61, src/styles/common/_utilities.scss */\n.zindex1 {\n  z-index: 1; }\n\n/* line 62, src/styles/common/_utilities.scss */\n.zindex2 {\n  z-index: 2; }\n\n/* line 63, src/styles/common/_utilities.scss */\n.zindex3 {\n  z-index: 3; }\n\n/* line 64, src/styles/common/_utilities.scss */\n.zindex4 {\n  z-index: 4; }\n\n/* line 67, src/styles/common/_utilities.scss */\n.u-backgroundWhite {\n  background-color: #fafafa; }\n\n/* line 68, src/styles/common/_utilities.scss */\n.u-backgroundColorGrayLight {\n  background-color: #f0f0f0 !important; }\n\n/* line 71, src/styles/common/_utilities.scss */\n.u-clear::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n/* line 78, src/styles/common/_utilities.scss */\n.u-fontSizeMicro {\n  font-size: 11px; }\n\n/* line 79, src/styles/common/_utilities.scss */\n.u-fontSizeSmallest {\n  font-size: 12px; }\n\n/* line 80, src/styles/common/_utilities.scss */\n.u-fontSize13 {\n  font-size: 13px; }\n\n/* line 81, src/styles/common/_utilities.scss */\n.u-fontSizeSmaller {\n  font-size: 14px; }\n\n/* line 82, src/styles/common/_utilities.scss */\n.u-fontSize15 {\n  font-size: 15px; }\n\n/* line 83, src/styles/common/_utilities.scss */\n.u-fontSizeSmall {\n  font-size: 16px; }\n\n/* line 84, src/styles/common/_utilities.scss */\n.u-fontSizeBase {\n  font-size: 18px; }\n\n/* line 85, src/styles/common/_utilities.scss */\n.u-fontSize20 {\n  font-size: 20px; }\n\n/* line 86, src/styles/common/_utilities.scss */\n.u-fontSize21 {\n  font-size: 21px; }\n\n/* line 87, src/styles/common/_utilities.scss */\n.u-fontSize22 {\n  font-size: 22px; }\n\n/* line 88, src/styles/common/_utilities.scss */\n.u-fontSizeLarge {\n  font-size: 24px; }\n\n/* line 89, src/styles/common/_utilities.scss */\n.u-fontSize26 {\n  font-size: 26px; }\n\n/* line 90, src/styles/common/_utilities.scss */\n.u-fontSize28 {\n  font-size: 28px; }\n\n/* line 91, src/styles/common/_utilities.scss */\n.u-fontSizeLarger, .media-type {\n  font-size: 32px; }\n\n/* line 92, src/styles/common/_utilities.scss */\n.u-fontSize36 {\n  font-size: 36px; }\n\n/* line 93, src/styles/common/_utilities.scss */\n.u-fontSize40 {\n  font-size: 40px; }\n\n/* line 94, src/styles/common/_utilities.scss */\n.u-fontSizeLargest {\n  font-size: 44px; }\n\n/* line 95, src/styles/common/_utilities.scss */\n.u-fontSizeJumbo {\n  font-size: 50px; }\n\n@media only screen and (max-width: 766px) {\n  /* line 98, src/styles/common/_utilities.scss */\n  .u-md-fontSizeBase {\n    font-size: 18px; }\n  /* line 99, src/styles/common/_utilities.scss */\n  .u-md-fontSize22 {\n    font-size: 22px; }\n  /* line 100, src/styles/common/_utilities.scss */\n  .u-md-fontSizeLarger {\n    font-size: 32px; } }\n\n/* line 116, src/styles/common/_utilities.scss */\n.u-fontWeightThin {\n  font-weight: 300; }\n\n/* line 117, src/styles/common/_utilities.scss */\n.u-fontWeightNormal {\n  font-weight: 400; }\n\n/* line 119, src/styles/common/_utilities.scss */\n.u-fontWeightSemibold {\n  font-weight: 600 !important; }\n\n/* line 120, src/styles/common/_utilities.scss */\n.u-fontWeightBold {\n  font-weight: 700; }\n\n/* line 121, src/styles/common/_utilities.scss */\n.u-fontWeightBolder {\n  font-weight: 900; }\n\n/* line 123, src/styles/common/_utilities.scss */\n.u-textUppercase {\n  text-transform: uppercase; }\n\n/* line 124, src/styles/common/_utilities.scss */\n.u-textCapitalize {\n  text-transform: capitalize; }\n\n/* line 125, src/styles/common/_utilities.scss */\n.u-textAlignCenter {\n  text-align: center; }\n\n/* line 127, src/styles/common/_utilities.scss */\n.u-noWrapWithEllipsis {\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important; }\n\n/* line 134, src/styles/common/_utilities.scss */\n.u-marginAuto {\n  margin-left: auto;\n  margin-right: auto; }\n\n/* line 135, src/styles/common/_utilities.scss */\n.u-marginTop20 {\n  margin-top: 20px; }\n\n/* line 136, src/styles/common/_utilities.scss */\n.u-marginTop30 {\n  margin-top: 30px; }\n\n/* line 137, src/styles/common/_utilities.scss */\n.u-marginBottom10 {\n  margin-bottom: 10px; }\n\n/* line 138, src/styles/common/_utilities.scss */\n.u-marginBottom15 {\n  margin-bottom: 15px; }\n\n/* line 139, src/styles/common/_utilities.scss */\n.u-marginBottom20 {\n  margin-bottom: 20px !important; }\n\n/* line 140, src/styles/common/_utilities.scss */\n.u-marginBottom30 {\n  margin-bottom: 30px; }\n\n/* line 141, src/styles/common/_utilities.scss */\n.u-marginBottom40 {\n  margin-bottom: 40px; }\n\n/* line 144, src/styles/common/_utilities.scss */\n.u-padding0 {\n  padding: 0 !important; }\n\n/* line 145, src/styles/common/_utilities.scss */\n.u-padding20 {\n  padding: 20px; }\n\n/* line 146, src/styles/common/_utilities.scss */\n.u-padding15 {\n  padding: 15px !important; }\n\n/* line 147, src/styles/common/_utilities.scss */\n.u-paddingBottom2 {\n  padding-bottom: 2px; }\n\n/* line 148, src/styles/common/_utilities.scss */\n.u-paddingBottom30 {\n  padding-bottom: 30px; }\n\n/* line 149, src/styles/common/_utilities.scss */\n.u-paddingBottom20 {\n  padding-bottom: 20px; }\n\n/* line 150, src/styles/common/_utilities.scss */\n.u-paddingRight10 {\n  padding-right: 10px; }\n\n/* line 151, src/styles/common/_utilities.scss */\n.u-paddingLeft15 {\n  padding-left: 15px; }\n\n/* line 153, src/styles/common/_utilities.scss */\n.u-paddingTop2 {\n  padding-top: 2px; }\n\n/* line 154, src/styles/common/_utilities.scss */\n.u-paddingTop5 {\n  padding-top: 5px; }\n\n/* line 155, src/styles/common/_utilities.scss */\n.u-paddingTop10 {\n  padding-top: 10px; }\n\n/* line 156, src/styles/common/_utilities.scss */\n.u-paddingTop15 {\n  padding-top: 15px; }\n\n/* line 157, src/styles/common/_utilities.scss */\n.u-paddingTop20 {\n  padding-top: 20px; }\n\n/* line 158, src/styles/common/_utilities.scss */\n.u-paddingTop30 {\n  padding-top: 30px; }\n\n/* line 160, src/styles/common/_utilities.scss */\n.u-paddingBottom15 {\n  padding-bottom: 15px; }\n\n/* line 162, src/styles/common/_utilities.scss */\n.u-paddingRight20 {\n  padding-right: 20px; }\n\n/* line 163, src/styles/common/_utilities.scss */\n.u-paddingLeft20 {\n  padding-left: 20px; }\n\n/* line 165, src/styles/common/_utilities.scss */\n.u-contentTitle {\n  font-family: \"Ruda\", sans-serif;\n  font-style: normal;\n  font-weight: 900;\n  letter-spacing: -.028em; }\n\n/* line 173, src/styles/common/_utilities.scss */\n.u-lineHeight1 {\n  line-height: 1; }\n\n/* line 174, src/styles/common/_utilities.scss */\n.u-lineHeightTight {\n  line-height: 1.2; }\n\n/* line 177, src/styles/common/_utilities.scss */\n.u-overflowHidden {\n  overflow: hidden; }\n\n/* line 180, src/styles/common/_utilities.scss */\n.u-floatRight {\n  float: right; }\n\n/* line 181, src/styles/common/_utilities.scss */\n.u-floatLeft {\n  float: left; }\n\n/* line 184, src/styles/common/_utilities.scss */\n.u-flex {\n  display: flex; }\n\n/* line 185, src/styles/common/_utilities.scss */\n.u-flexCenter, .media-type {\n  align-items: center;\n  display: flex; }\n\n/* line 186, src/styles/common/_utilities.scss */\n.u-flexContentCenter, .media-type {\n  justify-content: center; }\n\n/* line 188, src/styles/common/_utilities.scss */\n.u-flex1 {\n  flex: 1 1 auto; }\n\n/* line 189, src/styles/common/_utilities.scss */\n.u-flex0 {\n  flex: 0 0 auto; }\n\n/* line 190, src/styles/common/_utilities.scss */\n.u-flexWrap {\n  flex-wrap: wrap; }\n\n/* line 192, src/styles/common/_utilities.scss */\n.u-flexColumn {\n  display: flex;\n  flex-direction: column;\n  justify-content: center; }\n\n/* line 198, src/styles/common/_utilities.scss */\n.u-flexEnd {\n  align-items: center;\n  justify-content: flex-end; }\n\n/* line 203, src/styles/common/_utilities.scss */\n.u-flexColumnTop {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start; }\n\n/* line 210, src/styles/common/_utilities.scss */\n.u-backgroundSizeCover {\n  background-origin: border-box;\n  background-position: center;\n  background-size: cover; }\n\n/* line 217, src/styles/common/_utilities.scss */\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 20px;\n  padding-right: 20px; }\n\n/* line 224, src/styles/common/_utilities.scss */\n.u-maxWidth1200 {\n  max-width: 1200px; }\n\n/* line 225, src/styles/common/_utilities.scss */\n.u-maxWidth1000 {\n  max-width: 1000px; }\n\n/* line 226, src/styles/common/_utilities.scss */\n.u-maxWidth740 {\n  max-width: 740px; }\n\n/* line 227, src/styles/common/_utilities.scss */\n.u-maxWidth1040 {\n  max-width: 1040px; }\n\n/* line 228, src/styles/common/_utilities.scss */\n.u-sizeFullWidth {\n  width: 100%; }\n\n/* line 229, src/styles/common/_utilities.scss */\n.u-sizeFullHeight {\n  height: 100%; }\n\n/* line 232, src/styles/common/_utilities.scss */\n.u-borderLighter {\n  border: 1px solid rgba(0, 0, 0, 0.15); }\n\n/* line 233, src/styles/common/_utilities.scss */\n.u-round, .avatar-image, .media-type {\n  border-radius: 50%; }\n\n/* line 234, src/styles/common/_utilities.scss */\n.u-borderRadius2 {\n  border-radius: 2px; }\n\n/* line 236, src/styles/common/_utilities.scss */\n.u-boxShadowBottom {\n  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.05); }\n\n/* line 241, src/styles/common/_utilities.scss */\n.u-height540 {\n  height: 540px; }\n\n/* line 242, src/styles/common/_utilities.scss */\n.u-height280 {\n  height: 280px; }\n\n/* line 243, src/styles/common/_utilities.scss */\n.u-height260 {\n  height: 260px; }\n\n/* line 244, src/styles/common/_utilities.scss */\n.u-height100 {\n  height: 100px; }\n\n/* line 245, src/styles/common/_utilities.scss */\n.u-borderBlackLightest {\n  border: 1px solid rgba(0, 0, 0, 0.1); }\n\n/* line 248, src/styles/common/_utilities.scss */\n.u-hide {\n  display: none !important; }\n\n/* line 251, src/styles/common/_utilities.scss */\n.u-card {\n  background: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.09);\n  border-radius: 3px;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  margin-bottom: 10px;\n  padding: 10px 20px 15px; }\n\n/* line 262, src/styles/common/_utilities.scss */\n.title-line {\n  position: relative;\n  text-align: center;\n  width: 100%; }\n  /* line 267, src/styles/common/_utilities.scss */\n  .title-line::before {\n    content: '';\n    background: rgba(255, 255, 255, 0.3);\n    display: inline-block;\n    position: absolute;\n    left: 0;\n    bottom: 50%;\n    width: 100%;\n    height: 1px;\n    z-index: 0; }\n\n/* line 281, src/styles/common/_utilities.scss */\n.u-oblique {\n  background-color: var(--composite-color);\n  color: #fff;\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 700;\n  line-height: 1;\n  padding: 5px 13px;\n  text-transform: uppercase;\n  transform: skewX(-15deg); }\n\n/* line 293, src/styles/common/_utilities.scss */\n.no-avatar {\n  background-image: url(\"../images/avatar.png\") !important; }\n\n@media only screen and (max-width: 766px) {\n  /* line 298, src/styles/common/_utilities.scss */\n  .u-hide-before-md {\n    display: none !important; }\n  /* line 299, src/styles/common/_utilities.scss */\n  .u-md-heightAuto {\n    height: auto; }\n  /* line 300, src/styles/common/_utilities.scss */\n  .u-md-height170 {\n    height: 170px; }\n  /* line 301, src/styles/common/_utilities.scss */\n  .u-md-relative {\n    position: relative; } }\n\n@media only screen and (max-width: 1000px) {\n  /* line 304, src/styles/common/_utilities.scss */\n  .u-hide-before-lg {\n    display: none !important; } }\n\n@media only screen and (min-width: 766px) {\n  /* line 307, src/styles/common/_utilities.scss */\n  .u-hide-after-md {\n    display: none !important; } }\n\n@media only screen and (min-width: 1000px) {\n  /* line 309, src/styles/common/_utilities.scss */\n  .u-hide-after-lg {\n    display: none !important; } }\n\n/* line 1, src/styles/components/_form.scss */\n.button {\n  background: transparent;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  box-sizing: border-box;\n  color: rgba(0, 0, 0, 0.44);\n  cursor: pointer;\n  display: inline-block;\n  font-family: \"Ruda\", sans-serif;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  height: 37px;\n  letter-spacing: 0;\n  line-height: 35px;\n  padding: 0 16px;\n  position: relative;\n  text-align: center;\n  text-decoration: none;\n  text-rendering: optimizeLegibility;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap; }\n  /* line 25, src/styles/components/_form.scss */\n  .button--chromeless {\n    border-radius: 0;\n    border-width: 0;\n    box-shadow: none;\n    color: rgba(0, 0, 0, 0.44);\n    height: auto;\n    line-height: inherit;\n    padding: 0;\n    text-align: left;\n    vertical-align: baseline;\n    white-space: normal; }\n    /* line 37, src/styles/components/_form.scss */\n    .button--chromeless:active, .button--chromeless:hover, .button--chromeless:focus {\n      border-width: 0;\n      color: rgba(0, 0, 0, 0.6); }\n  /* line 45, src/styles/components/_form.scss */\n  .button--large {\n    font-size: 15px;\n    height: 44px;\n    line-height: 42px;\n    padding: 0 18px; }\n  /* line 52, src/styles/components/_form.scss */\n  .button--dark {\n    background: rgba(0, 0, 0, 0.84);\n    border-color: rgba(0, 0, 0, 0.84);\n    color: rgba(255, 255, 255, 0.97); }\n    /* line 57, src/styles/components/_form.scss */\n    .button--dark:hover {\n      background: #1C9963;\n      border-color: #1C9963; }\n\n/* line 65, src/styles/components/_form.scss */\n.button--primary {\n  border-color: #1C9963;\n  color: #1C9963; }\n\n/* line 70, src/styles/components/_form.scss */\n.button--large.button--chromeless,\n.button--large.button--link {\n  padding: 0; }\n\n/* line 76, src/styles/components/_form.scss */\n.buttonSet > .button {\n  margin-right: 8px;\n  vertical-align: middle; }\n\n/* line 81, src/styles/components/_form.scss */\n.buttonSet > .button:last-child {\n  margin-right: 0; }\n\n/* line 85, src/styles/components/_form.scss */\n.buttonSet .button--chromeless {\n  height: 37px;\n  line-height: 35px; }\n\n/* line 90, src/styles/components/_form.scss */\n.buttonSet .button--large.button--chromeless,\n.buttonSet .button--large.button--link {\n  height: 44px;\n  line-height: 42px; }\n\n/* line 96, src/styles/components/_form.scss */\n.buttonSet > .button--chromeless:not(.button--circle) {\n  margin-right: 0;\n  padding-right: 8px; }\n\n/* line 101, src/styles/components/_form.scss */\n.buttonSet > .button--chromeless:last-child {\n  padding-right: 0; }\n\n/* line 105, src/styles/components/_form.scss */\n.buttonSet > .button--chromeless + .button--chromeless:not(.button--circle) {\n  margin-left: 0;\n  padding-left: 8px; }\n\n/* line 111, src/styles/components/_form.scss */\n.button--circle {\n  background-image: none !important;\n  border-radius: 50%;\n  color: #fff;\n  height: 40px;\n  line-height: 38px;\n  padding: 0;\n  text-decoration: none;\n  width: 40px; }\n\n/* line 124, src/styles/components/_form.scss */\n.tag-button {\n  background: rgba(0, 0, 0, 0.05);\n  border: none;\n  color: rgba(0, 0, 0, 0.68);\n  font-weight: 700;\n  margin: 0 8px 8px 0; }\n  /* line 131, src/styles/components/_form.scss */\n  .tag-button:hover {\n    background: rgba(0, 0, 0, 0.1);\n    color: rgba(0, 0, 0, 0.68); }\n\n/* line 139, src/styles/components/_form.scss */\n.button--dark-line {\n  border: 1px solid #000;\n  color: #000;\n  display: block;\n  font-weight: 600;\n  margin: 50px auto 0;\n  max-width: 300px;\n  text-transform: uppercase;\n  transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955); }\n  /* line 149, src/styles/components/_form.scss */\n  .button--dark-line:hover {\n    color: #fff;\n    box-shadow: inset 0 -50px 8px -4px #000; }\n\n@font-face {\n  font-family: 'mapache';\n  src: url(\"../fonts/mapache.eot?25764j\");\n  src: url(\"../fonts/mapache.eot?25764j#iefix\") format(\"embedded-opentype\"), url(\"../fonts/mapache.ttf?25764j\") format(\"truetype\"), url(\"../fonts/mapache.woff?25764j\") format(\"woff\"), url(\"../fonts/mapache.svg?25764j#mapache\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal; }\n\n/* line 17, src/styles/components/_icons.scss */\n.i-tag:before {\n  content: \"\\e911\"; }\n\n/* line 20, src/styles/components/_icons.scss */\n.i-discord:before {\n  content: \"\\e90a\"; }\n\n/* line 23, src/styles/components/_icons.scss */\n.i-arrow-round-next:before {\n  content: \"\\e90c\"; }\n\n/* line 26, src/styles/components/_icons.scss */\n.i-arrow-round-prev:before {\n  content: \"\\e90d\"; }\n\n/* line 29, src/styles/components/_icons.scss */\n.i-arrow-round-up:before {\n  content: \"\\e90e\"; }\n\n/* line 32, src/styles/components/_icons.scss */\n.i-arrow-round-down:before {\n  content: \"\\e90f\"; }\n\n/* line 35, src/styles/components/_icons.scss */\n.i-photo:before {\n  content: \"\\e90b\"; }\n\n/* line 38, src/styles/components/_icons.scss */\n.i-send:before {\n  content: \"\\e909\"; }\n\n/* line 41, src/styles/components/_icons.scss */\n.i-audio:before {\n  content: \"\\e901\"; }\n\n/* line 44, src/styles/components/_icons.scss */\n.i-rocket:before {\n  content: \"\\e902\";\n  color: #999; }\n\n/* line 48, src/styles/components/_icons.scss */\n.i-comments-line:before {\n  content: \"\\e900\"; }\n\n/* line 51, src/styles/components/_icons.scss */\n.i-globe:before {\n  content: \"\\e906\"; }\n\n/* line 54, src/styles/components/_icons.scss */\n.i-star:before {\n  content: \"\\e907\"; }\n\n/* line 57, src/styles/components/_icons.scss */\n.i-link:before {\n  content: \"\\e908\"; }\n\n/* line 60, src/styles/components/_icons.scss */\n.i-star-line:before {\n  content: \"\\e903\"; }\n\n/* line 63, src/styles/components/_icons.scss */\n.i-more:before {\n  content: \"\\e904\"; }\n\n/* line 66, src/styles/components/_icons.scss */\n.i-search:before {\n  content: \"\\e905\"; }\n\n/* line 69, src/styles/components/_icons.scss */\n.i-chat:before {\n  content: \"\\e910\"; }\n\n/* line 72, src/styles/components/_icons.scss */\n.i-arrow-left:before {\n  content: \"\\e314\"; }\n\n/* line 75, src/styles/components/_icons.scss */\n.i-arrow-right:before {\n  content: \"\\e315\"; }\n\n/* line 78, src/styles/components/_icons.scss */\n.i-play:before {\n  content: \"\\e037\"; }\n\n/* line 81, src/styles/components/_icons.scss */\n.i-location:before {\n  content: \"\\e8b4\"; }\n\n/* line 84, src/styles/components/_icons.scss */\n.i-check-circle:before {\n  content: \"\\e86c\"; }\n\n/* line 87, src/styles/components/_icons.scss */\n.i-close:before {\n  content: \"\\e5cd\"; }\n\n/* line 90, src/styles/components/_icons.scss */\n.i-favorite:before {\n  content: \"\\e87d\"; }\n\n/* line 93, src/styles/components/_icons.scss */\n.i-warning:before {\n  content: \"\\e002\"; }\n\n/* line 96, src/styles/components/_icons.scss */\n.i-rss:before {\n  content: \"\\e0e5\"; }\n\n/* line 99, src/styles/components/_icons.scss */\n.i-share:before {\n  content: \"\\e80d\"; }\n\n/* line 102, src/styles/components/_icons.scss */\n.i-email:before {\n  content: \"\\f0e0\"; }\n\n/* line 105, src/styles/components/_icons.scss */\n.i-google:before {\n  content: \"\\f1a0\"; }\n\n/* line 108, src/styles/components/_icons.scss */\n.i-telegram:before {\n  content: \"\\f2c6\"; }\n\n/* line 111, src/styles/components/_icons.scss */\n.i-reddit:before {\n  content: \"\\f281\"; }\n\n/* line 114, src/styles/components/_icons.scss */\n.i-twitter:before {\n  content: \"\\f099\"; }\n\n/* line 117, src/styles/components/_icons.scss */\n.i-github:before {\n  content: \"\\f09b\"; }\n\n/* line 120, src/styles/components/_icons.scss */\n.i-linkedin:before {\n  content: \"\\f0e1\"; }\n\n/* line 123, src/styles/components/_icons.scss */\n.i-youtube:before {\n  content: \"\\f16a\"; }\n\n/* line 126, src/styles/components/_icons.scss */\n.i-stack-overflow:before {\n  content: \"\\f16c\"; }\n\n/* line 129, src/styles/components/_icons.scss */\n.i-instagram:before {\n  content: \"\\f16d\"; }\n\n/* line 132, src/styles/components/_icons.scss */\n.i-flickr:before {\n  content: \"\\f16e\"; }\n\n/* line 135, src/styles/components/_icons.scss */\n.i-dribbble:before {\n  content: \"\\f17d\"; }\n\n/* line 138, src/styles/components/_icons.scss */\n.i-behance:before {\n  content: \"\\f1b4\"; }\n\n/* line 141, src/styles/components/_icons.scss */\n.i-spotify:before {\n  content: \"\\f1bc\"; }\n\n/* line 144, src/styles/components/_icons.scss */\n.i-codepen:before {\n  content: \"\\f1cb\"; }\n\n/* line 147, src/styles/components/_icons.scss */\n.i-facebook:before {\n  content: \"\\f230\"; }\n\n/* line 150, src/styles/components/_icons.scss */\n.i-pinterest:before {\n  content: \"\\f231\"; }\n\n/* line 153, src/styles/components/_icons.scss */\n.i-whatsapp:before {\n  content: \"\\f232\"; }\n\n/* line 156, src/styles/components/_icons.scss */\n.i-snapchat:before {\n  content: \"\\f2ac\"; }\n\n/* line 2, src/styles/components/_animated.scss */\n.animated {\n  animation-duration: 1s;\n  animation-fill-mode: both; }\n  /* line 6, src/styles/components/_animated.scss */\n  .animated.infinite {\n    animation-iteration-count: infinite; }\n\n/* line 12, src/styles/components/_animated.scss */\n.bounceIn {\n  animation-name: bounceIn; }\n\n/* line 13, src/styles/components/_animated.scss */\n.bounceInDown {\n  animation-name: bounceInDown; }\n\n/* line 14, src/styles/components/_animated.scss */\n.pulse {\n  animation-name: pulse; }\n\n/* line 15, src/styles/components/_animated.scss */\n.slideInUp {\n  animation-name: slideInUp; }\n\n/* line 16, src/styles/components/_animated.scss */\n.slideOutDown {\n  animation-name: slideOutDown; }\n\n@keyframes bounceIn {\n  0%,\n  20%,\n  40%,\n  60%,\n  80%,\n  100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3); }\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1); }\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9); }\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03); }\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97); }\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes bounceInDown {\n  0%,\n  60%,\n  75%,\n  90%,\n  100% {\n    animation-timing-function: cubic-bezier(215, 610, 355, 1); }\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0); }\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0); }\n  75% {\n    transform: translate3d(0, -10px, 0); }\n  90% {\n    transform: translate3d(0, 5px, 0); }\n  100% {\n    transform: none; } }\n\n@keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1); }\n  50% {\n    transform: scale3d(1.2, 1.2, 1.2); }\n  to {\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes scroll {\n  0% {\n    opacity: 0; }\n  10% {\n    opacity: 1;\n    transform: translateY(0); }\n  100% {\n    opacity: 0;\n    transform: translateY(10px); } }\n\n@keyframes opacity {\n  0% {\n    opacity: 0; }\n  50% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg); }\n  to {\n    transform: rotate(360deg); } }\n\n@keyframes tooltip {\n  0% {\n    opacity: 0;\n    transform: translate(-50%, 6px); }\n  100% {\n    opacity: 1;\n    transform: translate(-50%, 0); } }\n\n@keyframes loading-bar {\n  0% {\n    transform: translateX(-100%); }\n  40% {\n    transform: translateX(0); }\n  60% {\n    transform: translateX(0); }\n  100% {\n    transform: translateX(100%); } }\n\n@keyframes arrow-move-right {\n  0% {\n    opacity: 0; }\n  10% {\n    transform: translateX(-100%);\n    opacity: 0; }\n  100% {\n    transform: translateX(0);\n    opacity: 1; } }\n\n@keyframes arrow-move-left {\n  0% {\n    opacity: 0; }\n  10% {\n    transform: translateX(100%);\n    opacity: 0; }\n  100% {\n    transform: translateX(0);\n    opacity: 1; } }\n\n@keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible; }\n  to {\n    transform: translate3d(0, 0, 0); } }\n\n@keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0); }\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0); } }\n\n/* line 4, src/styles/layouts/_header.scss */\n.header-logo,\n.menu--toggle,\n.search-toggle {\n  z-index: 15; }\n\n/* line 10, src/styles/layouts/_header.scss */\n.header {\n  box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n  padding: 0 16px;\n  position: sticky;\n  top: 0;\n  transition: all 0.4s ease-in-out;\n  z-index: 10; }\n  /* line 18, src/styles/layouts/_header.scss */\n  .header-wrap {\n    height: 50px; }\n  /* line 20, src/styles/layouts/_header.scss */\n  .header-logo {\n    color: #fff !important;\n    height: 30px; }\n    /* line 24, src/styles/layouts/_header.scss */\n    .header-logo img {\n      max-height: 100%; }\n\n/* line 29, src/styles/layouts/_header.scss */\n.not-logo .header-logo {\n  height: auto !important; }\n\n/* line 32, src/styles/layouts/_header.scss */\n.header-line {\n  height: 50px;\n  border-right: 1px solid rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  margin-right: 10px; }\n\n/* line 41, src/styles/layouts/_header.scss */\n.follow-more {\n  transition: width .4s ease;\n  overflow: hidden;\n  width: 0; }\n\n/* line 48, src/styles/layouts/_header.scss */\nbody.is-showFollowMore .follow-more {\n  width: auto; }\n\n/* line 49, src/styles/layouts/_header.scss */\nbody.is-showFollowMore .follow-toggle {\n  color: var(--header-color-hover); }\n\n/* line 50, src/styles/layouts/_header.scss */\nbody.is-showFollowMore .follow-toggle::before {\n  content: \"\\e5cd\"; }\n\n/* line 56, src/styles/layouts/_header.scss */\n.nav {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  position: relative;\n  overflow: hidden; }\n  /* line 62, src/styles/layouts/_header.scss */\n  .nav ul {\n    display: flex;\n    margin-right: 20px;\n    overflow: hidden;\n    white-space: nowrap; }\n\n/* line 70, src/styles/layouts/_header.scss */\n.header-left a,\n.nav ul li a {\n  border-radius: 3px;\n  color: var(--header-color);\n  display: inline-block;\n  font-weight: 600;\n  line-height: 30px;\n  padding: 0 8px;\n  text-align: center;\n  text-transform: uppercase;\n  vertical-align: middle; }\n  /* line 82, src/styles/layouts/_header.scss */\n  .header-left a.active, .header-left a:hover,\n  .nav ul li a.active,\n  .nav ul li a:hover {\n    color: var(--header-color-hover); }\n\n/* line 89, src/styles/layouts/_header.scss */\n.menu--toggle {\n  height: 48px;\n  position: relative;\n  transition: transform .4s;\n  width: 48px; }\n  /* line 95, src/styles/layouts/_header.scss */\n  .menu--toggle span {\n    background-color: var(--header-color);\n    display: block;\n    height: 2px;\n    left: 14px;\n    margin-top: -1px;\n    position: absolute;\n    top: 50%;\n    transition: .4s;\n    width: 20px; }\n    /* line 106, src/styles/layouts/_header.scss */\n    .menu--toggle span:first-child {\n      transform: translate(0, -6px); }\n    /* line 107, src/styles/layouts/_header.scss */\n    .menu--toggle span:last-child {\n      transform: translate(0, 6px); }\n\n@media only screen and (max-width: 766px) {\n  /* line 115, src/styles/layouts/_header.scss */\n  .header-left {\n    flex-grow: 1 !important; }\n  /* line 116, src/styles/layouts/_header.scss */\n  .header-logo span {\n    font-size: 24px; }\n  /* line 119, src/styles/layouts/_header.scss */\n  body.is-showNavMob {\n    overflow: hidden; }\n    /* line 122, src/styles/layouts/_header.scss */\n    body.is-showNavMob .sideNav {\n      transform: translateX(0); }\n    /* line 124, src/styles/layouts/_header.scss */\n    body.is-showNavMob .menu--toggle {\n      border: 0;\n      transform: rotate(90deg); }\n      /* line 128, src/styles/layouts/_header.scss */\n      body.is-showNavMob .menu--toggle span:first-child {\n        transform: rotate(45deg) translate(0, 0); }\n      /* line 129, src/styles/layouts/_header.scss */\n      body.is-showNavMob .menu--toggle span:nth-child(2) {\n        transform: scaleX(0); }\n      /* line 130, src/styles/layouts/_header.scss */\n      body.is-showNavMob .menu--toggle span:last-child {\n        transform: rotate(-45deg) translate(0, 0); }\n    /* line 133, src/styles/layouts/_header.scss */\n    body.is-showNavMob .header .button-search--toggle {\n      display: none; }\n    /* line 134, src/styles/layouts/_header.scss */\n    body.is-showNavMob .main, body.is-showNavMob .footer {\n      transform: translateX(-25%) !important; } }\n\n/* line 4, src/styles/layouts/_footer.scss */\n.footer {\n  color: #888; }\n  /* line 7, src/styles/layouts/_footer.scss */\n  .footer a {\n    color: var(--footer-color-link); }\n    /* line 9, src/styles/layouts/_footer.scss */\n    .footer a:hover {\n      color: #fff; }\n  /* line 12, src/styles/layouts/_footer.scss */\n  .footer-links {\n    padding: 3em 0 2.5em;\n    background-color: #131313; }\n  /* line 17, src/styles/layouts/_footer.scss */\n  .footer .follow > a {\n    background: #333;\n    border-radius: 50%;\n    color: inherit;\n    display: inline-block;\n    height: 40px;\n    line-height: 40px;\n    margin: 0 5px 8px;\n    text-align: center;\n    width: 40px; }\n    /* line 28, src/styles/layouts/_footer.scss */\n    .footer .follow > a:hover {\n      background: transparent;\n      box-shadow: inset 0 0 0 2px #333; }\n  /* line 34, src/styles/layouts/_footer.scss */\n  .footer-copy {\n    padding: 3em 0;\n    background-color: #000; }\n\n/* line 41, src/styles/layouts/_footer.scss */\n.footer-menu li {\n  display: inline-block;\n  line-height: 24px;\n  margin: 0 8px;\n  /* stylelint-disable-next-line */ }\n  /* line 47, src/styles/layouts/_footer.scss */\n  .footer-menu li a {\n    color: #888; }\n\n/* line 3, src/styles/layouts/_homepage.scss */\n.cover {\n  padding: 4px; }\n  /* line 6, src/styles/layouts/_homepage.scss */\n  .cover-story {\n    overflow: hidden;\n    height: 250px;\n    width: 100%; }\n    /* line 11, src/styles/layouts/_homepage.scss */\n    .cover-story:hover .cover-header {\n      background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%); }\n    /* line 13, src/styles/layouts/_homepage.scss */\n    .cover-story.firts {\n      height: 80vh; }\n  /* line 16, src/styles/layouts/_homepage.scss */\n  .cover-img, .cover-link {\n    bottom: 4px;\n    left: 4px;\n    right: 4px;\n    top: 4px; }\n  /* line 25, src/styles/layouts/_homepage.scss */\n  .cover-header {\n    bottom: 4px;\n    left: 4px;\n    right: 4px;\n    padding: 50px 3.846153846% 20px;\n    background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%); }\n\n/* line 36, src/styles/layouts/_homepage.scss */\n.hm-cover {\n  padding: 30px 0;\n  min-height: 100vh; }\n  /* line 40, src/styles/layouts/_homepage.scss */\n  .hm-cover-title {\n    font-size: 2.5rem;\n    font-weight: 900;\n    line-height: 1; }\n  /* line 46, src/styles/layouts/_homepage.scss */\n  .hm-cover-des {\n    max-width: 600px;\n    font-size: 1.25rem; }\n\n/* line 52, src/styles/layouts/_homepage.scss */\n.hm-subscribe {\n  background-color: transparent;\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #fff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  padding: 15px 10px;\n  transition: all .3s;\n  width: 100%; }\n  /* line 67, src/styles/layouts/_homepage.scss */\n  .hm-subscribe:hover {\n    box-shadow: inset 0 0 0 2px #fff; }\n\n/* line 72, src/styles/layouts/_homepage.scss */\n.hm-down {\n  animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100; }\n  /* line 83, src/styles/layouts/_homepage.scss */\n  .hm-down svg {\n    display: block;\n    fill: currentcolor;\n    height: auto;\n    width: 100%; }\n\n@media only screen and (min-width: 766px) {\n  /* line 94, src/styles/layouts/_homepage.scss */\n  .cover {\n    height: 70vh; }\n    /* line 97, src/styles/layouts/_homepage.scss */\n    .cover-story {\n      height: 50%;\n      width: 33.33333%; }\n      /* line 101, src/styles/layouts/_homepage.scss */\n      .cover-story.firts {\n        height: 100%;\n        width: 66.66666%; }\n        /* line 105, src/styles/layouts/_homepage.scss */\n        .cover-story.firts .cover-title {\n          font-size: 2.5rem; }\n  /* line 111, src/styles/layouts/_homepage.scss */\n  .hm-cover-title {\n    font-size: 3.5rem; } }\n\n/* line 6, src/styles/layouts/_post.scss */\n.post-title {\n  color: #000;\n  line-height: 1.2;\n  font-weight: 900;\n  max-width: 1000px; }\n\n/* line 13, src/styles/layouts/_post.scss */\n.post-excerpt {\n  color: #555;\n  font-family: \"Merriweather\", serif;\n  font-weight: 300;\n  letter-spacing: -.012em;\n  line-height: 1.6; }\n\n/* line 22, src/styles/layouts/_post.scss */\n.post-author-social {\n  vertical-align: middle;\n  margin-left: 2px;\n  padding: 0 3px; }\n\n/* line 28, src/styles/layouts/_post.scss */\n.post-image {\n  margin-top: 30px; }\n\n/* line 33, src/styles/layouts/_post.scss */\n.avatar-image {\n  display: inline-block;\n  vertical-align: middle; }\n  /* line 39, src/styles/layouts/_post.scss */\n  .avatar-image--smaller {\n    width: 50px;\n    height: 50px; }\n\n/* line 48, src/styles/layouts/_post.scss */\n.post-body a:not(.button):not(.button--circle):not(.prev-next-link) {\n  text-decoration: none;\n  position: relative;\n  transition: all 250ms;\n  box-shadow: inset 0 -3px 0 var(--post-color-link); }\n  /* line 54, src/styles/layouts/_post.scss */\n  .post-body a:not(.button):not(.button--circle):not(.prev-next-link):hover {\n    box-shadow: inset 0 -1rem 0 var(--post-color-link); }\n\n/* line 59, src/styles/layouts/_post.scss */\n.post-body img {\n  display: block;\n  margin-left: auto;\n  margin-right: auto; }\n\n/* line 65, src/styles/layouts/_post.scss */\n.post-body h1, .post-body h2, .post-body h3, .post-body h4, .post-body h5, .post-body h6 {\n  margin-top: 30px;\n  font-weight: 900;\n  font-style: normal;\n  color: #000;\n  letter-spacing: -.02em;\n  line-height: 1.2; }\n\n/* line 74, src/styles/layouts/_post.scss */\n.post-body h2 {\n  margin-top: 35px; }\n\n/* line 76, src/styles/layouts/_post.scss */\n.post-body p {\n  font-family: \"Merriweather\", serif;\n  font-size: 1.125rem;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin-top: 25px; }\n\n/* line 85, src/styles/layouts/_post.scss */\n.post-body ul,\n.post-body ol {\n  counter-reset: post;\n  font-family: \"Merriweather\", serif;\n  font-size: 1.125rem;\n  margin-top: 20px; }\n  /* line 92, src/styles/layouts/_post.scss */\n  .post-body ul li,\n  .post-body ol li {\n    letter-spacing: -.003em;\n    margin-bottom: 14px;\n    margin-left: 30px; }\n    /* line 97, src/styles/layouts/_post.scss */\n    .post-body ul li::before,\n    .post-body ol li::before {\n      box-sizing: border-box;\n      display: inline-block;\n      margin-left: -78px;\n      position: absolute;\n      text-align: right;\n      width: 78px; }\n\n/* line 108, src/styles/layouts/_post.scss */\n.post-body ul li::before {\n  content: '\\2022';\n  font-size: 16.8px;\n  padding-right: 15px;\n  padding-top: 3px; }\n\n/* line 115, src/styles/layouts/_post.scss */\n.post-body ol li::before {\n  content: counter(post) \".\";\n  counter-increment: post;\n  padding-right: 12px; }\n\n/* line 143, src/styles/layouts/_post.scss */\n.post-body-wrap {\n  display: flex;\n  flex-direction: column;\n  align-items: center; }\n  /* line 150, src/styles/layouts/_post.scss */\n  .post-body-wrap h1, .post-body-wrap h2, .post-body-wrap h3, .post-body-wrap h4, .post-body-wrap h5, .post-body-wrap h6,\n  .post-body-wrap ol, .post-body-wrap ul, .post-body-wrap hr, .post-body-wrap pre, .post-body-wrap .post-tags, .post-body-wrap .prev-next {\n    min-width: 100%; }\n  /* line 155, src/styles/layouts/_post.scss */\n  .post-body-wrap > ul {\n    margin-top: 35px; }\n  /* line 157, src/styles/layouts/_post.scss */\n  .post-body-wrap > iframe,\n  .post-body-wrap > img,\n  .post-body-wrap .kg-image-card,\n  .post-body-wrap .kg-embed-card {\n    margin-top: 30px !important; }\n\n/* line 167, src/styles/layouts/_post.scss */\n.sharePost {\n  left: 0;\n  width: 40px;\n  position: absolute !important;\n  transition: all .4s;\n  top: 30px;\n  /* stylelint-disable-next-line */ }\n  /* line 175, src/styles/layouts/_post.scss */\n  .sharePost a {\n    color: #fff;\n    margin: 8px 0 0;\n    display: block; }\n  /* line 181, src/styles/layouts/_post.scss */\n  .sharePost .i-chat {\n    background-color: #fff;\n    border: 2px solid #bbb;\n    color: #bbb; }\n\n/* line 191, src/styles/layouts/_post.scss */\n.post-related {\n  padding: 40px 0; }\n\n/* stylelint-disable-next-line */\n/* line 199, src/styles/layouts/_post.scss */\n.prev-next-span {\n  color: var(--composite-color);\n  font-weight: 700;\n  font-size: 13px; }\n  /* line 204, src/styles/layouts/_post.scss */\n  .prev-next-span i {\n    display: inline-flex;\n    transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1); }\n\n/* line 210, src/styles/layouts/_post.scss */\n.prev-next-title {\n  margin: 0 !important;\n  font-size: 16px;\n  height: 2em;\n  overflow: hidden;\n  line-height: 1 !important;\n  text-overflow: ellipsis !important;\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  display: -webkit-box !important; }\n\n/* line 230, src/styles/layouts/_post.scss */\n.prev-next-link:hover .arrow-right {\n  animation: arrow-move-right 0.5s ease-in-out forwards; }\n\n/* line 231, src/styles/layouts/_post.scss */\n.prev-next-link:hover .arrow-left {\n  animation: arrow-move-left 0.5s ease-in-out forwards; }\n\n/* line 237, src/styles/layouts/_post.scss */\n.cc-image {\n  max-height: 100vh;\n  min-height: 600px;\n  background-color: #000; }\n  /* line 242, src/styles/layouts/_post.scss */\n  .cc-image-header {\n    right: 0;\n    bottom: 10%;\n    left: 0; }\n  /* line 248, src/styles/layouts/_post.scss */\n  .cc-image-figure img {\n    opacity: .4;\n    object-fit: cover;\n    width: 100%; }\n  /* line 254, src/styles/layouts/_post.scss */\n  .cc-image .post-header {\n    max-width: 700px; }\n  /* line 255, src/styles/layouts/_post.scss */\n  .cc-image .post-title, .cc-image .post-excerpt {\n    color: #fff; }\n\n/* line 261, src/styles/layouts/_post.scss */\n.cc-video {\n  background-color: #000;\n  padding: 40px 0 30px; }\n  /* line 265, src/styles/layouts/_post.scss */\n  .cc-video .post-excerpt {\n    color: #aaa;\n    font-size: 1rem; }\n  /* line 266, src/styles/layouts/_post.scss */\n  .cc-video .post-title {\n    color: #fff;\n    font-size: 1.8rem; }\n  /* line 267, src/styles/layouts/_post.scss */\n  .cc-video .kg-embed-card, .cc-video .video-responsive {\n    margin-top: 0; }\n  /* line 270, src/styles/layouts/_post.scss */\n  .cc-video .story h2 {\n    color: #fff;\n    margin: 0;\n    font-size: 1.125rem !important;\n    font-weight: 700 !important;\n    max-height: 2.5em;\n    overflow: hidden;\n    -webkit-box-orient: vertical !important;\n    -webkit-line-clamp: 2 !important;\n    text-overflow: ellipsis !important;\n    display: -webkit-box !important; }\n  /* line 283, src/styles/layouts/_post.scss */\n  .cc-video .flow-meta, .cc-video .story-lower, .cc-video figcaption {\n    display: none !important; }\n  /* line 284, src/styles/layouts/_post.scss */\n  .cc-video .story-image {\n    height: 170px !important; }\n  /* line 286, src/styles/layouts/_post.scss */\n  .cc-video .media-type {\n    height: 34px !important;\n    width: 34px !important; }\n\n/* line 294, src/styles/layouts/_post.scss */\nbody.is-article .main {\n  margin-bottom: 0; }\n\n/* line 295, src/styles/layouts/_post.scss */\nbody.share-margin .sharePost {\n  top: -85px; }\n\n/* line 296, src/styles/layouts/_post.scss */\nbody.show-category .post-primary-tag {\n  display: block !important; }\n\n/* line 299, src/styles/layouts/_post.scss */\nbody.is-article-single .post-body-wrap {\n  margin-left: 0 !important; }\n\n/* line 300, src/styles/layouts/_post.scss */\nbody.is-article-single .sharePost {\n  left: -100px; }\n\n/* line 301, src/styles/layouts/_post.scss */\nbody.is-article-single .kg-width-full .kg-image {\n  max-width: 100vw; }\n\n/* line 302, src/styles/layouts/_post.scss */\nbody.is-article-single .kg-width-wide .kg-image {\n  max-width: 1040px; }\n\n@media only screen and (max-width: 766px) {\n  /* line 308, src/styles/layouts/_post.scss */\n  .post-body-wrap q {\n    font-size: 20px !important;\n    letter-spacing: -.008em !important;\n    line-height: 1.4 !important; }\n  /* line 320, src/styles/layouts/_post.scss */\n  .post-body-wrap .kg-image-card img {\n    max-width: 100%; }\n  /* line 322, src/styles/layouts/_post.scss */\n  .post-body-wrap ol, .post-body-wrap ul, .post-body-wrap p {\n    font-size: 1rem;\n    letter-spacing: -.004em;\n    line-height: 1.58; }\n  /* line 328, src/styles/layouts/_post.scss */\n  .post-body-wrap iframe {\n    width: 100% !important; }\n  /* line 332, src/styles/layouts/_post.scss */\n  .post-related {\n    padding-left: 8px;\n    padding-right: 8px; }\n  /* line 338, src/styles/layouts/_post.scss */\n  .cc-image-figure {\n    width: 200%;\n    max-width: 200%;\n    margin: 0 auto 0 -50%; }\n  /* line 344, src/styles/layouts/_post.scss */\n  .cc-image-header {\n    bottom: 24px; }\n  /* line 345, src/styles/layouts/_post.scss */\n  .cc-image .post-excerpt {\n    font-size: 18px; }\n  /* line 348, src/styles/layouts/_post.scss */\n  .cc-video {\n    padding: 20px 0; }\n    /* line 351, src/styles/layouts/_post.scss */\n    .cc-video-embed {\n      margin-left: -16px;\n      margin-right: -15px; }\n    /* line 356, src/styles/layouts/_post.scss */\n    .cc-video .post-header {\n      margin-top: 10px; } }\n\n@media only screen and (max-width: 1000px) {\n  /* line 362, src/styles/layouts/_post.scss */\n  body.is-article .col-left {\n    max-width: 100%; } }\n\n@media only screen and (min-width: 766px) {\n  /* line 369, src/styles/layouts/_post.scss */\n  .cc-image .post-title {\n    font-size: 3.2rem; } }\n\n@media only screen and (min-width: 1000px) {\n  /* line 373, src/styles/layouts/_post.scss */\n  body.is-article .post-body-wrap {\n    margin-left: 70px; }\n  /* line 377, src/styles/layouts/_post.scss */\n  body.is-video .post-author,\n  body.is-image .post-author {\n    margin-left: 70px; } }\n\n@media only screen and (min-width: 1230px) {\n  /* line 384, src/styles/layouts/_post.scss */\n  body.has-video-fixed .cc-video-embed {\n    bottom: 20px;\n    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n    height: 203px;\n    padding-bottom: 0;\n    position: fixed;\n    right: 20px;\n    width: 360px;\n    z-index: 8; }\n  /* line 395, src/styles/layouts/_post.scss */\n  body.has-video-fixed .cc-video-close {\n    background: #000;\n    border-radius: 50%;\n    color: #fff;\n    cursor: pointer;\n    display: block !important;\n    font-size: 14px;\n    height: 24px;\n    left: -10px;\n    line-height: 1;\n    padding-top: 5px;\n    position: absolute;\n    text-align: center;\n    top: -10px;\n    width: 24px;\n    z-index: 5; }\n  /* line 413, src/styles/layouts/_post.scss */\n  body.has-video-fixed .cc-video-cont {\n    height: 465px; }\n  /* line 415, src/styles/layouts/_post.scss */\n  body.has-video-fixed .cc-image-header {\n    bottom: 20%; } }\n\n/* line 3, src/styles/layouts/_story.scss */\n.hr-list {\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.0785);\n  margin: 20px 0 0; }\n\n/* line 10, src/styles/layouts/_story.scss */\n.story-feed .story-feed-content:first-child .hr-list:first-child {\n  margin-top: 5px; }\n\n/* line 15, src/styles/layouts/_story.scss */\n.media-type {\n  background-color: rgba(0, 0, 0, 0.7);\n  color: #fff;\n  height: 45px;\n  left: 15px;\n  top: 15px;\n  width: 45px;\n  opacity: .9; }\n\n/* line 33, src/styles/layouts/_story.scss */\n.image-hover {\n  transition: transform .7s;\n  transform: translateZ(0); }\n\n/* line 39, src/styles/layouts/_story.scss */\n.not-image {\n  background: url(\"../images/not-image.png\");\n  background-repeat: repeat; }\n\n/* line 45, src/styles/layouts/_story.scss */\n.flow-meta {\n  color: rgba(0, 0, 0, 0.54);\n  font-weight: 700;\n  margin-bottom: 10px; }\n\n/* line 52, src/styles/layouts/_story.scss */\n.point {\n  margin: 0 5px; }\n\n/* line 58, src/styles/layouts/_story.scss */\n.story-image {\n  flex: 0 0 44%;\n  height: 235px;\n  margin-right: 30px; }\n  /* line 63, src/styles/layouts/_story.scss */\n  .story-image:hover .image-hover {\n    transform: scale(1.03); }\n\n/* line 66, src/styles/layouts/_story.scss */\n.story-lower {\n  flex-grow: 1; }\n\n/* line 68, src/styles/layouts/_story.scss */\n.story-excerpt {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Merriweather\", serif;\n  font-weight: 300;\n  line-height: 1.5; }\n\n/* line 75, src/styles/layouts/_story.scss */\n.story-category {\n  color: rgba(0, 0, 0, 0.84); }\n\n/* line 77, src/styles/layouts/_story.scss */\n.story h2 a:hover {\n  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.4);\n  transition: all .25s; }\n\n/* line 89, src/styles/layouts/_story.scss */\n.story.story--grid {\n  flex-direction: column;\n  margin-bottom: 30px; }\n  /* line 93, src/styles/layouts/_story.scss */\n  .story.story--grid .story-image {\n    flex: 0 0 auto;\n    margin-right: 0;\n    height: 220px; }\n  /* line 99, src/styles/layouts/_story.scss */\n  .story.story--grid .media-type {\n    font-size: 24px;\n    height: 40px;\n    width: 40px; }\n\n/* line 106, src/styles/layouts/_story.scss */\n.cover-category {\n  color: var(--story-cover-category-color); }\n\n/* line 111, src/styles/layouts/_story.scss */\n.story-card {\n  /* stylelint-disable-next-line */ }\n  /* line 112, src/styles/layouts/_story.scss */\n  .story-card .story {\n    margin-top: 0 !important; }\n  /* line 123, src/styles/layouts/_story.scss */\n  .story-card .story-image {\n    border: 1px solid rgba(0, 0, 0, 0.04);\n    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n    border-radius: 2px;\n    background-color: #fff !important;\n    transition: all 150ms ease-in-out;\n    overflow: hidden;\n    height: 200px !important; }\n    /* line 135, src/styles/layouts/_story.scss */\n    .story-card .story-image .story-img-bg {\n      margin: 10px; }\n    /* line 137, src/styles/layouts/_story.scss */\n    .story-card .story-image:hover {\n      box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.1); }\n      /* line 140, src/styles/layouts/_story.scss */\n      .story-card .story-image:hover .story-img-bg {\n        transform: none; }\n  /* line 144, src/styles/layouts/_story.scss */\n  .story-card .story-lower {\n    display: none !important; }\n  /* line 146, src/styles/layouts/_story.scss */\n  .story-card .story-body {\n    padding: 15px 5px;\n    margin: 0 !important; }\n    /* line 150, src/styles/layouts/_story.scss */\n    .story-card .story-body h2 {\n      -webkit-box-orient: vertical !important;\n      -webkit-line-clamp: 2 !important;\n      color: rgba(0, 0, 0, 0.9);\n      display: -webkit-box !important;\n      max-height: 2.4em !important;\n      overflow: hidden;\n      text-overflow: ellipsis !important;\n      margin: 0; }\n\n@media only screen and (min-width: 766px) {\n  /* line 170, src/styles/layouts/_story.scss */\n  .story.story--grid .story-lower {\n    max-height: 2.6em;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    display: -webkit-box;\n    line-height: 1.1;\n    text-overflow: ellipsis; } }\n\n@media only screen and (max-width: 766px) {\n  /* line 185, src/styles/layouts/_story.scss */\n  .cover--firts .cover-story {\n    height: 500px; }\n  /* line 188, src/styles/layouts/_story.scss */\n  .story {\n    flex-direction: column;\n    margin-top: 20px; }\n    /* line 192, src/styles/layouts/_story.scss */\n    .story-image {\n      flex: 0 0 auto;\n      margin-right: 0; }\n    /* line 193, src/styles/layouts/_story.scss */\n    .story-body {\n      margin-top: 10px; } }\n\n/* line 4, src/styles/layouts/_author.scss */\n.author {\n  background-color: #fff;\n  color: rgba(0, 0, 0, 0.6);\n  min-height: 350px; }\n  /* line 9, src/styles/layouts/_author.scss */\n  .author-avatar {\n    height: 80px;\n    width: 80px; }\n  /* line 14, src/styles/layouts/_author.scss */\n  .author-meta span {\n    display: inline-block;\n    font-size: 17px;\n    font-style: italic;\n    margin: 0 25px 16px 0;\n    opacity: .8;\n    word-wrap: break-word; }\n  /* line 23, src/styles/layouts/_author.scss */\n  .author-name {\n    color: rgba(0, 0, 0, 0.8); }\n  /* line 24, src/styles/layouts/_author.scss */\n  .author-bio {\n    max-width: 600px; }\n  /* line 25, src/styles/layouts/_author.scss */\n  .author-meta a:hover {\n    opacity: .8 !important; }\n\n/* line 28, src/styles/layouts/_author.scss */\n.cover-opacity {\n  opacity: .5; }\n\n/* line 30, src/styles/layouts/_author.scss */\n.author.has--image {\n  color: #fff !important;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33); }\n  /* line 34, src/styles/layouts/_author.scss */\n  .author.has--image a,\n  .author.has--image .author-name {\n    color: #fff; }\n  /* line 37, src/styles/layouts/_author.scss */\n  .author.has--image .author-follow a {\n    border: 2px solid;\n    border-color: rgba(255, 255, 255, 0.5) !important;\n    font-size: 16px; }\n  /* line 43, src/styles/layouts/_author.scss */\n  .author.has--image .u-accentColor--iconNormal {\n    fill: #fff; }\n\n@media only screen and (max-width: 766px) {\n  /* line 47, src/styles/layouts/_author.scss */\n  .author-meta span {\n    display: block; }\n  /* line 48, src/styles/layouts/_author.scss */\n  .author-header {\n    display: block; }\n  /* line 49, src/styles/layouts/_author.scss */\n  .author-avatar {\n    margin: 0 auto 20px; } }\n\n@media only screen and (min-width: 766px) {\n  /* line 53, src/styles/layouts/_author.scss */\n  body.has-cover .author {\n    min-height: 600px; } }\n\n/* line 4, src/styles/layouts/_search.scss */\n.search {\n  background-color: #fff;\n  height: 100%;\n  height: 100vh;\n  left: 0;\n  padding: 0 16px;\n  right: 0;\n  top: 0;\n  transform: translateY(-100%);\n  transition: transform .3s ease;\n  z-index: 9; }\n  /* line 16, src/styles/layouts/_search.scss */\n  .search-form {\n    max-width: 680px;\n    margin-top: 80px; }\n    /* line 20, src/styles/layouts/_search.scss */\n    .search-form::before {\n      background: #eee;\n      bottom: 0;\n      content: '';\n      display: block;\n      height: 2px;\n      left: 0;\n      position: absolute;\n      width: 100%;\n      z-index: 1; }\n    /* line 32, src/styles/layouts/_search.scss */\n    .search-form input {\n      border: none;\n      display: block;\n      line-height: 40px;\n      padding-bottom: 8px; }\n      /* line 38, src/styles/layouts/_search.scss */\n      .search-form input:focus {\n        outline: 0; }\n  /* line 43, src/styles/layouts/_search.scss */\n  .search-results {\n    max-height: calc(90% - 100px);\n    max-width: 680px;\n    overflow: auto; }\n    /* line 48, src/styles/layouts/_search.scss */\n    .search-results a {\n      border-bottom: 1px solid #eee;\n      padding: 12px 0; }\n      /* line 52, src/styles/layouts/_search.scss */\n      .search-results a:hover {\n        color: rgba(0, 0, 0, 0.44); }\n\n/* line 57, src/styles/layouts/_search.scss */\n.button-search--close {\n  position: absolute !important;\n  right: 50px;\n  top: 20px; }\n\n/* line 63, src/styles/layouts/_search.scss */\nbody.is-search {\n  overflow: hidden; }\n  /* line 66, src/styles/layouts/_search.scss */\n  body.is-search .search {\n    transform: translateY(0); }\n  /* line 67, src/styles/layouts/_search.scss */\n  body.is-search .search-toggle {\n    background-color: rgba(255, 255, 255, 0.25); }\n\n/* line 2, src/styles/layouts/_sidebar.scss */\n.sidebar-title {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785); }\n  /* line 5, src/styles/layouts/_sidebar.scss */\n  .sidebar-title span {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.54);\n    padding-bottom: 10px;\n    margin-bottom: -1px; }\n\n/* line 14, src/styles/layouts/_sidebar.scss */\n.sidebar-border {\n  border-left: 3px solid var(--composite-color);\n  color: rgba(0, 0, 0, 0.2);\n  font-family: \"Merriweather\", serif;\n  padding: 0 10px;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888; }\n\n/* line 24, src/styles/layouts/_sidebar.scss */\n.sidebar-post {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.0785);\n  min-height: 60px; }\n  /* line 30, src/styles/layouts/_sidebar.scss */\n  .sidebar-post:hover .sidebar-border {\n    background-color: #e5eff5; }\n  /* line 32, src/styles/layouts/_sidebar.scss */\n  .sidebar-post:nth-child(3n) .sidebar-border {\n    border-color: #f59e00; }\n  /* line 33, src/styles/layouts/_sidebar.scss */\n  .sidebar-post:nth-child(3n+2) .sidebar-border {\n    border-color: #26a8ed; }\n\n/* line 2, src/styles/layouts/_sidenav.scss */\n.sideNav {\n  color: rgba(0, 0, 0, 0.8);\n  height: 100vh;\n  padding: 50px 20px;\n  position: fixed !important;\n  transform: translateX(100%);\n  transition: 0.4s;\n  will-change: transform;\n  z-index: 8; }\n  /* line 13, src/styles/layouts/_sidenav.scss */\n  .sideNav-menu a {\n    padding: 10px 20px; }\n  /* line 15, src/styles/layouts/_sidenav.scss */\n  .sideNav-wrap {\n    background: #eee;\n    overflow: auto;\n    padding: 20px 0;\n    top: 50px; }\n  /* line 22, src/styles/layouts/_sidenav.scss */\n  .sideNav-section {\n    border-bottom: solid 1px #ddd;\n    margin-bottom: 8px;\n    padding-bottom: 8px; }\n  /* line 28, src/styles/layouts/_sidenav.scss */\n  .sideNav-follow {\n    border-top: 1px solid #ddd;\n    margin: 15px 0; }\n    /* line 32, src/styles/layouts/_sidenav.scss */\n    .sideNav-follow a {\n      color: #fff;\n      display: inline-block;\n      height: 36px;\n      line-height: 20px;\n      margin: 0 5px 5px 0;\n      min-width: 36px;\n      padding: 8px;\n      text-align: center;\n      vertical-align: middle; }\n\n/* line 17, src/styles/layouts/helper.scss */\n.has-cover-padding {\n  padding-top: 100px; }\n\n/* line 20, src/styles/layouts/helper.scss */\nbody.has-cover .header {\n  position: fixed; }\n\n/* line 23, src/styles/layouts/helper.scss */\nbody.has-cover.is-transparency:not(.is-search) .header {\n  background: rgba(0, 0, 0, 0.05);\n  box-shadow: none;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1); }\n\n/* line 29, src/styles/layouts/helper.scss */\nbody.has-cover.is-transparency:not(.is-search) .header-left a, body.has-cover.is-transparency:not(.is-search) .nav ul li a {\n  color: #fff; }\n\n/* line 30, src/styles/layouts/helper.scss */\nbody.has-cover.is-transparency:not(.is-search) .menu--toggle span {\n  background-color: #fff; }\n\n/* line 5, src/styles/layouts/subscribe.scss */\n.subscribe {\n  min-height: 80vh !important;\n  height: 100%; }\n  /* line 10, src/styles/layouts/subscribe.scss */\n  .subscribe-card {\n    background-color: #D7EFEE;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n    border-radius: 4px;\n    width: 900px;\n    height: 550px;\n    padding: 50px;\n    margin: 5px; }\n  /* line 20, src/styles/layouts/subscribe.scss */\n  .subscribe form {\n    max-width: 300px; }\n  /* line 24, src/styles/layouts/subscribe.scss */\n  .subscribe-form {\n    height: 100%; }\n  /* line 28, src/styles/layouts/subscribe.scss */\n  .subscribe-input {\n    background: 0 0;\n    border: 0;\n    border-bottom: 1px solid #cc5454;\n    border-radius: 0;\n    padding: 7px 5px;\n    height: 45px;\n    outline: 0;\n    font-family: \"Ruda\", sans-serif; }\n    /* line 38, src/styles/layouts/subscribe.scss */\n    .subscribe-input::placeholder {\n      color: #cc5454; }\n  /* line 43, src/styles/layouts/subscribe.scss */\n  .subscribe .main-error {\n    color: #cc5454;\n    font-size: 16px;\n    margin-top: 15px; }\n\n/* line 65, src/styles/layouts/subscribe.scss */\n.subscribe-success .subscribe-card {\n  background-color: #E8F3EC; }\n\n@media only screen and (max-width: 766px) {\n  /* line 71, src/styles/layouts/subscribe.scss */\n  .subscribe-card {\n    height: auto;\n    width: auto; } }\n\n/* line 4, src/styles/layouts/_comments.scss */\n.post-comments {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 15;\n  width: 100%;\n  left: 0;\n  overflow-y: auto;\n  background: #fff;\n  border-left: 1px solid #f1f1f1;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  font-size: 14px;\n  transform: translateX(100%);\n  transition: .2s;\n  will-change: transform; }\n  /* line 21, src/styles/layouts/_comments.scss */\n  .post-comments-header {\n    padding: 20px;\n    border-bottom: 1px solid #ddd; }\n    /* line 25, src/styles/layouts/_comments.scss */\n    .post-comments-header .toggle-comments {\n      font-size: 24px;\n      line-height: 1;\n      position: absolute;\n      left: 0;\n      top: 0;\n      padding: 17px;\n      cursor: pointer; }\n  /* line 36, src/styles/layouts/_comments.scss */\n  .post-comments-overlay {\n    position: fixed !important;\n    background-color: rgba(0, 0, 0, 0.2);\n    display: none;\n    transition: background-color .4s linear;\n    z-index: 8;\n    cursor: pointer; }\n\n/* line 46, src/styles/layouts/_comments.scss */\nbody.has-comments {\n  overflow: hidden; }\n  /* line 49, src/styles/layouts/_comments.scss */\n  body.has-comments .post-comments-overlay {\n    display: block; }\n  /* line 50, src/styles/layouts/_comments.scss */\n  body.has-comments .post-comments {\n    transform: translateX(0); }\n\n@media only screen and (min-width: 766px) {\n  /* line 54, src/styles/layouts/_comments.scss */\n  .post-comments {\n    left: auto;\n    width: 500px;\n    top: 50px;\n    z-index: 9; }\n    /* line 60, src/styles/layouts/_comments.scss */\n    .post-comments-wrap {\n      padding: 20px; } }\n\n/* line 1, src/styles/common/_modal.scss */\n.modal {\n  opacity: 0;\n  transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  z-index: 100;\n  visibility: hidden; }\n  /* line 8, src/styles/common/_modal.scss */\n  .modal-shader {\n    background-color: rgba(255, 255, 255, 0.65); }\n  /* line 11, src/styles/common/_modal.scss */\n  .modal-close {\n    color: rgba(0, 0, 0, 0.54);\n    position: absolute;\n    top: 0;\n    right: 0;\n    line-height: 1;\n    padding: 15px; }\n  /* line 21, src/styles/common/_modal.scss */\n  .modal-inner {\n    background-color: #E8F3EC;\n    border-radius: 4px;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n    max-width: 700px;\n    height: 100%;\n    max-height: 400px;\n    opacity: 0;\n    padding: 72px 5% 56px;\n    transform: scale(0.6);\n    transition: transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n    width: 100%; }\n  /* line 36, src/styles/common/_modal.scss */\n  .modal .form-group {\n    width: 76%;\n    margin: 0 auto 30px; }\n  /* line 41, src/styles/common/_modal.scss */\n  .modal .form--input {\n    display: inline-block;\n    margin-bottom: 10px;\n    vertical-align: top;\n    height: 40px;\n    line-height: 40px;\n    background-color: transparent;\n    padding: 17px 6px;\n    border-bottom: 1px solid rgba(0, 0, 0, 0.15);\n    width: 100%; }\n\n/* line 71, src/styles/common/_modal.scss */\nbody.has-modal {\n  overflow: hidden; }\n  /* line 74, src/styles/common/_modal.scss */\n  body.has-modal .modal {\n    opacity: 1;\n    visibility: visible;\n    transition: opacity .3s ease; }\n    /* line 79, src/styles/common/_modal.scss */\n    body.has-modal .modal-inner {\n      opacity: 1;\n      transform: scale(1);\n      transition: transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96); }\n\n/* line 4, src/styles/common/_widget.scss */\n.instagram-hover {\n  background-color: rgba(0, 0, 0, 0.3);\n  opacity: 0; }\n\n/* line 10, src/styles/common/_widget.scss */\n.instagram-img {\n  height: 264px; }\n  /* line 13, src/styles/common/_widget.scss */\n  .instagram-img:hover > .instagram-hover {\n    opacity: 1; }\n\n/* line 16, src/styles/common/_widget.scss */\n.instagram-name {\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 3; }\n  /* line 22, src/styles/common/_widget.scss */\n  .instagram-name a {\n    background-color: #fff;\n    color: #000 !important;\n    font-size: 18px !important;\n    font-weight: 900 !important;\n    min-width: 200px;\n    padding-left: 10px !important;\n    padding-right: 10px !important;\n    text-align: center !important; }\n\n/* line 34, src/styles/common/_widget.scss */\n.instagram-col {\n  padding: 0 !important;\n  margin: 0 !important; }\n\n/* line 39, src/styles/common/_widget.scss */\n.instagram-wrap {\n  margin: 0 !important; }\n\n/* line 44, src/styles/common/_widget.scss */\n.witget-subscribe {\n  background: #fff;\n  border: 5px solid transparent;\n  padding: 28px 30px;\n  position: relative; }\n  /* line 50, src/styles/common/_widget.scss */\n  .witget-subscribe::before {\n    content: \"\";\n    border: 5px solid #f5f5f5;\n    box-shadow: inset 0 0 0 1px #d7d7d7;\n    box-sizing: border-box;\n    display: block;\n    height: calc(100% + 10px);\n    left: -5px;\n    pointer-events: none;\n    position: absolute;\n    top: -5px;\n    width: calc(100% + 10px);\n    z-index: 1; }\n  /* line 65, src/styles/common/_widget.scss */\n  .witget-subscribe input {\n    background: #fff;\n    border: 1px solid #e5e5e5;\n    color: rgba(0, 0, 0, 0.54);\n    height: 41px;\n    outline: 0;\n    padding: 0 16px;\n    width: 100%; }\n  /* line 75, src/styles/common/_widget.scss */\n  .witget-subscribe button {\n    background: var(--composite-color);\n    border-radius: 0;\n    width: 100%; }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdHlsZXMvbWFpbi5zY3NzIiwibm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzcyIsIm5vZGVfbW9kdWxlcy9wcmlzbWpzL3RoZW1lcy9wcmlzbS5jc3MiLCJub2RlX21vZHVsZXMvcHJpc21qcy9wbHVnaW5zL2xpbmUtbnVtYmVycy9wcmlzbS1saW5lLW51bWJlcnMuY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX3ZhcmlhYmxlcy5zY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX21peGlucy5zY3NzIiwic3JjL3N0eWxlcy9hdXRvbG9hZC9fem9vbS5zY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX2dsb2JhbC5zY3NzIiwic3JjL3N0eWxlcy9jb21wb25lbnRzL19ncmlkLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fdHlwb2dyYXBoeS5zY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX3V0aWxpdGllcy5zY3NzIiwic3JjL3N0eWxlcy9jb21wb25lbnRzL19mb3JtLnNjc3MiLCJzcmMvc3R5bGVzL2NvbXBvbmVudHMvX2ljb25zLnNjc3MiLCJzcmMvc3R5bGVzL2NvbXBvbmVudHMvX2FuaW1hdGVkLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX2hlYWRlci5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19mb290ZXIuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9faG9tZXBhZ2Uuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9fcG9zdC5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19zdG9yeS5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19hdXRob3Iuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9fc2VhcmNoLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX3NpZGViYXIuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9fc2lkZW5hdi5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL2hlbHBlci5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL3N1YnNjcmliZS5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19jb21tZW50cy5zY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX21vZGFsLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fd2lkZ2V0LnNjc3MiXSwic291cmNlc0NvbnRlbnQiOlsiQGNoYXJzZXQgXCJVVEYtOFwiO1xuXG5AaW1wb3J0IFwifm5vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplXCI7XG5AaW1wb3J0IFwifnByaXNtanMvdGhlbWVzL3ByaXNtXCI7XG5AaW1wb3J0IFwifnByaXNtanMvcGx1Z2lucy9saW5lLW51bWJlcnMvcHJpc20tbGluZS1udW1iZXJzXCI7XG5cbi8vIE1peGlucyAmIFZhcmlhYmxlc1xuQGltcG9ydCBcImNvbW1vbi92YXJpYWJsZXNcIjtcbkBpbXBvcnQgXCJjb21tb24vbWl4aW5zXCI7XG5cbi8vIEltcG9ydCBucG0gZGVwZW5kZW5jaWVzXG4vLyB6b29tIGltZ1xuQGltcG9ydCBcImF1dG9sb2FkL3pvb21cIjtcblxuLy8gY29tbW9uXG5AaW1wb3J0IFwiY29tbW9uL2dsb2JhbFwiO1xuQGltcG9ydCBcImNvbXBvbmVudHMvZ3JpZFwiO1xuQGltcG9ydCBcImNvbW1vbi90eXBvZ3JhcGh5XCI7XG5AaW1wb3J0IFwiY29tbW9uL3V0aWxpdGllc1wiO1xuXG4vLyBjb21wb25lbnRzXG5AaW1wb3J0IFwiY29tcG9uZW50cy9mb3JtXCI7XG5AaW1wb3J0IFwiY29tcG9uZW50cy9pY29uc1wiO1xuQGltcG9ydCBcImNvbXBvbmVudHMvYW5pbWF0ZWRcIjtcblxuLy9sYXlvdXRzXG5AaW1wb3J0IFwibGF5b3V0cy9oZWFkZXJcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL2Zvb3RlclwiO1xuQGltcG9ydCBcImxheW91dHMvaG9tZXBhZ2VcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL3Bvc3RcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL3N0b3J5XCI7XG5AaW1wb3J0IFwibGF5b3V0cy9hdXRob3JcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL3NlYXJjaFwiO1xuQGltcG9ydCBcImxheW91dHMvc2lkZWJhclwiO1xuQGltcG9ydCBcImxheW91dHMvc2lkZW5hdlwiO1xuQGltcG9ydCBcImxheW91dHMvaGVscGVyXCI7XG5AaW1wb3J0IFwibGF5b3V0cy9zdWJzY3JpYmVcIjtcbkBpbXBvcnQgXCJsYXlvdXRzL2NvbW1lbnRzXCI7XG5AaW1wb3J0IFwiY29tbW9uL21vZGFsXCI7XG5AaW1wb3J0IFwiY29tbW9uL3dpZGdldFwiO1xuIiwiLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4wIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xuXG4vKiBEb2N1bWVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cbiAqL1xuXG5odG1sIHtcbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cbiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXG59XG5cbi8qIFNlY3Rpb25zXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5ib2R5IHtcbiAgbWFyZ2luOiAwO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIGBoMWAgZWxlbWVudHMgd2l0aGluIGBzZWN0aW9uYCBhbmRcbiAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXG4gKi9cblxuaDEge1xuICBmb250LXNpemU6IDJlbTtcbiAgbWFyZ2luOiAwLjY3ZW0gMDtcbn1cblxuLyogR3JvdXBpbmcgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXG4gKi9cblxuaHIge1xuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xuICBoZWlnaHQ6IDA7IC8qIDEgKi9cbiAgb3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnByZSB7XG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuYSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG4vKipcbiAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxuICovXG5cbmFiYnJbdGl0bGVdIHtcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxuICovXG5cbmIsXG5zdHJvbmcge1xuICBmb250LXdlaWdodDogYm9sZGVyO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuY29kZSxcbmtiZCxcbnNhbXAge1xuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zbWFsbCB7XG4gIGZvbnQtc2l6ZTogODAlO1xufVxuXG4vKipcbiAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxuICogYWxsIGJyb3dzZXJzLlxuICovXG5cbnN1YixcbnN1cCB7XG4gIGZvbnQtc2l6ZTogNzUlO1xuICBsaW5lLWhlaWdodDogMDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbnN1YiB7XG4gIGJvdHRvbTogLTAuMjVlbTtcbn1cblxuc3VwIHtcbiAgdG9wOiAtMC41ZW07XG59XG5cbi8qIEVtYmVkZGVkIGNvbnRlbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cbiAqL1xuXG5pbWcge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG59XG5cbi8qIEZvcm1zXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxuICovXG5cbmJ1dHRvbixcbmlucHV0LFxub3B0Z3JvdXAsXG5zZWxlY3QsXG50ZXh0YXJlYSB7XG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuICBtYXJnaW46IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQgeyAvKiAxICovXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxuICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbixcbnNlbGVjdCB7IC8qIDEgKi9cbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5bdHlwZT1cImJ1dHRvblwiXSxcblt0eXBlPVwicmVzZXRcIl0sXG5bdHlwZT1cInN1Ym1pdFwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJidXR0b25cIl06Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cInJlc2V0XCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJzdWJtaXRcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi8qKlxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxuICovXG5cbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcblt0eXBlPVwiYnV0dG9uXCJdOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJyZXNldFwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwic3VibWl0XCJdOi1tb3otZm9jdXNyaW5nIHtcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG5maWVsZHNldCB7XG4gIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxuICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBgZmllbGRzZXRgIGVsZW1lbnRzIGluIElFLlxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxuICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxubGVnZW5kIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xuICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xuICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cbiAgcGFkZGluZzogMDsgLyogMyAqL1xuICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cbiAqL1xuXG5wcm9ncmVzcyB7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cbiAqL1xuXG50ZXh0YXJlYSB7XG4gIG92ZXJmbG93OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxuICovXG5cblt0eXBlPVwiY2hlY2tib3hcIl0sXG5bdHlwZT1cInJhZGlvXCJdIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuICBwYWRkaW5nOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxuICovXG5cblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuICBoZWlnaHQ6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXG4gIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXG4gKi9cblxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXG4gIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cbn1cblxuLyogSW50ZXJhY3RpdmVcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxuICovXG5cbmRldGFpbHMge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdW1tYXJ5IHtcbiAgZGlzcGxheTogbGlzdC1pdGVtO1xufVxuXG4vKiBNaXNjXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cbiAqL1xuXG50ZW1wbGF0ZSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXG4gKi9cblxuW2hpZGRlbl0ge1xuICBkaXNwbGF5OiBub25lO1xufVxuIiwiLyoqXG4gKiBwcmlzbS5qcyBkZWZhdWx0IHRoZW1lIGZvciBKYXZhU2NyaXB0LCBDU1MgYW5kIEhUTUxcbiAqIEJhc2VkIG9uIGRhYmJsZXQgKGh0dHA6Ly9kYWJibGV0LmNvbSlcbiAqIEBhdXRob3IgTGVhIFZlcm91XG4gKi9cblxuY29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0sXG5wcmVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIHtcblx0Y29sb3I6IGJsYWNrO1xuXHRiYWNrZ3JvdW5kOiBub25lO1xuXHR0ZXh0LXNoYWRvdzogMCAxcHggd2hpdGU7XG5cdGZvbnQtZmFtaWx5OiBDb25zb2xhcywgTW9uYWNvLCAnQW5kYWxlIE1vbm8nLCAnVWJ1bnR1IE1vbm8nLCBtb25vc3BhY2U7XG5cdHRleHQtYWxpZ246IGxlZnQ7XG5cdHdoaXRlLXNwYWNlOiBwcmU7XG5cdHdvcmQtc3BhY2luZzogbm9ybWFsO1xuXHR3b3JkLWJyZWFrOiBub3JtYWw7XG5cdHdvcmQtd3JhcDogbm9ybWFsO1xuXHRsaW5lLWhlaWdodDogMS41O1xuXG5cdC1tb3otdGFiLXNpemU6IDQ7XG5cdC1vLXRhYi1zaXplOiA0O1xuXHR0YWItc2l6ZTogNDtcblxuXHQtd2Via2l0LWh5cGhlbnM6IG5vbmU7XG5cdC1tb3otaHlwaGVuczogbm9uZTtcblx0LW1zLWh5cGhlbnM6IG5vbmU7XG5cdGh5cGhlbnM6IG5vbmU7XG59XG5cbnByZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl06Oi1tb3otc2VsZWN0aW9uLCBwcmVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIDo6LW1vei1zZWxlY3Rpb24sXG5jb2RlW2NsYXNzKj1cImxhbmd1YWdlLVwiXTo6LW1vei1zZWxlY3Rpb24sIGNvZGVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIDo6LW1vei1zZWxlY3Rpb24ge1xuXHR0ZXh0LXNoYWRvdzogbm9uZTtcblx0YmFja2dyb3VuZDogI2IzZDRmYztcbn1cblxucHJlW2NsYXNzKj1cImxhbmd1YWdlLVwiXTo6c2VsZWN0aW9uLCBwcmVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIDo6c2VsZWN0aW9uLFxuY29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl06OnNlbGVjdGlvbiwgY29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0gOjpzZWxlY3Rpb24ge1xuXHR0ZXh0LXNoYWRvdzogbm9uZTtcblx0YmFja2dyb3VuZDogI2IzZDRmYztcbn1cblxuQG1lZGlhIHByaW50IHtcblx0Y29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0sXG5cdHByZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0ge1xuXHRcdHRleHQtc2hhZG93OiBub25lO1xuXHR9XG59XG5cbi8qIENvZGUgYmxvY2tzICovXG5wcmVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIHtcblx0cGFkZGluZzogMWVtO1xuXHRtYXJnaW46IC41ZW0gMDtcblx0b3ZlcmZsb3c6IGF1dG87XG59XG5cbjpub3QocHJlKSA+IGNvZGVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdLFxucHJlW2NsYXNzKj1cImxhbmd1YWdlLVwiXSB7XG5cdGJhY2tncm91bmQ6ICNmNWYyZjA7XG59XG5cbi8qIElubGluZSBjb2RlICovXG46bm90KHByZSkgPiBjb2RlW2NsYXNzKj1cImxhbmd1YWdlLVwiXSB7XG5cdHBhZGRpbmc6IC4xZW07XG5cdGJvcmRlci1yYWRpdXM6IC4zZW07XG5cdHdoaXRlLXNwYWNlOiBub3JtYWw7XG59XG5cbi50b2tlbi5jb21tZW50LFxuLnRva2VuLnByb2xvZyxcbi50b2tlbi5kb2N0eXBlLFxuLnRva2VuLmNkYXRhIHtcblx0Y29sb3I6IHNsYXRlZ3JheTtcbn1cblxuLnRva2VuLnB1bmN0dWF0aW9uIHtcblx0Y29sb3I6ICM5OTk7XG59XG5cbi5uYW1lc3BhY2Uge1xuXHRvcGFjaXR5OiAuNztcbn1cblxuLnRva2VuLnByb3BlcnR5LFxuLnRva2VuLnRhZyxcbi50b2tlbi5ib29sZWFuLFxuLnRva2VuLm51bWJlcixcbi50b2tlbi5jb25zdGFudCxcbi50b2tlbi5zeW1ib2wsXG4udG9rZW4uZGVsZXRlZCB7XG5cdGNvbG9yOiAjOTA1O1xufVxuXG4udG9rZW4uc2VsZWN0b3IsXG4udG9rZW4uYXR0ci1uYW1lLFxuLnRva2VuLnN0cmluZyxcbi50b2tlbi5jaGFyLFxuLnRva2VuLmJ1aWx0aW4sXG4udG9rZW4uaW5zZXJ0ZWQge1xuXHRjb2xvcjogIzY5MDtcbn1cblxuLnRva2VuLm9wZXJhdG9yLFxuLnRva2VuLmVudGl0eSxcbi50b2tlbi51cmwsXG4ubGFuZ3VhZ2UtY3NzIC50b2tlbi5zdHJpbmcsXG4uc3R5bGUgLnRva2VuLnN0cmluZyB7XG5cdGNvbG9yOiAjOWE2ZTNhO1xuXHRiYWNrZ3JvdW5kOiBoc2xhKDAsIDAlLCAxMDAlLCAuNSk7XG59XG5cbi50b2tlbi5hdHJ1bGUsXG4udG9rZW4uYXR0ci12YWx1ZSxcbi50b2tlbi5rZXl3b3JkIHtcblx0Y29sb3I6ICMwN2E7XG59XG5cbi50b2tlbi5mdW5jdGlvbixcbi50b2tlbi5jbGFzcy1uYW1lIHtcblx0Y29sb3I6ICNERDRBNjg7XG59XG5cbi50b2tlbi5yZWdleCxcbi50b2tlbi5pbXBvcnRhbnQsXG4udG9rZW4udmFyaWFibGUge1xuXHRjb2xvcjogI2U5MDtcbn1cblxuLnRva2VuLmltcG9ydGFudCxcbi50b2tlbi5ib2xkIHtcblx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG59XG4udG9rZW4uaXRhbGljIHtcblx0Zm9udC1zdHlsZTogaXRhbGljO1xufVxuXG4udG9rZW4uZW50aXR5IHtcblx0Y3Vyc29yOiBoZWxwO1xufVxuIiwicHJlW2NsYXNzKj1cImxhbmd1YWdlLVwiXS5saW5lLW51bWJlcnMge1xuXHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdHBhZGRpbmctbGVmdDogMy44ZW07XG5cdGNvdW50ZXItcmVzZXQ6IGxpbmVudW1iZXI7XG59XG5cbnByZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0ubGluZS1udW1iZXJzID4gY29kZSB7XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0d2hpdGUtc3BhY2U6IGluaGVyaXQ7XG59XG5cbi5saW5lLW51bWJlcnMgLmxpbmUtbnVtYmVycy1yb3dzIHtcblx0cG9zaXRpb246IGFic29sdXRlO1xuXHRwb2ludGVyLWV2ZW50czogbm9uZTtcblx0dG9wOiAwO1xuXHRmb250LXNpemU6IDEwMCU7XG5cdGxlZnQ6IC0zLjhlbTtcblx0d2lkdGg6IDNlbTsgLyogd29ya3MgZm9yIGxpbmUtbnVtYmVycyBiZWxvdyAxMDAwIGxpbmVzICovXG5cdGxldHRlci1zcGFjaW5nOiAtMXB4O1xuXHRib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjOTk5O1xuXG5cdC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG5cdC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG5cdC1tcy11c2VyLXNlbGVjdDogbm9uZTtcblx0dXNlci1zZWxlY3Q6IG5vbmU7XG5cbn1cblxuXHQubGluZS1udW1iZXJzLXJvd3MgPiBzcGFuIHtcblx0XHRwb2ludGVyLWV2ZW50czogbm9uZTtcblx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRjb3VudGVyLWluY3JlbWVudDogbGluZW51bWJlcjtcblx0fVxuXG5cdFx0LmxpbmUtbnVtYmVycy1yb3dzID4gc3BhbjpiZWZvcmUge1xuXHRcdFx0Y29udGVudDogY291bnRlcihsaW5lbnVtYmVyKTtcblx0XHRcdGNvbG9yOiAjOTk5O1xuXHRcdFx0ZGlzcGxheTogYmxvY2s7XG5cdFx0XHRwYWRkaW5nLXJpZ2h0OiAwLjhlbTtcblx0XHRcdHRleHQtYWxpZ246IHJpZ2h0O1xuXHRcdH1cbiIsIi8vIDEuIENvbG9yc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuJHByaW1hcnktY29sb3I6ICMxQzk5NjM7XG4vLyAkcHJpbWFyeS1jb2xvcjogIzAwQTAzNDtcbiRwcmltYXJ5LWNvbG9yLWhvdmVyOiAjMDBhYjZiO1xuXG4vLyAkcHJpbWFyeS1jb2xvcjogIzMzNjY4YztcbiRwcmltYXJ5LWNvbG9yLWRhcms6ICAgIzE5NzZkMjtcblxuJHByaW1hcnktdGV4dC1jb2xvcjogICByZ2JhKDAsIDAsIDAsIC44NCk7XG5cbi8vICRwcmltYXJ5LWNvbG9yLWxpZ2h0OlxuLy8gJHByaW1hcnktY29sb3ItdGV4dDpcbi8vICRhY2NlbnQtY29sb3I6XG4vLyAkcHJpbWFyeS10ZXh0LWNvbG9yOlxuLy8gJHNlY29uZGFyeS10ZXh0LWNvbG9yOlxuLy8gJGRpdmlkZXItY29sb3I6XG5cbi8vIHNvY2lhbCBjb2xvcnNcbiRzb2NpYWwtY29sb3JzOiAoXG4gIGZhY2Vib29rOiAgICMzYjU5OTgsXG4gIHR3aXR0ZXI6ICAgICM1NWFjZWUsXG4gIGdvb2dsZTogICAgICNkZDRiMzksXG4gIGluc3RhZ3JhbTogICMzMDYwODgsXG4gIHlvdXR1YmU6ICAgICNlNTJkMjcsXG4gIGdpdGh1YjogICAgICM1NTUsXG4gIGxpbmtlZGluOiAgICMwMDdiYjYsXG4gIHNwb3RpZnk6ICAgICMyZWJkNTksXG4gIGNvZGVwZW46ICAgICMyMjIsXG4gIGJlaGFuY2U6ICAgICMxMzE0MTgsXG4gIGRyaWJiYmxlOiAgICNlYTRjODksXG4gIGZsaWNrcjogICAgICMwMDYzZGMsXG4gIHJlZGRpdDogICAgICNmZjQ1MDAsXG4gIHBvY2tldDogICAgICNmNTAwNTcsXG4gIHBpbnRlcmVzdDogICNiZDA4MWMsXG4gIHdoYXRzYXBwOiAgICM2NGQ0NDgsXG4gIHRlbGVncmFtOiAgICMwOGMsXG4gIHJzczogICAgICAgICAgb3JhbmdlXG4pO1xuXG4vLyAyLiBGb250c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuJHByaW1hcnktZm9udDogICAgJ1J1ZGEnLCBzYW5zLXNlcmlmOyAvLyBmb250IGRlZmF1bHQgcGFnZSBhbmQgdGl0bGVzXG4kc2VjdW5kYXJ5LWZvbnQ6ICAnTWVycml3ZWF0aGVyJywgc2VyaWY7IC8vIGZvbnQgZm9yIGNvbnRlbnRcbiRjb2RlLWZvbnQ6ICAgICAgICdGaXJhIE1vbm8nLCBtb25vc3BhY2U7IC8vIGZvbnQgZm9yIGNvZGUgYW5kIHByZVxuXG4kZm9udC1zaXplLWJhc2U6IDE2cHg7XG5cbi8vIDMuIFR5cG9ncmFwaHlcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiRmb250LXNpemUtcm9vdDogIDE2cHg7XG5cbiRmb250LXNpemUtaDE6ICAgIDJyZW07XG4kZm9udC1zaXplLWgyOiAgICAxLjg3NXJlbTtcbiRmb250LXNpemUtaDM6ICAgIDEuNnJlbTtcbiRmb250LXNpemUtaDQ6ICAgIDEuNHJlbTtcbiRmb250LXNpemUtaDU6ICAgIDEuMnJlbTtcbiRmb250LXNpemUtaDY6ICAgIDFyZW07XG5cbiRoZWFkaW5ncy1mb250LWZhbWlseTogICAgICRwcmltYXJ5LWZvbnQ7XG4kaGVhZGluZ3MtZm9udC13ZWlnaHQ6ICAgICA2MDA7XG4kaGVhZGluZ3MtbGluZS1oZWlnaHQ6ICAgICAxLjE7XG4kaGVhZGluZ3MtY29sb3I6ICAgICAgICAgICBpbmhlcml0O1xuXG4vLyBDb250YWluZXJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiRjb250YWluZXItc206ICAgICAgICAgICAgIDU3NnB4O1xuJGNvbnRhaW5lci1tZDogICAgICAgICAgICAgNzY4cHg7XG4kY29udGFpbmVyLWxnOiAgICAgICAgICAgICA5NzBweDtcbiRjb250YWluZXIteGw6ICAgICAgICAgICAgIDEyMDBweDtcblxuLy8gSGVhZGVyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuJGhlYWRlci1jb2xvcjogI0JCRjFCOTtcbiRoZWFkZXItY29sb3ItaG92ZXI6ICNFRUZGRUE7XG4kaGVhZGVyLWhlaWdodDogNTBweDtcblxuLy8gMy4gTWVkaWEgUXVlcnkgUmFuZ2VzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4kbnVtLWNvbHM6IDEyO1xuXG4vLyAzLiBNZWRpYSBRdWVyeSBSYW5nZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiRzbTogICAgICAgICAgICA2NDBweDtcbiRtZDogICAgICAgICAgICA3NjZweDtcbiRsZzogICAgICAgICAgICAxMDAwcHg7XG4keGw6ICAgICAgICAgICAgMTIzMHB4O1xuXG4kc20tYW5kLXVwOiAgICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aCA6ICN7JHNtfSlcIjtcbiRtZC1hbmQtdXA6ICAgICBcIm9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoIDogI3skbWR9KVwiO1xuJGxnLWFuZC11cDogICAgIFwib25seSBzY3JlZW4gYW5kIChtaW4td2lkdGggOiAjeyRsZ30pXCI7XG4keGwtYW5kLXVwOiAgICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aCA6ICN7JHhsfSlcIjtcblxuJHNtLWFuZC1kb3duOiAgIFwib25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGggOiAjeyRzbX0pXCI7XG4kbWQtYW5kLWRvd246ICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aCA6ICN7JG1kfSlcIjtcbiRsZy1hbmQtZG93bjogICBcIm9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoIDogI3skbGd9KVwiO1xuXG4vLyBDb2RlIENvbG9yXG4kY29kZS1iZy1jb2xvcjogICAjZjdmN2Y3O1xuJGZvbnQtc2l6ZS1jb2RlOiAgMTVweDtcbiRjb2RlLWNvbG9yOiAgICAgICNjNzI1NGU7XG4kcHJlLWNvZGUtY29sb3I6ICAjMzc0NzRmO1xuXG4vLyBpY29uc1xuXG4kaS1jb2RlOiBcIlxcZjEyMVwiO1xuJGktd2FybmluZzogXCJcXGUwMDJcIjtcbiRpLWNoZWNrOiBcIlxcZTg2Y1wiO1xuJGktc3RhcjogXCJcXGU4MzhcIjtcbiIsIiVsaW5rIHtcbiAgY29sb3I6IGluaGVyaXQ7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuXG4lbGluay0tYWNjZW50IHtcbiAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIC8vICY6aG92ZXIgeyBjb2xvcjogJHByaW1hcnktY29sb3ItaG92ZXI7IH1cbn1cblxuJWNvbnRlbnQtYWJzb2x1dGUtYm90dG9tIHtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICBtYXJnaW46IDMwcHg7XG4gIG1heC13aWR0aDogNjAwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogMjtcbn1cblxuJXUtYWJzb2x1dGUwIHtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHJpZ2h0OiAwO1xuICB0b3A6IDA7XG59XG5cbiV1LXRleHQtY29sb3ItZGFya2VyIHtcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjgpICFpbXBvcnRhbnQ7XG4gIGZpbGw6IHJnYmEoMCwgMCwgMCwgLjgpICFpbXBvcnRhbnQ7XG59XG5cbiVmb250cy1pY29ucyB7XG4gIC8qIHVzZSAhaW1wb3J0YW50IHRvIHByZXZlbnQgaXNzdWVzIHdpdGggYnJvd3NlciBleHRlbnNpb25zIHRoYXQgY2hhbmdlIGZvbnRzICovXG4gIGZvbnQtZmFtaWx5OiAnbWFwYWNoZScgIWltcG9ydGFudDsgLyogc3R5bGVsaW50LWRpc2FibGUtbGluZSAqL1xuICBzcGVhazogbm9uZTtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXZhcmlhbnQ6IG5vcm1hbDtcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG4gIGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xuXG4gIC8qIEJldHRlciBGb250IFJlbmRlcmluZyA9PT09PT09PT09PSAqL1xuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcbiAgLW1vei1vc3gtZm9udC1zbW9vdGhpbmc6IGdyYXlzY2FsZTtcbn1cbiIsIi8vIHN0eWxlbGludC1kaXNhYmxlXHJcbmltZ1tkYXRhLWFjdGlvbj1cInpvb21cIl0ge1xyXG4gIGN1cnNvcjogem9vbS1pbjtcclxufVxyXG4uem9vbS1pbWcsXHJcbi56b29tLWltZy13cmFwIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgei1pbmRleDogNjY2O1xyXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogYWxsIDMwMG1zO1xyXG4gICAgICAgLW8tdHJhbnNpdGlvbjogYWxsIDMwMG1zO1xyXG4gICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDMwMG1zO1xyXG59XHJcbmltZy56b29tLWltZyB7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIGN1cnNvcjogLXdlYmtpdC16b29tLW91dDtcclxuICBjdXJzb3I6IC1tb3otem9vbS1vdXQ7XHJcbn1cclxuLnpvb20tb3ZlcmxheSB7XHJcbiAgei1pbmRleDogNDIwO1xyXG4gIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgcG9zaXRpb246IGZpeGVkO1xyXG4gIHRvcDogMDtcclxuICBsZWZ0OiAwO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIGJvdHRvbTogMDtcclxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICBmaWx0ZXI6IFwiYWxwaGEob3BhY2l0eT0wKVwiO1xyXG4gIG9wYWNpdHk6IDA7XHJcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAgICAgIG9wYWNpdHkgMzAwbXM7XHJcbiAgICAgICAtby10cmFuc2l0aW9uOiAgICAgIG9wYWNpdHkgMzAwbXM7XHJcbiAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgIG9wYWNpdHkgMzAwbXM7XHJcbn1cclxuLnpvb20tb3ZlcmxheS1vcGVuIC56b29tLW92ZXJsYXkge1xyXG4gIGZpbHRlcjogXCJhbHBoYShvcGFjaXR5PTEwMClcIjtcclxuICBvcGFjaXR5OiAxO1xyXG59XHJcbi56b29tLW92ZXJsYXktb3BlbixcclxuLnpvb20tb3ZlcmxheS10cmFuc2l0aW9uaW5nIHtcclxuICBjdXJzb3I6IGRlZmF1bHQ7XHJcbn1cclxuIiwiOnJvb3Qge1xuICAtLWJsYWNrOiAjMDAwO1xuICAtLXdoaXRlOiAjZmZmO1xuICAtLXByaW1hcnktY29sb3I6ICMxQzk5NjM7XG4gIC0tc2Vjb25kYXJ5LWNvbG9yOiAjMmFkODhkO1xuICAtLWhlYWRlci1jb2xvcjogI0JCRjFCOTtcbiAgLS1oZWFkZXItY29sb3ItaG92ZXI6ICNFRUZGRUE7XG4gIC0tcG9zdC1jb2xvci1saW5rOiAjMmFkODhkO1xuICAtLXN0b3J5LWNvdmVyLWNhdGVnb3J5LWNvbG9yOiAjMmFkODhkO1xuICAtLWNvbXBvc2l0ZS1jb2xvcjogI0NDMTE2RTtcbiAgLS1mb290ZXItY29sb3ItbGluazogIzJhZDg4ZDtcbiAgLS1tZWRpYS10eXBlLWNvbG9yOiAjMmFkODhkO1xufVxuXG4qLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuYSB7XG4gIGNvbG9yOiBpbmhlcml0O1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG5cbiAgJjphY3RpdmUsXG4gICY6aG92ZXIge1xuICAgIG91dGxpbmU6IDA7XG4gIH1cbn1cblxuYmxvY2txdW90ZSB7XG4gIGJvcmRlci1sZWZ0OiAzcHggc29saWQgIzAwMDtcbiAgY29sb3I6ICMwMDA7XG4gIGZvbnQtZmFtaWx5OiAkc2VjdW5kYXJ5LWZvbnQ7XG4gIGZvbnQtc2l6ZTogMS4xODc1cmVtO1xuICBmb250LXN0eWxlOiBpdGFsaWM7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGxldHRlci1zcGFjaW5nOiAtLjAwM2VtO1xuICBsaW5lLWhlaWdodDogMS43O1xuICBtYXJnaW46IDMwcHggMCAwIC0xMnB4O1xuICBwYWRkaW5nLWJvdHRvbTogMnB4O1xuICBwYWRkaW5nLWxlZnQ6IDIwcHg7XG5cbiAgcDpmaXJzdC1vZi10eXBlIHsgbWFyZ2luLXRvcDogMCB9XG59XG5cbmJvZHkge1xuICBjb2xvcjogJHByaW1hcnktdGV4dC1jb2xvcjtcbiAgZm9udC1mYW1pbHk6ICRwcmltYXJ5LWZvbnQ7XG4gIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1iYXNlO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGxldHRlci1zcGFjaW5nOiAwO1xuICBsaW5lLWhlaWdodDogMS40O1xuICBtYXJnaW46IDAgYXV0bztcbiAgdGV4dC1yZW5kZXJpbmc6IG9wdGltaXplTGVnaWJpbGl0eTtcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xufVxuXG4vL0RlZmF1bHQgc3R5bGVzXG5odG1sIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgZm9udC1zaXplOiAkZm9udC1zaXplLXJvb3Q7XG59XG5cbmZpZ3VyZSB7XG4gIG1hcmdpbjogMDtcbn1cblxuZmlnY2FwdGlvbiB7XG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC42OCk7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBmb250LWZhbWlseTogJHNlY3VuZGFyeS1mb250O1xuICBmb250LWZlYXR1cmUtc2V0dGluZ3M6IFwibGlnYVwiIG9uLCBcImxudW1cIiBvbjtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGxlZnQ6IDA7XG4gIGxldHRlci1zcGFjaW5nOiAwO1xuICBsaW5lLWhlaWdodDogMS40O1xuICBtYXJnaW4tdG9wOiAxMHB4O1xuICBvdXRsaW5lOiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdG9wOiAwO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLy8gQ29kZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmtiZCwgc2FtcCwgY29kZSB7XG4gIGJhY2tncm91bmQ6ICRjb2RlLWJnLWNvbG9yO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIGNvbG9yOiAkY29kZS1jb2xvcjtcbiAgZm9udC1mYW1pbHk6ICRjb2RlLWZvbnQgIWltcG9ydGFudDtcbiAgZm9udC1zaXplOiAkZm9udC1zaXplLWNvZGU7XG4gIHBhZGRpbmc6IDRweCA2cHg7XG4gIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbn1cblxucHJlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogJGNvZGUtYmctY29sb3IgIWltcG9ydGFudDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBmb250LWZhbWlseTogJGNvZGUtZm9udCAhaW1wb3J0YW50O1xuICBmb250LXNpemU6ICRmb250LXNpemUtY29kZTtcbiAgbWFyZ2luLXRvcDogMzBweCAhaW1wb3J0YW50O1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHBhZGRpbmc6IDFyZW07XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgd29yZC13cmFwOiBub3JtYWw7XG5cbiAgY29kZSB7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgY29sb3I6ICRwcmUtY29kZS1jb2xvcjtcbiAgICBwYWRkaW5nOiAwO1xuICAgIHRleHQtc2hhZG93OiAwIDFweCAjZmZmO1xuICB9XG59XG5cbmNvZGVbY2xhc3MqPWxhbmd1YWdlLV0sXG5wcmVbY2xhc3MqPWxhbmd1YWdlLV0ge1xuICBjb2xvcjogJHByZS1jb2RlLWNvbG9yO1xuICBsaW5lLWhlaWdodDogMS40O1xuXG4gIC50b2tlbi5jb21tZW50IHsgb3BhY2l0eTogLjg7IH1cblxuICAmLmxpbmUtbnVtYmVycyB7XG4gICAgcGFkZGluZy1sZWZ0OiA1OHB4O1xuXG4gICAgJjo6YmVmb3JlIHtcbiAgICAgIGNvbnRlbnQ6IFwiXCI7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBsZWZ0OiAwO1xuICAgICAgdG9wOiAwO1xuICAgICAgYmFja2dyb3VuZDogI0YwRURFRTtcbiAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgIH1cbiAgfVxuXG4gIC5saW5lLW51bWJlcnMtcm93cyB7XG4gICAgYm9yZGVyLXJpZ2h0OiBub25lO1xuICAgIHRvcDogLTNweDtcbiAgICBsZWZ0OiAtNThweDtcblxuICAgICYgPiBzcGFuOjpiZWZvcmUge1xuICAgICAgcGFkZGluZy1yaWdodDogMDtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIG9wYWNpdHk6IC44O1xuICAgIH1cbiAgfVxufVxuXG4vLyBoclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmhyOm5vdCguaHItbGlzdCk6bm90KC5wb3N0LWZvb3Rlci1ocikge1xuICBib3JkZXI6IDA7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBtYXJnaW46IDUwcHggYXV0bztcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuXG4gICY6OmJlZm9yZSB7XG4gICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjYpO1xuICAgIGNvbnRlbnQ6ICcuLi4nO1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBmb250LWZhbWlseTogJHByaW1hcnktZm9udDtcbiAgICBmb250LXNpemU6IDI4cHg7XG4gICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICBsZXR0ZXItc3BhY2luZzogLjZlbTtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgdG9wOiAtMjVweDtcbiAgfVxufVxuXG4ucG9zdC1mb290ZXItaHIge1xuICBoZWlnaHQ6IDFweDtcbiAgbWFyZ2luOiAzMnB4IDA7XG4gIGJvcmRlcjogMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2RkZDtcbn1cblxuaW1nIHtcbiAgaGVpZ2h0OiBhdXRvO1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIHdpZHRoOiBhdXRvO1xuXG4gICY6bm90KFtzcmNdKSB7XG4gICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICB9XG59XG5cbmkge1xuICAvLyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbmlucHV0IHtcbiAgYm9yZGVyOiBub25lO1xuICBvdXRsaW5lOiAwO1xufVxuXG5vbCwgdWwge1xuICBsaXN0LXN0eWxlOiBub25lO1xuICBsaXN0LXN0eWxlLWltYWdlOiBub25lO1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG5cbm1hcmsge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDIxNSwgMjUzLCAyMTEsIDEpLCByZ2JhKDIxNSwgMjUzLCAyMTEsIDEpKTtcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjgpO1xufVxuXG5xIHtcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjQ0KTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZvbnQtc2l6ZTogMjhweDtcbiAgZm9udC1zdHlsZTogaXRhbGljO1xuICBmb250LXdlaWdodDogNDAwO1xuICBsZXR0ZXItc3BhY2luZzogLS4wMTRlbTtcbiAgbGluZS1oZWlnaHQ6IDEuNDg7XG4gIHBhZGRpbmctbGVmdDogNTBweDtcbiAgcGFkZGluZy10b3A6IDE1cHg7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG5cbiAgJjo6YmVmb3JlLCAmOjphZnRlciB7IGRpc3BsYXk6IG5vbmU7IH1cbn1cblxudGFibGUge1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICBib3JkZXItc3BhY2luZzogMDtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYsIFwiQXBwbGUgQ29sb3IgRW1vamlcIiwgXCJTZWdvZSBVSSBFbW9qaVwiLCBcIlNlZ29lIFVJIFN5bWJvbFwiO1xuICBmb250LXNpemU6IDFyZW07XG4gIGxpbmUtaGVpZ2h0OiAxLjU7XG4gIG1hcmdpbjogMjBweCAwIDA7XG4gIG1heC13aWR0aDogMTAwJTtcbiAgb3ZlcmZsb3cteDogYXV0bztcbiAgdmVydGljYWwtYWxpZ246IHRvcDtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgd2lkdGg6IGF1dG87XG4gIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcblxuICB0aCxcbiAgdGQge1xuICAgIHBhZGRpbmc6IDZweCAxM3B4O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZmUyZTU7XG4gIH1cblxuICB0cjpudGgtY2hpbGQoMm4pIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjZmOGZhO1xuICB9XG5cbiAgdGgge1xuICAgIGxldHRlci1zcGFjaW5nOiAwLjJweDtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIH1cbn1cblxuLy8gTGlua3MgY29sb3Jcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4ubGluay0tYWNjZW50IHsgQGV4dGVuZCAlbGluay0tYWNjZW50OyB9XG5cbi5saW5rIHsgQGV4dGVuZCAlbGluazsgfVxuXG4ubGluay0tdW5kZXJsaW5lIHtcbiAgJjphY3RpdmUsXG4gICY6Zm9jdXMsXG4gICY6aG92ZXIge1xuICAgIC8vIGNvbG9yOiBpbmhlcml0O1xuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICB9XG59XG5cbi8vIEFuaW1hdGlvbiBtYWluIHBhZ2UgYW5kIGZvb3RlclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi5tYWluIHsgbWFyZ2luLWJvdHRvbTogNGVtOyBtaW4taGVpZ2h0OiA5MHZoIH1cblxuLm1haW4sXG4uZm9vdGVyIHsgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC41cyBlYXNlOyB9XG5cbi8vIHdhcm5pbmcgc3VjY2VzcyBhbmQgTm90ZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi53YXJuaW5nIHtcbiAgYmFja2dyb3VuZDogI2ZiZTllNztcbiAgY29sb3I6ICNkNTAwMDA7XG4gICY6OmJlZm9yZSB7IGNvbnRlbnQ6ICRpLXdhcm5pbmc7IH1cbn1cblxuLm5vdGUge1xuICBiYWNrZ3JvdW5kOiAjZTFmNWZlO1xuICBjb2xvcjogIzAyODhkMTtcbiAgJjo6YmVmb3JlIHsgY29udGVudDogJGktc3RhcjsgfVxufVxuXG4uc3VjY2VzcyB7XG4gIGJhY2tncm91bmQ6ICNlMGYyZjE7XG4gIGNvbG9yOiAjMDA4OTdiO1xuICAmOjpiZWZvcmUgeyBjb2xvcjogIzAwYmZhNTsgY29udGVudDogJGktY2hlY2s7IH1cbn1cblxuLndhcm5pbmcsIC5ub3RlLCAuc3VjY2VzcyB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBmb250LXNpemU6IDE4cHggIWltcG9ydGFudDtcbiAgbGluZS1oZWlnaHQ6IDEuNTggIWltcG9ydGFudDtcbiAgbWFyZ2luLXRvcDogMjhweDtcbiAgcGFkZGluZzogMTJweCAyNHB4IDEycHggNjBweDtcblxuICBhIHtcbiAgICBjb2xvcjogaW5oZXJpdDtcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgfVxuXG4gICY6OmJlZm9yZSB7XG4gICAgQGV4dGVuZCAlZm9udHMtaWNvbnM7XG5cbiAgICBmbG9hdDogbGVmdDtcbiAgICBmb250LXNpemU6IDI0cHg7XG4gICAgbWFyZ2luLWxlZnQ6IC0zNnB4O1xuICAgIG1hcmdpbi10b3A6IC01cHg7XG4gIH1cbn1cblxuLy8gUGFnZSBUYWdzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLnRhZyB7XG4gICYtZGVzY3JpcHRpb24geyBtYXgtd2lkdGg6IDUwMHB4IH1cbiAgJi5oYXMtLWltYWdlIHsgbWluLWhlaWdodDogMzUwcHggfVxufVxuXG4vLyB0b2x0aXBcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4ud2l0aC10b29sdGlwIHtcbiAgb3ZlcmZsb3c6IHZpc2libGU7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAmOjphZnRlciB7XG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAuODUpO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBjb250ZW50OiBhdHRyKGRhdGEtdG9vbHRpcCk7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGxlZnQ6IDUwJTtcbiAgICBsaW5lLWhlaWdodDogMS4yNTtcbiAgICBtaW4td2lkdGg6IDEzMHB4O1xuICAgIG9wYWNpdHk6IDA7XG4gICAgcGFkZGluZzogNHB4IDhweDtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHRleHQtdHJhbnNmb3JtOiBub25lO1xuICAgIHRvcDogLTMwcHg7XG4gICAgd2lsbC1jaGFuZ2U6IG9wYWNpdHksIHRyYW5zZm9ybTtcbiAgICB6LWluZGV4OiAxO1xuICB9XG5cbiAgJjpob3Zlcjo6YWZ0ZXIge1xuICAgIGFuaW1hdGlvbjogdG9vbHRpcCAuMXMgZWFzZS1vdXQgYm90aDtcbiAgfVxufVxuXG4vLyBFcnJvciBwYWdlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLmVycm9yUGFnZSB7XG4gIGZvbnQtZmFtaWx5OiAnUm9ib3RvIE1vbm8nLCBtb25vc3BhY2U7XG5cbiAgJi1saW5rIHtcbiAgICBsZWZ0OiAtNXB4O1xuICAgIHBhZGRpbmc6IDI0cHggNjBweDtcbiAgICB0b3A6IC02cHg7XG4gIH1cblxuICAmLXRleHQge1xuICAgIG1hcmdpbi10b3A6IDYwcHg7XG4gICAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xuICB9XG5cbiAgJi13cmFwIHtcbiAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNCk7XG4gICAgcGFkZGluZzogN3Z3IDR2dztcbiAgfVxufVxuXG4vLyBWaWRlbyBSZXNwb25zaXZlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLnZpZGVvLXJlc3BvbnNpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbiAgaGVpZ2h0OiAwO1xuICBtYXJnaW4tdG9wOiAzMHB4O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBwYWRkaW5nOiAwIDAgNTYuMjUlO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHdpZHRoOiAxMDAlO1xuXG4gIGlmcmFtZSB7XG4gICAgYm9yZGVyOiAwO1xuICAgIGJvdHRvbTogMDtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgbGVmdDogMDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG5cbiAgdmlkZW8ge1xuICAgIGJvcmRlcjogMDtcbiAgICBib3R0b206IDA7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIGxlZnQ6IDA7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMDtcbiAgICB3aWR0aDogMTAwJTtcbiAgfVxufVxuXG4ua2ctZW1iZWQtY2FyZCAudmlkZW8tcmVzcG9uc2l2ZSB7IG1hcmdpbi10b3A6IDAgfVxuXG4vLyBTb2NpYWwgTWVkaWEgQ29sb3Jcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5AZWFjaCAkc29jaWFsLW5hbWUsICRjb2xvciBpbiAkc29jaWFsLWNvbG9ycyB7XG4gIC5jLSN7JHNvY2lhbC1uYW1lfSB7IGNvbG9yOiAkY29sb3IgIWltcG9ydGFudDsgfVxuICAuYmctI3skc29jaWFsLW5hbWV9IHsgYmFja2dyb3VuZC1jb2xvcjogJGNvbG9yICFpbXBvcnRhbnQ7IH1cbn1cblxuLy8gRmFjZWJvb2sgU2F2ZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIC5mYlNhdmUge1xuLy8gICAmLWRyb3Bkb3duIHtcbi8vICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuLy8gICAgIGJvcmRlcjogMXB4IHNvbGlkICNlMGUwZTA7XG4vLyAgICAgYm90dG9tOiAxMDAlO1xuLy8gICAgIGRpc3BsYXk6IG5vbmU7XG4vLyAgICAgbWF4LXdpZHRoOiAyMDBweDtcbi8vICAgICBtaW4td2lkdGg6IDEwMHB4O1xuLy8gICAgIHBhZGRpbmc6IDhweDtcbi8vICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAwKTtcbi8vICAgICB6LWluZGV4OiAxMDtcblxuLy8gICAgICYuaXMtdmlzaWJsZSB7IGRpc3BsYXk6IGJsb2NrOyB9XG4vLyAgIH1cbi8vIH1cblxuLy8gUm9ja2V0IGZvciByZXR1cm4gdG9wIHBhZ2Vcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4ucm9ja2V0IHtcbiAgYm90dG9tOiA1MHB4O1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHJpZ2h0OiAyMHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHdpZHRoOiA2MHB4O1xuICB6LWluZGV4OiA1O1xuXG4gICY6aG92ZXIgc3ZnIHBhdGgge1xuICAgIGZpbGw6IHJnYmEoMCwgMCwgMCwgLjYpO1xuICB9XG59XG5cbi5zdmdJY29uIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xufVxuXG5zdmcge1xuICBoZWlnaHQ6IGF1dG87XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4vLyBQYWdpbmF0aW9uIEluZmluaXRlIFNjcm9sbFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLmxvYWQtbW9yZSB7IG1heC13aWR0aDogNzAlICFpbXBvcnRhbnQgfVxuXG4vLyBsb2FkaW5nQmFyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4ubG9hZGluZ0JhciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICM0OGU3OWE7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIGhlaWdodDogMnB4O1xuICBsZWZ0OiAwO1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHJpZ2h0OiAwO1xuICB0b3A6IDA7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDAlKTtcbiAgei1pbmRleDogODAwO1xufVxuXG4uaXMtbG9hZGluZyAubG9hZGluZ0JhciB7XG4gIGFuaW1hdGlvbjogbG9hZGluZy1iYXIgMXMgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG4gIGFuaW1hdGlvbi1kZWxheTogLjhzO1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLy8gTWVkaWEgUXVlcnkgcmVzcG9uc2ludmVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5AbWVkaWEgI3skbWQtYW5kLWRvd259IHtcbiAgYmxvY2txdW90ZSB7IG1hcmdpbi1sZWZ0OiAtNXB4OyBmb250LXNpemU6IDEuMTI1cmVtIH1cblxuICAua2ctaW1hZ2UtY2FyZCxcbiAgLmtnLWVtYmVkLWNhcmQge1xuICAgIG1hcmdpbi1yaWdodDogLTIwcHg7XG4gICAgbWFyZ2luLWxlZnQ6IC0yMHB4O1xuICB9XG59XG4iLCIvLyBDb250YWluZXJcbi5leHRyZW1lLWNvbnRhaW5lciB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIG1hcmdpbjogMCBhdXRvO1xuICBtYXgtd2lkdGg6IDEyMDBweDtcbiAgcGFkZGluZzogMCAxNnB4O1xuICB3aWR0aDogMTAwJTtcbn1cblxuLy8gQG1lZGlhICN7JGxnLWFuZC11cH0ge1xuLy8gICAuY29udGVudCB7XG4vLyAgICAgLy8gZmxleDogMSAhaW1wb3J0YW50O1xuLy8gICAgIG1heC13aWR0aDogY2FsYygxMDAlIC0gMzQwcHgpICFpbXBvcnRhbnQ7XG4vLyAgICAgLy8gb3JkZXI6IDE7XG4vLyAgICAgLy8gb3ZlcmZsb3c6IGhpZGRlbjtcbi8vICAgfVxuXG4vLyAgIC5zaWRlYmFyIHtcbi8vICAgICB3aWR0aDogMzQwcHggIWltcG9ydGFudDtcbi8vICAgICAvLyBmbGV4OiAwIDAgMzQwcHggIWltcG9ydGFudDtcbi8vICAgICAvLyBvcmRlcjogMjtcbi8vICAgfVxuLy8gfVxuXG4uY29sLWxlZnQsXG4uY2MtdmlkZW8tbGVmdCB7XG4gIGZsZXgtYmFzaXM6IDA7XG4gIGZsZXgtZ3JvdzogMTtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBwYWRkaW5nLXJpZ2h0OiAxMHB4O1xuICBwYWRkaW5nLWxlZnQ6IDEwcHg7XG59XG5cbi8vIEBtZWRpYSAjeyRtZC1hbmQtdXB9IHtcbi8vIH1cblxuQG1lZGlhICN7JGxnLWFuZC11cH0ge1xuICAuY29sLWxlZnQgeyBtYXgtd2lkdGg6IGNhbGMoMTAwJSAtIDM0MHB4KSB9XG4gIC5jYy12aWRlby1sZWZ0IHsgbWF4LXdpZHRoOiBjYWxjKDEwMCUgLSAzMjBweCkgfVxuICAuY2MtdmlkZW8tcmlnaHQgeyBmbGV4LWJhc2lzOiAzMjBweCAhaW1wb3J0YW50OyBtYXgtd2lkdGg6IDMyMHB4ICFpbXBvcnRhbnQ7IH1cbiAgYm9keS5pcy1hcnRpY2xlIC5jb2wtbGVmdCB7IHBhZGRpbmctcmlnaHQ6IDQwcHggfVxufVxuXG4uY29sLXJpZ2h0IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgcGFkZGluZy1sZWZ0OiAxMHB4O1xuICBwYWRkaW5nLXJpZ2h0OiAxMHB4O1xuICB3aWR0aDogMzIwcHg7XG59XG5cbi5yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGZsZXg6IDAgMSBhdXRvO1xuICBtYXJnaW4tbGVmdDogLSAxMHB4O1xuICBtYXJnaW4tcmlnaHQ6IC0gMTBweDtcblxuICAuY29sIHtcbiAgICBmbGV4OiAwIDAgYXV0bztcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIHBhZGRpbmctbGVmdDogMTBweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAxMHB4O1xuXG4gICAgJGk6IDE7XG5cbiAgICBAd2hpbGUgJGkgPD0gJG51bS1jb2xzIHtcbiAgICAgICRwZXJjOiB1bnF1b3RlKCgxMDAgLyAoJG51bS1jb2xzIC8gJGkpKSArIFwiJVwiKTtcblxuICAgICAgJi5zI3skaX0ge1xuICAgICAgICBmbGV4LWJhc2lzOiAkcGVyYztcbiAgICAgICAgbWF4LXdpZHRoOiAkcGVyYztcbiAgICAgIH1cblxuICAgICAgJGk6ICRpICsgMTtcbiAgICB9XG5cbiAgICBAbWVkaWEgI3skbWQtYW5kLXVwfSB7XG5cbiAgICAgICRpOiAxO1xuXG4gICAgICBAd2hpbGUgJGkgPD0gJG51bS1jb2xzIHtcbiAgICAgICAgJHBlcmM6IHVucXVvdGUoKDEwMCAvICgkbnVtLWNvbHMgLyAkaSkpICsgXCIlXCIpO1xuXG4gICAgICAgICYubSN7JGl9IHtcbiAgICAgICAgICBmbGV4LWJhc2lzOiAkcGVyYztcbiAgICAgICAgICBtYXgtd2lkdGg6ICRwZXJjO1xuICAgICAgICB9XG5cbiAgICAgICAgJGk6ICRpICsgMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBAbWVkaWEgI3skbGctYW5kLXVwfSB7XG5cbiAgICAgICRpOiAxO1xuXG4gICAgICBAd2hpbGUgJGkgPD0gJG51bS1jb2xzIHtcbiAgICAgICAgJHBlcmM6IHVucXVvdGUoKDEwMCAvICgkbnVtLWNvbHMgLyAkaSkpICsgXCIlXCIpO1xuXG4gICAgICAgICYubCN7JGl9IHtcbiAgICAgICAgICBmbGV4LWJhc2lzOiAkcGVyYztcbiAgICAgICAgICBtYXgtd2lkdGg6ICRwZXJjO1xuICAgICAgICB9XG5cbiAgICAgICAgJGk6ICRpICsgMTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIi8vIEhlYWRpbmdzXHJcblxyXG5oMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcclxuICBjb2xvcjogJGhlYWRpbmdzLWNvbG9yO1xyXG4gIGZvbnQtZmFtaWx5OiAkaGVhZGluZ3MtZm9udC1mYW1pbHk7XHJcbiAgZm9udC13ZWlnaHQ6ICRoZWFkaW5ncy1mb250LXdlaWdodDtcclxuICBsaW5lLWhlaWdodDogJGhlYWRpbmdzLWxpbmUtaGVpZ2h0O1xyXG4gIG1hcmdpbjogMDtcclxuXHJcbiAgYSB7XHJcbiAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgIGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xyXG4gIH1cclxufVxyXG5cclxuaDEgeyBmb250LXNpemU6ICRmb250LXNpemUtaDE7IH1cclxuaDIgeyBmb250LXNpemU6ICRmb250LXNpemUtaDI7IH1cclxuaDMgeyBmb250LXNpemU6ICRmb250LXNpemUtaDM7IH1cclxuaDQgeyBmb250LXNpemU6ICRmb250LXNpemUtaDQ7IH1cclxuaDUgeyBmb250LXNpemU6ICRmb250LXNpemUtaDU7IH1cclxuaDYgeyBmb250LXNpemU6ICRmb250LXNpemUtaDY7IH1cclxuXHJcbnAge1xyXG4gIG1hcmdpbjogMDtcclxufVxyXG4iLCIvLyBjb2xvclxuLnUtdGV4dENvbG9yTm9ybWFsIHtcbiAgLy8gY29sb3I6IHJnYmEoMCwgMCwgMCwgLjQ0KSAhaW1wb3J0YW50O1xuICAvLyBmaWxsOiByZ2JhKDAsIDAsIDAsIC40NCkgIWltcG9ydGFudDtcbiAgY29sb3I6IHJnYmEoMTUzLCAxNTMsIDE1MywgMSkgIWltcG9ydGFudDtcbiAgZmlsbDogcmdiYSgxNTMsIDE1MywgMTUzLCAxKSAhaW1wb3J0YW50O1xufVxuXG4udS10ZXh0Q29sb3JXaGl0ZSB7XG4gIGNvbG9yOiAjZmZmICFpbXBvcnRhbnQ7XG4gIGZpbGw6ICNmZmYgIWltcG9ydGFudDtcbn1cblxuLnUtaG92ZXJDb2xvck5vcm1hbDpob3ZlciB7XG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC42KTtcbiAgZmlsbDogcmdiYSgwLCAwLCAwLCAuNik7XG59XG5cbi51LWFjY2VudENvbG9yLS1pY29uTm9ybWFsIHtcbiAgY29sb3I6ICRwcmltYXJ5LWNvbG9yO1xuICBmaWxsOiAkcHJpbWFyeS1jb2xvcjtcbn1cblxuLy8gIGJhY2tncm91bmQgY29sb3Jcbi51LWJnQ29sb3IgeyBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTsgfVxuXG4udS10ZXh0Q29sb3JEYXJrZXIgeyBAZXh0ZW5kICV1LXRleHQtY29sb3ItZGFya2VyOyB9XG5cbi8vIFBvc2l0aW9uc1xuLnUtcmVsYXRpdmUgeyBwb3NpdGlvbjogcmVsYXRpdmU7IH1cbi51LWFic29sdXRlIHsgcG9zaXRpb246IGFic29sdXRlOyB9XG4udS1hYnNvbHV0ZTAgeyBAZXh0ZW5kICV1LWFic29sdXRlMDsgfVxuLnUtZml4ZWQgeyBwb3NpdGlvbjogZml4ZWQgIWltcG9ydGFudDsgfVxuXG4udS1ibG9jayB7IGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQgfVxuLnUtaW5saW5lQmxvY2sgeyBkaXNwbGF5OiBpbmxpbmUtYmxvY2sgfVxuXG4vLyAgQmFja2dyb3VuZFxuLnUtYmFja2dyb3VuZERhcmsge1xuICAvLyBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDAsIDAsIDAsIC4zKSAyOSUsIHJnYmEoMCwgMCwgMCwgLjYpIDgxJSk7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwZDBmMTA7XG4gIGJvdHRvbTogMDtcbiAgbGVmdDogMDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMDtcbiAgdG9wOiAwO1xuICB6LWluZGV4OiAxO1xufVxuXG4udS1ncmFkaWVudCB7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHRyYW5zcGFyZW50IDIwJSwgIzAwMCAxMDAlKTtcbiAgYm90dG9tOiAwO1xuICBoZWlnaHQ6IDkwJTtcbiAgbGVmdDogMDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMDtcbiAgei1pbmRleDogMTtcbn1cblxuLy8gemluZGV4XG4uemluZGV4MSB7IHotaW5kZXg6IDEgfVxuLnppbmRleDIgeyB6LWluZGV4OiAyIH1cbi56aW5kZXgzIHsgei1pbmRleDogMyB9XG4uemluZGV4NCB7IHotaW5kZXg6IDQgfVxuXG4vLyAudS1iYWNrZ3JvdW5kLXdoaXRlIHsgYmFja2dyb3VuZC1jb2xvcjogI2VlZWZlZTsgfVxuLnUtYmFja2dyb3VuZFdoaXRlIHsgYmFja2dyb3VuZC1jb2xvcjogI2ZhZmFmYSB9XG4udS1iYWNrZ3JvdW5kQ29sb3JHcmF5TGlnaHQgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjZjBmMGYwICFpbXBvcnRhbnQ7IH1cblxuLy8gQ2xlYXJcbi51LWNsZWFyOjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGRpc3BsYXk6IHRhYmxlO1xuICBjbGVhcjogYm90aDtcbn1cblxuLy8gZm9udCBzaXplXG4udS1mb250U2l6ZU1pY3JvIHsgZm9udC1zaXplOiAxMXB4IH1cbi51LWZvbnRTaXplU21hbGxlc3QgeyBmb250LXNpemU6IDEycHggfVxuLnUtZm9udFNpemUxMyB7IGZvbnQtc2l6ZTogMTNweCB9XG4udS1mb250U2l6ZVNtYWxsZXIgeyBmb250LXNpemU6IDE0cHggfVxuLnUtZm9udFNpemUxNSB7IGZvbnQtc2l6ZTogMTVweCB9XG4udS1mb250U2l6ZVNtYWxsIHsgZm9udC1zaXplOiAxNnB4IH1cbi51LWZvbnRTaXplQmFzZSB7IGZvbnQtc2l6ZTogMThweCB9XG4udS1mb250U2l6ZTIwIHsgZm9udC1zaXplOiAyMHB4IH1cbi51LWZvbnRTaXplMjEgeyBmb250LXNpemU6IDIxcHggfVxuLnUtZm9udFNpemUyMiB7IGZvbnQtc2l6ZTogMjJweCB9XG4udS1mb250U2l6ZUxhcmdlIHsgZm9udC1zaXplOiAyNHB4IH1cbi51LWZvbnRTaXplMjYgeyBmb250LXNpemU6IDI2cHggfVxuLnUtZm9udFNpemUyOCB7IGZvbnQtc2l6ZTogMjhweCB9XG4udS1mb250U2l6ZUxhcmdlciB7IGZvbnQtc2l6ZTogMzJweCB9XG4udS1mb250U2l6ZTM2IHsgZm9udC1zaXplOiAzNnB4IH1cbi51LWZvbnRTaXplNDAgeyBmb250LXNpemU6IDQwcHggfVxuLnUtZm9udFNpemVMYXJnZXN0IHsgZm9udC1zaXplOiA0NHB4IH1cbi51LWZvbnRTaXplSnVtYm8geyBmb250LXNpemU6IDUwcHggfVxuXG5AbWVkaWEgI3skbWQtYW5kLWRvd259IHtcbiAgLnUtbWQtZm9udFNpemVCYXNlIHsgZm9udC1zaXplOiAxOHB4IH1cbiAgLnUtbWQtZm9udFNpemUyMiB7IGZvbnQtc2l6ZTogMjJweCB9XG4gIC51LW1kLWZvbnRTaXplTGFyZ2VyIHsgZm9udC1zaXplOiAzMnB4IH1cbn1cblxuLy8gQG1lZGlhIChtYXgtd2lkdGg6IDc2N3B4KSB7XG4vLyAgIC51LXhzLWZvbnRTaXplQmFzZSB7Zm9udC1zaXplOiAxOHB4fVxuLy8gICAudS14cy1mb250U2l6ZTEzIHtmb250LXNpemU6IDEzcHh9XG4vLyAgIC51LXhzLWZvbnRTaXplU21hbGxlciB7Zm9udC1zaXplOiAxNHB4fVxuLy8gICAudS14cy1mb250U2l6ZVNtYWxsIHtmb250LXNpemU6IDE2cHh9XG4vLyAgIC51LXhzLWZvbnRTaXplMjIge2ZvbnQtc2l6ZTogMjJweH1cbi8vICAgLnUteHMtZm9udFNpemVMYXJnZSB7Zm9udC1zaXplOiAyNHB4fVxuLy8gICAudS14cy1mb250U2l6ZTQwIHtmb250LXNpemU6IDQwcHh9XG4vLyAgIC51LXhzLWZvbnRTaXplTGFyZ2VyIHtmb250LXNpemU6IDMycHh9XG4vLyAgIC51LXhzLWZvbnRTaXplU21hbGxlc3Qge2ZvbnQtc2l6ZTogMTJweH1cbi8vIH1cblxuLy8gZm9udCB3ZWlnaHRcbi51LWZvbnRXZWlnaHRUaGluIHsgZm9udC13ZWlnaHQ6IDMwMCB9XG4udS1mb250V2VpZ2h0Tm9ybWFsIHsgZm9udC13ZWlnaHQ6IDQwMCB9XG4vLyAudS1mb250V2VpZ2h0TWVkaXVtIHsgZm9udC13ZWlnaHQ6IDUwMCB9XG4udS1mb250V2VpZ2h0U2VtaWJvbGQgeyBmb250LXdlaWdodDogNjAwICFpbXBvcnRhbnQgfVxuLnUtZm9udFdlaWdodEJvbGQgeyBmb250LXdlaWdodDogNzAwIH1cbi51LWZvbnRXZWlnaHRCb2xkZXIgeyBmb250LXdlaWdodDogOTAwIH1cblxuLnUtdGV4dFVwcGVyY2FzZSB7IHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2UgfVxuLnUtdGV4dENhcGl0YWxpemUgeyB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZSB9XG4udS10ZXh0QWxpZ25DZW50ZXIgeyB0ZXh0LWFsaWduOiBjZW50ZXIgfVxuXG4udS1ub1dyYXBXaXRoRWxsaXBzaXMge1xuICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzICFpbXBvcnRhbnQ7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXAgIWltcG9ydGFudDtcbn1cblxuLy8gTWFyZ2luXG4udS1tYXJnaW5BdXRvIHsgbWFyZ2luLWxlZnQ6IGF1dG87IG1hcmdpbi1yaWdodDogYXV0bzsgfVxuLnUtbWFyZ2luVG9wMjAgeyBtYXJnaW4tdG9wOiAyMHB4IH1cbi51LW1hcmdpblRvcDMwIHsgbWFyZ2luLXRvcDogMzBweCB9XG4udS1tYXJnaW5Cb3R0b20xMCB7IG1hcmdpbi1ib3R0b206IDEwcHggfVxuLnUtbWFyZ2luQm90dG9tMTUgeyBtYXJnaW4tYm90dG9tOiAxNXB4IH1cbi51LW1hcmdpbkJvdHRvbTIwIHsgbWFyZ2luLWJvdHRvbTogMjBweCAhaW1wb3J0YW50IH1cbi51LW1hcmdpbkJvdHRvbTMwIHsgbWFyZ2luLWJvdHRvbTogMzBweCB9XG4udS1tYXJnaW5Cb3R0b200MCB7IG1hcmdpbi1ib3R0b206IDQwcHggfVxuXG4vLyBwYWRkaW5nXG4udS1wYWRkaW5nMCB7IHBhZGRpbmc6IDAgIWltcG9ydGFudCB9XG4udS1wYWRkaW5nMjAgeyBwYWRkaW5nOiAyMHB4IH1cbi51LXBhZGRpbmcxNSB7IHBhZGRpbmc6IDE1cHggIWltcG9ydGFudDsgfVxuLnUtcGFkZGluZ0JvdHRvbTIgeyBwYWRkaW5nLWJvdHRvbTogMnB4OyB9XG4udS1wYWRkaW5nQm90dG9tMzAgeyBwYWRkaW5nLWJvdHRvbTogMzBweDsgfVxuLnUtcGFkZGluZ0JvdHRvbTIwIHsgcGFkZGluZy1ib3R0b206IDIwcHggfVxuLnUtcGFkZGluZ1JpZ2h0MTAgeyBwYWRkaW5nLXJpZ2h0OiAxMHB4IH1cbi51LXBhZGRpbmdMZWZ0MTUgeyBwYWRkaW5nLWxlZnQ6IDE1cHggfVxuXG4udS1wYWRkaW5nVG9wMiB7IHBhZGRpbmctdG9wOiAycHggfVxuLnUtcGFkZGluZ1RvcDUgeyBwYWRkaW5nLXRvcDogNXB4OyB9XG4udS1wYWRkaW5nVG9wMTAgeyBwYWRkaW5nLXRvcDogMTBweDsgfVxuLnUtcGFkZGluZ1RvcDE1IHsgcGFkZGluZy10b3A6IDE1cHg7IH1cbi51LXBhZGRpbmdUb3AyMCB7IHBhZGRpbmctdG9wOiAyMHB4OyB9XG4udS1wYWRkaW5nVG9wMzAgeyBwYWRkaW5nLXRvcDogMzBweDsgfVxuXG4udS1wYWRkaW5nQm90dG9tMTUgeyBwYWRkaW5nLWJvdHRvbTogMTVweDsgfVxuXG4udS1wYWRkaW5nUmlnaHQyMCB7IHBhZGRpbmctcmlnaHQ6IDIwcHggfVxuLnUtcGFkZGluZ0xlZnQyMCB7IHBhZGRpbmctbGVmdDogMjBweCB9XG5cbi51LWNvbnRlbnRUaXRsZSB7XG4gIGZvbnQtZmFtaWx5OiAkcHJpbWFyeS1mb250O1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtd2VpZ2h0OiA5MDA7XG4gIGxldHRlci1zcGFjaW5nOiAtLjAyOGVtO1xufVxuXG4vLyBsaW5lLWhlaWdodFxuLnUtbGluZUhlaWdodDEgeyBsaW5lLWhlaWdodDogMTsgfVxuLnUtbGluZUhlaWdodFRpZ2h0IHsgbGluZS1oZWlnaHQ6IDEuMiB9XG5cbi8vIG92ZXJmbG93XG4udS1vdmVyZmxvd0hpZGRlbiB7IG92ZXJmbG93OiBoaWRkZW4gfVxuXG4vLyBmbG9hdFxuLnUtZmxvYXRSaWdodCB7IGZsb2F0OiByaWdodDsgfVxuLnUtZmxvYXRMZWZ0IHsgZmxvYXQ6IGxlZnQ7IH1cblxuLy8gIGZsZXhcbi51LWZsZXggeyBkaXNwbGF5OiBmbGV4OyB9XG4udS1mbGV4Q2VudGVyIHsgYWxpZ24taXRlbXM6IGNlbnRlcjsgZGlzcGxheTogZmxleDsgfVxuLnUtZmxleENvbnRlbnRDZW50ZXIgeyBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlciB9XG4vLyAudS1mbGV4LS0xIHsgZmxleDogMSB9XG4udS1mbGV4MSB7IGZsZXg6IDEgMSBhdXRvOyB9XG4udS1mbGV4MCB7IGZsZXg6IDAgMCBhdXRvOyB9XG4udS1mbGV4V3JhcCB7IGZsZXgtd3JhcDogd3JhcCB9XG5cbi51LWZsZXhDb2x1bW4ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLnUtZmxleEVuZCB7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG59XG5cbi51LWZsZXhDb2x1bW5Ub3Age1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG59XG5cbi8vIEJhY2tncm91bmRcbi51LWJhY2tncm91bmRTaXplQ292ZXIge1xuICBiYWNrZ3JvdW5kLW9yaWdpbjogYm9yZGVyLWJveDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xufVxuXG4vLyBtYXggd2lkaHRcbi51LWNvbnRhaW5lciB7XG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xuICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gIHBhZGRpbmctbGVmdDogMjBweDtcbiAgcGFkZGluZy1yaWdodDogMjBweDtcbn1cblxuLnUtbWF4V2lkdGgxMjAwIHsgbWF4LXdpZHRoOiAxMjAwcHggfVxuLnUtbWF4V2lkdGgxMDAwIHsgbWF4LXdpZHRoOiAxMDAwcHggfVxuLnUtbWF4V2lkdGg3NDAgeyBtYXgtd2lkdGg6IDc0MHB4IH1cbi51LW1heFdpZHRoMTA0MCB7IG1heC13aWR0aDogMTA0MHB4IH1cbi51LXNpemVGdWxsV2lkdGggeyB3aWR0aDogMTAwJSB9XG4udS1zaXplRnVsbEhlaWdodCB7IGhlaWdodDogMTAwJSB9XG5cbi8vIGJvcmRlclxuLnUtYm9yZGVyTGlnaHRlciB7IGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjE1KTsgfVxuLnUtcm91bmQgeyBib3JkZXItcmFkaXVzOiA1MCUgfVxuLnUtYm9yZGVyUmFkaXVzMiB7IGJvcmRlci1yYWRpdXM6IDJweCB9XG5cbi51LWJveFNoYWRvd0JvdHRvbSB7XG4gIGJveC1zaGFkb3c6IDAgNHB4IDJweCAtMnB4IHJnYmEoMCwgMCwgMCwgLjA1KTtcbn1cblxuLy8gSGVpbmdodFxuLnUtaGVpZ2h0NTQwIHsgaGVpZ2h0OiA1NDBweCB9XG4udS1oZWlnaHQyODAgeyBoZWlnaHQ6IDI4MHB4IH1cbi51LWhlaWdodDI2MCB7IGhlaWdodDogMjYwcHggfVxuLnUtaGVpZ2h0MTAwIHsgaGVpZ2h0OiAxMDBweCB9XG4udS1ib3JkZXJCbGFja0xpZ2h0ZXN0IHsgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAuMSkgfVxuXG4vLyBoaWRlIGdsb2JhbFxuLnUtaGlkZSB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudCB9XG5cbi8vIGNhcmRcbi51LWNhcmQge1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIC4wOSk7XG4gIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgLy8gYm94LXNoYWRvdzogMCAxcHggNHB4IHJnYmEoMCwgMCwgMCwgLjA0KTtcbiAgYm94LXNoYWRvdzogMCAxcHggN3B4IHJnYmEoMCwgMCwgMCwgLjA1KTtcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgcGFkZGluZzogMTBweCAyMHB4IDE1cHg7XG59XG5cbi8vIHRpdGxlIExpbmVcbi50aXRsZS1saW5lIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHdpZHRoOiAxMDAlO1xuXG4gICY6OmJlZm9yZSB7XG4gICAgY29udGVudDogJyc7XG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAuMyk7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBsZWZ0OiAwO1xuICAgIGJvdHRvbTogNTAlO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMXB4O1xuICAgIHotaW5kZXg6IDA7XG4gIH1cbn1cblxuLy8gT2JibGlxdWVcbi51LW9ibGlxdWUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb21wb3NpdGUtY29sb3IpO1xuICBjb2xvcjogI2ZmZjtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGxpbmUtaGVpZ2h0OiAxO1xuICBwYWRkaW5nOiA1cHggMTNweDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgdHJhbnNmb3JtOiBza2V3WCgtMTVkZWcpO1xufVxuXG4ubm8tYXZhdGFyIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi9pbWFnZXMvYXZhdGFyLnBuZycpICFpbXBvcnRhbnRcbn1cblxuQG1lZGlhICN7JG1kLWFuZC1kb3dufSB7XG4gIC51LWhpZGUtYmVmb3JlLW1kIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50IH1cbiAgLnUtbWQtaGVpZ2h0QXV0byB7IGhlaWdodDogYXV0bzsgfVxuICAudS1tZC1oZWlnaHQxNzAgeyBoZWlnaHQ6IDE3MHB4IH1cbiAgLnUtbWQtcmVsYXRpdmUgeyBwb3NpdGlvbjogcmVsYXRpdmUgfVxufVxuXG5AbWVkaWEgI3skbGctYW5kLWRvd259IHsgLnUtaGlkZS1iZWZvcmUtbGcgeyBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQgfSB9XG5cbi8vIGhpZGUgYWZ0ZXJcbkBtZWRpYSAjeyRtZC1hbmQtdXB9IHsgLnUtaGlkZS1hZnRlci1tZCB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudCB9IH1cblxuQG1lZGlhICN7JGxnLWFuZC11cH0geyAudS1oaWRlLWFmdGVyLWxnIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50IH0gfVxuIiwiLmJ1dHRvbiB7XG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMCk7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjE1KTtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNDQpO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgZm9udC1mYW1pbHk6ICRwcmltYXJ5LWZvbnQ7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXdlaWdodDogNDAwO1xuICBoZWlnaHQ6IDM3cHg7XG4gIGxldHRlci1zcGFjaW5nOiAwO1xuICBsaW5lLWhlaWdodDogMzVweDtcbiAgcGFkZGluZzogMCAxNnB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICB0ZXh0LXJlbmRlcmluZzogb3B0aW1pemVMZWdpYmlsaXR5O1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcblxuICAmLS1jaHJvbWVsZXNzIHtcbiAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgIGJvcmRlci13aWR0aDogMDtcbiAgICBib3gtc2hhZG93OiBub25lO1xuICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC40NCk7XG4gICAgaGVpZ2h0OiBhdXRvO1xuICAgIGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xuICAgIHBhZGRpbmc6IDA7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG4gICAgd2hpdGUtc3BhY2U6IG5vcm1hbDtcblxuICAgICY6YWN0aXZlLFxuICAgICY6aG92ZXIsXG4gICAgJjpmb2N1cyB7XG4gICAgICBib3JkZXItd2lkdGg6IDA7XG4gICAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNik7XG4gICAgfVxuICB9XG5cbiAgJi0tbGFyZ2Uge1xuICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgICBoZWlnaHQ6IDQ0cHg7XG4gICAgbGluZS1oZWlnaHQ6IDQycHg7XG4gICAgcGFkZGluZzogMCAxOHB4O1xuICB9XG5cbiAgJi0tZGFyayB7XG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAuODQpO1xuICAgIGJvcmRlci1jb2xvcjogcmdiYSgwLCAwLCAwLCAuODQpO1xuICAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIC45Nyk7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQ6ICRwcmltYXJ5LWNvbG9yO1xuICAgICAgYm9yZGVyLWNvbG9yOiAkcHJpbWFyeS1jb2xvcjtcbiAgICB9XG4gIH1cbn1cblxuLy8gUHJpbWFyeVxuLmJ1dHRvbi0tcHJpbWFyeSB7XG4gIGJvcmRlci1jb2xvcjogJHByaW1hcnktY29sb3I7XG4gIGNvbG9yOiAkcHJpbWFyeS1jb2xvcjtcbn1cblxuLmJ1dHRvbi0tbGFyZ2UuYnV0dG9uLS1jaHJvbWVsZXNzLFxuLmJ1dHRvbi0tbGFyZ2UuYnV0dG9uLS1saW5rIHtcbiAgcGFkZGluZzogMDtcbn1cblxuLmJ1dHRvblNldCB7XG4gID4gLmJ1dHRvbiB7XG4gICAgbWFyZ2luLXJpZ2h0OiA4cHg7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgfVxuXG4gID4gLmJ1dHRvbjpsYXN0LWNoaWxkIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDA7XG4gIH1cblxuICAuYnV0dG9uLS1jaHJvbWVsZXNzIHtcbiAgICBoZWlnaHQ6IDM3cHg7XG4gICAgbGluZS1oZWlnaHQ6IDM1cHg7XG4gIH1cblxuICAuYnV0dG9uLS1sYXJnZS5idXR0b24tLWNocm9tZWxlc3MsXG4gIC5idXR0b24tLWxhcmdlLmJ1dHRvbi0tbGluayB7XG4gICAgaGVpZ2h0OiA0NHB4O1xuICAgIGxpbmUtaGVpZ2h0OiA0MnB4O1xuICB9XG5cbiAgJiA+IC5idXR0b24tLWNocm9tZWxlc3M6bm90KC5idXR0b24tLWNpcmNsZSkge1xuICAgIG1hcmdpbi1yaWdodDogMDtcbiAgICBwYWRkaW5nLXJpZ2h0OiA4cHg7XG4gIH1cblxuICAmID4gLmJ1dHRvbi0tY2hyb21lbGVzczpsYXN0LWNoaWxkIHtcbiAgICBwYWRkaW5nLXJpZ2h0OiAwO1xuICB9XG5cbiAgJiA+IC5idXR0b24tLWNocm9tZWxlc3MgKyAuYnV0dG9uLS1jaHJvbWVsZXNzOm5vdCguYnV0dG9uLS1jaXJjbGUpIHtcbiAgICBtYXJnaW4tbGVmdDogMDtcbiAgICBwYWRkaW5nLWxlZnQ6IDhweDtcbiAgfVxufVxuXG4uYnV0dG9uLS1jaXJjbGUge1xuICBiYWNrZ3JvdW5kLWltYWdlOiBub25lICFpbXBvcnRhbnQ7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgY29sb3I6ICNmZmY7XG4gIGhlaWdodDogNDBweDtcbiAgbGluZS1oZWlnaHQ6IDM4cHg7XG4gIHBhZGRpbmc6IDA7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgd2lkdGg6IDQwcHg7XG59XG5cbi8vIEJ0biBmb3IgdGFnIGNsb3VkIG9yIGNhdGVnb3J5XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLnRhZy1idXR0b24ge1xuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIC4wNSk7XG4gIGJvcmRlcjogbm9uZTtcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjY4KTtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbWFyZ2luOiAwIDhweCA4cHggMDtcblxuICAmOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIC4xKTtcbiAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNjgpO1xuICB9XG59XG5cbi8vIGJ1dHRvbiBkYXJrIGxpbmVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4uYnV0dG9uLS1kYXJrLWxpbmUge1xuICBib3JkZXI6IDFweCBzb2xpZCAjMDAwO1xuICBjb2xvcjogIzAwMDtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIG1hcmdpbjogNTBweCBhdXRvIDA7XG4gIG1heC13aWR0aDogMzAwcHg7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIHRyYW5zaXRpb246IGNvbG9yIC4zcyBlYXNlLCBib3gtc2hhZG93IC4zcyBjdWJpYy1iZXppZXIoLjQ1NSwgLjAzLCAuNTE1LCAuOTU1KTtcblxuICAmOmhvdmVyIHtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBib3gtc2hhZG93OiBpbnNldCAwIC01MHB4IDhweCAtNHB4ICMwMDA7XG4gIH1cbn1cbiIsIi8vIHN0eWxlbGludC1kaXNhYmxlXG5AZm9udC1mYWNlIHtcbiAgZm9udC1mYW1pbHk6ICdtYXBhY2hlJztcbiAgc3JjOiAgdXJsKCcuLi9mb250cy9tYXBhY2hlLmVvdD8yNTc2NGonKTtcbiAgc3JjOiAgdXJsKCcuLi9mb250cy9tYXBhY2hlLmVvdD8yNTc2NGojaWVmaXgnKSBmb3JtYXQoJ2VtYmVkZGVkLW9wZW50eXBlJyksXG4gICAgdXJsKCcuLi9mb250cy9tYXBhY2hlLnR0Zj8yNTc2NGonKSBmb3JtYXQoJ3RydWV0eXBlJyksXG4gICAgdXJsKCcuLi9mb250cy9tYXBhY2hlLndvZmY/MjU3NjRqJykgZm9ybWF0KCd3b2ZmJyksXG4gICAgdXJsKCcuLi9mb250cy9tYXBhY2hlLnN2Zz8yNTc2NGojbWFwYWNoZScpIGZvcm1hdCgnc3ZnJyk7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cblxuW2NsYXNzXj1cImktXCJdOjpiZWZvcmUsIFtjbGFzcyo9XCIgaS1cIl06OmJlZm9yZSB7XG4gIEBleHRlbmQgJWZvbnRzLWljb25zO1xufVxuXG4uaS10YWc6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGU5MTFcIjtcbn1cbi5pLWRpc2NvcmQ6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGU5MGFcIjtcbn1cbi5pLWFycm93LXJvdW5kLW5leHQ6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGU5MGNcIjtcbn1cbi5pLWFycm93LXJvdW5kLXByZXY6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGU5MGRcIjtcbn1cbi5pLWFycm93LXJvdW5kLXVwOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxlOTBlXCI7XG59XG4uaS1hcnJvdy1yb3VuZC1kb3duOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxlOTBmXCI7XG59XG4uaS1waG90bzpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZTkwYlwiO1xufVxuLmktc2VuZDpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZTkwOVwiO1xufVxuLmktYXVkaW86YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGU5MDFcIjtcbn1cbi5pLXJvY2tldDpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZTkwMlwiO1xuICBjb2xvcjogIzk5OTtcbn1cbi5pLWNvbW1lbnRzLWxpbmU6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGU5MDBcIjtcbn1cbi5pLWdsb2JlOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxlOTA2XCI7XG59XG4uaS1zdGFyOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxlOTA3XCI7XG59XG4uaS1saW5rOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxlOTA4XCI7XG59XG4uaS1zdGFyLWxpbmU6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGU5MDNcIjtcbn1cbi5pLW1vcmU6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGU5MDRcIjtcbn1cbi5pLXNlYXJjaDpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZTkwNVwiO1xufVxuLmktY2hhdDpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZTkxMFwiO1xufVxuLmktYXJyb3ctbGVmdDpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZTMxNFwiO1xufVxuLmktYXJyb3ctcmlnaHQ6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGUzMTVcIjtcbn1cbi5pLXBsYXk6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGUwMzdcIjtcbn1cbi5pLWxvY2F0aW9uOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxlOGI0XCI7XG59XG4uaS1jaGVjay1jaXJjbGU6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGU4NmNcIjtcbn1cbi5pLWNsb3NlOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxlNWNkXCI7XG59XG4uaS1mYXZvcml0ZTpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZTg3ZFwiO1xufVxuLmktd2FybmluZzpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZTAwMlwiO1xufVxuLmktcnNzOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxlMGU1XCI7XG59XG4uaS1zaGFyZTpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZTgwZFwiO1xufVxuLmktZW1haWw6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYwZTBcIjtcbn1cbi5pLWdvb2dsZTpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjFhMFwiO1xufVxuLmktdGVsZWdyYW06YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYyYzZcIjtcbn1cbi5pLXJlZGRpdDpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjI4MVwiO1xufVxuLmktdHdpdHRlcjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjA5OVwiO1xufVxuLmktZ2l0aHViOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxmMDliXCI7XG59XG4uaS1saW5rZWRpbjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjBlMVwiO1xufVxuLmkteW91dHViZTpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjE2YVwiO1xufVxuLmktc3RhY2stb3ZlcmZsb3c6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxNmNcIjtcbn1cbi5pLWluc3RhZ3JhbTpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjE2ZFwiO1xufVxuLmktZmxpY2tyOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxmMTZlXCI7XG59XG4uaS1kcmliYmJsZTpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjE3ZFwiO1xufVxuLmktYmVoYW5jZTpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjFiNFwiO1xufVxuLmktc3BvdGlmeTpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjFiY1wiO1xufVxuLmktY29kZXBlbjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjFjYlwiO1xufVxuLmktZmFjZWJvb2s6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYyMzBcIjtcbn1cbi5pLXBpbnRlcmVzdDpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjIzMVwiO1xufVxuLmktd2hhdHNhcHA6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYyMzJcIjtcbn1cbi5pLXNuYXBjaGF0OmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxmMmFjXCI7XG59XG4iLCIvLyBhbmltYXRlZCBHbG9iYWxcbi5hbmltYXRlZCB7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMXM7XG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XG5cbiAgJi5pbmZpbml0ZSB7XG4gICAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG4gIH1cbn1cblxuLy8gYW5pbWF0ZWQgQWxsXG4uYm91bmNlSW4geyBhbmltYXRpb24tbmFtZTogYm91bmNlSW47IH1cbi5ib3VuY2VJbkRvd24geyBhbmltYXRpb24tbmFtZTogYm91bmNlSW5Eb3duOyB9XG4ucHVsc2UgeyBhbmltYXRpb24tbmFtZTogcHVsc2U7IH1cbi5zbGlkZUluVXAgeyBhbmltYXRpb24tbmFtZTogc2xpZGVJblVwIH1cbi5zbGlkZU91dERvd24geyBhbmltYXRpb24tbmFtZTogc2xpZGVPdXREb3duIH1cblxuLy8gYWxsIGtleWZyYW1lcyBBbmltYXRlc1xuLy8gYm91bmNlSW5cbkBrZXlmcmFtZXMgYm91bmNlSW4ge1xuICAwJSxcbiAgMjAlLFxuICA0MCUsXG4gIDYwJSxcbiAgODAlLFxuICAxMDAlIHsgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKC4yMTUsIC42MSwgLjM1NSwgMSk7IH1cbiAgMCUgeyBvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHNjYWxlM2QoLjMsIC4zLCAuMyk7IH1cbiAgMjAlIHsgdHJhbnNmb3JtOiBzY2FsZTNkKDEuMSwgMS4xLCAxLjEpOyB9XG4gIDQwJSB7IHRyYW5zZm9ybTogc2NhbGUzZCguOSwgLjksIC45KTsgfVxuICA2MCUgeyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHNjYWxlM2QoMS4wMywgMS4wMywgMS4wMyk7IH1cbiAgODAlIHsgdHJhbnNmb3JtOiBzY2FsZTNkKC45NywgLjk3LCAuOTcpOyB9XG4gIDEwMCUgeyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHNjYWxlM2QoMSwgMSwgMSk7IH1cbn1cblxuLy8gYm91bmNlSW5Eb3duXG5Aa2V5ZnJhbWVzIGJvdW5jZUluRG93biB7XG4gIDAlLFxuICA2MCUsXG4gIDc1JSxcbiAgOTAlLFxuICAxMDAlIHsgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDIxNSwgNjEwLCAzNTUsIDEpOyB9XG4gIDAlIHsgb3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAtMzAwMHB4LCAwKTsgfVxuICA2MCUgeyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDI1cHgsIDApOyB9XG4gIDc1JSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgLTEwcHgsIDApOyB9XG4gIDkwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgNXB4LCAwKTsgfVxuICAxMDAlIHsgdHJhbnNmb3JtOiBub25lOyB9XG59XG5cbkBrZXlmcmFtZXMgcHVsc2Uge1xuICBmcm9tIHsgdHJhbnNmb3JtOiBzY2FsZTNkKDEsIDEsIDEpOyB9XG4gIDUwJSB7IHRyYW5zZm9ybTogc2NhbGUzZCgxLjIsIDEuMiwgMS4yKTsgfVxuICB0byB7IHRyYW5zZm9ybTogc2NhbGUzZCgxLCAxLCAxKTsgfVxufVxuXG5Aa2V5ZnJhbWVzIHNjcm9sbCB7XG4gIDAlIHsgb3BhY2l0eTogMDsgfVxuICAxMCUgeyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCkgfVxuICAxMDAlIHsgb3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDEwcHgpOyB9XG59XG5cbkBrZXlmcmFtZXMgb3BhY2l0eSB7XG4gIDAlIHsgb3BhY2l0eTogMDsgfVxuICA1MCUgeyBvcGFjaXR5OiAwOyB9XG4gIDEwMCUgeyBvcGFjaXR5OiAxOyB9XG59XG5cbi8vICBzcGluIGZvciBwYWdpbmF0aW9uXG5Aa2V5ZnJhbWVzIHNwaW4ge1xuICBmcm9tIHsgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7IH1cbiAgdG8geyB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpOyB9XG59XG5cbkBrZXlmcmFtZXMgdG9vbHRpcCB7XG4gIDAlIHsgb3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgNnB4KTsgfVxuICAxMDAlIHsgb3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgMCk7IH1cbn1cblxuQGtleWZyYW1lcyBsb2FkaW5nLWJhciB7XG4gIDAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0xMDAlKSB9XG4gIDQwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKSB9XG4gIDYwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKSB9XG4gIDEwMCUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTAwJSkgfVxufVxuXG4vLyBBcnJvdyBtb3ZlIGxlZnRcbkBrZXlmcmFtZXMgYXJyb3ctbW92ZS1yaWdodCB7XG4gIDAlIHsgb3BhY2l0eTogMCB9XG4gIDEwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAwJSk7IG9wYWNpdHk6IDAgfVxuICAxMDAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDApOyBvcGFjaXR5OiAxIH1cbn1cblxuQGtleWZyYW1lcyBhcnJvdy1tb3ZlLWxlZnQge1xuICAwJSB7IG9wYWNpdHk6IDAgfVxuICAxMCUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTAwJSk7IG9wYWNpdHk6IDAgfVxuICAxMDAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDApOyBvcGFjaXR5OiAxIH1cbn1cblxuQGtleWZyYW1lcyBzbGlkZUluVXAge1xuICBmcm9tIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDEwMCUsIDApO1xuICAgIHZpc2liaWxpdHk6IHZpc2libGU7XG4gIH1cblxuICB0byB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHNsaWRlT3V0RG93biB7XG4gIGZyb20ge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMCwgMCk7XG4gIH1cblxuICB0byB7XG4gICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMjAlLCAwKTtcbiAgfVxufVxuIiwiLy8gSGVhZGVyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4uaGVhZGVyLWxvZ28sXG4ubWVudS0tdG9nZ2xlLFxuLnNlYXJjaC10b2dnbGUge1xuICB6LWluZGV4OiAxNTtcbn1cblxuLmhlYWRlciB7XG4gIGJveC1zaGFkb3c6IDAgMXB4IDE2cHggMCByZ2JhKDAsIDAsIDAsIDAuMyk7XG4gIHBhZGRpbmc6IDAgMTZweDtcbiAgcG9zaXRpb246IHN0aWNreTtcbiAgdG9wOiAwO1xuICB0cmFuc2l0aW9uOiBhbGwgMC40cyBlYXNlLWluLW91dDtcbiAgei1pbmRleDogMTA7XG5cbiAgJi13cmFwIHsgaGVpZ2h0OiAkaGVhZGVyLWhlaWdodDsgfVxuXG4gICYtbG9nbyB7XG4gICAgY29sb3I6ICNmZmYgIWltcG9ydGFudDtcbiAgICBoZWlnaHQ6IDMwcHg7XG5cbiAgICBpbWcgeyBtYXgtaGVpZ2h0OiAxMDAlOyB9XG4gIH1cbn1cblxuLy8gbm90IGhhdmUgbG9nb1xuLm5vdC1sb2dvIC5oZWFkZXItbG9nbyB7IGhlaWdodDogYXV0byAhaW1wb3J0YW50IH1cblxuLy8gSGVhZGVyIGxpbmUgc2VwYXJhdGVcbi5oZWFkZXItbGluZSB7XG4gIGhlaWdodDogJGhlYWRlci1oZWlnaHQ7XG4gIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgLjMpO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIG1hcmdpbi1yaWdodDogMTBweDtcbn1cblxuLy8gSGVhZGVyIEZvbGxvdyBNb3JlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLmZvbGxvdy1tb3JlIHtcbiAgdHJhbnNpdGlvbjogd2lkdGggLjRzIGVhc2U7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHdpZHRoOiAwO1xufVxuXG5ib2R5LmlzLXNob3dGb2xsb3dNb3JlIHtcbiAgLmZvbGxvdy1tb3JlIHsgd2lkdGg6IGF1dG8gfVxuICAuZm9sbG93LXRvZ2dsZSB7IGNvbG9yOiB2YXIoLS1oZWFkZXItY29sb3ItaG92ZXIpIH1cbiAgLmZvbGxvdy10b2dnbGU6OmJlZm9yZSB7IGNvbnRlbnQ6IFwiXFxlNWNkXCIgfVxufVxuXG4vLyBIZWFkZXIgbWVudVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLm5hdiB7XG4gIHBhZGRpbmctdG9wOiA4cHg7XG4gIHBhZGRpbmctYm90dG9tOiA4cHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICB1bCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBtYXJnaW4tcmlnaHQ6IDIwcHg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICB9XG59XG5cbi5oZWFkZXItbGVmdCBhLFxuLm5hdiB1bCBsaSBhIHtcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xuICBjb2xvcjogdmFyKC0taGVhZGVyLWNvbG9yKTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBmb250LXdlaWdodDogNjAwO1xuICBsaW5lLWhlaWdodDogMzBweDtcbiAgcGFkZGluZzogMCA4cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcblxuICAmLmFjdGl2ZSxcbiAgJjpob3ZlciB7XG4gICAgY29sb3I6IHZhcigtLWhlYWRlci1jb2xvci1ob3Zlcik7XG4gIH1cbn1cblxuLy8gYnV0dG9uLW5hdlxuLm1lbnUtLXRvZ2dsZSB7XG4gIGhlaWdodDogNDhweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjRzO1xuICB3aWR0aDogNDhweDtcblxuICBzcGFuIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1oZWFkZXItY29sb3IpO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGhlaWdodDogMnB4O1xuICAgIGxlZnQ6IDE0cHg7XG4gICAgbWFyZ2luLXRvcDogLTFweDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiA1MCU7XG4gICAgdHJhbnNpdGlvbjogLjRzO1xuICAgIHdpZHRoOiAyMHB4O1xuXG4gICAgJjpmaXJzdC1jaGlsZCB7IHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIC02cHgpOyB9XG4gICAgJjpsYXN0LWNoaWxkIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgNnB4KTsgfVxuICB9XG59XG5cbi8vIEhlYWRlciBtZW51XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5AbWVkaWEgI3skbWQtYW5kLWRvd259IHtcbiAgLmhlYWRlci1sZWZ0IHsgZmxleC1ncm93OiAxICFpbXBvcnRhbnQ7IH1cbiAgLmhlYWRlci1sb2dvIHNwYW4geyBmb250LXNpemU6IDI0cHggfVxuXG4gIC8vIHNob3cgbWVudSBtb2JpbGVcbiAgYm9keS5pcy1zaG93TmF2TW9iIHtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gICAgLnNpZGVOYXYgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCk7IH1cblxuICAgIC5tZW51LS10b2dnbGUge1xuICAgICAgYm9yZGVyOiAwO1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xuXG4gICAgICBzcGFuOmZpcnN0LWNoaWxkIHsgdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpIHRyYW5zbGF0ZSgwLCAwKTsgfVxuICAgICAgc3BhbjpudGgtY2hpbGQoMikgeyB0cmFuc2Zvcm06IHNjYWxlWCgwKTsgfVxuICAgICAgc3BhbjpsYXN0LWNoaWxkIHsgdHJhbnNmb3JtOiByb3RhdGUoLTQ1ZGVnKSB0cmFuc2xhdGUoMCwgMCk7IH1cbiAgICB9XG5cbiAgICAuaGVhZGVyIC5idXR0b24tc2VhcmNoLS10b2dnbGUgeyBkaXNwbGF5OiBub25lOyB9XG4gICAgLm1haW4sIC5mb290ZXIgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTI1JSkgIWltcG9ydGFudDsgfVxuICB9XG59XG4iLCIvLyBGb290ZXJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi5mb290ZXIge1xuICBjb2xvcjogIzg4ODtcblxuICBhIHtcbiAgICBjb2xvcjogdmFyKC0tZm9vdGVyLWNvbG9yLWxpbmspO1xuICAgICY6aG92ZXIgeyBjb2xvcjogI2ZmZiB9XG4gIH1cblxuICAmLWxpbmtzIHtcbiAgICBwYWRkaW5nOiAzZW0gMCAyLjVlbTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTMxMzEzO1xuICB9XG5cbiAgLmZvbGxvdyA+IGEge1xuICAgIGJhY2tncm91bmQ6ICMzMzM7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIGNvbG9yOiBpbmhlcml0O1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBoZWlnaHQ6IDQwcHg7XG4gICAgbGluZS1oZWlnaHQ6IDQwcHg7XG4gICAgbWFyZ2luOiAwIDVweCA4cHg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHdpZHRoOiA0MHB4O1xuXG4gICAgJjpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCAwIDJweCAjMzMzO1xuICAgIH1cbiAgfVxuXG4gICYtY29weSB7XG4gICAgcGFkZGluZzogM2VtIDA7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcbiAgfVxufVxuXG4uZm9vdGVyLW1lbnUge1xuICBsaSB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIGxpbmUtaGVpZ2h0OiAyNHB4O1xuICAgIG1hcmdpbjogMCA4cHg7XG5cbiAgICAvKiBzdHlsZWxpbnQtZGlzYWJsZS1uZXh0LWxpbmUgKi9cbiAgICBhIHsgY29sb3I6ICM4ODggfVxuICB9XG59XG4iLCIvLyBIb21lIFBhZ2UgU3R5bGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLmNvdmVyIHtcbiAgcGFkZGluZzogNHB4O1xuXG4gICYtc3Rvcnkge1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgaGVpZ2h0OiAyNTBweDtcbiAgICB3aWR0aDogMTAwJTtcblxuICAgICY6aG92ZXIgLmNvdmVyLWhlYWRlciB7IGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHRyYW5zcGFyZW50IDAsIHJnYmEoMCwgMCwgMCwgMC42KSA1MCUsIHJnYmEoMCwgMCwgMCwgMC45KSAxMDAlKSB9XG5cbiAgICAmLmZpcnRzIHsgaGVpZ2h0OiA4MHZoIH1cbiAgfVxuXG4gICYtaW1nLFxuICAmLWxpbmsge1xuICAgIGJvdHRvbTogNHB4O1xuICAgIGxlZnQ6IDRweDtcbiAgICByaWdodDogNHB4O1xuICAgIHRvcDogNHB4O1xuICB9XG5cbiAgLy8gc3R5bGVsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICYtaGVhZGVyIHtcbiAgICBib3R0b206IDRweDtcbiAgICBsZWZ0OiA0cHg7XG4gICAgcmlnaHQ6IDRweDtcbiAgICBwYWRkaW5nOiA1MHB4IDMuODQ2MTUzODQ2JSAyMHB4O1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHJnYmEoMCwgMCwgMCwgMCkgMCwgcmdiYSgwLCAwLCAwLCAwLjcpIDUwJSwgcmdiYSgwLCAwLCAwLCAuOSkgMTAwJSk7XG4gIH1cbn1cblxuLy8gSG9tZSBQYWdlIFBlcnNvbmFsIENvdmVyIHBhZ2Vcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4uaG0tY292ZXIge1xuICBwYWRkaW5nOiAzMHB4IDA7XG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xuXG4gICYtdGl0bGUge1xuICAgIGZvbnQtc2l6ZTogMi41cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XG4gICAgbGluZS1oZWlnaHQ6IDE7XG4gIH1cblxuICAmLWRlcyB7XG4gICAgbWF4LXdpZHRoOiA2MDBweDtcbiAgICBmb250LXNpemU6IDEuMjVyZW07XG4gIH1cbn1cblxuLmhtLXN1YnNjcmliZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBib3JkZXItcmFkaXVzOiAzcHg7XG4gIGJveC1zaGFkb3c6IGluc2V0IDAgMCAwIDJweCBoc2xhKDAsIDAlLCAxMDAlLCAuNSk7XG4gIGNvbG9yOiAjZmZmO1xuICBkaXNwbGF5OiBibG9jaztcbiAgZm9udC1zaXplOiAyMHB4O1xuICBmb250LXdlaWdodDogNDAwO1xuICBsaW5lLWhlaWdodDogMS4yO1xuICBtYXJnaW4tdG9wOiA1MHB4O1xuICBtYXgtd2lkdGg6IDMwMHB4O1xuICBwYWRkaW5nOiAxNXB4IDEwcHg7XG4gIHRyYW5zaXRpb246IGFsbCAuM3M7XG4gIHdpZHRoOiAxMDAlO1xuXG4gICY6aG92ZXIge1xuICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCAwIDJweCAjZmZmO1xuICB9XG59XG5cbi5obS1kb3duIHtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAxLjJzICFpbXBvcnRhbnQ7XG4gIGJvdHRvbTogNjBweDtcbiAgY29sb3I6IGhzbGEoMCwgMCUsIDEwMCUsIC41KTtcbiAgbGVmdDogMDtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IDA7XG4gIHdpZHRoOiA3MHB4O1xuICB6LWluZGV4OiAxMDA7XG5cbiAgc3ZnIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBmaWxsOiBjdXJyZW50Y29sb3I7XG4gICAgaGVpZ2h0OiBhdXRvO1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG59XG5cbi8vIE1lZGlhIFF1ZXJ5XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQG1lZGlhICN7JG1kLWFuZC11cH0ge1xuICAuY292ZXIge1xuICAgIGhlaWdodDogNzB2aDtcblxuICAgICYtc3Rvcnkge1xuICAgICAgaGVpZ2h0OiA1MCU7XG4gICAgICB3aWR0aDogMzMuMzMzMzMlO1xuXG4gICAgICAmLmZpcnRzIHtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICB3aWR0aDogNjYuNjY2NjYlO1xuXG4gICAgICAgIC5jb3Zlci10aXRsZSB7IGZvbnQtc2l6ZTogMi41cmVtIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBIb21lIHBhZ2VcbiAgLmhtLWNvdmVyLXRpdGxlIHsgZm9udC1zaXplOiAzLjVyZW0gfVxufVxuIiwiLy8gcG9zdCBjb250ZW50XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4ucG9zdCB7XG4gIC8vIHRpdGxlXG4gICYtdGl0bGUge1xuICAgIGNvbG9yOiAjMDAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjI7XG4gICAgZm9udC13ZWlnaHQ6IDkwMDtcbiAgICBtYXgtd2lkdGg6IDEwMDBweDtcbiAgfVxuXG4gICYtZXhjZXJwdCB7XG4gICAgY29sb3I6ICM1NTU7XG4gICAgZm9udC1mYW1pbHk6ICRzZWN1bmRhcnktZm9udDtcbiAgICBmb250LXdlaWdodDogMzAwO1xuICAgIGxldHRlci1zcGFjaW5nOiAtLjAxMmVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjY7XG4gIH1cblxuICAvLyBhdXRob3JcbiAgJi1hdXRob3Itc29jaWFsIHtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgIG1hcmdpbi1sZWZ0OiAycHg7XG4gICAgcGFkZGluZzogMCAzcHg7XG4gIH1cblxuICAmLWltYWdlIHsgbWFyZ2luLXRvcDogMzBweCB9XG59XG5cbi8vIEF2YXRhclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi5hdmF0YXItaW1hZ2Uge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG5cbiAgQGV4dGVuZCAudS1yb3VuZDtcblxuICAmLS1zbWFsbGVyIHtcbiAgICB3aWR0aDogNTBweDtcbiAgICBoZWlnaHQ6IDUwcHg7XG4gIH1cbn1cblxuLy8gcG9zdCBjb250ZW50IGJvZHlcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4ucG9zdC1ib2R5IHtcbiAgYTpub3QoLmJ1dHRvbik6bm90KC5idXR0b24tLWNpcmNsZSk6bm90KC5wcmV2LW5leHQtbGluaykge1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgdHJhbnNpdGlvbjogYWxsIDI1MG1zO1xuICAgIGJveC1zaGFkb3c6IGluc2V0IDAgLTNweCAwIHZhcigtLXBvc3QtY29sb3ItbGluayk7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgLTFyZW0gMCB2YXIoLS1wb3N0LWNvbG9yLWxpbmspXG4gICAgfVxuICB9XG5cbiAgaW1nIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gIH1cblxuICBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcbiAgICBtYXJnaW4tdG9wOiAzMHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGNvbG9yOiAjMDAwO1xuICAgIGxldHRlci1zcGFjaW5nOiAtLjAyZW07XG4gICAgbGluZS1oZWlnaHQ6IDEuMjtcbiAgfVxuXG4gIGgyIHsgbWFyZ2luLXRvcDogMzVweCB9XG5cbiAgcCB7XG4gICAgZm9udC1mYW1pbHk6ICRzZWN1bmRhcnktZm9udDtcbiAgICBmb250LXNpemU6IDEuMTI1cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgbGV0dGVyLXNwYWNpbmc6IC0uMDAzZW07XG4gICAgbGluZS1oZWlnaHQ6IDEuNztcbiAgICBtYXJnaW4tdG9wOiAyNXB4O1xuICB9XG5cbiAgdWwsXG4gIG9sIHtcbiAgICBjb3VudGVyLXJlc2V0OiBwb3N0O1xuICAgIGZvbnQtZmFtaWx5OiAkc2VjdW5kYXJ5LWZvbnQ7XG4gICAgZm9udC1zaXplOiAxLjEyNXJlbTtcbiAgICBtYXJnaW4tdG9wOiAyMHB4O1xuXG4gICAgbGkge1xuICAgICAgbGV0dGVyLXNwYWNpbmc6IC0uMDAzZW07XG4gICAgICBtYXJnaW4tYm90dG9tOiAxNHB4O1xuICAgICAgbWFyZ2luLWxlZnQ6IDMwcHg7XG5cbiAgICAgICY6OmJlZm9yZSB7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgbWFyZ2luLWxlZnQ6IC03OHB4O1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgICAgICB3aWR0aDogNzhweDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1bCBsaTo6YmVmb3JlIHtcbiAgICBjb250ZW50OiAnXFwyMDIyJztcbiAgICBmb250LXNpemU6IDE2LjhweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAxNXB4O1xuICAgIHBhZGRpbmctdG9wOiAzcHg7XG4gIH1cblxuICBvbCBsaTo6YmVmb3JlIHtcbiAgICBjb250ZW50OiBjb3VudGVyKHBvc3QpIFwiLlwiO1xuICAgIGNvdW50ZXItaW5jcmVtZW50OiBwb3N0O1xuICAgIHBhZGRpbmctcmlnaHQ6IDEycHg7XG4gIH1cbn1cblxuLy8gQ2xhc3Mgb2YgR2hvc3Rcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIGZpc3J0IHBcbi8vIC5wb3N0LWJvZHktd3JhcCA+IHA6Zmlyc3Qtb2YtdHlwZSB7XG4vLyAgIG1hcmdpbi10b3A6IDMwcHg7XG5cbi8vICAgLy8gJjo6Zmlyc3QtbGV0dGVyIHtcbi8vICAgLy8gICBmbG9hdDogbGVmdDtcbi8vICAgLy8gICBmb250LXNpemU6IDU1cHg7XG4vLyAgIC8vICAgZm9udC1zdHlsZTogbm9ybWFsO1xuLy8gICAvLyAgIGZvbnQtd2VpZ2h0OiA5MDA7XG4vLyAgIC8vICAgbGV0dGVyLXNwYWNpbmc6IC0uMDNlbTtcbi8vICAgLy8gICBsaW5lLWhlaWdodDogLjgzO1xuLy8gICAvLyAgIG1hcmdpbi1ib3R0b206IC0uMDhlbTtcbi8vICAgLy8gICBtYXJnaW4tcmlnaHQ6IDdweDtcbi8vICAgLy8gICBwYWRkaW5nLXRvcDogN3B4O1xuLy8gICAvLyAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4vLyAgIC8vIH1cbi8vIH1cblxuLnBvc3QtYm9keS13cmFwIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAvLyAmID4gcDpmaXJzdC1vZi10eXBlIHsgbWFyZ2luLXRvcDogMzBweCB9XG5cbiAgaDEsIGgyLCBoMywgaDQsIGg1LCBoNixcbiAgb2wsIHVsLCBociwgcHJlLCAucG9zdC10YWdzLCAucHJldi1uZXh0IHtcbiAgICBtaW4td2lkdGg6IDEwMCU7XG4gIH1cblxuICAmID4gdWwgeyBtYXJnaW4tdG9wOiAzNXB4IH1cblxuICAmID4gaWZyYW1lLFxuICAmID4gaW1nLFxuICAua2ctaW1hZ2UtY2FyZCxcbiAgLmtnLWVtYmVkLWNhcmQge1xuICAgIG1hcmdpbi10b3A6IDMwcHggIWltcG9ydGFudFxuICB9XG59XG5cbi8vIFNoYXJlIFBvc3Rcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4uc2hhcmVQb3N0IHtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDQwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZSAhaW1wb3J0YW50O1xuICB0cmFuc2l0aW9uOiBhbGwgLjRzO1xuICB0b3A6IDMwcHg7XG5cbiAgLyogc3R5bGVsaW50LWRpc2FibGUtbmV4dC1saW5lICovXG4gIGEge1xuICAgIGNvbG9yOiAjZmZmO1xuICAgIG1hcmdpbjogOHB4IDAgMDtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgfVxuXG4gIC5pLWNoYXQge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gICAgYm9yZGVyOiAycHggc29saWQgI2JiYjtcbiAgICBjb2xvcjogI2JiYjtcbiAgfVxufVxuXG4vLyBQb3N0IFJlbGF0ZWRcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi5wb3N0LXJlbGF0ZWQge1xuICBwYWRkaW5nOiA0MHB4IDA7XG59XG5cbi8vIFByZXZpdXMgYW5kIG5leHQgYXJ0aWNsZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8qIHN0eWxlbGludC1kaXNhYmxlLW5leHQtbGluZSAqL1xuLnByZXYtbmV4dCB7XG4gICYtc3BhbiB7XG4gICAgY29sb3I6IHZhcigtLWNvbXBvc2l0ZS1jb2xvcik7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBmb250LXNpemU6IDEzcHg7XG5cbiAgICBpIHtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgdHJhbnNpdGlvbjogYWxsIDI3N21zIGN1YmljLWJlemllcigwLjE2LCAwLjAxLCAwLjc3LCAxKVxuICAgIH1cbiAgfVxuXG4gICYtdGl0bGUge1xuICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICBoZWlnaHQ6IDJlbTtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIGxpbmUtaGVpZ2h0OiAxICFpbXBvcnRhbnQ7XG4gICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXMgIWltcG9ydGFudDtcbiAgICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsICFpbXBvcnRhbnQ7XG4gICAgLXdlYmtpdC1saW5lLWNsYW1wOiAyICFpbXBvcnRhbnQ7XG4gICAgZGlzcGxheTogLXdlYmtpdC1ib3ggIWltcG9ydGFudDtcbiAgfVxuXG4gIC8vICYtYXJyb3cge1xuICAvLyAgIGNvbG9yOiAjYmJiO1xuICAvLyAgIGZvbnQtc2l6ZTogNDBweDtcbiAgLy8gICBsaW5lLWhlaWdodDogMTtcbiAgLy8gfVxuXG4gICYtbGluazpob3ZlciB7XG4gICAgLy8gLnByZXYtbmV4dC10aXRsZSB7IGNvbG9yOiByZ2JhKDAsIDAsIDAsIC41NCkgfVxuICAgIC5hcnJvdy1yaWdodCB7IGFuaW1hdGlvbjogYXJyb3ctbW92ZS1yaWdodCAwLjVzIGVhc2UtaW4tb3V0IGZvcndhcmRzIH1cbiAgICAuYXJyb3ctbGVmdCB7IGFuaW1hdGlvbjogYXJyb3ctbW92ZS1sZWZ0IDAuNXMgZWFzZS1pbi1vdXQgZm9yd2FyZHMgfVxuICB9XG59XG5cbi8vIEltYWdlIHBvc3QgRm9ybWF0XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLmNjLWltYWdlIHtcbiAgbWF4LWhlaWdodDogMTAwdmg7XG4gIG1pbi1oZWlnaHQ6IDYwMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xuXG4gICYtaGVhZGVyIHtcbiAgICByaWdodDogMDtcbiAgICBib3R0b206IDEwJTtcbiAgICBsZWZ0OiAwO1xuICB9XG5cbiAgJi1maWd1cmUgaW1nIHtcbiAgICBvcGFjaXR5OiAuNDtcbiAgICBvYmplY3QtZml0OiBjb3ZlcjtcbiAgICB3aWR0aDogMTAwJVxuICB9XG5cbiAgLnBvc3QtaGVhZGVyIHsgbWF4LXdpZHRoOiA3MDBweCB9XG4gIC5wb3N0LXRpdGxlLCAucG9zdC1leGNlcnB0IHsgY29sb3I6ICNmZmYgfVxufVxuXG4vLyBWaWRlbyBwb3N0IEZvcm1hdFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLmNjLXZpZGVvIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcbiAgcGFkZGluZzogNDBweCAwIDMwcHg7XG5cbiAgLnBvc3QtZXhjZXJwdCB7IGNvbG9yOiAjYWFhOyBmb250LXNpemU6IDFyZW0gfVxuICAucG9zdC10aXRsZSB7IGNvbG9yOiAjZmZmOyBmb250LXNpemU6IDEuOHJlbSB9XG4gIC5rZy1lbWJlZC1jYXJkLCAudmlkZW8tcmVzcG9uc2l2ZSB7IG1hcmdpbi10b3A6IDAgfVxuXG4gIC8vIFZpZGVvIHJlbGF0ZWRcbiAgLnN0b3J5IGgyIHtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBtYXJnaW46IDA7XG4gICAgZm9udC1zaXplOiAxLjEyNXJlbSAhaW1wb3J0YW50O1xuICAgIGZvbnQtd2VpZ2h0OiA3MDAgIWltcG9ydGFudDtcbiAgICBtYXgtaGVpZ2h0OiAyLjVlbTtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWwgIWltcG9ydGFudDtcbiAgICAtd2Via2l0LWxpbmUtY2xhbXA6IDIgIWltcG9ydGFudDtcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcyAhaW1wb3J0YW50O1xuICAgIGRpc3BsYXk6IC13ZWJraXQtYm94ICFpbXBvcnRhbnQ7XG4gIH1cblxuICAuZmxvdy1tZXRhLCAuc3RvcnktbG93ZXIsIGZpZ2NhcHRpb24geyBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQgfVxuICAuc3RvcnktaW1hZ2UgeyBoZWlnaHQ6IDE3MHB4ICFpbXBvcnRhbnQ7IH1cblxuICAubWVkaWEtdHlwZSB7XG4gICAgaGVpZ2h0OiAzNHB4ICFpbXBvcnRhbnQ7XG4gICAgd2lkdGg6IDM0cHggIWltcG9ydGFudDtcbiAgfVxufVxuXG4vLyBjaGFuZ2UgdGhlIGRlc2lnbiBhY2NvcmRpbmcgdG8gdGhlIGNsYXNzZXMgb2YgdGhlIGJvZHlcbmJvZHkge1xuICAmLmlzLWFydGljbGUgLm1haW4geyBtYXJnaW4tYm90dG9tOiAwIH1cbiAgJi5zaGFyZS1tYXJnaW4gLnNoYXJlUG9zdCB7IHRvcDogLTg1cHggfVxuICAmLnNob3ctY2F0ZWdvcnkgLnBvc3QtcHJpbWFyeS10YWcgeyBkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50IH1cblxuICAmLmlzLWFydGljbGUtc2luZ2xlIHtcbiAgICAucG9zdC1ib2R5LXdyYXAgeyBtYXJnaW4tbGVmdDogMCAhaW1wb3J0YW50IH1cbiAgICAuc2hhcmVQb3N0IHsgbGVmdDogLTEwMHB4IH1cbiAgICAua2ctd2lkdGgtZnVsbCAua2ctaW1hZ2UgeyBtYXgtd2lkdGg6IDEwMHZ3IH1cbiAgICAua2ctd2lkdGgtd2lkZSAua2ctaW1hZ2UgeyBtYXgtd2lkdGg6IDEwNDBweCB9XG4gIH1cbn1cblxuQG1lZGlhICN7JG1kLWFuZC1kb3dufSB7XG4gIC5wb3N0LWJvZHktd3JhcCB7XG4gICAgcSB7XG4gICAgICBmb250LXNpemU6IDIwcHggIWltcG9ydGFudDtcbiAgICAgIGxldHRlci1zcGFjaW5nOiAtLjAwOGVtICFpbXBvcnRhbnQ7XG4gICAgICBsaW5lLWhlaWdodDogMS40ICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgLy8gJiA+IHA6Zmlyc3Qtb2YtdHlwZTo6Zmlyc3QtbGV0dGVyIHtcbiAgICAvLyAgIGZvbnQtc2l6ZTogMzBweDtcbiAgICAvLyAgIG1hcmdpbi1yaWdodDogNnB4O1xuICAgIC8vICAgcGFkZGluZy10b3A6IDMuNXB4O1xuICAgIC8vIH1cblxuICAgIC5rZy1pbWFnZS1jYXJkIGltZyB7IG1heC13aWR0aDogMTAwJTsgfVxuXG4gICAgb2wsIHVsLCBwIHtcbiAgICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgICAgIGxldHRlci1zcGFjaW5nOiAtLjAwNGVtO1xuICAgICAgbGluZS1oZWlnaHQ6IDEuNTg7XG4gICAgfVxuXG4gICAgaWZyYW1lIHsgd2lkdGg6IDEwMCUgIWltcG9ydGFudDsgfVxuICB9XG5cbiAgLy8gUG9zdCBSZWxhdGVkXG4gIC5wb3N0LXJlbGF0ZWQge1xuICAgIHBhZGRpbmctbGVmdDogOHB4O1xuICAgIHBhZGRpbmctcmlnaHQ6IDhweDtcbiAgfVxuXG4gIC8vIEltYWdlIHBvc3QgZm9ybWF0XG4gIC5jYy1pbWFnZS1maWd1cmUge1xuICAgIHdpZHRoOiAyMDAlO1xuICAgIG1heC13aWR0aDogMjAwJTtcbiAgICBtYXJnaW46IDAgYXV0byAwIC01MCU7XG4gIH1cblxuICAuY2MtaW1hZ2UtaGVhZGVyIHsgYm90dG9tOiAyNHB4IH1cbiAgLmNjLWltYWdlIC5wb3N0LWV4Y2VycHQgeyBmb250LXNpemU6IDE4cHg7IH1cblxuICAvLyB2aWRlbyBwb3N0IGZvcm1hdFxuICAuY2MtdmlkZW8ge1xuICAgIHBhZGRpbmc6IDIwcHggMDtcblxuICAgICYtZW1iZWQge1xuICAgICAgbWFyZ2luLWxlZnQ6IC0xNnB4O1xuICAgICAgbWFyZ2luLXJpZ2h0OiAtMTVweDtcbiAgICB9XG5cbiAgICAucG9zdC1oZWFkZXIgeyBtYXJnaW4tdG9wOiAxMHB4IH1cbiAgfVxufVxuXG5AbWVkaWEgI3skbGctYW5kLWRvd259IHtcbiAgYm9keS5pcy1hcnRpY2xlIHtcbiAgICAuY29sLWxlZnQgeyBtYXgtd2lkdGg6IDEwMCUgfVxuICAgIC8vIC5zaWRlYmFyIHsgZGlzcGxheTogbm9uZTsgfVxuICB9XG59XG5cbkBtZWRpYSAjeyRtZC1hbmQtdXB9IHtcbiAgLy8gSW1hZ2UgcG9zdCBGb3JtYXRcbiAgLmNjLWltYWdlIC5wb3N0LXRpdGxlIHsgZm9udC1zaXplOiAzLjJyZW0gfVxufVxuXG5AbWVkaWEgI3skbGctYW5kLXVwfSB7XG4gIGJvZHkuaXMtYXJ0aWNsZSAucG9zdC1ib2R5LXdyYXAgeyBtYXJnaW4tbGVmdDogNzBweDsgfVxuXG4gIGJvZHkuaXMtdmlkZW8sXG4gIGJvZHkuaXMtaW1hZ2Uge1xuICAgIC5wb3N0LWF1dGhvciB7IG1hcmdpbi1sZWZ0OiA3MHB4IH1cbiAgICAvLyAuc2hhcmVQb3N0IHsgdG9wOiAtODVweCB9XG4gIH1cbn1cblxuQG1lZGlhICN7JHhsLWFuZC11cH0ge1xuICBib2R5Lmhhcy12aWRlby1maXhlZCB7XG4gICAgLmNjLXZpZGVvLWVtYmVkIHtcbiAgICAgIGJvdHRvbTogMjBweDtcbiAgICAgIGJveC1zaGFkb3c6IDAgMCAxMHB4IDAgcmdiYSgwLCAwLCAwLCAuNSk7XG4gICAgICBoZWlnaHQ6IDIwM3B4O1xuICAgICAgcGFkZGluZy1ib3R0b206IDA7XG4gICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICByaWdodDogMjBweDtcbiAgICAgIHdpZHRoOiAzNjBweDtcbiAgICAgIHotaW5kZXg6IDg7XG4gICAgfVxuXG4gICAgLmNjLXZpZGVvLWNsb3NlIHtcbiAgICAgIGJhY2tncm91bmQ6ICMwMDA7XG4gICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICBjb2xvcjogI2ZmZjtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICBoZWlnaHQ6IDI0cHg7XG4gICAgICBsZWZ0OiAtMTBweDtcbiAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgcGFkZGluZy10b3A6IDVweDtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIHRvcDogLTEwcHg7XG4gICAgICB3aWR0aDogMjRweDtcbiAgICAgIHotaW5kZXg6IDU7XG4gICAgfVxuXG4gICAgLmNjLXZpZGVvLWNvbnQgeyBoZWlnaHQ6IDQ2NXB4OyB9XG5cbiAgICAuY2MtaW1hZ2UtaGVhZGVyIHsgYm90dG9tOiAyMCUgfVxuICB9XG59XG4iLCIvLyBzdHlsZXMgZm9yIHN0b3J5XG5cbi5oci1saXN0IHtcbiAgYm9yZGVyOiAwO1xuICBib3JkZXItdG9wOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjA3ODUpO1xuICBtYXJnaW46IDIwcHggMCAwO1xuICAvLyAmOmZpcnN0LWNoaWxkIHsgbWFyZ2luLXRvcDogNXB4IH1cbn1cblxuLnN0b3J5LWZlZWQgLnN0b3J5LWZlZWQtY29udGVudDpmaXJzdC1jaGlsZCAuaHItbGlzdDpmaXJzdC1jaGlsZCB7XG4gIG1hcmdpbi10b3A6IDVweDtcbn1cblxuLy8gbWVkaWEgdHlwZSBpY29uICggdmlkZW8gLSBpbWFnZSApXG4ubWVkaWEtdHlwZSB7XG4gIC8vIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0ZW4oJHByaW1hcnktY29sb3IsIDE1JSk7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgLjcpO1xuICBjb2xvcjogI2ZmZjtcbiAgaGVpZ2h0OiA0NXB4O1xuICBsZWZ0OiAxNXB4O1xuICB0b3A6IDE1cHg7XG4gIHdpZHRoOiA0NXB4O1xuICBvcGFjaXR5OiAuOTtcblxuICAvLyBAZXh0ZW5kIC51LWJnQ29sb3I7XG4gIEBleHRlbmQgLnUtZm9udFNpemVMYXJnZXI7XG4gIEBleHRlbmQgLnUtcm91bmQ7XG4gIEBleHRlbmQgLnUtZmxleENlbnRlcjtcbiAgQGV4dGVuZCAudS1mbGV4Q29udGVudENlbnRlcjtcbn1cblxuLy8gSW1hZ2Ugb3ZlclxuLmltYWdlLWhvdmVyIHtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC43cztcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVaKDApXG59XG5cbi8vIG5vdCBpbWFnZVxuLm5vdC1pbWFnZSB7XG4gIGJhY2tncm91bmQ6IHVybCgnLi4vaW1hZ2VzL25vdC1pbWFnZS5wbmcnKTtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IHJlcGVhdDtcbn1cblxuLy8gTWV0YVxuLmZsb3ctbWV0YSB7XG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNTQpO1xuICBmb250LXdlaWdodDogNzAwO1xuICBtYXJnaW4tYm90dG9tOiAxMHB4O1xufVxuXG4vLyBwb2ludFxuLnBvaW50IHsgbWFyZ2luOiAwIDVweCB9XG5cbi8vIFN0b3J5IERlZmF1bHQgbGlzdFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLnN0b3J5IHtcbiAgJi1pbWFnZSB7XG4gICAgZmxleDogMCAwICA0NCUgLyozODBweCovO1xuICAgIGhlaWdodDogMjM1cHg7XG4gICAgbWFyZ2luLXJpZ2h0OiAzMHB4O1xuXG4gICAgJjpob3ZlciAuaW1hZ2UtaG92ZXIgeyB0cmFuc2Zvcm06IHNjYWxlKDEuMDMpIH1cbiAgfVxuXG4gICYtbG93ZXIgeyBmbGV4LWdyb3c6IDEgfVxuXG4gICYtZXhjZXJwdCB7XG4gICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC44NCk7XG4gICAgZm9udC1mYW1pbHk6ICRzZWN1bmRhcnktZm9udDtcbiAgICBmb250LXdlaWdodDogMzAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjU7XG4gIH1cblxuICAmLWNhdGVnb3J5IHsgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC44NCkgfVxuXG4gIGgyIGE6aG92ZXIge1xuICAgIC8vIGJveC1zaGFkb3c6IGluc2V0IDAgLTJweCAwIHJnYmEoMCwgMTcxLCAxMDcsIC41KTtcbiAgICAvLyBib3gtc2hhZG93OiBpbnNldCAwIC0ycHggMCByZ2JhKCRwcmltYXJ5LWNvbG9yLCAuNSk7XG4gICAgLy8gYm94LXNoYWRvdzogaW5zZXQgMCAtMnB4IDAgdmFyKC0tc3RvcnktY29sb3ItaG92ZXIpO1xuICAgIGJveC1zaGFkb3c6IGluc2V0IDAgLTJweCAwIHJnYmEoMCwgMCwgMCwgMC40KTtcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjI1cztcbiAgfVxufVxuXG4vLyBTdG9yeSBHcmlkXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4uc3Rvcnkuc3RvcnktLWdyaWQge1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBtYXJnaW4tYm90dG9tOiAzMHB4O1xuXG4gIC5zdG9yeS1pbWFnZSB7XG4gICAgZmxleDogMCAwIGF1dG87XG4gICAgbWFyZ2luLXJpZ2h0OiAwO1xuICAgIGhlaWdodDogMjIwcHg7XG4gIH1cblxuICAubWVkaWEtdHlwZSB7XG4gICAgZm9udC1zaXplOiAyNHB4O1xuICAgIGhlaWdodDogNDBweDtcbiAgICB3aWR0aDogNDBweDtcbiAgfVxufVxuXG4uY292ZXItY2F0ZWdvcnkgeyBjb2xvcjogdmFyKC0tc3RvcnktY292ZXItY2F0ZWdvcnktY29sb3IpIH1cblxuLy8gU3RvcnkgQ2FyZFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLnN0b3J5LWNhcmQge1xuICAuc3Rvcnkge1xuICAgIC8vIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgLy8gYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIC8vIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjA0KTtcbiAgICAvLyBib3gtc2hhZG93OiAwIDFweCA3cHggcmdiYSgwLCAwLCAwLCAuMDUpO1xuICAgIG1hcmdpbi10b3A6IDAgIWltcG9ydGFudDtcblxuICAgIC8vICY6aG92ZXIgLnN0b3J5LWltYWdlIHsgYm94LXNoYWRvdzogMCAwIDE1cHggNHB4IHJnYmEoMCwgMCwgMCwgLjEpIH1cbiAgfVxuXG4gIC8qIHN0eWxlbGludC1kaXNhYmxlLW5leHQtbGluZSAqL1xuICAuc3RvcnktaW1hZ2Uge1xuICAgIC8vIGJveC1zaGFkb3c6IDAgMXB4IDJweCByZ2JhKDAsIDAsIDAsIC4wNyk7XG4gICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAuMDQpO1xuICAgIGJveC1zaGFkb3c6IDAgMXB4IDdweCByZ2JhKDAsIDAsIDAsIC4wNSk7XG4gICAgYm9yZGVyLXJhZGl1czogMnB4O1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmYgIWltcG9ydGFudDtcbiAgICB0cmFuc2l0aW9uOiBhbGwgMTUwbXMgZWFzZS1pbi1vdXQ7XG4gICAgLy8gYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjA3ODUpO1xuICAgIC8vIGJvcmRlci1yYWRpdXM6IDRweCA0cHggMCAwO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgaGVpZ2h0OiAyMDBweCAhaW1wb3J0YW50O1xuXG4gICAgLnN0b3J5LWltZy1iZyB7IG1hcmdpbjogMTBweCB9XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIGJveC1zaGFkb3c6IDAgMCAxNXB4IDRweCByZ2JhKDAsIDAsIDAsIC4xKTtcblxuICAgICAgLnN0b3J5LWltZy1iZyB7IHRyYW5zZm9ybTogbm9uZSB9XG4gICAgfVxuICB9XG5cbiAgLnN0b3J5LWxvd2VyIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50IH1cblxuICAuc3RvcnktYm9keSB7XG4gICAgcGFkZGluZzogMTVweCA1cHg7XG4gICAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XG5cbiAgICBoMiB7XG4gICAgICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsICFpbXBvcnRhbnQ7XG4gICAgICAtd2Via2l0LWxpbmUtY2xhbXA6IDIgIWltcG9ydGFudDtcbiAgICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC45KTtcbiAgICAgIGRpc3BsYXk6IC13ZWJraXQtYm94ICFpbXBvcnRhbnQ7XG4gICAgICAvLyBsaW5lLWhlaWdodDogMS4xICFpbXBvcnRhbnQ7XG4gICAgICBtYXgtaGVpZ2h0OiAyLjRlbSAhaW1wb3J0YW50O1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzICFpbXBvcnRhbnQ7XG4gICAgICBtYXJnaW46IDA7XG4gICAgfVxuICB9XG59XG5cbi8vIE1lZGlhIHF1ZXJ5IGFmdGVyIG1lZGl1bVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuQG1lZGlhICN7JG1kLWFuZC11cH0ge1xuICAvLyBzdG9yeSBncmlkXG4gIC5zdG9yeS5zdG9yeS0tZ3JpZCB7XG4gICAgLnN0b3J5LWxvd2VyIHtcbiAgICAgIG1heC1oZWlnaHQ6IDIuNmVtO1xuICAgICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcbiAgICAgIC13ZWJraXQtbGluZS1jbGFtcDogMjtcbiAgICAgIGRpc3BsYXk6IC13ZWJraXQtYm94O1xuICAgICAgbGluZS1oZWlnaHQ6IDEuMTtcbiAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgIH1cbiAgfVxufVxuXG4vLyBNZWRpYSBxdWVyeSBiZWZvcmUgbWVkaXVtXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQG1lZGlhICN7JG1kLWFuZC1kb3dufSB7XG4gIC8vIFN0b3J5IENvdmVyXG4gIC5jb3Zlci0tZmlydHMgLmNvdmVyLXN0b3J5IHsgaGVpZ2h0OiA1MDBweCB9XG5cbiAgLy8gc3RvcnkgZGVmYXVsdCBsaXN0XG4gIC5zdG9yeSB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBtYXJnaW4tdG9wOiAyMHB4O1xuXG4gICAgJi1pbWFnZSB7IGZsZXg6IDAgMCBhdXRvOyBtYXJnaW4tcmlnaHQ6IDAgfVxuICAgICYtYm9keSB7IG1hcmdpbi10b3A6IDEwcHggfVxuICB9XG59XG4iLCIvLyBBdXRob3IgcGFnZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLmF1dGhvciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC42KTtcbiAgbWluLWhlaWdodDogMzUwcHg7XG5cbiAgJi1hdmF0YXIge1xuICAgIGhlaWdodDogODBweDtcbiAgICB3aWR0aDogODBweDtcbiAgfVxuXG4gICYtbWV0YSBzcGFuIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgZm9udC1zaXplOiAxN3B4O1xuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICBtYXJnaW46IDAgMjVweCAxNnB4IDA7XG4gICAgb3BhY2l0eTogLjg7XG4gICAgd29yZC13cmFwOiBicmVhay13b3JkO1xuICB9XG5cbiAgJi1uYW1lIHsgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjgpIH1cbiAgJi1iaW8geyBtYXgtd2lkdGg6IDYwMHB4OyB9XG4gICYtbWV0YSBhOmhvdmVyIHsgb3BhY2l0eTogLjggIWltcG9ydGFudCB9XG59XG5cbi5jb3Zlci1vcGFjaXR5IHsgb3BhY2l0eTogLjUgfVxuXG4uYXV0aG9yLmhhcy0taW1hZ2Uge1xuICBjb2xvcjogI2ZmZiAhaW1wb3J0YW50O1xuICB0ZXh0LXNoYWRvdzogMCAwIDEwcHggcmdiYSgwLCAwLCAwLCAuMzMpO1xuXG4gIGEsXG4gIC5hdXRob3ItbmFtZSB7IGNvbG9yOiAjZmZmOyB9XG5cbiAgLmF1dGhvci1mb2xsb3cgYSB7XG4gICAgYm9yZGVyOiAycHggc29saWQ7XG4gICAgYm9yZGVyLWNvbG9yOiBoc2xhKDAsIDAlLCAxMDAlLCAuNSkgIWltcG9ydGFudDtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gIH1cblxuICAudS1hY2NlbnRDb2xvci0taWNvbk5vcm1hbCB7IGZpbGw6ICNmZmY7IH1cbn1cblxuQG1lZGlhICN7JG1kLWFuZC1kb3dufSB7XG4gIC5hdXRob3ItbWV0YSBzcGFuIHsgZGlzcGxheTogYmxvY2s7IH1cbiAgLmF1dGhvci1oZWFkZXIgeyBkaXNwbGF5OiBibG9jazsgfVxuICAuYXV0aG9yLWF2YXRhciB7IG1hcmdpbjogMCBhdXRvIDIwcHg7IH1cbn1cblxuQG1lZGlhICN7JG1kLWFuZC11cH0ge1xuICBib2R5Lmhhcy1jb3ZlciAuYXV0aG9yIHsgbWluLWhlaWdodDogNjAwcHggfVxufVxuIiwiLy8gU2VhcmNoXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4uc2VhcmNoIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgaGVpZ2h0OiAxMDAlO1xuICBoZWlnaHQ6IDEwMHZoO1xuICBsZWZ0OiAwO1xuICBwYWRkaW5nOiAwIDE2cHg7XG4gIHJpZ2h0OiAwO1xuICB0b3A6IDA7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTAwJSk7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuM3MgZWFzZTtcbiAgei1pbmRleDogOTtcblxuICAmLWZvcm0ge1xuICAgIG1heC13aWR0aDogNjgwcHg7XG4gICAgbWFyZ2luLXRvcDogODBweDtcblxuICAgICY6OmJlZm9yZSB7XG4gICAgICBiYWNrZ3JvdW5kOiAjZWVlO1xuICAgICAgYm90dG9tOiAwO1xuICAgICAgY29udGVudDogJyc7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIGhlaWdodDogMnB4O1xuICAgICAgbGVmdDogMDtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgei1pbmRleDogMTtcbiAgICB9XG5cbiAgICBpbnB1dCB7XG4gICAgICBib3JkZXI6IG5vbmU7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIGxpbmUtaGVpZ2h0OiA0MHB4O1xuICAgICAgcGFkZGluZy1ib3R0b206IDhweDtcblxuICAgICAgJjpmb2N1cyB7IG91dGxpbmU6IDA7IH1cbiAgICB9XG4gIH1cblxuICAvLyByZXN1bHRcbiAgJi1yZXN1bHRzIHtcbiAgICBtYXgtaGVpZ2h0OiBjYWxjKDkwJSAtIDEwMHB4KTtcbiAgICBtYXgtd2lkdGg6IDY4MHB4O1xuICAgIG92ZXJmbG93OiBhdXRvO1xuXG4gICAgYSB7XG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2VlZTtcbiAgICAgIHBhZGRpbmc6IDEycHggMDtcblxuICAgICAgJjpob3ZlciB7IGNvbG9yOiByZ2JhKDAsIDAsIDAsIC40NCkgfVxuICAgIH1cbiAgfVxufVxuXG4uYnV0dG9uLXNlYXJjaC0tY2xvc2Uge1xuICBwb3NpdGlvbjogYWJzb2x1dGUgIWltcG9ydGFudDtcbiAgcmlnaHQ6IDUwcHg7XG4gIHRvcDogMjBweDtcbn1cblxuYm9keS5pcy1zZWFyY2gge1xuICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gIC5zZWFyY2ggeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCkgfVxuICAuc2VhcmNoLXRvZ2dsZSB7IGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjI1KSB9XG59XG4iLCIuc2lkZWJhciB7XG4gICYtdGl0bGUge1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIC4wNzg1KTtcblxuICAgIHNwYW4ge1xuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjU0KTtcbiAgICAgIHBhZGRpbmctYm90dG9tOiAxMHB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogLTFweDtcbiAgICB9XG4gIH1cbn1cblxuLy8gYm9yZGVyIGZvciBwb3N0XG4uc2lkZWJhci1ib3JkZXIge1xuICBib3JkZXItbGVmdDogM3B4IHNvbGlkIHZhcigtLWNvbXBvc2l0ZS1jb2xvcik7XG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC4yKTtcbiAgZm9udC1mYW1pbHk6ICRzZWN1bmRhcnktZm9udDtcbiAgcGFkZGluZzogMCAxMHB4O1xuICAtd2Via2l0LXRleHQtZmlsbC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIC13ZWJraXQtdGV4dC1zdHJva2Utd2lkdGg6IDEuNXB4O1xuICAtd2Via2l0LXRleHQtc3Ryb2tlLWNvbG9yOiAjODg4O1xufVxuXG4uc2lkZWJhci1wb3N0IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4wNzg1KTtcbiAgYm94LXNoYWRvdzogMCAxcHggN3B4IHJnYmEoMCwgMCwgMCwgLjA3ODUpO1xuICBtaW4taGVpZ2h0OiA2MHB4O1xuXG4gICY6aG92ZXIgeyAuc2lkZWJhci1ib3JkZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIyOSwgMjM5LCAyNDUsIDEpIH0gfVxuXG4gICY6bnRoLWNoaWxkKDNuKSB7IC5zaWRlYmFyLWJvcmRlciB7IGJvcmRlci1jb2xvcjogZGFya2VuKG9yYW5nZSwgMiUpOyB9IH1cbiAgJjpudGgtY2hpbGQoM24rMikgeyAuc2lkZWJhci1ib3JkZXIgeyBib3JkZXItY29sb3I6ICMyNmE4ZWQgfSB9XG59XG5cbi8vIENlbnRlcmVkIGxpbmUgYW5kIG9ibGlxdWUgY29udGVudFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIC5jZW50ZXItbGluZSB7XG4vLyAgIGZvbnQtc2l6ZTogMTZweDtcbi8vICAgbWFyZ2luLWJvdHRvbTogMTVweDtcbi8vICAgcG9zaXRpb246IHJlbGF0aXZlO1xuLy8gICB0ZXh0LWFsaWduOiBjZW50ZXI7XG5cbi8vICAgJjo6YmVmb3JlIHtcbi8vICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIC4xNSk7XG4vLyAgICAgYm90dG9tOiA1MCU7XG4vLyAgICAgY29udGVudDogJyc7XG4vLyAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuLy8gICAgIGhlaWdodDogMXB4O1xuLy8gICAgIGxlZnQ6IDA7XG4vLyAgICAgcG9zaXRpb246IGFic29sdXRlO1xuLy8gICAgIHdpZHRoOiAxMDAlO1xuLy8gICAgIHotaW5kZXg6IDA7XG4vLyAgIH1cbi8vIH1cblxuLy8gLm9ibGlxdWUge1xuLy8gICBiYWNrZ3JvdW5kOiAjZmYwMDViO1xuLy8gICBjb2xvcjogI2ZmZjtcbi8vICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuLy8gICBmb250LXNpemU6IDE2cHg7XG4vLyAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4vLyAgIGxpbmUtaGVpZ2h0OiAxO1xuLy8gICBwYWRkaW5nOiA1cHggMTNweDtcbi8vICAgcG9zaXRpb246IHJlbGF0aXZlO1xuLy8gICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuLy8gICB0cmFuc2Zvcm06IHNrZXdYKC0xNWRlZyk7XG4vLyAgIHotaW5kZXg6IDE7XG4vLyB9XG4iLCIvLyBOYXZpZ2F0aW9uIE1vYmlsZVxyXG4uc2lkZU5hdiB7XHJcbiAgLy8gYmFja2dyb3VuZC1jb2xvcjogJHByaW1hcnktY29sb3I7XHJcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC44KTtcclxuICBoZWlnaHQ6IDEwMHZoO1xyXG4gIHBhZGRpbmc6ICRoZWFkZXItaGVpZ2h0IDIwcHg7XHJcbiAgcG9zaXRpb246IGZpeGVkICFpbXBvcnRhbnQ7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDEwMCUpO1xyXG4gIHRyYW5zaXRpb246IDAuNHM7XHJcbiAgd2lsbC1jaGFuZ2U6IHRyYW5zZm9ybTtcclxuICB6LWluZGV4OiA4O1xyXG5cclxuICAmLW1lbnUgYSB7IHBhZGRpbmc6IDEwcHggMjBweDsgfVxyXG5cclxuICAmLXdyYXAge1xyXG4gICAgYmFja2dyb3VuZDogI2VlZTtcclxuICAgIG92ZXJmbG93OiBhdXRvO1xyXG4gICAgcGFkZGluZzogMjBweCAwO1xyXG4gICAgdG9wOiAkaGVhZGVyLWhlaWdodDtcclxuICB9XHJcblxyXG4gICYtc2VjdGlvbiB7XHJcbiAgICBib3JkZXItYm90dG9tOiBzb2xpZCAxcHggI2RkZDtcclxuICAgIG1hcmdpbi1ib3R0b206IDhweDtcclxuICAgIHBhZGRpbmctYm90dG9tOiA4cHg7XHJcbiAgfVxyXG5cclxuICAmLWZvbGxvdyB7XHJcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgI2RkZDtcclxuICAgIG1hcmdpbjogMTVweCAwO1xyXG5cclxuICAgIGEge1xyXG4gICAgICBjb2xvcjogI2ZmZjtcclxuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICBoZWlnaHQ6IDM2cHg7XHJcbiAgICAgIGxpbmUtaGVpZ2h0OiAyMHB4O1xyXG4gICAgICBtYXJnaW46IDAgNXB4IDVweCAwO1xyXG4gICAgICBtaW4td2lkdGg6IDM2cHg7XHJcbiAgICAgIHBhZGRpbmc6IDhweDtcclxuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xyXG4gICAgfVxyXG5cclxuICAgIEBlYWNoICRzb2NpYWwtbmFtZSwgJGNvbG9yIGluICRzb2NpYWwtY29sb3JzIHtcclxuICAgICAgLmktI3skc29jaWFsLW5hbWV9IHtcclxuICAgICAgICBAZXh0ZW5kIC5iZy0jeyRzb2NpYWwtbmFtZX07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8gIEZvbGxvdyBtZSBidG4gaXMgcG9zdFxuLy8gLm1hcGFjaGUtZm9sbG93IHtcbi8vICAgJjpob3ZlciB7XG4vLyAgICAgLm1hcGFjaGUtaG92ZXItaGlkZGVuIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50IH1cbi8vICAgICAubWFwYWNoZS1ob3Zlci1zaG93IHsgZGlzcGxheTogaW5saW5lLWJsb2NrICFpbXBvcnRhbnQgfVxuLy8gICB9XG5cbi8vICAgJi1idG4ge1xuLy8gICAgIGhlaWdodDogMTlweDtcbi8vICAgICBsaW5lLWhlaWdodDogMTdweDtcbi8vICAgICBwYWRkaW5nOiAwIDEwcHg7XG4vLyAgIH1cbi8vIH1cblxuLy8gVHJhbnNwYXJlY2UgaGVhZGVyIGFuZCBjb3ZlciBpbWdcblxuLmhhcy1jb3Zlci1wYWRkaW5nIHsgcGFkZGluZy10b3A6IDEwMHB4IH1cblxuYm9keS5oYXMtY292ZXIge1xuICAuaGVhZGVyIHsgcG9zaXRpb246IGZpeGVkIH1cblxuICAmLmlzLXRyYW5zcGFyZW5jeTpub3QoLmlzLXNlYXJjaCkge1xuICAgIC5oZWFkZXIge1xuICAgICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAuMDUpO1xuICAgICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCBoc2xhKDAsIDAlLCAxMDAlLCAuMSk7XG4gICAgfVxuXG4gICAgLmhlYWRlci1sZWZ0IGEsIC5uYXYgdWwgbGkgYSB7IGNvbG9yOiAjZmZmOyB9XG4gICAgLm1lbnUtLXRvZ2dsZSBzcGFuIHsgYmFja2dyb3VuZC1jb2xvcjogI2ZmZiB9XG4gIH1cbn1cbiIsIi8vIC5pcy1zdWJzY3JpYmUgLmZvb3RlciB7XG4vLyAgIGJhY2tncm91bmQtY29sb3I6ICNmMGYwZjA7XG4vLyB9XG5cbi5zdWJzY3JpYmUge1xuICBtaW4taGVpZ2h0OiA4MHZoICFpbXBvcnRhbnQ7XG4gIGhlaWdodDogMTAwJTtcbiAgLy8gYmFja2dyb3VuZC1jb2xvcjogI2YwZjBmMCAhaW1wb3J0YW50O1xuXG4gICYtY2FyZCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI0Q3RUZFRTtcbiAgICBib3gtc2hhZG93OiAwIDJweCAxMHB4IHJnYmEoMCwgMCwgMCwgLjE1KTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgd2lkdGg6IDkwMHB4O1xuICAgIGhlaWdodDogNTUwcHg7XG4gICAgcGFkZGluZzogNTBweDtcbiAgICBtYXJnaW46IDVweDtcbiAgfVxuXG4gIGZvcm0ge1xuICAgIG1heC13aWR0aDogMzAwcHg7XG4gIH1cblxuICAmLWZvcm0ge1xuICAgIGhlaWdodDogMTAwJTtcbiAgfVxuXG4gICYtaW5wdXQge1xuICAgIGJhY2tncm91bmQ6IDAgMDtcbiAgICBib3JkZXI6IDA7XG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjYzU0NTQ7XG4gICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICBwYWRkaW5nOiA3cHggNXB4O1xuICAgIGhlaWdodDogNDVweDtcbiAgICBvdXRsaW5lOiAwO1xuICAgIGZvbnQtZmFtaWx5OiAkcHJpbWFyeS1mb250O1xuXG4gICAgJjo6cGxhY2Vob2xkZXIge1xuICAgICAgY29sb3I6ICNjYzU0NTQ7XG4gICAgfVxuICB9XG5cbiAgLm1haW4tZXJyb3Ige1xuICAgIGNvbG9yOiAjY2M1NDU0O1xuICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICBtYXJnaW4tdG9wOiAxNXB4O1xuICB9XG59XG5cbi8vIC5zdWJzY3JpYmUtYnRuIHtcbi8vICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAuODQpO1xuLy8gICBib3JkZXItY29sb3I6IHJnYmEoMCwgMCwgMCwgLjg0KTtcbi8vICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjk3KTtcbi8vICAgYm94LXNoYWRvdzogMCAxcHggN3B4IHJnYmEoMCwgMCwgMCwgLjA1KTtcbi8vICAgbGV0dGVyLXNwYWNpbmc6IDFweDtcblxuLy8gICAmOmhvdmVyIHtcbi8vICAgICBiYWNrZ3JvdW5kOiAjMUM5OTYzO1xuLy8gICAgIGJvcmRlci1jb2xvcjogIzFDOTk2Mztcbi8vICAgfVxuLy8gfVxuXG4vLyBTdWNjZXNzXG4uc3Vic2NyaWJlLXN1Y2Nlc3Mge1xuICAuc3Vic2NyaWJlLWNhcmQge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNFOEYzRUM7XG4gIH1cbn1cblxuQG1lZGlhICN7JG1kLWFuZC1kb3dufSB7XG4gIC5zdWJzY3JpYmUtY2FyZCB7XG4gICAgaGVpZ2h0OiBhdXRvO1xuICAgIHdpZHRoOiBhdXRvO1xuICB9XG59XG4iLCIvLyBwb3N0IENvbW1lbnRzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4ucG9zdC1jb21tZW50cyB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICB6LWluZGV4OiAxNTtcbiAgd2lkdGg6IDEwMCU7XG4gIGxlZnQ6IDA7XG4gIG92ZXJmbG93LXk6IGF1dG87XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIGJvcmRlci1sZWZ0OiAxcHggc29saWQgI2YxZjFmMTtcbiAgYm94LXNoYWRvdzogMCAxcHggN3B4IHJnYmEoMCwgMCwgMCwgLjA1KTtcbiAgZm9udC1zaXplOiAxNHB4O1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTAwJSk7XG4gIHRyYW5zaXRpb246IC4ycztcbiAgd2lsbC1jaGFuZ2U6IHRyYW5zZm9ybTtcblxuICAmLWhlYWRlciB7XG4gICAgcGFkZGluZzogMjBweDtcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2RkZDtcblxuICAgIC50b2dnbGUtY29tbWVudHMge1xuICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBsZWZ0OiAwO1xuICAgICAgdG9wOiAwO1xuICAgICAgcGFkZGluZzogMTdweDtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB9XG4gIH1cblxuICAmLW92ZXJsYXkge1xuICAgIHBvc2l0aW9uOiBmaXhlZCAhaW1wb3J0YW50O1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgLjIpO1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAuNHMgbGluZWFyO1xuICAgIHotaW5kZXg6IDg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG59XG5cbmJvZHkuaGFzLWNvbW1lbnRzIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICAucG9zdC1jb21tZW50cy1vdmVybGF5IHsgZGlzcGxheTogYmxvY2sgfVxuICAucG9zdC1jb21tZW50cyB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKSB9XG59XG5cbkBtZWRpYSAjeyRtZC1hbmQtdXB9IHtcbiAgLnBvc3QtY29tbWVudHMge1xuICAgIGxlZnQ6IGF1dG87XG4gICAgd2lkdGg6IDUwMHB4O1xuICAgIHRvcDogJGhlYWRlci1oZWlnaHQ7XG4gICAgei1pbmRleDogOTtcblxuICAgICYtd3JhcCB7IHBhZGRpbmc6IDIwcHg7IH1cbiAgfVxufVxuIiwiLm1vZGFsIHtcbiAgb3BhY2l0eTogMDtcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAuMnMgZWFzZS1vdXQgLjFzLCB2aXNpYmlsaXR5IDBzIC40cztcbiAgei1pbmRleDogMTAwO1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG5cbiAgLy8gU2hhZGVyXG4gICYtc2hhZGVyIHsgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAuNjUpIH1cblxuICAvLyBtb2RhbCBjbG9zZVxuICAmLWNsb3NlIHtcbiAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNTQpO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgcmlnaHQ6IDA7XG4gICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgcGFkZGluZzogMTVweDtcbiAgfVxuXG4gIC8vIElubmVyXG4gICYtaW5uZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNFOEYzRUM7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIGJveC1zaGFkb3c6IDAgMnB4IDEwcHggcmdiYSgwLCAwLCAwLCAuMTUpO1xuICAgIG1heC13aWR0aDogNzAwcHg7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIG1heC1oZWlnaHQ6IDQwMHB4O1xuICAgIG9wYWNpdHk6IDA7XG4gICAgcGFkZGluZzogNzJweCA1JSA1NnB4O1xuICAgIHRyYW5zZm9ybTogc2NhbGUoLjYpO1xuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuM3MgY3ViaWMtYmV6aWVyKC4wNiwgLjQ3LCAuMzgsIC45OSksIG9wYWNpdHkgLjNzIGN1YmljLWJlemllciguMDYsIC40NywgLjM4LCAuOTkpO1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG5cbiAgLy8gZm9ybVxuICAuZm9ybS1ncm91cCB7XG4gICAgd2lkdGg6IDc2JTtcbiAgICBtYXJnaW46IDAgYXV0byAzMHB4O1xuICB9XG5cbiAgLmZvcm0tLWlucHV0IHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xuICAgIGhlaWdodDogNDBweDtcbiAgICBsaW5lLWhlaWdodDogNDBweDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBwYWRkaW5nOiAxN3B4IDZweDtcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAuMTUpO1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG5cbiAgLy8gLmZvcm0tLWJ0biB7XG4gIC8vICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAuODQpO1xuICAvLyAgIGJvcmRlcjogMDtcbiAgLy8gICBoZWlnaHQ6IDM3cHg7XG4gIC8vICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAvLyAgIGxpbmUtaGVpZ2h0OiAzN3B4O1xuICAvLyAgIHBhZGRpbmc6IDAgMTZweDtcbiAgLy8gICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIC4zcyBlYXNlLWluLW91dDtcbiAgLy8gICBsZXR0ZXItc3BhY2luZzogMXB4O1xuICAvLyAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIC45Nyk7XG4gIC8vICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gIC8vICAgJjpob3ZlciB7IGJhY2tncm91bmQtY29sb3I6ICMxQzk5NjMgfVxuICAvLyB9XG59XG5cbi8vIGlmIGhhcyBtb2RhbFxuXG5ib2R5Lmhhcy1tb2RhbCB7XG4gIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgLm1vZGFsIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHZpc2liaWxpdHk6IHZpc2libGU7XG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAuM3MgZWFzZTtcblxuICAgICYtaW5uZXIge1xuICAgICAgb3BhY2l0eTogMTtcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjhzIGN1YmljLWJlemllciguMjYsIC42MywgMCwgLjk2KTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIEluc3RhZ3JhbSBGZWRkXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLmluc3RhZ3JhbSB7XG4gICYtaG92ZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgLjMpO1xuICAgIC8vIHRyYW5zaXRpb246IG9wYWNpdHkgMXMgZWFzZS1pbi1vdXQ7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxuXG4gICYtaW1nIHtcbiAgICBoZWlnaHQ6IDI2NHB4O1xuXG4gICAgJjpob3ZlciA+IC5pbnN0YWdyYW0taG92ZXIgeyBvcGFjaXR5OiAxIH1cbiAgfVxuXG4gICYtbmFtZSB7XG4gICAgbGVmdDogNTAlO1xuICAgIHRvcDogNTAlO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICAgIHotaW5kZXg6IDM7XG5cbiAgICBhIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gICAgICBjb2xvcjogIzAwMCAhaW1wb3J0YW50O1xuICAgICAgZm9udC1zaXplOiAxOHB4ICFpbXBvcnRhbnQ7XG4gICAgICBmb250LXdlaWdodDogOTAwICFpbXBvcnRhbnQ7XG4gICAgICBtaW4td2lkdGg6IDIwMHB4O1xuICAgICAgcGFkZGluZy1sZWZ0OiAxMHB4ICFpbXBvcnRhbnQ7XG4gICAgICBwYWRkaW5nLXJpZ2h0OiAxMHB4ICFpbXBvcnRhbnQ7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXIgIWltcG9ydGFudDtcbiAgICB9XG4gIH1cblxuICAmLWNvbCB7XG4gICAgcGFkZGluZzogMCAhaW1wb3J0YW50O1xuICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICB9XG5cbiAgJi13cmFwIHsgbWFyZ2luOiAwICFpbXBvcnRhbnQgfVxufVxuXG4vLyBOZXdzbGV0dGVyIFNpZGViYXJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4ud2l0Z2V0LXN1YnNjcmliZSB7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIGJvcmRlcjogNXB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBwYWRkaW5nOiAyOHB4IDMwcHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAmOjpiZWZvcmUge1xuICAgIGNvbnRlbnQ6IFwiXCI7XG4gICAgYm9yZGVyOiA1cHggc29saWQgI2Y1ZjVmNTtcbiAgICBib3gtc2hhZG93OiBpbnNldCAwIDAgMCAxcHggI2Q3ZDdkNztcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGhlaWdodDogY2FsYygxMDAlICsgMTBweCk7XG4gICAgbGVmdDogLTVweDtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAtNXB4O1xuICAgIHdpZHRoOiBjYWxjKDEwMCUgKyAxMHB4KTtcbiAgICB6LWluZGV4OiAxO1xuICB9XG5cbiAgaW5wdXQge1xuICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgYm9yZGVyOiAxcHggc29saWQgI2U1ZTVlNTtcbiAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNTQpO1xuICAgIGhlaWdodDogNDFweDtcbiAgICBvdXRsaW5lOiAwO1xuICAgIHBhZGRpbmc6IDAgMTZweDtcbiAgICB3aWR0aDogMTAwJTtcbiAgfVxuXG4gIGJ1dHRvbiB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tY29tcG9zaXRlLWNvbG9yKTtcbiAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQ0FBLDRFQUE0RTtBQUU1RTtnRkFDZ0Y7QUFFaEY7OztHQUdHOztBQUVILEFBQUEsSUFBSSxDQUFDO0VBQ0gsV0FBVyxFQUFFLElBQUk7RUFBRSxPQUFPO0VBQzFCLHdCQUF3QixFQUFFLElBQUk7RUFBRSxPQUFPLEVBQ3hDOztBQUVEO2dGQUNnRjtBQUVoRjs7R0FFRzs7QUFFSCxBQUFBLElBQUksQ0FBQztFQUNILE1BQU0sRUFBRSxDQUFDLEdBQ1Y7O0FBRUQ7OztHQUdHOztBQUVILEFBQUEsRUFBRSxDQUFDO0VBQ0QsU0FBUyxFQUFFLEdBQUc7RUFDZCxNQUFNLEVBQUUsUUFBUSxHQUNqQjs7QUFFRDtnRkFDZ0Y7QUFFaEY7OztHQUdHOztBQUVILEFBQUEsRUFBRSxDQUFDO0VBQ0QsVUFBVSxFQUFFLFdBQVc7RUFBRSxPQUFPO0VBQ2hDLE1BQU0sRUFBRSxDQUFDO0VBQUUsT0FBTztFQUNsQixRQUFRLEVBQUUsT0FBTztFQUFFLE9BQU8sRUFDM0I7O0FBRUQ7OztHQUdHOztBQUVI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Q3BCOztJQTFESCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsUUFBdUM7TUFJNUMsU0FBUyxFQUpKLFFBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsU0FBdUM7TUFJNUMsU0FBUyxFQUpKLFNBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsR0FBdUM7TUFJNUMsU0FBUyxFQUpKLEdBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsU0FBdUM7TUFJNUMsU0FBUyxFQUpKLFNBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsU0FBdUM7TUFJNUMsU0FBUyxFQUpKLFNBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsR0FBdUM7TUFJNUMsU0FBUyxFQUpKLEdBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsU0FBdUM7TUFJNUMsU0FBUyxFQUpKLFNBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsU0FBdUM7TUFJNUMsU0FBUyxFQUpKLFNBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsR0FBdUM7TUFJNUMsU0FBUyxFQUpKLEdBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxJQUFJLENBQUk7TUFDUCxVQUFVLEVBSEws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 */","/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n  display: none;\n}\n","@charset \"UTF-8\";\n\n/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n/* line 11, node_modules/normalize.css/normalize.css */\n\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\n/* line 23, node_modules/normalize.css/normalize.css */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\n/* line 32, node_modules/normalize.css/normalize.css */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\n/* line 45, node_modules/normalize.css/normalize.css */\n\nhr {\n  box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 56, node_modules/normalize.css/normalize.css */\n\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\n/* line 68, node_modules/normalize.css/normalize.css */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\n/* line 77, node_modules/normalize.css/normalize.css */\n\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  text-decoration: underline dotted;\n  /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\n/* line 87, node_modules/normalize.css/normalize.css */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 97, node_modules/normalize.css/normalize.css */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\n/* line 108, node_modules/normalize.css/normalize.css */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\n/* line 117, node_modules/normalize.css/normalize.css */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\n/* line 125, node_modules/normalize.css/normalize.css */\n\nsub {\n  bottom: -0.25em;\n}\n\n/* line 129, node_modules/normalize.css/normalize.css */\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\n/* line 140, node_modules/normalize.css/normalize.css */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\n/* line 152, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\n/* line 168, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput {\n  /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\n/* line 178, node_modules/normalize.css/normalize.css */\n\nbutton,\nselect {\n  /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\n/* line 187, node_modules/normalize.css/normalize.css */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\n/* line 198, node_modules/normalize.css/normalize.css */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\n/* line 210, node_modules/normalize.css/normalize.css */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\n/* line 221, node_modules/normalize.css/normalize.css */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\n/* line 232, node_modules/normalize.css/normalize.css */\n\nlegend {\n  box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\n/* line 245, node_modules/normalize.css/normalize.css */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\n/* line 253, node_modules/normalize.css/normalize.css */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n/* line 262, node_modules/normalize.css/normalize.css */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n/* line 272, node_modules/normalize.css/normalize.css */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n/* line 282, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n/* line 291, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n/* line 300, node_modules/normalize.css/normalize.css */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\n/* line 312, node_modules/normalize.css/normalize.css */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\n/* line 320, node_modules/normalize.css/normalize.css */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\n/* line 331, node_modules/normalize.css/normalize.css */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n/* line 339, node_modules/normalize.css/normalize.css */\n\n[hidden] {\n  display: none;\n}\n\n/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\n/* line 7, node_modules/prismjs/themes/prism.css */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: black;\n  background: none;\n  text-shadow: 0 1px white;\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -moz-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none;\n}\n\n/* line 30, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"]::-moz-selection,\npre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection,\ncode[class*=\"language-\"] ::-moz-selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n\n/* line 36, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"]::selection,\npre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection,\ncode[class*=\"language-\"] ::selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n\n@media print {\n  /* line 43, node_modules/prismjs/themes/prism.css */\n\n  code[class*=\"language-\"],\n  pre[class*=\"language-\"] {\n    text-shadow: none;\n  }\n}\n\n/* Code blocks */\n\n/* line 50, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"] {\n  padding: 1em;\n  margin: .5em 0;\n  overflow: auto;\n}\n\n/* line 56, node_modules/prismjs/themes/prism.css */\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n  background: #f5f2f0;\n}\n\n/* Inline code */\n\n/* line 62, node_modules/prismjs/themes/prism.css */\n\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em;\n  border-radius: .3em;\n  white-space: normal;\n}\n\n/* line 68, node_modules/prismjs/themes/prism.css */\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: slategray;\n}\n\n/* line 75, node_modules/prismjs/themes/prism.css */\n\n.token.punctuation {\n  color: #999;\n}\n\n/* line 79, node_modules/prismjs/themes/prism.css */\n\n.namespace {\n  opacity: .7;\n}\n\n/* line 83, node_modules/prismjs/themes/prism.css */\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #905;\n}\n\n/* line 93, node_modules/prismjs/themes/prism.css */\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n  color: #690;\n}\n\n/* line 102, node_modules/prismjs/themes/prism.css */\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n  color: #9a6e3a;\n  background: rgba(255, 255, 255, 0.5);\n}\n\n/* line 111, node_modules/prismjs/themes/prism.css */\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #07a;\n}\n\n/* line 117, node_modules/prismjs/themes/prism.css */\n\n.token.function,\n.token.class-name {\n  color: #DD4A68;\n}\n\n/* line 122, node_modules/prismjs/themes/prism.css */\n\n.token.regex,\n.token.important,\n.token.variable {\n  color: #e90;\n}\n\n/* line 128, node_modules/prismjs/themes/prism.css */\n\n.token.important,\n.token.bold {\n  font-weight: bold;\n}\n\n/* line 132, node_modules/prismjs/themes/prism.css */\n\n.token.italic {\n  font-style: italic;\n}\n\n/* line 136, node_modules/prismjs/themes/prism.css */\n\n.token.entity {\n  cursor: help;\n}\n\n/* line 1, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\npre[class*=\"language-\"].line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber;\n}\n\n/* line 7, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\npre[class*=\"language-\"].line-numbers > code {\n  position: relative;\n  white-space: inherit;\n}\n\n/* line 12, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n/* line 29, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber;\n}\n\n/* line 35, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right;\n}\n\n/* line 1, src/styles/common/_mixins.scss */\n\n.link {\n  color: inherit;\n  cursor: pointer;\n  text-decoration: none;\n}\n\n/* line 7, src/styles/common/_mixins.scss */\n\n.link--accent {\n  color: var(--primary-color);\n  text-decoration: none;\n}\n\n/* line 22, src/styles/common/_mixins.scss */\n\n.u-absolute0 {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n/* line 30, src/styles/common/_mixins.scss */\n\n.u-textColorDarker {\n  color: rgba(0, 0, 0, 0.8) !important;\n  fill: rgba(0, 0, 0, 0.8) !important;\n}\n\n/* line 35, src/styles/common/_mixins.scss */\n\n.warning::before,\n.note::before,\n.success::before,\n[class^=\"i-\"]::before,\n[class*=\" i-\"]::before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  /* stylelint-disable-line */\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* line 2, src/styles/autoload/_zoom.scss */\n\nimg[data-action=\"zoom\"] {\n  cursor: zoom-in;\n}\n\n/* line 5, src/styles/autoload/_zoom.scss */\n\n.zoom-img,\n.zoom-img-wrap {\n  position: relative;\n  z-index: 666;\n  -webkit-transition: all 300ms;\n  -o-transition: all 300ms;\n  transition: all 300ms;\n}\n\n/* line 13, src/styles/autoload/_zoom.scss */\n\nimg.zoom-img {\n  cursor: pointer;\n  cursor: -webkit-zoom-out;\n  cursor: -moz-zoom-out;\n}\n\n/* line 18, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay {\n  z-index: 420;\n  background: #fff;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  pointer-events: none;\n  filter: \"alpha(opacity=0)\";\n  opacity: 0;\n  -webkit-transition: opacity 300ms;\n  -o-transition: opacity 300ms;\n  transition: opacity 300ms;\n}\n\n/* line 33, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay-open .zoom-overlay {\n  filter: \"alpha(opacity=100)\";\n  opacity: 1;\n}\n\n/* line 37, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay-open,\n.zoom-overlay-transitioning {\n  cursor: default;\n}\n\n/* line 1, src/styles/common/_global.scss */\n\n:root {\n  --black: #000;\n  --white: #fff;\n  --primary-color: #1C9963;\n  --secondary-color: #2ad88d;\n  --header-color: #BBF1B9;\n  --header-color-hover: #EEFFEA;\n  --post-color-link: #2ad88d;\n  --story-cover-category-color: #2ad88d;\n  --composite-color: #CC116E;\n  --footer-color-link: #2ad88d;\n  --media-type-color: #2ad88d;\n}\n\n/* line 15, src/styles/common/_global.scss */\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n/* line 19, src/styles/common/_global.scss */\n\na {\n  color: inherit;\n  text-decoration: none;\n}\n\n/* line 23, src/styles/common/_global.scss */\n\na:active,\na:hover {\n  outline: 0;\n}\n\n/* line 29, src/styles/common/_global.scss */\n\nblockquote {\n  border-left: 3px solid #000;\n  color: #000;\n  font-family: \"Merriweather\", serif;\n  font-size: 1.1875rem;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin: 30px 0 0 -12px;\n  padding-bottom: 2px;\n  padding-left: 20px;\n}\n\n/* line 42, src/styles/common/_global.scss */\n\nblockquote p:first-of-type {\n  margin-top: 0;\n}\n\n/* line 45, src/styles/common/_global.scss */\n\nbody {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Ruda\", sans-serif;\n  font-size: 16px;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin: 0 auto;\n  text-rendering: optimizeLegibility;\n  overflow-x: hidden;\n}\n\n/* line 59, src/styles/common/_global.scss */\n\nhtml {\n  box-sizing: border-box;\n  font-size: 16px;\n}\n\n/* line 64, src/styles/common/_global.scss */\n\nfigure {\n  margin: 0;\n}\n\n/* line 68, src/styles/common/_global.scss */\n\nfigcaption {\n  color: rgba(0, 0, 0, 0.68);\n  display: block;\n  font-family: \"Merriweather\", serif;\n  font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%;\n}\n\n/* line 89, src/styles/common/_global.scss */\n\nkbd,\nsamp,\ncode {\n  background: #f7f7f7;\n  border-radius: 4px;\n  color: #c7254e;\n  font-family: \"Fira Mono\", monospace !important;\n  font-size: 15px;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\n/* line 99, src/styles/common/_global.scss */\n\npre {\n  background-color: #f7f7f7 !important;\n  border-radius: 4px;\n  font-family: \"Fira Mono\", monospace !important;\n  font-size: 15px;\n  margin-top: 30px !important;\n  max-width: 100%;\n  overflow: hidden;\n  padding: 1rem;\n  position: relative;\n  word-wrap: normal;\n}\n\n/* line 111, src/styles/common/_global.scss */\n\npre code {\n  background: transparent;\n  color: #37474f;\n  padding: 0;\n  text-shadow: 0 1px #fff;\n}\n\n/* line 119, src/styles/common/_global.scss */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: #37474f;\n  line-height: 1.4;\n}\n\n/* line 124, src/styles/common/_global.scss */\n\ncode[class*=language-] .token.comment,\npre[class*=language-] .token.comment {\n  opacity: .8;\n}\n\n/* line 126, src/styles/common/_global.scss */\n\ncode[class*=language-].line-numbers,\npre[class*=language-].line-numbers {\n  padding-left: 58px;\n}\n\n/* line 129, src/styles/common/_global.scss */\n\ncode[class*=language-].line-numbers::before,\npre[class*=language-].line-numbers::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  background: #F0EDEE;\n  width: 40px;\n  height: 100%;\n}\n\n/* line 140, src/styles/common/_global.scss */\n\ncode[class*=language-] .line-numbers-rows,\npre[class*=language-] .line-numbers-rows {\n  border-right: none;\n  top: -3px;\n  left: -58px;\n}\n\n/* line 145, src/styles/common/_global.scss */\n\ncode[class*=language-] .line-numbers-rows > span::before,\npre[class*=language-] .line-numbers-rows > span::before {\n  padding-right: 0;\n  text-align: center;\n  opacity: .8;\n}\n\n/* line 155, src/styles/common/_global.scss */\n\nhr:not(.hr-list):not(.post-footer-hr) {\n  border: 0;\n  display: block;\n  margin: 50px auto;\n  text-align: center;\n}\n\n/* line 161, src/styles/common/_global.scss */\n\nhr:not(.hr-list):not(.post-footer-hr)::before {\n  color: rgba(0, 0, 0, 0.6);\n  content: '...';\n  display: inline-block;\n  font-family: \"Ruda\", sans-serif;\n  font-size: 28px;\n  font-weight: 400;\n  letter-spacing: .6em;\n  position: relative;\n  top: -25px;\n}\n\n/* line 174, src/styles/common/_global.scss */\n\n.post-footer-hr {\n  height: 1px;\n  margin: 32px 0;\n  border: 0;\n  background-color: #ddd;\n}\n\n/* line 181, src/styles/common/_global.scss */\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n}\n\n/* line 187, src/styles/common/_global.scss */\n\nimg:not([src]) {\n  visibility: hidden;\n}\n\n/* line 192, src/styles/common/_global.scss */\n\ni {\n  vertical-align: middle;\n}\n\n/* line 197, src/styles/common/_global.scss */\n\ninput {\n  border: none;\n  outline: 0;\n}\n\n/* line 202, src/styles/common/_global.scss */\n\nol,\nul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0;\n}\n\n/* line 209, src/styles/common/_global.scss */\n\nmark {\n  background-color: transparent !important;\n  background-image: linear-gradient(to bottom, #d7fdd3, #d7fdd3);\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 215, src/styles/common/_global.scss */\n\nq {\n  color: rgba(0, 0, 0, 0.44);\n  display: block;\n  font-size: 28px;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.014em;\n  line-height: 1.48;\n  padding-left: 50px;\n  padding-top: 15px;\n  text-align: left;\n}\n\n/* line 227, src/styles/common/_global.scss */\n\nq::before,\nq::after {\n  display: none;\n}\n\n/* line 230, src/styles/common/_global.scss */\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n/* line 245, src/styles/common/_global.scss */\n\ntable th,\ntable td {\n  padding: 6px 13px;\n  border: 1px solid #dfe2e5;\n}\n\n/* line 251, src/styles/common/_global.scss */\n\ntable tr:nth-child(2n) {\n  background-color: #f6f8fa;\n}\n\n/* line 255, src/styles/common/_global.scss */\n\ntable th {\n  letter-spacing: 0.2px;\n  text-transform: uppercase;\n  font-weight: 600;\n}\n\n/* line 269, src/styles/common/_global.scss */\n\n.link--underline:active,\n.link--underline:focus,\n.link--underline:hover {\n  text-decoration: underline;\n}\n\n/* line 279, src/styles/common/_global.scss */\n\n.main {\n  margin-bottom: 4em;\n  min-height: 90vh;\n}\n\n/* line 281, src/styles/common/_global.scss */\n\n.main,\n.footer {\n  transition: transform .5s ease;\n}\n\n/* line 286, src/styles/common/_global.scss */\n\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n}\n\n/* line 289, src/styles/common/_global.scss */\n\n.warning::before {\n  content: \"\";\n}\n\n/* line 292, src/styles/common/_global.scss */\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n}\n\n/* line 295, src/styles/common/_global.scss */\n\n.note::before {\n  content: \"\";\n}\n\n/* line 298, src/styles/common/_global.scss */\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n}\n\n/* line 301, src/styles/common/_global.scss */\n\n.success::before {\n  color: #00bfa5;\n  content: \"\";\n}\n\n/* line 304, src/styles/common/_global.scss */\n\n.warning,\n.note,\n.success {\n  display: block;\n  font-size: 18px !important;\n  line-height: 1.58 !important;\n  margin-top: 28px;\n  padding: 12px 24px 12px 60px;\n}\n\n/* line 311, src/styles/common/_global.scss */\n\n.warning a,\n.note a,\n.success a {\n  color: inherit;\n  text-decoration: underline;\n}\n\n/* line 316, src/styles/common/_global.scss */\n\n.warning::before,\n.note::before,\n.success::before {\n  float: left;\n  font-size: 24px;\n  margin-left: -36px;\n  margin-top: -5px;\n}\n\n/* line 329, src/styles/common/_global.scss */\n\n.tag-description {\n  max-width: 500px;\n}\n\n/* line 330, src/styles/common/_global.scss */\n\n.tag.has--image {\n  min-height: 350px;\n}\n\n/* line 335, src/styles/common/_global.scss */\n\n.with-tooltip {\n  overflow: visible;\n  position: relative;\n}\n\n/* line 339, src/styles/common/_global.scss */\n\n.with-tooltip::after {\n  background: rgba(0, 0, 0, 0.85);\n  border-radius: 4px;\n  color: #fff;\n  content: attr(data-tooltip);\n  display: inline-block;\n  font-size: 12px;\n  font-weight: 600;\n  left: 50%;\n  line-height: 1.25;\n  min-width: 130px;\n  opacity: 0;\n  padding: 4px 8px;\n  pointer-events: none;\n  position: absolute;\n  text-align: center;\n  text-transform: none;\n  top: -30px;\n  will-change: opacity, transform;\n  z-index: 1;\n}\n\n/* line 361, src/styles/common/_global.scss */\n\n.with-tooltip:hover::after {\n  animation: tooltip .1s ease-out both;\n}\n\n/* line 368, src/styles/common/_global.scss */\n\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n}\n\n/* line 371, src/styles/common/_global.scss */\n\n.errorPage-link {\n  left: -5px;\n  padding: 24px 60px;\n  top: -6px;\n}\n\n/* line 377, src/styles/common/_global.scss */\n\n.errorPage-text {\n  margin-top: 60px;\n  white-space: pre-wrap;\n}\n\n/* line 382, src/styles/common/_global.scss */\n\n.errorPage-wrap {\n  color: rgba(0, 0, 0, 0.4);\n  padding: 7vw 4vw;\n}\n\n/* line 390, src/styles/common/_global.scss */\n\n.video-responsive {\n  display: block;\n  height: 0;\n  margin-top: 30px;\n  overflow: hidden;\n  padding: 0 0 56.25%;\n  position: relative;\n  width: 100%;\n}\n\n/* line 399, src/styles/common/_global.scss */\n\n.video-responsive iframe {\n  border: 0;\n  bottom: 0;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n/* line 409, src/styles/common/_global.scss */\n\n.video-responsive video {\n  border: 0;\n  bottom: 0;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n/* line 420, src/styles/common/_global.scss */\n\n.kg-embed-card .video-responsive {\n  margin-top: 0;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-facebook {\n  color: #3b5998 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-facebook,\n.sideNav-follow .i-facebook {\n  background-color: #3b5998 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-twitter {\n  color: #55acee !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-twitter,\n.sideNav-follow .i-twitter {\n  background-color: #55acee !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-google {\n  color: #dd4b39 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-google,\n.sideNav-follow .i-google {\n  background-color: #dd4b39 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-instagram {\n  color: #306088 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-instagram,\n.sideNav-follow .i-instagram {\n  background-color: #306088 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-youtube {\n  color: #e52d27 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-youtube,\n.sideNav-follow .i-youtube {\n  background-color: #e52d27 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-github {\n  color: #555 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-github,\n.sideNav-follow .i-github {\n  background-color: #555 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-linkedin {\n  color: #007bb6 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-linkedin,\n.sideNav-follow .i-linkedin {\n  background-color: #007bb6 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-spotify {\n  color: #2ebd59 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-spotify,\n.sideNav-follow .i-spotify {\n  background-color: #2ebd59 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-codepen {\n  color: #222 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-codepen,\n.sideNav-follow .i-codepen {\n  background-color: #222 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-behance {\n  color: #131418 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-behance,\n.sideNav-follow .i-behance {\n  background-color: #131418 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-dribbble {\n  color: #ea4c89 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-dribbble,\n.sideNav-follow .i-dribbble {\n  background-color: #ea4c89 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-flickr {\n  color: #0063dc !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-flickr,\n.sideNav-follow .i-flickr {\n  background-color: #0063dc !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-reddit {\n  color: #ff4500 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-reddit,\n.sideNav-follow .i-reddit {\n  background-color: #ff4500 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-pocket {\n  color: #f50057 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-pocket,\n.sideNav-follow .i-pocket {\n  background-color: #f50057 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-pinterest {\n  color: #bd081c !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-pinterest,\n.sideNav-follow .i-pinterest {\n  background-color: #bd081c !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-whatsapp {\n  color: #64d448 !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-whatsapp,\n.sideNav-follow .i-whatsapp {\n  background-color: #64d448 !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-telegram {\n  color: #08c !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-telegram,\n.sideNav-follow .i-telegram {\n  background-color: #08c !important;\n}\n\n/* line 425, src/styles/common/_global.scss */\n\n.c-rss {\n  color: orange !important;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.bg-rss,\n.sideNav-follow .i-rss {\n  background-color: orange !important;\n}\n\n/* line 449, src/styles/common/_global.scss */\n\n.rocket {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  width: 60px;\n  z-index: 5;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.rocket:hover svg path {\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n/* line 462, src/styles/common/_global.scss */\n\n.svgIcon {\n  display: inline-block;\n}\n\n/* line 466, src/styles/common/_global.scss */\n\nsvg {\n  height: auto;\n  width: 100%;\n}\n\n/* line 474, src/styles/common/_global.scss */\n\n.load-more {\n  max-width: 70% !important;\n}\n\n/* line 479, src/styles/common/_global.scss */\n\n.loadingBar {\n  background-color: #48e79a;\n  display: none;\n  height: 2px;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  z-index: 800;\n}\n\n/* line 491, src/styles/common/_global.scss */\n\n.is-loading .loadingBar {\n  animation: loading-bar 1s ease-in-out infinite;\n  animation-delay: .8s;\n  display: block;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 500, src/styles/common/_global.scss */\n\n  blockquote {\n    margin-left: -5px;\n    font-size: 1.125rem;\n  }\n\n  /* line 502, src/styles/common/_global.scss */\n\n  .kg-image-card,\n  .kg-embed-card {\n    margin-right: -20px;\n    margin-left: -20px;\n  }\n}\n\n/* line 2, src/styles/components/_grid.scss */\n\n.extreme-container {\n  box-sizing: border-box;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding: 0 16px;\n  width: 100%;\n}\n\n/* line 25, src/styles/components/_grid.scss */\n\n.col-left,\n.cc-video-left {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%;\n  padding-right: 10px;\n  padding-left: 10px;\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 38, src/styles/components/_grid.scss */\n\n  .col-left {\n    max-width: calc(100% - 340px);\n  }\n\n  /* line 39, src/styles/components/_grid.scss */\n\n  .cc-video-left {\n    max-width: calc(100% - 320px);\n  }\n\n  /* line 40, src/styles/components/_grid.scss */\n\n  .cc-video-right {\n    flex-basis: 320px !important;\n    max-width: 320px !important;\n  }\n\n  /* line 41, src/styles/components/_grid.scss */\n\n  body.is-article .col-left {\n    padding-right: 40px;\n  }\n}\n\n/* line 44, src/styles/components/_grid.scss */\n\n.col-right {\n  display: flex;\n  flex-direction: column;\n  padding-left: 10px;\n  padding-right: 10px;\n  width: 320px;\n}\n\n/* line 52, src/styles/components/_grid.scss */\n\n.row {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  flex: 0 1 auto;\n  margin-left: -10px;\n  margin-right: -10px;\n}\n\n/* line 60, src/styles/components/_grid.scss */\n\n.row .col {\n  flex: 0 0 auto;\n  box-sizing: border-box;\n  padding-left: 10px;\n  padding-right: 10px;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s1 {\n  flex-basis: 8.33333%;\n  max-width: 8.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s2 {\n  flex-basis: 16.66667%;\n  max-width: 16.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s3 {\n  flex-basis: 25%;\n  max-width: 25%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s4 {\n  flex-basis: 33.33333%;\n  max-width: 33.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s5 {\n  flex-basis: 41.66667%;\n  max-width: 41.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s6 {\n  flex-basis: 50%;\n  max-width: 50%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s7 {\n  flex-basis: 58.33333%;\n  max-width: 58.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s8 {\n  flex-basis: 66.66667%;\n  max-width: 66.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s9 {\n  flex-basis: 75%;\n  max-width: 75%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s10 {\n  flex-basis: 83.33333%;\n  max-width: 83.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s11 {\n  flex-basis: 91.66667%;\n  max-width: 91.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s12 {\n  flex-basis: 100%;\n  max-width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m3 {\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m6 {\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m9 {\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m12 {\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l3 {\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l6 {\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l9 {\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l12 {\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n/* line 3, src/styles/common/_typography.scss */\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  color: inherit;\n  font-family: \"Ruda\", sans-serif;\n  font-weight: 600;\n  line-height: 1.1;\n  margin: 0;\n}\n\n/* line 10, src/styles/common/_typography.scss */\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  color: inherit;\n  line-height: inherit;\n}\n\n/* line 16, src/styles/common/_typography.scss */\n\nh1 {\n  font-size: 2rem;\n}\n\n/* line 17, src/styles/common/_typography.scss */\n\nh2 {\n  font-size: 1.875rem;\n}\n\n/* line 18, src/styles/common/_typography.scss */\n\nh3 {\n  font-size: 1.6rem;\n}\n\n/* line 19, src/styles/common/_typography.scss */\n\nh4 {\n  font-size: 1.4rem;\n}\n\n/* line 20, src/styles/common/_typography.scss */\n\nh5 {\n  font-size: 1.2rem;\n}\n\n/* line 21, src/styles/common/_typography.scss */\n\nh6 {\n  font-size: 1rem;\n}\n\n/* line 23, src/styles/common/_typography.scss */\n\np {\n  margin: 0;\n}\n\n/* line 2, src/styles/common/_utilities.scss */\n\n.u-textColorNormal {\n  color: #999999 !important;\n  fill: #999999 !important;\n}\n\n/* line 9, src/styles/common/_utilities.scss */\n\n.u-textColorWhite {\n  color: #fff !important;\n  fill: #fff !important;\n}\n\n/* line 14, src/styles/common/_utilities.scss */\n\n.u-hoverColorNormal:hover {\n  color: rgba(0, 0, 0, 0.6);\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n/* line 19, src/styles/common/_utilities.scss */\n\n.u-accentColor--iconNormal {\n  color: #1C9963;\n  fill: #1C9963;\n}\n\n/* line 25, src/styles/common/_utilities.scss */\n\n.u-bgColor {\n  background-color: var(--primary-color);\n}\n\n/* line 30, src/styles/common/_utilities.scss */\n\n.u-relative {\n  position: relative;\n}\n\n/* line 31, src/styles/common/_utilities.scss */\n\n.u-absolute {\n  position: absolute;\n}\n\n/* line 33, src/styles/common/_utilities.scss */\n\n.u-fixed {\n  position: fixed !important;\n}\n\n/* line 35, src/styles/common/_utilities.scss */\n\n.u-block {\n  display: block !important;\n}\n\n/* line 36, src/styles/common/_utilities.scss */\n\n.u-inlineBlock {\n  display: inline-block;\n}\n\n/* line 39, src/styles/common/_utilities.scss */\n\n.u-backgroundDark {\n  background-color: #0d0f10;\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n\n/* line 50, src/styles/common/_utilities.scss */\n\n.u-gradient {\n  background: linear-gradient(to bottom, transparent 20%, #000 100%);\n  bottom: 0;\n  height: 90%;\n  left: 0;\n  position: absolute;\n  right: 0;\n  z-index: 1;\n}\n\n/* line 61, src/styles/common/_utilities.scss */\n\n.zindex1 {\n  z-index: 1;\n}\n\n/* line 62, src/styles/common/_utilities.scss */\n\n.zindex2 {\n  z-index: 2;\n}\n\n/* line 63, src/styles/common/_utilities.scss */\n\n.zindex3 {\n  z-index: 3;\n}\n\n/* line 64, src/styles/common/_utilities.scss */\n\n.zindex4 {\n  z-index: 4;\n}\n\n/* line 67, src/styles/common/_utilities.scss */\n\n.u-backgroundWhite {\n  background-color: #fafafa;\n}\n\n/* line 68, src/styles/common/_utilities.scss */\n\n.u-backgroundColorGrayLight {\n  background-color: #f0f0f0 !important;\n}\n\n/* line 71, src/styles/common/_utilities.scss */\n\n.u-clear::after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n/* line 78, src/styles/common/_utilities.scss */\n\n.u-fontSizeMicro {\n  font-size: 11px;\n}\n\n/* line 79, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmallest {\n  font-size: 12px;\n}\n\n/* line 80, src/styles/common/_utilities.scss */\n\n.u-fontSize13 {\n  font-size: 13px;\n}\n\n/* line 81, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmaller {\n  font-size: 14px;\n}\n\n/* line 82, src/styles/common/_utilities.scss */\n\n.u-fontSize15 {\n  font-size: 15px;\n}\n\n/* line 83, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmall {\n  font-size: 16px;\n}\n\n/* line 84, src/styles/common/_utilities.scss */\n\n.u-fontSizeBase {\n  font-size: 18px;\n}\n\n/* line 85, src/styles/common/_utilities.scss */\n\n.u-fontSize20 {\n  font-size: 20px;\n}\n\n/* line 86, src/styles/common/_utilities.scss */\n\n.u-fontSize21 {\n  font-size: 21px;\n}\n\n/* line 87, src/styles/common/_utilities.scss */\n\n.u-fontSize22 {\n  font-size: 22px;\n}\n\n/* line 88, src/styles/common/_utilities.scss */\n\n.u-fontSizeLarge {\n  font-size: 24px;\n}\n\n/* line 89, src/styles/common/_utilities.scss */\n\n.u-fontSize26 {\n  font-size: 26px;\n}\n\n/* line 90, src/styles/common/_utilities.scss */\n\n.u-fontSize28 {\n  font-size: 28px;\n}\n\n/* line 91, src/styles/common/_utilities.scss */\n\n.u-fontSizeLarger,\n.media-type {\n  font-size: 32px;\n}\n\n/* line 92, src/styles/common/_utilities.scss */\n\n.u-fontSize36 {\n  font-size: 36px;\n}\n\n/* line 93, src/styles/common/_utilities.scss */\n\n.u-fontSize40 {\n  font-size: 40px;\n}\n\n/* line 94, src/styles/common/_utilities.scss */\n\n.u-fontSizeLargest {\n  font-size: 44px;\n}\n\n/* line 95, src/styles/common/_utilities.scss */\n\n.u-fontSizeJumbo {\n  font-size: 50px;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 98, src/styles/common/_utilities.scss */\n\n  .u-md-fontSizeBase {\n    font-size: 18px;\n  }\n\n  /* line 99, src/styles/common/_utilities.scss */\n\n  .u-md-fontSize22 {\n    font-size: 22px;\n  }\n\n  /* line 100, src/styles/common/_utilities.scss */\n\n  .u-md-fontSizeLarger {\n    font-size: 32px;\n  }\n}\n\n/* line 116, src/styles/common/_utilities.scss */\n\n.u-fontWeightThin {\n  font-weight: 300;\n}\n\n/* line 117, src/styles/common/_utilities.scss */\n\n.u-fontWeightNormal {\n  font-weight: 400;\n}\n\n/* line 119, src/styles/common/_utilities.scss */\n\n.u-fontWeightSemibold {\n  font-weight: 600 !important;\n}\n\n/* line 120, src/styles/common/_utilities.scss */\n\n.u-fontWeightBold {\n  font-weight: 700;\n}\n\n/* line 121, src/styles/common/_utilities.scss */\n\n.u-fontWeightBolder {\n  font-weight: 900;\n}\n\n/* line 123, src/styles/common/_utilities.scss */\n\n.u-textUppercase {\n  text-transform: uppercase;\n}\n\n/* line 124, src/styles/common/_utilities.scss */\n\n.u-textCapitalize {\n  text-transform: capitalize;\n}\n\n/* line 125, src/styles/common/_utilities.scss */\n\n.u-textAlignCenter {\n  text-align: center;\n}\n\n/* line 127, src/styles/common/_utilities.scss */\n\n.u-noWrapWithEllipsis {\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important;\n}\n\n/* line 134, src/styles/common/_utilities.scss */\n\n.u-marginAuto {\n  margin-left: auto;\n  margin-right: auto;\n}\n\n/* line 135, src/styles/common/_utilities.scss */\n\n.u-marginTop20 {\n  margin-top: 20px;\n}\n\n/* line 136, src/styles/common/_utilities.scss */\n\n.u-marginTop30 {\n  margin-top: 30px;\n}\n\n/* line 137, src/styles/common/_utilities.scss */\n\n.u-marginBottom10 {\n  margin-bottom: 10px;\n}\n\n/* line 138, src/styles/common/_utilities.scss */\n\n.u-marginBottom15 {\n  margin-bottom: 15px;\n}\n\n/* line 139, src/styles/common/_utilities.scss */\n\n.u-marginBottom20 {\n  margin-bottom: 20px !important;\n}\n\n/* line 140, src/styles/common/_utilities.scss */\n\n.u-marginBottom30 {\n  margin-bottom: 30px;\n}\n\n/* line 141, src/styles/common/_utilities.scss */\n\n.u-marginBottom40 {\n  margin-bottom: 40px;\n}\n\n/* line 144, src/styles/common/_utilities.scss */\n\n.u-padding0 {\n  padding: 0 !important;\n}\n\n/* line 145, src/styles/common/_utilities.scss */\n\n.u-padding20 {\n  padding: 20px;\n}\n\n/* line 146, src/styles/common/_utilities.scss */\n\n.u-padding15 {\n  padding: 15px !important;\n}\n\n/* line 147, src/styles/common/_utilities.scss */\n\n.u-paddingBottom2 {\n  padding-bottom: 2px;\n}\n\n/* line 148, src/styles/common/_utilities.scss */\n\n.u-paddingBottom30 {\n  padding-bottom: 30px;\n}\n\n/* line 149, src/styles/common/_utilities.scss */\n\n.u-paddingBottom20 {\n  padding-bottom: 20px;\n}\n\n/* line 150, src/styles/common/_utilities.scss */\n\n.u-paddingRight10 {\n  padding-right: 10px;\n}\n\n/* line 151, src/styles/common/_utilities.scss */\n\n.u-paddingLeft15 {\n  padding-left: 15px;\n}\n\n/* line 153, src/styles/common/_utilities.scss */\n\n.u-paddingTop2 {\n  padding-top: 2px;\n}\n\n/* line 154, src/styles/common/_utilities.scss */\n\n.u-paddingTop5 {\n  padding-top: 5px;\n}\n\n/* line 155, src/styles/common/_utilities.scss */\n\n.u-paddingTop10 {\n  padding-top: 10px;\n}\n\n/* line 156, src/styles/common/_utilities.scss */\n\n.u-paddingTop15 {\n  padding-top: 15px;\n}\n\n/* line 157, src/styles/common/_utilities.scss */\n\n.u-paddingTop20 {\n  padding-top: 20px;\n}\n\n/* line 158, src/styles/common/_utilities.scss */\n\n.u-paddingTop30 {\n  padding-top: 30px;\n}\n\n/* line 160, src/styles/common/_utilities.scss */\n\n.u-paddingBottom15 {\n  padding-bottom: 15px;\n}\n\n/* line 162, src/styles/common/_utilities.scss */\n\n.u-paddingRight20 {\n  padding-right: 20px;\n}\n\n/* line 163, src/styles/common/_utilities.scss */\n\n.u-paddingLeft20 {\n  padding-left: 20px;\n}\n\n/* line 165, src/styles/common/_utilities.scss */\n\n.u-contentTitle {\n  font-family: \"Ruda\", sans-serif;\n  font-style: normal;\n  font-weight: 900;\n  letter-spacing: -.028em;\n}\n\n/* line 173, src/styles/common/_utilities.scss */\n\n.u-lineHeight1 {\n  line-height: 1;\n}\n\n/* line 174, src/styles/common/_utilities.scss */\n\n.u-lineHeightTight {\n  line-height: 1.2;\n}\n\n/* line 177, src/styles/common/_utilities.scss */\n\n.u-overflowHidden {\n  overflow: hidden;\n}\n\n/* line 180, src/styles/common/_utilities.scss */\n\n.u-floatRight {\n  float: right;\n}\n\n/* line 181, src/styles/common/_utilities.scss */\n\n.u-floatLeft {\n  float: left;\n}\n\n/* line 184, src/styles/common/_utilities.scss */\n\n.u-flex {\n  display: flex;\n}\n\n/* line 185, src/styles/common/_utilities.scss */\n\n.u-flexCenter,\n.media-type {\n  align-items: center;\n  display: flex;\n}\n\n/* line 186, src/styles/common/_utilities.scss */\n\n.u-flexContentCenter,\n.media-type {\n  justify-content: center;\n}\n\n/* line 188, src/styles/common/_utilities.scss */\n\n.u-flex1 {\n  flex: 1 1 auto;\n}\n\n/* line 189, src/styles/common/_utilities.scss */\n\n.u-flex0 {\n  flex: 0 0 auto;\n}\n\n/* line 190, src/styles/common/_utilities.scss */\n\n.u-flexWrap {\n  flex-wrap: wrap;\n}\n\n/* line 192, src/styles/common/_utilities.scss */\n\n.u-flexColumn {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n/* line 198, src/styles/common/_utilities.scss */\n\n.u-flexEnd {\n  align-items: center;\n  justify-content: flex-end;\n}\n\n/* line 203, src/styles/common/_utilities.scss */\n\n.u-flexColumnTop {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n}\n\n/* line 210, src/styles/common/_utilities.scss */\n\n.u-backgroundSizeCover {\n  background-origin: border-box;\n  background-position: center;\n  background-size: cover;\n}\n\n/* line 217, src/styles/common/_utilities.scss */\n\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 20px;\n  padding-right: 20px;\n}\n\n/* line 224, src/styles/common/_utilities.scss */\n\n.u-maxWidth1200 {\n  max-width: 1200px;\n}\n\n/* line 225, src/styles/common/_utilities.scss */\n\n.u-maxWidth1000 {\n  max-width: 1000px;\n}\n\n/* line 226, src/styles/common/_utilities.scss */\n\n.u-maxWidth740 {\n  max-width: 740px;\n}\n\n/* line 227, src/styles/common/_utilities.scss */\n\n.u-maxWidth1040 {\n  max-width: 1040px;\n}\n\n/* line 228, src/styles/common/_utilities.scss */\n\n.u-sizeFullWidth {\n  width: 100%;\n}\n\n/* line 229, src/styles/common/_utilities.scss */\n\n.u-sizeFullHeight {\n  height: 100%;\n}\n\n/* line 232, src/styles/common/_utilities.scss */\n\n.u-borderLighter {\n  border: 1px solid rgba(0, 0, 0, 0.15);\n}\n\n/* line 233, src/styles/common/_utilities.scss */\n\n.u-round,\n.avatar-image,\n.media-type {\n  border-radius: 50%;\n}\n\n/* line 234, src/styles/common/_utilities.scss */\n\n.u-borderRadius2 {\n  border-radius: 2px;\n}\n\n/* line 236, src/styles/common/_utilities.scss */\n\n.u-boxShadowBottom {\n  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.05);\n}\n\n/* line 241, src/styles/common/_utilities.scss */\n\n.u-height540 {\n  height: 540px;\n}\n\n/* line 242, src/styles/common/_utilities.scss */\n\n.u-height280 {\n  height: 280px;\n}\n\n/* line 243, src/styles/common/_utilities.scss */\n\n.u-height260 {\n  height: 260px;\n}\n\n/* line 244, src/styles/common/_utilities.scss */\n\n.u-height100 {\n  height: 100px;\n}\n\n/* line 245, src/styles/common/_utilities.scss */\n\n.u-borderBlackLightest {\n  border: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n/* line 248, src/styles/common/_utilities.scss */\n\n.u-hide {\n  display: none !important;\n}\n\n/* line 251, src/styles/common/_utilities.scss */\n\n.u-card {\n  background: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.09);\n  border-radius: 3px;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  margin-bottom: 10px;\n  padding: 10px 20px 15px;\n}\n\n/* line 262, src/styles/common/_utilities.scss */\n\n.title-line {\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n/* line 267, src/styles/common/_utilities.scss */\n\n.title-line::before {\n  content: '';\n  background: rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  position: absolute;\n  left: 0;\n  bottom: 50%;\n  width: 100%;\n  height: 1px;\n  z-index: 0;\n}\n\n/* line 281, src/styles/common/_utilities.scss */\n\n.u-oblique {\n  background-color: var(--composite-color);\n  color: #fff;\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 700;\n  line-height: 1;\n  padding: 5px 13px;\n  text-transform: uppercase;\n  transform: skewX(-15deg);\n}\n\n/* line 293, src/styles/common/_utilities.scss */\n\n.no-avatar {\n  background-image: url(\"./../images/avatar.png\") !important;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 298, src/styles/common/_utilities.scss */\n\n  .u-hide-before-md {\n    display: none !important;\n  }\n\n  /* line 299, src/styles/common/_utilities.scss */\n\n  .u-md-heightAuto {\n    height: auto;\n  }\n\n  /* line 300, src/styles/common/_utilities.scss */\n\n  .u-md-height170 {\n    height: 170px;\n  }\n\n  /* line 301, src/styles/common/_utilities.scss */\n\n  .u-md-relative {\n    position: relative;\n  }\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 304, src/styles/common/_utilities.scss */\n\n  .u-hide-before-lg {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 307, src/styles/common/_utilities.scss */\n\n  .u-hide-after-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 309, src/styles/common/_utilities.scss */\n\n  .u-hide-after-lg {\n    display: none !important;\n  }\n}\n\n/* line 1, src/styles/components/_form.scss */\n\n.button {\n  background: transparent;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  box-sizing: border-box;\n  color: rgba(0, 0, 0, 0.44);\n  cursor: pointer;\n  display: inline-block;\n  font-family: \"Ruda\", sans-serif;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  height: 37px;\n  letter-spacing: 0;\n  line-height: 35px;\n  padding: 0 16px;\n  position: relative;\n  text-align: center;\n  text-decoration: none;\n  text-rendering: optimizeLegibility;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n/* line 25, src/styles/components/_form.scss */\n\n.button--chromeless {\n  border-radius: 0;\n  border-width: 0;\n  box-shadow: none;\n  color: rgba(0, 0, 0, 0.44);\n  height: auto;\n  line-height: inherit;\n  padding: 0;\n  text-align: left;\n  vertical-align: baseline;\n  white-space: normal;\n}\n\n/* line 37, src/styles/components/_form.scss */\n\n.button--chromeless:active,\n.button--chromeless:hover,\n.button--chromeless:focus {\n  border-width: 0;\n  color: rgba(0, 0, 0, 0.6);\n}\n\n/* line 45, src/styles/components/_form.scss */\n\n.button--large {\n  font-size: 15px;\n  height: 44px;\n  line-height: 42px;\n  padding: 0 18px;\n}\n\n/* line 52, src/styles/components/_form.scss */\n\n.button--dark {\n  background: rgba(0, 0, 0, 0.84);\n  border-color: rgba(0, 0, 0, 0.84);\n  color: rgba(255, 255, 255, 0.97);\n}\n\n/* line 57, src/styles/components/_form.scss */\n\n.button--dark:hover {\n  background: #1C9963;\n  border-color: #1C9963;\n}\n\n/* line 65, src/styles/components/_form.scss */\n\n.button--primary {\n  border-color: #1C9963;\n  color: #1C9963;\n}\n\n/* line 70, src/styles/components/_form.scss */\n\n.button--large.button--chromeless,\n.button--large.button--link {\n  padding: 0;\n}\n\n/* line 76, src/styles/components/_form.scss */\n\n.buttonSet > .button {\n  margin-right: 8px;\n  vertical-align: middle;\n}\n\n/* line 81, src/styles/components/_form.scss */\n\n.buttonSet > .button:last-child {\n  margin-right: 0;\n}\n\n/* line 85, src/styles/components/_form.scss */\n\n.buttonSet .button--chromeless {\n  height: 37px;\n  line-height: 35px;\n}\n\n/* line 90, src/styles/components/_form.scss */\n\n.buttonSet .button--large.button--chromeless,\n.buttonSet .button--large.button--link {\n  height: 44px;\n  line-height: 42px;\n}\n\n/* line 96, src/styles/components/_form.scss */\n\n.buttonSet > .button--chromeless:not(.button--circle) {\n  margin-right: 0;\n  padding-right: 8px;\n}\n\n/* line 101, src/styles/components/_form.scss */\n\n.buttonSet > .button--chromeless:last-child {\n  padding-right: 0;\n}\n\n/* line 105, src/styles/components/_form.scss */\n\n.buttonSet > .button--chromeless + .button--chromeless:not(.button--circle) {\n  margin-left: 0;\n  padding-left: 8px;\n}\n\n/* line 111, src/styles/components/_form.scss */\n\n.button--circle {\n  background-image: none !important;\n  border-radius: 50%;\n  color: #fff;\n  height: 40px;\n  line-height: 38px;\n  padding: 0;\n  text-decoration: none;\n  width: 40px;\n}\n\n/* line 124, src/styles/components/_form.scss */\n\n.tag-button {\n  background: rgba(0, 0, 0, 0.05);\n  border: none;\n  color: rgba(0, 0, 0, 0.68);\n  font-weight: 700;\n  margin: 0 8px 8px 0;\n}\n\n/* line 131, src/styles/components/_form.scss */\n\n.tag-button:hover {\n  background: rgba(0, 0, 0, 0.1);\n  color: rgba(0, 0, 0, 0.68);\n}\n\n/* line 139, src/styles/components/_form.scss */\n\n.button--dark-line {\n  border: 1px solid #000;\n  color: #000;\n  display: block;\n  font-weight: 600;\n  margin: 50px auto 0;\n  max-width: 300px;\n  text-transform: uppercase;\n  transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n}\n\n/* line 149, src/styles/components/_form.scss */\n\n.button--dark-line:hover {\n  color: #fff;\n  box-shadow: inset 0 -50px 8px -4px #000;\n}\n\n@font-face {\n  font-family: 'mapache';\n  src: url(\"./../fonts/mapache.eot\");\n  src: url(\"./../fonts/mapache.eot\") format(\"embedded-opentype\"), url(\"./../fonts/mapache.ttf\") format(\"truetype\"), url(\"./../fonts/mapache.woff\") format(\"woff\"), url(\"./../fonts/mapache.svg\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n\n/* line 17, src/styles/components/_icons.scss */\n\n.i-tag:before {\n  content: \"\\e911\";\n}\n\n/* line 20, src/styles/components/_icons.scss */\n\n.i-discord:before {\n  content: \"\\e90a\";\n}\n\n/* line 23, src/styles/components/_icons.scss */\n\n.i-arrow-round-next:before {\n  content: \"\\e90c\";\n}\n\n/* line 26, src/styles/components/_icons.scss */\n\n.i-arrow-round-prev:before {\n  content: \"\\e90d\";\n}\n\n/* line 29, src/styles/components/_icons.scss */\n\n.i-arrow-round-up:before {\n  content: \"\\e90e\";\n}\n\n/* line 32, src/styles/components/_icons.scss */\n\n.i-arrow-round-down:before {\n  content: \"\\e90f\";\n}\n\n/* line 35, src/styles/components/_icons.scss */\n\n.i-photo:before {\n  content: \"\\e90b\";\n}\n\n/* line 38, src/styles/components/_icons.scss */\n\n.i-send:before {\n  content: \"\\e909\";\n}\n\n/* line 41, src/styles/components/_icons.scss */\n\n.i-audio:before {\n  content: \"\\e901\";\n}\n\n/* line 44, src/styles/components/_icons.scss */\n\n.i-rocket:before {\n  content: \"\\e902\";\n  color: #999;\n}\n\n/* line 48, src/styles/components/_icons.scss */\n\n.i-comments-line:before {\n  content: \"\\e900\";\n}\n\n/* line 51, src/styles/components/_icons.scss */\n\n.i-globe:before {\n  content: \"\\e906\";\n}\n\n/* line 54, src/styles/components/_icons.scss */\n\n.i-star:before {\n  content: \"\\e907\";\n}\n\n/* line 57, src/styles/components/_icons.scss */\n\n.i-link:before {\n  content: \"\\e908\";\n}\n\n/* line 60, src/styles/components/_icons.scss */\n\n.i-star-line:before {\n  content: \"\\e903\";\n}\n\n/* line 63, src/styles/components/_icons.scss */\n\n.i-more:before {\n  content: \"\\e904\";\n}\n\n/* line 66, src/styles/components/_icons.scss */\n\n.i-search:before {\n  content: \"\\e905\";\n}\n\n/* line 69, src/styles/components/_icons.scss */\n\n.i-chat:before {\n  content: \"\\e910\";\n}\n\n/* line 72, src/styles/components/_icons.scss */\n\n.i-arrow-left:before {\n  content: \"\\e314\";\n}\n\n/* line 75, src/styles/components/_icons.scss */\n\n.i-arrow-right:before {\n  content: \"\\e315\";\n}\n\n/* line 78, src/styles/components/_icons.scss */\n\n.i-play:before {\n  content: \"\\e037\";\n}\n\n/* line 81, src/styles/components/_icons.scss */\n\n.i-location:before {\n  content: \"\\e8b4\";\n}\n\n/* line 84, src/styles/components/_icons.scss */\n\n.i-check-circle:before {\n  content: \"\\e86c\";\n}\n\n/* line 87, src/styles/components/_icons.scss */\n\n.i-close:before {\n  content: \"\\e5cd\";\n}\n\n/* line 90, src/styles/components/_icons.scss */\n\n.i-favorite:before {\n  content: \"\\e87d\";\n}\n\n/* line 93, src/styles/components/_icons.scss */\n\n.i-warning:before {\n  content: \"\\e002\";\n}\n\n/* line 96, src/styles/components/_icons.scss */\n\n.i-rss:before {\n  content: \"\\e0e5\";\n}\n\n/* line 99, src/styles/components/_icons.scss */\n\n.i-share:before {\n  content: \"\\e80d\";\n}\n\n/* line 102, src/styles/components/_icons.scss */\n\n.i-email:before {\n  content: \"\\f0e0\";\n}\n\n/* line 105, src/styles/components/_icons.scss */\n\n.i-google:before {\n  content: \"\\f1a0\";\n}\n\n/* line 108, src/styles/components/_icons.scss */\n\n.i-telegram:before {\n  content: \"\\f2c6\";\n}\n\n/* line 111, src/styles/components/_icons.scss */\n\n.i-reddit:before {\n  content: \"\\f281\";\n}\n\n/* line 114, src/styles/components/_icons.scss */\n\n.i-twitter:before {\n  content: \"\\f099\";\n}\n\n/* line 117, src/styles/components/_icons.scss */\n\n.i-github:before {\n  content: \"\\f09b\";\n}\n\n/* line 120, src/styles/components/_icons.scss */\n\n.i-linkedin:before {\n  content: \"\\f0e1\";\n}\n\n/* line 123, src/styles/components/_icons.scss */\n\n.i-youtube:before {\n  content: \"\\f16a\";\n}\n\n/* line 126, src/styles/components/_icons.scss */\n\n.i-stack-overflow:before {\n  content: \"\\f16c\";\n}\n\n/* line 129, src/styles/components/_icons.scss */\n\n.i-instagram:before {\n  content: \"\\f16d\";\n}\n\n/* line 132, src/styles/components/_icons.scss */\n\n.i-flickr:before {\n  content: \"\\f16e\";\n}\n\n/* line 135, src/styles/components/_icons.scss */\n\n.i-dribbble:before {\n  content: \"\\f17d\";\n}\n\n/* line 138, src/styles/components/_icons.scss */\n\n.i-behance:before {\n  content: \"\\f1b4\";\n}\n\n/* line 141, src/styles/components/_icons.scss */\n\n.i-spotify:before {\n  content: \"\\f1bc\";\n}\n\n/* line 144, src/styles/components/_icons.scss */\n\n.i-codepen:before {\n  content: \"\\f1cb\";\n}\n\n/* line 147, src/styles/components/_icons.scss */\n\n.i-facebook:before {\n  content: \"\\f230\";\n}\n\n/* line 150, src/styles/components/_icons.scss */\n\n.i-pinterest:before {\n  content: \"\\f231\";\n}\n\n/* line 153, src/styles/components/_icons.scss */\n\n.i-whatsapp:before {\n  content: \"\\f232\";\n}\n\n/* line 156, src/styles/components/_icons.scss */\n\n.i-snapchat:before {\n  content: \"\\f2ac\";\n}\n\n/* line 2, src/styles/components/_animated.scss */\n\n.animated {\n  animation-duration: 1s;\n  animation-fill-mode: both;\n}\n\n/* line 6, src/styles/components/_animated.scss */\n\n.animated.infinite {\n  animation-iteration-count: infinite;\n}\n\n/* line 12, src/styles/components/_animated.scss */\n\n.bounceIn {\n  animation-name: bounceIn;\n}\n\n/* line 13, src/styles/components/_animated.scss */\n\n.bounceInDown {\n  animation-name: bounceInDown;\n}\n\n/* line 14, src/styles/components/_animated.scss */\n\n.pulse {\n  animation-name: pulse;\n}\n\n/* line 15, src/styles/components/_animated.scss */\n\n.slideInUp {\n  animation-name: slideInUp;\n}\n\n/* line 16, src/styles/components/_animated.scss */\n\n.slideOutDown {\n  animation-name: slideOutDown;\n}\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    animation-timing-function: cubic-bezier(215, 610, 355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    transform: none;\n  }\n}\n\n@keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    transform: scale3d(1.2, 1.2, 1.2);\n  }\n\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n\n  100% {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n}\n\n@keyframes opacity {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes tooltip {\n  0% {\n    opacity: 0;\n    transform: translate(-50%, 6px);\n  }\n\n  100% {\n    opacity: 1;\n    transform: translate(-50%, 0);\n  }\n}\n\n@keyframes loading-bar {\n  0% {\n    transform: translateX(-100%);\n  }\n\n  40% {\n    transform: translateX(0);\n  }\n\n  60% {\n    transform: translateX(0);\n  }\n\n  100% {\n    transform: translateX(100%);\n  }\n}\n\n@keyframes arrow-move-right {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    transform: translateX(-100%);\n    opacity: 0;\n  }\n\n  100% {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@keyframes arrow-move-left {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n\n  100% {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0);\n  }\n}\n\n/* line 4, src/styles/layouts/_header.scss */\n\n.header-logo,\n.menu--toggle,\n.search-toggle {\n  z-index: 15;\n}\n\n/* line 10, src/styles/layouts/_header.scss */\n\n.header {\n  box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n  padding: 0 16px;\n  position: sticky;\n  top: 0;\n  transition: all 0.4s ease-in-out;\n  z-index: 10;\n}\n\n/* line 18, src/styles/layouts/_header.scss */\n\n.header-wrap {\n  height: 50px;\n}\n\n/* line 20, src/styles/layouts/_header.scss */\n\n.header-logo {\n  color: #fff !important;\n  height: 30px;\n}\n\n/* line 24, src/styles/layouts/_header.scss */\n\n.header-logo img {\n  max-height: 100%;\n}\n\n/* line 29, src/styles/layouts/_header.scss */\n\n.not-logo .header-logo {\n  height: auto !important;\n}\n\n/* line 32, src/styles/layouts/_header.scss */\n\n.header-line {\n  height: 50px;\n  border-right: 1px solid rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  margin-right: 10px;\n}\n\n/* line 41, src/styles/layouts/_header.scss */\n\n.follow-more {\n  transition: width .4s ease;\n  overflow: hidden;\n  width: 0;\n}\n\n/* line 48, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-more {\n  width: auto;\n}\n\n/* line 49, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-toggle {\n  color: var(--header-color-hover);\n}\n\n/* line 50, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-toggle::before {\n  content: \"\\e5cd\";\n}\n\n/* line 56, src/styles/layouts/_header.scss */\n\n.nav {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  position: relative;\n  overflow: hidden;\n}\n\n/* line 62, src/styles/layouts/_header.scss */\n\n.nav ul {\n  display: flex;\n  margin-right: 20px;\n  overflow: hidden;\n  white-space: nowrap;\n}\n\n/* line 70, src/styles/layouts/_header.scss */\n\n.header-left a,\n.nav ul li a {\n  border-radius: 3px;\n  color: var(--header-color);\n  display: inline-block;\n  font-weight: 600;\n  line-height: 30px;\n  padding: 0 8px;\n  text-align: center;\n  text-transform: uppercase;\n  vertical-align: middle;\n}\n\n/* line 82, src/styles/layouts/_header.scss */\n\n.header-left a.active,\n.header-left a:hover,\n.nav ul li a.active,\n.nav ul li a:hover {\n  color: var(--header-color-hover);\n}\n\n/* line 89, src/styles/layouts/_header.scss */\n\n.menu--toggle {\n  height: 48px;\n  position: relative;\n  transition: transform .4s;\n  width: 48px;\n}\n\n/* line 95, src/styles/layouts/_header.scss */\n\n.menu--toggle span {\n  background-color: var(--header-color);\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  transition: .4s;\n  width: 20px;\n}\n\n/* line 106, src/styles/layouts/_header.scss */\n\n.menu--toggle span:first-child {\n  transform: translate(0, -6px);\n}\n\n/* line 107, src/styles/layouts/_header.scss */\n\n.menu--toggle span:last-child {\n  transform: translate(0, 6px);\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 115, src/styles/layouts/_header.scss */\n\n  .header-left {\n    flex-grow: 1 !important;\n  }\n\n  /* line 116, src/styles/layouts/_header.scss */\n\n  .header-logo span {\n    font-size: 24px;\n  }\n\n  /* line 119, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob {\n    overflow: hidden;\n  }\n\n  /* line 122, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .sideNav {\n    transform: translateX(0);\n  }\n\n  /* line 124, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle {\n    border: 0;\n    transform: rotate(90deg);\n  }\n\n  /* line 128, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:first-child {\n    transform: rotate(45deg) translate(0, 0);\n  }\n\n  /* line 129, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:nth-child(2) {\n    transform: scaleX(0);\n  }\n\n  /* line 130, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:last-child {\n    transform: rotate(-45deg) translate(0, 0);\n  }\n\n  /* line 133, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .header .button-search--toggle {\n    display: none;\n  }\n\n  /* line 134, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .main,\n  body.is-showNavMob .footer {\n    transform: translateX(-25%) !important;\n  }\n}\n\n/* line 4, src/styles/layouts/_footer.scss */\n\n.footer {\n  color: #888;\n}\n\n/* line 7, src/styles/layouts/_footer.scss */\n\n.footer a {\n  color: var(--footer-color-link);\n}\n\n/* line 9, src/styles/layouts/_footer.scss */\n\n.footer a:hover {\n  color: #fff;\n}\n\n/* line 12, src/styles/layouts/_footer.scss */\n\n.footer-links {\n  padding: 3em 0 2.5em;\n  background-color: #131313;\n}\n\n/* line 17, src/styles/layouts/_footer.scss */\n\n.footer .follow > a {\n  background: #333;\n  border-radius: 50%;\n  color: inherit;\n  display: inline-block;\n  height: 40px;\n  line-height: 40px;\n  margin: 0 5px 8px;\n  text-align: center;\n  width: 40px;\n}\n\n/* line 28, src/styles/layouts/_footer.scss */\n\n.footer .follow > a:hover {\n  background: transparent;\n  box-shadow: inset 0 0 0 2px #333;\n}\n\n/* line 34, src/styles/layouts/_footer.scss */\n\n.footer-copy {\n  padding: 3em 0;\n  background-color: #000;\n}\n\n/* line 41, src/styles/layouts/_footer.scss */\n\n.footer-menu li {\n  display: inline-block;\n  line-height: 24px;\n  margin: 0 8px;\n  /* stylelint-disable-next-line */\n}\n\n/* line 47, src/styles/layouts/_footer.scss */\n\n.footer-menu li a {\n  color: #888;\n}\n\n/* line 3, src/styles/layouts/_homepage.scss */\n\n.cover {\n  padding: 4px;\n}\n\n/* line 6, src/styles/layouts/_homepage.scss */\n\n.cover-story {\n  overflow: hidden;\n  height: 250px;\n  width: 100%;\n}\n\n/* line 11, src/styles/layouts/_homepage.scss */\n\n.cover-story:hover .cover-header {\n  background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%);\n}\n\n/* line 13, src/styles/layouts/_homepage.scss */\n\n.cover-story.firts {\n  height: 80vh;\n}\n\n/* line 16, src/styles/layouts/_homepage.scss */\n\n.cover-img,\n.cover-link {\n  bottom: 4px;\n  left: 4px;\n  right: 4px;\n  top: 4px;\n}\n\n/* line 25, src/styles/layouts/_homepage.scss */\n\n.cover-header {\n  bottom: 4px;\n  left: 4px;\n  right: 4px;\n  padding: 50px 3.846153846% 20px;\n  background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);\n}\n\n/* line 36, src/styles/layouts/_homepage.scss */\n\n.hm-cover {\n  padding: 30px 0;\n  min-height: 100vh;\n}\n\n/* line 40, src/styles/layouts/_homepage.scss */\n\n.hm-cover-title {\n  font-size: 2.5rem;\n  font-weight: 900;\n  line-height: 1;\n}\n\n/* line 46, src/styles/layouts/_homepage.scss */\n\n.hm-cover-des {\n  max-width: 600px;\n  font-size: 1.25rem;\n}\n\n/* line 52, src/styles/layouts/_homepage.scss */\n\n.hm-subscribe {\n  background-color: transparent;\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #fff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  padding: 15px 10px;\n  transition: all .3s;\n  width: 100%;\n}\n\n/* line 67, src/styles/layouts/_homepage.scss */\n\n.hm-subscribe:hover {\n  box-shadow: inset 0 0 0 2px #fff;\n}\n\n/* line 72, src/styles/layouts/_homepage.scss */\n\n.hm-down {\n  animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100;\n}\n\n/* line 83, src/styles/layouts/_homepage.scss */\n\n.hm-down svg {\n  display: block;\n  fill: currentcolor;\n  height: auto;\n  width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 94, src/styles/layouts/_homepage.scss */\n\n  .cover {\n    height: 70vh;\n  }\n\n  /* line 97, src/styles/layouts/_homepage.scss */\n\n  .cover-story {\n    height: 50%;\n    width: 33.33333%;\n  }\n\n  /* line 101, src/styles/layouts/_homepage.scss */\n\n  .cover-story.firts {\n    height: 100%;\n    width: 66.66666%;\n  }\n\n  /* line 105, src/styles/layouts/_homepage.scss */\n\n  .cover-story.firts .cover-title {\n    font-size: 2.5rem;\n  }\n\n  /* line 111, src/styles/layouts/_homepage.scss */\n\n  .hm-cover-title {\n    font-size: 3.5rem;\n  }\n}\n\n/* line 6, src/styles/layouts/_post.scss */\n\n.post-title {\n  color: #000;\n  line-height: 1.2;\n  font-weight: 900;\n  max-width: 1000px;\n}\n\n/* line 13, src/styles/layouts/_post.scss */\n\n.post-excerpt {\n  color: #555;\n  font-family: \"Merriweather\", serif;\n  font-weight: 300;\n  letter-spacing: -.012em;\n  line-height: 1.6;\n}\n\n/* line 22, src/styles/layouts/_post.scss */\n\n.post-author-social {\n  vertical-align: middle;\n  margin-left: 2px;\n  padding: 0 3px;\n}\n\n/* line 28, src/styles/layouts/_post.scss */\n\n.post-image {\n  margin-top: 30px;\n}\n\n/* line 33, src/styles/layouts/_post.scss */\n\n.avatar-image {\n  display: inline-block;\n  vertical-align: middle;\n}\n\n/* line 39, src/styles/layouts/_post.scss */\n\n.avatar-image--smaller {\n  width: 50px;\n  height: 50px;\n}\n\n/* line 48, src/styles/layouts/_post.scss */\n\n.post-body a:not(.button):not(.button--circle):not(.prev-next-link) {\n  text-decoration: none;\n  position: relative;\n  transition: all 250ms;\n  box-shadow: inset 0 -3px 0 var(--post-color-link);\n}\n\n/* line 54, src/styles/layouts/_post.scss */\n\n.post-body a:not(.button):not(.button--circle):not(.prev-next-link):hover {\n  box-shadow: inset 0 -1rem 0 var(--post-color-link);\n}\n\n/* line 59, src/styles/layouts/_post.scss */\n\n.post-body img {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n/* line 65, src/styles/layouts/_post.scss */\n\n.post-body h1,\n.post-body h2,\n.post-body h3,\n.post-body h4,\n.post-body h5,\n.post-body h6 {\n  margin-top: 30px;\n  font-weight: 900;\n  font-style: normal;\n  color: #000;\n  letter-spacing: -.02em;\n  line-height: 1.2;\n}\n\n/* line 74, src/styles/layouts/_post.scss */\n\n.post-body h2 {\n  margin-top: 35px;\n}\n\n/* line 76, src/styles/layouts/_post.scss */\n\n.post-body p {\n  font-family: \"Merriweather\", serif;\n  font-size: 1.125rem;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin-top: 25px;\n}\n\n/* line 85, src/styles/layouts/_post.scss */\n\n.post-body ul,\n.post-body ol {\n  counter-reset: post;\n  font-family: \"Merriweather\", serif;\n  font-size: 1.125rem;\n  margin-top: 20px;\n}\n\n/* line 92, src/styles/layouts/_post.scss */\n\n.post-body ul li,\n.post-body ol li {\n  letter-spacing: -.003em;\n  margin-bottom: 14px;\n  margin-left: 30px;\n}\n\n/* line 97, src/styles/layouts/_post.scss */\n\n.post-body ul li::before,\n.post-body ol li::before {\n  box-sizing: border-box;\n  display: inline-block;\n  margin-left: -78px;\n  position: absolute;\n  text-align: right;\n  width: 78px;\n}\n\n/* line 108, src/styles/layouts/_post.scss */\n\n.post-body ul li::before {\n  content: '\\2022';\n  font-size: 16.8px;\n  padding-right: 15px;\n  padding-top: 3px;\n}\n\n/* line 115, src/styles/layouts/_post.scss */\n\n.post-body ol li::before {\n  content: counter(post) \".\";\n  counter-increment: post;\n  padding-right: 12px;\n}\n\n/* line 143, src/styles/layouts/_post.scss */\n\n.post-body-wrap {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n/* line 150, src/styles/layouts/_post.scss */\n\n.post-body-wrap h1,\n.post-body-wrap h2,\n.post-body-wrap h3,\n.post-body-wrap h4,\n.post-body-wrap h5,\n.post-body-wrap h6,\n.post-body-wrap ol,\n.post-body-wrap ul,\n.post-body-wrap hr,\n.post-body-wrap pre,\n.post-body-wrap .post-tags,\n.post-body-wrap .prev-next {\n  min-width: 100%;\n}\n\n/* line 155, src/styles/layouts/_post.scss */\n\n.post-body-wrap > ul {\n  margin-top: 35px;\n}\n\n/* line 157, src/styles/layouts/_post.scss */\n\n.post-body-wrap > iframe,\n.post-body-wrap > img,\n.post-body-wrap .kg-image-card,\n.post-body-wrap .kg-embed-card {\n  margin-top: 30px !important;\n}\n\n/* line 167, src/styles/layouts/_post.scss */\n\n.sharePost {\n  left: 0;\n  width: 40px;\n  position: absolute !important;\n  transition: all .4s;\n  top: 30px;\n  /* stylelint-disable-next-line */\n}\n\n/* line 175, src/styles/layouts/_post.scss */\n\n.sharePost a {\n  color: #fff;\n  margin: 8px 0 0;\n  display: block;\n}\n\n/* line 181, src/styles/layouts/_post.scss */\n\n.sharePost .i-chat {\n  background-color: #fff;\n  border: 2px solid #bbb;\n  color: #bbb;\n}\n\n/* line 191, src/styles/layouts/_post.scss */\n\n.post-related {\n  padding: 40px 0;\n}\n\n/* stylelint-disable-next-line */\n\n/* line 199, src/styles/layouts/_post.scss */\n\n.prev-next-span {\n  color: var(--composite-color);\n  font-weight: 700;\n  font-size: 13px;\n}\n\n/* line 204, src/styles/layouts/_post.scss */\n\n.prev-next-span i {\n  display: inline-flex;\n  transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1);\n}\n\n/* line 210, src/styles/layouts/_post.scss */\n\n.prev-next-title {\n  margin: 0 !important;\n  font-size: 16px;\n  height: 2em;\n  overflow: hidden;\n  line-height: 1 !important;\n  text-overflow: ellipsis !important;\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  display: -webkit-box !important;\n}\n\n/* line 230, src/styles/layouts/_post.scss */\n\n.prev-next-link:hover .arrow-right {\n  animation: arrow-move-right 0.5s ease-in-out forwards;\n}\n\n/* line 231, src/styles/layouts/_post.scss */\n\n.prev-next-link:hover .arrow-left {\n  animation: arrow-move-left 0.5s ease-in-out forwards;\n}\n\n/* line 237, src/styles/layouts/_post.scss */\n\n.cc-image {\n  max-height: 100vh;\n  min-height: 600px;\n  background-color: #000;\n}\n\n/* line 242, src/styles/layouts/_post.scss */\n\n.cc-image-header {\n  right: 0;\n  bottom: 10%;\n  left: 0;\n}\n\n/* line 248, src/styles/layouts/_post.scss */\n\n.cc-image-figure img {\n  opacity: .4;\n  object-fit: cover;\n  width: 100%;\n}\n\n/* line 254, src/styles/layouts/_post.scss */\n\n.cc-image .post-header {\n  max-width: 700px;\n}\n\n/* line 255, src/styles/layouts/_post.scss */\n\n.cc-image .post-title,\n.cc-image .post-excerpt {\n  color: #fff;\n}\n\n/* line 261, src/styles/layouts/_post.scss */\n\n.cc-video {\n  background-color: #000;\n  padding: 40px 0 30px;\n}\n\n/* line 265, src/styles/layouts/_post.scss */\n\n.cc-video .post-excerpt {\n  color: #aaa;\n  font-size: 1rem;\n}\n\n/* line 266, src/styles/layouts/_post.scss */\n\n.cc-video .post-title {\n  color: #fff;\n  font-size: 1.8rem;\n}\n\n/* line 267, src/styles/layouts/_post.scss */\n\n.cc-video .kg-embed-card,\n.cc-video .video-responsive {\n  margin-top: 0;\n}\n\n/* line 270, src/styles/layouts/_post.scss */\n\n.cc-video .story h2 {\n  color: #fff;\n  margin: 0;\n  font-size: 1.125rem !important;\n  font-weight: 700 !important;\n  max-height: 2.5em;\n  overflow: hidden;\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  text-overflow: ellipsis !important;\n  display: -webkit-box !important;\n}\n\n/* line 283, src/styles/layouts/_post.scss */\n\n.cc-video .flow-meta,\n.cc-video .story-lower,\n.cc-video figcaption {\n  display: none !important;\n}\n\n/* line 284, src/styles/layouts/_post.scss */\n\n.cc-video .story-image {\n  height: 170px !important;\n}\n\n/* line 286, src/styles/layouts/_post.scss */\n\n.cc-video .media-type {\n  height: 34px !important;\n  width: 34px !important;\n}\n\n/* line 294, src/styles/layouts/_post.scss */\n\nbody.is-article .main {\n  margin-bottom: 0;\n}\n\n/* line 295, src/styles/layouts/_post.scss */\n\nbody.share-margin .sharePost {\n  top: -85px;\n}\n\n/* line 296, src/styles/layouts/_post.scss */\n\nbody.show-category .post-primary-tag {\n  display: block !important;\n}\n\n/* line 299, src/styles/layouts/_post.scss */\n\nbody.is-article-single .post-body-wrap {\n  margin-left: 0 !important;\n}\n\n/* line 300, src/styles/layouts/_post.scss */\n\nbody.is-article-single .sharePost {\n  left: -100px;\n}\n\n/* line 301, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-width-full .kg-image {\n  max-width: 100vw;\n}\n\n/* line 302, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-width-wide .kg-image {\n  max-width: 1040px;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 308, src/styles/layouts/_post.scss */\n\n  .post-body-wrap q {\n    font-size: 20px !important;\n    letter-spacing: -.008em !important;\n    line-height: 1.4 !important;\n  }\n\n  /* line 320, src/styles/layouts/_post.scss */\n\n  .post-body-wrap .kg-image-card img {\n    max-width: 100%;\n  }\n\n  /* line 322, src/styles/layouts/_post.scss */\n\n  .post-body-wrap ol,\n  .post-body-wrap ul,\n  .post-body-wrap p {\n    font-size: 1rem;\n    letter-spacing: -.004em;\n    line-height: 1.58;\n  }\n\n  /* line 328, src/styles/layouts/_post.scss */\n\n  .post-body-wrap iframe {\n    width: 100% !important;\n  }\n\n  /* line 332, src/styles/layouts/_post.scss */\n\n  .post-related {\n    padding-left: 8px;\n    padding-right: 8px;\n  }\n\n  /* line 338, src/styles/layouts/_post.scss */\n\n  .cc-image-figure {\n    width: 200%;\n    max-width: 200%;\n    margin: 0 auto 0 -50%;\n  }\n\n  /* line 344, src/styles/layouts/_post.scss */\n\n  .cc-image-header {\n    bottom: 24px;\n  }\n\n  /* line 345, src/styles/layouts/_post.scss */\n\n  .cc-image .post-excerpt {\n    font-size: 18px;\n  }\n\n  /* line 348, src/styles/layouts/_post.scss */\n\n  .cc-video {\n    padding: 20px 0;\n  }\n\n  /* line 351, src/styles/layouts/_post.scss */\n\n  .cc-video-embed {\n    margin-left: -16px;\n    margin-right: -15px;\n  }\n\n  /* line 356, src/styles/layouts/_post.scss */\n\n  .cc-video .post-header {\n    margin-top: 10px;\n  }\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 362, src/styles/layouts/_post.scss */\n\n  body.is-article .col-left {\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 369, src/styles/layouts/_post.scss */\n\n  .cc-image .post-title {\n    font-size: 3.2rem;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 373, src/styles/layouts/_post.scss */\n\n  body.is-article .post-body-wrap {\n    margin-left: 70px;\n  }\n\n  /* line 377, src/styles/layouts/_post.scss */\n\n  body.is-video .post-author,\n  body.is-image .post-author {\n    margin-left: 70px;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  /* line 384, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-embed {\n    bottom: 20px;\n    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n    height: 203px;\n    padding-bottom: 0;\n    position: fixed;\n    right: 20px;\n    width: 360px;\n    z-index: 8;\n  }\n\n  /* line 395, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-close {\n    background: #000;\n    border-radius: 50%;\n    color: #fff;\n    cursor: pointer;\n    display: block !important;\n    font-size: 14px;\n    height: 24px;\n    left: -10px;\n    line-height: 1;\n    padding-top: 5px;\n    position: absolute;\n    text-align: center;\n    top: -10px;\n    width: 24px;\n    z-index: 5;\n  }\n\n  /* line 413, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-cont {\n    height: 465px;\n  }\n\n  /* line 415, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-image-header {\n    bottom: 20%;\n  }\n}\n\n/* line 3, src/styles/layouts/_story.scss */\n\n.hr-list {\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.0785);\n  margin: 20px 0 0;\n}\n\n/* line 10, src/styles/layouts/_story.scss */\n\n.story-feed .story-feed-content:first-child .hr-list:first-child {\n  margin-top: 5px;\n}\n\n/* line 15, src/styles/layouts/_story.scss */\n\n.media-type {\n  background-color: rgba(0, 0, 0, 0.7);\n  color: #fff;\n  height: 45px;\n  left: 15px;\n  top: 15px;\n  width: 45px;\n  opacity: .9;\n}\n\n/* line 33, src/styles/layouts/_story.scss */\n\n.image-hover {\n  transition: transform .7s;\n  transform: translateZ(0);\n}\n\n/* line 39, src/styles/layouts/_story.scss */\n\n.not-image {\n  background: url(\"./../images/not-image.png\");\n  background-repeat: repeat;\n}\n\n/* line 45, src/styles/layouts/_story.scss */\n\n.flow-meta {\n  color: rgba(0, 0, 0, 0.54);\n  font-weight: 700;\n  margin-bottom: 10px;\n}\n\n/* line 52, src/styles/layouts/_story.scss */\n\n.point {\n  margin: 0 5px;\n}\n\n/* line 58, src/styles/layouts/_story.scss */\n\n.story-image {\n  flex: 0 0 44%;\n  height: 235px;\n  margin-right: 30px;\n}\n\n/* line 63, src/styles/layouts/_story.scss */\n\n.story-image:hover .image-hover {\n  transform: scale(1.03);\n}\n\n/* line 66, src/styles/layouts/_story.scss */\n\n.story-lower {\n  flex-grow: 1;\n}\n\n/* line 68, src/styles/layouts/_story.scss */\n\n.story-excerpt {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Merriweather\", serif;\n  font-weight: 300;\n  line-height: 1.5;\n}\n\n/* line 75, src/styles/layouts/_story.scss */\n\n.story-category {\n  color: rgba(0, 0, 0, 0.84);\n}\n\n/* line 77, src/styles/layouts/_story.scss */\n\n.story h2 a:hover {\n  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.4);\n  transition: all .25s;\n}\n\n/* line 89, src/styles/layouts/_story.scss */\n\n.story.story--grid {\n  flex-direction: column;\n  margin-bottom: 30px;\n}\n\n/* line 93, src/styles/layouts/_story.scss */\n\n.story.story--grid .story-image {\n  flex: 0 0 auto;\n  margin-right: 0;\n  height: 220px;\n}\n\n/* line 99, src/styles/layouts/_story.scss */\n\n.story.story--grid .media-type {\n  font-size: 24px;\n  height: 40px;\n  width: 40px;\n}\n\n/* line 106, src/styles/layouts/_story.scss */\n\n.cover-category {\n  color: var(--story-cover-category-color);\n}\n\n/* line 111, src/styles/layouts/_story.scss */\n\n.story-card {\n  /* stylelint-disable-next-line */\n}\n\n/* line 112, src/styles/layouts/_story.scss */\n\n.story-card .story {\n  margin-top: 0 !important;\n}\n\n/* line 123, src/styles/layouts/_story.scss */\n\n.story-card .story-image {\n  border: 1px solid rgba(0, 0, 0, 0.04);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  border-radius: 2px;\n  background-color: #fff !important;\n  transition: all 150ms ease-in-out;\n  overflow: hidden;\n  height: 200px !important;\n}\n\n/* line 135, src/styles/layouts/_story.scss */\n\n.story-card .story-image .story-img-bg {\n  margin: 10px;\n}\n\n/* line 137, src/styles/layouts/_story.scss */\n\n.story-card .story-image:hover {\n  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.1);\n}\n\n/* line 140, src/styles/layouts/_story.scss */\n\n.story-card .story-image:hover .story-img-bg {\n  transform: none;\n}\n\n/* line 144, src/styles/layouts/_story.scss */\n\n.story-card .story-lower {\n  display: none !important;\n}\n\n/* line 146, src/styles/layouts/_story.scss */\n\n.story-card .story-body {\n  padding: 15px 5px;\n  margin: 0 !important;\n}\n\n/* line 150, src/styles/layouts/_story.scss */\n\n.story-card .story-body h2 {\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  color: rgba(0, 0, 0, 0.9);\n  display: -webkit-box !important;\n  max-height: 2.4em !important;\n  overflow: hidden;\n  text-overflow: ellipsis !important;\n  margin: 0;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 170, src/styles/layouts/_story.scss */\n\n  .story.story--grid .story-lower {\n    max-height: 2.6em;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    display: -webkit-box;\n    line-height: 1.1;\n    text-overflow: ellipsis;\n  }\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 185, src/styles/layouts/_story.scss */\n\n  .cover--firts .cover-story {\n    height: 500px;\n  }\n\n  /* line 188, src/styles/layouts/_story.scss */\n\n  .story {\n    flex-direction: column;\n    margin-top: 20px;\n  }\n\n  /* line 192, src/styles/layouts/_story.scss */\n\n  .story-image {\n    flex: 0 0 auto;\n    margin-right: 0;\n  }\n\n  /* line 193, src/styles/layouts/_story.scss */\n\n  .story-body {\n    margin-top: 10px;\n  }\n}\n\n/* line 4, src/styles/layouts/_author.scss */\n\n.author {\n  background-color: #fff;\n  color: rgba(0, 0, 0, 0.6);\n  min-height: 350px;\n}\n\n/* line 9, src/styles/layouts/_author.scss */\n\n.author-avatar {\n  height: 80px;\n  width: 80px;\n}\n\n/* line 14, src/styles/layouts/_author.scss */\n\n.author-meta span {\n  display: inline-block;\n  font-size: 17px;\n  font-style: italic;\n  margin: 0 25px 16px 0;\n  opacity: .8;\n  word-wrap: break-word;\n}\n\n/* line 23, src/styles/layouts/_author.scss */\n\n.author-name {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 24, src/styles/layouts/_author.scss */\n\n.author-bio {\n  max-width: 600px;\n}\n\n/* line 25, src/styles/layouts/_author.scss */\n\n.author-meta a:hover {\n  opacity: .8 !important;\n}\n\n/* line 28, src/styles/layouts/_author.scss */\n\n.cover-opacity {\n  opacity: .5;\n}\n\n/* line 30, src/styles/layouts/_author.scss */\n\n.author.has--image {\n  color: #fff !important;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n}\n\n/* line 34, src/styles/layouts/_author.scss */\n\n.author.has--image a,\n.author.has--image .author-name {\n  color: #fff;\n}\n\n/* line 37, src/styles/layouts/_author.scss */\n\n.author.has--image .author-follow a {\n  border: 2px solid;\n  border-color: rgba(255, 255, 255, 0.5) !important;\n  font-size: 16px;\n}\n\n/* line 43, src/styles/layouts/_author.scss */\n\n.author.has--image .u-accentColor--iconNormal {\n  fill: #fff;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 47, src/styles/layouts/_author.scss */\n\n  .author-meta span {\n    display: block;\n  }\n\n  /* line 48, src/styles/layouts/_author.scss */\n\n  .author-header {\n    display: block;\n  }\n\n  /* line 49, src/styles/layouts/_author.scss */\n\n  .author-avatar {\n    margin: 0 auto 20px;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 53, src/styles/layouts/_author.scss */\n\n  body.has-cover .author {\n    min-height: 600px;\n  }\n}\n\n/* line 4, src/styles/layouts/_search.scss */\n\n.search {\n  background-color: #fff;\n  height: 100%;\n  height: 100vh;\n  left: 0;\n  padding: 0 16px;\n  right: 0;\n  top: 0;\n  transform: translateY(-100%);\n  transition: transform .3s ease;\n  z-index: 9;\n}\n\n/* line 16, src/styles/layouts/_search.scss */\n\n.search-form {\n  max-width: 680px;\n  margin-top: 80px;\n}\n\n/* line 20, src/styles/layouts/_search.scss */\n\n.search-form::before {\n  background: #eee;\n  bottom: 0;\n  content: '';\n  display: block;\n  height: 2px;\n  left: 0;\n  position: absolute;\n  width: 100%;\n  z-index: 1;\n}\n\n/* line 32, src/styles/layouts/_search.scss */\n\n.search-form input {\n  border: none;\n  display: block;\n  line-height: 40px;\n  padding-bottom: 8px;\n}\n\n/* line 38, src/styles/layouts/_search.scss */\n\n.search-form input:focus {\n  outline: 0;\n}\n\n/* line 43, src/styles/layouts/_search.scss */\n\n.search-results {\n  max-height: calc(90% - 100px);\n  max-width: 680px;\n  overflow: auto;\n}\n\n/* line 48, src/styles/layouts/_search.scss */\n\n.search-results a {\n  border-bottom: 1px solid #eee;\n  padding: 12px 0;\n}\n\n/* line 52, src/styles/layouts/_search.scss */\n\n.search-results a:hover {\n  color: rgba(0, 0, 0, 0.44);\n}\n\n/* line 57, src/styles/layouts/_search.scss */\n\n.button-search--close {\n  position: absolute !important;\n  right: 50px;\n  top: 20px;\n}\n\n/* line 63, src/styles/layouts/_search.scss */\n\nbody.is-search {\n  overflow: hidden;\n}\n\n/* line 66, src/styles/layouts/_search.scss */\n\nbody.is-search .search {\n  transform: translateY(0);\n}\n\n/* line 67, src/styles/layouts/_search.scss */\n\nbody.is-search .search-toggle {\n  background-color: rgba(255, 255, 255, 0.25);\n}\n\n/* line 2, src/styles/layouts/_sidebar.scss */\n\n.sidebar-title {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n}\n\n/* line 5, src/styles/layouts/_sidebar.scss */\n\n.sidebar-title span {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.54);\n  padding-bottom: 10px;\n  margin-bottom: -1px;\n}\n\n/* line 14, src/styles/layouts/_sidebar.scss */\n\n.sidebar-border {\n  border-left: 3px solid var(--composite-color);\n  color: rgba(0, 0, 0, 0.2);\n  font-family: \"Merriweather\", serif;\n  padding: 0 10px;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888;\n}\n\n/* line 24, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.0785);\n  min-height: 60px;\n}\n\n/* line 30, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:hover .sidebar-border {\n  background-color: #e5eff5;\n}\n\n/* line 32, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:nth-child(3n) .sidebar-border {\n  border-color: #f59e00;\n}\n\n/* line 33, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:nth-child(3n+2) .sidebar-border {\n  border-color: #26a8ed;\n}\n\n/* line 2, src/styles/layouts/_sidenav.scss */\n\n.sideNav {\n  color: rgba(0, 0, 0, 0.8);\n  height: 100vh;\n  padding: 50px 20px;\n  position: fixed !important;\n  transform: translateX(100%);\n  transition: 0.4s;\n  will-change: transform;\n  z-index: 8;\n}\n\n/* line 13, src/styles/layouts/_sidenav.scss */\n\n.sideNav-menu a {\n  padding: 10px 20px;\n}\n\n/* line 15, src/styles/layouts/_sidenav.scss */\n\n.sideNav-wrap {\n  background: #eee;\n  overflow: auto;\n  padding: 20px 0;\n  top: 50px;\n}\n\n/* line 22, src/styles/layouts/_sidenav.scss */\n\n.sideNav-section {\n  border-bottom: solid 1px #ddd;\n  margin-bottom: 8px;\n  padding-bottom: 8px;\n}\n\n/* line 28, src/styles/layouts/_sidenav.scss */\n\n.sideNav-follow {\n  border-top: 1px solid #ddd;\n  margin: 15px 0;\n}\n\n/* line 32, src/styles/layouts/_sidenav.scss */\n\n.sideNav-follow a {\n  color: #fff;\n  display: inline-block;\n  height: 36px;\n  line-height: 20px;\n  margin: 0 5px 5px 0;\n  min-width: 36px;\n  padding: 8px;\n  text-align: center;\n  vertical-align: middle;\n}\n\n/* line 17, src/styles/layouts/helper.scss */\n\n.has-cover-padding {\n  padding-top: 100px;\n}\n\n/* line 20, src/styles/layouts/helper.scss */\n\nbody.has-cover .header {\n  position: fixed;\n}\n\n/* line 23, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .header {\n  background: rgba(0, 0, 0, 0.05);\n  box-shadow: none;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n/* line 29, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .header-left a,\nbody.has-cover.is-transparency:not(.is-search) .nav ul li a {\n  color: #fff;\n}\n\n/* line 30, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .menu--toggle span {\n  background-color: #fff;\n}\n\n/* line 5, src/styles/layouts/subscribe.scss */\n\n.subscribe {\n  min-height: 80vh !important;\n  height: 100%;\n}\n\n/* line 10, src/styles/layouts/subscribe.scss */\n\n.subscribe-card {\n  background-color: #D7EFEE;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  width: 900px;\n  height: 550px;\n  padding: 50px;\n  margin: 5px;\n}\n\n/* line 20, src/styles/layouts/subscribe.scss */\n\n.subscribe form {\n  max-width: 300px;\n}\n\n/* line 24, src/styles/layouts/subscribe.scss */\n\n.subscribe-form {\n  height: 100%;\n}\n\n/* line 28, src/styles/layouts/subscribe.scss */\n\n.subscribe-input {\n  background: 0 0;\n  border: 0;\n  border-bottom: 1px solid #cc5454;\n  border-radius: 0;\n  padding: 7px 5px;\n  height: 45px;\n  outline: 0;\n  font-family: \"Ruda\", sans-serif;\n}\n\n/* line 38, src/styles/layouts/subscribe.scss */\n\n.subscribe-input::placeholder {\n  color: #cc5454;\n}\n\n/* line 43, src/styles/layouts/subscribe.scss */\n\n.subscribe .main-error {\n  color: #cc5454;\n  font-size: 16px;\n  margin-top: 15px;\n}\n\n/* line 65, src/styles/layouts/subscribe.scss */\n\n.subscribe-success .subscribe-card {\n  background-color: #E8F3EC;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 71, src/styles/layouts/subscribe.scss */\n\n  .subscribe-card {\n    height: auto;\n    width: auto;\n  }\n}\n\n/* line 4, src/styles/layouts/_comments.scss */\n\n.post-comments {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 15;\n  width: 100%;\n  left: 0;\n  overflow-y: auto;\n  background: #fff;\n  border-left: 1px solid #f1f1f1;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  font-size: 14px;\n  transform: translateX(100%);\n  transition: .2s;\n  will-change: transform;\n}\n\n/* line 21, src/styles/layouts/_comments.scss */\n\n.post-comments-header {\n  padding: 20px;\n  border-bottom: 1px solid #ddd;\n}\n\n/* line 25, src/styles/layouts/_comments.scss */\n\n.post-comments-header .toggle-comments {\n  font-size: 24px;\n  line-height: 1;\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 17px;\n  cursor: pointer;\n}\n\n/* line 36, src/styles/layouts/_comments.scss */\n\n.post-comments-overlay {\n  position: fixed !important;\n  background-color: rgba(0, 0, 0, 0.2);\n  display: none;\n  transition: background-color .4s linear;\n  z-index: 8;\n  cursor: pointer;\n}\n\n/* line 46, src/styles/layouts/_comments.scss */\n\nbody.has-comments {\n  overflow: hidden;\n}\n\n/* line 49, src/styles/layouts/_comments.scss */\n\nbody.has-comments .post-comments-overlay {\n  display: block;\n}\n\n/* line 50, src/styles/layouts/_comments.scss */\n\nbody.has-comments .post-comments {\n  transform: translateX(0);\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 54, src/styles/layouts/_comments.scss */\n\n  .post-comments {\n    left: auto;\n    width: 500px;\n    top: 50px;\n    z-index: 9;\n  }\n\n  /* line 60, src/styles/layouts/_comments.scss */\n\n  .post-comments-wrap {\n    padding: 20px;\n  }\n}\n\n/* line 1, src/styles/common/_modal.scss */\n\n.modal {\n  opacity: 0;\n  transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  z-index: 100;\n  visibility: hidden;\n}\n\n/* line 8, src/styles/common/_modal.scss */\n\n.modal-shader {\n  background-color: rgba(255, 255, 255, 0.65);\n}\n\n/* line 11, src/styles/common/_modal.scss */\n\n.modal-close {\n  color: rgba(0, 0, 0, 0.54);\n  position: absolute;\n  top: 0;\n  right: 0;\n  line-height: 1;\n  padding: 15px;\n}\n\n/* line 21, src/styles/common/_modal.scss */\n\n.modal-inner {\n  background-color: #E8F3EC;\n  border-radius: 4px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n  max-width: 700px;\n  height: 100%;\n  max-height: 400px;\n  opacity: 0;\n  padding: 72px 5% 56px;\n  transform: scale(0.6);\n  transition: transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  width: 100%;\n}\n\n/* line 36, src/styles/common/_modal.scss */\n\n.modal .form-group {\n  width: 76%;\n  margin: 0 auto 30px;\n}\n\n/* line 41, src/styles/common/_modal.scss */\n\n.modal .form--input {\n  display: inline-block;\n  margin-bottom: 10px;\n  vertical-align: top;\n  height: 40px;\n  line-height: 40px;\n  background-color: transparent;\n  padding: 17px 6px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.15);\n  width: 100%;\n}\n\n/* line 71, src/styles/common/_modal.scss */\n\nbody.has-modal {\n  overflow: hidden;\n}\n\n/* line 74, src/styles/common/_modal.scss */\n\nbody.has-modal .modal {\n  opacity: 1;\n  visibility: visible;\n  transition: opacity .3s ease;\n}\n\n/* line 79, src/styles/common/_modal.scss */\n\nbody.has-modal .modal-inner {\n  opacity: 1;\n  transform: scale(1);\n  transition: transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n}\n\n/* line 4, src/styles/common/_widget.scss */\n\n.instagram-hover {\n  background-color: rgba(0, 0, 0, 0.3);\n  opacity: 0;\n}\n\n/* line 10, src/styles/common/_widget.scss */\n\n.instagram-img {\n  height: 264px;\n}\n\n/* line 13, src/styles/common/_widget.scss */\n\n.instagram-img:hover > .instagram-hover {\n  opacity: 1;\n}\n\n/* line 16, src/styles/common/_widget.scss */\n\n.instagram-name {\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 3;\n}\n\n/* line 22, src/styles/common/_widget.scss */\n\n.instagram-name a {\n  background-color: #fff;\n  color: #000 !important;\n  font-size: 18px !important;\n  font-weight: 900 !important;\n  min-width: 200px;\n  padding-left: 10px !important;\n  padding-right: 10px !important;\n  text-align: center !important;\n}\n\n/* line 34, src/styles/common/_widget.scss */\n\n.instagram-col {\n  padding: 0 !important;\n  margin: 0 !important;\n}\n\n/* line 39, src/styles/common/_widget.scss */\n\n.instagram-wrap {\n  margin: 0 !important;\n}\n\n/* line 44, src/styles/common/_widget.scss */\n\n.witget-subscribe {\n  background: #fff;\n  border: 5px solid transparent;\n  padding: 28px 30px;\n  position: relative;\n}\n\n/* line 50, src/styles/common/_widget.scss */\n\n.witget-subscribe::before {\n  content: \"\";\n  border: 5px solid #f5f5f5;\n  box-shadow: inset 0 0 0 1px #d7d7d7;\n  box-sizing: border-box;\n  display: block;\n  height: calc(100% + 10px);\n  left: -5px;\n  pointer-events: none;\n  position: absolute;\n  top: -5px;\n  width: calc(100% + 10px);\n  z-index: 1;\n}\n\n/* line 65, src/styles/common/_widget.scss */\n\n.witget-subscribe input {\n  background: #fff;\n  border: 1px solid #e5e5e5;\n  color: rgba(0, 0, 0, 0.54);\n  height: 41px;\n  outline: 0;\n  padding: 0 16px;\n  width: 100%;\n}\n\n/* line 75, src/styles/common/_widget.scss */\n\n.witget-subscribe button {\n  background: var(--composite-color);\n  border-radius: 0;\n  width: 100%;\n}\n\n","/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tcolor: black;\n\tbackground: none;\n\ttext-shadow: 0 1px white;\n\tfont-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n\ttext-align: left;\n\twhite-space: pre;\n\tword-spacing: normal;\n\tword-break: normal;\n\tword-wrap: normal;\n\tline-height: 1.5;\n\n\t-moz-tab-size: 4;\n\t-o-tab-size: 4;\n\ttab-size: 4;\n\n\t-webkit-hyphens: none;\n\t-moz-hyphens: none;\n\t-ms-hyphens: none;\n\thyphens: none;\n}\n\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\n@media print {\n\tcode[class*=\"language-\"],\n\tpre[class*=\"language-\"] {\n\t\ttext-shadow: none;\n\t}\n}\n\n/* Code blocks */\npre[class*=\"language-\"] {\n\tpadding: 1em;\n\tmargin: .5em 0;\n\toverflow: auto;\n}\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tbackground: #f5f2f0;\n}\n\n/* Inline code */\n:not(pre) > code[class*=\"language-\"] {\n\tpadding: .1em;\n\tborder-radius: .3em;\n\twhite-space: normal;\n}\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n\tcolor: slategray;\n}\n\n.token.punctuation {\n\tcolor: #999;\n}\n\n.namespace {\n\topacity: .7;\n}\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n\tcolor: #905;\n}\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n\tcolor: #690;\n}\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n\tcolor: #9a6e3a;\n\tbackground: hsla(0, 0%, 100%, .5);\n}\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n\tcolor: #07a;\n}\n\n.token.function,\n.token.class-name {\n\tcolor: #DD4A68;\n}\n\n.token.regex,\n.token.important,\n.token.variable {\n\tcolor: #e90;\n}\n\n.token.important,\n.token.bold {\n\tfont-weight: bold;\n}\n.token.italic {\n\tfont-style: italic;\n}\n\n.token.entity {\n\tcursor: help;\n}\n","pre[class*=\"language-\"].line-numbers {\n\tposition: relative;\n\tpadding-left: 3.8em;\n\tcounter-reset: linenumber;\n}\n\npre[class*=\"language-\"].line-numbers > code {\n\tposition: relative;\n\twhite-space: inherit;\n}\n\n.line-numbers .line-numbers-rows {\n\tposition: absolute;\n\tpointer-events: none;\n\ttop: 0;\n\tfont-size: 100%;\n\tleft: -3.8em;\n\twidth: 3em; /* works for line-numbers below 1000 lines */\n\tletter-spacing: -1px;\n\tborder-right: 1px solid #999;\n\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n\n}\n\n\t.line-numbers-rows > span {\n\t\tpointer-events: none;\n\t\tdisplay: block;\n\t\tcounter-increment: linenumber;\n\t}\n\n\t\t.line-numbers-rows > span:before {\n\t\t\tcontent: counter(linenumber);\n\t\t\tcolor: #999;\n\t\t\tdisplay: block;\n\t\t\tpadding-right: 0.8em;\n\t\t\ttext-align: right;\n\t\t}\n",":root {\n  --black: #000;\n  --white: #fff;\n  --primary-color: #1C9963;\n  --secondary-color: #2ad88d;\n  --header-color: #BBF1B9;\n  --header-color-hover: #EEFFEA;\n  --post-color-link: #2ad88d;\n  --story-cover-category-color: #2ad88d;\n  --composite-color: #CC116E;\n  --footer-color-link: #2ad88d;\n  --media-type-color: #2ad88d;\n}\n\n*, *::before, *::after {\n  box-sizing: border-box;\n}\n\na {\n  color: inherit;\n  text-decoration: none;\n\n  &:active,\n  &:hover {\n    outline: 0;\n  }\n}\n\nblockquote {\n  border-left: 3px solid #000;\n  color: #000;\n  font-family: $secundary-font;\n  font-size: 1.1875rem;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin: 30px 0 0 -12px;\n  padding-bottom: 2px;\n  padding-left: 20px;\n\n  p:first-of-type { margin-top: 0 }\n}\n\nbody {\n  color: $primary-text-color;\n  font-family: $primary-font;\n  font-size: $font-size-base;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin: 0 auto;\n  text-rendering: optimizeLegibility;\n  overflow-x: hidden;\n}\n\n//Default styles\nhtml {\n  box-sizing: border-box;\n  font-size: $font-size-root;\n}\n\nfigure {\n  margin: 0;\n}\n\nfigcaption {\n  color: rgba(0, 0, 0, .68);\n  display: block;\n  font-family: $secundary-font;\n  font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%;\n}\n\n// Code\n// ==========================================================================\nkbd, samp, code {\n  background: $code-bg-color;\n  border-radius: 4px;\n  color: $code-color;\n  font-family: $code-font !important;\n  font-size: $font-size-code;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\npre {\n  background-color: $code-bg-color !important;\n  border-radius: 4px;\n  font-family: $code-font !important;\n  font-size: $font-size-code;\n  margin-top: 30px !important;\n  max-width: 100%;\n  overflow: hidden;\n  padding: 1rem;\n  position: relative;\n  word-wrap: normal;\n\n  code {\n    background: transparent;\n    color: $pre-code-color;\n    padding: 0;\n    text-shadow: 0 1px #fff;\n  }\n}\n\ncode[class*=language-],\npre[class*=language-] {\n  color: $pre-code-color;\n  line-height: 1.4;\n\n  .token.comment { opacity: .8; }\n\n  &.line-numbers {\n    padding-left: 58px;\n\n    &::before {\n      content: \"\";\n      position: absolute;\n      left: 0;\n      top: 0;\n      background: #F0EDEE;\n      width: 40px;\n      height: 100%;\n    }\n  }\n\n  .line-numbers-rows {\n    border-right: none;\n    top: -3px;\n    left: -58px;\n\n    & > span::before {\n      padding-right: 0;\n      text-align: center;\n      opacity: .8;\n    }\n  }\n}\n\n// hr\n// ==========================================================================\nhr:not(.hr-list):not(.post-footer-hr) {\n  border: 0;\n  display: block;\n  margin: 50px auto;\n  text-align: center;\n\n  &::before {\n    color: rgba(0, 0, 0, .6);\n    content: '...';\n    display: inline-block;\n    font-family: $primary-font;\n    font-size: 28px;\n    font-weight: 400;\n    letter-spacing: .6em;\n    position: relative;\n    top: -25px;\n  }\n}\n\n.post-footer-hr {\n  height: 1px;\n  margin: 32px 0;\n  border: 0;\n  background-color: #ddd;\n}\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n\n  &:not([src]) {\n    visibility: hidden;\n  }\n}\n\ni {\n  // display: inline-block;\n  vertical-align: middle;\n}\n\ninput {\n  border: none;\n  outline: 0;\n}\n\nol, ul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0;\n}\n\nmark {\n  background-color: transparent !important;\n  background-image: linear-gradient(to bottom, rgba(215, 253, 211, 1), rgba(215, 253, 211, 1));\n  color: rgba(0, 0, 0, .8);\n}\n\nq {\n  color: rgba(0, 0, 0, .44);\n  display: block;\n  font-size: 28px;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.014em;\n  line-height: 1.48;\n  padding-left: 50px;\n  padding-top: 15px;\n  text-align: left;\n\n  &::before, &::after { display: none; }\n}\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch;\n\n  th,\n  td {\n    padding: 6px 13px;\n    border: 1px solid #dfe2e5;\n  }\n\n  tr:nth-child(2n) {\n    background-color: #f6f8fa;\n  }\n\n  th {\n    letter-spacing: 0.2px;\n    text-transform: uppercase;\n    font-weight: 600;\n  }\n}\n\n// Links color\n// ==========================================================================\n.link--accent { @extend %link--accent; }\n\n.link { @extend %link; }\n\n.link--underline {\n  &:active,\n  &:focus,\n  &:hover {\n    // color: inherit;\n    text-decoration: underline;\n  }\n}\n\n// Animation main page and footer\n// ==========================================================================\n.main { margin-bottom: 4em; min-height: 90vh }\n\n.main,\n.footer { transition: transform .5s ease; }\n\n// warning success and Note\n// ==========================================================================\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n  &::before { content: $i-warning; }\n}\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n  &::before { content: $i-star; }\n}\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n  &::before { color: #00bfa5; content: $i-check; }\n}\n\n.warning, .note, .success {\n  display: block;\n  font-size: 18px !important;\n  line-height: 1.58 !important;\n  margin-top: 28px;\n  padding: 12px 24px 12px 60px;\n\n  a {\n    color: inherit;\n    text-decoration: underline;\n  }\n\n  &::before {\n    @extend %fonts-icons;\n\n    float: left;\n    font-size: 24px;\n    margin-left: -36px;\n    margin-top: -5px;\n  }\n}\n\n// Page Tags\n// ==========================================================================\n.tag {\n  &-description { max-width: 500px }\n  &.has--image { min-height: 350px }\n}\n\n// toltip\n// ==========================================================================\n.with-tooltip {\n  overflow: visible;\n  position: relative;\n\n  &::after {\n    background: rgba(0, 0, 0, .85);\n    border-radius: 4px;\n    color: #fff;\n    content: attr(data-tooltip);\n    display: inline-block;\n    font-size: 12px;\n    font-weight: 600;\n    left: 50%;\n    line-height: 1.25;\n    min-width: 130px;\n    opacity: 0;\n    padding: 4px 8px;\n    pointer-events: none;\n    position: absolute;\n    text-align: center;\n    text-transform: none;\n    top: -30px;\n    will-change: opacity, transform;\n    z-index: 1;\n  }\n\n  &:hover::after {\n    animation: tooltip .1s ease-out both;\n  }\n}\n\n// Error page\n// ==========================================================================\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n\n  &-link {\n    left: -5px;\n    padding: 24px 60px;\n    top: -6px;\n  }\n\n  &-text {\n    margin-top: 60px;\n    white-space: pre-wrap;\n  }\n\n  &-wrap {\n    color: rgba(0, 0, 0, .4);\n    padding: 7vw 4vw;\n  }\n}\n\n// Video Responsive\n// ==========================================================================\n.video-responsive {\n  display: block;\n  height: 0;\n  margin-top: 30px;\n  overflow: hidden;\n  padding: 0 0 56.25%;\n  position: relative;\n  width: 100%;\n\n  iframe {\n    border: 0;\n    bottom: 0;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%;\n  }\n\n  video {\n    border: 0;\n    bottom: 0;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%;\n  }\n}\n\n.kg-embed-card .video-responsive { margin-top: 0 }\n\n// Social Media Color\n// ==========================================================================\n@each $social-name, $color in $social-colors {\n  .c-#{$social-name} { color: $color !important; }\n  .bg-#{$social-name} { background-color: $color !important; }\n}\n\n// Facebook Save\n// ==========================================================================\n// .fbSave {\n//   &-dropdown {\n//     background-color: #fff;\n//     border: 1px solid #e0e0e0;\n//     bottom: 100%;\n//     display: none;\n//     max-width: 200px;\n//     min-width: 100px;\n//     padding: 8px;\n//     transform: translate(-50%, 0);\n//     z-index: 10;\n\n//     &.is-visible { display: block; }\n//   }\n// }\n\n// Rocket for return top page\n// ==========================================================================\n.rocket {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  width: 60px;\n  z-index: 5;\n\n  &:hover svg path {\n    fill: rgba(0, 0, 0, .6);\n  }\n}\n\n.svgIcon {\n  display: inline-block;\n}\n\nsvg {\n  height: auto;\n  width: 100%;\n}\n\n// Pagination Infinite Scroll\n// ==========================================================================\n\n.load-more { max-width: 70% !important }\n\n// loadingBar\n// ==========================================================================\n\n.loadingBar {\n  background-color: #48e79a;\n  display: none;\n  height: 2px;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  z-index: 800;\n}\n\n.is-loading .loadingBar {\n  animation: loading-bar 1s ease-in-out infinite;\n  animation-delay: .8s;\n  display: block;\n}\n\n// Media Query responsinve\n// ==========================================================================\n@media #{$md-and-down} {\n  blockquote { margin-left: -5px; font-size: 1.125rem }\n\n  .kg-image-card,\n  .kg-embed-card {\n    margin-right: -20px;\n    margin-left: -20px;\n  }\n}\n","%link {\n  color: inherit;\n  cursor: pointer;\n  text-decoration: none;\n}\n\n%link--accent {\n  color: var(--primary-color);\n  text-decoration: none;\n  // &:hover { color: $primary-color-hover; }\n}\n\n%content-absolute-bottom {\n  bottom: 0;\n  left: 0;\n  margin: 30px;\n  max-width: 600px;\n  position: absolute;\n  z-index: 2;\n}\n\n%u-absolute0 {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n%u-text-color-darker {\n  color: rgba(0, 0, 0, .8) !important;\n  fill: rgba(0, 0, 0, .8) !important;\n}\n\n%fonts-icons {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important; /* stylelint-disable-line */\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n","// stylelint-disable\r\nimg[data-action=\"zoom\"] {\r\n  cursor: zoom-in;\r\n}\r\n.zoom-img,\r\n.zoom-img-wrap {\r\n  position: relative;\r\n  z-index: 666;\r\n  -webkit-transition: all 300ms;\r\n       -o-transition: all 300ms;\r\n          transition: all 300ms;\r\n}\r\nimg.zoom-img {\r\n  cursor: pointer;\r\n  cursor: -webkit-zoom-out;\r\n  cursor: -moz-zoom-out;\r\n}\r\n.zoom-overlay {\r\n  z-index: 420;\r\n  background: #fff;\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  pointer-events: none;\r\n  filter: \"alpha(opacity=0)\";\r\n  opacity: 0;\r\n  -webkit-transition:      opacity 300ms;\r\n       -o-transition:      opacity 300ms;\r\n          transition:      opacity 300ms;\r\n}\r\n.zoom-overlay-open .zoom-overlay {\r\n  filter: \"alpha(opacity=100)\";\r\n  opacity: 1;\r\n}\r\n.zoom-overlay-open,\r\n.zoom-overlay-transitioning {\r\n  cursor: default;\r\n}\r\n","// Container\n.extreme-container {\n  box-sizing: border-box;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding: 0 16px;\n  width: 100%;\n}\n\n// @media #{$lg-and-up} {\n//   .content {\n//     // flex: 1 !important;\n//     max-width: calc(100% - 340px) !important;\n//     // order: 1;\n//     // overflow: hidden;\n//   }\n\n//   .sidebar {\n//     width: 340px !important;\n//     // flex: 0 0 340px !important;\n//     // order: 2;\n//   }\n// }\n\n.col-left,\n.cc-video-left {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%;\n  padding-right: 10px;\n  padding-left: 10px;\n}\n\n// @media #{$md-and-up} {\n// }\n\n@media #{$lg-and-up} {\n  .col-left { max-width: calc(100% - 340px) }\n  .cc-video-left { max-width: calc(100% - 320px) }\n  .cc-video-right { flex-basis: 320px !important; max-width: 320px !important; }\n  body.is-article .col-left { padding-right: 40px }\n}\n\n.col-right {\n  display: flex;\n  flex-direction: column;\n  padding-left: 10px;\n  padding-right: 10px;\n  width: 320px;\n}\n\n.row {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  flex: 0 1 auto;\n  margin-left: - 10px;\n  margin-right: - 10px;\n\n  .col {\n    flex: 0 0 auto;\n    box-sizing: border-box;\n    padding-left: 10px;\n    padding-right: 10px;\n\n    $i: 1;\n\n    @while $i <= $num-cols {\n      $perc: unquote((100 / ($num-cols / $i)) + \"%\");\n\n      &.s#{$i} {\n        flex-basis: $perc;\n        max-width: $perc;\n      }\n\n      $i: $i + 1;\n    }\n\n    @media #{$md-and-up} {\n\n      $i: 1;\n\n      @while $i <= $num-cols {\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\n\n        &.m#{$i} {\n          flex-basis: $perc;\n          max-width: $perc;\n        }\n\n        $i: $i + 1;\n      }\n    }\n\n    @media #{$lg-and-up} {\n\n      $i: 1;\n\n      @while $i <= $num-cols {\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\n\n        &.l#{$i} {\n          flex-basis: $perc;\n          max-width: $perc;\n        }\n\n        $i: $i + 1;\n      }\n    }\n  }\n}\n","// Headings\r\n\r\nh1, h2, h3, h4, h5, h6 {\r\n  color: $headings-color;\r\n  font-family: $headings-font-family;\r\n  font-weight: $headings-font-weight;\r\n  line-height: $headings-line-height;\r\n  margin: 0;\r\n\r\n  a {\r\n    color: inherit;\r\n    line-height: inherit;\r\n  }\r\n}\r\n\r\nh1 { font-size: $font-size-h1; }\r\nh2 { font-size: $font-size-h2; }\r\nh3 { font-size: $font-size-h3; }\r\nh4 { font-size: $font-size-h4; }\r\nh5 { font-size: $font-size-h5; }\r\nh6 { font-size: $font-size-h6; }\r\n\r\np {\r\n  margin: 0;\r\n}\r\n","// color\n.u-textColorNormal {\n  // color: rgba(0, 0, 0, .44) !important;\n  // fill: rgba(0, 0, 0, .44) !important;\n  color: rgba(153, 153, 153, 1) !important;\n  fill: rgba(153, 153, 153, 1) !important;\n}\n\n.u-textColorWhite {\n  color: #fff !important;\n  fill: #fff !important;\n}\n\n.u-hoverColorNormal:hover {\n  color: rgba(0, 0, 0, .6);\n  fill: rgba(0, 0, 0, .6);\n}\n\n.u-accentColor--iconNormal {\n  color: $primary-color;\n  fill: $primary-color;\n}\n\n//  background color\n.u-bgColor { background-color: var(--primary-color); }\n\n.u-textColorDarker { @extend %u-text-color-darker; }\n\n// Positions\n.u-relative { position: relative; }\n.u-absolute { position: absolute; }\n.u-absolute0 { @extend %u-absolute0; }\n.u-fixed { position: fixed !important; }\n\n.u-block { display: block !important }\n.u-inlineBlock { display: inline-block }\n\n//  Background\n.u-backgroundDark {\n  // background: linear-gradient(to bottom, rgba(0, 0, 0, .3) 29%, rgba(0, 0, 0, .6) 81%);\n  background-color: #0d0f10;\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n\n.u-gradient {\n  background: linear-gradient(to bottom, transparent 20%, #000 100%);\n  bottom: 0;\n  height: 90%;\n  left: 0;\n  position: absolute;\n  right: 0;\n  z-index: 1;\n}\n\n// zindex\n.zindex1 { z-index: 1 }\n.zindex2 { z-index: 2 }\n.zindex3 { z-index: 3 }\n.zindex4 { z-index: 4 }\n\n// .u-background-white { background-color: #eeefee; }\n.u-backgroundWhite { background-color: #fafafa }\n.u-backgroundColorGrayLight { background-color: #f0f0f0 !important; }\n\n// Clear\n.u-clear::after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n// font size\n.u-fontSizeMicro { font-size: 11px }\n.u-fontSizeSmallest { font-size: 12px }\n.u-fontSize13 { font-size: 13px }\n.u-fontSizeSmaller { font-size: 14px }\n.u-fontSize15 { font-size: 15px }\n.u-fontSizeSmall { font-size: 16px }\n.u-fontSizeBase { font-size: 18px }\n.u-fontSize20 { font-size: 20px }\n.u-fontSize21 { font-size: 21px }\n.u-fontSize22 { font-size: 22px }\n.u-fontSizeLarge { font-size: 24px }\n.u-fontSize26 { font-size: 26px }\n.u-fontSize28 { font-size: 28px }\n.u-fontSizeLarger { font-size: 32px }\n.u-fontSize36 { font-size: 36px }\n.u-fontSize40 { font-size: 40px }\n.u-fontSizeLargest { font-size: 44px }\n.u-fontSizeJumbo { font-size: 50px }\n\n@media #{$md-and-down} {\n  .u-md-fontSizeBase { font-size: 18px }\n  .u-md-fontSize22 { font-size: 22px }\n  .u-md-fontSizeLarger { font-size: 32px }\n}\n\n// @media (max-width: 767px) {\n//   .u-xs-fontSizeBase {font-size: 18px}\n//   .u-xs-fontSize13 {font-size: 13px}\n//   .u-xs-fontSizeSmaller {font-size: 14px}\n//   .u-xs-fontSizeSmall {font-size: 16px}\n//   .u-xs-fontSize22 {font-size: 22px}\n//   .u-xs-fontSizeLarge {font-size: 24px}\n//   .u-xs-fontSize40 {font-size: 40px}\n//   .u-xs-fontSizeLarger {font-size: 32px}\n//   .u-xs-fontSizeSmallest {font-size: 12px}\n// }\n\n// font weight\n.u-fontWeightThin { font-weight: 300 }\n.u-fontWeightNormal { font-weight: 400 }\n// .u-fontWeightMedium { font-weight: 500 }\n.u-fontWeightSemibold { font-weight: 600 !important }\n.u-fontWeightBold { font-weight: 700 }\n.u-fontWeightBolder { font-weight: 900 }\n\n.u-textUppercase { text-transform: uppercase }\n.u-textCapitalize { text-transform: capitalize }\n.u-textAlignCenter { text-align: center }\n\n.u-noWrapWithEllipsis {\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important;\n}\n\n// Margin\n.u-marginAuto { margin-left: auto; margin-right: auto; }\n.u-marginTop20 { margin-top: 20px }\n.u-marginTop30 { margin-top: 30px }\n.u-marginBottom10 { margin-bottom: 10px }\n.u-marginBottom15 { margin-bottom: 15px }\n.u-marginBottom20 { margin-bottom: 20px !important }\n.u-marginBottom30 { margin-bottom: 30px }\n.u-marginBottom40 { margin-bottom: 40px }\n\n// padding\n.u-padding0 { padding: 0 !important }\n.u-padding20 { padding: 20px }\n.u-padding15 { padding: 15px !important; }\n.u-paddingBottom2 { padding-bottom: 2px; }\n.u-paddingBottom30 { padding-bottom: 30px; }\n.u-paddingBottom20 { padding-bottom: 20px }\n.u-paddingRight10 { padding-right: 10px }\n.u-paddingLeft15 { padding-left: 15px }\n\n.u-paddingTop2 { padding-top: 2px }\n.u-paddingTop5 { padding-top: 5px; }\n.u-paddingTop10 { padding-top: 10px; }\n.u-paddingTop15 { padding-top: 15px; }\n.u-paddingTop20 { padding-top: 20px; }\n.u-paddingTop30 { padding-top: 30px; }\n\n.u-paddingBottom15 { padding-bottom: 15px; }\n\n.u-paddingRight20 { padding-right: 20px }\n.u-paddingLeft20 { padding-left: 20px }\n\n.u-contentTitle {\n  font-family: $primary-font;\n  font-style: normal;\n  font-weight: 900;\n  letter-spacing: -.028em;\n}\n\n// line-height\n.u-lineHeight1 { line-height: 1; }\n.u-lineHeightTight { line-height: 1.2 }\n\n// overflow\n.u-overflowHidden { overflow: hidden }\n\n// float\n.u-floatRight { float: right; }\n.u-floatLeft { float: left; }\n\n//  flex\n.u-flex { display: flex; }\n.u-flexCenter { align-items: center; display: flex; }\n.u-flexContentCenter { justify-content: center }\n// .u-flex--1 { flex: 1 }\n.u-flex1 { flex: 1 1 auto; }\n.u-flex0 { flex: 0 0 auto; }\n.u-flexWrap { flex-wrap: wrap }\n\n.u-flexColumn {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.u-flexEnd {\n  align-items: center;\n  justify-content: flex-end;\n}\n\n.u-flexColumnTop {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n}\n\n// Background\n.u-backgroundSizeCover {\n  background-origin: border-box;\n  background-position: center;\n  background-size: cover;\n}\n\n// max widht\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 20px;\n  padding-right: 20px;\n}\n\n.u-maxWidth1200 { max-width: 1200px }\n.u-maxWidth1000 { max-width: 1000px }\n.u-maxWidth740 { max-width: 740px }\n.u-maxWidth1040 { max-width: 1040px }\n.u-sizeFullWidth { width: 100% }\n.u-sizeFullHeight { height: 100% }\n\n// border\n.u-borderLighter { border: 1px solid rgba(0, 0, 0, .15); }\n.u-round { border-radius: 50% }\n.u-borderRadius2 { border-radius: 2px }\n\n.u-boxShadowBottom {\n  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, .05);\n}\n\n// Heinght\n.u-height540 { height: 540px }\n.u-height280 { height: 280px }\n.u-height260 { height: 260px }\n.u-height100 { height: 100px }\n.u-borderBlackLightest { border: 1px solid rgba(0, 0, 0, .1) }\n\n// hide global\n.u-hide { display: none !important }\n\n// card\n.u-card {\n  background: #fff;\n  border: 1px solid rgba(0, 0, 0, .09);\n  border-radius: 3px;\n  // box-shadow: 0 1px 4px rgba(0, 0, 0, .04);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\n  margin-bottom: 10px;\n  padding: 10px 20px 15px;\n}\n\n// title Line\n.title-line {\n  position: relative;\n  text-align: center;\n  width: 100%;\n\n  &::before {\n    content: '';\n    background: rgba(255, 255, 255, .3);\n    display: inline-block;\n    position: absolute;\n    left: 0;\n    bottom: 50%;\n    width: 100%;\n    height: 1px;\n    z-index: 0;\n  }\n}\n\n// Obblique\n.u-oblique {\n  background-color: var(--composite-color);\n  color: #fff;\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 700;\n  line-height: 1;\n  padding: 5px 13px;\n  text-transform: uppercase;\n  transform: skewX(-15deg);\n}\n\n.no-avatar {\n  background-image: url('../images/avatar.png') !important\n}\n\n@media #{$md-and-down} {\n  .u-hide-before-md { display: none !important }\n  .u-md-heightAuto { height: auto; }\n  .u-md-height170 { height: 170px }\n  .u-md-relative { position: relative }\n}\n\n@media #{$lg-and-down} { .u-hide-before-lg { display: none !important } }\n\n// hide after\n@media #{$md-and-up} { .u-hide-after-md { display: none !important } }\n\n@media #{$lg-and-up} { .u-hide-after-lg { display: none !important } }\n",".button {\n  background: rgba(0, 0, 0, 0);\n  border: 1px solid rgba(0, 0, 0, .15);\n  border-radius: 4px;\n  box-sizing: border-box;\n  color: rgba(0, 0, 0, .44);\n  cursor: pointer;\n  display: inline-block;\n  font-family: $primary-font;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  height: 37px;\n  letter-spacing: 0;\n  line-height: 35px;\n  padding: 0 16px;\n  position: relative;\n  text-align: center;\n  text-decoration: none;\n  text-rendering: optimizeLegibility;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap;\n\n  &--chromeless {\n    border-radius: 0;\n    border-width: 0;\n    box-shadow: none;\n    color: rgba(0, 0, 0, .44);\n    height: auto;\n    line-height: inherit;\n    padding: 0;\n    text-align: left;\n    vertical-align: baseline;\n    white-space: normal;\n\n    &:active,\n    &:hover,\n    &:focus {\n      border-width: 0;\n      color: rgba(0, 0, 0, .6);\n    }\n  }\n\n  &--large {\n    font-size: 15px;\n    height: 44px;\n    line-height: 42px;\n    padding: 0 18px;\n  }\n\n  &--dark {\n    background: rgba(0, 0, 0, .84);\n    border-color: rgba(0, 0, 0, .84);\n    color: rgba(255, 255, 255, .97);\n\n    &:hover {\n      background: $primary-color;\n      border-color: $primary-color;\n    }\n  }\n}\n\n// Primary\n.button--primary {\n  border-color: $primary-color;\n  color: $primary-color;\n}\n\n.button--large.button--chromeless,\n.button--large.button--link {\n  padding: 0;\n}\n\n.buttonSet {\n  > .button {\n    margin-right: 8px;\n    vertical-align: middle;\n  }\n\n  > .button:last-child {\n    margin-right: 0;\n  }\n\n  .button--chromeless {\n    height: 37px;\n    line-height: 35px;\n  }\n\n  .button--large.button--chromeless,\n  .button--large.button--link {\n    height: 44px;\n    line-height: 42px;\n  }\n\n  & > .button--chromeless:not(.button--circle) {\n    margin-right: 0;\n    padding-right: 8px;\n  }\n\n  & > .button--chromeless:last-child {\n    padding-right: 0;\n  }\n\n  & > .button--chromeless + .button--chromeless:not(.button--circle) {\n    margin-left: 0;\n    padding-left: 8px;\n  }\n}\n\n.button--circle {\n  background-image: none !important;\n  border-radius: 50%;\n  color: #fff;\n  height: 40px;\n  line-height: 38px;\n  padding: 0;\n  text-decoration: none;\n  width: 40px;\n}\n\n// Btn for tag cloud or category\n// ==========================================================================\n.tag-button {\n  background: rgba(0, 0, 0, .05);\n  border: none;\n  color: rgba(0, 0, 0, .68);\n  font-weight: 700;\n  margin: 0 8px 8px 0;\n\n  &:hover {\n    background: rgba(0, 0, 0, .1);\n    color: rgba(0, 0, 0, .68);\n  }\n}\n\n// button dark line\n// ==========================================================================\n.button--dark-line {\n  border: 1px solid #000;\n  color: #000;\n  display: block;\n  font-weight: 600;\n  margin: 50px auto 0;\n  max-width: 300px;\n  text-transform: uppercase;\n  transition: color .3s ease, box-shadow .3s cubic-bezier(.455, .03, .515, .955);\n\n  &:hover {\n    color: #fff;\n    box-shadow: inset 0 -50px 8px -4px #000;\n  }\n}\n","// stylelint-disable\n@font-face {\n  font-family: 'mapache';\n  src:  url('../fonts/mapache.eot?25764j');\n  src:  url('../fonts/mapache.eot?25764j#iefix') format('embedded-opentype'),\n    url('../fonts/mapache.ttf?25764j') format('truetype'),\n    url('../fonts/mapache.woff?25764j') format('woff'),\n    url('../fonts/mapache.svg?25764j#mapache') format('svg');\n  font-weight: normal;\n  font-style: normal;\n}\n\n[class^=\"i-\"]::before, [class*=\" i-\"]::before {\n  @extend %fonts-icons;\n}\n\n.i-tag:before {\n  content: \"\\e911\";\n}\n.i-discord:before {\n  content: \"\\e90a\";\n}\n.i-arrow-round-next:before {\n  content: \"\\e90c\";\n}\n.i-arrow-round-prev:before {\n  content: \"\\e90d\";\n}\n.i-arrow-round-up:before {\n  content: \"\\e90e\";\n}\n.i-arrow-round-down:before {\n  content: \"\\e90f\";\n}\n.i-photo:before {\n  content: \"\\e90b\";\n}\n.i-send:before {\n  content: \"\\e909\";\n}\n.i-audio:before {\n  content: \"\\e901\";\n}\n.i-rocket:before {\n  content: \"\\e902\";\n  color: #999;\n}\n.i-comments-line:before {\n  content: \"\\e900\";\n}\n.i-globe:before {\n  content: \"\\e906\";\n}\n.i-star:before {\n  content: \"\\e907\";\n}\n.i-link:before {\n  content: \"\\e908\";\n}\n.i-star-line:before {\n  content: \"\\e903\";\n}\n.i-more:before {\n  content: \"\\e904\";\n}\n.i-search:before {\n  content: \"\\e905\";\n}\n.i-chat:before {\n  content: \"\\e910\";\n}\n.i-arrow-left:before {\n  content: \"\\e314\";\n}\n.i-arrow-right:before {\n  content: \"\\e315\";\n}\n.i-play:before {\n  content: \"\\e037\";\n}\n.i-location:before {\n  content: \"\\e8b4\";\n}\n.i-check-circle:before {\n  content: \"\\e86c\";\n}\n.i-close:before {\n  content: \"\\e5cd\";\n}\n.i-favorite:before {\n  content: \"\\e87d\";\n}\n.i-warning:before {\n  content: \"\\e002\";\n}\n.i-rss:before {\n  content: \"\\e0e5\";\n}\n.i-share:before {\n  content: \"\\e80d\";\n}\n.i-email:before {\n  content: \"\\f0e0\";\n}\n.i-google:before {\n  content: \"\\f1a0\";\n}\n.i-telegram:before {\n  content: \"\\f2c6\";\n}\n.i-reddit:before {\n  content: \"\\f281\";\n}\n.i-twitter:before {\n  content: \"\\f099\";\n}\n.i-github:before {\n  content: \"\\f09b\";\n}\n.i-linkedin:before {\n  content: \"\\f0e1\";\n}\n.i-youtube:before {\n  content: \"\\f16a\";\n}\n.i-stack-overflow:before {\n  content: \"\\f16c\";\n}\n.i-instagram:before {\n  content: \"\\f16d\";\n}\n.i-flickr:before {\n  content: \"\\f16e\";\n}\n.i-dribbble:before {\n  content: \"\\f17d\";\n}\n.i-behance:before {\n  content: \"\\f1b4\";\n}\n.i-spotify:before {\n  content: \"\\f1bc\";\n}\n.i-codepen:before {\n  content: \"\\f1cb\";\n}\n.i-facebook:before {\n  content: \"\\f230\";\n}\n.i-pinterest:before {\n  content: \"\\f231\";\n}\n.i-whatsapp:before {\n  content: \"\\f232\";\n}\n.i-snapchat:before {\n  content: \"\\f2ac\";\n}\n","// animated Global\n.animated {\n  animation-duration: 1s;\n  animation-fill-mode: both;\n\n  &.infinite {\n    animation-iteration-count: infinite;\n  }\n}\n\n// animated All\n.bounceIn { animation-name: bounceIn; }\n.bounceInDown { animation-name: bounceInDown; }\n.pulse { animation-name: pulse; }\n.slideInUp { animation-name: slideInUp }\n.slideOutDown { animation-name: slideOutDown }\n\n// all keyframes Animates\n// bounceIn\n@keyframes bounceIn {\n  0%,\n  20%,\n  40%,\n  60%,\n  80%,\n  100% { animation-timing-function: cubic-bezier(.215, .61, .355, 1); }\n  0% { opacity: 0; transform: scale3d(.3, .3, .3); }\n  20% { transform: scale3d(1.1, 1.1, 1.1); }\n  40% { transform: scale3d(.9, .9, .9); }\n  60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); }\n  80% { transform: scale3d(.97, .97, .97); }\n  100% { opacity: 1; transform: scale3d(1, 1, 1); }\n}\n\n// bounceInDown\n@keyframes bounceInDown {\n  0%,\n  60%,\n  75%,\n  90%,\n  100% { animation-timing-function: cubic-bezier(215, 610, 355, 1); }\n  0% { opacity: 0; transform: translate3d(0, -3000px, 0); }\n  60% { opacity: 1; transform: translate3d(0, 25px, 0); }\n  75% { transform: translate3d(0, -10px, 0); }\n  90% { transform: translate3d(0, 5px, 0); }\n  100% { transform: none; }\n}\n\n@keyframes pulse {\n  from { transform: scale3d(1, 1, 1); }\n  50% { transform: scale3d(1.2, 1.2, 1.2); }\n  to { transform: scale3d(1, 1, 1); }\n}\n\n@keyframes scroll {\n  0% { opacity: 0; }\n  10% { opacity: 1; transform: translateY(0) }\n  100% { opacity: 0; transform: translateY(10px); }\n}\n\n@keyframes opacity {\n  0% { opacity: 0; }\n  50% { opacity: 0; }\n  100% { opacity: 1; }\n}\n\n//  spin for pagination\n@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}\n\n@keyframes tooltip {\n  0% { opacity: 0; transform: translate(-50%, 6px); }\n  100% { opacity: 1; transform: translate(-50%, 0); }\n}\n\n@keyframes loading-bar {\n  0% { transform: translateX(-100%) }\n  40% { transform: translateX(0) }\n  60% { transform: translateX(0) }\n  100% { transform: translateX(100%) }\n}\n\n// Arrow move left\n@keyframes arrow-move-right {\n  0% { opacity: 0 }\n  10% { transform: translateX(-100%); opacity: 0 }\n  100% { transform: translateX(0); opacity: 1 }\n}\n\n@keyframes arrow-move-left {\n  0% { opacity: 0 }\n  10% { transform: translateX(100%); opacity: 0 }\n  100% { transform: translateX(0); opacity: 1 }\n}\n\n@keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0);\n  }\n}\n","// Header\n// ==========================================================================\n\n.header-logo,\n.menu--toggle,\n.search-toggle {\n  z-index: 15;\n}\n\n.header {\n  box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n  padding: 0 16px;\n  position: sticky;\n  top: 0;\n  transition: all 0.4s ease-in-out;\n  z-index: 10;\n\n  &-wrap { height: $header-height; }\n\n  &-logo {\n    color: #fff !important;\n    height: 30px;\n\n    img { max-height: 100%; }\n  }\n}\n\n// not have logo\n.not-logo .header-logo { height: auto !important }\n\n// Header line separate\n.header-line {\n  height: $header-height;\n  border-right: 1px solid rgba(255, 255, 255, .3);\n  display: inline-block;\n  margin-right: 10px;\n}\n\n// Header Follow More\n// ==========================================================================\n.follow-more {\n  transition: width .4s ease;\n  overflow: hidden;\n  width: 0;\n}\n\nbody.is-showFollowMore {\n  .follow-more { width: auto }\n  .follow-toggle { color: var(--header-color-hover) }\n  .follow-toggle::before { content: \"\\e5cd\" }\n}\n\n// Header menu\n// ==========================================================================\n\n.nav {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  position: relative;\n  overflow: hidden;\n\n  ul {\n    display: flex;\n    margin-right: 20px;\n    overflow: hidden;\n    white-space: nowrap;\n  }\n}\n\n.header-left a,\n.nav ul li a {\n  border-radius: 3px;\n  color: var(--header-color);\n  display: inline-block;\n  font-weight: 600;\n  line-height: 30px;\n  padding: 0 8px;\n  text-align: center;\n  text-transform: uppercase;\n  vertical-align: middle;\n\n  &.active,\n  &:hover {\n    color: var(--header-color-hover);\n  }\n}\n\n// button-nav\n.menu--toggle {\n  height: 48px;\n  position: relative;\n  transition: transform .4s;\n  width: 48px;\n\n  span {\n    background-color: var(--header-color);\n    display: block;\n    height: 2px;\n    left: 14px;\n    margin-top: -1px;\n    position: absolute;\n    top: 50%;\n    transition: .4s;\n    width: 20px;\n\n    &:first-child { transform: translate(0, -6px); }\n    &:last-child { transform: translate(0, 6px); }\n  }\n}\n\n// Header menu\n// ==========================================================================\n\n@media #{$md-and-down} {\n  .header-left { flex-grow: 1 !important; }\n  .header-logo span { font-size: 24px }\n\n  // show menu mobile\n  body.is-showNavMob {\n    overflow: hidden;\n\n    .sideNav { transform: translateX(0); }\n\n    .menu--toggle {\n      border: 0;\n      transform: rotate(90deg);\n\n      span:first-child { transform: rotate(45deg) translate(0, 0); }\n      span:nth-child(2) { transform: scaleX(0); }\n      span:last-child { transform: rotate(-45deg) translate(0, 0); }\n    }\n\n    .header .button-search--toggle { display: none; }\n    .main, .footer { transform: translateX(-25%) !important; }\n  }\n}\n","// Footer\n// ==========================================================================\n\n.footer {\n  color: #888;\n\n  a {\n    color: var(--footer-color-link);\n    &:hover { color: #fff }\n  }\n\n  &-links {\n    padding: 3em 0 2.5em;\n    background-color: #131313;\n  }\n\n  .follow > a {\n    background: #333;\n    border-radius: 50%;\n    color: inherit;\n    display: inline-block;\n    height: 40px;\n    line-height: 40px;\n    margin: 0 5px 8px;\n    text-align: center;\n    width: 40px;\n\n    &:hover {\n      background: transparent;\n      box-shadow: inset 0 0 0 2px #333;\n    }\n  }\n\n  &-copy {\n    padding: 3em 0;\n    background-color: #000;\n  }\n}\n\n.footer-menu {\n  li {\n    display: inline-block;\n    line-height: 24px;\n    margin: 0 8px;\n\n    /* stylelint-disable-next-line */\n    a { color: #888 }\n  }\n}\n","// Home Page Styles\n// ==========================================================================\n.cover {\n  padding: 4px;\n\n  &-story {\n    overflow: hidden;\n    height: 250px;\n    width: 100%;\n\n    &:hover .cover-header { background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%) }\n\n    &.firts { height: 80vh }\n  }\n\n  &-img,\n  &-link {\n    bottom: 4px;\n    left: 4px;\n    right: 4px;\n    top: 4px;\n  }\n\n  // stylelint-disable-next-line\n  &-header {\n    bottom: 4px;\n    left: 4px;\n    right: 4px;\n    padding: 50px 3.846153846% 20px;\n    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, .9) 100%);\n  }\n}\n\n// Home Page Personal Cover page\n// ==========================================================================\n.hm-cover {\n  padding: 30px 0;\n  min-height: 100vh;\n\n  &-title {\n    font-size: 2.5rem;\n    font-weight: 900;\n    line-height: 1;\n  }\n\n  &-des {\n    max-width: 600px;\n    font-size: 1.25rem;\n  }\n}\n\n.hm-subscribe {\n  background-color: transparent;\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px hsla(0, 0%, 100%, .5);\n  color: #fff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  padding: 15px 10px;\n  transition: all .3s;\n  width: 100%;\n\n  &:hover {\n    box-shadow: inset 0 0 0 2px #fff;\n  }\n}\n\n.hm-down {\n  animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: hsla(0, 0%, 100%, .5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100;\n\n  svg {\n    display: block;\n    fill: currentcolor;\n    height: auto;\n    width: 100%;\n  }\n}\n\n// Media Query\n// ==========================================================================\n@media #{$md-and-up} {\n  .cover {\n    height: 70vh;\n\n    &-story {\n      height: 50%;\n      width: 33.33333%;\n\n      &.firts {\n        height: 100%;\n        width: 66.66666%;\n\n        .cover-title { font-size: 2.5rem }\n      }\n    }\n  }\n\n  // Home page\n  .hm-cover-title { font-size: 3.5rem }\n}\n","// post content\n// ==========================================================================\n\n.post {\n  // title\n  &-title {\n    color: #000;\n    line-height: 1.2;\n    font-weight: 900;\n    max-width: 1000px;\n  }\n\n  &-excerpt {\n    color: #555;\n    font-family: $secundary-font;\n    font-weight: 300;\n    letter-spacing: -.012em;\n    line-height: 1.6;\n  }\n\n  // author\n  &-author-social {\n    vertical-align: middle;\n    margin-left: 2px;\n    padding: 0 3px;\n  }\n\n  &-image { margin-top: 30px }\n}\n\n// Avatar\n// ==========================================================================\n.avatar-image {\n  display: inline-block;\n  vertical-align: middle;\n\n  @extend .u-round;\n\n  &--smaller {\n    width: 50px;\n    height: 50px;\n  }\n}\n\n// post content body\n// ==========================================================================\n.post-body {\n  a:not(.button):not(.button--circle):not(.prev-next-link) {\n    text-decoration: none;\n    position: relative;\n    transition: all 250ms;\n    box-shadow: inset 0 -3px 0 var(--post-color-link);\n\n    &:hover {\n      box-shadow: inset 0 -1rem 0 var(--post-color-link)\n    }\n  }\n\n  img {\n    display: block;\n    margin-left: auto;\n    margin-right: auto;\n  }\n\n  h1, h2, h3, h4, h5, h6 {\n    margin-top: 30px;\n    font-weight: 900;\n    font-style: normal;\n    color: #000;\n    letter-spacing: -.02em;\n    line-height: 1.2;\n  }\n\n  h2 { margin-top: 35px }\n\n  p {\n    font-family: $secundary-font;\n    font-size: 1.125rem;\n    font-weight: 400;\n    letter-spacing: -.003em;\n    line-height: 1.7;\n    margin-top: 25px;\n  }\n\n  ul,\n  ol {\n    counter-reset: post;\n    font-family: $secundary-font;\n    font-size: 1.125rem;\n    margin-top: 20px;\n\n    li {\n      letter-spacing: -.003em;\n      margin-bottom: 14px;\n      margin-left: 30px;\n\n      &::before {\n        box-sizing: border-box;\n        display: inline-block;\n        margin-left: -78px;\n        position: absolute;\n        text-align: right;\n        width: 78px;\n      }\n    }\n  }\n\n  ul li::before {\n    content: '\\2022';\n    font-size: 16.8px;\n    padding-right: 15px;\n    padding-top: 3px;\n  }\n\n  ol li::before {\n    content: counter(post) \".\";\n    counter-increment: post;\n    padding-right: 12px;\n  }\n}\n\n// Class of Ghost\n// ==========================================================================\n\n// fisrt p\n// .post-body-wrap > p:first-of-type {\n//   margin-top: 30px;\n\n//   // &::first-letter {\n//   //   float: left;\n//   //   font-size: 55px;\n//   //   font-style: normal;\n//   //   font-weight: 900;\n//   //   letter-spacing: -.03em;\n//   //   line-height: .83;\n//   //   margin-bottom: -.08em;\n//   //   margin-right: 7px;\n//   //   padding-top: 7px;\n//   //   text-transform: uppercase;\n//   // }\n// }\n\n.post-body-wrap {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n\n  // & > p:first-of-type { margin-top: 30px }\n\n  h1, h2, h3, h4, h5, h6,\n  ol, ul, hr, pre, .post-tags, .prev-next {\n    min-width: 100%;\n  }\n\n  & > ul { margin-top: 35px }\n\n  & > iframe,\n  & > img,\n  .kg-image-card,\n  .kg-embed-card {\n    margin-top: 30px !important\n  }\n}\n\n// Share Post\n// ==========================================================================\n.sharePost {\n  left: 0;\n  width: 40px;\n  position: absolute !important;\n  transition: all .4s;\n  top: 30px;\n\n  /* stylelint-disable-next-line */\n  a {\n    color: #fff;\n    margin: 8px 0 0;\n    display: block;\n  }\n\n  .i-chat {\n    background-color: #fff;\n    border: 2px solid #bbb;\n    color: #bbb;\n  }\n}\n\n// Post Related\n// ==========================================================================\n\n.post-related {\n  padding: 40px 0;\n}\n\n// Previus and next article\n// ==========================================================================\n/* stylelint-disable-next-line */\n.prev-next {\n  &-span {\n    color: var(--composite-color);\n    font-weight: 700;\n    font-size: 13px;\n\n    i {\n      display: inline-flex;\n      transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1)\n    }\n  }\n\n  &-title {\n    margin: 0 !important;\n    font-size: 16px;\n    height: 2em;\n    overflow: hidden;\n    line-height: 1 !important;\n    text-overflow: ellipsis !important;\n    -webkit-box-orient: vertical !important;\n    -webkit-line-clamp: 2 !important;\n    display: -webkit-box !important;\n  }\n\n  // &-arrow {\n  //   color: #bbb;\n  //   font-size: 40px;\n  //   line-height: 1;\n  // }\n\n  &-link:hover {\n    // .prev-next-title { color: rgba(0, 0, 0, .54) }\n    .arrow-right { animation: arrow-move-right 0.5s ease-in-out forwards }\n    .arrow-left { animation: arrow-move-left 0.5s ease-in-out forwards }\n  }\n}\n\n// Image post Format\n// ==========================================================================\n.cc-image {\n  max-height: 100vh;\n  min-height: 600px;\n  background-color: #000;\n\n  &-header {\n    right: 0;\n    bottom: 10%;\n    left: 0;\n  }\n\n  &-figure img {\n    opacity: .4;\n    object-fit: cover;\n    width: 100%\n  }\n\n  .post-header { max-width: 700px }\n  .post-title, .post-excerpt { color: #fff }\n}\n\n// Video post Format\n// ==========================================================================\n\n.cc-video {\n  background-color: #000;\n  padding: 40px 0 30px;\n\n  .post-excerpt { color: #aaa; font-size: 1rem }\n  .post-title { color: #fff; font-size: 1.8rem }\n  .kg-embed-card, .video-responsive { margin-top: 0 }\n\n  // Video related\n  .story h2 {\n    color: #fff;\n    margin: 0;\n    font-size: 1.125rem !important;\n    font-weight: 700 !important;\n    max-height: 2.5em;\n    overflow: hidden;\n    -webkit-box-orient: vertical !important;\n    -webkit-line-clamp: 2 !important;\n    text-overflow: ellipsis !important;\n    display: -webkit-box !important;\n  }\n\n  .flow-meta, .story-lower, figcaption { display: none !important }\n  .story-image { height: 170px !important; }\n\n  .media-type {\n    height: 34px !important;\n    width: 34px !important;\n  }\n}\n\n// change the design according to the classes of the body\nbody {\n  &.is-article .main { margin-bottom: 0 }\n  &.share-margin .sharePost { top: -85px }\n  &.show-category .post-primary-tag { display: block !important }\n\n  &.is-article-single {\n    .post-body-wrap { margin-left: 0 !important }\n    .sharePost { left: -100px }\n    .kg-width-full .kg-image { max-width: 100vw }\n    .kg-width-wide .kg-image { max-width: 1040px }\n  }\n}\n\n@media #{$md-and-down} {\n  .post-body-wrap {\n    q {\n      font-size: 20px !important;\n      letter-spacing: -.008em !important;\n      line-height: 1.4 !important;\n    }\n\n    // & > p:first-of-type::first-letter {\n    //   font-size: 30px;\n    //   margin-right: 6px;\n    //   padding-top: 3.5px;\n    // }\n\n    .kg-image-card img { max-width: 100%; }\n\n    ol, ul, p {\n      font-size: 1rem;\n      letter-spacing: -.004em;\n      line-height: 1.58;\n    }\n\n    iframe { width: 100% !important; }\n  }\n\n  // Post Related\n  .post-related {\n    padding-left: 8px;\n    padding-right: 8px;\n  }\n\n  // Image post format\n  .cc-image-figure {\n    width: 200%;\n    max-width: 200%;\n    margin: 0 auto 0 -50%;\n  }\n\n  .cc-image-header { bottom: 24px }\n  .cc-image .post-excerpt { font-size: 18px; }\n\n  // video post format\n  .cc-video {\n    padding: 20px 0;\n\n    &-embed {\n      margin-left: -16px;\n      margin-right: -15px;\n    }\n\n    .post-header { margin-top: 10px }\n  }\n}\n\n@media #{$lg-and-down} {\n  body.is-article {\n    .col-left { max-width: 100% }\n    // .sidebar { display: none; }\n  }\n}\n\n@media #{$md-and-up} {\n  // Image post Format\n  .cc-image .post-title { font-size: 3.2rem }\n}\n\n@media #{$lg-and-up} {\n  body.is-article .post-body-wrap { margin-left: 70px; }\n\n  body.is-video,\n  body.is-image {\n    .post-author { margin-left: 70px }\n    // .sharePost { top: -85px }\n  }\n}\n\n@media #{$xl-and-up} {\n  body.has-video-fixed {\n    .cc-video-embed {\n      bottom: 20px;\n      box-shadow: 0 0 10px 0 rgba(0, 0, 0, .5);\n      height: 203px;\n      padding-bottom: 0;\n      position: fixed;\n      right: 20px;\n      width: 360px;\n      z-index: 8;\n    }\n\n    .cc-video-close {\n      background: #000;\n      border-radius: 50%;\n      color: #fff;\n      cursor: pointer;\n      display: block !important;\n      font-size: 14px;\n      height: 24px;\n      left: -10px;\n      line-height: 1;\n      padding-top: 5px;\n      position: absolute;\n      text-align: center;\n      top: -10px;\n      width: 24px;\n      z-index: 5;\n    }\n\n    .cc-video-cont { height: 465px; }\n\n    .cc-image-header { bottom: 20% }\n  }\n}\n","// styles for story\n\n.hr-list {\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.0785);\n  margin: 20px 0 0;\n  // &:first-child { margin-top: 5px }\n}\n\n.story-feed .story-feed-content:first-child .hr-list:first-child {\n  margin-top: 5px;\n}\n\n// media type icon ( video - image )\n.media-type {\n  // background-color: lighten($primary-color, 15%);\n  background-color: rgba(0, 0, 0, .7);\n  color: #fff;\n  height: 45px;\n  left: 15px;\n  top: 15px;\n  width: 45px;\n  opacity: .9;\n\n  // @extend .u-bgColor;\n  @extend .u-fontSizeLarger;\n  @extend .u-round;\n  @extend .u-flexCenter;\n  @extend .u-flexContentCenter;\n}\n\n// Image over\n.image-hover {\n  transition: transform .7s;\n  transform: translateZ(0)\n}\n\n// not image\n.not-image {\n  background: url('../images/not-image.png');\n  background-repeat: repeat;\n}\n\n// Meta\n.flow-meta {\n  color: rgba(0, 0, 0, 0.54);\n  font-weight: 700;\n  margin-bottom: 10px;\n}\n\n// point\n.point { margin: 0 5px }\n\n// Story Default list\n// ==========================================================================\n\n.story {\n  &-image {\n    flex: 0 0  44% /*380px*/;\n    height: 235px;\n    margin-right: 30px;\n\n    &:hover .image-hover { transform: scale(1.03) }\n  }\n\n  &-lower { flex-grow: 1 }\n\n  &-excerpt {\n    color: rgba(0, 0, 0, 0.84);\n    font-family: $secundary-font;\n    font-weight: 300;\n    line-height: 1.5;\n  }\n\n  &-category { color: rgba(0, 0, 0, 0.84) }\n\n  h2 a:hover {\n    // box-shadow: inset 0 -2px 0 rgba(0, 171, 107, .5);\n    // box-shadow: inset 0 -2px 0 rgba($primary-color, .5);\n    // box-shadow: inset 0 -2px 0 var(--story-color-hover);\n    box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.4);\n    transition: all .25s;\n  }\n}\n\n// Story Grid\n// ==========================================================================\n\n.story.story--grid {\n  flex-direction: column;\n  margin-bottom: 30px;\n\n  .story-image {\n    flex: 0 0 auto;\n    margin-right: 0;\n    height: 220px;\n  }\n\n  .media-type {\n    font-size: 24px;\n    height: 40px;\n    width: 40px;\n  }\n}\n\n.cover-category { color: var(--story-cover-category-color) }\n\n// Story Card\n// ==========================================================================\n\n.story-card {\n  .story {\n    // background: #fff;\n    // border-radius: 4px;\n    // border: 1px solid rgba(0, 0, 0, .04);\n    // box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\n    margin-top: 0 !important;\n\n    // &:hover .story-image { box-shadow: 0 0 15px 4px rgba(0, 0, 0, .1) }\n  }\n\n  /* stylelint-disable-next-line */\n  .story-image {\n    // box-shadow: 0 1px 2px rgba(0, 0, 0, .07);\n    border: 1px solid rgba(0, 0, 0, .04);\n    box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\n    border-radius: 2px;\n    background-color: #fff !important;\n    transition: all 150ms ease-in-out;\n    // border-bottom: 1px solid rgba(0, 0, 0, .0785);\n    // border-radius: 4px 4px 0 0;\n    overflow: hidden;\n    height: 200px !important;\n\n    .story-img-bg { margin: 10px }\n\n    &:hover {\n      box-shadow: 0 0 15px 4px rgba(0, 0, 0, .1);\n\n      .story-img-bg { transform: none }\n    }\n  }\n\n  .story-lower { display: none !important }\n\n  .story-body {\n    padding: 15px 5px;\n    margin: 0 !important;\n\n    h2 {\n      -webkit-box-orient: vertical !important;\n      -webkit-line-clamp: 2 !important;\n      color: rgba(0, 0, 0, .9);\n      display: -webkit-box !important;\n      // line-height: 1.1 !important;\n      max-height: 2.4em !important;\n      overflow: hidden;\n      text-overflow: ellipsis !important;\n      margin: 0;\n    }\n  }\n}\n\n// Media query after medium\n// ==========================================================================\n\n@media #{$md-and-up} {\n  // story grid\n  .story.story--grid {\n    .story-lower {\n      max-height: 2.6em;\n      -webkit-box-orient: vertical;\n      -webkit-line-clamp: 2;\n      display: -webkit-box;\n      line-height: 1.1;\n      text-overflow: ellipsis;\n    }\n  }\n}\n\n// Media query before medium\n// ==========================================================================\n@media #{$md-and-down} {\n  // Story Cover\n  .cover--firts .cover-story { height: 500px }\n\n  // story default list\n  .story {\n    flex-direction: column;\n    margin-top: 20px;\n\n    &-image { flex: 0 0 auto; margin-right: 0 }\n    &-body { margin-top: 10px }\n  }\n}\n","// Author page\n// ==========================================================================\n\n.author {\n  background-color: #fff;\n  color: rgba(0, 0, 0, .6);\n  min-height: 350px;\n\n  &-avatar {\n    height: 80px;\n    width: 80px;\n  }\n\n  &-meta span {\n    display: inline-block;\n    font-size: 17px;\n    font-style: italic;\n    margin: 0 25px 16px 0;\n    opacity: .8;\n    word-wrap: break-word;\n  }\n\n  &-name { color: rgba(0, 0, 0, .8) }\n  &-bio { max-width: 600px; }\n  &-meta a:hover { opacity: .8 !important }\n}\n\n.cover-opacity { opacity: .5 }\n\n.author.has--image {\n  color: #fff !important;\n  text-shadow: 0 0 10px rgba(0, 0, 0, .33);\n\n  a,\n  .author-name { color: #fff; }\n\n  .author-follow a {\n    border: 2px solid;\n    border-color: hsla(0, 0%, 100%, .5) !important;\n    font-size: 16px;\n  }\n\n  .u-accentColor--iconNormal { fill: #fff; }\n}\n\n@media #{$md-and-down} {\n  .author-meta span { display: block; }\n  .author-header { display: block; }\n  .author-avatar { margin: 0 auto 20px; }\n}\n\n@media #{$md-and-up} {\n  body.has-cover .author { min-height: 600px }\n}\n","// Search\n// ==========================================================================\n\n.search {\n  background-color: #fff;\n  height: 100%;\n  height: 100vh;\n  left: 0;\n  padding: 0 16px;\n  right: 0;\n  top: 0;\n  transform: translateY(-100%);\n  transition: transform .3s ease;\n  z-index: 9;\n\n  &-form {\n    max-width: 680px;\n    margin-top: 80px;\n\n    &::before {\n      background: #eee;\n      bottom: 0;\n      content: '';\n      display: block;\n      height: 2px;\n      left: 0;\n      position: absolute;\n      width: 100%;\n      z-index: 1;\n    }\n\n    input {\n      border: none;\n      display: block;\n      line-height: 40px;\n      padding-bottom: 8px;\n\n      &:focus { outline: 0; }\n    }\n  }\n\n  // result\n  &-results {\n    max-height: calc(90% - 100px);\n    max-width: 680px;\n    overflow: auto;\n\n    a {\n      border-bottom: 1px solid #eee;\n      padding: 12px 0;\n\n      &:hover { color: rgba(0, 0, 0, .44) }\n    }\n  }\n}\n\n.button-search--close {\n  position: absolute !important;\n  right: 50px;\n  top: 20px;\n}\n\nbody.is-search {\n  overflow: hidden;\n\n  .search { transform: translateY(0) }\n  .search-toggle { background-color: rgba(255, 255, 255, .25) }\n}\n",".sidebar {\n  &-title {\n    border-bottom: 1px solid rgba(0, 0, 0, .0785);\n\n    span {\n      border-bottom: 1px solid rgba(0, 0, 0, .54);\n      padding-bottom: 10px;\n      margin-bottom: -1px;\n    }\n  }\n}\n\n// border for post\n.sidebar-border {\n  border-left: 3px solid var(--composite-color);\n  color: rgba(0, 0, 0, .2);\n  font-family: $secundary-font;\n  padding: 0 10px;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888;\n}\n\n.sidebar-post {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, .0785);\n  min-height: 60px;\n\n  &:hover { .sidebar-border { background-color: rgba(229, 239, 245, 1) } }\n\n  &:nth-child(3n) { .sidebar-border { border-color: darken(orange, 2%); } }\n  &:nth-child(3n+2) { .sidebar-border { border-color: #26a8ed } }\n}\n\n// Centered line and oblique content\n// ==========================================================================\n// .center-line {\n//   font-size: 16px;\n//   margin-bottom: 15px;\n//   position: relative;\n//   text-align: center;\n\n//   &::before {\n//     background: rgba(0, 0, 0, .15);\n//     bottom: 50%;\n//     content: '';\n//     display: inline-block;\n//     height: 1px;\n//     left: 0;\n//     position: absolute;\n//     width: 100%;\n//     z-index: 0;\n//   }\n// }\n\n// .oblique {\n//   background: #ff005b;\n//   color: #fff;\n//   display: inline-block;\n//   font-size: 16px;\n//   font-weight: 700;\n//   line-height: 1;\n//   padding: 5px 13px;\n//   position: relative;\n//   text-transform: uppercase;\n//   transform: skewX(-15deg);\n//   z-index: 1;\n// }\n","// Navigation Mobile\r\n.sideNav {\r\n  // background-color: $primary-color;\r\n  color: rgba(0, 0, 0, 0.8);\r\n  height: 100vh;\r\n  padding: $header-height 20px;\r\n  position: fixed !important;\r\n  transform: translateX(100%);\r\n  transition: 0.4s;\r\n  will-change: transform;\r\n  z-index: 8;\r\n\r\n  &-menu a { padding: 10px 20px; }\r\n\r\n  &-wrap {\r\n    background: #eee;\r\n    overflow: auto;\r\n    padding: 20px 0;\r\n    top: $header-height;\r\n  }\r\n\r\n  &-section {\r\n    border-bottom: solid 1px #ddd;\r\n    margin-bottom: 8px;\r\n    padding-bottom: 8px;\r\n  }\r\n\r\n  &-follow {\r\n    border-top: 1px solid #ddd;\r\n    margin: 15px 0;\r\n\r\n    a {\r\n      color: #fff;\r\n      display: inline-block;\r\n      height: 36px;\r\n      line-height: 20px;\r\n      margin: 0 5px 5px 0;\r\n      min-width: 36px;\r\n      padding: 8px;\r\n      text-align: center;\r\n      vertical-align: middle;\r\n    }\r\n\r\n    @each $social-name, $color in $social-colors {\r\n      .i-#{$social-name} {\r\n        @extend .bg-#{$social-name};\r\n      }\r\n    }\r\n  }\r\n}\r\n","//  Follow me btn is post\n// .mapache-follow {\n//   &:hover {\n//     .mapache-hover-hidden { display: none !important }\n//     .mapache-hover-show { display: inline-block !important }\n//   }\n\n//   &-btn {\n//     height: 19px;\n//     line-height: 17px;\n//     padding: 0 10px;\n//   }\n// }\n\n// Transparece header and cover img\n\n.has-cover-padding { padding-top: 100px }\n\nbody.has-cover {\n  .header { position: fixed }\n\n  &.is-transparency:not(.is-search) {\n    .header {\n      background: rgba(0, 0, 0, .05);\n      box-shadow: none;\n      border-bottom: 1px solid hsla(0, 0%, 100%, .1);\n    }\n\n    .header-left a, .nav ul li a { color: #fff; }\n    .menu--toggle span { background-color: #fff }\n  }\n}\n","// .is-subscribe .footer {\n//   background-color: #f0f0f0;\n// }\n\n.subscribe {\n  min-height: 80vh !important;\n  height: 100%;\n  // background-color: #f0f0f0 !important;\n\n  &-card {\n    background-color: #D7EFEE;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, .15);\n    border-radius: 4px;\n    width: 900px;\n    height: 550px;\n    padding: 50px;\n    margin: 5px;\n  }\n\n  form {\n    max-width: 300px;\n  }\n\n  &-form {\n    height: 100%;\n  }\n\n  &-input {\n    background: 0 0;\n    border: 0;\n    border-bottom: 1px solid #cc5454;\n    border-radius: 0;\n    padding: 7px 5px;\n    height: 45px;\n    outline: 0;\n    font-family: $primary-font;\n\n    &::placeholder {\n      color: #cc5454;\n    }\n  }\n\n  .main-error {\n    color: #cc5454;\n    font-size: 16px;\n    margin-top: 15px;\n  }\n}\n\n// .subscribe-btn {\n//   background: rgba(0, 0, 0, .84);\n//   border-color: rgba(0, 0, 0, .84);\n//   color: rgba(255, 255, 255, .97);\n//   box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\n//   letter-spacing: 1px;\n\n//   &:hover {\n//     background: #1C9963;\n//     border-color: #1C9963;\n//   }\n// }\n\n// Success\n.subscribe-success {\n  .subscribe-card {\n    background-color: #E8F3EC;\n  }\n}\n\n@media #{$md-and-down} {\n  .subscribe-card {\n    height: auto;\n    width: auto;\n  }\n}\n","// post Comments\n// ==========================================================================\n\n.post-comments {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 15;\n  width: 100%;\n  left: 0;\n  overflow-y: auto;\n  background: #fff;\n  border-left: 1px solid #f1f1f1;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\n  font-size: 14px;\n  transform: translateX(100%);\n  transition: .2s;\n  will-change: transform;\n\n  &-header {\n    padding: 20px;\n    border-bottom: 1px solid #ddd;\n\n    .toggle-comments {\n      font-size: 24px;\n      line-height: 1;\n      position: absolute;\n      left: 0;\n      top: 0;\n      padding: 17px;\n      cursor: pointer;\n    }\n  }\n\n  &-overlay {\n    position: fixed !important;\n    background-color: rgba(0, 0, 0, .2);\n    display: none;\n    transition: background-color .4s linear;\n    z-index: 8;\n    cursor: pointer;\n  }\n}\n\nbody.has-comments {\n  overflow: hidden;\n\n  .post-comments-overlay { display: block }\n  .post-comments { transform: translateX(0) }\n}\n\n@media #{$md-and-up} {\n  .post-comments {\n    left: auto;\n    width: 500px;\n    top: $header-height;\n    z-index: 9;\n\n    &-wrap { padding: 20px; }\n  }\n}\n",".modal {\n  opacity: 0;\n  transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  z-index: 100;\n  visibility: hidden;\n\n  // Shader\n  &-shader { background-color: rgba(255, 255, 255, .65) }\n\n  // modal close\n  &-close {\n    color: rgba(0, 0, 0, .54);\n    position: absolute;\n    top: 0;\n    right: 0;\n    line-height: 1;\n    padding: 15px;\n  }\n\n  // Inner\n  &-inner {\n    background-color: #E8F3EC;\n    border-radius: 4px;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, .15);\n    max-width: 700px;\n    height: 100%;\n    max-height: 400px;\n    opacity: 0;\n    padding: 72px 5% 56px;\n    transform: scale(.6);\n    transition: transform .3s cubic-bezier(.06, .47, .38, .99), opacity .3s cubic-bezier(.06, .47, .38, .99);\n    width: 100%;\n  }\n\n  // form\n  .form-group {\n    width: 76%;\n    margin: 0 auto 30px;\n  }\n\n  .form--input {\n    display: inline-block;\n    margin-bottom: 10px;\n    vertical-align: top;\n    height: 40px;\n    line-height: 40px;\n    background-color: transparent;\n    padding: 17px 6px;\n    border-bottom: 1px solid rgba(0, 0, 0, .15);\n    width: 100%;\n  }\n\n  // .form--btn {\n  //   background-color: rgba(0, 0, 0, .84);\n  //   border: 0;\n  //   height: 37px;\n  //   border-radius: 3px;\n  //   line-height: 37px;\n  //   padding: 0 16px;\n  //   transition: background-color .3s ease-in-out;\n  //   letter-spacing: 1px;\n  //   color: rgba(255, 255, 255, .97);\n  //   cursor: pointer;\n\n  //   &:hover { background-color: #1C9963 }\n  // }\n}\n\n// if has modal\n\nbody.has-modal {\n  overflow: hidden;\n\n  .modal {\n    opacity: 1;\n    visibility: visible;\n    transition: opacity .3s ease;\n\n    &-inner {\n      opacity: 1;\n      transform: scale(1);\n      transition: transform .8s cubic-bezier(.26, .63, 0, .96);\n    }\n  }\n}\n","// Instagram Fedd\n// ==========================================================================\n.instagram {\n  &-hover {\n    background-color: rgba(0, 0, 0, .3);\n    // transition: opacity 1s ease-in-out;\n    opacity: 0;\n  }\n\n  &-img {\n    height: 264px;\n\n    &:hover > .instagram-hover { opacity: 1 }\n  }\n\n  &-name {\n    left: 50%;\n    top: 50%;\n    transform: translate(-50%, -50%);\n    z-index: 3;\n\n    a {\n      background-color: #fff;\n      color: #000 !important;\n      font-size: 18px !important;\n      font-weight: 900 !important;\n      min-width: 200px;\n      padding-left: 10px !important;\n      padding-right: 10px !important;\n      text-align: center !important;\n    }\n  }\n\n  &-col {\n    padding: 0 !important;\n    margin: 0 !important;\n  }\n\n  &-wrap { margin: 0 !important }\n}\n\n// Newsletter Sidebar\n// ==========================================================================\n.witget-subscribe {\n  background: #fff;\n  border: 5px solid transparent;\n  padding: 28px 30px;\n  position: relative;\n\n  &::before {\n    content: \"\";\n    border: 5px solid #f5f5f5;\n    box-shadow: inset 0 0 0 1px #d7d7d7;\n    box-sizing: border-box;\n    display: block;\n    height: calc(100% + 10px);\n    left: -5px;\n    pointer-events: none;\n    position: absolute;\n    top: -5px;\n    width: calc(100% + 10px);\n    z-index: 1;\n  }\n\n  input {\n    background: #fff;\n    border: 1px solid #e5e5e5;\n    color: rgba(0, 0, 0, .54);\n    height: 41px;\n    outline: 0;\n    padding: 0 16px;\n    width: 100%;\n  }\n\n  button {\n    background: var(--composite-color);\n    border-radius: 0;\n    width: 100%;\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 17 */
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
/* 18 */
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

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ 19);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

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
/* 19 */
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
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
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
/* 20 */,
/* 21 */
/*!***************************!*\
  !*** ./fonts/mapache.eot ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.eot";

/***/ }),
/* 22 */
/*!****************************************************************************************!*\
  !*** multi ./build/util/../helpers/hmr-client.js ./scripts/main.js ./styles/main.scss ***!
  \****************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Users\Smigol\projects\ghost\content\themes\mapache\src\build\util/../helpers/hmr-client.js */2);
__webpack_require__(/*! ./scripts/main.js */23);
module.exports = __webpack_require__(/*! ./styles/main.scss */47);


/***/ }),
/* 23 */
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery_lazyload__ = __webpack_require__(/*! jquery-lazyload */ 24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery_lazyload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery_lazyload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_theia_sticky_sidebar__ = __webpack_require__(/*! theia-sticky-sidebar */ 25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_theia_sticky_sidebar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_theia_sticky_sidebar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__autoload_jquery_ghostHunter_js__ = __webpack_require__(/*! ./autoload/jquery.ghostHunter.js */ 26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__autoload_jquery_ghostHunter_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__autoload_jquery_ghostHunter_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__autoload_transition_js__ = __webpack_require__(/*! ./autoload/transition.js */ 28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__autoload_transition_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__autoload_transition_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__autoload_zoom_js__ = __webpack_require__(/*! ./autoload/zoom.js */ 29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__autoload_zoom_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__autoload_zoom_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_Router__ = __webpack_require__(/*! ./util/Router */ 30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__routes_common__ = __webpack_require__(/*! ./routes/common */ 32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__routes_post__ = __webpack_require__(/*! ./routes/post */ 38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__routes_video__ = __webpack_require__(/*! ./routes/video */ 44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__routes_audio__ = __webpack_require__(/*! ./routes/audio */ 45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__app_app_pagination__ = __webpack_require__(/*! ./app/app.pagination */ 46);
// import external dependencies



// Import everything from autoload
  

// Pagination infinite scroll
// import './app/pagination';

// import local dependencies








/** Populate Router instance with DOM routes */
var routes = new __WEBPACK_IMPORTED_MODULE_5__util_Router__["a" /* default */]({
  // All pages
  common: __WEBPACK_IMPORTED_MODULE_6__routes_common__["a" /* default */],

  // article
  isArticle: __WEBPACK_IMPORTED_MODULE_7__routes_post__["a" /* default */],

  // Pagination (home - tag - author) infinite scroll
  isPagination: __WEBPACK_IMPORTED_MODULE_10__app_app_pagination__["a" /* default */],

  // video post format
  isVideo: __WEBPACK_IMPORTED_MODULE_8__routes_video__["a" /* default */],

  // Audio post Format
  isAudio: __WEBPACK_IMPORTED_MODULE_9__routes_audio__["a" /* default */],
});

// Load Events
jQuery(document).ready(function () { return routes.loadEvents(); });

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 24 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 25 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 26 */
/*!************************************************!*\
  !*** ./scripts/autoload/jquery.ghostHunter.js ***!
  \************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* eslint-disable */

/**
* ghostHunter - 0.4.0
 * Copyright (C) 2014 Jamal Neufeld (jamal@i11u.me)
 * MIT Licensed
 * @license
*/
(function ($) {

  var lunr = __webpack_require__(/*! lunr */ 27);

  //This is the main plugin definition
  $.fn.ghostHunter = function (options) {

    //Here we use jQuery's extend to set default values if they weren't set by the user
    var opts = $.extend({}, $.fn.ghostHunter.defaults, options);
    if (opts.results) {
      pluginMethods.init(this, opts);
      return pluginMethods;
    }
  };

  $.fn.ghostHunter.defaults = {
    resultsData: false,
    onPageLoad: true,
    onKeyUp: false,
    result_template: "<a href='{{link}}'><p><h2>{{title}}</h2><h4>{{prettyPubDate}}</h4></p></a>",
    info_template: "<p>Number of posts found: {{amount}}</p>",
    displaySearchInfo: true,
    zeroResultsInfo: true,
    before: false,
    onComplete: false,
    includepages: false,
    filterfields: false
  };
  var prettyDate = function (date) {
    var d = new Date(date);
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
  };

  var pluginMethods = {

    isInit: false,

    init: function (target, opts) {
      var that = this;
      this.target = target;
      this.results = opts.results;
      this.blogData = {};
      this.result_template = opts.result_template;
      this.info_template = opts.info_template;
      this.zeroResultsInfo = opts.zeroResultsInfo;
      this.displaySearchInfo = opts.displaySearchInfo;
      this.before = opts.before;
      this.onComplete = opts.onComplete;
      this.includepages = opts.includepages;
      this.filterfields = opts.filterfields;

      //This is where we'll build the index for later searching. It's not a big deal to build it on every load as it takes almost no space without data
      this.index = lunr(function () {
        this.field('title', { boost: 10 })
        this.field('description')
        this.field('link')
        this.field('plaintext', { boost: 5 })
        this.field('pubDate')
        this.field('tag')
        this.ref('id')
      });

      if (opts.onPageLoad) {
        function miam() {
          that.loadAPI();
        }
        window.setTimeout(miam, 1);
      } else {
        target.focus(function () {
          that.loadAPI();
        });
      }

      target.closest("form").submit(function (e) {
        e.preventDefault();
        that.find(target.val());
      });

      if (opts.onKeyUp) {
        target.keyup(function () {
          that.find(target.val());
        });

      }

    },

    loadAPI: function () {

      if (this.isInit) { return false; }

      /*	Here we load all of the blog posts to the index.
        This function will not call on load to avoid unnecessary heavy
        operations on a page if a visitor never ends up searching anything. */

      var index = this.index,
        blogData = this.blogData;
      obj = { limit: "all", include: "tags", formats: ["plaintext"] };
      if (this.includepages) {
        obj.filter = "(page:true,page:false)";
      }


      $.get(ghost.url.api('posts', obj)).done(function (data) {
        searchData = data.posts;
        searchData.forEach(function (arrayItem) {
          var tag_arr = arrayItem.tags.map(function (v) {
            return v.name; // `tag` object has an `name` property which is the value of tag. If you also want other info, check API and get that property
          })
          if (arrayItem.meta_description == null) { arrayItem.meta_description = '' };
          var category = tag_arr.join(", ");
          if (category.length < 1) {
            category = "undefined";
          }
          var parsedData = {
            id: String(arrayItem.id),
            title: String(arrayItem.title),
            description: String(arrayItem.meta_description),
            plaintext: String(arrayItem.plaintext),
            pubDate: String(arrayItem.created_at),
            tag: category,
            link: String(arrayItem.url)
          }

          parsedData.prettyPubDate = prettyDate(parsedData.pubDate);
          var tempdate = prettyDate(parsedData.pubDate);

          index.add(parsedData)
          blogData[arrayItem.id] = { title: arrayItem.title, description: arrayItem.meta_description, pubDate: tempdate, link: arrayItem.url };
        });
      });
      this.isInit = true;
    },

    find: function (value) {
      var this$1 = this;

      var searchResult = this.index.search(value);
      var results = $(this.results);
      var resultsData = [];
      results.empty();

      if (this.before) {
        this.before();
      };

      if (this.zeroResultsInfo || searchResult.length > 0) {
        if (this.displaySearchInfo) { results.append(this.format(this.info_template, { "amount": searchResult.length })); }
      }

      for (var i = 0; i < searchResult.length; i++) {
        var lunrref = searchResult[i].ref;
        var postData = this$1.blogData[lunrref];
        results.append(this$1.format(this$1.result_template, postData));
        resultsData.push(postData);
      }

      if (this.onComplete) {
        this.onComplete(resultsData);
      };
    },

    clear: function () {
      $(this.results).empty();
      this.target.val("");
    },

    format: function (t, d) {
      return t.replace(/{{([^{}]*)}}/g, function (a, b) {
        var r = d[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      });
    }
  }

})(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 27 */
/*!************************************!*\
  !*** ../node_modules/lunr/lunr.js ***!
  \************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 1.0.0
 * Copyright (C) 2017 Oliver Nightingale
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

lunr.version = "1.0.0"
/*!
 * lunr.utils
 * Copyright (C) 2017 Oliver Nightingale
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
 * Copyright (C) 2017 Oliver Nightingale
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
 * Copyright (C) 2017 Oliver Nightingale
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

  return obj.toString().trim().toLowerCase().split(lunr.tokenizer.separator)
}

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
 * Copyright (C) 2017 Oliver Nightingale
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
 * Copyright (C) 2017 Oliver Nightingale
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
 * Copyright (C) 2017 Oliver Nightingale
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
 * Copyright (C) 2017 Oliver Nightingale
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
 * Copyright (C) 2017 Oliver Nightingale
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
 * Copyright (C) 2017 Oliver Nightingale
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
 * Copyright (C) 2017 Oliver Nightingale
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
 * Copyright (C) 2017 Oliver Nightingale
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
 * Copyright (C) 2017 Oliver Nightingale
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
/* 28 */
/*!****************************************!*\
  !*** ./scripts/autoload/transition.js ***!
  \****************************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* eslint-disable */

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) { $($el).trigger($.support.transition.end) } }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) { return }

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) { return e.handleObj.handler.apply(this, arguments) }
      }
    }
  })

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 29 */
/*!**********************************!*\
  !*** ./scripts/autoload/zoom.js ***!
  \**********************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* eslint-disable */

/**
 * zoom.js - It's the best way to zoom an image
 * @version v0.0.2
 * @link https://github.com/fat/zoom.js
 * @license MIT
 */

+function ($) { "use strict";

  /**
   * The zoom service
   */
  function ZoomService () {
    this._activeZoom            =
    this._initialScrollPosition =
    this._initialTouchPosition  =
    this._touchMoveListener     = null

    this._$document = $(document)
    this._$window   = $(window)
    this._$body     = $(document.body)

    this._boundClick = $.proxy(this._clickHandler, this)
  }

  ZoomService.prototype.listen = function () {
    this._$body.on('click', '[data-action="zoom"]', $.proxy(this._zoom, this))
  }

  ZoomService.prototype._zoom = function (e) {
    var target = e.target

    if (!target || target.tagName != 'IMG') { return }

    if (this._$body.hasClass('zoom-overlay-open')) { return }

    if (e.metaKey || e.ctrlKey) {
      return window.open((e.target.getAttribute('data-original') || e.target.src), '_blank')
    }

    if (target.width >= ($(window).width() - Zoom.OFFSET)) { return }

    this._activeZoomClose(true)

    this._activeZoom = new Zoom(target)
    this._activeZoom.zoomImage()

    // todo(fat): probably worth throttling this
    this._$window.on('scroll.zoom', $.proxy(this._scrollHandler, this))

    this._$document.on('keyup.zoom', $.proxy(this._keyHandler, this))
    this._$document.on('touchstart.zoom', $.proxy(this._touchStart, this))

    // we use a capturing phase here to prevent unintended js events
    // sadly no useCapture in jquery api (http://bugs.jquery.com/ticket/14953)
    if (document.addEventListener) {
      document.addEventListener('click', this._boundClick, true)
    } else {
      document.attachEvent('onclick', this._boundClick, true)
    }

    if ('bubbles' in e) {
      if (e.bubbles) { e.stopPropagation() }
    } else {
      // Internet Explorer before version 9
      e.cancelBubble = true
    }
  }

  ZoomService.prototype._activeZoomClose = function (forceDispose) {
    if (!this._activeZoom) { return }

    if (forceDispose) {
      this._activeZoom.dispose()
    } else {
      this._activeZoom.close()
    }

    this._$window.off('.zoom')
    this._$document.off('.zoom')

    document.removeEventListener('click', this._boundClick, true)

    this._activeZoom = null
  }

  ZoomService.prototype._scrollHandler = function (e) {
    if (this._initialScrollPosition === null) { this._initialScrollPosition = $(window).scrollTop() }
    var deltaY = this._initialScrollPosition - $(window).scrollTop()
    if (Math.abs(deltaY) >= 40) { this._activeZoomClose() }
  }

  ZoomService.prototype._keyHandler = function (e) {
    if (e.keyCode == 27) { this._activeZoomClose() }
  }

  ZoomService.prototype._clickHandler = function (e) {
    if (e.preventDefault) { e.preventDefault() }
    else { event.returnValue = false }

    if ('bubbles' in e) {
      if (e.bubbles) { e.stopPropagation() }
    } else {
      // Internet Explorer before version 9
      e.cancelBubble = true
    }

    this._activeZoomClose()
  }

  ZoomService.prototype._touchStart = function (e) {
    this._initialTouchPosition = e.touches[0].pageY
    $(e.target).on('touchmove.zoom', $.proxy(this._touchMove, this))
  }

  ZoomService.prototype._touchMove = function (e) {
    if (Math.abs(e.touches[0].pageY - this._initialTouchPosition) > 10) {
      this._activeZoomClose()
      $(e.target).off('touchmove.zoom')
    }
  }


  /**
   * The zoom object
   */
  function Zoom (img) {
    this._fullHeight      =
    this._fullWidth       =
    this._overlay         =
    this._targetImageWrap = null

    this._targetImage = img

    this._$body = $(document.body)
  }

  Zoom.OFFSET = 80
  Zoom._MAX_WIDTH = 2560
  Zoom._MAX_HEIGHT = 4096

  Zoom.prototype.zoomImage = function () {
    var img = document.createElement('img')
    img.onload = $.proxy(function () {
      this._fullHeight = Number(img.height)
      this._fullWidth = Number(img.width)
      this._zoomOriginal()
    }, this)
    img.src = this._targetImage.src
  }

  Zoom.prototype._zoomOriginal = function () {
    this._targetImageWrap           = document.createElement('div')
    this._targetImageWrap.className = 'zoom-img-wrap'

    this._targetImage.parentNode.insertBefore(this._targetImageWrap, this._targetImage)
    this._targetImageWrap.appendChild(this._targetImage)

    $(this._targetImage)
      .addClass('zoom-img')
      .attr('data-action', 'zoom-out')

    this._overlay           = document.createElement('div')
    this._overlay.className = 'zoom-overlay'

    document.body.appendChild(this._overlay)

    this._calculateZoom()
    this._triggerAnimation()
  }

  Zoom.prototype._calculateZoom = function () {
    this._targetImage.offsetWidth // repaint before animating

    var originalFullImageWidth  = this._fullWidth
    var originalFullImageHeight = this._fullHeight

    var scrollTop = $(window).scrollTop()

    var maxScaleFactor = originalFullImageWidth / this._targetImage.width

    var viewportHeight = ($(window).height() - Zoom.OFFSET)
    var viewportWidth  = ($(window).width() - Zoom.OFFSET)

    var imageAspectRatio    = originalFullImageWidth / originalFullImageHeight
    var viewportAspectRatio = viewportWidth / viewportHeight

    if (originalFullImageWidth < viewportWidth && originalFullImageHeight < viewportHeight) {
      this._imgScaleFactor = maxScaleFactor

    } else if (imageAspectRatio < viewportAspectRatio) {
      this._imgScaleFactor = (viewportHeight / originalFullImageHeight) * maxScaleFactor

    } else {
      this._imgScaleFactor = (viewportWidth / originalFullImageWidth) * maxScaleFactor
    }
  }

  Zoom.prototype._triggerAnimation = function () {
    this._targetImage.offsetWidth // repaint before animating

    var imageOffset = $(this._targetImage).offset()
    var scrollTop   = $(window).scrollTop()

    var viewportY = scrollTop + ($(window).height() / 2)
    var viewportX = ($(window).width() / 2)

    var imageCenterY = imageOffset.top + (this._targetImage.height / 2)
    var imageCenterX = imageOffset.left + (this._targetImage.width / 2)

    this._translateY = viewportY - imageCenterY
    this._translateX = viewportX - imageCenterX

    var targetTransform = 'scale(' + this._imgScaleFactor + ')'
    var imageWrapTransform = 'translate(' + this._translateX + 'px, ' + this._translateY + 'px)'

    if ($.support.transition) {
      imageWrapTransform += ' translateZ(0)'
    }

    $(this._targetImage)
      .css({
        '-webkit-transform': targetTransform,
            '-ms-transform': targetTransform,
                'transform': targetTransform
      })

    $(this._targetImageWrap)
      .css({
        '-webkit-transform': imageWrapTransform,
            '-ms-transform': imageWrapTransform,
                'transform': imageWrapTransform
      })

    this._$body.addClass('zoom-overlay-open')
  }

  Zoom.prototype.close = function () {
    this._$body
      .removeClass('zoom-overlay-open')
      .addClass('zoom-overlay-transitioning')

    // we use setStyle here so that the correct vender prefix for transform is used
    $(this._targetImage)
      .css({
        '-webkit-transform': '',
            '-ms-transform': '',
                'transform': ''
      })

    $(this._targetImageWrap)
      .css({
        '-webkit-transform': '',
            '-ms-transform': '',
                'transform': ''
      })

    if (!$.support.transition) {
      return this.dispose()
    }

    $(this._targetImage)
      .one($.support.transition.end, $.proxy(this.dispose, this))
      .emulateTransitionEnd(300)
  }

  Zoom.prototype.dispose = function () {
    if (this._targetImageWrap && this._targetImageWrap.parentNode) {
      $(this._targetImage)
        .removeClass('zoom-img')
        .attr('data-action', 'zoom')

      this._targetImageWrap.parentNode.replaceChild(this._targetImage, this._targetImageWrap)
      this._overlay.parentNode.removeChild(this._overlay)

      this._$body.removeClass('zoom-overlay-transitioning')
    }
  }

  // wait for dom ready (incase script included before body)
  $(function () {
    new ZoomService().listen()
  })

}(jQuery)

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
    .map(__WEBPACK_IMPORTED_MODULE_0__camelCase__["a" /* default */])
    .forEach(function (className) {
      this$1.fire(className);
      this$1.fire(className, 'finalize');
    });

  // Fire common finalize JS
  this.fire('common', 'finalize');
};

/* harmony default export */ __webpack_exports__["a"] = (Router);


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
/* harmony default export */ __webpack_exports__["a"] = (function (str) { return ("" + (str.charAt(0).toLowerCase()) + (str.replace(/[\W_]/g, '|').split('|')
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
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_app_share__ = __webpack_require__(/*! ../app/app.share */ 33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_app_share___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__app_app_share__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_app_follow__ = __webpack_require__(/*! ../app/app.follow */ 34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_search__ = __webpack_require__(/*! ../app/app.search */ 35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_footer_links__ = __webpack_require__(/*! ../app/app.footer.links */ 36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_app_twitter__ = __webpack_require__(/*! ../app/app.twitter */ 37);






// Varibles
var $body = $('body');
var $blogUrl = $body.attr('data-page');
var $seachInput = $('#search-field');
var urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/; // eslint-disable-line

var didScroll = false;
var lastScrollTop = 0; // eslint-disable-line
var delta = 5;

// Active Scroll
$(window).on('scroll', function () { return didScroll = true; } );

/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // Change title HOME PAGE
    if (typeof homeTitle !== 'undefined') { $('#home-title').html(homeTitle); } // eslint-disable-line

    // change BTN ( Name - URL) in Home Page
    if (typeof homeBtnTitle !== 'undefined' && typeof homeBtnURL !== 'undefined') {
      $('#home-button').attr('href', homeBtnURL).html(homeBtnTitle); // eslint-disable-line
    }

    // Follow me
    if (typeof followSocialMedia !== 'undefined') { Object(__WEBPACK_IMPORTED_MODULE_1__app_app_follow__["a" /* default */])(followSocialMedia, urlRegexp); } // eslint-disable-line

    /* Footer Links */
    if (typeof footerLinks !== 'undefined') { Object(__WEBPACK_IMPORTED_MODULE_3__app_app_footer_links__["a" /* default */]) (footerLinks, urlRegexp); } // eslint-disable-line

    /* Lazy load for image */
    $('.cover-lazy').lazyload({effect : 'fadeIn'});
    $('.story-image-lazy').lazyload({threshold : 200});
  }, // end Init

  finalize: function finalize() {
    /* Menu open and close for mobile */
    $('.menu--toggle').on('click', function (e) {
      e.preventDefault();
      $body.toggleClass('is-showNavMob').removeClass('is-search');
    });

    /* rocket to the moon (retur TOP HOME) */
    // $('.rocket').on('click', function (e) {
    //   e.preventDefault();
    //   $('html, body').animate({scrollTop: 0}, 250);
    // });

    /* Share article in Social media */
    $('.mapache-share').bind('click', function (e) {
      e.preventDefault();
      var share = new __WEBPACK_IMPORTED_MODULE_0__app_app_share___default.a($(this));
      share.share();
    });

    /* Toggle show more social media */
    $('.follow-toggle').on('click', function (e) {
      e.preventDefault();
      $body.toggleClass('is-showFollowMore');
    });

    /* scroll link width click (ID)*/
    $('.scrolltop').on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top - 60 }, 500, 'linear');
    });

    /* Modal Open for susbscribe */
    $('.modal-toggle').on('click', function (e) {
      e.preventDefault();
      $body.toggleClass('has-modal');
    });

    /* sicky sidebar */
    $('.sidebar-sticky').theiaStickySidebar({
      additionalMarginTop: 70,
      minWidth: 970,
    });

    // Twitter and facebook fans page
    if (typeof twitterUserName !== 'undefined' && typeof twitterNumber !== 'undefined') {
      Object(__WEBPACK_IMPORTED_MODULE_4__app_app_twitter__["a" /* default */])(twitterUserName, twitterNumber); // eslint-disable-line
    }

    // show comments count of disqus
    if (typeof disqusShortName !== 'undefined') { $('.mapache-disqus').removeClass('u-hide'); }

    // functions that are activated when scrolling
    function hasScrolled() {
      var st = $(window).scrollTop();

      // Make sure they scroll more than delta
      if(Math.abs(lastScrollTop - st) <= delta) {
        return;
      }

      // show background and transparency
      // in header when page hace cover image
      if (st >= 50) {
        $('body.has-cover').removeClass('is-transparency');
      } else {
        $('body.has-cover').addClass('is-transparency');
      }

      lastScrollTop = st;
    }

    setInterval(function () {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 500);

    // Search
    Object(__WEBPACK_IMPORTED_MODULE_2__app_app_search__["a" /* default */])($seachInput, $blogUrl);

    /* show btn for Retur TOP PAGE */
    // setInterval( () => {
    //   ($(window).scrollTop() > 100) ? $('.rocket').removeClass('u-hide') : $('.rocket').addClass('u-hide');
    // }, 250);

  }, //end => Finalize
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 33 */
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
  this.popWidth = 600;
  this.popHeight = 480;
  this.left = ((window.innerWidth / 2) - (this.popWidth / 2)) + window.screenX;
  this.top = ((window.innerHeight / 2) - (this.popHeight / 2)) + window.screenY;
};

/**
 * @description Helper to get the attribute of a DOM element
 * @param {String} attr DOM element attribute
 * @returns {String|Empty} returns the attr value or empty string
 */
mapacheShare.prototype.attributes = function attributes (a) {
  var val = this.elem.attr(("data-" + a));
  return (val === undefined || val === null) ? false : val;
};

/**
 * @description Main share event. Will pop a window or redirect to a link
 */
mapacheShare.prototype.share = function share () {
  var socialMediaName = this.attributes('share').toLowerCase();

  var socialMedia = {
    facebook: {
      shareUrl: 'https://www.facebook.com/sharer.php',
      params: {
        u: this.attributes('url'),
      },
    },
    twitter: {
      shareUrl: 'https://twitter.com/intent/tweet/',
      params: {
        text: this.attributes('title'),
        url: this.attributes('url'),
      },
    },
    reddit: {
      shareUrl: 'https://www.reddit.com/submit',
      params: {
        url: this.attributes('url'),
      },
    },
    pinterest: {
      shareUrl: 'https://www.pinterest.com/pin/create/button/',
      params: {
        url: this.attributes('url'),
        description: this.attributes('title'),
      },
    },
    linkedin: {
      shareUrl: 'https://www.linkedin.com/shareArticle',
      params: {
        url: this.attributes('url'),
        mini: true,
      },
    },
    whatsapp: {
      shareUrl: 'whatsapp://send',
      params: {
        text: this.attributes('title') + ' ' + this.attributes('url'),
      },
      isLink: true,
    },
    pocket: {
      shareUrl: 'https://getpocket.com/save',
      params: {
        url: this.attributes('url'),
      },
    },
  };

  var social = socialMedia[socialMediaName];

  return social !== undefined ? this.popup(social) : false;
};

/* windows Popup */
mapacheShare.prototype.popup = function popup (share) {
  var p = share.params || {};
  var keys = Object.keys(p);

  var socialMediaUrl = share.shareUrl;
  var str = keys.length > 0 ? '?' : '';

  Object.keys(keys).forEach(function (i) {
    if (str !== '?') {
      str += '&';
    }

    if (p[keys[i]]) {
      str += (keys[i]) + "=" + (encodeURIComponent(p[keys[i]]));
    }
  });

  socialMediaUrl += str;

  if (!share.isLink) {
    var popParams = "scrollbars=no, width=" + (this.popWidth) + ", height=" + (this.popHeight) + ", top=" + (this.top) + ", left=" + (this.left);
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
/* 34 */
/*!***********************************!*\
  !*** ./scripts/app/app.follow.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["a"] = (function (links, urlRegexp) {

  $('.follow-toggle').removeClass('u-hide');

  return $.each(links, function (name, url) {
    if (typeof url === 'string' && urlRegexp.test(url)) {
      var template = "<a href=\"" + url + "\" title=\"Follow me in " + name + "\" target=\"_blank\" class=\"i-" + name + "\"></a>";

      $('.followMe').append(template);
    }
  });
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 35 */
/*!***********************************!*\
  !*** ./scripts/app/app.search.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["a"] = (function ($input, blogUrl) {
  /* Toggle card for search Search */
  $('.search-toggle').on('click', function (e) {
    e.preventDefault();
    $('body').toggleClass('is-search').removeClass('is-showNavMob');
    $input.focus();
  });

  /* Search Template */
  var searchTemplate = "\n  <a class=\"u-block\" href=\"" + blogUrl + "{{link}}\">\n    <span class=\"u-contentTitle u-fontSizeBase\">{{title}}</span>\n    <span class=\"u-block u-fontSizeSmaller u-textColorNormal u-paddingTop5\">{{pubDate}}</span>\n  </a>";

  // Search
  return $input.ghostHunter({
    results: '#searchResults',
    zeroResultsInfo: true,
    info_template: '<p class="u-paddingBottom20 u-fontSize15">Showing {{amount}} results</p>',
    result_template: searchTemplate,
    onKeyUp: true,
  });
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 36 */
/*!*****************************************!*\
  !*** ./scripts/app/app.footer.links.js ***!
  \*****************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["a"] = (function (links, urlRegexp) {
  $('.footer-menu').removeClass('u-hide');

  return $.each(links, function (name, url) {
    if (typeof url === 'string' && urlRegexp.test(url)) {
      var template = "<li><a href=\"" + url + "\" title=\"" + name + "\">" + name + "</a></li>";

      $('.footer-menu').append(template);
    }
  });
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 37 */
/*!************************************!*\
  !*** ./scripts/app/app.twitter.js ***!
  \************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["a"] = (function (name, number) {
  $('.widget-twitter').removeClass('u-hide');
  var twitterBlock = "<a class=\"twitter-timeline\"  href=\"https://twitter.com/" + name + "\" data-chrome=\"nofooter noborders noheader\" data-tweet-limit=\"" + number + "\">Tweets by " + name + "</a><script async src=\"//platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>"; // eslint-disable-line
  $('.widget-twitter').append(twitterBlock);
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 38 */
/*!********************************!*\
  !*** ./scripts/routes/post.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prismjs__ = __webpack_require__(/*! prismjs */ 39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prismjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prismjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader__ = __webpack_require__(/*! prismjs/plugins/autoloader/prism-autoloader */ 41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers__ = __webpack_require__(/*! prismjs/plugins/line-numbers/prism-line-numbers */ 42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_instagram__ = __webpack_require__(/*! ../app/app.instagram */ 43);
// import facebookShareCount from '../app/app.facebook-share-count';






/* Iframe SRC video */
var iframeVideo = [
  'iframe[src*="player.vimeo.com"]',
  'iframe[src*="dailymotion.com"]',
  'iframe[src*="youtube.com"]',
  'iframe[src*="youtube-nocookie.com"]',
  'iframe[src*="vid.me"]',
  'iframe[src*="kickstarter.com"][src*="video.html"]' ];

/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    var $allMedia = $('.post-body').find(iframeVideo.join(','));

    // Video responsive
    // allMedia.map((key, value) => $(value).wrap('<aside class="video-responsive"></aside>'));
    $allMedia.each(function () {
      $(this).wrap('<aside class="video-responsive"></aside>').parent('.video-responsive');
    });
  },
  finalize: function finalize() {
    // Add data action zoom FOR IMG
    $('.post-body').find('img').attr('data-action', 'zoom');
    $('.post-body').find('a').find('img').removeAttr("data-action")

    // Open Post Comments
    $('.toggle-comments').on('click', function (e) {
      e.preventDefault();
      $('body').toggleClass('has-comments').removeClass('is-showNavMob')
    });

    // sticky share post in left
    $('.sharePost').theiaStickySidebar({
      additionalMarginTop: 120,
      minWidth: 970,
    });

    // Instagram Feed
    if (typeof instagramUserId !== 'undefined' && typeof instagramToken !== 'undefined' && typeof instagramUserName !== 'undefined') {
      Object(__WEBPACK_IMPORTED_MODULE_3__app_app_instagram__["a" /* default */])(instagramUserId, instagramToken, instagramUserName); // eslint-disable-line
    }

    /* Prism autoloader */
    __WEBPACK_IMPORTED_MODULE_0_prismjs___default.a.highlightAll();

    // Prism.plugins.autoloader.languages_path = `${$('body').attr('data-page')}/assets/scripts/components/`; // eslint-disable-line
  }, // end finalize
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 39 */
/*!****************************************!*\
  !*** ../node_modules/prismjs/prism.js ***!
  \****************************************/
/*! dynamic exports provided */
/*! exports used: default */
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
var lang = /\blang(?:uage)?-([\w-]+)\b/i;
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
		clone: function (o, visited) {
			var type = _.util.type(o);
			visited = visited || {};

			switch (type) {
				case 'Object':
					if (visited[_.util.objId(o)]) {
						return visited[_.util.objId(o)];
					}
					var clone = {};
					visited[_.util.objId(o)] = clone;

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key], visited);
						}
					}

					return clone;

				case 'Array':
					if (visited[_.util.objId(o)]) {
						return visited[_.util.objId(o)];
					}
					var clone = [];
					visited[_.util.objId(o)] = clone;

					o.forEach(function (v, i) {
						clone[i] = _.util.clone(v, visited);
					});

					return clone;
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
		var env = {
			code: text,
			grammar: grammar,
			language: language
		};
		_.hooks.run('before-tokenize', env);
		env.tokens = _.tokenize(env.code, env.grammar);
		_.hooks.run('after-tokenize', env);
		return Token.stringify(_.util.encode(env.tokens), env.language);
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

					if (greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						var match = pattern.exec(text);
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

						// If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						if (strarr[i] instanceof Token) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					} else {
						pattern.lastIndex = 0;

						var match = pattern.exec(str),
							delNum = 1;
					}

					if (!match) {
						if (oneshot) {
							break;
						}

						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1] ? match[1].length : 0;
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
		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		greedy: true,
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

Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

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
			lookbehind: true,
			greedy: true
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
	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
	'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
		lookbehind: true,
		greedy: true
	},
	// This must be declared before keyword because we use "function" inside the look-forward
	'function-variable': {
		pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
		alias: 'function'
	},
	'constant': /\b[A-Z][A-Z\d_]*\b/
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\${[^}]+}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\${|}$/,
						alias: 'punctuation'
					},
					rest: null // See below
				}
			},
			'string': /[\s\S]+/
		}
	}
});
Prism.languages.javascript['template-string'].inside['interpolation'].inside.rest = Prism.languages.javascript;

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
			var lang = /\blang(?:uage)?-([\w-]+)\b/i;
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

		if (Prism.plugins.toolbar) {
			Prism.plugins.toolbar.registerButton('download-file', function (env) {
				var pre = env.element.parentNode;
				if (!pre || !/pre/i.test(pre.nodeName) || !pre.hasAttribute('data-src') || !pre.hasAttribute('data-download-link')) {
					return;
				}
				var src = pre.getAttribute('data-src');
				var a = document.createElement('a');
				a.textContent = pre.getAttribute('data-download-link-label') || 'Download';
				a.setAttribute('download', '');
				a.href = src;
				return a;
			});
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 40)))

/***/ }),
/* 40 */
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
/* 41 */
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
	var lang_dependencies = /*languages_placeholder[*/{"javascript":"clike","actionscript":"javascript","arduino":"cpp","aspnet":["markup","csharp"],"bison":"c","c":"clike","csharp":"clike","cpp":"c","coffeescript":"javascript","crystal":"ruby","css-extras":"css","d":"clike","dart":"clike","django":"markup","erb":["ruby","markup-templating"],"fsharp":"clike","flow":"javascript","glsl":"clike","go":"clike","groovy":"clike","haml":"ruby","handlebars":"markup-templating","haxe":"clike","java":"clike","jolie":"clike","kotlin":"clike","less":"css","markdown":"markup","markup-templating":"markup","n4js":"javascript","nginx":"clike","objectivec":"c","opencl":"cpp","parser":"markup","php":["clike","markup-templating"],"php-extras":"php","plsql":"sql","processing":"clike","protobuf":"clike","pug":"javascript","qore":"clike","jsx":["markup","javascript"],"tsx":["jsx","typescript"],"reason":"clike","ruby":"clike","sass":"css","scss":"css","scala":"java","smarty":"markup-templating","soy":"markup-templating","swift":"clike","tap":"yaml","textile":"markup","tt2":["clike","markup-templating"],"twig":"markup","typescript":"javascript","vbnet":"basic","velocity":"markup","wiki":"markup","xeora":"markup","xquery":"markup"}/*]*/;

	var lang_data = {};

	var ignored_language = 'none';

	var script = document.getElementsByTagName('script');
	script = script[script.length - 1];
	var languages_path = 'components/';
	if(script.hasAttribute('data-autoloader-path')) {
		var path = script.getAttribute('data-autoloader-path').trim();
		if(path.length > 0 && !/^[a-z]+:\/\//i.test(script.src)) {
			languages_path = path.replace(/\/?$/, '/');
		}
	} else if (/[\w-]+\.js$/.test(script.src)) {
		languages_path = script.src.replace(/[\w-]+\.js$/, 'components/');
	}
	var config = Prism.plugins.autoloader = {
		languages_path: languages_path,
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
/* 42 */
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
/* 43 */
/*!**************************************!*\
  !*** ./scripts/app/app.instagram.js ***!
  \**************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {// user id => 1397790551
// token => 1397790551.1aa422d.37dca7d33ba34544941e111aa03e85c7
// user nname => GodoFredoNinja
// http://instagram.com/oauth/authorize/?client_id=YOURCLIENTIDHERE&redirect_uri=HTTP://YOURREDIRECTURLHERE.COM&response_type=token

/* Template for images */
function makeImages (data) {
  var template = "\n    <div class=\"instagram-col col s6 m4 l2\">\n      <a href=\"" + (data.link) + "\" class=\"instagram-img u-relative u-overflowHidden u-sizeFullWidth u-block\" target=\"_blank\">\n        <span class=\"u-absolute0 u-backgroundSizeCover u-backgroundColorGrayLight instagram-lazy lazy\" data-original=\"" + (data.images.standard_resolution.url) + "\" style:\"z-index:2\"></span>\n        <div class=\"instagram-hover u-absolute0 u-flexColumn\" style=\"z-index:3\">\n          <div class=\"u-textAlignCenter u-fontWeightBold u-textColorWhite u-fontSize20\">\n            <span style=\"padding-right:10px\"><i class=\"i-favorite\"></i> " + (data.likes.count) + "</span>\n            <span style=\"padding-left:10px\"><i class=\"i-comments\"></i> " + (data.comments.count) + "</span>\n          </div>\n        </div>\n      </a>\n    </div>\n  ";

  return template;
}

/* harmony default export */ __webpack_exports__["a"] = (function (userId, token, userName) {
  var imageTotal = 6;
  var getUrl = "https://api.instagram.com/v1/users/" + userId + "/media/recent/?access_token=" + token + "&count=" + imageTotal + "&callback=?";
  var userTemplate = "<a href=\"https://www.instagram.com/" + userName + "\" class=\"button button--large button--chromeless\" target=\"_blank\"><i class=\"i-instagram\"></i> " + userName + "</a>";

  $.ajax({
    url: getUrl,
    dataType: 'jsonp',
    type: 'GET',
    success: function (res) {
      res.data.map( function (dataImage) {
        var images = makeImages(dataImage);

        $('.instagram').removeClass('u-hide');
        $('.instagram-wrap').append(images);
        $('.instagram-name').html(userTemplate);
      });
    },
    complete: function () { $('.instagram-lazy.lazy').lazyload({effect : 'fadeIn'}) },
    error: function () { $('.instagram').remove() },
  });
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 44 */
/*!*********************************!*\
  !*** ./scripts/routes/video.js ***!
  \*********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* Iframe SRC video */
var iframeVideo = [
  'iframe[src*="player.vimeo.com"]',
  'iframe[src*="dailymotion.com"]',
  'iframe[src*="youtube.com"]',
  'iframe[src*="youtube-nocookie.com"]',
  'iframe[src*="vid.me"]',
  'iframe[src*="kickstarter.com"][src*="video.html"]' ];

/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    var $videoEmbed = $('.cc-video-embed');
    var firstVideo = $('.post-body-wrap').find(iframeVideo.join(','))[0];

    if (typeof firstVideo === 'undefined') {
      return;
    }

    var $video = $(firstVideo);
    var $firstParentVideo = $video.parent('.video-responsive');
    var $secondParentVideo = $firstParentVideo.parent('.kg-embed-card');

    // Append Video
    if ($secondParentVideo.hasClass('kg-embed-card')) {
      $secondParentVideo.appendTo($videoEmbed);
    } else {
      $firstParentVideo.appendTo($videoEmbed);
    }
  },

  finalize: function finalize() {
    //  Dnot scroll
    var didScroll = false;

    // Active Scroll
    $(window).on('scroll.video', function () { return didScroll = true; } );

    // Fixed video in te footer of page
    function fixedVideo() {
      var scrollTop = $(window).scrollTop();
      var elementOffset = $('.post').offset().top;

      if (scrollTop > elementOffset){
        $('body').addClass('has-video-fixed');
      } else {
        $('body').removeClass('has-video-fixed');
      }
    }

    // Close video fixed
    $('.cc-video-close').on('click', function () {
      $('body').removeClass('has-video-fixed');
      $(window).off('scroll.video');
    });

    setInterval(function () {
      if (didScroll) {
        fixedVideo();
        didScroll = false;
      }
    }, 500);
  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 45 */
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

/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    var firstAudio = $('.post-body').find(iframeAudio.join(','))[0];

    $audioPostFormat.removeClass('u-hide');
    $(firstAudio).appendTo($audioPostFormat);
  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 46 */
/*!***************************************!*\
  !*** ./scripts/app/app.pagination.js ***!
  \***************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/**
 * @package godofredoninja
 * pagination
 * the code only runs on the first home page, author, tag
 *
 * the page is inspired by the casper code theme for ghost
 */

/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // Variables
    var $buttonLoadMore = $('.load-more');
    var $result = $('.story-feed');
    // const $win = $(window);

    var pathname = window.location.pathname;
    var currentPage = 1;
    // let lastScroll = 0;

    // show button for load more
    if (maxPages >= 2){ // eslint-disable-line
      $buttonLoadMore.removeClass('u-hide');
    }

    function sanitizePathname(path) {
      var paginationRegex = /(?:page\/)(\d)(?:\/)$/i;

      // remove hash params from path
      path = path.replace(/#(.*)$/g, '').replace('////g', '/');

      // remove pagination from the path and replace the current pages
      // with the actual requested page. E. g. `/page/3/` indicates that
      // the user actually requested page 3, so we should request page 4
      // next, unless it's the last page already.
      if (path.match(paginationRegex)) {
        currentPage = parseInt(path.match(paginationRegex)[1]);

        path = path.replace(paginationRegex, '');
      }

      return path;
    }

    function mapachePagination (e) {
      var this$1 = this;

      e.preventDefault();

      // sanitize the pathname from possible pagination or hash params
      pathname = sanitizePathname(pathname);

      /**
      * maxPages is defined in default.hbs and is the value
      * of the amount of pagination pages.
      * If we reached the last page or are past it,
      * we return and disable the listeners.
      */
      if (currentPage >= maxPages) { // eslint-disable-line
        $(this).remove();

        return;
      }

      // next page
      currentPage += 1;

      // Load more
      var nextPage = pathname + "page/" + currentPage + "/";

      /* Fetch Page */
      $.get(nextPage, function (content) {
        var parse = document.createRange().createContextualFragment(content);
        var posts = parse.querySelector('.story-feed-content');

        $result[0].appendChild(posts);

      }).fail( function (xhr) {
        // 404 indicates we've run out of pages
        if (xhr.status === 404) {
          $(this$1).remove();
        }
      }).always( function () {
        /* Lazy load for image */
        $('.story-image-lazy').lazyload({ threshold : 200 });
      });

    }

    /* Is visble next page */
    // function isVisible(element) {
    //   const scroll_pos = $win.scrollTop();
    //   const windowHeight = $win.height();
    //   const elementTop = $(element).offset().top;
    //   const elementHeight = $(element).height();
    //   const elementBottom = elementTop + elementHeight;

    //   return ((elementBottom - elementHeight * 0.25 > scroll_pos) && (elementTop < (scroll_pos + 0.5 * windowHeight)));
    // }

    /**
     * the url is changed when the articles on the next page are loaded.
     */
    // function historyReplaceState () {
    //   const scroll = $win.scrollTop();

    //   if (Math.abs(scroll - lastScroll) > $win.height() * 0.1) {
    //     lastScroll = scroll;

    //     $('.story-feed-content').each(function () {
    //       if (isVisible($(this))) {
    //         history.replaceState(null, null, $(this).attr("data-page"));
    //         return false;
    //       }
    //     });
    //   }
    // }


    // Click buttom for Load More Post
    $buttonLoadMore.on('click', mapachePagination);

    // history Replace State
    // setInterval(() => historyReplaceState(), 500);
  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 47 */
/*!**************************!*\
  !*** ./styles/main.scss ***!
  \**************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 16);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ 18)(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 16, function() {
		var newContent = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 16);

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 48 */
/*!****************************************************!*\
  !*** ../node_modules/css-loader/lib/url/escape.js ***!
  \****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 49 */
/*!***************************!*\
  !*** ./images/avatar.png ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJsAAACbCAMAAABCvxm+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCMERFNUY2MzE4Q0QxMUUzODE4RkFDREMyNzVDMjRDQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCMERFNUY2NDE4Q0QxMUUzODE4RkFDREMyNzVDMjRDQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkIwREU1RjYxMThDRDExRTM4MThGQUNEQzI3NUMyNENDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkIwREU1RjYyMThDRDExRTM4MThGQUNEQzI3NUMyNENDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+gkOp7wAAAjFQTFRFzN7oJCYo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"

/***/ }),
/* 50 */
/*!***************************!*\
  !*** ./fonts/mapache.ttf ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.ttf";

/***/ }),
/* 51 */
/*!****************************!*\
  !*** ./fonts/mapache.woff ***!
  \****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.woff";

/***/ }),
/* 52 */
/*!***************************!*\
  !*** ./fonts/mapache.svg ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.svg";

/***/ }),
/* 53 */
/*!******************************!*\
  !*** ./images/not-image.png ***!
  \******************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAAIklEQVR42mJZtWoVMwMUMIGIBZJv/sA5Cc9FWEA0IAAA//+HXQYK9umSYQAAAABJRU5ErkJggg=="

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map
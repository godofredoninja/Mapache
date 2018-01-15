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
/******/ 	var hotCurrentHash = "5aa2883f9ae1aafd7e38"; // eslint-disable-line no-unused-vars
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
/******/ 	return hotCreateRequire(30)(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
  autoConnect: true
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
    overlay = __webpack_require__(/*! ./client-overlay */ 10);
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
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

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
ansiHTML.setColors(colors);

var Entities = __webpack_require__(/*! html-entities */ 12).AllHtmlEntities;
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
  Html5Entities: __webpack_require__(/*! ./lib/html5-entities.js */ 0),
  AllHtmlEntities: __webpack_require__(/*! ./lib/html5-entities.js */ 0)
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

var	fixUrls = __webpack_require__(/*! ./urls */ 17);

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
/* 17 */
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
/* 18 */
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 19 */
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../node_modules/cache-loader/dist/cjs.js!../node_modules/css-loader?{"sourceMap":true}!../node_modules/postcss-loader/lib?{"config":{"path":"C://Users//Smigol//projects//ghost//content//themes//mapache//src//build","ctx":{"open":true,"copy":"images/**_/*","proxyUrl":"http://localhost:3000","cacheBusting":"[name]","paths":{"root":"C://Users//Smigol//projects//ghost//content//themes//mapache","assets":"C://Users//Smigol//projects//ghost//content//themes//mapache//src","dist":"C://Users//Smigol//projects//ghost//content//themes//mapache//assets"},"enabled":{"sourceMaps":true,"optimize":false,"cacheBusting":false,"watcher":true},"watch":"**_/*.hbs","entry":{"main":["./scripts/main.js","./styles/main.scss"],"theme-blue-semi-dark":"./styles/themes/blue-semi-dark.scss","theme-blue":"./styles/themes/blue.scss","theme-dark-blue":"./styles/themes/dark-blue.scss","theme-dark-cyan":"./styles/themes/dark-cyan.scss","theme-green":"./styles/themes/green.scss","theme-grey":"./styles/themes/grey.scss","theme-indigo":"./styles/themes/indigo.scss","theme-purple":"./styles/themes/purple.scss","theme-teal":"./styles/themes/teal.scss","theme-white":"./styles/themes/white.scss"},"publicPath":"/assets/","devUrl":"http://localhost:2368","env":{"production":false,"development":true},"manifest":{}}},"sourceMap":true}!../node_modules/resolve-url-loader?{"sourceMap":true}!../node_modules/sass-loader/lib/loader.js?{"sourceMap":true}!../node_modules/import-glob!./styles/main.scss ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ 1)(true);
// imports
exports.i(__webpack_require__(/*! -!../../node_modules/css-loader?{"sourceMap":true}!normalize.css/normalize.css */ 56), "");
exports.i(__webpack_require__(/*! -!../../node_modules/css-loader?{"sourceMap":true}!prismjs/themes/prism.css */ 57), "");

// module
exports.push([module.i, "@charset \"UTF-8\";\n\npre.line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber;\n}\n\npre.line-numbers > code {\n  position: relative;\n  white-space: inherit;\n}\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber;\n}\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right;\n}\n\n@font-face {\n  font-family: 'mapache';\n  src: url(" + __webpack_require__(/*! ./../fonts/mapache.ttf */ 58) + ") format(\"truetype\"), url(" + __webpack_require__(/*! ./../fonts/mapache.woff */ 59) + ") format(\"woff\"), url(" + __webpack_require__(/*! ./../fonts/mapache.svg */ 60) + ") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n\n[class^=\"i-\"]:before,\n[class*=\" i-\"]:before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.i-navigate_before:before {\n  content: \"\\E408\";\n}\n\n.i-navigate_next:before {\n  content: \"\\E409\";\n}\n\n.i-tag:before {\n  content: \"\\E54E\";\n}\n\n.i-keyboard_arrow_down:before {\n  content: \"\\E313\";\n}\n\n.i-arrow_upward:before {\n  content: \"\\E5D8\";\n}\n\n.i-cloud_download:before {\n  content: \"\\E2C0\";\n}\n\n.i-star:before {\n  content: \"\\E838\";\n}\n\n.i-keyboard_arrow_up:before {\n  content: \"\\E316\";\n}\n\n.i-open_in_new:before {\n  content: \"\\E89E\";\n}\n\n.i-warning:before {\n  content: \"\\E002\";\n}\n\n.i-back:before {\n  content: \"\\E5C4\";\n}\n\n.i-forward:before {\n  content: \"\\E5C8\";\n}\n\n.i-chat:before {\n  content: \"\\E0CB\";\n}\n\n.i-close:before {\n  content: \"\\E5CD\";\n}\n\n.i-code2:before {\n  content: \"\\E86F\";\n}\n\n.i-favorite:before {\n  content: \"\\E87D\";\n}\n\n.i-link:before {\n  content: \"\\E157\";\n}\n\n.i-menu:before {\n  content: \"\\E5D2\";\n}\n\n.i-feed:before {\n  content: \"\\E0E5\";\n}\n\n.i-search:before {\n  content: \"\\E8B6\";\n}\n\n.i-share:before {\n  content: \"\\E80D\";\n}\n\n.i-check_circle:before {\n  content: \"\\E86C\";\n}\n\n.i-play:before {\n  content: \"\\E901\";\n}\n\n.i-download:before {\n  content: \"\\E900\";\n}\n\n.i-code:before {\n  content: \"\\F121\";\n}\n\n.i-behance:before {\n  content: \"\\F1B4\";\n}\n\n.i-spotify:before {\n  content: \"\\F1BC\";\n}\n\n.i-codepen:before {\n  content: \"\\F1CB\";\n}\n\n.i-github:before {\n  content: \"\\F09B\";\n}\n\n.i-linkedin:before {\n  content: \"\\F0E1\";\n}\n\n.i-flickr:before {\n  content: \"\\F16E\";\n}\n\n.i-dribbble:before {\n  content: \"\\F17D\";\n}\n\n.i-pinterest:before {\n  content: \"\\F231\";\n}\n\n.i-map:before {\n  content: \"\\F041\";\n}\n\n.i-twitter:before {\n  content: \"\\F099\";\n}\n\n.i-facebook:before {\n  content: \"\\F09A\";\n}\n\n.i-youtube:before {\n  content: \"\\F16A\";\n}\n\n.i-instagram:before {\n  content: \"\\F16D\";\n}\n\n.i-google:before {\n  content: \"\\F1A0\";\n}\n\n.i-pocket:before {\n  content: \"\\F265\";\n}\n\n.i-reddit:before {\n  content: \"\\F281\";\n}\n\n.i-snapchat:before {\n  content: \"\\F2AC\";\n}\n\n.i-telegram:before {\n  content: \"\\F2C6\";\n}\n\n/*\r\n@package godofredoninja\r\n\r\n========================================================================\r\nMapache variables styles\r\n========================================================================\r\n*/\n\n/**\r\n* Table of Contents:\r\n*\r\n*   1. Colors\r\n*   2. Fonts\r\n*   3. Typography\r\n*   4. Header\r\n*   5. Footer\r\n*   6. Code Syntax\r\n*   7. buttons\r\n*   8. container\r\n*   9. Grid\r\n*   10. Media Query Ranges\r\n*   11. Icons\r\n*/\n\n/* 1. Colors\r\n========================================================================== */\n\n/* 2. Fonts\r\n========================================================================== */\n\n/* 3. Typography\r\n========================================================================== */\n\n/* 4. Header\r\n========================================================================== */\n\n/* 5. Entry articles\r\n========================================================================== */\n\n/* 5. Footer\r\n========================================================================== */\n\n/* 6. Code Syntax\r\n========================================================================== */\n\n/* 7. buttons\r\n========================================================================== */\n\n/* 8. container\r\n========================================================================== */\n\n/* 9. Grid\r\n========================================================================== */\n\n/* 10. Media Query Ranges\r\n========================================================================== */\n\n/* 11. icons\r\n========================================================================== */\n\n.header.toolbar-shadow {\n  -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n          box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n}\n\na.external::after,\nhr::before,\n.warning:before,\n.note:before,\n.success:before,\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after,\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.u-clear::after {\n  clear: both;\n  content: \"\";\n  display: table;\n}\n\n.u-not-avatar {\n  background-image: url(" + __webpack_require__(/*! ./../images/avatar.png */ 61) + ");\n}\n\n.u-relative {\n  position: relative;\n}\n\n.u-block {\n  display: block;\n}\n\n.u-absolute0 {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n\n.u-bg-cover {\n  background-position: center;\n  background-size: cover;\n}\n\n.u-bg-gradient {\n  background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, 0.8)));\n}\n\n.u-border-bottom-dark,\n.sidebar-title {\n  border-bottom: solid 1px #000;\n}\n\n.u-b-t {\n  border-top: solid 1px #eee;\n}\n\n.u-p-t-2 {\n  padding-top: 2rem;\n}\n\n.u-unstyled {\n  list-style-type: none;\n  margin: 0;\n  padding-left: 0;\n}\n\n.u-floatLeft {\n  float: left !important;\n}\n\n.u-floatRight {\n  float: right !important;\n}\n\n.u-flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n}\n\n.u-flex-wrap {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n\n.u-flex-center,\n.header-logo,\n.header-follow a,\n.header-menu a {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n.u-flex-aling-right {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n\n.u-flex-aling-center {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n\n.u-m-t-1 {\n  margin-top: 1rem;\n}\n\n/* Tags\n========================================================================== */\n\n.u-tags {\n  font-size: 12px !important;\n  margin: 3px !important;\n  color: #4c5765 !important;\n  background-color: #ebebeb !important;\n  -webkit-transition: all .3s;\n  -o-transition: all .3s;\n  transition: all .3s;\n}\n\n.u-tags::before {\n  padding-right: 5px;\n  opacity: .8;\n}\n\n.u-tags:hover {\n  background-color: #4285f4 !important;\n  color: #fff !important;\n}\n\n.u-textUppercase {\n  text-transform: uppercase;\n}\n\n.u-tag {\n  background-color: #4285f4;\n  color: #fff;\n  padding: 4px 12px;\n  font-size: 11px;\n  display: inline-block;\n  text-transform: uppercase;\n}\n\n.u-hide {\n  display: none !important;\n}\n\n.u-card-shadow {\n  background-color: #fff;\n  -webkit-box-shadow: 0 5px 5px rgba(0, 0, 0, 0.02);\n          box-shadow: 0 5px 5px rgba(0, 0, 0, 0.02);\n}\n\n.u-not-image {\n  background-repeat: repeat;\n  background-size: initial !important;\n  background-color: #fff;\n}\n\n@media only screen and (max-width: 766px) {\n  .u-h-b-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  .u-h-b-lg {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  .u-h-a-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .u-h-a-lg {\n    display: none !important;\n  }\n}\n\nhtml {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  font-size: 16px;\n  -webkit-tap-highlight-color: transparent;\n}\n\n*,\n*::before,\n*::after {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\na {\n  color: #039be5;\n  outline: 0;\n  text-decoration: none;\n  -webkit-tap-highlight-color: transparent;\n}\n\na:focus {\n  text-decoration: none;\n}\n\na.external::after {\n  content: \"\\E89E\";\n  margin-left: 5px;\n}\n\nbody {\n  color: #333;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 0 auto;\n  background-color: #f5f5f5;\n}\n\nfigure {\n  margin: 0;\n}\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n}\n\nimg:not([src]) {\n  visibility: hidden;\n}\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n\ni {\n  display: inline-block;\n  vertical-align: middle;\n}\n\nhr {\n  background: #F1F2F1;\n  background: -webkit-gradient(linear, left top, right top, color-stop(0, #F1F2F1), color-stop(50%, #b5b5b5), to(#F1F2F1));\n  background: -webkit-linear-gradient(left, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  background: -o-linear-gradient(left, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  background: linear-gradient(to right, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  border: none;\n  height: 1px;\n  margin: 80px auto;\n  max-width: 90%;\n  position: relative;\n}\n\nhr::before {\n  background: #fff;\n  color: rgba(73, 55, 65, 0.75);\n  content: \"\\F121\";\n  display: block;\n  font-size: 35px;\n  left: 50%;\n  padding: 0 25px;\n  position: absolute;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n       -o-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n}\n\nblockquote {\n  border-left: 4px solid #4285f4;\n  padding: .75rem 1.5rem;\n  background: #fbfbfc;\n  color: #757575;\n  font-size: 1.125rem;\n  line-height: 1.7;\n  margin: 0 0 1.25rem;\n  quotes: none;\n}\n\nol,\nul,\nblockquote {\n  margin-left: 2rem;\n}\n\nstrong {\n  font-weight: 500;\n}\n\nsmall,\n.small {\n  font-size: 85%;\n}\n\nol {\n  padding-left: 40px;\n  list-style: decimal outside;\n}\n\nmark {\n  background-color: #fdffb6;\n}\n\n.footer,\n.main {\n  -webkit-transition: -webkit-transform .5s ease;\n  transition: -webkit-transform .5s ease;\n  -o-transition: -o-transform .5s ease;\n  transition: transform .5s ease;\n  transition: transform .5s ease, -webkit-transform .5s ease, -o-transform .5s ease;\n  z-index: 2;\n}\n\n/* Code Syntax\r\n========================================================================== */\n\nkbd,\nsamp,\ncode {\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  color: #c7254e;\n  background: #f7f7f7;\n  border-radius: 4px;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\ncode[class*=language-],\npre[class*=language-] {\n  color: #37474f;\n  line-height: 1.5;\n}\n\ncode[class*=language-] .token.comment,\npre[class*=language-] .token.comment {\n  opacity: .8;\n}\n\ncode[class*=language-].line-numbers,\npre[class*=language-].line-numbers {\n  padding-left: 58px;\n}\n\ncode[class*=language-].line-numbers::before,\npre[class*=language-].line-numbers::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  background: #F0EDEE;\n  width: 40px;\n  height: 100%;\n}\n\ncode[class*=language-] .line-numbers-rows,\npre[class*=language-] .line-numbers-rows {\n  border-right: none;\n  top: -3px;\n  left: -58px;\n}\n\ncode[class*=language-] .line-numbers-rows > span::before,\npre[class*=language-] .line-numbers-rows > span::before {\n  padding-right: 0;\n  text-align: center;\n  opacity: .8;\n}\n\npre {\n  background-color: #f7f7f7 !important;\n  padding: 1rem;\n  overflow: hidden;\n  border-radius: 4px;\n  word-wrap: normal;\n  margin: 2.5rem 0 !important;\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  position: relative;\n}\n\npre code {\n  color: #37474f;\n  text-shadow: 0 1px #fff;\n  padding: 0;\n  background: transparent;\n}\n\n/* .warning & .note & .success\r\n========================================================================== */\n\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n}\n\n.warning:before {\n  content: \"\\E002\";\n}\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n}\n\n.note:before {\n  content: \"\\E838\";\n}\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n}\n\n.success:before {\n  content: \"\\E86C\";\n  color: #00bfa5;\n}\n\n.warning,\n.note,\n.success {\n  display: block;\n  margin: 1rem 0;\n  font-size: 1rem;\n  padding: 12px 24px 12px 60px;\n  line-height: 1.5;\n}\n\n.warning a,\n.note a,\n.success a {\n  text-decoration: underline;\n  color: inherit;\n}\n\n.warning:before,\n.note:before,\n.success:before {\n  margin-left: -36px;\n  float: left;\n  font-size: 24px;\n}\n\n/* Social icon color and background\r\n========================================================================== */\n\n.c-facebook {\n  color: #3b5998;\n}\n\n.bg-facebook,\n.nav-mob-follow .i-facebook {\n  background-color: #3b5998 !important;\n}\n\n.c-twitter {\n  color: #55acee;\n}\n\n.bg-twitter,\n.nav-mob-follow .i-twitter {\n  background-color: #55acee !important;\n}\n\n.c-google {\n  color: #dd4b39;\n}\n\n.bg-google,\n.nav-mob-follow .i-google {\n  background-color: #dd4b39 !important;\n}\n\n.c-instagram {\n  color: #306088;\n}\n\n.bg-instagram,\n.nav-mob-follow .i-instagram {\n  background-color: #306088 !important;\n}\n\n.c-youtube {\n  color: #e52d27;\n}\n\n.bg-youtube,\n.nav-mob-follow .i-youtube {\n  background-color: #e52d27 !important;\n}\n\n.c-github {\n  color: #333333;\n}\n\n.bg-github,\n.nav-mob-follow .i-github {\n  background-color: #333333 !important;\n}\n\n.c-linkedin {\n  color: #007bb6;\n}\n\n.bg-linkedin,\n.nav-mob-follow .i-linkedin {\n  background-color: #007bb6 !important;\n}\n\n.c-spotify {\n  color: #2ebd59;\n}\n\n.bg-spotify,\n.nav-mob-follow .i-spotify {\n  background-color: #2ebd59 !important;\n}\n\n.c-codepen {\n  color: #222222;\n}\n\n.bg-codepen,\n.nav-mob-follow .i-codepen {\n  background-color: #222222 !important;\n}\n\n.c-behance {\n  color: #131418;\n}\n\n.bg-behance,\n.nav-mob-follow .i-behance {\n  background-color: #131418 !important;\n}\n\n.c-dribbble {\n  color: #ea4c89;\n}\n\n.bg-dribbble,\n.nav-mob-follow .i-dribbble {\n  background-color: #ea4c89 !important;\n}\n\n.c-flickr {\n  color: #0063DC;\n}\n\n.bg-flickr,\n.nav-mob-follow .i-flickr {\n  background-color: #0063DC !important;\n}\n\n.c-reddit {\n  color: orangered;\n}\n\n.bg-reddit,\n.nav-mob-follow .i-reddit {\n  background-color: orangered !important;\n}\n\n.c-pocket {\n  color: #F50057;\n}\n\n.bg-pocket,\n.nav-mob-follow .i-pocket {\n  background-color: #F50057 !important;\n}\n\n.c-pinterest {\n  color: #bd081c;\n}\n\n.bg-pinterest,\n.nav-mob-follow .i-pinterest {\n  background-color: #bd081c !important;\n}\n\n.c-feed {\n  color: orange;\n}\n\n.bg-feed,\n.nav-mob-follow .i-feed {\n  background-color: orange !important;\n}\n\n.c-telegram {\n  color: #08c;\n}\n\n.bg-telegram,\n.nav-mob-follow .i-telegram {\n  background-color: #08c !important;\n}\n\n.clear:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n/* pagination Infinite scroll\r\n========================================================================== */\n\n.mapache-load-more {\n  border: solid 1px #C3C3C3;\n  color: #7D7D7D;\n  display: block;\n  font-size: 15px;\n  height: 45px;\n  margin: 4rem auto;\n  padding: 11px 16px;\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n.mapache-load-more:hover {\n  background: #4285f4;\n  border-color: #4285f4;\n  color: #fff;\n}\n\n.pagination-nav {\n  padding: 2.5rem 0 3rem;\n  text-align: center;\n}\n\n.pagination-nav .page-number {\n  display: none;\n  padding-top: 5px;\n}\n\n@media only screen and (min-width: 766px) {\n  .pagination-nav .page-number {\n    display: inline-block;\n  }\n}\n\n.pagination-nav .newer-posts {\n  float: left;\n}\n\n.pagination-nav .older-posts {\n  float: right;\n}\n\n/* Scroll Top\r\n========================================================================== */\n\n.scroll_top {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  z-index: 11;\n  width: 60px;\n  opacity: 0;\n  visibility: hidden;\n  -webkit-transition: opacity 0.5s ease;\n  -o-transition: opacity 0.5s ease;\n  transition: opacity 0.5s ease;\n}\n\n.scroll_top.visible {\n  opacity: 1;\n  visibility: visible;\n}\n\n.scroll_top:hover svg path {\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n.svg-icon svg {\n  width: 100%;\n  height: auto;\n  display: block;\n  fill: currentcolor;\n}\n\n/* Video Responsive\r\n========================================================================== */\n\n.video-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n  padding-bottom: 56.25%;\n  margin-bottom: 1.5rem;\n}\n\n.video-responsive iframe {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  border: 0;\n}\n\n/* Video full for tag video\r\n========================================================================== */\n\n#video-format .video-content {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding-bottom: 1rem;\n}\n\n#video-format .video-content span {\n  display: inline-block;\n  vertical-align: middle;\n  margin-right: .8rem;\n}\n\n/* Page error 404\r\n========================================================================== */\n\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n  height: 100vh;\n  position: relative;\n  width: 100%;\n}\n\n.errorPage-title {\n  padding: 24px 60px;\n}\n\n.errorPage-link {\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 22px;\n  font-weight: 500;\n  left: -5px;\n  position: relative;\n  text-rendering: optimizeLegibility;\n  top: -6px;\n}\n\n.errorPage-emoji {\n  color: rgba(0, 0, 0, 0.4);\n  font-size: 150px;\n}\n\n.errorPage-text {\n  color: rgba(0, 0, 0, 0.4);\n  line-height: 21px;\n  margin-top: 60px;\n  white-space: pre-wrap;\n}\n\n.errorPage-wrap {\n  display: block;\n  left: 50%;\n  min-width: 680px;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n       -o-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n}\n\n/* Post Twitter facebook card embed Css Center\r\n========================================================================== */\n\n.post iframe[src*=\"facebook.com\"],\n.post .fb-post,\n.post .twitter-tweet {\n  display: block !important;\n  margin: 1.5rem 0 !important;\n}\n\n.container {\n  margin: 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n  width: 100%;\n  max-width: 1250px;\n}\n\n.margin-top {\n  margin-top: 50px;\n  padding-top: 1rem;\n}\n\n@media only screen and (min-width: 766px) {\n  .margin-top {\n    padding-top: 1.8rem;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  .content {\n    -ms-flex-preferred-size: 69.66666667% !important;\n        flex-basis: 69.66666667% !important;\n    max-width: 69.66666667% !important;\n  }\n\n  .sidebar {\n    -ms-flex-preferred-size: 30.33333333% !important;\n        flex-basis: 30.33333333% !important;\n    max-width: 30.33333333% !important;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  .content {\n    padding-right: 40px !important;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .feed-entry-wrapper .entry-image {\n    width: 40% !important;\n    max-width: 40% !important;\n  }\n\n  .feed-entry-wrapper .entry-body {\n    width: 60% !important;\n    max-width: 60% !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  body.is-article .content {\n    max-width: 100% !important;\n  }\n}\n\n.row {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 0;\n      -ms-flex: 0 1 auto;\n          flex: 0 1 auto;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-flow: row wrap;\n          flex-flow: row wrap;\n  margin-left: -0.9375rem;\n  margin-right: -0.9375rem;\n}\n\n.row .col {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n}\n\n.row .col.s1 {\n  -ms-flex-preferred-size: 8.33333%;\n      flex-basis: 8.33333%;\n  max-width: 8.33333%;\n}\n\n.row .col.s2 {\n  -ms-flex-preferred-size: 16.66667%;\n      flex-basis: 16.66667%;\n  max-width: 16.66667%;\n}\n\n.row .col.s3 {\n  -ms-flex-preferred-size: 25%;\n      flex-basis: 25%;\n  max-width: 25%;\n}\n\n.row .col.s4 {\n  -ms-flex-preferred-size: 33.33333%;\n      flex-basis: 33.33333%;\n  max-width: 33.33333%;\n}\n\n.row .col.s5 {\n  -ms-flex-preferred-size: 41.66667%;\n      flex-basis: 41.66667%;\n  max-width: 41.66667%;\n}\n\n.row .col.s6 {\n  -ms-flex-preferred-size: 50%;\n      flex-basis: 50%;\n  max-width: 50%;\n}\n\n.row .col.s7 {\n  -ms-flex-preferred-size: 58.33333%;\n      flex-basis: 58.33333%;\n  max-width: 58.33333%;\n}\n\n.row .col.s8 {\n  -ms-flex-preferred-size: 66.66667%;\n      flex-basis: 66.66667%;\n  max-width: 66.66667%;\n}\n\n.row .col.s9 {\n  -ms-flex-preferred-size: 75%;\n      flex-basis: 75%;\n  max-width: 75%;\n}\n\n.row .col.s10 {\n  -ms-flex-preferred-size: 83.33333%;\n      flex-basis: 83.33333%;\n  max-width: 83.33333%;\n}\n\n.row .col.s11 {\n  -ms-flex-preferred-size: 91.66667%;\n      flex-basis: 91.66667%;\n  max-width: 91.66667%;\n}\n\n.row .col.s12 {\n  -ms-flex-preferred-size: 100%;\n      flex-basis: 100%;\n  max-width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  .row .col.m1 {\n    -ms-flex-preferred-size: 8.33333%;\n        flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  .row .col.m2 {\n    -ms-flex-preferred-size: 16.66667%;\n        flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  .row .col.m3 {\n    -ms-flex-preferred-size: 25%;\n        flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .row .col.m4 {\n    -ms-flex-preferred-size: 33.33333%;\n        flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  .row .col.m5 {\n    -ms-flex-preferred-size: 41.66667%;\n        flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  .row .col.m6 {\n    -ms-flex-preferred-size: 50%;\n        flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .row .col.m7 {\n    -ms-flex-preferred-size: 58.33333%;\n        flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  .row .col.m8 {\n    -ms-flex-preferred-size: 66.66667%;\n        flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  .row .col.m9 {\n    -ms-flex-preferred-size: 75%;\n        flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .row .col.m10 {\n    -ms-flex-preferred-size: 83.33333%;\n        flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  .row .col.m11 {\n    -ms-flex-preferred-size: 91.66667%;\n        flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  .row .col.m12 {\n    -ms-flex-preferred-size: 100%;\n        flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .row .col.l1 {\n    -ms-flex-preferred-size: 8.33333%;\n        flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  .row .col.l2 {\n    -ms-flex-preferred-size: 16.66667%;\n        flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  .row .col.l3 {\n    -ms-flex-preferred-size: 25%;\n        flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .row .col.l4 {\n    -ms-flex-preferred-size: 33.33333%;\n        flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  .row .col.l5 {\n    -ms-flex-preferred-size: 41.66667%;\n        flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  .row .col.l6 {\n    -ms-flex-preferred-size: 50%;\n        flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .row .col.l7 {\n    -ms-flex-preferred-size: 58.33333%;\n        flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  .row .col.l8 {\n    -ms-flex-preferred-size: 66.66667%;\n        flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  .row .col.l9 {\n    -ms-flex-preferred-size: 75%;\n        flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .row .col.l10 {\n    -ms-flex-preferred-size: 83.33333%;\n        flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  .row .col.l11 {\n    -ms-flex-preferred-size: 91.66667%;\n        flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  .row .col.l12 {\n    -ms-flex-preferred-size: 100%;\n        flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\n.h1,\n.h2,\n.h3,\n.h4,\n.h5,\n.h6 {\n  margin-bottom: 0.5rem;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: 700;\n  line-height: 1.1;\n  color: inherit;\n}\n\nh1 {\n  font-size: 2.25rem;\n}\n\nh2 {\n  font-size: 1.875rem;\n}\n\nh3 {\n  font-size: 1.5625rem;\n}\n\nh4 {\n  font-size: 1.375rem;\n}\n\nh5 {\n  font-size: 1.125rem;\n}\n\nh6 {\n  font-size: 1rem;\n}\n\n.h1 {\n  font-size: 2.25rem;\n}\n\n.h2 {\n  font-size: 1.875rem;\n}\n\n.h3 {\n  font-size: 1.5625rem;\n}\n\n.h4 {\n  font-size: 1.375rem;\n}\n\n.h5 {\n  font-size: 1.125rem;\n}\n\n.h6 {\n  font-size: 1rem;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  margin-bottom: 1rem;\n}\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  color: inherit;\n  line-height: inherit;\n}\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\n\n/* Navigation Mobile\r\n========================================================================== */\n\n.nav-mob {\n  background: #4285f4;\n  color: #000;\n  height: 100vh;\n  left: 0;\n  padding: 0 20px;\n  position: fixed;\n  right: 0;\n  top: 0;\n  -webkit-transform: translateX(100%);\n       -o-transform: translateX(100%);\n          transform: translateX(100%);\n  -webkit-transition: .4s;\n  -o-transition: .4s;\n  transition: .4s;\n  will-change: transform;\n  z-index: 997;\n}\n\n.nav-mob a {\n  color: inherit;\n}\n\n.nav-mob ul a {\n  display: block;\n  font-weight: 500;\n  padding: 8px 0;\n  text-transform: uppercase;\n  font-size: 14px;\n}\n\n.nav-mob-content {\n  background: #eee;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  bottom: 0;\n  left: 0;\n  padding: 20px 0;\n  position: absolute;\n  right: 0;\n  top: 50px;\n}\n\n.nav-mob ul,\n.nav-mob-subscribe,\n.nav-mob-follow {\n  border-bottom: solid 1px #DDD;\n  padding: 0 0.9375rem 20px 0.9375rem;\n  margin-bottom: 15px;\n}\n\n/* Navigation Mobile follow\r\n========================================================================== */\n\n.nav-mob-follow a {\n  font-size: 20px !important;\n  margin: 0 2px !important;\n  padding: 0;\n}\n\n.nav-mob-follow .i-facebook {\n  color: #fff;\n}\n\n.nav-mob-follow .i-twitter {\n  color: #fff;\n}\n\n.nav-mob-follow .i-google {\n  color: #fff;\n}\n\n.nav-mob-follow .i-instagram {\n  color: #fff;\n}\n\n.nav-mob-follow .i-youtube {\n  color: #fff;\n}\n\n.nav-mob-follow .i-github {\n  color: #fff;\n}\n\n.nav-mob-follow .i-linkedin {\n  color: #fff;\n}\n\n.nav-mob-follow .i-spotify {\n  color: #fff;\n}\n\n.nav-mob-follow .i-codepen {\n  color: #fff;\n}\n\n.nav-mob-follow .i-behance {\n  color: #fff;\n}\n\n.nav-mob-follow .i-dribbble {\n  color: #fff;\n}\n\n.nav-mob-follow .i-flickr {\n  color: #fff;\n}\n\n.nav-mob-follow .i-reddit {\n  color: #fff;\n}\n\n.nav-mob-follow .i-pocket {\n  color: #fff;\n}\n\n.nav-mob-follow .i-pinterest {\n  color: #fff;\n}\n\n.nav-mob-follow .i-feed {\n  color: #fff;\n}\n\n.nav-mob-follow .i-telegram {\n  color: #fff;\n}\n\n/* CopyRigh\r\n========================================================================== */\n\n.nav-mob-copyright {\n  color: #aaa;\n  font-size: 13px;\n  padding: 20px 15px 0;\n  text-align: center;\n  width: 100%;\n}\n\n.nav-mob-copyright a {\n  color: #4285f4;\n}\n\n/* subscribe\r\n========================================================================== */\n\n.nav-mob-subscribe .btn,\n.nav-mob-subscribe .nav-mob-follow a,\n.nav-mob-follow .nav-mob-subscribe a {\n  border-radius: 0;\n  text-transform: none;\n  width: 80px;\n}\n\n.nav-mob-subscribe .form-group {\n  width: calc(100% - 80px);\n}\n\n.nav-mob-subscribe input {\n  border: 0;\n  -webkit-box-shadow: none !important;\n          box-shadow: none !important;\n}\n\n/* Header Page\r\n========================================================================== */\n\n.header {\n  background: #4285f4;\n  height: 50px;\n  left: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: 999;\n}\n\n.header-wrap a {\n  color: #fff;\n}\n\n.header-logo,\n.header-follow a,\n.header-menu a {\n  height: 50px;\n}\n\n.header-follow,\n.header-search,\n.header-logo {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n}\n\n.header-logo {\n  z-index: 998;\n  font-size: 1.25rem;\n  font-weight: 500;\n  letter-spacing: 1px;\n}\n\n.header-logo img {\n  max-height: 35px;\n  position: relative;\n}\n\n.header .nav-mob-toggle,\n.header .search-mob-toggle {\n  padding: 0;\n  z-index: 998;\n}\n\n.header .nav-mob-toggle {\n  margin-left: 0 !important;\n  margin-right: -0.9375rem;\n  position: relative;\n  -webkit-transition: -webkit-transform .4s;\n  transition: -webkit-transform .4s;\n  -o-transition: -o-transform .4s;\n  transition: transform .4s;\n  transition: transform .4s, -webkit-transform .4s, -o-transform .4s;\n}\n\n.header .nav-mob-toggle span {\n  background-color: #fff;\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  -webkit-transition: .4s;\n  -o-transition: .4s;\n  transition: .4s;\n  width: 20px;\n}\n\n.header .nav-mob-toggle span:first-child {\n  -webkit-transform: translate(0, -6px);\n       -o-transform: translate(0, -6px);\n          transform: translate(0, -6px);\n}\n\n.header .nav-mob-toggle span:last-child {\n  -webkit-transform: translate(0, 6px);\n       -o-transform: translate(0, 6px);\n          transform: translate(0, 6px);\n}\n\n.header:not(.toolbar-shadow) {\n  background-color: transparent !important;\n}\n\n/* Header Navigation\r\n========================================================================== */\n\n.header-menu {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 0px;\n          flex: 1 1 0;\n  overflow: hidden;\n  -webkit-transition: margin .2s,width .2s,-webkit-box-flex .2s;\n  transition: margin .2s,width .2s,-webkit-box-flex .2s;\n  -o-transition: flex .2s,margin .2s,width .2s;\n  transition: flex .2s,margin .2s,width .2s;\n  transition: flex .2s,margin .2s,width .2s,-webkit-box-flex .2s,-ms-flex .2s;\n}\n\n.header-menu ul {\n  margin-left: 2rem;\n  white-space: nowrap;\n}\n\n.header-menu ul li {\n  padding-right: 15px;\n  display: inline-block;\n}\n\n.header-menu ul a {\n  padding: 0 8px;\n  position: relative;\n}\n\n.header-menu ul a:before {\n  background: #fff;\n  bottom: 0;\n  content: '';\n  height: 2px;\n  left: 0;\n  opacity: 0;\n  position: absolute;\n  -webkit-transition: opacity .2s;\n  -o-transition: opacity .2s;\n  transition: opacity .2s;\n  width: 100%;\n}\n\n.header-menu ul a:hover:before,\n.header-menu ul a.active:before {\n  opacity: 1;\n}\n\n/* header social\r\n========================================================================== */\n\n.header-follow a {\n  padding: 0 10px;\n}\n\n.header-follow a:hover {\n  color: rgba(255, 255, 255, 0.8);\n}\n\n.header-follow a:before {\n  font-size: 1.25rem !important;\n}\n\n/* Header search\r\n========================================================================== */\n\n.header-search {\n  background: #eee;\n  border-radius: 2px;\n  display: none;\n  height: 36px;\n  position: relative;\n  text-align: left;\n  -webkit-transition: background .2s,-webkit-box-flex .2s;\n  transition: background .2s,-webkit-box-flex .2s;\n  -o-transition: background .2s,flex .2s;\n  transition: background .2s,flex .2s;\n  transition: background .2s,flex .2s,-webkit-box-flex .2s,-ms-flex .2s;\n  vertical-align: top;\n  margin-left: 1.5rem;\n  margin-right: 1.5rem;\n}\n\n.header-search .search-icon {\n  color: #757575;\n  font-size: 24px;\n  left: 24px;\n  position: absolute;\n  top: 12px;\n  -webkit-transition: color .2s;\n  -o-transition: color .2s;\n  transition: color .2s;\n}\n\ninput.search-field {\n  background: 0;\n  border: 0;\n  color: #212121;\n  height: 36px;\n  padding: 0 8px 0 72px;\n  -webkit-transition: color .2s;\n  -o-transition: color .2s;\n  transition: color .2s;\n  width: 100%;\n}\n\ninput.search-field:focus {\n  border: 0;\n  outline: none;\n}\n\n.search-popout {\n  background: #fff;\n  -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24), inset 0 4px 6px -4px rgba(0, 0, 0, 0.24);\n          box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24), inset 0 4px 6px -4px rgba(0, 0, 0, 0.24);\n  margin-top: 10px;\n  max-height: calc(100vh - 150px);\n  margin-left: -64px;\n  overflow-y: auto;\n  position: absolute;\n  z-index: -1;\n}\n\n.search-popout.closed {\n  visibility: hidden;\n}\n\n.search-suggest-results {\n  padding: 0 8px 0 75px;\n}\n\n.search-suggest-results a {\n  color: #212121;\n  display: block;\n  margin-left: -8px;\n  outline: 0;\n  height: auto;\n  padding: 8px;\n  -webkit-transition: background .2s;\n  -o-transition: background .2s;\n  transition: background .2s;\n  font-size: 0.875rem;\n}\n\n.search-suggest-results a:first-child {\n  margin-top: 10px;\n}\n\n.search-suggest-results a:last-child {\n  margin-bottom: 10px;\n}\n\n.search-suggest-results a:hover {\n  background: #f7f7f7;\n}\n\n/* mediaquery medium\r\n========================================================================== */\n\n@media only screen and (min-width: 992px) {\n  .header-search {\n    background: rgba(255, 255, 255, 0.25);\n    -webkit-box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.12);\n            box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.12);\n    color: #fff;\n    display: inline-block;\n    width: 200px;\n  }\n\n  .header-search:hover {\n    background: rgba(255, 255, 255, 0.4);\n  }\n\n  .header-search .search-icon {\n    top: 0px;\n  }\n\n  .header-search input,\n  .header-search input::-webkit-input-placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .header-search input,\n  .header-search input:-ms-input-placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .header-search input,\n  .header-search input::-ms-input-placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .header-search input,\n  .header-search input::placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .search-popout {\n    width: 100%;\n    margin-left: 0;\n  }\n\n  .header.is-showSearch .header-search {\n    background: #fff;\n    -webkit-box-flex: 1;\n        -ms-flex: 1 0 auto;\n            flex: 1 0 auto;\n  }\n\n  .header.is-showSearch .header-search .search-icon {\n    color: #757575 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input::-webkit-input-placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input:-ms-input-placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input::-ms-input-placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input::placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-menu {\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto;\n    margin: 0;\n    visibility: hidden;\n    width: 0;\n  }\n}\n\n/* Media Query\r\n========================================================================== */\n\n@media only screen and (max-width: 992px) {\n  .header-menu ul {\n    display: none;\n  }\n\n  .header.is-showSearchMob {\n    padding: 0;\n  }\n\n  .header.is-showSearchMob .header-logo,\n  .header.is-showSearchMob .nav-mob-toggle {\n    display: none;\n  }\n\n  .header.is-showSearchMob .header-search {\n    border-radius: 0;\n    display: inline-block !important;\n    height: 50px;\n    margin: 0;\n    width: 100%;\n  }\n\n  .header.is-showSearchMob .header-search input {\n    height: 50px;\n    padding-right: 48px;\n  }\n\n  .header.is-showSearchMob .header-search .search-popout {\n    margin-top: 0;\n  }\n\n  .header.is-showSearchMob .search-mob-toggle {\n    border: 0;\n    color: #757575;\n    position: absolute;\n    right: 0;\n  }\n\n  .header.is-showSearchMob .search-mob-toggle:before {\n    content: \"\\E5CD\" !important;\n  }\n\n  body.is-showNavMob {\n    overflow: hidden;\n  }\n\n  body.is-showNavMob .nav-mob {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle {\n    border: 0;\n    -webkit-transform: rotate(90deg);\n         -o-transform: rotate(90deg);\n            transform: rotate(90deg);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:first-child {\n    -webkit-transform: rotate(45deg) translate(0, 0);\n         -o-transform: rotate(45deg) translate(0, 0);\n            transform: rotate(45deg) translate(0, 0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:nth-child(2) {\n    -webkit-transform: scaleX(0);\n         -o-transform: scaleX(0);\n            transform: scaleX(0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:last-child {\n    -webkit-transform: rotate(-45deg) translate(0, 0);\n         -o-transform: rotate(-45deg) translate(0, 0);\n            transform: rotate(-45deg) translate(0, 0);\n  }\n\n  body.is-showNavMob .search-mob-toggle {\n    display: none;\n  }\n\n  body.is-showNavMob .main,\n  body.is-showNavMob .footer {\n    -webkit-transform: translateX(-25%);\n         -o-transform: translateX(-25%);\n            transform: translateX(-25%);\n  }\n}\n\n.cover {\n  background: #4285f4;\n  -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n          box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n  color: #fff;\n  letter-spacing: .2px;\n  min-height: 550px;\n  position: relative;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n  z-index: 2;\n}\n\n.cover-wrap {\n  margin: 0 auto;\n  max-width: 1050px;\n  padding: 16px;\n  position: relative;\n  text-align: center;\n  z-index: 99;\n}\n\n.cover-title {\n  font-size: 3.5rem;\n  margin: 0 0 50px;\n  line-height: 1;\n  font-weight: 700;\n}\n\n.cover-description {\n  max-width: 600px;\n}\n\n.cover-background {\n  background-attachment: fixed;\n}\n\n.cover .mouse {\n  width: 25px;\n  position: absolute;\n  height: 36px;\n  border-radius: 15px;\n  border: 2px solid #888;\n  border: 2px solid rgba(255, 255, 255, 0.27);\n  bottom: 40px;\n  right: 40px;\n  margin-left: -12px;\n  cursor: pointer;\n  -webkit-transition: border-color 0.2s ease-in;\n  -o-transition: border-color 0.2s ease-in;\n  transition: border-color 0.2s ease-in;\n}\n\n.cover .mouse .scroll {\n  display: block;\n  margin: 6px auto;\n  width: 3px;\n  height: 6px;\n  border-radius: 4px;\n  background: rgba(255, 255, 255, 0.68);\n  -webkit-animation-duration: 2s;\n       -o-animation-duration: 2s;\n          animation-duration: 2s;\n  -webkit-animation-name: scroll;\n       -o-animation-name: scroll;\n          animation-name: scroll;\n  -webkit-animation-iteration-count: infinite;\n       -o-animation-iteration-count: infinite;\n          animation-iteration-count: infinite;\n}\n\n.author a {\n  color: #FFF !important;\n}\n\n.author-header {\n  margin-top: 10%;\n}\n\n.author-name-wrap {\n  display: inline-block;\n}\n\n.author-title {\n  display: block;\n  text-transform: uppercase;\n}\n\n.author-name {\n  margin: 5px 0;\n  font-size: 1.75rem;\n}\n\n.author-bio {\n  margin: 1.5rem 0;\n  line-height: 1.8;\n  font-size: 18px;\n  max-width: 700px;\n}\n\n.author-avatar {\n  display: inline-block;\n  border-radius: 90px;\n  margin-right: 10px;\n  width: 80px;\n  height: 80px;\n  background-size: cover;\n  background-position: center;\n  vertical-align: bottom;\n}\n\n.author-meta {\n  margin-bottom: 20px;\n}\n\n.author-meta span {\n  display: inline-block;\n  font-size: 17px;\n  font-style: italic;\n  margin: 0 2rem 1rem 0;\n  opacity: 0.8;\n  word-wrap: break-word;\n}\n\n.author .author-link:hover {\n  opacity: 1;\n}\n\n.author-follow a {\n  border-radius: 3px;\n  -webkit-box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  cursor: pointer;\n  display: inline-block;\n  height: 40px;\n  letter-spacing: 1px;\n  line-height: 40px;\n  margin: 0 10px;\n  padding: 0 16px;\n  text-shadow: none;\n  text-transform: uppercase;\n}\n\n.author-follow a:hover {\n  -webkit-box-shadow: inset 0 0 0 2px #fff;\n          box-shadow: inset 0 0 0 2px #fff;\n}\n\n.home-down {\n  -webkit-animation-duration: 1.2s !important;\n       -o-animation-duration: 1.2s !important;\n          animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100;\n}\n\n@media only screen and (min-width: 766px) {\n  .cover-description {\n    font-size: 1.25rem;\n  }\n}\n\n@media only screen and (max-width: 766px) {\n  .cover {\n    padding-top: 50px;\n    padding-bottom: 20px;\n  }\n\n  .cover-title {\n    font-size: 2rem;\n  }\n\n  .author-avatar {\n    display: block;\n    margin: 0 auto 10px auto;\n  }\n}\n\n.feed-entry-content .feed-entry-wrapper:last-child .entry:last-child {\n  padding: 0;\n  border: none;\n}\n\n.entry {\n  margin-bottom: 1.5rem;\n  padding: 0 15px 15px;\n}\n\n.entry-image--link {\n  height: 180px;\n  margin: 0 -15px;\n  overflow: hidden;\n}\n\n.entry-image--link:hover .entry-image--bg {\n  -webkit-transform: scale(1.03);\n       -o-transform: scale(1.03);\n          transform: scale(1.03);\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n}\n\n.entry-image--bg {\n  -webkit-transition: -webkit-transform 0.3s;\n  transition: -webkit-transform 0.3s;\n  -o-transition: -o-transform 0.3s;\n  transition: transform 0.3s;\n  transition: transform 0.3s, -webkit-transform 0.3s, -o-transform 0.3s;\n}\n\n.entry-video-play {\n  border-radius: 50%;\n  border: 2px solid #fff;\n  color: #fff;\n  font-size: 3.5rem;\n  height: 65px;\n  left: 50%;\n  line-height: 65px;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n       -o-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  width: 65px;\n  z-index: 10;\n}\n\n.entry-category {\n  margin-bottom: 5px;\n  text-transform: capitalize;\n  font-size: 0.875rem;\n  line-height: 1;\n}\n\n.entry-category a:active {\n  text-decoration: underline;\n}\n\n.entry-title {\n  color: #000;\n  font-size: 1.25rem;\n  height: auto;\n  line-height: 1.2;\n  margin: 0 0 .5rem;\n  padding: 0;\n}\n\n.entry-title:hover {\n  color: #777;\n}\n\n.entry-byline {\n  margin-top: 0;\n  margin-bottom: 0.5rem;\n  color: #999;\n  font-size: 0.8125rem;\n}\n\n.entry-byline a {\n  color: inherit;\n}\n\n.entry-byline a:hover {\n  color: #333;\n}\n\n.entry-body {\n  padding-top: 20px;\n}\n\n/* Entry small --small\r\n========================================================================== */\n\n.entry.entry--small {\n  margin-bottom: 24px;\n  padding: 0;\n}\n\n.entry.entry--small .entry-image {\n  margin-bottom: 10px;\n}\n\n.entry.entry--small .entry-image--link {\n  height: 170px;\n  margin: 0;\n}\n\n.entry.entry--small .entry-title {\n  font-size: 1rem;\n  font-weight: 500;\n  line-height: 1.2;\n  text-transform: capitalize;\n}\n\n.entry.entry--small .entry-byline {\n  margin: 0;\n}\n\n@media only screen and (min-width: 992px) {\n  .entry {\n    margin-bottom: 40px;\n    padding: 0;\n  }\n\n  .entry-title {\n    font-size: 21px;\n  }\n\n  .entry-body {\n    padding-right: 35px !important;\n  }\n\n  .entry-image {\n    margin-bottom: 0;\n  }\n\n  .entry-image--link {\n    height: 180px;\n    margin: 0;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  .entry-image--link {\n    height: 218px;\n  }\n}\n\n.footer {\n  color: rgba(0, 0, 0, 0.44);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1;\n  padding: 1.6rem 15px;\n  text-align: center;\n}\n\n.footer a {\n  color: rgba(0, 0, 0, 0.6);\n}\n\n.footer a:hover {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n.footer-wrap {\n  margin: 0 auto;\n  max-width: 1400px;\n}\n\n.footer .heart {\n  -webkit-animation: heartify .5s infinite alternate;\n       -o-animation: heartify .5s infinite alternate;\n          animation: heartify .5s infinite alternate;\n  color: red;\n}\n\n.footer-copy,\n.footer-design-author {\n  display: inline-block;\n  padding: .5rem 0;\n  vertical-align: middle;\n}\n\n.footer-follow {\n  padding: 20px 0;\n}\n\n.footer-follow a {\n  font-size: 20px;\n  margin: 0 5px;\n  color: rgba(0, 0, 0, 0.8);\n}\n\n@-webkit-keyframes heartify {\n  0% {\n    -webkit-transform: scale(0.8);\n            transform: scale(0.8);\n  }\n}\n\n@-o-keyframes heartify {\n  0% {\n    -o-transform: scale(0.8);\n       transform: scale(0.8);\n  }\n}\n\n@keyframes heartify {\n  0% {\n    -webkit-transform: scale(0.8);\n         -o-transform: scale(0.8);\n            transform: scale(0.8);\n  }\n}\n\n.btn,\n.nav-mob-follow a {\n  background-color: #fff;\n  border-radius: 2px;\n  border: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #039be5;\n  cursor: pointer;\n  display: inline-block;\n  font: 500 14px/20px \"Roboto\", sans-serif;\n  height: 36px;\n  margin: 0;\n  min-width: 36px;\n  outline: 0;\n  overflow: hidden;\n  padding: 8px;\n  text-align: center;\n  text-decoration: none;\n  text-overflow: ellipsis;\n  text-transform: uppercase;\n  -webkit-transition: background-color .2s,-webkit-box-shadow .2s;\n  transition: background-color .2s,-webkit-box-shadow .2s;\n  -o-transition: background-color .2s,box-shadow .2s;\n  transition: background-color .2s,box-shadow .2s;\n  transition: background-color .2s,box-shadow .2s,-webkit-box-shadow .2s;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n.btn + .btn,\n.nav-mob-follow a + .btn,\n.nav-mob-follow .btn + a,\n.nav-mob-follow a + a {\n  margin-left: 8px;\n}\n\n.btn:focus,\n.nav-mob-follow a:focus,\n.btn:hover,\n.nav-mob-follow a:hover {\n  background-color: #e1f3fc;\n  text-decoration: none !important;\n}\n\n.btn:active,\n.nav-mob-follow a:active {\n  background-color: #c3e7f9;\n}\n\n.btn.btn-lg,\n.nav-mob-follow a.btn-lg {\n  font-size: 1.5rem;\n  min-width: 48px;\n  height: 48px;\n  line-height: 48px;\n}\n\n.btn.btn-flat,\n.nav-mob-follow a.btn-flat {\n  background: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.btn.btn-flat:focus,\n.nav-mob-follow a.btn-flat:focus,\n.btn.btn-flat:hover,\n.nav-mob-follow a.btn-flat:hover,\n.btn.btn-flat:active,\n.nav-mob-follow a.btn-flat:active {\n  background: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.btn.btn-primary,\n.nav-mob-follow a.btn-primary {\n  background-color: #4285f4;\n  color: #fff;\n}\n\n.btn.btn-primary:hover,\n.nav-mob-follow a.btn-primary:hover {\n  background-color: #2f79f3;\n}\n\n.btn.btn-circle,\n.nav-mob-follow a.btn-circle {\n  border-radius: 50%;\n  height: 40px;\n  line-height: 40px;\n  padding: 0;\n  width: 40px;\n}\n\n.btn.btn-circle-small,\n.nav-mob-follow a.btn-circle-small {\n  border-radius: 50%;\n  height: 32px;\n  line-height: 32px;\n  padding: 0;\n  width: 32px;\n  min-width: 32px;\n}\n\n.btn.btn-shadow,\n.nav-mob-follow a.btn-shadow {\n  -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);\n          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);\n  color: #333;\n  background-color: #eee;\n}\n\n.btn.btn-shadow:hover,\n.nav-mob-follow a.btn-shadow:hover {\n  background-color: rgba(0, 0, 0, 0.12);\n}\n\n.btn.btn-download-cloud,\n.nav-mob-follow a.btn-download-cloud,\n.btn.btn-download,\n.nav-mob-follow a.btn-download {\n  background-color: #4285f4;\n  color: #fff;\n}\n\n.btn.btn-download-cloud:hover,\n.nav-mob-follow a.btn-download-cloud:hover,\n.btn.btn-download:hover,\n.nav-mob-follow a.btn-download:hover {\n  background-color: #1b6cf2;\n}\n\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after,\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  margin-left: 5px;\n  font-size: 1.1rem;\n  display: inline-block;\n  vertical-align: top;\n}\n\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  content: \"\\E900\";\n}\n\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after {\n  content: \"\\E2C0\";\n}\n\n.btn.external:after,\n.nav-mob-follow a.external:after {\n  font-size: 1rem;\n}\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n}\n\n.form-control {\n  width: 100%;\n  padding: 8px 12px;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 0px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  -webkit-transition: border-color ease-in-out 0.15s,-webkit-box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s,-webkit-box-shadow ease-in-out 0.15s;\n  -o-transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s,-webkit-box-shadow ease-in-out 0.15s;\n  height: 36px;\n}\n\n.form-control:focus {\n  border-color: #4285f4;\n  outline: 0;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(66, 133, 244, 0.6);\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(66, 133, 244, 0.6);\n}\n\n.btn-subscribe-home {\n  background-color: transparent;\n  border-radius: 3px;\n  -webkit-box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #ffffff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  max-width: 300px;\n  padding: 15px 10px;\n  -webkit-transition: all 0.3s;\n  -o-transition: all 0.3s;\n  transition: all 0.3s;\n  width: 100%;\n}\n\n.btn-subscribe-home:hover {\n  -webkit-box-shadow: inset 0 0 0 2px #fff;\n          box-shadow: inset 0 0 0 2px #fff;\n}\n\n/*  Post\n========================================================================== */\n\n.post-wrapper {\n  margin-top: 50px;\n  padding-top: 1.8rem;\n}\n\n.post-header {\n  margin-bottom: 1.2rem;\n}\n\n.post-title {\n  color: #000;\n  font-size: 2.5rem;\n  height: auto;\n  line-height: 1.04;\n  margin: 0 0 0.9375rem;\n  letter-spacing: -.028em !important;\n  padding: 0;\n}\n\n.post-excerpt {\n  line-height: 1.3em;\n  font-size: 20px;\n  color: #7D7D7D;\n  margin-bottom: 8px;\n}\n\n.post-image {\n  margin-bottom: 30px;\n  overflow: hidden;\n}\n\n.post-body {\n  margin-bottom: 2rem;\n}\n\n.post-body a:focus {\n  text-decoration: underline;\n}\n\n.post-body h2 {\n  font-weight: 500;\n  margin: 2.50rem 0 1.25rem;\n  padding-bottom: 3px;\n}\n\n.post-body h3,\n.post-body h4 {\n  margin: 32px 0 16px;\n}\n\n.post-body iframe {\n  display: block !important;\n  margin: 0 auto 1.5rem 0 !important;\n}\n\n.post-body img {\n  display: block;\n  margin-bottom: 1rem;\n}\n\n.post-body h2 a,\n.post-body h3 a,\n.post-body h4 a {\n  color: #4285f4;\n}\n\n.post-tags {\n  margin: 1.25rem 0;\n}\n\n.post-card {\n  padding: 15px;\n}\n\n/* Post author by line top (author - time - tag - sahre)\n========================================================================== */\n\n.post-byline {\n  color: #999;\n  font-size: 14px;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  letter-spacing: -.028em !important;\n}\n\n.post-byline a {\n  color: inherit;\n}\n\n.post-byline a:active {\n  text-decoration: underline;\n}\n\n.post-byline a:hover {\n  color: #222;\n}\n\n.post-actions--top .share {\n  margin-right: 10px;\n  font-size: 20px;\n}\n\n.post-actions--top .share:hover {\n  opacity: .7;\n}\n\n.post-action-comments {\n  color: #999;\n  margin-right: 15px;\n  font-size: 14px;\n}\n\n/* Post Action social media\n========================================================================== */\n\n.post-actions {\n  position: relative;\n  margin-bottom: 1.5rem;\n}\n\n.post-actions a {\n  color: #fff;\n  font-size: 1.125rem;\n}\n\n.post-actions a:hover {\n  background-color: #000 !important;\n}\n\n.post-actions li {\n  margin-left: 6px;\n}\n\n.post-actions li:first-child {\n  margin-left: 0 !important;\n}\n\n.post-actions .btn,\n.post-actions .nav-mob-follow a,\n.nav-mob-follow .post-actions a {\n  border-radius: 0;\n}\n\n/* Post author widget bottom\n========================================================================== */\n\n.post-author {\n  position: relative;\n  font-size: 15px;\n  padding: 30px 0 30px 100px;\n  margin-bottom: 3rem;\n  background-color: #f3f5f6;\n}\n\n.post-author h5 {\n  color: #AAA;\n  font-size: 12px;\n  line-height: 1.5;\n  margin: 0;\n  font-weight: 500;\n}\n\n.post-author li {\n  margin-left: 30px;\n  font-size: 14px;\n}\n\n.post-author li a {\n  color: #555;\n}\n\n.post-author li a:hover {\n  color: #000;\n}\n\n.post-author li:first-child {\n  margin-left: 0;\n}\n\n.post-author .post-author-avatar {\n  height: 64px;\n  width: 64px;\n  position: absolute;\n  left: 20px;\n  top: 30px;\n  background-position: center center;\n  background-size: cover;\n  border-radius: 50%;\n}\n\n/* bottom share and bottom subscribe\n========================================================================== */\n\n.share-subscribe {\n  margin-bottom: 1rem;\n}\n\n.share-subscribe p {\n  color: #7d7d7d;\n  margin-bottom: 1rem;\n  line-height: 1;\n  font-size: 0.875rem;\n}\n\n.share-subscribe .social-share {\n  float: none !important;\n}\n\n.share-subscribe > div {\n  position: relative;\n  overflow: hidden;\n  margin-bottom: 15px;\n}\n\n.share-subscribe > div:before {\n  content: \" \";\n  border-top: solid 1px #000;\n  position: absolute;\n  top: 0;\n  left: 15px;\n  width: 40px;\n  height: 1px;\n}\n\n.share-subscribe > div h5 {\n  font-size: 0.875rem;\n  margin: 1rem 0;\n  line-height: 1;\n  text-transform: uppercase;\n  font-weight: 500;\n}\n\n.share-subscribe .newsletter-form {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.share-subscribe .newsletter-form .form-group {\n  max-width: 250px;\n  width: 100%;\n}\n\n.share-subscribe .newsletter-form .btn,\n.share-subscribe .newsletter-form .nav-mob-follow a,\n.nav-mob-follow .share-subscribe .newsletter-form a {\n  border-radius: 0;\n}\n\n/* Related post\n========================================================================== */\n\n.post-related {\n  margin-top: 40px;\n}\n\n.post-related-title {\n  color: #000;\n  font-size: 18px;\n  font-weight: 500;\n  height: auto;\n  line-height: 17px;\n  margin: 0 0 20px;\n  padding-bottom: 10px;\n  text-transform: uppercase;\n}\n\n.post-related-list {\n  margin-bottom: 18px;\n  padding: 0;\n  border: none;\n}\n\n/* Media Query (medium)\n========================================================================== */\n\n@media only screen and (min-width: 766px) {\n  .post .title {\n    font-size: 2.25rem;\n    margin: 0 0 1rem;\n  }\n\n  .post-body {\n    font-size: 1.125rem;\n    line-height: 32px;\n  }\n\n  .post-body p {\n    margin-bottom: 1.5rem;\n  }\n\n  .post-card {\n    padding: 30px;\n  }\n}\n\n@media only screen and (max-width: 640px) {\n  .post-title {\n    font-size: 1.8rem;\n  }\n\n  .post-image,\n  .video-responsive {\n    margin-left: -0.9375rem;\n    margin-right: -0.9375rem;\n  }\n}\n\n/* sidebar\r\n========================================================================== */\n\n.sidebar {\n  position: relative;\n  line-height: 1.6;\n}\n\n.sidebar h1,\n.sidebar h2,\n.sidebar h3,\n.sidebar h4,\n.sidebar h5,\n.sidebar h6 {\n  margin-top: 0;\n  color: #000;\n}\n\n.sidebar-items {\n  margin-bottom: 2.5rem;\n  padding: 25px;\n  position: relative;\n}\n\n.sidebar-title {\n  padding-bottom: 10px;\n  margin-bottom: 1rem;\n  text-transform: uppercase;\n  font-size: 1rem;\n}\n\n.sidebar .title-primary {\n  background-color: #4285f4;\n  color: #FFF;\n  padding: 10px 16px;\n  font-size: 18px;\n}\n\n.sidebar-post--border {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border-left: 3px solid #4285f4;\n  bottom: 0;\n  color: rgba(0, 0, 0, 0.2);\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  font-size: 28px;\n  font-weight: bold;\n  left: 0;\n  line-height: 1;\n  padding: 15px 10px 10px;\n  position: absolute;\n  top: 0;\n}\n\n.sidebar-post:nth-child(3n) .sidebar-post--border {\n  border-color: #f59e00;\n}\n\n.sidebar-post:nth-child(3n+2) .sidebar-post--border {\n  border-color: #00a034;\n}\n\n.sidebar-post--link {\n  display: block;\n  min-height: 50px;\n  padding: 10px 15px 10px 55px;\n  position: relative;\n}\n\n.sidebar-post--link:hover .sidebar-post--border {\n  background-color: #e5eff5;\n}\n\n.sidebar-post--title {\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 16px;\n  font-weight: 500;\n  margin: 0;\n}\n\n.subscribe {\n  min-height: 90vh;\n  padding-top: 50px;\n}\n\n.subscribe h3 {\n  margin: 0;\n  margin-bottom: 8px;\n  font: 400 20px/32px \"Roboto\", sans-serif;\n}\n\n.subscribe-title {\n  font-weight: 400;\n  margin-top: 0;\n}\n\n.subscribe-wrap {\n  max-width: 700px;\n  color: #7d878a;\n  padding: 1rem 0;\n}\n\n.subscribe .form-group {\n  margin-bottom: 1.5rem;\n}\n\n.subscribe .form-group.error input {\n  border-color: #ff5b5b;\n}\n\n.subscribe .btn,\n.subscribe .nav-mob-follow a,\n.nav-mob-follow .subscribe a {\n  width: 100%;\n}\n\n.subscribe-form {\n  position: relative;\n  margin: 30px auto;\n  padding: 40px;\n  max-width: 400px;\n  width: 100%;\n  background: #ebeff2;\n  border-radius: 5px;\n  text-align: left;\n}\n\n.subscribe-input {\n  width: 100%;\n  padding: 10px;\n  border: #4285f4  1px solid;\n  border-radius: 2px;\n}\n\n.subscribe-input:focus {\n  outline: none;\n}\n\n.animated {\n  -webkit-animation-duration: 1s;\n       -o-animation-duration: 1s;\n          animation-duration: 1s;\n  -webkit-animation-fill-mode: both;\n       -o-animation-fill-mode: both;\n          animation-fill-mode: both;\n}\n\n.animated.infinite {\n  -webkit-animation-iteration-count: infinite;\n       -o-animation-iteration-count: infinite;\n          animation-iteration-count: infinite;\n}\n\n.bounceIn {\n  -webkit-animation-name: bounceIn;\n       -o-animation-name: bounceIn;\n          animation-name: bounceIn;\n}\n\n.bounceInDown {\n  -webkit-animation-name: bounceInDown;\n       -o-animation-name: bounceInDown;\n          animation-name: bounceInDown;\n}\n\n.slideInUp {\n  -webkit-animation-name: slideInUp;\n       -o-animation-name: slideInUp;\n          animation-name: slideInUp;\n}\n\n.slideOutDown {\n  -webkit-animation-name: slideOutDown;\n       -o-animation-name: slideOutDown;\n          animation-name: slideOutDown;\n}\n\n@-webkit-keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n            transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n            transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n            transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n            transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n            transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-o-keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n       animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n         -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n            transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n            transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n            transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n            transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n            transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-webkit-keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n            transform: none;\n  }\n}\n\n@-o-keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n       animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -o-transform: none;\n       transform: none;\n  }\n}\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n         -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n         -o-transform: none;\n            transform: none;\n  }\n}\n\n@-webkit-keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.05, 1.05, 1.05);\n            transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-o-keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.05, 1.05, 1.05);\n            transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-webkit-keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -webkit-transform: translateY(0px);\n            transform: translateY(0px);\n  }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translateY(10px);\n            transform: translateY(10px);\n  }\n}\n\n@-o-keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -o-transform: translateY(0px);\n       transform: translateY(0px);\n  }\n\n  100% {\n    opacity: 0;\n    -o-transform: translateY(10px);\n       transform: translateY(10px);\n  }\n}\n\n@keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -webkit-transform: translateY(0px);\n         -o-transform: translateY(0px);\n            transform: translateY(0px);\n  }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translateY(10px);\n         -o-transform: translateY(10px);\n            transform: translateY(10px);\n  }\n}\n\n@-webkit-keyframes spin {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@-o-keyframes spin {\n  from {\n    -o-transform: rotate(0deg);\n       transform: rotate(0deg);\n  }\n\n  to {\n    -o-transform: rotate(360deg);\n       transform: rotate(360deg);\n  }\n}\n\n@keyframes spin {\n  from {\n    -webkit-transform: rotate(0deg);\n         -o-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n         -o-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@-webkit-keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n            transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n}\n\n@-o-keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n            transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n}\n\n@-webkit-keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 20%, 0);\n            transform: translate3d(0, 20%, 0);\n  }\n}\n\n@-o-keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0);\n  }\n}\n\n@keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 20%, 0);\n            transform: translate3d(0, 20%, 0);\n  }\n}\n\n", "", {"version":3,"sources":["C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/main.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/main.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_icon.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_variables.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_header.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_utilities.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_global.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/components/_grid.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/common/_typography.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_menu.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_cover.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_entry.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_footer.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/components/_buttons.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_post.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_sidebar.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_subscribe.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/components/_animated.scss"],"names":[],"mappings":"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","file":"main.scss","sourcesContent":["@charset \"UTF-8\";\n@import url(~normalize.css/normalize.css);\n@import url(~prismjs/themes/prism.css);\npre.line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber; }\n\npre.line-numbers > code {\n  position: relative;\n  white-space: inherit; }\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber; }\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right; }\n\n@font-face {\n  font-family: 'mapache';\n  src: url(\"../fonts/mapache.ttf?g7hms8\") format(\"truetype\"), url(\"../fonts/mapache.woff?g7hms8\") format(\"woff\"), url(\"../fonts/mapache.svg?g7hms8#mapache\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal; }\n\n[class^=\"i-\"]:before, [class*=\" i-\"]:before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.i-navigate_before:before {\n  content: \"\\e408\"; }\n\n.i-navigate_next:before {\n  content: \"\\e409\"; }\n\n.i-tag:before {\n  content: \"\\e54e\"; }\n\n.i-keyboard_arrow_down:before {\n  content: \"\\e313\"; }\n\n.i-arrow_upward:before {\n  content: \"\\e5d8\"; }\n\n.i-cloud_download:before {\n  content: \"\\e2c0\"; }\n\n.i-star:before {\n  content: \"\\e838\"; }\n\n.i-keyboard_arrow_up:before {\n  content: \"\\e316\"; }\n\n.i-open_in_new:before {\n  content: \"\\e89e\"; }\n\n.i-warning:before {\n  content: \"\\e002\"; }\n\n.i-back:before {\n  content: \"\\e5c4\"; }\n\n.i-forward:before {\n  content: \"\\e5c8\"; }\n\n.i-chat:before {\n  content: \"\\e0cb\"; }\n\n.i-close:before {\n  content: \"\\e5cd\"; }\n\n.i-code2:before {\n  content: \"\\e86f\"; }\n\n.i-favorite:before {\n  content: \"\\e87d\"; }\n\n.i-link:before {\n  content: \"\\e157\"; }\n\n.i-menu:before {\n  content: \"\\e5d2\"; }\n\n.i-feed:before {\n  content: \"\\e0e5\"; }\n\n.i-search:before {\n  content: \"\\e8b6\"; }\n\n.i-share:before {\n  content: \"\\e80d\"; }\n\n.i-check_circle:before {\n  content: \"\\e86c\"; }\n\n.i-play:before {\n  content: \"\\e901\"; }\n\n.i-download:before {\n  content: \"\\e900\"; }\n\n.i-code:before {\n  content: \"\\f121\"; }\n\n.i-behance:before {\n  content: \"\\f1b4\"; }\n\n.i-spotify:before {\n  content: \"\\f1bc\"; }\n\n.i-codepen:before {\n  content: \"\\f1cb\"; }\n\n.i-github:before {\n  content: \"\\f09b\"; }\n\n.i-linkedin:before {\n  content: \"\\f0e1\"; }\n\n.i-flickr:before {\n  content: \"\\f16e\"; }\n\n.i-dribbble:before {\n  content: \"\\f17d\"; }\n\n.i-pinterest:before {\n  content: \"\\f231\"; }\n\n.i-map:before {\n  content: \"\\f041\"; }\n\n.i-twitter:before {\n  content: \"\\f099\"; }\n\n.i-facebook:before {\n  content: \"\\f09a\"; }\n\n.i-youtube:before {\n  content: \"\\f16a\"; }\n\n.i-instagram:before {\n  content: \"\\f16d\"; }\n\n.i-google:before {\n  content: \"\\f1a0\"; }\n\n.i-pocket:before {\n  content: \"\\f265\"; }\n\n.i-reddit:before {\n  content: \"\\f281\"; }\n\n.i-snapchat:before {\n  content: \"\\f2ac\"; }\n\n.i-telegram:before {\n  content: \"\\f2c6\"; }\n\n/*\r\n@package godofredoninja\r\n\r\n========================================================================\r\nMapache variables styles\r\n========================================================================\r\n*/\n/**\r\n* Table of Contents:\r\n*\r\n*   1. Colors\r\n*   2. Fonts\r\n*   3. Typography\r\n*   4. Header\r\n*   5. Footer\r\n*   6. Code Syntax\r\n*   7. buttons\r\n*   8. container\r\n*   9. Grid\r\n*   10. Media Query Ranges\r\n*   11. Icons\r\n*/\n/* 1. Colors\r\n========================================================================== */\n/* 2. Fonts\r\n========================================================================== */\n/* 3. Typography\r\n========================================================================== */\n/* 4. Header\r\n========================================================================== */\n/* 5. Entry articles\r\n========================================================================== */\n/* 5. Footer\r\n========================================================================== */\n/* 6. Code Syntax\r\n========================================================================== */\n/* 7. buttons\r\n========================================================================== */\n/* 8. container\r\n========================================================================== */\n/* 9. Grid\r\n========================================================================== */\n/* 10. Media Query Ranges\r\n========================================================================== */\n/* 11. icons\r\n========================================================================== */\n.header.toolbar-shadow {\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28); }\n\na.external::after, hr::before, .warning:before, .note:before, .success:before, .btn.btn-download-cloud:after, .nav-mob-follow a.btn-download-cloud:after, .btn.btn-download:after, .nav-mob-follow a.btn-download:after {\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.u-clear::after {\n  clear: both;\n  content: \"\";\n  display: table; }\n\n.u-not-avatar {\n  background-image: url(\"../images/avatar.png\"); }\n\n.u-relative {\n  position: relative; }\n\n.u-block {\n  display: block; }\n\n.u-absolute0 {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0; }\n\n.u-bg-cover {\n  background-position: center;\n  background-size: cover; }\n\n.u-bg-gradient {\n  background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, 0.8))); }\n\n.u-border-bottom-dark, .sidebar-title {\n  border-bottom: solid 1px #000; }\n\n.u-b-t {\n  border-top: solid 1px #eee; }\n\n.u-p-t-2 {\n  padding-top: 2rem; }\n\n.u-unstyled {\n  list-style-type: none;\n  margin: 0;\n  padding-left: 0; }\n\n.u-floatLeft {\n  float: left !important; }\n\n.u-floatRight {\n  float: right !important; }\n\n.u-flex {\n  display: flex;\n  flex-direction: row; }\n\n.u-flex-wrap {\n  display: flex;\n  flex-wrap: wrap; }\n\n.u-flex-center, .header-logo,\n.header-follow a,\n.header-menu a {\n  display: flex;\n  align-items: center; }\n\n.u-flex-aling-right {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end; }\n\n.u-flex-aling-center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column; }\n\n.u-m-t-1 {\n  margin-top: 1rem; }\n\n/* Tags\n========================================================================== */\n.u-tags {\n  font-size: 12px !important;\n  margin: 3px !important;\n  color: #4c5765 !important;\n  background-color: #ebebeb !important;\n  transition: all .3s; }\n  .u-tags::before {\n    padding-right: 5px;\n    opacity: .8; }\n  .u-tags:hover {\n    background-color: #4285f4 !important;\n    color: #fff !important; }\n\n.u-textUppercase {\n  text-transform: uppercase; }\n\n.u-tag {\n  background-color: #4285f4;\n  color: #fff;\n  padding: 4px 12px;\n  font-size: 11px;\n  display: inline-block;\n  text-transform: uppercase; }\n\n.u-hide {\n  display: none !important; }\n\n.u-card-shadow {\n  background-color: #fff;\n  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.02); }\n\n.u-not-image {\n  background-repeat: repeat;\n  background-size: initial !important;\n  background-color: #fff; }\n\n@media only screen and (max-width: 766px) {\n  .u-h-b-md {\n    display: none !important; } }\n\n@media only screen and (max-width: 992px) {\n  .u-h-b-lg {\n    display: none !important; } }\n\n@media only screen and (min-width: 766px) {\n  .u-h-a-md {\n    display: none !important; } }\n\n@media only screen and (min-width: 992px) {\n  .u-h-a-lg {\n    display: none !important; } }\n\nhtml {\n  box-sizing: border-box;\n  font-size: 16px;\n  -webkit-tap-highlight-color: transparent; }\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box; }\n\na {\n  color: #039be5;\n  outline: 0;\n  text-decoration: none;\n  -webkit-tap-highlight-color: transparent; }\n  a:focus {\n    text-decoration: none; }\n  a.external::after {\n    content: \"\";\n    margin-left: 5px; }\n\nbody {\n  color: #333;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 0 auto;\n  background-color: #f5f5f5; }\n\nfigure {\n  margin: 0; }\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto; }\n  img:not([src]) {\n    visibility: hidden; }\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto; }\n\ni {\n  display: inline-block;\n  vertical-align: middle; }\n\nhr {\n  background: #F1F2F1;\n  background: linear-gradient(to right, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  border: none;\n  height: 1px;\n  margin: 80px auto;\n  max-width: 90%;\n  position: relative; }\n  hr::before {\n    background: #fff;\n    color: rgba(73, 55, 65, 0.75);\n    content: \"\";\n    display: block;\n    font-size: 35px;\n    left: 50%;\n    padding: 0 25px;\n    position: absolute;\n    top: 50%;\n    transform: translate(-50%, -50%); }\n\nblockquote {\n  border-left: 4px solid #4285f4;\n  padding: .75rem 1.5rem;\n  background: #fbfbfc;\n  color: #757575;\n  font-size: 1.125rem;\n  line-height: 1.7;\n  margin: 0 0 1.25rem;\n  quotes: none; }\n\nol, ul, blockquote {\n  margin-left: 2rem; }\n\nstrong {\n  font-weight: 500; }\n\nsmall, .small {\n  font-size: 85%; }\n\nol {\n  padding-left: 40px;\n  list-style: decimal outside; }\n\nmark {\n  background-color: #fdffb6; }\n\n.footer,\n.main {\n  transition: transform .5s ease;\n  z-index: 2; }\n\n/* Code Syntax\r\n========================================================================== */\nkbd, samp, code {\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  color: #c7254e;\n  background: #f7f7f7;\n  border-radius: 4px;\n  padding: 4px 6px;\n  white-space: pre-wrap; }\n\ncode[class*=language-],\npre[class*=language-] {\n  color: #37474f;\n  line-height: 1.5; }\n  code[class*=language-] .token.comment,\n  pre[class*=language-] .token.comment {\n    opacity: .8; }\n  code[class*=language-].line-numbers,\n  pre[class*=language-].line-numbers {\n    padding-left: 58px; }\n    code[class*=language-].line-numbers::before,\n    pre[class*=language-].line-numbers::before {\n      content: \"\";\n      position: absolute;\n      left: 0;\n      top: 0;\n      background: #F0EDEE;\n      width: 40px;\n      height: 100%; }\n  code[class*=language-] .line-numbers-rows,\n  pre[class*=language-] .line-numbers-rows {\n    border-right: none;\n    top: -3px;\n    left: -58px; }\n    code[class*=language-] .line-numbers-rows > span::before,\n    pre[class*=language-] .line-numbers-rows > span::before {\n      padding-right: 0;\n      text-align: center;\n      opacity: .8; }\n\npre {\n  background-color: #f7f7f7 !important;\n  padding: 1rem;\n  overflow: hidden;\n  border-radius: 4px;\n  word-wrap: normal;\n  margin: 2.5rem 0 !important;\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  position: relative; }\n  pre code {\n    color: #37474f;\n    text-shadow: 0 1px #fff;\n    padding: 0;\n    background: transparent; }\n\n/* .warning & .note & .success\r\n========================================================================== */\n.warning {\n  background: #fbe9e7;\n  color: #d50000; }\n  .warning:before {\n    content: \"\"; }\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1; }\n  .note:before {\n    content: \"\"; }\n\n.success {\n  background: #e0f2f1;\n  color: #00897b; }\n  .success:before {\n    content: \"\";\n    color: #00bfa5; }\n\n.warning, .note, .success {\n  display: block;\n  margin: 1rem 0;\n  font-size: 1rem;\n  padding: 12px 24px 12px 60px;\n  line-height: 1.5; }\n  .warning a, .note a, .success a {\n    text-decoration: underline;\n    color: inherit; }\n  .warning:before, .note:before, .success:before {\n    margin-left: -36px;\n    float: left;\n    font-size: 24px; }\n\n/* Social icon color and background\r\n========================================================================== */\n.c-facebook {\n  color: #3b5998; }\n\n.bg-facebook, .nav-mob-follow .i-facebook {\n  background-color: #3b5998 !important; }\n\n.c-twitter {\n  color: #55acee; }\n\n.bg-twitter, .nav-mob-follow .i-twitter {\n  background-color: #55acee !important; }\n\n.c-google {\n  color: #dd4b39; }\n\n.bg-google, .nav-mob-follow .i-google {\n  background-color: #dd4b39 !important; }\n\n.c-instagram {\n  color: #306088; }\n\n.bg-instagram, .nav-mob-follow .i-instagram {\n  background-color: #306088 !important; }\n\n.c-youtube {\n  color: #e52d27; }\n\n.bg-youtube, .nav-mob-follow .i-youtube {\n  background-color: #e52d27 !important; }\n\n.c-github {\n  color: #333333; }\n\n.bg-github, .nav-mob-follow .i-github {\n  background-color: #333333 !important; }\n\n.c-linkedin {\n  color: #007bb6; }\n\n.bg-linkedin, .nav-mob-follow .i-linkedin {\n  background-color: #007bb6 !important; }\n\n.c-spotify {\n  color: #2ebd59; }\n\n.bg-spotify, .nav-mob-follow .i-spotify {\n  background-color: #2ebd59 !important; }\n\n.c-codepen {\n  color: #222222; }\n\n.bg-codepen, .nav-mob-follow .i-codepen {\n  background-color: #222222 !important; }\n\n.c-behance {\n  color: #131418; }\n\n.bg-behance, .nav-mob-follow .i-behance {\n  background-color: #131418 !important; }\n\n.c-dribbble {\n  color: #ea4c89; }\n\n.bg-dribbble, .nav-mob-follow .i-dribbble {\n  background-color: #ea4c89 !important; }\n\n.c-flickr {\n  color: #0063DC; }\n\n.bg-flickr, .nav-mob-follow .i-flickr {\n  background-color: #0063DC !important; }\n\n.c-reddit {\n  color: orangered; }\n\n.bg-reddit, .nav-mob-follow .i-reddit {\n  background-color: orangered !important; }\n\n.c-pocket {\n  color: #F50057; }\n\n.bg-pocket, .nav-mob-follow .i-pocket {\n  background-color: #F50057 !important; }\n\n.c-pinterest {\n  color: #bd081c; }\n\n.bg-pinterest, .nav-mob-follow .i-pinterest {\n  background-color: #bd081c !important; }\n\n.c-feed {\n  color: orange; }\n\n.bg-feed, .nav-mob-follow .i-feed {\n  background-color: orange !important; }\n\n.c-telegram {\n  color: #08c; }\n\n.bg-telegram, .nav-mob-follow .i-telegram {\n  background-color: #08c !important; }\n\n.clear:after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n/* pagination Infinite scroll\r\n========================================================================== */\n.mapache-load-more {\n  border: solid 1px #C3C3C3;\n  color: #7D7D7D;\n  display: block;\n  font-size: 15px;\n  height: 45px;\n  margin: 4rem auto;\n  padding: 11px 16px;\n  position: relative;\n  text-align: center;\n  width: 100%; }\n  .mapache-load-more:hover {\n    background: #4285f4;\n    border-color: #4285f4;\n    color: #fff; }\n\n.pagination-nav {\n  padding: 2.5rem 0 3rem;\n  text-align: center; }\n  .pagination-nav .page-number {\n    display: none;\n    padding-top: 5px; }\n    @media only screen and (min-width: 766px) {\n      .pagination-nav .page-number {\n        display: inline-block; } }\n  .pagination-nav .newer-posts {\n    float: left; }\n  .pagination-nav .older-posts {\n    float: right; }\n\n/* Scroll Top\r\n========================================================================== */\n.scroll_top {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  z-index: 11;\n  width: 60px;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity 0.5s ease; }\n  .scroll_top.visible {\n    opacity: 1;\n    visibility: visible; }\n  .scroll_top:hover svg path {\n    fill: rgba(0, 0, 0, 0.6); }\n\n.svg-icon svg {\n  width: 100%;\n  height: auto;\n  display: block;\n  fill: currentcolor; }\n\n/* Video Responsive\r\n========================================================================== */\n.video-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n  padding-bottom: 56.25%;\n  margin-bottom: 1.5rem; }\n  .video-responsive iframe {\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    height: 100%;\n    width: 100%;\n    border: 0; }\n\n/* Video full for tag video\r\n========================================================================== */\n#video-format .video-content {\n  display: flex;\n  padding-bottom: 1rem; }\n  #video-format .video-content span {\n    display: inline-block;\n    vertical-align: middle;\n    margin-right: .8rem; }\n\n/* Page error 404\r\n========================================================================== */\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n  height: 100vh;\n  position: relative;\n  width: 100%; }\n  .errorPage-title {\n    padding: 24px 60px; }\n  .errorPage-link {\n    color: rgba(0, 0, 0, 0.54);\n    font-size: 22px;\n    font-weight: 500;\n    left: -5px;\n    position: relative;\n    text-rendering: optimizeLegibility;\n    top: -6px; }\n  .errorPage-emoji {\n    color: rgba(0, 0, 0, 0.4);\n    font-size: 150px; }\n  .errorPage-text {\n    color: rgba(0, 0, 0, 0.4);\n    line-height: 21px;\n    margin-top: 60px;\n    white-space: pre-wrap; }\n  .errorPage-wrap {\n    display: block;\n    left: 50%;\n    min-width: 680px;\n    position: absolute;\n    text-align: center;\n    top: 50%;\n    transform: translate(-50%, -50%); }\n\n/* Post Twitter facebook card embed Css Center\r\n========================================================================== */\n.post iframe[src*=\"facebook.com\"],\n.post .fb-post,\n.post .twitter-tweet {\n  display: block !important;\n  margin: 1.5rem 0 !important; }\n\n.container {\n  margin: 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n  width: 100%;\n  max-width: 1250px; }\n\n.margin-top {\n  margin-top: 50px;\n  padding-top: 1rem; }\n  @media only screen and (min-width: 766px) {\n    .margin-top {\n      padding-top: 1.8rem; } }\n\n@media only screen and (min-width: 766px) {\n  .content {\n    flex-basis: 69.66666667% !important;\n    max-width: 69.66666667% !important; }\n  .sidebar {\n    flex-basis: 30.33333333% !important;\n    max-width: 30.33333333% !important; } }\n\n@media only screen and (min-width: 1230px) {\n  .content {\n    padding-right: 40px !important; } }\n\n@media only screen and (min-width: 992px) {\n  .feed-entry-wrapper .entry-image {\n    width: 40% !important;\n    max-width: 40% !important; }\n  .feed-entry-wrapper .entry-body {\n    width: 60% !important;\n    max-width: 60% !important; } }\n\n@media only screen and (max-width: 992px) {\n  body.is-article .content {\n    max-width: 100% !important; } }\n\n.row {\n  display: flex;\n  flex: 0 1 auto;\n  flex-flow: row wrap;\n  margin-left: -0.9375rem;\n  margin-right: -0.9375rem; }\n  .row .col {\n    flex: 0 0 auto;\n    padding-left: 0.9375rem;\n    padding-right: 0.9375rem; }\n    .row .col.s1 {\n      flex-basis: 8.33333%;\n      max-width: 8.33333%; }\n    .row .col.s2 {\n      flex-basis: 16.66667%;\n      max-width: 16.66667%; }\n    .row .col.s3 {\n      flex-basis: 25%;\n      max-width: 25%; }\n    .row .col.s4 {\n      flex-basis: 33.33333%;\n      max-width: 33.33333%; }\n    .row .col.s5 {\n      flex-basis: 41.66667%;\n      max-width: 41.66667%; }\n    .row .col.s6 {\n      flex-basis: 50%;\n      max-width: 50%; }\n    .row .col.s7 {\n      flex-basis: 58.33333%;\n      max-width: 58.33333%; }\n    .row .col.s8 {\n      flex-basis: 66.66667%;\n      max-width: 66.66667%; }\n    .row .col.s9 {\n      flex-basis: 75%;\n      max-width: 75%; }\n    .row .col.s10 {\n      flex-basis: 83.33333%;\n      max-width: 83.33333%; }\n    .row .col.s11 {\n      flex-basis: 91.66667%;\n      max-width: 91.66667%; }\n    .row .col.s12 {\n      flex-basis: 100%;\n      max-width: 100%; }\n    @media only screen and (min-width: 766px) {\n      .row .col.m1 {\n        flex-basis: 8.33333%;\n        max-width: 8.33333%; }\n      .row .col.m2 {\n        flex-basis: 16.66667%;\n        max-width: 16.66667%; }\n      .row .col.m3 {\n        flex-basis: 25%;\n        max-width: 25%; }\n      .row .col.m4 {\n        flex-basis: 33.33333%;\n        max-width: 33.33333%; }\n      .row .col.m5 {\n        flex-basis: 41.66667%;\n        max-width: 41.66667%; }\n      .row .col.m6 {\n        flex-basis: 50%;\n        max-width: 50%; }\n      .row .col.m7 {\n        flex-basis: 58.33333%;\n        max-width: 58.33333%; }\n      .row .col.m8 {\n        flex-basis: 66.66667%;\n        max-width: 66.66667%; }\n      .row .col.m9 {\n        flex-basis: 75%;\n        max-width: 75%; }\n      .row .col.m10 {\n        flex-basis: 83.33333%;\n        max-width: 83.33333%; }\n      .row .col.m11 {\n        flex-basis: 91.66667%;\n        max-width: 91.66667%; }\n      .row .col.m12 {\n        flex-basis: 100%;\n        max-width: 100%; } }\n    @media only screen and (min-width: 992px) {\n      .row .col.l1 {\n        flex-basis: 8.33333%;\n        max-width: 8.33333%; }\n      .row .col.l2 {\n        flex-basis: 16.66667%;\n        max-width: 16.66667%; }\n      .row .col.l3 {\n        flex-basis: 25%;\n        max-width: 25%; }\n      .row .col.l4 {\n        flex-basis: 33.33333%;\n        max-width: 33.33333%; }\n      .row .col.l5 {\n        flex-basis: 41.66667%;\n        max-width: 41.66667%; }\n      .row .col.l6 {\n        flex-basis: 50%;\n        max-width: 50%; }\n      .row .col.l7 {\n        flex-basis: 58.33333%;\n        max-width: 58.33333%; }\n      .row .col.l8 {\n        flex-basis: 66.66667%;\n        max-width: 66.66667%; }\n      .row .col.l9 {\n        flex-basis: 75%;\n        max-width: 75%; }\n      .row .col.l10 {\n        flex-basis: 83.33333%;\n        max-width: 83.33333%; }\n      .row .col.l11 {\n        flex-basis: 91.66667%;\n        max-width: 91.66667%; }\n      .row .col.l12 {\n        flex-basis: 100%;\n        max-width: 100%; } }\n\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  margin-bottom: 0.5rem;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: 700;\n  line-height: 1.1;\n  color: inherit; }\n\nh1 {\n  font-size: 2.25rem; }\n\nh2 {\n  font-size: 1.875rem; }\n\nh3 {\n  font-size: 1.5625rem; }\n\nh4 {\n  font-size: 1.375rem; }\n\nh5 {\n  font-size: 1.125rem; }\n\nh6 {\n  font-size: 1rem; }\n\n.h1 {\n  font-size: 2.25rem; }\n\n.h2 {\n  font-size: 1.875rem; }\n\n.h3 {\n  font-size: 1.5625rem; }\n\n.h4 {\n  font-size: 1.375rem; }\n\n.h5 {\n  font-size: 1.125rem; }\n\n.h6 {\n  font-size: 1rem; }\n\nh1, h2, h3, h4, h5, h6 {\n  margin-bottom: 1rem; }\n  h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {\n    color: inherit;\n    line-height: inherit; }\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem; }\n\n/* Navigation Mobile\r\n========================================================================== */\n.nav-mob {\n  background: #4285f4;\n  color: #000;\n  height: 100vh;\n  left: 0;\n  padding: 0 20px;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  transition: .4s;\n  will-change: transform;\n  z-index: 997; }\n  .nav-mob a {\n    color: inherit; }\n  .nav-mob ul a {\n    display: block;\n    font-weight: 500;\n    padding: 8px 0;\n    text-transform: uppercase;\n    font-size: 14px; }\n  .nav-mob-content {\n    background: #eee;\n    overflow: auto;\n    -webkit-overflow-scrolling: touch;\n    bottom: 0;\n    left: 0;\n    padding: 20px 0;\n    position: absolute;\n    right: 0;\n    top: 50px; }\n\n.nav-mob ul,\n.nav-mob-subscribe,\n.nav-mob-follow {\n  border-bottom: solid 1px #DDD;\n  padding: 0 0.9375rem 20px 0.9375rem;\n  margin-bottom: 15px; }\n\n/* Navigation Mobile follow\r\n========================================================================== */\n.nav-mob-follow a {\n  font-size: 20px !important;\n  margin: 0 2px !important;\n  padding: 0; }\n\n.nav-mob-follow .i-facebook {\n  color: #fff; }\n\n.nav-mob-follow .i-twitter {\n  color: #fff; }\n\n.nav-mob-follow .i-google {\n  color: #fff; }\n\n.nav-mob-follow .i-instagram {\n  color: #fff; }\n\n.nav-mob-follow .i-youtube {\n  color: #fff; }\n\n.nav-mob-follow .i-github {\n  color: #fff; }\n\n.nav-mob-follow .i-linkedin {\n  color: #fff; }\n\n.nav-mob-follow .i-spotify {\n  color: #fff; }\n\n.nav-mob-follow .i-codepen {\n  color: #fff; }\n\n.nav-mob-follow .i-behance {\n  color: #fff; }\n\n.nav-mob-follow .i-dribbble {\n  color: #fff; }\n\n.nav-mob-follow .i-flickr {\n  color: #fff; }\n\n.nav-mob-follow .i-reddit {\n  color: #fff; }\n\n.nav-mob-follow .i-pocket {\n  color: #fff; }\n\n.nav-mob-follow .i-pinterest {\n  color: #fff; }\n\n.nav-mob-follow .i-feed {\n  color: #fff; }\n\n.nav-mob-follow .i-telegram {\n  color: #fff; }\n\n/* CopyRigh\r\n========================================================================== */\n.nav-mob-copyright {\n  color: #aaa;\n  font-size: 13px;\n  padding: 20px 15px 0;\n  text-align: center;\n  width: 100%; }\n  .nav-mob-copyright a {\n    color: #4285f4; }\n\n/* subscribe\r\n========================================================================== */\n.nav-mob-subscribe .btn, .nav-mob-subscribe .nav-mob-follow a, .nav-mob-follow .nav-mob-subscribe a {\n  border-radius: 0;\n  text-transform: none;\n  width: 80px; }\n\n.nav-mob-subscribe .form-group {\n  width: calc(100% - 80px); }\n\n.nav-mob-subscribe input {\n  border: 0;\n  box-shadow: none !important; }\n\n/* Header Page\r\n========================================================================== */\n.header {\n  background: #4285f4;\n  height: 50px;\n  left: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: 999; }\n  .header-wrap a {\n    color: #fff; }\n  .header-logo,\n  .header-follow a,\n  .header-menu a {\n    height: 50px; }\n  .header-follow, .header-search, .header-logo {\n    flex: 0 0 auto; }\n  .header-logo {\n    z-index: 998;\n    font-size: 1.25rem;\n    font-weight: 500;\n    letter-spacing: 1px; }\n    .header-logo img {\n      max-height: 35px;\n      position: relative; }\n  .header .nav-mob-toggle,\n  .header .search-mob-toggle {\n    padding: 0;\n    z-index: 998; }\n  .header .nav-mob-toggle {\n    margin-left: 0 !important;\n    margin-right: -0.9375rem;\n    position: relative;\n    transition: transform .4s; }\n    .header .nav-mob-toggle span {\n      background-color: #fff;\n      display: block;\n      height: 2px;\n      left: 14px;\n      margin-top: -1px;\n      position: absolute;\n      top: 50%;\n      transition: .4s;\n      width: 20px; }\n      .header .nav-mob-toggle span:first-child {\n        transform: translate(0, -6px); }\n      .header .nav-mob-toggle span:last-child {\n        transform: translate(0, 6px); }\n  .header:not(.toolbar-shadow) {\n    background-color: transparent !important; }\n\n/* Header Navigation\r\n========================================================================== */\n.header-menu {\n  flex: 1 1 0;\n  overflow: hidden;\n  transition: flex .2s,margin .2s,width .2s; }\n  .header-menu ul {\n    margin-left: 2rem;\n    white-space: nowrap; }\n    .header-menu ul li {\n      padding-right: 15px;\n      display: inline-block; }\n    .header-menu ul a {\n      padding: 0 8px;\n      position: relative; }\n      .header-menu ul a:before {\n        background: #fff;\n        bottom: 0;\n        content: '';\n        height: 2px;\n        left: 0;\n        opacity: 0;\n        position: absolute;\n        transition: opacity .2s;\n        width: 100%; }\n      .header-menu ul a:hover:before, .header-menu ul a.active:before {\n        opacity: 1; }\n\n/* header social\r\n========================================================================== */\n.header-follow a {\n  padding: 0 10px; }\n  .header-follow a:hover {\n    color: rgba(255, 255, 255, 0.8); }\n  .header-follow a:before {\n    font-size: 1.25rem !important; }\n\n/* Header search\r\n========================================================================== */\n.header-search {\n  background: #eee;\n  border-radius: 2px;\n  display: none;\n  height: 36px;\n  position: relative;\n  text-align: left;\n  transition: background .2s,flex .2s;\n  vertical-align: top;\n  margin-left: 1.5rem;\n  margin-right: 1.5rem; }\n  .header-search .search-icon {\n    color: #757575;\n    font-size: 24px;\n    left: 24px;\n    position: absolute;\n    top: 12px;\n    transition: color .2s; }\n\ninput.search-field {\n  background: 0;\n  border: 0;\n  color: #212121;\n  height: 36px;\n  padding: 0 8px 0 72px;\n  transition: color .2s;\n  width: 100%; }\n  input.search-field:focus {\n    border: 0;\n    outline: none; }\n\n.search-popout {\n  background: #fff;\n  box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24), inset 0 4px 6px -4px rgba(0, 0, 0, 0.24);\n  margin-top: 10px;\n  max-height: calc(100vh - 150px);\n  margin-left: -64px;\n  overflow-y: auto;\n  position: absolute;\n  z-index: -1; }\n  .search-popout.closed {\n    visibility: hidden; }\n\n.search-suggest-results {\n  padding: 0 8px 0 75px; }\n  .search-suggest-results a {\n    color: #212121;\n    display: block;\n    margin-left: -8px;\n    outline: 0;\n    height: auto;\n    padding: 8px;\n    transition: background .2s;\n    font-size: 0.875rem; }\n    .search-suggest-results a:first-child {\n      margin-top: 10px; }\n    .search-suggest-results a:last-child {\n      margin-bottom: 10px; }\n    .search-suggest-results a:hover {\n      background: #f7f7f7; }\n\n/* mediaquery medium\r\n========================================================================== */\n@media only screen and (min-width: 992px) {\n  .header-search {\n    background: rgba(255, 255, 255, 0.25);\n    box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.12);\n    color: #fff;\n    display: inline-block;\n    width: 200px; }\n    .header-search:hover {\n      background: rgba(255, 255, 255, 0.4); }\n    .header-search .search-icon {\n      top: 0px; }\n    .header-search input, .header-search input::placeholder, .header-search .search-icon {\n      color: #fff; }\n  .search-popout {\n    width: 100%;\n    margin-left: 0; }\n  .header.is-showSearch .header-search {\n    background: #fff;\n    flex: 1 0 auto; }\n    .header.is-showSearch .header-search .search-icon {\n      color: #757575 !important; }\n    .header.is-showSearch .header-search input, .header.is-showSearch .header-search input::placeholder {\n      color: #212121 !important; }\n  .header.is-showSearch .header-menu {\n    flex: 0 0 auto;\n    margin: 0;\n    visibility: hidden;\n    width: 0; } }\n\n/* Media Query\r\n========================================================================== */\n@media only screen and (max-width: 992px) {\n  .header-menu ul {\n    display: none; }\n  .header.is-showSearchMob {\n    padding: 0; }\n    .header.is-showSearchMob .header-logo,\n    .header.is-showSearchMob .nav-mob-toggle {\n      display: none; }\n    .header.is-showSearchMob .header-search {\n      border-radius: 0;\n      display: inline-block !important;\n      height: 50px;\n      margin: 0;\n      width: 100%; }\n      .header.is-showSearchMob .header-search input {\n        height: 50px;\n        padding-right: 48px; }\n      .header.is-showSearchMob .header-search .search-popout {\n        margin-top: 0; }\n    .header.is-showSearchMob .search-mob-toggle {\n      border: 0;\n      color: #757575;\n      position: absolute;\n      right: 0; }\n      .header.is-showSearchMob .search-mob-toggle:before {\n        content: \"\" !important; }\n  body.is-showNavMob {\n    overflow: hidden; }\n    body.is-showNavMob .nav-mob {\n      transform: translateX(0); }\n    body.is-showNavMob .nav-mob-toggle {\n      border: 0;\n      transform: rotate(90deg); }\n      body.is-showNavMob .nav-mob-toggle span:first-child {\n        transform: rotate(45deg) translate(0, 0); }\n      body.is-showNavMob .nav-mob-toggle span:nth-child(2) {\n        transform: scaleX(0); }\n      body.is-showNavMob .nav-mob-toggle span:last-child {\n        transform: rotate(-45deg) translate(0, 0); }\n    body.is-showNavMob .search-mob-toggle {\n      display: none; }\n    body.is-showNavMob .main, body.is-showNavMob .footer {\n      transform: translateX(-25%); } }\n\n.cover {\n  background: #4285f4;\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n  color: #fff;\n  letter-spacing: .2px;\n  min-height: 550px;\n  position: relative;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n  z-index: 2; }\n  .cover-wrap {\n    margin: 0 auto;\n    max-width: 1050px;\n    padding: 16px;\n    position: relative;\n    text-align: center;\n    z-index: 99; }\n  .cover-title {\n    font-size: 3.5rem;\n    margin: 0 0 50px;\n    line-height: 1;\n    font-weight: 700; }\n  .cover-description {\n    max-width: 600px; }\n  .cover-background {\n    background-attachment: fixed; }\n  .cover .mouse {\n    width: 25px;\n    position: absolute;\n    height: 36px;\n    border-radius: 15px;\n    border: 2px solid #888;\n    border: 2px solid rgba(255, 255, 255, 0.27);\n    bottom: 40px;\n    right: 40px;\n    margin-left: -12px;\n    cursor: pointer;\n    transition: border-color 0.2s ease-in; }\n    .cover .mouse .scroll {\n      display: block;\n      margin: 6px auto;\n      width: 3px;\n      height: 6px;\n      border-radius: 4px;\n      background: rgba(255, 255, 255, 0.68);\n      animation-duration: 2s;\n      animation-name: scroll;\n      animation-iteration-count: infinite; }\n\n.author a {\n  color: #FFF !important; }\n\n.author-header {\n  margin-top: 10%; }\n\n.author-name-wrap {\n  display: inline-block; }\n\n.author-title {\n  display: block;\n  text-transform: uppercase; }\n\n.author-name {\n  margin: 5px 0;\n  font-size: 1.75rem; }\n\n.author-bio {\n  margin: 1.5rem 0;\n  line-height: 1.8;\n  font-size: 18px;\n  max-width: 700px; }\n\n.author-avatar {\n  display: inline-block;\n  border-radius: 90px;\n  margin-right: 10px;\n  width: 80px;\n  height: 80px;\n  background-size: cover;\n  background-position: center;\n  vertical-align: bottom; }\n\n.author-meta {\n  margin-bottom: 20px; }\n  .author-meta span {\n    display: inline-block;\n    font-size: 17px;\n    font-style: italic;\n    margin: 0 2rem 1rem 0;\n    opacity: 0.8;\n    word-wrap: break-word; }\n\n.author .author-link:hover {\n  opacity: 1; }\n\n.author-follow a {\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  cursor: pointer;\n  display: inline-block;\n  height: 40px;\n  letter-spacing: 1px;\n  line-height: 40px;\n  margin: 0 10px;\n  padding: 0 16px;\n  text-shadow: none;\n  text-transform: uppercase; }\n  .author-follow a:hover {\n    box-shadow: inset 0 0 0 2px #fff; }\n\n.home-down {\n  animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100; }\n\n@media only screen and (min-width: 766px) {\n  .cover-description {\n    font-size: 1.25rem; } }\n\n@media only screen and (max-width: 766px) {\n  .cover {\n    padding-top: 50px;\n    padding-bottom: 20px; }\n    .cover-title {\n      font-size: 2rem; }\n  .author-avatar {\n    display: block;\n    margin: 0 auto 10px auto; } }\n\n.feed-entry-content .feed-entry-wrapper:last-child .entry:last-child {\n  padding: 0;\n  border: none; }\n\n.entry {\n  margin-bottom: 1.5rem;\n  padding: 0 15px 15px; }\n  .entry-image--link {\n    height: 180px;\n    margin: 0 -15px;\n    overflow: hidden; }\n    .entry-image--link:hover .entry-image--bg {\n      transform: scale(1.03);\n      backface-visibility: hidden; }\n  .entry-image--bg {\n    transition: transform 0.3s; }\n  .entry-video-play {\n    border-radius: 50%;\n    border: 2px solid #fff;\n    color: #fff;\n    font-size: 3.5rem;\n    height: 65px;\n    left: 50%;\n    line-height: 65px;\n    position: absolute;\n    text-align: center;\n    top: 50%;\n    transform: translate(-50%, -50%);\n    width: 65px;\n    z-index: 10; }\n  .entry-category {\n    margin-bottom: 5px;\n    text-transform: capitalize;\n    font-size: 0.875rem;\n    line-height: 1; }\n    .entry-category a:active {\n      text-decoration: underline; }\n  .entry-title {\n    color: #000;\n    font-size: 1.25rem;\n    height: auto;\n    line-height: 1.2;\n    margin: 0 0 .5rem;\n    padding: 0; }\n    .entry-title:hover {\n      color: #777; }\n  .entry-byline {\n    margin-top: 0;\n    margin-bottom: 0.5rem;\n    color: #999;\n    font-size: 0.8125rem; }\n    .entry-byline a {\n      color: inherit; }\n      .entry-byline a:hover {\n        color: #333; }\n  .entry-body {\n    padding-top: 20px; }\n\n/* Entry small --small\r\n========================================================================== */\n.entry.entry--small {\n  margin-bottom: 24px;\n  padding: 0; }\n  .entry.entry--small .entry-image {\n    margin-bottom: 10px; }\n  .entry.entry--small .entry-image--link {\n    height: 170px;\n    margin: 0; }\n  .entry.entry--small .entry-title {\n    font-size: 1rem;\n    font-weight: 500;\n    line-height: 1.2;\n    text-transform: capitalize; }\n  .entry.entry--small .entry-byline {\n    margin: 0; }\n\n@media only screen and (min-width: 992px) {\n  .entry {\n    margin-bottom: 40px;\n    padding: 0; }\n    .entry-title {\n      font-size: 21px; }\n    .entry-body {\n      padding-right: 35px !important; }\n    .entry-image {\n      margin-bottom: 0; }\n    .entry-image--link {\n      height: 180px;\n      margin: 0; } }\n\n@media only screen and (min-width: 1230px) {\n  .entry-image--link {\n    height: 218px; } }\n\n.footer {\n  color: rgba(0, 0, 0, 0.44);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1;\n  padding: 1.6rem 15px;\n  text-align: center; }\n  .footer a {\n    color: rgba(0, 0, 0, 0.6); }\n    .footer a:hover {\n      color: rgba(0, 0, 0, 0.8); }\n  .footer-wrap {\n    margin: 0 auto;\n    max-width: 1400px; }\n  .footer .heart {\n    animation: heartify .5s infinite alternate;\n    color: red; }\n  .footer-copy, .footer-design-author {\n    display: inline-block;\n    padding: .5rem 0;\n    vertical-align: middle; }\n  .footer-follow {\n    padding: 20px 0; }\n    .footer-follow a {\n      font-size: 20px;\n      margin: 0 5px;\n      color: rgba(0, 0, 0, 0.8); }\n\n@keyframes heartify {\n  0% {\n    transform: scale(0.8); } }\n\n.btn, .nav-mob-follow a {\n  background-color: #fff;\n  border-radius: 2px;\n  border: 0;\n  box-shadow: none;\n  color: #039be5;\n  cursor: pointer;\n  display: inline-block;\n  font: 500 14px/20px \"Roboto\", sans-serif;\n  height: 36px;\n  margin: 0;\n  min-width: 36px;\n  outline: 0;\n  overflow: hidden;\n  padding: 8px;\n  text-align: center;\n  text-decoration: none;\n  text-overflow: ellipsis;\n  text-transform: uppercase;\n  transition: background-color .2s,box-shadow .2s;\n  vertical-align: middle;\n  white-space: nowrap; }\n  .btn + .btn, .nav-mob-follow a + .btn, .nav-mob-follow .btn + a, .nav-mob-follow a + a {\n    margin-left: 8px; }\n  .btn:focus, .nav-mob-follow a:focus, .btn:hover, .nav-mob-follow a:hover {\n    background-color: #e1f3fc;\n    text-decoration: none !important; }\n  .btn:active, .nav-mob-follow a:active {\n    background-color: #c3e7f9; }\n  .btn.btn-lg, .nav-mob-follow a.btn-lg {\n    font-size: 1.5rem;\n    min-width: 48px;\n    height: 48px;\n    line-height: 48px; }\n  .btn.btn-flat, .nav-mob-follow a.btn-flat {\n    background: 0;\n    box-shadow: none; }\n    .btn.btn-flat:focus, .nav-mob-follow a.btn-flat:focus, .btn.btn-flat:hover, .nav-mob-follow a.btn-flat:hover, .btn.btn-flat:active, .nav-mob-follow a.btn-flat:active {\n      background: 0;\n      box-shadow: none; }\n  .btn.btn-primary, .nav-mob-follow a.btn-primary {\n    background-color: #4285f4;\n    color: #fff; }\n    .btn.btn-primary:hover, .nav-mob-follow a.btn-primary:hover {\n      background-color: #2f79f3; }\n  .btn.btn-circle, .nav-mob-follow a.btn-circle {\n    border-radius: 50%;\n    height: 40px;\n    line-height: 40px;\n    padding: 0;\n    width: 40px; }\n  .btn.btn-circle-small, .nav-mob-follow a.btn-circle-small {\n    border-radius: 50%;\n    height: 32px;\n    line-height: 32px;\n    padding: 0;\n    width: 32px;\n    min-width: 32px; }\n  .btn.btn-shadow, .nav-mob-follow a.btn-shadow {\n    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);\n    color: #333;\n    background-color: #eee; }\n    .btn.btn-shadow:hover, .nav-mob-follow a.btn-shadow:hover {\n      background-color: rgba(0, 0, 0, 0.12); }\n  .btn.btn-download-cloud, .nav-mob-follow a.btn-download-cloud, .btn.btn-download, .nav-mob-follow a.btn-download {\n    background-color: #4285f4;\n    color: #fff; }\n    .btn.btn-download-cloud:hover, .nav-mob-follow a.btn-download-cloud:hover, .btn.btn-download:hover, .nav-mob-follow a.btn-download:hover {\n      background-color: #1b6cf2; }\n    .btn.btn-download-cloud:after, .nav-mob-follow a.btn-download-cloud:after, .btn.btn-download:after, .nav-mob-follow a.btn-download:after {\n      margin-left: 5px;\n      font-size: 1.1rem;\n      display: inline-block;\n      vertical-align: top; }\n  .btn.btn-download:after, .nav-mob-follow a.btn-download:after {\n    content: \"\"; }\n  .btn.btn-download-cloud:after, .nav-mob-follow a.btn-download-cloud:after {\n    content: \"\"; }\n  .btn.external:after, .nav-mob-follow a.external:after {\n    font-size: 1rem; }\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate; }\n\n.form-control {\n  width: 100%;\n  padding: 8px 12px;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 0px;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\n  height: 36px; }\n  .form-control:focus {\n    border-color: #4285f4;\n    outline: 0;\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(66, 133, 244, 0.6); }\n\n.btn-subscribe-home {\n  background-color: transparent;\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #ffffff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  max-width: 300px;\n  padding: 15px 10px;\n  transition: all 0.3s;\n  width: 100%; }\n  .btn-subscribe-home:hover {\n    box-shadow: inset 0 0 0 2px #fff; }\n\n/*  Post\n========================================================================== */\n.post-wrapper {\n  margin-top: 50px;\n  padding-top: 1.8rem; }\n\n.post-header {\n  margin-bottom: 1.2rem; }\n\n.post-title {\n  color: #000;\n  font-size: 2.5rem;\n  height: auto;\n  line-height: 1.04;\n  margin: 0 0 0.9375rem;\n  letter-spacing: -.028em !important;\n  padding: 0; }\n\n.post-excerpt {\n  line-height: 1.3em;\n  font-size: 20px;\n  color: #7D7D7D;\n  margin-bottom: 8px; }\n\n.post-image {\n  margin-bottom: 30px;\n  overflow: hidden; }\n\n.post-body {\n  margin-bottom: 2rem; }\n  .post-body a:focus {\n    text-decoration: underline; }\n  .post-body h2 {\n    font-weight: 500;\n    margin: 2.50rem 0 1.25rem;\n    padding-bottom: 3px; }\n  .post-body h3, .post-body h4 {\n    margin: 32px 0 16px; }\n  .post-body iframe {\n    display: block !important;\n    margin: 0 auto 1.5rem 0 !important; }\n  .post-body img {\n    display: block;\n    margin-bottom: 1rem; }\n  .post-body h2 a, .post-body h3 a, .post-body h4 a {\n    color: #4285f4; }\n\n.post-tags {\n  margin: 1.25rem 0; }\n\n.post-card {\n  padding: 15px; }\n\n/* Post author by line top (author - time - tag - sahre)\n========================================================================== */\n.post-byline {\n  color: #999;\n  font-size: 14px;\n  flex-grow: 1;\n  letter-spacing: -.028em !important; }\n  .post-byline a {\n    color: inherit; }\n    .post-byline a:active {\n      text-decoration: underline; }\n    .post-byline a:hover {\n      color: #222; }\n\n.post-actions--top .share {\n  margin-right: 10px;\n  font-size: 20px; }\n  .post-actions--top .share:hover {\n    opacity: .7; }\n\n.post-action-comments {\n  color: #999;\n  margin-right: 15px;\n  font-size: 14px; }\n\n/* Post Action social media\n========================================================================== */\n.post-actions {\n  position: relative;\n  margin-bottom: 1.5rem; }\n  .post-actions a {\n    color: #fff;\n    font-size: 1.125rem; }\n    .post-actions a:hover {\n      background-color: #000 !important; }\n  .post-actions li {\n    margin-left: 6px; }\n    .post-actions li:first-child {\n      margin-left: 0 !important; }\n  .post-actions .btn, .post-actions .nav-mob-follow a, .nav-mob-follow .post-actions a {\n    border-radius: 0; }\n\n/* Post author widget bottom\n========================================================================== */\n.post-author {\n  position: relative;\n  font-size: 15px;\n  padding: 30px 0 30px 100px;\n  margin-bottom: 3rem;\n  background-color: #f3f5f6; }\n  .post-author h5 {\n    color: #AAA;\n    font-size: 12px;\n    line-height: 1.5;\n    margin: 0;\n    font-weight: 500; }\n  .post-author li {\n    margin-left: 30px;\n    font-size: 14px; }\n    .post-author li a {\n      color: #555; }\n      .post-author li a:hover {\n        color: #000; }\n    .post-author li:first-child {\n      margin-left: 0; }\n  .post-author .post-author-avatar {\n    height: 64px;\n    width: 64px;\n    position: absolute;\n    left: 20px;\n    top: 30px;\n    background-position: center center;\n    background-size: cover;\n    border-radius: 50%; }\n\n/* bottom share and bottom subscribe\n========================================================================== */\n.share-subscribe {\n  margin-bottom: 1rem; }\n  .share-subscribe p {\n    color: #7d7d7d;\n    margin-bottom: 1rem;\n    line-height: 1;\n    font-size: 0.875rem; }\n  .share-subscribe .social-share {\n    float: none !important; }\n  .share-subscribe > div {\n    position: relative;\n    overflow: hidden;\n    margin-bottom: 15px; }\n    .share-subscribe > div:before {\n      content: \" \";\n      border-top: solid 1px #000;\n      position: absolute;\n      top: 0;\n      left: 15px;\n      width: 40px;\n      height: 1px; }\n    .share-subscribe > div h5 {\n      font-size: 0.875rem;\n      margin: 1rem 0;\n      line-height: 1;\n      text-transform: uppercase;\n      font-weight: 500; }\n  .share-subscribe .newsletter-form {\n    display: flex; }\n    .share-subscribe .newsletter-form .form-group {\n      max-width: 250px;\n      width: 100%; }\n    .share-subscribe .newsletter-form .btn, .share-subscribe .newsletter-form .nav-mob-follow a, .nav-mob-follow .share-subscribe .newsletter-form a {\n      border-radius: 0; }\n\n/* Related post\n========================================================================== */\n.post-related {\n  margin-top: 40px; }\n  .post-related-title {\n    color: #000;\n    font-size: 18px;\n    font-weight: 500;\n    height: auto;\n    line-height: 17px;\n    margin: 0 0 20px;\n    padding-bottom: 10px;\n    text-transform: uppercase; }\n  .post-related-list {\n    margin-bottom: 18px;\n    padding: 0;\n    border: none; }\n\n/* Media Query (medium)\n========================================================================== */\n@media only screen and (min-width: 766px) {\n  .post .title {\n    font-size: 2.25rem;\n    margin: 0 0 1rem; }\n  .post-body {\n    font-size: 1.125rem;\n    line-height: 32px; }\n    .post-body p {\n      margin-bottom: 1.5rem; }\n  .post-card {\n    padding: 30px; } }\n\n@media only screen and (max-width: 640px) {\n  .post-title {\n    font-size: 1.8rem; }\n  .post-image,\n  .video-responsive {\n    margin-left: -0.9375rem;\n    margin-right: -0.9375rem; } }\n\n/* sidebar\r\n========================================================================== */\n.sidebar {\n  position: relative;\n  line-height: 1.6; }\n  .sidebar h1, .sidebar h2, .sidebar h3, .sidebar h4, .sidebar h5, .sidebar h6 {\n    margin-top: 0;\n    color: #000; }\n  .sidebar-items {\n    margin-bottom: 2.5rem;\n    padding: 25px;\n    position: relative; }\n  .sidebar-title {\n    padding-bottom: 10px;\n    margin-bottom: 1rem;\n    text-transform: uppercase;\n    font-size: 1rem; }\n  .sidebar .title-primary {\n    background-color: #4285f4;\n    color: #FFF;\n    padding: 10px 16px;\n    font-size: 18px; }\n\n.sidebar-post--border {\n  align-items: center;\n  border-left: 3px solid #4285f4;\n  bottom: 0;\n  color: rgba(0, 0, 0, 0.2);\n  display: flex;\n  font-size: 28px;\n  font-weight: bold;\n  left: 0;\n  line-height: 1;\n  padding: 15px 10px 10px;\n  position: absolute;\n  top: 0; }\n\n.sidebar-post:nth-child(3n) .sidebar-post--border {\n  border-color: #f59e00; }\n\n.sidebar-post:nth-child(3n+2) .sidebar-post--border {\n  border-color: #00a034; }\n\n.sidebar-post--link {\n  display: block;\n  min-height: 50px;\n  padding: 10px 15px 10px 55px;\n  position: relative; }\n  .sidebar-post--link:hover .sidebar-post--border {\n    background-color: #e5eff5; }\n\n.sidebar-post--title {\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 16px;\n  font-weight: 500;\n  margin: 0; }\n\n.subscribe {\n  min-height: 90vh;\n  padding-top: 50px; }\n  .subscribe h3 {\n    margin: 0;\n    margin-bottom: 8px;\n    font: 400 20px/32px \"Roboto\", sans-serif; }\n  .subscribe-title {\n    font-weight: 400;\n    margin-top: 0; }\n  .subscribe-wrap {\n    max-width: 700px;\n    color: #7d878a;\n    padding: 1rem 0; }\n  .subscribe .form-group {\n    margin-bottom: 1.5rem; }\n    .subscribe .form-group.error input {\n      border-color: #ff5b5b; }\n  .subscribe .btn, .subscribe .nav-mob-follow a, .nav-mob-follow .subscribe a {\n    width: 100%; }\n\n.subscribe-form {\n  position: relative;\n  margin: 30px auto;\n  padding: 40px;\n  max-width: 400px;\n  width: 100%;\n  background: #ebeff2;\n  border-radius: 5px;\n  text-align: left; }\n\n.subscribe-input {\n  width: 100%;\n  padding: 10px;\n  border: #4285f4  1px solid;\n  border-radius: 2px; }\n  .subscribe-input:focus {\n    outline: none; }\n\n.animated {\n  animation-duration: 1s;\n  animation-fill-mode: both; }\n  .animated.infinite {\n    animation-iteration-count: infinite; }\n\n.bounceIn {\n  animation-name: bounceIn; }\n\n.bounceInDown {\n  animation-name: bounceInDown; }\n\n.slideInUp {\n  animation-name: slideInUp; }\n\n.slideOutDown {\n  animation-name: slideOutDown; }\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3); }\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1); }\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9); }\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03); }\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97); }\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0); }\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0); }\n  75% {\n    transform: translate3d(0, -10px, 0); }\n  90% {\n    transform: translate3d(0, 5px, 0); }\n  100% {\n    transform: none; } }\n\n@keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1); }\n  50% {\n    transform: scale3d(1.05, 1.05, 1.05); }\n  to {\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes scroll {\n  0% {\n    opacity: 0; }\n  10% {\n    opacity: 1;\n    transform: translateY(0px); }\n  100% {\n    opacity: 0;\n    transform: translateY(10px); } }\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg); }\n  to {\n    transform: rotate(360deg); } }\n\n@keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible; }\n  to {\n    transform: translate3d(0, 0, 0); } }\n\n@keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0); }\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0); } }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdHlsZXMvbWFpbi5zY3NzIiwibm9kZV9tb2R1bGVzL3ByaXNtanMvcGx1Z2lucy9saW5lLW51bWJlcnMvcHJpc20tbGluZS1udW1iZXJzLmNzcyIsInNyYy9zdHlsZXMvY29tbW9uL19pY29uLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fdmFyaWFibGVzLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fdXRpbGl0aWVzLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fZ2xvYmFsLnNjc3MiLCJzcmMvc3R5bGVzL2NvbXBvbmVudHMvX2dyaWQuc2NzcyIsInNyYy9zdHlsZXMvY29tbW9uL190eXBvZ3JhcGh5LnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX21lbnUuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9faGVhZGVyLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX2NvdmVyLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX2VudHJ5LnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX2Zvb3Rlci5zY3NzIiwic3JjL3N0eWxlcy9jb21wb25lbnRzL19idXR0b25zLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX3Bvc3Quc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9fc2lkZWJhci5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19zdWJzY3JpYmUuc2NzcyIsInNyYy9zdHlsZXMvY29tcG9uZW50cy9fYW5pbWF0ZWQuc2NzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAcGFja2FnZSBnb2RvZnJlZG9uaW5qYVxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5AY2hhcnNldCBcIlVURi04XCI7XHJcblxyXG4vLyBOb3JtYWxpemUgYW5kIGljb24gZm9udHMgKGxpYnJhcmllcylcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbkBpbXBvcnQgXCJ+bm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzXCI7XHJcbkBpbXBvcnQgXCJ+cHJpc21qcy90aGVtZXMvcHJpc20uY3NzXCI7XHJcbkBpbXBvcnQgXCJ+cHJpc21qcy9wbHVnaW5zL2xpbmUtbnVtYmVycy9wcmlzbS1saW5lLW51bWJlcnNcIjtcclxuXHJcbi8vICBpY29uc1xyXG5AaW1wb3J0IFwiY29tbW9uL2ljb25cIjtcclxuXHJcbi8vIE1peGlucyAmIFZhcmlhYmxlc1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5AaW1wb3J0IFwiY29tbW9uL3ZhcmlhYmxlc1wiO1xyXG5AaW1wb3J0IFwiY29tbW9uL3V0aWxpdGllc1wiO1xyXG5cclxuLy8gU3RydWN0dXJlXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbkBpbXBvcnQgXCJjb21tb24vZ2xvYmFsXCI7XHJcbkBpbXBvcnQgXCJjb21wb25lbnRzL2dyaWRcIjtcclxuQGltcG9ydCBcImNvbW1vbi90eXBvZ3JhcGh5XCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL21lbnVcIjtcclxuQGltcG9ydCBcImxheW91dHMvaGVhZGVyXCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL2NvdmVyXCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL2VudHJ5XCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL2Zvb3RlclwiO1xyXG5AaW1wb3J0IFwiY29tcG9uZW50cy9idXR0b25zXCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL3Bvc3RcIjtcclxuQGltcG9ydCBcImxheW91dHMvc2lkZWJhclwiO1xyXG5AaW1wb3J0IFwibGF5b3V0cy9zdWJzY3JpYmVcIjtcclxuQGltcG9ydCBcImNvbXBvbmVudHMvYW5pbWF0ZWRcIjtcclxuIiwicHJlLmxpbmUtbnVtYmVycyB7XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0cGFkZGluZy1sZWZ0OiAzLjhlbTtcblx0Y291bnRlci1yZXNldDogbGluZW51bWJlcjtcbn1cblxucHJlLmxpbmUtbnVtYmVycyA+IGNvZGUge1xuXHRwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgd2hpdGUtc3BhY2U6IGluaGVyaXQ7XG59XG5cbi5saW5lLW51bWJlcnMgLmxpbmUtbnVtYmVycy1yb3dzIHtcblx0cG9zaXRpb246IGFic29sdXRlO1xuXHRwb2ludGVyLWV2ZW50czogbm9uZTtcblx0dG9wOiAwO1xuXHRmb250LXNpemU6IDEwMCU7XG5cdGxlZnQ6IC0zLjhlbTtcblx0d2lkdGg6IDNlbTsgLyogd29ya3MgZm9yIGxpbmUtbnVtYmVycyBiZWxvdyAxMDAwIGxpbmVzICovXG5cdGxldHRlci1zcGFjaW5nOiAtMXB4O1xuXHRib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjOTk5O1xuXG5cdC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG5cdC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG5cdC1tcy11c2VyLXNlbGVjdDogbm9uZTtcblx0dXNlci1zZWxlY3Q6IG5vbmU7XG5cbn1cblxuXHQubGluZS1udW1iZXJzLXJvd3MgPiBzcGFuIHtcblx0XHRwb2ludGVyLWV2ZW50czogbm9uZTtcblx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRjb3VudGVyLWluY3JlbWVudDogbGluZW51bWJlcjtcblx0fVxuXG5cdFx0LmxpbmUtbnVtYmVycy1yb3dzID4gc3BhbjpiZWZvcmUge1xuXHRcdFx0Y29udGVudDogY291bnRlcihsaW5lbnVtYmVyKTtcblx0XHRcdGNvbG9yOiAjOTk5O1xuXHRcdFx0ZGlzcGxheTogYmxvY2s7XG5cdFx0XHRwYWRkaW5nLXJpZ2h0OiAwLjhlbTtcblx0XHRcdHRleHQtYWxpZ246IHJpZ2h0O1xuXHRcdH0iLCJAZm9udC1mYWNlIHtcclxuICBmb250LWZhbWlseTogJ21hcGFjaGUnO1xyXG4gIHNyYzpcclxuICAgIHVybCgnLi4vZm9udHMvbWFwYWNoZS50dGY/ZzdobXM4JykgZm9ybWF0KCd0cnVldHlwZScpLFxyXG4gICAgdXJsKCcuLi9mb250cy9tYXBhY2hlLndvZmY/ZzdobXM4JykgZm9ybWF0KCd3b2ZmJyksXHJcbiAgICB1cmwoJy4uL2ZvbnRzL21hcGFjaGUuc3ZnP2c3aG1zOCNtYXBhY2hlJykgZm9ybWF0KCdzdmcnKTtcclxuICBmb250LXdlaWdodDogbm9ybWFsO1xyXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcclxufVxyXG5cclxuW2NsYXNzXj1cImktXCJdOmJlZm9yZSwgW2NsYXNzKj1cIiBpLVwiXTpiZWZvcmUge1xyXG4gIC8qIHVzZSAhaW1wb3J0YW50IHRvIHByZXZlbnQgaXNzdWVzIHdpdGggYnJvd3NlciBleHRlbnNpb25zIHRoYXQgY2hhbmdlIGZvbnRzICovXHJcbiAgZm9udC1mYW1pbHk6ICdtYXBhY2hlJyAhaW1wb3J0YW50O1xyXG4gIHNwZWFrOiBub25lO1xyXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcclxuICBmb250LXdlaWdodDogbm9ybWFsO1xyXG4gIGZvbnQtdmFyaWFudDogbm9ybWFsO1xyXG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xyXG4gIGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xyXG5cclxuICAvKiBCZXR0ZXIgRm9udCBSZW5kZXJpbmcgPT09PT09PT09PT0gKi9cclxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcclxuICAtbW96LW9zeC1mb250LXNtb290aGluZzogZ3JheXNjYWxlO1xyXG59XHJcblxyXG4uaS1uYXZpZ2F0ZV9iZWZvcmU6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTQwOFwiO1xyXG59XHJcbi5pLW5hdmlnYXRlX25leHQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTQwOVwiO1xyXG59XHJcbi5pLXRhZzpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlNTRlXCI7XHJcbn1cclxuLmkta2V5Ym9hcmRfYXJyb3dfZG93bjpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlMzEzXCI7XHJcbn1cclxuLmktYXJyb3dfdXB3YXJkOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU1ZDhcIjtcclxufVxyXG4uaS1jbG91ZF9kb3dubG9hZDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlMmMwXCI7XHJcbn1cclxuLmktc3RhcjpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlODM4XCI7XHJcbn1cclxuLmkta2V5Ym9hcmRfYXJyb3dfdXA6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTMxNlwiO1xyXG59XHJcbi5pLW9wZW5faW5fbmV3OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU4OWVcIjtcclxufVxyXG4uaS13YXJuaW5nOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGUwMDJcIjtcclxufVxyXG4uaS1iYWNrOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU1YzRcIjtcclxufVxyXG4uaS1mb3J3YXJkOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU1YzhcIjtcclxufVxyXG4uaS1jaGF0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGUwY2JcIjtcclxufVxyXG4uaS1jbG9zZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlNWNkXCI7XHJcbn1cclxuLmktY29kZTI6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTg2ZlwiO1xyXG59XHJcbi5pLWZhdm9yaXRlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU4N2RcIjtcclxufVxyXG4uaS1saW5rOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGUxNTdcIjtcclxufVxyXG4uaS1tZW51OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU1ZDJcIjtcclxufVxyXG4uaS1mZWVkOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGUwZTVcIjtcclxufVxyXG4uaS1zZWFyY2g6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZThiNlwiO1xyXG59XHJcbi5pLXNoYXJlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU4MGRcIjtcclxufVxyXG4uaS1jaGVja19jaXJjbGU6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTg2Y1wiO1xyXG59XHJcbi5pLXBsYXk6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwMVwiO1xyXG59XHJcbi5pLWRvd25sb2FkOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU5MDBcIjtcclxufVxyXG4uaS1jb2RlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxMjFcIjtcclxufVxyXG4uaS1iZWhhbmNlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxYjRcIjtcclxufVxyXG4uaS1zcG90aWZ5OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxYmNcIjtcclxufVxyXG4uaS1jb2RlcGVuOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxY2JcIjtcclxufVxyXG4uaS1naXRodWI6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjA5YlwiO1xyXG59XHJcbi5pLWxpbmtlZGluOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYwZTFcIjtcclxufVxyXG4uaS1mbGlja3I6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjE2ZVwiO1xyXG59XHJcbi5pLWRyaWJiYmxlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxN2RcIjtcclxufVxyXG4uaS1waW50ZXJlc3Q6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjIzMVwiO1xyXG59XHJcbi5pLW1hcDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMDQxXCI7XHJcbn1cclxuLmktdHdpdHRlcjpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMDk5XCI7XHJcbn1cclxuLmktZmFjZWJvb2s6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjA5YVwiO1xyXG59XHJcbi5pLXlvdXR1YmU6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjE2YVwiO1xyXG59XHJcbi5pLWluc3RhZ3JhbTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMTZkXCI7XHJcbn1cclxuLmktZ29vZ2xlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxYTBcIjtcclxufVxyXG4uaS1wb2NrZXQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjI2NVwiO1xyXG59XHJcbi5pLXJlZGRpdDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMjgxXCI7XHJcbn1cclxuLmktc25hcGNoYXQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjJhY1wiO1xyXG59XHJcbi5pLXRlbGVncmFtOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYyYzZcIjtcclxufVxyXG4iLCIvKlxyXG5AcGFja2FnZSBnb2RvZnJlZG9uaW5qYVxyXG5cclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbk1hcGFjaGUgdmFyaWFibGVzIHN0eWxlc1xyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuKi9cclxuXHJcbi8qKlxyXG4qIFRhYmxlIG9mIENvbnRlbnRzOlxyXG4qXHJcbiogICAxLiBDb2xvcnNcclxuKiAgIDIuIEZvbnRzXHJcbiogICAzLiBUeXBvZ3JhcGh5XHJcbiogICA0LiBIZWFkZXJcclxuKiAgIDUuIEZvb3RlclxyXG4qICAgNi4gQ29kZSBTeW50YXhcclxuKiAgIDcuIGJ1dHRvbnNcclxuKiAgIDguIGNvbnRhaW5lclxyXG4qICAgOS4gR3JpZFxyXG4qICAgMTAuIE1lZGlhIFF1ZXJ5IFJhbmdlc1xyXG4qICAgMTEuIEljb25zXHJcbiovXHJcblxyXG5cclxuLyogMS4gQ29sb3JzXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRwcmltYXJ5LWNvbG9yICAgICAgICA6ICM0Mjg1ZjQ7XHJcbi8vICRwcmltYXJ5LWNvbG9yICAgICAgICA6ICMyODU2YjY7XHJcblxyXG4kcHJpbWFyeS10ZXh0LWNvbG9yOiAgIzMzMztcclxuJHNlY29uZGFyeS10ZXh0LWNvbG9yOiAgIzk5OTtcclxuJGFjY2VudC1jb2xvcjogICAgICAjZWVlO1xyXG5cclxuJGRpdmlkZXItY29sb3I6ICAgICAjREREREREO1xyXG5cclxuLy8gJGxpbmstY29sb3IgICAgIDogIzQxODRGMztcclxuJGxpbmstY29sb3IgICAgIDogIzAzOWJlNTtcclxuLy8gJGNvbG9yLWJnLXBhZ2UgIDogI0VFRUVFRTtcclxuXHJcblxyXG4vLyBzb2NpYWwgY29sb3JzXHJcbiRzb2NpYWwtY29sb3JzOiAoXHJcbiAgZmFjZWJvb2sgICAgOiAjM2I1OTk4LFxyXG4gIHR3aXR0ZXIgICAgIDogIzU1YWNlZSxcclxuICBnb29nbGUgICAgOiAjZGQ0YjM5LFxyXG4gIGluc3RhZ3JhbSAgIDogIzMwNjA4OCxcclxuICB5b3V0dWJlICAgICA6ICNlNTJkMjcsXHJcbiAgZ2l0aHViICAgICAgOiAjMzMzMzMzLFxyXG4gIGxpbmtlZGluICAgIDogIzAwN2JiNixcclxuICBzcG90aWZ5ICAgICA6ICMyZWJkNTksXHJcbiAgY29kZXBlbiAgICAgOiAjMjIyMjIyLFxyXG4gIGJlaGFuY2UgICAgIDogIzEzMTQxOCxcclxuICBkcmliYmJsZSAgICA6ICNlYTRjODksXHJcbiAgZmxpY2tyICAgICAgIDogIzAwNjNEQyxcclxuICByZWRkaXQgICAgOiBvcmFuZ2VyZWQsXHJcbiAgcG9ja2V0ICAgIDogI0Y1MDA1NyxcclxuICBwaW50ZXJlc3QgICA6ICNiZDA4MWMsXHJcbiAgZmVlZCAgICA6IG9yYW5nZSxcclxuICB0ZWxlZ3JhbSA6ICMwOGMsXHJcbik7XHJcblxyXG5cclxuXHJcbi8qIDIuIEZvbnRzXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRwcmltYXJ5LWZvbnQ6ICAgICdSb2JvdG8nLCBzYW5zLXNlcmlmOyAvLyBmb250IGRlZmF1bHQgcGFnZVxyXG4kY29kZS1mb250OiAgICAgJ1JvYm90byBNb25vJywgbW9ub3NwYWNlOyAvLyBmb250IGZvciBjb2RlIGFuZCBwcmVcclxuXHJcblxyXG4vKiAzLiBUeXBvZ3JhcGh5XHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG4kc3BhY2VyOiAgICAgICAgICAgICAgICAgICAxcmVtO1xyXG4kbGluZS1oZWlnaHQ6ICAgICAgICAgICAgICAxLjU7XHJcblxyXG4kZm9udC1zaXplLXJvb3Q6ICAgICAgICAgICAxNnB4O1xyXG5cclxuJGZvbnQtc2l6ZS1iYXNlOiAgICAgICAgICAgMXJlbTtcclxuJGZvbnQtc2l6ZS1sZzogICAgICAgICAgICAgMS4yNXJlbTsgLy8gMjBweFxyXG4kZm9udC1zaXplLXNtOiAgICAgICAgICAgICAuODc1cmVtOyAvLzE0cHhcclxuJGZvbnQtc2l6ZS14czogICAgICAgICAgICAgLjAuODEyNTsgLy8xM3B4XHJcblxyXG4kZm9udC1zaXplLWgxOiAgICAgICAgICAgICAyLjI1cmVtO1xyXG4kZm9udC1zaXplLWgyOiAgICAgICAgICAgICAxLjg3NXJlbTtcclxuJGZvbnQtc2l6ZS1oMzogICAgICAgICAgICAgMS41NjI1cmVtO1xyXG4kZm9udC1zaXplLWg0OiAgICAgICAgICAgICAxLjM3NXJlbTtcclxuJGZvbnQtc2l6ZS1oNTogICAgICAgICAgICAgMS4xMjVyZW07XHJcbiRmb250LXNpemUtaDY6ICAgICAgICAgICAgIDFyZW07XHJcblxyXG5cclxuJGhlYWRpbmdzLW1hcmdpbi1ib3R0b206ICAgKCRzcGFjZXIgLyAyKTtcclxuJGhlYWRpbmdzLWZvbnQtZmFtaWx5OiAgICAgJHByaW1hcnktZm9udDtcclxuJGhlYWRpbmdzLWZvbnQtd2VpZ2h0OiAgICAgNzAwO1xyXG4kaGVhZGluZ3MtbGluZS1oZWlnaHQ6ICAgICAxLjE7XHJcbiRoZWFkaW5ncy1jb2xvcjogICAgICAgICAgIGluaGVyaXQ7XHJcblxyXG4kZm9udC13ZWlnaHQ6ICAgICAgIDUwMDtcclxuXHJcbiRibG9ja3F1b3RlLWZvbnQtc2l6ZTogICAgIDEuMTI1cmVtO1xyXG5cclxuXHJcbi8qIDQuIEhlYWRlclxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4kaGVhZGVyLWJnOiAkcHJpbWFyeS1jb2xvcjtcclxuJGhlYWRlci1jb2xvcjogI2ZmZjtcclxuJGhlYWRlci1oZWlnaHQ6IDUwcHg7XHJcbiRoZWFkZXItc2VhcmNoLWJnOiAjZWVlO1xyXG4kaGVhZGVyLXNlYXJjaC1jb2xvcjogIzc1NzU3NTtcclxuXHJcblxyXG4vKiA1LiBFbnRyeSBhcnRpY2xlc1xyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4kZW50cnktY29sb3ItdGl0bGU6ICMwMDA7XHJcbiRlbnRyeS1jb2xvci10aXRsZS1ob3ZlcjogIzc3NztcclxuJGVudHJ5LWZvbnQtc2l6ZTogMS43NXJlbTsgLy8gMjhweFxyXG4kZW50cnktZm9udC1zaXplLW1iOiAxLjI1cmVtOyAvLyAyMHB4XHJcbiRlbnRyeS1mb250LXNpemUtYnlsaW5lOiAwLjgxMjVyZW07IC8vIDEzcHhcclxuJGVudHJ5LWNvbG9yLWJ5bGluZTogIzk5OTtcclxuXHJcbi8qIDUuIEZvb3RlclxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4vLyAkZm9vdGVyLWJnLWNvbG9yOiAgICMwMDA7XHJcbiRmb290ZXItY29sb3ItbGluazogcmdiYSgwLCAwLCAwLCAuNik7XHJcbiRmb290ZXItY29sb3I6ICAgICAgcmdiYSgwLCAwLCAwLCAuNDQpO1xyXG5cclxuXHJcbi8qIDYuIENvZGUgU3ludGF4XHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRjb2RlLWJnLWNvbG9yOiAgICAgICAjZjdmN2Y3O1xyXG4kZm9udC1zaXplLWNvZGU6ICAgICAgMC45Mzc1cmVtO1xyXG4kY29kZS1jb2xvcjogICAgICAgICNjNzI1NGU7XHJcbiRwcmUtY29kZS1jb2xvcjogICAgICAgICMzNzQ3NGY7XHJcblxyXG5cclxuLyogNy4gYnV0dG9uc1xyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4kYnRuLXByaW1hcnktY29sb3I6ICAgICAgICRwcmltYXJ5LWNvbG9yO1xyXG4kYnRuLXNlY29uZGFyeS1jb2xvcjogICAgICMwMzliZTU7XHJcbiRidG4tYmFja2dyb3VuZC1jb2xvcjogICAgI2UxZjNmYztcclxuJGJ0bi1hY3RpdmUtYmFja2dyb3VuZDogICAjYzNlN2Y5O1xyXG5cclxuLyogOC4gY29udGFpbmVyXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG4kZ3JpZC1ndXR0ZXItd2lkdGg6ICAgICAgICAxLjg3NXJlbTsgLy8gMzBweFxyXG5cclxuJGNvbnRhaW5lci1zbTogICAgICAgICAgICAgNTc2cHg7XHJcbiRjb250YWluZXItbWQ6ICAgICAgICAgICAgIDc1MHB4O1xyXG4kY29udGFpbmVyLWxnOiAgICAgICAgICAgICA5NzBweDtcclxuJGNvbnRhaW5lci14bDogICAgICAgICAgICAgMTI1MHB4O1xyXG5cclxuXHJcbi8qIDkuIEdyaWRcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuJG51bS1jb2xzOiAxMjtcclxuJGd1dHRlci13aWR0aDogMS44NzVyZW07XHJcbiRlbGVtZW50LXRvcC1tYXJnaW46ICRndXR0ZXItd2lkdGgvMztcclxuJGVsZW1lbnQtYm90dG9tLW1hcmdpbjogKCRndXR0ZXItd2lkdGgqMikvMztcclxuXHJcblxyXG4vKiAxMC4gTWVkaWEgUXVlcnkgUmFuZ2VzXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRzbTogICAgICAgICAgICA2NDBweDtcclxuJG1kOiAgICAgICAgICAgIDc2NnB4O1xyXG4kbGc6ICAgICAgICAgICAgOTkycHg7XHJcbiR4bDogICAgICAgICAgICAxMjMwcHg7XHJcblxyXG4kc20tYW5kLXVwOiAgICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aCA6ICN7JHNtfSlcIjtcclxuJG1kLWFuZC11cDogICAgIFwib25seSBzY3JlZW4gYW5kIChtaW4td2lkdGggOiAjeyRtZH0pXCI7XHJcbiRsZy1hbmQtdXA6ICAgICBcIm9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoIDogI3skbGd9KVwiO1xyXG4keGwtYW5kLXVwOiAgICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aCA6ICN7JHhsfSlcIjtcclxuXHJcbiRzbS1hbmQtZG93bjogICBcIm9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoIDogI3skc219KVwiO1xyXG4kbWQtYW5kLWRvd246ICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aCA6ICN7JG1kfSlcIjtcclxuJGxnLWFuZC1kb3duOiAgIFwib25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGggOiAjeyRsZ30pXCI7XHJcblxyXG5cclxuLyogMTEuIGljb25zXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbiRpLW9wZW5faW5fbmV3OiAgICAgICdcXGU4OWUnO1xyXG4kaS13YXJuaW5nOiAgICAgICAgICAnXFxlMDAyJztcclxuJGktc3RhcjogICAgICAgICAgICAgJ1xcZTgzOCc7XHJcbiRpLWRvd25sb2FkOiAgICAgICAgICdcXGU5MDAnO1xyXG4kaS1jbG91ZF9kb3dubG9hZDogICAnXFxlMmMwJztcclxuJGktY2hlY2tfY2lyY2xlOiAgICAgJ1xcZTg2Yyc7XHJcbiRpLXBsYXk6ICAgICAgIFwiXFxlOTAxXCI7XHJcbiRpLWNvZGU6ICAgICAgIFwiXFxmMTIxXCI7XHJcbiRpLWNsb3NlOiAgICAgIFwiXFxlNWNkXCI7XHJcbiIsIi8vIGJveC1zaGFkb3dcbiVwcmltYXJ5LWJveC1zaGFkb3cge1xuICBib3gtc2hhZG93OiAwIDAgNHB4IHJnYmEoMCwgMCwgMCwgLjE0KSwgMCA0cHggOHB4IHJnYmEoMCwgMCwgMCwgLjI4KTtcbn1cblxuJWZvbnQtaWNvbnMge1xuICBmb250LWZhbWlseTogJ21hcGFjaGUnICFpbXBvcnRhbnQ7XG4gIHNwZWFrOiBub25lO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtdmFyaWFudDogbm9ybWFsO1xuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbiAgbGluZS1oZWlnaHQ6IDE7XG5cbiAgLyogQmV0dGVyIEZvbnQgUmVuZGVyaW5nID09PT09PT09PT09ICovXG4gIC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xuICAtbW96LW9zeC1mb250LXNtb290aGluZzogZ3JheXNjYWxlO1xufVxuXG4vLyAgQ2xlYXIgYm90aFxuLnUtY2xlYXIge1xuICAmOjphZnRlciB7XG4gICAgY2xlYXI6IGJvdGg7XG4gICAgY29udGVudDogXCJcIjtcbiAgICBkaXNwbGF5OiB0YWJsZTtcbiAgfVxufVxuXG4udS1ub3QtYXZhdGFyIHsgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi9pbWFnZXMvYXZhdGFyLnBuZycpIH1cbi51LXJlbGF0aXZlIHsgcG9zaXRpb246IHJlbGF0aXZlIH1cbi51LWJsb2NrIHsgZGlzcGxheTogYmxvY2sgfVxuXG4udS1hYnNvbHV0ZTAge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDA7XG4gIHRvcDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbn1cblxuLnUtYmctY292ZXIge1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG59XG5cbi51LWJnLWdyYWRpZW50IHtcbiAgYmFja2dyb3VuZDogLXdlYmtpdC1ncmFkaWVudChsaW5lYXIsIGxlZnQgdG9wLCBsZWZ0IGJvdHRvbSwgZnJvbShyZ2JhKDAsIDAsIDAsIDAuMSkpLCB0byhyZ2JhKDAsIDAsIDAsIDAuOCkpKTtcbn1cblxuLy8gYm9yZGVyLVxuLnUtYm9yZGVyLWJvdHRvbS1kYXJrIHsgYm9yZGVyLWJvdHRvbTogc29saWQgMXB4ICMwMDA7IH1cbi51LWItdCB7IGJvcmRlci10b3A6IHNvbGlkIDFweCAjZWVlOyB9XG5cbi8vIFBhZGRpbmdcbi51LXAtdC0yIHsgcGFkZGluZy10b3A6IDJyZW0gfVxuXG4vLyBFbGltaW5hciBsYSBsaXN0YSBkZSBsYSA8dWw+XG4udS11bnN0eWxlZCB7XG4gIGxpc3Qtc3R5bGUtdHlwZTogbm9uZTtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nLWxlZnQ6IDA7XG59XG5cbi51LWZsb2F0TGVmdCB7IGZsb2F0OiBsZWZ0ICFpbXBvcnRhbnQ7IH1cbi51LWZsb2F0UmlnaHQgeyBmbG9hdDogcmlnaHQgIWltcG9ydGFudDsgfVxuXG4vLyAgZmxleCBib3hcbi51LWZsZXggeyBkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogcm93OyB9XG4udS1mbGV4LXdyYXAgeyBkaXNwbGF5OiBmbGV4OyBmbGV4LXdyYXA6IHdyYXA7IH1cbi51LWZsZXgtY2VudGVyIHsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsgfVxuLnUtZmxleC1hbGluZy1yaWdodCB7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7IH1cbi51LWZsZXgtYWxpbmctY2VudGVyIHsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47IH1cblxuLy8gbWFyZ2luXG4udS1tLXQtMSB7IG1hcmdpbi10b3A6IDFyZW0gfVxuXG4vKiBUYWdzXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLnUtdGFncyB7XG4gIGZvbnQtc2l6ZTogMTJweCAhaW1wb3J0YW50O1xuICBtYXJnaW46IDNweCAhaW1wb3J0YW50O1xuICBjb2xvcjogIzRjNTc2NSAhaW1wb3J0YW50O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWJlYmViICFpbXBvcnRhbnQ7XG4gIHRyYW5zaXRpb246IGFsbCAuM3M7XG5cbiAgJjo6YmVmb3JlIHtcbiAgICBwYWRkaW5nLXJpZ2h0OiA1cHg7XG4gICAgb3BhY2l0eTogLjg7XG4gIH1cblxuICAmOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkcHJpbWFyeS1jb2xvciAhaW1wb3J0YW50O1xuICAgIGNvbG9yOiAjZmZmICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuLnUtdGV4dFVwcGVyY2FzZSB7IHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2UgfVxuXG4vLyBPbmx5IDEgdGFnc1xuLnUtdGFnIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHByaW1hcnktY29sb3I7XG4gIGNvbG9yOiAjZmZmO1xuICBwYWRkaW5nOiA0cHggMTJweDtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG59XG5cbi8vIGhpZGUgZ2xvYmFsXG4udS1oaWRlIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50IH1cblxuLnUtY2FyZC1zaGFkb3cge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICBib3gtc2hhZG93OiAwIDVweCA1cHggcmdiYSgwLCAwLCAwLCAuMDIpO1xufVxuXG4udS1ub3QtaW1hZ2Uge1xuICBiYWNrZ3JvdW5kLXJlcGVhdDogcmVwZWF0O1xuICBiYWNrZ3JvdW5kLXNpemU6IGluaXRpYWwgIWltcG9ydGFudDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbn1cblxuLy8gaGlkZSBiZWZvcmVcbkBtZWRpYSAjeyRtZC1hbmQtZG93bn0geyAudS1oLWItbWQgeyBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQgfSB9XG5cbkBtZWRpYSAjeyRsZy1hbmQtZG93bn0geyAudS1oLWItbGcgeyBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQgfSB9XG5cbi8vIGhpZGUgYWZ0ZXJcbkBtZWRpYSAjeyRtZC1hbmQtdXB9IHsgLnUtaC1hLW1kIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50IH0gfVxuXG5AbWVkaWEgI3skbGctYW5kLXVwfSB7IC51LWgtYS1sZyB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudCB9IH1cbiIsImh0bWwge1xyXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgLy8gU2V0cyBhIHNwZWNpZmljIGRlZmF1bHQgYGZvbnQtc2l6ZWAgZm9yIHVzZXIgd2l0aCBgcmVtYCB0eXBlIHNjYWxlcy5cclxuICBmb250LXNpemU6ICRmb250LXNpemUtcm9vdDtcclxuICAvLyBDaGFuZ2VzIHRoZSBkZWZhdWx0IHRhcCBoaWdobGlnaHQgdG8gYmUgY29tcGxldGVseSB0cmFuc3BhcmVudCBpbiBpT1MuXHJcbiAgLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yOiByZ2JhKDAsIDAsIDAsIDApO1xyXG59XHJcblxyXG4qLFxyXG4qOjpiZWZvcmUsXHJcbio6OmFmdGVyIHtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG5hIHtcclxuICBjb2xvcjogJGxpbmstY29sb3I7XHJcbiAgb3V0bGluZTogMDtcclxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgLy8gR2V0cyByaWQgb2YgdGFwIGFjdGl2ZSBzdGF0ZVxyXG4gIC13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcblxyXG4gICY6Zm9jdXMge1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgLy8gYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcbiAgfVxyXG5cclxuICAmLmV4dGVybmFsIHtcclxuICAgICY6OmFmdGVyIHtcclxuICAgICAgQGV4dGVuZCAlZm9udC1pY29ucztcclxuXHJcbiAgICAgIGNvbnRlbnQ6ICRpLW9wZW5faW5fbmV3O1xyXG4gICAgICBtYXJnaW4tbGVmdDogNXB4O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuYm9keSB7XHJcbiAgLy8gTWFrZSB0aGUgYGJvZHlgIHVzZSB0aGUgYGZvbnQtc2l6ZS1yb290YFxyXG4gIGNvbG9yOiAkcHJpbWFyeS10ZXh0LWNvbG9yO1xyXG4gIGZvbnQtZmFtaWx5OiAkcHJpbWFyeS1mb250O1xyXG4gIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1iYXNlO1xyXG4gIGxpbmUtaGVpZ2h0OiAkbGluZS1oZWlnaHQ7XHJcbiAgbWFyZ2luOiAwIGF1dG87XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTtcclxufVxyXG5cclxuZmlndXJlIHsgbWFyZ2luOiAwOyB9XHJcblxyXG5pbWcge1xyXG4gIGhlaWdodDogYXV0bztcclxuICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcclxuICB3aWR0aDogYXV0bztcclxuXHJcbiAgJjpub3QoW3NyY10pIHtcclxuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcclxuICB9XHJcbn1cclxuXHJcbi5pbWctcmVzcG9uc2l2ZSB7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDogYXV0bztcclxufVxyXG5cclxuaSB7XHJcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XHJcbn1cclxuXHJcbmhyIHtcclxuICBiYWNrZ3JvdW5kOiAjRjFGMkYxO1xyXG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwjRjFGMkYxIDAsI2I1YjViNSA1MCUsI0YxRjJGMSAxMDAlKTtcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgaGVpZ2h0OiAxcHg7XHJcbiAgbWFyZ2luOiA4MHB4IGF1dG87XHJcbiAgbWF4LXdpZHRoOiA5MCU7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG5cclxuICAmOjpiZWZvcmUge1xyXG4gICAgYmFja2dyb3VuZDogI2ZmZjtcclxuICAgIGNvbG9yOiByZ2JhKDczLDU1LDY1LC43NSk7XHJcbiAgICBjb250ZW50OiAkaS1jb2RlO1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBmb250LXNpemU6IDM1cHg7XHJcbiAgICBsZWZ0OiA1MCU7XHJcbiAgICBwYWRkaW5nOiAwIDI1cHg7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDUwJTtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsLTUwJSk7XHJcbiAgICBAZXh0ZW5kICVmb250LWljb25zO1xyXG4gIH1cclxufVxyXG5cclxuYmxvY2txdW90ZSB7XHJcbiAgYm9yZGVyLWxlZnQ6IDRweCBzb2xpZCAkcHJpbWFyeS1jb2xvcjtcclxuICBwYWRkaW5nOiAuNzVyZW0gMS41cmVtO1xyXG4gIGJhY2tncm91bmQ6ICNmYmZiZmM7XHJcbiAgY29sb3I6ICM3NTc1NzU7XHJcbiAgZm9udC1zaXplOiAkYmxvY2txdW90ZS1mb250LXNpemU7XHJcbiAgbGluZS1oZWlnaHQ6IDEuNztcclxuICBtYXJnaW46IDAgMCAxLjI1cmVtO1xyXG4gIHF1b3Rlczogbm9uZTtcclxufVxyXG5cclxub2wsdWwsYmxvY2txdW90ZSB7XHJcbiAgbWFyZ2luLWxlZnQ6IDJyZW07XHJcbn1cclxuXHJcbnN0cm9uZyB7XHJcbiAgZm9udC13ZWlnaHQ6IDUwMDtcclxufVxyXG5cclxuc21hbGwsIC5zbWFsbCB7XHJcbiAgZm9udC1zaXplOiA4NSU7XHJcbn1cclxuXHJcbm9sIHtcclxuICBwYWRkaW5nLWxlZnQ6IDQwcHg7XHJcbiAgbGlzdC1zdHlsZTogZGVjaW1hbCBvdXRzaWRlO1xyXG59XHJcblxyXG5tYXJrIHtcclxuICAvLyBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCBsaWdodGVuKCRwcmltYXJ5LWNvbG9yLCAzNSUpLCBsaWdodGVuKCRwcmltYXJ5LWNvbG9yLCAzMCUpKTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmRmZmI2O1xyXG59XHJcblxyXG4uZm9vdGVyLFxyXG4ubWFpbiB7XHJcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC41cyBlYXNlO1xyXG4gIHotaW5kZXg6IDI7XHJcbn1cclxuXHJcbi8vIC5tYXBhY2hlLWZhY2Vib29rIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50OyB9XHJcblxyXG4vKiBDb2RlIFN5bnRheFxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5rYmQsc2FtcCxjb2RlIHtcclxuICBmb250LWZhbWlseTogJGNvZGUtZm9udCAhaW1wb3J0YW50O1xyXG4gIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1jb2RlO1xyXG4gIGNvbG9yOiAkY29kZS1jb2xvcjtcclxuICBiYWNrZ3JvdW5kOiAkY29kZS1iZy1jb2xvcjtcclxuICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgcGFkZGluZzogNHB4IDZweDtcclxuICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XHJcbn1cclxuXHJcbmNvZGVbY2xhc3MqPWxhbmd1YWdlLV0sXHJcbnByZVtjbGFzcyo9bGFuZ3VhZ2UtXSB7XHJcbiAgY29sb3I6ICRwcmUtY29kZS1jb2xvcjtcclxuICBsaW5lLWhlaWdodDogMS41O1xyXG5cclxuICAudG9rZW4uY29tbWVudCB7IG9wYWNpdHk6IC44OyB9XHJcblxyXG4gICYubGluZS1udW1iZXJzIHtcclxuICAgIHBhZGRpbmctbGVmdDogNThweDtcclxuXHJcbiAgICAmOjpiZWZvcmUge1xyXG4gICAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgIGxlZnQ6IDA7XHJcbiAgICAgIHRvcDogMDtcclxuICAgICAgYmFja2dyb3VuZDogI0YwRURFRTtcclxuICAgICAgd2lkdGg6IDQwcHg7XHJcbiAgICAgIGhlaWdodDogMTAwJTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC5saW5lLW51bWJlcnMtcm93cyB7XHJcbiAgICBib3JkZXItcmlnaHQ6IG5vbmU7XHJcbiAgICB0b3A6IC0zcHg7XHJcbiAgICBsZWZ0OiAtNThweDtcclxuXHJcbiAgICAmID4gc3Bhbjo6YmVmb3JlIHtcclxuICAgICAgcGFkZGluZy1yaWdodDogMDtcclxuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICBvcGFjaXR5OiAuODtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbnByZSB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogJGNvZGUtYmctY29sb3IhaW1wb3J0YW50O1xyXG4gIHBhZGRpbmc6IDFyZW07XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgd29yZC13cmFwOiBub3JtYWw7XHJcbiAgbWFyZ2luOiAyLjVyZW0gMCFpbXBvcnRhbnQ7XHJcbiAgZm9udC1mYW1pbHk6ICRjb2RlLWZvbnQgIWltcG9ydGFudDtcclxuICBmb250LXNpemU6ICRmb250LXNpemUtY29kZTtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcblxyXG4gIGNvZGUge1xyXG4gICAgY29sb3I6ICRwcmUtY29kZS1jb2xvcjtcclxuICAgIHRleHQtc2hhZG93OiAwIDFweCAjZmZmO1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gIH1cclxufVxyXG5cclxuLyogLndhcm5pbmcgJiAubm90ZSAmIC5zdWNjZXNzXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi53YXJuaW5nIHtcclxuICBiYWNrZ3JvdW5kOiAjZmJlOWU3O1xyXG4gIGNvbG9yOiAjZDUwMDAwO1xyXG4gICY6YmVmb3Jle2NvbnRlbnQ6ICRpLXdhcm5pbmc7fVxyXG59XHJcblxyXG4ubm90ZXtcclxuICBiYWNrZ3JvdW5kOiAjZTFmNWZlO1xyXG4gIGNvbG9yOiAjMDI4OGQxO1xyXG4gICY6YmVmb3Jle2NvbnRlbnQ6ICRpLXN0YXI7fVxyXG59XHJcblxyXG4uc3VjY2Vzc3tcclxuICBiYWNrZ3JvdW5kOiAjZTBmMmYxO1xyXG4gIGNvbG9yOiAjMDA4OTdiO1xyXG4gICY6YmVmb3Jle2NvbnRlbnQ6ICRpLWNoZWNrX2NpcmNsZTtjb2xvcjogIzAwYmZhNTt9XHJcbn1cclxuXHJcbi53YXJuaW5nLCAubm90ZSwgLnN1Y2Nlc3N7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbiAgbWFyZ2luOiAxcmVtIDA7XHJcbiAgZm9udC1zaXplOiAxcmVtO1xyXG4gIHBhZGRpbmc6IDEycHggMjRweCAxMnB4IDYwcHg7XHJcbiAgbGluZS1oZWlnaHQ6IDEuNTtcclxuICBhe1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XHJcbiAgICBjb2xvcjogaW5oZXJpdDtcclxuICB9XHJcbiAgJjpiZWZvcmV7XHJcbiAgICBtYXJnaW4tbGVmdDogLTM2cHg7XHJcbiAgICBmbG9hdDogbGVmdDtcclxuICAgIGZvbnQtc2l6ZTogMjRweDtcclxuICAgIEBleHRlbmQgJWZvbnQtaWNvbnM7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLyogU29jaWFsIGljb24gY29sb3IgYW5kIGJhY2tncm91bmRcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuQGVhY2ggJHNvY2lhbC1uYW1lLCAkY29sb3IgaW4gJHNvY2lhbC1jb2xvcnMge1xyXG4gIC5jLSN7JHNvY2lhbC1uYW1lfXtcclxuICAgIGNvbG9yOiAkY29sb3I7XHJcbiAgfVxyXG4gIC5iZy0jeyRzb2NpYWwtbmFtZX17XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkY29sb3IgIWltcG9ydGFudDtcclxuICB9XHJcbn1cclxuXHJcbi8vICBDbGVhciBib3RoXHJcbi5jbGVhcntcclxuICAmOmFmdGVyIHtcclxuICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICBkaXNwbGF5OiB0YWJsZTtcclxuICAgIGNsZWFyOiBib3RoO1xyXG4gIH1cclxufVxyXG5cclxuLyogcGFnaW5hdGlvbiBJbmZpbml0ZSBzY3JvbGxcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLm1hcGFjaGUtbG9hZC1tb3Jle1xyXG4gIGJvcmRlcjogc29saWQgMXB4ICNDM0MzQzM7XHJcbiAgY29sb3I6ICM3RDdEN0Q7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbiAgZm9udC1zaXplOiAxNXB4O1xyXG4gIGhlaWdodDogNDVweDtcclxuICBtYXJnaW46IDRyZW0gYXV0bztcclxuICBwYWRkaW5nOiAxMXB4IDE2cHg7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICB3aWR0aDogMTAwJTtcclxuXHJcbiAgJjpob3ZlcntcclxuICAgIGJhY2tncm91bmQ6ICRwcmltYXJ5LWNvbG9yO1xyXG4gICAgYm9yZGVyLWNvbG9yOiAkcHJpbWFyeS1jb2xvcjtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gIH1cclxufVxyXG5cclxuLy8gLnBhZ2luYXRpb24gbmF2XHJcbi5wYWdpbmF0aW9uLW5hdntcclxuICBwYWRkaW5nOiAyLjVyZW0gMCAzcmVtO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAucGFnZS1udW1iZXJ7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgcGFkZGluZy10b3A6IDVweDtcclxuICAgIEBtZWRpYSAjeyRtZC1hbmQtdXB9e2Rpc3BsYXk6IGlubGluZS1ibG9jazt9XHJcbiAgfVxyXG4gIC5uZXdlci1wb3N0c3tcclxuICAgIGZsb2F0OiBsZWZ0O1xyXG4gIH1cclxuICAub2xkZXItcG9zdHN7XHJcbiAgICBmbG9hdDogcmlnaHRcclxuICB9XHJcbn1cclxuXHJcbi8qIFNjcm9sbCBUb3BcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLnNjcm9sbF90b3B7XHJcbiAgYm90dG9tOiA1MHB4O1xyXG4gIHBvc2l0aW9uOiBmaXhlZDtcclxuICByaWdodDogMjBweDtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgei1pbmRleDogMTE7XHJcbiAgd2lkdGg6IDYwcHg7XHJcbiAgb3BhY2l0eTogMDtcclxuICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2U7XHJcblxyXG4gICYudmlzaWJsZXtcclxuICAgIG9wYWNpdHk6IDE7XHJcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xyXG4gIH1cclxuXHJcbiAgJjpob3ZlciBzdmcgcGF0aCB7XHJcbiAgICBmaWxsOiByZ2JhKDAsMCwwLC42KTtcclxuICB9XHJcbn1cclxuXHJcbi8vIHN2ZyBhbGwgaWNvbnNcclxuLnN2Zy1pY29uIHN2ZyB7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgaGVpZ2h0OiBhdXRvO1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIGZpbGw6IGN1cnJlbnRjb2xvcjtcclxufVxyXG5cclxuLyogVmlkZW8gUmVzcG9uc2l2ZVxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4udmlkZW8tcmVzcG9uc2l2ZXtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbiAgaGVpZ2h0OiAwO1xyXG4gIHBhZGRpbmc6IDA7XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICBwYWRkaW5nLWJvdHRvbTogNTYuMjUlO1xyXG4gIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcclxuICBpZnJhbWV7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBib3JkZXI6IDA7XHJcbiAgfVxyXG59XHJcblxyXG4vKiBWaWRlbyBmdWxsIGZvciB0YWcgdmlkZW9cclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuI3ZpZGVvLWZvcm1hdHtcclxuICAudmlkZW8tY29udGVudHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogMXJlbTtcclxuICAgIHNwYW57XHJcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcclxuICAgICAgbWFyZ2luLXJpZ2h0OiAuOHJlbTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qIFBhZ2UgZXJyb3IgNDA0XHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5lcnJvclBhZ2V7XHJcbiAgZm9udC1mYW1pbHk6ICdSb2JvdG8gTW9ubycsIG1vbm9zcGFjZTtcclxuICBoZWlnaHQ6IDEwMHZoO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB3aWR0aDogMTAwJTtcclxuXHJcbiAgJi10aXRsZXtcclxuICAgIHBhZGRpbmc6IDI0cHggNjBweDtcclxuICB9XHJcblxyXG4gICYtbGlua3tcclxuICAgIGNvbG9yOiByZ2JhKDAsMCwwLDAuNTQpO1xyXG4gICAgZm9udC1zaXplOiAyMnB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICAgIGxlZnQ6IC01cHg7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB0ZXh0LXJlbmRlcmluZzogb3B0aW1pemVMZWdpYmlsaXR5O1xyXG4gICAgdG9wOiAtNnB4O1xyXG4gIH1cclxuXHJcbiAgJi1lbW9qaXtcclxuICAgIGNvbG9yOiByZ2JhKDAsMCwwLDAuNCk7XHJcbiAgICBmb250LXNpemU6IDE1MHB4O1xyXG4gIH1cclxuXHJcbiAgJi10ZXh0e1xyXG4gICAgY29sb3I6IHJnYmEoMCwwLDAsMC40KTtcclxuICAgIGxpbmUtaGVpZ2h0OiAyMXB4O1xyXG4gICAgbWFyZ2luLXRvcDogNjBweDtcclxuICAgIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcclxuICB9XHJcblxyXG4gICYtd3JhcHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgbGVmdDogNTAlO1xyXG4gICAgbWluLXdpZHRoOiA2ODBweDtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIHRvcDogNTAlO1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwtNTAlKTtcclxuICB9XHJcbn1cclxuXHJcbi8qIFBvc3QgVHdpdHRlciBmYWNlYm9vayBjYXJkIGVtYmVkIENzcyBDZW50ZXJcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLnBvc3Qge1xyXG4gIGlmcmFtZVtzcmMqPVwiZmFjZWJvb2suY29tXCJdLFxyXG4gIC5mYi1wb3N0LFxyXG4gIC50d2l0dGVyLXR3ZWV0IHtcclxuICAgIGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XHJcbiAgICBtYXJnaW46IDEuNXJlbSAwICFpbXBvcnRhbnQ7XHJcbiAgfVxyXG59XHJcbiIsIi5jb250YWluZXIge1xyXG4gIG1hcmdpbjogMCBhdXRvO1xyXG4gIHBhZGRpbmctbGVmdDogKCRncmlkLWd1dHRlci13aWR0aCAvIDIpO1xyXG4gIHBhZGRpbmctcmlnaHQ6ICgkZ3JpZC1ndXR0ZXItd2lkdGggLyAyKTtcclxuICB3aWR0aDogMTAwJTtcclxuICBtYXgtd2lkdGg6ICRjb250YWluZXIteGw7XHJcblxyXG4gIC8vIEBtZWRpYSAjeyRzbS1hbmQtdXB9e21heC13aWR0aDogJGNvbnRhaW5lci1zbTt9XHJcbiAgLy8gQG1lZGlhICN7JG1kLWFuZC11cH17bWF4LXdpZHRoOiAkY29udGFpbmVyLW1kO31cclxuICAvLyBAbWVkaWEgI3skbGctYW5kLXVwfXttYXgtd2lkdGg6ICRjb250YWluZXItbGc7fVxyXG4gIC8vIEBtZWRpYSAjeyRsZy1hbmQtdXB9IHsgIH1cclxufVxyXG5cclxuLm1hcmdpbi10b3Age1xyXG4gIG1hcmdpbi10b3A6ICRoZWFkZXItaGVpZ2h0O1xyXG4gIHBhZGRpbmctdG9wOiAxcmVtO1xyXG5cclxuICBAbWVkaWEgI3skbWQtYW5kLXVwfSB7IHBhZGRpbmctdG9wOiAxLjhyZW0gfVxyXG59XHJcblxyXG5AbWVkaWEgI3skbWQtYW5kLXVwfSB7XHJcbiAgLmNvbnRlbnQge1xyXG4gICAgZmxleC1iYXNpczogNjkuNjY2NjY2NjclICFpbXBvcnRhbnQ7XHJcbiAgICBtYXgtd2lkdGg6IDY5LjY2NjY2NjY3JSAhaW1wb3J0YW50O1xyXG4gICAgLy8gZmxleDogMSAhaW1wb3J0YW50O1xyXG4gICAgLy8gbWF4LXdpZHRoOiBjYWxjKDEwMCUgLSAzMDBweCkgIWltcG9ydGFudDtcclxuICAgIC8vIG9yZGVyOiAxO1xyXG4gICAgLy8gb3ZlcmZsb3c6IGhpZGRlbjtcclxuICB9XHJcblxyXG4gIC5zaWRlYmFyIHtcclxuICAgIGZsZXgtYmFzaXM6IDMwLjMzMzMzMzMzJSAhaW1wb3J0YW50O1xyXG4gICAgbWF4LXdpZHRoOiAzMC4zMzMzMzMzMyUgIWltcG9ydGFudDtcclxuICAgIC8vIGZsZXg6IDAgMCAzMzBweCAhaW1wb3J0YW50O1xyXG4gICAgLy8gb3JkZXI6IDI7XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgI3skeGwtYW5kLXVwfSB7XHJcbiAgLmNvbnRlbnQgeyBwYWRkaW5nLXJpZ2h0OiA0MHB4ICFpbXBvcnRhbnQgfVxyXG59XHJcblxyXG5AbWVkaWEgI3skbGctYW5kLXVwfSB7XHJcbiAgLmZlZWQtZW50cnktd3JhcHBlciB7XHJcbiAgICAuZW50cnktaW1hZ2Uge1xyXG4gICAgICB3aWR0aDogNDAlICFpbXBvcnRhbnQ7XHJcbiAgICAgIG1heC13aWR0aDogNDAlICFpbXBvcnRhbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLmVudHJ5LWJvZHkge1xyXG4gICAgICB3aWR0aDogNjAlICFpbXBvcnRhbnQ7XHJcbiAgICAgIG1heC13aWR0aDogNjAlICFpbXBvcnRhbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgI3skbGctYW5kLWRvd259IHtcclxuICBib2R5LmlzLWFydGljbGUgLmNvbnRlbnQge1xyXG4gICAgbWF4LXdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcbiAgfVxyXG59XHJcblxyXG4ucm93IHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXg6IDAgMSBhdXRvO1xyXG4gIGZsZXgtZmxvdzogcm93IHdyYXA7XHJcbiAgLy8gbWFyZ2luOiAtOHB4O1xyXG5cclxuICBtYXJnaW4tbGVmdDogLSAkZ3V0dGVyLXdpZHRoIC8gMjtcclxuICBtYXJnaW4tcmlnaHQ6IC0gJGd1dHRlci13aWR0aCAvIDI7XHJcblxyXG4gIC8vIC8vIENsZWFyIGZsb2F0aW5nIGNoaWxkcmVuXHJcbiAgLy8gJjphZnRlciB7XHJcbiAgLy8gIGNvbnRlbnQ6IFwiXCI7XHJcbiAgLy8gIGRpc3BsYXk6IHRhYmxlO1xyXG4gIC8vICBjbGVhcjogYm90aDtcclxuICAvLyB9XHJcblxyXG4gIC5jb2wge1xyXG4gICAgLy8gZmxvYXQ6IGxlZnQ7XHJcbiAgICAvLyBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgZmxleDogMCAwIGF1dG87XHJcbiAgICBwYWRkaW5nLWxlZnQ6ICRndXR0ZXItd2lkdGggLyAyO1xyXG4gICAgcGFkZGluZy1yaWdodDogJGd1dHRlci13aWR0aCAvIDI7XHJcblxyXG4gICAgJGk6IDE7XHJcblxyXG4gICAgQHdoaWxlICRpIDw9ICRudW0tY29scyB7XHJcbiAgICAgICRwZXJjOiB1bnF1b3RlKCgxMDAgLyAoJG51bS1jb2xzIC8gJGkpKSArIFwiJVwiKTtcclxuXHJcbiAgICAgICYucyN7JGl9IHtcclxuICAgICAgICAvLyB3aWR0aDogJHBlcmM7XHJcbiAgICAgICAgZmxleC1iYXNpczogJHBlcmM7XHJcbiAgICAgICAgbWF4LXdpZHRoOiAkcGVyYztcclxuICAgICAgfVxyXG4gICAgICAkaTogJGkgKyAxO1xyXG4gICAgfVxyXG5cclxuICAgIEBtZWRpYSAjeyRtZC1hbmQtdXB9IHtcclxuXHJcbiAgICAgICRpOiAxO1xyXG5cclxuICAgICAgQHdoaWxlICRpIDw9ICRudW0tY29scyB7XHJcbiAgICAgICAgJHBlcmM6IHVucXVvdGUoKDEwMCAvICgkbnVtLWNvbHMgLyAkaSkpICsgXCIlXCIpO1xyXG5cclxuICAgICAgICAmLm0jeyRpfSB7XHJcbiAgICAgICAgICAvLyB3aWR0aDogJHBlcmM7XHJcbiAgICAgICAgICBmbGV4LWJhc2lzOiAkcGVyYztcclxuICAgICAgICAgIG1heC13aWR0aDogJHBlcmM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRpOiAkaSArIDFcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBtZWRpYSAjeyRsZy1hbmQtdXB9IHtcclxuXHJcbiAgICAgICRpOiAxO1xyXG5cclxuICAgICAgQHdoaWxlICRpIDw9ICRudW0tY29scyB7XHJcbiAgICAgICAgJHBlcmM6IHVucXVvdGUoKDEwMCAvICgkbnVtLWNvbHMgLyAkaSkpICsgXCIlXCIpO1xyXG5cclxuICAgICAgICAmLmwjeyRpfSB7XHJcbiAgICAgICAgICAvLyB3aWR0aDogJHBlcmM7XHJcbiAgICAgICAgICBmbGV4LWJhc2lzOiAkcGVyYztcclxuICAgICAgICAgIG1heC13aWR0aDogJHBlcmM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRpOiAkaSArIDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiXHJcbi8vXHJcbi8vIEhlYWRpbmdzXHJcbi8vXHJcblxyXG5oMSwgaDIsIGgzLCBoNCwgaDUsIGg2LFxyXG4uaDEsIC5oMiwgLmgzLCAuaDQsIC5oNSwgLmg2IHtcclxuICBtYXJnaW4tYm90dG9tOiAkaGVhZGluZ3MtbWFyZ2luLWJvdHRvbTtcclxuICBmb250LWZhbWlseTogJGhlYWRpbmdzLWZvbnQtZmFtaWx5O1xyXG4gIGZvbnQtd2VpZ2h0OiAkaGVhZGluZ3MtZm9udC13ZWlnaHQ7XHJcbiAgbGluZS1oZWlnaHQ6ICRoZWFkaW5ncy1saW5lLWhlaWdodDtcclxuICBjb2xvcjogJGhlYWRpbmdzLWNvbG9yO1xyXG4gIC8vIGxldHRlci1zcGFjaW5nOiAtLjAyZW0gIWltcG9ydGFudDtcclxufVxyXG5cclxuaDEgeyBmb250LXNpemU6ICRmb250LXNpemUtaDE7IH1cclxuaDIgeyBmb250LXNpemU6ICRmb250LXNpemUtaDI7IH1cclxuaDMgeyBmb250LXNpemU6ICRmb250LXNpemUtaDM7IH1cclxuaDQgeyBmb250LXNpemU6ICRmb250LXNpemUtaDQ7IH1cclxuaDUgeyBmb250LXNpemU6ICRmb250LXNpemUtaDU7IH1cclxuaDYgeyBmb250LXNpemU6ICRmb250LXNpemUtaDY7IH1cclxuXHJcbi8vIFRoZXNlIGRlY2xhcmF0aW9ucyBhcmUga2VwdCBzZXBhcmF0ZSBmcm9tIGFuZCBwbGFjZWQgYWZ0ZXJcclxuLy8gdGhlIHByZXZpb3VzIHRhZy1iYXNlZCBkZWNsYXJhdGlvbnMgc28gdGhhdCB0aGUgY2xhc3NlcyBiZWF0IHRoZSB0YWdzIGluXHJcbi8vIHRoZSBDU1MgY2FzY2FkZSwgYW5kIHRodXMgPGgxIGNsYXNzPVwiaDJcIj4gd2lsbCBiZSBzdHlsZWQgbGlrZSBhbiBoMi5cclxuLmgxIHsgZm9udC1zaXplOiAkZm9udC1zaXplLWgxOyB9XHJcbi5oMiB7IGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1oMjsgfVxyXG4uaDMgeyBmb250LXNpemU6ICRmb250LXNpemUtaDM7IH1cclxuLmg0IHsgZm9udC1zaXplOiAkZm9udC1zaXplLWg0OyB9XHJcbi5oNSB7IGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1oNTsgfVxyXG4uaDYgeyBmb250LXNpemU6ICRmb250LXNpemUtaDY7IH1cclxuXHJcbmgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xyXG4gIG1hcmdpbi1ib3R0b206IDFyZW07XHJcbiAgYXtcclxuICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7XHJcbiAgfVxyXG59XHJcblxyXG5wIHtcclxuICBtYXJnaW4tdG9wOiAwO1xyXG4gIG1hcmdpbi1ib3R0b206IDFyZW07XHJcbn1cclxuIiwiLyogTmF2aWdhdGlvbiBNb2JpbGVcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLm5hdi1tb2Ige1xyXG4gIGJhY2tncm91bmQ6ICRwcmltYXJ5LWNvbG9yO1xyXG4gIGNvbG9yOiAjMDAwO1xyXG4gIGhlaWdodDogMTAwdmg7XHJcbiAgbGVmdDogMDtcclxuICBwYWRkaW5nOiAwIDIwcHg7XHJcbiAgcG9zaXRpb246IGZpeGVkO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIHRvcDogMDtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTAwJSk7XHJcbiAgdHJhbnNpdGlvbjogLjRzO1xyXG4gIHdpbGwtY2hhbmdlOiB0cmFuc2Zvcm07XHJcbiAgei1pbmRleDogOTk3O1xyXG5cclxuICBhe1xyXG4gICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgfVxyXG5cclxuICB1bCB7XHJcbiAgICBhe1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICAgICAgcGFkZGluZzogOHB4IDA7XHJcbiAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAmLWNvbnRlbnR7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZWVlO1xyXG4gICAgb3ZlcmZsb3c6IGF1dG87XHJcbiAgICAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzogdG91Y2g7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgcGFkZGluZzogMjBweCAwO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICB0b3A6ICRoZWFkZXItaGVpZ2h0O1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbi5uYXYtbW9iIHVsLFxyXG4ubmF2LW1vYi1zdWJzY3JpYmUsXHJcbi5uYXYtbW9iLWZvbGxvd3tcclxuICBib3JkZXItYm90dG9tOiBzb2xpZCAxcHggI0RERDtcclxuICBwYWRkaW5nOiAwICgkZ3JpZC1ndXR0ZXItd2lkdGggLyAyKSAgMjBweCAoJGdyaWQtZ3V0dGVyLXdpZHRoIC8gMik7XHJcbiAgbWFyZ2luLWJvdHRvbTogMTVweDtcclxufVxyXG5cclxuLyogTmF2aWdhdGlvbiBNb2JpbGUgZm9sbG93XHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5uYXYtbW9iLWZvbGxvd3tcclxuICBhe1xyXG4gICAgZm9udC1zaXplOiAyMHB4ICFpbXBvcnRhbnQ7XHJcbiAgICBtYXJnaW46IDAgMnB4ICFpbXBvcnRhbnQ7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG5cclxuICAgIEBleHRlbmQgLmJ0bjtcclxuICB9XHJcblxyXG4gIEBlYWNoICRzb2NpYWwtbmFtZSwgJGNvbG9yIGluICRzb2NpYWwtY29sb3JzIHtcclxuICAgIC5pLSN7JHNvY2lhbC1uYW1lfXtcclxuICAgICAgY29sb3I6ICNmZmY7XHJcbiAgICAgIEBleHRlbmQgLmJnLSN7JHNvY2lhbC1uYW1lfTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qIENvcHlSaWdoXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5uYXYtbW9iLWNvcHlyaWdodHtcclxuICBjb2xvcjogI2FhYTtcclxuICBmb250LXNpemU6IDEzcHg7XHJcbiAgcGFkZGluZzogMjBweCAxNXB4IDA7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG5cclxuICBhe2NvbG9yOiAkcHJpbWFyeS1jb2xvcn1cclxufVxyXG5cclxuLyogc3Vic2NyaWJlXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5uYXYtbW9iLXN1YnNjcmliZXtcclxuICAuYnRue1xyXG4gICAgYm9yZGVyLXJhZGl1czogMDtcclxuICAgIHRleHQtdHJhbnNmb3JtOiBub25lO1xyXG4gICAgd2lkdGg6IDgwcHg7XHJcbiAgfVxyXG4gIC5mb3JtLWdyb3VwIHt3aWR0aDogY2FsYygxMDAlIC0gODBweCl9XHJcbiAgaW5wdXR7XHJcbiAgICBib3JkZXI6IDA7XHJcbiAgICBib3gtc2hhZG93OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgfVxyXG59XHJcbiIsIi8qIEhlYWRlciBQYWdlXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5oZWFkZXJ7XHJcbiAgYmFja2dyb3VuZDogJHByaW1hcnktY29sb3I7XHJcbiAgLy8gY29sb3I6ICRoZWFkZXItY29sb3I7XHJcbiAgaGVpZ2h0OiAkaGVhZGVyLWhlaWdodDtcclxuICBsZWZ0OiAwO1xyXG4gIHBhZGRpbmctbGVmdDogMXJlbTtcclxuICBwYWRkaW5nLXJpZ2h0OiAxcmVtO1xyXG4gIHBvc2l0aW9uOiBmaXhlZDtcclxuICByaWdodDogMDtcclxuICB0b3A6IDA7XHJcbiAgei1pbmRleDogOTk5O1xyXG5cclxuICAmLXdyYXAgYXsgY29sb3I6ICRoZWFkZXItY29sb3I7fVxyXG5cclxuICAmLWxvZ28sXHJcbiAgJi1mb2xsb3cgYSxcclxuICAmLW1lbnUgYXtcclxuICAgIGhlaWdodDogJGhlYWRlci1oZWlnaHQ7XHJcbiAgICBAZXh0ZW5kIC51LWZsZXgtY2VudGVyO1xyXG4gIH1cclxuXHJcbiAgJi1mb2xsb3csXHJcbiAgJi1zZWFyY2gsXHJcbiAgJi1sb2dve1xyXG4gICAgZmxleDogMCAwIGF1dG87XHJcbiAgfVxyXG5cclxuICAvLyBMb2dvXHJcbiAgJi1sb2dve1xyXG4gICAgei1pbmRleDogOTk4O1xyXG4gICAgZm9udC1zaXplOiAkZm9udC1zaXplLWxnO1xyXG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICAgIGxldHRlci1zcGFjaW5nOiAxcHg7XHJcbiAgICBpbWd7XHJcbiAgICAgIG1heC1oZWlnaHQ6IDM1cHg7XHJcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC5uYXYtbW9iLXRvZ2dsZSxcclxuICAuc2VhcmNoLW1vYi10b2dnbGV7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgei1pbmRleDogOTk4O1xyXG4gIH1cclxuXHJcbiAgLy8gYnRuIG1vYmlsZSBtZW51IG9wZW4gYW5kIGNsb3NlXHJcbiAgLm5hdi1tb2ItdG9nZ2xle1xyXG4gICAgbWFyZ2luLWxlZnQ6IDAgIWltcG9ydGFudDtcclxuICAgIG1hcmdpbi1yaWdodDogLSAoJGdyaWQtZ3V0dGVyLXdpZHRoIC8gMik7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjRzO1xyXG5cclxuICAgIHNwYW4ge1xyXG4gICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGhlYWRlci1jb2xvcjtcclxuICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgaGVpZ2h0OiAycHg7XHJcbiAgICAgICBsZWZ0OiAxNHB4O1xyXG4gICAgICAgbWFyZ2luLXRvcDogLTFweDtcclxuICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgIHRvcDogNTAlO1xyXG4gICAgICAgdHJhbnNpdGlvbjogLjRzO1xyXG4gICAgICAgd2lkdGg6IDIwcHg7XHJcbiAgICAgICAmOmZpcnN0LWNoaWxkIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwtNnB4KTsgfVxyXG4gICAgICAgJjpsYXN0LWNoaWxkIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCw2cHgpOyB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gU2hvZG93IGZvciBoZWFkZXJcclxuICAmLnRvb2xiYXItc2hhZG93eyBAZXh0ZW5kICVwcmltYXJ5LWJveC1zaGFkb3c7IH1cclxuICAmOm5vdCgudG9vbGJhci1zaGFkb3cpIHsgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQhaW1wb3J0YW50OyB9XHJcblxyXG59XHJcblxyXG5cclxuLyogSGVhZGVyIE5hdmlnYXRpb25cclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLmhlYWRlci1tZW51e1xyXG4gIGZsZXg6IDEgMSAwO1xyXG4gIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgdHJhbnNpdGlvbjogZmxleCAuMnMsbWFyZ2luIC4ycyx3aWR0aCAuMnM7XHJcblxyXG4gIHVse1xyXG4gICAgbWFyZ2luLWxlZnQ6IDJyZW07XHJcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG5cclxuICAgIGxpeyBwYWRkaW5nLXJpZ2h0OiAxNXB4OyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fVxyXG5cclxuICAgIGF7XHJcbiAgICAgIHBhZGRpbmc6IDAgOHB4O1xyXG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcblxyXG4gICAgICAmOmJlZm9yZXtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAkaGVhZGVyLWNvbG9yO1xyXG4gICAgICAgIGJvdHRvbTogMDtcclxuICAgICAgICBjb250ZW50OiAnJztcclxuICAgICAgICBoZWlnaHQ6IDJweDtcclxuICAgICAgICBsZWZ0OiAwO1xyXG4gICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgIHRyYW5zaXRpb246IG9wYWNpdHkgLjJzO1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICB9XHJcbiAgICAgICY6aG92ZXI6YmVmb3JlLFxyXG4gICAgICAmLmFjdGl2ZTpiZWZvcmV7XHJcbiAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcbn1cclxuXHJcblxyXG4vKiBoZWFkZXIgc29jaWFsXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5oZWFkZXItZm9sbG93IGEge1xyXG4gIHBhZGRpbmc6IDAgMTBweDtcclxuICAmOmhvdmVye2NvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuODApfVxyXG4gICY6YmVmb3Jle2ZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1sZyAhaW1wb3J0YW50O31cclxuXHJcbn1cclxuXHJcblxyXG5cclxuLyogSGVhZGVyIHNlYXJjaFxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG4uaGVhZGVyLXNlYXJjaHtcclxuICBiYWNrZ3JvdW5kOiAjZWVlO1xyXG4gIGJvcmRlci1yYWRpdXM6IDJweDtcclxuICBkaXNwbGF5OiBub25lO1xyXG4gIC8vIGZsZXg6IDAgMCBhdXRvO1xyXG4gIGhlaWdodDogMzZweDtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgdGV4dC1hbGlnbjogbGVmdDtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIC4ycyxmbGV4IC4ycztcclxuICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xyXG4gIG1hcmdpbi1sZWZ0OiAxLjVyZW07XHJcbiAgbWFyZ2luLXJpZ2h0OiAxLjVyZW07XHJcblxyXG4gIC5zZWFyY2gtaWNvbntcclxuICAgIGNvbG9yOiAjNzU3NTc1O1xyXG4gICAgZm9udC1zaXplOiAyNHB4O1xyXG4gICAgbGVmdDogMjRweDtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMTJweDtcclxuICAgIHRyYW5zaXRpb246IGNvbG9yIC4ycztcclxuICB9XHJcbn1cclxuXHJcbmlucHV0LnNlYXJjaC1maWVsZCB7XHJcbiAgYmFja2dyb3VuZDogMDtcclxuICBib3JkZXI6IDA7XHJcbiAgY29sb3I6ICMyMTIxMjE7XHJcbiAgaGVpZ2h0OiAzNnB4O1xyXG4gIHBhZGRpbmc6IDAgOHB4IDAgNzJweDtcclxuICB0cmFuc2l0aW9uOiBjb2xvciAuMnM7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgJjpmb2N1c3tcclxuICAgIGJvcmRlcjogMDtcclxuICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgfVxyXG59XHJcblxyXG4uc2VhcmNoLXBvcG91dHtcclxuICBiYWNrZ3JvdW5kOiAkaGVhZGVyLWNvbG9yO1xyXG4gIGJveC1zaGFkb3c6IDAgMCAycHggcmdiYSgwLDAsMCwuMTIpLDAgMnB4IDRweCByZ2JhKDAsMCwwLC4yNCksaW5zZXQgMCA0cHggNnB4IC00cHggcmdiYSgwLDAsMCwuMjQpO1xyXG4gIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgbWF4LWhlaWdodDogY2FsYygxMDB2aCAtIDE1MHB4KTtcclxuICAvLyB3aWR0aDogY2FsYygxMDAlICsgMTIwcHgpO1xyXG4gIG1hcmdpbi1sZWZ0OiAtNjRweDtcclxuICBvdmVyZmxvdy15OiBhdXRvO1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAvLyB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjJzLHZpc2liaWxpdHkgLjJzO1xyXG4gIC8vIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxuXHJcbiAgei1pbmRleDogLTE7XHJcblxyXG4gICYuY2xvc2Vke1xyXG4gICAgLy8gdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xMTAlKTtcclxuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcclxuICB9XHJcbn1cclxuXHJcbi5zZWFyY2gtc3VnZ2VzdC1yZXN1bHRze1xyXG4gIHBhZGRpbmc6IDAgOHB4IDAgNzVweDtcclxuXHJcbiAgYXtcclxuICAgIGNvbG9yOiAjMjEyMTIxO1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBtYXJnaW4tbGVmdDogLThweDtcclxuICAgIG91dGxpbmU6IDA7XHJcbiAgICBoZWlnaHQ6IGF1dG87XHJcbiAgICBwYWRkaW5nOiA4cHg7XHJcbiAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIC4ycztcclxuICAgIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1zbTtcclxuICAgICY6Zmlyc3QtY2hpbGR7XHJcbiAgICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgICB9XHJcbiAgICAmOmxhc3QtY2hpbGR7XHJcbiAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbiAgICB9XHJcbiAgICAmOmhvdmVye1xyXG4gICAgICBiYWNrZ3JvdW5kOiAjZjdmN2Y3O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLyogbWVkaWFxdWVyeSBtZWRpdW1cclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbkBtZWRpYSAjeyRsZy1hbmQtdXB9e1xyXG4gIC5oZWFkZXItc2VhcmNoe1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwuMjUpO1xyXG4gICAgYm94LXNoYWRvdzogMCAxcHggMS41cHggcmdiYSgwLDAsMCwwLjA2KSwwIDFweCAxcHggcmdiYSgwLDAsMCwwLjEyKTtcclxuICAgIGNvbG9yOiAkaGVhZGVyLWNvbG9yO1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgd2lkdGg6IDIwMHB4O1xyXG5cclxuICAgICY6aG92ZXJ7XHJcbiAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LDI1NSwyNTUsLjQpO1xyXG4gICAgfVxyXG5cclxuICAgIC5zZWFyY2gtaWNvbnt0b3A6IDBweDt9XHJcblxyXG4gICAgaW5wdXQsIGlucHV0OjpwbGFjZWhvbGRlciwgLnNlYXJjaC1pY29ue2NvbG9yOiAjZmZmO31cclxuXHJcbiAgfVxyXG5cclxuICAuc2VhcmNoLXBvcG91dHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDA7XHJcbiAgfVxyXG5cclxuICAvLyBTaG93IGxhcmdlIHNlYXJjaCBhbmQgdmlzaWJpbGl0eSBoaWRkZW4gaGVhZGVyIG1lbnVcclxuICAuaGVhZGVyLmlzLXNob3dTZWFyY2h7XHJcbiAgICAuaGVhZGVyLXNlYXJjaHtcclxuICAgICAgYmFja2dyb3VuZDogI2ZmZjtcclxuICAgICAgZmxleDogMSAwIGF1dG87XHJcblxyXG4gICAgICAuc2VhcmNoLWljb257Y29sb3I6ICM3NTc1NzUgIWltcG9ydGFudDt9XHJcbiAgICAgIGlucHV0LCBpbnB1dDo6cGxhY2Vob2xkZXIge2NvbG9yOiAjMjEyMTIxICFpbXBvcnRhbnR9XHJcbiAgICB9XHJcbiAgICAuaGVhZGVyLW1lbnV7XHJcbiAgICAgIGZsZXg6IDAgMCBhdXRvO1xyXG4gICAgICBtYXJnaW46IDA7XHJcbiAgICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcclxuICAgICAgd2lkdGg6IDA7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLyogTWVkaWEgUXVlcnlcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbkBtZWRpYSAjeyRsZy1hbmQtZG93bn17XHJcblxyXG4gIC5oZWFkZXItbWVudSB1bHsgZGlzcGxheTogbm9uZTsgfVxyXG5cclxuICAvLyBzaG93IHNlYXJjaCBtb2JpbGVcclxuICAuaGVhZGVyLmlzLXNob3dTZWFyY2hNb2J7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG5cclxuICAgIC5oZWFkZXItbG9nbyxcclxuICAgIC5uYXYtbW9iLXRvZ2dsZXtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgIH1cclxuXHJcbiAgICAuaGVhZGVyLXNlYXJjaHtcclxuICAgICAgYm9yZGVyLXJhZGl1czogMDtcclxuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrICFpbXBvcnRhbnQ7XHJcbiAgICAgIGhlaWdodDogJGhlYWRlci1oZWlnaHQ7XHJcbiAgICAgIG1hcmdpbjogMDtcclxuICAgICAgd2lkdGg6IDEwMCU7XHJcblxyXG4gICAgICBpbnB1dHtcclxuICAgICAgICBoZWlnaHQ6ICRoZWFkZXItaGVpZ2h0O1xyXG4gICAgICAgIHBhZGRpbmctcmlnaHQ6IDQ4cHg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC5zZWFyY2gtcG9wb3V0e21hcmdpbi10b3A6IDA7fVxyXG4gICAgfVxyXG5cclxuICAgIC5zZWFyY2gtbW9iLXRvZ2dsZXtcclxuICAgICAgYm9yZGVyOiAwO1xyXG4gICAgICBjb2xvcjogJGhlYWRlci1zZWFyY2gtY29sb3I7XHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgcmlnaHQ6IDA7XHJcbiAgICAgICY6YmVmb3Jle2NvbnRlbnQ6ICRpLWNsb3NlICFpbXBvcnRhbnQ7fVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIC8vIHNob3cgbWVudSBtb2JpbGVcclxuICBib2R5LmlzLXNob3dOYXZNb2J7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG5cclxuICAgIC5uYXYtbW9ie1xyXG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCk7XHJcbiAgICB9XHJcbiAgICAubmF2LW1vYi10b2dnbGUge1xyXG4gICAgICBib3JkZXI6IDA7XHJcbiAgICAgIHRyYW5zZm9ybTogcm90YXRlKDkwZGVnKTtcclxuICAgICAgc3BhbjpmaXJzdC1jaGlsZCB7IHRyYW5zZm9ybTogcm90YXRlKDQ1ZGVnKSB0cmFuc2xhdGUoMCwwKTt9XHJcbiAgICAgIHNwYW46bnRoLWNoaWxkKDIpIHsgdHJhbnNmb3JtOiBzY2FsZVgoMCk7fVxyXG4gICAgICBzcGFuOmxhc3QtY2hpbGQge3RyYW5zZm9ybTogcm90YXRlKC00NWRlZykgdHJhbnNsYXRlKDAsMCk7fVxyXG4gICAgfVxyXG4gICAgLnNlYXJjaC1tb2ItdG9nZ2xle1xyXG4gICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgfVxyXG5cclxuICAgIC5tYWluLC5mb290ZXJ7XHJcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMjUlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcbiIsIi8vIEhlYWRlciBwb3N0XHJcbi5jb3ZlciB7XHJcbiAgYmFja2dyb3VuZDogJHByaW1hcnktY29sb3I7XHJcbiAgYm94LXNoYWRvdzogMCAwIDRweCByZ2JhKDAsMCwwLC4xNCksMCA0cHggOHB4IHJnYmEoMCwwLDAsLjI4KTtcclxuICBjb2xvcjogI2ZmZjtcclxuICBsZXR0ZXItc3BhY2luZzogLjJweDtcclxuICBtaW4taGVpZ2h0OiA1NTBweDtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgdGV4dC1zaGFkb3c6IDAgMCAxMHB4IHJnYmEoMCwwLDAsLjMzKTtcclxuICB6LWluZGV4OiAyO1xyXG5cclxuICAmLXdyYXAge1xyXG4gICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICBtYXgtd2lkdGg6IDEwNTBweDtcclxuICAgIHBhZGRpbmc6IDE2cHg7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICB6LWluZGV4OiA5OTtcclxuICB9XHJcblxyXG4gICYtdGl0bGUge1xyXG4gICAgZm9udC1zaXplOiAzLjVyZW07XHJcbiAgICBtYXJnaW46IDAgMCA1MHB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICBmb250LXdlaWdodDogNzAwO1xyXG4gIH1cclxuXHJcbiAgJi1kZXNjcmlwdGlvbiB7IG1heC13aWR0aDogNjAwcHg7IH1cclxuXHJcbiAgJi1iYWNrZ3JvdW5kIHsgYmFja2dyb3VuZC1hdHRhY2htZW50OiBmaXhlZCB9XHJcblxyXG4gIC8vICBjb3ZlciBtb3VzZSBzY3JvbGxcclxuICAubW91c2Uge1xyXG4gICAgd2lkdGg6IDI1cHg7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBoZWlnaHQ6IDM2cHg7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxNXB4O1xyXG4gICAgYm9yZGVyOiAycHggc29saWQgIzg4ODtcclxuICAgIGJvcmRlcjogMnB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4yNyk7XHJcbiAgICBib3R0b206IDQwcHg7XHJcbiAgICByaWdodDogNDBweDtcclxuICAgIG1hcmdpbi1sZWZ0OiAtMTJweDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjJzIGVhc2UtaW47XHJcblxyXG4gICAgLnNjcm9sbCB7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICBtYXJnaW46IDZweCBhdXRvO1xyXG4gICAgICB3aWR0aDogM3B4O1xyXG4gICAgICBoZWlnaHQ6IDZweDtcclxuICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNjgpO1xyXG4gICAgICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xyXG4gICAgICBhbmltYXRpb24tbmFtZTogc2Nyb2xsO1xyXG4gICAgICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi5hdXRob3Ige1xyXG4gIGEgeyBjb2xvcjogI0ZGRiAhaW1wb3J0YW50OyB9XHJcblxyXG4gICYtaGVhZGVyIHtcclxuICAgIG1hcmdpbi10b3A6IDEwJTtcclxuICB9XHJcblxyXG4gICYtbmFtZS13cmFwIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICB9XHJcblxyXG4gICYtdGl0bGUge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gIH1cclxuXHJcbiAgJi1uYW1lIHtcclxuICAgIG1hcmdpbjogNXB4IDA7XHJcbiAgICBmb250LXNpemU6IDEuNzVyZW07XHJcbiAgfVxyXG4gICYtYmlvIHtcclxuICAgIG1hcmdpbjogMS41cmVtIDA7XHJcbiAgICBsaW5lLWhlaWdodDogMS44O1xyXG4gICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgbWF4LXdpZHRoOiA3MDBweDtcclxuICB9XHJcblxyXG4gICYtYXZhdGFyIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIGJvcmRlci1yYWRpdXM6IDkwcHg7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICB3aWR0aDogODBweDtcclxuICAgIGhlaWdodDogODBweDtcclxuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XHJcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XHJcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYm90dG9tO1xyXG4gIH1cclxuXHJcbiAgLy8gQXV0aG9yIG1ldGEgKGxvY2F0aW9uIC0gd2Vic2l0ZSAtIHBvc3QgdG90YWwpXHJcbiAgJi1tZXRhIHtcclxuICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcblxyXG4gICAgc3BhbiB7XHJcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgZm9udC1zaXplOiAxN3B4O1xyXG4gICAgICBmb250LXN0eWxlOiBpdGFsaWM7XHJcbiAgICAgIG1hcmdpbjogMCAycmVtIDFyZW0gMDtcclxuICAgICAgb3BhY2l0eTogMC44O1xyXG4gICAgICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAuYXV0aG9yLWxpbms6aG92ZXIge1xyXG4gICAgb3BhY2l0eTogMTtcclxuICB9XHJcblxyXG4gIC8vICBhdXRob3IgRm9sbG93XHJcbiAgJi1mb2xsb3cge1xyXG4gICAgYSB7XHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDNweDtcclxuICAgICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgMnB4IHJnYmEoMjU1LDI1NSwyNTUsLjUpO1xyXG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgaGVpZ2h0OiA0MHB4O1xyXG4gICAgICBsZXR0ZXItc3BhY2luZzogMXB4O1xyXG4gICAgICBsaW5lLWhlaWdodDogNDBweDtcclxuICAgICAgbWFyZ2luOiAwIDEwcHg7XHJcbiAgICAgIHBhZGRpbmc6IDAgMTZweDtcclxuICAgICAgdGV4dC1zaGFkb3c6IG5vbmU7XHJcbiAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcblxyXG4gICAgICAmOmhvdmVyIHtcclxuICAgICAgICBib3gtc2hhZG93OiBpbnNldCAwIDAgMCAycHggI2ZmZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gIEhvbWUgQlROIERPV05cclxuLmhvbWUtZG93biB7XHJcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAxLjJzICFpbXBvcnRhbnQ7XHJcbiAgYm90dG9tOiA2MHB4O1xyXG4gIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSk7XHJcbiAgbGVmdDogMDtcclxuICAvLyB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAtNTAlKTtcclxuICBtYXJnaW46IDAgYXV0bztcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgcmlnaHQ6IDA7XHJcbiAgd2lkdGg6IDcwcHg7XHJcbiAgei1pbmRleDogMTAwO1xyXG59XHJcblxyXG5cclxuQG1lZGlhICN7JG1kLWFuZC11cH17XHJcbiAgLmNvdmVye1xyXG4gICAgJi1kZXNjcmlwdGlvbntcclxuICAgICAgZm9udC1zaXplOiAkZm9udC1zaXplLWxnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuXHJcblxyXG5AbWVkaWEgI3skbWQtYW5kLWRvd259IHtcclxuICAuY292ZXJ7XHJcbiAgICBwYWRkaW5nLXRvcDogJGhlYWRlci1oZWlnaHQ7XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogMjBweDtcclxuXHJcbiAgICAmLXRpdGxle1xyXG4gICAgICBmb250LXNpemU6IDJyZW07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAuYXV0aG9yLWF2YXRhcntcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgbWFyZ2luOiAwIGF1dG8gMTBweCBhdXRvO1xyXG4gIH1cclxufVxyXG4iLCIuZmVlZC1lbnRyeS1jb250ZW50IC5mZWVkLWVudHJ5LXdyYXBwZXI6bGFzdC1jaGlsZCB7XHJcbiAgLmVudHJ5Omxhc3QtY2hpbGQge1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIGJvcmRlcjogbm9uZTtcclxuICB9XHJcbn1cclxuXHJcbi5lbnRyeSB7XHJcbiAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xyXG4gIHBhZGRpbmc6IDAgMTVweCAxNXB4O1xyXG5cclxuICAmLWltYWdlIHtcclxuICAgIC8vIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcblxyXG4gICAgJi0tbGluayB7XHJcbiAgICAgIGhlaWdodDogMTgwcHg7XHJcbiAgICAgIG1hcmdpbjogMCAtMTVweDtcclxuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuXHJcbiAgICAgICY6aG92ZXIgLmVudHJ5LWltYWdlLS1iZyB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjAzKTtcclxuICAgICAgICBiYWNrZmFjZS12aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmLS1iZyB7IHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIH1cclxuICB9XHJcblxyXG4gIC8vIHZpZGVvIHBsYXkgZm9yIHZpZGVvIHBvc3QgZm9ybWF0XHJcbiAgJi12aWRlby1wbGF5IHtcclxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgIGJvcmRlcjogMnB4IHNvbGlkICNmZmY7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgIGZvbnQtc2l6ZTogMy41cmVtO1xyXG4gICAgaGVpZ2h0OiA2NXB4O1xyXG4gICAgbGVmdDogNTAlO1xyXG4gICAgbGluZS1oZWlnaHQ6IDY1cHg7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICB0b3A6IDUwJTtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xyXG4gICAgd2lkdGg6IDY1cHg7XHJcbiAgICB6LWluZGV4OiAxMDtcclxuICAgIC8vICY6YmVmb3Jle2xpbmUtaGVpZ2h0OiBpbmhlcml0fVxyXG4gIH1cclxuXHJcbiAgJi1jYXRlZ29yeSB7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA1cHg7XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcclxuICAgIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1zbTtcclxuICAgIGxpbmUtaGVpZ2h0OiAxO1xyXG5cclxuICAgIGE6YWN0aXZlIHtcclxuICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAmLXRpdGxlIHtcclxuICAgIGNvbG9yOiAkZW50cnktY29sb3ItdGl0bGU7XHJcbiAgICBmb250LXNpemU6ICRlbnRyeS1mb250LXNpemUtbWI7XHJcbiAgICBoZWlnaHQ6IGF1dG87XHJcbiAgICBsaW5lLWhlaWdodDogMS4yO1xyXG4gICAgbWFyZ2luOiAwIDAgLjVyZW07XHJcbiAgICBwYWRkaW5nOiAwO1xyXG5cclxuICAgICY6aG92ZXIge1xyXG4gICAgICBjb2xvcjogJGVudHJ5LWNvbG9yLXRpdGxlLWhvdmVyO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJi1ieWxpbmUge1xyXG4gICAgbWFyZ2luLXRvcDogMDtcclxuICAgIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcclxuICAgIGNvbG9yOiAkZW50cnktY29sb3ItYnlsaW5lO1xyXG4gICAgZm9udC1zaXplOiAkZW50cnktZm9udC1zaXplLWJ5bGluZTtcclxuXHJcbiAgICBhIHtcclxuICAgICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICAgICY6aG92ZXIgeyBjb2xvcjogIzMzMyB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAmLWJvZHkge1xyXG4gICAgcGFkZGluZy10b3A6IDIwcHg7XHJcbiAgfVxyXG59XHJcblxyXG4vKiBFbnRyeSBzbWFsbCAtLXNtYWxsXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi5lbnRyeS5lbnRyeS0tc21hbGwge1xyXG4gIG1hcmdpbi1ib3R0b206IDI0cHg7XHJcbiAgcGFkZGluZzogMDtcclxuXHJcbiAgLmVudHJ5LWltYWdlIHsgbWFyZ2luLWJvdHRvbTogMTBweCB9XHJcbiAgLmVudHJ5LWltYWdlLS1saW5rIHsgaGVpZ2h0OiAxNzBweDsgbWFyZ2luOiAwIH1cclxuXHJcbiAgLmVudHJ5LXRpdGxlIHtcclxuICAgIGZvbnQtc2l6ZTogMXJlbTtcclxuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICBsaW5lLWhlaWdodDogMS4yO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XHJcbiAgfVxyXG5cclxuICAuZW50cnktYnlsaW5lIHsgbWFyZ2luOiAwIH1cclxufVxyXG5cclxuLy8gTWVkaWEgcXVlcnkgTEdcclxuQG1lZGlhICN7JGxnLWFuZC11cH0ge1xyXG4gIC5lbnRyeSB7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA0MHB4O1xyXG4gICAgcGFkZGluZzogMDtcclxuXHJcbiAgICAmLXRpdGxlIHtcclxuICAgICAgLy8gZm9udC1zaXplOiAkZW50cnktZm9udC1zaXplO1xyXG4gICAgICBmb250LXNpemU6IDIxcHg7XHJcbiAgICB9XHJcblxyXG4gICAgJi1ib2R5IHsgcGFkZGluZy1yaWdodDogMzVweCAhaW1wb3J0YW50IH1cclxuXHJcbiAgICAmLWltYWdlIHtcclxuICAgICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgIH1cclxuXHJcbiAgICAmLWltYWdlLS1saW5rIHtcclxuICAgICAgaGVpZ2h0OiAxODBweDtcclxuICAgICAgbWFyZ2luOiAwO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gTWVkaWEgUXVlcnkgWExcclxuQG1lZGlhICN7JHhsLWFuZC11cH0ge1xyXG4gIC5lbnRyeS1pbWFnZS0tbGluayB7IGhlaWdodDogMjE4cHggfVxyXG59XHJcbiIsIi5mb290ZXIge1xyXG4gIGNvbG9yOiAkZm9vdGVyLWNvbG9yO1xyXG4gIGZvbnQtc2l6ZTogMTRweDtcclxuICBmb250LXdlaWdodDogNTAwO1xyXG4gIGxpbmUtaGVpZ2h0OiAxO1xyXG4gIHBhZGRpbmc6IDEuNnJlbSAxNXB4O1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuXHJcbiAgYSB7XHJcbiAgICBjb2xvcjogJGZvb3Rlci1jb2xvci1saW5rO1xyXG4gICAgJjpob3ZlciB7IGNvbG9yOiByZ2JhKDAsIDAsIDAsIC44KTsgfVxyXG4gIH1cclxuXHJcbiAgJi13cmFwIHtcclxuICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgbWF4LXdpZHRoOiAxNDAwcHg7XHJcbiAgfVxyXG5cclxuICAuaGVhcnQge1xyXG4gICAgYW5pbWF0aW9uOiBoZWFydGlmeSAuNXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xyXG4gICAgY29sb3I6IHJlZDtcclxuICB9XHJcblxyXG4gICYtY29weSxcclxuICAmLWRlc2lnbi1hdXRob3Ige1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgcGFkZGluZzogLjVyZW0gMDtcclxuICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XHJcbiAgfVxyXG5cclxuICAmLWZvbGxvdyB7XHJcbiAgICBwYWRkaW5nOiAyMHB4IDA7XHJcblxyXG4gICAgYSB7XHJcbiAgICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgICAgbWFyZ2luOiAwIDVweDtcclxuICAgICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuQGtleWZyYW1lcyBoZWFydGlmeSB7XHJcbiAgMCUge1xyXG4gICAgdHJhbnNmb3JtOiBzY2FsZSguOCk7XHJcbiAgfVxyXG59XHJcbiIsIi5idG57XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICBib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgYm9yZGVyOiAwO1xyXG4gIGJveC1zaGFkb3c6IG5vbmU7XHJcbiAgY29sb3I6ICRidG4tc2Vjb25kYXJ5LWNvbG9yO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgZm9udDogNTAwIDE0cHgvMjBweCAkcHJpbWFyeS1mb250O1xyXG4gIGhlaWdodDogMzZweDtcclxuICBtYXJnaW46IDA7XHJcbiAgbWluLXdpZHRoOiAzNnB4O1xyXG4gIG91dGxpbmU6IDA7XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICBwYWRkaW5nOiA4cHg7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcclxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgLjJzLGJveC1zaGFkb3cgLjJzO1xyXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XHJcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuXHJcbiAgKyAuYnRue21hcmdpbi1sZWZ0OiA4cHg7fVxyXG5cclxuICAmOmZvY3VzLFxyXG4gICY6aG92ZXJ7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYnRuLWJhY2tncm91bmQtY29sb3I7XHJcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmUgIWltcG9ydGFudDtcclxuICB9XHJcbiAgJjphY3RpdmV7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYnRuLWFjdGl2ZS1iYWNrZ3JvdW5kO1xyXG4gIH1cclxuXHJcbiAgJi5idG4tbGd7XHJcbiAgICBmb250LXNpemU6IDEuNXJlbTtcclxuICAgIG1pbi13aWR0aDogNDhweDtcclxuICAgIGhlaWdodDogNDhweDtcclxuICAgIGxpbmUtaGVpZ2h0OiA0OHB4O1xyXG4gIH1cclxuICAmLmJ0bi1mbGF0e1xyXG4gICAgYmFja2dyb3VuZDogMDtcclxuICAgIGJveC1zaGFkb3c6IG5vbmU7XHJcbiAgICAmOmZvY3VzLFxyXG4gICAgJjpob3ZlcixcclxuICAgICY6YWN0aXZle1xyXG4gICAgICBiYWNrZ3JvdW5kOiAwO1xyXG4gICAgICBib3gtc2hhZG93OiBub25lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJi5idG4tcHJpbWFyeXtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRidG4tcHJpbWFyeS1jb2xvcjtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgJjpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiBkYXJrZW4oJGJ0bi1wcmltYXJ5LWNvbG9yLCA0JSk7fVxyXG4gIH1cclxuICAmLmJ0bi1jaXJjbGV7XHJcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICBoZWlnaHQ6IDQwcHg7XHJcbiAgICBsaW5lLWhlaWdodDogNDBweDtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICB3aWR0aDogNDBweDtcclxuICB9XHJcbiAgJi5idG4tY2lyY2xlLXNtYWxse1xyXG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgaGVpZ2h0OiAzMnB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDMycHg7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgd2lkdGg6IDMycHg7XHJcbiAgICBtaW4td2lkdGg6IDMycHg7XHJcbiAgfVxyXG4gICYuYnRuLXNoYWRvd3tcclxuICAgIGJveC1zaGFkb3c6IDAgMnB4IDJweCAwIHJnYmEoMCwwLDAsMC4xMik7XHJcbiAgICBjb2xvcjogIzMzMztcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNlZWU7XHJcbiAgICAmOmhvdmVye2JhY2tncm91bmQtY29sb3I6IHJnYmEoMCwwLDAsMC4xMik7fVxyXG4gIH1cclxuXHJcbiAgJi5idG4tZG93bmxvYWQtY2xvdWQsXHJcbiAgJi5idG4tZG93bmxvYWR7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYnRuLXByaW1hcnktY29sb3I7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgICY6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjogZGFya2VuKCRidG4tcHJpbWFyeS1jb2xvciwgOCUpO31cclxuICAgICY6YWZ0ZXJ7XHJcbiAgICAgIEBleHRlbmQgJWZvbnQtaWNvbnM7XHJcbiAgICAgIG1hcmdpbi1sZWZ0OiA1cHg7XHJcbiAgICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xyXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAmLmJ0bi1kb3dubG9hZDphZnRlcntjb250ZW50OiAkaS1kb3dubG9hZDt9XHJcbiAgJi5idG4tZG93bmxvYWQtY2xvdWQ6YWZ0ZXJ7Y29udGVudDogJGktY2xvdWRfZG93bmxvYWQ7fVxyXG4gICYuZXh0ZXJuYWw6YWZ0ZXJ7Zm9udC1zaXplOiAxcmVtO31cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vICBJbnB1dFxyXG4uaW5wdXQtZ3JvdXAge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBkaXNwbGF5OiB0YWJsZTtcclxuICBib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4uZm9ybS1jb250cm9sIHtcclxuICB3aWR0aDogMTAwJTtcclxuICBwYWRkaW5nOiA4cHggMTJweDtcclxuICBmb250LXNpemU6IDE0cHg7XHJcbiAgbGluZS1oZWlnaHQ6IDEuNDI4NTc7XHJcbiAgY29sb3I6ICM1NTU7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiBub25lO1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XHJcbiAgYm9yZGVyLXJhZGl1czogMHB4O1xyXG4gIGJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLDAuMDc1KTtcclxuICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgZWFzZS1pbi1vdXQgMC4xNXMsYm94LXNoYWRvdyBlYXNlLWluLW91dCAwLjE1cztcclxuICBoZWlnaHQ6IDM2cHg7XHJcblxyXG4gICY6Zm9jdXMge1xyXG4gICAgYm9yZGVyLWNvbG9yOiAkYnRuLXByaW1hcnktY29sb3I7XHJcbiAgICBvdXRsaW5lOiAwO1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMXB4IHJnYmEoMCwwLDAsMC4wNzUpLDAgMCA4cHggcmdiYSgkYnRuLXByaW1hcnktY29sb3IsMC42KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4uYnRuLXN1YnNjcmliZS1ob21le1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gIGJvcmRlci1yYWRpdXM6IDNweDtcclxuICBib3gtc2hhZG93OiBpbnNldCAwIDAgMCAycHggaHNsYSgwLDAlLDEwMCUsLjUpO1xyXG4gIGNvbG9yOiAjZmZmZmZmO1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIGZvbnQtc2l6ZTogMjBweDtcclxuICBmb250LXdlaWdodDogNDAwO1xyXG4gIGxpbmUtaGVpZ2h0OiAxLjI7XHJcbiAgbWFyZ2luLXRvcDogNTBweDtcclxuICBtYXgtd2lkdGg6IDMwMHB4O1xyXG4gIG1heC13aWR0aDogMzAwcHg7XHJcbiAgcGFkZGluZzogMTVweCAxMHB4O1xyXG4gIHRyYW5zaXRpb246IGFsbCAwLjNzO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG5cclxuICAmOmhvdmVye1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgMnB4ICNmZmY7XHJcbiAgfVxyXG59XHJcbiIsIi8qICBQb3N0XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLnBvc3Qtd3JhcHBlciB7XG4gIG1hcmdpbi10b3A6ICRoZWFkZXItaGVpZ2h0O1xuICBwYWRkaW5nLXRvcDogMS44cmVtO1xufVxuXG4ucG9zdCB7XG4gIC8vIHBhZGRpbmc6IDE1cHg7XG5cbiAgJi1oZWFkZXIge1xuICAgIG1hcmdpbi1ib3R0b206IDEuMnJlbTtcbiAgfVxuXG4gICYtdGl0bGUge1xuICAgIGNvbG9yOiAjMDAwO1xuICAgIGZvbnQtc2l6ZTogMi41cmVtO1xuICAgIGhlaWdodDogYXV0bztcbiAgICBsaW5lLWhlaWdodDogMS4wNDtcbiAgICBtYXJnaW46IDAgMCAwLjkzNzVyZW07XG4gICAgbGV0dGVyLXNwYWNpbmc6IC0uMDI4ZW0gIWltcG9ydGFudDtcbiAgICBwYWRkaW5nOiAwO1xuICB9XG5cbiAgJi1leGNlcnB0IHtcbiAgICBsaW5lLWhlaWdodDogMS4zZW07XG4gICAgZm9udC1zaXplOiAyMHB4O1xuICAgIGNvbG9yOiAjN0Q3RDdEO1xuICAgIG1hcmdpbi1ib3R0b206IDhweDtcbiAgfVxuXG4gIC8vICBJbWFnZVxuICAmLWltYWdle1xuICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgfVxuXG4gIC8vIHBvc3QgY29udGVudFxuICAmLWJvZHl7XG4gICAgbWFyZ2luLWJvdHRvbTogMnJlbTtcblxuICAgIGE6Zm9jdXMge3RleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO31cblxuICAgIGgye1xuICAgICAgLy8gYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICRkaXZpZGVyLWNvbG9yO1xuICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgIG1hcmdpbjogMi41MHJlbSAwIDEuMjVyZW07XG4gICAgICBwYWRkaW5nLWJvdHRvbTogM3B4O1xuICAgIH1cbiAgICBoMyxoNHtcbiAgICAgIG1hcmdpbjogMzJweCAwIDE2cHg7XG4gICAgfVxuXG4gICAgaWZyYW1le1xuICAgICAgZGlzcGxheTogYmxvY2sgIWltcG9ydGFudDtcbiAgICAgIG1hcmdpbjogMCBhdXRvIDEuNXJlbSAwICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgaW1ne1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICAgIH1cblxuICAgIGgyIGEsIGgzIGEsIGg0IGEge1xuICAgICAgY29sb3I6ICRwcmltYXJ5LWNvbG9yLFxuICAgIH1cbiAgfVxuXG4gIC8vIHRhZ3NcbiAgJi10YWdzIHtcbiAgICBtYXJnaW46IDEuMjVyZW0gMDtcbiAgfVxufVxuXG4ucG9zdC1jYXJkIHsgcGFkZGluZzogMTVweCB9XG5cbi8qIFBvc3QgYXV0aG9yIGJ5IGxpbmUgdG9wIChhdXRob3IgLSB0aW1lIC0gdGFnIC0gc2FocmUpXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLnBvc3QtYnlsaW5lIHtcbiAgY29sb3I6ICRzZWNvbmRhcnktdGV4dC1jb2xvcjtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmbGV4LWdyb3c6IDE7XG4gIGxldHRlci1zcGFjaW5nOiAtLjAyOGVtICFpbXBvcnRhbnQ7XG5cbiAgYSB7XG4gICAgY29sb3I6IGluaGVyaXQ7XG4gICAgJjphY3RpdmUgeyB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgfVxuICAgICY6aG92ZXIgeyBjb2xvcjogIzIyMiB9XG4gIH1cbn1cblxuLy8gUG9zdCBhY3Rpb25zIHRvcFxuLnBvc3QtYWN0aW9ucy0tdG9wIC5zaGFyZSB7XG4gIG1hcmdpbi1yaWdodDogMTBweDtcbiAgZm9udC1zaXplOiAyMHB4O1xuXG4gICY6aG92ZXIgeyBvcGFjaXR5OiAuNzsgfVxufVxuXG4ucG9zdC1hY3Rpb24tY29tbWVudHMge1xuICBjb2xvcjogJHNlY29uZGFyeS10ZXh0LWNvbG9yO1xuICBtYXJnaW4tcmlnaHQ6IDE1cHg7XG4gIGZvbnQtc2l6ZTogMTRweDtcbn1cblxuLyogUG9zdCBBY3Rpb24gc29jaWFsIG1lZGlhXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLnBvc3QtYWN0aW9ucyB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xuXG4gIGEge1xuICAgIGNvbG9yOiAjZmZmO1xuICAgIGZvbnQtc2l6ZTogMS4xMjVyZW07XG4gICAgJjpob3ZlciB7IGJhY2tncm91bmQtY29sb3I6ICMwMDAgIWltcG9ydGFudDsgfVxuICB9XG5cbiAgbGkge1xuICAgIG1hcmdpbi1sZWZ0OiA2cHg7XG4gICAgJjpmaXJzdC1jaGlsZCB7IG1hcmdpbi1sZWZ0OiAwICFpbXBvcnRhbnQ7IH1cbiAgfVxuXG4gIC5idG4geyBib3JkZXItcmFkaXVzOiAwOyB9XG59XG5cbi8qIFBvc3QgYXV0aG9yIHdpZGdldCBib3R0b21cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4ucG9zdC1hdXRob3Ige1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGZvbnQtc2l6ZTogMTVweDtcbiAgcGFkZGluZzogMzBweCAwIDMwcHggMTAwcHg7XG4gIG1hcmdpbi1ib3R0b206IDNyZW07XG4gIGJhY2tncm91bmQtY29sb3I6ICNmM2Y1ZjY7XG5cbiAgaDUge1xuICAgIGNvbG9yOiAjQUFBO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBsaW5lLWhlaWdodDogMS41O1xuICAgIG1hcmdpbjogMDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICB9XG5cbiAgbGkge1xuICAgIG1hcmdpbi1sZWZ0OiAzMHB4O1xuICAgIGZvbnQtc2l6ZTogMTRweDtcblxuICAgIGEgeyBjb2xvcjogIzU1NTsgJjpob3ZlciB7IGNvbG9yOiAjMDAwIH0gfVxuXG4gICAgJjpmaXJzdC1jaGlsZCB7IG1hcmdpbi1sZWZ0OiAwIH1cbiAgfVxuXG4gIC8vICYtYmlvIHtcbiAgLy8gICBtYXgtd2lkdGg6IDUwMHB4O1xuICAvLyB9XG5cbiAgLnBvc3QtYXV0aG9yLWF2YXRhciB7XG4gICAgaGVpZ2h0OiA2NHB4O1xuICAgIHdpZHRoOiA2NHB4O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBsZWZ0OiAyMHB4O1xuICAgIHRvcDogMzBweDtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXIgY2VudGVyO1xuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICB9XG59XG5cbi8qIGJvdHRvbSBzaGFyZSBhbmQgYm90dG9tIHN1YnNjcmliZVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi5zaGFyZS1zdWJzY3JpYmV7XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG5cbiAgcHtcbiAgICBjb2xvcjogIzdkN2Q3ZDtcbiAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1zbTtcbiAgfVxuXG4gIC5zb2NpYWwtc2hhcmV7ZmxvYXQ6IG5vbmUgIWltcG9ydGFudDt9XG5cbiAgJj5kaXZ7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgbWFyZ2luLWJvdHRvbTogMTVweDtcbiAgICAmOmJlZm9yZXtcbiAgICAgIGNvbnRlbnQ6IFwiIFwiO1xuICAgICAgYm9yZGVyLXRvcDogc29saWQgMXB4ICMwMDA7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICB0b3A6IDA7XG4gICAgICBsZWZ0OiAxNXB4O1xuICAgICAgd2lkdGg6IDQwcHg7XG4gICAgICBoZWlnaHQ6IDFweDtcbiAgICB9XG5cbiAgICBoNXtcbiAgICAgIGZvbnQtc2l6ZTogICRmb250LXNpemUtc207XG4gICAgICBtYXJnaW46IDFyZW0gMDtcbiAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgfVxuICB9XG5cbiAgLy8gIHN1YnNjcmliZVxuICAubmV3c2xldHRlci1mb3Jte1xuICAgIGRpc3BsYXk6IGZsZXg7XG5cbiAgICAuZm9ybS1ncm91cHtcbiAgICAgIG1heC13aWR0aDogMjUwcHg7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAuYnRue1xuICAgICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICB9XG4gIH1cbn1cblxuLyogUmVsYXRlZCBwb3N0XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLnBvc3QtcmVsYXRlZCB7XG4gIG1hcmdpbi10b3A6IDQwcHg7XG5cbiAgJi10aXRsZSB7XG4gICAgY29sb3I6ICMwMDA7XG4gICAgZm9udC1zaXplOiAxOHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgaGVpZ2h0OiBhdXRvO1xuICAgIGxpbmUtaGVpZ2h0OiAxN3B4O1xuICAgIG1hcmdpbjogMCAwIDIwcHg7XG4gICAgcGFkZGluZy1ib3R0b206IDEwcHg7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgfVxuXG4gICYtbGlzdCB7XG4gICAgbWFyZ2luLWJvdHRvbTogMThweDtcbiAgICBwYWRkaW5nOiAwO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgfVxufVxuXG4vKiBNZWRpYSBRdWVyeSAobWVkaXVtKVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuQG1lZGlhICN7JG1kLWFuZC11cH0ge1xuICAucG9zdCB7XG4gICAgLnRpdGxlIHtcbiAgICAgIGZvbnQtc2l6ZTogMi4yNXJlbTtcbiAgICAgIG1hcmdpbjogMCAwIDFyZW07XG4gICAgfVxuXG4gICAgJi1ib2R5IHtcbiAgICAgIGZvbnQtc2l6ZTogMS4xMjVyZW07XG4gICAgICBsaW5lLWhlaWdodDogMzJweDtcblxuICAgICAgcCB7IG1hcmdpbi1ib3R0b206IDEuNXJlbSB9XG4gICAgfVxuICB9XG5cbiAgLnBvc3QtY2FyZCB7IHBhZGRpbmc6IDMwcHggfVxufVxuXG5cbkBtZWRpYSAjeyRzbS1hbmQtZG93bn17XG4gIC5wb3N0LXRpdGxle1xuICAgIGZvbnQtc2l6ZTogMS44cmVtO1xuICB9XG4gIC5wb3N0LWltYWdlLFxuICAudmlkZW8tcmVzcG9uc2l2ZXtcbiAgICBtYXJnaW4tbGVmdDogIC0gKCRncmlkLWd1dHRlci13aWR0aCAvIDIpO1xuICAgIG1hcmdpbi1yaWdodDogLSAoJGdyaWQtZ3V0dGVyLXdpZHRoIC8gMik7XG4gIH1cbn1cbiIsIi8qIHNpZGViYXJcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuLnNpZGViYXIge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBsaW5lLWhlaWdodDogMS42O1xyXG5cclxuICBoMSxoMixoMyxoNCxoNSxoNiB7IG1hcmdpbi10b3A6IDA7IGNvbG9yOiAjMDAwIH1cclxuXHJcbiAgJi1pdGVtcyB7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAyLjVyZW07XHJcbiAgICBwYWRkaW5nOiAyNXB4O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIH1cclxuXHJcbiAgJi10aXRsZSB7XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogMTBweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgZm9udC1zaXplOiAxcmVtO1xyXG4gICAgLy8gZm9udC13ZWlnaHQ6ICRmb250LXdlaWdodDtcclxuXHJcbiAgICBAZXh0ZW5kIC51LWJvcmRlci1ib3R0b20tZGFyaztcclxuICB9XHJcblxyXG4gIC50aXRsZS1wcmltYXJ5IHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICRwcmltYXJ5LWNvbG9yO1xyXG4gICAgY29sb3I6ICNGRkY7XHJcbiAgICBwYWRkaW5nOiAxMHB4IDE2cHg7XHJcbiAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgfVxyXG59XHJcblxyXG4uc2lkZWJhci1wb3N0IHtcclxuICAvLyBwYWRkaW5nLWJvdHRvbTogMnB4O1xyXG5cclxuICAmLS1ib3JkZXIge1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGJvcmRlci1sZWZ0OiAzcHggc29saWQgJHByaW1hcnktY29sb3I7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuMik7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZm9udC1zaXplOiAyOHB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICBwYWRkaW5nOiAxNXB4IDEwcHggMTBweDtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICB9XHJcblxyXG4gICY6bnRoLWNoaWxkKDNuKSB7IC5zaWRlYmFyLXBvc3QtLWJvcmRlciB7IGJvcmRlci1jb2xvcjogZGFya2VuKG9yYW5nZSwgMiUpIH0gfVxyXG4gICY6bnRoLWNoaWxkKDNuKzIpIHsgLnNpZGViYXItcG9zdC0tYm9yZGVyIHsgYm9yZGVyLWNvbG9yOiByZ2IoMCwgMTYwLCA1MikgfSB9XHJcblxyXG4gICYtLWxpbmsge1xyXG4gICAgLy8gYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwgMjU1LCAyNTUpO1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBtaW4taGVpZ2h0OiA1MHB4O1xyXG4gICAgcGFkZGluZzogMTBweCAxNXB4IDEwcHggNTVweDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbiAgICAmOmhvdmVyIC5zaWRlYmFyLXBvc3QtLWJvcmRlciB7XHJcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyMjksIDIzOSwgMjQ1KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gICYtLXRpdGxlIHtcclxuICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOCk7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICBmb250LXdlaWdodDogNTAwO1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gIH1cclxufVxyXG4iLCIuc3Vic2NyaWJle1xyXG4gIG1pbi1oZWlnaHQ6IDkwdmg7XHJcbiAgcGFkZGluZy10b3A6ICRoZWFkZXItaGVpZ2h0O1xyXG5cclxuICBoM3tcclxuICAgIG1hcmdpbjogMDtcclxuICAgIG1hcmdpbi1ib3R0b206IDhweDtcclxuICAgIGZvbnQ6IDQwMCAyMHB4LzMycHggJHByaW1hcnktZm9udDtcclxuICB9XHJcblxyXG4gICYtdGl0bGV7XHJcbiAgICBmb250LXdlaWdodDogNDAwO1xyXG4gICAgbWFyZ2luLXRvcDogMDtcclxuICB9XHJcblxyXG4gICYtd3JhcHtcclxuICAgIG1heC13aWR0aDogNzAwcHg7XHJcbiAgICBjb2xvcjogIzdkODc4YTtcclxuICAgIHBhZGRpbmc6IDFyZW0gMDtcclxuICB9XHJcblxyXG4gIC5mb3JtLWdyb3Vwe1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xyXG5cclxuICAgICYuZXJyb3J7XHJcbiAgICAgIGlucHV0IHtib3JkZXItY29sb3I6ICNmZjViNWI7fVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLmJ0bntcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi5zdWJzY3JpYmUtZm9ybXtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgbWFyZ2luOiAzMHB4IGF1dG87XHJcbiAgcGFkZGluZzogNDBweDtcclxuICBtYXgtd2lkdGg6IDQwMHB4O1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGJhY2tncm91bmQ6ICNlYmVmZjI7XHJcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gIHRleHQtYWxpZ246IGxlZnQ7XHJcbn1cclxuXHJcbi5zdWJzY3JpYmUtaW5wdXR7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgcGFkZGluZzogMTBweDtcclxuICBib3JkZXI6ICM0Mjg1ZjQgIDFweCBzb2xpZDtcclxuICBib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgJjpmb2N1c3tcclxuICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgfVxyXG59XHJcbiIsIi8vIGFuaW1hdGVkIEdsb2JhbFxyXG4uYW5pbWF0ZWQge1xyXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMXM7XHJcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcclxuXHJcbiAgJi5pbmZpbml0ZSB7IGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlIH1cclxufVxyXG5cclxuLy8gYW5pbWF0ZWQgQWxsXHJcbi5ib3VuY2VJbiB7IGFuaW1hdGlvbi1uYW1lOiBib3VuY2VJbjsgfVxyXG4uYm91bmNlSW5Eb3duIHsgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZUluRG93biB9XHJcbi5zbGlkZUluVXAgeyBhbmltYXRpb24tbmFtZTogc2xpZGVJblVwIH1cclxuLnNsaWRlT3V0RG93biB7IGFuaW1hdGlvbi1uYW1lOiBzbGlkZU91dERvd24gfVxyXG5cclxuLy8gYWxsIGtleWZyYW1lcyBBbmltYXRlc1xyXG5cclxuLy8gYm91bmNlSW5cclxuQGtleWZyYW1lcyBib3VuY2VJbiB7XHJcbiAgICAwJSwgMjAlLCA0MCUsIDYwJSwgODAlLCAxMDAlIHtcclxuICAgICAgICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC4yMTUsIDAuNjEwLCAwLjM1NSwgMS4wMDApO1xyXG4gICAgfVxyXG5cclxuICAgIDAlIHtcclxuICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUzZCguMywgLjMsIC4zKTtcclxuICAgIH1cclxuXHJcbiAgICAyMCUge1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUzZCgxLjEsIDEuMSwgMS4xKTtcclxuICAgIH1cclxuXHJcbiAgICA0MCUge1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUzZCguOSwgLjksIC45KTtcclxuICAgIH1cclxuXHJcbiAgICA2MCUge1xyXG4gICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZTNkKDEuMDMsIDEuMDMsIDEuMDMpO1xyXG4gICAgfVxyXG5cclxuICAgIDgwJSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZTNkKC45NywgLjk3LCAuOTcpO1xyXG4gICAgfVxyXG5cclxuICAgIDEwMCUge1xyXG4gICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZTNkKDEsIDEsIDEpO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vIGJvdW5jZUluRG93blxyXG5Aa2V5ZnJhbWVzIGJvdW5jZUluRG93biB7XHJcbiAgICAwJSwgNjAlLCA3NSUsIDkwJSwgMTAwJSB7XHJcbiAgICAgICAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuMjE1LCAwLjYxMCwgMC4zNTUsIDEuMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICAwJSB7XHJcbiAgICAgICAgb3BhY2l0eTogMDtcclxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIC0zMDAwcHgsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIDYwJSB7XHJcbiAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDI1cHgsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIDc1JSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAtMTBweCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgOTAlIHtcclxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDVweCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgMTAwJSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBub25lO1xyXG4gICAgfVxyXG59XHJcblxyXG5Aa2V5ZnJhbWVzIHB1bHNle1xyXG4gICAgZnJvbXtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlM2QoMSwgMSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgNTAlIHtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlM2QoMS4wNSwgMS4wNSwgMS4wNSk7XHJcbiAgICB9XHJcblxyXG4gICAgdG8ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUzZCgxLCAxLCAxKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbkBrZXlmcmFtZXMgc2Nyb2xse1xyXG4gICAgMCV7XHJcbiAgICAgICAgb3BhY2l0eTowXHJcbiAgICB9XHJcbiAgICAxMCV7XHJcbiAgICAgICAgb3BhY2l0eToxO1xyXG4gICAgICAgIHRyYW5zZm9ybTp0cmFuc2xhdGVZKDBweClcclxuICAgIH1cclxuICAgIDEwMCUge1xyXG4gICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDEwcHgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyAgc3BpbiBmb3IgcGFnaW5hdGlvblxyXG5Aa2V5ZnJhbWVzIHNwaW4ge1xyXG4gICAgZnJvbSB7IHRyYW5zZm9ybTpyb3RhdGUoMGRlZyk7IH1cclxuICAgIHRvIHsgdHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpOyB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgc2xpZGVJblVwIHtcclxuICBmcm9tIHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMTAwJSwgMCk7XHJcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xyXG4gIH1cclxuXHJcbiAgdG8ge1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcclxuICB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgc2xpZGVPdXREb3duIHtcclxuICBmcm9tIHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMCwgMCk7XHJcbiAgfVxyXG5cclxuICB0byB7XHJcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDIwJSwgMCk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsT0FBTyxDQUFQLGlDQUFPO0FBQ1AsT0FBTyxDQUFQLDhCQUFPO0FDUlAsQUFBQSxHQUFHLEFBQUEsYUFBYSxDQUFDO0VBQ2hCLFFBQVEsRUFBRSxRQUFRO0VBQ2xCLFlBQVksRUFBRSxLQUFLO0VBQ25CLGFBQWEsRUFBRSxVQUFVLEdBQ3pCOztBQUVELEFBQW1CLEdBQWhCLEFBQUEsYUFBYSxHQUFHLElBQUksQ0FBQztFQUN2QixRQUFRLEVBQUUsUUFBUTtFQUNmLFdBQVcsRUFBRSxPQUFPLEdBQ3ZCOztBQUVELEFBQWMsYUFBRCxDQUFDLGtCQUFrQixDQUFDO0VBQ2hDLFFBQVEsRUFBRSxRQUFRO0VBQ2xCLGNBQWMsRUFBRSxJQUFJO0VBQ3BCLEdBQUcsRUFBRSxDQUFDO0VBQ04sU0FBUyxFQUFFLElBQUk7RUFDZixJQUFJLEVBQUUsTUFBTTtFQUNaLEtBQUssRUFBRSxHQUFHO0VBQUcsNkNBQTZDO0VBQzFELGNBQWMsRUFBRSxJQUFJO0VBQ3BCLFlBQVksRUFBRSxjQUFj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QUFiTCxBQVVJLGVBVlcsQ0FVWCxVQUFVLENBQVE7RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxTQUFTLENBQVM7RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxZQUFZLENBQU07RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxVQUFVLENBQVE7RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxTQUFTLENBQVM7RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxXQUFXLENBQU87RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxVQUFVLENBQVE7RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxVQUFVLENBQVE7RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxVQUFVLENBQVE7RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxXQUFXLENBQU87RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxTQUFTLENBQVM7RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxTQUFTLENBQVM7RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxTQUFTLENBQVM7RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxZQUFZLENBQU07RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxPQUFPLENBQVc7RUFDaEIsS0FBSyxFQUFFLElBQUksR0FFWjs7QUFiTCxBQVVJLGVBVlcsQ0FVWCxXQUFXLENBQU87RUFDaEIsS0FBSyxFQUFF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 */","pre.line-numbers {\n\tposition: relative;\n\tpadding-left: 3.8em;\n\tcounter-reset: linenumber;\n}\n\npre.line-numbers > code {\n\tposition: relative;\n    white-space: inherit;\n}\n\n.line-numbers .line-numbers-rows {\n\tposition: absolute;\n\tpointer-events: none;\n\ttop: 0;\n\tfont-size: 100%;\n\tleft: -3.8em;\n\twidth: 3em; /* works for line-numbers below 1000 lines */\n\tletter-spacing: -1px;\n\tborder-right: 1px solid #999;\n\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n\n}\n\n\t.line-numbers-rows > span {\n\t\tpointer-events: none;\n\t\tdisplay: block;\n\t\tcounter-increment: linenumber;\n\t}\n\n\t\t.line-numbers-rows > span:before {\n\t\t\tcontent: counter(linenumber);\n\t\t\tcolor: #999;\n\t\t\tdisplay: block;\n\t\t\tpadding-right: 0.8em;\n\t\t\ttext-align: right;\n\t\t}","@charset \"UTF-8\";\n\n@import url(~normalize.css/normalize.css);\n\n@import url(~prismjs/themes/prism.css);\n\npre.line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber;\n}\n\npre.line-numbers > code {\n  position: relative;\n  white-space: inherit;\n}\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber;\n}\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right;\n}\n\n@font-face {\n  font-family: 'mapache';\n  src: url(\"./../fonts/mapache.ttf\") format(\"truetype\"), url(\"./../fonts/mapache.woff\") format(\"woff\"), url(\"./../fonts/mapache.svg\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n\n[class^=\"i-\"]:before,\n[class*=\" i-\"]:before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.i-navigate_before:before {\n  content: \"\\e408\";\n}\n\n.i-navigate_next:before {\n  content: \"\\e409\";\n}\n\n.i-tag:before {\n  content: \"\\e54e\";\n}\n\n.i-keyboard_arrow_down:before {\n  content: \"\\e313\";\n}\n\n.i-arrow_upward:before {\n  content: \"\\e5d8\";\n}\n\n.i-cloud_download:before {\n  content: \"\\e2c0\";\n}\n\n.i-star:before {\n  content: \"\\e838\";\n}\n\n.i-keyboard_arrow_up:before {\n  content: \"\\e316\";\n}\n\n.i-open_in_new:before {\n  content: \"\\e89e\";\n}\n\n.i-warning:before {\n  content: \"\\e002\";\n}\n\n.i-back:before {\n  content: \"\\e5c4\";\n}\n\n.i-forward:before {\n  content: \"\\e5c8\";\n}\n\n.i-chat:before {\n  content: \"\\e0cb\";\n}\n\n.i-close:before {\n  content: \"\\e5cd\";\n}\n\n.i-code2:before {\n  content: \"\\e86f\";\n}\n\n.i-favorite:before {\n  content: \"\\e87d\";\n}\n\n.i-link:before {\n  content: \"\\e157\";\n}\n\n.i-menu:before {\n  content: \"\\e5d2\";\n}\n\n.i-feed:before {\n  content: \"\\e0e5\";\n}\n\n.i-search:before {\n  content: \"\\e8b6\";\n}\n\n.i-share:before {\n  content: \"\\e80d\";\n}\n\n.i-check_circle:before {\n  content: \"\\e86c\";\n}\n\n.i-play:before {\n  content: \"\\e901\";\n}\n\n.i-download:before {\n  content: \"\\e900\";\n}\n\n.i-code:before {\n  content: \"\\f121\";\n}\n\n.i-behance:before {\n  content: \"\\f1b4\";\n}\n\n.i-spotify:before {\n  content: \"\\f1bc\";\n}\n\n.i-codepen:before {\n  content: \"\\f1cb\";\n}\n\n.i-github:before {\n  content: \"\\f09b\";\n}\n\n.i-linkedin:before {\n  content: \"\\f0e1\";\n}\n\n.i-flickr:before {\n  content: \"\\f16e\";\n}\n\n.i-dribbble:before {\n  content: \"\\f17d\";\n}\n\n.i-pinterest:before {\n  content: \"\\f231\";\n}\n\n.i-map:before {\n  content: \"\\f041\";\n}\n\n.i-twitter:before {\n  content: \"\\f099\";\n}\n\n.i-facebook:before {\n  content: \"\\f09a\";\n}\n\n.i-youtube:before {\n  content: \"\\f16a\";\n}\n\n.i-instagram:before {\n  content: \"\\f16d\";\n}\n\n.i-google:before {\n  content: \"\\f1a0\";\n}\n\n.i-pocket:before {\n  content: \"\\f265\";\n}\n\n.i-reddit:before {\n  content: \"\\f281\";\n}\n\n.i-snapchat:before {\n  content: \"\\f2ac\";\n}\n\n.i-telegram:before {\n  content: \"\\f2c6\";\n}\n\n/*\r\n@package godofredoninja\r\n\r\n========================================================================\r\nMapache variables styles\r\n========================================================================\r\n*/\n\n/**\r\n* Table of Contents:\r\n*\r\n*   1. Colors\r\n*   2. Fonts\r\n*   3. Typography\r\n*   4. Header\r\n*   5. Footer\r\n*   6. Code Syntax\r\n*   7. buttons\r\n*   8. container\r\n*   9. Grid\r\n*   10. Media Query Ranges\r\n*   11. Icons\r\n*/\n\n/* 1. Colors\r\n========================================================================== */\n\n/* 2. Fonts\r\n========================================================================== */\n\n/* 3. Typography\r\n========================================================================== */\n\n/* 4. Header\r\n========================================================================== */\n\n/* 5. Entry articles\r\n========================================================================== */\n\n/* 5. Footer\r\n========================================================================== */\n\n/* 6. Code Syntax\r\n========================================================================== */\n\n/* 7. buttons\r\n========================================================================== */\n\n/* 8. container\r\n========================================================================== */\n\n/* 9. Grid\r\n========================================================================== */\n\n/* 10. Media Query Ranges\r\n========================================================================== */\n\n/* 11. icons\r\n========================================================================== */\n\n.header.toolbar-shadow {\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n}\n\na.external::after,\nhr::before,\n.warning:before,\n.note:before,\n.success:before,\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after,\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.u-clear::after {\n  clear: both;\n  content: \"\";\n  display: table;\n}\n\n.u-not-avatar {\n  background-image: url(\"./../images/avatar.png\");\n}\n\n.u-relative {\n  position: relative;\n}\n\n.u-block {\n  display: block;\n}\n\n.u-absolute0 {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n\n.u-bg-cover {\n  background-position: center;\n  background-size: cover;\n}\n\n.u-bg-gradient {\n  background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, 0.8)));\n}\n\n.u-border-bottom-dark,\n.sidebar-title {\n  border-bottom: solid 1px #000;\n}\n\n.u-b-t {\n  border-top: solid 1px #eee;\n}\n\n.u-p-t-2 {\n  padding-top: 2rem;\n}\n\n.u-unstyled {\n  list-style-type: none;\n  margin: 0;\n  padding-left: 0;\n}\n\n.u-floatLeft {\n  float: left !important;\n}\n\n.u-floatRight {\n  float: right !important;\n}\n\n.u-flex {\n  display: flex;\n  flex-direction: row;\n}\n\n.u-flex-wrap {\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.u-flex-center,\n.header-logo,\n.header-follow a,\n.header-menu a {\n  display: flex;\n  align-items: center;\n}\n\n.u-flex-aling-right {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n}\n\n.u-flex-aling-center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n}\n\n.u-m-t-1 {\n  margin-top: 1rem;\n}\n\n/* Tags\n========================================================================== */\n\n.u-tags {\n  font-size: 12px !important;\n  margin: 3px !important;\n  color: #4c5765 !important;\n  background-color: #ebebeb !important;\n  transition: all .3s;\n}\n\n.u-tags::before {\n  padding-right: 5px;\n  opacity: .8;\n}\n\n.u-tags:hover {\n  background-color: #4285f4 !important;\n  color: #fff !important;\n}\n\n.u-textUppercase {\n  text-transform: uppercase;\n}\n\n.u-tag {\n  background-color: #4285f4;\n  color: #fff;\n  padding: 4px 12px;\n  font-size: 11px;\n  display: inline-block;\n  text-transform: uppercase;\n}\n\n.u-hide {\n  display: none !important;\n}\n\n.u-card-shadow {\n  background-color: #fff;\n  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.02);\n}\n\n.u-not-image {\n  background-repeat: repeat;\n  background-size: initial !important;\n  background-color: #fff;\n}\n\n@media only screen and (max-width: 766px) {\n  .u-h-b-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  .u-h-b-lg {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  .u-h-a-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .u-h-a-lg {\n    display: none !important;\n  }\n}\n\nhtml {\n  box-sizing: border-box;\n  font-size: 16px;\n  -webkit-tap-highlight-color: transparent;\n}\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\na {\n  color: #039be5;\n  outline: 0;\n  text-decoration: none;\n  -webkit-tap-highlight-color: transparent;\n}\n\na:focus {\n  text-decoration: none;\n}\n\na.external::after {\n  content: \"\";\n  margin-left: 5px;\n}\n\nbody {\n  color: #333;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 0 auto;\n  background-color: #f5f5f5;\n}\n\nfigure {\n  margin: 0;\n}\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n}\n\nimg:not([src]) {\n  visibility: hidden;\n}\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n\ni {\n  display: inline-block;\n  vertical-align: middle;\n}\n\nhr {\n  background: #F1F2F1;\n  background: linear-gradient(to right, #F1F2F1 0, #b5b5b5 50%, #F1F2F1 100%);\n  border: none;\n  height: 1px;\n  margin: 80px auto;\n  max-width: 90%;\n  position: relative;\n}\n\nhr::before {\n  background: #fff;\n  color: rgba(73, 55, 65, 0.75);\n  content: \"\";\n  display: block;\n  font-size: 35px;\n  left: 50%;\n  padding: 0 25px;\n  position: absolute;\n  top: 50%;\n  transform: translate(-50%, -50%);\n}\n\nblockquote {\n  border-left: 4px solid #4285f4;\n  padding: .75rem 1.5rem;\n  background: #fbfbfc;\n  color: #757575;\n  font-size: 1.125rem;\n  line-height: 1.7;\n  margin: 0 0 1.25rem;\n  quotes: none;\n}\n\nol,\nul,\nblockquote {\n  margin-left: 2rem;\n}\n\nstrong {\n  font-weight: 500;\n}\n\nsmall,\n.small {\n  font-size: 85%;\n}\n\nol {\n  padding-left: 40px;\n  list-style: decimal outside;\n}\n\nmark {\n  background-color: #fdffb6;\n}\n\n.footer,\n.main {\n  transition: transform .5s ease;\n  z-index: 2;\n}\n\n/* Code Syntax\r\n========================================================================== */\n\nkbd,\nsamp,\ncode {\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  color: #c7254e;\n  background: #f7f7f7;\n  border-radius: 4px;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\ncode[class*=language-],\npre[class*=language-] {\n  color: #37474f;\n  line-height: 1.5;\n}\n\ncode[class*=language-] .token.comment,\npre[class*=language-] .token.comment {\n  opacity: .8;\n}\n\ncode[class*=language-].line-numbers,\npre[class*=language-].line-numbers {\n  padding-left: 58px;\n}\n\ncode[class*=language-].line-numbers::before,\npre[class*=language-].line-numbers::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  background: #F0EDEE;\n  width: 40px;\n  height: 100%;\n}\n\ncode[class*=language-] .line-numbers-rows,\npre[class*=language-] .line-numbers-rows {\n  border-right: none;\n  top: -3px;\n  left: -58px;\n}\n\ncode[class*=language-] .line-numbers-rows > span::before,\npre[class*=language-] .line-numbers-rows > span::before {\n  padding-right: 0;\n  text-align: center;\n  opacity: .8;\n}\n\npre {\n  background-color: #f7f7f7 !important;\n  padding: 1rem;\n  overflow: hidden;\n  border-radius: 4px;\n  word-wrap: normal;\n  margin: 2.5rem 0 !important;\n  font-family: \"Roboto Mono\", monospace !important;\n  font-size: 0.9375rem;\n  position: relative;\n}\n\npre code {\n  color: #37474f;\n  text-shadow: 0 1px #fff;\n  padding: 0;\n  background: transparent;\n}\n\n/* .warning & .note & .success\r\n========================================================================== */\n\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n}\n\n.warning:before {\n  content: \"\";\n}\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n}\n\n.note:before {\n  content: \"\";\n}\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n}\n\n.success:before {\n  content: \"\";\n  color: #00bfa5;\n}\n\n.warning,\n.note,\n.success {\n  display: block;\n  margin: 1rem 0;\n  font-size: 1rem;\n  padding: 12px 24px 12px 60px;\n  line-height: 1.5;\n}\n\n.warning a,\n.note a,\n.success a {\n  text-decoration: underline;\n  color: inherit;\n}\n\n.warning:before,\n.note:before,\n.success:before {\n  margin-left: -36px;\n  float: left;\n  font-size: 24px;\n}\n\n/* Social icon color and background\r\n========================================================================== */\n\n.c-facebook {\n  color: #3b5998;\n}\n\n.bg-facebook,\n.nav-mob-follow .i-facebook {\n  background-color: #3b5998 !important;\n}\n\n.c-twitter {\n  color: #55acee;\n}\n\n.bg-twitter,\n.nav-mob-follow .i-twitter {\n  background-color: #55acee !important;\n}\n\n.c-google {\n  color: #dd4b39;\n}\n\n.bg-google,\n.nav-mob-follow .i-google {\n  background-color: #dd4b39 !important;\n}\n\n.c-instagram {\n  color: #306088;\n}\n\n.bg-instagram,\n.nav-mob-follow .i-instagram {\n  background-color: #306088 !important;\n}\n\n.c-youtube {\n  color: #e52d27;\n}\n\n.bg-youtube,\n.nav-mob-follow .i-youtube {\n  background-color: #e52d27 !important;\n}\n\n.c-github {\n  color: #333333;\n}\n\n.bg-github,\n.nav-mob-follow .i-github {\n  background-color: #333333 !important;\n}\n\n.c-linkedin {\n  color: #007bb6;\n}\n\n.bg-linkedin,\n.nav-mob-follow .i-linkedin {\n  background-color: #007bb6 !important;\n}\n\n.c-spotify {\n  color: #2ebd59;\n}\n\n.bg-spotify,\n.nav-mob-follow .i-spotify {\n  background-color: #2ebd59 !important;\n}\n\n.c-codepen {\n  color: #222222;\n}\n\n.bg-codepen,\n.nav-mob-follow .i-codepen {\n  background-color: #222222 !important;\n}\n\n.c-behance {\n  color: #131418;\n}\n\n.bg-behance,\n.nav-mob-follow .i-behance {\n  background-color: #131418 !important;\n}\n\n.c-dribbble {\n  color: #ea4c89;\n}\n\n.bg-dribbble,\n.nav-mob-follow .i-dribbble {\n  background-color: #ea4c89 !important;\n}\n\n.c-flickr {\n  color: #0063DC;\n}\n\n.bg-flickr,\n.nav-mob-follow .i-flickr {\n  background-color: #0063DC !important;\n}\n\n.c-reddit {\n  color: orangered;\n}\n\n.bg-reddit,\n.nav-mob-follow .i-reddit {\n  background-color: orangered !important;\n}\n\n.c-pocket {\n  color: #F50057;\n}\n\n.bg-pocket,\n.nav-mob-follow .i-pocket {\n  background-color: #F50057 !important;\n}\n\n.c-pinterest {\n  color: #bd081c;\n}\n\n.bg-pinterest,\n.nav-mob-follow .i-pinterest {\n  background-color: #bd081c !important;\n}\n\n.c-feed {\n  color: orange;\n}\n\n.bg-feed,\n.nav-mob-follow .i-feed {\n  background-color: orange !important;\n}\n\n.c-telegram {\n  color: #08c;\n}\n\n.bg-telegram,\n.nav-mob-follow .i-telegram {\n  background-color: #08c !important;\n}\n\n.clear:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n/* pagination Infinite scroll\r\n========================================================================== */\n\n.mapache-load-more {\n  border: solid 1px #C3C3C3;\n  color: #7D7D7D;\n  display: block;\n  font-size: 15px;\n  height: 45px;\n  margin: 4rem auto;\n  padding: 11px 16px;\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n.mapache-load-more:hover {\n  background: #4285f4;\n  border-color: #4285f4;\n  color: #fff;\n}\n\n.pagination-nav {\n  padding: 2.5rem 0 3rem;\n  text-align: center;\n}\n\n.pagination-nav .page-number {\n  display: none;\n  padding-top: 5px;\n}\n\n@media only screen and (min-width: 766px) {\n  .pagination-nav .page-number {\n    display: inline-block;\n  }\n}\n\n.pagination-nav .newer-posts {\n  float: left;\n}\n\n.pagination-nav .older-posts {\n  float: right;\n}\n\n/* Scroll Top\r\n========================================================================== */\n\n.scroll_top {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  z-index: 11;\n  width: 60px;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity 0.5s ease;\n}\n\n.scroll_top.visible {\n  opacity: 1;\n  visibility: visible;\n}\n\n.scroll_top:hover svg path {\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n.svg-icon svg {\n  width: 100%;\n  height: auto;\n  display: block;\n  fill: currentcolor;\n}\n\n/* Video Responsive\r\n========================================================================== */\n\n.video-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n  padding-bottom: 56.25%;\n  margin-bottom: 1.5rem;\n}\n\n.video-responsive iframe {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  border: 0;\n}\n\n/* Video full for tag video\r\n========================================================================== */\n\n#video-format .video-content {\n  display: flex;\n  padding-bottom: 1rem;\n}\n\n#video-format .video-content span {\n  display: inline-block;\n  vertical-align: middle;\n  margin-right: .8rem;\n}\n\n/* Page error 404\r\n========================================================================== */\n\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n  height: 100vh;\n  position: relative;\n  width: 100%;\n}\n\n.errorPage-title {\n  padding: 24px 60px;\n}\n\n.errorPage-link {\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 22px;\n  font-weight: 500;\n  left: -5px;\n  position: relative;\n  text-rendering: optimizeLegibility;\n  top: -6px;\n}\n\n.errorPage-emoji {\n  color: rgba(0, 0, 0, 0.4);\n  font-size: 150px;\n}\n\n.errorPage-text {\n  color: rgba(0, 0, 0, 0.4);\n  line-height: 21px;\n  margin-top: 60px;\n  white-space: pre-wrap;\n}\n\n.errorPage-wrap {\n  display: block;\n  left: 50%;\n  min-width: 680px;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  transform: translate(-50%, -50%);\n}\n\n/* Post Twitter facebook card embed Css Center\r\n========================================================================== */\n\n.post iframe[src*=\"facebook.com\"],\n.post .fb-post,\n.post .twitter-tweet {\n  display: block !important;\n  margin: 1.5rem 0 !important;\n}\n\n.container {\n  margin: 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n  width: 100%;\n  max-width: 1250px;\n}\n\n.margin-top {\n  margin-top: 50px;\n  padding-top: 1rem;\n}\n\n@media only screen and (min-width: 766px) {\n  .margin-top {\n    padding-top: 1.8rem;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  .content {\n    flex-basis: 69.66666667% !important;\n    max-width: 69.66666667% !important;\n  }\n\n  .sidebar {\n    flex-basis: 30.33333333% !important;\n    max-width: 30.33333333% !important;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  .content {\n    padding-right: 40px !important;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .feed-entry-wrapper .entry-image {\n    width: 40% !important;\n    max-width: 40% !important;\n  }\n\n  .feed-entry-wrapper .entry-body {\n    width: 60% !important;\n    max-width: 60% !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  body.is-article .content {\n    max-width: 100% !important;\n  }\n}\n\n.row {\n  display: flex;\n  flex: 0 1 auto;\n  flex-flow: row wrap;\n  margin-left: -0.9375rem;\n  margin-right: -0.9375rem;\n}\n\n.row .col {\n  flex: 0 0 auto;\n  padding-left: 0.9375rem;\n  padding-right: 0.9375rem;\n}\n\n.row .col.s1 {\n  flex-basis: 8.33333%;\n  max-width: 8.33333%;\n}\n\n.row .col.s2 {\n  flex-basis: 16.66667%;\n  max-width: 16.66667%;\n}\n\n.row .col.s3 {\n  flex-basis: 25%;\n  max-width: 25%;\n}\n\n.row .col.s4 {\n  flex-basis: 33.33333%;\n  max-width: 33.33333%;\n}\n\n.row .col.s5 {\n  flex-basis: 41.66667%;\n  max-width: 41.66667%;\n}\n\n.row .col.s6 {\n  flex-basis: 50%;\n  max-width: 50%;\n}\n\n.row .col.s7 {\n  flex-basis: 58.33333%;\n  max-width: 58.33333%;\n}\n\n.row .col.s8 {\n  flex-basis: 66.66667%;\n  max-width: 66.66667%;\n}\n\n.row .col.s9 {\n  flex-basis: 75%;\n  max-width: 75%;\n}\n\n.row .col.s10 {\n  flex-basis: 83.33333%;\n  max-width: 83.33333%;\n}\n\n.row .col.s11 {\n  flex-basis: 91.66667%;\n  max-width: 91.66667%;\n}\n\n.row .col.s12 {\n  flex-basis: 100%;\n  max-width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  .row .col.m1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  .row .col.m2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  .row .col.m3 {\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .row .col.m4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  .row .col.m5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  .row .col.m6 {\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .row .col.m7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  .row .col.m8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  .row .col.m9 {\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .row .col.m10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  .row .col.m11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  .row .col.m12 {\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  .row .col.l1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  .row .col.l2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  .row .col.l3 {\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .row .col.l4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  .row .col.l5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  .row .col.l6 {\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .row .col.l7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  .row .col.l8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  .row .col.l9 {\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .row .col.l10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  .row .col.l11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  .row .col.l12 {\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\n.h1,\n.h2,\n.h3,\n.h4,\n.h5,\n.h6 {\n  margin-bottom: 0.5rem;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: 700;\n  line-height: 1.1;\n  color: inherit;\n}\n\nh1 {\n  font-size: 2.25rem;\n}\n\nh2 {\n  font-size: 1.875rem;\n}\n\nh3 {\n  font-size: 1.5625rem;\n}\n\nh4 {\n  font-size: 1.375rem;\n}\n\nh5 {\n  font-size: 1.125rem;\n}\n\nh6 {\n  font-size: 1rem;\n}\n\n.h1 {\n  font-size: 2.25rem;\n}\n\n.h2 {\n  font-size: 1.875rem;\n}\n\n.h3 {\n  font-size: 1.5625rem;\n}\n\n.h4 {\n  font-size: 1.375rem;\n}\n\n.h5 {\n  font-size: 1.125rem;\n}\n\n.h6 {\n  font-size: 1rem;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  margin-bottom: 1rem;\n}\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  color: inherit;\n  line-height: inherit;\n}\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\n\n/* Navigation Mobile\r\n========================================================================== */\n\n.nav-mob {\n  background: #4285f4;\n  color: #000;\n  height: 100vh;\n  left: 0;\n  padding: 0 20px;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  transition: .4s;\n  will-change: transform;\n  z-index: 997;\n}\n\n.nav-mob a {\n  color: inherit;\n}\n\n.nav-mob ul a {\n  display: block;\n  font-weight: 500;\n  padding: 8px 0;\n  text-transform: uppercase;\n  font-size: 14px;\n}\n\n.nav-mob-content {\n  background: #eee;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  bottom: 0;\n  left: 0;\n  padding: 20px 0;\n  position: absolute;\n  right: 0;\n  top: 50px;\n}\n\n.nav-mob ul,\n.nav-mob-subscribe,\n.nav-mob-follow {\n  border-bottom: solid 1px #DDD;\n  padding: 0 0.9375rem 20px 0.9375rem;\n  margin-bottom: 15px;\n}\n\n/* Navigation Mobile follow\r\n========================================================================== */\n\n.nav-mob-follow a {\n  font-size: 20px !important;\n  margin: 0 2px !important;\n  padding: 0;\n}\n\n.nav-mob-follow .i-facebook {\n  color: #fff;\n}\n\n.nav-mob-follow .i-twitter {\n  color: #fff;\n}\n\n.nav-mob-follow .i-google {\n  color: #fff;\n}\n\n.nav-mob-follow .i-instagram {\n  color: #fff;\n}\n\n.nav-mob-follow .i-youtube {\n  color: #fff;\n}\n\n.nav-mob-follow .i-github {\n  color: #fff;\n}\n\n.nav-mob-follow .i-linkedin {\n  color: #fff;\n}\n\n.nav-mob-follow .i-spotify {\n  color: #fff;\n}\n\n.nav-mob-follow .i-codepen {\n  color: #fff;\n}\n\n.nav-mob-follow .i-behance {\n  color: #fff;\n}\n\n.nav-mob-follow .i-dribbble {\n  color: #fff;\n}\n\n.nav-mob-follow .i-flickr {\n  color: #fff;\n}\n\n.nav-mob-follow .i-reddit {\n  color: #fff;\n}\n\n.nav-mob-follow .i-pocket {\n  color: #fff;\n}\n\n.nav-mob-follow .i-pinterest {\n  color: #fff;\n}\n\n.nav-mob-follow .i-feed {\n  color: #fff;\n}\n\n.nav-mob-follow .i-telegram {\n  color: #fff;\n}\n\n/* CopyRigh\r\n========================================================================== */\n\n.nav-mob-copyright {\n  color: #aaa;\n  font-size: 13px;\n  padding: 20px 15px 0;\n  text-align: center;\n  width: 100%;\n}\n\n.nav-mob-copyright a {\n  color: #4285f4;\n}\n\n/* subscribe\r\n========================================================================== */\n\n.nav-mob-subscribe .btn,\n.nav-mob-subscribe .nav-mob-follow a,\n.nav-mob-follow .nav-mob-subscribe a {\n  border-radius: 0;\n  text-transform: none;\n  width: 80px;\n}\n\n.nav-mob-subscribe .form-group {\n  width: calc(100% - 80px);\n}\n\n.nav-mob-subscribe input {\n  border: 0;\n  box-shadow: none !important;\n}\n\n/* Header Page\r\n========================================================================== */\n\n.header {\n  background: #4285f4;\n  height: 50px;\n  left: 0;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: 999;\n}\n\n.header-wrap a {\n  color: #fff;\n}\n\n.header-logo,\n.header-follow a,\n.header-menu a {\n  height: 50px;\n}\n\n.header-follow,\n.header-search,\n.header-logo {\n  flex: 0 0 auto;\n}\n\n.header-logo {\n  z-index: 998;\n  font-size: 1.25rem;\n  font-weight: 500;\n  letter-spacing: 1px;\n}\n\n.header-logo img {\n  max-height: 35px;\n  position: relative;\n}\n\n.header .nav-mob-toggle,\n.header .search-mob-toggle {\n  padding: 0;\n  z-index: 998;\n}\n\n.header .nav-mob-toggle {\n  margin-left: 0 !important;\n  margin-right: -0.9375rem;\n  position: relative;\n  transition: transform .4s;\n}\n\n.header .nav-mob-toggle span {\n  background-color: #fff;\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  transition: .4s;\n  width: 20px;\n}\n\n.header .nav-mob-toggle span:first-child {\n  transform: translate(0, -6px);\n}\n\n.header .nav-mob-toggle span:last-child {\n  transform: translate(0, 6px);\n}\n\n.header:not(.toolbar-shadow) {\n  background-color: transparent !important;\n}\n\n/* Header Navigation\r\n========================================================================== */\n\n.header-menu {\n  flex: 1 1 0;\n  overflow: hidden;\n  transition: flex .2s,margin .2s,width .2s;\n}\n\n.header-menu ul {\n  margin-left: 2rem;\n  white-space: nowrap;\n}\n\n.header-menu ul li {\n  padding-right: 15px;\n  display: inline-block;\n}\n\n.header-menu ul a {\n  padding: 0 8px;\n  position: relative;\n}\n\n.header-menu ul a:before {\n  background: #fff;\n  bottom: 0;\n  content: '';\n  height: 2px;\n  left: 0;\n  opacity: 0;\n  position: absolute;\n  transition: opacity .2s;\n  width: 100%;\n}\n\n.header-menu ul a:hover:before,\n.header-menu ul a.active:before {\n  opacity: 1;\n}\n\n/* header social\r\n========================================================================== */\n\n.header-follow a {\n  padding: 0 10px;\n}\n\n.header-follow a:hover {\n  color: rgba(255, 255, 255, 0.8);\n}\n\n.header-follow a:before {\n  font-size: 1.25rem !important;\n}\n\n/* Header search\r\n========================================================================== */\n\n.header-search {\n  background: #eee;\n  border-radius: 2px;\n  display: none;\n  height: 36px;\n  position: relative;\n  text-align: left;\n  transition: background .2s,flex .2s;\n  vertical-align: top;\n  margin-left: 1.5rem;\n  margin-right: 1.5rem;\n}\n\n.header-search .search-icon {\n  color: #757575;\n  font-size: 24px;\n  left: 24px;\n  position: absolute;\n  top: 12px;\n  transition: color .2s;\n}\n\ninput.search-field {\n  background: 0;\n  border: 0;\n  color: #212121;\n  height: 36px;\n  padding: 0 8px 0 72px;\n  transition: color .2s;\n  width: 100%;\n}\n\ninput.search-field:focus {\n  border: 0;\n  outline: none;\n}\n\n.search-popout {\n  background: #fff;\n  box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24), inset 0 4px 6px -4px rgba(0, 0, 0, 0.24);\n  margin-top: 10px;\n  max-height: calc(100vh - 150px);\n  margin-left: -64px;\n  overflow-y: auto;\n  position: absolute;\n  z-index: -1;\n}\n\n.search-popout.closed {\n  visibility: hidden;\n}\n\n.search-suggest-results {\n  padding: 0 8px 0 75px;\n}\n\n.search-suggest-results a {\n  color: #212121;\n  display: block;\n  margin-left: -8px;\n  outline: 0;\n  height: auto;\n  padding: 8px;\n  transition: background .2s;\n  font-size: 0.875rem;\n}\n\n.search-suggest-results a:first-child {\n  margin-top: 10px;\n}\n\n.search-suggest-results a:last-child {\n  margin-bottom: 10px;\n}\n\n.search-suggest-results a:hover {\n  background: #f7f7f7;\n}\n\n/* mediaquery medium\r\n========================================================================== */\n\n@media only screen and (min-width: 992px) {\n  .header-search {\n    background: rgba(255, 255, 255, 0.25);\n    box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.12);\n    color: #fff;\n    display: inline-block;\n    width: 200px;\n  }\n\n  .header-search:hover {\n    background: rgba(255, 255, 255, 0.4);\n  }\n\n  .header-search .search-icon {\n    top: 0px;\n  }\n\n  .header-search input,\n  .header-search input::placeholder,\n  .header-search .search-icon {\n    color: #fff;\n  }\n\n  .search-popout {\n    width: 100%;\n    margin-left: 0;\n  }\n\n  .header.is-showSearch .header-search {\n    background: #fff;\n    flex: 1 0 auto;\n  }\n\n  .header.is-showSearch .header-search .search-icon {\n    color: #757575 !important;\n  }\n\n  .header.is-showSearch .header-search input,\n  .header.is-showSearch .header-search input::placeholder {\n    color: #212121 !important;\n  }\n\n  .header.is-showSearch .header-menu {\n    flex: 0 0 auto;\n    margin: 0;\n    visibility: hidden;\n    width: 0;\n  }\n}\n\n/* Media Query\r\n========================================================================== */\n\n@media only screen and (max-width: 992px) {\n  .header-menu ul {\n    display: none;\n  }\n\n  .header.is-showSearchMob {\n    padding: 0;\n  }\n\n  .header.is-showSearchMob .header-logo,\n  .header.is-showSearchMob .nav-mob-toggle {\n    display: none;\n  }\n\n  .header.is-showSearchMob .header-search {\n    border-radius: 0;\n    display: inline-block !important;\n    height: 50px;\n    margin: 0;\n    width: 100%;\n  }\n\n  .header.is-showSearchMob .header-search input {\n    height: 50px;\n    padding-right: 48px;\n  }\n\n  .header.is-showSearchMob .header-search .search-popout {\n    margin-top: 0;\n  }\n\n  .header.is-showSearchMob .search-mob-toggle {\n    border: 0;\n    color: #757575;\n    position: absolute;\n    right: 0;\n  }\n\n  .header.is-showSearchMob .search-mob-toggle:before {\n    content: \"\" !important;\n  }\n\n  body.is-showNavMob {\n    overflow: hidden;\n  }\n\n  body.is-showNavMob .nav-mob {\n    transform: translateX(0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle {\n    border: 0;\n    transform: rotate(90deg);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:first-child {\n    transform: rotate(45deg) translate(0, 0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:nth-child(2) {\n    transform: scaleX(0);\n  }\n\n  body.is-showNavMob .nav-mob-toggle span:last-child {\n    transform: rotate(-45deg) translate(0, 0);\n  }\n\n  body.is-showNavMob .search-mob-toggle {\n    display: none;\n  }\n\n  body.is-showNavMob .main,\n  body.is-showNavMob .footer {\n    transform: translateX(-25%);\n  }\n}\n\n.cover {\n  background: #4285f4;\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);\n  color: #fff;\n  letter-spacing: .2px;\n  min-height: 550px;\n  position: relative;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n  z-index: 2;\n}\n\n.cover-wrap {\n  margin: 0 auto;\n  max-width: 1050px;\n  padding: 16px;\n  position: relative;\n  text-align: center;\n  z-index: 99;\n}\n\n.cover-title {\n  font-size: 3.5rem;\n  margin: 0 0 50px;\n  line-height: 1;\n  font-weight: 700;\n}\n\n.cover-description {\n  max-width: 600px;\n}\n\n.cover-background {\n  background-attachment: fixed;\n}\n\n.cover .mouse {\n  width: 25px;\n  position: absolute;\n  height: 36px;\n  border-radius: 15px;\n  border: 2px solid #888;\n  border: 2px solid rgba(255, 255, 255, 0.27);\n  bottom: 40px;\n  right: 40px;\n  margin-left: -12px;\n  cursor: pointer;\n  transition: border-color 0.2s ease-in;\n}\n\n.cover .mouse .scroll {\n  display: block;\n  margin: 6px auto;\n  width: 3px;\n  height: 6px;\n  border-radius: 4px;\n  background: rgba(255, 255, 255, 0.68);\n  animation-duration: 2s;\n  animation-name: scroll;\n  animation-iteration-count: infinite;\n}\n\n.author a {\n  color: #FFF !important;\n}\n\n.author-header {\n  margin-top: 10%;\n}\n\n.author-name-wrap {\n  display: inline-block;\n}\n\n.author-title {\n  display: block;\n  text-transform: uppercase;\n}\n\n.author-name {\n  margin: 5px 0;\n  font-size: 1.75rem;\n}\n\n.author-bio {\n  margin: 1.5rem 0;\n  line-height: 1.8;\n  font-size: 18px;\n  max-width: 700px;\n}\n\n.author-avatar {\n  display: inline-block;\n  border-radius: 90px;\n  margin-right: 10px;\n  width: 80px;\n  height: 80px;\n  background-size: cover;\n  background-position: center;\n  vertical-align: bottom;\n}\n\n.author-meta {\n  margin-bottom: 20px;\n}\n\n.author-meta span {\n  display: inline-block;\n  font-size: 17px;\n  font-style: italic;\n  margin: 0 2rem 1rem 0;\n  opacity: 0.8;\n  word-wrap: break-word;\n}\n\n.author .author-link:hover {\n  opacity: 1;\n}\n\n.author-follow a {\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  cursor: pointer;\n  display: inline-block;\n  height: 40px;\n  letter-spacing: 1px;\n  line-height: 40px;\n  margin: 0 10px;\n  padding: 0 16px;\n  text-shadow: none;\n  text-transform: uppercase;\n}\n\n.author-follow a:hover {\n  box-shadow: inset 0 0 0 2px #fff;\n}\n\n.home-down {\n  animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100;\n}\n\n@media only screen and (min-width: 766px) {\n  .cover-description {\n    font-size: 1.25rem;\n  }\n}\n\n@media only screen and (max-width: 766px) {\n  .cover {\n    padding-top: 50px;\n    padding-bottom: 20px;\n  }\n\n  .cover-title {\n    font-size: 2rem;\n  }\n\n  .author-avatar {\n    display: block;\n    margin: 0 auto 10px auto;\n  }\n}\n\n.feed-entry-content .feed-entry-wrapper:last-child .entry:last-child {\n  padding: 0;\n  border: none;\n}\n\n.entry {\n  margin-bottom: 1.5rem;\n  padding: 0 15px 15px;\n}\n\n.entry-image--link {\n  height: 180px;\n  margin: 0 -15px;\n  overflow: hidden;\n}\n\n.entry-image--link:hover .entry-image--bg {\n  transform: scale(1.03);\n  backface-visibility: hidden;\n}\n\n.entry-image--bg {\n  transition: transform 0.3s;\n}\n\n.entry-video-play {\n  border-radius: 50%;\n  border: 2px solid #fff;\n  color: #fff;\n  font-size: 3.5rem;\n  height: 65px;\n  left: 50%;\n  line-height: 65px;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  width: 65px;\n  z-index: 10;\n}\n\n.entry-category {\n  margin-bottom: 5px;\n  text-transform: capitalize;\n  font-size: 0.875rem;\n  line-height: 1;\n}\n\n.entry-category a:active {\n  text-decoration: underline;\n}\n\n.entry-title {\n  color: #000;\n  font-size: 1.25rem;\n  height: auto;\n  line-height: 1.2;\n  margin: 0 0 .5rem;\n  padding: 0;\n}\n\n.entry-title:hover {\n  color: #777;\n}\n\n.entry-byline {\n  margin-top: 0;\n  margin-bottom: 0.5rem;\n  color: #999;\n  font-size: 0.8125rem;\n}\n\n.entry-byline a {\n  color: inherit;\n}\n\n.entry-byline a:hover {\n  color: #333;\n}\n\n.entry-body {\n  padding-top: 20px;\n}\n\n/* Entry small --small\r\n========================================================================== */\n\n.entry.entry--small {\n  margin-bottom: 24px;\n  padding: 0;\n}\n\n.entry.entry--small .entry-image {\n  margin-bottom: 10px;\n}\n\n.entry.entry--small .entry-image--link {\n  height: 170px;\n  margin: 0;\n}\n\n.entry.entry--small .entry-title {\n  font-size: 1rem;\n  font-weight: 500;\n  line-height: 1.2;\n  text-transform: capitalize;\n}\n\n.entry.entry--small .entry-byline {\n  margin: 0;\n}\n\n@media only screen and (min-width: 992px) {\n  .entry {\n    margin-bottom: 40px;\n    padding: 0;\n  }\n\n  .entry-title {\n    font-size: 21px;\n  }\n\n  .entry-body {\n    padding-right: 35px !important;\n  }\n\n  .entry-image {\n    margin-bottom: 0;\n  }\n\n  .entry-image--link {\n    height: 180px;\n    margin: 0;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  .entry-image--link {\n    height: 218px;\n  }\n}\n\n.footer {\n  color: rgba(0, 0, 0, 0.44);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1;\n  padding: 1.6rem 15px;\n  text-align: center;\n}\n\n.footer a {\n  color: rgba(0, 0, 0, 0.6);\n}\n\n.footer a:hover {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n.footer-wrap {\n  margin: 0 auto;\n  max-width: 1400px;\n}\n\n.footer .heart {\n  animation: heartify .5s infinite alternate;\n  color: red;\n}\n\n.footer-copy,\n.footer-design-author {\n  display: inline-block;\n  padding: .5rem 0;\n  vertical-align: middle;\n}\n\n.footer-follow {\n  padding: 20px 0;\n}\n\n.footer-follow a {\n  font-size: 20px;\n  margin: 0 5px;\n  color: rgba(0, 0, 0, 0.8);\n}\n\n@keyframes heartify {\n  0% {\n    transform: scale(0.8);\n  }\n}\n\n.btn,\n.nav-mob-follow a {\n  background-color: #fff;\n  border-radius: 2px;\n  border: 0;\n  box-shadow: none;\n  color: #039be5;\n  cursor: pointer;\n  display: inline-block;\n  font: 500 14px/20px \"Roboto\", sans-serif;\n  height: 36px;\n  margin: 0;\n  min-width: 36px;\n  outline: 0;\n  overflow: hidden;\n  padding: 8px;\n  text-align: center;\n  text-decoration: none;\n  text-overflow: ellipsis;\n  text-transform: uppercase;\n  transition: background-color .2s,box-shadow .2s;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n.btn + .btn,\n.nav-mob-follow a + .btn,\n.nav-mob-follow .btn + a,\n.nav-mob-follow a + a {\n  margin-left: 8px;\n}\n\n.btn:focus,\n.nav-mob-follow a:focus,\n.btn:hover,\n.nav-mob-follow a:hover {\n  background-color: #e1f3fc;\n  text-decoration: none !important;\n}\n\n.btn:active,\n.nav-mob-follow a:active {\n  background-color: #c3e7f9;\n}\n\n.btn.btn-lg,\n.nav-mob-follow a.btn-lg {\n  font-size: 1.5rem;\n  min-width: 48px;\n  height: 48px;\n  line-height: 48px;\n}\n\n.btn.btn-flat,\n.nav-mob-follow a.btn-flat {\n  background: 0;\n  box-shadow: none;\n}\n\n.btn.btn-flat:focus,\n.nav-mob-follow a.btn-flat:focus,\n.btn.btn-flat:hover,\n.nav-mob-follow a.btn-flat:hover,\n.btn.btn-flat:active,\n.nav-mob-follow a.btn-flat:active {\n  background: 0;\n  box-shadow: none;\n}\n\n.btn.btn-primary,\n.nav-mob-follow a.btn-primary {\n  background-color: #4285f4;\n  color: #fff;\n}\n\n.btn.btn-primary:hover,\n.nav-mob-follow a.btn-primary:hover {\n  background-color: #2f79f3;\n}\n\n.btn.btn-circle,\n.nav-mob-follow a.btn-circle {\n  border-radius: 50%;\n  height: 40px;\n  line-height: 40px;\n  padding: 0;\n  width: 40px;\n}\n\n.btn.btn-circle-small,\n.nav-mob-follow a.btn-circle-small {\n  border-radius: 50%;\n  height: 32px;\n  line-height: 32px;\n  padding: 0;\n  width: 32px;\n  min-width: 32px;\n}\n\n.btn.btn-shadow,\n.nav-mob-follow a.btn-shadow {\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);\n  color: #333;\n  background-color: #eee;\n}\n\n.btn.btn-shadow:hover,\n.nav-mob-follow a.btn-shadow:hover {\n  background-color: rgba(0, 0, 0, 0.12);\n}\n\n.btn.btn-download-cloud,\n.nav-mob-follow a.btn-download-cloud,\n.btn.btn-download,\n.nav-mob-follow a.btn-download {\n  background-color: #4285f4;\n  color: #fff;\n}\n\n.btn.btn-download-cloud:hover,\n.nav-mob-follow a.btn-download-cloud:hover,\n.btn.btn-download:hover,\n.nav-mob-follow a.btn-download:hover {\n  background-color: #1b6cf2;\n}\n\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after,\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  margin-left: 5px;\n  font-size: 1.1rem;\n  display: inline-block;\n  vertical-align: top;\n}\n\n.btn.btn-download:after,\n.nav-mob-follow a.btn-download:after {\n  content: \"\";\n}\n\n.btn.btn-download-cloud:after,\n.nav-mob-follow a.btn-download-cloud:after {\n  content: \"\";\n}\n\n.btn.external:after,\n.nav-mob-follow a.external:after {\n  font-size: 1rem;\n}\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n}\n\n.form-control {\n  width: 100%;\n  padding: 8px 12px;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 0px;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\n  height: 36px;\n}\n\n.form-control:focus {\n  border-color: #4285f4;\n  outline: 0;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(66, 133, 244, 0.6);\n}\n\n.btn-subscribe-home {\n  background-color: transparent;\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #ffffff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  max-width: 300px;\n  padding: 15px 10px;\n  transition: all 0.3s;\n  width: 100%;\n}\n\n.btn-subscribe-home:hover {\n  box-shadow: inset 0 0 0 2px #fff;\n}\n\n/*  Post\n========================================================================== */\n\n.post-wrapper {\n  margin-top: 50px;\n  padding-top: 1.8rem;\n}\n\n.post-header {\n  margin-bottom: 1.2rem;\n}\n\n.post-title {\n  color: #000;\n  font-size: 2.5rem;\n  height: auto;\n  line-height: 1.04;\n  margin: 0 0 0.9375rem;\n  letter-spacing: -.028em !important;\n  padding: 0;\n}\n\n.post-excerpt {\n  line-height: 1.3em;\n  font-size: 20px;\n  color: #7D7D7D;\n  margin-bottom: 8px;\n}\n\n.post-image {\n  margin-bottom: 30px;\n  overflow: hidden;\n}\n\n.post-body {\n  margin-bottom: 2rem;\n}\n\n.post-body a:focus {\n  text-decoration: underline;\n}\n\n.post-body h2 {\n  font-weight: 500;\n  margin: 2.50rem 0 1.25rem;\n  padding-bottom: 3px;\n}\n\n.post-body h3,\n.post-body h4 {\n  margin: 32px 0 16px;\n}\n\n.post-body iframe {\n  display: block !important;\n  margin: 0 auto 1.5rem 0 !important;\n}\n\n.post-body img {\n  display: block;\n  margin-bottom: 1rem;\n}\n\n.post-body h2 a,\n.post-body h3 a,\n.post-body h4 a {\n  color: #4285f4;\n}\n\n.post-tags {\n  margin: 1.25rem 0;\n}\n\n.post-card {\n  padding: 15px;\n}\n\n/* Post author by line top (author - time - tag - sahre)\n========================================================================== */\n\n.post-byline {\n  color: #999;\n  font-size: 14px;\n  flex-grow: 1;\n  letter-spacing: -.028em !important;\n}\n\n.post-byline a {\n  color: inherit;\n}\n\n.post-byline a:active {\n  text-decoration: underline;\n}\n\n.post-byline a:hover {\n  color: #222;\n}\n\n.post-actions--top .share {\n  margin-right: 10px;\n  font-size: 20px;\n}\n\n.post-actions--top .share:hover {\n  opacity: .7;\n}\n\n.post-action-comments {\n  color: #999;\n  margin-right: 15px;\n  font-size: 14px;\n}\n\n/* Post Action social media\n========================================================================== */\n\n.post-actions {\n  position: relative;\n  margin-bottom: 1.5rem;\n}\n\n.post-actions a {\n  color: #fff;\n  font-size: 1.125rem;\n}\n\n.post-actions a:hover {\n  background-color: #000 !important;\n}\n\n.post-actions li {\n  margin-left: 6px;\n}\n\n.post-actions li:first-child {\n  margin-left: 0 !important;\n}\n\n.post-actions .btn,\n.post-actions .nav-mob-follow a,\n.nav-mob-follow .post-actions a {\n  border-radius: 0;\n}\n\n/* Post author widget bottom\n========================================================================== */\n\n.post-author {\n  position: relative;\n  font-size: 15px;\n  padding: 30px 0 30px 100px;\n  margin-bottom: 3rem;\n  background-color: #f3f5f6;\n}\n\n.post-author h5 {\n  color: #AAA;\n  font-size: 12px;\n  line-height: 1.5;\n  margin: 0;\n  font-weight: 500;\n}\n\n.post-author li {\n  margin-left: 30px;\n  font-size: 14px;\n}\n\n.post-author li a {\n  color: #555;\n}\n\n.post-author li a:hover {\n  color: #000;\n}\n\n.post-author li:first-child {\n  margin-left: 0;\n}\n\n.post-author .post-author-avatar {\n  height: 64px;\n  width: 64px;\n  position: absolute;\n  left: 20px;\n  top: 30px;\n  background-position: center center;\n  background-size: cover;\n  border-radius: 50%;\n}\n\n/* bottom share and bottom subscribe\n========================================================================== */\n\n.share-subscribe {\n  margin-bottom: 1rem;\n}\n\n.share-subscribe p {\n  color: #7d7d7d;\n  margin-bottom: 1rem;\n  line-height: 1;\n  font-size: 0.875rem;\n}\n\n.share-subscribe .social-share {\n  float: none !important;\n}\n\n.share-subscribe > div {\n  position: relative;\n  overflow: hidden;\n  margin-bottom: 15px;\n}\n\n.share-subscribe > div:before {\n  content: \" \";\n  border-top: solid 1px #000;\n  position: absolute;\n  top: 0;\n  left: 15px;\n  width: 40px;\n  height: 1px;\n}\n\n.share-subscribe > div h5 {\n  font-size: 0.875rem;\n  margin: 1rem 0;\n  line-height: 1;\n  text-transform: uppercase;\n  font-weight: 500;\n}\n\n.share-subscribe .newsletter-form {\n  display: flex;\n}\n\n.share-subscribe .newsletter-form .form-group {\n  max-width: 250px;\n  width: 100%;\n}\n\n.share-subscribe .newsletter-form .btn,\n.share-subscribe .newsletter-form .nav-mob-follow a,\n.nav-mob-follow .share-subscribe .newsletter-form a {\n  border-radius: 0;\n}\n\n/* Related post\n========================================================================== */\n\n.post-related {\n  margin-top: 40px;\n}\n\n.post-related-title {\n  color: #000;\n  font-size: 18px;\n  font-weight: 500;\n  height: auto;\n  line-height: 17px;\n  margin: 0 0 20px;\n  padding-bottom: 10px;\n  text-transform: uppercase;\n}\n\n.post-related-list {\n  margin-bottom: 18px;\n  padding: 0;\n  border: none;\n}\n\n/* Media Query (medium)\n========================================================================== */\n\n@media only screen and (min-width: 766px) {\n  .post .title {\n    font-size: 2.25rem;\n    margin: 0 0 1rem;\n  }\n\n  .post-body {\n    font-size: 1.125rem;\n    line-height: 32px;\n  }\n\n  .post-body p {\n    margin-bottom: 1.5rem;\n  }\n\n  .post-card {\n    padding: 30px;\n  }\n}\n\n@media only screen and (max-width: 640px) {\n  .post-title {\n    font-size: 1.8rem;\n  }\n\n  .post-image,\n  .video-responsive {\n    margin-left: -0.9375rem;\n    margin-right: -0.9375rem;\n  }\n}\n\n/* sidebar\r\n========================================================================== */\n\n.sidebar {\n  position: relative;\n  line-height: 1.6;\n}\n\n.sidebar h1,\n.sidebar h2,\n.sidebar h3,\n.sidebar h4,\n.sidebar h5,\n.sidebar h6 {\n  margin-top: 0;\n  color: #000;\n}\n\n.sidebar-items {\n  margin-bottom: 2.5rem;\n  padding: 25px;\n  position: relative;\n}\n\n.sidebar-title {\n  padding-bottom: 10px;\n  margin-bottom: 1rem;\n  text-transform: uppercase;\n  font-size: 1rem;\n}\n\n.sidebar .title-primary {\n  background-color: #4285f4;\n  color: #FFF;\n  padding: 10px 16px;\n  font-size: 18px;\n}\n\n.sidebar-post--border {\n  align-items: center;\n  border-left: 3px solid #4285f4;\n  bottom: 0;\n  color: rgba(0, 0, 0, 0.2);\n  display: flex;\n  font-size: 28px;\n  font-weight: bold;\n  left: 0;\n  line-height: 1;\n  padding: 15px 10px 10px;\n  position: absolute;\n  top: 0;\n}\n\n.sidebar-post:nth-child(3n) .sidebar-post--border {\n  border-color: #f59e00;\n}\n\n.sidebar-post:nth-child(3n+2) .sidebar-post--border {\n  border-color: #00a034;\n}\n\n.sidebar-post--link {\n  display: block;\n  min-height: 50px;\n  padding: 10px 15px 10px 55px;\n  position: relative;\n}\n\n.sidebar-post--link:hover .sidebar-post--border {\n  background-color: #e5eff5;\n}\n\n.sidebar-post--title {\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 16px;\n  font-weight: 500;\n  margin: 0;\n}\n\n.subscribe {\n  min-height: 90vh;\n  padding-top: 50px;\n}\n\n.subscribe h3 {\n  margin: 0;\n  margin-bottom: 8px;\n  font: 400 20px/32px \"Roboto\", sans-serif;\n}\n\n.subscribe-title {\n  font-weight: 400;\n  margin-top: 0;\n}\n\n.subscribe-wrap {\n  max-width: 700px;\n  color: #7d878a;\n  padding: 1rem 0;\n}\n\n.subscribe .form-group {\n  margin-bottom: 1.5rem;\n}\n\n.subscribe .form-group.error input {\n  border-color: #ff5b5b;\n}\n\n.subscribe .btn,\n.subscribe .nav-mob-follow a,\n.nav-mob-follow .subscribe a {\n  width: 100%;\n}\n\n.subscribe-form {\n  position: relative;\n  margin: 30px auto;\n  padding: 40px;\n  max-width: 400px;\n  width: 100%;\n  background: #ebeff2;\n  border-radius: 5px;\n  text-align: left;\n}\n\n.subscribe-input {\n  width: 100%;\n  padding: 10px;\n  border: #4285f4  1px solid;\n  border-radius: 2px;\n}\n\n.subscribe-input:focus {\n  outline: none;\n}\n\n.animated {\n  animation-duration: 1s;\n  animation-fill-mode: both;\n}\n\n.animated.infinite {\n  animation-iteration-count: infinite;\n}\n\n.bounceIn {\n  animation-name: bounceIn;\n}\n\n.bounceInDown {\n  animation-name: bounceInDown;\n}\n\n.slideInUp {\n  animation-name: slideInUp;\n}\n\n.slideOutDown {\n  animation-name: slideOutDown;\n}\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    transform: none;\n  }\n}\n\n@keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    transform: translateY(0px);\n  }\n\n  100% {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n}\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0);\n  }\n}\n\n","@font-face {\r\n  font-family: 'mapache';\r\n  src:\r\n    url('../fonts/mapache.ttf?g7hms8') format('truetype'),\r\n    url('../fonts/mapache.woff?g7hms8') format('woff'),\r\n    url('../fonts/mapache.svg?g7hms8#mapache') format('svg');\r\n  font-weight: normal;\r\n  font-style: normal;\r\n}\r\n\r\n[class^=\"i-\"]:before, [class*=\" i-\"]:before {\r\n  /* use !important to prevent issues with browser extensions that change fonts */\r\n  font-family: 'mapache' !important;\r\n  speak: none;\r\n  font-style: normal;\r\n  font-weight: normal;\r\n  font-variant: normal;\r\n  text-transform: none;\r\n  line-height: inherit;\r\n\r\n  /* Better Font Rendering =========== */\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n\r\n.i-navigate_before:before {\r\n  content: \"\\e408\";\r\n}\r\n.i-navigate_next:before {\r\n  content: \"\\e409\";\r\n}\r\n.i-tag:before {\r\n  content: \"\\e54e\";\r\n}\r\n.i-keyboard_arrow_down:before {\r\n  content: \"\\e313\";\r\n}\r\n.i-arrow_upward:before {\r\n  content: \"\\e5d8\";\r\n}\r\n.i-cloud_download:before {\r\n  content: \"\\e2c0\";\r\n}\r\n.i-star:before {\r\n  content: \"\\e838\";\r\n}\r\n.i-keyboard_arrow_up:before {\r\n  content: \"\\e316\";\r\n}\r\n.i-open_in_new:before {\r\n  content: \"\\e89e\";\r\n}\r\n.i-warning:before {\r\n  content: \"\\e002\";\r\n}\r\n.i-back:before {\r\n  content: \"\\e5c4\";\r\n}\r\n.i-forward:before {\r\n  content: \"\\e5c8\";\r\n}\r\n.i-chat:before {\r\n  content: \"\\e0cb\";\r\n}\r\n.i-close:before {\r\n  content: \"\\e5cd\";\r\n}\r\n.i-code2:before {\r\n  content: \"\\e86f\";\r\n}\r\n.i-favorite:before {\r\n  content: \"\\e87d\";\r\n}\r\n.i-link:before {\r\n  content: \"\\e157\";\r\n}\r\n.i-menu:before {\r\n  content: \"\\e5d2\";\r\n}\r\n.i-feed:before {\r\n  content: \"\\e0e5\";\r\n}\r\n.i-search:before {\r\n  content: \"\\e8b6\";\r\n}\r\n.i-share:before {\r\n  content: \"\\e80d\";\r\n}\r\n.i-check_circle:before {\r\n  content: \"\\e86c\";\r\n}\r\n.i-play:before {\r\n  content: \"\\e901\";\r\n}\r\n.i-download:before {\r\n  content: \"\\e900\";\r\n}\r\n.i-code:before {\r\n  content: \"\\f121\";\r\n}\r\n.i-behance:before {\r\n  content: \"\\f1b4\";\r\n}\r\n.i-spotify:before {\r\n  content: \"\\f1bc\";\r\n}\r\n.i-codepen:before {\r\n  content: \"\\f1cb\";\r\n}\r\n.i-github:before {\r\n  content: \"\\f09b\";\r\n}\r\n.i-linkedin:before {\r\n  content: \"\\f0e1\";\r\n}\r\n.i-flickr:before {\r\n  content: \"\\f16e\";\r\n}\r\n.i-dribbble:before {\r\n  content: \"\\f17d\";\r\n}\r\n.i-pinterest:before {\r\n  content: \"\\f231\";\r\n}\r\n.i-map:before {\r\n  content: \"\\f041\";\r\n}\r\n.i-twitter:before {\r\n  content: \"\\f099\";\r\n}\r\n.i-facebook:before {\r\n  content: \"\\f09a\";\r\n}\r\n.i-youtube:before {\r\n  content: \"\\f16a\";\r\n}\r\n.i-instagram:before {\r\n  content: \"\\f16d\";\r\n}\r\n.i-google:before {\r\n  content: \"\\f1a0\";\r\n}\r\n.i-pocket:before {\r\n  content: \"\\f265\";\r\n}\r\n.i-reddit:before {\r\n  content: \"\\f281\";\r\n}\r\n.i-snapchat:before {\r\n  content: \"\\f2ac\";\r\n}\r\n.i-telegram:before {\r\n  content: \"\\f2c6\";\r\n}\r\n","/*\r\n@package godofredoninja\r\n\r\n========================================================================\r\nMapache variables styles\r\n========================================================================\r\n*/\r\n\r\n/**\r\n* Table of Contents:\r\n*\r\n*   1. Colors\r\n*   2. Fonts\r\n*   3. Typography\r\n*   4. Header\r\n*   5. Footer\r\n*   6. Code Syntax\r\n*   7. buttons\r\n*   8. container\r\n*   9. Grid\r\n*   10. Media Query Ranges\r\n*   11. Icons\r\n*/\r\n\r\n\r\n/* 1. Colors\r\n========================================================================== */\r\n$primary-color        : #4285f4;\r\n// $primary-color        : #2856b6;\r\n\r\n$primary-text-color:  #333;\r\n$secondary-text-color:  #999;\r\n$accent-color:      #eee;\r\n\r\n$divider-color:     #DDDDDD;\r\n\r\n// $link-color     : #4184F3;\r\n$link-color     : #039be5;\r\n// $color-bg-page  : #EEEEEE;\r\n\r\n\r\n// social colors\r\n$social-colors: (\r\n  facebook    : #3b5998,\r\n  twitter     : #55acee,\r\n  google    : #dd4b39,\r\n  instagram   : #306088,\r\n  youtube     : #e52d27,\r\n  github      : #333333,\r\n  linkedin    : #007bb6,\r\n  spotify     : #2ebd59,\r\n  codepen     : #222222,\r\n  behance     : #131418,\r\n  dribbble    : #ea4c89,\r\n  flickr       : #0063DC,\r\n  reddit    : orangered,\r\n  pocket    : #F50057,\r\n  pinterest   : #bd081c,\r\n  feed    : orange,\r\n  telegram : #08c,\r\n);\r\n\r\n\r\n\r\n/* 2. Fonts\r\n========================================================================== */\r\n$primary-font:    'Roboto', sans-serif; // font default page\r\n$code-font:     'Roboto Mono', monospace; // font for code and pre\r\n\r\n\r\n/* 3. Typography\r\n========================================================================== */\r\n\r\n$spacer:                   1rem;\r\n$line-height:              1.5;\r\n\r\n$font-size-root:           16px;\r\n\r\n$font-size-base:           1rem;\r\n$font-size-lg:             1.25rem; // 20px\r\n$font-size-sm:             .875rem; //14px\r\n$font-size-xs:             .0.8125; //13px\r\n\r\n$font-size-h1:             2.25rem;\r\n$font-size-h2:             1.875rem;\r\n$font-size-h3:             1.5625rem;\r\n$font-size-h4:             1.375rem;\r\n$font-size-h5:             1.125rem;\r\n$font-size-h6:             1rem;\r\n\r\n\r\n$headings-margin-bottom:   ($spacer / 2);\r\n$headings-font-family:     $primary-font;\r\n$headings-font-weight:     700;\r\n$headings-line-height:     1.1;\r\n$headings-color:           inherit;\r\n\r\n$font-weight:       500;\r\n\r\n$blockquote-font-size:     1.125rem;\r\n\r\n\r\n/* 4. Header\r\n========================================================================== */\r\n$header-bg: $primary-color;\r\n$header-color: #fff;\r\n$header-height: 50px;\r\n$header-search-bg: #eee;\r\n$header-search-color: #757575;\r\n\r\n\r\n/* 5. Entry articles\r\n========================================================================== */\r\n$entry-color-title: #000;\r\n$entry-color-title-hover: #777;\r\n$entry-font-size: 1.75rem; // 28px\r\n$entry-font-size-mb: 1.25rem; // 20px\r\n$entry-font-size-byline: 0.8125rem; // 13px\r\n$entry-color-byline: #999;\r\n\r\n/* 5. Footer\r\n========================================================================== */\r\n// $footer-bg-color:   #000;\r\n$footer-color-link: rgba(0, 0, 0, .6);\r\n$footer-color:      rgba(0, 0, 0, .44);\r\n\r\n\r\n/* 6. Code Syntax\r\n========================================================================== */\r\n$code-bg-color:       #f7f7f7;\r\n$font-size-code:      0.9375rem;\r\n$code-color:        #c7254e;\r\n$pre-code-color:        #37474f;\r\n\r\n\r\n/* 7. buttons\r\n========================================================================== */\r\n$btn-primary-color:       $primary-color;\r\n$btn-secondary-color:     #039be5;\r\n$btn-background-color:    #e1f3fc;\r\n$btn-active-background:   #c3e7f9;\r\n\r\n/* 8. container\r\n========================================================================== */\r\n\r\n$grid-gutter-width:        1.875rem; // 30px\r\n\r\n$container-sm:             576px;\r\n$container-md:             750px;\r\n$container-lg:             970px;\r\n$container-xl:             1250px;\r\n\r\n\r\n/* 9. Grid\r\n========================================================================== */\r\n$num-cols: 12;\r\n$gutter-width: 1.875rem;\r\n$element-top-margin: $gutter-width/3;\r\n$element-bottom-margin: ($gutter-width*2)/3;\r\n\r\n\r\n/* 10. Media Query Ranges\r\n========================================================================== */\r\n$sm:            640px;\r\n$md:            766px;\r\n$lg:            992px;\r\n$xl:            1230px;\r\n\r\n$sm-and-up:     \"only screen and (min-width : #{$sm})\";\r\n$md-and-up:     \"only screen and (min-width : #{$md})\";\r\n$lg-and-up:     \"only screen and (min-width : #{$lg})\";\r\n$xl-and-up:     \"only screen and (min-width : #{$xl})\";\r\n\r\n$sm-and-down:   \"only screen and (max-width : #{$sm})\";\r\n$md-and-down:   \"only screen and (max-width : #{$md})\";\r\n$lg-and-down:   \"only screen and (max-width : #{$lg})\";\r\n\r\n\r\n/* 11. icons\r\n========================================================================== */\r\n$i-open_in_new:      '\\e89e';\r\n$i-warning:          '\\e002';\r\n$i-star:             '\\e838';\r\n$i-download:         '\\e900';\r\n$i-cloud_download:   '\\e2c0';\r\n$i-check_circle:     '\\e86c';\r\n$i-play:       \"\\e901\";\r\n$i-code:       \"\\f121\";\r\n$i-close:      \"\\e5cd\";\r\n","/* Header Page\r\n========================================================================== */\r\n.header{\r\n  background: $primary-color;\r\n  // color: $header-color;\r\n  height: $header-height;\r\n  left: 0;\r\n  padding-left: 1rem;\r\n  padding-right: 1rem;\r\n  position: fixed;\r\n  right: 0;\r\n  top: 0;\r\n  z-index: 999;\r\n\r\n  &-wrap a{ color: $header-color;}\r\n\r\n  &-logo,\r\n  &-follow a,\r\n  &-menu a{\r\n    height: $header-height;\r\n    @extend .u-flex-center;\r\n  }\r\n\r\n  &-follow,\r\n  &-search,\r\n  &-logo{\r\n    flex: 0 0 auto;\r\n  }\r\n\r\n  // Logo\r\n  &-logo{\r\n    z-index: 998;\r\n    font-size: $font-size-lg;\r\n    font-weight: 500;\r\n    letter-spacing: 1px;\r\n    img{\r\n      max-height: 35px;\r\n      position: relative;\r\n    }\r\n  }\r\n\r\n  .nav-mob-toggle,\r\n  .search-mob-toggle{\r\n    padding: 0;\r\n    z-index: 998;\r\n  }\r\n\r\n  // btn mobile menu open and close\r\n  .nav-mob-toggle{\r\n    margin-left: 0 !important;\r\n    margin-right: - ($grid-gutter-width / 2);\r\n    position: relative;\r\n    transition: transform .4s;\r\n\r\n    span {\r\n       background-color: $header-color;\r\n       display: block;\r\n       height: 2px;\r\n       left: 14px;\r\n       margin-top: -1px;\r\n       position: absolute;\r\n       top: 50%;\r\n       transition: .4s;\r\n       width: 20px;\r\n       &:first-child { transform: translate(0,-6px); }\r\n       &:last-child { transform: translate(0,6px); }\r\n    }\r\n\r\n  }\r\n\r\n  // Shodow for header\r\n  &.toolbar-shadow{ @extend %primary-box-shadow; }\r\n  &:not(.toolbar-shadow) { background-color: transparent!important; }\r\n\r\n}\r\n\r\n\r\n/* Header Navigation\r\n========================================================================== */\r\n.header-menu{\r\n  flex: 1 1 0;\r\n  overflow: hidden;\r\n  transition: flex .2s,margin .2s,width .2s;\r\n\r\n  ul{\r\n    margin-left: 2rem;\r\n    white-space: nowrap;\r\n\r\n    li{ padding-right: 15px; display: inline-block;}\r\n\r\n    a{\r\n      padding: 0 8px;\r\n      position: relative;\r\n\r\n      &:before{\r\n        background: $header-color;\r\n        bottom: 0;\r\n        content: '';\r\n        height: 2px;\r\n        left: 0;\r\n        opacity: 0;\r\n        position: absolute;\r\n        transition: opacity .2s;\r\n        width: 100%;\r\n      }\r\n      &:hover:before,\r\n      &.active:before{\r\n        opacity: 1;\r\n      }\r\n    }\r\n\r\n  }\r\n}\r\n\r\n\r\n/* header social\r\n========================================================================== */\r\n.header-follow a {\r\n  padding: 0 10px;\r\n  &:hover{color: rgba(255, 255, 255, 0.80)}\r\n  &:before{font-size: $font-size-lg !important;}\r\n\r\n}\r\n\r\n\r\n\r\n/* Header search\r\n========================================================================== */\r\n.header-search{\r\n  background: #eee;\r\n  border-radius: 2px;\r\n  display: none;\r\n  // flex: 0 0 auto;\r\n  height: 36px;\r\n  position: relative;\r\n  text-align: left;\r\n  transition: background .2s,flex .2s;\r\n  vertical-align: top;\r\n  margin-left: 1.5rem;\r\n  margin-right: 1.5rem;\r\n\r\n  .search-icon{\r\n    color: #757575;\r\n    font-size: 24px;\r\n    left: 24px;\r\n    position: absolute;\r\n    top: 12px;\r\n    transition: color .2s;\r\n  }\r\n}\r\n\r\ninput.search-field {\r\n  background: 0;\r\n  border: 0;\r\n  color: #212121;\r\n  height: 36px;\r\n  padding: 0 8px 0 72px;\r\n  transition: color .2s;\r\n  width: 100%;\r\n  &:focus{\r\n    border: 0;\r\n    outline: none;\r\n  }\r\n}\r\n\r\n.search-popout{\r\n  background: $header-color;\r\n  box-shadow: 0 0 2px rgba(0,0,0,.12),0 2px 4px rgba(0,0,0,.24),inset 0 4px 6px -4px rgba(0,0,0,.24);\r\n  margin-top: 10px;\r\n  max-height: calc(100vh - 150px);\r\n  // width: calc(100% + 120px);\r\n  margin-left: -64px;\r\n  overflow-y: auto;\r\n  position: absolute;\r\n  // transition: transform .2s,visibility .2s;\r\n  // transform: translateY(0);\r\n\r\n  z-index: -1;\r\n\r\n  &.closed{\r\n    // transform: translateY(-110%);\r\n    visibility: hidden;\r\n  }\r\n}\r\n\r\n.search-suggest-results{\r\n  padding: 0 8px 0 75px;\r\n\r\n  a{\r\n    color: #212121;\r\n    display: block;\r\n    margin-left: -8px;\r\n    outline: 0;\r\n    height: auto;\r\n    padding: 8px;\r\n    transition: background .2s;\r\n    font-size: $font-size-sm;\r\n    &:first-child{\r\n      margin-top: 10px;\r\n    }\r\n    &:last-child{\r\n      margin-bottom: 10px;\r\n    }\r\n    &:hover{\r\n      background: #f7f7f7;\r\n    }\r\n  }\r\n}\r\n\r\n\r\n\r\n\r\n/* mediaquery medium\r\n========================================================================== */\r\n\r\n@media #{$lg-and-up}{\r\n  .header-search{\r\n    background: rgba(255,255,255,.25);\r\n    box-shadow: 0 1px 1.5px rgba(0,0,0,0.06),0 1px 1px rgba(0,0,0,0.12);\r\n    color: $header-color;\r\n    display: inline-block;\r\n    width: 200px;\r\n\r\n    &:hover{\r\n      background: rgba(255,255,255,.4);\r\n    }\r\n\r\n    .search-icon{top: 0px;}\r\n\r\n    input, input::placeholder, .search-icon{color: #fff;}\r\n\r\n  }\r\n\r\n  .search-popout{\r\n    width: 100%;\r\n    margin-left: 0;\r\n  }\r\n\r\n  // Show large search and visibility hidden header menu\r\n  .header.is-showSearch{\r\n    .header-search{\r\n      background: #fff;\r\n      flex: 1 0 auto;\r\n\r\n      .search-icon{color: #757575 !important;}\r\n      input, input::placeholder {color: #212121 !important}\r\n    }\r\n    .header-menu{\r\n      flex: 0 0 auto;\r\n      margin: 0;\r\n      visibility: hidden;\r\n      width: 0;\r\n    }\r\n  }\r\n}\r\n\r\n\r\n/* Media Query\r\n========================================================================== */\r\n\r\n@media #{$lg-and-down}{\r\n\r\n  .header-menu ul{ display: none; }\r\n\r\n  // show search mobile\r\n  .header.is-showSearchMob{\r\n    padding: 0;\r\n\r\n    .header-logo,\r\n    .nav-mob-toggle{\r\n      display: none;\r\n    }\r\n\r\n    .header-search{\r\n      border-radius: 0;\r\n      display: inline-block !important;\r\n      height: $header-height;\r\n      margin: 0;\r\n      width: 100%;\r\n\r\n      input{\r\n        height: $header-height;\r\n        padding-right: 48px;\r\n      }\r\n\r\n      .search-popout{margin-top: 0;}\r\n    }\r\n\r\n    .search-mob-toggle{\r\n      border: 0;\r\n      color: $header-search-color;\r\n      position: absolute;\r\n      right: 0;\r\n      &:before{content: $i-close !important;}\r\n    }\r\n\r\n  }\r\n\r\n  // show menu mobile\r\n  body.is-showNavMob{\r\n    overflow: hidden;\r\n\r\n    .nav-mob{\r\n      transform: translateX(0);\r\n    }\r\n    .nav-mob-toggle {\r\n      border: 0;\r\n      transform: rotate(90deg);\r\n      span:first-child { transform: rotate(45deg) translate(0,0);}\r\n      span:nth-child(2) { transform: scaleX(0);}\r\n      span:last-child {transform: rotate(-45deg) translate(0,0);}\r\n    }\r\n    .search-mob-toggle{\r\n      display: none;\r\n    }\r\n\r\n    .main,.footer{\r\n      transform: translateX(-25%);\r\n    }\r\n  }\r\n\r\n}\r\n","// box-shadow\n%primary-box-shadow {\n  box-shadow: 0 0 4px rgba(0, 0, 0, .14), 0 4px 8px rgba(0, 0, 0, .28);\n}\n\n%font-icons {\n  font-family: 'mapache' !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n//  Clear both\n.u-clear {\n  &::after {\n    clear: both;\n    content: \"\";\n    display: table;\n  }\n}\n\n.u-not-avatar { background-image: url('../images/avatar.png') }\n.u-relative { position: relative }\n.u-block { display: block }\n\n.u-absolute0 {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n\n.u-bg-cover {\n  background-position: center;\n  background-size: cover;\n}\n\n.u-bg-gradient {\n  background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, 0.8)));\n}\n\n// border-\n.u-border-bottom-dark { border-bottom: solid 1px #000; }\n.u-b-t { border-top: solid 1px #eee; }\n\n// Padding\n.u-p-t-2 { padding-top: 2rem }\n\n// Eliminar la lista de la <ul>\n.u-unstyled {\n  list-style-type: none;\n  margin: 0;\n  padding-left: 0;\n}\n\n.u-floatLeft { float: left !important; }\n.u-floatRight { float: right !important; }\n\n//  flex box\n.u-flex { display: flex; flex-direction: row; }\n.u-flex-wrap { display: flex; flex-wrap: wrap; }\n.u-flex-center { display: flex; align-items: center; }\n.u-flex-aling-right { display: flex; align-items: center; justify-content: flex-end; }\n.u-flex-aling-center { display: flex; align-items: center; justify-content: center; flex-direction: column; }\n\n// margin\n.u-m-t-1 { margin-top: 1rem }\n\n/* Tags\n========================================================================== */\n.u-tags {\n  font-size: 12px !important;\n  margin: 3px !important;\n  color: #4c5765 !important;\n  background-color: #ebebeb !important;\n  transition: all .3s;\n\n  &::before {\n    padding-right: 5px;\n    opacity: .8;\n  }\n\n  &:hover {\n    background-color: $primary-color !important;\n    color: #fff !important;\n  }\n}\n\n.u-textUppercase { text-transform: uppercase }\n\n// Only 1 tags\n.u-tag {\n  background-color: $primary-color;\n  color: #fff;\n  padding: 4px 12px;\n  font-size: 11px;\n  display: inline-block;\n  text-transform: uppercase;\n}\n\n// hide global\n.u-hide { display: none !important }\n\n.u-card-shadow {\n  background-color: #fff;\n  box-shadow: 0 5px 5px rgba(0, 0, 0, .02);\n}\n\n.u-not-image {\n  background-repeat: repeat;\n  background-size: initial !important;\n  background-color: #fff;\n}\n\n// hide before\n@media #{$md-and-down} { .u-h-b-md { display: none !important } }\n\n@media #{$lg-and-down} { .u-h-b-lg { display: none !important } }\n\n// hide after\n@media #{$md-and-up} { .u-h-a-md { display: none !important } }\n\n@media #{$lg-and-up} { .u-h-a-lg { display: none !important } }\n","html {\r\n  box-sizing: border-box;\r\n  // Sets a specific default `font-size` for user with `rem` type scales.\r\n  font-size: $font-size-root;\r\n  // Changes the default tap highlight to be completely transparent in iOS.\r\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\r\n}\r\n\r\n*,\r\n*::before,\r\n*::after {\r\n  box-sizing: border-box;\r\n}\r\n\r\na {\r\n  color: $link-color;\r\n  outline: 0;\r\n  text-decoration: none;\r\n  // Gets rid of tap active state\r\n  -webkit-tap-highlight-color: transparent;\r\n\r\n  &:focus {\r\n    text-decoration: none;\r\n    // background-color: transparent;\r\n  }\r\n\r\n  &.external {\r\n    &::after {\r\n      @extend %font-icons;\r\n\r\n      content: $i-open_in_new;\r\n      margin-left: 5px;\r\n    }\r\n  }\r\n}\r\n\r\nbody {\r\n  // Make the `body` use the `font-size-root`\r\n  color: $primary-text-color;\r\n  font-family: $primary-font;\r\n  font-size: $font-size-base;\r\n  line-height: $line-height;\r\n  margin: 0 auto;\r\n  background-color: #f5f5f5;\r\n}\r\n\r\nfigure { margin: 0; }\r\n\r\nimg {\r\n  height: auto;\r\n  max-width: 100%;\r\n  vertical-align: middle;\r\n  width: auto;\r\n\r\n  &:not([src]) {\r\n    visibility: hidden;\r\n  }\r\n}\r\n\r\n.img-responsive {\r\n  display: block;\r\n  max-width: 100%;\r\n  height: auto;\r\n}\r\n\r\ni {\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n}\r\n\r\nhr {\r\n  background: #F1F2F1;\r\n  background: linear-gradient(to right,#F1F2F1 0,#b5b5b5 50%,#F1F2F1 100%);\r\n  border: none;\r\n  height: 1px;\r\n  margin: 80px auto;\r\n  max-width: 90%;\r\n  position: relative;\r\n\r\n  &::before {\r\n    background: #fff;\r\n    color: rgba(73,55,65,.75);\r\n    content: $i-code;\r\n    display: block;\r\n    font-size: 35px;\r\n    left: 50%;\r\n    padding: 0 25px;\r\n    position: absolute;\r\n    top: 50%;\r\n    transform: translate(-50%,-50%);\r\n    @extend %font-icons;\r\n  }\r\n}\r\n\r\nblockquote {\r\n  border-left: 4px solid $primary-color;\r\n  padding: .75rem 1.5rem;\r\n  background: #fbfbfc;\r\n  color: #757575;\r\n  font-size: $blockquote-font-size;\r\n  line-height: 1.7;\r\n  margin: 0 0 1.25rem;\r\n  quotes: none;\r\n}\r\n\r\nol,ul,blockquote {\r\n  margin-left: 2rem;\r\n}\r\n\r\nstrong {\r\n  font-weight: 500;\r\n}\r\n\r\nsmall, .small {\r\n  font-size: 85%;\r\n}\r\n\r\nol {\r\n  padding-left: 40px;\r\n  list-style: decimal outside;\r\n}\r\n\r\nmark {\r\n  // background-image: linear-gradient(to bottom, lighten($primary-color, 35%), lighten($primary-color, 30%));\r\n  background-color: #fdffb6;\r\n}\r\n\r\n.footer,\r\n.main {\r\n  transition: transform .5s ease;\r\n  z-index: 2;\r\n}\r\n\r\n// .mapache-facebook { display: none !important; }\r\n\r\n/* Code Syntax\r\n========================================================================== */\r\nkbd,samp,code {\r\n  font-family: $code-font !important;\r\n  font-size: $font-size-code;\r\n  color: $code-color;\r\n  background: $code-bg-color;\r\n  border-radius: 4px;\r\n  padding: 4px 6px;\r\n  white-space: pre-wrap;\r\n}\r\n\r\ncode[class*=language-],\r\npre[class*=language-] {\r\n  color: $pre-code-color;\r\n  line-height: 1.5;\r\n\r\n  .token.comment { opacity: .8; }\r\n\r\n  &.line-numbers {\r\n    padding-left: 58px;\r\n\r\n    &::before {\r\n      content: \"\";\r\n      position: absolute;\r\n      left: 0;\r\n      top: 0;\r\n      background: #F0EDEE;\r\n      width: 40px;\r\n      height: 100%;\r\n    }\r\n  }\r\n\r\n  .line-numbers-rows {\r\n    border-right: none;\r\n    top: -3px;\r\n    left: -58px;\r\n\r\n    & > span::before {\r\n      padding-right: 0;\r\n      text-align: center;\r\n      opacity: .8;\r\n    }\r\n  }\r\n}\r\n\r\npre {\r\n  background-color: $code-bg-color!important;\r\n  padding: 1rem;\r\n  overflow: hidden;\r\n  border-radius: 4px;\r\n  word-wrap: normal;\r\n  margin: 2.5rem 0!important;\r\n  font-family: $code-font !important;\r\n  font-size: $font-size-code;\r\n  position: relative;\r\n\r\n  code {\r\n    color: $pre-code-color;\r\n    text-shadow: 0 1px #fff;\r\n    padding: 0;\r\n    background: transparent;\r\n  }\r\n}\r\n\r\n/* .warning & .note & .success\r\n========================================================================== */\r\n.warning {\r\n  background: #fbe9e7;\r\n  color: #d50000;\r\n  &:before{content: $i-warning;}\r\n}\r\n\r\n.note{\r\n  background: #e1f5fe;\r\n  color: #0288d1;\r\n  &:before{content: $i-star;}\r\n}\r\n\r\n.success{\r\n  background: #e0f2f1;\r\n  color: #00897b;\r\n  &:before{content: $i-check_circle;color: #00bfa5;}\r\n}\r\n\r\n.warning, .note, .success{\r\n  display: block;\r\n  margin: 1rem 0;\r\n  font-size: 1rem;\r\n  padding: 12px 24px 12px 60px;\r\n  line-height: 1.5;\r\n  a{\r\n    text-decoration: underline;\r\n    color: inherit;\r\n  }\r\n  &:before{\r\n    margin-left: -36px;\r\n    float: left;\r\n    font-size: 24px;\r\n    @extend %font-icons;\r\n  }\r\n}\r\n\r\n\r\n/* Social icon color and background\r\n========================================================================== */\r\n@each $social-name, $color in $social-colors {\r\n  .c-#{$social-name}{\r\n    color: $color;\r\n  }\r\n  .bg-#{$social-name}{\r\n    background-color: $color !important;\r\n  }\r\n}\r\n\r\n//  Clear both\r\n.clear{\r\n  &:after {\r\n    content: \"\";\r\n    display: table;\r\n    clear: both;\r\n  }\r\n}\r\n\r\n/* pagination Infinite scroll\r\n========================================================================== */\r\n.mapache-load-more{\r\n  border: solid 1px #C3C3C3;\r\n  color: #7D7D7D;\r\n  display: block;\r\n  font-size: 15px;\r\n  height: 45px;\r\n  margin: 4rem auto;\r\n  padding: 11px 16px;\r\n  position: relative;\r\n  text-align: center;\r\n  width: 100%;\r\n\r\n  &:hover{\r\n    background: $primary-color;\r\n    border-color: $primary-color;\r\n    color: #fff;\r\n  }\r\n}\r\n\r\n// .pagination nav\r\n.pagination-nav{\r\n  padding: 2.5rem 0 3rem;\r\n  text-align: center;\r\n  .page-number{\r\n    display: none;\r\n    padding-top: 5px;\r\n    @media #{$md-and-up}{display: inline-block;}\r\n  }\r\n  .newer-posts{\r\n    float: left;\r\n  }\r\n  .older-posts{\r\n    float: right\r\n  }\r\n}\r\n\r\n/* Scroll Top\r\n========================================================================== */\r\n.scroll_top{\r\n  bottom: 50px;\r\n  position: fixed;\r\n  right: 20px;\r\n  text-align: center;\r\n  z-index: 11;\r\n  width: 60px;\r\n  opacity: 0;\r\n  visibility: hidden;\r\n  transition: opacity 0.5s ease;\r\n\r\n  &.visible{\r\n    opacity: 1;\r\n    visibility: visible;\r\n  }\r\n\r\n  &:hover svg path {\r\n    fill: rgba(0,0,0,.6);\r\n  }\r\n}\r\n\r\n// svg all icons\r\n.svg-icon svg {\r\n  width: 100%;\r\n  height: auto;\r\n  display: block;\r\n  fill: currentcolor;\r\n}\r\n\r\n/* Video Responsive\r\n========================================================================== */\r\n.video-responsive{\r\n  position: relative;\r\n  display: block;\r\n  height: 0;\r\n  padding: 0;\r\n  overflow: hidden;\r\n  padding-bottom: 56.25%;\r\n  margin-bottom: 1.5rem;\r\n  iframe{\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    bottom: 0;\r\n    height: 100%;\r\n    width: 100%;\r\n    border: 0;\r\n  }\r\n}\r\n\r\n/* Video full for tag video\r\n========================================================================== */\r\n#video-format{\r\n  .video-content{\r\n    display: flex;\r\n    padding-bottom: 1rem;\r\n    span{\r\n      display: inline-block;\r\n      vertical-align: middle;\r\n      margin-right: .8rem;\r\n    }\r\n  }\r\n}\r\n\r\n/* Page error 404\r\n========================================================================== */\r\n.errorPage{\r\n  font-family: 'Roboto Mono', monospace;\r\n  height: 100vh;\r\n  position: relative;\r\n  width: 100%;\r\n\r\n  &-title{\r\n    padding: 24px 60px;\r\n  }\r\n\r\n  &-link{\r\n    color: rgba(0,0,0,0.54);\r\n    font-size: 22px;\r\n    font-weight: 500;\r\n    left: -5px;\r\n    position: relative;\r\n    text-rendering: optimizeLegibility;\r\n    top: -6px;\r\n  }\r\n\r\n  &-emoji{\r\n    color: rgba(0,0,0,0.4);\r\n    font-size: 150px;\r\n  }\r\n\r\n  &-text{\r\n    color: rgba(0,0,0,0.4);\r\n    line-height: 21px;\r\n    margin-top: 60px;\r\n    white-space: pre-wrap;\r\n  }\r\n\r\n  &-wrap{\r\n    display: block;\r\n    left: 50%;\r\n    min-width: 680px;\r\n    position: absolute;\r\n    text-align: center;\r\n    top: 50%;\r\n    transform: translate(-50%,-50%);\r\n  }\r\n}\r\n\r\n/* Post Twitter facebook card embed Css Center\r\n========================================================================== */\r\n.post {\r\n  iframe[src*=\"facebook.com\"],\r\n  .fb-post,\r\n  .twitter-tweet {\r\n    display: block !important;\r\n    margin: 1.5rem 0 !important;\r\n  }\r\n}\r\n",".container {\r\n  margin: 0 auto;\r\n  padding-left: ($grid-gutter-width / 2);\r\n  padding-right: ($grid-gutter-width / 2);\r\n  width: 100%;\r\n  max-width: $container-xl;\r\n\r\n  // @media #{$sm-and-up}{max-width: $container-sm;}\r\n  // @media #{$md-and-up}{max-width: $container-md;}\r\n  // @media #{$lg-and-up}{max-width: $container-lg;}\r\n  // @media #{$lg-and-up} {  }\r\n}\r\n\r\n.margin-top {\r\n  margin-top: $header-height;\r\n  padding-top: 1rem;\r\n\r\n  @media #{$md-and-up} { padding-top: 1.8rem }\r\n}\r\n\r\n@media #{$md-and-up} {\r\n  .content {\r\n    flex-basis: 69.66666667% !important;\r\n    max-width: 69.66666667% !important;\r\n    // flex: 1 !important;\r\n    // max-width: calc(100% - 300px) !important;\r\n    // order: 1;\r\n    // overflow: hidden;\r\n  }\r\n\r\n  .sidebar {\r\n    flex-basis: 30.33333333% !important;\r\n    max-width: 30.33333333% !important;\r\n    // flex: 0 0 330px !important;\r\n    // order: 2;\r\n  }\r\n}\r\n\r\n@media #{$xl-and-up} {\r\n  .content { padding-right: 40px !important }\r\n}\r\n\r\n@media #{$lg-and-up} {\r\n  .feed-entry-wrapper {\r\n    .entry-image {\r\n      width: 40% !important;\r\n      max-width: 40% !important;\r\n    }\r\n\r\n    .entry-body {\r\n      width: 60% !important;\r\n      max-width: 60% !important;\r\n    }\r\n  }\r\n}\r\n\r\n@media #{$lg-and-down} {\r\n  body.is-article .content {\r\n    max-width: 100% !important;\r\n  }\r\n}\r\n\r\n.row {\r\n  display: flex;\r\n  flex: 0 1 auto;\r\n  flex-flow: row wrap;\r\n  // margin: -8px;\r\n\r\n  margin-left: - $gutter-width / 2;\r\n  margin-right: - $gutter-width / 2;\r\n\r\n  // // Clear floating children\r\n  // &:after {\r\n  //  content: \"\";\r\n  //  display: table;\r\n  //  clear: both;\r\n  // }\r\n\r\n  .col {\r\n    // float: left;\r\n    // box-sizing: border-box;\r\n    flex: 0 0 auto;\r\n    padding-left: $gutter-width / 2;\r\n    padding-right: $gutter-width / 2;\r\n\r\n    $i: 1;\r\n\r\n    @while $i <= $num-cols {\r\n      $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n\r\n      &.s#{$i} {\r\n        // width: $perc;\r\n        flex-basis: $perc;\r\n        max-width: $perc;\r\n      }\r\n      $i: $i + 1;\r\n    }\r\n\r\n    @media #{$md-and-up} {\r\n\r\n      $i: 1;\r\n\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n\r\n        &.m#{$i} {\r\n          // width: $perc;\r\n          flex-basis: $perc;\r\n          max-width: $perc;\r\n        }\r\n        $i: $i + 1\r\n      }\r\n    }\r\n\r\n    @media #{$lg-and-up} {\r\n\r\n      $i: 1;\r\n\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n\r\n        &.l#{$i} {\r\n          // width: $perc;\r\n          flex-basis: $perc;\r\n          max-width: $perc;\r\n        }\r\n        $i: $i + 1;\r\n      }\r\n    }\r\n  }\r\n}\r\n","\r\n//\r\n// Headings\r\n//\r\n\r\nh1, h2, h3, h4, h5, h6,\r\n.h1, .h2, .h3, .h4, .h5, .h6 {\r\n  margin-bottom: $headings-margin-bottom;\r\n  font-family: $headings-font-family;\r\n  font-weight: $headings-font-weight;\r\n  line-height: $headings-line-height;\r\n  color: $headings-color;\r\n  // letter-spacing: -.02em !important;\r\n}\r\n\r\nh1 { font-size: $font-size-h1; }\r\nh2 { font-size: $font-size-h2; }\r\nh3 { font-size: $font-size-h3; }\r\nh4 { font-size: $font-size-h4; }\r\nh5 { font-size: $font-size-h5; }\r\nh6 { font-size: $font-size-h6; }\r\n\r\n// These declarations are kept separate from and placed after\r\n// the previous tag-based declarations so that the classes beat the tags in\r\n// the CSS cascade, and thus <h1 class=\"h2\"> will be styled like an h2.\r\n.h1 { font-size: $font-size-h1; }\r\n.h2 { font-size: $font-size-h2; }\r\n.h3 { font-size: $font-size-h3; }\r\n.h4 { font-size: $font-size-h4; }\r\n.h5 { font-size: $font-size-h5; }\r\n.h6 { font-size: $font-size-h6; }\r\n\r\nh1, h2, h3, h4, h5, h6 {\r\n  margin-bottom: 1rem;\r\n  a{\r\n    color: inherit;\r\n    line-height: inherit;\r\n  }\r\n}\r\n\r\np {\r\n  margin-top: 0;\r\n  margin-bottom: 1rem;\r\n}\r\n","/* Navigation Mobile\r\n========================================================================== */\r\n.nav-mob {\r\n  background: $primary-color;\r\n  color: #000;\r\n  height: 100vh;\r\n  left: 0;\r\n  padding: 0 20px;\r\n  position: fixed;\r\n  right: 0;\r\n  top: 0;\r\n  transform: translateX(100%);\r\n  transition: .4s;\r\n  will-change: transform;\r\n  z-index: 997;\r\n\r\n  a{\r\n    color: inherit;\r\n  }\r\n\r\n  ul {\r\n    a{\r\n      display: block;\r\n      font-weight: 500;\r\n      padding: 8px 0;\r\n      text-transform: uppercase;\r\n      font-size: 14px;\r\n    }\r\n  }\r\n\r\n\r\n  &-content{\r\n    background: #eee;\r\n    overflow: auto;\r\n    -webkit-overflow-scrolling: touch;\r\n    bottom: 0;\r\n    left: 0;\r\n    padding: 20px 0;\r\n    position: absolute;\r\n    right: 0;\r\n    top: $header-height;\r\n  }\r\n\r\n}\r\n\r\n.nav-mob ul,\r\n.nav-mob-subscribe,\r\n.nav-mob-follow{\r\n  border-bottom: solid 1px #DDD;\r\n  padding: 0 ($grid-gutter-width / 2)  20px ($grid-gutter-width / 2);\r\n  margin-bottom: 15px;\r\n}\r\n\r\n/* Navigation Mobile follow\r\n========================================================================== */\r\n.nav-mob-follow{\r\n  a{\r\n    font-size: 20px !important;\r\n    margin: 0 2px !important;\r\n    padding: 0;\r\n\r\n    @extend .btn;\r\n  }\r\n\r\n  @each $social-name, $color in $social-colors {\r\n    .i-#{$social-name}{\r\n      color: #fff;\r\n      @extend .bg-#{$social-name};\r\n    }\r\n  }\r\n}\r\n\r\n/* CopyRigh\r\n========================================================================== */\r\n.nav-mob-copyright{\r\n  color: #aaa;\r\n  font-size: 13px;\r\n  padding: 20px 15px 0;\r\n  text-align: center;\r\n  width: 100%;\r\n\r\n  a{color: $primary-color}\r\n}\r\n\r\n/* subscribe\r\n========================================================================== */\r\n.nav-mob-subscribe{\r\n  .btn{\r\n    border-radius: 0;\r\n    text-transform: none;\r\n    width: 80px;\r\n  }\r\n  .form-group {width: calc(100% - 80px)}\r\n  input{\r\n    border: 0;\r\n    box-shadow: none !important;\r\n  }\r\n}\r\n","// Header post\r\n.cover {\r\n  background: $primary-color;\r\n  box-shadow: 0 0 4px rgba(0,0,0,.14),0 4px 8px rgba(0,0,0,.28);\r\n  color: #fff;\r\n  letter-spacing: .2px;\r\n  min-height: 550px;\r\n  position: relative;\r\n  text-shadow: 0 0 10px rgba(0,0,0,.33);\r\n  z-index: 2;\r\n\r\n  &-wrap {\r\n    margin: 0 auto;\r\n    max-width: 1050px;\r\n    padding: 16px;\r\n    position: relative;\r\n    text-align: center;\r\n    z-index: 99;\r\n  }\r\n\r\n  &-title {\r\n    font-size: 3.5rem;\r\n    margin: 0 0 50px;\r\n    line-height: 1;\r\n    font-weight: 700;\r\n  }\r\n\r\n  &-description { max-width: 600px; }\r\n\r\n  &-background { background-attachment: fixed }\r\n\r\n  //  cover mouse scroll\r\n  .mouse {\r\n    width: 25px;\r\n    position: absolute;\r\n    height: 36px;\r\n    border-radius: 15px;\r\n    border: 2px solid #888;\r\n    border: 2px solid rgba(255,255,255,0.27);\r\n    bottom: 40px;\r\n    right: 40px;\r\n    margin-left: -12px;\r\n    cursor: pointer;\r\n    transition: border-color 0.2s ease-in;\r\n\r\n    .scroll {\r\n      display: block;\r\n      margin: 6px auto;\r\n      width: 3px;\r\n      height: 6px;\r\n      border-radius: 4px;\r\n      background: rgba(255, 255, 255, 0.68);\r\n      animation-duration: 2s;\r\n      animation-name: scroll;\r\n      animation-iteration-count: infinite;\r\n    }\r\n  }\r\n}\r\n\r\n.author {\r\n  a { color: #FFF !important; }\r\n\r\n  &-header {\r\n    margin-top: 10%;\r\n  }\r\n\r\n  &-name-wrap {\r\n    display: inline-block;\r\n  }\r\n\r\n  &-title {\r\n    display: block;\r\n    text-transform: uppercase;\r\n  }\r\n\r\n  &-name {\r\n    margin: 5px 0;\r\n    font-size: 1.75rem;\r\n  }\r\n  &-bio {\r\n    margin: 1.5rem 0;\r\n    line-height: 1.8;\r\n    font-size: 18px;\r\n    max-width: 700px;\r\n  }\r\n\r\n  &-avatar {\r\n    display: inline-block;\r\n    border-radius: 90px;\r\n    margin-right: 10px;\r\n    width: 80px;\r\n    height: 80px;\r\n    background-size: cover;\r\n    background-position: center;\r\n    vertical-align: bottom;\r\n  }\r\n\r\n  // Author meta (location - website - post total)\r\n  &-meta {\r\n    margin-bottom: 20px;\r\n\r\n    span {\r\n      display: inline-block;\r\n      font-size: 17px;\r\n      font-style: italic;\r\n      margin: 0 2rem 1rem 0;\r\n      opacity: 0.8;\r\n      word-wrap: break-word;\r\n    }\r\n  }\r\n\r\n  .author-link:hover {\r\n    opacity: 1;\r\n  }\r\n\r\n  //  author Follow\r\n  &-follow {\r\n    a {\r\n      border-radius: 3px;\r\n      box-shadow: inset 0 0 0 2px rgba(255,255,255,.5);\r\n      cursor: pointer;\r\n      display: inline-block;\r\n      height: 40px;\r\n      letter-spacing: 1px;\r\n      line-height: 40px;\r\n      margin: 0 10px;\r\n      padding: 0 16px;\r\n      text-shadow: none;\r\n      text-transform: uppercase;\r\n\r\n      &:hover {\r\n        box-shadow: inset 0 0 0 2px #fff;\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\n//  Home BTN DOWN\r\n.home-down {\r\n  animation-duration: 1.2s !important;\r\n  bottom: 60px;\r\n  color: rgba(255, 255, 255, 0.5);\r\n  left: 0;\r\n  // transform: translate(0, -50%);\r\n  margin: 0 auto;\r\n  position: absolute;\r\n  right: 0;\r\n  width: 70px;\r\n  z-index: 100;\r\n}\r\n\r\n\r\n@media #{$md-and-up}{\r\n  .cover{\r\n    &-description{\r\n      font-size: $font-size-lg;\r\n    }\r\n  }\r\n\r\n}\r\n\r\n\r\n@media #{$md-and-down} {\r\n  .cover{\r\n    padding-top: $header-height;\r\n    padding-bottom: 20px;\r\n\r\n    &-title{\r\n      font-size: 2rem;\r\n    }\r\n  }\r\n\r\n  .author-avatar{\r\n    display: block;\r\n    margin: 0 auto 10px auto;\r\n  }\r\n}\r\n",".feed-entry-content .feed-entry-wrapper:last-child {\r\n  .entry:last-child {\r\n    padding: 0;\r\n    border: none;\r\n  }\r\n}\r\n\r\n.entry {\r\n  margin-bottom: 1.5rem;\r\n  padding: 0 15px 15px;\r\n\r\n  &-image {\r\n    // margin-bottom: 10px;\r\n\r\n    &--link {\r\n      height: 180px;\r\n      margin: 0 -15px;\r\n      overflow: hidden;\r\n\r\n      &:hover .entry-image--bg {\r\n        transform: scale(1.03);\r\n        backface-visibility: hidden;\r\n      }\r\n    }\r\n\r\n    &--bg { transition: transform 0.3s }\r\n  }\r\n\r\n  // video play for video post format\r\n  &-video-play {\r\n    border-radius: 50%;\r\n    border: 2px solid #fff;\r\n    color: #fff;\r\n    font-size: 3.5rem;\r\n    height: 65px;\r\n    left: 50%;\r\n    line-height: 65px;\r\n    position: absolute;\r\n    text-align: center;\r\n    top: 50%;\r\n    transform: translate(-50%, -50%);\r\n    width: 65px;\r\n    z-index: 10;\r\n    // &:before{line-height: inherit}\r\n  }\r\n\r\n  &-category {\r\n    margin-bottom: 5px;\r\n    text-transform: capitalize;\r\n    font-size: $font-size-sm;\r\n    line-height: 1;\r\n\r\n    a:active {\r\n      text-decoration: underline;\r\n    }\r\n  }\r\n\r\n  &-title {\r\n    color: $entry-color-title;\r\n    font-size: $entry-font-size-mb;\r\n    height: auto;\r\n    line-height: 1.2;\r\n    margin: 0 0 .5rem;\r\n    padding: 0;\r\n\r\n    &:hover {\r\n      color: $entry-color-title-hover;\r\n    }\r\n  }\r\n\r\n  &-byline {\r\n    margin-top: 0;\r\n    margin-bottom: 0.5rem;\r\n    color: $entry-color-byline;\r\n    font-size: $entry-font-size-byline;\r\n\r\n    a {\r\n      color: inherit;\r\n      &:hover { color: #333 }\r\n    }\r\n  }\r\n\r\n  &-body {\r\n    padding-top: 20px;\r\n  }\r\n}\r\n\r\n/* Entry small --small\r\n========================================================================== */\r\n.entry.entry--small {\r\n  margin-bottom: 24px;\r\n  padding: 0;\r\n\r\n  .entry-image { margin-bottom: 10px }\r\n  .entry-image--link { height: 170px; margin: 0 }\r\n\r\n  .entry-title {\r\n    font-size: 1rem;\r\n    font-weight: 500;\r\n    line-height: 1.2;\r\n    text-transform: capitalize;\r\n  }\r\n\r\n  .entry-byline { margin: 0 }\r\n}\r\n\r\n// Media query LG\r\n@media #{$lg-and-up} {\r\n  .entry {\r\n    margin-bottom: 40px;\r\n    padding: 0;\r\n\r\n    &-title {\r\n      // font-size: $entry-font-size;\r\n      font-size: 21px;\r\n    }\r\n\r\n    &-body { padding-right: 35px !important }\r\n\r\n    &-image {\r\n      margin-bottom: 0;\r\n    }\r\n\r\n    &-image--link {\r\n      height: 180px;\r\n      margin: 0;\r\n    }\r\n  }\r\n}\r\n\r\n// Media Query XL\r\n@media #{$xl-and-up} {\r\n  .entry-image--link { height: 218px }\r\n}\r\n",".footer {\r\n  color: $footer-color;\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n  line-height: 1;\r\n  padding: 1.6rem 15px;\r\n  text-align: center;\r\n\r\n  a {\r\n    color: $footer-color-link;\r\n    &:hover { color: rgba(0, 0, 0, .8); }\r\n  }\r\n\r\n  &-wrap {\r\n    margin: 0 auto;\r\n    max-width: 1400px;\r\n  }\r\n\r\n  .heart {\r\n    animation: heartify .5s infinite alternate;\r\n    color: red;\r\n  }\r\n\r\n  &-copy,\r\n  &-design-author {\r\n    display: inline-block;\r\n    padding: .5rem 0;\r\n    vertical-align: middle;\r\n  }\r\n\r\n  &-follow {\r\n    padding: 20px 0;\r\n\r\n    a {\r\n      font-size: 20px;\r\n      margin: 0 5px;\r\n      color: rgba(0, 0, 0, .8);\r\n    }\r\n  }\r\n}\r\n\r\n@keyframes heartify {\r\n  0% {\r\n    transform: scale(.8);\r\n  }\r\n}\r\n",".btn{\r\n  background-color: #fff;\r\n  border-radius: 2px;\r\n  border: 0;\r\n  box-shadow: none;\r\n  color: $btn-secondary-color;\r\n  cursor: pointer;\r\n  display: inline-block;\r\n  font: 500 14px/20px $primary-font;\r\n  height: 36px;\r\n  margin: 0;\r\n  min-width: 36px;\r\n  outline: 0;\r\n  overflow: hidden;\r\n  padding: 8px;\r\n  text-align: center;\r\n  text-decoration: none;\r\n  text-overflow: ellipsis;\r\n  text-transform: uppercase;\r\n  transition: background-color .2s,box-shadow .2s;\r\n  vertical-align: middle;\r\n  white-space: nowrap;\r\n\r\n  + .btn{margin-left: 8px;}\r\n\r\n  &:focus,\r\n  &:hover{\r\n    background-color: $btn-background-color;\r\n    text-decoration: none !important;\r\n  }\r\n  &:active{\r\n    background-color: $btn-active-background;\r\n  }\r\n\r\n  &.btn-lg{\r\n    font-size: 1.5rem;\r\n    min-width: 48px;\r\n    height: 48px;\r\n    line-height: 48px;\r\n  }\r\n  &.btn-flat{\r\n    background: 0;\r\n    box-shadow: none;\r\n    &:focus,\r\n    &:hover,\r\n    &:active{\r\n      background: 0;\r\n      box-shadow: none;\r\n    }\r\n  }\r\n\r\n  &.btn-primary{\r\n    background-color: $btn-primary-color;\r\n    color: #fff;\r\n    &:hover{background-color: darken($btn-primary-color, 4%);}\r\n  }\r\n  &.btn-circle{\r\n    border-radius: 50%;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    padding: 0;\r\n    width: 40px;\r\n  }\r\n  &.btn-circle-small{\r\n    border-radius: 50%;\r\n    height: 32px;\r\n    line-height: 32px;\r\n    padding: 0;\r\n    width: 32px;\r\n    min-width: 32px;\r\n  }\r\n  &.btn-shadow{\r\n    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.12);\r\n    color: #333;\r\n    background-color: #eee;\r\n    &:hover{background-color: rgba(0,0,0,0.12);}\r\n  }\r\n\r\n  &.btn-download-cloud,\r\n  &.btn-download{\r\n    background-color: $btn-primary-color;\r\n    color: #fff;\r\n    &:hover{background-color: darken($btn-primary-color, 8%);}\r\n    &:after{\r\n      @extend %font-icons;\r\n      margin-left: 5px;\r\n      font-size: 1.1rem;\r\n      display: inline-block;\r\n      vertical-align: top;\r\n    }\r\n  }\r\n\r\n  &.btn-download:after{content: $i-download;}\r\n  &.btn-download-cloud:after{content: $i-cloud_download;}\r\n  &.external:after{font-size: 1rem;}\r\n}\r\n\r\n\r\n\r\n\r\n\r\n//  Input\r\n.input-group {\r\n  position: relative;\r\n  display: table;\r\n  border-collapse: separate;\r\n}\r\n\r\n\r\n\r\n\r\n.form-control {\r\n  width: 100%;\r\n  padding: 8px 12px;\r\n  font-size: 14px;\r\n  line-height: 1.42857;\r\n  color: #555;\r\n  background-color: #fff;\r\n  background-image: none;\r\n  border: 1px solid #ccc;\r\n  border-radius: 0px;\r\n  box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);\r\n  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;\r\n  height: 36px;\r\n\r\n  &:focus {\r\n    border-color: $btn-primary-color;\r\n    outline: 0;\r\n    box-shadow: inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba($btn-primary-color,0.6);\r\n  }\r\n}\r\n\r\n\r\n.btn-subscribe-home{\r\n  background-color: transparent;\r\n  border-radius: 3px;\r\n  box-shadow: inset 0 0 0 2px hsla(0,0%,100%,.5);\r\n  color: #ffffff;\r\n  display: block;\r\n  font-size: 20px;\r\n  font-weight: 400;\r\n  line-height: 1.2;\r\n  margin-top: 50px;\r\n  max-width: 300px;\r\n  max-width: 300px;\r\n  padding: 15px 10px;\r\n  transition: all 0.3s;\r\n  width: 100%;\r\n\r\n  &:hover{\r\n    box-shadow: inset 0 0 0 2px #fff;\r\n  }\r\n}\r\n","/*  Post\n========================================================================== */\n.post-wrapper {\n  margin-top: $header-height;\n  padding-top: 1.8rem;\n}\n\n.post {\n  // padding: 15px;\n\n  &-header {\n    margin-bottom: 1.2rem;\n  }\n\n  &-title {\n    color: #000;\n    font-size: 2.5rem;\n    height: auto;\n    line-height: 1.04;\n    margin: 0 0 0.9375rem;\n    letter-spacing: -.028em !important;\n    padding: 0;\n  }\n\n  &-excerpt {\n    line-height: 1.3em;\n    font-size: 20px;\n    color: #7D7D7D;\n    margin-bottom: 8px;\n  }\n\n  //  Image\n  &-image{\n    margin-bottom: 30px;\n    overflow: hidden;\n  }\n\n  // post content\n  &-body{\n    margin-bottom: 2rem;\n\n    a:focus {text-decoration: underline;}\n\n    h2{\n      // border-bottom: 1px solid $divider-color;\n      font-weight: 500;\n      margin: 2.50rem 0 1.25rem;\n      padding-bottom: 3px;\n    }\n    h3,h4{\n      margin: 32px 0 16px;\n    }\n\n    iframe{\n      display: block !important;\n      margin: 0 auto 1.5rem 0 !important;\n    }\n\n    img{\n      display: block;\n      margin-bottom: 1rem;\n    }\n\n    h2 a, h3 a, h4 a {\n      color: $primary-color,\n    }\n  }\n\n  // tags\n  &-tags {\n    margin: 1.25rem 0;\n  }\n}\n\n.post-card { padding: 15px }\n\n/* Post author by line top (author - time - tag - sahre)\n========================================================================== */\n.post-byline {\n  color: $secondary-text-color;\n  font-size: 14px;\n  flex-grow: 1;\n  letter-spacing: -.028em !important;\n\n  a {\n    color: inherit;\n    &:active { text-decoration: underline; }\n    &:hover { color: #222 }\n  }\n}\n\n// Post actions top\n.post-actions--top .share {\n  margin-right: 10px;\n  font-size: 20px;\n\n  &:hover { opacity: .7; }\n}\n\n.post-action-comments {\n  color: $secondary-text-color;\n  margin-right: 15px;\n  font-size: 14px;\n}\n\n/* Post Action social media\n========================================================================== */\n.post-actions {\n  position: relative;\n  margin-bottom: 1.5rem;\n\n  a {\n    color: #fff;\n    font-size: 1.125rem;\n    &:hover { background-color: #000 !important; }\n  }\n\n  li {\n    margin-left: 6px;\n    &:first-child { margin-left: 0 !important; }\n  }\n\n  .btn { border-radius: 0; }\n}\n\n/* Post author widget bottom\n========================================================================== */\n.post-author {\n  position: relative;\n  font-size: 15px;\n  padding: 30px 0 30px 100px;\n  margin-bottom: 3rem;\n  background-color: #f3f5f6;\n\n  h5 {\n    color: #AAA;\n    font-size: 12px;\n    line-height: 1.5;\n    margin: 0;\n    font-weight: 500;\n  }\n\n  li {\n    margin-left: 30px;\n    font-size: 14px;\n\n    a { color: #555; &:hover { color: #000 } }\n\n    &:first-child { margin-left: 0 }\n  }\n\n  // &-bio {\n  //   max-width: 500px;\n  // }\n\n  .post-author-avatar {\n    height: 64px;\n    width: 64px;\n    position: absolute;\n    left: 20px;\n    top: 30px;\n    background-position: center center;\n    background-size: cover;\n    border-radius: 50%;\n  }\n}\n\n/* bottom share and bottom subscribe\n========================================================================== */\n.share-subscribe{\n  margin-bottom: 1rem;\n\n  p{\n    color: #7d7d7d;\n    margin-bottom: 1rem;\n    line-height: 1;\n    font-size: $font-size-sm;\n  }\n\n  .social-share{float: none !important;}\n\n  &>div{\n    position: relative;\n    overflow: hidden;\n    margin-bottom: 15px;\n    &:before{\n      content: \" \";\n      border-top: solid 1px #000;\n      position: absolute;\n      top: 0;\n      left: 15px;\n      width: 40px;\n      height: 1px;\n    }\n\n    h5{\n      font-size:  $font-size-sm;\n      margin: 1rem 0;\n      line-height: 1;\n      text-transform: uppercase;\n      font-weight: 500;\n    }\n  }\n\n  //  subscribe\n  .newsletter-form{\n    display: flex;\n\n    .form-group{\n      max-width: 250px;\n      width: 100%;\n    }\n\n    .btn{\n      border-radius: 0;\n    }\n  }\n}\n\n/* Related post\n========================================================================== */\n.post-related {\n  margin-top: 40px;\n\n  &-title {\n    color: #000;\n    font-size: 18px;\n    font-weight: 500;\n    height: auto;\n    line-height: 17px;\n    margin: 0 0 20px;\n    padding-bottom: 10px;\n    text-transform: uppercase;\n  }\n\n  &-list {\n    margin-bottom: 18px;\n    padding: 0;\n    border: none;\n  }\n}\n\n/* Media Query (medium)\n========================================================================== */\n\n@media #{$md-and-up} {\n  .post {\n    .title {\n      font-size: 2.25rem;\n      margin: 0 0 1rem;\n    }\n\n    &-body {\n      font-size: 1.125rem;\n      line-height: 32px;\n\n      p { margin-bottom: 1.5rem }\n    }\n  }\n\n  .post-card { padding: 30px }\n}\n\n\n@media #{$sm-and-down}{\n  .post-title{\n    font-size: 1.8rem;\n  }\n  .post-image,\n  .video-responsive{\n    margin-left:  - ($grid-gutter-width / 2);\n    margin-right: - ($grid-gutter-width / 2);\n  }\n}\n","/* sidebar\r\n========================================================================== */\r\n.sidebar {\r\n  position: relative;\r\n  line-height: 1.6;\r\n\r\n  h1,h2,h3,h4,h5,h6 { margin-top: 0; color: #000 }\r\n\r\n  &-items {\r\n    margin-bottom: 2.5rem;\r\n    padding: 25px;\r\n    position: relative;\r\n  }\r\n\r\n  &-title {\r\n    padding-bottom: 10px;\r\n    margin-bottom: 1rem;\r\n    text-transform: uppercase;\r\n    font-size: 1rem;\r\n    // font-weight: $font-weight;\r\n\r\n    @extend .u-border-bottom-dark;\r\n  }\r\n\r\n  .title-primary {\r\n    background-color: $primary-color;\r\n    color: #FFF;\r\n    padding: 10px 16px;\r\n    font-size: 18px;\r\n  }\r\n}\r\n\r\n.sidebar-post {\r\n  // padding-bottom: 2px;\r\n\r\n  &--border {\r\n    align-items: center;\r\n    border-left: 3px solid $primary-color;\r\n    bottom: 0;\r\n    color: rgba(0, 0, 0, .2);\r\n    display: flex;\r\n    font-size: 28px;\r\n    font-weight: bold;\r\n    left: 0;\r\n    line-height: 1;\r\n    padding: 15px 10px 10px;\r\n    position: absolute;\r\n    top: 0;\r\n  }\r\n\r\n  &:nth-child(3n) { .sidebar-post--border { border-color: darken(orange, 2%) } }\r\n  &:nth-child(3n+2) { .sidebar-post--border { border-color: rgb(0, 160, 52) } }\r\n\r\n  &--link {\r\n    // background-color: rgb(255, 255, 255);\r\n    display: block;\r\n    min-height: 50px;\r\n    padding: 10px 15px 10px 55px;\r\n    position: relative;\r\n\r\n    &:hover .sidebar-post--border {\r\n      background-color: rgb(229, 239, 245);\r\n    }\r\n  }\r\n\r\n  &--title {\r\n    color: rgba(0, 0, 0, 0.8);\r\n    font-size: 16px;\r\n    font-weight: 500;\r\n    margin: 0;\r\n  }\r\n}\r\n",".subscribe{\r\n  min-height: 90vh;\r\n  padding-top: $header-height;\r\n\r\n  h3{\r\n    margin: 0;\r\n    margin-bottom: 8px;\r\n    font: 400 20px/32px $primary-font;\r\n  }\r\n\r\n  &-title{\r\n    font-weight: 400;\r\n    margin-top: 0;\r\n  }\r\n\r\n  &-wrap{\r\n    max-width: 700px;\r\n    color: #7d878a;\r\n    padding: 1rem 0;\r\n  }\r\n\r\n  .form-group{\r\n    margin-bottom: 1.5rem;\r\n\r\n    &.error{\r\n      input {border-color: #ff5b5b;}\r\n    }\r\n  }\r\n\r\n  .btn{\r\n    width: 100%;\r\n  }\r\n}\r\n\r\n\r\n.subscribe-form{\r\n  position: relative;\r\n  margin: 30px auto;\r\n  padding: 40px;\r\n  max-width: 400px;\r\n  width: 100%;\r\n  background: #ebeff2;\r\n  border-radius: 5px;\r\n  text-align: left;\r\n}\r\n\r\n.subscribe-input{\r\n  width: 100%;\r\n  padding: 10px;\r\n  border: #4285f4  1px solid;\r\n  border-radius: 2px;\r\n  &:focus{\r\n    outline: none;\r\n  }\r\n}\r\n","// animated Global\r\n.animated {\r\n  animation-duration: 1s;\r\n  animation-fill-mode: both;\r\n\r\n  &.infinite { animation-iteration-count: infinite }\r\n}\r\n\r\n// animated All\r\n.bounceIn { animation-name: bounceIn; }\r\n.bounceInDown { animation-name: bounceInDown }\r\n.slideInUp { animation-name: slideInUp }\r\n.slideOutDown { animation-name: slideOutDown }\r\n\r\n// all keyframes Animates\r\n\r\n// bounceIn\r\n@keyframes bounceIn {\r\n    0%, 20%, 40%, 60%, 80%, 100% {\r\n        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\r\n    }\r\n\r\n    0% {\r\n        opacity: 0;\r\n        transform: scale3d(.3, .3, .3);\r\n    }\r\n\r\n    20% {\r\n        transform: scale3d(1.1, 1.1, 1.1);\r\n    }\r\n\r\n    40% {\r\n        transform: scale3d(.9, .9, .9);\r\n    }\r\n\r\n    60% {\r\n        opacity: 1;\r\n        transform: scale3d(1.03, 1.03, 1.03);\r\n    }\r\n\r\n    80% {\r\n        transform: scale3d(.97, .97, .97);\r\n    }\r\n\r\n    100% {\r\n        opacity: 1;\r\n        transform: scale3d(1, 1, 1);\r\n    }\r\n\r\n};\r\n\r\n// bounceInDown\r\n@keyframes bounceInDown {\r\n    0%, 60%, 75%, 90%, 100% {\r\n        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\r\n    }\r\n\r\n    0% {\r\n        opacity: 0;\r\n        transform: translate3d(0, -3000px, 0);\r\n    }\r\n\r\n    60% {\r\n        opacity: 1;\r\n        transform: translate3d(0, 25px, 0);\r\n    }\r\n\r\n    75% {\r\n        transform: translate3d(0, -10px, 0);\r\n    }\r\n\r\n    90% {\r\n        transform: translate3d(0, 5px, 0);\r\n    }\r\n\r\n    100% {\r\n        transform: none;\r\n    }\r\n}\r\n\r\n@keyframes pulse{\r\n    from{\r\n        transform: scale3d(1, 1, 1);\r\n    }\r\n\r\n    50% {\r\n        transform: scale3d(1.05, 1.05, 1.05);\r\n    }\r\n\r\n    to {\r\n        transform: scale3d(1, 1, 1);\r\n    }\r\n}\r\n\r\n\r\n@keyframes scroll{\r\n    0%{\r\n        opacity:0\r\n    }\r\n    10%{\r\n        opacity:1;\r\n        transform:translateY(0px)\r\n    }\r\n    100% {\r\n        opacity: 0;\r\n        transform: translateY(10px);\r\n    }\r\n}\r\n\r\n//  spin for pagination\r\n@keyframes spin {\r\n    from { transform:rotate(0deg); }\r\n    to { transform:rotate(360deg); }\r\n}\r\n\r\n@keyframes slideInUp {\r\n  from {\r\n    transform: translate3d(0, 100%, 0);\r\n    visibility: visible;\r\n  }\r\n\r\n  to {\r\n    transform: translate3d(0, 0, 0);\r\n  }\r\n}\r\n\r\n@keyframes slideOutDown {\r\n  from {\r\n    transform: translate3d(0, 0, 0);\r\n  }\r\n\r\n  to {\r\n    visibility: hidden;\r\n    transform: translate3d(0, 20%, 0);\r\n  }\r\n}\r\n"],"sourceRoot":""}]);

// exports


/***/ }),
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
/* 30 */
/*!****************************************************************************************!*\
  !*** multi ./build/util/../helpers/hmr-client.js ./scripts/main.js ./styles/main.scss ***!
  \****************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Users\Smigol\projects\ghost\content\themes\mapache\src\build\util/../helpers/hmr-client.js */2);
__webpack_require__(/*! ./scripts/main.js */31);
module.exports = __webpack_require__(/*! ./styles/main.scss */55);


/***/ }),
/* 31 */
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_theia_sticky_sidebar_dist_ResizeSensor__ = __webpack_require__(/*! theia-sticky-sidebar/dist/ResizeSensor */ 32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_theia_sticky_sidebar_dist_ResizeSensor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_theia_sticky_sidebar_dist_ResizeSensor__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_theia_sticky_sidebar__ = __webpack_require__(/*! theia-sticky-sidebar */ 33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_theia_sticky_sidebar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_theia_sticky_sidebar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery_lazyload__ = __webpack_require__(/*! jquery-lazyload */ 34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery_lazyload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery_lazyload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__autoload_jquery_ghostHunter_js__ = __webpack_require__(/*! ./autoload/jquery.ghostHunter.js */ 35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__autoload_jquery_ghostHunter_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__autoload_jquery_ghostHunter_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__autoload_pagination_js__ = __webpack_require__(/*! ./autoload/pagination.js */ 37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__autoload_pagination_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__autoload_pagination_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_Router__ = __webpack_require__(/*! ./util/Router */ 38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__routes_common__ = __webpack_require__(/*! ./routes/common */ 40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__routes_home__ = __webpack_require__(/*! ./routes/home */ 45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__routes_post__ = __webpack_require__(/*! ./routes/post */ 47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__routes_video__ = __webpack_require__(/*! ./routes/video */ 53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__routes_audio__ = __webpack_require__(/*! ./routes/audio */ 54);
// import external dependencies
// import 'jquery';




// Import everything from autoload
 

// import local dependencies







/** Populate Router instance with DOM routes */
var routes = new __WEBPACK_IMPORTED_MODULE_5__util_Router__["a" /* default */]({
  // All pages
  common: __WEBPACK_IMPORTED_MODULE_6__routes_common__["a" /* default */],
  // Home page
  home: __WEBPACK_IMPORTED_MODULE_7__routes_home__["a" /* default */],
  // article
  isArticle: __WEBPACK_IMPORTED_MODULE_8__routes_post__["a" /* default */],
  // Video
  isVideo: __WEBPACK_IMPORTED_MODULE_9__routes_video__["a" /* default */],
  // Audio
  isAudio: __WEBPACK_IMPORTED_MODULE_10__routes_audio__["a" /* default */],
});

// Load Events
$(document).on('ready', function () { return routes.loadEvents(); });

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 32 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 33 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 34 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 35 */
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
	var lunr = __webpack_require__(/*! lunr */ 36);

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 36 */
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
/* 37 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 38 */
/*!********************************!*\
  !*** ./scripts/util/Router.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__camelCase__ = __webpack_require__(/*! ./camelCase */ 39);


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
/* 39 */
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
/* 40 */
/*!**********************************!*\
  !*** ./scripts/routes/common.js ***!
  \**********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_app_search__ = __webpack_require__(/*! ../app/app.search */ 41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_app_follow__ = __webpack_require__(/*! ../app/app.follow */ 42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_facebook__ = __webpack_require__(/*! ../app/app.facebook */ 43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_twitter__ = __webpack_require__(/*! ../app/app.twitter */ 44);





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
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // Follow Social Media
    if (typeof followSocialMedia !== 'undefined') { Object(__WEBPACK_IMPORTED_MODULE_1__app_app_follow__["a" /* default */])(followSocialMedia); } // eslint-disable-line

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
      Object(__WEBPACK_IMPORTED_MODULE_3__app_app_twitter__["a" /* default */])(twitterUserName, twitterNumber); // eslint-disable-line
    }

    // Facebook Witget
    if (typeof fansPageName !== 'undefined') { Object(__WEBPACK_IMPORTED_MODULE_2__app_app_facebook__["a" /* default */])(fansPageName); } // eslint-disable-line

    // Search
    Object(__WEBPACK_IMPORTED_MODULE_0__app_app_search__["a" /* default */])($header, $searchInput, $blogUrl);

    /**
     * Sticky Navbar in (home - tag - author)
     * Show the button to go back top
     */
    mapacheScroll();
  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 41 */
/*!***********************************!*\
  !*** ./scripts/app/app.search.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["a"] = (function ($header, $input, blogUrl) {
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

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 42 */
/*!***********************************!*\
  !*** ./scripts/app/app.follow.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["a"] = (function (links) {
  var urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/; // eslint-disable-line

  return $.each(links, function (name, url) { // eslint-disable-line
    if (typeof url === 'string' && urlRegexp.test(url)) {
      var template = "<a title=\"Follow me in " + name + "\" href=\"" + url + "\" target=\"_blank\" class=\"i-" + name + "\"></a>";
      $('.social_box').append(template);
    }
  });
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 43 */
/*!*************************************!*\
  !*** ./scripts/app/app.facebook.js ***!
  \*************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["a"] = (function (userFacebook) {
  $('.widget-facebook').parent().removeClass('u-hide');
  // const fansPage = `<div class="fb-page" data-href="https://www.facebook.com/${userFacebook}" data-tabs="timeline" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="false">`; // eslint-disable-line
  var fansPage = "<div class=\"fb-page\" data-href=\"https://www.facebook.com/" + userFacebook + "\" data-tabs=\"timeline\" data-small-header=\"true\" data-adapt-container-width=\"true\" data-hide-cover=\"false\" data-show-facepile=\"false\"><blockquote cite=\"https://www.facebook.com/" + userFacebook + "\" class=\"fb-xfbml-parse-ignore\"><a href=\"https://www.facebook.com/" + userFacebook + "\">GodoFredo</a></blockquote></div>"; // eslint-disable-line

  var facebookSdkScript = "<div id=\"fb-root\"></div>\n  <script>(function(d, s, id) {\n    var js, fjs = d.getElementsByTagName(s)[0];\n    if (d.getElementById(id)) return;\n    js = d.createElement(s); js.id = id;\n    js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11';\n    fjs.parentNode.insertBefore(js, fjs);\n  }(document, 'script', 'facebook-jssdk'));</script>";

  if ($("#fb-root").is("div") === false) { $('body').append(facebookSdkScript); }
  $('.widget-facebook').html(fansPage);
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 44 */
/*!************************************!*\
  !*** ./scripts/app/app.twitter.js ***!
  \************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["a"] = (function (name, number) {
  $('.widget-twitter').parent().removeClass('u-hide');
  var twitterBlock = "<a class=\"twitter-timeline\"  href=\"https://twitter.com/" + name + "\" data-chrome=\"nofooter noborders noheader\" data-tweet-limit=\"" + number + "\">Tweets by " + name + "</a><script async src=\"//platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>"; // eslint-disable-line
  $('.widget-twitter').html(twitterBlock);
});;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 45 */
/*!********************************!*\
  !*** ./scripts/routes/home.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_typed_js__ = __webpack_require__(/*! typed.js */ 46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_typed_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_typed_js__);


/* harmony default export */ __webpack_exports__["a"] = ({
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

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 46 */
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
/* 47 */
/*!********************************!*\
  !*** ./scripts/routes/post.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prismjs__ = __webpack_require__(/*! prismjs */ 48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prismjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prismjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader__ = __webpack_require__(/*! prismjs/plugins/autoloader/prism-autoloader */ 50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers__ = __webpack_require__(/*! prismjs/plugins/line-numbers/prism-line-numbers */ 51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_share__ = __webpack_require__(/*! ../app/app.share */ 52);
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


/* harmony default export */ __webpack_exports__["a"] = ({
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

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 48 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 49)))

/***/ }),
/* 49 */
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
/* 50 */
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
/* 51 */
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
/* 52 */
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
/* 53 */
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

/* harmony default export */ __webpack_exports__["a"] = ({
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

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 54 */
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

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 18)))

/***/ }),
/* 55 */
/*!**************************!*\
  !*** ./styles/main.scss ***!
  \**************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 19);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ 16)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 19, function() {
			var newContent = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 19);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 56 */
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
/* 57 */
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
/* 58 */
/*!***************************!*\
  !*** ./fonts/mapache.ttf ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.ttf";

/***/ }),
/* 59 */
/*!****************************!*\
  !*** ./fonts/mapache.woff ***!
  \****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.woff";

/***/ }),
/* 60 */
/*!***************************!*\
  !*** ./fonts/mapache.svg ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.svg";

/***/ }),
/* 61 */
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
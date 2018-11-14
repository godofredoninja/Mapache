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
/******/ 	var hotCurrentHash = "80cfc066ab2e1fa7eb7b"; // eslint-disable-line no-unused-vars
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
/******/ 	return hotCreateRequire(24)(__webpack_require__.s = 24);
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
/* 17 */
/*!**************************************!*\
  !*** ./scripts/app/app.lazy-load.js ***!
  \**************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vanilla_lazyload__ = __webpack_require__(/*! vanilla-lazyload */ 41);


var lazyLoadOptions = {
  elements_selector: '.lazy-load-image',
  threshold: 0,
}

/* harmony default export */ __webpack_exports__["a"] = (function () { return new __WEBPACK_IMPORTED_MODULE_0_vanilla_lazyload__["a" /* default */](lazyLoadOptions) });


/***/ }),
/* 18 */
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../node_modules/cache-loader/dist/cjs.js!../node_modules/css-loader?{"sourceMap":true}!../node_modules/postcss-loader/lib?{"config":{"path":"C://Users//Smigol//Projects//ghost//content//themes//mapache//src//build","ctx":{"open":true,"copy":"images/**_/*","proxyUrl":"http://localhost:3000","cacheBusting":"[name]","paths":{"root":"C://Users//Smigol//Projects//ghost//content//themes//mapache","assets":"C://Users//Smigol//Projects//ghost//content//themes//mapache//src","dist":"C://Users//Smigol//Projects//ghost//content//themes//mapache//assets"},"enabled":{"sourceMaps":true,"optimize":false,"cacheBusting":false,"watcher":true},"watch":["**_/*.hbs"],"entry":{"main":["./scripts/main.js","./styles/main.scss"],"amp":["./scripts/amp.js","./styles/amp.scss"]},"publicPath":"/assets/","devUrl":"http://localhost:2368","env":{"production":false,"development":true},"manifest":{}}},"sourceMap":true}!../node_modules/resolve-url-loader?{"sourceMap":true}!../node_modules/sass-loader/lib/loader.js?{"sourceMap":true,"sourceComments":true}!../node_modules/import-glob!./styles/main.scss ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(/*! ../../node_modules/css-loader/lib/url/escape.js */ 51);
exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ 19)(true);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n\n/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n/* line 11, node_modules/normalize.css/normalize.css */\n\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\n/* line 23, node_modules/normalize.css/normalize.css */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\n/* line 31, node_modules/normalize.css/normalize.css */\n\nmain {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\n/* line 40, node_modules/normalize.css/normalize.css */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\n/* line 53, node_modules/normalize.css/normalize.css */\n\nhr {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 64, node_modules/normalize.css/normalize.css */\n\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\n/* line 76, node_modules/normalize.css/normalize.css */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\n/* line 85, node_modules/normalize.css/normalize.css */\n\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n  /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\n/* line 95, node_modules/normalize.css/normalize.css */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 105, node_modules/normalize.css/normalize.css */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\n/* line 116, node_modules/normalize.css/normalize.css */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\n/* line 125, node_modules/normalize.css/normalize.css */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\n/* line 133, node_modules/normalize.css/normalize.css */\n\nsub {\n  bottom: -0.25em;\n}\n\n/* line 137, node_modules/normalize.css/normalize.css */\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\n/* line 148, node_modules/normalize.css/normalize.css */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\n/* line 160, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\n/* line 176, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput {\n  /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\n/* line 186, node_modules/normalize.css/normalize.css */\n\nbutton,\nselect {\n  /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\n/* line 195, node_modules/normalize.css/normalize.css */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\n/* line 206, node_modules/normalize.css/normalize.css */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\n/* line 218, node_modules/normalize.css/normalize.css */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\n/* line 229, node_modules/normalize.css/normalize.css */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\n/* line 240, node_modules/normalize.css/normalize.css */\n\nlegend {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\n/* line 253, node_modules/normalize.css/normalize.css */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\n/* line 261, node_modules/normalize.css/normalize.css */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n/* line 270, node_modules/normalize.css/normalize.css */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n/* line 280, node_modules/normalize.css/normalize.css */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n/* line 290, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n/* line 299, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n/* line 308, node_modules/normalize.css/normalize.css */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\n/* line 320, node_modules/normalize.css/normalize.css */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\n/* line 328, node_modules/normalize.css/normalize.css */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\n/* line 339, node_modules/normalize.css/normalize.css */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n/* line 347, node_modules/normalize.css/normalize.css */\n\n[hidden] {\n  display: none;\n}\n\n/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\n/* line 7, node_modules/prismjs/themes/prism.css */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: black;\n  background: none;\n  text-shadow: 0 1px white;\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none;\n}\n\n/* line 30, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"]::-moz-selection,\npre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection,\ncode[class*=\"language-\"] ::-moz-selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n\n/* line 36, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"]::selection,\npre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection,\ncode[class*=\"language-\"] ::selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n\n@media print {\n  /* line 43, node_modules/prismjs/themes/prism.css */\n\n  code[class*=\"language-\"],\n  pre[class*=\"language-\"] {\n    text-shadow: none;\n  }\n}\n\n/* Code blocks */\n\n/* line 50, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"] {\n  padding: 1em;\n  margin: .5em 0;\n  overflow: auto;\n}\n\n/* line 56, node_modules/prismjs/themes/prism.css */\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n  background: #f5f2f0;\n}\n\n/* Inline code */\n\n/* line 62, node_modules/prismjs/themes/prism.css */\n\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em;\n  border-radius: .3em;\n  white-space: normal;\n}\n\n/* line 68, node_modules/prismjs/themes/prism.css */\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: slategray;\n}\n\n/* line 75, node_modules/prismjs/themes/prism.css */\n\n.token.punctuation {\n  color: #999;\n}\n\n/* line 79, node_modules/prismjs/themes/prism.css */\n\n.namespace {\n  opacity: .7;\n}\n\n/* line 83, node_modules/prismjs/themes/prism.css */\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #905;\n}\n\n/* line 93, node_modules/prismjs/themes/prism.css */\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n  color: #690;\n}\n\n/* line 102, node_modules/prismjs/themes/prism.css */\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n  color: #9a6e3a;\n  background: rgba(255, 255, 255, 0.5);\n}\n\n/* line 111, node_modules/prismjs/themes/prism.css */\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #07a;\n}\n\n/* line 117, node_modules/prismjs/themes/prism.css */\n\n.token.function,\n.token.class-name {\n  color: #DD4A68;\n}\n\n/* line 122, node_modules/prismjs/themes/prism.css */\n\n.token.regex,\n.token.important,\n.token.variable {\n  color: #e90;\n}\n\n/* line 128, node_modules/prismjs/themes/prism.css */\n\n.token.important,\n.token.bold {\n  font-weight: bold;\n}\n\n/* line 132, node_modules/prismjs/themes/prism.css */\n\n.token.italic {\n  font-style: italic;\n}\n\n/* line 136, node_modules/prismjs/themes/prism.css */\n\n.token.entity {\n  cursor: help;\n}\n\n/* line 1, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\npre[class*=\"language-\"].line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber;\n}\n\n/* line 7, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\npre[class*=\"language-\"].line-numbers > code {\n  position: relative;\n  white-space: inherit;\n}\n\n/* line 12, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n/* line 29, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber;\n}\n\n/* line 35, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right;\n}\n\n/* line 1, src/styles/common/_mixins.scss */\n\n.link {\n  color: inherit;\n  cursor: pointer;\n  text-decoration: none;\n}\n\n/* line 7, src/styles/common/_mixins.scss */\n\n.link--accent {\n  color: var(--primary-color);\n  text-decoration: none;\n}\n\n/* line 22, src/styles/common/_mixins.scss */\n\n.u-absolute0 {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n/* line 30, src/styles/common/_mixins.scss */\n\n.u-textColorDarker {\n  color: rgba(0, 0, 0, 0.8) !important;\n  fill: rgba(0, 0, 0, 0.8) !important;\n}\n\n/* line 35, src/styles/common/_mixins.scss */\n\n.warning::before,\n.note::before,\n.success::before,\n[class^=\"i-\"]::before,\n[class*=\" i-\"]::before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  /* stylelint-disable-line */\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* line 2, src/styles/autoload/_zoom.scss */\n\nimg[data-action=\"zoom\"] {\n  cursor: -webkit-zoom-in;\n  cursor: zoom-in;\n}\n\n/* line 5, src/styles/autoload/_zoom.scss */\n\n.zoom-img,\n.zoom-img-wrap {\n  position: relative;\n  z-index: 666;\n  -webkit-transition: all 300ms;\n  -o-transition: all 300ms;\n  transition: all 300ms;\n}\n\n/* line 13, src/styles/autoload/_zoom.scss */\n\nimg.zoom-img {\n  cursor: pointer;\n  cursor: -webkit-zoom-out;\n  cursor: -moz-zoom-out;\n}\n\n/* line 18, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay {\n  z-index: 420;\n  background: #fff;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  pointer-events: none;\n  filter: \"alpha(opacity=0)\";\n  opacity: 0;\n  -webkit-transition: opacity 300ms;\n  -o-transition: opacity 300ms;\n  transition: opacity 300ms;\n}\n\n/* line 33, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay-open .zoom-overlay {\n  filter: \"alpha(opacity=100)\";\n  opacity: 1;\n}\n\n/* line 37, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay-open,\n.zoom-overlay-transitioning {\n  cursor: default;\n}\n\n/* line 1, src/styles/common/_global.scss */\n\n:root {\n  --black: #000;\n  --white: #fff;\n  --primary-color: #1C9963;\n  --secondary-color: #2ad88d;\n  --header-color: #BBF1B9;\n  --header-color-hover: #EEFFEA;\n  --post-color-link: #2ad88d;\n  --story-cover-category-color: #2ad88d;\n  --composite-color: #CC116E;\n  --footer-color-link: #2ad88d;\n  --media-type-color: #2ad88d;\n}\n\n/* line 15, src/styles/common/_global.scss */\n\n*,\n*::before,\n*::after {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\n/* line 19, src/styles/common/_global.scss */\n\na {\n  color: inherit;\n  text-decoration: none;\n}\n\n/* line 23, src/styles/common/_global.scss */\n\na:active,\na:hover {\n  outline: 0;\n}\n\n/* line 29, src/styles/common/_global.scss */\n\nblockquote {\n  border-left: 3px solid #000;\n  color: #000;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-size: 1.1875rem;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin: 30px 0 0 -12px;\n  padding-bottom: 2px;\n  padding-left: 20px;\n}\n\n/* line 42, src/styles/common/_global.scss */\n\nblockquote p:first-of-type {\n  margin-top: 0;\n}\n\n/* line 45, src/styles/common/_global.scss */\n\nbody {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 16px;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin: 0 auto;\n  text-rendering: optimizeLegibility;\n  overflow-x: hidden;\n}\n\n/* line 59, src/styles/common/_global.scss */\n\nhtml {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  font-size: 16px;\n}\n\n/* line 64, src/styles/common/_global.scss */\n\nfigure {\n  margin: 0;\n}\n\n/* line 68, src/styles/common/_global.scss */\n\nfigcaption {\n  color: rgba(0, 0, 0, 0.68);\n  display: block;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  -webkit-font-feature-settings: \"liga\" on, \"lnum\" on;\n          font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%;\n}\n\n/* line 89, src/styles/common/_global.scss */\n\nkbd,\nsamp,\ncode {\n  background: #f7f7f7;\n  border-radius: 4px;\n  color: #c7254e;\n  font-family: \"Fira Mono\", monospace !important;\n  font-size: 15px;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\n/* line 99, src/styles/common/_global.scss */\n\npre {\n  background-color: #f7f7f7 !important;\n  border-radius: 4px;\n  font-family: \"Fira Mono\", monospace !important;\n  font-size: 15px;\n  margin-top: 30px !important;\n  max-width: 100%;\n  overflow: hidden;\n  padding: 1rem;\n  position: relative;\n  word-wrap: normal;\n}\n\n/* line 111, src/styles/common/_global.scss */\n\npre code {\n  background: transparent;\n  color: #37474f;\n  padding: 0;\n  text-shadow: 0 1px #fff;\n}\n\n/* line 119, src/styles/common/_global.scss */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: #37474f;\n  line-height: 1.4;\n}\n\n/* line 124, src/styles/common/_global.scss */\n\ncode[class*=language-] .token.comment,\npre[class*=language-] .token.comment {\n  opacity: .8;\n}\n\n/* line 126, src/styles/common/_global.scss */\n\ncode[class*=language-].line-numbers,\npre[class*=language-].line-numbers {\n  padding-left: 58px;\n}\n\n/* line 129, src/styles/common/_global.scss */\n\ncode[class*=language-].line-numbers::before,\npre[class*=language-].line-numbers::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  background: #F0EDEE;\n  width: 40px;\n  height: 100%;\n}\n\n/* line 140, src/styles/common/_global.scss */\n\ncode[class*=language-] .line-numbers-rows,\npre[class*=language-] .line-numbers-rows {\n  border-right: none;\n  top: -3px;\n  left: -58px;\n}\n\n/* line 145, src/styles/common/_global.scss */\n\ncode[class*=language-] .line-numbers-rows > span::before,\npre[class*=language-] .line-numbers-rows > span::before {\n  padding-right: 0;\n  text-align: center;\n  opacity: .8;\n}\n\n/* line 155, src/styles/common/_global.scss */\n\nhr:not(.hr-list):not(.post-footer-hr) {\n  border: 0;\n  display: block;\n  margin: 50px auto;\n  text-align: center;\n}\n\n/* line 161, src/styles/common/_global.scss */\n\nhr:not(.hr-list):not(.post-footer-hr)::before {\n  color: rgba(0, 0, 0, 0.6);\n  content: '...';\n  display: inline-block;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 28px;\n  font-weight: 400;\n  letter-spacing: .6em;\n  position: relative;\n  top: -25px;\n}\n\n/* line 174, src/styles/common/_global.scss */\n\n.post-footer-hr {\n  height: 1px;\n  margin: 32px 0;\n  border: 0;\n  background-color: #ddd;\n}\n\n/* line 181, src/styles/common/_global.scss */\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n}\n\n/* line 187, src/styles/common/_global.scss */\n\nimg:not([src]) {\n  visibility: hidden;\n}\n\n/* line 192, src/styles/common/_global.scss */\n\ni {\n  vertical-align: middle;\n}\n\n/* line 197, src/styles/common/_global.scss */\n\ninput {\n  border: none;\n  outline: 0;\n}\n\n/* line 202, src/styles/common/_global.scss */\n\nol,\nul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0;\n}\n\n/* line 209, src/styles/common/_global.scss */\n\nmark {\n  background-color: transparent !important;\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#d7fdd3), to(#d7fdd3));\n  background-image: -webkit-linear-gradient(top, #d7fdd3, #d7fdd3);\n  background-image: -o-linear-gradient(top, #d7fdd3, #d7fdd3);\n  background-image: linear-gradient(to bottom, #d7fdd3, #d7fdd3);\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 215, src/styles/common/_global.scss */\n\nq {\n  color: rgba(0, 0, 0, 0.44);\n  display: block;\n  font-size: 28px;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.014em;\n  line-height: 1.48;\n  padding-left: 50px;\n  padding-top: 15px;\n  text-align: left;\n}\n\n/* line 227, src/styles/common/_global.scss */\n\nq::before,\nq::after {\n  display: none;\n}\n\n/* line 230, src/styles/common/_global.scss */\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n/* line 245, src/styles/common/_global.scss */\n\ntable th,\ntable td {\n  padding: 6px 13px;\n  border: 1px solid #dfe2e5;\n}\n\n/* line 251, src/styles/common/_global.scss */\n\ntable tr:nth-child(2n) {\n  background-color: #f6f8fa;\n}\n\n/* line 255, src/styles/common/_global.scss */\n\ntable th {\n  letter-spacing: 0.2px;\n  text-transform: uppercase;\n  font-weight: 600;\n}\n\n/* line 269, src/styles/common/_global.scss */\n\n.link--underline:active,\n.link--underline:focus,\n.link--underline:hover {\n  text-decoration: underline;\n}\n\n/* line 279, src/styles/common/_global.scss */\n\n.main {\n  margin-bottom: 4em;\n  min-height: 90vh;\n}\n\n/* line 281, src/styles/common/_global.scss */\n\n.main,\n.footer {\n  -webkit-transition: -webkit-transform .5s ease;\n  transition: -webkit-transform .5s ease;\n  -o-transition: -o-transform .5s ease;\n  transition: transform .5s ease;\n  transition: transform .5s ease, -webkit-transform .5s ease, -o-transform .5s ease;\n}\n\n/* line 286, src/styles/common/_global.scss */\n\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n}\n\n/* line 289, src/styles/common/_global.scss */\n\n.warning::before {\n  content: \"\\E002\";\n}\n\n/* line 292, src/styles/common/_global.scss */\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n}\n\n/* line 295, src/styles/common/_global.scss */\n\n.note::before {\n  content: \"\\E907\";\n}\n\n/* line 298, src/styles/common/_global.scss */\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n}\n\n/* line 301, src/styles/common/_global.scss */\n\n.success::before {\n  color: #00bfa5;\n  content: \"\\E86C\";\n}\n\n/* line 304, src/styles/common/_global.scss */\n\n.warning,\n.note,\n.success {\n  display: block;\n  font-size: 18px !important;\n  line-height: 1.58 !important;\n  margin-top: 28px;\n  padding: 12px 24px 12px 60px;\n}\n\n/* line 311, src/styles/common/_global.scss */\n\n.warning a,\n.note a,\n.success a {\n  color: inherit;\n  text-decoration: underline;\n}\n\n/* line 316, src/styles/common/_global.scss */\n\n.warning::before,\n.note::before,\n.success::before {\n  float: left;\n  font-size: 24px;\n  margin-left: -36px;\n  margin-top: -5px;\n}\n\n/* line 329, src/styles/common/_global.scss */\n\n.tag-description {\n  max-width: 700px;\n}\n\n/* line 330, src/styles/common/_global.scss */\n\n.tag.has--image {\n  min-height: 350px;\n}\n\n/* line 335, src/styles/common/_global.scss */\n\n.with-tooltip {\n  overflow: visible;\n  position: relative;\n}\n\n/* line 339, src/styles/common/_global.scss */\n\n.with-tooltip::after {\n  background: rgba(0, 0, 0, 0.85);\n  border-radius: 4px;\n  color: #fff;\n  content: attr(data-tooltip);\n  display: inline-block;\n  font-size: 12px;\n  font-weight: 600;\n  left: 50%;\n  line-height: 1.25;\n  min-width: 130px;\n  opacity: 0;\n  padding: 4px 8px;\n  pointer-events: none;\n  position: absolute;\n  text-align: center;\n  text-transform: none;\n  top: -30px;\n  will-change: opacity, transform;\n  z-index: 1;\n}\n\n/* line 361, src/styles/common/_global.scss */\n\n.with-tooltip:hover::after {\n  -webkit-animation: tooltip .1s ease-out both;\n       -o-animation: tooltip .1s ease-out both;\n          animation: tooltip .1s ease-out both;\n}\n\n/* line 368, src/styles/common/_global.scss */\n\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n}\n\n/* line 371, src/styles/common/_global.scss */\n\n.errorPage-link {\n  left: -5px;\n  padding: 24px 60px;\n  top: -6px;\n}\n\n/* line 377, src/styles/common/_global.scss */\n\n.errorPage-text {\n  margin-top: 60px;\n  white-space: pre-wrap;\n}\n\n/* line 382, src/styles/common/_global.scss */\n\n.errorPage-wrap {\n  color: rgba(0, 0, 0, 0.4);\n  padding: 7vw 4vw;\n}\n\n/* line 390, src/styles/common/_global.scss */\n\n.video-responsive {\n  display: block;\n  height: 0;\n  margin-top: 30px;\n  overflow: hidden;\n  padding: 0 0 56.25%;\n  position: relative;\n  width: 100%;\n}\n\n/* line 399, src/styles/common/_global.scss */\n\n.video-responsive iframe {\n  border: 0;\n  bottom: 0;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n/* line 409, src/styles/common/_global.scss */\n\n.video-responsive video {\n  border: 0;\n  bottom: 0;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n/* line 420, src/styles/common/_global.scss */\n\n.kg-embed-card .video-responsive {\n  margin-top: 0;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.kg-gallery-container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  max-width: 100%;\n  width: 100%;\n}\n\n/* line 433, src/styles/common/_global.scss */\n\n.kg-gallery-row {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n/* line 438, src/styles/common/_global.scss */\n\n.kg-gallery-row:not(:first-of-type) {\n  margin: 0.75em 0 0 0;\n}\n\n/* line 442, src/styles/common/_global.scss */\n\n.kg-gallery-image img {\n  display: block;\n  margin: 0;\n  width: 100%;\n  height: 100%;\n}\n\n/* line 449, src/styles/common/_global.scss */\n\n.kg-gallery-image:not(:first-of-type) {\n  margin: 0 0 0 0.75em;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-facebook {\n  color: #3b5998 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-facebook,\n.sideNav-follow .i-facebook {\n  background-color: #3b5998 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-twitter {\n  color: #55acee !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-twitter,\n.sideNav-follow .i-twitter {\n  background-color: #55acee !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-google {\n  color: #dd4b39 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-google,\n.sideNav-follow .i-google {\n  background-color: #dd4b39 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-instagram {\n  color: #306088 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-instagram,\n.sideNav-follow .i-instagram {\n  background-color: #306088 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-youtube {\n  color: #e52d27 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-youtube,\n.sideNav-follow .i-youtube {\n  background-color: #e52d27 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-github {\n  color: #555 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-github,\n.sideNav-follow .i-github {\n  background-color: #555 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-linkedin {\n  color: #007bb6 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-linkedin,\n.sideNav-follow .i-linkedin {\n  background-color: #007bb6 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-spotify {\n  color: #2ebd59 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-spotify,\n.sideNav-follow .i-spotify {\n  background-color: #2ebd59 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-codepen {\n  color: #222 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-codepen,\n.sideNav-follow .i-codepen {\n  background-color: #222 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-behance {\n  color: #131418 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-behance,\n.sideNav-follow .i-behance {\n  background-color: #131418 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-dribbble {\n  color: #ea4c89 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-dribbble,\n.sideNav-follow .i-dribbble {\n  background-color: #ea4c89 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-flickr {\n  color: #0063dc !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-flickr,\n.sideNav-follow .i-flickr {\n  background-color: #0063dc !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-reddit {\n  color: #ff4500 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-reddit,\n.sideNav-follow .i-reddit {\n  background-color: #ff4500 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-pocket {\n  color: #f50057 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-pocket,\n.sideNav-follow .i-pocket {\n  background-color: #f50057 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-pinterest {\n  color: #bd081c !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-pinterest,\n.sideNav-follow .i-pinterest {\n  background-color: #bd081c !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-whatsapp {\n  color: #64d448 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-whatsapp,\n.sideNav-follow .i-whatsapp {\n  background-color: #64d448 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-telegram {\n  color: #08c !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-telegram,\n.sideNav-follow .i-telegram {\n  background-color: #08c !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-discord {\n  color: #7289da !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-discord,\n.sideNav-follow .i-discord {\n  background-color: #7289da !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-rss {\n  color: orange !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-rss,\n.sideNav-follow .i-rss {\n  background-color: orange !important;\n}\n\n/* line 480, src/styles/common/_global.scss */\n\n.rocket {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  width: 60px;\n  z-index: 5;\n}\n\n/* line 488, src/styles/common/_global.scss */\n\n.rocket:hover svg path {\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n/* line 493, src/styles/common/_global.scss */\n\n.svgIcon {\n  display: inline-block;\n}\n\n/* line 497, src/styles/common/_global.scss */\n\nsvg {\n  height: auto;\n  width: 100%;\n}\n\n/* line 505, src/styles/common/_global.scss */\n\n.load-more {\n  max-width: 70% !important;\n}\n\n/* line 510, src/styles/common/_global.scss */\n\n.loadingBar {\n  background-color: #48e79a;\n  display: none;\n  height: 2px;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  -webkit-transform: translateX(100%);\n       -o-transform: translateX(100%);\n          transform: translateX(100%);\n  z-index: 800;\n}\n\n/* line 522, src/styles/common/_global.scss */\n\n.is-loading .loadingBar {\n  -webkit-animation: loading-bar 1s ease-in-out infinite;\n       -o-animation: loading-bar 1s ease-in-out infinite;\n          animation: loading-bar 1s ease-in-out infinite;\n  -webkit-animation-delay: .8s;\n       -o-animation-delay: .8s;\n          animation-delay: .8s;\n  display: block;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 531, src/styles/common/_global.scss */\n\n  blockquote {\n    margin-left: -5px;\n    font-size: 1.125rem;\n  }\n\n  /* line 533, src/styles/common/_global.scss */\n\n  .kg-image-card,\n  .kg-embed-card {\n    margin-right: -20px;\n    margin-left: -20px;\n  }\n}\n\n/* line 2, src/styles/components/_grid.scss */\n\n.extreme-container {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding: 0 16px;\n  width: 100%;\n}\n\n/* line 25, src/styles/components/_grid.scss */\n\n.col-left,\n.cc-video-left {\n  -ms-flex-preferred-size: 0;\n      flex-basis: 0;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  max-width: 100%;\n  padding-right: 10px;\n  padding-left: 10px;\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 38, src/styles/components/_grid.scss */\n\n  .col-left {\n    max-width: calc(100% - 340px);\n  }\n\n  /* line 39, src/styles/components/_grid.scss */\n\n  .cc-video-left {\n    max-width: calc(100% - 320px);\n  }\n\n  /* line 40, src/styles/components/_grid.scss */\n\n  .cc-video-right {\n    -ms-flex-preferred-size: 320px !important;\n        flex-basis: 320px !important;\n    max-width: 320px !important;\n  }\n\n  /* line 41, src/styles/components/_grid.scss */\n\n  body.is-article .col-left {\n    padding-right: 40px;\n  }\n}\n\n/* line 44, src/styles/components/_grid.scss */\n\n.col-right {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  padding-left: 10px;\n  padding-right: 10px;\n  width: 320px;\n}\n\n/* line 52, src/styles/components/_grid.scss */\n\n.row {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -webkit-box-flex: 0;\n      -ms-flex: 0 1 auto;\n          flex: 0 1 auto;\n  margin-left: -10px;\n  margin-right: -10px;\n}\n\n/* line 60, src/styles/components/_grid.scss */\n\n.row .col {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  padding-left: 10px;\n  padding-right: 10px;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s1 {\n  -ms-flex-preferred-size: 8.33333%;\n      flex-basis: 8.33333%;\n  max-width: 8.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s2 {\n  -ms-flex-preferred-size: 16.66667%;\n      flex-basis: 16.66667%;\n  max-width: 16.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s3 {\n  -ms-flex-preferred-size: 25%;\n      flex-basis: 25%;\n  max-width: 25%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s4 {\n  -ms-flex-preferred-size: 33.33333%;\n      flex-basis: 33.33333%;\n  max-width: 33.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s5 {\n  -ms-flex-preferred-size: 41.66667%;\n      flex-basis: 41.66667%;\n  max-width: 41.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s6 {\n  -ms-flex-preferred-size: 50%;\n      flex-basis: 50%;\n  max-width: 50%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s7 {\n  -ms-flex-preferred-size: 58.33333%;\n      flex-basis: 58.33333%;\n  max-width: 58.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s8 {\n  -ms-flex-preferred-size: 66.66667%;\n      flex-basis: 66.66667%;\n  max-width: 66.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s9 {\n  -ms-flex-preferred-size: 75%;\n      flex-basis: 75%;\n  max-width: 75%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s10 {\n  -ms-flex-preferred-size: 83.33333%;\n      flex-basis: 83.33333%;\n  max-width: 83.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s11 {\n  -ms-flex-preferred-size: 91.66667%;\n      flex-basis: 91.66667%;\n  max-width: 91.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s12 {\n  -ms-flex-preferred-size: 100%;\n      flex-basis: 100%;\n  max-width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m1 {\n    -ms-flex-preferred-size: 8.33333%;\n        flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m2 {\n    -ms-flex-preferred-size: 16.66667%;\n        flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m3 {\n    -ms-flex-preferred-size: 25%;\n        flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m4 {\n    -ms-flex-preferred-size: 33.33333%;\n        flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m5 {\n    -ms-flex-preferred-size: 41.66667%;\n        flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m6 {\n    -ms-flex-preferred-size: 50%;\n        flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m7 {\n    -ms-flex-preferred-size: 58.33333%;\n        flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m8 {\n    -ms-flex-preferred-size: 66.66667%;\n        flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m9 {\n    -ms-flex-preferred-size: 75%;\n        flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m10 {\n    -ms-flex-preferred-size: 83.33333%;\n        flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m11 {\n    -ms-flex-preferred-size: 91.66667%;\n        flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m12 {\n    -ms-flex-preferred-size: 100%;\n        flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l1 {\n    -ms-flex-preferred-size: 8.33333%;\n        flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l2 {\n    -ms-flex-preferred-size: 16.66667%;\n        flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l3 {\n    -ms-flex-preferred-size: 25%;\n        flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l4 {\n    -ms-flex-preferred-size: 33.33333%;\n        flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l5 {\n    -ms-flex-preferred-size: 41.66667%;\n        flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l6 {\n    -ms-flex-preferred-size: 50%;\n        flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l7 {\n    -ms-flex-preferred-size: 58.33333%;\n        flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l8 {\n    -ms-flex-preferred-size: 66.66667%;\n        flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l9 {\n    -ms-flex-preferred-size: 75%;\n        flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l10 {\n    -ms-flex-preferred-size: 83.33333%;\n        flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l11 {\n    -ms-flex-preferred-size: 91.66667%;\n        flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l12 {\n    -ms-flex-preferred-size: 100%;\n        flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n/* line 3, src/styles/common/_typography.scss */\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  color: inherit;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-weight: 600;\n  line-height: 1.1;\n  margin: 0;\n}\n\n/* line 10, src/styles/common/_typography.scss */\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  color: inherit;\n  line-height: inherit;\n}\n\n/* line 16, src/styles/common/_typography.scss */\n\nh1 {\n  font-size: 2rem;\n}\n\n/* line 17, src/styles/common/_typography.scss */\n\nh2 {\n  font-size: 1.875rem;\n}\n\n/* line 18, src/styles/common/_typography.scss */\n\nh3 {\n  font-size: 1.6rem;\n}\n\n/* line 19, src/styles/common/_typography.scss */\n\nh4 {\n  font-size: 1.4rem;\n}\n\n/* line 20, src/styles/common/_typography.scss */\n\nh5 {\n  font-size: 1.2rem;\n}\n\n/* line 21, src/styles/common/_typography.scss */\n\nh6 {\n  font-size: 1rem;\n}\n\n/* line 23, src/styles/common/_typography.scss */\n\np {\n  margin: 0;\n}\n\n/* line 2, src/styles/common/_utilities.scss */\n\n.u-textColorNormal {\n  color: #999999 !important;\n  fill: #999999 !important;\n}\n\n/* line 9, src/styles/common/_utilities.scss */\n\n.u-textColorWhite {\n  color: #fff !important;\n  fill: #fff !important;\n}\n\n/* line 14, src/styles/common/_utilities.scss */\n\n.u-hoverColorNormal:hover {\n  color: rgba(0, 0, 0, 0.6);\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n/* line 19, src/styles/common/_utilities.scss */\n\n.u-accentColor--iconNormal {\n  color: #1C9963;\n  fill: #1C9963;\n}\n\n/* line 25, src/styles/common/_utilities.scss */\n\n.u-bgColor {\n  background-color: var(--primary-color);\n}\n\n/* line 30, src/styles/common/_utilities.scss */\n\n.u-relative {\n  position: relative;\n}\n\n/* line 31, src/styles/common/_utilities.scss */\n\n.u-absolute {\n  position: absolute;\n}\n\n/* line 33, src/styles/common/_utilities.scss */\n\n.u-fixed {\n  position: fixed !important;\n}\n\n/* line 35, src/styles/common/_utilities.scss */\n\n.u-block {\n  display: block !important;\n}\n\n/* line 36, src/styles/common/_utilities.scss */\n\n.u-inlineBlock {\n  display: inline-block;\n}\n\n/* line 39, src/styles/common/_utilities.scss */\n\n.u-backgroundDark {\n  background-color: #0d0f10;\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n\n/* line 50, src/styles/common/_utilities.scss */\n\n.u-gradient {\n  background: -webkit-gradient(linear, left top, left bottom, color-stop(20%, transparent), to(#000));\n  background: -webkit-linear-gradient(top, transparent 20%, #000 100%);\n  background: -o-linear-gradient(top, transparent 20%, #000 100%);\n  background: linear-gradient(to bottom, transparent 20%, #000 100%);\n  bottom: 0;\n  height: 90%;\n  left: 0;\n  position: absolute;\n  right: 0;\n  z-index: 1;\n}\n\n/* line 61, src/styles/common/_utilities.scss */\n\n.zindex1 {\n  z-index: 1;\n}\n\n/* line 62, src/styles/common/_utilities.scss */\n\n.zindex2 {\n  z-index: 2;\n}\n\n/* line 63, src/styles/common/_utilities.scss */\n\n.zindex3 {\n  z-index: 3;\n}\n\n/* line 64, src/styles/common/_utilities.scss */\n\n.zindex4 {\n  z-index: 4;\n}\n\n/* line 67, src/styles/common/_utilities.scss */\n\n.u-backgroundWhite {\n  background-color: #fafafa;\n}\n\n/* line 68, src/styles/common/_utilities.scss */\n\n.u-backgroundColorGrayLight {\n  background-color: #f0f0f0 !important;\n}\n\n/* line 71, src/styles/common/_utilities.scss */\n\n.u-clear::after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n/* line 78, src/styles/common/_utilities.scss */\n\n.u-fontSizeMicro {\n  font-size: 11px;\n}\n\n/* line 79, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmallest {\n  font-size: 12px;\n}\n\n/* line 80, src/styles/common/_utilities.scss */\n\n.u-fontSize13 {\n  font-size: 13px;\n}\n\n/* line 81, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmaller {\n  font-size: 14px;\n}\n\n/* line 82, src/styles/common/_utilities.scss */\n\n.u-fontSize15 {\n  font-size: 15px;\n}\n\n/* line 83, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmall {\n  font-size: 16px;\n}\n\n/* line 84, src/styles/common/_utilities.scss */\n\n.u-fontSizeBase {\n  font-size: 18px;\n}\n\n/* line 85, src/styles/common/_utilities.scss */\n\n.u-fontSize20 {\n  font-size: 20px;\n}\n\n/* line 86, src/styles/common/_utilities.scss */\n\n.u-fontSize21 {\n  font-size: 21px;\n}\n\n/* line 87, src/styles/common/_utilities.scss */\n\n.u-fontSize22 {\n  font-size: 22px;\n}\n\n/* line 88, src/styles/common/_utilities.scss */\n\n.u-fontSizeLarge {\n  font-size: 24px;\n}\n\n/* line 89, src/styles/common/_utilities.scss */\n\n.u-fontSize26 {\n  font-size: 26px;\n}\n\n/* line 90, src/styles/common/_utilities.scss */\n\n.u-fontSize28 {\n  font-size: 28px;\n}\n\n/* line 91, src/styles/common/_utilities.scss */\n\n.u-fontSizeLarger,\n.media-type {\n  font-size: 32px;\n}\n\n/* line 92, src/styles/common/_utilities.scss */\n\n.u-fontSize36 {\n  font-size: 36px;\n}\n\n/* line 93, src/styles/common/_utilities.scss */\n\n.u-fontSize40 {\n  font-size: 40px;\n}\n\n/* line 94, src/styles/common/_utilities.scss */\n\n.u-fontSizeLargest {\n  font-size: 44px;\n}\n\n/* line 95, src/styles/common/_utilities.scss */\n\n.u-fontSizeJumbo {\n  font-size: 50px;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 98, src/styles/common/_utilities.scss */\n\n  .u-md-fontSizeBase {\n    font-size: 18px;\n  }\n\n  /* line 99, src/styles/common/_utilities.scss */\n\n  .u-md-fontSize22 {\n    font-size: 22px;\n  }\n\n  /* line 100, src/styles/common/_utilities.scss */\n\n  .u-md-fontSizeLarger {\n    font-size: 32px;\n  }\n}\n\n/* line 116, src/styles/common/_utilities.scss */\n\n.u-fontWeightThin {\n  font-weight: 300;\n}\n\n/* line 117, src/styles/common/_utilities.scss */\n\n.u-fontWeightNormal {\n  font-weight: 400;\n}\n\n/* line 118, src/styles/common/_utilities.scss */\n\n.u-fontWeightMedium {\n  font-weight: 500;\n}\n\n/* line 119, src/styles/common/_utilities.scss */\n\n.u-fontWeightSemibold {\n  font-weight: 600 !important;\n}\n\n/* line 120, src/styles/common/_utilities.scss */\n\n.u-fontWeightBold {\n  font-weight: 700;\n}\n\n/* line 121, src/styles/common/_utilities.scss */\n\n.u-fontWeightBolder {\n  font-weight: 900;\n}\n\n/* line 123, src/styles/common/_utilities.scss */\n\n.u-textUppercase {\n  text-transform: uppercase;\n}\n\n/* line 124, src/styles/common/_utilities.scss */\n\n.u-textCapitalize {\n  text-transform: capitalize;\n}\n\n/* line 125, src/styles/common/_utilities.scss */\n\n.u-textAlignCenter {\n  text-align: center;\n}\n\n/* line 127, src/styles/common/_utilities.scss */\n\n.u-noWrapWithEllipsis {\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important;\n}\n\n/* line 134, src/styles/common/_utilities.scss */\n\n.u-marginAuto {\n  margin-left: auto;\n  margin-right: auto;\n}\n\n/* line 135, src/styles/common/_utilities.scss */\n\n.u-marginTop20 {\n  margin-top: 20px;\n}\n\n/* line 136, src/styles/common/_utilities.scss */\n\n.u-marginTop30 {\n  margin-top: 30px;\n}\n\n/* line 137, src/styles/common/_utilities.scss */\n\n.u-marginBottom10 {\n  margin-bottom: 10px;\n}\n\n/* line 138, src/styles/common/_utilities.scss */\n\n.u-marginBottom15 {\n  margin-bottom: 15px;\n}\n\n/* line 139, src/styles/common/_utilities.scss */\n\n.u-marginBottom20 {\n  margin-bottom: 20px !important;\n}\n\n/* line 140, src/styles/common/_utilities.scss */\n\n.u-marginBottom30 {\n  margin-bottom: 30px;\n}\n\n/* line 141, src/styles/common/_utilities.scss */\n\n.u-marginBottom40 {\n  margin-bottom: 40px;\n}\n\n/* line 144, src/styles/common/_utilities.scss */\n\n.u-padding0 {\n  padding: 0 !important;\n}\n\n/* line 145, src/styles/common/_utilities.scss */\n\n.u-padding20 {\n  padding: 20px;\n}\n\n/* line 146, src/styles/common/_utilities.scss */\n\n.u-padding15 {\n  padding: 15px !important;\n}\n\n/* line 147, src/styles/common/_utilities.scss */\n\n.u-paddingBottom2 {\n  padding-bottom: 2px;\n}\n\n/* line 148, src/styles/common/_utilities.scss */\n\n.u-paddingBottom30 {\n  padding-bottom: 30px;\n}\n\n/* line 149, src/styles/common/_utilities.scss */\n\n.u-paddingBottom20 {\n  padding-bottom: 20px;\n}\n\n/* line 150, src/styles/common/_utilities.scss */\n\n.u-paddingRight10 {\n  padding-right: 10px;\n}\n\n/* line 151, src/styles/common/_utilities.scss */\n\n.u-paddingLeft15 {\n  padding-left: 15px;\n}\n\n/* line 153, src/styles/common/_utilities.scss */\n\n.u-paddingTop2 {\n  padding-top: 2px;\n}\n\n/* line 154, src/styles/common/_utilities.scss */\n\n.u-paddingTop5 {\n  padding-top: 5px;\n}\n\n/* line 155, src/styles/common/_utilities.scss */\n\n.u-paddingTop10 {\n  padding-top: 10px;\n}\n\n/* line 156, src/styles/common/_utilities.scss */\n\n.u-paddingTop15 {\n  padding-top: 15px;\n}\n\n/* line 157, src/styles/common/_utilities.scss */\n\n.u-paddingTop20 {\n  padding-top: 20px;\n}\n\n/* line 158, src/styles/common/_utilities.scss */\n\n.u-paddingTop30 {\n  padding-top: 30px;\n}\n\n/* line 160, src/styles/common/_utilities.scss */\n\n.u-paddingBottom15 {\n  padding-bottom: 15px;\n}\n\n/* line 162, src/styles/common/_utilities.scss */\n\n.u-paddingRight20 {\n  padding-right: 20px;\n}\n\n/* line 163, src/styles/common/_utilities.scss */\n\n.u-paddingLeft20 {\n  padding-left: 20px;\n}\n\n/* line 165, src/styles/common/_utilities.scss */\n\n.u-contentTitle {\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-style: normal;\n  font-weight: 900;\n  letter-spacing: -.028em;\n}\n\n/* line 173, src/styles/common/_utilities.scss */\n\n.u-lineHeight1 {\n  line-height: 1;\n}\n\n/* line 174, src/styles/common/_utilities.scss */\n\n.u-lineHeightTight {\n  line-height: 1.2;\n}\n\n/* line 177, src/styles/common/_utilities.scss */\n\n.u-overflowHidden {\n  overflow: hidden;\n}\n\n/* line 180, src/styles/common/_utilities.scss */\n\n.u-floatRight {\n  float: right;\n}\n\n/* line 181, src/styles/common/_utilities.scss */\n\n.u-floatLeft {\n  float: left;\n}\n\n/* line 184, src/styles/common/_utilities.scss */\n\n.u-flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n/* line 185, src/styles/common/_utilities.scss */\n\n.u-flexCenter,\n.media-type {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n/* line 186, src/styles/common/_utilities.scss */\n\n.u-flexContentCenter,\n.media-type {\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n/* line 188, src/styles/common/_utilities.scss */\n\n.u-flex1 {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n}\n\n/* line 189, src/styles/common/_utilities.scss */\n\n.u-flex0 {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n}\n\n/* line 190, src/styles/common/_utilities.scss */\n\n.u-flexWrap {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n\n/* line 192, src/styles/common/_utilities.scss */\n\n.u-flexColumn {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n/* line 198, src/styles/common/_utilities.scss */\n\n.u-flexEnd {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n\n/* line 203, src/styles/common/_utilities.scss */\n\n.u-flexColumnTop {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n}\n\n/* line 210, src/styles/common/_utilities.scss */\n\n.u-backgroundSizeCover {\n  background-origin: border-box;\n  background-position: center;\n  background-size: cover;\n}\n\n/* line 217, src/styles/common/_utilities.scss */\n\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 20px;\n  padding-right: 20px;\n}\n\n/* line 224, src/styles/common/_utilities.scss */\n\n.u-maxWidth1200 {\n  max-width: 1200px;\n}\n\n/* line 225, src/styles/common/_utilities.scss */\n\n.u-maxWidth1000 {\n  max-width: 1000px;\n}\n\n/* line 226, src/styles/common/_utilities.scss */\n\n.u-maxWidth740 {\n  max-width: 740px;\n}\n\n/* line 227, src/styles/common/_utilities.scss */\n\n.u-maxWidth1040 {\n  max-width: 1040px;\n}\n\n/* line 228, src/styles/common/_utilities.scss */\n\n.u-sizeFullWidth {\n  width: 100%;\n}\n\n/* line 229, src/styles/common/_utilities.scss */\n\n.u-sizeFullHeight {\n  height: 100%;\n}\n\n/* line 232, src/styles/common/_utilities.scss */\n\n.u-borderLighter {\n  border: 1px solid rgba(0, 0, 0, 0.15);\n}\n\n/* line 233, src/styles/common/_utilities.scss */\n\n.u-round,\n.avatar-image,\n.media-type {\n  border-radius: 50%;\n}\n\n/* line 234, src/styles/common/_utilities.scss */\n\n.u-borderRadius2 {\n  border-radius: 2px;\n}\n\n/* line 236, src/styles/common/_utilities.scss */\n\n.u-boxShadowBottom {\n  -webkit-box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.05);\n          box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.05);\n}\n\n/* line 241, src/styles/common/_utilities.scss */\n\n.u-height540 {\n  height: 540px;\n}\n\n/* line 242, src/styles/common/_utilities.scss */\n\n.u-height280 {\n  height: 280px;\n}\n\n/* line 243, src/styles/common/_utilities.scss */\n\n.u-height260 {\n  height: 260px;\n}\n\n/* line 244, src/styles/common/_utilities.scss */\n\n.u-height100 {\n  height: 100px;\n}\n\n/* line 245, src/styles/common/_utilities.scss */\n\n.u-borderBlackLightest {\n  border: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n/* line 248, src/styles/common/_utilities.scss */\n\n.u-hide {\n  display: none !important;\n}\n\n/* line 251, src/styles/common/_utilities.scss */\n\n.u-card {\n  background: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.09);\n  border-radius: 3px;\n  -webkit-box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n          box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  margin-bottom: 10px;\n  padding: 10px 20px 15px;\n}\n\n/* line 262, src/styles/common/_utilities.scss */\n\n.title-line {\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n/* line 267, src/styles/common/_utilities.scss */\n\n.title-line::before {\n  content: '';\n  background: rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  position: absolute;\n  left: 0;\n  bottom: 50%;\n  width: 100%;\n  height: 1px;\n  z-index: 0;\n}\n\n/* line 281, src/styles/common/_utilities.scss */\n\n.u-oblique {\n  background-color: var(--composite-color);\n  color: #fff;\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 700;\n  line-height: 1;\n  padding: 5px 13px;\n  text-transform: uppercase;\n  -webkit-transform: skewX(-15deg);\n       -o-transform: skewX(-15deg);\n          transform: skewX(-15deg);\n}\n\n/* line 293, src/styles/common/_utilities.scss */\n\n.no-avatar {\n  background-image: url(" + escape(__webpack_require__(/*! ./../images/avatar.png */ 52)) + ") !important;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 298, src/styles/common/_utilities.scss */\n\n  .u-hide-before-md {\n    display: none !important;\n  }\n\n  /* line 299, src/styles/common/_utilities.scss */\n\n  .u-md-heightAuto {\n    height: auto;\n  }\n\n  /* line 300, src/styles/common/_utilities.scss */\n\n  .u-md-height170 {\n    height: 170px;\n  }\n\n  /* line 301, src/styles/common/_utilities.scss */\n\n  .u-md-relative {\n    position: relative;\n  }\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 304, src/styles/common/_utilities.scss */\n\n  .u-hide-before-lg {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 307, src/styles/common/_utilities.scss */\n\n  .u-hide-after-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 309, src/styles/common/_utilities.scss */\n\n  .u-hide-after-lg {\n    display: none !important;\n  }\n}\n\n/* line 1, src/styles/components/_form.scss */\n\n.button {\n  background: transparent;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  color: rgba(0, 0, 0, 0.44);\n  cursor: pointer;\n  display: inline-block;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  height: 37px;\n  letter-spacing: 0;\n  line-height: 35px;\n  padding: 0 16px;\n  position: relative;\n  text-align: center;\n  text-decoration: none;\n  text-rendering: optimizeLegibility;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n/* line 25, src/styles/components/_form.scss */\n\n.button--chromeless {\n  border-radius: 0;\n  border-width: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: rgba(0, 0, 0, 0.44);\n  height: auto;\n  line-height: inherit;\n  padding: 0;\n  text-align: left;\n  vertical-align: baseline;\n  white-space: normal;\n}\n\n/* line 37, src/styles/components/_form.scss */\n\n.button--chromeless:active,\n.button--chromeless:hover,\n.button--chromeless:focus {\n  border-width: 0;\n  color: rgba(0, 0, 0, 0.6);\n}\n\n/* line 45, src/styles/components/_form.scss */\n\n.button--large {\n  font-size: 15px;\n  height: 44px;\n  line-height: 42px;\n  padding: 0 18px;\n}\n\n/* line 52, src/styles/components/_form.scss */\n\n.button--dark {\n  background: rgba(0, 0, 0, 0.84);\n  border-color: rgba(0, 0, 0, 0.84);\n  color: rgba(255, 255, 255, 0.97);\n}\n\n/* line 57, src/styles/components/_form.scss */\n\n.button--dark:hover {\n  background: #1C9963;\n  border-color: #1C9963;\n}\n\n/* line 65, src/styles/components/_form.scss */\n\n.button--primary {\n  border-color: #1C9963;\n  color: #1C9963;\n}\n\n/* line 70, src/styles/components/_form.scss */\n\n.button--large.button--chromeless,\n.button--large.button--link {\n  padding: 0;\n}\n\n/* line 76, src/styles/components/_form.scss */\n\n.buttonSet > .button {\n  margin-right: 8px;\n  vertical-align: middle;\n}\n\n/* line 81, src/styles/components/_form.scss */\n\n.buttonSet > .button:last-child {\n  margin-right: 0;\n}\n\n/* line 85, src/styles/components/_form.scss */\n\n.buttonSet .button--chromeless {\n  height: 37px;\n  line-height: 35px;\n}\n\n/* line 90, src/styles/components/_form.scss */\n\n.buttonSet .button--large.button--chromeless,\n.buttonSet .button--large.button--link {\n  height: 44px;\n  line-height: 42px;\n}\n\n/* line 96, src/styles/components/_form.scss */\n\n.buttonSet > .button--chromeless:not(.button--circle) {\n  margin-right: 0;\n  padding-right: 8px;\n}\n\n/* line 101, src/styles/components/_form.scss */\n\n.buttonSet > .button--chromeless:last-child {\n  padding-right: 0;\n}\n\n/* line 105, src/styles/components/_form.scss */\n\n.buttonSet > .button--chromeless + .button--chromeless:not(.button--circle) {\n  margin-left: 0;\n  padding-left: 8px;\n}\n\n/* line 111, src/styles/components/_form.scss */\n\n.button--circle {\n  background-image: none !important;\n  border-radius: 50%;\n  color: #fff;\n  height: 40px;\n  line-height: 38px;\n  padding: 0;\n  text-decoration: none;\n  width: 40px;\n}\n\n/* line 124, src/styles/components/_form.scss */\n\n.tag-button {\n  background: rgba(0, 0, 0, 0.05);\n  border: none;\n  color: rgba(0, 0, 0, 0.68);\n  font-weight: 700;\n  margin: 0 8px 8px 0;\n}\n\n/* line 131, src/styles/components/_form.scss */\n\n.tag-button:hover {\n  background: rgba(0, 0, 0, 0.1);\n  color: rgba(0, 0, 0, 0.68);\n}\n\n/* line 139, src/styles/components/_form.scss */\n\n.button--dark-line {\n  border: 1px solid #000;\n  color: #000;\n  display: block;\n  font-weight: 600;\n  margin: 50px auto 0;\n  max-width: 300px;\n  text-transform: uppercase;\n  -webkit-transition: color 0.3s ease, -webkit-box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  transition: color 0.3s ease, -webkit-box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  -o-transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955), -webkit-box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  width: 100%;\n}\n\n/* line 150, src/styles/components/_form.scss */\n\n.button--dark-line:hover {\n  color: #fff;\n  -webkit-box-shadow: inset 0 -50px 8px -4px #000;\n          box-shadow: inset 0 -50px 8px -4px #000;\n}\n\n@font-face {\n  font-family: 'mapache';\n  src: url(" + escape(__webpack_require__(/*! ./../fonts/mapache.eot */ 23)) + ");\n  src: url(" + escape(__webpack_require__(/*! ./../fonts/mapache.eot */ 23)) + ") format(\"embedded-opentype\"), url(" + escape(__webpack_require__(/*! ./../fonts/mapache.ttf */ 53)) + ") format(\"truetype\"), url(" + escape(__webpack_require__(/*! ./../fonts/mapache.woff */ 54)) + ") format(\"woff\"), url(" + escape(__webpack_require__(/*! ./../fonts/mapache.svg */ 55)) + ") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n\n/* line 17, src/styles/components/_icons.scss */\n\n.i-tag:before {\n  content: \"\\E911\";\n}\n\n/* line 20, src/styles/components/_icons.scss */\n\n.i-discord:before {\n  content: \"\\E90A\";\n}\n\n/* line 23, src/styles/components/_icons.scss */\n\n.i-arrow-round-next:before {\n  content: \"\\E90C\";\n}\n\n/* line 26, src/styles/components/_icons.scss */\n\n.i-arrow-round-prev:before {\n  content: \"\\E90D\";\n}\n\n/* line 29, src/styles/components/_icons.scss */\n\n.i-arrow-round-up:before {\n  content: \"\\E90E\";\n}\n\n/* line 32, src/styles/components/_icons.scss */\n\n.i-arrow-round-down:before {\n  content: \"\\E90F\";\n}\n\n/* line 35, src/styles/components/_icons.scss */\n\n.i-photo:before {\n  content: \"\\E90B\";\n}\n\n/* line 38, src/styles/components/_icons.scss */\n\n.i-send:before {\n  content: \"\\E909\";\n}\n\n/* line 41, src/styles/components/_icons.scss */\n\n.i-audio:before {\n  content: \"\\E901\";\n}\n\n/* line 44, src/styles/components/_icons.scss */\n\n.i-rocket:before {\n  content: \"\\E902\";\n  color: #999;\n}\n\n/* line 48, src/styles/components/_icons.scss */\n\n.i-comments-line:before {\n  content: \"\\E900\";\n}\n\n/* line 51, src/styles/components/_icons.scss */\n\n.i-globe:before {\n  content: \"\\E906\";\n}\n\n/* line 54, src/styles/components/_icons.scss */\n\n.i-star:before {\n  content: \"\\E907\";\n}\n\n/* line 57, src/styles/components/_icons.scss */\n\n.i-link:before {\n  content: \"\\E908\";\n}\n\n/* line 60, src/styles/components/_icons.scss */\n\n.i-star-line:before {\n  content: \"\\E903\";\n}\n\n/* line 63, src/styles/components/_icons.scss */\n\n.i-more:before {\n  content: \"\\E904\";\n}\n\n/* line 66, src/styles/components/_icons.scss */\n\n.i-search:before {\n  content: \"\\E905\";\n}\n\n/* line 69, src/styles/components/_icons.scss */\n\n.i-chat:before {\n  content: \"\\E910\";\n}\n\n/* line 72, src/styles/components/_icons.scss */\n\n.i-arrow-left:before {\n  content: \"\\E314\";\n}\n\n/* line 75, src/styles/components/_icons.scss */\n\n.i-arrow-right:before {\n  content: \"\\E315\";\n}\n\n/* line 78, src/styles/components/_icons.scss */\n\n.i-play:before {\n  content: \"\\E037\";\n}\n\n/* line 81, src/styles/components/_icons.scss */\n\n.i-location:before {\n  content: \"\\E8B4\";\n}\n\n/* line 84, src/styles/components/_icons.scss */\n\n.i-check-circle:before {\n  content: \"\\E86C\";\n}\n\n/* line 87, src/styles/components/_icons.scss */\n\n.i-close:before {\n  content: \"\\E5CD\";\n}\n\n/* line 90, src/styles/components/_icons.scss */\n\n.i-favorite:before {\n  content: \"\\E87D\";\n}\n\n/* line 93, src/styles/components/_icons.scss */\n\n.i-warning:before {\n  content: \"\\E002\";\n}\n\n/* line 96, src/styles/components/_icons.scss */\n\n.i-rss:before {\n  content: \"\\E0E5\";\n}\n\n/* line 99, src/styles/components/_icons.scss */\n\n.i-share:before {\n  content: \"\\E80D\";\n}\n\n/* line 102, src/styles/components/_icons.scss */\n\n.i-email:before {\n  content: \"\\F0E0\";\n}\n\n/* line 105, src/styles/components/_icons.scss */\n\n.i-google:before {\n  content: \"\\F1A0\";\n}\n\n/* line 108, src/styles/components/_icons.scss */\n\n.i-telegram:before {\n  content: \"\\F2C6\";\n}\n\n/* line 111, src/styles/components/_icons.scss */\n\n.i-reddit:before {\n  content: \"\\F281\";\n}\n\n/* line 114, src/styles/components/_icons.scss */\n\n.i-twitter:before {\n  content: \"\\F099\";\n}\n\n/* line 117, src/styles/components/_icons.scss */\n\n.i-github:before {\n  content: \"\\F09B\";\n}\n\n/* line 120, src/styles/components/_icons.scss */\n\n.i-linkedin:before {\n  content: \"\\F0E1\";\n}\n\n/* line 123, src/styles/components/_icons.scss */\n\n.i-youtube:before {\n  content: \"\\F16A\";\n}\n\n/* line 126, src/styles/components/_icons.scss */\n\n.i-stack-overflow:before {\n  content: \"\\F16C\";\n}\n\n/* line 129, src/styles/components/_icons.scss */\n\n.i-instagram:before {\n  content: \"\\F16D\";\n}\n\n/* line 132, src/styles/components/_icons.scss */\n\n.i-flickr:before {\n  content: \"\\F16E\";\n}\n\n/* line 135, src/styles/components/_icons.scss */\n\n.i-dribbble:before {\n  content: \"\\F17D\";\n}\n\n/* line 138, src/styles/components/_icons.scss */\n\n.i-behance:before {\n  content: \"\\F1B4\";\n}\n\n/* line 141, src/styles/components/_icons.scss */\n\n.i-spotify:before {\n  content: \"\\F1BC\";\n}\n\n/* line 144, src/styles/components/_icons.scss */\n\n.i-codepen:before {\n  content: \"\\F1CB\";\n}\n\n/* line 147, src/styles/components/_icons.scss */\n\n.i-facebook:before {\n  content: \"\\F230\";\n}\n\n/* line 150, src/styles/components/_icons.scss */\n\n.i-pinterest:before {\n  content: \"\\F231\";\n}\n\n/* line 153, src/styles/components/_icons.scss */\n\n.i-whatsapp:before {\n  content: \"\\F232\";\n}\n\n/* line 156, src/styles/components/_icons.scss */\n\n.i-snapchat:before {\n  content: \"\\F2AC\";\n}\n\n/* line 2, src/styles/components/_animated.scss */\n\n.animated {\n  -webkit-animation-duration: 1s;\n       -o-animation-duration: 1s;\n          animation-duration: 1s;\n  -webkit-animation-fill-mode: both;\n       -o-animation-fill-mode: both;\n          animation-fill-mode: both;\n}\n\n/* line 6, src/styles/components/_animated.scss */\n\n.animated.infinite {\n  -webkit-animation-iteration-count: infinite;\n       -o-animation-iteration-count: infinite;\n          animation-iteration-count: infinite;\n}\n\n/* line 12, src/styles/components/_animated.scss */\n\n.bounceIn {\n  -webkit-animation-name: bounceIn;\n       -o-animation-name: bounceIn;\n          animation-name: bounceIn;\n}\n\n/* line 13, src/styles/components/_animated.scss */\n\n.bounceInDown {\n  -webkit-animation-name: bounceInDown;\n       -o-animation-name: bounceInDown;\n          animation-name: bounceInDown;\n}\n\n/* line 14, src/styles/components/_animated.scss */\n\n.pulse {\n  -webkit-animation-name: pulse;\n       -o-animation-name: pulse;\n          animation-name: pulse;\n}\n\n/* line 15, src/styles/components/_animated.scss */\n\n.slideInUp {\n  -webkit-animation-name: slideInUp;\n       -o-animation-name: slideInUp;\n          animation-name: slideInUp;\n}\n\n/* line 16, src/styles/components/_animated.scss */\n\n.slideOutDown {\n  -webkit-animation-name: slideOutDown;\n       -o-animation-name: slideOutDown;\n          animation-name: slideOutDown;\n}\n\n@-webkit-keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n            transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n            transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n            transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n            transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n            transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-o-keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n       animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n         -o-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n            transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n            transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n            transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n            transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n            transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-webkit-keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(215, 610, 355, 1);\n            animation-timing-function: cubic-bezier(215, 610, 355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n            transform: none;\n  }\n}\n\n@-o-keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -o-animation-timing-function: cubic-bezier(215, 610, 355, 1);\n       animation-timing-function: cubic-bezier(215, 610, 355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -o-transform: none;\n       transform: none;\n  }\n}\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-animation-timing-function: cubic-bezier(215, 610, 355, 1);\n         -o-animation-timing-function: cubic-bezier(215, 610, 355, 1);\n            animation-timing-function: cubic-bezier(215, 610, 355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n         -o-transform: none;\n            transform: none;\n  }\n}\n\n@-webkit-keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.2, 1.2, 1.2);\n            transform: scale3d(1.2, 1.2, 1.2);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-o-keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    transform: scale3d(1.2, 1.2, 1.2);\n  }\n\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.2, 1.2, 1.2);\n            transform: scale3d(1.2, 1.2, 1.2);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1);\n  }\n}\n\n@-webkit-keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -webkit-transform: translateY(0);\n            transform: translateY(0);\n  }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translateY(10px);\n            transform: translateY(10px);\n  }\n}\n\n@-o-keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -o-transform: translateY(0);\n       transform: translateY(0);\n  }\n\n  100% {\n    opacity: 0;\n    -o-transform: translateY(10px);\n       transform: translateY(10px);\n  }\n}\n\n@keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    -webkit-transform: translateY(0);\n         -o-transform: translateY(0);\n            transform: translateY(0);\n  }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translateY(10px);\n         -o-transform: translateY(10px);\n            transform: translateY(10px);\n  }\n}\n\n@-webkit-keyframes opacity {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@-o-keyframes opacity {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@keyframes opacity {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@-webkit-keyframes spin {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@-o-keyframes spin {\n  from {\n    -o-transform: rotate(0deg);\n       transform: rotate(0deg);\n  }\n\n  to {\n    -o-transform: rotate(360deg);\n       transform: rotate(360deg);\n  }\n}\n\n@keyframes spin {\n  from {\n    -webkit-transform: rotate(0deg);\n         -o-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n         -o-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@-webkit-keyframes tooltip {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate(-50%, 6px);\n            transform: translate(-50%, 6px);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: translate(-50%, 0);\n            transform: translate(-50%, 0);\n  }\n}\n\n@-o-keyframes tooltip {\n  0% {\n    opacity: 0;\n    -o-transform: translate(-50%, 6px);\n       transform: translate(-50%, 6px);\n  }\n\n  100% {\n    opacity: 1;\n    -o-transform: translate(-50%, 0);\n       transform: translate(-50%, 0);\n  }\n}\n\n@keyframes tooltip {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate(-50%, 6px);\n         -o-transform: translate(-50%, 6px);\n            transform: translate(-50%, 6px);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: translate(-50%, 0);\n         -o-transform: translate(-50%, 0);\n            transform: translate(-50%, 0);\n  }\n}\n\n@-webkit-keyframes loading-bar {\n  0% {\n    -webkit-transform: translateX(-100%);\n            transform: translateX(-100%);\n  }\n\n  40% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  60% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  100% {\n    -webkit-transform: translateX(100%);\n            transform: translateX(100%);\n  }\n}\n\n@-o-keyframes loading-bar {\n  0% {\n    -o-transform: translateX(-100%);\n       transform: translateX(-100%);\n  }\n\n  40% {\n    -o-transform: translateX(0);\n       transform: translateX(0);\n  }\n\n  60% {\n    -o-transform: translateX(0);\n       transform: translateX(0);\n  }\n\n  100% {\n    -o-transform: translateX(100%);\n       transform: translateX(100%);\n  }\n}\n\n@keyframes loading-bar {\n  0% {\n    -webkit-transform: translateX(-100%);\n         -o-transform: translateX(-100%);\n            transform: translateX(-100%);\n  }\n\n  40% {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  60% {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  100% {\n    -webkit-transform: translateX(100%);\n         -o-transform: translateX(100%);\n            transform: translateX(100%);\n  }\n}\n\n@-webkit-keyframes arrow-move-right {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -webkit-transform: translateX(-100%);\n            transform: translateX(-100%);\n    opacity: 0;\n  }\n\n  100% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@-o-keyframes arrow-move-right {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -o-transform: translateX(-100%);\n       transform: translateX(-100%);\n    opacity: 0;\n  }\n\n  100% {\n    -o-transform: translateX(0);\n       transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@keyframes arrow-move-right {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -webkit-transform: translateX(-100%);\n         -o-transform: translateX(-100%);\n            transform: translateX(-100%);\n    opacity: 0;\n  }\n\n  100% {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@-webkit-keyframes arrow-move-left {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -webkit-transform: translateX(100%);\n            transform: translateX(100%);\n    opacity: 0;\n  }\n\n  100% {\n    -webkit-transform: translateX(0);\n            transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@-o-keyframes arrow-move-left {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -o-transform: translateX(100%);\n       transform: translateX(100%);\n    opacity: 0;\n  }\n\n  100% {\n    -o-transform: translateX(0);\n       transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@keyframes arrow-move-left {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    -webkit-transform: translateX(100%);\n         -o-transform: translateX(100%);\n            transform: translateX(100%);\n    opacity: 0;\n  }\n\n  100% {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@-webkit-keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n            transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n}\n\n@-o-keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n            transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n}\n\n@-webkit-keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 20%, 0);\n            transform: translate3d(0, 20%, 0);\n  }\n}\n\n@-o-keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0);\n  }\n}\n\n@keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 20%, 0);\n            transform: translate3d(0, 20%, 0);\n  }\n}\n\n/* line 4, src/styles/layouts/_header.scss */\n\n.header-logo,\n.menu--toggle,\n.search-toggle {\n  z-index: 15;\n}\n\n/* line 10, src/styles/layouts/_header.scss */\n\n.header {\n  -webkit-box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n          box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n  padding: 0 16px;\n  position: -webkit-sticky;\n  position: sticky;\n  top: 0;\n  -webkit-transition: all 0.4s ease-in-out;\n  -o-transition: all 0.4s ease-in-out;\n  transition: all 0.4s ease-in-out;\n  z-index: 10;\n}\n\n/* line 18, src/styles/layouts/_header.scss */\n\n.header-wrap {\n  height: 50px;\n}\n\n/* line 20, src/styles/layouts/_header.scss */\n\n.header-logo {\n  color: #fff !important;\n  height: 30px;\n}\n\n/* line 24, src/styles/layouts/_header.scss */\n\n.header-logo img {\n  max-height: 100%;\n}\n\n/* line 29, src/styles/layouts/_header.scss */\n\n.not-logo .header-logo {\n  height: auto !important;\n}\n\n/* line 32, src/styles/layouts/_header.scss */\n\n.header-line {\n  height: 50px;\n  border-right: 1px solid rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  margin-right: 10px;\n}\n\n/* line 41, src/styles/layouts/_header.scss */\n\n.follow-more {\n  -webkit-transition: width .4s ease;\n  -o-transition: width .4s ease;\n  transition: width .4s ease;\n  overflow: hidden;\n  width: 0;\n}\n\n/* line 48, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-more {\n  width: auto;\n}\n\n/* line 49, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-toggle {\n  color: var(--header-color-hover);\n}\n\n/* line 50, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-toggle::before {\n  content: \"\\E5CD\";\n}\n\n/* line 56, src/styles/layouts/_header.scss */\n\n.nav {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  position: relative;\n  overflow: hidden;\n}\n\n/* line 62, src/styles/layouts/_header.scss */\n\n.nav ul {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  margin-right: 20px;\n  overflow: hidden;\n  white-space: nowrap;\n}\n\n/* line 70, src/styles/layouts/_header.scss */\n\n.header-left a,\n.nav ul li a {\n  border-radius: 3px;\n  color: var(--header-color);\n  display: inline-block;\n  font-weight: 600;\n  line-height: 30px;\n  padding: 0 8px;\n  text-align: center;\n  text-transform: uppercase;\n  vertical-align: middle;\n}\n\n/* line 82, src/styles/layouts/_header.scss */\n\n.header-left a.active,\n.header-left a:hover,\n.nav ul li a.active,\n.nav ul li a:hover {\n  color: var(--header-color-hover);\n}\n\n/* line 89, src/styles/layouts/_header.scss */\n\n.menu--toggle {\n  height: 48px;\n  position: relative;\n  -webkit-transition: -webkit-transform .4s;\n  transition: -webkit-transform .4s;\n  -o-transition: -o-transform .4s;\n  transition: transform .4s;\n  transition: transform .4s, -webkit-transform .4s, -o-transform .4s;\n  width: 48px;\n}\n\n/* line 95, src/styles/layouts/_header.scss */\n\n.menu--toggle span {\n  background-color: var(--header-color);\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  -webkit-transition: .4s;\n  -o-transition: .4s;\n  transition: .4s;\n  width: 20px;\n}\n\n/* line 106, src/styles/layouts/_header.scss */\n\n.menu--toggle span:first-child {\n  -webkit-transform: translate(0, -6px);\n       -o-transform: translate(0, -6px);\n          transform: translate(0, -6px);\n}\n\n/* line 107, src/styles/layouts/_header.scss */\n\n.menu--toggle span:last-child {\n  -webkit-transform: translate(0, 6px);\n       -o-transform: translate(0, 6px);\n          transform: translate(0, 6px);\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 115, src/styles/layouts/_header.scss */\n\n  .header-left {\n    -webkit-box-flex: 1 !important;\n        -ms-flex-positive: 1 !important;\n            flex-grow: 1 !important;\n  }\n\n  /* line 116, src/styles/layouts/_header.scss */\n\n  .header-logo span {\n    font-size: 24px;\n  }\n\n  /* line 119, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob {\n    overflow: hidden;\n  }\n\n  /* line 122, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .sideNav {\n    -webkit-transform: translateX(0);\n         -o-transform: translateX(0);\n            transform: translateX(0);\n  }\n\n  /* line 124, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle {\n    border: 0;\n    -webkit-transform: rotate(90deg);\n         -o-transform: rotate(90deg);\n            transform: rotate(90deg);\n  }\n\n  /* line 128, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:first-child {\n    -webkit-transform: rotate(45deg) translate(0, 0);\n         -o-transform: rotate(45deg) translate(0, 0);\n            transform: rotate(45deg) translate(0, 0);\n  }\n\n  /* line 129, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:nth-child(2) {\n    -webkit-transform: scaleX(0);\n         -o-transform: scaleX(0);\n            transform: scaleX(0);\n  }\n\n  /* line 130, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:last-child {\n    -webkit-transform: rotate(-45deg) translate(0, 0);\n         -o-transform: rotate(-45deg) translate(0, 0);\n            transform: rotate(-45deg) translate(0, 0);\n  }\n\n  /* line 133, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .header .button-search--toggle {\n    display: none;\n  }\n\n  /* line 134, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .main,\n  body.is-showNavMob .footer {\n    -webkit-transform: translateX(-25%) !important;\n         -o-transform: translateX(-25%) !important;\n            transform: translateX(-25%) !important;\n  }\n}\n\n/* line 4, src/styles/layouts/_footer.scss */\n\n.footer {\n  color: #888;\n}\n\n/* line 7, src/styles/layouts/_footer.scss */\n\n.footer a {\n  color: var(--footer-color-link);\n}\n\n/* line 9, src/styles/layouts/_footer.scss */\n\n.footer a:hover {\n  color: #fff;\n}\n\n/* line 12, src/styles/layouts/_footer.scss */\n\n.footer-links {\n  padding: 3em 0 2.5em;\n  background-color: #131313;\n}\n\n/* line 17, src/styles/layouts/_footer.scss */\n\n.footer .follow > a {\n  background: #333;\n  border-radius: 50%;\n  color: inherit;\n  display: inline-block;\n  height: 40px;\n  line-height: 40px;\n  margin: 0 5px 8px;\n  text-align: center;\n  width: 40px;\n}\n\n/* line 28, src/styles/layouts/_footer.scss */\n\n.footer .follow > a:hover {\n  background: transparent;\n  -webkit-box-shadow: inset 0 0 0 2px #333;\n          box-shadow: inset 0 0 0 2px #333;\n}\n\n/* line 34, src/styles/layouts/_footer.scss */\n\n.footer-copy {\n  padding: 3em 0;\n  background-color: #000;\n}\n\n/* line 41, src/styles/layouts/_footer.scss */\n\n.footer-menu li {\n  display: inline-block;\n  line-height: 24px;\n  margin: 0 8px;\n  /* stylelint-disable-next-line */\n}\n\n/* line 47, src/styles/layouts/_footer.scss */\n\n.footer-menu li a {\n  color: #888;\n}\n\n/* line 3, src/styles/layouts/_homepage.scss */\n\n.cover {\n  padding: 4px;\n}\n\n/* line 6, src/styles/layouts/_homepage.scss */\n\n.cover-story {\n  overflow: hidden;\n  height: 250px;\n  width: 100%;\n}\n\n/* line 11, src/styles/layouts/_homepage.scss */\n\n.cover-story:hover .cover-header {\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, transparent), color-stop(50%, rgba(0, 0, 0, 0.6)), to(rgba(0, 0, 0, 0.9)));\n  background-image: -webkit-linear-gradient(top, transparent 0, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%);\n  background-image: -o-linear-gradient(top, transparent 0, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%);\n  background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%);\n}\n\n/* line 13, src/styles/layouts/_homepage.scss */\n\n.cover-story.firts {\n  height: 80vh;\n}\n\n/* line 16, src/styles/layouts/_homepage.scss */\n\n.cover-img,\n.cover-link {\n  bottom: 4px;\n  left: 4px;\n  right: 4px;\n  top: 4px;\n}\n\n/* line 25, src/styles/layouts/_homepage.scss */\n\n.cover-header {\n  bottom: 4px;\n  left: 4px;\n  right: 4px;\n  padding: 50px 3.846153846% 20px;\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, transparent), color-stop(50%, rgba(0, 0, 0, 0.7)), to(rgba(0, 0, 0, 0.9)));\n  background-image: -webkit-linear-gradient(top, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);\n  background-image: -o-linear-gradient(top, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);\n  background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);\n}\n\n/* line 36, src/styles/layouts/_homepage.scss */\n\n.hm-cover {\n  padding: 30px 0;\n  min-height: 100vh;\n}\n\n/* line 40, src/styles/layouts/_homepage.scss */\n\n.hm-cover-title {\n  font-size: 2.5rem;\n  font-weight: 900;\n  line-height: 1;\n}\n\n/* line 46, src/styles/layouts/_homepage.scss */\n\n.hm-cover-des {\n  max-width: 600px;\n  font-size: 1.25rem;\n}\n\n/* line 52, src/styles/layouts/_homepage.scss */\n\n.hm-subscribe {\n  background-color: transparent;\n  border-radius: 3px;\n  -webkit-box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #fff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  padding: 15px 10px;\n  -webkit-transition: all .3s;\n  -o-transition: all .3s;\n  transition: all .3s;\n  width: 100%;\n}\n\n/* line 67, src/styles/layouts/_homepage.scss */\n\n.hm-subscribe:hover {\n  -webkit-box-shadow: inset 0 0 0 2px #fff;\n          box-shadow: inset 0 0 0 2px #fff;\n}\n\n/* line 72, src/styles/layouts/_homepage.scss */\n\n.hm-down {\n  -webkit-animation-duration: 1.2s !important;\n       -o-animation-duration: 1.2s !important;\n          animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100;\n}\n\n/* line 83, src/styles/layouts/_homepage.scss */\n\n.hm-down svg {\n  display: block;\n  fill: currentcolor;\n  height: auto;\n  width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 94, src/styles/layouts/_homepage.scss */\n\n  .cover {\n    height: 70vh;\n  }\n\n  /* line 97, src/styles/layouts/_homepage.scss */\n\n  .cover-story {\n    height: 50%;\n    width: 33.33333%;\n  }\n\n  /* line 101, src/styles/layouts/_homepage.scss */\n\n  .cover-story.firts {\n    height: 100%;\n    width: 66.66666%;\n  }\n\n  /* line 105, src/styles/layouts/_homepage.scss */\n\n  .cover-story.firts .cover-title {\n    font-size: 2.5rem;\n  }\n\n  /* line 111, src/styles/layouts/_homepage.scss */\n\n  .hm-cover-title {\n    font-size: 3.5rem;\n  }\n}\n\n/* line 6, src/styles/layouts/_post.scss */\n\n.post-title {\n  color: #000;\n  line-height: 1.2;\n  font-weight: 900;\n  max-width: 1000px;\n}\n\n/* line 13, src/styles/layouts/_post.scss */\n\n.post-excerpt {\n  color: #555;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-weight: 300;\n  letter-spacing: -.012em;\n  line-height: 1.6;\n}\n\n/* line 22, src/styles/layouts/_post.scss */\n\n.post-author-social {\n  vertical-align: middle;\n  margin-left: 2px;\n  padding: 0 3px;\n}\n\n/* line 28, src/styles/layouts/_post.scss */\n\n.post-image {\n  margin-top: 30px;\n}\n\n/* line 33, src/styles/layouts/_post.scss */\n\n.avatar-image {\n  display: inline-block;\n  vertical-align: middle;\n}\n\n/* line 39, src/styles/layouts/_post.scss */\n\n.avatar-image--smaller {\n  width: 50px;\n  height: 50px;\n}\n\n/* line 48, src/styles/layouts/_post.scss */\n\n.post-body a:not(.button):not(.button--circle):not(.prev-next-link) {\n  text-decoration: none;\n  position: relative;\n  -webkit-transition: all 250ms;\n  -o-transition: all 250ms;\n  transition: all 250ms;\n  -webkit-box-shadow: inset 0 -3px 0 var(--post-color-link);\n          box-shadow: inset 0 -3px 0 var(--post-color-link);\n}\n\n/* line 54, src/styles/layouts/_post.scss */\n\n.post-body a:not(.button):not(.button--circle):not(.prev-next-link):hover {\n  -webkit-box-shadow: inset 0 -1rem 0 var(--post-color-link);\n          box-shadow: inset 0 -1rem 0 var(--post-color-link);\n}\n\n/* line 59, src/styles/layouts/_post.scss */\n\n.post-body img {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n/* line 65, src/styles/layouts/_post.scss */\n\n.post-body h1,\n.post-body h2,\n.post-body h3,\n.post-body h4,\n.post-body h5,\n.post-body h6 {\n  margin-top: 30px;\n  font-weight: 900;\n  font-style: normal;\n  color: #000;\n  letter-spacing: -.02em;\n  line-height: 1.2;\n}\n\n/* line 74, src/styles/layouts/_post.scss */\n\n.post-body h2 {\n  margin-top: 35px;\n}\n\n/* line 76, src/styles/layouts/_post.scss */\n\n.post-body p {\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-size: 1.125rem;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin-top: 25px;\n}\n\n/* line 85, src/styles/layouts/_post.scss */\n\n.post-body ul,\n.post-body ol {\n  counter-reset: post;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-size: 1.125rem;\n  margin-top: 20px;\n}\n\n/* line 92, src/styles/layouts/_post.scss */\n\n.post-body ul li,\n.post-body ol li {\n  letter-spacing: -.003em;\n  margin-bottom: 14px;\n  margin-left: 30px;\n}\n\n/* line 97, src/styles/layouts/_post.scss */\n\n.post-body ul li::before,\n.post-body ol li::before {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  display: inline-block;\n  margin-left: -78px;\n  position: absolute;\n  text-align: right;\n  width: 78px;\n}\n\n/* line 108, src/styles/layouts/_post.scss */\n\n.post-body ul li::before {\n  content: '\\2022';\n  font-size: 16.8px;\n  padding-right: 15px;\n  padding-top: 3px;\n}\n\n/* line 115, src/styles/layouts/_post.scss */\n\n.post-body ol li::before {\n  content: counter(post) \".\";\n  counter-increment: post;\n  padding-right: 12px;\n}\n\n/* line 143, src/styles/layouts/_post.scss */\n\n.post-body-wrap {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n/* line 150, src/styles/layouts/_post.scss */\n\n.post-body-wrap h1,\n.post-body-wrap h2,\n.post-body-wrap h3,\n.post-body-wrap h4,\n.post-body-wrap h5,\n.post-body-wrap h6,\n.post-body-wrap p,\n.post-body-wrap ol,\n.post-body-wrap ul,\n.post-body-wrap hr,\n.post-body-wrap pre,\n.post-body-wrap dl,\n.post-body-wrap blockquote,\n.post-body-wrap .post-tags,\n.post-body-wrap .prev-next,\n.post-body-wrap .mob-share,\n.post-body-wrap .kg-embed-card {\n  min-width: 100%;\n}\n\n/* line 156, src/styles/layouts/_post.scss */\n\n.post-body-wrap > ul {\n  margin-top: 35px;\n}\n\n/* line 158, src/styles/layouts/_post.scss */\n\n.post-body-wrap > iframe,\n.post-body-wrap > img,\n.post-body-wrap .kg-image-card,\n.post-body-wrap .kg-card,\n.post-body-wrap .kg-gallery-card,\n.post-body-wrap .kg-embed-card {\n  margin-top: 30px !important;\n}\n\n/* line 170, src/styles/layouts/_post.scss */\n\n.sharePost {\n  left: 0;\n  width: 40px;\n  position: absolute !important;\n  -webkit-transition: all .4s;\n  -o-transition: all .4s;\n  transition: all .4s;\n  top: 30px;\n  /* stylelint-disable-next-line */\n}\n\n/* line 178, src/styles/layouts/_post.scss */\n\n.sharePost a {\n  color: #fff;\n  margin: 8px 0 0;\n  display: block;\n}\n\n/* line 184, src/styles/layouts/_post.scss */\n\n.sharePost .i-chat {\n  background-color: #fff;\n  border: 2px solid #bbb;\n  color: #bbb;\n}\n\n/* line 194, src/styles/layouts/_post.scss */\n\n.post-related {\n  padding: 40px 0;\n}\n\n/* stylelint-disable-next-line */\n\n/* line 201, src/styles/layouts/_post.scss */\n\n.mob-share .mapache-share {\n  height: 40px;\n  color: #fff;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-shadow: none !important;\n          box-shadow: none !important;\n}\n\n/* line 210, src/styles/layouts/_post.scss */\n\n.mob-share .share-title {\n  font-size: 14px;\n  margin-left: 10px;\n}\n\n/* stylelint-disable-next-line */\n\n/* line 220, src/styles/layouts/_post.scss */\n\n.prev-next-span {\n  color: var(--composite-color);\n  font-weight: 700;\n  font-size: 13px;\n}\n\n/* line 225, src/styles/layouts/_post.scss */\n\n.prev-next-span i {\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -webkit-transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1);\n  -o-transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1);\n  transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1);\n}\n\n/* line 231, src/styles/layouts/_post.scss */\n\n.prev-next-title {\n  margin: 0 !important;\n  font-size: 16px;\n  height: 2em;\n  overflow: hidden;\n  line-height: 1 !important;\n  text-overflow: ellipsis !important;\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  display: -webkit-box !important;\n}\n\n/* line 251, src/styles/layouts/_post.scss */\n\n.prev-next-link:hover .arrow-right {\n  -webkit-animation: arrow-move-right 0.5s ease-in-out forwards;\n       -o-animation: arrow-move-right 0.5s ease-in-out forwards;\n          animation: arrow-move-right 0.5s ease-in-out forwards;\n}\n\n/* line 252, src/styles/layouts/_post.scss */\n\n.prev-next-link:hover .arrow-left {\n  -webkit-animation: arrow-move-left 0.5s ease-in-out forwards;\n       -o-animation: arrow-move-left 0.5s ease-in-out forwards;\n          animation: arrow-move-left 0.5s ease-in-out forwards;\n}\n\n/* line 258, src/styles/layouts/_post.scss */\n\n.cc-image {\n  max-height: 100vh;\n  min-height: 600px;\n  background-color: #000;\n}\n\n/* line 263, src/styles/layouts/_post.scss */\n\n.cc-image-header {\n  right: 0;\n  bottom: 10%;\n  left: 0;\n}\n\n/* line 269, src/styles/layouts/_post.scss */\n\n.cc-image-figure img {\n  opacity: .4;\n  -o-object-fit: cover;\n     object-fit: cover;\n  width: 100%;\n}\n\n/* line 275, src/styles/layouts/_post.scss */\n\n.cc-image .post-header {\n  max-width: 700px;\n}\n\n/* line 276, src/styles/layouts/_post.scss */\n\n.cc-image .post-title,\n.cc-image .post-excerpt {\n  color: #fff;\n}\n\n/* line 282, src/styles/layouts/_post.scss */\n\n.cc-video {\n  background-color: #000;\n  padding: 40px 0 30px;\n}\n\n/* line 286, src/styles/layouts/_post.scss */\n\n.cc-video .post-excerpt {\n  color: #aaa;\n  font-size: 1rem;\n}\n\n/* line 287, src/styles/layouts/_post.scss */\n\n.cc-video .post-title {\n  color: #fff;\n  font-size: 1.8rem;\n}\n\n/* line 288, src/styles/layouts/_post.scss */\n\n.cc-video .kg-embed-card,\n.cc-video .video-responsive {\n  margin-top: 0;\n}\n\n/* line 307, src/styles/layouts/_post.scss */\n\n.cc-video .media-type {\n  height: 34px !important;\n  width: 34px !important;\n}\n\n/* line 315, src/styles/layouts/_post.scss */\n\nbody.is-article .main {\n  margin-bottom: 0;\n}\n\n/* line 316, src/styles/layouts/_post.scss */\n\nbody.share-margin .sharePost {\n  top: -60px;\n}\n\n/* line 317, src/styles/layouts/_post.scss */\n\nbody.show-category .post-primary-tag {\n  display: block !important;\n}\n\n/* line 320, src/styles/layouts/_post.scss */\n\nbody.is-article-single .post-body-wrap {\n  margin-left: 0 !important;\n}\n\n/* line 321, src/styles/layouts/_post.scss */\n\nbody.is-article-single .sharePost {\n  left: -100px;\n}\n\n/* line 322, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-width-full .kg-image {\n  max-width: 100vw;\n}\n\n/* line 323, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-width-wide .kg-image {\n  max-width: 1040px;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 329, src/styles/layouts/_post.scss */\n\n  .post-body-wrap q {\n    font-size: 20px !important;\n    letter-spacing: -.008em !important;\n    line-height: 1.4 !important;\n  }\n\n  /* line 341, src/styles/layouts/_post.scss */\n\n  .post-body-wrap .kg-image-card img {\n    max-width: 100%;\n  }\n\n  /* line 343, src/styles/layouts/_post.scss */\n\n  .post-body-wrap ol,\n  .post-body-wrap ul,\n  .post-body-wrap p {\n    font-size: 1rem;\n    letter-spacing: -.004em;\n    line-height: 1.58;\n  }\n\n  /* line 349, src/styles/layouts/_post.scss */\n\n  .post-body-wrap iframe {\n    width: 100% !important;\n  }\n\n  /* line 353, src/styles/layouts/_post.scss */\n\n  .post-related {\n    padding-left: 8px;\n    padding-right: 8px;\n  }\n\n  /* line 359, src/styles/layouts/_post.scss */\n\n  .cc-image-figure {\n    width: 200%;\n    max-width: 200%;\n    margin: 0 auto 0 -50%;\n  }\n\n  /* line 365, src/styles/layouts/_post.scss */\n\n  .cc-image-header {\n    bottom: 24px;\n  }\n\n  /* line 366, src/styles/layouts/_post.scss */\n\n  .cc-image .post-excerpt {\n    font-size: 18px;\n  }\n\n  /* line 369, src/styles/layouts/_post.scss */\n\n  .cc-video {\n    padding: 20px 0;\n  }\n\n  /* line 372, src/styles/layouts/_post.scss */\n\n  .cc-video-embed {\n    margin-left: -16px;\n    margin-right: -15px;\n  }\n\n  /* line 377, src/styles/layouts/_post.scss */\n\n  .cc-video .post-header {\n    margin-top: 10px;\n  }\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 383, src/styles/layouts/_post.scss */\n\n  body.is-article .col-left {\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 390, src/styles/layouts/_post.scss */\n\n  .cc-image .post-title {\n    font-size: 3.2rem;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 394, src/styles/layouts/_post.scss */\n\n  body.is-article .post-body-wrap {\n    margin-left: 70px;\n  }\n\n  /* line 398, src/styles/layouts/_post.scss */\n\n  body.is-video .post-author,\n  body.is-image .post-author {\n    margin-left: 70px;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  /* line 405, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-embed {\n    bottom: 20px;\n    -webkit-box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n    height: 203px;\n    padding-bottom: 0;\n    position: fixed;\n    right: 20px;\n    width: 360px;\n    z-index: 8;\n  }\n\n  /* line 416, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-close {\n    background: #000;\n    border-radius: 50%;\n    color: #fff;\n    cursor: pointer;\n    display: block !important;\n    font-size: 14px;\n    height: 24px;\n    left: -10px;\n    line-height: 1;\n    padding-top: 5px;\n    position: absolute;\n    text-align: center;\n    top: -10px;\n    width: 24px;\n    z-index: 5;\n  }\n\n  /* line 434, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-cont {\n    height: 465px;\n  }\n\n  /* line 436, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-image-header {\n    bottom: 20%;\n  }\n}\n\n/* line 3, src/styles/layouts/_story.scss */\n\n.hr-list {\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.0785);\n  margin: 20px 0 0;\n}\n\n/* line 10, src/styles/layouts/_story.scss */\n\n.story-feed .story-feed-content:first-child .hr-list:first-child {\n  margin-top: 5px;\n}\n\n/* line 15, src/styles/layouts/_story.scss */\n\n.media-type {\n  background-color: rgba(0, 0, 0, 0.7);\n  color: #fff;\n  height: 45px;\n  left: 15px;\n  top: 15px;\n  width: 45px;\n  opacity: .9;\n}\n\n/* line 33, src/styles/layouts/_story.scss */\n\n.image-hover {\n  -webkit-transition: -webkit-transform .7s;\n  transition: -webkit-transform .7s;\n  -o-transition: -o-transform .7s;\n  transition: transform .7s;\n  transition: transform .7s, -webkit-transform .7s, -o-transform .7s;\n  -webkit-transform: translateZ(0);\n          transform: translateZ(0);\n}\n\n/* line 39, src/styles/layouts/_story.scss */\n\n.not-image {\n  background: url(" + escape(__webpack_require__(/*! ./../images/not-image.png */ 56)) + ");\n  background-repeat: repeat;\n}\n\n/* line 45, src/styles/layouts/_story.scss */\n\n.flow-meta {\n  color: rgba(0, 0, 0, 0.54);\n  font-weight: 700;\n  margin-bottom: 10px;\n}\n\n/* line 52, src/styles/layouts/_story.scss */\n\n.point {\n  margin: 0 5px;\n}\n\n/* line 58, src/styles/layouts/_story.scss */\n\n.story-image {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 44%;\n          flex: 0 0 44%;\n  height: 235px;\n  margin-right: 30px;\n}\n\n/* line 63, src/styles/layouts/_story.scss */\n\n.story-image:hover .image-hover {\n  -webkit-transform: scale(1.03);\n       -o-transform: scale(1.03);\n          transform: scale(1.03);\n}\n\n/* line 66, src/styles/layouts/_story.scss */\n\n.story-lower {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n}\n\n/* line 68, src/styles/layouts/_story.scss */\n\n.story-excerpt {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-weight: 300;\n  line-height: 1.5;\n}\n\n/* line 75, src/styles/layouts/_story.scss */\n\n.story-category {\n  color: rgba(0, 0, 0, 0.84);\n}\n\n/* line 77, src/styles/layouts/_story.scss */\n\n.story h2 a:hover {\n  opacity: .6;\n}\n\n/* line 90, src/styles/layouts/_story.scss */\n\n.story.story--grid {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  margin-bottom: 30px;\n}\n\n/* line 94, src/styles/layouts/_story.scss */\n\n.story.story--grid .story-image {\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n  margin-right: 0;\n  height: 220px;\n}\n\n/* line 100, src/styles/layouts/_story.scss */\n\n.story.story--grid .media-type {\n  font-size: 24px;\n  height: 40px;\n  width: 40px;\n}\n\n/* line 107, src/styles/layouts/_story.scss */\n\n.cover-category {\n  color: var(--story-cover-category-color);\n}\n\n/* line 112, src/styles/layouts/_story.scss */\n\n.story-card {\n  /* stylelint-disable-next-line */\n}\n\n/* line 113, src/styles/layouts/_story.scss */\n\n.story-card .story {\n  margin-top: 0 !important;\n}\n\n/* line 124, src/styles/layouts/_story.scss */\n\n.story-card .story-image {\n  border: 1px solid rgba(0, 0, 0, 0.04);\n  -webkit-box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n          box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  border-radius: 2px;\n  background-color: #fff !important;\n  -webkit-transition: all 150ms ease-in-out;\n  -o-transition: all 150ms ease-in-out;\n  transition: all 150ms ease-in-out;\n  overflow: hidden;\n  height: 200px !important;\n}\n\n/* line 136, src/styles/layouts/_story.scss */\n\n.story-card .story-image .story-img-bg {\n  margin: 10px;\n}\n\n/* line 138, src/styles/layouts/_story.scss */\n\n.story-card .story-image:hover {\n  -webkit-box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.1);\n          box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.1);\n}\n\n/* line 141, src/styles/layouts/_story.scss */\n\n.story-card .story-image:hover .story-img-bg {\n  -webkit-transform: none;\n       -o-transform: none;\n          transform: none;\n}\n\n/* line 145, src/styles/layouts/_story.scss */\n\n.story-card .story-lower {\n  display: none !important;\n}\n\n/* line 147, src/styles/layouts/_story.scss */\n\n.story-card .story-body {\n  padding: 15px 5px;\n  margin: 0 !important;\n}\n\n/* line 151, src/styles/layouts/_story.scss */\n\n.story-card .story-body h2 {\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  color: rgba(0, 0, 0, 0.9);\n  display: -webkit-box !important;\n  max-height: 2.4em !important;\n  overflow: hidden;\n  text-overflow: ellipsis !important;\n  margin: 0;\n}\n\n/* line 168, src/styles/layouts/_story.scss */\n\n.story-small {\n  /* stylelint-disable-next-line */\n}\n\n/* line 169, src/styles/layouts/_story.scss */\n\n.story-small-img {\n  height: 170px;\n  background-color: #000 !important;\n}\n\n/* line 175, src/styles/layouts/_story.scss */\n\n.story-small .image-hover {\n  -webkit-transition: all .25s;\n  -o-transition: all .25s;\n  transition: all .25s;\n}\n\n/* line 177, src/styles/layouts/_story.scss */\n\n.story-small h3 {\n  color: #fff;\n  max-height: 2.5em;\n  overflow: hidden;\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  text-overflow: ellipsis !important;\n  display: -webkit-box !important;\n  -webkit-transition: all .25s;\n  -o-transition: all .25s;\n  transition: all .25s;\n}\n\n/* line 189, src/styles/layouts/_story.scss */\n\n.story-small:hover .image-hover {\n  opacity: .8;\n}\n\n/* line 190, src/styles/layouts/_story.scss */\n\n.story-small:hover h3 {\n  opacity: .6;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 200, src/styles/layouts/_story.scss */\n\n  .story.story--grid .story-lower {\n    max-height: 2.6em;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    display: -webkit-box;\n    line-height: 1.1;\n    text-overflow: ellipsis;\n  }\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 215, src/styles/layouts/_story.scss */\n\n  .cover--firts .cover-story {\n    height: 500px;\n  }\n\n  /* line 218, src/styles/layouts/_story.scss */\n\n  .story {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    margin-top: 20px;\n  }\n\n  /* line 222, src/styles/layouts/_story.scss */\n\n  .story-image {\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto;\n    margin-right: 0;\n  }\n\n  /* line 223, src/styles/layouts/_story.scss */\n\n  .story-body {\n    margin-top: 10px;\n  }\n}\n\n/* line 4, src/styles/layouts/_author.scss */\n\n.author {\n  background-color: #fff;\n  color: rgba(0, 0, 0, 0.6);\n  min-height: 350px;\n}\n\n/* line 9, src/styles/layouts/_author.scss */\n\n.author-avatar {\n  height: 80px;\n  width: 80px;\n}\n\n/* line 14, src/styles/layouts/_author.scss */\n\n.author-meta span {\n  display: inline-block;\n  font-size: 17px;\n  font-style: italic;\n  margin: 0 25px 16px 0;\n  opacity: .8;\n  word-wrap: break-word;\n}\n\n/* line 23, src/styles/layouts/_author.scss */\n\n.author-name {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 24, src/styles/layouts/_author.scss */\n\n.author-bio {\n  max-width: 600px;\n}\n\n/* line 25, src/styles/layouts/_author.scss */\n\n.author-meta a:hover {\n  opacity: .8 !important;\n}\n\n/* line 28, src/styles/layouts/_author.scss */\n\n.cover-opacity {\n  opacity: .5;\n}\n\n/* line 30, src/styles/layouts/_author.scss */\n\n.author.has--image {\n  color: #fff !important;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n}\n\n/* line 34, src/styles/layouts/_author.scss */\n\n.author.has--image a,\n.author.has--image .author-name {\n  color: #fff;\n}\n\n/* line 37, src/styles/layouts/_author.scss */\n\n.author.has--image .author-follow a {\n  border: 2px solid;\n  border-color: rgba(255, 255, 255, 0.5) !important;\n  font-size: 16px;\n}\n\n/* line 43, src/styles/layouts/_author.scss */\n\n.author.has--image .u-accentColor--iconNormal {\n  fill: #fff;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 47, src/styles/layouts/_author.scss */\n\n  .author-meta span {\n    display: block;\n  }\n\n  /* line 48, src/styles/layouts/_author.scss */\n\n  .author-header {\n    display: block;\n  }\n\n  /* line 49, src/styles/layouts/_author.scss */\n\n  .author-avatar {\n    margin: 0 auto 20px;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 53, src/styles/layouts/_author.scss */\n\n  body.has-cover .author {\n    min-height: 600px;\n  }\n}\n\n/* line 4, src/styles/layouts/_search.scss */\n\n.search {\n  background-color: #fff;\n  height: 100%;\n  height: 100vh;\n  left: 0;\n  padding: 0 16px;\n  right: 0;\n  top: 0;\n  -webkit-transform: translateY(-100%);\n       -o-transform: translateY(-100%);\n          transform: translateY(-100%);\n  -webkit-transition: -webkit-transform .3s ease;\n  transition: -webkit-transform .3s ease;\n  -o-transition: -o-transform .3s ease;\n  transition: transform .3s ease;\n  transition: transform .3s ease, -webkit-transform .3s ease, -o-transform .3s ease;\n  z-index: 9;\n}\n\n/* line 16, src/styles/layouts/_search.scss */\n\n.search-form {\n  max-width: 680px;\n  margin-top: 80px;\n}\n\n/* line 20, src/styles/layouts/_search.scss */\n\n.search-form::before {\n  background: #eee;\n  bottom: 0;\n  content: '';\n  display: block;\n  height: 2px;\n  left: 0;\n  position: absolute;\n  width: 100%;\n  z-index: 1;\n}\n\n/* line 32, src/styles/layouts/_search.scss */\n\n.search-form input {\n  border: none;\n  display: block;\n  line-height: 40px;\n  padding-bottom: 8px;\n}\n\n/* line 38, src/styles/layouts/_search.scss */\n\n.search-form input:focus {\n  outline: 0;\n}\n\n/* line 43, src/styles/layouts/_search.scss */\n\n.search-results {\n  max-height: calc(100% - 100px);\n  max-width: 680px;\n  overflow: auto;\n}\n\n/* line 48, src/styles/layouts/_search.scss */\n\n.search-results a {\n  padding: 10px 20px;\n  background: rgba(0, 0, 0, 0.05);\n  color: rgba(0, 0, 0, 0.7);\n  text-decoration: none;\n  display: block;\n  border-bottom: 1px solid #fff;\n  -webkit-transition: all 0.3s ease-in-out;\n  -o-transition: all 0.3s ease-in-out;\n  transition: all 0.3s ease-in-out;\n}\n\n/* line 57, src/styles/layouts/_search.scss */\n\n.search-results a:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n\n/* line 62, src/styles/layouts/_search.scss */\n\n.button-search--close {\n  position: absolute !important;\n  right: 50px;\n  top: 20px;\n}\n\n/* line 68, src/styles/layouts/_search.scss */\n\nbody.is-search {\n  overflow: hidden;\n}\n\n/* line 71, src/styles/layouts/_search.scss */\n\nbody.is-search .search {\n  -webkit-transform: translateY(0);\n       -o-transform: translateY(0);\n          transform: translateY(0);\n}\n\n/* line 72, src/styles/layouts/_search.scss */\n\nbody.is-search .search-toggle {\n  background-color: rgba(255, 255, 255, 0.25);\n}\n\n/* line 2, src/styles/layouts/_sidebar.scss */\n\n.sidebar-title {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n}\n\n/* line 5, src/styles/layouts/_sidebar.scss */\n\n.sidebar-title span {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.54);\n  padding-bottom: 10px;\n  margin-bottom: -1px;\n}\n\n/* line 14, src/styles/layouts/_sidebar.scss */\n\n.sidebar-border {\n  border-left: 3px solid var(--composite-color);\n  color: rgba(0, 0, 0, 0.2);\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  padding: 0 10px;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888;\n}\n\n/* line 24, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n  -webkit-box-shadow: 0 1px 7px rgba(0, 0, 0, 0.0785);\n          box-shadow: 0 1px 7px rgba(0, 0, 0, 0.0785);\n  min-height: 60px;\n}\n\n/* line 30, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:hover .sidebar-border {\n  background-color: #e5eff5;\n}\n\n/* line 32, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:nth-child(3n) .sidebar-border {\n  border-color: #f59e00;\n}\n\n/* line 33, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:nth-child(3n+2) .sidebar-border {\n  border-color: #26a8ed;\n}\n\n/* line 2, src/styles/layouts/_sidenav.scss */\n\n.sideNav {\n  color: rgba(0, 0, 0, 0.8);\n  height: 100vh;\n  padding: 50px 20px;\n  position: fixed !important;\n  -webkit-transform: translateX(100%);\n       -o-transform: translateX(100%);\n          transform: translateX(100%);\n  -webkit-transition: 0.4s;\n  -o-transition: 0.4s;\n  transition: 0.4s;\n  will-change: transform;\n  z-index: 8;\n}\n\n/* line 13, src/styles/layouts/_sidenav.scss */\n\n.sideNav-menu a {\n  padding: 10px 20px;\n}\n\n/* line 15, src/styles/layouts/_sidenav.scss */\n\n.sideNav-wrap {\n  background: #eee;\n  overflow: auto;\n  padding: 20px 0;\n  top: 50px;\n}\n\n/* line 22, src/styles/layouts/_sidenav.scss */\n\n.sideNav-section {\n  border-bottom: solid 1px #ddd;\n  margin-bottom: 8px;\n  padding-bottom: 8px;\n}\n\n/* line 28, src/styles/layouts/_sidenav.scss */\n\n.sideNav-follow {\n  border-top: 1px solid #ddd;\n  margin: 15px 0;\n}\n\n/* line 32, src/styles/layouts/_sidenav.scss */\n\n.sideNav-follow a {\n  color: #fff;\n  display: inline-block;\n  height: 36px;\n  line-height: 20px;\n  margin: 0 5px 5px 0;\n  min-width: 36px;\n  padding: 8px;\n  text-align: center;\n  vertical-align: middle;\n}\n\n/* line 17, src/styles/layouts/helper.scss */\n\n.has-cover-padding {\n  padding-top: 100px;\n}\n\n/* line 20, src/styles/layouts/helper.scss */\n\nbody.has-cover .header {\n  position: fixed;\n}\n\n/* line 23, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .header {\n  background: rgba(0, 0, 0, 0.05);\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n/* line 29, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .header-left a,\nbody.has-cover.is-transparency:not(.is-search) .nav ul li a {\n  color: #fff;\n}\n\n/* line 30, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .menu--toggle span {\n  background-color: #fff;\n}\n\n/* line 5, src/styles/layouts/subscribe.scss */\n\n.subscribe {\n  min-height: 80vh !important;\n  height: 100%;\n}\n\n/* line 10, src/styles/layouts/subscribe.scss */\n\n.subscribe-card {\n  background-color: #D7EFEE;\n  -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  width: 900px;\n  height: 550px;\n  padding: 50px;\n  margin: 5px;\n}\n\n/* line 20, src/styles/layouts/subscribe.scss */\n\n.subscribe form {\n  max-width: 300px;\n}\n\n/* line 24, src/styles/layouts/subscribe.scss */\n\n.subscribe-form {\n  height: 100%;\n}\n\n/* line 28, src/styles/layouts/subscribe.scss */\n\n.subscribe-input {\n  background: 0 0;\n  border: 0;\n  border-bottom: 1px solid #cc5454;\n  border-radius: 0;\n  padding: 7px 5px;\n  height: 45px;\n  outline: 0;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n}\n\n/* line 38, src/styles/layouts/subscribe.scss */\n\n.subscribe-input::-webkit-input-placeholder {\n  color: #cc5454;\n}\n\n.subscribe-input::-ms-input-placeholder {\n  color: #cc5454;\n}\n\n.subscribe-input::placeholder {\n  color: #cc5454;\n}\n\n/* line 43, src/styles/layouts/subscribe.scss */\n\n.subscribe .main-error {\n  color: #cc5454;\n  font-size: 16px;\n  margin-top: 15px;\n}\n\n/* line 65, src/styles/layouts/subscribe.scss */\n\n.subscribe-success .subscribe-card {\n  background-color: #E8F3EC;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 71, src/styles/layouts/subscribe.scss */\n\n  .subscribe-card {\n    height: auto;\n    width: auto;\n  }\n}\n\n/* line 4, src/styles/layouts/_comments.scss */\n\n.post-comments {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 15;\n  width: 100%;\n  left: 0;\n  overflow-y: auto;\n  background: #fff;\n  border-left: 1px solid #f1f1f1;\n  -webkit-box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n          box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  font-size: 14px;\n  -webkit-transform: translateX(100%);\n       -o-transform: translateX(100%);\n          transform: translateX(100%);\n  -webkit-transition: .2s;\n  -o-transition: .2s;\n  transition: .2s;\n  will-change: transform;\n}\n\n/* line 21, src/styles/layouts/_comments.scss */\n\n.post-comments-header {\n  padding: 20px;\n  border-bottom: 1px solid #ddd;\n}\n\n/* line 25, src/styles/layouts/_comments.scss */\n\n.post-comments-header .toggle-comments {\n  font-size: 24px;\n  line-height: 1;\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 17px;\n  cursor: pointer;\n}\n\n/* line 36, src/styles/layouts/_comments.scss */\n\n.post-comments-overlay {\n  position: fixed !important;\n  background-color: rgba(0, 0, 0, 0.2);\n  display: none;\n  -webkit-transition: background-color .4s linear;\n  -o-transition: background-color .4s linear;\n  transition: background-color .4s linear;\n  z-index: 8;\n  cursor: pointer;\n}\n\n/* line 46, src/styles/layouts/_comments.scss */\n\nbody.has-comments {\n  overflow: hidden;\n}\n\n/* line 49, src/styles/layouts/_comments.scss */\n\nbody.has-comments .post-comments-overlay {\n  display: block;\n}\n\n/* line 50, src/styles/layouts/_comments.scss */\n\nbody.has-comments .post-comments {\n  -webkit-transform: translateX(0);\n       -o-transform: translateX(0);\n          transform: translateX(0);\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 54, src/styles/layouts/_comments.scss */\n\n  .post-comments {\n    left: auto;\n    width: 500px;\n    top: 50px;\n    z-index: 9;\n  }\n\n  /* line 60, src/styles/layouts/_comments.scss */\n\n  .post-comments-wrap {\n    padding: 20px;\n  }\n}\n\n/* line 1, src/styles/common/_modal.scss */\n\n.modal {\n  opacity: 0;\n  -webkit-transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  -o-transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  z-index: 100;\n  visibility: hidden;\n}\n\n/* line 8, src/styles/common/_modal.scss */\n\n.modal-shader {\n  background-color: rgba(255, 255, 255, 0.65);\n}\n\n/* line 11, src/styles/common/_modal.scss */\n\n.modal-close {\n  color: rgba(0, 0, 0, 0.54);\n  position: absolute;\n  top: 0;\n  right: 0;\n  line-height: 1;\n  padding: 15px;\n}\n\n/* line 21, src/styles/common/_modal.scss */\n\n.modal-inner {\n  background-color: #E8F3EC;\n  border-radius: 4px;\n  -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n  max-width: 700px;\n  height: 100%;\n  max-height: 400px;\n  opacity: 0;\n  padding: 72px 5% 56px;\n  -webkit-transform: scale(0.6);\n       -o-transform: scale(0.6);\n          transform: scale(0.6);\n  -webkit-transition: opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -webkit-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  transition: opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -webkit-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  -o-transition: opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -o-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  transition: transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  transition: transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -webkit-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), -o-transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  width: 100%;\n}\n\n/* line 36, src/styles/common/_modal.scss */\n\n.modal .form-group {\n  width: 76%;\n  margin: 0 auto 30px;\n}\n\n/* line 41, src/styles/common/_modal.scss */\n\n.modal .form--input {\n  display: inline-block;\n  margin-bottom: 10px;\n  vertical-align: top;\n  height: 40px;\n  line-height: 40px;\n  background-color: transparent;\n  padding: 17px 6px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.15);\n  width: 100%;\n}\n\n/* line 71, src/styles/common/_modal.scss */\n\nbody.has-modal {\n  overflow: hidden;\n}\n\n/* line 74, src/styles/common/_modal.scss */\n\nbody.has-modal .modal {\n  opacity: 1;\n  visibility: visible;\n  -webkit-transition: opacity .3s ease;\n  -o-transition: opacity .3s ease;\n  transition: opacity .3s ease;\n}\n\n/* line 79, src/styles/common/_modal.scss */\n\nbody.has-modal .modal-inner {\n  opacity: 1;\n  -webkit-transform: scale(1);\n       -o-transform: scale(1);\n          transform: scale(1);\n  -webkit-transition: -webkit-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n  transition: -webkit-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n  -o-transition: -o-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n  transition: transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n  transition: transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96), -webkit-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96), -o-transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n}\n\n/* line 4, src/styles/common/_widget.scss */\n\n.instagram-hover {\n  background-color: rgba(0, 0, 0, 0.3);\n  opacity: 0;\n}\n\n/* line 10, src/styles/common/_widget.scss */\n\n.instagram-img {\n  height: 264px;\n}\n\n/* line 13, src/styles/common/_widget.scss */\n\n.instagram-img:hover > .instagram-hover {\n  opacity: 1;\n}\n\n/* line 16, src/styles/common/_widget.scss */\n\n.instagram-name {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n       -o-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  z-index: 3;\n}\n\n/* line 22, src/styles/common/_widget.scss */\n\n.instagram-name a {\n  background-color: #fff;\n  color: #000 !important;\n  font-size: 18px !important;\n  font-weight: 900 !important;\n  min-width: 200px;\n  padding-left: 10px !important;\n  padding-right: 10px !important;\n  text-align: center !important;\n}\n\n/* line 34, src/styles/common/_widget.scss */\n\n.instagram-col {\n  padding: 0 !important;\n  margin: 0 !important;\n}\n\n/* line 39, src/styles/common/_widget.scss */\n\n.instagram-wrap {\n  margin: 0 !important;\n}\n\n/* line 44, src/styles/common/_widget.scss */\n\n.witget-subscribe {\n  background: #fff;\n  border: 5px solid transparent;\n  padding: 28px 30px;\n  position: relative;\n}\n\n/* line 50, src/styles/common/_widget.scss */\n\n.witget-subscribe::before {\n  content: \"\";\n  border: 5px solid #f5f5f5;\n  -webkit-box-shadow: inset 0 0 0 1px #d7d7d7;\n          box-shadow: inset 0 0 0 1px #d7d7d7;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  display: block;\n  height: calc(100% + 10px);\n  left: -5px;\n  pointer-events: none;\n  position: absolute;\n  top: -5px;\n  width: calc(100% + 10px);\n  z-index: 1;\n}\n\n/* line 65, src/styles/common/_widget.scss */\n\n.witget-subscribe input {\n  background: #fff;\n  border: 1px solid #e5e5e5;\n  color: rgba(0, 0, 0, 0.54);\n  height: 41px;\n  outline: 0;\n  padding: 0 16px;\n  width: 100%;\n}\n\n/* line 75, src/styles/common/_widget.scss */\n\n.witget-subscribe button {\n  background: var(--composite-color);\n  border-radius: 0;\n  width: 100%;\n}\n\n", "", {"version":3,"sources":["C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/main.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/node_modules/normalize.css/normalize.css","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/main.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/node_modules/prismjs/themes/prism.css","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/common/_mixins.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/autoload/_zoom.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/common/_global.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/components/_grid.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/common/_typography.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/common/_utilities.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/components/_form.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/components/_icons.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/components/_animated.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_header.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_footer.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_homepage.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_post.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_story.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_author.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_search.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_sidebar.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_sidenav.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/helper.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/subscribe.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/layouts/_comments.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/common/_modal.scss","C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/Projects/ghost/content/themes/mapache/src/styles/src/styles/common/_widget.scss"],"names":[],"mappings":"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E;EAAqB,0BAAA;CLk7BtB;;AF/WD,8CAAA;;AOlkBE;;EAAsB,qCAAA;CLw7BvB;;AFlXD,8CAAA;;AOvkBE;EAAqB,0BAAA;CL+7BtB;;AFpXD,8CAAA;;AO1kBE;;EAAsB,qCAAA;CLq8BvB;;AFvXD,8CAAA;;AO/kBE;EAAqB,0BAAA;CL48BtB;;AFzXD,8CAAA;;AOllBE;;EAAsB,qCAAA;CLk9BvB;;AF5XD,8CAAA;;AOvlBE;EAAqB,0BAAA;CLy9BtB;;AF9XD,8CAAA;;AO1lBE;;EAAsB,qCAAA;CL+9BvB;;AFjYD,8CAAA;;AO/lBE;EAAqB,uBAAA;CLs+BtB;;AFnYD,8CAAA;;AOlmBE;;EAAsB,kCAAA;CL4+BvB;;AFtYD,8CAAA;;AOvmBE;EAAqB,0BAAA;CLm/BtB;;AFxYD,8CAAA;;AO1mBE;;EAAsB,qCAAA;CLy/BvB;;AF3YD,8CAAA;;AO/mBE;EAAqB,0BAAA;CLggCtB;;AF7YD,8CAAA;;AOlnBE;;EAAsB,qCAAA;CLsgCvB;;AFhZD,8CAAA;;AOvnBE;EAAqB,uBAAA;CL6gCtB;;AFlZD,8CAAA;;AO1nBE;;EAAsB,kCAAA;CLmhCvB;;AFrZD,8CAAA;;AO/nBE;EAAqB,0BAAA;CL0hCtB;;AFvZD,8CAAA;;AOloBE;;EAAsB,qCAAA;CLgiCvB;;AF1ZD,8CAAA;;AOvoBE;EAAqB,0BAAA;CLuiCtB;;AF5ZD,8CAAA;;AO1oBE;;EAAsB,qCAAA;CL6iCvB;;AF/ZD,8CAAA;;AO/oBE;EAAqB,0BAAA;CLojCtB;;AFjaD,8CAAA;;AOlpBE;;EAAsB,qCAAA;CL0jCvB;;AFpaD,8CAAA;;AOvpBE;EAAqB,0BAAA;CLikCtB;;AFtaD,8CAAA;;AO1pBE;;EAAsB,qCAAA;CLukCvB;;AFzaD,8CAAA;;AO/pBE;EAAqB,0BAAA;CL8kCtB;;AF3aD,8CAAA;;AOlqBE;;EAAsB,qCAAA;CLolCvB;;AF9aD,8CAAA;;AOvqBE;EAAqB,0BAAA;CL2lCtB;;AFhbD,8CAAA;;AO1qBE;;EAAsB,qCAAA;CLimCvB;;AFnbD,8CAAA;;AO/qBE;EAAqB,0BAAA;CLwmCtB;;AFrbD,8CAAA;;AO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","file":"main.scss","sourcesContent":["@charset \"UTF-8\";\n/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n/* Document\n   ========================================================================== */\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n/* line 11, node_modules/normalize.css/normalize.css */\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/* Sections\n   ========================================================================== */\n/**\n * Remove the margin in all browsers.\n */\n/* line 23, node_modules/normalize.css/normalize.css */\nbody {\n  margin: 0; }\n\n/**\n * Render the `main` element consistently in IE.\n */\n/* line 31, node_modules/normalize.css/normalize.css */\nmain {\n  display: block; }\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n/* line 40, node_modules/normalize.css/normalize.css */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/* Grouping content\n   ========================================================================== */\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n/* line 53, node_modules/normalize.css/normalize.css */\nhr {\n  box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */ }\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n/* line 64, node_modules/normalize.css/normalize.css */\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */ }\n\n/* Text-level semantics\n   ========================================================================== */\n/**\n * Remove the gray background on active links in IE 10.\n */\n/* line 76, node_modules/normalize.css/normalize.css */\na {\n  background-color: transparent; }\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n/* line 85, node_modules/normalize.css/normalize.css */\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  text-decoration: underline dotted;\n  /* 2 */ }\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n/* line 95, node_modules/normalize.css/normalize.css */\nb,\nstrong {\n  font-weight: bolder; }\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n/* line 105, node_modules/normalize.css/normalize.css */\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */ }\n\n/**\n * Add the correct font size in all browsers.\n */\n/* line 116, node_modules/normalize.css/normalize.css */\nsmall {\n  font-size: 80%; }\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n/* line 125, node_modules/normalize.css/normalize.css */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\n/* line 133, node_modules/normalize.css/normalize.css */\nsub {\n  bottom: -0.25em; }\n\n/* line 137, node_modules/normalize.css/normalize.css */\nsup {\n  top: -0.5em; }\n\n/* Embedded content\n   ========================================================================== */\n/**\n * Remove the border on images inside links in IE 10.\n */\n/* line 148, node_modules/normalize.css/normalize.css */\nimg {\n  border-style: none; }\n\n/* Forms\n   ========================================================================== */\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n/* line 160, node_modules/normalize.css/normalize.css */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */ }\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n/* line 176, node_modules/normalize.css/normalize.css */\nbutton,\ninput {\n  /* 1 */\n  overflow: visible; }\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n/* line 186, node_modules/normalize.css/normalize.css */\nbutton,\nselect {\n  /* 1 */\n  text-transform: none; }\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n/* line 195, node_modules/normalize.css/normalize.css */\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; }\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n/* line 206, node_modules/normalize.css/normalize.css */\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0; }\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n/* line 218, node_modules/normalize.css/normalize.css */\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText; }\n\n/**\n * Correct the padding in Firefox.\n */\n/* line 229, node_modules/normalize.css/normalize.css */\nfieldset {\n  padding: 0.35em 0.75em 0.625em; }\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n/* line 240, node_modules/normalize.css/normalize.css */\nlegend {\n  box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */ }\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n/* line 253, node_modules/normalize.css/normalize.css */\nprogress {\n  vertical-align: baseline; }\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n/* line 261, node_modules/normalize.css/normalize.css */\ntextarea {\n  overflow: auto; }\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n/* line 270, node_modules/normalize.css/normalize.css */\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n/* line 280, node_modules/normalize.css/normalize.css */\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n/* line 290, node_modules/normalize.css/normalize.css */\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */ }\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n/* line 299, node_modules/normalize.css/normalize.css */\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n/* line 308, node_modules/normalize.css/normalize.css */\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */ }\n\n/* Interactive\n   ========================================================================== */\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n/* line 320, node_modules/normalize.css/normalize.css */\ndetails {\n  display: block; }\n\n/*\n * Add the correct display in all browsers.\n */\n/* line 328, node_modules/normalize.css/normalize.css */\nsummary {\n  display: list-item; }\n\n/* Misc\n   ========================================================================== */\n/**\n * Add the correct display in IE 10+.\n */\n/* line 339, node_modules/normalize.css/normalize.css */\ntemplate {\n  display: none; }\n\n/**\n * Add the correct display in IE 10.\n */\n/* line 347, node_modules/normalize.css/normalize.css */\n[hidden] {\n  display: none; }\n\n/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n/* line 7, node_modules/prismjs/themes/prism.css */\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: black;\n  background: none;\n  text-shadow: 0 1px white;\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -moz-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none; }\n\n/* line 30, node_modules/prismjs/themes/prism.css */\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n  text-shadow: none;\n  background: #b3d4fc; }\n\n/* line 36, node_modules/prismjs/themes/prism.css */\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n  text-shadow: none;\n  background: #b3d4fc; }\n\n@media print {\n  /* line 43, node_modules/prismjs/themes/prism.css */\n  code[class*=\"language-\"],\n  pre[class*=\"language-\"] {\n    text-shadow: none; } }\n\n/* Code blocks */\n/* line 50, node_modules/prismjs/themes/prism.css */\npre[class*=\"language-\"] {\n  padding: 1em;\n  margin: .5em 0;\n  overflow: auto; }\n\n/* line 56, node_modules/prismjs/themes/prism.css */\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n  background: #f5f2f0; }\n\n/* Inline code */\n/* line 62, node_modules/prismjs/themes/prism.css */\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em;\n  border-radius: .3em;\n  white-space: normal; }\n\n/* line 68, node_modules/prismjs/themes/prism.css */\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: slategray; }\n\n/* line 75, node_modules/prismjs/themes/prism.css */\n.token.punctuation {\n  color: #999; }\n\n/* line 79, node_modules/prismjs/themes/prism.css */\n.namespace {\n  opacity: .7; }\n\n/* line 83, node_modules/prismjs/themes/prism.css */\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #905; }\n\n/* line 93, node_modules/prismjs/themes/prism.css */\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n  color: #690; }\n\n/* line 102, node_modules/prismjs/themes/prism.css */\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n  color: #9a6e3a;\n  background: rgba(255, 255, 255, 0.5); }\n\n/* line 111, node_modules/prismjs/themes/prism.css */\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #07a; }\n\n/* line 117, node_modules/prismjs/themes/prism.css */\n.token.function,\n.token.class-name {\n  color: #DD4A68; }\n\n/* line 122, node_modules/prismjs/themes/prism.css */\n.token.regex,\n.token.important,\n.token.variable {\n  color: #e90; }\n\n/* line 128, node_modules/prismjs/themes/prism.css */\n.token.important,\n.token.bold {\n  font-weight: bold; }\n\n/* line 132, node_modules/prismjs/themes/prism.css */\n.token.italic {\n  font-style: italic; }\n\n/* line 136, node_modules/prismjs/themes/prism.css */\n.token.entity {\n  cursor: help; }\n\n/* line 1, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\npre[class*=\"language-\"].line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber; }\n\n/* line 7, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\npre[class*=\"language-\"].line-numbers > code {\n  position: relative;\n  white-space: inherit; }\n\n/* line 12, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n/* line 29, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber; }\n\n/* line 35, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right; }\n\n/* line 1, src/styles/common/_mixins.scss */\n.link {\n  color: inherit;\n  cursor: pointer;\n  text-decoration: none; }\n\n/* line 7, src/styles/common/_mixins.scss */\n.link--accent {\n  color: var(--primary-color);\n  text-decoration: none; }\n\n/* line 22, src/styles/common/_mixins.scss */\n.u-absolute0 {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0; }\n\n/* line 30, src/styles/common/_mixins.scss */\n.u-textColorDarker {\n  color: rgba(0, 0, 0, 0.8) !important;\n  fill: rgba(0, 0, 0, 0.8) !important; }\n\n/* line 35, src/styles/common/_mixins.scss */\n.warning::before, .note::before, .success::before, [class^=\"i-\"]::before, [class*=\" i-\"]::before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  /* stylelint-disable-line */\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n/* line 2, src/styles/autoload/_zoom.scss */\nimg[data-action=\"zoom\"] {\n  cursor: zoom-in; }\n\n/* line 5, src/styles/autoload/_zoom.scss */\n.zoom-img,\n.zoom-img-wrap {\n  position: relative;\n  z-index: 666;\n  -webkit-transition: all 300ms;\n  -o-transition: all 300ms;\n  transition: all 300ms; }\n\n/* line 13, src/styles/autoload/_zoom.scss */\nimg.zoom-img {\n  cursor: pointer;\n  cursor: -webkit-zoom-out;\n  cursor: -moz-zoom-out; }\n\n/* line 18, src/styles/autoload/_zoom.scss */\n.zoom-overlay {\n  z-index: 420;\n  background: #fff;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  pointer-events: none;\n  filter: \"alpha(opacity=0)\";\n  opacity: 0;\n  -webkit-transition: opacity 300ms;\n  -o-transition: opacity 300ms;\n  transition: opacity 300ms; }\n\n/* line 33, src/styles/autoload/_zoom.scss */\n.zoom-overlay-open .zoom-overlay {\n  filter: \"alpha(opacity=100)\";\n  opacity: 1; }\n\n/* line 37, src/styles/autoload/_zoom.scss */\n.zoom-overlay-open,\n.zoom-overlay-transitioning {\n  cursor: default; }\n\n/* line 1, src/styles/common/_global.scss */\n:root {\n  --black: #000;\n  --white: #fff;\n  --primary-color: #1C9963;\n  --secondary-color: #2ad88d;\n  --header-color: #BBF1B9;\n  --header-color-hover: #EEFFEA;\n  --post-color-link: #2ad88d;\n  --story-cover-category-color: #2ad88d;\n  --composite-color: #CC116E;\n  --footer-color-link: #2ad88d;\n  --media-type-color: #2ad88d; }\n\n/* line 15, src/styles/common/_global.scss */\n*, *::before, *::after {\n  box-sizing: border-box; }\n\n/* line 19, src/styles/common/_global.scss */\na {\n  color: inherit;\n  text-decoration: none; }\n  /* line 23, src/styles/common/_global.scss */\n  a:active, a:hover {\n    outline: 0; }\n\n/* line 29, src/styles/common/_global.scss */\nblockquote {\n  border-left: 3px solid #000;\n  color: #000;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-size: 1.1875rem;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin: 30px 0 0 -12px;\n  padding-bottom: 2px;\n  padding-left: 20px; }\n  /* line 42, src/styles/common/_global.scss */\n  blockquote p:first-of-type {\n    margin-top: 0; }\n\n/* line 45, src/styles/common/_global.scss */\nbody {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 16px;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin: 0 auto;\n  text-rendering: optimizeLegibility;\n  overflow-x: hidden; }\n\n/* line 59, src/styles/common/_global.scss */\nhtml {\n  box-sizing: border-box;\n  font-size: 16px; }\n\n/* line 64, src/styles/common/_global.scss */\nfigure {\n  margin: 0; }\n\n/* line 68, src/styles/common/_global.scss */\nfigcaption {\n  color: rgba(0, 0, 0, 0.68);\n  display: block;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%; }\n\n/* line 89, src/styles/common/_global.scss */\nkbd, samp, code {\n  background: #f7f7f7;\n  border-radius: 4px;\n  color: #c7254e;\n  font-family: \"Fira Mono\", monospace !important;\n  font-size: 15px;\n  padding: 4px 6px;\n  white-space: pre-wrap; }\n\n/* line 99, src/styles/common/_global.scss */\npre {\n  background-color: #f7f7f7 !important;\n  border-radius: 4px;\n  font-family: \"Fira Mono\", monospace !important;\n  font-size: 15px;\n  margin-top: 30px !important;\n  max-width: 100%;\n  overflow: hidden;\n  padding: 1rem;\n  position: relative;\n  word-wrap: normal; }\n  /* line 111, src/styles/common/_global.scss */\n  pre code {\n    background: transparent;\n    color: #37474f;\n    padding: 0;\n    text-shadow: 0 1px #fff; }\n\n/* line 119, src/styles/common/_global.scss */\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: #37474f;\n  line-height: 1.4; }\n  /* line 124, src/styles/common/_global.scss */\n  code[class*=language-] .token.comment,\n  pre[class*=language-] .token.comment {\n    opacity: .8; }\n  /* line 126, src/styles/common/_global.scss */\n  code[class*=language-].line-numbers,\n  pre[class*=language-].line-numbers {\n    padding-left: 58px; }\n    /* line 129, src/styles/common/_global.scss */\n    code[class*=language-].line-numbers::before,\n    pre[class*=language-].line-numbers::before {\n      content: \"\";\n      position: absolute;\n      left: 0;\n      top: 0;\n      background: #F0EDEE;\n      width: 40px;\n      height: 100%; }\n  /* line 140, src/styles/common/_global.scss */\n  code[class*=language-] .line-numbers-rows,\n  pre[class*=language-] .line-numbers-rows {\n    border-right: none;\n    top: -3px;\n    left: -58px; }\n    /* line 145, src/styles/common/_global.scss */\n    code[class*=language-] .line-numbers-rows > span::before,\n    pre[class*=language-] .line-numbers-rows > span::before {\n      padding-right: 0;\n      text-align: center;\n      opacity: .8; }\n\n/* line 155, src/styles/common/_global.scss */\nhr:not(.hr-list):not(.post-footer-hr) {\n  border: 0;\n  display: block;\n  margin: 50px auto;\n  text-align: center; }\n  /* line 161, src/styles/common/_global.scss */\n  hr:not(.hr-list):not(.post-footer-hr)::before {\n    color: rgba(0, 0, 0, 0.6);\n    content: '...';\n    display: inline-block;\n    font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n    font-size: 28px;\n    font-weight: 400;\n    letter-spacing: .6em;\n    position: relative;\n    top: -25px; }\n\n/* line 174, src/styles/common/_global.scss */\n.post-footer-hr {\n  height: 1px;\n  margin: 32px 0;\n  border: 0;\n  background-color: #ddd; }\n\n/* line 181, src/styles/common/_global.scss */\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto; }\n  /* line 187, src/styles/common/_global.scss */\n  img:not([src]) {\n    visibility: hidden; }\n\n/* line 192, src/styles/common/_global.scss */\ni {\n  vertical-align: middle; }\n\n/* line 197, src/styles/common/_global.scss */\ninput {\n  border: none;\n  outline: 0; }\n\n/* line 202, src/styles/common/_global.scss */\nol, ul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0; }\n\n/* line 209, src/styles/common/_global.scss */\nmark {\n  background-color: transparent !important;\n  background-image: linear-gradient(to bottom, #d7fdd3, #d7fdd3);\n  color: rgba(0, 0, 0, 0.8); }\n\n/* line 215, src/styles/common/_global.scss */\nq {\n  color: rgba(0, 0, 0, 0.44);\n  display: block;\n  font-size: 28px;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.014em;\n  line-height: 1.48;\n  padding-left: 50px;\n  padding-top: 15px;\n  text-align: left; }\n  /* line 227, src/styles/common/_global.scss */\n  q::before, q::after {\n    display: none; }\n\n/* line 230, src/styles/common/_global.scss */\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch; }\n  /* line 245, src/styles/common/_global.scss */\n  table th,\n  table td {\n    padding: 6px 13px;\n    border: 1px solid #dfe2e5; }\n  /* line 251, src/styles/common/_global.scss */\n  table tr:nth-child(2n) {\n    background-color: #f6f8fa; }\n  /* line 255, src/styles/common/_global.scss */\n  table th {\n    letter-spacing: 0.2px;\n    text-transform: uppercase;\n    font-weight: 600; }\n\n/* line 269, src/styles/common/_global.scss */\n.link--underline:active, .link--underline:focus, .link--underline:hover {\n  text-decoration: underline; }\n\n/* line 279, src/styles/common/_global.scss */\n.main {\n  margin-bottom: 4em;\n  min-height: 90vh; }\n\n/* line 281, src/styles/common/_global.scss */\n.main,\n.footer {\n  transition: transform .5s ease; }\n\n/* line 286, src/styles/common/_global.scss */\n.warning {\n  background: #fbe9e7;\n  color: #d50000; }\n  /* line 289, src/styles/common/_global.scss */\n  .warning::before {\n    content: \"\"; }\n\n/* line 292, src/styles/common/_global.scss */\n.note {\n  background: #e1f5fe;\n  color: #0288d1; }\n  /* line 295, src/styles/common/_global.scss */\n  .note::before {\n    content: \"\"; }\n\n/* line 298, src/styles/common/_global.scss */\n.success {\n  background: #e0f2f1;\n  color: #00897b; }\n  /* line 301, src/styles/common/_global.scss */\n  .success::before {\n    color: #00bfa5;\n    content: \"\"; }\n\n/* line 304, src/styles/common/_global.scss */\n.warning, .note, .success {\n  display: block;\n  font-size: 18px !important;\n  line-height: 1.58 !important;\n  margin-top: 28px;\n  padding: 12px 24px 12px 60px; }\n  /* line 311, src/styles/common/_global.scss */\n  .warning a, .note a, .success a {\n    color: inherit;\n    text-decoration: underline; }\n  /* line 316, src/styles/common/_global.scss */\n  .warning::before, .note::before, .success::before {\n    float: left;\n    font-size: 24px;\n    margin-left: -36px;\n    margin-top: -5px; }\n\n/* line 329, src/styles/common/_global.scss */\n.tag-description {\n  max-width: 700px; }\n\n/* line 330, src/styles/common/_global.scss */\n.tag.has--image {\n  min-height: 350px; }\n\n/* line 335, src/styles/common/_global.scss */\n.with-tooltip {\n  overflow: visible;\n  position: relative; }\n  /* line 339, src/styles/common/_global.scss */\n  .with-tooltip::after {\n    background: rgba(0, 0, 0, 0.85);\n    border-radius: 4px;\n    color: #fff;\n    content: attr(data-tooltip);\n    display: inline-block;\n    font-size: 12px;\n    font-weight: 600;\n    left: 50%;\n    line-height: 1.25;\n    min-width: 130px;\n    opacity: 0;\n    padding: 4px 8px;\n    pointer-events: none;\n    position: absolute;\n    text-align: center;\n    text-transform: none;\n    top: -30px;\n    will-change: opacity, transform;\n    z-index: 1; }\n  /* line 361, src/styles/common/_global.scss */\n  .with-tooltip:hover::after {\n    animation: tooltip .1s ease-out both; }\n\n/* line 368, src/styles/common/_global.scss */\n.errorPage {\n  font-family: 'Roboto Mono', monospace; }\n  /* line 371, src/styles/common/_global.scss */\n  .errorPage-link {\n    left: -5px;\n    padding: 24px 60px;\n    top: -6px; }\n  /* line 377, src/styles/common/_global.scss */\n  .errorPage-text {\n    margin-top: 60px;\n    white-space: pre-wrap; }\n  /* line 382, src/styles/common/_global.scss */\n  .errorPage-wrap {\n    color: rgba(0, 0, 0, 0.4);\n    padding: 7vw 4vw; }\n\n/* line 390, src/styles/common/_global.scss */\n.video-responsive {\n  display: block;\n  height: 0;\n  margin-top: 30px;\n  overflow: hidden;\n  padding: 0 0 56.25%;\n  position: relative;\n  width: 100%; }\n  /* line 399, src/styles/common/_global.scss */\n  .video-responsive iframe {\n    border: 0;\n    bottom: 0;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%; }\n  /* line 409, src/styles/common/_global.scss */\n  .video-responsive video {\n    border: 0;\n    bottom: 0;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%; }\n\n/* line 420, src/styles/common/_global.scss */\n.kg-embed-card .video-responsive {\n  margin-top: 0; }\n\n/* line 426, src/styles/common/_global.scss */\n.kg-gallery-container {\n  display: flex;\n  flex-direction: column;\n  max-width: 100%;\n  width: 100%; }\n\n/* line 433, src/styles/common/_global.scss */\n.kg-gallery-row {\n  display: flex;\n  flex-direction: row;\n  justify-content: center; }\n  /* line 438, src/styles/common/_global.scss */\n  .kg-gallery-row:not(:first-of-type) {\n    margin: 0.75em 0 0 0; }\n\n/* line 442, src/styles/common/_global.scss */\n.kg-gallery-image img {\n  display: block;\n  margin: 0;\n  width: 100%;\n  height: 100%; }\n\n/* line 449, src/styles/common/_global.scss */\n.kg-gallery-image:not(:first-of-type) {\n  margin: 0 0 0 0.75em; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-facebook {\n  color: #3b5998 !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-facebook, .sideNav-follow .i-facebook {\n  background-color: #3b5998 !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-twitter {\n  color: #55acee !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-twitter, .sideNav-follow .i-twitter {\n  background-color: #55acee !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-google {\n  color: #dd4b39 !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-google, .sideNav-follow .i-google {\n  background-color: #dd4b39 !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-instagram {\n  color: #306088 !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-instagram, .sideNav-follow .i-instagram {\n  background-color: #306088 !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-youtube {\n  color: #e52d27 !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-youtube, .sideNav-follow .i-youtube {\n  background-color: #e52d27 !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-github {\n  color: #555 !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-github, .sideNav-follow .i-github {\n  background-color: #555 !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-linkedin {\n  color: #007bb6 !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-linkedin, .sideNav-follow .i-linkedin {\n  background-color: #007bb6 !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-spotify {\n  color: #2ebd59 !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-spotify, .sideNav-follow .i-spotify {\n  background-color: #2ebd59 !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-codepen {\n  color: #222 !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-codepen, .sideNav-follow .i-codepen {\n  background-color: #222 !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-behance {\n  color: #131418 !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-behance, .sideNav-follow .i-behance {\n  background-color: #131418 !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-dribbble {\n  color: #ea4c89 !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-dribbble, .sideNav-follow .i-dribbble {\n  background-color: #ea4c89 !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-flickr {\n  color: #0063dc !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-flickr, .sideNav-follow .i-flickr {\n  background-color: #0063dc !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-reddit {\n  color: #ff4500 !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-reddit, .sideNav-follow .i-reddit {\n  background-color: #ff4500 !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-pocket {\n  color: #f50057 !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-pocket, .sideNav-follow .i-pocket {\n  background-color: #f50057 !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-pinterest {\n  color: #bd081c !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-pinterest, .sideNav-follow .i-pinterest {\n  background-color: #bd081c !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-whatsapp {\n  color: #64d448 !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-whatsapp, .sideNav-follow .i-whatsapp {\n  background-color: #64d448 !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-telegram {\n  color: #08c !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-telegram, .sideNav-follow .i-telegram {\n  background-color: #08c !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-discord {\n  color: #7289da !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-discord, .sideNav-follow .i-discord {\n  background-color: #7289da !important; }\n\n/* line 456, src/styles/common/_global.scss */\n.c-rss {\n  color: orange !important; }\n\n/* line 457, src/styles/common/_global.scss */\n.bg-rss, .sideNav-follow .i-rss {\n  background-color: orange !important; }\n\n/* line 480, src/styles/common/_global.scss */\n.rocket {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  width: 60px;\n  z-index: 5; }\n  /* line 488, src/styles/common/_global.scss */\n  .rocket:hover svg path {\n    fill: rgba(0, 0, 0, 0.6); }\n\n/* line 493, src/styles/common/_global.scss */\n.svgIcon {\n  display: inline-block; }\n\n/* line 497, src/styles/common/_global.scss */\nsvg {\n  height: auto;\n  width: 100%; }\n\n/* line 505, src/styles/common/_global.scss */\n.load-more {\n  max-width: 70% !important; }\n\n/* line 510, src/styles/common/_global.scss */\n.loadingBar {\n  background-color: #48e79a;\n  display: none;\n  height: 2px;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  z-index: 800; }\n\n/* line 522, src/styles/common/_global.scss */\n.is-loading .loadingBar {\n  animation: loading-bar 1s ease-in-out infinite;\n  animation-delay: .8s;\n  display: block; }\n\n@media only screen and (max-width: 766px) {\n  /* line 531, src/styles/common/_global.scss */\n  blockquote {\n    margin-left: -5px;\n    font-size: 1.125rem; }\n  /* line 533, src/styles/common/_global.scss */\n  .kg-image-card,\n  .kg-embed-card {\n    margin-right: -20px;\n    margin-left: -20px; } }\n\n/* line 2, src/styles/components/_grid.scss */\n.extreme-container {\n  box-sizing: border-box;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding: 0 16px;\n  width: 100%; }\n\n/* line 25, src/styles/components/_grid.scss */\n.col-left,\n.cc-video-left {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%;\n  padding-right: 10px;\n  padding-left: 10px; }\n\n@media only screen and (min-width: 1000px) {\n  /* line 38, src/styles/components/_grid.scss */\n  .col-left {\n    max-width: calc(100% - 340px); }\n  /* line 39, src/styles/components/_grid.scss */\n  .cc-video-left {\n    max-width: calc(100% - 320px); }\n  /* line 40, src/styles/components/_grid.scss */\n  .cc-video-right {\n    flex-basis: 320px !important;\n    max-width: 320px !important; }\n  /* line 41, src/styles/components/_grid.scss */\n  body.is-article .col-left {\n    padding-right: 40px; } }\n\n/* line 44, src/styles/components/_grid.scss */\n.col-right {\n  display: flex;\n  flex-direction: column;\n  padding-left: 10px;\n  padding-right: 10px;\n  width: 320px; }\n\n/* line 52, src/styles/components/_grid.scss */\n.row {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  flex: 0 1 auto;\n  margin-left: -10px;\n  margin-right: -10px; }\n  /* line 60, src/styles/components/_grid.scss */\n  .row .col {\n    flex: 0 0 auto;\n    box-sizing: border-box;\n    padding-left: 10px;\n    padding-right: 10px; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s1 {\n      flex-basis: 8.33333%;\n      max-width: 8.33333%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s2 {\n      flex-basis: 16.66667%;\n      max-width: 16.66667%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s3 {\n      flex-basis: 25%;\n      max-width: 25%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s4 {\n      flex-basis: 33.33333%;\n      max-width: 33.33333%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s5 {\n      flex-basis: 41.66667%;\n      max-width: 41.66667%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s6 {\n      flex-basis: 50%;\n      max-width: 50%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s7 {\n      flex-basis: 58.33333%;\n      max-width: 58.33333%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s8 {\n      flex-basis: 66.66667%;\n      max-width: 66.66667%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s9 {\n      flex-basis: 75%;\n      max-width: 75%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s10 {\n      flex-basis: 83.33333%;\n      max-width: 83.33333%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s11 {\n      flex-basis: 91.66667%;\n      max-width: 91.66667%; }\n    /* line 71, src/styles/components/_grid.scss */\n    .row .col.s12 {\n      flex-basis: 100%;\n      max-width: 100%; }\n    @media only screen and (min-width: 766px) {\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m1 {\n        flex-basis: 8.33333%;\n        max-width: 8.33333%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m2 {\n        flex-basis: 16.66667%;\n        max-width: 16.66667%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m3 {\n        flex-basis: 25%;\n        max-width: 25%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m4 {\n        flex-basis: 33.33333%;\n        max-width: 33.33333%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m5 {\n        flex-basis: 41.66667%;\n        max-width: 41.66667%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m6 {\n        flex-basis: 50%;\n        max-width: 50%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m7 {\n        flex-basis: 58.33333%;\n        max-width: 58.33333%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m8 {\n        flex-basis: 66.66667%;\n        max-width: 66.66667%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m9 {\n        flex-basis: 75%;\n        max-width: 75%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m10 {\n        flex-basis: 83.33333%;\n        max-width: 83.33333%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m11 {\n        flex-basis: 91.66667%;\n        max-width: 91.66667%; }\n      /* line 86, src/styles/components/_grid.scss */\n      .row .col.m12 {\n        flex-basis: 100%;\n        max-width: 100%; } }\n    @media only screen and (min-width: 1000px) {\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l1 {\n        flex-basis: 8.33333%;\n        max-width: 8.33333%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l2 {\n        flex-basis: 16.66667%;\n        max-width: 16.66667%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l3 {\n        flex-basis: 25%;\n        max-width: 25%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l4 {\n        flex-basis: 33.33333%;\n        max-width: 33.33333%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l5 {\n        flex-basis: 41.66667%;\n        max-width: 41.66667%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l6 {\n        flex-basis: 50%;\n        max-width: 50%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l7 {\n        flex-basis: 58.33333%;\n        max-width: 58.33333%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l8 {\n        flex-basis: 66.66667%;\n        max-width: 66.66667%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l9 {\n        flex-basis: 75%;\n        max-width: 75%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l10 {\n        flex-basis: 83.33333%;\n        max-width: 83.33333%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l11 {\n        flex-basis: 91.66667%;\n        max-width: 91.66667%; }\n      /* line 102, src/styles/components/_grid.scss */\n      .row .col.l12 {\n        flex-basis: 100%;\n        max-width: 100%; } }\n\n/* line 3, src/styles/common/_typography.scss */\nh1, h2, h3, h4, h5, h6 {\n  color: inherit;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-weight: 600;\n  line-height: 1.1;\n  margin: 0; }\n  /* line 10, src/styles/common/_typography.scss */\n  h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {\n    color: inherit;\n    line-height: inherit; }\n\n/* line 16, src/styles/common/_typography.scss */\nh1 {\n  font-size: 2rem; }\n\n/* line 17, src/styles/common/_typography.scss */\nh2 {\n  font-size: 1.875rem; }\n\n/* line 18, src/styles/common/_typography.scss */\nh3 {\n  font-size: 1.6rem; }\n\n/* line 19, src/styles/common/_typography.scss */\nh4 {\n  font-size: 1.4rem; }\n\n/* line 20, src/styles/common/_typography.scss */\nh5 {\n  font-size: 1.2rem; }\n\n/* line 21, src/styles/common/_typography.scss */\nh6 {\n  font-size: 1rem; }\n\n/* line 23, src/styles/common/_typography.scss */\np {\n  margin: 0; }\n\n/* line 2, src/styles/common/_utilities.scss */\n.u-textColorNormal {\n  color: #999999 !important;\n  fill: #999999 !important; }\n\n/* line 9, src/styles/common/_utilities.scss */\n.u-textColorWhite {\n  color: #fff !important;\n  fill: #fff !important; }\n\n/* line 14, src/styles/common/_utilities.scss */\n.u-hoverColorNormal:hover {\n  color: rgba(0, 0, 0, 0.6);\n  fill: rgba(0, 0, 0, 0.6); }\n\n/* line 19, src/styles/common/_utilities.scss */\n.u-accentColor--iconNormal {\n  color: #1C9963;\n  fill: #1C9963; }\n\n/* line 25, src/styles/common/_utilities.scss */\n.u-bgColor {\n  background-color: var(--primary-color); }\n\n/* line 30, src/styles/common/_utilities.scss */\n.u-relative {\n  position: relative; }\n\n/* line 31, src/styles/common/_utilities.scss */\n.u-absolute {\n  position: absolute; }\n\n/* line 33, src/styles/common/_utilities.scss */\n.u-fixed {\n  position: fixed !important; }\n\n/* line 35, src/styles/common/_utilities.scss */\n.u-block {\n  display: block !important; }\n\n/* line 36, src/styles/common/_utilities.scss */\n.u-inlineBlock {\n  display: inline-block; }\n\n/* line 39, src/styles/common/_utilities.scss */\n.u-backgroundDark {\n  background-color: #0d0f10;\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1; }\n\n/* line 50, src/styles/common/_utilities.scss */\n.u-gradient {\n  background: linear-gradient(to bottom, transparent 20%, #000 100%);\n  bottom: 0;\n  height: 90%;\n  left: 0;\n  position: absolute;\n  right: 0;\n  z-index: 1; }\n\n/* line 61, src/styles/common/_utilities.scss */\n.zindex1 {\n  z-index: 1; }\n\n/* line 62, src/styles/common/_utilities.scss */\n.zindex2 {\n  z-index: 2; }\n\n/* line 63, src/styles/common/_utilities.scss */\n.zindex3 {\n  z-index: 3; }\n\n/* line 64, src/styles/common/_utilities.scss */\n.zindex4 {\n  z-index: 4; }\n\n/* line 67, src/styles/common/_utilities.scss */\n.u-backgroundWhite {\n  background-color: #fafafa; }\n\n/* line 68, src/styles/common/_utilities.scss */\n.u-backgroundColorGrayLight {\n  background-color: #f0f0f0 !important; }\n\n/* line 71, src/styles/common/_utilities.scss */\n.u-clear::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n/* line 78, src/styles/common/_utilities.scss */\n.u-fontSizeMicro {\n  font-size: 11px; }\n\n/* line 79, src/styles/common/_utilities.scss */\n.u-fontSizeSmallest {\n  font-size: 12px; }\n\n/* line 80, src/styles/common/_utilities.scss */\n.u-fontSize13 {\n  font-size: 13px; }\n\n/* line 81, src/styles/common/_utilities.scss */\n.u-fontSizeSmaller {\n  font-size: 14px; }\n\n/* line 82, src/styles/common/_utilities.scss */\n.u-fontSize15 {\n  font-size: 15px; }\n\n/* line 83, src/styles/common/_utilities.scss */\n.u-fontSizeSmall {\n  font-size: 16px; }\n\n/* line 84, src/styles/common/_utilities.scss */\n.u-fontSizeBase {\n  font-size: 18px; }\n\n/* line 85, src/styles/common/_utilities.scss */\n.u-fontSize20 {\n  font-size: 20px; }\n\n/* line 86, src/styles/common/_utilities.scss */\n.u-fontSize21 {\n  font-size: 21px; }\n\n/* line 87, src/styles/common/_utilities.scss */\n.u-fontSize22 {\n  font-size: 22px; }\n\n/* line 88, src/styles/common/_utilities.scss */\n.u-fontSizeLarge {\n  font-size: 24px; }\n\n/* line 89, src/styles/common/_utilities.scss */\n.u-fontSize26 {\n  font-size: 26px; }\n\n/* line 90, src/styles/common/_utilities.scss */\n.u-fontSize28 {\n  font-size: 28px; }\n\n/* line 91, src/styles/common/_utilities.scss */\n.u-fontSizeLarger, .media-type {\n  font-size: 32px; }\n\n/* line 92, src/styles/common/_utilities.scss */\n.u-fontSize36 {\n  font-size: 36px; }\n\n/* line 93, src/styles/common/_utilities.scss */\n.u-fontSize40 {\n  font-size: 40px; }\n\n/* line 94, src/styles/common/_utilities.scss */\n.u-fontSizeLargest {\n  font-size: 44px; }\n\n/* line 95, src/styles/common/_utilities.scss */\n.u-fontSizeJumbo {\n  font-size: 50px; }\n\n@media only screen and (max-width: 766px) {\n  /* line 98, src/styles/common/_utilities.scss */\n  .u-md-fontSizeBase {\n    font-size: 18px; }\n  /* line 99, src/styles/common/_utilities.scss */\n  .u-md-fontSize22 {\n    font-size: 22px; }\n  /* line 100, src/styles/common/_utilities.scss */\n  .u-md-fontSizeLarger {\n    font-size: 32px; } }\n\n/* line 116, src/styles/common/_utilities.scss */\n.u-fontWeightThin {\n  font-weight: 300; }\n\n/* line 117, src/styles/common/_utilities.scss */\n.u-fontWeightNormal {\n  font-weight: 400; }\n\n/* line 118, src/styles/common/_utilities.scss */\n.u-fontWeightMedium {\n  font-weight: 500; }\n\n/* line 119, src/styles/common/_utilities.scss */\n.u-fontWeightSemibold {\n  font-weight: 600 !important; }\n\n/* line 120, src/styles/common/_utilities.scss */\n.u-fontWeightBold {\n  font-weight: 700; }\n\n/* line 121, src/styles/common/_utilities.scss */\n.u-fontWeightBolder {\n  font-weight: 900; }\n\n/* line 123, src/styles/common/_utilities.scss */\n.u-textUppercase {\n  text-transform: uppercase; }\n\n/* line 124, src/styles/common/_utilities.scss */\n.u-textCapitalize {\n  text-transform: capitalize; }\n\n/* line 125, src/styles/common/_utilities.scss */\n.u-textAlignCenter {\n  text-align: center; }\n\n/* line 127, src/styles/common/_utilities.scss */\n.u-noWrapWithEllipsis {\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important; }\n\n/* line 134, src/styles/common/_utilities.scss */\n.u-marginAuto {\n  margin-left: auto;\n  margin-right: auto; }\n\n/* line 135, src/styles/common/_utilities.scss */\n.u-marginTop20 {\n  margin-top: 20px; }\n\n/* line 136, src/styles/common/_utilities.scss */\n.u-marginTop30 {\n  margin-top: 30px; }\n\n/* line 137, src/styles/common/_utilities.scss */\n.u-marginBottom10 {\n  margin-bottom: 10px; }\n\n/* line 138, src/styles/common/_utilities.scss */\n.u-marginBottom15 {\n  margin-bottom: 15px; }\n\n/* line 139, src/styles/common/_utilities.scss */\n.u-marginBottom20 {\n  margin-bottom: 20px !important; }\n\n/* line 140, src/styles/common/_utilities.scss */\n.u-marginBottom30 {\n  margin-bottom: 30px; }\n\n/* line 141, src/styles/common/_utilities.scss */\n.u-marginBottom40 {\n  margin-bottom: 40px; }\n\n/* line 144, src/styles/common/_utilities.scss */\n.u-padding0 {\n  padding: 0 !important; }\n\n/* line 145, src/styles/common/_utilities.scss */\n.u-padding20 {\n  padding: 20px; }\n\n/* line 146, src/styles/common/_utilities.scss */\n.u-padding15 {\n  padding: 15px !important; }\n\n/* line 147, src/styles/common/_utilities.scss */\n.u-paddingBottom2 {\n  padding-bottom: 2px; }\n\n/* line 148, src/styles/common/_utilities.scss */\n.u-paddingBottom30 {\n  padding-bottom: 30px; }\n\n/* line 149, src/styles/common/_utilities.scss */\n.u-paddingBottom20 {\n  padding-bottom: 20px; }\n\n/* line 150, src/styles/common/_utilities.scss */\n.u-paddingRight10 {\n  padding-right: 10px; }\n\n/* line 151, src/styles/common/_utilities.scss */\n.u-paddingLeft15 {\n  padding-left: 15px; }\n\n/* line 153, src/styles/common/_utilities.scss */\n.u-paddingTop2 {\n  padding-top: 2px; }\n\n/* line 154, src/styles/common/_utilities.scss */\n.u-paddingTop5 {\n  padding-top: 5px; }\n\n/* line 155, src/styles/common/_utilities.scss */\n.u-paddingTop10 {\n  padding-top: 10px; }\n\n/* line 156, src/styles/common/_utilities.scss */\n.u-paddingTop15 {\n  padding-top: 15px; }\n\n/* line 157, src/styles/common/_utilities.scss */\n.u-paddingTop20 {\n  padding-top: 20px; }\n\n/* line 158, src/styles/common/_utilities.scss */\n.u-paddingTop30 {\n  padding-top: 30px; }\n\n/* line 160, src/styles/common/_utilities.scss */\n.u-paddingBottom15 {\n  padding-bottom: 15px; }\n\n/* line 162, src/styles/common/_utilities.scss */\n.u-paddingRight20 {\n  padding-right: 20px; }\n\n/* line 163, src/styles/common/_utilities.scss */\n.u-paddingLeft20 {\n  padding-left: 20px; }\n\n/* line 165, src/styles/common/_utilities.scss */\n.u-contentTitle {\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-style: normal;\n  font-weight: 900;\n  letter-spacing: -.028em; }\n\n/* line 173, src/styles/common/_utilities.scss */\n.u-lineHeight1 {\n  line-height: 1; }\n\n/* line 174, src/styles/common/_utilities.scss */\n.u-lineHeightTight {\n  line-height: 1.2; }\n\n/* line 177, src/styles/common/_utilities.scss */\n.u-overflowHidden {\n  overflow: hidden; }\n\n/* line 180, src/styles/common/_utilities.scss */\n.u-floatRight {\n  float: right; }\n\n/* line 181, src/styles/common/_utilities.scss */\n.u-floatLeft {\n  float: left; }\n\n/* line 184, src/styles/common/_utilities.scss */\n.u-flex {\n  display: flex; }\n\n/* line 185, src/styles/common/_utilities.scss */\n.u-flexCenter, .media-type {\n  align-items: center;\n  display: flex; }\n\n/* line 186, src/styles/common/_utilities.scss */\n.u-flexContentCenter, .media-type {\n  justify-content: center; }\n\n/* line 188, src/styles/common/_utilities.scss */\n.u-flex1 {\n  flex: 1 1 auto; }\n\n/* line 189, src/styles/common/_utilities.scss */\n.u-flex0 {\n  flex: 0 0 auto; }\n\n/* line 190, src/styles/common/_utilities.scss */\n.u-flexWrap {\n  flex-wrap: wrap; }\n\n/* line 192, src/styles/common/_utilities.scss */\n.u-flexColumn {\n  display: flex;\n  flex-direction: column;\n  justify-content: center; }\n\n/* line 198, src/styles/common/_utilities.scss */\n.u-flexEnd {\n  align-items: center;\n  justify-content: flex-end; }\n\n/* line 203, src/styles/common/_utilities.scss */\n.u-flexColumnTop {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start; }\n\n/* line 210, src/styles/common/_utilities.scss */\n.u-backgroundSizeCover {\n  background-origin: border-box;\n  background-position: center;\n  background-size: cover; }\n\n/* line 217, src/styles/common/_utilities.scss */\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 20px;\n  padding-right: 20px; }\n\n/* line 224, src/styles/common/_utilities.scss */\n.u-maxWidth1200 {\n  max-width: 1200px; }\n\n/* line 225, src/styles/common/_utilities.scss */\n.u-maxWidth1000 {\n  max-width: 1000px; }\n\n/* line 226, src/styles/common/_utilities.scss */\n.u-maxWidth740 {\n  max-width: 740px; }\n\n/* line 227, src/styles/common/_utilities.scss */\n.u-maxWidth1040 {\n  max-width: 1040px; }\n\n/* line 228, src/styles/common/_utilities.scss */\n.u-sizeFullWidth {\n  width: 100%; }\n\n/* line 229, src/styles/common/_utilities.scss */\n.u-sizeFullHeight {\n  height: 100%; }\n\n/* line 232, src/styles/common/_utilities.scss */\n.u-borderLighter {\n  border: 1px solid rgba(0, 0, 0, 0.15); }\n\n/* line 233, src/styles/common/_utilities.scss */\n.u-round, .avatar-image, .media-type {\n  border-radius: 50%; }\n\n/* line 234, src/styles/common/_utilities.scss */\n.u-borderRadius2 {\n  border-radius: 2px; }\n\n/* line 236, src/styles/common/_utilities.scss */\n.u-boxShadowBottom {\n  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.05); }\n\n/* line 241, src/styles/common/_utilities.scss */\n.u-height540 {\n  height: 540px; }\n\n/* line 242, src/styles/common/_utilities.scss */\n.u-height280 {\n  height: 280px; }\n\n/* line 243, src/styles/common/_utilities.scss */\n.u-height260 {\n  height: 260px; }\n\n/* line 244, src/styles/common/_utilities.scss */\n.u-height100 {\n  height: 100px; }\n\n/* line 245, src/styles/common/_utilities.scss */\n.u-borderBlackLightest {\n  border: 1px solid rgba(0, 0, 0, 0.1); }\n\n/* line 248, src/styles/common/_utilities.scss */\n.u-hide {\n  display: none !important; }\n\n/* line 251, src/styles/common/_utilities.scss */\n.u-card {\n  background: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.09);\n  border-radius: 3px;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  margin-bottom: 10px;\n  padding: 10px 20px 15px; }\n\n/* line 262, src/styles/common/_utilities.scss */\n.title-line {\n  position: relative;\n  text-align: center;\n  width: 100%; }\n  /* line 267, src/styles/common/_utilities.scss */\n  .title-line::before {\n    content: '';\n    background: rgba(255, 255, 255, 0.3);\n    display: inline-block;\n    position: absolute;\n    left: 0;\n    bottom: 50%;\n    width: 100%;\n    height: 1px;\n    z-index: 0; }\n\n/* line 281, src/styles/common/_utilities.scss */\n.u-oblique {\n  background-color: var(--composite-color);\n  color: #fff;\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 700;\n  line-height: 1;\n  padding: 5px 13px;\n  text-transform: uppercase;\n  transform: skewX(-15deg); }\n\n/* line 293, src/styles/common/_utilities.scss */\n.no-avatar {\n  background-image: url(\"../images/avatar.png\") !important; }\n\n@media only screen and (max-width: 766px) {\n  /* line 298, src/styles/common/_utilities.scss */\n  .u-hide-before-md {\n    display: none !important; }\n  /* line 299, src/styles/common/_utilities.scss */\n  .u-md-heightAuto {\n    height: auto; }\n  /* line 300, src/styles/common/_utilities.scss */\n  .u-md-height170 {\n    height: 170px; }\n  /* line 301, src/styles/common/_utilities.scss */\n  .u-md-relative {\n    position: relative; } }\n\n@media only screen and (max-width: 1000px) {\n  /* line 304, src/styles/common/_utilities.scss */\n  .u-hide-before-lg {\n    display: none !important; } }\n\n@media only screen and (min-width: 766px) {\n  /* line 307, src/styles/common/_utilities.scss */\n  .u-hide-after-md {\n    display: none !important; } }\n\n@media only screen and (min-width: 1000px) {\n  /* line 309, src/styles/common/_utilities.scss */\n  .u-hide-after-lg {\n    display: none !important; } }\n\n/* line 1, src/styles/components/_form.scss */\n.button {\n  background: transparent;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  box-sizing: border-box;\n  color: rgba(0, 0, 0, 0.44);\n  cursor: pointer;\n  display: inline-block;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  height: 37px;\n  letter-spacing: 0;\n  line-height: 35px;\n  padding: 0 16px;\n  position: relative;\n  text-align: center;\n  text-decoration: none;\n  text-rendering: optimizeLegibility;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap; }\n  /* line 25, src/styles/components/_form.scss */\n  .button--chromeless {\n    border-radius: 0;\n    border-width: 0;\n    box-shadow: none;\n    color: rgba(0, 0, 0, 0.44);\n    height: auto;\n    line-height: inherit;\n    padding: 0;\n    text-align: left;\n    vertical-align: baseline;\n    white-space: normal; }\n    /* line 37, src/styles/components/_form.scss */\n    .button--chromeless:active, .button--chromeless:hover, .button--chromeless:focus {\n      border-width: 0;\n      color: rgba(0, 0, 0, 0.6); }\n  /* line 45, src/styles/components/_form.scss */\n  .button--large {\n    font-size: 15px;\n    height: 44px;\n    line-height: 42px;\n    padding: 0 18px; }\n  /* line 52, src/styles/components/_form.scss */\n  .button--dark {\n    background: rgba(0, 0, 0, 0.84);\n    border-color: rgba(0, 0, 0, 0.84);\n    color: rgba(255, 255, 255, 0.97); }\n    /* line 57, src/styles/components/_form.scss */\n    .button--dark:hover {\n      background: #1C9963;\n      border-color: #1C9963; }\n\n/* line 65, src/styles/components/_form.scss */\n.button--primary {\n  border-color: #1C9963;\n  color: #1C9963; }\n\n/* line 70, src/styles/components/_form.scss */\n.button--large.button--chromeless,\n.button--large.button--link {\n  padding: 0; }\n\n/* line 76, src/styles/components/_form.scss */\n.buttonSet > .button {\n  margin-right: 8px;\n  vertical-align: middle; }\n\n/* line 81, src/styles/components/_form.scss */\n.buttonSet > .button:last-child {\n  margin-right: 0; }\n\n/* line 85, src/styles/components/_form.scss */\n.buttonSet .button--chromeless {\n  height: 37px;\n  line-height: 35px; }\n\n/* line 90, src/styles/components/_form.scss */\n.buttonSet .button--large.button--chromeless,\n.buttonSet .button--large.button--link {\n  height: 44px;\n  line-height: 42px; }\n\n/* line 96, src/styles/components/_form.scss */\n.buttonSet > .button--chromeless:not(.button--circle) {\n  margin-right: 0;\n  padding-right: 8px; }\n\n/* line 101, src/styles/components/_form.scss */\n.buttonSet > .button--chromeless:last-child {\n  padding-right: 0; }\n\n/* line 105, src/styles/components/_form.scss */\n.buttonSet > .button--chromeless + .button--chromeless:not(.button--circle) {\n  margin-left: 0;\n  padding-left: 8px; }\n\n/* line 111, src/styles/components/_form.scss */\n.button--circle {\n  background-image: none !important;\n  border-radius: 50%;\n  color: #fff;\n  height: 40px;\n  line-height: 38px;\n  padding: 0;\n  text-decoration: none;\n  width: 40px; }\n\n/* line 124, src/styles/components/_form.scss */\n.tag-button {\n  background: rgba(0, 0, 0, 0.05);\n  border: none;\n  color: rgba(0, 0, 0, 0.68);\n  font-weight: 700;\n  margin: 0 8px 8px 0; }\n  /* line 131, src/styles/components/_form.scss */\n  .tag-button:hover {\n    background: rgba(0, 0, 0, 0.1);\n    color: rgba(0, 0, 0, 0.68); }\n\n/* line 139, src/styles/components/_form.scss */\n.button--dark-line {\n  border: 1px solid #000;\n  color: #000;\n  display: block;\n  font-weight: 600;\n  margin: 50px auto 0;\n  max-width: 300px;\n  text-transform: uppercase;\n  transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  width: 100%; }\n  /* line 150, src/styles/components/_form.scss */\n  .button--dark-line:hover {\n    color: #fff;\n    box-shadow: inset 0 -50px 8px -4px #000; }\n\n@font-face {\n  font-family: 'mapache';\n  src: url(\"../fonts/mapache.eot?25764j\");\n  src: url(\"../fonts/mapache.eot?25764j#iefix\") format(\"embedded-opentype\"), url(\"../fonts/mapache.ttf?25764j\") format(\"truetype\"), url(\"../fonts/mapache.woff?25764j\") format(\"woff\"), url(\"../fonts/mapache.svg?25764j#mapache\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal; }\n\n/* line 17, src/styles/components/_icons.scss */\n.i-tag:before {\n  content: \"\\e911\"; }\n\n/* line 20, src/styles/components/_icons.scss */\n.i-discord:before {\n  content: \"\\e90a\"; }\n\n/* line 23, src/styles/components/_icons.scss */\n.i-arrow-round-next:before {\n  content: \"\\e90c\"; }\n\n/* line 26, src/styles/components/_icons.scss */\n.i-arrow-round-prev:before {\n  content: \"\\e90d\"; }\n\n/* line 29, src/styles/components/_icons.scss */\n.i-arrow-round-up:before {\n  content: \"\\e90e\"; }\n\n/* line 32, src/styles/components/_icons.scss */\n.i-arrow-round-down:before {\n  content: \"\\e90f\"; }\n\n/* line 35, src/styles/components/_icons.scss */\n.i-photo:before {\n  content: \"\\e90b\"; }\n\n/* line 38, src/styles/components/_icons.scss */\n.i-send:before {\n  content: \"\\e909\"; }\n\n/* line 41, src/styles/components/_icons.scss */\n.i-audio:before {\n  content: \"\\e901\"; }\n\n/* line 44, src/styles/components/_icons.scss */\n.i-rocket:before {\n  content: \"\\e902\";\n  color: #999; }\n\n/* line 48, src/styles/components/_icons.scss */\n.i-comments-line:before {\n  content: \"\\e900\"; }\n\n/* line 51, src/styles/components/_icons.scss */\n.i-globe:before {\n  content: \"\\e906\"; }\n\n/* line 54, src/styles/components/_icons.scss */\n.i-star:before {\n  content: \"\\e907\"; }\n\n/* line 57, src/styles/components/_icons.scss */\n.i-link:before {\n  content: \"\\e908\"; }\n\n/* line 60, src/styles/components/_icons.scss */\n.i-star-line:before {\n  content: \"\\e903\"; }\n\n/* line 63, src/styles/components/_icons.scss */\n.i-more:before {\n  content: \"\\e904\"; }\n\n/* line 66, src/styles/components/_icons.scss */\n.i-search:before {\n  content: \"\\e905\"; }\n\n/* line 69, src/styles/components/_icons.scss */\n.i-chat:before {\n  content: \"\\e910\"; }\n\n/* line 72, src/styles/components/_icons.scss */\n.i-arrow-left:before {\n  content: \"\\e314\"; }\n\n/* line 75, src/styles/components/_icons.scss */\n.i-arrow-right:before {\n  content: \"\\e315\"; }\n\n/* line 78, src/styles/components/_icons.scss */\n.i-play:before {\n  content: \"\\e037\"; }\n\n/* line 81, src/styles/components/_icons.scss */\n.i-location:before {\n  content: \"\\e8b4\"; }\n\n/* line 84, src/styles/components/_icons.scss */\n.i-check-circle:before {\n  content: \"\\e86c\"; }\n\n/* line 87, src/styles/components/_icons.scss */\n.i-close:before {\n  content: \"\\e5cd\"; }\n\n/* line 90, src/styles/components/_icons.scss */\n.i-favorite:before {\n  content: \"\\e87d\"; }\n\n/* line 93, src/styles/components/_icons.scss */\n.i-warning:before {\n  content: \"\\e002\"; }\n\n/* line 96, src/styles/components/_icons.scss */\n.i-rss:before {\n  content: \"\\e0e5\"; }\n\n/* line 99, src/styles/components/_icons.scss */\n.i-share:before {\n  content: \"\\e80d\"; }\n\n/* line 102, src/styles/components/_icons.scss */\n.i-email:before {\n  content: \"\\f0e0\"; }\n\n/* line 105, src/styles/components/_icons.scss */\n.i-google:before {\n  content: \"\\f1a0\"; }\n\n/* line 108, src/styles/components/_icons.scss */\n.i-telegram:before {\n  content: \"\\f2c6\"; }\n\n/* line 111, src/styles/components/_icons.scss */\n.i-reddit:before {\n  content: \"\\f281\"; }\n\n/* line 114, src/styles/components/_icons.scss */\n.i-twitter:before {\n  content: \"\\f099\"; }\n\n/* line 117, src/styles/components/_icons.scss */\n.i-github:before {\n  content: \"\\f09b\"; }\n\n/* line 120, src/styles/components/_icons.scss */\n.i-linkedin:before {\n  content: \"\\f0e1\"; }\n\n/* line 123, src/styles/components/_icons.scss */\n.i-youtube:before {\n  content: \"\\f16a\"; }\n\n/* line 126, src/styles/components/_icons.scss */\n.i-stack-overflow:before {\n  content: \"\\f16c\"; }\n\n/* line 129, src/styles/components/_icons.scss */\n.i-instagram:before {\n  content: \"\\f16d\"; }\n\n/* line 132, src/styles/components/_icons.scss */\n.i-flickr:before {\n  content: \"\\f16e\"; }\n\n/* line 135, src/styles/components/_icons.scss */\n.i-dribbble:before {\n  content: \"\\f17d\"; }\n\n/* line 138, src/styles/components/_icons.scss */\n.i-behance:before {\n  content: \"\\f1b4\"; }\n\n/* line 141, src/styles/components/_icons.scss */\n.i-spotify:before {\n  content: \"\\f1bc\"; }\n\n/* line 144, src/styles/components/_icons.scss */\n.i-codepen:before {\n  content: \"\\f1cb\"; }\n\n/* line 147, src/styles/components/_icons.scss */\n.i-facebook:before {\n  content: \"\\f230\"; }\n\n/* line 150, src/styles/components/_icons.scss */\n.i-pinterest:before {\n  content: \"\\f231\"; }\n\n/* line 153, src/styles/components/_icons.scss */\n.i-whatsapp:before {\n  content: \"\\f232\"; }\n\n/* line 156, src/styles/components/_icons.scss */\n.i-snapchat:before {\n  content: \"\\f2ac\"; }\n\n/* line 2, src/styles/components/_animated.scss */\n.animated {\n  animation-duration: 1s;\n  animation-fill-mode: both; }\n  /* line 6, src/styles/components/_animated.scss */\n  .animated.infinite {\n    animation-iteration-count: infinite; }\n\n/* line 12, src/styles/components/_animated.scss */\n.bounceIn {\n  animation-name: bounceIn; }\n\n/* line 13, src/styles/components/_animated.scss */\n.bounceInDown {\n  animation-name: bounceInDown; }\n\n/* line 14, src/styles/components/_animated.scss */\n.pulse {\n  animation-name: pulse; }\n\n/* line 15, src/styles/components/_animated.scss */\n.slideInUp {\n  animation-name: slideInUp; }\n\n/* line 16, src/styles/components/_animated.scss */\n.slideOutDown {\n  animation-name: slideOutDown; }\n\n@keyframes bounceIn {\n  0%,\n  20%,\n  40%,\n  60%,\n  80%,\n  100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3); }\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1); }\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9); }\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03); }\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97); }\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes bounceInDown {\n  0%,\n  60%,\n  75%,\n  90%,\n  100% {\n    animation-timing-function: cubic-bezier(215, 610, 355, 1); }\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0); }\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0); }\n  75% {\n    transform: translate3d(0, -10px, 0); }\n  90% {\n    transform: translate3d(0, 5px, 0); }\n  100% {\n    transform: none; } }\n\n@keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1); }\n  50% {\n    transform: scale3d(1.2, 1.2, 1.2); }\n  to {\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes scroll {\n  0% {\n    opacity: 0; }\n  10% {\n    opacity: 1;\n    transform: translateY(0); }\n  100% {\n    opacity: 0;\n    transform: translateY(10px); } }\n\n@keyframes opacity {\n  0% {\n    opacity: 0; }\n  50% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg); }\n  to {\n    transform: rotate(360deg); } }\n\n@keyframes tooltip {\n  0% {\n    opacity: 0;\n    transform: translate(-50%, 6px); }\n  100% {\n    opacity: 1;\n    transform: translate(-50%, 0); } }\n\n@keyframes loading-bar {\n  0% {\n    transform: translateX(-100%); }\n  40% {\n    transform: translateX(0); }\n  60% {\n    transform: translateX(0); }\n  100% {\n    transform: translateX(100%); } }\n\n@keyframes arrow-move-right {\n  0% {\n    opacity: 0; }\n  10% {\n    transform: translateX(-100%);\n    opacity: 0; }\n  100% {\n    transform: translateX(0);\n    opacity: 1; } }\n\n@keyframes arrow-move-left {\n  0% {\n    opacity: 0; }\n  10% {\n    transform: translateX(100%);\n    opacity: 0; }\n  100% {\n    transform: translateX(0);\n    opacity: 1; } }\n\n@keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible; }\n  to {\n    transform: translate3d(0, 0, 0); } }\n\n@keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0); }\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0); } }\n\n/* line 4, src/styles/layouts/_header.scss */\n.header-logo,\n.menu--toggle,\n.search-toggle {\n  z-index: 15; }\n\n/* line 10, src/styles/layouts/_header.scss */\n.header {\n  box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n  padding: 0 16px;\n  position: sticky;\n  top: 0;\n  transition: all 0.4s ease-in-out;\n  z-index: 10; }\n  /* line 18, src/styles/layouts/_header.scss */\n  .header-wrap {\n    height: 50px; }\n  /* line 20, src/styles/layouts/_header.scss */\n  .header-logo {\n    color: #fff !important;\n    height: 30px; }\n    /* line 24, src/styles/layouts/_header.scss */\n    .header-logo img {\n      max-height: 100%; }\n\n/* line 29, src/styles/layouts/_header.scss */\n.not-logo .header-logo {\n  height: auto !important; }\n\n/* line 32, src/styles/layouts/_header.scss */\n.header-line {\n  height: 50px;\n  border-right: 1px solid rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  margin-right: 10px; }\n\n/* line 41, src/styles/layouts/_header.scss */\n.follow-more {\n  transition: width .4s ease;\n  overflow: hidden;\n  width: 0; }\n\n/* line 48, src/styles/layouts/_header.scss */\nbody.is-showFollowMore .follow-more {\n  width: auto; }\n\n/* line 49, src/styles/layouts/_header.scss */\nbody.is-showFollowMore .follow-toggle {\n  color: var(--header-color-hover); }\n\n/* line 50, src/styles/layouts/_header.scss */\nbody.is-showFollowMore .follow-toggle::before {\n  content: \"\\e5cd\"; }\n\n/* line 56, src/styles/layouts/_header.scss */\n.nav {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  position: relative;\n  overflow: hidden; }\n  /* line 62, src/styles/layouts/_header.scss */\n  .nav ul {\n    display: flex;\n    margin-right: 20px;\n    overflow: hidden;\n    white-space: nowrap; }\n\n/* line 70, src/styles/layouts/_header.scss */\n.header-left a,\n.nav ul li a {\n  border-radius: 3px;\n  color: var(--header-color);\n  display: inline-block;\n  font-weight: 600;\n  line-height: 30px;\n  padding: 0 8px;\n  text-align: center;\n  text-transform: uppercase;\n  vertical-align: middle; }\n  /* line 82, src/styles/layouts/_header.scss */\n  .header-left a.active, .header-left a:hover,\n  .nav ul li a.active,\n  .nav ul li a:hover {\n    color: var(--header-color-hover); }\n\n/* line 89, src/styles/layouts/_header.scss */\n.menu--toggle {\n  height: 48px;\n  position: relative;\n  transition: transform .4s;\n  width: 48px; }\n  /* line 95, src/styles/layouts/_header.scss */\n  .menu--toggle span {\n    background-color: var(--header-color);\n    display: block;\n    height: 2px;\n    left: 14px;\n    margin-top: -1px;\n    position: absolute;\n    top: 50%;\n    transition: .4s;\n    width: 20px; }\n    /* line 106, src/styles/layouts/_header.scss */\n    .menu--toggle span:first-child {\n      transform: translate(0, -6px); }\n    /* line 107, src/styles/layouts/_header.scss */\n    .menu--toggle span:last-child {\n      transform: translate(0, 6px); }\n\n@media only screen and (max-width: 766px) {\n  /* line 115, src/styles/layouts/_header.scss */\n  .header-left {\n    flex-grow: 1 !important; }\n  /* line 116, src/styles/layouts/_header.scss */\n  .header-logo span {\n    font-size: 24px; }\n  /* line 119, src/styles/layouts/_header.scss */\n  body.is-showNavMob {\n    overflow: hidden; }\n    /* line 122, src/styles/layouts/_header.scss */\n    body.is-showNavMob .sideNav {\n      transform: translateX(0); }\n    /* line 124, src/styles/layouts/_header.scss */\n    body.is-showNavMob .menu--toggle {\n      border: 0;\n      transform: rotate(90deg); }\n      /* line 128, src/styles/layouts/_header.scss */\n      body.is-showNavMob .menu--toggle span:first-child {\n        transform: rotate(45deg) translate(0, 0); }\n      /* line 129, src/styles/layouts/_header.scss */\n      body.is-showNavMob .menu--toggle span:nth-child(2) {\n        transform: scaleX(0); }\n      /* line 130, src/styles/layouts/_header.scss */\n      body.is-showNavMob .menu--toggle span:last-child {\n        transform: rotate(-45deg) translate(0, 0); }\n    /* line 133, src/styles/layouts/_header.scss */\n    body.is-showNavMob .header .button-search--toggle {\n      display: none; }\n    /* line 134, src/styles/layouts/_header.scss */\n    body.is-showNavMob .main, body.is-showNavMob .footer {\n      transform: translateX(-25%) !important; } }\n\n/* line 4, src/styles/layouts/_footer.scss */\n.footer {\n  color: #888; }\n  /* line 7, src/styles/layouts/_footer.scss */\n  .footer a {\n    color: var(--footer-color-link); }\n    /* line 9, src/styles/layouts/_footer.scss */\n    .footer a:hover {\n      color: #fff; }\n  /* line 12, src/styles/layouts/_footer.scss */\n  .footer-links {\n    padding: 3em 0 2.5em;\n    background-color: #131313; }\n  /* line 17, src/styles/layouts/_footer.scss */\n  .footer .follow > a {\n    background: #333;\n    border-radius: 50%;\n    color: inherit;\n    display: inline-block;\n    height: 40px;\n    line-height: 40px;\n    margin: 0 5px 8px;\n    text-align: center;\n    width: 40px; }\n    /* line 28, src/styles/layouts/_footer.scss */\n    .footer .follow > a:hover {\n      background: transparent;\n      box-shadow: inset 0 0 0 2px #333; }\n  /* line 34, src/styles/layouts/_footer.scss */\n  .footer-copy {\n    padding: 3em 0;\n    background-color: #000; }\n\n/* line 41, src/styles/layouts/_footer.scss */\n.footer-menu li {\n  display: inline-block;\n  line-height: 24px;\n  margin: 0 8px;\n  /* stylelint-disable-next-line */ }\n  /* line 47, src/styles/layouts/_footer.scss */\n  .footer-menu li a {\n    color: #888; }\n\n/* line 3, src/styles/layouts/_homepage.scss */\n.cover {\n  padding: 4px; }\n  /* line 6, src/styles/layouts/_homepage.scss */\n  .cover-story {\n    overflow: hidden;\n    height: 250px;\n    width: 100%; }\n    /* line 11, src/styles/layouts/_homepage.scss */\n    .cover-story:hover .cover-header {\n      background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%); }\n    /* line 13, src/styles/layouts/_homepage.scss */\n    .cover-story.firts {\n      height: 80vh; }\n  /* line 16, src/styles/layouts/_homepage.scss */\n  .cover-img, .cover-link {\n    bottom: 4px;\n    left: 4px;\n    right: 4px;\n    top: 4px; }\n  /* line 25, src/styles/layouts/_homepage.scss */\n  .cover-header {\n    bottom: 4px;\n    left: 4px;\n    right: 4px;\n    padding: 50px 3.846153846% 20px;\n    background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%); }\n\n/* line 36, src/styles/layouts/_homepage.scss */\n.hm-cover {\n  padding: 30px 0;\n  min-height: 100vh; }\n  /* line 40, src/styles/layouts/_homepage.scss */\n  .hm-cover-title {\n    font-size: 2.5rem;\n    font-weight: 900;\n    line-height: 1; }\n  /* line 46, src/styles/layouts/_homepage.scss */\n  .hm-cover-des {\n    max-width: 600px;\n    font-size: 1.25rem; }\n\n/* line 52, src/styles/layouts/_homepage.scss */\n.hm-subscribe {\n  background-color: transparent;\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #fff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  padding: 15px 10px;\n  transition: all .3s;\n  width: 100%; }\n  /* line 67, src/styles/layouts/_homepage.scss */\n  .hm-subscribe:hover {\n    box-shadow: inset 0 0 0 2px #fff; }\n\n/* line 72, src/styles/layouts/_homepage.scss */\n.hm-down {\n  animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100; }\n  /* line 83, src/styles/layouts/_homepage.scss */\n  .hm-down svg {\n    display: block;\n    fill: currentcolor;\n    height: auto;\n    width: 100%; }\n\n@media only screen and (min-width: 766px) {\n  /* line 94, src/styles/layouts/_homepage.scss */\n  .cover {\n    height: 70vh; }\n    /* line 97, src/styles/layouts/_homepage.scss */\n    .cover-story {\n      height: 50%;\n      width: 33.33333%; }\n      /* line 101, src/styles/layouts/_homepage.scss */\n      .cover-story.firts {\n        height: 100%;\n        width: 66.66666%; }\n        /* line 105, src/styles/layouts/_homepage.scss */\n        .cover-story.firts .cover-title {\n          font-size: 2.5rem; }\n  /* line 111, src/styles/layouts/_homepage.scss */\n  .hm-cover-title {\n    font-size: 3.5rem; } }\n\n/* line 6, src/styles/layouts/_post.scss */\n.post-title {\n  color: #000;\n  line-height: 1.2;\n  font-weight: 900;\n  max-width: 1000px; }\n\n/* line 13, src/styles/layouts/_post.scss */\n.post-excerpt {\n  color: #555;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-weight: 300;\n  letter-spacing: -.012em;\n  line-height: 1.6; }\n\n/* line 22, src/styles/layouts/_post.scss */\n.post-author-social {\n  vertical-align: middle;\n  margin-left: 2px;\n  padding: 0 3px; }\n\n/* line 28, src/styles/layouts/_post.scss */\n.post-image {\n  margin-top: 30px; }\n\n/* line 33, src/styles/layouts/_post.scss */\n.avatar-image {\n  display: inline-block;\n  vertical-align: middle; }\n  /* line 39, src/styles/layouts/_post.scss */\n  .avatar-image--smaller {\n    width: 50px;\n    height: 50px; }\n\n/* line 48, src/styles/layouts/_post.scss */\n.post-body a:not(.button):not(.button--circle):not(.prev-next-link) {\n  text-decoration: none;\n  position: relative;\n  transition: all 250ms;\n  box-shadow: inset 0 -3px 0 var(--post-color-link); }\n  /* line 54, src/styles/layouts/_post.scss */\n  .post-body a:not(.button):not(.button--circle):not(.prev-next-link):hover {\n    box-shadow: inset 0 -1rem 0 var(--post-color-link); }\n\n/* line 59, src/styles/layouts/_post.scss */\n.post-body img {\n  display: block;\n  margin-left: auto;\n  margin-right: auto; }\n\n/* line 65, src/styles/layouts/_post.scss */\n.post-body h1, .post-body h2, .post-body h3, .post-body h4, .post-body h5, .post-body h6 {\n  margin-top: 30px;\n  font-weight: 900;\n  font-style: normal;\n  color: #000;\n  letter-spacing: -.02em;\n  line-height: 1.2; }\n\n/* line 74, src/styles/layouts/_post.scss */\n.post-body h2 {\n  margin-top: 35px; }\n\n/* line 76, src/styles/layouts/_post.scss */\n.post-body p {\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-size: 1.125rem;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin-top: 25px; }\n\n/* line 85, src/styles/layouts/_post.scss */\n.post-body ul,\n.post-body ol {\n  counter-reset: post;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-size: 1.125rem;\n  margin-top: 20px; }\n  /* line 92, src/styles/layouts/_post.scss */\n  .post-body ul li,\n  .post-body ol li {\n    letter-spacing: -.003em;\n    margin-bottom: 14px;\n    margin-left: 30px; }\n    /* line 97, src/styles/layouts/_post.scss */\n    .post-body ul li::before,\n    .post-body ol li::before {\n      box-sizing: border-box;\n      display: inline-block;\n      margin-left: -78px;\n      position: absolute;\n      text-align: right;\n      width: 78px; }\n\n/* line 108, src/styles/layouts/_post.scss */\n.post-body ul li::before {\n  content: '\\2022';\n  font-size: 16.8px;\n  padding-right: 15px;\n  padding-top: 3px; }\n\n/* line 115, src/styles/layouts/_post.scss */\n.post-body ol li::before {\n  content: counter(post) \".\";\n  counter-increment: post;\n  padding-right: 12px; }\n\n/* line 143, src/styles/layouts/_post.scss */\n.post-body-wrap {\n  display: flex;\n  flex-direction: column;\n  align-items: center; }\n  /* line 150, src/styles/layouts/_post.scss */\n  .post-body-wrap h1, .post-body-wrap h2, .post-body-wrap h3, .post-body-wrap h4, .post-body-wrap h5, .post-body-wrap h6, .post-body-wrap p,\n  .post-body-wrap ol, .post-body-wrap ul, .post-body-wrap hr, .post-body-wrap pre, .post-body-wrap dl, .post-body-wrap blockquote,\n  .post-body-wrap .post-tags, .post-body-wrap .prev-next, .post-body-wrap .mob-share, .post-body-wrap .kg-embed-card {\n    min-width: 100%; }\n  /* line 156, src/styles/layouts/_post.scss */\n  .post-body-wrap > ul {\n    margin-top: 35px; }\n  /* line 158, src/styles/layouts/_post.scss */\n  .post-body-wrap > iframe,\n  .post-body-wrap > img,\n  .post-body-wrap .kg-image-card,\n  .post-body-wrap .kg-card,\n  .post-body-wrap .kg-gallery-card,\n  .post-body-wrap .kg-embed-card {\n    margin-top: 30px !important; }\n\n/* line 170, src/styles/layouts/_post.scss */\n.sharePost {\n  left: 0;\n  width: 40px;\n  position: absolute !important;\n  transition: all .4s;\n  top: 30px;\n  /* stylelint-disable-next-line */ }\n  /* line 178, src/styles/layouts/_post.scss */\n  .sharePost a {\n    color: #fff;\n    margin: 8px 0 0;\n    display: block; }\n  /* line 184, src/styles/layouts/_post.scss */\n  .sharePost .i-chat {\n    background-color: #fff;\n    border: 2px solid #bbb;\n    color: #bbb; }\n\n/* line 194, src/styles/layouts/_post.scss */\n.post-related {\n  padding: 40px 0; }\n\n/* stylelint-disable-next-line */\n/* line 201, src/styles/layouts/_post.scss */\n.mob-share .mapache-share {\n  height: 40px;\n  color: #fff;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  box-shadow: none !important; }\n\n/* line 210, src/styles/layouts/_post.scss */\n.mob-share .share-title {\n  font-size: 14px;\n  margin-left: 10px; }\n\n/* stylelint-disable-next-line */\n/* line 220, src/styles/layouts/_post.scss */\n.prev-next-span {\n  color: var(--composite-color);\n  font-weight: 700;\n  font-size: 13px; }\n  /* line 225, src/styles/layouts/_post.scss */\n  .prev-next-span i {\n    display: inline-flex;\n    transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1); }\n\n/* line 231, src/styles/layouts/_post.scss */\n.prev-next-title {\n  margin: 0 !important;\n  font-size: 16px;\n  height: 2em;\n  overflow: hidden;\n  line-height: 1 !important;\n  text-overflow: ellipsis !important;\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  display: -webkit-box !important; }\n\n/* line 251, src/styles/layouts/_post.scss */\n.prev-next-link:hover .arrow-right {\n  animation: arrow-move-right 0.5s ease-in-out forwards; }\n\n/* line 252, src/styles/layouts/_post.scss */\n.prev-next-link:hover .arrow-left {\n  animation: arrow-move-left 0.5s ease-in-out forwards; }\n\n/* line 258, src/styles/layouts/_post.scss */\n.cc-image {\n  max-height: 100vh;\n  min-height: 600px;\n  background-color: #000; }\n  /* line 263, src/styles/layouts/_post.scss */\n  .cc-image-header {\n    right: 0;\n    bottom: 10%;\n    left: 0; }\n  /* line 269, src/styles/layouts/_post.scss */\n  .cc-image-figure img {\n    opacity: .4;\n    object-fit: cover;\n    width: 100%; }\n  /* line 275, src/styles/layouts/_post.scss */\n  .cc-image .post-header {\n    max-width: 700px; }\n  /* line 276, src/styles/layouts/_post.scss */\n  .cc-image .post-title, .cc-image .post-excerpt {\n    color: #fff; }\n\n/* line 282, src/styles/layouts/_post.scss */\n.cc-video {\n  background-color: #000;\n  padding: 40px 0 30px; }\n  /* line 286, src/styles/layouts/_post.scss */\n  .cc-video .post-excerpt {\n    color: #aaa;\n    font-size: 1rem; }\n  /* line 287, src/styles/layouts/_post.scss */\n  .cc-video .post-title {\n    color: #fff;\n    font-size: 1.8rem; }\n  /* line 288, src/styles/layouts/_post.scss */\n  .cc-video .kg-embed-card, .cc-video .video-responsive {\n    margin-top: 0; }\n  /* line 307, src/styles/layouts/_post.scss */\n  .cc-video .media-type {\n    height: 34px !important;\n    width: 34px !important; }\n\n/* line 315, src/styles/layouts/_post.scss */\nbody.is-article .main {\n  margin-bottom: 0; }\n\n/* line 316, src/styles/layouts/_post.scss */\nbody.share-margin .sharePost {\n  top: -60px; }\n\n/* line 317, src/styles/layouts/_post.scss */\nbody.show-category .post-primary-tag {\n  display: block !important; }\n\n/* line 320, src/styles/layouts/_post.scss */\nbody.is-article-single .post-body-wrap {\n  margin-left: 0 !important; }\n\n/* line 321, src/styles/layouts/_post.scss */\nbody.is-article-single .sharePost {\n  left: -100px; }\n\n/* line 322, src/styles/layouts/_post.scss */\nbody.is-article-single .kg-width-full .kg-image {\n  max-width: 100vw; }\n\n/* line 323, src/styles/layouts/_post.scss */\nbody.is-article-single .kg-width-wide .kg-image {\n  max-width: 1040px; }\n\n@media only screen and (max-width: 766px) {\n  /* line 329, src/styles/layouts/_post.scss */\n  .post-body-wrap q {\n    font-size: 20px !important;\n    letter-spacing: -.008em !important;\n    line-height: 1.4 !important; }\n  /* line 341, src/styles/layouts/_post.scss */\n  .post-body-wrap .kg-image-card img {\n    max-width: 100%; }\n  /* line 343, src/styles/layouts/_post.scss */\n  .post-body-wrap ol, .post-body-wrap ul, .post-body-wrap p {\n    font-size: 1rem;\n    letter-spacing: -.004em;\n    line-height: 1.58; }\n  /* line 349, src/styles/layouts/_post.scss */\n  .post-body-wrap iframe {\n    width: 100% !important; }\n  /* line 353, src/styles/layouts/_post.scss */\n  .post-related {\n    padding-left: 8px;\n    padding-right: 8px; }\n  /* line 359, src/styles/layouts/_post.scss */\n  .cc-image-figure {\n    width: 200%;\n    max-width: 200%;\n    margin: 0 auto 0 -50%; }\n  /* line 365, src/styles/layouts/_post.scss */\n  .cc-image-header {\n    bottom: 24px; }\n  /* line 366, src/styles/layouts/_post.scss */\n  .cc-image .post-excerpt {\n    font-size: 18px; }\n  /* line 369, src/styles/layouts/_post.scss */\n  .cc-video {\n    padding: 20px 0; }\n    /* line 372, src/styles/layouts/_post.scss */\n    .cc-video-embed {\n      margin-left: -16px;\n      margin-right: -15px; }\n    /* line 377, src/styles/layouts/_post.scss */\n    .cc-video .post-header {\n      margin-top: 10px; } }\n\n@media only screen and (max-width: 1000px) {\n  /* line 383, src/styles/layouts/_post.scss */\n  body.is-article .col-left {\n    max-width: 100%; } }\n\n@media only screen and (min-width: 766px) {\n  /* line 390, src/styles/layouts/_post.scss */\n  .cc-image .post-title {\n    font-size: 3.2rem; } }\n\n@media only screen and (min-width: 1000px) {\n  /* line 394, src/styles/layouts/_post.scss */\n  body.is-article .post-body-wrap {\n    margin-left: 70px; }\n  /* line 398, src/styles/layouts/_post.scss */\n  body.is-video .post-author,\n  body.is-image .post-author {\n    margin-left: 70px; } }\n\n@media only screen and (min-width: 1230px) {\n  /* line 405, src/styles/layouts/_post.scss */\n  body.has-video-fixed .cc-video-embed {\n    bottom: 20px;\n    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n    height: 203px;\n    padding-bottom: 0;\n    position: fixed;\n    right: 20px;\n    width: 360px;\n    z-index: 8; }\n  /* line 416, src/styles/layouts/_post.scss */\n  body.has-video-fixed .cc-video-close {\n    background: #000;\n    border-radius: 50%;\n    color: #fff;\n    cursor: pointer;\n    display: block !important;\n    font-size: 14px;\n    height: 24px;\n    left: -10px;\n    line-height: 1;\n    padding-top: 5px;\n    position: absolute;\n    text-align: center;\n    top: -10px;\n    width: 24px;\n    z-index: 5; }\n  /* line 434, src/styles/layouts/_post.scss */\n  body.has-video-fixed .cc-video-cont {\n    height: 465px; }\n  /* line 436, src/styles/layouts/_post.scss */\n  body.has-video-fixed .cc-image-header {\n    bottom: 20%; } }\n\n/* line 3, src/styles/layouts/_story.scss */\n.hr-list {\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.0785);\n  margin: 20px 0 0; }\n\n/* line 10, src/styles/layouts/_story.scss */\n.story-feed .story-feed-content:first-child .hr-list:first-child {\n  margin-top: 5px; }\n\n/* line 15, src/styles/layouts/_story.scss */\n.media-type {\n  background-color: rgba(0, 0, 0, 0.7);\n  color: #fff;\n  height: 45px;\n  left: 15px;\n  top: 15px;\n  width: 45px;\n  opacity: .9; }\n\n/* line 33, src/styles/layouts/_story.scss */\n.image-hover {\n  transition: transform .7s;\n  transform: translateZ(0); }\n\n/* line 39, src/styles/layouts/_story.scss */\n.not-image {\n  background: url(\"../images/not-image.png\");\n  background-repeat: repeat; }\n\n/* line 45, src/styles/layouts/_story.scss */\n.flow-meta {\n  color: rgba(0, 0, 0, 0.54);\n  font-weight: 700;\n  margin-bottom: 10px; }\n\n/* line 52, src/styles/layouts/_story.scss */\n.point {\n  margin: 0 5px; }\n\n/* line 58, src/styles/layouts/_story.scss */\n.story-image {\n  flex: 0 0 44%;\n  height: 235px;\n  margin-right: 30px; }\n  /* line 63, src/styles/layouts/_story.scss */\n  .story-image:hover .image-hover {\n    transform: scale(1.03); }\n\n/* line 66, src/styles/layouts/_story.scss */\n.story-lower {\n  flex-grow: 1; }\n\n/* line 68, src/styles/layouts/_story.scss */\n.story-excerpt {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-weight: 300;\n  line-height: 1.5; }\n\n/* line 75, src/styles/layouts/_story.scss */\n.story-category {\n  color: rgba(0, 0, 0, 0.84); }\n\n/* line 77, src/styles/layouts/_story.scss */\n.story h2 a:hover {\n  opacity: .6; }\n\n/* line 90, src/styles/layouts/_story.scss */\n.story.story--grid {\n  flex-direction: column;\n  margin-bottom: 30px; }\n  /* line 94, src/styles/layouts/_story.scss */\n  .story.story--grid .story-image {\n    flex: 0 0 auto;\n    margin-right: 0;\n    height: 220px; }\n  /* line 100, src/styles/layouts/_story.scss */\n  .story.story--grid .media-type {\n    font-size: 24px;\n    height: 40px;\n    width: 40px; }\n\n/* line 107, src/styles/layouts/_story.scss */\n.cover-category {\n  color: var(--story-cover-category-color); }\n\n/* line 112, src/styles/layouts/_story.scss */\n.story-card {\n  /* stylelint-disable-next-line */ }\n  /* line 113, src/styles/layouts/_story.scss */\n  .story-card .story {\n    margin-top: 0 !important; }\n  /* line 124, src/styles/layouts/_story.scss */\n  .story-card .story-image {\n    border: 1px solid rgba(0, 0, 0, 0.04);\n    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n    border-radius: 2px;\n    background-color: #fff !important;\n    transition: all 150ms ease-in-out;\n    overflow: hidden;\n    height: 200px !important; }\n    /* line 136, src/styles/layouts/_story.scss */\n    .story-card .story-image .story-img-bg {\n      margin: 10px; }\n    /* line 138, src/styles/layouts/_story.scss */\n    .story-card .story-image:hover {\n      box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.1); }\n      /* line 141, src/styles/layouts/_story.scss */\n      .story-card .story-image:hover .story-img-bg {\n        transform: none; }\n  /* line 145, src/styles/layouts/_story.scss */\n  .story-card .story-lower {\n    display: none !important; }\n  /* line 147, src/styles/layouts/_story.scss */\n  .story-card .story-body {\n    padding: 15px 5px;\n    margin: 0 !important; }\n    /* line 151, src/styles/layouts/_story.scss */\n    .story-card .story-body h2 {\n      -webkit-box-orient: vertical !important;\n      -webkit-line-clamp: 2 !important;\n      color: rgba(0, 0, 0, 0.9);\n      display: -webkit-box !important;\n      max-height: 2.4em !important;\n      overflow: hidden;\n      text-overflow: ellipsis !important;\n      margin: 0; }\n\n/* line 168, src/styles/layouts/_story.scss */\n.story-small {\n  /* stylelint-disable-next-line */ }\n  /* line 169, src/styles/layouts/_story.scss */\n  .story-small-img {\n    height: 170px;\n    background-color: #000 !important; }\n  /* line 175, src/styles/layouts/_story.scss */\n  .story-small .image-hover {\n    transition: all .25s; }\n  /* line 177, src/styles/layouts/_story.scss */\n  .story-small h3 {\n    color: #fff;\n    max-height: 2.5em;\n    overflow: hidden;\n    -webkit-box-orient: vertical !important;\n    -webkit-line-clamp: 2 !important;\n    text-overflow: ellipsis !important;\n    display: -webkit-box !important;\n    transition: all .25s; }\n  /* line 189, src/styles/layouts/_story.scss */\n  .story-small:hover .image-hover {\n    opacity: .8; }\n  /* line 190, src/styles/layouts/_story.scss */\n  .story-small:hover h3 {\n    opacity: .6; }\n\n@media only screen and (min-width: 766px) {\n  /* line 200, src/styles/layouts/_story.scss */\n  .story.story--grid .story-lower {\n    max-height: 2.6em;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    display: -webkit-box;\n    line-height: 1.1;\n    text-overflow: ellipsis; } }\n\n@media only screen and (max-width: 766px) {\n  /* line 215, src/styles/layouts/_story.scss */\n  .cover--firts .cover-story {\n    height: 500px; }\n  /* line 218, src/styles/layouts/_story.scss */\n  .story {\n    flex-direction: column;\n    margin-top: 20px; }\n    /* line 222, src/styles/layouts/_story.scss */\n    .story-image {\n      flex: 0 0 auto;\n      margin-right: 0; }\n    /* line 223, src/styles/layouts/_story.scss */\n    .story-body {\n      margin-top: 10px; } }\n\n/* line 4, src/styles/layouts/_author.scss */\n.author {\n  background-color: #fff;\n  color: rgba(0, 0, 0, 0.6);\n  min-height: 350px; }\n  /* line 9, src/styles/layouts/_author.scss */\n  .author-avatar {\n    height: 80px;\n    width: 80px; }\n  /* line 14, src/styles/layouts/_author.scss */\n  .author-meta span {\n    display: inline-block;\n    font-size: 17px;\n    font-style: italic;\n    margin: 0 25px 16px 0;\n    opacity: .8;\n    word-wrap: break-word; }\n  /* line 23, src/styles/layouts/_author.scss */\n  .author-name {\n    color: rgba(0, 0, 0, 0.8); }\n  /* line 24, src/styles/layouts/_author.scss */\n  .author-bio {\n    max-width: 600px; }\n  /* line 25, src/styles/layouts/_author.scss */\n  .author-meta a:hover {\n    opacity: .8 !important; }\n\n/* line 28, src/styles/layouts/_author.scss */\n.cover-opacity {\n  opacity: .5; }\n\n/* line 30, src/styles/layouts/_author.scss */\n.author.has--image {\n  color: #fff !important;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33); }\n  /* line 34, src/styles/layouts/_author.scss */\n  .author.has--image a,\n  .author.has--image .author-name {\n    color: #fff; }\n  /* line 37, src/styles/layouts/_author.scss */\n  .author.has--image .author-follow a {\n    border: 2px solid;\n    border-color: rgba(255, 255, 255, 0.5) !important;\n    font-size: 16px; }\n  /* line 43, src/styles/layouts/_author.scss */\n  .author.has--image .u-accentColor--iconNormal {\n    fill: #fff; }\n\n@media only screen and (max-width: 766px) {\n  /* line 47, src/styles/layouts/_author.scss */\n  .author-meta span {\n    display: block; }\n  /* line 48, src/styles/layouts/_author.scss */\n  .author-header {\n    display: block; }\n  /* line 49, src/styles/layouts/_author.scss */\n  .author-avatar {\n    margin: 0 auto 20px; } }\n\n@media only screen and (min-width: 766px) {\n  /* line 53, src/styles/layouts/_author.scss */\n  body.has-cover .author {\n    min-height: 600px; } }\n\n/* line 4, src/styles/layouts/_search.scss */\n.search {\n  background-color: #fff;\n  height: 100%;\n  height: 100vh;\n  left: 0;\n  padding: 0 16px;\n  right: 0;\n  top: 0;\n  transform: translateY(-100%);\n  transition: transform .3s ease;\n  z-index: 9; }\n  /* line 16, src/styles/layouts/_search.scss */\n  .search-form {\n    max-width: 680px;\n    margin-top: 80px; }\n    /* line 20, src/styles/layouts/_search.scss */\n    .search-form::before {\n      background: #eee;\n      bottom: 0;\n      content: '';\n      display: block;\n      height: 2px;\n      left: 0;\n      position: absolute;\n      width: 100%;\n      z-index: 1; }\n    /* line 32, src/styles/layouts/_search.scss */\n    .search-form input {\n      border: none;\n      display: block;\n      line-height: 40px;\n      padding-bottom: 8px; }\n      /* line 38, src/styles/layouts/_search.scss */\n      .search-form input:focus {\n        outline: 0; }\n  /* line 43, src/styles/layouts/_search.scss */\n  .search-results {\n    max-height: calc(100% - 100px);\n    max-width: 680px;\n    overflow: auto; }\n    /* line 48, src/styles/layouts/_search.scss */\n    .search-results a {\n      padding: 10px 20px;\n      background: rgba(0, 0, 0, 0.05);\n      color: rgba(0, 0, 0, 0.7);\n      text-decoration: none;\n      display: block;\n      border-bottom: 1px solid #fff;\n      transition: all 0.3s ease-in-out; }\n      /* line 57, src/styles/layouts/_search.scss */\n      .search-results a:hover {\n        background: rgba(0, 0, 0, 0.1); }\n\n/* line 62, src/styles/layouts/_search.scss */\n.button-search--close {\n  position: absolute !important;\n  right: 50px;\n  top: 20px; }\n\n/* line 68, src/styles/layouts/_search.scss */\nbody.is-search {\n  overflow: hidden; }\n  /* line 71, src/styles/layouts/_search.scss */\n  body.is-search .search {\n    transform: translateY(0); }\n  /* line 72, src/styles/layouts/_search.scss */\n  body.is-search .search-toggle {\n    background-color: rgba(255, 255, 255, 0.25); }\n\n/* line 2, src/styles/layouts/_sidebar.scss */\n.sidebar-title {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785); }\n  /* line 5, src/styles/layouts/_sidebar.scss */\n  .sidebar-title span {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.54);\n    padding-bottom: 10px;\n    margin-bottom: -1px; }\n\n/* line 14, src/styles/layouts/_sidebar.scss */\n.sidebar-border {\n  border-left: 3px solid var(--composite-color);\n  color: rgba(0, 0, 0, 0.2);\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  padding: 0 10px;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888; }\n\n/* line 24, src/styles/layouts/_sidebar.scss */\n.sidebar-post {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.0785);\n  min-height: 60px; }\n  /* line 30, src/styles/layouts/_sidebar.scss */\n  .sidebar-post:hover .sidebar-border {\n    background-color: #e5eff5; }\n  /* line 32, src/styles/layouts/_sidebar.scss */\n  .sidebar-post:nth-child(3n) .sidebar-border {\n    border-color: #f59e00; }\n  /* line 33, src/styles/layouts/_sidebar.scss */\n  .sidebar-post:nth-child(3n+2) .sidebar-border {\n    border-color: #26a8ed; }\n\n/* line 2, src/styles/layouts/_sidenav.scss */\n.sideNav {\n  color: rgba(0, 0, 0, 0.8);\n  height: 100vh;\n  padding: 50px 20px;\n  position: fixed !important;\n  transform: translateX(100%);\n  transition: 0.4s;\n  will-change: transform;\n  z-index: 8; }\n  /* line 13, src/styles/layouts/_sidenav.scss */\n  .sideNav-menu a {\n    padding: 10px 20px; }\n  /* line 15, src/styles/layouts/_sidenav.scss */\n  .sideNav-wrap {\n    background: #eee;\n    overflow: auto;\n    padding: 20px 0;\n    top: 50px; }\n  /* line 22, src/styles/layouts/_sidenav.scss */\n  .sideNav-section {\n    border-bottom: solid 1px #ddd;\n    margin-bottom: 8px;\n    padding-bottom: 8px; }\n  /* line 28, src/styles/layouts/_sidenav.scss */\n  .sideNav-follow {\n    border-top: 1px solid #ddd;\n    margin: 15px 0; }\n    /* line 32, src/styles/layouts/_sidenav.scss */\n    .sideNav-follow a {\n      color: #fff;\n      display: inline-block;\n      height: 36px;\n      line-height: 20px;\n      margin: 0 5px 5px 0;\n      min-width: 36px;\n      padding: 8px;\n      text-align: center;\n      vertical-align: middle; }\n\n/* line 17, src/styles/layouts/helper.scss */\n.has-cover-padding {\n  padding-top: 100px; }\n\n/* line 20, src/styles/layouts/helper.scss */\nbody.has-cover .header {\n  position: fixed; }\n\n/* line 23, src/styles/layouts/helper.scss */\nbody.has-cover.is-transparency:not(.is-search) .header {\n  background: rgba(0, 0, 0, 0.05);\n  box-shadow: none;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1); }\n\n/* line 29, src/styles/layouts/helper.scss */\nbody.has-cover.is-transparency:not(.is-search) .header-left a, body.has-cover.is-transparency:not(.is-search) .nav ul li a {\n  color: #fff; }\n\n/* line 30, src/styles/layouts/helper.scss */\nbody.has-cover.is-transparency:not(.is-search) .menu--toggle span {\n  background-color: #fff; }\n\n/* line 5, src/styles/layouts/subscribe.scss */\n.subscribe {\n  min-height: 80vh !important;\n  height: 100%; }\n  /* line 10, src/styles/layouts/subscribe.scss */\n  .subscribe-card {\n    background-color: #D7EFEE;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n    border-radius: 4px;\n    width: 900px;\n    height: 550px;\n    padding: 50px;\n    margin: 5px; }\n  /* line 20, src/styles/layouts/subscribe.scss */\n  .subscribe form {\n    max-width: 300px; }\n  /* line 24, src/styles/layouts/subscribe.scss */\n  .subscribe-form {\n    height: 100%; }\n  /* line 28, src/styles/layouts/subscribe.scss */\n  .subscribe-input {\n    background: 0 0;\n    border: 0;\n    border-bottom: 1px solid #cc5454;\n    border-radius: 0;\n    padding: 7px 5px;\n    height: 45px;\n    outline: 0;\n    font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; }\n    /* line 38, src/styles/layouts/subscribe.scss */\n    .subscribe-input::placeholder {\n      color: #cc5454; }\n  /* line 43, src/styles/layouts/subscribe.scss */\n  .subscribe .main-error {\n    color: #cc5454;\n    font-size: 16px;\n    margin-top: 15px; }\n\n/* line 65, src/styles/layouts/subscribe.scss */\n.subscribe-success .subscribe-card {\n  background-color: #E8F3EC; }\n\n@media only screen and (max-width: 766px) {\n  /* line 71, src/styles/layouts/subscribe.scss */\n  .subscribe-card {\n    height: auto;\n    width: auto; } }\n\n/* line 4, src/styles/layouts/_comments.scss */\n.post-comments {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 15;\n  width: 100%;\n  left: 0;\n  overflow-y: auto;\n  background: #fff;\n  border-left: 1px solid #f1f1f1;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  font-size: 14px;\n  transform: translateX(100%);\n  transition: .2s;\n  will-change: transform; }\n  /* line 21, src/styles/layouts/_comments.scss */\n  .post-comments-header {\n    padding: 20px;\n    border-bottom: 1px solid #ddd; }\n    /* line 25, src/styles/layouts/_comments.scss */\n    .post-comments-header .toggle-comments {\n      font-size: 24px;\n      line-height: 1;\n      position: absolute;\n      left: 0;\n      top: 0;\n      padding: 17px;\n      cursor: pointer; }\n  /* line 36, src/styles/layouts/_comments.scss */\n  .post-comments-overlay {\n    position: fixed !important;\n    background-color: rgba(0, 0, 0, 0.2);\n    display: none;\n    transition: background-color .4s linear;\n    z-index: 8;\n    cursor: pointer; }\n\n/* line 46, src/styles/layouts/_comments.scss */\nbody.has-comments {\n  overflow: hidden; }\n  /* line 49, src/styles/layouts/_comments.scss */\n  body.has-comments .post-comments-overlay {\n    display: block; }\n  /* line 50, src/styles/layouts/_comments.scss */\n  body.has-comments .post-comments {\n    transform: translateX(0); }\n\n@media only screen and (min-width: 766px) {\n  /* line 54, src/styles/layouts/_comments.scss */\n  .post-comments {\n    left: auto;\n    width: 500px;\n    top: 50px;\n    z-index: 9; }\n    /* line 60, src/styles/layouts/_comments.scss */\n    .post-comments-wrap {\n      padding: 20px; } }\n\n/* line 1, src/styles/common/_modal.scss */\n.modal {\n  opacity: 0;\n  transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  z-index: 100;\n  visibility: hidden; }\n  /* line 8, src/styles/common/_modal.scss */\n  .modal-shader {\n    background-color: rgba(255, 255, 255, 0.65); }\n  /* line 11, src/styles/common/_modal.scss */\n  .modal-close {\n    color: rgba(0, 0, 0, 0.54);\n    position: absolute;\n    top: 0;\n    right: 0;\n    line-height: 1;\n    padding: 15px; }\n  /* line 21, src/styles/common/_modal.scss */\n  .modal-inner {\n    background-color: #E8F3EC;\n    border-radius: 4px;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n    max-width: 700px;\n    height: 100%;\n    max-height: 400px;\n    opacity: 0;\n    padding: 72px 5% 56px;\n    transform: scale(0.6);\n    transition: transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n    width: 100%; }\n  /* line 36, src/styles/common/_modal.scss */\n  .modal .form-group {\n    width: 76%;\n    margin: 0 auto 30px; }\n  /* line 41, src/styles/common/_modal.scss */\n  .modal .form--input {\n    display: inline-block;\n    margin-bottom: 10px;\n    vertical-align: top;\n    height: 40px;\n    line-height: 40px;\n    background-color: transparent;\n    padding: 17px 6px;\n    border-bottom: 1px solid rgba(0, 0, 0, 0.15);\n    width: 100%; }\n\n/* line 71, src/styles/common/_modal.scss */\nbody.has-modal {\n  overflow: hidden; }\n  /* line 74, src/styles/common/_modal.scss */\n  body.has-modal .modal {\n    opacity: 1;\n    visibility: visible;\n    transition: opacity .3s ease; }\n    /* line 79, src/styles/common/_modal.scss */\n    body.has-modal .modal-inner {\n      opacity: 1;\n      transform: scale(1);\n      transition: transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96); }\n\n/* line 4, src/styles/common/_widget.scss */\n.instagram-hover {\n  background-color: rgba(0, 0, 0, 0.3);\n  opacity: 0; }\n\n/* line 10, src/styles/common/_widget.scss */\n.instagram-img {\n  height: 264px; }\n  /* line 13, src/styles/common/_widget.scss */\n  .instagram-img:hover > .instagram-hover {\n    opacity: 1; }\n\n/* line 16, src/styles/common/_widget.scss */\n.instagram-name {\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 3; }\n  /* line 22, src/styles/common/_widget.scss */\n  .instagram-name a {\n    background-color: #fff;\n    color: #000 !important;\n    font-size: 18px !important;\n    font-weight: 900 !important;\n    min-width: 200px;\n    padding-left: 10px !important;\n    padding-right: 10px !important;\n    text-align: center !important; }\n\n/* line 34, src/styles/common/_widget.scss */\n.instagram-col {\n  padding: 0 !important;\n  margin: 0 !important; }\n\n/* line 39, src/styles/common/_widget.scss */\n.instagram-wrap {\n  margin: 0 !important; }\n\n/* line 44, src/styles/common/_widget.scss */\n.witget-subscribe {\n  background: #fff;\n  border: 5px solid transparent;\n  padding: 28px 30px;\n  position: relative; }\n  /* line 50, src/styles/common/_widget.scss */\n  .witget-subscribe::before {\n    content: \"\";\n    border: 5px solid #f5f5f5;\n    box-shadow: inset 0 0 0 1px #d7d7d7;\n    box-sizing: border-box;\n    display: block;\n    height: calc(100% + 10px);\n    left: -5px;\n    pointer-events: none;\n    position: absolute;\n    top: -5px;\n    width: calc(100% + 10px);\n    z-index: 1; }\n  /* line 65, src/styles/common/_widget.scss */\n  .witget-subscribe input {\n    background: #fff;\n    border: 1px solid #e5e5e5;\n    color: rgba(0, 0, 0, 0.54);\n    height: 41px;\n    outline: 0;\n    padding: 0 16px;\n    width: 100%; }\n  /* line 75, src/styles/common/_widget.scss */\n  .witget-subscribe button {\n    background: var(--composite-color);\n    border-radius: 0;\n    width: 100%; }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdHlsZXMvbWFpbi5zY3NzIiwibm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzcyIsIm5vZGVfbW9kdWxlcy9wcmlzbWpzL3RoZW1lcy9wcmlzbS5jc3MiLCJub2RlX21vZHVsZXMvcHJpc21qcy9wbHVnaW5zL2xpbmUtbnVtYmVycy9wcmlzbS1saW5lLW51bWJlcnMuY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX3ZhcmlhYmxlcy5zY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX21peGlucy5zY3NzIiwic3JjL3N0eWxlcy9hdXRvbG9hZC9fem9vbS5zY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX2dsb2JhbC5zY3NzIiwic3JjL3N0eWxlcy9jb21wb25lbnRzL19ncmlkLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fdHlwb2dyYXBoeS5zY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX3V0aWxpdGllcy5zY3NzIiwic3JjL3N0eWxlcy9jb21wb25lbnRzL19mb3JtLnNjc3MiLCJzcmMvc3R5bGVzL2NvbXBvbmVudHMvX2ljb25zLnNjc3MiLCJzcmMvc3R5bGVzL2NvbXBvbmVudHMvX2FuaW1hdGVkLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX2hlYWRlci5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19mb290ZXIuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9faG9tZXBhZ2Uuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9fcG9zdC5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19zdG9yeS5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19hdXRob3Iuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9fc2VhcmNoLnNjc3MiLCJzcmMvc3R5bGVzL2xheW91dHMvX3NpZGViYXIuc2NzcyIsInNyYy9zdHlsZXMvbGF5b3V0cy9fc2lkZW5hdi5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL2hlbHBlci5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL3N1YnNjcmliZS5zY3NzIiwic3JjL3N0eWxlcy9sYXlvdXRzL19jb21tZW50cy5zY3NzIiwic3JjL3N0eWxlcy9jb21tb24vX21vZGFsLnNjc3MiLCJzcmMvc3R5bGVzL2NvbW1vbi9fd2lkZ2V0LnNjc3MiXSwic291cmNlc0NvbnRlbnQiOlsiQGNoYXJzZXQgXCJVVEYtOFwiO1xyXG5cclxuQGltcG9ydCBcIn5ub3JtYWxpemUuY3NzL25vcm1hbGl6ZVwiO1xyXG5AaW1wb3J0IFwifnByaXNtanMvdGhlbWVzL3ByaXNtXCI7XHJcbkBpbXBvcnQgXCJ+cHJpc21qcy9wbHVnaW5zL2xpbmUtbnVtYmVycy9wcmlzbS1saW5lLW51bWJlcnNcIjtcclxuXHJcbi8vIE1peGlucyAmIFZhcmlhYmxlc1xyXG5AaW1wb3J0IFwiY29tbW9uL3ZhcmlhYmxlc1wiO1xyXG5AaW1wb3J0IFwiY29tbW9uL21peGluc1wiO1xyXG5cclxuLy8gSW1wb3J0IG5wbSBkZXBlbmRlbmNpZXNcclxuLy8gem9vbSBpbWdcclxuQGltcG9ydCBcImF1dG9sb2FkL3pvb21cIjtcclxuXHJcbi8vIGNvbW1vblxyXG5AaW1wb3J0IFwiY29tbW9uL2dsb2JhbFwiO1xyXG5AaW1wb3J0IFwiY29tcG9uZW50cy9ncmlkXCI7XHJcbkBpbXBvcnQgXCJjb21tb24vdHlwb2dyYXBoeVwiO1xyXG5AaW1wb3J0IFwiY29tbW9uL3V0aWxpdGllc1wiO1xyXG5cclxuLy8gY29tcG9uZW50c1xyXG5AaW1wb3J0IFwiY29tcG9uZW50cy9mb3JtXCI7XHJcbkBpbXBvcnQgXCJjb21wb25lbnRzL2ljb25zXCI7XHJcbkBpbXBvcnQgXCJjb21wb25lbnRzL2FuaW1hdGVkXCI7XHJcblxyXG4vL2xheW91dHNcclxuQGltcG9ydCBcImxheW91dHMvaGVhZGVyXCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL2Zvb3RlclwiO1xyXG5AaW1wb3J0IFwibGF5b3V0cy9ob21lcGFnZVwiO1xyXG5AaW1wb3J0IFwibGF5b3V0cy9wb3N0XCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL3N0b3J5XCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL2F1dGhvclwiO1xyXG5AaW1wb3J0IFwibGF5b3V0cy9zZWFyY2hcIjtcclxuQGltcG9ydCBcImxheW91dHMvc2lkZWJhclwiO1xyXG5AaW1wb3J0IFwibGF5b3V0cy9zaWRlbmF2XCI7XHJcbkBpbXBvcnQgXCJsYXlvdXRzL2hlbHBlclwiO1xyXG5AaW1wb3J0IFwibGF5b3V0cy9zdWJzY3JpYmVcIjtcclxuQGltcG9ydCBcImxheW91dHMvY29tbWVudHNcIjtcclxuQGltcG9ydCBcImNvbW1vbi9tb2RhbFwiO1xyXG5AaW1wb3J0IFwiY29tbW9uL3dpZGdldFwiO1xyXG4iLCIvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXG5cbi8qIERvY3VtZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxuICovXG5cbmh0bWwge1xuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cbn1cblxuLyogU2VjdGlvbnNcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbmJvZHkge1xuICBtYXJnaW46IDA7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBgbWFpbmAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXG4gKi9cblxubWFpbiB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIGBoMWAgZWxlbWVudHMgd2l0aGluIGBzZWN0aW9uYCBhbmRcbiAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXG4gKi9cblxuaDEge1xuICBmb250LXNpemU6IDJlbTtcbiAgbWFyZ2luOiAwLjY3ZW0gMDtcbn1cblxuLyogR3JvdXBpbmcgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXG4gKi9cblxuaHIge1xuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xuICBoZWlnaHQ6IDA7IC8qIDEgKi9cbiAgb3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnByZSB7XG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuYSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG4vKipcbiAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxuICovXG5cbmFiYnJbdGl0bGVdIHtcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxuICovXG5cbmIsXG5zdHJvbmcge1xuICBmb250LXdlaWdodDogYm9sZGVyO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuY29kZSxcbmtiZCxcbnNhbXAge1xuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zbWFsbCB7XG4gIGZvbnQtc2l6ZTogODAlO1xufVxuXG4vKipcbiAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxuICogYWxsIGJyb3dzZXJzLlxuICovXG5cbnN1YixcbnN1cCB7XG4gIGZvbnQtc2l6ZTogNzUlO1xuICBsaW5lLWhlaWdodDogMDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbnN1YiB7XG4gIGJvdHRvbTogLTAuMjVlbTtcbn1cblxuc3VwIHtcbiAgdG9wOiAtMC41ZW07XG59XG5cbi8qIEVtYmVkZGVkIGNvbnRlbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cbiAqL1xuXG5pbWcge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG59XG5cbi8qIEZvcm1zXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxuICovXG5cbmJ1dHRvbixcbmlucHV0LFxub3B0Z3JvdXAsXG5zZWxlY3QsXG50ZXh0YXJlYSB7XG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuICBtYXJnaW46IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQgeyAvKiAxICovXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxuICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbixcbnNlbGVjdCB7IC8qIDEgKi9cbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5bdHlwZT1cImJ1dHRvblwiXSxcblt0eXBlPVwicmVzZXRcIl0sXG5bdHlwZT1cInN1Ym1pdFwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJidXR0b25cIl06Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cInJlc2V0XCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJzdWJtaXRcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi8qKlxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxuICovXG5cbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcblt0eXBlPVwiYnV0dG9uXCJdOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJyZXNldFwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwic3VibWl0XCJdOi1tb3otZm9jdXNyaW5nIHtcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG5maWVsZHNldCB7XG4gIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxuICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBgZmllbGRzZXRgIGVsZW1lbnRzIGluIElFLlxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxuICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxubGVnZW5kIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xuICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xuICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cbiAgcGFkZGluZzogMDsgLyogMyAqL1xuICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cbiAqL1xuXG5wcm9ncmVzcyB7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cbiAqL1xuXG50ZXh0YXJlYSB7XG4gIG92ZXJmbG93OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxuICovXG5cblt0eXBlPVwiY2hlY2tib3hcIl0sXG5bdHlwZT1cInJhZGlvXCJdIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuICBwYWRkaW5nOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxuICovXG5cblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuICBoZWlnaHQ6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXG4gIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXG4gKi9cblxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXG4gIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cbn1cblxuLyogSW50ZXJhY3RpdmVcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxuICovXG5cbmRldGFpbHMge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdW1tYXJ5IHtcbiAgZGlzcGxheTogbGlzdC1pdGVtO1xufVxuXG4vKiBNaXNjXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cbiAqL1xuXG50ZW1wbGF0ZSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXG4gKi9cblxuW2hpZGRlbl0ge1xuICBkaXNwbGF5OiBub25lO1xufVxuIiwiLyoqXG4gKiBwcmlzbS5qcyBkZWZhdWx0IHRoZW1lIGZvciBKYXZhU2NyaXB0LCBDU1MgYW5kIEhUTUxcbiAqIEJhc2VkIG9uIGRhYmJsZXQgKGh0dHA6Ly9kYWJibGV0LmNvbSlcbiAqIEBhdXRob3IgTGVhIFZlcm91XG4gKi9cblxuY29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0sXG5wcmVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIHtcblx0Y29sb3I6IGJsYWNrO1xuXHRiYWNrZ3JvdW5kOiBub25lO1xuXHR0ZXh0LXNoYWRvdzogMCAxcHggd2hpdGU7XG5cdGZvbnQtZmFtaWx5OiBDb25zb2xhcywgTW9uYWNvLCAnQW5kYWxlIE1vbm8nLCAnVWJ1bnR1IE1vbm8nLCBtb25vc3BhY2U7XG5cdHRleHQtYWxpZ246IGxlZnQ7XG5cdHdoaXRlLXNwYWNlOiBwcmU7XG5cdHdvcmQtc3BhY2luZzogbm9ybWFsO1xuXHR3b3JkLWJyZWFrOiBub3JtYWw7XG5cdHdvcmQtd3JhcDogbm9ybWFsO1xuXHRsaW5lLWhlaWdodDogMS41O1xuXG5cdC1tb3otdGFiLXNpemU6IDQ7XG5cdC1vLXRhYi1zaXplOiA0O1xuXHR0YWItc2l6ZTogNDtcblxuXHQtd2Via2l0LWh5cGhlbnM6IG5vbmU7XG5cdC1tb3otaHlwaGVuczogbm9uZTtcblx0LW1zLWh5cGhlbnM6IG5vbmU7XG5cdGh5cGhlbnM6IG5vbmU7XG59XG5cbnByZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl06Oi1tb3otc2VsZWN0aW9uLCBwcmVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIDo6LW1vei1zZWxlY3Rpb24sXG5jb2RlW2NsYXNzKj1cImxhbmd1YWdlLVwiXTo6LW1vei1zZWxlY3Rpb24sIGNvZGVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIDo6LW1vei1zZWxlY3Rpb24ge1xuXHR0ZXh0LXNoYWRvdzogbm9uZTtcblx0YmFja2dyb3VuZDogI2IzZDRmYztcbn1cblxucHJlW2NsYXNzKj1cImxhbmd1YWdlLVwiXTo6c2VsZWN0aW9uLCBwcmVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIDo6c2VsZWN0aW9uLFxuY29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl06OnNlbGVjdGlvbiwgY29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0gOjpzZWxlY3Rpb24ge1xuXHR0ZXh0LXNoYWRvdzogbm9uZTtcblx0YmFja2dyb3VuZDogI2IzZDRmYztcbn1cblxuQG1lZGlhIHByaW50IHtcblx0Y29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0sXG5cdHByZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0ge1xuXHRcdHRleHQtc2hhZG93OiBub25lO1xuXHR9XG59XG5cbi8qIENvZGUgYmxvY2tzICovXG5wcmVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIHtcblx0cGFkZGluZzogMWVtO1xuXHRtYXJnaW46IC41ZW0gMDtcblx0b3ZlcmZsb3c6IGF1dG87XG59XG5cbjpub3QocHJlKSA+IGNvZGVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdLFxucHJlW2NsYXNzKj1cImxhbmd1YWdlLVwiXSB7XG5cdGJhY2tncm91bmQ6ICNmNWYyZjA7XG59XG5cbi8qIElubGluZSBjb2RlICovXG46bm90KHByZSkgPiBjb2RlW2NsYXNzKj1cImxhbmd1YWdlLVwiXSB7XG5cdHBhZGRpbmc6IC4xZW07XG5cdGJvcmRlci1yYWRpdXM6IC4zZW07XG5cdHdoaXRlLXNwYWNlOiBub3JtYWw7XG59XG5cbi50b2tlbi5jb21tZW50LFxuLnRva2VuLnByb2xvZyxcbi50b2tlbi5kb2N0eXBlLFxuLnRva2VuLmNkYXRhIHtcblx0Y29sb3I6IHNsYXRlZ3JheTtcbn1cblxuLnRva2VuLnB1bmN0dWF0aW9uIHtcblx0Y29sb3I6ICM5OTk7XG59XG5cbi5uYW1lc3BhY2Uge1xuXHRvcGFjaXR5OiAuNztcbn1cblxuLnRva2VuLnByb3BlcnR5LFxuLnRva2VuLnRhZyxcbi50b2tlbi5ib29sZWFuLFxuLnRva2VuLm51bWJlcixcbi50b2tlbi5jb25zdGFudCxcbi50b2tlbi5zeW1ib2wsXG4udG9rZW4uZGVsZXRlZCB7XG5cdGNvbG9yOiAjOTA1O1xufVxuXG4udG9rZW4uc2VsZWN0b3IsXG4udG9rZW4uYXR0ci1uYW1lLFxuLnRva2VuLnN0cmluZyxcbi50b2tlbi5jaGFyLFxuLnRva2VuLmJ1aWx0aW4sXG4udG9rZW4uaW5zZXJ0ZWQge1xuXHRjb2xvcjogIzY5MDtcbn1cblxuLnRva2VuLm9wZXJhdG9yLFxuLnRva2VuLmVudGl0eSxcbi50b2tlbi51cmwsXG4ubGFuZ3VhZ2UtY3NzIC50b2tlbi5zdHJpbmcsXG4uc3R5bGUgLnRva2VuLnN0cmluZyB7XG5cdGNvbG9yOiAjOWE2ZTNhO1xuXHRiYWNrZ3JvdW5kOiBoc2xhKDAsIDAlLCAxMDAlLCAuNSk7XG59XG5cbi50b2tlbi5hdHJ1bGUsXG4udG9rZW4uYXR0ci12YWx1ZSxcbi50b2tlbi5rZXl3b3JkIHtcblx0Y29sb3I6ICMwN2E7XG59XG5cbi50b2tlbi5mdW5jdGlvbixcbi50b2tlbi5jbGFzcy1uYW1lIHtcblx0Y29sb3I6ICNERDRBNjg7XG59XG5cbi50b2tlbi5yZWdleCxcbi50b2tlbi5pbXBvcnRhbnQsXG4udG9rZW4udmFyaWFibGUge1xuXHRjb2xvcjogI2U5MDtcbn1cblxuLnRva2VuLmltcG9ydGFudCxcbi50b2tlbi5ib2xkIHtcblx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG59XG4udG9rZW4uaXRhbGljIHtcblx0Zm9udC1zdHlsZTogaXRhbGljO1xufVxuXG4udG9rZW4uZW50aXR5IHtcblx0Y3Vyc29yOiBoZWxwO1xufVxuIiwicHJlW2NsYXNzKj1cImxhbmd1YWdlLVwiXS5saW5lLW51bWJlcnMge1xuXHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdHBhZGRpbmctbGVmdDogMy44ZW07XG5cdGNvdW50ZXItcmVzZXQ6IGxpbmVudW1iZXI7XG59XG5cbnByZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0ubGluZS1udW1iZXJzID4gY29kZSB7XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0d2hpdGUtc3BhY2U6IGluaGVyaXQ7XG59XG5cbi5saW5lLW51bWJlcnMgLmxpbmUtbnVtYmVycy1yb3dzIHtcblx0cG9zaXRpb246IGFic29sdXRlO1xuXHRwb2ludGVyLWV2ZW50czogbm9uZTtcblx0dG9wOiAwO1xuXHRmb250LXNpemU6IDEwMCU7XG5cdGxlZnQ6IC0zLjhlbTtcblx0d2lkdGg6IDNlbTsgLyogd29ya3MgZm9yIGxpbmUtbnVtYmVycyBiZWxvdyAxMDAwIGxpbmVzICovXG5cdGxldHRlci1zcGFjaW5nOiAtMXB4O1xuXHRib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjOTk5O1xuXG5cdC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG5cdC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG5cdC1tcy11c2VyLXNlbGVjdDogbm9uZTtcblx0dXNlci1zZWxlY3Q6IG5vbmU7XG5cbn1cblxuXHQubGluZS1udW1iZXJzLXJvd3MgPiBzcGFuIHtcblx0XHRwb2ludGVyLWV2ZW50czogbm9uZTtcblx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRjb3VudGVyLWluY3JlbWVudDogbGluZW51bWJlcjtcblx0fVxuXG5cdFx0LmxpbmUtbnVtYmVycy1yb3dzID4gc3BhbjpiZWZvcmUge1xuXHRcdFx0Y29udGVudDogY291bnRlcihsaW5lbnVtYmVyKTtcblx0XHRcdGNvbG9yOiAjOTk5O1xuXHRcdFx0ZGlzcGxheTogYmxvY2s7XG5cdFx0XHRwYWRkaW5nLXJpZ2h0OiAwLjhlbTtcblx0XHRcdHRleHQtYWxpZ246IHJpZ2h0O1xuXHRcdH1cbiIsIi8vIDEuIENvbG9yc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuJHByaW1hcnktY29sb3I6ICMxQzk5NjM7XG4vLyAkcHJpbWFyeS1jb2xvcjogIzAwQTAzNDtcbiRwcmltYXJ5LWNvbG9yLWhvdmVyOiAjMDBhYjZiO1xuXG4vLyAkcHJpbWFyeS1jb2xvcjogIzMzNjY4YztcbiRwcmltYXJ5LWNvbG9yLWRhcms6ICAgIzE5NzZkMjtcblxuJHByaW1hcnktdGV4dC1jb2xvcjogICByZ2JhKDAsIDAsIDAsIC44NCk7XG5cbi8vICRwcmltYXJ5LWNvbG9yLWxpZ2h0OlxuLy8gJHByaW1hcnktY29sb3ItdGV4dDpcbi8vICRhY2NlbnQtY29sb3I6XG4vLyAkcHJpbWFyeS10ZXh0LWNvbG9yOlxuLy8gJHNlY29uZGFyeS10ZXh0LWNvbG9yOlxuLy8gJGRpdmlkZXItY29sb3I6XG5cbi8vIHNvY2lhbCBjb2xvcnNcbiRzb2NpYWwtY29sb3JzOiAoXG4gIGZhY2Vib29rOiAgICMzYjU5OTgsXG4gIHR3aXR0ZXI6ICAgICM1NWFjZWUsXG4gIGdvb2dsZTogICAgICNkZDRiMzksXG4gIGluc3RhZ3JhbTogICMzMDYwODgsXG4gIHlvdXR1YmU6ICAgICNlNTJkMjcsXG4gIGdpdGh1YjogICAgICM1NTUsXG4gIGxpbmtlZGluOiAgICMwMDdiYjYsXG4gIHNwb3RpZnk6ICAgICMyZWJkNTksXG4gIGNvZGVwZW46ICAgICMyMjIsXG4gIGJlaGFuY2U6ICAgICMxMzE0MTgsXG4gIGRyaWJiYmxlOiAgICNlYTRjODksXG4gIGZsaWNrcjogICAgICMwMDYzZGMsXG4gIHJlZGRpdDogICAgICNmZjQ1MDAsXG4gIHBvY2tldDogICAgICNmNTAwNTcsXG4gIHBpbnRlcmVzdDogICNiZDA4MWMsXG4gIHdoYXRzYXBwOiAgICM2NGQ0NDgsXG4gIHRlbGVncmFtOiAgICMwOGMsXG4gIGRpc2NvcmQ6ICM3Mjg5ZGEsXG4gIHJzczogICAgICAgICAgb3JhbmdlXG4pO1xuXG4vLyAyLiBGb250c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuJHByaW1hcnktZm9udDogICAgJ1JvYm90bycsV2hpdG5leSBTU20gQSxXaGl0bmV5IFNTbSBCLC1hcHBsZS1zeXN0ZW0sQmxpbmtNYWNTeXN0ZW1Gb250LFNlZ29lIFVJLE94eWdlbixVYnVudHUsQ2FudGFyZWxsLE9wZW4gU2FucyxIZWx2ZXRpY2EgTmV1ZSxzYW5zLXNlcmlmOyAvLyBmb250IGRlZmF1bHQgcGFnZSBhbmQgdGl0bGVzXG4kc2VjdW5kYXJ5LWZvbnQ6ICAnTWVycml3ZWF0aGVyJyxNZXJjdXJ5IFNTbSBBLE1lcmN1cnkgU1NtIEIsR2VvcmdpYSxzZXJpZjsgLy8gZm9udCBmb3IgY29udGVudFxuJGNvZGUtZm9udDogICAgICAgJ0ZpcmEgTW9ubycsIG1vbm9zcGFjZTsgLy8gZm9udCBmb3IgY29kZSBhbmQgcHJlXG5cbiRmb250LXNpemUtYmFzZTogMTZweDtcblxuLy8gMy4gVHlwb2dyYXBoeVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuJGZvbnQtc2l6ZS1yb290OiAgMTZweDtcblxuJGZvbnQtc2l6ZS1oMTogICAgMnJlbTtcbiRmb250LXNpemUtaDI6ICAgIDEuODc1cmVtO1xuJGZvbnQtc2l6ZS1oMzogICAgMS42cmVtO1xuJGZvbnQtc2l6ZS1oNDogICAgMS40cmVtO1xuJGZvbnQtc2l6ZS1oNTogICAgMS4ycmVtO1xuJGZvbnQtc2l6ZS1oNjogICAgMXJlbTtcblxuJGhlYWRpbmdzLWZvbnQtZmFtaWx5OiAgICAgJHByaW1hcnktZm9udDtcbiRoZWFkaW5ncy1mb250LXdlaWdodDogICAgIDYwMDtcbiRoZWFkaW5ncy1saW5lLWhlaWdodDogICAgIDEuMTtcbiRoZWFkaW5ncy1jb2xvcjogICAgICAgICAgIGluaGVyaXQ7XG5cbi8vIENvbnRhaW5lclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuJGNvbnRhaW5lci1zbTogICAgICAgICAgICAgNTc2cHg7XG4kY29udGFpbmVyLW1kOiAgICAgICAgICAgICA3NjhweDtcbiRjb250YWluZXItbGc6ICAgICAgICAgICAgIDk3MHB4O1xuJGNvbnRhaW5lci14bDogICAgICAgICAgICAgMTIwMHB4O1xuXG4vLyBIZWFkZXJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4kaGVhZGVyLWNvbG9yOiAjQkJGMUI5O1xuJGhlYWRlci1jb2xvci1ob3ZlcjogI0VFRkZFQTtcbiRoZWFkZXItaGVpZ2h0OiA1MHB4O1xuXG4vLyAzLiBNZWRpYSBRdWVyeSBSYW5nZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiRudW0tY29sczogMTI7XG5cbi8vIDMuIE1lZGlhIFF1ZXJ5IFJhbmdlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuJHNtOiAgICAgICAgICAgIDY0MHB4O1xuJG1kOiAgICAgICAgICAgIDc2NnB4O1xuJGxnOiAgICAgICAgICAgIDEwMDBweDtcbiR4bDogICAgICAgICAgICAxMjMwcHg7XG5cbiRzbS1hbmQtdXA6ICAgICBcIm9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoIDogI3skc219KVwiO1xuJG1kLWFuZC11cDogICAgIFwib25seSBzY3JlZW4gYW5kIChtaW4td2lkdGggOiAjeyRtZH0pXCI7XG4kbGctYW5kLXVwOiAgICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aCA6ICN7JGxnfSlcIjtcbiR4bC1hbmQtdXA6ICAgICBcIm9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoIDogI3skeGx9KVwiO1xuXG4kc20tYW5kLWRvd246ICAgXCJvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aCA6ICN7JHNtfSlcIjtcbiRtZC1hbmQtZG93bjogICBcIm9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoIDogI3skbWR9KVwiO1xuJGxnLWFuZC1kb3duOiAgIFwib25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGggOiAjeyRsZ30pXCI7XG5cbi8vIENvZGUgQ29sb3JcbiRjb2RlLWJnLWNvbG9yOiAgICNmN2Y3Zjc7XG4kZm9udC1zaXplLWNvZGU6ICAxNXB4O1xuJGNvZGUtY29sb3I6ICAgICAgI2M3MjU0ZTtcbiRwcmUtY29kZS1jb2xvcjogICMzNzQ3NGY7XG5cbi8vIGljb25zXG5cbiRpLWNvZGU6IFwiXFxmMTIxXCI7XG4kaS13YXJuaW5nOiBcIlxcZTAwMlwiO1xuJGktY2hlY2s6IFwiXFxlODZjXCI7XG4kaS1zdGFyOiBcIlxcZTkwN1wiO1xuIiwiJWxpbmsge1xyXG4gIGNvbG9yOiBpbmhlcml0O1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbn1cclxuXHJcbiVsaW5rLS1hY2NlbnQge1xyXG4gIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTtcclxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgLy8gJjpob3ZlciB7IGNvbG9yOiAkcHJpbWFyeS1jb2xvci1ob3ZlcjsgfVxyXG59XHJcblxyXG4lY29udGVudC1hYnNvbHV0ZS1ib3R0b20ge1xyXG4gIGJvdHRvbTogMDtcclxuICBsZWZ0OiAwO1xyXG4gIG1hcmdpbjogMzBweDtcclxuICBtYXgtd2lkdGg6IDYwMHB4O1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICB6LWluZGV4OiAyO1xyXG59XHJcblxyXG4ldS1hYnNvbHV0ZTAge1xyXG4gIGJvdHRvbTogMDtcclxuICBsZWZ0OiAwO1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICByaWdodDogMDtcclxuICB0b3A6IDA7XHJcbn1cclxuXHJcbiV1LXRleHQtY29sb3ItZGFya2VyIHtcclxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuOCkgIWltcG9ydGFudDtcclxuICBmaWxsOiByZ2JhKDAsIDAsIDAsIC44KSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4lZm9udHMtaWNvbnMge1xyXG4gIC8qIHVzZSAhaW1wb3J0YW50IHRvIHByZXZlbnQgaXNzdWVzIHdpdGggYnJvd3NlciBleHRlbnNpb25zIHRoYXQgY2hhbmdlIGZvbnRzICovXHJcbiAgZm9udC1mYW1pbHk6ICdtYXBhY2hlJyAhaW1wb3J0YW50OyAvKiBzdHlsZWxpbnQtZGlzYWJsZS1saW5lICovXHJcbiAgc3BlYWs6IG5vbmU7XHJcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xyXG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XHJcbiAgZm9udC12YXJpYW50OiBub3JtYWw7XHJcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XHJcbiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7XHJcblxyXG4gIC8qIEJldHRlciBGb250IFJlbmRlcmluZyA9PT09PT09PT09PSAqL1xyXG4gIC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xyXG4gIC1tb3otb3N4LWZvbnQtc21vb3RoaW5nOiBncmF5c2NhbGU7XHJcbn1cclxuIiwiLy8gc3R5bGVsaW50LWRpc2FibGVcclxuaW1nW2RhdGEtYWN0aW9uPVwiem9vbVwiXSB7XHJcbiAgY3Vyc29yOiB6b29tLWluO1xyXG59XHJcbi56b29tLWltZyxcclxuLnpvb20taW1nLXdyYXAge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB6LWluZGV4OiA2NjY7XHJcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBhbGwgMzAwbXM7XHJcbiAgICAgICAtby10cmFuc2l0aW9uOiBhbGwgMzAwbXM7XHJcbiAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMzAwbXM7XHJcbn1cclxuaW1nLnpvb20taW1nIHtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgY3Vyc29yOiAtd2Via2l0LXpvb20tb3V0O1xyXG4gIGN1cnNvcjogLW1vei16b29tLW91dDtcclxufVxyXG4uem9vbS1vdmVybGF5IHtcclxuICB6LWluZGV4OiA0MjA7XHJcbiAgYmFja2dyb3VuZDogI2ZmZjtcclxuICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgdG9wOiAwO1xyXG4gIGxlZnQ6IDA7XHJcbiAgcmlnaHQ6IDA7XHJcbiAgYm90dG9tOiAwO1xyXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gIGZpbHRlcjogXCJhbHBoYShvcGFjaXR5PTApXCI7XHJcbiAgb3BhY2l0eTogMDtcclxuICAtd2Via2l0LXRyYW5zaXRpb246ICAgICAgb3BhY2l0eSAzMDBtcztcclxuICAgICAgIC1vLXRyYW5zaXRpb246ICAgICAgb3BhY2l0eSAzMDBtcztcclxuICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgb3BhY2l0eSAzMDBtcztcclxufVxyXG4uem9vbS1vdmVybGF5LW9wZW4gLnpvb20tb3ZlcmxheSB7XHJcbiAgZmlsdGVyOiBcImFscGhhKG9wYWNpdHk9MTAwKVwiO1xyXG4gIG9wYWNpdHk6IDE7XHJcbn1cclxuLnpvb20tb3ZlcmxheS1vcGVuLFxyXG4uem9vbS1vdmVybGF5LXRyYW5zaXRpb25pbmcge1xyXG4gIGN1cnNvcjogZGVmYXVsdDtcclxufVxyXG4iLCI6cm9vdCB7XHJcbiAgLS1ibGFjazogIzAwMDtcclxuICAtLXdoaXRlOiAjZmZmO1xyXG4gIC0tcHJpbWFyeS1jb2xvcjogIzFDOTk2MztcclxuICAtLXNlY29uZGFyeS1jb2xvcjogIzJhZDg4ZDtcclxuICAtLWhlYWRlci1jb2xvcjogI0JCRjFCOTtcclxuICAtLWhlYWRlci1jb2xvci1ob3ZlcjogI0VFRkZFQTtcclxuICAtLXBvc3QtY29sb3ItbGluazogIzJhZDg4ZDtcclxuICAtLXN0b3J5LWNvdmVyLWNhdGVnb3J5LWNvbG9yOiAjMmFkODhkO1xyXG4gIC0tY29tcG9zaXRlLWNvbG9yOiAjQ0MxMTZFO1xyXG4gIC0tZm9vdGVyLWNvbG9yLWxpbms6ICMyYWQ4OGQ7XHJcbiAgLS1tZWRpYS10eXBlLWNvbG9yOiAjMmFkODhkO1xyXG59XHJcblxyXG4qLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG5hIHtcclxuICBjb2xvcjogaW5oZXJpdDtcclxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcblxyXG4gICY6YWN0aXZlLFxyXG4gICY6aG92ZXIge1xyXG4gICAgb3V0bGluZTogMDtcclxuICB9XHJcbn1cclxuXHJcbmJsb2NrcXVvdGUge1xyXG4gIGJvcmRlci1sZWZ0OiAzcHggc29saWQgIzAwMDtcclxuICBjb2xvcjogIzAwMDtcclxuICBmb250LWZhbWlseTogJHNlY3VuZGFyeS1mb250O1xyXG4gIGZvbnQtc2l6ZTogMS4xODc1cmVtO1xyXG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcclxuICBmb250LXdlaWdodDogNDAwO1xyXG4gIGxldHRlci1zcGFjaW5nOiAtLjAwM2VtO1xyXG4gIGxpbmUtaGVpZ2h0OiAxLjc7XHJcbiAgbWFyZ2luOiAzMHB4IDAgMCAtMTJweDtcclxuICBwYWRkaW5nLWJvdHRvbTogMnB4O1xyXG4gIHBhZGRpbmctbGVmdDogMjBweDtcclxuXHJcbiAgcDpmaXJzdC1vZi10eXBlIHsgbWFyZ2luLXRvcDogMCB9XHJcbn1cclxuXHJcbmJvZHkge1xyXG4gIGNvbG9yOiAkcHJpbWFyeS10ZXh0LWNvbG9yO1xyXG4gIGZvbnQtZmFtaWx5OiAkcHJpbWFyeS1mb250O1xyXG4gIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1iYXNlO1xyXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcclxuICBmb250LXdlaWdodDogNDAwO1xyXG4gIGxldHRlci1zcGFjaW5nOiAwO1xyXG4gIGxpbmUtaGVpZ2h0OiAxLjQ7XHJcbiAgbWFyZ2luOiAwIGF1dG87XHJcbiAgdGV4dC1yZW5kZXJpbmc6IG9wdGltaXplTGVnaWJpbGl0eTtcclxuICBvdmVyZmxvdy14OiBoaWRkZW47XHJcbn1cclxuXHJcbi8vRGVmYXVsdCBzdHlsZXNcclxuaHRtbCB7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICBmb250LXNpemU6ICRmb250LXNpemUtcm9vdDtcclxufVxyXG5cclxuZmlndXJlIHtcclxuICBtYXJnaW46IDA7XHJcbn1cclxuXHJcbmZpZ2NhcHRpb24ge1xyXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC42OCk7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbiAgZm9udC1mYW1pbHk6ICRzZWN1bmRhcnktZm9udDtcclxuICBmb250LWZlYXR1cmUtc2V0dGluZ3M6IFwibGlnYVwiIG9uLCBcImxudW1cIiBvbjtcclxuICBmb250LXNpemU6IDE0cHg7XHJcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xyXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XHJcbiAgbGVmdDogMDtcclxuICBsZXR0ZXItc3BhY2luZzogMDtcclxuICBsaW5lLWhlaWdodDogMS40O1xyXG4gIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgb3V0bGluZTogMDtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIHRvcDogMDtcclxuICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuLy8gQ29kZVxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5rYmQsIHNhbXAsIGNvZGUge1xyXG4gIGJhY2tncm91bmQ6ICRjb2RlLWJnLWNvbG9yO1xyXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICBjb2xvcjogJGNvZGUtY29sb3I7XHJcbiAgZm9udC1mYW1pbHk6ICRjb2RlLWZvbnQgIWltcG9ydGFudDtcclxuICBmb250LXNpemU6ICRmb250LXNpemUtY29kZTtcclxuICBwYWRkaW5nOiA0cHggNnB4O1xyXG4gIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcclxufVxyXG5cclxucHJlIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAkY29kZS1iZy1jb2xvciAhaW1wb3J0YW50O1xyXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICBmb250LWZhbWlseTogJGNvZGUtZm9udCAhaW1wb3J0YW50O1xyXG4gIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1jb2RlO1xyXG4gIG1hcmdpbi10b3A6IDMwcHggIWltcG9ydGFudDtcclxuICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICBwYWRkaW5nOiAxcmVtO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB3b3JkLXdyYXA6IG5vcm1hbDtcclxuXHJcbiAgY29kZSB7XHJcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICAgIGNvbG9yOiAkcHJlLWNvZGUtY29sb3I7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgdGV4dC1zaGFkb3c6IDAgMXB4ICNmZmY7XHJcbiAgfVxyXG59XHJcblxyXG5jb2RlW2NsYXNzKj1sYW5ndWFnZS1dLFxyXG5wcmVbY2xhc3MqPWxhbmd1YWdlLV0ge1xyXG4gIGNvbG9yOiAkcHJlLWNvZGUtY29sb3I7XHJcbiAgbGluZS1oZWlnaHQ6IDEuNDtcclxuXHJcbiAgLnRva2VuLmNvbW1lbnQgeyBvcGFjaXR5OiAuODsgfVxyXG5cclxuICAmLmxpbmUtbnVtYmVycyB7XHJcbiAgICBwYWRkaW5nLWxlZnQ6IDU4cHg7XHJcblxyXG4gICAgJjo6YmVmb3JlIHtcclxuICAgICAgY29udGVudDogXCJcIjtcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICBsZWZ0OiAwO1xyXG4gICAgICB0b3A6IDA7XHJcbiAgICAgIGJhY2tncm91bmQ6ICNGMEVERUU7XHJcbiAgICAgIHdpZHRoOiA0MHB4O1xyXG4gICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAubGluZS1udW1iZXJzLXJvd3Mge1xyXG4gICAgYm9yZGVyLXJpZ2h0OiBub25lO1xyXG4gICAgdG9wOiAtM3B4O1xyXG4gICAgbGVmdDogLTU4cHg7XHJcblxyXG4gICAgJiA+IHNwYW46OmJlZm9yZSB7XHJcbiAgICAgIHBhZGRpbmctcmlnaHQ6IDA7XHJcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgb3BhY2l0eTogLjg7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBoclxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5ocjpub3QoLmhyLWxpc3QpOm5vdCgucG9zdC1mb290ZXItaHIpIHtcclxuICBib3JkZXI6IDA7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbiAgbWFyZ2luOiA1MHB4IGF1dG87XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG5cclxuICAmOjpiZWZvcmUge1xyXG4gICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjYpO1xyXG4gICAgY29udGVudDogJy4uLic7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBmb250LWZhbWlseTogJHByaW1hcnktZm9udDtcclxuICAgIGZvbnQtc2l6ZTogMjhweDtcclxuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XHJcbiAgICBsZXR0ZXItc3BhY2luZzogLjZlbTtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHRvcDogLTI1cHg7XHJcbiAgfVxyXG59XHJcblxyXG4ucG9zdC1mb290ZXItaHIge1xyXG4gIGhlaWdodDogMXB4O1xyXG4gIG1hcmdpbjogMzJweCAwO1xyXG4gIGJvcmRlcjogMDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xyXG59XHJcblxyXG5pbWcge1xyXG4gIGhlaWdodDogYXV0bztcclxuICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcclxuICB3aWR0aDogYXV0bztcclxuXHJcbiAgJjpub3QoW3NyY10pIHtcclxuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcclxuICB9XHJcbn1cclxuXHJcbmkge1xyXG4gIC8vIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xyXG59XHJcblxyXG5pbnB1dCB7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIG91dGxpbmU6IDA7XHJcbn1cclxuXHJcbm9sLCB1bCB7XHJcbiAgbGlzdC1zdHlsZTogbm9uZTtcclxuICBsaXN0LXN0eWxlLWltYWdlOiBub25lO1xyXG4gIG1hcmdpbjogMDtcclxuICBwYWRkaW5nOiAwO1xyXG59XHJcblxyXG5tYXJrIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHJnYmEoMjE1LCAyNTMsIDIxMSwgMSksIHJnYmEoMjE1LCAyNTMsIDIxMSwgMSkpO1xyXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC44KTtcclxufVxyXG5cclxucSB7XHJcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjQ0KTtcclxuICBkaXNwbGF5OiBibG9jaztcclxuICBmb250LXNpemU6IDI4cHg7XHJcbiAgZm9udC1zdHlsZTogaXRhbGljO1xyXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XHJcbiAgbGV0dGVyLXNwYWNpbmc6IC0uMDE0ZW07XHJcbiAgbGluZS1oZWlnaHQ6IDEuNDg7XHJcbiAgcGFkZGluZy1sZWZ0OiA1MHB4O1xyXG4gIHBhZGRpbmctdG9wOiAxNXB4O1xyXG4gIHRleHQtYWxpZ246IGxlZnQ7XHJcblxyXG4gICY6OmJlZm9yZSwgJjo6YWZ0ZXIgeyBkaXNwbGF5OiBub25lOyB9XHJcbn1cclxuXHJcbnRhYmxlIHtcclxuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xyXG4gIGJvcmRlci1zcGFjaW5nOiAwO1xyXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYsIFwiQXBwbGUgQ29sb3IgRW1vamlcIiwgXCJTZWdvZSBVSSBFbW9qaVwiLCBcIlNlZ29lIFVJIFN5bWJvbFwiO1xyXG4gIGZvbnQtc2l6ZTogMXJlbTtcclxuICBsaW5lLWhlaWdodDogMS41O1xyXG4gIG1hcmdpbjogMjBweCAwIDA7XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gIG92ZXJmbG93LXg6IGF1dG87XHJcbiAgdmVydGljYWwtYWxpZ246IHRvcDtcclxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG4gIHdpZHRoOiBhdXRvO1xyXG4gIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcclxuXHJcbiAgdGgsXHJcbiAgdGQge1xyXG4gICAgcGFkZGluZzogNnB4IDEzcHg7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZGZlMmU1O1xyXG4gIH1cclxuXHJcbiAgdHI6bnRoLWNoaWxkKDJuKSB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjZmOGZhO1xyXG4gIH1cclxuXHJcbiAgdGgge1xyXG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMnB4O1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBMaW5rcyBjb2xvclxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4ubGluay0tYWNjZW50IHsgQGV4dGVuZCAlbGluay0tYWNjZW50OyB9XHJcblxyXG4ubGluayB7IEBleHRlbmQgJWxpbms7IH1cclxuXHJcbi5saW5rLS11bmRlcmxpbmUge1xyXG4gICY6YWN0aXZlLFxyXG4gICY6Zm9jdXMsXHJcbiAgJjpob3ZlciB7XHJcbiAgICAvLyBjb2xvcjogaW5oZXJpdDtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xyXG4gIH1cclxufVxyXG5cclxuLy8gQW5pbWF0aW9uIG1haW4gcGFnZSBhbmQgZm9vdGVyXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi5tYWluIHsgbWFyZ2luLWJvdHRvbTogNGVtOyBtaW4taGVpZ2h0OiA5MHZoIH1cclxuXHJcbi5tYWluLFxyXG4uZm9vdGVyIHsgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC41cyBlYXNlOyB9XHJcblxyXG4vLyB3YXJuaW5nIHN1Y2Nlc3MgYW5kIE5vdGVcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLndhcm5pbmcge1xyXG4gIGJhY2tncm91bmQ6ICNmYmU5ZTc7XHJcbiAgY29sb3I6ICNkNTAwMDA7XHJcbiAgJjo6YmVmb3JlIHsgY29udGVudDogJGktd2FybmluZzsgfVxyXG59XHJcblxyXG4ubm90ZSB7XHJcbiAgYmFja2dyb3VuZDogI2UxZjVmZTtcclxuICBjb2xvcjogIzAyODhkMTtcclxuICAmOjpiZWZvcmUgeyBjb250ZW50OiAkaS1zdGFyOyB9XHJcbn1cclxuXHJcbi5zdWNjZXNzIHtcclxuICBiYWNrZ3JvdW5kOiAjZTBmMmYxO1xyXG4gIGNvbG9yOiAjMDA4OTdiO1xyXG4gICY6OmJlZm9yZSB7IGNvbG9yOiAjMDBiZmE1OyBjb250ZW50OiAkaS1jaGVjazsgfVxyXG59XHJcblxyXG4ud2FybmluZywgLm5vdGUsIC5zdWNjZXNzIHtcclxuICBkaXNwbGF5OiBibG9jaztcclxuICBmb250LXNpemU6IDE4cHggIWltcG9ydGFudDtcclxuICBsaW5lLWhlaWdodDogMS41OCAhaW1wb3J0YW50O1xyXG4gIG1hcmdpbi10b3A6IDI4cHg7XHJcbiAgcGFkZGluZzogMTJweCAyNHB4IDEycHggNjBweDtcclxuXHJcbiAgYSB7XHJcbiAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xyXG4gIH1cclxuXHJcbiAgJjo6YmVmb3JlIHtcclxuICAgIEBleHRlbmQgJWZvbnRzLWljb25zO1xyXG5cclxuICAgIGZsb2F0OiBsZWZ0O1xyXG4gICAgZm9udC1zaXplOiAyNHB4O1xyXG4gICAgbWFyZ2luLWxlZnQ6IC0zNnB4O1xyXG4gICAgbWFyZ2luLXRvcDogLTVweDtcclxuICB9XHJcbn1cclxuXHJcbi8vIFBhZ2UgVGFnc1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4udGFnIHtcclxuICAmLWRlc2NyaXB0aW9uIHsgbWF4LXdpZHRoOiA3MDBweCB9XHJcbiAgJi5oYXMtLWltYWdlIHsgbWluLWhlaWdodDogMzUwcHggfVxyXG59XHJcblxyXG4vLyB0b2x0aXBcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLndpdGgtdG9vbHRpcCB7XHJcbiAgb3ZlcmZsb3c6IHZpc2libGU7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG5cclxuICAmOjphZnRlciB7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIC44NSk7XHJcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgIGNvbnRlbnQ6IGF0dHIoZGF0YS10b29sdGlwKTtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICBsZWZ0OiA1MCU7XHJcbiAgICBsaW5lLWhlaWdodDogMS4yNTtcclxuICAgIG1pbi13aWR0aDogMTMwcHg7XHJcbiAgICBvcGFjaXR5OiAwO1xyXG4gICAgcGFkZGluZzogNHB4IDhweDtcclxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XHJcbiAgICB0b3A6IC0zMHB4O1xyXG4gICAgd2lsbC1jaGFuZ2U6IG9wYWNpdHksIHRyYW5zZm9ybTtcclxuICAgIHotaW5kZXg6IDE7XHJcbiAgfVxyXG5cclxuICAmOmhvdmVyOjphZnRlciB7XHJcbiAgICBhbmltYXRpb246IHRvb2x0aXAgLjFzIGVhc2Utb3V0IGJvdGg7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBFcnJvciBwYWdlXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi5lcnJvclBhZ2Uge1xyXG4gIGZvbnQtZmFtaWx5OiAnUm9ib3RvIE1vbm8nLCBtb25vc3BhY2U7XHJcblxyXG4gICYtbGluayB7XHJcbiAgICBsZWZ0OiAtNXB4O1xyXG4gICAgcGFkZGluZzogMjRweCA2MHB4O1xyXG4gICAgdG9wOiAtNnB4O1xyXG4gIH1cclxuXHJcbiAgJi10ZXh0IHtcclxuICAgIG1hcmdpbi10b3A6IDYwcHg7XHJcbiAgICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XHJcbiAgfVxyXG5cclxuICAmLXdyYXAge1xyXG4gICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjQpO1xyXG4gICAgcGFkZGluZzogN3Z3IDR2dztcclxuICB9XHJcbn1cclxuXHJcbi8vIFZpZGVvIFJlc3BvbnNpdmVcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLnZpZGVvLXJlc3BvbnNpdmUge1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIGhlaWdodDogMDtcclxuICBtYXJnaW4tdG9wOiAzMHB4O1xyXG4gIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgcGFkZGluZzogMCAwIDU2LjI1JTtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgd2lkdGg6IDEwMCU7XHJcblxyXG4gIGlmcmFtZSB7XHJcbiAgICBib3JkZXI6IDA7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgfVxyXG5cclxuICB2aWRlbyB7XHJcbiAgICBib3JkZXI6IDA7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgfVxyXG59XHJcblxyXG4ua2ctZW1iZWQtY2FyZCAudmlkZW8tcmVzcG9uc2l2ZSB7IG1hcmdpbi10b3A6IDAgfVxyXG5cclxuLy8gR2FsbGVyeVxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLmtnLWdhbGxlcnkge1xyXG4gICYtY29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgfVxyXG5cclxuICAmLXJvdyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG5cclxuICAgICY6bm90KDpmaXJzdC1vZi10eXBlKSB7IG1hcmdpbjogMC43NWVtIDAgMCAwIH1cclxuICB9XHJcblxyXG4gICYtaW1hZ2Uge1xyXG4gICAgaW1nIHtcclxuICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgIG1hcmdpbjogMDtcclxuICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIGhlaWdodDogMTAwJTtcclxuICAgIH1cclxuXHJcbiAgICAmOm5vdCg6Zmlyc3Qtb2YtdHlwZSkgeyBtYXJnaW46IDAgMCAwIDAuNzVlbSB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBTb2NpYWwgTWVkaWEgQ29sb3JcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuQGVhY2ggJHNvY2lhbC1uYW1lLCAkY29sb3IgaW4gJHNvY2lhbC1jb2xvcnMge1xyXG4gIC5jLSN7JHNvY2lhbC1uYW1lfSB7IGNvbG9yOiAkY29sb3IgIWltcG9ydGFudDsgfVxyXG4gIC5iZy0jeyRzb2NpYWwtbmFtZX0geyBiYWNrZ3JvdW5kLWNvbG9yOiAkY29sb3IgIWltcG9ydGFudDsgfVxyXG59XHJcblxyXG4vLyBGYWNlYm9vayBTYXZlXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIC5mYlNhdmUge1xyXG4vLyAgICYtZHJvcGRvd24ge1xyXG4vLyAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuLy8gICAgIGJvcmRlcjogMXB4IHNvbGlkICNlMGUwZTA7XHJcbi8vICAgICBib3R0b206IDEwMCU7XHJcbi8vICAgICBkaXNwbGF5OiBub25lO1xyXG4vLyAgICAgbWF4LXdpZHRoOiAyMDBweDtcclxuLy8gICAgIG1pbi13aWR0aDogMTAwcHg7XHJcbi8vICAgICBwYWRkaW5nOiA4cHg7XHJcbi8vICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAwKTtcclxuLy8gICAgIHotaW5kZXg6IDEwO1xyXG5cclxuLy8gICAgICYuaXMtdmlzaWJsZSB7IGRpc3BsYXk6IGJsb2NrOyB9XHJcbi8vICAgfVxyXG4vLyB9XHJcblxyXG4vLyBSb2NrZXQgZm9yIHJldHVybiB0b3AgcGFnZVxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4ucm9ja2V0IHtcclxuICBib3R0b206IDUwcHg7XHJcbiAgcG9zaXRpb246IGZpeGVkO1xyXG4gIHJpZ2h0OiAyMHB4O1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICB3aWR0aDogNjBweDtcclxuICB6LWluZGV4OiA1O1xyXG5cclxuICAmOmhvdmVyIHN2ZyBwYXRoIHtcclxuICAgIGZpbGw6IHJnYmEoMCwgMCwgMCwgLjYpO1xyXG4gIH1cclxufVxyXG5cclxuLnN2Z0ljb24ge1xyXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxufVxyXG5cclxuc3ZnIHtcclxuICBoZWlnaHQ6IGF1dG87XHJcbiAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi8vIFBhZ2luYXRpb24gSW5maW5pdGUgU2Nyb2xsXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4ubG9hZC1tb3JlIHsgbWF4LXdpZHRoOiA3MCUgIWltcG9ydGFudCB9XHJcblxyXG4vLyBsb2FkaW5nQmFyXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4ubG9hZGluZ0JhciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzQ4ZTc5YTtcclxuICBkaXNwbGF5OiBub25lO1xyXG4gIGhlaWdodDogMnB4O1xyXG4gIGxlZnQ6IDA7XHJcbiAgcG9zaXRpb246IGZpeGVkO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIHRvcDogMDtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTAwJSk7XHJcbiAgei1pbmRleDogODAwO1xyXG59XHJcblxyXG4uaXMtbG9hZGluZyAubG9hZGluZ0JhciB7XHJcbiAgYW5pbWF0aW9uOiBsb2FkaW5nLWJhciAxcyBlYXNlLWluLW91dCBpbmZpbml0ZTtcclxuICBhbmltYXRpb24tZGVsYXk6IC44cztcclxuICBkaXNwbGF5OiBibG9jaztcclxufVxyXG5cclxuLy8gTWVkaWEgUXVlcnkgcmVzcG9uc2ludmVcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuQG1lZGlhICN7JG1kLWFuZC1kb3dufSB7XHJcbiAgYmxvY2txdW90ZSB7IG1hcmdpbi1sZWZ0OiAtNXB4OyBmb250LXNpemU6IDEuMTI1cmVtIH1cclxuXHJcbiAgLmtnLWltYWdlLWNhcmQsXHJcbiAgLmtnLWVtYmVkLWNhcmQge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAtMjBweDtcclxuICAgIG1hcmdpbi1sZWZ0OiAtMjBweDtcclxuICB9XHJcbn1cclxuIiwiLy8gQ29udGFpbmVyXHJcbi5leHRyZW1lLWNvbnRhaW5lciB7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICBtYXJnaW46IDAgYXV0bztcclxuICBtYXgtd2lkdGg6IDEyMDBweDtcclxuICBwYWRkaW5nOiAwIDE2cHg7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi8vIEBtZWRpYSAjeyRsZy1hbmQtdXB9IHtcclxuLy8gICAuY29udGVudCB7XHJcbi8vICAgICAvLyBmbGV4OiAxICFpbXBvcnRhbnQ7XHJcbi8vICAgICBtYXgtd2lkdGg6IGNhbGMoMTAwJSAtIDM0MHB4KSAhaW1wb3J0YW50O1xyXG4vLyAgICAgLy8gb3JkZXI6IDE7XHJcbi8vICAgICAvLyBvdmVyZmxvdzogaGlkZGVuO1xyXG4vLyAgIH1cclxuXHJcbi8vICAgLnNpZGViYXIge1xyXG4vLyAgICAgd2lkdGg6IDM0MHB4ICFpbXBvcnRhbnQ7XHJcbi8vICAgICAvLyBmbGV4OiAwIDAgMzQwcHggIWltcG9ydGFudDtcclxuLy8gICAgIC8vIG9yZGVyOiAyO1xyXG4vLyAgIH1cclxuLy8gfVxyXG5cclxuLmNvbC1sZWZ0LFxyXG4uY2MtdmlkZW8tbGVmdCB7XHJcbiAgZmxleC1iYXNpczogMDtcclxuICBmbGV4LWdyb3c6IDE7XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gIHBhZGRpbmctcmlnaHQ6IDEwcHg7XHJcbiAgcGFkZGluZy1sZWZ0OiAxMHB4O1xyXG59XHJcblxyXG4vLyBAbWVkaWEgI3skbWQtYW5kLXVwfSB7XHJcbi8vIH1cclxuXHJcbkBtZWRpYSAjeyRsZy1hbmQtdXB9IHtcclxuICAuY29sLWxlZnQgeyBtYXgtd2lkdGg6IGNhbGMoMTAwJSAtIDM0MHB4KSB9XHJcbiAgLmNjLXZpZGVvLWxlZnQgeyBtYXgtd2lkdGg6IGNhbGMoMTAwJSAtIDMyMHB4KSB9XHJcbiAgLmNjLXZpZGVvLXJpZ2h0IHsgZmxleC1iYXNpczogMzIwcHggIWltcG9ydGFudDsgbWF4LXdpZHRoOiAzMjBweCAhaW1wb3J0YW50OyB9XHJcbiAgYm9keS5pcy1hcnRpY2xlIC5jb2wtbGVmdCB7IHBhZGRpbmctcmlnaHQ6IDQwcHggfVxyXG59XHJcblxyXG4uY29sLXJpZ2h0IHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgcGFkZGluZy1sZWZ0OiAxMHB4O1xyXG4gIHBhZGRpbmctcmlnaHQ6IDEwcHg7XHJcbiAgd2lkdGg6IDMyMHB4O1xyXG59XHJcblxyXG4ucm93IHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgZmxleC13cmFwOiB3cmFwO1xyXG4gIGZsZXg6IDAgMSBhdXRvO1xyXG4gIG1hcmdpbi1sZWZ0OiAtIDEwcHg7XHJcbiAgbWFyZ2luLXJpZ2h0OiAtIDEwcHg7XHJcblxyXG4gIC5jb2wge1xyXG4gICAgZmxleDogMCAwIGF1dG87XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgcGFkZGluZy1sZWZ0OiAxMHB4O1xyXG4gICAgcGFkZGluZy1yaWdodDogMTBweDtcclxuXHJcbiAgICAkaTogMTtcclxuXHJcbiAgICBAd2hpbGUgJGkgPD0gJG51bS1jb2xzIHtcclxuICAgICAgJHBlcmM6IHVucXVvdGUoKDEwMCAvICgkbnVtLWNvbHMgLyAkaSkpICsgXCIlXCIpO1xyXG5cclxuICAgICAgJi5zI3skaX0ge1xyXG4gICAgICAgIGZsZXgtYmFzaXM6ICRwZXJjO1xyXG4gICAgICAgIG1heC13aWR0aDogJHBlcmM7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRpOiAkaSArIDE7XHJcbiAgICB9XHJcblxyXG4gICAgQG1lZGlhICN7JG1kLWFuZC11cH0ge1xyXG5cclxuICAgICAgJGk6IDE7XHJcblxyXG4gICAgICBAd2hpbGUgJGkgPD0gJG51bS1jb2xzIHtcclxuICAgICAgICAkcGVyYzogdW5xdW90ZSgoMTAwIC8gKCRudW0tY29scyAvICRpKSkgKyBcIiVcIik7XHJcblxyXG4gICAgICAgICYubSN7JGl9IHtcclxuICAgICAgICAgIGZsZXgtYmFzaXM6ICRwZXJjO1xyXG4gICAgICAgICAgbWF4LXdpZHRoOiAkcGVyYztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRpOiAkaSArIDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBAbWVkaWEgI3skbGctYW5kLXVwfSB7XHJcblxyXG4gICAgICAkaTogMTtcclxuXHJcbiAgICAgIEB3aGlsZSAkaSA8PSAkbnVtLWNvbHMge1xyXG4gICAgICAgICRwZXJjOiB1bnF1b3RlKCgxMDAgLyAoJG51bS1jb2xzIC8gJGkpKSArIFwiJVwiKTtcclxuXHJcbiAgICAgICAgJi5sI3skaX0ge1xyXG4gICAgICAgICAgZmxleC1iYXNpczogJHBlcmM7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6ICRwZXJjO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJGk6ICRpICsgMTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLyBIZWFkaW5nc1xyXG5cclxuaDEsIGgyLCBoMywgaDQsIGg1LCBoNiB7XHJcbiAgY29sb3I6ICRoZWFkaW5ncy1jb2xvcjtcclxuICBmb250LWZhbWlseTogJGhlYWRpbmdzLWZvbnQtZmFtaWx5O1xyXG4gIGZvbnQtd2VpZ2h0OiAkaGVhZGluZ3MtZm9udC13ZWlnaHQ7XHJcbiAgbGluZS1oZWlnaHQ6ICRoZWFkaW5ncy1saW5lLWhlaWdodDtcclxuICBtYXJnaW46IDA7XHJcblxyXG4gIGEge1xyXG4gICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICBsaW5lLWhlaWdodDogaW5oZXJpdDtcclxuICB9XHJcbn1cclxuXHJcbmgxIHsgZm9udC1zaXplOiAkZm9udC1zaXplLWgxOyB9XHJcbmgyIHsgZm9udC1zaXplOiAkZm9udC1zaXplLWgyOyB9XHJcbmgzIHsgZm9udC1zaXplOiAkZm9udC1zaXplLWgzOyB9XHJcbmg0IHsgZm9udC1zaXplOiAkZm9udC1zaXplLWg0OyB9XHJcbmg1IHsgZm9udC1zaXplOiAkZm9udC1zaXplLWg1OyB9XHJcbmg2IHsgZm9udC1zaXplOiAkZm9udC1zaXplLWg2OyB9XHJcblxyXG5wIHtcclxuICBtYXJnaW46IDA7XHJcbn1cclxuIiwiLy8gY29sb3Jcbi51LXRleHRDb2xvck5vcm1hbCB7XG4gIC8vIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC40NCkgIWltcG9ydGFudDtcbiAgLy8gZmlsbDogcmdiYSgwLCAwLCAwLCAuNDQpICFpbXBvcnRhbnQ7XG4gIGNvbG9yOiByZ2JhKDE1MywgMTUzLCAxNTMsIDEpICFpbXBvcnRhbnQ7XG4gIGZpbGw6IHJnYmEoMTUzLCAxNTMsIDE1MywgMSkgIWltcG9ydGFudDtcbn1cblxuLnUtdGV4dENvbG9yV2hpdGUge1xuICBjb2xvcjogI2ZmZiAhaW1wb3J0YW50O1xuICBmaWxsOiAjZmZmICFpbXBvcnRhbnQ7XG59XG5cbi51LWhvdmVyQ29sb3JOb3JtYWw6aG92ZXIge1xuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNik7XG4gIGZpbGw6IHJnYmEoMCwgMCwgMCwgLjYpO1xufVxuXG4udS1hY2NlbnRDb2xvci0taWNvbk5vcm1hbCB7XG4gIGNvbG9yOiAkcHJpbWFyeS1jb2xvcjtcbiAgZmlsbDogJHByaW1hcnktY29sb3I7XG59XG5cbi8vICBiYWNrZ3JvdW5kIGNvbG9yXG4udS1iZ0NvbG9yIHsgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7IH1cblxuLnUtdGV4dENvbG9yRGFya2VyIHsgQGV4dGVuZCAldS10ZXh0LWNvbG9yLWRhcmtlcjsgfVxuXG4vLyBQb3NpdGlvbnNcbi51LXJlbGF0aXZlIHsgcG9zaXRpb246IHJlbGF0aXZlOyB9XG4udS1hYnNvbHV0ZSB7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgfVxuLnUtYWJzb2x1dGUwIHsgQGV4dGVuZCAldS1hYnNvbHV0ZTA7IH1cbi51LWZpeGVkIHsgcG9zaXRpb246IGZpeGVkICFpbXBvcnRhbnQ7IH1cblxuLnUtYmxvY2sgeyBkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50IH1cbi51LWlubGluZUJsb2NrIHsgZGlzcGxheTogaW5saW5lLWJsb2NrIH1cblxuLy8gIEJhY2tncm91bmRcbi51LWJhY2tncm91bmREYXJrIHtcbiAgLy8gYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgcmdiYSgwLCAwLCAwLCAuMykgMjklLCByZ2JhKDAsIDAsIDAsIC42KSA4MSUpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMGQwZjEwO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IDA7XG4gIHRvcDogMDtcbiAgei1pbmRleDogMTtcbn1cblxuLnUtZ3JhZGllbnQge1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCB0cmFuc3BhcmVudCAyMCUsICMwMDAgMTAwJSk7XG4gIGJvdHRvbTogMDtcbiAgaGVpZ2h0OiA5MCU7XG4gIGxlZnQ6IDA7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IDA7XG4gIHotaW5kZXg6IDE7XG59XG5cbi8vIHppbmRleFxuLnppbmRleDEgeyB6LWluZGV4OiAxIH1cbi56aW5kZXgyIHsgei1pbmRleDogMiB9XG4uemluZGV4MyB7IHotaW5kZXg6IDMgfVxuLnppbmRleDQgeyB6LWluZGV4OiA0IH1cblxuLy8gLnUtYmFja2dyb3VuZC13aGl0ZSB7IGJhY2tncm91bmQtY29sb3I6ICNlZWVmZWU7IH1cbi51LWJhY2tncm91bmRXaGl0ZSB7IGJhY2tncm91bmQtY29sb3I6ICNmYWZhZmEgfVxuLnUtYmFja2dyb3VuZENvbG9yR3JheUxpZ2h0IHsgYmFja2dyb3VuZC1jb2xvcjogI2YwZjBmMCAhaW1wb3J0YW50OyB9XG5cbi8vIENsZWFyXG4udS1jbGVhcjo6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBkaXNwbGF5OiB0YWJsZTtcbiAgY2xlYXI6IGJvdGg7XG59XG5cbi8vIGZvbnQgc2l6ZVxuLnUtZm9udFNpemVNaWNybyB7IGZvbnQtc2l6ZTogMTFweCB9XG4udS1mb250U2l6ZVNtYWxsZXN0IHsgZm9udC1zaXplOiAxMnB4IH1cbi51LWZvbnRTaXplMTMgeyBmb250LXNpemU6IDEzcHggfVxuLnUtZm9udFNpemVTbWFsbGVyIHsgZm9udC1zaXplOiAxNHB4IH1cbi51LWZvbnRTaXplMTUgeyBmb250LXNpemU6IDE1cHggfVxuLnUtZm9udFNpemVTbWFsbCB7IGZvbnQtc2l6ZTogMTZweCB9XG4udS1mb250U2l6ZUJhc2UgeyBmb250LXNpemU6IDE4cHggfVxuLnUtZm9udFNpemUyMCB7IGZvbnQtc2l6ZTogMjBweCB9XG4udS1mb250U2l6ZTIxIHsgZm9udC1zaXplOiAyMXB4IH1cbi51LWZvbnRTaXplMjIgeyBmb250LXNpemU6IDIycHggfVxuLnUtZm9udFNpemVMYXJnZSB7IGZvbnQtc2l6ZTogMjRweCB9XG4udS1mb250U2l6ZTI2IHsgZm9udC1zaXplOiAyNnB4IH1cbi51LWZvbnRTaXplMjggeyBmb250LXNpemU6IDI4cHggfVxuLnUtZm9udFNpemVMYXJnZXIgeyBmb250LXNpemU6IDMycHggfVxuLnUtZm9udFNpemUzNiB7IGZvbnQtc2l6ZTogMzZweCB9XG4udS1mb250U2l6ZTQwIHsgZm9udC1zaXplOiA0MHB4IH1cbi51LWZvbnRTaXplTGFyZ2VzdCB7IGZvbnQtc2l6ZTogNDRweCB9XG4udS1mb250U2l6ZUp1bWJvIHsgZm9udC1zaXplOiA1MHB4IH1cblxuQG1lZGlhICN7JG1kLWFuZC1kb3dufSB7XG4gIC51LW1kLWZvbnRTaXplQmFzZSB7IGZvbnQtc2l6ZTogMThweCB9XG4gIC51LW1kLWZvbnRTaXplMjIgeyBmb250LXNpemU6IDIycHggfVxuICAudS1tZC1mb250U2l6ZUxhcmdlciB7IGZvbnQtc2l6ZTogMzJweCB9XG59XG5cbi8vIEBtZWRpYSAobWF4LXdpZHRoOiA3NjdweCkge1xuLy8gICAudS14cy1mb250U2l6ZUJhc2Uge2ZvbnQtc2l6ZTogMThweH1cbi8vICAgLnUteHMtZm9udFNpemUxMyB7Zm9udC1zaXplOiAxM3B4fVxuLy8gICAudS14cy1mb250U2l6ZVNtYWxsZXIge2ZvbnQtc2l6ZTogMTRweH1cbi8vICAgLnUteHMtZm9udFNpemVTbWFsbCB7Zm9udC1zaXplOiAxNnB4fVxuLy8gICAudS14cy1mb250U2l6ZTIyIHtmb250LXNpemU6IDIycHh9XG4vLyAgIC51LXhzLWZvbnRTaXplTGFyZ2Uge2ZvbnQtc2l6ZTogMjRweH1cbi8vICAgLnUteHMtZm9udFNpemU0MCB7Zm9udC1zaXplOiA0MHB4fVxuLy8gICAudS14cy1mb250U2l6ZUxhcmdlciB7Zm9udC1zaXplOiAzMnB4fVxuLy8gICAudS14cy1mb250U2l6ZVNtYWxsZXN0IHtmb250LXNpemU6IDEycHh9XG4vLyB9XG5cbi8vIGZvbnQgd2VpZ2h0XG4udS1mb250V2VpZ2h0VGhpbiB7IGZvbnQtd2VpZ2h0OiAzMDAgfVxuLnUtZm9udFdlaWdodE5vcm1hbCB7IGZvbnQtd2VpZ2h0OiA0MDAgfVxuLnUtZm9udFdlaWdodE1lZGl1bSB7IGZvbnQtd2VpZ2h0OiA1MDAgfVxuLnUtZm9udFdlaWdodFNlbWlib2xkIHsgZm9udC13ZWlnaHQ6IDYwMCAhaW1wb3J0YW50IH1cbi51LWZvbnRXZWlnaHRCb2xkIHsgZm9udC13ZWlnaHQ6IDcwMCB9XG4udS1mb250V2VpZ2h0Qm9sZGVyIHsgZm9udC13ZWlnaHQ6IDkwMCB9XG5cbi51LXRleHRVcHBlcmNhc2UgeyB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlIH1cbi51LXRleHRDYXBpdGFsaXplIHsgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemUgfVxuLnUtdGV4dEFsaWduQ2VudGVyIHsgdGV4dC1hbGlnbjogY2VudGVyIH1cblxuLnUtbm9XcmFwV2l0aEVsbGlwc2lzIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbiAhaW1wb3J0YW50O1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcyAhaW1wb3J0YW50O1xuICB3aGl0ZS1zcGFjZTogbm93cmFwICFpbXBvcnRhbnQ7XG59XG5cbi8vIE1hcmdpblxuLnUtbWFyZ2luQXV0byB7IG1hcmdpbi1sZWZ0OiBhdXRvOyBtYXJnaW4tcmlnaHQ6IGF1dG87IH1cbi51LW1hcmdpblRvcDIwIHsgbWFyZ2luLXRvcDogMjBweCB9XG4udS1tYXJnaW5Ub3AzMCB7IG1hcmdpbi10b3A6IDMwcHggfVxuLnUtbWFyZ2luQm90dG9tMTAgeyBtYXJnaW4tYm90dG9tOiAxMHB4IH1cbi51LW1hcmdpbkJvdHRvbTE1IHsgbWFyZ2luLWJvdHRvbTogMTVweCB9XG4udS1tYXJnaW5Cb3R0b20yMCB7IG1hcmdpbi1ib3R0b206IDIwcHggIWltcG9ydGFudCB9XG4udS1tYXJnaW5Cb3R0b20zMCB7IG1hcmdpbi1ib3R0b206IDMwcHggfVxuLnUtbWFyZ2luQm90dG9tNDAgeyBtYXJnaW4tYm90dG9tOiA0MHB4IH1cblxuLy8gcGFkZGluZ1xuLnUtcGFkZGluZzAgeyBwYWRkaW5nOiAwICFpbXBvcnRhbnQgfVxuLnUtcGFkZGluZzIwIHsgcGFkZGluZzogMjBweCB9XG4udS1wYWRkaW5nMTUgeyBwYWRkaW5nOiAxNXB4ICFpbXBvcnRhbnQ7IH1cbi51LXBhZGRpbmdCb3R0b20yIHsgcGFkZGluZy1ib3R0b206IDJweDsgfVxuLnUtcGFkZGluZ0JvdHRvbTMwIHsgcGFkZGluZy1ib3R0b206IDMwcHg7IH1cbi51LXBhZGRpbmdCb3R0b20yMCB7IHBhZGRpbmctYm90dG9tOiAyMHB4IH1cbi51LXBhZGRpbmdSaWdodDEwIHsgcGFkZGluZy1yaWdodDogMTBweCB9XG4udS1wYWRkaW5nTGVmdDE1IHsgcGFkZGluZy1sZWZ0OiAxNXB4IH1cblxuLnUtcGFkZGluZ1RvcDIgeyBwYWRkaW5nLXRvcDogMnB4IH1cbi51LXBhZGRpbmdUb3A1IHsgcGFkZGluZy10b3A6IDVweDsgfVxuLnUtcGFkZGluZ1RvcDEwIHsgcGFkZGluZy10b3A6IDEwcHg7IH1cbi51LXBhZGRpbmdUb3AxNSB7IHBhZGRpbmctdG9wOiAxNXB4OyB9XG4udS1wYWRkaW5nVG9wMjAgeyBwYWRkaW5nLXRvcDogMjBweDsgfVxuLnUtcGFkZGluZ1RvcDMwIHsgcGFkZGluZy10b3A6IDMwcHg7IH1cblxuLnUtcGFkZGluZ0JvdHRvbTE1IHsgcGFkZGluZy1ib3R0b206IDE1cHg7IH1cblxuLnUtcGFkZGluZ1JpZ2h0MjAgeyBwYWRkaW5nLXJpZ2h0OiAyMHB4IH1cbi51LXBhZGRpbmdMZWZ0MjAgeyBwYWRkaW5nLWxlZnQ6IDIwcHggfVxuXG4udS1jb250ZW50VGl0bGUge1xuICBmb250LWZhbWlseTogJHByaW1hcnktZm9udDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXdlaWdodDogOTAwO1xuICBsZXR0ZXItc3BhY2luZzogLS4wMjhlbTtcbn1cblxuLy8gbGluZS1oZWlnaHRcbi51LWxpbmVIZWlnaHQxIHsgbGluZS1oZWlnaHQ6IDE7IH1cbi51LWxpbmVIZWlnaHRUaWdodCB7IGxpbmUtaGVpZ2h0OiAxLjIgfVxuXG4vLyBvdmVyZmxvd1xuLnUtb3ZlcmZsb3dIaWRkZW4geyBvdmVyZmxvdzogaGlkZGVuIH1cblxuLy8gZmxvYXRcbi51LWZsb2F0UmlnaHQgeyBmbG9hdDogcmlnaHQ7IH1cbi51LWZsb2F0TGVmdCB7IGZsb2F0OiBsZWZ0OyB9XG5cbi8vICBmbGV4XG4udS1mbGV4IHsgZGlzcGxheTogZmxleDsgfVxuLnUtZmxleENlbnRlciB7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGRpc3BsYXk6IGZsZXg7IH1cbi51LWZsZXhDb250ZW50Q2VudGVyIHsganVzdGlmeS1jb250ZW50OiBjZW50ZXIgfVxuLy8gLnUtZmxleC0tMSB7IGZsZXg6IDEgfVxuLnUtZmxleDEgeyBmbGV4OiAxIDEgYXV0bzsgfVxuLnUtZmxleDAgeyBmbGV4OiAwIDAgYXV0bzsgfVxuLnUtZmxleFdyYXAgeyBmbGV4LXdyYXA6IHdyYXAgfVxuXG4udS1mbGV4Q29sdW1uIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi51LWZsZXhFbmQge1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xufVxuXG4udS1mbGV4Q29sdW1uVG9wIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xufVxuXG4vLyBCYWNrZ3JvdW5kXG4udS1iYWNrZ3JvdW5kU2l6ZUNvdmVyIHtcbiAgYmFja2dyb3VuZC1vcmlnaW46IGJvcmRlci1ib3g7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1zaXplOiBjb3Zlcjtcbn1cblxuLy8gbWF4IHdpZGh0XG4udS1jb250YWluZXIge1xuICBtYXJnaW4tbGVmdDogYXV0bztcbiAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xuICBwYWRkaW5nLWxlZnQ6IDIwcHg7XG4gIHBhZGRpbmctcmlnaHQ6IDIwcHg7XG59XG5cbi51LW1heFdpZHRoMTIwMCB7IG1heC13aWR0aDogMTIwMHB4IH1cbi51LW1heFdpZHRoMTAwMCB7IG1heC13aWR0aDogMTAwMHB4IH1cbi51LW1heFdpZHRoNzQwIHsgbWF4LXdpZHRoOiA3NDBweCB9XG4udS1tYXhXaWR0aDEwNDAgeyBtYXgtd2lkdGg6IDEwNDBweCB9XG4udS1zaXplRnVsbFdpZHRoIHsgd2lkdGg6IDEwMCUgfVxuLnUtc2l6ZUZ1bGxIZWlnaHQgeyBoZWlnaHQ6IDEwMCUgfVxuXG4vLyBib3JkZXJcbi51LWJvcmRlckxpZ2h0ZXIgeyBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIC4xNSk7IH1cbi51LXJvdW5kIHsgYm9yZGVyLXJhZGl1czogNTAlIH1cbi51LWJvcmRlclJhZGl1czIgeyBib3JkZXItcmFkaXVzOiAycHggfVxuXG4udS1ib3hTaGFkb3dCb3R0b20ge1xuICBib3gtc2hhZG93OiAwIDRweCAycHggLTJweCByZ2JhKDAsIDAsIDAsIC4wNSk7XG59XG5cbi8vIEhlaW5naHRcbi51LWhlaWdodDU0MCB7IGhlaWdodDogNTQwcHggfVxuLnUtaGVpZ2h0MjgwIHsgaGVpZ2h0OiAyODBweCB9XG4udS1oZWlnaHQyNjAgeyBoZWlnaHQ6IDI2MHB4IH1cbi51LWhlaWdodDEwMCB7IGhlaWdodDogMTAwcHggfVxuLnUtYm9yZGVyQmxhY2tMaWdodGVzdCB7IGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjEpIH1cblxuLy8gaGlkZSBnbG9iYWxcbi51LWhpZGUgeyBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQgfVxuXG4vLyBjYXJkXG4udS1jYXJkIHtcbiAgYmFja2dyb3VuZDogI2ZmZjtcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAuMDkpO1xuICBib3JkZXItcmFkaXVzOiAzcHg7XG4gIC8vIGJveC1zaGFkb3c6IDAgMXB4IDRweCByZ2JhKDAsIDAsIDAsIC4wNCk7XG4gIGJveC1zaGFkb3c6IDAgMXB4IDdweCByZ2JhKDAsIDAsIDAsIC4wNSk7XG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gIHBhZGRpbmc6IDEwcHggMjBweCAxNXB4O1xufVxuXG4vLyB0aXRsZSBMaW5lXG4udGl0bGUtbGluZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB3aWR0aDogMTAwJTtcblxuICAmOjpiZWZvcmUge1xuICAgIGNvbnRlbnQ6ICcnO1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjMpO1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogMDtcbiAgICBib3R0b206IDUwJTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDFweDtcbiAgICB6LWluZGV4OiAwO1xuICB9XG59XG5cbi8vIE9iYmxpcXVlXG4udS1vYmxpcXVlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29tcG9zaXRlLWNvbG9yKTtcbiAgY29sb3I6ICNmZmY7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBsaW5lLWhlaWdodDogMTtcbiAgcGFkZGluZzogNXB4IDEzcHg7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIHRyYW5zZm9ybTogc2tld1goLTE1ZGVnKTtcbn1cblxuLm5vLWF2YXRhciB7XG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vaW1hZ2VzL2F2YXRhci5wbmcnKSAhaW1wb3J0YW50XG59XG5cbkBtZWRpYSAjeyRtZC1hbmQtZG93bn0ge1xuICAudS1oaWRlLWJlZm9yZS1tZCB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudCB9XG4gIC51LW1kLWhlaWdodEF1dG8geyBoZWlnaHQ6IGF1dG87IH1cbiAgLnUtbWQtaGVpZ2h0MTcwIHsgaGVpZ2h0OiAxNzBweCB9XG4gIC51LW1kLXJlbGF0aXZlIHsgcG9zaXRpb246IHJlbGF0aXZlIH1cbn1cblxuQG1lZGlhICN7JGxnLWFuZC1kb3dufSB7IC51LWhpZGUtYmVmb3JlLWxnIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50IH0gfVxuXG4vLyBoaWRlIGFmdGVyXG5AbWVkaWEgI3skbWQtYW5kLXVwfSB7IC51LWhpZGUtYWZ0ZXItbWQgeyBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQgfSB9XG5cbkBtZWRpYSAjeyRsZy1hbmQtdXB9IHsgLnUtaGlkZS1hZnRlci1sZyB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudCB9IH1cbiIsIi5idXR0b24ge1xyXG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMCk7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAuMTUpO1xyXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC40NCk7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICBmb250LWZhbWlseTogJHByaW1hcnktZm9udDtcclxuICBmb250LXNpemU6IDE0cHg7XHJcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xyXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XHJcbiAgaGVpZ2h0OiAzN3B4O1xyXG4gIGxldHRlci1zcGFjaW5nOiAwO1xyXG4gIGxpbmUtaGVpZ2h0OiAzNXB4O1xyXG4gIHBhZGRpbmc6IDAgMTZweDtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICB0ZXh0LXJlbmRlcmluZzogb3B0aW1pemVMZWdpYmlsaXR5O1xyXG4gIHVzZXItc2VsZWN0OiBub25lO1xyXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XHJcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuXHJcbiAgJi0tY2hyb21lbGVzcyB7XHJcbiAgICBib3JkZXItcmFkaXVzOiAwO1xyXG4gICAgYm9yZGVyLXdpZHRoOiAwO1xyXG4gICAgYm94LXNoYWRvdzogbm9uZTtcclxuICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC40NCk7XHJcbiAgICBoZWlnaHQ6IGF1dG87XHJcbiAgICBsaW5lLWhlaWdodDogaW5oZXJpdDtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vcm1hbDtcclxuXHJcbiAgICAmOmFjdGl2ZSxcclxuICAgICY6aG92ZXIsXHJcbiAgICAmOmZvY3VzIHtcclxuICAgICAgYm9yZGVyLXdpZHRoOiAwO1xyXG4gICAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAmLS1sYXJnZSB7XHJcbiAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICBoZWlnaHQ6IDQ0cHg7XHJcbiAgICBsaW5lLWhlaWdodDogNDJweDtcclxuICAgIHBhZGRpbmc6IDAgMThweDtcclxuICB9XHJcblxyXG4gICYtLWRhcmsge1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAuODQpO1xyXG4gICAgYm9yZGVyLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC44NCk7XHJcbiAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAuOTcpO1xyXG5cclxuICAgICY6aG92ZXIge1xyXG4gICAgICBiYWNrZ3JvdW5kOiAkcHJpbWFyeS1jb2xvcjtcclxuICAgICAgYm9yZGVyLWNvbG9yOiAkcHJpbWFyeS1jb2xvcjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vIFByaW1hcnlcclxuLmJ1dHRvbi0tcHJpbWFyeSB7XHJcbiAgYm9yZGVyLWNvbG9yOiAkcHJpbWFyeS1jb2xvcjtcclxuICBjb2xvcjogJHByaW1hcnktY29sb3I7XHJcbn1cclxuXHJcbi5idXR0b24tLWxhcmdlLmJ1dHRvbi0tY2hyb21lbGVzcyxcclxuLmJ1dHRvbi0tbGFyZ2UuYnV0dG9uLS1saW5rIHtcclxuICBwYWRkaW5nOiAwO1xyXG59XHJcblxyXG4uYnV0dG9uU2V0IHtcclxuICA+IC5idXR0b24ge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiA4cHg7XHJcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xyXG4gIH1cclxuXHJcbiAgPiAuYnV0dG9uOmxhc3QtY2hpbGQge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAwO1xyXG4gIH1cclxuXHJcbiAgLmJ1dHRvbi0tY2hyb21lbGVzcyB7XHJcbiAgICBoZWlnaHQ6IDM3cHg7XHJcbiAgICBsaW5lLWhlaWdodDogMzVweDtcclxuICB9XHJcblxyXG4gIC5idXR0b24tLWxhcmdlLmJ1dHRvbi0tY2hyb21lbGVzcyxcclxuICAuYnV0dG9uLS1sYXJnZS5idXR0b24tLWxpbmsge1xyXG4gICAgaGVpZ2h0OiA0NHB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDQycHg7XHJcbiAgfVxyXG5cclxuICAmID4gLmJ1dHRvbi0tY2hyb21lbGVzczpub3QoLmJ1dHRvbi0tY2lyY2xlKSB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDA7XHJcbiAgICBwYWRkaW5nLXJpZ2h0OiA4cHg7XHJcbiAgfVxyXG5cclxuICAmID4gLmJ1dHRvbi0tY2hyb21lbGVzczpsYXN0LWNoaWxkIHtcclxuICAgIHBhZGRpbmctcmlnaHQ6IDA7XHJcbiAgfVxyXG5cclxuICAmID4gLmJ1dHRvbi0tY2hyb21lbGVzcyArIC5idXR0b24tLWNocm9tZWxlc3M6bm90KC5idXR0b24tLWNpcmNsZSkge1xyXG4gICAgbWFyZ2luLWxlZnQ6IDA7XHJcbiAgICBwYWRkaW5nLWxlZnQ6IDhweDtcclxuICB9XHJcbn1cclxuXHJcbi5idXR0b24tLWNpcmNsZSB7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogbm9uZSAhaW1wb3J0YW50O1xyXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICBjb2xvcjogI2ZmZjtcclxuICBoZWlnaHQ6IDQwcHg7XHJcbiAgbGluZS1oZWlnaHQ6IDM4cHg7XHJcbiAgcGFkZGluZzogMDtcclxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgd2lkdGg6IDQwcHg7XHJcbn1cclxuXHJcbi8vIEJ0biBmb3IgdGFnIGNsb3VkIG9yIGNhdGVnb3J5XHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi50YWctYnV0dG9uIHtcclxuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIC4wNSk7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC42OCk7XHJcbiAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICBtYXJnaW46IDAgOHB4IDhweCAwO1xyXG5cclxuICAmOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgLjEpO1xyXG4gICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjY4KTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGJ1dHRvbiBkYXJrIGxpbmVcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLmJ1dHRvbi0tZGFyay1saW5lIHtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjMDAwO1xyXG4gIGNvbG9yOiAjMDAwO1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgbWFyZ2luOiA1MHB4IGF1dG8gMDtcclxuICBtYXgtd2lkdGg6IDMwMHB4O1xyXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgdHJhbnNpdGlvbjogY29sb3IgLjNzIGVhc2UsIGJveC1zaGFkb3cgLjNzIGN1YmljLWJlemllciguNDU1LCAuMDMsIC41MTUsIC45NTUpO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG5cclxuICAmOmhvdmVyIHtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAtNTBweCA4cHggLTRweCAjMDAwO1xyXG4gIH1cclxufVxyXG4iLCIvLyBzdHlsZWxpbnQtZGlzYWJsZVxyXG5AZm9udC1mYWNlIHtcclxuICBmb250LWZhbWlseTogJ21hcGFjaGUnO1xyXG4gIHNyYzogIHVybCgnLi4vZm9udHMvbWFwYWNoZS5lb3Q/MjU3NjRqJyk7XHJcbiAgc3JjOiAgdXJsKCcuLi9mb250cy9tYXBhY2hlLmVvdD8yNTc2NGojaWVmaXgnKSBmb3JtYXQoJ2VtYmVkZGVkLW9wZW50eXBlJyksXHJcbiAgICB1cmwoJy4uL2ZvbnRzL21hcGFjaGUudHRmPzI1NzY0aicpIGZvcm1hdCgndHJ1ZXR5cGUnKSxcclxuICAgIHVybCgnLi4vZm9udHMvbWFwYWNoZS53b2ZmPzI1NzY0aicpIGZvcm1hdCgnd29mZicpLFxyXG4gICAgdXJsKCcuLi9mb250cy9tYXBhY2hlLnN2Zz8yNTc2NGojbWFwYWNoZScpIGZvcm1hdCgnc3ZnJyk7XHJcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcclxuICBmb250LXN0eWxlOiBub3JtYWw7XHJcbn1cclxuXHJcbltjbGFzc149XCJpLVwiXTo6YmVmb3JlLCBbY2xhc3MqPVwiIGktXCJdOjpiZWZvcmUge1xyXG4gIEBleHRlbmQgJWZvbnRzLWljb25zO1xyXG59XHJcblxyXG4uaS10YWc6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkxMVwiO1xyXG59XHJcbi5pLWRpc2NvcmQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwYVwiO1xyXG59XHJcbi5pLWFycm93LXJvdW5kLW5leHQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwY1wiO1xyXG59XHJcbi5pLWFycm93LXJvdW5kLXByZXY6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwZFwiO1xyXG59XHJcbi5pLWFycm93LXJvdW5kLXVwOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU5MGVcIjtcclxufVxyXG4uaS1hcnJvdy1yb3VuZC1kb3duOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU5MGZcIjtcclxufVxyXG4uaS1waG90bzpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlOTBiXCI7XHJcbn1cclxuLmktc2VuZDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlOTA5XCI7XHJcbn1cclxuLmktYXVkaW86YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwMVwiO1xyXG59XHJcbi5pLXJvY2tldDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlOTAyXCI7XHJcbiAgY29sb3I6ICM5OTk7XHJcbn1cclxuLmktY29tbWVudHMtbGluZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlOTAwXCI7XHJcbn1cclxuLmktZ2xvYmU6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwNlwiO1xyXG59XHJcbi5pLXN0YXI6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwN1wiO1xyXG59XHJcbi5pLWxpbms6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTkwOFwiO1xyXG59XHJcbi5pLXN0YXItbGluZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlOTAzXCI7XHJcbn1cclxuLmktbW9yZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlOTA0XCI7XHJcbn1cclxuLmktc2VhcmNoOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU5MDVcIjtcclxufVxyXG4uaS1jaGF0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU5MTBcIjtcclxufVxyXG4uaS1hcnJvdy1sZWZ0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGUzMTRcIjtcclxufVxyXG4uaS1hcnJvdy1yaWdodDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlMzE1XCI7XHJcbn1cclxuLmktcGxheTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlMDM3XCI7XHJcbn1cclxuLmktbG9jYXRpb246YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZThiNFwiO1xyXG59XHJcbi5pLWNoZWNrLWNpcmNsZTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxlODZjXCI7XHJcbn1cclxuLmktY2xvc2U6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTVjZFwiO1xyXG59XHJcbi5pLWZhdm9yaXRlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU4N2RcIjtcclxufVxyXG4uaS13YXJuaW5nOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGUwMDJcIjtcclxufVxyXG4uaS1yc3M6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZTBlNVwiO1xyXG59XHJcbi5pLXNoYXJlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGU4MGRcIjtcclxufVxyXG4uaS1lbWFpbDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMGUwXCI7XHJcbn1cclxuLmktZ29vZ2xlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxYTBcIjtcclxufVxyXG4uaS10ZWxlZ3JhbTpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMmM2XCI7XHJcbn1cclxuLmktcmVkZGl0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYyODFcIjtcclxufVxyXG4uaS10d2l0dGVyOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYwOTlcIjtcclxufVxyXG4uaS1naXRodWI6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjA5YlwiO1xyXG59XHJcbi5pLWxpbmtlZGluOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYwZTFcIjtcclxufVxyXG4uaS15b3V0dWJlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxNmFcIjtcclxufVxyXG4uaS1zdGFjay1vdmVyZmxvdzpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMTZjXCI7XHJcbn1cclxuLmktaW5zdGFncmFtOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxNmRcIjtcclxufVxyXG4uaS1mbGlja3I6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjE2ZVwiO1xyXG59XHJcbi5pLWRyaWJiYmxlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxN2RcIjtcclxufVxyXG4uaS1iZWhhbmNlOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxYjRcIjtcclxufVxyXG4uaS1zcG90aWZ5OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxYmNcIjtcclxufVxyXG4uaS1jb2RlcGVuOmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYxY2JcIjtcclxufVxyXG4uaS1mYWNlYm9vazpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMjMwXCI7XHJcbn1cclxuLmktcGludGVyZXN0OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCJcXGYyMzFcIjtcclxufVxyXG4uaS13aGF0c2FwcDpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXFxmMjMyXCI7XHJcbn1cclxuLmktc25hcGNoYXQ6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlxcZjJhY1wiO1xyXG59XHJcbiIsIi8vIGFuaW1hdGVkIEdsb2JhbFxyXG4uYW5pbWF0ZWQge1xyXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMXM7XHJcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcclxuXHJcbiAgJi5pbmZpbml0ZSB7XHJcbiAgICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGFuaW1hdGVkIEFsbFxyXG4uYm91bmNlSW4geyBhbmltYXRpb24tbmFtZTogYm91bmNlSW47IH1cclxuLmJvdW5jZUluRG93biB7IGFuaW1hdGlvbi1uYW1lOiBib3VuY2VJbkRvd247IH1cclxuLnB1bHNlIHsgYW5pbWF0aW9uLW5hbWU6IHB1bHNlOyB9XHJcbi5zbGlkZUluVXAgeyBhbmltYXRpb24tbmFtZTogc2xpZGVJblVwIH1cclxuLnNsaWRlT3V0RG93biB7IGFuaW1hdGlvbi1uYW1lOiBzbGlkZU91dERvd24gfVxyXG5cclxuLy8gYWxsIGtleWZyYW1lcyBBbmltYXRlc1xyXG4vLyBib3VuY2VJblxyXG5Aa2V5ZnJhbWVzIGJvdW5jZUluIHtcclxuICAwJSxcclxuICAyMCUsXHJcbiAgNDAlLFxyXG4gIDYwJSxcclxuICA4MCUsXHJcbiAgMTAwJSB7IGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllciguMjE1LCAuNjEsIC4zNTUsIDEpOyB9XHJcbiAgMCUgeyBvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHNjYWxlM2QoLjMsIC4zLCAuMyk7IH1cclxuICAyMCUgeyB0cmFuc2Zvcm06IHNjYWxlM2QoMS4xLCAxLjEsIDEuMSk7IH1cclxuICA0MCUgeyB0cmFuc2Zvcm06IHNjYWxlM2QoLjksIC45LCAuOSk7IH1cclxuICA2MCUgeyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHNjYWxlM2QoMS4wMywgMS4wMywgMS4wMyk7IH1cclxuICA4MCUgeyB0cmFuc2Zvcm06IHNjYWxlM2QoLjk3LCAuOTcsIC45Nyk7IH1cclxuICAxMDAlIHsgb3BhY2l0eTogMTsgdHJhbnNmb3JtOiBzY2FsZTNkKDEsIDEsIDEpOyB9XHJcbn1cclxuXHJcbi8vIGJvdW5jZUluRG93blxyXG5Aa2V5ZnJhbWVzIGJvdW5jZUluRG93biB7XHJcbiAgMCUsXHJcbiAgNjAlLFxyXG4gIDc1JSxcclxuICA5MCUsXHJcbiAgMTAwJSB7IGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigyMTUsIDYxMCwgMzU1LCAxKTsgfVxyXG4gIDAlIHsgb3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAtMzAwMHB4LCAwKTsgfVxyXG4gIDYwJSB7IG9wYWNpdHk6IDE7IHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMjVweCwgMCk7IH1cclxuICA3NSUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIC0xMHB4LCAwKTsgfVxyXG4gIDkwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgNXB4LCAwKTsgfVxyXG4gIDEwMCUgeyB0cmFuc2Zvcm06IG5vbmU7IH1cclxufVxyXG5cclxuQGtleWZyYW1lcyBwdWxzZSB7XHJcbiAgZnJvbSB7IHRyYW5zZm9ybTogc2NhbGUzZCgxLCAxLCAxKTsgfVxyXG4gIDUwJSB7IHRyYW5zZm9ybTogc2NhbGUzZCgxLjIsIDEuMiwgMS4yKTsgfVxyXG4gIHRvIHsgdHJhbnNmb3JtOiBzY2FsZTNkKDEsIDEsIDEpOyB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgc2Nyb2xsIHtcclxuICAwJSB7IG9wYWNpdHk6IDA7IH1cclxuICAxMCUgeyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCkgfVxyXG4gIDEwMCUgeyBvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTBweCk7IH1cclxufVxyXG5cclxuQGtleWZyYW1lcyBvcGFjaXR5IHtcclxuICAwJSB7IG9wYWNpdHk6IDA7IH1cclxuICA1MCUgeyBvcGFjaXR5OiAwOyB9XHJcbiAgMTAwJSB7IG9wYWNpdHk6IDE7IH1cclxufVxyXG5cclxuLy8gIHNwaW4gZm9yIHBhZ2luYXRpb25cclxuQGtleWZyYW1lcyBzcGluIHtcclxuICBmcm9tIHsgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7IH1cclxuICB0byB7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IH1cclxufVxyXG5cclxuQGtleWZyYW1lcyB0b29sdGlwIHtcclxuICAwJSB7IG9wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIDZweCk7IH1cclxuICAxMDAlIHsgb3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgMCk7IH1cclxufVxyXG5cclxuQGtleWZyYW1lcyBsb2FkaW5nLWJhciB7XHJcbiAgMCUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTEwMCUpIH1cclxuICA0MCUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCkgfVxyXG4gIDYwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKSB9XHJcbiAgMTAwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDAlKSB9XHJcbn1cclxuXHJcbi8vIEFycm93IG1vdmUgbGVmdFxyXG5Aa2V5ZnJhbWVzIGFycm93LW1vdmUtcmlnaHQge1xyXG4gIDAlIHsgb3BhY2l0eTogMCB9XHJcbiAgMTAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0xMDAlKTsgb3BhY2l0eTogMCB9XHJcbiAgMTAwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKTsgb3BhY2l0eTogMSB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgYXJyb3ctbW92ZS1sZWZ0IHtcclxuICAwJSB7IG9wYWNpdHk6IDAgfVxyXG4gIDEwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDAlKTsgb3BhY2l0eTogMCB9XHJcbiAgMTAwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKTsgb3BhY2l0eTogMSB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgc2xpZGVJblVwIHtcclxuICBmcm9tIHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMTAwJSwgMCk7XHJcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xyXG4gIH1cclxuXHJcbiAgdG8ge1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcclxuICB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgc2xpZGVPdXREb3duIHtcclxuICBmcm9tIHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMCwgMCk7XHJcbiAgfVxyXG5cclxuICB0byB7XHJcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDIwJSwgMCk7XHJcbiAgfVxyXG59XHJcbiIsIi8vIEhlYWRlclxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLmhlYWRlci1sb2dvLFxyXG4ubWVudS0tdG9nZ2xlLFxyXG4uc2VhcmNoLXRvZ2dsZSB7XHJcbiAgei1pbmRleDogMTU7XHJcbn1cclxuXHJcbi5oZWFkZXIge1xyXG4gIGJveC1zaGFkb3c6IDAgMXB4IDE2cHggMCByZ2JhKDAsIDAsIDAsIDAuMyk7XHJcbiAgcGFkZGluZzogMCAxNnB4O1xyXG4gIHBvc2l0aW9uOiBzdGlja3k7XHJcbiAgdG9wOiAwO1xyXG4gIHRyYW5zaXRpb246IGFsbCAwLjRzIGVhc2UtaW4tb3V0O1xyXG4gIHotaW5kZXg6IDEwO1xyXG5cclxuICAmLXdyYXAgeyBoZWlnaHQ6ICRoZWFkZXItaGVpZ2h0OyB9XHJcblxyXG4gICYtbG9nbyB7XHJcbiAgICBjb2xvcjogI2ZmZiAhaW1wb3J0YW50O1xyXG4gICAgaGVpZ2h0OiAzMHB4O1xyXG5cclxuICAgIGltZyB7IG1heC1oZWlnaHQ6IDEwMCU7IH1cclxuICB9XHJcbn1cclxuXHJcbi8vIG5vdCBoYXZlIGxvZ29cclxuLm5vdC1sb2dvIC5oZWFkZXItbG9nbyB7IGhlaWdodDogYXV0byAhaW1wb3J0YW50IH1cclxuXHJcbi8vIEhlYWRlciBsaW5lIHNlcGFyYXRlXHJcbi5oZWFkZXItbGluZSB7XHJcbiAgaGVpZ2h0OiAkaGVhZGVyLWhlaWdodDtcclxuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIC4zKTtcclxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG59XHJcblxyXG4vLyBIZWFkZXIgRm9sbG93IE1vcmVcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLmZvbGxvdy1tb3JlIHtcclxuICB0cmFuc2l0aW9uOiB3aWR0aCAuNHMgZWFzZTtcclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIHdpZHRoOiAwO1xyXG59XHJcblxyXG5ib2R5LmlzLXNob3dGb2xsb3dNb3JlIHtcclxuICAuZm9sbG93LW1vcmUgeyB3aWR0aDogYXV0byB9XHJcbiAgLmZvbGxvdy10b2dnbGUgeyBjb2xvcjogdmFyKC0taGVhZGVyLWNvbG9yLWhvdmVyKSB9XHJcbiAgLmZvbGxvdy10b2dnbGU6OmJlZm9yZSB7IGNvbnRlbnQ6IFwiXFxlNWNkXCIgfVxyXG59XHJcblxyXG4vLyBIZWFkZXIgbWVudVxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLm5hdiB7XHJcbiAgcGFkZGluZy10b3A6IDhweDtcclxuICBwYWRkaW5nLWJvdHRvbTogOHB4O1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG5cclxuICB1bCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAyMHB4O1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcbiAgfVxyXG59XHJcblxyXG4uaGVhZGVyLWxlZnQgYSxcclxuLm5hdiB1bCBsaSBhIHtcclxuICBib3JkZXItcmFkaXVzOiAzcHg7XHJcbiAgY29sb3I6IHZhcigtLWhlYWRlci1jb2xvcik7XHJcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgbGluZS1oZWlnaHQ6IDMwcHg7XHJcbiAgcGFkZGluZzogMCA4cHg7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcclxuXHJcbiAgJi5hY3RpdmUsXHJcbiAgJjpob3ZlciB7XHJcbiAgICBjb2xvcjogdmFyKC0taGVhZGVyLWNvbG9yLWhvdmVyKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGJ1dHRvbi1uYXZcclxuLm1lbnUtLXRvZ2dsZSB7XHJcbiAgaGVpZ2h0OiA0OHB4O1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjRzO1xyXG4gIHdpZHRoOiA0OHB4O1xyXG5cclxuICBzcGFuIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhlYWRlci1jb2xvcik7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIGhlaWdodDogMnB4O1xyXG4gICAgbGVmdDogMTRweDtcclxuICAgIG1hcmdpbi10b3A6IC0xcHg7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDUwJTtcclxuICAgIHRyYW5zaXRpb246IC40cztcclxuICAgIHdpZHRoOiAyMHB4O1xyXG5cclxuICAgICY6Zmlyc3QtY2hpbGQgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAtNnB4KTsgfVxyXG4gICAgJjpsYXN0LWNoaWxkIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgNnB4KTsgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gSGVhZGVyIG1lbnVcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbkBtZWRpYSAjeyRtZC1hbmQtZG93bn0ge1xyXG4gIC5oZWFkZXItbGVmdCB7IGZsZXgtZ3JvdzogMSAhaW1wb3J0YW50OyB9XHJcbiAgLmhlYWRlci1sb2dvIHNwYW4geyBmb250LXNpemU6IDI0cHggfVxyXG5cclxuICAvLyBzaG93IG1lbnUgbW9iaWxlXHJcbiAgYm9keS5pcy1zaG93TmF2TW9iIHtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcblxyXG4gICAgLnNpZGVOYXYgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCk7IH1cclxuXHJcbiAgICAubWVudS0tdG9nZ2xlIHtcclxuICAgICAgYm9yZGVyOiAwO1xyXG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7XHJcblxyXG4gICAgICBzcGFuOmZpcnN0LWNoaWxkIHsgdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpIHRyYW5zbGF0ZSgwLCAwKTsgfVxyXG4gICAgICBzcGFuOm50aC1jaGlsZCgyKSB7IHRyYW5zZm9ybTogc2NhbGVYKDApOyB9XHJcbiAgICAgIHNwYW46bGFzdC1jaGlsZCB7IHRyYW5zZm9ybTogcm90YXRlKC00NWRlZykgdHJhbnNsYXRlKDAsIDApOyB9XHJcbiAgICB9XHJcblxyXG4gICAgLmhlYWRlciAuYnV0dG9uLXNlYXJjaC0tdG9nZ2xlIHsgZGlzcGxheTogbm9uZTsgfVxyXG4gICAgLm1haW4sIC5mb290ZXIgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTI1JSkgIWltcG9ydGFudDsgfVxyXG4gIH1cclxufVxyXG4iLCIvLyBGb290ZXJcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi5mb290ZXIge1xyXG4gIGNvbG9yOiAjODg4O1xyXG5cclxuICBhIHtcclxuICAgIGNvbG9yOiB2YXIoLS1mb290ZXItY29sb3ItbGluayk7XHJcbiAgICAmOmhvdmVyIHsgY29sb3I6ICNmZmYgfVxyXG4gIH1cclxuXHJcbiAgJi1saW5rcyB7XHJcbiAgICBwYWRkaW5nOiAzZW0gMCAyLjVlbTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMxMzEzMTM7XHJcbiAgfVxyXG5cclxuICAuZm9sbG93ID4gYSB7XHJcbiAgICBiYWNrZ3JvdW5kOiAjMzMzO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBoZWlnaHQ6IDQwcHg7XHJcbiAgICBsaW5lLWhlaWdodDogNDBweDtcclxuICAgIG1hcmdpbjogMCA1cHggOHB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgd2lkdGg6IDQwcHg7XHJcblxyXG4gICAgJjpob3ZlciB7XHJcbiAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gICAgICBib3gtc2hhZG93OiBpbnNldCAwIDAgMCAycHggIzMzMztcclxuICAgIH1cclxuICB9XHJcblxyXG4gICYtY29weSB7XHJcbiAgICBwYWRkaW5nOiAzZW0gMDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XHJcbiAgfVxyXG59XHJcblxyXG4uZm9vdGVyLW1lbnUge1xyXG4gIGxpIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIGxpbmUtaGVpZ2h0OiAyNHB4O1xyXG4gICAgbWFyZ2luOiAwIDhweDtcclxuXHJcbiAgICAvKiBzdHlsZWxpbnQtZGlzYWJsZS1uZXh0LWxpbmUgKi9cclxuICAgIGEgeyBjb2xvcjogIzg4OCB9XHJcbiAgfVxyXG59XHJcbiIsIi8vIEhvbWUgUGFnZSBTdHlsZXNcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLmNvdmVyIHtcclxuICBwYWRkaW5nOiA0cHg7XHJcblxyXG4gICYtc3Rvcnkge1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIGhlaWdodDogMjUwcHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuXHJcbiAgICAmOmhvdmVyIC5jb3Zlci1oZWFkZXIgeyBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCB0cmFuc3BhcmVudCAwLCByZ2JhKDAsIDAsIDAsIDAuNikgNTAlLCByZ2JhKDAsIDAsIDAsIDAuOSkgMTAwJSkgfVxyXG5cclxuICAgICYuZmlydHMgeyBoZWlnaHQ6IDgwdmggfVxyXG4gIH1cclxuXHJcbiAgJi1pbWcsXHJcbiAgJi1saW5rIHtcclxuICAgIGJvdHRvbTogNHB4O1xyXG4gICAgbGVmdDogNHB4O1xyXG4gICAgcmlnaHQ6IDRweDtcclxuICAgIHRvcDogNHB4O1xyXG4gIH1cclxuXHJcbiAgLy8gc3R5bGVsaW50LWRpc2FibGUtbmV4dC1saW5lXHJcbiAgJi1oZWFkZXIge1xyXG4gICAgYm90dG9tOiA0cHg7XHJcbiAgICBsZWZ0OiA0cHg7XHJcbiAgICByaWdodDogNHB4O1xyXG4gICAgcGFkZGluZzogNTBweCAzLjg0NjE1Mzg0NiUgMjBweDtcclxuICAgIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHJnYmEoMCwgMCwgMCwgMCkgMCwgcmdiYSgwLCAwLCAwLCAwLjcpIDUwJSwgcmdiYSgwLCAwLCAwLCAuOSkgMTAwJSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBIb21lIFBhZ2UgUGVyc29uYWwgQ292ZXIgcGFnZVxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4uaG0tY292ZXIge1xyXG4gIHBhZGRpbmc6IDMwcHggMDtcclxuICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuXHJcbiAgJi10aXRsZSB7XHJcbiAgICBmb250LXNpemU6IDIuNXJlbTtcclxuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XHJcbiAgICBsaW5lLWhlaWdodDogMTtcclxuICB9XHJcblxyXG4gICYtZGVzIHtcclxuICAgIG1heC13aWR0aDogNjAwcHg7XHJcbiAgICBmb250LXNpemU6IDEuMjVyZW07XHJcbiAgfVxyXG59XHJcblxyXG4uaG0tc3Vic2NyaWJlIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcclxuICBib3JkZXItcmFkaXVzOiAzcHg7XHJcbiAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgMnB4IGhzbGEoMCwgMCUsIDEwMCUsIC41KTtcclxuICBjb2xvcjogI2ZmZjtcclxuICBkaXNwbGF5OiBibG9jaztcclxuICBmb250LXNpemU6IDIwcHg7XHJcbiAgZm9udC13ZWlnaHQ6IDQwMDtcclxuICBsaW5lLWhlaWdodDogMS4yO1xyXG4gIG1hcmdpbi10b3A6IDUwcHg7XHJcbiAgbWF4LXdpZHRoOiAzMDBweDtcclxuICBwYWRkaW5nOiAxNXB4IDEwcHg7XHJcbiAgdHJhbnNpdGlvbjogYWxsIC4zcztcclxuICB3aWR0aDogMTAwJTtcclxuXHJcbiAgJjpob3ZlciB7XHJcbiAgICBib3gtc2hhZG93OiBpbnNldCAwIDAgMCAycHggI2ZmZjtcclxuICB9XHJcbn1cclxuXHJcbi5obS1kb3duIHtcclxuICBhbmltYXRpb24tZHVyYXRpb246IDEuMnMgIWltcG9ydGFudDtcclxuICBib3R0b206IDYwcHg7XHJcbiAgY29sb3I6IGhzbGEoMCwgMCUsIDEwMCUsIC41KTtcclxuICBsZWZ0OiAwO1xyXG4gIG1hcmdpbjogMCBhdXRvO1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICByaWdodDogMDtcclxuICB3aWR0aDogNzBweDtcclxuICB6LWluZGV4OiAxMDA7XHJcblxyXG4gIHN2ZyB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIGZpbGw6IGN1cnJlbnRjb2xvcjtcclxuICAgIGhlaWdodDogYXV0bztcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gIH1cclxufVxyXG5cclxuLy8gTWVkaWEgUXVlcnlcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuQG1lZGlhICN7JG1kLWFuZC11cH0ge1xyXG4gIC5jb3ZlciB7XHJcbiAgICBoZWlnaHQ6IDcwdmg7XHJcblxyXG4gICAgJi1zdG9yeSB7XHJcbiAgICAgIGhlaWdodDogNTAlO1xyXG4gICAgICB3aWR0aDogMzMuMzMzMzMlO1xyXG5cclxuICAgICAgJi5maXJ0cyB7XHJcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgIHdpZHRoOiA2Ni42NjY2NiU7XHJcblxyXG4gICAgICAgIC5jb3Zlci10aXRsZSB7IGZvbnQtc2l6ZTogMi41cmVtIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gSG9tZSBwYWdlXHJcbiAgLmhtLWNvdmVyLXRpdGxlIHsgZm9udC1zaXplOiAzLjVyZW0gfVxyXG59XHJcbiIsIi8vIHBvc3QgY29udGVudFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLnBvc3Qge1xuICAvLyB0aXRsZVxuICAmLXRpdGxlIHtcbiAgICBjb2xvcjogIzAwMDtcbiAgICBsaW5lLWhlaWdodDogMS4yO1xuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XG4gICAgbWF4LXdpZHRoOiAxMDAwcHg7XG4gIH1cblxuICAmLWV4Y2VycHQge1xuICAgIGNvbG9yOiAjNTU1O1xuICAgIGZvbnQtZmFtaWx5OiAkc2VjdW5kYXJ5LWZvbnQ7XG4gICAgZm9udC13ZWlnaHQ6IDMwMDtcbiAgICBsZXR0ZXItc3BhY2luZzogLS4wMTJlbTtcbiAgICBsaW5lLWhlaWdodDogMS42O1xuICB9XG5cbiAgLy8gYXV0aG9yXG4gICYtYXV0aG9yLXNvY2lhbCB7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICBtYXJnaW4tbGVmdDogMnB4O1xuICAgIHBhZGRpbmc6IDAgM3B4O1xuICB9XG5cbiAgJi1pbWFnZSB7IG1hcmdpbi10b3A6IDMwcHggfVxufVxuXG4vLyBBdmF0YXJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4uYXZhdGFyLWltYWdlIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuXG4gIEBleHRlbmQgLnUtcm91bmQ7XG5cbiAgJi0tc21hbGxlciB7XG4gICAgd2lkdGg6IDUwcHg7XG4gICAgaGVpZ2h0OiA1MHB4O1xuICB9XG59XG5cbi8vIHBvc3QgY29udGVudCBib2R5XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLnBvc3QtYm9keSB7XG4gIGE6bm90KC5idXR0b24pOm5vdCguYnV0dG9uLS1jaXJjbGUpOm5vdCgucHJldi1uZXh0LWxpbmspIHtcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHRyYW5zaXRpb246IGFsbCAyNTBtcztcbiAgICBib3gtc2hhZG93OiBpbnNldCAwIC0zcHggMCB2YXIoLS1wb3N0LWNvbG9yLWxpbmspO1xuXG4gICAgJjpob3ZlciB7XG4gICAgICBib3gtc2hhZG93OiBpbnNldCAwIC0xcmVtIDAgdmFyKC0tcG9zdC1jb2xvci1saW5rKVxuICAgIH1cbiAgfVxuXG4gIGltZyB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xuICB9XG5cbiAgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiB7XG4gICAgbWFyZ2luLXRvcDogMzBweDtcbiAgICBmb250LXdlaWdodDogOTAwO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBjb2xvcjogIzAwMDtcbiAgICBsZXR0ZXItc3BhY2luZzogLS4wMmVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjI7XG4gIH1cblxuICBoMiB7IG1hcmdpbi10b3A6IDM1cHggfVxuXG4gIHAge1xuICAgIGZvbnQtZmFtaWx5OiAkc2VjdW5kYXJ5LWZvbnQ7XG4gICAgZm9udC1zaXplOiAxLjEyNXJlbTtcbiAgICBmb250LXdlaWdodDogNDAwO1xuICAgIGxldHRlci1zcGFjaW5nOiAtLjAwM2VtO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjc7XG4gICAgbWFyZ2luLXRvcDogMjVweDtcbiAgfVxuXG4gIHVsLFxuICBvbCB7XG4gICAgY291bnRlci1yZXNldDogcG9zdDtcbiAgICBmb250LWZhbWlseTogJHNlY3VuZGFyeS1mb250O1xuICAgIGZvbnQtc2l6ZTogMS4xMjVyZW07XG4gICAgbWFyZ2luLXRvcDogMjBweDtcblxuICAgIGxpIHtcbiAgICAgIGxldHRlci1zcGFjaW5nOiAtLjAwM2VtO1xuICAgICAgbWFyZ2luLWJvdHRvbTogMTRweDtcbiAgICAgIG1hcmdpbi1sZWZ0OiAzMHB4O1xuXG4gICAgICAmOjpiZWZvcmUge1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiAtNzhweDtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0ZXh0LWFsaWduOiByaWdodDtcbiAgICAgICAgd2lkdGg6IDc4cHg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdWwgbGk6OmJlZm9yZSB7XG4gICAgY29udGVudDogJ1xcMjAyMic7XG4gICAgZm9udC1zaXplOiAxNi44cHg7XG4gICAgcGFkZGluZy1yaWdodDogMTVweDtcbiAgICBwYWRkaW5nLXRvcDogM3B4O1xuICB9XG5cbiAgb2wgbGk6OmJlZm9yZSB7XG4gICAgY29udGVudDogY291bnRlcihwb3N0KSBcIi5cIjtcbiAgICBjb3VudGVyLWluY3JlbWVudDogcG9zdDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAxMnB4O1xuICB9XG59XG5cbi8vIENsYXNzIG9mIEdob3N0XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBmaXNydCBwXG4vLyAucG9zdC1ib2R5LXdyYXAgPiBwOmZpcnN0LW9mLXR5cGUge1xuLy8gICBtYXJnaW4tdG9wOiAzMHB4O1xuXG4vLyAgIC8vICY6OmZpcnN0LWxldHRlciB7XG4vLyAgIC8vICAgZmxvYXQ6IGxlZnQ7XG4vLyAgIC8vICAgZm9udC1zaXplOiA1NXB4O1xuLy8gICAvLyAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbi8vICAgLy8gICBmb250LXdlaWdodDogOTAwO1xuLy8gICAvLyAgIGxldHRlci1zcGFjaW5nOiAtLjAzZW07XG4vLyAgIC8vICAgbGluZS1oZWlnaHQ6IC44Mztcbi8vICAgLy8gICBtYXJnaW4tYm90dG9tOiAtLjA4ZW07XG4vLyAgIC8vICAgbWFyZ2luLXJpZ2h0OiA3cHg7XG4vLyAgIC8vICAgcGFkZGluZy10b3A6IDdweDtcbi8vICAgLy8gICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuLy8gICAvLyB9XG4vLyB9XG5cbi5wb3N0LWJvZHktd3JhcCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgLy8gJiA+IHA6Zmlyc3Qtb2YtdHlwZSB7IG1hcmdpbi10b3A6IDMwcHggfVxuXG4gIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYsIHAsXG4gIG9sLCB1bCwgaHIsIHByZSwgZGwsIGJsb2NrcXVvdGUsXG4gIC5wb3N0LXRhZ3MsIC5wcmV2LW5leHQsIC5tb2Itc2hhcmUsIC5rZy1lbWJlZC1jYXJkIHtcbiAgICBtaW4td2lkdGg6IDEwMCU7XG4gIH1cblxuICAmID4gdWwgeyBtYXJnaW4tdG9wOiAzNXB4IH1cblxuICAmID4gaWZyYW1lLFxuICAmID4gaW1nLFxuICAua2ctaW1hZ2UtY2FyZCxcbiAgLmtnLWNhcmQsXG4gIC5rZy1nYWxsZXJ5LWNhcmQsXG4gIC5rZy1lbWJlZC1jYXJkIHtcbiAgICBtYXJnaW4tdG9wOiAzMHB4ICFpbXBvcnRhbnRcbiAgfVxufVxuXG4vLyBTaGFyZSBQb3N0XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLnNoYXJlUG9zdCB7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiA0MHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGUgIWltcG9ydGFudDtcbiAgdHJhbnNpdGlvbjogYWxsIC40cztcbiAgdG9wOiAzMHB4O1xuXG4gIC8qIHN0eWxlbGludC1kaXNhYmxlLW5leHQtbGluZSAqL1xuICBhIHtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBtYXJnaW46IDhweCAwIDA7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gIH1cblxuICAuaS1jaGF0IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICAgIGJvcmRlcjogMnB4IHNvbGlkICNiYmI7XG4gICAgY29sb3I6ICNiYmI7XG4gIH1cbn1cblxuLy8gUG9zdCBSZWxhdGVkXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4ucG9zdC1yZWxhdGVkIHtcbiAgcGFkZGluZzogNDBweCAwO1xufVxuXG4vLyBQb3N0IG1vYmlsZSBzaGFyZVxuLyogc3R5bGVsaW50LWRpc2FibGUtbmV4dC1saW5lICovXG4ubW9iLXNoYXJlIHtcbiAgLm1hcGFjaGUtc2hhcmUge1xuICAgIGhlaWdodDogNDBweDtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYm94LXNoYWRvdzogbm9uZSAhaW1wb3J0YW50O1xuICB9XG5cbiAgLnNoYXJlLXRpdGxlIHtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgbWFyZ2luLWxlZnQ6IDEwcHhcbiAgfVxufVxuXG4vLyBQcmV2aXVzIGFuZCBuZXh0IGFydGljbGVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vKiBzdHlsZWxpbnQtZGlzYWJsZS1uZXh0LWxpbmUgKi9cbi5wcmV2LW5leHQge1xuICAmLXNwYW4ge1xuICAgIGNvbG9yOiB2YXIoLS1jb21wb3NpdGUtY29sb3IpO1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuXG4gICAgaSB7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgIHRyYW5zaXRpb246IGFsbCAyNzdtcyBjdWJpYy1iZXppZXIoMC4xNiwgMC4wMSwgMC43NywgMSlcbiAgICB9XG4gIH1cblxuICAmLXRpdGxlIHtcbiAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gICAgaGVpZ2h0OiAyZW07XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBsaW5lLWhlaWdodDogMSAhaW1wb3J0YW50O1xuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzICFpbXBvcnRhbnQ7XG4gICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbCAhaW1wb3J0YW50O1xuICAgIC13ZWJraXQtbGluZS1jbGFtcDogMiAhaW1wb3J0YW50O1xuICAgIGRpc3BsYXk6IC13ZWJraXQtYm94ICFpbXBvcnRhbnQ7XG4gIH1cblxuICAvLyAmLWFycm93IHtcbiAgLy8gICBjb2xvcjogI2JiYjtcbiAgLy8gICBmb250LXNpemU6IDQwcHg7XG4gIC8vICAgbGluZS1oZWlnaHQ6IDE7XG4gIC8vIH1cblxuICAmLWxpbms6aG92ZXIge1xuICAgIC8vIC5wcmV2LW5leHQtdGl0bGUgeyBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNTQpIH1cbiAgICAuYXJyb3ctcmlnaHQgeyBhbmltYXRpb246IGFycm93LW1vdmUtcmlnaHQgMC41cyBlYXNlLWluLW91dCBmb3J3YXJkcyB9XG4gICAgLmFycm93LWxlZnQgeyBhbmltYXRpb246IGFycm93LW1vdmUtbGVmdCAwLjVzIGVhc2UtaW4tb3V0IGZvcndhcmRzIH1cbiAgfVxufVxuXG4vLyBJbWFnZSBwb3N0IEZvcm1hdFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi5jYy1pbWFnZSB7XG4gIG1heC1oZWlnaHQ6IDEwMHZoO1xuICBtaW4taGVpZ2h0OiA2MDBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcblxuICAmLWhlYWRlciB7XG4gICAgcmlnaHQ6IDA7XG4gICAgYm90dG9tOiAxMCU7XG4gICAgbGVmdDogMDtcbiAgfVxuXG4gICYtZmlndXJlIGltZyB7XG4gICAgb3BhY2l0eTogLjQ7XG4gICAgb2JqZWN0LWZpdDogY292ZXI7XG4gICAgd2lkdGg6IDEwMCVcbiAgfVxuXG4gIC5wb3N0LWhlYWRlciB7IG1heC13aWR0aDogNzAwcHggfVxuICAucG9zdC10aXRsZSwgLnBvc3QtZXhjZXJwdCB7IGNvbG9yOiAjZmZmIH1cbn1cblxuLy8gVmlkZW8gcG9zdCBGb3JtYXRcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi5jYy12aWRlbyB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XG4gIHBhZGRpbmc6IDQwcHggMCAzMHB4O1xuXG4gIC5wb3N0LWV4Y2VycHQgeyBjb2xvcjogI2FhYTsgZm9udC1zaXplOiAxcmVtIH1cbiAgLnBvc3QtdGl0bGUgeyBjb2xvcjogI2ZmZjsgZm9udC1zaXplOiAxLjhyZW0gfVxuICAua2ctZW1iZWQtY2FyZCwgLnZpZGVvLXJlc3BvbnNpdmUgeyBtYXJnaW4tdG9wOiAwIH1cblxuICAvLyBWaWRlbyByZWxhdGVkXG4gIC8vIC5zdG9yeSBoMiB7XG4gIC8vICAgY29sb3I6ICNmZmY7XG4gIC8vICAgbWFyZ2luOiAwO1xuICAvLyAgIGZvbnQtc2l6ZTogMS4xMjVyZW0gIWltcG9ydGFudDtcbiAgLy8gICBmb250LXdlaWdodDogNzAwICFpbXBvcnRhbnQ7XG4gIC8vICAgbWF4LWhlaWdodDogMi41ZW07XG4gIC8vICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgLy8gICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsICFpbXBvcnRhbnQ7XG4gIC8vICAgLXdlYmtpdC1saW5lLWNsYW1wOiAyICFpbXBvcnRhbnQ7XG4gIC8vICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXMgIWltcG9ydGFudDtcbiAgLy8gICBkaXNwbGF5OiAtd2Via2l0LWJveCAhaW1wb3J0YW50O1xuICAvLyB9XG5cbiAgLy8gLmZsb3ctbWV0YSwgLnN0b3J5LWxvd2VyLCBmaWdjYXB0aW9uIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50IH1cbiAgLy8gLnN0b3J5LWltYWdlIHsgaGVpZ2h0OiAxNzBweCAhaW1wb3J0YW50OyB9XG5cbiAgLm1lZGlhLXR5cGUge1xuICAgIGhlaWdodDogMzRweCAhaW1wb3J0YW50O1xuICAgIHdpZHRoOiAzNHB4ICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuLy8gY2hhbmdlIHRoZSBkZXNpZ24gYWNjb3JkaW5nIHRvIHRoZSBjbGFzc2VzIG9mIHRoZSBib2R5XG5ib2R5IHtcbiAgJi5pcy1hcnRpY2xlIC5tYWluIHsgbWFyZ2luLWJvdHRvbTogMCB9XG4gICYuc2hhcmUtbWFyZ2luIC5zaGFyZVBvc3QgeyB0b3A6IC02MHB4IH1cbiAgJi5zaG93LWNhdGVnb3J5IC5wb3N0LXByaW1hcnktdGFnIHsgZGlzcGxheTogYmxvY2sgIWltcG9ydGFudCB9XG5cbiAgJi5pcy1hcnRpY2xlLXNpbmdsZSB7XG4gICAgLnBvc3QtYm9keS13cmFwIHsgbWFyZ2luLWxlZnQ6IDAgIWltcG9ydGFudCB9XG4gICAgLnNoYXJlUG9zdCB7IGxlZnQ6IC0xMDBweCB9XG4gICAgLmtnLXdpZHRoLWZ1bGwgLmtnLWltYWdlIHsgbWF4LXdpZHRoOiAxMDB2dyB9XG4gICAgLmtnLXdpZHRoLXdpZGUgLmtnLWltYWdlIHsgbWF4LXdpZHRoOiAxMDQwcHggfVxuICB9XG59XG5cbkBtZWRpYSAjeyRtZC1hbmQtZG93bn0ge1xuICAucG9zdC1ib2R5LXdyYXAge1xuICAgIHEge1xuICAgICAgZm9udC1zaXplOiAyMHB4ICFpbXBvcnRhbnQ7XG4gICAgICBsZXR0ZXItc3BhY2luZzogLS4wMDhlbSAhaW1wb3J0YW50O1xuICAgICAgbGluZS1oZWlnaHQ6IDEuNCAhaW1wb3J0YW50O1xuICAgIH1cblxuICAgIC8vICYgPiBwOmZpcnN0LW9mLXR5cGU6OmZpcnN0LWxldHRlciB7XG4gICAgLy8gICBmb250LXNpemU6IDMwcHg7XG4gICAgLy8gICBtYXJnaW4tcmlnaHQ6IDZweDtcbiAgICAvLyAgIHBhZGRpbmctdG9wOiAzLjVweDtcbiAgICAvLyB9XG5cbiAgICAua2ctaW1hZ2UtY2FyZCBpbWcgeyBtYXgtd2lkdGg6IDEwMCU7IH1cblxuICAgIG9sLCB1bCwgcCB7XG4gICAgICBmb250LXNpemU6IDFyZW07XG4gICAgICBsZXR0ZXItc3BhY2luZzogLS4wMDRlbTtcbiAgICAgIGxpbmUtaGVpZ2h0OiAxLjU4O1xuICAgIH1cblxuICAgIGlmcmFtZSB7IHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7IH1cbiAgfVxuXG4gIC8vIFBvc3QgUmVsYXRlZFxuICAucG9zdC1yZWxhdGVkIHtcbiAgICBwYWRkaW5nLWxlZnQ6IDhweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiA4cHg7XG4gIH1cblxuICAvLyBJbWFnZSBwb3N0IGZvcm1hdFxuICAuY2MtaW1hZ2UtZmlndXJlIHtcbiAgICB3aWR0aDogMjAwJTtcbiAgICBtYXgtd2lkdGg6IDIwMCU7XG4gICAgbWFyZ2luOiAwIGF1dG8gMCAtNTAlO1xuICB9XG5cbiAgLmNjLWltYWdlLWhlYWRlciB7IGJvdHRvbTogMjRweCB9XG4gIC5jYy1pbWFnZSAucG9zdC1leGNlcnB0IHsgZm9udC1zaXplOiAxOHB4OyB9XG5cbiAgLy8gdmlkZW8gcG9zdCBmb3JtYXRcbiAgLmNjLXZpZGVvIHtcbiAgICBwYWRkaW5nOiAyMHB4IDA7XG5cbiAgICAmLWVtYmVkIHtcbiAgICAgIG1hcmdpbi1sZWZ0OiAtMTZweDtcbiAgICAgIG1hcmdpbi1yaWdodDogLTE1cHg7XG4gICAgfVxuXG4gICAgLnBvc3QtaGVhZGVyIHsgbWFyZ2luLXRvcDogMTBweCB9XG4gIH1cbn1cblxuQG1lZGlhICN7JGxnLWFuZC1kb3dufSB7XG4gIGJvZHkuaXMtYXJ0aWNsZSB7XG4gICAgLmNvbC1sZWZ0IHsgbWF4LXdpZHRoOiAxMDAlIH1cbiAgICAvLyAuc2lkZWJhciB7IGRpc3BsYXk6IG5vbmU7IH1cbiAgfVxufVxuXG5AbWVkaWEgI3skbWQtYW5kLXVwfSB7XG4gIC8vIEltYWdlIHBvc3QgRm9ybWF0XG4gIC5jYy1pbWFnZSAucG9zdC10aXRsZSB7IGZvbnQtc2l6ZTogMy4ycmVtIH1cbn1cblxuQG1lZGlhICN7JGxnLWFuZC11cH0ge1xuICBib2R5LmlzLWFydGljbGUgLnBvc3QtYm9keS13cmFwIHsgbWFyZ2luLWxlZnQ6IDcwcHg7IH1cblxuICBib2R5LmlzLXZpZGVvLFxuICBib2R5LmlzLWltYWdlIHtcbiAgICAucG9zdC1hdXRob3IgeyBtYXJnaW4tbGVmdDogNzBweCB9XG4gICAgLy8gLnNoYXJlUG9zdCB7IHRvcDogLTg1cHggfVxuICB9XG59XG5cbkBtZWRpYSAjeyR4bC1hbmQtdXB9IHtcbiAgYm9keS5oYXMtdmlkZW8tZml4ZWQge1xuICAgIC5jYy12aWRlby1lbWJlZCB7XG4gICAgICBib3R0b206IDIwcHg7XG4gICAgICBib3gtc2hhZG93OiAwIDAgMTBweCAwIHJnYmEoMCwgMCwgMCwgLjUpO1xuICAgICAgaGVpZ2h0OiAyMDNweDtcbiAgICAgIHBhZGRpbmctYm90dG9tOiAwO1xuICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgcmlnaHQ6IDIwcHg7XG4gICAgICB3aWR0aDogMzYwcHg7XG4gICAgICB6LWluZGV4OiA4O1xuICAgIH1cblxuICAgIC5jYy12aWRlby1jbG9zZSB7XG4gICAgICBiYWNrZ3JvdW5kOiAjMDAwO1xuICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgY29sb3I6ICNmZmY7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICBkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50O1xuICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgaGVpZ2h0OiAyNHB4O1xuICAgICAgbGVmdDogLTEwcHg7XG4gICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgIHBhZGRpbmctdG9wOiA1cHg7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICB0b3A6IC0xMHB4O1xuICAgICAgd2lkdGg6IDI0cHg7XG4gICAgICB6LWluZGV4OiA1O1xuICAgIH1cblxuICAgIC5jYy12aWRlby1jb250IHsgaGVpZ2h0OiA0NjVweDsgfVxuXG4gICAgLmNjLWltYWdlLWhlYWRlciB7IGJvdHRvbTogMjAlIH1cbiAgfVxufVxuIiwiLy8gc3R5bGVzIGZvciBzdG9yeVxuXG4uaHItbGlzdCB7XG4gIGJvcmRlcjogMDtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4wNzg1KTtcbiAgbWFyZ2luOiAyMHB4IDAgMDtcbiAgLy8gJjpmaXJzdC1jaGlsZCB7IG1hcmdpbi10b3A6IDVweCB9XG59XG5cbi5zdG9yeS1mZWVkIC5zdG9yeS1mZWVkLWNvbnRlbnQ6Zmlyc3QtY2hpbGQgLmhyLWxpc3Q6Zmlyc3QtY2hpbGQge1xuICBtYXJnaW4tdG9wOiA1cHg7XG59XG5cbi8vIG1lZGlhIHR5cGUgaWNvbiAoIHZpZGVvIC0gaW1hZ2UgKVxuLm1lZGlhLXR5cGUge1xuICAvLyBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGVuKCRwcmltYXJ5LWNvbG9yLCAxNSUpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC43KTtcbiAgY29sb3I6ICNmZmY7XG4gIGhlaWdodDogNDVweDtcbiAgbGVmdDogMTVweDtcbiAgdG9wOiAxNXB4O1xuICB3aWR0aDogNDVweDtcbiAgb3BhY2l0eTogLjk7XG5cbiAgLy8gQGV4dGVuZCAudS1iZ0NvbG9yO1xuICBAZXh0ZW5kIC51LWZvbnRTaXplTGFyZ2VyO1xuICBAZXh0ZW5kIC51LXJvdW5kO1xuICBAZXh0ZW5kIC51LWZsZXhDZW50ZXI7XG4gIEBleHRlbmQgLnUtZmxleENvbnRlbnRDZW50ZXI7XG59XG5cbi8vIEltYWdlIG92ZXJcbi5pbWFnZS1ob3ZlciB7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuN3M7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWigwKVxufVxuXG4vLyBub3QgaW1hZ2Vcbi5ub3QtaW1hZ2Uge1xuICBiYWNrZ3JvdW5kOiB1cmwoJy4uL2ltYWdlcy9ub3QtaW1hZ2UucG5nJyk7XG4gIGJhY2tncm91bmQtcmVwZWF0OiByZXBlYXQ7XG59XG5cbi8vIE1ldGFcbi5mbG93LW1ldGEge1xuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjU0KTtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcbn1cblxuLy8gcG9pbnRcbi5wb2ludCB7IG1hcmdpbjogMCA1cHggfVxuXG4vLyBTdG9yeSBEZWZhdWx0IGxpc3Rcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi5zdG9yeSB7XG4gICYtaW1hZ2Uge1xuICAgIGZsZXg6IDAgMCAgNDQlIC8qMzgwcHgqLztcbiAgICBoZWlnaHQ6IDIzNXB4O1xuICAgIG1hcmdpbi1yaWdodDogMzBweDtcblxuICAgICY6aG92ZXIgLmltYWdlLWhvdmVyIHsgdHJhbnNmb3JtOiBzY2FsZSgxLjAzKSB9XG4gIH1cblxuICAmLWxvd2VyIHsgZmxleC1ncm93OiAxIH1cblxuICAmLWV4Y2VycHQge1xuICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuODQpO1xuICAgIGZvbnQtZmFtaWx5OiAkc2VjdW5kYXJ5LWZvbnQ7XG4gICAgZm9udC13ZWlnaHQ6IDMwMDtcbiAgICBsaW5lLWhlaWdodDogMS41O1xuICB9XG5cbiAgJi1jYXRlZ29yeSB7IGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuODQpIH1cblxuICBoMiBhOmhvdmVyIHtcbiAgICAvLyBib3gtc2hhZG93OiBpbnNldCAwIC0ycHggMCByZ2JhKDAsIDE3MSwgMTA3LCAuNSk7XG4gICAgLy8gYm94LXNoYWRvdzogaW5zZXQgMCAtMnB4IDAgcmdiYSgkcHJpbWFyeS1jb2xvciwgLjUpO1xuICAgIC8vIGJveC1zaGFkb3c6IGluc2V0IDAgLTJweCAwIHZhcigtLXN0b3J5LWNvbG9yLWhvdmVyKTtcbiAgICAvLyBib3gtc2hhZG93OiBpbnNldCAwIC0ycHggMCByZ2JhKDAsIDAsIDAsIDAuNCk7XG4gICAgLy8gdHJhbnNpdGlvbjogYWxsIC4yNXM7XG4gICAgb3BhY2l0eTogLjY7XG4gIH1cbn1cblxuLy8gU3RvcnkgR3JpZFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLnN0b3J5LnN0b3J5LS1ncmlkIHtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgbWFyZ2luLWJvdHRvbTogMzBweDtcblxuICAuc3RvcnktaW1hZ2Uge1xuICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgIG1hcmdpbi1yaWdodDogMDtcbiAgICBoZWlnaHQ6IDIyMHB4O1xuICB9XG5cbiAgLm1lZGlhLXR5cGUge1xuICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICBoZWlnaHQ6IDQwcHg7XG4gICAgd2lkdGg6IDQwcHg7XG4gIH1cbn1cblxuLmNvdmVyLWNhdGVnb3J5IHsgY29sb3I6IHZhcigtLXN0b3J5LWNvdmVyLWNhdGVnb3J5LWNvbG9yKSB9XG5cbi8vIFN0b3J5IENhcmRcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi5zdG9yeS1jYXJkIHtcbiAgLnN0b3J5IHtcbiAgICAvLyBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgIC8vIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAvLyBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIC4wNCk7XG4gICAgLy8gYm94LXNoYWRvdzogMCAxcHggN3B4IHJnYmEoMCwgMCwgMCwgLjA1KTtcbiAgICBtYXJnaW4tdG9wOiAwICFpbXBvcnRhbnQ7XG5cbiAgICAvLyAmOmhvdmVyIC5zdG9yeS1pbWFnZSB7IGJveC1zaGFkb3c6IDAgMCAxNXB4IDRweCByZ2JhKDAsIDAsIDAsIC4xKSB9XG4gIH1cblxuICAvKiBzdHlsZWxpbnQtZGlzYWJsZS1uZXh0LWxpbmUgKi9cbiAgLnN0b3J5LWltYWdlIHtcbiAgICAvLyBib3gtc2hhZG93OiAwIDFweCAycHggcmdiYSgwLCAwLCAwLCAuMDcpO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjA0KTtcbiAgICBib3gtc2hhZG93OiAwIDFweCA3cHggcmdiYSgwLCAwLCAwLCAuMDUpO1xuICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmICFpbXBvcnRhbnQ7XG4gICAgdHJhbnNpdGlvbjogYWxsIDE1MG1zIGVhc2UtaW4tb3V0O1xuICAgIC8vIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIC4wNzg1KTtcbiAgICAvLyBib3JkZXItcmFkaXVzOiA0cHggNHB4IDAgMDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIGhlaWdodDogMjAwcHggIWltcG9ydGFudDtcblxuICAgIC5zdG9yeS1pbWctYmcgeyBtYXJnaW46IDEwcHggfVxuXG4gICAgJjpob3ZlciB7XG4gICAgICBib3gtc2hhZG93OiAwIDAgMTVweCA0cHggcmdiYSgwLCAwLCAwLCAuMSk7XG5cbiAgICAgIC5zdG9yeS1pbWctYmcgeyB0cmFuc2Zvcm06IG5vbmUgfVxuICAgIH1cbiAgfVxuXG4gIC5zdG9yeS1sb3dlciB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudCB9XG5cbiAgLnN0b3J5LWJvZHkge1xuICAgIHBhZGRpbmc6IDE1cHggNXB4O1xuICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuXG4gICAgaDIge1xuICAgICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbCAhaW1wb3J0YW50O1xuICAgICAgLXdlYmtpdC1saW5lLWNsYW1wOiAyICFpbXBvcnRhbnQ7XG4gICAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuOSk7XG4gICAgICBkaXNwbGF5OiAtd2Via2l0LWJveCAhaW1wb3J0YW50O1xuICAgICAgLy8gbGluZS1oZWlnaHQ6IDEuMSAhaW1wb3J0YW50O1xuICAgICAgbWF4LWhlaWdodDogMi40ZW0gIWltcG9ydGFudDtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcyAhaW1wb3J0YW50O1xuICAgICAgbWFyZ2luOiAwO1xuICAgIH1cbiAgfVxufVxuXG4vLyBTdG9yeSBTbWFsbFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLnN0b3J5LXNtYWxsIHtcbiAgJi1pbWcge1xuICAgIGhlaWdodDogMTcwcHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMCAhaW1wb3J0YW50O1xuICB9XG5cbiAgLyogc3R5bGVsaW50LWRpc2FibGUtbmV4dC1saW5lICovXG4gIC5pbWFnZS1ob3ZlciB7IHRyYW5zaXRpb246IGFsbCAuMjVzIH1cblxuICBoMyB7XG4gICAgY29sb3I6ICNmZmY7XG4gICAgbWF4LWhlaWdodDogMi41ZW07XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsICFpbXBvcnRhbnQ7XG4gICAgLXdlYmtpdC1saW5lLWNsYW1wOiAyICFpbXBvcnRhbnQ7XG4gICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXMgIWltcG9ydGFudDtcbiAgICBkaXNwbGF5OiAtd2Via2l0LWJveCAhaW1wb3J0YW50O1xuICAgIHRyYW5zaXRpb246IGFsbCAuMjVzO1xuICB9XG5cbiAgJjpob3ZlciB7XG4gICAgLmltYWdlLWhvdmVyIHsgb3BhY2l0eTogLjggfVxuICAgIGgzIHsgb3BhY2l0eTogLjYgfVxuICB9XG59XG5cbi8vIE1lZGlhIHF1ZXJ5IGFmdGVyIG1lZGl1bVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuQG1lZGlhICN7JG1kLWFuZC11cH0ge1xuICAvLyBzdG9yeSBncmlkXG4gIC5zdG9yeS5zdG9yeS0tZ3JpZCB7XG4gICAgLnN0b3J5LWxvd2VyIHtcbiAgICAgIG1heC1oZWlnaHQ6IDIuNmVtO1xuICAgICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcbiAgICAgIC13ZWJraXQtbGluZS1jbGFtcDogMjtcbiAgICAgIGRpc3BsYXk6IC13ZWJraXQtYm94O1xuICAgICAgbGluZS1oZWlnaHQ6IDEuMTtcbiAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgIH1cbiAgfVxufVxuXG4vLyBNZWRpYSBxdWVyeSBiZWZvcmUgbWVkaXVtXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQG1lZGlhICN7JG1kLWFuZC1kb3dufSB7XG4gIC8vIFN0b3J5IENvdmVyXG4gIC5jb3Zlci0tZmlydHMgLmNvdmVyLXN0b3J5IHsgaGVpZ2h0OiA1MDBweCB9XG5cbiAgLy8gc3RvcnkgZGVmYXVsdCBsaXN0XG4gIC5zdG9yeSB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBtYXJnaW4tdG9wOiAyMHB4O1xuXG4gICAgJi1pbWFnZSB7IGZsZXg6IDAgMCBhdXRvOyBtYXJnaW4tcmlnaHQ6IDAgfVxuICAgICYtYm9keSB7IG1hcmdpbi10b3A6IDEwcHggfVxuICB9XG59XG4iLCIvLyBBdXRob3IgcGFnZVxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLmF1dGhvciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNik7XHJcbiAgbWluLWhlaWdodDogMzUwcHg7XHJcblxyXG4gICYtYXZhdGFyIHtcclxuICAgIGhlaWdodDogODBweDtcclxuICAgIHdpZHRoOiA4MHB4O1xyXG4gIH1cclxuXHJcbiAgJi1tZXRhIHNwYW4ge1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgZm9udC1zaXplOiAxN3B4O1xyXG4gICAgZm9udC1zdHlsZTogaXRhbGljO1xyXG4gICAgbWFyZ2luOiAwIDI1cHggMTZweCAwO1xyXG4gICAgb3BhY2l0eTogLjg7XHJcbiAgICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XHJcbiAgfVxyXG5cclxuICAmLW5hbWUgeyBjb2xvcjogcmdiYSgwLCAwLCAwLCAuOCkgfVxyXG4gICYtYmlvIHsgbWF4LXdpZHRoOiA2MDBweDsgfVxyXG4gICYtbWV0YSBhOmhvdmVyIHsgb3BhY2l0eTogLjggIWltcG9ydGFudCB9XHJcbn1cclxuXHJcbi5jb3Zlci1vcGFjaXR5IHsgb3BhY2l0eTogLjUgfVxyXG5cclxuLmF1dGhvci5oYXMtLWltYWdlIHtcclxuICBjb2xvcjogI2ZmZiAhaW1wb3J0YW50O1xyXG4gIHRleHQtc2hhZG93OiAwIDAgMTBweCByZ2JhKDAsIDAsIDAsIC4zMyk7XHJcblxyXG4gIGEsXHJcbiAgLmF1dGhvci1uYW1lIHsgY29sb3I6ICNmZmY7IH1cclxuXHJcbiAgLmF1dGhvci1mb2xsb3cgYSB7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZDtcclxuICAgIGJvcmRlci1jb2xvcjogaHNsYSgwLCAwJSwgMTAwJSwgLjUpICFpbXBvcnRhbnQ7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgfVxyXG5cclxuICAudS1hY2NlbnRDb2xvci0taWNvbk5vcm1hbCB7IGZpbGw6ICNmZmY7IH1cclxufVxyXG5cclxuQG1lZGlhICN7JG1kLWFuZC1kb3dufSB7XHJcbiAgLmF1dGhvci1tZXRhIHNwYW4geyBkaXNwbGF5OiBibG9jazsgfVxyXG4gIC5hdXRob3ItaGVhZGVyIHsgZGlzcGxheTogYmxvY2s7IH1cclxuICAuYXV0aG9yLWF2YXRhciB7IG1hcmdpbjogMCBhdXRvIDIwcHg7IH1cclxufVxyXG5cclxuQG1lZGlhICN7JG1kLWFuZC11cH0ge1xyXG4gIGJvZHkuaGFzLWNvdmVyIC5hdXRob3IgeyBtaW4taGVpZ2h0OiA2MDBweCB9XHJcbn1cclxuIiwiLy8gU2VhcmNoXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4uc2VhcmNoIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgaGVpZ2h0OiAxMDAlO1xuICBoZWlnaHQ6IDEwMHZoO1xuICBsZWZ0OiAwO1xuICBwYWRkaW5nOiAwIDE2cHg7XG4gIHJpZ2h0OiAwO1xuICB0b3A6IDA7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTAwJSk7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuM3MgZWFzZTtcbiAgei1pbmRleDogOTtcblxuICAmLWZvcm0ge1xuICAgIG1heC13aWR0aDogNjgwcHg7XG4gICAgbWFyZ2luLXRvcDogODBweDtcblxuICAgICY6OmJlZm9yZSB7XG4gICAgICBiYWNrZ3JvdW5kOiAjZWVlO1xuICAgICAgYm90dG9tOiAwO1xuICAgICAgY29udGVudDogJyc7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIGhlaWdodDogMnB4O1xuICAgICAgbGVmdDogMDtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgei1pbmRleDogMTtcbiAgICB9XG5cbiAgICBpbnB1dCB7XG4gICAgICBib3JkZXI6IG5vbmU7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIGxpbmUtaGVpZ2h0OiA0MHB4O1xuICAgICAgcGFkZGluZy1ib3R0b206IDhweDtcblxuICAgICAgJjpmb2N1cyB7IG91dGxpbmU6IDA7IH1cbiAgICB9XG4gIH1cblxuICAvLyByZXN1bHRcbiAgJi1yZXN1bHRzIHtcbiAgICBtYXgtaGVpZ2h0OiBjYWxjKDEwMCUgLSAxMDBweCk7XG4gICAgbWF4LXdpZHRoOiA2ODBweDtcbiAgICBvdmVyZmxvdzogYXV0bztcblxuICAgIGEge1xuICAgICAgcGFkZGluZzogMTBweCAyMHB4O1xuICAgICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAuMDUpO1xuICAgICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjcpO1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2ZmZjtcbiAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2UtaW4tb3V0O1xuXG4gICAgICAmOmhvdmVyIHsgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjEpIH1cbiAgICB9XG4gIH1cbn1cblxuLmJ1dHRvbi1zZWFyY2gtLWNsb3NlIHtcbiAgcG9zaXRpb246IGFic29sdXRlICFpbXBvcnRhbnQ7XG4gIHJpZ2h0OiA1MHB4O1xuICB0b3A6IDIwcHg7XG59XG5cbmJvZHkuaXMtc2VhcmNoIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICAuc2VhcmNoIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApIH1cbiAgLnNlYXJjaC10b2dnbGUgeyBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIC4yNSkgfVxufVxuIiwiLnNpZGViYXIge1xyXG4gICYtdGl0bGUge1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjA3ODUpO1xyXG5cclxuICAgIHNwYW4ge1xyXG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAuNTQpO1xyXG4gICAgICBwYWRkaW5nLWJvdHRvbTogMTBweDtcclxuICAgICAgbWFyZ2luLWJvdHRvbTogLTFweDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vIGJvcmRlciBmb3IgcG9zdFxyXG4uc2lkZWJhci1ib3JkZXIge1xyXG4gIGJvcmRlci1sZWZ0OiAzcHggc29saWQgdmFyKC0tY29tcG9zaXRlLWNvbG9yKTtcclxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAuMik7XHJcbiAgZm9udC1mYW1pbHk6ICRzZWN1bmRhcnktZm9udDtcclxuICBwYWRkaW5nOiAwIDEwcHg7XHJcbiAgLXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gIC13ZWJraXQtdGV4dC1zdHJva2Utd2lkdGg6IDEuNXB4O1xyXG4gIC13ZWJraXQtdGV4dC1zdHJva2UtY29sb3I6ICM4ODg7XHJcbn1cclxuXHJcbi5zaWRlYmFyLXBvc3Qge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XHJcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4wNzg1KTtcclxuICBib3gtc2hhZG93OiAwIDFweCA3cHggcmdiYSgwLCAwLCAwLCAuMDc4NSk7XHJcbiAgbWluLWhlaWdodDogNjBweDtcclxuXHJcbiAgJjpob3ZlciB7IC5zaWRlYmFyLWJvcmRlciB7IGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjI5LCAyMzksIDI0NSwgMSkgfSB9XHJcblxyXG4gICY6bnRoLWNoaWxkKDNuKSB7IC5zaWRlYmFyLWJvcmRlciB7IGJvcmRlci1jb2xvcjogZGFya2VuKG9yYW5nZSwgMiUpOyB9IH1cclxuICAmOm50aC1jaGlsZCgzbisyKSB7IC5zaWRlYmFyLWJvcmRlciB7IGJvcmRlci1jb2xvcjogIzI2YThlZCB9IH1cclxufVxyXG5cclxuLy8gQ2VudGVyZWQgbGluZSBhbmQgb2JsaXF1ZSBjb250ZW50XHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIC5jZW50ZXItbGluZSB7XHJcbi8vICAgZm9udC1zaXplOiAxNnB4O1xyXG4vLyAgIG1hcmdpbi1ib3R0b206IDE1cHg7XHJcbi8vICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4vLyAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuXHJcbi8vICAgJjo6YmVmb3JlIHtcclxuLy8gICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgLjE1KTtcclxuLy8gICAgIGJvdHRvbTogNTAlO1xyXG4vLyAgICAgY29udGVudDogJyc7XHJcbi8vICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbi8vICAgICBoZWlnaHQ6IDFweDtcclxuLy8gICAgIGxlZnQ6IDA7XHJcbi8vICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbi8vICAgICB3aWR0aDogMTAwJTtcclxuLy8gICAgIHotaW5kZXg6IDA7XHJcbi8vICAgfVxyXG4vLyB9XHJcblxyXG4vLyAub2JsaXF1ZSB7XHJcbi8vICAgYmFja2dyb3VuZDogI2ZmMDA1YjtcclxuLy8gICBjb2xvcjogI2ZmZjtcclxuLy8gICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbi8vICAgZm9udC1zaXplOiAxNnB4O1xyXG4vLyAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbi8vICAgbGluZS1oZWlnaHQ6IDE7XHJcbi8vICAgcGFkZGluZzogNXB4IDEzcHg7XHJcbi8vICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4vLyAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbi8vICAgdHJhbnNmb3JtOiBza2V3WCgtMTVkZWcpO1xyXG4vLyAgIHotaW5kZXg6IDE7XHJcbi8vIH1cclxuIiwiLy8gTmF2aWdhdGlvbiBNb2JpbGVcclxuLnNpZGVOYXYge1xyXG4gIC8vIGJhY2tncm91bmQtY29sb3I6ICRwcmltYXJ5LWNvbG9yO1xyXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOCk7XHJcbiAgaGVpZ2h0OiAxMDB2aDtcclxuICBwYWRkaW5nOiAkaGVhZGVyLWhlaWdodCAyMHB4O1xyXG4gIHBvc2l0aW9uOiBmaXhlZCAhaW1wb3J0YW50O1xyXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDAlKTtcclxuICB0cmFuc2l0aW9uOiAwLjRzO1xyXG4gIHdpbGwtY2hhbmdlOiB0cmFuc2Zvcm07XHJcbiAgei1pbmRleDogODtcclxuXHJcbiAgJi1tZW51IGEgeyBwYWRkaW5nOiAxMHB4IDIwcHg7IH1cclxuXHJcbiAgJi13cmFwIHtcclxuICAgIGJhY2tncm91bmQ6ICNlZWU7XHJcbiAgICBvdmVyZmxvdzogYXV0bztcclxuICAgIHBhZGRpbmc6IDIwcHggMDtcclxuICAgIHRvcDogJGhlYWRlci1oZWlnaHQ7XHJcbiAgfVxyXG5cclxuICAmLXNlY3Rpb24ge1xyXG4gICAgYm9yZGVyLWJvdHRvbTogc29saWQgMXB4ICNkZGQ7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA4cHg7XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogOHB4O1xyXG4gIH1cclxuXHJcbiAgJi1mb2xsb3cge1xyXG4gICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNkZGQ7XHJcbiAgICBtYXJnaW46IDE1cHggMDtcclxuXHJcbiAgICBhIHtcclxuICAgICAgY29sb3I6ICNmZmY7XHJcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgaGVpZ2h0OiAzNnB4O1xyXG4gICAgICBsaW5lLWhlaWdodDogMjBweDtcclxuICAgICAgbWFyZ2luOiAwIDVweCA1cHggMDtcclxuICAgICAgbWluLXdpZHRoOiAzNnB4O1xyXG4gICAgICBwYWRkaW5nOiA4cHg7XHJcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcclxuICAgIH1cclxuXHJcbiAgICBAZWFjaCAkc29jaWFsLW5hbWUsICRjb2xvciBpbiAkc29jaWFsLWNvbG9ycyB7XHJcbiAgICAgIC5pLSN7JHNvY2lhbC1uYW1lfSB7XHJcbiAgICAgICAgQGV4dGVuZCAuYmctI3skc29jaWFsLW5hbWV9O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vICBGb2xsb3cgbWUgYnRuIGlzIHBvc3RcclxuLy8gLm1hcGFjaGUtZm9sbG93IHtcclxuLy8gICAmOmhvdmVyIHtcclxuLy8gICAgIC5tYXBhY2hlLWhvdmVyLWhpZGRlbiB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudCB9XHJcbi8vICAgICAubWFwYWNoZS1ob3Zlci1zaG93IHsgZGlzcGxheTogaW5saW5lLWJsb2NrICFpbXBvcnRhbnQgfVxyXG4vLyAgIH1cclxuXHJcbi8vICAgJi1idG4ge1xyXG4vLyAgICAgaGVpZ2h0OiAxOXB4O1xyXG4vLyAgICAgbGluZS1oZWlnaHQ6IDE3cHg7XHJcbi8vICAgICBwYWRkaW5nOiAwIDEwcHg7XHJcbi8vICAgfVxyXG4vLyB9XHJcblxyXG4vLyBUcmFuc3BhcmVjZSBoZWFkZXIgYW5kIGNvdmVyIGltZ1xyXG5cclxuLmhhcy1jb3Zlci1wYWRkaW5nIHsgcGFkZGluZy10b3A6IDEwMHB4IH1cclxuXHJcbmJvZHkuaGFzLWNvdmVyIHtcclxuICAuaGVhZGVyIHsgcG9zaXRpb246IGZpeGVkIH1cclxuXHJcbiAgJi5pcy10cmFuc3BhcmVuY3k6bm90KC5pcy1zZWFyY2gpIHtcclxuICAgIC5oZWFkZXIge1xyXG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIC4wNSk7XHJcbiAgICAgIGJveC1zaGFkb3c6IG5vbmU7XHJcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCBoc2xhKDAsIDAlLCAxMDAlLCAuMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLmhlYWRlci1sZWZ0IGEsIC5uYXYgdWwgbGkgYSB7IGNvbG9yOiAjZmZmOyB9XHJcbiAgICAubWVudS0tdG9nZ2xlIHNwYW4geyBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmIH1cclxuICB9XHJcbn1cclxuIiwiLy8gLmlzLXN1YnNjcmliZSAuZm9vdGVyIHtcclxuLy8gICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjBmMGYwO1xyXG4vLyB9XHJcblxyXG4uc3Vic2NyaWJlIHtcclxuICBtaW4taGVpZ2h0OiA4MHZoICFpbXBvcnRhbnQ7XHJcbiAgaGVpZ2h0OiAxMDAlO1xyXG4gIC8vIGJhY2tncm91bmQtY29sb3I6ICNmMGYwZjAgIWltcG9ydGFudDtcclxuXHJcbiAgJi1jYXJkIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNEN0VGRUU7XHJcbiAgICBib3gtc2hhZG93OiAwIDJweCAxMHB4IHJnYmEoMCwgMCwgMCwgLjE1KTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICAgIHdpZHRoOiA5MDBweDtcclxuICAgIGhlaWdodDogNTUwcHg7XHJcbiAgICBwYWRkaW5nOiA1MHB4O1xyXG4gICAgbWFyZ2luOiA1cHg7XHJcbiAgfVxyXG5cclxuICBmb3JtIHtcclxuICAgIG1heC13aWR0aDogMzAwcHg7XHJcbiAgfVxyXG5cclxuICAmLWZvcm0ge1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gIH1cclxuXHJcbiAgJi1pbnB1dCB7XHJcbiAgICBiYWNrZ3JvdW5kOiAwIDA7XHJcbiAgICBib3JkZXI6IDA7XHJcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NjNTQ1NDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDA7XHJcbiAgICBwYWRkaW5nOiA3cHggNXB4O1xyXG4gICAgaGVpZ2h0OiA0NXB4O1xyXG4gICAgb3V0bGluZTogMDtcclxuICAgIGZvbnQtZmFtaWx5OiAkcHJpbWFyeS1mb250O1xyXG5cclxuICAgICY6OnBsYWNlaG9sZGVyIHtcclxuICAgICAgY29sb3I6ICNjYzU0NTQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAubWFpbi1lcnJvciB7XHJcbiAgICBjb2xvcjogI2NjNTQ1NDtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIG1hcmdpbi10b3A6IDE1cHg7XHJcbiAgfVxyXG59XHJcblxyXG4vLyAuc3Vic2NyaWJlLWJ0biB7XHJcbi8vICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAuODQpO1xyXG4vLyAgIGJvcmRlci1jb2xvcjogcmdiYSgwLCAwLCAwLCAuODQpO1xyXG4vLyAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIC45Nyk7XHJcbi8vICAgYm94LXNoYWRvdzogMCAxcHggN3B4IHJnYmEoMCwgMCwgMCwgLjA1KTtcclxuLy8gICBsZXR0ZXItc3BhY2luZzogMXB4O1xyXG5cclxuLy8gICAmOmhvdmVyIHtcclxuLy8gICAgIGJhY2tncm91bmQ6ICMxQzk5NjM7XHJcbi8vICAgICBib3JkZXItY29sb3I6ICMxQzk5NjM7XHJcbi8vICAgfVxyXG4vLyB9XHJcblxyXG4vLyBTdWNjZXNzXHJcbi5zdWJzY3JpYmUtc3VjY2VzcyB7XHJcbiAgLnN1YnNjcmliZS1jYXJkIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNFOEYzRUM7XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgI3skbWQtYW5kLWRvd259IHtcclxuICAuc3Vic2NyaWJlLWNhcmQge1xyXG4gICAgaGVpZ2h0OiBhdXRvO1xyXG4gICAgd2lkdGg6IGF1dG87XHJcbiAgfVxyXG59XHJcbiIsIi8vIHBvc3QgQ29tbWVudHNcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi5wb3N0LWNvbW1lbnRzIHtcclxuICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgdG9wOiAwO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIGJvdHRvbTogMDtcclxuICB6LWluZGV4OiAxNTtcclxuICB3aWR0aDogMTAwJTtcclxuICBsZWZ0OiAwO1xyXG4gIG92ZXJmbG93LXk6IGF1dG87XHJcbiAgYmFja2dyb3VuZDogI2ZmZjtcclxuICBib3JkZXItbGVmdDogMXB4IHNvbGlkICNmMWYxZjE7XHJcbiAgYm94LXNoYWRvdzogMCAxcHggN3B4IHJnYmEoMCwgMCwgMCwgLjA1KTtcclxuICBmb250LXNpemU6IDE0cHg7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDEwMCUpO1xyXG4gIHRyYW5zaXRpb246IC4ycztcclxuICB3aWxsLWNoYW5nZTogdHJhbnNmb3JtO1xyXG5cclxuICAmLWhlYWRlciB7XHJcbiAgICBwYWRkaW5nOiAyMHB4O1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XHJcblxyXG4gICAgLnRvZ2dsZS1jb21tZW50cyB7XHJcbiAgICAgIGZvbnQtc2l6ZTogMjRweDtcclxuICAgICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgbGVmdDogMDtcclxuICAgICAgdG9wOiAwO1xyXG4gICAgICBwYWRkaW5nOiAxN3B4O1xyXG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAmLW92ZXJsYXkge1xyXG4gICAgcG9zaXRpb246IGZpeGVkICFpbXBvcnRhbnQ7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC4yKTtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIC40cyBsaW5lYXI7XHJcbiAgICB6LWluZGV4OiA4O1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIH1cclxufVxyXG5cclxuYm9keS5oYXMtY29tbWVudHMge1xyXG4gIG92ZXJmbG93OiBoaWRkZW47XHJcblxyXG4gIC5wb3N0LWNvbW1lbnRzLW92ZXJsYXkgeyBkaXNwbGF5OiBibG9jayB9XHJcbiAgLnBvc3QtY29tbWVudHMgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCkgfVxyXG59XHJcblxyXG5AbWVkaWEgI3skbWQtYW5kLXVwfSB7XHJcbiAgLnBvc3QtY29tbWVudHMge1xyXG4gICAgbGVmdDogYXV0bztcclxuICAgIHdpZHRoOiA1MDBweDtcclxuICAgIHRvcDogJGhlYWRlci1oZWlnaHQ7XHJcbiAgICB6LWluZGV4OiA5O1xyXG5cclxuICAgICYtd3JhcCB7IHBhZGRpbmc6IDIwcHg7IH1cclxuICB9XHJcbn1cclxuIiwiLm1vZGFsIHtcclxuICBvcGFjaXR5OiAwO1xyXG4gIHRyYW5zaXRpb246IG9wYWNpdHkgLjJzIGVhc2Utb3V0IC4xcywgdmlzaWJpbGl0eSAwcyAuNHM7XHJcbiAgei1pbmRleDogMTAwO1xyXG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcclxuXHJcbiAgLy8gU2hhZGVyXHJcbiAgJi1zaGFkZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIC42NSkgfVxyXG5cclxuICAvLyBtb2RhbCBjbG9zZVxyXG4gICYtY2xvc2Uge1xyXG4gICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjU0KTtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICBwYWRkaW5nOiAxNXB4O1xyXG4gIH1cclxuXHJcbiAgLy8gSW5uZXJcclxuICAmLWlubmVyIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNFOEYzRUM7XHJcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgICBib3gtc2hhZG93OiAwIDJweCAxMHB4IHJnYmEoMCwgMCwgMCwgLjE1KTtcclxuICAgIG1heC13aWR0aDogNzAwcHg7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBtYXgtaGVpZ2h0OiA0MDBweDtcclxuICAgIG9wYWNpdHk6IDA7XHJcbiAgICBwYWRkaW5nOiA3MnB4IDUlIDU2cHg7XHJcbiAgICB0cmFuc2Zvcm06IHNjYWxlKC42KTtcclxuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuM3MgY3ViaWMtYmV6aWVyKC4wNiwgLjQ3LCAuMzgsIC45OSksIG9wYWNpdHkgLjNzIGN1YmljLWJlemllciguMDYsIC40NywgLjM4LCAuOTkpO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgfVxyXG5cclxuICAvLyBmb3JtXHJcbiAgLmZvcm0tZ3JvdXAge1xyXG4gICAgd2lkdGg6IDc2JTtcclxuICAgIG1hcmdpbjogMCBhdXRvIDMwcHg7XHJcbiAgfVxyXG5cclxuICAuZm9ybS0taW5wdXQge1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XHJcbiAgICBoZWlnaHQ6IDQwcHg7XHJcbiAgICBsaW5lLWhlaWdodDogNDBweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gICAgcGFkZGluZzogMTdweCA2cHg7XHJcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAuMTUpO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgfVxyXG5cclxuICAvLyAuZm9ybS0tYnRuIHtcclxuICAvLyAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgLjg0KTtcclxuICAvLyAgIGJvcmRlcjogMDtcclxuICAvLyAgIGhlaWdodDogMzdweDtcclxuICAvLyAgIGJvcmRlci1yYWRpdXM6IDNweDtcclxuICAvLyAgIGxpbmUtaGVpZ2h0OiAzN3B4O1xyXG4gIC8vICAgcGFkZGluZzogMCAxNnB4O1xyXG4gIC8vICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAuM3MgZWFzZS1pbi1vdXQ7XHJcbiAgLy8gICBsZXR0ZXItc3BhY2luZzogMXB4O1xyXG4gIC8vICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjk3KTtcclxuICAvLyAgIGN1cnNvcjogcG9pbnRlcjtcclxuXHJcbiAgLy8gICAmOmhvdmVyIHsgYmFja2dyb3VuZC1jb2xvcjogIzFDOTk2MyB9XHJcbiAgLy8gfVxyXG59XHJcblxyXG4vLyBpZiBoYXMgbW9kYWxcclxuXHJcbmJvZHkuaGFzLW1vZGFsIHtcclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG5cclxuICAubW9kYWwge1xyXG4gICAgb3BhY2l0eTogMTtcclxuICAgIHZpc2liaWxpdHk6IHZpc2libGU7XHJcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IC4zcyBlYXNlO1xyXG5cclxuICAgICYtaW5uZXIge1xyXG4gICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xyXG4gICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjhzIGN1YmljLWJlemllciguMjYsIC42MywgMCwgLjk2KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8gSW5zdGFncmFtIEZlZGRcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLmluc3RhZ3JhbSB7XHJcbiAgJi1ob3ZlciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC4zKTtcclxuICAgIC8vIHRyYW5zaXRpb246IG9wYWNpdHkgMXMgZWFzZS1pbi1vdXQ7XHJcbiAgICBvcGFjaXR5OiAwO1xyXG4gIH1cclxuXHJcbiAgJi1pbWcge1xyXG4gICAgaGVpZ2h0OiAyNjRweDtcclxuXHJcbiAgICAmOmhvdmVyID4gLmluc3RhZ3JhbS1ob3ZlciB7IG9wYWNpdHk6IDEgfVxyXG4gIH1cclxuXHJcbiAgJi1uYW1lIHtcclxuICAgIGxlZnQ6IDUwJTtcclxuICAgIHRvcDogNTAlO1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XHJcbiAgICB6LWluZGV4OiAzO1xyXG5cclxuICAgIGEge1xyXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xyXG4gICAgICBjb2xvcjogIzAwMCAhaW1wb3J0YW50O1xyXG4gICAgICBmb250LXNpemU6IDE4cHggIWltcG9ydGFudDtcclxuICAgICAgZm9udC13ZWlnaHQ6IDkwMCAhaW1wb3J0YW50O1xyXG4gICAgICBtaW4td2lkdGg6IDIwMHB4O1xyXG4gICAgICBwYWRkaW5nLWxlZnQ6IDEwcHggIWltcG9ydGFudDtcclxuICAgICAgcGFkZGluZy1yaWdodDogMTBweCAhaW1wb3J0YW50O1xyXG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXIgIWltcG9ydGFudDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gICYtY29sIHtcclxuICAgIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcclxuICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xyXG4gIH1cclxuXHJcbiAgJi13cmFwIHsgbWFyZ2luOiAwICFpbXBvcnRhbnQgfVxyXG59XHJcblxyXG4vLyBOZXdzbGV0dGVyIFNpZGViYXJcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLndpdGdldC1zdWJzY3JpYmUge1xyXG4gIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgYm9yZGVyOiA1cHggc29saWQgdHJhbnNwYXJlbnQ7XHJcbiAgcGFkZGluZzogMjhweCAzMHB4O1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbiAgJjo6YmVmb3JlIHtcclxuICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICBib3JkZXI6IDVweCBzb2xpZCAjZjVmNWY1O1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgMXB4ICNkN2Q3ZDc7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMTAwJSArIDEwcHgpO1xyXG4gICAgbGVmdDogLTVweDtcclxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAtNXB4O1xyXG4gICAgd2lkdGg6IGNhbGMoMTAwJSArIDEwcHgpO1xyXG4gICAgei1pbmRleDogMTtcclxuICB9XHJcblxyXG4gIGlucHV0IHtcclxuICAgIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZTVlNWU1O1xyXG4gICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjU0KTtcclxuICAgIGhlaWdodDogNDFweDtcclxuICAgIG91dGxpbmU6IDA7XHJcbiAgICBwYWRkaW5nOiAwIDE2cHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICB9XHJcblxyXG4gIGJ1dHRvbiB7XHJcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jb21wb3NpdGUtY29sb3IpO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQ0FBLDRFQUE0RTtBQUU1RTtnRkFDZ0Y7QUFFaEY7OztHQUdHOztBQUVILEFBQUEsSUFBSSxDQUFDO0VBQ0gsV0FBVyxFQUFFLElBQUk7RUFBRSxPQUFPO0VBQzFCLHdCQUF3QixFQUFFLElBQUk7RUFBRSxPQUFPLEVBQ3hDOztBQUVEO2dGQUNnRjtBQUVoRjs7R0FFRzs7QUFFSCxBQUFBLElBQUksQ0FBQztFQUNILE1BQU0sRUFBRSxDQUFDLEdBQ1Y7O0FBRUQ7O0dBRUc7O0FBRUgsQUFBQSxJQUFJLENBQUM7RUFDSCxPQUFPLEVBQUUsS0FBSyxHQUNmOztBQUVEOzs7R0FHRzs7QUFFSCxBQUFBLEVBQUUsQ0FBQztFQUNELFNBQVMsRUFBRSxHQUFHO0VBQ2QsTUFBTSxFQUFFLFFBQVEsR0FDakI7O0FBRUQ7Z0ZBQ2dGO0FBRWhGOzs7R0FHRzs7QUFFSCxBQUFBLEVBQUUsQ0FBQztFQUNELFVBQVUsRUFBRSxXQUFXO0VBQUUsT0FBTztFQUNoQyxNQUFNLEVBQUUsQ0FBQztFQUFFLE9BQU87RUFDbEIsUUFBUSxFQUFFLE9BQU87RUFBRSxPQUFPLEVBQzNCOztBQUVEOzs7R0FHRzs7QUFFSCxBQUFBLEdBQUcsQ0FBQztFQUNGLFdBQVcsRUFBRSxvQkFBb0I7RUFBRSxPQUFPO0VBQzFDLFNBQVMsRUFBRSxHQUFHO0VBQUUsT0FBTyxFQUN4Qjs7QUFFRDtnRkFDZ0Y7QUFFaEY7O0dBRUc7O0FBRUgsQUFBQSxDQUFDLENBQUM7RUFDQSxnQkFBZ0IsRUFBRSxXQUFXLEdBQzlCOztBQUVEOzs7R0FHRzs7QUFFSCxBQUFBLElBQUksQ0FBQSxBQUFBLEtBQUMsQUFBQSxFQUFPO0VBQ1YsYUFBYSxFQUFFLElBQUk7RUFBRSxPQUFPO0VBQzVCLGVBQWUsRUFBRSxTQUFTO0VBQUUsT0FBTztFQUNuQyxlQUFlLEVBQUUsZ0JBQWdCO0VBQUUsT0FB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QVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsU0FBdUM7TUFJNUMsU0FBUyxFQUpKLFNBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsR0FBdUM7TUFJNUMsU0FBUyxFQUpKLEdBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsU0FBdUM7TUFJNUMsU0FBUyxFQUpKLFNBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsU0FBdUM7TUFJNUMsU0FBUyxFQUpKLFNBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsR0FBdUM7TUFJNUMsU0FBUyxFQUpKLEdBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsU0FBdUM7TUFJNUMsU0FBUyxFQUpKLFNBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsU0FBdUM7TUFJNUMsU0FBUyxFQUpKLFNBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxHQUFHLENBQUs7TUFDUCxVQUFVLEVBSEwsR0FBdUM7TUFJNUMsU0FBUyxFQUpKLEdBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxJQUFJLENBQUk7TUFDUCxVQUFVLEVBSEwsU0FBdUM7TUFJNUMsU0FBUyxFQUpKLFNBQXVDLEdBSzdDOztJQXRCUCxBQW1CTSxJQW5CRixDQVFGLElBQUksQUFXQyxJQUFJLENBQUk7TUFDUCxVQUFVLEVBSEwsU0FBdUM7TUFJNUMsU0FBUyxFQUpKLFNB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 */","/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\nmain {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n  display: none;\n}\n","@charset \"UTF-8\";\n\n/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n/* line 11, node_modules/normalize.css/normalize.css */\n\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\n/* line 23, node_modules/normalize.css/normalize.css */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\n/* line 31, node_modules/normalize.css/normalize.css */\n\nmain {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\n/* line 40, node_modules/normalize.css/normalize.css */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\n/* line 53, node_modules/normalize.css/normalize.css */\n\nhr {\n  box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 64, node_modules/normalize.css/normalize.css */\n\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\n/* line 76, node_modules/normalize.css/normalize.css */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\n/* line 85, node_modules/normalize.css/normalize.css */\n\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  text-decoration: underline dotted;\n  /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\n/* line 95, node_modules/normalize.css/normalize.css */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 105, node_modules/normalize.css/normalize.css */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\n/* line 116, node_modules/normalize.css/normalize.css */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\n/* line 125, node_modules/normalize.css/normalize.css */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\n/* line 133, node_modules/normalize.css/normalize.css */\n\nsub {\n  bottom: -0.25em;\n}\n\n/* line 137, node_modules/normalize.css/normalize.css */\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\n/* line 148, node_modules/normalize.css/normalize.css */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\n/* line 160, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\n/* line 176, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput {\n  /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\n/* line 186, node_modules/normalize.css/normalize.css */\n\nbutton,\nselect {\n  /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\n/* line 195, node_modules/normalize.css/normalize.css */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\n/* line 206, node_modules/normalize.css/normalize.css */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\n/* line 218, node_modules/normalize.css/normalize.css */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\n/* line 229, node_modules/normalize.css/normalize.css */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\n/* line 240, node_modules/normalize.css/normalize.css */\n\nlegend {\n  box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\n/* line 253, node_modules/normalize.css/normalize.css */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\n/* line 261, node_modules/normalize.css/normalize.css */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n/* line 270, node_modules/normalize.css/normalize.css */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n/* line 280, node_modules/normalize.css/normalize.css */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n/* line 290, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n/* line 299, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n/* line 308, node_modules/normalize.css/normalize.css */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\n/* line 320, node_modules/normalize.css/normalize.css */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\n/* line 328, node_modules/normalize.css/normalize.css */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\n/* line 339, node_modules/normalize.css/normalize.css */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n/* line 347, node_modules/normalize.css/normalize.css */\n\n[hidden] {\n  display: none;\n}\n\n/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\n/* line 7, node_modules/prismjs/themes/prism.css */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: black;\n  background: none;\n  text-shadow: 0 1px white;\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -moz-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none;\n}\n\n/* line 30, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"]::-moz-selection,\npre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection,\ncode[class*=\"language-\"] ::-moz-selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n\n/* line 36, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"]::selection,\npre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection,\ncode[class*=\"language-\"] ::selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n\n@media print {\n  /* line 43, node_modules/prismjs/themes/prism.css */\n\n  code[class*=\"language-\"],\n  pre[class*=\"language-\"] {\n    text-shadow: none;\n  }\n}\n\n/* Code blocks */\n\n/* line 50, node_modules/prismjs/themes/prism.css */\n\npre[class*=\"language-\"] {\n  padding: 1em;\n  margin: .5em 0;\n  overflow: auto;\n}\n\n/* line 56, node_modules/prismjs/themes/prism.css */\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n  background: #f5f2f0;\n}\n\n/* Inline code */\n\n/* line 62, node_modules/prismjs/themes/prism.css */\n\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em;\n  border-radius: .3em;\n  white-space: normal;\n}\n\n/* line 68, node_modules/prismjs/themes/prism.css */\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: slategray;\n}\n\n/* line 75, node_modules/prismjs/themes/prism.css */\n\n.token.punctuation {\n  color: #999;\n}\n\n/* line 79, node_modules/prismjs/themes/prism.css */\n\n.namespace {\n  opacity: .7;\n}\n\n/* line 83, node_modules/prismjs/themes/prism.css */\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #905;\n}\n\n/* line 93, node_modules/prismjs/themes/prism.css */\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n  color: #690;\n}\n\n/* line 102, node_modules/prismjs/themes/prism.css */\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n  color: #9a6e3a;\n  background: rgba(255, 255, 255, 0.5);\n}\n\n/* line 111, node_modules/prismjs/themes/prism.css */\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #07a;\n}\n\n/* line 117, node_modules/prismjs/themes/prism.css */\n\n.token.function,\n.token.class-name {\n  color: #DD4A68;\n}\n\n/* line 122, node_modules/prismjs/themes/prism.css */\n\n.token.regex,\n.token.important,\n.token.variable {\n  color: #e90;\n}\n\n/* line 128, node_modules/prismjs/themes/prism.css */\n\n.token.important,\n.token.bold {\n  font-weight: bold;\n}\n\n/* line 132, node_modules/prismjs/themes/prism.css */\n\n.token.italic {\n  font-style: italic;\n}\n\n/* line 136, node_modules/prismjs/themes/prism.css */\n\n.token.entity {\n  cursor: help;\n}\n\n/* line 1, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\npre[class*=\"language-\"].line-numbers {\n  position: relative;\n  padding-left: 3.8em;\n  counter-reset: linenumber;\n}\n\n/* line 7, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\npre[class*=\"language-\"].line-numbers > code {\n  position: relative;\n  white-space: inherit;\n}\n\n/* line 12, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers .line-numbers-rows {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  font-size: 100%;\n  left: -3.8em;\n  width: 3em;\n  /* works for line-numbers below 1000 lines */\n  letter-spacing: -1px;\n  border-right: 1px solid #999;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n/* line 29, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers-rows > span {\n  pointer-events: none;\n  display: block;\n  counter-increment: linenumber;\n}\n\n/* line 35, node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css */\n\n.line-numbers-rows > span:before {\n  content: counter(linenumber);\n  color: #999;\n  display: block;\n  padding-right: 0.8em;\n  text-align: right;\n}\n\n/* line 1, src/styles/common/_mixins.scss */\n\n.link {\n  color: inherit;\n  cursor: pointer;\n  text-decoration: none;\n}\n\n/* line 7, src/styles/common/_mixins.scss */\n\n.link--accent {\n  color: var(--primary-color);\n  text-decoration: none;\n}\n\n/* line 22, src/styles/common/_mixins.scss */\n\n.u-absolute0 {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n/* line 30, src/styles/common/_mixins.scss */\n\n.u-textColorDarker {\n  color: rgba(0, 0, 0, 0.8) !important;\n  fill: rgba(0, 0, 0, 0.8) !important;\n}\n\n/* line 35, src/styles/common/_mixins.scss */\n\n.warning::before,\n.note::before,\n.success::before,\n[class^=\"i-\"]::before,\n[class*=\" i-\"]::before {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: 'mapache' !important;\n  /* stylelint-disable-line */\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: inherit;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* line 2, src/styles/autoload/_zoom.scss */\n\nimg[data-action=\"zoom\"] {\n  cursor: zoom-in;\n}\n\n/* line 5, src/styles/autoload/_zoom.scss */\n\n.zoom-img,\n.zoom-img-wrap {\n  position: relative;\n  z-index: 666;\n  -webkit-transition: all 300ms;\n  -o-transition: all 300ms;\n  transition: all 300ms;\n}\n\n/* line 13, src/styles/autoload/_zoom.scss */\n\nimg.zoom-img {\n  cursor: pointer;\n  cursor: -webkit-zoom-out;\n  cursor: -moz-zoom-out;\n}\n\n/* line 18, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay {\n  z-index: 420;\n  background: #fff;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  pointer-events: none;\n  filter: \"alpha(opacity=0)\";\n  opacity: 0;\n  -webkit-transition: opacity 300ms;\n  -o-transition: opacity 300ms;\n  transition: opacity 300ms;\n}\n\n/* line 33, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay-open .zoom-overlay {\n  filter: \"alpha(opacity=100)\";\n  opacity: 1;\n}\n\n/* line 37, src/styles/autoload/_zoom.scss */\n\n.zoom-overlay-open,\n.zoom-overlay-transitioning {\n  cursor: default;\n}\n\n/* line 1, src/styles/common/_global.scss */\n\n:root {\n  --black: #000;\n  --white: #fff;\n  --primary-color: #1C9963;\n  --secondary-color: #2ad88d;\n  --header-color: #BBF1B9;\n  --header-color-hover: #EEFFEA;\n  --post-color-link: #2ad88d;\n  --story-cover-category-color: #2ad88d;\n  --composite-color: #CC116E;\n  --footer-color-link: #2ad88d;\n  --media-type-color: #2ad88d;\n}\n\n/* line 15, src/styles/common/_global.scss */\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n/* line 19, src/styles/common/_global.scss */\n\na {\n  color: inherit;\n  text-decoration: none;\n}\n\n/* line 23, src/styles/common/_global.scss */\n\na:active,\na:hover {\n  outline: 0;\n}\n\n/* line 29, src/styles/common/_global.scss */\n\nblockquote {\n  border-left: 3px solid #000;\n  color: #000;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-size: 1.1875rem;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin: 30px 0 0 -12px;\n  padding-bottom: 2px;\n  padding-left: 20px;\n}\n\n/* line 42, src/styles/common/_global.scss */\n\nblockquote p:first-of-type {\n  margin-top: 0;\n}\n\n/* line 45, src/styles/common/_global.scss */\n\nbody {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 16px;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin: 0 auto;\n  text-rendering: optimizeLegibility;\n  overflow-x: hidden;\n}\n\n/* line 59, src/styles/common/_global.scss */\n\nhtml {\n  box-sizing: border-box;\n  font-size: 16px;\n}\n\n/* line 64, src/styles/common/_global.scss */\n\nfigure {\n  margin: 0;\n}\n\n/* line 68, src/styles/common/_global.scss */\n\nfigcaption {\n  color: rgba(0, 0, 0, 0.68);\n  display: block;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%;\n}\n\n/* line 89, src/styles/common/_global.scss */\n\nkbd,\nsamp,\ncode {\n  background: #f7f7f7;\n  border-radius: 4px;\n  color: #c7254e;\n  font-family: \"Fira Mono\", monospace !important;\n  font-size: 15px;\n  padding: 4px 6px;\n  white-space: pre-wrap;\n}\n\n/* line 99, src/styles/common/_global.scss */\n\npre {\n  background-color: #f7f7f7 !important;\n  border-radius: 4px;\n  font-family: \"Fira Mono\", monospace !important;\n  font-size: 15px;\n  margin-top: 30px !important;\n  max-width: 100%;\n  overflow: hidden;\n  padding: 1rem;\n  position: relative;\n  word-wrap: normal;\n}\n\n/* line 111, src/styles/common/_global.scss */\n\npre code {\n  background: transparent;\n  color: #37474f;\n  padding: 0;\n  text-shadow: 0 1px #fff;\n}\n\n/* line 119, src/styles/common/_global.scss */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: #37474f;\n  line-height: 1.4;\n}\n\n/* line 124, src/styles/common/_global.scss */\n\ncode[class*=language-] .token.comment,\npre[class*=language-] .token.comment {\n  opacity: .8;\n}\n\n/* line 126, src/styles/common/_global.scss */\n\ncode[class*=language-].line-numbers,\npre[class*=language-].line-numbers {\n  padding-left: 58px;\n}\n\n/* line 129, src/styles/common/_global.scss */\n\ncode[class*=language-].line-numbers::before,\npre[class*=language-].line-numbers::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  background: #F0EDEE;\n  width: 40px;\n  height: 100%;\n}\n\n/* line 140, src/styles/common/_global.scss */\n\ncode[class*=language-] .line-numbers-rows,\npre[class*=language-] .line-numbers-rows {\n  border-right: none;\n  top: -3px;\n  left: -58px;\n}\n\n/* line 145, src/styles/common/_global.scss */\n\ncode[class*=language-] .line-numbers-rows > span::before,\npre[class*=language-] .line-numbers-rows > span::before {\n  padding-right: 0;\n  text-align: center;\n  opacity: .8;\n}\n\n/* line 155, src/styles/common/_global.scss */\n\nhr:not(.hr-list):not(.post-footer-hr) {\n  border: 0;\n  display: block;\n  margin: 50px auto;\n  text-align: center;\n}\n\n/* line 161, src/styles/common/_global.scss */\n\nhr:not(.hr-list):not(.post-footer-hr)::before {\n  color: rgba(0, 0, 0, 0.6);\n  content: '...';\n  display: inline-block;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 28px;\n  font-weight: 400;\n  letter-spacing: .6em;\n  position: relative;\n  top: -25px;\n}\n\n/* line 174, src/styles/common/_global.scss */\n\n.post-footer-hr {\n  height: 1px;\n  margin: 32px 0;\n  border: 0;\n  background-color: #ddd;\n}\n\n/* line 181, src/styles/common/_global.scss */\n\nimg {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n  width: auto;\n}\n\n/* line 187, src/styles/common/_global.scss */\n\nimg:not([src]) {\n  visibility: hidden;\n}\n\n/* line 192, src/styles/common/_global.scss */\n\ni {\n  vertical-align: middle;\n}\n\n/* line 197, src/styles/common/_global.scss */\n\ninput {\n  border: none;\n  outline: 0;\n}\n\n/* line 202, src/styles/common/_global.scss */\n\nol,\nul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0;\n}\n\n/* line 209, src/styles/common/_global.scss */\n\nmark {\n  background-color: transparent !important;\n  background-image: linear-gradient(to bottom, #d7fdd3, #d7fdd3);\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 215, src/styles/common/_global.scss */\n\nq {\n  color: rgba(0, 0, 0, 0.44);\n  display: block;\n  font-size: 28px;\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -.014em;\n  line-height: 1.48;\n  padding-left: 50px;\n  padding-top: 15px;\n  text-align: left;\n}\n\n/* line 227, src/styles/common/_global.scss */\n\nq::before,\nq::after {\n  display: none;\n}\n\n/* line 230, src/styles/common/_global.scss */\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n/* line 245, src/styles/common/_global.scss */\n\ntable th,\ntable td {\n  padding: 6px 13px;\n  border: 1px solid #dfe2e5;\n}\n\n/* line 251, src/styles/common/_global.scss */\n\ntable tr:nth-child(2n) {\n  background-color: #f6f8fa;\n}\n\n/* line 255, src/styles/common/_global.scss */\n\ntable th {\n  letter-spacing: 0.2px;\n  text-transform: uppercase;\n  font-weight: 600;\n}\n\n/* line 269, src/styles/common/_global.scss */\n\n.link--underline:active,\n.link--underline:focus,\n.link--underline:hover {\n  text-decoration: underline;\n}\n\n/* line 279, src/styles/common/_global.scss */\n\n.main {\n  margin-bottom: 4em;\n  min-height: 90vh;\n}\n\n/* line 281, src/styles/common/_global.scss */\n\n.main,\n.footer {\n  transition: transform .5s ease;\n}\n\n/* line 286, src/styles/common/_global.scss */\n\n.warning {\n  background: #fbe9e7;\n  color: #d50000;\n}\n\n/* line 289, src/styles/common/_global.scss */\n\n.warning::before {\n  content: \"\";\n}\n\n/* line 292, src/styles/common/_global.scss */\n\n.note {\n  background: #e1f5fe;\n  color: #0288d1;\n}\n\n/* line 295, src/styles/common/_global.scss */\n\n.note::before {\n  content: \"\";\n}\n\n/* line 298, src/styles/common/_global.scss */\n\n.success {\n  background: #e0f2f1;\n  color: #00897b;\n}\n\n/* line 301, src/styles/common/_global.scss */\n\n.success::before {\n  color: #00bfa5;\n  content: \"\";\n}\n\n/* line 304, src/styles/common/_global.scss */\n\n.warning,\n.note,\n.success {\n  display: block;\n  font-size: 18px !important;\n  line-height: 1.58 !important;\n  margin-top: 28px;\n  padding: 12px 24px 12px 60px;\n}\n\n/* line 311, src/styles/common/_global.scss */\n\n.warning a,\n.note a,\n.success a {\n  color: inherit;\n  text-decoration: underline;\n}\n\n/* line 316, src/styles/common/_global.scss */\n\n.warning::before,\n.note::before,\n.success::before {\n  float: left;\n  font-size: 24px;\n  margin-left: -36px;\n  margin-top: -5px;\n}\n\n/* line 329, src/styles/common/_global.scss */\n\n.tag-description {\n  max-width: 700px;\n}\n\n/* line 330, src/styles/common/_global.scss */\n\n.tag.has--image {\n  min-height: 350px;\n}\n\n/* line 335, src/styles/common/_global.scss */\n\n.with-tooltip {\n  overflow: visible;\n  position: relative;\n}\n\n/* line 339, src/styles/common/_global.scss */\n\n.with-tooltip::after {\n  background: rgba(0, 0, 0, 0.85);\n  border-radius: 4px;\n  color: #fff;\n  content: attr(data-tooltip);\n  display: inline-block;\n  font-size: 12px;\n  font-weight: 600;\n  left: 50%;\n  line-height: 1.25;\n  min-width: 130px;\n  opacity: 0;\n  padding: 4px 8px;\n  pointer-events: none;\n  position: absolute;\n  text-align: center;\n  text-transform: none;\n  top: -30px;\n  will-change: opacity, transform;\n  z-index: 1;\n}\n\n/* line 361, src/styles/common/_global.scss */\n\n.with-tooltip:hover::after {\n  animation: tooltip .1s ease-out both;\n}\n\n/* line 368, src/styles/common/_global.scss */\n\n.errorPage {\n  font-family: 'Roboto Mono', monospace;\n}\n\n/* line 371, src/styles/common/_global.scss */\n\n.errorPage-link {\n  left: -5px;\n  padding: 24px 60px;\n  top: -6px;\n}\n\n/* line 377, src/styles/common/_global.scss */\n\n.errorPage-text {\n  margin-top: 60px;\n  white-space: pre-wrap;\n}\n\n/* line 382, src/styles/common/_global.scss */\n\n.errorPage-wrap {\n  color: rgba(0, 0, 0, 0.4);\n  padding: 7vw 4vw;\n}\n\n/* line 390, src/styles/common/_global.scss */\n\n.video-responsive {\n  display: block;\n  height: 0;\n  margin-top: 30px;\n  overflow: hidden;\n  padding: 0 0 56.25%;\n  position: relative;\n  width: 100%;\n}\n\n/* line 399, src/styles/common/_global.scss */\n\n.video-responsive iframe {\n  border: 0;\n  bottom: 0;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n/* line 409, src/styles/common/_global.scss */\n\n.video-responsive video {\n  border: 0;\n  bottom: 0;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n/* line 420, src/styles/common/_global.scss */\n\n.kg-embed-card .video-responsive {\n  margin-top: 0;\n}\n\n/* line 426, src/styles/common/_global.scss */\n\n.kg-gallery-container {\n  display: flex;\n  flex-direction: column;\n  max-width: 100%;\n  width: 100%;\n}\n\n/* line 433, src/styles/common/_global.scss */\n\n.kg-gallery-row {\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n}\n\n/* line 438, src/styles/common/_global.scss */\n\n.kg-gallery-row:not(:first-of-type) {\n  margin: 0.75em 0 0 0;\n}\n\n/* line 442, src/styles/common/_global.scss */\n\n.kg-gallery-image img {\n  display: block;\n  margin: 0;\n  width: 100%;\n  height: 100%;\n}\n\n/* line 449, src/styles/common/_global.scss */\n\n.kg-gallery-image:not(:first-of-type) {\n  margin: 0 0 0 0.75em;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-facebook {\n  color: #3b5998 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-facebook,\n.sideNav-follow .i-facebook {\n  background-color: #3b5998 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-twitter {\n  color: #55acee !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-twitter,\n.sideNav-follow .i-twitter {\n  background-color: #55acee !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-google {\n  color: #dd4b39 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-google,\n.sideNav-follow .i-google {\n  background-color: #dd4b39 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-instagram {\n  color: #306088 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-instagram,\n.sideNav-follow .i-instagram {\n  background-color: #306088 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-youtube {\n  color: #e52d27 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-youtube,\n.sideNav-follow .i-youtube {\n  background-color: #e52d27 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-github {\n  color: #555 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-github,\n.sideNav-follow .i-github {\n  background-color: #555 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-linkedin {\n  color: #007bb6 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-linkedin,\n.sideNav-follow .i-linkedin {\n  background-color: #007bb6 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-spotify {\n  color: #2ebd59 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-spotify,\n.sideNav-follow .i-spotify {\n  background-color: #2ebd59 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-codepen {\n  color: #222 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-codepen,\n.sideNav-follow .i-codepen {\n  background-color: #222 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-behance {\n  color: #131418 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-behance,\n.sideNav-follow .i-behance {\n  background-color: #131418 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-dribbble {\n  color: #ea4c89 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-dribbble,\n.sideNav-follow .i-dribbble {\n  background-color: #ea4c89 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-flickr {\n  color: #0063dc !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-flickr,\n.sideNav-follow .i-flickr {\n  background-color: #0063dc !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-reddit {\n  color: #ff4500 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-reddit,\n.sideNav-follow .i-reddit {\n  background-color: #ff4500 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-pocket {\n  color: #f50057 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-pocket,\n.sideNav-follow .i-pocket {\n  background-color: #f50057 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-pinterest {\n  color: #bd081c !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-pinterest,\n.sideNav-follow .i-pinterest {\n  background-color: #bd081c !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-whatsapp {\n  color: #64d448 !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-whatsapp,\n.sideNav-follow .i-whatsapp {\n  background-color: #64d448 !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-telegram {\n  color: #08c !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-telegram,\n.sideNav-follow .i-telegram {\n  background-color: #08c !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-discord {\n  color: #7289da !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-discord,\n.sideNav-follow .i-discord {\n  background-color: #7289da !important;\n}\n\n/* line 456, src/styles/common/_global.scss */\n\n.c-rss {\n  color: orange !important;\n}\n\n/* line 457, src/styles/common/_global.scss */\n\n.bg-rss,\n.sideNav-follow .i-rss {\n  background-color: orange !important;\n}\n\n/* line 480, src/styles/common/_global.scss */\n\n.rocket {\n  bottom: 50px;\n  position: fixed;\n  right: 20px;\n  text-align: center;\n  width: 60px;\n  z-index: 5;\n}\n\n/* line 488, src/styles/common/_global.scss */\n\n.rocket:hover svg path {\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n/* line 493, src/styles/common/_global.scss */\n\n.svgIcon {\n  display: inline-block;\n}\n\n/* line 497, src/styles/common/_global.scss */\n\nsvg {\n  height: auto;\n  width: 100%;\n}\n\n/* line 505, src/styles/common/_global.scss */\n\n.load-more {\n  max-width: 70% !important;\n}\n\n/* line 510, src/styles/common/_global.scss */\n\n.loadingBar {\n  background-color: #48e79a;\n  display: none;\n  height: 2px;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateX(100%);\n  z-index: 800;\n}\n\n/* line 522, src/styles/common/_global.scss */\n\n.is-loading .loadingBar {\n  animation: loading-bar 1s ease-in-out infinite;\n  animation-delay: .8s;\n  display: block;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 531, src/styles/common/_global.scss */\n\n  blockquote {\n    margin-left: -5px;\n    font-size: 1.125rem;\n  }\n\n  /* line 533, src/styles/common/_global.scss */\n\n  .kg-image-card,\n  .kg-embed-card {\n    margin-right: -20px;\n    margin-left: -20px;\n  }\n}\n\n/* line 2, src/styles/components/_grid.scss */\n\n.extreme-container {\n  box-sizing: border-box;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding: 0 16px;\n  width: 100%;\n}\n\n/* line 25, src/styles/components/_grid.scss */\n\n.col-left,\n.cc-video-left {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%;\n  padding-right: 10px;\n  padding-left: 10px;\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 38, src/styles/components/_grid.scss */\n\n  .col-left {\n    max-width: calc(100% - 340px);\n  }\n\n  /* line 39, src/styles/components/_grid.scss */\n\n  .cc-video-left {\n    max-width: calc(100% - 320px);\n  }\n\n  /* line 40, src/styles/components/_grid.scss */\n\n  .cc-video-right {\n    flex-basis: 320px !important;\n    max-width: 320px !important;\n  }\n\n  /* line 41, src/styles/components/_grid.scss */\n\n  body.is-article .col-left {\n    padding-right: 40px;\n  }\n}\n\n/* line 44, src/styles/components/_grid.scss */\n\n.col-right {\n  display: flex;\n  flex-direction: column;\n  padding-left: 10px;\n  padding-right: 10px;\n  width: 320px;\n}\n\n/* line 52, src/styles/components/_grid.scss */\n\n.row {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  flex: 0 1 auto;\n  margin-left: -10px;\n  margin-right: -10px;\n}\n\n/* line 60, src/styles/components/_grid.scss */\n\n.row .col {\n  flex: 0 0 auto;\n  box-sizing: border-box;\n  padding-left: 10px;\n  padding-right: 10px;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s1 {\n  flex-basis: 8.33333%;\n  max-width: 8.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s2 {\n  flex-basis: 16.66667%;\n  max-width: 16.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s3 {\n  flex-basis: 25%;\n  max-width: 25%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s4 {\n  flex-basis: 33.33333%;\n  max-width: 33.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s5 {\n  flex-basis: 41.66667%;\n  max-width: 41.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s6 {\n  flex-basis: 50%;\n  max-width: 50%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s7 {\n  flex-basis: 58.33333%;\n  max-width: 58.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s8 {\n  flex-basis: 66.66667%;\n  max-width: 66.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s9 {\n  flex-basis: 75%;\n  max-width: 75%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s10 {\n  flex-basis: 83.33333%;\n  max-width: 83.33333%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s11 {\n  flex-basis: 91.66667%;\n  max-width: 91.66667%;\n}\n\n/* line 71, src/styles/components/_grid.scss */\n\n.row .col.s12 {\n  flex-basis: 100%;\n  max-width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m3 {\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m6 {\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m9 {\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  /* line 86, src/styles/components/_grid.scss */\n\n  .row .col.m12 {\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l3 {\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l6 {\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l9 {\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%;\n  }\n\n  /* line 102, src/styles/components/_grid.scss */\n\n  .row .col.l12 {\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n}\n\n/* line 3, src/styles/common/_typography.scss */\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  color: inherit;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-weight: 600;\n  line-height: 1.1;\n  margin: 0;\n}\n\n/* line 10, src/styles/common/_typography.scss */\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  color: inherit;\n  line-height: inherit;\n}\n\n/* line 16, src/styles/common/_typography.scss */\n\nh1 {\n  font-size: 2rem;\n}\n\n/* line 17, src/styles/common/_typography.scss */\n\nh2 {\n  font-size: 1.875rem;\n}\n\n/* line 18, src/styles/common/_typography.scss */\n\nh3 {\n  font-size: 1.6rem;\n}\n\n/* line 19, src/styles/common/_typography.scss */\n\nh4 {\n  font-size: 1.4rem;\n}\n\n/* line 20, src/styles/common/_typography.scss */\n\nh5 {\n  font-size: 1.2rem;\n}\n\n/* line 21, src/styles/common/_typography.scss */\n\nh6 {\n  font-size: 1rem;\n}\n\n/* line 23, src/styles/common/_typography.scss */\n\np {\n  margin: 0;\n}\n\n/* line 2, src/styles/common/_utilities.scss */\n\n.u-textColorNormal {\n  color: #999999 !important;\n  fill: #999999 !important;\n}\n\n/* line 9, src/styles/common/_utilities.scss */\n\n.u-textColorWhite {\n  color: #fff !important;\n  fill: #fff !important;\n}\n\n/* line 14, src/styles/common/_utilities.scss */\n\n.u-hoverColorNormal:hover {\n  color: rgba(0, 0, 0, 0.6);\n  fill: rgba(0, 0, 0, 0.6);\n}\n\n/* line 19, src/styles/common/_utilities.scss */\n\n.u-accentColor--iconNormal {\n  color: #1C9963;\n  fill: #1C9963;\n}\n\n/* line 25, src/styles/common/_utilities.scss */\n\n.u-bgColor {\n  background-color: var(--primary-color);\n}\n\n/* line 30, src/styles/common/_utilities.scss */\n\n.u-relative {\n  position: relative;\n}\n\n/* line 31, src/styles/common/_utilities.scss */\n\n.u-absolute {\n  position: absolute;\n}\n\n/* line 33, src/styles/common/_utilities.scss */\n\n.u-fixed {\n  position: fixed !important;\n}\n\n/* line 35, src/styles/common/_utilities.scss */\n\n.u-block {\n  display: block !important;\n}\n\n/* line 36, src/styles/common/_utilities.scss */\n\n.u-inlineBlock {\n  display: inline-block;\n}\n\n/* line 39, src/styles/common/_utilities.scss */\n\n.u-backgroundDark {\n  background-color: #0d0f10;\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n\n/* line 50, src/styles/common/_utilities.scss */\n\n.u-gradient {\n  background: linear-gradient(to bottom, transparent 20%, #000 100%);\n  bottom: 0;\n  height: 90%;\n  left: 0;\n  position: absolute;\n  right: 0;\n  z-index: 1;\n}\n\n/* line 61, src/styles/common/_utilities.scss */\n\n.zindex1 {\n  z-index: 1;\n}\n\n/* line 62, src/styles/common/_utilities.scss */\n\n.zindex2 {\n  z-index: 2;\n}\n\n/* line 63, src/styles/common/_utilities.scss */\n\n.zindex3 {\n  z-index: 3;\n}\n\n/* line 64, src/styles/common/_utilities.scss */\n\n.zindex4 {\n  z-index: 4;\n}\n\n/* line 67, src/styles/common/_utilities.scss */\n\n.u-backgroundWhite {\n  background-color: #fafafa;\n}\n\n/* line 68, src/styles/common/_utilities.scss */\n\n.u-backgroundColorGrayLight {\n  background-color: #f0f0f0 !important;\n}\n\n/* line 71, src/styles/common/_utilities.scss */\n\n.u-clear::after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n/* line 78, src/styles/common/_utilities.scss */\n\n.u-fontSizeMicro {\n  font-size: 11px;\n}\n\n/* line 79, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmallest {\n  font-size: 12px;\n}\n\n/* line 80, src/styles/common/_utilities.scss */\n\n.u-fontSize13 {\n  font-size: 13px;\n}\n\n/* line 81, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmaller {\n  font-size: 14px;\n}\n\n/* line 82, src/styles/common/_utilities.scss */\n\n.u-fontSize15 {\n  font-size: 15px;\n}\n\n/* line 83, src/styles/common/_utilities.scss */\n\n.u-fontSizeSmall {\n  font-size: 16px;\n}\n\n/* line 84, src/styles/common/_utilities.scss */\n\n.u-fontSizeBase {\n  font-size: 18px;\n}\n\n/* line 85, src/styles/common/_utilities.scss */\n\n.u-fontSize20 {\n  font-size: 20px;\n}\n\n/* line 86, src/styles/common/_utilities.scss */\n\n.u-fontSize21 {\n  font-size: 21px;\n}\n\n/* line 87, src/styles/common/_utilities.scss */\n\n.u-fontSize22 {\n  font-size: 22px;\n}\n\n/* line 88, src/styles/common/_utilities.scss */\n\n.u-fontSizeLarge {\n  font-size: 24px;\n}\n\n/* line 89, src/styles/common/_utilities.scss */\n\n.u-fontSize26 {\n  font-size: 26px;\n}\n\n/* line 90, src/styles/common/_utilities.scss */\n\n.u-fontSize28 {\n  font-size: 28px;\n}\n\n/* line 91, src/styles/common/_utilities.scss */\n\n.u-fontSizeLarger,\n.media-type {\n  font-size: 32px;\n}\n\n/* line 92, src/styles/common/_utilities.scss */\n\n.u-fontSize36 {\n  font-size: 36px;\n}\n\n/* line 93, src/styles/common/_utilities.scss */\n\n.u-fontSize40 {\n  font-size: 40px;\n}\n\n/* line 94, src/styles/common/_utilities.scss */\n\n.u-fontSizeLargest {\n  font-size: 44px;\n}\n\n/* line 95, src/styles/common/_utilities.scss */\n\n.u-fontSizeJumbo {\n  font-size: 50px;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 98, src/styles/common/_utilities.scss */\n\n  .u-md-fontSizeBase {\n    font-size: 18px;\n  }\n\n  /* line 99, src/styles/common/_utilities.scss */\n\n  .u-md-fontSize22 {\n    font-size: 22px;\n  }\n\n  /* line 100, src/styles/common/_utilities.scss */\n\n  .u-md-fontSizeLarger {\n    font-size: 32px;\n  }\n}\n\n/* line 116, src/styles/common/_utilities.scss */\n\n.u-fontWeightThin {\n  font-weight: 300;\n}\n\n/* line 117, src/styles/common/_utilities.scss */\n\n.u-fontWeightNormal {\n  font-weight: 400;\n}\n\n/* line 118, src/styles/common/_utilities.scss */\n\n.u-fontWeightMedium {\n  font-weight: 500;\n}\n\n/* line 119, src/styles/common/_utilities.scss */\n\n.u-fontWeightSemibold {\n  font-weight: 600 !important;\n}\n\n/* line 120, src/styles/common/_utilities.scss */\n\n.u-fontWeightBold {\n  font-weight: 700;\n}\n\n/* line 121, src/styles/common/_utilities.scss */\n\n.u-fontWeightBolder {\n  font-weight: 900;\n}\n\n/* line 123, src/styles/common/_utilities.scss */\n\n.u-textUppercase {\n  text-transform: uppercase;\n}\n\n/* line 124, src/styles/common/_utilities.scss */\n\n.u-textCapitalize {\n  text-transform: capitalize;\n}\n\n/* line 125, src/styles/common/_utilities.scss */\n\n.u-textAlignCenter {\n  text-align: center;\n}\n\n/* line 127, src/styles/common/_utilities.scss */\n\n.u-noWrapWithEllipsis {\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important;\n}\n\n/* line 134, src/styles/common/_utilities.scss */\n\n.u-marginAuto {\n  margin-left: auto;\n  margin-right: auto;\n}\n\n/* line 135, src/styles/common/_utilities.scss */\n\n.u-marginTop20 {\n  margin-top: 20px;\n}\n\n/* line 136, src/styles/common/_utilities.scss */\n\n.u-marginTop30 {\n  margin-top: 30px;\n}\n\n/* line 137, src/styles/common/_utilities.scss */\n\n.u-marginBottom10 {\n  margin-bottom: 10px;\n}\n\n/* line 138, src/styles/common/_utilities.scss */\n\n.u-marginBottom15 {\n  margin-bottom: 15px;\n}\n\n/* line 139, src/styles/common/_utilities.scss */\n\n.u-marginBottom20 {\n  margin-bottom: 20px !important;\n}\n\n/* line 140, src/styles/common/_utilities.scss */\n\n.u-marginBottom30 {\n  margin-bottom: 30px;\n}\n\n/* line 141, src/styles/common/_utilities.scss */\n\n.u-marginBottom40 {\n  margin-bottom: 40px;\n}\n\n/* line 144, src/styles/common/_utilities.scss */\n\n.u-padding0 {\n  padding: 0 !important;\n}\n\n/* line 145, src/styles/common/_utilities.scss */\n\n.u-padding20 {\n  padding: 20px;\n}\n\n/* line 146, src/styles/common/_utilities.scss */\n\n.u-padding15 {\n  padding: 15px !important;\n}\n\n/* line 147, src/styles/common/_utilities.scss */\n\n.u-paddingBottom2 {\n  padding-bottom: 2px;\n}\n\n/* line 148, src/styles/common/_utilities.scss */\n\n.u-paddingBottom30 {\n  padding-bottom: 30px;\n}\n\n/* line 149, src/styles/common/_utilities.scss */\n\n.u-paddingBottom20 {\n  padding-bottom: 20px;\n}\n\n/* line 150, src/styles/common/_utilities.scss */\n\n.u-paddingRight10 {\n  padding-right: 10px;\n}\n\n/* line 151, src/styles/common/_utilities.scss */\n\n.u-paddingLeft15 {\n  padding-left: 15px;\n}\n\n/* line 153, src/styles/common/_utilities.scss */\n\n.u-paddingTop2 {\n  padding-top: 2px;\n}\n\n/* line 154, src/styles/common/_utilities.scss */\n\n.u-paddingTop5 {\n  padding-top: 5px;\n}\n\n/* line 155, src/styles/common/_utilities.scss */\n\n.u-paddingTop10 {\n  padding-top: 10px;\n}\n\n/* line 156, src/styles/common/_utilities.scss */\n\n.u-paddingTop15 {\n  padding-top: 15px;\n}\n\n/* line 157, src/styles/common/_utilities.scss */\n\n.u-paddingTop20 {\n  padding-top: 20px;\n}\n\n/* line 158, src/styles/common/_utilities.scss */\n\n.u-paddingTop30 {\n  padding-top: 30px;\n}\n\n/* line 160, src/styles/common/_utilities.scss */\n\n.u-paddingBottom15 {\n  padding-bottom: 15px;\n}\n\n/* line 162, src/styles/common/_utilities.scss */\n\n.u-paddingRight20 {\n  padding-right: 20px;\n}\n\n/* line 163, src/styles/common/_utilities.scss */\n\n.u-paddingLeft20 {\n  padding-left: 20px;\n}\n\n/* line 165, src/styles/common/_utilities.scss */\n\n.u-contentTitle {\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-style: normal;\n  font-weight: 900;\n  letter-spacing: -.028em;\n}\n\n/* line 173, src/styles/common/_utilities.scss */\n\n.u-lineHeight1 {\n  line-height: 1;\n}\n\n/* line 174, src/styles/common/_utilities.scss */\n\n.u-lineHeightTight {\n  line-height: 1.2;\n}\n\n/* line 177, src/styles/common/_utilities.scss */\n\n.u-overflowHidden {\n  overflow: hidden;\n}\n\n/* line 180, src/styles/common/_utilities.scss */\n\n.u-floatRight {\n  float: right;\n}\n\n/* line 181, src/styles/common/_utilities.scss */\n\n.u-floatLeft {\n  float: left;\n}\n\n/* line 184, src/styles/common/_utilities.scss */\n\n.u-flex {\n  display: flex;\n}\n\n/* line 185, src/styles/common/_utilities.scss */\n\n.u-flexCenter,\n.media-type {\n  align-items: center;\n  display: flex;\n}\n\n/* line 186, src/styles/common/_utilities.scss */\n\n.u-flexContentCenter,\n.media-type {\n  justify-content: center;\n}\n\n/* line 188, src/styles/common/_utilities.scss */\n\n.u-flex1 {\n  flex: 1 1 auto;\n}\n\n/* line 189, src/styles/common/_utilities.scss */\n\n.u-flex0 {\n  flex: 0 0 auto;\n}\n\n/* line 190, src/styles/common/_utilities.scss */\n\n.u-flexWrap {\n  flex-wrap: wrap;\n}\n\n/* line 192, src/styles/common/_utilities.scss */\n\n.u-flexColumn {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n/* line 198, src/styles/common/_utilities.scss */\n\n.u-flexEnd {\n  align-items: center;\n  justify-content: flex-end;\n}\n\n/* line 203, src/styles/common/_utilities.scss */\n\n.u-flexColumnTop {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n}\n\n/* line 210, src/styles/common/_utilities.scss */\n\n.u-backgroundSizeCover {\n  background-origin: border-box;\n  background-position: center;\n  background-size: cover;\n}\n\n/* line 217, src/styles/common/_utilities.scss */\n\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 20px;\n  padding-right: 20px;\n}\n\n/* line 224, src/styles/common/_utilities.scss */\n\n.u-maxWidth1200 {\n  max-width: 1200px;\n}\n\n/* line 225, src/styles/common/_utilities.scss */\n\n.u-maxWidth1000 {\n  max-width: 1000px;\n}\n\n/* line 226, src/styles/common/_utilities.scss */\n\n.u-maxWidth740 {\n  max-width: 740px;\n}\n\n/* line 227, src/styles/common/_utilities.scss */\n\n.u-maxWidth1040 {\n  max-width: 1040px;\n}\n\n/* line 228, src/styles/common/_utilities.scss */\n\n.u-sizeFullWidth {\n  width: 100%;\n}\n\n/* line 229, src/styles/common/_utilities.scss */\n\n.u-sizeFullHeight {\n  height: 100%;\n}\n\n/* line 232, src/styles/common/_utilities.scss */\n\n.u-borderLighter {\n  border: 1px solid rgba(0, 0, 0, 0.15);\n}\n\n/* line 233, src/styles/common/_utilities.scss */\n\n.u-round,\n.avatar-image,\n.media-type {\n  border-radius: 50%;\n}\n\n/* line 234, src/styles/common/_utilities.scss */\n\n.u-borderRadius2 {\n  border-radius: 2px;\n}\n\n/* line 236, src/styles/common/_utilities.scss */\n\n.u-boxShadowBottom {\n  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.05);\n}\n\n/* line 241, src/styles/common/_utilities.scss */\n\n.u-height540 {\n  height: 540px;\n}\n\n/* line 242, src/styles/common/_utilities.scss */\n\n.u-height280 {\n  height: 280px;\n}\n\n/* line 243, src/styles/common/_utilities.scss */\n\n.u-height260 {\n  height: 260px;\n}\n\n/* line 244, src/styles/common/_utilities.scss */\n\n.u-height100 {\n  height: 100px;\n}\n\n/* line 245, src/styles/common/_utilities.scss */\n\n.u-borderBlackLightest {\n  border: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n/* line 248, src/styles/common/_utilities.scss */\n\n.u-hide {\n  display: none !important;\n}\n\n/* line 251, src/styles/common/_utilities.scss */\n\n.u-card {\n  background: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.09);\n  border-radius: 3px;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  margin-bottom: 10px;\n  padding: 10px 20px 15px;\n}\n\n/* line 262, src/styles/common/_utilities.scss */\n\n.title-line {\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n/* line 267, src/styles/common/_utilities.scss */\n\n.title-line::before {\n  content: '';\n  background: rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  position: absolute;\n  left: 0;\n  bottom: 50%;\n  width: 100%;\n  height: 1px;\n  z-index: 0;\n}\n\n/* line 281, src/styles/common/_utilities.scss */\n\n.u-oblique {\n  background-color: var(--composite-color);\n  color: #fff;\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 700;\n  line-height: 1;\n  padding: 5px 13px;\n  text-transform: uppercase;\n  transform: skewX(-15deg);\n}\n\n/* line 293, src/styles/common/_utilities.scss */\n\n.no-avatar {\n  background-image: url(\"./../images/avatar.png\") !important;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 298, src/styles/common/_utilities.scss */\n\n  .u-hide-before-md {\n    display: none !important;\n  }\n\n  /* line 299, src/styles/common/_utilities.scss */\n\n  .u-md-heightAuto {\n    height: auto;\n  }\n\n  /* line 300, src/styles/common/_utilities.scss */\n\n  .u-md-height170 {\n    height: 170px;\n  }\n\n  /* line 301, src/styles/common/_utilities.scss */\n\n  .u-md-relative {\n    position: relative;\n  }\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 304, src/styles/common/_utilities.scss */\n\n  .u-hide-before-lg {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 307, src/styles/common/_utilities.scss */\n\n  .u-hide-after-md {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 309, src/styles/common/_utilities.scss */\n\n  .u-hide-after-lg {\n    display: none !important;\n  }\n}\n\n/* line 1, src/styles/components/_form.scss */\n\n.button {\n  background: transparent;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  box-sizing: border-box;\n  color: rgba(0, 0, 0, 0.44);\n  cursor: pointer;\n  display: inline-block;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  height: 37px;\n  letter-spacing: 0;\n  line-height: 35px;\n  padding: 0 16px;\n  position: relative;\n  text-align: center;\n  text-decoration: none;\n  text-rendering: optimizeLegibility;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n\n/* line 25, src/styles/components/_form.scss */\n\n.button--chromeless {\n  border-radius: 0;\n  border-width: 0;\n  box-shadow: none;\n  color: rgba(0, 0, 0, 0.44);\n  height: auto;\n  line-height: inherit;\n  padding: 0;\n  text-align: left;\n  vertical-align: baseline;\n  white-space: normal;\n}\n\n/* line 37, src/styles/components/_form.scss */\n\n.button--chromeless:active,\n.button--chromeless:hover,\n.button--chromeless:focus {\n  border-width: 0;\n  color: rgba(0, 0, 0, 0.6);\n}\n\n/* line 45, src/styles/components/_form.scss */\n\n.button--large {\n  font-size: 15px;\n  height: 44px;\n  line-height: 42px;\n  padding: 0 18px;\n}\n\n/* line 52, src/styles/components/_form.scss */\n\n.button--dark {\n  background: rgba(0, 0, 0, 0.84);\n  border-color: rgba(0, 0, 0, 0.84);\n  color: rgba(255, 255, 255, 0.97);\n}\n\n/* line 57, src/styles/components/_form.scss */\n\n.button--dark:hover {\n  background: #1C9963;\n  border-color: #1C9963;\n}\n\n/* line 65, src/styles/components/_form.scss */\n\n.button--primary {\n  border-color: #1C9963;\n  color: #1C9963;\n}\n\n/* line 70, src/styles/components/_form.scss */\n\n.button--large.button--chromeless,\n.button--large.button--link {\n  padding: 0;\n}\n\n/* line 76, src/styles/components/_form.scss */\n\n.buttonSet > .button {\n  margin-right: 8px;\n  vertical-align: middle;\n}\n\n/* line 81, src/styles/components/_form.scss */\n\n.buttonSet > .button:last-child {\n  margin-right: 0;\n}\n\n/* line 85, src/styles/components/_form.scss */\n\n.buttonSet .button--chromeless {\n  height: 37px;\n  line-height: 35px;\n}\n\n/* line 90, src/styles/components/_form.scss */\n\n.buttonSet .button--large.button--chromeless,\n.buttonSet .button--large.button--link {\n  height: 44px;\n  line-height: 42px;\n}\n\n/* line 96, src/styles/components/_form.scss */\n\n.buttonSet > .button--chromeless:not(.button--circle) {\n  margin-right: 0;\n  padding-right: 8px;\n}\n\n/* line 101, src/styles/components/_form.scss */\n\n.buttonSet > .button--chromeless:last-child {\n  padding-right: 0;\n}\n\n/* line 105, src/styles/components/_form.scss */\n\n.buttonSet > .button--chromeless + .button--chromeless:not(.button--circle) {\n  margin-left: 0;\n  padding-left: 8px;\n}\n\n/* line 111, src/styles/components/_form.scss */\n\n.button--circle {\n  background-image: none !important;\n  border-radius: 50%;\n  color: #fff;\n  height: 40px;\n  line-height: 38px;\n  padding: 0;\n  text-decoration: none;\n  width: 40px;\n}\n\n/* line 124, src/styles/components/_form.scss */\n\n.tag-button {\n  background: rgba(0, 0, 0, 0.05);\n  border: none;\n  color: rgba(0, 0, 0, 0.68);\n  font-weight: 700;\n  margin: 0 8px 8px 0;\n}\n\n/* line 131, src/styles/components/_form.scss */\n\n.tag-button:hover {\n  background: rgba(0, 0, 0, 0.1);\n  color: rgba(0, 0, 0, 0.68);\n}\n\n/* line 139, src/styles/components/_form.scss */\n\n.button--dark-line {\n  border: 1px solid #000;\n  color: #000;\n  display: block;\n  font-weight: 600;\n  margin: 50px auto 0;\n  max-width: 300px;\n  text-transform: uppercase;\n  transition: color 0.3s ease, box-shadow 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);\n  width: 100%;\n}\n\n/* line 150, src/styles/components/_form.scss */\n\n.button--dark-line:hover {\n  color: #fff;\n  box-shadow: inset 0 -50px 8px -4px #000;\n}\n\n@font-face {\n  font-family: 'mapache';\n  src: url(\"./../fonts/mapache.eot\");\n  src: url(\"./../fonts/mapache.eot\") format(\"embedded-opentype\"), url(\"./../fonts/mapache.ttf\") format(\"truetype\"), url(\"./../fonts/mapache.woff\") format(\"woff\"), url(\"./../fonts/mapache.svg\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n\n/* line 17, src/styles/components/_icons.scss */\n\n.i-tag:before {\n  content: \"\\e911\";\n}\n\n/* line 20, src/styles/components/_icons.scss */\n\n.i-discord:before {\n  content: \"\\e90a\";\n}\n\n/* line 23, src/styles/components/_icons.scss */\n\n.i-arrow-round-next:before {\n  content: \"\\e90c\";\n}\n\n/* line 26, src/styles/components/_icons.scss */\n\n.i-arrow-round-prev:before {\n  content: \"\\e90d\";\n}\n\n/* line 29, src/styles/components/_icons.scss */\n\n.i-arrow-round-up:before {\n  content: \"\\e90e\";\n}\n\n/* line 32, src/styles/components/_icons.scss */\n\n.i-arrow-round-down:before {\n  content: \"\\e90f\";\n}\n\n/* line 35, src/styles/components/_icons.scss */\n\n.i-photo:before {\n  content: \"\\e90b\";\n}\n\n/* line 38, src/styles/components/_icons.scss */\n\n.i-send:before {\n  content: \"\\e909\";\n}\n\n/* line 41, src/styles/components/_icons.scss */\n\n.i-audio:before {\n  content: \"\\e901\";\n}\n\n/* line 44, src/styles/components/_icons.scss */\n\n.i-rocket:before {\n  content: \"\\e902\";\n  color: #999;\n}\n\n/* line 48, src/styles/components/_icons.scss */\n\n.i-comments-line:before {\n  content: \"\\e900\";\n}\n\n/* line 51, src/styles/components/_icons.scss */\n\n.i-globe:before {\n  content: \"\\e906\";\n}\n\n/* line 54, src/styles/components/_icons.scss */\n\n.i-star:before {\n  content: \"\\e907\";\n}\n\n/* line 57, src/styles/components/_icons.scss */\n\n.i-link:before {\n  content: \"\\e908\";\n}\n\n/* line 60, src/styles/components/_icons.scss */\n\n.i-star-line:before {\n  content: \"\\e903\";\n}\n\n/* line 63, src/styles/components/_icons.scss */\n\n.i-more:before {\n  content: \"\\e904\";\n}\n\n/* line 66, src/styles/components/_icons.scss */\n\n.i-search:before {\n  content: \"\\e905\";\n}\n\n/* line 69, src/styles/components/_icons.scss */\n\n.i-chat:before {\n  content: \"\\e910\";\n}\n\n/* line 72, src/styles/components/_icons.scss */\n\n.i-arrow-left:before {\n  content: \"\\e314\";\n}\n\n/* line 75, src/styles/components/_icons.scss */\n\n.i-arrow-right:before {\n  content: \"\\e315\";\n}\n\n/* line 78, src/styles/components/_icons.scss */\n\n.i-play:before {\n  content: \"\\e037\";\n}\n\n/* line 81, src/styles/components/_icons.scss */\n\n.i-location:before {\n  content: \"\\e8b4\";\n}\n\n/* line 84, src/styles/components/_icons.scss */\n\n.i-check-circle:before {\n  content: \"\\e86c\";\n}\n\n/* line 87, src/styles/components/_icons.scss */\n\n.i-close:before {\n  content: \"\\e5cd\";\n}\n\n/* line 90, src/styles/components/_icons.scss */\n\n.i-favorite:before {\n  content: \"\\e87d\";\n}\n\n/* line 93, src/styles/components/_icons.scss */\n\n.i-warning:before {\n  content: \"\\e002\";\n}\n\n/* line 96, src/styles/components/_icons.scss */\n\n.i-rss:before {\n  content: \"\\e0e5\";\n}\n\n/* line 99, src/styles/components/_icons.scss */\n\n.i-share:before {\n  content: \"\\e80d\";\n}\n\n/* line 102, src/styles/components/_icons.scss */\n\n.i-email:before {\n  content: \"\\f0e0\";\n}\n\n/* line 105, src/styles/components/_icons.scss */\n\n.i-google:before {\n  content: \"\\f1a0\";\n}\n\n/* line 108, src/styles/components/_icons.scss */\n\n.i-telegram:before {\n  content: \"\\f2c6\";\n}\n\n/* line 111, src/styles/components/_icons.scss */\n\n.i-reddit:before {\n  content: \"\\f281\";\n}\n\n/* line 114, src/styles/components/_icons.scss */\n\n.i-twitter:before {\n  content: \"\\f099\";\n}\n\n/* line 117, src/styles/components/_icons.scss */\n\n.i-github:before {\n  content: \"\\f09b\";\n}\n\n/* line 120, src/styles/components/_icons.scss */\n\n.i-linkedin:before {\n  content: \"\\f0e1\";\n}\n\n/* line 123, src/styles/components/_icons.scss */\n\n.i-youtube:before {\n  content: \"\\f16a\";\n}\n\n/* line 126, src/styles/components/_icons.scss */\n\n.i-stack-overflow:before {\n  content: \"\\f16c\";\n}\n\n/* line 129, src/styles/components/_icons.scss */\n\n.i-instagram:before {\n  content: \"\\f16d\";\n}\n\n/* line 132, src/styles/components/_icons.scss */\n\n.i-flickr:before {\n  content: \"\\f16e\";\n}\n\n/* line 135, src/styles/components/_icons.scss */\n\n.i-dribbble:before {\n  content: \"\\f17d\";\n}\n\n/* line 138, src/styles/components/_icons.scss */\n\n.i-behance:before {\n  content: \"\\f1b4\";\n}\n\n/* line 141, src/styles/components/_icons.scss */\n\n.i-spotify:before {\n  content: \"\\f1bc\";\n}\n\n/* line 144, src/styles/components/_icons.scss */\n\n.i-codepen:before {\n  content: \"\\f1cb\";\n}\n\n/* line 147, src/styles/components/_icons.scss */\n\n.i-facebook:before {\n  content: \"\\f230\";\n}\n\n/* line 150, src/styles/components/_icons.scss */\n\n.i-pinterest:before {\n  content: \"\\f231\";\n}\n\n/* line 153, src/styles/components/_icons.scss */\n\n.i-whatsapp:before {\n  content: \"\\f232\";\n}\n\n/* line 156, src/styles/components/_icons.scss */\n\n.i-snapchat:before {\n  content: \"\\f2ac\";\n}\n\n/* line 2, src/styles/components/_animated.scss */\n\n.animated {\n  animation-duration: 1s;\n  animation-fill-mode: both;\n}\n\n/* line 6, src/styles/components/_animated.scss */\n\n.animated.infinite {\n  animation-iteration-count: infinite;\n}\n\n/* line 12, src/styles/components/_animated.scss */\n\n.bounceIn {\n  animation-name: bounceIn;\n}\n\n/* line 13, src/styles/components/_animated.scss */\n\n.bounceInDown {\n  animation-name: bounceInDown;\n}\n\n/* line 14, src/styles/components/_animated.scss */\n\n.pulse {\n  animation-name: pulse;\n}\n\n/* line 15, src/styles/components/_animated.scss */\n\n.slideInUp {\n  animation-name: slideInUp;\n}\n\n/* line 16, src/styles/components/_animated.scss */\n\n.slideOutDown {\n  animation-name: slideOutDown;\n}\n\n@keyframes bounceIn {\n  0%, 20%, 40%, 60%, 80%, 100% {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    animation-timing-function: cubic-bezier(215, 610, 355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    transform: none;\n  }\n}\n\n@keyframes pulse {\n  from {\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    transform: scale3d(1.2, 1.2, 1.2);\n  }\n\n  to {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes scroll {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n\n  100% {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n}\n\n@keyframes opacity {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes tooltip {\n  0% {\n    opacity: 0;\n    transform: translate(-50%, 6px);\n  }\n\n  100% {\n    opacity: 1;\n    transform: translate(-50%, 0);\n  }\n}\n\n@keyframes loading-bar {\n  0% {\n    transform: translateX(-100%);\n  }\n\n  40% {\n    transform: translateX(0);\n  }\n\n  60% {\n    transform: translateX(0);\n  }\n\n  100% {\n    transform: translateX(100%);\n  }\n}\n\n@keyframes arrow-move-right {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    transform: translateX(-100%);\n    opacity: 0;\n  }\n\n  100% {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@keyframes arrow-move-left {\n  0% {\n    opacity: 0;\n  }\n\n  10% {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n\n  100% {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@keyframes slideInUp {\n  from {\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideOutDown {\n  from {\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 20%, 0);\n  }\n}\n\n/* line 4, src/styles/layouts/_header.scss */\n\n.header-logo,\n.menu--toggle,\n.search-toggle {\n  z-index: 15;\n}\n\n/* line 10, src/styles/layouts/_header.scss */\n\n.header {\n  box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\n  padding: 0 16px;\n  position: sticky;\n  top: 0;\n  transition: all 0.4s ease-in-out;\n  z-index: 10;\n}\n\n/* line 18, src/styles/layouts/_header.scss */\n\n.header-wrap {\n  height: 50px;\n}\n\n/* line 20, src/styles/layouts/_header.scss */\n\n.header-logo {\n  color: #fff !important;\n  height: 30px;\n}\n\n/* line 24, src/styles/layouts/_header.scss */\n\n.header-logo img {\n  max-height: 100%;\n}\n\n/* line 29, src/styles/layouts/_header.scss */\n\n.not-logo .header-logo {\n  height: auto !important;\n}\n\n/* line 32, src/styles/layouts/_header.scss */\n\n.header-line {\n  height: 50px;\n  border-right: 1px solid rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  margin-right: 10px;\n}\n\n/* line 41, src/styles/layouts/_header.scss */\n\n.follow-more {\n  transition: width .4s ease;\n  overflow: hidden;\n  width: 0;\n}\n\n/* line 48, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-more {\n  width: auto;\n}\n\n/* line 49, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-toggle {\n  color: var(--header-color-hover);\n}\n\n/* line 50, src/styles/layouts/_header.scss */\n\nbody.is-showFollowMore .follow-toggle::before {\n  content: \"\\e5cd\";\n}\n\n/* line 56, src/styles/layouts/_header.scss */\n\n.nav {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  position: relative;\n  overflow: hidden;\n}\n\n/* line 62, src/styles/layouts/_header.scss */\n\n.nav ul {\n  display: flex;\n  margin-right: 20px;\n  overflow: hidden;\n  white-space: nowrap;\n}\n\n/* line 70, src/styles/layouts/_header.scss */\n\n.header-left a,\n.nav ul li a {\n  border-radius: 3px;\n  color: var(--header-color);\n  display: inline-block;\n  font-weight: 600;\n  line-height: 30px;\n  padding: 0 8px;\n  text-align: center;\n  text-transform: uppercase;\n  vertical-align: middle;\n}\n\n/* line 82, src/styles/layouts/_header.scss */\n\n.header-left a.active,\n.header-left a:hover,\n.nav ul li a.active,\n.nav ul li a:hover {\n  color: var(--header-color-hover);\n}\n\n/* line 89, src/styles/layouts/_header.scss */\n\n.menu--toggle {\n  height: 48px;\n  position: relative;\n  transition: transform .4s;\n  width: 48px;\n}\n\n/* line 95, src/styles/layouts/_header.scss */\n\n.menu--toggle span {\n  background-color: var(--header-color);\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  transition: .4s;\n  width: 20px;\n}\n\n/* line 106, src/styles/layouts/_header.scss */\n\n.menu--toggle span:first-child {\n  transform: translate(0, -6px);\n}\n\n/* line 107, src/styles/layouts/_header.scss */\n\n.menu--toggle span:last-child {\n  transform: translate(0, 6px);\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 115, src/styles/layouts/_header.scss */\n\n  .header-left {\n    flex-grow: 1 !important;\n  }\n\n  /* line 116, src/styles/layouts/_header.scss */\n\n  .header-logo span {\n    font-size: 24px;\n  }\n\n  /* line 119, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob {\n    overflow: hidden;\n  }\n\n  /* line 122, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .sideNav {\n    transform: translateX(0);\n  }\n\n  /* line 124, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle {\n    border: 0;\n    transform: rotate(90deg);\n  }\n\n  /* line 128, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:first-child {\n    transform: rotate(45deg) translate(0, 0);\n  }\n\n  /* line 129, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:nth-child(2) {\n    transform: scaleX(0);\n  }\n\n  /* line 130, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .menu--toggle span:last-child {\n    transform: rotate(-45deg) translate(0, 0);\n  }\n\n  /* line 133, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .header .button-search--toggle {\n    display: none;\n  }\n\n  /* line 134, src/styles/layouts/_header.scss */\n\n  body.is-showNavMob .main,\n  body.is-showNavMob .footer {\n    transform: translateX(-25%) !important;\n  }\n}\n\n/* line 4, src/styles/layouts/_footer.scss */\n\n.footer {\n  color: #888;\n}\n\n/* line 7, src/styles/layouts/_footer.scss */\n\n.footer a {\n  color: var(--footer-color-link);\n}\n\n/* line 9, src/styles/layouts/_footer.scss */\n\n.footer a:hover {\n  color: #fff;\n}\n\n/* line 12, src/styles/layouts/_footer.scss */\n\n.footer-links {\n  padding: 3em 0 2.5em;\n  background-color: #131313;\n}\n\n/* line 17, src/styles/layouts/_footer.scss */\n\n.footer .follow > a {\n  background: #333;\n  border-radius: 50%;\n  color: inherit;\n  display: inline-block;\n  height: 40px;\n  line-height: 40px;\n  margin: 0 5px 8px;\n  text-align: center;\n  width: 40px;\n}\n\n/* line 28, src/styles/layouts/_footer.scss */\n\n.footer .follow > a:hover {\n  background: transparent;\n  box-shadow: inset 0 0 0 2px #333;\n}\n\n/* line 34, src/styles/layouts/_footer.scss */\n\n.footer-copy {\n  padding: 3em 0;\n  background-color: #000;\n}\n\n/* line 41, src/styles/layouts/_footer.scss */\n\n.footer-menu li {\n  display: inline-block;\n  line-height: 24px;\n  margin: 0 8px;\n  /* stylelint-disable-next-line */\n}\n\n/* line 47, src/styles/layouts/_footer.scss */\n\n.footer-menu li a {\n  color: #888;\n}\n\n/* line 3, src/styles/layouts/_homepage.scss */\n\n.cover {\n  padding: 4px;\n}\n\n/* line 6, src/styles/layouts/_homepage.scss */\n\n.cover-story {\n  overflow: hidden;\n  height: 250px;\n  width: 100%;\n}\n\n/* line 11, src/styles/layouts/_homepage.scss */\n\n.cover-story:hover .cover-header {\n  background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%);\n}\n\n/* line 13, src/styles/layouts/_homepage.scss */\n\n.cover-story.firts {\n  height: 80vh;\n}\n\n/* line 16, src/styles/layouts/_homepage.scss */\n\n.cover-img,\n.cover-link {\n  bottom: 4px;\n  left: 4px;\n  right: 4px;\n  top: 4px;\n}\n\n/* line 25, src/styles/layouts/_homepage.scss */\n\n.cover-header {\n  bottom: 4px;\n  left: 4px;\n  right: 4px;\n  padding: 50px 3.846153846% 20px;\n  background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);\n}\n\n/* line 36, src/styles/layouts/_homepage.scss */\n\n.hm-cover {\n  padding: 30px 0;\n  min-height: 100vh;\n}\n\n/* line 40, src/styles/layouts/_homepage.scss */\n\n.hm-cover-title {\n  font-size: 2.5rem;\n  font-weight: 900;\n  line-height: 1;\n}\n\n/* line 46, src/styles/layouts/_homepage.scss */\n\n.hm-cover-des {\n  max-width: 600px;\n  font-size: 1.25rem;\n}\n\n/* line 52, src/styles/layouts/_homepage.scss */\n\n.hm-subscribe {\n  background-color: transparent;\n  border-radius: 3px;\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);\n  color: #fff;\n  display: block;\n  font-size: 20px;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-top: 50px;\n  max-width: 300px;\n  padding: 15px 10px;\n  transition: all .3s;\n  width: 100%;\n}\n\n/* line 67, src/styles/layouts/_homepage.scss */\n\n.hm-subscribe:hover {\n  box-shadow: inset 0 0 0 2px #fff;\n}\n\n/* line 72, src/styles/layouts/_homepage.scss */\n\n.hm-down {\n  animation-duration: 1.2s !important;\n  bottom: 60px;\n  color: rgba(255, 255, 255, 0.5);\n  left: 0;\n  margin: 0 auto;\n  position: absolute;\n  right: 0;\n  width: 70px;\n  z-index: 100;\n}\n\n/* line 83, src/styles/layouts/_homepage.scss */\n\n.hm-down svg {\n  display: block;\n  fill: currentcolor;\n  height: auto;\n  width: 100%;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 94, src/styles/layouts/_homepage.scss */\n\n  .cover {\n    height: 70vh;\n  }\n\n  /* line 97, src/styles/layouts/_homepage.scss */\n\n  .cover-story {\n    height: 50%;\n    width: 33.33333%;\n  }\n\n  /* line 101, src/styles/layouts/_homepage.scss */\n\n  .cover-story.firts {\n    height: 100%;\n    width: 66.66666%;\n  }\n\n  /* line 105, src/styles/layouts/_homepage.scss */\n\n  .cover-story.firts .cover-title {\n    font-size: 2.5rem;\n  }\n\n  /* line 111, src/styles/layouts/_homepage.scss */\n\n  .hm-cover-title {\n    font-size: 3.5rem;\n  }\n}\n\n/* line 6, src/styles/layouts/_post.scss */\n\n.post-title {\n  color: #000;\n  line-height: 1.2;\n  font-weight: 900;\n  max-width: 1000px;\n}\n\n/* line 13, src/styles/layouts/_post.scss */\n\n.post-excerpt {\n  color: #555;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-weight: 300;\n  letter-spacing: -.012em;\n  line-height: 1.6;\n}\n\n/* line 22, src/styles/layouts/_post.scss */\n\n.post-author-social {\n  vertical-align: middle;\n  margin-left: 2px;\n  padding: 0 3px;\n}\n\n/* line 28, src/styles/layouts/_post.scss */\n\n.post-image {\n  margin-top: 30px;\n}\n\n/* line 33, src/styles/layouts/_post.scss */\n\n.avatar-image {\n  display: inline-block;\n  vertical-align: middle;\n}\n\n/* line 39, src/styles/layouts/_post.scss */\n\n.avatar-image--smaller {\n  width: 50px;\n  height: 50px;\n}\n\n/* line 48, src/styles/layouts/_post.scss */\n\n.post-body a:not(.button):not(.button--circle):not(.prev-next-link) {\n  text-decoration: none;\n  position: relative;\n  transition: all 250ms;\n  box-shadow: inset 0 -3px 0 var(--post-color-link);\n}\n\n/* line 54, src/styles/layouts/_post.scss */\n\n.post-body a:not(.button):not(.button--circle):not(.prev-next-link):hover {\n  box-shadow: inset 0 -1rem 0 var(--post-color-link);\n}\n\n/* line 59, src/styles/layouts/_post.scss */\n\n.post-body img {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n/* line 65, src/styles/layouts/_post.scss */\n\n.post-body h1,\n.post-body h2,\n.post-body h3,\n.post-body h4,\n.post-body h5,\n.post-body h6 {\n  margin-top: 30px;\n  font-weight: 900;\n  font-style: normal;\n  color: #000;\n  letter-spacing: -.02em;\n  line-height: 1.2;\n}\n\n/* line 74, src/styles/layouts/_post.scss */\n\n.post-body h2 {\n  margin-top: 35px;\n}\n\n/* line 76, src/styles/layouts/_post.scss */\n\n.post-body p {\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-size: 1.125rem;\n  font-weight: 400;\n  letter-spacing: -.003em;\n  line-height: 1.7;\n  margin-top: 25px;\n}\n\n/* line 85, src/styles/layouts/_post.scss */\n\n.post-body ul,\n.post-body ol {\n  counter-reset: post;\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-size: 1.125rem;\n  margin-top: 20px;\n}\n\n/* line 92, src/styles/layouts/_post.scss */\n\n.post-body ul li,\n.post-body ol li {\n  letter-spacing: -.003em;\n  margin-bottom: 14px;\n  margin-left: 30px;\n}\n\n/* line 97, src/styles/layouts/_post.scss */\n\n.post-body ul li::before,\n.post-body ol li::before {\n  box-sizing: border-box;\n  display: inline-block;\n  margin-left: -78px;\n  position: absolute;\n  text-align: right;\n  width: 78px;\n}\n\n/* line 108, src/styles/layouts/_post.scss */\n\n.post-body ul li::before {\n  content: '\\2022';\n  font-size: 16.8px;\n  padding-right: 15px;\n  padding-top: 3px;\n}\n\n/* line 115, src/styles/layouts/_post.scss */\n\n.post-body ol li::before {\n  content: counter(post) \".\";\n  counter-increment: post;\n  padding-right: 12px;\n}\n\n/* line 143, src/styles/layouts/_post.scss */\n\n.post-body-wrap {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n/* line 150, src/styles/layouts/_post.scss */\n\n.post-body-wrap h1,\n.post-body-wrap h2,\n.post-body-wrap h3,\n.post-body-wrap h4,\n.post-body-wrap h5,\n.post-body-wrap h6,\n.post-body-wrap p,\n.post-body-wrap ol,\n.post-body-wrap ul,\n.post-body-wrap hr,\n.post-body-wrap pre,\n.post-body-wrap dl,\n.post-body-wrap blockquote,\n.post-body-wrap .post-tags,\n.post-body-wrap .prev-next,\n.post-body-wrap .mob-share,\n.post-body-wrap .kg-embed-card {\n  min-width: 100%;\n}\n\n/* line 156, src/styles/layouts/_post.scss */\n\n.post-body-wrap > ul {\n  margin-top: 35px;\n}\n\n/* line 158, src/styles/layouts/_post.scss */\n\n.post-body-wrap > iframe,\n.post-body-wrap > img,\n.post-body-wrap .kg-image-card,\n.post-body-wrap .kg-card,\n.post-body-wrap .kg-gallery-card,\n.post-body-wrap .kg-embed-card {\n  margin-top: 30px !important;\n}\n\n/* line 170, src/styles/layouts/_post.scss */\n\n.sharePost {\n  left: 0;\n  width: 40px;\n  position: absolute !important;\n  transition: all .4s;\n  top: 30px;\n  /* stylelint-disable-next-line */\n}\n\n/* line 178, src/styles/layouts/_post.scss */\n\n.sharePost a {\n  color: #fff;\n  margin: 8px 0 0;\n  display: block;\n}\n\n/* line 184, src/styles/layouts/_post.scss */\n\n.sharePost .i-chat {\n  background-color: #fff;\n  border: 2px solid #bbb;\n  color: #bbb;\n}\n\n/* line 194, src/styles/layouts/_post.scss */\n\n.post-related {\n  padding: 40px 0;\n}\n\n/* stylelint-disable-next-line */\n\n/* line 201, src/styles/layouts/_post.scss */\n\n.mob-share .mapache-share {\n  height: 40px;\n  color: #fff;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  box-shadow: none !important;\n}\n\n/* line 210, src/styles/layouts/_post.scss */\n\n.mob-share .share-title {\n  font-size: 14px;\n  margin-left: 10px;\n}\n\n/* stylelint-disable-next-line */\n\n/* line 220, src/styles/layouts/_post.scss */\n\n.prev-next-span {\n  color: var(--composite-color);\n  font-weight: 700;\n  font-size: 13px;\n}\n\n/* line 225, src/styles/layouts/_post.scss */\n\n.prev-next-span i {\n  display: inline-flex;\n  transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1);\n}\n\n/* line 231, src/styles/layouts/_post.scss */\n\n.prev-next-title {\n  margin: 0 !important;\n  font-size: 16px;\n  height: 2em;\n  overflow: hidden;\n  line-height: 1 !important;\n  text-overflow: ellipsis !important;\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  display: -webkit-box !important;\n}\n\n/* line 251, src/styles/layouts/_post.scss */\n\n.prev-next-link:hover .arrow-right {\n  animation: arrow-move-right 0.5s ease-in-out forwards;\n}\n\n/* line 252, src/styles/layouts/_post.scss */\n\n.prev-next-link:hover .arrow-left {\n  animation: arrow-move-left 0.5s ease-in-out forwards;\n}\n\n/* line 258, src/styles/layouts/_post.scss */\n\n.cc-image {\n  max-height: 100vh;\n  min-height: 600px;\n  background-color: #000;\n}\n\n/* line 263, src/styles/layouts/_post.scss */\n\n.cc-image-header {\n  right: 0;\n  bottom: 10%;\n  left: 0;\n}\n\n/* line 269, src/styles/layouts/_post.scss */\n\n.cc-image-figure img {\n  opacity: .4;\n  object-fit: cover;\n  width: 100%;\n}\n\n/* line 275, src/styles/layouts/_post.scss */\n\n.cc-image .post-header {\n  max-width: 700px;\n}\n\n/* line 276, src/styles/layouts/_post.scss */\n\n.cc-image .post-title,\n.cc-image .post-excerpt {\n  color: #fff;\n}\n\n/* line 282, src/styles/layouts/_post.scss */\n\n.cc-video {\n  background-color: #000;\n  padding: 40px 0 30px;\n}\n\n/* line 286, src/styles/layouts/_post.scss */\n\n.cc-video .post-excerpt {\n  color: #aaa;\n  font-size: 1rem;\n}\n\n/* line 287, src/styles/layouts/_post.scss */\n\n.cc-video .post-title {\n  color: #fff;\n  font-size: 1.8rem;\n}\n\n/* line 288, src/styles/layouts/_post.scss */\n\n.cc-video .kg-embed-card,\n.cc-video .video-responsive {\n  margin-top: 0;\n}\n\n/* line 307, src/styles/layouts/_post.scss */\n\n.cc-video .media-type {\n  height: 34px !important;\n  width: 34px !important;\n}\n\n/* line 315, src/styles/layouts/_post.scss */\n\nbody.is-article .main {\n  margin-bottom: 0;\n}\n\n/* line 316, src/styles/layouts/_post.scss */\n\nbody.share-margin .sharePost {\n  top: -60px;\n}\n\n/* line 317, src/styles/layouts/_post.scss */\n\nbody.show-category .post-primary-tag {\n  display: block !important;\n}\n\n/* line 320, src/styles/layouts/_post.scss */\n\nbody.is-article-single .post-body-wrap {\n  margin-left: 0 !important;\n}\n\n/* line 321, src/styles/layouts/_post.scss */\n\nbody.is-article-single .sharePost {\n  left: -100px;\n}\n\n/* line 322, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-width-full .kg-image {\n  max-width: 100vw;\n}\n\n/* line 323, src/styles/layouts/_post.scss */\n\nbody.is-article-single .kg-width-wide .kg-image {\n  max-width: 1040px;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 329, src/styles/layouts/_post.scss */\n\n  .post-body-wrap q {\n    font-size: 20px !important;\n    letter-spacing: -.008em !important;\n    line-height: 1.4 !important;\n  }\n\n  /* line 341, src/styles/layouts/_post.scss */\n\n  .post-body-wrap .kg-image-card img {\n    max-width: 100%;\n  }\n\n  /* line 343, src/styles/layouts/_post.scss */\n\n  .post-body-wrap ol,\n  .post-body-wrap ul,\n  .post-body-wrap p {\n    font-size: 1rem;\n    letter-spacing: -.004em;\n    line-height: 1.58;\n  }\n\n  /* line 349, src/styles/layouts/_post.scss */\n\n  .post-body-wrap iframe {\n    width: 100% !important;\n  }\n\n  /* line 353, src/styles/layouts/_post.scss */\n\n  .post-related {\n    padding-left: 8px;\n    padding-right: 8px;\n  }\n\n  /* line 359, src/styles/layouts/_post.scss */\n\n  .cc-image-figure {\n    width: 200%;\n    max-width: 200%;\n    margin: 0 auto 0 -50%;\n  }\n\n  /* line 365, src/styles/layouts/_post.scss */\n\n  .cc-image-header {\n    bottom: 24px;\n  }\n\n  /* line 366, src/styles/layouts/_post.scss */\n\n  .cc-image .post-excerpt {\n    font-size: 18px;\n  }\n\n  /* line 369, src/styles/layouts/_post.scss */\n\n  .cc-video {\n    padding: 20px 0;\n  }\n\n  /* line 372, src/styles/layouts/_post.scss */\n\n  .cc-video-embed {\n    margin-left: -16px;\n    margin-right: -15px;\n  }\n\n  /* line 377, src/styles/layouts/_post.scss */\n\n  .cc-video .post-header {\n    margin-top: 10px;\n  }\n}\n\n@media only screen and (max-width: 1000px) {\n  /* line 383, src/styles/layouts/_post.scss */\n\n  body.is-article .col-left {\n    max-width: 100%;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 390, src/styles/layouts/_post.scss */\n\n  .cc-image .post-title {\n    font-size: 3.2rem;\n  }\n}\n\n@media only screen and (min-width: 1000px) {\n  /* line 394, src/styles/layouts/_post.scss */\n\n  body.is-article .post-body-wrap {\n    margin-left: 70px;\n  }\n\n  /* line 398, src/styles/layouts/_post.scss */\n\n  body.is-video .post-author,\n  body.is-image .post-author {\n    margin-left: 70px;\n  }\n}\n\n@media only screen and (min-width: 1230px) {\n  /* line 405, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-embed {\n    bottom: 20px;\n    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n    height: 203px;\n    padding-bottom: 0;\n    position: fixed;\n    right: 20px;\n    width: 360px;\n    z-index: 8;\n  }\n\n  /* line 416, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-close {\n    background: #000;\n    border-radius: 50%;\n    color: #fff;\n    cursor: pointer;\n    display: block !important;\n    font-size: 14px;\n    height: 24px;\n    left: -10px;\n    line-height: 1;\n    padding-top: 5px;\n    position: absolute;\n    text-align: center;\n    top: -10px;\n    width: 24px;\n    z-index: 5;\n  }\n\n  /* line 434, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-video-cont {\n    height: 465px;\n  }\n\n  /* line 436, src/styles/layouts/_post.scss */\n\n  body.has-video-fixed .cc-image-header {\n    bottom: 20%;\n  }\n}\n\n/* line 3, src/styles/layouts/_story.scss */\n\n.hr-list {\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.0785);\n  margin: 20px 0 0;\n}\n\n/* line 10, src/styles/layouts/_story.scss */\n\n.story-feed .story-feed-content:first-child .hr-list:first-child {\n  margin-top: 5px;\n}\n\n/* line 15, src/styles/layouts/_story.scss */\n\n.media-type {\n  background-color: rgba(0, 0, 0, 0.7);\n  color: #fff;\n  height: 45px;\n  left: 15px;\n  top: 15px;\n  width: 45px;\n  opacity: .9;\n}\n\n/* line 33, src/styles/layouts/_story.scss */\n\n.image-hover {\n  transition: transform .7s;\n  transform: translateZ(0);\n}\n\n/* line 39, src/styles/layouts/_story.scss */\n\n.not-image {\n  background: url(\"./../images/not-image.png\");\n  background-repeat: repeat;\n}\n\n/* line 45, src/styles/layouts/_story.scss */\n\n.flow-meta {\n  color: rgba(0, 0, 0, 0.54);\n  font-weight: 700;\n  margin-bottom: 10px;\n}\n\n/* line 52, src/styles/layouts/_story.scss */\n\n.point {\n  margin: 0 5px;\n}\n\n/* line 58, src/styles/layouts/_story.scss */\n\n.story-image {\n  flex: 0 0 44%;\n  height: 235px;\n  margin-right: 30px;\n}\n\n/* line 63, src/styles/layouts/_story.scss */\n\n.story-image:hover .image-hover {\n  transform: scale(1.03);\n}\n\n/* line 66, src/styles/layouts/_story.scss */\n\n.story-lower {\n  flex-grow: 1;\n}\n\n/* line 68, src/styles/layouts/_story.scss */\n\n.story-excerpt {\n  color: rgba(0, 0, 0, 0.84);\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  font-weight: 300;\n  line-height: 1.5;\n}\n\n/* line 75, src/styles/layouts/_story.scss */\n\n.story-category {\n  color: rgba(0, 0, 0, 0.84);\n}\n\n/* line 77, src/styles/layouts/_story.scss */\n\n.story h2 a:hover {\n  opacity: .6;\n}\n\n/* line 90, src/styles/layouts/_story.scss */\n\n.story.story--grid {\n  flex-direction: column;\n  margin-bottom: 30px;\n}\n\n/* line 94, src/styles/layouts/_story.scss */\n\n.story.story--grid .story-image {\n  flex: 0 0 auto;\n  margin-right: 0;\n  height: 220px;\n}\n\n/* line 100, src/styles/layouts/_story.scss */\n\n.story.story--grid .media-type {\n  font-size: 24px;\n  height: 40px;\n  width: 40px;\n}\n\n/* line 107, src/styles/layouts/_story.scss */\n\n.cover-category {\n  color: var(--story-cover-category-color);\n}\n\n/* line 112, src/styles/layouts/_story.scss */\n\n.story-card {\n  /* stylelint-disable-next-line */\n}\n\n/* line 113, src/styles/layouts/_story.scss */\n\n.story-card .story {\n  margin-top: 0 !important;\n}\n\n/* line 124, src/styles/layouts/_story.scss */\n\n.story-card .story-image {\n  border: 1px solid rgba(0, 0, 0, 0.04);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  border-radius: 2px;\n  background-color: #fff !important;\n  transition: all 150ms ease-in-out;\n  overflow: hidden;\n  height: 200px !important;\n}\n\n/* line 136, src/styles/layouts/_story.scss */\n\n.story-card .story-image .story-img-bg {\n  margin: 10px;\n}\n\n/* line 138, src/styles/layouts/_story.scss */\n\n.story-card .story-image:hover {\n  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.1);\n}\n\n/* line 141, src/styles/layouts/_story.scss */\n\n.story-card .story-image:hover .story-img-bg {\n  transform: none;\n}\n\n/* line 145, src/styles/layouts/_story.scss */\n\n.story-card .story-lower {\n  display: none !important;\n}\n\n/* line 147, src/styles/layouts/_story.scss */\n\n.story-card .story-body {\n  padding: 15px 5px;\n  margin: 0 !important;\n}\n\n/* line 151, src/styles/layouts/_story.scss */\n\n.story-card .story-body h2 {\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  color: rgba(0, 0, 0, 0.9);\n  display: -webkit-box !important;\n  max-height: 2.4em !important;\n  overflow: hidden;\n  text-overflow: ellipsis !important;\n  margin: 0;\n}\n\n/* line 168, src/styles/layouts/_story.scss */\n\n.story-small {\n  /* stylelint-disable-next-line */\n}\n\n/* line 169, src/styles/layouts/_story.scss */\n\n.story-small-img {\n  height: 170px;\n  background-color: #000 !important;\n}\n\n/* line 175, src/styles/layouts/_story.scss */\n\n.story-small .image-hover {\n  transition: all .25s;\n}\n\n/* line 177, src/styles/layouts/_story.scss */\n\n.story-small h3 {\n  color: #fff;\n  max-height: 2.5em;\n  overflow: hidden;\n  -webkit-box-orient: vertical !important;\n  -webkit-line-clamp: 2 !important;\n  text-overflow: ellipsis !important;\n  display: -webkit-box !important;\n  transition: all .25s;\n}\n\n/* line 189, src/styles/layouts/_story.scss */\n\n.story-small:hover .image-hover {\n  opacity: .8;\n}\n\n/* line 190, src/styles/layouts/_story.scss */\n\n.story-small:hover h3 {\n  opacity: .6;\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 200, src/styles/layouts/_story.scss */\n\n  .story.story--grid .story-lower {\n    max-height: 2.6em;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    display: -webkit-box;\n    line-height: 1.1;\n    text-overflow: ellipsis;\n  }\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 215, src/styles/layouts/_story.scss */\n\n  .cover--firts .cover-story {\n    height: 500px;\n  }\n\n  /* line 218, src/styles/layouts/_story.scss */\n\n  .story {\n    flex-direction: column;\n    margin-top: 20px;\n  }\n\n  /* line 222, src/styles/layouts/_story.scss */\n\n  .story-image {\n    flex: 0 0 auto;\n    margin-right: 0;\n  }\n\n  /* line 223, src/styles/layouts/_story.scss */\n\n  .story-body {\n    margin-top: 10px;\n  }\n}\n\n/* line 4, src/styles/layouts/_author.scss */\n\n.author {\n  background-color: #fff;\n  color: rgba(0, 0, 0, 0.6);\n  min-height: 350px;\n}\n\n/* line 9, src/styles/layouts/_author.scss */\n\n.author-avatar {\n  height: 80px;\n  width: 80px;\n}\n\n/* line 14, src/styles/layouts/_author.scss */\n\n.author-meta span {\n  display: inline-block;\n  font-size: 17px;\n  font-style: italic;\n  margin: 0 25px 16px 0;\n  opacity: .8;\n  word-wrap: break-word;\n}\n\n/* line 23, src/styles/layouts/_author.scss */\n\n.author-name {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 24, src/styles/layouts/_author.scss */\n\n.author-bio {\n  max-width: 600px;\n}\n\n/* line 25, src/styles/layouts/_author.scss */\n\n.author-meta a:hover {\n  opacity: .8 !important;\n}\n\n/* line 28, src/styles/layouts/_author.scss */\n\n.cover-opacity {\n  opacity: .5;\n}\n\n/* line 30, src/styles/layouts/_author.scss */\n\n.author.has--image {\n  color: #fff !important;\n  text-shadow: 0 0 10px rgba(0, 0, 0, 0.33);\n}\n\n/* line 34, src/styles/layouts/_author.scss */\n\n.author.has--image a,\n.author.has--image .author-name {\n  color: #fff;\n}\n\n/* line 37, src/styles/layouts/_author.scss */\n\n.author.has--image .author-follow a {\n  border: 2px solid;\n  border-color: rgba(255, 255, 255, 0.5) !important;\n  font-size: 16px;\n}\n\n/* line 43, src/styles/layouts/_author.scss */\n\n.author.has--image .u-accentColor--iconNormal {\n  fill: #fff;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 47, src/styles/layouts/_author.scss */\n\n  .author-meta span {\n    display: block;\n  }\n\n  /* line 48, src/styles/layouts/_author.scss */\n\n  .author-header {\n    display: block;\n  }\n\n  /* line 49, src/styles/layouts/_author.scss */\n\n  .author-avatar {\n    margin: 0 auto 20px;\n  }\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 53, src/styles/layouts/_author.scss */\n\n  body.has-cover .author {\n    min-height: 600px;\n  }\n}\n\n/* line 4, src/styles/layouts/_search.scss */\n\n.search {\n  background-color: #fff;\n  height: 100%;\n  height: 100vh;\n  left: 0;\n  padding: 0 16px;\n  right: 0;\n  top: 0;\n  transform: translateY(-100%);\n  transition: transform .3s ease;\n  z-index: 9;\n}\n\n/* line 16, src/styles/layouts/_search.scss */\n\n.search-form {\n  max-width: 680px;\n  margin-top: 80px;\n}\n\n/* line 20, src/styles/layouts/_search.scss */\n\n.search-form::before {\n  background: #eee;\n  bottom: 0;\n  content: '';\n  display: block;\n  height: 2px;\n  left: 0;\n  position: absolute;\n  width: 100%;\n  z-index: 1;\n}\n\n/* line 32, src/styles/layouts/_search.scss */\n\n.search-form input {\n  border: none;\n  display: block;\n  line-height: 40px;\n  padding-bottom: 8px;\n}\n\n/* line 38, src/styles/layouts/_search.scss */\n\n.search-form input:focus {\n  outline: 0;\n}\n\n/* line 43, src/styles/layouts/_search.scss */\n\n.search-results {\n  max-height: calc(100% - 100px);\n  max-width: 680px;\n  overflow: auto;\n}\n\n/* line 48, src/styles/layouts/_search.scss */\n\n.search-results a {\n  padding: 10px 20px;\n  background: rgba(0, 0, 0, 0.05);\n  color: rgba(0, 0, 0, 0.7);\n  text-decoration: none;\n  display: block;\n  border-bottom: 1px solid #fff;\n  transition: all 0.3s ease-in-out;\n}\n\n/* line 57, src/styles/layouts/_search.scss */\n\n.search-results a:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n\n/* line 62, src/styles/layouts/_search.scss */\n\n.button-search--close {\n  position: absolute !important;\n  right: 50px;\n  top: 20px;\n}\n\n/* line 68, src/styles/layouts/_search.scss */\n\nbody.is-search {\n  overflow: hidden;\n}\n\n/* line 71, src/styles/layouts/_search.scss */\n\nbody.is-search .search {\n  transform: translateY(0);\n}\n\n/* line 72, src/styles/layouts/_search.scss */\n\nbody.is-search .search-toggle {\n  background-color: rgba(255, 255, 255, 0.25);\n}\n\n/* line 2, src/styles/layouts/_sidebar.scss */\n\n.sidebar-title {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n}\n\n/* line 5, src/styles/layouts/_sidebar.scss */\n\n.sidebar-title span {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.54);\n  padding-bottom: 10px;\n  margin-bottom: -1px;\n}\n\n/* line 14, src/styles/layouts/_sidebar.scss */\n\n.sidebar-border {\n  border-left: 3px solid var(--composite-color);\n  color: rgba(0, 0, 0, 0.2);\n  font-family: \"Merriweather\", Mercury SSm A, Mercury SSm B, Georgia, serif;\n  padding: 0 10px;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888;\n}\n\n/* line 24, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.0785);\n  min-height: 60px;\n}\n\n/* line 30, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:hover .sidebar-border {\n  background-color: #e5eff5;\n}\n\n/* line 32, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:nth-child(3n) .sidebar-border {\n  border-color: #f59e00;\n}\n\n/* line 33, src/styles/layouts/_sidebar.scss */\n\n.sidebar-post:nth-child(3n+2) .sidebar-border {\n  border-color: #26a8ed;\n}\n\n/* line 2, src/styles/layouts/_sidenav.scss */\n\n.sideNav {\n  color: rgba(0, 0, 0, 0.8);\n  height: 100vh;\n  padding: 50px 20px;\n  position: fixed !important;\n  transform: translateX(100%);\n  transition: 0.4s;\n  will-change: transform;\n  z-index: 8;\n}\n\n/* line 13, src/styles/layouts/_sidenav.scss */\n\n.sideNav-menu a {\n  padding: 10px 20px;\n}\n\n/* line 15, src/styles/layouts/_sidenav.scss */\n\n.sideNav-wrap {\n  background: #eee;\n  overflow: auto;\n  padding: 20px 0;\n  top: 50px;\n}\n\n/* line 22, src/styles/layouts/_sidenav.scss */\n\n.sideNav-section {\n  border-bottom: solid 1px #ddd;\n  margin-bottom: 8px;\n  padding-bottom: 8px;\n}\n\n/* line 28, src/styles/layouts/_sidenav.scss */\n\n.sideNav-follow {\n  border-top: 1px solid #ddd;\n  margin: 15px 0;\n}\n\n/* line 32, src/styles/layouts/_sidenav.scss */\n\n.sideNav-follow a {\n  color: #fff;\n  display: inline-block;\n  height: 36px;\n  line-height: 20px;\n  margin: 0 5px 5px 0;\n  min-width: 36px;\n  padding: 8px;\n  text-align: center;\n  vertical-align: middle;\n}\n\n/* line 17, src/styles/layouts/helper.scss */\n\n.has-cover-padding {\n  padding-top: 100px;\n}\n\n/* line 20, src/styles/layouts/helper.scss */\n\nbody.has-cover .header {\n  position: fixed;\n}\n\n/* line 23, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .header {\n  background: rgba(0, 0, 0, 0.05);\n  box-shadow: none;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n/* line 29, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .header-left a,\nbody.has-cover.is-transparency:not(.is-search) .nav ul li a {\n  color: #fff;\n}\n\n/* line 30, src/styles/layouts/helper.scss */\n\nbody.has-cover.is-transparency:not(.is-search) .menu--toggle span {\n  background-color: #fff;\n}\n\n/* line 5, src/styles/layouts/subscribe.scss */\n\n.subscribe {\n  min-height: 80vh !important;\n  height: 100%;\n}\n\n/* line 10, src/styles/layouts/subscribe.scss */\n\n.subscribe-card {\n  background-color: #D7EFEE;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  width: 900px;\n  height: 550px;\n  padding: 50px;\n  margin: 5px;\n}\n\n/* line 20, src/styles/layouts/subscribe.scss */\n\n.subscribe form {\n  max-width: 300px;\n}\n\n/* line 24, src/styles/layouts/subscribe.scss */\n\n.subscribe-form {\n  height: 100%;\n}\n\n/* line 28, src/styles/layouts/subscribe.scss */\n\n.subscribe-input {\n  background: 0 0;\n  border: 0;\n  border-bottom: 1px solid #cc5454;\n  border-radius: 0;\n  padding: 7px 5px;\n  height: 45px;\n  outline: 0;\n  font-family: \"Roboto\", Whitney SSm A, Whitney SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;\n}\n\n/* line 38, src/styles/layouts/subscribe.scss */\n\n.subscribe-input::placeholder {\n  color: #cc5454;\n}\n\n/* line 43, src/styles/layouts/subscribe.scss */\n\n.subscribe .main-error {\n  color: #cc5454;\n  font-size: 16px;\n  margin-top: 15px;\n}\n\n/* line 65, src/styles/layouts/subscribe.scss */\n\n.subscribe-success .subscribe-card {\n  background-color: #E8F3EC;\n}\n\n@media only screen and (max-width: 766px) {\n  /* line 71, src/styles/layouts/subscribe.scss */\n\n  .subscribe-card {\n    height: auto;\n    width: auto;\n  }\n}\n\n/* line 4, src/styles/layouts/_comments.scss */\n\n.post-comments {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 15;\n  width: 100%;\n  left: 0;\n  overflow-y: auto;\n  background: #fff;\n  border-left: 1px solid #f1f1f1;\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  font-size: 14px;\n  transform: translateX(100%);\n  transition: .2s;\n  will-change: transform;\n}\n\n/* line 21, src/styles/layouts/_comments.scss */\n\n.post-comments-header {\n  padding: 20px;\n  border-bottom: 1px solid #ddd;\n}\n\n/* line 25, src/styles/layouts/_comments.scss */\n\n.post-comments-header .toggle-comments {\n  font-size: 24px;\n  line-height: 1;\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 17px;\n  cursor: pointer;\n}\n\n/* line 36, src/styles/layouts/_comments.scss */\n\n.post-comments-overlay {\n  position: fixed !important;\n  background-color: rgba(0, 0, 0, 0.2);\n  display: none;\n  transition: background-color .4s linear;\n  z-index: 8;\n  cursor: pointer;\n}\n\n/* line 46, src/styles/layouts/_comments.scss */\n\nbody.has-comments {\n  overflow: hidden;\n}\n\n/* line 49, src/styles/layouts/_comments.scss */\n\nbody.has-comments .post-comments-overlay {\n  display: block;\n}\n\n/* line 50, src/styles/layouts/_comments.scss */\n\nbody.has-comments .post-comments {\n  transform: translateX(0);\n}\n\n@media only screen and (min-width: 766px) {\n  /* line 54, src/styles/layouts/_comments.scss */\n\n  .post-comments {\n    left: auto;\n    width: 500px;\n    top: 50px;\n    z-index: 9;\n  }\n\n  /* line 60, src/styles/layouts/_comments.scss */\n\n  .post-comments-wrap {\n    padding: 20px;\n  }\n}\n\n/* line 1, src/styles/common/_modal.scss */\n\n.modal {\n  opacity: 0;\n  transition: opacity .2s ease-out .1s, visibility 0s .4s;\n  z-index: 100;\n  visibility: hidden;\n}\n\n/* line 8, src/styles/common/_modal.scss */\n\n.modal-shader {\n  background-color: rgba(255, 255, 255, 0.65);\n}\n\n/* line 11, src/styles/common/_modal.scss */\n\n.modal-close {\n  color: rgba(0, 0, 0, 0.54);\n  position: absolute;\n  top: 0;\n  right: 0;\n  line-height: 1;\n  padding: 15px;\n}\n\n/* line 21, src/styles/common/_modal.scss */\n\n.modal-inner {\n  background-color: #E8F3EC;\n  border-radius: 4px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n  max-width: 700px;\n  height: 100%;\n  max-height: 400px;\n  opacity: 0;\n  padding: 72px 5% 56px;\n  transform: scale(0.6);\n  transition: transform 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99), opacity 0.3s cubic-bezier(0.06, 0.47, 0.38, 0.99);\n  width: 100%;\n}\n\n/* line 36, src/styles/common/_modal.scss */\n\n.modal .form-group {\n  width: 76%;\n  margin: 0 auto 30px;\n}\n\n/* line 41, src/styles/common/_modal.scss */\n\n.modal .form--input {\n  display: inline-block;\n  margin-bottom: 10px;\n  vertical-align: top;\n  height: 40px;\n  line-height: 40px;\n  background-color: transparent;\n  padding: 17px 6px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.15);\n  width: 100%;\n}\n\n/* line 71, src/styles/common/_modal.scss */\n\nbody.has-modal {\n  overflow: hidden;\n}\n\n/* line 74, src/styles/common/_modal.scss */\n\nbody.has-modal .modal {\n  opacity: 1;\n  visibility: visible;\n  transition: opacity .3s ease;\n}\n\n/* line 79, src/styles/common/_modal.scss */\n\nbody.has-modal .modal-inner {\n  opacity: 1;\n  transform: scale(1);\n  transition: transform 0.8s cubic-bezier(0.26, 0.63, 0, 0.96);\n}\n\n/* line 4, src/styles/common/_widget.scss */\n\n.instagram-hover {\n  background-color: rgba(0, 0, 0, 0.3);\n  opacity: 0;\n}\n\n/* line 10, src/styles/common/_widget.scss */\n\n.instagram-img {\n  height: 264px;\n}\n\n/* line 13, src/styles/common/_widget.scss */\n\n.instagram-img:hover > .instagram-hover {\n  opacity: 1;\n}\n\n/* line 16, src/styles/common/_widget.scss */\n\n.instagram-name {\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 3;\n}\n\n/* line 22, src/styles/common/_widget.scss */\n\n.instagram-name a {\n  background-color: #fff;\n  color: #000 !important;\n  font-size: 18px !important;\n  font-weight: 900 !important;\n  min-width: 200px;\n  padding-left: 10px !important;\n  padding-right: 10px !important;\n  text-align: center !important;\n}\n\n/* line 34, src/styles/common/_widget.scss */\n\n.instagram-col {\n  padding: 0 !important;\n  margin: 0 !important;\n}\n\n/* line 39, src/styles/common/_widget.scss */\n\n.instagram-wrap {\n  margin: 0 !important;\n}\n\n/* line 44, src/styles/common/_widget.scss */\n\n.witget-subscribe {\n  background: #fff;\n  border: 5px solid transparent;\n  padding: 28px 30px;\n  position: relative;\n}\n\n/* line 50, src/styles/common/_widget.scss */\n\n.witget-subscribe::before {\n  content: \"\";\n  border: 5px solid #f5f5f5;\n  box-shadow: inset 0 0 0 1px #d7d7d7;\n  box-sizing: border-box;\n  display: block;\n  height: calc(100% + 10px);\n  left: -5px;\n  pointer-events: none;\n  position: absolute;\n  top: -5px;\n  width: calc(100% + 10px);\n  z-index: 1;\n}\n\n/* line 65, src/styles/common/_widget.scss */\n\n.witget-subscribe input {\n  background: #fff;\n  border: 1px solid #e5e5e5;\n  color: rgba(0, 0, 0, 0.54);\n  height: 41px;\n  outline: 0;\n  padding: 0 16px;\n  width: 100%;\n}\n\n/* line 75, src/styles/common/_widget.scss */\n\n.witget-subscribe button {\n  background: var(--composite-color);\n  border-radius: 0;\n  width: 100%;\n}\n\n","/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tcolor: black;\n\tbackground: none;\n\ttext-shadow: 0 1px white;\n\tfont-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n\ttext-align: left;\n\twhite-space: pre;\n\tword-spacing: normal;\n\tword-break: normal;\n\tword-wrap: normal;\n\tline-height: 1.5;\n\n\t-moz-tab-size: 4;\n\t-o-tab-size: 4;\n\ttab-size: 4;\n\n\t-webkit-hyphens: none;\n\t-moz-hyphens: none;\n\t-ms-hyphens: none;\n\thyphens: none;\n}\n\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\n@media print {\n\tcode[class*=\"language-\"],\n\tpre[class*=\"language-\"] {\n\t\ttext-shadow: none;\n\t}\n}\n\n/* Code blocks */\npre[class*=\"language-\"] {\n\tpadding: 1em;\n\tmargin: .5em 0;\n\toverflow: auto;\n}\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tbackground: #f5f2f0;\n}\n\n/* Inline code */\n:not(pre) > code[class*=\"language-\"] {\n\tpadding: .1em;\n\tborder-radius: .3em;\n\twhite-space: normal;\n}\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n\tcolor: slategray;\n}\n\n.token.punctuation {\n\tcolor: #999;\n}\n\n.namespace {\n\topacity: .7;\n}\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n\tcolor: #905;\n}\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n\tcolor: #690;\n}\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n\tcolor: #9a6e3a;\n\tbackground: hsla(0, 0%, 100%, .5);\n}\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n\tcolor: #07a;\n}\n\n.token.function,\n.token.class-name {\n\tcolor: #DD4A68;\n}\n\n.token.regex,\n.token.important,\n.token.variable {\n\tcolor: #e90;\n}\n\n.token.important,\n.token.bold {\n\tfont-weight: bold;\n}\n.token.italic {\n\tfont-style: italic;\n}\n\n.token.entity {\n\tcursor: help;\n}\n","pre[class*=\"language-\"].line-numbers {\n\tposition: relative;\n\tpadding-left: 3.8em;\n\tcounter-reset: linenumber;\n}\n\npre[class*=\"language-\"].line-numbers > code {\n\tposition: relative;\n\twhite-space: inherit;\n}\n\n.line-numbers .line-numbers-rows {\n\tposition: absolute;\n\tpointer-events: none;\n\ttop: 0;\n\tfont-size: 100%;\n\tleft: -3.8em;\n\twidth: 3em; /* works for line-numbers below 1000 lines */\n\tletter-spacing: -1px;\n\tborder-right: 1px solid #999;\n\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n\n}\n\n\t.line-numbers-rows > span {\n\t\tpointer-events: none;\n\t\tdisplay: block;\n\t\tcounter-increment: linenumber;\n\t}\n\n\t\t.line-numbers-rows > span:before {\n\t\t\tcontent: counter(linenumber);\n\t\t\tcolor: #999;\n\t\t\tdisplay: block;\n\t\t\tpadding-right: 0.8em;\n\t\t\ttext-align: right;\n\t\t}\n","%link {\r\n  color: inherit;\r\n  cursor: pointer;\r\n  text-decoration: none;\r\n}\r\n\r\n%link--accent {\r\n  color: var(--primary-color);\r\n  text-decoration: none;\r\n  // &:hover { color: $primary-color-hover; }\r\n}\r\n\r\n%content-absolute-bottom {\r\n  bottom: 0;\r\n  left: 0;\r\n  margin: 30px;\r\n  max-width: 600px;\r\n  position: absolute;\r\n  z-index: 2;\r\n}\r\n\r\n%u-absolute0 {\r\n  bottom: 0;\r\n  left: 0;\r\n  position: absolute;\r\n  right: 0;\r\n  top: 0;\r\n}\r\n\r\n%u-text-color-darker {\r\n  color: rgba(0, 0, 0, .8) !important;\r\n  fill: rgba(0, 0, 0, .8) !important;\r\n}\r\n\r\n%fonts-icons {\r\n  /* use !important to prevent issues with browser extensions that change fonts */\r\n  font-family: 'mapache' !important; /* stylelint-disable-line */\r\n  speak: none;\r\n  font-style: normal;\r\n  font-weight: normal;\r\n  font-variant: normal;\r\n  text-transform: none;\r\n  line-height: inherit;\r\n\r\n  /* Better Font Rendering =========== */\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n","// stylelint-disable\r\nimg[data-action=\"zoom\"] {\r\n  cursor: zoom-in;\r\n}\r\n.zoom-img,\r\n.zoom-img-wrap {\r\n  position: relative;\r\n  z-index: 666;\r\n  -webkit-transition: all 300ms;\r\n       -o-transition: all 300ms;\r\n          transition: all 300ms;\r\n}\r\nimg.zoom-img {\r\n  cursor: pointer;\r\n  cursor: -webkit-zoom-out;\r\n  cursor: -moz-zoom-out;\r\n}\r\n.zoom-overlay {\r\n  z-index: 420;\r\n  background: #fff;\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  pointer-events: none;\r\n  filter: \"alpha(opacity=0)\";\r\n  opacity: 0;\r\n  -webkit-transition:      opacity 300ms;\r\n       -o-transition:      opacity 300ms;\r\n          transition:      opacity 300ms;\r\n}\r\n.zoom-overlay-open .zoom-overlay {\r\n  filter: \"alpha(opacity=100)\";\r\n  opacity: 1;\r\n}\r\n.zoom-overlay-open,\r\n.zoom-overlay-transitioning {\r\n  cursor: default;\r\n}\r\n",":root {\r\n  --black: #000;\r\n  --white: #fff;\r\n  --primary-color: #1C9963;\r\n  --secondary-color: #2ad88d;\r\n  --header-color: #BBF1B9;\r\n  --header-color-hover: #EEFFEA;\r\n  --post-color-link: #2ad88d;\r\n  --story-cover-category-color: #2ad88d;\r\n  --composite-color: #CC116E;\r\n  --footer-color-link: #2ad88d;\r\n  --media-type-color: #2ad88d;\r\n}\r\n\r\n*, *::before, *::after {\r\n  box-sizing: border-box;\r\n}\r\n\r\na {\r\n  color: inherit;\r\n  text-decoration: none;\r\n\r\n  &:active,\r\n  &:hover {\r\n    outline: 0;\r\n  }\r\n}\r\n\r\nblockquote {\r\n  border-left: 3px solid #000;\r\n  color: #000;\r\n  font-family: $secundary-font;\r\n  font-size: 1.1875rem;\r\n  font-style: italic;\r\n  font-weight: 400;\r\n  letter-spacing: -.003em;\r\n  line-height: 1.7;\r\n  margin: 30px 0 0 -12px;\r\n  padding-bottom: 2px;\r\n  padding-left: 20px;\r\n\r\n  p:first-of-type { margin-top: 0 }\r\n}\r\n\r\nbody {\r\n  color: $primary-text-color;\r\n  font-family: $primary-font;\r\n  font-size: $font-size-base;\r\n  font-style: normal;\r\n  font-weight: 400;\r\n  letter-spacing: 0;\r\n  line-height: 1.4;\r\n  margin: 0 auto;\r\n  text-rendering: optimizeLegibility;\r\n  overflow-x: hidden;\r\n}\r\n\r\n//Default styles\r\nhtml {\r\n  box-sizing: border-box;\r\n  font-size: $font-size-root;\r\n}\r\n\r\nfigure {\r\n  margin: 0;\r\n}\r\n\r\nfigcaption {\r\n  color: rgba(0, 0, 0, .68);\r\n  display: block;\r\n  font-family: $secundary-font;\r\n  font-feature-settings: \"liga\" on, \"lnum\" on;\r\n  font-size: 14px;\r\n  font-style: normal;\r\n  font-weight: 400;\r\n  left: 0;\r\n  letter-spacing: 0;\r\n  line-height: 1.4;\r\n  margin-top: 10px;\r\n  outline: 0;\r\n  position: relative;\r\n  text-align: center;\r\n  top: 0;\r\n  width: 100%;\r\n}\r\n\r\n// Code\r\n// ==========================================================================\r\nkbd, samp, code {\r\n  background: $code-bg-color;\r\n  border-radius: 4px;\r\n  color: $code-color;\r\n  font-family: $code-font !important;\r\n  font-size: $font-size-code;\r\n  padding: 4px 6px;\r\n  white-space: pre-wrap;\r\n}\r\n\r\npre {\r\n  background-color: $code-bg-color !important;\r\n  border-radius: 4px;\r\n  font-family: $code-font !important;\r\n  font-size: $font-size-code;\r\n  margin-top: 30px !important;\r\n  max-width: 100%;\r\n  overflow: hidden;\r\n  padding: 1rem;\r\n  position: relative;\r\n  word-wrap: normal;\r\n\r\n  code {\r\n    background: transparent;\r\n    color: $pre-code-color;\r\n    padding: 0;\r\n    text-shadow: 0 1px #fff;\r\n  }\r\n}\r\n\r\ncode[class*=language-],\r\npre[class*=language-] {\r\n  color: $pre-code-color;\r\n  line-height: 1.4;\r\n\r\n  .token.comment { opacity: .8; }\r\n\r\n  &.line-numbers {\r\n    padding-left: 58px;\r\n\r\n    &::before {\r\n      content: \"\";\r\n      position: absolute;\r\n      left: 0;\r\n      top: 0;\r\n      background: #F0EDEE;\r\n      width: 40px;\r\n      height: 100%;\r\n    }\r\n  }\r\n\r\n  .line-numbers-rows {\r\n    border-right: none;\r\n    top: -3px;\r\n    left: -58px;\r\n\r\n    & > span::before {\r\n      padding-right: 0;\r\n      text-align: center;\r\n      opacity: .8;\r\n    }\r\n  }\r\n}\r\n\r\n// hr\r\n// ==========================================================================\r\nhr:not(.hr-list):not(.post-footer-hr) {\r\n  border: 0;\r\n  display: block;\r\n  margin: 50px auto;\r\n  text-align: center;\r\n\r\n  &::before {\r\n    color: rgba(0, 0, 0, .6);\r\n    content: '...';\r\n    display: inline-block;\r\n    font-family: $primary-font;\r\n    font-size: 28px;\r\n    font-weight: 400;\r\n    letter-spacing: .6em;\r\n    position: relative;\r\n    top: -25px;\r\n  }\r\n}\r\n\r\n.post-footer-hr {\r\n  height: 1px;\r\n  margin: 32px 0;\r\n  border: 0;\r\n  background-color: #ddd;\r\n}\r\n\r\nimg {\r\n  height: auto;\r\n  max-width: 100%;\r\n  vertical-align: middle;\r\n  width: auto;\r\n\r\n  &:not([src]) {\r\n    visibility: hidden;\r\n  }\r\n}\r\n\r\ni {\r\n  // display: inline-block;\r\n  vertical-align: middle;\r\n}\r\n\r\ninput {\r\n  border: none;\r\n  outline: 0;\r\n}\r\n\r\nol, ul {\r\n  list-style: none;\r\n  list-style-image: none;\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\nmark {\r\n  background-color: transparent !important;\r\n  background-image: linear-gradient(to bottom, rgba(215, 253, 211, 1), rgba(215, 253, 211, 1));\r\n  color: rgba(0, 0, 0, .8);\r\n}\r\n\r\nq {\r\n  color: rgba(0, 0, 0, .44);\r\n  display: block;\r\n  font-size: 28px;\r\n  font-style: italic;\r\n  font-weight: 400;\r\n  letter-spacing: -.014em;\r\n  line-height: 1.48;\r\n  padding-left: 50px;\r\n  padding-top: 15px;\r\n  text-align: left;\r\n\r\n  &::before, &::after { display: none; }\r\n}\r\n\r\ntable {\r\n  border-collapse: collapse;\r\n  border-spacing: 0;\r\n  display: inline-block;\r\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\r\n  font-size: 1rem;\r\n  line-height: 1.5;\r\n  margin: 20px 0 0;\r\n  max-width: 100%;\r\n  overflow-x: auto;\r\n  vertical-align: top;\r\n  white-space: nowrap;\r\n  width: auto;\r\n  -webkit-overflow-scrolling: touch;\r\n\r\n  th,\r\n  td {\r\n    padding: 6px 13px;\r\n    border: 1px solid #dfe2e5;\r\n  }\r\n\r\n  tr:nth-child(2n) {\r\n    background-color: #f6f8fa;\r\n  }\r\n\r\n  th {\r\n    letter-spacing: 0.2px;\r\n    text-transform: uppercase;\r\n    font-weight: 600;\r\n  }\r\n}\r\n\r\n// Links color\r\n// ==========================================================================\r\n.link--accent { @extend %link--accent; }\r\n\r\n.link { @extend %link; }\r\n\r\n.link--underline {\r\n  &:active,\r\n  &:focus,\r\n  &:hover {\r\n    // color: inherit;\r\n    text-decoration: underline;\r\n  }\r\n}\r\n\r\n// Animation main page and footer\r\n// ==========================================================================\r\n.main { margin-bottom: 4em; min-height: 90vh }\r\n\r\n.main,\r\n.footer { transition: transform .5s ease; }\r\n\r\n// warning success and Note\r\n// ==========================================================================\r\n.warning {\r\n  background: #fbe9e7;\r\n  color: #d50000;\r\n  &::before { content: $i-warning; }\r\n}\r\n\r\n.note {\r\n  background: #e1f5fe;\r\n  color: #0288d1;\r\n  &::before { content: $i-star; }\r\n}\r\n\r\n.success {\r\n  background: #e0f2f1;\r\n  color: #00897b;\r\n  &::before { color: #00bfa5; content: $i-check; }\r\n}\r\n\r\n.warning, .note, .success {\r\n  display: block;\r\n  font-size: 18px !important;\r\n  line-height: 1.58 !important;\r\n  margin-top: 28px;\r\n  padding: 12px 24px 12px 60px;\r\n\r\n  a {\r\n    color: inherit;\r\n    text-decoration: underline;\r\n  }\r\n\r\n  &::before {\r\n    @extend %fonts-icons;\r\n\r\n    float: left;\r\n    font-size: 24px;\r\n    margin-left: -36px;\r\n    margin-top: -5px;\r\n  }\r\n}\r\n\r\n// Page Tags\r\n// ==========================================================================\r\n.tag {\r\n  &-description { max-width: 700px }\r\n  &.has--image { min-height: 350px }\r\n}\r\n\r\n// toltip\r\n// ==========================================================================\r\n.with-tooltip {\r\n  overflow: visible;\r\n  position: relative;\r\n\r\n  &::after {\r\n    background: rgba(0, 0, 0, .85);\r\n    border-radius: 4px;\r\n    color: #fff;\r\n    content: attr(data-tooltip);\r\n    display: inline-block;\r\n    font-size: 12px;\r\n    font-weight: 600;\r\n    left: 50%;\r\n    line-height: 1.25;\r\n    min-width: 130px;\r\n    opacity: 0;\r\n    padding: 4px 8px;\r\n    pointer-events: none;\r\n    position: absolute;\r\n    text-align: center;\r\n    text-transform: none;\r\n    top: -30px;\r\n    will-change: opacity, transform;\r\n    z-index: 1;\r\n  }\r\n\r\n  &:hover::after {\r\n    animation: tooltip .1s ease-out both;\r\n  }\r\n}\r\n\r\n// Error page\r\n// ==========================================================================\r\n.errorPage {\r\n  font-family: 'Roboto Mono', monospace;\r\n\r\n  &-link {\r\n    left: -5px;\r\n    padding: 24px 60px;\r\n    top: -6px;\r\n  }\r\n\r\n  &-text {\r\n    margin-top: 60px;\r\n    white-space: pre-wrap;\r\n  }\r\n\r\n  &-wrap {\r\n    color: rgba(0, 0, 0, .4);\r\n    padding: 7vw 4vw;\r\n  }\r\n}\r\n\r\n// Video Responsive\r\n// ==========================================================================\r\n.video-responsive {\r\n  display: block;\r\n  height: 0;\r\n  margin-top: 30px;\r\n  overflow: hidden;\r\n  padding: 0 0 56.25%;\r\n  position: relative;\r\n  width: 100%;\r\n\r\n  iframe {\r\n    border: 0;\r\n    bottom: 0;\r\n    height: 100%;\r\n    left: 0;\r\n    position: absolute;\r\n    top: 0;\r\n    width: 100%;\r\n  }\r\n\r\n  video {\r\n    border: 0;\r\n    bottom: 0;\r\n    height: 100%;\r\n    left: 0;\r\n    position: absolute;\r\n    top: 0;\r\n    width: 100%;\r\n  }\r\n}\r\n\r\n.kg-embed-card .video-responsive { margin-top: 0 }\r\n\r\n// Gallery\r\n// ==========================================================================\r\n\r\n.kg-gallery {\r\n  &-container {\r\n    display: flex;\r\n    flex-direction: column;\r\n    max-width: 100%;\r\n    width: 100%;\r\n  }\r\n\r\n  &-row {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: center;\r\n\r\n    &:not(:first-of-type) { margin: 0.75em 0 0 0 }\r\n  }\r\n\r\n  &-image {\r\n    img {\r\n      display: block;\r\n      margin: 0;\r\n      width: 100%;\r\n      height: 100%;\r\n    }\r\n\r\n    &:not(:first-of-type) { margin: 0 0 0 0.75em }\r\n  }\r\n}\r\n\r\n// Social Media Color\r\n// ==========================================================================\r\n@each $social-name, $color in $social-colors {\r\n  .c-#{$social-name} { color: $color !important; }\r\n  .bg-#{$social-name} { background-color: $color !important; }\r\n}\r\n\r\n// Facebook Save\r\n// ==========================================================================\r\n// .fbSave {\r\n//   &-dropdown {\r\n//     background-color: #fff;\r\n//     border: 1px solid #e0e0e0;\r\n//     bottom: 100%;\r\n//     display: none;\r\n//     max-width: 200px;\r\n//     min-width: 100px;\r\n//     padding: 8px;\r\n//     transform: translate(-50%, 0);\r\n//     z-index: 10;\r\n\r\n//     &.is-visible { display: block; }\r\n//   }\r\n// }\r\n\r\n// Rocket for return top page\r\n// ==========================================================================\r\n.rocket {\r\n  bottom: 50px;\r\n  position: fixed;\r\n  right: 20px;\r\n  text-align: center;\r\n  width: 60px;\r\n  z-index: 5;\r\n\r\n  &:hover svg path {\r\n    fill: rgba(0, 0, 0, .6);\r\n  }\r\n}\r\n\r\n.svgIcon {\r\n  display: inline-block;\r\n}\r\n\r\nsvg {\r\n  height: auto;\r\n  width: 100%;\r\n}\r\n\r\n// Pagination Infinite Scroll\r\n// ==========================================================================\r\n\r\n.load-more { max-width: 70% !important }\r\n\r\n// loadingBar\r\n// ==========================================================================\r\n\r\n.loadingBar {\r\n  background-color: #48e79a;\r\n  display: none;\r\n  height: 2px;\r\n  left: 0;\r\n  position: fixed;\r\n  right: 0;\r\n  top: 0;\r\n  transform: translateX(100%);\r\n  z-index: 800;\r\n}\r\n\r\n.is-loading .loadingBar {\r\n  animation: loading-bar 1s ease-in-out infinite;\r\n  animation-delay: .8s;\r\n  display: block;\r\n}\r\n\r\n// Media Query responsinve\r\n// ==========================================================================\r\n@media #{$md-and-down} {\r\n  blockquote { margin-left: -5px; font-size: 1.125rem }\r\n\r\n  .kg-image-card,\r\n  .kg-embed-card {\r\n    margin-right: -20px;\r\n    margin-left: -20px;\r\n  }\r\n}\r\n","// Container\r\n.extreme-container {\r\n  box-sizing: border-box;\r\n  margin: 0 auto;\r\n  max-width: 1200px;\r\n  padding: 0 16px;\r\n  width: 100%;\r\n}\r\n\r\n// @media #{$lg-and-up} {\r\n//   .content {\r\n//     // flex: 1 !important;\r\n//     max-width: calc(100% - 340px) !important;\r\n//     // order: 1;\r\n//     // overflow: hidden;\r\n//   }\r\n\r\n//   .sidebar {\r\n//     width: 340px !important;\r\n//     // flex: 0 0 340px !important;\r\n//     // order: 2;\r\n//   }\r\n// }\r\n\r\n.col-left,\r\n.cc-video-left {\r\n  flex-basis: 0;\r\n  flex-grow: 1;\r\n  max-width: 100%;\r\n  padding-right: 10px;\r\n  padding-left: 10px;\r\n}\r\n\r\n// @media #{$md-and-up} {\r\n// }\r\n\r\n@media #{$lg-and-up} {\r\n  .col-left { max-width: calc(100% - 340px) }\r\n  .cc-video-left { max-width: calc(100% - 320px) }\r\n  .cc-video-right { flex-basis: 320px !important; max-width: 320px !important; }\r\n  body.is-article .col-left { padding-right: 40px }\r\n}\r\n\r\n.col-right {\r\n  display: flex;\r\n  flex-direction: column;\r\n  padding-left: 10px;\r\n  padding-right: 10px;\r\n  width: 320px;\r\n}\r\n\r\n.row {\r\n  display: flex;\r\n  flex-direction: row;\r\n  flex-wrap: wrap;\r\n  flex: 0 1 auto;\r\n  margin-left: - 10px;\r\n  margin-right: - 10px;\r\n\r\n  .col {\r\n    flex: 0 0 auto;\r\n    box-sizing: border-box;\r\n    padding-left: 10px;\r\n    padding-right: 10px;\r\n\r\n    $i: 1;\r\n\r\n    @while $i <= $num-cols {\r\n      $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n\r\n      &.s#{$i} {\r\n        flex-basis: $perc;\r\n        max-width: $perc;\r\n      }\r\n\r\n      $i: $i + 1;\r\n    }\r\n\r\n    @media #{$md-and-up} {\r\n\r\n      $i: 1;\r\n\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n\r\n        &.m#{$i} {\r\n          flex-basis: $perc;\r\n          max-width: $perc;\r\n        }\r\n\r\n        $i: $i + 1;\r\n      }\r\n    }\r\n\r\n    @media #{$lg-and-up} {\r\n\r\n      $i: 1;\r\n\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n\r\n        &.l#{$i} {\r\n          flex-basis: $perc;\r\n          max-width: $perc;\r\n        }\r\n\r\n        $i: $i + 1;\r\n      }\r\n    }\r\n  }\r\n}\r\n","// Headings\r\n\r\nh1, h2, h3, h4, h5, h6 {\r\n  color: $headings-color;\r\n  font-family: $headings-font-family;\r\n  font-weight: $headings-font-weight;\r\n  line-height: $headings-line-height;\r\n  margin: 0;\r\n\r\n  a {\r\n    color: inherit;\r\n    line-height: inherit;\r\n  }\r\n}\r\n\r\nh1 { font-size: $font-size-h1; }\r\nh2 { font-size: $font-size-h2; }\r\nh3 { font-size: $font-size-h3; }\r\nh4 { font-size: $font-size-h4; }\r\nh5 { font-size: $font-size-h5; }\r\nh6 { font-size: $font-size-h6; }\r\n\r\np {\r\n  margin: 0;\r\n}\r\n","// color\n.u-textColorNormal {\n  // color: rgba(0, 0, 0, .44) !important;\n  // fill: rgba(0, 0, 0, .44) !important;\n  color: rgba(153, 153, 153, 1) !important;\n  fill: rgba(153, 153, 153, 1) !important;\n}\n\n.u-textColorWhite {\n  color: #fff !important;\n  fill: #fff !important;\n}\n\n.u-hoverColorNormal:hover {\n  color: rgba(0, 0, 0, .6);\n  fill: rgba(0, 0, 0, .6);\n}\n\n.u-accentColor--iconNormal {\n  color: $primary-color;\n  fill: $primary-color;\n}\n\n//  background color\n.u-bgColor { background-color: var(--primary-color); }\n\n.u-textColorDarker { @extend %u-text-color-darker; }\n\n// Positions\n.u-relative { position: relative; }\n.u-absolute { position: absolute; }\n.u-absolute0 { @extend %u-absolute0; }\n.u-fixed { position: fixed !important; }\n\n.u-block { display: block !important }\n.u-inlineBlock { display: inline-block }\n\n//  Background\n.u-backgroundDark {\n  // background: linear-gradient(to bottom, rgba(0, 0, 0, .3) 29%, rgba(0, 0, 0, .6) 81%);\n  background-color: #0d0f10;\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n\n.u-gradient {\n  background: linear-gradient(to bottom, transparent 20%, #000 100%);\n  bottom: 0;\n  height: 90%;\n  left: 0;\n  position: absolute;\n  right: 0;\n  z-index: 1;\n}\n\n// zindex\n.zindex1 { z-index: 1 }\n.zindex2 { z-index: 2 }\n.zindex3 { z-index: 3 }\n.zindex4 { z-index: 4 }\n\n// .u-background-white { background-color: #eeefee; }\n.u-backgroundWhite { background-color: #fafafa }\n.u-backgroundColorGrayLight { background-color: #f0f0f0 !important; }\n\n// Clear\n.u-clear::after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n// font size\n.u-fontSizeMicro { font-size: 11px }\n.u-fontSizeSmallest { font-size: 12px }\n.u-fontSize13 { font-size: 13px }\n.u-fontSizeSmaller { font-size: 14px }\n.u-fontSize15 { font-size: 15px }\n.u-fontSizeSmall { font-size: 16px }\n.u-fontSizeBase { font-size: 18px }\n.u-fontSize20 { font-size: 20px }\n.u-fontSize21 { font-size: 21px }\n.u-fontSize22 { font-size: 22px }\n.u-fontSizeLarge { font-size: 24px }\n.u-fontSize26 { font-size: 26px }\n.u-fontSize28 { font-size: 28px }\n.u-fontSizeLarger { font-size: 32px }\n.u-fontSize36 { font-size: 36px }\n.u-fontSize40 { font-size: 40px }\n.u-fontSizeLargest { font-size: 44px }\n.u-fontSizeJumbo { font-size: 50px }\n\n@media #{$md-and-down} {\n  .u-md-fontSizeBase { font-size: 18px }\n  .u-md-fontSize22 { font-size: 22px }\n  .u-md-fontSizeLarger { font-size: 32px }\n}\n\n// @media (max-width: 767px) {\n//   .u-xs-fontSizeBase {font-size: 18px}\n//   .u-xs-fontSize13 {font-size: 13px}\n//   .u-xs-fontSizeSmaller {font-size: 14px}\n//   .u-xs-fontSizeSmall {font-size: 16px}\n//   .u-xs-fontSize22 {font-size: 22px}\n//   .u-xs-fontSizeLarge {font-size: 24px}\n//   .u-xs-fontSize40 {font-size: 40px}\n//   .u-xs-fontSizeLarger {font-size: 32px}\n//   .u-xs-fontSizeSmallest {font-size: 12px}\n// }\n\n// font weight\n.u-fontWeightThin { font-weight: 300 }\n.u-fontWeightNormal { font-weight: 400 }\n.u-fontWeightMedium { font-weight: 500 }\n.u-fontWeightSemibold { font-weight: 600 !important }\n.u-fontWeightBold { font-weight: 700 }\n.u-fontWeightBolder { font-weight: 900 }\n\n.u-textUppercase { text-transform: uppercase }\n.u-textCapitalize { text-transform: capitalize }\n.u-textAlignCenter { text-align: center }\n\n.u-noWrapWithEllipsis {\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important;\n}\n\n// Margin\n.u-marginAuto { margin-left: auto; margin-right: auto; }\n.u-marginTop20 { margin-top: 20px }\n.u-marginTop30 { margin-top: 30px }\n.u-marginBottom10 { margin-bottom: 10px }\n.u-marginBottom15 { margin-bottom: 15px }\n.u-marginBottom20 { margin-bottom: 20px !important }\n.u-marginBottom30 { margin-bottom: 30px }\n.u-marginBottom40 { margin-bottom: 40px }\n\n// padding\n.u-padding0 { padding: 0 !important }\n.u-padding20 { padding: 20px }\n.u-padding15 { padding: 15px !important; }\n.u-paddingBottom2 { padding-bottom: 2px; }\n.u-paddingBottom30 { padding-bottom: 30px; }\n.u-paddingBottom20 { padding-bottom: 20px }\n.u-paddingRight10 { padding-right: 10px }\n.u-paddingLeft15 { padding-left: 15px }\n\n.u-paddingTop2 { padding-top: 2px }\n.u-paddingTop5 { padding-top: 5px; }\n.u-paddingTop10 { padding-top: 10px; }\n.u-paddingTop15 { padding-top: 15px; }\n.u-paddingTop20 { padding-top: 20px; }\n.u-paddingTop30 { padding-top: 30px; }\n\n.u-paddingBottom15 { padding-bottom: 15px; }\n\n.u-paddingRight20 { padding-right: 20px }\n.u-paddingLeft20 { padding-left: 20px }\n\n.u-contentTitle {\n  font-family: $primary-font;\n  font-style: normal;\n  font-weight: 900;\n  letter-spacing: -.028em;\n}\n\n// line-height\n.u-lineHeight1 { line-height: 1; }\n.u-lineHeightTight { line-height: 1.2 }\n\n// overflow\n.u-overflowHidden { overflow: hidden }\n\n// float\n.u-floatRight { float: right; }\n.u-floatLeft { float: left; }\n\n//  flex\n.u-flex { display: flex; }\n.u-flexCenter { align-items: center; display: flex; }\n.u-flexContentCenter { justify-content: center }\n// .u-flex--1 { flex: 1 }\n.u-flex1 { flex: 1 1 auto; }\n.u-flex0 { flex: 0 0 auto; }\n.u-flexWrap { flex-wrap: wrap }\n\n.u-flexColumn {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.u-flexEnd {\n  align-items: center;\n  justify-content: flex-end;\n}\n\n.u-flexColumnTop {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n}\n\n// Background\n.u-backgroundSizeCover {\n  background-origin: border-box;\n  background-position: center;\n  background-size: cover;\n}\n\n// max widht\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 20px;\n  padding-right: 20px;\n}\n\n.u-maxWidth1200 { max-width: 1200px }\n.u-maxWidth1000 { max-width: 1000px }\n.u-maxWidth740 { max-width: 740px }\n.u-maxWidth1040 { max-width: 1040px }\n.u-sizeFullWidth { width: 100% }\n.u-sizeFullHeight { height: 100% }\n\n// border\n.u-borderLighter { border: 1px solid rgba(0, 0, 0, .15); }\n.u-round { border-radius: 50% }\n.u-borderRadius2 { border-radius: 2px }\n\n.u-boxShadowBottom {\n  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, .05);\n}\n\n// Heinght\n.u-height540 { height: 540px }\n.u-height280 { height: 280px }\n.u-height260 { height: 260px }\n.u-height100 { height: 100px }\n.u-borderBlackLightest { border: 1px solid rgba(0, 0, 0, .1) }\n\n// hide global\n.u-hide { display: none !important }\n\n// card\n.u-card {\n  background: #fff;\n  border: 1px solid rgba(0, 0, 0, .09);\n  border-radius: 3px;\n  // box-shadow: 0 1px 4px rgba(0, 0, 0, .04);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\n  margin-bottom: 10px;\n  padding: 10px 20px 15px;\n}\n\n// title Line\n.title-line {\n  position: relative;\n  text-align: center;\n  width: 100%;\n\n  &::before {\n    content: '';\n    background: rgba(255, 255, 255, .3);\n    display: inline-block;\n    position: absolute;\n    left: 0;\n    bottom: 50%;\n    width: 100%;\n    height: 1px;\n    z-index: 0;\n  }\n}\n\n// Obblique\n.u-oblique {\n  background-color: var(--composite-color);\n  color: #fff;\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 700;\n  line-height: 1;\n  padding: 5px 13px;\n  text-transform: uppercase;\n  transform: skewX(-15deg);\n}\n\n.no-avatar {\n  background-image: url('../images/avatar.png') !important\n}\n\n@media #{$md-and-down} {\n  .u-hide-before-md { display: none !important }\n  .u-md-heightAuto { height: auto; }\n  .u-md-height170 { height: 170px }\n  .u-md-relative { position: relative }\n}\n\n@media #{$lg-and-down} { .u-hide-before-lg { display: none !important } }\n\n// hide after\n@media #{$md-and-up} { .u-hide-after-md { display: none !important } }\n\n@media #{$lg-and-up} { .u-hide-after-lg { display: none !important } }\n",".button {\r\n  background: rgba(0, 0, 0, 0);\r\n  border: 1px solid rgba(0, 0, 0, .15);\r\n  border-radius: 4px;\r\n  box-sizing: border-box;\r\n  color: rgba(0, 0, 0, .44);\r\n  cursor: pointer;\r\n  display: inline-block;\r\n  font-family: $primary-font;\r\n  font-size: 14px;\r\n  font-style: normal;\r\n  font-weight: 400;\r\n  height: 37px;\r\n  letter-spacing: 0;\r\n  line-height: 35px;\r\n  padding: 0 16px;\r\n  position: relative;\r\n  text-align: center;\r\n  text-decoration: none;\r\n  text-rendering: optimizeLegibility;\r\n  user-select: none;\r\n  vertical-align: middle;\r\n  white-space: nowrap;\r\n\r\n  &--chromeless {\r\n    border-radius: 0;\r\n    border-width: 0;\r\n    box-shadow: none;\r\n    color: rgba(0, 0, 0, .44);\r\n    height: auto;\r\n    line-height: inherit;\r\n    padding: 0;\r\n    text-align: left;\r\n    vertical-align: baseline;\r\n    white-space: normal;\r\n\r\n    &:active,\r\n    &:hover,\r\n    &:focus {\r\n      border-width: 0;\r\n      color: rgba(0, 0, 0, .6);\r\n    }\r\n  }\r\n\r\n  &--large {\r\n    font-size: 15px;\r\n    height: 44px;\r\n    line-height: 42px;\r\n    padding: 0 18px;\r\n  }\r\n\r\n  &--dark {\r\n    background: rgba(0, 0, 0, .84);\r\n    border-color: rgba(0, 0, 0, .84);\r\n    color: rgba(255, 255, 255, .97);\r\n\r\n    &:hover {\r\n      background: $primary-color;\r\n      border-color: $primary-color;\r\n    }\r\n  }\r\n}\r\n\r\n// Primary\r\n.button--primary {\r\n  border-color: $primary-color;\r\n  color: $primary-color;\r\n}\r\n\r\n.button--large.button--chromeless,\r\n.button--large.button--link {\r\n  padding: 0;\r\n}\r\n\r\n.buttonSet {\r\n  > .button {\r\n    margin-right: 8px;\r\n    vertical-align: middle;\r\n  }\r\n\r\n  > .button:last-child {\r\n    margin-right: 0;\r\n  }\r\n\r\n  .button--chromeless {\r\n    height: 37px;\r\n    line-height: 35px;\r\n  }\r\n\r\n  .button--large.button--chromeless,\r\n  .button--large.button--link {\r\n    height: 44px;\r\n    line-height: 42px;\r\n  }\r\n\r\n  & > .button--chromeless:not(.button--circle) {\r\n    margin-right: 0;\r\n    padding-right: 8px;\r\n  }\r\n\r\n  & > .button--chromeless:last-child {\r\n    padding-right: 0;\r\n  }\r\n\r\n  & > .button--chromeless + .button--chromeless:not(.button--circle) {\r\n    margin-left: 0;\r\n    padding-left: 8px;\r\n  }\r\n}\r\n\r\n.button--circle {\r\n  background-image: none !important;\r\n  border-radius: 50%;\r\n  color: #fff;\r\n  height: 40px;\r\n  line-height: 38px;\r\n  padding: 0;\r\n  text-decoration: none;\r\n  width: 40px;\r\n}\r\n\r\n// Btn for tag cloud or category\r\n// ==========================================================================\r\n.tag-button {\r\n  background: rgba(0, 0, 0, .05);\r\n  border: none;\r\n  color: rgba(0, 0, 0, .68);\r\n  font-weight: 700;\r\n  margin: 0 8px 8px 0;\r\n\r\n  &:hover {\r\n    background: rgba(0, 0, 0, .1);\r\n    color: rgba(0, 0, 0, .68);\r\n  }\r\n}\r\n\r\n// button dark line\r\n// ==========================================================================\r\n.button--dark-line {\r\n  border: 1px solid #000;\r\n  color: #000;\r\n  display: block;\r\n  font-weight: 600;\r\n  margin: 50px auto 0;\r\n  max-width: 300px;\r\n  text-transform: uppercase;\r\n  transition: color .3s ease, box-shadow .3s cubic-bezier(.455, .03, .515, .955);\r\n  width: 100%;\r\n\r\n  &:hover {\r\n    color: #fff;\r\n    box-shadow: inset 0 -50px 8px -4px #000;\r\n  }\r\n}\r\n","// stylelint-disable\r\n@font-face {\r\n  font-family: 'mapache';\r\n  src:  url('../fonts/mapache.eot?25764j');\r\n  src:  url('../fonts/mapache.eot?25764j#iefix') format('embedded-opentype'),\r\n    url('../fonts/mapache.ttf?25764j') format('truetype'),\r\n    url('../fonts/mapache.woff?25764j') format('woff'),\r\n    url('../fonts/mapache.svg?25764j#mapache') format('svg');\r\n  font-weight: normal;\r\n  font-style: normal;\r\n}\r\n\r\n[class^=\"i-\"]::before, [class*=\" i-\"]::before {\r\n  @extend %fonts-icons;\r\n}\r\n\r\n.i-tag:before {\r\n  content: \"\\e911\";\r\n}\r\n.i-discord:before {\r\n  content: \"\\e90a\";\r\n}\r\n.i-arrow-round-next:before {\r\n  content: \"\\e90c\";\r\n}\r\n.i-arrow-round-prev:before {\r\n  content: \"\\e90d\";\r\n}\r\n.i-arrow-round-up:before {\r\n  content: \"\\e90e\";\r\n}\r\n.i-arrow-round-down:before {\r\n  content: \"\\e90f\";\r\n}\r\n.i-photo:before {\r\n  content: \"\\e90b\";\r\n}\r\n.i-send:before {\r\n  content: \"\\e909\";\r\n}\r\n.i-audio:before {\r\n  content: \"\\e901\";\r\n}\r\n.i-rocket:before {\r\n  content: \"\\e902\";\r\n  color: #999;\r\n}\r\n.i-comments-line:before {\r\n  content: \"\\e900\";\r\n}\r\n.i-globe:before {\r\n  content: \"\\e906\";\r\n}\r\n.i-star:before {\r\n  content: \"\\e907\";\r\n}\r\n.i-link:before {\r\n  content: \"\\e908\";\r\n}\r\n.i-star-line:before {\r\n  content: \"\\e903\";\r\n}\r\n.i-more:before {\r\n  content: \"\\e904\";\r\n}\r\n.i-search:before {\r\n  content: \"\\e905\";\r\n}\r\n.i-chat:before {\r\n  content: \"\\e910\";\r\n}\r\n.i-arrow-left:before {\r\n  content: \"\\e314\";\r\n}\r\n.i-arrow-right:before {\r\n  content: \"\\e315\";\r\n}\r\n.i-play:before {\r\n  content: \"\\e037\";\r\n}\r\n.i-location:before {\r\n  content: \"\\e8b4\";\r\n}\r\n.i-check-circle:before {\r\n  content: \"\\e86c\";\r\n}\r\n.i-close:before {\r\n  content: \"\\e5cd\";\r\n}\r\n.i-favorite:before {\r\n  content: \"\\e87d\";\r\n}\r\n.i-warning:before {\r\n  content: \"\\e002\";\r\n}\r\n.i-rss:before {\r\n  content: \"\\e0e5\";\r\n}\r\n.i-share:before {\r\n  content: \"\\e80d\";\r\n}\r\n.i-email:before {\r\n  content: \"\\f0e0\";\r\n}\r\n.i-google:before {\r\n  content: \"\\f1a0\";\r\n}\r\n.i-telegram:before {\r\n  content: \"\\f2c6\";\r\n}\r\n.i-reddit:before {\r\n  content: \"\\f281\";\r\n}\r\n.i-twitter:before {\r\n  content: \"\\f099\";\r\n}\r\n.i-github:before {\r\n  content: \"\\f09b\";\r\n}\r\n.i-linkedin:before {\r\n  content: \"\\f0e1\";\r\n}\r\n.i-youtube:before {\r\n  content: \"\\f16a\";\r\n}\r\n.i-stack-overflow:before {\r\n  content: \"\\f16c\";\r\n}\r\n.i-instagram:before {\r\n  content: \"\\f16d\";\r\n}\r\n.i-flickr:before {\r\n  content: \"\\f16e\";\r\n}\r\n.i-dribbble:before {\r\n  content: \"\\f17d\";\r\n}\r\n.i-behance:before {\r\n  content: \"\\f1b4\";\r\n}\r\n.i-spotify:before {\r\n  content: \"\\f1bc\";\r\n}\r\n.i-codepen:before {\r\n  content: \"\\f1cb\";\r\n}\r\n.i-facebook:before {\r\n  content: \"\\f230\";\r\n}\r\n.i-pinterest:before {\r\n  content: \"\\f231\";\r\n}\r\n.i-whatsapp:before {\r\n  content: \"\\f232\";\r\n}\r\n.i-snapchat:before {\r\n  content: \"\\f2ac\";\r\n}\r\n","// animated Global\r\n.animated {\r\n  animation-duration: 1s;\r\n  animation-fill-mode: both;\r\n\r\n  &.infinite {\r\n    animation-iteration-count: infinite;\r\n  }\r\n}\r\n\r\n// animated All\r\n.bounceIn { animation-name: bounceIn; }\r\n.bounceInDown { animation-name: bounceInDown; }\r\n.pulse { animation-name: pulse; }\r\n.slideInUp { animation-name: slideInUp }\r\n.slideOutDown { animation-name: slideOutDown }\r\n\r\n// all keyframes Animates\r\n// bounceIn\r\n@keyframes bounceIn {\r\n  0%,\r\n  20%,\r\n  40%,\r\n  60%,\r\n  80%,\r\n  100% { animation-timing-function: cubic-bezier(.215, .61, .355, 1); }\r\n  0% { opacity: 0; transform: scale3d(.3, .3, .3); }\r\n  20% { transform: scale3d(1.1, 1.1, 1.1); }\r\n  40% { transform: scale3d(.9, .9, .9); }\r\n  60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); }\r\n  80% { transform: scale3d(.97, .97, .97); }\r\n  100% { opacity: 1; transform: scale3d(1, 1, 1); }\r\n}\r\n\r\n// bounceInDown\r\n@keyframes bounceInDown {\r\n  0%,\r\n  60%,\r\n  75%,\r\n  90%,\r\n  100% { animation-timing-function: cubic-bezier(215, 610, 355, 1); }\r\n  0% { opacity: 0; transform: translate3d(0, -3000px, 0); }\r\n  60% { opacity: 1; transform: translate3d(0, 25px, 0); }\r\n  75% { transform: translate3d(0, -10px, 0); }\r\n  90% { transform: translate3d(0, 5px, 0); }\r\n  100% { transform: none; }\r\n}\r\n\r\n@keyframes pulse {\r\n  from { transform: scale3d(1, 1, 1); }\r\n  50% { transform: scale3d(1.2, 1.2, 1.2); }\r\n  to { transform: scale3d(1, 1, 1); }\r\n}\r\n\r\n@keyframes scroll {\r\n  0% { opacity: 0; }\r\n  10% { opacity: 1; transform: translateY(0) }\r\n  100% { opacity: 0; transform: translateY(10px); }\r\n}\r\n\r\n@keyframes opacity {\r\n  0% { opacity: 0; }\r\n  50% { opacity: 0; }\r\n  100% { opacity: 1; }\r\n}\r\n\r\n//  spin for pagination\r\n@keyframes spin {\r\n  from { transform: rotate(0deg); }\r\n  to { transform: rotate(360deg); }\r\n}\r\n\r\n@keyframes tooltip {\r\n  0% { opacity: 0; transform: translate(-50%, 6px); }\r\n  100% { opacity: 1; transform: translate(-50%, 0); }\r\n}\r\n\r\n@keyframes loading-bar {\r\n  0% { transform: translateX(-100%) }\r\n  40% { transform: translateX(0) }\r\n  60% { transform: translateX(0) }\r\n  100% { transform: translateX(100%) }\r\n}\r\n\r\n// Arrow move left\r\n@keyframes arrow-move-right {\r\n  0% { opacity: 0 }\r\n  10% { transform: translateX(-100%); opacity: 0 }\r\n  100% { transform: translateX(0); opacity: 1 }\r\n}\r\n\r\n@keyframes arrow-move-left {\r\n  0% { opacity: 0 }\r\n  10% { transform: translateX(100%); opacity: 0 }\r\n  100% { transform: translateX(0); opacity: 1 }\r\n}\r\n\r\n@keyframes slideInUp {\r\n  from {\r\n    transform: translate3d(0, 100%, 0);\r\n    visibility: visible;\r\n  }\r\n\r\n  to {\r\n    transform: translate3d(0, 0, 0);\r\n  }\r\n}\r\n\r\n@keyframes slideOutDown {\r\n  from {\r\n    transform: translate3d(0, 0, 0);\r\n  }\r\n\r\n  to {\r\n    visibility: hidden;\r\n    transform: translate3d(0, 20%, 0);\r\n  }\r\n}\r\n","// Header\r\n// ==========================================================================\r\n\r\n.header-logo,\r\n.menu--toggle,\r\n.search-toggle {\r\n  z-index: 15;\r\n}\r\n\r\n.header {\r\n  box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.3);\r\n  padding: 0 16px;\r\n  position: sticky;\r\n  top: 0;\r\n  transition: all 0.4s ease-in-out;\r\n  z-index: 10;\r\n\r\n  &-wrap { height: $header-height; }\r\n\r\n  &-logo {\r\n    color: #fff !important;\r\n    height: 30px;\r\n\r\n    img { max-height: 100%; }\r\n  }\r\n}\r\n\r\n// not have logo\r\n.not-logo .header-logo { height: auto !important }\r\n\r\n// Header line separate\r\n.header-line {\r\n  height: $header-height;\r\n  border-right: 1px solid rgba(255, 255, 255, .3);\r\n  display: inline-block;\r\n  margin-right: 10px;\r\n}\r\n\r\n// Header Follow More\r\n// ==========================================================================\r\n.follow-more {\r\n  transition: width .4s ease;\r\n  overflow: hidden;\r\n  width: 0;\r\n}\r\n\r\nbody.is-showFollowMore {\r\n  .follow-more { width: auto }\r\n  .follow-toggle { color: var(--header-color-hover) }\r\n  .follow-toggle::before { content: \"\\e5cd\" }\r\n}\r\n\r\n// Header menu\r\n// ==========================================================================\r\n\r\n.nav {\r\n  padding-top: 8px;\r\n  padding-bottom: 8px;\r\n  position: relative;\r\n  overflow: hidden;\r\n\r\n  ul {\r\n    display: flex;\r\n    margin-right: 20px;\r\n    overflow: hidden;\r\n    white-space: nowrap;\r\n  }\r\n}\r\n\r\n.header-left a,\r\n.nav ul li a {\r\n  border-radius: 3px;\r\n  color: var(--header-color);\r\n  display: inline-block;\r\n  font-weight: 600;\r\n  line-height: 30px;\r\n  padding: 0 8px;\r\n  text-align: center;\r\n  text-transform: uppercase;\r\n  vertical-align: middle;\r\n\r\n  &.active,\r\n  &:hover {\r\n    color: var(--header-color-hover);\r\n  }\r\n}\r\n\r\n// button-nav\r\n.menu--toggle {\r\n  height: 48px;\r\n  position: relative;\r\n  transition: transform .4s;\r\n  width: 48px;\r\n\r\n  span {\r\n    background-color: var(--header-color);\r\n    display: block;\r\n    height: 2px;\r\n    left: 14px;\r\n    margin-top: -1px;\r\n    position: absolute;\r\n    top: 50%;\r\n    transition: .4s;\r\n    width: 20px;\r\n\r\n    &:first-child { transform: translate(0, -6px); }\r\n    &:last-child { transform: translate(0, 6px); }\r\n  }\r\n}\r\n\r\n// Header menu\r\n// ==========================================================================\r\n\r\n@media #{$md-and-down} {\r\n  .header-left { flex-grow: 1 !important; }\r\n  .header-logo span { font-size: 24px }\r\n\r\n  // show menu mobile\r\n  body.is-showNavMob {\r\n    overflow: hidden;\r\n\r\n    .sideNav { transform: translateX(0); }\r\n\r\n    .menu--toggle {\r\n      border: 0;\r\n      transform: rotate(90deg);\r\n\r\n      span:first-child { transform: rotate(45deg) translate(0, 0); }\r\n      span:nth-child(2) { transform: scaleX(0); }\r\n      span:last-child { transform: rotate(-45deg) translate(0, 0); }\r\n    }\r\n\r\n    .header .button-search--toggle { display: none; }\r\n    .main, .footer { transform: translateX(-25%) !important; }\r\n  }\r\n}\r\n","// Footer\r\n// ==========================================================================\r\n\r\n.footer {\r\n  color: #888;\r\n\r\n  a {\r\n    color: var(--footer-color-link);\r\n    &:hover { color: #fff }\r\n  }\r\n\r\n  &-links {\r\n    padding: 3em 0 2.5em;\r\n    background-color: #131313;\r\n  }\r\n\r\n  .follow > a {\r\n    background: #333;\r\n    border-radius: 50%;\r\n    color: inherit;\r\n    display: inline-block;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    margin: 0 5px 8px;\r\n    text-align: center;\r\n    width: 40px;\r\n\r\n    &:hover {\r\n      background: transparent;\r\n      box-shadow: inset 0 0 0 2px #333;\r\n    }\r\n  }\r\n\r\n  &-copy {\r\n    padding: 3em 0;\r\n    background-color: #000;\r\n  }\r\n}\r\n\r\n.footer-menu {\r\n  li {\r\n    display: inline-block;\r\n    line-height: 24px;\r\n    margin: 0 8px;\r\n\r\n    /* stylelint-disable-next-line */\r\n    a { color: #888 }\r\n  }\r\n}\r\n","// Home Page Styles\r\n// ==========================================================================\r\n.cover {\r\n  padding: 4px;\r\n\r\n  &-story {\r\n    overflow: hidden;\r\n    height: 250px;\r\n    width: 100%;\r\n\r\n    &:hover .cover-header { background-image: linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%) }\r\n\r\n    &.firts { height: 80vh }\r\n  }\r\n\r\n  &-img,\r\n  &-link {\r\n    bottom: 4px;\r\n    left: 4px;\r\n    right: 4px;\r\n    top: 4px;\r\n  }\r\n\r\n  // stylelint-disable-next-line\r\n  &-header {\r\n    bottom: 4px;\r\n    left: 4px;\r\n    right: 4px;\r\n    padding: 50px 3.846153846% 20px;\r\n    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, .9) 100%);\r\n  }\r\n}\r\n\r\n// Home Page Personal Cover page\r\n// ==========================================================================\r\n.hm-cover {\r\n  padding: 30px 0;\r\n  min-height: 100vh;\r\n\r\n  &-title {\r\n    font-size: 2.5rem;\r\n    font-weight: 900;\r\n    line-height: 1;\r\n  }\r\n\r\n  &-des {\r\n    max-width: 600px;\r\n    font-size: 1.25rem;\r\n  }\r\n}\r\n\r\n.hm-subscribe {\r\n  background-color: transparent;\r\n  border-radius: 3px;\r\n  box-shadow: inset 0 0 0 2px hsla(0, 0%, 100%, .5);\r\n  color: #fff;\r\n  display: block;\r\n  font-size: 20px;\r\n  font-weight: 400;\r\n  line-height: 1.2;\r\n  margin-top: 50px;\r\n  max-width: 300px;\r\n  padding: 15px 10px;\r\n  transition: all .3s;\r\n  width: 100%;\r\n\r\n  &:hover {\r\n    box-shadow: inset 0 0 0 2px #fff;\r\n  }\r\n}\r\n\r\n.hm-down {\r\n  animation-duration: 1.2s !important;\r\n  bottom: 60px;\r\n  color: hsla(0, 0%, 100%, .5);\r\n  left: 0;\r\n  margin: 0 auto;\r\n  position: absolute;\r\n  right: 0;\r\n  width: 70px;\r\n  z-index: 100;\r\n\r\n  svg {\r\n    display: block;\r\n    fill: currentcolor;\r\n    height: auto;\r\n    width: 100%;\r\n  }\r\n}\r\n\r\n// Media Query\r\n// ==========================================================================\r\n@media #{$md-and-up} {\r\n  .cover {\r\n    height: 70vh;\r\n\r\n    &-story {\r\n      height: 50%;\r\n      width: 33.33333%;\r\n\r\n      &.firts {\r\n        height: 100%;\r\n        width: 66.66666%;\r\n\r\n        .cover-title { font-size: 2.5rem }\r\n      }\r\n    }\r\n  }\r\n\r\n  // Home page\r\n  .hm-cover-title { font-size: 3.5rem }\r\n}\r\n","// post content\n// ==========================================================================\n\n.post {\n  // title\n  &-title {\n    color: #000;\n    line-height: 1.2;\n    font-weight: 900;\n    max-width: 1000px;\n  }\n\n  &-excerpt {\n    color: #555;\n    font-family: $secundary-font;\n    font-weight: 300;\n    letter-spacing: -.012em;\n    line-height: 1.6;\n  }\n\n  // author\n  &-author-social {\n    vertical-align: middle;\n    margin-left: 2px;\n    padding: 0 3px;\n  }\n\n  &-image { margin-top: 30px }\n}\n\n// Avatar\n// ==========================================================================\n.avatar-image {\n  display: inline-block;\n  vertical-align: middle;\n\n  @extend .u-round;\n\n  &--smaller {\n    width: 50px;\n    height: 50px;\n  }\n}\n\n// post content body\n// ==========================================================================\n.post-body {\n  a:not(.button):not(.button--circle):not(.prev-next-link) {\n    text-decoration: none;\n    position: relative;\n    transition: all 250ms;\n    box-shadow: inset 0 -3px 0 var(--post-color-link);\n\n    &:hover {\n      box-shadow: inset 0 -1rem 0 var(--post-color-link)\n    }\n  }\n\n  img {\n    display: block;\n    margin-left: auto;\n    margin-right: auto;\n  }\n\n  h1, h2, h3, h4, h5, h6 {\n    margin-top: 30px;\n    font-weight: 900;\n    font-style: normal;\n    color: #000;\n    letter-spacing: -.02em;\n    line-height: 1.2;\n  }\n\n  h2 { margin-top: 35px }\n\n  p {\n    font-family: $secundary-font;\n    font-size: 1.125rem;\n    font-weight: 400;\n    letter-spacing: -.003em;\n    line-height: 1.7;\n    margin-top: 25px;\n  }\n\n  ul,\n  ol {\n    counter-reset: post;\n    font-family: $secundary-font;\n    font-size: 1.125rem;\n    margin-top: 20px;\n\n    li {\n      letter-spacing: -.003em;\n      margin-bottom: 14px;\n      margin-left: 30px;\n\n      &::before {\n        box-sizing: border-box;\n        display: inline-block;\n        margin-left: -78px;\n        position: absolute;\n        text-align: right;\n        width: 78px;\n      }\n    }\n  }\n\n  ul li::before {\n    content: '\\2022';\n    font-size: 16.8px;\n    padding-right: 15px;\n    padding-top: 3px;\n  }\n\n  ol li::before {\n    content: counter(post) \".\";\n    counter-increment: post;\n    padding-right: 12px;\n  }\n}\n\n// Class of Ghost\n// ==========================================================================\n\n// fisrt p\n// .post-body-wrap > p:first-of-type {\n//   margin-top: 30px;\n\n//   // &::first-letter {\n//   //   float: left;\n//   //   font-size: 55px;\n//   //   font-style: normal;\n//   //   font-weight: 900;\n//   //   letter-spacing: -.03em;\n//   //   line-height: .83;\n//   //   margin-bottom: -.08em;\n//   //   margin-right: 7px;\n//   //   padding-top: 7px;\n//   //   text-transform: uppercase;\n//   // }\n// }\n\n.post-body-wrap {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n\n  // & > p:first-of-type { margin-top: 30px }\n\n  h1, h2, h3, h4, h5, h6, p,\n  ol, ul, hr, pre, dl, blockquote,\n  .post-tags, .prev-next, .mob-share, .kg-embed-card {\n    min-width: 100%;\n  }\n\n  & > ul { margin-top: 35px }\n\n  & > iframe,\n  & > img,\n  .kg-image-card,\n  .kg-card,\n  .kg-gallery-card,\n  .kg-embed-card {\n    margin-top: 30px !important\n  }\n}\n\n// Share Post\n// ==========================================================================\n.sharePost {\n  left: 0;\n  width: 40px;\n  position: absolute !important;\n  transition: all .4s;\n  top: 30px;\n\n  /* stylelint-disable-next-line */\n  a {\n    color: #fff;\n    margin: 8px 0 0;\n    display: block;\n  }\n\n  .i-chat {\n    background-color: #fff;\n    border: 2px solid #bbb;\n    color: #bbb;\n  }\n}\n\n// Post Related\n// ==========================================================================\n\n.post-related {\n  padding: 40px 0;\n}\n\n// Post mobile share\n/* stylelint-disable-next-line */\n.mob-share {\n  .mapache-share {\n    height: 40px;\n    color: #fff;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    box-shadow: none !important;\n  }\n\n  .share-title {\n    font-size: 14px;\n    margin-left: 10px\n  }\n}\n\n// Previus and next article\n// ==========================================================================\n/* stylelint-disable-next-line */\n.prev-next {\n  &-span {\n    color: var(--composite-color);\n    font-weight: 700;\n    font-size: 13px;\n\n    i {\n      display: inline-flex;\n      transition: all 277ms cubic-bezier(0.16, 0.01, 0.77, 1)\n    }\n  }\n\n  &-title {\n    margin: 0 !important;\n    font-size: 16px;\n    height: 2em;\n    overflow: hidden;\n    line-height: 1 !important;\n    text-overflow: ellipsis !important;\n    -webkit-box-orient: vertical !important;\n    -webkit-line-clamp: 2 !important;\n    display: -webkit-box !important;\n  }\n\n  // &-arrow {\n  //   color: #bbb;\n  //   font-size: 40px;\n  //   line-height: 1;\n  // }\n\n  &-link:hover {\n    // .prev-next-title { color: rgba(0, 0, 0, .54) }\n    .arrow-right { animation: arrow-move-right 0.5s ease-in-out forwards }\n    .arrow-left { animation: arrow-move-left 0.5s ease-in-out forwards }\n  }\n}\n\n// Image post Format\n// ==========================================================================\n.cc-image {\n  max-height: 100vh;\n  min-height: 600px;\n  background-color: #000;\n\n  &-header {\n    right: 0;\n    bottom: 10%;\n    left: 0;\n  }\n\n  &-figure img {\n    opacity: .4;\n    object-fit: cover;\n    width: 100%\n  }\n\n  .post-header { max-width: 700px }\n  .post-title, .post-excerpt { color: #fff }\n}\n\n// Video post Format\n// ==========================================================================\n\n.cc-video {\n  background-color: #000;\n  padding: 40px 0 30px;\n\n  .post-excerpt { color: #aaa; font-size: 1rem }\n  .post-title { color: #fff; font-size: 1.8rem }\n  .kg-embed-card, .video-responsive { margin-top: 0 }\n\n  // Video related\n  // .story h2 {\n  //   color: #fff;\n  //   margin: 0;\n  //   font-size: 1.125rem !important;\n  //   font-weight: 700 !important;\n  //   max-height: 2.5em;\n  //   overflow: hidden;\n  //   -webkit-box-orient: vertical !important;\n  //   -webkit-line-clamp: 2 !important;\n  //   text-overflow: ellipsis !important;\n  //   display: -webkit-box !important;\n  // }\n\n  // .flow-meta, .story-lower, figcaption { display: none !important }\n  // .story-image { height: 170px !important; }\n\n  .media-type {\n    height: 34px !important;\n    width: 34px !important;\n  }\n}\n\n// change the design according to the classes of the body\nbody {\n  &.is-article .main { margin-bottom: 0 }\n  &.share-margin .sharePost { top: -60px }\n  &.show-category .post-primary-tag { display: block !important }\n\n  &.is-article-single {\n    .post-body-wrap { margin-left: 0 !important }\n    .sharePost { left: -100px }\n    .kg-width-full .kg-image { max-width: 100vw }\n    .kg-width-wide .kg-image { max-width: 1040px }\n  }\n}\n\n@media #{$md-and-down} {\n  .post-body-wrap {\n    q {\n      font-size: 20px !important;\n      letter-spacing: -.008em !important;\n      line-height: 1.4 !important;\n    }\n\n    // & > p:first-of-type::first-letter {\n    //   font-size: 30px;\n    //   margin-right: 6px;\n    //   padding-top: 3.5px;\n    // }\n\n    .kg-image-card img { max-width: 100%; }\n\n    ol, ul, p {\n      font-size: 1rem;\n      letter-spacing: -.004em;\n      line-height: 1.58;\n    }\n\n    iframe { width: 100% !important; }\n  }\n\n  // Post Related\n  .post-related {\n    padding-left: 8px;\n    padding-right: 8px;\n  }\n\n  // Image post format\n  .cc-image-figure {\n    width: 200%;\n    max-width: 200%;\n    margin: 0 auto 0 -50%;\n  }\n\n  .cc-image-header { bottom: 24px }\n  .cc-image .post-excerpt { font-size: 18px; }\n\n  // video post format\n  .cc-video {\n    padding: 20px 0;\n\n    &-embed {\n      margin-left: -16px;\n      margin-right: -15px;\n    }\n\n    .post-header { margin-top: 10px }\n  }\n}\n\n@media #{$lg-and-down} {\n  body.is-article {\n    .col-left { max-width: 100% }\n    // .sidebar { display: none; }\n  }\n}\n\n@media #{$md-and-up} {\n  // Image post Format\n  .cc-image .post-title { font-size: 3.2rem }\n}\n\n@media #{$lg-and-up} {\n  body.is-article .post-body-wrap { margin-left: 70px; }\n\n  body.is-video,\n  body.is-image {\n    .post-author { margin-left: 70px }\n    // .sharePost { top: -85px }\n  }\n}\n\n@media #{$xl-and-up} {\n  body.has-video-fixed {\n    .cc-video-embed {\n      bottom: 20px;\n      box-shadow: 0 0 10px 0 rgba(0, 0, 0, .5);\n      height: 203px;\n      padding-bottom: 0;\n      position: fixed;\n      right: 20px;\n      width: 360px;\n      z-index: 8;\n    }\n\n    .cc-video-close {\n      background: #000;\n      border-radius: 50%;\n      color: #fff;\n      cursor: pointer;\n      display: block !important;\n      font-size: 14px;\n      height: 24px;\n      left: -10px;\n      line-height: 1;\n      padding-top: 5px;\n      position: absolute;\n      text-align: center;\n      top: -10px;\n      width: 24px;\n      z-index: 5;\n    }\n\n    .cc-video-cont { height: 465px; }\n\n    .cc-image-header { bottom: 20% }\n  }\n}\n","// styles for story\n\n.hr-list {\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.0785);\n  margin: 20px 0 0;\n  // &:first-child { margin-top: 5px }\n}\n\n.story-feed .story-feed-content:first-child .hr-list:first-child {\n  margin-top: 5px;\n}\n\n// media type icon ( video - image )\n.media-type {\n  // background-color: lighten($primary-color, 15%);\n  background-color: rgba(0, 0, 0, .7);\n  color: #fff;\n  height: 45px;\n  left: 15px;\n  top: 15px;\n  width: 45px;\n  opacity: .9;\n\n  // @extend .u-bgColor;\n  @extend .u-fontSizeLarger;\n  @extend .u-round;\n  @extend .u-flexCenter;\n  @extend .u-flexContentCenter;\n}\n\n// Image over\n.image-hover {\n  transition: transform .7s;\n  transform: translateZ(0)\n}\n\n// not image\n.not-image {\n  background: url('../images/not-image.png');\n  background-repeat: repeat;\n}\n\n// Meta\n.flow-meta {\n  color: rgba(0, 0, 0, 0.54);\n  font-weight: 700;\n  margin-bottom: 10px;\n}\n\n// point\n.point { margin: 0 5px }\n\n// Story Default list\n// ==========================================================================\n\n.story {\n  &-image {\n    flex: 0 0  44% /*380px*/;\n    height: 235px;\n    margin-right: 30px;\n\n    &:hover .image-hover { transform: scale(1.03) }\n  }\n\n  &-lower { flex-grow: 1 }\n\n  &-excerpt {\n    color: rgba(0, 0, 0, 0.84);\n    font-family: $secundary-font;\n    font-weight: 300;\n    line-height: 1.5;\n  }\n\n  &-category { color: rgba(0, 0, 0, 0.84) }\n\n  h2 a:hover {\n    // box-shadow: inset 0 -2px 0 rgba(0, 171, 107, .5);\n    // box-shadow: inset 0 -2px 0 rgba($primary-color, .5);\n    // box-shadow: inset 0 -2px 0 var(--story-color-hover);\n    // box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.4);\n    // transition: all .25s;\n    opacity: .6;\n  }\n}\n\n// Story Grid\n// ==========================================================================\n\n.story.story--grid {\n  flex-direction: column;\n  margin-bottom: 30px;\n\n  .story-image {\n    flex: 0 0 auto;\n    margin-right: 0;\n    height: 220px;\n  }\n\n  .media-type {\n    font-size: 24px;\n    height: 40px;\n    width: 40px;\n  }\n}\n\n.cover-category { color: var(--story-cover-category-color) }\n\n// Story Card\n// ==========================================================================\n\n.story-card {\n  .story {\n    // background: #fff;\n    // border-radius: 4px;\n    // border: 1px solid rgba(0, 0, 0, .04);\n    // box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\n    margin-top: 0 !important;\n\n    // &:hover .story-image { box-shadow: 0 0 15px 4px rgba(0, 0, 0, .1) }\n  }\n\n  /* stylelint-disable-next-line */\n  .story-image {\n    // box-shadow: 0 1px 2px rgba(0, 0, 0, .07);\n    border: 1px solid rgba(0, 0, 0, .04);\n    box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\n    border-radius: 2px;\n    background-color: #fff !important;\n    transition: all 150ms ease-in-out;\n    // border-bottom: 1px solid rgba(0, 0, 0, .0785);\n    // border-radius: 4px 4px 0 0;\n    overflow: hidden;\n    height: 200px !important;\n\n    .story-img-bg { margin: 10px }\n\n    &:hover {\n      box-shadow: 0 0 15px 4px rgba(0, 0, 0, .1);\n\n      .story-img-bg { transform: none }\n    }\n  }\n\n  .story-lower { display: none !important }\n\n  .story-body {\n    padding: 15px 5px;\n    margin: 0 !important;\n\n    h2 {\n      -webkit-box-orient: vertical !important;\n      -webkit-line-clamp: 2 !important;\n      color: rgba(0, 0, 0, .9);\n      display: -webkit-box !important;\n      // line-height: 1.1 !important;\n      max-height: 2.4em !important;\n      overflow: hidden;\n      text-overflow: ellipsis !important;\n      margin: 0;\n    }\n  }\n}\n\n// Story Small\n// ==========================================================================\n\n.story-small {\n  &-img {\n    height: 170px;\n    background-color: #000 !important;\n  }\n\n  /* stylelint-disable-next-line */\n  .image-hover { transition: all .25s }\n\n  h3 {\n    color: #fff;\n    max-height: 2.5em;\n    overflow: hidden;\n    -webkit-box-orient: vertical !important;\n    -webkit-line-clamp: 2 !important;\n    text-overflow: ellipsis !important;\n    display: -webkit-box !important;\n    transition: all .25s;\n  }\n\n  &:hover {\n    .image-hover { opacity: .8 }\n    h3 { opacity: .6 }\n  }\n}\n\n// Media query after medium\n// ==========================================================================\n\n@media #{$md-and-up} {\n  // story grid\n  .story.story--grid {\n    .story-lower {\n      max-height: 2.6em;\n      -webkit-box-orient: vertical;\n      -webkit-line-clamp: 2;\n      display: -webkit-box;\n      line-height: 1.1;\n      text-overflow: ellipsis;\n    }\n  }\n}\n\n// Media query before medium\n// ==========================================================================\n@media #{$md-and-down} {\n  // Story Cover\n  .cover--firts .cover-story { height: 500px }\n\n  // story default list\n  .story {\n    flex-direction: column;\n    margin-top: 20px;\n\n    &-image { flex: 0 0 auto; margin-right: 0 }\n    &-body { margin-top: 10px }\n  }\n}\n","// Author page\r\n// ==========================================================================\r\n\r\n.author {\r\n  background-color: #fff;\r\n  color: rgba(0, 0, 0, .6);\r\n  min-height: 350px;\r\n\r\n  &-avatar {\r\n    height: 80px;\r\n    width: 80px;\r\n  }\r\n\r\n  &-meta span {\r\n    display: inline-block;\r\n    font-size: 17px;\r\n    font-style: italic;\r\n    margin: 0 25px 16px 0;\r\n    opacity: .8;\r\n    word-wrap: break-word;\r\n  }\r\n\r\n  &-name { color: rgba(0, 0, 0, .8) }\r\n  &-bio { max-width: 600px; }\r\n  &-meta a:hover { opacity: .8 !important }\r\n}\r\n\r\n.cover-opacity { opacity: .5 }\r\n\r\n.author.has--image {\r\n  color: #fff !important;\r\n  text-shadow: 0 0 10px rgba(0, 0, 0, .33);\r\n\r\n  a,\r\n  .author-name { color: #fff; }\r\n\r\n  .author-follow a {\r\n    border: 2px solid;\r\n    border-color: hsla(0, 0%, 100%, .5) !important;\r\n    font-size: 16px;\r\n  }\r\n\r\n  .u-accentColor--iconNormal { fill: #fff; }\r\n}\r\n\r\n@media #{$md-and-down} {\r\n  .author-meta span { display: block; }\r\n  .author-header { display: block; }\r\n  .author-avatar { margin: 0 auto 20px; }\r\n}\r\n\r\n@media #{$md-and-up} {\r\n  body.has-cover .author { min-height: 600px }\r\n}\r\n","// Search\n// ==========================================================================\n\n.search {\n  background-color: #fff;\n  height: 100%;\n  height: 100vh;\n  left: 0;\n  padding: 0 16px;\n  right: 0;\n  top: 0;\n  transform: translateY(-100%);\n  transition: transform .3s ease;\n  z-index: 9;\n\n  &-form {\n    max-width: 680px;\n    margin-top: 80px;\n\n    &::before {\n      background: #eee;\n      bottom: 0;\n      content: '';\n      display: block;\n      height: 2px;\n      left: 0;\n      position: absolute;\n      width: 100%;\n      z-index: 1;\n    }\n\n    input {\n      border: none;\n      display: block;\n      line-height: 40px;\n      padding-bottom: 8px;\n\n      &:focus { outline: 0; }\n    }\n  }\n\n  // result\n  &-results {\n    max-height: calc(100% - 100px);\n    max-width: 680px;\n    overflow: auto;\n\n    a {\n      padding: 10px 20px;\n      background: rgba(0, 0, 0, .05);\n      color: rgba(0, 0, 0, .7);\n      text-decoration: none;\n      display: block;\n      border-bottom: 1px solid #fff;\n      transition: all 0.3s ease-in-out;\n\n      &:hover { background: rgba(0, 0, 0, 0.1) }\n    }\n  }\n}\n\n.button-search--close {\n  position: absolute !important;\n  right: 50px;\n  top: 20px;\n}\n\nbody.is-search {\n  overflow: hidden;\n\n  .search { transform: translateY(0) }\n  .search-toggle { background-color: rgba(255, 255, 255, .25) }\n}\n",".sidebar {\r\n  &-title {\r\n    border-bottom: 1px solid rgba(0, 0, 0, .0785);\r\n\r\n    span {\r\n      border-bottom: 1px solid rgba(0, 0, 0, .54);\r\n      padding-bottom: 10px;\r\n      margin-bottom: -1px;\r\n    }\r\n  }\r\n}\r\n\r\n// border for post\r\n.sidebar-border {\r\n  border-left: 3px solid var(--composite-color);\r\n  color: rgba(0, 0, 0, .2);\r\n  font-family: $secundary-font;\r\n  padding: 0 10px;\r\n  -webkit-text-fill-color: transparent;\r\n  -webkit-text-stroke-width: 1.5px;\r\n  -webkit-text-stroke-color: #888;\r\n}\r\n\r\n.sidebar-post {\r\n  background-color: #fff;\r\n  border-bottom: 1px solid rgba(0, 0, 0, 0.0785);\r\n  box-shadow: 0 1px 7px rgba(0, 0, 0, .0785);\r\n  min-height: 60px;\r\n\r\n  &:hover { .sidebar-border { background-color: rgba(229, 239, 245, 1) } }\r\n\r\n  &:nth-child(3n) { .sidebar-border { border-color: darken(orange, 2%); } }\r\n  &:nth-child(3n+2) { .sidebar-border { border-color: #26a8ed } }\r\n}\r\n\r\n// Centered line and oblique content\r\n// ==========================================================================\r\n// .center-line {\r\n//   font-size: 16px;\r\n//   margin-bottom: 15px;\r\n//   position: relative;\r\n//   text-align: center;\r\n\r\n//   &::before {\r\n//     background: rgba(0, 0, 0, .15);\r\n//     bottom: 50%;\r\n//     content: '';\r\n//     display: inline-block;\r\n//     height: 1px;\r\n//     left: 0;\r\n//     position: absolute;\r\n//     width: 100%;\r\n//     z-index: 0;\r\n//   }\r\n// }\r\n\r\n// .oblique {\r\n//   background: #ff005b;\r\n//   color: #fff;\r\n//   display: inline-block;\r\n//   font-size: 16px;\r\n//   font-weight: 700;\r\n//   line-height: 1;\r\n//   padding: 5px 13px;\r\n//   position: relative;\r\n//   text-transform: uppercase;\r\n//   transform: skewX(-15deg);\r\n//   z-index: 1;\r\n// }\r\n","// Navigation Mobile\r\n.sideNav {\r\n  // background-color: $primary-color;\r\n  color: rgba(0, 0, 0, 0.8);\r\n  height: 100vh;\r\n  padding: $header-height 20px;\r\n  position: fixed !important;\r\n  transform: translateX(100%);\r\n  transition: 0.4s;\r\n  will-change: transform;\r\n  z-index: 8;\r\n\r\n  &-menu a { padding: 10px 20px; }\r\n\r\n  &-wrap {\r\n    background: #eee;\r\n    overflow: auto;\r\n    padding: 20px 0;\r\n    top: $header-height;\r\n  }\r\n\r\n  &-section {\r\n    border-bottom: solid 1px #ddd;\r\n    margin-bottom: 8px;\r\n    padding-bottom: 8px;\r\n  }\r\n\r\n  &-follow {\r\n    border-top: 1px solid #ddd;\r\n    margin: 15px 0;\r\n\r\n    a {\r\n      color: #fff;\r\n      display: inline-block;\r\n      height: 36px;\r\n      line-height: 20px;\r\n      margin: 0 5px 5px 0;\r\n      min-width: 36px;\r\n      padding: 8px;\r\n      text-align: center;\r\n      vertical-align: middle;\r\n    }\r\n\r\n    @each $social-name, $color in $social-colors {\r\n      .i-#{$social-name} {\r\n        @extend .bg-#{$social-name};\r\n      }\r\n    }\r\n  }\r\n}\r\n","//  Follow me btn is post\r\n// .mapache-follow {\r\n//   &:hover {\r\n//     .mapache-hover-hidden { display: none !important }\r\n//     .mapache-hover-show { display: inline-block !important }\r\n//   }\r\n\r\n//   &-btn {\r\n//     height: 19px;\r\n//     line-height: 17px;\r\n//     padding: 0 10px;\r\n//   }\r\n// }\r\n\r\n// Transparece header and cover img\r\n\r\n.has-cover-padding { padding-top: 100px }\r\n\r\nbody.has-cover {\r\n  .header { position: fixed }\r\n\r\n  &.is-transparency:not(.is-search) {\r\n    .header {\r\n      background: rgba(0, 0, 0, .05);\r\n      box-shadow: none;\r\n      border-bottom: 1px solid hsla(0, 0%, 100%, .1);\r\n    }\r\n\r\n    .header-left a, .nav ul li a { color: #fff; }\r\n    .menu--toggle span { background-color: #fff }\r\n  }\r\n}\r\n","// .is-subscribe .footer {\r\n//   background-color: #f0f0f0;\r\n// }\r\n\r\n.subscribe {\r\n  min-height: 80vh !important;\r\n  height: 100%;\r\n  // background-color: #f0f0f0 !important;\r\n\r\n  &-card {\r\n    background-color: #D7EFEE;\r\n    box-shadow: 0 2px 10px rgba(0, 0, 0, .15);\r\n    border-radius: 4px;\r\n    width: 900px;\r\n    height: 550px;\r\n    padding: 50px;\r\n    margin: 5px;\r\n  }\r\n\r\n  form {\r\n    max-width: 300px;\r\n  }\r\n\r\n  &-form {\r\n    height: 100%;\r\n  }\r\n\r\n  &-input {\r\n    background: 0 0;\r\n    border: 0;\r\n    border-bottom: 1px solid #cc5454;\r\n    border-radius: 0;\r\n    padding: 7px 5px;\r\n    height: 45px;\r\n    outline: 0;\r\n    font-family: $primary-font;\r\n\r\n    &::placeholder {\r\n      color: #cc5454;\r\n    }\r\n  }\r\n\r\n  .main-error {\r\n    color: #cc5454;\r\n    font-size: 16px;\r\n    margin-top: 15px;\r\n  }\r\n}\r\n\r\n// .subscribe-btn {\r\n//   background: rgba(0, 0, 0, .84);\r\n//   border-color: rgba(0, 0, 0, .84);\r\n//   color: rgba(255, 255, 255, .97);\r\n//   box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\r\n//   letter-spacing: 1px;\r\n\r\n//   &:hover {\r\n//     background: #1C9963;\r\n//     border-color: #1C9963;\r\n//   }\r\n// }\r\n\r\n// Success\r\n.subscribe-success {\r\n  .subscribe-card {\r\n    background-color: #E8F3EC;\r\n  }\r\n}\r\n\r\n@media #{$md-and-down} {\r\n  .subscribe-card {\r\n    height: auto;\r\n    width: auto;\r\n  }\r\n}\r\n","// post Comments\r\n// ==========================================================================\r\n\r\n.post-comments {\r\n  position: fixed;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  z-index: 15;\r\n  width: 100%;\r\n  left: 0;\r\n  overflow-y: auto;\r\n  background: #fff;\r\n  border-left: 1px solid #f1f1f1;\r\n  box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\r\n  font-size: 14px;\r\n  transform: translateX(100%);\r\n  transition: .2s;\r\n  will-change: transform;\r\n\r\n  &-header {\r\n    padding: 20px;\r\n    border-bottom: 1px solid #ddd;\r\n\r\n    .toggle-comments {\r\n      font-size: 24px;\r\n      line-height: 1;\r\n      position: absolute;\r\n      left: 0;\r\n      top: 0;\r\n      padding: 17px;\r\n      cursor: pointer;\r\n    }\r\n  }\r\n\r\n  &-overlay {\r\n    position: fixed !important;\r\n    background-color: rgba(0, 0, 0, .2);\r\n    display: none;\r\n    transition: background-color .4s linear;\r\n    z-index: 8;\r\n    cursor: pointer;\r\n  }\r\n}\r\n\r\nbody.has-comments {\r\n  overflow: hidden;\r\n\r\n  .post-comments-overlay { display: block }\r\n  .post-comments { transform: translateX(0) }\r\n}\r\n\r\n@media #{$md-and-up} {\r\n  .post-comments {\r\n    left: auto;\r\n    width: 500px;\r\n    top: $header-height;\r\n    z-index: 9;\r\n\r\n    &-wrap { padding: 20px; }\r\n  }\r\n}\r\n",".modal {\r\n  opacity: 0;\r\n  transition: opacity .2s ease-out .1s, visibility 0s .4s;\r\n  z-index: 100;\r\n  visibility: hidden;\r\n\r\n  // Shader\r\n  &-shader { background-color: rgba(255, 255, 255, .65) }\r\n\r\n  // modal close\r\n  &-close {\r\n    color: rgba(0, 0, 0, .54);\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    line-height: 1;\r\n    padding: 15px;\r\n  }\r\n\r\n  // Inner\r\n  &-inner {\r\n    background-color: #E8F3EC;\r\n    border-radius: 4px;\r\n    box-shadow: 0 2px 10px rgba(0, 0, 0, .15);\r\n    max-width: 700px;\r\n    height: 100%;\r\n    max-height: 400px;\r\n    opacity: 0;\r\n    padding: 72px 5% 56px;\r\n    transform: scale(.6);\r\n    transition: transform .3s cubic-bezier(.06, .47, .38, .99), opacity .3s cubic-bezier(.06, .47, .38, .99);\r\n    width: 100%;\r\n  }\r\n\r\n  // form\r\n  .form-group {\r\n    width: 76%;\r\n    margin: 0 auto 30px;\r\n  }\r\n\r\n  .form--input {\r\n    display: inline-block;\r\n    margin-bottom: 10px;\r\n    vertical-align: top;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    background-color: transparent;\r\n    padding: 17px 6px;\r\n    border-bottom: 1px solid rgba(0, 0, 0, .15);\r\n    width: 100%;\r\n  }\r\n\r\n  // .form--btn {\r\n  //   background-color: rgba(0, 0, 0, .84);\r\n  //   border: 0;\r\n  //   height: 37px;\r\n  //   border-radius: 3px;\r\n  //   line-height: 37px;\r\n  //   padding: 0 16px;\r\n  //   transition: background-color .3s ease-in-out;\r\n  //   letter-spacing: 1px;\r\n  //   color: rgba(255, 255, 255, .97);\r\n  //   cursor: pointer;\r\n\r\n  //   &:hover { background-color: #1C9963 }\r\n  // }\r\n}\r\n\r\n// if has modal\r\n\r\nbody.has-modal {\r\n  overflow: hidden;\r\n\r\n  .modal {\r\n    opacity: 1;\r\n    visibility: visible;\r\n    transition: opacity .3s ease;\r\n\r\n    &-inner {\r\n      opacity: 1;\r\n      transform: scale(1);\r\n      transition: transform .8s cubic-bezier(.26, .63, 0, .96);\r\n    }\r\n  }\r\n}\r\n","// Instagram Fedd\r\n// ==========================================================================\r\n.instagram {\r\n  &-hover {\r\n    background-color: rgba(0, 0, 0, .3);\r\n    // transition: opacity 1s ease-in-out;\r\n    opacity: 0;\r\n  }\r\n\r\n  &-img {\r\n    height: 264px;\r\n\r\n    &:hover > .instagram-hover { opacity: 1 }\r\n  }\r\n\r\n  &-name {\r\n    left: 50%;\r\n    top: 50%;\r\n    transform: translate(-50%, -50%);\r\n    z-index: 3;\r\n\r\n    a {\r\n      background-color: #fff;\r\n      color: #000 !important;\r\n      font-size: 18px !important;\r\n      font-weight: 900 !important;\r\n      min-width: 200px;\r\n      padding-left: 10px !important;\r\n      padding-right: 10px !important;\r\n      text-align: center !important;\r\n    }\r\n  }\r\n\r\n  &-col {\r\n    padding: 0 !important;\r\n    margin: 0 !important;\r\n  }\r\n\r\n  &-wrap { margin: 0 !important }\r\n}\r\n\r\n// Newsletter Sidebar\r\n// ==========================================================================\r\n.witget-subscribe {\r\n  background: #fff;\r\n  border: 5px solid transparent;\r\n  padding: 28px 30px;\r\n  position: relative;\r\n\r\n  &::before {\r\n    content: \"\";\r\n    border: 5px solid #f5f5f5;\r\n    box-shadow: inset 0 0 0 1px #d7d7d7;\r\n    box-sizing: border-box;\r\n    display: block;\r\n    height: calc(100% + 10px);\r\n    left: -5px;\r\n    pointer-events: none;\r\n    position: absolute;\r\n    top: -5px;\r\n    width: calc(100% + 10px);\r\n    z-index: 1;\r\n  }\r\n\r\n  input {\r\n    background: #fff;\r\n    border: 1px solid #e5e5e5;\r\n    color: rgba(0, 0, 0, .54);\r\n    height: 41px;\r\n    outline: 0;\r\n    padding: 0 16px;\r\n    width: 100%;\r\n  }\r\n\r\n  button {\r\n    background: var(--composite-color);\r\n    border-radius: 0;\r\n    width: 100%;\r\n  }\r\n}\r\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 19 */
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
/* 20 */
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

var	fixUrls = __webpack_require__(/*! ./urls */ 21);

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
/* 21 */
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
/* 22 */,
/* 23 */
/*!***************************!*\
  !*** ./fonts/mapache.eot ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.eot";

/***/ }),
/* 24 */
/*!****************************************************************************************!*\
  !*** multi ./build/util/../helpers/hmr-client.js ./scripts/main.js ./styles/main.scss ***!
  \****************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Users\Smigol\Projects\ghost\content\themes\mapache\src\build\util/../helpers/hmr-client.js */2);
__webpack_require__(/*! ./scripts/main.js */25);
module.exports = __webpack_require__(/*! ./styles/main.scss */50);


/***/ }),
/* 25 */
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_theia_sticky_sidebar__ = __webpack_require__(/*! theia-sticky-sidebar */ 26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_theia_sticky_sidebar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_theia_sticky_sidebar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__autoload_transition_js__ = __webpack_require__(/*! ./autoload/transition.js */ 27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__autoload_transition_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__autoload_transition_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__autoload_zoom_js__ = __webpack_require__(/*! ./autoload/zoom.js */ 28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__autoload_zoom_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__autoload_zoom_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_main__ = __webpack_require__(/*! ./app/app.main */ 29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_Router__ = __webpack_require__(/*! ./util/Router */ 31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__routes_common__ = __webpack_require__(/*! ./routes/common */ 33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__routes_post__ = __webpack_require__(/*! ./routes/post */ 43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__routes_video__ = __webpack_require__(/*! ./routes/video */ 48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_app_pagination__ = __webpack_require__(/*! ./app/app.pagination */ 49);
// import external dependencies


// Import everything from autoload
 

// Impor main Script


// Pagination infinite scroll
// import './app/pagination';

// import local dependencies




// import isAudio from './routes/audio';



/** Populate Router instance with DOM routes */
var routes = new __WEBPACK_IMPORTED_MODULE_4__util_Router__["a" /* default */]({
  // All pages
  common: __WEBPACK_IMPORTED_MODULE_5__routes_common__["a" /* default */],

  // article
  isArticle: __WEBPACK_IMPORTED_MODULE_6__routes_post__["a" /* default */],

  // Pagination (home - tag - author) infinite scroll
  isPagination: __WEBPACK_IMPORTED_MODULE_8__app_app_pagination__["a" /* default */],

  // video post format
  isVideo: __WEBPACK_IMPORTED_MODULE_7__routes_video__["a" /* default */],

  // Audio post Format
  // isAudio,
});

// Load Events
jQuery(document).ready(function () { return routes.loadEvents(); });

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 26 */
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
/* 27 */
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
/* 28 */
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
/* 29 */
/*!*********************************!*\
  !*** ./scripts/app/app.main.js ***!
  \*********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_share__ = __webpack_require__(/*! ./app.share */ 30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_share___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__app_share__);
// Impornt


(function () {
  // Varibles
  var $body = $('body');

  // let loadGhostHunter = true;
  var didScroll = false;
  var lastScrollTop = 0; // eslint-disable-line
  var delta = 5;

  // Active Scroll
  $(window).on('scroll', function () { return didScroll = true; } );

  /* Menu open and close for mobile */
  $('.menu--toggle').on('click', function (e) {
    e.preventDefault();
    $body.toggleClass('is-showNavMob').removeClass('is-search');
  });

  /* Share article in Social media */
  $('.mapache-share').bind('click', function (e) {
    e.preventDefault();
    var share = new __WEBPACK_IMPORTED_MODULE_0__app_share___default.a($(this));
    share.share();
  });

  /* Toggle show more social media */
  $('.follow-toggle').on('click', function (e) {
    e.preventDefault();
    $body.toggleClass('is-showFollowMore');
  });

  /* Modal Open for susbscribe */
  $('.modal-toggle').on('click', function (e) {
    e.preventDefault();
    $body.toggleClass('has-modal');
  });

  /* scroll link width click (ID)*/
  $('.scrolltop').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top - 60 }, 500, 'linear');
  });

  /* Toggle card for search Search */
  $('.search-toggle').on('click', function (e) {
    e.preventDefault();
    $('body').toggleClass('is-search').removeClass('is-showNavMob');
  });

  // Open Post Comments
  $('.toggle-comments').on('click', function (e) {
    e.preventDefault();
    $('body').toggleClass('has-comments').removeClass('is-showNavMob')
  });

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

}());

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 30 */
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
/* 31 */
/*!********************************!*\
  !*** ./scripts/util/Router.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__camelCase__ = __webpack_require__(/*! ./camelCase */ 32);


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
/* 32 */
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
/* 33 */
/*!**********************************!*\
  !*** ./scripts/routes/common.js ***!
  \**********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_app_follow__ = __webpack_require__(/*! ../app/app.follow */ 34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_app_footer_links__ = __webpack_require__(/*! ../app/app.footer.links */ 35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_search__ = __webpack_require__(/*! ../app/search */ 36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_search___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__app_search__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_lazy_load__ = __webpack_require__(/*! ../app/app.lazy-load */ 17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_app_twitter__ = __webpack_require__(/*! ../app/app.twitter */ 42);


// import simplyGhostSearch from '../app/app.search';




// Varibles
var urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/; // eslint-disable-line

var mySearchSettings = {
  input: '#search-field',
  results: '#searchResults',
  on: {
    beforeFetch: function () {$('body').addClass('is-loading')},
    afterFetch: function () {setTimeout(function () {$('body').removeClass('is-loading')}, 4000)},
  },
}

/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // Change title HOME PAGE
    if (typeof homeTitle !== 'undefined') { $('#home-title').html(homeTitle); } // eslint-disable-line

    // change BTN ( Name - URL) in Home Page
    if (typeof homeBtnTitle !== 'undefined' && typeof homeBtnURL !== 'undefined') {
      $('#home-button').attr('href', homeBtnURL).html(homeBtnTitle); // eslint-disable-line
    }

    // Follow me
    if (typeof followSocialMedia !== 'undefined') { Object(__WEBPACK_IMPORTED_MODULE_0__app_app_follow__["a" /* default */])(followSocialMedia, urlRegexp); } // eslint-disable-line

    /* Footer Links */
    if (typeof footerLinks !== 'undefined') { Object(__WEBPACK_IMPORTED_MODULE_1__app_app_footer_links__["a" /* default */]) (footerLinks, urlRegexp); } // eslint-disable-line

    /* Lazy load for image */
    /* Lazy load for image */
    Object(__WEBPACK_IMPORTED_MODULE_3__app_app_lazy_load__["a" /* default */])();
    // $('.lazy-load-image').lazyload({effect : 'fadeIn'});
    // $('.lazy-load-image').lazyload({threshold : 200});
  }, // end Init

  finalize: function finalize() {
    /* sicky sidebar */
    $('.sidebar-sticky').theiaStickySidebar({
      additionalMarginTop: 70,
      minWidth: 970,
    });

    if (typeof searchSettings !== 'undefined') {
      Object.assign(mySearchSettings, searchSettings); // eslint-disable-line
    }

    // Search
    new __WEBPACK_IMPORTED_MODULE_2__app_search___default.a(mySearchSettings);

    // Twitter Widget
    if (typeof twitterUserName !== 'undefined' && typeof twitterNumber !== 'undefined') {
      Object(__WEBPACK_IMPORTED_MODULE_4__app_app_twitter__["a" /* default */])(twitterUserName, twitterNumber); // eslint-disable-line
    }

    // show comments count of disqus
    // if (typeof disqusShortName !== 'undefined') $('.mapache-disqus').removeClass('u-hide');

  }, //end => Finalize
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

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
/* 36 */
/*!*******************************!*\
  !*** ./scripts/app/search.js ***!
  \*******************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Thanks => https://github.com/HauntedThemes/ghost-search
 */

// import fuzzysort from 'fuzzysort';
var fuzzysort = __webpack_require__(/*! fuzzysort */ 37);

var GhostSearch = function GhostSearch(args) {

  this.check = false;

  var defaults = {
    input: '#ghost-search-field',
    results: '#ghost-search-results',
    button: '',
    development: false,
    template: function (result) {
      var url = [location.protocol, '//', location.host].join('');
      return '<a href="' + url + '/' + result.slug + '/">' + result.title + '</a>';
    },
    trigger: 'focus',
    options: {
      keys: [
        'title' ],
      limit: 10,
      threshold: -3500,
      allowTypo: false,
    },
    api: {
      resource: 'posts',
      parameters: {
        limit: 'all',
        fields: ['title', 'slug'],
        filter: '',
        include: '',
        order: '',
        formats: '',
      },
    },
    on: {
      beforeDisplay: function () { },
      afterDisplay: function (results) { },// eslint-disable-line
      beforeFetch: function () { },
      afterFetch: function (results) { },// eslint-disable-line
    },
  }

  var merged = this.mergeDeep(defaults, args);
  Object.assign(this, merged);
  this.init();

};

GhostSearch.prototype.mergeDeep = function mergeDeep (target, source) {
    var this$1 = this;

  if ((target && typeof target === 'object' && !Array.isArray(target) && target !== null) && (source && typeof source === 'object' && !Array.isArray(source) && source !== null)) {
    Object.keys(source).forEach(function (key) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
        if (!target[key]) { Object.assign(target, ( obj = {}, obj[key] = {}, obj ));
            var obj; }
        this$1.mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, ( obj$1 = {}, obj$1[key] = source[key], obj$1 ));
          var obj$1;
      }
    });
  }
  return target;
};

GhostSearch.prototype.url = function url () {

  if (this.api.resource == 'posts' && this.api.parameters.include.match(/(tags|authors)/)) {
    delete this.api.parameters.fields;
  }

  var url = ghost.url.api(this.api.resource, this.api.parameters); //eslint-disable-line

  return url;

};

GhostSearch.prototype.fetch = function fetch$1 () {
    var this$1 = this;


  var url = this.url();

  this.on.beforeFetch();

  fetch(url)
    .then(function (response) { return response.json(); })
    .then(function (resource) { return this$1.search(resource); })
    .catch(function (error) { return console.error("Fetch Error =\n", error); });

};

GhostSearch.prototype.createElementFromHTML = function createElementFromHTML (htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

GhostSearch.prototype.cleanup = function cleanup (input) {
  return input.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
};

GhostSearch.prototype.displayResults = function displayResults (data) {
    var this$1 = this;


  if (document.querySelectorAll(this.results)[0].firstChild !== null && document.querySelectorAll(this.results)[0].firstChild !== '') {
    while (document.querySelectorAll(this.results)[0].firstChild) {
      document.querySelectorAll(this$1.results)[0].removeChild(document.querySelectorAll(this$1.results)[0].firstChild);
    }
  }

  var inputValue = document.querySelectorAll(this.input)[0].value;
  var results = fuzzysort.go(inputValue, data, {
    keys: this.options.keys,
    limit: this.options.limit,
    allowTypo: this.options.allowTypo,
    threshold: this.options.threshold,
  });
  for (var key in results) {
    if (key < results.length) {
      document.querySelectorAll(this$1.results)[0].appendChild(this$1.createElementFromHTML(this$1.template(results[key].obj)));
    }
  }

  this.on.afterDisplay(results)

};

GhostSearch.prototype.search = function search (resource) {
    var this$1 = this;


  var data = resource[this.api.resource];

  this.on.afterFetch(data);
  this.check = true;

  if (this.button != '') {
    var button = document.querySelectorAll(this.button)[0];
    if (button.tagName == 'INPUT' && button.type == 'submit') {
      button.closest('form').addEventListener("submit", function (e) {
        e.preventDefault()
      });
    }
    button.addEventListener('click', function (e) {
      e.preventDefault()
      this$1.on.beforeDisplay()
      this$1.displayResults(data)
    })
  } else {
    document.querySelectorAll(this.input)[0].addEventListener('keyup', function () {
      this$1.on.beforeDisplay()
      this$1.displayResults(data)
    })
  }

};

GhostSearch.prototype.checkGhostAPI = function checkGhostAPI () {
  if (typeof ghost === 'undefined') {
    console.log('Ghost API is not enabled');
    return false;
  }
  return true;
};

GhostSearch.prototype.checkElements = function checkElements () {
  if (!document.querySelectorAll(this.input).length) {
    console.log('Input not found.');
    return false;
  }
  if (!document.querySelectorAll(this.results).length) {
    console.log('Results not found.');
    return false;
  }
  if (this.button != '') {
    if (!document.querySelectorAll(this.button).length) {
      console.log('Button not found.');
      return false;
    }
  }
  return true;
};

GhostSearch.prototype.checkFields = function checkFields () {
    var this$1 = this;


  var validFields = [];

  if (this.api.resource == 'posts') {
    validFields = ['amp', 'authors', 'codeinjection_foot', 'codeinjection_head', 'comment_id', 'created_at', 'created_by', 'custom_excerpt', 'custom_template', 'feature_image', 'featured', 'html', 'id', 'locale', 'meta_description', 'meta_title', 'mobiledoc', 'og_description', 'og_image', 'og_title', 'page', 'plaintext', 'primary_author', 'primary_tag', 'published_at', 'published_by', 'slug', 'status', 'tags', 'title', 'twitter_description', 'twitter_image', 'twitter_title', 'updated_at', 'updated_by', 'url', 'uuid', 'visibility'];
  } else if (this.api.resource == 'tags') {
    validFields = ['count', 'created_at', 'created_by', 'description', 'feature_image', 'id', 'meta_description', 'meta_title', 'name', 'parent', 'slug', 'updated_at', 'updated_by', 'visibility']
  } else if (this.api.resource == 'users') {
    validFields = ['accessibility', 'bio', 'count', 'cover_image', 'facebook', 'id', 'locale', 'location', 'meta_description', 'meta_title', 'name', 'profile_image', 'slug', 'tour', 'twitter', 'visibility', 'website']
  }

  for (var i = 0; i < this.api.parameters.fields.length; i++) {
    if (!validFields.includes(this$1.api.parameters.fields[i])) {
      console.log('\'' + this$1.api.parameters.fields[i] + '\' is not a valid field for ' + this$1.api.resource + '. Valid fields for ' + this$1.api.resource + ': [\'' + validFields.join('\', \'') + '\']');
    }
  }

};

GhostSearch.prototype.checkFormats = function checkFormats () {
    var this$1 = this;

  if (this.api.resource == 'posts' && (this.api.parameters.fields && typeof this.api.parameters.fields === 'object' && this.api.parameters.fields.constructor === Array)) {
    for (var i = 0; i < this.api.parameters.fields.length; i++) {
      if (
        !this$1.api.parameters.formats.includes(this$1.api.parameters.fields[i]) && this$1.api.parameters.fields[i].match(/(plaintext|mobiledoc|amp)/) ||
        (this$1.api.parameters.fields[i] == 'html' && this$1.api.parameters.formats.length > 0 && !this$1.api.parameters.formats.includes('html'))
      ) {
        console.log(this$1.api.parameters.fields[i] + ' is not included in the formats parameter.');
      }
    }
  }
};

GhostSearch.prototype.checkKeys = function checkKeys () {
    var this$1 = this;

  if (!this.options.keys.every(function (elem) { return this$1.api.parameters.fields.indexOf(elem) > -1; })) {
    console.log('Not all keys are in fields. Please add them.');
  }
};

GhostSearch.prototype.validate = function validate () {

  if (!this.checkGhostAPI() || !this.checkElements()) {
    return false;
  }

  if (this.development) {
    this.checkFields();
    this.checkFormats();
    this.checkKeys();
  }

  return true;

};

GhostSearch.prototype.init = function init () {
    var this$1 = this;


  if (!this.validate()) {
    return;
  }

  if (this.trigger == 'focus') {
    document.querySelectorAll(this.input)[0].addEventListener('focus', function () {
      if (!this$1.check) {
        this$1.fetch()
      }
    })
  } else if (this.trigger == 'load') {
    window.onload = function () {
      if (!this$1.check) {
        this$1.fetch()
      }
    }
  }

};

/* Export Class */
module.exports = GhostSearch;


/***/ }),
/* 37 */
/*!**********************************************!*\
  !*** ../node_modules/fuzzysort/fuzzysort.js ***!
  \**********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
WHAT: SublimeText-like Fuzzy Search

USAGE:
  fuzzysort.single('fs', 'Fuzzy Search') // {score: -16}
  fuzzysort.single('test', 'test') // {score: 0}
  fuzzysort.single('doesnt exist', 'target') // null

  fuzzysort.go('mr', ['Monitor.cpp', 'MeshRenderer.cpp'])
  // [{score: -18, target: "MeshRenderer.cpp"}, {score: -6009, target: "Monitor.cpp"}]

  fuzzysort.highlight(fuzzysort.single('fs', 'Fuzzy Search'), '<b>', '</b>')
  // <b>F</b>uzzy <b>S</b>earch
*/

// UMD (Universal Module Definition) for fuzzysort
;(function(root, UMD) {
  if(true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (UMD),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  else if(typeof module === 'object' && module.exports) module.exports = UMD()
  else root.fuzzysort = UMD()
})(this, function UMD() { function fuzzysortNew(instanceOptions) {

  var fuzzysort = {

    single: function(search, target, options) {
      if(!search) return null
      if(!isObj(search)) search = fuzzysort.getPreparedSearch(search)

      if(!target) return null
      if(!isObj(target)) target = fuzzysort.getPrepared(target)

      var allowTypo = options && options.allowTypo!==undefined ? options.allowTypo
        : instanceOptions && instanceOptions.allowTypo!==undefined ? instanceOptions.allowTypo
        : true
      var algorithm = allowTypo ? fuzzysort.algorithm : fuzzysort.algorithmNoTypo
      return algorithm(search, target, search[0])
      // var threshold = options && options.threshold || instanceOptions && instanceOptions.threshold || -9007199254740991
      // var result = algorithm(search, target, search[0])
      // if(result === null) return null
      // if(result.score < threshold) return null
      // return result
    },

    go: function(search, targets, options) {
      if(!search) return noResults
      search = fuzzysort.prepareSearch(search)
      var searchLowerCode = search[0]

      var threshold = options && options.threshold || instanceOptions && instanceOptions.threshold || -9007199254740991
      var limit = options && options.limit || instanceOptions && instanceOptions.limit || 9007199254740991
      var allowTypo = options && options.allowTypo!==undefined ? options.allowTypo
        : instanceOptions && instanceOptions.allowTypo!==undefined ? instanceOptions.allowTypo
        : true
      var algorithm = allowTypo ? fuzzysort.algorithm : fuzzysort.algorithmNoTypo
      var resultsLen = 0; var limitedCount = 0
      var targetsLen = targets.length

      // This code is copy/pasted 3 times for performance reasons [options.keys, options.key, no keys]

      // options.keys
      if(options && options.keys) {
        var scoreFn = options.scoreFn || defaultScoreFn
        var keys = options.keys
        var keysLen = keys.length
        for(var i = targetsLen - 1; i >= 0; --i) { var obj = targets[i]
          var objResults = new Array(keysLen)
          for (var keyI = keysLen - 1; keyI >= 0; --keyI) {
            var key = keys[keyI]
            var target = getValue(obj, key)
            if(!target) { objResults[keyI] = null; continue }
            if(!isObj(target)) target = fuzzysort.getPrepared(target)

            objResults[keyI] = algorithm(search, target, searchLowerCode)
          }
          objResults.obj = obj // before scoreFn so scoreFn can use it
          var score = scoreFn(objResults)
          if(score === null) continue
          if(score < threshold) continue
          objResults.score = score
          if(resultsLen < limit) { q.add(objResults); ++resultsLen }
          else {
            ++limitedCount
            if(score > q.peek().score) q.replaceTop(objResults)
          }
        }

      // options.key
      } else if(options && options.key) {
        var key = options.key
        for(var i = targetsLen - 1; i >= 0; --i) { var obj = targets[i]
          var target = getValue(obj, key)
          if(!target) continue
          if(!isObj(target)) target = fuzzysort.getPrepared(target)

          var result = algorithm(search, target, searchLowerCode)
          if(result === null) continue
          if(result.score < threshold) continue

          // have to clone result so duplicate targets from different obj can each reference the correct obj
          result = {target:result.target, _targetLowerCodes:null, _nextBeginningIndexes:null, score:result.score, indexes:result.indexes, obj:obj} // hidden

          if(resultsLen < limit) { q.add(result); ++resultsLen }
          else {
            ++limitedCount
            if(result.score > q.peek().score) q.replaceTop(result)
          }
        }

      // no keys
      } else {
        for(var i = targetsLen - 1; i >= 0; --i) { var target = targets[i]
          if(!target) continue
          if(!isObj(target)) target = fuzzysort.getPrepared(target)

          var result = algorithm(search, target, searchLowerCode)
          if(result === null) continue
          if(result.score < threshold) continue
          if(resultsLen < limit) { q.add(result); ++resultsLen }
          else {
            ++limitedCount
            if(result.score > q.peek().score) q.replaceTop(result)
          }
        }
      }

      if(resultsLen === 0) return noResults
      var results = new Array(resultsLen)
      for(var i = resultsLen - 1; i >= 0; --i) results[i] = q.poll()
      results.total = resultsLen + limitedCount
      return results
    },

    goAsync: function(search, targets, options) {
      var canceled = false
      var p = new Promise(function(resolve, reject) {
        if(!search) return resolve(noResults)
        search = fuzzysort.prepareSearch(search)
        var searchLowerCode = search[0]

        var q = fastpriorityqueue()
        var iCurrent = targets.length - 1
        var threshold = options && options.threshold || instanceOptions && instanceOptions.threshold || -9007199254740991
        var limit = options && options.limit || instanceOptions && instanceOptions.limit || 9007199254740991
        var allowTypo = options && options.allowTypo!==undefined ? options.allowTypo
          : instanceOptions && instanceOptions.allowTypo!==undefined ? instanceOptions.allowTypo
          : true
        var algorithm = allowTypo ? fuzzysort.algorithm : fuzzysort.algorithmNoTypo
        var resultsLen = 0; var limitedCount = 0
        function step() {
          if(canceled) return reject('canceled')

          var startMs = Date.now()

          // This code is copy/pasted 3 times for performance reasons [options.keys, options.key, no keys]

          // options.keys
          if(options && options.keys) {
            var scoreFn = options.scoreFn || defaultScoreFn
            var keys = options.keys
            var keysLen = keys.length
            for(; iCurrent >= 0; --iCurrent) { var obj = targets[iCurrent]
              var objResults = new Array(keysLen)
              for (var keyI = keysLen - 1; keyI >= 0; --keyI) {
                var key = keys[keyI]
                var target = getValue(obj, key)
                if(!target) { objResults[keyI] = null; continue }
                if(!isObj(target)) target = fuzzysort.getPrepared(target)

                objResults[keyI] = algorithm(search, target, searchLowerCode)
              }
              objResults.obj = obj // before scoreFn so scoreFn can use it
              var score = scoreFn(objResults)
              if(score === null) continue
              if(score < threshold) continue
              objResults.score = score
              if(resultsLen < limit) { q.add(objResults); ++resultsLen }
              else {
                ++limitedCount
                if(score > q.peek().score) q.replaceTop(objResults)
              }

              if(iCurrent%1000/*itemsPerCheck*/ === 0) {
                if(Date.now() - startMs >= 10/*asyncInterval*/) {
                  isNode?setImmediate(step):setTimeout(step)
                  return
                }
              }
            }

          // options.key
          } else if(options && options.key) {
            var key = options.key
            for(; iCurrent >= 0; --iCurrent) { var obj = targets[iCurrent]
              var target = getValue(obj, key)
              if(!target) continue
              if(!isObj(target)) target = fuzzysort.getPrepared(target)

              var result = algorithm(search, target, searchLowerCode)
              if(result === null) continue
              if(result.score < threshold) continue

              // have to clone result so duplicate targets from different obj can each reference the correct obj
              result = {target:result.target, _targetLowerCodes:null, _nextBeginningIndexes:null, score:result.score, indexes:result.indexes, obj:obj} // hidden

              if(resultsLen < limit) { q.add(result); ++resultsLen }
              else {
                ++limitedCount
                if(result.score > q.peek().score) q.replaceTop(result)
              }

              if(iCurrent%1000/*itemsPerCheck*/ === 0) {
                if(Date.now() - startMs >= 10/*asyncInterval*/) {
                  isNode?setImmediate(step):setTimeout(step)
                  return
                }
              }
            }

          // no keys
          } else {
            for(; iCurrent >= 0; --iCurrent) { var target = targets[iCurrent]
              if(!target) continue
              if(!isObj(target)) target = fuzzysort.getPrepared(target)

              var result = algorithm(search, target, searchLowerCode)
              if(result === null) continue
              if(result.score < threshold) continue
              if(resultsLen < limit) { q.add(result); ++resultsLen }
              else {
                ++limitedCount
                if(result.score > q.peek().score) q.replaceTop(result)
              }

              if(iCurrent%1000/*itemsPerCheck*/ === 0) {
                if(Date.now() - startMs >= 10/*asyncInterval*/) {
                  isNode?setImmediate(step):setTimeout(step)
                  return
                }
              }
            }
          }

          if(resultsLen === 0) return resolve(noResults)
          var results = new Array(resultsLen)
          for(var i = resultsLen - 1; i >= 0; --i) results[i] = q.poll()
          results.total = resultsLen + limitedCount
          resolve(results)
        }

        isNode?setImmediate(step):step()
      })
      p.cancel = function() { canceled = true }
      return p
    },

    highlight: function(result, hOpen, hClose) {
      if(result === null) return null
      if(hOpen === undefined) hOpen = '<b>'
      if(hClose === undefined) hClose = '</b>'
      var highlighted = ''
      var matchesIndex = 0
      var opened = false
      var target = result.target
      var targetLen = target.length
      var matchesBest = result.indexes
      for(var i = 0; i < targetLen; ++i) { var char = target[i]
        if(matchesBest[matchesIndex] === i) {
          ++matchesIndex
          if(!opened) { opened = true
            highlighted += hOpen
          }

          if(matchesIndex === matchesBest.length) {
            highlighted += char + hClose + target.substr(i+1)
            break
          }
        } else {
          if(opened) { opened = false
            highlighted += hClose
          }
        }
        highlighted += char
      }

      return highlighted
    },

    prepare: function(target) {
      if(!target) return
      return {target:target, _targetLowerCodes:fuzzysort.prepareLowerCodes(target), _nextBeginningIndexes:null, score:null, indexes:null, obj:null} // hidden
    },
    prepareSlow: function(target) {
      if(!target) return
      return {target:target, _targetLowerCodes:fuzzysort.prepareLowerCodes(target), _nextBeginningIndexes:fuzzysort.prepareNextBeginningIndexes(target), score:null, indexes:null, obj:null} // hidden
    },
    prepareSearch: function(search) {
      if(!search) return
      return fuzzysort.prepareLowerCodes(search)
    },



    // Below this point is only internal code
    // Below this point is only internal code
    // Below this point is only internal code
    // Below this point is only internal code



    getPrepared: function(target) {
      if(target.length > 999) return fuzzysort.prepare(target) // don't cache huge targets
      var targetPrepared = preparedCache.get(target)
      if(targetPrepared !== undefined) return targetPrepared
      targetPrepared = fuzzysort.prepare(target)
      preparedCache.set(target, targetPrepared)
      return targetPrepared
    },
    getPreparedSearch: function(search) {
      if(search.length > 999) return fuzzysort.prepareSearch(search) // don't cache huge searches
      var searchPrepared = preparedSearchCache.get(search)
      if(searchPrepared !== undefined) return searchPrepared
      searchPrepared = fuzzysort.prepareSearch(search)
      preparedSearchCache.set(search, searchPrepared)
      return searchPrepared
    },

    algorithm: function(searchLowerCodes, prepared, searchLowerCode) {
      var targetLowerCodes = prepared._targetLowerCodes
      var searchLen = searchLowerCodes.length
      var targetLen = targetLowerCodes.length
      var searchI = 0 // where we at
      var targetI = 0 // where you at
      var typoSimpleI = 0
      var matchesSimpleLen = 0

      // very basic fuzzy match; to remove non-matching targets ASAP!
      // walk through target. find sequential matches.
      // if all chars aren't found then exit
      for(;;) {
        var isMatch = searchLowerCode === targetLowerCodes[targetI]
        if(isMatch) {
          matchesSimple[matchesSimpleLen++] = targetI
          ++searchI; if(searchI === searchLen) break
          searchLowerCode = searchLowerCodes[typoSimpleI===0?searchI : (typoSimpleI===searchI?searchI+1 : (typoSimpleI===searchI-1?searchI-1 : searchI))]
        }

        ++targetI; if(targetI >= targetLen) { // Failed to find searchI
          // Check for typo or exit
          // we go as far as possible before trying to transpose
          // then we transpose backwards until we reach the beginning
          for(;;) {
            if(searchI <= 1) return null // not allowed to transpose first char
            if(typoSimpleI === 0) { // we haven't tried to transpose yet
              --searchI
              var searchLowerCodeNew = searchLowerCodes[searchI]
              if(searchLowerCode === searchLowerCodeNew) continue // doesn't make sense to transpose a repeat char
              typoSimpleI = searchI
            } else {
              if(typoSimpleI === 1) return null // reached the end of the line for transposing
              --typoSimpleI
              searchI = typoSimpleI
              searchLowerCode = searchLowerCodes[searchI + 1]
              var searchLowerCodeNew = searchLowerCodes[searchI]
              if(searchLowerCode === searchLowerCodeNew) continue // doesn't make sense to transpose a repeat char
            }
            matchesSimpleLen = searchI
            targetI = matchesSimple[matchesSimpleLen - 1] + 1
            break
          }
        }
      }

      var searchI = 0
      var typoStrictI = 0
      var successStrict = false
      var matchesStrictLen = 0

      var nextBeginningIndexes = prepared._nextBeginningIndexes
      if(nextBeginningIndexes === null) nextBeginningIndexes = prepared._nextBeginningIndexes = fuzzysort.prepareNextBeginningIndexes(prepared.target)
      var firstPossibleI = targetI = matchesSimple[0]===0 ? 0 : nextBeginningIndexes[matchesSimple[0]-1]

      // Our target string successfully matched all characters in sequence!
      // Let's try a more advanced and strict test to improve the score
      // only count it as a match if it's consecutive or a beginning character!
      if(targetI !== targetLen) for(;;) {
        if(targetI >= targetLen) {
          // We failed to find a good spot for this search char, go back to the previous search char and force it forward
          if(searchI <= 0) { // We failed to push chars forward for a better match
            // transpose, starting from the beginning
            ++typoStrictI; if(typoStrictI > searchLen-2) break
            if(searchLowerCodes[typoStrictI] === searchLowerCodes[typoStrictI+1]) continue // doesn't make sense to transpose a repeat char
            targetI = firstPossibleI
            continue
          }

          --searchI
          var lastMatch = matchesStrict[--matchesStrictLen]
          targetI = nextBeginningIndexes[lastMatch]

        } else {
          var isMatch = searchLowerCodes[typoStrictI===0?searchI : (typoStrictI===searchI?searchI+1 : (typoStrictI===searchI-1?searchI-1 : searchI))] === targetLowerCodes[targetI]
          if(isMatch) {
            matchesStrict[matchesStrictLen++] = targetI
            ++searchI; if(searchI === searchLen) { successStrict = true; break }
            ++targetI
          } else {
            targetI = nextBeginningIndexes[targetI]
          }
        }
      }

      { // tally up the score & keep track of matches for highlighting later
        if(successStrict) { var matchesBest = matchesStrict; var matchesBestLen = matchesStrictLen }
        else { var matchesBest = matchesSimple; var matchesBestLen = matchesSimpleLen }
        var score = 0
        var lastTargetI = -1
        for(var i = 0; i < searchLen; ++i) { var targetI = matchesBest[i]
          // score only goes down if they're not consecutive
          if(lastTargetI !== targetI - 1) score -= targetI
          lastTargetI = targetI
        }
        if(!successStrict) {
          score *= 1000
          if(typoSimpleI !== 0) score += -20/*typoPenalty*/
        } else {
          if(typoStrictI !== 0) score += -20/*typoPenalty*/
        }
        score -= targetLen - searchLen
        prepared.score = score
        prepared.indexes = new Array(matchesBestLen); for(var i = matchesBestLen - 1; i >= 0; --i) prepared.indexes[i] = matchesBest[i]

        return prepared
      }
    },

    algorithmNoTypo: function(searchLowerCodes, prepared, searchLowerCode) {
      var targetLowerCodes = prepared._targetLowerCodes
      var searchLen = searchLowerCodes.length
      var targetLen = targetLowerCodes.length
      var searchI = 0 // where we at
      var targetI = 0 // where you at
      var matchesSimpleLen = 0

      // very basic fuzzy match; to remove non-matching targets ASAP!
      // walk through target. find sequential matches.
      // if all chars aren't found then exit
      for(;;) {
        var isMatch = searchLowerCode === targetLowerCodes[targetI]
        if(isMatch) {
          matchesSimple[matchesSimpleLen++] = targetI
          ++searchI; if(searchI === searchLen) break
          searchLowerCode = searchLowerCodes[searchI]
        }
        ++targetI; if(targetI >= targetLen) return null // Failed to find searchI
      }

      var searchI = 0
      var successStrict = false
      var matchesStrictLen = 0

      var nextBeginningIndexes = prepared._nextBeginningIndexes
      if(nextBeginningIndexes === null) nextBeginningIndexes = prepared._nextBeginningIndexes = fuzzysort.prepareNextBeginningIndexes(prepared.target)
      var firstPossibleI = targetI = matchesSimple[0]===0 ? 0 : nextBeginningIndexes[matchesSimple[0]-1]

      // Our target string successfully matched all characters in sequence!
      // Let's try a more advanced and strict test to improve the score
      // only count it as a match if it's consecutive or a beginning character!
      if(targetI !== targetLen) for(;;) {
        if(targetI >= targetLen) {
          // We failed to find a good spot for this search char, go back to the previous search char and force it forward
          if(searchI <= 0) break // We failed to push chars forward for a better match

          --searchI
          var lastMatch = matchesStrict[--matchesStrictLen]
          targetI = nextBeginningIndexes[lastMatch]

        } else {
          var isMatch = searchLowerCodes[searchI] === targetLowerCodes[targetI]
          if(isMatch) {
            matchesStrict[matchesStrictLen++] = targetI
            ++searchI; if(searchI === searchLen) { successStrict = true; break }
            ++targetI
          } else {
            targetI = nextBeginningIndexes[targetI]
          }
        }
      }

      { // tally up the score & keep track of matches for highlighting later
        if(successStrict) { var matchesBest = matchesStrict; var matchesBestLen = matchesStrictLen }
        else { var matchesBest = matchesSimple; var matchesBestLen = matchesSimpleLen }
        var score = 0
        var lastTargetI = -1
        for(var i = 0; i < searchLen; ++i) { var targetI = matchesBest[i]
          // score only goes down if they're not consecutive
          if(lastTargetI !== targetI - 1) score -= targetI
          lastTargetI = targetI
        }
        if(!successStrict) score *= 1000
        score -= targetLen - searchLen
        prepared.score = score
        prepared.indexes = new Array(matchesBestLen); for(var i = matchesBestLen - 1; i >= 0; --i) prepared.indexes[i] = matchesBest[i]

        return prepared
      }
    },

    prepareLowerCodes: function(str) {
      var strLen = str.length
      var lowerCodes = [] // new Array(strLen)    sparse array is too slow
      var lower = str.toLowerCase()
      for(var i = 0; i < strLen; ++i) lowerCodes[i] = lower.charCodeAt(i)
      return lowerCodes
    },
    prepareBeginningIndexes: function(target) {
      var targetLen = target.length
      var beginningIndexes = []; var beginningIndexesLen = 0
      var wasUpper = false
      var wasAlphanum = false
      for(var i = 0; i < targetLen; ++i) {
        var targetCode = target.charCodeAt(i)
        var isUpper = targetCode>=65&&targetCode<=90
        var isAlphanum = isUpper || targetCode>=97&&targetCode<=122 || targetCode>=48&&targetCode<=57
        var isBeginning = isUpper && !wasUpper || !wasAlphanum || !isAlphanum
        wasUpper = isUpper
        wasAlphanum = isAlphanum
        if(isBeginning) beginningIndexes[beginningIndexesLen++] = i
      }
      return beginningIndexes
    },
    prepareNextBeginningIndexes: function(target) {
      var targetLen = target.length
      var beginningIndexes = fuzzysort.prepareBeginningIndexes(target)
      var nextBeginningIndexes = [] // new Array(targetLen)     sparse array is too slow
      var lastIsBeginning = beginningIndexes[0]
      var lastIsBeginningI = 0
      for(var i = 0; i < targetLen; ++i) {
        if(lastIsBeginning > i) {
          nextBeginningIndexes[i] = lastIsBeginning
        } else {
          lastIsBeginning = beginningIndexes[++lastIsBeginningI]
          nextBeginningIndexes[i] = lastIsBeginning===undefined ? targetLen : lastIsBeginning
        }
      }
      return nextBeginningIndexes
    },

    cleanup: cleanup,
    new: fuzzysortNew,
  }
  return fuzzysort
} // fuzzysortNew

// This stuff is outside fuzzysortNew, because it's shared with instances of fuzzysort.new()
var isNode = "function" !== 'undefined' && typeof window === 'undefined'
// var MAX_INT = Number.MAX_SAFE_INTEGER
// var MIN_INT = Number.MIN_VALUE
var preparedCache = new Map()
var preparedSearchCache = new Map()
var noResults = []; noResults.total = 0
var matchesSimple = []; var matchesStrict = []
function cleanup() { preparedCache.clear(); preparedSearchCache.clear(); matchesSimple = []; matchesStrict = [] }
function defaultScoreFn(a) {
  var max = -9007199254740991
  for (var i = a.length - 1; i >= 0; --i) {
    var result = a[i]; if(result === null) continue
    var score = result.score
    if(score > max) max = score
  }
  if(max === -9007199254740991) return null
  return max
}

// prop = 'key'              2.5ms optimized for this case, seems to be about as fast as direct obj[prop]
// prop = 'key1.key2'        10ms
// prop = ['key1', 'key2']   27ms
function getValue(obj, prop) {
  var tmp = obj[prop]; if(tmp !== undefined) return tmp
  var segs = prop
  if(!Array.isArray(prop)) segs = prop.split('.')
  var len = segs.length
  var i = -1
  while (obj && (++i < len)) obj = obj[segs[i]]
  return obj
}

function isObj(x) { return typeof x === 'object' } // faster as a function

// Hacked version of https://github.com/lemire/FastPriorityQueue.js
var fastpriorityqueue=function(){var r=[],o=0,e={};function n(){for(var e=0,n=r[e],c=1;c<o;){var f=c+1;e=c,f<o&&r[f].score<r[c].score&&(e=f),r[e-1>>1]=r[e],c=1+(e<<1)}for(var a=e-1>>1;e>0&&n.score<r[a].score;a=(e=a)-1>>1)r[e]=r[a];r[e]=n}return e.add=function(e){var n=o;r[o++]=e;for(var c=n-1>>1;n>0&&e.score<r[c].score;c=(n=c)-1>>1)r[n]=r[c];r[n]=e},e.poll=function(){if(0!==o){var e=r[0];return r[0]=r[--o],n(),e}},e.peek=function(e){if(0!==o)return r[0]},e.replaceTop=function(o){r[0]=o,n()},e};
var q = fastpriorityqueue() // reuse this, except for async, it needs to make its own

return fuzzysortNew()
}) // UMD

// TODO: (performance) wasm version!?

// TODO: (performance) layout memory in an optimal way to go fast by avoiding cache misses

// TODO: (performance) preparedCache is a memory leak

// TODO: (like sublime) backslash === forwardslash

// TODO: (performance) i have no idea how well optizmied the allowing typos algorithm is

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../timers-browserify/main.js */ 38).setImmediate))

/***/ }),
/* 38 */
/*!*************************************************!*\
  !*** ../node_modules/timers-browserify/main.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ 39);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 16)))

/***/ }),
/* 39 */
/*!****************************************************!*\
  !*** ../node_modules/setimmediate/setImmediate.js ***!
  \****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 16), __webpack_require__(/*! ./../process/browser.js */ 40)))

/***/ }),
/* 40 */
/*!******************************************!*\
  !*** ../node_modules/process/browser.js ***!
  \******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 41 */
/*!****************************************************************!*\
  !*** ../node_modules/vanilla-lazyload/dist/lazyload.es2015.js ***!
  \****************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var getDefaultSettings = () => ({
	elements_selector: "img",
	container: window,
	threshold: 300,
	throttle: 150,
	data_src: "src",
	data_srcset: "srcset",
	data_sizes: "sizes",
	data_bg: "bg",
	class_loading: "loading",
	class_loaded: "loaded",
	class_error: "error",
	class_initial: "initial",
	skip_invisible: true,
	callback_load: null,
	callback_error: null,
	callback_set: null,
	callback_enter: null,
	callback_finish: null,
	to_webp: false
});

const dataPrefix = "data-";
const processedDataName = "was-processed";
const processedDataValue = "true";

const getData = (element, attribute) => {
	return element.getAttribute(dataPrefix + attribute);
};

const setData = (element, attribute, value) => {
	var attrName = dataPrefix + attribute;
	if (value === null) {
		element.removeAttribute(attrName);
		return;
	}
	element.setAttribute(attrName, value);
};

const setWasProcessedData = element =>
	setData(element, processedDataName, processedDataValue);

const getWasProcessedData = element =>
	getData(element, processedDataName) === processedDataValue;

const purgeProcessedElements = elements => {
	return elements.filter(element => !getWasProcessedData(element));
};

const purgeOneElement = (elements, elementToPurge) => {
	return elements.filter(element => element !== elementToPurge);
};

const getTopOffset = function(element) {
	return (
		element.getBoundingClientRect().top +
		window.pageYOffset -
		element.ownerDocument.documentElement.clientTop
	);
};

const isBelowViewport = function(element, container, threshold) {
	const fold =
		container === window
			? window.innerHeight + window.pageYOffset
			: getTopOffset(container) + container.offsetHeight;
	return fold <= getTopOffset(element) - threshold;
};

const getLeftOffset = function(element) {
	return (
		element.getBoundingClientRect().left +
		window.pageXOffset -
		element.ownerDocument.documentElement.clientLeft
	);
};

const isAtRightOfViewport = function(element, container, threshold) {
	const documentWidth = window.innerWidth;
	const fold =
		container === window
			? documentWidth + window.pageXOffset
			: getLeftOffset(container) + documentWidth;
	return fold <= getLeftOffset(element) - threshold;
};

const isAboveViewport = function(element, container, threshold) {
	const fold =
		container === window ? window.pageYOffset : getTopOffset(container);
	return fold >= getTopOffset(element) + threshold + element.offsetHeight;
};

const isAtLeftOfViewport = function(element, container, threshold) {
	const fold =
		container === window ? window.pageXOffset : getLeftOffset(container);
	return fold >= getLeftOffset(element) + threshold + element.offsetWidth;
};

function isInsideViewport(element, container, threshold) {
	return (
		!isBelowViewport(element, container, threshold) &&
		!isAboveViewport(element, container, threshold) &&
		!isAtRightOfViewport(element, container, threshold) &&
		!isAtLeftOfViewport(element, container, threshold)
	);
}

/* Creates instance and notifies it through the window element */
const createInstance = function(classObj, options) {
	var event;
	let eventString = "LazyLoad::Initialized";
	let instance = new classObj(options);
	try {
		// Works in modern browsers
		event = new CustomEvent(eventString, { detail: { instance } });
	} catch (err) {
		// Works in Internet Explorer (all versions)
		event = document.createEvent("CustomEvent");
		event.initCustomEvent(eventString, false, false, { instance });
	}
	window.dispatchEvent(event);
};

/* Auto initialization of one or more instances of lazyload, depending on the 
    options passed in (plain object or an array) */
function autoInitialize(classObj, options) {
	if (!options) {
		return;
	}
	if (!options.length) {
		// Plain object
		createInstance(classObj, options);
	} else {
		// Array of objects
		for (let i = 0, optionsItem; (optionsItem = options[i]); i += 1) {
			createInstance(classObj, optionsItem);
		}
	}
}

const replaceExtToWebp = (value, condition) =>
	condition ? value.replace(/\.(jpe?g|png)/gi, ".webp") : value;

const detectWebp = () => {
	var webpString = "image/webp";
	var canvas = document.createElement("canvas");

	if (canvas.getContext && canvas.getContext("2d")) {
		return canvas.toDataURL(webpString).indexOf(`data:${webpString}`) === 0;
	}

	return false;
};

const runningOnBrowser = typeof window !== "undefined";

const isBot =
	(runningOnBrowser && !("onscroll" in window)) ||
	/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);
const supportsClassList =
	runningOnBrowser && "classList" in document.createElement("p");

const supportsWebp = runningOnBrowser && detectWebp();

const addClass = (element, className) => {
	if (supportsClassList) {
		element.classList.add(className);
		return;
	}
	element.className += (element.className ? " " : "") + className;
};

const removeClass = (element, className) => {
	if (supportsClassList) {
		element.classList.remove(className);
		return;
	}
	element.className = element.className.
		replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").
		replace(/^\s+/, "").
		replace(/\s+$/, "");
};

const setSourcesInChildren = function(
	parentTag,
	attrName,
	dataAttrName,
	toWebpFlag
) {
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			let attrValue = getData(childTag, dataAttrName);
			setAttributeIfValue(childTag, attrName, attrValue, toWebpFlag);
		}
	}
};

const setAttributeIfValue = function(
	element,
	attrName,
	value,
	toWebpFlag
) {
	if (!value) {
		return;
	}
	element.setAttribute(attrName, replaceExtToWebp(value, toWebpFlag));
};

const setSourcesImg = (element, settings) => {
	const toWebpFlag = supportsWebp && settings.to_webp;
	const srcsetDataName = settings.data_srcset;
	const parent = element.parentNode;

	if (parent && parent.tagName === "PICTURE") {
		setSourcesInChildren(parent, "srcset", srcsetDataName, toWebpFlag);
	}
	const sizesDataValue = getData(element, settings.data_sizes);
	setAttributeIfValue(element, "sizes", sizesDataValue);
	const srcsetDataValue = getData(element, srcsetDataName);
	setAttributeIfValue(element, "srcset", srcsetDataValue, toWebpFlag);
	const srcDataValue = getData(element, settings.data_src);
	setAttributeIfValue(element, "src", srcDataValue, toWebpFlag);
};

const setSourcesIframe = (element, settings) => {
	const srcDataValue = getData(element, settings.data_src);

	setAttributeIfValue(element, "src", srcDataValue);
};

const setSourcesVideo = (element, settings) => {
	const srcDataName = settings.data_src;
	const srcDataValue = getData(element, srcDataName);

	setSourcesInChildren(element, "src", srcDataName);
	setAttributeIfValue(element, "src", srcDataValue);
	element.load();
};

const setSourcesBgImage = (element, settings) => {
	const toWebpFlag = supportsWebp && settings.to_webp;
	const srcDataValue = getData(element, settings.data_src);
	const bgDataValue = getData(element, settings.data_bg);

	if (srcDataValue) {
		let setValue = replaceExtToWebp(srcDataValue, toWebpFlag);
		element.style.backgroundImage = `url("${setValue}")`;
	}

	if (bgDataValue) {
		let setValue = replaceExtToWebp(bgDataValue, toWebpFlag);
		element.style.backgroundImage = setValue;
	}
};

const setSourcesFunctions = {
	IMG: setSourcesImg,
	IFRAME: setSourcesIframe,
	VIDEO: setSourcesVideo
};

const setSources = (element, instance) => {
	const settings = instance._settings;
	const tagName = element.tagName;
	const setSourcesFunction = setSourcesFunctions[tagName];
	if (setSourcesFunction) {
		setSourcesFunction(element, settings);
		instance._updateLoadingCount(1);
		instance._elements = purgeOneElement(instance._elements, element);
		return;
	}
	setSourcesBgImage(element, settings);
};

const callbackIfSet = function(callback, argument) {
	if (callback) {
		callback(argument);
	}
};

const genericLoadEventName = "load";
const mediaLoadEventName = "loadeddata";
const errorEventName = "error";

const addEventListener = (element, eventName, handler) => {
	element.addEventListener(eventName, handler);
};

const removeEventListener = (element, eventName, handler) => {
	element.removeEventListener(eventName, handler);
};

const addAllEventListeners = (element, loadHandler, errorHandler) => {
	addEventListener(element, genericLoadEventName, loadHandler);
	addEventListener(element, mediaLoadEventName, loadHandler);
	addEventListener(element, errorEventName, errorHandler);
};

const removeAllEventListeners = (element, loadHandler, errorHandler) => {
	removeEventListener(element, genericLoadEventName, loadHandler);
	removeEventListener(element, mediaLoadEventName, loadHandler);
	removeEventListener(element, errorEventName, errorHandler);
};

const eventHandler = function(event, success, instance) {
	var settings = instance._settings;
	const className = success ? settings.class_loaded : settings.class_error;
	const callback = success ? settings.callback_load : settings.callback_error;
	const element = event.target;

	removeClass(element, settings.class_loading);
	addClass(element, className);
	callbackIfSet(callback, element);

	instance._updateLoadingCount(-1);
};

const addOneShotEventListeners = (element, instance) => {
	const loadHandler = event => {
		eventHandler(event, true, instance);
		removeAllEventListeners(element, loadHandler, errorHandler);
	};
	const errorHandler = event => {
		eventHandler(event, false, instance);
		removeAllEventListeners(element, loadHandler, errorHandler);
	};
	addAllEventListeners(element, loadHandler, errorHandler);
};

const managedTags = ["IMG", "IFRAME", "VIDEO"];

function revealElement(element, instance, force) {
	var settings = instance._settings;
	if (!force && getWasProcessedData(element)) {
		return; // element has already been processed and force wasn't true
	}
	callbackIfSet(settings.callback_enter, element);
	if (managedTags.indexOf(element.tagName) > -1) {
		addOneShotEventListeners(element, instance);
		addClass(element, settings.class_loading);
	}
	setSources(element, instance);
	setWasProcessedData(element);
	callbackIfSet(settings.callback_set, element);
}

const removeFromArray = (elements, indexes) => {
	while (indexes.length) {
		elements.splice(indexes.pop(), 1);
	}
};

/*
 * Constructor
 */

const LazyLoad = function(instanceSettings) {
	this._settings = Object.assign({}, getDefaultSettings(), instanceSettings);
	this._loadingCount = 0;
	this._queryOriginNode =
		this._settings.container === window
			? document
			: this._settings.container;

	this._previousLoopTime = 0;
	this._loopTimeout = null;
	this._boundHandleScroll = this.handleScroll.bind(this);

	this._isFirstLoop = true;
	window.addEventListener("resize", this._boundHandleScroll);
	this.update();
};

LazyLoad.prototype = {
	_loopThroughElements: function(forceDownload) {
		const settings = this._settings,
			elements = this._elements,
			elementsLength = !elements ? 0 : elements.length;
		let i,
			processedIndexes = [],
			isFirstLoop = this._isFirstLoop;

		if (isFirstLoop) {
			this._isFirstLoop = false;
		}

		if (elementsLength === 0) {
			this._stopScrollHandler();
			return;
		}

		for (i = 0; i < elementsLength; i++) {
			let element = elements[i];
			/* If must skip_invisible and element is invisible, skip it */
			if (settings.skip_invisible && element.offsetParent === null) {
				continue;
			}

			if (
				forceDownload ||
				isInsideViewport(
					element,
					settings.container,
					settings.threshold
				)
			) {
				if (isFirstLoop) {
					addClass(element, settings.class_initial);
				}
				this.load(element);
				processedIndexes.push(i);
			}
		}

		// Removing processed elements from this._elements.
		removeFromArray(elements, processedIndexes);
	},

	_startScrollHandler: function() {
		if (!this._isHandlingScroll) {
			this._isHandlingScroll = true;
			this._settings.container.addEventListener(
				"scroll",
				this._boundHandleScroll
			);
		}
	},

	_stopScrollHandler: function() {
		if (this._isHandlingScroll) {
			this._isHandlingScroll = false;
			this._settings.container.removeEventListener(
				"scroll",
				this._boundHandleScroll
			);
		}
	},

	_updateLoadingCount: function(plusMinus) {
		this._loadingCount += plusMinus;
		if (this._elements.length === 0 && this._loadingCount === 0) {
			callbackIfSet(this._settings.callback_finish);
		}
	},

	handleScroll: function() {
		const throttle = this._settings.throttle;

		if (throttle !== 0) {
			let now = Date.now();
			let remainingTime = throttle - (now - this._previousLoopTime);
			if (remainingTime <= 0 || remainingTime > throttle) {
				if (this._loopTimeout) {
					clearTimeout(this._loopTimeout);
					this._loopTimeout = null;
				}
				this._previousLoopTime = now;
				this._loopThroughElements();
			} else if (!this._loopTimeout) {
				this._loopTimeout = setTimeout(
					function() {
						this._previousLoopTime = Date.now();
						this._loopTimeout = null;
						this._loopThroughElements();
					}.bind(this),
					remainingTime
				);
			}
		} else {
			this._loopThroughElements();
		}
	},

	loadAll: function() {
		this._loopThroughElements(true);
	},

	update: function(elements) {
		const settings = this._settings;
		const nodeSet =
			elements ||
			this._queryOriginNode.querySelectorAll(settings.elements_selector);

		this._elements = purgeProcessedElements(
			Array.prototype.slice.call(nodeSet) // NOTE: nodeset to array for IE compatibility
		);

		if (isBot) {
			this.loadAll();
			return;
		}

		this._loopThroughElements();
		this._startScrollHandler();
	},

	destroy: function() {
		window.removeEventListener("resize", this._boundHandleScroll);
		if (this._loopTimeout) {
			clearTimeout(this._loopTimeout);
			this._loopTimeout = null;
		}
		this._stopScrollHandler();
		this._elements = null;
		this._queryOriginNode = null;
		this._settings = null;
	},

	load: function(element, force) {
		revealElement(element, this, force);
	}
};

/* Automatic instances creation if required (useful for async script loading) */
if (runningOnBrowser) {
	autoInitialize(LazyLoad, window.lazyLoadOptions);
}

/* harmony default export */ __webpack_exports__["a"] = (LazyLoad);


/***/ }),
/* 42 */
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
/* 43 */
/*!********************************!*\
  !*** ./scripts/routes/post.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prismjs__ = __webpack_require__(/*! prismjs */ 44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prismjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prismjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader__ = __webpack_require__(/*! prismjs/plugins/autoloader/prism-autoloader */ 45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prismjs_plugins_autoloader_prism_autoloader__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers__ = __webpack_require__(/*! prismjs/plugins/line-numbers/prism-line-numbers */ 46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_line_numbers_prism_line_numbers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_instagram__ = __webpack_require__(/*! ../app/app.instagram */ 47);
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

    // sticky share post in left
    $('.sharePost').theiaStickySidebar({
      additionalMarginTop: 120,
      minWidth: 970,
    });

    // Instagram Feed
    if (typeof instagramUserId !== 'undefined' && typeof instagramToken !== 'undefined' && typeof instagramUserName !== 'undefined') {
      var url = "https://api.instagram.com/v1/users/" + instagramUserId + "/media/recent/?access_token=" + instagramToken + "&count=10&callback=?"; // eslint-disable-line
      var user = "<a href=\"https://www.instagram.com/" + instagramUserName + "\" class=\"button button--large button--chromeless\" target=\"_blank\"><i class=\"i-instagram\"></i> " + instagramUserName + "</a>"; // eslint-disable-line

      Object(__WEBPACK_IMPORTED_MODULE_3__app_app_instagram__["a" /* default */])(url, user);
    }

    // Gallery
    var images = document.querySelectorAll('.kg-gallery-image img');

    images.forEach(function (image) {
        var container = image.closest('.kg-gallery-image');
        var width = image.attributes.width.value;
        var height = image.attributes.height.value;
        var ratio = width / height;
        container.style.flex = ratio + ' 1 0%';
    })

    /* Prism autoloader */
    __WEBPACK_IMPORTED_MODULE_0_prismjs___default.a.highlightAll();

    // Prism.plugins.autoloader.languages_path = `${$('body').attr('data-page')}/assets/scripts/components/`; // eslint-disable-line
  }, // end finalize
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 44 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 16)))

/***/ }),
/* 45 */
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
/* 46 */
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
/* 47 */
/*!**************************************!*\
  !*** ./scripts/app/app.instagram.js ***!
  \**************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_lazy_load__ = __webpack_require__(/*! ./app.lazy-load */ 17);
// user id => 1397790551
// token => 1397790551.1aa422d.37dca7d33ba34544941e111aa03e85c7
// user nname => GodoFredoNinja
// http://instagram.com/oauth/authorize/?client_id=YOURCLIENTIDHERE&redirect_uri=HTTP://YOURREDIRECTURLHERE.COM&response_type=token



/* Template for images */
var templateInstagram = function (data) {
  return ("<div class=\"instagram-col col s6 m4 l2\">\n    <a href=\"" + (data.link) + "\" class=\"instagram-img u-relative u-overflowHidden u-sizeFullWidth u-block\" target=\"_blank\">\n      <span class=\"u-absolute0 u-backgroundSizeCover u-backgroundColorGrayLight lazy-load-image\" data-src=\"" + (data.images.standard_resolution.url) + "\" style:\"z-index:2\"></span>\n      <div class=\"instagram-hover u-absolute0 u-flexColumn\" style=\"z-index:3\">\n        <div class=\"u-textAlignCenter u-fontWeightBold u-textColorWhite u-fontSize20\">\n          <span style=\"padding-right:10px\"><i class=\"i-favorite\"></i> " + (data.likes.count) + "</span>\n          <span style=\"padding-left:10px\"><i class=\"i-comments\"></i> " + (data.comments.count) + "</span>\n        </div>\n      </div>\n    </a>\n  </div>");
}

// Shuffle Array
var shuffleInstagram = function (arr) { return arr
  .map(function (a) { return [Math.random(), a]; })
  .sort(function (a, b) { return a[0] - b[0]; })
  .map(function (a) { return a[1]; }); };

// Display Instagram Images
var displayInstagram = function (res, user) {
  var shuffle = shuffleInstagram(res.data);
  var sf = shuffle.slice(0, 6);

  return sf.map(function (img) {
    var images = templateInstagram(img);
    $('.instagram').removeClass('u-hide');
    $('.instagram-wrap').append(images);
    $('.instagram-name').html(user);
  });
}

/* harmony default export */ __webpack_exports__["a"] = (function (url, user) {
  fetch(url)
  .then(function (response) { return response.json(); })
  .then(function (resource) { return displayInstagram(resource, user); })
  .then(function () { return Object(__WEBPACK_IMPORTED_MODULE_0__app_lazy_load__["a" /* default */])().update(); })
  .catch( function () { return $('.instagram').remove(); });
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 0)))

/***/ }),
/* 48 */
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
/* 49 */
/*!***************************************!*\
  !*** ./scripts/app/app.pagination.js ***!
  \***************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_app_lazy_load__ = __webpack_require__(/*! ../app/app.lazy-load */ 17);
/**
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
        // $('.lazy-load-image').lazyload({ threshold : 200 });
        Object(__WEBPACK_IMPORTED_MODULE_0__app_app_lazy_load__["a" /* default */])().update();
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
/* 50 */
/*!**************************!*\
  !*** ./styles/main.scss ***!
  \**************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 18);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ 20)(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 18, function() {
		var newContent = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./main.scss */ 18);

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
/* 51 */
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
/* 52 */
/*!***************************!*\
  !*** ./images/avatar.png ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJsAAACbCAMAAABCvxm+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCMERFNUY2MzE4Q0QxMUUzODE4RkFDREMyNzVDMjRDQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCMERFNUY2NDE4Q0QxMUUzODE4RkFDREMyNzVDMjRDQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkIwREU1RjYxMThDRDExRTM4MThGQUNEQzI3NUMyNENDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkIwREU1RjYyMThDRDExRTM4MThGQUNEQzI3NUMyNENDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+gkOp7wAAAjFQTFRFzN7oJCYo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"

/***/ }),
/* 53 */
/*!***************************!*\
  !*** ./fonts/mapache.ttf ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.ttf";

/***/ }),
/* 54 */
/*!****************************!*\
  !*** ./fonts/mapache.woff ***!
  \****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.woff";

/***/ }),
/* 55 */
/*!***************************!*\
  !*** ./fonts/mapache.svg ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/mapache.svg";

/***/ }),
/* 56 */
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
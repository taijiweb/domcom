/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
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
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "6dab0b9fc73cbc1437c7"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
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
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
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
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
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
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
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
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
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
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
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
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
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
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
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
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***************************!*\
  !*** ./demo/index.coffee ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	var accordion, case_, chooseFramework, demoCombo, demoEachPush, demoIfEach, demoMap, demoModelOnMultipleInput, demoTriangle, div, each, eachDemo1, eachDemo2, eachDemo3, eachDemo4, func, if_, list, makeDemoComponent, p, see, select, splitterDemo, _ref, _ref1, _ref2;

	select = dc.select, see = dc.see, if_ = dc.if_, case_ = dc.case_, list = dc.list, func = dc.func, each = dc.each, div = dc.div, p = dc.p;

	dc.directives({
	  $options: dc.$options,
	  $model: dc.$model
	});

	_ref = __webpack_require__(/*! ./demo-each */ 1), eachDemo1 = _ref.eachDemo1, eachDemo2 = _ref.eachDemo2, eachDemo3 = _ref.eachDemo3, eachDemo4 = _ref.eachDemo4;

	_ref1 = __webpack_require__(/*! ./demo-builtins */ 2), demoTriangle = _ref1.demoTriangle, demoCombo = _ref1.demoCombo, demoModelOnMultipleInput = _ref1.demoModelOnMultipleInput;

	splitterDemo = __webpack_require__(/*! ./demo-splitter */ 3);

	accordion = __webpack_require__(/*! ./demo-accordion */ 4);

	chooseFramework = __webpack_require__(/*! ./demo-choose-web-framework */ 5);

	_ref2 = __webpack_require__(/*! ./demo-debug */ 6), demoEachPush = _ref2.demoEachPush, demoIfEach = _ref2.demoIfEach, demoModelOnMultipleInput = _ref2.demoModelOnMultipleInput;

	exports.demoMap = demoMap = {
	  'choose web framework': chooseFramework(),
	  accordion: accordion(),
	  triangle: demoTriangle(),
	  combo: demoCombo(),
	  "show hide": __webpack_require__(/*! ./demo-show-hide */ 7)(),
	  counter: __webpack_require__(/*! ./demo-counter */ 8)(),
	  dialog: __webpack_require__(/*! ./demo-dialog */ 9)(),
	  event: __webpack_require__(/*! ./demo-event */ 10)(),
	  controls: __webpack_require__(/*! ./demo-controls */ 11)(),
	  "if": __webpack_require__(/*! ./demo-if-component */ 12)(),
	  each1: eachDemo1(),
	  each2: eachDemo2(),
	  each3: eachDemo3(),
	  each4: eachDemo4(),
	  'switch 1 2 3 4': __webpack_require__(/*! ./demo-switch-1-2-3-4 */ 13)(),
	  splitter: splitterDemo(),
	  sum: __webpack_require__(/*! ./demo-sum */ 14)(),
	  'text model': __webpack_require__(/*! ./demo-text-model */ 15)(),
	  'auto width edit': __webpack_require__(/*! ./demo-auto-width-edit */ 16)(),
	  'mount/unmount': __webpack_require__(/*! ./demo-mount-unmount */ 17)()
	};

	exports.makeDemoComponent = makeDemoComponent = function(demoMap, initItem) {
	  var currentItem, demoSelect, else_;
	  currentItem = see(initItem);
	  return list(demoSelect = select({
	    $options: [Object.keys(demoMap)],
	    $model: currentItem
	  }), div(case_(currentItem, demoMap, else_ = demoMap[initItem]).updateWhen(demoSelect, 'change')));
	};

	exports.runDemo = function(demoMap, initItem) {
	  var comp;
	  comp = makeDemoComponent(demoMap, initItem);
	  return comp.mount();
	};

	window.onload = function() {
	  return exports.runDemo(demoMap, 'choose web framework');
	};


/***/ },
/* 1 */
/*!*******************************!*\
  !*** ./demo/demo-each.coffee ***!
  \*******************************/
/***/ function(module, exports) {

	var each, list, p, txt;

	list = dc.list, each = dc.each, p = dc.p, txt = dc.txt;

	exports.eachDemo1 = function() {
	  var comp, lst1;
	  lst1 = [1, 2];
	  return comp = list(lst1);
	};

	exports.eachDemo2 = function() {
	  var comp, lst2;
	  lst2 = [1, 2];
	  return comp = each(lst2, function(item) {
	    return p(item);
	  });
	};

	exports.eachDemo3 = function() {
	  var comp, lst3;
	  lst3 = [1, 2, 3, 4, 5, 6];
	  comp = each(lst3, function(item) {
	    return p(item);
	  });
	  comp.on('beforeAttach', function() {
	    setTimeout((function() {
	      lst3.push(7);
	      return comp.update();
	    }), 1000);
	    return setTimeout((function() {
	      lst3.setLength(4);
	      return comp.update();
	    }), 2000);
	  });
	  return comp;
	};

	exports.eachDemo4 = function() {
	  var comp, lst4;
	  lst4 = [1, 2, 3, 4, 5, 6];
	  comp = each(lst4, function(item) {
	    return txt(item);
	  });
	  comp.on('beforeAttach', function() {
	    setTimeout((function() {
	      lst4.push(7);
	      return comp.update();
	    }), 1000);
	    return setTimeout((function() {
	      lst4.setLength(4);
	      return comp.update();
	    }), 2000);
	  });
	  return comp;
	};


/***/ },
/* 2 */
/*!***********************************!*\
  !*** ./demo/demo-builtins.coffee ***!
  \***********************************/
/***/ function(module, exports) {

	var div, duplex, hcombo, list, triangle, vcombo;

	duplex = dc.duplex, div = dc.div, triangle = dc.triangle, list = dc.list, hcombo = dc.hcombo, vcombo = dc.vcombo;

	exports.demoTriangle = function() {
	  return div({}, triangle({}, 'top', 10, 'blue'), triangle({}, 'bottom', 10, 'black'), triangle({}, 'left', 10, 'red'), triangle({}, 'right', 10, 'green'));
	};

	exports.demoCombo = function() {
	  var a, a_x$, combo1, combo2, comp;
	  a = {};
	  a_x$ = duplex(a, 'x');
	  combo1 = hcombo({
	    style: {
	      display: 'inline-block'
	    }
	  }, a_x$, 'a b'.split(' '));
	  combo2 = vcombo({
	    style: {
	      display: 'inline-block'
	    }
	  }, a_x$, 'a b'.split(' '));
	  comp = list(combo2, combo1);
	  combo1.on('update', function() {
	    return comp.update();
	  });
	  combo2.on('update', function() {
	    return comp.update();
	  });
	  return comp;
	};


/***/ },
/* 3 */
/*!***********************************!*\
  !*** ./demo/demo-splitter.coffee ***!
  \***********************************/
/***/ function(module, exports) {

	var div;

	div = dc.div;

	module.exports = function() {
	  var comp;
	  dc.directives({
	    $splitter: dc.$splitter
	  });
	  return comp = div({
	    $splitter: 'vertical',
	    style: {
	      height: '100%',
	      width: '100%'
	    }
	  }, div({
	    style: {
	      'background-color': "blue",
	      height: '50%',
	      width: '100%'
	    }
	  }, 1), div({
	    $splitter: 'horizontal',
	    style: {
	      'background-color': "grey",
	      height: '50%',
	      width: '100%'
	    }
	  }, div({
	    style: {
	      'background-color': "red",
	      display: 'inline-block',
	      height: '100%',
	      width: '40%'
	    }
	  }, 2), div({
	    style: {
	      'background-color': "green",
	      display: 'inline-block',
	      height: '100%',
	      width: '40%'
	    }
	  }, 3)));
	};


/***/ },
/* 4 */
/*!************************************!*\
  !*** ./demo/demo-accordion.coffee ***!
  \************************************/
/***/ function(module, exports) {

	var accordion, div, duplex, each, span;

	duplex = dc.duplex, accordion = dc.accordion, each = dc.each, div = dc.div, span = dc.span;

	module.exports = function() {
	  var accordionGroupList, comp, content, group, groupAttrs, groupOptions, groups;
	  groups = [
	    {
	      heading: 'group1',
	      items: 'a b c'.split(' ')
	    }, {
	      heading: 'group2',
	      items: 'd e f'.split(' ')
	    }, {
	      heading: 'group3',
	      items: 'x y z'.split(' ')
	    }
	  ];
	  accordionGroupList = (function() {
	    var _i, _len, _results;
	    _results = [];
	    for (_i = 0, _len = groups.length; _i < _len; _i++) {
	      group = groups[_i];
	      groupOptions = {
	        opened: group.opened,
	        disable: group.disable
	      };
	      groupAttrs = {};
	      content = each(group.items, function(item) {
	        return span({
	          style: {
	            margin: '5px'
	          },
	          onclick: function() {}
	        }, item);
	      });
	      _results.push([groupAttrs, group.heading, content, groupOptions]);
	    }
	    return _results;
	  })();
	  return comp = accordion({}, accordionGroupList, {
	    closeOthers: true
	  });
	};


/***/ },
/* 5 */
/*!***********************************************!*\
  !*** ./demo/demo-choose-web-framework.coffee ***!
  \***********************************************/
/***/ function(module, exports) {

	var case_, div, each, every, flow, func, label, list, see, text;

	flow = dc.flow, see = dc.see, case_ = dc.case_, each = dc.each, every = dc.every, func = dc.func, list = dc.list, div = dc.div, label = dc.label, text = dc.text;

	module.exports = function() {
	  var caseMap, choice, comp, firstLetter$, frameworks, item, items, prefered, prompt, _i, _len;
	  firstLetter$ = see('d', function(x) {
	    return x.toLowerCase();
	  });
	  comp = null;
	  prompt = label('Please choose: ');
	  prefered = text({
	    onchange: function() {
	      return comp.update();
	    }
	  }, firstLetter$);
	  frameworks = ['Domcom', 'jQuery', 'Angular', 'React', 'Backbone', 'Ember'];
	  items = every(frameworks, function(item) {
	    return div("" + item[0] + ". " + item);
	  });
	  caseMap = {};
	  for (_i = 0, _len = frameworks.length; _i < _len; _i++) {
	    item = frameworks[_i];
	    caseMap[item[0]] = item;
	  }
	  choice = case_(firstLetter$, caseMap, 'some other things');
	  return comp = list(prompt, prefered, items, div("You perfer ", choice, "."));
	};

	module.exports = function() {
	  var added, choice, comp, firstLetter$, frameworks, items, prefered, prompt, prompt2;
	  firstLetter$ = see('d', function(x) {
	    return x.toLowerCase();
	  });
	  comp = null;
	  prompt = label('Please choose: ');
	  prefered = text({
	    onchange: function() {
	      return comp.update();
	    }
	  }, firstLetter$);
	  frameworks = ['Domcom', 'jQuery', 'Angular', 'React', 'Backbone', 'Ember'];
	  items = each(frameworks, function(item) {
	    return div("" + item[0] + ". " + item);
	  });
	  prompt2 = label('add some others: ');
	  added = text({
	    onchange: function() {
	      var newFramework;
	      newFramework = this.value;
	      frameworks.push(newFramework);
	      firstLetter$(newFramework[0]);
	      return comp.update();
	    }
	  });
	  choice = func(flow(firstLetter$, function() {
	    var firstLetter, item, _i, _len;
	    firstLetter = firstLetter$();
	    for (_i = 0, _len = frameworks.length; _i < _len; _i++) {
	      item = frameworks[_i];
	      if (item[0].toLowerCase() === firstLetter) {
	        return item;
	      }
	    }
	    return 'some other things';
	  }));
	  return comp = list(prompt, prefered, prompt2, added, items, div("You perfer ", choice, "."));
	};


/***/ },
/* 6 */
/*!********************************!*\
  !*** ./demo/demo-debug.coffee ***!
  \********************************/
/***/ function(module, exports) {

	var div, duplex, each, if_, list, p, see, text;

	see = dc.see, if_ = dc.if_, list = dc.list, each = dc.each, div = dc.div, p = dc.p, text = dc.text, duplex = dc.duplex;

	exports.demoEachPush = function() {
	  var comp, lst;
	  lst = [1, 2];
	  comp = list(each(lst, function(item) {
	    return p(item);
	  }), 'some other thing');
	  comp.mount();
	  lst.push(3);
	  return comp.render();
	};

	exports.demoIfEach = function() {
	  var comp, lst4, showingEach$;
	  showingEach$ = see(true);
	  lst4 = [1, 2];
	  comp = if_(showingEach$, each(lst4, function(item) {
	    return div(item);
	  }));
	  comp.mount();
	  showingEach$(false);
	  comp.render();
	  showingEach$(true);
	  return comp.render();
	};

	exports.demoModelOnMultipleInput = function() {
	  var a, text1, text2;
	  a = {};
	  text1 = text({
	    $model: duplex(a, 'x')
	  });
	  text2 = text({
	    $model: duplex(a, 'x')
	  });
	  return list(text1, text2).updateWhen([text1, text2], 'change').mount();
	};


/***/ },
/* 7 */
/*!************************************!*\
  !*** ./demo/demo-show-hide.coffee ***!
  \************************************/
/***/ function(module, exports) {

	var div, flow, list, p, see, text, toggle;

	list = dc.list, text = dc.text, div = dc.div, p = dc.p, see = dc.see, flow = dc.flow;

	toggle = flow.toggle;

	module.exports = function() {
	  var comp, x;
	  x = see(true);
	  return comp = list(div({
	    onclick: function() {
	      toggle(x);
	      return comp.update();
	    }
	  }, 'show/hide by changing style.display'), p({
	    "class": {},
	    style: {
	      display: function() {
	        if (x()) {
	          return 'block';
	        } else {
	          return 'none';
	        }
	      }
	    }
	  }, 'asdfdfs'));
	};


/***/ },
/* 8 */
/*!**********************************!*\
  !*** ./demo/demo-counter.coffee ***!
  \**********************************/
/***/ function(module, exports) {

	var p, see, txt;

	txt = dc.txt, p = dc.p, see = dc.see;

	module.exports = function() {
	  var comp, counter, counter$, txt1;
	  counter$ = see(counter = 0);
	  comp = p(txt1 = txt(counter$));
	  comp.on('beforeAttach', function() {
	    var count, countHandle;
	    count = function() {
	      counter$(counter++);
	      if (counter === 1000) {
	        return clearInterval(countHandle);
	      }
	    };
	    return countHandle = setInterval(count, 1);
	  });
	  dc.updateWhen(setInterval, txt1, {
	    interval: 16,
	    clear: function() {
	      return counter >= 1000;
	    }
	  });
	  return comp;
	};


/***/ },
/* 9 */
/*!*********************************!*\
  !*** ./demo/demo-dialog.coffee ***!
  \*********************************/
/***/ function(module, exports) {

	var dialog, div, list;

	dialog = dc.dialog, list = dc.list, div = dc.div;

	module.exports = function() {
	  var dlg;
	  return dlg = dialog({
	    overlay: true,
	    showClose: true
	  }, div({
	    "class": 'message'
	  }, 'click to close me', div({
	    onclick: (function() {
	      return dlg.close();
	    })
	  }, 'OK')));
	};


/***/ },
/* 10 */
/*!********************************!*\
  !*** ./demo/demo-event.coffee ***!
  \********************************/
/***/ function(module, exports) {

	var a, checkbox, list, p, text;

	list = dc.list, a = dc.a, checkbox = dc.checkbox, text = dc.text, p = dc.p;

	module.exports = function() {
	  var noPropagation, propagation;
	  propagation = a({
	    onclick: function() {
	      return alert('parent');
	    }
	  }, p({
	    onclick: function(event) {
	      alert('child');
	      return event.continuePropagation = true;
	    }
	  }, 'propagation'));
	  noPropagation = a({
	    onclick: function() {
	      return alert('parent');
	    }
	  }, p({
	    onclick: function(event) {
	      return alert('child');
	    }
	  }, 'do not propagation'));
	  return list(propagation, noPropagation);
	};


/***/ },
/* 11 */
/*!***********************************!*\
  !*** ./demo/demo-controls.coffee ***!
  \***********************************/
/***/ function(module, exports) {

	var a, bindings, checkbox, list, p, text;

	list = dc.list, a = dc.a, checkbox = dc.checkbox, text = dc.text, p = dc.p, bindings = dc.bindings;

	module.exports = function() {
	  var a$, cbx1, cbx2, checkboxes, comp, text1, text2, texts;
	  a$ = bindings({
	    a: 1
	  }).a$;
	  checkboxes = list(cbx1 = checkbox(a$), cbx2 = checkbox(a$));
	  texts = list((text1 = text(a$)), (text2 = text(a$)));
	  a$(6);
	  comp = list(checkboxes, texts);
	  dc.updateWhen([cbx1, cbx2, text1, text2], 'change', comp);
	  return comp;
	};


/***/ },
/* 12 */
/*!***************************************!*\
  !*** ./demo/demo-if-component.coffee ***!
  \***************************************/
/***/ function(module, exports) {

	var div, if_, list, see, text;

	list = dc.list, if_ = dc.if_, text = dc.text, div = dc.div, see = dc.see;

	module.exports = function() {
	  var comp, x;
	  x = see(0, parseNumber);
	  return comp = list(text({
	    onchange: function() {
	      x = parseInt(this.value);
	      return comp.update();
	    }
	  }, x), if_(x, div(1), div(2)));
	};

	module.exports = function() {
	  var comp, x;
	  x = see(0, parseFloat);
	  return comp = list(text({
	    onchange: function() {
	      return comp.update();
	    }
	  }, x), if_(x, div('It is not 0.'), div('It is 0 or NaN.')));
	};


/***/ },
/* 13 */
/*!*****************************************!*\
  !*** ./demo/demo-switch-1-2-3-4.coffee ***!
  \*****************************************/
/***/ function(module, exports) {

	var div, each, flow, func, list, number, see;

	func = dc.func, see = dc.see, flow = dc.flow, each = dc.each, list = dc.list, div = dc.div, number = dc.number;

	module.exports = function() {
	  var comp, indexInput, lst, x;
	  x = 0;
	  comp = null;
	  indexInput = number({
	    onchange: function() {
	      x = parseInt(this.value);
	      return comp.update();
	    }
	  });
	  lst = each([0, 1, 2, 3], function(item) {
	    return div({
	      style: {
	        display: function() {
	          if (item === x) {
	            return 'block';
	          } else {
	            return 'none';
	          }
	        }
	      }
	    }, item);
	  });
	  return comp = list(indexInput, lst);
	};

	module.exports = function() {
	  var comp, indexInput, x;
	  x = 0;
	  comp = null;
	  indexInput = number({
	    onchange: function() {
	      x = parseInt(this.value);
	      return comp.update();
	    }
	  });
	  return comp = list(indexInput, func(function() {
	    if (x >= 0 && x <= 3) {
	      return div(x);
	    }
	  }));
	};

	module.exports = function() {
	  var num, x;
	  x = see(0);
	  return list(num = number(x), func(flow(x, function() {
	    var v;
	    v = x();
	    if (v >= 0 && v <= 3) {
	      return div(v);
	    }
	  })).updateWhen(num, 'change'));
	};


/***/ },
/* 14 */
/*!******************************!*\
  !*** ./demo/demo-sum.coffee ***!
  \******************************/
/***/ function(module, exports) {

	var demoSum, flow, list, p, see, text;

	see = dc.see, flow = dc.flow, list = dc.list, text = dc.text, p = dc.p;

	module.exports = demoSum = function() {
	  var a, b, comp, p1, t1, t2;
	  a = see(1, parseFloat);
	  b = see(2, parseFloat);
	  comp = list(t1 = text({
	    value: a,
	    onchange: function() {
	      return a(this.value);
	    }
	  }), t2 = text({
	    value: b,
	    onchange: function() {
	      return b(this.value);
	    }
	  }), p1 = p(flow.add(a, b)));
	  return dc.updateWhen([t1, t2], 'change', p1);
	};

	module.exports = demoSum = function() {
	  var a, b, comp, p1, t1, t2;
	  a = see(1);
	  b = see(2);
	  comp = list((t1 = text({
	    value: a,
	    onchange: (function() {
	      return a(this.value * 1);
	    })
	  })), (t2 = text({
	    value: b,
	    onchange: (function() {
	      return b(this.value * 1);
	    })
	  })), p1 = p(flow.add(a, b)));
	  return comp.updateWhen([t1, t2], 'change');
	};


/***/ },
/* 15 */
/*!*************************************!*\
  !*** ./demo/demo-text-model.coffee ***!
  \*************************************/
/***/ function(module, exports) {

	var a, bindings, checkbox, list, text;

	list = dc.list, bindings = dc.bindings, a = dc.a, checkbox = dc.checkbox, text = dc.text;

	module.exports = function() {
	  var a$, attrs, comp;
	  a$ = bindings({
	    a: 1
	  }).a$;
	  attrs = {
	    onchange: function() {
	      return comp.update();
	    }
	  };
	  return comp = list(a = text(attrs, a$), text(attrs, a$));
	};


/***/ },
/* 16 */
/*!******************************************!*\
  !*** ./demo/demo-auto-width-edit.coffee ***!
  \******************************************/
/***/ function(module, exports) {

	var autoWidthEdit;

	autoWidthEdit = dc.autoWidthEdit;

	module.exports = function() {
	  return autoWidthEdit();
	};


/***/ },
/* 17 */
/*!****************************************!*\
  !*** ./demo/demo-mount-unmount.coffee ***!
  \****************************************/
/***/ function(module, exports) {

	var div, if_, list, see;

	list = dc.list, div = dc.div, see = dc.see, if_ = dc.if_;

	module.exports = function() {
	  var active, comp, div1;
	  active = see(true);
	  return comp = list(div({
	    onclick: (function() {
	      active(true);
	      return comp.update();
	    })
	  }, 'mount'), div({
	    onclick: (function() {
	      active(false);
	      return comp.update();
	    })
	  }, 'unmount'), div1 = if_(active, div('toggle me')));
	};


/***/ }
/******/ ]);
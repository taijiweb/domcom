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
/******/ 	var hotCurrentHash = "a78a46a019f74d1f48be"; // eslint-disable-line no-unused-vars
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
/*!*********************************!*\
  !*** ./test/mocha/index.coffee ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! dc-util/test-util */ 4);

	__webpack_require__(/*! lazy-flow/test-flow */ 8);

	__webpack_require__(/*! lazy-flow-at/test-at */ 11);

	__webpack_require__(/*! ./test-property */ 13);

	__webpack_require__(/*! ./test-toString */ 14);

	__webpack_require__(/*! ./test-dc */ 15);

	__webpack_require__(/*! ./test-base-component */ 16);

	__webpack_require__(/*! ./test-component */ 18);

	__webpack_require__(/*! ./test-directive */ 1);

	__webpack_require__(/*! ./test-if-case-func */ 19);

	__webpack_require__(/*! ./test-list-each */ 20);

	__webpack_require__(/*! ./test-ref-clone */ 21);

	__webpack_require__(/*! ./test-accordion */ 22);

	__webpack_require__(/*! ./test-component-event */ 23);

	__webpack_require__(/*! ./test-route */ 24);

	__webpack_require__(/*! ./test-for-demo */ 25);


/***/ },
/* 1 */
/*!******************************************!*\
  !*** ./test/mocha/test-directive.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	
	/**test-directive
	 */
	var $hide, $show, $splitter, Component, a, a$, bindings, div, duplex, each, expect, func, idescribe, if_, iit, input, list, ndescribe, nit, p, see, select, span, text, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, each = dc.each, a = dc.a, div = dc.div, p = dc.p, span = dc.span, text = dc.text, select = dc.select, input = dc.input, $show = dc.$show, $hide = dc.$hide, $splitter = dc.$splitter, bindings = dc.bindings, duplex = dc.duplex, see = dc.see;

	dc.directives(dc.builtinDirectives);

	a$ = bindings({
	  a: 1
	}).a$;

	describe('directives', function() {
	  describe('model ', function() {
	    it('should process model  directive', function() {
	      var comp;
	      comp = text({
	        $model: a$
	      });
	      comp.mount();
	      comp.node.value = '2';
	      comp.node.onchange();
	      return expect(a$()).to.equal('2');
	    });
	    return it('should process event property of component with model directive', function() {
	      var comp, m, modelValue, x;
	      x = 0;
	      modelValue = duplex(m = {}, 'x');
	      comp = input({
	        $model: modelValue,
	        onmouseenter: function() {
	          return x = 1;
	        }
	      });
	      comp.mount();
	      comp.node.onmouseenter();
	      return expect(x).to.equal(1);
	    });
	  });
	  describe('$show', function() {
	    it('should process $show directive', function() {
	      var comp;
	      comp = div({
	        $show: true
	      });
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('block');
	    });
	    it('should process $show directive with non block display', function() {
	      var comp;
	      comp = div({
	        style: {
	          display: "inline"
	        },
	        $show: true
	      });
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('inline');
	    });
	    it('should process $show directive with false value', function() {
	      var comp;
	      comp = div({
	        $show: false
	      }, div(1));
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('none');
	    });
	    it('should process $show directive with function value', function() {
	      var comp, showing;
	      showing = see(true);
	      comp = div({
	        $show: showing
	      });
	      expect(comp.style.display.invalidate).to.be.defined;
	      comp.mount();
	      expect(comp.node.style.display).to.equal('block', 1);
	      showing(false);
	      expect(comp.hasActiveStyle).to.equal(true);
	      comp.update();
	      return expect(comp.node.style.display).to.equal('none', 2);
	    });
	    it('should process hide directive', function() {
	      var comp;
	      comp = div({
	        $hide: true
	      }, div(1));
	      comp.mount();
	      expect(comp.node.style.display).to.equal('none');
	      comp = div({
	        $hide: false
	      }, div(1));
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('block');
	    });
	    return it('should process show directive with true or false value', function() {
	      var comp;
	      comp = $show(false)(div(div(1)));
	      comp.mount();
	      expect(comp.node.style.display).to.equal('none');
	      comp = $show(true)(div(div(1)));
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('block');
	    });
	  });
	  ndescribe('select options', function() {
	    return it('should constructor select with options', function() {
	      var comp;
	      comp = select({
	        $options: [[1, 2]]
	      });
	      comp.mount();
	      expect(comp.node.innerHTML).to.match(/<option>1/);
	      return expect(comp.node.innerHTML).to.equal('<option>1</option><option>2</option>');
	    });
	  });
	  return describe('splitter', function() {
	    return it('should constructor splitter', function() {
	      var bounds, children, comp;
	      comp = $splitter('vertical')(div({
	        style: {
	          height: '800px',
	          width: '200px'
	        }
	      }, div(1), div(2)));
	      comp.mount();
	      bounds = comp.node.getBoundingClientRect();
	      expect(bounds.width > 0).to.equal(true);
	      expect(comp.node.innerHTML).to.match(/splitbar/);
	      children = comp.children;
	      expect(children[1].node.getBoundingClientRect().top).to.equal(comp.node.getBoundingClientRect().top);
	      children[1].node.onmousedown();
	      comp.node.onmousemove({
	        clientX: 20,
	        clientY: 30,
	        preventDefault: (function() {}),
	        stopPropagation: (function() {})
	      });
	      expect(children[1].node.getBoundingClientRect().top).to.equal(comp.node.getBoundingClientRect().top);
	      expect(children[1].node.style.top).to.equal('0px');
	      return comp.node;
	    });
	  });
	});


/***/ },
/* 2 */
/*!***********************************!*\
  !*** ../bdd-test-helper/index.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var chai;

	if (typeof window === 'undefined') {
	  chai = __webpack_require__(/*! chai */ 3);
	} else {
	  chai = window.chai;
	}

	exports.expect = chai.expect;

	exports.iit = it.only;

	exports.idescribe = describe.only;

	exports.nit = function() {};

	exports.ndescribe = function() {};


/***/ },
/* 3 */
/*!***********************!*\
  !*** external "chai" ***!
  \***********************/
/***/ function(module, exports) {

	module.exports = chai;

/***/ },
/* 4 */
/*!***********************************!*\
  !*** ../dc-util/test-util.coffee ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var binaryInsert, binarySearch, expect, idescribe, iit, ndescribe, nit, _ref, _ref1;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	_ref1 = __webpack_require__(/*! ./index */ 5), binarySearch = _ref1.binarySearch, binaryInsert = _ref1.binaryInsert;

	describe('util', function() {
	  describe('binarySearch', function() {
	    it('should binarySearch(0, [])', function() {
	      return expect(binarySearch(0, [])).to.deep.equal(0);
	    });
	    it('should binarySearch(0, [0])', function() {
	      return expect(binarySearch(0, [0])).to.deep.equal(0);
	    });
	    it('should binarySearch(0, [1])', function() {
	      return expect(binarySearch(0, [1])).to.deep.equal(0);
	    });
	    it('should binarySearch(1, [1 2])', function() {
	      return expect(binarySearch(1, [1, 2])).to.deep.equal(0);
	    });
	    it('should binarySearch(2, [1 2])', function() {
	      return expect(binarySearch(2, [1, 2])).to.deep.equal(1);
	    });
	    it('should binarySearch(2, [1 3])', function() {
	      return expect(binarySearch(2, [1, 3])).to.deep.equal(1);
	    });
	    it('should binarySearch(2, [1 2 3])', function() {
	      return expect(binarySearch(2, [1, 2, 3])).to.deep.equal(1);
	    });
	    it('should binarySearch(2, [1 2 3 4])', function() {
	      return expect(binarySearch(2, [1, 2, 3, 4])).to.deep.equal(1);
	    });
	    it('should binarySearch(2, [1 2 4 5])', function() {
	      return expect(binarySearch(3, [1, 2, 4, 5])).to.deep.equal(2);
	    });
	    it('should binarySearch(2, [1 2 4 5])', function() {
	      return expect(binarySearch(4, [1, 2, 4, 5])).to.deep.equal(2);
	    });
	    return it('should binarySearch(2, [1 2 4 5 6])', function() {
	      return expect(binarySearch(4, [1, 2, 4, 5, 6])).to.deep.equal(2);
	    });
	  });
	  return describe('binaryInsert', function() {
	    it('should binaryInsert(0, [])', function() {
	      var items;
	      binaryInsert(0, items = []);
	      return expect(items).to.deep.equal([0]);
	    });
	    it('should binaryInsert(0, [0])', function() {
	      var items;
	      binaryInsert(0, items = [0]);
	      return expect(items).to.deep.equal([0]);
	    });
	    it('should binaryInsert(0, [1])', function() {
	      var items;
	      binaryInsert(0, items = [1]);
	      return expect(items).to.deep.equal([0, 1]);
	    });
	    it('should binaryInsert(1, [1 2])', function() {
	      var items;
	      binaryInsert(1, items = [1, 2]);
	      return expect(items).to.deep.equal([1, 2]);
	    });
	    it('should binaryInsert(2, [1 2])', function() {
	      var items;
	      binaryInsert(2, items = [1, 2]);
	      return expect(items).to.deep.equal([1, 2]);
	    });
	    it('should binaryInsert(2, [1 3])', function() {
	      var items;
	      binaryInsert(2, items = [1, 3]);
	      return expect(items).to.deep.equal([1, 2, 3]);
	    });
	    it('should binaryInsert(2, [1 2 3])', function() {
	      var items;
	      binaryInsert(2, items = [1, 2, 3]);
	      return expect(items).to.deep.equal([1, 2, 3]);
	    });
	    it('should binaryInsert(2, [1 2 3 4])', function() {
	      var items;
	      binaryInsert(2, items = [1, 2, 3, 4]);
	      return expect(items).to.deep.equal([1, 2, 3, 4]);
	    });
	    it('should binaryInsert(2, [1 2 4 5])', function() {
	      var items;
	      binaryInsert(3, items = [1, 2, 4, 5]);
	      return expect(items).to.deep.equal([1, 2, 3, 4, 5]);
	    });
	    it('should binaryInsert(2, [1 2 4 5])', function() {
	      var items;
	      binaryInsert(4, items = [1, 2, 4, 5]);
	      return expect(items).to.deep.equal([1, 2, 4, 5]);
	    });
	    return it('should binaryInsert(2, [1 2 4 5 6])', function() {
	      var items;
	      binaryInsert(4, items = [1, 2, 4, 5, 6]);
	      return expect(items).to.deep.equal([1, 2, 4, 5, 6]);
	    });
	  });
	});


/***/ },
/* 5 */
/*!*******************************!*\
  !*** ../dc-util/index.coffee ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	var dupStr, globalDcid,
	  __slice = [].slice;

	exports.isArray = function(item) {
	  return Object.prototype.toString.call(item) === '[object Array]';
	};

	exports.cloneObject = function(obj) {
	  var key, result;
	  result = {};
	  for (key in obj) {
	    result[key] = obj[key];
	  }
	  return result;
	};

	exports.pairListDict = function() {
	  var i, keyValuePairs, len, result;
	  keyValuePairs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  if (keyValuePairs.length === 1) {
	    keyValuePairs = keyValuePairs[0];
	  }
	  len = keyValuePairs.length;
	  i = 0;
	  result = {};
	  while (i < len) {
	    result[keyValuePairs[i]] = keyValuePairs[i + 1];
	    i += 2;
	  }
	  return result;
	};

	dupStr = function(str, n) {
	  var i, s;
	  s = '';
	  i = 0;
	  while (i++ < n) {
	    s += str;
	  }
	  return s;
	};

	exports.newLine = function(str, indent, addNewLine) {
	  if (addNewLine) {
	    return '\n' + dupStr(' ', indent) + str;
	  } else {
	    return str;
	  }
	};

	exports.funcString = function(fn) {
	  var e, s;
	  if (typeof fn !== 'function') {
	    if (fn == null) {
	      return 'null';
	    }
	    if (fn.getBaseComponent) {
	      return fn.toString();
	    } else {
	      try {
	        return JSON.stringify(fn);
	      } catch (_error) {
	        e = _error;
	        return fn.toString();
	      }
	    }
	  }
	  s = fn.toString();
	  if (fn.invalidate) {
	    return s;
	  }
	  if (s.slice(0, 12) === "function (){") {
	    s = s.slice(12, s.length - 1);
	  } else if (s.slice(0, 13) === "function () {") {
	    s = s.slice(13, s.length - 1);
	  } else {
	    s = s.slice(9);
	  }
	  s = s.trim();
	  if (s.slice(0, 7) === 'return ') {
	    s = s.slice(7);
	  }
	  if (s[s.length - 1] === ';') {
	    s = s.slice(0, s.length - 1);
	  }
	  return 'fn:' + s;
	};

	globalDcid = 1;

	exports.newDcid = function() {
	  return globalDcid++;
	};

	exports.isEven = function(n) {
	  if (n < 0) {
	    n = -n;
	  }
	  while (n > 0) {
	    n -= 2;
	  }
	  return n === 0;
	};

	exports.matchCurvedString = function(str, i) {
	  var ch, level;
	  if (str[i] !== '(') {
	    return;
	  }
	  level = 0;
	  while (ch = str[++i]) {
	    if (ch === '\\') {
	      if (!(ch = str[++i])) {
	        return;
	      }
	    } else if (ch === '(') {
	      level++;
	    } else if (ch === ')') {
	      if (level === 0) {
	        return ++i;
	      } else {
	        level--;
	      }
	    }
	  }
	};

	exports.intersect = function(maps) {
	  var isMember, key, m, m2, result, _i, _len, _ref;
	  result = {};
	  m = maps[0];
	  for (key in m) {
	    isMember = true;
	    _ref = maps.slice(1);
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      m2 = _ref[_i];
	      if (!m2[key]) {
	        isMember = false;
	        break;
	      }
	    }
	    isMember && (result[key] = m[key]);
	  }
	  return result;
	};

	exports.substractSet = function(whole, part) {
	  var key;
	  for (key in part) {
	    delete whole[key];
	  }
	  return whole;
	};

	exports.binarySearch = function(item, items) {
	  var end, index, length, start;
	  length = items.length;
	  if (!length) {
	    return 0;
	  }
	  if (length === 1) {
	    if (items[0] >= item) {
	      return 0;
	    } else {
	      return 1;
	    }
	  }
	  start = 0;
	  end = length - 1;
	  while (1) {
	    index = start + Math.floor((end - start) / 2);
	    if (start === end) {
	      if (items[index] >= item) {
	        return index;
	      } else {
	        return index + 1;
	      }
	    } else if (item === items[index]) {
	      return index;
	    }
	    if (item === items[index + 1]) {
	      return index + 1;
	    } else if (item < items[index]) {
	      end = index;
	    } else if (item > items[index + 1]) {
	      start = index + 1;
	    } else {
	      return index + 1;
	    }
	  }
	};

	exports.binaryInsert = function(item, items) {
	  var end, index, length, start;
	  length = items.length;
	  if (!length) {
	    items[0] = item;
	    return 0;
	  }
	  if (length === 1) {
	    if (items[0] === item) {
	      return 0;
	    } else if (items[0] > item) {
	      items[1] = items[0];
	      items[0] = item;
	      return 0;
	    } else {
	      items[1] = item;
	      return 1;
	    }
	  }
	  start = 0;
	  end = length - 1;
	  while (1) {
	    index = start + Math.floor((end - start) / 2);
	    if (start === end) {
	      if (items[index] === item) {
	        return index;
	      } else if (items[index] > item) {
	        items.splice(index, 0, item);
	        return index;
	      } else {
	        items.splice(index + 1, 0, item);
	        return index + 1;
	      }
	    } else if (item === items[index]) {
	      return index;
	    }
	    if (item === items[index + 1]) {
	      return index + 1;
	    } else if (item < items[index]) {
	      end = index;
	    } else if (item > items[index + 1]) {
	      start = index + 1;
	    } else {
	      items.splice(index + 1, 0, item);
	      return index + 1;
	    }
	  }
	};

	exports.numbers = function(n) {
	  var flow, i, result;
	  flow = __webpack_require__(/*! lazy-flow */ 6);
	  if (typeof n === 'function') {
	    return flow(n, function() {
	      var i, length, result;
	      i = 0;
	      result = [];
	      length = n();
	      while (i < length) {
	        result.push(i);
	        i++;
	      }
	      return result;
	    });
	  } else {
	    i = 0;
	    result = [];
	    while (i < n) {
	      result.push(i);
	      i++;
	    }
	    return result;
	  }
	};


/***/ },
/* 6 */
/*!*****************************!*\
  !*** ../lazy-flow/index.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var dependent, flow, funcString, newLine, react, renew, see, _ref,
	  __slice = [].slice;

	_ref = __webpack_require__(/*! dc-util */ 7), newLine = _ref.newLine, funcString = _ref.funcString;

	react = function(method) {
	  if (method.invalidate) {
	    return method;
	  }
	  method.valid = false;
	  method.invalidateCallbacks = [];
	  method.onInvalidate = function(callback) {
	    var invalidateCallbacks;
	    if (typeof callback !== 'function') {
	      throw new Error("call back should be a function");
	    }
	    invalidateCallbacks = method.invalidateCallbacks || (method.invalidateCallbacks = []);
	    return invalidateCallbacks.push(callback);
	  };
	  method.offInvalidate = function(callback) {
	    var index, invalidateCallbacks;
	    invalidateCallbacks = method.invalidateCallbacks;
	    if (!invalidateCallbacks) {
	      return;
	    }
	    index = invalidateCallbacks.indexOf(callback);
	    if (index < 0) {
	      return;
	    }
	    invalidateCallbacks.splice(index, 1);
	    if (!invalidateCallbacks.length) {
	      return method.invalidateCallbacks = null;
	    }
	  };
	  method.invalidate = function() {
	    var callback, _i, _len, _ref1;
	    if (!method.valid) {
	      return;
	    }
	    if (!method.invalidateCallbacks) {
	      return;
	    }
	    _ref1 = method.invalidateCallbacks;
	    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	      callback = _ref1[_i];
	      callback();
	    }
	    method.valid = false;
	  };
	  return method;
	};

	renew = function(computation) {
	  var method;
	  method = function() {
	    var value;
	    if (!arguments.length) {
	      value = computation();
	      method.valid = true;
	      method.invalidate();
	      return value;
	    } else {
	      throw new Error('flow.renew is not allowed to accept arguments');
	    }
	  };
	  method.toString = function() {
	    return "renew: " + (funcString(computation));
	  };
	  return react(method);
	};

	dependent = function(computation) {
	  var cacheValue, method;
	  cacheValue = null;
	  method = function() {
	    if (!arguments.length) {
	      if (!method.valid) {
	        method.valid = true;
	        return cacheValue = computation();
	      } else {
	        return cacheValue;
	      }
	    } else {
	      throw new Error('flow.dependent is not allowed to accept arguments');
	    }
	  };
	  method.toString = function() {
	    return "dependent: " + (funcString(computation));
	  };
	  return react(method);
	};

	module.exports = flow = function() {
	  var cacheValue, computation, dep, deps, reactive, _i, _j, _k, _len, _len1;
	  deps = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), computation = arguments[_i++];
	  for (_j = 0, _len = deps.length; _j < _len; _j++) {
	    dep = deps[_j];
	    if (typeof dep === 'function' && !dep.invalidate) {
	      reactive = react(function() {
	        reactive.invalidate();
	        return computation();
	      });
	      return reactive;
	    }
	  }
	  cacheValue = null;
	  reactive = react(function(value) {
	    if (!arguments.length) {
	      if (!reactive.valid) {
	        reactive.valid = true;
	        return cacheValue = computation();
	      } else {
	        return cacheValue;
	      }
	    } else {
	      if (value === cacheValue) {
	        return value;
	      }
	      cacheValue = value;
	      computation(value);
	      reactive.invalidate();
	      return cacheValue;
	    }
	  });
	  for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
	    dep = deps[_k];
	    if (dep && dep.onInvalidate) {
	      dep.onInvalidate(reactive.invalidate);
	    }
	  }
	  reactive.toString = function() {
	    return "flow: [" + (((function() {
	      var _l, _len2, _results;
	      _results = [];
	      for (_l = 0, _len2 = deps.length; _l < _len2; _l++) {
	        dep = deps[_l];
	        _results.push(dep.toString());
	      }
	      return _results;
	    })()).join(',')) + "] --> " + (funcString(computation));
	  };
	  return reactive;
	};

	flow.pipe = function() {
	  var computation, dep, deps, reactive, _i, _j, _k, _len, _len1;
	  deps = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), computation = arguments[_i++];
	  for (_j = 0, _len = deps.length; _j < _len; _j++) {
	    dep = deps[_j];
	    if (typeof dep === 'function' && !dep.invalidate) {
	      reactive = react(function() {
	        var args, _k, _len1;
	        if (argumnets.length) {
	          throw new Error("flow.pipe is not allow to have arguments");
	        }
	        reactive.invalidate();
	        args = [];
	        for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
	          dep = deps[_k];
	          if (typeof dep === 'function') {
	            args.push(dep());
	          } else {
	            args.push(dep);
	          }
	        }
	        return computation.apply(null, args);
	      });
	      return reactive;
	    }
	  }
	  reactive = react(function() {
	    var args, _k, _len1;
	    args = [];
	    for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
	      dep = deps[_k];
	      if (typeof dep === 'function') {
	        args.push(dep());
	      } else {
	        args.push(dep);
	      }
	    }
	    return computation.apply(null, args);
	  });
	  for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
	    dep = deps[_k];
	    if (dep && dep.onInvalidate) {
	      dep.onInvalidate(reactive.invalidate);
	    }
	  }
	  return reactive;
	};

	flow.react = react;

	flow.renew = renew;

	flow.dependent = dependent;

	flow.flow = flow;

	flow.see = see = function(value, transform) {
	  var cacheValue, method;
	  cacheValue = value;
	  method = function(value) {
	    if (!arguments.length) {
	      method.valid = true;
	      return cacheValue;
	    } else {
	      value = transform ? transform(value) : value;
	      if (value !== cacheValue) {
	        cacheValue = value;
	        method.invalidate();
	      }
	      return value;
	    }
	  };
	  method.isDuplex = true;
	  method.toString = function() {
	    return "see: " + value;
	  };
	  return react(method);
	};

	flow.seeN = function() {
	  var computation, computations, _i, _len, _results;
	  computations = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  _results = [];
	  for (_i = 0, _len = computations.length; _i < _len; _i++) {
	    computation = computations[_i];
	    _results.push(see(computation));
	  }
	  return _results;
	};

	if (Object.defineProperty) {
	  flow.bind = function(obj, attr, debugName) {
	    var d, getter, set, setter;
	    d = Object.getOwnPropertyDescriptor(obj, attr);
	    if (d) {
	      getter = d.get;
	      set = d.set;
	    }
	    if (!getter || !getter.invalidate) {
	      getter = function() {
	        if (arguments.length) {
	          throw new Error('should not set value on flow.bind');
	        }
	        getter.valid = true;
	        return getter.cacheValue;
	      };
	      getter.cacheValue = obj[attr];
	      setter = function(value) {
	        if (value !== obj[attr]) {
	          if (set) {
	            set(value);
	          }
	          getter.invalidate();
	          return getter.cacheValue = value;
	        }
	      };
	      react(getter);
	      getter.toString = function() {
	        return "" + (debugName || 'm') + "[" + attr + "]";
	      };
	      Object.defineProperty(obj, attr, {
	        get: getter,
	        set: setter
	      });
	    }
	    return getter;
	  };
	  flow.duplex = function(obj, attr, debugName) {
	    var d, get, method, set;
	    d = Object.getOwnPropertyDescriptor(obj, attr);
	    if (d) {
	      get = d.get, set = d.set;
	    }
	    if (!set || !set.invalidate) {
	      method = function(value) {
	        if (!arguments.length) {
	          method.valid = true;
	          return method.cacheValue;
	        }
	        if (value !== obj[attr]) {
	          if (set) {
	            set(value);
	          }
	          get && get.invalidate && get.invalidate();
	          method.invalidate();
	          return method.cacheValue = value;
	        }
	      };
	      method.cacheValue = obj[attr];
	      react(method);
	      method.isDuplex = true;
	      method.toString = function() {
	        return "" + (debugName || 'm') + "[" + attr + "]";
	      };
	      Object.defineProperty(obj, attr, {
	        get: method,
	        set: method
	      });
	      return method;
	    } else {
	      return set;
	    }
	  };
	} else {
	  flow.bind = function(obj, attr, debugName) {
	    var method, _dcBindMethodMap;
	    _dcBindMethodMap = obj._dcBindMethodMap;
	    if (!_dcBindMethodMap) {
	      _dcBindMethodMap = obj._dcBindMethodMap = {};
	    }
	    if (!obj.dcSet$) {
	      obj.dcSet$ = function(attr, value) {
	        var _dcDuplexMethodMap;
	        if (value !== obj[attr]) {
	          _dcBindMethodMap && _dcBindMethodMap[attr] && _dcBindMethodMap[attr].invalidate();
	          return (_dcDuplexMethodMap = this._dcDuplexMethodMap) && _dcDuplexMethodMap[attr] && _dcDuplexMethodMap[attr].invalidate();
	        }
	      };
	    }
	    method = _dcBindMethodMap[attr];
	    if (!method) {
	      method = _dcBindMethodMap[attr] = function() {
	        method.valid = true;
	        return obj[attr];
	      };
	      method.toString = function() {
	        return "" + (debugName || 'm') + "[" + attr + "]";
	      };
	      react(method);
	    }
	    return method;
	  };
	  flow.duplex = function(obj, attr, debugName) {
	    var method, _dcDuplexMethodMap;
	    _dcDuplexMethodMap = obj._dcDuplexMethodMap;
	    if (!_dcDuplexMethodMap) {
	      _dcDuplexMethodMap = obj._dcDuplexMethodMap = {};
	    }
	    if (!obj.dcSet$) {
	      obj.dcSet$ = function(attr, value) {
	        var _dcBindMethodMap;
	        if (value !== obj[attr]) {
	          (_dcBindMethodMap = this._dcBindMethodMap) && _dcBindMethodMap[attr] && _dcBindMethodMap[attr].invalidate();
	          _dcDuplexMethodMap && _dcDuplexMethodMap[attr] && _dcDuplexMethodMap[attr].invalidate();
	        }
	        return value;
	      };
	    }
	    method = _dcDuplexMethodMap[attr];
	    if (!method) {
	      method = _dcDuplexMethodMap[attr] = function(value) {
	        if (!arguments.length) {
	          method.valid = true;
	          return obj[attr];
	        } else {
	          return obj.dcSet$(attr, value);
	        }
	      };
	      method.isDuplex = true;
	      method.toString = function() {
	        return "" + (debugName || 'm') + "[" + attr + "]";
	      };
	      react(method);
	    }
	    return method;
	  };
	}

	flow.unary = function(x, unaryFn) {
	  if (typeof x !== 'function') {
	    return unaryFn(x);
	  } else if (x.invalidate) {
	    return flow(x, function() {
	      return unaryFn(x());
	    });
	  } else {
	    return function() {
	      return unaryFn(x());
	    };
	  }
	};

	flow.binary = function(x, y, binaryFn) {
	  if (typeof x === 'function' && typeof y === 'function') {
	    if (x.invalidate && y.invalidate) {
	      return flow(x, y, function() {
	        return binaryFn(x(), y());
	      });
	    } else {
	      return function() {
	        return binaryFn(x(), y());
	      };
	    }
	  } else if (typeof x === 'function') {
	    if (x.invalidate) {
	      return flow(x, function() {
	        return binaryFn(x(), y);
	      });
	    } else {
	      return function() {
	        return binaryFn(x(), y);
	      };
	    }
	  } else if (typeof y === 'function') {
	    if (y.invalidate) {
	      return flow(y, function() {
	        return binaryFn(x, y());
	      });
	    } else {
	      return function() {
	        return binaryFn(x, y());
	      };
	    }
	  } else {
	    return binaryFn(x, y);
	  }
	};


/***/ },
/* 7 */
/*!***************************!*\
  !*** ../dc-util/index.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	var dupStr, globalDcid,
	  __slice = [].slice;

	exports.isArray = function(item) {
	  return Object.prototype.toString.call(item) === '[object Array]';
	};

	exports.cloneObject = function(obj) {
	  var key, result;
	  result = {};
	  for (key in obj) {
	    result[key] = obj[key];
	  }
	  return result;
	};

	exports.pairListDict = function() {
	  var i, keyValuePairs, len, result;
	  keyValuePairs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  if (keyValuePairs.length === 1) {
	    keyValuePairs = keyValuePairs[0];
	  }
	  len = keyValuePairs.length;
	  i = 0;
	  result = {};
	  while (i < len) {
	    result[keyValuePairs[i]] = keyValuePairs[i + 1];
	    i += 2;
	  }
	  return result;
	};

	dupStr = function(str, n) {
	  var i, s;
	  s = '';
	  i = 0;
	  while (i++ < n) {
	    s += str;
	  }
	  return s;
	};

	exports.newLine = function(str, indent, addNewLine) {
	  if (addNewLine) {
	    return '\n' + dupStr(' ', indent) + str;
	  } else {
	    return str;
	  }
	};

	exports.funcString = function(fn) {
	  var e, s;
	  if (typeof fn !== 'function') {
	    if (fn == null) {
	      return 'null';
	    }
	    if (fn.getBaseComponent) {
	      return fn.toString();
	    } else {
	      try {
	        return JSON.stringify(fn);
	      } catch (_error) {
	        e = _error;
	        return fn.toString();
	      }
	    }
	  }
	  s = fn.toString();
	  if (fn.invalidate) {
	    return s;
	  }
	  if (s.slice(0, 12) === "function (){") {
	    s = s.slice(12, s.length - 1);
	  } else if (s.slice(0, 13) === "function () {") {
	    s = s.slice(13, s.length - 1);
	  } else {
	    s = s.slice(9);
	  }
	  s = s.trim();
	  if (s.slice(0, 7) === 'return ') {
	    s = s.slice(7);
	  }
	  if (s[s.length - 1] === ';') {
	    s = s.slice(0, s.length - 1);
	  }
	  return 'fn:' + s;
	};

	globalDcid = 1;

	exports.newDcid = function() {
	  return globalDcid++;
	};

	exports.isEven = function(n) {
	  if (n < 0) {
	    n = -n;
	  }
	  while (n > 0) {
	    n -= 2;
	  }
	  return n === 0;
	};

	exports.matchCurvedString = function(str, i) {
	  var ch, level;
	  if (str[i] !== '(') {
	    return;
	  }
	  level = 0;
	  while (ch = str[++i]) {
	    if (ch === '\\') {
	      if (!(ch = str[++i])) {
	        return;
	      }
	    } else if (ch === '(') {
	      level++;
	    } else if (ch === ')') {
	      if (level === 0) {
	        return ++i;
	      } else {
	        level--;
	      }
	    }
	  }
	};

	exports.intersect = function(maps) {
	  var isMember, key, m, m2, result, _i, _len, _ref;
	  result = {};
	  m = maps[0];
	  for (key in m) {
	    isMember = true;
	    _ref = maps.slice(1);
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      m2 = _ref[_i];
	      if (!m2[key]) {
	        isMember = false;
	        break;
	      }
	    }
	    isMember && (result[key] = m[key]);
	  }
	  return result;
	};

	exports.substractSet = function(whole, part) {
	  var key;
	  for (key in part) {
	    delete whole[key];
	  }
	  return whole;
	};

	exports.binarySearch = function(item, items) {
	  var end, index, length, start;
	  length = items.length;
	  if (!length) {
	    return 0;
	  }
	  if (length === 1) {
	    if (items[0] >= item) {
	      return 0;
	    } else {
	      return 1;
	    }
	  }
	  start = 0;
	  end = length - 1;
	  while (1) {
	    index = start + Math.floor((end - start) / 2);
	    if (start === end) {
	      if (items[index] >= item) {
	        return index;
	      } else {
	        return index + 1;
	      }
	    } else if (item === items[index]) {
	      return index;
	    }
	    if (item === items[index + 1]) {
	      return index + 1;
	    } else if (item < items[index]) {
	      end = index;
	    } else if (item > items[index + 1]) {
	      start = index + 1;
	    } else {
	      return index + 1;
	    }
	  }
	};

	exports.binaryInsert = function(item, items) {
	  var end, index, length, start;
	  length = items.length;
	  if (!length) {
	    items[0] = item;
	    return 0;
	  }
	  if (length === 1) {
	    if (items[0] === item) {
	      return 0;
	    } else if (items[0] > item) {
	      items[1] = items[0];
	      items[0] = item;
	      return 0;
	    } else {
	      items[1] = item;
	      return 1;
	    }
	  }
	  start = 0;
	  end = length - 1;
	  while (1) {
	    index = start + Math.floor((end - start) / 2);
	    if (start === end) {
	      if (items[index] === item) {
	        return index;
	      } else if (items[index] > item) {
	        items.splice(index, 0, item);
	        return index;
	      } else {
	        items.splice(index + 1, 0, item);
	        return index + 1;
	      }
	    } else if (item === items[index]) {
	      return index;
	    }
	    if (item === items[index + 1]) {
	      return index + 1;
	    } else if (item < items[index]) {
	      end = index;
	    } else if (item > items[index + 1]) {
	      start = index + 1;
	    } else {
	      items.splice(index + 1, 0, item);
	      return index + 1;
	    }
	  }
	};

	exports.numbers = function(n) {
	  var flow, i, result;
	  flow = __webpack_require__(/*! lazy-flow */ 6);
	  if (typeof n === 'function') {
	    return flow(n, function() {
	      var i, length, result;
	      i = 0;
	      result = [];
	      length = n();
	      while (i < length) {
	        result.push(i);
	        i++;
	      }
	      return result;
	    });
	  } else {
	    i = 0;
	    result = [];
	    while (i < n) {
	      result.push(i);
	      i++;
	    }
	    return result;
	  }
	};


/***/ },
/* 8 */
/*!*************************************!*\
  !*** ../lazy-flow/test-flow.coffee ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var bind, bindings, duplex, expect, flow, idescribe, iit, ndescribe, nit, renew, see, seeAttrs, _ref, _ref1, _ref2;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	_ref1 = __webpack_require__(/*! ./index */ 9), see = _ref1.see, bind = _ref1.bind, duplex = _ref1.duplex, renew = _ref1.renew, flow = _ref1.flow;

	_ref2 = __webpack_require__(/*! ./addon */ 10), bindings = _ref2.bindings, seeAttrs = _ref2.seeAttrs;

	describe('reactive flow', function() {
	  it('should see', function() {
	    var r;
	    r = see(1);
	    expect(r()).to.equal(1);
	    expect(r(2)).to.equal(2);
	    return expect(r()).to.equal(2);
	  });
	  it('should renew', function() {
	    var r, x;
	    x = 1;
	    r = renew((function() {
	      return x;
	    }), true);
	    expect(r()).to.equal(1);
	    expect(function() {
	      return r(2);
	    }).to["throw"]();
	    x = 2;
	    return expect(r()).to.equal(2);
	  });
	  it('should flow', function() {
	    var r1, r2, r3;
	    r1 = see(1);
	    r2 = see(2);
	    r3 = flow(r1, r2, function() {
	      return r1() + r2();
	    });
	    expect(r3()).to.equal(3);
	    r1(2);
	    return expect(r3()).to.equal(4);
	  });
	  it('should flow unary', function() {
	    var a_, b_, r, _ref3;
	    _ref3 = bindings({
	      a: 4,
	      b: 2
	    }), a_ = _ref3.a_, b_ = _ref3.b_;
	    r = flow.neg(a_);
	    expect(r()).to.equal(-4, 'neg');
	    r = flow.no(a_);
	    expect(r()).to.equal(false, 'not');
	    r = flow.abs(flow.neg(a_));
	    expect(r()).to.equal(4, 'abs neg');
	    r = flow.bitnot(a_);
	    return expect(r()).to.equal(-5, 'bitnot');
	  });
	  it('should flow binary', function() {
	    var a_, b_, r, _ref3;
	    _ref3 = bindings({
	      a: 4,
	      b: 2
	    }), a_ = _ref3.a_, b_ = _ref3.b_;
	    r = flow.add(a_, b_);
	    expect(r()).to.equal(6, 'add');
	    r = flow.sub(a_, b_);
	    expect(r()).to.equal(2, 'sub');
	    r = flow.mul(a_, b_);
	    expect(r()).to.equal(8, 'mul');
	    r = flow.div(a_, b_);
	    return expect(r()).to.equal(2, 'div');
	  });
	  it('should invalidate flow binary', function() {
	    var a, b, r;
	    a = see(1);
	    b = see(2);
	    r = flow.add(a, b);
	    expect(r()).to.equal(3, 'add');
	    a(3);
	    return expect(r()).to.equal(5, 'add 2');
	  });
	  it('should invalidate bind flow binary', function() {
	    var a, b, m, r;
	    m = {
	      a: 1,
	      b: 2
	    };
	    a = bind(m, 'a', 'm');
	    b = bind(m, 'b', 'm');
	    r = flow.add(a, b);
	    expect(r()).to.equal(3, 'add');
	    expect(function() {
	      return a(3);
	    }).to["throw"]();
	    return expect(r()).to.equal(3, 'add 2');
	  });
	  it('should bind', function() {
	    var a, a2, m;
	    m = {
	      a: 1
	    };
	    a = bind(m, 'a');
	    a2 = bind(m, 'a');
	    expect(a()).to.equal(1);
	    expect(a2()).to.equal(1, 'a2');
	    expect(function() {
	      return a(3);
	    }).to["throw"]();
	    expect(a()).to.equal(1, 'a again');
	    return expect(a2()).to.equal(1, 'a2 again');
	  });
	  it('should process bindings', function() {
	    var a$, a_, _ref3;
	    _ref3 = bindings({
	      a: 1
	    }), a$ = _ref3.a$, a_ = _ref3.a_;
	    a$(3);
	    return expect(a_()).to.equal(3);
	  });
	  it('should process multiple bind and duplex on same object and attr', function() {
	    var a1, a2, b1, b2, m, sum;
	    m = {
	      a: 1,
	      b: 2
	    };
	    a1 = duplex(m, 'a');
	    b1 = duplex(m, 'b');
	    a2 = duplex(m, 'a');
	    b2 = duplex(m, 'b');
	    sum = flow.add(a1, b1);
	    expect(sum()).to.equal(3, 'sum 1');
	    expect(sum.valid).to.equal(true, 'valid 1');
	    a2(3);
	    expect(sum.valid).to.equal(false, 'valid 2');
	    expect(sum()).to.equal(5, 'sum 2');
	    sum = flow.add(a2, b2);
	    expect(sum()).to.equal(5, 'sum 3');
	    expect(sum.valid).to.equal(true, 'valid 3');
	    a2(1);
	    expect(sum.valid).to.equal(false, 'valid 4');
	    return expect(sum()).to.equal(3, 'sum 4');
	  });
	  return it('should seeAttrs', function() {
	    var a, b;
	    a = {};
	    b = {
	      x: 1
	    };
	    seeAttrs(a, b);
	    expect(typeof a.x).to.equal('function');
	    expect(a.x()).to.equal(1);
	    b = {
	      x: 2
	    };
	    seeAttrs(a, b);
	    expect(typeof a.x).to.equal('function');
	    return expect(a.x()).to.equal(2);
	  });
	});


/***/ },
/* 9 */
/*!*********************************!*\
  !*** ../lazy-flow/index.coffee ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var dependent, flow, funcString, newLine, react, renew, see, _ref,
	  __slice = [].slice;

	_ref = __webpack_require__(/*! dc-util */ 7), newLine = _ref.newLine, funcString = _ref.funcString;

	react = function(method) {
	  if (method.invalidate) {
	    return method;
	  }
	  method.valid = false;
	  method.invalidateCallbacks = [];
	  method.onInvalidate = function(callback) {
	    var invalidateCallbacks;
	    if (typeof callback !== 'function') {
	      throw new Error("call back should be a function");
	    }
	    invalidateCallbacks = method.invalidateCallbacks || (method.invalidateCallbacks = []);
	    return invalidateCallbacks.push(callback);
	  };
	  method.offInvalidate = function(callback) {
	    var index, invalidateCallbacks;
	    invalidateCallbacks = method.invalidateCallbacks;
	    if (!invalidateCallbacks) {
	      return;
	    }
	    index = invalidateCallbacks.indexOf(callback);
	    if (index < 0) {
	      return;
	    }
	    invalidateCallbacks.splice(index, 1);
	    if (!invalidateCallbacks.length) {
	      return method.invalidateCallbacks = null;
	    }
	  };
	  method.invalidate = function() {
	    var callback, _i, _len, _ref1;
	    if (!method.valid) {
	      return;
	    }
	    if (!method.invalidateCallbacks) {
	      return;
	    }
	    _ref1 = method.invalidateCallbacks;
	    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	      callback = _ref1[_i];
	      callback();
	    }
	    method.valid = false;
	  };
	  return method;
	};

	renew = function(computation) {
	  var method;
	  method = function() {
	    var value;
	    if (!arguments.length) {
	      value = computation();
	      method.valid = true;
	      method.invalidate();
	      return value;
	    } else {
	      throw new Error('flow.renew is not allowed to accept arguments');
	    }
	  };
	  method.toString = function() {
	    return "renew: " + (funcString(computation));
	  };
	  return react(method);
	};

	dependent = function(computation) {
	  var cacheValue, method;
	  cacheValue = null;
	  method = function() {
	    if (!arguments.length) {
	      if (!method.valid) {
	        method.valid = true;
	        return cacheValue = computation();
	      } else {
	        return cacheValue;
	      }
	    } else {
	      throw new Error('flow.dependent is not allowed to accept arguments');
	    }
	  };
	  method.toString = function() {
	    return "dependent: " + (funcString(computation));
	  };
	  return react(method);
	};

	module.exports = flow = function() {
	  var cacheValue, computation, dep, deps, reactive, _i, _j, _k, _len, _len1;
	  deps = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), computation = arguments[_i++];
	  for (_j = 0, _len = deps.length; _j < _len; _j++) {
	    dep = deps[_j];
	    if (typeof dep === 'function' && !dep.invalidate) {
	      reactive = react(function() {
	        reactive.invalidate();
	        return computation();
	      });
	      return reactive;
	    }
	  }
	  cacheValue = null;
	  reactive = react(function(value) {
	    if (!arguments.length) {
	      if (!reactive.valid) {
	        reactive.valid = true;
	        return cacheValue = computation();
	      } else {
	        return cacheValue;
	      }
	    } else {
	      if (value === cacheValue) {
	        return value;
	      }
	      cacheValue = value;
	      computation(value);
	      reactive.invalidate();
	      return cacheValue;
	    }
	  });
	  for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
	    dep = deps[_k];
	    if (dep && dep.onInvalidate) {
	      dep.onInvalidate(reactive.invalidate);
	    }
	  }
	  reactive.toString = function() {
	    return "flow: [" + (((function() {
	      var _l, _len2, _results;
	      _results = [];
	      for (_l = 0, _len2 = deps.length; _l < _len2; _l++) {
	        dep = deps[_l];
	        _results.push(dep.toString());
	      }
	      return _results;
	    })()).join(',')) + "] --> " + (funcString(computation));
	  };
	  return reactive;
	};

	flow.pipe = function() {
	  var computation, dep, deps, reactive, _i, _j, _k, _len, _len1;
	  deps = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), computation = arguments[_i++];
	  for (_j = 0, _len = deps.length; _j < _len; _j++) {
	    dep = deps[_j];
	    if (typeof dep === 'function' && !dep.invalidate) {
	      reactive = react(function() {
	        var args, _k, _len1;
	        if (argumnets.length) {
	          throw new Error("flow.pipe is not allow to have arguments");
	        }
	        reactive.invalidate();
	        args = [];
	        for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
	          dep = deps[_k];
	          if (typeof dep === 'function') {
	            args.push(dep());
	          } else {
	            args.push(dep);
	          }
	        }
	        return computation.apply(null, args);
	      });
	      return reactive;
	    }
	  }
	  reactive = react(function() {
	    var args, _k, _len1;
	    args = [];
	    for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
	      dep = deps[_k];
	      if (typeof dep === 'function') {
	        args.push(dep());
	      } else {
	        args.push(dep);
	      }
	    }
	    return computation.apply(null, args);
	  });
	  for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
	    dep = deps[_k];
	    if (dep && dep.onInvalidate) {
	      dep.onInvalidate(reactive.invalidate);
	    }
	  }
	  return reactive;
	};

	flow.react = react;

	flow.renew = renew;

	flow.dependent = dependent;

	flow.flow = flow;

	flow.see = see = function(value, transform) {
	  var cacheValue, method;
	  cacheValue = value;
	  method = function(value) {
	    if (!arguments.length) {
	      method.valid = true;
	      return cacheValue;
	    } else {
	      value = transform ? transform(value) : value;
	      if (value !== cacheValue) {
	        cacheValue = value;
	        method.invalidate();
	      }
	      return value;
	    }
	  };
	  method.isDuplex = true;
	  method.toString = function() {
	    return "see: " + value;
	  };
	  return react(method);
	};

	flow.seeN = function() {
	  var computation, computations, _i, _len, _results;
	  computations = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  _results = [];
	  for (_i = 0, _len = computations.length; _i < _len; _i++) {
	    computation = computations[_i];
	    _results.push(see(computation));
	  }
	  return _results;
	};

	if (Object.defineProperty) {
	  flow.bind = function(obj, attr, debugName) {
	    var d, getter, set, setter;
	    d = Object.getOwnPropertyDescriptor(obj, attr);
	    if (d) {
	      getter = d.get;
	      set = d.set;
	    }
	    if (!getter || !getter.invalidate) {
	      getter = function() {
	        if (arguments.length) {
	          throw new Error('should not set value on flow.bind');
	        }
	        getter.valid = true;
	        return getter.cacheValue;
	      };
	      getter.cacheValue = obj[attr];
	      setter = function(value) {
	        if (value !== obj[attr]) {
	          if (set) {
	            set(value);
	          }
	          getter.invalidate();
	          return getter.cacheValue = value;
	        }
	      };
	      react(getter);
	      getter.toString = function() {
	        return "" + (debugName || 'm') + "[" + attr + "]";
	      };
	      Object.defineProperty(obj, attr, {
	        get: getter,
	        set: setter
	      });
	    }
	    return getter;
	  };
	  flow.duplex = function(obj, attr, debugName) {
	    var d, get, method, set;
	    d = Object.getOwnPropertyDescriptor(obj, attr);
	    if (d) {
	      get = d.get, set = d.set;
	    }
	    if (!set || !set.invalidate) {
	      method = function(value) {
	        if (!arguments.length) {
	          method.valid = true;
	          return method.cacheValue;
	        }
	        if (value !== obj[attr]) {
	          if (set) {
	            set(value);
	          }
	          get && get.invalidate && get.invalidate();
	          method.invalidate();
	          return method.cacheValue = value;
	        }
	      };
	      method.cacheValue = obj[attr];
	      react(method);
	      method.isDuplex = true;
	      method.toString = function() {
	        return "" + (debugName || 'm') + "[" + attr + "]";
	      };
	      Object.defineProperty(obj, attr, {
	        get: method,
	        set: method
	      });
	      return method;
	    } else {
	      return set;
	    }
	  };
	} else {
	  flow.bind = function(obj, attr, debugName) {
	    var method, _dcBindMethodMap;
	    _dcBindMethodMap = obj._dcBindMethodMap;
	    if (!_dcBindMethodMap) {
	      _dcBindMethodMap = obj._dcBindMethodMap = {};
	    }
	    if (!obj.dcSet$) {
	      obj.dcSet$ = function(attr, value) {
	        var _dcDuplexMethodMap;
	        if (value !== obj[attr]) {
	          _dcBindMethodMap && _dcBindMethodMap[attr] && _dcBindMethodMap[attr].invalidate();
	          return (_dcDuplexMethodMap = this._dcDuplexMethodMap) && _dcDuplexMethodMap[attr] && _dcDuplexMethodMap[attr].invalidate();
	        }
	      };
	    }
	    method = _dcBindMethodMap[attr];
	    if (!method) {
	      method = _dcBindMethodMap[attr] = function() {
	        method.valid = true;
	        return obj[attr];
	      };
	      method.toString = function() {
	        return "" + (debugName || 'm') + "[" + attr + "]";
	      };
	      react(method);
	    }
	    return method;
	  };
	  flow.duplex = function(obj, attr, debugName) {
	    var method, _dcDuplexMethodMap;
	    _dcDuplexMethodMap = obj._dcDuplexMethodMap;
	    if (!_dcDuplexMethodMap) {
	      _dcDuplexMethodMap = obj._dcDuplexMethodMap = {};
	    }
	    if (!obj.dcSet$) {
	      obj.dcSet$ = function(attr, value) {
	        var _dcBindMethodMap;
	        if (value !== obj[attr]) {
	          (_dcBindMethodMap = this._dcBindMethodMap) && _dcBindMethodMap[attr] && _dcBindMethodMap[attr].invalidate();
	          _dcDuplexMethodMap && _dcDuplexMethodMap[attr] && _dcDuplexMethodMap[attr].invalidate();
	        }
	        return value;
	      };
	    }
	    method = _dcDuplexMethodMap[attr];
	    if (!method) {
	      method = _dcDuplexMethodMap[attr] = function(value) {
	        if (!arguments.length) {
	          method.valid = true;
	          return obj[attr];
	        } else {
	          return obj.dcSet$(attr, value);
	        }
	      };
	      method.isDuplex = true;
	      method.toString = function() {
	        return "" + (debugName || 'm') + "[" + attr + "]";
	      };
	      react(method);
	    }
	    return method;
	  };
	}

	flow.unary = function(x, unaryFn) {
	  if (typeof x !== 'function') {
	    return unaryFn(x);
	  } else if (x.invalidate) {
	    return flow(x, function() {
	      return unaryFn(x());
	    });
	  } else {
	    return function() {
	      return unaryFn(x());
	    };
	  }
	};

	flow.binary = function(x, y, binaryFn) {
	  if (typeof x === 'function' && typeof y === 'function') {
	    if (x.invalidate && y.invalidate) {
	      return flow(x, y, function() {
	        return binaryFn(x(), y());
	      });
	    } else {
	      return function() {
	        return binaryFn(x(), y());
	      };
	    }
	  } else if (typeof x === 'function') {
	    if (x.invalidate) {
	      return flow(x, function() {
	        return binaryFn(x(), y);
	      });
	    } else {
	      return function() {
	        return binaryFn(x(), y);
	      };
	    }
	  } else if (typeof y === 'function') {
	    if (y.invalidate) {
	      return flow(y, function() {
	        return binaryFn(x, y());
	      });
	    } else {
	      return function() {
	        return binaryFn(x, y());
	      };
	    }
	  } else {
	    return binaryFn(x, y);
	  }
	};


/***/ },
/* 10 */
/*!*********************************!*\
  !*** ../lazy-flow/addon.coffee ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var binary, bind, duplex, flow, see, unary, _ref;

	_ref = __webpack_require__(/*! ./index */ 9), see = _ref.see, bind = _ref.bind, duplex = _ref.duplex, flow = _ref.flow, unary = _ref.unary, binary = _ref.binary;

	module.exports = flow;

	flow.bindings = function(model, name) {
	  var key, result;
	  result = {};
	  for (key in model) {
	    result[key + '$'] = duplex(model, key, name);
	    result[key + '_'] = bind(model, key, name);
	  }
	  return result;
	};

	flow.seeAttrs = function(target, from) {
	  var attr, key, value;
	  for (key in from) {
	    value = from[key];
	    attr = target[key];
	    if (typeof attr === 'function') {
	      attr(value);
	    } else {
	      target[key] = see(value);
	    }
	  }
	  return target;
	};

	flow.neg = function(x) {
	  return unary(x, function(x) {
	    return -x;
	  });
	};

	flow.no = function(x) {
	  return unary(x, function(x) {
	    return !x;
	  });
	};

	flow.bitnot = function(x) {
	  return unary(x, function(x) {
	    return ~x;
	  });
	};

	flow.reciprocal = function(x) {
	  return unary(x, function(x) {
	    return 1 / x;
	  });
	};

	flow.abs = function(x) {
	  return unary(x, Math.abs);
	};

	flow.floor = function(x) {
	  return unary(x, Math.floor);
	};

	flow.ceil = function(x) {
	  return unary(x, Math.ceil);
	};

	flow.round = function(x) {
	  return unary(x, Math.round);
	};

	flow.add = function(x, y) {
	  return binary(x, y, function(x, y) {
	    return x + y;
	  });
	};

	flow.sub = function(x, y) {
	  return binary(x, y, function(x, y) {
	    return x - y;
	  });
	};

	flow.mul = function(x, y) {
	  return binary(x, y, function(x, y) {
	    return x * y;
	  });
	};

	flow.div = function(x, y) {
	  return binary(x, y, function(x, y) {
	    return x / y;
	  });
	};

	flow.min = function(x, y) {
	  return binary(x, y, function(x, y) {
	    return Math.min(x, y);
	  });
	};

	flow.funcAttr = function(obj, attr) {
	  return flow(obj, attr, function(value) {
	    var objValue;
	    objValue = obj();
	    if (objValue == null) {
	      return objValue;
	    }
	    if (!arguments.length) {
	      return objValue[attr];
	    } else {
	      return objValue[attr] = value;
	    }
	  });
	};

	flow.toggle = function(x) {
	  return x(!x());
	};

	flow.if_ = function(test, then_, else_) {
	  if (typeof test !== 'function') {
	    if (test) {
	      return then_;
	    } else {
	      return else_;
	    }
	  } else if (!test.invalidate) {
	    if (typeof then_ === 'function' && typeof else_ === 'function') {
	      return function() {
	        if (test()) {
	          return then_();
	        } else {
	          return else_();
	        }
	      };
	    } else if (then_ === 'function') {
	      return function() {
	        if (test()) {
	          return then_();
	        } else {
	          return else_;
	        }
	      };
	    } else if (else_ === 'function') {
	      return function() {
	        if (test()) {
	          return then_;
	        } else {
	          return else_();
	        }
	      };
	    } else if (test()) {
	      return then_;
	    } else {
	      return else_;
	    }
	  } else {
	    if (typeof then_ === 'function' && typeof else_ === 'function') {
	      if (then_.invalidate && else_.invalidate) {
	        return flow(test, then_, else_, function() {
	          if (test()) {
	            return then_();
	          } else {
	            return else_();
	          }
	        });
	      } else {
	        return function() {
	          if (test()) {
	            return then_();
	          } else {
	            return else_();
	          }
	        };
	      }
	    } else if (typeof then_ === 'function') {
	      if (then_.invalidate) {
	        return flow(test, then_, (function() {
	          if (test()) {
	            return then_();
	          } else {
	            return else_;
	          }
	        }));
	      } else {
	        return function() {
	          if (test()) {
	            return then_();
	          } else {
	            return else_;
	          }
	        };
	      }
	    } else if (typeof else_ === 'function') {
	      if (else_.invalidate) {
	        return flow(else_, (function() {
	          if (test()) {
	            return then_;
	          } else {
	            return else_();
	          }
	        }));
	      } else {
	        return function() {
	          if (test()) {
	            return then_;
	          } else {
	            return else_();
	          }
	        };
	      }
	    } else {
	      return flow(test, function() {
	        if (test()) {
	          return then_;
	        } else {
	          return else_;
	        }
	      });
	    }
	  }
	};


/***/ },
/* 11 */
/*!**************************************!*\
  !*** ../lazy-flow-at/test-at.coffee ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var expect, flow, idescribe, iit, ndescribe, nit, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	flow = __webpack_require__(/*! ./index */ 12);

	describe('lazy-flow-at', function() {
	  it('should process flow.at', function() {
	    var called, m, path1;
	    m = {};
	    path1 = flow.at(m, 'x.y');
	    expect(path1()).to.equal(void 0);
	    called = false;
	    path1.onInvalidate(function() {
	      return called = true;
	    });
	    path1(1);
	    expect(called).to.equal(true);
	    expect(path1()).to.equal(1);
	    expect(m.x.y).to.equal(1);
	    called = false;
	    m.x = {};
	    expect(called).to.equal(true);
	    return expect(m.x.y).to.equal(void 0);
	  });
	  return it('should process flow.at without root', function() {
	    var path1, root;
	    window.x = void 0;
	    path1 = flow.at('x.y');
	    expect(path1()).to.equal(void 0);
	    path1(1);
	    expect(path1()).to.equal(1);
	    if (typeof window !== 'undefined') {
	      root = window;
	    } else {
	      root = global;
	    }
	    return expect(root.x.y).to.equal(1);
	  });
	});

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 12 */
/*!************************************!*\
  !*** ../lazy-flow-at/index.coffee ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var atMethod, bind, duplex, flow, funcString, invalidateBindPath, newLine, react, _ref, _ref1;

	_ref = __webpack_require__(/*! dc-util */ 7), newLine = _ref.newLine, funcString = _ref.funcString;

	_ref1 = flow = __webpack_require__(/*! lazy-flow */ 6), bind = _ref1.bind, duplex = _ref1.duplex, react = _ref1.react;

	module.exports = flow;

	atMethod = function(method) {
	  return function(root, path) {
	    var len, reactive;
	    if (arguments.length === 1) {
	      path = root;
	      if (typeof window !== 'undefined') {
	        root = window;
	      } else {
	        root = global;
	      }
	    }
	    if (typeof path === 'string') {
	      path = path.split(/\.\s*/);
	    }
	    if (!path.length) {
	      return root;
	    }
	    if (typeof root !== 'object') {
	      throw new Error('expect an object as the root of flow.at');
	    }
	    len = path.length;
	    if (len === 0) {
	      return root;
	    }
	    reactive = react(function(value) {
	      var i, item, parent;
	      if (arguments.length) {
	        i = 0;
	        parent = root;
	        while (i < len - 1) {
	          item = parent[path[i]];
	          if (item == null) {
	            item = parent[path[i]] = {};
	          } else if (typeof parent !== 'object') {
	            throw new Error('expect an object');
	          }
	          parent = item;
	          i++;
	        }
	        parent[path[i]] = value;
	        if (reactive.cacheValue !== value) {
	          reactive.cacheValue = value;
	          reactive.invalidate();
	          reactive.valid = false;
	        }
	        return value;
	      } else {
	        reactive.valid = true;
	        i = 0;
	        item = root;
	        while (i < len) {
	          if (!item) {
	            return;
	          }
	          item = item[path[i]];
	          i++;
	        }
	        return reactive.cacheValue = item;
	      }
	    });
	    if (method === duplex) {
	      reactive.isDuplex = true;
	    }
	    return invalidateBindPath(root, path, reactive, method);
	  };
	};

	invalidateBindPath = function(root, path, atFunc, method) {
	  var attr, bound, i, len, parent;
	  len = path.length;
	  if (!len) {
	    return atFunc;
	  }
	  parent = root;
	  i = 0;
	  while (i < len) {
	    if (!parent) {
	      return;
	    }
	    attr = path[i];
	    bound = method(parent, attr);
	    bound.onInvalidate(function() {
	      invalidateBindPath(parent[attr], path.slice(i + 1), atFunc);
	      return atFunc.invalidate();
	    });
	    i++;
	  }
	  return atFunc;
	};

	flow.at = atMethod(bind);

	flow.at2 = atMethod(duplex);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 13 */
/*!*****************************************!*\
  !*** ./test/mocha/test-property.coffee ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, a, attrToPropName, bind, checkbox, classFn, div, duplex, expect, func, hide, idescribe, if_, iit, li, list, model, ndescribe, nit, options, p, see, show, span, splitter, styleFrom, text, util, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	util = dc.util, bind = dc.bind, duplex = dc.duplex, see = dc.see, classFn = dc.classFn, styleFrom = dc.styleFrom, attrToPropName = dc.attrToPropName, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, checkbox = dc.checkbox, model = dc.model, show = dc.show, hide = dc.hide, splitter = dc.splitter, options = dc.options;

	describe('properties ', function() {
	  describe('utilities', function() {
	    it('styleFrom ', function() {
	      var x;
	      x = styleFrom("display:none; zIndex:100; backgroundColor:white;");
	      return expect(x).to.deep.equal({
	        display: 'none',
	        zIndex: '100',
	        backgroundColor: 'white'
	      });
	    });
	    return it('attrToPropName ', function() {
	      var x;
	      x = attrToPropName("background-color");
	      return expect(x).to.equal('backgroundColor');
	    });
	  });
	  describe("classFn", function() {
	    it('get value of classFn', function() {
	      var active, x;
	      active = see(true);
	      x = classFn([
	        'a', {
	          b: active
	        }
	      ]);
	      expect(x()).to.equal('a b');
	      active(false);
	      return expect(x()).to.equal('a');
	    });
	    it('should compute valid', function() {
	      var x;
	      x = classFn(['a']);
	      expect(x.valid).to.equal(false);
	      expect(x()).to.equal('a');
	      expect(x.valid).to.equal(true);
	      x.extend('a');
	      expect(x.valid).to.equal(true);
	      expect(x()).to.equal('a');
	      x.extend('b');
	      expect(x.valid).to.equal(false);
	      expect(x()).to.equal('a b');
	      x.extend('!b');
	      expect(x.valid).to.equal(false);
	      return expect(x()).to.equal('a');
	    });
	    return it('should get class property in component', function() {
	      var active, comp;
	      active = see(true);
	      comp = div({
	        "class": {
	          a: 1,
	          b: active
	        }
	      });
	      expect(comp.className()).to.equal('a b');
	      comp.className = classFn({
	        a: 1,
	        b: active
	      });
	      expect(comp.className.valid).to.equal(false, 'className.valid 1');
	      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties 1');
	      comp.mount();
	      expect(comp.className.valid).to.equal(true, 'className.valid 2');
	      expect(comp.hasActiveProperties).to.equal(false, 'hasActiveProperties 2');
	      expect(comp.node.className).to.equal('a b');
	      active(false);
	      expect(comp.className.valid).to.equal(false, 'className.valid 3');
	      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties 3');
	      comp.update();
	      return expect(comp.node.className).to.equal('a');
	    });
	  });
	  describe('create', function() {
	    return it('should create properties', function() {
	      var comp;
	      comp = p({
	        value: bind({
	          a: 1
	        }, 'a')
	      });
	      expect(comp.className.valid).to.equal(true, 'className.valid');
	      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties');
	      comp.mount();
	      return expect(comp.node.value).to.equal(1);
	    });
	  });
	  describe('event', function() {
	    it('click event ', function() {
	      var comp, x;
	      x = 1;
	      comp = a({
	        onclick: function() {
	          return x = 2;
	        }
	      }, 'click me');
	      comp.mount('#demo');
	      comp.node.click();
	      return expect(x).to.equal(2);
	    });
	    it('multiple handlers for one event', function() {
	      var $a, comp, spy1, x;
	      $a = duplex(x = {
	        a: 1
	      }, 'a');
	      spy1 = sinon.spy();
	      comp = text({
	        onchange: spy1,
	        $model: $a
	      });
	      comp.mount();
	      comp.node.value = 2;
	      comp.node.onchange();
	      expect(spy1.called).to.equal(true);
	      return expect(x.a).to.equal('2');
	    });
	    return it('multiple handlers for one event, with bind value', function() {
	      var $a, comp, spy1, x;
	      $a = duplex(x = {
	        a: 1
	      }, 'a');
	      spy1 = sinon.spy();
	      comp = text({
	        onchange: spy1
	      }, $a);
	      comp.mount();
	      comp.node.value = 2;
	      comp.node.onchange();
	      expect(spy1.called).to.equal(true);
	      return expect(x.a).to.equal('2');
	    });
	  });
	  describe('style', function() {
	    it('should set style property with string value', function() {
	      var comp, elm;
	      comp = a({
	        style: "border:red 1px solid"
	      }, 'red 1px solid');
	      expect(comp.className.valid).to.equal(true, 'className.valid');
	      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties');
	      elm = comp.mount('#demo');
	      return expect(comp.node.style.border).to.equal("1px solid red");
	    });
	    it('should set style property', function() {
	      var comp, elm;
	      comp = a({
	        style: {
	          border: "red 1px solid"
	        }
	      }, 'red 1px solid');
	      elm = comp.mount('#demo');
	      return expect(comp.node.style.border).to.equal("1px solid red");
	    });
	    it('value of property of style could be dc expression', function() {
	      var comp, elm;
	      comp = a({
	        style: {
	          border: function() {
	            return "red 1px solid";
	          }
	        }
	      }, 'red 1px solid');
	      elm = comp.mount('#demo');
	      return expect(comp.node.style.border).to.equal("1px solid red");
	    });
	    return nit('change style dynamically', function() {
	      var color, comp, handle, i, i0, paddingColor, styleFn;
	      paddingColor = function(hexStr) {
	        if (!(hexStr.match(/^\d/))) {
	          return hexStr;
	        }
	        while (hexStr.length < 6) {
	          hexStr = '0' + hexStr;
	        }
	        return '#' + hexStr;
	      };
	      color = see("red");
	      i = see(i0 = 0);
	      comp = a({
	        style: {
	          borderWidth: flow(i, function() {
	            return i() + "px";
	          }),
	          borderStyle: "solid",
	          borderColor: flow(color, function() {
	            return paddingColor(color().toString(16));
	          })
	        }
	      }, 'dynamic property');
	      comp.mount('#demo');
	      color = 0;
	      styleFn = function() {
	        color += 0x111111;
	        i(i0++);
	        comp.render();
	        if (i0 === 50) {
	          return clearInterval(handle);
	        }
	      };
	      return handle = setInterval(styleFn, 5);
	    });
	  });
	  return it('bidirectional bind checkbox', function() {
	    var bb, cbx, model1;
	    dc.directives({
	      $model: dc.$model
	    });
	    model1 = {
	      a: 1
	    };
	    bb = duplex(model1, 'a');
	    cbx = checkbox({
	      $model: bb
	    });
	    cbx.mount('#demo');
	    expect(cbx.node.onchange).to.be.defined;
	    cbx.node.checked = true;
	    cbx.node.onchange();
	    return expect(model1.a).to.equal(true);
	  });
	});


/***/ },
/* 14 */
/*!*****************************************!*\
  !*** ./test/mocha/test-toString.coffee ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, Tag, Text, TransformComponent, a, accordion, accordionGroup, bindings, case_, div, each, expect, flow, func, idescribe, if_, iit, list, ndescribe, nit, p, span, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	flow = dc.flow, bindings = dc.bindings, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, each = dc.each, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

	describe('toString', function() {
	  it('should toString list of if(tag)', function() {
	    var comp, pIf, t1, x;
	    x = 0;
	    comp = list(t1 = text({
	      onchange: function() {
	        x = parseInt(this.value);
	        return comp.update();
	      }
	    }, x), pIf = if_((function() {
	      return x;
	    }), div(1), div(2)));
	    return expect(comp.toString()).to.match(/<List>\n  <input type="text" value=0>/);
	  });
	  it('should toString  tag with props', function() {
	    var comp, x;
	    x = 0;
	    comp = div({
	      value: 1
	    }, 1);
	    return expect(comp.toString()).to.equal('<div value=1>1</div>');
	  });
	  it('should case.toString', function() {
	    var comp;
	    comp = case_((function() {
	      return x;
	    }), {
	      1: p(1),
	      2: p(2),
	      3: p(3)
	    }, 'others');
	    return expect(comp.toString()).to.equal('<Case renew: fn:x>\n  1: <p>1</p>\n  2: <p>2</p>\n  3: <p>3</p>\n  "others"\n</Case>');
	  });
	  return it('should flow.add(a_, b_).toString', function() {
	    var a_, b_, r, _ref1;
	    _ref1 = bindings({
	      a: 1,
	      b: 2
	    }), a_ = _ref1.a_, b_ = _ref1.b_;
	    r = flow.add(a_, b_);
	    return expect(r.toString()).to.equal('flow: [m[a],m[b]] --> fn:binaryFn(x(), y())');
	  });
	});


/***/ },
/* 15 */
/*!***********************************!*\
  !*** ./test/mocha/test-dc.coffee ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	/**test-component
	 */
	var expect, idescribe, iit, isComponent, ndescribe, nit, rinterval, rtimeout, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, rtimeout = _ref.rtimeout, rinterval = _ref.rinterval;

	isComponent = dc.isComponent;

	describe("test dc", function() {
	  return describe('dc(document)', function() {
	    it('dc(document) should be Component', function() {
	      return expect(!isComponent(dc(document))).to.equal(true);
	    });
	    it('should cache DomComponent', function() {
	      return expect(dc(document)).to.equal(dc(document));
	    });
	    return it('dc(document).bind should be a function', function() {
	      var x;
	      x = 0;
	      return dc(document).bind('onclick', function() {
	        return x = 1;
	      });
	    });
	  });
	});


/***/ },
/* 16 */
/*!***********************************************!*\
  !*** ./test/mocha/test-base-component.coffee ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	var Html, List, Nothing, Tag, Text, a_, bindings, classFn, div, expect, html, idescribe, iit, list, ndescribe, newDemoNode, nit, p, see, styleFrom, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, newDemoNode = _ref.newDemoNode;

	newDemoNode = __webpack_require__(/*! ./helper */ 17).newDemoNode;

	bindings = dc.bindings, see = dc.see, Tag = dc.Tag, Text = dc.Text, List = dc.List, txt = dc.txt, list = dc.list, p = dc.p, div = dc.div, Html = dc.Html, html = dc.html, classFn = dc.classFn, styleFrom = dc.styleFrom, Nothing = dc.Nothing;

	a_ = bindings({
	  a: 1,
	  b: 2
	}).a_;

	describe("test base component", function() {
	  describe('getBaseComponent', function() {
	    it('should get baseComponent of List', function() {
	      var comp;
	      comp = list([1, 2]);
	      return expect(comp.baseComponent).to.equal(comp);
	    });
	    return it('should have correct children', function() {
	      var comp;
	      comp = p(0);
	      return expect(comp.children[0].text).to.equal(0);
	    });
	  });
	  describe('process get baseComponent of Tag', function() {
	    it('should getBaseComponent of two tags', function() {
	      var d, p1;
	      p1 = new Tag('p', {}, []);
	      d = new Tag('div', {}, [p1]);
	      expect(d.baseComponent).to.equal(d);
	      expect(d.children[0]).to.be["instanceof"](Tag);
	      d.mount();
	      return expect(d.baseComponent.baseComponent).to.equal(d);
	    });
	    return it('should text.valid to be true', function() {
	      var comp;
	      comp = txt(1);
	      comp.mount();
	      return expect(!!comp.valid).to.equal(true);
	    });
	  });
	  describe('process creatDom', function() {
	    it('should creatDom of p(1)', function() {
	      var comp;
	      comp = p(1);
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('1');
	    });
	    it('should creatDom of p(->1)', function() {
	      var comp;
	      comp = p(function() {
	        return 1;
	      });
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('1');
	    });
	    it('should creatDom of p(p(p(t=txt(->1))))', function() {
	      var comp, t;
	      comp = p(p(p(t = txt(function() {
	        return 1;
	      }))));
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('<p><p>1</p></p>');
	    });
	    it('should mount Text with text is 0', function() {
	      var n;
	      n = new Text(0);
	      n.mount();
	      return expect(n.node.textContent).to.equal('0');
	    });
	    it('should mount tag', function() {
	      p = new Tag('p', {}, []);
	      p.mount();
	      return expect(p.node.tagName).to.equal('P');
	    });
	    it('should mount  tag with attribute', function() {
	      p = new Tag('p', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, []);
	      p.mount();
	      expect(p.node.className).to.equal('some class');
	      return expect(p.node.getAttribute('className')).to.equal(null);
	    });
	    it('process bind as value', function() {
	      var comp;
	      comp = new Tag('input', {
	        type: 'text',
	        value: a_
	      }, [new Text(a_)]);
	      comp.mount();
	      return expect(comp.node.value).to.equal('1');
	    });
	    it('tag shoud mount with multiple children ', function() {
	      var comp, t1, t2, t3;
	      comp = new Tag('p', {}, [t1 = new Text(1), t2 = new Text(2), t3 = new Text(3)]);
	      expect(comp.children.length).to.equal(3);
	      comp.mount();
	      return expect(comp.node.childNodes.length).to.equal(3);
	    });
	    it('tag shoud mount with Nothing child', function() {
	      var comp, t1, t2, t3, t4;
	      comp = new Tag('p', {}, [t1 = new Text(1), t2 = new Text(2), t3 = new Text(3), t4 = new Nothing()]);
	      expect(comp.children.length).to.equal(4);
	      comp.mount();
	      return expect(comp.node.childNodes.length).to.equal(3);
	    });
	    it('should create tag with children', function() {
	      var comp;
	      comp = new Tag('p', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, [new Tag('span', {}, [new Text('adf')])]);
	      comp.mount();
	      return expect(comp.node.getElementsByTagName('span').length).to.equal(1);
	    });
	    it('should mount tag 2', function() {
	      var comp;
	      comp = new Tag('p', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, [new Tag('span', {}, [new Text('adf')])]);
	      comp.mount();
	      return expect(comp.node.className).to.equal('some class');
	    });
	    it('should mount for tag with children', function() {
	      var comp;
	      comp = new Tag('p', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, [new Tag('span', {}, [new Text('adf')]), new Text(function() {})]);
	      comp.mount();
	      return expect(comp.node.className).to.equal('some class');
	    });
	    return it('should mount list with children', function() {
	      var comp;
	      comp = new List([
	        new Tag('span', {}, [new Text('adf')]), new Text(function() {
	          return void 0;
	        })
	      ]);
	      comp.mount();
	      return expect(comp.node[0].tagName).to.equal('SPAN');
	    });
	  });
	  return describe('process Html', function() {
	    it('should mount html', function() {
	      var comp, demoNode, s;
	      comp = new Html(s = '<div>1</div><p>2</p>');
	      comp.mount(demoNode = newDemoNode());
	      return expect(demoNode.innerHTML).to.equal(s);
	    });
	    it('should mount html component with transform', function() {
	      var comp, demoNode, s;
	      comp = new Html(s = '<div>1</div><p>2</p>', function(text) {
	        return text + 'a';
	      });
	      comp.mount(demoNode = newDemoNode());
	      return expect(demoNode.innerHTML).to.equal(s + 'a');
	    });
	    return it('should mount html component with reative function', function() {
	      var comp, demoNode, s, str;
	      str = see(s = '<div>1</div><p>2</p>');
	      comp = new Html(str, function(text) {
	        return text + 'a';
	      });
	      comp.mount(demoNode = newDemoNode());
	      str('x');
	      comp.update();
	      expect(demoNode.innerHTML).to.equal('xa');
	      comp.update();
	      return expect(demoNode.innerHTML).to.equal('xa');
	    });
	  });
	});


/***/ },
/* 17 */
/*!**********************************!*\
  !*** ./test/mocha/helper.coffee ***!
  \**********************************/
/***/ function(module, exports) {

	exports.newDemoNode = function(id) {
	  var node;
	  node = document.createElement('div');
	  document.body.appendChild(node);
	  id && node.setAttribute('id', id);
	  return node;
	};


/***/ },
/* 18 */
/*!******************************************!*\
  !*** ./test/mocha/test-component.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, List, Tag, Text, a, bindings, button, classFn, div, duplex, expect, flow, func, idescribe, if_, iit, input, li, list, ndescribe, nit, p, span, styleFrom, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	bindings = dc.bindings, duplex = dc.duplex, flow = dc.flow, classFn = dc.classFn, styleFrom = dc.styleFrom, Tag = dc.Tag, Text = dc.Text, List = dc.List, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, txt = dc.txt, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, button = dc.button, input = dc.input;

	describe("component  ", function() {
	  describe('construct component', function() {
	    it('component shoud have children', function() {
	      var comp;
	      comp = p({}, [1, 2]);
	      return expect(comp.children.length).to.equal(2);
	    });
	    it('should construct component', function() {
	      var d, p1;
	      p1 = new Tag('p', {}, []);
	      d = new Tag('div', {}, [p1]);
	      return expect(d.children[0]).to.equal(p1);
	    });
	    it('tag shoud have children 1', function() {
	      var comp;
	      comp = new Tag('span', {}, [new Text('adf')]);
	      return expect(comp.children[0].text).to.equal('adf');
	    });
	    return it('tag shoud have children 2', function() {
	      var comp, span1;
	      span1 = new Tag('span', {}, [new Text('adf')]);
	      comp = new Tag('div', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, [span1]);
	      return expect(comp.children[0]).to.equal(span1);
	    });
	  });
	  describe('component.append', function() {
	    return nit('should append tag.children', function() {
	      var d, p1;
	      d = div();
	      p1 = p();
	      d.append(p1);
	      return expect(d.children).to.equal(p1);
	    });
	  });
	  describe('component.create', function() {
	    it('should create tag', function() {
	      var comp;
	      comp = p();
	      comp.mount();
	      expect(comp.node.tagName).to.equal('P');
	      return expect(comp.node.innerHTML).to.equal('');
	    });
	    it('should mount tag 1', function() {
	      var comp;
	      comp = new Tag('div', {}, []);
	      comp.mount();
	      return expect(comp.node.tagName).to.equal('DIV');
	    });
	    it('should correctly create TextNode with 0 as content', function() {
	      var comp;
	      comp = txt(0);
	      comp.mount();
	      return expect(comp.node.textContent).to.equal('0');
	    });
	    it('should correctly create tag with 0 as content', function() {
	      var comp;
	      comp = p(0);
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('0');
	    });
	    it('should mount Text with flow value', function() {
	      var a_, b_, comp, _ref1;
	      _ref1 = bindings({
	        a: 1,
	        b: 2
	      }), a_ = _ref1.a_, b_ = _ref1.b_;
	      comp = txt(flow.add(a_, b_));
	      comp.mount('#demo');
	      return expect(comp.node.textContent).to.equal('3', 'mount');
	    });
	    it('should not run event hanlder while creating tag', function() {
	      var comp, spy;
	      spy = sinon.spy();
	      comp = p({
	        onclick: spy
	      });
	      comp.mount();
	      expect(spy.called).to.equal(false);
	      comp.node.onclick();
	      return expect(spy.called).to.equal(true);
	    });
	    it('should process event name without on', function() {
	      var comp, spy;
	      spy = sinon.spy();
	      comp = p({
	        onclick: spy
	      });
	      comp.mount();
	      expect(spy.called).to.equal(false);
	      comp.node.onclick();
	      return expect(spy.called).to.equal(true);
	    });
	    it('should not run event hanlder while rendering tag', function() {
	      var comp, spy;
	      spy = sinon.spy();
	      comp = p({
	        onclick: spy
	      });
	      comp.mount();
	      expect(spy.called).to.equal(false);
	      comp.node.onclick();
	      return expect(spy.called).to.equal(true);
	    });
	    it('should not run event hanlder while rendering button tag', function() {
	      var comp, spy;
	      spy = sinon.spy();
	      comp = button({
	        id: "search-ok",
	        type: "submit",
	        onclick: spy
	      });
	      comp.mount();
	      expect(spy.called).to.equal(false);
	      comp.node.onclick();
	      return expect(spy.called).to.equal(true);
	    });
	    it('should not run event hanlder while rendering div > button tag', function() {
	      var comp, spy;
	      spy = sinon.spy();
	      comp = div(button({
	        id: "search-ok",
	        type: "submit",
	        onclick: spy
	      }));
	      comp.mount();
	      expect(spy.called).to.equal(false);
	      comp.children[0].node.onclick();
	      return expect(spy.called).to.equal(true);
	    });
	    it('should create tag with attribute', function() {
	      var comp, elm;
	      comp = p({
	        className: 'some class',
	        style: "width:1px;"
	      }, []);
	      comp.mount();
	      elm = comp.node;
	      expect(elm.className).to.equal('some class');
	      return expect(elm.getAttribute('className')).to.equal(null);
	    });
	    it('should process function value of text', function() {
	      var a_, comp, elm;
	      a_ = bindings({
	        a: 1
	      }).a_;
	      comp = text(a_);
	      elm = comp.mount();
	      elm = comp.node;
	      return expect(elm.value).to.equal('1');
	    });
	    it('component shoud have children 2', function() {
	      var comp;
	      comp = span('adf');
	      return expect(comp.children[0].text).to.equal('adf');
	    });
	    it('should create tag with children', function() {
	      var comp, span1;
	      comp = p({
	        className: 'some class',
	        style: "width:1px;"
	      }, span1 = span(['adf']));
	      expect(comp.children[0]).to.equal(span1);
	      comp.mount();
	      return expect(comp.node.getElementsByTagName('span').length).to.equal(1);
	    });
	    it('should mount tag 2', function() {
	      var comp, elm;
	      comp = p({
	        className: 'some class',
	        style: "width:1px;"
	      }, [span(['adf'])]);
	      elm = comp.mount('#demo');
	      expect(comp.parentNode.id).to.equal('demo');
	      return expect(comp.node.parentNode.id).to.equal('demo');
	    });
	    it('should mount tag with undefined as child', function() {
	      var comp;
	      comp = p({
	        className: 'some class',
	        style: "width:1px;"
	      }, span(['adf']), txt(function() {}));
	      comp.mount('#demo');
	      expect(comp.parentNode.id).to.equal('demo');
	      return expect(comp.node.parentNode.id).to.equal('demo');
	    });
	    return it('should mount list with undefined as child', function() {
	      var comp, elm;
	      comp = list(span(['adf']), txt(function() {
	        return void 0;
	      }));
	      elm = comp.mount('#demo');
	      expect(comp.parentNode.id).to.equal('demo');
	      return expect(comp.node[0].parentNode.id).to.equal('demo');
	    });
	  });
	  return describe('component update', function() {
	    it('should render tag 1', function() {
	      var comp, count;
	      count = 1;
	      comp = new Tag('p', {}, [
	        new Text(function() {
	          return count;
	        })
	      ]);
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal('1');
	      ++count;
	      comp.update();
	      expect(comp.node.innerHTML).to.equal('2');
	      ++count;
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('3');
	    });
	    it('should update bidirectional bind', function() {
	      var a$, comp;
	      a$ = bindings({
	        a: 1
	      }).a$;
	      comp = new Tag('input', {
	        value: a$
	      }, []);
	      comp.mount();
	      return expect(comp.node.value).to.equal("1");
	    });
	    it('should render tag 2', function() {
	      var comp, count, elm;
	      count = 1;
	      comp = p(txt(function() {
	        return count;
	      }));
	      comp.mount();
	      elm = comp.node;
	      expect(elm.innerHTML).to.equal('1');
	      ++count;
	      comp.update();
	      expect(elm.innerHTML).to.equal('2');
	      ++count;
	      comp.update();
	      return expect(elm.innerHTML).to.equal('3');
	    });
	    it('should process text with bind', function() {
	      var a_, b_, comp, _ref1;
	      _ref1 = bindings({
	        a: 1,
	        b: 2
	      }), a_ = _ref1.a_, b_ = _ref1.b_;
	      comp = p(txt(flow.add(a_, b_)));
	      comp.mount('#demo');
	      expect(comp.node.innerHTML).to.equal('3', 'mount');
	      a_(3);
	      b_(4);
	      expect(a_()).to.equal(3, 'a_');
	      expect(b_()).to.equal(4, 'b_');
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('7', 'update');
	    });
	    it('should process bidirectional bind', function() {
	      var a$, comp;
	      a$ = bindings({
	        a: 1
	      }).a$;
	      comp = text(a$);
	      comp.mount('#demo');
	      expect(comp.node.value).to.equal('1');
	      comp.node.value = '2';
	      comp.node.onchange();
	      return expect(a$()).to.equal('2');
	    });
	    it('should render div(2) component', function() {
	      var comp;
	      comp = div(2);
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('2');
	    });
	    it('should execute component.unmount', function() {
	      var comp;
	      comp = div(2);
	      comp.mount();
	      return comp.unmount();
	    });
	    return it('p(->12) ', function() {
	      var comp;
	      comp = p(function() {
	        return 12;
	      });
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal('12');
	      comp.update();
	      expect(comp.node.innerHTML).to.equal('12');
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('12');
	    });
	  });
	});


/***/ },
/* 19 */
/*!*********************************************!*\
  !*** ./test/mocha/test-if-case-func.coffee ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, Tag, Text, TransformComponent, a, accordion, accordionGroup, case_, div, each, expect, flow, func, idescribe, if_, iit, list, ndescribe, newDemoNode, nit, p, see, span, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, newDemoNode = _ref.newDemoNode;

	newDemoNode = __webpack_require__(/*! ./helper */ 17).newDemoNode;

	see = dc.see, flow = dc.flow, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, each = dc.each, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

	describe('if, case, func', function() {
	  describe('If', function() {
	    it('should optimize if_', function() {
	      var t, x;
	      t = txt(1);
	      x = 0;
	      expect(if_((function() {
	        return x;
	      }), t, t)).to.equal(t);
	      expect(if_(0, 1, t)).to.equal(t);
	      return expect(if_(1, t, 0)).to.equal(t);
	    });
	    it('should compute if_((-> x), p(t), t).family', function() {
	      var t, x;
	      t = txt(1);
	      x = 0;
	      return expect(if_((function() {
	        return x;
	      }), p(t), t).family[t.dcid]).to.equal(true);
	    });
	    it('should construct if_(x, p(t1), list(p(t2), t1))', function() {
	      var comp, t1, t2, x;
	      x = see(0);
	      t1 = txt(1);
	      t2 = txt(2);
	      return comp = if_(x, p(t1), list(t2, p(t1)));
	    });
	    it('should render if_(see something, txt(1), txt(2))', function() {
	      var comp, x;
	      x = see(0);
	      comp = if_(x, txt(1), txt(2));
	      comp.mount();
	      expect(comp.node.textContent).to.equal('2', 'mount');
	      comp.update();
	      x(1);
	      comp.update();
	      expect(comp.node.textContent).to.equal('1', 'update x 1');
	      x(0);
	      comp.update();
	      return expect(comp.node.textContent).to.equal('2', 'update x 0');
	    });
	    it('should render if_(x, list(t1, t2), list(t2, t1))', function() {
	      var comp, demoNode, t1, t2, x;
	      x = see(0);
	      t1 = txt(1);
	      t2 = txt(2);
	      comp = if_(x, list(t1, t2), list(t2, t1));
	      comp.mount(demoNode = newDemoNode('if-ref'));
	      expect(comp.node[0].textContent).to.equal('2', 'mount');
	      expect(demoNode.innerHTML).to.equal('21', 'mount');
	      x(1);
	      comp.update();
	      expect(comp.node[0].textContent).to.equal('1', 'update x 1');
	      return expect(demoNode.innerHTML).to.equal('12', 'mount');
	    });
	    it('should render if_(x, list(t2, t1), t1)', function() {
	      var comp, demoNode, lst, t1, t2, x;
	      x = see(1);
	      t1 = txt(1);
	      t2 = txt(2);
	      comp = if_(x, lst = list(t2, t1), t1);
	      comp.mount(demoNode = newDemoNode('if-ref'));
	      expect(demoNode.innerHTML).to.equal('21', 'mount');
	      x(0);
	      comp.update();
	      return expect(demoNode.innerHTML).to.equal('1');
	    });
	    it('should render if_(x, t1, list(t2, t1))', function() {
	      var comp, demoNode, lst, t1, t2, x;
	      x = see(0);
	      t1 = txt(1);
	      t2 = txt(2);
	      comp = if_(x, t1, lst = list(t2, t1));
	      comp.mount(demoNode = newDemoNode('if-ref'));
	      expect(demoNode.innerHTML).to.equal('21', 'mount');
	      comp.update();
	      expect(demoNode.innerHTML).to.equal('21', 'update');
	      x(1);
	      comp.update();
	      expect(demoNode.innerHTML).to.equal('1', 'update x 1');
	      x(0);
	      comp.update();
	      return expect(demoNode.innerHTML).to.equal('21', 'update x 0');
	    });
	    it('should render if_(x, p(t1), list(p(t2), t1))', function() {
	      var comp, demoNode, p1, t1, t2, x;
	      x = see(0);
	      t1 = txt(1);
	      t2 = txt(2);
	      comp = if_(x, p1 = p(t1), list(p(t2), t1));
	      comp.mount(demoNode = newDemoNode('if-ref'));
	      expect(demoNode.innerHTML).to.equal('<p>2</p>1', 'mount');
	      x(1);
	      comp.update();
	      expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1');
	      x(0);
	      comp.update();
	      expect(demoNode.innerHTML).to.equal('<p>2</p>1', 'update x 0');
	      x(1);
	      comp.update();
	      return expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1 again');
	    });
	    it('should render if_(x, p(t1), div(t2))', function() {
	      var comp, demoNode, t1, x;
	      x = see(0);
	      t1 = txt(1);
	      comp = if_(x, p(t1), div(t1));
	      comp.mount(demoNode = newDemoNode('if-ref'));
	      expect(demoNode.innerHTML).to.equal('<div>1</div>', 'mount');
	      x(1);
	      comp.update();
	      expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1');
	      x(0);
	      comp.update();
	      expect(demoNode.innerHTML).to.equal('<div>1</div>', 'update x 0');
	      x(1);
	      comp.update();
	      return expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1 again');
	    });
	    it('should render p(if_(x, p(t1), list(p(t2), t1)))', function() {
	      var comp, if1, p1, t1, t2, x;
	      x = see(0);
	      t1 = txt(1);
	      t2 = txt(2);
	      comp = p(if1 = if_(x, p1 = p(t1), list(p(t2), t1)));
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal('<p>2</p>1', 'mount');
	      comp.update();
	      expect(comp.node.innerHTML).to.equal('<p>2</p>1', 'update');
	      x(1);
	      comp.update();
	      expect(comp.node.innerHTML).to.equal('<p>1</p>', 'update x 1');
	      x(0);
	      comp.update();
	      expect(comp.node.innerHTML).to.equal('<p>2</p>1', 'update x 0');
	      x(1);
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('<p>1</p>', 'update x 1 again');
	    });
	    it('should render if_(x, p(t1), p list(p(t2), t1))', function() {
	      var comp, p1, p2, t1, t2, x;
	      x = see(0);
	      t1 = txt(1);
	      t2 = txt(2);
	      comp = if_(x, p1 = p(t1), p2 = p(list(p(t2), t1)));
	      comp.mount();
	      expect(p2.node.innerHTML).to.equal('<p>2</p>1', 'mount');
	      x(1);
	      comp.render();
	      expect(comp.node.innerHTML).to.equal('1', 'update x 1');
	      x(0);
	      comp.render();
	      return expect(p2.node.innerHTML).to.equal('<p>2</p>1', 'mount');
	    });
	    it('should render if_(x, div(1), div(2))', function() {
	      var comp, x;
	      x = see(0);
	      comp = if_(x, div(1), div(2));
	      comp.mount();
	      expect(comp.node.tagName).to.equal('DIV', 'tagName');
	      expect(comp.node.innerHTML).to.equal('2', 'mount');
	      x(1);
	      comp.update();
	      expect(comp.node.innerHTML).to.equal('1', 'first update');
	      x(0);
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('2', 'second update');
	    });
	    it('should create and update if_ with attrs', function() {
	      var c1, c2, comp, x;
	      x = see(0);
	      comp = if_({
	        "class": 'main',
	        fakeProp: x
	      }, x, c1 = p(1), c2 = p(2));
	      expect(comp).to.be["instanceof"](Tag);
	      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties before mounting');
	      comp.mount();
	      expect(comp.node.tagName).to.equal('DIV');
	      expect(comp.node.fakeProp).to.equal(0, 'mount fakeProp');
	      expect(comp.node.childNodes[0].innerHTML).to.equal('2', 'mount innerHTML');
	      expect(comp.node.childNodes[0].tagName).to.equal('P', 'mount C1 tagName');
	      expect(comp.hasActiveProperties).to.equal(false, 'hasActiveProperties after mounting');
	      x(1);
	      expect(comp.props.fakeProp).to.equal(x, 'see invalidate fakeProp');
	      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties');
	      comp.update();
	      expect(comp.node.fakeProp).to.equal(1, 'update fakeProp');
	      expect(comp.node.childNodes[0].innerHTML).to.equal('1', 'update innerHTML');
	      return expect(comp.node.childNodes[0]).to.equal(c1.node);
	    });
	    it('should create and render if followed by other node ', function() {
	      var comp, demo2Node, p1, p2, p3, pIf, x;
	      demo2Node = document.getElementById('demo2');
	      demo2Node.innerHTML = '';
	      x = see(0);
	      comp = list(pIf = if_(x, p1 = p(1), p2 = p(2)), p3 = p(3));
	      comp.mount(demo2Node);
	      expect(pIf.node.innerHTML).to.equal('2');
	      expect(demo2Node.innerHTML).to.equal('<p>2</p><p>3</p>');
	      x(1);
	      comp.update();
	      expect(pIf.node.innerHTML).to.equal('1', 'pif update');
	      expect(demo2Node.innerHTML).to.equal('<p>1</p><p>3</p>', 'demo2Node update');
	      return expect(comp.node[0].innerHTML).to.equal('1', 'comp update');
	    });
	    it('should create and render embedded if', function() {
	      var c0, c1, c2, comp, x;
	      x = see(0);
	      comp = list(text(x), c0 = if_(x, c1 = div(1), c2 = div(2)));
	      comp.mount();
	      expect(comp.parentNode).to.equal(document.body);
	      expect(comp.node[1].innerHTML).to.equal('2');
	      expect(c0.parentNode).to.equal(comp.parentNode);
	      x(1);
	      comp.update();
	      expect(c0.parentNode).to.equal(comp.parentNode);
	      expect(c0.node.innerHTML).to.equal('1');
	      expect(c2.node.innerHTML).to.equal('2');
	      expect(c0.node).to.equal(c1.node);
	      return expect(comp.node[1]).to.equal(c1.node);
	    });
	    it('should process event in embedded if 2', function() {
	      var comp, pIf, t1, x;
	      x = see(0);
	      comp = list(t1 = text({
	        onchange: function() {
	          x(parseInt(this.value));
	          return comp.update();
	        }
	      }, x), pIf = if_(x, div(1), div(2)));
	      comp.mount();
	      expect(pIf.node.innerHTML).to.equal('2');
	      t1.node.value = 1;
	      t1.node.onchange();
	      expect(pIf.node.innerHTML).to.equal('1');
	      t1.node.value = 0;
	      t1.node.onchange();
	      return expect(pIf.node.innerHTML).to.equal('2');
	    });
	    return it('should process embedded if 2', function() {
	      var comp, pIf, t1, x;
	      x = see(0);
	      comp = list(t1 = text(x), pIf = if_(x, div(1), div(2)));
	      comp.mount();
	      expect(pIf.node.innerHTML).to.equal('2');
	      x(1);
	      comp.update();
	      expect(pIf.node.innerHTML).to.equal('1');
	      x(0);
	      comp.update();
	      return expect(pIf.node.innerHTML).to.equal('2');
	    });
	  });
	  describe('Case', function() {
	    return it('should create and render case_', function() {
	      var comp, x;
	      x = see(0);
	      comp = case_(x, {
	        1: p(1),
	        2: p(2),
	        3: p(3)
	      }, 'others');
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](window.Text);
	      expect(comp.node.textContent).to.equal('others');
	      x(1);
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('1');
	    });
	  });
	  return describe('Func', function() {
	    it('func(->12) ', function() {
	      var comp;
	      comp = func(function() {
	        return 12;
	      });
	      comp.mount();
	      expect(comp.node.textContent).to.equal('12');
	      comp.update();
	      expect(comp.node.textContent).to.equal('12');
	      comp.update();
	      return expect(comp.node.textContent).to.equal('12');
	    });
	    it('p(-> a))', function() {
	      var comp;
	      a = see(1);
	      comp = p(a);
	      comp.mount();
	      a(2);
	      comp.update();
	      expect(comp.node.innerHTML).to.equal('2', 'update a 2');
	      a(3);
	      comp.update();
	      a(4);
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('4', 'update a 4');
	    });
	    it('should  create func component', function() {
	      var comp, x;
	      x = see(1);
	      comp = func(x);
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](window.Text);
	      return expect(comp.node.textContent).to.equal('1');
	    });
	    it('should create and  render func', function() {
	      var comp, x;
	      x = see(0);
	      comp = func(flow(x, function() {
	        return {
	          1: p(1),
	          2: p(2),
	          3: p(3)
	        }[x()] || 'others';
	      }));
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](window.Text);
	      expect(comp.node.textContent).to.equal('others');
	      x(1);
	      comp.update();
	      expect(comp.node.innerHTML).to.equal('1');
	      x(2);
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('2');
	    });
	    it('should create and update func with  attrs', function() {
	      var comp, x;
	      x = see(1);
	      comp = func({
	        "class": 'main',
	        fakeProp: x
	      }, x);
	      comp.mount();
	      expect(comp.node.tagName).to.equal('DIV');
	      expect(comp.node.fakeProp).to.equal(1);
	      expect(comp.node).to.be["instanceof"](Element);
	      expect(comp.node.childNodes[0].textContent).to.equal('1');
	      x(2);
	      comp.update();
	      expect(comp.node.fakeProp).to.equal(2);
	      return expect(comp.node.childNodes[0].textContent).to.equal('2');
	    });
	    return it('should process tag with function', function() {
	      var comp;
	      comp = p(txt(function() {
	        return 1;
	      }));
	      expect(comp.children[0]).to.be["instanceof"](Text);
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('1');
	    });
	  });
	});


/***/ },
/* 20 */
/*!******************************************!*\
  !*** ./test/mocha/test-list-each.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, List, Tag, Text, TransformComponent, a, accordion, accordionGroup, all, bind, case_, div, each, every, expect, func, idescribe, if_, iit, isComponent, list, nItems, ndescribe, newDemoNode, nit, p, pour, see, span, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, newDemoNode = _ref.newDemoNode;

	newDemoNode = __webpack_require__(/*! ./helper */ 17).newDemoNode;

	isComponent = dc.isComponent, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, List = dc.List, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, each = dc.each, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div, all = dc.all, every = dc.every, nItems = dc.nItems, bind = dc.bind, pour = dc.pour, see = dc.see;

	describe('list, each', function() {
	  describe('List', function() {
	    it('all of item in list should be  component', function() {
	      var comp;
	      comp = list([1, 2]);
	      return expect(!!isComponent(comp.children[0])).to.equal(true);
	    });
	    it('should create list component', function() {
	      var comp;
	      comp = list([span(['adf'])]);
	      comp.mount();
	      return expect(comp.node[0].tagName).to.equal('SPAN');
	    });
	    it('component list should have length', function() {
	      var lst;
	      lst = list([1, 2]);
	      return expect(lst.children.length).to.equal(2);
	    });
	    it('list can be constructructed  from mulitple argumnents', function() {
	      var lst;
	      lst = list(1, 2);
	      return expect(lst.children.length).to.equal(2);
	    });
	    it('should create list', function() {
	      var lst;
	      lst = list(1, 2);
	      lst.mount();
	      expect(lst.node[0].textContent).to.equal('1');
	      return expect(lst.node[1].textContent).to.equal('2');
	    });
	    it('should create list with attrs', function() {
	      var comp, x;
	      x = 2;
	      comp = list({
	        "class": 'main',
	        fakeProp: function() {
	          return x;
	        }
	      }, 1, txt(function() {
	        return x;
	      }));
	      comp.mount();
	      expect(comp.node.tagName).to.equal('DIV');
	      expect(comp.node.childNodes[0].textContent).to.equal('1');
	      expect(comp.node.childNodes[1].textContent).to.equal('2');
	      x = 3;
	      comp.update();
	      expect(comp.node.fakeProp).to.equal(3);
	      return expect(comp.node.childNodes[1].textContent).to.equal('3', 'textContent update');
	    });
	    it('list(txt(->12))', function() {
	      var comp;
	      comp = list(txt(function() {
	        return 12;
	      }));
	      comp.mount();
	      return expect(comp.node.textContent).to.equal('12');
	    });
	    it('list setChildren after mounting', function() {
	      var comp;
	      comp = new List([txt(1)]);
	      comp.mount();
	      expect(comp.node[0].textContent).to.equal('1');
	      return expect(function() {
	        var t2;
	        return comp.setChildren(1, t2 = txt(2));
	      }).not.to["throw"]();
	    });
	    it('list setChildren: similar to splitter', function() {
	      var comp, t2, t3;
	      comp = new List([txt(1), t3 = txt(3)]);
	      comp.setChildren(1, t2 = txt(2), t3);
	      comp.mount();
	      expect(comp.node[0].textContent).to.equal('1');
	      expect(comp.node[1].textContent).to.equal('2');
	      return expect(comp.node[2].textContent).to.equal('3');
	    });
	    it('list(p(txt(->12))) ', function() {
	      var comp;
	      comp = list(p(txt(function() {
	        return 12;
	      })));
	      comp.mount();
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('12');
	    });
	    it('list(p(->12)) ', function() {
	      var comp;
	      comp = list(p(function() {
	        return 12;
	      }));
	      comp.mount();
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('12');
	    });
	    return it('list(txt(1)) ', function() {
	      var comp, demoNode;
	      comp = new List([txt(1)]);
	      comp.mount(demoNode = newDemoNode('list'));
	      comp.update();
	      comp.setLength(0);
	      comp.update();
	      return expect(demoNode.innerHTML).to.equal('');
	    });
	  });
	  describe('every, all, nItems', function() {
	    it('every ', function() {
	      var comp, demoNode;
	      comp = every([1, 2], function(item) {
	        return item;
	      });
	      comp.mount(demoNode = newDemoNode('list'));
	      comp.update();
	      return expect(comp.node.length).to.equal(2);
	    });
	    it('all ', function() {
	      var comp, demoNode;
	      comp = all({
	        a: 1,
	        b: 2
	      }, function(key, value) {
	        return list(key, value);
	      });
	      comp.mount(demoNode = newDemoNode('list'));
	      comp.update();
	      return expect(comp.node.length).to.equal(2);
	    });
	    return it('nItems ', function() {
	      var comp, demoNode;
	      comp = nItems(2, function(index) {
	        return index;
	      });
	      comp.mount(demoNode = newDemoNode('list'));
	      comp.update();
	      return expect(comp.node.length).to.equal(2);
	    });
	  });
	  return describe('Each', function() {
	    it('should create empty each component', function() {
	      var comp, lst;
	      comp = each(lst = [], function(item, i) {
	        return p(item);
	      });
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](Array);
	      expect(comp.node.length).to.equal(0);
	      comp.update();
	      return expect(comp.node.length).to.equal(0);
	    });
	    it('should create each component with single item', function() {
	      var comp, lst;
	      comp = each(lst = [1], function(item, i) {
	        return p(item);
	      });
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](Array);
	      expect(comp.node.length).to.equal(1);
	      expect(comp.node[0].innerHTML).to.equal('1');
	      comp.update();
	      expect(comp.node.length).to.equal(1);
	      return expect(comp.node[0].innerHTML).to.equal('1');
	    });
	    it('should set childrenNextNode correctly', function() {
	      var comp, each1, lst;
	      lst = [1, 2];
	      comp = list((each1 = each(lst, function(item) {
	        return p(item);
	      })), 'some other thing');
	      comp.mount();
	      expect(each1.listComponent.childrenNextNode).to.equal(comp.node[1]);
	      lst.push(3);
	      comp.render();
	      return expect(each1.listComponent.children[2].nextNode).to.equal(comp.node[1]);
	    });
	    it('should create each component with two item', function() {
	      var comp, lst;
	      comp = each(lst = ['each', 'simple'], function(item, i) {
	        return p(item);
	      });
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](Array);
	      expect(comp.node[0]).to.be["instanceof"](Element);
	      return expect(comp.node[1].innerHTML).to.equal('simple');
	    });
	    it('should mount and render each component', function() {
	      var comp, demoNode, lst;
	      document.getElementById('demo').innerHTML = '';
	      comp = each(lst = ['each', 'simple'], function(item, i) {
	        return p(item);
	      });
	      comp.mount(demoNode = newDemoNode("each"));
	      expect(comp.node[0].innerHTML).to.equal('each');
	      expect(comp.node[1].innerHTML).to.equal('simple');
	      lst.setItem(0, 3);
	      comp.update();
	      expect(comp.node[0].innerHTML).to.equal('3', 'update node 0');
	      lst.setItem(1, 4);
	      comp.update();
	      expect(comp.node[1].innerHTML).to.equal('4', 'update node 1');
	      expect(demoNode.innerHTML).to.equal('<p>3</p><p>4</p>', 'update innerHTML');
	      lst.setItem(2, 5);
	      comp.update();
	      expect(comp.node[2].innerHTML).to.equal('5', 'update list[2] = 5');
	      lst.setLength(0);
	      comp.update();
	      expect(comp.listComponent.children.length).to.equal(0, 'comp.listComponent.children.length = 0');
	      return expect(comp.node.length).to.equal(0, 'node.length');
	    });
	    it('should process binding on item', function() {
	      var comp, lst;
	      document.getElementById('demo').innerHTML = '';
	      comp = each(lst = [
	        {
	          text: 'a'
	        }, {
	          text: 'b'
	        }
	      ], (function(item, i) {
	        return p(txt(bind(item, 'text')));
	      }));
	      comp.mount("#demo");
	      expect(comp.node[0].textContent).to.equal('a');
	      expect(comp.node[1].textContent).to.equal('b');
	      lst[0].text = 'c';
	      comp.update();
	      expect(comp.node[0].textContent).to.equal('c', 'update c');
	      lst[1].text = 'd';
	      comp.update();
	      expect(comp.node[1].textContent).to.equal('d', 'update d');
	      lst.setItem(2, {
	        text: 'e'
	      });
	      comp.update();
	      expect(comp.node[2].textContent).to.equal('e');
	      lst.setLength(0);
	      comp.update();
	      return expect(comp.node.length).to.equal(0);
	    });
	    it('should process items in template function', function() {
	      var comp, lst;
	      comp = each(lst = ['a', 'b'], (function(item, i, items, eachComponent) {
	        return p(txt(function() {
	          return items[i];
	        }));
	      }));
	      comp.mount();
	      lst.setItem(0, 'c');
	      comp.update();
	      return expect(comp.node[0].textContent).to.equal('c');
	    });
	    it('should process tag with each', function() {
	      var comp, each1, text1, x;
	      x = 1;
	      text1 = null;
	      comp = new Tag('div', {}, [
	        each1 = each([1], pour(function(item) {
	          return text1 = txt(x);
	        }))
	      ]);
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal('1');
	      x = 2;
	      comp.update();
	      expect(text1.node.textContent).to.equal('2', 'update, 2');
	      expect(each1.node[0].textContent).to.equal('2');
	      return expect(comp.node.innerHTML).to.equal('2');
	    });
	    it('should create and update renew function as list of Each', function() {
	      var comp, x;
	      x = 1;
	      comp = each((function() {
	        return [x];
	      }), function(item) {
	        return txt(item);
	      });
	      comp.mount();
	      expect(comp.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.update();
	      return expect(comp.node[0].textContent).to.equal('2', 'update 2');
	    });
	    it('should create and update deeper embedded each', function() {
	      var comp, each1, span1, x;
	      x = 1;
	      comp = div({}, span1 = new Tag('span', {}, [
	        each1 = each((function() {
	          return [x];
	        }), function(item) {
	          return txt(item);
	        })
	      ]));
	      comp.mount();
	      expect(each1.listComponent.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.update();
	      expect(each1.listComponent.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('2');
	      return expect(comp.node.innerHTML).to.equal('<span>2</span>');
	    });
	    it('should create and update embedded each in 3 layer', function() {
	      var comp, each1, span1, x;
	      x = see(1);
	      comp = div({}, div({}, span1 = new Tag('span', {}, [
	        each1 = each([1], function(item) {
	          return txt(x);
	        })
	      ])));
	      comp.mount();
	      expect(each1.listComponent.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('1');
	      x(2);
	      comp.update();
	      expect(each1.listComponent.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('2');
	      return expect(comp.node.innerHTML).to.equal('<div><span>2</span></div>');
	    });
	    it('should create and update embedded each in 3  layer', function() {
	      var comp, each1, span1, x;
	      x = 1;
	      comp = div({}, div({}, span1 = new Tag('span', {}, [
	        each1 = each((function() {
	          return [x];
	        }), function(item) {
	          return txt(item);
	        })
	      ])));
	      comp.mount();
	      expect(each1.listComponent.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.update();
	      expect(each1.listComponent.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('2');
	      return expect(comp.node.innerHTML).to.equal('<div><span>2</span></div>');
	    });
	    it('should process each under each', function() {
	      var comp, each1, each2, x;
	      x = 1;
	      each2 = null;
	      comp = div({}, each1 = each([1], function() {
	        return each2 = each((function() {
	          return [x];
	        }), function(item) {
	          return item;
	        });
	      }));
	      comp.mount();
	      expect(each1.listComponent.parentNode).to.equal(comp.node);
	      expect(each1.node[0][0].textContent).to.equal('1');
	      expect(each2.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.update();
	      expect(each1.listComponent.parentNode).to.equal(comp.node);
	      expect(each2.node[0].textContent).to.equal('2');
	      return expect(comp.node.innerHTML).to.equal('2');
	    });
	    it('should mount and update each', function() {
	      var comp;
	      comp = new Tag('span', {}, [
	        each([1], function(item) {
	          return txt(1);
	        })
	      ]);
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal('1');
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('1');
	    });
	    it('should push and setLength of each', function() {
	      var comp, lst;
	      lst = [1, 2, 3, 4, 5, 6];
	      comp = each(lst, function(item) {
	        return txt(item);
	      });
	      comp.mount();
	      lst.push(7);
	      comp.update();
	      expect(comp.node.length).to.equal(7, 'push 7');
	      lst.setLength(4);
	      comp.update();
	      return expect(comp.node.length).to.equal(4, 'setLength 4');
	    });
	    it('should update each with component as the item of list 1', function() {
	      var comp, s;
	      comp = each([txt(1)], function(item) {
	        return item;
	      });
	      comp.mount();
	      expect(comp.node[0].textContent).to.equal(s = '1');
	      comp.update();
	      return expect(comp.node[0].textContent).to.equal('1');
	    });
	    it('should update each with component as the item of list 2', function() {
	      var comp, s;
	      comp = div(each([txt(1)], function(item) {
	        return item;
	      }));
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal(s = '1');
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('1');
	    });
	    it('should update each with component as the item of list 3', function() {
	      var comp, s;
	      comp = div(div(each([txt(1)], function(item) {
	        return item;
	      })));
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal(s = '<div>1</div>');
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('<div>1</div>');
	    });
	    return it('should always attach and detach each in multiple iteration', function() {
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
	      comp.render();
	      expect(comp.node.parentNode).to.equal(document.body);
	      showingEach$(false);
	      comp.render();
	      return expect(comp.node.parentNode).not.to.equal(document.body);
	    });
	  });
	});


/***/ },
/* 21 */
/*!******************************************!*\
  !*** ./test/mocha/test-ref-clone.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, Tag, Text, TransformComponent, a, case_, clone, div, each, expect, func, idescribe, if_, iit, list, ndescribe, nit, p, see, span, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	see = dc.see, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, each = dc.each, clone = dc.clone, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

	describe('Component.refs, clone', function() {
	  describe('refs', function() {
	    it('should throw error while constucting conflicted component list(t, t))', function() {
	      var t;
	      t = txt(1);
	      return expect(function() {
	        return list(t, t);
	      }).to["throw"](Error);
	    });
	    it('should throw error while constucting conflicted component list(t, p(t)))', function() {
	      var t;
	      t = txt(1);
	      return expect(function() {
	        return list(t, p(t));
	      }).to["throw"](Error);
	    });
	    it('should throw error while conflicted component in list(p(t), if_(1, t, 0))', function() {
	      var t;
	      t = txt(1);
	      return expect(function() {
	        return list(p(t), if_(1, t, 0));
	      }).to["throw"](Error);
	    });
	    it('should throw error while conflicted component in list(p(t), if_(0, 2, t))', function() {
	      var t;
	      t = txt(1);
	      return expect(function() {
	        return list(p(t), if_(0, 2, t));
	      }).to["throw"](Error);
	    });
	    it('should throw error while conflicted component in list(p(t), if_(-> x, t, t))', function() {
	      var t, x;
	      t = txt(1);
	      x = 0;
	      return expect(function() {
	        return list(p(t), if_((function() {
	          return x;
	        }), t, t));
	      }).to["throw"](Error);
	    });
	    it('should throw error while conflicted component in list(p(t), if_(-> x, p(t), t))', function() {
	      var t, x;
	      t = txt(1);
	      x = 0;
	      return expect(function() {
	        return list(p(t), if_((function() {
	          return x;
	        }), p(t), t));
	      }).to["throw"](Error);
	    });
	    return it('should getBaseComponent of if_((-> x), t=txt(1), t)', function() {
	      var comp, t, x;
	      x = see(0);
	      comp = if_(x, t = txt(1), t);
	      comp.mount();
	      return comp.update();
	    });
	  });
	  return describe('Clone', function() {
	    it('should not clone node event handler', function() {
	      var node, node2;
	      node = document.createElement('p');
	      node.value = 1;
	      node.fakeProp = 2;
	      node.onclick = function() {};
	      node2 = node.cloneNode();
	      expect(node2.onclick).to.equal(null);
	      expect(node2.value).to.equal(void 0);
	      return expect(node2.fakeProp).to.equal(void 0);
	    });
	    it('should clone TextNode', function() {
	      var node, node2;
	      node = document.createTextNode('afd');
	      node.value = 1;
	      node.fakeProp = 2;
	      node.onclick = function() {};
	      node2 = node.cloneNode();
	      expect(node2.onclick).to.equal(void 0);
	      expect(node2.textContent).to.equal('afd');
	      expect(node2.value).to.equal(void 0);
	      return expect(node2.fakeProp).to.equal(void 0);
	    });
	    it('should process text clone component ', function() {
	      var comp, t1;
	      comp = list(t1 = txt(1), clone(t1));
	      comp.mount('#demo');
	      comp.update();
	      return expect(comp.node[1].textContent).to.equal('1');
	    });
	    it('should process tag clone component ', function() {
	      var c1, c2, comp;
	      comp = list(c1 = p(1), c2 = clone(c1));
	      comp.mount('#demo');
	      comp.update();
	      return expect(comp.node[1].innerHTML).to.equal('1');
	    });
	    return it('should process if_ clone component ', function() {
	      var c1, c2, comp, lstComp, x;
	      x = see(0);
	      lstComp = list(c1 = p(2), c2 = clone(c1));
	      comp = if_(x, c1 = p(3), lstComp);
	      comp.mount('#demo');
	      x(1);
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('3');
	    });
	  });
	});


/***/ },
/* 22 */
/*!******************************************!*\
  !*** ./test/mocha/test-accordion.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, Tag, Text, TransformComponent, a, accordion, accordionGroup, case_, div, each, expect, func, idescribe, if_, iit, list, ndescribe, nit, p, span, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, each = dc.each, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

	describe('accordion', function() {
	  it('should update accordionGroup', function() {
	    var comp, s;
	    comp = accordionGroup({}, 'group head', each([1], function(item) {
	      return txt(1);
	    }), {});
	    comp.mount();
	    expect(comp.node.innerHTML).to.equal(s = '<div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body">1</div></div>');
	    comp.update();
	    return expect(comp.node.innerHTML).to.equal(s);
	  });
	  it('should update accordion group 2', function() {
	    var comp;
	    comp = accordionGroup({}, 'group head', new Tag('span', {}, [
	      each([1], function(item) {
	        return txt(1);
	      })
	    ]), {});
	    comp.mount();
	    return expect(comp.node.innerHTML).to.equal('<div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div>');
	  });
	  it('should mount accordion', function() {
	    var comp;
	    comp = accordion({}, [
	      [
	        {}, 'group head', new Tag('span', {}, [
	          each([1], function(item) {
	            return txt(1);
	          })
	        ]), {}
	      ]
	    ], {});
	    comp.mount();
	    return expect(comp.node.innerHTML).to.equal('<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div></div>');
	  });
	  it('should update accordion', function() {
	    var comp, s;
	    comp = accordion({}, [[{}, 'group head', txt(1), {}]], {});
	    comp.mount();
	    expect(comp.node.innerHTML).to.equal(s = '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body">1</div></div></div>');
	    comp.update();
	    return expect(comp.node.innerHTML).to.equal(s);
	  });
	  return it('should update accordion 2', function() {
	    var comp, s;
	    comp = accordion({}, [
	      [
	        {}, 'group head', new Tag('span', {}, [
	          each([1], function(item) {
	            return txt(1);
	          })
	        ]), {}
	      ]
	    ], {});
	    comp.mount();
	    expect(comp.node.innerHTML).to.equal(s = '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div></div>');
	    comp.update();
	    return expect(comp.node.innerHTML).to.equal(s);
	  });
	});


/***/ },
/* 23 */
/*!************************************************!*\
  !*** ./test/mocha/test-component-event.coffee ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, List, Tag, Text, a, button, classFn, div, duplex, expect, func, idescribe, if_, iit, input, li, list, model, ndescribe, nit, p, see, show, span, styleFrom, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	duplex = dc.duplex, see = dc.see, classFn = dc.classFn, styleFrom = dc.styleFrom, model = dc.model, show = dc.show, Tag = dc.Tag, Text = dc.Text, List = dc.List, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, txt = dc.txt, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, button = dc.button, input = dc.input;

	describe("component event", function() {
	  describe('beforeMount', function() {
	    it('component shoud call listeners before mounting', function() {
	      var comp, x;
	      x = 0;
	      comp = p();
	      comp.on('beforeMount', function() {
	        return x = 1;
	      });
	      comp.mount();
	      return expect(x).to.equal(1);
	    });
	    it('component shoud call listeners before mounting if_', function() {
	      var comp, x;
	      x = 0;
	      comp = if_(1, 2, 3);
	      comp.on('beforeMount', function() {
	        return x = 1;
	      });
	      comp.mount();
	      return expect(x).to.equal(1);
	    });
	    it('component shoud call then_.listeners before updating if_', function() {
	      var comp, t, x;
	      x = see(0);
	      comp = if_(x, t = txt(1), txt(2));
	      t.on('beforeMount', function() {
	        return x(1);
	      });
	      comp.mount();
	      expect(x()).to.equal(0);
	      x(1);
	      comp.update();
	      return expect(x()).to.equal(1);
	    });
	    return it('component shoud not call embeded listeners before updating if_', function() {
	      var comp, t, x;
	      x = see(0);
	      comp = if_(x, p(t = txt(1)), txt(2));
	      t.on('beforeMount', function() {
	        return x(1);
	      });
	      comp.mount();
	      expect(x()).to.equal(0);
	      x(1);
	      comp.update();
	      return expect(x()).to.equal(1);
	    });
	  });
	  return describe('afterUnmount callback', function() {
	    it('component shoud call listeners after mounting', function() {
	      var comp, x;
	      x = see(0);
	      comp = p();
	      comp.on('beforeMount', function() {
	        return x(1);
	      });
	      comp.on('afterUnmount', function() {
	        return x(2);
	      });
	      comp.mount();
	      expect(x()).to.equal(1);
	      comp.unmount();
	      return expect(x()).to.equal(2);
	    });
	    it('component shoud call listeners before mounting if_', function() {
	      var comp, x, y;
	      x = 0;
	      y = 0;
	      comp = if_(1, 2, 3);
	      comp.on('beforeMount', function() {
	        return x = 1;
	      });
	      comp.on('afterMount', function() {
	        return y = 2;
	      });
	      comp.mount();
	      expect(x).to.equal(1);
	      comp.unmount();
	      return expect(y).to.equal(2);
	    });
	    it('component shoud NOT call then_.listeners["beforeMount"] before updating if_', function() {
	      var comp, t, t2, x, y;
	      x = see(0);
	      y = 0;
	      comp = if_(x, t = txt(1), t2 = txt(2));
	      t.on('beforeMount', function() {
	        return x(1);
	      });
	      t2.on('afterUnmount', function() {
	        return y = 2;
	      });
	      comp.mount();
	      expect(x()).to.equal(0, 'mount');
	      x(1);
	      comp.update();
	      expect(x()).to.equal(1);
	      return expect(y).to.equal(0);
	    });
	    return it('component shoud NOT call embeded mountCallback before updating if_', function() {
	      var comp, t, t2, x, y;
	      x = see(0);
	      y = 0;
	      comp = if_(x, p(t = txt(1)), p(t2 = txt(2)));
	      t.on('beforeMount', function() {
	        return x(1);
	      });
	      t2.on('afterMount', function() {
	        return y = 2;
	      });
	      comp.mount();
	      expect(x()).to.equal(0);
	      x(1);
	      comp.update();
	      expect(x()).to.equal(1);
	      return expect(y).to.equal(0);
	    });
	  });
	});


/***/ },
/* 24 */
/*!**************************************!*\
  !*** ./test/mocha/test-route.coffee ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var Nothing, expect, idescribe, iit, isComponent, ndescribe, nit, rePattern, rePatternTotal, route, slashs, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	rePatternTotal = /^((:([$_\w]+)(\([^\(\)]+\))?)|(\([^\(\)]+\))|([^:\(]*))+$/;

	rePattern = /^((:([$_\w]+)(\([^\(\)]+\))?)|(\([^\(\)]+\))|([^:\(]+))/;

	slashs = /(?:\\\/)|(?:\\\()|(?:\\\))/;

	isComponent = dc.isComponent, route = dc.route, txt = dc.txt, Nothing = dc.Nothing;

	describe('route', function() {
	  describe('route regexp', function() {
	    it('should match paramName pattern', function() {
	      var params;
	      params = {};
	      route._processPiecePatterns(':dsaf', params);
	      expect(params.dsaf).to.equal(true, ':dsaf');
	      route._processPiecePatterns(':$', params);
	      expect(params.$).to.equal(true, ':$');
	      route._processPiecePatterns(':_', params);
	      return expect(params._).to.equal(true, ':_');
	    });
	    it('should match cureved re', function() {
	      var params, pat;
	      params = {};
	      pat = route._processPiecePatterns('(fd+=.)', params, 2);
	      expect(pat[0][0].key).to.equal(2, '(fd+=.)');
	      return expect(pat[1]).to.equal(3, '(fd+=.)');
	    });
	    it('should match param and string', function() {
	      var params, pat;
	      params = {};
	      pat = route._processPiecePatterns(':a(dsaf)asdfj', params, 2);
	      expect(pat[0][0].key).to.equal('a');
	      return expect(pat[1]).to.equal(2, '(fd+=.)');
	    });
	    it('should match param and string 2', function() {
	      var params, pat;
	      params = {};
	      pat = route._processPiecePatterns(':abc_$(dsaf)asdfj(&*^)+_', params, 2);
	      expect(pat[0][0].key).to.equal('abc_$');
	      return expect(pat[1]).to.equal(3, '(fd+=.)');
	    });
	    it('should match param and string 3', function() {
	      var params, pat;
	      params = {};
	      pat = route._processPiecePatterns('_):_$a(dsaf)asdfj(&*^)+_', params, 2);
	      expect(pat[0][1].key).to.equal('_$a');
	      return expect(pat[1]).to.equal(3, '(fd+=.)');
	    });
	    it('should match param and string 3', function() {
	      var params, pat;
	      params = {};
	      pat = route._processPiecePatterns('_):_$a(dsaf):b:c-asdfj(&*^)+_', params, 2);
	      expect(pat[0][1].key).to.equal('_$a');
	      return expect(pat[1]).to.equal(3, '(fd+=.)');
	    });
	    it('should throw while wrong paramName pattern', function() {
	      return expect(function() {
	        var params;
	        return route._processPiecePatterns(':', params = {});
	      }).to["throw"]();
	    });
	    it('should throw while wrong paramName pattern 1', function() {
	      return expect(function() {
	        var params;
	        return route._processPiecePatterns(':+', params = {});
	      }).to["throw"]();
	    });
	    it('should throw while wrong paramName pattern 2', function() {
	      return expect(function() {
	        var params;
	        return route._processPiecePatterns('(dfj()', params = {});
	      }).to["throw"]();
	    });
	    it('should throw while wrong paramName pattern 3', function() {
	      return expect(function() {
	        var params;
	        return route._processPiecePatterns('()', params = {});
	      }).to["throw"]();
	    });
	    it('should throw while wrong paramName pattern 4', function() {
	      return expect(function() {
	        var params;
	        return route._processPiecePatterns(':(dsaf)', params = {});
	      }).to["throw"]();
	    });
	    return it('should throw while wrong paramName pattern 5', function() {
	      return expect(function() {
	        var params;
	        return route._processPiecePatterns('(', params = {});
	      }).to["throw"]();
	    });
	  });
	  describe('test private function', function() {
	    it('should _getRoutePattern', function() {
	      var pattern;
	      pattern = route._getRoutePattern('a/');
	      return expect(pattern.endSlash).to.equal(true);
	    });
	    it('should _processPatternRouteItem', function() {
	      var comp;
	      comp = route._processRouteItem([
	        {
	          absolute: true,
	          segmentPatterns: [],
	          baseIndex: 0
	        }, function() {
	          return 1;
	        }
	      ], "", 0);
	      expect(!!comp).to.equal(true);
	      return expect(comp.text).to.equal(1);
	    });
	    return it('should _getRoutePattern and _processPatternRouteItem', function() {
	      var comp;
	      comp = route._processRouteItem([
	        route._getRoutePattern(''), function() {
	          return txt(1);
	        }
	      ], "", 0);
	      expect(!!comp).to.equal(true);
	      return expect(comp.text).to.equal(1);
	    });
	  });
	  describe('process route', function() {
	    it("should route 'a'", function() {
	      var comp, content;
	      comp = route('a', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal(1);
	    });
	    it("should route 'a/b' on path 'a'", function() {
	      var comp, content;
	      comp = route('a/b', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a';
	      };
	      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
	    });
	    it("should not route 'a/' on path 'a'", function() {
	      var comp, content;
	      comp = route('a/', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a';
	      };
	      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
	    });
	    it("should not route 'a' on path 'a/'", function() {
	      var comp, content;
	      comp = route('a', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a/';
	      };
	      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
	    });
	    it("should route '*' on path 'a'", function() {
	      var comp, content;
	      comp = route('*', function(match) {
	        return match.segments[0];
	      });
	      comp.getPath = function() {
	        return 'a';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal('a');
	    });
	    it("should route '(\w+)' on path 'a'", function() {
	      var comp, content;
	      comp = route('(\\w+)', function(match) {
	        return match.items[0];
	      });
	      comp.getPath = function() {
	        return 'a';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.children[0].text).to.equal('a');
	    });
	    it("should not route '*' on path 'a/'", function() {
	      var comp, content;
	      comp = route('*', function(match) {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a/';
	      };
	      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
	    });
	    it("should not route '*/' on path 'a'", function() {
	      var comp, content;
	      comp = route('*/', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a';
	      };
	      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
	    });
	    it("should route 'a/b'", function() {
	      var comp, content;
	      comp = route('a/b', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a/b';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal(1);
	    });
	    it("should route multi item", function() {
	      var comp, content;
	      comp = route('a/1', (function() {
	        return 1;
	      }), 'a/2', function() {
	        return 2;
	      });
	      comp.getPath = function() {
	        return 'a/2';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal(2);
	    });
	    it("should route multi item with otherwise", function() {
	      var comp, content;
	      comp = route('a/1', (function() {
	        return 1;
	      }), 'a/2', function() {
	        return 2;
	      }, txt('otherwise'));
	      comp.getPath = function() {
	        return 'a/otherwise';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal('otherwise');
	    });
	    it("should route 'a/**' on path a/b", function() {
	      var comp, content;
	      comp = route('a/**', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a/b';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal(1);
	    });
	    it("should route 'a/*/**' on path a/b", function() {
	      var comp, content;
	      comp = route('a/*/**', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a/b';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal(1);
	    });
	    it("should route 'a/*/*/**' on path a/b", function() {
	      var comp, content;
	      comp = route('a/*/*/**', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a/b';
	      };
	      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
	    });
	    return it("should route embedding route", function() {
	      var comp, comp2, content;
	      comp = route('a/**', function(match, route2) {
	        return route2('b', function() {
	          return 2;
	        });
	      });
	      comp.getPath = function() {
	        return 'a/b';
	      };
	      content = comp.getContentComponent();
	      content.getPath = function() {
	        return 'a/b';
	      };
	      comp2 = content.getContentComponent();
	      expect(!!comp2).to.equal(true);
	      return expect(comp2.text).to.equal(2);
	    });
	  });
	  describe('multiple level route', function() {
	    var comp;
	    comp = route('a/*/**', function(match, route2) {
	      return route2(1, (function() {
	        return 1;
	      }), 2, function() {
	        return 2;
	      }, 3, function() {
	        return 3;
	      }, {
	        otherwise: 'otherwise 2'
	      });
	    }, 'b/**', function() {
	      return 'b/**';
	    }, {
	      otherwise: 'otherwise 1'
	    });
	    it("should route a/b/3", function() {
	      var comp2, content;
	      comp.getPath = function() {
	        return 'a/b/3';
	      };
	      content = comp.getContentComponent();
	      content.getPath = function() {
	        return 'a/b/3';
	      };
	      comp2 = content.getContentComponent();
	      expect(!!comp2).to.equal(true);
	      return expect(comp2.text).to.equal(3);
	    });
	    it("should route b/2", function() {
	      var content;
	      comp.getPath = function() {
	        return 'b/2';
	      };
	      content = comp.getContentComponent();
	      expect(!!content).to.equal(true);
	      return expect(content.text).to.equal('b/**');
	    });
	    it("should route not-found", function() {
	      var content;
	      comp.getPath = function() {
	        return 'not-found';
	      };
	      content = comp.getContentComponent();
	      expect(!!content).to.equal(true);
	      return expect(content.text).to.equal('otherwise 1');
	    });
	    return it("should route a/b/no-entry", function() {
	      var comp2, content;
	      comp.getPath = function() {
	        return 'a/b/no-entry';
	      };
	      content = comp.getContentComponent();
	      content.getPath = function() {
	        return 'a/b/no-entry';
	      };
	      comp2 = content.getContentComponent();
	      expect(!!comp2).to.equal(true);
	      return expect(comp2.text).to.equal('otherwise 2');
	    });
	  });
	  return describe('process route.to', function() {
	    it("should route.to", function() {
	      expect(route._navigateTo('a/b/c', '../x', 2)).to.equal('a/x');
	      expect(route._navigateTo('a/b/c', 'f', 2)).to.equal('a/b/f');
	      expect(route._navigateTo('a/b/c', '/f', 2)).to.equal('f');
	      expect(route._navigateTo('a/b/c', '/f/', 2)).to.equal('f/');
	      return expect(route._navigateTo('a/b/c', './f/', 2)).to.equal('a/b/f/');
	    });
	    return it("should route.to 2", function() {
	      expect(route._navigateTo('a/b/c', '../../f/', 2)).to.equal('f/');
	      return expect(route._navigateTo('a/b/c', '../../../f/', 2)).to.equal('f/');
	    });
	  });
	});


/***/ },
/* 25 */
/*!*****************************************!*\
  !*** ./test/mocha/test-for-demo.coffee ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, List, Tag, Text, a, bindings, button, classFn, controls, div, duplex, each, expect, extendAttrs, flow, func, idescribe, if_, iit, input, li, list, ndescribe, nit, p, see, span, styleFrom, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	bindings = dc.bindings, duplex = dc.duplex, flow = dc.flow, see = dc.see, classFn = dc.classFn, styleFrom = dc.styleFrom, extendAttrs = dc.extendAttrs, Tag = dc.Tag, Text = dc.Text, List = dc.List, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, txt = dc.txt, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, button = dc.button, input = dc.input, each = dc.each;

	controls = __webpack_require__(/*! domcom/demo/demo-controls */ 26);

	describe('demo', function() {
	  describe('sum', function() {
	    return it('should construct and create components', function() {
	      var a$, a_, b$, b_, comp, sum, x, y, z, _ref1;
	      _ref1 = bindings({
	        a: 3,
	        b: 2
	      }), a$ = _ref1.a$, b$ = _ref1.b$, a_ = _ref1.a_, b_ = _ref1.b_;
	      x = text(a$);
	      y = text(b$);
	      z = p(txt(sum = flow.add(a_, b_)));
	      expect(sum()).to.equal(5, 'sum 1');
	      a_(1);
	      expect(sum()).to.equal(3, 'sum 2');
	      comp = list(x, y, z);
	      comp.mount('#demo');
	      expect(z.node.innerHTML).to.equal('3', 'mount');
	      x.node.value = '3';
	      y.node.value = '4';
	      x.node.onchange();
	      y.node.onchange();
	      expect(a_()).to.equal('3', 'a_');
	      expect(b_()).to.equal('4', 'b_');
	      expect(sum()).to.equal('34', 'sum');
	      expect(!!comp.valid).to.equal(false, 'comp.valid');
	      expect(!!z.valid).to.equal(false, 'z.valid');
	      comp.update();
	      return expect(z.node.innerHTML).to.equal('34', 'update');
	    });
	  });
	  describe('combobox', function() {
	    it('should process event property of child component', function() {
	      var c0, comp, x;
	      x = 0;
	      comp = div({}, c0 = input({
	        onmouseenter: function() {
	          return x = 1;
	        }
	      }), div({}, 'wawa'));
	      comp.mount();
	      c0.node.onmouseenter();
	      return expect(x).to.equal(1);
	    });
	    return it('should process event property of child component with model directive', function() {
	      var c0, comp, x;
	      x = 0;
	      comp = div({}, c0 = input({
	        $model: duplex({}, 'x'),
	        onmouseenter: function() {
	          return x = 1;
	        }
	      }), div({}, 'wawa'));
	      comp.mount();
	      c0.node.onmouseenter();
	      return expect(x).to.equal(1);
	    });
	  });
	  describe('text model', function() {
	    it('should text model by value', function() {
	      var a$, attrs, comp, m, text1, text2;
	      a$ = bindings(m = {
	        a: 1
	      }).a$;
	      attrs = {
	        onchange: function() {
	          return comp.update();
	        }
	      };
	      comp = list(text1 = text(attrs, a$), text2 = text(attrs, a$));
	      comp.mount();
	      text1.node.value = 3;
	      text1.node.onchange();
	      expect(m.a).to.equal('3', 'm.a');
	      return expect(text2.node.value).to.equal('3', 'text2.node.value');
	    });
	    return it('should text model by value and onchange', function() {
	      var a$, attrs, comp, m, text1, text2;
	      a$ = bindings(m = {
	        a: 1
	      }).a$;
	      attrs = {
	        value: a$,
	        onchange: function() {
	          a$(this.value);
	          return comp.update();
	        }
	      };
	      comp = list(text1 = text(attrs), text2 = text(attrs));
	      comp.mount();
	      text1.node.value = 3;
	      text1.node.onchange();
	      expect(m.a).to.equal('3', 'm.a');
	      return expect(text2.node.value).to.equal('3', 'text2.node.value');
	    });
	  });
	  describe('combo', function() {
	    return it('should combobox', function() {
	      var attrs, comp, input1, item, items, opts, showingItems, value;
	      showingItems = see(false);
	      comp = null;
	      value = see('');
	      opts = (function() {
	        var _i, _len, _ref1, _results;
	        _ref1 = [1, 2];
	        _results = [];
	        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	          item = _ref1[_i];
	          _results.push((function(item) {
	            return span({
	              style: {
	                display: 'block',
	                border: "1px solid blue",
	                "min-width": "40px"
	              },
	              onclick: (function() {
	                value(item);
	                return comp.update();
	              })
	            }, item);
	          })(item));
	        }
	        return _results;
	      })();
	      attrs = extendAttrs(attrs, {
	        onmouseleave: (function() {
	          showingItems(false);
	          return comp.update();
	        })
	      });
	      comp = div(attrs, input1 = input({
	        $model: value,
	        onmouseenter: (function() {
	          showingItems(true);
	          return comp.update();
	        })
	      }), items = div({
	        style: {
	          display: flow(showingItems, function() {
	            if (showingItems()) {
	              return 'block';
	            } else {
	              return 'none';
	            }
	          })
	        }
	      }, opts));
	      comp.mount();
	      expect(input1.node.value).to.equal('');
	      expect(showingItems()).to.equal(false);
	      expect(items.node.style.display).to.equal('none');
	      input1.node.onmouseenter();
	      expect(items.node.style.display).to.equal('block');
	      opts[1].node.onclick();
	      return expect(input1.node.value).to.equal('2');
	    });
	  });
	  describe('controls', function() {
	    return it('should mount controls and others', function() {
	      var comp;
	      comp = controls();
	      comp.mount('#demo');
	      expect(comp.node.length).to.equal(2);
	      return comp.unmount();
	    });
	  });
	  describe('mount/unmount', function() {
	    return it('should mount/unmount sub component', function() {
	      var buttons, comp, div1;
	      div1 = div('toggle me');
	      buttons = list(div({
	        onclick: (function() {
	          return div1.mount();
	        })
	      }, 'mount', div({
	        onclick: (function() {
	          return div1.unmount();
	        })
	      }, 'unmount')));
	      comp = list(buttons, div1);
	      div1.mount();
	      div1.unmount();
	      div1.remount();
	      div1.unmount();
	      comp.mount();
	      return comp.unmount();
	    });
	  });
	  return describe('todomvc', function() {
	    var makeTodo;
	    it('should process class', function() {
	      var comp;
	      comp = a({
	        className: {
	          selected: 1
	        },
	        href: "#/"
	      });
	      comp.mount('#demo');
	      return expect(comp.node.className).to.equal('selected');
	    });
	    it('should construct and create components', function() {
	      var comp;
	      comp = li(a({
	        className: {
	          selected: 1
	        },
	        href: "#/"
	      }, "All"));
	      comp.mount('#demo');
	      expect(comp.children[0].node.className).to.equal('selected');
	      return expect(comp.children[0].node.href).to.match(/:\/\//);
	    });
	    makeTodo = function(todos, status) {
	      var getTodos, todoItems;
	      status.hash = 'all';
	      getTodos = function() {
	        if (status.hash === 'active') {
	          return todos.filter(function(todo) {
	            return todo && !todo.completed;
	          });
	        } else if (status.hash === 'completed') {
	          return todos.filter(function(todo) {
	            return todo && todo.completed;
	          });
	        } else {
	          return todos;
	        }
	      };
	      return todoItems = each(getTodos, function(todo, index) {
	        return p(txt(function() {
	          return todo.title;
	        }), ', ', txt(function() {
	          if (todo.completed) {
	            return 'completed';
	          } else {
	            return 'uncompleted';
	          }
	        }));
	      });
	    };
	    it('should mount getTodos and Each with empty todos correctly', function() {
	      var comp, status, todos;
	      todos = [];
	      comp = makeTodo(todos, status = {
	        hash: 'all'
	      });
	      comp.mount();
	      return expect(comp.node.length).to.equal(0);
	    });
	    it('should invalidate children to listComponent', function() {
	      var child0, comp, status, todos;
	      todos = [
	        {
	          title: 'do this'
	        }
	      ];
	      comp = makeTodo(todos, status = {
	        hash: 'all'
	      });
	      expect(comp.listComponent.invalidIndexes).to.be.undefined;
	      comp.getContentComponent();
	      child0 = comp.cacheChildren[0];
	      status.hash = 'completed';
	      child0.transfornValid = true;
	      comp.getContentComponent();
	      child0.valid = true;
	      status.hash = 'all';
	      return comp.getContentComponent();
	    });
	    it('should process getTodos and Each correctly', function() {
	      var child0, comp, status, todos;
	      todos = [
	        {
	          title: 'do this'
	        }
	      ];
	      comp = makeTodo(todos, status = {
	        hash: 'all'
	      });
	      comp.mount();
	      expect(comp.node.length).to.equal(1);
	      status.hash = 'completed';
	      comp.update();
	      expect(comp.node.length).to.equal(0);
	      status.hash = 'all';
	      comp.getContentComponent();
	      child0 = comp.listComponent.children[0];
	      comp.update();
	      return expect(comp.node.length).to.equal(1);
	    });
	    return it('should todoEditArea', function() {
	      var comp, footer, section, todoEditArea, todoItems, ul;
	      section = dc.section, ul = dc.ul, footer = dc.footer;
	      todoItems = each([1, 2], function(todo, index) {
	        return li(1);
	      });
	      comp = todoEditArea = section({
	        id: "main"
	      }, ul({
	        id: "todo-list"
	      }, todoItems), footer({
	        id: "footer"
	      }));
	      comp.mount();
	      return comp.update();
	    });
	  });
	});


/***/ },
/* 26 */
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


/***/ }
/******/ ]);
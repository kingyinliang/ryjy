document.addEventListener("plusready",  function(){
	var _BARCODE = 'PolyvPlugin',
	B = window.plus.bridge;
	var PolyvPlugin = {
		// 初始化polyv插件
		PolyvPluginInit : function (userId, successCallback, errorCallback ){
			var success = typeof successCallback !== 'function' ? null : function(args){
				successCallback(args);
			},
			fail = typeof errorCallback !== 'function' ? null : function(code){
				errorCallback(code);
			};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "PolyvPluginInit", [callbackID, userId]);
		},
		// 开始下载
		startDownload : function (ArgObj, successCallback, errorCallback ){
			var success = typeof successCallback !== 'function' ? null : function(args){
				successCallback(args);
			},
			fail = typeof errorCallback !== 'function' ? null : function(code){
				errorCallback(code);
			};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "startDownload", [callbackID, ArgObj]);
		},
		// 暂停下载
		pauseDownload : function (ArgObj, successCallback, errorCallback ){
			var success = typeof successCallback !== 'function' ? null : function(args){
				successCallback(args);
			},
			fail = typeof errorCallback !== 'function' ? null : function(code){
				errorCallback(code);
			};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "startDownload", [callbackID, ArgObj]);
		},
		// 下载全部
		downloadAll : function (){                                	
            return B.execSync(_BARCODE, "downloadAll", []);
        },
        // 暂停全部
        pauseAll : function (){                                	
            return B.execSync(_BARCODE, "pauseAll", []);
        },
        // 删除任务
        deleteTask : function (ArgObj, successCallback, errorCallback){
        	var success = typeof successCallback !== 'function' ? null : function(args){
				successCallback(args);
			},
			fail = typeof errorCallback !== 'function' ? null : function(code){
				errorCallback(code);
			};
			callbackID = B.callbackId(success, fail);
            return B.exec(_BARCODE, "deleteTask", [callbackID,ArgObj]);
        },
        // 获取所有下载列表
        getAllDownloadList : function (args){                                	
            return B.execSync(_BARCODE, "getAllDownloadList",[args]);
        }
	};
	window.plus.PolyvPlugin = PolyvPlugin;
},true);

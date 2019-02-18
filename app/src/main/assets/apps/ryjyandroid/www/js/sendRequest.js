/**
 * 
 * 发送请求，和后台交互
 * 如果返回有值，将接收到的结果原样返回，不进行任何判断
 * 如果是空，返回false
 */
(function($, owner) {
	var APPid = '19900414';
	var appkey = 'mumuxiansheng';
	var apiUrl = "http://api.rycfa.com/";
	
	var sendSMSUrl = apiUrl+"api/api/send_code";
	var checkCodeUrl = apiUrl+"api/api/check_code.html";
	var loginUrl = apiUrl+"api/api/login.html";
	var sendMailUrl = apiUrl+"api/api/send_email.html";
	var forgetPwdMail = apiUrl+"api/api/forgot_email.html";
	var forgetPwdSms = apiUrl+"api/api/forgot_phone.html";
	var regPhoneURL = apiUrl+"api/api/register_phone.html";
	var regMailURL = apiUrl+"api/api/register_email.html";
	var resetPwdUrl = apiUrl+"api/api/updata_password.html";
	var checkLogin = apiUrl+"api/api/check_logins.html";  //单点登录
	var sessionLogin = apiUrl+"api/api/session_login.html"; //免登校验
	var getBuyVedios = apiUrl+"api/api/get_user_course.html"; 	//获取已购买视频
	var getVideosBycoid = apiUrl+"api/api/get_learn_list.html"; //根据课程id获取具体视频
	var getVideoInfo = apiUrl+"api/api/get_video_info.html"; //根据视频id获取视频信息
	
	var dataArr;
	//生成公共参数
	function autoSign(currTime){
		var i = dataArr.length;
		dataArr[i++]='timetamp='+currTime;
		dataArr[i++]='appid='+APPid;
		dataArr = dataArr.sort();
		console.log(dataArr.toString().replace(/,/g,"&")+'&key='+appkey);
		var sign = md5(dataArr.toString().replace(/,/g,"&")+'&key='+appkey);
		return sign;
	};
	
	// 发送登陆请求
	owner.sendToLogin = function(param,callback) {
		var currTime = new Date().getTime().toString().substring(0,10);
		dataArr = new Array();
		dataArr.push('username='+param.account);
		dataArr.push('password='+md5(param.password));
		
		var requestParam = {};
		requestParam.username=param.account;
		requestParam.password=md5(param.password);
		requestParam.appid=APPid;
		requestParam.timetamp = currTime;
		requestParam.sign=autoSign(currTime);
		console.log("sendToLogin before req = "+JSON.stringify(requestParam));
		mui.post(loginUrl,requestParam,function(data){
			console.log(data);
			if(data){
				return callback(data);
			}
			return callback(false);
		});
	};
	// 单点登录校验
	owner.checkLogin = function(param,callback){
		var currTime = new Date().getTime().toString().substring(0,10);
		dataArr = new Array();
		dataArr.push('user_id='+param.userId);
		dataArr.push('session_id='+param.sessionId);
		
		var requestParam = {};
		requestParam.user_id=param.userId;
		requestParam.session_id=param.sessionId;
		requestParam.appid=APPid;
		requestParam.timetamp = currTime;
		requestParam.sign=autoSign(currTime);
		console.log("checkLogin before req = "+JSON.stringify(requestParam));
		mui.post(checkLogin,requestParam,function(data){
			console.log(data);
			if(data){
				return callback(data);
			}
			return callback(false);	
		});
	}
	// 免登陆校验
	owner.sessionLogin = function(param,callback){
		var currTime = new Date().getTime().toString().substring(0,10);
		dataArr = new Array();
		dataArr.push('session_id='+param.sessionId);
		dataArr.push('password='+param.password);
		
		var requestParam = {};
		requestParam.session_id=param.sessionId;
		requestParam.password=param.password;
		requestParam.appid=APPid;
		requestParam.timetamp = currTime;
		requestParam.sign=autoSign(currTime);
		console.log("sessionLogin before req = "+JSON.stringify(requestParam));
		mui.post(sessionLogin,requestParam,function(data){
			console.log(data);
			if(data){
				return callback(data);
			}
			return callback(false);	
		});
	}
	
	// 发送注册请求
	owner.sendReg = function(param,callback){
		var currTime = new Date().getTime().toString().substring(0,10);
		var requestParam = {};
		dataArr = new Array();
		if(param.account){
			dataArr.push('username='+param.account);
			requestParam.username=param.account;
		}
		if(param.password){
			dataArr.push('password='+md5(param.password));
			requestParam.password=md5(param.password);
		}
		if(param.email){
			dataArr.push('email='+param.email);
			requestParam.email=param.email;
		}
		if(param.phoneNum){
			dataArr.push('phone='+param.phoneNum);
			requestParam.phone=param.phoneNum;
		}
		if(param.checkCode){
			dataArr.push('code='+param.checkCode);
			requestParam.code=param.checkCode;
		}
		requestParam.appid=APPid;
		requestParam.timetamp = currTime;
		requestParam.sign=autoSign(currTime);
		console.log("sendReg before req = "+JSON.stringify(requestParam));
		if(param.email){
			mui.post(regMailURL,requestParam,function(data){
				console.log(data);
				if(data){
					return callback(data);
				}
				return callback(false);	
			});
		}else{
			mui.post(regPhoneURL,requestParam,function(data){
				console.log(data);
				if(data){
					return callback(data);
				}
				return callback(false);	
			});
		}
		
	};
	
	// 发送短信
	owner.sendSMS = function(param,callback){
		var currTime = new Date().getTime().toString().substring(0,10);
		var requestParam = {};
		dataArr = new Array();
		dataArr[0] = 'phone='+param;
		var sign = autoSign(currTime);
		requestParam.phone= param;
		requestParam.appid= APPid;
		requestParam.timetamp= currTime;
		requestParam.sign=sign;
		console.log("sendSMS before req = "+JSON.stringify(requestParam));
		mui.post(sendSMSUrl,requestParam,function(data){
			console.log(data);
			if(data){
				return callback(data);
			}
			return callback(false);
		});
		
	};
	
	// 校验短信验证码
	owner.checkSMSCode = function(param,callback){
		var currTime = new Date().getTime().toString().substring(0,10);
		var requestParam = {};
		dataArr = new Array();
		dataArr.push('phone='+param.phone);
		dataArr.push('code='+param.code);
		
		requestParam.phone=param.phone;
		requestParam.code=param.code;
		requestParam.appid=APPid;
		requestParam.timetamp=currTime;
		requestParam.sign=autoSign(currTime);
		console.log("checkSMSCode before req = "+JSON.stringify(requestParam));
		mui.post(checkCodeUrl,requestParam,function(data){
			console.log(data);
			if(data){
				return callback(data);	
			}
			return callback(false);	
		})
	};
	
	// 发送邮件
	owner.sendMail = function(email,callback){
		var currTime = new Date().getTime().toString().substring(0,10);
		var requestParam = {};
		dataArr = new Array();
		dataArr.push('email='+email);
		requestParam.email = email;
		requestParam.appid=APPid;
		requestParam.timetamp=currTime;
		requestParam.sign=autoSign(currTime);
		console.log("sendMail before req = "+JSON.stringify(requestParam));
		mui.post(sendMailUrl,requestParam,function(data){
			console.log(data);
			if(data){
				return callback(data);
			}
			return callback(false);
		});
	};
	
	// 邮箱找回密码
	owner.mailResetPwd = function(forgetPwdInfo,callback){
		var currTime = new Date().getTime().toString().substring(0,10);
		var requestParam = {};
		dataArr = new Array();
		dataArr.push('email='+forgetPwdInfo.email);
		dataArr.push('code='+forgetPwdInfo.checkMailCode);
		dataArr.push('password='+md5(forgetPwdInfo.password));
		requestParam.email = forgetPwdInfo.email;
		requestParam.code = forgetPwdInfo.checkMailCode;
		requestParam.password = md5(forgetPwdInfo.password);
		requestParam.appid=APPid;
		requestParam.timetamp=currTime;
		requestParam.sign=autoSign(currTime);
		console.log("mailResetPwd before req = "+JSON.stringify(requestParam));
		mui.post(forgetPwdMail,requestParam,function(data){
			console.log(data);
			if(data){
				return callback(data);
			}
			return callback(false);
		});
	}
	
	// 手机找回密码
	owner.smsResetPwd = function(forgetPwdInfo,callback){
		var currTime = new Date().getTime().toString().substring(0,10);
		var requestParam = {};
		dataArr = new Array();
		dataArr.push('phone='+forgetPwdInfo.phone);
		dataArr.push('code='+forgetPwdInfo.code);
		dataArr.push('password='+md5(forgetPwdInfo.password));
		requestParam.phone = forgetPwdInfo.phone;
		requestParam.code = forgetPwdInfo.code;
		requestParam.password = md5(forgetPwdInfo.password);
		requestParam.appid=APPid;
		requestParam.timetamp=currTime;
		requestParam.sign=autoSign(currTime);
		console.log("smsResetPwd before req = "+JSON.stringify(requestParam));
		mui.post(forgetPwdSms,requestParam,function(data){
			console.log(data);
			if(data){
				return callback(data);
			}
			return callback(false);
		});
		/*mui.ajax(forgetPwdSms,{data:requestParam,type:'post',
			success:function(data){
				console.log(data);
			},
			error:function(xhr,type,errorThrown){
				console.log("smsResetPwd error"+JSON.stringify(xhr));
				console.log("xhr.readyState="+xhr.readyState);
				console.log("xhr.response="+xhr.response);
				console.log("xhr.responseText="+xhr.responseText);
				console.log("xhr.responseType="+xhr.responseType);
				console.log("xhr.responseXML="+xhr.responseXML);
				console.log("xhr.status="+xhr.status);
				console.log("xhr.statusText="+xhr.statusText);
				console.log("xhr.timeout="+xhr.timeout);
				console.log("xhr.withCredentials="+xhr.withCredentials);
				console.log('error='+type);
			}
		});*/
	}
	
	// 重置密码
	owner.resetPwd = function(resetPwdInfo,callback){
		var currTime = new Date().getTime().toString().substring(0,10);
		var requestParam = {};
		dataArr = new Array();
		dataArr.push('username='+resetPwdInfo.username);
		dataArr.push('old_password='+md5(resetPwdInfo.oldpassword));
		dataArr.push('new_password='+md5(resetPwdInfo.newpassword));
		requestParam.username = resetPwdInfo.username;
		requestParam.old_password = md5(resetPwdInfo.oldpassword);
		requestParam.new_password = md5(resetPwdInfo.newpassword);
		requestParam.appid=APPid;
		requestParam.timetamp=currTime;
		requestParam.sign=autoSign(currTime);
		console.log("resetPwd before req = "+JSON.stringify(requestParam));
//		mui.post(resetPwdUrl,requestParam,function(data){
//			console.log(data);
//			if(data){
//				return callback(data);
//			}
//			return callback(false);
//		});
		mui.ajax(resetPwdUrl,{data:requestParam,type:'post',
			success:function(data){
				console.log(data);
			},
			error:function(xhr,type,errorThrown){
				console.log("resetPwd error");
			}
		});
	}
	
	// 获取已购买视频列表
	owner.getBuyVideos = function(param,callback){
		var currTime = new Date().getTime().toString().substring(0,10);
		var requestParam = {};
		dataArr = new Array();
		dataArr.push('user_id='+param.userId);
		requestParam.user_id = param.userId;
		requestParam.appid=APPid;
		requestParam.timetamp=currTime;
		requestParam.sign=autoSign(currTime);
		console.log("getBuyVideos before req = "+JSON.stringify(requestParam));
		mui.post(getBuyVedios,requestParam,function(data){
			console.log(data);
			if(data){
				return callback(data);
			}
			return callback(false);
		});
	};
	// 根据课程id获取视频信息
	owner.getVideosBycoid = function(param,callback){
		var currTime = new Date().getTime().toString().substring(0,10);
		var requestParam = {};
		dataArr = new Array();
		dataArr.push('user_id='+param.userId);
		dataArr.push('coid='+param.coid);
		requestParam.coid = param.coid;
		requestParam.user_id = param.userId;
		requestParam.appid=APPid;
		requestParam.timetamp=currTime;
		requestParam.sign=autoSign(currTime);
		console.log("getVideosBycoid before req = "+JSON.stringify(requestParam));
		mui.post(getVideosBycoid,requestParam,function(data){
			console.log(data);
			if(data){
				return callback(data);
			}
			return callback(false);
		});
	};	
	// 根据视频id获取视频信息
	owner.getVideoInfo = function(param,callback){
		var currTime = new Date().getTime().toString().substring(0,10);
		var requestParam = {};
		dataArr = new Array();
		dataArr.push('user_id='+param.userId);
		dataArr.push('couid='+param.couid);
		requestParam.couid = param.couid;
		requestParam.user_id = param.userId;
		requestParam.appid=APPid;
		requestParam.timetamp=currTime;
		requestParam.sign=autoSign(currTime);
		console.log("getVideoInfo before req = "+JSON.stringify(requestParam));
		mui.post(getVideoInfo,requestParam,function(data){
			console.log(data);
			if(data){
				return callback(data);
			}
			return callback(false);
		});
	};
	
	
	
}(mui, window.appSendReq = {}));
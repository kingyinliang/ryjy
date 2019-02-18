/**
 * “注册/登录” 等操作
 * 获取设置值
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		owner.checkAccountInfo(loginInfo,function(e){
			if(e=='success'){
				appSendReq.sendToLogin(loginInfo,function(d){
					console.log(d);
					var data = JSON.parse(d);
					// 如果接口返回成功
					if (data && '200'==data.code){
						data = data.data;
						if(data.username==loginInfo.account || data.email==loginInfo.account || data.mobile==loginInfo.account) {
							owner.createState(loginInfo.account,data,callback);
							var checkLoginInfo = {'userId':data.user_id,'sessionId':data.session_id};
							appSendReq.checkLogin(checkLoginInfo,function(d){
								console.log(d);
								d = JSON.parse(d);
								if('200'==d.code){
									return callback(true,"登录成功");
								}else{
									return callback(false,d.msg);
								}
							});
						}
					}else if(data && data.msg){
						return callback(false,data.msg);
					}
				});
			}else{
				return callback(false,e);
			}
		});
	};
	
	/**
	 * 将登陆成功的状态存到本地缓存中
	 */
	owner.createState = function(name,data,callback) {
		var state = owner.getState(name);
		state.account = name;
		for(x in data){
			state[x]=data[x];
		}
		owner.setState(state);
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function(username) {
		var stateText = localStorage.getItem(username+'$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		localStorage.setItem('ryjy_user',state.account);
		state = state || {};
		localStorage.setItem(state.account+'$state', JSON.stringify(state));
	};
	
	/**
	 * 清除缓存数据 
	 */
	owner.clearState = function(username){
		localStorage.removeItem('ryjy_user');
		localStorage.removeItem(username+'$state');
	}
	
	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		owner.checkAccountInfo(regInfo,function(e){
			if(e!='success'){
				return callback(false,e);
			}else{
				appSendReq.sendReg(regInfo,function(data){
					if(data){
						var returnData = JSON.parse(data);
						if(returnData && '200'==returnData.code){
							return callback(true,returnData.msg);	
						}
						if(returnData.msg){
							return callback(false,returnData.msg);
						}
					}
					return callback(false,"注册失败");
				});
			}
		});
	};
	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(newPwdInfo, callback) {
		owner.checkAccountInfo(newPwdInfo,function(e){
			if(e!='success'){
				return callback(false,e);
			}else{
				if(newPwdInfo.email){
					appSendReq.mailResetPwd(newPwdInfo,function(data){
						if(data){
							var returnData = JSON.parse(data);
							if(returnData && '200'==returnData.code){
								return callback(true,"密码重置成功");	
							}
							if(returnData.msg){
								return callback(false,returnData.msg);
							}
							return callback(false,"密码重置失败");
						}
					});
				}else{
					appSendReq.smsResetPwd(newPwdInfo,function(data){
						if(data){
							var returnData = JSON.parse(data);
							if(returnData && '200'==returnData.code){
								return callback(true,"密码重置成功");	
							}
							if(returnData.msg){
								return callback(false,returnData.msg);
							}
							return callback(false,"密码重置失败");
						}
					});
				}
				
			}
		});
	};
	
	// 用户名，密码，邮箱，手机号校验
	owner.checkAccountInfo = function(accountInfo,callback) {
		// 包含字母和数字
		var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D~.@#%&+$)/);
		if (accountInfo.account && accountInfo.account.length < 4) {
			return callback('用户名最短需要 5 个字符');
		}
		if (accountInfo.account && accountInfo.account.length > 32) {
			return callback('用户名最长为 32 个字符');
		}
		if (accountInfo.password){
			if(accountInfo.password.length < 6) {
				return callback('密码最短需要 6 个字符');
			}else if(!reg.test(accountInfo.password)){
				return callback('密码必须包含字母和数字');	
			}
		}
		if (accountInfo.phoneNum && (accountInfo.phoneNum.length < 11 || !/^\d+$/.test(accountInfo.phoneNum))) {
			return callback('手机号码格式错误');
		}
		if (accountInfo.email && !(accountInfo.email.length > 3 && accountInfo.email.indexOf('@') > -1 && accountInfo.email.indexOf('.') > -1)) {
			return callback('邮箱地址不合法');
		}
		return callback('success');
	};
	
}(mui, window.app = {}));
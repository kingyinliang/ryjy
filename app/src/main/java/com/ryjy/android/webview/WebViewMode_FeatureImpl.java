package com.ryjy.android.webview;

import io.dcloud.common.DHInterface.AbsMgr;
import io.dcloud.common.DHInterface.IFeature;
import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.util.JSUtil;
/**
 * 通过代码注册5+扩展插件示例类
 * **/
public class WebViewMode_FeatureImpl implements IFeature{

	@Override
	public String execute(IWebview pWebViewImpl, String pActionName,
			String[] pJsArgs) {
		if("test".equals(pActionName)){//监听js层调用plus.T.test 函数
			return JSUtil.wrapJsVar("xxxxxxxxxx");
		}
		return null;
	}

	@Override
	public void init(AbsMgr pFeatureMgr, String pFeatureName) {
		//初始化Feature
	}

	@Override
	public void dispose(String pAppid) {
		
	}

}

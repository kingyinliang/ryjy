package com.ryjy.android;

import io.dcloud.PandoraEntry;
import io.dcloud.common.DHInterface.IApp;
import io.dcloud.common.DHInterface.ISysEventListener;
import io.dcloud.common.DHInterface.ISysEventListener.SysEventType;
import io.dcloud.feature.internal.sdk.SDK;

import java.io.File;

import android.content.Intent;
import android.net.Uri;
import android.provider.MediaStore;
import android.view.KeyEvent;

/**
 * 需要在assets/apps/ 下含有webapp 资源<br/>
 * 需要在assets/apps/control.xml 中配置需要启动的应用 需要在assets/apps/properties.xml
 * 中配置需要使用到的权限
 * 
 * @author yanglei
 *
 */
public class SDK_Runtime extends PandoraEntry {

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		boolean b = super.onKeyDown(keyCode, event);
		if (keyCode == KeyEvent.KEYCODE_MENU) {
			IApp app = SDK.obtainCurrentApp();
			app.registerSysEventListener(new ISysEventListener() {
				@Override
				public boolean onExecute(SysEventType pEventType, Object pArgs) {
					Object[] _args = (Object[]) pArgs;
					int requestCode = (Integer) _args[0];
					int resultCode = (Integer) _args[1];
					if (pEventType == SysEventType.onActivityResult) {

					}
					return false;
				}
			}, SysEventType.onActivityResult);
			Intent _intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
			File destFile = new File("/sdcard/t/1.png");
			Uri _uri = Uri.fromFile(destFile);
			_intent.putExtra(MediaStore.EXTRA_OUTPUT, _uri);
			startActivityForResult(_intent, 110);
		}
		return b;
	}
}

package com.ryjy.android;

import java.util.Random;

import android.app.ListActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ListView;
import android.widget.TextView;


public class ActivityEntry extends ListActivity {

	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setListAdapter(new MyListViewAdapter());
        getListView().setTextFilterEnabled(true);
    }
	
	@Override
	protected void onListItemClick(ListView l, View v, int position, long id) {
		super.onListItemClick(l, v, position, id);
		onListItemClick(position);
	}
	
    void onListItemClick(int index) {
		Intent intent = null;
		intent = new Intent(ActivityEntry.this, acts[index].cls);
		this.startActivity(intent);
    }

    AcitivtyInfo[] acts = new AcitivtyInfo[]{
    		new AcitivtyInfo("webapp集成方式", SDK_WebApp.class),
    		new AcitivtyInfo("webview集成方式", com.ryjy.android.SDK_WebView.class)
    };
	class AcitivtyInfo{
		String title;
		Class<? extends android.app.Activity> cls;
		
		AcitivtyInfo(String title,Class cls){
			this.title = title;
			this.cls = cls;
		}
	}
	
	private static int randomColor(){
		int count = 8;
		int ret = 0;
//		StringBuffer sb = new StringBuffer("0X");
		for(int i = count - 1 ; i >= 0 ; i--){
			ret += (new Random().nextInt(16) << (i*4));
		}
		return ret;
	}
	private static String getHexChar(int i){
		if(i >= 0 && i < 10){
			return "" + i;
		}else if(i == 10){
			return "a";
		}else if(i == 11){
			return "b";
		}else if(i == 12){
			return "c";
		}else if(i == 13){
			return "d";
		}else if(i == 14){
			return "e";
		}else if(i == 15){
			return "f";
		}
		return "f";
	}
	class MyListViewAdapter extends BaseAdapter{

		@Override
		public int getCount() {
			return acts.length;
		}

		@Override
		public Object getItem(int position) {
			return acts[position];
		}

		@Override
		public long getItemId(int position) {
			return position;
		}

		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			TextView tv = new TextView(parent.getContext());
			tv.setHeight(100);
			tv.setGravity(Gravity.CENTER);
			tv.setText(acts[position].title);
			convertView = tv;
			return convertView;
		}
		
	}
}

package com.ryjy.polyvPlugin;

import android.content.Context;
import android.content.ContextWrapper;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import com.easefun.polyvsdk.PolyvDevMountInfo;
import com.easefun.polyvsdk.PolyvDownloader;
import com.easefun.polyvsdk.PolyvDownloaderManager;
import com.easefun.polyvsdk.PolyvSDKClient;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.StandardFeature;
import io.dcloud.common.util.JSUtil;

public class PolyvPlugin extends StandardFeature {

    public static final String TAG = PolyvPlugin.class.getSimpleName();
    private static PolyvDownloadSQLiteHelper downloadSQLiteHelper;
    private List<PolyvDownloadInfo> lists;
    private Context context;

    @Override
    public void onStart(final Context tcontext, Bundle bundle, String[] strings) {
        this.context = tcontext;
        downloadSQLiteHelper = PolyvDownloadSQLiteHelper.getInstance(this.context);
    }

    public void PolyvPluginInit(IWebview pWebview, JSONArray array){
        String sdkSecret = "qq4dkhfmYa/3EnPs0BcBghzzwevbtCPlwrQwPn9zJ3oNmPyOPleB4pn6vpExjKOPj0WX1rt1oKTW5yfNjUiaWBYCJpLTbWpfkLo9kf7jWbxawkN9DU5ujqa2nU5x/lU2Scs3/e9Rds5feLNSbdJpQA==";
        String aeskey = "VXtlHmwfS2oYm0CZ";
        String iv = "2u9gDPKdX6GyQJKU";

        PolyvSDKClient client = PolyvSDKClient.getInstance();
        //使用SDK加密串来配置
        client.setConfig(sdkSecret, aeskey, iv, context);
        //初始化SDK设置
        client.initSetting(context);
        //启动Bugly
        client.initCrashReport(context);
        //启动Bugly后，在学员登录时设置学员id
        client.crashReportSetUserId(array.optString(1));
        //获取SD卡信息
        PolyvDevMountInfo.getInstance().init(context, new PolyvDevMountInfo.OnLoadCallback() {

            @Override
            public void callback() {
                //是否有可移除的存储介质（例如 SD 卡）或内部（不可移除）存储可供使用。
                if (!PolyvDevMountInfo.getInstance().isSDCardAvaiable()) {
                    Log.e(TAG, "没有可用的存储设备,后续不能使用视频缓存功能");
                    return;
                }

                //可移除的存储介质（例如 SD 卡），需要写入特定目录/storage/sdcard1/Android/data/包名/。
                String externalSDCardPath = PolyvDevMountInfo.getInstance().getExternalSDCardPath();
                if (!TextUtils.isEmpty(externalSDCardPath)) {
                    StringBuilder dirPath = new StringBuilder();
                    dirPath.append(externalSDCardPath).append(File.separator).append("ryjydownload");
                    File saveDir = new File(dirPath.toString());
                    if (!saveDir.exists()) {
                        new ContextWrapper(context).getExternalFilesDir(null); // 生成包名目录
                        saveDir.mkdirs();//创建下载目录
                    }

                    //设置下载存储目录
                    PolyvSDKClient.getInstance().setDownloadDir(saveDir);
                    return;
                }

                //如果没有可移除的存储介质（例如 SD 卡），那么一定有内部（不可移除）存储介质可用，都不可用的情况在前面判断过了。
                File saveDir = new File(PolyvDevMountInfo.getInstance().getInternalSDCardPath() + File.separator + "ryjydownload");
                if (!saveDir.exists()) {
                    saveDir.mkdirs();//创建下载目录
                }

                //设置下载存储目录
                PolyvSDKClient.getInstance().setDownloadDir(saveDir);
                Log.i("polyvSDKinit","download目录是:"+saveDir);
            }
        }, true);

        // 设置下载队列总数，多少个视频能同时下载。(默认是1，设置负数和0是没有限制)
        PolyvDownloaderManager.setDownloadQueueCount(0);
    }

    /**
     * 获取全部下载列表
     */
    public String getAllDownloadList(IWebview pWebview, JSONArray array){
        LinkedList<PolyvDownloadInfo> downloads = null;
        JSONObject retJSONObj = new JSONObject();
        try {
            downloads = downloadSQLiteHelper.getAll();
            retJSONObj.putOpt("alldownloads", com.alibaba.fastjson.JSONArray.toJSONString(downloads));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return JSUtil.wrapJsVar(retJSONObj);
    }

    /**
     *  开始下载单个任务
     */
    public void startDownload(IWebview pWebview, JSONArray array){
        try {
            JSONObject argObj = new JSONObject(String.valueOf(array.get(1)));
            String vid = String.valueOf(argObj.get("vid"));
            String duration = String.valueOf(argObj.get("duration"));
            int bitrate = Integer.parseInt(argObj.get("bitrate").toString());
            final PolyvDownloadInfo downloadInfo = new PolyvDownloadInfo();
            downloadInfo.setBitrate(bitrate);
            downloadInfo.setVid(vid);
            downloadInfo.setTitle(String.valueOf(argObj.get("title")));
            downloadInfo.setDuration(duration);
            // 判断sql处理器能否执行，并且下载信息是否已经添加过
            if (downloadSQLiteHelper != null && !downloadSQLiteHelper.isAdd(downloadInfo)) {
                final PolyvDownloader downloader = PolyvDownloaderManager.getPolyvDownloader(vid, bitrate);
                downloader.setPolyvDownloadProressListener(new MyDownloadListener(context, downloadInfo));
                downloader.start(context);
                downloadSQLiteHelper.insert(downloadInfo);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        // 调用方法将原生代码的执行结果返回给js层并触发相应的JS层回调函数
        JSUtil.execCallback(pWebview, array.optString(0),"已经开始下载……",JSUtil.OK, false);
    }

    /**
     * 暂停下载单个任务
     */
    public void pauseDownload(PolyvDownloadInfo downloadInfo){
        String vid = downloadInfo.getVid();
        int bitrate = downloadInfo.getBitrate();
        final PolyvDownloader downloader = PolyvDownloaderManager.getPolyvDownloader(vid, bitrate);
        downloader.stop();
    }

    /**
     * 下载全部任务
     */
    public void downloadAll() {
        // 已完成的任务key集合
        List<String> finishKey = new ArrayList<>();
        for (int i = 0; i < lists.size(); i++) {
            PolyvDownloadInfo downloadInfo = lists.get(i);
            long percent = downloadInfo.getPercent();
            long total = downloadInfo.getTotal();
            int progress = 0;
            if (total != 0)
                progress = (int) (percent * 100 / total);
            if (progress == 100)
                finishKey.add(PolyvDownloaderManager.getKey(downloadInfo.getVid(), downloadInfo.getBitrate()));
        }
        PolyvDownloaderManager.startUnfinished(finishKey, context);
    }

    /**
     * 暂停全部任务
     */
    public void pauseAll() {
        PolyvDownloaderManager.stopAll();
    }

    /**
     * 删除任务
     */
    public void deleteTask(IWebview pWebview, JSONArray array) {
        try {
            JSONObject argObj = new JSONObject(String.valueOf(array.get(1)));
            String vid = String.valueOf(argObj.get("vid"));
            int bitrate = Integer.parseInt(argObj.get("bitrate").toString());
            final PolyvDownloadInfo downloadInfo = new PolyvDownloadInfo();
            downloadInfo.setBitrate(bitrate);
            downloadInfo.setVid(vid);
            //移除任务
            PolyvDownloader downloader = PolyvDownloaderManager.clearPolyvDownload(downloadInfo.getVid(), downloadInfo.getBitrate());
            //删除文件
            downloader.deleteVideo();
            //移除数据库的下载信息
            downloadSQLiteHelper.delete(downloadInfo);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        // 调用方法将原生代码的执行结果返回给js层并触发相应的JS层回调函数
        JSUtil.execCallback(pWebview, array.optString(0),"已删除……",JSUtil.OK, false);
    }
}

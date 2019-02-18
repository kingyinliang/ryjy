package com.ryjy.polyvPlugin;

import android.content.Context;
import android.support.annotation.NonNull;
import android.util.Log;

import com.easefun.polyvsdk.PolyvDownloaderErrorReason;
import com.easefun.polyvsdk.download.listener.IPolyvDownloaderProgressListener;

public class MyDownloadListener implements IPolyvDownloaderProgressListener {
    private static PolyvDownloadSQLiteHelper downloadSQLiteHelper;
    private PolyvDownloadInfo downloadInfo;
    private long total;

    MyDownloadListener(Context context, PolyvDownloadInfo downloadInfo) {
        this.downloadInfo = downloadInfo;
        downloadSQLiteHelper = PolyvDownloadSQLiteHelper.getInstance(context);
    }

    @Override
    public void onDownload(long current, long total) {
        this.total = total;
        downloadInfo.setPercent(current);
        downloadInfo.setTotal(total);
        downloadSQLiteHelper.update(downloadInfo, current, total);
    }

    @Override
    public void onDownloadSuccess() {
        if (total == 0)
            total = 1;
        downloadSQLiteHelper.update(downloadInfo, total, total);
    }

    @Override
    public void onDownloadFail(@NonNull PolyvDownloaderErrorReason errorReason) {
            String message = PolyvErrorMessageUtils.getDownloaderErrorMessage(errorReason.getType());
            message += "(error code " + errorReason.getType().getCode() + ")";
        Log.e("downFail",message);
    }
}

// index.js
// 获取应用实例
const app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
    data: {
        topStart: 0,
        sys_info: {}
    },
    // 事件处理函数
    bindViewTap() {},
    onLoad() {
        let menuBtnInfo;
        new Promise((resolve, reject) => {
            menuBtnInfo = wx.getMenuButtonBoundingClientRect();
            resolve(menuBtnInfo);
        }).then(res => {
            return wx.getSystemInfo()
        }).then((res) => {
            console.log(res);
            this.setData({
                topStart: menuBtnInfo.bottom + 10,
                sys_info: res
            })
        })
    },

    //跳转到打印店列表
    onStartPrint() {
        wx.navigateTo({
            url: '/pages/shop-list/shop-list'
        });
    },

    /**
     * 扫码进店
     */
    onScanShopCode() {
        let info;
        wx.scanCode({
            onlyFromCamera: true,
            scanType: ["qrCode"]
        }).catch((error) => {
            return;
        }).then((res) => {
            if (res == undefined) {
                return;
            }
            info = JSON.parse(res.result);
            if (!(info.operation != undefined && info.operation == "openShop" && info.data.shopId != undefined)) {
                throw Error;
            }
            wx.navigateTo({
                url: '/pages/shop/shop?id=' + info.data.shopId
            });
        }).catch((error) => {
            Dialog.alert({
                message: "不是有效的店铺二维码！"
            })
        });
    }
})
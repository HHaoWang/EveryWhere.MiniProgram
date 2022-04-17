// index.js
// 获取应用实例
const app = getApp()

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
            url: '/pages/shop-list/shop-list',
            success: (result) => {

            },
            fail: () => {},
            complete: () => {}
        });
    },
})
// pages/my.js
import { behavior as computedBehavior } from 'miniprogram-computed';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName: "",
        avatarUrl: "",
        isLogin: ""
    },

    behaviors: [computedBehavior],

    computed: {},

    bindLoginClick() {
        //获取用户信息
        wx.navigateTo({
            url: '/pages/login/login',
        })
    },

    scanQrCode() {
        let info;
        app.hasLogin()
            .catch(() => {
                wx.navigateTo({
                    url: '/pages/login/login',
                    success: (result) => {

                    },
                    fail: () => {},
                    complete: () => {}
                });
            })
            .then(() => {
                return wx.scanCode({
                    onlyFromCamera: true,
                    scanType: ["qrCode"]
                })
            }).then((res) => {
                console.log(res);
                info = JSON.parse(res.result);
                console.log(info);
                if (!(info.operation != undefined && info.operation == "login" && info.data.uuid != undefined)) {
                    throw Error;
                }
                return Dialog.confirm({
                    title: '登录提示',
                    message: '是否登录？',
                })
            }).catch((error) => {
                console.log("用户取消登录");
                console.log(error);
            }).then(() => {
                wx.request({
                    url: app.globalData.baseUrl + '/api/Login/QrCode/' + info.data.uuid,
                    header: {
                        'Authorization': 'Bearer ' + app.globalData.token
                    },
                    method: 'GET',
                    dataType: 'json',
                    responseType: 'text',
                    success: (result) => {
                        Dialog.alert({
                            message: "登录成功！"
                        })
                    },
                    fail: () => {
                        Dialog.alert({
                            message: "登录失败！"
                        })
                    },
                    complete: () => {}
                });
            }).catch((error) => {
                console.log("扫码失败！");
                console.log(error);
            })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        app.hasLogin()
            .then(() => {})
            .catch(() => {
                wx.navigateTo({
                    url: '/pages/login/login',
                    success: (result) => {

                    },
                    fail: () => {},
                    complete: () => {}
                });
            })
        this.setData({
            nickName: app.globalData.user.nickName,
            avatarUrl: app.globalData.user.avatar,
            isLogin: app.globalData.token !== ''
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
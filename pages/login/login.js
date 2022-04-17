//获取应用实例
const app = getApp()

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
    },
    onAuth: function() {
        var that = this
        wx.getUserProfile({
            lang: 'zh_CN',
            desc: "登录及注册"
        }).then(res => {
            let userInfo = res.userInfo;
            let avatarUrl = userInfo.avatarUrl;
            let nickName = userInfo.nickName;
            app.globalData.user.nickName = nickName;
            app.globalData.user.avatar = avatarUrl;
            wx.login({
                success(res) {
                    wx.request({
                        url: app.globalData.baseUrl + '/api/Login',
                        method: 'POST',
                        data: {
                            "userCode": res.code,
                            "avatarUrl": avatarUrl,
                            "nickName": nickName,
                        },
                        success(ress) {
                            app.globalData.token = ress.data.data.token
                            try {
                                wx.setStorageSync('token', ress.data.data.token)
                            } catch (e) {}
                            wx.navigateBack()
                        }
                    })
                }
            })
        });
    },
    onLoad: function() {
        // var that = this;
        // // 查看是否授权
        // wx.getSetting({
        //   success: function (res) {
        //     if (res.authSetting['scope.userInfo']) {

        //     } else {
        //       // 用户没有授权
        //       // 改变 isHide 的值，显示授权页面
        //       that.setData({
        //         isHide: true
        //       });
        //     }
        //   }
        // });
    },

    // bindGetUserInfo: function (e) {
    //   if (e.detail.userInfo) {
    //     //用户按了允许授权按钮
    //     var that = this;
    //     //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
    //     that.setData({
    //       isHide: false
    //     });
    //   } else {
    //     //用户按了拒绝按钮
    //     wx.showModal({
    //       title: '警告',
    //       content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
    //       showCancel: false,
    //       confirmText: '返回授权',
    //       success: function (res) {
    //         // 用户没有授权成功，不需要改变 isHide 的值
    //         if (res.confirm) {

    //         }
    //       }
    //     });
    //   }
    // }


})
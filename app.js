// app.js

App({
    onLaunch() {
        wx.getStorage({
            key: "token"
        }).then(res => {
            this.globalData.token = res.data
        }).catch(err => {

        }).then(() => {
            return wx.getStorage({
                key: "user"
            })
        }).then(res => {
            this.globalData.user = res.data
        }).catch(err => {

        })
    },
    globalData: {
        token: '',
        baseUrl: 'https://everywhere.hhao.wang',
        user: {}
    },
    // 当前是否登录
    hasLogin() {
        return new Promise((resolve, reject) => {
            if (this.globalData.token == '') {
                reject();
                return;
            }
            wx.request({
                url: this.globalData.baseUrl + '/api/Login/Valid',
                header: {
                    'Authorization': 'Bearer ' + this.globalData.token
                },
                method: 'GET',
                success: (result) => {
                    console.log(result);
                    if (result.statusCode !== 200) {
                        reject();
                    } else {
                        resolve();
                    }

                },
                fail: () => {
                    reject()
                }
            })
        })
    }
})
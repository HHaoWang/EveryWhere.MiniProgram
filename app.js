// app.js
import { colorUI } from './config/ColorUI'
import { colorUISdk } from './config/mp-sdk'

App({
    colorUI,
    colorUISdk,
    onLaunch() {

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
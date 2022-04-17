// index.js
// 获取应用实例
const app = getApp()

Page({
    data: {
        topStart: 0
    },
    // 事件处理函数
    bindViewTap() {},
    onLoad() {
        const menuBtnInfo = wx.getMenuButtonBoundingClientRect()
        this.setData({
            topStart: menuBtnInfo.bottom + 10
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

    onSwiperChange(e) {
        let imageSrc = that.swiperList[index].picUrl;
        that.setBackgroundColor(imageSrc, index);
    },

    setBackgroundColor(imageSrc, index) {
        console.log(imageSrc, 'imageSrc');
        const ctx = wx.createCanvasContext('myCanvas')
        const that = this
        wx.getImageInfo({
            src: imageSrc,
            success: function(res) {
                const poster = res.path
                ctx.drawImage(poster, 0, 0, 150, 100)
                ctx.draw(false, () => {
                    wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: 150,
                        height: 100,
                        destWidth: 150,
                        destHeight: 100,
                        canvasId: "myCanvas",
                        success(res) {
                            console.log(imageSrc, '11111');
                            let tempPath = res.tempFilePath
                                // 这种方式获取canvas区域隐含的像素数据
                            wx.canvasGetImageData({
                                canvasId: 'myCanvas',
                                x: 0,
                                y: 0,
                                width: 150,
                                height: 100,
                                success(res) {
                                    const imageData = res.data
                                        // 分区块，可以拓展性的求主要色板，用来做palette
                                    let resImageObj = getMainColor(imageData)
                                    const {
                                        defaultRGB
                                    } = resImageObj
                                    const {
                                        r,
                                        g,
                                        b
                                    } = defaultRGB
                                    let resBackground = `rgb(${r}, ${g}, ${b})`; // 图片主色
                                    //that.picMainColor.push({
                                    //  sort: index,
                                    //  background: resBackground
                                    //});
                                    //wx.setStorageSync("picMainColor", that.picMainColor);
                                    //let item = that.picMainColor.find(e=>e.sort == 0);
                                    //that.SET_BACKGROUND_COLOR(item ? item.background : 'rgb(80, 135, 203)');
                                },
                            })
                        },
                        fail() {
                            console.log('222222');
                            throw new Error()
                        }
                    })
                })
            },
            fail(err) {
                console.log(err, '3333');
            }
        })
    },
})
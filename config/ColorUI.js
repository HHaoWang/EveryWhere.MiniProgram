//框架核心配置
import ColorUI from '../mp-cu/main'
export const colorUI = new ColorUI({
    config: {
        theme: 'auto',
        main: 'blue',
        text: 1,
        footer: false,
        share: true,
        shareTitle: '云打印',
        homePath: '/pages/index/index',
        tabBar: [{
                title: '首页',
                url: '/pages/index/index',
                icon: '/static/tab_icon/document.png',
                curIcon: '/static/tab_icon/document_cur.png',
                type: 'tab'
            },
            {
                title: '订单',
                url: '/pages/order/order',
                icon: '/static/tab_icon/document.png',
                curIcon: '/static/tab_icon/document_cur.png',
                type: 'tab'
            },
            {
                title: '个人',
                url: '/pages/my/my',
                icon: '/static/tab_icon/document.png',
                curIcon: '/static/tab_icon/document_cur.png',
                type: 'tab'
            }
        ],
    }
})
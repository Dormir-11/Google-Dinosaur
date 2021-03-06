
import './js/libs/weapp-adapter'
import './js/libs/symbol'
import Main from './js/main'
//横屏不适配问题————————————
canvas.width = wx.getSystemInfoSync().windowWidth;
canvas.height = wx.getSystemInfoSync().windowHeight;
//————————————————————
new Main()
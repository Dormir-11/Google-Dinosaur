/**
 * 游戏基础的精灵类
 */
const landspeed_config=1.5//地面的初始移动速度
export default class Sprite {
  constructor(imgSrc = '', width=  0, height = 0, x = 0, y = 0) {
    this.img     = new Image()
    this.img.src = imgSrc

    this.width  = width
    this.height = height

    this.x = x
    this.y = y

    this.landspeed=landspeed_config//地面的 移动速度
    this.landspeed_recode//记录
    this.landspeedIncrease=0.3//地面移动速度的增加量
    this.landMaxspeed=6//地面移动速度的最大值

    this.visible = true
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if ( !this.visible )
      return

    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }


}

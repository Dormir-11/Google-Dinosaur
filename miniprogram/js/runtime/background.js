// import Cloud   from './cloud'
import DataBus    from '../databus'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC   = 'images/land.png'
const BG_WIDTH     = 1200
const BG_HEIGHT    = 12

let databus = new DataBus()



/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class BackGround  {
  constructor(ctx) {
    this.img     = new Image()
    this.img.src = BG_IMG_SRC

    this.width  = BG_WIDTH
    this.height = BG_HEIGHT

    this.x1=0
    this.x2=BG_WIDTH
    
    this.render(ctx)
  }

 

  update(landspeed) {
    this.x1 -= landspeed
    this.x2 -= landspeed
    if(this.x1<-1200)
      this.x1=this.x2+1200
    if(this.x2<-1200)
      this.x2=this.x1+1200
  }

  render(ctx) {
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      this.x1,
      screenHeight -100,
      this.width,
      this.height,
    )

    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      this.x2,
      screenHeight -100,
      this.width,
      this.height,
    )


  }
}

import DataBus   from '../databus'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

const CLOUD_IMG_SRC =  'images/cloud.png'
const CLOUD_MOVE_SPEED  = 0.8
const CLOUD_WIDTH   =  46
const CLOUD_HEIGHT  =  13

let databus = new DataBus()

export default class Cloud {
  constructor() {
    this.img=new Image()
    this.img.src=CLOUD_IMG_SRC
    this.width=CLOUD_WIDTH
    this.height=CLOUD_HEIGHT

    this.init()
  }

  init(){
    this.x=screenWidth+Math.random()*100
    this.y=screenHeight-150-Math.random()*200

    this.visible = true
  }

  update() {
    this.x -= CLOUD_MOVE_SPEED

    // 对象回收
    if ( this.x < -screenWidth ){
      // this.visible=false
      databus.removeClouds(this)
    }
  }

  render(ctx) {
    if(!this.visible)
      return 
    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height)
  }
}
import Sprite   from '../base/sprite'

const screenWidth    = window.innerWidth
const screenHeight   = window.innerHeight

const touchRange=20 //滑动触碰范围

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/dino1.png'
const PLAYER_JUMPING_IMG_SRC = 'images/dino1.png'//跳起来的图片
const PLAYER_RUNNING1_IMG_SRC = 'images/dino2.png'//跑动图片1
const PLAYER_RUNNING2_IMG_SRC = 'images/dino3.png'//跑动图片2
const PLAYER_WIDTH   = 44
const PLAYER_HEIGHT  = 47

const PLAYER_SQUAT1_IMG_SRC = 'images/dinop1.png'//蹲下跑动图片1
const PLAYER_SQUAT2_IMG_SRC = 'images/dinop2.png'//蹲下跑动图片1
const PLAYER_SQUAT_WIDTH  = 59
const PLAYER_SQUAT_HEIGHT  =  47


const INIT_RUN_SPEED=36//恐龙图片初始的切换速度
const MAX_RUN_SPEED=12//最大切换速度
const INIT_JUMP_SPEED=3.2//初始的跳跃速度
const INCREASE_JUMP_VALUE=0.05//跳跃增加的速度
const MAX_ACCUMULATIVE=1.6//最大蓄力
const ACCUMULATIVE_INCREASE_VALUE=0.025//蓄力增加量
const LIFE=1



const Status={//状态枚举
  "Running":0,
  "Jumping":1,
  "Dorping":2,
  "Squat":3,
  "Dead":4
}

let pressFlag=false
let touchx
let touchy
let startTouchx
let startTouchy


class collisionBox{//碰撞盒子
  constructor(x,y,w,h){
    this.x=x
    this.y=y
    this.w=w
    this.h=h
  }
}


export default class Player  {
  constructor() {
    this.TouchEvent()
    this.img     = new Image()
    this.img.src = PLAYER_IMG_SRC
    this.width  = PLAYER_WIDTH
    this.height = PLAYER_HEIGHT
    this.imgJump = new Image()
    this.imgJump.src = PLAYER_JUMPING_IMG_SRC
    this.imgRun1 = new Image()
    this.imgRun1.src = PLAYER_RUNNING1_IMG_SRC
    this.imgRun2 = new Image()
    this.imgRun2.src = PLAYER_RUNNING2_IMG_SRC
   
    this.imgSquat1 = new Image()
    this.imgSquat1.src  = PLAYER_SQUAT1_IMG_SRC
    this.imgSquat2 = new Image()
    this.imgSquat2.src  = PLAYER_SQUAT2_IMG_SRC
    this.squatW=PLAYER_SQUAT_WIDTH
    this.squatH=PLAYER_SQUAT_HEIGHT


    this.x=100
    this.y=screenHeight-100+12-this.height


    this.statu=Status.Running//状态
    this.aclJumpFlag=false//蓄力跳
    this.accumulative=0//当前的蓄力值
    this.jumpSpeed=INIT_JUMP_SPEED//跳跃的速度
    this.speed= INIT_RUN_SPEED//切换图片的速度
    this.life=LIFE

    //玩家的盒子
    this.squatBody=new collisionBox(4,21,51,14)
    this.squatFoot=new collisionBox(3,36,21,5)
    this.head=new collisionBox(23,3,18,11)
    this.body=new collisionBox(3,20,26,11)
    this.foot=new collisionBox(12,31,12,13)

    // 用于在手指移动的时候标识手指是否已经在飞机上了
    this.touched = false
    this.visible = true

  }


  drawToCanvas(ctx,fram) {
    if ( !this.visible )
      return
    switch(this.statu){
      case Status.Running:
        if(fram%this.speed>this.speed/2){
          ctx.drawImage(this.imgRun1,this.x,this.y,this.width,this.height)
        }else{
          ctx.drawImage(this.imgRun2,this.x,this.y,this.width,this.height)
        }
        break
      case Status.Jumping:
      case Status.Dorping:
        ctx.drawImage(this.imgJump,this.x,this.y,this.width,this.height)
        break
      case Status.Squat:
        if(fram%this.speed>this.speed/2){
          ctx.drawImage(this.imgSquat1,this.x,this.y,this.squatW,this.squatH)
        }else{
          ctx.drawImage(this.imgSquat2,this.x,this.y,this.squatW,this.squatH)
        }
        break
      default:
        break;
    }
    //角色的蓄力条
    ctx.fillStyle = 'rgba(0,0,0,0.1)'//0.1倍的黑色
    ctx.fillRect(this.x-10,this.y,8,this.height)
    if(this.accumulative<MAX_ACCUMULATIVE/2){
      ctx.fillStyle = 'rgba(199,244,100)'//绿色
    }else if(this.accumulative==MAX_ACCUMULATIVE){
      ctx.fillStyle = 'rgba(255,0,0)'//红色
    }else{
      ctx.fillStyle = 'rgba(248,202,0)'//绿色
    }
    ctx.fillRect(this.x-10,this.y+this.height-this.accumulative*30,8,this.accumulative*30)
 
  
  }

  Move(){
    switch(this.statu){
      case Status.Running:
        if(this.accumulative>0)this.accumulative-=ACCUMULATIVE_INCREASE_VALUE/4
        if(this.accumulative<0)this.accumulative=0
        break
      case Status.Jumping://跳起
        this.y-=this.jumpSpeed
        this.jumpSpeed-=INCREASE_JUMP_VALUE
        if(this.jumpSpeed<=0){
          this.statu=Status.Dorping
        }
        if(this.accumulative>0)this.accumulative-=ACCUMULATIVE_INCREASE_VALUE
        if(this.accumulative<0)this.accumulative=0
        break
      case Status.Dorping://落下
        this.y+=this.jumpSpeed
        this.jumpSpeed+=INCREASE_JUMP_VALUE
        if(this.y>screenHeight-100+12-this.height){//落地
          this.y=screenHeight-100+12-this.height
          this.jumpSpeed=INIT_JUMP_SPEED
          this.statu=Status.Running
          // landspeed=landspeed_recode
        }
        if(this.accumulative>0)this.accumulative-=ACCUMULATIVE_INCREASE_VALUE
        if(this.accumulative<0)this.accumulative=0
        break
       
      case Status.Squat: //低头
        if(this.accumulative<MAX_ACCUMULATIVE){
          this.accumulative+=ACCUMULATIVE_INCREASE_VALUE
          if(this.accumulative>MAX_ACCUMULATIVE)this.accumulative=MAX_ACCUMULATIVE
        }
        break
    }
  }


    /**
   * 简单的碰撞检测定义：
   * 另一个精灵的中心点处于本精灵所在的矩形内即可
   * @param{Sprite} sp: Sptite的实例
   */
  isCollideWith(sp) {
    let spX = sp.x + sp.width / 2
    let spY = sp.y + sp.height / 2

    if ( !this.visible || !sp.visible )
      return false

    return !!(   spX >= this.x
              && spX <= this.x + this.width
              && spY >= this.y
              && spY <= this.y + this.height  )
  }



  //----------------------------------玩家的点击事件----------------------------------------------

  TouchEvent(){
    wx.onTouchStart((e) => {
      console.log("点击屏幕")
      if(this.statu!=Status.Jumping&&this.statu!=Status.Dorping&&!pressFlag){
        startTouchx=e.changedTouches[0].clientX
        startTouchy=e.changedTouches[0].clientY
        pressFlag=true
     }
    })

    wx.onTouchMove((e) => {
      if(pressFlag){
        touchx=e.changedTouches[0].clientX
        touchy=e.changedTouches[0].clientY
        if(touchy>startTouchy+touchRange){
          console.log("下滑")
          this.statu=Status.Squat
        }
        if(touchy<startTouchy-touchRange){
          console.log("上滑")
          this.statu=Status.Running
        }
        if(touchx>startTouchx+touchRange){
          console.log("右滑")
        }
        if(touchx<startTouchx-touchRange){
          console.log("左滑")
        }
      }
    })

    wx.onTouchEnd((e) => {
      console.log("松开：")
      let x=e.changedTouches[0].clientX//获取触摸点的x坐标
      let y=e.changedTouches[0].clientY//获取y坐标
      if(this.statu!=Status.Jumping&&this.statu!=Status.Dorping){
        if(y>=startTouchy-10){
          this.statu=Status.Jumping
          this.jumpSpeed+=this.accumulative
          // landspeed_recode=landspeed
          // if(this.accumulative>runner.max_accumulative/2){
          //   landspeed*=1.5
          // }
        }else{
          this.statu=Status.Running
        }
        pressFlag=false
      }
    })

  }
 
}


import DataBus   from '../databus'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

class collisionBox{//碰撞盒子
  constructor(x,y,w,h){
    this.x=x
    this.y=y
    this.w=w
    this.h=h
  }
}

class Obstacle{//障碍物类
  constructor(width,height,image){
    this.width=width
    this.height=height
    this.image=image
    this.box1
    this.box2
    this.box3
  }
}

let obs=[];

function initObstacle(){
  //障碍物1
  obs[0]=new Obstacle(25,50,'obstacle1')
  obs[0].box1=new collisionBox(2,14,3,15);
  obs[0].box2=new collisionBox(10,2,5,44);
  obs[0].box3=new collisionBox(18,10,7,22);
  //障碍物2
  obs[1]=new Obstacle(50,50,'obstacle2')
  obs[1].box1=new collisionBox(2,14,3,15);
  obs[1].box2=new collisionBox(10,5,30,42);
  obs[1].box3=new collisionBox(45,12,3,14);
  //障碍物3
  obs[5]=new Obstacle(75,50,'obstacle3')
  obs[5].box1=new collisionBox(2,14,3,15);
  obs[5].box2=new collisionBox(9,5,57,43);
  obs[5].box3=new collisionBox(70,13,3,14);
  //障碍物4
  obs[3]=new Obstacle(17,35,'obstacle4')
  obs[3].box1=new collisionBox(2,10,2,10);
  obs[3].box2=new collisionBox(7,2,3,32);
  obs[3].box3=new collisionBox(12,6,3,11);
  //障碍物5
  obs[4]=new Obstacle(34,35,'obstacle5')
  obs[4].box1=new collisionBox(2,10,3,10);
  obs[4].box2=new collisionBox(7,4,20,30);
  obs[4].box3=new collisionBox(29,7,3,12);
  //障碍物6
  obs[2]=new Obstacle(51,35,'obstacle6')
  obs[2].box1=new collisionBox(2,10,3,11);
  obs[2].box2=new collisionBox(7,4,37,30);
  obs[2].box3=new collisionBox(46,7,3,12);
  //障碍物7-鸟
  obs[6]=new Obstacle(46,40,'bird1')
  obs[6].box1=new collisionBox(4,11,10,7);
  obs[6].box2=new collisionBox(18,17,8,17);
  obs[6].box3=new collisionBox(27,20,15,16);
  obs[7]=new Obstacle(46,30,'bird2')
  obs[7].box1=new collisionBox(6,10,8,8);
  obs[7].box2=new collisionBox(18,9,8,19);
  obs[7].box3=new collisionBox(27,20,15,8);
}
initObstacle()



const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end){
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Enemy  {
  constructor() {
    // this.num=Math.round(Math.random()*10)%5
    // this.width=obs[this.num].width
    // this.height=obs[this.num].height
    // this.img     = new Image()
    // this.img.src = 'images/'+obs[this.num].image+'.png'
    // this.x = screenWidth+rnd(0, 200)
    // this.y=screenHeight-100-this.height+9//对齐地面
    // this.box1=obs[this.num].box1
    // this.box2=obs[this.num].box2
    // this.box3=obs[this.num].box3
    // this.checkflag=true
    // this.visible = true
    this.init()
  }

  init() {
    this.num=6
    // this.num=Math.round(Math.random()*10)%5
    // if(score>=scoreoflevel_config)this.num=Math.round(Math.random()*10)%7
    this.width=obs[this.num].width
    this.height=obs[this.num].height
    this.box1=obs[this.num].box1
    this.box2=obs[this.num].box2
    this.box3=obs[this.num].box3
    this.x=screenWidth+rnd(0, 200)
    this.y=screenHeight-100-this.height+9//对齐地面
    this.checkflag=true
    this.img=new Image()
    this.img.src='images/'+obs[this.num].image+'.png'
    this.visible = true
    if(this.num==6){
      this.img2=new Image()
      this.img2.src='images/'+obs[this.num+1].image+'.png'
      this.y=screenHeight-100-this.height-Math.random()*150
      this.imgSwitch=30+Math.random()*80
      // this.speed
    }
  }

  drawToCanvas(ctx,fram) {
    if ( !this.visible )
      return
    if(this.num==6){
        if(fram%this.imgSwitch>this.imgSwitch/2){
          ctx.drawImage(this.img,this.x,this.y)
          this.height=obs[this.num].height
        }else{
          ctx.drawImage(this.img2,this.x,this.y)
          this.height=obs[this.num+1].height
        }
    }else{
        ctx.drawImage(this.img,this.x,this.y)
    }
  }

  // 每一帧更新位置
  update(landspeed) {
    this.x -= landspeed

    // 对象回收
    if ( this.x < -this.width )
      databus.removeEnemey(this)
  }
}



  import Main from './js/main'
//------------------------------------------------------------------------
wx.setPreferredFramesPerSecond(40);
const canvas = wx.createCanvas()
const bg = canvas.getContext('2d') //背景
const { windowWidth, windowHeight } = wx.getSystemInfoSync()//屏幕的宽和高设置为windowWidth和windowHeight
//横屏不适配问题————————————
canvas.width = wx.getSystemInfoSync().windowWidth;
canvas.height = wx.getSystemInfoSync().windowHeight;
//————————————————————
let score=0
let time=0
let fps=2
let landx1=0//第一个地面的x坐标
let landx2=1200
let landspeed_config=1.5
let landspeed=landspeed_config
let landspeed_recode
let landspeedIncrease=0.3//地面移动速度的增加量
let landMaxspeed=6//地面移动速度的最大值
let level=0//关卡等级
let scoreIncrease=1//分数增长量
let scoreoflevel_config=50
let scoreoflevel=scoreoflevel_config//过多少分之后速度增加
let scoreoflevelIncrease=40
let runinitspeed=36//恐龙图片切换到速度
let maxrunspeed=12
let land1=wx.createImage()
land1.src='images/land.png'//1200*12
let land2=wx.createImage()
land2.src='images/land.png'
let runner
let obs=[]
let obsbox=[]
let cloud=[]
let maxcloud=8
let obsdist_config=300
let obsdist=obsdist_config
let gamestart=false
let gameover=true
let life=1
let pressflag=false
let touchx
let touchy
let starttouchx
let starttouchy
let Status={//状态枚举
  "Running":0,
  "Jumping":1,
  "Dorping":2,
  "Squat":3,
  "Dead":4
}



function timer(){
time++
if(time>1000)time=time-1000
}

function bgackground(){//背景
  bg.clearRect(0, 0, windowWidth, windowHeight)
  bg.fillStyle='#ffffff'
  bg.fillRect(0, 0, windowWidth, windowHeight)
  bg.drawImage(land1,landx1-=landspeed,windowHeight-100)
  bg.drawImage(land2,landx2-=landspeed,windowHeight-100)
  if(landx1<-1200)landx1=landx2+1200
  if(landx2<-1200)landx2=landx1+1200
  bg.fillStyle='#000000'
  bg.font = '20'
  bg.fillText("score:"+score,10,20)
  for(let i=0;i<cloud.length;i++){
    cloud[i].Move()
    if(cloud[i].x<-cloud[i].w){
      cloud[i]=new Cloud(cloud[i>0?i-1:cloud.length-1].x)
    }
  }
}

class collisionBox{//碰撞盒子
  constructor(x,y,w,h){
    this.x=x
    this.y=y
    this.w=w
    this.h=h
  }
}

class Runner{//主角类
  constructor(){
    this.width=44
    this.height=47
    this.squatw=59
    this.squath=47
    this.x=100
    this.y=windowHeight-100+12-this.height

    
    this.statu=Status.Running//状态
    this.accumulative_jump=false//蓄力跳
    this.max_accumulative=1.6//最大蓄力
    this.accumulative_incspeed=0.025//蓄力增加量
    this.accumulative=0//当前的蓄力值
    this.initjumpspeed=3.2//初始的跳跃速度
    this.jumpspeed=this.initjumpspeed
    this.incjumpspeed=0.05
    this.speed= runinitspeed//切换图片
    this.life=life


    this.runimg1=wx.createImage()
    this.runimg1.src='images/dino3.png'//44*47
     this.runimg2=wx.createImage()
     this.runimg2.src='images/dino2.png'
     this.jumpimg=wx.createImage()
     this.jumpimg.src='images/dino1.png'
     this.squatimg1=wx.createImage()
     this.squatimg1.src='images/dinop1.png'
     this.squatimg2=wx.createImage()
     this.squatimg2.src='images/dinop2.png'
     this.squatbody=new collisionBox(4,21,51,14)
     this.squatfoot=new collisionBox(3,36,21,5)
     this.head=new collisionBox(23,3,18,11)
     this.body=new collisionBox(3,20,26,11)
     this.foot=new collisionBox(12,31,12,13)
  }
  //显示主角图片
  Display(){
    switch(this.statu){
      case Status.Running:
        if(time%this.speed>this.speed/2){
          bg.drawImage(this.runimg1,this.x,this.y,this.width,this.height)
        }else{
          bg.drawImage(this.runimg2,this.x,this.y,this.width,this.height)
        }
        break
      case Status.Jumping:
      case Status.Dorping:
        bg.drawImage(this.jumpimg,this.x,this.y,this.width,this.height)
        break
      case Status.Squat:
        if(time%this.speed>this.speed/2){
          bg.drawImage(this.squatimg1,this.x,this.y,this.squatw,this.squath)
        }else{
          bg.drawImage(this.squatimg2,this.x,this.y,this.squatw,this.squath)
        }
        break
    }
    //角色的蓄力条
    bg.fillStyle = 'rgba(0,0,0,0.1)'//0.1倍的黑色
    bg.fillRect(this.x-10,this.y,8,this.height)
    if(this.accumulative<this.max_accumulative/2){
      bg.fillStyle = 'rgba(199,244,100)'//绿色
    }else if(this.accumulative==this.max_accumulative){
      bg.fillStyle = 'rgba(255,0,0)'//红色
    }else{
      bg.fillStyle = 'rgba(248,202,0)'//绿色
    }
    bg.fillRect(this.x-10,this.y+this.height-this.accumulative*30,8,this.accumulative*30)
  }
  //主角移动的状态
  Move(){
    switch(this.statu){
      case Status.Running:
        if(this.accumulative>0)this.accumulative-=this.accumulative_incspeed/4
        if(this.accumulative<0)this.accumulative=0
        break
      case Status.Jumping:
        //跳起
        this.y-=this.jumpspeed
        this.jumpspeed-=this.incjumpspeed
        if(this.jumpspeed<=0){
          this.statu=Status.Dorping
        }
        if(this.accumulative>0)this.accumulative-=this.accumulative_incspeed
        if(this.accumulative<0)this.accumulative=0
        break
        //落下
      case Status.Dorping:
        this.y+=this.jumpspeed
        this.jumpspeed+=this.incjumpspeed
        if(this.y>windowHeight-100+12-this.height){//落地
          this.y=windowHeight-100+12-this.height
          this.jumpspeed=this.initjumpspeed
          this.statu=Status.Running
          landspeed=landspeed_recode
        }
        if(this.accumulative>0)this.accumulative-=this.accumulative_incspeed
        if(this.accumulative<0)this.accumulative=0
        break
        //低头
      case Status.Squat:
        if(this.accumulative<this.max_accumulative){
          this.accumulative+=this.accumulative_incspeed
          if(this.accumulative>this.max_accumulative)this.accumulative=this.max_accumulative
        }
        break
    }
  }
}

class Cloud{//云
  constructor(tx){
    this.x=Math.random()*250+tx-maxcloud*20+200
    if(this.x<windowWidth)this.x+=windowWidth
    this.y=windowHeight-150-Math.random()*200
    this.size=Math.random()+1
    this.w=46*this.size
    this.h=13*this.size
    this.speed=Math.random()/2
    this.image=wx.createImage()
    this.image.src='images/cloud.png'
  }
  Move(){
    bg.drawImage(this.image,this.x,this.y,this.w,this.h)
    this.x-=landspeed/4+this.speed
  }
}

function collisionCheck(obsx,obsy,obsw,obsh){//碰撞检测
  if(runner.x<obsx+obsw&&runner.x+runner.width>obsx&&runner.y<obsy+obsh&&runner.y+runner.height>obsy){
    if(runner.x+runner.head.x<obsx+obsw&&runner.x+runner.head.x+runner.head.w>obsx&&runner.y+runner.head.y<obsy+obsh&&runner.y+runner.head.y+runner.head.h>obsy){
      console.log('check:head')
      return true
    }else if(runner.x+runner.body.x<obsx+obsw&&runner.x+runner.body.x+runner.body.w>obsx&&runner.y+runner.body.y<obsy+obsh&&runner.y+runner.body.y+runner.body.h>obsy){
      console.log('check:body')
      return true
    }else if(runner.x+runner.foot.x<obsx+obsw&&runner.x+runner.foot.x+runner.foot.w>obsx&&runner.y+runner.foot.y<obsy+obsh&&runner.y+runner.foot.y+runner.foot.h>obsy){
      console.log('check:foot')
      return true
    }
    return false
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

class ObstacleBox{//障碍物盒子
  constructor(tx){
    // this.num=6
    this.num=Math.round(Math.random()*10)%5
    if(score>=scoreoflevel_config)this.num=Math.round(Math.random()*10)%7
    this.width=obs[this.num].width
    this.height=obs[this.num].height
    this.box1=obs[this.num].box1
    this.box2=obs[this.num].box2
    this.box3=obs[this.num].box3
    this.x=tx+Math.random()*400+obsdist
    this.y=windowHeight-100-this.height+9//对齐地面
    this.checkflag=true
    this.image=wx.createImage()
    this.image.src='images/'+obs[this.num].image+'.png'
    if(this.num==6){
      this.image2=wx.createImage()
      this.image2.src='images/'+obs[this.num+1].image+'.png'
      this.y=windowHeight-100-this.height-Math.random()*150
      this.imgswitch=30+Math.random()*80
    }
  }
  move(){
    if(this.num==6){//
      if(time%this.imgswitch>this.imgswitch/2){
        bg.drawImage(this.image,this.x,this.y)
        this.height=obs[this.num].height
      }else{
        bg.drawImage(this.image2,this.x,this.y)
        this.height=obs[this.num+1].height
      }
    }else{
      bg.drawImage(this.image,this.x,this.y)
    }
    this.x-=landspeed
  }
}

function Initial(){//初始化
  time=0
  score=0
  runner=new Runner()
  pressflag=false
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
  obsdist=obsdist_config
  landspeed=landspeed_config
  scoreoflevel=scoreoflevel_config
  obsbox[0]=new ObstacleBox(windowWidth)
  for(let i=1;i<5;i++){
    obsbox[i]=new ObstacleBox(obsbox[i-1].x)
  }
  cloud[0]=new Cloud(windowWidth+Math.random()*20)
  for(let i=1;i<maxcloud-1;i++){
    cloud[i]=new Cloud(cloud[i-1].x)
  }
 }
 Initial()

function start(){
  if(!gamestart){
    bg.fillStyle='#ffffff'
    bg.fillRect(0,0,windowWidth,windowHeight)
    bg.fillStyle='#1aada9'
    bg.fillRect(windowWidth/2-40,windowHeight/2-20,80,40)
    bg.fillStyle='#000000'
    bg.fillText('S t a r t',windowWidth/2-20,windowHeight/2)
  }
}

function restart(){
  if(gameover){
    bg.fillStyle='#1aada9'
    bg.fillRect(windowWidth/2-40,windowHeight/2-20,80,40)
    bg.fillStyle='#000000'
    bg.fillText('R e s t a r t',windowWidth/2-27,windowHeight/2)
  }
}

 function moveObs(){//障碍物移动
  for(let i=0;i<obsbox.length;i++){
    obsbox[i].move()
    if(obsbox[i].x<0-obsbox[i].width){
      // obsbox.shift()
      // obsbox.push(new ObstacleBox(obsbox[obsbox.length-1].x))
      obsbox[i]=new ObstacleBox(obsbox[i>0?i-1:obsbox.length-1].x)
      // console.log(obsbox[i+1].x)
    }
    if( obsbox[i].checkflag){
      if(collisionCheck(obsbox[i].x+obsbox[i].box1.x,obsbox[i].y+obsbox[i].box1.y,obsbox[i].box1.w,obsbox[i].box1.h)||collisionCheck(obsbox[i].x+obsbox[i].box2.x,obsbox[i].y+obsbox[i].box2.y,obsbox[i].box2.w,obsbox[i].box2.h)||collisionCheck(obsbox[i].x+obsbox[i].box3.x,obsbox[i].y+obsbox[i].box3.y,obsbox[i].box3.w,obsbox[i].box3.h)){
        runner.life--
        console.log('life:'+runner.life)
        obsbox[i].checkflag=false
      }
    }
  }
 }

 function GlobalControl(){//全局控制
  if(time%30 ==0)score+=scoreIncrease
  if(runner.life<=0&&gameover==false){
    gameover=true
    console.log(landspeed)
  }
  if(score>scoreoflevel){
    landspeed+=landspeedIncrease
    if(landspeed>=landMaxspeed)landspeed=landMaxspeed

    runner.speed-=landspeedIncrease*2
    if(runner.speed<=maxrunspeed)runner.speed=maxrunspeed

    scoreoflevel+=scoreoflevelIncrease
    level++
    if(level>=(landMaxspeed-landspeed_config)/landspeedIncrease)level=(landMaxspeed-landspeed_config)/landspeedIncrease
  }
 }


 
/* UIScrollView2 */
// 不添加 Mask 组件，让 UIGraphic 显示实际 UIScrollView 区域大小
const scrollView2Entity = game.createEntity2D('UIScrollView2');
scrollView2Entity.transform2D.position.x = 200;
scrollView2Entity.transform2D.size.x = 600;
scrollView2Entity.transform2D.size.y = 400;
const scrollView2 = scrollView2Entity.addComponent(engine.UIScrollView);
// 开启 UIScrollView 根据信息与配置，将内容区域设置到对应位置的逻辑
scrollView2.autoFix = true;
// autoFix 下内容区域相对于滑动区域左对齐
scrollView2.cellAlignmentX = 0;
// autoFix 下内容区域相对于滑动区域下对齐
scrollView2.cellAlignmentY = 0;
// 滑动到起点边界时，禁止往起点外滑动
scrollView2.snapToStart = true;
// 滑动到终点边界时，禁止往终点外滑动
scrollView2.snapToEnd = true;
// 以水平方向进行滑动控制
scrollView2.movement = engine.UIScrollView.MovementType.Horizontal;
const scrollView2Touch = scrollView2Entity.addComponent(engine.TouchInputComponent);
// 不添加 Mask 组件，让 UIGraphic 显示实际 UIScrollView 区域大小
const scrollView2Graphic = scrollView2Entity.addComponent(engine.UIGraphic);
uiRoot.addChild(scrollView2Entity.transform2D);

// UIScrollView2 所在节点的子节点 UIGrid2
const grid2Entity = game.createEntity2D('UIGrid2');
const grid2 = grid2Entity.addComponent(engine.UIGrid);
grid2.cellWidth = 200;
grid2.cellHeight = 100;
for (let i = 1; i < 5; i++) {
    const gridItem = game.createEntity2D('UIGrid2.' + i);
    gridItem.transform2D.size.x = 200;
    gridItem.transform2D.size.y = 100;
    const gridItemGraphic = gridItem.addComponent(engine.UIGraphic);
    gridItemGraphic.color = new engine.Color(i * 123 % 255, i * 88 % 255, i * 168 % 255);
    grid2Entity.transform2D.addChild(gridItem.transform2D);
}
scrollView2Entity.transform2D.addChild(grid2Entity.transform2D);

 
setInterval(function(){//主函数
 if(gamestart){
   if(!gameover){
    bgackground()
    timer()
    runner.Display()
    runner.Move()
    moveObs()
    GlobalControl()
    restart()
   }
 }else(
  start()
 
 )
}, fps)



  wx.onTouchStart((e) => {
    if(runner.statu!=Status.Jumping&&runner.statu!=Status.Dorping&&!pressflag){
      starttouchx=e.changedTouches[0].clientX
      starttouchy=e.changedTouches[0].clientY
      pressflag=true
   }
  })

  wx.onTouchMove((e) => {
    if(pressflag){
      touchx=e.changedTouches[0].clientX
      touchy=e.changedTouches[0].clientY
      if(touchy>starttouchy){
        runner.statu=Status.Squat
      }else{
        runner.statu=Status.Running
      }
    }
  })
  

  wx.onTouchEnd((e) => {
    let x=e.changedTouches[0].clientX//获取触摸点的x坐标
    let y=e.changedTouches[0].clientY//获取y坐标
    if(gamestart){
      if(!gameover){
        if(runner.statu!=Status.Jumping&&runner.statu!=Status.Dorping){
          if(y>=starttouchy-5){
            runner.statu=Status.Jumping
            runner.jumpspeed+=runner.accumulative
            landspeed_recode=landspeed
            if(runner.accumulative>runner.max_accumulative/2){
              landspeed*=1.5
            }
          }else{
            runner.statu=Status.Running
          }
          pressflag=false
        }
      }else{
        if(x>windowWidth/2-40&&x<windowWidth/2-40+80&&y>windowHeight/2-20&&y<windowHeight/2-20+40){
          gameover=false
          Initial()
        }
      }
    }else{
      if(x>windowWidth/2-40&&x<windowWidth/2-40+80&&y>windowHeight/2-20&&y<windowHeight/2-20+40){
        gamestart=true
        gameover=false
      }
    }
  })


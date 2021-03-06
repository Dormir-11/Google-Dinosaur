import Player     from './player/index'
import Enemy      from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo   from './runtime/gameinfo'
import Cloud      from './runtime/cloud'

// import Music      from './runtime/music'
import DataBus    from './databus'


let ctx   = canvas.getContext('2d')
let databus = new DataBus()
const landspeed_config=1.5//地面的初始移动速度

const Status={//状态枚举
  "Running":0,
  "Jumping":1,
  "Dorping":2,
  "Squat":3,
  "Dead":4
}

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId    = 0
  
    this.restart()


    this.landspeed=landspeed_config//地面的 移动速度
    this.landspeed_recode//记录
    this.landspeedIncrease=0.3//地面移动速度的增加量
    this.landMaxspeed=6//地面移动速度的最大值
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg       = new BackGround(ctx)
    this.player   = new Player(ctx)
    this.gameinfo = new GameInfo()
    // this.music    = new Music()

    this.bindLoop     = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if ( databus.frame % 300 === 0 ) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init()
      databus.enemys.push(enemy)
    }
  }

  cloudGenerate() {
    if (databus.frame % 150 === 0 ) {
      let cloud = databus.pool.getItemByClass('cloud', Cloud)
      cloud.init()
      databus.clouds.push(cloud)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for ( let i = 0, il = databus.enemys.length; i < il;i++ ) {
        let enemy = databus.enemys[i]

        if ( !enemy.isPlaying && enemy.isCollideWith(bullet) ) {
          // enemy.playAnimation()
          // that.music.playExplosion()

          bullet.visible = false
          databus.score  += 1

          break
        }
      }
    })

    for ( let i = 0, il = databus.enemys.length; i < il;i++ ) {
      let enemy = databus.enemys[i]

      if ( this.player.isCollideWith(enemy) ) {
        this.player.life--
        if(this.player.life==0)
          databus.gameOver = true
        console.log("life:"+this.player.life)
        break
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
     e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (   x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY  )
      this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    // ctx.globalAlpha=0.5//全局透明度  
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle='#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    databus.bullets
          .concat(databus.enemys)
          .forEach((item) => {
              item.drawToCanvas(ctx,databus.frame)
            })

    this.cloudGenerate()
    databus.clouds
            .concat(databus.clouds)
            .forEach((item) => {
               item.update()
               item.render(ctx)
             })

    this.player.drawToCanvas(ctx,databus.frame)
    this.player.Move()

    databus.animations.forEach((ani) => {
      if ( ani.isPlaying ) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)

    // 游戏结束停止帧循环
    if ( databus.gameOver ) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      if ( !this.hasEventBind ) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }

  }

  // 游戏逻辑更新主函数
  update() {
    


    
    if ( databus.gameOver )
      return;

    this.bg.update(this.landspeed)

    databus.bullets
           .concat(databus.enemys)
           .forEach((item) => {
              item.update(this.landspeed)
            })

    this.enemyGenerate()


    this.collisionDetection()

  }

  // 实现游戏帧循环
  loop() {
    databus.frame++
    // if(databus.frame>999)databus.frame=0

    this.update()
    this.render()
    

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )


   
  }

  
  
}





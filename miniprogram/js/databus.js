import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame      = 0
    this.score      = 0
    this.bullets    = []
    this.enemys     = []
    this.clouds     = []
    this.animations = []
    this.gameOver   = false
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    let temp = this.enemys.shift()

    temp.visible = false

    this.pool.recover('enemy', enemy)
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    let temp = this.bullets.shift()

    temp.visible = false

    this.pool.recover('bullet', bullet)
  }

  removeClouds(cloud) {
    let temp = this.clouds.shift()

    temp.visible = false
    // this.clouds.remove(cloud)


    this.pool.recover('cloud', temp)
    
  }
}





Array.prototype.indexOf = function(val) 
    { 
      for (var i = 0; i < this.length; i++) 
      { 
        if (this[i] == val) return i; 
      } 
      return -1; 
    };

Array.prototype.remove = function(val) 
    { 
      var index = this.indexOf(val); 
      if (index > -1) { 
        this.splice(index, 1); 
      } 
    };
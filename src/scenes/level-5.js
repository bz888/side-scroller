import { Scene, Curves, Display } from 'phaser'
import { Player } from '../classes/player'
import { Trigger } from '../classes/triggers'

export class Level5 extends Scene {
  constructor () {
    super('level-5-scene')
  }

  create () {
    this.initMap()
    this.initPlayer()
    this.pathSetup()
    this.enemySetup()
    this.triggerSetup()
    this.cameraSetup()

    // change position if needed (but use same position for both images)
    var backgroundBar = this.add.image(150, 50, 'green-bar')
    backgroundBar.setScrollFactor(0)

    this.playerHealthBar = this.add.image(155, 50, 'red-bar')
    this.playerHealthBar.setScrollFactor(0)
    console.log(this.playerHealthBar)

    // add text label to left of bar
    this.healthLabel = this.add.text(40, 40, 'Health', { fontSize: '20px', fill: '#ffffff' })
    this.healthLabel.setScrollFactor(0)

    this.enemyHealthBar = this.add.image(3450, 34, 'enemy-shadow-bar')
    this.add.image(3450, 22, 'enemy-red-bar')
    this.add.text(3250, 40, 'Boss Health', { fontSize: '20px', fill: '#ffffff' })
  }

  changeScene () {
    this.scene.start('win-scene')
  }

  initMap () {
    // creating tilemap
    const map = this.make.tilemap({ key: 'level5-map' })
    const tilesetBackground = map.addTilesetImage('background', 'level5-bg')
    const tilesetGround = map.addTilesetImage('tiles', 'level5-ground')
    const tilesetProps = map.addTilesetImage('props', 'props')
    const tilesetPlatforms = map.addTilesetImage('platform', 'platforms')

    // linking pngs to tileset names in the map
    // creating layers to reflect tilemap layers - order matters for rendering
    this.walls = map.createLayer('Collision Layer', tilesetGround, 0, 0)
    this.jumpLayer = map.createLayer('Jump Layer', tilesetGround, 0, 0)
    map.createLayer('Background', tilesetBackground)
    this.add.tileSprite(200, 1000, 8000, 2000, 'level5-Bg2')
      .setScrollFactor(0.6)
    this.add.tileSprite(200, 1450, 8000, 220, 'level5-Bg3')
      .setScrollFactor(0.8)
    map.createLayer('Platforms', tilesetPlatforms)
    this.water = map.createLayer('Ground Cover', tilesetGround)
    map.createLayer('Rock1', tilesetGround)
    map.createLayer('Rock2', tilesetGround)
    map.createLayer('Props', tilesetProps)
    // setting collision property to ground
    this.jumpLayer.setCollisionByExclusion(-1, true)
    this.walls.setCollisionByExclusion(-1, true)
  }

  initPlayer () {
    this.player = new Player(this, 0, 1600)
  }

  cameraSetup () {
    this.cameras.main.setViewport(0, 0, 960, 540)
    this.physics.world.setBounds(0, 0, 6000, 5760)
    this.cameras.main.startFollow(this.player, false, 0.5, 0.5, -400, 20)
    this.cameras.main.setBounds(0, 0, 6000, 1920)
  }

  enemySetup () {

  }

  triggerSetup () {
    this.endLevel = new Trigger(this, 3050, 1750)
  }

  pathSetup () {
    const points1 = [50, 400, 135, 400]
    const flyingPoints = [50, 400, 125, 320, 200, 400]
    this.curve = new Curves.Spline(points1)
    this.flying = new Curves.Spline(flyingPoints)
  }

  debugSetup () {
    this.input.on('pointerdown', () => {
      this.player.godMode = !this.player.godMode
    })

    const debugGraphics = this.add.graphics().setAlpha(0.7)
    this.jumpLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Display.Color(243, 234, 48, 255)
    })
    this.walls.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Display.Color(243, 20, 48, 255)
    })

    this.mouseCoords = this.add.text(50, 25)
    this.godMode = this.add.text(50, 45)
    this.playerHealth = this.add.text(50, 65)
    this.playerAmmo = this.add.text(50, 85)

    this.getPlayer = this.input.keyboard.addKey('P')

    const graphics = this.add.graphics()

    graphics.lineStyle(1, 0xffffff, 1)

    this.curve.draw(graphics, 64)
    this.flying.draw(graphics, 64)

    graphics.fillStyle(0x00ff00, 1)

    this.scene1 = this.input.keyboard.addKey('ONE')
    this.scene2 = this.input.keyboard.addKey('TWO')
    this.scene3 = this.input.keyboard.addKey('THREE')
    this.scene4 = this.input.keyboard.addKey('FOUR')
    this.scene5 = this.input.keyboard.addKey('FIVE')
  }

  debugUpdate () {
    this.mouseCoords.setText('X: ' + this.input.activePointer.worldX + ' Y: ' + this.input.activePointer.worldY)
    this.mouseCoords.x = this.player.x
    this.mouseCoords.y = this.player.y - 80
    this.godMode.setText('God mode: ' + this.player.godMode)
    this.godMode.x = this.player.x
    this.godMode.y = this.player.y - 100
    this.playerHealth.setText('Health: ' + this.player.hp)
    this.playerHealth.x = this.player.x
    this.playerHealth.y = this.player.y - 120
    this.playerAmmo.setText('Ammo: ' + this.player.gun.children.entries.length)
    this.playerAmmo.x = this.player.x
    this.playerAmmo.y = this.player.y - 140

    if (this.getPlayer.isDown) {
      console.log(this.player)
    }
    if (this.scene1.isDown) {
      this.scene.start('level-1-scene')
    }
    if (this.scene2.isDown) {
      this.scene.start('level-2-scene')
    }
    if (this.scene3.isDown) {
      this.scene.start('level-3-scene')
    }
    if (this.scene4.isDown) {
      this.scene.start('level-4-scene')
    }
    if (this.scene5.isDown) {
      this.scene.start('level-5-scene')
    }
  }

  update () {
    if (this.player.hp > 0) {
      this.player.update()
    } else if (this.player.active) {
      this.player.die()
      this.scene.start('death-scene', { checkpoint: 5 })
    }
  }
}

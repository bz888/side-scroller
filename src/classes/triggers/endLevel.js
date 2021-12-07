import { Physics } from 'phaser'

export class Trigger extends Physics.Arcade.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y)
    scene.physics.add.existing(this)
    this.body.allowGravity = false
    this.body.setImmovable(true)

    this.scene.anims.create({
      key: 'portal',
      frames: this.scene.anims.generateFrameNames('portal', {
        prefix: 'portal-',
        end: 4
      }),
      framerate: 5
    })

    const triggerZone = scene.physics.world.addOverlap(this, this.scene.player, () => {
      this.scene.time.addEvent({
        delay: 2500,
        callback: () => this.scene.changeScene()
      })

      this.scene.physics.world.removeCollider(triggerZone)
    })

    this.setSize(28, 65)
  }

  update () {
    this.anims.play('portal', true)
  }
}

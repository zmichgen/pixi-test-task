import * as PIXI from 'pixi.js';

async function wait(ms) {
  const result = await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
  return result;
}

const stairsPositions = {
  stair0: {
    x: 300,
    y: 50,
  },
  stair1: {
    x: 270,
    y: 200,
  },
  stair2: {
    x: 250,
    y: 200,
  },
  stair3: {
    x: 200,
    y: 100,
  },
};

class Game {
  constructor() {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    this.w = 1390;
    this.h = 640;

    this.canvas = document.getElementById('canvas');

    this.stage = new PIXI.Container();
    this.stage.sortableChildren = true;

    this.spritesheetname = 'images/spritesheet.json';

    this.renderer = new PIXI.Renderer({
      view: this.canvas,
      width: this.w,
      height: this.h,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });

    this.loader = PIXI.Loader.shared;
    this.ticker = new PIXI.Ticker();

    this.sprites = {};

    this.state = {
      start: true,
      showMenu: false,
      hammerClicked: false,
      menuClicked: false,

    };
    window.addEventListener('resize', this.resizeStage.bind(this));
  }

  start() {
    this.loader
      .add('background', 'images/back.png')
      .add('decor2', 'images/dec_2.png')
      .add('stair0', 'images/stair.png')
      .add('decor1', 'images/dec_1.png')
      .add('Austin', 'images/Austin.png')
      .add('logo', 'images/logo.png')
      .add('btn', 'images/btn.png')
      .add('hammer', 'images/icon_hammer.png')
      .add('menuItem1', 'images/1.png')
      .add('carpet1', 'images/01.png')
      .add('menuItem2', 'images/2.png')
      .add('carpet2', 'images/02.png')
      .add('menuItem3', 'images/3.png')
      .add('carpet3', 'images/03.png')
      .add('stair1', 'images/new_stair_01.png')
      .add('stair2', 'images/new_stair_02.png')
      .add('stair3', 'images/new_stair_03.png')
      .add('choosedItem', 'images/choosed.png')
      .add('ok', 'images/ok.png')
      .add('final', 'images/final.png')
      .load(this.initSprites.bind(this));
  }

  initSprites() {
    this.initSprite('background');
    this.initSprite('decor2');
    this.initSprite(
      'stair0',
      {
        x: this.renderer.width + stairsPositions.stair0.x,
        y: this.renderer.height + stairsPositions.stair0.y,
      },
      { x: 1, y: 1 },
      this.animateStair,
    );
    this.initSprite('decor1', { x: this.renderer.width, y: this.renderer.height }, { x: 1, y: 1 });
    this.initSprite('Austin', { x: this.renderer.width / 2 - 200, y: this.renderer.height / 2 - 100 }, { x: 0.5, y: 0.5 });
    this.initSprite('logo', { x: 20, y: 20 });
    this.initSprite(
      'btn',
      { x: this.renderer.width / 2, y: this.renderer.height - 50 },
      { x: 0.5, y: 1 },
      this.resizeSpriteInfinity,
      this.buttonClick,
    );
    this.initSprite(
      'hammer',
      { x: this.renderer.width - 100, y: this.renderer.height / 2 },
      { x: 1, y: 1 },
      this.showSprite,
      this.hammerClick,
    );
    this.initSprite('menuItem1', { x: this.renderer.width / 2 + 70, y: this.renderer.height / 2 - 200 }, null, this.animateMenuItem, this.menuClick, false);
    this.initSprite('carpet1', { x: this.renderer.width / 2 + 100, y: this.renderer.height / 2 - 230 }, null, this.animateMenuItem, null, false);
    this.initSprite('menuItem2', { x: this.renderer.width / 2 + 220, y: this.renderer.height / 2 - 250 }, null, this.animateMenuItem, this.menuClick, false);
    this.initSprite('carpet2', { x: this.renderer.width / 2 + 250, y: this.renderer.height / 2 - 320 }, null, this.animateMenuItem, null, false);
    this.initSprite('menuItem3', { x: this.renderer.width / 2 - 80, y: this.renderer.height / 2 - 150 }, null, this.animateMenuItem, this.menuClick, false);
    this.initSprite('carpet3', { x: this.renderer.width / 2 - 50, y: this.renderer.height / 2 - 140 }, null, this.animateMenuItem, null, false);

    this.initSprite('ok', null, { x: 0.5, y: 0 }, this.animateOk, this.clickOk, false);
    this.initSprite('final', null, null, this.animateFinal, null, null, false);
    this.startGame();
  }

  initSprite(name, position, anchor, animation, onClick, isShowing) {
    this.sprites[name] = new PIXI.Sprite(this.loader.resources[name].texture);
    if (name === 'logo' || name === 'btn') {
      this.sprites[name].zOrder = 1000;
    }
    this.sprites[name].state = this.state;
    this.sprites[name].isShowing = isShowing !== undefined ? isShowing : true;
    this.sprites[name].x = position && position.x ? position.x : 0;
    this.sprites[name].y = position && position.y ? position.y : 0;
    this.sprites[name].anchor.x = anchor ? anchor.x : 0;
    this.sprites[name].anchor.y = anchor ? anchor.y : 0;
    this.sprites[name].animate = animation ? animation.call(this, name) : null;
    if (onClick) {
      this.sprites[name].interactive = true;
      this.sprites[name].buttonMode = true;
      this.sprites[name].on('pointerdown', onClick.bind(this, name));
    }

    this.stage.addChild(this.sprites[name]);
  }

  startGame() {
    this.resizeStage();
    this.ticker.add(this.animate.bind(this));
    this.ticker.start();
  }

  animateFinal(name) {
    this.sprites[name].alpha = 0;
    return () => {
      if (this.sprites[name].isShowing) {
        this.sprites[name].alpha += this.sprites[name].alpha === 1 ? 0 : 0.05;
      }
    };
  }

  animate() {
    const keys = Object.keys(this.sprites);
    // eslint-disable-next-line no-restricted-syntax
    for (const key in keys) {
      if (this.sprites[keys[key]].animate) {
        if (this.sprites[keys[key]].animate) {
          this.sprites[keys[key]].animate();
        }
      }
    }
    this.renderer.render(this.stage);
  }

  animateMenuItem(name) {
    const maxWidth = this.sprites[name].width;
    this.sprites[name].width = 0;
    const maxHeight = this.sprites[name].height;
    this.sprites[name].height = 0;
    return () => {
      this.sprites[name].visible = this.sprites[name].isShowing;
      if (this.sprites[name].visible) {
        this.sprites[name].width += this.sprites[name].width >= maxWidth ? 0 : 15;
        this.sprites[name].height += this.sprites[name].height >= maxHeight ? 0 : 15;
      }
    };
  }

  animateOk(name) {
    return () => {
      this.sprites[name].visible = this.sprites[name].isShowing;
    };
  }

  resizeStage() {
    const scaleFactor = Math.min(
      window.innerWidth / this.w,
      window.innerHeight / this.h,
    );
    const newWidth = Math.ceil(this.w * scaleFactor);
    const newHeight = Math.ceil(this.h * scaleFactor);

    this.renderer.view.style.width = `${newWidth}px`;
    this.renderer.view.style.height = `${newHeight}px`;

    this.renderer.resize(newWidth, newHeight);
    this.stage.scale.set(scaleFactor);
  }

  resizeSpriteInfinity(name) {
    let count = 0;
    return () => {
      count += 0.03;
      const sizeAmount = Math.abs(Math.sin(count));
      this.sprites[name].transform.scale.x = 0.2 * sizeAmount + 1;
      this.sprites[name].transform.scale.y = 0.05 * sizeAmount + 1;
    };
  }

  showSprite(name) {
    const oldWidth = this.sprites[name].width;
    const oldHeight = this.sprites[name].height;
    this.sprites[name].width = 0;
    this.sprites[name].height = 0;
    return async () => {
      await wait(2000);
      if (this.sprites[name].isShowing) {
        this.sprites[name].width += this.sprites[name].width >= oldWidth ? 0 : 12;
        this.sprites[name].height += this.sprites[name].height >= oldHeight ? 0 : 15;
      } else {
        this.sprites[name].width -= this.sprites[name].width <= 0 ? 0 : 12;
        this.sprites[name].height -= this.sprites[name].height <= 0 ? 0 : 15;
      }
    };
  }

  hideSprite(name) {
    return () => {
      this.sprites[name].width -= this.sprites[name].width <= 0 ? 0 : 12;
      this.sprites[name].height -= this.sprites[name].height <= 0 ? 0 : 15;
    };
  }

  buttonClick() {
    this.resetState();
  }

  clickOk() {
    this.sprites.final.isShowing = true;
    this.sprites.logo.zIndex = 1000;
    this.sprites.btn.zIndex = 1000;
    this.hideMenu();
  }

  resetState() {
    this.sprites.hammer.isShowing = true;
    this.hideMenu();
    this.changeStair(0);
    this.sprites.final.isShowing = false;
    this.sprites.final.alpha = 0;
  }

  hammerClick() {
    this.state.showMenu = true;
    this.sprites.hammer.isShowing = false;
    this.sprites.menuItem1.isShowing = true;
    this.sprites.carpet1.isShowing = true;
    this.sprites.menuItem2.isShowing = true;
    this.sprites.carpet2.isShowing = true;
    this.sprites.menuItem3.isShowing = true;
    this.sprites.carpet3.isShowing = true;
    this.refreshMenuItems();
  }

  hideMenu() {
    this.sprites.menuItem1.isShowing = false;
    this.sprites.carpet1.isShowing = false;
    this.sprites.menuItem2.isShowing = false;
    this.sprites.carpet2.isShowing = false;
    this.sprites.menuItem3.isShowing = false;
    this.sprites.carpet3.isShowing = false;
    this.sprites.ok.isShowing = false;
    this.resetMenu();
  }

  refreshMenuItems() {
    for (let i = 1; i <= 3; i += 1) {
      const itemName = `menuItem${i}`;
      this.sprites[itemName].texture = this.loader.resources[itemName].texture;
    }
  }

  resetMenu() {
    for (let i = 1; i <= 3; i += 1) {
      this.sprites[`menuItem${i}`].width = 0;
      this.sprites[`menuItem${i}`].height = 0;
      this.sprites[`carpet${i}`].width = 0;
      this.sprites[`carpet${i}`].height = 0;
    }
  }

  menuClick(name) {
    const num = name.match(/\d/)[0];
    this.refreshMenuItems();
    this.changeStair(num);
    this.sprites[name].texture = this.loader.resources.choosedItem.texture;
    this.sprites.ok.isShowing = true;
    this.sprites.ok.x = this.sprites[name].x + this.sprites[name].width / 2;
    this.sprites.ok.y = this.sprites[name].y + this.sprites[name].height;
  }

  async changeStair(num) {
    this.sprites.stair0.switch = true;
    this.sprites.stair0.stairsNum = num;
  }

  animateStair() {
    let delta;
    return () => {
      if (this.sprites.stair0.switch) {
        delta = 15;
        this.sprites.stair0.alpha -= this.sprites.stair0.alpha <= 0 ? 0 : 0.1;
        if (this.sprites.stair0.alpha <= 0) {
          this.sprites.stair0.texture = this.loader.resources[`stair${this.sprites.stair0.stairsNum}`].texture;
          if (this.sprites.stair0.stairsNum === 0) {
            this.sprites.stair0.x = this.renderer.width + 5;
            this.sprites.stair0.y = this.renderer.height - 80;
          } else {
            this.sprites.stair0.x = this.renderer.width - stairsPositions[`stair${this.sprites.stair0.stairsNum}`].x;
            this.sprites.stair0.y = this.renderer.height - stairsPositions[`stair${this.sprites.stair0.stairsNum}`].y;
          }
          this.sprites.stair0.switch = false;
        }
      } else {
        delta -= 1;
        this.sprites.stair0.alpha += this.sprites.stair0.alpha >= 1 ? 0 : 0.1;
        this.sprites.stair0.y += delta >= 0 ? 1 : 0;
      }
    };
  }
}

export default Game;

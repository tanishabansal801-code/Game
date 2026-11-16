import Phaser from "phaser";

const looks = {
  dress: [
    { name: "Rose Couture", color: 0xe75b91, cost: 0, tags: ["glam", "party", "romantic"] },
    { name: "Midnight Satin", color: 0x29243f, cost: 30, tags: ["glam", "formal", "chic"] },
    { name: "Sunset Pop", color: 0xf18a45, cost: 45, tags: ["summer", "party", "bold"] },
    { name: "Royal Amethyst", color: 0x7845a8, cost: 60, tags: ["royal", "formal", "glam"] }
  ],
  hair: [
    { name: "Long Waves", color: 0x3a211d, cost: 0 },
    { name: "Golden Glow", color: 0xb77a32, cost: 20 },
    { name: "Raven Sleek", color: 0x17151b, cost: 25 }
  ],
  shoes: [
    { name: "Classic Heels", color: 0xf2d6df, cost: 0 },
    { name: "Ruby Heels", color: 0xb52b50, cost: 20 },
    { name: "Gold Heels", color: 0xc99a3d, cost: 25 }
  ],
  accessory: [
    { name: "Pearl Set", color: 0xf7e8c8, cost: 0 },
    { name: "Gold Statement", color: 0xd6a63f, cost: 20 },
    { name: "Crystal Bag", color: 0xa6d6e8, cost: 25 }
  ]
};

export { looks };

export class FashionScene extends Phaser.Scene {
  constructor() {
    super("FashionScene");
    this.selection = { dress: 0, hair: 0, shoes: 0, accessory: 0 };
    this.phase = "studio";
    this.walk = 0;
  }

  create() {
    this.cameras.main.setBackgroundColor("#24182b");
    this.drawBackdrop();
    this.drawStage();
    this.drawModel(0, 0, false);
    this.drawOpponent();
    this.events.on("selection", (selection) => {
      this.selection = selection;
      this.drawModel(0, 0, false);
    });
    this.events.on("runway", () => this.startRunway());
    this.events.on("studio", () => this.returnStudio());
    this.scale.on("resize", () => {
      this.children.removeAll(true);
      this.drawBackdrop();
      this.drawStage();
      this.drawModel(0, 0, this.phase === "runway");
      if (this.phase !== "runway") this.drawOpponent();
    });
  }

  drawBackdrop() {
    const w = this.scale.width, h = this.scale.height;
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x211529, 0x211529, 0x53344e, 0x24172b, 1);
    bg.fillRect(0, 0, w, h);
    for (let i = 0; i < 18; i++) {
      const x = (i * 83 + 27) % w;
      const y = (i * 47 + 19) % h;
      bg.fillStyle(0xf4c7df, 0.15);
      bg.fillCircle(x, y, (i % 3) + 1.5);
    }
    this.add.text(w / 2, 20, "FASHION BATTLE", {
      fontFamily: "Georgia, serif", fontSize: "20px", color: "#f8dce9",
      fontStyle: "bold", letterSpacing: 3
    }).setOrigin(0.5, 0);
    this.add.text(w / 2, 46, "STYLE YOUR STORY", {
      fontFamily: "Arial", fontSize: "9px", color: "#d9b6cb", letterSpacing: 4
    }).setOrigin(0.5, 0);
  }

  drawStage() {
    const w = this.scale.width, h = this.scale.height;
    const g = this.add.graphics();
    g.fillStyle(0x100d17, 0.45);
    g.fillEllipse(w * 0.5, h * 0.87, w * 0.72, h * 0.13);
    g.fillStyle(0xc78aab, 0.18);
    g.fillEllipse(w * 0.5, h * 0.87, w * 0.56, h * 0.08);
    g.lineStyle(2, 0xe9b6d2, 0.35);
    g.strokeEllipse(w * 0.5, h * 0.87, w * 0.56, h * 0.08);
  }

  drawModel(dx = 0, dy = 0, walking = false) {
    if (this.playerGroup) this.playerGroup.destroy(true);
    const w = this.scale.width, h = this.scale.height;
    const x = w * 0.5 + dx, y = h * 0.55 + dy;
    const group = this.add.container(x, y);
    this.playerGroup = group;
    const g = this.add.graphics();
    const dress = looks.dress[this.selection.dress];
    const hair = looks.hair[this.selection.hair];
    const shoes = looks.shoes[this.selection.shoes];
    const acc = looks.accessory[this.selection.accessory];
    const skin = 0xd99c7e;

    // Stylized 2D paper-doll character; replaceable layered artwork system.
    g.fillStyle(hair.color, 1);
    g.fillEllipse(0, -118, 64, 78);
    g.fillStyle(skin, 1);
    g.fillEllipse(0, -113, 42, 55);
    g.fillStyle(0x33202a, 1);
    g.fillEllipse(-9, -116, 4, 3);
    g.fillEllipse(9, -116, 4, 3);
    g.lineStyle(1.5, 0x9b4d60, 1);
    g.beginPath(); g.arc(0, -105, 7, 0.2, 2.9, false); g.strokePath();
    g.fillStyle(skin, 1);
    g.fillRoundedRect(-7, -88, 14, 18, 5);
    g.fillStyle(skin, 1);
    g.fillRoundedRect(-35, -75, 12, 70, 6);
    g.fillRoundedRect(23, -75, 12, 70, 6);
    g.fillStyle(dress.color, 1);
    g.fillRoundedRect(-25, -78, 50, 54, 12);
    g.fillTriangle(-25, -35, 25, -35, 40, 45);
    g.fillTriangle(-25, -35, -40, 45, 40, 45);
    g.fillStyle(skin, 1);
    g.fillRoundedRect(-17, 35, 13, 66, 6);
    g.fillRoundedRect(4, 35, 13, 66, 6);
    g.fillStyle(shoes.color, 1);
    g.fillRoundedRect(-20, 96, 20, 9, 4);
    g.fillRoundedRect(3, 96, 20, 9, 4);
    g.fillStyle(acc.color, 1);
    g.fillCircle(0, -69, 4);
    g.lineStyle(2, acc.color, 1);
    g.strokeCircle(-15, -105, 4);
    g.strokeCircle(15, -105, 4);
    if (walking) {
      g.lineStyle(2, 0xf5d2e4, 0.8);
      g.lineBetween(-42, -5, -55, 25);
      g.lineBetween(42, -5, 55, 25);
    }
    group.add(g);
    group.setScale(Math.min(w / 420, h / 520) * 1.3);
  }

  drawOpponent() {
    const w = this.scale.width, h = this.scale.height;
    const x = w * 0.79, y = h * 0.57;
    const g = this.add.graphics();
    g.fillStyle(0x241a24, 1); g.fillEllipse(x, y - 116, 56, 70);
    g.fillStyle(0xc88d74, 1); g.fillEllipse(x, y - 112, 38, 51);
    g.fillStyle(0x7d4c9d, 1);
    g.fillRoundedRect(x - 23, y - 77, 46, 55, 10);
    g.fillTriangle(x - 23, y - 35, x + 23, y - 35, x + 34, y + 40);
    g.fillTriangle(x - 23, y - 35, x - 34, y + 40, x + 34, y + 40);
    g.fillStyle(0xc88d74, 1);
    g.fillRoundedRect(x - 14, y + 34, 11, 65, 5);
    g.fillRoundedRect(x + 4, y + 34, 11, 65, 5);
    this.add.text(x, y + 116, "RIVAL", { fontSize: "10px", color: "#e9c8dc", letterSpacing: 2 }).setOrigin(0.5);
  }

  startRunway() {
    this.phase = "runway";
    this.tweens.add({
      targets: this.playerGroup, x: this.scale.width * 0.5, y: this.scale.height * 0.48,
      duration: 700, yoyo: true, repeat: 2, ease: "Sine.easeInOut",
      onUpdate: () => this.playerGroup && this.playerGroup.setAngle(Math.sin(this.time.now / 140) * 3),
      onComplete: () => {
        if (this.playerGroup) this.playerGroup.setAngle(0);
        this.events.emit("runwayFinished");
      }
    });
  }

  returnStudio() {
    this.phase = "studio";
    this.drawModel();
  }
}
import React, { useEffect, useMemo, useRef, useState } from "react";
import Phaser from "phaser";
import { FashionScene, looks } from "./game/FashionGame";
import "./App.css";

const themes = [
  { name: "Red Carpet Glam", tag: "glam", brief: "Make every camera turn toward you.", time: 60 },
  { name: "Summer Vacation", tag: "summer", brief: "Fresh colours and sunshine energy.", time: 60 },
  { name: "Royal Evening", tag: "royal", brief: "Dress like fashion royalty.", time: 60 },
  { name: "College Party", tag: "party", brief: "A fun look made to stand out.", time: 60 },
  { name: "City Chic", tag: "chic", brief: "Effortless style with attitude.", time: 60 }
];

export default function App() {
  const host = useRef(null);
  const game = useRef(null);
  const [screen, setScreen] = useState("home");
  const [theme, setTheme] = useState(themes[0]);
  const [selection, setSelection] = useState({ dress: 0, hair: 0, shoes: 0, accessory: 0 });
  const [tab, setTab] = useState("dress");
  const [coins, setCoins] = useState(() => Number(localStorage.getItem("fb-coins") || 100));
  const [unlocked, setUnlocked] = useState(() => JSON.parse(localStorage.getItem("fb-unlocked") || '{"dress":[0],"hair":[0],"shoes":[0],"accessory":[0]}'));
  const [seconds, setSeconds] = useState(60);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!host.current || game.current) return;
    game.current = new Phaser.Game({
      type: Phaser.CANVAS,
      parent: host.current,
      backgroundColor: "#24182b",
      scale: { mode: Phaser.Scale.RESIZE, width: 390, height: 700 },
      render: { antialias: true, pixelArt: false },
      scene: [FashionScene]
    });
    return () => { game.current?.destroy(true); game.current = null; };
  }, []);

  useEffect(() => {
    const scene = game.current?.scene?.getScene("FashionScene");
    if (scene?.sys?.isActive()) scene.events.emit("selection", selection);
  }, [selection]);

  useEffect(() => {
    if (screen !== "dress") return;
    setSeconds(theme.time);
    const timer = setInterval(() => setSeconds(s => {
      if (s <= 1) { clearInterval(timer); setScreen("runway"); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [screen, theme]);

  const currentItems = looks[tab];
  const score = useMemo(() => {
    const outfit = looks.dress[selection.dress];
    let value = 55;
    if (outfit.tags.includes(theme.tag)) value += 22;
    if (selection.hair !== 0) value += 4;
    if (selection.shoes !== 0) value += 5;
    if (selection.accessory !== 0) value += 5;
    return Math.min(99, value + (selection.dress * 2));
  }, [selection, theme]);

  function saveCoins(next) {
    setCoins(next);
    localStorage.setItem("fb-coins", String(next));
  }
  function chooseItem(index) {
    const item = currentItems[index];
    if (!unlocked[tab].includes(index)) {
      if (coins < item.cost) return;
      saveCoins(coins - item.cost);
      const next = { ...unlocked, [tab]: [...unlocked[tab], index] };
      setUnlocked(next);
      localStorage.setItem("fb-unlocked", JSON.stringify(next));
    }
    setSelection(s => ({ ...s, [tab]: index }));
  }
  function startChallenge() {
    setTheme(themes[Math.floor(Math.random() * themes.length)]);
    setResult(null);
    setScreen("dress");
  }
  function goRunway() {
    setScreen("runway");
    const scene = game.current?.scene?.getScene("FashionScene");
    if (scene?.sys?.isActive()) scene.events.emit("runway");
    setTimeout(() => {
      const rival = 62 + Math.floor(Math.random() * 28);
      const won = score >= rival;
      const earned = won ? 80 : 35;
      setResult({ rival, won, earned });
      saveCoins(coins + earned);
      setScreen("results");
    }, 2400);
  }

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand"><span className="brand-mark">✦</span><div>FASHION <b>BATTLE</b><small>YOUR STYLE. YOUR STAGE.</small></div></div>
      <div className="coin-pill">✦ {coins}</div>
    </header>

    <section className="game-frame">
      <div className="phaser-host" ref={host} />
      {screen === "home" && <div className="overlay home-panel">
        <div className="eyebrow">THE WORLD IS YOUR RUNWAY</div>
        <h1>Own the<br/><em>spotlight.</em></h1>
        <p>Build your look. Enter the runway. Become the style icon.</p>
        <button className="primary big" onClick={startChallenge}>PLAY FASHION BATTLE <span>→</span></button>
        <button className="ghost" onClick={() => setScreen("wardrobe")}>MY WARDROBE</button>
      </div>}
      {screen === "dress" && <div className="overlay dress-panel">
        <div className="challenge-card"><div><small>YOUR THEME</small><h2>{theme.name}</h2><p>{theme.brief}</p></div><div className="timer">{seconds}s</div></div>
        <div className="dress-controls">
          <div className="category-tabs">{Object.keys(looks).map(k => <button className={tab === k ? "active" : ""} key={k} onClick={() => setTab(k)}>{k}</button>)}</div>
          <div className="item-list">{currentItems.map((item, i) => <button key={item.name} className={`item ${selection[tab] === i ? "selected" : ""}`} onClick={() => chooseItem(i)}>
            <span className="swatch" style={{background:`#${item.color.toString(16).padStart(6,"0")}`}}></span>
            <span>{item.name}</span><small>{unlocked[tab].includes(i) ? "OWNED" : `✦ ${item.cost}`}</small>
          </button>)}</div>
          <button className="primary submit-look" onClick={goRunway}>SUBMIT MY LOOK →</button>
        </div>
      </div>}
      {screen === "wardrobe" && <div className="overlay wardrobe-panel">
        <h2>My wardrobe</h2><p>Your unlocked style collection.</p>
        <div className="wardrobe-stats">✦ {coins} coins <span>{Object.values(unlocked).reduce((a,b)=>a+b.length,0)} items unlocked</span></div>
        <button className="primary" onClick={startChallenge}>START A CHALLENGE</button>
        <button className="ghost" onClick={() => setScreen("home")}>BACK HOME</button>
      </div>}
      {screen === "runway" && <div className="overlay runway-panel"><div className="eyebrow">THE RUNWAY IS YOURS</div><h1>Make<br/><em>your entrance.</em></h1><p>Your look is being judged...</p><div className="loading-line"><i/></div></div>}
      {screen === "results" && result && <div className="overlay results-panel">
        <div className="eyebrow">FASHION BATTLE RESULTS</div><h1>{result.won ? "YOU WON!" : "GREAT LOOK!"}</h1>
        <div className="score-row"><div><small>YOUR SCORE</small><strong>{score}</strong></div><div><small>RIVAL SCORE</small><strong>{result.rival}</strong></div></div>
        <p>{result.won ? "The runway belongs to you." : "Your rival took this round. Come back stronger."}</p>
        <div className="reward">✦ +{result.earned} COINS</div>
        <button className="primary big" onClick={startChallenge}>NEXT BATTLE →</button>
        <button className="ghost" onClick={() => setScreen("home")}>HOME</button>
      </div>}
    </section>
    <footer><span>FASHION BATTLE</span><span>STYLE • COMPETE • WIN</span></footer>
  </main>;
}

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Download, Heart, Home, Search, Stamp, X } from 'lucide-react';
import './styles.css';

const halls = [
  { id: 'xu', mark: '序', title: '序厅', label: '海上纸路' },
  { id: 'one', mark: '一', title: '一厅', label: '离乡' },
  { id: 'two', mark: '二', title: '二厅', label: '托银' },
  { id: 'three', mark: '三', title: '三厅', label: '代笔' },
  { id: 'four', mark: '四', title: '四厅', label: '归批' },
  { id: 'five', mark: '五', title: '五厅', label: '百人千言' },
  { id: 'six', mark: '六', title: '六厅', label: '银信局' },
  { id: 'end', mark: '归', title: '归厅', label: '留灯' }
];

const plaques = [
  {
    id: 'one',
    title: '离乡',
    image: '/exhibits/exhibit-one.svg',
    text: '一张薄纸，从码头启程。侨批不只是家书，也是汇款、嘱托、账目与乡愁的合页。'
  },
  {
    id: 'two',
    title: '托银',
    image: '/exhibits/exhibit-two.svg',
    text: '银票随信入袋，朱印作证。远行的人把饭钱省成小小数目，寄回屋瓦、药汤与学费。'
  },
  {
    id: 'three',
    title: '代笔',
    image: '/exhibits/exhibit-three.svg',
    text: '不识字的人坐在案前，把心事说给代笔先生。先生落笔要稳，字里要有海风，也要有家门。'
  },
  {
    id: 'four',
    title: '归批',
    image: '/exhibits/exhibit-four.svg',
    text: '回批抵达时，旧信才真正完整。家中一句平安，能让异乡灯火亮过整夜。'
  }
];

const salutations = {
  阿嬤: ['阿嬤膝下敬禀', '孙儿在外日日念您'],
  阿母: ['阿母大人安好', '孩儿远行未敢忘恩'],
  贤妻: ['贤妻妆次', '海天相隔，心常在家'],
  阿弟: ['阿弟如晤', '家事劳你照看'],
  阿妹: ['阿妹见字如面', '愿你读书勤勉']
};

const fragments = {
  平安: ['到埠以来衣食尚可，惟夜深常念祖厝灯影。', '请宽心勿念，船期虽远，心路日日回乡。'],
  汇银: ['随信附银若干，先补米油药费，再留少许作孩子笔墨。', '数目不丰，都是辛苦积下，望细细记账。'],
  盼归: ['待攒足盘缠，定回乡叩见，亲听旧事。', '愿海路平稳，早有团圆之日。'],
  嘱托: ['家中屋瓦若漏，请先修补，莫让老人夜雨难眠。', '邻里之间以和为贵，凡事慢言慢行。']
};

function useLetters() {
  const [letters, setLetters] = useState([]);
  useEffect(() => {
    fetch('/data/letters.json').then((res) => res.json()).then(setLetters);
  }, []);
  return letters;
}

function useFavorites() {
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('qiaopi-favorites') || '[]'));
  const toggle = (id) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('qiaopi-favorites', JSON.stringify(next));
      return next;
    });
  };
  return { favorites, toggle };
}

function MuseumNav() {
  return (
    <aside className="museum-nav" aria-label="展厅导航">
      <Link className="home-mark" to="/" aria-label="回到序厅"><Home size={18} /></Link>
      <nav>
        {halls.map((hall) => (
          <a href={`/#${hall.id}`} key={hall.id} className="nav-seal">
            <span>{hall.mark}</span>
            <small>{hall.label}</small>
          </a>
        ))}
      </nav>
    </aside>
  );
}

function FloorPlan() {
  return (
    <div className="floor-plan" aria-label="平面图">
      <svg viewBox="0 0 360 190" role="img">
        <path d="M22 28h316v134H22z" />
        <path d="M101 28v134M180 28v134M259 28v134M22 95h316" />
        {halls.map((hall, index) => {
          const col = index % 4;
          const row = Math.floor(index / 4);
          return (
            <a href={`/#${hall.id}`} key={hall.id}>
              <rect x={34 + col * 79} y={43 + row * 67} width="55" height="38" rx="0" />
              <text x={62 + col * 79} y={68 + row * 67}>{hall.mark}</text>
            </a>
          );
        })}
      </svg>
    </div>
  );
}

function Hero() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % 2), 5600);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section id="xu" className="hero hall-section">
      <AnimatePresence mode="wait">
        <motion.video
          key={active}
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
          src={active === 0 ? '/videos/ink-tide-one.mp4' : '/videos/ink-tide-two.mp4'}
        />
      </AnimatePresence>
      <div className="ink-wash" />
      <motion.div className="hero-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p>二〇二六电影致敬展</p>
        <h1>给阿嬤的情书</h1>
        <strong>侨批主题虚拟博物馆</strong>
      </motion.div>
      <FloorPlan />
    </section>
  );
}

function PlaqueHall({ item, index }) {
  return (
    <section id={item.id} className="hall-section plaque-hall">
      <motion.figure initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.7 }}>
        <img src={item.image} alt={`${item.title}展厅主图`} />
        <figcaption>
          <span>第{['一', '二', '三', '四'][index]}厅</span>
          <h2>{item.title}</h2>
          <p>{item.text}</p>
        </figcaption>
      </motion.figure>
    </section>
  );
}

function LetterWall({ letters, favorites, toggleFavorite }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('全部');
  const [onlyFav, setOnlyFav] = useState(false);
  const tags = ['全部', ...Array.from(new Set(letters.map((letter) => letter.tag)))];
  const shown = letters.filter((letter) => {
    const matchQuery = [letter.sender, letter.origin, letter.destination, letter.body].join('').includes(query);
    const matchTag = tag === '全部' || letter.tag === tag;
    const matchFav = !onlyFav || favorites.includes(letter.id);
    return matchQuery && matchTag && matchFav;
  });
  return (
    <section id="five" className="hall-section letter-hall">
      <header className="section-title">
        <span>第五厅</span>
        <h2>百人千言</h2>
      </header>
      <div className="wall-tools">
        <label className="search-box">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜姓名、乡里、信句" />
        </label>
        <div className="tag-row">
          {tags.map((item) => (
            <button className={tag === item ? 'is-active' : ''} key={item} onClick={() => setTag(item)}>{item}</button>
          ))}
          <button className={onlyFav ? 'is-active' : ''} onClick={() => setOnlyFav((value) => !value)}>
            <Heart size={15} /> 收藏
          </button>
        </div>
      </div>
      <div className="letter-grid">
        {shown.map((letter) => (
          <motion.article layout className="letter-card" key={letter.id}>
            <button className="heart-button" onClick={() => toggleFavorite(letter.id)} aria-label="收藏">
              <Heart size={17} fill={favorites.includes(letter.id) ? 'currentColor' : 'none'} />
            </button>
            <Link to={`/letters/${letter.id}`}>
              <img src={letter.portrait} alt={`${letter.sender}剪影`} />
              <h3>{letter.sender}</h3>
              <p>{letter.year}　{letter.origin}寄{letter.destination}</p>
              <blockquote>{letter.body.slice(0, 44)}……</blockquote>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Composer() {
  const [to, setTo] = useState('阿嬤');
  const [intent, setIntent] = useState('平安');
  const [money, setMoney] = useState('三十');
  const [sender, setSender] = useState('远行人');
  const paperRef = useRef(null);
  const body = `${salutations[to][0]}：${salutations[to][1]}。${fragments[intent][0]}${intent === '汇银' ? `此番托带银元${money}，` : ''}${fragments.嘱托[0]}${fragments.盼归[1]}谨具此批，伏惟珍重。`;
  const download = async () => {
    if (!paperRef.current) return;
    const canvas = await html2canvas(paperRef.current, { backgroundColor: '#f8f3e8', scale: 2 });
    const link = document.createElement('a');
    link.download = '侨批信纸.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  return (
    <section id="six" className="hall-section composer-hall">
      <header className="section-title">
        <span>第六厅</span>
        <h2>银信局</h2>
      </header>
      <div className="composer-layout">
        <form className="composer-panel">
          <label>称谓<select value={to} onChange={(event) => setTo(event.target.value)}>{Object.keys(salutations).map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>心意<select value={intent} onChange={(event) => setIntent(event.target.value)}>{Object.keys(fragments).filter((item) => item !== '嘱托').map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>银数<input value={money} onChange={(event) => setMoney(event.target.value)} /></label>
          <label>落款<input value={sender} onChange={(event) => setSender(event.target.value)} /></label>
          <button type="button" onClick={download}><Download size={17} /> 下载信纸</button>
        </form>
        <div className="paper-stage">
          <article ref={paperRef} className="letter-paper">
            <div className="envelope"><Stamp size={28} /><strong>僑批</strong></div>
            <p>{body}</p>
            <footer>{sender}　敬上<br />二〇二六年夏</footer>
          </article>
        </div>
      </div>
    </section>
  );
}

function EndHall() {
  return (
    <section id="end" className="hall-section end-hall">
      <p>海水很远，纸很轻。灯留给归人，字留给后来者。</p>
    </section>
  );
}

function HomePage() {
  const letters = useLetters();
  const { favorites, toggle } = useFavorites();
  return (
    <>
      <MuseumNav />
      <main>
        <Hero />
        {plaques.map((item, index) => <PlaqueHall item={item} index={index} key={item.id} />)}
        <LetterWall letters={letters} favorites={favorites} toggleFavorite={toggle} />
        <Composer />
        <EndHall />
      </main>
    </>
  );
}

function LetterDetail() {
  const { id } = useParams();
  const letters = useLetters();
  const { favorites, toggle } = useFavorites();
  const letter = useMemo(() => letters.find((item) => item.id === id), [letters, id]);
  if (!letter) {
    return <div className="detail-shell"><Link to="/">回展厅</Link><p>信件正在展开。</p></div>;
  }
  return (
    <main className="detail-shell">
      <Link className="back-link" to="/"><X size={16} /> 回展厅</Link>
      <motion.article className="detail-letter" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <img src={letter.portrait} alt={`${letter.sender}剪影`} />
        <div>
          <span>{letter.year}　{letter.origin}寄{letter.destination}</span>
          <h1>{letter.sender}</h1>
          <p>{letter.body}</p>
          <button onClick={() => toggle(letter.id)}><Heart size={17} fill={favorites.includes(letter.id) ? 'currentColor' : 'none'} /> {favorites.includes(letter.id) ? '已收藏' : '收入收藏'}</button>
        </div>
      </motion.article>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/letters/:id" element={<LetterDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

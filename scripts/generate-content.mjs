import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const dataDir = path.join(publicDir, 'data');
const portraitDir = path.join(publicDir, 'portraits');
const exhibitDir = path.join(publicDir, 'exhibits');
const videoDir = path.join(publicDir, 'videos');

for (const dir of [dataDir, portraitDir, exhibitDir, videoDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const surnames = ['陈', '林', '黄', '张', '李', '王', '吴', '刘', '郑', '蔡', '许', '苏', '谢', '方', '周', '庄', '曾', '郭', '高', '廖'];
const names = ['明远', '秋娘', '瑞生', '桂枝', '文潮', '玉兰', '水根', '素琴', '成海', '月娥', '德安', '阿珠', '长庚', '春杏', '启泰', '梅英', '望舒', '仁贵', '佩云', '家添'];
const places = ['汕头', '潮州', '梅县', '厦门', '泉州', '漳州', '琼州', '南洋', '暹罗', '星洲'];
const relations = ['阿嬤', '阿母', '贤妻', '阿弟', '阿妹', '大伯', '阿叔', '小侄', '家中诸亲', '祖厝诸位'];
const years = ['一九二六', '一九三一', '一九三七', '一九四二', '一九四九', '一九五五', '一九六二', '一九七八'];
const tags = ['报平安', '寄银票', '念亲恩', '盼团圆', '托家事', '问寒暖'];
const openings = [
  '别后海风日紧，夜里听船笛，便想起家门口那盏油灯。',
  '到埠已数月，铺中事务渐顺，惟心中常挂念故乡。',
  '银信托熟人带回，数目虽薄，都是一点汗水换来。',
  '昨梦回祖厝，见井边榕影仍在，醒来衣襟微湿。',
  '此地雨季漫长，街头乡音难得，听见一句便觉亲切。'
];
const middles = [
  '望代我添修屋瓦，莫使老人夜雨难眠。',
  '孩子读书若缺笔墨，可先向族叔借支，日后我再补上。',
  '家中田租请细细记账，勿与邻里争气伤和。',
  '若有船期可靠，烦回一纸，让我知道诸亲康健。',
  '年节祭祖请替我上香三炷，说游子未敢忘本。'
];
const endings = [
  '此信字字皆心，愿海路平稳，早抵你手。',
  '待攒足盘缠，定回乡叩见，再听你说旧日故事。',
  '勿念我衣食，惟请保重身子，日日安宁。',
  '纸短情长，余话寄在朱印之下，盼团圆日近。',
  '谨此奉上，愿家门兴旺，老幼平安。'
];

const letters = Array.from({ length: 100 }, (_, index) => {
  const i = index + 1;
  const name = surnames[index % surnames.length] + names[(index * 7) % names.length];
  const origin = places[(index * 3) % places.length];
  const destination = places[(index * 5 + 2) % places.length];
  const relation = relations[(index * 2) % relations.length];
  const year = years[index % years.length];
  const tag = tags[index % tags.length];
  const body = `${relation}膝下敬禀：${openings[index % openings.length]}${middles[(index * 2) % middles.length]}${endings[(index * 3) % endings.length]}`;
  return {
    id: String(i).padStart(3, '0'),
    sender: name,
    relation,
    year,
    origin,
    destination,
    tag,
    portrait: `/portraits/portrait-${String(i).padStart(3, '0')}.svg`,
    body
  };
});

fs.writeFileSync(path.join(dataDir, 'letters.json'), JSON.stringify(letters, null, 2));

for (const letter of letters) {
  const n = Number(letter.id);
  const head = 26 + (n % 7);
  const shoulders = 58 + (n % 10);
  const hair = n % 3 === 0 ? 'M44 48c-10-13 4-28 18-25 16 4 22 18 11 31-8-8-22-6-29-6z' : 'M42 43c1-17 29-23 40 0 4 11-3 17-11 19-10 2-24-5-29-19z';
  const accessory = n % 4 === 0 ? '<path d="M39 70c12 7 35 7 46 0" />' : '<path d="M51 58c4 3 13 3 17 0" />';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" role="img" aria-label="${letter.sender}剪影">
  <rect width="120" height="140" fill="#f8f3e8"/>
  <g fill="#a51f18" stroke="#a51f18" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="${hair}"/>
    <circle cx="60" cy="53" r="${head}"/>
    <path d="M${60 - shoulders / 2} 132c4-33 16-49 34-49s31 16 35 49z"/>
    ${accessory}
  </g>
</svg>`;
  fs.writeFileSync(path.join(portraitDir, `portrait-${letter.id}.svg`), svg);
}

const tinyMp4 = Buffer.from(
  'AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAMUbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAA+gAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAlh0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAA+gAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAEAAAABAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAPoAAAAAAABAAAAAAABxG1kaWEAAAAgbWRoZAAAAAAAAAAAAAAAAAAAGQAAAGQAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAW9taW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEvc3RibAAAALBzdHNkAAAAAAAAAAEAAACgYXZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAEAAAEASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAADJhdmNDAWQACv/hABdnZAALrhA8IISAAAMACAAAAwZB4kQAAAEABGjuPIAtyAABAEAAAAAYc3R0cwAAAAAAAAABAAAAGQAAAGQAAAAUc3RzcwAAAAAAAAABAAAAAQAAABRzdHNjAAAAAAAAAAEAAAABAAAAGQAAAAEAAAAUc3RzegAAAAAAAAATAAAAABkAAAAUc3RjbwAAAAAAAAABAAADJAAAABhtZGF0AAAAAQYF//8A+7/4AAAA',
  'base64'
);
fs.writeFileSync(path.join(videoDir, 'ink-tide-one.mp4'), tinyMp4);
fs.writeFileSync(path.join(videoDir, 'ink-tide-two.mp4'), tinyMp4);

const exhibitScenes = [
  ['exhibit-one.svg', '离乡', 'M40 280c85-70 153-70 235 0s150 70 235 0', 'M92 212h110l38 42H72zM338 212h86l30 42H320z'],
  ['exhibit-two.svg', '托银', 'M84 96h392v218H84zM116 134h328M116 174h328M116 214h228', 'M178 286c38-45 86-45 124 0M312 286c38-45 86-45 124 0'],
  ['exhibit-three.svg', '代笔', 'M98 270h360M150 118h190v132H150zM354 126l88 84', 'M200 168c34 18 68 18 102 0M207 208h80'],
  ['exhibit-four.svg', '归批', 'M74 244c96-106 236-106 332 0M138 244V126h204v118', 'M190 164h98M190 198h122M190 232h74']
];

for (const [file, title, primary, secondary] of exhibitScenes) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360" role="img" aria-label="${title}展陈图">
  <rect width="560" height="360" fill="#f8f3e8"/>
  <path d="M0 318c120-50 238-50 354 0s164 50 206 0v42H0z" fill="#a51f18" opacity=".12"/>
  <g fill="none" stroke="#a51f18" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
    <path d="${primary}"/>
    <path d="${secondary}"/>
  </g>
  <text x="474" y="76" writing-mode="tb" fill="#a51f18" font-size="42" font-family="serif">${title}</text>
</svg>`;
  fs.writeFileSync(path.join(exhibitDir, file), svg);
}

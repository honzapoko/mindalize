import React, { useState, useEffect } from 'react';
import '../styles/TarotReading.css';
import Image from 'next/image';

const cardMeanings = {
  'The Fool': {
    description: 'Začátek nové cesty, spontánnost, důvěra. Tato karta vás vybízí k odvaze a otevřenosti vůči novým zkušenostem. Nebojte se vykročit do neznáma s důvěrou v život. Může to být čas pro nové projekty nebo osobní růst. Udržujte si víru, i když neznáte výsledek. Přináší čerstvý vítr do vašeho života. Otevírá prostor pro změny. Přijímejte věci s radostí. Dovolte si chybovat. Mějte odvahu být autentickým. Dítě uvnitř vás žádá o pozornost. Vaše cesta teprve začíná. Nehledejte dokonalost. Důležité je začít. Důvěřujte své intuici. Vnímejte přítomný okamžik jako dar. Každý krok vás posiluje.',
    imageUrl: '/cards/the-fool.jpg',
  },
  'The Magician': {
    description: 'Manifestace, síla vůle, schopnosti. Máte všechny nástroje k tomu, abyste uskutečnili své plány. Využijte své dovednosti a energii cílevědomě. Je čas proměnit myšlenky ve skutečnost. Důvěřujte svým schopnostem a jednejte. Magie je ve vás. Vědomě tvořte svou realitu. Využijte své komunikační schopnosti. Zaměřte se na to, co chcete tvořit. Dejte pozornost záměru. Jste prostředníkem mezi nebem a zemí. Vaše vize jsou důležité. Mluvte a jednejte v souladu. Vaše slova mají sílu. Každý čin se počítá. Buďte aktivní a tvořiví. Vědomé rozhodnutí je klíč.',
    imageUrl: '/cards/the-magician.jpg',
  },
  'The High Priestess': {
    description: 'Intuice, vnitřní moudrost, ticho. Tato karta vás vede do hlubin nevědomí. Naslouchejte vnitřnímu hlasu, i když není slyšet. Je čas zpomalit a ztišit mysl. Odpovědi máte uvnitř. Nepotřebujete vše vědět hned. Umožněte si nevědomí prozkoumat. Respektujte tajemství života. Důvěřujte synchronizacím a náhodám. Nesnažte se vše ovládat. Vnitřní vědění je silnější než logika. Sledujte znamení a symboly. Učte se mlčet. Ticho odhaluje pravdu. Je čas na reflexi. Pozorujte své sny. Otevřete se duchovnímu vedení.',
    imageUrl: '/cards/the-high-priestess.jpg',
  },
  'The Empress': {
    description: 'Plodnost, tvořivost, péče. Tato karta vyjadřuje spojení s přírodou a cykly. Podporuje výživu ve všech formách – fyzickou i emocionální. Oslavujte krásu života a hojnost kolem sebe. Dejte prostor své kreativitě. Věnujte čas sebelásce. Važte si těla a jeho moudrosti. Dovolte si tvořit bez tlaku. Věnujte se tomu, co roste. Péče o druhé je důležitá, ale i péče o sebe. Přijímejte a dávejte s otevřeným srdcem. Plodnost se nemusí týkat jen dětí – ale i projektů a nápadů. Přirozenost je klíč. Nechte věci dozrát. Podpořte svůj domov. Uzemněte se v přítomném těle.',
    imageUrl: '/cards/the-empress.jpg',
  },
  'The Emperor': {
    description: 'Stabilita, struktura, autorita. Tato karta symbolizuje bezpečné hranice. Je čas jednat s rozhodností a jasností. Ukažte zodpovědnost a sílu. Vytvářejte řád v chaosu. Postavte se za své hodnoty. Není třeba dominovat, ale vést s integritou. Vyjasněte si cíle a kroky. Věnujte pozornost pravidlům. Podpořte ostatní svým příkladem. Budujte pevné základy. Důvěřujte své moudrosti. Mějte vizi pro budoucnost. Udržujte rovnováhu mezi rozumem a citem. Být silný znamená být i laskavý. Zajistěte stabilitu tam, kde chybí. Udržujte kontrolu s respektem.',
    imageUrl: '/cards/the-emperor.jpg',
  },
  'The Hierophant': {
    description: 'Tradice, víra, duchovní vedení. Je čas se obrátit k vyššímu poznání. Naslouchejte moudrosti předků a učitelů. Hledejte smysl a hodnoty. Oslavujte to, co přesahuje vaši osobnost. Učte se z tradic, ale nenechte se jimi svazovat. Vědomé studium je cestou k osvobození. Najděte komunitu, která vás podporuje. Buďte otevření duchovním strukturám. Sdílejte svou víru s pokorou. Každý má právo hledat svou pravdu. Zkoumejte své přesvědčení. Posvátné rituály mohou být oporou. Udržujte si respekt ke starším. Učení je proces. Nalaďte se na vyšší smysl svého života.',
    imageUrl: '/cards/the-hierophant.jpg',
  },
  'The Lovers': {
    description: 'Volba, vztah, spojení. Tato karta vás zve k prohloubení vztahů. Volíte srdcem nebo rozumem? Je čas sladit vnitřní hodnoty s tím, co prožíváte navenek. Partnerství je zrcadlem vaší duše. Láska vyžaduje důvěru a upřímnost. Každý vztah vás něco učí. Jste připraveni otevřít se zranitelnosti? Vaše rozhodnutí dnes utvářejí budoucnost. Láska může být léčivá i náročná. Důležitá je rovnováha mezi dáváním a přijímáním. Přijměte své touhy bez studu. Komunikace je klíčem. Mějte odvahu být pravdiví. Hledejte spojení na hlubší úrovni. Buďte otevření růstu ve dvou.',
    imageUrl: '/cards/the-lovers.jpg',
  },
  'The Chariot': {
    description: 'Vůle, směr, odhodlání. Tato karta vás nabádá, abyste převzali kontrolu nad svým směrem. Jste pánem svého osudu. Nebojte se postavit výzvám. Soustřeďte se na cíl a buďte vytrvalí. Může jít o fyzickou i duchovní cestu. Využijte svou vnitřní sílu k překonání překážek. Vyvažujte protikladné síly v sobě. Vítězství je možné díky disciplíně. Vůle je vaším kompasem. Udržujte rovnováhu mezi emocemi a logikou. Mějte jasné záměry. Pohybujte se s důvěrou. Každý krok má smysl. Buďte v souladu se svou vizí. Nepolevujte – jste blízko cíli.',
    imageUrl: '/cards/the-chariot.jpg',
  },
  'Strength': {
    description: 'Vnitřní síla, odvaha, trpělivost. Nejde o fyzickou moc, ale o klidnou vytrvalost. Ovládněte svou vášeň jemností. Krotíte vnitřní zvíře láskou, nikoliv silou. Sebekontrola a soucit jdou ruku v ruce. Překážky lze překonat klidem. Tato karta je symbolem vnitřní rovnováhy. Důvěřujte své schopnosti zvládat výzvy. Odvaha neznamená necítit strach. Jde o rozhodnutí jednat přes něj. Vyzařujte vnitřní klid. Oslavujte svou odolnost. Laskavost je projevem síly. Otevřete srdce i v bouři. Vaše vnitřní světlo vede ostatní.',
    imageUrl: '/cards/strength.jpg',
  },
  'The Hermit': {
    description: 'Samota, moudrost, introspekce. Otočte se do nitra a hledejte odpovědi uvnitř. Potřebujete čas na zklidnění. Světlo uvnitř vás je vaším průvodcem. Vnější hluk ustupuje tichu poznání. Nechte minulost za sebou. Vědomá samota je léčivá. Vnitřní práce má hluboký smysl. Odpovědi nejsou ve světě, ale ve vás. Objevujte svou pravdu beze strachu. Moudrost roste v tichu. Vydejte se na osobní pouť. Dejte prostor duchovnímu zrání. Zpomalení je klíčové. V jednoduchosti najdete jasnost.',
    imageUrl: '/cards/the-hermit.jpg',
  },
  'Wheel of Fortune': {
    description: 'Osud, cykly, změna. Život je v neustálém pohybu. Přijměte, co přichází, s důvěrou. Náhody mají hlubší smysl. Nic netrvá věčně – ani štěstí, ani bolest. Naučte se surfovat na vlnách života. Karma se vrací. Každá změna otevírá nové možnosti. Přestaňte bojovat s proudem. Pusťte kontrolu a důvěřujte toku. Překvapení vás posunou dál. Buďte připraveni přizpůsobit se. Všechno má svůj čas. Využijte příležitosti. Kolo se obrací – držte se středu. Co se děje teď, má důvod.',
    imageUrl: '/cards/wheel-of-fortune.jpg',
  },
  'Justice': {
    description: 'Rovnováha, pravda, důsledky. Činy mají následky. Je čas být upřímní – i k sobě. Rozhodujte spravedlivě a s rozvahou. Právo a etika jsou ve hře. Vnímejte, co je fér. Karta vás vybízí k objektivitě. Hledejte pravdu bez zkreslení. Přijměte odpovědnost. Vyvažujte rozum a cit. Dejte věcem strukturu a řád. Konflikty se řeší otevřeností. Lži budou odhaleny. Zvažujte všechna fakta. Vědomé volby tvoří budoucnost. Důvěřujte rovnováze života.',
    imageUrl: '/cards/justice.jpg',
  },
  'The Hanged Man': {
    description: 'Odevzdání, nový úhel pohledu, pauza. Není třeba jednat – je třeba vnímat. Ustupte, abyste uviděli víc. Otočte své myšlení naruby. Pusťte potřebu kontroly. Přichází hluboká transformace. Důležité je uvolnění, ne boj. Někdy je třeba nechat věci plynout. Klíčem je změna perspektivy. Přijměte nepohodlí jako růst. Vaše oběť má smysl. Čas nečinnosti je požehnáním. Klid může být největší silou. Staré způsoby již neslouží. Dejte prostor novému pohledu. Čekání není ztracený čas.',
    imageUrl: '/cards/the-hanged-man.jpg',
  },
  'Death': {
    description: 'Transformace, konec, nový začátek. Staré musí odejít, aby nové mohlo přijít. Není čeho se bát – smrt je přirozenou součástí. Symbolizuje přechod, ne konec. Odevzdejte minulost. Uzavřete cyklus, který už neslouží. Změna může být bolestivá, ale nezbytná. Uvolněte se do neznáma. Objevujete nový potenciál. Nechte jít to, co vás brzdí. Odpadá to, co není pravdivé. Každý konec je začátek. Očista je v procesu. Přijměte, co končí s důvěrou. Život se obnovuje. Z popela povstáváte silnější.',
    imageUrl: '/cards/death.jpg',
  },
  'Temperance': {
    description: 'Rovnováha, harmonie, trpělivost. Spojujete protiklady v jednotu. Vytváříte klid uprostřed chaosu. Nepospíchejte – vše má svůj čas. Udržujte rovnováhu mezi duchem a tělem. Mír není slabost. Smíření je cestou vpřed. Přizpůsobujte se s lehkostí. Hledejte střed v každé situaci. Trpělivost přináší ovoce. Zachovejte mír uvnitř. Vnímejte, co je v souladu. Naslouchejte intuici i logice. Nepřehánějte – buďte uměním středu. Proud života vás vede. Spojte, nerozdělujte.',
    imageUrl: '/cards/temperance.jpg',
  },
  'The Devil': {
    description: 'Připoutanost, iluze, stín. Co vás drží v poutech? Závislosti, strachy, manipulace. Nastal čas podívat se do stínu. Iluze moci a kontroly vás svazují. Poznejte svou temnou stránku. Není třeba se jí bát. Osvobození začíná přijetím. Nechte jít to, co vás ovládá. Zlo není vně – je nepochopený vnitřní hlas. Svoboda začíná uvědoměním. Karta vás konfrontuje. Láska k sobě je lékem. Přestaňte obviňovat okolí. Převzít zodpovědnost je cesta k osvobození. Temnota ukazuje cestu ke světlu.',
    imageUrl: '/cards/the-devil.jpg',
  },
  'The Tower': {
    description: 'Otřes, zhroucení, probuzení. Co bylo postaveno na iluzích, se hroutí. Přichází nečekaná změna. Může to bolet – ale je to očištění. Staré struktury se rozpadají. Váš život se mění od základů. Přijměte pád jako nutný krok. Otevírá se nový prostor. Osvoboďte se od falešné jistoty. Zkáza je zároveň nový začátek. Učíte se důvěřovat znovu. Náhlé události nesou moudrost. Chaos vede k pravdě. Nepanikařte – dýchejte. Změna je příležitostí k růstu. Svět se znovu skládá pravdivěji.',
    imageUrl: '/cards/the-tower.jpg',
  },
  'The Star': {
    description: 'Naděje, inspirace, uzdravení. Po bouři přichází klid. Světlo na konci tunelu. Důvěřujte procesu. Jste vedeni jemnou silou. Obnovuje se vaše víra. Přichází vnitřní klid. Láska a světlo proudí do vašeho života. Mějte odvahu snít. Neztrácejte naději. Tato karta je poslem naděje. Léčivé energie proudí. Obnova přichází skrze přijetí. Spojte se s univerzální energií. Hvězdy vám přejí. Jste na správné cestě.',
    imageUrl: '/cards/the-star.jpg',
  },
  'The Moon': {
    description: 'Iluze, sny, podvědomí. Věci nejsou takové, jaké se zdají. Nevěřte všemu, co vidíte. Naslouchejte intuici. Přichází mlhavé období. Nechte se vést vnitřním hlasem. Iluze vás mohou zmást. Obavy mohou zatemnit cestu. Zkoumejte své sny. V temnotě se rodí vhled. Pozor na klam a sebeklam. Tato karta vás vede k vnitřní pravdě. Chaos není nebezpečný – jen neznámý. Nechte se vést pocity. Je čas na hlubší introspekci. Poznejte stín a integrujte ho.',
    imageUrl: '/cards/the-moon.jpg',
  },
  'The Sun': {
    description: 'Radost, vitalita, jasnost. Tato karta září optimismem. Vaše energie roste. Období radosti a úspěchu. Sdílejte své světlo. Všechno je na svém místě. Dejte prostor hravosti. Vaše vnitřní dítě chce tančit. Jasnost přináší uvolnění. Překážky se rozplývají. Důvěřujte životu. Užívejte si přítomnost. Zářit není hřích. Vaše pravda je krásná. Láska je všude kolem vás.',
    imageUrl: '/cards/the-sun.jpg',
  },
  'Judgement': {
    description: 'Probuzení, volání, obnova. Je čas odpovědět na hluboké volání. Vstaňte z popela. Staré části vás odcházejí. Dochází k vnitřnímu soudnému dni. Odpuštění je klíč. Přijměte odpovědnost a jděte dál. Nová kapitola začíná. Oživujete svou pravdu. Vědomé rozhodnutí mění vše. Je čas říct „ano“ sobě. Obraťte se k vnitřnímu světlu. Karta vás vyzývá ke změně. Poslouchejte duši, ne ego. Vše se čistí. Přichází nový život.',
    imageUrl: '/cards/judgement.jpg',
  },
  'The World': {
    description: 'Dokončení, jednota, úspěch. Cesta dospěla ke konci. Učíte se oslavit celý cyklus. Tato karta znamená naplnění. Jste v souladu se sebou. Všechno do sebe zapadá. Přijměte úspěch s vděčností. Otevřete se světu. Cítíte propojení s celkem. Jste součástí většího příběhu. Uzavíráte jednu etapu a začínáte další. Radost z celistvosti je tu. Důvěřujte svému místu ve vesmíru. Oslavte, co jste zvládli. Jste kompletní tak, jak jste. Kruh se uzavřel.',
    imageUrl: '/cards/the-world.jpg',
  },
};

const ZODIAC_SIGNS = [
  { name: 'Aries', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', start: [6, 21], end: [7, 22] },
  { name: 'Leo', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', start: [8, 23], end: [9, 22] },
  { name: 'Libra', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', start: [11, 22], end: [12, 21] },
  { name: 'Capricorn', start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', start: [2, 19], end: [3, 20] },
];

function getZodiacSign(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  for (const sign of ZODIAC_SIGNS) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      (startMonth > endMonth &&
        ((month === startMonth && day >= startDay) ||
          (month === endMonth && day <= endDay)))
    ) {
      return sign.name;
    }
  }
  return '';
}

function getLifePathNumber(dateStr: string) {
  if (!dateStr) return '';
  const digits = dateStr.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum
      .toString()
      .split('')
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return sum.toString();
}

function getRandomCardKeys(count: number) {
  const keys = Object.keys(cardMeanings);
  const selected: string[] = [];
  const available = [...keys];
  for (let i = 0; i < count; i++) {
    if (available.length === 0) break;
    const idx = Math.floor(Math.random() * available.length);
    selected.push(available[idx]);
    available.splice(idx, 1);
  }
  return selected;
}

type TarotHistoryItem = {
  name: string;
  birthdate: string;
  question: string;
  zodiac: string;
  lifePath: string;
  cards: string[];
  date: string;
};

const TarotReading: React.FC = () => {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [goals, setGoals] = useState('');
  const [occupation, setOccupation] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [question, setQuestion] = useState('');
//  const [numCards, setNumCards] = useState(3);
  const [cards, setCards] = useState<string[]>([]);
  const [zodiac, setZodiac] = useState('');
  const [lifePath, setLifePath] = useState('');
  const [spreadType, setSpreadType] = useState('1');
  const [history, setHistory] = useState<TarotHistoryItem[]>([]);
  const [confirmation, setConfirmation] = useState('');
  const [chatbotAnswer, setChatbotAnswer] = useState('');
  const [isLoadingChatbot, setIsLoadingChatbot] = useState(false);
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  const stored = localStorage.getItem('tarotHistory');
  if (stored) {
    setHistory(JSON.parse(stored));
  }
  setMounted(true); // <-- add this line
}, []);

  useEffect(() => {
    setZodiac(getZodiacSign(birthdate));
    setLifePath(getLifePathNumber(birthdate));
  }, [birthdate]);

const handleDraw = async (e: React.FormEvent) => {
  e.preventDefault();
  setConfirmation('');
  setChatbotAnswer('');
  setIsLoadingChatbot(true);

  let numCardsToDraw = 1;
  if (spreadType === '3') numCardsToDraw = 3;
  else if (spreadType === '5') numCardsToDraw = 5;
  else if (spreadType === 'celtic') numCardsToDraw = 10;
  else if (spreadType === 'partnersky') numCardsToDraw = 7;

  const drawn = getRandomCardKeys(numCardsToDraw);
  setCards(drawn);

  try {
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name,
        birthdate,
        zodiac,
        lifePath,
        question,
        cards: drawn,
        spreadType,
        city,
        goals,
        occupation,
      }),
    });
    const data = await res.json();
    setIsLoadingChatbot(false);

    if (data.error) {
      setChatbotAnswer(data.error);
      return;
    }

    setChatbotAnswer(data.aiAnswer || 'Odpověď není dostupná.');
    setConfirmation(data.confirmationMessage || 'Potvrzovací e-mail byl odeslán! Prosím potvrďte svou adresu.');

    // --- MOVE THIS BLOCK HERE ---
    const newHistoryItem = {
      name,
      birthdate,
      question,
      zodiac,
      lifePath,
      cards: drawn,
      date: new Date().toISOString(),
    };
    const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('tarotHistory', JSON.stringify(updatedHistory));
    // --- END BLOCK ---

} catch {
  setIsLoadingChatbot(false);
  setChatbotAnswer('Chyba při získávání odpovědi od AI.');
}
};

const handleBuyPremium = async () => {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  window.location.href = data.url;
};

  return (
    <div className="tarot-container">
      <h1 className="tarot-title">
        <span role="img" aria-label="crystal ball">🔮</span> Esoterický výklad karet
      </h1>
      <form onSubmit={handleDraw}>
        <div className="tarot-section">
          <label className="tarot-label">
            <span role="img" aria-label="email">📧</span> E-mail
          </label>
          <input
            className="tarot-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
           className="tarot-input"
           type="text"
           value={city}
           onChange={e => setCity(e.target.value)}
           placeholder="Město narození"
          />
          <input
          className="tarot-input"
          type="text"
          value={occupation}
          onChange={e => setOccupation(e.target.value)}
          placeholder="Povolání (volitelné)"
          />
          <input
          className="tarot-input"
          type="text"
          value={goals}
          onChange={e => setGoals(e.target.value)}
          placeholder="Osobní cíle"
          />
        </div>
        <div className="tarot-section">
          <label className="tarot-label">
            <span role="img" aria-label="person">👤</span> Jméno
          </label>
          <input
            className="tarot-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="tarot-section">
          <label className="tarot-label">
            <span role="img" aria-label="calendar">📅</span> Datum narození
          </label>
          <input
            className="tarot-input"
            type="date"
            value={birthdate}
            onChange={e => setBirthdate(e.target.value)}
            required
          />
        </div>
        <div className="tarot-section">
          <label className="tarot-label">
            <span role="img" aria-label="cloud">☁️</span> Tvoje otázka
          </label>
          <input
            className="tarot-input"
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            required
          />
        </div>
        <div className="tarot-section">
          <label className="tarot-label">
  Typ výkladu:
  <select
    value={spreadType}
    onChange={e => setSpreadType(e.target.value)}
    required
  >
    <option value="1">1 karta (Rada)</option>
    <option value="3">3 karty (Minulost/Přítomnost/Budoucnost)</option>
    <option value="5">5 karet (Vývoj situace)</option>
    <option value="celtic">Keltský kříž (PREMIUM)</option>
    <option value="partnersky">Partnerský výklad (PREMIUM)</option>
  </select>
</label>
    </div>
      
        <button className="tarot-button" type="submit">
          Vyložit karty
        </button>
      </form>

    {/* ADD THE PREMIUM BUTTON HERE */}
    <button
      className="tarot-button tarot-premium"
      type="button"
      onClick={handleBuyPremium}
      disabled={!email}
      style={{ marginTop: 24 }}
    >
      Koupit prémiový přístup
    </button>

{confirmation && (
  <div className="tarot-confirmation">
    {confirmation}
  </div>
)}
      {cards.length > 0 && (
        <>
          <div className="tarot-summary">
            <div><strong>Jméno:</strong> {name}</div>
            <div><strong>Datum narození:</strong> {birthdate}</div>
            <div><strong>Znamení:</strong> {zodiac}</div>
            <div><strong>Životní číslo:</strong> {lifePath}</div>
            <div><strong>Otázka:</strong> {question}</div>
          </div>
          <div className="tarot-results">
            {cards.map((cardName, idx) => (
              <div className="tarot-card" key={idx}>
                <Image
                  className="tarot-image"
                  src={cardMeanings[cardName as keyof typeof cardMeanings].imageUrl}
                  alt={cardName}
                  width={300} // set your desired width
                  height={450} // set your desired height, or the correct aspect ratio
                  style={{ width: '100%', height: 'auto' }} // maintain aspect ratio if resizing
                  loading="lazy"
                />
                <div>
                  <strong>{cardName}</strong>
                </div>
                <div className="tarot-insight">{cardMeanings[cardName as keyof typeof cardMeanings].description}</div>
              </div>
            ))}
          </div>
               </>
      )}
      
{chatbotAnswer && (
  <div className="tarot-chatbot-answer" style={{ marginTop: 16, background: '#312e81', color: '#fff', padding: 16, borderRadius: 8 }}>
    {chatbotAnswer}
  </div>
)}
{mounted && (
  <div className="tarot-history">
    <h2>Historie výkladů</h2>
    {history.length === 0 && <div>Žádné výklady zatím nejsou.</div>}
    {history.map((item, idx) => (
      <div className="tarot-history-item" key={idx}>
        <div>
          <strong>Karty:</strong>{' '}
          {item.cards.map(cardName => cardName).join(', ')}
        </div>
      </div>
    ))}
  </div>
)}
    </div>
  );
};

export default TarotReading;
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

export default cardMeanings;
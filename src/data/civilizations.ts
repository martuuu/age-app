export interface Civilization {
  id: string;
  name: string;
  category: "Infantería" | "Caballería" | "Arqueros" | "Naval" | "Defensiva" | "Pólvora";
  unique_unit: string;
  specialties: string[];
  bonuses: string[];
  icon: string;
}

export const CIVILIZATIONS: Civilization[] = [
  {
    id: "aztecs",
    name: "Aztecas",
    category: "Infantería",
    unique_unit: "Guerrero Jaguar",
    specialties: ["Infantería", "Reliquias"],
    bonuses: [
      "Aldeanos cargan +3 recursos",
      "Unidades militares creadas un 11% más rápido",
      "Monjes reciben 5 HP por cada tecnología desarrollada"
    ],
    icon: "🦅"
  },
  {
    id: "berbers",
    name: "Bereberes",
    category: "Caballería",
    unique_unit: "Arquería a Camello",
    specialties: ["Caballería", "Economía"],
    bonuses: [
      "Aldeanos se mueven un 10% más rápido",
      "Unidades de caballería cuestan -15% en Castillos, -20% en Imperial",
      "Barcos de guerra se mueven un 10% más rápido"
    ],
    icon: "🐪"
  },
  {
    id: "britons",
    name: "Britanos",
    category: "Arqueros",
    unique_unit: "Arquero de Tiro Largo",
    specialties: ["Arqueros a Pie"],
    bonuses: [
      "Centros Urbanos cuestan -50% madera",
      "Arqueros a pie tienen +1 rango en Castillos, +1 en Imperial",
      "Pastores trabajan un 25% más rápido"
    ],
    icon: "🏹"
  },
  {
    id: "byzantines",
    name: "Bizantinos",
    category: "Defensiva",
    unique_unit: "Catrafracta",
    specialties: ["Contrarrestar", "Defensa"],
    bonuses: [
      "Edificaciones tienen +10% HP en Alta Edad Media, +20% Feudal, +30% Castillos, +40% Imperial",
      "Camellos, hostigadores y piqueros cuestan -25%",
      "Brulotes atacan un 20% más rápido"
    ],
    icon: "🛡️"
  },
  {
    id: "chinese",
    name: "Chinos",
    category: "Arqueros",
    unique_unit: "Chu Ko Nu",
    specialties: ["Arqueros", "Tecnología"],
    bonuses: [
      "Empiezan con +3 aldeanos pero -200 alimento y -50 madera",
      "Tecnologías cuestan -10% Feudal, -15% Castillos, -20% Imperial",
      "Demoliciones tienen +50% HP"
    ],
    icon: "🐲"
  },
  {
    id: "franks",
    name: "Francos",
    category: "Caballería",
    unique_unit: "Lanzador de Hachas",
    specialties: ["Caballería", "Castillos"],
    bonuses: [
      "Castillos cuestan -25%",
      "Caballería pesada tiene +20% HP",
      "Recolectores de bayas trabajan un 25% más rápido"
    ],
    icon: "⚜️"
  },
  {
    id: "goths",
    name: "Godos",
    category: "Infantería",
    unique_unit: "Huscarle",
    specialties: ["Infantería", "Número"],
    bonuses: [
      "Infantería cuesta -20% Feudal, -25% Castillos, -35% Imperial",
      "Infantería tiene +1 ataque contra edificaciones",
      "Aldeanos tienen +5 ataque contra jabalíes"
    ],
    icon: "⚔️"
  },
  {
    id: "huns",
    name: "Hunos",
    category: "Caballería",
    unique_unit: "Arquero de Caballería Tarkan",
    specialties: ["Caballería", "Arqueros"],
    bonuses: [
      "No necesitan casas pero empiezan con -100 madera",
      "Arqueros de caballería cuestan -10% en Castillos, -20% en Imperial",
      "Trebuchets tienen +30% de precisión"
    ],
    icon: "🐎"
  },
  {
    id: "japanese",
    name: "Japoneses",
    category: "Infantería",
    unique_unit: "Samurái",
    specialties: ["Infantería", "Pesca"],
    bonuses: [
      "Barcos pesqueros tienen x2 HP y +2 armadura de proyectil",
      "Molinos, campamentos mineros y madereros cuestan -50%",
      "Infantería ataca un 33% más rápido desde la Edad Feudal"
    ],
    icon: "⛩️"
  },
  {
    id: "mayans",
    name: "Mayas",
    category: "Arqueros",
    unique_unit: "Arquero de Plumas",
    specialties: ["Arqueros", "Recursos"],
    bonuses: [
      "Empiezan con +1 aldeano pero -50 alimento",
      "Recursos duran un 15% más",
      "Arqueros a pie cuestan -10% Feudal, -20% Castillos, -30% Imperial"
    ],
    icon: "🏺"
  },
  {
    id: "mongols",
    name: "Mongoles",
    category: "Caballería",
    unique_unit: "Mangudai",
    specialties: ["Arqueros de Caballería"],
    bonuses: [
      "Arqueros de caballería disparan un 25% más rápido",
      "Caballería ligera, Husares y Step Lancer tienen +30% HP",
      "Cazadores trabajan un 40% más rápido"
    ],
    icon: "🏹"
  },
  {
    id: "persians",
    name: "Persas",
    category: "Caballería",
    unique_unit: "Elefante de Guerra",
    specialties: ["Caballería", "Economía"],
    bonuses: [
      "Empiezan con +50 alimento y madera",
      "Centros Urbanos y Muelles tienen x2 HP",
      "Centros Urbanos y Muelles trabajan un 10% más rápido en Feudal, 15% Castillos, 20% Imperial"
    ],
    icon: "🐘"
  },
  {
    id: "spanish",
    name: "Españoles",
    category: "Pólvora",
    unique_unit: "Conquistador",
    specialties: ["Pólvora", "Monjes"],
    bonuses: [
      "Constructores trabajan un 30% más rápido",
      "Unidades de pólvora disparan un 18% más rápido",
      "Mejoras de herrería no cuestan oro"
    ],
    icon: "🏰"
  },
  {
    id: "teutons",
    name: "Teutones",
    category: "Infantería",
    unique_unit: "Caballero Teutónico",
    specialties: ["Defensiva", "Infantería"],
    bonuses: [
      "Monjes curan desde x2 de distancia",
      "Torres pueden guarecer x2 unidades",
      "Granjas cuestan -40%"
    ],
    icon: "🛡️"
  },
  {
    id: "turks",
    name: "Turcos",
    category: "Pólvora",
    unique_unit: "Janissary",
    specialties: ["Pólvora"],
    bonuses: [
      "Unidades de pólvora tienen +25% HP",
      "Tecnologías de pólvora cuestan -50%",
      "Mineros de oro trabajan un 20% más rápido"
    ],
    icon: "🧨"
  },
  {
    id: "vikings",
    name: "Vikingos",
    category: "Infantería",
    unique_unit: "Berserker / Barco Dragón",
    specialties: ["Infantería", "Naval"],
    bonuses: [
      "Barcos de guerra cuestan -15% en Castillos, -20% en Imperial",
      "Infantería tiene +10% HP en Feudal, +15% Castillos, +20% Imperial",
      "Carretilla y Carro de mano son gratis"
    ],
    icon: "🛶"
  },
  {
    id: "armenians",
    name: "Armenios",
    category: "Infantería",
    unique_unit: "Arquero Compuesto",
    specialties: ["Infantería", "Marina"],
    bonuses: [
      "Mejoras de infantería disponibles una edad antes",
      "Galeras disparan dos proyectiles",
      "Centros Urbanos pueden guarecer +5 unidades"
    ],
    icon: "☦️"
  },
  {
    id: "bengalis",
    name: "Bengalíes",
    category: "Arqueros",
    unique_unit: "Ratha",
    specialties: ["Arqueros", "Elefantes"],
    bonuses: [
      "Elefantes reciben -25% daño de bonus",
      "Aldeanos y monjes ocupan un 10% menos de espacio de población",
      "Barcos de comercio generan algo de alimento"
    ],
    icon: "🐘"
  },
  {
    id: "bohemians",
    name: "Bohemios",
    category: "Pólvora",
    unique_unit: "Vagón de Guerra / Obús",
    specialties: ["Pólvora", "Monjes"],
    bonuses: [
      "Pólvora disponible en Castillos",
      "Monasterio trabaja más rápido",
      "Mejoras de minería de oro gratis"
    ],
    icon: "🏰"
  },
  {
    id: "bulgarians",
    name: "Búlgaros",
    category: "Infantería",
    unique_unit: "Konnik",
    specialties: ["Infantería", "Caballería"],
    bonuses: [
      "Mejoras de línea de milicia gratis",
      "Centros Urbanos cuestan -50% piedra",
      "Herrería trabaja un 80% más rápido"
    ],
    icon: "🛡️"
  },
  {
    id: "burgundians",
    name: "Borgoñones",
    category: "Caballería",
    unique_unit: "Coustillier / Granadero",
    specialties: ["Caballería", "Economía"],
    bonuses: [
      "Mejoras económicas disponibles una edad antes",
      "Mejoras de Caballero disponibles en Castillos",
      "Unidades de pólvora tienen +25% ataque"
    ],
    icon: "🍷"
  },
  {
    id: "burmese",
    name: "Birmanos",
    category: "Caballería",
    unique_unit: "Arambai",
    specialties: ["Infantería", "Elefantes"],
    bonuses: [
      "Infantería tiene +1 ataque por edad",
      "Mejoras de Monasterio cuestan -50%",
      "Ubicaciones de reliquias visibles en el mapa"
    ],
    icon: "🏯"
  },
  {
    id: "cumans",
    name: "Cumanos",
    category: "Caballería",
    unique_unit: "Kipchak",
    specialties: ["Caballería"],
    bonuses: [
      "Pueden construir Centros Urbanos adicionales en Feudal",
      "Caballería se mueve un 5% más rápido por edad",
      "Talleres de maquinaria disponibles en Feudal"
    ],
    icon: "🏹"
  },
  {
    id: "dravidians",
    name: "Dravídicos",
    category: "Infantería",
    unique_unit: "Urumi / Thirisadai",
    specialties: ["Infantería", "Naval"],
    bonuses: [
      "Barracones cuestan -50% madera",
      "Barcos de guerra disparan un 25% más rápido",
      "Recibes 200 de madera al avanzar de edad"
    ],
    icon: "🚢"
  },
  {
    id: "ethiopians",
    name: "Etíopes",
    category: "Arqueros",
    unique_unit: "Guerrero Shotel",
    specialties: ["Arqueros"],
    bonuses: [
      "Arqueros disparan un 18% más rápido",
      "Recibes 100 de oro y alimento al avanzar de edad",
      "Piqueros y Halberdiers tienen +10% HP"
    ],
    icon: "🦁"
  },
  {
    id: "georgians",
    name: "Georgianos",
    category: "Caballería",
    unique_unit: "Monaspa",
    specialties: ["Caballería", "Defensiva"],
    bonuses: [
      "Empiezan con una carreta de bueyes",
      "Unidades reciben -15% menos de daño por elevación",
      "Edificaciones cerca de Iglesias tienen regeneración"
    ],
    icon: "⛪"
  },
  {
    id: "gurjaras",
    name: "Gurjaras",
    category: "Caballería",
    unique_unit: "Chakram",
    specialties: ["Caballería", "Camellos"],
    bonuses: [
      "Pueden guarecer ganado en molinos",
      "Camellos y Elefantes tienen +40% de daño de bonus",
      "Unidades de caballería ligera se mueven más rápido"
    ],
    icon: "👳"
  },
  {
    id: "hindustanis",
    name: "Indostaníes",
    category: "Caballería",
    unique_unit: "Ghulam",
    specialties: ["Camellos", "Pólvora"],
    bonuses: [
      "Aldeanos cuestan -10% Feudal, -15% Castillos, -20% Imperial",
      "Camellos atacan un 25% más rápido",
      "Unidades de pólvora tienen +1/+1 armadura"
    ],
    icon: "🕌"
  },
  {
    id: "inca",
    name: "Incas",
    category: "Infantería",
    unique_unit: "Kamayuk / Hondero",
    specialties: ["Infantería"],
    bonuses: [
      "Aldeanos afectados por mejoras de herrería",
      "Casas soportan 10 de población",
      "Unidades cuestan -15% en Castillos, -20% en Imperial"
    ],
    icon: "🏔️"
  },
  {
    id: "italians",
    name: "Italianos",
    category: "Arqueros",
    unique_unit: "Ballestero Genovés",
    specialties: ["Arqueros", "Naval"],
    bonuses: [
      "Avanzar de edad cuesta -15%",
      "Tecnologías de puerto cuestan -50%",
      "Arqueros y unidades navales cuestan -15%"
    ],
    icon: "🎭"
  },
  {
    id: "jurchens",
    name: "Jurchens",
    category: "Caballería",
    unique_unit: "Guerrero de Hierro",
    specialties: ["Caballería Pesada"],
    bonuses: [
      "Mejoras de caballería más baratas",
      "Economía de madera fuerte",
      "Unidades únicas muy resistentes"
    ],
    icon: "🐲"
  },
  {
    id: "khitans",
    name: "Khitans",
    category: "Caballería",
    unique_unit: "Lancero Khitan",
    specialties: ["Caballería Ligera"],
    bonuses: [
      "Exploración más rápida",
      "Bonus de ataque por flanqueo",
      "Aldeanos recolectan más rápido de fuentes naturales"
    ],
    icon: "🐎"
  },
  {
    id: "khmer",
    name: "Jemeres",
    category: "Caballería",
    unique_unit: "Elefante de Balista",
    specialties: ["Elefantes", "Economía"],
    bonuses: [
      "No necesitan edificios de pre-requisito para avanzar",
      "Aldeanos pueden guarecerse en casas",
      "Granjas no necesitan molino para depositar"
    ],
    icon: "🐘"
  },
  {
    id: "koreans",
    name: "Coreanos",
    category: "Defensiva",
    unique_unit: "Carreta de Guerra / Barco Tortuga",
    specialties: ["Torres", "Arqueros"],
    bonuses: [
      "Unidades militares cuestan -20% de madera",
      "Mejoras de torres gratis",
      "Aldeanos tienen +3 de visión"
    ],
    icon: "🐢"
  },
  {
    id: "lithuanians",
    name: "Lituanos",
    category: "Caballería",
    unique_unit: "Leitis",
    specialties: ["Caballería", "Reliquias"],
    bonuses: [
      "Caballería tiene +1 ataque por cada reliquia guarecida",
      "Empiezan con +150 alimento",
      "Línea de lanceros y escaramuzadores se mueven un 10% más rápido"
    ],
    icon: "🛡️"
  },
  {
    id: "magyars",
    name: "Magiares",
    category: "Caballería",
    unique_unit: "Húsar Magiar",
    specialties: ["Caballería", "Arqueros"],
    bonuses: [
      "Mejoras de ataque de caballería gratis",
      "Aldeanos matan lobos de 1 golpe",
      "Arqueros de caballería cuestan -15%"
    ],
    icon: "⚔️"
  },
  {
    id: "malay",
    name: "Malayos",
    category: "Naval",
    unique_unit: "Guerrero Karambit",
    specialties: ["Naval", "Infantería"],
    bonuses: [
      "Avanzan de edad un 66% más rápido",
      "Trampas de peces cuestan -33% y duran x3",
      "Mejoras de armadura de elefante gratis"
    ],
    icon: "🛶"
  },
  {
    id: "malians",
    name: "Malíes",
    category: "Infantería",
    unique_unit: "Gbeto",
    specialties: ["Infantería", "Oro"],
    bonuses: [
      "Edificaciones cuestan -15% madera",
      "Infantería tiene +1 armadura por edad",
      "Campamentos mineros duran x2"
    ],
    icon: "🕌"
  },
  {
    id: "mapuche",
    name: "Mapuches",
    category: "Infantería",
    unique_unit: "Toqui",
    specialties: ["Guerrilla", "Infantería"],
    bonuses: [
      "Unidades se mueven más rápido en bosque",
      "Bonus de daño contra caballería",
      "Resistencia extrema al asedio"
    ],
    icon: "🏔️"
  },
  {
    id: "muisca",
    name: "Muiscas",
    category: "Arqueros",
    unique_unit: "Guerrero de Oro",
    specialties: ["Oro", "Arqueros"],
    bonuses: [
      "Generación de oro pasiva",
      "Arqueros con más daño a corta distancia",
      "Edificaciones defensivas más baratas"
    ],
    icon: "🏺"
  },
  {
    id: "poles",
    name: "Polacos",
    category: "Caballería",
    unique_unit: "Obuch",
    specialties: ["Caballería", "Economía"],
    bonuses: [
      "Aldeanos regeneran HP",
      "Folwark reemplaza molino (bono de comida)",
      "Caballería ligera cuesta -60% oro"
    ],
    icon: "🦅"
  },
  {
    id: "portuguese",
    name: "Portugueses",
    category: "Naval",
    unique_unit: "Organ Gun / Carabela",
    specialties: ["Pólvora", "Naval"],
    bonuses: [
      "Unidades cuestan -20% oro",
      "Tecnologías investigan un 30% más rápido",
      "Feitoria disponible en Imperial"
    ],
    icon: "⛵"
  },
  {
    id: "romans",
    name: "Romanos",
    category: "Infantería",
    unique_unit: "Legionario / Centurión",
    specialties: ["Infantería", "Asedio"],
    bonuses: [
      "Aldeanos trabajan un 5% más rápido",
      "Mejoras de herrería cuestan alimento en lugar de oro",
      "Galeras tienen +1 de ataque"
    ],
    icon: "🏛️"
  },
  {
    id: "saracens",
    name: "Sarracenos",
    category: "Caballería",
    unique_unit: "Mameluco",
    specialties: ["Camellos", "Comercio"],
    bonuses: [
      "Mercado cuesta -15% madera",
      "Arqueros tienen +2 ataque contra edificios",
      "Camellos tienen +10% HP"
    ],
    icon: "🕌"
  },
  {
    id: "shu",
    name: "Shu",
    category: "Defensiva",
    unique_unit: "Ballesta de Repetición",
    specialties: ["Defensa", "Montañas"],
    bonuses: [
      "Torres tienen más rango",
      "Bonus de defensa en colinas",
      "Arqueros disparan más rápido"
    ],
    icon: "⛩️"
  },
  {
    id: "sicilians",
    name: "Sicilianos",
    category: "Caballería",
    unique_unit: "Hauberk / Serjeant",
    specialties: ["Caballería", "Edificios"],
    bonuses: [
      "Donjon reemplaza torre (produce Serjeants)",
      "Unidades reciben -50% daño de bonus",
      "Granjas rinden +100%"
    ],
    icon: "🏰"
  },
  {
    id: "slavs",
    name: "Eslavos",
    category: "Infantería",
    unique_unit: "Boyar",
    specialties: ["Asedio", "Infantería"],
    bonuses: [
      "Granjeros trabajan un 10% más rápido",
      "Unidades de asedio cuestan -15%",
      "Suministros gratis"
    ],
    icon: "🛡️"
  },
  {
    id: "tatars",
    name: "Tártaros",
    category: "Caballería",
    unique_unit: "Keshik / Flaming Camel",
    specialties: ["Arqueros de Caballería"],
    bonuses: [
      "Unidades tienen +25% daño por elevación",
      "Pastores trabajan un 50% más rápido",
      "Regalan ovejas con Centros Urbanos"
    ],
    icon: "🐎"
  },
  {
    id: "tupi",
    name: "Tupíes",
    category: "Infantería",
    unique_unit: "Guerrero de Cerbatana",
    specialties: ["Movilidad", "Selva"],
    bonuses: [
      "Infantería de ataque rápido",
      "Mejoras de bosque",
      "Exploradores excepcionales"
    ],
    icon: "🛶"
  },
  {
    id: "vietnamese",
    name: "Vietnamitas",
    category: "Arqueros",
    unique_unit: "Arquero de Rattan",
    specialties: ["Arqueros", "Visión"],
    bonuses: [
      "Revelan posiciones enemiga al inicio",
      "Arqueros tienen +20% HP",
      "Mejoras de economía no cuestan oro"
    ],
    icon: "🎍"
  },
  {
    id: "wei",
    name: "Wei",
    category: "Caballería",
    unique_unit: "Caballería Pesada Wei",
    specialties: ["Caballería", "Logística"],
    bonuses: [
      "Producción militar más barata",
      "Castillos más resistentes",
      "Bono de comida en granjas"
    ],
    icon: "🛡️"
  },
  {
    id: "wu",
    name: "Wu",
    category: "Naval",
    unique_unit: "Barco de Guerra Wu",
    specialties: ["Naval", "Arqueros"],
    bonuses: [
      "Dominio de ríos y costas",
      "Arqueros con mayor daño",
      "Bonus de comercio naval"
    ],
    icon: "⛵"
  }
];

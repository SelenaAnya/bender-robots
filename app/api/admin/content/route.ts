import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'data', 'content.json');

// Перевіряємо чи існує директорія data
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Початкові дані з усіма секціями
const defaultContent = {
  footer: {
    heading_uk: "Зв'яжіться з командою BENDER ROBOTS",
    heading_en: "Get in Touch with BENDER ROBOTS Team",
    description_uk: "Напишіть нам — і ми надішлемо детальну інформацію про рішення та умови поставки.",
    description_en: "Write to us — and we will send you detailed information about solutions and delivery terms.",
    email: "post@gmail.com",
    nameLabel_uk: "Ім'я",
    nameLabel_en: "Name",
    emailLabel_uk: "Ваш Email",
    emailLabel_en: "Your Email",
    phoneLabel_uk: "Телефон",
    phoneLabel_en: "Phone",
    submitButton_uk: "Отримати презентацію",
    submitButton_en: "Get Presentation",
    copyright_uk: "2025 BENDER ROBOTS. Усі права захищено.",
    copyright_en: "2025 BENDER ROBOTS. All rights reserved.",
    privacyLink_uk: "Політика конфіденційності",
    privacyLink_en: "Privacy Policy",
    termsLink_uk: "Умови використання",
    termsLink_en: "Terms of Service"
  },
  
  aboutUs: {
    heading_uk: "Ми — українські інженери, які створюють роботизовані рішення, що рятують життя.",
    heading_en: "We are Ukrainian engineers creating robotic solutions that save lives.",
    description1_uk: "З початку повномасштабного вторгнення ми розробляємо бойові автономні системи, здатні працювати там, де небезпечно людині.",
    description1_en: "Since the beginning of the full-scale invasion, we have been developing combat autonomous systems capable of operating where it is dangerous for humans.",
    description2_uk: "Наша мета — зробити ЗСУ технологічно сильнішими.",
    description2_en: "Our goal is to make the Armed Forces technologically stronger.",
    video: "/videos/robot-demo.mp4"
  },
  
  products: [
    {
      id: 1,
      name_uk: "Bender-2.0",
      name_en: "Bender-2.0",
      description_uk: "Автономний наземний робот, призначений для безпечної доставки вантажів у зону бойових дій.",
      description_en: "Autonomous ground robot designed for safe cargo delivery to combat zones.",
      features_uk: [
        "Завантаження до 250 кг",
        "Дальність дії: 5-15 км",
        "Автономна робота до 60 км",
        "Дистанційне керування"
      ],
      features_en: [
        "Load capacity up to 250 kg",
        "Range: 5-15 km",
        "Autonomous operation up to 60 km",
        "Remote control"
      ],
      image: "/images/bender-2.png"
    },
    {
      id: 2,
      name_uk: "Bender-M",
      name_en: "Bender-M",
      description_uk: "Середній клас роботів для складних логістичних завдань.",
      description_en: "Medium class robots for complex logistics tasks.",
      features_uk: [
        "Завантаження до 400 кг",
        "Дальність дії: 10-20 км",
        "Автономна робота до 80 км",
        "Модульна конструкція"
      ],
      features_en: [
        "Load capacity up to 400 kg",
        "Range: 10-20 km",
        "Autonomous operation up to 80 km",
        "Modular construction"
      ],
      image: "/images/bender-m.png"
    },
    {
      id: 3,
      name_uk: "Bender-L",
      name_en: "Bender-L",
      description_uk: "Великий робот для найскладніших завдань на передовій.",
      description_en: "Large robot for the most complex tasks on the frontline.",
      features_uk: [
        "Завантаження до 600 кг",
        "Дальність дії: 15-25 км",
        "Автономна робота до 100 км",
        "Повний набір сенсорів"
      ],
      features_en: [
        "Load capacity up to 600 kg",
        "Range: 15-25 km",
        "Autonomous operation up to 100 km",
        "Full sensor suite"
      ],
      image: "/images/bender-l.png"
    }
  ],
  
  testimonials: [
    {
      id: 1,
      quote_uk: "Ми використовуємо BENDER-2.0 під час ротації — платформа доставляла боєкомплект без проблем. Без неї ризик був би максимальний.",
      quote_en: "We use BENDER-2.0 during rotation — the platform delivered ammunition without issues. Without it, the risk would have been maximum.",
      author_uk: "Володимир К.",
      author_en: "Volodymyr K.",
      role_uk: "Командир роти, Східний напрямок",
      role_en: "Company Commander, Eastern Direction"
    },
    {
      id: 2,
      quote_uk: "Навчання зайняло 20 хвилин. Керується як іграшка, але працює як танк.",
      quote_en: "Training took 20 minutes. Controlled like a toy, but works like a tank.",
      author_uk: "Ігор С.",
      author_en: "Ihor S.",
      role_uk: "Боєць БПЛА",
      role_en: "UAV Fighter"
    },
    {
      id: 3,
      quote_uk: "BENDER дозволяє нам робити під РЕБ те, про що раніше лише мріяли. Ніхто не ризикує, а вантаж потрібно доставити без помилок.",
      quote_en: "BENDER allows us to do under EW what we could only dream of before. Nobody risks, and cargo needs to be delivered without errors.",
      author_uk: "Олег М.",
      author_en: "Oleh M.",
      role_uk: "Офіцер інженерних військ",
      role_en: "Engineering Troops Officer"
    },
    {
      id: 4,
      quote_uk: "Це реально працює. Побачили перший раз — не повірили. Тепер використовуємо постійно.",
      quote_en: "This really works. First time we saw it — didn't believe it. Now we use it constantly.",
      author_uk: "Андрій Т.",
      author_en: "Andriy T.",
      role_uk: "Командир відділення",
      role_en: "Squad Leader"
    }
  ],
  
  support: {
    heading_uk: "Нас вже підтримують:",
    heading_en: "Already supporting us:",
    description_uk: "Ми активно співпрацюємо з бойовими підрозділами для адаптації платформи до реальних умов.",
    description_en: "We actively cooperate with combat units to adapt the platform to real conditions.",
    units: [
      {
        id: 1,
        name_uk: "3 прикордонний загін ім. Героя України Євгена Пікуса «Помста»",
        name_en: "3rd Border Guard Unit named after Hero of Ukraine Yevhen Pikus 'Pomsta'",
        logo: "/svg/logo/pomsta.svg"
      },
      {
        id: 2,
        name_uk: "4 прикордонний загін РубПАК «Стрікс»",
        name_en: "4th Border Guard Unit RubPAK 'Striks'",
        logo: "/svg/logo/stricks.svg"
      },
      {
        id: 3,
        name_uk: "10 мобільний прикордонний загін ДПСУ «Дозор»",
        name_en: "10th Mobile Border Guard Unit SBGS 'Dozor'",
        logo: "/svg/logo/dozor.svg"
      },
      {
        id: 4,
        name_uk: "6 прикордонний Волинський загін",
        name_en: "6th Border Guard Volyn Unit",
        logo: "/svg/logo/6prikordonnyi.svg"
      },
      {
        id: 5,
        name_uk: "3 ОШБр",
        name_en: "3 OShBr",
        logo: "/svg/logo/3oshbr.svg"
      },
      {
        id: 6,
        name_uk: "4 бригада оперативного призначення НГУ «Рубіж»",
        name_en: "4th Operational Brigade NGU 'Rubizh'",
        logo: "/svg/logo/rybij.svg"
      },
      {
        id: 7,
        name_uk: "108-й окремий штурмовий батальйон «Вовки Да Вінчі»",
        name_en: "108th Separate Assault Battalion 'Wolves of Da Vinci'",
        logo: "/svg/logo/DaVinchi.svg"
      },
      {
        id: 8,
        name_uk: "13 бригада НГУ Хартія",
        name_en: "13th Brigade NGU Khartia",
        logo: "/svg/logo/Khartiya.svg"
      }
    ]
  },
  
  videoBackground: {
    videoSrc: "/videos/background.mp4",
    opacity: 0.6,
    enabled: true
  }
};

// GET - Отримання контенту
export async function GET() {
  try {
    ensureDataDir();

    // Якщо файл не існує, створюємо з дефолтними даними
    if (!fs.existsSync(CONTENT_FILE)) {
      fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaultContent, null, 2));
      return NextResponse.json(defaultContent);
    }

    const content = fs.readFileSync(CONTENT_FILE, 'utf-8');
    const data = JSON.parse(content);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading content:', error);
    return NextResponse.json(defaultContent);
  }
}

// POST - Збереження контенту
export async function POST(request: Request) {
  try {
    const data = await request.json();

    ensureDataDir();

    // Зберігаємо дані у файл
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Content saved successfully' 
    });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error saving content',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Часткове оновлення контенту (оновлення окремих секцій)
export async function PUT(request: Request) {
  try {
    const { section, data } = await request.json();

    ensureDataDir();

    // Читаємо поточний контент
    let currentContent = defaultContent;
    if (fs.existsSync(CONTENT_FILE)) {
      const content = fs.readFileSync(CONTENT_FILE, 'utf-8');
      currentContent = JSON.parse(content);
    }

    // Оновлюємо тільки вказану секцію
    currentContent = {
      ...currentContent,
      [section]: data
    };

    // Зберігаємо оновлені дані
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(currentContent, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: `Section ${section} updated successfully` 
    });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error updating section',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
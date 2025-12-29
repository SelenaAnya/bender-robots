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

// Початкові дані
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
    copyright_en: "2025 BENDER ROBOTS. All rights reserved."
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
    }
  ],
  forWhom: [
    {
      id: 1,
      title_uk: "Підрозділи ЗСУ",
      title_en: "Armed Forces Units",
      image: "/images/for-whom/zsu.jpg"
    },
    {
      id: 2,
      title_uk: "Тактичні групи ТРО",
      title_en: "Tactical Defense Groups",
      image: "/images/for-whom/tro.jpg"
    },
    {
      id: 3,
      title_uk: "Волонтерські фонди",
      title_en: "Volunteer Funds",
      image: "/images/for-whom/volunteers.jpg"
    },
    {
      id: 4,
      title_uk: "Військові медики",
      title_en: "Military Medics",
      image: "/images/for-whom/medics.jpg"
    },
    {
      id: 5,
      title_uk: "Логістичні команди на фронті",
      title_en: "Frontline Logistics Teams",
      image: "/images/for-whom/logistics.jpg"
    }
  ],
  aboutUs: {
    heading_uk: "Ми — українські інженери, які створюють роботизовані рішення, що рятують життя.",
    heading_en: "We are Ukrainian engineers creating robotic solutions that save lives.",
    description1_uk: "З початку повномасштабного вторгнення ми розробляємо бойові автономні системи, здатні працювати там, де небезпечно людині.",
    description1_en: "Since the beginning of the full-scale invasion, we have been developing combat autonomous systems capable of operating where it is dangerous for humans.",
    description2_uk: "Наша мета — зробити ЗСУ технологічно сильнішими.",
    description2_en: "Our goal is to make the Armed Forces technologically stronger.",
    video: "/videos/robot-demo.mp4"
  },
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
        name_uk: "108-й окремий штурмовий батальон «Вовки Да Вінчі»",
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

    return NextResponse.json({ success: true, message: 'Content saved successfully' });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { success: false, message: 'Error saving content' },
      { status: 500 }
    );
  }
}
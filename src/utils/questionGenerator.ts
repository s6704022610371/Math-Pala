import { Difficulty, Question, ShopId } from '../types/game';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate 3 sensible unique distractors for primary school math
 */
function generateDistractors(correct: number, minVal: number = 0, deltaSpread: number = 5): number[] {
  const distractors = new Set<number>();
  
  const potentialOffsets = [
    -1, 1, -2, 2, -10, 10, -5, 5, -20, 20, -15, 15, -4, 4, -8, 8
  ];
  
  for (const offset of potentialOffsets) {
    const val = correct + offset;
    if (val >= minVal && val !== correct) {
      distractors.add(val);
      if (distractors.size === 3) break;
    }
  }

  let counter = 1;
  while (distractors.size < 3) {
    const candidate = correct + (counter % 2 === 0 ? counter * deltaSpread : -counter * deltaSpread);
    if (candidate >= minVal && candidate !== correct) {
      distractors.add(candidate);
    }
    counter++;
  }

  return Array.from(distractors).slice(0, 3);
}

export function generateQuestion(shopId: ShopId, difficulty: Difficulty): Question {
  const qId = Math.random().toString(36).substring(2, 9);

  switch (shopId) {
    case 'fruit':
      return generateFruitQuestion(qId, difficulty);
    case 'drink':
      return generateDrinkQuestion(qId, difficulty);
    case 'snack':
      return generateSnackQuestion(qId, difficulty);
    case 'clothes':
      return generateClothesQuestion(qId, difficulty);
    case 'myshop':
      return generateMyShopQuestion(qId, difficulty);
    default:
      return generateFruitQuestion(qId, difficulty);
  }
}

// 🍎 1. FRUIT SHOP: ADDITION & SUBTRACTION
function generateFruitQuestion(id: string, difficulty: Difficulty): Question {
  const fruits = [
    { name: 'แอปเปิ้ล', emoji: '🍎' },
    { name: 'ส้ม', emoji: '🍊' },
    { name: 'กล้วย', emoji: '🍌' },
    { name: 'แตงโม', emoji: '🍉' },
    { name: 'สตรอว์เบอร์รี', emoji: '🍓' },
  ];

  if (difficulty === 'easy') {
    const isAddition = Math.random() > 0.45;
    const f1 = pickRandom(fruits);
    let f2 = pickRandom(fruits);
    while (f2.name === f1.name) {
      f2 = pickRandom(fruits);
    }

    if (isAddition) {
      const a = randomInt(2, 10);
      const b = randomInt(1, 9);
      const correct = a + b;
      const options = shuffle([correct, ...generateDistractors(correct, 1)]);

      return {
        id,
        shopId: 'fruit',
        difficulty,
        storyTitle: `มี${f1.name} ${a} ผล ซื้อ${f2.name}มาเพิ่มอีก ${b} ผล`,
        equationText: `${a} + ${b} = ?`,
        questionPrompt: `รวมมีผลไม้ทั้งหมดกี่ผล?`,
        visualItems: [
          { emoji: f1.emoji, count: a, label: `${f1.name} ${a} ผล` },
          { emoji: f2.emoji, count: b, label: `${f2.name} ${b} ผล` },
        ],
        options,
        correctAnswer: correct,
        unit: 'ผล',
        explanation: `${a} + ${b} = ${correct} ผล`,
      };
    } else {
      const total = randomInt(6, 18);
      const eaten = randomInt(2, total - 2);
      const correct = total - eaten;
      const options = shuffle([correct, ...generateDistractors(correct, 0)]);

      return {
        id,
        shopId: 'fruit',
        difficulty,
        storyTitle: `ในตะกร้ามี${f1.name} ${total} ผล ขายให้เพื่อนไป ${eaten} ผล`,
        equationText: `${total} - ${eaten} = ?`,
        questionPrompt: `จะเหลือ${f1.name}ในตะกร้ากี่ผล?`,
        visualItems: [
          { emoji: f1.emoji, count: total, label: `เดิมมี ${total} ผล (ขายไป ${eaten} ผล)` },
        ],
        options,
        correctAnswer: correct,
        unit: 'ผล',
        explanation: `${total} - ${eaten} = ${correct} ผล`,
      };
    }
  } else {
    // Hard: 2-digit addition and subtraction (up to 100)
    const isAddition = Math.random() > 0.45;
    const f1 = pickRandom(fruits);
    const f2 = pickRandom(fruits);

    if (isAddition) {
      const price1 = randomInt(15, 48);
      const price2 = randomInt(12, 45);
      const correct = price1 + price2;
      const options = shuffle([correct, ...generateDistractors(correct, 20)]);

      return {
        id,
        shopId: 'fruit',
        difficulty,
        storyTitle: `ซื้อ${f1.name}ราคา ${price1} บาท และซื้อ${f2.name}ราคา ${price2} บาท`,
        equationText: `${price1} + ${price2} = ?`,
        questionPrompt: `ต้องจ่ายเงินรวมทั้งหมดกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `${price1} + ${price2} = ${correct} บาท`,
      };
    } else {
      const money = pickRandom([50, 70, 80, 100]);
      const spent = randomInt(15, money - 12);
      const correct = money - spent;
      const options = shuffle([correct, ...generateDistractors(correct, 1)]);

      return {
        id,
        shopId: 'fruit',
        difficulty,
        storyTitle: `มีเงิน ${money} บาท ซื้อ${f1.name}ไป ${spent} บาท`,
        equationText: `${money} - ${spent} = ?`,
        questionPrompt: `จะได้รับเงินทอนเหลือกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `${money} - ${spent} = ${correct} บาท`,
      };
    }
  }
}

// 🥤 2. DRINK SHOP: MULTIPLICATION ONLY
// Easy: Random multiplication tables 2 to 11
// Hard: Pure multiplication alternating between (1-digit × 2-digit) and (2-digit × 2-digit)
function generateDrinkQuestion(id: string, difficulty: Difficulty): Question {
  const drinks = [
    { name: 'ชานมไข่มุก', emoji: '🧋' },
    { name: 'น้ำส้มคั้น', emoji: '🍊' },
    { name: 'น้ำผลไม้ปั่น', emoji: '🥤' },
    { name: 'นมสดชมพู', emoji: '🥛' },
    { name: 'โกโก้เย็น', emoji: '☕' },
  ];

  const drink = pickRandom(drinks);

  if (difficulty === 'easy') {
    // สุ่มแม่สูตรคูณตั้งแต่แม่ 2 ถึง 11 (ไม่จำกัดเพียงบางแม่)
    const table = randomInt(2, 11);
    const multiplier = randomInt(2, 12);
    const correct = table * multiplier;
    const options = shuffle([correct, ...generateDistractors(correct, 2)]);

    const storyType = pickRandom(['price_per_cup', 'tray_rows', 'box_bottles']);

    if (storyType === 'price_per_cup') {
      return {
        id,
        shopId: 'drink',
        difficulty,
        storyTitle: `${drink.name} แก้วละ ${table} บาท สั่งซื้อ ${multiplier} แก้ว`,
        equationText: `${multiplier} × ${table} = ?`,
        questionPrompt: `ต้องจ่ายเงินทั้งหมดกี่บาท?`,
        visualItems: [
          { emoji: drink.emoji, count: Math.min(multiplier, 8), label: `${multiplier} แก้ว (แก้วละ ${table} บ.)` },
        ],
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `${multiplier} × ${table} = ${correct} บาท`,
      };
    } else if (storyType === 'tray_rows') {
      return {
        id,
        shopId: 'drink',
        difficulty,
        storyTitle: `ถาดวางเครื่องดื่มมี ${multiplier} แถว แถวละ ${table} แก้ว`,
        equationText: `${multiplier} × ${table} = ?`,
        questionPrompt: `มีเครื่องดื่มบนถาดทั้งหมดกี่แก้ว?`,
        visualItems: [
          { emoji: drink.emoji, count: Math.min(multiplier, 8), label: `${multiplier} แถว (แถวละ ${table} แก้ว)` },
        ],
        options,
        correctAnswer: correct,
        unit: 'แก้ว',
        explanation: `${multiplier} × ${table} = ${correct} แก้ว`,
      };
    } else {
      return {
        id,
        shopId: 'drink',
        difficulty,
        storyTitle: `ลูกค้าสั่ง${drink.name} ${multiplier} ชุด ชุดละ ${table} แก้ว`,
        equationText: `${multiplier} × ${table} = ?`,
        questionPrompt: `รวมได้รับเครื่องดื่มทั้งหมดกี่แก้ว?`,
        visualItems: [
          { emoji: drink.emoji, count: Math.min(multiplier, 8), label: `${multiplier} ชุด (ชุดละ ${table} แก้ว)` },
        ],
        options,
        correctAnswer: correct,
        unit: 'แก้ว',
        explanation: `${multiplier} × ${table} = ${correct} แก้ว`,
      };
    }
  } else {
    // ระดับยาก: ใช้เฉพาะการคูณเท่านั้น สลับระหว่าง (เลข 1 หลัก × 2 หลัก) และ (เลข 2 หลัก × 2 หลัก)
    // ห้ามผสมการบวก ลบ หาร หรือร้อยละเข้ามาเด็ดขาด
    const isOneByTwo = Math.random() < 0.5;

    if (isOneByTwo) {
      // 1) เลข 1 หลัก × เลข 2 หลัก
      const singleDigit = randomInt(3, 9); // 1 หลัก
      const doubleDigit = pickRandom([12, 14, 15, 16, 18, 20, 22, 24, 25, 28, 30, 32, 35, 40, 45, 50]); // 2 หลัก
      const correct = singleDigit * doubleDigit;
      const options = shuffle([correct, ...generateDistractors(correct, 20)]);

      const storyVariant = pickRandom(['buy_cups', 'boxes_pack', 'blender_rounds']);

      if (storyVariant === 'buy_cups') {
        return {
          id,
          shopId: 'drink',
          difficulty,
          storyTitle: `${drink.name}สูตรพิเศษ แก้วละ ${doubleDigit} บาท สั่งซื้อ ${singleDigit} แก้ว`,
          equationText: `${singleDigit} × ${doubleDigit} = ?`,
          questionPrompt: `ต้องจ่ายเงินค่าเครื่องดื่มทั้งหมดกี่บาท?`,
          options,
          correctAnswer: correct,
          unit: 'บาท',
          explanation: `${singleDigit} × ${doubleDigit} = ${correct} บาท`,
        };
      } else if (storyVariant === 'boxes_pack') {
        return {
          id,
          shopId: 'drink',
          difficulty,
          storyTitle: `ร้านจัดส่ง${drink.name} ${singleDigit} ลัง แต่ละลังบรรจุ ${doubleDigit} ขวด`,
          equationText: `${singleDigit} × ${doubleDigit} = ?`,
          questionPrompt: `รวมมีเครื่องดื่มที่จัดส่งทั้งหมดกี่ขวด?`,
          options,
          correctAnswer: correct,
          unit: 'ขวด',
          explanation: `${singleDigit} × ${doubleDigit} = ${correct} ขวด`,
        };
      } else {
        return {
          id,
          shopId: 'drink',
          difficulty,
          storyTitle: `เครื่องปั่นน้ำผลไม้ปั่นได้รอบละ ${doubleDigit} แก้ว ถ้าปั่นทั้งหมด ${singleDigit} รอบ`,
          equationText: `${singleDigit} × ${doubleDigit} = ?`,
          questionPrompt: `จะได้น้ำผลไม้ปั่นทั้งหมดกี่แก้ว?`,
          options,
          correctAnswer: correct,
          unit: 'แก้ว',
          explanation: `${singleDigit} × ${doubleDigit} = ${correct} แก้ว`,
        };
      }
    } else {
      // 2) เลข 2 หลัก × เลข 2 หลัก
      const num1 = pickRandom([11, 12, 14, 15, 16, 18, 20, 22, 25, 30]); // 2 หลัก
      const num2 = pickRandom([11, 12, 13, 14, 15, 16, 18, 20, 24, 25, 30]); // 2 หลัก
      const correct = num1 * num2;
      const options = shuffle([correct, ...generateDistractors(correct, 50)]);

      const storyVariant = pickRandom(['party_cups', 'crate_bottles', 'wholesale_packs']);

      if (storyVariant === 'party_cups') {
        return {
          id,
          shopId: 'drink',
          difficulty,
          storyTitle: `สั่ง${drink.name} แก้วละ ${num1} บาท ลูกค้าสั่งเหมาไปจัดงานเลี้ยง ${num2} แก้ว`,
          equationText: `${num2} × ${num1} = ?`,
          questionPrompt: `คิดเป็นเงินรวมทั้งหมดกี่บาท?`,
          options,
          correctAnswer: correct,
          unit: 'บาท',
          explanation: `${num2} × ${num1} = ${correct} บาท`,
        };
      } else if (storyVariant === 'crate_bottles') {
        return {
          id,
          shopId: 'drink',
          difficulty,
          storyTitle: `โรงงานส่ง${drink.name}มา ${num1} ลัง แต่ละลังมีเครื่องดื่ม ${num2} ขวด`,
          equationText: `${num1} × ${num2} = ?`,
          questionPrompt: `มีเครื่องดื่มทั้งหมดกี่ขวด?`,
          options,
          correctAnswer: correct,
          unit: 'ขวด',
          explanation: `${num1} × ${num2} = ${correct} ขวด`,
        };
      } else {
        return {
          id,
          shopId: 'drink',
          difficulty,
          storyTitle: `โรงเรียนสั่ง${drink.name}สำหรับนักเรียน ${num1} ห้อง ห้องละ ${num2} แก้ว`,
          equationText: `${num1} × ${num2} = ?`,
          questionPrompt: `ต้องเตรียมเครื่องดื่มทั้งหมดกี่แก้ว?`,
          options,
          correctAnswer: correct,
          unit: 'แก้ว',
          explanation: `${num1} × ${num2} = ${correct} แก้ว`,
        };
      }
    }
  }
}

// 🍪 3. SNACK SHOP: DIVISION
function generateSnackQuestion(id: string, difficulty: Difficulty): Question {
  const snacks = [
    { name: 'คุกกี้เนย', emoji: '🍪' },
    { name: 'โดนัทช็อกโกแลต', emoji: '🍩' },
    { name: 'คัพเค้ก', emoji: '🧁' },
    { name: 'ครัวซองต์', emoji: '🥐' },
  ];

  const snack = pickRandom(snacks);

  if (difficulty === 'easy') {
    const people = pickRandom([2, 3, 4, 5]);
    const perPerson = randomInt(2, 6);
    const total = people * perPerson;
    const correct = perPerson;
    const options = shuffle([correct, ...generateDistractors(correct, 1)]);

    return {
      id,
      shopId: 'snack',
      difficulty,
      storyTitle: `มี${snack.name} ${total} ชิ้น แบ่งให้เพื่อน ${people} คน คนละเท่า ๆ กัน`,
      equationText: `${total} ÷ ${people} = ?`,
      questionPrompt: `เพื่อนแต่ละคนจะได้${snack.name}คนละกี่ชิ้น?`,
      visualItems: [
        { emoji: snack.emoji, count: Math.min(total, 12), label: `รวม ${total} ชิ้น (แบ่ง ${people} คน)` },
      ],
      options,
      correctAnswer: correct,
      unit: 'ชิ้น',
      explanation: `${total} ÷ ${people} = ${correct} ชิ้น`,
    };
  } else {
    const boxCount = randomInt(4, 9);
    const perBox = pickRandom([6, 7, 8, 9, 10, 12]);
    const total = boxCount * perBox;
    const correct = boxCount;
    const options = shuffle([correct, ...generateDistractors(correct, 1)]);

    return {
      id,
      shopId: 'snack',
      difficulty,
      storyTitle: `อบ${snack.name}ได้ทั้งหมด ${total} ชิ้น จัดใส่กล่อง กล่องละ ${perBox} ชิ้น`,
      equationText: `${total} ÷ ${perBox} = ?`,
      questionPrompt: `จะได้${snack.name}ทั้งหมดกี่กล่อง?`,
      options,
      correctAnswer: correct,
      unit: 'กล่อง',
      explanation: `${total} ÷ ${perBox} = ${correct} กล่อง`,
    };
  }
}

// 👕 4. CLOTHING SHOP: PERCENTAGE & DISCOUNT
function generateClothesQuestion(id: string, difficulty: Difficulty): Question {
  const clothes = [
    { name: 'เสื้อยืดลายการ์ตูน', emoji: '👕' },
    { name: 'กางเกงยีนส์', emoji: '👖' },
    { name: 'หมวกแก๊ปเท่ๆ', emoji: '🧢' },
    { name: 'ชุดกระโปรง', emoji: '👗' },
    { name: 'เสื้อกันหนาว', emoji: '🧥' },
  ];

  const item = pickRandom(clothes);

  if (difficulty === 'easy') {
    const percent = pickRandom([10, 20, 50]);
    const basePrice = pickRandom([50, 100, 150, 200, 300]);
    const discountAmount = (basePrice * percent) / 100;
    const correct = discountAmount;
    const options = shuffle([correct, ...generateDistractors(correct, 5)]);

    return {
      id,
      shopId: 'clothes',
      difficulty,
      storyTitle: `${item.name} ราคาป้าย ${basePrice} บาท ติดป้ายลดราคา ${percent}%`,
      equationText: `${percent}% ของ ${basePrice} = ?`,
      questionPrompt: `ร้านค้าลดราคาให้กี่บาท?`,
      visualItems: [
        { emoji: item.emoji, count: 1, label: `${item.name} (${basePrice} บาท)` },
        { emoji: '🏷️', count: 1, label: `ลดราคา ${percent}%` },
      ],
      options,
      correctAnswer: correct,
      unit: 'บาท',
      explanation: `${basePrice} × (${percent}/100) = ลดไป ${correct} บาท`,
    };
  } else {
    const type = pickRandom(['discountAmount', 'finalPrice']);

    if (type === 'discountAmount') {
      const percent = pickRandom([25, 30, 40, 75]);
      const basePrice = pickRandom([200, 300, 400, 500]);
      const correct = (basePrice * percent) / 100;
      const options = shuffle([correct, ...generateDistractors(correct, 10)]);

      return {
        id,
        shopId: 'clothes',
        difficulty,
        storyTitle: `${item.name} ราคา ${basePrice} บาท มีคูปองลดพิเศษ ${percent}%`,
        equationText: `${percent}% ของ ${basePrice} = ?`,
        questionPrompt: `ได้ส่วนลดเงินสดกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `${basePrice} × (${percent}/100) = ได้ลด ${correct} บาท`,
      };
    } else {
      const percent = pickRandom([10, 20, 25, 50]);
      const basePrice = pickRandom([100, 200, 300, 400]);
      const discount = (basePrice * percent) / 100;
      const correct = basePrice - discount;
      const options = shuffle([correct, ...generateDistractors(correct, 20)]);

      return {
        id,
        shopId: 'clothes',
        difficulty,
        storyTitle: `${item.name} ราคาป้าย ${basePrice} บาท ลดราคา ${percent}%`,
        equationText: `${basePrice} - ส่วนลด = ?`,
        questionPrompt: `ผู้ซื้อต้องจ่ายเงินจริงกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `ลด ${discount} บาท เหลือจ่ายจริง ${basePrice} - ${discount} = ${correct} บาท`,
      };
    }
  }
}

// 💰 5. MY SHOP: MIX OF ALL 4 SHOPS (ADD/SUB, MULT, DIV, PERCENT) + PROFIT/LOSS
// 2 Levels: "ยาก" (difficulty === 'easy') and "ยากมาก" (difficulty === 'hard')
function generateMyShopQuestion(id: string, difficulty: Difficulty): Question {
  const items = [
    { name: 'กล่องดินสอ', emoji: '✏️' },
    { name: 'ตุ๊กตาหมี', emoji: '🧸' },
    { name: 'ลูกฟุตบอล', emoji: '⚽' },
    { name: 'กระเป๋านักเรียน', emoji: '🎒' },
    { name: 'สีไม้ระบายน้ำ', emoji: '🎨' },
  ];

  const item = pickRandom(items);

  if (difficulty === 'easy') {
    // ระดับ "ยาก": ผสม บวก/ลบ, คูณ, หาร, และร้อยละกำไรขาดทุนเบื้องต้น
    const mixType = pickRandom([
      'mult_profit_total',
      'mult_and_subtract_profit',
      'div_and_profit_per_item',
      'div_pack_sell_retail',
      'percent_profit_amount',
      'percent_loss_amount'
    ]);

    if (mixType === 'mult_profit_total') {
      // คูณ + บวก/ลบ: ซื้อมาหลายชิ้น ได้กำไรต่อชิ้น -> หากำไรรวม
      const costPerItem = pickRandom([15, 20, 30]);
      const profitPerItem = pickRandom([5, 8, 10]);
      const sellPerItem = costPerItem + profitPerItem;
      const qty = randomInt(3, 6);
      const correct = profitPerItem * qty;
      const options = shuffle([correct, ...generateDistractors(correct, 10)]);

      return {
        id,
        shopId: 'myshop',
        difficulty,
        storyTitle: `ซื้อ${item.name}มา ${qty} ชิ้น ทุนชิ้นละ ${costPerItem} บ. ขายชิ้นละ ${sellPerItem} บ.`,
        equationText: `${qty} × (${sellPerItem} - ${costPerItem}) = ?`,
        questionPrompt: `ร้านค้าจะได้รับกำไรรวมทั้งหมดกี่บาท?`,
        visualItems: [
          { emoji: item.emoji, count: qty, label: `${qty} ชิ้น (กำไรชิ้นละ ${profitPerItem} บ.)` },
        ],
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `กำไรชิ้นละ ${sellPerItem} - ${costPerItem} = ${profitPerItem} บาท × ${qty} ชิ้น = กำไร ${correct} บาท`,
      };
    } else if (mixType === 'mult_and_subtract_profit') {
      // คูณหาต้นทุนรวม แล้วนำราคาขายรวมมาลบเพื่อหากำไร
      const costPerItem = pickRandom([25, 40, 50]);
      const qty = randomInt(2, 4);
      const totalCost = costPerItem * qty;
      const profit = pickRandom([30, 40, 50, 60]);
      const totalSellPrice = totalCost + profit;
      const correct = profit;
      const options = shuffle([correct, ...generateDistractors(correct, 10)]);

      return {
        id,
        shopId: 'myshop',
        difficulty,
        storyTitle: `ซื้อ${item.name}มา ${qty} ชิ้น ชิ้นละ ${costPerItem} บาท ขายเหมาทั้งหมดได้ ${totalSellPrice} บาท`,
        equationText: `${totalSellPrice} - (${qty} × ${costPerItem}) = ?`,
        questionPrompt: `ร้านค้าได้กำไรทั้งหมดกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `ต้นทุน ${qty} × ${costPerItem} = ${totalCost} บาท ขายได้ ${totalSellPrice} บาท กำไรคือ ${correct} บาท`,
      };
    } else if (mixType === 'div_and_profit_per_item') {
      // หารต้นทุนต่อชิ้น แล้วลบราคาขายเพื่อหากำไรต่อชิ้น
      const count = pickRandom([4, 5, 10]);
      const costPerItem = pickRandom([8, 10, 12]);
      const packPrice = count * costPerItem;
      const sellPrice = costPerItem + pickRandom([3, 4, 5]);
      const correct = sellPrice - costPerItem;
      const options = shuffle([correct, ...generateDistractors(correct, 1)]);

      return {
        id,
        shopId: 'myshop',
        difficulty,
        storyTitle: `ซื้อ${item.name} 1 แพ็ก มี ${count} ชิ้น ราคา ${packPrice} บาท นำมาขายปลีกชิ้นละ ${sellPrice} บาท`,
        equationText: `${sellPrice} - (${packPrice} ÷ ${count}) = ?`,
        questionPrompt: `ขายได้กำไรชิ้นละกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `ทุนชิ้นละ ${packPrice} ÷ ${count} = ${costPerItem} บาท นำมาขาย ${sellPrice} บาท กำไรชิ้นละ ${correct} บาท`,
      };
    } else if (mixType === 'div_pack_sell_retail') {
      // หารนับจำนวนชิ้น + คูณราคาขาย + ลบต้นทุนแพ็ก
      const count = 10;
      const packCost = pickRandom([50, 60, 70]);
      const sellPerItem = 10;
      const totalRevenue = count * sellPerItem; // 100
      const correct = totalRevenue - packCost;
      const options = shuffle([correct, ...generateDistractors(correct, 10)]);

      return {
        id,
        shopId: 'myshop',
        difficulty,
        storyTitle: `ซื้อ${item.name} 1 โหล (${count} ชิ้น) ราคาทุน ${packCost} บาท นำมาขายชิ้นละ ${sellPerItem} บาท`,
        equationText: `(${count} × ${sellPerItem}) - ${packCost} = ?`,
        questionPrompt: `เมื่อขายหมดจะได้กำไรรวมกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `ขายได้ทั้งหมด ${count} × ${sellPerItem} = ${totalRevenue} บาท หักทุน ${packCost} บาท = กำไร ${correct} บาท`,
      };
    } else if (mixType === 'percent_profit_amount') {
      // ร้อยละกำไร
      const percent = pickRandom([10, 20, 25, 50]);
      const cost = pickRandom([100, 200, 300, 400]);
      const correct = (cost * percent) / 100;
      const options = shuffle([correct, ...generateDistractors(correct, 10)]);

      return {
        id,
        shopId: 'myshop',
        difficulty,
        storyTitle: `ซื้อ${item.name}มาทุน ${cost} บาท ขายต่อได้กำไร ${percent}%`,
        equationText: `${percent}% ของ ${cost} = ?`,
        questionPrompt: `ร้านค้าได้รับเงินกำไรกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `กำไร ${percent}% ของ ${cost} = ${cost} × (${percent}/100) = ${correct} บาท`,
      };
    } else {
      // ร้อยละขาดทุน
      const percent = pickRandom([10, 20, 30]);
      const cost = pickRandom([200, 300, 400]);
      const correct = (cost * percent) / 100;
      const options = shuffle([correct, ...generateDistractors(correct, 10)]);

      return {
        id,
        shopId: 'myshop',
        difficulty,
        storyTitle: `ซื้อ${item.name}มาทุน ${cost} บาท นำมาลดล้างสต็อกยอมขาดทุน ${percent}%`,
        equationText: `${percent}% ของ ${cost} = ?`,
        questionPrompt: `ร้านค้าขาดทุนไปกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `ขาดทุน ${percent}% ของ ${cost} = ${cost} × (${percent}/100) = ${correct} บาท`,
      };
    }
  } else {
    // ระดับ "ยากมาก": โจทย์หลายขั้นตอน ผสมผสานอย่างซับซ้อน
    const hardType = pickRandom([
      'target_selling_price_with_percent',
      'discount_then_find_profit',
      'pack_division_selling_profit',
      'buy_multiple_with_discount',
      'cost_loss_percent_find_sell_price',
      'wholesale_to_retail_profit'
    ]);

    if (hardType === 'target_selling_price_with_percent') {
      // ทุน + กำไรร้อยละ -> ต้องตั้งราคาขายเท่าใด
      const cost = pickRandom([200, 300, 400, 500]);
      const percentProfit = pickRandom([20, 25, 30, 50]);
      const profitAmount = (cost * percentProfit) / 100;
      const correct = cost + profitAmount;
      const options = shuffle([correct, ...generateDistractors(correct, 50)]);

      return {
        id,
        shopId: 'myshop',
        difficulty,
        storyTitle: `ซื้อ${item.name}มาต้นทุน ${cost} บาท ต้องการขายต่อให้ได้กำไร ${percentProfit}%`,
        equationText: `${cost} + (${percentProfit}% ของ ${cost}) = ?`,
        questionPrompt: `ร้านค้าต้องตั้งราคาขายเป็นเงินกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `กำไร ${percentProfit}% = ${profitAmount} บาท ดังนั้นต้องตั้งราคาขาย ${cost} + ${profitAmount} = ${correct} บาท`,
      };
    } else if (hardType === 'discount_then_find_profit') {
      // ติดป้ายราคา - ส่วนลดร้อยละ = ราคาขายจริง แล้วลบต้นทุนเพื่อหากำไร
      const tagPrice = pickRandom([400, 500, 600]);
      const discountPercent = pickRandom([20, 25]);
      const discountAmount = (tagPrice * discountPercent) / 100;
      const actualSell = tagPrice - discountAmount;
      const cost = pickRandom([200, 250]);
      const correct = actualSell - cost;
      const options = shuffle([correct, ...generateDistractors(correct, 20)]);

      return {
        id,
        shopId: 'myshop',
        difficulty,
        storyTitle: `ติดป้ายราคา${item.name}ไว้ ${tagPrice} บ. ลดราคา ${discountPercent}% ถ้าร้านได้ทุนมา ${cost} บ.`,
        equationText: `(${tagPrice} - ส่วนลด) - ${cost} = ?`,
        questionPrompt: `หลังจากลดราคาแล้ว ร้านค้ายังคงได้กำไรกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `ลดราคา ${discountAmount} บ. ขายจริง ${actualSell} บ. หักทุน ${cost} บ. = กำไร ${correct} บาท`,
      };
    } else if (hardType === 'pack_division_selling_profit') {
      // ซื้อสินค้ากล่องใหญ่ แบ่งใส่ถุง แล้วขายเอากำไร
      const totalUnits = pickRandom([40, 50, 60]);
      const unitsPerBag = 5;
      const bagCount = totalUnits / unitsPerBag; // 8, 10, 12
      const packCost = totalUnits === 40 ? 40 : totalUnits === 50 ? 50 : 60; // 1 บ./เม็ด
      const pricePerBag = 10;
      const totalRevenue = bagCount * pricePerBag;
      const correct = totalRevenue - packCost;
      const options = shuffle([correct, ...generateDistractors(correct, 15)]);

      return {
        id,
        shopId: 'myshop',
        difficulty,
        storyTitle: `ซื้อ${item.name}มา ${totalUnits} ชิ้น ทุนรวม ${packCost} บ. แบ่งใส่ซอง ซองละ ${unitsPerBag} ชิ้น ขายซองละ ${pricePerBag} บ.`,
        equationText: `((${totalUnits} ÷ ${unitsPerBag}) × ${pricePerBag}) - ${packCost} = ?`,
        questionPrompt: `เมื่อขายหมดทุกซอง จะได้กำไรรวมกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `แบ่งได้ ${bagCount} ซอง ขายได้เงิน ${bagCount} × ${pricePerBag} = ${totalRevenue} บาท หักทุน ${packCost} บาท = กำไร ${correct} บาท`,
      };
    } else if (hardType === 'buy_multiple_with_discount') {
      // ซื้อสินค้าหลายชิ้น x ราคาชิ้นละ แล้วได้ส่วนลดร้อยละ
      const qty = pickRandom([3, 4, 5]);
      const pricePerItem = 100;
      const totalBefore = qty * pricePerItem;
      const discountPercent = pickRandom([10, 20]);
      const discount = (totalBefore * discountPercent) / 100;
      const correct = totalBefore - discount;
      const options = shuffle([correct, ...generateDistractors(correct, 20)]);

      return {
        id,
        shopId: 'myshop',
        difficulty,
        storyTitle: `ซื้อ${item.name} ${qty} ชิ้น ชิ้นละ ${pricePerItem} บาท ทางร้านจัดโปรลดราคาทันที ${discountPercent}%`,
        equationText: `(${qty} × ${pricePerItem}) - ส่วนลด ${discountPercent}% = ?`,
        questionPrompt: `ลูกค้าต้องจ่ายเงินค่าสินค้าทั้งหมดกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `ยอดรวม ${totalBefore} บาท ลดราคา ${discount} บาท จ่ายจริง ${totalBefore} - ${discount} = ${correct} บาท`,
      };
    } else if (hardType === 'cost_loss_percent_find_sell_price') {
      // ทุน - ขาดทุนร้อยละ -> หาเงินที่ขายไปได้จริง
      const cost = pickRandom([300, 400, 500]);
      const lossPercent = pickRandom([15, 20, 25]);
      const lossAmount = (cost * lossPercent) / 100;
      const correct = cost - lossAmount;
      const options = shuffle([correct, ...generateDistractors(correct, 20)]);

      return {
        id,
        shopId: 'myshop',
        difficulty,
        storyTitle: `ซื้อ${item.name}มาทุน ${cost} บาท นำมาลดราคาเพื่อเคลียร์ของ ขาดทุนไป ${lossPercent}%`,
        equationText: `${cost} - (${lossPercent}% ของ ${cost}) = ?`,
        questionPrompt: `ร้านค้าขาย${item.name}ชิ้นนี้ไปในราคากี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `ขาดทุน ${lossAmount} บาท ดังนั้นขายไปในราคา ${cost} - ${lossAmount} = ${correct} บาท`,
      };
    } else {
      // ขายส่งเป็นกล่อง กล่องละ X ชิ้น ได้กำไรชิ้นละ Y บาท -> หากำไรรวมทั้งกล่อง
      const boxes = randomInt(4, 6);
      const itemsPerBox = 10;
      const profitPerItem = pickRandom([4, 5, 6]);
      const correct = boxes * itemsPerBox * profitPerItem;
      const options = shuffle([correct, ...generateDistractors(correct, 30)]);

      return {
        id,
        shopId: 'myshop',
        difficulty,
        storyTitle: `ขาย${item.name}ได้ ${boxes} ลัง แต่ละลังมี ${itemsPerBox} กล่อง ได้กำไรกล่องละ ${profitPerItem} บาท`,
        equationText: `${boxes} × ${itemsPerBox} × ${profitPerItem} = ?`,
        questionPrompt: `ร้านค้าจะได้รับเงินกำไรทั้งหมดกี่บาท?`,
        options,
        correctAnswer: correct,
        unit: 'บาท',
        explanation: `ขายได้ทั้งหมด ${boxes * itemsPerBox} กล่อง × กำไร ${profitPerItem} บาท = ${correct} บาท`,
      };
    }
  }
}

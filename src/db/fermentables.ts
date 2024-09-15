interface Ingredient {
  name: string;
  sugarContent: number | string;
  waterContent: number | string;
  category:
  | "sugar"
  | "fruit"
  | "other"
  | "water"
  | "juice"
  | "vegetable"
  | "dried fruit";
}

const INGREDIENTS: Ingredient[] = [
  {
    name: "Honey",
    sugarContent: "79.6",
    waterContent: "15.5",
    category: "sugar",
  },
  {
    name: "Table Sugar",
    sugarContent: "99.8",
    waterContent: "0.02",
    category: "sugar",
  },
  {
    name: "Custom Ingredient",
    sugarContent: "0",
    waterContent: "100",
    category: "other",
  },
  {
    name: "Water",
    sugarContent: "0",
    waterContent: "100",
    category: "water",
  },
  {
    name: "Juice",
    sugarContent: "12",
    waterContent: "88",
    category: "juice",
  },
  {
    name: "Apples",
    sugarContent: "11.58",
    waterContent: "84.6",
    category: "fruit",
  },
  {
    name: "Apple Juice",
    sugarContent: "10.3",
    waterContent: "89.7",
    category: "juice",
  },
  {
    name: "Apricot",
    sugarContent: "9.17",
    waterContent: "84.6",
    category: "fruit",
  },
  {
    name: "Banana",
    sugarContent: "13.85",
    waterContent: "74.9",
    category: "fruit",
  },
  {
    name: "Blackberry",
    sugarContent: "7.86",
    waterContent: "82.5",
    category: "fruit",
  },
  {
    name: "Blueberry",
    sugarContent: "9.36",
    waterContent: "84.2",
    category: "fruit",
  },
  {
    name: "Boysenberry",
    sugarContent: "6.23",
    waterContent: "85.9",
    category: "fruit",
  },
  {
    name: "Cantaloupe",
    sugarContent: "7.89",
    waterContent: "90.2",
    category: "fruit",
  },
  {
    name: "Carrot",
    sugarContent: "4.59",
    waterContent: "88.3",
    category: "vegetable",
  },
  {
    name: "Cherry, Sweet",
    sugarContent: "13.63",
    waterContent: "82.2",
    category: "fruit",
  },
  {
    name: "Cherry, Tart",
    sugarContent: "8.2",
    waterContent: "86.1",
    category: "fruit",
  },
  {
    name: "Cranberry",
    sugarContent: "8.44",
    waterContent: "87.3",
    category: "fruit",
  },
  {
    name: "Cranberry Juice",
    sugarContent: "7.26",
    waterContent: "92.3",
    category: "fruit",
  },
  {
    name: "Currant, Black",
    sugarContent: "9.3",
    waterContent: "82",
    category: "fruit",
  },
  {
    name: "Currant, Red",
    sugarContent: "6.69",
    waterContent: "84",
    category: "fruit",
  },
  {
    name: "Dates, Dried",
    sugarContent: "64.7",
    waterContent: "20.9",
    category: "dried fruit",
  },
  {
    name: "Elderberry",
    sugarContent: "6.11",
    waterContent: "79.8",
    category: "fruit",
  },
  {
    name: "Figs",
    sugarContent: "14.05",
    waterContent: "79.1",
    category: "fruit",
  },
  {
    name: "Figs, Dried",
    sugarContent: "47.9",
    waterContent: "30",
    category: "dried fruit",
  },
  {
    name: "Gooseberry",
    sugarContent: "11",
    waterContent: "87.9",
    category: "fruit",
  },
  {
    name: "Grapefruit",
    sugarContent: "6.1",
    waterContent: "90.67",
    category: "fruit",
  },
  {
    name: "Grapefruit Juice",
    sugarContent: "7.59",
    waterContent: "90.1",
    category: "fruit",
  },
  {
    name: "Grapes, Concord",
    sugarContent: "8.89",
    waterContent: "83",
    category: "fruit",
  },
  {
    name: "Grape Juice, Purple",
    sugarContent: "15.6",
    waterContent: "83.7",
    category: "juice",
  },
  {
    name: "Grape Juice, White",
    sugarContent: "15.8",
    waterContent: "83.7",
    category: "juice",
  },
  {
    name: "Guava",
    sugarContent: "7.56",
    waterContent: "80.8",
    category: "fruit",
  },
  {
    name: "Honeydew Melon",
    sugarContent: "8.12",
    waterContent: "89.8",
    category: "fruit",
  },
  {
    name: "Jackfruit",
    sugarContent: "18.75",
    waterContent: "73.5",
    category: "fruit",
  },
  {
    name: "Kiwi",
    sugarContent: "10.9",
    waterContent: "83.9",
    category: "fruit",
  },
  {
    name: "Lemon Juice",
    sugarContent: "1.35",
    waterContent: "90.8",
    category: "juice",
  },
  {
    name: "Lime Juice",
    sugarContent: "1.35",
    waterContent: "90.8",
    category: "juice",
  },
  {
    name: "Lychee",
    sugarContent: "16.1",
    waterContent: "81.8",
    category: "fruit",
  },
  {
    name: "Mango",
    sugarContent: "12.55",
    waterContent: "83.5",
    category: "fruit",
  },
  {
    name: "Maple Syrup",
    sugarContent: "66",
    waterContent: "32.2",
    category: "sugar",
  },
  {
    name: "Mulberry",
    sugarContent: "10.8",
    waterContent: "87.7",
    category: "fruit",
  },
  {
    name: "Nectarine",
    sugarContent: "7.76",
    waterContent: "87.6",
    category: "fruit",
  },
  {
    name: "Onion",
    sugarContent: "5.82",
    waterContent: "90.1",
    category: "vegetable",
  },
  {
    name: "Orange Juice",
    sugarContent: "9.39",
    waterContent: "88.5",
    category: "juice",
  },
  {
    name: "Papaya",
    sugarContent: "7.11",
    waterContent: "88.1",
    category: "fruit",
  },
  {
    name: "Passion  Fruit",
    sugarContent: "11.15",
    waterContent: "72.9",
    category: "fruit",
  },
  {
    name: "Peaches",
    sugarContent: "8.53",
    waterContent: "88.3",
    category: "fruit",
  },
  {
    name: "Pear",
    sugarContent: "9.15",
    waterContent: "85.43",
    category: "fruit",
  },
  {
    name: "Persimmon",
    sugarContent: "13.25",
    waterContent: "80.3",
    category: "fruit",
  },
  {
    name: "Pineapple",
    sugarContent: "10.39",
    waterContent: "86",
    category: "fruit",
  },
  {
    name: "Plum",
    sugarContent: "9.86",
    waterContent: "87.2",
    category: "fruit",
  },
  {
    name: "Pomegranate",
    sugarContent: "12.6",
    waterContent: "77.9",
    category: "fruit",
  },
  {
    name: "Prickly Pear",
    sugarContent: "11",
    waterContent: "87.6",
    category: "fruit",
  },
  {
    name: "Prunes",
    sugarContent: "41.05",
    waterContent: "30.9",
    category: "dried fruit",
  },
  {
    name: "Raisins",
    sugarContent: "68.35",
    waterContent: "16.6",
    category: "dried fruit",
  },
  {
    name: "Raspberry",
    sugarContent: "4.98",
    waterContent: "85.8",
    category: "fruit",
  },
  {
    name: "Rhubarb",
    sugarContent: "1.03",
    waterContent: "93.6",
    category: "vegetable",
  },
  {
    name: "Strawberry",
    sugarContent: "5.45",
    waterContent: "91",
    category: "fruit",
  },
  {
    name: "Tangerine",
    sugarContent: "8.58",
    waterContent: "85.2",
    category: "fruit",
  },
  {
    name: "Tomato",
    sugarContent: "2.7",
    waterContent: "94.33",
    category: "vegetable",
  },
  {
    name: "Tomato Juice",
    sugarContent: "4.32",
    waterContent: "93.4",
    category: "juice",
  },
  {
    name: "Jalapeño",
    sugarContent: "4.12",
    waterContent: "91.7",
    category: "vegetable",
  },
];

export default INGREDIENTS;

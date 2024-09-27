import Database from "tauri-plugin-sql-api";
import INGREDIENTS from "./fermentables.js";
import YEASTS from "./yeast.js";

const db = await Database.load("sqlite:meadtools.db");

export const checkTables = async () => await db.execute("SELECT * FROM yeasts;");


async function dropTables() {
  try {
    console.log("Starting drop tables");
    await db.execute(`
    DROP TABLE IF EXISTS ingredients;
    DROP TABLE IF EXISTS recipe_links;
    DROP TABLE IF EXISTS yeasts;`);

    console.log("Tables dropped");
  } catch (error) {
    console.error("Error while dropping tables");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Creating tables...");
    await db.execute(`
    CREATE TABLE ingredients (
      id INTEGER PRIMARY KEY,
      name varchar(255) NOT NULL,
      sugar_content numeric NOT NULL,
      water_content numeric NOT NULL,
      category varchar(255) NOT NULL
    );

    CREATE TABLE yeasts (
      id INTEGER PRIMARY KEY,
      brand varchar(255) NOT NULL,
      name varchar(255) NOT NULL,
      nitrogen_requirement varchar(255) NOT NULL,
      tolerance numeric NOT NULL,
      low_temp numeric NOT NULL,
      high_temp numeric NOT NULL
    );

    CREATE TABLE recipe_links (
      id INTEGER PRIMARY KEY,
      name varchar(255) NOT NULL,
      file_path varchar(255) NOT NULL,
      hydrometer_data_path varchar(255)
    );

    `);
    console.log("Tables created");
  } catch (error) {
    console.error("Error while creating tables");
    throw error;
  }
}

export interface Yeast {
  brand: string;
  name: string;
  nitrogenRequirement: string;
  tolerance: number | string;
  lowTemp: number;
  highTemp: number;
}
interface Ingredient {
  name: string;
  sugarContent: number | string;
  waterContent: number | string;
  category: string;
}

export async function createYeast({
  brand,
  name,
  nitrogenRequirement,
  tolerance,
  lowTemp,
  highTemp,
}: Yeast) {
  try {
    const yeast = await db.execute(
      `
      INSERT INTO yeasts (brand, name, nitrogen_requirement, tolerance, low_temp, high_temp)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `,
      [brand, name, nitrogenRequirement, tolerance, lowTemp, highTemp]
    );
    return yeast;
  } catch (error) {
    throw error;
  }
}
export async function createIngredient({
  name,
  sugarContent,
  waterContent,
  category,
}: Ingredient) {
  try {
    const ingredient
      = await db.execute(
        `
      INSERT INTO ingredients (name, sugar_content, water_content, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
        [name, sugarContent, waterContent, category]
      );
    return ingredient;
  } catch (error) {
    throw error;
  }
}

export async function createRecipeLink(name: string, file_path: string, hydrometer_data_path: string | null = null) {
  try {
    const recipe = await db.execute(
      `
      INSERT INTO recipe_links (name, file_path, hydrometer_data_path)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [name, file_path, hydrometer_data_path]
    );
    return recipe;
  } catch (error) {
    throw error;
  }
}

async function createInitialIngredients() {
  try {
    console.log("Creating initial ingredients...");
    INGREDIENTS.forEach(async (ingredient) => {
      await createIngredient(ingredient);
    });
    console.log("Initial ingredients created");
  } catch (error) {
    console.error("Error while creating initial ingredients");
    throw error;
  }
}


async function createInitialYeasts() {
  try {
    for (const [key, value] of Object.entries(YEASTS)) {
      await Promise.all(
        value.map(async (yeast: Yeast) => {
          const createdYeast = await createYeast({ ...yeast, brand: key });
          return createdYeast;
        })
      );
    }
    console.log("Initial Yeasts Created");
  } catch (error) {
    console.error("Error while creating initial yeasts");
    throw error;
  }
}



export async function updateIngredient(id: string, fields = {}) {
  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  );
  try {
    const ingredient = await db.execute(
      `
    UPDATE ingredients
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
  `,
      Object.values(fields)
    );

    return ingredient;
  } catch (error) {
    throw error;
  }
}

export async function getAllIngredients(): Promise<any[]> {
  try {
    const ingredients = await db.select(`
      SELECT * FROM ingredients;
    `);
    return ingredients as any[];
  } catch (error) {
    return []
  }
}

export async function getAllRecipes(): Promise<any[]> {
  try {
    const recipes = await db.select(`
      SELECT * FROM recipe_links;
    `);
    return recipes as [];
  } catch (error) {
    return []
  }
}

export async function getRecipe(name: string) {
  try {
    const recipe
      = await db.select(`
      SELECT * FROM recipe_links WHERE name=${name};
    `);
    if (!recipe)
      throw {
        name: "RecipeNotFoundError",
        message: "Recipe not found",
      };
    return recipe;
  } catch (error) {
    throw error;
  }
}
export async function getRecipeById(id: string): Promise<any> {
  try {
    const recipe
      = await db.select(`
      SELECT * FROM recipe_links WHERE id=${id};
    `);
    if (!recipe)
      throw {
        id: "RecipeNotFoundError",
        message: "Recipe not found",
      };
    return recipe;
  } catch (error) {
    throw error;
  }
}


export async function getIngredient(id: string) {
  try {
    const ingredient
      = await db.select(`
      SELECT * FROM ingredients WHERE id=${id};
    `);
    if (!ingredient)
      throw {
        name: "IngredientNotFoundError",
        message: "Ingredient not found",
      };
    return (ingredient as any[])[0];
  } catch (error) {
    throw error;
  }
}

export async function getIngredientsByCategory(cat: string) {
  try {
    const ingredients = await db.select(
      `
     SELECT * FROM ingredients
      WHERE category=$1;
    `,
      [cat]
    );
    if (!ingredients)
      throw {
        name: "IngredientsNotFoundError",
        message: "Ingredients not found",
      };
    return ingredients;
  } catch (error) {
    throw error;
  }
}

export async function getIngredientByName(name: string) {
  try {
    const ingredient
      = await db.select(
        `
      SELECT * FROM ingredients WHERE name=$1;
    `,
        [name]
      );
    if (!ingredient)
      throw {
        name: "IngredientNotFoundError",
        message: "Ingredient not found",
      };
    return ingredient;
  } catch (error) {
    throw error;
  }
}

export async function deleteIngredient(id: string) {
  try {
    const ingredient = await db.execute(
      `
      DELETE FROM ingredients
      WHERE id=$1
      RETURNING *;
    `,
      [id]
    );
    return ingredient;
  } catch (error) {
    throw error;
  }
}

export async function updateYeast(id: string, fields = {}) {
  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  );
  try {
    const yeast
      = await db.execute(
        `
    UPDATE yeasts
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
  `,
        Object.values(fields)
      );

    return yeast;
  } catch (error) {
    throw error;
  }
}

export async function updateRecipe(id: string, { file_path, hydrometer_data_path }: {
  file_path: string;
  hydrometer_data_path: string | null
}) {

  try {
    const recipe
      = await db.execute(
        `
    UPDATE recipe_links
    SET file_path=$1, hydrometer_data_path=$2
    WHERE id=$3
    RETURNING *;
  `,
        [file_path, hydrometer_data_path, id]
      );

    return recipe;
  } catch (error) {
    throw error;
  }
}

export async function updateHydro(id: string, { hydrometer_data_path }: {
  hydrometer_data_path: string | null
}) {

  try {
    const recipe
      = await db.execute(
        `
    UPDATE recipe_links
    SET hydrometer_data_path=$1
    WHERE id=$2
    RETURNING *;
  `,
        [hydrometer_data_path, id]
      );

    return recipe;
  } catch (error) {
    throw error;
  }
}


export async function getAllYeasts(): Promise<Yeast[]> {
  try {
    const yeasts = await db.select(`
      SELECT * FROM yeasts;
    `);
    return yeasts as Yeast[];
  } catch (error) {
    return [];
  }
}

export async function getYeastByName(name: string) {
  try {
    const yeast
      = await db.select(
        `
      SELECT * FROM yeasts WHERE name=$1;
    `,
        [name]
      );
    if (!yeast)
      throw {
        name: "YeastNotFoundError",
        message: "Yeast not found",
      };
    return yeast;
  } catch (error) {
    throw error;
  }
}


export async function getYeastById(id: string) {
  try {
    const yeast = await db.select(
      `
      SELECT * FROM yeasts WHERE id=$1;
    `,
      [id]
    );
    if (!yeast)
      throw {
        name: "YeastNotFoundError",
        message: "Yeast not found",
      };
    return (yeast as any[])[0];
  } catch (error) {
    throw error;
  }
}


export async function getYeastByBrand(brand: string) {
  try {
    const yeasts = await db.select(
      `
      SELECT * FROM yeasts WHERE brand=$1;
    `,
      [brand]
    );
    if (!yeasts)
      throw {
        name: "YeastsNotFoundError",
        message: "Yeasts not found",
      };
    return yeasts;
  } catch (error) {
    throw error;
  }
}
export async function deleteYeast(id: string) {
  try {
    const yeast = await db.execute(
      `
      DELETE FROM yeasts
      WHERE id=$1
      RETURNING *;
    `,
      [id]
    );
    return yeast;
  } catch (error) {
    throw error;
  }
}
export async function deleteRecipe(id: string) {
  try {
    const recipe = await db.execute(
      `
      DELETE FROM recipe_links
      WHERE id=$1
      RETURNING *;
    `,
      [id]
    );
    return recipe;
  } catch (error) {
    throw error;
  }
}


async function rebuildDB() {
  try {
    await dropTables();
    await createTables();
    await createInitialIngredients();
    await createInitialYeasts();
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export const seedDb = async () => {
  const yeasts = await db.select('SELECT * FROM yeasts;').then((yeasts) => yeasts).catch(() => []);
  const ingredients = await db.select('SELECT * FROM ingredients;').then((ing) => ing).catch(() => []);

  const dbSeeded = !!((yeasts as []).length || (ingredients as []).length);

  if (!dbSeeded) {
    await rebuildDB();
  }
}

export const resetYeasts = async () => {
  await db.execute(`DROP TABLE IF EXISTS yeasts;`);
  await db.execute(`
    CREATE TABLE yeasts (
      id INTEGER PRIMARY KEY,
      brand varchar(255) NOT NULL,
      name varchar(255) NOT NULL,
      nitrogen_requirement varchar(255) NOT NULL,
      tolerance numeric NOT NULL,
      low_temp numeric NOT NULL,
      high_temp numeric NOT NULL
    );
    `);
  await createInitialYeasts();
  console.log('Yeasts reset');
}
export const resetIngredients = async () => {
  await db.execute(`DROP TABLE IF EXISTS ingredients;`);
  await db.execute(`
     CREATE TABLE ingredients (
      id INTEGER PRIMARY KEY,
      name varchar(255) NOT NULL,
      sugar_content numeric NOT NULL,
      water_content numeric NOT NULL,
      category varchar(255) NOT NULL
    );
    `);
  await createInitialIngredients();
  console.log('Ingredients reset');
}
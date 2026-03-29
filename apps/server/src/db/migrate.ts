import "dotenv/config"
import { query } from "@/config/db"
import fs from "fs"
import path from "path"

async function ensureMigrationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE,
      run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)
}

async function getExecutedMigrations() {
  const res = await query(`SELECT name FROM migrations`)
  return res.rows.map((row: any) => row.name)
}

async function runMigrations() {
  const migrationsPath = path.join(process.cwd(), "src/db/migrations")

  const files = fs.readdirSync(migrationsPath).sort()

  const executed = await getExecutedMigrations()

  for (const file of files) {
    if (executed.includes(file)) {
      console.log(`Skipping: ${file}`)
      continue
    }

    const filePath = path.join(migrationsPath, file)
    const sql = fs.readFileSync(filePath, "utf-8")

    console.log(`Running: ${file}`)

    try {
      await query("BEGIN")
      await query(sql)
      await query(`INSERT INTO migrations (name) VALUES ($1)`, [file])
      await query("COMMIT")

      console.log(`Done: ${file}`)
    } catch (err) {
      await query("ROLLBACK")
      console.error(`Failed: ${file}`, err)
      process.exit(1)
    }
  }

  console.log("All migrations completed ✅")
  process.exit(0)
}

async function main() {
  await ensureMigrationsTable()
  await runMigrations()
}

main()

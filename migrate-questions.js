import { neon } from '@neondatabase/serverless';

// This script migrates questions from dev to production database
async function migrateQuestions() {
  // You'll need to replace these with your actual database URLs
  const devDbUrl = process.env.DEV_DATABASE_URL || process.env.DATABASE_URL;
  const prodDbUrl = process.env.PROD_DATABASE_URL;

  if (!devDbUrl || !prodDbUrl) {
    console.error('Please set DEV_DATABASE_URL and PROD_DATABASE_URL environment variables');
    process.exit(1);
  }

  const devDb = neon(devDbUrl);
  const prodDb = neon(prodDbUrl);

  try {
    console.log('Fetching questions from development database...');
    const questions = await devDb('SELECT * FROM questions ORDER BY text');
    console.log(`Found ${questions.length} questions in development database`);

    if (questions.length === 0) {
      console.log('No questions to migrate');
      return;
    }

    // Clear existing questions in production (optional)
    console.log('Clearing existing questions from production database...');
    await prodDb('DELETE FROM questions');

    // Insert questions into production
    console.log('Inserting questions into production database...');
    for (const question of questions) {
      await prodDb(`
        INSERT INTO questions (id, text, options, "correctAnswer", difficulties, category)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        question.id,
        question.text,
        question.options,
        question.correctAnswer,
        question.difficulties,
        question.category
      ]);
    }

    console.log(`Successfully migrated ${questions.length} questions to production database`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateQuestions();
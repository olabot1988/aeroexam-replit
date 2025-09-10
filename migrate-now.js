import { neon } from '@neondatabase/serverless';

async function migrateQuestions() {
  const devDbUrl = process.env.DATABASE_URL;
  
  // You'll need to replace this with your actual production database URL
  // Get this from your Replit deployment "Published app secrets" section
  const prodDbUrl = process.env.PROD_DB_URL || 'REPLACE_WITH_YOUR_PRODUCTION_DATABASE_URL';

  if (prodDbUrl === 'REPLACE_WITH_YOUR_PRODUCTION_DATABASE_URL') {
    console.log('❌ Please set your production database URL');
    console.log('1. Go to Publishing → Published app secrets');
    console.log('2. Find your DATABASE_URL (this is your production URL)');
    console.log('3. Run: PROD_DB_URL="your_production_url" node migrate-now.js');
    return;
  }

  const devDb = neon(devDbUrl);
  const prodDb = neon(prodDbUrl);

  try {
    console.log('🔍 Getting questions from development...');
    const questions = await devDb('SELECT * FROM questions ORDER BY category, text');
    console.log(`✅ Found ${questions.length} questions to migrate`);

    console.log('🔍 Checking production database...');
    const prodCount = await prodDb('SELECT COUNT(*) as count FROM questions');
    console.log(`Current production questions: ${prodCount[0].count}`);

    console.log('🗑️ Clearing production database...');
    await prodDb('DELETE FROM questions');

    console.log('📥 Copying questions to production...');
    for (const q of questions) {
      await prodDb(`
        INSERT INTO questions (id, text, options, "correctAnswer", difficulties, category)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [q.id, q.text, q.options, q.correctAnswer, q.difficulties, q.category]);
    }

    console.log('✅ Migration complete!');
    console.log(`📊 Copied ${questions.length} questions`);
    console.log(`🏷️ Categories: ${[...new Set(questions.map(q => q.category))].slice(0, 5).join(', ')}...`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

migrateQuestions();
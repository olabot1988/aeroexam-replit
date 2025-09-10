import { neon } from '@neondatabase/serverless';

async function copyQuestionsToProduction() {
  // Get database URLs from environment
  const devDbUrl = process.env.DATABASE_URL; // Current development DB
  const prodDbUrl = process.env.PRODUCTION_DATABASE_URL; // You'll set this

  if (!prodDbUrl) {
    console.error('Please set PRODUCTION_DATABASE_URL environment variable');
    process.exit(1);
  }

  const devDb = neon(devDbUrl);
  const prodDb = neon(prodDbUrl);

  try {
    console.log('🔍 Fetching questions from development database...');
    const questions = await devDb('SELECT * FROM questions ORDER BY category, text');
    console.log(`✅ Found ${questions.length} questions in development database`);

    if (questions.length === 0) {
      console.log('❌ No questions found to migrate');
      return;
    }

    // Show a sample of what we're migrating
    console.log('\n📋 Sample questions to migrate:');
    questions.slice(0, 3).forEach((q, i) => {
      console.log(`${i + 1}. [${q.category}] ${q.text.substring(0, 60)}...`);
    });

    // Check current production database
    console.log('\n🔍 Checking production database...');
    const existingQuestions = await prodDb('SELECT COUNT(*) as count FROM questions');
    console.log(`Current production questions: ${existingQuestions[0].count}`);

    // Ask for confirmation (you'll see this in the console)
    console.log(`\n⚠️  This will replace ${existingQuestions[0].count} production questions with ${questions.length} development questions`);

    // Clear existing questions in production
    console.log('🗑️  Clearing existing questions from production...');
    await prodDb('DELETE FROM questions');

    // Insert questions into production
    console.log('📥 Inserting questions into production database...');
    let successCount = 0;
    
    for (const question of questions) {
      try {
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
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to insert question: ${question.text.substring(0, 50)}...`);
        console.error(`Error: ${error.message}`);
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`✅ Successfully migrated ${successCount}/${questions.length} questions`);
    console.log(`📊 Categories migrated: ${[...new Set(questions.map(q => q.category))].join(', ')}`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
copyQuestionsToProduction();
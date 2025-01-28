export async function up(knex) {
    await knex.schema.createTable('activity_logs', (table) => {
      table.increments('id').primary();
      table.string('action', 255).notNullable();
      table.string('module', 255).notNullable();
      table.timestamp('timestamp').defaultTo(knex.fn.now());
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    });
  }
  
  export async function down(knex) {
    await knex.schema.dropTable('activity_logs');
  }
  
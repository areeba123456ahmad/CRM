export async function up(knex) {
    await knex.schema.createTable('connections', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.text('details').nullable();
      table.enum('status', ['Active', 'Inactive']).notNullable();
      table.timestamp('last_updated').defaultTo(knex.fn.now());
    });
  }
  
  export async function down(knex) {
    await knex.schema.dropTable('connections');
  }
  
export async function up(knex) {
    await knex.schema.createTable('salesdetails', (table) => {
      table.increments('id').primary(); // Primary key
      table.integer('sales_id').unsigned().references('id').inTable('sales').onDelete('CASCADE'); // Foreign key to the sales table
      table.string('product_name', 255).notNullable(); // Name of the product sold
      table.integer('quantity').notNullable(); // Quantity of product sold
      table.decimal('price_per_unit', 10, 2).notNullable(); // Price per unit of product
      table.decimal('total_amount', 10, 2).notNullable(); // Total amount for the sale (quantity * price_per_unit)
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp when the record was created
      table.timestamp('updated_at').defaultTo(knex.fn.now()); // Timestamp when the record was last updated
    });
  }
  
  export async function down(knex) {
    await knex.schema.dropTable('salesdetails');
  }
  
export async function up(knex) {
  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary(); // Primary key for the order
    table.integer('sale_id').nullable(); // Optional sale reference ID
    table.enum('status', ['Pending', 'Shipped', 'In-Transit', 'Delivered']).notNullable(); // Order status with more options
    table.date('delivery_date').nullable(); // Delivery date for shipped orders
    table.string('tracking_number', 255).nullable(); // Tracking number for shipped orders
    table.text('tracking_info').nullable(); // Additional information about the tracking status
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Created timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Last updated timestamp
  });
}

export async function down(knex) {
  await knex.schema.dropTable('orders'); // Drop the orders table on rollback
}

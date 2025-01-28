export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('salesdetails').del();

  // Inserts seed entries
  await knex('salesdetails').insert([
    {
      sales_id: 24, // Matches `id` in sales table
      product_name: 'Smartphone',
      quantity: 2,
      price_per_unit: 500.00,
      total_amount: 1000.00,
    },
    {
      sales_id: 25, // Matches `id` in sales table
      product_name: 'Headphones',
      quantity: 1,
      price_per_unit: 100.00,
      total_amount: 100.00,
    },
    {
      sales_id: 25, // Matches `id` in sales table
      product_name: 'Laptop',
      quantity: 1,
      price_per_unit: 1200.00,
      total_amount: 1200.00,
    },
    {
      sales_id: 26, // Matches `id` in sales table
      product_name: 'Tablet',
      quantity: 3,
      price_per_unit: 300.00,
      total_amount: 900.00,
    },
  ]);
}

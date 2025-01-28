export async function seed(knex) {
  await knex('sales').del();
  await knex('sales').insert([
    { agent_id: 4, customer_name: 'Customer A', product: 'Product X', status: 'Pending' },
    { agent_id: 5, customer_name: 'Customer B', product: 'Product Y', status: 'Confirmed' },
    { agent_id: 4, customer_name: 'Customer C', product: 'Product Z', status: 'Delivered' },
  ]);
}

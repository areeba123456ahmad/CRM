// `seeds/01_agent_performance.js`

export async function seed(knex) {
  await knex('agent_performance').del(); // Clears existing data

  await knex('agent_performance').insert([
      { agent_id: 4, total_sales: 100, sales_target: 150, fulfillment_rate: 67.5, pending_tasks: 5, performance_date: knex.fn.now(), created_at: knex.fn.now(), updated_at: knex.fn.now() },
      { agent_id: 5, total_sales: 200, sales_target: 180, fulfillment_rate: 111.1, pending_tasks: 2, performance_date: knex.fn.now(), created_at: knex.fn.now(), updated_at: knex.fn.now() },
      { agent_id: 4, total_sales: 50, sales_target: 100, fulfillment_rate: 50, pending_tasks: 10, performance_date: knex.fn.now(), created_at: knex.fn.now(), updated_at: knex.fn.now() }
  ]);
}

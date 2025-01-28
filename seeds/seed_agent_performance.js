export async function seed(knex) {
  await knex('agent_performance').del(); // Clear existing data

  await knex('agent_performance').insert([
    {
      agent_id: 1,
      total_sales: 50,
      sales_target: 100,
      fulfillment_rate: 50.0,
      pending_tasks: 5,
      performance_date: new Date(),
    },
    {
      agent_id: 2,
      total_sales: 30,
      sales_target: 80,
      fulfillment_rate: 37.5,
      pending_tasks: 10,
      performance_date: new Date(),
    },
  ]);
}

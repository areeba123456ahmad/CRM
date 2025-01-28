export function seed(knex) {
  // Deletes ALL existing entries
  return knex('userOrders').del()
      .then(() => {
          // Inserts seed entries
          return knex('userOrders').insert([
              {
                  customer_name: 'Alice Johnson',
                  item_id: 1, // Laptop
                  quantity: 2,
                  agent_id: 1, // John Doe
                  order_date: '2025-01-20',
                  tracking_id: 'TRK001'
              },
              {
                  customer_name: 'Bob Miller',
                  item_id: 2, // Smartphone
                  quantity: 1,
                  agent_id: 2, // Jane Smith
                  order_date: '2025-01-21',
                  tracking_id: 'TRK002'
              },
              {
                  customer_name: 'Catherine Lee',
                  item_id: 3, // Headphones
                  quantity: 5,
                  agent_id: 3, // Sam Wilson
                  order_date: '2025-01-22',
                  tracking_id: 'TRK003'
              }
          ]);
      });
}

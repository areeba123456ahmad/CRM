export function seed(knex) {
  // Deletes ALL existing entries
  return knex('items').del()
      .then(() => {
          // Inserts seed entries
          return knex('items').insert([
              { item_description: 'Coffee', price: 300.00 },
              { item_description: 'Tea', price: 100.00 },
              { item_description: 'Chocolate Shake', price: 400.00 },
              { item_description: 'Caramel latte', price: 500.00 }
          ]);
      });
}

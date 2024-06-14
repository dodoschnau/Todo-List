'use strict';

const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    let transaction

    try {
      transaction = await queryInterface.sequelize.transaction()

      const hash = await bcrypt.hash('password', 10)

      // Select Exist Users
      const existingUsers = await queryInterface.sequelize.query(
        'SELECT * FROM Users;',
        { type: Sequelize.QueryTypes.SELECT, transaction }
      )

      // Hash Exist Users' Password
      for (const user of existingUsers) {
        if (!user.password.startsWith('$2a$')) {
          const hashedPassword = await bcrypt.hash(user.password, 10)
          await queryInterface.bulkUpdate('Users',
            { password: hashedPassword },
            { id: user.id },
            { transaction }
          )
        }
      }

      await queryInterface.bulkInsert('Users', [
        {
          id: 40,
          email: 'user1@example.com',
          password: hash,
          name: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
        { transaction }
      )

      await queryInterface.bulkInsert('Todos',
        Array.from({ length: 10 }).map((_, i) =>
        ({
          name: `todo-${i}`,
          userId: 40,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ),
        { transaction }
      )
      await transaction.commit()
    } catch (error) {
      console.error('Error in seeding:', error);
      if (transaction) await transaction.rollback()
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
};

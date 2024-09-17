'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Users', [
            {
                username: 'hoafn0730',
                email: 'hoafn0730@example.com',
                password: '123456',
                firstName: 'Hoàn',
                lastName: 'Trần',
                fullName: 'Hoàn Trần',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};

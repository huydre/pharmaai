import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePharmacyMedicineEntities1696516800000 implements MigrationInterface {
  name = 'CreatePharmacyMedicineEntities1696516800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create medicines table
    await queryRunner.query(`
      CREATE TABLE \`medicines\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(100) NOT NULL,
        \`description\` text NULL,
        \`usage\` varchar(255) NULL,
        \`sideEffects\` text NULL,
        \`price\` decimal(10,2) NOT NULL,
        \`relatedDisease\` varchar(100) NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Create pharmacies table
    await queryRunner.query(`
      CREATE TABLE \`pharmacies\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(150) NOT NULL,
        \`address\` varchar(255) NULL,
        \`latitude\` decimal(10,7) NOT NULL,
        \`longitude\` decimal(10,7) NOT NULL,
        \`rating\` float NOT NULL,
        \`phone\` varchar(20) NULL,
        \`googlePlaceId\` varchar(100) NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Create pharmacy_medicines junction table
    await queryRunner.query(`
      CREATE TABLE \`pharmacy_medicines\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`pharmacyId\` int NOT NULL,
        \`medicineId\` int NOT NULL,
        \`stock\` int NOT NULL DEFAULT '0',
        \`priceOverride\` decimal(10,2) NULL,
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_pharmacy_medicines_pharmacyId\` (\`pharmacyId\`),
        INDEX \`IDX_pharmacy_medicines_medicineId\` (\`medicineId\`),
        UNIQUE INDEX \`IDX_pharmacy_medicine_unique\` (\`pharmacyId\`, \`medicineId\`)
      ) ENGINE=InnoDB
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE \`pharmacy_medicines\` 
      ADD CONSTRAINT \`FK_pharmacy_medicines_pharmacyId\` 
      FOREIGN KEY (\`pharmacyId\`) REFERENCES \`pharmacies\`(\`id\`) 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`pharmacy_medicines\` 
      ADD CONSTRAINT \`FK_pharmacy_medicines_medicineId\` 
      FOREIGN KEY (\`medicineId\`) REFERENCES \`medicines\`(\`id\`) 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Add indexes for better performance
    await queryRunner.query(`
      CREATE INDEX \`IDX_medicines_name\` ON \`medicines\` (\`name\`)
    `);

    await queryRunner.query(`
      CREATE INDEX \`IDX_medicines_relatedDisease\` ON \`medicines\` (\`relatedDisease\`)
    `);

    await queryRunner.query(`
      CREATE INDEX \`IDX_pharmacies_name\` ON \`pharmacies\` (\`name\`)
    `);

    await queryRunner.query(`
      CREATE INDEX \`IDX_pharmacies_location\` ON \`pharmacies\` (\`latitude\`, \`longitude\`)
    `);

    await queryRunner.query(`
      CREATE INDEX \`IDX_pharmacies_rating\` ON \`pharmacies\` (\`rating\`)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints first
    await queryRunner.query(`
      ALTER TABLE \`pharmacy_medicines\` 
      DROP FOREIGN KEY \`FK_pharmacy_medicines_medicineId\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`pharmacy_medicines\` 
      DROP FOREIGN KEY \`FK_pharmacy_medicines_pharmacyId\`
    `);

    // Drop indexes
    await queryRunner.query(`DROP INDEX \`IDX_pharmacies_rating\` ON \`pharmacies\``);
    await queryRunner.query(`DROP INDEX \`IDX_pharmacies_location\` ON \`pharmacies\``);
    await queryRunner.query(`DROP INDEX \`IDX_pharmacies_name\` ON \`pharmacies\``);
    await queryRunner.query(`DROP INDEX \`IDX_medicines_relatedDisease\` ON \`medicines\``);
    await queryRunner.query(`DROP INDEX \`IDX_medicines_name\` ON \`medicines\``);

    // Drop tables
    await queryRunner.query(`DROP TABLE \`pharmacy_medicines\``);
    await queryRunner.query(`DROP TABLE \`pharmacies\``);
    await queryRunner.query(`DROP TABLE \`medicines\``);
  }
}
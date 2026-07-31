#!/bin/bash
set -e

# АНХААРУУЛГА / NOTE:
# Энэхүү скрипт (/docker-entrypoint-initdb.d/init-databases.sh) нь PostgreSQL container анх асах үед,
# зөвхөн өгөгдлийн сангийн volume нь ХООСОН байх үеийн анхны initialization (анхдагч тохиргоо) дээр ажиллана.
# Хэрэв volume дээр өмнө нь өгөгдөл үүссэн байвал энэ скрипт ажиллахгүй.

echo "Initializing multi-database setup..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE auth_db;
  CREATE DATABASE profile_db;
  CREATE DATABASE organisation_db;
  CREATE DATABASE verification_db;
  CREATE DATABASE competency_db;
  CREATE DATABASE assessment_db;
  CREATE DATABASE commerce_db;
  CREATE DATABASE execution_db;
  CREATE DATABASE evaluation_db;
  CREATE DATABASE learning_db;
  CREATE DATABASE ai_db;
  CREATE DATABASE integration_db;
  CREATE DATABASE file_db;
  CREATE DATABASE reporting_db;
  CREATE DATABASE platform_db;
EOSQL

echo "All databases initialized successfully."

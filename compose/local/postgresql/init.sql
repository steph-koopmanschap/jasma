-- Check if the version file exists
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'jasma') THEN
    -- The database should only be created on the first run / build of postgresql.
    -- Create the jasma database
    CREATE DATABASE jasma
        WITH
        OWNER = postgres
        TEMPLATE = template0
        ENCODING = 'UTF8'
        LC_COLLATE = 'C'
        LC_CTYPE = 'C'
        TABLESPACE = pg_default
        CONNECTION LIMIT = -1
        IS_TEMPLATE = False;

    COMMENT ON DATABASE jasma
        IS 'Primary PS-SQL Database of JASMA';

    -- Connect to the jasma database
    \c jasma;

    -- Create the app schema
    CREATE SCHEMA app;

    -- Create the analytics schema
    CREATE SCHEMA analytics;

    -- Create the version file indicating the initialization is done
    CREATE TABLE IF NOT EXISTS init_version (version INT);
    INSERT INTO init_version (version) VALUES (1);
  END IF;
END $$;

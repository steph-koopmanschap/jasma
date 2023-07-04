-- Check if the version file exists
DO $$ 
BEGIN 
  -- Checks if there is a database named 'jasma_app'.
  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'jasma_app') THEN
    -- The databases should only be created on the first run / build of postgresql.
    -- Create the jasma application database
    CREATE DATABASE jasma_app
        WITH
        OWNER = postgres
        TEMPLATE = template0
        ENCODING = 'UTF8'
        LC_COLLATE = 'C'
        LC_CTYPE = 'C'
        TABLESPACE = pg_default
        CONNECTION LIMIT = -1
        IS_TEMPLATE = False;

    COMMENT ON DATABASE jasma_app
        IS 'Primary PS-SQL Application database of JASMA';

    -- Create the jasma analytics database
    CREATE DATABASE jasma_analytics
        WITH
        OWNER = postgres
        TEMPLATE = template0
        ENCODING = 'UTF8'
        LC_COLLATE = 'C'
        LC_CTYPE = 'C'
        TABLESPACE = pg_default
        CONNECTION LIMIT = -1
        IS_TEMPLATE = False;

    COMMENT ON DATABASE jasma_app
        IS 'Primary PS-SQL analytics database of JASMA';

    -- Connect to the jasma database
    \c jasma_app;

    -- Create the app schema
    -- CREATE SCHEMA app;

    -- Create the version file indicating the initialization is done
    CREATE TABLE IF NOT EXISTS init_version (version INT);
    INSERT INTO init_version (version) VALUES (1);
  END IF;
END $$;

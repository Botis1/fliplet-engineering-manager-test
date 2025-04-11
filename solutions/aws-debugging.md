# AWS Debugging Task

## 🔍 Problem

Error during Postgres upgrade.

## 🛠️ Resolution Plan

Step 1: Let's check the extension. For this we need to log into the Aurora install. Then I will use this SELECT command:
SELECT extname, extversion FROM pg_extension;
If this doesn’t get the information I am looking for, I will widen the search with a _ wildcard and do:
SELECT _ FROM pg_extension From the SELECT statement,
we are looking for a list of extensions.

Step 2: We can try checking the available extension versions in the SQL CLI with this SELECT command: SELECT \* FROM pg_available_extension_versions WHERE name = 'some_extension'; With 'some_extension' being what was referenced in the error output.

Step 3: If Step 2 has not returned results, let's try checking each extension in the list to see which is not compatible with version v14 in the AWS documentation. However, before you do this, we should verify whether this is AWS Aurora Serverless v1 or v2. This will also help to narrow down the issue. Historically, v1 has had less support for extensions.
Worth noting: as this is Aurora Serverless and not the fully provisioned Aurora alternative, there will be some troubleshooting steps that we can’t perform due to the nature of the solution and the fact that AWS manages the infrastructure. With that in mind, the best strategy we can take is to drop or recreate extensions that are not compatible with v14. Alternatively, if that is not possible, a decision can be made to delay the upgrade until AWS supports it.

Step 4: We can ALTER the extensions with this command:
ALTER EXTENSION some_extension UPDATE;
Or we can drop them with this command:
DROP EXTENSION some_extension;
If we have dropped it, we can create/install it with this command:
CREATE EXTENSION some_extension VERSION '1.4';

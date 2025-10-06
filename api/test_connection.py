import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        database="postgres",
        user="Senanu",
        password="Senanu12",
        port="5432"
    )
    print("✅ Database connection SUCCESSFUL!")
    conn.close()
except Exception as e:
    print(f"❌ Connection failed: {e}")

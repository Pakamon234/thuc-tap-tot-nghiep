import mysql.connector
from mysql.connector import Error

def test_mysql_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='long@091103',  # Thay bằng mật khẩu mới của bạn
            database='mysql'  # hoặc database nào đó bạn biết chắc tồn tại
        )

        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"✅ Kết nối thành công tới MySQL Server version: {db_info}")
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE();")
            record = cursor.fetchone()
            print(f"📦 Đang sử dụng database: {record[0]}")

    except Error as e:
        print(f"❌ Lỗi khi kết nối tới MySQL: {e}")

    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
            print("🔌 Đã ngắt kết nối MySQL.")

if __name__ == "__main__":
    test_mysql_connection()

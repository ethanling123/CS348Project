from django.db import connection
from typing import List, Dict, Any

def execute_low_stock_report(threshold: int = 5) -> List[Dict[str, Any]]:
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                p.id,
                p.name,
                p.stock_quantity
            FROM app_product p
            WHERE p.stock_quantity < %s
            ORDER BY p.stock_quantity ASC
        """, [threshold])
        
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
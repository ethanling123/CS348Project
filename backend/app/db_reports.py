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

def execute_product_report(category_id: str = None, 
                            supplier_id: str = None,
                            min_stock: int = 0,
                            max_stock: int = 99999999999999999999) -> Dict[str, Any]:
    with connection.cursor() as cursor:
        query = """
            WITH filtered_products AS (
                SELECT 
                    p.id,
                    p.name,
                    p.stock_quantity,
                    c.name as category_name,
                    s.name as supplier_name
                FROM app_product p
                LEFT JOIN app_category c ON p.category_id = c.id
                LEFT JOIN app_supplier s ON p.supplier_id = s.id
                WHERE p.stock_quantity BETWEEN %s AND %s
        """
        params = [min_stock, max_stock]

        if category_id:
            query += " AND p.category_id = %s"
            params.append(category_id)
        if supplier_id:
            query += " AND p.supplier_id = %s"
            params.append(supplier_id)

        query += """
            )
            SELECT 
                json_agg(
                    json_build_object(
                        'id', id,
                        'name', name,
                        'stock_quantity', stock_quantity,
                        'category__name', category_name,
                        'supplier__name', supplier_name
                    )
                ) as products,
                COUNT(*) as total_products,
                AVG(stock_quantity) as avg_stock
            FROM filtered_products
        """

        cursor.execute(query, params)
        result = cursor.fetchone()
        
        return {
            'products': result[0] if result[0] else [],
            'statistics': {
                'total_products': result[1] or 0,
                'avg_stock': float(result[2]) if result[2] else 0
            }
        }
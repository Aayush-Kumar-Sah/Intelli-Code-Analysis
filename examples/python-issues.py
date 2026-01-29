"""
Example 3: Python Code with Issues
Demonstrates code smells in Python
"""

# Magic numbers
def calculate_discount(price):
    if price > 100:
        return price * 0.15
    elif price > 50:
        return price * 0.10
    else:
        return price * 0.05

# Long function
def process_order(order_id, customer_name, email, phone, address, city, state, zip_code, items, payment_method, shipping_method):
    print("Processing order...")
    
    # Deeply nested logic
    if order_id:
        if customer_name:
            if email:
                if phone:
                    if address:
                        for item in items:
                            for variation in item['variations']:
                                if variation['price'] > 100:
                                    print("Expensive item")
    
    return True

# Duplicate code
def calculate_total_a(items):
    total = 0
    for item in items:
        total += item['price'] * item['quantity']
    return total

def calculate_total_b(items):
    total = 0
    for item in items:
        total += item['price'] * item['quantity']
    return total

# Poor variable naming
def do_work(x, y, z):
    temp = x + y
    data = temp * z
    val = data / 2
    return val

# God class - too many methods
class OrderManager:
    def create_order(self): pass
    def update_order(self): pass
    def delete_order(self): pass
    def validate_order(self): pass
    def calculate_total(self): pass
    def apply_discount(self): pass
    def process_payment(self): pass
    def send_email(self): pass
    def send_sms(self): pass
    def log_activity(self): pass
    def generate_invoice(self): pass
    def print_receipt(self): pass
    def update_inventory(self): pass
    def check_stock(self): pass
    def calculate_shipping(self): pass
    def track_shipment(self): pass
    def handle_returns(self): pass
    def process_refund(self): pass
    def generate_report(self): pass
    def export_data(self): pass
    def import_data(self): pass

-- Analytics Module Database Optimization Indexes
-- Run this script to add indexes for better query performance

-- Order-related indexes
CREATE INDEX idx_order_status_completed ON orders(status, completed_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id, product_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_completed_at ON orders(completed_at);

-- Inventory import/export indexes
CREATE INDEX idx_inventory_import_status ON inventory_imports(status, approved_at);
CREATE INDEX idx_inventory_import_approved_at ON inventory_imports(approved_at);
CREATE INDEX idx_inventory_import_items_import_id ON inventory_import_items(import_id);
CREATE INDEX idx_inventory_import_items_product_id ON inventory_import_items(product_id);

CREATE INDEX idx_inventory_export_status ON inventory_exports(status, approved_at);
CREATE INDEX idx_inventory_export_items_export_id ON inventory_export_items(export_id);
CREATE INDEX idx_inventory_export_items_product_id ON inventory_export_items(product_id);

-- Product and category indexes
CREATE INDEX idx_product_category_id ON products(category_id);
CREATE INDEX idx_product_is_active ON products(is_active);

-- Inventory indexes
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_quantity ON inventory(quantity);

-- Additional analysis indexes
CREATE INDEX idx_order_user_id ON orders(user_id);
CREATE INDEX idx_order_items_created ON order_items(created_at);

-- View optimization indexes
CREATE INDEX idx_category_parent_id ON categories(parent_id);

-- For performance analysis, these covering indexes can help
-- ALTER TABLE order_items ADD price_cost_index INDEX (price, cost_price);

-- Performance tuning queries (run these after adding indexes)
-- ANALYZE TABLE orders;
-- ANALYZE TABLE order_items;
-- ANALYZE TABLE inventory_imports;
-- ANALYZE TABLE inventory_imports_items;
-- ANALYZE TABLE inventory_exports;
-- ANALYZE TABLE inventory_export_items;

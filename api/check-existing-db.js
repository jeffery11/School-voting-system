const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../sql/voting_system.db');
console.log('🔍 Checking database:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
        return;
    }
    console.log('✅ Connected to database!');
});

// Check tables and structure
db.all('SELECT name FROM sqlite_master WHERE type=\"table\"', (err, tables) => {
    if (err) {
        console.error('Error getting tables:', err);
        db.close();
        return;
    }
    
    if (tables.length === 0) {
        console.log('📭 Database is empty - no tables found');
        db.close();
        return;
    }
    
    console.log('\n📊 FOUND TABLES:');
    tables.forEach(table => {
        console.log('  - ' + table.name);
    });
    
    // Check structure of each table
    let tablesChecked = 0;
    
    tables.forEach(table => {
        db.all('PRAGMA table_info(' + table.name + ')', (err, columns) => {
            if (err) {
                console.log('\n❌ Error checking table ' + table.name + ':', err.message);
                return;
            }
            
            console.log('\n📋 TABLE STRUCTURE: ' + table.name);
            columns.forEach(col => {
                console.log('  ' + col.name + ' (' + col.type + ') ' + (col.notnull ? 'NOT NULL' : '') + ' ' + (col.pk ? 'PRIMARY KEY' : ''));
            });
            
            // Show row count and sample data
            db.get('SELECT COUNT(*) as count FROM ' + table.name, (err, rowCount) => {
                console.log('  📈 Rows: ' + rowCount.count);
                
                if (rowCount.count > 0) {
                    db.all('SELECT * FROM ' + table.name + ' LIMIT 2', (err, rows) => {
                        console.log('  👀 Sample data (first 2 rows):');
                        rows.forEach(row => {
                            console.log('    ', JSON.stringify(row));
                        });
                        
                        tablesChecked++;
                        if (tablesChecked === tables.length) {
                            db.close();
                            console.log('\n🎉 Database analysis complete!');
                        }
                    });
                } else {
                    console.log('  📭 Table is empty');
                    tablesChecked++;
                    if (tablesChecked === tables.length) {
                        db.close();
                        console.log('\n🎉 Database analysis complete!');
                    }
                }
            });
        });
    });
});

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zfymbnzmuhqrxdhckqnp.supabase.co',
  'sb_publishable_2jWzlOHxvoQApZx8DWCfAA_DMXsONhG'
);

async function checkData() {
  console.log("Checking tables...");
  const tables = ['lancamentos', 'despesas', 'receitas', 'clientes', 'fornecedores', 'usuarios'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(5);
    if (error) {
      console.log(`Table ${table} error: ${error.message}`);
    } else {
      console.log(`Table ${table} has ${data.length} records.`, data);
    }
  }
}

checkData();

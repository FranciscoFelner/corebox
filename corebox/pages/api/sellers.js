import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Apenas aceitar solicitações POST
  if (req.method !== 'POST') {
    if (req.method === 'GET') {
      // Verificar se existe uma query param 'secret' para autenticação básica
      const { secret } = req.query;
      if (secret !== process.env.ADMIN_SECRET && secret !== 'admin123') {
        return res.status(401).json({ error: 'Não autorizado' });
      }
      
      // Para requisições GET, retornar a lista de vendedores
      try {
        const filePath = path.join(process.cwd(), 'data', 'sellers.json');
        
        // Verificar se o arquivo existe
        if (!fs.existsSync(filePath)) {
          return res.status(200).json({ sellers: [] });
        }
        
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const sellers = JSON.parse(fileContents);
        
        return res.status(200).json({ sellers });
      } catch (error) {
        console.error('Erro ao ler arquivo de vendedores:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
    
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Obter os dados do formulário
    const sellerData = req.body;
    
    // Adicionar timestamp
    sellerData.createdAt = new Date().toISOString();
    
    // Criar o diretório de dados se não existir
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Caminho do arquivo
    const filePath = path.join(dataDir, 'sellers.json');
    
    // Verificar se o arquivo já existe
    let sellers = [];
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      sellers = JSON.parse(fileContents);
    }
    
    // Adicionar novo vendedor
    sellers.push(sellerData);
    
    // Escrever de volta no arquivo
    fs.writeFileSync(filePath, JSON.stringify(sellers, null, 2));
    
    res.status(200).json({ success: true, message: 'Cadastro recebido com sucesso!' });
  } catch (error) {
    console.error('Erro ao processar cadastro:', error);
    res.status(500).json({ success: false, message: 'Erro ao processar seu cadastro.' });
  }
} 
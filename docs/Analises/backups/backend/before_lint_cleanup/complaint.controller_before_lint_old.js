const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data');

// Gera protocolo local no formato MPT-XXXXXXXX
function gerarProtocolo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let codigo = '';
  for (let i = 0; i < 8; i++) {
    codigo += chars[Math.floor(Math.random() * chars.length)];
  }
  return `MPT-${codigo}`;
}

// Valida se os campos obrigatórios estão presentes
function validarDenuncia(dados) {
  const erros = [];

  if (!dados.uf || dados.uf.trim() === '') {
    erros.push('O estado (UF) é obrigatório');
  }
  if (!dados.municipio || dados.municipio.trim() === '') {
    erros.push('O município é obrigatório');
  }
  if (!dados.irregularidades || dados.irregularidades.length === 0) {
    if (!dados.relato_texto || dados.relato_texto.trim() === '') {
      erros.push('Descreva a irregularidade ou selecione ao menos um tipo');
    }
  }

  return erros;
}

/**
 * POST /api/denuncias
 * Recebe os dados do formulário e encaminha para a API interna do MPT.
 */
async function receberDenuncia(req, res, next) {
  try {
    // Parse dos dados JSON enviados pelo Angular
    let dadosDenuncia;
    try {
      dadosDenuncia = JSON.parse(req.body.denuncia);
    } catch {
      return res.status(400).json({
        erro: 'Dados da denúncia inválidos',
        detalhe: 'O campo "denuncia" deve ser um JSON válido'
      });
    }

    // Validação dos campos obrigatórios
    const erros = validarDenuncia(dadosDenuncia);
    if (erros.length > 0) {
      return res.status(422).json({
        erro: 'Dados incompletos',
        detalhes: erros
      });
    }

    // Gerar protocolo único
    const protocolo = gerarProtocolo();
    const timestamp = new Date().toISOString();

    // Montar payload completo
    const payload = {
      protocolo,
      timestamp,
      fonte: 'canal-denuncias-web',
      versao: '1.0.0',
      denuncia: {
        ...dadosDenuncia,
        // Garantir que dados sigilosos sejam sinalizados
        sigilo: dadosDenuncia.tipo_identificacao === 'anonimo'
      }
    };

    // Log sem dados pessoais
    console.log(`[${timestamp}] Nova denúncia | Protocolo: ${protocolo} | UF: ${dadosDenuncia.uf} | Sigilo: ${payload.denuncia.sigilo}`);

    // Encaminhar para API interna do MPT
    const mptApiUrl = process.env.MPT_API_URL;
    if (!mptApiUrl) {
      console.error(`[ERRO CONFIGURAÇÃO] MPT_API_URL não configurada. Protocolo: ${protocolo}`);
      return res.status(503).json({
        erro: 'Serviço de recebimento indisponível',
        detalhe: 'Não foi possível enviar a denúncia neste momento. Tente novamente mais tarde.'
      });
    }

    try {
      const formData = new FormData();
      formData.append('denuncia', JSON.stringify(payload));

      // Adicionar arquivos ao FormData para repasse
      if (req.files && req.files.length > 0) {
        req.files.forEach((file, index) => {
          formData.append(`arquivo_${index}`, file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
          });
        });
        console.log(`[${timestamp}] Arquivos anexados: ${req.files.length} arquivo(s)`);
      }

      const headers = {
        ...formData.getHeaders()
      };

      // Adicionar token de autenticação se configurado
      if (process.env.MPT_API_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.MPT_API_TOKEN}`;
      }

      await axios.post(mptApiUrl, formData, {
        headers,
        timeout: 30000 // 30s timeout
      });

      console.log(`[${timestamp}] Denúncia ${protocolo} encaminhada para API MPT com sucesso`);
    } catch (apiError) {
      console.error(`[ERRO API MPT] Protocolo: ${protocolo}`, apiError.message);
      return res.status(502).json({
        erro: 'Falha ao encaminhar denúncia',
        detalhe: 'Não foi possível enviar a denúncia neste momento. Tente novamente mais tarde.'
      });
    }

    // Resposta de sucesso para o frontend
    return res.status(201).json({
      sucesso: true,
      protocolo,
      mensagem: 'Denúncia recebida com sucesso. O Ministério Público do Trabalho analisará as informações.',
      timestamp
    });

  } catch (error) {
    next(error);
  }
}

module.exports = { receberDenuncia };

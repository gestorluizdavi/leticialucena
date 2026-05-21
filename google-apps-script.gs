/**
 * ============================================================================
 *  RECEPTOR DE LEADS — LANDING PAGE LETÍCIA LUCENA
 * ============================================================================
 *
 *  O QUE ESSE SCRIPT FAZ:
 *  Recebe os dados do formulário da landing page (nome, telefone, objetivo)
 *  e grava cada novo lead como uma linha na sua planilha do Google Sheets.
 *
 *  COMO INSTALAR (passo a passo no README.md):
 *  1. Crie uma planilha nova no Google Drive do Davi (drive.google.com)
 *     - Nomeie ela: "Leads Letícia Lucena - Landing Page"
 *     - Renomeie a aba (parte inferior) para: "Leads"
 *
 *  2. Na planilha, clique em: Extensões → Apps Script
 *
 *  3. Apague todo o código que aparecer e cole TODO esse arquivo aqui.
 *
 *  4. Salve (ícone de disquete ou Ctrl+S). Dê um nome ao projeto.
 *
 *  5. Clique em "Implantar" (botão azul, canto superior direito)
 *     → Nova implantação
 *     → Engrenagem ⚙ → escolha "Aplicativo da Web"
 *     → Configure:
 *         - Descrição: "Receptor Leads Landing"
 *         - Executar como: "Eu (seu email)"
 *         - Quem tem acesso: "Qualquer pessoa"  (IMPORTANTE!)
 *     → Implantar
 *     → Autorize o acesso (será solicitado uma vez)
 *
 *  6. Copie a URL que aparece em "URL do app da Web"
 *     (algo como https://script.google.com/macros/s/AKfycb.../exec)
 *
 *  7. Abra o arquivo index.html da landing page
 *     Localize a linha: var GOOGLE_SHEETS_URL = "..."
 *     Cole sua URL no lugar do placeholder e salve.
 *
 *  PRONTO. Os leads cairão direto na sua planilha em tempo real.
 *
 * ============================================================================
 */

// Nome da aba onde os leads serão gravados (deve bater com a aba da planilha)
var NOME_ABA = 'Leads';

/**
 * Recebe o POST do formulário e grava na planilha.
 */
function doPost(e) {
  try {
    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var aba = planilha.getSheetByName(NOME_ABA);

    // Se a aba não existir, cria automaticamente
    if (!aba) {
      aba = planilha.insertSheet(NOME_ABA);
    }

    // Se a planilha estiver vazia, escreve o cabeçalho
    if (aba.getLastRow() === 0) {
      aba.appendRow([
        'Data/Hora',
        'Nome',
        'Telefone (WhatsApp)',
        'Objetivo',
        'Origem',
        'Timestamp envio'
      ]);
      // Formata o cabeçalho
      var cabecalho = aba.getRange(1, 1, 1, 6);
      cabecalho.setFontWeight('bold')
               .setBackground('#c47e8c')
               .setFontColor('#ffffff')
               .setHorizontalAlignment('center');
      aba.setColumnWidth(1, 160);
      aba.setColumnWidth(2, 220);
      aba.setColumnWidth(3, 180);
      aba.setColumnWidth(4, 240);
      aba.setColumnWidth(5, 160);
      aba.setColumnWidth(6, 200);
      aba.setFrozenRows(1);
    }

    // Pega os dados enviados pelo formulário
    var nome      = (e.parameter.nome      || '').toString().trim();
    var telefone  = (e.parameter.telefone  || '').toString().trim();
    var objetivo  = (e.parameter.objetivo  || '').toString().trim();
    var origem    = (e.parameter.origem    || 'Landing Page').toString().trim();
    var timestamp = (e.parameter.timestamp || '').toString().trim();

    // Validação básica — não grava se vier vazio
    if (!nome || !telefone) {
      return ContentService.createTextOutput(
        JSON.stringify({status: 'erro', mensagem: 'Dados incompletos'})
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Adiciona a nova linha com data/hora atual no fuso de Brasília
    var dataHora = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss');

    aba.appendRow([
      dataHora,
      nome,
      telefone,
      objetivo,
      origem,
      timestamp
    ]);

    // Opcional: dispara email pra Letícia avisando que tem novo lead.
    // Descomente as linhas abaixo e troque o email se quiser ativar.
    /*
    MailApp.sendEmail({
      to: 'email-da-leticia@gmail.com',
      subject: '🌸 Novo lead na landing — ' + nome,
      htmlBody:
        '<h2>Novo lead recebido</h2>' +
        '<p><strong>Nome:</strong> ' + nome + '</p>' +
        '<p><strong>WhatsApp:</strong> ' + telefone + '</p>' +
        '<p><strong>Objetivo:</strong> ' + objetivo + '</p>' +
        '<p><strong>Data/Hora:</strong> ' + dataHora + '</p>'
    });
    */

    return ContentService.createTextOutput(
      JSON.stringify({status: 'ok', mensagem: 'Lead gravado com sucesso'})
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (erro) {
    return ContentService.createTextOutput(
      JSON.stringify({status: 'erro', mensagem: erro.toString()})
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Endpoint GET — só pra testar se o script está no ar.
 * Cole a URL no navegador depois de implantar e você deve ver "OK".
 */
function doGet(e) {
  return ContentService.createTextOutput(
    'OK — Receptor de leads da Letícia Lucena está no ar. ' +
    'Envie um POST pra gravar um novo lead.'
  );
}

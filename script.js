// Captura de elementos e configuração inicial
const calcularBtn = document.getElementById('calcular');
const resultadoDiv = document.getElementById('resultado');
const valorOrcamentoP = document.getElementById('valor-orcamento');
const copiarEmailBtn = document.getElementById('copiar-email');
const generatePDFBtn = document.getElementById('generate-pdf');

// Desabilitar produtos para "Website Institucional"
document.getElementById('tipo').addEventListener('change', function() {
    const produtosDropdown = document.getElementById('produtos');
    if (this.value === 'website') {
        produtosDropdown.value = '0';
        produtosDropdown.disabled = true;
    } else {
        produtosDropdown.disabled = false;
    }
});

// Atualizar o preço exibido dinamicamente
const updatePriceDisplay = () => {
    const valorAtual = document.getElementById('valor-orcamento').innerText;
    document.getElementById('price-display').innerText = `Estimativa Atual: ${valorAtual}`;
};

calcularBtn.addEventListener('click', function() {
    const tipoProjeto = document.getElementById('tipo').value;
    const objetivo = document.getElementById('objetivo').value;
    const paginas = document.getElementById('paginas').value;
    const produtos = document.getElementById('produtos').value;
    const prazo = document.getElementById('prazo').value;
    const suporte = document.getElementById('suporte').value;

    // Contando o número de características (funcionalidades e integrações) selecionadas
    const caracteristicas = Array.from(document.querySelectorAll('input[id^="caracteristica"]:checked')).length;

    let orcamentoFinal = 0;

    // Cálculo do orçamento
    orcamentoFinal += tipoProjeto === 'ecommerce' ? 300 : 100;
    orcamentoFinal += objetivo === 'venda-produtos' ? 300 : 100;

    // Preços baseados nas seleções de páginas e produtos
    orcamentoFinal += paginas === 'landingpage' ? 50 :
                      paginas === 'home-servicos-contactos' ? 250 :
                      paginas === 'loja-simples' ? 200 : 800;

    // Considerando que pode ser um website institucional com 0 produtos
    orcamentoFinal += produtos === '0' ? 0 :
                      produtos === 'ate-20' ? 100 :
                      produtos === 'ate-50' ? 200 :
                      produtos === 'ate-200' ? 600 : 800;

    orcamentoFinal += caracteristicas * 30;
    orcamentoFinal += prazo === 'urgente' ? 300 : prazo === 'normal' ? 150 : 50;
    orcamentoFinal += suporte === 'avancado' ? 60 : suporte === 'basico' ? 40 : 20;

    // Arredondar para o próximo múltiplo de "100 - 10" (90, 190, 290, etc.)
    orcamentoFinal = Math.ceil(orcamentoFinal / 100) * 100 - 10;

    valorOrcamentoP.innerText = `€ ${orcamentoFinal.toFixed(2)}`;
    resultadoDiv.style.display = 'block';
    updatePriceDisplay();  // Atualiza o preço exibido
});

// Função para copiar o email para a área de transferência
copiarEmailBtn.addEventListener('click', function() {
    const operador = document.getElementById('operador').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const tipoProjeto = document.getElementById('tipo').value;
    const objetivo = document.getElementById('objetivo').value;
    const paginas = document.getElementById('paginas').options[document.getElementById('paginas').selectedIndex].text;
    const produtos = document.getElementById('produtos').options[document.getElementById('produtos').selectedIndex].text;
    const caracteristicas = Array.from(document.querySelectorAll('input[id^="caracteristica"]:checked'))
        .map(opt => opt.value)
        .join(', ');
    const prazo = document.getElementById('prazo').value;
    const suporte = document.getElementById('suporte').value;
    const valorOrcamento = valorOrcamentoP.innerText;
    const observacoes = document.getElementById('observacoes').value;

    const emailTemplate = `
        Olá ${nome},

        Foi um prazer conversar com você sobre o projeto de ${tipoProjeto}. Aqui está um resumo detalhado do que discutimos:

        Objetivo Principal: ${objetivo}
        Número de Páginas: ${paginas}
        Número de Produtos: ${produtos}
        Funcionalidades e Integrações Selecionadas: ${caracteristicas}
        Prazo de Entrega: ${prazo}
        Necessidade de Suporte: ${suporte}

        Valor Total Estimado: ${valorOrcamento}

        **Observações Adicionais:** ${observacoes}

        Por favor, fique à vontade para pensar sobre a proposta e responder este email se desejar prosseguir com o serviço. Caso queira agendar uma reunião online para discutir os detalhes do projeto e iniciar o desenvolvimento, estou à disposição. Estamos sempre disponíveis para esclarecer qualquer dúvida que você tenha em relação ao serviço.

        Aguardamos com expectativa o início deste projeto.

        Atenciosamente,
        ${operador}
        [Seu Cargo] na [Nome da Empresa]
    `;

    navigator.clipboard.writeText(emailTemplate).then(function() {
        const notification = document.createElement('div');
        notification.innerText = 'Email copiado com sucesso!';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.background = '#4CAF50';
        notification.style.color = '#fff';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);  // Remove a notificação após 3 segundos
    }, function() {
        alert('Falha ao copiar o email para a área de transferência.');
    });
});

// Função para gerar PDF do orçamento
generatePDFBtn.addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(20, 20, 'Orçamento Gerado');
    doc.text(20, 30, `Valor Total Estimado: ${document.getElementById('valor-orcamento').innerText}`);
    doc.save('orcamento.pdf');
});

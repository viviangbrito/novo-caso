 // === DROPDOWN PERSONALIZADO ===
  window.toggleDropdown = function () {
    document.getElementById("dropdown").classList.toggle("active");
  };

  window.onclick = function (e) {
    if (!e.target.closest('.custom-dropdown')) {
      document.getElementById("dropdown").classList.remove("active");
    }
  };

  // === ADICIONAR EVIDÊNCIA (LOCAL) ===
  const inputEvidencia = document.getElementById("inputEvidencia");
  const listaEvidencias = document.getElementById("lista-evidencias");
  const mensagemDiv = document.getElementById("mensagem");
  const tabelaEvidenciasBody = document.querySelector("#tabelaEvidencias tbody");
  const evidenciasLocal = []; // Array para armazenar as evidências localmente

  inputEvidencia.addEventListener("change", function (event) {
    const files = event.target.files;
    if (files.length > 0) {
      mensagemDiv.style.display = "none"; // Esconde mensagens anteriores

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
          // Adicionar informações do arquivo para exibição local
          evidenciasLocal.push({ name: file.name, dataUrl: e.target.result });

          // Atualizar a lista de evidências (dropdown)
          const link = document.createElement("a");
          link.textContent = file.name;
          listaEvidencias?.appendChild(link);
          listaEvidencias?.appendChild(document.createElement("br"));

          // Atualizar a tabela de evidências
          if (tabelaEvidenciasBody) {
            const tr = document.createElement("tr");
            const tdIndex = document.createElement("td");
            tdIndex.textContent = tabelaEvidenciasBody.rows.length + 1;
            const tdNome = document.createElement("td");
            tdNome.textContent = file.name;
            const tdLink = document.createElement("td");
            const downloadLink = document.createElement("a");
            downloadLink.href = e.target.result;
            downloadLink.download = file.name;
            downloadLink.textContent = "Download";
            tdLink.appendChild(downloadLink);
            tr.appendChild(tdIndex);
            tr.appendChild(tdNome);
            tr.appendChild(tdLink);
            tabelaEvidenciasBody.appendChild(tr);
          }
        };
        reader.readAsDataURL(file); // Ler o arquivo como Data URL

        // Exibir mensagem de sucesso (local)
        mensagemDiv.style.display = "block";
        mensagemDiv.style.color = "green";
        mensagemDiv.textContent = "Evidência adicionada localmente!";
      });

      // Resetar input
      event.target.value = '';
    }
  });

  // === SALVAR CASO (LOCAL - apenas simulação) ===
  window.salvarCaso = function () {
    alert("Caso salvo localmente" + evidenciasLocal.map(e => e.name).join(", "));
  };

  // === SALVAR DADOS DO CASO (LOCAL - simulação) ===
  document.getElementById('btn-salvar-caso').addEventListener('click', () => {
    const dados = {
      titulo: document.getElementById('titulo').value,
      codigo: document.getElementById('codigo').value,
      perito: document.getElementById('perito').value,
      status: document.getElementById('status').value,
      dataOcorrencia: document.getElementById('data-ocorrencia').value,
      dataEmissao: document.getElementById('data-emissao').value,
      local: document.getElementById('local').value,
      evidencias: evidenciasLocal.map(e => e.name) // Salvar apenas os nomes das evidências localmente
    };
    alert('Dados do caso salvos localmente:\n' + JSON.stringify(dados, null, 2));
    console.log('Dados do caso salvos localmente:', dados);
});

//botoes anexo

document.getElementById('btn-localizacao').addEventListener('click', function() {
  exibirConteudo('localizacao');
});

document.getElementById('btn-anexos').addEventListener('click', function() {
  exibirConteudo('anexos');
});

document.getElementById('btn-relatorio').addEventListener('click', function() {
  exibirConteudo('relatorio');
});

function exibirConteudo(id) {
  // Esconde todos os conteúdos
  const todosConteudos = document.querySelectorAll('.conteudo-tab');
  todosConteudos.forEach(function(conteudo) {
    conteudo.classList.remove('active');
  });

  // Exibe o conteúdo selecionado
  const conteudoAtivo = document.getElementById(id);
  conteudoAtivo.classList.add('active');
}

// Inicializa o mapa no centro de Recife
const map = L.map('map').setView([-8.0476, -34.877], 13);

// Camada do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;

// Função para buscar endereço
function buscarEndereco(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const endereco = data.display_name || "Endereço não encontrado";
      document.getElementById("endereco").textContent = endereco;
    })
    .catch(() => {
      document.getElementById("endereco").textContent = "Erro ao buscar endereço";
    });
}

// Clique no mapa
map.on('click', function (e) {
  const { lat, lng } = e.latlng;

  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    // Ícone vermelho personalizado
    const customIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    });

    marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
  }

  buscarEndereco(lat, lng);
});

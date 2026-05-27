const modelosPorCategoria = {
  A: ["Jeep Renegade", "Corolla Cross", "T-Cross", "Volvo XC60"],
  B: ["Gol", "Fiat Palio", "Siena", "Ford Ka"],
  C: ["Renault Kwid", "Fiat Mobi"]
};

function atualizarModelos() {
  const categoria = document.getElementById("categoria").value;
  const modeloSelect = document.getElementById("modelo");
  modeloSelect.innerHTML = '<option value="">Selecione o Modelo</option>';

  if (modelosPorCategoria[categoria]) {
    modelosPorCategoria[categoria].forEach((modelo) => {
      const option = document.createElement("option");
      option.value = modelo;
      option.textContent = modelo;
      modeloSelect.appendChild(option);
    });
  }
}

function formatarName(el) {
  const valor = el.value.trim();

  if (valor === '') {
    return;
  }

  for (let i = 0; i < valor.length; i++) {
    const char = valor[i];
    if (char >= '0' && char <= '9') {
      el.value = '';
      el.focus();
      return;
    }
  }

  let temLetra = false;
  for (let i = 0; i < valor.length; i++) {
    const code = valor.charCodeAt(i);
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122) || valor[i] === ' ') {
      temLetra = true;
      break;
    }
  }

  if (!temLetra) {
    alert('O nome deve conter pelo menos uma letra.');
    el.value = '';
    el.focus();
    return;
  }

  el.value = valor.replace(/\s+/g, ' ');
}

function formatarCPF(el) {
  let v = '';
  const numeros = '0123456789';

  for (let i = 0; i < el.value.length; i++) {
    if (numeros.indexOf(el.value[i]) !== -1) {
      v += el.value[i];
    }
  }

  if (v.length > 11) v = v.substring(0, 11);

  if (v.length >= 3) {
    v = v.substring(0, 3) + '.' + v.substring(3);
  }

  if (v.length >= 7) {
    v = v.substring(0, 7) + '.' + v.substring(7);
  }

  if (v.length >= 11) {
    v = v.substring(0, 11) + '-' + v.substring(11);
  }

  el.value = v;
}

function formatarPlaca(el) {
  let v = '';
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';
  const valor = el.value.toUpperCase();

  for (let i = 0; i < valor.length; i++) {
    const char = valor[i];
    if ((i < 3 && letras.indexOf(char) !== -1) || (i >= 3 && numeros.indexOf(char) !== -1)) {
      v += char;
    }
  }

  if (v.length > 7) v = v.substring(0, 7);

  el.value = v;
}

function formatarCampo(el) {
  let v = el.value.trim();
  v = v.replace(/\s+/g, ' ');
  el.value = v.charAt(0).toUpperCase() + v.slice(1);
}

function validarTexto(id) {
  const el = document.getElementById(id);
  const val = el.value.trim();

  if (val.length < 3) {
    el.classList.add('erro');
    return null;
  }

  el.classList.remove('erro');
  el.classList.add('valido');
  return val;
}

function validarCPFsimples(id) {
  const el = document.getElementById(id);
  const val = el.value.replace(/\D/g, '');

  if (val.length !== 11) {
    el.classList.add('erro');
    return null;
  }

  el.classList.remove('erro');
  el.classList.add('valido');
  return val;
}

function validarPlacaSimples(id) {
  const el = document.getElementById(id);
  const val = el.value.toUpperCase();
  const padrao = /^[A-Z]{3}[0-9]{4}$/;

  if (!padrao.test(val)) {
    el.classList.add('erro');
    return null;
  }

  el.classList.remove('erro');
  el.classList.add('valido');
  return val;
}

function validarSelect(id) {
  const el = document.getElementById(id);

  if (!el.value) {
    el.classList.add('erro');
    return null;
  }

  el.classList.remove('erro');
  el.classList.add('valido');
  return el.value;
}

function validarData(id) {
  const el = document.getElementById(id);

  if (!el.value) {
    el.classList.add('erro');
    return null;
  }

  el.classList.remove('erro');
  el.classList.add('valido');
  return el.value;
}

function validarDatas(retirada, devolucao) {
  if (!retirada || !devolucao) return false;
  return new Date(devolucao) > new Date(retirada);
}

function limparEstilos() {
  document.querySelectorAll('input, select').forEach((el) => {
    el.classList.remove('valido');
    el.classList.remove('erro');
  });

  const resultado = document.getElementById('resultado');
  const resultadoLogin = document.getElementById('resultadoLogin');

  if (resultado) resultado.textContent = '';
  if (resultadoLogin) resultadoLogin.textContent = '';
}

function atualizarBarra() {
  const campos = [
    document.getElementById('nome').value.trim(),
    document.getElementById('cpf').value.trim(),
    document.getElementById('placa').value.trim(),
    document.getElementById('father').value.trim(),
    document.getElementById('mom').value.trim(),
    document.getElementById('cor').value.trim(),
    document.getElementById('categoria').value.trim(),
    document.getElementById('modelo').value.trim(),
    document.getElementById('uf').value.trim(),
    document.getElementById('acessorios').value.trim(),
    document.getElementById('dataRetirada').value.trim(),
    document.getElementById('dataDevolucao').value.trim()
  ];

  const total = campos.length;
  const preenchidos = campos.filter((campo) => campo !== '').length;
  const percentual = (preenchidos / total) * 100;

  const barra = document.getElementById('barra');
  if (barra) {
    barra.style.width = percentual + '%';
  }
}

const ClienteManager = {
  async adicionar(cliente) {
    const clientesExistentes = await listClienteRecords();
    const duplicado = clientesExistentes.some((item) => item.cpf === cliente.cpf && item.placa === cliente.placa);

    if (duplicado) {
      return false;
    }

    await saveClienteRecord(cliente);
    return true;
  },

  async remover(cpf) {
    await removeClienteRecord(cpf);
  },

  async buscar(cpf, placa) {
    return findClienteRecord(cpf, placa);
  },

  async listarTodos() {
    return listClienteRecords();
  }
};

async function listarClientes() {
  const ul = document.getElementById('listaClientes');

  if (!ul) return;

  ul.innerHTML = '';
  const todosClientes = await ClienteManager.listarTodos();

  if (todosClientes.length === 0) {
    const aviso = document.createElement('li');
    aviso.textContent = 'Nenhum cliente cadastrado.';
    ul.appendChild(aviso);
    return;
  }

  todosClientes.forEach((c) => {
    const li = document.createElement('li');
    li.textContent = `${c.nome} - CPF: ${c.cpf} - Placa: ${c.placa}`;

    const btn = document.createElement('button');
    btn.textContent = 'Remover';
    btn.onclick = async () => {
      await ClienteManager.remover(c.cpf);
      await listarClientes();
    };

    li.appendChild(btn);
    ul.appendChild(li);
  });
}

async function limparCampos() {
  document.querySelectorAll('input, select').forEach((el) => {
    el.value = '';
  });

  limparEstilos();
  atualizarBarra();
}

async function carregarEstadosUf() {
  const select = document.getElementById('uf');
  const status = document.getElementById('ufStatus');
  const preview = document.getElementById('ufMapaPreview');

  if (!select || !status || !preview) return;

  status.textContent = 'Buscando estados do IBGE...';
  preview.innerHTML = '<p>Selecione uma UF para carregar a malha simplificada do IBGE.</p>';

  try {
    const cache = await loadEstadosCache();
    if (cache.length > 0) {
      renderUfOptions(cache);
    }

    const estados = await fetchEstadosFromIbge();
    await saveEstadosCache(estados);
    renderUfOptions(estados);
    status.textContent = `${estados.length} UFs carregadas da API do IBGE.`;
  } catch (error) {
    const cache = await loadEstadosCache();
    if (cache.length > 0) {
      renderUfOptions(cache);
      status.textContent = 'API indisponível. Carregando UFs salvas localmente.';
      return;
    }

    select.innerHTML = '<option value="">Falha ao carregar UFs</option>';
    status.textContent = 'Não foi possível carregar a lista de UFs.';
    console.error(error);
  }
}

function renderUfOptions(estados) {
  const select = document.getElementById('uf');
  if (!select) return;

  const options = [
    '<option value="">Selecione uma UF</option>'
  ];

  estados
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .forEach((estado) => {
      options.push(`<option value="${estado.sigla}">${estado.sigla} - ${estado.nome}</option>`);
    });

  select.innerHTML = options.join('');
}

async function carregarMapaUf(sigla) {
  const preview = document.getElementById('ufMapaPreview');
  const status = document.getElementById('ufStatus');

  if (!preview || !status) return;

  if (!sigla) {
    preview.innerHTML = '<p>Selecione uma UF para carregar a malha simplificada do IBGE.</p>';
    status.textContent = 'Buscando estados do IBGE.';
    return;
  }

  preview.innerHTML = '<p>Carregando a malha da UF selecionada...</p>';
  status.textContent = `Carregando malha ${sigla} do IBGE...`;

  try {
    const svg = await getUfPreview(sigla);
    preview.innerHTML = svg;
    status.textContent = `Mapa simplificado da UF ${sigla} carregado com dados do IBGE.`;
  } catch (error) {
    preview.innerHTML = '<p>Não foi possível carregar a malha desta UF.</p>';
    status.textContent = 'Falha ao carregar a malha da UF selecionada.';
    console.error(error);
  }
}

async function cadastrar() {
  limparEstilos();

  const nome = validarTexto('nome');
  const cpf = validarCPFsimples('cpf');
  const placa = validarPlacaSimples('placa');
  const father = validarTexto('father');
  const mom = validarTexto('mom');
  const cor = validarSelect('cor');
  const categoria = validarSelect('categoria');
  const modelo = validarSelect('modelo');
  const uf = validarSelect('uf');
  const acessoriosAdds = validarSelect('acessorios');
  const dataRetirada = validarData('dataRetirada');
  const dataDevolucao = validarData('dataDevolucao');

  const camposValidos = [nome, cpf, placa, cor, categoria, modelo, uf, acessoriosAdds, dataRetirada, dataDevolucao].every((valor) => valor !== null);

  if (!camposValidos) {
    document.getElementById('resultado').textContent = 'Por favor, preencha corretamente todos os campos.';
    return;
  }

  if (!validarDatas(dataRetirada, dataDevolucao)) {
    document.getElementById('resultado').textContent = 'Data de devolução deve ser após a data de retirada.';
    return;
  }

  const existente = await ClienteManager.buscar(cpf, placa);
  if (existente) {
    document.getElementById('resultado').textContent = 'Este usuário já está cadastrado.';
    return;
  }

  const cliente = {
    nome,
    cpf,
    placa,
    father,
    mom,
    cor,
    categoria,
    modelo,
    uf,
    acessoriosAdds,
    dataRetirada,
    dataDevolucao
  };

  const cadastrado = await ClienteManager.adicionar(cliente);
  if (!cadastrado) {
    document.getElementById('resultado').textContent = 'Este usuário já está cadastrado.';
    return;
  }

  document.getElementById('resultado').textContent = 'Cadastro realizado com sucesso!';
  await listarClientes();
  await limparCampos();
}

async function login() {
  limparEstilos();

  const cpfLogin = validarCPFsimples('cpfLogin');
  const placaLogin = validarPlacaSimples('placaLogin');

  if (!cpfLogin || !placaLogin) {
    document.getElementById('resultadoLogin').textContent = 'CPF e Placa inválidos para login.';
    return;
  }

  const cliente = await ClienteManager.buscar(cpfLogin, placaLogin);
  if (!cliente) {
    document.getElementById('resultadoLogin').textContent = 'Usuário não encontrado.';
    return;
  }

  document.getElementById('resultadoLogin').textContent = 'Login efetuado! Redirecionando...';
  sessionStorage.setItem('clienteLogado', JSON.stringify(cliente));

  setTimeout(() => {
    window.location.href = 'dadoscliente.html';
  }, 1000);
}

async function inicializarAplicacao() {
  try {
    await getIbgeDatabase();
    await carregarEstadosUf();
    await listarClientes();
  } catch (error) {
    console.error('Erro ao inicializar aplicação:', error);
  }

  const ufSelect = document.getElementById('uf');
  if (ufSelect) {
    ufSelect.addEventListener('change', (event) => {
      atualizarBarra();
      carregarMapaUf(event.target.value);
    });
  }
}

window.addEventListener('DOMContentLoaded', inicializarAplicacao);
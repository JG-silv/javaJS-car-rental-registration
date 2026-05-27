const IBGE_DB_NAME = 'locadora-ibge-db';
const IBGE_DB_VERSION = 1;
const STORE_ESTADOS = 'ufs';
const STORE_CLIENTES = 'clientes';

let ibgeDbInstance = null;

function openIbgeDatabase() {
  return new Promise((resolve, reject) => {
    if (ibgeDbInstance) {
      resolve(ibgeDbInstance);
      return;
    }

    const request = indexedDB.open(IBGE_DB_NAME, IBGE_DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_ESTADOS)) {
        const estadosStore = db.createObjectStore(STORE_ESTADOS, { keyPath: 'sigla' });
        estadosStore.createIndex('nome', 'nome', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_CLIENTES)) {
        const clientesStore = db.createObjectStore(STORE_CLIENTES, { keyPath: 'cpf' });
        clientesStore.createIndex('placa', 'placa', { unique: false });
      }
    };

    request.onsuccess = () => {
      ibgeDbInstance = request.result;
      resolve(ibgeDbInstance);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function getIbgeDatabase() {
  if (!window.indexedDB) {
    throw new Error('IndexedDB não está disponível neste navegador.');
  }

  return openIbgeDatabase();
}

async function saveEstadosCache(estados) {
  const db = await getIbgeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ESTADOS, 'readwrite');
    const store = transaction.objectStore(STORE_ESTADOS);

    estados.forEach((estado) => {
      const request = store.get(estado.sigla.toUpperCase());

      request.onsuccess = () => {
        const existente = request.result || {};
        store.put({
          ...existente,
          sigla: estado.sigla,
          nome: estado.nome,
          id: estado.id,
          atualizadoEm: new Date().toISOString()
        });
      };
    });

    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
}

async function loadEstadosCache() {
  const db = await getIbgeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ESTADOS, 'readonly');
    const store = transaction.objectStore(STORE_ESTADOS);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function getEstadoCache(sigla) {
  const db = await getIbgeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ESTADOS, 'readonly');
    const store = transaction.objectStore(STORE_ESTADOS);
    const request = store.get(sigla.toUpperCase());

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function saveEstadoPreview(sigla, svgMarkup) {
  const db = await getIbgeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ESTADOS, 'readwrite');
    const store = transaction.objectStore(STORE_ESTADOS);

    const estadoAtual = {
      sigla: sigla.toUpperCase(),
      svg: svgMarkup,
      atualizadoEm: new Date().toISOString()
    };

    const existingRequest = store.get(sigla.toUpperCase());
    existingRequest.onsuccess = () => {
      const estadoExistente = existingRequest.result || {};
      const registro = { ...estadoExistente, ...estadoAtual };
      store.put(registro);
    };

    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
}

async function saveClienteRecord(cliente) {
  const db = await getIbgeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_CLIENTES, 'readwrite');
    const store = transaction.objectStore(STORE_CLIENTES);

    store.put(cliente);

    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
}

async function listClienteRecords() {
  const db = await getIbgeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_CLIENTES, 'readonly');
    const store = transaction.objectStore(STORE_CLIENTES);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function findClienteRecord(cpf, placa) {
  const clientes = await listClienteRecords();
  return clientes.find((cliente) => cliente.cpf === cpf && cliente.placa === placa) || null;
}

async function removeClienteRecord(cpf) {
  const db = await getIbgeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_CLIENTES, 'readwrite');
    const store = transaction.objectStore(STORE_CLIENTES);

    store.delete(cpf);

    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
}

async function fetchEstadosFromIbge() {
  const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');

  if (!response.ok) {
    throw new Error('Falha ao buscar estados do IBGE.');
  }

  return response.json();
}

async function fetchUfMapSvg(sigla) {
  const response = await fetch(`https://servicodados.ibge.gov.br/api/v4/malhas/estados/${encodeURIComponent(sigla)}?qualidade=intermediaria&formato=image/svg+xml`);

  if (!response.ok) {
    throw new Error('Falha ao buscar a malha do IBGE para a UF selecionada.');
  }

  const svgText = await response.text();
  const match = svgText.match(/<svg[\s\S]*<\/svg>/i);

  if (!match) {
    return svgText;
  }

  return match[0];
}

async function getUfPreview(sigla) {
  const estado = await getEstadoCache(sigla);

  if (estado && estado.svg) {
    return estado.svg;
  }

  const svg = await fetchUfMapSvg(sigla);
  await saveEstadoPreview(sigla, svg);
  return svg;
}

window.loadEstadosCache = loadEstadosCache;
window.saveEstadosCache = saveEstadosCache;
window.getEstadoCache = getEstadoCache;
window.getUfPreview = getUfPreview;
window.saveClienteRecord = saveClienteRecord;
window.listClienteRecords = listClienteRecords;
window.findClienteRecord = findClienteRecord;
window.removeClienteRecord = removeClienteRecord;
window.fetchEstadosFromIbge = fetchEstadosFromIbge;
window.fetchUfMapSvg = fetchUfMapSvg;

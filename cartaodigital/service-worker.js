/* NOME E VERSÃO DO CACHE */
const NOME_CACHE = "dr-protese-cartao-v3";

/* ARQUIVOS PRINCIPAIS DO CARTÃO */
const ARQUIVOS_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./foto.webp",
    "./logo.webp",
    "./preview-card-v3.jpg",
    "./icone-192.png",
    "./icone-512.png"
];

/* INSTALAR O SERVICE WORKER */
self.addEventListener("install", evento => {
    evento.waitUntil(
        caches.open(NOME_CACHE).then(cache => {
            return cache.addAll(ARQUIVOS_CACHE);
        })
    );

    self.skipWaiting();
});

/* ATIVAR E EXCLUIR CACHES ANTIGOS */
self.addEventListener("activate", evento => {
    evento.waitUntil(
        caches.keys().then(nomes => {
            return Promise.all(
                nomes
                    .filter(nome => nome !== NOME_CACHE)
                    .map(nome => caches.delete(nome))
            );
        })
    );

    self.clients.claim();
});

/* CARREGAR ARQUIVOS COM SUPORTE OFFLINE */
self.addEventListener("fetch", evento => {
    if (evento.request.method !== "GET") return;

    evento.respondWith(
        fetch(evento.request)
            .then(resposta => {
                const copia = resposta.clone();

                caches.open(NOME_CACHE).then(cache => {
                    cache.put(evento.request, copia);
                });

                return resposta;
            })
            .catch(() => caches.match(evento.request))
    );
});
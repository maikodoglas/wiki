import type { Localized } from "./i18n";

/** Parameter labels are translated; command names never are. */
export const argLabels = {
  question: { pt: "pergunta", en: "question" },
  emote: { pt: "emote", en: "emote" },
  image: { pt: "descrição / link do gif", en: "description / gif link" },
  partyCode: { pt: "código da party", en: "party code" },
  song: { pt: "título / link do YouTube", en: "title / YouTube link" },
  number: { pt: "número", en: "number" },
  message: { pt: "mensagem", en: "message" },
  user: { pt: "usuário", en: "user" },
  distance: { pt: "distância", en: "distance" },
  size: { pt: "tamanho", en: "size" },
  duration: { pt: "duração", en: "duration" },
  action: { pt: "ação", en: "action" },
  amount: { pt: "valor", en: "amount" },
  ballType: { pt: "tipo de pokébola", en: "ball type" },
  item: { pt: "item", en: "item" },
  quantity: { pt: "quantidade", en: "quantity" },
  genOrType: { pt: "geração / tipo", en: "generation / type" },
  pokemon: { pt: "pokémon", en: "pokémon" },
} satisfies Record<string, Localized>;

export type ArgKey = keyof typeof argLabels;
export type Arg = ArgKey | { key: ArgKey; optional: true };

export type Command = {
  id: string;
  /** First entry is the main command, the rest are aliases. */
  names: string[];
  args?: Arg[];
  mod?: boolean;
  desc: Localized;
  examples?: string[];
  link?: string;
  /** A page of this wiki, relative to the language root (e.g. "cheats/"). */
  page?: string;
  group?: string;
};

export type CategoryIcon =
  | "sparkles"
  | "music"
  | "mic"
  | "eye"
  | "fish"
  | "users"
  | "gamepad";

export type Category = {
  id: string;
  icon: CategoryIcon;
  title: Localized;
  desc: Localized;
  groups?: { id: string; title: Localized }[];
  commands: Command[];
};

export const categories: Category[] = [
  {
    id: "general",
    icon: "sparkles",
    title: { pt: "Comandos gerais", en: "General" },
    desc: {
      pt: "Informações do canal, links úteis e comandos para interagir com a live.",
      en: "Channel info, useful links and commands to interact with the stream.",
    },
    commands: [
      {
        id: "8ball",
        names: ["!8ball", "!eightball", "!69ball", "!420ball"],
        args: ["question"],
        desc: {
          pt: "Faça uma pergunta e a 8-ball lhe dirá a resposta.",
          en: "Ask a question and the 8-ball will tell you the answer.",
        },
        examples: ["!8ball am I gay"],
      },
      {
        id: "accountage",
        names: ["!accountage", "!accage", "!created"],
        desc: {
          pt: "Informa há quanto tempo sua conta foi criada.",
          en: "Tells you how long ago your account was created.",
        },
      },
      {
        id: "chatstats",
        names: ["!chatstats", "!twitchstats"],
        desc: {
          pt: "Link com estatísticas do canal, como total de mensagens por usuário e os emotes mais usados.",
          en: "Link to channel stats, such as total messages per user and the most used emotes.",
        },
        link: "https://stats.streamelements.com/c/maikodoglas",
      },
      {
        id: "emotecount",
        names: ["!emotecount", "!ecount"],
        args: ["emote"],
        desc: {
          pt: "Mostra quantas vezes um emote já foi usado no chat.",
          en: "Shows how many times an emote has been used in chat.",
        },
        examples: ["!ecount LUL"],
      },
      {
        id: "followage",
        names: ["!followage", "!howlong"],
        desc: {
          pt: "Mostra há quanto tempo você segue o canal.",
          en: "Shows how long you have been following the channel.",
        },
      },
      {
        id: "tip",
        names: ["!tip", "!donate"],
        desc: {
          pt: "Link para fazer doações em qualquer moeda.",
          en: "Link to donate in any currency.",
        },
        link: "https://streamelements.com/maikodoglas/tip",
      },
      {
        id: "pix",
        names: ["!pix"],
        desc: {
          pt: "Link para fazer doações via Pix.",
          en: "Link to donate via Pix (Brazilian instant payment).",
        },
        link: "https://pixgg.com/maikodoglas",
      },
      {
        id: "uptime",
        names: ["!uptime", "!downtime"],
        desc: {
          pt: "Mostra há quanto tempo a live está online (ou offline).",
          en: "Shows how long the stream has been online (or offline).",
        },
      },
      {
        id: "watchtime",
        names: ["!watchtime", "!viewtime"],
        desc: {
          pt: "Descubra há quanto tempo você assiste à live.",
          en: "Find out how long you have been watching the stream.",
        },
      },
      {
        id: "blerp",
        names: ["!blerp"],
        desc: {
          pt: "Link para enviar sons pelo Blerp.",
          en: "Link to send sounds through Blerp.",
        },
        link: "https://blerp.com/x/maikodoglas",
      },
      {
        id: "playlist",
        names: ["!playlist"],
        desc: {
          pt: "Link da playlist padrão da live.",
          en: "Link to the stream's default playlist.",
        },
        link: "https://www.youtube.com/playlist?list=PL7y0_98KC0AWnaMrpY34Jgdp016jyYp4I",
      },
      {
        id: "cheats",
        names: ["!cheats"],
        desc: {
          pt: "Link da lista de cheat codes, para resgatar com os pontos do canal.",
          en: "Link to the cheat codes list, to redeem with channel points.",
        },
        page: "cheats/",
      },
      {
        id: "lurk",
        names: ["!lurk"],
        desc: {
          pt: "Avisa que você está só assistindo, e o bot agradece o lurk.",
          en: "Lets everyone know you're lurking, and the bot thanks you for it.",
        },
      },
      {
        id: "remod",
        names: ["!remod"],
        desc: {
          pt: "Recria a lista de mods e VIPs da live.",
          en: "Rebuilds the stream's list of mods and VIPs.",
        },
      },
      {
        id: "gif",
        names: ["!gif", "!img", "!png", "!jpg", "!jpeg", "!imagem", "!image"],
        args: ["image"],
        desc: {
          pt: "Exibe um gif ou imagem no canto superior esquerdo da tela por 5 segundos.",
          en: "Shows a gif or image in the top-left corner of the screen for 5 seconds.",
        },
        examples: ["!gif 67"],
      },
      {
        id: "code",
        names: ["!code"],
        args: ["partyCode"],
        mod: true,
        desc: {
          pt: "Mostra na tela o código da party do jogo atual.",
          en: "Shows the party code for the current game on screen.",
        },
        examples: ["!code 4KZMAK"],
      },
      {
        id: "hidecode",
        names: ["!hidecode"],
        mod: true,
        desc: {
          pt: "Esconde o código da party.",
          en: "Hides the party code.",
        },
      },
    ],
  },
  {
    id: "songs",
    icon: "music",
    title: { pt: "Pedidos de música", en: "Song Requests" },
    desc: {
      pt: "Peça músicas, veja a fila e controle o que está tocando.",
      en: "Request songs, check the queue and control what's playing.",
    },
    commands: [
      {
        id: "sr",
        names: ["!sr", "!songrequest"],
        args: ["song"],
        desc: {
          pt: "Adiciona uma música na fila.",
          en: "Adds a song to the queue.",
        },
        examples: [
          "!sr rick astley never gonna give you up",
          "!sr https://youtu.be/dQw4w9WgXcQ",
        ],
      },
      {
        id: "song",
        names: ["!song"],
        desc: {
          pt: "Mostra informações da música que está tocando.",
          en: "Shows info about the song currently playing.",
        },
      },
      {
        id: "next",
        names: ["!next", "!nextsong", "!whatisthenextsonghomie"],
        desc: {
          pt: "Descubra qual é a próxima música da fila.",
          en: "Find out which song is next in the queue.",
        },
      },
      {
        id: "when",
        names: ["!when", "!mysong"],
        desc: {
          pt: "Descubra quando sua música vai tocar e em que posição ela está na fila.",
          en: "Find out when your song will play and its position in the queue.",
        },
      },
      {
        id: "wrongsong",
        names: [
          "!ws",
          "!sw",
          "!wrongsong",
          "!ctrl-z",
          "!heybuddyithinkyougotthewrongsong",
        ],
        desc: {
          pt: "Remove a última música que você colocou na fila (se ela ainda não começou).",
          en: "Removes the last song you added to the queue (if it hasn't started yet).",
        },
      },
      {
        id: "skip",
        names: ["!skip", "!skipsong"],
        desc: {
          pt: "Pula a música atual (não funciona com músicas da playlist padrão).",
          en: "Skips the current song (doesn't work on songs from the default playlist).",
        },
      },
      {
        id: "vol",
        names: ["!vol", "!volume", "!voluma"],
        args: ["number"],
        desc: {
          pt: "Controla o volume da música.",
          en: "Sets the music volume.",
        },
        examples: ["!vol 21"],
      },
      {
        id: "pause",
        names: ["!pause"],
        desc: { pt: "Pausa a música.", en: "Pauses the music." },
      },
      {
        id: "play",
        names: ["!play", "!resume"],
        desc: { pt: "Continua a música.", en: "Resumes the music." },
      },
      {
        id: "songqueue",
        names: ["!songqueue", "!songlist"],
        desc: {
          pt: "Link com a fila completa de músicas.",
          en: "Link to the full song queue.",
        },
        link: "https://streamelements.com/maikodoglas/mediarequest",
      },
    ],
  },
  {
    id: "tts",
    icon: "mic",
    title: { pt: "Texto para fala", en: "Text to Speech" },
    desc: {
      pt: "Escolha um narrador e ele lê sua mensagem em voz alta na live.",
      en: "Pick a narrator and they'll read your message out loud on stream.",
    },
    commands: [
      {
        id: "daniel",
        names: ["!daniel"],
        args: ["message"],
        desc: {
          pt: "O narrador Microsoft Daniel lê sua mensagem.",
          en: "The Microsoft Daniel narrator reads your message.",
        },
        examples: ["!daniel buenas"],
      },
      {
        id: "rugal",
        names: ["!rugal"],
        args: ["message"],
        desc: {
          pt: "A narradora Microsoft Maria lê sua mensagem.",
          en: "The Microsoft Maria narrator reads your message.",
        },
        examples: ["!rugal facilite o uso do computador"],
      },
      {
        id: "sueli",
        names: ["!sueli", "!suelie", "!suelli", "!suelly", "!suely"],
        args: ["message"],
        desc: {
          pt: "A narradora Sueli lê sua mensagem.",
          en: "The Sueli narrator reads your message.",
        },
        examples: ["!sueli duas"],
      },
    ],
  },
  {
    id: "wtp",
    icon: "eye",
    title: { pt: "Who's That Pokémon", en: "Who's That Pokémon" },
    desc: {
      pt: "Minigame de adivinhar o pokémon: mande o nome correto no chat para acertar.",
      en: "Guess-the-pokémon minigame: send the correct name in chat to win.",
    },
    commands: [
      {
        id: "wtp",
        names: ["!wtp"],
        mod: true,
        desc: {
          pt: "Inicia o minigame Who's That Pokémon. Quem enviar o nome do pokémon corretamente acerta.",
          en: "Starts the Who's That Pokémon minigame. Whoever sends the pokémon's name correctly wins.",
        },
      },
      {
        id: "giveup",
        names: ["!giveup"],
        desc: {
          pt: "Revela qual era o pokémon.",
          en: "Reveals which pokémon it was.",
        },
      },
      {
        id: "skipwtp",
        names: ["!skipwtp", "!resetwtp"],
        desc: {
          pt: "Troca o pokémon por outro.",
          en: "Swaps the pokémon for a different one.",
        },
      },
    ],
  },
  {
    id: "lurkbait",
    icon: "fish",
    title: { pt: "Lurk Bait", en: "Lurk Bait" },
    desc: {
      pt: "O jogo de pescaria da live. Veja suas pescas e compare com o chat.",
      en: "The stream's fishing game. Check your catches and compare with chat.",
    },
    commands: [
      {
        id: "stats",
        names: ["!stats"],
        desc: {
          pt: "Mostra as informações das suas pescarias.",
          en: "Shows your fishing stats.",
        },
      },
      {
        id: "leaderboard",
        names: ["!leaderboard"],
        desc: {
          pt: "Mostra o ranking e as melhores pescas.",
          en: "Shows the leaderboard and the best catches.",
        },
      },
      {
        id: "dex",
        names: ["!dex"],
        desc: {
          pt: "Mostra a lista de itens que já foram pescados.",
          en: "Shows the list of items that have been caught so far.",
        },
      },
    ],
  },
  {
    id: "avatars",
    icon: "users",
    title: { pt: "Stream Avatars", en: "Stream Avatars" },
    desc: {
      pt: "Seu bonequinho na tela: faça ações, personalize e jogue minigames com o chat.",
      en: "Your little on-screen character: do actions, customize it and play minigames with chat.",
    },
    groups: [
      { id: "setup", title: { pt: "Começando", en: "Getting started" } },
      { id: "actions", title: { pt: "Ações", en: "Actions" } },
      { id: "avatar", title: { pt: "Avatar", en: "Avatar" } },
      { id: "events", title: { pt: "Eventos", en: "Events" } },
      { id: "minigames", title: { pt: "Minigames", en: "Minigames" } },
      { id: "misc", title: { pt: "Outros", en: "Misc" } },
    ],
    commands: [
      {
        id: "sa",
        group: "setup",
        names: ["!sa"],
        desc: {
          pt: "Link para trocar o seu avatar.",
          en: "Link to change your avatar.",
        },
        link: "https://server.streamavatars.com/viewer.html?channel_id=144711400&platform=twitch",
      },
      // actions
      {
        id: "hug",
        group: "actions",
        names: ["!hug"],
        args: ["user"],
        desc: { pt: "Abraça um usuário.", en: "Hugs a user." },
        examples: ["!hug maikodoglas"],
      },
      {
        id: "attack",
        group: "actions",
        names: ["!attack"],
        args: ["user"],
        desc: { pt: "Ataca um usuário.", en: "Attacks a user." },
        examples: ["!attack maikodoglas"],
      },
      {
        id: "fart",
        group: "actions",
        names: ["!fart"],
        desc: { pt: "Peida no meio da live.", en: "Farts in the middle of the stream." },
      },
      {
        id: "dance",
        group: "actions",
        names: ["!dance"],
        desc: { pt: "Começa a dançar.", en: "Starts dancing." },
      },
      {
        id: "jump",
        group: "actions",
        names: ["!jump"],
        desc: { pt: "Pula.", en: "Jumps." },
      },
      {
        id: "sit",
        group: "actions",
        names: ["!sit"],
        desc: { pt: "Senta.", en: "Sits down." },
      },
      {
        id: "stand",
        group: "actions",
        names: ["!stand"],
        desc: { pt: "Fica de pé novamente.", en: "Stands back up." },
      },
      {
        id: "left",
        group: "actions",
        names: ["!left"],
        args: ["distance"],
        desc: {
          pt: "Anda para a esquerda pela distância informada.",
          en: "Walks left by the given distance.",
        },
        examples: ["!left 30"],
      },
      {
        id: "right",
        group: "actions",
        names: ["!right"],
        args: ["distance"],
        desc: {
          pt: "Anda para a direita pela distância informada.",
          en: "Walks right by the given distance.",
        },
        examples: ["!right 30"],
      },
      // avatar
      {
        id: "color",
        group: "avatar",
        names: ["!color"],
        desc: {
          pt: "Mostra a lista de cores disponíveis e permite trocar a cor do seu avatar.",
          en: "Shows the available colors and lets you change your avatar's color.",
        },
      },
      {
        id: "color-random",
        group: "avatar",
        names: ["!color random"],
        desc: {
          pt: "Equipa uma cor aleatória no seu avatar.",
          en: "Equips a random color on your avatar.",
        },
      },
      {
        id: "gear",
        group: "avatar",
        names: ["!gear"],
        desc: {
          pt: "Mostra a lista de equipamentos disponíveis e permite trocar o equipamento do seu avatar.",
          en: "Shows the available gear and lets you change your avatar's gear.",
        },
      },
      {
        id: "gear-random",
        group: "avatar",
        names: ["!gear random"],
        desc: {
          pt: "Equipa um item aleatório no seu avatar.",
          en: "Equips a random item on your avatar.",
        },
      },
      {
        id: "random",
        group: "avatar",
        names: ["!random"],
        desc: {
          pt: "Troca para um avatar aleatório (entre os que você já possui).",
          en: "Switches to a random avatar (from the ones you already own).",
        },
      },
      {
        id: "buy-avatars",
        group: "avatar",
        names: ["!buy avatars"],
        desc: {
          pt: "Mostra alguns avatares disponíveis para compra.",
          en: "Shows some avatars available to buy.",
        },
      },
      // events
      {
        id: "bomb",
        group: "events",
        names: ["!bomb"],
        desc: { pt: "Solta uma bomba.", en: "Drops a bomb." },
      },
      {
        id: "cheer",
        group: "events",
        names: ["!cheer"],
        desc: { pt: "Comemora.", en: "Celebrates." },
      },
      {
        id: "climb",
        group: "events",
        names: ["!climb"],
        args: ["user"],
        desc: {
          pt: "Sobe e fica em cima de um usuário.",
          en: "Climbs on top of a user.",
        },
        examples: ["!climb maikodoglas"],
      },
      {
        id: "explode",
        group: "events",
        names: ["!explode"],
        args: [{ key: "user", optional: true }],
        desc: {
          pt: "Explode o seu avatar. Informe um usuário para explodir o avatar dele.",
          en: "Blows up your avatar. Add a user to blow up theirs instead.",
        },
        examples: ["!explode", "!explode maikodoglas"],
      },
      {
        id: "firework",
        group: "events",
        names: ["!firework"],
        args: [{ key: "user", optional: true }],
        desc: {
          pt: "Vira um fogo de artifício. Informe um usuário para transformá-lo em um.",
          en: "Turns into a firework. Add a user to turn them into one.",
        },
        examples: ["!firework", "!firework maikodoglas"],
      },
      {
        id: "freeze",
        group: "events",
        names: ["!freeze"],
        args: [{ key: "user", optional: true }],
        desc: {
          pt: "Congela o seu avatar. Informe um usuário para congelar o avatar dele.",
          en: "Freezes your avatar. Add a user to freeze theirs instead.",
        },
        examples: ["!freeze", "!freeze maikodoglas"],
      },
      {
        id: "mass",
        group: "events",
        names: ["!mass"],
        args: ["action"],
        desc: {
          pt: "Faz uma ação em todos os avatares ao mesmo tempo.",
          en: "Performs an action on every avatar at once.",
        },
        examples: ["!mass fart", "!mass firework"],
      },
      {
        id: "scale",
        group: "events",
        names: ["!scale"],
        args: ["size"],
        desc: {
          pt: "Muda o tamanho do seu avatar (2 = duas vezes maior).",
          en: "Changes your avatar's size (2 = twice as big).",
        },
        examples: ["!scale 2"],
      },
      // minigames
      {
        id: "screensaver",
        group: "minigames",
        names: ["!screensaver"],
        args: ["duration"],
        desc: {
          pt: "Todos os avatares entram no modo protetor de tela.",
          en: "All avatars go into screensaver mode.",
        },
        examples: ["!screensaver 30"],
      },
      {
        id: "screensaver-cancel",
        group: "minigames",
        names: ["!screensaver cancel"],
        desc: {
          pt: "Cancela o protetor de tela.",
          en: "Cancels the screensaver.",
        },
      },
      {
        id: "basketball",
        group: "minigames",
        names: ["!basketball"],
        desc: {
          pt: "Inicia uma partida de basquete.",
          en: "Starts a basketball game.",
        },
      },
      {
        id: "basketball-cancel",
        group: "minigames",
        names: ["!basketball cancel"],
        desc: {
          pt: "Cancela a partida de basquete.",
          en: "Cancels the basketball game.",
        },
      },
      {
        id: "duel",
        group: "minigames",
        names: ["!duel"],
        args: ["user", "amount"],
        desc: {
          pt: "Desafia um usuário para um duelo 1x1 valendo avatar coins.",
          en: "Challenges a user to a 1v1 duel for avatar coins.",
        },
        examples: ["!duel maikodoglas 100"],
      },
      {
        id: "bet",
        group: "minigames",
        names: ["!bet"],
        desc: {
          pt: "Aposta na roleta valendo avatar coins.",
          en: "Bets on the roulette for avatar coins.",
        },
      },
      {
        id: "slots",
        group: "minigames",
        names: ["!slots"],
        args: ["amount"],
        desc: {
          pt: "Joga no caça-níquel valendo avatar coins.",
          en: "Plays the slot machine for avatar coins.",
        },
        examples: ["!slots 100"],
      },
      // misc
      {
        id: "currency",
        group: "misc",
        names: ["!currency"],
        desc: {
          pt: "Mostra quantos avatar coins você tem.",
          en: "Shows how many avatar coins you have.",
        },
      },
      {
        id: "roll",
        group: "misc",
        names: ["!roll"],
        desc: {
          pt: "Sorteia um número entre 0 e 100.",
          en: "Rolls a random number between 0 and 100.",
        },
      },
      {
        id: "show",
        group: "misc",
        names: ["!show"],
        desc: {
          pt: "Mostra qual avatar, cor e equipamento você está usando.",
          en: "Shows which avatar, color and gear you are using.",
        },
      },
    ],
  },
  {
    id: "pcg",
    icon: "gamepad",
    title: { pt: "Pokémon Community Game", en: "Pokémon Community Game" },
    desc: {
      pt: "Capture pokémons que aparecem na live, complete sua Pokédex e participe de eventos.",
      en: "Catch pokémon that spawn on stream, complete your Pokédex and join events.",
    },
    commands: [
      {
        id: "pokestart",
        names: ["!pokestart"],
        desc: {
          pt: "Começa sua aventura com 5 pokébolas, 1 great ball e 1 ultra ball.",
          en: "Starts your adventure with 5 poké balls, 1 great ball and 1 ultra ball.",
        },
      },
      {
        id: "pokecatch",
        names: ["!pokecatch"],
        args: [{ key: "ballType", optional: true }],
        desc: {
          pt: "Tenta capturar o pokémon que está aparecendo no canto superior esquerdo.",
          en: "Tries to catch the pokémon showing in the top-left corner.",
        },
        examples: ["!pokecatch", "!pokecatch ultraball"],
      },
      {
        id: "pokeshop",
        names: ["!pokeshop"],
        args: ["item", "quantity"],
        desc: {
          pt: "Compra itens na loja (pokeball, greatball, ultraball…).",
          en: "Buys items from the shop (pokeball, greatball, ultraball…).",
        },
        examples: ["!pokeshop greatball 100"],
      },
      {
        id: "pokepass",
        names: ["!pokepass", "!pokebank"],
        desc: {
          pt: "Mostra seu saldo e suas estatísticas de batalha.",
          en: "Shows your balance and battle stats.",
        },
      },
      {
        id: "pokebuddy",
        names: ["!pokebuddy"],
        desc: {
          pt: "Exibe o seu pokémon parceiro.",
          en: "Shows off your buddy pokémon.",
        },
      },
      {
        id: "pokedex",
        names: ["!pokedex"],
        args: [{ key: "genOrType", optional: true }],
        desc: {
          pt: "Mostra o progresso da sua Pokédex.",
          en: "Shows your Pokédex completion.",
        },
      },
      {
        id: "pokecheck",
        names: ["!pokecheck"],
        args: ["pokemon"],
        desc: {
          pt: "Verifica se você já capturou um pokémon (nome ou número). Se você já tiver, o bot não responde.",
          en: "Checks whether you've already caught a pokémon (name or ID). If you have it, the bot doesn't reply.",
        },
      },
      {
        id: "pokemon",
        names: ["!pokemon"],
        args: ["pokemon"],
        desc: {
          pt: "Mostra o tier, os atributos e as vantagens de tipo de um pokémon.",
          en: "Shows a pokémon's tier, stats and type effectiveness.",
        },
      },
      {
        id: "recent",
        names: ["!recent"],
        args: ["pokemon"],
        desc: {
          pt: "Mostra quando um pokémon apareceu pela última vez.",
          en: "Shows when a pokémon last spawned.",
        },
      },
      {
        id: "pokeraid",
        names: ["!pokeraid"],
        desc: {
          pt: "Se houver um evento acontecendo, mostra o progresso da raid.",
          en: "If an event is happening, shows the raid progress.",
        },
      },
      {
        id: "pokegift",
        names: ["!pokegift"],
        desc: {
          pt: "Abre seu presente junto com o chat (é preciso ter um no inventário).",
          en: "Opens your present together with chat (you need one in your inventory).",
        },
      },
      {
        id: "pokegift-rare",
        names: ["!pokegift rare"],
        desc: {
          pt: "Abre seu presente raro junto com o chat (é preciso ter um no inventário).",
          en: "Opens your rare present together with chat (you need one in your inventory).",
        },
      },
      {
        id: "pokedaily",
        names: ["!pokedaily"],
        desc: {
          pt: "Resgata sua recompensa diária no Discord do PCG.",
          en: "Claims your daily reward on the PCG Discord.",
        },
      },
      {
        id: "pokeloyalty",
        names: ["!pokeloyalty"],
        desc: {
          pt: "Mostra seu nível de lealdade na live.",
          en: "Shows your loyalty level on the stream.",
        },
      },
    ],
  },
];

export const totalCommands = categories.reduce(
  (n, c) => n + c.commands.length,
  0,
);

// Grava vídeos verticais (1080x1920, MP4) de gameplay para Reels, TikTok e Shorts.
//
// Uso:
//   npm run record:demo                         grava os três vídeos do site publicado
//   npm run record:demo -- --sem-resposta       o jogador misterioso para antes do acerto
//   npm run record:demo -- --jogos=misterioso --idioma=en --site=http://localhost:3000
//
// Opções: --jogos=misterioso,bingo,home  --idioma=pt|en|es  --site=URL  --saida=pasta (padrão: videos/)
// Precisa do Google Chrome (ou CHROME_PATH apontando para ele) e do ffmpeg instalados.
// O vídeo do jogador misterioso mostra a resposta do dia: poste depois da virada (meia-noite em Brasília).

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright-core";
import type { BrowserContext, Page } from "playwright-core";
import { bingoCriteria, csPlayers, playerMatchesCriterion } from "../src/data/csBingoDatabase.ts";
import type { CsPlayer } from "../src/data/csBingoDatabase.ts";
import { getGameDateKey, getPuzzleNumber, seededShuffle } from "../src/lib/daily.ts";

const options = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, "").split("=");
    return [key, value ?? "true"];
  })
);
const SITE = (options.site ?? "https://csgo-games.com").replace(/\/$/, "");
const LANGUAGE = options.idioma ?? "pt";
const OUT = resolve(options.saida ?? "videos");
const GAMES = (options.jogos ?? "misterioso,bingo,home").split(",");
const REVEAL = options["sem-resposta"] !== "true";
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";
// Mesmo texto que o bingo mostra no botão de pular, por idioma.
const SKIP_LABEL = { pt: /Pular/i, en: /Skip/i, es: /Saltar/i }[LANGUAGE] ?? /Pular/i;
const COMBO_JOINER = { pt: " e ", en: " and ", es: " y " }[LANGUAGE] ?? " e ";

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));
const dateKey = getGameDateKey();

// Mesmo sorteio da página do jogador misterioso (src/app/jogador-misterioso/page.tsx).
const mysteryTarget = () => {
  const candidates = csPlayers.filter((player) => player.hltvTop20Years.length > 0 || player.majorsWon > 0);
  const order = seededShuffle(candidates, 4242);
  const puzzle = getPuzzleNumber(dateKey);
  return order[(((puzzle - 1) % order.length) + order.length) % order.length];
};

// Palpites que "esquentam": três nomes conhecidos com cada vez mais pistas em comum com o alvo.
const warmingGuesses = (target: CsPlayer) => {
  const similarity = (guess: CsPlayer) =>
    Number(guess.nationality === target.nationality) +
    Number(guess.region === target.region) +
    Number(guess.roles.some((role) => target.roles.includes(role))) +
    Number(Math.abs(guess.majorsWon - target.majorsWon) <= 1) +
    Number(Math.abs(guess.hltvTop20Years.length - target.hltvTop20Years.length) <= 1) +
    Number(Boolean(guess.currentTeam && target.teams.includes(guess.currentTeam)));
  const known = csPlayers
    .filter((player) => player.id !== target.id && (player.hltvTop20Years.length >= 2 || player.majorsWon > 0))
    .map((player) => ({ player, score: similarity(player) }))
    .sort((a, b) => a.score - b.score || a.player.nickname.localeCompare(b.player.nickname));
  const pick = (score: number) => known.find((entry) => entry.score >= score)?.player;
  return [pick(1), pick(3), pick(5)].filter((player): player is CsPlayer => Boolean(player));
};

// Grava pelo screencast do Chrome (quadros JPEG com horário) e monta o MP4 com o ffmpeg.
const record = async (name: string, script: (page: Page) => Promise<void>) => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const context: BrowserContext = await browser.newContext({
    viewport: { width: 540, height: 960 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await context.addInitScript((language) => localStorage.setItem("cs-bingo-language", language), LANGUAGE);
  const page = await context.newPage();
  const framesDir = join(OUT, `.frames-${name}`);
  rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });

  const frames: { file: string; time: number }[] = [];
  const cdp = await context.newCDPSession(page);
  cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
    const file = join(framesDir, `${String(frames.length).padStart(5, "0")}.jpg`);
    writeFileSync(file, Buffer.from(data, "base64"));
    frames.push({ file, time: metadata.timestamp ?? Date.now() / 1000 });
    await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1080, maxHeight: 1920 });

  await script(page);

  // O Chrome só manda quadro quando a tela muda: o último dura até o fim da gravação.
  const stoppedAt = Date.now() / 1000;
  await cdp.send("Page.stopScreencast").catch(() => {});
  await browser.close();

  const list = frames
    .map((frame, index) => `file '${frame.file}'\nduration ${((frames[index + 1]?.time ?? stoppedAt) - frame.time).toFixed(3)}`)
    .join("\n");
  writeFileSync(join(framesDir, "list.txt"), `${list}\nfile '${frames.at(-1)!.file}'\n`);
  const output = join(OUT, `cs-games-${name}-${dateKey}-${LANGUAGE}.mp4`);
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", join(framesDir, "list.txt"),
    "-vf", "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0e1114,fps=30,format=yuv420p",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-movflags", "+faststart", output,
  ]);
  rmSync(framesDir, { recursive: true, force: true });
  console.log(`✓ ${output}`);
};

mkdirSync(OUT, { recursive: true });

if (GAMES.includes("misterioso")) {
  const target = mysteryTarget();
  const guesses = [...warmingGuesses(target), ...(REVEAL ? [target] : [])];
  console.log(`Jogador misterioso de ${dateKey}: palpites ${guesses.map((player) => player.nickname).join(" → ")}`);
  await record("misterioso", async (page) => {
    await page.goto(`${SITE}/jogador-misterioso`, { waitUntil: "networkidle" });
    await sleep(1500);
    for (const guess of guesses) {
      await page.click("input");
      await page.type("input", guess.nickname, { delay: 140 });
      await sleep(500);
      await page.keyboard.press("Enter");
      await sleep(2200);
    }
    await sleep(3500);
  });
}

if (GAMES.includes("bingo")) {
  // As casas trazem o critério no aria-label ("AWPer e Top 20 5+ vezes"); em português os rótulos
  // batem com bingoCriteria, nos outros idiomas o roteiro só pula quando não reconhece a casa.
  const criterionByLabel = new Map(bingoCriteria.map((criterion) => [criterion.label.toLowerCase(), criterion]));
  await record("bingo", async (page) => {
    await page.goto(`${SITE}/bingo`, { waitUntil: "networkidle" });
    await sleep(2000);
    for (let turn = 0; turn < 14; turn += 1) {
      const nickname = (await page.textContent("main h1").catch(() => ""))?.trim().toLowerCase();
      const player = csPlayers.find((candidate) => candidate.nickname.toLowerCase() === nickname);
      if (!player) break;
      const cells = await page.$$eval("main button[aria-label][title]:not([disabled])", (elements) =>
        elements.map((element) => element.getAttribute("aria-label") ?? "")
      );
      const fitIndex = cells.findIndex((label) =>
        label
          .split(COMBO_JOINER)
          .map((part) => criterionByLabel.get(part.trim().toLowerCase()))
          .every((criterion) => criterion && playerMatchesCriterion(player, criterion))
      );
      if (fitIndex >= 0) {
        await page.locator("main button[aria-label][title]:not([disabled])").nth(fitIndex).tap();
      } else {
        await page.getByRole("button", { name: SKIP_LABEL }).tap();
      }
      await sleep(fitIndex >= 0 ? 1700 : 1000);
    }
    await sleep(2500);
  });
}

if (GAMES.includes("home")) {
  await record("home", async (page) => {
    await page.goto(SITE, { waitUntil: "networkidle" });
    await sleep(4000);
  });
}

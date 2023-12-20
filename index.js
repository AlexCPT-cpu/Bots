import { Telegraf } from "telegraf";
import Moralis from "moralis";
import axios from "axios";

await Moralis.start({
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijc0NjJkOTA1LTMzZDgtNGMxYy05ODJkLThkYmZmYmZkMDc4OSIsIm9yZ0lkIjoiODkxMzYiLCJ1c2VySWQiOiI4ODc3OCIsInR5cGVJZCI6IjRhYThmZTMwLWY0YWMtNDdhYS05YzdlLTc2ZTI4MmMzZDMzMyIsInR5cGUiOiJQUk9KRUNUIiwiaWF0IjoxNjgzMTcxMTQyLCJleHAiOjQ4Mzg5MzExNDJ9.Q0HfaFYwVARrK_oKRxZIumVAHPm5A8PylGxikZVQ_7Y",
});
const token = "6845451327:AAFA7RAmhygELWhENC39Y-k7YA8HqKKEB6o";
const bot = new Telegraf(token);

bot.command("details", async (ctx) => {
  try {
    // const { data } = await axios.get(
    //   `https://api.coingecko.com/api/v3/coins/eth/contract/${contract}/market_chart/?vs_currency=usd&days=30`
    // );
    //    ctx.reply(`latest price: $ ${first[1]} 30D price: $ ${last[1]}`);

    const userInput = ctx.message.text; // Get the user's input
    const addressRegex = /\/details (\b0x[0-9a-fA-F]{40}\b)/; // Regex pattern for Ethereum addresses

    // Check if the user input matches the address pattern
    const match = userInput.match(addressRegex);
    if (match) {
      const address = match[1]; // Extract the address
      const { data } = await axios.get(
        `https://api.geckoterminal.com/api/v2/networks/eth/tokens/${address}/pools?page=1`
      );

      const values = data.data[0];
      ctx.replyWithHTML(
        `<b>${values.attributes.name}</b> \n <b>Price:</b> $${Number(
          values.attributes.token_price_usd
        ).toFixed(4)} \n <b>DEX:</b> ${
          values.relationships.dex.data.id
        } \n <b>24hr Change:</b> ${
          values.attributes.price_change_percentage.h24
        }% \n \<b>24h Volume:</b> $${Number(
          values.attributes.volume_usd.h24
        ).toLocaleString()} \n <b>Market Cap:\</b> $${Number(
          values.attributes.market_cap_usd
        ).toLocaleString()} \n <b>Total Liquidity:</b> $${Number(
          values.attributes.reserve_in_usd
        ).toLocaleString()} \n <b>24h Buys:</b> ${
          values.attributes.transactions.h24.buys
        } \n <b>24h Sells:</b> ${
          values.attributes.transactions.h24.sells
        } \n 🚀🚀
  `,
        { parse_mode: "HTML" }
      );
    } else {
      ctx.reply("No Ethereum address found in the command");
    }
  } catch (err) {
    console.log(err);
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
// bot.on("message", async (msg) => {
//   const chatId = msg.chat.id;
//   const messageText = msg.text;

//   if (messageText === "/start") {
//     //bot.sendMessage(chatId, "Welcome to the bot!");

//   }
// });

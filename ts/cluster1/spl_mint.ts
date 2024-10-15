import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../Turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("2Pq9Faj9V6YrQaUP3mnHEAxRbfhjw13iS7mxymVks2xM");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(connection, keypair, mint, ata.address, keypair.publicKey,1n * token_decimals);
        console.log(`Your mint txid: ${mintTx}`);
        // Get total amount of tokens
        const totalSupply = await connection.getTokenSupply(mint);
        console.log(`Your totalSupply: ${totalSupply.value.amount}`);

        // Get balance of dev wallet of minted tokens
        const ata2 = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your balance: ${ata2.amount}`);

    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

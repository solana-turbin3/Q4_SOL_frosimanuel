import wallet from "../Turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("2Pq9Faj9V6YrQaUP3mnHEAxRbfhjw13iS7mxymVks2xM")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint: mint,
            mintAuthority: signer,
        }

         let data: DataV2Args = {
            name: "I WILL PUMP",
            symbol: "IWP",
            uri: "https://ipfs.io/ipfs/QmdK52CxCM3W8PSFgfqdFECEYjhK3u3sPprXZQzsGDR28v",
            sellerFeeBasisPoints: 500,
            creators: null,
            collection: null,
            uses: null
        }

         let args: CreateMetadataAccountV3InstructionArgs = {
            data: data,
            isMutable: false,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
             {
                 ...accounts,
                 ...args
             }
            ) 
        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

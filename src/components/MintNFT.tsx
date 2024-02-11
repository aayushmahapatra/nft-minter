import { useState, useEffect } from "react";
import { connectWallet, connectMetaMask } from "../utils/connectWallet";
import { upload } from "@spheron/browser-upload";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link,
  Grid,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import PreviewNFT from "../assets/nft.png";
import { BACKEND_ADDR } from "../config";
import { truncateString } from "../utils/truncateString";
import NFTs from "./NFTs";

function MintNFT() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [ipfsLink, setIpfsLink] = useState<string>("");
  const [imageStatus, setImageStatus] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<any>(PreviewNFT);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [userNfts, setUserNfts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { signer, contract } = await connectWallet();
      const nfts = await contract.fetchUserNfts(signer.getAddress());

      const decodedNFTs: any[] = await Promise.all(
        nfts.map(async (nft: any) => {
          const nftUri = await contract.tokenURIs(nft.toNumber());
          const base64Json = nftUri.split(",")[1];
          const jsonString = atob(base64Json);
          const jsonObject = JSON.parse(jsonString);
          return jsonObject;
        })
      );
      setUserNfts(decodedNFTs);
    })();
  }, []);

  const handleConnectMetaMask = async () => {
    const { address, formattedBalance } = await connectMetaMask();
    setWalletAddress(address);
    setWalletBalance(formattedBalance);
  };

  const handleImageChange = (e: any) => {
    setImage(e.target.files[0]);
    setImageStatus("Image selected for upload");
    setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
  };

  const mint = async () => {
    setStatus("Uploading to IPFS using Spheron...");
    const response = await fetch(`${BACKEND_ADDR}/initiate-upload`);
    const resJson = await response.json();

    const uploadResult = await upload([image], {
      token: resJson.uploadToken,
    });

    setIpfsLink(`${uploadResult.protocolLink}/${image.name}`);

    setStatus("Minting NFT...");
    setLoading(true);
    const { signer, contract } = await connectWallet();
    const tokenURI = `data:application/json;base64,${btoa(
      JSON.stringify({
        name,
        description,
        image: `${uploadResult.protocolLink}/${image.name}`,
      })
    )}`;

    const transaction = await contract.mintNft(signer.getAddress(), tokenURI);
    await transaction.wait();

    setTransactionHistory((prevHistory) => [...prevHistory, transaction.hash]);

    setStatus("NFT minted!");
    setAlertOpen(true);
    setLoading(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          color="text.secondary"
        >
          Polygon Mumbai Testnet
        </Typography>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          NFT Minter
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            mt={2}
            sx={{
              border: "1px solid #999",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Uploaded preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Typography variant="caption" color="text.secondary">
                Preview image will be displayed here
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleConnectMetaMask}
              size="small"
              disabled={!!walletAddress}
              sx={{
                fontWeight: "bold",
                "&.Mui-disabled": {
                  cursor: "not-allowed",
                  opacity: 0.8,
                  color: "white",
                },
              }}
              style={{
                background:
                  "linear-gradient(90deg, hsla(188, 75%, 61%, 1) 0%, hsla(208, 71%, 42%, 1) 100%)",
              }}
            >
              {walletAddress
                ? `${truncateString(
                    String(walletAddress)
                  )} - ${walletBalance} SHM`
                : "Connect Wallet"}
            </Button>
          </Box>
          <TextField
            fullWidth
            label="NFT Name"
            variant="outlined"
            color="secondary"
            margin="normal"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="NFT Description"
            variant="outlined"
            color="secondary"
            margin="normal"
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            style={{ display: "none" }}
            id="image-upload"
            onChange={handleImageChange}
          />
          <p></p>
          <label htmlFor="image-upload">
            <Button
              variant="contained"
              color="secondary"
              component="span"
              sx={{ fontWeight: "bold", fontSize: 12 }}
              style={{
                background:
                  "linear-gradient(90deg, hsla(188, 75%, 61%, 1) 0%, hsla(208, 71%, 42%, 1) 100%)",
              }}
            >
              Upload Image
            </Button>
          </label>
          {imageStatus && (
            <Typography variant="caption" display="block" gutterBottom>
              {imageStatus}
            </Typography>
          )}
          <Box mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ fontWeight: "bold" }}
              style={{
                background:
                  "linear-gradient(90deg, hsla(188, 75%, 61%, 1) 0%, hsla(208, 71%, 42%, 1) 100%)",
              }}
              onClick={mint}
            >
              Mint NFT
            </Button>
          </Box>
          {loading && <LinearProgress color="secondary" />}

          <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={() => setAlertOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setAlertOpen(false)}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              NFT minted successfully!
            </Alert>
          </Snackbar>

          <Box mt={2}>
            <Typography color="textSecondary">{status}</Typography>
            {ipfsLink && (
              <Typography align="left">
                <b>IPFS Link:</b>{" "}
                <Link href={ipfsLink} target="_blank" rel="noopener noreferrer">
                  {ipfsLink}
                </Link>
              </Typography>
            )}
          </Box>
          <Box mt={4}>
            <Typography variant="h6">
              <b>Transaction History:</b>
            </Typography>
            {transactionHistory.length > 0 ? (
              transactionHistory.map((hash, index) => (
                <Box key={index} mt={1}>
                  <Link
                    href={`https://mumbai.polygonscan.com/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="secondary"
                  >
                    {`Transaction ${index + 1}: ${hash}`}
                  </Link>
                </Box>
              ))
            ) : (
              <Typography mt={1}>No transactions yet.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
      <Typography
        mt={9}
        variant="h2"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        My NFTs
      </Typography>
      <Grid container spacing={4}>
        {userNfts.map((nft, i) => (
          <NFTs key={i} nft={nft} />
        ))}
      </Grid>
    </Container>
  );
}

export default MintNFT;

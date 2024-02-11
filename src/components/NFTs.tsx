import { FC } from "react";
import { Box, Grid, Typography } from "@mui/material";

interface INFTs {
  nft: any;
}

const NFTs: FC<INFTs> = ({ nft }) => {
  return (
    <>
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
          {nft ? (
            <img
              src={nft.image}
              alt="Uploaded preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              Image will be displayed here
            </Typography>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box mt={4}>
          <Typography variant="h6">
            <b>{nft.name}</b>
          </Typography>
          <Typography mt={1}>{nft.description}</Typography>
        </Box>
      </Grid>
    </>
  );
};

export default NFTs;

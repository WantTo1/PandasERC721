import { useState } from "react";
import { Container, Grid, Typography, Button, TextField, Card, CardContent, CardMedia } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSpring, animated } from 'react-spring';
import styles from './MintPage.module.css';
import detectEthereumProvider from '@metamask/detect-provider';
import { InjectedConnector } from '@web3-react/injected-connector';
import MyNFT from './contracts/MyNFT.json';

const injectedConnector = new InjectedConnector({ supportedChainIds: [97] });


const MintPage = () => {

  const { activate, active, account, library, deactivate } = useWeb3React();

  const [isLoading, setIsLoading] = useState(false);


  const handleMint = async () => {
    if (!library || !account) {
      alert('Please connect your wallet first.');
      return;
    }

    setIsLoading(true);
    try {
      const contractAddress = '0x079849051AD2cEDc30BbBDd9b2e4ed2C7Dd471c4';
      const contract = new ethers.Contract(contractAddress, MyNFT.abi, library.getSigner());
      const cost = ethers.utils.parseEther('0.001');

      const transaction = await contract.safeMint(account, { value: cost });
      await transaction.wait();

      console.log('Minting successful');
    } catch (error) {
      console.error('Minting failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await activate(injectedConnector);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  return (
    <Container sx={{ mt: 5 }}>
      <animated.div style={fadeIn}>
        <Typography variant="h4" className={styles.title}>
          Pandas Roly-Poly Mint
        </Typography>
        <Grid container sx={{ mt: 5 }} spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardMedia
                component="img"
                height="500"
                image={`${process.env.PUBLIC_URL}/icon3.png`} // Замените это ссылкой на изображение вашего NFT
                alt="NFT Image"
              />
              <CardContent>
                <Typography variant="h6">Pandas Roly-Poly</Typography>
                <Button sx={{ mt: 2 }}
                  variant="outlined"
                  color="secondary"
                  onClick={handleConnectWallet}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  Connect Wallet
                </Button>
                <Button sx={{ mt: 2, ml: 34 }}
                  variant="outlined"
                  color="primary"
                  onClick={handleMint}
                  className={`${styles.button} ${styles.buttonPrimary}`}
                >
                  Mint NFT
                </Button>

              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </animated.div>
    </Container>
  );
};

export default MintPage;
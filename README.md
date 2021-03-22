mint-bitcoin-script
==========

This module contains Bitcoin Script generating utilities for NodeJS used by [MakiPool Mining Pool](https://makipool.com).

## Install ##
__Install as Dependency in NodeJS Project__
```bash
# Install from Github NPM repository

npm config set @makipool:registry https://npm.pkg.github.com/makipool
npm config set //npm.pkg.github.com/:_authToken <PERSONAL_ACCESS_TOKEN>

npm install @makipool/mint-bitcoin-script@1.0.1 --save
```
[Creating a personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)

__Install & Test__
```bash
# Install nodejs v10
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install nodejs -y

# Download mint-bitcoin-script
git clone https://github.com/MakiPool/mint-bitcoin-script

# build & test
cd mint-bitcoin-script
npm install
npm test
``` 
import { createToken } from './createToken';

createToken()
    .then(tokenAddress => console.log('Token created:', tokenAddress))
    .catch(error => console.error('Error creating token:', error.message));

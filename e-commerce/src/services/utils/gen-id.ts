import { randomBytes } from 'crypto';

export const genId = () => {
	return randomBytes(3).toString('hex');
};

export const genToken = () => {
	return randomBytes(6).toString('hex')
}
